import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-frost-50 dark:bg-frost-950 text-frost-900 dark:text-frost-100 flex flex-col transition-colors duration-200">
      {/* Sidebar navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Area (offset by sidebar width on large screens) */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0">
        {/* Top Header Bar */}
        <Header onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

        {/* Page Main View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
