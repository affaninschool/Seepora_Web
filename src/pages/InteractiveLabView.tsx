import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Sliders,
  Play,
  Pause,
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
  Maximize2,
  Volume2,
  VolumeX,
  Award,
  Zap,
  Activity,
  ArrowRight,
  Eye,
  Radio,
  FileText,
  Clock,
  Layers,
  ShieldCheck,
  Cpu
} from 'lucide-react';

type PipeMaterial = 'PVC' | 'HDPE' | 'IRON' | 'COPPER';
type RigPerspective = 'LONGITUDINAL' | 'CROSS_SECTION';
type DemoStage = 1 | 2 | 3 | 4 | null;

interface DemoStageInfo {
  stage: number;
  title: string;
  badge: string;
  description: string;
  judgeTakeaway: string;
  params: {
    crackSize: number;
    pressure: number;
    flowRate: number;
    externalRain: number;
    material: PipeMaterial;
  };
}

const DEMO_STAGES: DemoStageInfo[] = [
  {
    stage: 1,
    title: 'Stage 1: Pristine Pipeline (Nominal High-Impedance Baseline)',
    badge: 'NORMAL BASELINE',
    description: 'The pipeline operates under standard 3.5 bar hydrostatic pressure with intact wall integrity (0 µm crack). Dry ambient air between the interdigitated electrodes results in open-circuit resistance (>480 kΩ).',
    judgeTakeaway: 'Proves high electrical baseline impedance (>450 kΩ), establishing zero baseline noise and zero spurious current leakage.',
    params: { crackSize: 0, pressure: 3.5, flowRate: 45, externalRain: 0, material: 'PVC' }
  },
  {
    stage: 2,
    title: 'Stage 2: Micro-Fissure Inception & Gravity Invert Wetting',
    badge: 'MICRO-SEEPAGE DETECTED',
    description: 'A 140 µm hairline fracture forms on the pipe circumference. Escaping droplets travel down the outer wall under gravity to the 6 o’clock invert strip, collapsing impedance from 490 kΩ down to 18 kΩ in 1.4 seconds.',
    judgeTakeaway: 'Demonstrates deterministic gravity accumulation: internal leaks ALWAYS concentrate at the lower invert, triggering sub-2-second local buzzer alarms.',
    params: { crackSize: 140, pressure: 3.8, flowRate: 42, externalRain: 0, material: 'PVC' }
  },
  {
    stage: 3,
    title: 'Stage 3: Weather Stress Test (Differential Rain Rejection)',
    badge: 'EXTERNAL RAIN (NO FALSE ALARM)',
    description: 'Torrential rainfall (85%) strikes the pipe exterior. The top crown strip wets first, while the internal pipe is safe. The dual-strip differential algorithm classifies this as weather and rejects the alarm.',
    judgeTakeaway: 'Solves the #1 problem of surface moisture sensors: differential crown-invert analysis eliminates false alarms without requiring expensive acoustic sensors.',
    params: { crackSize: 0, pressure: 3.2, flowRate: 45, externalRain: 85, material: 'PVC' }
  },
  {
    stage: 4,
    title: 'Stage 4: Critical Joint Burst & Automated Isolation Protocol',
    badge: 'EMERGENCY RUPTURE',
    description: 'A major 420 µm joint displacement under 5.2 bar pressure discharges >85 L/h. Resistance collapses to <8 kΩ. The controller issues an immediate digital isolation trigger to save the campus drinking reserve.',
    judgeTakeaway: 'Proves full-scale emergency response capability, bridging affordable high school hardware with automated municipal safety protocols.',
    params: { crackSize: 420, pressure: 5.2, flowRate: 65, externalRain: 10, material: 'PVC' }
  }
];

export const InteractiveLabView: React.FC = () => {
  // Physical simulation parameters
  const [flowRate, setFlowRate] = useState<number>(45); // L/min (0 - 100)
  const [pressure, setPressure] = useState<number>(3.5); // bar (0.5 - 8.0)
  const [crackSize, setCrackSize] = useState<number>(0); // µm (0 - 500)
  const [externalRain, setExternalRain] = useState<number>(0); // % (0 - 100)
  const [stripGain, setStripGain] = useState<number>(1.0); // 0.2 - 2.0
  const [dualStripMode, setDualStripMode] = useState<boolean>(true); // Differential dual strip
  const [pipeMaterial, setPipeMaterial] = useState<PipeMaterial>('PVC');
  const [leakAngularPos, setLeakAngularPos] = useState<number>(180); // 0=top, 90=right, 180=bottom invert, 270=left
  const [perspective, setPerspective] = useState<RigPerspective>('LONGITUDINAL');

  // Judge Demonstration Tour State
  const [demoStage, setDemoStage] = useState<DemoStage>(null);
  const [isDemoPlaying, setIsDemoPlaying] = useState<boolean>(false);
  const [demoTimerSeconds, setDemoTimerSeconds] = useState<number>(15);

  // Audio buzzer feedback
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastBeepTimeRef = useRef<number>(0);

  // Oscilloscope History Points (last 24 points)
  const [chartHistory, setChartHistory] = useState<{ t: number; r: number; v: number }[]>([]);

  // Simulation time loop for droplet particles
  const [tick, setTick] = useState<number>(0);

  // Initialize Web Audio Context on user request
  const playBuzzerBeep = useCallback((freq = 2400, duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;
      if (now - lastBeepTimeRef.current < 0.35) return; // limit frequency
      lastBeepTimeRef.current = now;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Ignore audio context errors if browser restricts
    }
  }, [soundEnabled]);

  // Main 50ms animation tick loop
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => (t + 1) % 1000);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Physical calculations
  // Orifice equation: Q_leak = Cd * Area * sqrt(2 * P / rho)
  const leakRateLPerHour = useMemo(() => {
    if (crackSize === 0) return 0;
    const crackAreaMm2 = (crackSize / 1000) * 1.5;
    const pressurePa = pressure * 100000;
    const velocity = Math.sqrt((2 * pressurePa) / 1000); // m/s
    const rateM3PerSec = 0.62 * (crackAreaMm2 * 1e-6) * velocity;
    return Number((rateM3PerSec * 3600 * 1000).toFixed(2)); // L/hour
  }, [crackSize, pressure]);

  const annualLossM3 = useMemo(() => {
    return Number(((leakRateLPerHour * 24 * 365) / 1000).toFixed(1));
  }, [leakRateLPerHour]);

  // Wetting calculations
  // Lower Invert Strip Wetting (Internal leak accumulates directly here by gravity)
  const invertWettingPercent = useMemo(() => {
    const leakFactor = Math.min(100, (crackSize / 350) * 100);
    const rainInvertBleed = externalRain * 0.25; // only small portion of rain flows to bottom
    const total = Math.min(100, (leakFactor + rainInvertBleed) * stripGain);
    return Number(total.toFixed(1));
  }, [crackSize, externalRain, stripGain]);

  // Upper Crown Strip Wetting (Rain wets top first; internal leak doesn't reach top against gravity)
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

  // Update chart history every second
  useEffect(() => {
    const interval = setInterval(() => {
      setChartHistory((prev) => {
        const next = [...prev, { t: Date.now(), r: invertResistanceKOhms, v: invertVoltage }];
        return next.slice(-20); // Keep last 20 ticks
      });
    }, 800);
    return () => clearInterval(interval);
  }, [invertResistanceKOhms, invertVoltage]);

  // Intelligent Classification
  const classification = useMemo(() => {
    if (crackSize > 300 && invertResistanceKOhms < 15) {
      return {
        label: 'CRITICAL PIPE BURST DETECTED',
        type: 'CRITICAL',
        color: 'text-rose-400 bg-rose-950/80 border-rose-500',
        detail: 'High volume fluid rupture. Automated isolation valve shutoff recommended.',
        isAlert: true
      };
    }
    if (invertResistanceKOhms < 60 && crownResistanceKOhms > 350) {
      return {
        label: 'CONFIRMED INTERNAL SEEPAGE',
        type: 'LEAK',
        color: 'text-rose-400 bg-rose-950/80 border-rose-500',
        detail: 'Bottom invert saturated while crown strip remains dry. Fluid originated inside pipeline.',
        isAlert: true
      };
    }
    if (crownResistanceKOhms < 120 && invertResistanceKOhms < 120) {
      return {
        label: 'EXTERNAL RAIN / WEATHER DETECTED (SUPPRESSED)',
        type: 'RAIN',
        color: 'text-amber-400 bg-amber-950/80 border-amber-500',
        detail: 'Both crown and invert wet simultaneously from above. Classifier suppresses false alarm.',
        isAlert: false
      };
    }
    if (crownResistanceKOhms < 150 && invertResistanceKOhms > 300) {
      return {
        label: 'SURFACE RAIN / CONDENSATION ONLY',
        type: 'RAIN',
        color: 'text-amber-400 bg-amber-950/80 border-amber-500',
        detail: 'Moisture isolated to upper exterior crown. Internal pipeline core intact.',
        isAlert: false
      };
    }
    return {
      label: 'NOMINAL · PIPELINE INTACT',
      type: 'NOMINAL',
      color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500',
      detail: 'High electrical impedance maintained (>450 kΩ). Zero moisture contact.',
      isAlert: false
    };
  }, [invertResistanceKOhms, crownResistanceKOhms, crackSize]);

  // Trigger hardware audio beep if leak alert is active and sound enabled
  useEffect(() => {
    if (classification.isAlert) {
      playBuzzerBeep(classification.type === 'CRITICAL' ? 2800 : 2200, 0.09);
    }
  }, [classification, tick, playBuzzerBeep]);

  // Demo auto-advance timer
  useEffect(() => {
    if (!isDemoPlaying || demoStage === null) return;

    const timer = setInterval(() => {
      setDemoTimerSeconds((prev) => {
        if (prev <= 1) {
          // Advance to next stage
          setDemoStage((curr) => {
            const next = ((curr || 1) % 4 + 1) as DemoStage;
            applyDemoStage(next);
            return next;
          });
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isDemoPlaying, demoStage]);

  // Apply Demo Stage Parameters
  const applyDemoStage = (stage: DemoStage) => {
    if (!stage) return;
    const info = DEMO_STAGES.find((s) => s.stage === stage);
    if (!info) return;
    setCrackSize(info.params.crackSize);
    setPressure(info.params.pressure);
    setFlowRate(info.params.flowRate);
    setExternalRain(info.params.externalRain);
    setPipeMaterial(info.params.material);
    setDemoTimerSeconds(15);
  };

  const startJudgeDemo = () => {
    setDemoStage(1);
    setIsDemoPlaying(true);
    applyDemoStage(1);
  };

  const exitJudgeDemo = () => {
    setDemoStage(null);
    setIsDemoPlaying(false);
  };

  // Quick Preset Handlers
  const applyPreset = (presetName: 'NORMAL' | 'PINHOLE' | 'RAIN' | 'BURST') => {
    exitJudgeDemo();
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

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-8 sm:py-12 space-y-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* 1. Header Bar & Judge Demonstration Banner */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                  <Beaker className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SEEPORA Virtual Lab Digital Twin</span>
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-amber-400">Primary Competition Attraction</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mt-1">
                Interactive Test Bench & Digital Twin
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Simulate internal hydrostatic pressures, micro-fissure apertures, environmental rainfall stress, and live electrical impedance response in real time.
              </p>
            </div>

            {/* Quick Actions & Sound Toggle */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  soundEnabled
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title="Toggle simulated hardware buzzer audio"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                <span>{soundEnabled ? 'Buzzer Active' : 'Buzzer Muted'}</span>
              </button>

              {/* Start Judge Demo Button */}
              {demoStage === null ? (
                <button
                  onClick={startJudgeDemo}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all cursor-pointer active:scale-95 animate-pulse"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Start Judge Guided Demonstration</span>
                </button>
              ) : (
                <button
                  onClick={exitJudgeDemo}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Exit Guided Demo</span>
                </button>
              )}
            </div>
          </div>

          {/* Judge Guided Demonstration Overlay (When Active) */}
          {demoStage !== null && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-amber-500/60 shadow-xl space-y-3 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold font-mono">
                    0{demoStage}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-semibold">
                      Judge Guided Showcase · Stage {demoStage} of 4
                    </span>
                    <h3 className="text-base font-bold text-white">
                      {DEMO_STAGES[demoStage - 1].title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsDemoPlaying(!isDemoPlaying)}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                  >
                    {isDemoPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                    <span>{isDemoPlaying ? `Auto-Advancing (${demoTimerSeconds}s)` : 'Paused'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setDemoStage(s as DemoStage);
                          applyDemoStage(s as DemoStage);
                        }}
                        className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          demoStage === s
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                <div className="md:col-span-8 space-y-1">
                  <p className="text-slate-300 leading-relaxed">
                    {DEMO_STAGES[demoStage - 1].description}
                  </p>
                </div>
                <div className="md:col-span-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 space-y-1">
                  <strong className="text-amber-400 uppercase font-mono text-[10px] block">
                    Judge Evaluation Takeaway:
                  </strong>
                  <p className="text-[11px] leading-relaxed">
                    {DEMO_STAGES[demoStage - 1].judgeTakeaway}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Scenario Preset Pills (When Demo is Inactive) */}
          {demoStage === null && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 font-semibold px-1">
                  Scenario Presets:
                </span>
                <button
                  onClick={() => applyPreset('NORMAL')}
                  className="px-3 py-1 text-xs font-mono font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                >
                  Intact Pipe (0 µm)
                </button>
                <button
                  onClick={() => applyPreset('PINHOLE')}
                  className="px-3 py-1 text-xs font-mono font-semibold rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-colors cursor-pointer"
                >
                  Pinhole Leak (140 µm)
                </button>
                <button
                  onClick={() => applyPreset('RAIN')}
                  className="px-3 py-1 text-xs font-mono font-semibold rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 transition-colors cursor-pointer"
                >
                  Rainstorm Wetting (85%)
                </button>
                <button
                  onClick={() => applyPreset('BURST')}
                  className="px-3 py-1 text-xs font-mono font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
                >
                  Joint Burst (420 µm)
                </button>
              </div>

              {/* Rig Perspective Switcher */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                <span className="text-slate-500 px-2 text-[11px]">View:</span>
                <button
                  onClick={() => setPerspective('LONGITUDINAL')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    perspective === 'LONGITUDINAL'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Front Longitudinal
                </button>
                <button
                  onClick={() => setPerspective('CROSS_SECTION')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    perspective === 'CROSS_SECTION'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Radial Cross-Section
                </button>
              </div>
            </div>
          )}

          {/* Classifier Decision Banner */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${classification.color}`}>
            <div className="flex items-center gap-3">
              {classification.type === 'NOMINAL' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              ) : classification.type === 'RAIN' ? (
                <CloudRain className="w-5 h-5 shrink-0 text-amber-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 animate-bounce" />
              )}
              <div>
                <div className="text-xs font-mono font-bold tracking-wider">
                  CLASSIFIER DIAGNOSTIC: {classification.label}
                </div>
                <div className="text-xs mt-0.5 opacity-90">
                  {classification.detail}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="opacity-75">ADC Threshold: 2.00 V</span>
              <span className="px-2 py-0.5 rounded bg-black/40 font-bold">
                Sense: {invertVoltage} V ({invertResistanceKOhms} kΩ)
              </span>
            </div>
          </div>
        </div>

        {/* 2. Main Lab Grid: Left Controls, Center Apparatus, Right Real-time Scope */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column (4 cols): Physical Controls */}
          <div className="lg:col-span-4 bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Physical Test Inputs</span>
              </h3>
              <button
                onClick={() => applyPreset('NORMAL')}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Pipe Material Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300 font-mono">Pipe Conduit Material:</span>
                <span className="text-cyan-400 font-mono font-bold">{pipeMaterial}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
                {(['PVC', 'HDPE', 'COPPER', 'IRON'] as PipeMaterial[]).map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setPipeMaterial(mat)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      pipeMaterial === mat
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {pipeMaterial === 'PVC' || pipeMaterial === 'HDPE'
                  ? '⚠️ Plastic conduit dampens acoustic vibrations by 47×. Acoustic loggers fail; SEEPORA works 100%.'
                  : 'Metallic conduit transmits sound well, but SEEPORA detects at 98% lower cost.'}
              </p>
            </div>

            {/* Control 1: Crack Aperture */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="crack-slider" className="font-semibold text-slate-300 font-mono">
                  Micro-Fissure Aperture
                </label>
                <span className="font-mono font-bold text-cyan-300 tabular-nums">
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
                onChange={(e) => {
                  exitJudgeDemo();
                  setCrackSize(Number(e.target.value));
                }}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 µm (Intact)</span>
                <span>250 µm</span>
                <span>500 µm (Burst)</span>
              </div>
            </div>

            {/* Control 2: Internal Pressure */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="pressure-slider" className="font-semibold text-slate-300 font-mono">
                  Internal Hydrostatic Pressure
                </label>
                <span className="font-mono font-bold text-cyan-300 tabular-nums">
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
                onChange={(e) => {
                  exitJudgeDemo();
                  setPressure(Number(e.target.value));
                }}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.5 bar</span>
                <span>3.5 bar (School Riser)</span>
                <span>8.0 bar</span>
              </div>
            </div>

            {/* Control 3: Flow Velocity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="flow-slider" className="font-semibold text-slate-300 font-mono">
                  Pump Circulation Flow Rate
                </label>
                <span className="font-mono font-bold text-cyan-300 tabular-nums">
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
                onChange={(e) => {
                  exitJudgeDemo();
                  setFlowRate(Number(e.target.value));
                }}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Control 4: External Rain & Moisture */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="rain-slider" className="font-semibold text-slate-300 font-mono flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                  <span>Ambient Rainfall Wetting</span>
                </label>
                <span className="font-mono font-bold text-cyan-300 tabular-nums">
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
                onChange={(e) => {
                  exitJudgeDemo();
                  setExternalRain(Number(e.target.value));
                }}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0% (Dry Indoor)</span>
                <span>50%</span>
                <span>100% (Downpour)</span>
              </div>
            </div>

            {/* Dual Strip Differential Toggle */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white font-mono">
                  Dual-Strip Differential Logic
                </div>
                <div className="text-[10px] text-slate-400">
                  Crown strip (top) + Invert strip (bottom)
                </div>
              </div>
              <input
                type="checkbox"
                checked={dualStripMode}
                onChange={(e) => setDualStripMode(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Live Serial UART Packet Display */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Live ESP8266 UART Serial String:
              </span>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10px] text-emerald-400 break-all select-all">
                $SEEPORA,NODE_01,Z_INV={invertResistanceKOhms}k,Z_CRN={crownResistanceKOhms}k,V={invertVoltage}V,STAT={classification.type}*4A
              </div>
            </div>
          </div>

          {/* Center & Right Column (8 cols): Apparatus Canvas & Scope */}
          <div className="lg:col-span-8 space-y-6">

            {/* Virtual Apparatus Canvas */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                <span className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Activity className="w-4 h-4" />
                  <span>
                    RIG PERSPECTIVE: {perspective === 'LONGITUDINAL' ? 'LONGITUDINAL PROFILE (FRONT)' : 'RADIAL CROSS-SECTION (END-ON)'}
                  </span>
                </span>
                <span className="text-[11px] text-slate-500">
                  PIPE: 50mm {pipeMaterial} · CLOCK: {tick}
                </span>
              </div>

              {/* VIEW 1: Longitudinal Acrylic Rig View */}
              {perspective === 'LONGITUDINAL' ? (
                <div className="relative w-full h-[320px] sm:h-[350px] flex items-center justify-center">
                  <svg viewBox="0 0 700 350" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
                    {/* External Rain Streaks */}
                    {externalRain > 0 && (
                      <g opacity={externalRain / 100}>
                        {[...Array(18)].map((_, i) => {
                          const x = 40 + i * 36;
                          const yOffset = (tick * 10 + i * 28) % 350;
                          return (
                            <line
                              key={i}
                              x1={x}
                              y1={yOffset}
                              x2={x - 4}
                              y2={yOffset + 14}
                              stroke="#38bdf8"
                              strokeWidth="1.5"
                              opacity="0.65"
                            />
                          );
                        })}
                      </g>
                    )}

                    {/* Pressure Gauge Dial (Top Right) */}
                    <g transform="translate(560, 30)">
                      <circle cx="40" cy="40" r="32" fill="#020617" stroke="#334155" strokeWidth="3" />
                      <circle cx="40" cy="40" r="28" fill="#0f172a" />
                      <line x1="20" y1="40" x2="26" y2="40" stroke="#94a3b8" strokeWidth="1.5" />
                      <line x1="40" y1="20" x2="40" y2="26" stroke="#94a3b8" strokeWidth="1.5" />
                      <line x1="60" y1="40" x2="54" y2="40" stroke="#94a3b8" strokeWidth="1.5" />
                      {(() => {
                        const angle = -120 + (pressure / 8.0) * 240;
                        const rad = (angle * Math.PI) / 180;
                        const nx = 40 + Math.sin(rad) * 22;
                        const ny = 40 - Math.cos(rad) * 22;
                        return (
                          <line x1="40" y1="40" x2={nx} y2={ny} stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                        );
                      })()}
                      <circle cx="40" cy="40" r="3" fill="#f43f5e" />
                      <text x="40" y="62" fill="#ffffff" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">
                        {pressure.toFixed(1)} BAR
                      </text>
                    </g>

                    {/* Upper Crown Strip (If Dual Mode Active) */}
                    {dualStripMode && (
                      <g>
                        <rect
                          x="90"
                          y="105"
                          width="420"
                          height="7"
                          rx="2"
                          fill={crownWettingPercent > 10 ? '#38bdf8' : '#eab308'}
                          stroke="#ca8a04"
                          strokeWidth="1"
                        />
                        <text x="100" y="98" fill="#fbbf24" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                          ▲ TOP CROWN STRIP (WEATHER SENSE: {crownResistanceKOhms} kΩ)
                        </text>
                      </g>
                    )}

                    {/* Pipe Wall Upper */}
                    <rect
                      x="70"
                      y="114"
                      width="460"
                      height="16"
                      fill={pipeMaterial === 'PVC' ? '#475569' : pipeMaterial === 'HDPE' ? '#1e293b' : '#78350f'}
                      stroke="#64748b"
                      strokeWidth="1"
                    />

                    {/* Pressurized Fluid Core */}
                    <rect x="70" y="130" width="460" height="90" fill="#0284c7" fillOpacity="0.4" />

                    {/* Fluid Laminar Streamlines & Bubbles */}
                    {flowRate > 0 && (
                      <g>
                        {[...Array(14)].map((_, i) => {
                          const speed = flowRate / 10;
                          const cx = 70 + ((tick * speed + i * 36) % 450);
                          const cy = 142 + (i * 6) % 65;
                          return (
                            <circle key={i} cx={cx} cy={cy} r={2 + (i % 3)} fill="#bae6fd" opacity="0.8" />
                          );
                        })}
                      </g>
                    )}

                    {/* Pipe Wall Lower with Fissure */}
                    <rect
                      x="70"
                      y="220"
                      width="180"
                      height="16"
                      fill={pipeMaterial === 'PVC' ? '#475569' : pipeMaterial === 'HDPE' ? '#1e293b' : '#78350f'}
                      stroke="#64748b"
                      strokeWidth="1"
                    />
                    <rect
                      x="270"
                      y="220"
                      width="260"
                      height="16"
                      fill={pipeMaterial === 'PVC' ? '#475569' : pipeMaterial === 'HDPE' ? '#1e293b' : '#78350f'}
                      stroke="#64748b"
                      strokeWidth="1"
                    />

                    {/* Fissure Gap */}
                    <rect
                      x="250"
                      y="220"
                      width={Math.max(4, Math.min(20, crackSize / 20))}
                      height="16"
                      fill="#020617"
                      stroke={crackSize > 0 ? '#f43f5e' : '#475569'}
                      strokeWidth="1.5"
                    />

                    {/* ESCAPING LEAKAGE DROPLETS FALLING BY GRAVITY */}
                    {crackSize > 0 && (
                      <g>
                        {[...Array(6)].map((_, i) => {
                          const dropY = 236 + ((tick * 5 + i * 14) % 22);
                          return (
                            <circle
                              key={i}
                              cx={255 + (i % 3) * 2}
                              cy={dropY}
                              r={3 + (crackSize / 180)}
                              fill="#38bdf8"
                              opacity="0.9"
                            />
                          );
                        })}

                        {/* Liquid puddle on lower sensor strip */}
                        <ellipse
                          cx="260"
                          cy="248"
                          rx={Math.min(55, 14 + crackSize / 8)}
                          ry="4"
                          fill="#38bdf8"
                          opacity="0.85"
                        />
                        {/* Electrical Bridge Spark Glow */}
                        <circle cx="260" cy="248" r="12" fill="#38bdf8" fillOpacity="0.25" />
                        <line x1="248" y1="246" x2="272" y2="250" stroke="#ffffff" strokeWidth="1.5" />
                      </g>
                    )}

                    {/* LOWER INVERT SENSOR STRIP (PRIMARY SEEPORA DETECTOR) */}
                    <rect
                      x="90"
                      y="240"
                      width="420"
                      height="9"
                      rx="2"
                      fill={invertWettingPercent > 10 ? '#38bdf8' : '#f59e0b'}
                      stroke="#b45309"
                      strokeWidth="1"
                    />

                    {/* Interdigitated Grid Lines */}
                    <g stroke="#78350f" strokeWidth="1">
                      {[...Array(21)].map((_, i) => (
                        <line key={i} x1={100 + i * 20} y1="242" x2={100 + i * 20} y2="247" />
                      ))}
                    </g>

                    <text x="100" y="266" fill="#fbbf24" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                      ▼ PRIMARY INVERT STRIP (IMPEDANCE: {invertResistanceKOhms} kΩ · ADC: {invertVoltage}V)
                    </text>

                    {/* Flow text inside pipe */}
                    <text x="210" y="180" fill="#ffffff" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">
                      {flowRate > 0 ? `FLOW: ${flowRate} L/min (${pipeMaterial})` : 'STAGNANT HYDRAULIC CORE'}
                    </text>
                  </svg>
                </div>
              ) : (
                /* VIEW 2: Radial Cross-Section View (End-on Circle) */
                <div className="relative w-full h-[320px] sm:h-[350px] flex items-center justify-center">
                  <svg viewBox="0 0 500 350" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(250, 160)">
                      {/* Outer Pipe Circumference */}
                      <circle cx="0" cy="0" r="100" fill="#1e293b" stroke="#64748b" strokeWidth="4" />
                      {/* Inner Fluid Core */}
                      <circle cx="0" cy="0" r="86" fill="#0284c7" fillOpacity="0.45" stroke="#38bdf8" strokeWidth="1" />

                      {/* Top Crown Strip */}
                      {dualStripMode && (
                        <rect x="-35" y="-108" width="70" height="7" rx="2" fill={crownWettingPercent > 10 ? '#38bdf8' : '#eab308'} stroke="#ca8a04" />
                      )}

                      {/* Bottom Invert Strip at 6 o'clock */}
                      <rect x="-40" y="101" width="80" height="9" rx="2" fill={invertWettingPercent > 10 ? '#38bdf8' : '#f59e0b'} stroke="#b45309" />

                      {/* Movable Crack Point on Pipe Circumference */}
                      {(() => {
                        const rad = ((crackSize > 0 ? 140 : 180) * Math.PI) / 180;
                        const cx = Math.sin(rad) * 94;
                        const cy = -Math.cos(rad) * 94;
                        return (
                          <g>
                            <circle cx={cx} cy={cy} r={crackSize > 0 ? 6 : 3} fill={crackSize > 0 ? '#f43f5e' : '#64748b'} />
                            {crackSize > 0 && (
                              <g>
                                {/* Gravity arc path from crack down to 6 o'clock invert */}
                                <path
                                  d={`M ${cx} ${cy} A 104 104 0 0 1 0 104`}
                                  fill="none"
                                  stroke="#38bdf8"
                                  strokeWidth="2.5"
                                  strokeDasharray="4 3"
                                />
                                <text x="10" y="130" fill="#38bdf8" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                                  Gravity Path → Invert Accumulation
                                </text>
                              </g>
                            )}
                          </g>
                        );
                      })()}

                      <text x="0" y="5" fill="#ffffff" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">
                        50 mm DIA
                      </text>
                      <text x="0" y="20" fill="#93c5fd" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
                        {pipeMaterial} PIPE
                      </text>
                    </g>
                  </svg>
                </div>
              )}
            </div>

            {/* Real-Time Quantitative Diagnostic Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                  Volumetric Water Loss
                </div>
                <div className="text-2xl font-mono font-bold text-white tabular-nums">
                  {leakRateLPerHour} <span className="text-xs font-normal text-slate-400">L/hour</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Annual Impact: {annualLossM3} m³ wasted
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[11px] font-mono font-semibold text-cyan-400 uppercase tracking-wider">
                  Lower Invert Impedance (Z)
                </div>
                <div className="text-2xl font-mono font-bold text-cyan-300 tabular-nums">
                  {invertResistanceKOhms} <span className="text-xs font-normal text-slate-400">kΩ</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  ADC Pin: {invertVoltage} V / 3.30 V
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[11px] font-mono font-semibold text-amber-400 uppercase tracking-wider">
                  Upper Crown Impedance
                </div>
                <div className="text-2xl font-mono font-bold text-amber-300 tabular-nums">
                  {crownResistanceKOhms} <span className="text-xs font-normal text-slate-400">kΩ</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Rain Wetting: {crownWettingPercent}%
                </div>
              </div>
            </div>

            {/* Oscilloscope Rolling Chart (Visual Signal Trace) */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ADC Sense Voltage vs. Time (Rolling Trace)</span>
                </span>
                <span className="text-rose-400 text-[11px]">Threshold = 2.00 V</span>
              </div>
              <div className="h-20 w-full bg-slate-950 rounded-lg p-2 border border-slate-800 flex items-end gap-1 relative overflow-hidden">
                {/* Horizontal threshold reference line */}
                <div className="absolute top-[39%] left-0 right-0 border-b border-rose-500/50 border-dashed z-0" />
                {chartHistory.map((pt, i) => {
                  const heightPercent = Math.max(5, Math.min(100, (pt.v / 3.3) * 100));
                  const isAlarm = pt.v < 2.0;
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col justify-end items-center relative z-10"
                      style={{ height: '100%' }}
                    >
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${
                          isAlarm ? 'bg-rose-500' : 'bg-cyan-400'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>-20 sec</span>
                <span>Current Reading: {invertVoltage} V ({classification.isAlert ? 'ALARM ON' : 'SAFE'})</span>
                <span>Now</span>
              </div>
            </div>

            {/* Judge Evaluation Panel: Why SEEPORA is Superior */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-blue-900/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Judge Scoring Rubric Highlights</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-white block">1. Overcomes Acoustic Physics Limit</strong>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Municipal acoustic listeners rely on sound vibration, which drops by 47× in PVC/HDPE. SEEPORA measures direct electrolytic conductance, achieving 100% detection regardless of pipe material.
                  </p>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-white block">2. Frugal Cost Viability (₹600 Node)</strong>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Commercial municipal correlators cost ₹3,00,000+. SEEPORA uses off-the-shelf ESP8266 + FC-37 strips procurable in local Indian markets for ₹600, making building-wide safety affordable for schools.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
