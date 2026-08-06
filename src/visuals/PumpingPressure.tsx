'use client'

import { useState } from 'react'

// The pumping warranty as a pressure gauge: "discharge in 24 h OR maintain
// 100 psi at the manifold". Three scenarios show how the same slow discharge
// is allocated to opposite pockets by the same clause.
type Scen = 'clean' | 'shore' | 'ship'

const SCEN: Record<Scen, {
  label: string; color: string; hours: number
  psi: (h: number) => number
  verdict: string
}> = {
  clean: {
    label: 'Clean discharge', color: '#34d399', hours: 22,
    psi: h => 102 + 6 * Math.sin(h / 3),
    verdict: 'Cargo out in 22 hours at warranted pressure: no excess time, nothing to allocate. The log still gets signed — a clean voyage file is what makes the next dispute winnable.',
  },
  shore: {
    label: 'Shore restricts', color: '#f59e0b', hours: 34,
    psi: h => (h > 8 && h < 26 ? 104 : 100 + 4 * Math.sin(h / 2)),
    verdict: 'The terminal limited the rate (long lines, tanks nearly full) while the SHIP HELD ≥100 psi at the manifold throughout — the warranty is satisfied. The 10 excess hours count as laytime/demurrage: CHARTERER/receiver pays. Weapon: the hourly pumping log + the Master’s note of protest recording the restriction.',
  },
  ship: {
    label: 'Ship underperforms', color: '#f43f5e', hours: 34,
    psi: h => (h > 6 ? 62 + 8 * Math.sin(h / 2.5) : 96),
    verdict: 'No shore restriction, but the pumps could not hold the warranted pressure: the warranty is BREACHED. The 10 excess hours are the OWNER’s — deducted from laytime, demurrage claims for them fail — and liquid ROB left on board opens a shortage claim on top. Weapon (for receivers): the same log, plus the absence of any restriction letter.',
  },
}

export default function PumpingPressure() {
  const [scen, setScen] = useState<Scen>('shore')
  const s = SCEN[scen]

  const X0 = 46, X1 = 520, Y0 = 24, Y1 = 120
  const xH = (h: number) => X0 + (h / 36) * (X1 - X0)
  const yP = (p: number) => Y1 - ((p - 40) / 80) * (Y1 - Y0)
  const pts = Array.from({ length: 73 }, (_, i) => i / 2).filter(h => h <= s.hours)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow text-brand-cyan">The pumping warranty — 24 h OR 100 psi</div>
        <div className="flex gap-1.5">
          {(Object.keys(SCEN) as Scen[]).map(k => (
            <button key={k} type="button" onClick={() => setScen(k)}
              className={`rounded-full border px-3 py-1 font-mono text-[10px] font-bold transition-all ${
                scen === k ? 'bg-white/[0.08]' : 'text-slate-400 hover:text-slate-200'
              }`}
              style={{ borderColor: scen === k ? SCEN[k].color : 'rgba(255,255,255,0.1)', color: scen === k ? SCEN[k].color : undefined }}>
              {SCEN[k].label}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 560 150" className="w-full" style={{ maxHeight: '170px' }}>
        {/* warranty zone */}
        <line x1={X0} y1={yP(100)} x2={X1} y2={yP(100)} stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="6 4" />
        <text x={X1 + 2} y={yP(100) + 3} fill="#22d3ee" fontSize="7" fontFamily="monospace">100 psi</text>
        {/* 24h line */}
        <line x1={xH(24)} y1={Y0} x2={xH(24)} y2={Y1} stroke="#8b5cf6" strokeWidth="1.2" strokeDasharray="6 4" />
        <text x={xH(24)} y={Y0 - 6} textAnchor="middle" fill="#8b5cf6" fontSize="7" fontFamily="monospace">24 h warranty</text>
        {/* excess time shading */}
        {s.hours > 24 && (
          <rect x={xH(24)} y={Y0} width={xH(s.hours) - xH(24)} height={Y1 - Y0} fill={s.color} opacity="0.10" />
        )}
        {/* pressure trace */}
        <path d={pts.map((h, i) => `${i === 0 ? 'M' : 'L'} ${xH(h)} ${yP(s.psi(h))}`).join(' ')}
          fill="none" stroke={s.color} strokeWidth="1.8" />
        {/* axes */}
        <line x1={X0} y1={Y1} x2={X1} y2={Y1} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        {[0, 6, 12, 18, 24, 30, 36].map(h => (
          <text key={h} x={xH(h)} y={Y1 + 12} textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="monospace">{h}h</text>
        ))}
        <text x={X0 - 6} y={yP(100) - 26} textAnchor="end" fill="#64748b" fontSize="7" fontFamily="monospace" transform={`rotate(-90 ${X0 - 6} ${yP(100) - 26})`}>manifold psi</text>
        {s.hours > 24 && (
          <text x={(xH(24) + xH(s.hours)) / 2} y={Y0 + 12} textAnchor="middle" fill={s.color} fontSize="7.5" fontFamily="monospace" fontWeight="bold">
            {s.hours - 24} h excess — whose?
          </text>
        )}
      </svg>

      <div className="mt-2 rounded-xl border p-3" style={{ borderColor: s.color + '55', backgroundColor: s.color + '0d' }}>
        <div className="font-mono text-xs font-bold" style={{ color: s.color }}>{s.label} — {s.hours} h total</div>
        <p className="mt-1 text-xs leading-relaxed text-slate-300">{s.verdict}</p>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        Every hour of a slow discharge is silently allocated by a pressure gauge: read the warranty as an either/or,
        and win the allocation DURING the operation — with an hourly pumping log signed by both sides — not in the
        claims correspondence afterwards.
      </p>
    </div>
  )
}
