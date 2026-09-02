# Synthetic payment screen generator

Browser studio that builds **fictional** mobile finance mockups for UI, localization, and dataset work.

It does **not** copy real bank or wallet apps, logos, or trademarks. Every transaction identifier includes a `SYNTH` marker. Live EUR/crypto rates are required; if they cannot be fetched, generation is blocked.

```bash
npm install
npm run dev
```

Open the local URL, wait for rates, then generate one or many screens. Each accepted PNG has a JSON sidecar in the ZIP export.
