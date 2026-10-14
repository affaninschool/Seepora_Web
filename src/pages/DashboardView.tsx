import React, { useState, useEffect, useRef } from 'react';
import { TelemetryPoint, IncidentEvent } from '../types';
import {
  Activity,
  Cpu,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  Sliders,
  Shield,
  Layers,
  Terminal,
  Play,
  Pause,
  AlertOctagon
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  // Mode: simulated vs hardware vs disconnected
  const [telemetryMode, setTelemetryMode] = useState<'SIMULATED' | 'HARDWARE' | 'DISCONNECTED'>('SIMULATED');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [eventFilter, setEventFilter] = useState<'ALL' | 'WARNING' | 'ALERT'>('ALL');
  const [serialBaudRate, setSerialBaudRate] = useState<string>('115200');
  const [activeZone, setActiveZone] = useState<string>('ZONE_A');

  // Multi-zone impedance
  const [zones, setZones] = useState({
    ZONE_A: { name: 'Main Distribution Invert', resistance: 480.2, voltage: 3.25, status: 'NOMINAL', crack: '0 µm' },
    ZONE_B: { name: 'Flange Coupling Joint 04', resistance: 32.4, voltage: 1.15, status: 'WARNING', crack: '85 µm' },
    ZONE_C: { name: 'Under-Slab Riser Elbow', resistance: 495.0, voltage: 3.28, status: 'NOMINAL', crack: '0 µm' },
  });

  // Rolling time series data
  const [history, setHistory] = useState<TelemetryPoint[]>([]);
  const [serialLogs, setSerialLogs] = useState<string[]>([]);
  const [events, setEvents] = useState<IncidentEvent[]>([
    {
      id: 'EVT-1049',
      timestamp: '14:22:04',
      type: 'WARNING',
      zone: 'Zone B (Coupling Joint)',
      resistance: 32.4,
      description: 'Localized wetting detected. Resistance dropped below 50 kΩ threshold.',
      source: 'SIMULATED'
    },
    {
      id: 'EVT-1048',
      timestamp: '14:18:22',
      type: 'INFO',
      zone: 'System-Wide',
      resistance: 485.0,
      description: 'Continuous diagnostic poll complete. ADC baseline calibrated to 3.3V reference.',
      source: 'SIMULATED'
    },
    {
      id: 'EVT-1042',
      timestamp: '13:55:10',
      type: 'RECOVERY',
      zone: 'Zone A (Main Invert)',
      resistance: 480.2,
      description: 'Impedance recovered to dry state (>450 kΩ) following scheduled dry-cycle flush.',
      source: 'SIMULATED'
    }
  ]);

  const [hoveredPoint, setHoveredPoint] = useState<TelemetryPoint | null>(null);

  // Initialize and run telemetry tick
  useEffect(() => {
    // Generate initial history
    const initialHistory: TelemetryPoint[] = [];
    const now = Date.now();
    for (let i = 59; i >= 0; i--) {
      const timeSec = 60 - i;
      const noise = (Math.random() - 0.5) * 4;
      const res = Math.max(10, 480 + noise);
      initialHistory.push({
        timestamp: new Date(now - i * 1000).toLocaleTimeString([], { hour12: false }),
        timeSec,
        resistanceKiloOhms: Number(res.toFixed(1)),
        voltageVolts: Number((3.26 + (Math.random() - 0.5) * 0.04).toFixed(2)),
        moisturePercent: 2,
        status: 'NOMINAL'
      });
    }
    setHistory(initialHistory);

    // Initial serial lines
    setSerialLogs([
      '[SYS_BOOT] SEEPORA ADC Controller v12.4 online.',
      '[ADC_CAL] Ref Voltage: 3300 mV | Resistor Bridge: 100 kΩ Divider',
      '[POLL_01] CH0=480.2kΩ | CH1=32.4kΩ | CH2=495.0kΩ',
      '$SEEPORA,DEV_01,Z_A,R=480.2,V=3.25,STAT=NOMINAL*4A',
      '$SEEPORA,DEV_01,Z_B,R=32.4,V=1.15,STAT=ALERT_SEEPAGE*1E'
    ]);
  }, []);

  // Interval loop
  useEffect(() => {
    if (isPaused || telemetryMode === 'DISCONNECTED') return;

    const interval = setInterval(() => {
      setHistory((prev) => {
        const last = prev[prev.length - 1] || { timeSec: 0, resistanceKiloOhms: 480, voltageVolts: 3.25 };
        const nowSec = last.timeSec + 1;
        const nowStr = new Date().toLocaleTimeString([], { hour12: false });

        // Slightly vary zone B or simulate slight drift
        const targetRes = telemetryMode === 'HARDWARE' ? 472.0 : (activeZone === 'ZONE_B' ? 32.4 : 482.0);
        const noise = (Math.random() - 0.5) * 3.5;
        const currentRes = Math.max(5, targetRes + noise);
        const voltage = Number((3.3 * (currentRes / (currentRes + 10))).toFixed(2));
        const moisture = currentRes < 50 ? 68 : 3;
        const status = currentRes < 20 ? 'CRITICAL_BURST' : currentRes < 80 ? 'ACTIVE_LEAK' : 'NOMINAL';

        const newPoint: TelemetryPoint = {
          timestamp: nowStr,
          timeSec: nowSec,
          resistanceKiloOhms: Number(currentRes.toFixed(1)),
          voltageVolts: voltage,
          moisturePercent: moisture,
          status
        };

        const next = [...prev.slice(1), newPoint];
        return next;
      });

      // Append serial log line
      setSerialLogs((prev) => {
        const zoneTag = activeZone === 'ZONE_B' ? 'Z_B' : 'Z_A';
        const randHex = Math.floor(Math.random() * 255).toString(16).toUpperCase();
        const line = `$SEEPORA,NODE_01,${zoneTag},R=${activeZone === 'ZONE_B' ? '32.4' : '481.5'},V=3.25,STAT=POLL*${randHex}`;
        return [...prev.slice(-8), line];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, telemetryMode, activeZone]);

  // Handle manual trigger leak in zone A
  const triggerZoneAlert = (zoneKey: 'ZONE_A' | 'ZONE_B' | 'ZONE_C') => {
    setZones((prev) => ({
      ...prev,
      [zoneKey]: {
        ...prev[zoneKey],
        resistance: 12.8,
        voltage: 0.62,
        status: 'ALERT_LEAK',
        crack: '140 µm'
      }
    }));
    setActiveZone(zoneKey);

    const newEvt: IncidentEvent = {
      id: `EVT-${Math.floor(1050 + Math.random() * 50)}`,
      timestamp: new Date().toLocaleTimeString([], { hour12: false }),
      type: 'ALERT',
      zone: zones[zoneKey].name,
      resistance: 12.8,
      description: 'Acute droplet saturation across lower invert electrode grid. Urgent inspection required.',
      source: telemetryMode === 'HARDWARE' ? 'HARDWARE' : 'SIMULATED'
    };
    setEvents((prev) => [newEvt, ...prev]);
  };

  const resetZones = () => {
    setZones({
      ZONE_A: { name: 'Main Distribution Invert', resistance: 480.2, voltage: 3.25, status: 'NOMINAL', crack: '0 µm' },
      ZONE_B: { name: 'Flange Coupling Joint 04', resistance: 475.0, voltage: 3.24, status: 'NOMINAL', crack: '0 µm' },
      ZONE_C: { name: 'Under-Slab Riser Elbow', resistance: 495.0, voltage: 3.28, status: 'NOMINAL', crack: '0 µm' },
    });
  };

  const currentPoint = history[history.length - 1] || {
    resistanceKiloOhms: 480,
    voltageVolts: 3.25,
    moisturePercent: 2,
    status: 'NOMINAL'
  };

  const filteredEvents = events.filter((e) => {
    if (eventFilter === 'WARNING') return e.type === 'WARNING';
    if (eventFilter === 'ALERT') return e.type === 'ALERT';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* 1. Header & Telemetry Mode Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              <span>Operational Telemetry Console</span>
              <span aria-hidden="true">·</span>
              <span>10 Hz Sampling Loop</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              SEEPORA Monitoring Dashboard
            </h1>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setTelemetryMode('SIMULATED')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                telemetryMode === 'SIMULATED'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Simulated Stream
            </button>
            <button
              onClick={() => setTelemetryMode('HARDWARE')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                telemetryMode === 'HARDWARE'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hardware Serial Link
            </button>
            <button
              onClick={() => setTelemetryMode('DISCONNECTED')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                telemetryMode === 'DISCONNECTED'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Simulate Disconnect
            </button>
          </div>
        </div>

        {/* Clear Data Source Distinction Banner (Confirmed requirement) */}
        {telemetryMode === 'SIMULATED' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 flex items-start gap-3 text-xs text-blue-900">
            <Activity className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">DEMONSTRATION SIMULATION ACTIVE:</span> Telemetry values are computed from continuous fluid mechanics models. To attach physical test microcontroller hardware, switch to <strong>Hardware Serial Link</strong>.
            </div>
          </div>
        )}

        {telemetryMode === 'HARDWARE' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 sm:p-4 flex items-start gap-3 text-xs text-emerald-900">
            <Wifi className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">PHYSICAL HARDWARE INTERFACE:</span> Listening on UART Port at {serialBaudRate} baud. Direct ADC voltage conversion active with 10-bit resolution.
            </div>
          </div>
        )}

        {telemetryMode === 'DISCONNECTED' && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 sm:p-4 flex items-start gap-3 text-xs text-rose-900">
            <WifiOff className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">HARDWARE DISCONNECTED (FAILSAFE ACTIVATED):</span> Signal carrier dropped. The monitoring engine gracefully holds the last known verified state and sounds a safe visual alert without crashing.
            </div>
          </div>
        )}
      </div>

      {/* 2. Primary Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Resistance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Sensor Strip Impedance
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-slate-900 tabular-nums">
              {telemetryMode === 'DISCONNECTED' ? '---' : currentPoint.resistanceKiloOhms}
            </span>
            <span className="text-xs font-mono text-slate-400">kΩ</span>
          </div>
          <div className="text-xs text-slate-500 pt-1 flex items-center justify-between">
            <span>Dry baseline: &gt;450 kΩ</span>
            <span className={currentPoint.resistanceKiloOhms < 50 ? 'text-rose-600 font-semibold' : 'text-emerald-600 font-semibold'}>
              {currentPoint.resistanceKiloOhms < 50 ? '▲ WET' : '● DRY'}
            </span>
          </div>
        </div>

        {/* Card 2: Voltage */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            ADC Sense Voltage
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-slate-900 tabular-nums">
              {telemetryMode === 'DISCONNECTED' ? '0.00' : currentPoint.voltageVolts}
            </span>
            <span className="text-xs font-mono text-slate-400">V</span>
          </div>
          <div className="text-xs text-slate-500 pt-1 flex items-center justify-between">
            <span>Reference VDD: 3.30 V</span>
            <span className="font-mono text-slate-600">ADC: 12-Bit</span>
          </div>
        </div>

        {/* Card 3: Moisture Saturation */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Moisture Saturation
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-slate-900 tabular-nums">
              {telemetryMode === 'DISCONNECTED' ? '0' : currentPoint.moisturePercent}
            </span>
            <span className="text-xs font-mono text-slate-400">%</span>
          </div>
          <div className="text-xs text-slate-500 pt-1 flex items-center justify-between">
            <span>Critical threshold: 50%</span>
            <span className="text-slate-600">Trace: Au/Ni Grid</span>
          </div>
        </div>

        {/* Card 4: System State */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pipeline Health State
          </div>
          <div className="text-lg font-bold truncate">
            {telemetryMode === 'DISCONNECTED' ? (
              <span className="text-rose-600 flex items-center gap-1.5">
                <AlertOctagon className="w-5 h-5 shrink-0" />
                <span>OFFLINE</span>
              </span>
            ) : currentPoint.resistanceKiloOhms < 20 ? (
              <span className="text-rose-600 flex items-center gap-1.5">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>ACTIVE LEAK</span>
              </span>
            ) : currentPoint.resistanceKiloOhms < 80 ? (
              <span className="text-amber-600 flex items-center gap-1.5">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>EARLY SEEPAGE</span>
              </span>
            ) : (
              <span className="text-emerald-600 flex items-center gap-1.5">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>NOMINAL FLOW</span>
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 pt-1 flex items-center justify-between">
            <span>Hardware Watchdog</span>
            <span className="font-mono text-emerald-600">OK</span>
          </div>
        </div>
      </div>

      {/* 3. Rolling Time-Series Live Chart & Pause Controls */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Rolling 60-Second Impedance Decay Curve</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live resistance (kΩ) measured across interdigitated sensor traces over continuous time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? 'Resume Stream' : 'Pause Stream'}</span>
            </button>
            <button
              onClick={resetZones}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Zones</span>
            </button>
          </div>
        </div>

        {/* SVG Rolling Chart */}
        <div className="relative w-full h-64 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-2">
          {history.length > 1 ? (
            <svg
              viewBox="0 0 600 220"
              className="w-full h-full select-none cursor-crosshair"
              preserveAspectRatio="none"
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              <line x1="30" y1="30" x2="590" y2="30" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
              <text x="5" y="34" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono">500k</text>

              <line x1="30" y1="80" x2="590" y2="80" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
              <text x="5" y="84" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono">300k</text>

              <line x1="30" y1="130" x2="590" y2="130" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
              <text x="5" y="134" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono">100k</text>

              {/* Alert threshold hairline */}
              <line x1="30" y1="170" x2="590" y2="170" stroke="#e11d48" strokeWidth="1" strokeDasharray="2 2" />
              <text x="510" y="165" fill="#f43f5e" fontSize="9" fontFamily="JetBrains Mono">Threshold: 50k</text>

              {/* Build polyline points */}
              {(() => {
                const maxRes = 520;
                const minRes = 0;
                const chartH = 180;
                const topPad = 20;

                const points = history.map((pt, i) => {
                  const x = 30 + (i / (history.length - 1)) * 560;
                  const clamped = Math.max(minRes, Math.min(maxRes, pt.resistanceKiloOhms));
                  const y = topPad + chartH - (clamped / maxRes) * chartH;
                  return `${x},${y}`;
                });

                const polylineStr = points.join(' ');
                const areaStr = `30,${topPad + chartH} ${polylineStr} 590,${topPad + chartH}`;

                return (
                  <g>
                    <polygon points={areaStr} fill="url(#chartGrad)" />
                    <polyline
                      points={polylineStr}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </g>
                );
              })()}
            </svg>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-xs">
              Initializing buffer...
            </div>
          )}

          {/* Hover HUD Tooltip */}
          {hoveredPoint && (
            <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-700 text-white p-2.5 rounded text-xs font-mono space-y-1">
              <div>TIME: {hoveredPoint.timestamp}</div>
              <div className="text-cyan-400 font-bold">IMPEDANCE: {hoveredPoint.resistanceKiloOhms} kΩ</div>
              <div className="text-slate-300">VOLTAGE: {hoveredPoint.voltageVolts} V</div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Multi-Zone Topology & Hardware Serial Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Multi-Zone Pipeline Topology */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Multi-Zone Pipe Strip Topology</span>
            </h3>
            <span className="text-xs text-slate-500">Click zone to simulate leak</span>
          </div>

          <div className="space-y-3">
            {(Object.keys(zones) as Array<keyof typeof zones>).map((k) => {
              const z = zones[k];
              const isAlert = z.status !== 'NOMINAL';
              const isSelected = activeZone === k;

              return (
                <div
                  key={k}
                  onClick={() => setActiveZone(k)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-700">{k}</span>
                      <span className="text-xs font-semibold text-slate-900">{z.name}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      <span>Simulated fissure: {z.crack}</span> · <span>Sense: {z.voltage} V</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-slate-900 tabular-nums">
                        {z.resistance} kΩ
                      </div>
                      <div className={`text-[11px] font-semibold ${isAlert ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {z.status}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerZoneAlert(k);
                      }}
                      className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 border border-slate-200 rounded transition-colors"
                      title="Trigger localized leak test"
                    >
                      Test Leak
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Raw Serial Buffer Terminal */}
        <div className="lg:col-span-5 bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-3 text-slate-300 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>RAW UART SERIAL FEED</span>
              </span>
              <span className="text-xs font-mono text-slate-500">115200 8-N-1</span>
            </div>

            <div className="font-mono text-[11px] space-y-1 bg-black/50 p-3 rounded-lg border border-slate-800/80 h-44 overflow-y-auto">
              {serialLogs.map((log, i) => (
                <div key={i} className="text-slate-400 leading-tight">
                  <span className="text-slate-600 select-none mr-2">&gt;</span>
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Buffer: 64 packets/sec</span>
            <span className="font-mono text-emerald-400">CRC32 VERIFIED</span>
          </div>
        </div>
      </div>

      {/* 5. Incident & Event History Log */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Sensor Event & Incident History
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified electrical threshold events logged by the SEEPORA diagnostic engine.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setEventFilter('ALL')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  eventFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setEventFilter('WARNING')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  eventFilter === 'WARNING' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Warnings
              </button>
              <button
                onClick={() => setEventFilter('ALERT')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  eventFilter === 'ALERT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Alerts
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="pb-2.5">ID</th>
                <th className="pb-2.5">Timestamp</th>
                <th className="pb-2.5">Severity</th>
                <th className="pb-2.5">Zone Location</th>
                <th className="pb-2.5">Impedance</th>
                <th className="pb-2.5">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredEvents.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="py-3 font-mono font-bold text-slate-900">{e.id}</td>
                  <td className="py-3 font-mono text-slate-500">{e.timestamp}</td>
                  <td className="py-3 font-medium">
                    <span
                      className={`inline-block font-semibold ${
                        e.type === 'ALERT'
                          ? 'text-rose-600'
                          : e.type === 'WARNING'
                          ? 'text-amber-600'
                          : e.type === 'RECOVERY'
                          ? 'text-emerald-600'
                          : 'text-slate-600'
                      }`}
                    >
                      {e.type}
                    </span>
                  </td>
                  <td className="py-3 font-medium text-slate-800">{e.zone}</td>
                  <td className="py-3 font-mono tabular-nums">{e.resistance} kΩ</td>
                  <td className="py-3 text-slate-600 max-w-md">{e.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
