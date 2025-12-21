import { useState, useEffect, useMemo, type MouseEvent } from 'react';
import { BsX, BsChevronLeft, BsChevronRight, BsHeart, BsHeartFill, BsChat } from 'react-icons/bs';
import styles from '../ActividadesPage.module.css';
import { actividadesService, type Actividad, type Comentario, type FotoGaleria } from '../../../api/services/actividadesService';
import { IMAGE_BASE_URL } from '../../../api/apiClient';

const SCHOOL_AVATAR = "https://ui-avatars.com/api/?name=Ofelia+Velasquez&background=014ba0&color=fff&size=64&bold=true";

interface Props {
  actividad: Actividad;
  onClose: () => void;
  onLike: (act: Actividad) => void;
}

export function ActivityModal({ actividad, onClose, onLike }: Props) {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');

  // --- MEMO Y FILTRO DE DUPLICADOS ---
  const images = useMemo(() => {
    const imgs: string[] = [];
    const seen = new Set<string>(); // Para evitar duplicados

    const clean = (path: string) => `${IMAGE_BASE_URL}uploads/${path.replace(/^backend[/\\]/, '').replace(/^uploads[/\\]/, '').replace(/^\//, '')}`;
    
    // 1. Portada
    if (actividad.imagen_url) {
      const url = clean(actividad.imagen_url);
      imgs.push(url);
      seen.add(url);
    }
    
    // 2. Galería
    if (actividad.galeria && Array.isArray(actividad.galeria)) {
      actividad.galeria.forEach((g: string | FotoGaleria) => {
         let rawPath = '';
         if (typeof g === 'string') rawPath = g;
         else if (g && g.imagen_url) rawPath = g.imagen_url;

         if (rawPath) {
           const url = clean(rawPath);
           if (!seen.has(url)) { // Si no está repetida
             imgs.push(url);
             seen.add(url);
           }
         }
      });
    }
    return imgs;
  }, [actividad]);

  useEffect(() => {
    if (actividad.id) {
        actividadesService.getComentariosPublicos(actividad.id)
        .then(setComentarios)
        .catch(console.error);
    }
    document.body.style.overflow = 'hidden'; 
    return () => { document.body.style.overflow = 'auto'; };
  }, [actividad.id]);

  const handlePostComment = async () => {
    if(!newComment.trim() || !actividad.id) return;
    try {
      await actividadesService.enviarComentario(actividad.id, authorName || 'Anónimo', newComment);
      setNewComment('');
      alert("Comentario enviado a revisión.");
    } catch(e) { console.error(e); }
  };

  const next = (e: MouseEvent) => { e.stopPropagation(); setCurrentPhoto((p) => (p + 1) % images.length); };
  const prev = (e: MouseEvent) => { e.stopPropagation(); setCurrentPhoto((p) => (p - 1 + images.length) % images.length); };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <button className={styles.modalCloseBtn} onClick={onClose}><BsX /></button>
      
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        
        {/* LADO IZQUIERDO: VISOR CON EFECTO BORROSO */}
        <div className={styles.modalLeft}>
          
          {/* 1. FONDO BORROSO (Background Blur Effect) */}
          {images.length > 0 && (
             <div 
               className={styles.blurBackground} 
               style={{ 
                 backgroundImage: `url(${images[currentPhoto]})`,
                 position: 'absolute',
                 inset: 0,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 filter: 'blur(20px) brightness(0.6)',
                 zIndex: 0
               }} 
             />
          )}

          {/* Botón Prev */}
          {images.length > 1 && <button className={`${styles.navBtn} ${styles.prev}`} onClick={prev} style={{zIndex: 10}}><BsChevronLeft /></button>}
          
          {/* 2. IMAGEN NÍTIDA AL FRENTE */}
          {images.length > 0 ? (
             <img 
               src={images[currentPhoto]} 
               className={styles.fullImage} 
               alt="Visor" 
               style={{zIndex: 5, position: 'relative', boxShadow: '0 5px 20px rgba(0,0,0,0.3)'}}
             />
          ) : (
             <div style={{color:'white', zIndex:5}}>Sin imagen</div>
          )}
          
          {/* Botón Next */}
          {images.length > 1 && <button className={`${styles.navBtn} ${styles.next}`} onClick={next} style={{zIndex: 10}}><BsChevronRight /></button>}
        </div>

        {/* LADO DERECHO: CHAT / INFO */}
        <div className={styles.modalRight}>
           <div className={styles.modalHeader}>
             <img src={SCHOOL_AVATAR} className={styles.avatarSmall} alt="Avatar" />
             <div className={styles.userName}>
                <strong>IE. Ofelia Velásquez</strong>
                <span style={{fontSize:'0.8rem', color:'#666'}}>{actividad.categoria}</span>
             </div>
           </div>

           <div className={styles.commentsScroll}>
              <div className={styles.commentItem} style={{paddingBottom:10, borderBottom:'1px solid #eee'}}>
                <strong>Ofelia:</strong> {actividad.descripcion}
              </div>
              {comentarios.length === 0 && <p style={{color:'#999', textAlign:'center', marginTop:20}}>Sé el primero en comentar.</p>}
              {comentarios.map(c => (
                <div key={c.id} className={styles.commentItem}>
                  <strong>{c.autor}: </strong> {c.contenido}
                </div>
              ))}
           </div>

           <div className={styles.modalFooter}>
              <div style={{display:'flex', gap:15, marginBottom:10, fontSize:'1.4rem'}}>
                 <button onClick={() => onLike(actividad)} style={{background:'none', border:'none', cursor:'pointer', padding:0, color: actividad.likes && actividad.likes > 0 ? '#ed4956' : '#262626'}}>
                    {actividad.likes && actividad.likes > 0 ? <BsHeartFill /> : <BsHeart />}
                 </button>
                 <BsChat />
              </div>
              <div style={{fontWeight:'bold', marginBottom:10, fontSize:'0.9rem'}}>{actividad.likes || 0} Me gusta</div>
              
              <div className={styles.inputGroup}>
                 <input placeholder="Nombre..." style={{width:'30%'}} className={styles.inputClean} value={authorName} onChange={e=>setAuthorName(e.target.value)} />
                 <input placeholder="Comenta..." style={{flex:1}} className={styles.inputClean} value={newComment} onChange={e=>setNewComment(e.target.value)} onKeyDown={e => e.key === 'Enter' && handlePostComment()} />
                 <button className={styles.btnPost} onClick={handlePostComment} disabled={!newComment.trim()}>Publicar</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}