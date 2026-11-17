import HomePanelPage from './pages/HomePanelPage';
import { homePanel } from './data/products';
import useReveal from './hooks/motion/useReveal';
import './styles/motion.css';
import useHomeSectionScroll from './hooks/useHomeSectionScroll';
import { currentPath, homeSectionHref } from './config/routes';
import { services, serviceLegacySlugs } from './data/services';
import { labs } from './data/labs';
import ServiceDetailPage from './pages/ServiceDetailPage';
import LabDetailPage from './pages/LabDetailPage';
import './styles/services-labs.css';
import './styles/showcase-sections.css';
import { lazy, Suspense } from 'react';
const QrGeneratorPage = lazy(() => import('./pages/tools/QrGeneratorPage'));
const UnitConverterPage = lazy(() => import('./pages/tools/UnitConverterPage'));
const BusinessCalculatorPage = lazy(() => import('./pages/tools/BusinessCalculatorPage'));
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import OwnProjects from './components/OwnProjects';
import Portfolio from './components/Portfolio';
import FreeTools from './components/FreeTools';
import Plans from './components/Plans';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import { Icon } from './components/UI';
import { whatsappLink } from './config/contact';
export default function App() {
 useHomeSectionScroll();
 useReveal();
 const path = currentPath();
 if (path === 'servicios/soporte-digital') {
  window.location.replace(homeSectionHref('servicios'));
  return <p role="status">Redirigiendo a servicios…</p>;
 }
 const servicePath = path.startsWith('servicios/') ? path.slice('servicios/'.length) : null;
 const normalizedServiceSlug = servicePath ? (serviceLegacySlugs[servicePath] ?? servicePath) : null;
 const service = normalizedServiceSlug ? services.find(item => item.slug === normalizedServiceSlug) : undefined;
 const lab = labs.find(item => path === `labs/${item.slug}`);
 if (path === 'herramientas/calculadora') return <Suspense fallback={<p role="status">Cargando herramienta…</p>}><BusinessCalculatorPage/></Suspense>;
 if (path === 'herramientas/conversor') return <Suspense fallback={<p role="status">Cargando herramienta…</p>}><UnitConverterPage/></Suspense>;
 if (path === 'herramientas/generador-qr') return <Suspense fallback={<p role="status">Cargando herramienta…</p>}><QrGeneratorPage/></Suspense>;
 if (path === homePanel.path) return <HomePanelPage/>;
 if (service) return <ServiceDetailPage service={service}/>;
 if (lab) return <LabDetailPage lab={lab}/>;
 return <><a href="#main" className="skip-link">Saltar al contenido</a><Navbar/><main id="main"><Hero/><Services/><OwnProjects/><Portfolio/><FreeTools/><Plans/><FinalCTA/></main><Footer/><a className="whatsapp-float" href={whatsappLink('Hola, me interesa conocer los servicios de RX23 Digital.')} target="_blank" rel="noopener noreferrer" aria-label="Contactar a RX23 Digital por WhatsApp"><Icon name="message" size={24}/></a></>;
}
