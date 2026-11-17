import ClipsContent from '../components/clips/ClipsContent';
import { labs } from '../data/labs';
import { Icon, WhatsAppCTA } from '../components/UI';
import LabFlow from '../components/LabFlow';
import DetailLayout from './DetailLayout';
export default function LabDetailPage({ lab }: { lab: typeof labs[number] }) {
  if (lab.slug === 'rx23-clips') return <DetailLayout section="desarrollos"><ClipsContent/></DetailLayout>;
  return <DetailLayout section="desarrollos"><section className="detail-intro"><span className="badge"><span className="status-dot"/>PROGRAMA PILOTO</span><span className="detail-product">{lab.name}</span><h1>Conoce las oportunidades de tu presencia digital.</h1><p>Analizamos la presencia digital de un sitio, identificamos oportunidades y proponemos mejoras técnicas y de contenido.</p><WhatsAppCTA message={lab.message}>{lab.cta}</WhatsAppCTA></section><section className="detail-panel"><h2>Cómo funciona</h2><LabFlow kind={lab.slug}/></section><section className="detail-panel"><h2>Funciones piloto</h2><ul className="detail-features">{lab.features.map(feature => <li key={feature}><Icon name="check" size={17}/>{feature === 'Palabras clave' ? 'Análisis de palabras clave' : feature}</li>)}</ul></section><section className="detail-contact"><p className="pilot-notice">RX23 SEO se encuentra actualmente en programa piloto. No se garantiza el primer lugar en Google ni resultados específicos de tráfico.</p><WhatsAppCTA message={lab.message}>{lab.cta}</WhatsAppCTA></section></DetailLayout>;
}
