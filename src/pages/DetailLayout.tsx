import type { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { homeSectionHref } from '../config/routes';
import '../styles/details.css';
export default function DetailLayout({ section, children }: { section: 'servicios' | 'labs' | 'desarrollos'; children: ReactNode }) {
  return <><a href="#main" className="skip-link">Saltar al contenido</a><Navbar/><main id="main" className="detail-page"><div className="container"><a className="detail-back" href={homeSectionHref(section)}>← Volver a {section === 'labs' ? 'RX23 Labs' : section === 'desarrollos' ? 'Desarrollos' : 'Servicios'}</a>{children}</div></main><Footer/></>;
}
