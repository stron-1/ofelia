import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

// 1. Definimos que este componente acepta "children" (otros componentes dentro)
interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // 2. Buscamos el token en el almacenamiento
  const token = localStorage.getItem('authToken');

  // 3. Si NO hay token, lo mandamos a la página de inicio (o login)
  if (!token) {
    // replace: true evita que pueda volver atrás con el navegador
    return <Navigate to="/" replace />;
  }

  // 4. Si SÍ hay token, mostramos el contenido protegido (DashboardPage)
  return <>{children}</>;
}