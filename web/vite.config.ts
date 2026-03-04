import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Dev should run at "/", Prod (GitHub Pages) must run at "/WorkingDashboard/react/"
  base: mode === 'development' ? '/' : '/WorkingDashboard/react/',
}))