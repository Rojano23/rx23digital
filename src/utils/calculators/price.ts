import { finiteResults, nonNegative, percentage } from './validation';
export function calculatePrice(cost: number, margin: number) {
  nonNegative(cost, 'El costo no puede ser negativo.');
  if (cost === 0) throw new Error('Ingresa un costo mayor a cero para calcular un precio con margen.');
  percentage(margin, 100, false);
  const price = cost / (1 - margin / 100);
  const profit = price - cost;
  finiteResults(price, profit);
  return { price, profit, margin };
}
