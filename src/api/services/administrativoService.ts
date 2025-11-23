import { apiClient } from '../apiClient';

export interface Administrativo {
  id: number;
  nombre: string;
  cargo: string;
  turno: string;
  imagen_url: string | null;
}

/** [R]EAD */
const getTodos = async (): Promise<Administrativo[]> => {
  return apiClient.get<Administrativo[]>('administrativos');
};

/** [C]REATE */
const create = async (formData: FormData): Promise<Administrativo> => {
  return apiClient.post<Administrativo>('administrativos', formData);
};

/** [U]PDATE */
const update = async (id: number, formData: FormData): Promise<Administrativo> => {
  return apiClient.put<Administrativo>('administrativos', id, formData);
};

/** [D]ELETE */
const remove = async (id: number): Promise<{ message: string }> => {
  return apiClient.delete<{ message: string }>('administrativos', id);
};

export const administrativoService = {
  getTodos,
  create,
  update,
  remove,
};