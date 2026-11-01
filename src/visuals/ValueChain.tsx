'use client'

import { useState } from 'react'

// The chain, with the thing students forget put back in: the transport and
// storage legs BETWEEN the stages. Those legs are where a trading desk
// actually lives — upstream and downstream are owned by other people.
//
// The product slate fans out at the end, each cut to the consumer that burns
// it, because "refined products" as a single phrase hides the fact that they
// are six different markets with six different demand drivers.

type Stage = {
  key: string
  name: string
  kind: 'stage' | 'link'
  color: string
  what: string
  who: string
  desk: string
}

const CHAIN: Stage[] = [
  {
    key: 'upstream', name: 'Upstream', kind: 'stage', color: '#f59e0b',
    what: 'Exploration and production: finding the oil, drilling it, lifting it to the surface and separating out water and gas.',
    who: 'Majors, national oil companies, independents',
    desk: 'A trading desk rarely owns this. What it buys here is an equity cargo or a term contract, priced off a benchmark months before the barrel exists.',
  },
  {
    key: 'move1', name: 'Transport & storage', kind: 'link', color: '#64748b',
    what: 'Pipeline to the terminal, then tanker to the refinery — with tank farms at each end to decouple the two.',
    who: 'Pipeline operators, shipowners, terminal operators',
    desk: 'THIS is the trading leg. Freight, demurrage, storage economics and the timing option on the cargo all live here, and all of it is cost the desk must carry between buying and selling.',
  },
  {
    key: 'refining', name: 'Refining', kind: 'stage', color: '#22d3ee',
    what: 'Separating crude into cuts, then treating, converting and blending them into products that meet a specification.',
    who: 'Refiners — integrated majors, independents, NOCs',
    desk: 'The refiner is the customer for crude and the supplier of products. Its margin decides whether it runs, and so whether it bids.',
  },
  {
    key: 'move2', name: 'Transport & storage', kind: 'link', color: '#64748b',
    what: 'Product tankers, barges, pipelines and depots moving the slate to where it is sold.',
    who: 'Product shippers, barge operators, depot operators',
    desk: 'The second trading leg, and the one where regional arbitrage lives: the same gas oil is worth different money in Rotterdam, New York and Singapore.',
  },
  {
    key: 'downstream', name: 'Downstream', kind: 'stage', color: '#34d399',
    what: 'Marketing and distribution: wholesale, retail networks, and supply contracts to industrial users.',
    who: 'Retailers, distributors, industrial supply',
    desk: 'The end of the chain, where the price finally stops floating and becomes a pump price or a fixed supply contract.',
  },
]

type Product = { name: string; cut: string; consumer: string; note: string }

const PRODUCTS: Product[] = [
  { name: 'LPG', cut: 'lightest', consumer: 'Petrochemical plants, homes', note: 'Propane and butane — heating and cooking, and a petrochemical feedstock competing with naphtha.' },
  { name: 'Naphtha', cut: 'light', consumer: 'Petrochemical plants', note: 'The plastics feedstock. Its price tracks petrochemical margins, not driving season — which is why it behaves unlike anything else on the barrel.' },
  { name: 'Gasoline', cut: 'light', consumer: 'Cars', note: 'The American barrel. US demand peaks in the summer driving season, and US refineries are configured to maximise it.' },
  { name: 'Jet / kerosene', cut: 'middle', consumer: 'Aircraft', note: 'The cut that vanished in 2020 and took years to come back. Also heating kerosene in parts of Asia.' },
  { name: 'Diesel / gas oil', cut: 'middle', consumer: 'Trucks, industry, heating', note: 'The industrial barrel and the European barrel. Diesel cracks are the best single read on global industrial activity.' },
  { name: 'Fuel oil', cut: 'heaviest', consumer: 'Ships, power stations', note: 'The residue. IMO 2020 split it into high- and low-sulphur overnight and rewrote the economics of the bottom of the barrel.' },
]

export default function ValueChain() {
  const [sel, setSel] = useState('move1')
  const [prod, setProd] = useState<Product | null>(null)
  const st = CHAIN.find(s => s.key === sel)!

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">From the ground to the consumer — and where the desk sits</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Three stages, and — the part students skip — two <strong className="text-slate-200">transport and storage legs</strong>{' '}
        between them. Those legs are where a trading desk actually lives: upstream and downstream belong to other people.
      </p>

      {/* the chain */}
      <div className="flex flex-wrap items-stretch gap-1.5">
        {CHAIN.map((s, i) => (
          <div key={s.key} className="flex flex-1 items-stretch gap-1.5" style={{ minWidth: s.kind === 'link' ? 130 : 110 }}>
            {i > 0 && <div className="flex items-center font-mono text-sm text-slate-600">↓</div>}
            <button
              type="button" onClick={() => setSel(s.key)}
              aria-pressed={sel === s.key}
              className={`flex-1 rounded-lg border px-2.5 py-2 text-left transition-all ${
                sel === s.key ? 'bg-white/[0.08]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
              } ${s.kind === 'link' ? 'border-dashed' : ''}`}
              style={sel === s.key ? { borderColor: s.color + '99' } : undefined}
            >
              <div className="font-mono text-[10px] uppercase tracking-wide" style={{ color: s.color }}>
                {s.kind === 'link' ? 'between' : 'stage'}
              </div>
              <div className="text-xs font-medium text-slate-100">{s.name}</div>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-xl border p-3.5" style={{ borderColor: st.color + '55', backgroundColor: st.color + '0d' }}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-mono text-sm font-bold" style={{ color: st.color }}>{st.name}</span>
          <span className="font-mono text-[11px] text-slate-400">{st.who}</span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{st.what}</p>
        <p className="mt-2 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-400">
          <strong className="text-slate-200">Where the desk sits:</strong> {st.desk}
        </p>
      </div>

      {/* the slate */}
      <div className="mt-4 border-t border-white/10 pt-3.5">
        <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
          Out the far end: one barrel, six markets
        </div>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-6">
          {PRODUCTS.map(p => (
            <button
              key={p.name} type="button" onClick={() => setProd(prod?.name === p.name ? null : p)}
              aria-pressed={prod?.name === p.name}
              className={`rounded-lg border px-2 py-2 text-left transition-all ${
                prod?.name === p.name ? 'border-cyan-400/60 bg-cyan-400/[0.10]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
              }`}
            >
              <div className="font-mono text-[9px] uppercase tracking-wide text-slate-500">{p.cut}</div>
              <div className="text-[11px] font-medium text-slate-100">{p.name}</div>
              <div className="font-mono text-[9px] leading-tight text-slate-500">{p.consumer}</div>
            </button>
          ))}
        </div>
        <div className="mt-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs leading-relaxed">
          {prod ? (
            <>
              <span className="font-mono font-bold text-cyan-300">{prod.name}</span>
              <span className="ml-2 text-slate-300">{prod.note}</span>
            </>
          ) : (
            <span className="text-slate-500">
              Click a product. They are not one market — gasoline follows the American driving season, naphtha follows petrochemical
              margins, and diesel follows global industry. The same barrel feeds all three.
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
