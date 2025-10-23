import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const API_BASE = process.env.VITE_API_URL;


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': `${API_BASE}`,
      '/uploads': `${API_BASE}`
    }
  }
})
