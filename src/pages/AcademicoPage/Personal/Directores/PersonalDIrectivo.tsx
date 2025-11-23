import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import styles from './PersonalDIrectivo.module.css';

// Importamos servicios
import { directivoService, type Directivo } from '../../../../api/services/directivoService';
import { IMAGE_BASE_URL } from '../../../../api/apiClient';

export function PersonalDirectivo() {
  const [directivos, setDirectivos] = useState<Directivo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await directivoService.getTodos();
        setDirectivos(data);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar la lista de directivos.');
      } finally {
        setIsLoading(false);
      }
    };
    cargarDatos();
  }, []);

  // Helper para limpiar la ruta de la imagen (Docker/Windows/Linux)
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
      
      {/* 1. NAVEGACIÓN (Izquierda: Niveles, Derecha: Administrativos) */}
      <nav className={styles.pageNavigation}>
        <Link to="/academico" className={styles.backLink}>
          <BsArrowLeft /> Volver a Niveles
        </Link>
        <Link to="/academico/administrativos" className={styles.contextLink}>
          Ver Personal Administrativo <BsArrowRight />
        </Link>
      </nav>

      {/* 2. TÍTULO */}
      <header className={styles.contentHeader}>
        <h1>Personal Directivo</h1>
        <p>
          Conoce al equipo que lidera nuestra institución, garantizando la calidad 
          educativa y el bienestar de nuestra comunidad escolar.
        </p>
      </header>

      {/* 3. CONTENIDO (Info + Galería en la misma tarjeta) */}
      {isLoading && <p className={styles.loadingMessage}>Cargando información...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {!isLoading && !error && (
        <div className={styles.profileGrid}>
          {directivos.map((directivo) => {
            const imgUrl = getImageUrl(directivo.imagen_url);
            
            return (
              <div className={styles.profileCard} key={directivo.id}>
                {/* A. La Foto (Galería) */}
                <div className={styles.profileImageContainer}>
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={`Foto de ${directivo.nombre}`}
                      className={styles.profileImage}
                      onError={(e) => {
                        // Si falla la carga, ocultamos la imagen rota y mostramos un color de fondo
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
                    // Placeholder si no hay foto subida
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

                {/* B. La Información (Texto) */}
                <div className={styles.profileContent}>
                  <h3 className={styles.profileName}>{directivo.nombre}</h3>
                  <p className={styles.profileCargo}>{directivo.cargo}</p>
                  <p className={styles.profileTurno}>Turno: {directivo.turno}</p>
                </div>
              </div>
            );
          })}
          
          {directivos.length === 0 && (
             <p className={styles.noDataMessage}>
               No hay personal directivo registrado en el sistema.
             </p>
          )}
        </div>
      )}
    </div>
  );
}