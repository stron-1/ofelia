import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { BsPencil, BsTrash, BsPlusCircle } from 'react-icons/bs';
// REUTILIZAMOS TUS ESTILOS GLOBALES DE ADMIN
import styles from './GestionSecundariaPage.module.css'; 
import { actividadesService, type Actividad } from '../../api/services/actividadesService';
import { IMAGE_BASE_URL } from '../../api/apiClient';

const initialState = {
  titulo: '',
  descripcion: '',
  categoria: 'Cultural', // Valor por defecto
};

export default function GestionActividadesPage() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para el Modal y Edición
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(initialState);
  
  // Estado para la Imagen de Portada (Individual)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // NUEVO: Estado para la Galería (Múltiples)
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);

  useEffect(() => {
    cargarActividades();
  }, []);

  // Función para corregir la URL de la imagen
  const getImageUrl = (path: string | undefined | null) => {
    if (!path || path === 'null' || path === '') return null;
    if (path.startsWith('http')) return path;
    
    let cleanPath = path.replace(/^backend[/\\]/, '');
    cleanPath = cleanPath.replace(/^uploads[/\\]/, '');
    cleanPath = cleanPath.replace(/^\//, '');

    return `${IMAGE_BASE_URL}uploads/${cleanPath}`;
  };

  const cargarActividades = async () => {
    setIsLoading(true);
    try {
      const data = await actividadesService.getAll();
      setActividades(data);
    } catch {
      console.error('Error al cargar actividades');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenForm = (actividad?: Actividad) => {
    if (actividad) {
      setEditingId(actividad.id!);
      setFormData({
        titulo: actividad.titulo,
        descripcion: actividad.descripcion,
        categoria: actividad.categoria
      });
      // Mostrar imagen actual de portada si existe
      setPreviewImage(getImageUrl(actividad.imagen_url));
    } else {
      setEditingId(null);
      setFormData(initialState);
      setPreviewImage(null);
    }
    // Reiniciar archivos seleccionados
    setSelectedFile(null);
    setGalleryFiles(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  // Maneja la selección de la PORTADA (1 sola foto)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // NUEVO: Maneja la selección de la GALERÍA (Múltiples fotos)
  const handleGalleryChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setGalleryFiles(e.target.files);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingId) {
        // Enviar datos + portada (si cambió) + galería (si hay nuevas)
        await actividadesService.update(
          editingId, 
          formData, 
          selectedFile || undefined, 
          galleryFiles || null
        );
      } else {
        await actividadesService.create(
          formData, 
          selectedFile || undefined, 
          galleryFiles || null
        );
      }
      handleCloseForm();
      cargarActividades();
    } catch {
      alert('Error al guardar. Verifica la conexión o el tamaño de las imágenes.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar esta actividad y todas sus fotos?')) return;
    try {
      await actividadesService.delete(id);
      cargarActividades();
    } catch {
      alert('Error al eliminar');
    }
  };

  return (
    <div className={styles.adminPageContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Gestión de Actividades</h2>
        <button onClick={() => handleOpenForm()} className={styles.addButton}>
          <BsPlusCircle /> Nueva Actividad
        </button>
      </div>

      {isLoading && <p>Cargando...</p>}
      
      {/* --- TABLA --- */}
      <table className={styles.adminTable}>
        <thead>
          <tr>
            <th>Portada</th>
            <th>Título</th>
            <th>Categoría</th>
            <th>Fotos Extra</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {actividades.map((act) => {
            const imgUrl = getImageUrl(act.imagen_url);
            // Calculamos cuántas fotos extra tiene (si el backend ya las mandó en el array 'galeria')
            // Restamos 1 porque el array 'galeria' incluye la portada en nuestra lógica de PHP, a veces
            const countExtras = act.galeria ? act.galeria.length : 0;

            return (
              <tr key={act.id}>
                <td>
                  {imgUrl ? (
                    <img 
                      src={imgUrl} 
                      alt="Miniatura" 
                      className={styles.tableImage} 
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                  ) : (
                    <div className={styles.tableImage} style={{ background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                      Sin Foto
                    </div>
                  )}
                </td>
                <td style={{ fontWeight: 'bold' }}>{act.titulo}</td>
                <td>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', background: '#eef2ff', color: '#004aa0', fontSize: '0.85rem' }}>
                    {act.categoria}
                  </span>
                </td>
                <td>
                    {/* Indicador de galería */}
                    {countExtras > 0 ? (
                        <span style={{fontSize: '0.8rem', color: '#666'}}>
                            {countExtras > 1 ? `${countExtras} fotos` : '1 foto'}
                        </span>
                    ) : '-'}
                </td>
                <td className={styles.actionsCell}>
                  <button onClick={() => handleOpenForm(act)} className={styles.editBtn}>
                    <BsPencil />
                  </button>
                  <button onClick={() => handleDelete(act.id!)} className={styles.deleteBtn}>
                    <BsTrash />
                  </button>
                </td>
              </tr>
            );
          })}
          {actividades.length === 0 && !isLoading && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No hay actividades registradas.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* --- MODAL / FORMULARIO --- */}
      {isFormOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>{editingId ? 'Editar Actividad' : 'Nueva Actividad'}</h3>
            
            <form onSubmit={handleSubmit} className={styles.crudForm}>
              <div className={styles.formGroup}>
                <label>Título:</label>
                <input
                  type="text"
                  required
                  value={formData.titulo}
                  onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Categoría:</label>
                <select
                  value={formData.categoria}
                  onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                >
                  <option value="Institucional">Institucional (Inicio Clases, Maestro)</option>
                  <option value="Cultural">Cultural (Danzas, San Juanero)</option>
                  <option value="Academico">Académico (Feria Eureka)</option>
                  <option value="Social">Social (Día de la Madre)</option>
                  <option value="Ambiental">Ambiental (Reciclatón)</option>
                  <option value="Deporte">Deporte</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Descripción:</label>
                <textarea
                  rows={3}
                  value={formData.descripcion}
                  onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>

              {/* INPUT 1: PORTADA PRINCIPAL */}
              <div className={styles.formGroup}>
                <label>Imagen de Portada (Principal):</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {previewImage && (
                  <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <img src={previewImage} alt="Preview Portada" style={{ maxHeight: '100px', borderRadius: '8px' }} />
                  </div>
                )}
              </div>

              {/* INPUT 2: GALERÍA (NUEVO) */}
              <div className={styles.formGroup} style={{borderTop: '1px dashed #ccc', paddingTop: '1rem'}}>
                <label style={{color: '#004aa0'}}>Galería de Fotos (Selecciona varias):</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple  // <--- ESTO PERMITE SUBIR VARIAS
                  onChange={handleGalleryChange} 
                />
                <small style={{display:'block', marginTop:'5px', color:'#666'}}>
                   Mantén presionada la tecla Ctrl (Windows) o Cmd (Mac) para seleccionar varias fotos a la vez.
                </small>
                {galleryFiles && (
                    <div style={{marginTop: '5px', fontSize: '0.9rem', color: 'green'}}>
                        {galleryFiles.length} archivos seleccionados para subir.
                    </div>
                )}
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={handleCloseForm} className={styles.cancelBtn}>
                  Cancelar
                </button>
                <button type="submit" className={styles.saveBtn} disabled={isLoading}>
                  {isLoading ? 'Guardando...' : 'Guardar Todo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}