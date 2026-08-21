import type { BadgeVariant } from '../components/ui';

export interface ComplaintTimelineItem {
  status: 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
  title: string;
  date: string;
  description: string;
  completed: boolean;
}

export interface ComplaintResolution {
  message: string;
  note: string;
  date: string;
  officerName: string;
  officerBadge: string;
}

export interface ComplaintData {
  id: string;
  title: string;
  category: string;
  department: string;
  submittedDate: string;
  submittedTime: string;
  status: BadgeVariant;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  thumbnailIcon: string;
  description: string;
  location: string;
  ward: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  timeline: ComplaintTimelineItem[];
  resolution?: ComplaintResolution;
}

export const mockCitizenComplaints: ComplaintData[] = [
  {
    id: 'CIV-1024',
    title: 'Garbage Overflow near Parkside Community Center',
    category: 'Sanitation & Waste',
    department: 'Municipality / Sanitation',
    submittedDate: 'Aug 20, 2026',
    submittedTime: '10:30 AM',
    status: 'IN_PROGRESS',
    priority: 'High',
    thumbnailIcon: '🗑️',
    description: 'Municipal dumpster overflowing onto pedestrian sidewalk. Strong odor causing public health concerns for nearby residents and park visitors.',
    location: 'Parkside Avenue, opposite Community Center Gate',
    ward: 'Ward 12 - Central District',
    coordinates: {
      lat: 12.9716,
      lng: 77.5946,
    },
    timeline: [
      {
        status: 'NEW',
        title: 'Complaint Submitted',
        date: 'Aug 20, 10:30 AM',
        description: 'Complaint registered by citizen with photo evidence.',
        completed: true,
      },
      {
        status: 'ASSIGNED',
        title: 'Assigned to Sanitation Board',
        date: 'Aug 20, 11:15 AM',
        description: 'Triage officer verified jurisdiction and assigned Sanitation Crew #3.',
        completed: true,
      },
      {
        status: 'IN_PROGRESS',
        title: 'Officer Started Working on Issue',
        date: 'Aug 21, 09:00 AM',
        description: 'Sanitation truck deployed to clear and sanitize waste container.',
        completed: true,
      },
      {
        status: 'RESOLVED',
        title: 'Resolution Verification',
        date: 'Estimated today, 04:00 PM',
        description: 'Final photographic verification and citizen closure notice.',
        completed: false,
      },
    ],
  },
  {
    id: 'CIV-2026-085',
    title: 'Damaged Pavement Slab on High Street Walkway',
    category: 'Roads & Infrastructure',
    department: 'Roads & Infrastructure',
    submittedDate: 'Aug 21, 2026',
    submittedTime: '08:45 AM',
    status: 'NEW',
    priority: 'Medium',
    thumbnailIcon: '🚧',
    description: 'Broken concrete paver slab creating a severe tripping hazard for pedestrians and school children along High Street.',
    location: 'High Street, opposite City Bank',
    ward: 'Ward 12 - Central District',
    coordinates: {
      lat: 12.9722,
      lng: 77.5954,
    },
    timeline: [
      {
        status: 'NEW',
        title: 'Complaint Submitted',
        date: 'Aug 21, 08:45 AM',
        description: 'Complaint received and queued in Ward 12 intake register.',
        completed: true,
      },
      {
        status: 'ASSIGNED',
        title: 'Department Assignment',
        date: 'Pending review',
        description: 'Awaiting ward supervisor inspection.',
        completed: false,
      },
      {
        status: 'IN_PROGRESS',
        title: 'Field Team Deployment',
        date: 'Pending',
        description: 'Roads repair team dispatch.',
        completed: false,
      },
      {
        status: 'RESOLVED',
        title: 'Pavement Replaced',
        date: 'Pending',
        description: 'Final inspection.',
        completed: false,
      },
    ],
  },
  {
    id: 'CIV-2026-081',
    title: 'Deep Pothole near Central Market Road Gate 3',
    category: 'Roads & Infrastructure',
    department: 'Roads & Infrastructure',
    submittedDate: 'Aug 19, 2026',
    submittedTime: '02:15 PM',
    status: 'IN_PROGRESS',
    priority: 'Critical',
    thumbnailIcon: '🕳️',
    description: 'Deep 2-foot wide pothole on the main bus lane causing traffic snarls and vehicle damage during peak morning rush hours.',
    location: 'Main Market St, opposite Gate 3',
    ward: 'Ward 12 - Central District',
    coordinates: {
      lat: 12.9698,
      lng: 77.5912,
    },
    timeline: [
      {
        status: 'NEW',
        title: 'Complaint Submitted',
        date: 'Aug 19, 02:15 PM',
        description: 'Citizen report received with GPS coordinates.',
        completed: true,
      },
      {
        status: 'ASSIGNED',
        title: 'Assigned to PWD Roads Division',
        date: 'Aug 19, 04:00 PM',
        description: 'Classified as Critical priority hazard. PWD Crew #4 assigned.',
        completed: true,
      },
      {
        status: 'IN_PROGRESS',
        title: 'Roads Crew Dispatched',
        date: 'Aug 20, 08:30 AM',
        description: 'Asphalt filler and road leveling machinery deployed on site.',
        completed: true,
      },
      {
        status: 'RESOLVED',
        title: 'Asphalt Curing & Inspection',
        date: 'In progress',
        description: 'Pending post-repair road flatness verification.',
        completed: false,
      },
    ],
  },
  {
    id: 'CIV-2026-074',
    title: 'Non-functioning Street Lights on 4th Cross Road',
    category: 'Electricity & Lighting',
    department: 'Electricity',
    submittedDate: 'Aug 15, 2026',
    submittedTime: '09:10 PM',
    status: 'ASSIGNED',
    priority: 'Medium',
    thumbnailIcon: '💡',
    description: 'Three consecutive street lights along 4th Cross Road have been unlit since Monday, resulting in zero road illumination at night.',
    location: '4th Cross Rd, near Park Junction',
    ward: 'Ward 12 - Central District',
    coordinates: {
      lat: 12.9734,
      lng: 77.5898,
    },
    timeline: [
      {
        status: 'NEW',
        title: 'Complaint Submitted',
        date: 'Aug 15, 09:10 PM',
        description: 'Submitted online by resident.',
        completed: true,
      },
      {
        status: 'ASSIGNED',
        title: 'Assigned to Electrical Maintenance Team',
        date: 'Aug 16, 10:00 AM',
        description: 'Work order #ELE-441 issued to Grid Repair Unit #2.',
        completed: true,
      },
      {
        status: 'IN_PROGRESS',
        title: 'Line Inspection & Bulb Replacement',
        date: 'Pending schedule',
        description: 'Technician on-site inspection scheduled.',
        completed: false,
      },
      {
        status: 'RESOLVED',
        title: 'Power Restored',
        date: 'Pending',
        description: 'Photometric test & closure.',
        completed: false,
      },
    ],
  },
  {
    id: 'CIV-2026-061',
    title: 'Overflowing Municipal Garbage Bin at Parkside',
    category: 'Sanitation & Waste',
    department: 'Municipality / Sanitation',
    submittedDate: 'Aug 10, 2026',
    submittedTime: '07:30 AM',
    status: 'RESOLVED',
    priority: 'Medium',
    thumbnailIcon: '🗑️',
    description: 'Commercial waste overflowing near Parkside corner affecting residential entrance.',
    location: 'Parkside Avenue corner, Sector 3',
    ward: 'Ward 12 - Central District',
    coordinates: {
      lat: 12.9711,
      lng: 77.5938,
    },
    timeline: [
      {
        status: 'NEW',
        title: 'Complaint Submitted',
        date: 'Aug 10, 07:30 AM',
        description: 'Report filed with attached location photo.',
        completed: true,
      },
      {
        status: 'ASSIGNED',
        title: 'Assigned to Ward Sanitation Unit',
        date: 'Aug 10, 08:30 AM',
        description: 'Assigned to Route #8 sanitation supervisor.',
        completed: true,
      },
      {
        status: 'IN_PROGRESS',
        title: 'Waste Clearance Dispatched',
        date: 'Aug 10, 11:00 AM',
        description: 'Municipal hydraulic loader cleared container.',
        completed: true,
      },
      {
        status: 'RESOLVED',
        title: 'Complaint Resolved & Verified',
        date: 'Aug 10, 01:30 PM',
        description: 'Sanitation completed. Perimeter sprayed with disinfectant.',
        completed: true,
      },
    ],
    resolution: {
      message: 'Garbage has been cleared from the reported location.',
      note: 'Municipal Sanitation Crew Unit B completed waste removal and full chemical disinfection of the bin enclosure. Public access has been fully restored.',
      date: 'Aug 10, 2026, 01:30 PM',
      officerName: 'Inspector Rajiv Sharma',
      officerBadge: 'SAN-OFF-402',
    },
  },
  {
    id: 'CIV-2026-042',
    title: 'Water Pipe Leakage at Intersection',
    category: 'Water Supply',
    department: 'Water Supply',
    submittedDate: 'Aug 02, 2026',
    submittedTime: '06:45 AM',
    status: 'RESOLVED',
    priority: 'High',
    thumbnailIcon: '💧',
    description: 'Subterranean supply pipe burst creating water gushing across the road intersection.',
    location: 'Oak & 2nd St. Intersection',
    ward: 'Ward 14 - North Suburb',
    coordinates: {
      lat: 12.9812,
      lng: 77.6015,
    },
    timeline: [
      {
        status: 'NEW',
        title: 'Complaint Submitted',
        date: 'Aug 02, 06:45 AM',
        description: 'Emergency leak report filed by resident.',
        completed: true,
      },
      {
        status: 'ASSIGNED',
        title: 'Water Supply Board Dispatched',
        date: 'Aug 02, 07:30 AM',
        description: 'Rapid Action Water Team notified.',
        completed: true,
      },
      {
        status: 'IN_PROGRESS',
        title: 'Pipeline Joint Replaced',
        date: 'Aug 02, 10:00 AM',
        description: 'Main valve isolated and new flange installed.',
        completed: true,
      },
      {
        status: 'RESOLVED',
        title: 'Water Supply Restored & Pressure Verified',
        date: 'Aug 02, 03:00 PM',
        description: 'Pressure tested at 4.2 bar with zero leakage.',
        completed: true,
      },
    ],
    resolution: {
      message: 'Water pipeline joint replacement successfully completed.',
      note: 'Water Board rapid team excavated and replaced the fractured 6-inch underground cast iron coupling with heavy-duty PVC fixture. Road surface repaved.',
      date: 'Aug 02, 2026, 03:00 PM',
      officerName: 'Engineer Anjali Deshmukh',
      officerBadge: 'WTR-ENG-119',
    },
  },
];
