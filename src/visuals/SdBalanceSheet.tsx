'use client'

import { useState } from 'react'

// The S&D balance presented the way an accountant would: SOURCES of tons on
// the left, USES of tons on the right, and the two sides forced to equal —
// the question is never whether it balances, but WHICH line does the
// adjusting. Click any line to open its driver tree (after the instructor's
// interaction map — supply & demand sides).
// Numbers: world coffee 2024/25, USDA FAS Dec-2024 vintage, million 60-kg bags.
type Row = {
  key: string
  label: string
  value: string
  sub?: string
  color: string
  drivers: { title: string; items: string[] }[]
  note: string
}

const SUPPLY: Row[] = [
  {
    key: 'carry-in', label: 'Beginning stocks (carry-in)', value: '14.1', color: '#22d3ee',
    sub: 'what was kept from last year',
    drivers: [
      { title: 'Where last year’s coffee sits', items: [
        'Farmer’s stock — held back at origin: do farmers NEED to sell (financing pressure), and do they LIKE the price?',
        'Visible origin stocks — warehouses at origin, exporters’ inventory',
        'Destination stocks — roasters’ and importers’ pipeline in consuming countries',
      ] },
    ],
    note: 'The least visible line of the sheet: farmer-held stock is estimated, not counted — which is why carry-in is where balance sheets get revised years later.',
  },
  {
    key: 'production', label: 'Production', value: '174.9', color: '#34d399',
    sub: 'Brazil 66.4 · Vietnam 30.1 · others 78.4',
    drivers: [
      { title: 'Hectares planted — how much land?', items: [
        'Cheap cost of land vs alternatives',
        'Opportunity cost vs other crops → expected PROFITABILITY: cost of production against the benchmark price of competing crops',
      ] },
      { title: '× Trees per hectare — how dense?', items: [
        'Planting density choices',
        '% of the hectare inter-cropped (coffee sharing the field with pepper, avocado…)',
        'Tree age — young trees not yet bearing, old trees declining',
      ] },
      { title: '× Yield per tree — how much each?', items: [
        'Weather through flowering and cherry-fill',
        'Fertilizer application (input prices decide it)',
        'Increasing usage of irrigation',
        'Genetic variety planted',
        'Disease & insect damage',
        'Harvest mechanics: ripe-cherry ratio, cherry→green conversion ratio, early/late harvest (early dry weather; matching the pre-harvest market price)',
      ] },
    ],
    note: 'Production = hectares × trees/hectare × yield/tree — and every driver above moves one of the three factors. An analyst’s crop estimate is just this multiplication, origin by origin.',
  },
]

const DEMAND: Row[] = [
  {
    key: 'consumption', label: 'Consumption', value: '168.1', color: '#f59e0b',
    sub: 'destination + origin countries',
    drivers: [
      { title: 'The consumption multiplication', items: [
        'Population growth in consuming countries',
        '× Cups per capita — the habit itself',
        '× Grams per cup — espresso vs filter vs instant',
        '× Blend / product mix — how much robusta vs arabica goes into what is drunk',
      ] },
      { title: 'What bends those factors', items: [
        'Purchasing power — inflation vs wages: coffee is a luxury in low-income markets, a staple in rich ones',
        'Coffee culture — capsules, specialty, out-of-home vs at-home',
        'Split the total: DESTINATION consumption (importing countries) vs ORIGIN consumption (Brazil is a top-2 consumer of its own coffee)',
      ] },
    ],
    note: 'Demand moves slowly but almost never backwards — the only annual declines in decades came from price shocks and 2020. That inertia is why supply does most of the price-setting.',
  },
  {
    key: 'carry-out', label: 'Ending stocks (carry-out)', value: '20.9', color: '#f43f5e',
    sub: 'the balancing line',
    drivers: [
      { title: 'The residual, not a choice', items: [
        'Ending stocks = total available − consumption: whatever is left',
        'It becomes NEXT year’s beginning stocks — this sheet chains into the next one',
        'A thin carry-out = no cushion: the next weather headline meets a market that cannot absorb it (the 2024/25 backdrop, and the spike you will trade on the live screen)',
      ] },
    ],
    note: 'Watch this line across YEARS, not in isolation: three consecutive drawdowns tell you more than any single number.',
  },
]

const fmtTotal = (rows: Row[]) => rows.reduce((s, r) => s + parseFloat(r.value), 0).toFixed(1)

export default function SdBalanceSheet() {
  const [sel, setSel] = useState<Row>(SUPPLY[1])

  const column = (title: string, subtitle: string, rows: Row[], totalLabel: string) => (
    <div className="rounded-xl border border-white/10 bg-white/[0.02]">
      <div className="border-b border-white/10 p-3">
        <div className="font-mono text-[11px] font-bold uppercase tracking-wide text-slate-200">{title}</div>
        <div className="font-mono text-[10px] text-slate-500">{subtitle}</div>
      </div>
      <div>
        {rows.map(r => (
          <button key={r.key} type="button" onClick={() => setSel(r)}
            className={`flex w-full items-baseline justify-between gap-2 border-b border-white/[0.05] px-3 py-2.5 text-left transition-all ${
              sel.key === r.key ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
            }`}>
            <span>
              <span className="text-xs font-medium" style={{ color: sel.key === r.key ? r.color : '#cbd5e1' }}>{r.label}</span>
              {r.sub && <span className="block font-mono text-[10px] text-slate-500">{r.sub}</span>}
            </span>
            <span className="font-mono text-sm font-bold tabular-nums text-slate-200">{r.value}</span>
          </button>
        ))}
        {/* accounting double rule on the total */}
        <div className="flex items-baseline justify-between px-3 py-2.5" style={{ borderTop: '3px double rgba(255,255,255,0.35)' }}>
          <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-slate-300">{totalLabel}</span>
          <span className="font-mono text-sm font-bold tabular-nums text-cyan-300">{fmtTotal(rows)}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-1 eyebrow text-brand-cyan">The coffee balance sheet — world 2024/25, million 60-kg bags</div>
      <p className="mb-3 text-xs leading-relaxed text-slate-400">
        Sources of tons on the left, uses on the right — and the two sides MUST equal, like any balance sheet.
        Click a line to open its drivers (the interaction map behind every crop estimate).
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {column('Sources — how many tons are available?', 'supply side', SUPPLY, 'Total available')}
        {column('Uses — where do the tons go?', 'demand side', DEMAND, 'Total accounted')}
      </div>

      {/* the balancing identity */}
      <div className="mt-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-center font-mono text-[11px] text-slate-400">
        14.1 + 174.9 = <span className="font-bold text-cyan-300">189.0</span> = 168.1 + 20.9 — the sheet always balances:
        the question is <span className="font-bold text-slate-200">which line does the adjusting</span> (in a tight year: the carry-out).
      </div>

      {/* driver tree for the selected line */}
      <div className="mt-3 rounded-xl border p-3.5" style={{ borderColor: sel.color + '55', backgroundColor: sel.color + '0d' }}>
        <div className="font-mono text-xs font-bold" style={{ color: sel.color }}>{sel.label} — the drivers</div>
        <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
          {sel.drivers.map((d, i) => (
            <div key={i} className={sel.drivers.length === 1 ? 'md:col-span-3' : sel.drivers.length === 2 && i === 1 ? 'md:col-span-2' : ''}>
              <div className="mb-1 text-[11px] font-bold text-slate-200">{d.title}</div>
              <ul className="space-y-1">
                {d.items.map((it, j) => (
                  <li key={j} className="flex items-baseline gap-2 text-[11px] leading-relaxed text-slate-300">
                    <span className="shrink-0 font-mono text-[10px]" style={{ color: sel.color }}>▸</span>{it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-2.5 border-t border-white/10 pt-2 text-[11px] leading-relaxed text-slate-400">{sel.note}</p>
      </div>
    </div>
  )
}
