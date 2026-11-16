'use client'

import { useState } from 'react'

// The three arbitrages, each as the trade it actually is: buy here, sell
// there, and the edge in between — with the line that eats the edge.
//
// Students read "arbitrage" as risk-free. Every one of these carries a real
// risk, and naming it is the point of the last row.

type Leg = { label: string; detail: string; v: number }
type Arb = {
  key: string
  name: string
  color: string
  question: string
  legs: Leg[]
  unit: string
  risk: string
}

const ARBS: Arb[] = [
  {
    key: 'origin', name: 'Origin', color: '#22d3ee',
    question: 'Same use, two origins — which one does the roaster’s blend cheaper?',
    unit: '$/t',
    legs: [
      { label: 'Buy Vietnam Gd2, FOB HCM', detail: 'London Jan − $30', v: -30 },
      { label: 'Sell into the European instant blend', detail: 'the slot values it at London + $10', v: 10 },
      { label: 'Freight and finance to destination', detail: 'HCM → Antwerp, plus the money while it sails', v: -22 },
    ],
    risk: 'The buyer has to ACCEPT the substitution. A roaster reformulating from Brazilian conilon to Vietnamese Gd2 is changing a recipe, and recipes are sticky — the edge is real only for the volume that is genuinely interchangeable.',
  },
  {
    key: 'quality', name: 'Quality', color: '#34d399',
    question: 'Can I build a certifiable grade out of cheaper inputs than the premium costs?',
    unit: '$/t',
    legs: [
      { label: 'Buy 60% off-grade lots', detail: 'London − $90, weighted 60% → −$54', v: -54 },
      { label: 'Buy 40% clean Class 1', detail: 'London + $0 at par, weighted 40% → $0', v: 0 },
      { label: 'Blend and re-screen', detail: 'labour, shrinkage, re-bagging', v: -12 },
      { label: 'Sell the blend as certifiable', detail: 'Class 1 spec: London − $20', v: -20 },
    ],
    risk: 'You are long the blend until it passes. Miss the defect count by one and the whole parcel drops out of the exchange grade — and with it the tenderable floor under its differential. This trade is an operational bet, not a price view.',
  },
  {
    key: 'logistic', name: 'Logistic', color: '#a78bfa',
    question: 'Same coffee, two warehouses — is the basis difference worth the detour?',
    unit: '$/t',
    legs: [
      { label: 'Sell where it sits — instore Rotterdam', detail: 'the market bids London + $8', v: 8 },
      { label: 'Sell after the move — instore Hamburg', detail: 'receipts trade at London + $20', v: 20 },
      { label: 'Reroute: inland haul and re-warehousing', detail: 'truck, in/out handling, new weighing', v: -5 },
    ],
    risk: 'Time. The basis difference that justified the detour can close while the truck is moving — and you pay the handling either way. Logistic arbitrage is the one where the edge decays fastest.',
  },
]

export default function ArbitrageMap() {
  const [sel, setSel] = useState('origin')
  const arb = ARBS.find(a => a.key === sel)!

  // Origin and logistic read as sell − buy − costs; quality nets the blend
  // against its inputs. Both reduce to "everything signed, then summed".
  const edge = arb.key === 'quality'
    ? arb.legs[3].v - (arb.legs[0].v + arb.legs[1].v) + arb.legs[2].v
    : arb.legs[1].v - arb.legs[0].v + arb.legs[2].v

  const signed = (n: number) => (n >= 0 ? '+' : '−') + '$' + Math.abs(n)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Three ways to trade a differential</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        A physical desk does not take a view on the coffee price — it takes a view on the <strong className="text-slate-200">gap</strong>{' '}
        between two differentials. There are only three kinds of gap.
      </p>

      <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Arbitrage type">
        {ARBS.map(a => (
          <button
            key={a.key} type="button" onClick={() => setSel(a.key)}
            aria-pressed={sel === a.key}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all ${
              sel === a.key ? 'bg-white/[0.08] text-white' : 'border-white/10 text-slate-400 hover:text-slate-200'
            }`}
            style={sel === a.key ? { borderColor: a.color + '99', color: a.color } : undefined}
          >
            {a.name} arbitrage
          </button>
        ))}
      </div>

      <p className="mb-3 text-sm italic leading-relaxed" style={{ color: arb.color }}>{arb.question}</p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* the trade, leg by leg */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <div className="mb-2.5 flex items-baseline justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-wide text-slate-200">The trade</span>
            <span className="font-mono text-[10px] text-slate-500">all figures {arb.unit} vs the futures</span>
          </div>
          <div className="space-y-2">
            {arb.legs.map((l, i) => (
              <div key={i} className="flex items-baseline justify-between gap-3 border-b border-white/[0.05] pb-2 last:border-0">
                <span className="text-xs text-slate-300">
                  {l.label}
                  <span className="block font-mono text-[10px] text-slate-500">{l.detail}</span>
                </span>
                <span className="shrink-0 font-mono text-xs font-bold tabular-nums text-slate-200">
                  {signed(l.v)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-baseline justify-between border-t border-white/20 pt-2.5">
            <span className="font-mono text-xs font-bold uppercase tracking-wide text-slate-300">Edge</span>
            <span className="font-mono text-xl font-bold tabular-nums" style={{ color: arb.color }}>
              {signed(edge)}/t
            </span>
          </div>
        </div>

        {/* what eats it */}
        <div className="rounded-xl border p-3.5" style={{ borderColor: arb.color + '55', backgroundColor: arb.color + '0d' }}>
          <div className="mb-1.5 font-mono text-xs font-bold uppercase tracking-wide" style={{ color: arb.color }}>
            What eats the edge
          </div>
          <p className="text-sm leading-relaxed text-slate-300">{arb.risk}</p>
          <p className="mt-3 border-t border-white/10 pt-2.5 text-xs leading-relaxed text-slate-400">
            None of these is risk-free, which is why the word “arbitrage” is doing a lot of work here. What they have in common is that
            the flat price is <strong className="text-slate-200">hedged out of all three</strong> — you are trading one differential
            against another, and the futures screen never tells you whether you were right.
          </p>
        </div>
      </div>
    </div>
  )
}
