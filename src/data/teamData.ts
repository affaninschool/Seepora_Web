export interface TeamMember {
  name: string;
  role: string;
  focusArea: string;
  bio: string;
  responsibilities: string[];
  isLead?: boolean;
}

export interface MentorAcknowledgment {
  name: string;
  affiliation: string;
  guidanceArea: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Affan Adil',
    role: 'Lead Project Researcher & Systems Engineer',
    focusArea: 'Sensor Architecture & Embedded Data Acquisition',
    bio: 'Lead investigator for Project SEEPORA, driving the transition from legacy vibration methods to direct conductive horizontal strip detection. Oversees hardware prototype engineering, impedance characterization, and the virtual pipeline laboratory test bench.',
    responsibilities: [
      'Conceptualization of the horizontal sensor strip geometry and electrode layout',
      'Analog-to-digital sensor signal conditioning and threshold algorithm formulation',
      'Design of the experimental pipeline test rig and hydraulic simulation model',
      'Validation of differential top-versus-bottom strip logic for rain mitigation',
      'Documentation of empirical findings, technical constraints, and academic reporting'
    ],
    isLead: true
  },
  {
    name: 'Engineering Collaborators & Student Researchers',
    role: 'Hardware & Prototyping Workgroup',
    focusArea: 'Hydraulic Rig Assembly & Materials Testing',
    bio: 'Academic peers and student researchers contributing to pipe bench construction, adhesive material longevity trials, and microcontroller firmware testing under laboratory conditions.',
    responsibilities: [
      'Assembly of transparent acrylic test pipe sections and fluid recirculating pumps',
      'Evaluation of conductive strip adhesives under cyclic damp and dry conditions',
      'Data logging during pinhole aperture flow calibration trials',
      'Comparative baseline measurement against acoustic geophone equipment'
    ]
  }
];

export const MENTORS_AND_ADVISORS: MentorAcknowledgment[] = [
  {
    name: 'Faculty Engineering Mentors',
    affiliation: 'Department of Civil & Electrical Engineering',
    guidanceArea: 'Hydraulic loss analysis, experimental methodology design, and sensor instrumentation calibration.'
  },
  {
    name: 'Municipal Water Quality & Infrastructure Advisors',
    affiliation: 'Urban Utility Research Network',
    guidanceArea: 'Industry perspective on non-revenue water (NRW), pipe material standards (PVC vs Ductile Iron), and field deployment constraints.'
  }
];

export const ACKNOWLEDGMENTS = [
  'Academic laboratory facilities and hydraulic equipment provided for controlled pipe flow and droplet measurement.',
  'Open research standards established by the American Water Works Association (AWWA) and International Water Association (IWA).',
  'Peer reviewers who examined the transition from VibraTrace vibration-sensor concepts to direct conductive strip detection.'
];
