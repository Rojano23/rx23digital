import { test, expect } from '@playwright/test';
const home = '/rx23digital/';
const sleepAnimations = async locator => expect.poll(() => locator.evaluate(element => getComputedStyle(element).opacity)).toBe('1');
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(home);
  await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
});

test('Hero: profundidad independiente, límites y regreso al salir', async ({ page }) => {
  const visual = page.locator('.hero-visual');
  await expect(visual).toBeVisible();
  await expect.poll(() => visual.evaluate(el => getComputedStyle(el).opacity)).toBe('1');
  const box = await visual.boundingBox();
  await page.mouse.move(box.x + box.width * .9, box.y + box.height * .9);
  await expect.poll(() => visual.evaluate(el => Number(el.style.getPropertyValue('--depth-x')))).toBeGreaterThan(.7);
  for (const [device, maximum] of [['laptop', 3], ['tablet', 6], ['phone', 8]]) {
    const el = visual.locator(`.${device}`);
    await expect.poll(() => el.evaluate(node => parseFloat(getComputedStyle(node).translate))).toBeGreaterThan(maximum * .5);
    const values = await el.evaluate(node => getComputedStyle(node).translate.split(' ').map(parseFloat));
    expect(Math.abs(values[0])).toBeLessThanOrEqual(maximum);
    expect(Math.abs(values[1])).toBeLessThanOrEqual(maximum);
  }
  expect(Math.abs(await visual.locator('.tablet').evaluate(el => parseFloat(getComputedStyle(el).rotate)))).toBeLessThanOrEqual(.5);
  expect(Math.abs(await visual.locator('.phone').evaluate(el => parseFloat(getComputedStyle(el).rotate)))).toBeLessThanOrEqual(1);
  await page.mouse.move(0, 0);
  await expect.poll(() => visual.evaluate(el => el.style.getPropertyValue('--depth-x'))).toBe('0');
  await expect.poll(() => visual.locator('.phone').evaluate(el => Math.abs(parseFloat(getComputedStyle(el).translate)))).toBeLessThan(.01);
  const sources = await visual.locator('.device-screen').evaluateAll(nodes => nodes.map(node => node.getAttribute('src')));
  expect(sources).toEqual(['assets/hero/hero-laptop-licitia.png', 'assets/hero/hero-tablet-homepanel-dashboard.png', 'assets/hero/hero-phone-homepanel-gas.png'].map(path => home + path));
});

test('reveal: una entrada por elemento y contenido visible al volver', async ({ page }) => {
  const card = page.locator('#proyectos .project-card').first();
  await card.evaluate(node => { node.dataset.revealCount = '0'; node.addEventListener('rx23:reveal', () => { node.dataset.revealCount = String(Number(node.dataset.revealCount) + 1); }); });
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveClass(/is-revealed/);
  await sleepAnimations(card);
  await expect(card).toHaveAttribute('data-reveal-count', '1');
  await page.evaluate(() => scrollTo(0, 0));
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute('data-reveal-count', '1');
  await expect(card).toHaveCSS('opacity', '1');
});

test('Desarrollos integra productos y experimentos sin sección Labs separada', async ({ page }) => {
  await expect(page.locator('#labs')).toHaveCount(0);
  await expect(page.locator('#desarrollos .product-card')).toHaveCount(5);
  await expect(page.locator('#desarrollos .product-card').filter({ has: page.getByRole('heading', { name: 'RX23 Clips', exact: true }) })).toHaveCount(1);
  await expect(page.locator('#desarrollos .product-card').filter({ has: page.getByRole('heading', { name: 'RX23 SEO', exact: true }) })).toHaveCount(1);
  await expect(page.locator('#desarrollos .product-card').filter({ has: page.getByRole('heading', { name: 'RX23 Clips', exact: true }) }).locator('.product-cta')).toHaveAttribute('href', /labs\/rx23-clips\/$/);
  await page.goto('/rx23digital/#labs');
  await expect(page).toHaveURL(/\/rx23digital\/#desarrollos$/);
});

test('tarjetas: focus, enlaces conservados y efectos acotados', async ({ page }) => {
  const tool = page.locator('#herramientas .available-tool').first();
  await tool.scrollIntoViewIfNeeded(); await tool.focus();
  await expect(page.locator('#herramientas .tools-availability')).toHaveText('3 herramientas gratis');
  await expect(tool.locator('.tool-status')).toHaveCSS('text-transform', 'uppercase');
  await expect.poll(() => tool.locator('.tool-open svg').evaluate(el => getComputedStyle(el).transform)).toBe('matrix(1, 0, 0, 1, 3, 0)');
  await expect(page.locator('#herramientas .available-tool')).toHaveCount(3);
  await expect(page.locator('#herramientas .pending-tool')).toHaveCount(1);
  const product = page.locator('#desarrollos .product-card').first();
  await product.scrollIntoViewIfNeeded(); await product.locator('.product-cta').focus();
  await expect.poll(() => product.locator('.product-visual>img').evaluate(el => parseFloat(getComputedStyle(el).transform.slice(7)))).toBe(1.015);
  const project = page.locator('#proyectos .project-card').first();
  await project.scrollIntoViewIfNeeded(); await project.locator('.project-content .text-link').focus();
  await expect(project.locator('.project-overlay')).toHaveCSS('opacity', '1');
  await expect(project.locator('.project-overlay')).toContainText('Visitar proyecto');
  expect(await project.locator('.project-content .text-link').getAttribute('href')).toBe('https://constructorarogin.com');
  const hit = await project.locator('.project-image').evaluate(el => {
    const box = el.getBoundingClientRect(); return document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2)?.closest('a')?.getAttribute('href');
  });
  expect(hit).toBe('https://constructorarogin.com');
});

test('reduced motion: contenido visible sin parallax ni secuencias', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.reload();
  for (const selector of ['#servicios .service-card', '#desarrollos .product-card', '#proyectos .project-card', '#herramientas .tool-card', '#planes .plan-card']) {
    const element = page.locator(selector).first(); await element.scrollIntoViewIfNeeded(); await expect(element).toHaveCSS('opacity', '1');
  }
  await page.evaluate(() => scrollTo(0, 0)); await page.locator('.hero-visual').hover();
  await expect(page.locator('.hero-visual .phone')).toHaveCSS('translate', 'none');
  await expect(page.locator('.hero-visual .phone')).toHaveCSS('rotate', 'none');
  const product = page.locator('#desarrollos .product-card').first(); await product.scrollIntoViewIfNeeded(); await product.hover();
  await expect(product.locator('.product-visual>img')).toHaveCSS('transform', 'none');
});

test('táctil: sin parallax y navegación disponible por tap', async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage(); await page.goto(home);
  const visual = page.locator('.hero-visual');
  await visual.dispatchEvent('pointermove', { pointerType: 'touch', clientX: 250, clientY: 500 });
  await expect(visual.locator('.phone')).toHaveCSS('translate', 'none');
  const tool = page.locator('#herramientas .available-tool').first(); await tool.scrollIntoViewIfNeeded(); await tool.tap();
  await expect(page).toHaveURL(/herramientas\/generador-qr\/$/);
  await context.close();
});

for (const width of [1440, 1280, 1024, 768, 390]) test(`Home motion responsive ${width}px`, async ({ page }, testInfo) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width, height: 1000 });
  for (const id of ['servicios', 'desarrollos', 'proyectos', 'herramientas', 'planes']) {
    const section = page.locator(`#${id}`);
    const nodes = section.locator('.reveal');
    for (const node of await nodes.all()) { await node.scrollIntoViewIfNeeded(); await expect(node).toHaveClass(/is-revealed/); }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await section.screenshot({ path: testInfo.outputPath(`${id}-${width}.png`), animations: 'disabled', style: '.navbar,.skip-link,.whatsapp-float{visibility:hidden!important}' });
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.locator('.hero').screenshot({ path: testInfo.outputPath(`hero-${width}.png`), animations: 'disabled', style: '.navbar,.skip-link,.whatsapp-float{visibility:hidden!important}' });
});
