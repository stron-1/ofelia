import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs'; 
import styles from './PersonalAdministrativo.module.css';

// Importamos el servicio y la URL base
import { administrativoService, type Administrativo } from '../../../../api/services/administrativoService';
import { IMAGE_BASE_URL } from '../../../../api/apiClient';

export function PersonalAdministrativo() {
  const [administrativos, setAdministrativos] = useState<Administrativo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await administrativoService.getTodos();
        setAdministrativos(data);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar la lista de personal administrativo.');
      } finally {
        setIsLoading(false);
      }
    };
    cargarDatos();
  }, []);

  // Helper para limpiar la ruta de la imagen (Igual que en Directivos)
  const getImageUrl = (path: string | null) => {
    if (!path || path === 'null' || path === '') return null;
    if (path.startsWith('http')) return path;
    
    // Limpieza de rutas cruzadas
    let cleanPath = path.replace(/^backend[/\\]/, '');
    cleanPath = cleanPath.replace(/\\/g, '/');
    
    return `${IMAGE_BASE_URL}${cleanPath}`;
  };

  return (
    <div className={styles.personalPageContainer}>
      
      {/* 1. NAVEGACIÓN */}
      <nav className={styles.pageNavigation}>
        <Link to="/academico/directivos" className={styles.backLink}>
          <BsArrowLeft /> Volver a Directivos
        </Link>
        {/* Aquí podrías poner un botón a la derecha si hubiera otra página */}
        <div></div> 
      </nav>

      {/* 2. ENCABEZADO */}
      <header className={styles.contentHeader}>
        <h1>Personal Administrativo</h1>
        <p>
          El equipo de soporte que asegura el buen funcionamiento de nuestra
          institución día a día, brindando atención de calidad.
        </p>
      </header>

      {/* 3. CONTENIDO */}
      {isLoading && <p className={styles.loadingMessage}>Cargando información...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {!isLoading && !error && (
        <div className={styles.profileGrid}>
          {administrativos.map((admin) => {
            const imgUrl = getImageUrl(admin.imagen_url);
            
            return (
              <div className={styles.profileCard} key={admin.id}>
                {/* A. La Foto */}
                <div className={styles.profileImageContainer}>
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={admin.nombre}
                      className={styles.profileImage}
                      onError={(e) => {
                        // Fallback visual si falla la carga
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.style.backgroundColor = '#e0e0e0';
                        e.currentTarget.parentElement!.innerText = 'Sin Foto';
                        e.currentTarget.parentElement!.style.display = 'flex';
                        e.currentTarget.parentElement!.style.alignItems = 'center';
                        e.currentTarget.parentElement!.style.justifyContent = 'center';
                        e.currentTarget.parentElement!.style.color = '#777';
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%', display: 'flex', 
                      alignItems: 'center', justifyContent: 'center', 
                      color: '#999', flexDirection: 'column'
                    }}>
                      <span style={{fontSize: '3rem'}}>👤</span>
                      <span>Sin Foto</span>
                    </div>
                  )}
                </div>

                {/* B. La Información */}
                <div className={styles.profileContent}>
                  <h3 className={styles.profileName}>{admin.nombre}</h3>
                  <p className={styles.profileCargo}>{admin.cargo}</p>
                  <p className={styles.profileTurno}>Turno: {admin.turno}</p>
                </div>
              </div>
            );
          })}
          
          {administrativos.length === 0 && (
             <p className={styles.noDataMessage}>
               No hay personal administrativo registrado en el sistema.
             </p>
          )}
        </div>
      )}
    </div>
  );
}