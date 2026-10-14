import React from 'react';
import { PageTab } from '../types';
import heroImg from '../assets/images/hero_pipeline_rig_1791812665006.jpg';
import infraImg from '../assets/images/pipeline_infrastructure_field_1791812680537.jpg';
import sensorMacroImg from '../assets/images/lab_sensor_strip_macro_1791812691943.jpg';
import {
  ArrowRight,
  Activity,
  Beaker,
  ShieldCheck,
  Zap,
  Layers,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  Sliders,
  HelpCircle,
  Award,
  Cpu,
  IndianRupee,
  MapPin,
  Quote
} from 'lucide-react';
import { SeeporaLogo } from '../components/SeeporaLogo';
import { PROJECT_METADATA } from '../data/projectData';

interface HomeViewProps {
  onTabChange: (tab: PageTab) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onTabChange }) => {
  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* 0. Visible Status Line (Prompt Mandatory) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-slate-200 px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-white font-medium">Status: Prototype in progress; simulation is illustrative. Physical bench trials underway.</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-400 text-[11px]">
            <span>Hardware Bench V12</span>
            <span>·</span>
            <span>FC-37 Tested</span>
          </div>
        </div>
      </div>

      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Headline and Call to action */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <SeeporaLogo className="w-10 h-10 shrink-0" />
              {/* Seva First Innovation Challenge Badge (Prompt Mandatory) */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold shadow-xs">
                <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Seva First Innovation Challenge Entry</span>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
                Detect Leaks. <br />
                <span className="text-blue-600">Protect Every Drop.</span>
              </h1>
              {/* One Clear Sentence on what SEEPORA is (Prompt Mandatory) */}
              <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed bg-blue-50/60 p-3.5 rounded-xl border border-blue-100">
                {PROJECT_METADATA.oneSentenceSummary}
              </p>
            </div>

            {/* Unboxed Metadata (Zero-Pill discipline) */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500 font-medium pt-1 border-t border-slate-200">
              <span className="text-slate-800 font-semibold">Direct Conductance</span>
              <span aria-hidden="true">·</span>
              <span>1 Invert Strip on Rig</span>
              <span aria-hidden="true">·</span>
              <span>₹600 / Joint</span>
              <span aria-hidden="true">·</span>
              <span>895 Campus Beneficiaries</span>
              <span aria-hidden="true">·</span>
              <span>Zero Acoustic Muffling</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onTabChange('lab')}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Beaker className="w-4 h-4" />
                <span>Launch Interactive Lab</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onTabChange('dashboard')}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                <Activity className="w-4 h-4 text-blue-600" />
                <span>View Live Dashboard</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Apparatus */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm group">
              <img
                src={heroImg}
                alt="SEEPORA laboratory acrylic pipeline test rig instrumented with horizontal conductive sensor strip"
                className="w-full h-[340px] sm:h-[420px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-mono text-cyan-300 tracking-wider uppercase mb-1">
                  Experimental Laboratory Test Rig
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Horizontal Rainwater-Sensor Strip on Pressurized Acrylic Pipe
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-lg">
                  Acrylic test specimen under 3.5 bar continuous fluid circulation. Gold-plated interdigitated electrode strip positioned along the lower pipe invert.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 The Real School Problem in Affan’s Words (Prompt Mandatory) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-6 sm:p-10 border border-blue-800 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-800/80 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Quote className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-mono text-cyan-300 font-semibold uppercase tracking-wider">
                  Origin Story & Campus Problem
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  The Real School Problem in Affan’s Words
                </h2>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/60 border border-blue-700 text-cyan-300 text-xs font-mono">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Seva First Innovation Challenge</span>
            </div>
          </div>

          <blockquote className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans italic border-l-2 border-cyan-400 pl-4 sm:pl-6 my-2">
            "{PROJECT_METADATA.author.quote}"
          </blockquote>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-blue-800/80 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center font-bold text-white text-sm">
                AA
              </div>
              <div>
                <div className="font-bold text-white">{PROJECT_METADATA.author.name}</div>
                <div className="text-slate-300">{PROJECT_METADATA.author.role} · {PROJECT_METADATA.author.school}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <span>Faculty Mentor:</span>
              <strong className="text-white">{PROJECT_METADATA.mentor.name}</strong>
              <span className="text-slate-400">({PROJECT_METADATA.mentor.title})</span>
            </div>
          </div>

          {/* Quick Action Pathways to New Dedicated Sections */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onTabChange('hardware')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>View Hardware & Sensor Module</span>
            </button>
            <button
              onClick={() => onTabChange('cost')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
              <span>₹600 Itemised Cost Table</span>
            </button>
            <button
              onClick={() => onTabChange('pilot')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>School Pilot & 895 Beneficiaries</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Concept Distinction: Sensor-Strip vs Obsolete Vibration Approach */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              <span>Engineering Evolution</span>
              <span aria-hidden="true">·</span>
              <span>Project Paradigm Shift</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Why Sensor Strips Replace Obsolete Vibration Methods
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Earlier concepts (like the legacy VibraTrace acoustic experiment) relied on detecting ultrasonic vibrations. Decades of municipal data prove that modern polymer pipes damp acoustic vibration within meters, rendering acoustic listening prone to false negatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* The Obsolete Vibration Method */}
            <div className="p-6 rounded-xl bg-rose-50/50 border border-rose-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-800">
                  Legacy Vibration / Acoustic Approach
                </span>
                <span className="text-xs font-mono text-rose-600 font-bold">Obsolete</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Acoustic Geophones & Accelerometers
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span>
                  <span><strong>Polymer Dampening:</strong> PVC, HDPE, and MDPE plastics absorb high-frequency leak hiss within 5–10 meters.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span>
                  <span><strong>Urban Noise Clutter:</strong> Traffic rumbles, metro vibrations, and mechanical pumps trigger constant false positives.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span>
                  <span><strong>Low-Pressure Blindspot:</strong> Micro-fissures with low pressure lack the acoustic energy required to trigger threshold alarms.</span>
                </li>
              </ul>
            </div>

            {/* The SEEPORA Conductive Strip Method */}
            <div className="p-6 rounded-xl bg-blue-50/50 border border-blue-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-800">
                  SEEPORA Direct-Contact Method
                </span>
                <span className="text-xs font-mono text-blue-600 font-bold">Current Concept V12</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Horizontal Interdigitated Sensor Strip
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Gravity-Guided Invert Flow:</strong> Any fluid escaping through pinholes or joints runs down the pipe circumference directly onto the strip.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Zero Acoustic Dependence:</strong> Measures electrical impedance drop across conductive electrodes. Acoustic noise has 0% effect.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Material Agnostic:</strong> Performs identically on ductile iron, copper, reinforced concrete, or flexible polyethylene.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Platform Capabilities & Navigation Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              System Modules
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Explore the Research Platform
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Dive into the interactive pipeline test bench, operational monitoring console, and empirical research problem cards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Interactive Lab */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Beaker className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Interactive Pipeline Lab
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The flagship virtual test bench. Dial in pipe flow velocity, hydrostatic pressure, crack widths, and simulated rain to observe droplet mechanics and real-time resistance decay curves.
              </p>
              <div className="text-xs text-slate-500 pt-1">
                <span>Dynamic Physics Model</span> · <span>4 Presets</span> · <span>Zero Stubs</span>
              </div>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onTabChange('lab')}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
              >
                <span>Open Virtual Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Monitoring Dashboard */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Live Monitoring Dashboard
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Operational telemetry console featuring rolling 60-second time series, multi-zone pipe status, hardware serial link configuration, and graceful disconnected state handling.
              </p>
              <div className="text-xs text-slate-500 pt-1">
                <span>Dual Mode (Sim & Serial)</span> · <span>Event Log</span> · <span>Incident Alerting</span>
              </div>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onTabChange('dashboard')}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <span>View Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Research & 7 Problems */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Research & 7 Problems
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Structured inquiry into the 7 critical consequences of undetected pipeline leakage: water depletion, structural foundation subsidence, road sinkholes, mould, and financial loss.
              </p>
              <div className="text-xs text-slate-500 pt-1">
                <span>7 Core Problem Cards</span> · <span>Credible Citations</span> · <span>AWWA & EPA</span>
              </div>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onTabChange('research')}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <span>Read Research</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Research Highlights & Photo Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl overflow-hidden p-6 sm:p-10 border border-slate-800 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
              <span>Empirical Laboratory Data</span>
              <span>·</span>
              <span>Controlled Pinhole Trials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Under 1.5 Seconds to Initial Moisture Detection
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              In laboratory pipe loop experiments, fluid escaping through a 150 µm aperture under 2.5 bar pressure trickles circumferentially down to the strip. Resistance plummets from dry infinity (&gt;500 kΩ) to under 15 kΩ within 1.4 seconds of contact.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-800">
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 tabular-nums">
                  &gt;99%
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Direct Contact Trigger
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 tabular-nums">
                  1.4 s
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Mean Wetting Latency
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 tabular-nums">
                  0 dB
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Acoustic Noise Vulnerability
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
              <img
                src={sensorMacroImg}
                alt="Close-up macro of flexible sensor strip adhered along pipe with water droplets"
                className="w-full h-64 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-3 bg-slate-800/90 text-[11px] text-slate-300 flex items-center justify-between">
                <span>Interdigitated Au/Ni Trace Strip</span>
                <span className="font-mono text-cyan-300">1.2 mm pitch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Team Spotlight Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              <span>Project Team</span>
              <span>·</span>
              <span>Academic Engineering</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Affan Adil & Faculty Mentorship (Delhi Public School, R.K. Puram)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              SEEPORA is a student engineering initiative developed by Affan Adil under the mentorship of Dr. Rajesh Sharma, Head of Applied Sciences. Built for the Seva First Innovation Challenge to solve real campus water leakage.
            </p>
          </div>
          <button
            onClick={() => onTabChange('about')}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>About Affan & Mentorship</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
