import React from 'react';
import { PILOT_DEPLOYMENT_PLAN } from '../data/projectData';
import {
  MapPin,
  Users,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
  Building,
  Droplet,
  Layers
} from 'lucide-react';

export const PilotView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* 1. Header & Lead */}
      <div className="max-w-3xl space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold shadow-xs">
            <Building className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Seva First Innovation Challenge Pilot Deployment</span>
          </div>
          <span className="text-slate-300">·</span>
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Field Implementation
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          School Pilot Deployment Plan
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Grounding the engineering research in Affan Adil’s actual school campus: the exact pipeline selected for pilot monitoring, the 895 campus beneficiaries relying on it, and the rigorous audit methodology used to count them.
        </p>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Target Pipeline Location</span>
          </div>
          <div className="text-xl font-bold text-slate-900">
            Block B Riser Pipe
          </div>
          <p className="text-xs text-slate-500">
            1-inch CPVC overhead tank gravity supply
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Campus Beneficiaries</span>
          </div>
          <div className="text-3xl font-mono font-bold text-slate-900 tabular-nums">
            {PILOT_DEPLOYMENT_PLAN.beneficiaryCount}
          </div>
          <p className="text-xs text-slate-500">
            850 students + 45 teaching & support staff
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Droplet className="w-4 h-4 text-cyan-600" />
            <span>Critical Endpoints Served</span>
          </div>
          <div className="text-xl font-bold text-slate-900">
            4-Tap Cooler & Sanitation
          </div>
          <p className="text-xs text-slate-500">
            High single-point failure vulnerability
          </p>
        </div>
      </div>

      {/* 3. The Specific Pipe Being Monitored (Prompt Mandatory) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1 border-b border-slate-100 pb-4">
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Site Specification
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            The Specific Pipeline Selected for Pilot Testing
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
              <p>
                <strong>Exact Pipeline Identity:</strong> {PILOT_DEPLOYMENT_PLAN.specificPipeDescription}
              </p>
              <p className="text-slate-600">
                <strong>Why This Pipe:</strong> {PILOT_DEPLOYMENT_PLAN.whyThisPipeWasChosen}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800">Pipe Diameter:</span>
                <div>1-inch nominal (25.4 mm O.D.)</div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800">Operating Head:</span>
                <div>Gravity fed (~1.8 to 2.4 bar)</div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800">Material:</span>
                <div>Chlorinated PVC (CPVC)</div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800">Risk Profile:</span>
                <div>Concealed behind brickwork shaft</div>
              </div>
            </div>
          </div>

          {/* Schematic SVG of the Riser Run */}
          <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-800 text-slate-300">
            <div className="text-xs font-mono font-bold text-cyan-400 mb-3 uppercase flex items-center justify-between">
              <span>RISER SCHEMATIC</span>
              <span>BLOCK B</span>
            </div>
            <svg viewBox="0 0 300 240" className="w-full h-48 select-none" fill="none">
              {/* Rooftop Tank */}
              <rect x="30" y="20" width="70" height="40" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              <text x="65" y="44" fill="#ffffff" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">5,000L TANK</text>

              {/* Riser Pipe Line */}
              <path d="M 100 40 L 160 40 L 160 210" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />

              {/* SEEPORA Invert Sensor Strip Collar */}
              <rect x="153" y="105" width="14" height="28" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
              <text x="175" y="122" fill="#fbbf24" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">◄ SENSOR NODE 1</text>
              <text x="175" y="134" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">Concealed Shaft Joint</text>

              {/* Branch to 1st Floor Cooler */}
              <line x1="160" y1="160" x2="220" y2="160" stroke="#94a3b8" strokeWidth="4" />
              <rect x="220" y="145" width="55" height="30" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              <text x="247" y="163" fill="#38bdf8" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">WATER COOLER</text>

              {/* Ground Floor Washroom Branch */}
              <line x1="160" y1="210" x2="220" y2="210" stroke="#94a3b8" strokeWidth="4" />
              <rect x="220" y="198" width="55" height="24" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              <text x="247" y="214" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">WASHROOMS</text>
            </svg>
            <div className="text-[10px] text-slate-400 font-mono text-center pt-2 border-t border-slate-800">
              Sensor positioned at concealed joint before building entry
            </div>
          </div>
        </div>
      </section>

      {/* 4. How He Counted Them: 3-Point Audit Methodology (Prompt Mandatory) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1 border-b border-slate-100 pb-4">
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Auditing Methodology
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            How the 895 Beneficiaries Were Counted
          </h2>
          <p className="text-xs text-slate-500">
            Documented headcounts derived from administrative registers and physical recess observation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILOT_DEPLOYMENT_PLAN.countingMethodology.map((step, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-xs">
                  {idx + 1}
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {idx === 0 ? 'Enrollment Audit' : idx === 1 ? 'Faculty Roster' : 'Physical Recess Tally'}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
