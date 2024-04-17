import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/o/course-registrations',
  build: {
    outDir: './vite-build'
  },
  plugins: [react()],
})
