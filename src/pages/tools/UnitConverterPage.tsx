import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ToolPageHeader from '../../components/tools/ToolPageHeader';
import CategorySelector from '../../components/tools/converter/CategorySelector';
import ConversionInput from '../../components/tools/converter/ConversionInput';
import ConversionResult from '../../components/tools/converter/ConversionResult';
import { categories, getCategory } from '../../utils/conversions/definitions';
import type { CategoryId, Unit } from '../../utils/conversions/definitions';
import { convert, normalizeDecimal, parseValue } from '../../utils/conversions/convert';
import { formatResult } from '../../utils/conversions/formatResult';
import type { Precision } from '../../utils/conversions/formatResult';
import '../../styles/converter.css';

export default function UnitConverterPage() {
  const [categoryId, setCategoryId] = useState<CategoryId>('length');
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('cm');
  const [input, setInput] = useState('1');
  const [precision, setPrecision] = useState<Precision>('auto');
  const category = getCategory(categoryId);
  const parsed = parseValue(input);
  const conversion = parsed.value === null ? null : convert(parsed.value, categoryId, from, to);
  const result = conversion?.value == null ? '' : formatResult(conversion.value, precision);
  const changeCategory = (id: CategoryId) => {
    setCategoryId(id);
    const defaults = getCategory(id).defaults;
    setFrom(defaults[0]); setTo(defaults[1]);
  };
  const unitName = (unit: Unit, value: number) => categoryId === 'temperature' ? unit.symbol : Math.abs(value) === 1 ? unit.name : unit.plural;
  const fromUnit = category.units.find(unit => unit.id === from)!;
  const toUnit = category.units.find(unit => unit.id === to)!;
  const equivalence = result && parsed.value !== null && conversion?.value !== null && conversion?.value !== undefined
    ? `${formatResult(parsed.value)} ${unitName(fromUnit, parsed.value)} = ${result} ${unitName(toUnit, conversion.value)}` : '';
  return <><a href="#main" className="skip-link">Saltar al contenido</a><Navbar/><main id="main" className="converter-page"><div className="container"><ToolPageHeader title="Conversor de unidades" description="Convierte rápidamente unidades de longitud, área, volumen, masa, temperatura, velocidad y presión." note="Los cálculos se realizan directamente en tu navegador."/><section className="converter-card" aria-labelledby="converter-heading"><div className="converter-card-heading"><h2 id="converter-heading">Elige qué quieres convertir</h2><span>{categories.length} categorías · {categories.reduce((total, item) => total + item.units.length, 0)} unidades</span></div><CategorySelector value={categoryId} onChange={changeCategory}/><div className="converter-stage" key={categoryId}><ConversionInput value={input} onChange={value => setInput(normalizeDecimal(value))} unit={from} units={category.units} onUnitChange={setFrom}/><button className="converter-swap" type="button" aria-label="Intercambiar unidades" title="Intercambiar unidades" onClick={() => { setFrom(to); setTo(from); }}><ArrowLeftRight size={22} aria-hidden="true"/></button><ConversionResult result={result} unit={to} units={category.units} onUnitChange={setTo}/></div><div className="converter-bottom"><label htmlFor="converter-precision">Decimales<select id="converter-precision" value={precision} onChange={event => setPrecision(event.target.value as Precision)}><option value="auto">Automático</option><option value="2">2</option><option value="4">4</option><option value="6">6</option></select></label><p className="converter-equivalence" aria-live="polite">{equivalence}</p></div><p id="converter-validation" className="converter-validation" role="status">{parsed.error || conversion?.error || conversion?.warning || (!input.trim() ? 'Escribe un valor para comenzar.' : '')}</p></section></div></main><Footer/></>;
}
