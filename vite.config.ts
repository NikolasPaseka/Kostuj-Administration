import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr({
      svgrOptions: { exportType: "default", ref: true, svgo: false, titleProp: true },
      include: "**/*.svg",
    }
  )],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  },
  optimizeDeps: {
    exclude: ['js-big-decimal', '@heroui_react.js']
  }
})
