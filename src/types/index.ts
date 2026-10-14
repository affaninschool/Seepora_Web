export type PageTab = 'home' | 'how-it-works' | 'dashboard' | 'lab' | 'research' | 'team';

export interface TelemetryPoint {
  timestamp: string;
  timeSec: number;
  resistanceKiloOhms: number;
  voltageVolts: number;
  moisturePercent: number;
  status: 'NOMINAL' | 'MOISTURE_DETECTED' | 'ACTIVE_LEAK' | 'CRITICAL_BURST';
}

export interface IncidentEvent {
  id: string;
  timestamp: string;
  type: 'WARNING' | 'ALERT' | 'INFO' | 'RECOVERY';
  zone: string;
  resistance: number;
  description: string;
  source: 'SIMULATED' | 'HARDWARE';
}

export interface SimulationParams {
  flowRate: number; // L/min (0 - 100)
  pressure: number; // bar (0.5 - 8.0)
  crackSize: number; // micrometers (0 - 500)
  externalRain: number; // % (0 - 100)
  stripGain: number; // multiplier (0.5 - 2.0)
  sensorPosition: 'bottom' | 'top' | 'dual';
}

export interface SimulationResult {
  leakRateLPerHour: number;
  accumulatedWaterMl: number;
  stripWettingPercent: number;
  electricalResistanceKOhms: number;
  sensorVoltage: number;
  conductanceMicroSiemens: number;
  classification: 'NOMINAL' | 'INTERNAL_LEAK' | 'RAIN_EXPOSURE' | 'CRITICAL_FAILURE';
  confidenceScore: number;
  topStripResistanceKOhms?: number;
  differentialAnalysis: string;
}

export interface ResearchProblem {
  id: number;
  title: string;
  metric: string;
  metricLabel: string;
  category: string;
  description: string;
  mechanism: string;
  seeporaSolution: string;
}

export interface AcademicReference {
  citation: string;
  source: string;
  year: number;
  doiOrUrl: string;
  keyFinding: string;
}
