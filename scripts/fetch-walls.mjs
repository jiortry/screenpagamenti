#!/usr/bin/env node
/** Scarica wallpaper chat: lune piene (maggioranza) e tramonti. */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const WALLS = join(__dirname, '../public/chat-walls')
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

/** moon-heavy set. first 9 moons, last 3 sunsets */
const ITEMS = [
  { file: 'w00.jpg', id: '1532763303805-619304dc4dd3' },
  { file: 'w01.jpg', id: '1488866022504-f2682130ca75' },
  { file: 'w02.jpg', id: '1520034475321-cbe0004014a7' },
  { file: 'w03.jpg', id: '1507400499-24a0ca5f2be3' },
  { file: 'w04.jpg', id: '1548048845-dabb4bfae716' },
  { file: 'w05.jpg', id: '1532693322450-2cb5c511055f' },
  { file: 'w06.jpg', id: '1764970692776-ce5fb30a7509' },
  { file: 'w07.jpg', id: '1760748860476-326fadf1ee44' },
  { file: 'w08.jpg', id: '1764126800913-6366abddc6a4' },
  { file: 'w09.jpg', id: '1470252649378-9c29740c9fa8' },
  { file: 'w10.jpg', id: '1469474968028-56623f02e42e' },
  { file: 'w11.jpg', id: '1439066615860-b82cceb22618' },
]

async function fetchBuf(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'image/*' },
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 2000) throw new Error(`too small (${buf.length})`)
  return buf
}

await mkdir(WALLS, { recursive: true })
let ok = 0
for (const item of ITEMS) {
  const url = `https://images.unsplash.com/photo-${item.id}?auto=format&fit=crop&w=720&h=1560&q=80`
  try {
    const buf = await fetchBuf(url)
    await writeFile(join(WALLS, item.file), buf)
    ok++
    console.log(`✓ ${item.file} (${Math.round(buf.length / 1024)}kb)`)
  } catch (e) {
    console.error(`✗ ${item.file}: ${e instanceof Error ? e.message : e}`)
  }
}
console.log(`Saved ${ok}/${ITEMS.length}`)
if (ok < 6) process.exit(1)
