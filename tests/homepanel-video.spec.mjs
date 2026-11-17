import { test, expect } from '@playwright/test';
const base = '/rx23digital/';
const route = `${base}desarrollos/homepanel-hogar/`;
const directory = `${base}assets/products/homepanel/`;
test('video real: carga diferida, poster, metadata, proporción y reproducción sin autoplay', async ({ page }) => {
  const mediaRequests = [];
  page.on('request', request => { if (request.url().includes('homepanel-hogar-demo-alertas.mp4')) mediaRequests.push(request.url()); });
  await page.goto(route);
  const video = page.locator('#homepanel-video video');
  await expect(video).toHaveAttribute('preload', 'metadata');
  await expect(video).toHaveAttribute('controls', '');
  await expect(video).toHaveAttribute('playsinline', '');
  await expect(video).not.toHaveAttribute('autoplay');
  await expect(video).not.toHaveAttribute('src');
  expect(mediaRequests).toEqual([]);
  await expect(video).toHaveAccessibleName('Demostración de HomePanel mostrando monitoreo de nivel, alertas y notificaciones.');
  await page.getByRole('link', { name: 'Ver HomePanel funcionando' }).click();
  await expect(page).toHaveURL(/#homepanel-video$/);
  await expect(video).toHaveAttribute('src', `${directory}homepanel-hogar-demo-alertas.mp4`);
  await expect(video).toHaveAttribute('poster', `${directory}homepanel-hogar-demo-poster.jpg`);
  await expect.poll(() => video.evaluate(node => node.readyState)).toBeGreaterThanOrEqual(1);
  expect(await video.evaluate(node => ({ width: node.videoWidth, height: node.videoHeight, paused: node.paused }))).toEqual({ width: 1440, height: 900, paused: true });
  await expect(page.locator('.homepanel-video')).toContainText('Demostración funcional de HomePanel con lecturas simuladas.');
  await expect(page.locator('.homepanel-alert-flow .flow-block')).toHaveText(['Nivel normal','Nivel bajo','Estado crítico','Alerta','Notificación Android','Recuperación']);
  await expect(page.locator('.homepanel-monitoring article')).toHaveCount(4);
  await video.evaluate(node => node.play());
  await expect.poll(() => video.evaluate(node => node.paused)).toBe(false);
  await video.evaluate(node => node.pause());
  const poster = await page.request.get(`${directory}homepanel-hogar-demo-poster.jpg`);
  expect(poster.ok()).toBeTruthy();
  expect(poster.headers()['content-type']).toContain('image/jpeg');
});
test('Home y Aplicaciones: solo HomePanel muestra PRODUCTO RX23', async ({ page }) => {
  await page.goto(base);
  const homeCard = page.locator('#desarrollos .product-card').filter({ has: page.getByRole('heading', { name: 'HomePanel Hogar' }) });
  await expect(homeCard.locator('.development')).toHaveText('PRODUCTO RX23');
  await expect(homeCard.getByRole('link', { name: 'Conocer desarrollo' })).toHaveAttribute('href', route);
  await expect(page.locator('#desarrollos .product-card').filter({ has: page.getByRole('heading', { name: 'KM0 Nexus', exact: true }) }).locator('.development')).toContainText('En desarrollo');
  await expect(page.locator('#desarrollos .product-card').filter({ has: page.getByRole('heading', { name: 'TuScope', exact: true }) }).locator('.development')).toContainText('En validación');
  await page.goto(`${base}servicios/aplicaciones/`);
  await expect(page.locator('.solution-product .solution-state')).toHaveText(['PRODUCTO RX23','En desarrollo','En validación']);
});
for (const width of [1440,1280,1024,768,390]) {
  test(`video y flujo ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${route}#homepanel-video`);
    const video = page.locator('#homepanel-video video');
    await video.scrollIntoViewIfNeeded();
    await expect.poll(() => video.evaluate(node => node.readyState)).toBeGreaterThanOrEqual(1);
    const box = await video.boundingBox();
    expect(Math.abs(box.width / box.height - 1.6)).toBeLessThan(.01);
    if (width === 390) expect(box.width).toBeGreaterThan(width * .85);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await page.locator('.homepanel-alert-flow').scrollIntoViewIfNeeded();
    await expect(page.locator('.homepanel-alert-flow')).not.toHaveClass(/flow-play/);
  });
}
test('flujo de alertas secuencial una sola vez', async ({ page }) => {
  await page.goto(route);
  const flow = page.locator('.homepanel-alert-flow');
  await flow.scrollIntoViewIfNeeded();
  await expect(flow).toHaveClass(/flow-play-a/);
  await expect(flow.locator('.flow-block').last()).toHaveCSS('animation-iteration-count', '1');
  await page.waitForTimeout(1600);
  await flow.hover();
  expect(await flow.locator('.flow-block').last().evaluate(node => node.getAnimations().filter(animation => animation.playState === 'running').length)).toBe(0);
});
