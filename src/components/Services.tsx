import { useEffect, useRef, useState } from 'react';
import { services } from '../data/services';
import { assetUrl, contact, whatsappLink } from '../config/contact';
import { Icon, SectionHead, ArrowRight, ArrowUpRight } from './UI';

const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Services() {
	const [activeSlug, setActiveSlug] = useState<string | null>(null);
	const modalRef = useRef<HTMLDivElement>(null);
	const lastFocusRef = useRef<HTMLElement | null>(null);
	const activeService = services.find(item => item.slug === activeSlug) ?? null;

	useEffect(() => {
		if (!activeService) return;
		lastFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		const frame = requestAnimationFrame(() => {
			const closeButton = modalRef.current?.querySelector<HTMLElement>('[data-modal-close]');
			closeButton?.focus();
		});
		const onKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				setActiveSlug(null);
				return;
			}
			if (event.key !== 'Tab') return;
			const focusable = modalRef.current?.querySelectorAll<HTMLElement>(focusableSelector);
			if (!focusable?.length) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			const current = document.activeElement;
			if (event.shiftKey && current === first) {
				event.preventDefault();
				last.focus();
				return;
			}
			if (!event.shiftKey && current === last) {
				event.preventDefault();
				first.focus();
			}
		};
		document.addEventListener('keydown', onKeydown);
		return () => {
			cancelAnimationFrame(frame);
			document.removeEventListener('keydown', onKeydown);
			document.body.style.overflow = previousOverflow;
			lastFocusRef.current?.focus();
		};
	}, [activeService]);

	return <section id="servicios" className="section container"><SectionHead eyebrow="LO QUE HACEMOS" title="Soluciones para hacer crecer tu negocio">Tecnología clara, accesible y acompañada por personas que pueden ayudarte durante todo el proyecto.</SectionHead><div className="services-grid">{services.map((service, index) => { const detailUrl = assetUrl(`servicios/${service.slug}/`); return <article className={`service-card service-link reveal reveal-delay-${index % 3 + 1}`} key={service.slug}><span className="border-beam" aria-hidden="true"/><div className="service-top"><span className="icon-box"><Icon name={service.icon}/></span><span className="card-number">0{index + 1}</span></div><h3>{service.title}</h3><p>{service.description}</p><ul className="service-highlights" aria-label={`Beneficios de ${service.title}`}>{service.highlights.map(item => <li key={item}><Icon name="check" size={13}/>{item}</li>)}</ul><div className="service-actions"><a className="text-link service-more" href={detailUrl}>Conocer servicio <ArrowRight size={15}/></a><button type="button" className="service-quick-button" aria-haspopup="dialog" onClick={() => setActiveSlug(service.slug)}>Consulta rápida <ArrowUpRight size={14}/></button></div></article>; })}</div>{activeService && <div className="service-modal-backdrop" role="presentation" onClick={() => setActiveSlug(null)}><div ref={modalRef} className="service-modal" role="dialog" aria-modal="true" aria-labelledby={`service-modal-title-${activeService.slug}`} aria-describedby={`service-modal-description-${activeService.slug}`} onClick={event => event.stopPropagation()}><div className="service-modal-head"><span className="service-modal-badge">SERVICIO RX23 DIGITAL</span><button type="button" className="service-modal-close" aria-label="Cerrar consulta rápida" data-modal-close onClick={() => setActiveSlug(null)}>×</button></div><h3 id={`service-modal-title-${activeService.slug}`}>{activeService.title}</h3><p id={`service-modal-description-${activeService.slug}`}>{activeService.description}</p><ul className="service-modal-list">{activeService.highlights.map(item => <li key={item}><Icon name="check" size={14}/>{item}</li>)}</ul><div className="service-modal-actions"><a className="button primary" href={whatsappLink(`Hola, me interesa conocer el servicio de ${activeService.title.toLowerCase()} de RX23 Digital.`)} target="_blank" rel="noopener noreferrer">Consultar por WhatsApp <ArrowUpRight size={15}/></a><a className="button secondary" href={`mailto:${contact.email}?subject=${encodeURIComponent(`Consulta sobre ${activeService.title}`)}&body=${encodeURIComponent(`Hola RX23 Digital,%0D%0A%0D%0AMe interesa conocer más sobre el servicio ${activeService.title}.`)}`}>Enviar correo <ArrowUpRight size={15}/></a><a className="text-link service-modal-detail" href={assetUrl(`servicios/${activeService.slug}/`)} onClick={() => setActiveSlug(null)}>Ver todos los detalles <ArrowRight size={15}/></a></div></div></div>}</section>;
}
