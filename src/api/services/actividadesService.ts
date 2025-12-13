import { apiClient } from '../apiClient';

export interface Actividad {
  id?: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  imagen_url?: string | null; // Puede ser null si borramos portada
  galeria?: string[]; // Array simple para la vista pública
}

// Interfaz para la gestión interna (necesitamos ID para borrar)
export interface FotoGaleria {
  id: number;
  imagen_url: string;
}

export const actividadesService = {
  getAll: (categoria?: string) => {
    const params = categoria ? `&categoria=${categoria}` : '';
    return apiClient.get<Actividad[]>('actividades', params);
  },

  create: (data: Actividad, portada?: File, galeriaFiles?: FileList | null) => {
    const formData = new FormData();
    formData.append('titulo', data.titulo);
    formData.append('descripcion', data.descripcion);
    formData.append('categoria', data.categoria);
    
    if (portada) formData.append('imagen', portada);

    if (galeriaFiles && galeriaFiles.length > 0) {
      for (let i = 0; i < galeriaFiles.length; i++) {
        formData.append('galeria[]', galeriaFiles[i]);
      }
    }
    return apiClient.post('actividades', formData);
  },

  update: (id: number, data: Actividad, portada?: File, galeriaFiles?: FileList | null) => {
    const formData = new FormData();
    formData.append('titulo', data.titulo);
    formData.append('descripcion', data.descripcion);
    formData.append('categoria', data.categoria);
    
    if (portada) formData.append('imagen', portada);

    if (galeriaFiles && galeriaFiles.length > 0) {
      for (let i = 0; i < galeriaFiles.length; i++) {
        formData.append('galeria[]', galeriaFiles[i]);
      }
    }
    return apiClient.put('actividades', id, formData);
  },

  delete: (id: number) => {
    return apiClient.delete('actividades', id);
  },

  // --- NUEVOS MÉTODOS ---

  // 1. Obtener galería con IDs para poder editar
  getGaleriaDetalle: (actividadId: number) => {
    return apiClient.get<FotoGaleria[]>(`galeria&actividad_id=${actividadId}`);
  },

  // 2. Eliminar una foto específica de la galería
  deleteFotoGaleria: (fotoId: number) => {
    return apiClient.delete('galeria', fotoId);
  },

  // 3. Eliminar solo la portada
  deletePortada: (actividadId: number) => {
    return apiClient.post('eliminar_portada', { id: actividadId });
  }
};