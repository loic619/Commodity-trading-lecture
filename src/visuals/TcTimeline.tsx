'use client'

import { useState } from 'react'

// A 12-month time charter as one bar: delivery to redelivery, hire running
// green, off-hire events cutting red gaps, bunkers surveyed at both ends,
// the final-voyage zone and the overlap risk. Click any event.
type Ev = {
  key: string; name: string; color: string
  from: number; to: number // months from delivery
  note: string
}

const EVENTS: Ev[] = [
  {
    key: 'delivery', name: 'Delivery', color: '#22d3ee', from: 0, to: 0,
    note: 'The ship enters the charter at the agreed range/window. The independent ON-HIRE SURVEY records her condition and bunkers on board (BOD) — the charterer buys that fuel at the CP price. The meter starts here.',
  },
  {
    key: 'hire1', name: 'Hire running', color: '#34d399', from: 0, to: 3.4,
    note: 'Hire is payable IN ADVANCE (per 15 days or month), punctually: the classic forms give the owner a WITHDRAWAL right for late payment — softened by anti-technicality notices, but a missed payment in a rising market is how charterers lose ships.',
  },
  {
    key: 'offhire1', name: 'Off-hire: breakdown', color: '#f43f5e', from: 3.4, to: 3.9,
    note: 'Main-engine breakdown: the ship fails the charterer, so hire STOPS for the time (and bunkers) lost. The off-hire clause is a LIST read literally — an event not on it (congestion, charterer’s own delays) does not stop hire however inconvenient.',
  },
  {
    key: 'hire2', name: 'Hire running', color: '#34d399', from: 3.9, to: 7.2,
    note: 'Performance is tested continuously against the warranty ("about 13 kn on about 35 t/day, good weather up to BF4") using logs and weather-routing analysis. Underperformance → RECOMPENSE: time lost × hire + excess bunkers, deducted or claimed at period end.',
  },
  {
    key: 'drydock', name: 'Dry docking', color: '#8b5cf6', from: 7.2, to: 7.8,
    note: 'Scheduled class docking: either the ship goes off-hire for it, or the period was framed to keep dockings outside. A clause letting the owner dock "at a convenient time" in a strong market is a free option someone paid for without noticing.',
  },
  {
    key: 'final', name: 'Legitimate final voyage', color: '#f59e0b', from: 9.5, to: 12,
    note: 'The charterer may only order a last voyage REASONABLY EXPECTED to redeliver within the period ("legitimate last voyage"). An order that could never make redelivery may be refused outright; a legitimate voyage that overruns anyway pays market rate for the overrun.',
  },
  {
    key: 'redelivery', name: 'Redelivery — and overlap', color: '#22d3ee', from: 12, to: 12,
    note: 'Back at the agreed range, like condition, OFF-HIRE SURVEY: the owner buys back the bunkers remaining (BOR) at CP prices — min/max quantities stop either side gaming a fuel-price move. Redeliver LATE (overlap) and the owner recovers at least MARKET rate for the overrun.',
  },
]

export default function TcTimeline() {
  const [sel, setSel] = useState(0)
  const e = EVENTS[sel]
  const X0 = 40, X1 = 520
  const x = (m: number) => X0 + (m / 12) * (X1 - X0)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-3 text-brand-cyan">Twelve months on hire — every day on somebody&rsquo;s account</div>

      <svg viewBox="0 0 560 120" className="w-full" style={{ maxHeight: '140px' }}>
        {/* base bar */}
        <rect x={X0} y={46} width={X1 - X0} height={20} rx="5" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
        {/* period segments */}
        {EVENTS.filter(ev => ev.to > ev.from).map(ev => (
          <rect key={ev.key} x={x(ev.from)} y={46} width={x(ev.to) - x(ev.from)} height={20} rx="3"
            fill={ev.color} opacity={sel === EVENTS.indexOf(ev) ? 0.55 : 0.28}
            onClick={() => setSel(EVENTS.indexOf(ev))} style={{ cursor: 'pointer' }} />
        ))}
        {/* point events */}
        {EVENTS.filter(ev => ev.to === ev.from).map(ev => (
          <g key={ev.key} onClick={() => setSel(EVENTS.indexOf(ev))} style={{ cursor: 'pointer' }}>
            <line x1={x(ev.from)} y1={30} x2={x(ev.from)} y2={82} stroke={ev.color}
              strokeWidth={sel === EVENTS.indexOf(ev) ? 2.2 : 1.4} />
            <circle cx={x(ev.from)} cy={30} r={sel === EVENTS.indexOf(ev) ? 5 : 3.5} fill={ev.color} />
          </g>
        ))}
        {/* labels */}
        <text x={x(0)} y={22} textAnchor="start" fill="#22d3ee" fontSize="7.5" fontFamily="monospace">delivery · on-hire survey · BOD</text>
        <text x={x(12)} y={22} textAnchor="end" fill="#22d3ee" fontSize="7.5" fontFamily="monospace">redelivery · BOR</text>
        <text x={x(3.65)} y={94} textAnchor="middle" fill="#f43f5e" fontSize="7" fontFamily="monospace">off-hire</text>
        <text x={x(7.5)} y={94} textAnchor="middle" fill="#8b5cf6" fontSize="7" fontFamily="monospace">drydock</text>
        <text x={x(10.75)} y={94} textAnchor="middle" fill="#f59e0b" fontSize="7" fontFamily="monospace">final voyage zone</text>
        {/* month ticks */}
        {[0, 3, 6, 9, 12].map(m => (
          <text key={m} x={x(m)} y={110} textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="monospace">{m}mo</text>
        ))}
      </svg>

      <div className="mt-1 flex flex-wrap gap-1.5">
        {EVENTS.map((ev, i) => (
          <button key={ev.key} type="button" onClick={() => setSel(i)}
            className={`rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold transition-all ${
              i === sel ? 'bg-white/[0.08]' : 'text-slate-400 hover:text-slate-200'
            }`}
            style={{ borderColor: i === sel ? ev.color : 'rgba(255,255,255,0.1)', color: i === sel ? ev.color : undefined }}>
            {ev.name}
          </button>
        ))}
      </div>

      <div className="mt-2 rounded-xl border p-3" style={{ borderColor: e.color + '55', backgroundColor: e.color + '0d' }}>
        <div className="font-mono text-xs font-bold" style={{ color: e.color }}>{e.name}</div>
        <p className="mt-1 text-xs leading-relaxed text-slate-300">{e.note}</p>
      </div>
    </div>
  )
}
