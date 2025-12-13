import { useEffect, useState } from 'react';
import styles from './ActividadesPage.module.css';
import { actividadesService, type Actividad } from '../../api/services/actividadesService';
import { IMAGE_BASE_URL } from '../../api/apiClient';

import { 
  BsHeart, 
  BsHeartFill, 
  BsChat, 
  BsSend, 
  BsThreeDots,
  BsChevronLeft,
  BsChevronRight,
  BsBookmark,
  BsMegaphone
} from 'react-icons/bs';

const SCHOOL_AVATAR = "https://ui-avatars.com/api/?name=Ofelia+Velasquez&background=014ba0&color=fff";

// Definimos las categorías que queremos mostrar en el filtro
const CATEGORIES = ['Todas', 'Académico', 'Deportes', 'Cultural', 'Institucional'];

export function ActividadesPage() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todas');

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

  // --- FUNCIÓN DE FILTRADO ROBUSTA ---
  // Elimina acentos y convierte a minúsculas para comparar
  const normalizeText = (text: string) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const filteredActividades = selectedCategory === 'Todas'
    ? actividades
    : actividades.filter(act => {
        // Compara lo que viene de la BD con lo seleccionado
        if (!act.categoria) return false;
        return normalizeText(act.categoria).includes(normalizeText(selectedCategory));
      });

  if (loading) return <div style={{textAlign:'center', padding:'4rem'}}>Cargando muro...</div>;

  return (
    <div className={styles.pageContainer}>
      
      <div className={styles.pageHeader}>
        <h1 className={styles.headerTitle}>Muro Institucional</h1>
      </div>

      <div className={styles.contentGrid}>

        {/* FEED COLUMN */}
        <div className={styles.feedColumn}>
          {filteredActividades.length > 0 ? (
            filteredActividades.map((act) => (
              <SocialPost key={act.id} actividad={act} />
            ))
          ) : (
            <div style={{textAlign:'center', padding:'3rem', color:'#666', background:'white', borderRadius:'12px', border:'1px solid #eee'}}>
              No hay publicaciones en <strong>{selectedCategory}</strong>.
            </div>
          )}
        </div>

        {/* SIDEBAR COLUMN */}
        <aside className={styles.sidebarColumn}>
          
          {/* Widget Categorías */}
          <div className={styles.widgetCard}>
            <h3 className={styles.widgetTitle}>Explorar por</h3>
            <div className={styles.categoriesList}>
              {CATEGORIES.map((cat) => (
                <span 
                  key={cat}
                  className={`${styles.categoryTag} ${selectedCategory === cat ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Widget Eventos */}
          <div className={styles.widgetCard}>
            <h3 className={styles.widgetTitle}>Próximos Eventos</h3>
            <div className={styles.miniEvent}>
              <div className={styles.dateBox}>
                <span className={styles.dateDay}>15</span>
                <span className={styles.dateMonth}>DIC</span>
              </div>
              <div className={styles.eventInfo}>
                <h4>Clausura Escolar</h4>
                <span>Auditorio Principal</span>
              </div>
            </div>
            <div className={styles.miniEvent}>
              <div className={styles.dateBox}>
                <span className={styles.dateDay}>22</span>
                <span className={styles.dateMonth}>DIC</span>
              </div>
              <div className={styles.eventInfo}>
                <h4>Entrega de Libretas</h4>
                <span>Secretaría</span>
              </div>
            </div>
            <div style={{textAlign:'center', marginTop:'10px'}}>
              <button style={{background:'none', border:'none', color:'var(--color-primary)', fontWeight:'bold', cursor:'pointer', fontSize:'0.9rem'}}>Ver Calendario Completo</button>
            </div>
          </div>

          {/* Widget Comunicado */}
          <div className={styles.widgetCard} style={{borderColor: 'var(--color-accent)'}}>
            <h3 className={styles.widgetTitle} style={{color:'#333', display:'flex', alignItems:'center', gap:'10px'}}>
              <BsMegaphone color="var(--color-accent)"/> Comunicado
            </h3>
            <p style={{fontSize:'0.9rem', color:'#555', lineHeight:'1.5'}}>
              Estimados padres, recuerden que las matrículas para el año 2026 inician el 15 de Enero.
            </p>
          </div>

        </aside>

      </div>
    </div>
  );
}

/* --- TARJETA SOCIAL --- */
function SocialPost({ actividad }: { actividad: Actividad }) {
  // CORRECCIÓN: cleanPath ahora es const
  const getImageUrl = (path: string | undefined | null) => {
    if (!path || path === 'null' || path === '') return null;
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/^backend[/\\]/, '').replace(/^uploads[/\\]/, '').replace(/^\//, '');
    return `${IMAGE_BASE_URL}uploads/${cleanPath}`;
  };

  const rawGallery = actividad.galeria || [];
  let allImagesRaw = actividad.imagen_url 
     ? [actividad.imagen_url, ...rawGallery]
     : rawGallery;
  
  allImagesRaw = [...new Set(allImagesRaw)];
  const images = allImagesRaw
    .map(url => getImageUrl(url))
    .filter(url => url !== null) as string[];

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 50) + 10);

  const handleNext = () => {
    setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  const handlePrev = () => {
    setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <article className={styles.socialCard}>
      <div className={styles.postHeader}>
        <div className={styles.userInfo}>
          <img src={SCHOOL_AVATAR} alt="Avatar" className={styles.userAvatar} />
          <div className={styles.userName}>
            <span>IE Ofelia Velásquez</span>
            <span className={styles.postLocation}>{actividad.categoria}</span>
          </div>
        </div>
        <button className={styles.moreOptionsBtn}>
          <BsThreeDots />
        </button>
      </div>

      {/* MEDIA: LÓGICA DE FONDO BORROSO + IMAGEN COMPLETA */}
      <div className={styles.postMedia} onDoubleClick={toggleLike}>
        {images.length > 0 ? (
          <>
            {/* FONDO: Se encarga de los bordes vacíos */}
            <div 
              className={styles.blurBackground} 
              style={{ backgroundImage: `url(${images[currentImgIndex]})` }} 
            />
            {/* IMAGEN: Se ve completa sin cortes */}
            <img 
              src={images[currentImgIndex]} 
              alt="Post content" 
              className={styles.mediaImage} 
            />
            
            {images.length > 1 && (
              <>
                <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={handlePrev}>
                  <BsChevronLeft />
                </button>
                <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={handleNext}>
                  <BsChevronRight />
                </button>
                <div className={styles.imageCounter}>
                  {currentImgIndex + 1}/{images.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div style={{color:'#999', padding:'2rem', zIndex:1}}>Sin imágenes</div>
        )}
      </div>

      <div className={styles.postActions}>
        <div className={styles.actionLeft}>
          <button className={`${styles.iconBtn} ${isLiked ? styles.liked : ''}`} onClick={toggleLike}>
            {isLiked ? <BsHeartFill /> : <BsHeart />}
          </button>
          <button className={styles.iconBtn}>
            <BsChat />
          </button>
          <button className={styles.iconBtn}>
            <BsSend />
          </button>
        </div>
        <div>
          <button className={styles.iconBtn}>
            <BsBookmark />
          </button>
        </div>
      </div>

      <div className={styles.postInfo}>
        <span className={styles.likesCount}>{likesCount} Me gusta</span>
        <div className={styles.caption}>
          <span className={styles.userNameCaption}>ofelia_velasquez</span>
          {actividad.descripcion || "Sin descripción."}
        </div>
        <span className={styles.date}>HACE 2 HORAS</span> 
      </div>

      <div className={styles.commentSection}>
        <input 
          type="text" 
          placeholder="Agrega un comentario..." 
          className={styles.commentInput} 
        />
        <button className={styles.postBtn} disabled>Publicar</button>
      </div>
    </article>
  );
}