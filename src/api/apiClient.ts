const BASE_URL = '/api/index.php'; 
export const IMAGE_BASE_URL = '/'; // Las imágenes también pasarán por el proxy

async function client<T>(
  endpoint: string, 
  method: string, 
  body?: object | FormData, 
  isMultipart: boolean = false
): Promise<T> {
  
  const headers: HeadersInit = {};
  
  // Si no es multipart (archivos), indicamos que es JSON
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }

  const config: RequestInit = { method, headers };

  if (body) {
    config.body = isMultipart ? (body as FormData) : JSON.stringify(body);
  }

  // Construimos la URL. Ejemplo resultante: /api/index.php?route=login
  const response = await fetch(`${BASE_URL}?route=${endpoint}`, config);
  
  if (!response.ok) {
      // Intentamos leer el error del backend, si falla devolvemos objeto vacío
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error en la petición');
  }

  return response.json();
}

export const apiClient = {
  get: <T>(route: string, params: string = '') => 
    client<T>(`${route}${params}`, 'GET'),
  
  post: <T>(route: string, body: object | FormData) => 
    client<T>(route, 'POST', body, body instanceof FormData),
    
  // Simulamos PUT mediante POST + ID en la URL para PHP
  put: <T>(route: string, id: number | string, body: object | FormData) => 
    client<T>(`${route}&id=${id}`, 'POST', body, body instanceof FormData),
    
  delete: <T>(route: string, id: number | string) => 
    client<T>(`${route}&id=${id}`, 'DELETE'),
};