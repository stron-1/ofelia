const BASE_URL = '/api/index.php'; 
export const IMAGE_BASE_URL = '/'; 

async function client<T>(
  endpoint: string, 
  method: string, 
  body?: object | FormData, 
  isMultipart: boolean = false
): Promise<T> {
  
  const headers: HeadersInit = {};

  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }

  const config: RequestInit = { method, headers };

  if (body) {
    config.body = isMultipart ? (body as FormData) : JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}?route=${endpoint}`, config);
  
  if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error en la petición');
  }

  const text = await response.text();
  
  return text ? JSON.parse(text) : ({} as T);
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