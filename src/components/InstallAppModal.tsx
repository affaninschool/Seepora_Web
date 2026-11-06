import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Smartphone,
  Apple,
  CheckCircle2,
  Share2,
  PlusSquare,
  ShieldCheck,
  WifiOff,
  Zap,
  ArrowRight
} from 'lucide-react';
import { SeeporaLogo } from './SeeporaLogo';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('android');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Detect OS
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // Check if already in standalone display mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Listen for Chromium beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with vibrant gradient */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 p-2 border border-white/20 flex items-center justify-center shadow-inner">
              <SeeporaLogo className="w-full h-full" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-200 font-semibold">
                Progressive Web App (PWA)
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Download SEEPORA App
              </h2>
            </div>
          </div>
          <p className="text-xs text-blue-100 mt-2 leading-relaxed">
            Install SEEPORA onto your Android phone, iPhone, iPad, or laptop home screen. Works full-screen without app stores, with instant offline access in school corridors and field testing sites.
          </p>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setPlatform('android')}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              platform === 'android'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Android / Chrome</span>
          </button>
          <button
            onClick={() => setPlatform('ios')}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              platform === 'ios'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Apple className="w-4 h-4 text-slate-800" />
            <span>iPhone / iPad (iOS)</span>
          </button>
          <button
            onClick={() => setPlatform('desktop')}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              platform === 'desktop'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Windows / Mac</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Direct Install Button if available */}
          {deferredPrompt && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-blue-900">1-Click Fast Install Ready</span>
                <p className="text-[11px] text-blue-700">Add to your device in 1 second.</p>
              </div>
              <button
                onClick={handleNativeInstall}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install Now</span>
              </button>
            </div>
          )}

          {isInstalled && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>SEEPORA is already installed as a standalone app on this device!</span>
            </div>
          )}

          {/* Android Step-by-Step Instructions */}
          {platform === 'android' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                How to Install on Android:
              </h3>
              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-900">Tap the browser menu (⋮)</strong> in Chrome or Samsung Internet at the top right of the screen.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-900">Select "Install App" or "Add to Home screen"</strong> from the dropdown menu.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-900">Tap "Install"</strong>. The SEEPORA icon will appear right on your home screen with no app store delay.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* iOS Step-by-Step Instructions */}
          {platform === 'ios' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                How to Install on iPhone / iPad (Safari):
              </h3>
              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    Open in <strong>Safari</strong> and tap the <strong className="text-slate-900 inline-flex items-center gap-1 mx-1"><Share2 className="w-3.5 h-3.5 text-blue-600" /> Share button</strong> in the toolbar at the bottom of the screen.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    Scroll down and tap <strong className="text-slate-900 inline-flex items-center gap-1 mx-1"><PlusSquare className="w-3.5 h-3.5 text-slate-700" /> Add to Home Screen</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    Tap <strong className="text-slate-900">"Add"</strong> in the top right corner. SEEPORA will launch in native standalone mode with status bar integration.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Instructions */}
          {platform === 'desktop' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                How to Install on Chrome / Edge (PC & Mac):
              </h3>
              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    Look at the address bar on the right side for the <strong className="text-slate-900 inline-flex items-center gap-1"><Download className="w-3 h-3 text-indigo-600" /> "Install SEEPORA" icon</strong>.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    Click <strong>Install</strong> to run SEEPORA in a focused standalone window with desktop shortcuts and quick taskbar access.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
              <WifiOff className="w-4 h-4 text-blue-600 mb-1" />
              <span className="text-[11px] font-bold text-slate-800">Works Offline</span>
              <span className="text-[10px] text-slate-500">Full cache caching</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
              <Zap className="w-4 h-4 text-amber-600 mb-1" />
              <span className="text-[11px] font-bold text-slate-800">Under 2 MB</span>
              <span className="text-[10px] text-slate-500">Zero bloat</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="text-[11px] font-bold text-slate-800">Direct Updates</span>
              <span className="text-[10px] text-slate-500">Always current</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">DPS R.K. Puram · Seva First Entry</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
