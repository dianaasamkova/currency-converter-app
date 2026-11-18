import { describe, expect, it } from 'vitest'
import type { Currency } from '@/api'
import { applyRate, type Rate } from '@/hooks/useRate'

const currency = (short_code: string): Currency => ({ short_code, name: short_code, symbol: '', symbol_first: true, precision: 2 })
const USD = currency('USD')
const PLN = currency('PLN')
const rate: Rate = { from: USD, to: PLN, value: 4, date: '2026-10-16', timestamp: 0 }

describe('applyRate', () => {
  it('converts forward when the amount was typed in "from"', () => {
    expect(applyRate(rate, 25, 'from')).toEqual({ amount: 25, value: 100, from: USD, to: PLN })
  })

  it('converts backward when the amount was typed in "to"', () => {
    expect(applyRate(rate, 100, 'to')).toEqual({ amount: 25, value: 100, from: USD, to: PLN })
  })

  it('keeps the pair the rate was loaded for', () => {
    const { from, to } = applyRate(rate, 1, 'from')
    expect([from.short_code, to.short_code]).toEqual(['USD', 'PLN'])
  })
})
