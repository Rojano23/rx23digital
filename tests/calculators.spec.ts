import { test, expect } from '@playwright/test';
import { calculatePrice } from '../src/utils/calculators/price';
import { calculateMargin } from '../src/utils/calculators/margin';
import { calculateVat } from '../src/utils/calculators/vat';
import { calculateDiscount } from '../src/utils/calculators/discount';
import { calculateBreakEven } from '../src/utils/calculators/breakEven';
import { formatCurrency, formatPercent } from '../src/utils/calculators/currency';
import { normalizeNumber, parseAmount } from '../src/utils/calculators/validation';

test('precio: margen sobre venta, no recargo', () => {
  const result = calculatePrice(100, 30);
  expect(result.price).toBeCloseTo(142.857142857143, 10);
  expect(result.profit).toBeCloseTo(42.857142857143, 10);
  expect(result.margin).toBe(30);
  expect(result.profit / result.price).toBeCloseTo(.3, 12);
  expect(calculatePrice(100, 0).price).toBe(100);
  expect(calculatePrice(.1, 30).price).toBeCloseTo(1 / 7, 12);
});
test('utilidad, margen, markup y pérdidas', () => {
  const result = calculateMargin(100, 150);
  expect(result.profit).toBe(50);
  expect(result.margin).toBeCloseTo(33.3333333333, 9);
  expect(result.markup).toBe(50);
  expect(calculateMargin(100, 80)).toEqual({ profit: -20, margin: -25, markup: -20 });
  expect(calculateMargin(0, 150)).toEqual({ profit: 150, margin: 100, markup: null });
});
test('IVA: agregar y extraer, incluida tasa cero', () => {
  expect(calculateVat(1000, 16)).toEqual({ subtotal: 1000, vat: 160, total: 1160 });
  const result = calculateVat(1160, 16, 'remove');
  expect(result.subtotal).toBeCloseTo(1000, 10);
  expect(result.vat).toBeCloseTo(160, 10);
  expect(result.total).toBe(1160);
  expect(calculateVat(1000, 0)).toEqual({ subtotal: 1000, vat: 0, total: 1000 });
  expect(calculateVat(1000, 8).total).toBe(1080);
});
test('descuentos simples y consecutivos, sin sumarlos', () => {
  expect(calculateDiscount(1000, 20).finalPrice).toBe(800);
  const result = calculateDiscount(1000, 20, 10);
  expect(result.firstPrice).toBe(800);
  expect(result.finalPrice).toBe(720);
  expect(result.savings).toBe(280);
  expect(result.effective).toBeCloseTo(28, 10);
  expect(calculateDiscount(1000, 100).finalPrice).toBe(0);
  expect(calculateDiscount(1000, 0).finalPrice).toBe(1000);
});
test('equilibrio: unidades enteras hacia arriba, sin residuo binario', () => {
  expect(calculateBreakEven(10000, 150, 100)).toEqual({ contribution: 50, units: 200, sales: 30000 });
  expect(calculateBreakEven(10001, 150, 100).units).toBe(201);
  expect(calculateBreakEven(.07, .08, .07).units).toBe(7);
  expect(calculateBreakEven(.001, 150, 100).units).toBe(1);
  expect(calculateBreakEven(0, 150, 100).units).toBe(0);
});
test('errores de dominio, cero, porcentajes y no finitos', () => {
  expect(() => calculatePrice(-1, 30)).toThrow('El costo no puede ser negativo.');
  expect(() => calculatePrice(0, 30)).toThrow();
  expect(() => calculatePrice(100, 100)).toThrow('El margen debe ser menor a 100 %');
  expect(() => calculatePrice(100, -1)).toThrow();
  expect(() => calculateMargin(100, 0)).toThrow('Ingresa un precio de venta válido.');
  expect(() => calculateDiscount(100, 101)).toThrow();
  expect(() => calculateDiscount(100, 20, -1)).toThrow();
  expect(() => calculateVat(100, -1)).toThrow();
  expect(() => calculateBreakEven(10000, 100, 100)).toThrow('El precio de venta debe ser mayor al costo variable');
  expect(() => calculateBreakEven(10000, 100, 150)).toThrow();
  expect(() => calculateBreakEven(10000, 150, -1)).toThrow();
  for (const value of [NaN, Infinity, -Infinity]) {
    expect(() => calculatePrice(value, 30)).toThrow();
    expect(() => calculateMargin(100, value)).toThrow();
    expect(() => calculateVat(100, value)).toThrow();
    expect(() => calculateDiscount(100, value)).toThrow();
    expect(() => calculateBreakEven(value, 150, 100)).toThrow();
  }
  expect(() => calculatePrice(1e308, 99)).toThrow();
  expect(() => calculateBreakEven(1e20, 150, 100)).toThrow();
});
test('entrada decimal, borrado y sin separadores ambiguos', () => {
  expect(normalizeNumber('1000,50')).toBe('1000.50');
  for (const text of ['1000', '1000.50', '1000,50']) expect(parseAmount(text).error).toBe('');
  expect(parseAmount('1000,50').value).toBe(1000.5);
  expect(parseAmount('')).toEqual({ value: null, error: '' });
  for (const text of ['NaN', 'Infinity', '1e309', '$100', '1,000.50', '10,0,0']) expect(parseAmount(text).value).toBeNull();
});
test('moneda con Intl es-MX y porcentajes legibles', () => {
  expect(formatCurrency(1234.56)).toBe('$1,234.56');
  expect(formatCurrency(calculatePrice(100, 30).price)).toBe('$142.86');
  expect(formatCurrency(calculatePrice(100, 30).profit)).toBe('$42.86');
  expect(formatPercent(30)).toBe('30 %');
  expect(formatPercent(100 / 3)).toBe('33.33 %');
});
