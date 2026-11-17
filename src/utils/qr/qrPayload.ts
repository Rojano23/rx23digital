import type { QrFields, QrType } from './qrTypes';
import { normalizePhone, validWebUrl } from './qrValidation';
export type PayloadResult = { payload: string; hint: string };
const escapeWifi = (value: string) => value.replace(/([\\;,:"])/g, '\\$1');
export function buildQrPayload(type: QrType, fields: QrFields): PayloadResult {
  const empty = { payload: '', hint: '' };
  const invalid = (hint: string) => ({ payload: '', hint });
  if (type === 'url') {
    const url = fields.url.trim();
    if (!url) return empty;
    return validWebUrl(url) ? { payload: url, hint: '' } : invalid('Escribe una dirección completa que comience con https:// o http://.');
  }
  if (type === 'text') return fields.text.trim() ? { payload: fields.text, hint: '' } : empty;
  if (type === 'whatsapp' || type === 'phone') {
    if (!fields.number.trim()) return empty;
    const phone = normalizePhone(fields.country, fields.number);
    if (!phone) return invalid('Revisa el código de país y el número: utiliza de 6 a 14 dígitos locales y un máximo de 15 en total.');
    return { payload: type === 'phone' ? `tel:+${phone}` : `https://wa.me/${phone}${fields.message ? `?text=${encodeURIComponent(fields.message)}` : ''}`, hint: '' };
  }
  if (type === 'email') {
    const email = fields.email.trim();
    if (!email) return empty;
    if (!/^[^\s@?&#:]+@[^\s@?&#:]+\.[^\s@?&#:]+$/.test(email)) return invalid('Escribe un correo válido, por ejemplo nombre@empresa.com.');
    const query = [fields.subject ? `subject=${encodeURIComponent(fields.subject)}` : '', fields.message ? `body=${encodeURIComponent(fields.message)}` : ''].filter(Boolean).join('&');
    return { payload: `mailto:${encodeURIComponent(email).replace('%40', '@')}${query ? `?${query}` : ''}`, hint: '' };
  }
  if (!fields.ssid.trim()) return empty;
  if (fields.security !== 'nopass' && !fields.password) return invalid('Añade la contraseña de la red o selecciona “Sin contraseña”.');
  return { payload: `WIFI:T:${fields.security};S:${escapeWifi(fields.ssid)};${fields.security !== 'nopass' ? `P:${escapeWifi(fields.password)};` : ''}H:${fields.hidden ? 'true' : 'false'};;`, hint: '' };
}
