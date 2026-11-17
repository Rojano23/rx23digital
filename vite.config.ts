import { homePanel } from './src/data/products';
import { applicationsSeo } from './src/data/applications';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { services, serviceLegacySlugs } from './src/data/services';
import { clipsSeo } from './src/data/clips';
import { labs } from './src/data/labs';
import { webDevelopmentSeo } from './src/data/webDevelopment';

// Emit an HTML entry for each public route: direct requests and refreshes
// work on static hosting without a server rewrite or a 404 redirect.
export default defineConfig({
  plugins: [react(), {
    name: 'rx23-static-detail-pages',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const index = bundle['index.html'];
      if (!index || index.type !== 'asset') return;
      const pages = [
        { path: homePanel.path, title: homePanel.seo.title, description: homePanel.seo.description },
        ...services.map(item => ({
          path: `servicios/${item.slug}`,
          title: item.slug === 'desarrollo-web'
            ? webDevelopmentSeo.title
            : item.slug === 'aplicaciones'
              ? applicationsSeo.title
              : 'Hosting y Correo Empresarial para Negocios',
          description: item.slug === 'desarrollo-web'
            ? webDevelopmentSeo.description
            : item.slug === 'aplicaciones'
              ? applicationsSeo.description
              : 'Integramos dominio, hosting, SSL y correo empresarial para operar tu sitio web con una infraestructura administrada y soporte inicial.',
        })),
        ...Object.entries(serviceLegacySlugs).map(([legacySlug, targetSlug]) => {
          const targetService = services.find(item => item.slug === targetSlug);
          return {
            path: `servicios/${legacySlug}`,
            title: targetService?.slug === 'desarrollo-web'
              ? webDevelopmentSeo.title
              : targetService?.slug === 'aplicaciones'
                ? applicationsSeo.title
                : 'Hosting y Correo Empresarial para Negocios',
            description: targetService?.slug === 'desarrollo-web'
              ? webDevelopmentSeo.description
              : targetService?.slug === 'aplicaciones'
                ? applicationsSeo.description
                : 'Integramos dominio, hosting, SSL y correo empresarial para operar tu sitio web con una infraestructura administrada y soporte inicial.',
          };
        }),
          {
            path: 'servicios/soporte-digital',
            title: 'Servicios Digitales para Negocios',
            description: 'Conoce los servicios de RX23 Digital en desarrollo web, infraestructura y aplicaciones para negocios.',
          },
        ...labs.map(item => ({ path: `labs/${item.slug}`, title: item.slug === 'rx23-clips' ? clipsSeo.title : item.name, description: item.slug === 'rx23-clips' ? clipsSeo.description : item.description })),
        { path: 'herramientas/generador-qr', title: 'Generador de QR Gratis', description: 'Crea códigos QR gratis para enlaces, WhatsApp, correo, teléfono, texto y redes Wi-Fi directamente desde tu navegador.' },
        { path: 'herramientas/conversor', title: 'Conversor de Unidades Gratis', description: 'Convierte unidades de longitud, área, volumen, masa, temperatura, velocidad y presión gratis desde tu navegador.' },
        { path: 'herramientas/calculadora', title: 'Calculadoras para Negocios Gratis', description: 'Calcula precio de venta, margen de utilidad, IVA, descuentos y punto de equilibrio gratis desde tu navegador.' },
      ];
      for (const page of pages) {
        const url = `https://rx23digital.com/${page.path}${page.path.startsWith('herramientas/') ? '' : '/'}`;
        const title = (page.path === 'labs/rx23-clips' || page.path === homePanel.path) ? page.title : `${page.title} | RX23 Digital`;
        const source = String(index.source)
          .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
          .replace(/(<meta (?:name="(?:description|twitter:description)"|property="og:description") content=")[^"]*"/g, `$1${page.description}"`)
          .replace(/(<meta (?:name="twitter:title"|property="og:title") content=")[^"]*"/g, `$1${title}"`)
          .replace(/(<link rel="canonical" href=")[^"]*"/, `$1${url}"`)
          .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`);
        this.emitFile({ type: 'asset', fileName: `${page.path}/index.html`, source });
      }
    },
  }],
  base: '/rx23digital/',
});
