import { test, expect } from '@playwright/test';
import { categories } from '../src/utils/conversions/definitions';
import type { CategoryId } from '../src/utils/conversions/definitions';
import { convert, normalizeDecimal, parseValue } from '../src/utils/conversions/convert';
import { formatResult } from '../src/utils/conversions/formatResult';
const examples: [CategoryId, number, string, string, number, number][] = [
  ['length', 1, 'm', 'cm', 100, 10], ['length', 1, 'in', 'cm', 2.54, 10], ['length', 1, 'mi', 'km', 1.609344, 10],
  ['area', 1, 'm2', 'ft2', 10.7639104167, 9], ['area', 1, 'ha', 'm2', 10000, 10],
  ['volume', 1, 'L', 'mL', 1000, 10], ['volume', 1, 'm3', 'L', 1000, 10], ['volume', 1, 'gal-us', 'L', 3.785411784, 10],
  ['mass', 1, 'kg', 'g', 1000, 10], ['mass', 1, 'lb', 'kg', .45359237, 10],
  ['temperature', 0, 'C', 'F', 32, 10], ['temperature', 100, 'C', 'F', 212, 10], ['temperature', 0, 'C', 'K', 273.15, 10],
  ['speed', 1, 'm-s', 'km-h', 3.6, 10], ['speed', 100, 'km-h', 'mph', 62.1371, 4],
  ['pressure', 1, 'bar', 'kPa', 100, 10], ['pressure', 1, 'psi', 'kPa', 6.894757, 6], ['pressure', 1, 'atm', 'kPa', 101.325, 10],
];
for (const [category, input, from, to, expected, precision] of examples) {
  test(`${category}: ${input} ${from} → ${to} y conversión inversa`, () => {
    const result = convert(input, category, from, to);
    expect(result.error).toBe('');
    expect(result.value).toBeCloseTo(expected, precision);
    const reverse = convert(result.value!, category, to, from);
    expect(reverse.value).toBeCloseTo(input, 10);
  });
}
test('47 unidades, factores internacionales y pares reversibles', () => {
  expect(categories).toHaveLength(7);
  expect(categories.reduce((sum, category) => sum + category.units.length, 0)).toBe(47);
  expect(convert(1, 'area', 'acre', 'm2').value).toBeCloseTo(4046.8564224, 9);
  expect(convert(1, 'volume', 'gal-imp', 'L').value).toBeCloseTo(4.54609, 10);
  expect(convert(1, 'pressure', 'kgf-cm2', 'Pa').value).toBeCloseTo(98066.5, 8);
  expect(convert(1, 'speed', 'kn', 'km-h').value).toBeCloseTo(1.852, 10);
  for (const category of categories) for (const from of category.units) for (const to of category.units) {
    const forward = convert(17.25, category.id, from.id, to.id);
    expect(forward.error).toBe('');
    expect(convert(forward.value!, category.id, to.id, from.id).value).toBeCloseTo(17.25, 9);
  }
});
test('entrada, negativos, límite físico y desbordamiento', () => {
  for (const input of ['123', '123.45', '0.25', '12,5', '1e3']) expect(parseValue(input).error).toBe('');
  expect(normalizeDecimal('12,5')).toBe('12.5');
  expect(parseValue('12,5').value).toBe(12.5);
  expect(parseValue('').value).toBeNull();
  for (const input of ['NaN', 'Infinity', '1e309', '1,234.5', '1,2,3', 'abc', '1e-999']) expect(parseValue(input).value).toBeNull();
  expect(convert(-5, 'length', 'm', 'cm').warning).not.toBe('');
  expect(convert(-5, 'length', 'm', 'cm').value).toBe(-500);
  expect(convert(-40, 'temperature', 'C', 'F').value).toBeCloseTo(-40, 10);
  expect(convert(-274, 'temperature', 'C', 'K').value).toBeNull();
  expect(convert(-1, 'temperature', 'K', 'C').value).toBeNull();
  expect(convert(-459.67, 'temperature', 'F', 'K').value).toBeCloseTo(0, 10);
  expect(convert(Infinity, 'length', 'm', 'cm').value).toBeNull();
  expect(convert(1e308, 'length', 'km', 'mm').value).toBeNull();
  expect(convert(1e308, 'length', 'km', 'km').value).toBe(1e308);
  expect(convert(1, 'length', 'm', 'kg').value).toBeNull();
});
test('precisión legible sin residuos de floating point', () => {
  expect(formatResult(100)).toBe('100');
  expect(formatResult(.1 + .2)).toBe('0.3');
  expect(formatResult(-0)).toBe('0');
  expect(formatResult(100, '2')).toBe('100.00');
  expect(formatResult(1.23456789, '4')).toBe('1.2346');
  expect(formatResult(1.23456789, '6')).toBe('1.234568');
  expect(formatResult(1e-12)).toBe('1e-12');
  expect(formatResult(1e20)).toBe('1e+20');
  expect(formatResult(1e-5, '2')).toBe('1.00e-5');
  expect(formatResult(NaN)).toBe('');
});
