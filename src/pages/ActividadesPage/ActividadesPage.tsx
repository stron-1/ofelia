import { useEffect, useState } from 'react';
import styles from './ActividadesPage.module.css';
import SpotlightCard from '../../components/ui/SpotlightCard';
import { actividadesService, type Actividad } from '../../api/services/actividadesService';
import { IMAGE_BASE_URL } from '../../api/apiClient';
// Eliminamos la importación del Carousel de common
import { BsX, BsImages, BsChevronLeft, BsChevronRight } from 'react-icons/bs';

export function ActividadesPage() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el modal
  const [selectedActividad, setSelectedActividad] = useState<Actividad | null>(null);
  // Estado para el carrusel interno del modal
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 1. Cargar datos
  useEffect(() => {
    async function loadData() {
      try {
        const data = await actividadesService.getAll();
        setActividades(data);
      } catch (error) {
        console.error("Error cargando actividades", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Resetear el índice del carrusel cuando se abre una nueva actividad
  useEffect(() => {
    if (selectedActividad) {
      setCurrentImageIndex(0);
    }
  }, [selectedActividad]);

  // 2. Helper para URLs de imágenes
  const getImageUrl = (path: string | undefined | null) => {
    if (!path || path === 'null' || path === '') return null;
    if (path.startsWith('http')) return path;
    
    let cleanPath = path.replace(/^backend[/\\]/, '');
    cleanPath = cleanPath.replace(/^uploads[/\\]/, '');
    cleanPath = cleanPath.replace(/^\//, '');

    return `${IMAGE_BASE_URL}uploads/${cleanPath}`;
  };

  // --- LÓGICA DEL CARRUSEL INTERNO ---
  const handleNext = (total: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const handlePrev = (total: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  if (loading) return <div style={{textAlign:'center', padding:'4rem'}}>Cargando eventos...</div>;

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.headerTitle}>Nuestras Actividades</h1>
      <p className={styles.headerSubtitle}>
        Revive los mejores momentos de nuestra comunidad educativa
      </p>

      {/* --- GRID UNIFICADO --- */}
      {actividades.length > 0 ? (
        <div className={styles.gridContainer}>
          {actividades.map((act) => {
            const imgUrl = getImageUrl(act.imagen_url);
            const totalFotos = act.galeria?.length || 0;

            return (
              <div key={act.id} onClick={() => setSelectedActividad(act)}>
                <SpotlightCard className={styles.card} spotlightColor="rgba(0, 74, 160, 0.1)">
                  
                  {/* Imagen + Badge */}
                  <div className={styles.imageContainer}>
                    {imgUrl ? (
                      <img src={imgUrl} alt={act.titulo} className={styles.cardImage} />
                    ) : (
                      <div className={styles.noImagePlaceholder}>
                        Sin imagen
                      </div>
                    )}
                    <span className={styles.categoryBadge}>{act.categoria}</span>
                  </div>

                  {/* Texto */}
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{act.titulo}</h3>
                    <p className={styles.cardDescription}>
                      {act.descripcion ? act.descripcion : 'Sin descripción disponible.'}
                    </p>
                    
                    <div className={styles.viewMore}>
                      {totalFotos > 1 && <BsImages style={{marginRight: '5px'}} />}
                      {totalFotos > 1 ? `Ver galería (${totalFotos} fotos)` : 'Ver detalle'}
                    </div>
                  </div>

                </SpotlightCard>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h3>No hay actividades publicadas aún.</h3>
          <p>Pronto subiremos fotos de nuestros eventos.</p>
        </div>
      )}

      {/* --- MODAL DE DETALLE (VISOR LIMPIO) --- */}
      {selectedActividad && (
        <div className={styles.modalOverlay} onClick={() => setSelectedActividad(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            
            {/* Botón cerrar */}
            <button className={styles.closeButton} onClick={() => setSelectedActividad(null)}>
              <BsX />
            </button>

            {/* Header del Modal */}
            <div className={styles.modalHeader}>
              <span className={styles.modalCategory}>
                {selectedActividad.categoria}
              </span>
              <h2 className={styles.modalTitle}>{selectedActividad.titulo}</h2>
            </div>

            {/* ÁREA DE VISUALIZACIÓN DE FOTOS (CARRUSEL LIMPIO) */}
            <div className={styles.viewerContainer}>
              {(() => {
                // LÓGICA CORREGIDA: Usamos ESTRICTAMENTE la galería.
                // No agregamos 'imagen_url' (portada) al array.
                const galeriaCruda = selectedActividad.galeria && selectedActividad.galeria.length > 0 
                  ? selectedActividad.galeria 
                  : [];

                // Limpiamos las URLs usando tu función helper
                const galeriaUrls = galeriaCruda
                  .map(url => getImageUrl(url))
                  .filter(url => url !== null) as string[];

                // Solo mostramos el carrusel si hay fotos en la galería
                if (galeriaUrls.length > 0) {
                  return (
                    <>
                      {/* Imagen Principal del Visor */}
                      <div className={styles.imageWrapper}>
                         <img 
                           src={galeriaUrls[currentImageIndex]} 
                           alt={`Foto ${currentImageIndex + 1}`} 
                           className={styles.viewerImage} 
                         />
                      </div>

                      {/* Controles de Navegación (Solo si hay más de 1 foto) */}
                      {galeriaUrls.length > 1 && (
                        <>
                          <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={(e) => handlePrev(galeriaUrls.length, e)}>
                            <BsChevronLeft />
                          </button>
                          <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={(e) => handleNext(galeriaUrls.length, e)}>
                            <BsChevronRight />
                          </button>
                          
                          {/* Contador simple */}
                          <div className={styles.counterBadge}>
                            {currentImageIndex + 1} / {galeriaUrls.length}
                          </div>
                        </>
                      )}
                    </>
                  );
                } else {
                  // Si no hay galería, mostramos mensaje o la portada sola si quisieras, 
                  // pero pediste que sea solo galería.
                  return <div className={styles.noImagesMessage}>Esta actividad no tiene galería extra.</div>;
                }
              })()}
            </div>

            {/* Footer con descripción */}
            <div className={styles.modalFooter}>
              <p>{selectedActividad.descripcion}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}