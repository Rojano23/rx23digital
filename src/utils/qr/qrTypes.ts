export const qrTypes = [ ['url', 'URL'], ['text', 'Texto'], ['whatsapp', 'WhatsApp'], ['email', 'Correo'], ['phone', 'Teléfono'], ['wifi', 'Wi-Fi'] ] as const;
export type QrType = typeof qrTypes[number][0];
export type QrFields = { url: string; text: string; country: string; number: string; message: string; email: string; subject: string; ssid: string; password: string; security: 'WPA' | 'WEP' | 'nopass'; hidden: boolean };
export const initialFields: QrFields = { url: '', text: '', country: '52', number: '', message: '', email: '', subject: '', ssid: '', password: '', security: 'WPA', hidden: false };
export type QrDesign = { foreground: string; background: string; size: 256 | 512 | 1024; margin: number; correction: 'L' | 'M' | 'Q' | 'H' };
export const defaultDesign: QrDesign = { foreground: '#112e48', background: '#ffffff', size: 512, margin: 4, correction: 'M' };
