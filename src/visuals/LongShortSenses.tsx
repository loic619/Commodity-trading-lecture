'use client'

import { useState } from 'react'

// Four sentences a trader says in a morning meeting, all using "long" or
// "short", none meaning the same thing. The classification matters because
// exactly one of the four is a hedgeable price risk — and students reach for
// the futures screen on all four.

type Sense = {
  key: string
  quote: string
  word: 'long' | 'short'
  kind: string
  color: string
  means: string
  hedgeable: boolean
  why: string
}

const SENSES: Sense[] = [
  {
    key: 'structural', quote: 'Europe is SHORT distillate.', word: 'short',
    kind: 'Structural / regional', color: '#a78bfa',
    means: 'A statement about a market, not about anybody’s book. European refineries produce less diesel than Europe burns, so the region imports it — permanently.',
    hedgeable: false,
    why: 'There is no position here to hedge. It is a description of a supply-and-demand imbalance, and the thing it predicts is a persistent trade flow, not a P&L.',
  },
  {
    key: 'spread', quote: 'Refiners are LONG the margin.', word: 'long',
    kind: 'Spread', color: '#34d399',
    means: 'A position in the difference between two prices — products out against crude in. The refiner gains when the crack widens, whichever way the flat price goes.',
    hedgeable: true,
    why: 'Hedgeable, but NOT with a single futures leg. A crack is two legs — sell products, buy crude — and hedging only one of them converts a spread position into a flat-price one. That is the classic way to make a hedge worse.',
  },
  {
    key: 'physical', quote: 'He is LONG a term contract of Bonny Light.', word: 'long',
    kind: 'Physical commitment', color: '#f59e0b',
    means: 'He has contracted to receive barrels over a period. Whether that is a price risk depends entirely on how the contract prices.',
    hedgeable: false,
    why: 'Not hedgeable as stated — you cannot tell yet. If the term contract prices off a floating formula and he onsells on the same formula, there may be no price risk at all. The next section is about exactly this trap.',
  },
  {
    key: 'obligation', quote: 'She is SHORT jet fuel into the Thames.', word: 'short',
    kind: 'Uncovered obligation', color: '#f43f5e',
    means: 'She has sold jet she does not yet own, for delivery to a named place. If jet rallies before she buys it, she pays up.',
    hedgeable: true,
    why: 'THIS is the hedgeable one. A defined volume, a defined period, and a price she has not locked. Buy the hedge, and the flat-price component of that obligation goes neutral.',
  },
]

export default function LongShortSenses() {
  const [sel, setSel] = useState('obligation')
  const s = SENSES.find(x => x.key === sel)!

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Same two words, four different meanings</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        Four sentences from one morning meeting. Every one of them says <strong className="text-slate-200">long</strong> or{' '}
        <strong className="text-slate-200">short</strong>, and no two mean the same thing — so before you can hedge, you have to
        work out which kind of position you are actually holding.
      </p>

      <div className="space-y-1.5">
        {SENSES.map(x => (
          <button
            key={x.key} type="button" onClick={() => setSel(x.key)}
            aria-pressed={sel === x.key}
            className={`flex w-full flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left transition-all ${
              sel === x.key ? 'bg-white/[0.07]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
            }`}
            style={sel === x.key ? { borderColor: x.color + '99' } : undefined}
          >
            <span className="text-sm italic text-slate-200">&ldquo;{x.quote}&rdquo;</span>
            <span className="flex shrink-0 items-center gap-2">
              <span className="rounded px-2 py-0.5 font-mono text-[10px] uppercase" style={{ backgroundColor: x.color + '22', color: x.color }}>
                {x.kind}
              </span>
              <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                x.hedgeable ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/[0.06] text-slate-500'
              }`}>
                {x.hedgeable ? 'hedgeable' : 'not a hedge'}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-xl border p-3.5" style={{ borderColor: s.color + '55', backgroundColor: s.color + '0d' }}>
        <div className="font-mono text-sm font-bold" style={{ color: s.color }}>{s.kind}</div>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{s.means}</p>
        <p className={`mt-2.5 border-t border-white/10 pt-2 text-xs leading-relaxed ${s.hedgeable ? 'text-emerald-200' : 'text-slate-400'}`}>
          <strong>{s.hedgeable ? 'Can you hedge it?' : 'Why not?'}</strong> {s.why}
        </p>
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-slate-400">
        Context tells you which sense is meant — and only one of the four is a plain, hedgeable price risk. The habit worth building
        is to ask, every time someone says they are long or short:{' '}
        <strong className="text-slate-200">long of what, over what period, priced how?</strong> If you cannot answer all three, there
        is nothing to hedge yet.
      </p>
    </div>
  )
}
