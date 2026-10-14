import React, { useState } from 'react';
import sensorMacroImg from '../assets/images/lab_sensor_strip_macro_1791812691943.jpg';
import {
  Cpu,
  Layers,
  ArrowRight,
  ShieldAlert,
  Droplets,
  Activity,
  CheckCircle2,
  Info,
  Maximize2
} from 'lucide-react';

export const HowItWorksView: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isLeakingSimulation, setIsLeakingSimulation] = useState<boolean>(true);

  const steps = [
    {
      num: 1,
      title: 'Pressurized Pipe Containment & Breach',
      subtitle: 'Fluid dynamics under pressure',
      desc: 'Municipal drinking water flows under 2.0 to 6.0 bar of hydrostatic pressure. When a hairline fissure (50–300 µm) or joint displacement forms, fluid escapes from the high-pressure core to atmospheric pressure.',
      badge: 'Stage 1: Hydrodynamics'
    },
    {
      num: 2,
      title: 'Circumferential Capillary Flow & Gravity Guide',
      subtitle: 'Natural fluid trajectory along outer pipe wall',
      desc: 'Escaping water clings to the pipe exterior via surface tension and gravity, naturally streaming downward along the pipe circumference toward the lowest invert (the 6 o’clock position).',
      badge: 'Stage 2: Gravity Invert'
    },
    {
      num: 3,
      title: 'Electrode Grid Bridging on Sensor Strip',
      subtitle: 'Direct ionic conduction across interdigitated traces',
      desc: 'The horizontal sensor strip is adhered along the invert. As water droplets coalesce on the surface, municipal electrolytes (calcium, magnesium, chloride ions) form a conductive bridge between interdigitated copper-nickel tracks.',
      badge: 'Stage 3: Electrolytic Bridge'
    },
    {
      num: 4,
      title: 'Analog Voltage Divider & Microcontroller ADC',
      subtitle: 'Conversion of impedance collapse to digital reading',
      desc: 'The sensor strip acts as a variable resistor R_sense in a voltage divider circuit. Dry resistance (>500 kΩ) pulls the analog input high. Droplet contact drops resistance to 5–20 kΩ, causing an immediate readable voltage drop measured by a 12-bit ADC.',
      badge: 'Stage 4: ADC Sampling'
    },
    {
      num: 5,
      title: 'Algorithmic Classification & Dual-Strip Logic',
      subtitle: 'Mitigating false alarms from external rainfall',
      desc: 'A secondary baseline strip on the pipe crown (top) enables differential logic: If only the bottom invert is wet, an internal leak is classified. If both top and bottom are wet simultaneously, ambient rain or condensation is detected.',
      badge: 'Stage 5: Intelligent Decision'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* 1. Header & Lead */}
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
          <span>Engineering Principles</span>
          <span aria-hidden="true">·</span>
          <span>Physical Mechanism</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How SEEPORA Detects Leaks
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          The Seepora concept relies on direct electrolytic contact rather than acoustic listening. An interdigitated rainwater-sensor strip is positioned horizontally along the pipe invert, transforming escaping moisture into an instantaneous electrical signal.
        </p>
      </div>

      {/* 2. Interactive Engineering Cutaway Diagram */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-600" />
              <span>Animated Engineering Diagram: Longitudinal & Cross-Section</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Interactive pipe cutaway model displaying internal pressure, micro-fissure, and horizontal invert strip.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLeakingSimulation(!isLeakingSimulation)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                isLeakingSimulation
                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-700'
              }`}
            >
              {isLeakingSimulation ? 'Simulating: Active Leakage' : 'Simulating: Dry Normal Flow'}
            </button>
          </div>
        </div>

        {/* SVG Engineering Cutaway */}
        <div className="relative w-full h-[380px] sm:h-[420px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-4 flex items-center justify-center">
          <svg
            viewBox="0 0 900 420"
            className="w-full h-full max-h-[400px] select-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Grid background lines */}
            <defs>
              <pattern id="engGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.75" />
              </pattern>
              <linearGradient id="waterFlow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="pipeWall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="50%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>

            <rect width="900" height="420" fill="url(#engGrid)" />

            {/* Technical Labels & Dimensions */}
            <text x="30" y="35" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">
              CROSS-SECTION & AXIAL ELEVATION : 100mm O.D. PIPELINE
            </text>
            <text x="750" y="35" fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono">
              SCALE: 1:1 CALIBRATED
            </text>

            {/* PIPELINE BODY (AXIAL VIEW: Left side) */}
            {/* Upper pipe wall */}
            <rect x="60" y="110" width="460" height="18" rx="2" fill="url(#pipeWall)" stroke="#475569" strokeWidth="1" />
            <text x="70" y="102" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">
              PIPE CROWN (TOP)
            </text>

            {/* Internal pressurized fluid core */}
            <rect x="60" y="128" width="460" height="114" fill="url(#waterFlow)" />

            {/* Fluid stream animated lines */}
            <g className="opacity-75">
              <line x1="70" y1="150" x2="510" y2="150" stroke="#bae6fd" strokeWidth="1.5" strokeDasharray="16 8" />
              <line x1="70" y1="185" x2="510" y2="185" stroke="#ffffff" strokeWidth="2" strokeDasharray="24 12" />
              <line x1="70" y1="220" x2="510" y2="220" stroke="#bae6fd" strokeWidth="1.5" strokeDasharray="16 8" />
              <text x="210" y="190" fill="#ffffff" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">
                INTERNAL FLOW : 42.5 L/min @ 3.4 BAR
              </text>
            </g>

            {/* Lower pipe wall with fracture */}
            <rect x="60" y="242" width="220" height="18" rx="2" fill="url(#pipeWall)" stroke="#475569" strokeWidth="1" />
            <rect x="300" y="242" width="220" height="18" rx="2" fill="url(#pipeWall)" stroke="#475569" strokeWidth="1" />

            {/* The Fracture Aperture */}
            <g>
              <rect x="280" y="242" width="20" height="18" fill="#0f172a" stroke="#e11d48" strokeWidth="1.5" strokeDasharray="2 2" />
              <text x="250" y="280" fill="#f43f5e" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                ▲ PINHOLE FISSURE (180 µm)
              </text>
            </g>

            {/* SENSOR STRIP (HORIZONTAL INVERT STRIP) */}
            {/* Mounted directly under lower pipe wall */}
            <rect
              x="120"
              y="262"
              width="360"
              height="8"
              rx="2"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="1"
            />

            {/* Interdigitated electrode tracks inside strip */}
            <g stroke="#78350f" strokeWidth="1">
              <line x1="140" y1="264" x2="140" y2="268" />
              <line x1="160" y1="264" x2="160" y2="268" />
              <line x1="180" y1="264" x2="180" y2="268" />
              <line x1="200" y1="264" x2="200" y2="268" />
              <line x1="220" y1="264" x2="220" y2="268" />
              <line x1="240" y1="264" x2="240" y2="268" />
              <line x1="260" y1="264" x2="260" y2="268" />
              <line x1="280" y1="264" x2="280" y2="268" />
              <line x1="300" y1="264" x2="300" y2="268" />
              <line x1="320" y1="264" x2="320" y2="268" />
              <line x1="340" y1="264" x2="340" y2="268" />
              <line x1="360" y1="264" x2="360" y2="268" />
              <line x1="380" y1="264" x2="380" y2="268" />
              <line x1="400" y1="264" x2="400" y2="268" />
              <line x1="420" y1="264" x2="420" y2="268" />
              <line x1="440" y1="264" x2="440" y2="268" />
              <line x1="460" y1="264" x2="460" y2="268" />
            </g>

            <text x="130" y="285" fill="#fbbf24" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
              ◄ HORIZONTAL SENSOR STRIP (LOWER INVERT) ►
            </text>

            {/* Droplet Escape Animation if Leaking */}
            {isLeakingSimulation && (
              <g>
                {/* Seeping water droplets from fissure */}
                <circle cx="290" cy="254" r="3.5" fill="#38bdf8" />
                <circle cx="286" cy="265" r="4.5" fill="#38bdf8" />
                <circle cx="294" cy="272" r="4" fill="#38bdf8" />
                <circle cx="290" cy="280" r="5" fill="#38bdf8" />
                <path d="M 270 263 Q 290 268 310 263" stroke="#38bdf8" strokeWidth="4" fill="none" opacity="0.9" />

                {/* Conductive bridge alert banner */}
                <rect x="235" y="300" width="130" height="24" rx="4" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
                <text x="242" y="316" fill="#ffffff" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                  DROPLET BRIDGE (8.4 kΩ)
                </text>
              </g>
            )}

            {/* SIGNAL WIRES to Microcontroller */}
            <path
              d="M 480 266 L 540 266 L 560 210 L 620 210"
              stroke="#f59e0b"
              strokeWidth="2"
              fill="none"
              strokeDasharray={isLeakingSimulation ? "4 2" : "none"}
            />
            <path
              d="M 480 270 L 535 270 L 555 214 L 620 214"
              stroke="#64748b"
              strokeWidth="1.5"
              fill="none"
            />

            {/* MICROCONTROLLER ADC NODE (Right side) */}
            <rect x="620" y="140" width="220" height="150" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <text x="635" y="165" fill="#ffffff" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">
              SEEPORA ADC NODE
            </text>
            <text x="635" y="185" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">
              12-BIT HIGH-Z ANALOG FRONTEND
            </text>

            {/* Telemetry Readout Box on Controller */}
            <rect x="635" y="195" width="190" height="80" rx="4" fill="#020617" stroke="#1e293b" />
            <text x="645" y="215" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono">
              V_SENSE:
            </text>
            <text
              x="710"
              y="215"
              fill={isLeakingSimulation ? '#f43f5e' : '#10b981'}
              fontSize="11"
              fontFamily="JetBrains Mono"
              fontWeight="bold"
            >
              {isLeakingSimulation ? '0.42 V (DROP)' : '3.28 V (DRY)'}
            </text>

            <text x="645" y="235" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono">
              IMPEDANCE:
            </text>
            <text
              x="710"
              y="235"
              fill={isLeakingSimulation ? '#f43f5e' : '#10b981'}
              fontSize="11"
              fontFamily="JetBrains Mono"
              fontWeight="bold"
            >
              {isLeakingSimulation ? '8.4 kΩ (WET)' : '> 500 kΩ'}
            </text>

            <text x="645" y="255" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono">
              STATUS:
            </text>
            <text
              x="710"
              y="255"
              fill={isLeakingSimulation ? '#f43f5e' : '#10b981'}
              fontSize="10"
              fontFamily="JetBrains Mono"
              fontWeight="bold"
            >
              {isLeakingSimulation ? 'ALERT: LEAKAGE' : 'NOMINAL (OK)'}
            </text>

            {/* CIRCULAR PIPE RADIAL CROSS-SECTION (Far right thumbnail) */}
            <g transform="translate(68, 320)">
              <text x="0" y="0" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">
                RADIAL INVERT ALIGNMENT
              </text>
              {/* Outer circle */}
              <circle cx="24" cy="35" r="24" stroke="#475569" strokeWidth="4" fill="#0284c7" fillOpacity="0.4" />
              {/* Lower strip marker */}
              <rect x="14" y="58" width="20" height="4" fill="#fbbf24" rx="1" />
              <text x="60" y="38" fill="#cbd5e1" fontSize="9" fontFamily="JetBrains Mono">
                Water pools at bottom invert (6 o'clock)
              </text>
              <text x="60" y="50" fill="#fbbf24" fontSize="9" fontFamily="JetBrains Mono">
                Sensor strip placement maximizes gravity capture
              </text>
            </g>
          </svg>
        </div>
      </section>

      {/* 3. Step-by-Step Breakdown Accordion/Stepper */}
      <section className="space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Operational Lifecycle
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            5-Stage Detection Lifecycle
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {steps.map((s) => {
            const isActive = activeStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => setActiveStep(s.num)}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50/80 border-blue-400 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>STEP 0{s.num}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {s.title}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Selected Step Deep Dive Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-mono text-blue-600 font-semibold uppercase tracking-wider">
                {steps[activeStep - 1].badge}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                {steps[activeStep - 1].title}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {steps[activeStep - 1].subtitle}
              </p>
            </div>
            <div className="text-2xl font-mono font-bold text-slate-200">
              0{activeStep} / 05
            </div>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
            {steps[activeStep - 1].desc}
          </p>
        </div>
      </section>

      {/* 4. Engineering Limitations & Scientific Honesty (Crucial Prompt Requirement) */}
      <section className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-10 space-y-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Scientific Honesty & Verification Standards</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            System Limitations & Boundary Conditions
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            As an engineering research initiative, SEEPORA adheres to strict empirical disclosure. The sensor-strip method offers compelling advantages over acoustic methods, but carries specific physical boundary conditions that must be addressed in production deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Limitation 1 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2.5">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-amber-600">01.</span>
              <span>Surface-Only Detection (Post-Breach Timing)</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlike non-destructive internal ultrasonic wall scanners, the sensor strip only triggers once pressurized fluid breaches the pipe wall and contacts the external strip surface. It cannot forecast internal wall thinning before penetration occurs.
            </p>
          </div>

          {/* Limitation 2 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2.5">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-amber-600">02.</span>
              <span>Ambient Weather & Rain Exposure</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              On exposed above-ground pipelines, torrential rainfall or groundwater saturation could wet the strip and trigger false positives. Mitigated via physical weather-shrouding covers and differential top-versus-bottom dual-strip logic.
            </p>
          </div>

          {/* Limitation 3 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2.5">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-amber-600">03.</span>
              <span>Electrolyte Conductivity Variance</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Detection speed depends on dissolved ions in the water (hardness/mineral content). While standard municipal tap water is highly conductive (300–800 µS/cm), ultra-pure demineralized industrial feeds produce a slower impedance drop.
            </p>
          </div>

          {/* Limitation 4 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2.5">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-amber-600">04.</span>
              <span>Adhesive Longevity & Soil Chemical Attack</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              For directly buried pipelines, moisture-resistant acrylic pressure-sensitive adhesives and vulcanized rubber backing are required to prevent strip delamination and corrosive soil ionic short-circuits.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
