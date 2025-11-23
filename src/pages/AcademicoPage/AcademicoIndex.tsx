import styles from './AcademicoPage.module.css';
import { Link } from 'react-router-dom';
import {
  BsInfoCircle,
  BsImages,
  BsPersonBadge,
  BsPeople,
} from 'react-icons/bs';
import Folder from '../../components/ui/Folder/Folder';
import imgMetodologia from '../../assets/images/academico_metodologia.jpg';

// --- HOJA: INFORMACIÓN DE SECUNDARIA (LINK CORREGIDO) ---
const paperSecundariaInfo = (
  <Link to="secundaria/info" className={styles.paperLink}>
    <div className={styles.paperIcon}>
      <BsInfoCircle />
    </div>
    <span className={styles.paperTitle}>Información</span>
  </Link>
);

// --- HOJA: GALERÍA DE SECUNDARIA (LINK CORREGIDO) ---
const paperSecundariaGaleria = (
  <Link to="secundaria/galeria" className={styles.paperLink}>
    <div className={styles.paperIcon}>
      <BsImages />
    </div>
    <span className={styles.paperTitle}>Galería</span>
  </Link>
);

// --- HOJA: PERSONAL DIRECTIVO (LINK CORREGIDO) ---
const paperPersonalInfo = (
  <Link to="personal/directores" className={styles.paperLink}>
    <div className={styles.paperIcon}>
      <BsPersonBadge />
    </div>
    <span className={styles.paperTitle}>Directorio</span>
  </Link>
);

// --- HOJA: PERSONAL ADMINISTRATIVO (LINK CORREGIDO) ---
const paperPersonalGaleria = (
  <Link to="personal/administrativos" className={styles.paperLink}>
    <div className={styles.paperIcon}>
      <BsPeople />
    </div>
    <span className={styles.paperTitle}>Fotos</span>
  </Link>
);

/**
 * Esta ES la página que muestra las carpetas.
 * Se renderizará "dentro" del Outlet de AcademicoPage.tsx
 * cuando la ruta sea exactamente "/academico"
 */
export function AcademicoIndex() {
  return (
    // Usamos un Fragment (<>) porque el div "page-container" ya está en el padre
    <>
      <h1>Excelencia Educativa</h1>
      <p className={styles.introParagraph}>
        Nuestro compromiso es ofrecer una formación académica de primer nivel,
        preparando a los estudiantes para los desafíos del futuro con un enfoque
        integral y moderno.
      </p>

      {/* SECCIÓN DE CARPETAS */}
      <section className={styles.folderSection}>
        <h2>Niveles y Personal</h2>
        <p className={styles.folderIntro}>
          Haz clic en una carpeta para conocer nuestros niveles y personal.
        </p>

        <div className={styles.folderGrid}>
          <div className={styles.folderWrapper}>
            <Folder
              color="var(--color-accent)"
              size={1.5}
              items={[paperSecundariaInfo, paperSecundariaGaleria]}
            />
            <h3 className={styles.folderTitle}>Nivel Secundaria</h3>
          </div>

          <div className={styles.folderWrapper}>
            <Folder
              color="#E74C3C"
              size={1.5}
              items={[paperPersonalInfo, paperPersonalGaleria]}
            />
            <h3 className={styles.folderTitle}>Nuestro Personal</h3>
          </div>
        </div>
      </section>

      {/* SECCIÓN METODOLOGÍA */}
      <section className={styles.metodologiaSection}>
        <div className={styles.metodologiaContent}>
          <h2>Nuestra Metodología</h2>
          <p>
            Fomentamos el pensamiento crítico a través de proyectos, experimentos
            y debates que ponen al estudiante en el centro del aprendizaje.
          </p>
          <p>
            Impulsamos el desarrollo de habilidades sociales, comunicativas y de
            liderazgo, preparando a los alumnos para el trabajo en equipo.
          </p>
        </div>
        <div className={styles.metodologiaImage}>
          <img src={imgMetodologia} alt="Metodología de enseñanza" />
        </div>
      </section>
    </>
  );
}