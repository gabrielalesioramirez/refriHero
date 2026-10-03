import React from 'react';
import { CIRCUIT_COMPONENTS, type CircuitComponentInfo } from './splitCircuitData';
import { 
  X, 
  GraduationCap, 
  Wrench, 
  Thermometer, 
  Gauge, 
  Sparkles,
  Layers,
  BookOpen
} from 'lucide-react';

interface ComponentDetailModalProps {
  componentId: string | null;
  mode: 'summer' | 'winter';
  onClose: () => void;
}

export const ComponentDetailModal: React.FC<ComponentDetailModalProps> = ({
  componentId,
  mode,
  onClose
}) => {
  if (!componentId) return null;
  const comp: CircuitComponentInfo = CIRCUIT_COMPONENTS[componentId];
  if (!comp) return null;

  const currentModeData = mode === 'summer' ? comp.summerMode : comp.winterMode;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-frost-900 border border-frost-200 dark:border-frost-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-frost-100 dark:border-frost-800 bg-frost-50/60 dark:bg-frost-950/60">
          <div className="flex items-center gap-3">
            <span 
              className="w-4 h-4 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: comp.color }}
            />
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-frost-500 font-bold block">
                {comp.unit}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-frost-900 dark:text-white">
                {comp.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-frost-400 hover:text-frost-700 dark:hover:text-frost-200 hover:bg-frost-100 dark:hover:bg-frost-800 transition-colors"
            title="Cerrar ficha técnica"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Main Role & Physics Principle */}
          <div className="space-y-3">
            <p className="text-sm text-frost-700 dark:text-frost-300 leading-relaxed font-medium">
              {comp.role}
            </p>
            <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-900 dark:text-purple-200 flex items-start gap-2.5">
              <BookOpen className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-mono font-bold mb-0.5">Fundamento Termodinámico:</strong>
                <span>{comp.thermodynamicPrinciple}</span>
              </div>
            </div>
          </div>

          {/* Thermodynamic State Changes Card (Inlet vs Outlet) */}
          <div className="bg-frost-50 dark:bg-frost-950 border border-frost-200 dark:border-frost-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-frost-500 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-refri-500" />
                Estado del Fluido en {mode === 'summer' ? 'Modo Verano (Frío)' : 'Modo Invierno (Calor)'}
              </span>
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                mode === 'summer' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              }`}>
                {mode === 'summer' ? 'Régimen Refrigeración' : 'Régimen Bomba de Calor'}
              </span>
            </div>

            {/* Inlet vs Outlet Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Inlet Box */}
              <div className="p-4 rounded-xl bg-white dark:bg-frost-900 border border-frost-200 dark:border-frost-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-frost-500 font-mono font-semibold">
                  <span>ENTRADA AL COMPONENTE</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                </div>
                <div className="text-sm font-bold text-frost-900 dark:text-frost-100">
                  {currentModeData.inletState}
                </div>
                <div className="pt-2 border-t border-frost-100 dark:border-frost-800 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="flex items-center gap-1 text-frost-600 dark:text-frost-400">
                    <Gauge className="w-3.5 h-3.5 text-refri-500" />
                    <span>{currentModeData.inletPressure}</span>
                  </div>
                  <div className="flex items-center gap-1 text-frost-600 dark:text-frost-400">
                    <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                    <span>{currentModeData.inletTemp}</span>
                  </div>
                </div>
              </div>

              {/* Outlet Box */}
              <div className="p-4 rounded-xl bg-white dark:bg-frost-900 border border-frost-200 dark:border-frost-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-frost-500 font-mono font-semibold">
                  <span>SALIDA DEL COMPONENTE</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-sm font-bold text-frost-900 dark:text-frost-100">
                  {currentModeData.outletState}
                </div>
                <div className="pt-2 border-t border-frost-100 dark:border-frost-800 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="flex items-center gap-1 text-frost-600 dark:text-frost-400">
                    <Gauge className="w-3.5 h-3.5 text-refri-500" />
                    <span>{currentModeData.outletPressure}</span>
                  </div>
                  <div className="flex items-center gap-1 text-frost-600 dark:text-frost-400">
                    <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                    <span>{currentModeData.outletTemp}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transformation Summary */}
            <div className="text-xs font-mono text-frost-600 dark:text-frost-300 bg-white/50 dark:bg-frost-900/50 p-2.5 rounded-xl border border-frost-200 dark:border-frost-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span><strong>Transformación Física:</strong> {currentModeData.phaseTransformation}</span>
            </div>
          </div>

          {/* Pedagogical Teaching Notes for Classroom Projection */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              Pautas Pedagógicas para Proyección en Clase:
            </h4>
            <ul className="space-y-2">
              {comp.teachingPoints.map((point, idx) => (
                <li 
                  key={idx} 
                  className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-frost-700 dark:text-frost-300 leading-relaxed flex items-start gap-2"
                >
                  <span className="font-mono font-bold text-amber-500 shrink-0">{idx + 1}.</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Field Failures */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <Wrench className="w-4 h-4" />
              Averías Típicas Relacionadas en Taller:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {comp.commonFailures.map((fail, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 text-[11px] text-frost-700 dark:text-frost-300"
                >
                  <strong className="block text-rose-600 dark:text-rose-400 mb-1 font-mono">Falla #{idx + 1}:</strong>
                  <span>{fail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-frost-100 dark:border-frost-800 bg-frost-50 dark:bg-frost-950 flex items-center justify-between">
          <span className="text-[11px] font-mono text-frost-400">
            Módulo 3: Gemelo Digital & Laboratorio Didáctico RefriHero
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-frost-900 dark:bg-white dark:text-frost-900 hover:opacity-90 transition-opacity"
          >
            Entendido / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
