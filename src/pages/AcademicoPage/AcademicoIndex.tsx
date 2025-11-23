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

// --- ENLACES CORREGIDOS SEGÚN MAIN.TSX ---

const paperSecundariaInfo = (
  <Link to="secundaria-info" className={styles.paperLink}>
    <div className={styles.paperIcon}>
      <BsInfoCircle />
    </div>
    <span className={styles.paperTitle}>Información</span>
  </Link>
);

const paperSecundariaGaleria = (
  <Link to="secundaria-galeria" className={styles.paperLink}>
    <div className={styles.paperIcon}>
      <BsImages />
    </div>
    <span className={styles.paperTitle}>Galería</span>
  </Link>
);

const paperPersonalInfo = (
  <Link to="directivos" className={styles.paperLink}>
    <div className={styles.paperIcon}>
      <BsPersonBadge />
    </div>
    <span className={styles.paperTitle}>Directivos</span>
  </Link>
);

const paperPersonalGaleria = (
  <Link to="administrativos" className={styles.paperLink}>
    <div className={styles.paperIcon}>
      <BsPeople />
    </div>
    <span className={styles.paperTitle}>Administrativos</span>
  </Link>
);

export function AcademicoIndex() {
  return (
    <>
      <section className={styles.nivelesSection}>
        <h2>Niveles y Personal</h2>
        <p className={styles.sectionIntro}>
          Haz clic en una carpeta para conocer nuestros niveles y personal.
        </p>

        <div className={styles.folderGrid}>
          {/* CARPETA SECUNDARIA */}
          <div className={styles.folderWrapper}>
            <Folder
              color="var(--color-accent)"
              size={1.5}
              items={[paperSecundariaInfo, paperSecundariaGaleria]}
            />
            <h3 className={styles.folderTitle}>Nivel Secundaria</h3>
          </div>

          {/* CARPETA PERSONAL */}
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