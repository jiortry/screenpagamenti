import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/rate-proxy/coingecko': {
        target: 'https://api.coingecko.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rate-proxy\/coingecko/, ''),
      },
      '/rate-proxy/erapi': {
        target: 'https://open.er-api.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rate-proxy\/erapi/, ''),
      },
      '/rate-proxy/currency': {
        target: 'https://cdn.jsdelivr.net',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/rate-proxy\/currency/, '/npm/@fawazahmed0/currency-api@latest'),
      },
    },
  },
})
