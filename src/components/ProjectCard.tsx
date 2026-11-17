import type { Project } from '../data/projects';
import { assetUrl } from '../config/contact';
import { ArrowUpRight, ArrowRight, Icon } from './UI';
export default function ProjectCard({ project: p, index = 0, linkLabel = 'Ver proyecto' }: { project: Project; index?: number; linkLabel?: string }) {
  return <article className={`project-card portfolio-card reveal reveal-delay-${index % 3 + 1}`}>
    <div className="portfolio-card-top">
      <span className="project-category">{p.category}</span>
      <span className="project-status">{p.url ? 'Sitio activo' : 'Referencia validada'}</span>
    </div>

    <div className={`project-image ${p.folder}`}>
      {p.screenshot ? (
        <img src={assetUrl(p.screenshot)} alt={`Página de inicio de ${p.name}`} loading="lazy" width="800" height="500" />
      ) : (
        <div className="screenshot-placeholder"><Icon name="web" size={30} /><span>Captura pendiente</span><small>{p.name}</small></div>
      )}
      {p.url && <span className="project-overlay" aria-hidden="true"><span>Visitar proyecto <ArrowRight size={17} /></span></span>}
    </div>

    <div className="project-content">
      <h3>{p.logo && <img className="project-logo" src={assetUrl(p.logo)} alt="" loading="lazy" width="32" height="32" />}{p.name}</h3>
      <p>{p.description}</p>
      {p.url ? (
        <a className="text-link" href={p.url} target="_blank" rel="noopener noreferrer">{linkLabel} <ArrowUpRight size={16} /></a>
      ) : (
        <span className="pending-link">Enlace pendiente de confirmar</span>
      )}
    </div>
  </article>;
}
