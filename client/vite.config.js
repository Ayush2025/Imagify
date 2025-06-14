// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: '.',            // <-- "client/" is already CWD when this runs
  build: {
    outDir: 'dist',     // emits client/dist
    emptyOutDir: true
  },
  plugins: [react()]
})
