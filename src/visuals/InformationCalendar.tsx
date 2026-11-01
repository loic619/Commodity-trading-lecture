'use client'

import { useState } from 'react'

// Knowing the sources is half of it; knowing WHEN they land is the other half,
// and that half is what a prose list cannot show. The week has a rhythm, and
// Wednesday 15:30 London is the beat.

type Src = {
  name: string
  kind: 'news' | 'pra' | 'fundamentals' | 'stocks' | 'shipping' | 'research'
  what: string
}

const KINDS: Record<Src['kind'], { label: string; color: string }> = {
  news: { label: 'News', color: '#94a3b8' },
  pra: { label: 'Price reporting', color: '#f59e0b' },
  fundamentals: { label: 'Fundamentals', color: '#22d3ee' },
  stocks: { label: 'Stocks', color: '#f43f5e' },
  shipping: { label: 'Shipping', color: '#34d399' },
  research: { label: 'Research', color: '#a78bfa' },
}

const SOURCES: Src[] = [
  { name: 'Reuters, Bloomberg', kind: 'news', what: 'Headlines move the price before the data does — and often more than the data does.' },
  { name: 'Platts, Argus', kind: 'pra', what: 'Price Reporting Agencies do not report prices so much as ASSESS them. Their assessments are what physical contracts settle against, which makes a PRA methodology change a market event in its own right.' },
  { name: 'ICIS/LOR, OPIS', kind: 'pra', what: 'The other assessors — stronger in petrochemicals and US products respectively.' },
  { name: 'IEA monthly', kind: 'fundamentals', what: 'The consumer countries’ view of the balance. Mid-month, and its demand revisions move the call on OPEC.' },
  { name: 'EIA / DOE monthly', kind: 'fundamentals', what: 'The US government’s Short-Term Energy Outlook — forecasts, not just history.' },
  { name: 'OPEC MOMR', kind: 'fundamentals', what: 'The producers’ own monthly view. Read it against the IEA: where the two disagree on demand is where the argument about next year sits.' },
  { name: 'DOE / EIA weekly', kind: 'stocks', what: 'The classic market-mover: US inventories, Wednesday 15:30 London. Crude, gasoline, distillate, runs and imports all in one release.' },
  { name: 'API weekly', kind: 'stocks', what: 'The industry body’s own count, published Tuesday evening — an unofficial preview that often sets the overnight tone before the official number lands.' },
  { name: 'Kpler, Vortexa, ClipperData', kind: 'shipping', what: 'Satellite and AIS tracking of cargoes afloat. This is how the market now sees flows in near-real time instead of waiting for customs data.' },
  { name: 'Lloyd’s List', kind: 'shipping', what: 'Vessel movements and casualties — the original shipping intelligence.' },
  { name: 'OIES, Wood Mackenzie, Energy Aspects', kind: 'research', what: 'Deep analysis on a slower clock. Useful for the structural view, useless for Wednesday afternoon.' },
]

type Slot = { day: string; time: string; what: string; big?: boolean; note: string }

const WEEK: Slot[] = [
  { day: 'Mon', time: '—', what: 'Positioning', note: 'Digest the weekend: OPEC+ comments, geopolitics, and the CFTC Commitment of Traders released late Friday showing how the funds are positioned.' },
  { day: 'Tue', time: '21:30', what: 'API stocks', note: 'The American Petroleum Institute’s own inventory estimate, after the US close. Not official, frequently wrong, and still enough to move the overnight market.' },
  { day: 'Wed', time: '15:30', what: 'DOE / EIA stocks', big: true, note: 'The week’s event. US crude, gasoline and distillate inventories, plus refinery runs and imports — published to the minute, and the single most reliably market-moving scheduled release in oil.' },
  { day: 'Thu', time: '—', what: 'Digest & products', note: 'The stock number gets re-read through the product cracks. European gasoil and ARA stock data lands around here too.' },
  { day: 'Fri', time: '18:00', what: 'Baker Hughes rigs', note: 'The US rig count — a slow but honest read on where shale supply is heading six to nine months out. CFTC positioning follows at 20:30.' },
]

export default function InformationCalendar() {
  const [slot, setSlot] = useState(2)
  const [src, setSrc] = useState<Src | null>(null)
  const s = WEEK[slot]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">The week has a rhythm — and Wednesday is the beat</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        Knowing the sources is half the job. Knowing <strong className="text-slate-200">when they land</strong> is the other half:
        traders structure the week around scheduled releases, because both the data and the headlines around it move the price.
      </p>

      {/* the week */}
      <div className="grid grid-cols-5 gap-1.5">
        {WEEK.map((w, i) => (
          <button
            key={w.day} type="button" onClick={() => setSlot(i)}
            aria-pressed={slot === i}
            className={`rounded-lg border px-2 py-2 text-left transition-all ${
              slot === i
                ? w.big ? 'border-rose-400/70 bg-rose-400/[0.12]' : 'border-cyan-400/60 bg-cyan-400/[0.10]'
                : w.big ? 'border-rose-400/30 bg-rose-400/[0.05] hover:bg-rose-400/[0.09]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
            }`}
          >
            <div className={`font-mono text-[10px] uppercase tracking-wide ${w.big ? 'text-rose-300' : 'text-slate-500'}`}>{w.day}</div>
            <div className="text-[11px] font-medium leading-tight text-slate-100">{w.what}</div>
            <div className="font-mono text-[10px] text-slate-500">{w.time}</div>
          </button>
        ))}
      </div>

      <div className={`mt-2.5 rounded-xl border p-3.5 ${s.big ? 'border-rose-500/50 bg-rose-500/[0.10]' : 'border-white/10 bg-white/[0.03]'}`}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className={`font-mono text-sm font-bold ${s.big ? 'text-rose-300' : 'text-cyan-300'}`}>
            {s.day} · {s.what}
          </span>
          {s.time !== '—' && <span className="font-mono text-[11px] text-slate-400">{s.time} London</span>}
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{s.note}</p>
      </div>

      {/* the sources */}
      <div className="mt-4 border-t border-white/10 pt-3.5">
        <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">Where the numbers come from</div>
        <div className="flex flex-wrap gap-1.5">
          {SOURCES.map(x => (
            <button
              key={x.name} type="button" onClick={() => setSrc(src?.name === x.name ? null : x)}
              aria-pressed={src?.name === x.name}
              className={`rounded border px-2 py-1 text-[11px] transition-all ${
                src?.name === x.name ? 'bg-white/[0.10] text-white' : 'border-white/10 text-slate-300 hover:bg-white/[0.05]'
              }`}
              style={src?.name === x.name ? { borderColor: KINDS[x.kind].color + '99' } : undefined}
            >
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle" style={{ backgroundColor: KINDS[x.kind].color }} />
              {x.name}
            </button>
          ))}
        </div>
        <div className="mt-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs leading-relaxed">
          {src ? (
            <>
              <span className="rounded px-1.5 py-0.5 font-mono text-[10px] uppercase" style={{ backgroundColor: KINDS[src.kind].color + '22', color: KINDS[src.kind].color }}>
                {KINDS[src.kind].label}
              </span>
              <span className="ml-2 text-slate-300">{src.what}</span>
            </>
          ) : (
            <span className="text-slate-500">
              Click a source. Note the distinction that matters most: the Price Reporting Agencies do not <em>report</em> prices,
              they <em>assess</em> them — and those assessments are what your physical contracts settle against.
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
