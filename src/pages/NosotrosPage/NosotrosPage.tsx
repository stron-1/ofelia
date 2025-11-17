import styles from './NosotrosPage.module.css';
import SpotlightCard from '../../components/ui/SpotlightCard';
import ElectricBorder from '../../components/ui/ElectricBorder';

// Importaciones de iconos
import {
  BsBullseye,
  BsBinoculars,
  BsPeople,
  BsHeart,
  BsCheck2Square,
} from 'react-icons/bs';
import { FaBalanceScale } from 'react-icons/fa';

export function NosotrosPage() {
  return (
    <div className="page-container">
      <h1>Nuestra Identidad</h1>

      <section className={styles.mvvSection}>
        
        {/* TARJETA DE MISIÓN 
          (Ya no necesita speed, chaos, o thickness. Usará los defaults 0.4, 0.8 y 3) 
        */}
        <ElectricBorder
          color="var(--color-accent)" 
        >
          <div className={styles.mvvCard}>
            <div className={styles.mvvIcon}>
              <BsBullseye />
            </div>
            <h2>Nuestra Misión</h2>
            <p>
              Brindar un servicio educativo integral en el nivel secundaria, 
              promoviendo una formación basada en el pensamiento crítico y valores humanistas. 
              Preparamos estudiantes que respetan la diversidad natural y cultural, 
              listos para integrarse a la sociedad y resolver problemas con responsabilidad.
            </p>
          </div>
        </ElectricBorder>

        {/* TARJETA DE VISIÓN 
          (También usará los nuevos valores por defecto)
        */}
        <ElectricBorder
          color="var(--color-accent)"
        >
          <div className={styles.mvvCard}>
            <div className={styles.mvvIcon}>
              <BsBinoculars />
            </div>
            <h2>Nuestra Visión</h2>
            <p>
              Ser una institución educativa líder, reconocida por el desarrollo 
              afectivo, social y cognitivo de nuestros estudiantes. Aspiramos a ser un 
              referente en prácticas pedagógicas innovadoras, formando ciudadanos 
              comprometidos con una cultura democrática, ambiental y la mejora de nuestra comunidad.
            </p>
          </div>
        </ElectricBorder>

      </section>

      {/* --- SECCIÓN VALORES (Sin cambios) --- */}
      <section className={styles.valoresSection}>
        <h2>Nuestros Valores Fundamentales</h2>
        
        <div className={styles.valoresGrid}>
          
          <SpotlightCard 
            className={styles.valorCard}
            spotlightColor="rgba(1, 75, 160, 0.15)"
          >
            <div className={styles.valorIcon}><BsPeople /></div>
            <h3 className={styles.valorTitle}>Solidaridad</h3>
            <p className={styles.valorDescription}>
              Orientamos la práctica de la ayuda mutua, tomando como punto de 
              partida la autoestima y la empatía.
            </p>
          </SpotlightCard>

          <SpotlightCard 
            className={styles.valorCard}
            spotlightColor="rgba(1, 75, 160, 0.15)"
          >
            <div className={styles.valorIcon}><BsHeart /></div>
            <h3 className={styles.valorTitle}>Respeto</h3>
            <p className={styles.valorDescription}>
              Inculcamos el respeto a los derechos de los demás, al medio 
              que nos rodea y a nuestra institución.
            </p>
          </SpotlightCard>

          <SpotlightCard 
            className={styles.valorCard}
            spotlightColor="rgba(1, 75, 160, 0.15)"
          >
            <div className={styles.valorIcon}><FaBalanceScale /></div>
            <h3 className={styles.valorTitle}>Justicia</h3>
            <p className={styles.valorDescription}>
              Nos inclinamos a dar a cada uno lo que le pertenece 
              con derecho, razón y equidad en todo momento.
            </p>
          </SpotlightCard>

          <SpotlightCard 
            className={styles.valorCard}
            spotlightColor="rgba(1, 75, 160, 0.15)"
          >
            <div className={styles.valorIcon}><BsCheck2Square /></div>
            <h3 className={styles.valorTitle}>Responsabilidad</h3>
            <p className={styles.valorDescription}>
              Valor fundamental que involucra el cumplimiento eficiente 
              de los deberes de todos los agentes educativos.
            </p>
          </SpotlightCard>
        </div>
      </section>
    </div>
  );
}