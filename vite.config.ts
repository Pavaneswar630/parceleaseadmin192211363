// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/parceleaseadmin192211363/', // 👈 Change this to your GitHub repo name
  plugins: [react()]
})
