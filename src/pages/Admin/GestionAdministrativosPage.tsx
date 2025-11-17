import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { BsPencil, BsTrash, BsPlusCircle } from 'react-icons/bs';
import styles from './GestionPrimariaPage.module.css'; // Reutilizamos estilos
import { administrativoService, type Administrativo } from '../../api/services/administrativoService'; // <-- Servicio correcto

const initialState = {
  nombre: '',
  cargo: '', // El admin debe escribir el cargo
  turno: 'Mañana',
};

export function GestionAdministrativosPage() {
  const [administrativos, setAdministrativos] = useState<Administrativo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Administrativo | null>(null);
  const [formData, setFormData] = useState(initialState);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    cargarAdministrativos();
  }, []);

  const cargarAdministrativos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await administrativoService.getTodos(); // <-- Usar servicio correcto
      setAdministrativos(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar el personal administrativo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewImage(null);
    }
  };

  const handleOpenForm = (admin: Administrativo | null = null) => {
    setIsFormOpen(true);
    setError(null);
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        nombre: admin.nombre,
        cargo: admin.cargo,
        turno: admin.turno as 'Mañana' | 'Tarde' | 'Completo',
      });
      setPreviewImage(admin.imagen_url ? `/${admin.imagen_url}` : null);
    } else {
      setEditingAdmin(null);
      setFormData(initialState);
      setPreviewImage(null);
    }
    setSelectedFile(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const data = new FormData();
    data.append('nombre', formData.nombre);
    data.append('cargo', formData.cargo);
    data.append('turno', formData.turno);

    try {
      if (editingAdmin) {
        if (selectedFile) {
          data.append('imagen', selectedFile);
        }
        await administrativoService.update(editingAdmin.id, data); // <-- Usar servicio correcto
      } else {
        if (selectedFile) {
          data.append('imagen', selectedFile);
        }
        await administrativoService.create(data); // <-- Usar servicio correcto
      }
      setIsFormOpen(false);
      cargarAdministrativos();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError('Ocurrió un error desconocido');
    }
  };

  const handleDelete = async (adminId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar a este miembro?')) {
      try {
        setError(null);
        await administrativoService.remove(adminId); // <-- Usar servicio correcto
        cargarAdministrativos();
      } catch (err) {
        console.error(err);
        if (err instanceof Error) setError(err.message);
        else setError('Ocurrió un error desconocido');
      }
    }
  };

  return (
    <div className={styles.adminPageContainer}>
      <h2>Gestión de Personal Administrativo</h2> {/* <-- Texto en Español */}

      <button className={styles.addButton} onClick={() => handleOpenForm()}>
        <BsPlusCircle /> Añadir Nuevo Miembro {/* <-- Texto en Español */}
      </button>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {isFormOpen && (
        <form onSubmit={handleSubmit} className={styles.crudForm}>
          <h4>{editingAdmin ? 'Editar' : 'Nuevo'} Miembro Administrativo</h4> {/* <-- Texto en Español */}

          <div className={styles.formGroup}>
            <label>Nombre y Apellido</label> {/* <-- Texto en Español */}
            <input name="nombre" value={formData.nombre} onChange={handleTextChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Cargo / Puesto</label> {/* <-- Texto en Español */}
            <input name="cargo" value={formData.cargo} onChange={handleTextChange} placeholder="Ej: Secretaria, Contador(a)" required />
          </div>
          <div className={styles.formGroup}>
            <label>Turno</label> {/* <-- Texto en Español */}
            <select name="turno" value={formData.turno} onChange={handleTextChange}>
              <option value="Mañana">Mañana</option>
              <option value="Tarde">Tarde</option>
              <option value="Completo">Completo</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Foto (Opcional)</label> {/* <-- Texto en Español */}
            <input type="file" name="imagen" accept="image/*" onChange={handleFileChange} />
          </div>

          {previewImage && (
            <div className={styles.imagePreview}>
              <p>Previsualización:</p> {/* <-- Texto en Español */}
              <img src={previewImage} alt="Previsualización" />
            </div>
          )}

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn}>Guardar</button> {/* <-- Texto en Español */}
            <button type="button" onClick={() => setIsFormOpen(false)} className={styles.cancelBtn}>Cancelar</button> {/* <-- Texto en Español */}
          </div>
        </form>
      )}

      {isLoading && <p>Cargando...</p>} {/* <-- Texto en Español */}

      {!isLoading && !error && (
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Imagen</th> {/* <-- Texto en Español */}
              <th>Nombre</th> {/* <-- Texto en Español */}
              <th>Cargo</th> {/* <-- Texto en Español */}
              <th>Turno</th> {/* <-- Texto en Español */}
              <th>Acciones</th> {/* <-- Texto en Español */}
            </tr>
          </thead>
          <tbody>
            {administrativos.map((admin) => (
              <tr key={admin.id}>
                <td>
                  <img
                    src={admin.imagen_url ? `/${admin.imagen_url}` : '/placeholder-docente.png'}
                    alt={admin.nombre}
                    className={styles.tableImage}
                  />
                </td>
                <td>{admin.nombre}</td>
                <td>{admin.cargo}</td>
                <td>{admin.turno}</td>
                <td className={styles.actionsCell}>
                  <button onClick={() => handleOpenForm(admin)} className={styles.editBtn}><BsPencil /></button>
                  <button onClick={() => handleDelete(admin.id)} className={styles.deleteBtn}><BsTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}