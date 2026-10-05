import React from 'react';
import { CIRCUIT_COMPONENTS, type CircuitComponentInfo } from './splitCircuitData';
import { 
  X, 
  GraduationCap, 
  Wrench, 
  Thermometer, 
  Gauge, 
  BookOpen,
  Focus,
  Sparkles
} from 'lucide-react';

interface FloatingTechPanelProps {
  componentId: string | null;
  mode: 'summer' | 'winter';
  onClose: () => void;
  onFocusCamera: (componentId: string) => void;
}

export const FloatingTechPanel: React.FC<FloatingTechPanelProps> = ({
  componentId,
  mode,
  onClose,
  onFocusCamera
}) => {
  if (!componentId) return null;
  const comp: CircuitComponentInfo = CIRCUIT_COMPONENTS[componentId];
  if (!comp) return null;

  const currentModeData = mode === 'summer' ? comp.summerMode : comp.winterMode;

  return (
    <div className="bg-white/95 dark:bg-ink-900/95 backdrop-blur-xl border border-frost-200 dark:border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 animate-fadeIn transition-all max-h-[580px] overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-frost-100 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <span
            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
            style={{ backgroundColor: comp.color }}
          />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-frost-500 font-bold block">
              {comp.unit}
            </span>
            <h3 className="text-base font-bold text-frost-900 dark:text-white leading-tight">
              {comp.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onFocusCamera(comp.id)}
            className="p-1.5 rounded-xl text-frost-500 hover:text-purple-500 hover:bg-purple-500/10 transition-colors"
            title="Enfocar cámara 3D en este componente"
          >
            <Focus className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-frost-400 hover:text-frost-700 dark:hover:text-frost-200 hover:bg-frost-100 dark:hover:bg-ink-800 transition-colors"
            title="Cerrar panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Role & Thermodynamic Principle */}
      <div className="space-y-2">
        <p className="text-xs text-frost-700 dark:text-frost-300 leading-relaxed font-medium">
          {comp.role}
        </p>
        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-900 dark:text-purple-200 flex items-start gap-2">
          <BookOpen className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
          <div>
            <strong className="font-mono font-bold block mb-0.5">Principio Físico:</strong>
            <span>{comp.thermodynamicPrinciple}</span>
          </div>
        </div>
      </div>

      {/* State Transformation Card (Inlet vs Outlet) */}
      <div className="bg-frost-50 dark:bg-ink-950 p-3.5 rounded-2xl border border-frost-200 dark:border-white/10 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-frost-500">
          <span>ESTADO DEL FLUIDO</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
            mode === 'summer' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-orange-500/20 text-orange-400'
          }`}>
            {mode === 'summer' ? 'Modo Frío' : 'Bomba de Calor'}
          </span>
        </div>

        {/* 2-column Inlet vs Outlet */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-white dark:bg-ink-900 border border-frost-200 dark:border-white/10 space-y-1">
            <span className="text-[10px] text-frost-400 font-mono font-bold block">ENTRADA</span>
            <div className="text-[11px] font-bold text-frost-900 dark:text-white line-clamp-2">
              {currentModeData.inletState}
            </div>
            <div className="pt-1 border-t border-frost-100 dark:border-white/10 text-[10px] font-mono space-y-0.5 text-frost-500">
              <div className="flex items-center gap-1">
                <Gauge className="w-3 h-3 text-refri-500" />
                <span>{currentModeData.inletPressure}</span>
              </div>
              <div className="flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-rose-500" />
                <span>{currentModeData.inletTemp}</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-ink-900 border border-frost-200 dark:border-white/10 space-y-1">
            <span className="text-[10px] text-frost-400 font-mono font-bold block">SALIDA</span>
            <div className="text-[11px] font-bold text-frost-900 dark:text-white line-clamp-2">
              {currentModeData.outletState}
            </div>
            <div className="pt-1 border-t border-frost-100 dark:border-white/10 text-[10px] font-mono space-y-0.5 text-frost-500">
              <div className="flex items-center gap-1">
                <Gauge className="w-3 h-3 text-refri-500" />
                <span>{currentModeData.outletPressure}</span>
              </div>
              <div className="flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-rose-500" />
                <span>{currentModeData.outletTemp}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[11px] font-mono text-frost-600 dark:text-frost-300 bg-white/60 dark:bg-ink-900/60 p-2 rounded-xl border border-frost-200 dark:border-white/10 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span><strong>Fase:</strong> {currentModeData.phaseTransformation}</span>
        </div>
      </div>

      {/* Teaching Guide Points for Teachers */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono uppercase font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
          <GraduationCap className="w-3.5 h-3.5" />
          Pautas Docentes para la Clase:
        </span>
        <ul className="space-y-1.5">
          {comp.teachingPoints.map((point, idx) => (
            <li
              key={idx}
              className="p-2 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px] text-frost-700 dark:text-frost-300 leading-snug flex items-start gap-1.5"
            >
              <span className="font-mono font-bold text-amber-500 shrink-0">{idx + 1}.</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Common Field Failures */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono uppercase font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
          <Wrench className="w-3.5 h-3.5" />
          Averías Típicas de Taller:
        </span>
        <div className="grid grid-cols-1 gap-1.5">
          {comp.commonFailures.map((fail, idx) => (
            <div
              key={idx}
              className="p-2 rounded-xl bg-rose-500/5 border border-rose-500/20 text-[11px] text-frost-700 dark:text-frost-300 leading-snug"
            >
              <strong className="text-rose-500 font-mono mr-1">#{idx + 1}:</strong>
              <span>{fail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
