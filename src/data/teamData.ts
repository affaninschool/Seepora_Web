export interface TeamMember {
  name: string;
  role: string;
  school?: string;
  focusArea: string;
  bio: string;
  responsibilities: string[];
  isLead?: boolean;
}

export interface MentorAcknowledgment {
  name: string;
  title: string;
  institution: string;
  guidanceArea: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Affan Adil',
    role: 'Student Innovator & Lead Researcher',
    school: 'Delhi Public School, R.K. Puram',
    focusArea: 'Sensor Architecture & Embedded Data Acquisition',
    bio: 'Class 11 Science & Engineering student and lead innovator for Project SEEPORA. Inspired by an undetected water pipe leak in his school corridor that wasted thousands of liters of drinking water, Affan pioneered the transition from expensive acoustic methods to a low-cost ₹600 horizontal conductive sensor-strip node.',
    responsibilities: [
      'Conceptualization of the horizontal sensor-strip geometry and 1.2mm electrode pitch',
      'Analog-to-digital sensor signal conditioning and 10-bit ADC threshold logic formulation',
      'Physical laboratory bench test assembly and fluid recirculation leak-rate calibration',
      'Field survey and headcount audit of 895 beneficiaries along the Block B school riser pipe',
      'Project submission for the Seva First Innovation Challenge'
    ],
    isLead: true
  },
  {
    name: 'Engineering Collaborators & Student Peers',
    role: 'Hardware & Prototyping Workgroup',
    school: 'Delhi Public School, R.K. Puram',
    focusArea: 'Hydraulic Rig Assembly & Materials Testing',
    bio: 'Student STEM club peers assisting with acrylic test pipe assembly, adhesive longevity trials under moisture cycles, and manual timing verification during bench flow calibration.',
    responsibilities: [
      'Assembly of transparent acrylic test pipe sections and fluid recirculation fittings',
      'Evaluation of conductive strip adhesives under cyclic damp and dry conditions',
      'Data logging during pinhole aperture flow calibration trials',
      'Physical recess observation and student headcount logging'
    ]
  }
];

export const MENTORS_AND_ADVISORS: MentorAcknowledgment[] = [
  {
    name: 'Dr. Rajesh Sharma',
    title: 'Head of Applied Sciences & Faculty Mentor',
    institution: 'Department of Science & Innovation, Delhi Public School, R.K. Puram',
    guidanceArea: 'Advisory guidance on circuit breadboarding, physical measurement protocols, 10-bit ADC calibration, and experimental error analysis.'
  },
  {
    name: 'School Campus Facilities & Maintenance Team',
    title: 'Plumbing & Infrastructure Advisors',
    institution: 'Delhi Public School, R.K. Puram',
    guidanceArea: 'Field access to external riser plumbing schematics, water cooler supply manifolds, and campus maintenance inspection records.'
  }
];

export const ACKNOWLEDGMENTS = [
  'Seva First Innovation Challenge for inspiring grassroots student engineering focused on water conservation and public service.',
  'Applied Science Laboratory at Delhi Public School, R.K. Puram, for providing breadboards, testing tools, and fluid measurement equipment.',
  'Open civil engineering literature and documentation from the International Water Association (IWA) and AWWA on non-revenue water loss.'
];

