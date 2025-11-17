import { useState } from 'react';
import { Link } from 'react-router-dom';
// Se eliminan BsPersonSquare y BsArrowRight que no se usan
import { BsArrowLeft, BsChevronDown, BsChevronUp } from 'react-icons/bs';
import styles from './GaleriaPrimaria.module.css';
// Importamos el servicio y los tipos
import { seccionService, type Seccion } from '../../../../api/services/seccionService';

// IDs y Nombres para Primaria (1-6)
const mockGrados = [
  { id: 1, nombre: 'Primer Grado' },
  { id: 2, nombre: 'Segundo Grado' },
  { id: 3, nombre: 'Tercer Grado' },
  { id: 4, nombre: 'Cuarto Grado' },
  { id: 5, nombre: 'Quinto Grado' },
  { id: 6, nombre: 'Sexto Grado' },
];

export function GaleriaPrimaria() {
  const [gradoAbierto, setGradoAbierto] = useState<number | null>(null);
  const [secciones, setSecciones] = useState<Record<number, Seccion[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleToggleGrado = (id: number) => {
    const estaAbierto = gradoAbierto === id;
    if (estaAbierto) {
      setGradoAbierto(null);
    } else {
      setGradoAbierto(id);
      cargarSecciones(id); // Carga los datos al abrir
    }
  };

  return (
    <div className={styles.galleryPageContainer}>
      
      {/* --- 1. BARRA DE NAVEGACIÓN (CORREGIDA) --- */}
      <nav className={styles.pageNavigation}>
        {/* Un solo enlace para retroceder, usando el estilo contextLink */}
        <Link
          to="/academico/primaria/info"
          className={styles.contextLink}
        >
          <BsArrowLeft /> Retroceder a Información
        </Link>
      </nav>

      {/* --- 2. Encabezado --- */}
      <header className={styles.contentHeader}>
        <h1>Galería y Docentes: Primaria</h1>
        <p>
          Explora nuestros grados para conocer al equipo docente y ver las
          actividades de cada sección.
        </p>
      </header>

      {/* --- 3. Acordeón de Grados --- */}
      <div className={styles.accordionContainer}>
        {mockGrados.map((grado) => {
          const estaAbierto = gradoAbierto === grado.id;
          const seccionesDelGrado = secciones[grado.id] || [];

          return (
            <div className={styles.accordionItem} key={grado.id}>
              <button
                className={styles.accordionHeader}
                onClick={() => handleToggleGrado(grado.id)}
              >
                <span>{grado.nombre}</span>
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
                    {seccionesDelGrado.length === 0 ? (
                      <p>No hay secciones registradas para este grado.</p>
                    ) : (
                      // --- Tarjetas de Sección ---
                      seccionesDelGrado.map((seccion) => (
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