import React, { useState } from 'react';
import { ThreeSplitScene } from './ThreeSplitScene';
import { FloatingTechPanel } from './FloatingTechPanel';
import { CIRCUIT_COMPONENTS } from './splitCircuitData';
import { 
  Play, 
  Pause, 
  Sun, 
  Flame, 
  Gauge, 
  Thermometer, 
  Maximize2, 
  Minimize2,
  Sliders,
  Box,
  RotateCcw
} from 'lucide-react';

export const View3DModule: React.FC = () => {
  const [mode, setMode] = useState<'summer' | 'winter'>('summer');
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [showParticles, setShowParticles] = useState<boolean>(true);
  const [showAirflow, setShowAirflow] = useState<boolean>(true);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>('compressor');
  const [isClassroomMode, setIsClassroomMode] = useState<boolean>(false);
  const [cameraPreset, setCameraPreset] = useState<string>('overview');
  const [resetTrigger, setResetTrigger] = useState<number>(0);

  const handleResetCamera = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setSelectedComponentId(null);
    setCameraPreset('overview');
    setResetTrigger((prev) => prev + 1);
  };

  // Real-time thermodynamic telemetry
  const telemetryData = mode === 'summer' ? {
    dischargePress: 370,
    suctionPress: 118,
    dischargeTemp: 88,
    evapTemp: 5,
    superheat: 6.5,
    subcooling: 7.2,
    compressionRatio: 3.05,
    refrigerant: 'R-410A'
  } : {
    dischargePress: 395,
    suctionPress: 78,
    dischargeTemp: 92,
    evapTemp: -4,
    superheat: 7.0,
    subcooling: 6.8,
    compressionRatio: 4.88,
    refrigerant: 'R-410A'
  };

  const handleFocusComponent = (compId: string) => {
    setSelectedComponentId(compId);
    if (compId === 'compressor') setCameraPreset('compressor');
    else if (compId === 'evaporator' || compId === 'indoor_turbine') setCameraPreset('indoor');
    else if (compId === 'condenser' || compId === 'outdoor_fan') setCameraPreset('outdoor');
    else if (compId === 'liquid_line' || compId === 'suction_line') setCameraPreset('wall');
  };

  return (
    <div className={`space-y-6 animate-fadeIn ${isClassroomMode ? 'fixed inset-0 z-50 bg-frost-950 p-4 overflow-y-auto' : ''}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-ink-900 border border-frost-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Box className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-frost-900 dark:text-white">
              Módulo 3: Gemelo Digital & Simulador 3D Volumétrico Split
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-frost-500 dark:text-frost-400 mt-1">
            Perspectiva 3D isométrica real: compresor cilíndrico en relieve, serpentines volumétricos con aletas, cañerías tubulares translúcidas y partículas de refrigerante en tiempo real.
          </p>
        </div>

        {/* Classroom Projection Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetCamera}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-frost-100 dark:bg-ink-800 text-frost-700 dark:text-frost-200 hover:bg-frost-200 dark:hover:bg-ink-700 border border-transparent dark:border-white/10 active:scale-95 transition-all cursor-pointer shadow-sm"
            title="Restablecer vista isométrica general"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Cámara</span>
          </button>

          <button
            onClick={() => setIsClassroomMode(!isClassroomMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${
              isClassroomMode
                ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20'
                : 'bg-frost-50 dark:bg-ink-950 text-frost-700 dark:text-frost-300 border-frost-200 dark:border-white/10 hover:border-purple-500'
            }`}
          >
            {isClassroomMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span>{isClassroomMode ? 'Salir de Proyector' : 'Modo Proyector de Clase'}</span>
          </button>
        </div>
      </div>

      {/* Control Bar & Telemetry Dashboard */}
      <div className="bg-white dark:bg-ink-900 border border-frost-200 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Controls: Play/Pause & Speed */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${
                isRunning
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20'
                  : 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20'
              }`}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? 'Pausar Flujo' : 'Reanudar Flujo'}</span>
            </button>

            {/* Speed selection */}
            <div className="flex items-center bg-frost-100 dark:bg-ink-950 p-1 rounded-xl border border-frost-200 dark:border-white/10 text-xs">
              <span className="text-[10px] font-mono text-frost-400 px-2 uppercase font-bold">Velocidad:</span>
              {[0.5, 1, 2, 3].map((val) => (
                <button
                  key={val}
                  onClick={() => setSpeed(val)}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs transition-all ${
                    speed === val
                      ? 'bg-white dark:bg-ink-800 text-frost-900 dark:text-white shadow-sm'
                      : 'text-frost-500 hover:text-frost-800 dark:hover:text-frost-200'
                  }`}
                >
                  {val}x
                </button>
              ))}
            </div>
          </div>

          {/* Mode Switcher: Verano vs Invierno */}
          <div className="flex items-center gap-1.5 bg-frost-100 dark:bg-ink-950 p-1.5 rounded-2xl border border-frost-200 dark:border-white/10">
            <span className="text-[10px] font-mono uppercase font-bold text-frost-400 px-2">Modo:</span>
            <button
              onClick={() => setMode('summer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'summer'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-frost-600 dark:text-frost-400 hover:text-frost-900'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Verano (Refrigeración)</span>
            </button>
            <button
              onClick={() => setMode('winter')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'winter'
                  ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md shadow-orange-500/20'
                  : 'text-frost-600 dark:text-frost-400 hover:text-frost-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Invierno (Bomba de Calor)</span>
            </button>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowParticles(!showParticles)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                showParticles
                  ? 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30'
                  : 'bg-frost-50 dark:bg-ink-950 text-frost-500 border-frost-200 dark:border-white/10'
              }`}
            >
              Partículas 3D
            </button>
            <button
              onClick={() => setShowAirflow(!showAirflow)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                showAirflow
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
                  : 'bg-frost-50 dark:bg-ink-950 text-frost-500 border-frost-200 dark:border-white/10'
              }`}
            >
              Corrientes de Aire
            </button>
          </div>
        </div>

        {/* Telemetry Real-Time Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3 border-t border-frost-100 dark:border-white/10">
          <div className="bg-frost-50 dark:bg-ink-950 p-2.5 rounded-xl border border-frost-200 dark:border-white/10">
            <span className="text-[10px] font-mono uppercase text-rose-500 font-bold block flex items-center gap-1">
              <Gauge className="w-3 h-3" />
              Presión Alta
            </span>
            <div className="text-sm font-bold font-mono text-frost-900 dark:text-white mt-0.5">
              {telemetryData.dischargePress} <span className="text-[10px] font-normal text-frost-400">psig</span>
            </div>
          </div>

          <div className="bg-frost-50 dark:bg-ink-950 p-2.5 rounded-xl border border-frost-200 dark:border-white/10">
            <span className="text-[10px] font-mono uppercase text-cyan-500 font-bold block flex items-center gap-1">
              <Gauge className="w-3 h-3" />
              Presión Baja
            </span>
            <div className="text-sm font-bold font-mono text-frost-900 dark:text-white mt-0.5">
              {telemetryData.suctionPress} <span className="text-[10px] font-normal text-frost-400">psig</span>
            </div>
          </div>

          <div className="bg-frost-50 dark:bg-ink-950 p-2.5 rounded-xl border border-frost-200 dark:border-white/10">
            <span className="text-[10px] font-mono uppercase text-amber-500 font-bold block flex items-center gap-1">
              <Thermometer className="w-3 h-3" />
              Temp. Descarga
            </span>
            <div className="text-sm font-bold font-mono text-frost-900 dark:text-white mt-0.5">
              {telemetryData.dischargeTemp}°C
            </div>
          </div>

          <div className="bg-frost-50 dark:bg-ink-950 p-2.5 rounded-xl border border-frost-200 dark:border-white/10">
            <span className="text-[10px] font-mono uppercase text-blue-500 font-bold block flex items-center gap-1">
              <Thermometer className="w-3 h-3" />
              Temp. Evaporación
            </span>
            <div className="text-sm font-bold font-mono text-frost-900 dark:text-white mt-0.5">
              {telemetryData.evapTemp}°C
            </div>
          </div>

          <div className="bg-frost-50 dark:bg-ink-950 p-2.5 rounded-xl border border-frost-200 dark:border-white/10">
            <span className="text-[10px] font-mono uppercase text-purple-500 font-bold block">
              Recalentamiento (SH)
            </span>
            <div className="text-sm font-bold font-mono text-emerald-500 mt-0.5">
              {telemetryData.superheat} K
            </div>
          </div>

          <div className="bg-frost-50 dark:bg-ink-950 p-2.5 rounded-xl border border-frost-200 dark:border-white/10">
            <span className="text-[10px] font-mono uppercase text-indigo-500 font-bold block">
              Subenfriamiento (SC)
            </span>
            <div className="text-sm font-bold font-mono text-emerald-500 mt-0.5">
              {telemetryData.subcooling} K
            </div>
          </div>
        </div>
      </div>

      {/* 3D Visualizer & Floating Technical Inspection Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 3D Three.js Canvas (Takes full width or 7-8 cols if panel active) */}
        <div className={selectedComponentId ? 'lg:col-span-8' : 'lg:col-span-12'}>
          <ThreeSplitScene
            mode={mode}
            isRunning={isRunning}
            speed={speed}
            showParticles={showParticles}
            showAirflow={showAirflow}
            selectedComponentId={selectedComponentId}
            onSelectComponent={(id) => setSelectedComponentId(id)}
            cameraPreset={cameraPreset}
            resetTrigger={resetTrigger}
          />
        </div>

        {/* Floating Pedagogical Technical Panel (Appears side-by-side or docked) */}
        {selectedComponentId && (
          <div className="lg:col-span-4">
            <FloatingTechPanel
              componentId={selectedComponentId}
              mode={mode}
              onClose={() => setSelectedComponentId(null)}
              onFocusCamera={handleFocusComponent}
            />
          </div>
        )}
      </div>

      {/* Quick Select Component Buttons (Touch / Classroom projector) */}
      <div className="bg-white dark:bg-ink-900 border border-frost-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-frost-500 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-purple-500" />
            Seleccionar & Enfocar Componente en 3D:
          </span>
          <span className="text-[11px] text-frost-400 font-mono">
            Haz clic en cualquier pieza para enfocar la cámara tridimensional y ver su análisis termodinámico
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
          {Object.values(CIRCUIT_COMPONENTS).map((comp) => {
            const isSelected = selectedComponentId === comp.id;
            return (
              <button
                key={comp.id}
                onClick={() => handleFocusComponent(comp.id)}
                className={`p-2.5 rounded-xl text-xs font-semibold transition-all border text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-500 text-white border-purple-600 shadow-md ring-2 ring-purple-400/40'
                    : 'bg-frost-50 dark:bg-ink-950 text-frost-700 dark:text-frost-300 border-frost-200 dark:border-white/10 hover:bg-frost-100 dark:hover:bg-ink-800'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full mb-1"
                  style={{ backgroundColor: comp.color }}
                />
                <span className="text-[11px] font-bold line-clamp-1">{comp.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pedagogical Color Code & Phase Transitions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-ink-900 border border-frost-200 dark:border-white/10 rounded-2xl p-4 shadow-sm flex items-start gap-3">
          <span className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-orange-500 shrink-0 mt-0.5 shadow-sm shadow-red-500/50" />
          <div>
            <strong className="text-xs font-bold text-frost-900 dark:text-white block">
              1. Gas Recalentado (Alta Presión)
            </strong>
            <p className="text-[11px] text-frost-500 dark:text-frost-400 mt-0.5">
              Salida del motocompresor hacia la entrada del condensador (75°C a 95°C / 370 psig).
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-ink-900 border border-frost-200 dark:border-white/10 rounded-2xl p-4 shadow-sm flex items-start gap-3">
          <span className="w-4 h-4 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 shrink-0 mt-0.5 shadow-sm shadow-rose-500/50" />
          <div>
            <strong className="text-xs font-bold text-frost-900 dark:text-white block">
              2. Líquido Subenfriado
            </strong>
            <p className="text-[11px] text-frost-500 dark:text-frost-400 mt-0.5">
              Salida del condensador hacia el elemento de expansión. Evita burbujas en la laminación.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-ink-900 border border-frost-200 dark:border-white/10 rounded-2xl p-4 shadow-sm flex items-start gap-3">
          <span className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 shrink-0 mt-0.5 shadow-sm shadow-cyan-500/50" />
          <div>
            <strong className="text-xs font-bold text-frost-900 dark:text-white block">
              3. Mezcla Líquido-Vapor (Flash Gas)
            </strong>
            <p className="text-[11px] text-frost-500 dark:text-frost-400 mt-0.5">
              Expansión brusca en el capilar / VET; la temperatura cae a 4°C - 5°C para enfriar el recinto.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-ink-900 border border-frost-200 dark:border-white/10 rounded-2xl p-4 shadow-sm flex items-start gap-3">
          <span className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 shrink-0 mt-0.5 shadow-sm shadow-blue-500/50" />
          <div>
            <strong className="text-xs font-bold text-frost-900 dark:text-white block">
              4. Vapor Sobrecalentado (Baja Presión)
            </strong>
            <p className="text-[11px] text-frost-500 dark:text-frost-400 mt-0.5">
              Salida del evaporador por cañería de succión. Protege al compresor de retorno líquido.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
