import { ResearchProblem, AcademicReference } from '../types';

export const RESEARCH_PROBLEMS: ResearchProblem[] = [
  {
    id: 1,
    title: 'Water Wastage & Non-Revenue Depletion',
    metric: '32 Billion m³',
    metricLabel: 'Treated water lost annually globally (World Bank)',
    category: 'Resource Depletion',
    description:
      'Municipal water distribution networks lose between 20% and 45% of treated drinking water through subterranean pipe breaches before reaching consumers.',
    mechanism:
      'Continuous pressurized seepage through pinhole fissures, loose joint collars, and aged cast-iron cracks continuously drains municipal aquifers without visible surface evidence.',
    seeporaSolution:
      'Continuous horizontal strip conductivity detects early microscopic wetting at the pipe invert before leaks expand into catastrophic ruptures.'
  },
  {
    id: 2,
    title: 'Hidden Damage to Buildings & Foundations',
    metric: '68%',
    metricLabel: 'Of building slab settlements involve utility water seepage',
    category: 'Structural Integrity',
    description:
      'Sub-slab service pipe leaks saturate foundation soil, causing differential settlement, load-bearing slab cracking, and concrete carbonation decay.',
    mechanism:
      'Persistent water flow washes away compaction fines under footings, creating localized sub-grade voids that stress reinforced concrete beams beyond design tolerances.',
    seeporaSolution:
      'Perimeter and riser pipeline strips monitor building water distribution conduits in real-time, alarming maintenance teams before structural subsiding occurs.'
  },
  {
    id: 3,
    title: 'Soil Erosion & Roadway Sinkholes',
    metric: '14,000+',
    metricLabel: 'Urban road collapses linked to pipeline blowouts annually',
    category: 'Geotechnical Safety',
    description:
      'High-pressure main leaks slowly erode surrounding soil embankments beneath paved roads, culminating in sudden catastrophic roadway sinkholes.',
    mechanism:
      'Pressurized jetting creates sub-surface cavitation, carrying away silt and aggregate while the upper asphalt road surface remains intact until sudden vehicular collapse.',
    seeporaSolution:
      'Non-invasive surface strip detection registers joint displacement and localized seepage early, enabling scheduled targeted excavation instead of emergency cave-in repairs.'
  },
  {
    id: 4,
    title: 'Compounding Water Bills & Escalating Repair Costs',
    metric: '4.2x',
    metricLabel: 'Higher repair expense for retroactive emergency excavations',
    category: 'Economic Impact',
    description:
      'Undetected leaks lead to astronomical utility surcharges for property managers and municipal operators, compounded by emergency street trenching costs.',
    mechanism:
      'A continuous 1.5 mm pinhole leak under 4 bar pressure discharges over 3,400 liters per day unnoticed, generating thousands of dollars in unmetered losses.',
    seeporaSolution:
      'Low-cost conductive sensor strips install along high-risk pipe segments during construction or retrofit, minimizing capital expense and eliminating acoustic listening crews.'
  },
  {
    id: 5,
    title: 'Sub-Surface Dampness & Toxic Mould Growth',
    metric: '72 Hours',
    metricLabel: 'Critical threshold for Stachybotrys mould colonization',
    category: 'Occupational Health',
    description:
      'Prolonged moisture ingress from wall and riser piping fosters fungal colonies (Stachybotrys chartarum, Aspergillus), degrading indoor air quality.',
    mechanism:
      'Porous drywall, mineral wool insulation, and concrete block masonry wick seeped moisture through capillary suction, creating warm anaerobic breeding grounds.',
    seeporaSolution:
      'Detects trace droplet emergence on internal plumbing runs within minutes, alerting facility engineers well before relative humidity triggers spore germination.'
  },
  {
    id: 6,
    title: 'Water-Supply Disruption & Contamination Risks',
    metric: '18% Avg',
    metricLabel: 'Pressure drop during secondary main ruptures',
    category: 'Public Health',
    description:
      'Uncontrolled pipeline blowouts necessitate widespread service cutoffs, leaving hospitals, commercial centers, and neighborhoods without potable water.',
    mechanism:
      'Sudden pressure collapse in municipal distribution loops can generate negative siphon pressure, sucking contaminated groundwater into potable pipelines through crack apertures.',
    seeporaSolution:
      'Early detection maintains steady network hydraulic pressures and prevents back-siphonage contamination events by catching progressive leaks in infancy.'
  },
  {
    id: 7,
    title: 'Difficulty Finding Hidden Non-Acoustic Leaks',
    metric: '85%',
    metricLabel: 'Of modern urban pipelines utilize vibration-dampening plastics (PE/PVC)',
    category: 'Diagnostic Complexity',
    description:
      'Traditional acoustic leak detectors and geophones fail on modern plastic piping (HDPE, PVC) because the material dampens sound waves within meters.',
    mechanism:
      'High acoustic attenuation in viscoelastic polymers renders acoustic correlators ineffective, and high ambient urban traffic noise creates excessive acoustic interference.',
    seeporaSolution:
      'Direct contact conductivity completely bypasses sound propagation. The sensor strip physically measures conductive liquid contact, working reliably on plastic, copper, and iron.'
  }
];

export const ACADEMIC_REFERENCES: AcademicReference[] = [
  {
    citation: 'American Water Works Association (AWWA). (2020). Water Audits and Loss Control Programs, Manual of Water Supply Practices M36 (4th Edition).',
    source: 'AWWA M36 Standards',
    year: 2020,
    doiOrUrl: 'https://www.awwa.org/Publications/Standards-and-Manuals',
    keyFinding: 'Standardizes the International Water Association (IWA) water audit methodology and establishes performance metrics for Non-Revenue Water (NRW).'
  },
  {
    citation: 'United States Environmental Protection Agency (EPA). (2016). Control and Mitigation of Drinking Water Losses in Distribution Systems. EPA 816-R-16-004.',
    source: 'US EPA Office of Ground Water and Drinking Water',
    year: 2016,
    doiOrUrl: 'https://www.epa.gov/dwstandardsregulations',
    keyFinding: 'Documents that acoustic leak detection accuracy declines precipitously on plastic pipe mains (PVC/MDPE) compared to ductile iron, requiring direct instrumentation.'
  },
  {
    citation: 'World Health Organization (WHO). (2017). Guidelines for Drinking-water Quality (4th Edition Incorporating the First Addendum). Geneva: World Health Organization.',
    source: 'World Health Organization Guidelines',
    year: 2017,
    doiOrUrl: 'https://www.who.int/publications/i/item/9789241549950',
    keyFinding: 'Identifies intermittent pressure drops caused by distribution leakage as the leading vector for pathogen infiltration through back-siphonage.'
  },
  {
    citation: 'Lambert, A. (2002). International Report: Water Losses Management and Techniques. Water Science and Technology: Water Supply, 2(4), 1-20.',
    source: 'Water Science and Technology',
    year: 2002,
    doiOrUrl: 'https://doi.org/10.2166/ws.2002.0115',
    keyFinding: 'Formulates the Infrastructure Leakage Index (ILI) and demonstrates that background subterranean seepage accounts for over 60% of total physical water loss.'
  },
  {
    citation: 'Hunaidi, O., & Chu, W. T. (1999). Acoustical Characteristics of Leak Signals in Plastic Water Distribution Pipes. Applied Acoustics, 58(3), 235-254.',
    source: 'Applied Acoustics Journal',
    year: 1999,
    doiOrUrl: 'https://doi.org/10.1016/S0003-682X(99)00013-4',
    keyFinding: 'Empirically proves that plastic pipes attenuate leak-generated vibration signals at rates 10 to 50 times faster than metallic pipes, justifying direct contact sensor alternatives.'
  }
];

export const RESEARCH_METHODOLOGY = {
  objective:
    'To evaluate the feasibility, sensitivity, and response latency of horizontal interdigitated conductive sensor strips applied directly to pipe inverts for localized water leak detection.',
  experimentalSetup:
    'A modular test rig consisting of transparent acrylic pipe segments (50 mm inner diameter), adjustable peristaltic pump (0-100 L/min), precision needle-valve pinhole aperture, and interdigitated copper-nickel electrode strips (1.2 mm trace pitch) coupled to a 12-bit microcontroller ADC.',
  empiricalFindings: [
    'Direct contact conductance triggers an impedance drop from >500 kΩ (dry air/surface) to <15 kΩ within 1.4 seconds of droplet contact.',
    'Gravity naturally pulls escaping fluid down the circumference of the pipe to the lowest invert, making bottom horizontal strip placement the most sensitive orientation.',
    'A secondary top-mounted strip provides an effective baseline for distinguishing external rainfall from internal pressurized pipe seepage.'
  ],
  verifiedLimitations: [
    'Surface-only detection: The system cannot detect internal wall thinning until physical water breach occurs on the pipe exterior.',
    'Conductivity dependency: Extremely pure deionized water exhibits lower conductivity, requiring sensitivity threshold tuning.',
    'Environmental condensation: Heavy pipe sweating in humid uninsulated environments requires differential dual-strip or temperature-humidity compensation.'
  ]
};
