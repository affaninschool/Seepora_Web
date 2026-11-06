import React from 'react';
import { PageTab } from '../types';
import { ShieldAlert, Cpu, Award, ExternalLink, Download, Play, FileText } from 'lucide-react';
import { SeeporaLogo } from './SeeporaLogo';
import { PROJECT_METADATA } from '../data/projectData';

interface FooterProps {
  onTabChange: (tab: PageTab) => void;
  onOpenBrief?: () => void;
  onOpenTour?: () => void;
  onOpenInstallApp?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onTabChange,
  onOpenBrief,
  onOpenTour,
  onOpenInstallApp
}) => {
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

            {/* Official Badge & Seva First Innovation Brief in Footer */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onOpenBrief?.()}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-500/60 text-amber-300 text-xs font-semibold transition-colors cursor-pointer group shadow-sm"
                title="Open official Seva First Innovation Brief"
              >
                <Award className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span>Seva First Innovation Brief</span>
                <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.2 rounded text-amber-200 uppercase font-mono">
                  Official Entry
                </span>
              </button>

              <button
                onClick={() => onOpenTour?.()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-rose-400" />
                <span>2-Min Tour PPT</span>
              </button>

              <button
                onClick={() => onOpenInstallApp?.()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Download App</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 font-medium">
              Detect Leaks. Protect Every Drop.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A student engineering research project exploring low-cost, surface-mounted rainwater sensor-strip nodes for localized water pipeline leak detection. Developed by Affan Adil under the mentorship of Sandip Dutta at Delhi Public School, R.K. Puram.
            </p>

            {/* Version Switch & V1 Link */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-950/80 border border-blue-600/50 text-blue-300 font-mono text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                SEEPORA V2 (Current)
              </span>
              <a
                href="https://pipeguards.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors font-mono text-[11px]"
                title="View original V1 prototype at pipeguards.vercel.app"
              >
                <span>PipeGuards (V1)</span>
                <ExternalLink className="w-3 h-3 text-cyan-400" />
              </a>
            </div>
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
                  onClick={() => onTabChange('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About (Affan Adil & Mentor)
                </button>
              </li>
              <li className="pt-2 border-t border-slate-800 space-y-1.5">
                <button
                  onClick={() => onOpenBrief?.()}
                  className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors font-semibold cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span>Seva First Innovation Brief</span>
                </button>
                <a
                  href="https://pipeguards.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors font-medium text-[11px]"
                >
                  <span>PipeGuards (V1 Prototype)</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
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
          <div className="flex flex-wrap items-center gap-3 text-slate-400">
            <span>Faculty Mentor: Sandip Dutta</span>
            <span>·</span>
            <button
              onClick={() => onOpenBrief?.()}
              className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer underline underline-offset-2 flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Seva First Innovation Brief</span>
            </button>
            <span>·</span>
            <a
              href="https://pipeguards.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 transition-colors"
            >
              <span>V1: pipeguards.vercel.app</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
