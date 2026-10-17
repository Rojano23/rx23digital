export const contact = {
  email: 'contacto@rx23digital.com',
  phone: '9617857513',
  phoneDisplay: '961 785 7513',
  whatsapp: '529617857513',
  website: 'https://rx23digital.com',
};
export const whatsappLink = (message = 'Hola, me interesa conocer más sobre los servicios de RX23 Digital.') =>
  `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
export const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
