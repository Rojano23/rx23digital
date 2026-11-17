export type Precision = 'auto' | '2' | '4' | '6';
export function formatResult(value: number, precision: Precision = 'auto'): string {
  if (!Number.isFinite(value)) return '';
  if (value === 0) return precision === 'auto' ? '0' : (0).toFixed(Number(precision));
  const absolute = Math.abs(value);
  const scientific = absolute >= 1e12 || absolute < 1e-6;
  if (precision === 'auto') {
    const rounded = Number(value.toPrecision(12));
    return scientific ? rounded.toExponential() : rounded.toString();
  }
  if (scientific || absolute < .5 * 10 ** -Number(precision)) return value.toExponential(Number(precision));
  const text = value.toFixed(Number(precision));
  return Number(text) === 0 ? (0).toFixed(Number(precision)) : text;
}
