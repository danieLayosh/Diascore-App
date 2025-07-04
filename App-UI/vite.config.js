import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'diascore.layco.tech',
      'localhost',
      '127.0.0.1',
      "diascore-backend.layco.tech"
    ]
  }
})
