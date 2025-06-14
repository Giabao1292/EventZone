import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // địa chỉ backend Spring Boot của bạn
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
