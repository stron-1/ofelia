import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import styles from './PersonalDIrectivo.module.css';
// Importamos el servicio y el tipo
import { directivoService, type Directivo } from '../../../../api/services/directivoService';

export function PersonalDirectivo() {
  // Estados para los datos de la API
  const [directivos, setDirectivos] = useState<Directivo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
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
    cargarDatos();
  }, []);

  return (
    <div className={styles.personalPageContainer}>
      <nav className={styles.pageNavigation}>
        <Link to="/academico" className={styles.backLink}>
          <BsArrowLeft /> Volver a Niveles
        </Link>
        <Link
          to="/academico/personal/administrativos"
          className={styles.contextLink}
        >
          Avanzar a Administrativos <BsArrowRight />
        </Link>
      </nav>

      <header className={styles.contentHeader}>
        <h1>Personal Directivo</h1>
        <p>
          Conoce al equipo que lidera nuestra institución con dedicación y
          profesionalismo, guiando el camino hacia la excelencia.
        </p>
      </header>

      {/* Renderizado condicional */}
      {isLoading && <p className={styles.loadingMessage}>Cargando personal directivo...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {!isLoading && !error && (
        <div className={styles.profileGrid}>
          {directivos.map((directivo) => (
            <div className={styles.profileCard} key={directivo.id}>
              <div className={styles.profileImageContainer}> {/* Contenedor para la imagen */}
                <img
                  src={directivo.imagen_url ? `/${directivo.imagen_url}` : '/placeholder-docente.png'}
                  alt={directivo.nombre}
                  className={styles.profileImage} // Estilo para la imagen
                />
              </div>
              <div className={styles.profileContent}>
                <h3 className={styles.profileName}>{directivo.nombre}</h3>
                <p className={styles.profileCargo}>{directivo.cargo}</p>
                <p className={styles.profileTurno}>Turno: {directivo.turno}</p>
              </div>
            </div>
          ))}
          {/* Mensaje si no hay directivos */}
          {directivos.length === 0 && (
             <p className={styles.noDataMessage}>No hay personal directivo registrado por el momento.</p>
          )}
        </div>
      )}
    </div>
  );
}