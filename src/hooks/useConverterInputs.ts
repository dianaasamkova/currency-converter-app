import { useEffect, useState } from 'react'
import type { Currency } from '@/api'

const AMOUNT_PATTERN = /^\d*[.,]?\d*$/ // digits and one decimal separator; no letters, signs or "e"

/** Which field the user typed the amount in. The other field is calculated. */
export type Side = 'from' | 'to'

function pick(currencies: Currency[], code: string, fallbackIndex: number): Currency {
  return currencies.find((c) => c.short_code === code) ?? currencies[fallbackIndex] ?? currencies[0]
}

/** Reads the first values from the URL (`?amount=100&from=EUR&to=USD&side=from`), so the user doesn't lose them after reload. */
function readUrl(currencies: Currency[]) {
  const params = new URLSearchParams(window.location.search)

  const from = pick(currencies, params.get('from')?.toUpperCase() ?? 'USD', 0)
  let to = pick(currencies, params.get('to')?.toUpperCase() ?? 'PLN', 1)

  /**
   * to avoid the same "from" and "to"
   */
  if (to === from) to = currencies.find((c) => c !== from) ?? to
  const amount = params.get('amount') ?? '1'
  const side: Side = params.get('side') === 'to' ? 'to' : 'from'
  return { amountText: AMOUNT_PATTERN.test(amount) ? amount : '1', side, from, to }
}

/** Converter inputs: amount text, its side and the currencies. Reads them from the URL and keeps the URL updated. */
export function useConverterInputs(currencies: Currency[]) {
  const [initial] = useState(() => readUrl(currencies))

  const [amountText, setAmountText] = useState(initial.amountText)
  const [side, setSide] = useState(initial.side)
  const [from, setFrom] = useState(initial.from)
  const [to, setTo] = useState(initial.to)

  // Accept "," as decimal separator too (common in Europe). Empty or "." counts as 0.
  const amount = Number(amountText.replace(',', '.')) || 0

  useEffect(() => {
    const params = new URLSearchParams({ amount: amountText, from: from.short_code, to: to.short_code, side })
    window.history.replaceState(null, '', `?${params}`)
  }, [amountText, side, from, to])

  // TODO: limit decimals to the precision of the typed side's currency, and total digits to 15 (JS number precision).
  // TODO: accept pasted amounts like "1,234.56" or "$100" (strip symbols and thousands separators);
  //       today AMOUNT_PATTERN rejects the whole paste and the field silently doesn't change.
  function changeAmount(nextSide: Side, text: string) {
    if (!AMOUNT_PATTERN.test(text)) return
    setSide(nextSide)
    setAmountText(text)
  }

  // Picking the currency already used on the other side swaps them, so from !== to always.
  function selectFrom(currency: Currency) {
    if (currency.short_code === to.short_code) setTo(from)
    setFrom(currency)
  }
  function selectTo(currency: Currency) {
    if (currency.short_code === from.short_code) setFrom(to)
    setTo(currency)
  }
  function swap() {
    setFrom(to)
    setTo(from)
  }

  return { amountText, amount, side, from, to, changeAmount, selectFrom, selectTo, swap }
}
