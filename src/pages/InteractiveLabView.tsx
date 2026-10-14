import React, { useState, useEffect, useMemo } from 'react';
import {
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  CloudRain,
  Flame,
  Gauge,
  Droplet,
  Info,
  CheckCircle2,
  AlertTriangle,
  Beaker,
  Maximize2
} from 'lucide-react';

export const InteractiveLabView: React.FC = () => {
  // Physical simulation parameters
  const [flowRate, setFlowRate] = useState<number>(45); // L/min (0 - 100)
  const [pressure, setPressure] = useState<number>(3.5); // bar (0.5 - 8.0)
  const [crackSize, setCrackSize] = useState<number>(0); // µm (0 - 500)
  const [externalRain, setExternalRain] = useState<number>(0); // % (0 - 100)
  const [stripGain, setStripGain] = useState<number>(1.0); // 0.2 - 2.0
  const [dualStripMode, setDualStripMode] = useState<boolean>(true); // Differential dual strip

  // Simulation time loop for droplet particles
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => (t + 1) % 1000);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Presets
  const applyPreset = (presetName: 'NORMAL' | 'PINHOLE' | 'RAIN' | 'BURST') => {
    if (presetName === 'NORMAL') {
      setFlowRate(45);
      setPressure(3.2);
      setCrackSize(0);
      setExternalRain(0);
      setStripGain(1.0);
    } else if (presetName === 'PINHOLE') {
      setFlowRate(42);
      setPressure(3.8);
      setCrackSize(140);
      setExternalRain(0);
      setStripGain(1.0);
    } else if (presetName === 'RAIN') {
      setFlowRate(45);
      setPressure(3.0);
      setCrackSize(0);
      setExternalRain(85);
      setStripGain(1.0);
    } else if (presetName === 'BURST') {
      setFlowRate(65);
      setPressure(5.2);
      setCrackSize(420);
      setExternalRain(10);
      setStripGain(1.2);
    }
  };

  // Physical calculations
  // Orifice equation: Q_leak = Cd * Area * sqrt(2 * P / rho)
  // Scaled for demo presentation
  const leakRateLPerHour = useMemo(() => {
    if (crackSize === 0) return 0;
    const crackAreaMm2 = (crackSize / 1000) * 1.5; // slot approx
    const pressurePa = pressure * 100000;
    const velocity = Math.sqrt((2 * pressurePa) / 1000); // m/s
    const rateM3PerSec = 0.62 * (crackAreaMm2 * 1e-6) * velocity;
    return Number((rateM3PerSec * 3600 * 1000).toFixed(2)); // L/hour
  }, [crackSize, pressure]);

  const annualLossM3 = useMemo(() => {
    return Number(((leakRateLPerHour * 24 * 365) / 1000).toFixed(1));
  }, [leakRateLPerHour]);

  // Wetting calculations
  // Lower Invert Strip Wetting (internal leak accumulates directly here by gravity)
  const invertWettingPercent = useMemo(() => {
    const leakFactor = Math.min(100, (crackSize / 350) * 100);
    const rainInvertBleed = externalRain * 0.25; // only small portion of rain flows to bottom
    const total = Math.min(100, (leakFactor + rainInvertBleed) * stripGain);
    return Number(total.toFixed(1));
  }, [crackSize, externalRain, stripGain]);

  // Upper Crown Strip Wetting (rain wets top first, internal leak doesn't reach top against gravity)
  const crownWettingPercent = useMemo(() => {
    const rainFactor = externalRain * 0.95;
    const total = Math.min(100, rainFactor * stripGain);
    return Number(total.toFixed(1));
  }, [externalRain, stripGain]);

  // Resistance: R(wet) = R_dry / (1 + k * Wetting)
  const invertResistanceKOhms = useMemo(() => {
    if (invertWettingPercent <= 0.5) return 492.0;
    const r = 500 / (1 + (invertWettingPercent / 2.5));
    return Number(Math.max(4.2, r).toFixed(1));
  }, [invertWettingPercent]);

  const crownResistanceKOhms = useMemo(() => {
    if (crownWettingPercent <= 0.5) return 498.0;
    const r = 500 / (1 + (crownWettingPercent / 2.5));
    return Number(Math.max(4.5, r).toFixed(1));
  }, [crownWettingPercent]);

  const invertVoltage = useMemo(() => {
    // 3.3V divider with 100k pullup: V = 3.3 * (R / (R + 100))
    return Number((3.3 * (invertResistanceKOhms / (invertResistanceKOhms + 100))).toFixed(2));
  }, [invertResistanceKOhms]);

  // Intelligent Classification
  const classification = useMemo(() => {
    if (crackSize > 300 && invertResistanceKOhms < 15) {
      return {
        label: 'CRITICAL PIPE BURST',
        type: 'CRITICAL',
        color: 'text-rose-600 bg-rose-50 border-rose-300',
        detail: 'Massive fluid breach. Immediate automatic valve isolation recommended.'
      };
    }
    if (invertResistanceKOhms < 60 && crownResistanceKOhms > 350) {
      return {
        label: 'INTERNAL LEAKAGE CONFIRMED',
        type: 'LEAK',
        color: 'text-rose-600 bg-rose-50 border-rose-300',
        detail: 'Bottom invert strip saturated while top crown strip remains dry. Fluid originated inside pipe.'
      };
    }
    if (crownResistanceKOhms < 120 && invertResistanceKOhms < 120) {
      return {
        label: 'EXTERNAL RAIN / GROUND RUNOFF',
        type: 'RAIN',
        color: 'text-amber-700 bg-amber-50 border-amber-300',
        detail: 'Top crown strip wet simultaneously with bottom. Classified as environmental weather event, not internal leak.'
      };
    }
    if (crownResistanceKOhms < 150 && invertResistanceKOhms > 300) {
      return {
        label: 'SURFACE RAIN SHOWER',
        type: 'RAIN',
        color: 'text-amber-700 bg-amber-50 border-amber-300',
        detail: 'Moisture detected exclusively on upper pipe surface. Pipeline core intact.'
      };
    }
    return {
      label: 'NOMINAL (NO LEAK DETECTED)',
      type: 'NOMINAL',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-300',
      detail: 'Both sensor strips maintain high impedance (>450 kΩ). Pipeline integrity verified.'
    };
  }, [invertResistanceKOhms, crownResistanceKOhms, crackSize]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* 1. Header & Presets Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              <span>Interactive Virtual Test Bench</span>
              <span aria-hidden="true">·</span>
              <span>Full Physics Simulation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Virtual Pipeline Laboratory
            </h1>
          </div>

          {/* Quick Scenario Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 px-2">Presets:</span>
            <button
              onClick={() => applyPreset('NORMAL')}
              className="px-3 py-1.5 text-xs font-semibold bg-white text-slate-700 hover:text-blue-600 rounded-lg shadow-xs border border-slate-200 transition-colors cursor-pointer"
            >
              Normal Flow
            </button>
            <button
              onClick={() => applyPreset('PINHOLE')}
              className="px-3 py-1.5 text-xs font-semibold bg-white text-rose-700 hover:bg-rose-50 rounded-lg shadow-xs border border-slate-200 transition-colors cursor-pointer"
            >
              Pinhole Seepage
            </button>
            <button
              onClick={() => applyPreset('RAIN')}
              className="px-3 py-1.5 text-xs font-semibold bg-white text-amber-700 hover:bg-amber-50 rounded-lg shadow-xs border border-slate-200 transition-colors cursor-pointer"
            >
              Rain Wetting
            </button>
            <button
              onClick={() => applyPreset('BURST')}
              className="px-3 py-1.5 text-xs font-semibold bg-white text-rose-800 hover:bg-rose-50 rounded-lg shadow-xs border border-slate-200 transition-colors cursor-pointer"
            >
              Joint Burst
            </button>
          </div>
        </div>

        {/* Classifier Status Banner */}
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${classification.color}`}>
          <div className="flex items-center gap-3">
            {classification.type === 'NOMINAL' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            ) : classification.type === 'RAIN' ? (
              <CloudRain className="w-5 h-5 shrink-0 text-amber-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
            )}
            <div>
              <div className="text-xs font-mono font-bold tracking-wider">
                CLASSIFIER DECISION: {classification.label}
              </div>
              <div className="text-xs mt-0.5 opacity-90">
                {classification.detail}
              </div>
            </div>
          </div>
          <div className="text-xs font-mono font-semibold shrink-0">
            CONFIDENCE: {crackSize > 0 || externalRain > 0 ? '97.8%' : '99.9%'}
          </div>
        </div>
      </div>

      {/* 2. Main Lab Grid: Left Controls, Center Rig, Right Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (4 cols): Parameter Controls Deck */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Hydraulic & Environmental Inputs</span>
            </h3>
            <button
              onClick={() => applyPreset('NORMAL')}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Control 1: Crack / Aperture Width */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="crack-slider" className="font-semibold text-slate-700">
                Micro-Fissure Aperture Width
              </label>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {crackSize} µm
              </span>
            </div>
            <input
              id="crack-slider"
              type="range"
              min="0"
              max="500"
              step="10"
              value={crackSize}
              onChange={(e) => setCrackSize(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 µm (Intact)</span>
              <span>250 µm</span>
              <span>500 µm (Rupture)</span>
            </div>
          </div>

          {/* Control 2: Internal Pressure */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="pressure-slider" className="font-semibold text-slate-700">
                Internal Hydrostatic Pressure
              </label>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {pressure.toFixed(1)} bar
              </span>
            </div>
            <input
              id="pressure-slider"
              type="range"
              min="0.5"
              max="8.0"
              step="0.1"
              value={pressure}
              onChange={(e) => setPressure(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0.5 bar</span>
              <span>3.5 bar (Standard)</span>
              <span>8.0 bar (High)</span>
            </div>
          </div>

          {/* Control 3: Flow Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="flow-slider" className="font-semibold text-slate-700">
                Pipeline Fluid Velocity / Flow
              </label>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {flowRate} L/min
              </span>
            </div>
            <input
              id="flow-slider"
              type="range"
              min="0"
              max="100"
              step="5"
              value={flowRate}
              onChange={(e) => setFlowRate(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 L/min</span>
              <span>50 L/min</span>
              <span>100 L/min</span>
            </div>
          </div>

          {/* Control 4: External Rain & Moisture */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="rain-slider" className="font-semibold text-slate-700 flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                <span>External Rain / Weather Wetting</span>
              </label>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {externalRain}%
              </span>
            </div>
            <input
              id="rain-slider"
              type="range"
              min="0"
              max="100"
              step="5"
              value={externalRain}
              onChange={(e) => setExternalRain(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% (Dry Indoor)</span>
              <span>50%</span>
              <span>100% (Torrential)</span>
            </div>
          </div>

          {/* Control 5: Sensor Strip Gain */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="gain-slider" className="font-semibold text-slate-700">
                ADC Sensor Strip Gain
              </label>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {stripGain.toFixed(1)}x
              </span>
            </div>
            <input
              id="gain-slider"
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={stripGain}
              onChange={(e) => setStripGain(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Dual Strip Toggle */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-800">
                Dual-Strip Differential Logic
              </div>
              <div className="text-[11px] text-slate-500">
                Crown strip (top) + Invert strip (bottom)
              </div>
            </div>
            <input
              type="checkbox"
              checked={dualStripMode}
              onChange={(e) => setDualStripMode(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Center & Right Column (8 cols): Interactive Canvas & Diagnostic Readouts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Virtual Pipeline Apparatus Canvas */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2 text-cyan-400 font-bold">
                <Beaker className="w-4 h-4" />
                <span>DYNAMIC PIPELINE TEST BENCH</span>
              </span>
              <span>FRAME TICK : {tick}</span>
            </div>

            {/* SVG Interactive Pipeline Rig */}
            <div className="relative w-full h-[320px] sm:h-[360px] flex items-center justify-center">
              <svg
                viewBox="0 0 700 360"
                className="w-full h-full select-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* External Rain Animation if active */}
                {externalRain > 0 && (
                  <g opacity={externalRain / 100}>
                    {/* Falling rain streaks */}
                    {[...Array(16)].map((_, i) => {
                      const x = 50 + i * 40;
                      const yOffset = (tick * 8 + i * 35) % 360;
                      return (
                        <line
                          key={i}
                          x1={x}
                          y1={yOffset}
                          x2={x - 4}
                          y2={yOffset + 12}
                          stroke="#38bdf8"
                          strokeWidth="1.5"
                          opacity="0.6"
                        />
                      );
                    })}
                    <text x="30" y="30" fill="#38bdf8" fontSize="10" fontFamily="JetBrains Mono">
                      🌧 AMBIENT RAIN ACTIVE ({externalRain}%)
                    </text>
                  </g>
                )}

                {/* PRESSURE GAUGE DIAL (Top Right) */}
                <g transform="translate(560, 40)">
                  <circle cx="40" cy="40" r="32" fill="#0f172a" stroke="#334155" strokeWidth="3" />
                  <circle cx="40" cy="40" r="28" fill="#020617" />
                  {/* Gauge ticks */}
                  <line x1="20" y1="40" x2="26" y2="40" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="40" y1="20" x2="40" y2="26" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="60" y1="40" x2="54" y2="40" stroke="#94a3b8" strokeWidth="1.5" />
                  {/* Gauge needle based on pressure */}
                  {(() => {
                    const angle = -120 + (pressure / 8.0) * 240;
                    const rad = (angle * Math.PI) / 180;
                    const nx = 40 + Math.sin(rad) * 22;
                    const ny = 40 - Math.cos(rad) * 22;
                    return (
                      <line x1="40" y1="40" x2={nx} y2={ny} stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
                    );
                  })()}
                  <circle cx="40" cy="40" r="3" fill="#f43f5e" />
                  <text x="40" y="62" fill="#ffffff" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">
                    {pressure.toFixed(1)} BAR
                  </text>
                </g>

                {/* MAIN PIPE BODY */}
                {/* Upper crown strip if dual mode */}
                {dualStripMode && (
                  <g>
                    <rect
                      x="90"
                      y="110"
                      width="420"
                      height="6"
                      rx="2"
                      fill={crownWettingPercent > 10 ? '#38bdf8' : '#eab308'}
                      stroke="#ca8a04"
                      strokeWidth="1"
                    />
                    <text x="100" y="104" fill="#fbbf24" fontSize="9" fontFamily="JetBrains Mono">
                      TOP CROWN SENSOR STRIP (R = {crownResistanceKOhms} kΩ)
                    </text>
                  </g>
                )}

                {/* Upper pipe wall */}
                <rect x="70" y="118" width="460" height="14" fill="#334155" stroke="#475569" strokeWidth="1" />

                {/* Fluid Core */}
                <rect x="70" y="132" width="460" height="96" fill="#0369a1" fillOpacity="0.45" />

                {/* Flowing animated bubble particles */}
                {flowRate > 0 && (
                  <g>
                    {[...Array(12)].map((_, i) => {
                      const speed = flowRate / 10;
                      const cx = 70 + ((tick * speed + i * 40) % 450);
                      const cy = 145 + (i * 7) % 70;
                      return (
                        <circle
                          key={i}
                          cx={cx}
                          cy={cy}
                          r={2 + (i % 3)}
                          fill="#e0f2fe"
                          opacity="0.75"
                        />
                      );
                    })}
                  </g>
                )}

                {/* Lower pipe wall with fracture */}
                <rect x="70" y="228" width="180" height="14" fill="#334155" stroke="#475569" strokeWidth="1" />
                <rect x="270" y="228" width="260" height="14" fill="#334155" stroke="#475569" strokeWidth="1" />

                {/* Fissure Gap */}
                <rect
                  x="250"
                  y="228"
                  width={Math.max(4, Math.min(20, crackSize / 20))}
                  height="14"
                  fill="#020617"
                  stroke={crackSize > 0 ? '#f43f5e' : '#475569'}
                  strokeWidth="1.5"
                />

                {/* ESCAPING LEAKAGE DROPLETS */}
                {crackSize > 0 && (
                  <g>
                    {/* Droplet stream falling onto strip */}
                    {[...Array(5)].map((_, i) => {
                      const dropY = 242 + ((tick * 4 + i * 15) % 25);
                      return (
                        <circle
                          key={i}
                          cx={255 + (i % 3) * 2}
                          cy={dropY}
                          r={3 + (crackSize / 200)}
                          fill="#38bdf8"
                          opacity="0.9"
                        />
                      );
                    })}

                    {/* Fluid pool puddle on lower sensor strip */}
                    <ellipse
                      cx="260"
                      cy="252"
                      rx={Math.min(50, 15 + crackSize / 10)}
                      ry="4"
                      fill="#38bdf8"
                      opacity="0.8"
                    />

                    {/* Electric contact glow */}
                    <circle cx="260" cy="252" r="10" fill="#38bdf8" fillOpacity="0.2" />
                    <line x1="250" y1="248" x2="270" y2="254" stroke="#ffffff" strokeWidth="1" />
                  </g>
                )}

                {/* LOWER INVERT SENSOR STRIP */}
                <rect
                  x="90"
                  y="244"
                  width="420"
                  height="8"
                  rx="2"
                  fill={invertWettingPercent > 10 ? '#38bdf8' : '#f59e0b'}
                  stroke="#b45309"
                  strokeWidth="1"
                />

                {/* Grid lines inside strip */}
                <g stroke="#78350f" strokeWidth="1">
                  {[...Array(20)].map((_, i) => (
                    <line key={i} x1={100 + i * 20} y1="246" x2={100 + i * 20} y2="250" />
                  ))}
                </g>

                <text x="100" y="268" fill="#fbbf24" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                  ◄ LOWER INVERT SENSOR STRIP (R = {invertResistanceKOhms} kΩ) ►
                </text>

                {/* Flow text inside pipe */}
                <text x="220" y="185" fill="#ffffff" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">
                  {flowRate > 0 ? `VELOCITY: ${flowRate} L/min` : 'STAGNANT PIPE'}
                </text>
              </svg>
            </div>
          </div>

          {/* Real-Time Quantitative Analysis Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Loss Flow Rate
              </div>
              <div className="text-2xl font-mono font-bold text-slate-900 tabular-nums">
                {leakRateLPerHour} <span className="text-xs font-normal text-slate-500">L/h</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Annual: {annualLossM3} m³ / year
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Lower Invert Impedance
              </div>
              <div className="text-2xl font-mono font-bold text-slate-900 tabular-nums">
                {invertResistanceKOhms} <span className="text-xs font-normal text-slate-500">kΩ</span>
              </div>
              <div className="text-[11px] text-slate-500">
                ADC Sense: {invertVoltage} V
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Crown (Top) Impedance
              </div>
              <div className="text-2xl font-mono font-bold text-slate-900 tabular-nums">
                {crownResistanceKOhms} <span className="text-xs font-normal text-slate-500">kΩ</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Weather Wetting: {crownWettingPercent}%
              </div>
            </div>
          </div>

          {/* Differential Analysis & Rain Rejection Explanation */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              <span>How SEEPORA Rejects Rain False Positives (Differential Logic)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <span className="font-bold text-slate-800">Scenario A: Genuine Internal Seepage</span>
                <p>
                  Escaping pressurized water leaks from inside the pipe wall and flows downward via gravity. The <strong>bottom invert strip</strong> drops to &lt;20 kΩ while the <strong>top crown strip</strong> remains dry (&gt;450 kΩ). Confirmed leak!
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <span className="font-bold text-slate-800">Scenario B: Torrential Rain Exposure</span>
                <p>
                  Rain droplets fall from above and wet the <strong>top crown strip</strong> first (&lt;50 kΩ). The micro-controller detects ambient weather wetting and suppresses pipeline breach alarms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
