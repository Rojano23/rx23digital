import { finiteResults, nonNegative } from './validation';
export function calculateMargin(cost: number, price: number) {
  nonNegative(cost, 'El costo no puede ser negativo.');
  if (!Number.isFinite(price) || price <= 0) throw new Error('Ingresa un precio de venta válido.');
  const profit = price - cost;
  const margin = profit / price * 100;
  const markup = cost === 0 ? null : profit / cost * 100;
  finiteResults(profit, margin, ...(markup === null ? [] : [markup]));
  return { profit, margin, markup };
}
