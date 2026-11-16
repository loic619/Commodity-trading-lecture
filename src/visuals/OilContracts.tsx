'use client'

import { useState } from 'react'

// The contract table, made sortable and filterable — and with the two things
// that actually bite a hedger pulled out: whether it settles in cash or in
// barrels, and how early the expiry falls relative to the delivery month.
//
// The ICE Brent M-2 expiry is the trap. A hedger covering July barrels is
// trading a contract that dies at the end of May.

type Contract = {
  name: string
  venue: string
  quality: string
  delivery: string
  expiry: string
  monthsBefore: 0 | 1 | 2
  lot: string
  bbl: number | null
  cash: boolean
  kind: 'crude' | 'product'
  note: string
}

const CONTRACTS: Contract[] = [
  { name: 'Nymex WTI', venue: 'CME', quality: 'Light sweet', delivery: 'Cushing, OK', expiry: '20th', monthsBefore: 1, lot: '1,000 bbl', bbl: 1000, cash: false, kind: 'crude', note: 'Physically delivered at an inland tank farm. That is what made negative prices possible in April 2020 — holders of an expiring contract had nowhere to put the oil.' },
  { name: 'ICE WTI', venue: 'ICE', quality: 'Light sweet', delivery: 'Cushing, OK', expiry: '19th', monthsBefore: 1, lot: '1,000 bbl', bbl: 1000, cash: true, kind: 'crude', note: 'The same underlying as Nymex WTI, but CASH-SETTLED against it — no delivery obligation, which is why many financial participants prefer it.' },
  { name: 'ICE Brent', venue: 'ICE', quality: 'North Sea', delivery: 'North Sea', expiry: '30th', monthsBefore: 2, lot: '1,000 bbl', bbl: 1000, cash: true, kind: 'crude', note: 'The world benchmark, and cash-settled. Note the M-2 expiry: the July contract dies at the end of MAY. Hedge a July cargo and you are already trading a contract two months ahead of your barrels.' },
  { name: 'DME Oman', venue: 'DME', quality: 'Oman crude', delivery: 'Oman', expiry: '31st', monthsBefore: 2, lot: '1,000 bbl', bbl: 1000, cash: false, kind: 'crude', note: 'Physically delivered, and the main exchange-traded route into a medium sour Middle Eastern barrel.' },
  { name: 'IFAD Murban', venue: 'IFAD', quality: 'Murban', delivery: 'Fujairah', expiry: '31st', monthsBefore: 2, lot: '1,000 bbl', bbl: 1000, cash: false, kind: 'crude', note: 'The newest of them. Abu Dhabi moved Murban onto its own exchange to price it directly rather than as a differential to someone else’s benchmark.' },
  { name: 'ICE Gasoil', venue: 'ICE', quality: 'Heating oil', delivery: 'ARA', expiry: '12th', monthsBefore: 0, lot: '100 MT', bbl: null, cash: false, kind: 'product', note: 'The European distillate benchmark — and the odd one out on units: 100 METRIC TONNES, not barrels. Size a diesel hedge in barrels here and you will be out by a factor of about 7.45.' },
  { name: 'Nymex Heating Oil', venue: 'CME', quality: 'Heating oil', delivery: 'New York Harbour', expiry: '31st', monthsBefore: 1, lot: '42,000 gal', bbl: 1000, cash: false, kind: 'product', note: 'US distillate, quoted in cents per gallon. 42,000 gallons is 1,000 barrels — the same clip as crude, in different clothes.' },
  { name: 'Nymex RBOB', venue: 'CME', quality: 'Gasoline blendstock', delivery: 'New York Harbour', expiry: '31st', monthsBefore: 1, lot: '42,000 gal', bbl: 1000, cash: false, kind: 'product', note: 'The US gasoline contract. Blendstock, not finished gasoline — it is blended with ethanol downstream, which is why the specification says RBOB.' },
  { name: 'ICE WTI Midland', venue: 'ICE', quality: 'Permian WTI', delivery: 'USGC', expiry: '22nd', monthsBefore: 1, lot: '1,000 bbl', bbl: 1000, cash: false, kind: 'crude', note: 'Waterborne WTI at the Gulf Coast — exportable, unlike Cushing. This is the grade that joined the Brent basket, which is how American crude ended up inside the world’s benchmark.' },
  { name: 'INE Shanghai', venue: 'INE', quality: 'Medium sour', delivery: 'Shanghai', expiry: '31st', monthsBefore: 1, lot: '1,000 bbl', bbl: 1000, cash: false, kind: 'crude', note: 'Priced in YUAN and deliverable into bonded Chinese storage — the one major crude contract not denominated in dollars.' },
]

type Filter = 'all' | 'crude' | 'products' | 'cash'

export default function OilContracts() {
  const [sel, setSel] = useState('ICE Brent')
  const [filter, setFilter] = useState<Filter>('all')
  const [lots, setLots] = useState(700)

  const shown = CONTRACTS.filter(c =>
    filter === 'all' ? true
      : filter === 'cash' ? c.cash
        : filter === 'products' ? c.kind === 'product'
          : c.kind === 'crude')

  // If a filter hides the selected contract, fall back to the first visible one
  // rather than rendering a panel for a row that is no longer on screen.
  const c = shown.find(x => x.name === sel) ?? shown[0] ?? CONTRACTS[0]
  const volume = c.bbl ? `${(lots * c.bbl).toLocaleString('en-US')} bbl` : `${(lots * 100).toLocaleString('en-US')} MT`

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">The contracts a hedger actually works with</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        Ten contracts, and two columns that decide whether a hedge works: whether it settles in{' '}
        <strong className="text-slate-200">cash or in barrels</strong>, and{' '}
        <strong className="text-slate-200">how early it expires</strong> relative to the month it is named after.
      </p>

      <div className="mb-2 flex flex-wrap gap-1.5" role="group" aria-label="Filter">
        {([['all', 'All ten'], ['crude', 'Crude only'], ['products', 'Products only'], ['cash', 'Cash-settled']] as const).map(([k, label]) => (
          <button
            key={k} type="button" onClick={() => setFilter(k as Filter)}
            aria-pressed={filter === k}
            className={`rounded-full border px-3 py-1 font-mono text-[11px] font-bold transition-all ${
              filter === k ? 'border-cyan-400/60 bg-cyan-400/15 text-cyan-100' : 'border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <div className="grid grid-cols-[1.4fr_1.2fr_1fr_0.9fr_0.8fr] gap-2 border-b border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-[10px] uppercase tracking-wide text-slate-400">
          <span>Contract</span><span>Quality</span><span>Delivery</span><span>Expiry</span><span>Lot</span>
        </div>
        {shown.map(x => (
          <button
            key={x.name} type="button" onClick={() => setSel(x.name)}
            aria-pressed={c.name === x.name}
            className={`grid w-full grid-cols-[1.4fr_1.2fr_1fr_0.9fr_0.8fr] items-center gap-2 border-b border-white/[0.05] px-3 py-2 text-left transition-all last:border-0 ${
              c.name === x.name ? 'bg-cyan-400/[0.10]' : 'hover:bg-white/[0.04]'
            }`}
          >
            <span className={`text-xs font-medium ${c.name === x.name ? 'text-cyan-300' : 'text-slate-200'}`}>
              {x.name}
              {x.cash && <span className="ml-1.5 rounded bg-violet-400/20 px-1 py-0.5 font-mono text-[9px] uppercase text-violet-200">cash</span>}
            </span>
            <span className="font-mono text-[11px] text-slate-400">{x.quality}</span>
            <span className="font-mono text-[11px] text-slate-400">{x.delivery}</span>
            <span className="font-mono text-[11px] text-slate-300">
              {x.expiry}
              <span className={x.monthsBefore === 2 ? 'text-amber-300' : 'text-slate-500'}>
                {x.monthsBefore ? ` M−${x.monthsBefore}` : ' M'}
              </span>
            </span>
            <span className="font-mono text-[11px] text-slate-300">{x.lot}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-cyan-400/40 bg-cyan-400/[0.08] p-3.5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-mono text-sm font-bold text-cyan-300">{c.name}</span>
            <span className="font-mono text-[11px] text-slate-400">{c.venue}</span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{c.note}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
          <div className="mb-1.5 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">Size a hedge</div>
          <div className="mb-1 flex justify-between font-mono text-xs">
            <span className="text-slate-400">Lots</span>
            <span className="font-bold tabular-nums text-white">{lots}</span>
          </div>
          <input type="range" min={1} max={1500} step={1} value={lots}
            onChange={e => setLots(parseInt(e.target.value, 10))}
            aria-label="Number of lots"
            className="h-1.5 w-full cursor-pointer accent-brand-cyan" />
          <p className="mt-2 font-mono text-sm tabular-nums text-slate-200">
            {lots} × {c.lot} = <strong className="text-cyan-300">{volume}</strong>
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
            {c.bbl
              ? 'A 700,000 bbl North Sea cargo is 700 lots — the worked example in the next section.'
              : 'Watch the unit. ICE Gasoil is the only one here sized in tonnes, so a hedge sized in barrels would be wrong by the density factor.'}
          </p>
        </div>
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-slate-400">
        Two things worth memorising. <strong className="text-violet-200">ICE Brent and ICE WTI settle in cash</strong> — there is no
        truck of crude at the end, only a settlement against the index. And <strong className="text-amber-200">Brent expires
        M−2</strong>: the July contract dies at the end of May, so a hedger covering July barrels is already two months ahead of the
        oil. That gap is timing risk, and it is the first of the two residuals the rest of this module exists to manage.
      </p>
    </div>
  )
}
