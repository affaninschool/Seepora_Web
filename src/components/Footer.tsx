import React from 'react';
import { PageTab } from '../types';
import { ShieldAlert, Cpu, Award } from 'lucide-react';
import { SeeporaLogo } from './SeeporaLogo';
import { PROJECT_METADATA } from '../data/projectData';

interface FooterProps {
  onTabChange: (tab: PageTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <SeeporaLogo className="w-8 h-8 shrink-0" />
              <span className="text-lg font-bold tracking-tight text-white">SEEPORA</span>
            </div>

            {/* Official Badge in Footer */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/60 text-amber-300 text-xs font-semibold">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Seva First Innovation Challenge Official Entry</span>
            </div>

            <p className="text-xs text-slate-300 font-medium">
              Detect Leaks. Protect Every Drop.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A student engineering research project exploring low-cost, surface-mounted rainwater sensor-strip nodes for localized water pipeline leak detection. Developed by Affan Adil under the mentorship of Dr. Rajesh Sharma at Delhi Public School, R.K. Puram.
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
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('hardware')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Hardware & Lab Evidence
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('cost')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  ₹600 Itemised Cost BOM
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('pilot')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  School Pilot Deployment Plan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('research')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Research & Trials Matrix
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('lab')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Interactive Pipeline Lab
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('dashboard')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Live Monitoring Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About (Affan Adil & Mentor)
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
              {PROJECT_METADATA.statusLine}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              The sensor shows surface electrolytic wetness, not a confirmed interior pipe burst. Contextual classification is required before municipal pipeline shutoff.
            </p>
            <div className="text-xs text-slate-500 flex items-center gap-2 pt-1">
              <Cpu className="w-3 h-3 text-slate-400" />
              <span>Hardware: ESP8266 + FC-37 Interdigitated Strip</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Project SEEPORA. Affan Adil · Delhi Public School, R.K. Puram.</p>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Faculty Mentor: Dr. Rajesh Sharma</span>
            <span>·</span>
            <span className="text-amber-400">Seva First Innovation Challenge</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
