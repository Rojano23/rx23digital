import type { DemoVideo } from '../components/clips/VideoDemo';
export const clipsSeo = { title: 'RX23 Clips | Convierte Videos en Clips para Redes', description: 'Transformamos videos en clips cortos para redes sociales con formato vertical, subtítulos, hooks, textos para publicación y revisión humana.' };
export const clipsMessage = 'Hola, me interesa realizar una prueba de RX23 Clips.';
// Future local sources: assets/labs/rx23-clips/original.mp4, clip-01.mp4, etc.
// Leave empty until real, authorized material is available. No requests are made.
export const clipsDemo: { original?: DemoVideo; clips: DemoVideo[]; before?: DemoVideo; after?: DemoVideo } = { clips: [] };
export const clipsSteps = ['Nos compartes el video', 'Analizamos el contenido', 'Identificamos momentos aprovechables', 'Generamos los clips verticales', 'Revisamos subtítulos y hooks', 'Te entregamos las piezas'];
export const clipsCapabilities = ['Selección de momentos', 'Clips verticales 9:16', 'Reencuadre', 'Subtítulos', 'Hooks', 'Textos para publicación'];
export const clipsDeliverables = [
  ['Clips verticales', 'Formato orientado a TikTok, Instagram Reels y YouTube Shorts.'],
  ['Subtítulos', 'Texto integrado al video cuando el contenido lo permite.'],
  ['Hook', 'Una frase inicial diseñada para contextualizar o captar atención.'],
  ['Copy para redes', 'Texto sugerido para acompañar la publicación.'],
  ['Revisión humana', 'Revisamos el resultado antes de entregarlo.'],
  ['Descarga de archivos', 'Entrega de las piezas finales generadas.'],
];
export const clipsVideoTypes = [
  { title: 'Videos con voz', examples: ['Entrevistas', 'Podcasts', 'Clases', 'Explicaciones', 'Presentaciones', 'Demostraciones'], text: 'Cuando existe conversación o narración, el sistema puede apoyarse en el contexto del audio para identificar momentos aprovechables.' },
  { title: 'Videos de producto o proceso', examples: ['Preparación de alimentos', 'Demostraciones', 'Procesos', 'Producto en uso', 'Recorridos'], text: 'También podemos trabajar material con poco o ningún diálogo, aunque el resultado depende más de la claridad visual y normalmente requiere mayor intervención editorial.' },
  { title: 'Videos muy cortos', examples: [], text: 'RX23 Clips está pensado principalmente para extraer contenido de videos que tengan suficiente material para seleccionar momentos. Un video que ya es muy corto puede ofrecer pocas posibilidades de recorte.' },
];
export const clipsFaq = [
  ['¿Necesito grabar un video especialmente para RX23 Clips?', 'No necesariamente. Podemos revisar material que ya tengas y determinar si contiene momentos aprovechables.'],
  ['¿Todos los videos generan varios clips?', 'No. Depende de la duración, contenido y calidad del material.'],
  ['¿Los subtítulos son automáticos?', 'El proceso utiliza herramientas automáticas, pero RX23 contempla revisión antes de la entrega.'],
  ['¿Puede trabajar videos sin voz?', 'Sí, algunos contenidos visuales pueden procesarse, aunque normalmente requieren mayor criterio editorial.'],
  ['¿RX23 publica los clips en mis redes?', 'En esta etapa piloto el servicio se enfoca en preparar y entregar las piezas. La publicación automática no forma parte todavía del servicio estándar.'],
];
