import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

// Este componente es el "cascarón" de nuestra aplicación
export function RootLayout() {
  return (
    <>
      <Navbar />
      <main>
        {/* React Router renderizará la página actual aquí */}
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  );
}