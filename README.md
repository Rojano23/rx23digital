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

Las rutas futuras de herramientas están declaradas en `src/data/tools.ts`; no están enlazadas hasta implementar las funciones. La página principal se complementa con subpáginas estáticas de servicios y Labs, sin herramientas simuladas. Los documentos legales se abren en diálogos que indican que están en preparación; deben completarse antes de la publicación comercial.

Fuentes: Manrope y DM Sans desde Google Fonts, con fallback sans-serif. Iconos: Lucide. Sin imágenes de terceros ni biblioteca de animación.

Consultar `ASSETS_PENDIENTES.md` y `DEPLOYMENT.md`. Esta iteración no realiza push ni deployment.

## Subpáginas de servicios y Labs

Las tarjetas enlazan a seis rutas `servicios/<slug>/` y dos rutas `labs/<slug>/`. `ServiceDetailPage` reutiliza los datos de servicios; `LabDetailPage` comparte estructura y el componente visual `LabFlow`. Los enlaces de navegación regresan a las secciones de inicio desde las subpáginas.

Vite emite un `index.html` por ruta durante el build, con metadatos propios. Esto permite acceso directo y recarga en GitHub Pages sin reglas de servidor. La base sigue siendo `/rx23digital/`. No se ha añadido una dependencia de router. Las herramientas futuras aún no tienen rutas públicas.

## RX23 Tools — Generador de QR

Ruta: `herramientas/generador-qr/`. Disponible desde la tarjeta del Home. Soporta URL, texto, WhatsApp, correo, teléfono y Wi-Fi. Usa `qrcode` 1.5.4 (MIT), con entrada browser declarada por la librería. Vite carga la página y el generador bajo demanda.

La interfaz está en `src/components/tools/qr/`, la página en `src/pages/tools/` y payloads, validación, generación y descargas en `src/utils/qr/`. Los datos se mantienen exclusivamente en memoria: no hay solicitudes para generar códigos, almacenamiento web ni backend. PNG y SVG se generan y descargan localmente.

Los cambios válidos generan automáticamente tras 300 ms. Cambiar los datos invalida inmediatamente las descargas anteriores. Los campos tienen límites y, si el payload excede la capacidad de QR (según codificación y corrección), se muestra una indicación para reducirlo. El tamaño seleccionado corresponde al archivo PNG; SVG conserva su carácter vectorial. Colores invertidos o con contraste insuficiente generan aviso; márgenes menores de cuatro módulos pueden reducir la lectura. Siempre probar el QR antes de compartirlo.

### Pruebas de navegador

Después de `npm run build`, ejecutar:

```sh
npx playwright install chromium
npm run test:e2e
```

Si ya tienes un Chromium compatible instalado, puedes indicar `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` para evitar otra descarga. Las pruebas decodifican los seis tipos con `jsQR`, verifican PNG y SVG descargados, personalización, reset, privacidad, navegación y los anchos 1440, 1280, 1024, 768 y 390. Las capturas quedan en `test-results/` (ignorado por Git). Las dependencias de prueba no se incluyen en el bundle del sitio.

## RX23 Tools — Conversor de unidades

Ruta: `herramientas/conversor/`. Conversión local con TypeScript propio, sin nuevas dependencias. Incluye siete categorías y 47 unidades: longitud (8), área (9), volumen (8), masa (6), temperatura (3), velocidad (5) y presión (8).

- `src/utils/conversions/definitions.ts`: catálogo, símbolos, plurales, factores base y fórmulas Celsius/Fahrenheit/Kelvin.
- `src/utils/conversions/convert.ts`: normalización decimal, validación numérica y conversión sin redondear el cálculo.
- `src/utils/conversions/formatResult.ts`: presentación automática de hasta 12 cifras significativas o 2/4/6 decimales; notación científica para extremos o cuando el redondeo ocultaría un valor no nulo.
- `src/components/tools/converter/`: selectores, origen y resultado/copia.
- `src/pages/tools/UnitConverterPage.tsx`: integración con el routing y el layout existente.

Referencias de auditoría: [NIST — conversion factors](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8) y [NIST — international foot and acre](https://www.nist.gov/pml/us-surveyfoot/revised-unit-conversion-factors). Se usa pie internacional, acre internacional, libra/onza avoirdupois, galón US líquido e imperial, y gravedad estándar para unidades de fuerza. No se incluyen unidades eléctricas, flujo ni instrumentación.

El intercambio conserva el valor introducido y cambia las unidades. Una coma decimal simple se normaliza a punto; no se aceptan separadores de miles ambiguos. Los negativos no térmicos muestran una advertencia; las temperaturas por debajo del cero absoluto no se convierten. Se rechazan valores no finitos y fuera del rango numérico. La copia utiliza el portapapeles del navegador y, si no está disponible, permite selección manual. No hay almacenamiento web ni transmisión de valores.

`npm run test:e2e` incluye los 18 ejemplos solicitados con su inversa, todas las parejas de unidades, formato, validación, copia, navegación, privacidad y revisión responsive del conversor. También conserva las pruebas del QR.

## RX23 Tools — Calculadoras para negocios

Ruta: `herramientas/calculadora/`. Cinco calculadoras locales, sin dependencias nuevas: precio de venta, margen/utilidad, IVA (agregar o extraer), descuentos consecutivos y punto de equilibrio. La página se carga bajo demanda.

- `src/utils/calculators/`: funciones matemáticas independientes por cálculo, validación y formato monetario con `Intl.NumberFormat` (`es-MX`, `MXN`). Los cálculos mantienen su precisión y se redondean solo al mostrarse.
- `src/utils/calculators/definitions.ts`: campos, explicaciones y adaptación de resultados a un modelo común.
- `src/components/tools/calculators/`: selector, campos, formulario reutilizable y `ResultPanel` compartido.
- `src/pages/tools/BusinessCalculatorPage.tsx`: integración con Navbar, Footer, routing y retorno a Herramientas.

Fórmulas: precio = costo / (1 − margen/100); utilidad = venta − costo; margen = utilidad/venta × 100; markup = utilidad/costo × 100. Con costo cero el markup se muestra como “No aplica”, sin producir infinito. Precio con margen requiere costo positivo.

IVA agregado = subtotal × tasa/100; IVA extraído usa subtotal = total/(1 + tasa/100). La tasa es editable, con 16 como valor inicial. Descuentos consecutivos = precio × (1 − d1/100) × (1 − d2/100). Equilibrio = costos fijos / (precio − variable), con unidades enteras hacia arriba y ventas necesarias calculadas sobre esas unidades. Se evita una unidad adicional causada por residuos binarios cerca de enteros.

Campos vacíos permanecen vacíos. Los porcentajes conservan su parser decimal; los importes usan el parser monetario descrito abajo. Los errores se muestran discretamente tras una breve pausa. Se rechazan importes negativos donde corresponda, margen desde 100 %, venta no positiva, descuentos fuera de 0–100 %, contribución no positiva y resultados no finitos o unidades fuera del rango entero seguro.

No se almacenan ni transmiten costos, precios, tasas o resultados. Copiar utiliza el portapapeles, con selección manual si el navegador deniega acceso. El disclaimer recuerda que son cálculos orientativos. Cambiar de calculadora reinicia sus campos; no hay persistencia entre sesiones ni pestañas.

Pruebas: `tests/calculators.spec.ts` cubre fórmulas, validación, redondeo y formatos. `tests/business-calculator.spec.mjs` cubre ejemplos, modos, copia, privacidad, navegación y los cinco anchos solicitados. Ejecutar con `npm run test:e2e` después del build, junto con las pruebas existentes del QR y conversor.


### Entrada monetaria

`src/utils/calculators/money.ts` centraliza `parseMoneyInput`, `parseMoneyField` y `formatMoneyInput`. Se usa únicamente en campos de dinero; los porcentajes conservan su manejo anterior. Acepta importes sin agrupación, miles es-MX (`30,000`, `1,250,000.50`), símbolo `$` inicial y formatos europeos coherentes con ambos separadores (`30.000,50`). Una coma única con uno o dos decimales se acepta como decimal; con tres dígitos solo se admite agrupación válida de miles. Un punto único siempre representa decimales (`30.000` = 30). Se rechazan grupos incoherentes, notación científica, texto y números no finitos.

Durante la edición se conserva la entrada sin reagruparla en cada tecla. Al perder el foco se muestra agrupación es-MX y dos decimales, sin duplicar el prefijo `$`. Al recuperar el foco se conserva el texto visible y su selección, sin transformaciones; únicamente una edición real sustituye el valor interno. El formato es solo visual: no sustituye ni redondea los datos que llegan a las fórmulas. Los campos vacíos siguen siendo `null`, incluso después del blur.

`npm test` ejecuta toda la suite Playwright, incluida la regresión de las tres herramientas. `tests/money.spec.ts` prueba el parser, sus ambigüedades y formato; `tests/money-input.spec.mjs` verifica importes agrupados en todas las calculadoras, focus/blur, millones, precisión interna y ausencia de scroll horizontal con importes largos.
