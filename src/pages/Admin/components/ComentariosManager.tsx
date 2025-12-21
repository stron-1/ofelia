import { useState, useEffect, useCallback } from 'react';
import { BsCheckCircle, BsXCircle, BsChatSquareQuote } from 'react-icons/bs';
import styles from '../GestionSecundariaPage.module.css';
import { actividadesService, type Comentario } from '../../../api/services/actividadesService';

interface ComentarioConTitulo extends Comentario {
  actividad_titulo?: string;
}

interface Props {
  onUpdateCount?: (count: number) => void;
}

export function ComentariosManager({ onUpdateCount }: Props) {
  const [comentarios, setComentarios] = useState<ComentarioConTitulo[]>([]);
  const [loading, setLoading] = useState(false);

  const cargarComentarios = useCallback(async () => {
    setLoading(true);
    try {
      const data = await actividadesService.getPendientes();
      setComentarios(data as ComentarioConTitulo[]);
      if (onUpdateCount) onUpdateCount(data.length);
    } catch (error) {
      console.error("Error cargando comentarios", error);
    } finally {
      setLoading(false);
    }
  }, [onUpdateCount]);

  useEffect(() => {
    cargarComentarios();
  }, [cargarComentarios]);

  const handleAprobar = async (id: number) => {
    try {
      await actividadesService.aprobarComentario(id);
      const nuevos = comentarios.filter(c => c.id !== id);
      setComentarios(nuevos);
      if (onUpdateCount) onUpdateCount(nuevos.length);
    } catch (error) {
      console.error(error);
      alert("Error al aprobar");
    }
  };

  const handleRechazar = async (id: number) => {
    if (!confirm("¿Borrar este comentario permanentemente?")) return;
    try {
      await actividadesService.rechazarComentario(id);
      const nuevos = comentarios.filter(c => c.id !== id);
      setComentarios(nuevos);
      if (onUpdateCount) onUpdateCount(nuevos.length);
    } catch (error) {
      console.error(error);
      alert("Error al rechazar");
    }
  };

  return (
    <div style={{animation: 'fadeIn 0.3s ease-in-out'}}>
      <div style={{background:'#fff3cd', color:'#856404', padding:'1rem', borderRadius:'8px', marginBottom:'1.5rem', borderLeft:'5px solid #ffeeba', display:'flex', alignItems:'center', gap:'10px'}}>
         <BsChatSquareQuote size={20}/>
         <span><strong>Zona de Moderación:</strong> Revisa los comentarios antes de publicarlos.</span>
      </div>

      {loading ? (
         <div style={{padding:'2rem', textAlign:'center', color:'#666'}}>Cargando pendientes...</div>
      ) : (
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Autor</th>
              <th>Comentario</th>
              <th>Actividad</th>
              <th>Fecha</th>
              <th style={{textAlign:'center'}}>Decisión</th>
            </tr>
          </thead>
          <tbody>
            {comentarios.map((c) => (
              <tr key={c.id}>
                <td style={{fontWeight:'bold', color:'#333'}}>{c.autor}</td>
                <td style={{maxWidth:'350px'}}>
                  <div style={{background:'#f8f9fa', padding:'8px 12px', borderRadius:'6px', border:'1px solid #eee', fontSize:'0.9rem', fontStyle:'italic', color:'#555'}}>
                    "{c.contenido}"
                  </div>
                </td>
                <td>
                  <span style={{background:'#eef2ff', color:'var(--color-primary)', padding:'3px 8px', borderRadius:'12px', fontSize:'0.8rem'}}>
                    {c.actividad_titulo || `ID: ${c.id}`}
                  </span>
                </td>
                <td style={{fontSize:'0.8rem', color:'#666'}}>{new Date(c.fecha).toLocaleDateString()}</td>
                <td className={styles.actionsCell}>
                  <div style={{display:'flex', gap:'10px', justifyContent:'center'}}>
                    <button onClick={() => handleAprobar(c.id)} style={{background:'white', border:'1px solid #28a745', color:'#28a745', borderRadius:'50%', width:'32px', height:'32px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>
                      <BsCheckCircle size={16}/>
                    </button>
                    <button onClick={() => handleRechazar(c.id)} style={{background:'white', border:'1px solid #dc3545', color:'#dc3545', borderRadius:'50%', width:'32px', height:'32px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>
                      <BsXCircle size={16}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {comentarios.length === 0 && (
               <tr>
                 <td colSpan={5} style={{textAlign:'center', padding:'3rem', color:'#888'}}>
                   No hay comentarios pendientes.
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}