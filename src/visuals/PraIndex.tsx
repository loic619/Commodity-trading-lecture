'use client'

import { useState } from 'react'

// What a Price Reporting Agency index actually IS, because "the floating leg
// settles against an index" hides the fact that the index is a human
// judgement made from a window of deals.
//
// The point students should leave with: your swap settles against somebody's
// assessment, so the assessment METHODOLOGY is a term of your contract even
// though it appears nowhere in it.

type Deal = { time: string; px: number; vol: number; kind: 'bid' | 'offer' | 'trade'; inWindow: boolean; note?: string }

const DEALS: Deal[] = [
  { time: '14:48', px: 629.25, vol: 2000, kind: 'trade', inWindow: false, note: 'before the window — not assessable' },
  { time: '16:02', px: 630.50, vol: 5000, kind: 'trade', inWindow: true },
  { time: '16:11', px: 631.00, vol: 1000, kind: 'bid', inWindow: true, note: 'a bid, not a trade — it bounds the assessment rather than setting it' },
  { time: '16:18', px: 632.25, vol: 5000, kind: 'trade', inWindow: true },
  { time: '16:24', px: 628.00, vol: 500, kind: 'trade', inWindow: true, note: 'a small, off-market clip — assessors weight it lightly or exclude it' },
  { time: '16:27', px: 632.00, vol: 10000, kind: 'trade', inWindow: true },
  { time: '16:29', px: 633.00, vol: 3000, kind: 'offer', inWindow: true },
  { time: '17:05', px: 634.50, vol: 4000, kind: 'trade', inWindow: false, note: 'after the close — tomorrow’s assessment, not today’s' },
]

export default function PraIndex() {
  const [sel, setSel] = useState(3)
  const [excludeSmall, setExcludeSmall] = useState(true)

  const assessable = DEALS.filter(d =>
    d.inWindow && d.kind === 'trade' && (!excludeSmall || d.vol >= 1000))
  const vwap = assessable.reduce((s, d) => s + d.px * d.vol, 0) / assessable.reduce((s, d) => s + d.vol, 0)
  const d = DEALS[sel]

  const lo = 626, hi = 636
  const pos = (p: number) => ((p - lo) / (hi - lo)) * 100

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">The floating leg settles against somebody&apos;s judgement</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        An index is not a number that exists in nature. It is a{' '}
        <strong className="text-slate-200">report of clearly assessable trades</strong> in a defined window, published by a Price
        Reporting Agency — so the methodology is a term of your swap even though it appears nowhere in the contract.
      </p>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
            The day&apos;s activity — FOB Barges 3.5% fuel oil
          </span>
          <span className="font-mono text-[10px] text-slate-500">assessment window 16:00–16:30</span>
        </div>

        <div className="space-y-1">
          {DEALS.map((x, i) => (
            <button
              key={i} type="button" onClick={() => setSel(i)}
              aria-pressed={sel === i}
              className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left transition-all ${
                sel === i ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'
              } ${x.inWindow ? '' : 'opacity-40'}`}
            >
              <span className="w-11 shrink-0 font-mono text-[11px] text-slate-500">{x.time}</span>
              <span className={`w-12 shrink-0 rounded px-1 py-0.5 text-center font-mono text-[9px] uppercase ${
                x.kind === 'trade' ? 'bg-cyan-400/20 text-cyan-200'
                  : x.kind === 'bid' ? 'bg-emerald-400/15 text-emerald-300' : 'bg-rose-400/15 text-rose-300'
              }`}>
                {x.kind}
              </span>
              <span className="relative h-4 flex-1 rounded bg-white/[0.04]">
                <span
                  className="absolute top-0 h-4 w-1 rounded"
                  style={{
                    left: `${pos(x.px)}%`,
                    backgroundColor: x.kind === 'trade' ? '#22d3ee' : x.kind === 'bid' ? '#34d399' : '#f43f5e',
                    opacity: x.inWindow ? 0.95 : 0.4,
                  }}
                />
              </span>
              <span className="w-20 shrink-0 text-right font-mono text-[11px] tabular-nums text-slate-200">{x.px.toFixed(2)}</span>
              <span className="w-20 shrink-0 text-right font-mono text-[10px] tabular-nums text-slate-500">
                {x.vol.toLocaleString('en-US')} MT
              </span>
            </button>
          ))}
        </div>

        {/* the assessment */}
        <div className="relative mt-2 h-5 rounded bg-white/[0.03]">
          <span className="absolute top-0 h-5 w-0.5 bg-amber-300" style={{ left: `${pos(vwap)}%` }} />
          <span className="absolute -top-0.5 font-mono text-[10px] font-bold text-amber-300"
            style={{ left: `calc(${pos(vwap)}% + 6px)` }}>
            assessed {vwap.toFixed(2)}
          </span>
        </div>

        <label className="mt-3 flex cursor-pointer items-center gap-2 border-t border-white/10 pt-2.5">
          <input type="checkbox" checked={excludeSmall} onChange={e => setExcludeSmall(e.target.checked)}
            className="h-3.5 w-3.5 accent-brand-cyan" />
          <span className="text-xs text-slate-300">Exclude clips below 1,000 MT as unrepresentative</span>
        </label>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-cyan-400/40 bg-cyan-400/[0.08] p-3.5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-mono text-sm font-bold text-cyan-300">{d.time} · {d.kind} · {d.px.toFixed(2)}</span>
            <span className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase ${
              d.inWindow && d.kind === 'trade' ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/[0.06] text-slate-400'
            }`}>
              {d.inWindow && d.kind === 'trade' ? 'in the assessment' : 'not assessed'}
            </span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
            {d.note ?? 'A clean, in-window trade of representative size. This is what the assessor is looking for — and in a thin market there may be only one or two of them all day.'}
          </p>
        </div>

        <div className="rounded-xl border border-amber-500/40 bg-amber-500/[0.08] p-3.5">
          <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-amber-300">
            Why this matters to your swap
          </div>
          <p className="text-xs leading-relaxed text-slate-300">
            Tick and untick the exclusion box and watch the assessment move. Your swap settles against{' '}
            <strong className="text-white">that number</strong> — so the window, the minimum clip size and the treatment of bids and
            offers are all, in effect, terms of your contract. When a PRA changes its methodology, every swap settling against that
            index changes with it. That is why a methodology consultation is a market event.
          </p>
        </div>
      </div>
    </div>
  )
}
