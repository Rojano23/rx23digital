import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';
const route = '/rx23digital/herramientas/generador-qr/';
const image = page => page.getByAltText('Código QR generado con tu información');
function readQr(buffer) {
  const png = PNG.sync.read(buffer);
  return jsQR(new Uint8ClampedArray(png.data), png.width, png.height)?.data;
}
async function expectPayload(page, payload) {
  await expect.poll(async () => {
    const source = await image(page).getAttribute('src').catch(() => null);
    return source ? readQr(Buffer.from(source.split(',')[1], 'base64')) : null;
  }).toBe(payload);
}
test.beforeEach(async ({ page }) => { await page.goto(route); });

test('seis tipos de QR se generan y se decodifican', async ({ page }) => {
  test.setTimeout(60000);
  await expect(page.getByRole('button', { name: 'Descargar PNG' })).toBeDisabled();
  await page.getByLabel('Dirección web').fill('https://rx23digital.com');
  await expectPayload(page, 'https://rx23digital.com');
  await page.getByRole('button', { name: 'Texto', exact: true }).click();
  await page.getByLabel('Texto', { exact: true }).fill('Hola desde RX23 Digital');
  await expectPayload(page, 'Hola desde RX23 Digital');
  await page.getByRole('button', { name: 'WhatsApp', exact: true }).click();
  await page.getByLabel('Número', { exact: true }).fill('9617857513');
  await page.getByLabel('Mensaje opcional').fill('Hola, me interesa conocer RX23 Digital');
  await expectPayload(page, 'https://wa.me/529617857513?text=Hola%2C%20me%20interesa%20conocer%20RX23%20Digital');
  await page.getByLabel('Código de país').fill('34');
  await page.getByLabel('Número', { exact: true }).fill('612345678');
  await expectPayload(page, 'https://wa.me/34612345678?text=Hola%2C%20me%20interesa%20conocer%20RX23%20Digital');
  await page.getByRole('button', { name: 'Correo', exact: true }).click();
  await page.getByLabel('Correo electrónico').fill('contacto@rx23digital.com');
  await page.getByLabel('Mensaje opcional').fill('');
  await expectPayload(page, 'mailto:contacto@rx23digital.com');
  await page.getByLabel('Asunto opcional').fill('Hola & más');
  await page.getByLabel('Mensaje opcional').fill('A&B\nSí');
  await expectPayload(page, 'mailto:contacto@rx23digital.com?subject=Hola%20%26%20m%C3%A1s&body=A%26B%0AS%C3%AD');
  await page.getByRole('button', { name: 'Teléfono', exact: true }).click();
  await page.getByLabel('Código de país').fill('+52');
  await page.getByLabel('Número', { exact: true }).fill('+52 9617857513');
  await expectPayload(page, 'tel:+529617857513');
  await page.getByRole('button', { name: 'Wi-Fi', exact: true }).click();
  await page.getByLabel('Nombre de red / SSID').fill('SSID de prueba');
  await page.getByLabel('Contraseña', { exact: true }).fill('password de prueba');
  await expectPayload(page, 'WIFI:T:WPA;S:SSID de prueba;P:password de prueba;H:false;;');
  await page.getByLabel('Nombre de red / SSID').fill('RX23;Wi:Fi,\\"');
  await page.getByLabel('Red oculta').check();
  await expectPayload(page, 'WIFI:T:WPA;S:RX23\\;Wi\\:Fi\\,\\\\\\";P:password de prueba;H:true;;');
  await page.getByRole('combobox', { name: 'Seguridad', exact: true }).selectOption('nopass');
  await expectPayload(page, 'WIFI:T:nopass;S:RX23\\;Wi\\:Fi\\,\\\\\\";H:true;;');
  await page.getByRole('combobox', { name: 'Seguridad', exact: true }).selectOption('WEP');
  await expectPayload(page, 'WIFI:T:WEP;S:RX23\\;Wi\\:Fi\\,\\\\\\";P:password de prueba;H:true;;');
});

test('PNG y SVG descargan, colores, tamaños, corrección y reset', async ({ page }) => {
  await page.getByLabel('Dirección web').fill('https://rx23digital.com');
  await expectPayload(page, 'https://rx23digital.com');
  await page.getByRole('combobox', { name: 'Tamaño', exact: true }).selectOption('1024');
  await page.locator('#qr-foreground').fill('#006080');
  await page.locator('#qr-background').fill('#f0faff');
  await page.getByRole('combobox', { name: 'Resistencia del QR', exact: true }).selectOption('H');
  await expectPayload(page, 'https://rx23digital.com');
  let pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Descargar PNG' }).click();
  const png = await pending;
  expect(png.suggestedFilename()).toBe('rx23-qr.png');
  const buffer = await readFile(await png.path());
  expect(readQr(buffer)).toBe('https://rx23digital.com');
  const decoded = PNG.sync.read(buffer);
  expect(decoded.width).toBe(1024);
  expect(decoded.height).toBe(1024);
  expect([...decoded.data.subarray(0, 4)]).toEqual([240, 250, 255, 255]);
  pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Descargar SVG' }).click();
  const svg = await pending;
  expect(svg.suggestedFilename()).toBe('rx23-qr.svg');
  const svgText = await readFile(await svg.path(), 'utf8');
  expect(svgText).toContain('<svg');
  expect(svgText).toContain('#006080');
  const rasterized = await page.evaluate(async text => {
    const url = URL.createObjectURL(new Blob([text], { type: 'image/svg+xml' }));
    const img = new Image(); img.src = url; await img.decode();
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 1024;
    canvas.getContext('2d').drawImage(img, 0, 0, 1024, 1024); URL.revokeObjectURL(url);
    return canvas.toDataURL();
  }, svgText);
  expect(readQr(Buffer.from(rasterized.split(',')[1], 'base64'))).toBe('https://rx23digital.com');
  await page.getByRole('combobox', { name: 'Tamaño', exact: true }).selectOption('256');
  await expectPayload(page, 'https://rx23digital.com');
  await page.locator('#qr-foreground').fill('#ffffff');
  await expect(page.getByText('El contraste seleccionado puede dificultar la lectura del QR.')).toBeVisible();
  await page.getByRole('button', { name: 'Restablecer diseño' }).click();
  await expect(page.locator('#qr-foreground')).toHaveValue('#112e48');
  await expect(page.locator('#qr-background')).toHaveValue('#ffffff');
  await expect(page.locator('#qr-size')).toHaveValue('512');
  await expect(page.locator('#qr-margin')).toHaveValue('4');
  await expect(page.locator('#qr-correction')).toHaveValue('M');
  await expectPayload(page, 'https://rx23digital.com');
});

test('datos inválidos deshabilitan descargas y la información no se transmite ni almacena', async ({ page }) => {
  const requests = [];
  page.on('request', request => requests.push({ url: request.url(), body: request.postData() }));
  await page.getByLabel('Dirección web').fill('javascript:alert(1)');
  await expect(page.getByRole('button', { name: 'Descargar PNG' })).toBeDisabled();
  await expect(page.getByText('Escribe una dirección completa', { exact: false })).toBeVisible();
  await page.getByLabel('Dirección web').fill('https://rx23digital.com/qr-private-test');
  await expectPayload(page, 'https://rx23digital.com/qr-private-test');
  await page.getByLabel('Dirección web').fill('');
  await expect(page.getByRole('button', { name: 'Descargar SVG' })).toBeDisabled();
  expect(requests.some(request => `${request.url}${request.body}`.includes('qr-private-test'))).toBe(false);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
  await page.reload();
  await expect(page.getByLabel('Dirección web')).toHaveValue('');
});

test('navegación, metadatos y acceso directo', async ({ page }) => {
  await expect(page).toHaveTitle('Generador de QR Gratis | RX23 Digital');
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://rx23digital.com/herramientas/generador-qr');
  await page.getByRole('link', { name: '← Volver a Herramientas' }).click();
  await expect(page).toHaveURL(/\/rx23digital\/#herramientas$/);
  await expect.poll(async () => page.locator('#herramientas').evaluate(el => Math.round(el.getBoundingClientRect().top))).toBeLessThan(110);
  await page.getByRole('link', { name: /Generador de QR.*Disponible/ }).click();
  await expect(page).toHaveURL(new RegExp(`${route}$`));
  await expect(page.getByRole('heading', { name: 'Generador de QR', exact: true })).toBeVisible();
});

for (const width of [1440,1280,1024,768,390]) {
  test(`responsive ${width}px, QR cuadrado y sin scroll horizontal`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.getByLabel('Dirección web').fill('https://rx23digital.com');
    await expectPayload(page, 'https://rx23digital.com');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const label of ['Resistencia del QR', 'Margen exterior']) {
      await page.getByRole('button', { name: `Ayuda: ${label}` }).focus();
      const tooltip = page.getByRole('tooltip');
      await expect(tooltip).toBeVisible();
      const tipBox = await tooltip.boundingBox();
      expect(tipBox.x).toBeGreaterThanOrEqual(0);
      expect(tipBox.x + tipBox.width).toBeLessThanOrEqual(width);
      await page.getByRole('button', { name: `Ayuda: ${label}` }).press('Escape');
    }
    const box = await image(page).boundingBox();
    expect(Math.abs(box.width - box.height)).toBeLessThan(1);
    await page.screenshot({ path: testInfo.outputPath(`qr-${width}.png`), fullPage: true });
  });
}

test('capacidad excedida, recuperación, teclado y movimiento reducido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const textType = page.getByRole('button', { name: 'Texto', exact: true });
  await textType.focus();
  await textType.press('Space');
  await expect(textType).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('textbox', { name: 'Texto', exact: true }).fill('界'.repeat(1200));
  await page.getByRole('combobox', { name: 'Resistencia del QR', exact: true }).selectOption('H');
  await expect(page.getByText('El contenido es demasiado largo', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Descargar PNG' })).toBeDisabled();
  await page.getByRole('textbox', { name: 'Texto', exact: true }).fill('Hola desde RX23 Digital');
  await expectPayload(page, 'Hola desde RX23 Digital');
  expect(await image(page).evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  const margin = page.getByRole('slider');
  await margin.focus();
  await margin.press('ArrowRight');
  await expect(margin).toHaveValue('5');
  await page.getByRole('button', { name: 'Restablecer diseño' }).click();
  await expect(margin).toHaveValue('4');
  await expectPayload(page, 'Hola desde RX23 Digital');
});

test('personalización: nombres amigables, explicaciones y ayudas por teclado', async ({ page }) => {
  const resistance = page.getByRole('combobox', { name: 'Resistencia del QR', exact: true });
  await expect(resistance).toHaveValue('M');
  const descriptions = [
    ['L', 'Básica', 'Para códigos limpios y uso digital. Tolera daños menores.'],
    ['M', 'Recomendada', 'Buen equilibrio entre tamaño y resistencia para uso general.'],
    ['Q', 'Alta', 'Tolera mayor deterioro o interferencias en impresión.'],
    ['H', 'Máxima', 'Mayor resistencia. Útil cuando el QR puede dañarse o llevar elementos superpuestos.'],
  ];
  for (const [value, label, description] of descriptions) {
    await resistance.selectOption(value);
    await expect(resistance.locator('option:checked')).toHaveText(label);
    await expect(page.locator('#qr-resistance-description')).toHaveText(description);
  }
  const marginHelp = page.getByRole('button', { name: 'Ayuda: Margen exterior' });
  await marginHelp.focus();
  await expect(page.getByRole('tooltip')).toHaveText('El margen permite que la cámara identifique con claridad dónde comienza y termina el código.');
  await marginHelp.press('Escape');
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  const resistanceHelp = page.getByRole('button', { name: 'Ayuda: Resistencia del QR' });
  await resistanceHelp.focus();
  await expect(page.getByRole('tooltip')).toHaveText('Una resistencia mayor permite recuperar el QR aunque una parte esté dañada o cubierta, pero también puede hacerlo más denso.');
  await resistanceHelp.press('Tab');
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await marginHelp.hover();
  await expect(page.getByRole('tooltip')).toBeVisible();
  await page.getByRole('heading', { name: 'Generador de QR', exact: true }).hover();
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await page.getByRole('slider', { name: 'Margen exterior' }).focus();
  await page.getByRole('slider', { name: 'Margen exterior' }).press('ArrowRight');
  await expect(page.getByText('Actual: 5 módulos')).toBeVisible();
  await page.getByRole('button', { name: 'Restablecer diseño' }).click();
  await expect(resistance).toHaveValue('M');
  await expect(page.getByText('Actual: 4 módulos')).toBeVisible();
});
