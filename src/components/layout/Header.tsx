import React from 'react';
import { 
  Sun, 
  Moon, 
  GraduationCap, 
  UserCheck, 
  Menu
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { REFRIGERANTS } from '../../data/refrigerants';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { 
    activeTab, 
    selectedRefrigerantId, 
    setSelectedRefrigerantId, 
    role, 
    toggleRole 
  } = useAppState();

  const currentRefrigerant = REFRIGERANTS.find(r => r.id === selectedRefrigerantId) || REFRIGERANTS[0];

  const getTabTitle = () => {
    switch (activeTab) {
      case 'welcome':
        return 'Panel Principal & Bienvenida';
      case 'calculators':
        return 'Calculadoras Técnicas Termodinámicas';
      case 'simulator':
        return 'Simulador de Fallas & Diagnóstico HVAC';
      case 'view3d':
        return 'Simulador 3D Split & Gemelo Digital';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-frost-200 dark:border-frost-800 bg-white/80 dark:bg-frost-900/90 backdrop-blur-md px-4 lg:px-6">
      {/* Left section: mobile hamburger & title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-frost-600 dark:text-frost-300 hover:bg-frost-100 dark:hover:bg-frost-800 focus:outline-none transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-frost-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{getTabTitle()}</span>
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-refri-50 text-refri-700 dark:bg-refri-950/80 dark:text-refri-300 border border-refri-200 dark:border-refri-800">
              v1.0 Modular
            </span>
          </div>
          <p className="text-xs text-frost-500 dark:text-frost-400 hidden sm:block">
            Ingeniería & Formación Profesional en Refrigeración y Clima
          </p>
        </div>
      </div>

      {/* Right controls: Refrigerant selector, Role badge, Theme toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Refrigerant Selector */}
        <div className="flex items-center bg-frost-100 dark:bg-frost-800/80 rounded-xl p-1 border border-frost-200 dark:border-frost-700">
          <div 
            className="w-3 h-3 rounded-full ml-2 mr-1 shadow-sm shrink-0" 
            style={{ backgroundColor: currentRefrigerant.colorCode }}
            title={`Color normativo ASHRAE de garrafa para ${currentRefrigerant.name}`}
          />
          <select
            value={selectedRefrigerantId}
            onChange={(e) => setSelectedRefrigerantId(e.target.value)}
            className="bg-transparent text-xs font-semibold text-frost-800 dark:text-frost-100 pr-2 py-1 focus:outline-none cursor-pointer"
            title="Seleccionar refrigerante de trabajo"
          >
            {REFRIGERANTS.map((ref) => (
              <option key={ref.id} value={ref.id} className="dark:bg-frost-900 dark:text-frost-100">
                {ref.name} ({ref.safetyGroup})
              </option>
            ))}
          </select>
        </div>

        {/* User Role Toggle (Profesor / Estudiante) */}
        <button
          onClick={toggleRole}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 shadow-sm ${
            role === 'professor'
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700 hover:bg-amber-500/20'
              : 'bg-refri-500/10 text-refri-600 dark:text-refri-400 border-refri-300 dark:border-refri-700 hover:bg-refri-500/20'
          }`}
          title="Alternar entre vista de Alumno o Docente con notas pedagógicas y respuestas"
        >
          {role === 'professor' ? (
            <>
              <GraduationCap className="w-4 h-4 text-amber-500" />
              <span className="hidden md:inline">Modo Profesor</span>
            </>
          ) : (
            <>
              <UserCheck className="w-4 h-4 text-refri-500" />
              <span className="hidden md:inline">Modo Alumno</span>
            </>
          )}
        </button>

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-frost-600 dark:text-frost-300 bg-frost-100 dark:bg-frost-800/80 border border-frost-200 dark:border-frost-700 hover:bg-frost-200 dark:hover:bg-frost-700 transition-colors focus:outline-none"
          title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
          aria-label="Cambiar tema"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-frost-700" />
          )}
        </button>
      </div>
    </header>
  );
};
