'use client'

import { useState } from 'react'

// Which benchmark a grade prices off is a question of geography and
// destination, not quality — and the same barrel can price off two different
// benchmarks depending on where it sails. That last point is the one students
// miss, so Arab Light appears under both Brent and Dubai.

type Bench = {
  key: string
  name: string
  full: string
  color: string
  region: string
  what: string
  grades: { g: string; from: string }[]
  quirk: string
}

const BENCHES: Bench[] = [
  {
    key: 'wti', name: 'WTI', full: 'West Texas Intermediate', color: '#22d3ee',
    region: 'North America',
    what: 'Light (API ~39.6) and sweet (0.24% sulphur), delivered physically at Cushing, Oklahoma — an inland tank farm, not a port.',
    grades: [
      { g: 'US domestic grades', from: 'Permian, Bakken, Eagle Ford' },
      { g: 'Canadian heavy (WCS)', from: 'at a wide discount, pipeline-constrained' },
      { g: 'Mars, Thunder Horse', from: 'US Gulf of Mexico offshore' },
    ],
    quirk: 'Landlocked delivery is WTI’s defining feature and its historic weakness: when Cushing fills up there is nowhere for the barrels to go, which is how the May 2020 contract settled at minus $37. WTI Midland is now part of the Brent basket precisely because it CAN be exported.',
  },
  {
    key: 'brent', name: 'Brent', full: 'Brent / BFOET', color: '#34d399',
    region: 'The Atlantic basin',
    what: 'A basket of North Sea grades plus WTI Midland, waterborne and freely exportable. The reference for roughly two-thirds of internationally traded crude.',
    grades: [
      { g: 'Nigerian Bonny Light, Forcados', from: 'West Africa' },
      { g: 'Urals and Mediterranean grades', from: 'Russia and the Med' },
      { g: 'Azeri Light, CPC Blend', from: 'Caspian' },
      { g: 'Arab Light sold WEST', from: 'the same grade, Atlantic destination' },
    ],
    quirk: 'Brent survives as the world benchmark despite North Sea output being a rounding error in global supply. That is the whole lesson: a benchmark is made by the liquidity and transparency around it, not by the volume of the underlying grade.',
  },
  {
    key: 'dubai', name: 'Dubai / Oman', full: 'Dubai, Oman — and Murban', color: '#f59e0b',
    region: 'Middle East to Asia',
    what: 'Medium, sour (Dubai ~31 API, 1.68% sulphur) and the reference for Gulf crude heading east. Murban, lighter and sweeter, now trades on its own exchange in Abu Dhabi.',
    grades: [
      { g: 'Arab Light sold EAST', from: 'the same grade, Asian destination' },
      { g: 'Basrah Light and Heavy', from: 'Iraq' },
      { g: 'Upper Zakum, Murban', from: 'UAE' },
      { g: 'Most Asian-bound Gulf crude', from: 'the default for the region' },
    ],
    quirk: 'Dubai is sour and Brent is sweet, so the Brent–Dubai spread (the EFS) is really a price on quality AND on which way the barrels want to sail. When it widens enough, Atlantic crude starts moving east.',
  },
]

export default function CrudeBenchmarks() {
  const [sel, setSel] = useState('brent')
  const b = BENCHES.find(x => x.key === sel)!

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Three benchmarks, hundreds of grades</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        No one quotes a flat price for Bonny Light. Every grade in the world prices as a{' '}
        <strong className="text-slate-200">differential to a benchmark</strong>, and which benchmark is a question of geography and
        destination — not of quality.
      </p>

      <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {BENCHES.map(x => (
          <button
            key={x.key} type="button" onClick={() => setSel(x.key)}
            aria-pressed={sel === x.key}
            className={`rounded-lg border px-3 py-2.5 text-left transition-all ${
              sel === x.key ? 'bg-white/[0.08]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
            }`}
            style={sel === x.key ? { borderColor: x.color + '99' } : undefined}
          >
            <div className="font-mono text-sm font-bold" style={{ color: x.color }}>{x.name}</div>
            <div className="font-mono text-[10px] text-slate-500">{x.region}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border p-3.5" style={{ borderColor: b.color + '55', backgroundColor: b.color + '0d' }}>
          <div className="font-mono text-sm font-bold" style={{ color: b.color }}>{b.full}</div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{b.what}</p>
          <div className="mt-3">
            <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wide text-slate-500">Prices off it</div>
            <div className="space-y-1.5">
              {b.grades.map(gr => (
                <div key={gr.g} className="flex items-baseline justify-between gap-2 border-b border-white/[0.05] pb-1.5 last:border-0">
                  <span className="text-xs text-slate-200">{gr.g}</span>
                  <span className="shrink-0 font-mono text-[10px] text-slate-500">{gr.from}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">What makes it a benchmark</div>
            <p className="text-xs leading-relaxed text-slate-300">{b.quirk}</p>
          </div>

          <div className="rounded-xl border border-amber-500/40 bg-amber-500/[0.08] p-3.5">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-amber-300">
              The same barrel, two benchmarks
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              Notice that <strong className="text-white">Arab Light appears twice</strong> — under Brent and under Dubai. Saudi
              Aramco sells the identical grade off Brent when it sails west and off Dubai when it sails east. The benchmark is not a
              property of the crude; it is a property of where the crude is <em>going</em>. Get that and the whole pricing system
              stops looking arbitrary.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-slate-300">The formula under all of it</div>
            <p className="font-mono text-xs leading-relaxed text-slate-300">
              cargo price = <span className="text-cyan-300">benchmark</span> ± <span className="text-amber-300">differential</span>
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              The benchmark is the anchor; quality and location set the differential. If that looks familiar it should — it is the
              same PTBF structure as the coffee market, with Brent in place of the London futures.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
