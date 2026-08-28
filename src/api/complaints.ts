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

export interface ComplaintTimelineItem { id?: string; status?: string; title: string; description: string; timestamp: string; author: string; type?: string; }
export interface ComplaintResolutionData { resolvedDate: string; resolvedTime: string; officerName: string; note: string; photoPreview?: string; }
export interface ComplaintResponseData {
  id: string; complaintNumber?: string; title: string; category?: string; departmentId?: string; department?: string; location: string; ward?: string;
  submittedDate?: string; submittedTime?: string; createdAt?: string; citizenName?: string; assignedOfficer?: string; assignedOfficerId?: string;
  status: string; priority?: string; thumbnailIcon?: string; description: string; coordinates?: { lat: number; lng: number } | null;
  photoUrl?: string; timeline?: ComplaintTimelineItem[]; resolution?: ComplaintResolutionData;
}

const API_ORIGIN = (() => { try { return new URL(API_BASE_URL).origin; } catch { return ''; } })();
function normalizeMediaUrl(value?: string | null): string | undefined { if (!value) return undefined; if (value.startsWith('data:image/')) return value; if (/^https?:\/\//i.test(value)) return value; if (value.startsWith('/')) return `${API_ORIGIN}${value}`; return `${API_ORIGIN}/${value}`; }
function formatPriority(value?: string): string { if (!value) return 'Medium'; return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(); }
function formatDateTime(value?: string | Date | null): { date?: string; time?: string } { if (!value) return {}; const date = new Date(value); if (Number.isNaN(date.getTime())) return {}; return { date: date.toLocaleDateString(), time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }; }
function normalizeStatusHistory(history: any[] | undefined, fallbackStatus: string, fallbackCreatedAt?: string) {
  if (!history?.length) { const formatted = formatDateTime(fallbackCreatedAt); return [{ status: fallbackStatus, title: 'Complaint Submitted', description: 'Issue reported by citizen and logged into the central complaint system.', timestamp: formatted.date && formatted.time ? `${formatted.date} ${formatted.time}` : 'Complaint registered', author: 'CivicSense System' }]; }
  return history.map((item) => { const formatted = formatDateTime(item.created_at || item.createdAt); return { id: item.id, status: item.status, title: item.status === 'NEW' ? 'Complaint Submitted' : `Status: ${formatPriority(item.status)}`, description: item.note || 'Complaint status updated.', timestamp: formatted.date && formatted.time ? `${formatted.date} ${formatted.time}` : String(item.created_at || item.createdAt || ''), author: typeof item.author === 'string' ? item.author : item.author?.name || 'CivicSense System' }; });
}

function asName(value: any, fallback: string): string { if (typeof value === 'string') return value; if (value && typeof value === 'object') return value.name || value.full_name || value.fullName || value.email || fallback; return fallback; }
function asId(value: any): string | undefined { if (typeof value === 'string') return value; if (value && typeof value === 'object') return value.id; return undefined; }

function normalizeComplaint(raw: any): ComplaintResponseData {
  const createdAt = raw.created_at || raw.createdAt; const dateTime = formatDateTime(createdAt);
  const department = raw.department; const office = raw.office;
  const latitude = raw.latitude ?? raw.coordinates?.lat; const longitude = raw.longitude ?? raw.coordinates?.lng;
  const rawLocation = typeof raw.location === 'string' ? raw.location.trim() : raw.location;
  const location = (typeof rawLocation === 'string' && rawLocation) || raw.location_description || raw.address || raw.formatted_address || office?.address || (typeof raw.location === 'object' ? raw.location?.address || raw.location?.formatted_address : undefined) || 'Address not provided';

  const officerValue = raw.assignedOfficer ?? raw.assigned_officer ?? raw.assigned_officer_name ?? raw.officer ?? raw.officer_name ?? raw.assignee;
  const assignedOfficer = asName(officerValue, 'Unassigned');
  const assignedOfficerId = asId(raw.assignedOfficerId) || asId(raw.assigned_officer_id) || asId(officerValue);
  const citizenValue = raw.citizenName ?? raw.citizen ?? raw.citizen_name;
  const citizenName = asName(citizenValue, 'Not provided');
  const departmentName = asName(department, 'Department not provided');

  const resolution = raw.resolution ? (() => { const resolvedAt = raw.resolution.resolved_at || raw.resolution.resolvedAt; const dt = formatDateTime(resolvedAt); return { resolvedDate: dt.date || 'Resolved', resolvedTime: dt.time || '', officerName: asName(raw.resolution.officerName ?? raw.resolution.officer_name, 'Assigned Officer'), note: asName(raw.resolution.note, 'Complaint resolved.'), photoPreview: normalizeMediaUrl(raw.resolution.photo_url || raw.resolution.photoPreview || raw.resolution.photo) }; })() : undefined;

  return {
    id: String(raw.id ?? ''), complaintNumber: raw.complaint_number || raw.complaintNumber, title: asName(raw.title, 'Untitled complaint'), category: asName(raw.category, 'Municipal Services'),
    departmentId: department?.id || raw.department_id || raw.departmentId, department: departmentName, location: String(location), ward: asName(raw.ward || office?.name, 'Not provided'),
    submittedDate: raw.submittedDate || dateTime.date, submittedTime: raw.submittedTime || dateTime.time, createdAt, citizenName, assignedOfficer, assignedOfficerId,
    status: asName(raw.status, 'NEW'), priority: formatPriority(asName(raw.priority, 'Medium')), thumbnailIcon: asName(raw.thumbnailIcon, '📌'), description: asName(raw.description, ''),
    coordinates: latitude != null && longitude != null ? { lat: Number(latitude), lng: Number(longitude) } : null,
    photoUrl: normalizeMediaUrl(raw.photo_url || raw.photoUrl || raw.photo || raw.photo_path || raw.image_url || raw.imageUrl || raw.evidence?.photo_url || raw.evidence?.url || raw.attachment?.url),
    timeline: normalizeStatusHistory(raw.status_history || raw.timeline, asName(raw.status, 'NEW'), createdAt), resolution,
  };
}

async function fileToDataUri(file: File): Promise<string> { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => { if (typeof reader.result === 'string') resolve(reader.result); else reject(new Error('Unable to read the selected image.')); }; reader.onerror = () => reject(new Error('Unable to read the selected image.')); reader.readAsDataURL(file); }); }

export async function createComplaintApi(payload: CreateComplaintPayload) { let photo: string | null = null; if (payload.photo) { try { photo = await fileToDataUri(payload.photo); } catch (error) { return { success: false, error: error instanceof Error ? error.message : 'Unable to read the selected image.' }; } } const result = await apiFetch<any>('/complaints', { method: 'POST', body: JSON.stringify({ title: payload.title, description: payload.description, department_id: payload.departmentId, location: payload.location, ward: payload.ward || null, latitude: payload.latitude ?? null, longitude: payload.longitude ?? null, photo }) }); if (!result.success) return result; return { ...result, data: result.data ? normalizeComplaint((result.data as any).complaint || result.data) : result.data }; }
export async function getMyComplaintsApi(params?: { search?: string; status?: string }) { const queryParts: string[] = ['limit=50']; if (params?.status && params.status !== 'ALL') queryParts.push(`status=${encodeURIComponent(params.status)}`); const queryString = `?${queryParts.join('&')}`; const result = await apiFetch<any>(`/complaints/my${queryString}`, { method: 'GET' }); if (!result.success) return result; const payload = result.data as any; const rawComplaints = Array.isArray(payload) ? payload : payload?.complaints || []; return { ...result, data: rawComplaints.map(normalizeComplaint) }; }
export async function getComplaintByIdApi(id: string) { const result = await apiFetch<any>(`/complaints/${id}`, { method: 'GET' }); if (!result.success) return result; return { ...result, data: result.data ? normalizeComplaint((result.data as any).complaint || result.data) : result.data }; }
