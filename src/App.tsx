import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { CommandPaletteModal } from './components/common/CommandPaletteModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Vistas Principales
import { ExecutiveDashboardView } from './components/dashboard/ExecutiveDashboardView';
import { ProjectDetailView } from './components/project/ProjectDetailView';
import { SimplePortfolioView } from './components/portfolio/SimplePortfolioView';
import { SimpleFinancesView } from './components/finances/SimpleFinancesView';
import { SimpleCustomersView } from './components/customers/SimpleCustomersView';
import { SimpleFeedbackView } from './components/feedback/SimpleFeedbackView';
import { SettingsView } from './components/settings/SettingsView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
      <ErrorBoundary>
        {activeTab === 'dashboard' && <ExecutiveDashboardView />}
        {activeTab === 'project-detail' && <ProjectDetailView />}
        {(activeTab === 'portfolio' || activeTab === 'products') && <SimplePortfolioView />}
        {(activeTab === 'finances' || activeTab === 'metrics') && <SimpleFinancesView />}
        {(activeTab === 'customers' || activeTab === 'pipeline') && <SimpleCustomersView />}
        {(activeTab === 'feedback' || activeTab === 'ideas' || activeTab === 'bugs') && (
          <SimpleFeedbackView />
        )}
        {activeTab === 'settings' && <SettingsView />}
      </ErrorBoundary>

      {/* Global Search Command Palette (CMD+K / CTRL+K) */}
      <CommandPaletteModal />
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
        <Header />
        <div className="flex-1 flex min-h-[calc(100vh-57px)]">
          <Sidebar />
          <MainContent />
        </div>
        <MobileNav />
        <OfflineIndicator />
      </div>
    </AppProvider>
  );
}
