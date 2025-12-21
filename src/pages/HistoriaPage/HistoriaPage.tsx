import { useEffect, useRef, useState } from 'react';
import styles from './HistoriaPage.module.css';
import {
  FaUserGraduate,
  FaSchool,
  FaCalendarAlt,
  FaBuilding,
  FaAward,
  FaFutbol,
  FaMedal,
  FaRegHandPointUp,
  FaUsers, // Icono para reemplazar imagen
  FaFlask, // Icono para reemplazar imagen
  FaTrophy, // Icono para reemplazar imagen
} from 'react-icons/fa';
import CardSwap, { Card } from '../../components/ui/CardSwap/CardSwap';

import rosaOfeliaImg from '../../assets/images/Historia/rosa-ofelia.jpg';
import fachadaActualImg from '../../assets/images/Historia/mas67años.jpg';
import creacionReubicacion from  '../../assets/images/Historia/reubicacion1.jpg';
import primerlocal from '../../assets/images/Historia/primerlocal.jpg';
import traslado from '../../assets/images/Historia/traslado.jpg';
import localpropop from '../../assets/images/Historia/chontamuyo.jpg';
import logros from '../../assets/images/Historia/logros.jpg';
import lema from '../../assets/images/Historia/lema.jpg';
import promociones from '../../assets/images/Historia/promociones.jpg';
import localchonta from '../../assets/images/Historia/local-chontamuyo.jpg';
// --- HOOK PARA DETECTAR SCROLL (NECESARIO) ---
function useOnScreen(ref: React.RefObject<HTMLElement | null>) {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [ref]);
  return isIntersecting;
}

// --- COMPONENTE WRAPPER PARA CADA HITO ---
function TimelineItem({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);
  const itemClasses = `${styles.timelineItem} ${isVisible ? styles.visible : ''}`;
  return (
    <div ref={ref} className={itemClasses}>
      {children}
    </div>
  );
}
// --- FIN DEL CÓDIGO DE ANIMACIÓN ---

export function HistoriaPage() {
  return (
    <div className="page-container">
      <h1>Historia de la Institución Educativa “Ofelia Velásquez”</h1>

      <section className={styles.timelineSection}>
        {/* Hito 1: Rosa Ofelia */}
        <TimelineItem>
          <div className={styles.timelineContent}>
            <h2>Rosa Ofelia Velásquez Hidalgo (1913-1953)</h2>
            <p>
              El nombre de la I.E. “Ofelia Velásquez” honra a una de las más
              prestigiosas educadoras de San Martín. Nació el 30 de agosto de
              1913, en Rioja. Se graduó como Profesora en la Escuela Normal de
              “San Pedro” en Lima, siendo la primera mujer Sanmartinense
              egresada de ese claustro.
            </p>
            <p>
              Realizó una intensa labor profesional, especialmente en Lamas.
              Fallece trágicamente en 1953 en uno de los ríos amazónicos.
            </p>
          </div>
          <div className={styles.timelineVisual}>
            <div className={styles.clickPrompt}>
              <FaRegHandPointUp /> Haz clic en las tarjetas
            </div>
            <CardSwap
              width={300}
              height={200}
              cardDistance={25}
              verticalDistance={25}
            >
              <Card customClass={`${styles.historyCard} ${styles.iconCard}`}>
                <FaUserGraduate size={50} />
                <p>Primera egresada de la Escuela Normal de "San Pedro"</p>
              </Card>
              <Card customClass={styles.historyCard}>
                {/* --- ARREGLO 1 (USO): USANDO LA IMAGEN IMPORTADA --- */}
                <img src={rosaOfeliaImg} alt="Rosa Ofelia Velásquez" />
              </Card>
            </CardSwap>
          </div>
        </TimelineItem>

        {/* Hito 2: Fundación */}
        <TimelineItem>
          <div className={styles.timelineVisual}>
            <div className={styles.clickPrompt}>
              <FaRegHandPointUp /> Haz clic en las tarjetas
            </div>
            <CardSwap
              width={300}
              height={200}
              cardDistance={25}
              verticalDistance={25}
            >
              <Card customClass={styles.historyCard}>
                {/* --- REUBICACION (USO): USANDO LA IMAGEN IMPORTADA --- */}
                <img src={creacionReubicacion} alt="Reubicacion local" />
              </Card>
              <Card customClass={`${styles.historyCard} ${styles.iconCard}`}>
                <h3>R.M. Nº 029</h3>
                <p>20 de Feb. de 1958</p>
              </Card>
            </CardSwap>
          </div>
          <div className={styles.timelineContent}>
            <h2>Creación y Reubicación (1957-1958)</h2>
            <p>
              La Institución fue creada como Colegio Estatal Mixto en Rioja,
              en mayo de 1957. Casi de inmediato, fue reubicada a Tarapoto
              como Colegio Estatal de Mujeres (R.M. Nº 029 del 20 de febrero
              de 1958).
            </p>
            <p>
              En ese entonces era Presidente don Manuel Prado Ugarteche y
              Ministro de Educación, el Historiador Jorge Basadre Grohmann.
            </p>
          </div>
        </TimelineItem>

        {/* Hito 3: Primer Local */}
        <TimelineItem>
          <div className={styles.timelineContent}>
            <h2>El Primer Local (1958)</h2>
            <p>
              El 26 de abril de 1958, se dio inicio a los estudios. El primer
              local funcionó en la quinta cuadra del Jirón Leoncio Prado. Se
              inició con 130 alumnos, distribuidos en cuatro secciones, del 1º
              a 4º grados.
            </p>
            <p>
              La primera directora fue Aurea Torres Plasencia de Díaz, el
              secretario Elías Bazaldúa y el Pdte. de APAFA Guillermo
              Zambrano Venegas.
            </p>
          </div>
          <div className={styles.timelineVisual}>
            <div className={styles.clickPrompt}>
              <FaRegHandPointUp /> Haz clic en las tarjetas
            </div>
            <CardSwap
              width={300}
              height={200}
              cardDistance={25}
              verticalDistance={25}
            >
              <Card customClass={styles.historyCard}>
                {/* --- ARREGLO 1 (USO): USANDO LA IMAGEN IMPORTADA --- */}
                <img src={primerlocal} alt="Primer local de la IE" />
              </Card>
              <Card customClass={`${styles.historyCard} ${styles.iconCard}`}>
                <h2>130</h2>
                <p>Alumnas Pioneras</p>
              </Card>
            </CardSwap>
          </div>
        </TimelineItem>

        {/* Hito 4: Segundo Local y Aniversario */}
        <TimelineItem>
          <div className={styles.timelineVisual}>
            <div className={styles.clickPrompt}>
              <FaRegHandPointUp /> Haz clic en las tarjetas
            </div>
            <CardSwap
              width={300}
              height={200}
              cardDistance={25}
              verticalDistance={25}
            >
              <Card customClass={styles.historyCard}>
                {/* --- ARREGLO 1 (USO): USANDO LA IMAGEN IMPORTADA --- */}
                <img src={traslado} alt="traslado" />
              </Card>
              <Card customClass={`${styles.historyCard} ${styles.iconCard}`}>
                <FaBuilding size={50} />
                <p>2da Cuadra Jr. Maynas (Local Faucett)</p>
              </Card>
            </CardSwap>
          </div>
          <div className={styles.timelineContent}>
            <h2>Traslados y Tradiciones (1962)</h2>
            <p>
              En marzo de 1962, se traslada a su segundo local, en la 2da.
              cuadra del Jr. Maynas (donde funcionó la agencia Faucett).
            </p>
            <p>
              El 13 de mayo de ese año, la Asamblea de Profesores, a
              iniciativa de las Madres Compasionistas, designó el 15 de
              setiembre como fecha de aniversario.
            </p>
          </div>
        </TimelineItem>

        {/* Hito 5: Local Propio */}
        <TimelineItem>
          <div className={styles.timelineContent}>
            <h2>El Local Propio (1964)</h2>
            <p>
              En agosto de 1964, gracias a la Reverenda Madre María Teresa
              Gamma Blanco (Madre Guadalupe), el colegio pasó a ocupar su
              propio local en el que actualmente sigue ubicado.
            </p>
            <p>
              Hasta ese entonces, dicho local fue ocupado por el Colegio
              “Juan Jiménez Pimentel”.
            </p>
          </div>
          <div className={styles.timelineVisual}>
            <div className={styles.clickPrompt}>
              <FaRegHandPointUp /> Haz clic en las tarjetas
            </div>
            <CardSwap
              width={300}
              height={200}
              cardDistance={25}
              verticalDistance={25}
            >
              <Card customClass={styles.historyCard}>
                {/* --- ARREGLO 1 (USO): USANDO LA IMAGEN IMPORTADA --- */}
                <img src={localpropop} alt="Local Propio" />
              </Card>
              {/* --- ARREGLO 2: IMAGEN REEMPLAZADA POR ICONO --- */}
              <Card customClass={styles.historyCard}>
                {/* --- ARREGLO 1 (USO): USANDO LA IMAGEN IMPORTADA --- */}
                <img src={localchonta} alt="Local de Chontamuyo" />
              </Card>
            </CardSwap>
          </div>
        </TimelineItem>

        {/* Hito 6: Egresados y Lema */}
        <TimelineItem>
          <div className={styles.timelineVisual}>
            <div className={styles.clickPrompt}>
              <FaRegHandPointUp /> Haz clic en las tarjetas
            </div>
            <CardSwap
              width={300}
              height={200}
              cardDistance={25}
              verticalDistance={25}
            >
              <Card customClass={styles.historyCard}>
                {/* --- ARREGLO 1 (USO): USANDO LA IMAGEN IMPORTADA --- */}
                <img src={lema} alt="Lema" />
              </Card>
              <Card customClass={styles.historyCard}>
                {/* --- ARREGLO 1 (USO): USANDO LA IMAGEN IMPORTADA --- */}
                <img src={promociones} alt="58 Promociones" />
              </Card>
            </CardSwap>
          </div>
          <div className={styles.timelineContent}>
            <h2>58 Promociones de Éxito y un Lema</h2>
            <p>
              Han egresado de “Ofelia Velásquez” 58 promociones, cuyos
              integrantes son renombrados profesionales y hombres y mujeres
              de bien que forjan la grandeza de la patria.
            </p>
            <p>
              El estudiante de la I. E. “Ofelia Velásquez” es fiel a su Lema:
              DISCIPLINA. MERITO, TRABAJO.
            </p>
          </div>
        </TimelineItem>

        {/* Hito 7: Logros */}
        <TimelineItem>
          <div className={styles.timelineContent}>
            <h2>Logros que Inspiran</h2>
            <p>
              En FENCYT, representamos al Perú en Brasil (1994). Hemos
              llegado a finales nacionales en Olimpiadas de Química y
              Matemática.
            </p>
            <p>
              El Arte, la oratoria y el liderazgo han brillado en eventos en
              Argentina, Colombia, Uruguay, Bolivia y Ecuador.
            </p>
            <p>
              En básquet, ajedrez, tenis de mesa y atletismo, hemos sido
              embajadores de la región en todo el Perú.
            </p>
          </div>
          <div className={styles.timelineVisual}>
            <div className={styles.clickPrompt}>
              <FaRegHandPointUp /> Haz clic en las tarjetas
            </div>
            <CardSwap
              width={300}
              height={200}
              cardDistance={25}
              verticalDistance={25}
            >
              <Card customClass={styles.historyCard}>
                {/* --- ARREGLO 1 (USO): USANDO LA IMAGEN IMPORTADA --- */}
                <img src={logros} alt="Logros" />
              </Card>
              <Card customClass={`${styles.historyCard} ${styles.iconCard}`}>
                <FaFutbol size={50} />
                <p>Campeones Regionales</p>
              </Card>
            </CardSwap>
          </div>
        </TimelineItem>

        {/* Hito 8: Presente */}
        <TimelineItem>
          <div className={styles.timelineVisual}>
            <div className={styles.clickPrompt}>
              <FaRegHandPointUp /> Haz clic en las tarjetas
            </div>
            <CardSwap
              width={300}
              height={200}
              cardDistance={25}
              verticalDistance={25}
            >
              <Card customClass={`${styles.historyCard} ${styles.iconCard}`}>
                <FaMedal size={50} />
                <p>Institución Emblemática</p>
              </Card>
              <Card customClass={styles.historyCard}>
                {/* --- ARREGLO 1 (USO): USANDO LA OTRA IMAGEN IMPORTADA --- */}
                <img src={fachadaActualImg} alt="Fachada Actual" />
              </Card>
            </CardSwap>
          </div>
          <div className={styles.timelineContent}>
            <h2>Más de 67 Años y Contando</h2>
            <p>
              Son más de 67 años de imborrable actividad educativa. Gracias a los
              logros, somos reconocidos como INSTITUCIÓN EMBLEMÁTICA por el
              Gobierno Regional y el Ministerio de Educación.
            </p>
            <p>
              Apostamos por una institución que siempre se mantendrá a la
              vanguardia de la educación Sanmartinense.
            </p>
          </div>
        </TimelineItem>
      </section>
    </div>
  );
}