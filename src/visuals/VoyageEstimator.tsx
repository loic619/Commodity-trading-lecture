'use client'

import { useState } from 'react'

// The voyage estimate — the owner's side of every freight negotiation.
// Gross freight comes from Worldscale; what the owner actually compares
// across employment options is the TCE: net freight minus voyage costs,
// divided by voyage days. Time = money, and higher speed = more bunkers.
const FIX = {
  route: 'Bonny (WAF) → Rotterdam',
  distance: 4_300,   // nm, one way
  cargo: 80_000,     // t — an Aframax stem
  flat: 14.2,        // Worldscale flat rate, $/t (round-trip basis)
  portDays: 4,       // 2 load + 2 discharge
  portCons: 8,       // t/day in port (boilers, discharge pumps are separate)
  portCosts: 350_000, // $ both ends (dues, pilots, tugs, agency)
  commission: 0.025, // brokers' + address commission on gross freight
  baseSpeed: 13, baseCons: 35, // t/day at 13 kn — scaled by the cube law
}

const fm0 = (v: number) => Math.round(v).toLocaleString('en-US')
const usd = (v: number) => `$${fm0(v)}`

export default function VoyageEstimator() {
  const [ws, setWs] = useState(120)      // Worldscale points
  const [speed, setSpeed] = useState(13) // knots, laden & ballast
  const [bunker, setBunker] = useState(560) // $/t VLSFO

  // The cube law: consumption rises with roughly the cube of speed
  const seaCons = FIX.baseCons * Math.pow(speed / FIX.baseSpeed, 3)
  const seaDays = (2 * FIX.distance) / (speed * 24) // laden out + ballast back
  const voyageDays = seaDays + FIX.portDays

  const gross = FIX.cargo * FIX.flat * (ws / 100)
  const net = gross * (1 - FIX.commission)
  const bunkerCost = (seaDays * seaCons + FIX.portDays * FIX.portCons) * bunker
  const result = net - bunkerCost - FIX.portCosts
  const tce = result / voyageDays

  const rows = [
    { label: `Gross freight — ${fm0(FIX.cargo)} t × $${FIX.flat.toFixed(2)} flat × WS${ws}/100`, value: gross, color: '#34d399' },
    { label: `Commission ${(FIX.commission * 100).toFixed(1)}%`, value: -(gross - net), color: '#94a3b8' },
    { label: `Bunkers — ${seaDays.toFixed(1)} d × ${seaCons.toFixed(1)} t/d + port, @ $${bunker}/t`, value: -bunkerCost, color: '#f59e0b' },
    { label: 'Port costs (dues, pilots, tugs, agency)', value: -FIX.portCosts, color: '#f43f5e' },
  ]
  const maxAbs = Math.max(...rows.map(r => Math.abs(r.value)))

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-1 eyebrow text-brand-cyan">Voyage estimating — from WS points to TCE</div>
      <p className="mb-3 text-xs leading-relaxed text-slate-400">
        {FIX.route} · {fm0(FIX.distance)} nm each way · {fm0(FIX.cargo)} t cargo · flat rate ${FIX.flat.toFixed(2)}/t ·
        {' '}{FIX.portDays} port days · port costs {usd(FIX.portCosts)}. The owner quotes a WS level; this sheet is how they
        decide whether to accept yours.
      </p>

      {[
        { label: `Market rate WS ${ws}`, min: 60, max: 250, step: 5, value: ws, set: setWs },
        { label: `Speed ${speed.toFixed(1)} kn → ${seaCons.toFixed(1)} t/day (cube law)`, min: 10, max: 15.5, step: 0.5, value: speed, set: setSpeed },
        { label: `Bunker price $${bunker}/t`, min: 350, max: 800, step: 10, value: bunker, set: setBunker },
      ].map((s, i) => (
        <div key={i} className="mt-2">
          <div className="font-mono text-[10px] text-slate-400">{s.label}</div>
          <input type="range" min={s.min} max={s.max} step={s.step} value={s.value} aria-label={s.label}
            onChange={e => s.set(Number(e.target.value))}
            className="mt-1 h-1.5 w-full cursor-pointer accent-brand-cyan" />
        </div>
      ))}

      {/* waterfall */}
      <div className="mt-4 space-y-1.5">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-1/2 truncate font-mono text-[10px] text-slate-400" title={r.label}>{r.label}</div>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
              <div className="h-full rounded-full" style={{ width: `${(Math.abs(r.value) / maxAbs) * 100}%`, background: r.color, opacity: 0.85 }} />
            </div>
            <div className={`w-24 text-right font-mono text-[11px] font-bold tabular-nums ${r.value < 0 ? 'text-rose-300' : 'text-emerald-300'}`}>
              {r.value < 0 ? '−' : '+'}{usd(Math.abs(r.value))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[10px]">
        <div className="rounded-lg bg-white/[0.03] p-2">
          <div className="text-slate-500">Voyage days</div>
          <div className="mt-0.5 text-sm font-bold tabular-nums text-slate-200">{voyageDays.toFixed(1)} d</div>
          <div className="text-slate-600">{seaDays.toFixed(1)} at sea + {FIX.portDays} in port</div>
        </div>
        <div className="rounded-lg bg-white/[0.03] p-2">
          <div className="text-slate-500">Voyage result</div>
          <div className={`mt-0.5 text-sm font-bold tabular-nums ${result < 0 ? 'text-rose-300' : 'text-emerald-300'}`}>{result < 0 ? '−' : ''}{usd(Math.abs(result))}</div>
        </div>
        <div className="rounded-lg border border-brand-cyan/40 bg-brand-cyan/[0.06] p-2">
          <div className="text-cyan-300">TCE — the number that decides</div>
          <div className={`mt-0.5 text-sm font-bold tabular-nums ${tce < 0 ? 'text-rose-300' : 'text-cyan-200'}`}>{tce < 0 ? '−' : ''}{usd(Math.abs(tce))}/day</div>
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
        Two experiments: <span className="text-slate-300">slow-steam</span> (drop the speed and watch bunkers fall
        faster than days grow — until the extra days eat the saving), and <span className="text-slate-300">a bunker
        spike</span> (the same WS level can be a good or a terrible fixture depending on fuel — which is exactly why
        Worldscale flat rates are recalculated every year with updated bunker prices, and why the charterer&rsquo;s and
        owner&rsquo;s estimates of the SAME voyage rarely agree).
      </p>
    </div>
  )
}
