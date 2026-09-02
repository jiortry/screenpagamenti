# Synthetic payment screen generator

Browser studio that builds realistic mobile finance mockups with **real app logos and brand names** (PayPal, Binance, Intesa Sanpaolo, Revolut, TIM, …) for UI, localization, and dataset work.

Status bars use real national mobile carriers. Live EUR/crypto rates are required; if they cannot be fetched, generation is blocked.

```bash
npm install
npm run fetch-logos   # scarica/aggiorna i loghi ufficiali in public/logos/
npm run dev
```

Open the local URL, wait for rates, then generate one or many screens. Each accepted PNG has a JSON sidecar in the ZIP export.

## API interna (solo localhost)

L’API **non è pubblica**. Gira solo su `127.0.0.1:8787` della VPS, fuori da Docker, senza nginx, senza toccare database o altri servizi già attivi.

Da una shell **sulla stessa macchina** (o da un processo locale):

```bash
# JSON con PNG in base64 (kind casuale: telegram | payments | chatpay)
curl -sS http://127.0.0.1:8787/api/screen

# Uno specifico
curl -sS 'http://127.0.0.1:8787/api/screen?kind=telegram'
curl -sS 'http://127.0.0.1:8787/api/screen?kind=payments'
curl -sS 'http://127.0.0.1:8787/api/screen?kind=chatpay'

# Solo il PNG
curl -sS -H 'Accept: image/png' 'http://127.0.0.1:8787/api/screen?kind=telegram' -o screen.png
```

Risposta JSON:

```json
{
  "ok": true,
  "kind": "telegram",
  "id": "…",
  "png": "data:image/png;base64,…",
  "base64": "…",
  "width": 390,
  "height": 844
}
```

`kind=chatpay` usa Gemini via OpenRouter (`OPENROUTER_API_KEY` in `/opt/screenpagamenti/.env.local`). Gli altri kind no.

Stato del servizio sulla VPS:

```bash
systemctl status screenpagamenti
journalctl -u screenpagamenti -n 80 --no-pager
```
