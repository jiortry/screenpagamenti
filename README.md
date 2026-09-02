# Synthetic payment screen generator

Browser studio that builds **original** mobile finance mockups for UI, localization, and dataset work.

It does **not** copy PayPal, Binance, or bank apps, and it does not use their logos. Status bars use real national mobile carriers (TIM, Verizon, Orange, MTN, …). Live EUR/crypto rates are required; if they cannot be fetched, generation is blocked.

```bash
npm install
npm run dev
```

Open the local URL, wait for rates, then generate one or many screens. Each accepted PNG has a JSON sidecar in the ZIP export.
