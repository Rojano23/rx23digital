import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ToolPageHeader from '../../components/tools/ToolPageHeader';
import CalculatorSelector from '../../components/tools/calculators/CalculatorSelector';
import CalculatorWorkspace from '../../components/tools/calculators/CalculatorWorkspace';
import { calculators } from '../../utils/calculators/definitions';
import type { CalculatorId } from '../../utils/calculators/definitions';
import '../../styles/business-calculators.css';
export default function BusinessCalculatorPage() {
  const [selected, setSelected] = useState<CalculatorId>('price');
  const definition = calculators.find(calculator => calculator.id === selected)!;
  return <><a href="#main" className="skip-link">Saltar al contenido</a><Navbar/><main id="main" className="business-page"><div className="container"><ToolPageHeader title="Calculadoras para negocios" description="Herramientas sencillas para calcular precios, márgenes, IVA, descuentos y punto de equilibrio de tu negocio." note="Los cálculos se realizan directamente en tu navegador. RX23 Digital no recibe ni almacena la información que ingreses."/><section className="business-card" aria-label="Calculadoras para negocios"><CalculatorSelector selected={selected} onChange={setSelected}/><CalculatorWorkspace key={selected} definition={definition}/></section><p className="business-disclaimer">Estas herramientas realizan cálculos orientativos. No sustituyen asesoría contable, fiscal o financiera profesional.</p></div></main><Footer/></>;
}
