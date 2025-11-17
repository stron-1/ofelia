import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BsArrowLeft,
  BsChevronDown,
  BsChevronUp,
} from 'react-icons/bs';
import styles from './GaleriaSecundaria.module.css';
// 1. Importar el servicio y los tipos
import { seccionService, type Seccion } from '../../../../api/services/seccionService';

// 2. CORREGIR MOCK CON IDs DEL ADMIN (7-11)
const mockAnos = [
  { id: 7, nombre: 'Primer Año - Secundaria' },
  { id: 8, nombre: 'Segundo Año - Secundaria' },
  { id: 9, nombre: 'Tercer Año - Secundaria' },
  { id: 10, nombre: 'Cuarto Año - Secundaria' },
  { id: 11, nombre: 'Quinto Año - Secundaria' },
];

export function GaleriaSecundaria() {
  // 3. Añadir estados para los datos
  const [anoAbierto, setAnoAbierto] = useState<number | null>(null);
  const [secciones, setSecciones] = useState<Record<number, Seccion[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 4. Función para cargar datos de la API
  const cargarSecciones = async (gradoId: number) => {
    if (!secciones[gradoId]) { // Solo carga si no existen
      setIsLoading(true);
      setError(null);
      try {
        const data = await seccionService.getPorGrado(gradoId);
        setSecciones(prev => ({ ...prev, [gradoId]: data }));
      } catch (err) {
        console.error(err);
        setError('Error al cargar las secciones.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleToggleAno = (id: number) => {
    const estaAbierto = anoAbierto === id;
    if (estaAbierto) {
      setAnoAbierto(null);
    } else {
      setAnoAbierto(id);
      cargarSecciones(id); // Carga los datos al abrir
    }
  };

  return (
    <div className={styles.galleryPageContainer}>
      
      <div className={styles.pageNavigation}>
        <Link
          to="/academico/secundaria/info"
          className={styles.contextLink}
        >
          <BsArrowLeft /> Retroceder a Información
        </Link>
      </div>

      <header className={styles.contentHeader}>
        <h1>Galería y Docentes: Secundaria</h1>
        <p>
          Explora nuestros años para conocer al equipo docente y ver las
          actividades de cada sección.
        </p>
      </header>

      {/* --- 5. EL ACORDEÓN (MODIFICADO) --- */}
      <div className={styles.accordionContainer}>
        {mockAnos.map((ano) => {
          const estaAbierto = anoAbierto === ano.id;
          // Obtenemos las secciones cargadas para este año
          const seccionesDelAno = secciones[ano.id] || [];

          return (
            <div className={styles.accordionItem} key={ano.id}>
              <button
                className={styles.accordionHeader}
                onClick={() => handleToggleAno(ano.id)}
              >
                <span>{ano.nombre}</span>
                {estaAbierto ? <BsChevronUp /> : <BsChevronDown />}
              </button>
              <div
                className={`${styles.accordionContent} ${
                  estaAbierto ? styles.open : ''
                }`}
              >
                {/* --- RENDERIZADO DINÁMICO --- */}
                {isLoading && estaAbierto && <p>Cargando...</p>}
                {error && estaAbierto && <p className={styles.errorMessage}>{error}</p>}

                {!isLoading && !error && estaAbierto && (
                  <div className={styles.seccionGrid}>
                    {seccionesDelAno.length === 0 ? (
                      <p>No hay secciones registradas para este año.</p>
                    ) : (
                      // --- Tarjetas de Sección ---
                      seccionesDelAno.map((seccion) => (
                        <div key={seccion.id} className={styles.seccionCard}>
                          <div className={styles.cardImageContainer}>
                            <img 
                              src={seccion.imagen_url ? `/${seccion.imagen_url}` : '/placeholder-docente.png'} 
                              alt={`Docente ${seccion.docente_nombre}`}
                              className={styles.cardImage}
                            />
                          </div>
                          <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>
                              Sección: "{seccion.nombre_seccion}"
                            </h3>
                            <p className={styles.cardDocente}>{seccion.docente_nombre}</p>
                            <p className={styles.cardTurno}>Turno: {seccion.turno}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}