'use client'

import { useState } from 'react'

// The three ideas behind every "how much can she load?" answer, each drawn:
// the loadline comb (zones & seasons), salinity (the same ship floats deeper
// in fresh water), and charts & tides (the sailing window). The interactive
// exercise below the section puts numbers on all three.
type Tab = 'loadlines' | 'salinity' | 'tides'

const MARKS: { key: string; label: string; note: string; dy: number; color: string }[] = [
  { key: 'TF', label: 'TF — Tropical Fresh', note: 'deepest permitted: tropical zone AND fresh water', dy: -30, color: '#22d3ee' },
  { key: 'F', label: 'F — Fresh', note: 'summer zone, fresh water (summer + FWA)', dy: -19, color: '#22d3ee' },
  { key: 'T', label: 'T — Tropical', note: 'tropical zone, salt water (+1/48 of summer draft)', dy: -10, color: '#34d399' },
  { key: 'S', label: 'S — Summer', note: 'the reference mark: summer zone, salt water', dy: 0, color: '#f59e0b' },
  { key: 'W', label: 'W — Winter', note: 'winter zone (−1/48 of summer draft)', dy: 10, color: '#3b82f6' },
  { key: 'WNA', label: 'WNA — Winter North Atlantic', note: 'small ships, North Atlantic in winter: shallower still', dy: 19, color: '#8b5cf6' },
]

export default function CapacityDraftNotions() {
  const [tab, setTab] = useState<Tab>('loadlines')
  const [tide, setTide] = useState(1.6) // m amplitude for the tides tab

  // Tides tab geometry: depth needed 15.6 m, charted depth 14.6 m + tide sine
  const NEED = 15.6, DATUM = 14.6
  const points = Array.from({ length: 49 }, (_, i) => {
    const h = i / 2 // hours 0..24
    const depth = DATUM + (tide / 2) * (1 + Math.sin((h / 12.4) * 2 * Math.PI - Math.PI / 2))
    return { h, depth }
  })
  const yD = (d: number) => 150 - (d - 13.8) * 42
  const xH = (h: number) => 40 + (h / 24) * 480
  const inWindow = (d: number) => d >= NEED

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow text-brand-cyan">Load lines · salinity · charts &amp; tides — drawn</div>
        <div className="flex gap-1.5">
          {([['loadlines', 'Load lines'], ['salinity', 'Salinity'], ['tides', 'Charts & tides']] as [Tab, string][]).map(([k, label]) => (
            <button key={k} type="button" onClick={() => setTab(k)}
              className={`rounded-full border px-3 py-1 font-mono text-[10px] font-bold transition-all ${
                tab === k ? 'border-amber-500/60 bg-amber-500/15 text-amber-100' : 'border-white/10 text-slate-400 hover:text-slate-200'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'loadlines' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_minmax(0,1fr)]">
          <svg viewBox="0 0 200 170" className="w-full rounded-xl border border-white/10 bg-white/[0.02]" style={{ maxHeight: '185px' }}>
            <rect x="0" y="120" width="200" height="50" fill="#0e7490" opacity="0.12" />
            <circle cx="66" cy="85" r="15" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
            <line x1="42" y1="85" x2="90" y2="85" stroke="#e2e8f0" strokeWidth="2.5" />
            <line x1="120" y1="40" x2="120" y2="130" stroke="#e2e8f0" strokeWidth="2" />
            {MARKS.map(m => (
              <g key={m.key}>
                <line x1="120" y1={85 + m.dy} x2="146" y2={85 + m.dy} stroke={m.color} strokeWidth="2.2" />
                <text x="151" y={88 + m.dy} fill={m.color} fontSize="8.5" fontFamily="monospace" fontWeight="bold">{m.key}</text>
              </g>
            ))}
          </svg>
          <div>
            <p className="text-xs leading-relaxed text-slate-400">
              The Plimsoll disc and its comb are painted amidships — a MINIMUM-freeboard rule: each line is the deepest
              legal waterline for a zone and season. The world&rsquo;s oceans are carved into <span className="text-slate-200">tropical,
              summer and winter zones</span> (with seasonal dates), and the governing mark for the voyage is the harshest
              zone the ship will CROSS while loaded — a winter-zone passage caps the whole lift.
            </p>
            <div className="mt-2 space-y-1">
              {MARKS.map(m => (
                <div key={m.key} className="flex items-baseline gap-2 font-mono text-[10px]">
                  <span className="w-9 shrink-0 font-bold" style={{ color: m.color }}>{m.key}</span>
                  <span className="text-slate-400">{m.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'salinity' && (
        <div>
          <svg viewBox="0 0 560 150" className="w-full" style={{ maxHeight: '170px' }}>
            {[{ x0: 40, rho: 'Salt water · ρ 1.025', wl: 70, note: 'floats AT her summer mark', c: '#f59e0b' },
              { x0: 300, rho: 'Fresh water · ρ 1.000', wl: 58, note: 'SAME weight — sinks deeper by the FWA', c: '#22d3ee' }].map((sc, i) => (
              <g key={i}>
                <rect x={sc.x0 - 10} y={sc.wl} width={240} height={150 - sc.wl} fill="#0e7490" opacity="0.12" />
                <line x1={sc.x0 - 10} y1={sc.wl} x2={sc.x0 + 230} y2={sc.wl} stroke={sc.c} strokeWidth="1" strokeDasharray="5 3" opacity="0.7" />
                {/* hull */}
                <path d={`M ${sc.x0 + 30} 40 L ${sc.x0 + 180} 40 L ${sc.x0 + 196} 64 L ${sc.x0 + 180} 96 L ${sc.x0 + 44} 96 Q ${sc.x0 + 24} 96 ${sc.x0 + 30} 40 Z`}
                  fill="rgba(148,163,184,0.10)" stroke="#94a3b8" strokeWidth="1.1" />
                {/* summer mark on hull at fixed hull position */}
                <line x1={sc.x0 + 100} y1={70} x2={sc.x0 + 124} y2={70} stroke="#f59e0b" strokeWidth="2" />
                <text x={sc.x0 + 128} y={73} fill="#f59e0b" fontSize="8" fontFamily="monospace">S</text>
                <text x={sc.x0 + 110} y={30} textAnchor="middle" fill={sc.c} fontSize="8.5" fontFamily="monospace" fontWeight="bold">{sc.rho}</text>
                <text x={sc.x0 + 110} y={122} textAnchor="middle" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">{sc.note}</text>
              </g>
            ))}
          </svg>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Fresh water is less buoyant, so the identical ship sits deeper — her summer mark goes UNDER water. That is
            legal in the river: the <span className="text-slate-200">FWA (fresh water allowance ≈ displacement ÷ 4×TPC)</span> is
            exactly how far she may submerge the mark, because she RISES back to it on reaching the sea. Brackish water
            interpolates via the <span className="text-slate-200">DWA</span>. Loading upriver, salinity is free cargo — the
            exercise below prices it in tonnes.
          </p>
        </div>
      )}

      {tab === 'tides' && (
        <div>
          <svg viewBox="0 0 560 170" className="w-full" style={{ maxHeight: '190px' }}>
            {/* window shading */}
            {points.slice(0, -1).map((p, i) => inWindow(p.depth) && (
              <rect key={i} x={xH(p.h)} y={20} width={xH(points[i + 1].h) - xH(p.h)} height={130} fill="#34d399" opacity="0.08" />
            ))}
            {/* needed depth line */}
            <line x1={40} y1={yD(NEED)} x2={520} y2={yD(NEED)} stroke="#f43f5e" strokeWidth="1.3" strokeDasharray="6 4" />
            <text x={524} y={yD(NEED) + 3} fill="#f43f5e" fontSize="7.5" fontFamily="monospace">draft + UKC</text>
            {/* charted depth */}
            <line x1={40} y1={yD(DATUM)} x2={520} y2={yD(DATUM)} stroke="#64748b" strokeWidth="1" />
            <text x={524} y={yD(DATUM) + 3} fill="#64748b" fontSize="7.5" fontFamily="monospace">chart datum</text>
            {/* tide curve */}
            <path d={points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xH(p.h)} ${yD(p.depth)}`).join(' ')}
              fill="none" stroke="#22d3ee" strokeWidth="1.8" />
            {/* axis */}
            <line x1={40} y1={150} x2={520} y2={150} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            {[0, 6, 12, 18, 24].map(h => (
              <text key={h} x={xH(h)} y={162} textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="monospace">{h}h</text>
            ))}
            <text x={44} y={30} fill="#34d399" fontSize="8" fontFamily="monospace">green = the sailing window</text>
          </svg>
          <div className="mt-1 flex items-center gap-3">
            <span className="shrink-0 font-mono text-[10px] text-slate-500">Tidal range {tide.toFixed(1)} m</span>
            <input type="range" min={0.4} max={3} step={0.1} value={tide} aria-label="Tidal range"
              onChange={e => setTide(Number(e.target.value))} className="h-1.5 w-full cursor-pointer accent-brand-cyan" />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            The chart gives depth at <span className="text-slate-200">datum</span> (a conservative low); the tide adds water
            on a predictable curve. The ship can only sail while <span className="text-slate-200">datum + tide ≥ draft + under-keel
            clearance</span> — the green <span className="text-emerald-300">tide window</span>. Shrink the range and watch the
            window close: deep-loaded sailings are BOOKED on these windows, and missing one costs a full tidal cycle —
            or the cargo that made the ship this deep.
          </p>
        </div>
      )}
    </div>
  )
}
