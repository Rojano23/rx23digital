import { calculatePrice } from './price';
import { calculateMargin } from './margin';
import { calculateVat } from './vat';
import type { VatMode } from './vat';
import { calculateDiscount } from './discount';
import { calculateBreakEven } from './breakEven';
export type CalculatorId = 'price' | 'margin' | 'vat' | 'discount' | 'breakEven';
export type Metric = { label: string; value: number | null; kind: 'money' | 'percent' | 'units'; empty?: string };
export type Calculation = { primary: Metric; secondary: Metric[] };
export type CalculatorField = { id: string; label: string; kind: 'money' | 'percent'; initial?: string };
export type CalculatorDefinition = { id: CalculatorId; name: string; fields: CalculatorField[]; explanation: string };
export const calculators: CalculatorDefinition[] = [
  { id: 'price', name: 'Precio de venta', fields: [{ id: 'cost', label: 'Costo del producto', kind: 'money' }, { id: 'margin', label: 'Margen deseado', kind: 'percent' }], explanation: 'Un margen del 30 % significa que el 30 % del precio final corresponde a utilidad antes de otros gastos.' },
  { id: 'margin', name: 'Margen y utilidad', fields: [{ id: 'cost', label: 'Costo', kind: 'money' }, { id: 'price', label: 'Precio de venta', kind: 'money' }], explanation: 'Margen: qué porcentaje del precio de venta queda como utilidad. Recargo: qué porcentaje se agregó sobre el costo.' },
  { id: 'vat', name: 'IVA', fields: [{ id: 'amount', label: 'Importe', kind: 'money' }, { id: 'rate', label: 'Tasa IVA', kind: 'percent', initial: '16' }], explanation: 'Agregar IVA calcula el impuesto sobre el subtotal. Quitar IVA extrae el impuesto de un importe que ya lo incluye; no es restar ese porcentaje al total.' },
  { id: 'discount', name: 'Descuentos', fields: [{ id: 'original', label: 'Precio original', kind: 'money' }, { id: 'discount', label: 'Descuento', kind: 'percent' }], explanation: 'Los descuentos consecutivos se aplican uno después de otro: 20 % y después 10 % equivalen a un descuento efectivo del 28 %, no del 30 %.' },
  { id: 'breakEven', name: 'Punto de equilibrio', fields: [{ id: 'fixed', label: 'Costos fijos mensuales', kind: 'money' }, { id: 'price', label: 'Precio de venta por unidad', kind: 'money' }, { id: 'variable', label: 'Costo variable por unidad', kind: 'money' }], explanation: 'Al alcanzar este nivel de ventas, los ingresos cubren los costos considerados en este cálculo.' },
];
const money = (label: string, value: number): Metric => ({ label, value, kind: 'money' });
const percent = (label: string, value: number | null): Metric => ({ label, value, kind: 'percent', empty: 'No aplica (costo cero)' });
export function calculate(id: CalculatorId, values: Record<string, number>, vatMode: VatMode, second: boolean): Calculation {
  if (id === 'price') { const r = calculatePrice(values.cost, values.margin); return { primary: money('Precio de venta', r.price), secondary: [money('Utilidad por unidad', r.profit), percent('Margen', r.margin)] }; }
  if (id === 'margin') { const r = calculateMargin(values.cost, values.price); return { primary: money('Utilidad', r.profit), secondary: [percent('Margen', r.margin), percent('Recargo sobre costo / Markup', r.markup)] }; }
  if (id === 'vat') { const r = calculateVat(values.amount, values.rate, vatMode); return { primary: money(vatMode === 'add' ? 'Total' : 'Subtotal', vatMode === 'add' ? r.total : r.subtotal), secondary: [money(vatMode === 'add' ? 'Subtotal' : 'Total con IVA', vatMode === 'add' ? r.subtotal : r.total), money('IVA', r.vat)] }; }
  if (id === 'discount') { const r = calculateDiscount(values.original, values.discount, second ? values.second : 0); return { primary: money('Precio final', r.finalPrice), secondary: [...(second ? [money('Después del primer descuento', r.firstPrice)] : []), money('Descuento', r.savings), money('Ahorro', r.savings), percent('Descuento total efectivo', r.effective)] }; }
  const r = calculateBreakEven(values.fixed, values.price, values.variable);
  return { primary: { label: 'Punto de equilibrio', value: r.units, kind: 'units' }, secondary: [money('Margen de contribución unitario', r.contribution), money('Ventas necesarias', r.sales)] };
}
