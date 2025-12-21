import { useState, useEffect } from 'react';
import { BsGrid, BsChatLeftText } from 'react-icons/bs';
import styles from './GestionSecundariaPage.module.css'; 

import { ComentariosManager } from './components/ComentariosManager';
import { ActividadesManager } from './components/ActividadesManager';
import { actividadesService } from '../../api/services/actividadesService';

export default function GestionActividadesPage() {
  const [activeTab, setActiveTab] = useState<'actividades' | 'comentarios'>('actividades');
  const [pendientesCount, setPendientesCount] = useState(0);

  useEffect(() => {
    actividadesService.getPendientes()
      .then(data => setPendientesCount(data.length))
      .catch(() => {});
  }, []);

  return (
    <div className={styles.adminPageContainer}>
      {/* 1. TÍTULO ALINEADO A LA IZQUIERDA (Forzamos estilo inline para sobrescribir el center del CSS si es necesario) */}
      <h2 className={styles.pageTitle} style={{ textAlign: 'left', marginBottom: '1rem' }}>
        Gestión de Actividades
      </h2>
      
      {/* 2. PESTAÑAS */}
      <div style={{display:'flex', gap:'15px', borderBottom:'2px solid #eee', marginBottom:'1.5rem'}}>
        <button 
          onClick={() => setActiveTab('actividades')}
          style={{
            padding: '10px 20px', 
            background: 'none', 
            cursor: 'pointer', 
            fontFamily: 'var(--font-heading)',
            fontWeight: 'bold', 
            display: 'flex', gap: '8px', alignItems: 'center',
            color: activeTab === 'actividades' ? 'var(--color-primary)' : '#666',
            border: 'none',
            borderBottom: activeTab === 'actividades' ? '3px solid var(--color-primary)' : '3px solid transparent',
            marginBottom: '-2px'
          }}
        >
          <BsGrid /> Actividades
        </button>
        
        <button 
          onClick={() => setActiveTab('comentarios')}
          style={{
            padding: '10px 20px', 
            background: 'none', 
            cursor: 'pointer', 
            fontFamily: 'var(--font-heading)',
            fontWeight: 'bold', 
            display: 'flex', gap: '8px', alignItems: 'center',
            position: 'relative',
            color: activeTab === 'comentarios' ? 'var(--color-primary)' : '#666',
            border: 'none',
            borderBottom: activeTab === 'comentarios' ? '3px solid var(--color-primary)' : '3px solid transparent',
            marginBottom: '-2px'
          }}
        >
          <BsChatLeftText /> Moderación
          {pendientesCount > 0 && (
            <span style={{background:'#dc3545', color:'white', borderRadius:'50%', fontSize:'0.7rem', padding:'2px 6px', position:'absolute', top:-5, right:-5}}>
              {pendientesCount}
            </span>
          )}
        </button>
      </div>

      {/* 3. RENDERIZADO DEL CONTENIDO */}
      {activeTab === 'actividades' ? (
        <ActividadesManager />
      ) : (
        <ComentariosManager onUpdateCount={(n) => setPendientesCount(n)} />
      )}
    </div>
  );
}