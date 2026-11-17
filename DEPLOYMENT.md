# Preparación para publicación futura

Esta entrega es exclusivamente local. No se ha hecho push ni deployment.

## GitHub Pages

Configuración actual en `vite.config.ts`:

```ts
base: '/rx23digital/'
```

Ruta prevista: `https://rojano23.github.io/rx23digital/`.

Compilar con `npm run build`. El resultado está en `dist/`. Los recursos públicos se resuelven con `import.meta.env.BASE_URL`, el helper `assetUrl` o `%BASE_URL%` en HTML. No cambiar a rutas absolutas `/assets/`.

La imagen social usa URL absoluta del alojamiento previsto en GitHub Pages, incluyendo la base. Solo estará disponible externamente cuando se publique. Canonical, `og:url`, robots y sitemap apuntan al dominio final por requisito de la marca. El sitemap incluye solo la página principal; no registrar herramientas todavía inexistentes.

## Producción NEUBOX

Al migrar a `https://rx23digital.com`:

1. Cambiar `base` a `'/'` en Vite.
2. Cambiar el host de `og:image` y `twitter:image` en `index.html` a `https://rx23digital.com`; conservar `%BASE_URL%`.
3. Completar assets reales, aviso de privacidad y términos.
4. Ejecutar `npm install`, `npm run lint` y `npm run build`.
5. Con autorización, subir el contenido de `dist/` al directorio público de NEUBOX.
6. Verificar HTTPS, navegación, recursos, WhatsApp, canonical y tarjeta social.

No modificar ahora la base. No se incluyen workflows de publicación automática. Las rutas de herramientas se mantienen como datos para implementación futura; antes de publicarlas, definir estrategia de router y fallback del hosting.

## Rutas de servicios y Labs

El build genera ocho directorios con `index.html` para las seis rutas de servicios y las dos de Labs. Publicar todo `dist/`, incluidos esos directorios. Los enlaces terminan en `/` y funcionan directamente en GitHub Pages. Al cambiar la base para NEUBOX, Vite seguirá generando las rutas con el prefijo correcto.

## Generador de QR

`dist/herramientas/generador-qr/index.html` se genera con metadatos propios y canonical de producción `https://rx23digital.com/herramientas/generador-qr`. Publicar también sus chunks estáticos. Usa el mismo mecanismo de rutas que Servicios y Labs; no requiere API, backend ni configuración de servidor. Cambiar `base` a `'/'` en la migración mantiene los enlaces y chunks relativos al dominio final.

## Conversor de unidades

El build genera `dist/herramientas/conversor/index.html`, con canonical `https://rx23digital.com/herramientas/conversor` y metadatos propios. Publicar el directorio junto con todos los chunks de `dist/assets/`. La página se carga bajo demanda, calcula localmente y no necesita servidor de aplicación. El helper existente construye los enlaces de ida y regreso con la base de Vite; no se añade otro router.

## Calculadoras para negocios

El build genera `dist/herramientas/calculadora/index.html` con título, descripción y canonical propios (`https://rx23digital.com/herramientas/calculadora`). Se utiliza el mismo routing estático y `BASE_URL` que las otras herramientas. Incluir sus chunks al publicar; no requiere backend, configuración fiscal del servidor ni servicios externos. La base actual permanece en `/rx23digital/`.
