'use client'

import { useState } from 'react'

// Price is an output of the system AND an input to it. Students draw the
// causal arrow one way only, so this visual makes the loop close: pick a
// shock, follow it round, and read the lag on each leg — because the lags are
// what decide whether the feedback bites this quarter or in three years.

type Dir = 'spike' | 'collapse'

type Leg = {
  node: string
  detail: Record<Dir, string>
  lag: string
}

const LEGS: Leg[] = [
  {
    node: 'Price moves',
    detail: {
      spike: 'Brent jumps $20/bbl on a supply disruption.',
      collapse: 'Brent falls $20/bbl on a demand scare or an OPEC+ market-share war.',
    },
    lag: 'instant',
  },
  {
    node: 'Demand responds',
    detail: {
      spike: 'Discretionary driving falls, airlines trim capacity, industry switches to gas, substitution and efficiency accelerate. Demand destruction is real but SMALL in the short run — oil demand is famously inelastic.',
      collapse: 'Cheap fuel pulls demand back: more miles driven, petrochemical runs raised, fuel switching reverses.',
    },
    lag: 'weeks to months, and weakly',
  },
  {
    node: 'Supply responds',
    detail: {
      spike: 'US shale rigs go back to work, OPEC+ is lobbied to release barrels, stranded and marginal fields become economic, strategic reserves may be tapped.',
      collapse: 'Rigs are stacked, capex is cut, high-cost barrels shut in. The cut to investment is the part that bites years later.',
    },
    lag: '6–9 months for shale, 3–5 years for conventional',
  },
  {
    node: 'Balance shifts',
    detail: {
      spike: 'More supply and slightly less demand means stocks rebuild — and the stock build is what actually kills the rally.',
      collapse: 'Less supply and slightly more demand draws stocks down, and the draw is what ends the slump.',
    },
    lag: 'visible in the weekly data',
  },
]

type Family = { name: string; color: string; drivers: { d: string; pole: string; note: string }[] }

const FAMILIES: Family[] = [
  {
    name: 'The two poles', color: '#22d3ee',
    drivers: [
      { d: 'Supply', pole: 'supply', note: 'OPEC+ policy, shale economics, outages, decline rates, new projects' },
      { d: 'Demand', pole: 'demand', note: 'GDP growth, mobility, petrochemicals, weather, efficiency' },
    ],
  },
  {
    name: 'The buffers', color: '#34d399',
    drivers: [
      { d: 'Stocks', pole: 'both', note: 'the shock absorber — and the gauge. Read against the 5-year range, never in absolutes' },
      { d: 'Transport', pole: 'supply', note: 'tanker rates, canal and strait access, pipeline capacity. Logistics is a supply constraint in disguise' },
      { d: 'Refining', pole: 'both', note: 'turnarounds, outages, utilisation. A crude surplus and a product shortage can coexist' },
      { d: 'Quality / location', pole: 'both', note: 'the right barrel in the wrong place is not supply' },
    ],
  },
  {
    name: 'The shocks', color: '#f43f5e',
    drivers: [
      { d: 'Geopolitics', pole: 'supply', note: 'wars, sanctions, export bans, strait closures. The fastest-acting driver on the list' },
      { d: 'Seasonality', pole: 'demand', note: 'northern winter heating, US summer driving, Asian monsoon power burn' },
    ],
  },
  {
    name: 'The slow tide', color: '#a78bfa',
    drivers: [
      { d: 'Alternatives', pole: 'demand', note: 'gas, coal and nuclear competing barrel for barrel in power and industry' },
      { d: 'Renewables', pole: 'demand', note: 'solar, wind and EVs — small per year, decisive per decade' },
      { d: 'Taxation', pole: 'demand', note: 'fuel duty decides what the consumer actually pays, and so what they actually burn' },
      { d: 'Environment', pole: 'both', note: 'emission rules reshape both the product slate and the cost of producing it' },
      { d: 'Regulation', pole: 'both', note: 'IMO 2020 rewrote the fuel-oil market overnight' },
      { d: 'US dollar', pole: 'both', note: 'oil is priced in dollars: a stronger dollar makes it dearer everywhere else, and usually weighs on the price' },
    ],
  },
]

// SVG geometry for the cycle
const VB = 320
const CX = 160
const CY = 150
const R = 96

export default function PriceFeedbackLoop() {
  const [dir, setDir] = useState<Dir>('spike')
  const [leg, setLeg] = useState(0)
  const [driver, setDriver] = useState<{ d: string; pole: string; note: string } | null>(null)

  const active = LEGS[leg]
  const accent = dir === 'spike' ? '#f43f5e' : '#34d399'

  // Four nodes evenly round the circle, starting at the top.
  const pos = (i: number) => {
    const a = ((i * 90 - 90) * Math.PI) / 180
    return [CX + R * Math.cos(a), CY + R * Math.sin(a)] as const
  }

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Price is an output — and an input</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        The oil price comes out of supply, demand, stocks and transport. It also goes back <em>in</em>, because the level itself
        changes behaviour. Follow a shock round the loop — and read the <strong className="text-slate-200">lag</strong> on each leg,
        because that is what decides whether the feedback bites this quarter or in five years.
      </p>

      <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Shock direction">
        {(['spike', 'collapse'] as const).map(d => (
          <button
            key={d} type="button" onClick={() => setDir(d)}
            aria-pressed={dir === d}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs font-bold transition-all ${
              dir === d
                ? d === 'spike' ? 'border-rose-400/60 bg-rose-400/15 text-rose-200' : 'border-emerald-400/60 bg-emerald-400/15 text-emerald-200'
                : 'border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            {d === 'spike' ? '↑ price spikes' : '↓ price collapses'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[320px_1fr]">
        <svg viewBox={`0 0 ${VB} ${VB}`} className="mx-auto w-full max-w-[320px]" role="img"
          aria-label="A four-step feedback loop: price moves, demand responds, supply responds, the balance shifts, and the balance feeds back into price">
          {/* the ring */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={1.5} strokeDasharray="4 5" />
          {/* direction arrows between nodes */}
          {[0, 1, 2, 3].map(i => {
            const a = ((i * 90 - 90 + 45) * Math.PI) / 180
            const x = CX + R * Math.cos(a)
            const y = CY + R * Math.sin(a)
            // The marker points along +x; rotating by the midpoint angle aims it
            // along the clockwise tangent. (An extra +90 here points it backwards.)
            const rot = i * 90 + 45
            return (
              <path key={i} d="M -5 -5 L 5 0 L -5 5 Z" fill={accent} opacity={0.8}
                transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot})`} />
            )
          })}
          {LEGS.map((l, i) => {
            const [x, y] = pos(i)
            const on = i === leg
            return (
              <g key={l.node} onClick={() => setLeg(i)} className="cursor-pointer">
                <circle cx={x} cy={y} r={40} fill={on ? accent : '#0f172a'} fillOpacity={on ? 0.22 : 0.9}
                  stroke={on ? accent : 'rgba(255,255,255,0.18)'} strokeWidth={on ? 2.5 : 1.5} />
                {l.node.split(' ').map((w, j, arr) => (
                  <text key={j} x={x} y={y + (j - (arr.length - 1) / 2) * 12} textAnchor="middle" dominantBaseline="central"
                    fill={on ? '#fff' : '#cbd5e1'} fontSize={11} className="font-mono">{w}</text>
                ))}
              </g>
            )
          })}
          <text x={CX} y={CY - 7} textAnchor="middle" fill="#64748b" fontSize={10} letterSpacing="2" className="font-mono">THE</text>
          <text x={CX} y={CY + 7} textAnchor="middle" fill="#64748b" fontSize={10} letterSpacing="2" className="font-mono">LOOP</text>
        </svg>

        <div className="space-y-2.5">
          <div className="rounded-xl border p-3.5" style={{ borderColor: accent + '55', backgroundColor: accent + '0d' }}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-mono text-sm font-bold" style={{ color: accent }}>
                {leg + 1}. {active.node}
              </span>
              <span className="font-mono text-[11px] text-slate-400">lag: <strong className="text-slate-200">{active.lag}</strong></span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{active.detail[dir]}</p>
            <button
              type="button" onClick={() => setLeg((leg + 1) % LEGS.length)}
              className="mt-2.5 rounded-lg border border-white/15 px-3 py-1.5 font-mono text-[11px] text-slate-300 transition-all hover:bg-white/5"
            >
              next step →
            </button>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">Why the loop is slow to close</div>
            <p className="text-xs leading-relaxed text-slate-300">
              Demand barely flexes in the short run and supply takes months to years to arrive. That is precisely why oil prices
              overshoot: the correcting forces are real but they are <strong className="text-slate-100">late</strong>, so the price has
              to move a long way before the physical market answers.
            </p>
          </div>
        </div>
      </div>

      {/* the driver grid — the section's own exercise */}
      <div className="mt-4 border-t border-white/10 pt-3.5">
        <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
          List every factor that moves the price — they all land in one of these
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {FAMILIES.map(f => (
            <div key={f.name} className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
              <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wide" style={{ color: f.color }}>{f.name}</div>
              <div className="flex flex-wrap gap-1">
                {f.drivers.map(d => (
                  <button
                    key={d.d} type="button" onClick={() => setDriver(d)}
                    aria-pressed={driver?.d === d.d}
                    className={`rounded border px-2 py-1 text-[11px] transition-all ${
                      driver?.d === d.d ? 'bg-white/[0.10] text-white' : 'border-white/10 text-slate-300 hover:bg-white/[0.05]'
                    }`}
                    style={driver?.d === d.d ? { borderColor: f.color + '99' } : undefined}
                  >
                    {d.d}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs leading-relaxed">
          {driver ? (
            <>
              <span className="font-mono font-bold text-cyan-300">{driver.d}</span>
              <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] uppercase text-slate-300">
                moves {driver.pole}
              </span>
              <span className="ml-2 text-slate-300">{driver.note}</span>
            </>
          ) : (
            <span className="text-slate-500">Click any driver to see which pole it moves, and how.</span>
          )}
        </div>
      </div>
    </div>
  )
}
