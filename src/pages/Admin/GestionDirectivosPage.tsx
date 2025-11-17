import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { BsPencil, BsTrash, BsPlusCircle } from 'react-icons/bs';
// Reutilizamos los mismos estilos de las otras páginas de gestión
import styles from './GestionPrimariaPage.module.css'; 
import { directivoService, type Directivo } from '../../api/services/directivoService';

const initialState = {
  nombre: '',
  cargo: 'Director General', // Valor por defecto
  turno: 'Mañana',
};

export function GestionDirectivosPage() {
  const [directivos, setDirectivos] = useState<Directivo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDirectivo, setEditingDirectivo] = useState<Directivo | null>(null);
  const [formData, setFormData] = useState(initialState);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  useEffect(() => {
    cargarDirectivos();
  }, []);

  const cargarDirectivos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await directivoService.getTodos();
      setDirectivos(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar el personal directivo.');
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

  const handleOpenForm = (directivo: Directivo | null = null) => {
    setIsFormOpen(true);
    setError(null);
    if (directivo) {
      setEditingDirectivo(directivo);
      setFormData({
        nombre: directivo.nombre,
        cargo: directivo.cargo,
        turno: directivo.turno as 'Mañana' | 'Tarde',
      });
      setPreviewImage(directivo.imagen_url ? `/${directivo.imagen_url}` : null);
    } else {
      setEditingDirectivo(null);
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
      if (editingDirectivo) {
        if (selectedFile) {
          data.append('imagen', selectedFile);
        }
        await directivoService.update(editingDirectivo.id, data);
      } else {
        if (selectedFile) {
          data.append('imagen', selectedFile);
        }
        await directivoService.create(data);
      }
      setIsFormOpen(false);
      cargarDirectivos(); // Recargar la lista
    } catch (err) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError('Ocurrió un error desconocido');
    }
  };

  const handleDelete = async (directivoId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar a este miembro?')) {
      try {
        setError(null);
        await directivoService.remove(directivoId);
        cargarDirectivos(); // Recargar la lista
      } catch (err) {
        console.error(err);
        if (err instanceof Error) setError(err.message);
        else setError('Ocurrió un error desconocido');
      }
    }
  };

  return (
    <div className={styles.adminPageContainer}>
      <h2>Gestión de Personal Directivo</h2>

      <button className={styles.addButton} onClick={() => handleOpenForm()}>
        <BsPlusCircle /> Añadir Nuevo Miembro
      </button>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {isFormOpen && (
        <form onSubmit={handleSubmit} className={styles.crudForm}>
          <h4>{editingDirectivo ? 'Editar' : 'Nuevo'} Miembro Directivo</h4>
          
          <div className={styles.formGroup}>
            <label>Nombre y Apellido</label>
            <input name="nombre" value={formData.nombre} onChange={handleTextChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Cargo</label>
            <select name="cargo" value={formData.cargo} onChange={handleTextChange}>
              <option value="Director General">Director General</option>
              <option value="Subdirector(a)">Subdirector(a)</option>
              {/* Añade más cargos fijos si lo necesitas */}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Turno</label>
            <select name="turno" value={formData.turno} onChange={handleTextChange}>
              <option value="Mañana">Mañana</option>
              <option value="Tarde">Tarde</option>
              <option value="Completo">Completo</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Foto (Opcional)</label>
            <input type="file" name="imagen" accept="image/*" onChange={handleFileChange} />
          </div>

          {previewImage && (
            <div className={styles.imagePreview}>
              <p>Previsualización:</p>
              <img src={previewImage} alt="Previsualización" />
            </div>
          )}

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn}>Guardar</button>
            <button type="button" onClick={() => setIsFormOpen(false)} className={styles.cancelBtn}>Cancelar</button>
          </div>
        </form>
      )}

      {isLoading && <p>Cargando...</p>}
      
      {!isLoading && !error && (
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Imagen</th> 
              <th>Nombre</th>
              <th>Cargo</th>
              <th>Turno</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {directivos.map((directivo) => (
              <tr key={directivo.id}>
                <td>
                  <img 
                    src={directivo.imagen_url ? `/${directivo.imagen_url}` : '/placeholder-docente.png'} 
                    alt={directivo.nombre}
                    className={styles.tableImage}
                  />
                </td>
                <td>{directivo.nombre}</td>
                <td>{directivo.cargo}</td>
                <td>{directivo.turno}</td>
                <td className={styles.actionsCell}>
                  <button onClick={() => handleOpenForm(directivo)} className={styles.editBtn}><BsPencil /></button>
                  <button onClick={() => handleDelete(directivo.id)} className={styles.deleteBtn}><BsTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}