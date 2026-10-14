'use client'

import { useState } from 'react'

// The demand side as its own multiplication — and the lesson is the contrast
// with supply: the same four-factor arithmetic, but every factor here moves in
// single-digit percents per decade. Demand almost never explains a price move.
//
// Anchor numbers: world 2024/25. 8.1 bn people x 125 cups/person/year x 10 g
// green per cup = 10.1 Mt = ~169 m 60-kg bags, which is about where world
// consumption actually sits. Robusta is ~40% of the blend.

const KG_PER_BAG = 60

type Factor = {
  key: 'population' | 'cups' | 'grams' | 'robusta'
  label: string
  unit: string
  min: number
  max: number
  step: number
  fmt: (v: number) => string
  color: string
  inertia: string
  drivers: string[]
}

const FACTORS: Factor[] = [
  {
    key: 'population',
    label: 'Population',
    unit: 'billion people',
    min: 7.0, max: 9.5, step: 0.1,
    fmt: v => v.toFixed(1) + ' bn',
    color: '#22d3ee',
    inertia: 'Moves about +0.9% a year, and it is known years in advance. It sets the floor under demand and never explains a price spike.',
    drivers: [
      'Population growth in consuming countries sets the floor under consumption',
      'Growth is fastest where consumption per head is lowest — Asia and Africa',
      'Urbanisation, which raises out-of-home consumption independently of population',
      'Ageing in mature markets: flat population, but higher per-head spend on quality',
    ],
  },
  {
    key: 'cups',
    label: 'Cups per capita',
    unit: 'cups per person per year',
    min: 60, max: 220, step: 1,
    fmt: v => v.toFixed(0) + ' cups/yr',
    color: '#f59e0b',
    inertia: 'The habit itself — and habits change over a decade, not a quarter. This is where almost all real demand growth comes from.',
    drivers: [
      'The drinking habit, growing fastest in origin countries and across Asia',
      'Purchasing power — inflation against wages. Coffee is a luxury in low-income markets, a staple in rich ones',
      'Coffee culture: specialty, out-of-home, the café as a social venue',
      'Substitution at the margin — tea, energy drinks, ready-to-drink',
      'Nordic countries drink roughly four times the world average: the ceiling is a long way up',
    ],
  },
  {
    key: 'grams',
    label: 'Grams per cup',
    unit: 'grams green per cup',
    min: 6, max: 15, step: 0.5,
    fmt: v => v.toFixed(1) + ' g',
    color: '#34d399',
    inertia: 'The quiet factor. A product-mix shift of one gram per cup is worth more tons than a decade of population growth.',
    drivers: [
      'Brew method: espresso, filter, instant and capsules use very different quantities',
      'Capsules dose precisely and tend to use LESS green coffee per cup than filter',
      'Instant coffee stretches the furthest per gram — and is where robusta concentrates',
      'Specialty and third-wave brewing dose heavier',
      'Roast loss: green-to-roasted shrinkage of roughly 15–18% sits inside this number',
    ],
  },
  {
    key: 'robusta',
    label: 'Robusta share of the blend',
    unit: '% robusta',
    min: 25, max: 55, step: 1,
    fmt: v => v.toFixed(0) + '%',
    color: '#8b5cf6',
    inertia: 'This one does NOT change the total — it splits it. Which is exactly why it moves the arabica-robusta spread rather than the flat price.',
    drivers: [
      'Roasters reformulate towards robusta when the arabica premium gets wide enough',
      'Reformulation is slow and sticky: recipes, consumer taste and label claims all resist it',
      'Instant and commercial blends carry most of the robusta',
      'A blend shift is a SPREAD trade, not a flat-price trade — it moves New York against London',
      'Once a roaster has reformulated down, they are slow to reformulate back up',
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

export default function DemandTons() {
  const [population, setPopulation] = useState(8.1)
  const [cups, setCups] = useState(125)
  const [grams, setGrams] = useState(10)
  const [robusta, setRobusta] = useState(40)
  const [sel, setSel] = useState<Factor['key']>('cups')

  const factor = FACTORS.find(f => f.key === sel)!

  // Consumption in grams → tonnes → million 60-kg bags.
  const totalKg = (population * 1e9 * cups * grams) / 1000
  const totalBags = totalKg / KG_PER_BAG / 1e6
  const robustaBags = (totalBags * robusta) / 100
  const arabicaBags = totalBags - robustaBags
  // The standard split of world consumption: importing countries vs origin.
  const destinationBags = totalBags * 0.7
  const originBags = totalBags - destinationBags

  const value = (k: Factor['key']) =>
    k === 'population' ? population : k === 'cups' ? cups : k === 'grams' ? grams : robusta
  const setValue = (k: Factor['key']) =>
    k === 'population' ? setPopulation : k === 'cups' ? setCups : k === 'grams' ? setGrams : setRobusta

  // What one extra cup per person per year is worth — the growth yardstick.
  const perCup = (population * 1e9 * 1 * grams) / 1000 / KG_PER_BAG / 1e6

  const chain = FACTORS.slice(0, 3)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">The consumption multiplication — world, 2024/25</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Demand is a multiplication too, and it looks reassuringly like the supply one. The difference is the <strong className="text-slate-200">speed</strong>:
        every factor here moves in single-digit percents per decade. Click a factor to see what bends it.
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
        <div className="min-w-[140px] flex-1 rounded-lg border px-3 py-2" style={{ borderColor: 'rgba(255,255,255,0.35)', borderTopWidth: 3, borderTopStyle: 'double' }}>
          <div className="font-mono text-[11px] uppercase tracking-wide text-slate-300">Consumption</div>
          <div className="font-mono text-base font-bold tabular-nums text-amber-300">{totalBags.toFixed(1)} m bags</div>
          <div className="font-mono text-[10px] text-slate-400">{(totalKg / 1e9).toFixed(2)} Mt green</div>
        </div>
      </div>

      {/* the two splits — neither changes the total */}
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button" onClick={() => setSel('robusta')}
          className={`rounded-lg border px-3 py-2 text-left transition-all ${
            sel === 'robusta' ? 'bg-white/[0.07]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
          }`}
          style={sel === 'robusta' ? { borderColor: '#8b5cf688' } : undefined}
        >
          <div className="font-mono text-[11px] uppercase tracking-wide text-violet-300">The blend — splits, does not scale</div>
          <div className="mt-1 flex gap-4 font-mono text-sm tabular-nums">
            <span className="text-white">robusta <strong className="text-violet-300">{robustaBags.toFixed(1)}</strong></span>
            <span className="text-white">arabica <strong className="text-violet-300">{arabicaBags.toFixed(1)}</strong></span>
          </div>
          {/* share bar */}
          <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
            <div className="h-full bg-violet-400" style={{ width: `${robusta}%` }} />
            <div className="h-full bg-cyan-400/60" style={{ width: `${100 - robusta}%` }} />
          </div>
        </button>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
          <div className="font-mono text-[11px] uppercase tracking-wide text-slate-400">Where it is drunk</div>
          <div className="mt-1 flex gap-4 font-mono text-sm tabular-nums">
            <span className="text-white">destination <strong className="text-slate-200">{destinationBags.toFixed(1)}</strong></span>
            <span className="text-white">origin <strong className="text-slate-200">{originBags.toFixed(1)}</strong></span>
          </div>
          <p className="mt-1.5 font-mono text-[10px] leading-relaxed text-slate-500">
            Origin consumption is roughly 30% of the world total and growing — Brazil drinks a top-two share of the world’s coffee itself.
          </p>
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

        {/* what bends the selected factor */}
        <div className="rounded-xl border p-3.5" style={{ borderColor: factor.color + '55', backgroundColor: factor.color + '0d' }}>
          <div className="font-mono text-sm font-bold" style={{ color: factor.color }}>{factor.label} — what bends it</div>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">{factor.inertia}</p>
          <ul className="mt-2.5 space-y-1.5">
            {factor.drivers.map((d, i) => (
              <li key={i} className="flex items-baseline gap-2 text-xs leading-relaxed text-slate-300">
                <span className="shrink-0 font-mono" style={{ color: factor.color }}>▸</span>{d}
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-white/10 pt-2 font-mono text-xs leading-relaxed text-slate-300">
            Yardstick: <strong className="text-white">one extra cup</strong> per person per year ={' '}
            <strong style={{ color: factor.color }}>{perCup.toFixed(1)} m bags</strong> — about a year of world demand growth, and roughly
            what a single bad flowering takes off the supply side in a week.
          </p>
        </div>
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-slate-400">
        Demand moves slowly and almost never backwards — the only annual declines in decades came from price shocks and 2020. That
        inertia is the reason <strong className="text-slate-200">supply does most of the price-setting</strong>: when you see a big move on the
        screen, look left on the balance sheet first.
      </p>
    </div>
  )
}
