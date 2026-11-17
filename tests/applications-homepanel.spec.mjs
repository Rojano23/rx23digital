import { test, expect } from '@playwright/test';
const base = '/rx23digital/';
const applications = `${base}servicios/aplicaciones/`;
const homepanel = `${base}desarrollos/homepanel-hogar/`;
test('Aplicaciones: alcance, desarrollos honestos, SEO y navegación a HomePanel', async ({ page }) => {
  await page.goto(applications);
  await expect(page).toHaveTitle('Desarrollo de Aplicaciones y Software | RX23 Digital');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://rx23digital.com/servicios/aplicaciones/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Desarrollamos aplicaciones, sistemas internos, paneles e integraciones digitales adaptadas a necesidades reales.');
  await expect(page.locator('main h1')).toHaveText('Aplicaciones y soluciones digitales');
  await expect(page.locator('.solution-features li')).toHaveCount(10);
  await expect(page.locator('.solution-process .flow-step')).toHaveCount(5);
  await expect(page.locator('.solution-product')).toHaveCount(3);
  await expect(page.locator('.solution-product a')).toHaveCount(1);
  await expect(page.locator('.solution-pending')).toHaveCount(2);
  await expect(page.locator('.solution-product .solution-state')).toHaveText(['PRODUCTO RX23', 'En desarrollo', 'En validación']);
  await expect(page.locator('.solution-product').first()).toContainText('Panel para el hogar que centraliza información, accesos, contactos, monitoreo y alertas en una interfaz diseñada para tablet.');
  await page.getByRole('link', { name: 'Ver desarrollos', exact: true }).click();
  await expect(page).toHaveURL(/#aplicaciones-desarrollos$/);
  await expect.poll(() => page.locator('#aplicaciones-desarrollos').evaluate(el => el.getBoundingClientRect().top)).toBeLessThan(180);
  for (const img of await page.locator('.solution-product img').all()) {
    await expect.poll(() => img.evaluate(node => node.complete && node.naturalWidth > 0)).toBeTruthy();
  }
  await page.getByRole('link', { name: 'Conocer HomePanel', exact: true }).click();
  await expect(page).toHaveURL(homepanel);
  await expect(page.locator('main h1')).toHaveText('HomePanel Hogar');
  await expect(page.locator('#main-navigation a[aria-current]')).toHaveText('Desarrollos');
  await page.reload();
  await expect(page.locator('main h1')).toHaveText('HomePanel Hogar');
});
test('HomePanel: funciones actuales, demostración simulada, contacto y SEO', async ({ page }) => {
  await page.goto(homepanel);
  await expect(page).toHaveTitle('HomePanel Hogar | RX23 Digital');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://rx23digital.com/desarrollos/homepanel-hogar/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'HomePanel Hogar centraliza información, contactos, accesos, monitoreo y alertas del hogar en una interfaz diseñada para tablet.');
  await expect(page.locator('[aria-labelledby="homepanel-current"] li')).toHaveCount(14);
  await expect(page.locator('.solution-future,.solution-status')).toHaveCount(0);
  await expect(page.locator('.homepanel-landing')).not.toContainText(/desarrollo activo|en desarrollo|prototipo|proyecto en evolución|lo que estamos explorando|pueden cambiar antes de una versión comercial/i);
  await page.getByRole('link', { name: 'Ver HomePanel funcionando', exact: true }).click();
  await expect(page).toHaveURL(/#homepanel-video$/);
  await expect.poll(() => page.locator('#homepanel-video').evaluate(el => el.getBoundingClientRect().top)).toBeLessThan(180);
  for (const img of await page.locator('.homepanel-landing img').all()) {
    await img.scrollIntoViewIfNeeded();
    await expect(img).toHaveAttribute('src', /^\/rx23digital\/assets\/products\/homepanel\//);
    await expect.poll(() => img.evaluate(node => node.complete && node.naturalWidth > 0)).toBeTruthy();
  }
  for (const link of await page.locator('.homepanel-landing a[href*="wa.me"]').all()) {
    const url = new URL(await link.getAttribute('href'));
    expect(url.pathname).toBe('/529617857513');
    expect(url.searchParams.get('text')).toContain('HomePanel Hogar');
  }
  await page.getByRole('link', { name: 'Ver Aplicaciones', exact: true }).click();
  await expect(page).toHaveURL(applications);
});
for (const section of ['desarrollos','contacto']) {
  test(`HomePanel → Home #${section}`, async ({ page }) => {
    await page.goto(homepanel);
    const link = section === 'desarrollos' ? page.getByRole('link', { name: '← Volver a Desarrollos' }) : page.locator('.solution-final').getByRole('link', { name: 'Contacto' });
    await link.click();
    await expect(page).toHaveURL(`${base}#${section}`);
    await expect(page.locator(`#${section}`)).toBeInViewport();
    // The final section may reach the document's scroll limit before aligning at the top.
    await expect.poll(() => page.locator(`#${section}`).evaluate(el => {
      const top = el.getBoundingClientRect().top;
      const atBottom = Math.abs(scrollY + innerHeight - document.documentElement.scrollHeight) < 3;
      return top >= 0 && (top < 180 || atBottom);
    })).toBeTruthy();
  });
}
test('diagramas reutilizan motion secuencial sin repetición', async ({ page }) => {
  await page.goto(applications);
  const flow = page.locator('.solution-process');
  await flow.scrollIntoViewIfNeeded();
  await expect(flow).toHaveClass(/flow-play-a/);
  await expect(flow.locator('.flow-block').last()).toHaveCSS('animation-iteration-count', '1');
  await page.waitForTimeout(1400);
  await flow.hover();
  await expect(flow).not.toHaveClass(/flow-play-b/);
  expect(await flow.locator('.flow-block').last().evaluate(node => node.getAnimations().filter(animation => animation.playState === 'running').length)).toBe(0);
});
for (const [name,route] of [['Aplicaciones',applications],['HomePanel',homepanel]]) {
  for (const width of [1440,1280,1024,768,390]) {
    test(`${name} responsive ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(route);
      for (const section of await page.locator('.solution-landing > section').all()) {
        await section.scrollIntoViewIfNeeded();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
      }
      await expect(page.locator('.solution-landing .flow-play-a')).toHaveCount(0);
      await page.screenshot({ path: testInfo.outputPath(`${name}-${width}.png`), fullPage: true, animations: 'disabled', style: '.navbar,.skip-link,.whatsapp-float{visibility:hidden!important}' });
    });
  }
}
