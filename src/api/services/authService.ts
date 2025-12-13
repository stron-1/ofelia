import { apiClient } from '../apiClient';
export interface LoginCredentials {
  email: string;
  password: string;
}
export interface User {
  id: number;
  email: string;
  nombre: string;
  imagen_url?: string | null;
}
export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>('login', credentials);
};

// --- CORRECCIÓN AQUÍ ---
const updateProfile = async (id: number, data: { nombre: string; email: string; password?: string }, file?: File) => {
  const formData = new FormData();
  formData.append('nombre', data.nombre);
  formData.append('email', data.email);
  
  if (data.password) {
    formData.append('password', data.password);
  }
  
  if (file) {
    formData.append('imagen', file);
  }
  return apiClient.post<{ message: string, user: User }>(`usuario&id=${id}`, formData);
};

export const authService = {
  login,
  updateProfile,
};