import type { Conversion } from '@/hooks/useRate'
import { formatMoney } from '@/lib/format'

// Non-breaking space keeps the line height, so the layout doesn't jump when the first result comes.
const EMPTY = '\u00A0'

/** Shows the conversion with the last loaded rate. It's dimmed while a new rate is loading. */
export function ConversionResult({ conversion, isLoading }: { conversion: Conversion | null; isLoading: boolean }) {
  return (
    <div aria-live="polite" aria-busy={isLoading} className={`transition-opacity ${isLoading ? 'opacity-50' : ''}`}>
      <p className="text-sm text-muted-foreground">
        {conversion ? `${formatMoney(conversion.amount, conversion.from)} ${conversion.from.name} equals` : EMPTY}
      </p>
      <p className="text-3xl font-semibold wrap-anywhere">
        {conversion ? `${formatMoney(conversion.value, conversion.to)} ${conversion.to.name}` : EMPTY}
      </p>
    </div>
  )
}
