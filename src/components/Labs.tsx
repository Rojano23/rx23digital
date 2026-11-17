import { labs } from '../data/labs';
import { assetUrl } from '../config/contact';
import LabFlow from './LabFlow';
import { Icon, SectionHead, ArrowRight } from './UI';

export default function Labs() {
	return (
		<section id="labs" className="labs section labs-showcase">
			<div className="container">
				<div className="labs-heading">
					<SectionHead eyebrow="EXPLORAR. PROBAR. EVOLUCIONAR." title="RX23 Labs">
						Probamos nuevas formas de aplicar tecnología antes de convertirlas en servicios completos.
					</SectionHead>
					<p className="labs-note">Validamos soluciones con casos reales y mejoramos continuamente nuestros procesos.<span>Un espacio para lo que viene. ↗</span></p>
				</div>

				<div className="labs-grid labs-showcase-grid">
					{labs.map((l, index) => (
						<a className={`lab-card lab-link labs-showcase-card reveal reveal-delay-${index + 1}`} key={l.name} href={assetUrl(`labs/${l.slug}/`)}>
							<div className="lab-shell-head">
								<span className="lab-shell-title">rx23-labs/{l.slug}</span>
								<span className="badge"><span className="status-dot" />PROGRAMA PILOTO</span>
							</div>

							<div className="lab-card-top">
								<span className="icon-box"><Icon name={l.icon} /></span>
								<span className="lab-maturity">Evaluación activa</span>
							</div>

							<LabFlow kind={l.slug} />
							<h3>{l.name}</h3>
							<p>{l.description}</p>

							<ul className="lab-features">
								{l.features.map(f => <li key={f}><Icon name="check" size={13} />{f}</li>)}
							</ul>

							<span className="text-link">Conocer {l.name} <ArrowRight size={15} /></span>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
