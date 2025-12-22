import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { BsPencil, BsTrash, BsPlusCircle, BsCloudUpload } from 'react-icons/bs';
import styles from '../GestionSecundariaPage.module.css'; 
import { actividadesService, type Actividad, type FotoGaleria } from '../../../api/services/actividadesService';
import { IMAGE_BASE_URL } from '../../../api/apiClient';

const initialState = {
  titulo: '',
  descripcion: '',
  categoria: 'Cultural',
  fecha: new Date().toISOString().split('T')[0],
};


export function ActividadesManager() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // ESTADOS DEL FORMULARIO
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(initialState);
  
  // ARCHIVOS
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [existingGallery, setExistingGallery] = useState<FotoGaleria[]>([]);

  useEffect(() => {
    cargarActividades();
  }, []);

  const cargarActividades = async () => {
    setIsLoading(true);
    try {
      const data = await actividadesService.getAll();
      setActividades(data);
    } catch (error) {
      console.error("Error al cargar", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (path: string | undefined | null) => {
    if (!path || path === 'null' || path === '') return null;
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/^backend[/\\]/, '').replace(/^uploads[/\\]/, '').replace(/^\//, '');
    return `${IMAGE_BASE_URL}uploads/${cleanPath}`;
  };

  const handleOpenForm = async (actividad?: Actividad) => {
    if (actividad) {
      setEditingId(actividad.id!);
      const fechaBD = actividad.fecha_creacion
  ? actividad.fecha_creacion.split(' ')[0]
  : new Date().toISOString().split('T')[0];

    setFormData({
      titulo: actividad.titulo,
      descripcion: actividad.descripcion,
      categoria: actividad.categoria,
      fecha: fechaBD,
      });

      setPreviewImage(getImageUrl(actividad.imagen_url));
      
      // Cargar galería
      if (actividad.id) {
        try {
          const galeriaData = await actividadesService.getGaleriaDetalle(actividad.id);
          setExistingGallery(galeriaData);
        } catch (error) { console.error(error); }
      }
    } else {
      setEditingId(null);
      setFormData(initialState);
      setPreviewImage(null);
      setExistingGallery([]);
    }
    setIsFormOpen(true);
    setSelectedFile(null);
    setGalleryFiles(null);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData(initialState);
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar actividad?')) return;
    try { 
      await actividadesService.delete(id); 
      cargarActividades(); 
    } catch (e) { 
      console.error(e); 
      alert('Error al eliminar'); 
    }
  };

  const handleDeleteFotoGaleria = async (id: number) => {
     try { 
       await actividadesService.deleteFotoGaleria(id); 
       setExistingGallery(p => p.filter(x => x.id !== id)); 
     } catch(e) { console.error(e); }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) await actividadesService.update(editingId, formData, selectedFile || undefined, galleryFiles);
      else await actividadesService.create(formData, selectedFile || undefined, galleryFiles);
      
      setIsFormOpen(false);
      cargarActividades();
      setFormData(initialState);
    } catch (error) { 
      console.error(error); 
      alert("Error al guardar"); 
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => { 
    if(e.target.files?.[0]) { 
      setSelectedFile(e.target.files[0]); 
      setPreviewImage(URL.createObjectURL(e.target.files[0])); 
    } 
  };
  
  const handleGalleryChange = (e: ChangeEvent<HTMLInputElement>) => { 
    if(e.target.files?.length) setGalleryFiles(e.target.files); 
  };

  return (
    <>
      {/* 1. BOTÓN AGREGAR (Se oculta si el formulario está abierto, para mantener orden) */}
      {!isFormOpen && (
        <div style={{ textAlign: 'left' }}>
            <button className={styles.addButton} onClick={() => handleOpenForm()}>
            <BsPlusCircle /> Nueva Actividad
            </button>
        </div>
      )}

      {/* 2. FORMULARIO INCRUSTADO (className={styles.crudForm}) */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className={styles.crudForm}>
          <div className={styles.formGroup}>
  <label>Fecha del Evento:</label>
  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
    <input
      type="date"
      value={formData.fecha}
      onChange={e =>
        setFormData({ ...formData, fecha: e.target.value })
      }
      required
    />
  </div>
</div>

             <h3 style={{marginTop:0, color:'var(--color-primary)', marginBottom:'1rem'}}>
               {editingId ? 'Editar Actividad' : 'Nueva Actividad'}
             </h3>

             <div className={styles.formGroup}>
               <label>Título:</label>
               <input type="text" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} required />
             </div>
             
             <div className={styles.formGroup}>
                <label>Descripción:</label>
                <textarea rows={3} value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
             </div>
             
             <div className={styles.formGroup}>
               <label>Categoría:</label>
               <select value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})}>
                 <option>Cultural</option>
                 <option>Deportes</option>
                 <option>Académico</option>
                 <option>Institucional</option>
               </select>
             </div>
             
             {/* PORTADA - Estilo botón azul */}
             <div className={styles.formGroup}>
                <label>Portada:</label>
                <div className={styles.fileInputWrapper}>
                  <label htmlFor="portada-input" className={styles.fileLabel}>
                     <BsCloudUpload style={{marginRight:5}}/> Seleccionar Imagen
                  </label>
                  <input id="portada-input" type="file" accept="image/*" onChange={handleImageChange} className={styles.hiddenInput} />
                </div>
                {previewImage && <img src={previewImage} style={{height:100, marginTop:10, borderRadius:8, objectFit:'cover'}} alt="Preview"/>}
             </div>
             
             {/* GALERÍA - Estilo botón gris */}
             <div className={styles.formGroup}>
                <label>Galería (Opcional):</label>
                <div className={styles.fileInputWrapper}>
                  <label htmlFor="galeria-input" className={styles.fileLabel} style={{background:'#6c757d'}}>
                     <BsCloudUpload style={{marginRight:5}}/> Añadir Varias Fotos
                  </label>
                  <input id="galeria-input" type="file" multiple accept="image/*" onChange={handleGalleryChange} className={styles.hiddenInput} />
                </div>
                
                {existingGallery.length > 0 && (
                  <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:10}}>
                    {existingGallery.map(f => (
                      <div key={f.id} style={{position:'relative'}}>
                        <img src={getImageUrl(f.imagen_url)!} height={60} style={{borderRadius:4}} alt=""/>
                        <button type="button" onClick={()=>handleDeleteFotoGaleria(f.id)} style={{position:'absolute', top:-5, right:-5, background:'#dc3545', color:'white', border:'none', borderRadius:'50%', width:20, height:20, fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>x</button>
                      </div>
                    ))}
                  </div>
                )}
             </div>

             <div className={styles.modalActions}>
               <button type="button" onClick={handleCancel} className={styles.cancelBtn}>Cancelar</button>
               <button type="submit" className={styles.saveBtn}>{editingId ? 'Actualizar' : 'Guardar'}</button>
             </div>
        </form>
      )}

      {/* 3. TABLA (Siempre abajo del formulario) */}
      {isLoading ? <p>Cargando actividades...</p> : (
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Portada</th>
              <th>Título</th>
              <th>Categoría</th>
              <th>Stats</th>
              <th>Acciones</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            
            {actividades.map((act) => (
              <tr key={act.id}>
                <td>
                  {getImageUrl(act.imagen_url) ? 
                    <img src={getImageUrl(act.imagen_url)!} className={styles.tableImage} alt="Portada" /> : 
                    <div className={styles.tableImage} style={{background:'#eee', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', color:'#999'}}>Sin img</div>}
                </td>
                <td style={{fontWeight:'bold'}}>{act.titulo}</td>
                <td><span style={{background:'#eef2ff', color:'var(--color-primary)', padding:'4px 8px', borderRadius:'12px', fontSize:'0.85rem'}}>{act.categoria}</span></td>
                <td style={{fontSize:'0.9rem', color:'#666'}}>❤️ {act.likes || 0}</td>
                <td className={styles.actionsCell}>
                  <button onClick={() => handleOpenForm(act)} className={styles.editBtn}><BsPencil /></button>
                  <button onClick={() => handleDelete(act.id!)} className={styles.deleteBtn}><BsTrash /></button>
                </td>
                <td style={{ fontSize: '0.9rem' }}>
                  {act.fecha_creacion
                  ? new Date(act.fecha_creacion).toLocaleDateString()
                  : '-'}
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}