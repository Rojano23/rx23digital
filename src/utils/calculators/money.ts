import { currencyConfig } from './currency';

// Strip only a leading currency prefix; do not alter grouping or the caret.
export function stripMoneyPrefix(input: string): string {
  return input.replace(/^\s*([+-]?)\s*\$\s*/, '$1');
}

export function parseMoneyInput(input: string): number | null {
  let text = stripMoneyPrefix(input.trim()).trim();
  const sign = text.startsWith('-') ? -1 : 1;
  text = text.replace(/^[+-]/, '');
  if (!text) return null;
  const comma = text.lastIndexOf(',');
  const dot = text.lastIndexOf('.');
  let normalized: string;
  if (comma >= 0 && dot >= 0) {
    // The rightmost separator is decimal only if the other groups are valid.
    const decimal = comma > dot ? ',' : '.';
    const grouping = decimal === ',' ? '.' : ',';
    const index = text.lastIndexOf(decimal);
    const integer = text.slice(0, index);
    const fraction = text.slice(index + 1);
    const groups = integer.split(grouping);
    if (!/^\d{1,3}$/.test(groups[0]) || groups.length < 2 || groups.slice(1).some(group => !/^\d{3}$/.test(group)) || !/^\d*$/.test(fraction)) return null;
    normalized = `${groups.join('')}.${fraction}`;
  } else if (comma >= 0) {
    if (/^\d{1,3}(,\d{3})+$/.test(text)) normalized = text.replaceAll(',', '');
    else if (/^\d+,\d{1,2}$/.test(text)) normalized = text.replace(',', '.');
    else return null;
  } else {
    // A lone dot is always decimal (30.000 means 30, not thirty thousand).
    if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)) return null;
    normalized = text;
  }
  const value = sign * Number(normalized);
  if (!Number.isFinite(value) || (value === 0 && /[1-9]/.test(normalized))) return null;
  return Object.is(value, -0) ? 0 : value;
}

const inputFormatter = new Intl.NumberFormat(currencyConfig.locale, {
  useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2,
});
export function formatMoneyInput(value: number | null): string {
  return value === null || !Number.isFinite(value) ? '' : inputFormatter.format(Object.is(value, -0) ? 0 : value);
}

export function parseMoneyField(input: string): { value: number | null; error: string } {
  const value = parseMoneyInput(input);
  return { value, error: input.trim() && value === null ? 'Puedes escribir, por ejemplo: 30000, 30,000 o 30,000.50.' : '' };
}
