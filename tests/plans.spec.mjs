import { test, expect } from '@playwright/test';
const base = '/rx23digital/';
const expectedPlans = [
  { id: 'presencia', name: 'Presencia', development: '$2,990 MXN', annual: '$899 MXN', total: '$3,889 MXN', gb: 2, emails: 2, cta: 'Elegir Presencia', message: 'Hola, me interesa el plan Presencia de RX23 Digital.' },
  { id: 'negocio', name: 'Negocio', development: '$5,490 MXN', annual: '$1,299 MXN', total: '$6,789 MXN', gb: 4, emails: 5, cta: 'Elegir Negocio', message: 'Hola, me interesa el plan Negocio de RX23 Digital.' },
  { id: 'profesional', name: 'Profesional', development: '$8,900 MXN', annual: '$1,799 MXN', total: '$10,699 MXN', gb: 6, emails: 10, cta: 'Cotizar proyecto', message: 'Hola, quiero cotizar un proyecto Profesional con RX23 Digital.' },
];
test('planes: desglose, total, renovación, límites y WhatsApp correctos', async ({ page }) => {
  await page.goto(`${base}#planes`);
  const section = page.locator('#planes');
  await expect(section.locator('[data-plan]')).toHaveCount(3);
  for (const plan of expectedPlans) {
    const card = section.locator(`[data-plan="${plan.id}"]`);
    await expect(card.getByRole('heading', { name: plan.name, exact: true })).toBeVisible();
    await expect(card.locator('.plan-price strong')).toHaveText(plan.total);
    await expect(card.locator('.plans-breakdown dd').first()).toHaveText(`${plan.id === 'profesional' ? 'Desde ' : ''}${plan.development}`);
    await expect(card.locator('.plans-breakdown dd').last()).toHaveText(`${plan.annual} / año`);
    await expect(card.locator('.plans-renewal strong')).toHaveText(`${plan.annual} / año`);
    await expect(card.locator('.plans-features')).toContainText(`Hasta ${plan.gb} GB de hosting`);
    await expect(card.locator('.plans-features')).toContainText(`Hasta ${plan.emails} cuentas de correo empresarial`);
    const url = new URL(await card.getByRole('link', { name: plan.cta }).getAttribute('href'));
    expect(url.pathname).toBe('/529617857513');
    expect(url.searchParams.get('text')).toBe(plan.message);
    await expect(section.locator(`[data-infrastructure="${plan.id}"] strong`)).toHaveText(`${plan.annual} / año`);
    await expect(section.locator(`[data-renewal="${plan.id}"] dd`)).toHaveText(`${plan.annual} / año`);
  }
  await expect(section.locator('[data-plan="profesional"] .plan-price>span')).toHaveText('Desde');
  await expect(section.locator('.plans-recommended')).toHaveText('RECOMENDADO');
  await expect(section).not.toContainText(/ilimitad|más vendido|bajo cotización|sin costos ocultos/i);
  await expect(section).toContainText('El desarrollo de tu sitio no vuelve a cobrarse cada año.');
  await expect(section).toContainText('Otros dominios o extensiones pueden cotizarse por separado.');
  await expect(section).toContainText('nombre@tuempresa.com');
  await expect(section.locator('table tbody tr')).toHaveCount(10);
  await expect(section.locator('table thead th')).toHaveText(['Características','Presencia','Negocio','Profesional']);
  await section.getByRole('link', { name: 'Ver Desarrollo Web', exact: true }).click();
  await expect(page).toHaveURL(`${base}servicios/desarrollo-web/`);
  await expect(page.locator('main h1')).toHaveText('Desarrollo web');
});
for (const path of ['', 'servicios/desarrollo-web/', 'servicios/aplicaciones/', 'labs/rx23-clips/', 'labs/rx23-seo/', 'desarrollos/homepanel-hogar/', 'herramientas/generador-qr/', 'herramientas/conversor/', 'herramientas/calculadora/']) {
  test(`navegación a Planes desde ${path || 'Home'}`, async ({ page }) => {
    await page.goto(`${base}${path}`);
    if (!path) await page.evaluate(() => { window.__plansSameDocument = true; });
    await page.locator('#main-navigation').getByRole('link', { name: 'Planes', exact: true }).click();
    await expect(page).toHaveURL(`${base}#planes`);
    await expect.poll(() => page.locator('#planes').evaluate(node => Math.round(node.getBoundingClientRect().top))).toBeLessThan(150);
    await expect(page.locator('#main-navigation a[aria-current]')).toHaveText('Planes');
    if (!path) expect(await page.evaluate(() => window.__plansSameDocument)).toBe(true);
  });
}
for (const width of [1440,1280,1024,768,390]) {
  test(`planes responsive ${width}px y comparación accesible`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${base}#planes`);
    const section = page.locator('#planes');
    for (const element of await section.locator('.reveal').all()) {
      await element.scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    }
    const region = section.getByRole('region', { name: /Comparación de planes/ });
    await region.focus();
    await expect(region).toBeFocused();
    if (width === 390) {
      const oldPosition = await region.evaluate(node => node.scrollLeft);
      await page.keyboard.press('ArrowRight');
      await expect.poll(() => region.evaluate(node => node.scrollLeft)).toBeGreaterThan(oldPosition);
    }
    const cards = await section.locator('[data-plan]').all();
    const boxes = await Promise.all(cards.map(card => card.boundingBox()));
    if (width >= 1280) expect(Math.abs(boxes[0].y - boxes[2].y)).toBeLessThan(2);
    if (width <= 1024) expect(boxes[1].y).toBeGreaterThan(boxes[0].y + boxes[0].height);
    await section.screenshot({ path: testInfo.outputPath(`planes-${width}.png`), animations: 'disabled', style: '.navbar,.skip-link,.whatsapp-float{visibility:hidden!important}' });
  });
}
