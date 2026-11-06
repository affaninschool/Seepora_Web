import React from 'react';
import {
  X,
  Award,
  CheckCircle2,
  Printer,
  ExternalLink,
  ShieldAlert,
  Droplet,
  Users,
  Coins,
  Cpu,
  School,
  FileCheck2,
  HeartHandshake
} from 'lucide-react';
import { SeeporaLogo } from './SeeporaLogo';
import { PROJECT_METADATA, COST_ITEMS } from '../data/projectData';

interface SevaFirstBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SevaFirstBriefModal: React.FC<SevaFirstBriefModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 p-6 text-white relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-300/40 p-2 flex items-center justify-center shadow-inner">
              <Award className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-[11px] font-mono font-semibold tracking-wider uppercase border border-amber-300/30">
                Official Submission Document
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                Seva First Innovation Brief
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-100 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print or Save PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-sm">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold block">
                Project Title
              </span>
              <strong className="text-slate-900 font-bold text-sm">Project SEEPORA</strong>
              <p className="text-slate-500 text-[11px]">Direct-Conductance Leak Guard</p>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold block">
                Student Innovator
              </span>
              <strong className="text-slate-900 font-bold">Affan Adil</strong>
              <p className="text-slate-500 text-[11px]">Class 11, Delhi Public School</p>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold block">
                Faculty Mentor
              </span>
              <strong className="text-slate-900 font-bold">Sandip Dutta</strong>
              <p className="text-slate-500 text-[11px]">Head of Applied Sciences, DPS</p>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold block">
                Cost Per Unit
              </span>
              <strong className="text-emerald-700 font-bold text-sm">₹600 INR</strong>
              <p className="text-slate-500 text-[11px]">Complete Test Node BOM</p>
            </div>
          </div>

          {/* Section 1: The Seva (Selfless Community Service) Mission */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <HeartHandshake className="w-5 h-5 text-amber-600" />
              <span>1. The Seva Mission: Solving Campus & Community Water Depletion</span>
            </h3>
            <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
              In Hindi, <strong>"Seva"</strong> signifies selfless community service dedicated to uplifting society. In Indian government schools, public municipal campuses, and community health centers, clean drinking water is a precious, life-sustaining resource that is frequently lost to unaddressed infrastructure seepage.
            </p>
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-2">
              <strong className="font-bold text-amber-900 block text-sm">
                The Real DPS R.K. Puram Corridor Trigger (In Affan Adil's Words):
              </strong>
              <blockquote className="italic text-slate-700 border-l-2 border-amber-500 pl-3 leading-relaxed">
                "{PROJECT_METADATA.author.quote}"
              </blockquote>
            </div>
          </div>

          {/* Section 2: Technological Innovation */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Cpu className="w-5 h-5 text-blue-600" />
              <span>2. Technological Innovation: Bypassing Acoustic Blindspots</span>
            </h3>
            <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
              Commercial municipal leak detection relies on acoustic correlators and geophones costing ₹2,50,000 to ₹5,00,000 per crew. However, modern educational facilities utilize plastic piping (PVC, CPVC, HDPE) which naturally dampens acoustic vibration waves by up to 50× compared to iron, rendering acoustic listening useless.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Direct Conductance</span>
                </span>
                <p className="text-slate-600">
                  Measures physical water contact across gold-plated nickel traces with zero dependence on sound.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Gravity Invert Flow</span>
                </span>
                <p className="text-slate-600">
                  Any escaping droplet flows downward around the pipe outer wall directly onto the invert strip at 6 o'clock.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1">
                <span className="font-bold text-purple-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>Sub-2-Second Alert</span>
                </span>
                <p className="text-slate-600">
                  Triggers local buzzer and visual alarm in 1.4 seconds (dry 500kΩ to wet 15kΩ).
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Bill of Materials & Cost Viability */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Coins className="w-5 h-5 text-emerald-600" />
              <span>3. Economic Viability: Itemised ₹600 Bill of Materials</span>
            </h3>
            <p className="text-slate-700 leading-relaxed text-xs">
              Every single component is off-the-shelf and procurable in local electronics markets (Lajpat Rai / Nehru Place, New Delhi).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="p-2.5">Component</th>
                    <th className="p-2.5">Specification</th>
                    <th className="p-2.5 font-mono text-center">Qty</th>
                    <th className="p-2.5 font-mono text-right">Cost (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {COST_ITEMS.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2.5 font-semibold text-slate-900">{item.component}</td>
                      <td className="p-2.5">{item.specification}</td>
                      <td className="p-2.5 font-mono text-center">{item.qty}</td>
                      <td className="p-2.5 font-mono text-right font-bold text-slate-900">₹{item.subtotalInr}</td>
                    </tr>
                  ))}
                  <tr className="bg-emerald-50/50 font-bold text-emerald-950">
                    <td colSpan={3} className="p-2.5 text-right uppercase tracking-wider text-[11px]">
                      Total Node Unit Cost:
                    </td>
                    <td className="p-2.5 font-mono text-right text-sm text-emerald-800">
                      ₹600 INR
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Pilot Deployment & Beneficiaries */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <School className="w-5 h-5 text-indigo-600" />
              <span>4. Campus Pilot Plan & Beneficiary Metrics</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-mono block text-[10px] uppercase">Pilot Location</span>
                <strong className="text-slate-900 text-xs">Main Academic Riser Wall</strong>
                <p className="text-slate-500 text-[11px]">DPS R.K. Puram Senior Wing</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-mono block text-[10px] uppercase">Direct Beneficiaries</span>
                <strong className="text-slate-900 text-xs">895 Students & Staff</strong>
                <p className="text-slate-500 text-[11px]">Daily drinking cooler access</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-mono block text-[10px] uppercase">Scientific Governance</span>
                <strong className="text-slate-900 text-xs">Sandip Dutta</strong>
                <p className="text-slate-500 text-[11px]">Dept. of Science & Innovation</p>
              </div>
            </div>
          </div>

          {/* Section 5: Scientific Integrity Statement */}
          <div className="p-4 rounded-xl bg-slate-900 text-slate-300 text-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
              <ShieldAlert className="w-4 h-4" />
              <span>Scientific Disclosure & Integrity Statement</span>
            </div>
            <p className="leading-relaxed">
              SEEPORA is built under strict academic ethics supervised by mentor Sandip Dutta. The physical strip detects surface electrolytic wetting and impedance collapse. It does not measure internal water velocity or pressure gradients. For outdoor deployment exposed to rain, an overhanging drip cowl or dual crown-invert differential classification is engineered to prevent false alarms.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500">
            Entry for the <strong>Seva First Innovation Challenge 2026</strong>.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Brief</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-medium transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
