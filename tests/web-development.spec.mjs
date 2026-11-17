import { test, expect } from '@playwright/test';
const route = '/rx23digital/servicios/desarrollo-web/';

test('landing comercial: contenido, proyectos, SEO y navegación', async ({ page }) => {
  await page.goto(route);
  await expect(page).toHaveTitle('Desarrollo Web para Negocios | RX23 Digital');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://rx23digital.com/servicios/desarrollo-web/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Diseñamos y desarrollamos páginas web, sitios corporativos, catálogos digitales y soluciones web para negocios y empresas.');
  await expect(page.locator('main h1')).toHaveText('Desarrollo web');
  await expect(page.locator('.web-type-card')).toHaveCount(4);
  await expect(page.locator('.web-essentials-grid > div')).toHaveCount(11);
  await expect(page.locator('.web-process .flow-step')).toHaveCount(5);
  const projectLinks = page.locator('.web-development .project-card a');
  await expect(projectLinks).toHaveCount(3);
  expect(await projectLinks.evaluateAll(links => links.map(link => link.href))).toEqual(['https://constructorarogin.com/', 'https://hidratodo.com/', 'https://www.epc-ste.com/']);
  for (const image of await page.locator('.web-development .project-image > img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBeTruthy();
  }
  await page.getByRole('link', { name: 'Ver proyectos realizados' }).click();
  await expect(page).toHaveURL(/#web-proyectos$/);
  await expect.poll(() => page.locator('#web-proyectos').evaluate(el => Math.round(el.getBoundingClientRect().top))).toBeLessThan(180);
  await expect(page.getByRole('link', { name: 'Cuéntanos tu proyecto' })).toHaveAttribute('href', /wa\.me\/.*text=/);
  await page.getByRole('link', { name: 'Ver planes', exact: true }).first().click();
  await expect(page).toHaveURL(/\/rx23digital\/#planes$/);
  await expect.poll(() => page.locator('#planes').evaluate(el => Math.round(el.getBoundingClientRect().top))).toBeLessThan(180);
});

for (const width of [1440, 1280, 1024, 768, 390]) {
  test(`landing responsive ${width}px y movimiento reducido`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(route);
    await expect(page.locator('.web-service-hero')).toBeVisible();
    for (const section of await page.locator('.web-development > section').all()) {
      await section.scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    }
    await expect(page.locator('.web-process')).not.toHaveClass(/flow-play/);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: testInfo.outputPath(`web-${width}.png`), fullPage: true, animations: 'disabled', style: '.navbar,.skip-link,.whatsapp-float{visibility:hidden!important}' });
  });
}

test('los otros servicios y rutas legacy conservan comportamiento', async ({ page }) => {
  for (const path of ['servicios/hosting-correo-empresarial', 'servicios/hosting', 'servicios/dominios', 'servicios/correo-empresarial', 'servicios/aplicaciones', 'labs/rx23-clips', 'labs/rx23-seo']) {
    await page.goto(`/rx23digital/${path}/`);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('.web-development')).toHaveCount(0);
  }

  await page.goto('/rx23digital/servicios/soporte-digital/');
  await expect(page).toHaveURL(/\/rx23digital\/#servicios$/);
  await expect(page.locator('#servicios .service-card')).toHaveCount(3);
});
