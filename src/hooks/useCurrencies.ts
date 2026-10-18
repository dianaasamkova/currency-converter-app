import { useEffect, useState } from 'react'
import { fetchCurrencies, type Currency } from '@/api'

// Browser knows currency full names
const displayNames = new Intl.DisplayNames('en', { type: 'currency', fallback: 'none' })

export function useCurrencies() {
  const [currencies, setCurrencies] = useState<Currency[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0) // used by retry() to run the effect again

  useEffect(() => {
    // used to abort request if components unmounts to prevent unnecessary traffic
    const controller = new AbortController()

    fetchCurrencies(controller.signal)
      .then((list) => {
        // TODO: enhance error handling (covering the case for each error status because empty list might be a valid result)
        if (list.length === 0) {
          throw new Error('No currencies available')
        }

        const named = list.map((c) => ({ ...c, name: displayNames.of(c.short_code) ?? c.name }))

        setCurrencies(named.toSorted((a, b) => a.name.localeCompare(b.name)))
      })
      .catch((err: Error) => {
        if (!controller.signal.aborted) setError(err.message)
      })

    return () => controller.abort()
  }, [attempt])

  function retry() {
    setError(null)
    setAttempt((n) => n + 1)
  }

  return { currencies, error, retry }
}
