import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Labs from './components/Labs';
import OwnProjects from './components/OwnProjects';
import Portfolio from './components/Portfolio';
import FreeTools from './components/FreeTools';
import Plans from './components/Plans';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import { Icon } from './components/UI';
import { whatsappLink } from './config/contact';
export default function App() {
 useEffect(() => { const nodes = document.querySelectorAll('.reveal'); if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return; const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if(entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); } }); }, { threshold: .08 }); nodes.forEach(node => { node.classList.add('reveal-ready'); observer.observe(node); }); return () => observer.disconnect(); }, []);
 return <><a href="#main" className="skip-link">Saltar al contenido</a><Navbar/><main id="main"><Hero/><Services/><Labs/><OwnProjects/><Portfolio/><FreeTools/><Plans/><FinalCTA/></main><Footer/><a className="whatsapp-float" href={whatsappLink('Hola, me interesa conocer los servicios de RX23 Digital.')} target="_blank" rel="noopener noreferrer" aria-label="Contactar a RX23 Digital por WhatsApp"><Icon name="message" size={24}/></a></>;
}
