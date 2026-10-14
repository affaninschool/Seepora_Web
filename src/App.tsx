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
import { HardwareView } from './pages/HardwareView';
import { CostView } from './pages/CostView';
import { PilotView } from './pages/PilotView';
import { HowItWorksView } from './pages/HowItWorksView';
import { DashboardView } from './pages/DashboardView';
import { InteractiveLabView } from './pages/InteractiveLabView';
import { ResearchView } from './pages/ResearchView';
import { AboutView } from './pages/AboutView';

export default function App() {
  const [activeTab, setActiveTab] = useState<PageTab>('home');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync hash routing if present
  useEffect(() => {
    const validTabs: PageTab[] = [
      'home',
      'hardware',
      'cost',
      'pilot',
      'research',
      'lab',
      'dashboard',
      'about',
      'team',
      'how-it-works'
    ];

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageTab;
      if (validTabs.includes(hash)) {
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
          {activeTab === 'hardware' && <HardwareView />}
          {activeTab === 'cost' && <CostView />}
          {activeTab === 'pilot' && <PilotView />}
          {activeTab === 'how-it-works' && <HowItWorksView />}
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'lab' && <InteractiveLabView />}
          {activeTab === 'research' && <ResearchView />}
          {(activeTab === 'about' || activeTab === 'team') && (
            <AboutView onTabChange={handleTabChange} />
          )}
        </main>

        <Footer onTabChange={handleTabChange} />
      </div>
    </div>
  );
}
