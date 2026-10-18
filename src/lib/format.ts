import type { Currency } from '@/api'

function moneyOptions(currency: Currency): Intl.NumberFormatOptions {
  return {
    minimumFractionDigits: currency.precision,
    maximumFractionDigits: currency.precision,
    trailingZeroDisplay: 'stripIfInteger',
  }
}

/** "1234567.891" in USD → "1,234,567.89"; whole numbers stay short ("100", not "100.00"). */
export function formatMoney(value: number, currency: Currency): string {
  return new Intl.NumberFormat('en', moneyOptions(currency)).format(value)
}

// Without thousands separators: the input uses "," as a decimal separator, so the user couldn't edit "1,234.56".
export function formatAmountInput(value: number, currency: Currency): string {
  return new Intl.NumberFormat('en', { ...moneyOptions(currency), useGrouping: false }).format(value)
}

// `date` is a plain day ("2026-10-16"): format it in UTC so it doesn't shift to the 15th west of Greenwich.
export function formatRateDate(date: string): string {
  return new Date(date).toLocaleDateString('en', { dateStyle: 'medium', timeZone: 'UTC' })
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString('en', { timeStyle: 'short' })
}
