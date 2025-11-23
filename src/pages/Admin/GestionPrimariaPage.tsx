import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { BsPencil, BsTrash, BsPlusCircle } from 'react-icons/bs';
import styles from './GestionPrimariaPage.module.css';
import { seccionService, type Seccion } from '../../api/services/seccionService';
// Importamos la URL base de las imágenes desde tu configuración
import { IMAGE_BASE_URL } from '../../api/apiClient';

const mockGrados = [
  { id: 1, nombre: 'Primer Grado' },
  { id: 2, nombre: 'Segundo Grado' },
  { id: 3, nombre: 'Tercer Grado' },
  { id: 4, nombre: 'Cuarto Grado' },
  { id: 5, nombre: 'Quinto Grado' },
  { id: 6, nombre: 'Sexto Grado' },
];

const initialState = {
  nombre_seccion: '',
  docente_nombre: '',
  turno: 'Mañana' as 'Mañana' | 'Tarde',
};

export function GestionPrimariaPage() {
  const [gradoSeleccionado, setGradoSeleccionado] = useState<number>(1);
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

  // Helper para construir la URL correcta de la imagen
  const getImageUrl = (path: string | null) => {
    if (!path) return '/placeholder-docente.png';
    // Corrección de ruta: si la BD guardó "backend/uploads/...", lo limpiamos
    const cleanPath = path.replace(/^backend\//, ''); 
    // Retorna ej: http://localhost/ofelia-api/uploads/foto.jpg
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
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewImage(null);
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
      // Usamos el helper para mostrar la imagen existente
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
        // El ID ahora se pasa como primer argumento
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
      else setError('Ocurrió un error desconocido');
    }
  };

  const handleDelete = async (seccionId: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta sección?')) {
      try {
        setError(null);
        await seccionService.remove(seccionId);
        cargarSecciones(gradoSeleccionado);
      } catch (err) {
        console.error(err);
        if (err instanceof Error) setError(err.message);
        else setError('No se pudo eliminar la sección');
      }
    }
  };

  return (
    <div className={styles.adminPageContainer}>
      <h2>Gestión de Secciones de Primaria</h2>

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
        <BsPlusCircle /> Nueva Sección para {mockGrados.find(g => g.id === gradoSeleccionado)?.nombre}
      </button>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {isFormOpen && (
        <form onSubmit={handleSubmit} className={styles.crudForm}>
          <h4>{editingSeccion ? 'Editar' : 'Nueva'} Sección</h4>
          
          <div className={styles.formGroup}>
            <label>Sección (A, B, C...)</label>
            <input name="nombre_seccion" value={formData.nombre_seccion} onChange={handleTextChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Docente (Nombre y Apellido)</label>
            <input name="docente_nombre" value={formData.docente_nombre} onChange={handleTextChange} required />
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

          {previewImage && (
            <div className={styles.imagePreview}>
              <p>Previsualización:</p>
              {/* Nota: La previsualización local usa blob:, la remota usa getImageUrl */}
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
              <th>Sección</th>
              <th>Docente</th>
              <th>Turno</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {secciones.map((seccion) => (
              <tr key={seccion.id}>
                <td>
                  <img 
                    src={getImageUrl(seccion.imagen_url)} 
                    alt={seccion.docente_nombre}
                    className={styles.tableImage}
                  />
                </td>
                <td>{seccion.nombre_seccion}</td>
                <td>{seccion.docente_nombre}</td>
                <td>{seccion.turno}</td>
                <td className={styles.actionsCell}>
                  <button onClick={() => handleOpenForm(seccion)} className={styles.editBtn}><BsPencil /></button>
                  <button onClick={() => handleDelete(seccion.id)} className={styles.deleteBtn}><BsTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}