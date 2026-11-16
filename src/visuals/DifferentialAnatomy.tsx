'use client'

import { useState } from 'react'

// The one equation the rest of the module runs on, taken apart.
//
// Two things students need from this slide. First, that the differential is a
// RESIDUAL: it prices everything the futures contract deliberately ignores, so
// it decomposes into quality, logistics, timing and local balance. Second, the
// unit trap — London quotes $/t and New York quotes ¢/lb, and a differential
// is meaningless until you know which.

const CENTS_PER_LB_TO_USD_PER_T = 2204.62 / 100 // 1 ¢/lb = $22.05/t

type Component = { label: string; note: string; v: number }
type Coffee = {
  key: string
  name: string
  origin: string
  contract: string
  unit: '$/t' | '¢/lb'
  futures: number
  components: Component[]
}

const COFFEES: Coffee[] = [
  {
    key: 'vn', name: 'Vietnam Robusta Gd2', origin: 'FOB Ho Chi Minh, 5% defects',
    contract: 'ICE Europe (London) Jan', unit: '$/t', futures: 4500,
    components: [
      { label: 'Quality vs contract grade', note: 'Gd2 sits below the exchange’s Class 1 par', v: -10 },
      { label: 'Origin logistics', note: 'Dak Lak to the port, handling, local trucking', v: -8 },
      { label: 'Harvest timing', note: 'Nov–Feb: everyone is selling at once', v: -7 },
      { label: 'Local supply & demand', note: 'exporter financing pressure at origin', v: -5 },
    ],
  },
  {
    key: 'co', name: 'Colombia Supremo', origin: 'FOB Buenaventura, screen 17+',
    contract: 'ICE US (New York) Mar', unit: '¢/lb', futures: 320,
    components: [
      { label: 'Quality vs contract grade', note: 'washed arabica, large screen — a premium growth', v: 22 },
      { label: 'Origin logistics', note: 'mountain farms down to the Pacific coast', v: -6 },
      { label: 'Local supply & demand', note: 'roaster demand for washed milds', v: 14 },
      { label: 'Certification & traceability', note: 'a market the futures contract does not price at all', v: 5 },
    ],
  },
  {
    key: 'br', name: 'Brazil Santos 17/18', origin: 'FOB Santos, natural, strictly soft',
    contract: 'ICE US (New York) Mar', unit: '¢/lb', futures: 320,
    components: [
      { label: 'Quality vs contract grade', note: 'a NATURAL — not tenderable against the C at all', v: -12 },
      { label: 'Origin logistics', note: 'scale and an efficient port: a genuine advantage', v: 9 },
      { label: 'Harvest timing', note: 'May–Sep harvest pressure', v: -6 },
      { label: 'Local supply & demand', note: 'internal Brazilian demand supports it', v: 1 },
    ],
  },
  {
    key: 'hn', name: 'Honduras SHG EP', origin: 'FOB Puerto Cortés, strictly high grown',
    contract: 'ICE US (New York) Mar', unit: '¢/lb', futures: 320,
    components: [
      { label: 'Quality vs contract grade', note: 'high grown, European preparation', v: 16 },
      { label: 'Origin logistics', note: 'inland haul to the Caribbean coast', v: -7 },
      { label: 'Harvest timing', note: 'Nov–Mar, into the northern winter', v: -2 },
      { label: 'Certification & traceability', note: 'organic / Fairtrade demand', v: 5 },
    ],
  },
]

export default function DifferentialAnatomy() {
  const [sel, setSel] = useState('vn')
  const c = COFFEES.find(x => x.key === sel)!

  const diff = c.components.reduce((s, x) => s + x.v, 0)
  const physical = c.futures + diff
  const maxAbs = Math.max(...c.components.map(x => Math.abs(x.v)))

  const money = (n: number) =>
    c.unit === '$/t' ? '$' + n.toLocaleString('en-US') : n.toFixed(0) + '¢'
  const signed = (n: number) =>
    (n >= 0 ? '+' : '−') + (c.unit === '$/t' ? '$' + Math.abs(n) : Math.abs(n) + '¢')

  // In the equation row the operator is always "+", so a discount is shown
  // parenthesised rather than turning the row into a double negative.
  const eqDiff = diff >= 0 ? money(diff) : `(${signed(diff)})`

  // The same differential expressed in the other market's unit. Sign handled
  // explicitly: a negative converted value must not render as "$-176/t".
  const converted = c.unit === '$/t'
    ? diff / CENTS_PER_LB_TO_USD_PER_T
    : diff * CENTS_PER_LB_TO_USD_PER_T
  const other = (converted >= 0 ? '+' : '−') + (c.unit === '$/t'
    ? `${Math.abs(converted).toFixed(1)}¢/lb`
    : `$${Math.abs(Math.round(converted))}/t`)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Physical price = futures ± differential</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        The futures contract standardises everything except price. The differential is the bill for everything it
        <strong className="text-slate-200"> deliberately ignores</strong> — so it is not one number, it is four. Pick a coffee.
      </p>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {COFFEES.map(x => (
          <button
            key={x.key} type="button" onClick={() => setSel(x.key)}
            aria-pressed={sel === x.key}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              sel === x.key ? 'border-cyan-400/60 bg-cyan-400/15 text-cyan-100' : 'border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            {x.name}
          </button>
        ))}
      </div>

      {/* the equation */}
      <div className="flex flex-wrap items-stretch gap-2">
        <div className="min-w-[150px] flex-1 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5">
          <div className="font-mono text-[11px] uppercase tracking-wide text-slate-400">Futures — the reference</div>
          <div className="font-mono text-xl font-bold tabular-nums text-white">{money(c.futures)}</div>
          <div className="font-mono text-[10px] text-slate-500">{c.contract} · {c.unit}</div>
        </div>
        <div className="flex items-center font-mono text-xl text-slate-500">+</div>
        <div className="min-w-[150px] flex-1 rounded-lg border border-cyan-400/40 bg-cyan-400/[0.08] px-3 py-2.5">
          <div className="font-mono text-[11px] uppercase tracking-wide text-cyan-300">Differential — this coffee</div>
          <div className="font-mono text-xl font-bold tabular-nums text-cyan-300">{eqDiff}</div>
          <div className="font-mono text-[10px] text-slate-500">agreed today, fixed for the contract</div>
        </div>
        <div className="flex items-center font-mono text-xl text-slate-500">=</div>
        <div className="min-w-[150px] flex-1 rounded-lg border px-3 py-2.5" style={{ borderColor: 'rgba(255,255,255,0.35)', borderTopWidth: 3, borderTopStyle: 'double' }}>
          <div className="font-mono text-[11px] uppercase tracking-wide text-slate-300">Physical price</div>
          <div className="font-mono text-xl font-bold tabular-nums text-white">{money(physical)}</div>
          <div className="font-mono text-[10px] text-slate-500">{c.origin}</div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* what is inside the differential */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <div className="mb-3 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
            What the {signed(diff)} is actually made of
          </div>
          <div className="space-y-3">
            {c.components.map(x => {
              const pct = (Math.abs(x.v) / maxAbs) * 48
              return (
                <div key={x.label}>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="text-xs text-slate-300">
                      {x.label}
                      <span className="block font-mono text-[10px] text-slate-500">{x.note}</span>
                    </span>
                    <span className={`shrink-0 font-mono text-xs font-bold tabular-nums ${x.v >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {signed(x.v)}
                    </span>
                  </div>
                  {/* zero-centred: discounts left, premiums right */}
                  <div className="relative h-2.5 rounded bg-white/[0.04]">
                    <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
                    <div
                      className={`absolute inset-y-0 rounded ${x.v >= 0 ? 'bg-emerald-400/70' : 'bg-rose-400/70'}`}
                      style={x.v >= 0 ? { left: '50%', width: `${pct}%` } : { right: '50%', width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-3 flex items-baseline justify-between border-t border-white/15 pt-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wide text-slate-300">Differential</span>
            <span className="font-mono text-sm font-bold tabular-nums text-cyan-300">{signed(diff)}</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/[0.08] p-3.5">
            <div className="font-mono text-xs font-bold uppercase tracking-wide text-amber-300">The unit trap</div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
              London quotes <strong className="text-white">$/tonne</strong>, New York quotes <strong className="text-white">US cents/pound</strong>.
              A differential is meaningless until you know which. This one is{' '}
              <strong className="text-amber-200">{signed(diff)}{c.unit === '$/t' ? '/t' : '/lb'}</strong>, which is{' '}
              <strong className="text-amber-200">{other}</strong>.
            </p>
            <p className="mt-2 rounded-lg border border-white/10 bg-black/20 p-2 font-mono text-[11px] text-slate-400">
              1 ¢/lb = $22.05/t · 1 t = 2,204.62 lb
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="mb-1.5 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">Why this is the whole job</div>
            <p className="text-xs leading-relaxed text-slate-300">
              Hedge the futures leg and the first box cancels out of your book. What is left — what you bought, sold and
              actually trade for a living — is the <strong className="text-cyan-300">second box</strong>. Every line inside it is a
              commercial judgement someone at the desk made, and none of them appear on the screen.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              You will still hear old-timers say <em>“LIFFE”</em> for the London contract — it has been ICE Futures Europe since 2013.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
