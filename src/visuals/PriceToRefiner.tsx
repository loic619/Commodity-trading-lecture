'use client'

import { useState } from 'react'

// The module's closing visual: a price quoted to a refiner, built from the
// pieces the whole module has been assembling. Each component is draggable
// and each one names the instrument that hedges it — so the last thing a
// student sees is the toolkit mapped onto a single number.

type Comp = {
  key: string
  label: string
  min: number
  max: number
  step: number
  color: string
  what: string
  hedge: string
  instrument: string
}

const COMPS: Comp[] = [
  {
    key: 'bench', label: 'Benchmark — Dated Brent', min: 60, max: 110, step: 0.25, color: '#22d3ee',
    what: 'The anchor. Whatever the grade, the quote starts from a published reference everyone can see.',
    hedge: 'ICE Brent futures neutralise this component — it is the flat price, and it is the easy part.',
    instrument: 'Futures',
  },
  {
    key: 'diff', label: 'Grade differential', min: -4, max: 4, step: 0.05, color: '#f59e0b',
    what: 'What this specific crude is worth against the benchmark: API, sulphur, yield, and the refinery kit needed to run it.',
    hedge: 'Not hedgeable on a screen. This is the risk the desk is paid to carry — and it is why the GPW calculation matters.',
    instrument: 'Unhedged — your margin',
  },
  {
    key: 'time', label: 'Time value — the loading dates', min: -1.5, max: 1.5, step: 0.05, color: '#a78bfa',
    what: 'Two cargoes with the same formula are worth different money depending on when they load. Market structure, priced.',
    hedge: 'CFDs. This is exactly what the CFD week-by-week market exists to quantify and lock.',
    instrument: 'CFD',
  },
  {
    key: 'dfl', label: 'Dated vs futures (the DFL)', min: -1.5, max: 1.5, step: 0.05, color: '#f472b6',
    what: 'Your cargo prices off Dated; your hedge is a futures month. The gap between them is a real exposure.',
    hedge: 'DFL — a swap on Dated against ICE Brent, lockable before the oil trades.',
    instrument: 'DFL',
  },
  {
    key: 'freight', label: 'Freight, insurance and losses', min: 0, max: 6, step: 0.05, color: '#34d399',
    what: 'Getting the barrels there, covering them on the way, and the volume that does not arrive.',
    hedge: 'Freight derivatives cover the voyage; insurance covers the cargo. Both are costs you must have booked before you quote.',
    instrument: 'FFA / insurance',
  },
]

export default function PriceToRefiner() {
  const [v, setV] = useState<Record<string, number>>({
    bench: 82.40, diff: -0.55, time: 0.35, dfl: -0.20, freight: 1.85,
  })
  const [sel, setSel] = useState('time')
  const c = COMPS.find(x => x.key === sel)!

  const total = COMPS.reduce((s, x) => s + v[x.key], 0)
  // Everything except the benchmark, as a share of the quote's moving parts.
  const addons = COMPS.filter(x => x.key !== 'bench')
  const spanMax = Math.max(...addons.map(x => Math.abs(v[x.key])), 0.5)

  const usd = (n: number) => (n < 0 ? '−$' : '$') + Math.abs(n).toFixed(2)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">One number, and everything in this module inside it</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        When you quote a physical price to a refiner it bundles up the whole toolkit at once. Click any component to see{' '}
        <strong className="text-slate-200">which instrument hedges it</strong> — and which one does not have an instrument, because
        that is the one you are being paid to carry.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div>
          {/* the build-up */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="space-y-2.5">
              {COMPS.map(x => (
                <div key={x.key}>
                  <button
                    type="button" onClick={() => setSel(x.key)}
                    aria-pressed={sel === x.key}
                    className="mb-1 flex w-full items-baseline justify-between gap-2 text-left"
                  >
                    <span className={`text-xs ${sel === x.key ? 'font-bold' : 'text-slate-300'}`}
                      style={sel === x.key ? { color: x.color } : undefined}>
                      {x.label}
                    </span>
                    <span className="shrink-0 font-mono text-xs font-bold tabular-nums text-white">{usd(v[x.key])}</span>
                  </button>
                  {x.key === 'bench' ? (
                    <div className="h-3 rounded bg-white/[0.05]">
                      <div className="h-full rounded" style={{ width: '100%', backgroundColor: x.color, opacity: 0.6 }} />
                    </div>
                  ) : (
                    // zero-centred: a premium pushes right, a discount left
                    <div className="relative h-3 rounded bg-white/[0.04]">
                      <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
                      <div
                        className="absolute inset-y-0 rounded"
                        style={{
                          backgroundColor: x.color,
                          opacity: 0.7,
                          ...(v[x.key] >= 0
                            ? { left: '50%', width: `${(v[x.key] / spanMax) * 48}%` }
                            : { right: '50%', width: `${(Math.abs(v[x.key]) / spanMax) * 48}%` }),
                        }}
                      />
                    </div>
                  )}
                  <input type="range" min={x.min} max={x.max} step={x.step} value={v[x.key]}
                    onChange={e => setV(s => ({ ...s, [x.key]: parseFloat(e.target.value) }))}
                    onFocus={() => setSel(x.key)}
                    aria-label={x.label}
                    className="mt-1 h-1.5 w-full cursor-pointer"
                    style={{ accentColor: x.color }} />
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-baseline justify-between pt-2.5" style={{ borderTop: '3px double rgba(255,255,255,0.35)' }}>
              <span className="font-mono text-xs font-bold uppercase tracking-wide text-slate-300">Price to the refiner</span>
              <span className="font-mono text-2xl font-bold tabular-nums text-cyan-300">{usd(total)}/bbl</span>
            </div>
            <div className="text-right font-mono text-[10px] text-slate-500">
              on a 700,000 bbl cargo: ${Math.round(total * 700000).toLocaleString('en-US')}
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-xl border p-3.5" style={{ borderColor: c.color + '55', backgroundColor: c.color + '0d' }}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-mono text-sm font-bold" style={{ color: c.color }}>{c.label}</span>
              <span className="rounded px-2 py-0.5 font-mono text-[10px] uppercase"
                style={{ backgroundColor: c.color + '22', color: c.color }}>
                {c.instrument}
              </span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{c.what}</p>
            <p className="mt-2 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-300">
              <strong className="text-slate-100">How you hedge it:</strong> {c.hedge}
            </p>
          </div>

          <div className="rounded-xl border border-amber-500/40 bg-amber-500/[0.08] p-3.5">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-amber-300">
              Four of the five have an instrument
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              Futures take the flat price, CFDs take the time value, the DFL takes the Dated-to-futures gap, and freight
              derivatives and insurance take the voyage. What is left is the{' '}
              <strong className="text-white">grade differential</strong> — and that is not an oversight. It is the position the
              desk exists to hold, and the reason the whole hedging apparatus was built: to strip everything else away so that the
              one risk you understand better than the market is the only one left on the book.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
