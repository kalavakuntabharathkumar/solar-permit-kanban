import { defineConfig } from 'vite';
import angular from '@vitejs/plugin-angular';

export default defineConfig({
  plugins: [angular()],
  build: { target: 'es2022' },
  server: { port: 4200 },
});