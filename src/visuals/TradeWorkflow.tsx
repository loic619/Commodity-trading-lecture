'use client'

import { useState } from 'react'
import { defineVisualText, useVisualText } from '@/lib/visualText'

// One trade, every desk: a swimlane map of how a single deal — 200 t of physical
// coffee plus its 20-lot hedge — travels through the house. Every lane name,
// step title and narration is editable via the slide's Graphic-text panel.
type LaneKey = 'exchange' | 'front' | 'ops' | 'middle' | 'back' | 'treasury'

export const textDef = defineVisualText({
  heading: { label: 'Heading', value: 'One trade, every desk — the workflow of a single deal' },
  laneExchange: { label: 'Lane · exchange', value: 'BROKER / EXCHANGE' },
  laneFront: { label: 'Lane · front', value: 'FRONT OFFICE' },
  laneOps: { label: 'Lane · operations', value: 'OPERATIONS / LOGISTICS' },
  laneMiddle: { label: 'Lane · middle', value: 'MIDDLE OFFICE' },
  laneBack: { label: 'Lane · back', value: 'BACK OFFICE' },
  laneTreasury: { label: 'Lane · treasury', value: 'TREASURY' },
  t0: { label: 'Step 1 · title', value: 'Deal done' },
  d0: { label: 'Step 1 · desc', multiline: true, value: 'The trader buys 200 t of physical coffee from the supplier — by phone, in two minutes. On a desk, a deal is DONE at the word: everything that follows exists to make that word safe.' },
  t1: { label: 'Step 2 · title', value: 'Hedge executed' },
  d1: { label: 'Step 2 · desc', multiline: true, value: 'Sell 20 lots through the broker; the clearing house steps between buyer and seller. The desk is flat before the coffee is even weighed.' },
  t2: { label: 'Step 3 · title', value: 'Deal capture & limits' },
  d2: { label: 'Step 3 · desc', multiline: true, value: 'Both legs are booked in the system within minutes and checked against position and credit limits. An unbooked trade is invisible risk — the first thing middle office hunts every day.' },
  t3: { label: 'Step 4 · title', value: 'Confirmation matching' },
  d3: { label: 'Step 4 · desc', multiline: true, value: 'The broker’s recap is matched line by line against the booked ticket; the supplier contract is confirmed in writing. A mismatch caught today costs nothing; caught at settlement, it costs real money.' },
  t4: { label: 'Step 5 · title', value: 'Margin & financing' },
  d4: { label: 'Step 5 · desc', multiline: true, value: 'Initial margin is wired to the clearing member, the variation-margin line is reserved, and the physical purchase is financed. No cash, no trade — treasury keeps the hedge alive.' },
  t5: { label: 'Step 6 · title', value: 'Physical execution' },
  d5: { label: 'Step 6 · desc', multiline: true, value: 'The execution & logistics desk turns the contract into a moving cargo: trucking from Dak Lak, container stuffing, vessel space HCM → Antwerp, the warehouse slot. This is the classic graduate entry point — and the desk trusts traders who have done it.' },
  t6: { label: 'Step 7 · title', value: 'Contracts & documents' },
  d6: { label: 'Step 7 · desc', multiline: true, value: 'From what operations executed, back office cuts the paper: shipping instructions, quality and phytosanitary certificates, the bill of lading, the invoice — the documents that get the desk paid.' },
  t7: { label: 'Step 8 · title', value: 'EOD: P&L & position report' },
  d7: { label: 'Step 8 · desc', multiline: true, value: 'The book is marked to market, decomposed flat / basis / costs, and signed off by the desk head against independent middle-office marks. The report is the product.' },
  caption: { label: 'Closing caption', multiline: true, value: 'Eight touches, five departments, one trade — and only ONE of the eight is the part outsiders call “trading.” Every other touch is a paid role, an entry point, and a control: the desk head signs a P&L that middle office marked, on a cargo operations physically moved, against confirmations back office matched, funded by cash treasury moved.' },
})

const LANE_COLOR: Record<LaneKey, string> = {
  exchange: '#8b5cf6', front: '#22d3ee', ops: '#3b82f6', middle: '#f59e0b', back: '#34d399', treasury: '#f43f5e',
}
const LANE_ORDER: LaneKey[] = ['exchange', 'front', 'ops', 'middle', 'back', 'treasury']
const STEP_SPEC: { lane: LaneKey; also?: LaneKey }[] = [
  { lane: 'front' }, { lane: 'front', also: 'exchange' }, { lane: 'middle' }, { lane: 'back' },
  { lane: 'treasury' }, { lane: 'ops' }, { lane: 'back' }, { lane: 'middle', also: 'front' },
]

export default function TradeWorkflow() {
  const tx = useVisualText(textDef)
  const [step, setStep] = useState(0)

  const laneLabel: Record<LaneKey, string> = {
    exchange: tx('laneExchange'), front: tx('laneFront'), ops: tx('laneOps'),
    middle: tx('laneMiddle'), back: tx('laneBack'), treasury: tx('laneTreasury'),
  }
  const LANES = LANE_ORDER.map(key => ({ key, label: laneLabel[key], color: LANE_COLOR[key] }))
  const STEPS = STEP_SPEC.map((s, i) => ({ ...s, title: tx(`t${i}`), desc: tx(`d${i}`) }))

  const W = 560, H = 292, ml = 128, mr = 14, mt = 24
  const pw = W - ml - mr
  const laneY = (k: LaneKey) => mt + LANES.findIndex(l => l.key === k) * 44
  const stepX = (i: number) => ml + ((i + 0.5) / STEPS.length) * pw
  const cur = STEPS[step]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow text-brand-cyan">{tx('heading')}</div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            className={`chip !py-0.5 font-mono text-xs ${step === 0 ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:border-white/30'}`}>
            ← Prev
          </button>
          <span className="font-mono text-[11px] tabular-nums text-slate-400">step {step + 1}/{STEPS.length}</span>
          <button type="button" onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1}
            className={`chip !py-0.5 font-mono text-xs ${step === STEPS.length - 1 ? 'cursor-not-allowed opacity-40' : 'cursor-pointer border-brand-cyan/50 bg-brand-cyan/10 text-cyan-100 hover:bg-brand-cyan/20'}`}>
            Next →
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '260px' }}>
        {/* swimlanes */}
        {LANES.map(l => {
          const yy = laneY(l.key)
          const active = cur.lane === l.key || cur.also === l.key
          return (
            <g key={l.key}>
              <rect x={ml - 4} y={yy - 15} width={pw + 8} height={32} rx="8"
                fill={active ? `${l.color}14` : 'rgba(255,255,255,0.02)'}
                stroke={active ? `${l.color}66` : 'rgba(255,255,255,0.06)'} strokeWidth="1" />
              <text x={ml - 12} y={yy + 3} textAnchor="end" fill={active ? l.color : '#64748b'} fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                {l.label}
              </text>
            </g>
          )
        })}

        {/* the trade's path through the lanes */}
        {STEPS.slice(0, step + 1).map((s2, i) => {
          if (i === 0) return null
          const prev = STEPS[i - 1]
          return (
            <line key={`p-${i}`} x1={stepX(i - 1)} y1={laneY(prev.lane)} x2={stepX(i)} y2={laneY(s2.lane)}
              stroke="#94a3b8" strokeWidth="1.3" strokeDasharray="4 3" opacity="0.7" />
          )
        })}

        {/* step markers */}
        {STEPS.map((s2, i) => {
          const visited = i <= step
          const lane = LANES.find(l => l.key === s2.lane)!
          return (
            <g key={i} onClick={() => setStep(i)} style={{ cursor: 'pointer' }}>
              {s2.also && i === step && (
                <line x1={stepX(i)} y1={laneY(s2.lane)} x2={stepX(i)} y2={laneY(s2.also)} stroke={lane.color} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.8" />
              )}
              {s2.also && i === step && (
                <circle cx={stepX(i)} cy={laneY(s2.also)} r="5" fill="none" stroke={lane.color} strokeWidth="1.4" opacity="0.85" />
              )}
              <circle cx={stepX(i)} cy={laneY(s2.lane)} r={i === step ? 8 : 5.5}
                fill={visited ? lane.color : 'rgba(255,255,255,0.08)'}
                stroke={i === step ? '#fff' : '#070912'} strokeWidth={i === step ? 1.6 : 1}>
                <title>{`${i + 1}. ${s2.title}`}</title>
              </circle>
              <text x={stepX(i)} y={laneY(s2.lane) + 1.5} textAnchor="middle" fill={visited ? '#070912' : '#64748b'} fontSize="7.5" fontFamily="monospace" fontWeight="bold" pointerEvents="none">
                {i + 1}
              </text>
            </g>
          )
        })}
      </svg>

      {/* the current step, narrated */}
      <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full px-2 py-px font-mono text-[10px] font-bold"
            style={{ background: `${LANES.find(l => l.key === cur.lane)!.color}22`, color: LANES.find(l => l.key === cur.lane)!.color }}>
            {LANES.find(l => l.key === cur.lane)!.label}{cur.also ? ` + ${LANES.find(l => l.key === cur.also)!.label}` : ''}
          </span>
          <span className="text-sm font-bold text-white">{cur.title}</span>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{cur.desc}</p>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-400">{tx('caption')}</p>
    </div>
  )
}
