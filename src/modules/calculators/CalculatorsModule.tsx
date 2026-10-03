import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { REFRIGERANTS, getSaturationTempC } from '../../data/refrigerants';
import { 
  calculateSuperheat, 
  calculateSubcooling, 
  calculateThermalLoadFrigorias 
} from '../../utils/thermodynamicCalculations';
import { 
  Calculator, 
  Thermometer, 
  Gauge, 
  Snowflake, 
  Activity, 
  Sun
} from 'lucide-react';

export const CalculatorsModule: React.FC = () => {
  const { selectedRefrigerantId } = useAppState();
  const currentGas = REFRIGERANTS.find(r => r.id === selectedRefrigerantId) || REFRIGERANTS[0];

  const [activeSubTab, setActiveSubTab] = useState<'sh' | 'sc' | 'btu' | 'pt'>('sh');

  // Superheat inputs
  const [shPressure, setShPressure] = useState<number>(118); // psig for R410A (~5°C sat)
  const [shLineTemp, setShLineTemp] = useState<number>(12); // °C on suction pipe

  // Subcooling inputs
  const [scPressure, setScPressure] = useState<number>(365); // psig for R410A (~45°C sat)
  const [scLineTemp, setScLineTemp] = useState<number>(39); // °C on liquid pipe

  // Thermal load inputs
  const [areaM2, setAreaM2] = useState<number>(25);
  const [peopleCount, setPeopleCount] = useState<number>(2);
  const [electronicsW, setElectronicsW] = useState<number>(400);
  const [sunExposure, setSunExposure] = useState<'baja' | 'media' | 'alta'>('media');

  // PT lookup input
  const [ptPressureInput, setPtPressureInput] = useState<number>(120);

  // Calculations
  const shResult = calculateSuperheat(selectedRefrigerantId, shPressure, shLineTemp);
  const scResult = calculateSubcooling(selectedRefrigerantId, scPressure, scLineTemp);
  const thermalResult = calculateThermalLoadFrigorias(areaM2, peopleCount, electronicsW, sunExposure);
  const ptSatTemp = Math.round(getSaturationTempC(selectedRefrigerantId, ptPressureInput) * 10) / 10;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Module Title & Gas Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-frost-900 border border-frost-200 dark:border-frost-800 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-refri-500/10 text-refri-500 dark:text-refri-400">
              <Calculator className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-frost-900 dark:text-white">
              Calculadoras Técnicas Termodinámicas
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-frost-500 dark:text-frost-400 mt-1">
            Herramientas precisas para el cálculo de recalentamiento, subenfriamiento y dimensionamiento de capacidad.
          </p>
        </div>

        {/* Selected Gas Badge */}
        <div className="flex items-center gap-3 self-start sm:self-auto bg-frost-50 dark:bg-frost-950 p-2 rounded-2xl border border-frost-200 dark:border-frost-800">
          <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: currentGas.colorCode }} />
          <div className="text-xs">
            <span className="text-frost-500 block text-[10px]">Gas de cálculo</span>
            <span className="font-bold text-frost-800 dark:text-white">{currentGas.name} ({currentGas.safetyGroup})</span>
          </div>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSubTab('sh')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
            activeSubTab === 'sh'
              ? 'bg-refri-500 text-white border-refri-600 shadow-md shadow-refri-500/20'
              : 'bg-white dark:bg-frost-900 text-frost-600 dark:text-frost-300 border-frost-200 dark:border-frost-800 hover:bg-frost-50 dark:hover:bg-frost-800'
          }`}
        >
          <Snowflake className="w-4 h-4" />
          <span>Recalentamiento (Superheat)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sc')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
            activeSubTab === 'sc'
              ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
              : 'bg-white dark:bg-frost-900 text-frost-600 dark:text-frost-300 border-frost-200 dark:border-frost-800 hover:bg-frost-50 dark:hover:bg-frost-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Subenfriamiento (Subcooling)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('btu')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
            activeSubTab === 'btu'
              ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
              : 'bg-white dark:bg-frost-900 text-frost-600 dark:text-frost-300 border-frost-200 dark:border-frost-800 hover:bg-frost-50 dark:hover:bg-frost-800'
          }`}
        >
          <Sun className="w-4 h-4" />
          <span>Carga Térmica (Frigorías)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pt')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
            activeSubTab === 'pt'
              ? 'bg-purple-500 text-white border-purple-600 shadow-md shadow-purple-500/20'
              : 'bg-white dark:bg-frost-900 text-frost-600 dark:text-frost-300 border-frost-200 dark:border-frost-800 hover:bg-frost-50 dark:hover:bg-frost-800'
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span>Tabla & Conversor P-T</span>
        </button>
      </div>

      {/* Tab 1: Superheat */}
      {activeSubTab === 'sh' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-frost-900 border border-frost-200 dark:border-frost-800 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-frost-100 dark:border-frost-800">
              <h3 className="text-sm font-bold text-frost-900 dark:text-white uppercase tracking-wider font-mono">
                Parámetros de Entrada (Lado de Baja / Succión)
              </h3>
              <span className="text-xs text-refri-500 font-mono font-semibold">
                Fórmula: T_línea - T_saturación
              </span>
            </div>

            {/* Suction Pressure Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-frost-700 dark:text-frost-300 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-cyan-500" />
                  Presión de Succión (Manómetro Azul):
                </label>
                <span className="text-xs font-mono font-bold text-refri-500">
                  {shPressure} psig
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="200"
                step="1"
                value={shPressure}
                onChange={(e) => setShPressure(Number(e.target.value))}
                className="w-full accent-refri-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-frost-400 font-mono mt-1">
                <span>20 psig</span>
                <span className="text-refri-500 font-semibold">T_sat evaporación: {shResult.satTempC}°C</span>
                <span>200 psig</span>
              </div>
            </div>

            {/* Suction Line Temperature Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-frost-700 dark:text-frost-300 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-blue-500" />
                  Temperatura de Caño de Succión (Termómetro de contacto):
                </label>
                <span className="text-xs font-mono font-bold text-refri-500">
                  {shLineTemp}°C
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="35"
                step="0.5"
                value={shLineTemp}
                onChange={(e) => setShLineTemp(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-frost-400 font-mono mt-1">
                <span>-20°C</span>
                <span>Sonda colocada a 15cm de la salida del evaporador</span>
                <span>+35°C</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="pt-2">
              <span className="text-[11px] font-mono text-frost-500 uppercase block mb-2">
                Preajustes de Taller:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setShPressure(118); setShLineTemp(11.5); }}
                  className="px-2.5 py-1 text-xs rounded-xl bg-frost-100 dark:bg-frost-800 text-frost-700 dark:text-frost-300 hover:bg-frost-200 font-medium"
                >
                  Condición Normal (SH ~6.5K)
                </button>
                <button
                  onClick={() => { setShPressure(75); setShLineTemp(22); }}
                  className="px-2.5 py-1 text-xs rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 font-medium"
                >
                  Falta de Gas (SH Alto ~23K)
                </button>
                <button
                  onClick={() => { setShPressure(135); setShLineTemp(5.5); }}
                  className="px-2.5 py-1 text-xs rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 font-medium"
                >
                  Inundación (SH Peligroso ~1K)
                </button>
              </div>
            </div>
          </div>

          {/* Results Card (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-white to-frost-50 dark:from-frost-900 dark:to-frost-950 border border-frost-200 dark:border-frost-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-frost-500 mb-2">
                Lectura Termodinámica
              </div>
              
              <div className="text-center py-4 bg-frost-100/70 dark:bg-frost-950 rounded-2xl border border-frost-200 dark:border-frost-800/80 mb-4">
                <span className="text-xs text-frost-500 block font-mono">Recalentamiento Calculado</span>
                <span className={`text-4xl font-extrabold font-mono tracking-tight ${
                  shResult.statusType === 'success' ? 'text-emerald-500' :
                  shResult.statusType === 'warning' ? 'text-amber-500' : 'text-rose-500'
                }`}>
                  {shResult.superheatC} <span className="text-lg">K / °C</span>
                </span>
                <div className="mt-1">
                  <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    shResult.statusType === 'success' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                    shResult.statusType === 'warning' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' :
                    'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                  }`}>
                    {shResult.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-xl bg-frost-50 dark:bg-frost-900 border border-frost-200 dark:border-frost-800">
                  <span className="text-frost-500">T. Saturación ({currentGas.name}):</span>
                  <span className="font-mono font-bold text-frost-800 dark:text-white">{shResult.satTempC}°C</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-frost-50 dark:bg-frost-900 border border-frost-200 dark:border-frost-800">
                  <span className="text-frost-500">T. Caño Succión:</span>
                  <span className="font-mono font-bold text-frost-800 dark:text-white">{shLineTemp}°C</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-frost-50 dark:bg-frost-900 border border-frost-200 dark:border-frost-800">
                  <span className="text-frost-500">Rango Recomendado:</span>
                  <span className="font-mono font-bold text-emerald-500">5.0°C a 8.0°C</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-2xl bg-frost-100/50 dark:bg-frost-800/40 text-xs text-frost-600 dark:text-frost-300">
              <strong className="text-frost-900 dark:text-white block mb-0.5">Diagnóstico Técnico:</strong>
              {shResult.explanation}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Subcooling */}
      {activeSubTab === 'sc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-frost-900 border border-frost-200 dark:border-frost-800 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-frost-100 dark:border-frost-800">
              <h3 className="text-sm font-bold text-frost-900 dark:text-white uppercase tracking-wider font-mono">
                Parámetros de Entrada (Lado de Alta / Descarga)
              </h3>
              <span className="text-xs text-emerald-500 font-mono font-semibold">
                Fórmula: T_saturación - T_línea
              </span>
            </div>

            {/* Discharge Pressure Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-frost-700 dark:text-frost-300 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-rose-500" />
                  Presión de Descarga (Manómetro Rojo):
                </label>
                <span className="text-xs font-mono font-bold text-rose-500">
                  {scPressure} psig
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="550"
                step="5"
                value={scPressure}
                onChange={(e) => setScPressure(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-frost-400 font-mono mt-1">
                <span>100 psig</span>
                <span className="text-rose-500 font-semibold">T_sat condensación: {scResult.satTempC}°C</span>
                <span>550 psig</span>
              </div>
            </div>

            {/* Liquid Line Temp */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-frost-700 dark:text-frost-300 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-emerald-500" />
                  Temperatura de Línea de Líquido (Salida Condensador):
                </label>
                <span className="text-xs font-mono font-bold text-emerald-500">
                  {scLineTemp}°C
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="65"
                step="0.5"
                value={scLineTemp}
                onChange={(e) => setScLineTemp(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-frost-400 font-mono mt-1">
                <span>15°C</span>
                <span>Medido sobre caño fino antes del elemento expansor</span>
                <span>65°C</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="pt-2">
              <span className="text-[11px] font-mono text-frost-500 uppercase block mb-2">
                Preajustes de Taller:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setScPressure(365); setScLineTemp(39.5); }}
                  className="px-2.5 py-1 text-xs rounded-xl bg-frost-100 dark:bg-frost-800 text-frost-700 dark:text-frost-300 hover:bg-frost-200 font-medium"
                >
                  Subcooling Normal (~5.5K)
                </button>
                <button
                  onClick={() => { setScPressure(240); setScLineTemp(34); }}
                  className="px-2.5 py-1 text-xs rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 font-medium"
                >
                  Falta de Gas (SC Bajo ~1.5K)
                </button>
                <button
                  onClick={() => { setScPressure(480); setScLineTemp(44); }}
                  className="px-2.5 py-1 text-xs rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 font-medium"
                >
                  Sobrecarga Gas (SC Alto ~15K)
                </button>
              </div>
            </div>
          </div>

          {/* Results Card (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-white to-frost-50 dark:from-frost-900 dark:to-frost-950 border border-frost-200 dark:border-frost-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-frost-500 mb-2">
                Lectura Termodinámica
              </div>
              
              <div className="text-center py-4 bg-frost-100/70 dark:bg-frost-950 rounded-2xl border border-frost-200 dark:border-frost-800/80 mb-4">
                <span className="text-xs text-frost-500 block font-mono">Subenfriamiento Calculado</span>
                <span className={`text-4xl font-extrabold font-mono tracking-tight ${
                  scResult.statusType === 'success' ? 'text-emerald-500' :
                  scResult.statusType === 'warning' ? 'text-amber-500' : 'text-rose-500'
                }`}>
                  {scResult.subcoolingC} <span className="text-lg">K / °C</span>
                </span>
                <div className="mt-1">
                  <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    scResult.statusType === 'success' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                    scResult.statusType === 'warning' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' :
                    'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                  }`}>
                    {scResult.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-xl bg-frost-50 dark:bg-frost-900 border border-frost-200 dark:border-frost-800">
                  <span className="text-frost-500">T. Saturación Condensación:</span>
                  <span className="font-mono font-bold text-frost-800 dark:text-white">{scResult.satTempC}°C</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-frost-50 dark:bg-frost-900 border border-frost-200 dark:border-frost-800">
                  <span className="text-frost-500">T. Línea de Líquido:</span>
                  <span className="font-mono font-bold text-frost-800 dark:text-white">{scLineTemp}°C</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-frost-50 dark:bg-frost-900 border border-frost-200 dark:border-frost-800">
                  <span className="text-frost-500">Rango Recomendado:</span>
                  <span className="font-mono font-bold text-emerald-500">4.0°C a 8.0°C</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-2xl bg-frost-100/50 dark:bg-frost-800/40 text-xs text-frost-600 dark:text-frost-300">
              <strong className="text-frost-900 dark:text-white block mb-0.5">Diagnóstico Técnico:</strong>
              {scResult.explanation}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Thermal Load Frigorias */}
      {activeSubTab === 'btu' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white dark:bg-frost-900 border border-frost-200 dark:border-frost-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-frost-900 dark:text-white uppercase tracking-wider font-mono pb-2 border-b border-frost-100 dark:border-frost-800">
              Datos del Recinto para Balance Térmico
            </h3>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Superficie de la Habitación:</span>
                <span className="font-mono text-refri-500 font-bold">{areaM2} m²</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={areaM2}
                onChange={(e) => setAreaM2(Number(e.target.value))}
                className="w-full accent-refri-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-frost-400 font-mono mt-0.5">
                <span>5 m²</span>
                <span>Base estándar: ~50 a 70 fg/m²</span>
                <span>100 m²</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Ocupantes habituales:</span>
                <span className="font-mono text-refri-500 font-bold">{peopleCount} personas</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={peopleCount}
                onChange={(e) => setPeopleCount(Number(e.target.value))}
                className="w-full accent-refri-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-frost-400 font-mono mt-0.5">
                <span>1 persona</span>
                <span>Aporte metabólico: ~150 fg/h por persona</span>
                <span>25 personas</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Aparatos Eléctricos / Iluminación:</span>
                <span className="font-mono text-refri-500 font-bold">{electronicsW} Watts</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={electronicsW}
                onChange={(e) => setElectronicsW(Number(e.target.value))}
                className="w-full accent-refri-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-frost-400 font-mono mt-0.5">
                <span>100 W</span>
                <span>Conversión disipación: 1 W = 0.86 fg/h</span>
                <span>3000 W</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5">Incidencia Solar en la Estancia:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['baja', 'media', 'alta'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSunExposure(lvl)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                      sunExposure === lvl
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-frost-100 dark:bg-frost-800 text-frost-600 dark:text-frost-300 border-frost-200 dark:border-frost-700'
                    }`}
                  >
                    {lvl === 'baja' ? 'Baja (50 fg/m²)' : lvl === 'media' ? 'Media (60 fg/m²)' : 'Alta (70 fg/m²)'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-b from-white to-frost-50 dark:from-frost-900 dark:to-frost-950 border border-frost-200 dark:border-frost-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-frost-500">
                Capacidad Térmica Necesaria
              </span>

              <div className="mt-3 p-4 bg-frost-100/70 dark:bg-frost-950 rounded-2xl border border-frost-200 dark:border-frost-800 text-center">
                <span className="text-xs text-frost-500 font-mono block">Potencia de Frío Estimada</span>
                <span className="text-4xl font-extrabold font-mono text-amber-500">
                  {thermalResult.frigoriasTotal.toLocaleString()} <span className="text-lg">Frigorías/h</span>
                </span>
                <span className="text-xs font-mono text-frost-400 block mt-0.5">
                  ({thermalResult.frigoriasTotal.toLocaleString()} kcal/h)
                </span>

                <div className="flex flex-wrap justify-center gap-2 mt-3 pt-3 border-t border-frost-200 dark:border-frost-800 font-mono text-xs font-semibold text-frost-600 dark:text-frost-300">
                  <span className="px-2 py-0.5 rounded bg-frost-200 dark:bg-frost-800">~ {thermalResult.trTotal} TR</span>
                  <span className="px-2 py-0.5 rounded bg-frost-200 dark:bg-frost-800">~ {thermalResult.kwTotal} kW</span>
                  <span className="px-2 py-0.5 rounded bg-frost-200 dark:bg-frost-800 text-frost-500">~ {thermalResult.btuTotal.toLocaleString()} BTU/h</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-frost-50 dark:bg-frost-900 border border-frost-200 dark:border-frost-800 text-xs">
                <div className="font-bold text-frost-900 dark:text-white mb-1">
                  Equipo Comercial Recomendado:
                </div>
                <div className="text-refri-600 dark:text-refri-400 font-semibold font-mono">
                  {thermalResult.frigoriasTotal <= 2500 ? 'Split 2,250 Frigorías (~9,000 BTU / 2.6 kW)' :
                   thermalResult.frigoriasTotal <= 3500 ? 'Split 3,000 Frigorías (~12,000 BTU / 1 TR)' :
                   thermalResult.frigoriasTotal <= 5000 ? 'Split 4,500 Frigorías (~18,000 BTU / 1.5 TR)' :
                   thermalResult.frigoriasTotal <= 6800 ? 'Split 6,000 Frigorías (~24,000 BTU / 2 TR)' :
                   'Sistema Central o Multi-Split 9,000+ Frigorías (3+ TR)'}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-frost-500 mt-4 leading-normal">
              * Cálculo en Frigorías/h (1 Frigoría ≈ 3.968 BTU/h = 1 kcal/h). Utilizado como estándar de dimensionamiento didáctico en climatización residencial y comercial.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: PT Chart & Lookup */}
      {activeSubTab === 'pt' && (
        <div className="bg-white dark:bg-frost-900 border border-frost-200 dark:border-frost-800 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-frost-100 dark:border-frost-800 mb-6">
            <div>
              <h3 className="text-base font-bold text-frost-900 dark:text-white">
                Conversor Presión - Temperatura de Saturación (P-T)
              </h3>
              <p className="text-xs text-frost-500">
                Calcula la temperatura de ebullición/condensación exacta para <strong className="text-refri-500">{currentGas.name}</strong>.
              </p>
            </div>

            {/* Interactive Single Input */}
            <div className="flex items-center gap-2 bg-frost-50 dark:bg-frost-950 p-2 rounded-2xl border border-frost-200 dark:border-frost-800">
              <span className="text-xs font-semibold text-frost-600 dark:text-frost-300">Presión:</span>
              <input
                type="number"
                value={ptPressureInput}
                onChange={(e) => setPtPressureInput(Math.max(0, Number(e.target.value)))}
                className="w-20 px-2 py-1 text-sm font-mono font-bold bg-white dark:bg-frost-900 rounded-lg border border-frost-300 dark:border-frost-700 text-frost-900 dark:text-white focus:outline-none"
              />
              <span className="text-xs font-mono text-frost-500">psig</span>
              <span className="mx-1 text-frost-400">➜</span>
              <span className="text-sm font-mono font-bold text-purple-500">{ptSatTemp}°C</span>
            </div>
          </div>

          {/* Quick PT reference matrix for all gases at key pressures */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-frost-50 dark:bg-frost-950 text-frost-500 font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-xl">Refrigerante</th>
                  <th className="py-2.5 px-3">Seguridad</th>
                  <th className="py-2.5 px-3">Baja (60 psig)</th>
                  <th className="py-2.5 px-3">Media (120 psig)</th>
                  <th className="py-2.5 px-3">Alta (250 psig)</th>
                  <th className="py-2.5 px-3 rounded-r-xl">Alta Inverter (380 psig)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-frost-100 dark:divide-frost-800/60 font-mono">
                {REFRIGERANTS.map((gas) => (
                  <tr key={gas.id} className={gas.id === selectedRefrigerantId ? 'bg-refri-500/10 font-bold' : ''}>
                    <td className="py-3 px-3 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: gas.colorCode }}></span>
                      <span>{gas.name}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-frost-200 dark:bg-frost-800 text-frost-800 dark:text-frost-200">
                        {gas.safetyGroup}
                      </span>
                    </td>
                    <td className="py-3 px-3">{Math.round(getSaturationTempC(gas.id, 60) * 10) / 10}°C</td>
                    <td className="py-3 px-3">{Math.round(getSaturationTempC(gas.id, 120) * 10) / 10}°C</td>
                    <td className="py-3 px-3">{Math.round(getSaturationTempC(gas.id, 250) * 10) / 10}°C</td>
                    <td className="py-3 px-3">{Math.round(getSaturationTempC(gas.id, 380) * 10) / 10}°C</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
