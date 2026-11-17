import QRCode from 'qrcode';
import type { QrDesign } from './qrTypes';
export async function generateQr(payload: string, design: QrDesign) {
  const options = { width: design.size, margin: design.margin, errorCorrectionLevel: design.correction, color: { dark: design.foreground, light: design.background } };
  const [png, svg] = await Promise.all([QRCode.toDataURL(payload, options), QRCode.toString(payload, { ...options, type: 'svg' })]);
  return { png, svg };
}
