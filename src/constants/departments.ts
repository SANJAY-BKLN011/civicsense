export const CIVIC_DEPARTMENTS = [
  { value: 'Municipality / Sanitation', label: 'Municipality / Sanitation' },
  { value: 'Public Works Department (PWD)', label: 'Public Works Department (PWD)' },
  { value: 'Solid Waste & Sanitation Board', label: 'Solid Waste & Sanitation Board' },
  { value: 'Municipal Water & Sewerage Board', label: 'Municipal Water & Sewerage Board' },
  { value: 'City Power & Streetlighting', label: 'City Power & Streetlighting' },
  { value: 'Traffic & Urban Transport Authority', label: 'Traffic & Urban Transport Authority' },
  { value: 'Parks & Horticulture Directorate', label: 'Parks & Horticulture Directorate' },
  { value: 'Public Health & Environmental Control', label: 'Public Health & Environmental Control' },
  { value: 'Building Standards & Safety Inspectorate', label: 'Building Standards & Safety Inspectorate' },
  { value: 'Other / Not Sure (Auto-triage)', label: 'Other / Not Sure (Auto-triage)' },
] as const;

export const CIVIC_STATUSES = ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'] as const;
export type CivicStatus = typeof CIVIC_STATUSES[number];

export const CIVIC_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
export type CivicPriority = typeof CIVIC_PRIORITIES[number];
