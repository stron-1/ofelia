import { useState, useEffect } from 'react';
import { BsEnvelope, BsEnvelopeOpen, BsTrash, BsCheckCircle } from 'react-icons/bs';
import { contactoService, type MensajeContacto } from '../../api/services/contactoService';
// IMPORTANTE: Reutilizamos el CSS exacto que me mostraste
import styles from './GestionSecundariaPage.module.css'; 

export default function GestionContactoPage() {
  const [mensajes, setMensajes] = useState<MensajeContacto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar mensajes al iniciar
  useEffect(() => {
    cargarMensajes();
  }, []);

  const cargarMensajes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await contactoService.getAll();
      setMensajes(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los mensajes del servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  // Marcar como leído
  const handleMarcarLeido = async (id: number) => {
    try {
      setError(null);
      await contactoService.markAsRead(id);
      // Actualizamos estado local
      setMensajes(prev => prev.map(msg => 
        msg.id === id ? { ...msg, leido: 1 } : msg
      ));
    } catch (err) {
      console.error(err);
      setError("No se pudo marcar como leído.");
    }
  };

  // Eliminar mensaje
  const handleEliminar = async (id: number) => {
    if (!window.confirm("¿Estás seguro de borrar este mensaje permanentemente?")) return;

    try {
      setError(null);
      await contactoService.delete(id);
      setMensajes(prev => prev.filter(msg => msg.id !== id));
    } catch (err) {
      console.error(err);
      setError("Error al eliminar el mensaje.");
    }
  };

  return (
    // Usamos 'adminPageContainer' igual que en Directivos
    <div className={styles.adminPageContainer}>
      {/* Título limpio h2, sin clases extrañas para evitar rayas amarillas */}
      <h2>Buzón de Mensajes</h2>
      
      {/* Mensaje de error usando tu clase 'errorMessage' */}
      {error && <p className={styles.errorMessage} style={{marginBottom: '1rem'}}>{error}</p>}

      {isLoading ? (
        <p>Cargando mensajes...</p>
      ) : mensajes.length === 0 ? (
        <p>No hay mensajes nuevos.</p>
      ) : (
        // Usamos 'adminTable' para que sea idéntica a la tabla de Directivos
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Remitente</th>
              <th>Mensaje</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mensajes.map((msg) => (
              <tr key={msg.id} style={{ backgroundColor: msg.leido ? 'transparent' : '#f0f8ff' }}>
                <td style={{ textAlign: 'center' }}>
                  {msg.leido ? (
                    <BsEnvelopeOpen title="Leído" color="#888" size={20} />
                  ) : (
                    <BsEnvelope title="No leído" color="#004aa0" size={20} />
                  )}
                </td>
                <td style={{ fontSize: '0.9rem' }}>
                  {msg.fecha ? new Date(msg.fecha).toLocaleDateString() : '-'} <br/>
                  <small style={{ color: '#666' }}>
                    {msg.fecha ? new Date(msg.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                  </small>
                </td>
                <td>
                  <strong>{msg.nombre}</strong><br/>
                  <small style={{ color: '#555' }}>{msg.email}</small><br/>
                  {msg.telefono && <small style={{ color: '#777' }}>Tel: {msg.telefono}</small>}
                </td>
                <td style={{ maxWidth: '300px', lineHeight: '1.4' }}>
                  {msg.mensaje}
                </td>
                
                {/* Usamos 'actionsCell' y los botones 'editBtn'/'deleteBtn' del CSS original */}
                <td className={styles.actionsCell}>
                  {!msg.leido && (
                    <button 
                      onClick={() => handleMarcarLeido(msg.id!)}
                      className={styles.editBtn} // Reusamos estilo de editar (azul/verde)
                      title="Marcar como leído"
                    >
                      <BsCheckCircle />
                    </button>
                  )}
                  <button 
                    onClick={() => handleEliminar(msg.id!)}
                    className={styles.deleteBtn} // Reusamos estilo de borrar (rojo)
                    title="Eliminar mensaje"
                  >
                    <BsTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}