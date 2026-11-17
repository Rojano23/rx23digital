import { finiteResults, nonNegative } from './validation';
export type VatMode = 'add' | 'remove';
export function calculateVat(amount: number, rate: number, mode: VatMode = 'add') {
  nonNegative(amount, 'El importe no puede ser negativo.');
  nonNegative(rate, 'La tasa de IVA no puede ser negativa.');
  if (mode !== 'add' && mode !== 'remove') throw new Error('Selecciona un modo de IVA válido.');
  const subtotal = mode === 'add' ? amount : amount / (1 + rate / 100);
  const vat = mode === 'add' ? subtotal * (rate / 100) : amount - subtotal;
  const total = mode === 'add' ? subtotal + vat : amount;
  finiteResults(subtotal, vat, total);
  return { subtotal, vat, total };
}
