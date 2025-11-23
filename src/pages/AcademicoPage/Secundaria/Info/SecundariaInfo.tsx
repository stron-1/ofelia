import { Link } from 'react-router-dom';
import { BsArrowLeft, BsClock, BsBook, BsArrowRight, BsCheckCircle } from 'react-icons/bs';
import styles from './SecundariaInfo.module.css';

export function SecundariaInfo() {
  // YA NO HAY BACKEND AQUÍ. Solo información estática.

  return (
    <div className={styles.infoPageContainer}>
      
      {/* 1. NAVEGACIÓN (Funciona perfecto) */}
      <div className={styles.pageNavigation}>
        <Link to="/academico" className={styles.backLink}>
          <BsArrowLeft /> Volver a Niveles
        </Link>
        <Link to="/academico/secundaria-galeria" className={styles.contextLink}>
          Ir a la Galería de Fotos <BsArrowRight />
        </Link>
      </div>

      {/* 2. ENCABEZADO */}
      <header className={styles.contentHeader}>
        <h1>Nivel Secundaria</h1>
        <p>Preparamos a jóvenes líderes para los desafíos universitarios y profesionales.</p>
      </header>

      {/* 3. GRADOS (Solo Texto Informativo) */}
      <section className={styles.scheduleSection}>
        <h2>Niveles de Atención</h2>
        <p style={{ textAlign: 'center', fontSize: '1.1rem', marginBottom: '1.5rem', color: '#555' }}>
          Nuestra institución brinda servicios educativos integrales para todos los grados de educación secundaria:
        </p>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem' 
        }}>
          {['Primer Grado', 'Segundo Grado', 'Tercer Grado', 'Cuarto Grado', 'Quinto Grado'].map((grado) => (
            <div key={grado} style={{
              background: '#fff',
              border: '1px solid #ddd',
              padding: '0.8rem 1.5rem',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              fontWeight: 'bold',
              color: 'var(--color-primary)'
            }}>
              <BsCheckCircle style={{ color: 'var(--color-accent)' }} /> {grado}
            </div>
          ))}
        </div>
      </section>

      {/* 4. HORARIOS (Estático) */}
      <section className={styles.scheduleSection}>
        <h2><BsClock /> Nuestros Horarios</h2>
        <div className={styles.scheduleGrid}>
          <div className={styles.scheduleCard}>
            <h3>Turno Mañana</h3>
            <p className={styles.scheduleTime}>7:15 AM - 12:50 PM</p>
          </div>
          <div className={styles.scheduleCard}>
            <h3>Turno Tarde</h3>
            <p className={styles.scheduleTime}>12:50 PM - 6:10 PM</p>
          </div>
        </div>
      </section>

      {/* 5. PROPUESTA (Estático) */}
      <section className={styles.propuestaSection}>
        <h2><BsBook /> Nuestra Propuesta Educativa</h2>
        <ul>
          <li>Orientación vocacional y profesional constante.</li>
          <li>Programas de debate y liderazgo estudiantil.</li>
          <li>Bachillerato con enfoque en ciencias y humanidades.</li>
        </ul>
      </section>
    </div>
  );
}