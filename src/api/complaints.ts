import { apiFetch, API_BASE_URL } from './client';

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
  return value;
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
    return [
      {
        status: fallbackStatus,
        title: 'Complaint Submitted',
        description: 'Issue reported by citizen and logged into the central complaint system.',
        timestamp: formatted.date && formatted.time ? `${formatted.date} ${formatted.time}` : 'Complaint registered',
        author: 'CivicSense System',
      },
    ];
  }

  return history.map((item) => {
    const formatted = formatDateTime(item.created_at);
    return {
      id: item.id,
      status: item.status,
      title: item.status === 'NEW' ? 'Complaint Submitted' : `Status: ${formatPriority(item.status)}`,
      description: item.note || 'Complaint status updated.',
      timestamp: formatted.date && formatted.time ? `${formatted.date} ${formatted.time}` : String(item.created_at || ''),
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

  const location =
    raw.location ||
    office?.address ||
    (latitude != null && longitude != null ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` : 'Location not provided');

  const resolution = raw.resolution
    ? (() => {
        const resolvedAt = raw.resolution.resolved_at || raw.resolution.resolvedAt;
        const resolvedDateTime = formatDateTime(resolvedAt);
        return {
          resolvedDate: resolvedDateTime.date || 'Resolved',
          resolvedTime: resolvedDateTime.time || '',
          officerName: raw.resolution.officerName || 'Assigned Officer',
          note: raw.resolution.note || 'Complaint resolved.',
          photoPreview: normalizeMediaUrl(raw.resolution.photo_url || raw.resolution.photoPreview),
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
    status: raw.status,
    priority: formatPriority(raw.priority),
    thumbnailIcon: raw.thumbnailIcon || '📌',
    description: raw.description || '',
    coordinates:
      latitude != null && longitude != null
        ? { lat: Number(latitude), lng: Number(longitude) }
        : null,
    photoUrl: normalizeMediaUrl(raw.photo_url || raw.photoUrl),
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

/**
 * POST /api/v1/complaints
 * Backend expects JSON with snake_case department_id and an optional base64/data-URI photo.
 */
export async function createComplaintApi(payload: CreateComplaintPayload) {
  let photo: string | null = null;

  if (payload.photo) {
    try {
      photo = await fileToDataUri(payload.photo);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unable to read the selected image.',
      };
    }
  }

  const result = await apiFetch<any>('/complaints', {
    method: 'POST',
    body: JSON.stringify({
      title: payload.title,
      description: payload.description,
      department_id: payload.departmentId,
      latitude: payload.latitude ?? null,
      longitude: payload.longitude ?? null,
      photo,
    }),
  });

  if (!result.success) return result;

  return {
    ...result,
    data: result.data ? normalizeComplaint((result.data as any).complaint || result.data) : result.data,
  };
}

/**
 * GET /api/v1/complaints/my
 * The backend supports status/department filters and pagination. Search remains client-side.
 */
export async function getMyComplaintsApi(params?: { search?: string; status?: string }) {
  const queryParts: string[] = ['limit=50'];
  if (params?.status && params.status !== 'ALL') {
    queryParts.push(`status=${encodeURIComponent(params.status)}`);
  }

  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  const result = await apiFetch<any>(`/complaints/my${queryString}`, { method: 'GET' });

  if (!result.success) return result;

  const payload = result.data as any;
  const rawComplaints = Array.isArray(payload) ? payload : payload?.complaints || [];

  return {
    ...result,
    data: rawComplaints.map(normalizeComplaint),
  };
}

/**
 * GET /api/v1/complaints/:complaintId
 */
export async function getComplaintByIdApi(id: string) {
  const result = await apiFetch<any>(`/complaints/${id}`, { method: 'GET' });

  if (!result.success) return result;

  return {
    ...result,
    data: result.data ? normalizeComplaint((result.data as any).complaint || result.data) : result.data,
  };
}

// Officer Complaints API extensions (I5)
export async function getOfficerComplaintsApi(params?: { search?: string; status?: string; priority?: string }) {
  const queryParts: string[] = [];
  if (params?.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
  if (params?.status && params.status !== 'ALL') queryParts.push(`status=${encodeURIComponent(params.status)}`);
  if (params?.priority && params.priority !== 'ALL') queryParts.push(`priority=${encodeURIComponent(params.priority)}`);
  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

  const result = await apiFetch<ComplaintResponseData[]>(`/officer/complaints${queryString}`, {
    method: 'GET',
  });

  if (!result.success && result.error?.includes('404')) {
    const fallback = await apiFetch<ComplaintResponseData[]>(`/complaints/assigned${queryString}`, {
      method: 'GET',
    });
    if (!fallback.success && fallback.error?.includes('404')) {
      const allFallback = await apiFetch<ComplaintResponseData[]>(`/complaints${queryString}`, {
        method: 'GET',
      });
      return allFallback;
    }
    return fallback;
  }

  return result;
}

export async function updateComplaintStatusApi(id: string, status: string) {
  const result = await apiFetch<ComplaintResponseData>(`/complaints/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

  if (!result.success && result.error?.includes('404')) {
    const fallback = await apiFetch<ComplaintResponseData>(`/officer/complaints/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    if (!fallback.success && fallback.error?.includes('404')) {
      const putFallback = await apiFetch<ComplaintResponseData>(`/complaints/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      return putFallback;
    }
    return fallback;
  }

  return result;
}

export async function addComplaintProgressApi(id: string, note: string) {
  const result = await apiFetch<ComplaintResponseData>(`/complaints/${id}/progress`, {
    method: 'POST',
    body: JSON.stringify({ note, description: note }),
  });

  if (!result.success && result.error?.includes('404')) {
    const fallback = await apiFetch<ComplaintResponseData>(`/complaints/${id}/timeline`, {
      method: 'POST',
      body: JSON.stringify({ note, description: note }),
    });
    if (!fallback.success && fallback.error?.includes('404')) {
      const officerFallback = await apiFetch<ComplaintResponseData>(`/officer/complaints/${id}/progress`, {
        method: 'POST',
        body: JSON.stringify({ note, description: note }),
      });
      return officerFallback;
    }
    return fallback;
  }

  return result;
}

export async function resolveComplaintApi(id: string, note: string, photo?: File | null) {
  const token = getToken();

  if (photo && photo instanceof File) {
    const formData = new FormData();
    formData.append('note', note);
    formData.append('resolutionNote', note);
    formData.append('photo', photo);

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const url = `${API_BASE_URL.replace(/\/$/, '')}/complaints/${id}/resolve`;
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `HTTP Error ${response.status}`,
        };
      }
      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (err: any) {
      console.warn('FormData resolve failed, attempting JSON fallback', err);
    }
  }

  // JSON fallback if no file or multipart failed
  const result = await apiFetch<ComplaintResponseData>(`/complaints/${id}/resolve`, {
    method: 'POST',
    body: JSON.stringify({ note, resolutionNote: note }),
  });

  if (!result.success && result.error?.includes('404')) {
    const fallback = await apiFetch<ComplaintResponseData>(`/officer/complaints/${id}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ note, resolutionNote: note }),
    });
    return fallback;
  }

  return result;
}
