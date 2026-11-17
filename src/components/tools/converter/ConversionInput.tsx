import type { Unit } from '../../../utils/conversions/definitions';
import UnitSelector from './UnitSelector';
export default function ConversionInput({ value, onChange, unit, units, onUnitChange }: { value: string; onChange: (value: string) => void; unit: string; units: readonly Unit[]; onUnitChange: (value: string) => void }) {
  return <div className="converter-side"><span className="converter-direction">DE</span><label htmlFor="converter-value">Valor<input id="converter-value" type="text" inputMode="decimal" autoComplete="off" spellCheck={false} maxLength={300} value={value} placeholder="Escribe un valor" aria-describedby="converter-validation" onChange={event => onChange(event.target.value)}/></label><UnitSelector id="converter-from" label="Unidad de origen" units={units} value={unit} onChange={onUnitChange}/></div>;
}
