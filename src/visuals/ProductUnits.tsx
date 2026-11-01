'use client'

import { useState } from 'react'

// The unit minefield, as a live converter — because the arithmetic is the
// lesson and a static table lets students skip it.
//
// The trap: barrels per tonne varies BY PRODUCT, so the same $/MT number means
// a different $/bbl depending on what is in the tank. Lighter product, more
// barrels per tonne, lower $/bbl for the same $/MT.

const GAL_PER_BBL = 42

type Prod = { key: string; name: string; bblPerMt: number; quoted: string; note: string }

const PRODUCTS: Prod[] = [
  { key: 'brent', name: 'Brent crude', bblPerMt: 7.55, quoted: '$/bbl worldwide', note: 'Crude is the easy one: everyone quotes it in dollars a barrel, everywhere.' },
  { key: 'dubai', name: 'Dubai crude', bblPerMt: 7.30, quoted: '$/bbl worldwide', note: 'Heavier than Brent, so fewer barrels to the tonne — the conversion factor is itself a density measurement.' },
  { key: 'naphtha', name: 'Naphtha', bblPerMt: 8.90, quoted: '$/MT', note: 'The lightest cut on the list and so the most barrels per tonne. Naphtha is quoted in tonnes almost everywhere, including Asia.' },
  { key: 'gasoline', name: 'Gasoline', bblPerMt: 8.33, quoted: '¢/gal in the US, $/MT in Europe', note: 'The product where the regional convention gap bites hardest: a US trader thinks in cents a gallon and a European one in dollars a tonne, for the identical cargo.' },
  { key: 'jet', name: 'Jet / kerosene', bblPerMt: 7.90, quoted: '$/bbl or $/MT, by region', note: 'Quoted in barrels in the US and the Gulf, tonnes in Europe. Jet cargoes cross those regions constantly, so the conversion is a daily habit.' },
  { key: 'gasoil', name: 'Gas oil / diesel', bblPerMt: 7.45, quoted: '$/MT in Europe, ¢/gal in the US', note: 'The ICE Gasoil contract settles in $/MT while NYMEX ULSD settles in ¢/gal — the same molecule, two exchanges, two units.' },
  { key: 'fueloil', name: 'Fuel oil', bblPerMt: 6.35, quoted: '$/MT worldwide', note: 'The heaviest, so the fewest barrels per tonne. Fuel oil is a tonnes market everywhere, which is why bunker prices are always quoted per tonne.' },
]

const MARKETS = [
  { name: 'US Gulf & East Coast', unit: '¢/gallon', note: 'the gasoline and diesel benchmark markets' },
  { name: 'NWE / ARA', unit: '$/MT', note: 'Amsterdam–Rotterdam–Antwerp, the European barge hub' },
  { name: 'Mediterranean', unit: '$/MT', note: 'cargoes basis Italy, feeding Southern Europe and North Africa' },
  { name: 'Asia-Pacific', unit: 'mixed', note: 'Singapore — $/bbl for some cuts, $/MT for fuel oil and naphtha' },
]

export default function ProductUnits() {
  const [sel, setSel] = useState('gasoil')
  const [perMt, setPerMt] = useState(700)
  const p = PRODUCTS.find(x => x.key === sel)!

  const perBbl = perMt / p.bblPerMt
  const centsPerGal = (perBbl / GAL_PER_BBL) * 100

  // What the same $/MT figure is worth as $/bbl across the slate — the trap.
  const spread = PRODUCTS.map(x => ({ x, v: perMt / x.bblPerMt }))
  const lo = Math.min(...spread.map(s => s.v))
  const hi = Math.max(...spread.map(s => s.v))

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">The unit minefield — four markets, three conventions</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        Crude is <strong className="text-slate-200">$/bbl</strong> everywhere. Products are not: Europe quotes{' '}
        <strong className="text-slate-200">$/MT</strong>, the US quotes <strong className="text-slate-200">¢/gallon</strong>, and
        Asia mixes the two. Convert fluently or get the arithmetic wrong.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
        <div>
          <div className="mb-2 flex flex-wrap gap-1.5" role="group" aria-label="Product">
            {PRODUCTS.map(x => (
              <button
                key={x.key} type="button" onClick={() => setSel(x.key)}
                aria-pressed={sel === x.key}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all ${
                  sel === x.key ? 'border-cyan-400/60 bg-cyan-400/15 text-cyan-100' : 'border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                {x.name}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
            <div className="mb-1 flex justify-between font-mono text-xs">
              <span className="text-cyan-300">Price ($/MT)</span>
              <span className="font-bold tabular-nums text-white">${perMt}</span>
            </div>
            <input type="range" min={200} max={1200} step={5} value={perMt}
              onChange={e => setPerMt(parseFloat(e.target.value))}
              aria-label="Price in dollars per tonne"
              className="h-2 w-full cursor-pointer accent-brand-cyan" />

            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/10 pt-3">
              {[
                { u: '$ / MT', v: `$${perMt}`, c: '#22d3ee' },
                { u: '$ / bbl', v: `$${perBbl.toFixed(2)}`, c: '#34d399' },
                { u: '¢ / gallon', v: `${centsPerGal.toFixed(1)}¢`, c: '#f59e0b' },
              ].map(o => (
                <div key={o.u} className="rounded-lg border border-white/10 bg-black/20 px-2 py-2 text-center">
                  <div className="font-mono text-[10px] uppercase tracking-wide" style={{ color: o.c }}>{o.u}</div>
                  <div className="font-mono text-lg font-bold tabular-nums text-white">{o.v}</div>
                </div>
              ))}
            </div>

            <p className="mt-2.5 border-t border-white/10 pt-2 font-mono text-[11px] leading-relaxed text-slate-400">
              ${perMt}/MT ÷ <strong className="text-white">{p.bblPerMt}</strong> bbl/MT = ${perBbl.toFixed(2)}/bbl ÷ {GAL_PER_BBL} gal
              = {centsPerGal.toFixed(1)}¢/gal
            </p>
          </div>

          <div className="mt-2.5 rounded-xl border border-cyan-400/40 bg-cyan-400/[0.08] p-3">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-cyan-300">{p.name}</div>
            <div className="font-mono text-[11px] text-slate-400">usually quoted: {p.quoted}</div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{p.note}</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {/* the trap, made visible */}
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/[0.08] p-3.5">
            <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-amber-300">
              The same ${perMt}/MT, across the slate
            </div>
            <div className="space-y-1">
              {spread.map(s => (
                <div key={s.x.key} className="flex items-baseline gap-2">
                  <span className={`w-28 shrink-0 text-[11px] ${s.x.key === sel ? 'text-cyan-300' : 'text-slate-400'}`}>{s.x.name}</span>
                  <span className="flex-1">
                    <span className="block h-1.5 rounded bg-white/[0.06]">
                      <span className="block h-full rounded" style={{
                        width: `${((s.v - lo) / (hi - lo)) * 90 + 10}%`,
                        backgroundColor: s.x.key === sel ? '#22d3ee' : '#f59e0b',
                        opacity: s.x.key === sel ? 0.9 : 0.5,
                      }} />
                    </span>
                  </span>
                  <span className={`w-20 text-right font-mono text-[11px] tabular-nums ${s.x.key === sel ? 'font-bold text-white' : 'text-slate-400'}`}>
                    ${s.v.toFixed(2)}/bbl
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-300">
              One tonne price, a <strong className="text-white">${(hi - lo).toFixed(2)}/bbl</strong> spread in what it means —
              purely because density differs. Lighter product, more barrels to the tonne, lower dollars per barrel. Quote the wrong
              factor on a 30,000 t cargo and the error is six figures.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">Four regional markets</div>
            <div className="space-y-1.5">
              {MARKETS.map(m => (
                <div key={m.name} className="flex items-baseline justify-between gap-2 border-b border-white/[0.05] pb-1.5 last:border-0">
                  <span className="text-xs text-slate-200">
                    {m.name}
                    <span className="block font-mono text-[10px] text-slate-500">{m.note}</span>
                  </span>
                  <span className="shrink-0 rounded bg-white/[0.08] px-2 py-0.5 font-mono text-[10px] text-slate-300">{m.unit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
