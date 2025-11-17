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
  const res = await fetch('/api/directivos');
  if (!res.ok) throw new Error('Error al cargar directivos');
  return res.json();
};

/**
 * [C]REATE: Crear un nuevo miembro
 */
const create = async (formData: FormData): Promise<Directivo> => {
  const res = await fetch('/api/directivos', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al crear');
  }
  return res.json();
};

/**
 * [U]PDATE: Actualizar un miembro
 */
const update = async (id: number, formData: FormData): Promise<Directivo> => {
  const res = await fetch(`/api/directivos/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al actualizar');
  }
  return res.json();
};

/**
 * [D]ELETE: Borrar un miembro
 */
const remove = async (id: number): Promise<{ message: string }> => {
  const res = await fetch(`/api/directivos/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al borrar');
  }
  return res.json();
};

export const directivoService = {
  getTodos,
  create,
  update,
  remove,
};