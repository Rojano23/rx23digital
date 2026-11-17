import { test, expect } from '@playwright/test';
const route = '/rx23digital/herramientas/calculadora/';
const result = page => page.getByRole('region', { name: 'Resultados', exact: true });
async function fill(page, values) {
  for (const [label, value] of Object.entries(values)) await page.getByRole('textbox', { name: label, exact: true }).fill(value);
}
test.beforeEach(async ({ page }) => { await page.goto(route); });

test('cinco calculadoras con los ejemplos obligatorios y modos', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Copiar resultado' })).toBeDisabled();
  await fill(page, { 'Costo del producto': '100', 'Margen deseado': '30' });
  await expect(result(page).getByText('$142.86', { exact: true })).toBeVisible();
  await expect(result(page).getByText('$42.86', { exact: true })).toBeVisible();
  await expect(result(page).getByText('30 %', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Margen y utilidad', exact: true }).click();
  await fill(page, { Costo: '100', 'Precio de venta': '150' });
  await expect(result(page).getByText('$50.00', { exact: true })).toBeVisible();
  await expect(result(page).getByText('33.33 %', { exact: true })).toBeVisible();
  await expect(result(page).getByText('50 %', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'IVA', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Tasa IVA' })).toHaveValue('16');
  await fill(page, { Importe: '1000' });
  await expect(result(page).getByText('$1,160.00', { exact: true })).toBeVisible();
  await expect(result(page).getByText('$160.00', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Quitar IVA', exact: true }).click();
  await fill(page, { Importe: '1160' });
  await expect(result(page).locator('.business-primary')).toHaveText('$1,000.00');
  await expect(result(page).getByText('$160.00', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Descuentos', exact: true }).click();
  await expect(page.getByRole('checkbox', { name: 'Agregar segundo descuento' })).not.toBeChecked();
  await fill(page, { 'Precio original': '1000', Descuento: '20' });
  await expect(result(page).locator('.business-primary')).toHaveText('$800.00');
  await page.getByRole('checkbox', { name: 'Agregar segundo descuento' }).check();
  await fill(page, { 'Segundo descuento': '10' });
  await expect(result(page).locator('.business-primary')).toHaveText('$720.00');
  await expect(result(page).getByText('$800.00', { exact: true })).toBeVisible();
  await expect(result(page).getByText('28 %', { exact: true })).toBeVisible();
  await page.getByRole('checkbox', { name: 'Agregar segundo descuento' }).uncheck();
  await expect(result(page).locator('.business-primary')).toHaveText('$800.00');
  await page.getByRole('button', { name: 'Punto de equilibrio', exact: true }).click();
  await fill(page, { 'Costos fijos mensuales': '10000', 'Precio de venta por unidad': '150', 'Costo variable por unidad': '100' });
  await expect(result(page).locator('.business-primary')).toHaveText('200 unidades');
  await expect(result(page).getByText('$30,000.00', { exact: true })).toBeVisible();
  await expect(result(page).getByText('$50.00', { exact: true })).toBeVisible();
});

test('errores discretos, coma decimal, campos vacíos y división por cero', async ({ page }) => {
  await fill(page, { 'Costo del producto': '100,50', 'Margen deseado': '30' });
  await expect(page.getByRole('textbox', { name: 'Costo del producto' })).toHaveValue('100.50');
  await fill(page, { 'Costo del producto': '-100' });
  await expect(page.getByText('El costo no puede ser negativo.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copiar resultado' })).toBeDisabled();
  await fill(page, { 'Costo del producto': '100', 'Margen deseado': '100' });
  await expect(page.getByText('El margen debe ser menor', { exact: false })).toBeVisible();
  await fill(page, { 'Margen deseado': '' });
  await expect(page.getByRole('textbox', { name: 'Margen deseado' })).toHaveValue('');
  await expect(page.getByText('Completa los campos para ver el resultado.')).toBeVisible();
  await page.getByRole('button', { name: 'Punto de equilibrio', exact: true }).click();
  await fill(page, { 'Costos fijos mensuales': '10000', 'Precio de venta por unidad': '100', 'Costo variable por unidad': '100' });
  await expect(page.getByText('El precio de venta debe ser mayor al costo variable', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Margen y utilidad', exact: true }).click();
  await fill(page, { Costo: '0', 'Precio de venta': '150' });
  await expect(result(page).getByText('No aplica (costo cero)')).toBeVisible();
  await expect(result(page).getByText('100 %', { exact: true })).toBeVisible();
});

test('copia local con feedback y sin transmisión ni persistencia', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const requests = [];
  page.on('request', request => requests.push(request.url() + (request.postData() ?? '')));
  await fill(page, { 'Costo del producto': '98765.43', 'Margen deseado': '30' });
  await page.getByRole('button', { name: 'Copiar resultado' }).click();
  await expect(page.getByText('Resultado copiado', { exact: true })).toBeVisible();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('Precio de venta: $141,093.47');
  expect(copied).toContain('Margen: 30 %');
  await expect(page.getByText('Resultado copiado', { exact: true })).not.toBeVisible({ timeout: 2500 });
  expect(requests.some(request => request.includes('98765'))).toBe(false);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length, document.cookie])).toEqual([0, 0, '']);
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Costo del producto' })).toHaveValue('');
});

test('SEO, ruta directa, herramientas y regreso al Home', async ({ page }) => {
  await expect(page).toHaveTitle('Calculadoras para Negocios Gratis | RX23 Digital');
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://rx23digital.com/herramientas/calculadora');
  await page.getByRole('link', { name: '← Volver a Herramientas' }).click();
  await expect(page).toHaveURL(/\/rx23digital\/#herramientas$/);
  await expect.poll(() => page.locator('#herramientas').evaluate(element => element.getBoundingClientRect().top)).toBeLessThan(110);
  await expect(page.getByRole('link', { name: /Generador de QR.*Disponible/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Conversor de unidades.*Disponible/ })).toBeVisible();
  await expect(page.locator('.tool-card').filter({ hasText: 'Herramientas técnicas' })).toContainText('Próximamente');
  await page.getByRole('link', { name: /Calculadoras para negocios.*Disponible/ }).click();
  await expect(page).toHaveURL(new RegExp(`${route}$`));
});

for (const width of [1440,1280,1024,768,390]) {
  test(`calculadoras responsive ${width}px y movimiento reducido`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await fill(page, { 'Costo del producto': '100', 'Margen deseado': '30' });
    await expect(result(page).getByText('$142.86', { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`business-${width}.png`), fullPage: true });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.getByRole('button', { name: 'Punto de equilibrio', exact: true }).click();
    await fill(page, { 'Costos fijos mensuales': '10000', 'Precio de venta por unidad': '150', 'Costo variable por unidad': '100' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('.business-result-values').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  });
}
