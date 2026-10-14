# SEEPORA — Smart Water Pipeline Leakage Detection Platform

SEEPORA is an engineering research project exploring a horizontal sensor-strip approach to detecting external water seepage and pipeline integrity breaches. This plan outlines the architecture, scientific user experience, and interactive simulation laboratory for the production web platform.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and design parameters have been confirmed based on user feedback and engineering specifications:

- **Confirmed Aesthetic Direction**: Clean academic light theme with scientific styling (`#FFFFFF` background, `#F8FAFC` panel surfaces, crisp hairline borders, deep slate `#0F172A` typography, and clinical cobalt/cyan telemetry accents).
- **Confirmed Interactive Lab Scope**: Multi-scenario interactive test bench comparing normal pipeline flow, genuine pipe micro-fracture leakage, and environmental rain/moisture exposure with real-time conductance and resistance curves.
- **Confirmed Hardware & Data Architecture**: Dual-mode telemetry architecture supporting both realistic live time-series simulation and hardware interface connectivity with graceful disconnected-state handling.
- **Sensor Concept Rigor**: Exclusively models the current rainwater-sensor strip approach positioned horizontally along pipes, strictly avoiding the obsolete VibraTrace acoustic/vibration method and avoiding unverified claims.

---

## 1. Overview & Core Concept

- **What It Does**: SEEPORA provides an end-to-end digital twin and research presentation for smart pipeline leakage monitoring. It educates visitors on water distribution loss, visualizes strip-based sensor conductance physics, provides an operational monitoring console with event classification, and offers an interactive virtual test bench.
- **Target Audience**: Water resource engineers, civil infrastructure researchers, municipal pipeline inspectors, academic evaluators, and environmental engineering students.
- **Key Value**: Bridges the gap between academic civil engineering and real-time sensor instrumentation by providing tangible, interactive demonstration of surface-mounted conductive leakage detection versus environmental false positives.

---

## 2. User Experience & Visual Design

### Key User Flows & Section Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Top Navigation Bar (3-Zone Contract)                  │
│ [SEEPORA] ────── [Home · How It Works · Dashboard · Lab · Research · Team] ─ [Launch Lab]
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
        ┌──────────────┬───────────────┼───────────────┬──────────────┐
        ▼              ▼               ▼               ▼              ▼
   ┌─────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐  ┌───────────┐
   │  Home   │   │How It Work│   │ Dashboard │   │  Lab Bench│  │ Research  │
   │Overview │   │Engineering│   │ Live Tele-│   │Multi-scene│  │ 7 Problems│
   │& Highlights│ │Diagrams   │   │ metry Hub │   │Simulation │  │& Citations│
   └─────────┘   └───────────┘   └───────────┘   └───────────┘  └───────────┘
```

1. **Home Experience**:
   - Hero split layout featuring the bold headline *"Detect Leaks. Protect Every Drop."* with a scientific cross-section pipeline illustration.
   - Core problem statement detailing non-revenue water (NRW) loss and infrastructure decay.
   - Direct CTA pathways into the Interactive Lab and Monitoring Dashboard.
   - Research highlights and an executive team preview showcasing Affan Adil.

2. **How It Works (Engineering Principles)**:
   - Animated SVG cutaway diagram illustrating the horizontal sensor strip affixed along the lower invert and crown of the pipeline.
   - Step-by-step physical breakdown: Fluid breach -> Surface capillary seepage -> Trace grid conductivity change -> ADC conversion -> Threshold & classification algorithm.
   - Explicit scientific discussion of engineering constraints and trade-offs (e.g., surface-only detection, grounding, ambient humidity compensation, long-term adhesive wear).

3. **Dashboard (Operational Telemetry Console)**:
   - Top status ribbon: Sensor node status, signal stability, data source flag (`SIMULATED TRIAL` vs `HARDWARE CONNECTED`), and system health.
   - Hardware connection module: Web Serial / Mock stream connector allowing simulated hardware link, mock dropouts, and serial buffer inspect.
   - Time-series resistance (kΩ) and conductance (μS) charts with rolling 60-second window.
   - Incident event log with event severity, timestamped trigger, and confidence score.

4. **Interactive Lab (Virtual Test Bench)**:
   - Standout feature with split console: Left parameter control deck (Flow rate in L/min, internal pressure in bar, crack width in μm, external rainfall in mm/h, and sensor gain).
   - Center visual canvas: High-fidelity interactive SVG pipeline rig with animated laminar flow, droplet percolation, and strip contact points.
   - Right diagnostic telemetry: Dynamic impedance response curve, state classifier (Normal Flow, In-situ Seepage, External Rain Washout), and differential comparison matrix.
   - Instant scenario presets (`Baseline Normal`, `Hairline Seepage`, `Heavy Torrential Rain`, `Burst Catastrophe`) with full reset.

5. **Research & 7 Global Problems**:
   - The 7 fundamental pipeline challenges presented as structured scientific inquiry cards:
     1. Water wastage & non-revenue water loss.
     2. Structural & building foundation undermining.
     3. Soil erosion, sinkholes, and ground destabilization.
     4. Compounding municipal repair costs & billing losses.
     5. Sub-surface dampness and hazardous mould proliferation.
     6. Critical water-supply disruptions and pressure collapse.
     7. Diagnostic difficulty of detecting subterranean non-acoustic leaks.
   - Formal research methodology, experimental scope, and verified academic references (AWWA, EPA, WHO, UNESCO IHP).

6. **Team Seepora**:
   - Researcher spotlight for Affan Adil (Systems & Instrumentation Lead).
   - Engineering roles breakdown (Hardware Prototype, Sensor Array Calibration, Embedded Logic, Hydrodynamic Testing).
   - Institutional acknowledgements, lab facilities, and academic mentorship disclosures.

### Visual Identity & Theme Guidelines
- **Palette**:
  - 60% Canvas: `#FFFFFF` pristine white and `#F8FAFC` clean lab slate.
  - 30% Structural Surfaces: `#F1F5F9` panels with 1px hairline `#E2E8F0` borders.
  - 10% Telemetry Accents: Scientific cobalt `#1E40AF` / `#2563EB`, precision laser cyan `#0284C7`, and warning amber `#D97706`.
- **Typography**:
  - Display & Headings: `Plus Jakarta Sans` with balanced line wraps.
  - Body Prose: Clean, legible neutral sans (`Plus Jakarta Sans` / `system-ui`).
  - Metrics & Data: Monospace tabular numerals (`font-mono tabular-nums`).
- **Anti-Slop Discipline**:
  - Zero static pill badges; metadata rendered as unboxed text separated by `·`.
  - Zero mechanical code comments (`// 01`) or fake version buzzwords.
  - Single-elevation flat panels with crisp hairline borders.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side Digital Twin Engine for the Lab**:
  - *Chosen Approach*: Pure mathematical state model computed in React state and requestAnimationFrame loops.
  - *Why*: Delivers instantaneous 60fps responsive control feedback without network latency or server overhead.
  - *Alternatives Considered*: Server-side physics simulation (unnecessary latency and fragility in browser).

- **Decision 2: Clear Simulation vs Hardware Demarcation**:
  - *Chosen Approach*: Prominent visual telemetry ribbon and data source banners explicitly flagging synthetic demo runs vs connected serial hardware.
  - *Why*: Ensures strict scientific honesty, preventing users or evaluators from mistaking synthetic test curves for unverified physical laboratory data.

- **Decision 3: Sensor Strip Geometry (Horizontal vs Circumferential)**:
  - *Chosen Approach*: Accurately render and explain horizontal strips along pipe joints and gravity inverts, highlighting gravity-driven droplet accumulation.
  - *Why*: Faithfully reflects the Seepora design concept while providing an engineering rationale for false positive mitigation.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SEEPORA Application Root                          │
│                                (src/App.tsx)                                │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
┌──────────────┐             ┌───────────────────┐          ┌───────────────────┐
│ Router & Nav │             │  Hardware State   │          │ Simulation Engine │
│ 6 Page Views │             │  (Sim vs Serial)  │          │ (Physics & Curves)│
└───────┬──────┘             └─────────┬─────────┘          └─────────┬─────────┘
        │                              │                              │
        ├─ HomeView                    ├─ Web Serial Port Buffer      ├─ Pressure Loss Model
        ├─ HowItWorksView              ├─ Noise Generator             ├─ Capillary Seepage
        ├─ DashboardView ──────────────┼─ Disconnect Event Handler    ├─ Resistance Curve
        ├─ InteractiveLabView ─────────┴──────────────────────────────┴─ Classifier Matrix
        ├─ ResearchView
        └─ TeamView
```

### Component Hierarchy & Handlers

1. **Navigation (`Navbar.tsx`)**:
   - Implements the strict 3-Zone Top Bar contract: Brand wordmark, 6 navigation tabs with active indicator, and primary action (`Launch Lab`).
   - Mobile responsive drawer with accessible focus-trap and single-line links.

2. **Simulation Model (`useSimulation.ts`)**:
   - Inputs: `flowRate` (0-100 L/min), `pressure` (0.5-8.0 bar), `crackSize` (0-500 μm), `externalMoisture` (0-100%), `stripSensitivity` (0.1-1.0).
   - Computations:
     - Leak flow rate $Q_{\text{leak}} \propto \text{crackSize} \cdot \sqrt{\text{pressure}}$.
     - Sensor strip moisture wetting fraction $W = f(Q_{\text{leak}}, \text{externalMoisture})$.
     - Electrical resistance $R(\text{k}\Omega) = R_{\text{dry}} / (1 + k \cdot W)$.
     - Output classification: `NOMINAL`, `INTERNAL_SEEPAGE_ALERT`, `ENVIRONMENTAL_RAIN`, `CRITICAL_BURST`.

3. **Telemetry Dashboard Components (`DashboardView.tsx`)**:
   - Multi-channel time-series canvas chart (Resistance and Sensor Voltage).
   - Status indicators with clear semantic text labels and non-color-only cues.
   - Hardware connection drawer allowing users to switch between mock simulation, offline test, and Web Serial connection.

4. **Lab Bench (`InteractiveLabView.tsx`)**:
   - Parameter slider bank with numeric steppers and keyboard accessibility.
   - SVG Interactive Rig with cutaway pipe, fluid animation, fracture point, droplet particles, and conductive strip traces.
   - Scenario preset buttons with instant diagnostic readout comparison.

---

## 5. Verification & Quality Plan

- Compile and type-check with `npm run build` / `compile_applet`.
- Silent pre-flight check against frontend-design checklist (Zero-pill metadata, single-line controls, WCAG AA contrast, no decorative comment headers).
- Validation that all 6 navigation targets render complete, rich, fully functional views with zero placeholder content.
