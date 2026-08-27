'use client'

import { useState } from 'react'

// Deriving PTBF from first principles: the retailer's constraint forces a
// fixed-price contract on the factory; the factory must cover it; covering it
// early creates counterparty risk; the escape is to split volume from price —
// which IS the price-to-be-fixed contract. Six steps, walked one at a time.
type Step = {
  title: string
  body: string
  diagram: 'retail' | 'factory' | 'trap' | 'split' | 'ptbf' | 'producer'
  tag: string
  color: string
}

const STEPS: Step[] = [
  {
    title: 'The shelf sets the rules',
    tag: 'The final consumer buys SPOT',
    color: '#22d3ee',
    diagram: 'retail',
    body: 'A consumer buys a pack of coffee today, at the price printed on it. So the goods must physically BE on the shelf, with a known purchase cost, before any selling price can be displayed. And a supermarket cannot reprice its shelves every morning: it negotiates huge volumes for a long period — six months, a year — at a FIXED price.',
  },
  {
    title: 'The factory inherits a fixed price',
    tag: 'Sell fixed → buy fixed',
    color: '#3b82f6',
    diagram: 'factory',
    body: 'The manufacturer has now SOLD a year of production at a flat price. Whatever it pays for its raw material, the revenue side is frozen. The only rational answer is symmetry: if you sold flat, you must buy flat — cover the sale with a purchase at a known price, and the margin is locked.',
  },
  {
    title: 'But buying it all now creates a NEW risk',
    tag: 'The counterparty trap',
    color: '#f43f5e',
    diagram: 'trap',
    body: 'Suppose the factory buys the whole year forward at a fixed price. Six months later the market has doubled. Its supplier is now committed to deliver at half the market — and the temptation to default, renegotiate or simply disappear becomes enormous. Buying too much, too early, at a fixed price does not remove risk: it converts price risk into COUNTERPARTY risk (the olive-oil lesson, in one sentence).',
  },
  {
    title: 'So separate the two decisions',
    tag: 'Volume now, price later',
    color: '#f59e0b',
    diagram: 'split',
    body: 'The escape is to notice that a purchase contract does two things at once — it secures the GOODS and it sets the PRICE — and that they need not happen on the same day. Secure the volume now (the cargo is booked, the origin committed, the logistics planned) and fix the price later, ideally at the last minute, when the exposure is short and the counterparty has little incentive to walk away.',
  },
  {
    title: 'Dismantle the price into two components',
    tag: 'And you have just invented PTBF',
    color: '#34d399',
    diagram: 'ptbf',
    body: 'To fix a price later you must first agree HOW it will be fixed. Split it in two: a FLOATING reference that anyone can observe and that moves every day (the futures price), plus a FIXED premium or discount against that reference for this particular coffee — origin, quality, port, timing. Sign the differential today, fix the futures leg later. That contract has a name: Price To Be Fixed — PTBF.',
  },
  {
    title: 'And the other end of the chain?',
    tag: 'The trader is the converter',
    color: '#8b5cf6',
    diagram: 'producer',
    body: 'Producers have the mirror problem: fixed costs, a harvest that arrives all at once, and a strong preference to sell at a known price when production is finished. The factory wants to fix late; the producer wants to be paid now. The commodity trader stands between them, buying and selling in a form each side can accept — and in doing so converts a FLAT PRICE risk into a DIFFERENTIAL risk that it keeps and manages. That conversion is the business.',
  },
]

const C = { ink: '#e2e8f0', dim: '#64748b', line: 'rgba(255,255,255,0.18)' }

function Box({ x, y, w, h, label, sub, color, dash }: { x: number; y: number; w: number; h: number; label: string; sub?: string; color: string; dash?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={color + '1a'} stroke={color} strokeWidth="1.3" strokeDasharray={dash ? '5 4' : undefined} />
      <text x={x + w / 2} y={sub ? y + h / 2 - 2 : y + h / 2 + 4} textAnchor="middle" fill={color} fontSize="10.5" fontFamily="monospace" fontWeight="bold">{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fill={C.dim} fontSize="8.5" fontFamily="monospace">{sub}</text>}
    </g>
  )
}

function Arrow({ x1, y1, x2, y2, label, color = '#94a3b8', dash }: { x1: number; y1: number; x2: number; y2: number; label?: string; color?: string; dash?: boolean }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" markerEnd="url(#pi-arrow)" strokeDasharray={dash ? '5 3' : undefined} />
      {label && <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} textAnchor="middle" fill={color} fontSize="8.5" fontFamily="monospace">{label}</text>}
    </g>
  )
}

function Diagram({ kind }: { kind: Step['diagram'] }) {
  return (
    <svg viewBox="0 0 520 150" className="w-full" style={{ maxHeight: '160px' }}>
      <defs>
        <marker id="pi-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 z" fill="#94a3b8" />
        </marker>
      </defs>

      {kind === 'retail' && (
        <g>
          <Box x={40} y={50} w={120} h={50} label="SUPERMARKET" sub="reprices twice a year" color="#22d3ee" />
          <Arrow x1={166} y1={75} x2={330} y2={75} label="fixed price · 6–12 months · huge volume" />
          <Box x={336} y={50} w={140} h={50} label="CONSUMER" sub="buys spot, at the printed price" color="#94a3b8" />
          <text x={260} y={128} textAnchor="middle" fill={C.dim} fontSize="9" fontFamily="monospace">the shelf cannot change price every morning</text>
        </g>
      )}

      {kind === 'factory' && (
        <g>
          <Box x={30} y={50} w={130} h={50} label="RAW MATERIAL" sub="price moves daily" color="#f59e0b" />
          <Arrow x1={166} y1={75} x2={214} y2={75} label="buy ?" />
          <Box x={220} y={44} w={110} h={62} label="FACTORY" sub="margin = sale − cost" color="#3b82f6" />
          <Arrow x1={336} y1={75} x2={384} y2={75} label="sold FIXED" color="#22d3ee" />
          <Box x={390} y={50} w={104} h={50} label="RETAILER" sub="1-year contract" color="#22d3ee" />
          <text x={260} y={132} textAnchor="middle" fill={C.dim} fontSize="9" fontFamily="monospace">revenue frozen → the purchase must be frozen too</text>
        </g>
      )}

      {kind === 'trap' && (
        <g>
          <Box x={30} y={46} w={120} h={54} label="SUPPLIER" sub="committed at 100" color="#f43f5e" />
          <Arrow x1={156} y1={62} x2={300} y2={62} label="contract: deliver a year at 100" />
          <Box x={306} y={36} w={120} h={54} label="FACTORY" sub="bought it all now" color="#3b82f6" />
          {/* the market runs away */}
          <path d="M 40 128 L 120 126 L 200 118 L 280 96 L 380 74" fill="none" stroke="#f43f5e" strokeWidth="2" />
          <text x={392} y={72} fill="#f43f5e" fontSize="9" fontFamily="monospace" fontWeight="bold">market 200</text>
          <text x={150} y={140} fill="#f43f5e" fontSize="9" fontFamily="monospace">…so why would the supplier still deliver at 100?</text>
        </g>
      )}

      {kind === 'split' && (
        <g>
          <Box x={150} y={16} w={220} h={40} label="ONE CONTRACT — two decisions" color="#94a3b8" />
          <Arrow x1={210} y1={58} x2={130} y2={84} />
          <Arrow x1={310} y1={58} x2={390} y2={84} />
          <Box x={30} y={88} w={190} h={48} label="SECURE THE VOLUME" sub="now — cargo, origin, logistics" color="#34d399" />
          <Box x={300} y={88} w={190} h={48} label="FIX THE PRICE" sub="later — at the last minute" color="#f59e0b" />
        </g>
      )}

      {kind === 'ptbf' && (
        <g>
          <Box x={170} y={12} w={180} h={38} label="INVOICE PRICE" color="#e2e8f0" />
          <Arrow x1={230} y1={52} x2={140} y2={76} />
          <Arrow x1={290} y1={52} x2={380} y2={76} />
          <Box x={26} y={80} w={200} h={52} label="FLOATING REFERENCE" sub="the futures price — moves daily" color="#3b82f6" />
          <Box x={296} y={80} w={200} h={52} label="FIXED DIFFERENTIAL" sub="origin · quality · port · timing" color="#34d399" />
          <text x={260} y={70} textAnchor="middle" fill={C.ink} fontSize="11" fontFamily="monospace" fontWeight="bold">=</text>
          <text x={260} y={146} textAnchor="middle" fill="#34d399" fontSize="9.5" fontFamily="monospace" fontWeight="bold">fixed LATER  +  agreed TODAY   →   Price To Be Fixed</text>
        </g>
      )}

      {kind === 'producer' && (
        <g>
          <Box x={20} y={46} w={130} h={56} label="PRODUCER" sub="fixed cost · wants a fixed price" color="#f59e0b" />
          <Arrow x1={156} y1={74} x2={204} y2={74} label="flat" color="#f59e0b" />
          <Box x={210} y={38} w={110} h={72} label="TRADER" sub="keeps the differential" color="#8b5cf6" />
          <Arrow x1={326} y1={74} x2={374} y2={74} label="PTBF" color="#34d399" />
          <Box x={380} y={46} w={120} h={56} label="FACTORY" sub="wants to fix late" color="#3b82f6" />
          <text x={265} y={140} textAnchor="middle" fill="#8b5cf6" fontSize="9.5" fontFamily="monospace" fontWeight="bold">flat-price risk in  →  differential risk out</text>
        </g>
      )}
    </svg>
  )
}

export default function PtbfInvention() {
  const [i, setI] = useState(0)
  const s = STEPS[i]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow text-brand-cyan">Inventing the PTBF contract — step by step</div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setI(n => Math.max(0, n - 1))} disabled={i === 0}
            className={`chip !py-0.5 font-mono text-xs ${i === 0 ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:border-white/30'}`}>← Prev</button>
          <span className="font-mono text-[11px] tabular-nums text-slate-400">step {i + 1}/{STEPS.length}</span>
          <button type="button" onClick={() => setI(n => Math.min(STEPS.length - 1, n + 1))} disabled={i === STEPS.length - 1}
            className={`chip !py-0.5 font-mono text-xs ${i === STEPS.length - 1 ? 'cursor-not-allowed opacity-40' : 'cursor-pointer border-brand-cyan/50 bg-brand-cyan/10 text-cyan-100 hover:bg-brand-cyan/20'}`}>Next →</button>
        </div>
      </div>

      {/* step rail */}
      <div className="mb-3 flex gap-1">
        {STEPS.map((st, j) => (
          <button key={j} type="button" onClick={() => setI(j)} aria-label={`Step ${j + 1}`}
            className="h-1.5 flex-1 rounded-full transition-all"
            style={{ background: j <= i ? st.color : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>

      <div className="rounded-xl border p-3.5" style={{ borderColor: s.color + '55', backgroundColor: s.color + '0d' }}>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wide" style={{ color: s.color }}>{s.tag}</span>
          <span className="text-sm font-bold text-white">{s.title}</span>
        </div>
        <div className="mt-2 rounded-lg border border-white/10 bg-white/[0.02] p-2">
          <Diagram kind={s.diagram} />
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">{s.body}</p>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        Nobody designed PTBF in a committee: it falls out of the constraints. A shelf that cannot reprice forces a fixed
        sale; a fixed sale forces a fixed purchase; a fixed purchase taken too early creates default risk — and the only
        way out is to buy the goods now and the price later. Everything else in this course is machinery serving that
        one idea.
      </p>
    </div>
  )
}
