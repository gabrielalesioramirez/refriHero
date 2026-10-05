import React, { useState } from 'react';
import {
  Sun,
  Moon,
  GraduationCap,
  UserCheck,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { REFRIGERANTS } from '../../data/refrigerants';
import type { NavigationTab } from '../../types';

const NAV_ITEMS: { id: NavigationTab; label: string }[] = [
  { id: 'welcome', label: 'Inicio' },
  { id: 'calculators', label: 'Calculadoras Térmicas' },
  { id: 'view3d', label: 'Simuladores de Circuitos' },
  { id: 'simulator', label: 'Trivia' },
];

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const {
    activeTab,
    setActiveTab,
    selectedRefrigerantId,
    setSelectedRefrigerantId,
    role,
    toggleRole
  } = useAppState();

  const [mobileOpen, setMobileOpen] = useState(false);

  const currentGas = REFRIGERANTS.find(r => r.id === selectedRefrigerantId) || REFRIGERANTS[0];

  const goTo = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-ink-900/95 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-6xl mx-auto h-14 px-3 sm:px-6 flex items-center justify-between gap-3">
        {/* Brand: Refri-Master */}
        <button
          id="nav-brand"
          onClick={() => goTo('welcome')}
          className="flex items-center gap-2 shrink-0 group"
          aria-label="Ir al inicio"
        >
          {/* Cylinder icon */}
          <span className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 via-blue-600 to-rose-500 flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="6" width="14" height="15" rx="3" fill="#0284c7" stroke="#ffffff" />
              <path d="M9 3h6v3H9z" fill="#f43f5e" stroke="#ffffff" />
              <line x1="12" y1="1" x2="12" y2="3" stroke="#ffffff" />
              <path d="M8 12h8" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
          </span>
          <span className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-0.5">
            Refri<span className="text-frost-200">Hero</span>
          </span>
        </button>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 h-full" aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => goTo(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive 
                    ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/20' 
                    : 'text-frost-300 hover:text-white hover:bg-white/5'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right side controls visible at all times: Gas Selector, User Role, Dark/Light Mode */}
        <div className="flex items-center gap-2 shrink-0">
          {/* 1. Tipo de Gas (Refrigerante) */}
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs shadow-sm hover:bg-white/15 transition-colors"
            title="Refrigerante de trabajo normativo"
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: currentGas.colorCode }}
              title={`Color normativo ASHRAE: ${currentGas.name}`}
            />
            <select
              id="header-refrigerant-select"
              value={selectedRefrigerantId}
              onChange={(e) => setSelectedRefrigerantId(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-0.5"
              aria-label="Seleccionar refrigerante"
            >
              {REFRIGERANTS.map((ref) => (
                <option key={ref.id} value={ref.id} className="text-frost-900 bg-white">
                  {ref.name} ({ref.safetyGroup})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Modo Usuario (Profesor / Alumno) */}
          <button
            id="header-role-toggle"
            onClick={toggleRole}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border shadow-sm ${
              role === 'professor'
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 hover:bg-amber-500/30'
                : 'bg-refri-500/20 text-refri-300 border-refri-400/40 hover:bg-refri-500/30'
            }`}
            title="Alternar modo de usuario (Profesor / Alumno)"
          >
            {role === 'professor' ? (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Profesor</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5 text-refri-400" />
                <span className="hidden sm:inline">Alumno</span>
              </>
            )}
          </button>

          {/* 3. Modo Claro / Oscuro */}
          <button
            id="header-theme-toggle"
            onClick={toggleTheme}
            className="p-1.5 rounded-full text-frost-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-colors focus:outline-none"
            title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-frost-100" />
            )}
          </button>

          {/* Mobile hamburger toggle for navigation */}
          <button
            id="nav-mobile-toggle"
            onClick={() => setMobileOpen(prev => !prev)}
            className="lg:hidden p-1.5 rounded-md text-frost-200 hover:text-white hover:bg-white/5"
            aria-label="Abrir menú de navegación"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-white/10 bg-ink-900 px-4 py-2 space-y-1 animate-fadeIn" aria-label="Navegación móvil">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => goTo(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isActive ? 'bg-white/15 text-white font-bold' : 'text-frost-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};
