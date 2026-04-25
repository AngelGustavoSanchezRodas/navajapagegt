import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error('La variable de entorno NEXT_PUBLIC_API_URL no está definida');
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = Cookies.get('token');
  
  const headers = new Headers(options.headers || {});
  
  // Inyectar el token si existe
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Establecer Content-Type por defecto si es una petición con cuerpo
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // Manejar respuestas sin contenido (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || `Error en la petición: ${response.status} ${response.statusText}`);
  }

  return data as T;
}
