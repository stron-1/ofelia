import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BsArrowLeft,
  BsArrowRight,
  BsFolderSymlink, // Icono para las tarjetas
  BsImages,
  BsGridFill // Icono para volver
} from 'react-icons/bs';
import styles from './GaleriaSecundaria.module.css';

import { seccionService, type Seccion } from '../../../../api/services/seccionService';
import { IMAGE_BASE_URL } from '../../../../api/apiClient';

const mockAnos = [
  { id: 7, nombre: 'Primer Año - Secundaria', labelShort: '1° Secundaria' },
  { id: 8, nombre: 'Segundo Año - Secundaria', labelShort: '2° Secundaria' },
  { id: 9, nombre: 'Tercer Año - Secundaria', labelShort: '3° Secundaria' },
  { id: 10, nombre: 'Cuarto Año - Secundaria', labelShort: '4° Secundaria' },
  { id: 11, nombre: 'Quinto Año - Secundaria', labelShort: '5° Secundaria' },
];

export function GaleriaSecundaria() {
  // Estado: null = viendo tarjetas de grados. Objeto = viendo fotos del grado.
  const [selectedGrade, setSelectedGrade] = useState<{id: number, nombre: string} | null>(null);
  
  const [seccionesData, setSeccionesData] = useState<Record<number, Seccion[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const getImageUrl = (path: string | null) => {
    if (!path || path === 'null' || path === '') return null;
    if (path.startsWith('http')) return path;
    let cleanPath = path.replace(/^backend[/\\]/, '');
    cleanPath = cleanPath.replace(/\\/g, '/');
    return `${IMAGE_BASE_URL}${cleanPath}`;
  };

  const handleGradeClick = async (id: number, nombre: string) => {
    // Cambiamos a la vista de detalle
    setSelectedGrade({ id, nombre });

    // Si no tenemos los datos, los cargamos
    if (!seccionesData[id]) {
      setIsLoading(true);
      try {
        // Nota: Asegúrate si tu servicio usa getPorGrado o getByGrado. 
        // He puesto getPorGrado porque así estaba en tu código original.
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
      
      {/* NAVEGACIÓN IDÉNTICA (NO TOCADA) */}
      <nav className={styles.pageNavigation}>
        <Link to="/academico" className={styles.backLink}>
          <BsArrowLeft /> Volver a Niveles
        </Link>
        <Link to="/academico/secundaria-info" className={styles.infoLink}>
          Ver Información Académica <BsArrowRight />
        </Link>
      </nav>

      {/* HEADER IDÉNTICO (NO TOCADO) */}
      <header className={styles.header}>
        <h1><BsImages /> Galería de Secundaria</h1>
        <p>Conoce nuestros ambientes, aulas y actividades.</p>
      </header>

      {/* LÓGICA DE VISTAS (AQUÍ CAMBIAMOS ACORDEÓN POR TARJETAS) */}
      {!selectedGrade ? (
        
        // VISTA 1: TARJETAS DE GRADOS
        <div className={styles.yearsGrid}>
          {mockAnos.map((ano) => (
            <div 
              key={ano.id} 
              className={styles.yearCard}
              onClick={() => handleGradeClick(ano.id, ano.nombre)}
            >
              <BsFolderSymlink className={styles.folderIcon} />
              <h3>{ano.labelShort}</h3>
              <p>Ver galería de fotos</p>
            </div>
          ))}
        </div>

      ) : (

        // VISTA 2: DENTRO DEL GRADO (FOTOS)
        <div className={styles.detailContainer}>
          
          <div className={styles.detailHeader}>
            <h3 className={styles.detailTitle}>{selectedGrade.nombre}</h3>
            <button 
              className={styles.backToYearsBtn} 
              onClick={() => setSelectedGrade(null)}
            >
              <BsGridFill /> Volver a Grados
            </button>
          </div>

          {isLoading ? (
            <p style={{textAlign:'center', color:'#666', padding:'2rem'}}>Cargando fotos...</p>
          ) : (
            <>
              {seccionesData[selectedGrade.id] && seccionesData[selectedGrade.id].length > 0 ? (
                <div className={styles.gridFotos}>
                  {seccionesData[selectedGrade.id].map((seccion) => {
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
                            <div className={styles.placeholderBox}>
                                <BsImages size={24} style={{marginBottom:'5px'}}/>
                                <span>Sin Foto</span>
                            </div>
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
              ) : (
                <div style={{textAlign:'center', padding:'3rem', background:'#f9f9f9', borderRadius:'8px', color:'#666'}}>
                  <p>No hay fotos registradas para este grado.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}