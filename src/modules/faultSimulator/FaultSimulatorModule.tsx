import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { useAppState } from '../../context/AppStateContext';
import { FAULT_SCENARIOS } from '../../data/faultScenarios';
import type { FaultCategory } from '../../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Gauge, 
  RotateCcw, 
  GraduationCap,
  Sparkles,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Search,
  BookOpen,
  Wrench,
  Volume2,
  Thermometer,
  Filter
} from 'lucide-react';

const CATEGORIES: ('Todas' | FaultCategory)[] = [
  'Todas',
  'Carga de Refrigerante',
  'Restricciones y Expansión',
  'Flujo de Aire y Suciedad',
  'Compresión y Mecánica',
  'Contaminación y Vacío',
  'Eléctrico y Control'
];

export const FaultSimulatorModule: React.FC = () => {
  const { selectedScenarioId, setSelectedScenarioId, role } = useAppState();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | FaultCategory>('Todas');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Todas' | 'Básico' | 'Intermedio' | 'Avanzado'>('Todas');

  // Gamification stats
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);

  // Active scenario state
  const [currentScenarioId, setCurrentScenarioId] = useState<string>(() => {
    return selectedScenarioId || FAULT_SCENARIOS[0].id;
  });

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  // Filtered scenarios list
  const filteredScenarios = useMemo(() => {
    return FAULT_SCENARIOS.filter((scenario) => {
      const matchesSearch = 
        scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scenario.refrigerant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scenario.systemType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scenario.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'Todas' || scenario.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'Todas' || scenario.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  // Current active scenario object
  const currentScenario = useMemo(() => {
    const found = FAULT_SCENARIOS.find(s => s.id === currentScenarioId);
    if (found) return found;
    return filteredScenarios[0] || FAULT_SCENARIOS[0];
  }, [currentScenarioId, filteredScenarios]);

  // Current index in filtered list
  const currentFilteredIndex = useMemo(() => {
    const idx = filteredScenarios.findIndex(s => s.id === currentScenario.id);
    return idx >= 0 ? idx : 0;
  }, [filteredScenarios, currentScenario]);

  // Sync external scenario selection
  useEffect(() => {
    if (selectedScenarioId && selectedScenarioId !== currentScenarioId) {
      setCurrentScenarioId(selectedScenarioId);
      setSelectedOptionId(null);
      setHasSubmitted(false);
    }
  }, [selectedScenarioId]);

  const handleSelectScenario = (id: string) => {
    setCurrentScenarioId(id);
    setSelectedScenarioId(id);
    setSelectedOptionId(null);
    setHasSubmitted(false);
  };

  const handleNextScenario = () => {
    if (filteredScenarios.length === 0) return;
    const nextIdx = (currentFilteredIndex + 1) % filteredScenarios.length;
    handleSelectScenario(filteredScenarios[nextIdx].id);
  };

  const handlePrevScenario = () => {
    if (filteredScenarios.length === 0) return;
    const prevIdx = (currentFilteredIndex - 1 + filteredScenarios.length) % filteredScenarios.length;
    handleSelectScenario(filteredScenarios[prevIdx].id);
  };

  const handleRandomScenario = () => {
    if (filteredScenarios.length <= 1) return;
    let randomIdx: number;
    do {
      randomIdx = Math.floor(Math.random() * filteredScenarios.length);
    } while (filteredScenarios[randomIdx].id === currentScenario.id);
    handleSelectScenario(filteredScenarios[randomIdx].id);
  };

  const handleCheckAnswer = () => {
    if (!selectedOptionId || hasSubmitted) return;
    setHasSubmitted(true);
    setTotalAnswered(prev => prev + 1);

    const selected = currentScenario.options.find(o => o.id === selectedOptionId);
    if (selected?.isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 }
      });
    } else {
      setStreak(0);
    }
  };

  const selectedOpt = currentScenario.options.find(o => o.id === selectedOptionId);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with Title and Gamification Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-ink-900 border border-frost-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-frost-900 dark:text-white">
              Trivia & Taller Clínico de Diagnóstico HVAC-R
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-frost-500 dark:text-frost-400 mt-1">
            {FAULT_SCENARIOS.length} casos clínicos reales con síntomas manométricos, eléctricos y térmicos para entrenamiento continuo.
          </p>
        </div>

        {/* Stats & Practice Score */}
        <div className="flex items-center gap-3 self-start md:self-auto bg-frost-50 dark:bg-ink-950 p-2.5 rounded-2xl border border-frost-200 dark:border-white/10">
          <div className="text-center px-3 border-r border-frost-200 dark:border-white/10">
            <span className="text-[10px] text-frost-400 uppercase font-mono block">Aciertos</span>
            <span className="text-sm font-bold font-mono text-emerald-500">
              {score} / {totalAnswered}
            </span>
          </div>
          <div className="text-center px-3">
            <span className="text-[10px] text-frost-400 uppercase font-mono block">Racha Actual</span>
            <span className="text-sm font-bold font-mono text-amber-500 flex items-center justify-center gap-1">
              🔥 {streak}
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters, Search, Random Roulette & Prev/Next */}
      <div className="bg-white dark:bg-ink-900 border border-frost-200 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        {/* Row 1: Search + Random Button + Prev/Next */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-frost-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por falla, síntoma, refrigerante (ej. R-410A, capilar, humedad)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-frost-50 dark:bg-ink-950 border border-frost-200 dark:border-white/10 text-frost-800 dark:text-frost-100 placeholder:text-frost-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Practice Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomScenario}
              title="Cargar un caso aleatorio al azar"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-500 text-white hover:bg-amber-600 shadow-sm transition-all"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Caso Aleatorio</span>
            </button>

            <button
              onClick={handlePrevScenario}
              disabled={filteredScenarios.length <= 1}
              className="p-2 rounded-xl border border-frost-200 dark:border-white/10 hover:bg-frost-100 dark:hover:bg-ink-800 disabled:opacity-40"
              title="Caso anterior"
            >
              <ChevronLeft className="w-4 h-4 text-frost-700 dark:text-frost-200" />
            </button>

            <span className="text-xs font-mono font-semibold text-frost-500 px-1 whitespace-nowrap">
              {filteredScenarios.length > 0 ? `${currentFilteredIndex + 1} de ${filteredScenarios.length}` : '0 de 0'}
            </span>

            <button
              onClick={handleNextScenario}
              disabled={filteredScenarios.length <= 1}
              className="p-2 rounded-xl border border-frost-200 dark:border-white/10 hover:bg-frost-100 dark:hover:bg-ink-800 disabled:opacity-40"
              title="Siguiente caso"
            >
              <ChevronRight className="w-4 h-4 text-frost-700 dark:text-frost-200" />
            </button>
          </div>
        </div>

        {/* Row 2: Categories Pills */}
        <div className="space-y-2 pt-1 border-t border-frost-100 dark:border-white/10">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[10px] uppercase font-mono font-bold text-frost-400 shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-amber-500" />
              Categoría:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-xl font-medium transition-all whitespace-nowrap border text-[11px] ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm font-bold'
                    : 'bg-frost-50 dark:bg-ink-950 text-frost-600 dark:text-frost-400 border-frost-200 dark:border-white/10 hover:bg-frost-100 dark:hover:bg-ink-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Row 3: Difficulty Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-[10px] uppercase font-mono font-bold text-frost-400 shrink-0 mr-1">Dificultad:</span>
            {(['Todas', 'Básico', 'Intermedio', 'Avanzado'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-0.5 rounded-lg font-medium transition-all whitespace-nowrap border text-[10px] ${
                  selectedDifficulty === diff
                    ? 'bg-frost-900 text-white dark:bg-white dark:text-frost-900 border-transparent font-bold'
                    : 'bg-frost-50 dark:bg-ink-950 text-frost-600 dark:text-frost-400 border-frost-200 dark:border-white/10 hover:bg-frost-100 dark:hover:bg-ink-800'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Row 4: Grid of All Cases */}
          <div className="pt-3 border-t border-frost-100 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono font-bold text-frost-400">
                Seleccionar Caso ({filteredScenarios.length} disponibles):
              </span>
              <span className="text-[10px] text-frost-400 font-mono">
                Haz clic en cualquier caso para cargarlo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
              {filteredScenarios.map((sc, idx) => {
                const isSelected = currentScenario.id === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => handleSelectScenario(sc.id)}
                    className={`p-2.5 rounded-xl text-left transition-all border text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-frost-50 dark:bg-ink-950 text-frost-700 dark:text-frost-300 border-frost-200 dark:border-white/10 hover:bg-frost-100 dark:hover:bg-ink-800'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-mono text-[10px] font-bold opacity-80">
                        #{idx + 1}
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        isSelected ? 'bg-black/25 text-white' : 'bg-refri-500/15 text-refri-500 dark:text-refri-300'
                      }`}>
                        {sc.refrigerant}
                      </span>
                    </div>
                    <div className="font-bold truncate text-[11px] w-full">
                      {sc.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Case Header Details */}
      <div className="bg-white dark:bg-ink-900 border border-frost-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-frost-100 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
              {currentScenario.category}
            </span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full font-bold bg-refri-500/20 text-refri-400 border border-refri-500/30">
              {currentScenario.refrigerant}
            </span>
            <span className="text-[11px] font-mono text-frost-400">
              Dificultad: <strong>{currentScenario.difficulty}</strong>
            </span>
          </div>

          <span className="text-xs font-semibold text-frost-500 font-mono">
            {currentScenario.systemType}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold text-frost-900 dark:text-white">
          {currentScenario.title}
        </h3>

        <p className="text-xs sm:text-sm text-frost-600 dark:text-frost-300 leading-relaxed">
          {currentScenario.description}
        </p>
      </div>

      {/* Main Diagnosis Workspace: Manifolds & Data on Left | 4-Option Quiz on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Instruments, Manometers & Symptoms (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-ink-950 text-white border border-white/10 rounded-2xl p-5 shadow-inner space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-mono font-bold text-refri-400 flex items-center gap-1.5">
                <Gauge className="w-4 h-4" />
                Puente Manométrico Digital (Lecturas en Marcha)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                EN VIVO
              </span>
            </div>

            {/* Dual Gauges: Blue (Low) and Red (High) */}
            <div className="grid grid-cols-2 gap-4">
              {/* Blue Suction Gauge */}
              <div className="bg-ink-900/90 rounded-2xl p-4 border border-cyan-500/30 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-500"></div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase block font-semibold">
                  Baja Presión (Succión)
                </span>
                <div className="text-3xl font-extrabold font-mono text-cyan-300 my-1">
                  {currentScenario.symptoms.suctionPressure.value}{' '}
                  <span className="text-xs font-normal text-frost-400">{currentScenario.symptoms.suctionPressure.unit}</span>
                </div>
                <span className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  currentScenario.symptoms.suctionPressure.status === 'Normal' ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-rose-500/20 text-rose-400'
                }`}>
                  Estado: {currentScenario.symptoms.suctionPressure.status}
                </span>
              </div>

              {/* Red Discharge Gauge */}
              <div className="bg-ink-900/90 rounded-2xl p-4 border border-rose-500/30 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500"></div>
                <span className="text-[11px] font-mono text-rose-400 uppercase block font-semibold">
                  Alta Presión (Descarga)
                </span>
                <div className="text-3xl font-extrabold font-mono text-rose-300 my-1">
                  {currentScenario.symptoms.dischargePressure.value}{' '}
                  <span className="text-xs font-normal text-frost-400">{currentScenario.symptoms.dischargePressure.unit}</span>
                </div>
                <span className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  currentScenario.symptoms.dischargePressure.status === 'Normal' ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-rose-500/20 text-rose-400'
                }`}>
                  Estado: {currentScenario.symptoms.dischargePressure.status}
                </span>
              </div>
            </div>

            {/* Thermodynamic Parameters Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="bg-ink-900 p-2.5 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] text-frost-400 block font-mono">Recalentamiento (SH)</span>
                <span className="text-sm font-bold font-mono text-purple-400">
                  {currentScenario.symptoms.superheat.value}
                </span>
                <div className="text-[10px] text-frost-500 font-semibold">{currentScenario.symptoms.superheat.status}</div>
              </div>

              <div className="bg-ink-900 p-2.5 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] text-frost-400 block font-mono">Subenfriamiento (SC)</span>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  {currentScenario.symptoms.subcooling.value}
                </span>
                <div className="text-[10px] text-frost-500 font-semibold">{currentScenario.symptoms.subcooling.status}</div>
              </div>

              <div className="bg-ink-900 p-2.5 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] text-frost-400 block font-mono">Consumo Corriente</span>
                <span className="text-sm font-bold font-mono text-amber-400">
                  {currentScenario.symptoms.amperage.value}
                </span>
                <div className="text-[10px] text-frost-500 font-semibold">{currentScenario.symptoms.amperage.status}</div>
              </div>

              <div className="bg-ink-900 p-2.5 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] text-frost-400 block font-mono">Salto Térmico ΔT</span>
                <span className="text-sm font-bold font-mono text-cyan-400">
                  {currentScenario.symptoms.airDeltaT.value}
                </span>
                <div className="text-[10px] text-frost-500 font-semibold">{currentScenario.symptoms.airDeltaT.status}</div>
              </div>
            </div>

            {/* Compressor Temp if available */}
            {currentScenario.symptoms.compressorTemp && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-ink-900/80 border border-white/10 text-xs font-mono">
                <span className="text-frost-400 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                  Temperatura de Carcasa del Compresor:
                </span>
                <span className="font-bold text-white">
                  {currentScenario.symptoms.compressorTemp.value} {currentScenario.symptoms.compressorTemp.unit} ({currentScenario.symptoms.compressorTemp.status})
                </span>
              </div>
            )}

            {/* Visual Observations */}
            <div className="pt-2 border-t border-white/10 text-xs">
              <span className="text-frost-400 font-mono flex items-center gap-1.5 mb-2 font-bold">
                <Eye className="w-3.5 h-3.5 text-refri-400" />
                Inspección Visual del Técnico en Sitio:
              </span>
              <ul className="space-y-1.5 text-frost-300">
                {currentScenario.symptoms.visualNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-refri-400 font-bold">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Acoustic Observation if available */}
            {currentScenario.symptoms.acousticNote && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                <Volume2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Diagnóstico Acústico:</strong> {currentScenario.symptoms.acousticNote}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 4 Multiple Choice Options Quiz (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-ink-900 border border-frost-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-frost-100 dark:border-white/10 mb-4">
              <h3 className="text-sm font-bold text-frost-900 dark:text-white uppercase font-mono tracking-wider">
                Desafío Técnico de Diagnóstico
              </h3>
              <span className="text-xs text-frost-500 font-semibold">
                Selecciona la acción técnica correcta:
              </span>
            </div>

            {/* Exactly 4 Options List */}
            <div className="space-y-3">
              {currentScenario.options.map((option, idx) => {
                const isSelected = selectedOptionId === option.id;
                const letter = String.fromCharCode(65 + idx); // A, B, C, D

                let optionStyle = 'border-frost-200 dark:border-white/10 bg-frost-50 dark:bg-ink-950/60 text-frost-800 dark:text-frost-200 hover:border-refri-400';

                if (isSelected && !hasSubmitted) {
                  optionStyle = 'border-refri-500 bg-refri-500/10 text-refri-900 dark:text-refri-100 ring-2 ring-refri-500/30';
                }

                if (hasSubmitted) {
                  if (option.isCorrect) {
                    optionStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30 font-semibold';
                  } else if (isSelected && !option.isCorrect) {
                    optionStyle = 'border-rose-500 bg-rose-500/10 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/30';
                  } else {
                    optionStyle = 'opacity-60 border-frost-200 dark:border-white/10';
                  }
                }

                return (
                  <div
                    key={option.id}
                    onClick={() => !hasSubmitted && setSelectedOptionId(option.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs leading-relaxed ${optionStyle}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`w-6 h-6 rounded-lg font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
                        hasSubmitted && option.isCorrect
                          ? 'bg-emerald-500 text-white'
                          : hasSubmitted && isSelected && !option.isCorrect
                          ? 'bg-rose-500 text-white'
                          : isSelected
                          ? 'bg-refri-500 text-white'
                          : 'bg-frost-200 dark:bg-ink-800 text-frost-700 dark:text-frost-300'
                      }`}>
                        {letter}
                      </span>
                      <div className="flex-1 pt-0.5">{option.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Validation & Retry Buttons */}
            <div className="mt-5 pt-4 border-t border-frost-100 dark:border-white/10 flex items-center gap-3">
              {hasSubmitted ? (
                <>
                  <button
                    onClick={() => {
                      setHasSubmitted(false);
                      setSelectedOptionId(null);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-frost-100 dark:bg-ink-800 text-frost-700 dark:text-frost-300 hover:bg-frost-200 dark:hover:bg-ink-700 border border-transparent dark:border-white/10"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reintentar Caso</span>
                  </button>

                  <button
                    onClick={handleNextScenario}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 shadow-md shadow-emerald-500/20"
                  >
                    <span>Siguiente Caso Clínico</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedOptionId}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-amber-500/20 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Validar Dictamen Técnico</span>
                </button>
              )}
            </div>

            {/* Specific feedback for the selected option */}
            {hasSubmitted && selectedOpt && (
              <div className={`mt-4 p-4 rounded-2xl border text-xs leading-relaxed ${
                selectedOpt.isCorrect 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200'
              }`}>
                <div className="font-bold flex items-center gap-1.5 mb-1.5">
                  {selectedOpt.isCorrect ? (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <span>¡Dictamen Técnico Correcto!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-500" />
                      <span>Dictamen Erróneo o Incompleto:</span>
                    </>
                  )}
                </div>
                <p>{selectedOpt.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comprehensive Explanatory Section: Theory + Recommended Solution (Visible Always / Detailed upon Submission) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Theory & Thermodynamic Foundation */}
        <div className="bg-white dark:bg-ink-900 border border-frost-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 pb-2 border-b border-frost-100 dark:border-white/10">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-frost-900 dark:text-white">
                Fundamento Físico & Teoría Termodinámica
              </h4>
              <span className="text-[11px] text-frost-400 font-mono">
                Mecánica de fluidos y transferencia de calor
              </span>
            </div>
          </div>

          <p className="text-xs text-frost-600 dark:text-frost-300 leading-relaxed">
            {currentScenario.technicalTheory}
          </p>

          <div className="p-3.5 rounded-2xl bg-frost-50 dark:bg-ink-950 border border-frost-200 dark:border-white/10 text-xs text-frost-700 dark:text-frost-300 font-medium">
            <span className="text-refri-500 font-bold block mb-1">💡 Regla Didáctica de Oro:</span>
            {currentScenario.educationalNote}
          </div>
        </div>

        {/* Recommended Step-by-Step Practical Solution */}
        <div className="bg-white dark:bg-ink-900 border border-frost-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 pb-2 border-b border-frost-100 dark:border-white/10">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-frost-900 dark:text-white">
                Protocolo de Solución Técnica Recomendado
              </h4>
              <span className="text-[11px] text-frost-400 font-mono">
                Buenas prácticas normativas de refrigeración
              </span>
            </div>
          </div>

          <p className="text-xs text-frost-600 dark:text-frost-300 leading-relaxed whitespace-pre-line">
            {currentScenario.recommendedSolution}
          </p>

          {role === 'professor' && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300">
              <span className="font-bold flex items-center gap-1.5 mb-1">
                <GraduationCap className="w-4 h-4 text-amber-500" />
                Pauta Pedagógica para la Clase:
              </span>
              <span>
                Haga hincapié en que los alumnos no salten a conclusiones solo por la presión de baja. En este caso particular ({currentScenario.title}), analicen primero el Subenfriamiento y el Recalentamiento cruzado con el consumo de corriente.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
