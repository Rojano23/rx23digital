import { categories } from '../../../utils/conversions/definitions';
import type { CategoryId } from '../../../utils/conversions/definitions';
export default function CategorySelector({ value, onChange }: { value: CategoryId; onChange: (value: CategoryId) => void }) {
  return <div className="converter-categories" role="group" aria-label="Categoría de conversión">{categories.map(category => <button type="button" key={category.id} aria-pressed={value === category.id} onClick={() => onChange(category.id)}>{category.name}</button>)}</div>;
}
