import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import { MainLayout } from './components/layout/MainLayout';
import { WelcomeDashboard } from './modules/welcome/WelcomeDashboard';
import { CalculatorsModule } from './modules/calculators/CalculatorsModule';
import { FaultSimulatorModule } from './modules/faultSimulator/FaultSimulatorModule';
import { View3DPreview } from './modules/view3d/View3DPreview';

const AppContent: React.FC = () => {
  const { activeTab } = useAppState();

  const renderModule = () => {
    switch (activeTab) {
      case 'welcome':
        return <WelcomeDashboard />;
      case 'calculators':
        return <CalculatorsModule />;
      case 'simulator':
        return <FaultSimulatorModule />;
      case 'view3d':
        return <View3DPreview />;
      default:
        return <WelcomeDashboard />;
    }
  };

  return <MainLayout>{renderModule()}</MainLayout>;
};

export function App() {
  return (
    <ThemeProvider>
      <AppStateProvider>
        <AppContent />
      </AppStateProvider>
    </ThemeProvider>
  );
}

export default App;
