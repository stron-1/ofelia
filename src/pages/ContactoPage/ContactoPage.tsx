import { useState, type FormEvent } from 'react';
import { LoginModal } from '../../components/common/LoginModal';
import { contactoService } from '../../api/services/contactoService'; 
import styles from './ContactoPage.module.css';

import {
  BsGeoAlt,
  BsTelephone,
  BsEnvelope,
  BsClock,
  BsSend
} from 'react-icons/bs';

export function ContactoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      await contactoService.create(formData);
      setStatus('success');
      setFormData({ nombre: '', email: '', mensaje: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <> 
      <div className="page-container">
        <h1>Ponte en Contacto</h1>
        <p className={styles.introParagraph}>
          Estamos aquí para atenderte. Encuentra nuestra información, escríbenos un mensaje o visítanos.
        </p>

        {/* --- GRID DE 3 TARJETAS --- */}
        <div className={styles.contactGrid}>
          
          {/* TARJETA 1: INFORMACIÓN */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Información</h3>
            
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}><BsGeoAlt /></div>
              <div className={styles.infoText}>
                <h4>Dirección</h4>
                <p>Jr. Alfonso Ugarte Cdr 1, Tarapoto, San Martín.</p>
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
                <p>informes@ieofeliavelasquez.edu.pe</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}><BsClock /></div>
              <div className={styles.infoText}>
                <h4>Horario</h4>
                <p>Lun - Vie: 7:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          {/* TARJETA 2: FORMULARIO */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Escríbenos</h3>
            <form className={styles.contactForm} onSubmit={handleSubmit}>
              
              <div className={styles.formGroup}>
                <label htmlFor="nombre">Nombre completo</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tucorreo@ejemplo.com"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="mensaje">Mensaje</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows={4}
                  placeholder="¿En qué podemos ayudarte?"
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Enviando...' : <><BsSend /> Enviar</>}
              </button>

              {status === 'success' && (
                <p style={{ color: 'green', marginTop: '1rem', textAlign:'center', fontSize:'0.9rem' }}>
                  ¡Mensaje enviado!
                </p>
              )}
              {status === 'error' && (
                <p style={{ color: 'red', marginTop: '1rem', textAlign:'center', fontSize:'0.9rem' }}>
                  Error al enviar.
                </p>
              )}
            </form>
          </div>

          {/* TARJETA 3: UBICACIÓN */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Ubicación</h3>
            <div className={styles.mapWrapper}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d660.0646239042999!2d-76.36223845103878!3d-6.486798026910776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91ba0c07c1219c61%3A0x2d69843d6c088011!2sEducational%20Institution%20Ofelia%20Velasquez!5e1!3m2!1sen!2spe!4v1761471819387!5m2!1sen!2spe"
                width="100%"
                height="100%"
                title="Mapa Ubicación"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>

        {/* LOGIN ADMIN */}
        <section className={styles.adminLoginWrapper}>
          <button
            className={styles.adminLoginBtn}
            onClick={() => setIsModalOpen(true)}
          >
            Acceder al Modo Administrador
          </button>
        </section>

      </div>

      <LoginModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}