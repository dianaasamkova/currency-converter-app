import { CurrencyConverterContainer } from '@/components/CurrencyConverterContainer.tsx'

export default function App() {
  return (
    <main className="flex min-h-svh items-start justify-center p-4 sm:p-10">
      <h1 className="sr-only">Currency converter</h1>
      <CurrencyConverterContainer />
    </main>
  )
}
