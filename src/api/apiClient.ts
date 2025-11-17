async function client<T>(endpoint: string, method: string, body?: object): Promise<T> {
  const config: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`/api${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error en la petición a la API');
  }
  
  return data;
}

export const apiClient = {
  get: <T>(endpoint: string) => client<T>(endpoint, 'GET'),
  post: <T>(endpoint: string, body: object) => client<T>(endpoint, 'POST', body),
  put: <T>(endpoint: string, body: object) => client<T>(endpoint, 'PUT', body),
  delete: <T>(endpoint: string) => client<T>(endpoint, 'DELETE'),
};