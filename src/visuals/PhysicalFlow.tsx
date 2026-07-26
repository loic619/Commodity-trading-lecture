'use client'

import { useState } from 'react'
import { defineVisualText, useVisualText } from '@/lib/visualText'

// The PHYSICAL trade flow: supplier → desk → warehouse → customer, drawn as
// three superimposed flows — GOODS forward, DOCUMENTS forward, MONEY back.
// Every label is editable through the slide's Graphic-text panel.
export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'The physical flow — goods forward, documents forward, money back' },
  n0: { label: 'Node 1 · name', value: 'SUPPLIER' },
  n0sub: { label: 'Node 1 · sub', value: 'Farmer co-op · Dak Lak' },
  n1: { label: 'Node 2 · name', value: 'TRADING HOUSE' },
  n1sub: { label: 'Node 2 · sub', value: 'Exporter desk · HCM' },
  n2: { label: 'Node 3 · name', value: 'WAREHOUSE' },
  n2sub: { label: 'Node 3 · sub', value: 'C. Steinweg · Antwerp' },
  n3: { label: 'Node 4 · name', value: 'CUSTOMER' },
  n3sub: { label: 'Node 4 · sub', value: 'Roaster · Hamburg' },
  goodsLabel: { label: 'Goods · row label', value: 'GOODS →' },
  docsLabel: { label: 'Documents · row label', value: 'DOCUMENTS →' },
  cashLabel: { label: 'Money · row label', value: '← MONEY' },
  goods0: { label: 'Goods · hop 1', value: 'green coffee, trucked & milled' },
  goods1: { label: 'Goods · hop 2', value: 'container · vessel HCM → Antwerp' },
  goods2: { label: 'Goods · hop 3', value: 'delivered instore, blended & roasted' },
  docs0: { label: 'Documents · hop 1', value: 'purchase contract · weighbridge slip' },
  docs1: { label: 'Documents · hop 2', value: 'B/L · quality & phyto certificates' },
  docs2: { label: 'Documents · hop 3', value: 'sale contract · invoice · warrant' },
  cash0: { label: 'Money · hop 1', value: 'VND spot payment on delivery' },
  cash1: { label: 'Money · hop 2', value: 'financing carries the voyage (bank line)' },
  cash2: { label: 'Money · hop 3', value: 'USD/EUR against documents (LC or CAD)' },
  goodsOffice: { label: 'Goods · owner', multiline: true, value: 'moved by OPERATIONS / LOGISTICS — the execution desk: trucks, stuffing, vessel bookings, instore handling' },
  docsOffice: { label: 'Documents · owner', multiline: true, value: 'issued & matched by BACK OFFICE: no clean documents, no payment — the paper IS the trade' },
  cashOffice: { label: 'Money · owner', multiline: true, value: 'moved by TREASURY: the customer pays against documents; the desk paid the farmer months earlier — financing bridges the gap' },
  caption: { label: 'Closing caption', multiline: true, value: 'Notice the desk’s position: it pays the farmer in November and is paid by the roaster months later — the trading house earns its margin by carrying time, distance, documents and financing, with the price risk hedged on the exchange the whole way. That gap between paying and being paid is exactly why treasury, financing lines and clean paperwork are desk jobs, not paperwork.' },
})

type Flow = 'goods' | 'docs' | 'cash'
const FLOW_COLOR: Record<Flow, string> = { goods: '#34d399', docs: '#22d3ee', cash: '#f59e0b' }
const FLOW_DIR: Record<Flow, 'fwd' | 'back'> = { goods: 'fwd', docs: 'fwd', cash: 'back' }

export default function PhysicalFlow() {
  const t = useVisualText(textDef)
  const [focus, setFocus] = useState<Flow | 'all'>('all')

  const nodes = [
    { key: 'supplier', label: t('n0'), sub: t('n0sub'), icon: '🌱' },
    { key: 'desk', label: t('n1'), sub: t('n1sub'), icon: '🏢' },
    { key: 'warehouse', label: t('n2'), sub: t('n2sub'), icon: '📦' },
    { key: 'customer', label: t('n3'), sub: t('n3sub'), icon: '☕' },
  ]
  const hops: Record<Flow, [string, string, string]> = {
    goods: [t('goods0'), t('goods1'), t('goods2')],
    docs: [t('docs0'), t('docs1'), t('docs2')],
    cash: [t('cash0'), t('cash1'), t('cash2')],
  }
  const rowLabel: Record<Flow, string> = { goods: t('goodsLabel'), docs: t('docsLabel'), cash: t('cashLabel') }
  const office: Record<Flow, string> = { goods: t('goodsOffice'), docs: t('docsOffice'), cash: t('cashOffice') }

  const W = 560, H = 220, ml = 10, mr = 10, mt = 14
  const span = (W - ml - mr) / nodes.length
  const nodeX = (i: number) => ml + span * (i + 0.5)
  const flowY: Record<Flow, number> = { goods: 108, docs: 146, cash: 184 }
  const dim = (f: Flow) => focus !== 'all' && focus !== f

  const arrow = (f: Flow, hop: number) => {
    const color = FLOW_COLOR[f]
    const y = flowY[f]
    const x1 = nodeX(hop) + 34, x2 = nodeX(hop + 1) - 34
    const back = FLOW_DIR[f] === 'back'
    return (
      <g key={`${f}-${hop}`} opacity={dim(f) ? 0.18 : 1}>
        <line x1={back ? x2 : x1} y1={y} x2={back ? x1 : x2} y2={y}
          stroke={color} strokeWidth="1.8" strokeDasharray={f === 'docs' ? '5 3' : undefined}
          markerEnd={`url(#pf-arrow-${f})`} />
        <text x={(x1 + x2) / 2} y={y - 5} textAnchor="middle" fill={color} fontSize="7" fontFamily="monospace">
          {hops[f][hop]}
        </text>
      </g>
    )
  }

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow text-brand-cyan">{t('heading')}</div>
        <div className="flex gap-1.5">
          {(['all', 'goods', 'docs', 'cash'] as const).map(f => (
            <button key={f} type="button" onClick={() => setFocus(f)} aria-label={`Show ${f} flow`}
              className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold transition-colors ${
                focus === f ? 'border-white/40 bg-white/10 text-white' : 'border-white/10 text-slate-400 hover:text-slate-200'
              }`}
              style={focus === f && f !== 'all' ? { color: FLOW_COLOR[f as Flow] } : undefined}>
              {f === 'all' ? 'ALL' : rowLabel[f as Flow]}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '230px' }}>
        <defs>
          {(Object.keys(FLOW_COLOR) as Flow[]).map(f => (
            <marker key={f} id={`pf-arrow-${f}`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 z" fill={FLOW_COLOR[f]} />
            </marker>
          ))}
        </defs>

        {/* the four parties */}
        {nodes.map((n, i) => (
          <g key={n.key}>
            <rect x={nodeX(i) - 52} y={mt} width={104} height={58} rx="12"
              fill={i === 1 ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)'}
              stroke={i === 1 ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.12)'} strokeWidth="1.2" />
            <text x={nodeX(i)} y={mt + 20} textAnchor="middle" fontSize="13">{n.icon}</text>
            <text x={nodeX(i)} y={mt + 36} textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace" fontWeight="bold">{n.label}</text>
            <text x={nodeX(i)} y={mt + 48} textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="monospace">{n.sub}</text>
            <line x1={nodeX(i)} y1={mt + 58} x2={nodeX(i)} y2={flowY.cash + 6} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          </g>
        ))}

        {/* the three flows, hop by hop */}
        {(Object.keys(hops) as Flow[]).map(f => [0, 1, 2].map(h => arrow(f, h)))}

        {/* flow row labels */}
        {(Object.keys(FLOW_COLOR) as Flow[]).map(f => (
          <text key={`lbl-${f}`} x={ml} y={flowY[f] + 3} fill={FLOW_COLOR[f]} fontSize="7.5" fontFamily="monospace" fontWeight="bold" opacity={dim(f) ? 0.25 : 1}>
            {rowLabel[f].replace(' →', '').replace('← ', '')}
          </text>
        ))}
      </svg>

      {/* which office moves the focused flow */}
      <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-relaxed text-slate-300">
        {focus === 'all' ? (
          <>Three flows, one trade: <span className="font-bold text-emerald-300">goods</span> travel forward over months,{' '}
          <span className="font-bold text-cyan-300">documents</span> chase them hop by hop, and{' '}
          <span className="font-bold text-amber-300">money</span> flows BACKWARD — the customer pays last, against clean documents.
          Click a flow to see which office owns it.</>
        ) : (
          <span>{office[focus]}.</span>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-400">{t('caption')}</p>
    </div>
  )
}
