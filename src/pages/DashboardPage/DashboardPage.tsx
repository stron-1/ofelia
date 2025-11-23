import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleLogout = () => {
    if(confirm('¿Cerrar sesión?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/');
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
        <div className={styles.logoArea}>
          {isSidebarOpen && <span className={styles.logoName}>ADMIN</span>}
        </div>
        <nav className={styles.navMenu}>
          
          {/* Inicio */}
          <NavLink to="/admin/dashboard" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`} end>
            <span className="material-symbols-outlined">home</span>
            {isSidebarOpen && <span className={styles.linkText}>Inicio</span>}
          </NavLink>
          
          {/* Secundaria */}
          <NavLink to="/admin/secundaria" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <span className="material-symbols-outlined">menu_book</span>
            {isSidebarOpen && <span className={styles.linkText}>Secundaria</span>}
          </NavLink>

          {/* Directivos (NUEVO) */}
          <NavLink to="/admin/directivos" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <span className="material-symbols-outlined">supervisor_account</span>
            {isSidebarOpen && <span className={styles.linkText}>Directivos</span>}
          </NavLink>

          {/* Administrativos (NUEVO) */}
          <NavLink to="/admin/administrativos" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <span className="material-symbols-outlined">support_agent</span>
            {isSidebarOpen && <span className={styles.linkText}>Administrativos</span>}
          </NavLink>

        </nav>
        <div className={styles.logoutSection}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <span className="material-symbols-outlined">logout</span>
            {isSidebarOpen && <span className={styles.linkText}>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>
      
      <div className={styles.mainArea}>
        <header className={styles.header}>
          <button onClick={toggleSidebar} className={styles.toggleBtn}>
            <span className="material-symbols-outlined">{isSidebarOpen ? 'menu_open' : 'menu'}</span>
          </button>
          <h1 className={styles.headerTitle}>Panel de Administración</h1>
        </header>
        <main className={styles.pageContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}