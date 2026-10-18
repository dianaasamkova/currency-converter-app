import type {Currency} from "@/api.ts";
import {useConverterInputs} from "@/hooks/useConverterInputs.ts";
import {applyRate, useRate} from "@/hooks/useRate.ts";
import {formatAmountInput, formatRateDate, formatTime} from "@/lib/format.ts";
import {ConversionResult} from "@/components/ConversionResult.tsx";
import {MoneyField} from "@/components/MoneyField.tsx";
import {CurrencySelect} from "@/components/CurrencySelect.tsx";
import {ArrowDownUpIcon} from "lucide-react";
import {ErrorMessage} from "@/components/ErrorMessage.tsx";

export function CurrencyConverter({currencies}: { currencies: Currency[] }) {
    const {amountText, amount, side, from, to, changeAmount, selectFrom, selectTo, swap} = useConverterInputs(currencies)
    const {rate, error, retry} = useRate(from, to)

    const isCurrent = rate?.from === from && rate.to === to
    const isLoading = !isCurrent && !error
    // If the amount is empty, the header shows the rate for 1 unit: "1 US Dollar equals 3.88 Polish Zloty".
    const conversion = rate && applyRate(rate, amount || 1, side)

    // Don't show a value that was calculated with the rate of another pair.
    const convertedText = conversion && isCurrent && amount > 0
        ? side === "from" ? formatAmountInput(conversion.value, to) : formatAmountInput(conversion.amount, from)
        : ""

    return (
        <section className="grid w-full max-w-2xl gap-6 rounded-xl border p-6">
            <ConversionResult conversion={conversion} isLoading={isLoading}/>

            <div className="grid gap-4 sm:grid-cols-2">
                <MoneyField id="from-amount" label={`Amount in ${from.short_code}`} currency={from}
                            value={side === "from" ? amountText : convertedText}
                            onChange={(text) => changeAmount("from", text)}/>
                <CurrencySelect id="from" label="From" currencies={currencies} value={from} onChange={selectFrom}/>

                <div className="flex justify-end sm:col-span-2">
                    <button type="button" onClick={swap} aria-label="Swap currencies"
                            className="rounded-full border p-2">
                        <ArrowDownUpIcon className="size-4"/>
                    </button>
                </div>

                <MoneyField id="to-amount" label={`Amount in ${to.short_code}`} currency={to}
                            value={side === "to" ? amountText : convertedText}
                            onChange={(text) => changeAmount("to", text)}>
                    {error && <ErrorMessage message={`Could not load the rate: ${error}`} onRetry={retry}/>}
                </MoneyField>
                <CurrencySelect id="to" label="To" currencies={currencies} value={to} onChange={selectTo}/>
            </div>

            {rate && (
                <p className="text-xs text-muted-foreground">
                    Rate for {formatRateDate(rate.date)}, checked at {formatTime(rate.timestamp)}
                </p>
            )}
        </section>
    )
}
