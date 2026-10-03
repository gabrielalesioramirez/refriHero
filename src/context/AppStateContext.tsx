import React, { createContext, useContext, useState } from 'react';
import type { NavigationTab, UserRole, UnitSystem } from '../types';

interface AppStateContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedRefrigerantId: string;
  setSelectedRefrigerantId: (id: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
  unitSystem: UnitSystem;
  toggleUnitSystem: () => void;
  selectedScenarioId: string | null;
  setSelectedScenarioId: (id: string | null) => void;
  navigateToScenario: (id: string) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('welcome');
  const [selectedRefrigerantId, setSelectedRefrigerantId] = useState<string>('R410A');
  const [role, setRole] = useState<UserRole>('student');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);

  const toggleRole = () => {
    setRole(prev => (prev === 'student' ? 'professor' : 'student'));
  };

  const toggleUnitSystem = () => {
    setUnitSystem(prev => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  const navigateToScenario = (id: string) => {
    setSelectedScenarioId(id);
    setActiveTab('simulator');
  };

  return (
    <AppStateContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedRefrigerantId,
        setSelectedRefrigerantId,
        role,
        setRole,
        toggleRole,
        unitSystem,
        toggleUnitSystem,
        selectedScenarioId,
        setSelectedScenarioId,
        navigateToScenario,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
