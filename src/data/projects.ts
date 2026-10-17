export type Project = { name: string; category: string; description: string; url: string | null; logo: string | null; screenshot: string | null; folder: string };
export const projects: Project[] = [
 { name: 'Constructora ROGIN', category: 'Proyecto web', description: 'Presencia digital para una empresa del sector de la construcción.', url: 'https://constructorarogin.com', logo: null, screenshot: 'assets/projects/rogin/rogin-cover.jpg', folder: 'rogin' },
 { name: 'HIDRATODO', category: 'Proyecto web', description: 'Un espacio digital para presentar el negocio y conectar con sus clientes.', url: 'https://hidratodo.com', logo: null, screenshot: 'assets/projects/hidratodo/hidratodo-cover.jpg', folder: 'hidratodo' },
 { name: 'EPC del Sureste', category: 'Proyecto digital', description: 'Soluciones digitales desarrolladas para la empresa.', url: 'https://www.epc-ste.com', logo: null, screenshot: 'assets/projects/epc/epc-cover.jpg', folder: 'epc' },
];
