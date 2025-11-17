import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  // Comprueba si el token existe en localStorage
  const token = localStorage.getItem('authToken');

  if (token) {
    // Si hay token, renderiza la página que está dentro (el Outlet)
    // En este caso, será <DashboardPage />
    return <Outlet />;
  }

  // Si no hay token, redirige a la página de inicio
  // (Puedes cambiarlo a '/contacto' si prefieres)
  return <Navigate to="/" replace />;
}