import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

// 1. Importamos los iconos de react-icons/bs (Bootstrap Icons)
import {
  BsHouse,
  BsPeople,
  BsClockHistory,
  BsBook,
  BsCalendarEvent,
  BsEnvelope,
  BsList, // Icono de hamburguesa
  BsX,      // Icono de "Cerrar"
} from 'react-icons/bs';

export function Navbar() {
  // 2. Estado para manejar el menú móvil
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 3. Función para las clases activas (la misma que tenías)
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
  };

  // 4. Función para cerrar el menú al hacer clic en un enlace (en móvil)
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.navbar}>
      {/* Logo y Nombre */}
      <NavLink to="/" className={styles.navbarLogo} onClick={handleLinkClick}>
        <img
          src="/logo.png" 
          alt="Logo Colegio"
          className={styles.logoImage}
        />
        {/* Texto responsivo del logo */}
        <span className={styles.logoTextFull}>I.E OFELIA VELÁSQUEZ</span>
        <span className={styles.logoTextShort}>I.E OF.VE.</span>
      </NavLink>

      {/* Botón de Menú Hamburguesa */}
      <button
        className={styles.toggler}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle navigation"
      >
        {isMenuOpen ? <BsX /> : <BsList />}
      </button>

      {/* Contenedor de Enlaces Navegables */}
      <nav className={`${styles.navMenu} ${isMenuOpen ? styles.open : ''}`}>
        <ul className={styles.navLinksList}>
          <li>
            <NavLink to="/" className={getNavLinkClass} onClick={handleLinkClick}>
              <BsHouse /> Inicio
            </NavLink>
          </li>
                    <li>
            <NavLink to="/historia" className={getNavLinkClass} onClick={handleLinkClick}>
              <BsClockHistory /> Historia
            </NavLink>
          </li>
          <li>
            <NavLink to="/nosotros" className={getNavLinkClass} onClick={handleLinkClick}>
              <BsPeople /> Nosotros
            </NavLink>
          </li>
          <li>
            <NavLink to="/academico" className={getNavLinkClass} onClick={handleLinkClick}>
              <BsBook /> Académico
            </NavLink>
          </li>
          <li>
            <NavLink to="/actividades" className={getNavLinkClass} onClick={handleLinkClick}>
              <BsCalendarEvent /> Actividades
            </NavLink>
          </li>
          <li>
            <NavLink to="/contacto" className={getNavLinkClass} onClick={handleLinkClick}>
              <BsEnvelope /> Contacto
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}