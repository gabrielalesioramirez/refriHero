import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { REFRIGERANTS, getSaturationTempC } from '../../data/refrigerants';
import { Play, Pause, Wind, Flame, Snowflake, Gauge } from 'lucide-react';

interface StageDetail {
  id: string;
  name: string;
  component: string;
  process: string;
  state: string;
  tempApprox: string;
  pressureState: string;
  desc: string;
  color: string;
  textColor: string;
}

export const ThermodynamicCyclePreview: React.FC = () => {
  const { selectedRefrigerantId } = useAppState();
  const currentGas = REFRIGERANTS.find(r => r.id === selectedRefrigerantId) || REFRIGERANTS[0];

  const [activeStage, setActiveStage] = useState<string>('compressor');
  const [isFlowActive, setIsFlowActive] = useState<boolean>(true);

  // Saturation temperatures for current gas
  const lowSatTemp = Math.round(getSaturationTempC(selectedRefrigerantId, 118) * 10) / 10;
  const highSatTemp = Math.round(getSaturationTempC(selectedRefrigerantId, 365) * 10) / 10;

  const stages: Record<string, StageDetail> = {
    compressor: {
      id: 'compressor',
      name: 'Paso 1: Compresión',
      component: 'Motocompresor Hermético / Scroll',
      process: 'Compresión Politrópica / Isoentrópica (W_c)',
      state: 'Vapor sobrecalentado a alta presión y temperatura',
      tempApprox: `Aprox. 65°C - 85°C (Sat descarga: ${highSatTemp}°C)`,
      pressureState: 'Alta Presión (Descarga: ~350 - 400 psig)',
      desc: 'El compresor succiona vapor a baja presión desde el evaporador y eleva su energía mecánica, transformándolo en vapor a alta presión listo para ceder calor en el condensador.',
      color: '#ef4444',
      textColor: 'text-red-400',
    },
    condenser: {
      id: 'condenser',
      name: 'Paso 2: Condensación & Subenfriamiento',
      component: 'Serpentín Condensador (Forzador exterior)',
      process: 'Rechazo de calor a presión constante (Q_out)',
      state: 'Cambio de fase de vapor a líquido + Subenfriamiento',
      tempApprox: `Aprox. 45°C salida líquido (Subcooling ~5K)`,
      pressureState: 'Alta Presión Constante',
      desc: 'El refrigerante cede calor sensible de desrecalentamiento, calor latente de condensación al aire exterior y finalmente se subenfría entre 4°C y 8°C para asegurar líquido puro.',
      color: '#f97316',
      textColor: 'text-amber-400',
    },
    expansion: {
      id: 'expansion',
      name: 'Paso 3: Expansión & Caída de Presión',
      component: 'Válvula de Expansión Termostática (VET) / Capilar',
      process: 'Expansión Isoentálpica (h1 ≈ h2)',
      state: 'Mezcla Bifásica (Líquido + Vapor flash ~20%)',
      tempApprox: `Aprox. ${lowSatTemp}°C (Evaporación)`,
      pressureState: 'Caída brusca de Alta a Baja Presión (~120 psig)',
      desc: 'El orificio calibrado restringe el caudal, provocando una caída súbita de presión y temperatura por auto-evaporación instantánea (flash gas), preparando el líquido para absorber calor.',
      color: '#06b6d4',
      textColor: 'text-cyan-400',
    },
    evaporator: {
      id: 'evaporator',
      name: 'Paso 4: Evaporación & Recalentamiento',
      component: 'Serpentín Evaporador (Unidad interior)',
      process: 'Absorción de calor a presión constante (Q_in)',
      state: 'Vaporización completa + Recalentamiento útil (SH)',
      tempApprox: `Aprox. 10°C - 12°C a la salida del caño de succión`,
      pressureState: 'Baja Presión Constante (~118 - 125 psig)',
      desc: 'El refrigerante hierve a baja temperatura absorbiendo el calor del recinto. Antes de salir del evaporador, el vapor se recalienta entre 5°C y 8°C para proteger al compresor de líquido.',
      color: '#3b82f6',
      textColor: 'text-blue-400',
    }
  };

  const selectedDetail = stages[activeStage];

  return (
    <div className="bg-white dark:bg-frost-900 border border-frost-200 dark:border-frost-800 rounded-3xl p-5 sm:p-6 lg:p-7 shadow-sm">
      {/* Title bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-frost-100 dark:border-frost-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-refri-500/10 text-refri-500 dark:text-refri-400">
              <Snowflake className="w-5 h-5 animate-spin-slow" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-frost-900 dark:text-white">
              Ciclo de Refrigeración por Compresión de Vapor
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-frost-500 dark:text-frost-400 mt-1">
            Simulación interactiva de los 4 componentes fundamentales con datos para <strong className="text-refri-500">{currentGas.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFlowActive(!isFlowActive)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-frost-100 dark:bg-frost-800 hover:bg-frost-200 dark:hover:bg-frost-700 text-frost-700 dark:text-frost-200 transition-colors"
          >
            {isFlowActive ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pausar Flujo</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Animar Flujo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Diagram Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
        {/* SVG Interactive Circuit (7 cols) */}
        <div className="lg:col-span-7 bg-frost-950/80 rounded-2xl p-4 sm:p-6 border border-frost-800 relative overflow-hidden flex items-center justify-center">
          {/* Subtle background circuit grid */}
          <div className="absolute inset-0 tech-grid-pattern opacity-40"></div>

          <svg viewBox="0 0 500 360" className="w-full max-w-[480px] h-auto relative z-10 select-none">
            <defs>
              {/* Flow line animations */}
              <linearGradient id="hotDischarge" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
              <linearGradient id="warmLiquid" x1="100%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="coldExpansion" x1="100%" y1="100%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="coldSuction" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            {/* PIPING / REFRIGERANT FLOW LINES */}
            {/* 1) Discharge line: Compressor (center-bottom) -> Condenser (top) */}
            <path
              d="M 250 250 L 250 180 L 120 180 L 120 75"
              fill="none"
              stroke="#ef4444"
              strokeWidth="5"
              strokeLinecap="round"
              className={isFlowActive ? "animate-flow-line" : ""}
            />

            {/* 2) Top Condenser -> Expansion Device (right) */}
            <path
              d="M 380 75 L 420 75 L 420 180 L 420 220"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="5"
              strokeLinecap="round"
              className={isFlowActive ? "animate-flow-line" : ""}
            />

            {/* 3) Liquid line: Expansion -> Evaporador (center/left) */}
            <path
              d="M 420 250 L 420 290 L 320 290"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="5"
              strokeLinecap="round"
              className={isFlowActive ? "animate-flow-line" : ""}
            />

            {/* 4) Suction line: Evaporador -> Compressor */}
            <path
              d="M 180 290 L 80 290 L 80 270 L 220 270"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="5"
              strokeLinecap="round"
              className={isFlowActive ? "animate-flow-line" : ""}
            />

            {/* --- COMPONENT 1: CONDENSER (TOP) --- */}
            <g 
              onClick={() => setActiveStage('condenser')}
              className="cursor-pointer group"
            >
              <rect
                x="120"
                y="35"
                width="260"
                height="70"
                rx="14"
                fill={activeStage === 'condenser' ? '#1e293b' : '#0f172a'}
                stroke={activeStage === 'condenser' ? '#f59e0b' : '#334155'}
                strokeWidth={activeStage === 'condenser' ? '3' : '2'}
                className="transition-all"
              />
              {/* Serpentin coils representation */}
              <path
                d="M 145 55 Q 165 45 185 55 T 225 55 T 265 55 T 305 55 T 345 55"
                fill="none"
                stroke="#f97316"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 145 75 Q 165 85 185 75 T 225 75 T 265 75 T 305 75 T 345 75"
                fill="none"
                stroke="#ea580c"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <text x="250" y="94" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700">
                CONDENSADOR (Exterior)
              </text>
              <text x="250" y="24" textAnchor="middle" fill="#fb923c" fontSize="11" fontWeight="600">
                Rechazo de Calor (Q_out) ↑
              </text>
            </g>

            {/* --- COMPONENT 2: EXPANSION VALVE (RIGHT) --- */}
            <g
              onClick={() => setActiveStage('expansion')}
              className="cursor-pointer group"
            >
              <rect
                x="395"
                y="195"
                width="50"
                height="55"
                rx="10"
                fill={activeStage === 'expansion' ? '#0f766e' : '#134e4a'}
                stroke={activeStage === 'expansion' ? '#2dd4bf' : '#14b8a6'}
                strokeWidth={activeStage === 'expansion' ? '3' : '2'}
              />
              {/* Valve hour-glass symbol */}
              <polygon points="407,208 433,208 407,235 433,235" fill="#2dd4bf" opacity="0.85" />
              <text x="420" y="265" textAnchor="middle" fill="#5eead4" fontSize="10" fontWeight="700">
                VET / Capilar
              </text>
            </g>

            {/* --- COMPONENT 3: EVAPORATOR (BOTTOM-CENTER) --- */}
            <g
              onClick={() => setActiveStage('evaporator')}
              className="cursor-pointer group"
            >
              <rect
                x="180"
                y="265"
                width="140"
                height="55"
                rx="12"
                fill={activeStage === 'evaporator' ? '#1e3a8a' : '#0f172a'}
                stroke={activeStage === 'evaporator' ? '#38bdf8' : '#334155'}
                strokeWidth={activeStage === 'evaporator' ? '3' : '2'}
                className="transition-all"
              />
              {/* Cold coils */}
              <path
                d="M 195 292 Q 210 280 225 292 T 255 292 T 285 292 T 305 292"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <text x="250" y="310" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="700">
                EVAPORADOR (Interior)
              </text>
              <text x="250" y="340" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="600">
                Absorción de Calor (Q_in) ↓
              </text>
            </g>

            {/* --- COMPONENT 4: COMPRESSOR (CENTER) --- */}
            <g
              onClick={() => setActiveStage('compressor')}
              className="cursor-pointer group"
            >
              <circle
                cx="250"
                cy="195"
                r="36"
                fill={activeStage === 'compressor' ? '#991b1b' : '#450a0a'}
                stroke={activeStage === 'compressor' ? '#f87171' : '#b91c1c'}
                strokeWidth={activeStage === 'compressor' ? '3' : '2'}
                className="transition-all"
              />
              <path
                d="M 235 190 Q 250 178 265 190 Q 250 205 235 190"
                fill="#fca5a5"
              />
              <text x="250" y="218" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">
                COMPRESOR
              </text>
            </g>

            {/* High/Low pressure boundary labels */}
            <rect x="18" y="115" width="105" height="24" rx="6" fill="#f43f5e" opacity="0.2" />
            <text x="70" y="131" textAnchor="middle" fill="#fca5a5" fontSize="10" fontWeight="700">
              LADO DE ALTA (HP)
            </text>

            <rect x="18" y="200" width="105" height="24" rx="6" fill="#0284c7" opacity="0.2" />
            <text x="70" y="216" textAnchor="middle" fill="#7dd3fc" fontSize="10" fontWeight="700">
              LADO DE BAJA (LP)
            </text>
          </svg>
        </div>

        {/* Selected Stage Detail Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4">
          <div className="bg-frost-50 dark:bg-frost-950/60 border border-frost-200 dark:border-frost-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-mono font-bold uppercase tracking-wider ${selectedDetail.textColor}`}>
                {selectedDetail.name}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-frost-200 dark:bg-frost-800 text-frost-700 dark:text-frost-300 font-semibold">
                Estado Interactivo
              </span>
            </div>

            <h3 className="text-base font-bold text-frost-900 dark:text-white mb-1">
              {selectedDetail.component}
            </h3>
            <p className="text-xs font-mono text-refri-600 dark:text-refri-400 mb-3">
              {selectedDetail.process}
            </p>

            <p className="text-xs text-frost-600 dark:text-frost-300 leading-relaxed mb-4">
              {selectedDetail.desc}
            </p>

            {/* Metric chips */}
            <div className="space-y-2 pt-3 border-t border-frost-200 dark:border-frost-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-frost-500 font-medium flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-refri-500" />
                  Presión Operativa:
                </span>
                <span className="font-mono font-bold text-frost-800 dark:text-frost-100">
                  {selectedDetail.pressureState}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-frost-500 font-medium flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  Temperatura Estimada:
                </span>
                <span className="font-mono font-bold text-frost-800 dark:text-frost-100">
                  {selectedDetail.tempApprox}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-frost-500 font-medium flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-cyan-500" />
                  Estado del Fluido:
                </span>
                <span className="font-semibold text-frost-800 dark:text-frost-200">
                  {selectedDetail.state}
                </span>
              </div>
            </div>
          </div>

          {/* Quick interactive buttons to jump through stages */}
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(stages) as (keyof typeof stages)[]).map((key) => {
              const s = stages[key];
              const isSelected = activeStage === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveStage(key)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all border ${
                    isSelected
                      ? 'bg-refri-500 text-white border-refri-600 shadow-sm'
                      : 'bg-frost-100 dark:bg-frost-800/60 text-frost-700 dark:text-frost-300 border-frost-200 dark:border-frost-700/60 hover:bg-frost-200 dark:hover:bg-frost-800'
                  }`}
                >
                  <span className="block text-[10px] opacity-80 uppercase">{s.id}</span>
                  <span className="truncate block">{s.component.split(' ')[0]} {s.component.split(' ')[1] || ''}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
