import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        // 'backend' es el nombre del servicio, puerto 80 es el puerto INTERNO de apache
        target: 'http://backend:80', 
        changeOrigin: true,
        // Eliminamos /api de la ruta porque tu index.php espera ?route=...
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Para cargar las imágenes
      '/uploads': {
        target: 'http://backend:80',
        changeOrigin: true,
      }
    }
  }
})