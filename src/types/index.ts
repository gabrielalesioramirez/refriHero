export type NavigationTab = 'welcome' | 'calculators' | 'simulator' | 'view3d';

export type UserRole = 'student' | 'professor';

export type UnitSystem = 'metric' | 'imperial'; // metric: °C, bar / kPa; imperial: °F, psig

export interface RefrigerantInfo {
  id: string;
  name: string;
  formula?: string;
  type: 'HFC' | 'HCFC' | 'CFC' | 'HFO' | 'HC (Natural)' | 'Inorgánico';
  safetyGroup: 'A1' | 'A2' | 'A2L' | 'A3' | 'B2';
  colorCode: string; // Manifold ring / cylinder color
  gwp: number; // Global Warming Potential
  odp: number; // Ozone Depletion Potential
  criticalTemp: number; // °C
  boilingPoint1Atm: number; // °C at 1 atm
  description: string;
  application: string;
}

export interface CycleStatePoint {
  id: number;
  name: string;
  stage: string;
  phase: string;
  tempC: number;
  pressPsig: number;
  enthalpy: number; // kJ/kg
  color: string;
}

export type FaultCategory = 
  | 'Carga de Refrigerante'
  | 'Restricciones y Expansión'
  | 'Flujo de Aire y Suciedad'
  | 'Compresión y Mecánica'
  | 'Contaminación y Vacío'
  | 'Eléctrico y Control';

export interface FaultScenario {
  id: string;
  title: string;
  category: FaultCategory;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  systemType: string;
  refrigerant: string;
  description: string;
  symptoms: {
    suctionPressure: { value: number; unit: string; status: 'Baja' | 'Normal' | 'Alta' };
    dischargePressure: { value: number; unit: string; status: 'Baja' | 'Normal' | 'Alta' };
    superheat: { value: number; unit: string; status: 'Bajo' | 'Normal' | 'Alto' };
    subcooling: { value: number; unit: string; status: 'Bajo' | 'Normal' | 'Alto' };
    amperage: { value: number; unit: string; status: 'Bajo' | 'Normal' | 'Alto' };
    airDeltaT: { value: number; unit: string; status: 'Bajo' | 'Normal' | 'Alto' };
    compressorTemp?: { value: number; unit: string; status: 'Bajo' | 'Normal' | 'Alto' };
    visualNotes: string[];
    acousticNote?: string;
  };
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  educationalNote: string;
  technicalTheory: string;
  recommendedSolution: string;
}
