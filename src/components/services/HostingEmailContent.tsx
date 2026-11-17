import { contact } from '../../config/contact';
import { homeSectionHref } from '../../config/routes';
import { ArrowRight, Icon, WhatsAppCTA } from '../UI';

const message = 'Hola, me interesa contratar hosting y correo empresarial con RX23 Digital.';

const includedItems = [
  { icon: 'globe', label: 'Dominio', detail: 'Registro y administración de dominio para tu negocio.' },
  { icon: 'server', label: 'Hosting', detail: 'Espacio de hospedaje para mantener tu sitio operativo.' },
  { icon: 'shield', label: 'SSL', detail: 'Certificado de seguridad para navegación cifrada.' },
  { icon: 'mail', label: 'Correo empresarial', detail: 'Cuentas de correo con tu propio dominio.' },
] as const;

const benefits = [
  'Contratable como infraestructura independiente, incluso si tu sitio no fue desarrollado por RX23.',
  'Configuración inicial y administración base para mantener continuidad operativa.',
  'Escalamiento según el plan contratado y el alcance de tu proyecto.',
] as const;

export default function HostingEmailContent() {
  return (
    <>
      <section className="detail-intro">
        <span className="eyebrow">SERVICIOS RX23 DIGITAL</span>
        <div className="detail-title">
          <span className="icon-box">
            <Icon name="server" size={28} />
          </span>
          <h1>Hosting y correo empresarial</h1>
        </div>
        <p>
          Reunimos en una sola solución la infraestructura principal para tu presencia digital: dominio,
          hosting, SSL y correo empresarial.
        </p>
        <p>
          Puedes contratar este servicio por separado o como complemento de tu desarrollo web,
          según lo que necesite tu negocio.
        </p>
        <div className="detail-contact">
          <WhatsAppCTA message={message}>Consultar infraestructura</WhatsAppCTA>
          <a
            className="button secondary"
            href={`mailto:${contact.email}?subject=${encodeURIComponent('Consulta sobre hosting y correo empresarial')}&body=${encodeURIComponent('Hola RX23 Digital,%0D%0A%0D%0AMe interesa conocer más sobre hosting y correo empresarial.')}`}
          >
            Enviar correo
            <ArrowRight size={16} />
          </a>
          <a className="button secondary" href={homeSectionHref('planes')}>
            Ver planes y precios
            <ArrowRight size={16} />
          </a>
        </div>
      </section>

      <section className="detail-panel" aria-labelledby="hosting-incluye-title">
        <h2 id="hosting-incluye-title">Qué incluye esta solución</h2>
        <ul className="detail-features">
          {includedItems.map(item => (
            <li key={item.label}>
              <Icon name={item.icon} size={16} />
              <span>
                <strong>{item.label}:</strong> {item.detail}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="detail-panel" aria-labelledby="hosting-operacion-title">
        <h2 id="hosting-operacion-title">Operación y alcance</h2>
        <ul className="detail-steps">
          {benefits.map((item, index) => (
            <li key={item}>
              <span>{`0${index + 1}`}</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="detail-panel" aria-labelledby="hosting-cta-title">
        <h2 id="hosting-cta-title">¿Necesitas infraestructura para un sitio existente?</h2>
        <p>
          Si ya tienes página, podemos revisar contigo la infraestructura adecuada y orientarte con base
          en los planes actuales de RX23 Digital.
        </p>
        <div className="detail-contact">
          <p className="pilot-notice">
            El alcance final depende del plan elegido y de las necesidades técnicas del proyecto.
          </p>
          <WhatsAppCTA message={message}>Hablar con RX23</WhatsAppCTA>
        </div>
      </section>
    </>
  );
}
