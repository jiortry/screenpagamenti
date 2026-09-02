/** Risolve l'icona merchant da etichetta movimento (anche localizzata). */
const SLUGS: [RegExp, string][] = [
  [/amazon/i, 'amazon'],
  [/netflix/i, 'netflix'],
  [/spotify/i, 'spotify'],
  [/uber/i, 'uber'],
  [/starbucks/i, 'starbucks'],
  [/apple/i, 'apple'],
  [/shell/i, 'shell'],
  [/rewe/i, 'rewe'],
  [/carrefour/i, 'carrefour'],
  [/mercadona/i, 'mercadona'],
  [/grab/i, 'grab'],
  [/shopee/i, 'shopee'],
  [/coupang/i, 'coupang'],
  [/migros/i, 'migros'],
  [/biedronka/i, 'biedronka'],
  [/sncf/i, 'sncf'],
  [/repsol/i, 'repsol'],
  [/continente/i, 'continente'],
  [/conad/i, 'conad'],
  [/esselunga/i, 'esselunga'],
  [/enel/i, 'enel'],
  [/\btim\b/i, 'tim'],
  [/swiggy/i, 'swiggy'],
  [/stipendio|salary|salário|nómina|salaire|gehalt|зарплат|급여|給与|lương|wynagrodzenie|sahod|เงินเดือน|বেতন|راتب|حقوق|maosh|maas|gaji/i, 'salary'],
  [/cashback|rimborso|refund|reembolso|remboursement|erstattung|возврат|환불|返金|hoàn|zwrot|คืนเงิน|রিফান্ড|استرداد|بازگشت|qaytarish|iadesi/i, 'refund'],
  [/freelance|fattura|facture|invoice|cliente/i, 'freelance'],
  [/bonifico|transfer|virement|überweisung|transferencia|перевод|переказ|송금|送金|chuyển|havale|انتقال/i, 'transfer'],
  [/farmacia|pharmacy/i, 'pharmacy'],
  [/grocery|supermerc|aliment/i, 'grocery'],
  [/gas|benzina|carburant|tankstelle|combustible/i, 'gas'],
  [/bar /i, 'cafe'],
]

export function merchantIcon(label: string): string | undefined {
  for (const [re, slug] of SLUGS) {
    if (re.test(label)) return `/logos/merchants/${slug}.png`
  }
  return undefined
}
