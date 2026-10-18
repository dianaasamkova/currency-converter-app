import type { ReactNode } from 'react'
import type { Currency } from '@/api'

type Props = {
  id: string
  label: string
  currency: Currency
  value: string
  onChange: (text: string) => void
  children?: ReactNode
}

// TODO: render the symbol after the number when `symbol_first` is false (e.g. "100 zł").
// TODO: fall back to the currency code when `symbol` is empty.
function CurrencySymbol({ currency }: { currency: Currency }) {
  return <span className="text-muted-foreground">{currency.symbol}</span>
}

/** Labeled amount input with the currency symbol in front. */
export function MoneyField({ id, label, currency, value, onChange, children }: Props) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="flex h-9 items-center gap-2 rounded-md border px-3 focus-within:ring-2 focus-within:ring-ring">
        <CurrencySymbol currency={currency} />
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none"
        />
      </div>
      {children}
    </div>
  )
}
