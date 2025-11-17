export interface Administrativo {
  id: number;
  nombre: string;
  cargo: string;
  turno: string;
  imagen_url: string | null;
}

/** [R]EAD: Get all administrative staff */
const getTodos = async (): Promise<Administrativo[]> => {
  const res = await fetch('/api/administrativos');
  if (!res.ok) throw new Error('Error loading administrative staff');
  return res.json();
};

/** [C]REATE: Create a new administrative member */
const create = async (formData: FormData): Promise<Administrativo> => {
  const res = await fetch('/api/administrativos', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error creating');
  }
  return res.json();
};

/** [U]PDATE: Update an administrative member */
const update = async (id: number, formData: FormData): Promise<Administrativo> => {
  const res = await fetch(`/api/administrativos/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error updating');
  }
  return res.json();
};

/** [D]ELETE: Delete an administrative member */
const remove = async (id: number): Promise<{ message: string }> => {
  const res = await fetch(`/api/administrativos/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error deleting');
  }
  return res.json();
};

export const administrativoService = {
  getTodos,
  create,
  update,
  remove,
};