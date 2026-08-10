'use client'

import { useState } from 'react'
import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'Coffee crop calendar' },
  o1: { label: 'Coffee · origin 1', value: 'Brazil (arabica) — May–Sep' },
  o2: { label: 'Coffee · origin 2', value: 'Vietnam (robusta) — Nov–Feb' },
  o3: { label: 'Coffee · origin 3', value: 'Colombia — Oct–Jan main crop, Apr–Jun mitaca' },
  o4: { label: 'Coffee · origin 4', value: 'Indonesia (Sumatra) — Oct–Mar' },
  caption: {
    label: 'Coffee · caption',
    multiline: true,
    value: 'Somewhere, it is always harvest: supply pressure rotates through the year, which is why softs curves carry crop-year structure (remember wheat’s September break) and why differentials have seasons. And note the needle: on the course’s trading date, Vietnam’s harvest is just beginning — exactly the backdrop of the Y1 Nov round in the live-market exercise.',
  },
})

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const CX = 180
const CY = 180

/** Point at radius r, angle in degrees measured clockwise from 12 o’clock. */
function pt(r: number, angleDeg: number): [number, number] {
  const a = ((angleDeg - 90) * Math.PI) / 180
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)]
}

/**
 * Annular-sector path spanning months [startMonth..endMonth] inclusive
 * (0 = Jan), allowing ranges that wrap the year end (e.g. Nov -> Feb).
 */
function monthArc(startMonth: number, endMonth: number, rOuter: number, rInner: number, padDeg = 2): string {
  const span = ((endMonth - startMonth + 12) % 12) + 1 // months, inclusive
  const a0 = startMonth * 30 + padDeg
  const a1 = (startMonth + span) * 30 - padDeg
  const largeArc = a1 - a0 > 180 ? 1 : 0
  const [x0, y0] = pt(rOuter, a0)
  const [x1, y1] = pt(rOuter, a1)
  const [x2, y2] = pt(rInner, a1)
  const [x3, y3] = pt(rInner, a0)
  const f = (n: number) => n.toFixed(2)
  return [
    `M ${f(x0)} ${f(y0)}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${f(x1)} ${f(y1)}`,
    `L ${f(x2)} ${f(y2)}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${f(x3)} ${f(y3)}`,
    'Z',
  ].join(' ')
}

// Radii per ring position (outermost first)
const RADII = [
  { rOuter: 148, rInner: 130 },
  { rOuter: 124, rInner: 106 },
  { rOuter: 100, rInner: 82 },
  { rOuter: 76, rInner: 58 },
] as const

const HEX = ['#f59e0b', '#22d3ee', '#34d399', '#8b5cf6'] as const

// One harvest wheel per crop. `textKey` rings read their (editable) label from
// the coffee textDef; the other crops carry plain labels. Arcs are month
// ranges (0 = Jan), `thin` marks a secondary window drawn slimmer.
type Ring = { label?: string; textKey?: 'o1' | 'o2' | 'o3' | 'o4'; arcs: { start: number; end: number; thin?: boolean }[] }
type Crop = { key: string; name: string; rings: Ring[]; caption?: string }

const CROPS: Crop[] = [
  {
    key: 'coffee', name: 'Coffee',
    rings: [
      { textKey: 'o1', arcs: [{ start: 4, end: 8 }] },   // Brazil May–Sep
      { textKey: 'o2', arcs: [{ start: 10, end: 1 }] },  // Vietnam Nov–Feb
      { textKey: 'o3', arcs: [{ start: 9, end: 0 }, { start: 3, end: 5, thin: true }] }, // Colombia + mitaca
      { textKey: 'o4', arcs: [{ start: 9, end: 2 }] },   // Indonesia Oct–Mar
    ],
  },
  {
    key: 'corn', name: 'Corn',
    rings: [
      { label: 'US Corn Belt — Sep–Nov', arcs: [{ start: 8, end: 10 }] },
      { label: 'Brazil safrinha (2nd crop) — Jun–Sep', arcs: [{ start: 5, end: 8 }] },
      { label: 'Argentina — Mar–Jun', arcs: [{ start: 2, end: 5 }] },
      { label: 'Ukraine — Sep–Nov', arcs: [{ start: 8, end: 10 }] },
    ],
    caption: 'The world’s biggest crop harvests twice: the northern autumn (US, Ukraine) and the South American winter — Brazil’s safrinha, planted AFTER the soybean harvest on the same fields, now swings the export market. When the US market wants to rally, it must do it before September; when it breaks, it is usually a safrinha surprise.',
  },
  {
    key: 'wheat', name: 'Wheat',
    rings: [
      { label: 'US winter wheat (HRW/SRW) — May–Jul', arcs: [{ start: 4, end: 6 }] },
      { label: 'EU & Black Sea — Jul–Aug', arcs: [{ start: 6, end: 7 }] },
      { label: 'US & Canada spring wheat — Aug–Sep', arcs: [{ start: 7, end: 8 }] },
      { label: 'Australia & Argentina — Nov–Jan', arcs: [{ start: 10, end: 0 }] },
    ],
    caption: 'Wheat is harvested somewhere in EVERY quarter — winter wheats in early northern summer, spring wheats behind them, then the southern hemisphere from November. The July–September supply wave is why the Chicago curve so often carries its post-harvest break — the September structure the market-structure topic mentioned.',
  },
  {
    key: 'soy', name: 'Soy',
    rings: [
      { label: 'United States — Sep–Nov', arcs: [{ start: 8, end: 10 }] },
      { label: 'Brazil — Jan–Apr', arcs: [{ start: 0, end: 3 }] },
      { label: 'Argentina — Mar–Jun', arcs: [{ start: 2, end: 5 }] },
    ],
    caption: 'Two hemispheres, two harvests, six months apart: the US crop lands in autumn, Brazil answers in January–April with Argentina behind it. The market flips its attention (and its weather premium) between hemispheres twice a year — and the Brazilian harvest sets up the safrinha corn planted right behind it.',
  },
  {
    key: 'sugar', name: 'Sugar',
    rings: [
      { label: 'Brazil Centre-South crush — Apr–Nov', arcs: [{ start: 3, end: 10 }] },
      { label: 'India — Nov–Apr', arcs: [{ start: 10, end: 3 }] },
      { label: 'Thailand — Dec–Apr', arcs: [{ start: 11, end: 3 }] },
      { label: 'EU beet campaign — Sep–Jan', arcs: [{ start: 8, end: 0 }] },
    ],
    caption: 'Sugar is a cane CRUSH more than a harvest: Brazil’s Centre-South runs April to November, then Asia takes over through the northern winter, with the EU beet campaign overlapping. The inter-crop gap (Brazil’s December–March) is when the market is most sensitive to a monsoon or an ethanol-parity surprise.',
  },
  {
    key: 'cocoa', name: 'Cocoa',
    rings: [
      { label: 'Côte d’Ivoire & Ghana main crop — Oct–Mar', arcs: [{ start: 9, end: 2 }] },
      { label: 'West Africa mid-crop — May–Aug', arcs: [{ start: 4, end: 7 }] },
      { label: 'Ecuador — Mar–Jun', arcs: [{ start: 2, end: 5 }] },
      { label: 'Indonesia — May–Jul', arcs: [{ start: 4, end: 6 }] },
    ],
    caption: 'Two-thirds of the world’s cocoa comes from two neighbouring countries, so the calendar is really West Africa’s: the main crop from October, the smaller mid-crop from May. That concentration is why one bad Harmattan season (2023–24) could triple the price of the entire world market.',
  },
  {
    key: 'cotton', name: 'Cotton',
    rings: [
      { label: 'United States — Sep–Dec', arcs: [{ start: 8, end: 11 }] },
      { label: 'India — Oct–Jan', arcs: [{ start: 9, end: 0 }] },
      { label: 'Brazil — Jun–Aug', arcs: [{ start: 5, end: 7 }] },
      { label: 'Australia — Mar–May', arcs: [{ start: 2, end: 4 }] },
    ],
    caption: 'The northern pickers (US, India) work the autumn; Brazil — grown as a second crop behind soybeans, like safrinha corn — fills the mid-year; Australia the southern autumn. Cotton’s ICE contract is US-delivery only, so the US window carries the futures even when Brazil now exports more.',
  },
  {
    key: 'oj', name: 'Orange juice',
    rings: [
      { label: 'Brazil (São Paulo) crush — Jul–Dec', arcs: [{ start: 6, end: 11 }] },
      { label: 'Florida early & mid-season — Nov–Mar', arcs: [{ start: 10, end: 2 }] },
      { label: 'Florida Valencia — Mar–Jun', arcs: [{ start: 2, end: 5, thin: true }] },
    ],
    caption: 'Brazil crushes ~three-quarters of the world’s juice from July; Florida’s season answers through the northern winter into the Valencia spring. The FCOJ contract’s famous January frost spikes live exactly where the needle points: the Florida crop is on the tree, and one cold night can reprice the whole board.',
  },
]

export default function CropCalendar() {
  const t = useVisualText(textDef)
  const [sel, setSel] = useState(0)
  const crop = CROPS[sel]
  const ringLabel = (r: Ring) => (r.textKey ? t(r.textKey) : r.label ?? '')

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow text-brand-cyan">{crop.key === 'coffee' ? t('heading') : `${crop.name} crop calendar`}</div>
        <div className="flex flex-wrap gap-1.5">
          {CROPS.map((c, i) => (
            <button key={c.key} type="button" onClick={() => setSel(i)}
              className={`rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold transition-all ${
                i === sel ? 'border-amber-500/60 bg-amber-500/15 text-amber-100' : 'border-white/10 text-slate-400 hover:text-slate-200'
              }`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <svg
          viewBox="0 0 360 360"
          className="w-full max-w-[340px] mx-auto md:mx-0 shrink-0"
          role="img"
          aria-label={`Circular 12-month calendar showing main ${crop.name.toLowerCase()} harvest windows by origin`}
        >
          {/* month boundary ticks */}
          {MONTHS.map((_, m) => {
            const [x0, y0] = pt(52, m * 30)
            const [x1, y1] = pt(152, m * 30)
            return (
              <line key={m} x1={x0.toFixed(2)} y1={y0.toFixed(2)} x2={x1.toFixed(2)} y2={y1.toFixed(2)}
                stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            )
          })}

          {/* faint tracks for each origin ring */}
          {crop.rings.map((_, ri) => {
            const { rOuter, rInner } = RADII[ri]
            return (
              <circle key={ri} cx={CX} cy={CY} r={(rOuter + rInner) / 2} fill="none"
                stroke="rgba(255,255,255,0.04)" strokeWidth={rOuter - rInner} />
            )
          })}

          {/* harvest arcs */}
          {crop.rings.map((ring, ri) =>
            ring.arcs.map((a, i) => {
              const { rOuter, rInner } = RADII[ri]
              const shrink = a.thin ? 4 : 0
              return (
                <path
                  key={`${ri}-${i}`}
                  d={monthArc(a.start, a.end, rOuter - shrink, rInner + shrink)}
                  fill={HEX[ri]}
                  fillOpacity={a.thin ? 0.55 : 0.85}
                  stroke={HEX[ri]}
                  strokeOpacity={0.4}
                  strokeWidth="1"
                />
              )
            }),
          )}

          {/* outer ring of month labels, clockwise from the top */}
          {MONTHS.map((label, m) => {
            const [x, y] = pt(163, m * 30 + 15)
            return (
              <text key={label} x={x.toFixed(2)} y={y.toFixed(2)} textAnchor="middle" dominantBaseline="central"
                fill="#94a3b8" fontSize="12" className="font-mono">
                {label}
              </text>
            )
          })}

          {/* "today" needle — the course's trading date, 12 November */}
          {(() => {
            const angle = 10 * 30 + 12; // ~12 Nov
            const [nx0, ny0] = pt(50, angle)
            const [nx1, ny1] = pt(155, angle)
            const [lx, ly] = pt(120, angle - 14)
            return (
              <g>
                <line x1={nx0.toFixed(2)} y1={ny0.toFixed(2)} x2={nx1.toFixed(2)} y2={ny1.toFixed(2)}
                  stroke="#f43f5e" strokeWidth="1.5" opacity="0.85" />
                <circle cx={nx1.toFixed(2)} cy={ny1.toFixed(2)} r="3" fill="#f43f5e" />
                <text x={lx.toFixed(2)} y={ly.toFixed(2)} textAnchor="end" fill="#f43f5e" fontSize="8.5" className="font-mono" fontWeight="bold">
                  12 Nov · today
                </text>
              </g>
            )
          })()}

          {/* center hub */}
          <circle cx={CX} cy={CY} r="46" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <text x={CX} y={CY - 6} textAnchor="middle" fill="#64748b" fontSize="9" letterSpacing="2" className="font-mono">
            MAIN
          </text>
          <text x={CX} y={CY + 8} textAnchor="middle" fill="#64748b" fontSize="9" letterSpacing="2" className="font-mono">
            HARVEST
          </text>
        </svg>

        <div className="flex-1">
          <ul className="space-y-3">
            {crop.rings.map((ring, ri) => (
              <li key={ri} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: HEX[ri] }} aria-hidden="true" />
                <span className="text-slate-300 text-sm leading-relaxed">{ringLabel(ring)}</span>
              </li>
            ))}
          </ul>

          <p className="text-slate-400 text-sm leading-relaxed mt-5 border-t border-white/5 pt-4">
            {crop.key === 'coffee' ? t('caption') : crop.caption}
          </p>
        </div>
      </div>
    </div>
  )
}
