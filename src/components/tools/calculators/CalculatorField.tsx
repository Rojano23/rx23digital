import { useState } from 'react';
import type { CalculatorField as Field } from '../../../utils/calculators/definitions';
import { formatMoneyInput, parseMoneyInput, stripMoneyPrefix } from '../../../utils/calculators/money';
export default function CalculatorField({ field, value, onChange }: { field: Field; value: string; onChange: (value: string) => void }) {
  const [presentation, setPresentation] = useState<{ raw: string; display: string } | null>(null);
  const id = `business-${field.id}`;
  const money = field.kind === 'money';
  // Formatting is presentation-only. Focus never replaces text or selection;
  // only an actual edit replaces the original, unrounded value in the formulas.
  const display = money && presentation?.raw === value ? presentation.display : value;
  return <label className="business-field" htmlFor={id}>{field.label}<span className={`business-input ${field.kind}`}><span aria-hidden="true">{money ? '$' : '%'}</span><input id={id} type="text" inputMode="decimal" autoComplete="off" spellCheck={false} maxLength={64} value={display} placeholder="0.00" aria-describedby="business-validation" onBlur={() => {
    if (!money) return;
    const parsed = parseMoneyInput(value);
    if (parsed !== null) setPresentation({ raw: value, display: formatMoneyInput(parsed) });
  }} onChange={event => { setPresentation(null); onChange(money ? stripMoneyPrefix(event.target.value) : event.target.value); }}/></span></label>;
}
