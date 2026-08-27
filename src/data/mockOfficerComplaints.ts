import type { BadgeVariant } from '../components/ui';

export interface TimelineEntry {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  author: string;
  type: 'submission' | 'assignment' | 'status_change' | 'note' | 'resolution';
}

export interface ResolutionDetails {
  resolvedDate: string;
  resolvedTime: string;
  officerName: string;
  note: string;
  photoPreview?: string;
}

export interface OfficerComplaintData {
  id: string;
  title: string;
  category: string;
  department: string;
  location: string;
  ward: string;
  submittedDate: string;
  submittedTime: string;
  citizenName: string;
  status: BadgeVariant;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  thumbnailIcon: string;
  description: string;
  coordinates: { lat: number; lng: number };
  photoUrl?: string;
  timeline: TimelineEntry[];
  resolution?: ResolutionDetails;
}

export const mockOfficerComplaints: OfficerComplaintData[] = [
  {
    id: 'CIV-1024',
    title: 'Garbage Overflow Near Parkside Community Center',
    category: 'Sanitation & Waste',
    department: 'Municipality / Sanitation',
    location: 'Parkside Avenue, opposite Community Center Gate',
    ward: 'Ward 12 - Central District',
    submittedDate: 'Aug 20, 2026',
    submittedTime: '10:30 AM',
    citizenName: 'Rahul Mehra',
    status: 'IN_PROGRESS',
    priority: 'High',
    thumbnailIcon: '🗑️',
    description:
      'Municipal dumpster overflowing onto pedestrian sidewalk. Strong odor causing public health concerns for nearby residents and park visitors.',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    timeline: [
      {
        id: 'tl-1',
        timestamp: 'Aug 20, 2026 at 10:30 AM',
        title: 'Complaint Submitted',
        description: 'Citizen Rahul Mehra reported garbage overflow via CivicSense app.',
        author: 'Rahul Mehra (Citizen)',
        type: 'submission',
      },
      {
        id: 'tl-2',
        timestamp: 'Aug 20, 2026 at 11:15 AM',
        title: 'Assigned to Sanitation Dept',
        description: 'Automated routing assigned case to Municipality / Sanitation Ward 12.',
        author: 'System Triage',
        type: 'assignment',
      },
      {
        id: 'tl-3',
        timestamp: 'Aug 21, 2026 at 09:00 AM',
        title: 'Status Updated: IN_PROGRESS',
        description: 'Officer Sanjay Kumar initiated field investigation.',
        author: 'Officer Sanjay Kumar',
        type: 'status_change',
      },
      {
        id: 'tl-4',
        timestamp: 'Aug 21, 2026 at 02:30 PM',
        title: 'Progress Update',
        description: 'Inspection completed. Sanitation truck & heavy cleanup team dispatched.',
        author: 'Officer Sanjay Kumar',
        type: 'note',
      },
    ],
  },
  {
    id: 'CIV-1031',
    title: 'Stagnant Water Logging After Rainfall',
    category: 'Drainage & Sewage',
    department: 'Municipality / Sanitation',
    location: 'Station Road near Bus Terminal',
    ward: 'Ward 12 - Central District',
    submittedDate: 'Aug 21, 2026',
    submittedTime: '07:15 AM',
    citizenName: 'Priya Nair',
    status: 'ASSIGNED',
    priority: 'Critical',
    thumbnailIcon: '💧',
    description:
      'Severe waterlogging post monsoon near bus terminal. Drain blocked with debris causing flooding of the footpath.',
    coordinates: { lat: 12.9724, lng: 77.5958 },
    timeline: [
      {
        id: 'tl-1031-1',
        timestamp: 'Aug 21, 2026 at 07:15 AM',
        title: 'Complaint Submitted',
        description: 'Citizen Priya Nair reported severe waterlogging.',
        author: 'Priya Nair (Citizen)',
        type: 'submission',
      },
      {
        id: 'tl-1031-2',
        timestamp: 'Aug 21, 2026 at 08:00 AM',
        title: 'Assigned to Officer',
        description: 'Case marked CRITICAL and assigned to Field Officer Sanjay Kumar.',
        author: 'Control Room Dispatch',
        type: 'assignment',
      },
    ],
  },
  {
    id: 'CIV-1018',
    title: 'Illegal Waste Dumping in Residential Lane',
    category: 'Sanitation & Waste',
    department: 'Municipality / Sanitation',
    location: '3rd Cross, Gandhi Nagar Layout',
    ward: 'Ward 12 - Central District',
    submittedDate: 'Aug 18, 2026',
    submittedTime: '04:45 PM',
    citizenName: 'Suresh Agarwal',
    status: 'ASSIGNED',
    priority: 'High',
    thumbnailIcon: '♻️',
    description:
      'Construction debris dumped illegally in a residential lane, obstructing narrow road passage.',
    coordinates: { lat: 12.9701, lng: 77.5933 },
    timeline: [
      {
        id: 'tl-1018-1',
        timestamp: 'Aug 18, 2026 at 04:45 PM',
        title: 'Complaint Submitted',
        description: 'Citizen Suresh Agarwal reported construction debris obstruction.',
        author: 'Suresh Agarwal (Citizen)',
        type: 'submission',
      },
      {
        id: 'tl-1018-2',
        timestamp: 'Aug 19, 2026 at 09:30 AM',
        title: 'Assigned to Officer',
        description: 'Assigned to Officer Sanjay Kumar for site inspection & clearance order.',
        author: 'System Triage',
        type: 'assignment',
      },
    ],
  },
  {
    id: 'CIV-1009',
    title: 'Overflowing Drain Near Market Complex',
    category: 'Drainage & Sewage',
    department: 'Municipality / Sanitation',
    location: 'Market Complex, Sector 4',
    ward: 'Ward 12 - Central District',
    submittedDate: 'Aug 15, 2026',
    submittedTime: '11:00 AM',
    citizenName: 'Kavita Shah',
    status: 'RESOLVED',
    priority: 'Medium',
    thumbnailIcon: '🏗️',
    description:
      'Drainage overflow from blocked culvert at market entrance causing sewage spill on the road.',
    coordinates: { lat: 12.9689, lng: 77.5921 },
    timeline: [
      {
        id: 'tl-1009-1',
        timestamp: 'Aug 15, 2026 at 11:00 AM',
        title: 'Complaint Submitted',
        description: 'Citizen Kavita Shah reported drain blockage at market entrance.',
        author: 'Kavita Shah (Citizen)',
        type: 'submission',
      },
      {
        id: 'tl-1009-2',
        timestamp: 'Aug 15, 2026 at 01:20 PM',
        title: 'Assigned to Officer',
        description: 'Assigned to Officer Sanjay Kumar.',
        author: 'System Triage',
        type: 'assignment',
      },
      {
        id: 'tl-1009-3',
        timestamp: 'Aug 16, 2026 at 10:00 AM',
        title: 'Status Updated: IN_PROGRESS',
        description: 'Jetting machine dispatched to clear blocked culvert.',
        author: 'Officer Sanjay Kumar',
        type: 'status_change',
      },
      {
        id: 'tl-1009-4',
        timestamp: 'Aug 17, 2026 at 03:45 PM',
        title: 'Issue Resolved',
        description: 'Culvert cleared and drainage flow fully restored.',
        author: 'Officer Sanjay Kumar',
        type: 'resolution',
      },
    ],
    resolution: {
      resolvedDate: 'Aug 17, 2026',
      resolvedTime: '03:45 PM',
      officerName: 'Sanjay Kumar (Field Officer)',
      note: 'Heavy blockage in main culvert cleared using hydraulic vacuum truck. Road disinfected and water flow restored completely.',
    },
  },
  {
    id: 'CIV-2026-085',
    title: 'Broken Footpath Slab on High Street',
    category: 'Roads & Infrastructure',
    department: 'Municipality / Sanitation',
    location: 'High Street, opposite City Bank',
    ward: 'Ward 12 - Central District',
    submittedDate: 'Aug 21, 2026',
    submittedTime: '08:45 AM',
    citizenName: 'Aarav Joshi',
    status: 'NEW',
    priority: 'Medium',
    thumbnailIcon: '🚧',
    description:
      'Broken concrete paver creating a tripping hazard for pedestrians and school children.',
    coordinates: { lat: 12.9722, lng: 77.5954 },
    timeline: [
      {
        id: 'tl-085-1',
        timestamp: 'Aug 21, 2026 at 08:45 AM',
        title: 'Complaint Submitted',
        description: 'Citizen Aarav Joshi submitted footpath hazard report.',
        author: 'Aarav Joshi (Citizen)',
        type: 'submission',
      },
    ],
  },
  {
    id: 'CIV-0998',
    title: 'Public Toilet Maintenance Required',
    category: 'Sanitation & Waste',
    department: 'Municipality / Sanitation',
    location: 'Central Park Entrance, Gate 1',
    ward: 'Ward 12 - Central District',
    submittedDate: 'Aug 12, 2026',
    submittedTime: '09:30 AM',
    citizenName: 'Meena Kumari',
    status: 'RESOLVED',
    priority: 'Low',
    thumbnailIcon: '🏛️',
    description:
      'Public toilet facility at park entrance non-functional — plumbing repair required.',
    coordinates: { lat: 12.9708, lng: 77.5942 },
    timeline: [
      {
        id: 'tl-0998-1',
        timestamp: 'Aug 12, 2026 at 09:30 AM',
        title: 'Complaint Submitted',
        description: 'Citizen Meena Kumari reported plumbing issues at park facility.',
        author: 'Meena Kumari (Citizen)',
        type: 'submission',
      },
      {
        id: 'tl-0998-2',
        timestamp: 'Aug 13, 2026 at 02:00 PM',
        title: 'Issue Resolved',
        description: 'Plumbing repaired, flush valves replaced, and sanitation audit completed.',
        author: 'Officer Sanjay Kumar',
        type: 'resolution',
      },
    ],
    resolution: {
      resolvedDate: 'Aug 13, 2026',
      resolvedTime: '02:00 PM',
      officerName: 'Sanjay Kumar (Field Officer)',
      note: 'Municipal plumbers replaced broken inlet valve and pressure lines. Facility cleaned and re-opened for public access.',
    },
  },
];
