import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { createScreenHandler } from './server/screen-api.mjs'

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function openRouterProxy(apiKey: string): Plugin {
  const handle = async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = req.url ?? ''
    if (!url.startsWith('/openrouter/chat')) return next()
    if (req.method === 'OPTIONS') {
      res.statusCode = 204
      res.end()
      return
    }
    if (req.method !== 'POST') {
      res.statusCode = 405
      res.end('POST only')
      return
    }
    if (!apiKey) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'OPENROUTER_API_KEY missing in .env.local' }))
      return
    }
    try {
      const body = await readBody(req)
      const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'screenpagamenti',
        },
        body,
      })
      const text = await upstream.text()
      res.statusCode = upstream.status
      res.setHeader('Content-Type', 'application/json')
      res.end(text)
    } catch (err) {
      res.statusCode = 502
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'proxy failed' }))
    }
  }

  return {
    name: 'openrouter-proxy',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        void handle(req, res, next)
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        void handle(req, res, next)
      })
    },
  }
}

function screenApi(apiKey: string): Plugin {
  return {
    name: 'screen-api',
    configureServer(server) {
      const handle = createScreenHandler({
        getOrigin: () => {
          const addr = server.httpServer?.address()
          const port = typeof addr === 'object' && addr ? addr.port : (server.config.server.port ?? 5173)
          return `http://localhost:${port}`
        },
        apiKey,
      })
      server.middlewares.use((req, res, next) => {
        void handle(req, res, next)
      })
    },
    configurePreviewServer(server) {
      const handle = createScreenHandler({
        getOrigin: () => {
          const addr = server.httpServer?.address()
          const port = typeof addr === 'object' && addr ? addr.port : (server.config.preview.port ?? 4173)
          return `http://localhost:${port}`
        },
        apiKey,
      })
      server.middlewares.use((req, res, next) => {
        void handle(req, res, next)
      })
    },
  }
}

const rateProxy = {
  '/rate-proxy/coingecko': {
    target: 'https://api.coingecko.com',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/rate-proxy\/coingecko/, ''),
  },
  '/rate-proxy/erapi': {
    target: 'https://open.er-api.com',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/rate-proxy\/erapi/, ''),
  },
  '/rate-proxy/currency': {
    target: 'https://cdn.jsdelivr.net',
    changeOrigin: true,
    rewrite: (path: string) =>
      path.replace(/^\/rate-proxy\/currency/, '/npm/@fawazahmed0/currency-api@latest'),
  },
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.CHROME_PATH) process.env.CHROME_PATH = env.CHROME_PATH
  return {
    plugins: [react(), openRouterProxy(env.OPENROUTER_API_KEY ?? ''), screenApi(env.SCREEN_API_KEY ?? '')],
    server: {
      port: 5173,
      proxy: rateProxy,
    },
    preview: {
      host: '127.0.0.1',
      port: 8787,
      strictPort: true,
      proxy: rateProxy,
    },
  }
})
