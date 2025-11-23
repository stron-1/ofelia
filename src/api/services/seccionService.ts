import { apiClient } from '../apiClient';

export interface Seccion {
  id: number;
  grado_id: number;
  nombre_seccion: string;
  docente_nombre: string;
  turno: string;
  imagen_url: string | null;
}

// [R]EAD: Obtener secciones por grado
const getPorGrado = async (gradoId: number): Promise<Seccion[]> => {
  // Enviamos el grado como parámetro extra: ?route=secciones&grado_id=1
  return apiClient.get<Seccion[]>('secciones', `&grado_id=${gradoId}`);
};

// [C]REATE: Crear nueva sección
const create = async (formData: FormData): Promise<Seccion> => {
  return apiClient.post<Seccion>('secciones', formData);
};

// [U]PDATE: Actualizar sección
const update = async (id: number, formData: FormData): Promise<Seccion> => {
  // IMPORTANTE: Pasamos el ID por separado para que apiClient forme ?route=secciones&id=X
  return apiClient.put<Seccion>('secciones', id, formData);
};

// [D]ELETE: Eliminar sección
const remove = async (id: number): Promise<{ message: string }> => {
  return apiClient.delete<{ message: string }>('secciones', id);
};

export const seccionService = {
  getPorGrado,
  create,
  update,
  remove,
};