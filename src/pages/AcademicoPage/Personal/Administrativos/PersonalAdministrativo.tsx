import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs'; // Quitamos BsArrowRight si no se usa
import styles from './PersonalAdministrativo.module.css';
import { administrativoService, type Administrativo } from '../../../../api/services/administrativoService'; // <-- Servicio correcto

export function PersonalAdministrativo() {
  const [administrativos, setAdministrativos] = useState<Administrativo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await administrativoService.getTodos(); // <-- Usar servicio correcto
        setAdministrativos(data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar el personal administrativo.'); // <-- Texto en Español
      } finally {
        setIsLoading(false);
      }
    };
    cargarDatos();
  }, []);

  return (
    <div className={styles.personalPageContainer}>
      <nav className={styles.pageNavigation}>
        <Link to="/academico/personal/directores" className={styles.backLink}>
          <BsArrowLeft /> Volver a Directivos {/* <-- Texto en Español */}
        </Link>
        {/* Quitamos el link "Avanzar" */}
      </nav>

      <header className={styles.contentHeader}>
        <h1>Personal Administrativo</h1> {/* <-- Texto en Español */}
        <p>
          El equipo de soporte que asegura el buen funcionamiento de nuestra
          institución día a día. {/* <-- Texto en Español */}
        </p>
      </header>

      {isLoading && <p className={styles.loadingMessage}>Cargando personal administrativo...</p>} {/* <-- Texto en Español */}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {!isLoading && !error && (
        <div className={styles.profileGrid}>
          {administrativos.map((admin) => (
            <div className={styles.profileCard} key={admin.id}>
              <div className={styles.profileImageContainer}>
                <img
                  src={admin.imagen_url ? `/${admin.imagen_url}` : '/placeholder-docente.png'}
                  alt={admin.nombre}
                  className={styles.profileImage}
                />
              </div>
              <div className={styles.profileContent}>
                <h3 className={styles.profileName}>{admin.nombre}</h3>
                <p className={styles.profileCargo}>{admin.cargo}</p>
                <p className={styles.profileTurno}>Turno: {admin.turno}</p> {/* <-- Texto en Español */}
              </div>
            </div>
          ))}
          {administrativos.length === 0 && (
             <p className={styles.noDataMessage}>No hay personal administrativo registrado por el momento.</p> // <-- Texto en Español
          )}
        </div>
      )}
    </div>
  );
}