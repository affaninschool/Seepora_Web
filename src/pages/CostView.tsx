import React from 'react';
import { COST_ITEMS, TOTAL_UNIT_COST_INR } from '../data/projectData';
import {
  DollarSign,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Tag,
  Info
} from 'lucide-react';

export const CostView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* 1. Header & Lead */}
      <div className="max-w-3xl space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold shadow-xs">
            <Tag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Seva First Innovation Challenge Project</span>
          </div>
          <span className="text-slate-300">·</span>
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Project Economics
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          ₹600 Itemised Cost Breakdown
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          SEEPORA was engineered to be accessible for public schools and budget-constrained institutions. The total ₹600 cost covers one complete, autonomous single-pipe joint detection unit built using locally procurable off-the-shelf electronics.
        </p>
      </div>

      {/* 2. Important Clarification: Removal of the 100-Metre Claim (Prompt Mandatory) */}
      <section className="bg-amber-50 rounded-2xl border border-amber-200/80 p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Clarification Regarding Coverage Scope (No 100-Metre Claim)</span>
        </div>
        <div className="text-xs sm:text-sm text-amber-900 leading-relaxed space-y-2">
          <p>
            <strong>What the ₹600 Actually Covers:</strong> The ₹600 unit price covers <strong>one localized test-rig monitoring node</strong> (one 55 mm × 40 mm sensor strip, ADC microcontroller, buzzer, and power adapter) targeted directly at a high-risk joint, elbow, or valve fitting.
          </p>
          <p>
            <strong>Correction on 100-Metre Coverage:</strong> We have explicitly removed any unverified claim that a single ₹600 unit provides continuous 100-metre linear pipe coverage. In civil plumbing engineering, over 85% of pipe failures occur at discrete joint couplings, union collars, and expansion fittings. SEEPORA is designed as a nodal network positioned at these high-risk failure points, not as an unproven 100-metre continuous wrap.
          </p>
        </div>
      </section>

      {/* 3. The Itemised ₹600 Table */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              <span>Bill of Materials (BOM) — Single Joint Detection Node</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Exact retail pricing sourced from Indian electronics distributors (Robu.in / local hardware shops).
            </p>
          </div>
          <div className="flex items-baseline gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-200">
            <span className="text-xs font-semibold text-blue-700 uppercase">Total Unit Cost:</span>
            <span className="text-2xl font-mono font-bold text-blue-900 tabular-nums">₹{TOTAL_UNIT_COST_INR}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                <th className="p-3">#</th>
                <th className="p-3">Component Description</th>
                <th className="p-3">Technical Specification</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right">Subtotal</th>
                <th className="p-3">Engineering Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {COST_ITEMS.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-400">0{item.id}</td>
                  <td className="p-3 font-bold text-slate-900">{item.component}</td>
                  <td className="p-3 text-slate-600 font-mono text-[11px]">{item.specification}</td>
                  <td className="p-3 text-center font-mono">{item.qty}</td>
                  <td className="p-3 text-right font-mono tabular-nums">₹{item.unitPriceInr}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900 tabular-nums">₹{item.subtotalInr}</td>
                  <td className="p-3 text-slate-600">{item.purpose}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                <td colSpan={5} className="p-3 text-right text-xs uppercase tracking-wider text-slate-700">
                  Total Prototype Node Cost
                </td>
                <td className="p-3 text-right text-base font-mono text-blue-700 tabular-nums">
                  ₹{TOTAL_UNIT_COST_INR}
                </td>
                <td className="p-3 text-[11px] text-slate-500">
                  Fully operational single-fitting node
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Economic Comparison: SEEPORA vs Commercial Acoustic Systems */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900">
          Economic Comparison: SEEPORA vs. Commercial Acoustic Systems
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Commercial Acoustic Correlators
              </span>
              <span className="text-xs font-mono font-bold text-rose-700">₹45,000 – ₹1,50,000</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>• Requires specialized ultrasonic acoustic sensors and skilled technician crews.</li>
              <li>• Suffers severe signal attenuation on polymer pipes (PVC/CPVC) within 5–10 meters.</li>
              <li>• Periodic manual surveys only; cannot detect a leak that begins between inspections.</li>
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                SEEPORA Nodal Detection Node
              </span>
              <span className="text-xs font-mono font-bold text-blue-900">₹600 per Joint</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              <li>• Affordable for public school budgets; can be assembled in a student STEM lab.</li>
              <li>• Continuous 24/7 monitoring placed right where leaks form (elbows and flanges).</li>
              <li>• Completely unaffected by plastic pipe acoustic dampening or background street noise.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
