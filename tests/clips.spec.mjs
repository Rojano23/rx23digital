import { test, expect } from '@playwright/test';
const route = '/rx23digital/labs/rx23-clips/';
test('Clips: piloto administrado, SEO, demo sin solicitudes y WhatsApp centralizado', async ({ page }) => {
  const media = [];
  page.on('request', request => { if (/\.(mp4|webm)(\?|$)/.test(request.url())) media.push(request.url()); });
  await page.goto(route);
  await expect(page).toHaveTitle('RX23 Clips | Convierte Videos en Clips para Redes');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://rx23digital.com/labs/rx23-clips/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Transformamos videos en clips cortos para redes sociales con formato vertical, subtítulos, hooks, textos para publicación y revisión humana.');
  await expect(page.locator('main h1')).toHaveText('Convierte tu contenido en piezas listas para redes.');
  await expect(page.locator('.clips-capabilities li')).toHaveCount(6);
  await expect(page.locator('.clips-deliverables article')).toHaveCount(6);
  await expect(page.locator('.clips-process .flow-step')).toHaveCount(6);
  await expect(page.locator('.clips-demo-placeholder')).toHaveCount(3);
  await expect(page.locator('.clips-landing').locator('video,input[type="file"],form')).toHaveCount(0);
  for (const link of await page.locator('.clips-landing a[href*="wa.me"]').all()) {
    const url = new URL(await link.getAttribute('href'));
    expect(url.pathname).toBe('/529617857513');
    expect(url.searchParams.get('text')).toBe('Hola, me interesa realizar una prueba de RX23 Clips.');
  }
  await page.getByRole('link', { name: 'Ver cómo funciona' }).click();
  await expect(page).toHaveURL(/#clips-proceso$/);
  await expect.poll(() => page.locator('#clips-proceso').evaluate(el => el.getBoundingClientRect().top)).toBeLessThan(180);
  await page.locator('.clips-demos').scrollIntoViewIfNeeded();
  expect(media).toEqual([]);
  await expect(page.locator('.clips-rights')).toContainText('derechos o autorización necesaria');
  await page.getByRole('link', { name: 'Volver a Desarrollos', exact: true }).click();
  await expect(page).toHaveURL(/\/rx23digital\/#desarrollos$/);
});
test('FAQ accesible y secuencias una sola vez', async ({ page }) => {
  await page.goto(route);
  const process = page.locator('.clips-process');
  await process.scrollIntoViewIfNeeded();
  await expect(process).toHaveClass(/flow-play-a/);
  const lastBlock = process.locator('.flow-block').last();
  await expect(lastBlock).toHaveCSS('animation-iteration-count', '1');
  await page.waitForTimeout(1500);
  await process.hover();
  await expect(process).not.toHaveClass(/flow-play-b/);
  expect(await lastBlock.evaluate(node => node.getAnimations().filter(animation => animation.playState === 'running').length)).toBe(0);
  const summary = page.locator('.clips-faq summary').first();
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.clips-faq details').first()).toHaveAttribute('open', '');
  await expect(page.locator('.clips-faq details').first().locator('p')).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.locator('.clips-faq details').first()).not.toHaveAttribute('open', '');
  await expect(page.locator('.clips-faq details')).toHaveCount(5);
});
for (const width of [1440,1280,1024,768,390]) {
  test(`Clips responsive ${width}px y reduced motion`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(route);
    for (const section of await page.locator('.clips-landing > section').all()) {
      await section.scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    }
    for (const preview of await page.locator('.clips-preview').all()) {
      const box = await preview.boundingBox();
      expect(Math.abs(box.width / box.height - 9/16)).toBeLessThan(.01);
    }
    await expect(page.locator('.clips-process')).not.toHaveClass(/flow-play/);
    await page.screenshot({ path: testInfo.outputPath(`clips-${width}.png`), fullPage: true, animations: 'disabled', style: '.navbar,.skip-link,.whatsapp-float{visibility:hidden!important}' });
  });
}
test('RX23 SEO conserva contenido, metadatos y flujo originales', async ({ page }) => {
  await page.goto('/rx23digital/labs/rx23-seo/');
  await expect(page).toHaveTitle('RX23 SEO | RX23 Digital');
  await expect(page.locator('main h1')).toHaveText('Conoce las oportunidades de tu presencia digital.');
  await expect(page.locator('.detail-features li')).toHaveCount(6);
  await expect(page.locator('.clips-landing')).toHaveCount(0);
});
