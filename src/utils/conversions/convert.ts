import { categories } from './definitions';
import type { CategoryId } from './definitions';
export function normalizeDecimal(input: string): string {
  return input.includes(',') && !input.includes('.') && input.split(',').length === 2 ? input.replace(',', '.') : input;
}
export function parseValue(input: string): { value: number | null; error: string } {
  const text = normalizeDecimal(input).trim();
  if (!text) return { value: null, error: '' };
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(text)) return { value: null, error: 'Escribe un número válido con punto o coma decimal, sin separadores de miles.' };
  const value = Number(text);
  if (value === 0 && /[1-9]/.test(text.split(/[eE]/)[0])) return { value: null, error: 'El número es demasiado pequeño para representarlo. Prueba con un valor menos extremo.' };
  return Number.isFinite(value) ? { value, error: '' } : { value: null, error: 'El número está fuera del rango admitido. Prueba con un valor menor.' };
}
export function convert(value: number, categoryId: CategoryId, fromId: string, toId: string): { value: number | null; error: string; warning: string } {
  const invalid = (error: string) => ({ value: null, error, warning: '' });
  if (!Number.isFinite(value)) return invalid('Escribe un número finito.');
  const category = categories.find(item => item.id === categoryId);
  const from = category?.units.find(item => item.id === fromId);
  const to = category?.units.find(item => item.id === toId);
  if (!from || !to) return invalid('Selecciona unidades de la misma categoría.');
  let result: number;
  if ('factor' in from && 'factor' in to) {
    // Divide factors first to avoid overflowing an otherwise representable result.
    result = value * (from.factor / to.factor);
  } else if ('toBase' in from && 'fromBase' in to) {
    let kelvin = from.toBase(value);
    // Floating point cancellation can leave a tiny negative residue at absolute zero.
    if (from.id !== 'K' && Math.abs(kelvin) < 1e-12) kelvin = 0;
    if (kelvin < 0) return invalid('La temperatura no puede estar por debajo del cero absoluto (0 K).');
    result = fromId === toId ? value : to.fromBase(kelvin);
  } else return invalid('No se pueden combinar esas unidades.');
  if (!Number.isFinite(result) || (value !== 0 && result === 0 && categoryId !== 'temperature')) return invalid('El resultado está fuera del rango numérico admitido. Prueba con un valor menos extremo.');
  return { value: Object.is(result, -0) ? 0 : result, error: '', warning: value < 0 && categoryId !== 'temperature' ? 'Revisa el signo: para esta categoría normalmente se usan valores no negativos.' : '' };
}
