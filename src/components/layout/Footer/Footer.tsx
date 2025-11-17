import { NavLink } from 'react-router-dom';
import styles from './Footer.module.css';

// Importamos los iconos que vamos a usar
import {
  BsGeoAlt,
  BsHouse,
  BsTelephone,
  BsEnvelope,
  BsClock,
  BsLink45Deg,
  BsPeople,
  BsClockHistory,
  BsBook,
  BsCalendarEvent,
  BsShare,
  BsFacebook,
  BsInstagram,
  BsYoutube,
} from 'react-icons/bs';
import { FaTiktok } from 'react-icons/fa6'; // TikTok está en FaTiktok

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        {/* --- Columna 1: Ubicación --- */}
        <div className={styles.footerSection}>
          <h5>
            <BsGeoAlt /> Ubicación
          </h5>
          <div className={styles.contactInfo}>
            <p>
              <BsHouse />
              <span>Jr. Alfonso Ugarte Cdr 1, Tarapoto, San Martín, Perú</span>
            </p>
            <p>
              <BsTelephone />
              <span>(042) 123-456</span>
            </p>
            <p>
              <BsEnvelope />
              <span>mesadepartes@ieofeliavelasquez.com</span>
            </p>
            <p>
              <BsClock />
              <span>Lun - Vie: 7:00 AM - 6:00 PM</span>
            </p>
          </div>
        </div>

        {/* --- Columna 2: Enlaces Rápidos --- */}
        <div className={styles.footerSection}>
          <h5>
            <BsLink45Deg /> Enlaces Rápidos
          </h5>
          <ul className={styles.linkList}>
            <li><NavLink to="/"><BsHouse /> Inicio</NavLink></li>
            <li><NavLink to="/nosotros"><BsPeople /> Nosotros</NavLink></li>
            <li><NavLink to="/historia"><BsClockHistory /> Historia</NavLink></li>
            <li><NavLink to="/academico"><BsBook /> Área Académica</NavLink></li>
            <li><NavLink to="/actividades"><BsCalendarEvent /> Actividades</NavLink></li>
            <li><NavLink to="/contacto"><BsEnvelope /> Contacto</NavLink></li>
          </ul>
        </div>

        {/* --- Columna 3: Síguenos --- */}
        <div className={styles.footerSection}>
          <h5>
            <BsShare /> Síguenos
          </h5>
          <p>Mantente conectado con nosotros en nuestras redes sociales</p>
          <div className={styles.socialIcons}>
            <a
              href="https://www.facebook.com/people/IE-Ofelia-Vel%C3%A1squez-Tarapoto/100026169972917/"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
            >
              <BsFacebook />
            </a>
            <a
              href="https://www.instagram.com/ofeliavelasquez_tarapoto?igsh=Mm94ZjcyM2J6emxq"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
            >
              <BsInstagram />
            </a>
            <a
              href="https://www.youtube.com/@OfeliaVel%C3%A1squez-Tpp"
              target="_blank"
              rel="noopener noreferrer"
              title="YouTube"
            >
              <BsYoutube />
            </a>
            <a
              href="https://www.tiktok.com/@ieofelia_velasquez_tpp?_t=ZS-8zaOUPGOF0i&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              title="TikTok"
            >
              <FaTiktok />
            </a>
          </div>
        </div>
      </div>

      {/* --- Línea de Copyright (del footer original) --- */}
      <div className={styles.footerCopyright}>
        <p>
          &copy; {currentYear} I.E. Ofelia Velásquez. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}