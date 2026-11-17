import type { Unit } from '../../../utils/conversions/definitions';
export default function UnitSelector({ id, label, units, value, onChange }: { id: string; label: string; units: readonly Unit[]; value: string; onChange: (value: string) => void }) {
  return <label htmlFor={id}>{label}<select id={id} value={value} onChange={event => onChange(event.target.value)}>{units.map(unit => <option key={unit.id} value={unit.id}>{unit.name.charAt(0).toUpperCase() + unit.name.slice(1)} ({unit.symbol})</option>)}</select></label>;
}
