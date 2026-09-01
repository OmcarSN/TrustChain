import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: true,
  },
  resolve: {
    alias: {
      buffer: 'buffer/',
    }
  },
  define: {
    'global': 'globalThis',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split the massive Stellar SDK into its own chunk
          if (id.includes('@stellar/stellar-sdk') || id.includes('stellar-base')) {
            return 'stellar-sdk';
          }
          // Split Supabase client
          if (id.includes('@supabase')) {
            return 'supabase';
          }
          // Split charting library (only used on /analytics)
          if (id.includes('recharts') || id.includes('d3-')) {
            return 'recharts';
          }
          // Split animation library
          if (id.includes('framer-motion')) {
            return 'framer';
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/test/**', 'src/i18n.js', 'src/main.jsx'],
    }
  }
})
