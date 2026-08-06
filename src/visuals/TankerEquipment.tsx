'use client'

import { useState } from 'react'

// The deck hardware, from above: mooring stations, the manifold and its
// crane, reducers, gangway and fenders — each item clickable, each with the
// terminal-questionnaire reason it gets checked.
type Item = { key: string; name: string; color: string; what: string; check: string }

const ITEMS: Item[] = [
  {
    key: 'mooring', name: 'Mooring winches & ropes', color: '#3b82f6',
    what: 'Winches, fairleads and the rope/wire outfit at bow and stern. The terminal’s mooring plan (e.g. a 4-2-2 pattern: 4 headlines, 2 breasts, 2 springs each end) must be deliverable with the ship’s own equipment.',
    check: 'OCIMF MEG4: rope condition, brake holding capacity, winch layout. A ship that cannot deploy the required pattern does not berth — and a parted line in a swell is the classic SSSCL stoppage.',
  },
  {
    key: 'crane', name: 'Hose crane / derrick', color: '#f59e0b',
    what: 'The midship crane that lifts cargo hoses (or supports the shore arms) to the manifold. At SBM buoys and every STS operation, the ship’s crane does ALL the lifting.',
    check: 'Minimum SWL at the manifold (typically 10 t for hose work), test certificates, reach over the manifold. No crane capacity, no buoy loading — a nomination filter, not a detail.',
  },
  {
    key: 'manifold', name: 'Manifold & reducers', color: '#f43f5e',
    what: 'The flanged crossover bank amidships, built to OCIMF standard spacing and height, with reducers to adapt ship flange sizes to the shore arms, drip trays and spill containment beneath.',
    check: 'Q88 lists every flange size and the reducer inventory. A missing 12"→8" reducer is a berth delay measured in laytime; manifold position fixes where along the berth the ship must moor.',
  },
  {
    key: 'gangway', name: 'Gangway & access', color: '#34d399',
    what: 'The accommodation ladder / gangway landing safe access between ship and shore, with net, lighting and watchkeeper.',
    check: 'ISGOTT safe-access rules: surveyors, agents and the loading master must board safely or operations pause — cheap kit, expensive when it fails an inspection.',
  },
  {
    key: 'fenders', name: 'Fenders & STS kit', color: '#22d3ee',
    what: 'Primary and secondary fenders, transfer hoses and the mooring-master arrangements for ship-to-ship work; on terminals, the berth provides fendering the hull must suit.',
    check: 'STS per the approved plan (MARPOL ch. 8): fender certificates, hose test dates. Double-banking at a berth needs the OUTBOARD ship’s full kit too.',
  },
  {
    key: 'towing', name: 'Emergency towing & escort', color: '#8b5cf6',
    what: 'Emergency towing arrangements fore and aft (mandatory on tankers ≥ 20,000 dwt), plus the escort-tug fittings some terminals require.',
    check: 'The vetting inspector sights them; ports like Rotterdam mandate escort readiness in the channel — one more line where hardware and clearance meet.',
  },
]

export default function TankerEquipment() {
  const [sel, setSel] = useState(0)
  const it = ITEMS[sel]
  const on = (k: string) => it.key === k

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-3 text-brand-cyan">The deck from above — the hardware the terminal checks</div>

      <svg viewBox="0 0 560 190" className="w-full" style={{ maxHeight: '210px' }}>
        {/* deck plan outline */}
        <path d="M 60 55 L 440 55 Q 530 95 440 135 L 60 135 Q 36 95 60 55 Z"
          fill="rgba(148,163,184,0.07)" stroke="#94a3b8" strokeWidth="1.2" />
        <text x={500} y={98} fill="#64748b" fontSize="7" fontFamily="monospace">BOW →</text>

        {/* mooring stations bow & stern: winches + lines to bollards */}
        {[{ cx: 430, dir: 1 }, { cx: 78, dir: -1 }].map((st, i) => (
          <g key={i} opacity={on('mooring') ? 1 : 0.35}>
            <circle cx={st.cx} cy={80} r="5" fill="none" stroke="#3b82f6" strokeWidth={on('mooring') ? 1.8 : 1} />
            <circle cx={st.cx} cy={110} r="5" fill="none" stroke="#3b82f6" strokeWidth={on('mooring') ? 1.8 : 1} />
            {[68, 88, 122].map((y, j) => (
              <line key={j} x1={st.cx} y1={y > 95 ? 110 : 80} x2={st.cx + st.dir * 60} y2={y > 95 ? y + 30 : y - 32}
                stroke="#3b82f6" strokeWidth={on('mooring') ? 1.3 : 0.6} strokeDasharray="4 3" opacity="0.8" />
            ))}
          </g>
        ))}
        <text x={430} y={44} textAnchor="middle" fill="#3b82f6" fontSize="7" fontFamily="monospace" opacity={on('mooring') ? 1 : 0.4}>headlines · breasts · springs</text>

        {/* manifold amidships + drip tray */}
        <g opacity={on('manifold') ? 1 : 0.4}>
          <rect x={236} y={88} width={48} height={14} rx="2" fill={on('manifold') ? 'rgba(244,63,94,0.25)' : 'rgba(148,163,184,0.1)'} stroke="#f43f5e" strokeWidth={on('manifold') ? 1.8 : 0.9} />
          {[244, 254, 264, 274].map(x => <circle key={x} cx={x} cy={95} r="2.6" fill="none" stroke="#f43f5e" strokeWidth="1.1" />)}
          <rect x={232} y={104} width={56} height={5} rx="1.5" fill="none" stroke="#f43f5e" strokeWidth="0.8" strokeDasharray="2 2" />
          <text x={260} y={120} textAnchor="middle" fill="#f43f5e" fontSize="7" fontFamily="monospace">manifold + drip tray</text>
        </g>

        {/* crane */}
        <g opacity={on('crane') ? 1 : 0.4}>
          <circle cx={300} cy={72} r="4" fill="none" stroke="#f59e0b" strokeWidth={on('crane') ? 1.8 : 1} />
          <line x1={300} y1={72} x2={264} y2={90} stroke="#f59e0b" strokeWidth={on('crane') ? 1.8 : 1} />
          <text x={318} y={68} textAnchor="middle" fill="#f59e0b" fontSize="7" fontFamily="monospace">crane SWL 10 t</text>
        </g>

        {/* gangway */}
        <g opacity={on('gangway') ? 1 : 0.35}>
          <line x1={180} y1={135} x2={160} y2={168} stroke="#34d399" strokeWidth={on('gangway') ? 2 : 1} />
          <text x={196} y={168} textAnchor="middle" fill="#34d399" fontSize="7" fontFamily="monospace">gangway</text>
        </g>

        {/* fenders along the hull */}
        {[220, 260, 300, 340].map(x => (
          <ellipse key={x} cx={x} cy={139} rx="9" ry="4" fill="none" stroke="#22d3ee"
            strokeWidth={on('fenders') ? 1.6 : 0.7} opacity={on('fenders') ? 1 : 0.3} />
        ))}
        <text x={280} y={156} textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace" opacity={on('fenders') ? 1 : 0.35}>fenders / STS side</text>

        {/* emergency towing */}
        <g opacity={on('towing') ? 1 : 0.3}>
          <path d={`M 452 95 q 18 0 24 -8`} stroke="#8b5cf6" strokeWidth={on('towing') ? 2 : 1} fill="none" />
          <path d={`M 52 95 q -14 0 -18 -8`} stroke="#8b5cf6" strokeWidth={on('towing') ? 2 : 1} fill="none" />
          <text x={470} y={78} fill="#8b5cf6" fontSize="7" fontFamily="monospace">emcy towing</text>
        </g>
      </svg>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {ITEMS.map((item, i) => (
          <button key={item.key} type="button" onClick={() => setSel(i)}
            className={`rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold transition-all ${
              i === sel ? 'bg-white/[0.08]' : 'text-slate-400 hover:text-slate-200'
            }`}
            style={{ borderColor: i === sel ? item.color : 'rgba(255,255,255,0.1)', color: i === sel ? item.color : undefined }}>
            {item.name}
          </button>
        ))}
      </div>

      <div className="mt-2 rounded-xl border p-3" style={{ borderColor: it.color + '55', backgroundColor: it.color + '0d' }}>
        <div className="font-mono text-xs font-bold" style={{ color: it.color }}>{it.name}</div>
        <p className="mt-1 text-xs leading-relaxed text-slate-300">{it.what}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-400"><span className="font-bold text-slate-300">What gets checked: </span>{it.check}</p>
      </div>
    </div>
  )
}
