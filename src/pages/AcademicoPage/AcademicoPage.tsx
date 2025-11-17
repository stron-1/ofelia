import { Outlet } from 'react-router-dom';

/**
 * Este componente AHORA es solo un "Layout" o "Contenedor".
 * Su única función es renderizar la ruta hija que corresponda 
 * (la página de carpetas, o la página de Primaria Info, etc.)
 */
export function AcademicoPage() {
  // El "page-container" que tenías antes se queda para centrar el contenido
  return (
    <div className="page-container">
      <Outlet />
    </div>
  );
}