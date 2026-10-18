import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { CheckIcon, ChevronsUpDownIcon, SearchIcon } from 'lucide-react'
import type { Currency } from '@/api'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const chipClass = 'rounded border px-1.5 text-xs font-medium'

type Props = {
  id: string
  label: string
  currencies: Currency[]
  value: Currency
  onChange: (currency: Currency) => void
}

// TODO: with an empty query, show a short "Popular" group
function filterCurrencies(currencies: Currency[], query: string): Currency[] {
  const q = query.trim().toLowerCase()
  return currencies.filter((c) => c.short_code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
}

/**
 * Searchable select
 */
export function CurrencySelect({ id, label, currencies, value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const results = filterCurrencies(currencies, query)
  const listId = `${id}-list`
  const optionId = (code: string) => `${id}-option-${code}`
  const listRef = useRef<HTMLUListElement | null>(null)

  // Keep the highlighted option visible.
  // Only when one of those changes, not on every render (that would pull a scrolled list back).
  useEffect(() => {
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open, query])

  function handleOpenChange(next: boolean) {
    setOpen(next)
    // start each search from the full list with the current currency highlighted
    setQuery('')
    setActiveIndex(Math.max(0, currencies.indexOf(value)))
  }

  function select(currency: Currency) {
    onChange(currency)
    handleOpenChange(false)
  }

  // Enhance accessibility with key navigation
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[activeIndex]) {
      select(results[activeIndex])
    }
    // Esc is handled by the Popover.
  }

  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex h-9 items-center justify-between gap-2 rounded-md border px-3 text-sm"
          >
            <span className="flex items-center gap-2 truncate">
              <span className={chipClass}>{value.short_code}</span>
              {value.name}
            </span>
            <ChevronsUpDownIcon className="size-4 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-(--radix-popover-trigger-width) min-w-72 gap-0 p-0">
          <div className="flex items-center gap-2 border-b px-2">
            <SearchIcon className="size-4 opacity-50" />
            <input
              role="combobox"
              aria-label="Search currency"
              aria-expanded
              aria-controls={listId}
              aria-activedescendant={results[activeIndex] && optionId(results[activeIndex].short_code)}
              placeholder="Search currency"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setActiveIndex(0) // highlight the first match
              }}
              onKeyDown={handleKeyDown}
              className="h-9 w-full bg-transparent outline-none"
            />
          </div>

          <p className="px-3 pt-2 text-xs text-muted-foreground">
            {results.length === 0 ? 'No currencies found' : `${results.length} ${results.length === 1 ? 'result' : 'results'}`}
          </p>

          <ul ref={listRef} id={listId} role="listbox" aria-label={label} className="max-h-72 overflow-y-auto p-1">
            {results.map((currency, i) => (
              <li
                key={currency.short_code}
                id={optionId(currency.short_code)}
                role="option"
                aria-selected={i === activeIndex}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => select(currency)}
                className={`flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 ${i === activeIndex ? 'bg-muted' : ''}`}
              >
                <span className={chipClass}>{currency.short_code}</span>
                <span className="flex-1 truncate">{currency.name}</span>
                <span className="text-muted-foreground">{currency.symbol}</span>
                <CheckIcon className={`size-4 ${currency === value ? '' : 'invisible'}`} />
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  )
}
