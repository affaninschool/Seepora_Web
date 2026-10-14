export type PageTab =
  | 'home'
  | 'hardware'
  | 'cost'
  | 'pilot'
  | 'lab'
  | 'dashboard'
  | 'research'
  | 'about'
  | 'how-it-works'
  | 'team';

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

export interface CostItem {
  id: number;
  component: string;
  specification: string;
  qty: number;
  unitPriceInr: number;
  subtotalInr: number;
  purpose: string;
}

export interface MeasuredReading {
  condition: string;
  liquidVolumeMl: number;
  adcRaw: number; // 0 - 1023
  sensorVoltage: number; // Volts
  resistanceKOhms: number;
  detectionLatencySec: string;
  alertTriggered: boolean;
  notes: string;
}

export interface PlannedTrial {
  trialId: string;
  leakPosition: string;
  dripRateMlSec: number;
  trialsRun: number;
  detectedCount: number;
  detectionRatePercent: number;
  falseAlarmRatePercent: number;
  meanDetectionTimeSec: number;
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
