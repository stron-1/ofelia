import { Carousel } from '../../components/common/Carousel';
import SpotlightCard from '../../components/ui/SpotlightCard'; 
import styles from './HomePage.module.css';
import { NavLink } from 'react-router-dom';

// 1. IMPORTAMOS TUS IMÁGENES DEL HOME AQUÍ
import img1 from '../../assets/images/InicioFotos_1.jpg';
import img2 from '../../assets/images/InicioFotos_2.jpg';
import img3 from '../../assets/images/InicioFotos_3.jpg';
import img4 from '../../assets/images/InicioFotos_4.jpg';
import img5 from '../../assets/images/InicioFotos_5.jpg';

import {
  BsCpu,
  BsHeart,
} from 'react-icons/bs';

export function HomePage() {
  // 2. Definimos el array de imágenes para el Home
  const heroImages = [img1, img2, img3, img4, img5];

  return (
    <>
      {/* 3. Carrusel ajustado a la altura de la pantalla con el título dentro */}
      {/* Usamos calc(100vh - 80px) para llenar el espacio restando la altura de una navbar típica */}
      <Carousel images={heroImages} height="calc(100vh - 80px)" />

      <div className="page-container">
        
        <section className={styles.welcomeSection}>
          {/* El título "Bienvenidos..." FUE ELIMINADO de aquí porque ahora está en el Carrusel */}
          <div className={styles.directorMessage}>
            <p>
              <strong>Un Mensaje de Nuestro Director:</strong> "Con gran alegría,
              les doy la bienvenida a la Institución Educativa Ofelia Velásquez.
              Aquí, cada estudiante es parte de una familia que lo inspira a
              alcanzar su máximo potencial..."
            </p>
          </div>
        </section>

        <section className={styles.whyUsSection}>
          <h2>¿Por Qué Elegir Ofelia Velásquez?</h2>
          <div className={styles.featuresGrid}>
            
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
            </SpotlightCard>
          </div>
        </section>

        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1>Forjando Líderes para el Futuro</h1>
            <p>
              Más de 67 años de historia comprometidos con la excelencia
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