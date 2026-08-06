'use client'

import { useState } from 'react'

// The dispute-resolution ladder: five rungs from a phone call to a courtroom,
// each with its cost, speed and bindingness drawn as bars. Click a rung.
type Rung = {
  name: string; color: string
  cost: number; time: number; binding: number // 0..1 scales
  who: string; note: string
}

const RUNGS: Rung[] = [
  {
    name: 'Negotiation', color: '#34d399', cost: 0.05, time: 0.1, binding: 0.15,
    who: 'The operators and claims desks themselves',
    note: 'The claims correspondence: most demurrage files settle here, at a documented number both sides can defend internally. Binding only once a settlement is signed.',
  },
  {
    name: 'ENE / ENI', color: '#22d3ee', cost: 0.15, time: 0.2, binding: 0.2,
    who: 'A respected neutral (retired arbitrator, senior counsel)',
    note: 'Early neutral evaluation: a non-binding read on the likely outcome — "you would probably lose on the NOR point" resets an unrealistic position cheaply. ENI engages the same neutral earlier and more actively, structuring the exchange before positions harden.',
  },
  {
    name: 'Mediation', color: '#3b82f6', cost: 0.3, time: 0.3, binding: 0.35,
    who: 'A mediator shuttling between the parties',
    note: 'A facilitated negotiation toward a settlement THE PARTIES write — confidential, fast, non-binding until signed. Often a mandatory tier in the clause (negotiate → mediate → arbitrate); refusing to mediate can carry costs consequences.',
  },
  {
    name: 'Arbitration', color: '#8b5cf6', cost: 0.7, time: 0.7, binding: 0.95,
    who: 'LMAA (London) · SMA (New York) · SCMA (Singapore)',
    note: 'The maritime default: specialist tribunals, private awards, small-claims procedures for demurrage-sized amounts — and the New York Convention 1958 makes the award enforceable in 170+ states. The price: party-funded, near-final (almost no appeal on the merits).',
  },
  {
    name: 'Litigation', color: '#f43f5e', cost: 1, time: 1, binding: 0.95,
    who: 'National courts — for shipping, mostly the English Commercial Court',
    note: 'Public judgments that build precedent, strong interim remedies (freezing orders, arrest in support), the full appeal ladder — but slow, public, and only as enforceable abroad as treaties allow. Charter disputes rarely start here; B/L and casualty cases do.',
  },
]

const BAR = (v: number, color: string) => (
  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
    <div className="h-full rounded-full" style={{ width: `${v * 100}%`, background: color, opacity: 0.85 }} />
  </div>
)

export default function DisputeLadder() {
  const [sel, setSel] = useState(3)
  const r = RUNGS[sel]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-3 text-brand-cyan">The escalation ladder — cost, time, bindingness</div>

      <div className="space-y-1.5">
        {RUNGS.map((rung, i) => (
          <button key={rung.name} type="button" onClick={() => setSel(i)}
            className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left transition-all ${
              i === sel ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'
            }`}
            style={{ borderColor: i === sel ? rung.color + '88' : 'rgba(255,255,255,0.08)' }}>
            <span className="w-6 text-center font-mono text-[11px] font-bold" style={{ color: rung.color }}>{i + 1}</span>
            <span className="w-24 shrink-0 font-mono text-[11px] font-bold" style={{ color: rung.color }}>{rung.name}</span>
            <div className="grid flex-1 grid-cols-3 items-center gap-2">
              <div className="flex items-center gap-1.5"><span className="w-7 font-mono text-[8px] text-slate-500">cost</span>{BAR(rung.cost, rung.color)}</div>
              <div className="flex items-center gap-1.5"><span className="w-7 font-mono text-[8px] text-slate-500">time</span>{BAR(rung.time, rung.color)}</div>
              <div className="flex items-center gap-1.5"><span className="w-9 font-mono text-[8px] text-slate-500">binding</span>{BAR(rung.binding, rung.color)}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-2 rounded-xl border p-3" style={{ borderColor: r.color + '55', backgroundColor: r.color + '0d' }}>
        <div className="font-mono text-xs font-bold" style={{ color: r.color }}>{r.name} — {r.who}</div>
        <p className="mt-1 text-xs leading-relaxed text-slate-300">{r.note}</p>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        Proportionality is the skill: a $150k demurrage difference cannot rationally fund a $400k arbitration. Climb
        only as high as the money justifies — and remember the parties will fix with each other again next month.
      </p>
    </div>
  )
}
