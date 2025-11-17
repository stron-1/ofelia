export interface Seccion {
  id: number;
  grado_id: number;
  nombre_seccion: string;
  docente_nombre: string;
  turno: string;
  imagen_url: string | null;
}

const getPorGrado = async (gradoId: number): Promise<Seccion[]> => {
  const res = await fetch(`/api/secciones/${gradoId}`);
  if (!res.ok) throw new Error('Error al cargar');
  return res.json();
};

const create = async (formData: FormData): Promise<Seccion> => {
  const res = await fetch('/api/secciones', {
    method: 'POST',
    body: formData, // fetch maneja FormData automáticamente
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al crear');
  }
  return res.json();
};

const update = async (id: number, formData: FormData): Promise<Seccion> => {
  const res = await fetch(`/api/secciones/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al actualizar');
  }
  return res.json();
};

const remove = async (id: number): Promise<{ message: string }> => {
  const res = await fetch(`/api/secciones/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al borrar');
  }
  return res.json();
};

export const seccionService = {
  getPorGrado,
  create,
  update,
  remove,
};