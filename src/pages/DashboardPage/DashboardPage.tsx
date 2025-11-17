import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div className={styles.dashboardContainer}>
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
        <div className={styles.logoArea}>
          {isSidebarOpen && <span className={styles.logoName}>ADMIN</span>}
        </div>
        <nav className={styles.navMenu}>
          {/* Inicio */}
          <NavLink to="/dashboard" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`} end>
            <span className="material-symbols-outlined">home</span>
            {isSidebarOpen && <span className={styles.linkText}>Inicio</span>}
          </NavLink>
          {/* Primaria */}
          <NavLink to="/dashboard/primaria" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <span className="material-symbols-outlined">school</span>
            {isSidebarOpen && <span className={styles.linkText}>Primaria</span>}
          </NavLink>
          {/* Secundaria */}
          <NavLink to="/dashboard/secundaria" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <span className="material-symbols-outlined">local_library</span>
            {isSidebarOpen && <span className={styles.linkText}>Secundaria</span>}
          </NavLink>
          {/* Directivos */}
          <NavLink to="/dashboard/directivos" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <span className="material-symbols-outlined">corporate_fare</span>
            {isSidebarOpen && <span className={styles.linkText}>Directivos</span>}
          </NavLink>
          {/* --- ADMINISTRATIVOS (EN ESPAÑOL) --- */}
          <NavLink to="/dashboard/administrativos" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <span className="material-symbols-outlined">support_agent</span>
            {isSidebarOpen && <span className={styles.linkText}>Administrativos</span>} {/* <-- Texto en Español */}
          </NavLink>
          {/* Usuarios */}
          <NavLink to="/dashboard/usuarios" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <span className="material-symbols-outlined">group</span>
            {isSidebarOpen && <span className={styles.linkText}>Usuarios</span>}
          </NavLink>
        </nav>
        {/* Cerrar Sesión */}
        <div className={styles.logoutSection}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <span className="material-symbols-outlined">logout</span>
            {isSidebarOpen && <span className={styles.linkText}>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>
      {/* Área Principal */}
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