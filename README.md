# Currency Converter

A Google-style currency converter built with React 19, TypeScript, Vite, Tailwind CSS v4 and shadcn/ui.
Currencies and conversions come from the [CurrencyBeacon API](https://currencybeacon.com/).

## Run locally

1. Get a free API key at <https://currencybeacon.com/register>.
2. Create your env file and put the key in it:
   ```bash
   cp .env.example .env.local
   ```
3. Start with Docker:
   ```bash
   docker compose up --build
   ```
   Or with Node 20.19+:
   ```bash
   npm install && npm run dev
   ```
4. Open <http://localhost:5173>.

Other scripts: `npm run build`, `npm run lint`.

The key is read from `CURRENCYBEACON_API_KEY` (no `VITE_` prefix), so it never ends up in the client bundle or in git (`.env.local` is ignored).


See [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) for scope and acceptance criteria, and [docs/TECHNICAL.md](docs/TECHNICAL.md) for architecture, the API contract and known gaps.
