import { test, expect } from '@playwright/test';
import { parseMoneyInput, formatMoneyInput, parseMoneyField } from '../src/utils/calculators/money';
import { parseAmount } from '../src/utils/calculators/validation';
const cases: [string, number][] = [
  ['30000', 30000], ['30000.5', 30000.5], ['30000.50', 30000.5],
  ['30,000', 30000], ['30,000.00', 30000], ['30,000.5', 30000.5], ['30,000.50', 30000.5],
  ['1,250,000', 1250000], ['1,250,000.75', 1250000.75], ['30000.75', 30000.75],
  ['30.5', 30.5], ['30,50', 30.5], ['30,5', 30.5], ['30.000,50', 30000.5],
  ['1.250.000,75', 1250000.75], ['$30,000.00', 30000], ['$ 1,250,000.50', 1250000.5],
  ['-$30,000.50', -30000.5], ['$-100', -100], ['0', 0], ['.5', .5], ['30.000', 30],
];
for (const [input, expected] of cases) test(`moneda: ${JSON.stringify(input)} → ${expected}`, () => {
  expect(parseMoneyInput(input)).toBe(expected);
  expect(parseMoneyField(input).error).toBe('');
});
test('vacíos y formatos incoherentes nunca son números financieros', () => {
  expect(parseMoneyField('')).toEqual({ value: null, error: '' });
  expect(parseMoneyInput('   ')).toBeNull();
  for (const invalid of ['abc', '30,,000', '30.00.00', '--100', '1,23.45', '30.00,50', '1,234,56', '1234,567', '30,000,5', '30.000.50', 'NaN', 'Infinity', '-Infinity', '1e10', '$$', '30 000', '3'.repeat(400)]) {
    expect(parseMoneyInput(invalid), invalid).toBeNull();
    expect(parseMoneyField(invalid).error).not.toBe('');
  }
});
test('formato es-MX sin símbolo duplicado, manteniendo precisión interna', () => {
  expect(formatMoneyInput(30000)).toBe('30,000.00');
  expect(formatMoneyInput(30000.5)).toBe('30,000.50');
  expect(formatMoneyInput(1250000.75)).toBe('1,250,000.75');
  expect(formatMoneyInput(null)).toBe('');
  expect(formatMoneyInput(Infinity)).toBe('');
  expect(formatMoneyInput(.123456)).toBe('0.12');
  expect(parseMoneyInput('.123456')).toBe(.123456);
});
test('porcentajes conservan su parser sin grouping monetario', () => {
  expect(parseAmount('20.5').value).toBe(20.5);
  expect(parseAmount('20,5').value).toBe(20.5);
  expect(parseAmount('16').value).toBe(16);
  expect(parseAmount('30,000.50').value).toBeNull();
});
