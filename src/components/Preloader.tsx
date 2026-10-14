import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';
import { SeeporaLogo } from './SeeporaLogo';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [phaseText, setPhaseText] = useState<string>('Initializing Sensor Telemetry Bus...');
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2000; // 2 seconds calibration sequence

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const current = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(current);

      if (current < 28) {
        setPhaseText('Establishing High-Z Microcontroller Link (115.2 kbps)...');
      } else if (current < 58) {
        setPhaseText('Calibrating Horizontal Invert Strip (1.2mm Pitch)...');
      } else if (current < 85) {
        setPhaseText('Verifying Dual-Strip Differential Logic Matrix...');
      } else if (current < 100) {
        setPhaseText('Impedance Baseline Verified (>450 kΩ). System Nominal.');
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            onComplete();
          }, 450);
        }, 150);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 200);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white transition-opacity duration-500 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background subtle technical grid */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Skip button top right */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 text-xs font-mono text-slate-400 hover:text-white transition-colors py-1.5 px-3 rounded border border-slate-800 hover:border-slate-600 bg-slate-900/60 backdrop-blur-sm cursor-pointer z-10"
      >
        Skip Preloader [ESC]
      </button>

      {/* Main calibration console */}
      <div className="relative z-10 max-w-md w-full px-6 flex flex-col items-center text-center space-y-6">
        {/* Animated Pipe & Sensor Strip Calibration Graphic */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Rotating outer radar reticle */}
          <svg className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: '6s' }} viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#1e293b"
              strokeWidth="1.5"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2"
              strokeDasharray="40 180"
              strokeLinecap="round"
            />
          </svg>

          {/* Secondary counter-rotating dashed ring */}
          <svg className="absolute inset-2 w-24 h-24 animate-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }} viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray="4 8"
            />
          </svg>

          {/* Center Official Seepora Logo & Subtle Pulse */}
          <div className="relative z-10 w-20 h-20 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-xl shadow-cyan-950/50 p-2">
            <div className="relative flex items-center justify-center">
              <SeeporaLogo className="w-14 h-14" />
              <div
                className="absolute inset-0 rounded-full bg-cyan-400 blur-md opacity-25 animate-ping pointer-events-none"
                style={{ animationDuration: '2.5s' }}
              />
            </div>
          </div>
        </div>

        {/* Brand & System Title */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400 tracking-widest uppercase">
            <Cpu className="w-3.5 h-3.5" />
            <span>PROJECT SEEPORA</span>
            <span>·</span>
            <span>DIAGNOSTIC SUITE</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white font-sans">
            Calibrating Instrumentation
          </h2>
        </div>

        {/* Progress Bar & Numerical Metrics */}
        <div className="w-full space-y-2">
          {/* Progress bar rail */}
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Numerical progress and metrics */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="tabular-nums">CAL_STEP: {progress}%</span>
            <span className="text-cyan-400 tabular-nums">ADC_VREF: 3.30V</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>PASS</span>
            </span>
          </div>
        </div>

        {/* Current phase readout */}
        <div className="min-h-5 flex items-center justify-center">
          <p className="text-xs font-mono text-slate-400 tracking-tight">
            &gt; {phaseText}
          </p>
        </div>
      </div>
    </div>
  );
};
