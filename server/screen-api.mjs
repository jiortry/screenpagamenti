import { existsSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const KINDS = new Set(['telegram', 'payments', 'chatpay', 'random'])

export function resolveChrome(explicit) {
  const candidates = [
    explicit,
    process.env.CHROME_PATH,
    process.env.PUPPETEER_EXECUTABLE_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean)
  return candidates.find((p) => existsSync(p)) ?? candidates[0]
}

function send(res, status, body, extraHeaders = {}) {
  const json = typeof body === 'string' ? body : JSON.stringify(body)
  res.statusCode = status
  for (const [k, v] of Object.entries({
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store',
    ...extraHeaders,
  })) {
    res.setHeader(k, v)
  }
  res.end(json)
}

function unauthorized(req, key) {
  if (!key) return false
  const header = req.headers.authorization ?? ''
  const bearer = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
  const url = new URL(req.url ?? '/', 'http://local')
  const q = url.searchParams.get('key') ?? ''
  return bearer !== key && q !== key
}

/**
 * Open the headless generator page and return one random screen.
 * Reuse this from your own server:
 *
 *   import { generateRandomScreen } from './server/screen-api.mjs'
 *   const screen = await generateRandomScreen({ origin: 'http://127.0.0.1:5173' })
 */
export async function generateRandomScreen(opts = {}) {
  const origin = (opts.origin ?? 'http://localhost:5173').replace(/\/$/, '')
  const kind = KINDS.has(opts.kind) ? opts.kind : 'random'
  const seed = opts.seed ? String(opts.seed) : ''
  const timeout = Number(opts.timeoutMs) || (kind === 'chatpay' ? 90000 : 45000)
  const chrome = resolveChrome(opts.chromePath)
  if (!chrome) throw new Error('Chrome/Chromium not found. Set CHROME_PATH.')

  const qs = new URLSearchParams({ mode: 'api', kind: kind === 'random' ? 'random' : kind })
  if (seed) qs.set('seed', seed)
  const url = `${origin}/?${qs.toString()}`

  const browser = opts.browser ?? await puppeteer.launch({
    executablePath: chrome,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'],
  })
  const owned = !opts.browser
  try {
    const page = await browser.newPage()
    page.setDefaultTimeout(timeout)
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 })
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout })
    await page.waitForFunction(
      () => document.documentElement.dataset.apiReady === 'ok' || document.documentElement.dataset.apiReady === 'err',
      { timeout },
    )
    const result = await page.evaluate(() => window.__SCREEN_API_RESULT__)
    await page.close()
    if (!result) throw new Error('Generator returned an empty payload')
    return result
  } finally {
    if (owned) await browser.close()
  }
}

export function createScreenHandler(options = {}) {
  const getOrigin = options.getOrigin ?? (() => 'http://localhost:5173')
  const apiKey = options.apiKey ?? process.env.SCREEN_API_KEY ?? ''
  let browser

  const getBrowser = async () => {
    if (!browser) {
      const chrome = resolveChrome(options.chromePath)
      if (!chrome) throw new Error('Chrome/Chromium not found. Set CHROME_PATH.')
      browser = await puppeteer.launch({
        executablePath: chrome,
        headless: true,
        args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'],
      })
    }
    return browser
  }

  return async function screenApi(req, res, next) {
    const url = req.url ?? ''
    if (!url.startsWith('/api/screen')) {
      next()
      return
    }
    if (req.method === 'OPTIONS') {
      send(res, 204, '')
      return
    }
    if (req.method !== 'GET' && req.method !== 'POST') {
      send(res, 405, { ok: false, error: 'GET or POST only' })
      return
    }
    if (unauthorized(req, apiKey)) {
      send(res, 401, { ok: false, error: 'Unauthorized' })
      return
    }

    const parsed = new URL(url, 'http://local')
    const kind = parsed.searchParams.get('kind') || 'random'
    const seed = parsed.searchParams.get('seed') || ''
    const format = parsed.searchParams.get('format') || ''
    const accept = req.headers.accept ?? ''

    try {
      const result = await generateRandomScreen({
        origin: getOrigin(),
        kind,
        seed,
        browser: await getBrowser(),
      })
      if (!result?.ok) {
        send(res, 500, result ?? { ok: false, error: 'generation failed' })
        return
      }
      if (format === 'png' || accept.includes('image/png')) {
        const buf = Buffer.from(result.base64, 'base64')
        res.statusCode = 200
        res.setHeader('Content-Type', 'image/png')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Cache-Control', 'no-store')
        res.setHeader('X-Screen-Kind', result.kind)
        res.setHeader('X-Screen-Id', result.id)
        res.end(buf)
        return
      }
      send(res, 200, result)
    } catch (err) {
      send(res, 500, { ok: false, error: err instanceof Error ? err.message : 'generation failed' })
    }
  }
}
