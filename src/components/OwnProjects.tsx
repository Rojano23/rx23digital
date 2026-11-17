import { products } from '../data/products';
import { labs } from '../data/labs';
import { assetUrl } from '../config/contact';
import { Icon, SectionHead, WhatsAppCTA, ArrowRight } from './UI';

type Development = {
	id: string;
	name: string;
	kind: string;
	state: string;
	description: string;
	tags: readonly string[];
	screenshot: string | null;
	path?: string;
	message?: string;
};

function maturityLabel(state: string) {
	if (state.toLowerCase().includes('beta')) return 'Beta privada';
	if (state.toLowerCase().includes('experimental')) return 'Experimental';
	if (state.toLowerCase().includes('valid')) return 'En validación';
	if (state.toLowerCase().includes('desarrollo')) return 'En desarrollo';
	return 'Demostración';
}

export default function OwnProjects() {
	const labCards: Development[] = labs.map(lab => ({
		id: `lab-${lab.slug}`,
		name: lab.name,
		kind: lab.icon,
		state: lab.state,
		description: lab.description,
		tags: lab.features.slice(0, 3),
		screenshot: null,
		path: `labs/${lab.slug}`,
		message: lab.message,
	}));

	const productCards: Development[] = products.map(product => ({
		id: `product-${product.name}`,
		name: product.name,
		kind: product.kind,
		state: product.state,
		description: product.description,
		tags: product.tags,
		screenshot: product.screenshot,
		path: product.path,
		message: `Hola, me interesa conocer el desarrollo ${product.name} y su estado actual.`,
	}));

	const developments = [...productCards, ...labCards];

	return (
		<section id="desarrollos" className="section container products-showcase">
			<SectionHead eyebrow="HECHO EN RX23" title="Desarrollos RX23">
				Reunimos nuestros productos y proyectos en evolución en una sola sección, con su estado actual y enlaces para conocer más.
			</SectionHead>

			<div className="products-grid products-showcase-grid">
				{developments.map((development, index) => (
					<article className={`product-card product-showcase-card reveal reveal-delay-${index % 3 + 1}`} key={development.id}>
						<div className={`product-visual ${development.kind}`}>
							{development.screenshot ? (
								<img src={assetUrl(development.screenshot)} alt={`Vista de ${development.name}`} loading="lazy" width="640" height="400" />
							) : (
								<>
									<div className="product-blueprint">
										<div className="blueprint-top"><span /><span /><span /></div>
										<div className="blueprint-content">
											<span className="product-symbol"><Icon name={development.kind} size={35} /></span>
											<div className="blueprint-lines"><i /><i /><i /></div>
										</div>
										<div className="blueprint-blocks"><i /><i /><i /></div>
									</div>
									<span className="concept-label">CONCEPTO · VISTA PREVIA PENDIENTE</span>
								</>
							)}
						</div>

						<div className="product-content">
							<div className="product-topline">
								<span className="development"><span /> {development.state}</span>
								<span className="product-maturity">{maturityLabel(development.state)}</span>
							</div>

							<h3>{development.name}</h3>
							<p>{development.description}</p>

							<div className="tags">
								{development.tags.map(tag => <span key={tag}>{tag}</span>)}
							</div>

							{development.path ? (
								<a className="text-link product-cta" href={assetUrl(`${development.path}/`)}>
									Conocer desarrollo <ArrowRight size={16} />
								</a>
							) : (
								<WhatsAppCTA className="text-link product-cta" message={development.message}>
									Conocer desarrollo
								</WhatsAppCTA>
							)}
						</div>
					</article>
				))}
			</div>
		</section>
	);
}
