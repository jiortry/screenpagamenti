#!/usr/bin/env node
/**
 * Scarica .woff2 OFL (sottoinsieme latin) da Google Fonts.
 * PayPal Sans / BinancePlex non sono licenziabili: Jost e IBM Plex Sans sono i match pubblici.
 * Esegui: node scripts/fetch-fonts.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../public/fonts')
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

/** @type {{ id: string; query: string }[]} */
const FAMILIES = [
  { id: 'jost', query: 'Jost:wght@400;500;600;700' },
  { id: 'ibm-plex-sans', query: 'IBM+Plex+Sans:wght@400;500;600;700' },
  { id: 'inter', query: 'Inter:wght@400;500;600;700;800' },
  { id: 'manrope', query: 'Manrope:wght@400;600;700;800' },
  { id: 'dm-sans', query: 'DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;0,9..40,700' },
  { id: 'space-grotesk', query: 'Space+Grotesk:wght@400;500;600;700' },
  { id: 'barlow', query: 'Barlow:wght@400;500;600;700' },
  { id: 'outfit', query: 'Outfit:wght@400;600;700;800' },
  { id: 'sora', query: 'Sora:wght@400;600;700' },
]

function latinFaces(css) {
  const parts = css.split('/* latin */')
  /** @type {{ family: string; weight: string; url: string }[]} */
  const faces = []
  for (let i = 1; i < parts.length; i++) {
    const block = parts[i].split('/* ')[0]
    const family = block.match(/font-family:\s*'([^']+)'/)?.[1]
    const weight = block.match(/font-weight:\s*(\d+)/)?.[1]
    const url = block.match(/src:\s*url\(([^)]+)\)/)?.[1]
    if (family && weight && url) faces.push({ family, weight, url: url.replace(/['"]/g, '') })
  }
  return faces
}

async function fetchCss(query) {
  const url = `https://fonts.googleapis.com/css2?family=${query}&display=swap`
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`CSS ${query}: HTTP ${res.status}`)
  return res.text()
}

await mkdir(OUT, { recursive: true })
const failed = []
let saved = 0

for (const fam of FAMILIES) {
  try {
    const css = await fetchCss(fam.query)
    const faces = latinFaces(css)
    if (!faces.length) throw new Error(`no latin @font-face in ${fam.id}`)
    const seen = new Set()
    for (const face of faces) {
      const key = `${fam.id}-${face.weight}`
      if (seen.has(key)) continue
      seen.add(key)
      const res = await fetch(face.url, { headers: { 'User-Agent': UA } })
      if (!res.ok) throw new Error(`${key}: HTTP ${res.status}`)
      const buf = Buffer.from(await res.arrayBuffer())
      if (buf.length < 1000) throw new Error(`${key}: file too small (${buf.length})`)
      const file = `${key}.woff2`
      await writeFile(join(OUT, file), buf)
      saved++
      console.log(`✓ ${file} (${Math.round(buf.length / 1024)}kb)`)
    }
  } catch (e) {
    failed.push({ id: fam.id, error: String(e) })
    console.error(`✗ ${fam.id}: ${e instanceof Error ? e.message : e}`)
  }
}

if (failed.length) {
  console.error(`\n${failed.length} famiglie fallite`)
  process.exitCode = 1
} else {
  console.log(`\n${saved} file in public/fonts/`)
}
