'use client'

import { useState } from 'react'

// Two ideas the section states and prose cannot show side by side.
//
// First: capacity > consumption > throughput, never equal, and the gap is the
// utilisation rate that decides margins. Drag utilisation and watch spare
// capacity appear as the thing that compresses the whole industry's margin.
//
// Second: the same barrel of crude becomes a different product slate in each
// region, because each region built its kit around what it sells.

const CAPACITY = 103.0 // mb/d of global refining capacity

type Region = {
  key: string
  name: string
  color: string
  slate: { p: string; pct: number }[]
  note: string
}

const REGIONS: Region[] = [
  {
    key: 'us', name: 'United States', color: '#22d3ee',
    slate: [
      { p: 'Gasoline', pct: 41 },
      { p: 'Diesel / gas oil', pct: 27 },
      { p: 'Jet', pct: 9 },
      { p: 'Fuel oil', pct: 4 },
      { p: 'LPG / naphtha / other', pct: 19 },
    ],
    note: 'The gasoline barrel. Deep FCC capacity, cheap domestic crude and a driving culture: 41% of the barrel comes out as motor gasoline, a share no other region comes close to. It is also why US refiners are the natural buyers of heavy, sour crude — the coking capacity is there to break it down.',
  },
  {
    key: 'eu', name: 'Europe', color: '#34d399',
    slate: [
      { p: 'Diesel / gas oil', pct: 44 },
      { p: 'Gasoline', pct: 20 },
      { p: 'Jet', pct: 10 },
      { p: 'Fuel oil', pct: 10 },
      { p: 'LPG / naphtha / other', pct: 16 },
    ],
    note: 'The diesel barrel, built by thirty years of tax policy favouring diesel cars. Europe is structurally short diesel and long gasoline — so it imports middle distillate and exports gasoline, largely to West Africa and the US east coast. The imbalance is a permanent trade flow, not a cycle.',
  },
  {
    key: 'asia', name: 'Asia-Pacific', color: '#f59e0b',
    slate: [
      { p: 'Diesel / gas oil', pct: 32 },
      { p: 'Gasoline', pct: 24 },
      { p: 'Fuel oil', pct: 15 },
      { p: 'Naphtha', pct: 14 },
      { p: 'Jet / LPG / other', pct: 15 },
    ],
    note: 'The heaviest slate of the three, and the largest naphtha share — because Asia is where the petrochemical industry is. Simpler configurations in parts of the region mean more fuel oil comes off the bottom, which is also why Singapore is the world fuel-oil hub.',
  },
]

export default function CapacityUtilisation() {
  const [util, setUtil] = useState(82)
  const [sel, setSel] = useState('us')
  const region = REGIONS.find(r => r.key === sel)!

  const throughput = (CAPACITY * util) / 100
  const idle = CAPACITY - throughput

  const margin = util > 90
    ? { label: 'Tight — margins blow out', color: '#f43f5e', note: 'With almost no idle capacity, a single unplanned outage cannot be covered. Product cracks spike and refiners earn multiples of a normal margin. This is 2022.' }
    : util > 84
      ? { label: 'Healthy', color: '#34d399', note: 'Enough slack to absorb turnarounds, not enough to give product away. The normal operating range for a profitable refining system.' }
      : util > 76
        ? { label: 'Soft — margins compressed', color: '#f59e0b', note: 'Idle capacity competes for the same demand, so cracks narrow toward cash cost. The marginal refinery starts asking whether it is worth running at all.' }
        : { label: 'Overcapacity — closures follow', color: '#64748b', note: 'This is the 1980s, and arguably today in parts of the Atlantic basin. Sustained overcapacity does not correct through price; it corrects through refineries shutting permanently.' }

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Capacity, throughput and the shape of the barrel</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Three numbers that are never equal — <strong className="text-slate-200">capacity &gt; consumption &gt; throughput</strong> —
        and the gap between them is the utilisation rate that decides whether refining is a good business this year.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
            <div className="space-y-2.5">
              <div>
                <div className="mb-1 flex justify-between font-mono text-xs">
                  <span className="text-slate-400">Global capacity</span>
                  <span className="font-bold tabular-nums text-white">{CAPACITY.toFixed(1)} mb/d</span>
                </div>
                <div className="h-5 rounded bg-white/[0.06]" />
              </div>
              <div>
                <div className="mb-1 flex justify-between font-mono text-xs">
                  <span className="text-cyan-300">Throughput — what is actually run</span>
                  <span className="font-bold tabular-nums text-cyan-300">{throughput.toFixed(1)} mb/d</span>
                </div>
                <div className="h-5 rounded bg-white/[0.06]">
                  <div className="h-full rounded bg-cyan-400/70" style={{ width: `${util}%` }} />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between font-mono text-xs">
                  <span style={{ color: margin.color }}>Idle capacity</span>
                  <span className="font-bold tabular-nums" style={{ color: margin.color }}>{idle.toFixed(1)} mb/d</span>
                </div>
                <div className="h-3 rounded bg-white/[0.04]">
                  <div className="h-full rounded" style={{ width: `${100 - util}%`, backgroundColor: margin.color, opacity: 0.65 }} />
                </div>
              </div>
            </div>

            <div className="mt-3 border-t border-white/10 pt-3">
              <div className="mb-1 flex justify-between font-mono text-xs">
                <span className="text-slate-400">Utilisation</span>
                <span className="font-bold tabular-nums text-white">{util}%</span>
              </div>
              <input type="range" min={60} max={98} step={1} value={util}
                onChange={e => setUtil(parseFloat(e.target.value))}
                aria-label="Refinery utilisation rate, percent"
                className="h-2 w-full cursor-pointer accent-brand-cyan" />
            </div>
          </div>

          <div className="mt-2.5 rounded-xl border p-3.5" style={{ borderColor: margin.color + '66', backgroundColor: margin.color + '12' }}>
            <div className="font-mono text-sm font-bold" style={{ color: margin.color }}>{margin.label}</div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{margin.note}</p>
          </div>
        </div>

        <div>
          <div className="mb-2 flex flex-wrap gap-1.5" role="group" aria-label="Region">
            {REGIONS.map(r => (
              <button
                key={r.key} type="button" onClick={() => setSel(r.key)}
                aria-pressed={sel === r.key}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
                  sel === r.key ? 'bg-white/[0.08]' : 'border-white/10 text-slate-400 hover:text-slate-200'
                }`}
                style={sel === r.key ? { borderColor: r.color + '99', color: r.color } : undefined}
              >
                {r.name}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
              What comes out of 100 barrels in {region.name}
            </div>
            {/* one stacked bar, then the breakdown */}
            <div className="mb-3 flex h-4 overflow-hidden rounded" aria-hidden="true">
              {region.slate.map((s, i) => (
                <div key={s.p} style={{
                  width: `${s.pct}%`,
                  backgroundColor: region.color,
                  opacity: 0.85 - i * 0.14,
                }} />
              ))}
            </div>
            <div className="space-y-1.5">
              {region.slate.map((s, i) => (
                <div key={s.p} className="flex items-baseline justify-between gap-2">
                  <span className="flex items-baseline gap-2 text-xs text-slate-300">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: region.color, opacity: 0.85 - i * 0.14 }} />
                    {s.p}
                  </span>
                  <span className="font-mono text-xs font-bold tabular-nums text-white">{s.pct}%</span>
                </div>
              ))}
            </div>
            <p className="mt-3 border-t border-white/10 pt-2.5 text-xs leading-relaxed text-slate-300">{region.note}</p>
          </div>
        </div>
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-slate-400">
        Click through the three regions and watch the gasoline bar shrink as the diesel bar grows. Same crude, different kit,
        different slate — and the mismatch between what each region makes and what it burns is precisely what creates the
        product trade flows a desk arbitrages.
      </p>
    </div>
  )
}
