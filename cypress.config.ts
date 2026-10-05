import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    specPattern: 'cypress/e2e/**/*.cy.{ts,tsx}',
  },
  component: {
    devServer: { framework: 'angular', bundler: 'vite' },
  },
});