import { defineConfig } from 'vite';
import angular from '@vitejs/plugin-angular';

export default defineConfig({
  plugins: [angular()],
  server: {
    port: 4200
  }
});