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

const login = (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Usa el cliente JSON
  return apiClient.post<AuthResponse>('/login', credentials);
};

export const authService = {
  login,
};