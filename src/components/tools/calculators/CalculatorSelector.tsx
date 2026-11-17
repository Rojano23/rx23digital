import { calculators } from '../../../utils/calculators/definitions';
import type { CalculatorId } from '../../../utils/calculators/definitions';
export default function CalculatorSelector({ selected, onChange }: { selected: CalculatorId; onChange: (id: CalculatorId) => void }) {
  return <div className="business-selector" role="group" aria-label="Calculadora">{calculators.map(calculator => <button key={calculator.id} type="button" aria-pressed={selected === calculator.id} onClick={() => onChange(calculator.id)}>{calculator.name}</button>)}</div>;
}
