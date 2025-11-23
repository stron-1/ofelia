import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginModal.module.css';
import { authService } from '../../../api/services/authService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const data = await authService.login({ email, password });
      
      // Guardamos el token que nos devuelve PHP
      localStorage.setItem('authToken', data.token);
      
      // Guardamos datos del usuario por si los necesitamos
      localStorage.setItem('user', JSON.stringify(data.user));

      setSuccess('¡Login exitoso!');

      setTimeout(() => {
        onClose();
        navigate('/admin/dashboard'); // O la ruta que uses para el Dashboard
        window.location.reload(); // Forzamos recarga para actualizar el Navbar
      }, 1000);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Credenciales incorrectas o error de servidor.');
      }
    }
  };
  
  const handleClose = () => {
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Acceso Administrativo</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <p className={styles.errorMessage}>{error}</p>}
          {success && <p className={styles.successMessage}>{success}</p>}
          
          <button type="submit" className={styles.submitBtn}>
            Ingresar
          </button>
        </form>
        <button className={styles.closeBtn} onClick={handleClose}>×</button>
      </div>
    </div>
  );
}