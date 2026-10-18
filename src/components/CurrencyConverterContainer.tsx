import {LoaderCircleIcon} from 'lucide-react'
import {ErrorMessage} from '@/components/ErrorMessage'
import {useCurrencies} from '@/hooks/useCurrencies'
import {CurrencyConverter} from "@/components/CurrencyConverter.tsx";

export function CurrencyConverterContainer() {
  const { currencies, error, retry } = useCurrencies()

  if (error) return <ErrorMessage message={`Failed to load currencies: ${error}`} onRetry={retry} />
  // TODO: Add is loading state to useCurrencies
  if (!currencies) return <LoaderCircleIcon className="animate-spin" aria-label="Loading currencies" />
  return <CurrencyConverter currencies={currencies} />
}

