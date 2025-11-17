import styles from './ActividadesPage.module.css';
// 1. Importamos el SpotlightCard
import SpotlightCard from '../../components/ui/SpotlightCard';

// Importamos los iconos
import {
  BsAward,
  BsCalculator,
  BsChatDots,
  BsSpellcheck,
  BsMusicNoteBeamed,
  BsMic,
  BsMask,
  BsBrush,
  BsTrophy,
  BsFlag,
  BsPersonWalking,
  BsPeopleFill,
} from 'react-icons/bs';

export function ActividadesPage() {
  return (
    <div className="page-container">
      <h1>Vida Estudiantil y Eventos</h1>
      <p className={styles.introParagraph}>
        Fomentamos una comunidad activa y participativa a través de un vibrante
        calendario de actividades que enriquecen la experiencia educativa de
        nuestros estudiantes.
      </p>

      {/* 2. SECCIONES (Actualizadas con SpotlightCard) */}
      <section className={styles.actividadesSection}>
        <div className={styles.categoriaActividades}>
          <h2>Competencias Académicas</h2>
          <div className={styles.actividadesGrid}>
            
            {/* 3. Envolvemos todas las tarjetas */}
            <SpotlightCard
              className={styles.actividadCard}
              spotlightColor="rgba(1, 75, 160, 0.15)"
            >
              <div className={styles.actividadIcon}><BsAward /></div>
              <h3 className={styles.actividadTitle}>Feria de Ciencias</h3>
            </SpotlightCard>

            <SpotlightCard
              className={styles.actividadCard}
              spotlightColor="rgba(1, 75, 160, 0.15)"
            >
              <div className={styles.actividadIcon}><BsCalculator /></div>
              <h3 className={styles.actividadTitle}>Olimpiadas de Matemática</h3>
            </SpotlightCard>

            <SpotlightCard
              className={styles.actividadCard}
              spotlightColor="rgba(1, 75, 160, 0.15)"
            >
              <div className={styles.actividadIcon}><BsChatDots /></div>
              <h3 className={styles.actividadTitle}>Concurso de Debate</h3>
            </SpotlightCard>

            <SpotlightCard
              className={styles.actividadCard}
              spotlightColor="rgba(1, 75, 160, 0.15)"
            >
              <div className={styles.actividadIcon}><BsSpellcheck /></div>
              <h3 className={styles.actividadTitle}>Spelling Bee</h3>
            </SpotlightCard>
          </div>
        </div>

        <div className={styles.categoriaActividades}>
          <h2>Expresión Cultural y Artística</h2>
          <div className={styles.actividadesGrid}>
            
            <SpotlightCard
              className={styles.actividadCard}
              spotlightColor="rgba(1, 75, 160, 0.15)"
            >
              <div className={styles.actividadIcon}><BsMusicNoteBeamed /></div>
              <h3 className={styles.actividadTitle}>Festival de Danzas</h3>
            </SpotlightCard>

            <SpotlightCard
              className={styles.actividadCard}
              spotlightColor="rgba(1, 75, 160, 0.15)"
            >
              <div className={styles.actividadIcon}><BsMic /></div>
              <h3 className={styles.actividadTitle}>Gala Musical</h3>
            </SpotlightCard>

            <SpotlightCard
              className={styles.actividadCard}
              spotlightColor="rgba(1, 75, 160, 0.15)"
            >
              <div className={styles.actividadIcon}><BsMask /></div>
              <h3 className={styles.actividadTitle}>Semana del Teatro</h3>
            </SpotlightCard>

            <SpotlightCard
              className={styles.actividadCard}
              spotlightColor="rgba(1, 75, 160, 0.15)"
            >
              <div className={styles.actividadIcon}><BsBrush /></div>
              <h3 className={styles.actividadTitle}>Exposición de Arte</h3>
            </SpotlightCard>
          </div>
        </div>

        <div className={styles.categoriaActividades}>
          <h2>Deporte y Bienestar</h2>
          <div className={styles.actividadesGrid}>
            
            <SpotlightCard
              className={styles.actividadCard}
              spotlightColor="rgba(1, 75, 160, 0.15)"
            >
              <div className={styles.actividadIcon}><BsTrophy /></div>
              <h3 className={styles.actividadTitle}>Olimpiadas Escolares</h3>
            </SpotlightCard>

            <SpotlightCard
              className={styles.actividadCard}
              spotlightColor="rgba(1, 75, 160, 0.15)"
            >
              <div className={styles.actividadIcon}><BsFlag /></div>
              <h3 className={styles.actividadTitle}>Campeonatos Inter-aulas</h3>
            </SpotlightCard>

            <SpotlightCard
              className={styles.actividadCard}
              spotlightColor="rgba(1, 75, 160, 0.15)"
            >
              <div className={styles.actividadIcon}><BsPersonWalking /></div>
              <h3 className={styles.actividadTitle}>Día del Deporte</h3>
            </SpotlightCard>

            <SpotlightCard
              className={styles.actividadCard}
              spotlightColor="rgba(1, 75, 160, 0.15)"
            >
              <div className={styles.actividadIcon}><BsPeopleFill /></div>
              <h3 className={styles.actividadTitle}>Selecciones Deportivas</h3>
            </SpotlightCard>
          </div>
        </div>
      </section>
    </div>
  );
}