'use client'

import { useState } from 'react'
import { defineVisualText, useVisualText } from '@/lib/visualText'

export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'Three aspects of every commodity trade' },
  hub: { label: 'Hub · label', value: 'The trade' },
  sat1: { label: 'Satellite · top', value: 'Commercial' },
  sat2: { label: 'Satellite · bottom-left', value: 'Logistics' },
  sat3: { label: 'Satellite · bottom-right', value: 'Financial' },
  caption: { label: 'Caption', multiline: true, value: 'A trade is not done when the price is agreed — it is done when the goods have moved, the documents are clean and the money has been paid. Three aspects, three ways to lose the margin: a good price on a cargo that cannot ship, or ships but is never paid for, is not a good trade.' },
})

// Hub-and-spoke geometry (viewBox 480 x 300) — same language as the ICE chart
const HUB = { x: 240, y: 152, r: 58 }
const SATS = [
  { x: 240, y: 46, r: 42 },  // top
  { x: 88, y: 246, r: 46 },  // bottom-left
  { x: 392, y: 246, r: 46 }, // bottom-right
]
const COLORS = ['#22d3ee', '#f59e0b', '#34d399']

const DETAIL = [
  {
    q: 'Can I buy it and sell it at a margin?',
    items: [
      'Find the counterparties — origination at one end, sales at the other',
      'Negotiate the price form: flat price, or a differential against a reference',
      'Read the market: supply & demand, structure, the arbitrage between two places or two dates',
      'Own the risk you chose to keep, and lay off the rest',
    ],
    who: 'Traders, originators, sales',
  },
  {
    q: 'Can I actually move it, on spec and on time?',
    items: [
      'Freight, containers or vessels, and the port at each end',
      'Quality: sampling, grading, certificates — the goods must match the contract',
      'Documents: bills of lading, phytosanitary and origin certificates, customs',
      'Timing: shipment periods, laycans, delays and demurrage',
    ],
    who: 'Operations, execution & logistics',
  },
  {
    q: 'Can I fund it, and will I be paid?',
    items: [
      'Working capital: the cargo is paid for months before the customer pays you',
      'Trade finance: bank lines, letters of credit, documentary collections',
      'Margin: a futures hedge consumes cash daily, whatever the physical is doing',
      'Credit: will the counterparty still be there — and still perform — at delivery?',
    ],
    who: 'Treasury, trade finance, credit & risk',
  },
]

/** Greedy word-wrap so satellite labels fit inside their circles. */
function wrapLines(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (next.length > maxChars && line) { lines.push(line); line = word } else { line = next }
  }
  if (line) lines.push(line)
  return lines
}

export default function TraderPillars() {
  const t = useVisualText(textDef)
  const [sel, setSel] = useState(0)
  const labels = [t('sat1'), t('sat2'), t('sat3')]
  const d = DETAIL[sel]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-3 text-brand-cyan">{t('heading')}</div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)] md:items-center">
        <svg viewBox="0 0 480 300" className="w-full" style={{ maxHeight: '290px' }}>
          {SATS.map((s, i) => (
            <line key={i} x1={HUB.x} y1={HUB.y} x2={s.x} y2={s.y}
              stroke={COLORS[i]} strokeWidth={sel === i ? 3 : 2} opacity={sel === i ? 0.8 : 0.35} />
          ))}

          <circle cx={HUB.x} cy={HUB.y} r={HUB.r} fill="#3b82f6" opacity="0.9" />
          <circle cx={HUB.x} cy={HUB.y} r={HUB.r} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
          <text x={HUB.x} y={HUB.y + 5} textAnchor="middle" fill="#fff" fontSize="15" fontWeight="bold">{t('hub')}</text>

          {SATS.map((s, i) => {
            const lines = wrapLines(labels[i], 11)
            const y0 = s.y - ((lines.length - 1) * 13) / 2
            return (
              <g key={i} onClick={() => setSel(i)} style={{ cursor: 'pointer' }}>
                <circle cx={s.x} cy={s.y} r={s.r}
                  fill={sel === i ? COLORS[i] + '33' : 'rgba(255,255,255,0.06)'}
                  stroke={sel === i ? COLORS[i] : 'rgba(255,255,255,0.2)'} strokeWidth={sel === i ? 2 : 1} />
                <text textAnchor="middle" fill={sel === i ? COLORS[i] : '#fff'} fontSize="12" fontWeight="600">
                  {lines.map((line, j) => <tspan key={j} x={s.x} y={y0 + j * 13 + 4}>{line}</tspan>)}
                </text>
              </g>
            )
          })}
        </svg>

        <div className="rounded-xl border p-3.5" style={{ borderColor: COLORS[sel] + '55', backgroundColor: COLORS[sel] + '0d' }}>
          <div className="font-mono text-xs font-bold" style={{ color: COLORS[sel] }}>{labels[sel]} — {d.q}</div>
          <ul className="mt-2 space-y-1">
            {d.items.map((it, i) => (
              <li key={i} className="flex items-baseline gap-2 text-xs leading-relaxed text-slate-300">
                <span className="shrink-0 font-mono text-[10px]" style={{ color: COLORS[sel] }}>▸</span>{it}
              </li>
            ))}
          </ul>
          <div className="mt-2 border-t border-white/10 pt-2 font-mono text-[10px] text-slate-500">Who owns it: {d.who}</div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-400">{t('caption')}</p>
    </div>
  )
}
