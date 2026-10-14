import React from 'react';
import { PageTab } from '../types';
import { ExternalLink, ShieldAlert, Cpu } from 'lucide-react';
import { SeeporaLogo } from './SeeporaLogo';

interface FooterProps {
  onTabChange: (tab: PageTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <SeeporaLogo className="w-8 h-8 shrink-0" />
              <span className="text-lg font-bold tracking-tight text-white">SEEPORA</span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Detect Leaks. Protect Every Drop.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              An engineering research project exploring horizontal conductive sensor-strip methods for localized subterranean water pipeline leakage detection. Moving beyond conventional acoustic and vibration sensors to direct liquid conductivity.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Platform Sections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onTabChange('home')}
                  className="hover:text-white transition-colors"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('how-it-works')}
                  className="hover:text-white transition-colors"
                >
                  How It Works (Principles)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('dashboard')}
                  className="hover:text-white transition-colors"
                >
                  Live Monitoring Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('lab')}
                  className="hover:text-white transition-colors"
                >
                  Interactive Pipeline Lab
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('research')}
                  className="hover:text-white transition-colors"
                >
                  Research & 7 Problems
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('team')}
                  className="hover:text-white transition-colors"
                >
                  Team Seepora (Affan Adil)
                </button>
              </li>
            </ul>
          </div>

          {/* Scientific Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Scientific Disclosure</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Laboratory prototype and virtual simulations represent ongoing empirical exploration. Non-connected telemetry is simulated via hydraulic conductivity equations. No unverified claims of field certification are made.
            </p>
            <div className="text-xs text-slate-500 flex items-center gap-2 pt-1">
              <Cpu className="w-3 h-3 text-slate-400" />
              <span>Concept: Rainwater-strip sensor array</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Project SEEPORA. Lead Researcher: Affan Adil.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Academic Research Project</span>
            <span>·</span>
            <span>Fluid Instrumentation Lab</span>
            <span>·</span>
            <span>Hardware Simulation v12</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
