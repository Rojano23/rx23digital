import { finiteResults, nonNegative, percentage } from './validation';
export function calculateDiscount(original: number, discount: number, secondDiscount = 0) {
  nonNegative(original, 'El precio original no puede ser negativo.');
  percentage(discount); percentage(secondDiscount);
  const firstPrice = original * (1 - discount / 100);
  const finalPrice = firstPrice * (1 - secondDiscount / 100);
  const savings = original - finalPrice;
  const effective = (1 - (1 - discount / 100) * (1 - secondDiscount / 100)) * 100;
  finiteResults(firstPrice, finalPrice, savings, effective);
  return { firstPrice, finalPrice, savings, effective };
}
