/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageTab } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Preloader } from './components/Preloader';
import { HomeView } from './pages/HomeView';
import { HowItWorksView } from './pages/HowItWorksView';
import { DashboardView } from './pages/DashboardView';
import { InteractiveLabView } from './pages/InteractiveLabView';
import { ResearchView } from './pages/ResearchView';
import { TeamView } from './pages/TeamView';

export default function App() {
  const [activeTab, setActiveTab] = useState<PageTab>('home');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync hash routing if present
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageTab;
      if (['home', 'how-it-works', 'dashboard', 'lab', 'research', 'team'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: PageTab) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Creative Engineering Preloader */}
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      {/* Main website layout - hidden while preloader is running */}
      <div className={`flex flex-col min-h-screen transition-opacity duration-300 ${isLoading ? 'invisible opacity-0 pointer-events-none' : 'visible opacity-100'}`}>
        <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

        <main className="flex-1">
          {activeTab === 'home' && <HomeView onTabChange={handleTabChange} />}
          {activeTab === 'how-it-works' && <HowItWorksView />}
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'lab' && <InteractiveLabView />}
          {activeTab === 'research' && <ResearchView />}
          {activeTab === 'team' && <TeamView />}
        </main>

        <Footer onTabChange={handleTabChange} />
      </div>
    </div>
  );
}
