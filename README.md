# RX23 Digital

Sitio oficial de RX23 Digital. Primera propuesta local en React + Vite + TypeScript.

## Uso

```sh
npm install
npm run dev
npm run build
npm run lint
```

Abrir la URL Local indicada por Vite. `npm run preview` sirve la compilación.

## Estructura

- `src/components/`: navegación, hero con capturas reales y secciones de la página.
- `src/config/contact.ts`: contacto, generador de enlaces WhatsApp y helper de assets.
- `src/data/`: servicios, Labs, productos, proyectos, herramientas, navegación y precios.
- `src/styles/main.css`: sistema visual, responsive, animaciones y reduced motion.
- `public/assets/`: marca, hero, proyectos y productos. Carpetas vacías conservadas con `.gitkeep`.

Los datos de proyectos aceptan `logo` y `screenshot` como rutas relativas a `public/`; `null` muestra un placeholder explícito. El hero muestra capturas reales de productos en desarrollo dentro de dispositivos CSS. Solo KM0 conserva su placeholder conceptual. El parallax se activa únicamente con mouse, hover disponible y sin preferencia de movimiento reducido. Los servicios específicos de cada cliente deben confirmarse antes de ampliar las descripciones.

Las rutas futuras de herramientas están declaradas en `src/data/tools.ts`; no están enlazadas hasta implementar las funciones. El sitio actual es de una sola página, sin router ni herramientas simuladas. Los documentos legales se abren en diálogos que indican que están en preparación; deben completarse antes de la publicación comercial.

Fuentes: Manrope y DM Sans desde Google Fonts, con fallback sans-serif. Iconos: Lucide. Sin imágenes de terceros ni biblioteca de animación.

Consultar `ASSETS_PENDIENTES.md` y `DEPLOYMENT.md`. Esta iteración no realiza push ni deployment.
