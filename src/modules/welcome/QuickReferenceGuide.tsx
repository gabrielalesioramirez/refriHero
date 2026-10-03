import React from 'react';
import { ShieldCheck, Thermometer, CheckCircle2 } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export const QuickReferenceGuide: React.FC = () => {
  const { role } = useAppState();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card 1: Golden Rules */}
      <div className="bg-white dark:bg-frost-900 border border-frost-200 dark:border-frost-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-frost-900 dark:text-white">
            Reglas de Oro del Técnico
          </h3>
        </div>
        <ul className="text-xs text-frost-600 dark:text-frost-300 space-y-2.5">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">•</span>
            <span><strong>Recalentamiento (SH):</strong> 5°C a 8°C en sistemas con VET; 8°C a 12°C con capilar fijo. Protege al compresor de líquido.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">•</span>
            <span><strong>Subenfriamiento (SC):</strong> 4°C a 8°C. Garantiza columna 100% líquida sin burbujas de gas antes de la expansión.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">•</span>
            <span><strong>Salto Térmico (ΔT Evaporador):</strong> 12°C a 16°C entre aire de retorno y aire de inyección en Split residencial.</span>
          </li>
        </ul>
      </div>

      {/* Card 2: ASHRAE Safety Class */}
      <div className="bg-white dark:bg-frost-900 border border-frost-200 dark:border-frost-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-frost-900 dark:text-white">
            Clasificación de Seguridad ASHRAE
          </h3>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-frost-50 dark:bg-frost-950/60 border border-frost-100 dark:border-frost-800">
            <span className="font-mono font-bold text-emerald-500">A1</span>
            <span className="text-frost-600 dark:text-frost-300">No tóxico, No inflamable (R-410A, R-134a)</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-frost-50 dark:bg-frost-950/60 border border-frost-100 dark:border-frost-800">
            <span className="font-mono font-bold text-amber-500">A2L</span>
            <span className="text-frost-600 dark:text-frost-300">Baja toxicidad, Baja inflamabilidad (R-32)</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-frost-50 dark:bg-frost-950/60 border border-frost-100 dark:border-frost-800">
            <span className="font-mono font-bold text-rose-500">A3</span>
            <span className="text-frost-600 dark:text-frost-300">Alta inflamabilidad (R-290 Propano, R-600a)</span>
          </div>
        </div>
      </div>

      {/* Card 3: Professor / Student Guidance */}
      <div className="bg-white dark:bg-frost-900 border border-frost-200 dark:border-frost-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2 rounded-xl bg-refri-500/10 text-refri-500">
            <Thermometer className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-frost-900 dark:text-white">
            {role === 'professor' ? 'Orientación Docente' : 'Objetivo de Aprendizaje'}
          </h3>
        </div>
        <p className="text-xs text-frost-600 dark:text-frost-300 leading-relaxed mb-2">
          {role === 'professor' 
            ? 'Utiliza los casos del Simulador de Fallas para evaluar el razonamiento termodinámico de los alumnos. Estimula la lectura simultánea de manómetros y termómetro digital en lugar de memorizar recetas.'
            : 'Un buen frigorista no adivina ni recarga gas por intuición: calcula siempre el recalentamiento en succión y el subenfriamiento en líquido para diagnosticar el estado exacto del circuito.'}
        </p>
        <span className="inline-block text-[11px] font-mono font-semibold text-refri-600 dark:text-refri-400">
          {role === 'professor' ? 'Tip pedagógico activo' : 'Metodología técnica HVAC'}
        </span>
      </div>
    </div>
  );
};
