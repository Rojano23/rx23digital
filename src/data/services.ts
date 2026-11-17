export const services = [
  {
    slug: 'desarrollo-web',
    icon: 'web',
    title: 'Desarrollo web',
    description: 'Sitios modernos, rápidos, adaptables y pensados para representar profesionalmente a tu negocio.',
    highlights: ['Diseño adaptable a móvil y escritorio', 'Carga rápida y estructura clara', 'Imagen profesional para tu negocio'],
  },
  {
    slug: 'hosting-correo-empresarial',
    icon: 'server',
    title: 'Hosting y correo empresarial',
    description: 'Infraestructura digital para operar tu sitio con dominio propio, correo empresarial, SSL y administración básica.',
    highlights: ['Hosting para sitios web con gestión básica', 'Dominio, renovaciones y certificados SSL', 'Correos empresariales con dominio propio'],
  },
  {
    slug: 'aplicaciones',
    icon: 'code',
    title: 'Aplicaciones',
    description: 'Desarrollo de soluciones web y móviles, según alcance y necesidades específicas.',
    highlights: ['Soluciones web y empresariales a medida', 'Aplicaciones móviles según alcance', 'Flujos orientados a tu operación'],
  },
] as const;

export const serviceLegacySlugs: Record<string, (typeof services)[number]['slug']> = {
  hosting: 'hosting-correo-empresarial',
  dominios: 'hosting-correo-empresarial',
  'correo-empresarial': 'hosting-correo-empresarial',
};
