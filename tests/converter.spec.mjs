import { test, expect } from '@playwright/test';
const route = '/rx23digital/herramientas/conversor/';
test.beforeEach(async ({ page }) => { await page.goto(route); });
const from = page => page.getByRole('combobox', { name: 'Unidad de origen', exact: true });
const to = page => page.getByRole('combobox', { name: 'Unidad de destino', exact: true });
const result = page => page.getByRole('textbox', { name: 'Resultado', exact: true });
const value = page => page.getByRole('textbox', { name: 'Valor', exact: true });

test('conversión automática, coma, intercambio, precisión y límites', async ({ page }) => {
  await expect(result(page)).toHaveValue('100');
  await expect(page.getByText('1 metro = 100 centímetros', { exact: true })).toBeVisible();
  await value(page).fill('12,5');
  await expect(value(page)).toHaveValue('12.5');
  await expect(result(page)).toHaveValue('1250');
  await value(page).fill('1');
  await page.getByRole('button', { name: 'Intercambiar unidades', exact: true }).click();
  await expect(from(page)).toHaveValue('cm');
  await expect(to(page)).toHaveValue('m');
  await expect(result(page)).toHaveValue('0.01');
  await page.getByRole('combobox', { name: 'Decimales', exact: true }).selectOption('4');
  await expect(result(page)).toHaveValue('0.0100');
  await value(page).fill('-1');
  await expect(page.getByRole('status')).toContainText(['', 'Revisa el signo:']);
  await expect(result(page)).toHaveValue('-0.0100');
  await page.getByRole('button', { name: 'Temperatura', exact: true }).click();
  await value(page).fill('-40');
  await expect(result(page)).toHaveValue('-40.0000');
  await value(page).fill('-274');
  await expect(result(page)).toHaveValue('');
  await expect(page.getByText('La temperatura no puede estar por debajo', { exact: false })).toBeVisible();
  await value(page).fill('Infinity');
  await expect(result(page)).toHaveValue('');
  await expect(page.getByRole('button', { name: 'Copiar resultado' })).toBeDisabled();
});

test('categorías sin unidades cruzadas y equivalencias', async ({ page }) => {
  const cases = [ ['Área', 'ha', 'm2', '10000'], ['Volumen', 'gal-us', 'L', '3.785411784'], ['Masa', 'lb', 'kg', '0.45359237'], ['Temperatura', 'C', 'F', '33.8'], ['Velocidad', 'm-s', 'km-h', '3.6'], ['Presión', 'bar', 'kPa', '100'] ];
  for (const [category, source, destination, expected] of cases) {
    await page.getByRole('button', { name: category, exact: true }).click();
    await from(page).selectOption(source); await to(page).selectOption(destination);
    await expect(result(page)).toHaveValue(expected);
    await expect(page.locator('.converter-equivalence')).not.toBeEmpty();
  }
});

test('copiar, feedback temporal y privacidad', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const requests = [];
  page.on('request', request => requests.push(request.url() + (request.postData() || '')));
  await value(page).fill('98765.4321');
  await page.getByRole('button', { name: 'Copiar resultado' }).click();
  await expect(page.getByText('Resultado copiado', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('9876543.21');
  await expect(page.getByText('Resultado copiado', { exact: true })).not.toBeVisible({ timeout: 2500 });
  expect(requests.some(url => url.includes('98765'))).toBe(false);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
  await page.reload(); await expect(value(page)).toHaveValue('1');
});

test('SEO, regreso a Herramientas y tarjeta disponible', async ({ page }) => {
  await expect(page).toHaveTitle('Conversor de Unidades Gratis | RX23 Digital');
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://rx23digital.com/herramientas/conversor');
  await page.getByRole('link', { name: '← Volver a Herramientas' }).click();
  await expect(page).toHaveURL(/\/rx23digital\/#herramientas$/);
  await expect.poll(() => page.locator('#herramientas').evaluate(el => el.getBoundingClientRect().top)).toBeLessThan(110);
  await page.getByRole('link', { name: /Conversor de unidades.*Disponible/ }).click();
  await expect(page).toHaveURL(new RegExp(`${route}$`));
  await expect(page.getByRole('heading', { name: 'Conversor de unidades', exact: true })).toBeVisible();
});
for (const width of [1440,1280,1024,768,390]) {
  test(`conversor responsive ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(result(page)).toHaveValue('100');
    await page.screenshot({ path: testInfo.outputPath(`converter-${width}.png`), fullPage: true });
    await page.getByRole('button', { name: 'Presión', exact: true }).click();
    await to(page).selectOption('kgf-cm2');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(await page.locator('.converter-stage').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  });
}
