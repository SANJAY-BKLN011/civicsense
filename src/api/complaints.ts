import { apiFetch } from './client';

export interface CreateComplaintPayload {
  title: string;
  description: string;
  departmentId: string;
  // Kept for compatibility with the existing Report Issue form.
  // The current backend contract uses coordinates rather than these display-only fields.
  location?: string;
  ward?: string;
  latitude?: number | null;
  longitude?: number | null;
  photo?: File | null;
}

export interface ComplaintResponseData {
  id: string;
  complaint_number?: string;
  title: string;
  description?: string;
  photo_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  priority?: string;
  priority_reason?: string;
  status?: string;
  department?: {
    id: string;
    name: string;
    description?: string | null;
  };
  created_at?: string;
  updated_at?: string;
}

/** Convert an image File to a data URI because the backend accepts JSON/base64,
 * not multipart FormData, for complaint photos. */
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
 * Backend contract uses snake_case department_id and accepts an optional
 * base64/data-URI photo in the JSON body.
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

  return apiFetch<ComplaintResponseData>('/complaints', {
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
}
