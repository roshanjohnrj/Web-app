import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
    
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'src/main.jsx', // Or your entry file
        // You could have other entry points for different pages if needed
      },
      output: {
        // ... output configuration ...
      },
    },
  },
})
