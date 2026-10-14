import React, { useState } from 'react';
import { RESEARCH_PROBLEMS, ACADEMIC_REFERENCES, RESEARCH_METHODOLOGY } from '../data/researchData';
import infraImg from '../assets/images/pipeline_infrastructure_field_1791812680537.jpg';
import {
  FileText,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  Beaker,
  ShieldAlert,
  Droplet,
  Layers,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const ResearchView: React.FC = () => {
  const [expandedProblem, setExpandedProblem] = useState<number | null>(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* 1. Header & Lead */}
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
          <span>Empirical Infrastructure Research</span>
          <span aria-hidden="true">·</span>
          <span>Problem Formulation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Research & The 7 Pipeline Challenges
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Subterranean water distribution failure causes cascading environmental, structural, and financial damage. SEEPORA formulates its sensor-strip engineering around seven core problems documented across civil water infrastructure literature.
        </p>
      </div>

      {/* 2. Field Photo & Overview Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
        <img
          src={infraImg}
          alt="Municipal water utility tunnel with potable water distribution pipelines and inspection engineers"
          className="w-full h-64 sm:h-80 object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
              Non-Revenue Water (NRW) Crisis
            </span>
            <h2 className="text-xl sm:text-2xl font-bold">
              Over 30% of Global Municipal Water is Lost to Subterranean Seepage
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              According to the World Bank and International Water Association (IWA), utility providers lose tens of billions in treated potable water annually due to inaccessible micro-fissures in underground mains.
            </p>
          </div>
        </div>
      </div>

      {/* 3. The 7 Problems Visual Cards (Prompt Mandatory Core) */}
      <section className="space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Critical Impact Analysis
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            The 7 Fundamental Pipeline Problems
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Click any problem card to view the underlying mechanical failure vector and SEEPORA's engineering response.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESEARCH_PROBLEMS.map((prob) => {
            const isExpanded = expandedProblem === prob.id;

            return (
              <div
                key={prob.id}
                onClick={() => setExpandedProblem(isExpanded ? null : prob.id)}
                className={`bg-white rounded-xl border transition-all cursor-pointer flex flex-col justify-between p-6 ${
                  isExpanded
                    ? 'border-blue-500 shadow-md ring-1 ring-blue-500'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      PROBLEM 0{prob.id}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {prob.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {prob.title}
                    </h3>
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-baseline gap-2">
                      <span className="text-xl font-mono font-bold text-blue-600 tabular-nums">
                        {prob.metric}
                      </span>
                      <span className="text-[11px] text-slate-500 leading-tight">
                        {prob.metricLabel}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {prob.description}
                  </p>

                  {/* Expanded Engineering Mechanism & Seepora Solution */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-100 space-y-3 text-xs animate-in fade-in duration-200">
                      <div className="bg-slate-50 p-3 rounded-lg space-y-1">
                        <span className="font-semibold text-slate-800">Physical Failure Vector:</span>
                        <p className="text-slate-600">{prob.mechanism}</p>
                      </div>

                      <div className="bg-blue-50/70 p-3 rounded-lg space-y-1 border border-blue-100">
                        <span className="font-semibold text-blue-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                          <span>SEEPORA Sensor Solution:</span>
                        </span>
                        <p className="text-blue-800">{prob.seeporaSolution}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-2 text-right">
                  <span className="text-xs font-semibold text-blue-600 flex items-center justify-end gap-1">
                    <span>{isExpanded ? 'Hide Details' : 'View Engineering Mechanism'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Research Objectives, Methodology & Empirical Setup */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1 border-b border-slate-100 pb-4">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Experimental Protocol
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Research Objectives & Methodology
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Beaker className="w-4 h-4 text-blue-600" />
              <span>Core Research Objective</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {RESEARCH_METHODOLOGY.objective}
            </p>

            <h3 className="font-bold text-slate-900 flex items-center gap-2 pt-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Experimental Laboratory Rig</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {RESEARCH_METHODOLOGY.experimentalSetup}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Key Empirical Findings</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {RESEARCH_METHODOLOGY.empiricalFindings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-bold text-blue-600 mt-0.5">0{idx + 1}.</span>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Verified Academic & Industry References (No Hallucinations) */}
      <section className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Academic Bibliography & Regulatory Standards</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Credible References & Literature
          </h2>
          <p className="text-xs text-slate-500">
            Standards from the American Water Works Association (AWWA), US EPA, and World Health Organization governing pipeline leakage diagnostics.
          </p>
        </div>

        <div className="space-y-4">
          {ACADEMIC_REFERENCES.map((ref, i) => (
            <div key={i} className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">{ref.source}</span>
                <span className="text-xs font-mono text-slate-500">Published {ref.year}</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                {ref.citation}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-2">
                <span className="font-semibold text-slate-700">Key Finding:</span> {ref.keyFinding}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
