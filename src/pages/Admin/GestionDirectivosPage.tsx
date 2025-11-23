import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { BsPencil, BsTrash, BsPlusCircle } from 'react-icons/bs';
// Reutilizamos los estilos existentes
import styles from './GestionSecundariaPage.module.css'; 
import { directivoService, type Directivo } from '../../api/services/directivoService';
import { IMAGE_BASE_URL } from '../../api/apiClient';

const initialState = {
  nombre: '',
  cargo: '',
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

  // --- HELPER: Limpiar URL de imagen ---
  const getImageUrl = (path: string | null) => {
    if (!path || path === 'null' || path === '') return null;
    if (path.startsWith('http')) return path;
    let cleanPath = path.replace(/^backend[/\\]/, '');
    cleanPath = cleanPath.replace(/\\/g, '/');
    return `${IMAGE_BASE_URL}${cleanPath}`;
  };

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
      if (editingDirectivo) {
        setPreviewImage(getImageUrl(editingDirectivo.imagen_url));
      } else {
        setPreviewImage(null);
      }
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
        turno: directivo.turno,
      });
      setPreviewImage(getImageUrl(directivo.imagen_url));
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
        if (selectedFile) data.append('imagen', selectedFile);
        await directivoService.update(editingDirectivo.id, data);
      } else {
        if (selectedFile) data.append('imagen', selectedFile);
        await directivoService.create(data);
      }
      setIsFormOpen(false);
      cargarDirectivos();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError('Error al guardar directivo');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Eliminar este directivo?')) {
      try {
        setError(null);
        await directivoService.remove(id);
        cargarDirectivos();
      } catch (err) {
        console.error(err);
        setError('No se pudo eliminar');
      }
    }
  };

  return (
    <div className={styles.adminPageContainer}>
      <h2>Gestión de Personal Directivo</h2>

      <button className={styles.addButton} onClick={() => handleOpenForm()}>
        <BsPlusCircle /> Nuevo Directivo
      </button>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {isFormOpen && (
        <form onSubmit={handleSubmit} className={styles.crudForm}>
          <h4>{editingDirectivo ? 'Editar' : 'Nuevo'} Directivo</h4>
          
          <div className={styles.formGroup}>
            <label>Nombre y Apellidos</label>
            <input name="nombre" value={formData.nombre} onChange={handleTextChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Cargo</label>
            <input name="cargo" value={formData.cargo} onChange={handleTextChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Turno</label>
            <select name="turno" value={formData.turno} onChange={handleTextChange}>
              <option value="Mañana">Mañana</option>
              <option value="Tarde">Tarde</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Foto (Opcional)</label>
            <input type="file" name="imagen" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className={styles.imagePreview}>
            <p>Vista previa:</p>
            {previewImage ? (
              <img src={previewImage} alt="Preview" onError={(e) => e.currentTarget.style.display = 'none'} />
            ) : (
              <div style={{width: '100px', height: '100px', background: '#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', border:'1px dashed #ccc'}}>Sin imagen</div>
            )}
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn}>Guardar</button>
            <button type="button" onClick={() => setIsFormOpen(false)} className={styles.cancelBtn}>Cancelar</button>
          </div>
        </form>
      )}

      {isLoading && <p>Cargando datos...</p>}
      
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
            {directivos.map((directivo) => {
              const imgUrl = getImageUrl(directivo.imagen_url);
              return (
                <tr key={directivo.id}>
                  <td>
                    {imgUrl ? (
                      <img src={imgUrl} alt={directivo.nombre} className={styles.tableImage} onError={(e) => e.currentTarget.style.display='none'} />
                    ) : (
                      <div className={styles.tableImage} style={{background: '#eee', display:'flex', alignItems:'center', justifyContent:'center'}}><span style={{fontSize:'10px'}}>Sin foto</span></div>
                    )}
                  </td>
                  <td>{directivo.nombre}</td>
                  <td>{directivo.cargo}</td>
                  <td>{directivo.turno}</td>
                  <td className={styles.actionsCell}>
                    <button onClick={() => handleOpenForm(directivo)} className={styles.editBtn}><BsPencil /></button>
                    <button onClick={() => handleDelete(directivo.id)} className={styles.deleteBtn}><BsTrash /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}