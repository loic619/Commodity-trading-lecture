import { robustaContracts, cashAndCarry, fillSummary, MARKET_FILL, STRIP_PRE, STRIP_POST, CC } from '@/lib/robustaCalendar'

test('robustaContracts resolves the front/second/third month for any date', () => {
  // Mid-November → Nov (X) is the front, then Jan (F), Mar (H)
  const nov = robustaContracts(new Date(2025, 10, 18), 3)
  expect(nov.map(c => c.label)).toEqual(['Nov 25 (X)', 'Jan 26 (F)', 'Mar 26 (H)'])

  // Early February → the Jan contract is gone, front is Mar (H), then May (K)
  const feb = robustaContracts(new Date(2025, 1, 5), 2)
  expect(feb.map(c => c.label)).toEqual(['Mar 25 (H)', 'May 25 (K)'])

  // December → no Robusta month left this year, front rolls to Jan next year
  const dec = robustaContracts(new Date(2025, 11, 20), 1)
  expect(dec[0].label).toBe('Jan 26 (F)')
})

test('cashAndCarry: the rescue nets +$20/t (+$2,000) versus −$2,000 for cutting', () => {
  const cc = cashAndCarry()
  expect(cc.storage).toBe(10)        // $5/t/mo × 2
  expect(cc.financing).toBe(40)      // 8% p.a. × 2/12 × $3,000
  expect(cc.netPerT).toBe(20)        // spread 90 − drop 20 − storage 10 − financing 40
  expect(cc.netTotal).toBe(2000)     // on 100 t
  expect(cc.cutLossTotal).toBe(-2000)
})

test('a 10-lot market order walks the ask ladder, averaging the cash-and-carry entry', () => {
  const f = fillSummary()
  expect(MARKET_FILL.reduce((s, x) => s + x.lots, 0)).toBe(10) // 10 lots total
  expect(f.avg).toBe(3000)          // volume-weighted average = the CC entry
  expect(f.avg).toBe(CC.entry)
  expect(f.best).toBe(2997)         // best offer taken first
  expect(f.slip).toBe(3)            // avg is $3 above the best offer
})

test('the strip re-prices on the open: front −20, second +70 → the 90 spread', () => {
  expect(STRIP_POST[0]).toBe(STRIP_PRE[0] - 20)   // 3,000 → 2,980
  expect(STRIP_POST[1]).toBe(STRIP_PRE[1] + 70)   // 3,000 → 3,070
  expect(STRIP_POST[1] - STRIP_POST[0]).toBe(CC.spread) // spread = 90
})
