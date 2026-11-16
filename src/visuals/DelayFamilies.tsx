'use client'

import { useState } from 'react'

// The classic delay families, and who eats each one. The teaching point is in
// the first row: the SAME storm is the owner's time at sea and the
// charterer's once the clock runs. Same event, different clause, different
// payer.
//
// Everything is ultimately priced against the laycan, so the panel shows
// whether this delay breaks it — a 2-day delay that still makes the can costs
// nothing contractually, a 6-hour one that misses it hands over an option.

type Family = {
  key: string
  name: string
  color: string
  days: number
  who: 'owner' | 'charterer' | 'depends'
  what: string
  nuance: string
}

const FAMILIES: Family[] = [
  {
    key: 'sea', name: 'Weather at sea', color: '#64748b', days: 2, who: 'owner',
    what: 'Ocean storms and routing detours on the way to the load port. The ship is not yet on laytime, so the time is the owner’s — it comes straight out of their TCE.',
    nuance: 'This is why owners pad their "open" dates, and why a charterer should discount an itinerary that shows zero slack.',
  },
  {
    key: 'port', name: 'Weather at the port', color: '#f59e0b', days: 1.5, who: 'charterer',
    what: 'Berth closed, swell over the bar, wind above the terminal’s limit — once the clock is running this usually burns laytime or demurrage.',
    nuance: 'The same storm as the row above, and a different payer. What changed is not the weather but whether the clock had started — which is the whole reason the NOR moment is fought over.',
  },
  {
    key: 'canal', name: 'Canals and passages', color: '#a78bfa', days: 1, who: 'owner',
    what: 'Suez and Panama impose convoy schedules, booking slots and toll regimes; the Turkish Straits queue in winter. Chokepoints add variance, not just days.',
    nuance: 'A missed Suez convoy is 24 hours. A missed Panama booking can be far worse. And a security rerouting — Red Sea to the Cape — rewrites the whole estimate: distance, bunkers AND the flat-rate assumptions underneath the freight.',
  },
  {
    key: 'prior', name: 'Prior-voyage knock-on', color: '#f43f5e', days: 2.5, who: 'owner',
    what: 'The previous discharge simply ran long. This is the single commonest cause of a missed laycan, and it has nothing to do with your cargo at all.',
    nuance: 'It is also the one a charterer can see coming: if the position list shows her still discharging, the "open" date is a hope, not a fact.',
  },
]

const LAYCAN_SLACK = 2.0 // days of slack before the cancelling date

export default function DelayFamilies() {
  const [sel, setSel] = useState('port')
  const [margin, setMargin] = useState(5)
  const f = FAMILIES.find(x => x.key === sel)!

  // Does this delay break the laycan, once a weather margin is allowed for?
  const cushion = LAYCAN_SLACK + (margin / 100) * 14 // 14-day passage
  const breaks = f.days > cushion
  const over = f.days - cushion

  const WHO = {
    owner: { label: 'Owner’s time', color: '#64748b' },
    charterer: { label: 'Charterer’s time — laytime or demurrage', color: '#f59e0b' },
    depends: { label: 'Depends on the exceptions clause', color: '#a78bfa' },
  }[f.who]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Same storm, different clause, different payer</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Between fixture and NOR there are four classic delay families. What decides who pays is rarely the event itself —
        it is <strong className="text-slate-200">whether the clock had started</strong> when it happened.
      </p>

      <div className="mb-3 space-y-1.5">
        {FAMILIES.map(x => (
          <button
            key={x.key} type="button" onClick={() => setSel(x.key)}
            aria-pressed={sel === x.key}
            className={`flex w-full flex-wrap items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all ${
              sel === x.key ? 'bg-white/[0.07]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
            }`}
            style={sel === x.key ? { borderColor: x.color + '99' } : undefined}
          >
            <span className="w-40 shrink-0 text-sm" style={{ color: sel === x.key ? x.color : '#cbd5e1' }}>{x.name}</span>
            <span className="flex-1">
              <span className="block h-2.5 rounded bg-white/[0.05]">
                <span className="block h-full rounded" style={{ width: `${(x.days / 3) * 100}%`, backgroundColor: x.color, opacity: 0.7 }} />
              </span>
            </span>
            <span className="w-14 shrink-0 text-right font-mono text-[11px] tabular-nums text-slate-300">{x.days} d</span>
            <span className={`w-24 shrink-0 rounded px-1.5 py-0.5 text-center font-mono text-[9px] uppercase ${
              x.who === 'owner' ? 'bg-white/[0.08] text-slate-300' : 'bg-amber-400/15 text-amber-300'
            }`}>
              {x.who === 'owner' ? 'owner' : 'charterer'}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border p-3.5" style={{ borderColor: f.color + '55', backgroundColor: f.color + '0d' }}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-mono text-sm font-bold" style={{ color: f.color }}>{f.name}</span>
            <span className="font-mono text-[10px]" style={{ color: WHO.color }}>{WHO.label}</span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{f.what}</p>
          <p className="mt-2 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-400">{f.nuance}</p>
        </div>

        <div className="space-y-2.5">
          <div className={`rounded-xl border p-3.5 ${breaks ? 'border-rose-500/50 bg-rose-500/[0.10]' : 'border-emerald-500/40 bg-emerald-500/[0.08]'}`}>
            <div className={`font-mono text-sm font-bold ${breaks ? 'text-rose-300' : 'text-emerald-300'}`}>
              {breaks ? `Misses the cancelling date by ${over.toFixed(1)} days` : 'Still makes the can'}
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
              {breaks
                ? 'Every delay is ultimately priced against the laycan, and this one crosses it. The charterer now holds the cancellation option — and whether they use it depends entirely on where the freight market has gone since the fixture.'
                : 'Contractually this costs nothing. A two-day weather delay that still makes the can is an operational annoyance; a six-hour delay that misses it hands over an option worth real money. The threshold matters more than the magnitude.'}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="mb-1 flex justify-between font-mono text-xs">
              <span className="text-cyan-300">Weather margin in the estimate</span>
              <span className="font-bold tabular-nums text-white">{margin}%</span>
            </div>
            <input type="range" min={0} max={15} step={1} value={margin}
              onChange={e => setMargin(parseInt(e.target.value, 10))}
              aria-label="Weather margin percentage"
              className="h-1.5 w-full cursor-pointer accent-brand-cyan" />
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              Five percent is the classic figure, and on a 14-day passage it buys{' '}
              <strong className="text-slate-200">{((margin / 100) * 14).toFixed(1)} days</strong> of cushion on top of the{' '}
              {LAYCAN_SLACK} days of laycan slack. Pad the passage, book canal slots early, and treat every chokepoint on the
              itinerary as a <strong className="text-slate-200">risk line in the voyage estimate</strong> — not a footnote.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
