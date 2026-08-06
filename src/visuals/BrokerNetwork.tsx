'use client'

import { useState } from 'react'

// The freight market's information plumbing: owners with positions on one
// side, charterers with cargoes on the other, competitive brokers in the
// middle seeing BOTH flows. Click a seat to see what the market looks like
// from that chair — the asymmetry IS the broker's product.
type Seat = 'owner' | 'broker' | 'charterer'

const VIEW: Record<Seat, { title: string; color: string; sees: string[]; blind: string }> = {
  owner: {
    title: 'From the owner’s chair', color: '#3b82f6',
    sees: [
      'Their OWN fleet: positions, TCE targets, next open dates',
      'The orders brokers choose to show them',
      'Published fixtures and index levels — yesterday’s market',
    ],
    blind: 'How many OTHER ships are quietly offered on the same cargo — the competition is invisible until the counter tells them.',
  },
  broker: {
    title: 'From the broker’s chair', color: '#8b5cf6',
    sees: [
      'EVERY order and EVERY position that crosses their desk',
      'Who is close on which cargo, and at what level talks stalled',
      'The flow: which routes are tightening TODAY, before the indices print',
    ],
    blind: 'Nothing structural — which is the point. The broker sells the whole board back to players who each see one row. Commission (1.25% per broker, owner pays) prices that sight.',
  },
  charterer: {
    title: 'From the charterer’s chair', color: '#f59e0b',
    sees: [
      'Their OWN cargo programme and budget levels',
      'The ships brokers offer against their order',
      'Last done on comparable stems — the negotiation anchor',
    ],
    blind: 'How long the ships list REALLY is for their dates — a laycan with one candidate prices very differently from one with five, and only the broker knows which it is.',
  },
}

const OWNERS = ['Aframax · open Rotterdam 8/3', 'Suezmax · open Malta 10/3', 'MR · open Antwerp 9/3']
const CHARTERERS = ['80 kt Bonny → UKC · 12–14/3', '130 kt Sidi Kerir → Med · 13–15/3', '37 kt gasoil ARA → WAF · 11–12/3']

export default function BrokerNetwork() {
  const [seat, setSeat] = useState<Seat>('broker')
  const v = VIEW[seat]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-3 text-brand-cyan">The market&rsquo;s plumbing — who sees what</div>

      <svg viewBox="0 0 560 180" className="w-full" style={{ maxHeight: '200px' }}>
        {/* owners column */}
        {OWNERS.map((o, i) => (
          <g key={i} opacity={seat === 'charterer' ? 0.35 : 1} onClick={() => setSeat('owner')} style={{ cursor: 'pointer' }}>
            <rect x={16} y={26 + i * 46} width={172} height={32} rx="8" fill={seat === 'owner' ? 'rgba(59,130,246,0.14)' : 'rgba(255,255,255,0.03)'}
              stroke="#3b82f6" strokeWidth={seat === 'owner' ? 1.6 : 0.9} />
            <text x={102} y={40 + i * 46} textAnchor="middle" fill="#93c5fd" fontSize="7.5" fontFamily="monospace">{o}</text>
            <text x={102} y={50 + i * 46} textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace">position</text>
            <line x1={188} y1={42 + i * 46} x2={238} y2={92} stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
          </g>
        ))}
        {/* charterers column */}
        {CHARTERERS.map((c, i) => (
          <g key={i} opacity={seat === 'owner' ? 0.35 : 1} onClick={() => setSeat('charterer')} style={{ cursor: 'pointer' }}>
            <rect x={372} y={26 + i * 46} width={172} height={32} rx="8" fill={seat === 'charterer' ? 'rgba(245,158,11,0.14)' : 'rgba(255,255,255,0.03)'}
              stroke="#f59e0b" strokeWidth={seat === 'charterer' ? 1.6 : 0.9} />
            <text x={458} y={40 + i * 46} textAnchor="middle" fill="#fcd34d" fontSize="7.5" fontFamily="monospace">{c}</text>
            <text x={458} y={50 + i * 46} textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace">order</text>
            <line x1={372} y1={42 + i * 46} x2={322} y2={92} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
          </g>
        ))}
        {/* broker hub */}
        <g onClick={() => setSeat('broker')} style={{ cursor: 'pointer' }}>
          <circle cx={280} cy={92} r={34} fill={seat === 'broker' ? 'rgba(139,92,246,0.18)' : 'rgba(255,255,255,0.03)'}
            stroke="#8b5cf6" strokeWidth={seat === 'broker' ? 2 : 1.1} />
          <text x={280} y={88} textAnchor="middle" fill="#c4b5fd" fontSize="9.5" fontFamily="monospace" fontWeight="bold">BROKER</text>
          <text x={280} y={100} textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace">sees both flows</text>
        </g>
        <text x={280} y={158} textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="monospace">offers ⇄ counters · recap · claims follow-up · 1.25% per broker on freight</text>
      </svg>

      <div className="mt-2 rounded-xl border p-3" style={{ borderColor: v.color + '55', backgroundColor: v.color + '0d' }}>
        <div className="font-mono text-xs font-bold" style={{ color: v.color }}>{v.title}</div>
        <ul className="mt-1.5 space-y-1">
          {v.sees.map((s, i) => (
            <li key={i} className="flex items-baseline gap-2 text-xs leading-relaxed text-slate-300">
              <span className="shrink-0 font-mono text-[10px]" style={{ color: v.color }}>▸</span>{s}
            </li>
          ))}
        </ul>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-400"><span className="font-bold text-slate-300">Blind spot: </span>{v.blind}</p>
      </div>
    </div>
  )
}
