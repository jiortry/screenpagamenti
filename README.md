# Synthetic payment screen generator

Browser studio that builds realistic mobile finance mockups with **real app logos and brand names** (PayPal, Binance, Intesa Sanpaolo, Revolut, TIM, …) for UI, localization, and dataset work.

Status bars use real national mobile carriers. Live EUR/crypto rates are required; if they cannot be fetched, generation is blocked.

```bash
npm install
npm run fetch-logos   # scarica/aggiorna i loghi ufficiali in public/logos/
npm run dev
```

Open the local URL, wait for rates, then generate one or many screens. Each accepted PNG has a JSON sidecar in the ZIP export.
