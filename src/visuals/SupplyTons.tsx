'use client'

import { useState } from 'react'

// The supply side as the multiplication it actually is. Students read
// "production" as one number; the point of this visual is that it is three
// factors with completely different clocks — hectares move over years, density
// over seasons, yield within weeks — plus a carry-in nobody can count.
//
// Anchor numbers: Vietnam robusta, a normal year. 650k ha x 1,100 trees/ha x
// 2.5 kg green/tree = 1.79 Mt = ~29.8 m 60-kg bags, which is about where
// Vietnam actually lands. Carry-in default 3.0 m bags.

const KG_PER_BAG = 60

type Factor = {
  key: 'hectares' | 'density' | 'yield' | 'carryIn'
  label: string
  unit: string
  min: number
  max: number
  step: number
  fmt: (v: number) => string
  color: string
  clock: string
  drivers: string[]
}

const FACTORS: Factor[] = [
  {
    key: 'hectares',
    label: 'Hectares planted',
    unit: 'ha',
    min: 450_000, max: 850_000, step: 10_000,
    fmt: v => (v / 1000).toFixed(0) + 'k ha',
    color: '#22d3ee',
    clock: 'Moves over YEARS — a replanting decision shows up in the crop three to four seasons later.',
    drivers: [
      'Is land cheap, and is there any left to plant?',
      'Opportunity cost against competing crops — expected profitability of coffee vs pepper, durian, avocado, rubber',
      'Cost of production against the benchmark price of the competing crop',
      'Government or co-operative replanting programmes',
      'Urban encroachment and generational exit from farming',
    ],
  },
  {
    key: 'density',
    label: 'Trees per hectare',
    unit: 'trees/ha',
    min: 800, max: 1500, step: 25,
    fmt: v => v.toLocaleString('en-US') + ' trees',
    color: '#34d399',
    clock: 'Moves over SEASONS — density and the age pyramid are the slow, structural part of a crop.',
    drivers: [
      'Planting density chosen at establishment',
      'Share of the hectare inter-cropped — coffee sharing the field with pepper or avocado',
      'Age profile: young trees not yet bearing, mature trees at peak, old trees declining',
      'Stumping and rejuvenation cycles — a stumped tree yields nothing for two years, then more',
      'Replacement rate after disease or drought losses',
    ],
  },
  {
    key: 'yield',
    label: 'Yield per tree',
    unit: 'kg green',
    min: 1.2, max: 3.6, step: 0.05,
    fmt: v => v.toFixed(2) + ' kg',
    color: '#f59e0b',
    clock: 'Moves WITHIN THE SEASON — this is the factor every weather headline is really about.',
    drivers: [
      'Weather through flowering and cherry-fill — the single biggest swing factor',
      'Fertiliser application, which input prices decide for the farmer',
      'Irrigation — increasingly common, and it decouples yield from rainfall',
      'Genetic variety planted',
      'Disease and insect damage',
      'Harvest mechanics: ripe-cherry ratio, cherry-to-green conversion ratio',
      'Early or late harvest — early dry weather, or farmers matching the pre-harvest market price',
    ],
  },
  {
    key: 'carryIn',
    label: 'Carry-in',
    unit: 'm bags',
    min: 0, max: 9, step: 0.5,
    fmt: v => v.toFixed(1) + ' m bags',
    color: '#8b5cf6',
    clock: 'Not produced at all — it is last year’s coffee, and it is ESTIMATED, not counted.',
    drivers: [
      'Farmer’s stock held back at origin — do farmers NEED to sell (financing pressure), and do they LIKE the price?',
      'Visible origin stocks — exporters’ warehouses at origin',
      'Destination stocks — roasters’ and importers’ pipeline in consuming countries',
      'Certified exchange stocks, the only genuinely published number of the three',
    ],
  },
]

function Slider({ f, value, onChange, active, onFocus }: {
  f: Factor; value: number; onChange: (v: number) => void; active: boolean; onFocus: () => void
}) {
  return (
    <div
      className={`rounded-lg border p-3 transition-all ${active ? 'bg-white/[0.06]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'}`}
      style={active ? { borderColor: f.color + '77' } : undefined}
    >
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <button type="button" onClick={onFocus} className="text-left text-sm font-medium" style={{ color: active ? f.color : '#cbd5e1' }}>
          {f.label}
        </button>
        <span className="font-mono text-sm font-bold tabular-nums text-white">{f.fmt(value)}</span>
      </div>
      <input
        type="range" min={f.min} max={f.max} step={f.step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        onFocus={onFocus}
        aria-label={`${f.label} (${f.unit})`}
        className="h-1.5 w-full cursor-pointer"
        style={{ accentColor: f.color }}
      />
    </div>
  )
}

export default function SupplyTons() {
  const [hectares, setHectares] = useState(650_000)
  const [density, setDensity] = useState(1100)
  const [yieldTree, setYieldTree] = useState(2.5)
  const [carryIn, setCarryIn] = useState(3)
  const [sel, setSel] = useState<Factor['key']>('yield')

  const factor = FACTORS.find(f => f.key === sel)!

  // Production in kg → tonnes → million 60-kg bags.
  const prodKg = hectares * density * yieldTree
  const prodMt = prodKg / 1e9                       // million tonnes
  const prodBags = prodKg / KG_PER_BAG / 1e6        // million bags
  const available = prodBags + carryIn

  // Sensitivity: what a 10% cut in the selected factor costs, in bags.
  const scale = (k: Factor['key'], mult: number) => {
    const h = k === 'hectares' ? hectares * mult : hectares
    const d = k === 'density' ? density * mult : density
    const y = k === 'yield' ? yieldTree * mult : yieldTree
    const c = k === 'carryIn' ? carryIn * mult : carryIn
    return (h * d * y) / KG_PER_BAG / 1e6 + c
  }
  const shock = available - scale(sel, 0.9)

  const value = (k: Factor['key']) =>
    k === 'hectares' ? hectares : k === 'density' ? density : k === 'yield' ? yieldTree : carryIn
  const setValue = (k: Factor['key']) =>
    k === 'hectares' ? setHectares : k === 'density' ? setDensity : k === 'yield' ? setYieldTree : setCarryIn

  const chain = FACTORS.slice(0, 3)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">The supply multiplication — Vietnam robusta, a normal year</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Supply is one question asked twice: how much did we <strong className="text-slate-200">keep</strong>, and how much did we{' '}
        <strong className="text-slate-200">produce</strong> — and production is a product of three factors. Click a factor to see what
        drives it; drag it to see what it is worth in bags.
      </p>

      {/* the equation, as boxes */}
      <div className="flex flex-wrap items-stretch gap-2">
        {chain.map((f, i) => (
          <div key={f.key} className="flex items-stretch gap-2">
            {i > 0 && <div className="flex items-center font-mono text-lg text-slate-500">×</div>}
            <button
              type="button" onClick={() => setSel(f.key)}
              className={`min-w-[120px] flex-1 rounded-lg border px-3 py-2 text-left transition-all ${
                sel === f.key ? 'bg-white/[0.07]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
              }`}
              style={sel === f.key ? { borderColor: f.color + '88' } : undefined}
            >
              <div className="font-mono text-[11px] uppercase tracking-wide" style={{ color: f.color }}>{f.label}</div>
              <div className="font-mono text-base font-bold tabular-nums text-white">{f.fmt(value(f.key))}</div>
            </button>
          </div>
        ))}
        <div className="flex items-center font-mono text-lg text-slate-500">=</div>
        <div className="min-w-[140px] flex-1 rounded-lg border border-cyan-400/40 bg-cyan-400/[0.08] px-3 py-2">
          <div className="font-mono text-[11px] uppercase tracking-wide text-cyan-300">Production</div>
          <div className="font-mono text-base font-bold tabular-nums text-white">{prodBags.toFixed(1)} m bags</div>
          <div className="font-mono text-[10px] text-slate-400">{prodMt.toFixed(2)} Mt green</div>
        </div>
      </div>

      {/* plus the carry-in */}
      <div className="mt-2 flex flex-wrap items-stretch gap-2">
        <div className="flex items-center font-mono text-lg text-slate-500">+</div>
        <button
          type="button" onClick={() => setSel('carryIn')}
          className={`min-w-[150px] rounded-lg border px-3 py-2 text-left transition-all ${
            sel === 'carryIn' ? 'bg-white/[0.07]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
          }`}
          style={sel === 'carryIn' ? { borderColor: '#8b5cf688' } : undefined}
        >
          <div className="font-mono text-[11px] uppercase tracking-wide text-violet-300">Carry-in</div>
          <div className="font-mono text-base font-bold tabular-nums text-white">{carryIn.toFixed(1)} m bags</div>
          <div className="font-mono text-[10px] text-slate-400">last year’s, estimated</div>
        </button>
        <div className="flex items-center font-mono text-lg text-slate-500">=</div>
        <div className="flex-1 rounded-lg border px-3 py-2" style={{ borderColor: 'rgba(255,255,255,0.35)', borderTopWidth: 3, borderTopStyle: 'double' }}>
          <div className="font-mono text-[11px] uppercase tracking-wide text-slate-300">Total available</div>
          <div className="font-mono text-base font-bold tabular-nums text-cyan-300">{available.toFixed(1)} m bags</div>
          <div className="font-mono text-[10px] text-slate-400">the left-hand side of the balance sheet</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* sliders */}
        <div className="space-y-2">
          {FACTORS.map(f => (
            <Slider
              key={f.key} f={f} value={value(f.key)} onChange={setValue(f.key)}
              active={sel === f.key} onFocus={() => setSel(f.key)}
            />
          ))}
        </div>

        {/* drivers of the selected factor */}
        <div className="rounded-xl border p-3.5" style={{ borderColor: factor.color + '55', backgroundColor: factor.color + '0d' }}>
          <div className="font-mono text-sm font-bold" style={{ color: factor.color }}>{factor.label} — what drives it</div>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">{factor.clock}</p>
          <ul className="mt-2.5 space-y-1.5">
            {factor.drivers.map((d, i) => (
              <li key={i} className="flex items-baseline gap-2 text-xs leading-relaxed text-slate-300">
                <span className="shrink-0 font-mono" style={{ color: factor.color }}>▸</span>{d}
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-white/10 pt-2 font-mono text-xs leading-relaxed text-slate-300">
            A <strong className="text-white">10% cut</strong> in {factor.label.toLowerCase()} costs{' '}
            <strong style={{ color: factor.color }}>{shock.toFixed(1)} m bags</strong>
            {sel !== 'carryIn' && <> — that is {(shock / Math.max(carryIn, 0.1)).toFixed(1)}× the entire carry-in.</>}
          </p>
        </div>
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-slate-400">
        This is the whole discipline: every supply headline on the futures screen is a sentence about <strong className="text-slate-200">one</strong> of
        these factors. Knowing which one tells you instantly how many bags the headline is worth — and how long it will take to arrive.
      </p>
    </div>
  )
}
