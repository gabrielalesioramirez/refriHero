import type { RefrigerantInfo } from '../types';

export const REFRIGERANTS: RefrigerantInfo[] = [
  {
    id: 'R410A',
    name: 'R-410A',
    formula: 'CH2F2 / CHF2CF3 (50/50)',
    type: 'HFC',
    safetyGroup: 'A1',
    colorCode: '#ec4899', // Rose/Pink cylinder standard
    gwp: 2088,
    odp: 0,
    criticalTemp: 71.4,
    boilingPoint1Atm: -51.4,
    description: 'Mezcla zeotrópica (deslizamiento casi nulo) de alta presión estándar en acondicionadores de aire residenciales y comerciales inverter.',
    application: 'Split residencial, VRF/VRV, Chillers compactos',
  },
  {
    id: 'R134a',
    name: 'R-134a',
    formula: 'CF3CH2F',
    type: 'HFC',
    safetyGroup: 'A1',
    colorCode: '#0ea5e9', // Light blue standard
    gwp: 1430,
    odp: 0,
    criticalTemp: 101.1,
    boilingPoint1Atm: -26.1,
    description: 'Refrigerante puro de media y alta temperatura de evaporación. Muy utilizado en refrigeradores domésticos, automotriz y enfriadoras de agua.',
    application: 'Refrigeración doméstica, Automotriz, Enfriadores de agua centrífugos',
  },
  {
    id: 'R32',
    name: 'R-32',
    formula: 'CH2F2',
    type: 'HFC',
    safetyGroup: 'A2L',
    colorCode: '#ef4444', // Red band (mildly flammable)
    gwp: 675,
    odp: 0,
    criticalTemp: 78.1,
    boilingPoint1Atm: -51.7,
    description: 'Gas ecológico de última generación con 68% menor GWP que el R-410A y mayor eficiencia energética. Ligeramente inflamable (A2L).',
    application: 'Mini-Split moderno Inverter, Bombas de calor ecológicas',
  },
  {
    id: 'R290',
    name: 'R-290 (Propano)',
    formula: 'C3H8',
    type: 'HC (Natural)',
    safetyGroup: 'A3',
    colorCode: '#10b981', // Green cylinder
    gwp: 3,
    odp: 0,
    criticalTemp: 96.7,
    boilingPoint1Atm: -42.1,
    description: 'Hidrocarburo natural de ultra-bajo impacto ambiental y excelente rendimiento termodinámico. Alta inflamabilidad (A3), requiere protocolos de seguridad estrictos.',
    application: 'Vitrinas comerciales autocontenidas, Deshumidificadores, AA portátil',
  },
  {
    id: 'R404A',
    name: 'R-404A',
    formula: 'R-125 / R-143a / R-134a',
    type: 'HFC',
    safetyGroup: 'A1',
    colorCode: '#f97316', // Orange
    gwp: 3922,
    odp: 0,
    criticalTemp: 72.1,
    boilingPoint1Atm: -46.5,
    description: 'Mezcla cuasi-azeotrópica utilizada históricamente en refrigeración comercial de baja y media temperatura (cámaras frigoríficas). Alto GWP.',
    application: 'Cámaras de congelación, Supermercados, Túneles de frío',
  },
  {
    id: 'R22',
    name: 'R-22 (HCFC)',
    formula: 'CHClF2',
    type: 'HCFC',
    safetyGroup: 'A1',
    colorCode: '#84cc16', // Light green
    gwp: 1810,
    odp: 0.055,
    criticalTemp: 96.2,
    boilingPoint1Atm: -40.8,
    description: 'Refrigerante histórico en fase de eliminación global por el Protocolo de Montreal debido a su potencial de agotamiento de la capa de ozono.',
    application: 'Sistemas legacy, Mantenimiento y reconversión (retrofit)',
  }
];

// Reference PT Chart approximations for quick calculations
export function getSaturationTempC(refrigerantId: string, pressurePsig: number): number {
  // Antoine / simplified curve fits for education
  switch (refrigerantId) {
    case 'R410A':
      return -51.4 + 11.2 * Math.pow(Math.max(0, pressurePsig), 0.42);
    case 'R134a':
      return -26.1 + 10.8 * Math.pow(Math.max(0, pressurePsig), 0.45);
    case 'R32':
      return -51.7 + 11.0 * Math.pow(Math.max(0, pressurePsig), 0.42);
    case 'R290':
      return -42.1 + 10.5 * Math.pow(Math.max(0, pressurePsig), 0.44);
    case 'R404A':
      return -46.5 + 10.7 * Math.pow(Math.max(0, pressurePsig), 0.43);
    case 'R22':
      return -40.8 + 10.2 * Math.pow(Math.max(0, pressurePsig), 0.46);
    default:
      return -30 + 10 * Math.pow(Math.max(0, pressurePsig), 0.44);
  }
}

export function getSaturationPressurePsig(refrigerantId: string, tempC: number): number {
  switch (refrigerantId) {
    case 'R410A':
      return Math.max(0, Math.pow((tempC + 51.4) / 11.2, 1 / 0.42));
    case 'R134a':
      return Math.max(0, Math.pow((tempC + 26.1) / 10.8, 1 / 0.45));
    case 'R32':
      return Math.max(0, Math.pow((tempC + 51.7) / 11.0, 1 / 0.42));
    case 'R290':
      return Math.max(0, Math.pow((tempC + 42.1) / 10.5, 1 / 0.44));
    case 'R404A':
      return Math.max(0, Math.pow((tempC + 46.5) / 10.7, 1 / 0.43));
    case 'R22':
      return Math.max(0, Math.pow((tempC + 40.8) / 10.2, 1 / 0.46));
    default:
      return Math.max(0, Math.pow((tempC + 30) / 10, 1 / 0.44));
  }
}
