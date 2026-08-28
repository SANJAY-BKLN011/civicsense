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
  completionRate: number;
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
  photoUrl?: string;
  resolution?: {
    resolvedDate: string;
    resolvedTime: string;
    officerName: string;
    note: string;
    photoPreview?: string;
  };
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
    id: 'OFF-ELC-309',
    name: 'Vikram Singh',
    designation: 'Electrical Inspector',
    department: 'Electricity Board',
    status: 'Active',
    assignedComplaints: 3,
    resolvedComplaints: 9,
    email: 'vikram.singh@civicsense.gov',
    phone: '+91 98445 67890',
    ward: 'Ward 5 - East Colony',
  },
];

export const mockAdminComplaints: AdminComplaint[] = [];
