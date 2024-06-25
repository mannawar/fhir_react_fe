import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: '../API/wwwroot'
  },
  server: {
    port: 3020
  },
  plugins: [react()],
  define: {
    'process.env': {}
  }
})
