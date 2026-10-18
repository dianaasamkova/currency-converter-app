import { useEffect, useState } from 'react'
import { convert, type ConvertResult, type Currency } from '@/api'
import type { Side } from '@/hooks/useConverterInputs'

/** Rate for 1 `from` in `to`. It is stored with its pair, so it isn't used for a different pair. */
export type Rate = ConvertResult & { from: Currency; to: Currency }

/** `amount` in `from` is equal to `value` in `to`. */
export type Conversion = { amount: number; value: number; from: Currency; to: Currency }

/** Converts on the client, so typing in any field doesn't send requests. */
export function applyRate(rate: Rate, amount: number, side: Side): Conversion {
  const { value, from, to } = rate
  return side === 'from' ? { amount, value: amount * value, from, to } : { amount: amount / value, value: amount, from, to }
}

/**
 * Loads the rate when the currencies change. A new request cancels the old one,
 * so an old slow response can't replace a newer one.
 */
export function useRate(from: Currency, to: Currency) {
  const [rate, setRate] = useState<Rate | null>(null)
  const [attempt, setAttempt] = useState(0) // retry() increases it to run the effect again
  // The error is saved with its request. After new currencies or a retry, the old error is not shown anymore.
  const requestKey = `${from.short_code}>${to.short_code}#${attempt}`
  const [failure, setFailure] = useState<{ requestKey: string; message: string } | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    convert(from.short_code, to.short_code, 1, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setRate({ ...result, from, to })
      })
      .catch((err: Error) => {
        if (!controller.signal.aborted) setFailure({ requestKey, message: err.message })
      })
    return () => controller.abort()
  }, [from, to, requestKey])

  function retry() {
    setAttempt((n) => n + 1)
  }

  const error = failure?.requestKey === requestKey ? failure.message : null
  return { rate, error, retry }
}
