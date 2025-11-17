import { Link } from 'react-router-dom';
// 1. Importamos el icono de flecha derecha
import {
  BsArrowLeft,
  BsClock,
  BsBook,
  BsArrowRight, // <-- NUEVO
} from 'react-icons/bs';
import styles from './PrimariaInfo.module.css';

export function PrimariaInfo() {
  return (
    <div className={styles.infoPageContainer}>
      {/* --- 1. BARRA DE NAVEGACIÓN (NUEVO) --- */}
      <div className={styles.pageNavigation}>
        <Link to="/academico" className={styles.backLink}>
          <BsArrowLeft /> Volver a Niveles
        </Link>
        <Link
          to="/academico/primaria/galeria" // Va a la galería
          className={styles.contextLink}
        >
          Avanzar a Galería <BsArrowRight />
        </Link>
      </div>

      {/* --- 2. ENCABEZADO DE LA PÁGINA --- */}
      <header className={styles.contentHeader}>
        <h1>Nivel Primaria</h1>
        <p>
          Formamos estudiantes con bases sólidas, fomentando la curiosidad,
          la creatividad y el pensamiento crítico desde los primeros años de
          aprendizaje.
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

      {/* --- 4. SECCIÓN EXTRA DE CONTENIDO --- */}
      <section className={styles.propuestaSection}>
        <h2>
          <BsBook /> Nuestra Propuesta Educativa
        </h2>
        <p>
          Nuestro plan de estudios está diseñado para desarrollar habilidades
          integrales. Ofrecemos talleres de arte, deporte y tecnología,
          complementando la currícula oficial con un enfoque humanista.
        </p>
        <ul>
          <li>Desarrollo del pensamiento lógico-matemático.</li>
          <li>Fomento de la lectura y escritura creativa.</li>
          <li>Proyectos de ciencias e investigación.</li>
          <li>Inglés intensivo desde primer grado.</li>
        </ul>
      </section>
    </div>
  );
}