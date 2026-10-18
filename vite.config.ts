import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // No VITE_ prefix: the key stays in the dev server and never reaches the bundle.
  const apiKey = loadEnv(mode, import.meta.dirname, '').CURRENCYBEACON_API_KEY
  if (command === 'serve' && !apiKey) {
    throw new Error('CURRENCYBEACON_API_KEY is missing. Run `cp .env.example .env.local` and set it.')
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(import.meta.dirname, './src') },
    },
    server: {
      // The API doesn't send CORS headers, so the browser can't call it directly.
      // The app calls /api/* on the same origin, and this proxy sends it to the API and adds the key on the server.
      proxy: {
        '/api': {
          target: 'https://api.currencybeacon.com',
          changeOrigin: true,
          rewrite: (requestPath) => {
            const url = new URL(requestPath, 'http://localhost')
            url.searchParams.set('api_key', apiKey)
            return url.pathname.replace(/^\/api/, '/v1') + url.search
          },
        },
      },
    },
  }
})
