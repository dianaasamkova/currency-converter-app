# Currency Converter: Requirements

**Goal:** converter in the Google style : enter an amount, pick two currencies, see the converted value from the [CurrencyBeacon API](https://currencybeacon.com/api-documentation).
**How it's built:** [TECHNICAL.md](TECHNICAL.md)

**In scope:** fiat currencies, conversion, currency search, swap.

## 1. User acceptance criteria

- When the page opens, currencies load from the API. Defaults: 1 USD → PLN.
- When user types in either amount field or changes a currency, the other field updates.
- When user can search in currency selector.
- When user clicks Swap, From and To swap and the result updates.
- When user picks the currency already chosen on the other side, the two currencies swap.
- When user types letters, `-` or a second separator, they are ignored. Only digits and one `.` or `,` are accepted.
- When the amount is empty or `0`, the other field is empty.
- When a request fails, user see error.

## 2. Technical acceptance criteria

- **Security:** the API key is never in git or in the browser bundle. A server-side proxy adds it (the API has no CORS anyway).
- **Correctness:** the latest currency pair always wins (the previous request is aborted). A result is never shown next to inputs it wasn't made for.
- **Performance:** typing sends no requests: the rate is loaded once per currency pair. The currency list is loaded once.
- **Accessibility:** WCAG 2.2 AA: inputs have labels, the currency list is an ARIA combobox, the result is announced to screen readers (`aria-live`).
- **Compatibility:** current evergreen browsers, from 375 px wide.
- **Quality:** strict TypeScript, `npm run build` and `npm run lint` pass.

## 3. Nice to have

- Retry button when a request fails
- Keyboard navigation in the currency list (↑/↓, Enter, Esc)
- Alphabetical sorting in the currency list
- Number formatting with thousands separators
- Amount limits: 15 digits max
- Rate line: `1 USD = 3.88 PLN`
- Unit tests 
- Deploy and add the live URL to the README
- Ideas: recently used currencies at the top of the list, a "Popular" group
