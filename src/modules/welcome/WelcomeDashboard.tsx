import React from 'react';
import { ArrowRight, AlertTriangle, Calculator, Box, BookOpen } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { ThermodynamicCyclePreview } from './ThermodynamicCyclePreview';
import { QuickReferenceGuide } from './QuickReferenceGuide';
import { CycleDiagram, PhDiagram, GaugesIllustration, FlowchartIllustration } from './HomeIllustrations';
import { REFRIGERANTS } from '../../data/refrigerants';
import { FAULT_SCENARIOS } from '../../data/faultScenarios';

export const WelcomeDashboard: React.FC = () => {
  const { setActiveTab, selectedRefrigerantId, role, navigateToScenario } = useAppState();
  const currentGas = REFRIGERANTS.find(r => r.id === selectedRefrigerantId) || REFRIGERANTS[0];

  // "Caso del día": rotates daily through the available fault scenarios
  const featuredCase = FAULT_SCENARIOS[new Date().getDate() % FAULT_SCENARIOS.length];

  const goTo = (tab: Parameters<typeof setActiveTab>[0]) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const newsCards = [
    {
      id: 'card-calculators',
      icon: Calculator,
      title: 'Termodinámica del Ciclo del Frío',
      subtitle: 'Recalentamiento, subenfriamiento y relación P-T',
      illustration: <PhDiagram />,
      cta: 'Ir al Módulo',
      ctaVariant: 'dark' as const,
      onClick: () => goTo('calculators'),
    },
    {
      id: 'card-view3d',
      icon: Box,
      title: 'Simulador de Carga de Refrigerante',
      subtitle: 'Presiones y flujo de refrigerante en tiempo real',
      illustration: <GaugesIllustration />,
      cta: 'Iniciar Simulación',
      ctaVariant: 'white' as const,
      onClick: () => goTo('view3d'),
    },
    {
      id: 'card-case',
      icon: AlertTriangle,
      title: 'Caso de Estudio: Fuga en Cámara Frigorífica',
      subtitle: 'R-404A · Diagnóstico guiado de árbol de fallas',
      illustration: <FlowchartIllustration />,
      cta: 'Resolver Caso',
      ctaVariant: 'dark' as const,
      onClick: () => {
        const leakCase = FAULT_SCENARIOS.find(s => s.id.toLowerCase().includes('leak') || s.title.toLowerCase().includes('fuga')) || featuredCase;
        navigateToScenario(leakCase.id);
      },
    },
  ];

  return (
    <div className="animate-fadeIn">
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-800 to-ink-700 text-white">
        {/* soft ambient lights */}
        <div className="pointer-events-none absolute -top-24 right-10 w-[28rem] h-[28rem] rounded-full bg-refri-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-0 w-[24rem] h-[24rem] rounded-full bg-rose-500/5 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 lg:py-20 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold leading-tight tracking-tight">
              Domina la Refrigeración
              <br />
              con Refri<span className="text-frost-200">Hero</span>
            </h1>
            <p className="mt-5 text-frost-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Plataforma de formación técnica avanzada para profesionales del frío. Aprende, simula y certifica tus conocimientos.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                id="hero-cta-explore"
                href="#novedades"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-white text-ink-900 text-sm font-semibold shadow-lg shadow-black/20 hover:bg-frost-100 hover:-translate-y-0.5 transition-all"
              >
                Explora nuestros cursos
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                id="hero-cta-simulator"
                onClick={() => goTo('simulator')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-white/25 text-sm font-semibold text-frost-100 hover:bg-white/10 transition-colors"
              >
                {FAULT_SCENARIOS.length} casos de diagnóstico
              </button>
            </div>

            {/* compact stats */}
            <dl className="mt-10 grid grid-cols-3 gap-4 max-w-md border-t border-white/10 pt-6">
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-frost-400">Refrigerante</dt>
                <dd className="mt-1 font-semibold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentGas.colorCode }} />
                  {currentGas.name}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-frost-400">Herramientas</dt>
                <dd className="mt-1 font-semibold">4 calculadoras</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-frost-400">Modo</dt>
                <dd className="mt-1 font-semibold">{role === 'professor' ? 'Docente' : 'Alumno'}</dd>
              </div>
            </dl>
          </div>

          {/* Cycle illustration card */}
          <div className="animate-floatIn">
            <div className="rounded-xl bg-white p-3 sm:p-4 shadow-2xl shadow-black/40 ring-1 ring-white/20 hover:-translate-y-1 transition-transform duration-500">
              <CycleDiagram />
            </div>
          </div>
        </div>
      </section>

      {/* ========================== NOVEDADES ========================== */}
      <section id="novedades" className="scroll-mt-16 max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-xl font-bold text-frost-900 dark:text-white mb-5">Novedades</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {newsCards.map((card) => {
            const Icon = card.icon;
            const isWhiteBtn = card.ctaVariant === 'white';
            return (
              <article
                key={card.id}
                id={card.id}
                className="group flex flex-col rounded-lg bg-ink-800 p-3 shadow-lg shadow-ink-900/20 ring-1 ring-black/5 dark:ring-white/10 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-900/30 transition-all duration-300"
              >
                <header className="px-1 pb-2.5 min-h-[3.25rem]">
                  <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 flex items-start gap-2">
                    <Icon className="w-4 h-4 mt-0.5 shrink-0 text-refri-300" />
                    <span>{card.title}</span>
                  </h3>
                  <p className="mt-0.5 pl-6 text-[11px] text-frost-400 line-clamp-1">{card.subtitle}</p>
                </header>

                <div className="relative rounded-md overflow-hidden bg-white aspect-[16/9] border border-black/10">
                  <div className="absolute inset-0 group-hover:scale-[1.03] transition-transform duration-500">
                    {card.illustration}
                  </div>
                  <button
                    id={`${card.id}-cta`}
                    onClick={card.onClick}
                    className={`absolute left-1/2 -translate-x-1/2 bottom-3.5 px-5 py-1.5 rounded text-xs font-semibold tracking-wide transition-all whitespace-nowrap shadow-md ${
                      isWhiteBtn
                        ? 'bg-white text-ink-900 hover:bg-frost-100 hover:shadow-lg'
                        : 'border border-white/80 bg-ink-900/90 text-white backdrop-blur-sm hover:bg-white hover:text-ink-900'
                    }`}
                  >
                    {card.cta}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ================== CICLO INTERACTIVO + GUÍA ================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-frost-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-refri-500" />
              Material de Estudio
            </h2>
            <p className="text-sm text-frost-500 dark:text-frost-400 mt-0.5">
              Repasa el ciclo frigorífico y las reglas clave antes de diagnosticar.
            </p>
          </div>
        </div>

        <ThermodynamicCyclePreview />
        <QuickReferenceGuide />
      </section>

      {/* ======================= CASOS DE TALLER ======================= */}
      <section className="bg-white dark:bg-ink-900 border-y border-frost-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-frost-900 dark:text-white">Casos de Taller</h2>
              <p className="text-sm text-frost-500 dark:text-frost-400 mt-0.5">
                Elige un caso para abrir el simulador con el diagnóstico cargado.
              </p>
            </div>
            <button
              id="cases-open-simulator"
              onClick={() => goTo('simulator')}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-ink-800 text-white text-sm font-medium hover:bg-ink-700 transition-colors"
            >
              Ver los {FAULT_SCENARIOS.length} casos
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FAULT_SCENARIOS.slice(0, 8).map((scenario, idx) => (
              <button
                key={scenario.id}
                onClick={() => navigateToScenario(scenario.id)}
                className="text-left p-4 rounded-lg bg-frost-50 dark:bg-ink-800 border border-frost-200 dark:border-white/10 hover:border-refri-400 dark:hover:border-refri-500/60 hover:-translate-y-0.5 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-frost-200 dark:bg-ink-700 text-frost-700 dark:text-frost-300 font-semibold">
                      #{idx + 1} · {scenario.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-refri-600 dark:text-refri-400 font-bold">{scenario.refrigerant}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-frost-900 dark:text-white line-clamp-2">{scenario.title}</h3>
                  <p className="text-xs text-frost-500 dark:text-frost-400 line-clamp-1 mt-1">{scenario.systemType}</p>
                </div>
                <span className="mt-3 pt-2 border-t border-frost-200 dark:border-white/10 text-[11px] font-medium text-frost-500 dark:text-frost-400 flex items-center justify-between">
                  {scenario.category}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
