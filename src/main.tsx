import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './assets/styles/global.css';

import { RootLayout } from './components/layout/RootLayout';
import { HomePage } from './pages/HomePage/HomePage';
import { HistoriaPage } from './pages/HistoriaPage/HistoriaPage';
import { NosotrosPage } from './pages/NosotrosPage/NosotrosPage';
import { ActividadesPage } from './pages/ActividadesPage/ActividadesPage';
import { ContactoPage } from './pages/ContactoPage/ContactoPage';
import { AcademicoPage } from './pages/AcademicoPage/AcademicoPage';
import { AcademicoIndex } from './pages/AcademicoPage/AcademicoIndex';

// Solo importamos Secundaria
import { SecundariaInfo } from './pages/AcademicoPage/Secundaria/Info/SecundariaInfo';
import { GaleriaSecundaria } from './pages/AcademicoPage/Secundaria/Galeria/GaleriaSecundaria';

import { PersonalDirectivo } from './pages/AcademicoPage/Personal/Directores/PersonalDIrectivo';
import { PersonalAdministrativo } from './pages/AcademicoPage/Personal/Administrativos/PersonalAdministrativo';

import { ProtectedRoute } from './components/common/ProtectedRoute/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { DashboardIndex } from './pages/Admin/DashboardIndex';
// Solo importamos gestiones de Secundaria y Personal
import { GestionSecundariaPage } from './pages/Admin/GestionSecundariaPage';
import { GestionDirectivosPage } from './pages/Admin/GestionDirectivosPage';
import { GestionAdministrativosPage } from './pages/Admin/GestionAdministrativosPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "historia", element: <HistoriaPage /> },
      { path: "nosotros", element: <NosotrosPage /> },
      { path: "actividades", element: <ActividadesPage /> },
      { path: "contacto", element: <ContactoPage /> },
      {
        path: "academico",
        element: <AcademicoPage />,
        children: [
          { index: true, element: <AcademicoIndex /> },
          // Eliminadas rutas de Primaria
          { path: "secundaria-info", element: <SecundariaInfo /> },
          { path: "secundaria-galeria", element: <GaleriaSecundaria /> },
          { path: "directivos", element: <PersonalDirectivo /> },
          { path: "administrativos", element: <PersonalAdministrativo /> },
        ]
      },
    ]
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <DashboardIndex /> },
      // Eliminada ruta de gestión primaria
      { path: "secundaria", element: <GestionSecundariaPage /> },
      { path: "directivos", element: <GestionDirectivosPage /> },
      { path: "administrativos", element: <GestionAdministrativosPage /> },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);