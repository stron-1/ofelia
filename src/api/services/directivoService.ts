import { apiClient } from '../apiClient';

export interface Directivo {
  id: number;
  nombre: string;
  cargo: string;
  turno: string;
  imagen_url: string | null;
}

/**
 * [R]EAD: Obtener todo el personal directivo
 */
const getTodos = async (): Promise<Directivo[]> => {
  // El apiClient añade automáticamente ?route=directivos
  return apiClient.get<Directivo[]>('directivos');
};

/**
 * [C]REATE: Crear un nuevo miembro
 */
const create = async (formData: FormData): Promise<Directivo> => {
  return apiClient.post<Directivo>('directivos', formData);
};

/**
 * [U]PDATE: Actualizar un miembro
 */
const update = async (id: number, formData: FormData): Promise<Directivo> => {
  // Pasamos el ID por separado para que el apiClient forme ?route=directivos&id=X
  return apiClient.put<Directivo>('directivos', id, formData);
};

/**
 * [D]ELETE: Borrar un miembro
 */
const remove = async (id: number): Promise<{ message: string }> => {
  return apiClient.delete<{ message: string }>('directivos', id);
};

export const directivoService = {
  getTodos,
  create,
  update,
  remove,
};