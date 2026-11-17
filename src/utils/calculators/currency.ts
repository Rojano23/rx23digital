export const currencyConfig = { locale: 'es-MX', currency: 'MXN' };
export function formatCurrency(value: number, currency = currencyConfig.currency, locale = currencyConfig.locale) {
  return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Object.is(value, -0) ? 0 : value);
}
export const formatPercent = (value: number) => `${new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 }).format(value)} %`;
export const formatUnits = (value: number) => `${new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 }).format(value)} unidades`;
