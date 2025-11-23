import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { BsPencil, BsTrash, BsPlusCircle } from 'react-icons/bs';
// Reutilizamos estilos
import styles from './GestionSecundariaPage.module.css'; 
import { seccionService, type Seccion } from '../../api/services/seccionService';
import { IMAGE_BASE_URL } from '../../api/apiClient';

// IDs para Secundaria
const mockGrados = [
  { id: 7, nombre: 'Primer Grado - Secundaria' },
  { id: 8, nombre: 'Segundo Grado - Secundaria' },
  { id: 9, nombre: 'Tercer Grado - Secundaria' },
  { id: 10, nombre: 'Cuarto Grado - Secundaria' },
  { id: 11, nombre: 'Quinto Grado - Secundaria' },
];

const initialState = {
  nombre_seccion: '',
  docente_nombre: '',
  turno: 'Mañana' as 'Mañana' | 'Tarde',
};

export function GestionSecundariaPage() {
  const [gradoSeleccionado, setGradoSeleccionado] = useState<number>(7);
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSeccion, setEditingSeccion] = useState<Seccion | null>(null);
  const [formData, setFormData] = useState(initialState);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    cargarSecciones(gradoSeleccionado);
  }, [gradoSeleccionado]);

  // --- HELPER: Limpiar y Construir URL de imagen ---
  const getImageUrl = (path: string | null) => {
    // Si no hay ruta válida, devolvemos null
    if (!path || path === 'null' || path === '') return null;
    
    // Si ya es web completa, la usamos
    if (path.startsWith('http')) return path;

    // Limpiamos 'backend/' y barras invertidas de Windows
    let cleanPath = path.replace(/^backend[/\\]/, ''); 
    cleanPath = cleanPath.replace(/\\/g, '/');

    // Concatenamos con la URL base (http://localhost/ofelia-api/)
    return `${IMAGE_BASE_URL}${cleanPath}`;
  };

  const cargarSecciones = async (gradoId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await seccionService.getPorGrado(gradoId);
      setSecciones(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las secciones.');
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
      // Creamos una URL temporal local para previsualizar lo que acabamos de subir
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      // Si cancela la selección, restauramos la imagen de la BD si estamos editando
      if (editingSeccion) {
        setPreviewImage(getImageUrl(editingSeccion.imagen_url));
      } else {
        setPreviewImage(null);
      }
    }
  };

  const handleOpenForm = (seccion: Seccion | null = null) => {
    setIsFormOpen(true);
    setError(null);
    if (seccion) {
      setEditingSeccion(seccion);
      setFormData({
        nombre_seccion: seccion.nombre_seccion,
        docente_nombre: seccion.docente_nombre,
        turno: seccion.turno as 'Mañana' | 'Tarde',
      });
      // Cargamos la imagen existente
      setPreviewImage(getImageUrl(seccion.imagen_url));
    } else {
      setEditingSeccion(null);
      setFormData(initialState);
      setPreviewImage(null);
    }
    setSelectedFile(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const data = new FormData();
    data.append('nombre_seccion', formData.nombre_seccion);
    data.append('docente_nombre', formData.docente_nombre);
    data.append('turno', formData.turno);
    
    try {
      if (editingSeccion) {
        if (selectedFile) {
          data.append('imagen', selectedFile);
        }
        await seccionService.update(editingSeccion.id, data);
      } else {
        data.append('grado_id', String(gradoSeleccionado));
        if (selectedFile) {
          data.append('imagen', selectedFile);
        }
        await seccionService.create(data);
      }
      setIsFormOpen(false);
      cargarSecciones(gradoSeleccionado);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError('Error al guardar la sección');
    }
  };

  const handleDelete = async (seccionId: number) => {
    if (window.confirm('¿Eliminar esta sección permanentemente?')) {
      try {
        setError(null);
        await seccionService.remove(seccionId);
        cargarSecciones(gradoSeleccionado);
      } catch (err) {
        console.error(err);
        setError('No se pudo eliminar la sección');
      }
    }
  };

  return (
    <div className={styles.adminPageContainer}>
      <h2>Gestión de Secundaria</h2>

      <div className={styles.filterSection}>
        <label htmlFor="gradeSelect">Seleccionar Grado:</label>
        <select
          id="gradeSelect"
          value={gradoSeleccionado}
          onChange={(e) => setGradoSeleccionado(Number(e.target.value))}
        >
          {mockGrados.map((grado) => (
            <option key={grado.id} value={grado.id}>
              {grado.nombre}
            </option>
          ))}
        </select>
      </div>

      <button className={styles.addButton} onClick={() => handleOpenForm()}>
        <BsPlusCircle /> Nueva Sección
      </button>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {isFormOpen && (
        <form onSubmit={handleSubmit} className={styles.crudForm}>
          <h4>{editingSeccion ? 'Editar' : 'Nueva'} Sección</h4>
          
          <div className={styles.formGroup}>
            <label>Sección</label>
            <input 
              name="nombre_seccion" 
              value={formData.nombre_seccion} 
              onChange={handleTextChange} 
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label>Docente Tutor</label>
            <input 
              name="docente_nombre" 
              value={formData.docente_nombre} 
              onChange={handleTextChange} 
              required 
            />
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
              <img 
                src={previewImage} 
                alt="Preview" 
                style={{ maxWidth: '150px', borderRadius: '8px', border: '1px solid #ddd' }}
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
            ) : (
              <div style={{
                width: '120px', height: '120px', background: '#f0f0f0', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#888', border: '1px dashed #ccc', borderRadius: '8px'
              }}>
                Sin imagen
              </div>
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
              <th>Foto</th> 
              <th>Grado</th> {/* <--- NUEVA COLUMNA */}
              <th>Sección</th>
              <th>Tutor</th>
              <th>Turno</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {secciones.map((seccion) => {
              const imgUrl = getImageUrl(seccion.imagen_url);
              
              // TRUCO: Buscamos el nombre del grado basándonos en el ID guardado
              const nombreGrado = mockGrados.find(g => g.id === seccion.grado_id)?.nombre || 'Grado Desconocido';

              return (
                <tr key={seccion.id}>
                  <td>
                    {imgUrl ? (
                      <img 
                        src={imgUrl} 
                        alt={seccion.docente_nombre}
                        className={styles.tableImage}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className={styles.tableImage} style={{background: '#eee', display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <span style={{fontSize:'10px', color: '#666'}}>Sin foto</span>
                      </div>
                    )}
                  </td>
                  
                  {/* AQUI SE MUESTRA EL TEXTO EN VEZ DEL NUMERO */}
                  <td style={{fontWeight: 'bold', color: '#555'}}>{nombreGrado}</td>
                  
                  <td>{seccion.nombre_seccion}</td>
                  <td>{seccion.docente_nombre}</td>
                  <td>{seccion.turno}</td>
                  <td className={styles.actionsCell}>
                    <button onClick={() => handleOpenForm(seccion)} className={styles.editBtn}><BsPencil /></button>
                    <button onClick={() => handleDelete(seccion.id)} className={styles.deleteBtn}><BsTrash /></button>
                  </td>
                </tr>
              );
            })}
            {secciones.length === 0 && (
              <tr>
                <td colSpan={6} style={{textAlign: 'center', padding: '1rem'}}>
                  No hay registros en este grado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}