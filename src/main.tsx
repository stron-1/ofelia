// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Estilos globales
import './assets/styles/global.css';

// Layouts
import { RootLayout } from './components/layout/RootLayout';

// Páginas Públicas (Importaciones estándar)
import { HomePage } from './pages/HomePage';
import { HistoriaPage } from './pages/HistoriaPage';
import { NosotrosPage } from './pages/NosotrosPage';
import { ActividadesPage } from './pages/ActividadesPage';
import { ContactoPage } from './pages/ContactoPage';
import { AcademicoPage } from './pages/AcademicoPage';
import { AcademicoIndex } from './pages/AcademicoPage/AcademicoIndex';
import { PrimariaInfo } from './pages/AcademicoPage/Primaria/Info';
import { GaleriaPrimaria } from './pages/AcademicoPage/Primaria/Galeria';
import { SecundariaInfo } from './pages/AcademicoPage/Secundaria/Info';
import { GaleriaSecundaria } from './pages/AcademicoPage/Secundaria/Galeria';
import { PersonalDirectivo } from './pages/AcademicoPage/Personal/Directores';
import { PersonalAdministrativo } from './pages/AcademicoPage/Personal/Administrativos';

// Páginas de Administración (Dashboard)
import { ProtectedRoute } from './components/common/ProtectedRoute'; // Guardián de ruta
import { DashboardPage } from './pages/DashboardPage'; // Layout del Dashboard
import {
  DashboardIndex,
  GestionPrimariaPage,
  GestionSecundariaPage,
  GestionDirectivosPage,
  GestionAdministrativosPage // <-- Asegúrate de importar la nueva página
} from './pages/Admin'; // Importa todas las páginas de gestión

// Configuración del Router
const router = createBrowserRouter([
  {
    // --- Rutas Públicas ---
    path: '/',
    element: <RootLayout />, // Layout principal con Navbar y Footer
    children: [
      { index: true, element: <HomePage /> },
      { path: 'historia', element: <HistoriaPage /> },
      { path: 'nosotros', element: <NosotrosPage /> },
      {
        path: 'academico',
        element: <AcademicoPage />, // Layout específico para Académico
        children: [
          { index: true, element: <AcademicoIndex /> }, // Índice de Académico
          { path: 'primaria/info', element: <PrimariaInfo /> },
          { path: 'primaria/galeria', element: <GaleriaPrimaria /> },
          { path: 'secundaria/info', element: <SecundariaInfo /> },
          { path: 'secundaria/galeria', element: <GaleriaSecundaria /> },
          { path: 'personal/directores', element: <PersonalDirectivo /> },
          { path: 'personal/administrativos', element: <PersonalAdministrativo /> },
        ],
      },
      { path: 'actividades', element: <ActividadesPage /> },
      { path: 'contacto', element: <ContactoPage /> },
    ],
  },
  {
    // --- Rutas Protegidas del Dashboard ---
    path: '/dashboard',
    element: <ProtectedRoute />, // Primero verifica si el usuario está logueado
    children: [
      {
        // Si está logueado, renderiza el Layout del Dashboard
        element: <DashboardPage />,
        children: [
          // Rutas específicas DENTRO del Dashboard
          {
            index: true, // Ruta: /dashboard
            element: <DashboardIndex />, // Página de bienvenida del Dashboard
          },
          {
            path: 'primaria', // Ruta: /dashboard/primaria
            element: <GestionPrimariaPage />, // Gestión de secciones de primaria
          },
          {
            path: 'secundaria', // Ruta: /dashboard/secundaria
            element: <GestionSecundariaPage />, // Gestión de secciones de secundaria
          },
          {
            path: 'directivos', // Ruta: /dashboard/directivos
            element: <GestionDirectivosPage />, // Gestión de personal directivo
          },
          {
            path: 'administrativos', // <-- NUEVA RUTA
            element: <GestionAdministrativosPage />, // Gestión de personal administrativo
          },
          {
            path: 'usuarios', // Ruta: /dashboard/usuarios (Ejemplo)
            element: <div>Página de Gestión de Usuarios (Próximamente)</div>,
          },
        ],
      },
    ],
  },
]);

// Renderizar la aplicación
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);