'use client'

import { useState } from 'react'

// The single voyage contract as a cast of characters: who owes what to whom.
// Click a party to read their duties; the arrows carry the key obligations.
type Party = { key: string; name: string; color: string; x: number; y: number; role: string; duties: string[] }

const PARTIES: Party[] = [
  {
    key: 'owner', name: 'OWNER', color: '#3b82f6', x: 110, y: 60,
    role: 'Provides the ship — and answers for her.',
    duties: [
      'Seaworthiness & cargoworthiness at the start of the voyage',
      'Due despatch — proceed without unjustified delay or deviation',
      'Care of the cargo from loading to discharge',
      'Tender a valid NOR at each port (the 4 Ws)',
    ],
  },
  {
    key: 'charterer', name: 'CHARTERER', color: '#f59e0b', x: 450, y: 60,
    role: 'Provides the cargo — and the voyage’s decisions.',
    duties: [
      'Provide the cargo within the agreed quantity tolerance',
      'Nominate SAFE ports and berths (safe to reach, use and leave)',
      'Load/discharge within laytime — pay demurrage beyond it',
      'Pay freight — famously "without deduction"',
    ],
  },
  {
    key: 'broker', name: 'BROKER', color: '#8b5cf6', x: 280, y: 34,
    role: 'The intermediary — never a principal.',
    duties: [
      'Carries every offer and counter between the principals',
      'Drafts the fixture recap — the binding record',
      'Follows the voyage and its claims afterwards',
      'Paid by commission on freight (typically 1.25% per broker)',
    ],
  },
  {
    key: 'master', name: 'MASTER', color: '#34d399', x: 190, y: 152,
    role: 'The owner’s servant on board — with two masters in practice.',
    duties: [
      'Commands the ship for the OWNER (navigation, safety, crew)',
      'But follows the CHARTERER’s voyage orders (ports, cargo ops)',
      'Signs (or clauses) the Bills of Lading',
      'Issues NORs and notes of protest — the voyage’s key paperwork',
    ],
  },
  {
    key: 'agent', name: 'AGENT', color: '#f43f5e', x: 370, y: 152,
    role: 'The port representative — eyes and hands ashore.',
    duties: [
      'Clears the ship inward/outward: customs, immigration, pratique',
      'Books pilots, tugs, berths — on prepaid funding (the proforma DA)',
      'Collects and circulates the Statement of Facts',
      'May serve owner OR charterer — know whose agent signs what',
    ],
  },
]

const ARROWS: { from: string; to: string; label: string; dash?: boolean }[] = [
  { from: 'owner', to: 'broker', label: 'offers' },
  { from: 'broker', to: 'charterer', label: 'counters' },
  { from: 'owner', to: 'master', label: 'employment' },
  { from: 'charterer', to: 'master', label: 'voyage orders', dash: true },
  { from: 'master', to: 'agent', label: 'port calls' },
  { from: 'charterer', to: 'agent', label: 'nominations', dash: true },
]

export default function VoyageParties() {
  const [sel, setSel] = useState(0)
  const p = PARTIES[sel]
  const at = (k: string) => PARTIES.find(pp => pp.key === k)!

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-3 text-brand-cyan">The voyage&rsquo;s cast — who owes what to whom</div>

      <svg viewBox="0 0 560 190" className="w-full" style={{ maxHeight: '210px' }}>
        {ARROWS.map((a, i) => {
          const f = at(a.from), t = at(a.to)
          const hot = p.key === a.from || p.key === a.to
          return (
            <g key={i} opacity={hot ? 1 : 0.3}>
              <line x1={f.x} y1={f.y} x2={t.x} y2={t.y} stroke={hot ? f.color : '#64748b'}
                strokeWidth={hot ? 1.6 : 1} strokeDasharray={a.dash ? '5 4' : undefined} />
              <text x={(f.x + t.x) / 2} y={(f.y + t.y) / 2 - 5} textAnchor="middle"
                fill={hot ? '#e2e8f0' : '#64748b'} fontSize="7" fontFamily="monospace">{a.label}</text>
            </g>
          )
        })}
        {PARTIES.map((pp, i) => (
          <g key={pp.key} onClick={() => setSel(i)} style={{ cursor: 'pointer' }}>
            <rect x={pp.x - 46} y={pp.y - 15} width={92} height={30} rx="15"
              fill={i === sel ? `${pp.color}26` : 'rgba(255,255,255,0.03)'}
              stroke={pp.color} strokeWidth={i === sel ? 1.8 : 1} />
            <text x={pp.x} y={pp.y + 4} textAnchor="middle" fill={pp.color} fontSize="10" fontFamily="monospace" fontWeight="bold">{pp.name}</text>
          </g>
        ))}
      </svg>

      <div className="mt-2 rounded-xl border p-3" style={{ borderColor: p.color + '55', backgroundColor: p.color + '0d' }}>
        <div className="font-mono text-xs font-bold" style={{ color: p.color }}>{p.name} — {p.role}</div>
        <ul className="mt-1.5 space-y-1">
          {p.duties.map((d, i) => (
            <li key={i} className="flex items-baseline gap-2 text-xs leading-relaxed text-slate-300">
              <span className="shrink-0 font-mono text-[10px]" style={{ color: p.color }}>▸</span>{d}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        Two lines to memorise: the Master serves the <span className="text-slate-300">owner</span> but follows the{' '}
        <span className="text-slate-300">charterer&rsquo;s</span> voyage orders (dashed arrows) — most on-board disputes live in
        that seam; and the broker is <span className="text-slate-300">never a principal</span>: the recap they draft binds the
        other four, not themselves.
      </p>
    </div>
  )
}
