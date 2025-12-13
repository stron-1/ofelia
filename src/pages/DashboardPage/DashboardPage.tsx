import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './DashboardPage.module.css';
import { IMAGE_BASE_URL } from '../../api/apiClient';
import type { User } from '../../api/services/authService';
// Usamos iconos para las notificaciones
import { BsBell, BsGlobe, BsCheckCircleFill, BsEnvelopeFill, BsInfoCircleFill } from 'react-icons/bs';

export function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Estado para abrir/cerrar notificaciones
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const handleLogout = () => {
    if(confirm('¿Cerrar sesión?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/');
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
          </NavLink>

          <NavLink to="/admin/mensajes" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <span className="material-symbols-outlined">mail</span>
            {isSidebarOpen && <span className={styles.linkText}>Mensajes</span>}
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
          
          {/* IZQUIERDA: Toggle y Título */}
          <div className={styles.headerLeft}>
            <button onClick={toggleSidebar} className={styles.toggleBtn}>
              <span className="material-symbols-outlined">{isSidebarOpen ? 'menu_open' : 'menu'}</span>
            </button>
            <h2 className={styles.headerBreadcrumb}>{getPageTitle()}</h2>
          </div>

          {/* DERECHA: Acciones (Sin buscador) */}
          <div className={styles.headerRight} ref={notifRef}>
            
            {/* Botón Ver Web: target="_blank" OBLIGATORIO para no cerrar el admin */}
            <a href="/" target="_blank" className={styles.headerIconBtn} title="Ver sitio web (Nueva pestaña)">
              <BsGlobe />
            </a>

            {/* Contenedor de Notificaciones */}
            <div style={{position: 'relative'}}>
              <button 
                className={`${styles.headerIconBtn} ${showNotifications ? styles.activeBtn : ''}`} 
                onClick={() => setShowNotifications(!showNotifications)}
                title="Notificaciones"
              >
                <BsBell />
                <span className={styles.notificationDot}></span>
              </button>

              {/* DROPDOWN DE NOTIFICACIONES (TIPO INSTAGRAM) */}
              {showNotifications && (
                <div className={styles.notificationDropdown}>
                  <div className={styles.notifHeader}>
                    <h4>Notificaciones</h4>
                    <span>Marcar leídas</span>
                  </div>
                  
                  <div className={styles.notifList}>
                    {/* Item 1 */}
                    <div className={styles.notifItem}>
                      <div className={`${styles.notifIconBox} ${styles.blue}`}>
                        <BsCheckCircleFill />
                      </div>
                      <div className={styles.notifContent}>
                        <p className={styles.notifText}><strong>Actividad Creada</strong> se publicó correctamente en la web.</p>
                        <span className={styles.notifTime}>Hace 2 min</span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className={styles.notifItem}>
                       <div className={`${styles.notifIconBox} ${styles.orange}`}>
                        <BsEnvelopeFill />
                      </div>
                      <div className={styles.notifContent}>
                        <p className={styles.notifText}><strong>Nuevo Mensaje</strong> de un padre de familia.</p>
                        <span className={styles.notifTime}>Hace 1 hora</span>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className={styles.notifItem}>
                       <div className={`${styles.notifIconBox} ${styles.green}`}>
                        <BsInfoCircleFill />
                      </div>
                      <div className={styles.notifContent}>
                        <p className={styles.notifText}>Sistema actualizado a la versión 2.0</p>
                        <span className={styles.notifTime}>Ayer</span>
                      </div>
                    </div>
                  </div>
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