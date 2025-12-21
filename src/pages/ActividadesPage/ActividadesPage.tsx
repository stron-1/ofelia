import { useEffect, useState, useMemo } from 'react';
import styles from './ActividadesPage.module.css';
import { actividadesService, type Actividad } from '../../api/services/actividadesService';
import { FeedCard } from './components/FeedCard';
import { ActivityModal } from './components/ActivityModal';

const CATEGORIAS = ['Todas', 'Académico', 'Deportes', 'Cultural', 'Institucional'];

export function ActividadesPage() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [selectedPost, setSelectedPost] = useState<Actividad | null>(null);
  const [commentsCount, setCommentsCount] = useState<Record<number, number>>({});
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await actividadesService.getAll();
        setActividades(data);
        
        // Cargar comentarios en paralelo
        const validIds = data.filter(a => a.id).map(a => a.id!);
        if(validIds.length > 0) {
            const promises = validIds.map(id => actividadesService.getComentariosPublicos(id));
            const results = await Promise.all(promises);
            const counts: Record<number, number> = {};
            validIds.forEach((id, idx) => {
                counts[id] = results[idx].length;
            });
            setCommentsCount(counts);
        }
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    loadData();
  }, []);

  const handleLike = async (act: Actividad) => {
    if (!act.id) return;
    try {
      const res = await actividadesService.addLike(act.id);
      const updated = { ...act, likes: res.likes };
      setActividades(prev => prev.map(a => a.id === act.id ? updated : a));
      if (selectedPost?.id === act.id) setSelectedPost(updated);
    } catch (e) { console.error(e); }
  };

  const actividadesFiltradas = useMemo(() => {
     return categoriaSeleccionada === 'Todas' ? actividades : actividades.filter(a => a.categoria === categoriaSeleccionada);
  }, [actividades, categoriaSeleccionada]);

  const countByCategory = (cat: string) => {
    if (cat === 'Todas') return actividades.length;
    return actividades.filter(a => a.categoria === cat).length;
  };

  return (
    // USAMOS LA CLASE GLOBAL 'page-container' IGUAL QUE EN CONTACTO
    <div className="page-container">
      
      {/* TÍTULO GLOBAL SIN CLASES EXTRAS PARA QUE LA RAYA SEA LA MISMA */}
      <h1>Actividades y Noticias</h1>

      <div className={styles.layoutGrid}>
        
        {/* FEED */}
        <div className={styles.feedColumn}>
          {loading ? (
            <p style={{textAlign:'center', padding:20, color:'#888'}}>Cargando actividades...</p>
          ) : actividadesFiltradas.length === 0 ? (
            <div style={{textAlign:'center', padding:'3rem', background:'white', borderRadius:'12px', border:'1px solid #eee'}}>
              <p style={{color:'#666'}}>No hay publicaciones en esta categoría.</p>
            </div>
          ) : (
            actividadesFiltradas.map(act => (
              <FeedCard 
                key={act.id} 
                actividad={act}
                commentCount={commentsCount[act.id!] || 0}
                onLike={handleLike}
                onOpenModal={setSelectedPost} 
              />
            ))
          )}
        </div>

        {/* SIDEBAR */}
        <aside className={styles.sidebarColumn}>
          <div className={styles.filterCard}>
            <h3 className={styles.sidebarTitle}>Filtrar por Categoría</h3>
            <ul className={styles.categoryList}>
              {CATEGORIAS.map(cat => (
                <li key={cat}>
                  <button 
                    className={`${styles.categoryBtn} ${categoriaSeleccionada === cat ? styles.active : ''}`}
                    onClick={() => setCategoriaSeleccionada(cat)}
                  >
                    <span>{cat}</span>
                    <span className={styles.countBadge}>{countByCategory(cat)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

      </div>

      {selectedPost && (
        <ActivityModal 
          actividad={selectedPost} 
          onClose={() => setSelectedPost(null)}
          onLike={handleLike}
        />
      )}
    </div>
  );
}