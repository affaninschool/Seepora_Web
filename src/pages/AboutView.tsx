import React from 'react';
import { TEAM_MEMBERS, MENTORS_AND_ADVISORS, ACKNOWLEDGMENTS } from '../data/teamData';
import { PROJECT_METADATA } from '../data/projectData';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  Building,
  Quote,
  Cpu,
  HeartHandshake,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { PageTab } from '../types';

interface AboutViewProps {
  onTabChange?: (tab: PageTab) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onTabChange }) => {
  const affan = TEAM_MEMBERS[0];
  const collaborators = TEAM_MEMBERS[1];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* 1. Header & Lead */}
      <div className="max-w-3xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Seva First Innovation Challenge Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold shadow-xs">
            <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Seva First Innovation Challenge Official Entry</span>
          </div>
          <span className="text-slate-300">·</span>
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Student Engineering Research
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About Project SEEPORA
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          SEEPORA was conceived, designed, and prototyped by high school student Affan Adil under the mentorship of Dr. Rajesh Sharma at Delhi Public School, R.K. Puram, as an entry for the Seva First Innovation Challenge.
        </p>
      </div>

      {/* 2. Key Personnel: Affan Adil & Dr. Rajesh Sharma (Side by Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Student Innovator: Affan Adil */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
                  AA
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
                    Student Innovator & Lead Researcher
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Affan Adil
                  </h2>
                  <div className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-1.5 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Delhi Public School, R.K. Puram</span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    Class 11 · Science & Engineering Stream
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {affan.bio}
            </p>

            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Primary Responsibilities</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {affan.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-blue-600 font-bold mt-0.5">✓</span>
                    <span className="leading-relaxed">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Location: New Delhi, India</span>
            <span className="font-mono text-blue-600 font-semibold">Lead Author</span>
          </div>
        </section>

        {/* Faculty Mentor: Dr. Rajesh Sharma */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 text-cyan-400 flex items-center justify-center font-bold text-xl shadow-sm shrink-0 border border-slate-700">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                    Faculty Mentor & Scientific Advisor
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Dr. Rajesh Sharma
                  </h2>
                  <div className="text-xs sm:text-sm font-semibold text-blue-700 mt-0.5">
                    Head of Applied Sciences & Faculty Mentor
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Department of Science & Innovation, Delhi Public School, R.K. Puram</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Dr. Rajesh Sharma supervises student research at Delhi Public School, R.K. Puram, guiding students in rigorous scientific methodologies, experimental controls, error propagation analysis, and ethical lab bench instrumentation.
            </p>

            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Mentorship & Advisory Scope</span>
              </h3>
              <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-slate-700 space-y-2">
                <p>
                  <strong>Experimental Rigor:</strong> Guided the formulation of dry-versus-wet measured baseline trials and multi-trial repeatability matrices (N=80 trials).
                </p>
                <p>
                  <strong>Sensor Calibration:</strong> Supervised the 10-bit ADC voltage divider circuitry and comparator thresholding to minimize false alarms from ambient air humidity.
                </p>
                <p>
                  <strong>Scientific Honesty:</strong> Enforced strict boundary conditions — verifying that the sensor measures surface electrolytic contact, not a confirmed interior pipe burst, without proper contextual differential logic.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Faculty Advisor</span>
            <span className="font-mono text-slate-700 font-semibold">Institutional Mentor</span>
          </div>
        </section>
      </div>

      {/* 3. The Real School Problem in Affan’s Words */}
      <section className="bg-gradient-to-br from-blue-900 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-10 border border-blue-800 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Quote className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-mono text-cyan-300 font-semibold uppercase tracking-wider">
                In His Own Words
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                The Real School Problem Behind SEEPORA
              </h3>
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-blue-800/80 text-xs text-slate-300">
          <div>
            <strong>Affan Adil</strong> · Class 11, Delhi Public School, R.K. Puram
          </div>
          <div>
            Faculty Mentor: <strong>Dr. Rajesh Sharma</strong>, Head of Applied Sciences
          </div>
        </div>
      </section>

      {/* 4. Student Collaborators & Workgroup */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            STEM Club Collaborators
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Student Engineering Contributors
          </h3>
          <p className="text-xs text-slate-500">
            Fellow students at Delhi Public School, R.K. Puram, who assisted during laboratory rig assembly and data collection.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {collaborators.bio}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
            {collaborators.responsibilities.map((r, i) => (
              <div key={i} className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200/80">
                <span className="text-blue-600 font-mono font-bold text-xs mt-0.5">0{i+1}.</span>
                <span className="leading-relaxed">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Institutional Acknowledgments & Research Facilities */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-blue-600" />
          <span>Acknowledgments & Institutional Support</span>
        </h3>
        <ul className="space-y-2.5 text-xs text-slate-600">
          {ACKNOWLEDGMENTS.map((ack, i) => (
            <li key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span className="leading-relaxed">{ack}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 6. Quick Navigation to Project Evidence */}
      {onTabChange && (
        <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-blue-900">
              Explore the Project Evidence & Hardware
            </h4>
            <p className="text-xs text-blue-700 mt-0.5">
              Review the physical board, the ₹600 bill of materials, or the school riser pilot deployment plan.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onTabChange('hardware')}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
            >
              Hardware & Evidence
            </button>
            <button
              onClick={() => onTabChange('cost')}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 transition-colors cursor-pointer"
            >
              ₹600 Cost BOM
            </button>
            <button
              onClick={() => onTabChange('pilot')}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 transition-colors cursor-pointer"
            >
              School Pilot Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
