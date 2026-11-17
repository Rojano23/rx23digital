import { test, expect } from '@playwright/test';
const route = '/rx23digital/herramientas/calculadora/';
const field = (page, name) => page.getByRole('textbox', { name, exact: true });
const result = page => page.getByRole('region', { name: 'Resultados', exact: true });
test.beforeEach(async ({ page }) => { await page.goto(route); });

test('30,000 se calcula como treinta mil, edición natural y blur agrupado', async ({ page }) => {
  const cost = field(page, 'Costo del producto');
  await cost.fill('30,000.00');
  await field(page, 'Margen deseado').fill('10');
  await expect(cost).toHaveValue('30,000.00');
  await expect(result(page).getByText('$33,333.33', { exact: true })).toBeVisible();
  await expect(result(page).getByText('$3,333.33', { exact: true })).toBeVisible();
  await cost.fill('30000');
  await expect(cost).toHaveValue('30000');
  await cost.press('Tab');
  await expect(cost).toHaveValue('30,000.00');
  await cost.focus();
  await expect(cost).toHaveValue('30,000.00');
  await cost.fill('30,000');
  await expect(result(page).getByText('$33,333.33', { exact: true })).toBeVisible();
  await expect(page.locator('#business-validation')).toBeEmpty();
  await cost.fill('');
  await cost.press('Tab');
  await expect(cost).toHaveValue('');
  await expect(page.getByRole('button', { name: 'Copiar resultado' })).toBeDisabled();
});

test('millones, símbolo pegado, formato europeo y precisión sin redondeo intermedio', async ({ page }) => {
  const cost = field(page, 'Costo del producto');
  await field(page, 'Margen deseado').fill('10');
  await cost.fill('$ 1,250,000.50');
  await cost.press('Tab');
  await expect(cost).toHaveValue('1,250,000.50');
  await expect(result(page).getByText('$1,388,889.44', { exact: true })).toBeVisible();
  await cost.fill('30.000,50'); await cost.press('Tab');
  await expect(cost).toHaveValue('30,000.50');
  await expect(page.locator('#business-validation')).toBeEmpty();
  await cost.fill('0.123456'); await cost.press('Tab');
  await expect(cost).toHaveValue('0.12');
  await expect(result(page).getByText('$0.14', { exact: true })).toBeVisible();
  await cost.focus(); await expect(cost).toHaveValue('0.12');
  await expect(result(page).getByText('$0.14', { exact: true })).toBeVisible();
  await cost.fill('30,,000');
  await expect(page.getByRole('button', { name: 'Copiar resultado' })).toBeDisabled();
  await expect(page.getByText('Puedes escribir, por ejemplo: 30000, 30,000 o 30,000.50.')).toBeVisible();
});

test('todos los campos monetarios usan el parser, porcentajes sin moneda', async ({ page }) => {
  await page.getByRole('button', { name: 'Margen y utilidad', exact: true }).click();
  await field(page, 'Costo').fill('30,000'); await field(page, 'Precio de venta').fill('45,000');
  await expect(result(page).getByText('$15,000.00', { exact: true })).toBeVisible();
  await expect(result(page).getByText('33.33 %', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'IVA', exact: true }).click();
  await field(page, 'Importe').fill('30,000'); await field(page, 'Tasa IVA').focus();
  await expect(field(page, 'Tasa IVA')).toHaveValue('16');
  await expect(result(page).getByText('$34,800.00', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Descuentos', exact: true }).click();
  await field(page, 'Precio original').fill('30,000'); await field(page, 'Descuento').fill('20.5');
  await field(page, 'Precio original').focus();
  await expect(field(page, 'Descuento')).toHaveValue('20.5');
  await expect(result(page).getByText('$23,850.00', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Punto de equilibrio', exact: true }).click();
  await field(page, 'Costos fijos mensuales').fill('3,000');
  await field(page, 'Precio de venta por unidad').fill('800');
  await field(page, 'Costo variable por unidad').fill('430');
  await expect(result(page).getByText('9 unidades', { exact: true })).toBeVisible();
  await expect(result(page).getByText('$370.00', { exact: true })).toBeVisible();
  await expect(result(page).getByText('$7,200.00', { exact: true })).toBeVisible();
});
for (const width of [1440,1280,1024,768,390]) test(`importe largo responsive ${width}px`, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height: 1000 });
  const cost = field(page, 'Costo del producto');
  await cost.fill('$1,250,000,000.50');
  await field(page, 'Margen deseado').fill('10');
  await expect(cost).toHaveValue('1,250,000,000.50');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath(`money-${width}.png`), fullPage: true });
});
