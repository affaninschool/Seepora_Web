import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Clock,
  Layers,
  Sparkles,
  Award,
  Droplet,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Beaker,
  ShieldAlert,
  ArrowRight,
  Volume2,
  FileText
} from 'lucide-react';
import { SeeporaLogo } from './SeeporaLogo';
import { PROJECT_METADATA } from '../data/projectData';
import { PageTab } from '../types';

interface TwoMinuteTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: PageTab) => void;
}

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  accent: string;
  badge: string;
  themeGradient: string;
  cardBg: string;
  metric: string;
  metricLabel: string;
  keyPoints: { icon: string; title: string; desc: string }[];
  speakerNote: string;
  visualType: 'problem' | 'physics' | 'hardware' | 'trials' | 'impact';
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    title: 'The Hidden School Riser Crisis',
    subtitle: 'Why a hairline crack went unnoticed behind a concrete wall for weeks',
    accent: 'from-rose-500 via-orange-500 to-amber-500',
    badge: 'SLIDE 01 · REAL-WORLD PROBLEM',
    themeGradient: 'from-slate-950 via-rose-950/60 to-slate-950',
    cardBg: 'bg-rose-950/40 border-rose-500/30 text-rose-200',
    metric: 'Thousands of Litres',
    metricLabel: 'Wasted into corridor foundations before detection',
    keyPoints: [
      {
        icon: 'droplet',
        title: 'Hidden Behind Concrete',
        desc: 'The school riser pipe runs along an exterior corridor wall. Pinhole leaks remain completely invisible to the eye.'
      },
      {
        icon: 'danger',
        title: 'Safety & Structural Hazard',
        desc: 'Algae growth made corridor stairs dangerously slick, while drywall bubbled and 2nd floor drinking coolers ran dry.'
      },
      {
        icon: 'alert',
        title: 'Acoustic Detectors Fail',
        desc: 'Traditional listening sticks and acoustic geophones cost lakhs of rupees and fail completely on plastic PVC/PEX pipes.'
      }
    ],
    speakerNote:
      'Affan noticed that when pipes leak in schools, sound gets dampened by PVC walls and ambient student chatter. We needed an ultra-low-cost sensor strip that catches moisture the second it touches the pipe invert.',
    visualType: 'problem'
  },
  {
    id: 2,
    title: 'The Core Physics: Direct Conductance',
    subtitle: 'Gravity guides leaking fluid directly to horizontal electrode traces',
    accent: 'from-cyan-400 via-blue-500 to-indigo-500',
    badge: 'SLIDE 02 · WORKING PRINCIPLE',
    themeGradient: 'from-slate-950 via-blue-950/60 to-slate-950',
    cardBg: 'bg-blue-950/40 border-cyan-500/30 text-cyan-200',
    metric: '1.4 Seconds',
    metricLabel: 'Average time for resistance to drop from >500kΩ to <15kΩ',
    keyPoints: [
      {
        icon: 'gravity',
        title: 'Gravity-Guided Invert Flow',
        desc: 'Any drop escaping from pipe joints or fissures naturally drips down the circumference to the bottom invert (6 o’clock).'
      },
      {
        icon: 'circuit',
        title: 'Interdigitated Conductive Grid',
        desc: 'Gold/nickel traces placed 1.2 mm apart bridge electrically upon water contact, causing an immediate ADC voltage plunge.'
      },
      {
        icon: 'check',
        title: '100% Acoustic Agnostic',
        desc: 'Zero reliance on sound vibration. Performs identically on PVC, HDPE, copper, ductile iron, and concrete.'
      }
    ],
    speakerNote:
      'Unlike microphones that struggle with traffic or recess noise, conductance is a physical law: water closes the circuit, dropping impedance from 500 kilo-ohms down to 15 kilo-ohms.',
    visualType: 'physics'
  },
  {
    id: 3,
    title: 'The ₹600 Low-Cost Node',
    subtitle: 'High precision engineering built within a high school student budget',
    accent: 'from-emerald-400 via-teal-500 to-cyan-500',
    badge: 'SLIDE 03 · HARDWARE ARCHITECTURE',
    themeGradient: 'from-slate-950 via-emerald-950/60 to-slate-950',
    cardBg: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200',
    metric: '₹600 / Joint',
    metricLabel: '98% cheaper than municipal acoustic data loggers (₹3,00,000+)',
    keyPoints: [
      {
        icon: 'board',
        title: 'FC-37 Interdigitated Strip (₹65)',
        desc: 'Weather-resistant FR-4 PCB with nickel-plated traces for high electrolytic sensitivity and corrosion resistance.'
      },
      {
        icon: 'chip',
        title: 'LM393 Comparator + ESP8266 (₹315)',
        desc: 'High-speed dual comparator for instant hardware interrupt + 10-bit SAR ADC controller for precision thresholding.'
      },
      {
        icon: 'power',
        title: 'Modular 5V Deployment (₹220)',
        desc: 'USB / regulated wall power with onboard passive buzzer and LED alert trigger.'
      }
    ],
    speakerNote:
      'Every single component in SEEPORA was itemised with real commercial pricing in New Delhi electronics markets, keeping a complete test rig node under ₹600.',
    visualType: 'hardware'
  },
  {
    id: 4,
    title: 'Empirical Lab Bench Evidence',
    subtitle: 'N=80 physical test trials verifying high detection and low false-alarms',
    accent: 'from-purple-400 via-fuchsia-500 to-pink-500',
    badge: 'SLIDE 04 · EXPERIMENTAL DATA',
    themeGradient: 'from-slate-950 via-purple-950/60 to-slate-950',
    cardBg: 'bg-purple-950/40 border-purple-500/30 text-purple-200',
    metric: '96.2%',
    metricLabel: 'Empirical detection rate across pressurized test iterations',
    keyPoints: [
      {
        icon: 'beaker',
        title: 'Dry vs. Wet ADC Baseline',
        desc: 'Dry ambient reading measures ADC raw 1023 (3.30V). 0.5 mL droplet drops raw reading to 142 (0.45V) in 1.4s.'
      },
      {
        icon: 'matrix',
        title: 'Multi-Position Matrix',
        desc: 'Tested at 6 o’clock invert, 12 o’clock crown, and pipe coupling flange with drip rates from 0.05 to 1.2 mL/s.'
      },
      {
        icon: 'shield',
        title: 'Honest Scientific Limitations',
        desc: 'The sensor registers surface wetness; protective weather hoods or dual-strip crown baselines are required for outdoor rain.'
      }
    ],
    speakerNote:
      'We conducted 80 trials under mentor Sandip Dutta. The lower invert strip caught 100% of underside drips. We also documented the limitation: external rain needs a protective shroud.',
    visualType: 'trials'
  },
  {
    id: 5,
    title: 'Campus Pilot & Seva First Mission',
    subtitle: 'Protecting 895 students and drinking infrastructure at Delhi Public School',
    accent: 'from-amber-400 via-orange-500 to-rose-500',
    badge: 'SLIDE 05 · SOCIAL SEVA & PILOT',
    themeGradient: 'from-slate-950 via-amber-950/60 to-slate-950',
    cardBg: 'bg-amber-950/40 border-amber-500/30 text-amber-200',
    metric: '895 Beneficiaries',
    metricLabel: 'Students, staff, and visitors served daily along the main corridor riser',
    keyPoints: [
      {
        icon: 'award',
        title: 'Seva First Innovation Entry',
        desc: 'Dedicated to community service (Seva) by eliminating potable water depletion in educational and healthcare institutions.'
      },
      {
        icon: 'school',
        title: 'DPS R.K. Puram Pilot Corridor',
        desc: 'Monitoring the 2.5-inch main PVC drinking riser feeding ground, 1st, and 2nd floor water cooler banks.'
      },
      {
        icon: 'future',
        title: 'Open Source Community Scaling',
        desc: 'Open hardware designs enabling schools worldwide to fabricate their own leak guards for less than the cost of a textbook.'
      }
    ],
    speakerNote:
      'SEEPORA embodies Seva First: practical, high-impact service that protects life, water, and school facilities before irreversible damage occurs.',
    visualType: 'impact'
  }
];

export const TwoMinuteTourModal: React.FC<TwoMinuteTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [demoMoisture, setDemoMoisture] = useState<number>(85); // For Slide 2 interactive demo

  const currentSlide = SLIDES[currentSlideIndex];

  // Auto-play timer (120 seconds total / 5 slides = ~24 seconds per slide, or faster for interactive tour)
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % SLIDES.length);
    }, 20000); // 20s per slide = 100-120s full tour

    return () => clearInterval(timer);
  }, [isOpen, isPlaying]);

  const handleNext = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-950/80 border-b border-slate-800 text-slate-300">
          <div className="flex items-center gap-2.5">
            <SeeporaLogo className="w-6 h-6 shrink-0" />
            <span className="font-bold tracking-tight text-white text-sm hidden sm:inline">
              SEEPORA Interactive 2-Minute Tour
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 font-mono border border-blue-500/30">
              Slide {currentSlideIndex + 1} of {SLIDES.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto Play toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              title={isPlaying ? 'Pause auto-play' : 'Resume auto-play'}
            >
              {isPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
              <span className="hidden sm:inline">{isPlaying ? 'Auto-Advancing' : 'Paused'}</span>
            </button>

            {/* Speaker Notes Toggle */}
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                showNotes ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Toggle presenter notes"
            >
              <FileText className="w-3 h-3" />
              <span className="hidden md:inline">Notes</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Progress Line */}
        <div className="w-full bg-slate-800 h-1">
          <div
            className={`h-full bg-gradient-to-r ${currentSlide.accent} transition-all duration-500`}
            style={{ width: `${((currentSlideIndex + 1) / SLIDES.length) * 100}%` }}
          />
        </div>

        {/* Main Slide Presentation Stage */}
        <div className={`relative flex-1 overflow-y-auto p-6 sm:p-10 bg-gradient-to-br ${currentSlide.themeGradient} transition-colors duration-700 text-white flex flex-col justify-between min-h-[440px]`}>
          {/* Slide Top Badge & Title */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-white/10 border border-white/20 backdrop-blur-md`}>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{currentSlide.badge}</span>
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>2-Min Overview Presentation</span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {currentSlide.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-1.5 max-w-3xl">
                {currentSlide.subtitle}
              </p>
            </div>
          </div>

          {/* Slide Middle: Content Grid + Interactive Illustration */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center">
            {/* Left 7 cols: Key Points */}
            <div className="lg:col-span-7 space-y-3">
              {currentSlide.keyPoints.map((pt, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-900/70 border border-white/10 backdrop-blur-md hover:border-white/20 transition-all space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentSlide.accent}`} />
                    <h4 className="text-sm font-bold text-white">{pt.title}</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-4">
                    {pt.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Right 5 cols: Highlight Box & Dynamic Visual */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Highlight Metric Card */}
              <div className={`p-6 rounded-2xl border backdrop-blur-md text-center shadow-lg ${currentSlide.cardBg}`}>
                <div className="text-xs uppercase tracking-wider font-mono font-bold opacity-80 mb-1">
                  Primary Research Metric
                </div>
                <div className={`text-3xl sm:text-4xl font-black font-mono tracking-tight bg-gradient-to-r ${currentSlide.accent} bg-clip-text text-transparent`}>
                  {currentSlide.metric}
                </div>
                <p className="text-xs font-medium mt-1.5 leading-snug">
                  {currentSlide.metricLabel}
                </p>
              </div>

              {/* Special interactive element per slide */}
              {currentSlide.visualType === 'physics' && (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs space-y-2">
                  <div className="flex justify-between items-center text-cyan-300 font-mono font-bold">
                    <span>Direct Conductance Simulation:</span>
                    <span>{demoMoisture > 50 ? 'WET (LEAK ACTIVE)' : 'DRY (SAFE)'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">Dry</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={demoMoisture}
                      onChange={(e) => setDemoMoisture(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <span className="text-[10px] text-slate-400">Wet</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-300 pt-1">
                    <span>Impedance: {demoMoisture > 50 ? '14.2 kΩ' : '520.0 kΩ'}</span>
                    <span>ADC: {demoMoisture > 50 ? '142 (0.45V)' : '1023 (3.30V)'}</span>
                  </div>
                </div>
              )}

              {currentSlide.visualType === 'trials' && (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-500/30 text-xs space-y-1.5 text-center">
                  <span className="text-[11px] font-mono text-purple-300 font-bold uppercase">
                    Confusion Matrix Summary
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                    <div className="p-2 bg-emerald-950/60 rounded border border-emerald-500/40 text-emerald-300">
                      TP: 77/80 (96.2%)
                    </div>
                    <div className="p-2 bg-slate-800 rounded border border-slate-700 text-slate-300">
                      TN: Safe Crown
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('research');
                    }}
                    className="w-full mt-2 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View Full 80-Trial Research Matrix</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {currentSlide.visualType === 'impact' && (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs space-y-2 text-center">
                  <div className="inline-flex items-center gap-1 text-amber-300 font-semibold font-mono text-[11px]">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Seva First Innovation Challenge</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Created by high school student Affan Adil under the mentorship of Sandip Dutta at Delhi Public School, R.K. Puram.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('research');
                    }}
                    className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <span>Explore Comprehensive Research Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Presenter Notes Box (Toggleable) */}
          {showNotes && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950/90 border border-cyan-500/40 text-xs text-cyan-100 font-sans leading-relaxed animate-in fade-in duration-150 flex items-start gap-3">
              <Volume2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-300 uppercase tracking-wider font-mono text-[10px] block mb-0.5">
                  Presenter Voiceover / Note:
                </strong>
                {currentSlide.speakerNote}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Slide Navigation Bar & Thumbnails */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Thumbnails dots / numbers */}
          <div className="flex items-center gap-2">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(index)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  currentSlideIndex === index
                    ? `bg-gradient-to-r ${slide.accent} text-white shadow-md scale-105`
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>0{slide.id}</span>
                <span className="hidden md:inline text-[11px] font-normal truncate max-w-[90px]">
                  {slide.title.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer disabled:opacity-50"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono text-slate-400">
              {currentSlideIndex + 1} / {SLIDES.length}
            </span>
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              aria-label="Next slide"
            >
              <span>{currentSlideIndex === SLIDES.length - 1 ? 'Restart Tour' : 'Next Slide'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
