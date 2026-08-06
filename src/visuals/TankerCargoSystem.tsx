'use client'

import { useState } from 'react'

// The cargo system, drawn: a cutaway of the cargo block with each system —
// coatings, heating, IGS, segregations, venting (WVNS), slops & pumps —
// highlightable. Click a system chip to see it on the ship and read where
// it matters commercially.
type Sys = { key: string; name: string; color: string; what: string; bites: string }

const SYSTEMS: Sys[] = [
  {
    key: 'segregations', name: 'Segregations', color: '#f59e0b',
    what: 'Independent tank + line + pump groups. Here: segregation A (amber, tanks 1–3) and segregation B (cyan, tanks 4–6) — two grades that never share steel or pipe.',
    bites: 'Sets how many parcels the ship can carry without contamination — the first question in products and chemicals. A "two-segregation" ship cannot load three grades.',
  },
  {
    key: 'coatings', name: 'Coatings', color: '#34d399',
    what: 'Epoxy (clean products) or zinc (chemicals) lining the tank steel; bare steel = crude service only.',
    bites: 'Decides clean vs dirty trading. Loading dirty cargo into coated tanks means an expensive cleaning campaign — and re-approval — before going clean again.',
  },
  {
    key: 'heating', name: 'Heating coils', color: '#f43f5e',
    what: 'Steam or thermal-oil coils on the tank bottoms holding fuel oil, heavy crudes or bitumen at the instructed temperature.',
    bites: 'Cargo allowed to cool sets solid: unpumpable at discharge, ROB claims, days of reheating. Heating instructions live in the CP — extra heating is billable if logged.',
  },
  {
    key: 'igs', name: 'IGS — inert gas', color: '#8b5cf6',
    what: 'Flue/generator gas (O₂ < 8%) fed along the deck main into every tank ullage, so the atmosphere above the cargo cannot burn.',
    bites: 'Mandatory on crude carriers; the terminal verifies it BEFORE cargo ops. No working IGS, no berth — and COW at discharge requires it running.',
  },
  {
    key: 'venting', name: 'Venting / vapours (WVNS)', color: '#22d3ee',
    what: 'P/V valves and vent masts managing tank pressure as cargo and temperature move; vapour-return manifold where terminals take vapours ashore.',
    bites: 'The vent lineup must respect segregation — a shared vent line contaminates as surely as a shared pump. Vapour-lock stoppages during loading burn laytime.',
  },
  {
    key: 'slops', name: 'Slops & pump stack', color: '#3b82f6',
    what: 'Slop tanks (aft) receive tank washings and line displacements; the pump room drives discharge through the bottom lines.',
    bites: 'The pump stack sets discharge rate against shore back pressure — the pumping-warranty fight of Module 3. Slop capacity loaded with cargo today is a grade-switch problem tomorrow.',
  },
]

const TANKS = [
  { x: 96, seg: 'A' }, { x: 158, seg: 'A' }, { x: 220, seg: 'A' },
  { x: 282, seg: 'B' }, { x: 344, seg: 'B' }, { x: 406, seg: 'B' },
]

export default function TankerCargoSystem() {
  const [sel, setSel] = useState(0)
  const s = SYSTEMS[sel]
  const on = (k: string) => s.key === k
  const segColor = (seg: string) => (seg === 'A' ? '#f59e0b' : '#22d3ee')

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-3 text-brand-cyan">Inside the hull — the cargo system, system by system</div>

      <svg viewBox="0 0 560 210" className="w-full" style={{ maxHeight: '230px' }}>
        {/* hull outline */}
        <path d="M 40 60 L 490 60 L 530 100 L 500 170 L 60 170 Q 30 170 40 60 Z"
          fill="rgba(148,163,184,0.06)" stroke="#94a3b8" strokeWidth="1.2" />
        {/* pump room + engine aft */}
        <rect x={52} y={90} width={34} height={70} rx="3" fill="rgba(59,130,246,0.10)" stroke={on('slops') ? '#3b82f6' : 'rgba(148,163,184,0.35)'} strokeWidth={on('slops') ? 1.8 : 0.9} />
        <text x={69} y={128} textAnchor="middle" fill={on('slops') ? '#3b82f6' : '#64748b'} fontSize="7" fontFamily="monospace">PUMP</text>
        <text x={69} y={137} textAnchor="middle" fill={on('slops') ? '#3b82f6' : '#64748b'} fontSize="7" fontFamily="monospace">ROOM</text>
        {/* slop tanks */}
        <rect x={52} y={64} width={34} height={22} rx="2" fill={on('slops') ? 'rgba(59,130,246,0.25)' : 'rgba(148,163,184,0.08)'} stroke={on('slops') ? '#3b82f6' : 'rgba(148,163,184,0.3)'} strokeWidth="1" />
        <text x={69} y={78} textAnchor="middle" fill={on('slops') ? '#93c5fd' : '#64748b'} fontSize="6.5" fontFamily="monospace">SLOPS</text>

        {/* cargo tanks */}
        {TANKS.map((t, i) => {
          const c = segColor(t.seg)
          const dim = on('segregations') ? 1 : on('coatings') || on('heating') ? 0.55 : 0.4
          return (
            <g key={i}>
              <rect x={t.x} y={66} width={56} height={98} rx="3"
                fill={`${c}${on('segregations') ? '33' : '14'}`}
                stroke={c} strokeWidth={on('segregations') ? 1.6 : 0.8} opacity={dim} />
              <text x={t.x + 28} y={80} textAnchor="middle" fill={c} fontSize="7" fontFamily="monospace" opacity={dim}>{i + 1}{t.seg}</text>
              {/* coating lining */}
              {on('coatings') && (
                <rect x={t.x + 3} y={69} width={50} height={92} rx="2" fill="none" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2" />
              )}
              {/* heating coils */}
              <path d={`M ${t.x + 6} 156 h 44 m -44 -7 h 44 m -44 -7 h 44`}
                stroke="#f43f5e" strokeWidth={on('heating') ? 1.8 : 0.7} opacity={on('heating') ? 1 : 0.25} fill="none" />
            </g>
          )
        })}

        {/* IGS deck main */}
        <line x1={90} y1={54} x2={470} y2={54} stroke="#8b5cf6" strokeWidth={on('igs') ? 2.2 : 0.9} opacity={on('igs') ? 1 : 0.3} />
        {TANKS.map((t, i) => (
          <line key={i} x1={t.x + 28} y1={54} x2={t.x + 28} y2={66} stroke="#8b5cf6" strokeWidth={on('igs') ? 1.6 : 0.7} opacity={on('igs') ? 1 : 0.25} />
        ))}
        <text x={475} y={52} fill="#8b5cf6" fontSize="7" fontFamily="monospace" opacity={on('igs') ? 1 : 0.4}>IGS main</text>

        {/* vent masts / PV valves */}
        {[158, 344].map((x, i) => (
          <g key={i} opacity={on('venting') ? 1 : 0.3}>
            <line x1={x + 28} y1={46} x2={x + 28} y2={64} stroke="#22d3ee" strokeWidth={on('venting') ? 2 : 0.9} />
            <circle cx={x + 28} cy={42} r={on('venting') ? 4 : 2.5} fill="none" stroke="#22d3ee" strokeWidth="1.4" />
          </g>
        ))}
        <text x={386} y={40} fill="#22d3ee" fontSize="7" fontFamily="monospace" opacity={on('venting') ? 1 : 0.4}>P/V · vent mast</text>

        {/* bottom cargo lines to pump room */}
        <line x1={86} y1={168} x2={460} y2={168} stroke={on('slops') ? '#3b82f6' : '#475569'} strokeWidth={on('slops') ? 2 : 0.8} opacity={on('slops') ? 1 : 0.5} />
      </svg>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {SYSTEMS.map((sys, i) => (
          <button key={sys.key} type="button" onClick={() => setSel(i)}
            className={`rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold transition-all ${
              i === sel ? 'bg-white/[0.08]' : 'text-slate-400 hover:text-slate-200'
            }`}
            style={{ borderColor: i === sel ? sys.color : 'rgba(255,255,255,0.1)', color: i === sel ? sys.color : undefined }}>
            {sys.name}
          </button>
        ))}
      </div>

      <div className="mt-2 rounded-xl border p-3" style={{ borderColor: s.color + '55', backgroundColor: s.color + '0d' }}>
        <div className="font-mono text-xs font-bold" style={{ color: s.color }}>{s.name}</div>
        <p className="mt-1 text-xs leading-relaxed text-slate-300">{s.what}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-400"><span className="font-bold text-slate-300">Where it bites: </span>{s.bites}</p>
      </div>
    </div>
  )
}
