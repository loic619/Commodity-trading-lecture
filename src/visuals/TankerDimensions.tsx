'use client'

import { useState } from 'react'
import { defineVisualText, useVisualText } from '@/lib/visualText'

// The tanker, measured: an annotated side view with every dimension a
// charterer checks before fixing — click a dimension to see what it is and
// which restriction it runs into. All labels editable via Graphic text.
export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'The tanker, measured — every dimension is a restriction somewhere' },
  caption: { label: 'Closing caption', multiline: true, value: 'Read the ship the way a terminal does: LOA against the berth length, beam against the canal lock, draft against the channel, air draft against the bridge, WLTHC against the shore arms. A vessel is never “too big” in the abstract — it is too big for a specific berth, on a specific tide, at a specific draft.' },
})

type Dim = {
  key: string
  name: string
  what: string
  bites: string
  color: string
}

const DIMS: Dim[] = [
  {
    key: 'loa', name: 'LOA — Length Over All',
    what: 'The extreme length of the ship, bow tip to stern tip. The first number a berth asks for.',
    bites: 'Berth and lock length limits; some terminals cap LOA outright (e.g. “max LOA 250 m”). Panama locks historically capped LOA at 289.6 m.',
    color: '#3b82f6',
  },
  {
    key: 'lbp', name: 'LBP — Length Between Perpendiculars',
    what: 'Length between the forward perpendicular (where the bow cuts the waterline) and the rudder stock. The naval-architect’s length, used in stability and mooring calculations.',
    bites: 'Mooring-pattern fit: fairleads and winches are positioned off LBP, so a berth’s hook layout may reject a ship whose LOA looked fine.',
    color: '#22d3ee',
  },
  {
    key: 'beam', name: 'Beam',
    what: 'Maximum breadth of the hull.',
    bites: 'Canal locks (old Panama: 32.3 m — the original “Panamax” constraint), berth width between dolphins, and lightering alongside.',
    color: '#8b5cf6',
  },
  {
    key: 'draft', name: 'Draft',
    what: 'Vertical distance from the waterline to the keel. Grows as cargo goes in — the loadline sets the legal maximum (see the capacity exercise below).',
    bites: 'Channel and berth depth, tide windows, river bars (draft restrictions are THE classic short-lift cause), under-keel clearance rules.',
    color: '#f59e0b',
  },
  {
    key: 'airdraft', name: 'Air draft',
    what: 'Waterline to the highest fixed point (usually the mast). Shrinks as the ship loads deeper.',
    bites: 'Bridges and overhead cables on river transits (the Bonny River, the Mississippi under the Huey P. Long bridge…). A light ship can fail an air-draft limit a loaded one passes.',
    color: '#34d399',
  },
  {
    key: 'wlthc', name: 'WLTHC — Waterline To Top of Hatch Coaming',
    what: 'Height of the cargo manifold connection above the water — quoted in ballast and loaded conditions.',
    bites: 'Shore loading arms have a working envelope: too high in ballast (or too low fully laden) and the arms cannot connect — a vetting question on every terminal questionnaire (Q88).',
    color: '#f43f5e',
  },
  {
    key: 'manifold', name: 'Manifold',
    what: 'The bank of flanged connections amidships where cargo crosses ship/shore. Its position, spacing, and reducer sizes are standardised (OCIMF recommendations).',
    bites: 'Berth fit again: the manifold must land within reach of the arms once moored — which fixes where along the berth the ship must sit.',
    color: '#e2e8f0',
  },
  {
    key: 'freeboard', name: 'Freeboard',
    what: 'Waterline to main deck. The loadline convention is literally a MINIMUM-freeboard rule: reserve buoyancy the ship must keep.',
    bites: 'Determines how much the ship may load in each loadline zone and season — the subject of the exercise below.',
    color: '#94a3b8',
  },
]

export default function TankerDimensions() {
  const t = useVisualText(textDef)
  const [sel, setSel] = useState(0)
  const d = DIMS[sel]

  const W = 560, H = 240
  // Hull geometry (side view): waterline at y=150, keel at 190, deck at 118
  const keel = 190, wl = 150, deck = 118
  const bowX = 505, sternX = 60
  const active = (k: string) => d.key === k

  const dimLine = (x1: number, y1: number, x2: number, y2: number, key: string, label: string, labelPos: { x: number; y: number }) => (
    <g opacity={active(key) ? 1 : 0.38} style={{ cursor: 'pointer' }} onClick={() => setSel(DIMS.findIndex(dd => dd.key === key))}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={DIMS.find(dd => dd.key === key)!.color} strokeWidth={active(key) ? 1.8 : 1.1} markerStart="url(#td-arr-s)" markerEnd="url(#td-arr-e)" />
      <text x={labelPos.x} y={labelPos.y} textAnchor="middle" fill={DIMS.find(dd => dd.key === key)!.color} fontSize="8.5" fontFamily="monospace" fontWeight={active(key) ? 'bold' : 'normal'}>{label}</text>
    </g>
  )

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-3 text-brand-cyan">{t('heading')}</div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '250px' }}>
        <defs>
          <marker id="td-arr-e" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#94a3b8" /></marker>
          <marker id="td-arr-s" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto-start-reverse"><path d="M0,0 L6,3 L0,6 z" fill="#94a3b8" /></marker>
        </defs>

        {/* water */}
        <rect x="0" y={wl} width={W} height={H - wl} fill="#0e7490" opacity="0.12" />
        <line x1="0" y1={wl} x2={W} y2={wl} stroke="#22d3ee" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.6" />
        <text x={W - 4} y={wl - 4} textAnchor="end" fill="#22d3ee" fontSize="7" fontFamily="monospace" opacity="0.7">waterline</text>

        {/* hull: stern, flat bottom, raked bow */}
        <path d={`M ${sternX} ${deck} L ${bowX - 40} ${deck} L ${bowX} ${wl} L ${bowX - 28} ${keel} L ${sternX + 18} ${keel} Q ${sternX - 10} ${keel} ${sternX} ${deck} Z`}
          fill="rgba(148,163,184,0.10)" stroke="#94a3b8" strokeWidth="1.2" />
        {/* accommodation block + mast aft */}
        <rect x={sternX + 22} y={deck - 34} width={40} height={34} rx="2" fill="rgba(148,163,184,0.12)" stroke="#94a3b8" strokeWidth="0.9" />
        <line x1={sternX + 42} y1={deck - 34} x2={sternX + 42} y2={deck - 52} stroke="#94a3b8" strokeWidth="1.2" />
        {/* manifold amidships */}
        <g style={{ cursor: 'pointer' }} onClick={() => setSel(DIMS.findIndex(dd => dd.key === 'manifold'))} opacity={active('manifold') ? 1 : 0.55}>
          <rect x={278} y={deck - 10} width={16} height={10} fill={active('manifold') ? '#e2e8f0' : 'rgba(226,232,240,0.4)'} rx="1.5" />
          <text x={286} y={deck - 14} textAnchor="middle" fill="#e2e8f0" fontSize="7.5" fontFamily="monospace" fontWeight={active('manifold') ? 'bold' : 'normal'}>manifold</text>
        </g>
        {/* tank segregation hints */}
        {[150, 215, 310, 375, 435].map(x => <line key={x} x1={x} y1={deck + 4} x2={x} y2={keel - 4} stroke="rgba(148,163,184,0.25)" strokeWidth="0.7" strokeDasharray="3 3" />)}

        {/* dimension arrows */}
        {dimLine(sternX, 210, bowX, 210, 'loa', 'LOA', { x: 285, y: 224 })}
        {dimLine(sternX + 8, 200, bowX - 12, 200, 'lbp', 'LBP', { x: 285, y: 197 })}
        {dimLine(530, wl, 530, keel, 'draft', 'draft', { x: 526, y: 176 })}
        {dimLine(20, wl, 20, deck, 'freeboard', 'freeboard', { x: 32, y: 138 })}
        {dimLine(sternX + 42 + 14, wl, sternX + 42 + 14, deck - 52, 'airdraft', 'air draft', { x: 140, y: 100 })}
        {dimLine(286 + 24, wl, 286 + 24, deck - 6, 'wlthc', 'WLTHC', { x: 330, y: 122 })}
        {/* beam: top-view inset */}
        <g opacity={active('beam') ? 1 : 0.38} style={{ cursor: 'pointer' }} onClick={() => setSel(DIMS.findIndex(dd => dd.key === 'beam'))}>
          <ellipse cx={430} cy={52} rx={70} ry={16} fill="rgba(148,163,184,0.10)" stroke="#94a3b8" strokeWidth="1" />
          <line x1={430} y1={36} x2={430} y2={68} stroke="#8b5cf6" strokeWidth={active('beam') ? 1.8 : 1.1} markerStart="url(#td-arr-s)" markerEnd="url(#td-arr-e)" />
          <text x={452} y={55} fill="#8b5cf6" fontSize="8.5" fontFamily="monospace" fontWeight={active('beam') ? 'bold' : 'normal'}>beam</text>
          <text x={430} y={26} textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace">top view</text>
        </g>
      </svg>

      {/* dimension chips */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {DIMS.map((dd, i) => (
          <button key={dd.key} type="button" onClick={() => setSel(i)}
            className={`rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold transition-all ${
              i === sel ? 'bg-white/[0.08] text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            style={{ borderColor: i === sel ? dd.color : 'rgba(255,255,255,0.1)', color: i === sel ? dd.color : undefined }}>
            {dd.name.split(' — ')[0]}
          </button>
        ))}
      </div>

      {/* selected dimension */}
      <div className="mt-2 rounded-xl border p-3" style={{ borderColor: d.color + '55', backgroundColor: d.color + '0d' }}>
        <div className="font-mono text-xs font-bold" style={{ color: d.color }}>{d.name}</div>
        <p className="mt-1 text-xs leading-relaxed text-slate-300">{d.what}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-400"><span className="font-bold text-slate-300">Where it bites: </span>{d.bites}</p>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-400">{t('caption')}</p>
    </div>
  )
}
