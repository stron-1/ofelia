import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './DashboardPage.module.css';
import { IMAGE_BASE_URL, apiClient } from '../../api/apiClient';
import type { User } from '../../api/services/authService';
// Usamos iconos para las notificaciones
import { BsBell, BsGlobe, BsCheckCircleFill, BsEnvelopeFill, BsInfoCircleFill } from 'react-icons/bs';

interface NotificacionesResponse {
  comentarios: number | string;
  mensajes: number | string;
  total: number | string;
}

export function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Estado para abrir/cerrar notificaciones
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [notificaciones, setNotificaciones] = useState({
    comentarios: 0,
    mensajes: 0,
    total: 0
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Cargar usuario
  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem('user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    };
    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  // Cerrar notificaciones si hago clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // POLLING: Revisamos cada 5 SEGUNDOS (para que lo veas rápido)
  useEffect(() => {
    checkNotificaciones();
    const intervalo = setInterval(checkNotificaciones, 5000); 
    return () => clearInterval(intervalo);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const handleLogout = () => {
    if(confirm('¿Cerrar sesión?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/');
    }
  };

  const checkNotificaciones = async () => {
    try {
      // Agregamos un timestamp para evitar caché del navegador
      const data = await apiClient.get<NotificacionesResponse>('notificaciones', `&t=${Date.now()}`);
      
      console.log("Notificaciones recibidas:", data); // Mira la consola (F12) para ver si llega

      if (data) {
        setNotificaciones({
          comentarios: Number(data.comentarios) || 0,
          mensajes: Number(data.mensajes) || 0,
          total: Number(data.total) || 0
        });
      }
    } catch (error) {
      console.error('Error buscando notificaciones', error);
    }
  };

  const getAvatarUrl = () => {
    if (currentUser?.imagen_url) {
       const cleanPath = currentUser.imagen_url.replace(/^backend[/\\]/, '').replace(/^uploads[/\\]/, '').replace(/^\//, '');
       return `${IMAGE_BASE_URL}uploads/${cleanPath}`;
    }
    return `https://ui-avatars.com/api/?name=${currentUser?.nombre || 'Admin'}&background=014ba0&color=fff`;
  };

  // Títulos dinámicos
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Panel de Inicio';
    if (path.includes('/secundaria')) return 'Gestión Secundaria';
    if (path.includes('/directivos')) return 'Personal Directivo';
    if (path.includes('/administrativos')) return 'Personal Administrativo';
    if (path.includes('/actividades')) return 'Actividades y Eventos';
    if (path.includes('/mensajes')) return 'Bandeja de Mensajes';
    if (path.includes('/configuracion')) return 'Configuración de Perfil';
    return 'Panel de Administración';
  };

  return (
    <div className={styles.dashboardContainer}>
      
      {/* --- SIDEBAR --- */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
        
        <div className={styles.profileSection}>
          <div className={styles.avatarWrapper}>
            <img src={getAvatarUrl()} alt="Avatar" className={styles.avatarImg} />
            <span className={styles.onlineIndicator} title="En línea"></span>
          </div>
          {isSidebarOpen && (
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>{currentUser?.nombre || 'Cargando...'}</span>
              <span className={styles.profileRole}>Administrador</span>
            </div>
          )}
        </div>

        <nav className={styles.navMenu}>
          <NavLink to="/admin/dashboard" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`} end>
            <span className="material-symbols-outlined">home</span>
            {isSidebarOpen && <span className={styles.linkText}>Inicio</span>}
          </NavLink>
          
          <NavLink to="/admin/secundaria" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <span className="material-symbols-outlined">menu_book</span>
            {isSidebarOpen && <span className={styles.linkText}>Secundaria</span>}
          </NavLink>

          <NavLink to="/admin/directivos" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <span className="material-symbols-outlined">supervisor_account</span>
            {isSidebarOpen && <span className={styles.linkText}>Directivos</span>}
          </NavLink>

          <NavLink to="/admin/administrativos" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <span className="material-symbols-outlined">support_agent</span>
            {isSidebarOpen && <span className={styles.linkText}>Administrativos</span>}
          </NavLink>

          <NavLink to="/admin/actividades" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <span className="material-symbols-outlined">celebration</span>
            {isSidebarOpen && <span className={styles.linkText}>Actividades</span>}
             {/* GLOBITO EN EL MENU LATERAL */}
            {notificaciones.comentarios > 0 && isSidebarOpen && (
               <span style={{marginLeft:'auto', background:'#dc3545', color:'white', fontSize:'0.7rem', padding:'2px 6px', borderRadius:'10px'}}>
                 {notificaciones.comentarios}
               </span>
            )}
          </NavLink>

          <NavLink to="/admin/mensajes" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <span className="material-symbols-outlined">mail</span>
            {isSidebarOpen && <span className={styles.linkText}>Mensajes</span>}
             {/* GLOBITO EN EL MENU LATERAL */}
             {notificaciones.mensajes > 0 && isSidebarOpen && (
               <span style={{marginLeft:'auto', background:'#dc3545', color:'white', fontSize:'0.7rem', padding:'2px 6px', borderRadius:'10px'}}>
                 {notificaciones.mensajes}
               </span>
            )}
          </NavLink>
        </nav>
        
        <div className={styles.logoutSection}>
          <NavLink to="/admin/configuracion" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`} style={{marginBottom:'5px'}}>
            <span className="material-symbols-outlined">settings</span>
            {isSidebarOpen && <span className={styles.linkText}>Configuración</span>}
          </NavLink>

          <button onClick={handleLogout} className={styles.logoutButton}>
            <span className="material-symbols-outlined">logout</span>
            {isSidebarOpen && <span className={styles.linkText}>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>
      
      {/* --- ÁREA PRINCIPAL --- */}
      <div className={styles.mainArea}>
        
        <header className={styles.header}>
          
          <div className={styles.headerLeft}>
            <button onClick={toggleSidebar} className={styles.toggleBtn}>
              <span className="material-symbols-outlined">{isSidebarOpen ? 'menu_open' : 'menu'}</span>
            </button>
            <h2 className={styles.headerBreadcrumb}>{getPageTitle()}</h2>
          </div>

          <div className={styles.headerRight} ref={notifRef}>
            
            <a href="/" target="_blank" className={styles.headerIconBtn} title="Ver sitio web (Nueva pestaña)" rel="noreferrer">
              <BsGlobe />
            </a>

            <div style={{position: 'relative'}}>
              <button 
                className={`${styles.headerIconBtn} ${showNotifications ? styles.activeBtn : ''}`} 
                onClick={() => setShowNotifications(!showNotifications)}
                title="Notificaciones"
              >
                <BsBell />
                {notificaciones.total > 0 && (
                  <span className={styles.notificationDot}></span>
                )}
              </button>

              {/* DROPDOWN DE NOTIFICACIONES */}
              {showNotifications && (
                <div className={styles.notificationDropdown}>
                  <div className={styles.notifHeader}>
                    <h4>Notificaciones</h4>
                    <span 
                      onClick={async () => {
                        // 1. Decimos al backend que marque todo como leído
                        await apiClient.post('notificaciones', { tipo: 'mensajes' });
                        
                        // 2. Bajamos el contador a 0 visualmente rápido
                        setNotificaciones(prev => ({ 
                          ...prev, 
                          mensajes: 0, 
                          total: Number(prev.total) - Number(prev.mensajes) 
                        }));
                        
                        // 3. Recargamos datos reales
                        checkNotificaciones();
                      }} 
                      style={{ cursor: 'pointer', fontSize: '0.8rem', color: '#0d6efd', fontWeight: 'bold' }}
                    >
                      Marcar leídas
                    </span>
                  </div>
                  
                  <div className={styles.notifList}>
                    {/* CASO VACÍO */}
                    {notificaciones.total === 0 && (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                        <BsCheckCircleFill size={22} />
                        <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
                          Todo está al día
                        </p>
                      </div>
                    )}
                    
                   {/* ITEM: COMENTARIOS */}
                    {notificaciones.comentarios > 0 && (
                      <div 
                        className={styles.notifItem} 
                        onClick={async () => { 
                           // 1. Avisamos al backend que ya los vimos
                           await apiClient.post('notificaciones', { tipo: 'comentarios' });
                           
                           // 2. Bajamos el contador visualmente al instante
                           setNotificaciones(prev => ({ 
                             ...prev, 
                             comentarios: 0, 
                             total: Number(prev.total) - Number(prev.comentarios) 
                           }));
                           
                           // 3. Navegamos
                           setShowNotifications(false); 
                           navigate('/admin/actividades'); 
                        }}
                      >
                        <div className={`${styles.notifIconBox} ${styles.blue}`}>
                          <BsInfoCircleFill />
                        </div>
                        <div className={styles.notifContent}>
                          <p className={styles.notifText}>
                            <strong>{notificaciones.comentarios}</strong> comentarios pendientes
                          </p>
                          <span className={styles.notifTime}>Clic para revisar</span>
                        </div>
                      </div>
                    )}

                    {/* ITEM: MENSAJES */}
                    {notificaciones.mensajes > 0 && (
                      <div 
                        className={styles.notifItem} 
                        onClick={async () => { 
                           // 1. Llamamos al backend para marcar leídos
                           await apiClient.post('notificaciones', { tipo: 'mensajes' });
                           // 2. Actualizamos el contador visualmente al instante
                           setNotificaciones(prev => ({ ...prev, mensajes: 0, total: Number(prev.total) - Number(prev.mensajes) }));
                           // 3. Cerramos y navegamos
                           setShowNotifications(false); 
                           navigate('/admin/mensajes'); 
                        }}
                      >
                        <div className={`${styles.notifIconBox} ${styles.orange}`}>
                          <BsEnvelopeFill />
                        </div>
                        <div className={styles.notifContent}>
                          <p className={styles.notifText}>
                            <strong>{notificaciones.mensajes}</strong> mensajes nuevos
                          </p>
                          <span className={styles.notifTime}>Haz clic para leerlos</span>
                        </div>
                      </div>
                    )}
                  </div> 
                  {/* CIERRE CORRECTO DE notifList */}

                </div>
              )}
            </div>
          </div>
        </header>

        <main className={styles.pageContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}