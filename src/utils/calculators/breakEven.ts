import { finiteResults, nonNegative } from './validation';
export function calculateBreakEven(fixed: number, price: number, variable: number) {
  nonNegative(fixed, 'Los costos fijos no pueden ser negativos.');
  nonNegative(variable, 'El costo variable no puede ser negativo.');
  if (!Number.isFinite(price) || price <= 0) throw new Error('Ingresa un precio de venta válido.');
  if (price <= variable) throw new Error('El precio de venta debe ser mayor al costo variable para poder calcular un punto de equilibrio.');
  const contribution = price - variable;
  const quotient = fixed / contribution;
  // Avoid an extra unit from floating point residue near a positive integer.
  const nearest = Math.round(quotient);
  const nearInteger = nearest >= 1 && Math.abs(quotient - nearest) <= Number.EPSILON * Math.max(1, Math.abs(quotient)) * 4;
  const units = fixed === 0 ? 0 : Math.max(1, nearInteger ? nearest : Math.ceil(quotient));
  const sales = units * price;
  finiteResults(contribution, quotient, units, sales);
  if (!Number.isSafeInteger(units)) throw new Error('La cantidad de unidades es demasiado grande para calcularla con precisión.');
  return { contribution, units, sales };
}
