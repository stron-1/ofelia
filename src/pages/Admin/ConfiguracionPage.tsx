import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { BsCheckCircle, BsCloudUpload } from 'react-icons/bs';
import styles from './GestionSecundariaPage.module.css'; 
import { authService, type User } from '../../api/services/authService';
import { IMAGE_BASE_URL } from '../../api/apiClient';

export default function ConfiguracionPage() {
  const [user, setUser] = useState<User | null>(null);
  
  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Imagen
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setNombre(u.nombre);
      setEmail(u.email);
      if (u.imagen_url) {
        const cleanPath = u.imagen_url.replace(/^backend[/\\]/, '').replace(/^uploads[/\\]/, '').replace(/^\//, '');
        setPreview(`${IMAGE_BASE_URL}uploads/${cleanPath}`);
      }
    }
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);

    try {
      const response = await authService.updateProfile(
        user.id, 
        { nombre, email, password }, 
        selectedFile || undefined
      );
      
      const updatedUser = { ...user, ...response.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      window.dispatchEvent(new Event('storage'));
      
      alert('Perfil actualizado correctamente');
      setPassword(''); 
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.adminPageContainer}>
      
      {/* Contenedor centralizado */}
      <div className={styles.formContainer}>
        
        <h2 className={styles.pageTitle}>Configuración de Perfil</h2>
        
        <form onSubmit={handleSubmit} className={styles.crudForm}>
          
          {/* SECCIÓN FOTO DE PERFIL (Con nuevos estilos) */}
          <div className={styles.profilePhotoSection}>
            <div className={styles.avatarWrapper}>
               <img 
                 src={preview || `https://ui-avatars.com/api/?name=${nombre || 'User'}&background=ccc&color=fff`} 
                 alt="Perfil" 
                 className={styles.profileAvatarLarge}
               />
               <label htmlFor="filePhoto" className={styles.uploadButton} title="Cambiar foto">
                 <BsCloudUpload size={18} />
               </label>
               <input 
                 id="filePhoto" 
                 type="file" 
                 accept="image/*" 
                 onChange={handleFileChange} 
                 style={{ display: 'none' }} 
               />
            </div>
            <span className={styles.photoLabel}>Foto de Administrador</span>
          </div>

          {/* CAMPOS DE TEXTO (Usando tus clases .formGroup existentes) */}
          <div className={styles.formGroup}>
            <label>Nombre Completo</label>
            <input 
              value={nombre} 
              onChange={e => setNombre(e.target.value)} 
              required 
              placeholder="Tu nombre"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Correo Electrónico</label>
            <input 
              type="email"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="admin@ejemplo.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Nueva Contraseña <small style={{fontWeight:'normal', color:'#666'}}>(Opcional)</small></label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••" 
            />
          </div>

          {/* BOTÓN DE GUARDAR */}
          <div className={styles.formActions} style={{marginTop:'2rem'}}>
            <button 
              type="submit" 
              className={`${styles.saveBtn} ${styles.fullWidthBtn}`} 
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : <><BsCheckCircle /> Guardar Cambios</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}