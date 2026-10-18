# Currency Converter: Technical Spec

**What:** single-page converter in the style of Google's. Requirements: [REQUIREMENTS.md](REQUIREMENTS.md).
**Stack:** React 19, TypeScript (strict), Vite, Tailwind CSS v4, shadcn/ui (`Popover` only), oxlint.

## 1. Architecture

- The browser calls same-origin `/api/currencies` and `/api/convert`.
- A proxy forwards them to CurrencyBeacon and adds the API key: Vite `server.proxy` in dev, a Vercel Function (`api/[endpoint].ts`) in prod.
- **Why a proxy:** the API has no CORS, so a browser can't call it directly. It also keeps the key on the server.
- **Key safety:** `CURRENCYBEACON_API_KEY` has no `VITE_` prefix (never in the bundle), and `.env.local` is git-ignored.
- The proxy only forwards `currencies` and `convert`.

## 2. Code structure

- `src/api.ts`: API types and calls; turns API errors into `Error`.
- `src/hooks/useCurrencies.ts`: loads the currency list once.
- `src/hooks/useConverterInputs.ts`: amount, the side it was typed in, currencies, input rules, URL sync.
- `src/hooks/useRate.ts`: abortable rate loading per currency pair; local conversion.
- `src/components/`: UI (converter, currency select, fields, result, error).
- `src/lib/format.ts`: number and date formatting.

## 3. Key decisions

- **No extra libraries** for state, fetching or validation: plain hooks are enough.
- **Rate-based conversion:** one request per currency pair (`amount=1`); typing converts locally, so no request per keystroke.
- **The rate is stored with its pair:** a value is never shown next to the wrong currencies.
- **Full currency names** from the browser (`Intl.DisplayNames`): the API only gives short ones ("Zloty").
- **Inputs in the URL:** a reload or a shared link keeps them.
- **Same currency on both sides - swap:** from and to are always different.
- **Either field is editable:** the last edited one is the source, the other is converted.

## 4. API notes

- `GET /currencies?type=fiat` (161 currencies) and `GET /convert?from&to&amount`.
- An unknown code or bad amount returns HTTP 200 with `value: 0`, not an error. Codes come only from the list and the amount is validated, so this can't happen.
- On error the UI shows the API's message (or "Network error") with Retry.

## 5. Known gaps

- Amount limits (15 digits, decimals per currency)
- Pasting `$1,234.56`
- Symbol after the number (`100 zł`)
- Rate line `1 USD = 3.88 PLN`
- Unit tests

## 6. Run and deploy

- Local: `cp .env.example .env.local` (add the key), then `npm install && npm run dev`.
- Deploy: import the repo on Vercel and set `CURRENCYBEACON_API_KEY`.
