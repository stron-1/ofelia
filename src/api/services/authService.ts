import { apiClient } from '../apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    nombre: string;
  };
}

const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // El apiClient nuevo convierte esto automáticamente a ?route=login
  // y envía las credenciales como JSON
  return apiClient.post<AuthResponse>('login', credentials);
};

export const authService = {
  login,
};