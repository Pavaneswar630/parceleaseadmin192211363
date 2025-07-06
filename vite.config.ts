import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/parceleaseadmin192211363/', // ✅ this MUST match the repo name exactly
  plugins: [react()],
});
