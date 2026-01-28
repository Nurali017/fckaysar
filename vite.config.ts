import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-charts': ['recharts'],
          'vendor-motion': ['framer-motion'],
          'vendor-i18n': ['i18next', 'react-i18next'],
          'vendor-ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
          ],
        },
      },
    },
  },
  server: {
    host: '::',
    port: 8080,
    strictPort: false, // Allow using next available port if 8080 is busy
    proxy: {
      // Proxy CMS media files (must be first to match before /api)
      '/api/media': {
        target: 'https://kaysar.kz',
        changeOrigin: true,
        secure: false,
      },
      // Proxy SOTA API requests
      '/api': {
        target: 'https://sota.id',
        changeOrigin: true,
        secure: false,
        rewrite: path => path,
      },
      // Proxy CMS API requests (Payload CMS on port 3000)
      '/cms-api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/cms-api/, '/api'),
      },
      // Proxy CMS media files (alternative path)
      '/media': {
        target: 'https://kaysar.kz',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), mode === 'development' && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));
