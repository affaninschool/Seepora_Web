import React, { useState } from 'react';
import { PageTab } from '../types';
import { Menu, X, ArrowUpRight, Award } from 'lucide-react';
import { SeeporaLogo } from './SeeporaLogo';

interface NavbarProps {
  activeTab: PageTab;
  onTabChange: (tab: PageTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { tab: PageTab; label: string }[] = [
    { tab: 'home', label: 'Home' },
    { tab: 'hardware', label: 'Hardware' },
    { tab: 'cost', label: 'Cost' },
    { tab: 'pilot', label: 'Pilot' },
    { tab: 'research', label: 'Research' },
    { tab: 'lab', label: 'Virtual Lab' },
    { tab: 'dashboard', label: 'Dashboard' },
    { tab: 'about', label: 'About' },
  ];

  const handleSelect = (tab: PageTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Single element brand wordmark + Seva First badge */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleSelect('home')}
              className="flex items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md py-1 cursor-pointer"
            >
              <SeeporaLogo className="w-8 h-8 shrink-0" />
              <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap">
                SEEPORA
              </span>
            </button>

            {/* Official Badge for Seva First Innovation Challenge */}
            <div className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-semibold shrink-0">
              <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Seva First Innovation Challenge</span>
            </div>
          </div>

          {/* Zone 2: Clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium text-slate-600 overflow-x-auto py-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.tab || (item.tab === 'about' && activeTab === 'team');
              return (
                <button
                  key={item.tab}
                  onClick={() => handleSelect(item.tab)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'text-blue-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Action button + Mobile trigger */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Seva First Innovation Challenge badge for tablet/medium screens */}
            <div className="hidden sm:inline-flex xl:hidden items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-[10px] font-semibold">
              <Award className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Seva First</span>
            </div>

            <button
              onClick={() => handleSelect('lab')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm active:scale-95"
            >
              <span>Launch Lab</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1.5 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {/* Seva First Innovation Challenge Badge on Mobile */}
          <div className="mb-3 p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Seva First Innovation Challenge Entry</span>
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.tab || (item.tab === 'about' && activeTab === 'team');
            return (
              <button
                key={item.tab}
                onClick={() => handleSelect(item.tab)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => handleSelect('lab')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <span>Open Virtual Pipeline Lab</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
