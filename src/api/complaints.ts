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

export interface ComplaintResponseData {
  id: string;
  title: string;
  departmentId?: string;
  department?: string;
  location?: string;
  status?: string;
  createdAt?: string;
  submittedDate?: string;
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
