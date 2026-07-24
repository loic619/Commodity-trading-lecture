// Date-adaptive London Robusta contract calendar, so the "day in the life"
// inbox always references the RIGHT months relative to whenever the class is
// run. Robusta (ICE) lists Jan, Mar, May, Jul, Sep, Nov — month codes
// F, H, K, N, U, X. Pure & deterministic given `now` (tests pass a fixed date).

const R_MONTHS = [0, 2, 4, 6, 8, 10] // Jan, Mar, May, Jul, Sep, Nov (0-based)
const R_CODE: Record<number, string> = { 0: 'F', 2: 'H', 4: 'K', 6: 'N', 8: 'U', 10: 'X' }
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MON_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export type Rc = {
  midx: number      // 0-based month index of the contract
  year: number
  code: string      // exchange month code (F/H/K/N/U/X)
  short: string     // "Nov 25"
  label: string     // "Nov 25 (X)"
  month: string     // "November"
}

function makeRc(year: number, midx: number): Rc {
  const yy = String(year).slice(2)
  return {
    midx, year, code: R_CODE[midx],
    short: `${MON[midx]} ${yy}`,
    label: `${MON[midx]} ${yy} (${R_CODE[midx]})`,
    month: MON_FULL[midx],
  }
}

/** The `count` nearest Robusta contracts at/after `now` (index 0 = front). */
export function robustaContracts(now: Date, count: number): Rc[] {
  const cy = now.getFullYear(), cm = now.getMonth()
  const out: Rc[] = []
  for (let yr = cy; yr <= cy + 3 && out.length < count; yr++) {
    for (const mi of R_MONTHS) {
      if (yr === cy && mi < cm) continue // front = this month's contract if it is a Robusta month
      out.push(makeRc(yr, mi))
      if (out.length >= count) break
    }
  }
  return out
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d.getTime())
  r.setDate(r.getDate() + n)
  return r
}
export function addMonths(d: Date, n: number): Date {
  const r = new Date(d.getTime())
  r.setMonth(r.getMonth() + n)
  return r
}
/** "Tuesday 18 November 2025" */
export function longDate(d: Date): string {
  return `${DOW[d.getDay()]} ${d.getDate()} ${MON_FULL[d.getMonth()]} ${d.getFullYear()}`
}
/** "18 Nov" */
export function shortDate(d: Date): string {
  return `${d.getDate()} ${MON[d.getMonth()]}`
}

// ── The cash-and-carry economics of the 10-lot rescue (all $/t unless noted) ──
// We are long 10 lots of the FRONT at 3,000. Intraday the nearby fell 20 and
// the deferred jumped 70, blowing the front→second spread out to 90. Taking
// delivery of the long and selling the second contract locks the carry:
//   net = spread(90) − our nearby loss(20) − storage(2×5) − financing(8% · 2mo)
export const CC = {
  entry: 3000,          // where the 10 lots were bought (front, at market)
  nearbyNow: 2980,      // front after the −20 move
  drop: 20,             // $/t lost on the long nearby
  forwardNow: 3070,     // second contract after the +70 move → spread 90
  spread: 90,           // forward − nearby, now
  storagePerMonth: 5,   // $/t/month (the warehouse tariff)
  months: 2,            // storage/financing period to the second contract
  financeRate: 0.08,    // 8% p.a. on the physical value
  lots: 10,
  lotT: 10,
}

export function cashAndCarry() {
  const storage = CC.storagePerMonth * CC.months                                  // 10
  const financing = Math.round(CC.entry * CC.financeRate * CC.months / 12)        // 40
  const netPerT = CC.spread - CC.drop - storage - financing                       // +20
  const tonnes = CC.lots * CC.lotT                                                // 100
  return {
    storage, financing, netPerT, tonnes,
    netTotal: netPerT * tonnes,          // +$2,000
    cutLossTotal: -CC.drop * tonnes,     // −$2,000 (crystallise the drop)
  }
}
