const baseFeatures = ['Diseño responsive', '1 dominio .com', 'SSL', 'SEO técnico básico', 'Publicación del sitio', 'Soporte inicial'];
const definitions = [
  { id: 'presencia', name: 'Presencia', description: 'Para comenzar con una presencia profesional.', audience: 'Profesionales, pequeños negocios, empresas que presentan sus servicios y negocios sin sitio propio.', developmentPrice: 2990, annualInfrastructure: 899, hostingStorage: 2, emailAccounts: 2, developmentScope: 'Sitio web profesional', whatsappScope: 'Incluido', specialScope: 'Según alcance', features: ['Sitio web profesional', 'Integración con WhatsApp', 'Formulario/contacto según alcance'], cta: 'Elegir Presencia', message: 'Hola, me interesa el plan Presencia de RX23 Digital.', startingAt: false, recommended: false },
  { id: 'negocio', name: 'Negocio', description: 'Para negocios que necesitan mostrar más contenido, servicios o productos.', audience: 'Sitios corporativos, catálogos digitales, empresas con varias líneas de servicio o mayor volumen de contenido.', developmentPrice: 5490, annualInfrastructure: 1299, hostingStorage: 4, emailAccounts: 5, developmentScope: 'Mayor alcance que Presencia', whatsappScope: 'Incluido', specialScope: 'Más contenido, según alcance', features: ['Desarrollo con mayor alcance que Presencia', 'Integración con WhatsApp', 'Formularios según alcance', 'Estructura para más contenido'], cta: 'Elegir Negocio', message: 'Hola, me interesa el plan Negocio de RX23 Digital.', startingAt: false, recommended: true },
  { id: 'profesional', name: 'Profesional', description: 'Para proyectos que requieren mayor alcance o funcionalidades particulares.', audience: 'El alcance se define después de conocer el proyecto.', developmentPrice: 8900, annualInfrastructure: 1799, hostingStorage: 6, emailAccounts: 10, developmentScope: 'A medida según alcance', whatsappScope: 'Según alcance', specialScope: 'Según proyecto y alcance', features: ['Desarrollo a medida según alcance', 'Estructura de mayor complejidad', 'Integraciones según proyecto', 'Funcionalidades específicas según alcance'], cta: 'Cotizar proyecto', message: 'Hola, quiero cotizar un proyecto Profesional con RX23 Digital.', startingAt: true, recommended: false },
];
export const plans = definitions.map(plan => ({
  ...plan,
  firstYearPrice: plan.developmentPrice + plan.annualInfrastructure,
  renewalPrice: plan.annualInfrastructure,
  features: [plan.features[0], baseFeatures[0], `Hasta ${plan.hostingStorage} GB de hosting`, baseFeatures[1], baseFeatures[2], `Hasta ${plan.emailAccounts} cuentas de correo empresarial`, ...plan.features.slice(1), ...baseFeatures.slice(3)],
}));
export type Plan = typeof plans[number];
export const planMoney = (value: number) => `$${new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 }).format(value)} MXN`;
export const planComparison: { label: string; value: (plan: Plan) => string }[] = [
  { label: 'Desarrollo web', value: plan => `${plan.startingAt ? 'Desde ' : ''}${planMoney(plan.developmentPrice)}` },
  { label: 'Dominio .com', value: () => '1 incluido' },
  { label: 'SSL', value: () => 'Incluido' },
  { label: 'Hosting', value: plan => `Hasta ${plan.hostingStorage} GB` },
  { label: 'Correos empresariales', value: plan => `Hasta ${plan.emailAccounts} cuentas` },
  { label: 'WhatsApp', value: plan => plan.whatsappScope },
  { label: 'SEO técnico básico', value: () => 'Incluido' },
  { label: 'Publicación', value: () => 'Incluida' },
  { label: 'Soporte inicial', value: () => 'Incluido' },
  { label: 'Mayor alcance / funciones especiales', value: plan => plan.specialScope },
];
export const additionalRequirements = ['Campañas publicitarias', 'Administración de redes sociales', 'SEO continuo', 'Producción de contenido', 'Fotografía profesional', 'Ecommerce complejo', 'Integraciones especiales', 'Desarrollos posteriores'];
