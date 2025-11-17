import { Carousel } from '../../components/common/Carousel';
import SpotlightCard from '../../components/ui/SpotlightCard'; 
import styles from './HomePage.module.css';
import { NavLink } from 'react-router-dom';

// Importamos los iconos que usaremos
import {
  BsAward,
  BsPersonCheck,
  BsPeople,
  BsBuilding,
  BsCpu,
  BsHeart,
} from 'react-icons/bs';

export function HomePage() {
  return (
    <>
      {/* Carrusel (Sin cambios) */}
      <Carousel />

      {/* Contenedor principal */}
      <div className="page-container">
        
        {/* Sección Bienvenida (Sin cambios) */}
        <section className={styles.welcomeSection}>
          <h2>Bienvenidos a la I.E. Ofelia Velásquez</h2>
          <div className={styles.directorMessage}>
            <p>
              <strong>Un Mensaje de Nuestro Director:</strong> "Con gran alegría,
              les doy la bienvenida a la Institución Educativa Ofelia Velásquez.
              Aquí, cada estudiante es parte de una familia que lo inspira a
              alcanzar su máximo potencial..."
            </p>
          </div>
        </section>

        {/* 2. SECCIÓN "POR QUÉ ELEGIRNOS" (Actualizada con SpotlightCard) */}
        <section className={styles.whyUsSection}>
          <h2>¿Por Qué Elegir Ofelia Velásquez?</h2>
          <div className={styles.featuresGrid}>
            
            {/* Usamos tu color azul (rgba(1, 75, 160, 0.15)) */}
            <SpotlightCard 
              className={styles.featureCard} 
              spotlightColor="rgba(1, 75, 160, 0.15)"
            >
              <div className={styles.featureIcon}><BsAward /></div>
              <h3 className={styles.featureTitle}>Excelencia Académica</h3>
              <p className={styles.featureDescription}>
                Programas de alto rendimiento y docentes de primer nivel.
              </p>
            </SpotlightCard>

            <SpotlightCard 
              className={styles.featureCard} 
              spotlightColor="rgba(1, 75, 160, 0.15)"
            >
              <div className={styles.featureIcon}><BsPersonCheck /></div>
              <h3 className={styles.featureTitle}>Formación Integral</h3>
              <p className={styles.featureDescription}>
                Desarrollo de habilidades artísticas, deportivas y sociales.
              </p>
            </SpotlightCard>

            <SpotlightCard 
              className={styles.featureCard} 
              spotlightColor="rgba(1, 75, 160, 0.15)"
            >
              <div className={styles.featureIcon}><BsPeople /></div>
              <h3 className={styles.featureTitle}>Plana Docente</h3>
              <p className={styles.featureDescription}>
                Profesionales calificados y en constante capacitación.
              </p>
            </SpotlightCard>

            <SpotlightCard 
              className={styles.featureCard} 
              spotlightColor="rgba(1, 75, 160, 0.15)"
            >
              <div className={styles.featureIcon}><BsBuilding /></div>
              <h3 className={styles.featureTitle}>Infraestructura</h3>
              <p className={styles.featureDescription}>
                Aulas equipadas, laboratorios y espacios deportivos.
              </p>
            </SpotlightCard>

            <SpotlightCard 
              className={styles.featureCard} 
              spotlightColor="rgba(1, 75, 160, 0.15)"
            >
              <div className={styles.featureIcon}><BsCpu /></div>
              <h3 className={styles.featureTitle}>Innovación</h3>
              <p className={styles.featureDescription}>
                Incorporamos herramientas tecnológicas en el aprendizaje.
              </p>
            </SpotlightCard>

            <SpotlightCard 
              className={styles.featureCard} 
              spotlightColor="rgba(1, 75, 160, 0.15)"
            >
              <div className={styles.featureIcon}><BsHeart /></div>
              <h3 className={styles.featureTitle}>Valores Sólidos</h3>
              <p className={styles.featureDescription}>
                Fomentamos el respeto, la responsabilidad y la integridad.
              </p>
            </SpotlightCard> {/* <-- ¡AQUÍ ESTÁ LA CORRECCIÓN! */}
          </div>
        </section>

        {/* 3. SECCIÓN "HERO" (Sin cambios) */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1>Forjando Líderes para el Futuro</h1>
            <p>
              Más de 65 años de historia comprometidos con la excelencia
              académica y la formación de ciudadanos íntegros.
            </p>
            <NavLink to="/historia" className={styles.ctaButton}>
              Conoce Nuestra Historia
            </NavLink>
          </div>
        </section>

      </div>
    </>
  );
}