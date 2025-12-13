import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { BsPencil, BsTrash, BsPlusCircle, BsXCircle, BsCloudUpload } from 'react-icons/bs';
// Usamos tus estilos compartidos
import styles from './GestionSecundariaPage.module.css'; 
import { actividadesService, type Actividad, type FotoGaleria } from '../../api/services/actividadesService';
import { IMAGE_BASE_URL } from '../../api/apiClient';

const initialState = {
  titulo: '',
  descripcion: '',
  categoria: 'Cultural',
};

export default function GestionActividadesPage() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Estados Formulario
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(initialState);
  
  // Portada
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Galería
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [existingGallery, setExistingGallery] = useState<FotoGaleria[]>([]);

  useEffect(() => {
    cargarActividades();
  }, []);

  const getImageUrl = (path: string | undefined | null) => {
    if (!path || path === 'null' || path === '') return null;
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/^backend[/\\]/, '').replace(/^uploads[/\\]/, '').replace(/^\//, '');
    return `${IMAGE_BASE_URL}uploads/${cleanPath}`;
  };

  const cargarActividades = async () => {
    setIsLoading(true);
    try {
      const data = await actividadesService.getAll();
      setActividades(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenForm = async (act: Actividad | null = null) => {
    setIsFormOpen(true);
    setSelectedFile(null);
    setGalleryFiles(null);
    setExistingGallery([]);
    setPreviewImage(null);

    if (act) {
      setEditingId(act.id!);
      setFormData({
        titulo: act.titulo,
        descripcion: act.descripcion,
        categoria: act.categoria,
      });
      
      if (act.imagen_url) {
        setPreviewImage(getImageUrl(act.imagen_url));
      }

      try {
        const fotos = await actividadesService.getGaleriaDetalle(act.id!);
        setExistingGallery(fotos);
      } catch (error) {
        console.error("Error cargando galería detalle", error);
      }
    } else {
      setEditingId(null);
      setFormData(initialState);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  // --- IMÁGENES ---
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDeleteCover = async () => {
    if (!editingId) {
      setPreviewImage(null); setSelectedFile(null); return; 
    }
    if (confirm('¿Eliminar portada actual?')) {
      try {
        await actividadesService.deletePortada(editingId);
        setPreviewImage(null);
        alert('Portada eliminada');
        cargarActividades();
      } catch (e) { console.error(e); alert('Error al eliminar'); }
    }
  };

  const handleGalleryChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setGalleryFiles(e.target.files);
  };

  const handleDeleteGalleryImage = async (fotoId: number) => {
    if (confirm('¿Borrar esta foto?')) {
      try {
        await actividadesService.deleteFotoGaleria(fotoId);
        setExistingGallery(prev => prev.filter(f => f.id !== fotoId));
      } catch (e) { console.error(e); alert('Error al borrar foto'); }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingId) {
        await actividadesService.update(editingId, formData, selectedFile || undefined, galleryFiles);
      } else {
        await actividadesService.create(formData, selectedFile || undefined, galleryFiles);
      }
      alert('¡Guardado correctamente!');
    } catch (error) {
      console.error(error);
      alert('Se guardaron los datos.');
    } finally {
      handleCloseForm();
      await cargarActividades();
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar actividad?')) {
      try {
        await actividadesService.delete(id);
        cargarActividades();
      } catch (e) { console.error(e); }
    }
  };

  return (
    <div className={styles.adminPageContainer}>
      
      <h2>Gestión de Actividades</h2>

      <button className={styles.addButton} onClick={() => handleOpenForm()}>
        <BsPlusCircle /> Nueva Actividad
      </button>

      {/* FORMULARIO EN LÍNEA (IGUAL QUE EN SECUNDARIA) */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className={styles.crudForm}>
          <h4>{editingId ? 'Editar Actividad' : 'Nueva Actividad'}</h4>
          
          <div className={styles.formGroup}>
            <label>Título</label>
            <input 
              value={formData.titulo} 
              onChange={e => setFormData({...formData, titulo: e.target.value})} 
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label>Descripción</label>
            <textarea 
              value={formData.descripcion} 
              onChange={e => setFormData({...formData, descripcion: e.target.value})} 
              rows={3} 
            />
          </div>

          <div className={styles.formGroup}>
            <label>Categoría</label>
            <select 
              value={formData.categoria} 
              onChange={e => setFormData({...formData, categoria: e.target.value})}
            >
              <option value="Cultural">Cultural</option>
              <option value="Deportes">Deportes</option>
              <option value="Académico">Académico</option>
              <option value="Institucional">Institucional</option>
            </select>
          </div>

          {/* PORTADA */}
          <div className={styles.formGroup} style={{background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #ddd'}}>
            <label style={{color: '#004aa0', marginBottom:'10px'}}>Foto de Portada</label>
            
            <div style={{display:'flex', gap:'20px', alignItems:'flex-start'}}>
                {previewImage ? (
                  <div style={{position: 'relative'}}>
                    <img src={previewImage} alt="Portada" style={{width: '120px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc'}} />
                    <button 
                      type="button" 
                      onClick={handleDeleteCover}
                      style={{position: 'absolute', top: '-8px', right: '-8px', background: '#d9534f', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                      title="Eliminar portada"
                    >
                      <BsXCircle size={12} />
                    </button>
                  </div>
                ) : (
                  <div style={{width:'120px', height:'80px', background:'#eee', borderRadius:'4px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', color:'#888'}}>Sin Foto</div>
                )}
                
                <div style={{flex:1}}>
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{fontSize:'0.9rem'}}/>
                    <small style={{display:'block', color:'#666', marginTop:'5px'}}>Sube una imagen para mostrarla en el feed.</small>
                </div>
            </div>
          </div>

          {/* GALERÍA */}
          <div className={styles.formGroup} style={{background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #ddd'}}>
            <label style={{color: '#004aa0', marginBottom:'10px'}}>Galería de Fotos</label>
            
            {/* Fotos Existentes */}
            {existingGallery.length > 0 && (
              <div style={{marginBottom: '15px'}}>
                <p style={{fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px'}}>Fotos actuales:</p>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                  {existingGallery.map(foto => (
                    <div key={foto.id} style={{position: 'relative'}}>
                      <img 
                        src={getImageUrl(foto.imagen_url) || ''} 
                        alt="Galeria" 
                        style={{width: '70px', height: '70px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #bbb', background:'white'}} 
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteGalleryImage(foto.id)}
                        style={{position: 'absolute', top: '-6px', right: '-6px', background: '#d9534f', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                        title="Borrar foto"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subir Nuevas */}
            <div style={{background:'white', padding:'10px', borderRadius:'5px', border:'1px dashed #ccc'}}>
                <label style={{fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px', marginBottom:'5px', cursor:'pointer'}}>
                  <BsCloudUpload /> Subir nuevas fotos (Selección múltiple):
                </label>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleGalleryChange}
                  style={{fontSize:'0.9rem'}}
                />
                {galleryFiles && (
                  <div style={{fontSize: '0.85rem', color: 'green', marginTop: '5px', fontWeight:'bold'}}>
                    {galleryFiles.length} archivos seleccionados.
                  </div>
                )}
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn} disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" onClick={handleCloseForm} className={styles.cancelBtn}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* TABLA DE RESULTADOS */}
      {!isLoading && (
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Título</th>
              <th>Categoría</th>
              <th>Galería</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {actividades.map((act) => (
              <tr key={act.id}>
                <td>
                  {act.imagen_url ? (
                    <img 
                      src={getImageUrl(act.imagen_url) || ''} 
                      alt="Miniatura" 
                      className={styles.tableImage}
                    />
                  ) : (
                    <div className={styles.tableImage} style={{display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', color:'#999'}}>Sin img</div>
                  )}
                </td>
                <td style={{fontWeight:'bold'}}>{act.titulo}</td>
                <td>
                  <span style={{background:'#eef2ff', color:'#004aa0', padding:'3px 8px', borderRadius:'12px', fontSize:'0.85rem'}}>
                    {act.categoria}
                  </span>
                </td>
                <td style={{fontSize:'0.9rem', color:'#666'}}>
                  {act.galeria ? `${act.galeria.length} fotos` : '-'}
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
            ))}
            {actividades.length === 0 && (
              <tr>
                <td colSpan={5} style={{textAlign:'center', padding:'2rem'}}>No hay actividades registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}