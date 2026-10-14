import { CostItem, MeasuredReading, PlannedTrial } from '../types';

export const PROJECT_METADATA = {
  name: 'SEEPORA',
  tagline: 'Detect Leaks. Protect Every Drop.',
  oneSentenceSummary:
    'SEEPORA is a low-cost, surface-mounted rainwater sensor-strip system designed to detect localized water pipe leaks in schools and community buildings before drinking water is wasted or structural walls are damaged.',
  statusLine: 'Prototype in progress; simulation is illustrative. Physical bench trials underway.',
  challengeName: 'Seva First Innovation Challenge',
  challengeBadge: 'Seva First Innovation Challenge Entry',
  author: {
    name: 'Affan Adil',
    role: 'Student Innovator & Project Lead',
    school: 'Delhi Public School, R.K. Puram',
    grade: 'Class 11, Science & Engineering Stream',
    location: 'New Delhi, India',
    quote:
      'In our school, the main riser pipe feeding the drinking water coolers and washrooms runs along the outer brick corridor wall. One semester, a joint hairline crack went unnoticed behind a concrete pillar for weeks. We only realized it when the corridor floor became dangerously slick with green algae, the wall paint bubbled with mould, and the second-floor water cooler ran dry during peak recess. Thousands of liters of purified drinking water were wasted into the ground. Traditional acoustic leak detectors cost lakhs of rupees that our school cannot afford, and plastic pipes muffle sound anyway. That inspired me to build SEEPORA: a simple, affordable sensor strip that catches the first drop the moment it seeps out.'
  },
  mentor: {
    name: 'Dr. Rajesh Sharma',
    title: 'Head of Applied Sciences & Faculty Mentor',
    institution: 'Department of Science & Innovation, Delhi Public School',
    roleDescription: 'Advisory guidance on circuit breadboarding, physical measurement protocols, and experimental error analysis.'
  }
};

export const COST_ITEMS: CostItem[] = [
  {
    id: 1,
    component: 'FC-37 Rainwater Sensor Strip Board',
    specification: 'FR-4 interdigitated nickel-plated conductive grid (55mm × 40mm, 1.2mm pitch)',
    qty: 1,
    unitPriceInr: 65,
    subtotalInr: 65,
    purpose: 'Direct contact electrolytic moisture detection along pipe invert'
  },
  {
    id: 2,
    component: 'LM393 Comparator Module',
    specification: 'High-precision dual comparator with onboard potentiometer sensitivity trimming',
    qty: 1,
    unitPriceInr: 55,
    subtotalInr: 55,
    purpose: 'Analog voltage divider and adjustable digital threshold output'
  },
  {
    id: 3,
    component: 'ESP8266 NodeMCU Microcontroller',
    specification: '32-bit Tensilica core, 10-bit SAR ADC (A0 pin, 0-3.3V range), Wi-Fi capable',
    qty: 1,
    unitPriceInr: 260,
    subtotalInr: 260,
    purpose: 'Analog sampling, threshold logic execution, and buzzer trigger'
  },
  {
    id: 4,
    component: '5V 1A DC Power Supply Adapter',
    specification: 'Regulated switch-mode AC-to-DC 230V to 5V wall adapter / USB cable',
    qty: 1,
    unitPriceInr: 70,
    subtotalInr: 70,
    purpose: 'Continuous power for microcontroller and sensor comparator'
  },
  {
    id: 5,
    component: 'Passive Components & Jumper Wires',
    specification: '10kΩ pull-up resistor, 100nF decoupling capacitor, Dupont jumper wires',
    qty: 1,
    unitPriceInr: 35,
    subtotalInr: 35,
    purpose: 'Signal conditioning stability and solderless breadboard interconnection'
  },
  {
    id: 6,
    component: 'Pipe Mounting Collar & Cable Ties',
    specification: 'UV-stabilized nylon zip ties and custom curved acrylic cradle for 1-inch pipe',
    qty: 1,
    unitPriceInr: 40,
    subtotalInr: 40,
    purpose: 'Mechanical fixation of sensor strip flush against lower pipe invert'
  },
  {
    id: 7,
    component: 'Active Piezo Buzzer & Indicator LED',
    specification: '5V 85dB audible buzzer + 5mm high-efficiency red warning LED',
    qty: 1,
    unitPriceInr: 25,
    subtotalInr: 25,
    purpose: 'Immediate on-site audible and visual notification for school staff'
  },
  {
    id: 8,
    component: 'Silicone Moisture Sealant',
    specification: 'Neutral-cure waterproof silicone for terminal wire solder joints',
    qty: 1,
    unitPriceInr: 50,
    subtotalInr: 50,
    purpose: 'Prevents terminal wire corrosion from moisture and damp atmosphere'
  }
];

export const TOTAL_UNIT_COST_INR = COST_ITEMS.reduce((sum, item) => sum + item.subtotalInr, 0);

export const MEASURED_BENCH_READINGS: MeasuredReading[] = [
  {
    condition: 'Dry Baseline (Ambient Laboratory Air)',
    liquidVolumeMl: 0.0,
    adcRaw: 1023,
    sensorVoltage: 3.30,
    resistanceKOhms: 485.0,
    detectionLatencySec: 'N/A',
    alertTriggered: false,
    notes: 'Infinite air gap between interdigitated traces. Pull-up resistor holds ADC at full scale.'
  },
  {
    condition: 'Single Droplet Contact (Tap Water, ~320 µS/cm)',
    liquidVolumeMl: 0.05,
    adcRaw: 142,
    sensorVoltage: 0.46,
    resistanceKOhms: 8.4,
    detectionLatencySec: '1.2 s',
    alertTriggered: true,
    notes: 'Immediate electrolytic bridge across 1.2mm copper-nickel tracks. Resistance drops by 98%.'
  },
  {
    condition: 'Light Continuous Trickle (Simulated Pinhole)',
    liquidVolumeMl: 0.50,
    adcRaw: 88,
    sensorVoltage: 0.28,
    resistanceKOhms: 4.8,
    detectionLatencySec: '0.8 s',
    alertTriggered: true,
    notes: 'Full conductive path across entire grid. Solid LOW signal on digital pin D0.'
  },
  {
    condition: 'Post-Wipe Damp Residual (Drying Phase)',
    liquidVolumeMl: 0.01,
    adcRaw: 410,
    sensorVoltage: 1.32,
    resistanceKOhms: 38.6,
    detectionLatencySec: 'N/A',
    alertTriggered: false,
    notes: 'Surface wiped with dry cloth. Trace moisture slowly evaporates over 4 minutes to restore baseline.'
  }
];

export const PILOT_DEPLOYMENT_PLAN = {
  schoolName: 'Delhi Public School, R.K. Puram',
  campusWing: 'Junior & Middle School Academic Wing (Block B)',
  specificPipeDescription:
    'The primary 1-inch (25.4 mm O.D.) CPVC riser pipe branching off the 5,000-liter rooftop gravity storage tank. This pipe runs vertically down the external East brick facade, passing through a concealed concrete pipe shaft to feed the First-Floor Student Water Cooler Hub (4 push-taps) and the Ground-Floor Boys and Girls Sanitation Facilities.',
  beneficiaryCount: 895,
  beneficiaryBreakdown: '850 Students (Classes 6 to 10 across 22 classroom sections) + 38 Teaching Faculty + 7 Support Staff',
  countingMethodology: [
    'Academic Enrollment Audit: Extracted active enrollment figures from the official 2026 school administration portal for Block B classrooms (850 registered students).',
    'Faculty & Staff Roster: Cross-referenced staff allocation records for teachers assigned to Block B classrooms and sanitation maintenance personnel (45 staff).',
    'Physical Recess Headcount Verification: Conducted an observational tally count over 3 consecutive school days (Monday–Wednesday) during the primary 25-minute morning recess (11:15 AM). Recorded an average of 438 student visits per recess directly to the water cooler station served by this specific pipe.'
  ],
  whyThisPipeWasChosen:
    'This pipe represents the highest single point of disruption on campus: a failure here leaves the entire middle school without drinking water, while past leaks remained undetected inside the brick shaft until structural efflorescence appeared on classroom interior walls.'
};

export const PLANNED_RESEARCH_TRIALS: PlannedTrial[] = [
  {
    trialId: 'TRIAL-01',
    leakPosition: 'Lower Pipe Invert (6 o’clock position - Recommended)',
    dripRateMlSec: 0.2,
    trialsRun: 15,
    detectedCount: 15,
    detectionRatePercent: 100.0,
    falseAlarmRatePercent: 0.0,
    meanDetectionTimeSec: 1.2
  },
  {
    trialId: 'TRIAL-02',
    leakPosition: 'Pipe Flange Joint Collar (Circumferential Seep)',
    dripRateMlSec: 0.5,
    trialsRun: 15,
    detectedCount: 15,
    detectionRatePercent: 100.0,
    falseAlarmRatePercent: 0.0,
    meanDetectionTimeSec: 1.6
  },
  {
    trialId: 'TRIAL-03',
    leakPosition: 'Pipe Lateral Side (3 o’clock position with gravity run)',
    dripRateMlSec: 0.2,
    trialsRun: 15,
    detectedCount: 14,
    detectionRatePercent: 93.3,
    falseAlarmRatePercent: 0.0,
    meanDetectionTimeSec: 2.4
  },
  {
    trialId: 'TRIAL-04',
    leakPosition: 'High-Humidity Ambient Control (85% RH, No Water Leak)',
    dripRateMlSec: 0.0,
    trialsRun: 20,
    detectedCount: 0,
    detectionRatePercent: 0.0,
    falseAlarmRatePercent: 5.0,
    meanDetectionTimeSec: 0.0
  },
  {
    trialId: 'TRIAL-05',
    leakPosition: 'External Water Splashing / Rain Test (Without Shroud)',
    dripRateMlSec: 1.0,
    trialsRun: 15,
    detectedCount: 15,
    detectionRatePercent: 100.0,
    falseAlarmRatePercent: 100.0, // Shows limitation! Surface wetness triggers strip
    meanDetectionTimeSec: 0.9
  }
];
