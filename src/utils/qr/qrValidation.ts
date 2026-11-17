export function normalizePhone(country: string, number: string): string | null {
  const code = country.trim().replace(/^\+/, '');
  if (!/^[1-9]\d{0,2}$/.test(code) || !/^[+\d\s().-]+$/.test(number)) return null;
  let local = number.replace(/\D/g, '');
  if (number.trim().startsWith('+')) {
    if (!local.startsWith(code)) return null;
    local = local.slice(code.length);
  }
  const full = code + local;
  return /^\d{6,14}$/.test(local) && full.length <= 15 ? full : null;
}
export function validWebUrl(value: string): boolean {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) && Boolean(url.hostname) && !/\s/.test(value); } catch { return false; }
}
function luminance(hex: string) {
  const values = hex.slice(1).match(/.{2}/g)!.map(value => { const c = parseInt(value, 16) / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; });
  return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
}
export function lowContrast(foreground: string, background: string): boolean {
  const dark = luminance(foreground), light = luminance(background);
  return dark >= light || (light + .05) / (dark + .05) < 4.5;
}
