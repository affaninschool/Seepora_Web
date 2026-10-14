import React from 'react';
import { TEAM_MEMBERS, MENTORS_AND_ADVISORS, ACKNOWLEDGMENTS } from '../data/teamData';
import {
  UserCheck,
  CheckCircle2,
  Award,
  Layers,
  GraduationCap,
  Shield,
  HeartHandshake,
  Cpu
} from 'lucide-react';

export const TeamView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* 1. Header & Lead */}
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
          <span>Project Leadership & Contributors</span>
          <span aria-hidden="true">·</span>
          <span>Academic Engineering</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Team SEEPORA
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Project SEEPORA is driven by student engineering research dedicated to water conservation, smart sensor instrumentation, and infrastructure reliability.
        </p>
      </div>

      {/* 2. Lead Researcher Profile: Affan Adil */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-sm text-2xl font-bold tracking-tight">
              AA
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
                  Lead Project Researcher
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500">Project Founder</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Affan Adil
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Systems & Instrumentation Lead · Project SEEPORA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span>Focus: Sensor Architecture & Hydrodynamics</span>
          </div>
        </div>

        {/* Bio & Responsibilities Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Researcher Profile & Scope
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Affan Adil leads the engineering development of SEEPORA, orchestrating the technological pivot from obsolete vibration acoustic models (VibraTrace) to the current horizontal conductive sensor-strip concept.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              His work focuses on empirical laboratory validation, evaluating trace spacing, gravity-assisted invert pooling, and firmware thresholding to prevent catastrophic distribution pipe blowouts.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Core Project Responsibilities</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-700">
              {TEAM_MEMBERS[0].responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-blue-600 font-bold mt-0.5">✓</span>
                  <span className="leading-relaxed">{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Collaborators & Engineering Workgroup */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Research Contributors
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Engineering Collaborators & Student Researchers
          </h2>
        </div>

        <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {TEAM_MEMBERS[1].bio}
          </p>
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Collaborator Workstreams:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              {TEAM_MEMBERS[1].responsibilities.map((r, i) => (
                <div key={i} className="flex items-start gap-2 bg-white p-2.5 rounded border border-slate-200/80">
                  <span className="text-slate-400 font-mono text-[10px] mt-0.5">0{i+1}.</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Mentors, Advisors & Academic Guidance */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Academic Advisory
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Mentors & Advisory Guidance
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MENTORS_AND_ADVISORS.map((mentor, i) => (
            <div key={i} className="p-5 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>{mentor.name}</span>
              </div>
              <div className="text-xs text-blue-700 font-medium">
                {mentor.affiliation}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {mentor.guidanceArea}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Institutional Acknowledgments & Academic Standards */}
      <section className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-slate-700" />
          <span>Acknowledgments & Research Facilities</span>
        </h3>
        <ul className="space-y-2 text-xs text-slate-600">
          {ACKNOWLEDGMENTS.map((ack, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-slate-400 font-bold">•</span>
              <span>{ack}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
