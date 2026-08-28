import { apiFetch, API_BASE_URL, getToken } from './client';

export interface CreateComplaintPayload {
  title: string;
  description: string;
  departmentId: string;
  location: string;
  ward?: string;
  latitude?: number | null;
  longitude?: number | null;
  photo?: File | null;
}

export interface ComplaintTimelineItem {
  id?: string;
  status?: string;
  title: string;
  description: string;
  timestamp: string;
  author: string;
  type?: string;
}

export interface ComplaintResolutionData {
  resolvedDate: string;
  resolvedTime: string;
  officerName: string;
  note: string;
  photoPreview?: string;
}

export interface ComplaintResponseData {
  id: string;
  complaintNumber?: string;
  title: string;
  category?: string;
  departmentId?: string;
  department?: string;
  location: string;
  ward?: string;
  submittedDate?: string;
  submittedTime?: string;
  createdAt?: string;
  citizenName?: string;
  assignedOfficer?: string;
  assignedOfficerId?: string;
  status: string;
  priority?: string;
  thumbnailIcon?: string;
  description: string;
  coordinates?: { lat: number; lng: number } | null;
  photoUrl?: string;
  timeline?: ComplaintTimelineItem[];
  resolution?: ComplaintResolutionData;
}

const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return '';
  }
})();

function normalizeMediaUrl(value?: string | null): string | undefined {
  if (!value) return undefined;
  if (value.startsWith('data:image/')) return value;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/')) return `${API_ORIGIN}${value}`;
  return `${API_ORIGIN}/${value}`;
}

function formatPriority(value?: string): string {
  if (!value) return 'Medium';
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function formatDateTime(value?: string | Date | null): { date?: string; time?: string } {
  if (!value) return {};
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return {};
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

function normalizeStatusHistory(history: any[] | undefined, fallbackStatus: string, fallbackCreatedAt?: string) {
  if (!history?.length) {
    const formatted = formatDateTime(fallbackCreatedAt);
    return [{
      status: fallbackStatus,
      title: 'Complaint Submitted',
      description: 'Issue reported by citizen and logged into the central complaint system.',
      timestamp: formatted.date && formatted.time ? `${formatted.date} ${formatted.time}` : 'Complaint registered',
      author: 'CivicSense System',
    }];
  }

  return history.map((item) => {
    const formatted = formatDateTime(item.created_at || item.createdAt);
    return {
      id: item.id,
      status: item.status,
      title: item.status === 'NEW' ? 'Complaint Submitted' : `Status: ${formatPriority(item.status)}`,
      description: item.note || 'Complaint status updated.',
      timestamp: formatted.date && formatted.time ? `${formatted.date} ${formatted.time}` : String(item.created_at || item.createdAt || ''),
      author: 'CivicSense System',
    };
  });
}

function normalizeComplaint(raw: any): ComplaintResponseData {
  const createdAt = raw.created_at || raw.createdAt;
  const dateTime = formatDateTime(createdAt);
  const department = raw.department;
  const office = raw.office;
  const latitude = raw.latitude ?? raw.coordinates?.lat;
  const longitude = raw.longitude ?? raw.coordinates?.lng;

  // Keep the citizen-entered address/landmark as the primary location value.
  // Only fall back to other address fields; never replace a missing address with GPS coordinates.
  const rawLocation = typeof raw.location === 'string' ? raw.location.trim() : raw.location;
  const location =
    (typeof rawLocation === 'string' && rawLocation) ||
    raw.location_description ||
    raw.address ||
    raw.formatted_address ||
    office?.address ||
    (typeof raw.location === 'object' ? raw.location?.address || raw.location?.formatted_address : undefined) ||
    'Address not provided';

  const assignedOfficer =
    raw.assignedOfficer ||
    raw.assigned_officer?.name ||
    raw.assigned_officer_name ||
    raw.officer?.name ||
    raw.officer_name ||
    raw.assignee?.name;
  const assignedOfficerId =
    raw.assignedOfficerId ||
    raw.assigned_officer?.id ||
    raw.assigned_officer_id ||
    raw.officer?.id ||
    raw.officer_id ||
    raw.assignee?.id;

  const resolution = raw.resolution
    ? (() => {
        const resolvedAt = raw.resolution.resolved_at || raw.resolution.resolvedAt;
        const resolvedDateTime = formatDateTime(resolvedAt);
        return {
          resolvedDate: resolvedDateTime.date || 'Resolved',
          resolvedTime: resolvedDateTime.time || '',
          officerName: raw.resolution.officerName || raw.resolution.officer_name || 'Assigned Officer',
          note: raw.resolution.note || 'Complaint resolved.',
          photoPreview: normalizeMediaUrl(raw.resolution.photo_url || raw.resolution.photoPreview || raw.resolution.photo),
        };
      })()
    : undefined;

  return {
    id: raw.id,
    complaintNumber: raw.complaint_number || raw.complaintNumber,
    title: raw.title,
    category: raw.category || 'Municipal Services',
    departmentId: department?.id || raw.department_id || raw.departmentId,
    department: typeof department === 'string' ? department : department?.name,
    location,
    ward: raw.ward || office?.name,
    submittedDate: raw.submittedDate || dateTime.date,
    submittedTime: raw.submittedTime || dateTime.time,
    createdAt,
    citizenName: raw.citizenName || raw.citizen?.name,
    assignedOfficer,
    assignedOfficerId,
    status: raw.status,
    priority: formatPriority(raw.priority),
    thumbnailIcon: raw.thumbnailIcon || '📌',
    description: raw.description || '',
    coordinates: latitude != null && longitude != null ? { lat: Number(latitude), lng: Number(longitude) } : null,
    photoUrl: normalizeMediaUrl(
      raw.photo_url ||
      raw.photoUrl ||
      raw.photo ||
      raw.photo_path ||
      raw.image_url ||
      raw.imageUrl ||
      raw.evidence?.photo_url ||
      raw.evidence?.url ||
      raw.attachment?.url
    ),
    timeline: normalizeStatusHistory(raw.status_history || raw.timeline, raw.status || 'NEW', createdAt),
    resolution,
  };
}

async function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Unable to read the selected image.'));
    };
    reader.onerror = () => reject(new Error('Unable to read the selected image.'));
    reader.readAsDataURL(file);
  });
}

export async function createComplaintApi(payload: CreateComplaintPayload) {
  let photo: string | null = null;
  if (payload.photo) {
    try {
      photo = await fileToDataUri(payload.photo);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unable to read the selected image.' };
    }
  }

  const result = await apiFetch<any>('/complaints', {
    method: 'POST',
    body: JSON.stringify({
      title: payload.title,
      description: payload.description,
      department_id: payload.departmentId,
      location: payload.location,
      ward: payload.ward || null,
      latitude: payload.latitude ?? null,
      longitude: payload.longitude ?? null,
      photo,
    }),
  });

  if (!result.success) return result;
  return { ...result, data: result.data ? normalizeComplaint((result.data as any).complaint || result.data) : result.data };
}

export async function getMyComplaintsApi(params?: { search?: string; status?: string }) {
  const queryParts: string[] = ['limit=50'];
  if (params?.status && params.status !== 'ALL') queryParts.push(`status=${encodeURIComponent(params.status)}`);
  const queryString = `?${queryParts.join('&')}`;
  const result = await apiFetch<any>(`/complaints/my${queryString}`, { method: 'GET' });
  if (!result.success) return result;

  const payload = result.data as any;
  const rawComplaints = Array.isArray(payload) ? payload : payload?.complaints || [];
  return { ...result, data: rawComplaints.map(normalizeComplaint) };
}

export async function getComplaintByIdApi(id: string) {
  const result = await apiFetch<any>(`/complaints/${id}`, { method: 'GET' });
  if (!result.success) return result;
  return { ...result, data: result.data ? normalizeComplaint((result.data as any).complaint || result.data) : result.data };
}

/**
 * I5: Officer complaint list.
 * Backend supports status, priority, office_id, date filters and pagination.
 * Search is intentionally client-side because the officer endpoint does not accept a search parameter.
 */
export async function getOfficerComplaintsApi(params?: {
  search?: string;
  status?: string;
  priority?: string;
  officeId?: string;
  page?: number;
  limit?: number;
}) {
  const queryParts: string[] = [];
  if (params?.status && params.status !== 'ALL') queryParts.push(`status=${encodeURIComponent(params.status)}`);
  if (params?.priority && params.priority !== 'ALL') queryParts.push(`priority=${encodeURIComponent(params.priority)}`);
  if (params?.officeId) queryParts.push(`office_id=${encodeURIComponent(params.officeId)}`);
  if (params?.page) queryParts.push(`page=${Math.max(1, params.page)}`);
  if (params?.limit) queryParts.push(`limit=${Math.min(100, Math.max(1, params.limit))}`);

  const queryString = queryParts.length ? `?${queryParts.join('&')}` : '';
  const result = await apiFetch<any>(`/officer/complaints${queryString}`, { method: 'GET' });
  if (!result.success) return result;

  const payload = result.data as any;
  const rawComplaints = Array.isArray(payload) ? payload : payload?.complaints || [];
  return {
    ...result,
    data: rawComplaints.map(normalizeComplaint),
    pagination: payload?.pagination,
  };
}

export async function getOfficerComplaintByIdApi(id: string) {
  const result = await apiFetch<any>(`/officer/complaints/${encodeURIComponent(id)}`, { method: 'GET' });
  if (!result.success) return result;
  return { ...result, data: result.data ? normalizeComplaint((result.data as any).complaint || result.data) : result.data };
}

/** I5: Officer-only status update endpoint. */
export async function updateComplaintStatusApi(id: string, status: string) {
  return apiFetch<ComplaintResponseData>(`/officer/complaints/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

/**
 * Kept for compatibility with existing UI imports.
 * The current backend has no officer progress/timeline endpoint, so do not issue a fake request.
 */
export async function addComplaintProgressApi(_id: string, _note: string) {
  return {
    success: false,
    error: 'Progress updates are not supported by the current backend API.',
  };
}

/**
 * I5: Officer resolution endpoint.
 * Backend expects JSON with a base64/data-URI photo, not multipart FormData.
 */
export async function resolveComplaintApi(id: string, note: string, photo?: File | null) {
  if (!photo) {
    return {
      success: false,
      error: 'A resolution photo is required to resolve a complaint.',
    };
  }

  let photoDataUri: string;
  try {
    photoDataUri = await fileToDataUri(photo);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unable to read the resolution photo.',
    };
  }

  const result = await apiFetch<ComplaintResponseData>(`/officer/complaints/${encodeURIComponent(id)}/resolve`, {
    method: 'POST',
    body: JSON.stringify({
      note,
      resolution_note: note,
      photo: photoDataUri,
    }),
  });

  return result;
}

// Keep a direct token reference available for callers that already depended on this module.
export { getToken };
