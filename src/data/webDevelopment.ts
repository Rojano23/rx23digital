import { projects } from './projects';
export const webDevelopmentSeo = {
  title: 'Desarrollo Web para Negocios',
  description: 'Diseñamos y desarrollamos páginas web, sitios corporativos, catálogos digitales y soluciones web para negocios y empresas.',
};
export const websiteTypes = [
  { name: 'Sitio corporativo', icon: 'web', intro: 'Para presentar', items: ['Empresa', 'Servicios', 'Experiencia', 'Proyectos', 'Contacto'] },
  { name: 'Catálogo digital', icon: 'layers', intro: 'Para mostrar', items: ['Productos', 'Familias', 'Características', 'Búsqueda', 'Solicitud de cotización'] },
  { name: 'Landing page', icon: 'zap', intro: 'Para', items: ['Promociones', 'Campañas', 'Productos', 'Servicios específicos', 'Captación de contactos'] },
  { name: 'Desarrollo a medida', icon: 'code', intro: 'Para proyectos que necesiten', items: ['Funcionalidades particulares', 'Formularios', 'Integraciones', 'Interfaces específicas'] },
];
export const webEssentials = [
  ['mobile', 'Diseño responsive'], ['code', 'Desarrollo web'], ['globe', 'Configuración de dominio'], ['server', 'Hosting administrado'], ['shield', 'SSL'], ['mail', 'Correo empresarial'], ['message', 'Integración con WhatsApp'], ['search', 'SEO técnico básico'], ['web', 'Optimización de imágenes'], ['globe', 'Publicación'], ['support', 'Soporte inicial'],
];
export const webSeoItems = ['Títulos y descripciones', 'Estructura semántica', 'Sitemap', 'robots.txt', 'URLs claras', 'Imágenes optimizadas', 'Responsive', 'Rendimiento', 'Open Graph'];
export const webProcess = ['Conocemos tu negocio', 'Definimos contenido y estructura', 'Diseñamos la propuesta', 'Desarrollamos y revisamos', 'Publicamos y te acompañamos'];
const contexts: Record<string, { category: string; description: string }> = {
  rogin: { category: 'Sitio corporativo', description: 'Presencia digital para una empresa del sector construcción, con enfoque corporativo, experiencia y proyectos.' },
  hidratodo: { category: 'Catálogo digital', description: 'Catálogo web organizado por familias de productos, con búsqueda y contacto directo para cotización.' },
  epc: { category: 'Sitio corporativo industrial', description: 'Presentación digital de capacidades, servicios y experiencia para una empresa orientada al sector industrial y energético.' },
};
// Only the editorial context changes here. URLs, captures and identity stay centralized.
export const webProjectCases = ['rogin', 'hidratodo', 'epc'].flatMap(folder => {
  const project = projects.find(item => item.folder === folder);
  return project ? [{ ...project, ...contexts[folder] }] : [];
});
export const webAudience = ['Negocios que todavía no tienen página', 'Empresas con un sitio antiguo', 'Profesionales independientes', 'Empresas que necesitan catálogo', 'Negocios que dependen únicamente de redes sociales', 'Empresas que necesitan una presencia más profesional'];
export const webInfrastructure = ['Dominio', 'Hosting', 'SSL', 'Correo empresarial', 'Publicación', 'Soporte'];
