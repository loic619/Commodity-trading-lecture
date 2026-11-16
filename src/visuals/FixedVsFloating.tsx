'use client'

import { useState } from 'react'

// The trap: a physical position is not automatically a price risk. Flip each
// leg between fixed and floating and watch the exposure appear and vanish —
// the barrels never move, only the pricing basis does.
//
// The fourth combination is the one students never expect: buy floating, sell
// floating, and you carry a cargo with no flat-price exposure at all. Hedging
// it would CREATE a position rather than remove one.

type Basis = 'fixed' | 'floating'

export default function FixedVsFloating() {
  const [buy, setBuy] = useState<Basis>('fixed')
  const [sell, setSell] = useState<Basis>('floating')

  // Exposure exists only where the two legs do not reprice together.
  const exposed = buy !== sell
  // Which way: a fixed buy against a floating sell is long flat price.
  const direction = !exposed ? 'neutral' : buy === 'fixed' ? 'long' : 'short'

  const verdict = {
    neutral: {
      label: buy === 'floating' ? 'No price risk — both legs float' : 'No price risk — both legs are fixed',
      color: '#34d399',
      note: buy === 'floating'
        ? 'You own barrels and you owe barrels, and both reprice off the same published formula. When the market moves, both legs move together and the difference between them does not. You have a physical position and no flat-price exposure.'
        : 'Both sides are locked at a number. The margin between them was fixed the moment you signed, and nothing the market does afterwards changes it.',
      hedge: 'Do NOT hedge this. There is no flat-price risk to remove, so a futures leg would not offset anything — it would create a brand-new exposure out of nothing. This is the single most common way a junior turns a flat book into a short one.',
    },
    long: {
      label: 'LONG the flat price',
      color: '#f43f5e',
      note: 'You paid a fixed number for the cargo and you will be paid a floating one. If the market falls between now and the pricing period, you bought high and sell low — the loss is yours.',
      hedge: 'Hedgeable, and this is the textbook case: SELL futures against it. An equal and opposite short neutralises the flat price, and what remains is the differential and the timing — which is what the rest of this module is about.',
    },
    short: {
      label: 'SHORT the flat price',
      color: '#22d3ee',
      note: 'You will pay a floating price for barrels you have already sold at a fixed number. If the market rallies before your pricing period, you sold low and buy high.',
      hedge: 'Hedgeable: BUY futures. The mirror image of the long case, and the position an end-user who has quoted a fixed price to a customer typically finds themselves in.',
    },
  }[direction]

  const Leg = ({ label, value, onChange, hint }: {
    label: string; value: Basis; onChange: (b: Basis) => void; hint: string
  }) => (
    <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
      <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">{label}</div>
      <div className="flex gap-1.5">
        {(['fixed', 'floating'] as const).map(b => (
          <button
            key={b} type="button" onClick={() => onChange(b)}
            aria-pressed={value === b}
            aria-label={`${label}: ${b}`}
            className={`flex-1 rounded-lg border px-2.5 py-2 font-mono text-xs font-bold transition-all ${
              value === b
                ? b === 'fixed' ? 'border-amber-400/60 bg-amber-400/15 text-amber-200' : 'border-cyan-400/60 bg-cyan-400/15 text-cyan-200'
                : 'border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            {b}
          </button>
        ))}
      </div>
      <p className="mt-2 font-mono text-[10px] leading-relaxed text-slate-500">
        {value === 'fixed' ? hint : 'prices off a published formula — Dated Brent ± a differential, averaged over a window'}
      </p>
    </div>
  )

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">A physical position is not a price risk</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Barrels moving is not the same thing as money at risk. Flip each leg between{' '}
        <strong className="text-amber-200">fixed</strong> and <strong className="text-cyan-200">floating</strong> — the cargo is
        identical in all four cases, and only the pricing basis changes.
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Leg label="You buy the cargo" value={buy} onChange={setBuy} hint="a number agreed today — $82.45/bbl" />
        <div className="flex items-center justify-center font-mono text-lg text-slate-600">→</div>
        <Leg label="You sell it on" value={sell} onChange={setSell} hint="a number agreed today — $83.10/bbl" />
      </div>

      {/* what a market move does to each leg */}
      <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
        <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
          Now the market moves $5. What happens to each leg?
        </div>
        <div className="space-y-2">
          {[
            { leg: 'Buy leg', basis: buy },
            { leg: 'Sell leg', basis: sell },
          ].map(r => (
            <div key={r.leg} className="flex items-center gap-3">
              <span className="w-20 shrink-0 font-mono text-xs text-slate-400">{r.leg}</span>
              <span className="flex-1">
                <span className="block h-3 rounded bg-white/[0.05]">
                  <span
                    className="block h-full rounded transition-all"
                    style={{
                      width: r.basis === 'floating' ? '100%' : '0%',
                      backgroundColor: '#22d3ee',
                      opacity: 0.6,
                    }}
                  />
                </span>
              </span>
              <span className={`w-36 shrink-0 text-right font-mono text-[11px] ${r.basis === 'floating' ? 'text-cyan-300' : 'text-amber-300'}`}>
                {r.basis === 'floating' ? 'moves with the market' : 'does not move'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-xl border p-3.5" style={{ borderColor: verdict.color + '66', backgroundColor: verdict.color + '12' }}>
        <div className="font-mono text-sm font-bold" style={{ color: verdict.color }}>{verdict.label}</div>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{verdict.note}</p>
        <p className="mt-2.5 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-300">
          <strong className="text-slate-100">Can you hedge it?</strong> {verdict.hedge}
        </p>
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-slate-400">
        The rule to carry out of this: <strong className="text-slate-200">only when you have a price risk can you hedge</strong>.
        Hedging a position that carries none does not reduce exposure — it manufactures one.
      </p>
    </div>
  )
}
