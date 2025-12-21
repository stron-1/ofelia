import { apiClient } from '../apiClient';

export interface Comentario {
  id: number;
  autor: string;
  contenido: string;
  fecha: string;
  estado?: 'pendiente' | 'aprobado';
}

export interface FotoGaleria {
  id: number;
  imagen_url: string;
}

export interface Actividad {
  id?: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  imagen_url?: string | null;
  // Permitimos que galeria sea array de strings (rutas) o de objetos (FotoGaleria) para evitar conflictos
  galeria?: string[] | FotoGaleria[]; 
  likes?: number; 
  total_comentarios?: number;
  fecha_creacion?: string; // <--- Agregado para arreglar error
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

  getGaleriaDetalle: (actividadId: number) => {
    return apiClient.get<FotoGaleria[]>(`galeria&actividad_id=${actividadId}`);
  },

  deleteFotoGaleria: (id: number) => {
    return apiClient.delete('galeria', id);
  },

  // --- MÉTODOS PÚBLICOS (Alias para compatibilidad con el nuevo diseño) ---

  // Antes: darLike -> Ahora: addLike
  addLike: (id: number) => {
    return apiClient.post<{ likes: number }>(`social&accion=like`, { id });
  },
  
  // Mantenemos darLike por si el Admin lo usa
  darLike: (id: number) => {
    return apiClient.post<{ likes: number }>(`social&accion=like`, { id });
  },

  // Antes: getComentariosAprobados -> Ahora: getComentariosPublicos
  getComentariosPublicos: (actividadId: number) => {
    return apiClient.get<Comentario[]>(`social&actividad_id=${actividadId}`);
  },

  // Antes: comentar -> Ahora: enviarComentario
  enviarComentario: (actividadId: number, autor: string, contenido: string) => {
    const formData = new FormData();
    formData.append('actividad_id', actividadId.toString());
    formData.append('autor', autor);
    formData.append('contenido', contenido);
    return apiClient.post(`social&accion=comentar`, formData);
  },

  comentar: (actividadId: number, contenido: string, autor: string = 'Anónimo') => {
    const formData = new FormData();
    formData.append('actividad_id', actividadId.toString());
    formData.append('autor', autor);
    formData.append('contenido', contenido);
    return apiClient.post(`social&accion=comentar`, formData);
  },

  // --- MÉTODOS ADMIN ---
  getPendientes: () => {
    return apiClient.get<Comentario[]>('social&admin_pendientes=true');
  },
  
  aprobarComentario: (id: number) => {
    return apiClient.put('social&accion=aprobar', id, {});
  },
  
  rechazarComentario: (id: number) => {
    return apiClient.delete('social', id);
  }
};