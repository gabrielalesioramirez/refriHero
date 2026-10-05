import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAppState } from '../../context/AppStateContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { activeTab } = useAppState();
  const isHome = activeTab === 'welcome';

  return (
    <div className="min-h-screen bg-frost-100 dark:bg-ink-950 text-frost-900 dark:text-frost-100 flex flex-col transition-colors duration-200">
      <Header />

      <main
        key={activeTab}
        className={`flex-1 w-full ${isHome ? '' : 'max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8'}`}
      >
        {children}
      </main>

      <Footer />
    </div>
  );
};
