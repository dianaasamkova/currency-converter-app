import { describe, expect, it } from 'vitest'
import type { Currency } from '@/api'
import { formatAmountInput, formatMoney, formatRateDate } from '@/lib/format'

const currency = (short_code: string, precision: number): Currency => ({
  short_code,
  name: short_code,
  symbol: '',
  symbol_first: true,
  precision,
})
const USD = currency('USD', 2)
const JPY = currency('JPY', 0)

describe('formatMoney', () => {
  it('groups thousands and rounds to the currency precision', () => {
    expect(formatMoney(1234567.891, USD)).toBe('1,234,567.89')
    expect(formatMoney(1234.5, JPY)).toBe('1,235')
  })

  it('keeps whole numbers short', () => {
    expect(formatMoney(100, USD)).toBe('100')
  })
})

describe('formatAmountInput', () => {
  // The input accepts "," as a decimal separator, so output must not contain grouping commas.
  it('never adds thousands separators', () => {
    expect(formatAmountInput(1234567.891, USD)).toBe('1234567.89')
  })
})

describe('formatRateDate', () => {
  // A plain day must not shift to the previous day in time zones west of UTC.
  it('formats the API day as-is', () => {
    expect(formatRateDate('2026-10-16')).toBe('Oct 16, 2026')
  })
})
