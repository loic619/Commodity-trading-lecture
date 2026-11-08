'use client'

import { useState } from 'react'

// Two framing questions, and the second one — WHEN do I fix? — is where
// freight and trading actually meet. The three sequencing choices each leave
// a different exposure, and the professional answer is the one students never
// guess: work both legs to subjects in parallel.

type Order = 'ship-first' | 'cargo-first' | 'parallel'

const ORDERS: Record<Order, {
  label: string; color: string; exposure: string; what: string; cost: string;
  steps: { t: string; ship: boolean; cargo: boolean }[]
}> = {
  'ship-first': {
    label: 'Fix the ship first', color: '#f59e0b',
    exposure: 'Short cargo against a committed ship',
    what: 'You have a vessel and no cargo. If the purchase falls through — the seller fails, the arb closes, the credit line does not come — you still owe the owner a laden voyage.',
    cost: 'Deadfreight on the full stem, or a distressed relet into whatever market exists on the day. On 80,000 t that is a six-figure mistake made by a decision about sequence.',
    steps: [
      { t: 'Ship fixed', ship: true, cargo: false },
      { t: 'Cargo still working', ship: true, cargo: false },
      { t: 'Cargo dies', ship: true, cargo: false },
    ],
  },
  'cargo-first': {
    label: 'Fix the cargo first', color: '#f43f5e',
    exposure: 'Short freight, in a market that can see it',
    what: 'You own barrels that must move and no ship to move them. Every broker on the street now knows a cargo is looking and that you cannot walk away.',
    cost: 'The WS level moves against a known distressed charterer. The market has eyes: position lists are public, and a charterer who has to fix today pays for the privilege.',
    steps: [
      { t: 'Cargo bought', ship: false, cargo: true },
      { t: 'Hunting for a ship', ship: false, cargo: true },
      { t: 'Market reads you', ship: false, cargo: true },
    ],
  },
  parallel: {
    label: 'Both legs to subjects, lift together', color: '#34d399',
    exposure: 'Neither — until you choose to be exposed',
    what: 'Work the cargo and the ship simultaneously, each to "subjects". Neither is binding. When both stand up, you lift them together and the two commitments become real in the same minute.',
    cost: 'Nothing, if you are disciplined. The constraint is that subjects are for their stated purpose: failing subs because a cheaper ship appeared is technically legal and commercially lethal.',
    steps: [
      { t: 'Both on subs', ship: false, cargo: false },
      { t: 'Both stand up', ship: false, cargo: false },
      { t: 'Lift together', ship: true, cargo: true },
    ],
  },
}

const NEEDS = [
  { k: 'Spot voyage', v: 'One cargo, market risk taken fresh each time. The right answer for a one-off arbitrage cargo — the exposure is single and short, so match it with a single, short commitment.' },
  { k: 'COA', v: 'A contract of affreightment: programme cover for a series of cargoes over a period, at an agreed rate. The right answer for a yearly supply contract, where the exposure repeats.' },
  { k: 'Time charter', v: 'You take the ship for a period and become an operator — maximum flexibility, and you now own the idle days too. The right answer when you need optionality on routes and timing, and have the volume to use it.' },
]

export default function CharteringTiming() {
  const [order, setOrder] = useState<Order>('cargo-first')
  const [step, setStep] = useState(2)
  const [need, setNeed] = useState(0)
  const o = ORDERS[order]
  const s = o.steps[Math.min(step, o.steps.length - 1)]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">When you fix is a position, not an administrative detail</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Two framing questions sit behind every chartering decision. The first — <em>what do I need?</em> — mirrors the hedging
        logic of the commodity course: match the instrument to the exposure. The second —{' '}
        <strong className="text-slate-200">when do I fix?</strong> — is where freight and trading actually meet.
      </p>

      <div className="mb-4 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
        <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">1. What do I actually need?</div>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {NEEDS.map((n, i) => (
            <button key={n.k} type="button" onClick={() => setNeed(i)} aria-pressed={need === i}
              className={`rounded-full border px-3 py-1 text-xs font-bold transition-all ${
                need === i ? 'border-cyan-400/60 bg-cyan-400/15 text-cyan-100' : 'border-white/10 text-slate-400 hover:text-slate-200'
              }`}>
              {n.k}
            </button>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-slate-300">{NEEDS[need].v}</p>
      </div>

      <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">2. When do I fix?</div>
      <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Sequencing">
        {(Object.keys(ORDERS) as Order[]).map(k => (
          <button
            key={k} type="button" onClick={() => { setOrder(k); setStep(2) }}
            aria-pressed={order === k}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
              order === k ? 'bg-white/[0.08]' : 'border-white/10 text-slate-400 hover:text-slate-200'
            }`}
            style={order === k ? { borderColor: ORDERS[k].color + '99', color: ORDERS[k].color } : undefined}
          >
            {ORDERS[k].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          {/* two commitment tracks */}
          {([['Ship committed', 'ship'], ['Cargo committed', 'cargo']] as const).map(([label, key]) => (
            <div key={key} className="mb-2 flex items-center gap-2">
              <span className="w-28 shrink-0 font-mono text-[11px] text-slate-400">{label}</span>
              <div className="flex flex-1 gap-1">
                {o.steps.map((st, i) => (
                  <button
                    key={i} type="button" onClick={() => setStep(i)}
                    aria-label={`${label} at ${st.t}: ${st[key] ? 'committed' : 'not committed'}`}
                    className={`h-6 flex-1 rounded transition-all ${i === step ? 'ring-2 ring-white/40' : ''}`}
                    style={{ backgroundColor: st[key] ? o.color : 'rgba(255,255,255,0.05)', opacity: st[key] ? 0.7 : 1 }}
                  />
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <span className="w-28 shrink-0" />
            <div className="flex flex-1 gap-1">
              {o.steps.map((st, i) => (
                <span key={i} className={`flex-1 text-center font-mono text-[9px] ${i === step ? 'text-cyan-300' : 'text-slate-600'}`}>
                  {st.t}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-3 border-t border-white/10 pt-2.5 font-mono text-[11px] text-slate-400">
            at <strong className="text-slate-200">{s.t}</strong>:{' '}
            {s.ship && s.cargo ? 'both legs binding, matched'
              : s.ship ? 'ship binding, cargo not — you owe a laden voyage you cannot fill'
                : s.cargo ? 'cargo binding, ship not — you own oil that must move'
                  : 'neither leg binding — you still have the option'}
          </p>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-xl border p-3.5" style={{ borderColor: o.color + '66', backgroundColor: o.color + '12' }}>
            <div className="font-mono text-sm font-bold" style={{ color: o.color }}>{o.exposure}</div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{o.what}</p>
            <p className="mt-2 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-300">
              <strong className="text-slate-100">What it costs:</strong> {o.cost}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <p className="text-xs leading-relaxed text-slate-300">
              A <strong className="text-white">CIF seller who has sold at a fixed price is short freight from the moment of
              sale</strong>. The freight leg is an exposure like any other — and this module&apos;s Worldscale sheet is its price
              screen. If that feels familiar, it is the same lesson the FOB→CIF simulation taught when freight ran away mid-trade.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
