import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import webfontDownload from 'vite-plugin-webfont-dl';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: '@/', replacement: `${__dirname}/src/` } 
    ]
  },
  server: {
    host: true,
  },
  plugins: [
    react(),
    webfontDownload([
      'https://fonts.googleapis.com/css2?family=Lato:wght@700&display=swap'
    ])
  ]
})
