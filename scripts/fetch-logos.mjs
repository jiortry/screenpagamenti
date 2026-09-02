#!/usr/bin/env node
/**
 * Scarica loghi ufficiali da Simple Icons e Wikimedia Commons.
 * Esegui: node scripts/fetch-logos.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../public/logos')
const SI = 'https://cdn.jsdelivr.net/npm/simple-icons@14.2.0/icons'

/** @type {{ file: string; url: string }[]} */
const LOGOS = [
  // Simple Icons — banche e fintech
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
  // Wallet / P2P / remit
  { file: 'paypal.svg', url: `${SI}/paypal.svg` },
  { file: 'applepay.svg', url: `${SI}/applepay.svg` },
  { file: 'googlepay.svg', url: `${SI}/googlepay.svg` },
  { file: 'venmo.svg', url: `${SI}/venmo.svg` },
  { file: 'cashapp.svg', url: `${SI}/cashapp.svg` },
  { file: 'wise.svg', url: `${SI}/wise.svg` },
  { file: 'westernunion.svg', url: `${SI}/westernunion.svg` },
  { file: 'moneygram.svg', url: `${SI}/moneygram.svg` },
  // Crypto exchange
  { file: 'binance.svg', url: `${SI}/binance.svg` },
  { file: 'coinbase.svg', url: `${SI}/coinbase.svg` },
  // Crypto asset
  { file: 'bitcoin.svg', url: `${SI}/bitcoin.svg` },
  { file: 'ethereum.svg', url: `${SI}/ethereum.svg` },
  { file: 'tether.svg', url: `${SI}/tether.svg` },
  { file: 'monero.svg', url: `${SI}/monero.svg` },
  { file: 'ton.svg', url: `${SI}/ton.svg` },
  // Carte
  { file: 'visa.svg', url: `${SI}/visa.svg` },
  { file: 'mastercard.svg', url: `${SI}/mastercard.svg` },
  // Operatori
  { file: 'vodafone.svg', url: `${SI}/vodafone.svg` },
  { file: 'orange.svg', url: `${SI}/orange.svg` },
  { file: 'verizon.svg', url: `${SI}/verizon.svg` },
  { file: 'atandt.svg', url: `${SI}/atandt.svg` },
  { file: 'deutschetelekom.svg', url: `${SI}/deutschetelekom.svg` },
  { file: 'o2.svg', url: `${SI}/o2.svg` },
  { file: 'movistar.svg', url: `${SI}/movistar.svg` },
  { file: 'jio.svg', url: `${SI}/jio.svg` },
  { file: 'airtel.svg', url: `${SI}/airtel.svg` },
  // Wikimedia Commons (Special:FilePath risolve l'URL corretto)
  { file: 'intesa-sanpaolo.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Intesa_Sanpaolo_logo.svg' },
  { file: 'unicredit.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/UniCredit_logo.svg' },
  { file: 'bnp-paribas.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/BNP_Paribas.svg' },
  { file: 'societe-generale.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Soci%C3%A9t%C3%A9_G%C3%A9n%C3%A9rale.svg' },
  { file: 'santander.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Banco_Santander_Logotipo.svg' },
  { file: 'bbva.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/BBVA_Logo.svg' },
  { file: 'ubs.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/UBS_Logo.svg' },
  { file: 'kraken.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kraken-logo-purple.svg' },
  { file: 'crypto-com.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Crypto.com_logo.svg' },
  { file: 'remitly.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Remitly_logo.svg' },
  { file: 'bcr.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/BCR_logo.svg' },
  { file: 'brd.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/BRD_Groupe_Societe_Generale_logo.svg' },
  { file: 'standard-bank.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Standard_Bank_Logo.svg' },
  { file: 'ecobank.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ecobank_logo.svg' },
  { file: 'tim.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/TIM_logo_2016.svg' },
  { file: 'windtre.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/WindTre_logo.svg' },
  { file: 'iliad.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Iliad_logo.svg' },
  { file: 't-mobile.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/T-Mobile_USA_logo.svg' },
  { file: 'mtn.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/MTN_Group_Limited_Logo.svg' },
  { file: 'safaricom.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Safaricom_Logo.svg' },
  { file: 'swisscom.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Swisscom_logo.svg' },
  { file: 'sfr.svg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/SFR_logo_2014.svg' },
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchLogo({ file, url }) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'screenpagamenti-logo-fetch/1.0 (university project)' },
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status} from ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(join(OUT, file), buf)
  console.log(`✓ ${file}`)
}

await mkdir(OUT, { recursive: true })
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
if (failed.length) {
  console.error(`\n${failed.length} logo falliti su ${LOGOS.length}`)
  process.exitCode = 1
} else {
  console.log(`\n${LOGOS.length} loghi scaricati in public/logos/`)
}
