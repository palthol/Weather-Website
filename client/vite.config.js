import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000, // Development server port
    open: true, // Open the browser when the server starts
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Backend server
        changeOrigin: true,
        secure: false, // Allow self-signed certificates in development
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove '/api' prefix when forwarding
      },
    },
    cors: true, // Allow cross-origin requests during development
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'), // Output directory for production build
    emptyOutDir: true, // Clear previous build files
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias '@' for cleaner imports
    },
  },
});
