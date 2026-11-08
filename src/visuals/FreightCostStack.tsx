'use client'

import { useState } from 'react'

// The four cost families, and the question they answer that a voyage
// calculator cannot: at what freight level does the owner stop sailing?
//
// Deliberately NOT a TCE calculator — the voyage-estimating exercise later in
// this module already is one. This visual is about the cost BASE the TCE has
// to clear, and the two different thresholds it can clear: cash costs, and
// full costs. Between them sits the zone where owners sail at a loss on paper
// and are right to, which is the part students never predict.

const CARGO = 80_000
const FLAT = 7.60
const VOYAGE_DAYS = 9.7
const VOYAGE_COSTS = 265_750   // bunkers + port, from the standard round trip

type Family = {
  key: string
  name: string
  perDay: number
  color: string
  fixed: boolean
  what: string
  who: string
}

const FAMILIES: Family[] = [
  {
    key: 'capital', name: 'Capital', perDay: 12_000, color: '#64748b', fixed: true,
    what: 'Financing and depreciation on the ship. It runs whether she sails, waits or sits in lay-up — so it never appears in a voyage calculation, and it is exactly why a positive voyage result is not the same thing as a good one.',
    who: 'Paid to the bank, every day, forever.',
  },
  {
    key: 'opex', name: 'Operating (OPEX)', perDay: 9_000, color: '#a78bfa', fixed: true,
    what: 'Crew, insurance (H&M and P&I), stores, maintenance, management. Roughly fixed per day and largely unavoidable while the ship is manned and classed. This is the floor the freight must clear in CASH.',
    who: 'Paid to crew, insurers and suppliers, continuously.',
  },
  {
    key: 'voyage', name: 'Voyage', perDay: VOYAGE_COSTS / VOYAGE_DAYS, color: '#f59e0b', fixed: false,
    what: 'The trip-specific bill, and the only family the freight has to cover directly: bunkers (by far the largest, driven by distance, speed and fuel price), port costs — dues, pilots, tugs, agency — and canal tolls. Incurred only if she sails.',
    who: 'Paid to bunker suppliers, ports and canal authorities, per voyage.',
  },
  {
    key: 'cargo', name: 'Cargo handling', perDay: 0, color: '#34d399', fixed: false,
    what: 'Where applicable. On tankers the ship pumps her own cargo, so this is usually small or absent — unlike dry bulk, where stevedoring is a real line in the estimate.',
    who: 'Usually nobody, on a tanker.',
  },
]

const CASH_FLOOR = FAMILIES.find(f => f.key === 'opex')!.perDay
const FULL_FLOOR = CASH_FLOOR + FAMILIES.find(f => f.key === 'capital')!.perDay

export default function FreightCostStack() {
  const [ws, setWs] = useState(95)
  const [sel, setSel] = useState('voyage')
  const f = FAMILIES.find(x => x.key === sel)!

  const freight = CARGO * FLAT * (ws / 100)
  const tce = (freight - VOYAGE_COSTS) / VOYAGE_DAYS

  const zone = tce >= FULL_FLOOR
    ? { label: 'Above full breakeven — the ship earns', color: '#34d399',
        note: 'The voyage covers bunkers, ports, crew, insurance AND the finance on the hull. This is what a profitable market looks like, and it is rarer than students assume.' }
    : tce >= CASH_FLOOR
      ? { label: 'Covers cash costs, not capital — sail anyway', color: '#f59e0b',
          note: 'The counter-intuitive zone, and the one worth stopping on. The owner is losing money against full costs and is still right to sail: the capital bill arrives whether she moves or not, so any dollar above OPEX is a dollar less lost. Fleets run for years here, which is why freight slumps last.' }
      : tce >= 0
        ? { label: 'Below cash costs — lay-up territory', color: '#f43f5e',
            note: 'Now sailing destroys cash. The owner starts weighing warm lay-up against continuing, and the decision turns on how long they think it lasts: reactivating a laid-up ship costs real money and takes weeks.' }
        : { label: 'The voyage does not even cover its bunkers', color: '#f43f5e',
            note: 'The freight does not pay for the fuel to perform it. Nobody fixes here — which is precisely why the market cannot stay here, and why rates eventually turn.' }

  const maxDay = Math.max(FULL_FLOOR + FAMILIES.find(x => x.key === 'voyage')!.perDay, tce) * 1.1
  const pct = (v: number) => `${Math.max(0, Math.min(100, (v / maxDay) * 100))}%`
  const usd = (n: number) => (n < 0 ? '−$' : '$') + Math.abs(Math.round(n)).toLocaleString('en-US')

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Four cost families — and only one is paid by this voyage</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        An owner&apos;s price decomposes into four families, but they do not behave alike. Two run whether the ship moves or not;
        one is incurred only if she sails. That difference is what decides, in a bad market, whether she sails at all.
      </p>

      <div className="mb-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {FAMILIES.map(x => (
          <button
            key={x.key} type="button" onClick={() => setSel(x.key)}
            aria-pressed={sel === x.key}
            className={`rounded-lg border px-2.5 py-2 text-left transition-all ${
              sel === x.key ? 'bg-white/[0.08]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
            }`}
            style={sel === x.key ? { borderColor: x.color + '99' } : undefined}
          >
            <span className="block text-xs font-medium" style={{ color: sel === x.key ? x.color : '#cbd5e1' }}>{x.name}</span>
            <span className="font-mono text-[10px] text-slate-500">{x.fixed ? 'runs anyway' : 'only if she sails'}</span>
          </button>
        ))}
      </div>
      <div className="mb-4 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
        <p className="text-xs leading-relaxed text-slate-300">{f.what}</p>
        <p className="mt-1.5 font-mono text-[11px] text-slate-500">{f.who}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
            The cost base, per day
          </div>
          <div className="space-y-2.5">
            {FAMILIES.filter(x => x.perDay > 0).map(x => (
              <div key={x.key}>
                <div className="mb-1 flex justify-between font-mono text-[11px]">
                  <span style={{ color: x.color }}>{x.name}</span>
                  <span className="tabular-nums text-slate-300">{usd(x.perDay)}/day</span>
                </div>
                <div className="h-3 rounded bg-white/[0.04]">
                  <div className="h-full rounded" style={{ width: pct(x.perDay), backgroundColor: x.color, opacity: 0.7 }} />
                </div>
              </div>
            ))}
          </div>

          {/* the two thresholds, and where the TCE lands */}
          <div className="mt-4 border-t border-white/10 pt-3">
            <div className="mb-1 flex justify-between font-mono text-[11px]">
              <span style={{ color: zone.color }}>TCE achieved</span>
              <span className="font-bold tabular-nums" style={{ color: zone.color }}>{usd(tce)}/day</span>
            </div>
            <div className="relative h-6 rounded bg-white/[0.04]">
              <div className="h-full rounded" style={{ width: pct(tce), backgroundColor: zone.color, opacity: 0.55 }} />
              {/* cash floor */}
              <div className="absolute inset-y-0 w-0.5 bg-violet-300" style={{ left: pct(CASH_FLOOR) }} />
              {/* full floor */}
              <div className="absolute inset-y-0 w-0.5 bg-slate-300" style={{ left: pct(FULL_FLOOR) }} />
            </div>
            <div className="mt-1 flex gap-4 font-mono text-[10px]">
              <span className="text-violet-300">│ cash floor {usd(CASH_FLOOR)}</span>
              <span className="text-slate-300">│ full breakeven {usd(FULL_FLOOR)}</span>
            </div>
          </div>

          <div className="mt-3 border-t border-white/10 pt-3">
            <div className="mb-1 flex justify-between font-mono text-xs">
              <span className="text-cyan-300">Market level</span>
              <span className="font-bold tabular-nums text-white">WS{ws}</span>
            </div>
            <input type="range" min={30} max={250} step={1} value={ws}
              onChange={e => setWs(parseInt(e.target.value, 10))}
              aria-label="Market level in Worldscale points"
              className="h-2 w-full cursor-pointer accent-brand-cyan" />
            <p className="mt-1.5 font-mono text-[10px] leading-relaxed text-slate-500">
              {CARGO.toLocaleString('en-US')} t × ${FLAT} × {ws}% = {usd(freight)} freight, less {usd(VOYAGE_COSTS)} of voyage
              costs, over {VOYAGE_DAYS} days
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-xl border p-3.5" style={{ borderColor: zone.color + '66', backgroundColor: zone.color + '12' }}>
            <div className="font-mono text-sm font-bold" style={{ color: zone.color }}>{zone.label}</div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{zone.note}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
              Two maxims that govern the owner&apos;s sum
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              <strong className="text-slate-100">Time = money.</strong> Every extra day — waiting for a berth, slow-steaming,
              stuck on demurrage — spreads the same freight over more days and pulls the TCE down.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              <strong className="text-slate-100">Higher speed = more bunkers.</strong> Consumption rises with roughly the{' '}
              <em>cube</em> of speed, so arriving two days early can cost more than the two days are worth. The voyage-estimating
              exercise later in this module lets you find the speed where those two maxims balance.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-xs leading-relaxed text-slate-400">
              Every negotiation in this course is two parties running this same sum with different assumptions — about the speed
              she will make, the bunkers she will burn and the days she will spend in port. The charterer who knows the
              owner&apos;s arithmetic knows which concessions are cheap.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
