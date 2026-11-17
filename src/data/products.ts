export type Product = { name: string; kind: string; state: string; description: string; tags: readonly string[]; screenshot: string | null; path?: string; applicationDescription?: string };
export const homePanel = {
  name: 'HomePanel Hogar', kind: 'home', state: 'PRODUCTO RX23',
  description: 'Panel para el hogar que reúne información, accesos, contactos y servicios en una interfaz pensada para una tablet.',
  applicationDescription: 'Panel para el hogar que centraliza información, accesos, contactos, monitoreo y alertas en una interfaz diseñada para tablet.',
  demo: { src: 'assets/products/homepanel/homepanel-hogar-demo-alertas.mp4', poster: 'assets/products/homepanel/homepanel-hogar-demo-poster.jpg' },
  tags: ['Calendario', 'Accesos', 'Servicios', 'Directorio', 'Integraciones en desarrollo'],
  screenshot: 'assets/products/homepanel/homepanel-dashboard.png',
  gasScreenshot: 'assets/products/homepanel/homepanel-gas-detail.png',
  path: 'desarrollos/homepanel-hogar',
  message: 'Hola, me interesa conocer HomePanel Hogar.',
  seo: { title: 'HomePanel Hogar | RX23 Digital', description: 'HomePanel Hogar centraliza información, contactos, accesos, monitoreo y alertas del hogar en una interfaz diseñada para tablet.' },
};
export const products: readonly Product[] = [
 homePanel,
 { name: 'KM0 Nexus', kind: 'fleet', state: 'En desarrollo', description: 'Plataforma orientada a gestión de activos, operación y telemetría.', tags: ['Vehículos y conductores', 'Combustible', 'Mantenimiento', 'Gastos e ingresos', 'Seguros', 'Integración industrial'], screenshot: null },
 { name: 'TuScope', kind: 'document', state: 'En validación', description: 'RX23 TuScope es una plataforma para apoyar el análisis y preparación de licitaciones, actualmente en desarrollo y validación.', tags: ['Análisis documental', 'Estructuración de información', 'Licitaciones'], screenshot: 'assets/products/licitia/licitia-bidding.png' },
];
