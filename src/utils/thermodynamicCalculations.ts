import { getSaturationTempC } from '../data/refrigerants';

export interface SuperheatResult {
  satTempC: number;
  superheatC: number;
  status: 'Bajo (Riesgo Golpe Líquido)' | 'Óptimo (Eficiente)' | 'Alto (Evaporador Hambriento)';
  statusType: 'danger' | 'success' | 'warning';
  explanation: string;
}

export function calculateSuperheat(
  refrigerantId: string,
  suctionPressurePsig: number,
  suctionLineTempC: number
): SuperheatResult {
  const satTempC = getSaturationTempC(refrigerantId, suctionPressurePsig);
  const superheatC = Math.round((suctionLineTempC - satTempC) * 10) / 10;

  let status: SuperheatResult['status'] = 'Óptimo (Eficiente)';
  let statusType: SuperheatResult['statusType'] = 'success';
  let explanation = 'El recalentamiento se encuentra dentro de los parámetros ideales (5°C - 8°C para sistemas con VET, 8°C - 12°C para capilares).';

  if (superheatC < 3) {
    status = 'Bajo (Riesgo Golpe Líquido)';
    statusType = 'danger';
    explanation = '¡Peligro! El refrigerante no se evaporó por completo y puede retornar líquido al compresor, dañando válvulas y diluyendo el aceite.';
  } else if (superheatC > 14) {
    status = 'Alto (Evaporador Hambriento)';
    statusType = 'warning';
    explanation = 'El evaporador se está secando antes de tiempo. Puede deberse a falta de refrigerante, filtro tapado o VET excesivamente cerrada.';
  }

  return {
    satTempC: Math.round(satTempC * 10) / 10,
    superheatC,
    status,
    statusType,
    explanation,
  };
}

export interface SubcoolingResult {
  satTempC: number;
  subcoolingC: number;
  status: 'Bajo (Flash Gas / Falta Refrigerante)' | 'Óptimo' | 'Alto (Sobrecarga / Condensador Inundado)';
  statusType: 'danger' | 'success' | 'warning';
  explanation: string;
}

export function calculateSubcooling(
  refrigerantId: string,
  dischargePressurePsig: number,
  liquidLineTempC: number
): SubcoolingResult {
  const satTempC = getSaturationTempC(refrigerantId, dischargePressurePsig);
  const subcoolingC = Math.round((satTempC - liquidLineTempC) * 10) / 10;

  let status: SubcoolingResult['status'] = 'Óptimo';
  let statusType: SubcoolingResult['statusType'] = 'success';
  let explanation = 'El subenfriamiento está en el rango estándar (4°C - 8°C), garantizando una columna 100% líquida a la entrada de la expansión.';

  if (subcoolingC < 3) {
    status = 'Bajo (Flash Gas / Falta Refrigerante)';
    statusType = 'warning';
    explanation = 'Poco subenfriamiento. Existe riesgo de vaporización prematura (flash gas) en la línea de líquido antes de llegar a la válvula.';
  } else if (subcoolingC > 12) {
    status = 'Alto (Sobrecarga / Condensador Inundado)';
    statusType = 'danger';
    explanation = 'Subenfriamiento excesivo. Indica líquido acumulado en el condensador, reduciendo área efectiva de transferencia y disparando la presión.';
  }

  return {
    satTempC: Math.round(satTempC * 10) / 10,
    subcoolingC,
    status,
    statusType,
    explanation,
  };
}

export interface ThermalLoadResult {
  frigoriasTotal: number;
  btuTotal: number;
  trTotal: number;
  kwTotal: number;
}

export function calculateThermalLoadFrigorias(
  areaM2: number,
  peopleCount: number,
  electronicsWatts: number,
  sunExposure: 'baja' | 'media' | 'alta'
): ThermalLoadResult {
  // En climatización técnica:
  // Factor base por metro cuadrado:
  // - Baja exposición / orientación sur/este: 50 fg/m²
  // - Media exposición: 60 fg/m²
  // - Alta exposición / techos de chapa / orientación norte/oeste: 70 fg/m²
  let factorBaseFg = 50;
  if (sunExposure === 'media') factorBaseFg = 60;
  if (sunExposure === 'alta') factorBaseFg = 70;

  const areaFg = areaM2 * factorBaseFg;
  const peopleFg = peopleCount * 150; // ~150 frigorías por persona en actividad liviana
  const electronicsFg = electronicsWatts * 0.86; // 1 Watt ≈ 0.86 frigorías/h (1 W = 0.86 kcal/h)

  const frigoriasTotal = Math.round(areaFg + peopleFg + electronicsFg);
  const btuTotal = Math.round(frigoriasTotal * 3.968); // 1 Frigoría ≈ 3.968 BTU
  const trTotal = Math.round((frigoriasTotal / 3000) * 100) / 100; // 1 TR = 3,000 Frigorías/h
  const kwTotal = Math.round((frigoriasTotal / 860) * 100) / 100; // 1 kW = 860 Frigorías/h

  return { frigoriasTotal, btuTotal, trTotal, kwTotal };
}

// Alias for backwards compatibility
export const calculateThermalLoadBTU = calculateThermalLoadFrigorias;

