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
              Somos una institución educativa que brinda un servicio educativo integral a estudiantes del nivel secundaria, 
              promoviendo un estilo formativo basado en un modelo pedagógico socio crítico y humanista que permite a los 
              estudiantes asumir principios y valores, destacando la responsabilidad y respeto a la diversidad natural, 
              social y cultural en un contexto de crisis ambiental; para integrarse a la sociedad y resolver problemas esenciales de la vida.
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
              Al año 2021, los estudiantes de la Institución Educativa “Ofelia Velásquez” han alcanzado niveles óptimos de desarrollo afectivo, 
              social y cognitivo; asumiendo valores y compromisos hacia una cultura ciudadana democrática y ambiental. 
              Docentes actualizados que demuestran buenas prácticas pedagógicas y padres de familia que asumen responsablemente su rol; 
              siendo una institución educativa que mejora y moderniza la calidad de su servicio psicopedagógico.  
              La infraestructura educativa es moderna con aulas, talleres y CRT, implementado con los últimos adelantos tecnológicos. 
              Comprometidos en la mejora de la calidad de vida y las relaciones familiares en la comunidad.
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
              Valor que permite orientar desde la práctica la ayuda mutua 
              tomando como punto de partida la autoestima.
            </p>
          </SpotlightCard>

          <SpotlightCard 
            className={styles.valorCard}
            spotlightColor="rgba(1, 75, 160, 0.15)"
          >
            <div className={styles.valorIcon}><BsHeart /></div>
            <h3 className={styles.valorTitle}>Respeto</h3>
            <p className={styles.valorDescription}>
              Inculcamos el respeto a los derechos de los demás, 
              al medio que nos rodea y nos da vida, así como a las 
              plantas y animales, a los símbolos patrios y la 
              Institución Educativa.
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
              con derecho, razón y equidad.
            </p>
          </SpotlightCard>

          <SpotlightCard 
            className={styles.valorCard}
            spotlightColor="rgba(1, 75, 160, 0.15)"
          >
            <div className={styles.valorIcon}><BsCheck2Square /></div>
            <h3 className={styles.valorTitle}>Responsabilidad</h3>
            <p className={styles.valorDescription}>
              Valor fundamental que involucra el cumplimiento de los 
              deberes de todos los agentes educativos de manera eficiente.
            </p>
          </SpotlightCard>
        </div>
      </section>
    </div>
  );
}