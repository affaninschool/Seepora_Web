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

  // Simulation time loop & playback controls
  const [tick, setTick] = useState<number>(0);
  const [isSimPlaying, setIsSimPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1.0); // 0.25x to 3.0x

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

  // Main animation tick loop scaled by simulation playback & speed
  useEffect(() => {
    if (!isSimPlaying) return;
    const intervalMs = Math.max(16, Math.round(50 / simSpeed));
    const timer = setInterval(() => {
      setTick((t) => (t + 1) % 1000);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isSimPlaying, simSpeed]);

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

  // Update chart history based on simulation playback & speed
  useEffect(() => {
    if (!isSimPlaying) return;
    const sampleIntervalMs = Math.max(150, Math.round(800 / simSpeed));
    const interval = setInterval(() => {
      setChartHistory((prev) => {
        const next = [...prev, { t: Date.now(), r: invertResistanceKOhms, v: invertVoltage }];
        return next.slice(-20); // Keep last 20 ticks
      });
    }, sampleIntervalMs);
    return () => clearInterval(interval);
  }, [isSimPlaying, simSpeed, invertResistanceKOhms, invertVoltage]);

  // Intelligent Classification
  const classification = useMemo(() => {
    if (crackSize > 300 && invertResistanceKOhms < 15) {
      return {
        label: 'CRITICAL PIPE BURST DETECTED',
        type: 'CRITICAL',
        color: 'text-rose-900 bg-rose-50 border-rose-300',
        detail: 'High volume fluid rupture. Automated isolation valve shutoff recommended.',
        isAlert: true
      };
    }
    if (invertResistanceKOhms < 60 && crownResistanceKOhms > 350) {
      return {
        label: 'CONFIRMED INTERNAL SEEPAGE',
        type: 'LEAK',
        color: 'text-rose-900 bg-rose-50 border-rose-300',
        detail: 'Bottom invert saturated while crown strip remains dry. Fluid originated inside pipeline.',
        isAlert: true
      };
    }
    if (crownResistanceKOhms < 120 && invertResistanceKOhms < 120) {
      return {
        label: 'EXTERNAL RAIN / WEATHER DETECTED (SUPPRESSED)',
        type: 'RAIN',
        color: 'text-amber-900 bg-amber-50 border-amber-300',
        detail: 'Both crown and invert wet simultaneously from above. Classifier suppresses false alarm.',
        isAlert: false
      };
    }
    if (crownResistanceKOhms < 150 && invertResistanceKOhms > 300) {
      return {
        label: 'SURFACE RAIN / CONDENSATION ONLY',
        type: 'RAIN',
        color: 'text-amber-900 bg-amber-50 border-amber-300',
        detail: 'Moisture isolated to upper exterior crown. Internal pipeline core intact.',
        isAlert: false
      };
    }
    return {
      label: 'NOMINAL · PIPELINE INTACT',
      type: 'NOMINAL',
      color: 'text-emerald-900 bg-emerald-50 border-emerald-300',
      detail: 'High electrical impedance maintained (>450 kΩ). Zero moisture contact.',
      isAlert: false
    };
  }, [invertResistanceKOhms, crownResistanceKOhms, crackSize]);

  // Dynamic pulse & RGB color-shift values for leak detection visualization (high-contrast on white bench)
  const isCriticalLeak = classification.type === 'CRITICAL';
  const pulseCycle = isCriticalLeak ? 14 : 24;
  const pulsePhaseA = (tick % pulseCycle) / pulseCycle;
  const pulsePhaseB = ((tick + Math.floor(pulseCycle / 2)) % pulseCycle) / pulseCycle;
  const colorOsc = 0.5 + 0.5 * Math.sin((tick * Math.PI) / (isCriticalLeak ? 5 : 8));
  const leakColorShift = `rgb(${Math.round(2 + (225 - 2) * colorOsc)}, ${Math.round(132 + (29 - 132) * colorOsc)}, ${Math.round(199 + (72 - 199) * colorOsc)})`;

  // Trigger hardware audio beep if leak alert is active, simulation is running, and sound enabled
  useEffect(() => {
    if (isSimPlaying && classification.isAlert) {
      playBuzzerBeep(classification.type === 'CRITICAL' ? 2800 : 2200, 0.09);
    }
  }, [isSimPlaying, classification, tick, playBuzzerBeep]);

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

  // Full Simulation Reset Handler
  const handleResetSimulation = () => {
    exitJudgeDemo();
    setFlowRate(45);
    setPressure(3.5);
    setCrackSize(0);
    setExternalRain(0);
    setStripGain(1.0);
    setPipeMaterial('PVC');
    setDualStripMode(true);
    setTick(0);
    setChartHistory([{ t: Date.now(), r: 492.0, v: 2.74 }]);
    setSimSpeed(1.0);
    setIsSimPlaying(true);
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen py-8 sm:py-12 space-y-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* 1. Header Bar & Judge Demonstration Banner */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-blue-700 uppercase tracking-wider">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
                  <Beaker className="w-3.5 h-3.5 text-blue-600" />
                  <span>SEEPORA Virtual Lab Digital Twin</span>
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-amber-600">Primary Competition Attraction</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mt-1">
                Interactive Test Bench & Digital Twin
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Simulate internal hydrostatic pressures, micro-fissure apertures, environmental rainfall stress, and live electrical impedance response in real time.
              </p>
            </div>

            {/* Quick Actions & Sound Toggle */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  soundEnabled
                    ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-sm'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
                title="Toggle simulated hardware buzzer audio"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                <span>{soundEnabled ? 'Buzzer Active' : 'Buzzer Muted'}</span>
              </button>

              {/* Start Judge Demo Button */}
              {demoStage === null ? (
                <button
                  onClick={startJudgeDemo}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all cursor-pointer active:scale-95 animate-pulse"
                >
                  <Sparkles className="w-4 h-4 text-amber-100" />
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
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-blue-50 border-2 border-amber-400 shadow-md space-y-3 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-bold font-mono">
                    0{demoStage}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-semibold">
                      Judge Guided Showcase · Stage {demoStage} of 4
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {DEMO_STAGES[demoStage - 1].title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsDemoPlaying(!isDemoPlaying)}
                    className="px-3 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {isDemoPlaying ? <Pause className="w-3 h-3 text-amber-600" /> : <Play className="w-3 h-3 text-emerald-600" />}
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
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
                  <p className="text-slate-700 leading-relaxed">
                    {DEMO_STAGES[demoStage - 1].description}
                  </p>
                </div>
                <div className="md:col-span-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                  <strong className="text-amber-700 uppercase font-mono text-[10px] block">
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
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-slate-600 font-semibold px-1">
                  Scenario Presets:
                </span>
                <button
                  onClick={() => applyPreset('NORMAL')}
                  className="px-3 py-1 text-xs font-mono font-semibold rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                >
                  Intact Pipe (0 µm)
                </button>
                <button
                  onClick={() => applyPreset('PINHOLE')}
                  className="px-3 py-1 text-xs font-mono font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                >
                  Pinhole Leak (140 µm)
                </button>
                <button
                  onClick={() => applyPreset('RAIN')}
                  className="px-3 py-1 text-xs font-mono font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer"
                >
                  Rainstorm Wetting (85%)
                </button>
                <button
                  onClick={() => applyPreset('BURST')}
                  className="px-3 py-1 text-xs font-mono font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-xs"
                >
                  Joint Burst (420 µm)
                </button>
              </div>

              {/* Rig Perspective Switcher */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs font-mono">
                <span className="text-slate-500 px-2 text-[11px]">View:</span>
                <button
                  onClick={() => setPerspective('LONGITUDINAL')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    perspective === 'LONGITUDINAL'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Front Longitudinal
                </button>
                <button
                  onClick={() => setPerspective('CROSS_SECTION')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    perspective === 'CROSS_SECTION'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900'
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
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              ) : classification.type === 'RAIN' ? (
                <CloudRain className="w-5 h-5 shrink-0 text-amber-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 animate-bounce" />
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
              <span className="opacity-80">ADC Threshold: 2.00 V</span>
              <span className="px-2.5 py-0.5 rounded bg-white/90 border border-slate-200 text-slate-900 font-bold shadow-xs">
                Sense: {invertVoltage} V ({invertResistanceKOhms} kΩ)
              </span>
            </div>
          </div>
        </div>

        {/* 2. Main Lab Grid: Left Controls, Center Apparatus, Right Real-time Scope */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column (4 cols): Physical Controls */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-xs font-bold font-mono text-blue-700 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>Physical Test Inputs</span>
              </h3>
              <button
                onClick={() => applyPreset('NORMAL')}
                className="text-xs font-mono text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Pipe Material Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 font-mono">Pipe Conduit Material:</span>
                <span className="text-blue-700 font-mono font-bold">{pipeMaterial}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
                {(['PVC', 'HDPE', 'COPPER', 'IRON'] as PipeMaterial[]).map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setPipeMaterial(mat)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      pipeMaterial === mat
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                {pipeMaterial === 'PVC' || pipeMaterial === 'HDPE'
                  ? '⚠️ Plastic conduit dampens acoustic vibrations by 47×. Acoustic loggers fail; SEEPORA works 100%.'
                  : 'Metallic conduit transmits sound well, but SEEPORA detects at 98% lower cost.'}
              </p>
            </div>

            {/* Control 1: Crack Aperture */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="crack-slider" className="font-semibold text-slate-700 font-mono">
                  Micro-Fissure Aperture
                </label>
                <span className="font-mono font-bold text-blue-700 tabular-nums">
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
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
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
                <label htmlFor="pressure-slider" className="font-semibold text-slate-700 font-mono">
                  Internal Hydrostatic Pressure
                </label>
                <span className="font-mono font-bold text-blue-700 tabular-nums">
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
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
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
                <label htmlFor="flow-slider" className="font-semibold text-slate-700 font-mono">
                  Pump Circulation Flow Rate
                </label>
                <span className="font-mono font-bold text-blue-700 tabular-nums">
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
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Control 4: External Rain & Moisture */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="rain-slider" className="font-semibold text-slate-700 font-mono flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-blue-600" />
                  <span>Ambient Rainfall Wetting</span>
                </label>
                <span className="font-mono font-bold text-blue-700 tabular-nums">
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
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0% (Dry Indoor)</span>
                <span>50%</span>
                <span>100% (Downpour)</span>
              </div>
            </div>

            {/* Dual Strip Differential Toggle */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-900 font-mono">
                  Dual-Strip Differential Logic
                </div>
                <div className="text-[10px] text-slate-500">
                  Crown strip (top) + Invert strip (bottom)
                </div>
              </div>
              <input
                type="checkbox"
                checked={dualStripMode}
                onChange={(e) => setDualStripMode(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
              />
            </div>

            {/* Live Serial UART Packet Display */}
            <div className="pt-2 border-t border-slate-200 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                Live ESP8266 UART Serial String:
              </span>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[10px] text-emerald-700 font-semibold break-all select-all">
                $SEEPORA,NODE_01,Z_INV={invertResistanceKOhms}k,Z_CRN={crownResistanceKOhms}k,V={invertVoltage}V,STAT={classification.type}*4A
              </div>
            </div>
          </div>

          {/* Center & Right Column (8 cols): Simulation Controls, Apparatus Canvas & Scope */}
          <div className="lg:col-span-8 space-y-6">

            {/* Simulation Control Panel */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-2 pr-2 border-r border-slate-200">
                  <span className={`w-2 h-2 rounded-full ${isSimPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  <span className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                    Sim Controls
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSimPlaying(true)}
                  aria-pressed={isSimPlaying}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                    isSimPlaying
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-400 shadow-xs'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSimPlaying(false)}
                  aria-pressed={!isSimPlaying}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                    !isSimPlaying
                      ? 'bg-amber-50 text-amber-800 border-amber-400 shadow-xs'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetSimulation}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer active:scale-95"
                  title="Reset simulation clock, waveform data, speed, and default parameters"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Visualization Flow Speed Slider */}
              <div className="flex-1 md:max-w-xs space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <label htmlFor="sim-speed-slider" className="text-slate-600 font-semibold flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-blue-600" />
                    <span>Visualization Speed</span>
                  </label>
                  <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-bold tabular-nums">
                    {simSpeed.toFixed(2)}x
                  </span>
                </div>
                <input
                  id="sim-speed-slider"
                  type="range"
                  min="0.25"
                  max="3.0"
                  step="0.25"
                  value={simSpeed}
                  onChange={(e) => setSimSpeed(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>0.25x Slow</span>
                  <span>1.0x Normal</span>
                  <span>3.0x Fast</span>
                </div>
              </div>
            </div>

            {/* Virtual Apparatus Canvas */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-600 border-b border-slate-200 pb-2">
                <span className="flex items-center gap-2 text-blue-700 font-bold">
                  <Activity className="w-4 h-4" />
                  <span>
                    RIG PERSPECTIVE: {perspective === 'LONGITUDINAL' ? 'LONGITUDINAL PROFILE (FRONT)' : 'RADIAL CROSS-SECTION (END-ON)'}
                  </span>
                </span>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    isSimPlaying
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {isSimPlaying ? `FLOW ${simSpeed.toFixed(2)}x` : 'PAUSED'}
                  </span>
                  <span className="text-slate-500">
                    PIPE: 50mm {pipeMaterial} · CLOCK: {tick}
                  </span>
                </div>
              </div>

              {/* VIEW 1: Longitudinal Acrylic Rig View */}
              {perspective === 'LONGITUDINAL' ? (
                <div className="relative w-full h-[320px] sm:h-[350px] flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200">
                  <svg viewBox="0 0 700 350" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <radialGradient id="leakDetectionGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={leakColorShift} stopOpacity="0.75" />
                        <stop offset="55%" stopColor="#e11d48" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#e11d48" stopOpacity="0" />
                      </radialGradient>
                      <linearGradient id="stripHotspotGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0284c7" stopOpacity="0" />
                        <stop offset="50%" stopColor={leakColorShift} stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                      </linearGradient>
                    </defs>

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
                              stroke="#0284c7"
                              strokeWidth="1.5"
                              opacity="0.65"
                            />
                          );
                        })}
                      </g>
                    )}

                    {/* Pressure Gauge Dial (Top Right) */}
                    <g transform="translate(560, 30)">
                      <circle cx="40" cy="40" r="32" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2.5" />
                      <circle cx="40" cy="40" r="28" fill="#ffffff" />
                      <line x1="20" y1="40" x2="26" y2="40" stroke="#64748b" strokeWidth="1.5" />
                      <line x1="40" y1="20" x2="40" y2="26" stroke="#64748b" strokeWidth="1.5" />
                      <line x1="60" y1="40" x2="54" y2="40" stroke="#64748b" strokeWidth="1.5" />
                      {(() => {
                        const angle = -120 + (pressure / 8.0) * 240;
                        const rad = (angle * Math.PI) / 180;
                        const nx = 40 + Math.sin(rad) * 22;
                        const ny = 40 - Math.cos(rad) * 22;
                        return (
                          <line x1="40" y1="40" x2={nx} y2={ny} stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" />
                        );
                      })()}
                      <circle cx="40" cy="40" r="3" fill="#e11d48" />
                      <text x="40" y="62" fill="#0f172a" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">
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
                          fill={crownWettingPercent > 10 ? '#0ea5e9' : '#eab308'}
                          stroke="#b45309"
                          strokeWidth="1"
                        />
                        <text x="100" y="98" fill="#b45309" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
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
                      fill={pipeMaterial === 'PVC' ? '#64748b' : pipeMaterial === 'HDPE' ? '#334155' : '#92400e'}
                      stroke="#475569"
                      strokeWidth="1"
                    />

                    {/* Pressurized Fluid Core */}
                    <rect x="70" y="130" width="460" height="90" fill="#0284c7" fillOpacity="0.82" />

                    {/* Fluid Laminar Streamlines & Bubbles */}
                    {flowRate > 0 && (
                      <g>
                        {[...Array(14)].map((_, i) => {
                          const speed = flowRate / 10;
                          const cx = 70 + ((tick * speed + i * 36) % 450);
                          const cy = 142 + (i * 6) % 65;
                          return (
                            <circle key={i} cx={cx} cy={cy} r={2 + (i % 3)} fill="#e0f2fe" opacity="0.85" />
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
                      fill={pipeMaterial === 'PVC' ? '#64748b' : pipeMaterial === 'HDPE' ? '#334155' : '#92400e'}
                      stroke="#475569"
                      strokeWidth="1"
                    />
                    <rect
                      x="270"
                      y="220"
                      width="260"
                      height="16"
                      fill={pipeMaterial === 'PVC' ? '#64748b' : pipeMaterial === 'HDPE' ? '#334155' : '#92400e'}
                      stroke="#475569"
                      strokeWidth="1"
                    />

                    {/* Fissure Gap with dynamic color-shift rim when leak detected */}
                    <rect
                      x="250"
                      y="220"
                      width={Math.max(4, Math.min(20, crackSize / 20))}
                      height="16"
                      fill="#ffffff"
                      stroke={classification.isAlert ? leakColorShift : crackSize > 0 ? '#e11d48' : '#475569'}
                      strokeWidth={classification.isAlert ? '2.5' : '1.5'}
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
                              fill={classification.isAlert ? leakColorShift : '#0284c7'}
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
                          fill={classification.isAlert ? leakColorShift : '#0284c7'}
                          opacity="0.85"
                        />
                        {/* Electrical Bridge Spark Glow */}
                        <circle
                          cx="260"
                          cy="248"
                          r={classification.isAlert ? 14 + colorOsc * 6 : 12}
                          fill={classification.isAlert ? leakColorShift : '#0284c7'}
                          fillOpacity={classification.isAlert ? 0.3 : 0.22}
                        />
                        <line x1="248" y1="246" x2="272" y2="250" stroke="#0f172a" strokeWidth="1.5" />
                      </g>
                    )}

                    {/* LOWER INVERT SENSOR STRIP (PRIMARY SEEPORA DETECTOR) */}
                    <rect
                      x="90"
                      y="240"
                      width="420"
                      height="9"
                      rx="2"
                      fill={invertWettingPercent > 10 ? '#0ea5e9' : '#f59e0b'}
                      stroke={classification.isAlert ? leakColorShift : '#b45309'}
                      strokeWidth={classification.isAlert ? '1.8' : '1'}
                    />

                    {/* Dynamic Color-Shift Hotspot Overlay on Sensor Strip at Leak Location */}
                    {classification.isAlert && (
                      <rect
                        x="185"
                        y="239"
                        width="150"
                        height="11"
                        rx="3"
                        fill="url(#stripHotspotGrad)"
                        opacity={0.65 + colorOsc * 0.35}
                      />
                    )}

                    {/* Interdigitated Grid Lines */}
                    <g stroke="#78350f" strokeWidth="1">
                      {[...Array(21)].map((_, i) => (
                        <line key={i} x1={100 + i * 20} y1="242" x2={100 + i * 20} y2="247" />
                      ))}
                    </g>

                    {/* DYNAMIC PULSE & COLOR-SHIFT BEACON AT DETECTED LEAK LOCATION */}
                    {classification.isAlert && (
                      <g>
                        {/* Ambient radial glow centered at leak detection contact */}
                        <circle
                          cx="260"
                          cy="244"
                          r={38 + colorOsc * 10}
                          fill="url(#leakDetectionGlow)"
                        />

                        {/* Expanding concentric radar pulse ring A */}
                        <circle
                          cx="260"
                          cy="244"
                          r={10 + pulsePhaseA * (isCriticalLeak ? 44 : 34)}
                          fill="none"
                          stroke={leakColorShift}
                          strokeWidth={2.5 * (1 - pulsePhaseA * 0.6)}
                          opacity={Math.max(0, 1 - pulsePhaseA)}
                        />

                        {/* Expanding concentric radar pulse ring B */}
                        <circle
                          cx="260"
                          cy="244"
                          r={10 + pulsePhaseB * (isCriticalLeak ? 44 : 34)}
                          fill="none"
                          stroke="#e11d48"
                          strokeWidth={2 * (1 - pulsePhaseB * 0.6)}
                          opacity={Math.max(0, 1 - pulsePhaseB)}
                        />

                        {/* Fissure origin pulse ring */}
                        <circle
                          cx="258"
                          cy="228"
                          r={8 + pulsePhaseA * 22}
                          fill="none"
                          stroke={leakColorShift}
                          strokeWidth="1.5"
                          opacity={Math.max(0, 0.9 - pulsePhaseA)}
                        />

                        {/* On-canvas callout badge pointing to leak location */}
                        <line x1="260" y1="252" x2="260" y2="278" stroke={leakColorShift} strokeWidth="1.5" strokeDasharray="3 2" />
                        <rect
                          x="165"
                          y="278"
                          width="190"
                          height="24"
                          rx="6"
                          fill="#ffffff"
                          stroke={leakColorShift}
                          strokeWidth="1.8"
                        />
                        <circle cx="179" cy="290" r="4" fill={leakColorShift} />
                        <text x="190" y="293.5" fill="#0f172a" fontSize="9.5" fontFamily="JetBrains Mono" fontWeight="bold">
                          {isCriticalLeak ? 'BURST DETECTED' : 'LEAK DETECTED'} · {invertResistanceKOhms}kΩ
                        </text>
                      </g>
                    )}

                    <text x="100" y="326" fill={classification.isAlert ? leakColorShift : '#b45309'} fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
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
                <div className="relative w-full h-[320px] sm:h-[350px] flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200">
                  <svg viewBox="0 0 500 350" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <radialGradient id="crossSectionLeakGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={leakColorShift} stopOpacity="0.75" />
                        <stop offset="100%" stopColor="#e11d48" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <g transform="translate(250, 160)">
                      {/* Outer Pipe Circumference */}
                      <circle cx="0" cy="0" r="100" fill="#475569" stroke="#334155" strokeWidth="4" />
                      {/* Inner Fluid Core */}
                      <circle cx="0" cy="0" r="86" fill="#0284c7" fillOpacity="0.85" stroke="#bae6fd" strokeWidth="1.5" />

                      {/* Top Crown Strip */}
                      {dualStripMode && (
                        <rect x="-35" y="-108" width="70" height="7" rx="2" fill={crownWettingPercent > 10 ? '#0ea5e9' : '#eab308'} stroke="#b45309" />
                      )}

                      {/* Bottom Invert Strip at 6 o'clock with dynamic color shift on leak detection */}
                      <rect
                        x="-40"
                        y="101"
                        width="80"
                        height="9"
                        rx="2"
                        fill={classification.isAlert ? leakColorShift : invertWettingPercent > 10 ? '#0ea5e9' : '#f59e0b'}
                        stroke={classification.isAlert ? '#0f172a' : '#b45309'}
                        strokeWidth={classification.isAlert ? '1.5' : '1'}
                      />

                      {/* Dynamic Pulse & Glow at Invert Detection Location (0, 105) */}
                      {classification.isAlert && (
                        <g>
                          <circle cx="0" cy="105" r={28 + colorOsc * 8} fill="url(#crossSectionLeakGlow)" />
                          <circle
                            cx="0"
                            cy="105"
                            r={10 + pulsePhaseA * (isCriticalLeak ? 38 : 28)}
                            fill="none"
                            stroke={leakColorShift}
                            strokeWidth="2"
                            opacity={Math.max(0, 1 - pulsePhaseA)}
                          />
                          <circle
                            cx="0"
                            cy="105"
                            r={10 + pulsePhaseB * (isCriticalLeak ? 38 : 28)}
                            fill="none"
                            stroke="#e11d48"
                            strokeWidth="1.8"
                            opacity={Math.max(0, 1 - pulsePhaseB)}
                          />
                        </g>
                      )}

                      {/* Movable Crack Point on Pipe Circumference */}
                      {(() => {
                        const rad = ((crackSize > 0 ? 140 : 180) * Math.PI) / 180;
                        const cx = Math.sin(rad) * 94;
                        const cy = -Math.cos(rad) * 94;
                        return (
                          <g>
                            {/* Pulse at circumferential fracture site */}
                            {classification.isAlert && (
                              <circle
                                cx={cx}
                                cy={cy}
                                r={6 + pulsePhaseA * 22}
                                fill="none"
                                stroke={leakColorShift}
                                strokeWidth="2"
                                opacity={Math.max(0, 1 - pulsePhaseA)}
                              />
                            )}
                            <circle
                              cx={cx}
                              cy={cy}
                              r={crackSize > 0 ? 6 : 3}
                              fill={classification.isAlert ? leakColorShift : crackSize > 0 ? '#e11d48' : '#94a3b8'}
                            />
                            {crackSize > 0 && (
                              <g>
                                {/* Gravity arc path from crack down to 6 o'clock invert */}
                                <path
                                  d={`M ${cx} ${cy} A 104 104 0 0 1 0 104`}
                                  fill="none"
                                  stroke={classification.isAlert ? leakColorShift : '#0284c7'}
                                  strokeWidth="2.5"
                                  strokeDasharray="4 3"
                                  strokeDashoffset={-tick * 1.5}
                                />
                                <text
                                  x="10"
                                  y="135"
                                  fill={classification.isAlert ? leakColorShift : '#0284c7'}
                                  fontSize="10"
                                  fontFamily="JetBrains Mono"
                                  fontWeight={classification.isAlert ? 'bold' : 'normal'}
                                  textAnchor="middle"
                                >
                                  {classification.isAlert
                                    ? `● LEAK DETECTED AT INVERT (${invertResistanceKOhms} kΩ)`
                                    : 'Gravity Path → Invert Accumulation'}
                                </text>
                              </g>
                            )}
                          </g>
                        );
                      })()}

                      <text x="0" y="5" fill="#ffffff" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">
                        50 mm DIA
                      </text>
                      <text x="0" y="20" fill="#e0f2fe" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
                        {pipeMaterial} PIPE
                      </text>
                    </g>
                  </svg>
                </div>
              )}
            </div>

            {/* Real-Time Quantitative Diagnostic Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
                <div className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                  Volumetric Water Loss
                </div>
                <div className="text-2xl font-mono font-bold text-slate-900 tabular-nums">
                  {leakRateLPerHour} <span className="text-xs font-normal text-slate-500">L/hour</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Annual Impact: {annualLossM3} m³ wasted
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
                <div className="text-[11px] font-mono font-semibold text-blue-700 uppercase tracking-wider">
                  Lower Invert Impedance (Z)
                </div>
                <div className="text-2xl font-mono font-bold text-blue-600 tabular-nums">
                  {invertResistanceKOhms} <span className="text-xs font-normal text-slate-500">kΩ</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  ADC Pin: {invertVoltage} V / 3.30 V
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
                <div className="text-[11px] font-mono font-semibold text-amber-700 uppercase tracking-wider">
                  Upper Crown Impedance
                </div>
                <div className="text-2xl font-mono font-bold text-amber-600 tabular-nums">
                  {crownResistanceKOhms} <span className="text-xs font-normal text-slate-500">kΩ</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Rain Wetting: {crownWettingPercent}%
                </div>
              </div>
            </div>

            {/* Oscilloscope Rolling Chart (Visual Signal Trace) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-800 font-bold flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  <span>ADC Sense Voltage vs. Time (Rolling Trace)</span>
                </span>
                <span className="text-rose-600 font-semibold text-[11px]">Threshold = 2.00 V</span>
              </div>
              <div className="h-20 w-full bg-slate-50 rounded-lg p-2 border border-slate-200 flex items-end gap-1 relative overflow-hidden">
                {/* Horizontal threshold reference line */}
                <div className="absolute top-[39%] left-0 right-0 border-b border-rose-400 border-dashed z-0" />
                {Array.from({ length: 20 }).map((_, slotIdx) => {
                  const offset = 20 - chartHistory.length;
                  const pt = slotIdx >= offset ? chartHistory[slotIdx - offset] : null;
                  if (!pt) {
                    return (
                      <div
                        key={slotIdx}
                        className="flex-1 h-full flex flex-col justify-end items-center relative z-10"
                      >
                        <div className="w-full h-1 rounded-t bg-slate-200" />
                      </div>
                    );
                  }
                  const heightPercent = Math.max(5, Math.min(100, (pt.v / 3.3) * 100));
                  const isAlarm = pt.v < 2.0;
                  return (
                    <div
                      key={slotIdx}
                      className="flex-1 flex flex-col justify-end items-center relative z-10"
                      style={{ height: '100%' }}
                    >
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${
                          isAlarm ? 'bg-rose-500' : 'bg-sky-500'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Buffer: {chartHistory.length}/20 samples</span>
                <span>
                  Current: {invertVoltage} V ({classification.isAlert ? 'ALARM ON' : 'SAFE'})
                </span>
                <span>{isSimPlaying ? `Streaming @ ${simSpeed.toFixed(2)}x` : 'Trace Paused'}</span>
              </div>
            </div>

            {/* Judge Evaluation Panel: Why SEEPORA is Superior */}
            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-700 uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Judge Scoring Rubric Highlights</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 shadow-xs">
                  <strong className="text-slate-900 block">1. Overcomes Acoustic Physics Limit</strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Municipal acoustic listeners rely on sound vibration, which drops by 47× in PVC/HDPE. SEEPORA measures direct electrolytic conductance, achieving 100% detection regardless of pipe material.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 shadow-xs">
                  <strong className="text-slate-900 block">2. Frugal Cost Viability (₹600 Node)</strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
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
