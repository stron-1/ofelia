import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BsArrowLeft,
  BsArrowRight,
  BsChevronDown,
  BsChevronUp,
  BsImages
} from 'react-icons/bs';
import styles from './GaleriaSecundaria.module.css';

import { seccionService, type Seccion } from '../../../../api/services/seccionService';
import { IMAGE_BASE_URL } from '../../../../api/apiClient';

const mockAnos = [
  { id: 7, nombre: 'Primer Año - Secundaria' },
  { id: 8, nombre: 'Segundo Año - Secundaria' },
  { id: 9, nombre: 'Tercer Año - Secundaria' },
  { id: 10, nombre: 'Cuarto Año - Secundaria' },
  { id: 11, nombre: 'Quinto Año - Secundaria' },
];

export function GaleriaSecundaria() {
  const [anoAbierto, setAnoAbierto] = useState<number | null>(null);
  const [seccionesData, setSeccionesData] = useState<Record<number, Seccion[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const getImageUrl = (path: string | null) => {
    if (!path || path === 'null' || path === '') return null;
    if (path.startsWith('http')) return path;
    let cleanPath = path.replace(/^backend[/\\]/, '');
    cleanPath = cleanPath.replace(/\\/g, '/');
    return `${IMAGE_BASE_URL}${cleanPath}`;
  };

  const toggleAno = async (id: number) => {
    if (anoAbierto === id) {
      setAnoAbierto(null);
      return;
    }
    setAnoAbierto(id);

    if (!seccionesData[id]) {
      setIsLoading(true);
      try {
        const data = await seccionService.getPorGrado(id);
        setSeccionesData(prev => ({ ...prev, [id]: data }));
      } catch (error) {
        console.error("Error cargando galería:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.galeriaContainer}>
      
      {/* NAVEGACIÓN IDÉNTICA A INFO (pageNavigation) */}
      <nav className={styles.pageNavigation}>
        <Link to="/academico" className={styles.backLink}>
          <BsArrowLeft /> Volver a Niveles
        </Link>
        <Link to="/academico/secundaria-info" className={styles.infoLink}>
          Ver Información Académica <BsArrowRight />
        </Link>
      </nav>

      <header className={styles.header}>
        <h1><BsImages /> Galería de Secundaria</h1>
        <p>Conoce nuestros ambientes, aulas y actividades.</p>
      </header>

      <div className={styles.accordion}>
        {mockAnos.map((ano) => {
          const estaAbierto = anoAbierto === ano.id;
          const seccionesDelAno = seccionesData[ano.id] || [];

          return (
            <div key={ano.id} className={`${styles.accordionItem} ${estaAbierto ? styles.open : ''}`}>
              <button 
                className={styles.accordionHeader} 
                onClick={() => toggleAno(ano.id)}
              >
                <span>{ano.nombre}</span>
                {estaAbierto ? <BsChevronUp /> : <BsChevronDown />}
              </button>

              {estaAbierto && (
                <div className={styles.accordionContent}>
                  {isLoading && seccionesDelAno.length === 0 ? (
                    <p style={{textAlign:'center', color:'#666'}}>Cargando fotos...</p>
                  ) : seccionesDelAno.length === 0 ? (
                    <p style={{textAlign:'center', color:'#666'}}>No hay fotos registradas para este grado.</p>
                  ) : (
                    <div className={styles.gridFotos}>
                      {seccionesDelAno.map((seccion) => {
                        const imgUrl = getImageUrl(seccion.imagen_url);
                        return (
                          <div key={seccion.id} className={styles.fotoCard}>
                            <div className={styles.imageWrapper}>
                              {imgUrl ? (
                                <img 
                                  src={imgUrl} 
                                  alt={`Aula de ${seccion.docente_nombre}`} 
                                  onError={(e) => e.currentTarget.style.display = 'none'}
                                />
                              ) : (
                                <div className={styles.placeholderBox}>Sin Foto</div>
                              )}
                            </div>
                            <div className={styles.cardInfo}>
                              <h4>Sección "{seccion.nombre_seccion}"</h4>
                              <p>Tutor: {seccion.docente_nombre}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}