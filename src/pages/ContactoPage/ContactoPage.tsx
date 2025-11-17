// --- 1. IMPORTAR useState y el nuevo Modal ---
import { useState } from 'react';
import { LoginModal } from '../../components/common/LoginModal';
// ---------------------------------------------

import styles from './ContactoPage.module.css';

// Importamos los iconos
import {
  BsGeoAlt,
  BsTelephone,
  BsEnvelope,
  BsClock,
} from 'react-icons/bs';

export function ContactoPage() {
  
  // --- 2. AÑADIR ESTADO PARA EL MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  // ---------------------------------------

  return (
    <> {/* Usamos un Fragment para incluir el modal fuera del page-container si es necesario */}
      <div className="page-container">
        <h1>Ponte en Contacto con Nosotros</h1>
        <p className={styles.introParagraph}>
          Si tienes alguna consulta, deseas más información o quieres coordinar una
          visita, no dudes en comunicarte a través de nuestros canales.
        </p>

        {/* Layout (Sin cambios) */}
        <div className={styles.contactoLayout}>
          
          {/* COLUMNA DE INFORMACIÓN (Sin cambios) */}
          <div className={styles.infoColumna}>
            <h2>Información de Contacto</h2>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}><BsGeoAlt /></div>
              <div className={styles.infoText}>
                <h4>Dirección</h4>
                <p>Jr. Alfonso Ugarte Cdr 1, Tarapoto, San Martín, Perú.</p>
              </div>
            </div>
            
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}><BsTelephone /></div>
              <div className={styles.infoText}>
                <h4>Teléfono</h4>
                <p>(042) 123-456</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}><BsEnvelope /></div>
              <div className={styles.infoText}>
                <h4>Correo</h4>
                <p>mesadepartes@ieofeliavelasquez.com</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}><BsClock /></div>
              <div className={styles.infoText}>
                <h4>Horario</h4>
                <p>Lunes a Viernes de 7:00 AM a 6:00 PM.</p>
              </div>
            </div>
          </div>

          {/* COLUMNA DE FORMULARIO (Sin cambios) */}
          <div className={styles.formColumna}>
            <h2>Envíanos un Mensaje</h2>
            <form className={styles.contactForm}>
              {/* ... campos del formulario sin cambios ... */}
              <div className={styles.formGroup}>
                <label htmlFor="name">Nombre completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Tu nombre y apellido"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="ejemplo@correo.com"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="message">Mensaje</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Escribe tu consulta aquí..."
                ></textarea>
              </div>
              <button type="submit" className={styles.submitBtn}>
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>

        {/* --- 3. NUEVA SECCIÓN DE LOGIN DE ADMIN (ANTES DEL MAPA) --- */}
        <section className={styles.adminLoginWrapper}>
          <button
            className={styles.adminLoginBtn}
            onClick={() => setIsModalOpen(true)} // Abre el modal
          >
            Acceder al Modo Administrador
          </button>
        </section>
        {/* ----------------------------------------------------------- */}

        {/* Sección de Mapa (Sin cambios) */}
        <section className={styles.mapSection}>
          <h2>Nuestra Ubicación</h2>
          <div className={styles.mapEmbed}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d660.0646239042999!2d-76.36223845103878!3d-6.486798026910776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91ba0c07c1219c61%3A0x2d69843d6c088011!2sEducational%20Institution%20Ofelia%20Velasquez!5e1!3m2!1sen!2spe!4v1761471819387!5m2!1sen!2spe"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </div>

      {/* --- 4. RENDERIZAR EL MODAL (Fuera del page-container) --- */}
      <LoginModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} // Pasa la función para cerrarlo
      />
      {/* --------------------------------------------------------- */}
    </>
  );
}