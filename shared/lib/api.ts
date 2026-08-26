import Cookies from 'js-cookie';

const API_BASE_URL = '';

export interface ApiOptions extends RequestInit {
  responseType?: 'json' | 'blob';
}

export async function apiFetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { responseType = 'json', ...fetchOptions } = options;
  const token = Cookies.get('token');

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    cache: 'no-store',
    ...fetchOptions,
    headers: {
      ...defaultHeaders,
      ...fetchOptions.headers,
    },
  };

  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const response = await fetch(`${baseUrl}${normalizedEndpoint}`, config);

  if (!response.ok) {
    if (response.status === 401) {
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-session-expired'));
        window.location.href = '/login?expired=true';
      }
    }

    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData?.message || 'Error en la comunicación con el servidor') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  if (responseType === 'blob') {
    const blob = await response.blob();
    return blob as unknown as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}
