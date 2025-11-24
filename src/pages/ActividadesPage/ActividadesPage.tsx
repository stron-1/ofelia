import { useEffect, useState } from 'react';
import styles from './ActividadesPage.module.css';
import SpotlightCard from '../../components/ui/SpotlightCard';
import { actividadesService, type Actividad } from '../../api/services/actividadesService';
import { IMAGE_BASE_URL } from '../../api/apiClient';
import { Carousel } from '../../components/common/Carousel';
import { BsX, BsImages } from 'react-icons/bs';

export function ActividadesPage() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActividad, setSelectedActividad] = useState<Actividad | null>(null);

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

  // 2. Helper para URLs de imágenes
  const getImageUrl = (path: string | undefined | null) => {
    if (!path || path === 'null' || path === '') return null;
    if (path.startsWith('http')) return path;
    
    let cleanPath = path.replace(/^backend[/\\]/, '');
    cleanPath = cleanPath.replace(/^uploads[/\\]/, '');
    cleanPath = cleanPath.replace(/^\//, '');

    return `${IMAGE_BASE_URL}uploads/${cleanPath}`;
  };

  if (loading) return <div style={{textAlign:'center', padding:'4rem'}}>Cargando eventos...</div>;

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.headerTitle}>Nuestras Actividades</h1>
      <p className={styles.headerSubtitle}>
        Revive los mejores momentos de nuestra comunidad educativa
      </p>

      {/* --- GRID UNIFICADO (3 Columnas) --- */}
      {actividades.length > 0 ? (
        <div className={styles.gridContainer}>
          {actividades.map((act) => {
            const imgUrl = getImageUrl(act.imagen_url);
            // Contamos fotos: galería + portada
            const totalFotos = (act.galeria?.length || 0) + (act.imagen_url ? 1 : 0);

            return (
              <div key={act.id} onClick={() => setSelectedActividad(act)}>
                <SpotlightCard className={styles.card} spotlightColor="rgba(0, 74, 160, 0.1)">
                  
                  {/* Imagen + Badge */}
                  <div className={styles.imageContainer}>
                    {imgUrl ? (
                      <img src={imgUrl} alt={act.titulo} className={styles.cardImage} />
                    ) : (
                      <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#999'}}>
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
        <div style={{textAlign:'center', padding:'3rem', background:'#f5f5f5', borderRadius:'12px'}}>
          <h3>No hay actividades publicadas aún.</h3>
          <p>Pronto subiremos fotos de nuestros eventos.</p>
        </div>
      )}

      {/* --- MODAL DE DETALLE / CARRUSEL --- */}
      {selectedActividad && (
        <div className={styles.modalOverlay} onClick={() => setSelectedActividad(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setSelectedActividad(null)}>
              <BsX />
            </button>

            <div className={styles.modalHeader}>
              <span style={{fontSize:'0.85rem', color:'#666', textTransform:'uppercase', letterSpacing:'1px'}}>
                {selectedActividad.categoria}
              </span>
              <h2 className={styles.modalTitle}>{selectedActividad.titulo}</h2>
            </div>

            <div className={styles.carouselWrapper}>
              {(() => {
                // Lógica combinada para juntar portada + galería
                const rawGallery = selectedActividad.galeria && selectedActividad.galeria.length > 0 
                  ? selectedActividad.galeria 
                  : (selectedActividad.imagen_url ? [selectedActividad.imagen_url] : []);
                
                // Limpiamos URLs
                const galeriaUrls = rawGallery
                  .map(url => getImageUrl(url))
                  .filter(url => url !== null) as string[];

                if (galeriaUrls.length > 0) {
                  return (
                    // AHORA SÍ FUNCIONARÁ PORQUE CAROUSEL ACEPTA 'IMAGES'
                    <Carousel 
                      images={galeriaUrls} 
                      autoPlay={true}
                      width="100%"
                      height="100%" 
                    />
                  );
                } else {
                  return <div style={{color:'white'}}>Sin imágenes disponibles</div>;
                }
              })()}
            </div>

            <div className={styles.modalFooter}>
              <p style={{lineHeight: '1.6', color:'#444'}}>
                {selectedActividad.descripcion}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}