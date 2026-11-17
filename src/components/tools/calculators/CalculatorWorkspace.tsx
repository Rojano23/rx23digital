import { parseMoneyField } from '../../../utils/calculators/money';
import { useEffect, useState } from 'react';
import type { Calculation, CalculatorDefinition } from '../../../utils/calculators/definitions';
import { calculate } from '../../../utils/calculators/definitions';
import { normalizeNumber, parseAmount } from '../../../utils/calculators/validation';
import type { VatMode } from '../../../utils/calculators/vat';
import CalculatorField from './CalculatorField';
import ResultPanel from './ResultPanel';
export default function CalculatorWorkspace({ definition }: { definition: CalculatorDefinition }) {
  const [fields, setFields] = useState<Record<string, string>>(() => Object.fromEntries(definition.fields.map(field => [field.id, field.initial ?? ''])));
  const [vatMode, setVatMode] = useState<VatMode>('add');
  const [second, setSecond] = useState(false);
  const [message, setMessage] = useState('');
  const activeFields = [...definition.fields, ...(second ? [{ id: 'second', label: 'Segundo descuento', kind: 'percent' as const }] : [])];
  const parsed = activeFields.map(field => ({ id: field.id, ...(field.kind === 'money' ? parseMoneyField(fields[field.id] ?? '') : parseAmount(fields[field.id] ?? '')) }));
  const parseError = parsed.find(field => field.error)?.error ?? '';
  const complete = parsed.every(field => field.value !== null);
  let error = parseError;
  let result: Calculation | null = null;
  if (!parseError && complete) {
    try { result = calculate(definition.id, Object.fromEntries(parsed.map(field => [field.id, field.value!])), vatMode, second); }
    catch (cause) { error = cause instanceof Error ? cause.message : 'Revisa los datos introducidos.'; }
  }
  useEffect(() => {
    const timeout = setTimeout(() => setMessage(error), 600);
    return () => clearTimeout(timeout);
  }, [error]);
  return <div className="business-workspace"><div className="business-form-panel"><h2>{definition.name}</h2><form onSubmit={event => event.preventDefault()} autoComplete="off">{definition.id === 'vat' && <div className="business-vat-mode" role="group" aria-label="Modo de IVA">{(['add', 'remove'] as const).map(mode => <button type="button" key={mode} aria-pressed={vatMode === mode} onClick={() => setVatMode(mode)}>{mode === 'add' ? 'Agregar IVA' : 'Quitar IVA'}</button>)}</div>}<div className="business-fields">{activeFields.map(field => <CalculatorField key={field.id} field={field} value={fields[field.id] ?? ''} onChange={value => setFields(previous => ({ ...previous, [field.id]: field.kind === 'money' ? value : normalizeNumber(value) }))}/>)}</div>{definition.id === 'discount' && <label className="business-checkbox" htmlFor="business-second-enabled"><input id="business-second-enabled" type="checkbox" checked={second} onChange={event => setSecond(event.target.checked)}/>Agregar segundo descuento</label>}<p className="business-validation" id="business-validation" role="status">{message === error ? message : ''}</p></form><aside className="business-explanation"><h3>¿Qué significa?</h3><p>{definition.explanation}</p></aside></div><ResultPanel result={result}/></div>;
}
