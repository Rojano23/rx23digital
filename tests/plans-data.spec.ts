import { test, expect } from '@playwright/test';
import { plans } from '../src/data/plans';
test('precios comerciales: importes aprobados y totales derivados sin doble cobro', () => {
  expect(plans.map(plan => [plan.id, plan.developmentPrice, plan.annualInfrastructure, plan.firstYearPrice, plan.renewalPrice, plan.hostingStorage, plan.emailAccounts])).toEqual([
    ['presencia',2990,899,3889,899,2,2],
    ['negocio',5490,1299,6789,1299,4,5],
    ['profesional',8900,1799,10699,1799,6,10],
  ]);
  for (const plan of plans) {
    expect(plan.firstYearPrice).toBe(plan.developmentPrice + plan.annualInfrastructure);
    expect(plan.renewalPrice).toBe(plan.annualInfrastructure);
  }
  expect(plans.filter(plan => plan.startingAt).map(plan => plan.id)).toEqual(['profesional']);
});
