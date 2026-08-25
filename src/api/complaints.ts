import { API_BASE_URL, getToken, apiFetch } from './client';

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

export async function createComplaintApi(payload: CreateComplaintPayload) {
  const token = getToken();

  // If a photo File object is attached, use FormData multipart upload
  if (payload.photo && payload.photo instanceof File) {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('departmentId', payload.departmentId);
    formData.append('location', payload.location);
    if (payload.ward) formData.append('ward', payload.ward);
    if (payload.latitude) formData.append('latitude', payload.latitude.toString());
    if (payload.longitude) formData.append('longitude', payload.longitude.toString());
    formData.append('photo', payload.photo);

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const url = `${API_BASE_URL.replace(/\/$/, '')}/complaints`;
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
      // Try fallback endpoint /complaint
      try {
        const fallbackUrl = `${API_BASE_URL.replace(/\/$/, '')}/complaint`;
        const response = await fetch(fallbackUrl, {
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
      } catch (fallbackErr: any) {
        return {
          success: false,
          error: err.message || 'Network error while submitting complaint.',
        };
      }
    }
  }

  // JSON submission if no file attached
  const result = await apiFetch<ComplaintResponseData>('/complaints', {
    method: 'POST',
    body: JSON.stringify({
      title: payload.title,
      description: payload.description,
      departmentId: payload.departmentId,
      location: payload.location,
      ward: payload.ward,
      latitude: payload.latitude,
      longitude: payload.longitude,
    }),
  });

  if (!result.success && result.error?.includes('404')) {
    const fallback = await apiFetch<ComplaintResponseData>('/complaint', {
      method: 'POST',
      body: JSON.stringify({
        title: payload.title,
        description: payload.description,
        departmentId: payload.departmentId,
        location: payload.location,
        ward: payload.ward,
        latitude: payload.latitude,
        longitude: payload.longitude,
      }),
    });
    return fallback;
  }

  return result;
}

export async function getMyComplaintsApi(params?: { search?: string; status?: string }) {
  const queryParts: string[] = [];
  if (params?.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
  if (params?.status && params.status !== 'ALL') queryParts.push(`status=${encodeURIComponent(params.status)}`);
  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

  const result = await apiFetch<ComplaintResponseData[]>(`/complaints/my${queryString}`, {
    method: 'GET',
  });

  if (!result.success && result.error?.includes('404')) {
    const fallback = await apiFetch<ComplaintResponseData[]>(`/complaints${queryString}`, {
      method: 'GET',
    });

    if (!fallback.success && fallback.error?.includes('404')) {
      const citizenFallback = await apiFetch<ComplaintResponseData[]>(`/citizen/complaints${queryString}`, {
        method: 'GET',
      });
      return citizenFallback;
    }
    return fallback;
  }

  return result;
}

export async function getComplaintByIdApi(id: string) {
  const result = await apiFetch<ComplaintResponseData>(`/complaints/${id}`, {
    method: 'GET',
  });

  if (!result.success && result.error?.includes('404')) {
    const fallback = await apiFetch<ComplaintResponseData>(`/complaint/${id}`, {
      method: 'GET',
    });
    return fallback;
  }

  return result;
}
