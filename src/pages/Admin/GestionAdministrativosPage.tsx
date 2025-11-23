import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { BsPencil, BsTrash, BsPlusCircle } from 'react-icons/bs';
import styles from './GestionSecundariaPage.module.css'; 
import { administrativoService, type Administrativo } from '../../api/services/administrativoService';
import { IMAGE_BASE_URL } from '../../api/apiClient';

const initialState = {
  nombre: '',
  cargo: '',
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

  const getImageUrl = (path: string | null) => {
    if (!path || path === 'null' || path === '') return null;
    if (path.startsWith('http')) return path;
    let cleanPath = path.replace(/^backend[/\\]/, '');
    cleanPath = cleanPath.replace(/\\/g, '/');
    return `${IMAGE_BASE_URL}${cleanPath}`;
  };

  const cargarAdministrativos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await administrativoService.getTodos();
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
      if (editingAdmin) {
        setPreviewImage(getImageUrl(editingAdmin.imagen_url));
      } else {
        setPreviewImage(null);
      }
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
        turno: admin.turno,
      });
      setPreviewImage(getImageUrl(admin.imagen_url));
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
        if (selectedFile) data.append('imagen', selectedFile);
        await administrativoService.update(editingAdmin.id, data);
      } else {
        if (selectedFile) data.append('imagen', selectedFile);
        await administrativoService.create(data);
      }
      setIsFormOpen(false);
      cargarAdministrativos();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError('Error al guardar administrativo');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Eliminar este administrativo?')) {
      try {
        setError(null);
        await administrativoService.remove(id);
        cargarAdministrativos();
      } catch (err) {
        console.error(err);
        setError('No se pudo eliminar');
      }
    }
  };

  return (
    <div className={styles.adminPageContainer}>
      <h2>Gestión de Personal Administrativo</h2>

      <button className={styles.addButton} onClick={() => handleOpenForm()}>
        <BsPlusCircle /> Nuevo Administrativo
      </button>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {isFormOpen && (
        <form onSubmit={handleSubmit} className={styles.crudForm}>
          <h4>{editingAdmin ? 'Editar' : 'Nuevo'} Administrativo</h4>
          
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
            {administrativos.map((admin) => {
              const imgUrl = getImageUrl(admin.imagen_url);
              return (
                <tr key={admin.id}>
                  <td>
                    {imgUrl ? (
                      <img src={imgUrl} alt={admin.nombre} className={styles.tableImage} onError={(e) => e.currentTarget.style.display='none'} />
                    ) : (
                      <div className={styles.tableImage} style={{background: '#eee', display:'flex', alignItems:'center', justifyContent:'center'}}><span style={{fontSize:'10px'}}>Sin foto</span></div>
                    )}
                  </td>
                  <td>{admin.nombre}</td>
                  <td>{admin.cargo}</td>
                  <td>{admin.turno}</td>
                  <td className={styles.actionsCell}>
                    <button onClick={() => handleOpenForm(admin)} className={styles.editBtn}><BsPencil /></button>
                    <button onClick={() => handleDelete(admin.id)} className={styles.deleteBtn}><BsTrash /></button>
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