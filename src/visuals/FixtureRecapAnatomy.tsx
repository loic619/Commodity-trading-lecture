'use client'

import { useState } from 'react'

// The fixture recap as a live document: click any line to see what it means
// and where it bites. The same ten lines the lecture dissects, made clickable.
type Line = { text: string; color: string; means: string; bites: string }

const LINES: Line[] = [
  {
    text: 'Vessel: M/T Meridian, 105,000 dwt, 2019, double hull, last 3 cgo crude', color: '#3b82f6',
    means: 'The ship as described — her description is a contractual warranty, not marketing.',
    bites: 'If she is not as described (age, last cargoes, approvals), the charterer may reject her — after vetting relied on exactly these lines.',
  },
  {
    text: 'Cargo: 80,000 t ± 5% MOLCO crude oil', color: '#f59e0b',
    means: 'MOLCO — more or less CHARTERER’s option: the charterer picks the final quantity inside the tolerance.',
    bites: 'Nominate below the minimum and the owner claims DEADFREIGHT: freight on the tonnes not shipped. MOLOO would give the option to the owner instead.',
  },
  {
    text: 'Load: 1 SB Bonny · Discharge: 1–2 SB UKC-Med, orders', color: '#34d399',
    means: '"SB" = safe berth — a WARRANTY by the charterer; "orders" keeps the destination open while the cargo trades.',
    bites: 'The second discharge berth is allowed — but WHO pays the shifting between them lives in a different clause. And "safe berth" carries real liability if the nominated berth damages the ship.',
  },
  {
    text: 'Laycan: 12–14 March', color: '#22d3ee',
    means: 'The 3-day window: no laytime before the layday; miss the cancelling date and the charterer holds the cancellation option.',
    bites: 'The option is worth most when the market FELL after fixing — cancel and re-fix cheaper. Watch the itinerary from day one.',
  },
  {
    text: 'Freight: WS 120, Worldscale 2025, per current flat rate', color: '#f43f5e',
    means: 'The price: flat rate × 1.20 × B/L tonnes. Naming the SCHEDULE YEAR matters — flat rates change every 1 January.',
    bites: 'A December fixture discharging in January needs the year pinned, or the freight invoice becomes a dispute all by itself.',
  },
  {
    text: 'Laytime: 72 hrs SHINC total · Demurrage: $45,000 pdpr', color: '#8b5cf6',
    means: 'One shared clock for BOTH ends, Sundays/holidays INCLUDED; beyond it, $45k per day pro rata — by the minute.',
    bites: 'SHINC vs SHEX is worth whole weekends. And the rate here must match your sale contracts — a $5k/day gap leaks on every voyage (the back-to-back trap).',
  },
  {
    text: 'CP form: Asbatankvoy with owners’/charterers’ standard amendments', color: '#3b82f6',
    means: 'The skeleton contract — 1977 print — plus the rider clauses that OVERRIDE it.',
    bites: '"Standard amendments" nobody actually read is how disputes are born: the real risk allocation lives in the riders, and the recap overrides both.',
  },
  {
    text: 'Commission: 2.5% total (1.25% XYZ address + 1.25% broker)', color: '#f59e0b',
    means: 'Paid by the owner off gross freight: the broker’s earnings plus the charterer’s own "address" commission.',
    bites: 'The owner prices commissions INTO the WS level — a charterer waiving address commission should get it back in the rate.',
  },
  {
    text: 'Subs: charterer’s management approval, latest 17:00 tomorrow', color: '#22d3ee',
    means: 'The fixture is conditional until every subject LIFTS — then it is fully binding with no escape.',
    bites: 'Subjects are for their stated purpose — not a free option to keep shopping the market. "Failing subs" on a better ship is reputation suicide in a market this small.',
  },
]

export default function FixtureRecapAnatomy() {
  const [sel, setSel] = useState(1)
  const l = LINES[sel]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-3 text-brand-cyan">The recap, dissected — click any line</div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 font-mono text-[11px] leading-relaxed">
        <div className="mb-1.5 text-slate-500">M/T MERIDIAN / XYZ TRADING — CP dated 8 March</div>
        {LINES.map((line, i) => (
          <button key={i} type="button" onClick={() => setSel(i)}
            className={`block w-full rounded-md px-2 py-1 text-left transition-all ${
              i === sel ? 'bg-white/[0.07] text-white' : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
            }`}>
            <span className="mr-1.5" style={{ color: line.color }}>▸</span>{line.text}
          </button>
        ))}
      </div>

      <div className="mt-2 rounded-xl border p-3" style={{ borderColor: l.color + '55', backgroundColor: l.color + '0d' }}>
        <p className="text-xs leading-relaxed text-slate-300"><span className="font-bold" style={{ color: l.color }}>What it means: </span>{l.means}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-400"><span className="font-bold text-slate-300">Where it bites: </span>{l.bites}</p>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        Ten lines, several million dollars. Every line maps to money — and the moment to challenge one is BEFORE the
        subjects lift, not when the claim arrives three months later.
      </p>
    </div>
  )
}
