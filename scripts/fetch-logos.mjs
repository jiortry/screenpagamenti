#!/usr/bin/env node
/**
 * Scarica loghi ufficiali da Simple Icons, Wikimedia e icone app ad alta risoluzione.
 * Esegui: node scripts/fetch-logos.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../public/logos')
const ICONS = join(OUT, 'icons')
const MERCHANTS_DIR = join(OUT, 'merchants')
const SI = 'https://cdn.jsdelivr.net/npm/simple-icons@14.2.0/icons'
const WVL = 'https://cdn.worldvectorlogo.com/logos'
const GICON = (domain) =>
  `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=256`

/** @type {{ file: string; url: string }[]} */
const LOGOS = [
  { file: 'chase.svg', url: `${SI}/chase.svg` },
  { file: 'bankofamerica.svg', url: `${SI}/bankofamerica.svg` },
  { file: 'wellsfargo.svg', url: `${SI}/wellsfargo.svg` },
  { file: 'revolut.svg', url: `${SI}/revolut.svg` },
  { file: 'n26.svg', url: `${SI}/n26.svg` },
  { file: 'deutschebank.svg', url: `${SI}/deutschebank.svg` },
  { file: 'commerzbank.svg', url: `${SI}/commerzbank.svg` },
  { file: 'fineco.svg', url: `${SI}/fineco.svg` },
  { file: 'barclays.svg', url: `${SI}/barclays.svg` },
  { file: 'hsbc.svg', url: `${SI}/hsbc.svg` },
  { file: 'paypal.svg', url: `${SI}/paypal.svg` },
  { file: 'applepay.svg', url: `${SI}/applepay.svg` },
  { file: 'googlepay.svg', url: `${SI}/googlepay.svg` },
  { file: 'venmo.svg', url: `${SI}/venmo.svg` },
  { file: 'cashapp.svg', url: `${SI}/cashapp.svg` },
  { file: 'wise.svg', url: `${SI}/wise.svg` },
  { file: 'westernunion.svg', url: `${SI}/westernunion.svg` },
  { file: 'moneygram.svg', url: `${SI}/moneygram.svg` },
  { file: 'binance.svg', url: `${SI}/binance.svg` },
  { file: 'coinbase.svg', url: `${SI}/coinbase.svg` },
  { file: 'bitcoin.svg', url: `${SI}/bitcoin.svg` },
  { file: 'ethereum.svg', url: `${SI}/ethereum.svg` },
  { file: 'tether.svg', url: `${SI}/tether.svg` },
  { file: 'monero.svg', url: `${SI}/monero.svg` },
  { file: 'ton.svg', url: `${SI}/ton.svg` },
  { file: 'visa.svg', url: `${SI}/visa.svg` },
  { file: 'mastercard.svg', url: `${SI}/mastercard.svg` },
  { file: 'vodafone.svg', url: `${SI}/vodafone.svg` },
  { file: 'orange.svg', url: `${SI}/orange.svg` },
  { file: 'verizon.svg', url: `${SI}/verizon.svg` },
  { file: 'atandt.svg', url: `${SI}/atandt.svg` },
  { file: 'deutschetelekom.svg', url: `${SI}/deutschetelekom.svg` },
  { file: 'o2.svg', url: `${SI}/o2.svg` },
  { file: 'movistar.svg', url: `${SI}/movistar.svg` },
  { file: 'jio.svg', url: `${SI}/jio.svg` },
  { file: 'airtel.svg', url: `${SI}/airtel.svg` },
  { file: 'intesa-sanpaolo.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Intesa_Sanpaolo_logo.svg' },
  { file: 'bnp-paribas.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/BNP_Paribas.svg' },
  { file: 'societe-generale.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Soci%C3%A9t%C3%A9_G%C3%A9n%C3%A9rale.svg' },
  { file: 'santander.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Banco_Santander_Logotipo.svg' },
  { file: 'standard-bank.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Standard_Bank_Logo.svg' },
  { file: 'bbva.svg', url: `${WVL}/bbva.svg` },
  { file: 'unicredit.svg', url: `${WVL}/unicredit-1.svg` },
  { file: 'kraken.svg', url: `${WVL}/kraken-1.svg` },
  { file: 'crypto-com.svg', url: `${WVL}/crypto-com-1.svg` },
  { file: 'tim.svg', url: `${WVL}/tim-1.svg` },
  { file: 'sfr.svg', url: `${WVL}/sfr-1.svg` },
  { file: 't-mobile.svg', url: `${WVL}/t-mobile-1.svg` },
  { file: 'safaricom.svg', url: `${WVL}/safaricom.svg` },
  { file: 'swisscom.svg', url: `${WVL}/swisscom.svg` },
  { file: 'windtre.png', url: GICON('windtre.it') },
  { file: 'iliad.png', url: GICON('iliad.it') },
  { file: 'ubs.png', url: GICON('ubs.com') },
  { file: 'remitly.png', url: GICON('remitly.com') },
  { file: 'bcr.png', url: GICON('bcr.ro') },
  { file: 'brd.png', url: GICON('brd.ro') },
  { file: 'ecobank.png', url: GICON('ecobank.com') },
  { file: 'mtn.png', url: GICON('mtn.com') },
]

/** @type {{ id: string; domain: string }[]} */
const APP_ICONS = [
  { id: 'intesa-sanpaolo', domain: 'intesasanpaolo.com' },
  { id: 'unicredit', domain: 'unicredit.it' },
  { id: 'fineco', domain: 'finecobank.com' },
  { id: 'chase', domain: 'chase.com' },
  { id: 'bank-of-america', domain: 'bankofamerica.com' },
  { id: 'wells-fargo', domain: 'wellsfargo.com' },
  { id: 'revolut', domain: 'revolut.com' },
  { id: 'n26', domain: 'n26.com' },
  { id: 'deutsche-bank', domain: 'db.com' },
  { id: 'commerzbank', domain: 'commerzbank.com' },
  { id: 'bnp-paribas', domain: 'bnpparibas.com' },
  { id: 'societe-generale', domain: 'societegenerale.com' },
  { id: 'bcr', domain: 'bcr.ro' },
  { id: 'brd', domain: 'brd.ro' },
  { id: 'barclays', domain: 'barclays.com' },
  { id: 'hsbc', domain: 'hsbc.com' },
  { id: 'santander', domain: 'santander.com' },
  { id: 'bbva', domain: 'bbva.com' },
  { id: 'ubs', domain: 'ubs.com' },
  { id: 'standard-bank', domain: 'standardbank.com' },
  { id: 'ecobank', domain: 'ecobank.com' },
  { id: 'paypal', domain: 'paypal.com' },
  { id: 'apple-pay', domain: 'apple.com' },
  { id: 'google-pay', domain: 'google.com' },
  { id: 'venmo', domain: 'venmo.com' },
  { id: 'cash-app', domain: 'cash.app' },
  { id: 'wise', domain: 'wise.com' },
  { id: 'western-union', domain: 'westernunion.com' },
  { id: 'remitly', domain: 'remitly.com' },
  { id: 'binance', domain: 'binance.com' },
  { id: 'coinbase', domain: 'coinbase.com' },
  { id: 'kraken', domain: 'kraken.com' },
  { id: 'crypto-com', domain: 'crypto.com' },
  { id: 'tim', domain: 'tim.it' },
  { id: 'vodafone', domain: 'vodafone.com' },
  { id: 'orange', domain: 'orange.com' },
  { id: 'moneygram', domain: 'moneygram.com' },
  { id: 'visa', domain: 'visa.com' },
  { id: 'mastercard', domain: 'mastercard.com' },
]

/** @type {{ slug: string; domain: string }[]} */
const MERCHANTS = [
  { slug: 'amazon', domain: 'amazon.com' },
  { slug: 'netflix', domain: 'netflix.com' },
  { slug: 'spotify', domain: 'spotify.com' },
  { slug: 'uber', domain: 'uber.com' },
  { slug: 'starbucks', domain: 'starbucks.com' },
  { slug: 'apple', domain: 'apple.com' },
  { slug: 'shell', domain: 'shell.com' },
  { slug: 'rewe', domain: 'rewe.de' },
  { slug: 'carrefour', domain: 'carrefour.fr' },
  { slug: 'mercadona', domain: 'mercadona.es' },
  { slug: 'grab', domain: 'grab.com' },
  { slug: 'shopee', domain: 'shopee.com' },
  { slug: 'coupang', domain: 'coupang.com' },
  { slug: 'migros', domain: 'migros.ch' },
  { slug: 'biedronka', domain: 'biedronka.pl' },
  { slug: 'sncf', domain: 'sncf.com' },
  { slug: 'repsol', domain: 'repsol.com' },
  { slug: 'continente', domain: 'continente.pt' },
  { slug: 'conad', domain: 'conad.it' },
  { slug: 'esselunga', domain: 'esselunga.it' },
  { slug: 'enel', domain: 'enel.it' },
  { slug: 'tim', domain: 'tim.it' },
  { slug: 'swiggy', domain: 'swiggy.com' },
  { slug: 'salary', domain: 'wise.com' },
  { slug: 'refund', domain: 'paypal.com' },
  { slug: 'freelance', domain: 'fiverr.com' },
  { slug: 'transfer', domain: 'revolut.com' },
  { slug: 'pharmacy', domain: 'boots.com' },
  { slug: 'grocery', domain: 'tesco.com' },
  { slug: 'gas', domain: 'eni.com' },
  { slug: 'cafe', domain: 'costacoffee.com' },
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchLogo({ file, url }) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'screenpagamenti-logo-fetch/1.0 (university project)' },
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status} from ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const head = buf.toString('utf8', 0, 200)
  if (file.endsWith('.svg') && !head.includes('<svg') && !head.includes('<?xml')) {
    throw new Error(`${file}: not a valid SVG`)
  }
  await writeFile(join(OUT, file), buf)
  console.log(`✓ ${file}`)
}

async function fetchAppIcon({ id, domain }) {
  const url = GICON(domain)
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) throw new Error(`${id}: HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(join(ICONS, `${id}.png`), buf)
  console.log(`✓ icons/${id}.png`)
}

async function fetchMerchantIcon({ slug, domain }) {
  const url = GICON(domain)
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) throw new Error(`${slug}: HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(join(MERCHANTS_DIR, `${slug}.png`), buf)
  console.log(`✓ merchants/${slug}.png`)
}

await mkdir(OUT, { recursive: true })
await mkdir(ICONS, { recursive: true })
await mkdir(MERCHANTS_DIR, { recursive: true })
const failed = []
for (const logo of LOGOS) {
  try {
    await fetchLogo(logo)
    if (logo.url.includes('wikimedia')) await sleep(1500)
  } catch (e) {
    failed.push({ ...logo, error: String(e) })
    console.error(`✗ ${logo.file}: ${e.message}`)
    if (logo.url.includes('wikimedia')) await sleep(3000)
  }
}

console.log('\nApp icons…')
for (const inst of APP_ICONS) {
  try {
    await fetchAppIcon(inst)
    await sleep(350)
  } catch (e) {
    failed.push({ file: `icons/${inst.id}.png`, error: String(e) })
    console.error(`✗ icons/${inst.id}.png: ${e.message}`)
  }
}

console.log('\nMerchant icons…')
for (const m of MERCHANTS) {
  try {
    await fetchMerchantIcon(m)
    await sleep(300)
  } catch (e) {
    failed.push({ file: `merchants/${m.slug}.png`, error: String(e) })
    console.error(`✗ merchants/${m.slug}.png: ${e.message}`)
  }
}

if (failed.length) {
  console.error(`\n${failed.length} download falliti`)
  process.exitCode = 1
} else {
  console.log(`\n${LOGOS.length} loghi + ${APP_ICONS.length} icone app + ${MERCHANTS.length} merchant in public/logos/`)
}
