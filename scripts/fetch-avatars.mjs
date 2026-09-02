#!/usr/bin/env node
/**
 * Scarica ritratti e foto chat da fonti libere (RandomUser, Lorem Picsum, Unsplash).
 * Esegui: node scripts/fetch-avatars.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '../public')
const AVATARS = join(ROOT, 'avatars')
const PHOTOS = join(ROOT, 'chat-photos')
const WALLS = join(ROOT, 'chat-walls')
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

/** @type {{ file: string; url: string }[]} */
const JOBS = []

for (let i = 0; i < 50; i++) {
  JOBS.push({
    file: join(AVATARS, `m${String(i).padStart(2, '0')}.jpg`),
    url: `https://randomuser.me/api/portraits/men/${i}.jpg`,
  })
  JOBS.push({
    file: join(AVATARS, `w${String(i).padStart(2, '0')}.jpg`),
    url: `https://randomuser.me/api/portraits/women/${i}.jpg`,
  })
}

const UNSPLASH = [
  '1507003211169-0a1dd7228f2d',
  '1494790108377-be9c29b29330',
  '1500648767791-00dcc994a43e',
  '1534528741775-53994a69daeb',
  '1506794778202-cad84cf45f1d',
  '1524504388940-b1c1722653e1',
  '1539571696357-5a69c17a67c6',
  '1517841905240-472988babdf9',
  '1531746020798-e6953c6c8e8a',
  '1521119989659-a83eee488004',
  '1487412720507-e7ab37603c6f',
  '1504257432389-523e1b0af007',
  '1544005313-94ddf0286df2',
  '1552058544-f2b08422138a',
  '1438761681033-6461ffad8d80',
  '1472099645785-5658abf4ff4e',
  '1544723795-3fb6469f5b39',
  '1580489944761-15a19d654956',
  '1573496359142-b8d87734a5a2',
  '1560250097-0b93528c311a',
  '1508214751196-bcfd4ca60f91',
  '1463453091185-61582044d556',
  '1529626455594-4ff0802cfb7e',
  '1531123897727-8f129e1688ce',
  '1525134473541-d8d813d3d2a5',
  '1548142813-c348350df52b',
  '1519345182560-3f2917c472ef',
  '1488426862026-3ee34a7d66df',
  '1502823403499-6ccfcf4fb453',
  '1528892952291-009c663ce843',
]

UNSPLASH.forEach((id, i) => {
  JOBS.push({
    file: join(AVATARS, `u${String(i).padStart(2, '0')}.jpg`),
    url: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=256&h=256&q=80&crop=faces`,
  })
})

const PICSUM = [237, 292, 433, 582, 628, 766, 823, 888, 1015, 1016, 1025, 1036, 1043, 106, 1080, 1084]
PICSUM.forEach((id, i) => {
  JOBS.push({
    file: join(PHOTOS, `p${String(i).padStart(2, '0')}.jpg`),
    url: `https://picsum.photos/id/${id}/1080/1440`,
  })
})

const WALL_IDS = [
  '1772415912163-bd5fe16b8ff0',
  '1516339901601-2e1b62dc0c45',
  '1419242902214-272b3f66ee7a',
  '1444703686981-a3abbc4d4fe3',
  '1548048845-dabb4bfae716',
  '1475274047050-1d0c0975c63e',
  '1764970692776-ce5fb30a7509',
  '1760748860476-326fadf1ee44',
  '1764126800913-6366abddc6a4',
  '1470252649378-9c29740c9fa8',
  '1469474968028-56623f02e42e',
  '1495616811223-4d98c6e9c869',
  '1500534623283-312aade485b7',
  '1519681393784-d120267933ba',
]
WALL_IDS.forEach((id, i) => {
  JOBS.push({
    file: join(WALLS, `w${String(i).padStart(2, '0')}.jpg`),
    url: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=720&h=1400&q=80`,
  })
})

async function fetchBuf(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'image/*' },
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 800) throw new Error(`too small (${buf.length})`)
  return buf
}

async function runPool(items, n) {
  let i = 0
  let ok = 0
  const failed = []
  async function worker() {
    while (i < items.length) {
      const job = items[i++]
      try {
        const buf = await fetchBuf(job.url)
        await writeFile(job.file, buf)
        ok++
        console.log(`✓ ${job.file.replace(ROOT, 'public')} (${Math.round(buf.length / 1024)}kb)`)
      } catch (e) {
        failed.push({ file: job.file, error: String(e) })
        console.error(`✗ ${job.file.replace(ROOT, 'public')}: ${e instanceof Error ? e.message : e}`)
      }
    }
  }
  await Promise.all(Array.from({ length: n }, () => worker()))
  return { ok, failed }
}

await mkdir(AVATARS, { recursive: true })
await mkdir(PHOTOS, { recursive: true })
await mkdir(WALLS, { recursive: true })
const { ok, failed } = await runPool(JOBS, 8)
console.log(`\nSaved ${ok}/${JOBS.length}`)
if (failed.length) {
  console.error(`Failed ${failed.length}`)
  process.exitCode = failed.length > JOBS.length / 2 ? 1 : 0
}
