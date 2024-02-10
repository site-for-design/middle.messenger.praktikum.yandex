import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    sourcemap: false,
    outDir: '../dist'
  },
})