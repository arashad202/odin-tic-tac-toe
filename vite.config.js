import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  base: '/odin-tic-tac-toe/',
  plugins: [
    tailwindcss(),
  ],
})