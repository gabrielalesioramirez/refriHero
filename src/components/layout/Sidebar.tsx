import React from 'react';
import { 
  Home, 
  Calculator, 
  AlertTriangle, 
  Box, 
  Snowflake, 
  Activity, 
  X
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import type { NavigationTab } from '../../types';
import { REFRIGERANTS } from '../../data/refrigerants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, selectedRefrigerantId } = useAppState();

  const currentRefrigerant = REFRIGERANTS.find(r => r.id === selectedRefrigerantId) || REFRIGERANTS[0];

  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }>; tag?: string; badgeColor?: string }[] = [
    {
      id: 'welcome',
      label: 'Panel Principal',
      icon: Home,
    },
    {
      id: 'calculators',
      label: 'Calculadoras Técnicas',
      icon: Calculator,
      tag: '4 Herramientas',
      badgeColor: 'bg-refri-500/20 text-refri-400 border-refri-500/30',
    },
    {
      id: 'simulator',
      label: 'Simulador de Fallas',
      icon: AlertTriangle,
      tag: 'Casos Reales',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    {
      id: 'view3d',
      label: 'Simulador 3D Split',
      icon: Box,
      tag: 'Interactivo',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    },
  ];

  const handleNavClick = (tabId: NavigationTab) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-frost-900 border-r border-frost-800 text-frost-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-frost-800/80 bg-frost-950/60">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-refri-600 via-refri-500 to-cyan-300 flex items-center justify-center shadow-lg shadow-refri-500/20">
              <Snowflake className="w-5 h-5 text-white animate-spin-slow" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-frost-900"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">Refri<span className="text-refri-400">Hero</span></span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-refri-500/20 text-refri-300 border border-refri-500/30">PRO</span>
              </div>
              <p className="text-[11px] text-frost-400 font-medium">Laboratorio de Climatización</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-frost-400 hover:text-white hover:bg-frost-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section title */}
        <div className="px-5 pt-5 pb-2 text-[11px] font-bold uppercase tracking-wider text-frost-500">
          Módulos Principales
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group text-left ${
                  isActive
                    ? 'bg-refri-500/15 text-refri-300 border border-refri-500/30 shadow-sm shadow-refri-500/10'
                    : 'text-frost-300 hover:bg-frost-800/60 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-refri-500 text-white' 
                      : 'bg-frost-800/80 text-frost-400 group-hover:text-frost-100 group-hover:bg-frost-700'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-medium">{item.label}</span>
                  </div>
                </div>

                {item.tag && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${item.badgeColor || 'bg-frost-800 text-frost-300 border-frost-700'}`}>
                    {item.tag}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Gas Quick Specs Card */}
        <div className="p-4 m-3 rounded-2xl bg-frost-950/70 border border-frost-800/90 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-frost-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-refri-400" />
              Refrigerante Activo
            </span>
            <span 
              className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold text-white shadow-sm"
              style={{ backgroundColor: currentRefrigerant.colorCode }}
            >
              {currentRefrigerant.safetyGroup}
            </span>
          </div>

          <div className="text-white font-bold text-base flex items-center justify-between">
            <span>{currentRefrigerant.name}</span>
            <span className="text-xs text-frost-400 font-mono font-normal">
              {currentRefrigerant.type}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-frost-800/80 text-[11px] font-mono">
            <div>
              <span className="text-frost-500 block">P. Ebullición:</span>
              <span className="text-frost-200 font-semibold">{currentRefrigerant.boilingPoint1Atm}°C</span>
            </div>
            <div>
              <span className="text-frost-500 block">GWP:</span>
              <span className={`font-semibold ${currentRefrigerant.gwp > 1000 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {currentRefrigerant.gwp}
              </span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-frost-800 text-[11px] text-frost-400 flex items-center justify-between bg-frost-950/40">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Motor Termodinámico Activo</span>
          </div>
          <span className="font-mono text-frost-500">v1.0</span>
        </div>
      </aside>
    </>
  );
};
