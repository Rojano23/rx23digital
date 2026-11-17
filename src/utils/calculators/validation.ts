export function finiteResults(...values: number[]) {
  if (values.some(value => !Number.isFinite(value))) throw new Error('El resultado está fuera del rango admitido. Prueba con importes menores.');
}
export function nonNegative(value: number, message: string) {
  if (!Number.isFinite(value) || value < 0) throw new Error(message);
}
export function percentage(value: number, maximum = 100, inclusive = true) {
  if (!Number.isFinite(value) || value < 0 || (inclusive ? value > maximum : value >= maximum)) {
    throw new Error(inclusive ? `El porcentaje debe estar entre 0 y ${maximum} %.` : 'El margen debe ser menor a 100 % y no puede ser negativo.');
  }
}
export function normalizeNumber(input: string) {
  return input.includes(',') && !input.includes('.') && input.split(',').length === 2 ? input.replace(',', '.') : input;
}
export function parseAmount(input: string): { value: number | null; error: string } {
  const text = normalizeNumber(input).trim();
  if (!text) return { value: null, error: '' };
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(text)) return { value: null, error: 'Escribe un porcentaje válido con punto o coma decimal.' };
  const value = Number(text);
  return Number.isFinite(value) ? { value, error: '' } : { value: null, error: 'El importe está fuera del rango admitido.' };
}
