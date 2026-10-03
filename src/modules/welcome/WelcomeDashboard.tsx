import React from 'react';
import { 
  Calculator, 
  AlertTriangle, 
  Box, 
  ArrowRight, 
  Zap 
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { ThermodynamicCyclePreview } from './ThermodynamicCyclePreview';
import { QuickReferenceGuide } from './QuickReferenceGuide';
import { REFRIGERANTS } from '../../data/refrigerants';
import { FAULT_SCENARIOS } from '../../data/faultScenarios';

export const WelcomeDashboard: React.FC = () => {
  const { setActiveTab, selectedRefrigerantId, role, navigateToScenario } = useAppState();
  const currentGas = REFRIGERANTS.find(r => r.id === selectedRefrigerantId) || REFRIGERANTS[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Technical Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-frost-900 via-refri-950 to-frost-950 text-white border border-refri-500/20 p-6 sm:p-8 lg:p-10 shadow-2xl">
        {/* Technical background accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-refri-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 tech-grid-pattern opacity-30 pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-refri-500/20 text-refri-300 border border-refri-500/30 mb-4 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5 text-refri-400" />
            <span>PLATAFORMA DIDÁCTICA HVAC-R • VERSIÓN 1.0</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
            Domina la Termodinámica y el Diagnóstico en <span className="text-transparent bg-clip-text bg-gradient-to-r from-refri-400 via-cyan-300 to-sky-200">RefriHero</span>
          </h1>

          <p className="text-frost-300 text-sm sm:text-base leading-relaxed mb-6">
            Entorno interactivo creado para {role === 'professor' ? 'docentes de climatización e instructores de taller' : 'estudiantes de refrigeración, técnicos e ingenieros'}. 
            Calcula recalentamiento (SH) y subenfriamiento (SC) en tiempo real, simula averías críticas de campo y comprende el ciclo frigorífico de forma visual.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('calculators')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-refri-500 to-refri-600 hover:from-refri-400 hover:to-refri-500 text-white font-bold text-sm shadow-lg shadow-refri-500/25 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Calculator className="w-4 h-4" />
              <span>Abrir Calculadoras Técnicas</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-frost-800/80 hover:bg-frost-800 text-frost-100 border border-frost-700 font-semibold text-sm transition-all duration-200"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Simulador de Averías ({FAULT_SCENARIOS.length} Casos)</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-frost-800/80">
          <div className="bg-frost-900/60 backdrop-blur-md rounded-2xl p-3 border border-frost-800">
            <div className="text-xs text-frost-400 font-mono">Refrigerante Activo</div>
            <div className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentGas.colorCode }}></span>
              {currentGas.name}
            </div>
            <div className="text-[11px] text-frost-500 mt-0.5">{currentGas.safetyGroup} • GWP {currentGas.gwp}</div>
          </div>

          <div className="bg-frost-900/60 backdrop-blur-md rounded-2xl p-3 border border-frost-800">
            <div className="text-xs text-frost-400 font-mono">Calculadoras</div>
            <div className="text-base font-bold text-refri-300 mt-0.5">4 Módulos</div>
            <div className="text-[11px] text-frost-500 mt-0.5">SH, SC, Frigorías, P-T</div>
          </div>

          <div className="bg-frost-900/60 backdrop-blur-md rounded-2xl p-3 border border-frost-800">
            <div className="text-xs text-frost-400 font-mono">Diagnóstico de Fallas</div>
            <div className="text-base font-bold text-amber-400 mt-0.5">{FAULT_SCENARIOS.length} Escenarios</div>
            <div className="text-[11px] text-frost-500 mt-0.5">Casos reales evaluables</div>
          </div>

          <div className="bg-frost-900/60 backdrop-blur-md rounded-2xl p-3 border border-frost-800">
            <div className="text-xs text-frost-400 font-mono">Modo de Usuario</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5 capitalize">
              {role === 'professor' ? 'Docente / Taller' : 'Estudiante'}
            </div>
            <div className="text-[11px] text-frost-500 mt-0.5">
              {role === 'professor' ? 'Con pautas didácticas' : 'Autoaprendizaje'}
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Modules Navigation Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-frost-900 dark:text-white">
              Estructura Modular del Sistema
            </h2>
            <p className="text-xs text-frost-500 dark:text-frost-400">
              Accede directamente a los 3 núcleos pedagógicos principales
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Calculadoras Técnicas */}
          <div 
            onClick={() => setActiveTab('calculators')}
            className="group cursor-pointer bg-white dark:bg-frost-900 border border-frost-200 dark:border-frost-800 hover:border-refri-500/50 dark:hover:border-refri-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-refri-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-refri-500/10 dark:bg-refri-500/20 text-refri-600 dark:text-refri-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calculator className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold bg-refri-100 dark:bg-refri-950 text-refri-700 dark:text-refri-300 border border-refri-300 dark:border-refri-800">
                  MÓDULO 1
                </span>
                <span className="text-xs font-semibold text-frost-500">4 Herramientas</span>
              </div>
              <h3 className="text-lg font-bold text-frost-900 dark:text-white group-hover:text-refri-500 transition-colors">
                Calculadoras Técnicas
              </h3>
              <p className="text-xs text-frost-600 dark:text-frost-300 mt-2 leading-relaxed">
                Calcula instantáneamente el <strong>Recalentamiento</strong> (Superheat), <strong>Subenfriamiento</strong> (Subcooling) y la estimación de <strong>Carga Térmica</strong> en Frigorías (fg/h) según el tipo de gas seleccionado.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-frost-100 dark:border-frost-800/80 flex items-center justify-between text-xs font-bold text-refri-600 dark:text-refri-400 group-hover:translate-x-1 transition-transform">
              <span>Ingresar a Calculadoras</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Simulador de Fallas */}
          <div 
            onClick={() => setActiveTab('simulator')}
            className="group cursor-pointer bg-white dark:bg-frost-900 border border-frost-200 dark:border-frost-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  MÓDULO 2
                </span>
                <span className="text-xs font-semibold text-frost-500">Taller Virtual</span>
              </div>
              <h3 className="text-lg font-bold text-frost-900 dark:text-white group-hover:text-amber-500 transition-colors">
                Simulador de Fallas
              </h3>
              <p className="text-xs text-frost-600 dark:text-frost-300 mt-2 leading-relaxed">
                Diagnostica problemas de campo: <strong>Falta de refrigerante</strong>, <strong>Condensador tapado</strong>, <strong>Válvula VET trabada</strong> y <strong>Presencia de incondensables</strong> analizando manómetros y síntomas reales.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-frost-100 dark:border-frost-800/80 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Iniciar Diagnóstico</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Módulo 3 Simulador 3D Split */}
          <div 
            onClick={() => setActiveTab('view3d')}
            className="group cursor-pointer bg-white dark:bg-frost-900 border border-frost-200 dark:border-frost-800 hover:border-purple-500/50 dark:hover:border-purple-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Box className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                  MÓDULO 3
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">¡Disponible!</span>
              </div>
              <h3 className="text-lg font-bold text-frost-900 dark:text-white group-hover:text-purple-500 transition-colors">
                Simulador 3D Split
              </h3>
              <p className="text-xs text-frost-600 dark:text-frost-300 mt-2 leading-relaxed">
                Circuito frigorífico completo en tiempo real con partículas animadas, cambio de fase termodinámica, alternancia Verano (Frío) / Invierno (Calor) y pautas docentes de clase.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-frost-100 dark:border-frost-800/80 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
              <span>Abrir Simulador 3D</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Thermodynamic Cycle Diagram */}
      <ThermodynamicCyclePreview />

      {/* Reference & Educational Rules */}
      <QuickReferenceGuide />

      {/* Quick Launchable Fault Cases Preview */}
      <div className="bg-white dark:bg-frost-900 border border-frost-200 dark:border-frost-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-frost-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>{FAULT_SCENARIOS.length} Casos de Taller Listos para Práctica</span>
            </h3>
            <p className="text-xs text-frost-500 dark:text-frost-400">
              Selecciona cualquier caso clínico para saltar directamente al simulador con el diagnóstico cargado
            </p>
          </div>
          <button
            onClick={() => setActiveTab('simulator')}
            className="text-xs font-bold text-refri-600 dark:text-refri-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Abrir Simulador ({FAULT_SCENARIOS.length} Casos)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-1">
          {FAULT_SCENARIOS.map((scenario, idx) => (
            <div
              key={scenario.id}
              onClick={() => navigateToScenario(scenario.id)}
              className="p-3.5 rounded-2xl bg-frost-50 dark:bg-frost-950/60 border border-frost-200 dark:border-frost-800/80 hover:border-amber-500/50 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-frost-200 dark:bg-frost-800 text-frost-700 dark:text-frost-300 font-bold">
                    #{idx + 1} • {scenario.difficulty}
                  </span>
                  <span className="text-[10px] font-mono text-refri-500 font-bold">
                    {scenario.refrigerant}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-frost-900 dark:text-white line-clamp-1 mb-1">
                  {scenario.title}
                </h4>
                <p className="text-[11px] text-frost-500 dark:text-frost-400 line-clamp-2">
                  {scenario.systemType}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-frost-200/50 dark:border-frost-800/50 flex items-center justify-between text-[10px] font-mono text-amber-500 font-bold">
                <span>{scenario.category}</span>
                <span>➜</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
