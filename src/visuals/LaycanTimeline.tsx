'use client'

import { useState } from 'react'

// The laycan as a clock you can scrub: drag the vessel's arrival across the
// window and watch what each position does to NOR, laytime and the
// cancellation option. Days are relative: layday = day 0, cancelling = day 2.
const LAYDAY = 0, CANCELLING = 2 // laycan 12–14 → day 0 to day 2 (end)
const NOTICE_H = 6 // laytime starts 6 h after valid NOR (or at layday if early)

export default function LaycanTimeline() {
  const [arrival, setArrival] = useState(-1.0) // days relative to layday

  const early = arrival < LAYDAY
  const late = arrival > CANCELLING
  const laytimeStart = early ? LAYDAY : arrival + NOTICE_H / 24

  const X0 = 50, X1 = 510, D0 = -3, D1 = 4
  const x = (d: number) => X0 + ((d - D0) / (D1 - D0)) * (X1 - X0)

  const verdict = late
    ? {
        color: '#f43f5e', title: 'LATE — cancelling date missed',
        body: `The charterer now holds the OPTION to cancel — no damages for the lateness itself, just the free put on the freight market: if rates FELL since fixing, cancel and re-fix cheaper; if they rose, keep the ship and say nothing. Interpellation clauses (ShellVoy/BPVoy style) force this declaration in advance, so an owner does not steam a wasted ballast leg toward a cancellation.`,
      }
    : early
      ? {
          color: '#f59e0b', title: 'EARLY — before the layday',
          body: `NOR can be tendered, but laytime does NOT start before the layday (day 0): the waiting is the owner's gift. Trap to know: some CPs and terminals treat "berthed early at charterer's convenience" as time counting — check which regime you fixed before celebrating the free days.`,
        }
      : {
          color: '#34d399', title: 'IN THE WINDOW — the clean case',
          body: `NOR tendered on arrival (valid on the 4 Ws), and laytime starts ${NOTICE_H} hours later (or when cargo ops begin, whichever first). From this moment the 72-hour clock of the fixture is burning at both ends of the voyage — everything in the demurrage module flows from this instant.`,
        }

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-3 text-brand-cyan">The laycan, scrubbed — drag the arrival</div>

      <svg viewBox="0 0 560 120" className="w-full" style={{ maxHeight: '140px' }}>
        {/* window shading */}
        <rect x={x(LAYDAY)} y={30} width={x(CANCELLING) - x(LAYDAY)} height={44} fill="#34d399" opacity="0.10" />
        {/* axis */}
        <line x1={X0} y1={74} x2={X1} y2={74} stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
        {[-3, -2, -1, 0, 1, 2, 3, 4].map(d => (
          <g key={d}>
            <line x1={x(d)} y1={70} x2={x(d)} y2={78} stroke="#64748b" strokeWidth="1" />
            <text x={x(d)} y={92} textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="monospace">
              {d === 0 ? 'LAYDAY' : d === 2 ? 'CANCELLING' : `${d > 0 ? '+' : ''}${d}d`}
            </text>
          </g>
        ))}
        {/* layday & cancelling markers */}
        <line x1={x(LAYDAY)} y1={28} x2={x(LAYDAY)} y2={74} stroke="#34d399" strokeWidth="1.4" />
        <line x1={x(CANCELLING)} y1={28} x2={x(CANCELLING)} y2={74} stroke="#f43f5e" strokeWidth="1.4" strokeDasharray="5 3" />
        {/* vessel marker */}
        <g transform={`translate(${x(arrival)}, 52)`}>
          <path d="M -12 6 L 8 6 L 14 0 L 8 -6 L -12 -6 Q -16 0 -12 6 Z" fill={verdict.color} opacity="0.9" />
          <text x={0} y={-12} textAnchor="middle" fill={verdict.color} fontSize="8" fontFamily="monospace" fontWeight="bold">NOR</text>
        </g>
        {/* laytime start marker (only when not late) */}
        {!late && (
          <g>
            <line x1={x(laytimeStart)} y1={74} x2={x(laytimeStart)} y2={104} stroke="#22d3ee" strokeWidth="1.3" />
            <text x={x(laytimeStart) + 4} y={110} fill="#22d3ee" fontSize="7.5" fontFamily="monospace">laytime starts</text>
          </g>
        )}
      </svg>

      <input type="range" min={-3} max={4} step={0.1} value={arrival} aria-label="Vessel arrival (days vs layday)"
        onChange={e => setArrival(Number(e.target.value))} className="mt-1 h-1.5 w-full cursor-pointer accent-brand-cyan" />

      <div className="mt-2 rounded-xl border p-3" style={{ borderColor: verdict.color + '55', backgroundColor: verdict.color + '0d' }}>
        <div className="font-mono text-xs font-bold" style={{ color: verdict.color }}>{verdict.title}</div>
        <p className="mt-1 text-xs leading-relaxed text-slate-300">{verdict.body}</p>
      </div>
    </div>
  )
}
