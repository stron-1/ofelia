import { apiClient } from '../apiClient';

export interface MensajeContacto {
  id?: number;
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
  fecha?: string;
  leido?: number; // 0 o 1
}

export const contactoService = {
  // Para el Admin: Ver todos
  getAll: () => {
    return apiClient.get<MensajeContacto[]>('contacto');
  },

  // Para el Público: Enviar mensaje
  create: (data: MensajeContacto) => {
    return apiClient.post('contacto', data);
  },

  // Para el Admin: Marcar como leído
  markAsRead: (id: number) => {
    // Usamos PUT con un body vacío o parcial, el backend solo necesita el ID en la URL
    return apiClient.put('contacto', id, {});
  },

  // Para el Admin: Eliminar
  delete: (id: number) => {
    return apiClient.delete('contacto', id);
  }
};