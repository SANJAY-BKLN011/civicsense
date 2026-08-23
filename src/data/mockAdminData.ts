import type { BadgeVariant } from '../components/ui';

export interface AdminOfficer {
  id: string;
  name: string;
  designation: string;
  department: string;
  status: 'Active' | 'Inactive';
  assignedComplaints: number;
  resolvedComplaints: number;
  email: string;
  phone: string;
  ward: string;
}

export interface DepartmentPerformance {
  department: string;
  totalComplaints: number;
  pending: number;
  inProgress: number;
  resolved: number;
  completionRate: number; // percentage
}

export interface AdminComplaint {
  id: string;
  title: string;
  category: string;
  department: string;
  location: string;
  ward: string;
  submittedDate: string;
  submittedTime: string;
  citizenName: string;
  assignedOfficer: string;
  assignedOfficerId?: string;
  status: BadgeVariant;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  thumbnailIcon: string;
  description: string;
  coordinates: { lat: number; lng: number };
}

export const mockAdminOfficers: AdminOfficer[] = [
  {
    id: 'OFF-SAN-402',
    name: 'Sanjay Kumar',
    designation: 'Field Officer',
    department: 'Municipality / Sanitation',
    status: 'Active',
    assignedComplaints: 5,
    resolvedComplaints: 18,
    email: 'sanjay.kumar@civicsense.gov',
    phone: '+91 98112 34567',
    ward: 'Ward 12 - Central District',
  },
  {
    id: 'OFF-PWD-108',
    name: 'Rajesh Sharma',
    designation: 'Senior PWD Inspector',
    department: 'Public Works Department (PWD)',
    status: 'Active',
    assignedComplaints: 8,
    resolvedComplaints: 24,
    email: 'rajesh.sharma@civicsense.gov',
    phone: '+91 98223 45678',
    ward: 'Ward 8 - North Suburb',
  },
  {
    id: 'OFF-WTR-204',
    name: 'Anita Roy',
    designation: 'Water Engineer',
    department: 'Municipal Water & Sewerage Board',
    status: 'Active',
    assignedComplaints: 4,
    resolvedComplaints: 12,
    email: 'anita.roy@civicsense.gov',
    phone: '+91 98334 56789',
    ward: 'Ward 15 - South Market',
  },
  {
    id: 'OFF-PWR-309',
    name: 'Vikram Singh',
    designation: 'Electrical Supervisor',
    department: 'City Power & Streetlighting',
    status: 'Inactive',
    assignedComplaints: 0,
    resolvedComplaints: 9,
    email: 'vikram.singh@civicsense.gov',
    phone: '+91 98445 67890',
    ward: 'Ward 4 - East Industrial',
  },
  {
    id: 'OFF-HLT-512',
    name: 'Priya Verma',
    designation: 'Environmental Officer',
    department: 'Public Health & Environmental Control',
    status: 'Active',
    assignedComplaints: 3,
    resolvedComplaints: 15,
    email: 'priya.verma@civicsense.gov',
    phone: '+91 98556 78901',
    ward: 'Ward 12 - Central District',
  },
];

export const mockDepartmentPerformance: DepartmentPerformance[] = [
  {
    department: 'Municipality / Sanitation',
    totalComplaints: 35,
    pending: 8,
    inProgress: 12,
    resolved: 15,
    completionRate: 43,
  },
  {
    department: 'Public Works Department (PWD)',
    totalComplaints: 28,
    pending: 5,
    inProgress: 9,
    resolved: 14,
    completionRate: 50,
  },
  {
    department: 'Municipal Water & Sewerage Board',
    totalComplaints: 20,
    pending: 3,
    inProgress: 5,
    resolved: 12,
    completionRate: 60,
  },
  {
    department: 'City Power & Streetlighting',
    totalComplaints: 16,
    pending: 2,
    inProgress: 4,
    resolved: 10,
    completionRate: 63,
  },
  {
    department: 'Traffic & Urban Transport Authority',
    totalComplaints: 12,
    pending: 1,
    inProgress: 3,
    resolved: 8,
    completionRate: 67,
  },
];

export const mockAdminComplaints: AdminComplaint[] = [
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
    assignedOfficer: 'Officer Sanjay Kumar',
    assignedOfficerId: 'OFF-SAN-402',
    status: 'IN_PROGRESS',
    priority: 'High',
    thumbnailIcon: '🗑️',
    description:
      'Municipal dumpster overflowing onto pedestrian sidewalk. Strong odor causing public health concerns for nearby residents.',
    coordinates: { lat: 12.9716, lng: 77.5946 },
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
    assignedOfficer: 'Officer Sanjay Kumar',
    assignedOfficerId: 'OFF-SAN-402',
    status: 'ASSIGNED',
    priority: 'Critical',
    thumbnailIcon: '💧',
    description:
      'Severe waterlogging post monsoon near bus terminal. Drain blocked with debris causing flooding of the footpath.',
    coordinates: { lat: 12.9724, lng: 77.5958 },
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
    assignedOfficer: 'Officer Sanjay Kumar',
    assignedOfficerId: 'OFF-SAN-402',
    status: 'ASSIGNED',
    priority: 'High',
    thumbnailIcon: '♻️',
    description:
      'Construction debris dumped illegally in a residential lane, obstructing narrow road passage.',
    coordinates: { lat: 12.9701, lng: 77.5933 },
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
    assignedOfficer: 'Officer Sanjay Kumar',
    assignedOfficerId: 'OFF-SAN-402',
    status: 'RESOLVED',
    priority: 'Medium',
    thumbnailIcon: '🏗️',
    description:
      'Drainage overflow from blocked culvert at market entrance causing sewage spill on the road.',
    coordinates: { lat: 12.9689, lng: 77.5921 },
  },
  {
    id: 'CIV-2026-085',
    title: 'Broken Footpath Slab on High Street',
    category: 'Roads & Infrastructure',
    department: 'Public Works Department (PWD)',
    location: 'High Street, opposite City Bank',
    ward: 'Ward 8 - North Suburb',
    submittedDate: 'Aug 21, 2026',
    submittedTime: '08:45 AM',
    citizenName: 'Aarav Joshi',
    assignedOfficer: 'Rajesh Sharma',
    assignedOfficerId: 'OFF-PWD-108',
    status: 'NEW',
    priority: 'Medium',
    thumbnailIcon: '🚧',
    description:
      'Broken concrete paver creating a tripping hazard for pedestrians and school children.',
    coordinates: { lat: 12.9722, lng: 77.5954 },
  },
  {
    id: 'CIV-3042',
    title: 'Main Pipeline Burst Spilling Drinking Water',
    category: 'Water Supply',
    department: 'Municipal Water & Sewerage Board',
    location: '7th Avenue, Near Tank Road',
    ward: 'Ward 15 - South Market',
    submittedDate: 'Aug 22, 2026',
    submittedTime: '06:30 AM',
    citizenName: 'Vikram Mehta',
    assignedOfficer: 'Anita Roy',
    assignedOfficerId: 'OFF-WTR-204',
    status: 'IN_PROGRESS',
    priority: 'Critical',
    thumbnailIcon: '🚰',
    description:
      'High-pressure water main rupture wasting potable drinking water and flooding street.',
    coordinates: { lat: 12.9735, lng: 77.5962 },
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
    assignedOfficer: 'Officer Sanjay Kumar',
    assignedOfficerId: 'OFF-SAN-402',
    status: 'RESOLVED',
    priority: 'Low',
    thumbnailIcon: '🏛️',
    description:
      'Public toilet facility at park entrance non-functional — plumbing repair required.',
    coordinates: { lat: 12.9708, lng: 77.5942 },
  },
];
