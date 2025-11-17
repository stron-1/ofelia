import { Link } from 'react-router-dom';
import {
  BsArrowLeft,
  BsClock,
  BsBook,
  BsArrowRight,
} from 'react-icons/bs';
import styles from './SecundariaInfo.module.css';

export function SecundariaInfo() {
  return (
    <div className={styles.infoPageContainer}>
      {/* --- 1. BARRA DE NAVEGACIÓN (Correcta) --- */}
      <div className={styles.pageNavigation}>
        {/* Link 1: Volver a Niveles */}
        <Link to="/academico" className={styles.backLink}>
          <BsArrowLeft /> Volver a Niveles
        </Link>
        {/* Link 2: Avanzar a Galería */}
        <Link
          to="/academico/secundaria/galeria"
          className={styles.contextLink}
        >
          Avanzar a Galería <BsArrowRight />
        </Link>
      </div>

      {/* --- 2. ENCABEZADO --- */}
      <header className={styles.contentHeader}>
        <h1>Nivel Secundaria</h1>
        <p>
          Preparamos a jóvenes líderes para los desafíos universitarios y
          profesionales.
        </p>
      </header>

      {/* --- 3. SECCIÓN DE HORARIOS --- */}
      <section className={styles.scheduleSection}>
        <h2>
          <BsClock /> Nuestros Horarios
        </h2>
        <div className={styles.scheduleGrid}>
          <div className={styles.scheduleCard}>
            <h3>Turno Mañana</h3>
            <p className={styles.scheduleTime}>6:45 AM - 12:30 PM</p>
          </div>
          <div className={styles.scheduleCard}>
            <h3>Turno Tarde</h3>
            <p className={styles.scheduleTime}>12:45 PM - 5:50 PM</p>
          </div>
        </div>
      </section>

      {/* --- 4. SECCIÓN EXTRA --- */}
      <section className={styles.propuestaSection}>
        <h2>
          <BsBook /> Nuestra Propuesta Educativa
        </h2>
        <p>
          El plan de estudios de secundaria profundiza el conocimiento
          científico y humanista.
        </p>
        <ul>
          <li>Orientación vocacional y profesional.</li>
          <li>Programas de debate y liderazgo.</li>
          <li>Bachillerato con enfoque en ciencias y letras.</li>
        </ul>
      </section>
    </div>
  );
}