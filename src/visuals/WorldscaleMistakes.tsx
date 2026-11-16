'use client'

import { useState } from 'react'

// The three classic Worldscale mistakes, each shown as the wrong calculation
// beside the right one — because the error is never in the arithmetic, it is
// in which number you reached for.
//
// Distinct from the Worldscale calculator earlier in this topic: that one
// teaches the mechanism, this one teaches the traps the pink pages set.

type Mistake = {
  key: string
  title: string
  setup: string
  wrong: { label: string; sum: string; value: number }
  right: { label: string; sum: string; value: number }
  why: string
}

const MISTAKES: Mistake[] = [
  {
    key: 'year',
    title: 'Comparing across the 1 January reset',
    setup: 'A colleague tells you the same route went at WS60 in December. The market is quoted WS60 today, in January. Same level, same money?',
    wrong: { label: 'Assume WS60 = WS60', sum: 'last done 7.60 × 0.60 × 80,000', value: 364_800 },
    right: { label: 'Use this year’s flat rate', sum: 'new flat 8.95 × 0.60 × 80,000', value: 429_600 },
    why: 'Flat rates are republished every 1 January to reflect the year’s bunker prices, port costs and canal tolls. A WS60 done in December and a WS60 done in January are different amounts of money — and in a year when bunkers rose, materially so. Any WS level quoted without its year is incomplete.',
  },
  {
    key: 'route',
    title: 'Applying a WS% to the wrong flat rate',
    setup: 'You have the flat rate for Bonny → Rotterdam in front of you. The cargo is actually going to Houston, also fixed at WS95.',
    wrong: { label: 'Use the flat you had open', sum: 'Rotterdam flat 7.60 × 0.95 × 80,000', value: 577_600 },
    right: { label: 'Use the flat for THIS load/discharge pair', sum: 'Houston flat 9.85 × 0.95 × 80,000', value: 748_600 },
    why: 'Every load port / discharge port pair has its own flat rate in the book — thousands of them. The WS percentage is a market level; the flat rate carries the voyage. Pairing a percentage with the wrong flat is the commonest way a freight number comes out confidently wrong.',
  },
  {
    key: 'order',
    title: 'Fixed and variable differentials, in the wrong order',
    setup: 'The fixture carries a $0.45/t variable differential (an extra load port) and a $0.30/t fixed differential (a port surcharge). Market WS95.',
    wrong: { label: 'Add both, then apply the percentage', sum: '(7.60 + 0.45 + 0.30) × 0.95 × 80,000', value: 634_600 },
    right: { label: 'Variable before, fixed after', sum: '((7.60 + 0.45) × 0.95 + 0.30) × 80,000', value: 635_800 },
    why: 'Variable differentials go INTO the flat rate and are therefore scaled by the WS percentage. Fixed differentials are added AFTER, at face value, unscaled. Note where the error vanishes: at exactly WS100, where scaling by 100% changes nothing. Below WS100 the wrong order UNDERSTATES the fixed differential; above it, it OVERSTATES it — and the gap opens in both directions the further the market is from 100.',
  },
]

export default function WorldscaleMistakes() {
  const [sel, setSel] = useState('year')
  const [ws, setWs] = useState(95)
  const m = MISTAKES.find(x => x.key === sel)!
  const gap = m.right.value - m.wrong.value

  // The order-of-operations error scales with the market; show it.
  const orderGapAt = (level: number) => {
    const w = (7.60 + 0.45 + 0.30) * (level / 100) * 80_000
    const r = ((7.60 + 0.45) * (level / 100) + 0.30) * 80_000
    return r - w
  }

  const usd = (n: number) => (n < 0 ? '−$' : '$') + Math.abs(Math.round(n)).toLocaleString('en-US')

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Three ways a confident freight number comes out wrong</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        The arithmetic is trivial — freight = flat × WS% × tonnes. Every mistake below is about{' '}
        <strong className="text-slate-200">which number you reached for</strong>, which is why they survive so well in practice:
        nothing about the result looks wrong.
      </p>

      <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Mistake">
        {MISTAKES.map((x, i) => (
          <button
            key={x.key} type="button" onClick={() => setSel(x.key)}
            aria-pressed={sel === x.key}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
              sel === x.key ? 'border-rose-400/60 bg-rose-400/15 text-rose-100' : 'border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            {i + 1}. {x.title}
          </button>
        ))}
      </div>

      <p className="mb-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm italic leading-relaxed text-slate-300">
        {m.setup}
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-rose-500/45 bg-rose-500/[0.10] p-3.5">
          <div className="font-mono text-xs font-bold uppercase tracking-wide text-rose-300">What people do</div>
          <div className="mt-1 text-xs text-slate-300">{m.wrong.label}</div>
          <div className="mt-1.5 font-mono text-[11px] text-slate-400">{m.wrong.sum}</div>
          <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-rose-300">{usd(m.wrong.value)}</div>
        </div>
        <div className="rounded-xl border border-emerald-500/45 bg-emerald-500/[0.10] p-3.5">
          <div className="font-mono text-xs font-bold uppercase tracking-wide text-emerald-300">What is right</div>
          <div className="mt-1 text-xs text-slate-300">{m.right.label}</div>
          <div className="mt-1.5 font-mono text-[11px] text-slate-400">{m.right.sum}</div>
          <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-emerald-300">{usd(m.right.value)}</div>
        </div>
      </div>

      <div className="mt-2.5 rounded-xl border border-amber-500/40 bg-amber-500/[0.08] p-3.5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wide text-amber-300">The gap</span>
          <span className="font-mono text-lg font-bold tabular-nums text-amber-200">{usd(gap)}</span>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{m.why}</p>

        {m.key === 'order' && (
          <div className="mt-3 border-t border-white/10 pt-3">
            <div className="mb-1 flex justify-between font-mono text-xs">
              <span className="text-slate-400">Now move the market</span>
              <span className="font-bold tabular-nums text-white">WS{ws}</span>
            </div>
            <input type="range" min={40} max={250} step={1} value={ws}
              onChange={e => setWs(parseInt(e.target.value, 10))}
              aria-label="Market level in Worldscale points"
              className="h-1.5 w-full cursor-pointer accent-amber-400" />
            <p className="mt-1.5 font-mono text-[11px] text-slate-300">
              At WS{ws} the wrong order is out by{' '}
              <strong className="text-amber-200">{usd(Math.abs(orderGapAt(ws)))}</strong>
              {Math.abs(ws - 100) < 1
                ? ' — nothing at all, because scaling a fixed differential by 100% leaves it alone. This is the one market level where the mistake is free.'
                : ws < 100
                  ? ', understating the fixed differential. Slide past WS100 and the error changes sign.'
                  : ', now OVERSTATING it. The error is zero at WS100 and opens in both directions from there — so it is invisible in a flat market and expensive in a moving one.'}
            </p>
          </div>
        )}
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-slate-400">
        One habit prevents all three: when you write a freight number down, write the{' '}
        <strong className="text-slate-200">year, the load/discharge pair and the differentials</strong> beside it. A WS level on
        its own is not a price — it is a percentage waiting for the right flat rate.
      </p>
    </div>
  )
}
