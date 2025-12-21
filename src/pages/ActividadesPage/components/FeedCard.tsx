import { BsHeart, BsHeartFill, BsChatText } from 'react-icons/bs';
import styles from '../ActividadesPage.module.css';
import { MediaGrid } from './MediaGrid';
import type { Actividad, FotoGaleria } from '../../../api/services/actividadesService';
import { IMAGE_BASE_URL } from '../../../api/apiClient';

const SCHOOL_AVATAR = "https://ui-avatars.com/api/?name=Ofelia+Velasquez&background=014ba0&color=fff&size=64&bold=true";

interface Props {
  actividad: Actividad;
  onLike: (act: Actividad) => void;
  onOpenModal: (act: Actividad) => void;
  commentCount: number;
}

// --- FUNCIÓN CORREGIDA: EVITA DUPLICADOS ---
const getAllImages = (act: Actividad) => {
  const images: string[] = [];
  const seen = new Set<string>(); // Usamos esto para rastrear URLs ya agregadas

  const clean = (path: string) => {
      const p = path.replace(/^backend[/\\]/, '').replace(/^uploads[/\\]/, '').replace(/^\//, '');
      return `${IMAGE_BASE_URL}uploads/${p}`;
  };

  // 1. Agregar Portada (si existe)
  if (act.imagen_url) {
    const url = clean(act.imagen_url);
    images.push(url);
    seen.add(url); // Marcamos como "ya vista"
  }

  // 2. Agregar Galería (Solo si NO es igual a la portada)
  if (act.galeria && Array.isArray(act.galeria)) {
    act.galeria.forEach((g: string | FotoGaleria) => {
      let rawPath = '';
      if (typeof g === 'string') rawPath = g;
      else if (g && g.imagen_url) rawPath = g.imagen_url;

      if (rawPath) {
        const url = clean(rawPath);
        // ¡EL FILTRO MÁGICO!
        if (!seen.has(url)) { 
          images.push(url);
          seen.add(url);
        }
      }
    });
  }
  return images;
};

export function FeedCard({ actividad, onLike, onOpenModal, commentCount }: Props) {
  const images = getAllImages(actividad);
  
  const fecha = actividad.fecha_creacion 
    ? new Date(actividad.fecha_creacion).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }) 
    : 'Reciente';

  return (
    <article className={styles.feedCard}>
      <div className={styles.cardHeader}>
        <img src={SCHOOL_AVATAR} alt="Avatar" className={styles.avatarSmall} />
        <div className={styles.headerInfo}>
          <h4>IE. Ofelia Velásquez</h4>
          <span>{fecha} &bull; {actividad.categoria || 'Institucional'}</span>
        </div>
      </div>

      <div className={styles.cardContent}>
         <h3 className={styles.cardTitle}>{actividad.titulo}</h3>
         <p className={styles.cardDesc}>{actividad.descripcion}</p>
      </div>

      {/* Grid de imágenes (Ahora sin duplicados) */}
      <MediaGrid images={images} onClick={() => onOpenModal(actividad)} />

      <div className={styles.actionRow}>
        <button className={styles.actionBtn} onClick={() => onLike(actividad)}>
           <span style={{color: actividad.likes && actividad.likes > 0 ? '#ed4956' : 'inherit', display:'flex', alignItems:'center', gap:5}}>
             {actividad.likes && actividad.likes > 0 ? <BsHeartFill /> : <BsHeart />}
             <b>{actividad.likes || 0}</b>
           </span>
           Me gusta
        </button>
        
        <button className={styles.actionBtn} onClick={() => onOpenModal(actividad)}>
           <BsChatText /> 
           <b>{commentCount}</b> Comentarios
        </button>
      </div>
    </article>
  );
}