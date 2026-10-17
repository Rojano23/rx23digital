# Assets reales

## Integrados

- Hero: `hero-laptop-licitia.png`, `hero-tablet-homepanel-dashboard.png` y `hero-phone-homepanel-gas.png`. Se muestran dentro de marcos CSS de dispositivos.
- HomePanel Hogar: `assets/products/homepanel/homepanel-dashboard.png`.
- LicitIA: `assets/products/licitia/licitia-bidding.png`.
- ROGIN: `assets/projects/rogin/rogin-cover.jpg`.
- HIDRATODO: `assets/projects/hidratodo/hidratodo-cover.jpg`.
- EPC: `assets/projects/epc/epc-cover.jpg`. Enlace configurado a `https://www.epc-ste.com`.

## Pendientes

- Logo oficial RX23 Digital; se conserva la marca tipográfica provisional.
- Logos individuales de ROGIN, HIDRATODO y EPC.
- KM0 Nexus: `assets/products/km0/km0-preview.png`. Hasta recibirlo se conserva la ilustración conceptual explícita. Configurar `screenshot` en `src/data/products.ts` cuando esté disponible.

Las rutas de los datos son relativas a `public/`, sin `/` inicial, y pasan por `assetUrl` para respetar la base de Vite. Las capturas fuera del hero usan carga diferida. Los originales proporcionados se conservan sin modificación.

HomePanel, LicitIA y KM0 se presentan como productos en desarrollo. Los CTA “Conocer desarrollo” abren una consulta de WhatsApp específica para cada producto. El Open Graph sigue siendo una composición tipográfica provisional.
