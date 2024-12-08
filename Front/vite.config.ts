import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  plugins: [react()],
  server: {
    open: false,  // Disable automatic opening to avoid xdg-open error
    host: true,   // Expose to the host machine
    port: 3000,
  },
});