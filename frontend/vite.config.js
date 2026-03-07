import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // IMPRESCINDIBLE para acceder desde afuera
    port: 5173,
    proxy: {
      '/predict': {
        target: 'http://127.0.0.1:8000', // Apunta al FastAPI que corre en la misma EC2
        changeOrigin: true,
        secure: false,
      },
    },
  },
})