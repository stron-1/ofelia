import { apiClient } from '../apiClient';

export interface Actividad {
  id?: number;
  titulo: string;
  descripcion: string;
  categoria: string; // Ej: 'Cultural', 'Deporte', 'Academico'
  imagen_url?: string; // Portada
  galeria?: string[];  // Array de URLs de la galería (para leer)
}

export const actividadesService = {
  // Obtener todas (incluye la galería procesada desde el backend)
  getAll: (categoria?: string) => {
    const params = categoria ? `&categoria=${categoria}` : '';
    return apiClient.get<Actividad[]>('actividades', params);
  },

  // Crear nueva actividad (Soporta Portada + Múltiples fotos de Galería)
  create: (data: Actividad, portada?: File, galeriaFiles?: FileList | null) => {
    const formData = new FormData();
    formData.append('titulo', data.titulo);
    formData.append('descripcion', data.descripcion);
    formData.append('categoria', data.categoria);
    
    // 1. Agregar Portada (si existe)
    if (portada) {
      formData.append('imagen', portada);
    }

    // 2. Agregar Galería (Múltiples archivos)
    // Es vital usar 'galeria[]' con corchetes para que PHP lo detecte como array
    if (galeriaFiles && galeriaFiles.length > 0) {
      for (let i = 0; i < galeriaFiles.length; i++) {
        formData.append('galeria[]', galeriaFiles[i]);
      }
    }

    return apiClient.post('actividades', formData);
  },

  // Editar actividad existente
  update: (id: number, data: Actividad, portada?: File, galeriaFiles?: FileList | null) => {
    const formData = new FormData();
    formData.append('titulo', data.titulo);
    formData.append('descripcion', data.descripcion);
    formData.append('categoria', data.categoria);
    
    if (portada) {
      formData.append('imagen', portada);
    }

    // Nota: Por ahora la edición de galería suele ser más compleja (borrar/agregar), 
    // pero aquí permitimos agregar nuevas fotos a las existentes.
    if (galeriaFiles && galeriaFiles.length > 0) {
      for (let i = 0; i < galeriaFiles.length; i++) {
        formData.append('galeria[]', galeriaFiles[i]);
      }
    }

    return apiClient.put('actividades', id, formData);
  },

  // Eliminar actividad (El backend se encarga de borrar las fotos de galería en cascada)
  delete: (id: number) => {
    return apiClient.delete('actividades', id);
  }
};