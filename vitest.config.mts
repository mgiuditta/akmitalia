import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/int/**/*.int.spec.ts?(x)'],
    // Il primo getPayload crea lo schema su Postgres: 10s non bastano.
    hookTimeout: 120000,
    testTimeout: 60000,
  },
})
