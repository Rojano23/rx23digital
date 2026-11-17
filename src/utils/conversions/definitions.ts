export type CategoryId = 'length' | 'area' | 'volume' | 'mass' | 'temperature' | 'speed' | 'pressure';
export type LinearUnit = { id: string; name: string; plural: string; symbol: string; factor: number };
export type TemperatureUnit = { id: string; name: string; plural: string; symbol: string; toBase: (value: number) => number; fromBase: (value: number) => number };
export type Unit = LinearUnit | TemperatureUnit;
export type Category = { id: CategoryId; name: string; base: string; defaults: readonly [string, string]; units: readonly Unit[] };

// International inch, foot, avoirdupois pound, and standard gravity.
// Audit reference: https://www.nist.gov/pml/us-surveyfoot/revised-unit-conversion-factors
// Additional units: https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8
// The acre uses the international foot, not the retired U.S. survey foot.
const inch = 0.0254;
const foot = 0.3048;
const pound = 0.45359237;
const gravity = 9.80665;
const unit = (id: string, name: string, plural: string, symbol: string, factor: number): LinearUnit => ({ id, name, plural, symbol, factor });
export const categories: readonly Category[] = [
  { id: 'length', name: 'Longitud', base: 'm', defaults: ['m', 'cm'], units: [
    unit('mm', 'milímetro', 'milímetros', 'mm', .001), unit('cm', 'centímetro', 'centímetros', 'cm', .01),
    unit('m', 'metro', 'metros', 'm', 1), unit('km', 'kilómetro', 'kilómetros', 'km', 1000),
    unit('in', 'pulgada', 'pulgadas', 'in', inch), unit('ft', 'pie', 'pies', 'ft', foot),
    unit('yd', 'yarda', 'yardas', 'yd', .9144), unit('mi', 'milla', 'millas', 'mi', 1609.344),
  ] },
  { id: 'area', name: 'Área', base: 'm2', defaults: ['m2', 'ft2'], units: [
    unit('mm2', 'milímetro cuadrado', 'milímetros cuadrados', 'mm²', 1e-6), unit('cm2', 'centímetro cuadrado', 'centímetros cuadrados', 'cm²', 1e-4),
    unit('m2', 'metro cuadrado', 'metros cuadrados', 'm²', 1), unit('km2', 'kilómetro cuadrado', 'kilómetros cuadrados', 'km²', 1e6),
    unit('in2', 'pulgada cuadrada', 'pulgadas cuadradas', 'in²', inch ** 2), unit('ft2', 'pie cuadrado', 'pies cuadrados', 'ft²', foot ** 2),
    unit('yd2', 'yarda cuadrada', 'yardas cuadradas', 'yd²', .9144 ** 2), unit('ha', 'hectárea', 'hectáreas', 'ha', 10000),
    unit('acre', 'acre', 'acres', 'ac', 43560 * foot ** 2),
  ] },
  { id: 'volume', name: 'Volumen', base: 'L', defaults: ['L', 'mL'], units: [
    unit('mL', 'mililitro', 'mililitros', 'mL', .001), unit('L', 'litro', 'litros', 'L', 1),
    unit('m3', 'metro cúbico', 'metros cúbicos', 'm³', 1000), unit('cm3', 'centímetro cúbico', 'centímetros cúbicos', 'cm³', .001),
    unit('in3', 'pulgada cúbica', 'pulgadas cúbicas', 'in³', .016387064), unit('ft3', 'pie cúbico', 'pies cúbicos', 'ft³', 28.316846592),
    unit('gal-us', 'galón US', 'galones US', 'US gal', 3.785411784), unit('gal-imp', 'galón imperial', 'galones imperiales', 'imp gal', 4.54609),
  ] },
  { id: 'mass', name: 'Masa', base: 'kg', defaults: ['kg', 'g'], units: [
    unit('mg', 'miligramo', 'miligramos', 'mg', 1e-6), unit('g', 'gramo', 'gramos', 'g', .001),
    unit('kg', 'kilogramo', 'kilogramos', 'kg', 1), unit('t', 'tonelada métrica', 'toneladas métricas', 't', 1000),
    unit('oz', 'onza', 'onzas', 'oz', pound / 16), unit('lb', 'libra', 'libras', 'lb', pound),
  ] },
  { id: 'temperature', name: 'Temperatura', base: 'K', defaults: ['C', 'F'], units: [
    { id: 'C', name: 'Celsius', plural: 'Celsius', symbol: '°C', toBase: value => value + 273.15, fromBase: value => value - 273.15 },
    { id: 'F', name: 'Fahrenheit', plural: 'Fahrenheit', symbol: '°F', toBase: value => (value - 32) * 5 / 9 + 273.15, fromBase: value => (value - 273.15) * 9 / 5 + 32 },
    { id: 'K', name: 'Kelvin', plural: 'Kelvin', symbol: 'K', toBase: value => value, fromBase: value => value },
  ] },
  { id: 'speed', name: 'Velocidad', base: 'm-s', defaults: ['m-s', 'km-h'], units: [
    unit('m-s', 'metro por segundo', 'metros por segundo', 'm/s', 1), unit('km-h', 'kilómetro por hora', 'kilómetros por hora', 'km/h', 1 / 3.6),
    unit('mph', 'milla por hora', 'millas por hora', 'mph', .44704), unit('ft-s', 'pie por segundo', 'pies por segundo', 'ft/s', foot),
    unit('kn', 'nudo', 'nudos', 'kn', 1852 / 3600),
  ] },
  { id: 'pressure', name: 'Presión', base: 'Pa', defaults: ['bar', 'kPa'], units: [
    unit('Pa', 'pascal', 'pascales', 'Pa', 1), unit('kPa', 'kilopascal', 'kilopascales', 'kPa', 1000),
    unit('MPa', 'megapascal', 'megapascales', 'MPa', 1e6), unit('bar', 'bar', 'bar', 'bar', 100000), unit('mbar', 'milibar', 'milibares', 'mbar', 100),
    unit('psi', 'libra-fuerza por pulgada cuadrada', 'libras-fuerza por pulgada cuadrada', 'psi', pound * gravity / inch ** 2),
    unit('atm', 'atmósfera', 'atmósferas', 'atm', 101325), unit('kgf-cm2', 'kilogramo-fuerza por centímetro cuadrado', 'kilogramos-fuerza por centímetro cuadrado', 'kgf/cm²', gravity * 10000),
  ] },
];
export const getCategory = (id: CategoryId) => categories.find(category => category.id === id)!;
