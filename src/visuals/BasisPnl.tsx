'use client'

import { useRef, useState } from 'react'

// The hedged trade, as a graph you pull around.
//
// Deliberately TWO panels, because one axis cannot show both things at once:
// the flat price swings over $1,200 while the differential lives inside $100,
// so on a shared scale the gap that IS the P&L collapses to a few pixels. That
// is the lesson, not a bug — so the top panel shows the two price paths (where
// the differential is correctly almost invisible) and the bottom panel shows
// the differential on its own axis (where it is the only thing that moves).
//
// Drag the three hollow handles, or use the sliders / arrow keys for precision.

const F_ENTRY = 2400
const TONNES = 100

const D_MIN = -100
const D_MAX = 100
const D_STEP = 5
const F_MIN = 1800
const F_MAX = 3000
const F_STEP = 10

// SVG geometry — price panel on top, differential panel below.
const VB_W = 640
const VB_H = 364
const X_ENTRY = 160
const X_EXIT = 480
const P_TOP = 28
const P_BOT = 170
const D_TOP = 248
const D_BOT = 338

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const snap = (v: number, step: number) => Math.round(v / step) * step

// The differential panel's scale is fixed to the slider range, so the handles
// never leave the panel and the vertical distance is always worth the same.
const diffToY = (d: number) => D_BOT - ((d - D_MIN) / (D_MAX - D_MIN)) * (D_BOT - D_TOP)
const yToDiff = (y: number) => D_MIN + ((D_BOT - y) / (D_BOT - D_TOP)) * (D_MAX - D_MIN)

type Handle = 'dEntry' | 'fExit' | 'dExit'

function Slider({ label, value, min, max, step, onChange, display, amber }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; display: string; amber?: boolean
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between">
        <span className={`font-mono text-xs ${amber ? 'text-brand-cyan' : 'text-slate-400'}`}>{label}</span>
        <span className={`font-mono text-xs font-bold tabular-nums ${amber ? 'text-brand-cyan' : 'text-white'}`}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className={`h-1.5 w-full cursor-pointer ${amber ? 'accent-brand-cyan' : 'accent-brand-blue'}`} />
    </div>
  )
}

export default function BasisPnl() {
  const [dEntry, setDEntry] = useState(10)
  const [dExit, setDExit] = useState(-20)
  const [fExit, setFExit] = useState(2250)
  const [drag, setDrag] = useState<Handle | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)

  const buyPrice = F_ENTRY + dEntry
  const sellPrice = fExit + dExit
  const physical = sellPrice - buyPrice          // physical leg, $/t
  const futures = F_ENTRY - fExit                // short hedge leg, $/t
  const net = physical + futures                 // = dExit − dEntry
  const basisMove = dExit - dEntry

  const usd = (n: number) => (n < 0 ? '−' : '+') + '$' + Math.abs(Math.round(n)).toLocaleString('en-US')
  const flat = (n: number) => '$' + Math.round(n).toLocaleString('en-US')
  const signed = (n: number) => (n >= 0 ? '+' : '−') + Math.abs(n)

  // The price panel auto-fits the four plotted prices, with a floor on the span
  // so a quiet market does not get magnified into drama.
  const prices = [F_ENTRY, fExit, buyPrice, sellPrice]
  const lo = Math.min(...prices)
  const hi = Math.max(...prices)
  const mid = (lo + hi) / 2
  const span = Math.max(hi - lo, 260) * 1.25
  const pMin = mid - span / 2
  const pMax = mid + span / 2
  const priceToY = (p: number) => P_BOT - ((p - pMin) / (pMax - pMin)) * (P_BOT - P_TOP)
  const yToPrice = (y: number) => pMin + ((P_BOT - y) / (P_BOT - P_TOP)) * (pMax - pMin)

  // Set a handle from a viewBox y-coordinate, in that handle's own units. Not
  // memoised: it closes over the fitted price scale, which moves every render.
  const applyY = (h: Handle, vbY: number) => {
    if (h === 'fExit') setFExit(clamp(snap(yToPrice(vbY), F_STEP), F_MIN, F_MAX))
    else if (h === 'dEntry') setDEntry(clamp(snap(yToDiff(vbY), D_STEP), D_MIN, D_MAX))
    else setDExit(clamp(snap(yToDiff(vbY), D_STEP), D_MIN, D_MAX))
  }

  const nudge = (h: Handle, dir: number) => {
    if (h === 'fExit') setFExit(v => clamp(snap(v + dir * F_STEP, F_STEP), F_MIN, F_MAX))
    else if (h === 'dEntry') setDEntry(v => clamp(snap(v + dir * D_STEP, D_STEP), D_MIN, D_MAX))
    else setDExit(v => clamp(snap(v + dir * D_STEP, D_STEP), D_MIN, D_MAX))
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    if (!rect.height) return // jsdom / hidden: nothing sensible to map
    applyY(drag, ((e.clientY - rect.top) / rect.height) * VB_H)
  }

  const onKeyDown = (h: Handle) => (e: React.KeyboardEvent) => {
    const dir = e.key === 'ArrowUp' || e.key === 'ArrowRight' ? 1
      : e.key === 'ArrowDown' || e.key === 'ArrowLeft' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    nudge(h, dir)
  }

  const yFEntry = priceToY(F_ENTRY)
  const yFExit = priceToY(fExit)
  const yPEntry = priceToY(buyPrice)
  const yPExit = priceToY(sellPrice)
  const yDEntry = diffToY(dEntry)
  const yDExit = diffToY(dExit)
  // Round price gridlines inside the fitted window.
  const stepGrid = span > 900 ? 300 : span > 450 ? 150 : 100
  const gridLines: number[] = []
  for (let g = Math.ceil(pMin / stepGrid) * stepGrid; g <= pMax; g += stepGrid) gridLines.push(g)

  // One draggable handle: hollow ring, focusable, arrow-keyable.
  const handle = (h: Handle, x: number, y: number, color: string, label: string, valueNow: number) => (
    <g
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuenow={valueNow}
      aria-valuemin={h === 'fExit' ? F_MIN : D_MIN}
      aria-valuemax={h === 'fExit' ? F_MAX : D_MAX}
      onKeyDown={onKeyDown(h)}
      onPointerDown={e => {
        e.preventDefault()
        ;(e.target as Element).setPointerCapture?.(e.pointerId)
        setDrag(h)
      }}
      className="cursor-ns-resize focus:outline-none"
      style={{ touchAction: 'none' }}
    >
      {/* generous invisible hit area */}
      <circle cx={x} cy={y} r={16} fill="transparent" />
      <circle cx={x} cy={y} r={drag === h ? 9 : 7} fill="#0b1220" stroke={color} strokeWidth={3} />
      <circle cx={x} cy={y} r={2} fill={color} />
    </g>
  )

  const rows = [
    { name: 'Physical leg', detail: `sell ${flat(sellPrice)} − buy ${flat(buyPrice)}`, v: physical },
    { name: 'Futures leg (short hedge)', detail: `sold ${flat(F_ENTRY)} − bought back ${flat(fExit)}`, v: futures },
  ]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1">Hedged Trade P&amp;L · long the basis (100 t Robusta, $/t)</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Drag the three hollow handles on the graph. The <strong className="text-slate-200">vertical gap</strong> between the physical and
        futures paths <em>is</em> the differential — and your P&amp;L is nothing but the change in that gap.
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* LEFT: the draggable graph */}
        <div>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="w-full touch-none select-none"
            onPointerMove={onPointerMove}
            onPointerUp={() => setDrag(null)}
            onPointerLeave={() => setDrag(null)}
            onPointerCancel={() => setDrag(null)}
            role="img"
            aria-label="Price graph from trade entry to exit: a short futures path and a long physical path, with the differential as the vertical gap between them"
          >
            {/* ── Panel 1: the two price paths ── */}
            <text x={24} y={P_TOP - 10} fill="#94a3b8" fontSize={11} className="font-mono">
              PRICE $/t — the flat market
            </text>
            {/* legend */}
            <g>
              <line x1={300} y1={P_TOP - 14} x2={322} y2={P_TOP - 14} stroke="#22d3ee" strokeWidth={2.5} />
              <text x={328} y={P_TOP - 10} fill="#22d3ee" fontSize={10} className="font-mono">physical (long)</text>
              <line x1={452} y1={P_TOP - 14} x2={474} y2={P_TOP - 14} stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="5 3" />
              <text x={480} y={P_TOP - 10} fill="#f59e0b" fontSize={10} className="font-mono">futures (short)</text>
            </g>

            {gridLines.map(g => (
              <g key={g}>
                <line x1={96} y1={priceToY(g)} x2={VB_W - 24} y2={priceToY(g)} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
                <text x={88} y={priceToY(g)} textAnchor="end" dominantBaseline="central" fill="#64748b" fontSize={11} className="font-mono">
                  {g.toLocaleString('en-US')}
                </text>
              </g>
            ))}

            <line x1={96} y1={P_BOT} x2={VB_W - 24} y2={P_BOT} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
            <text x={X_ENTRY} y={P_BOT + 18} textAnchor="middle" fill="#94a3b8" fontSize={11} className="font-mono">ENTRY</text>
            <text x={X_EXIT} y={P_BOT + 18} textAnchor="middle" fill="#94a3b8" fontSize={11} className="font-mono">EXIT</text>

            <line x1={X_ENTRY} y1={yFEntry} x2={X_EXIT} y2={yFExit} stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="6 4" />
            <line x1={X_ENTRY} y1={yPEntry} x2={X_EXIT} y2={yPExit} stroke="#22d3ee" strokeWidth={2.5} />

            <circle cx={X_ENTRY} cy={yFEntry} r={5} fill="#f59e0b" />
            <circle cx={X_ENTRY} cy={yPEntry} r={5} fill="#22d3ee" />
            <text x={X_EXIT + 14} y={(yFExit + yPExit) / 2} dominantBaseline="central" fill="#94a3b8" fontSize={10} className="font-mono">
              {flat(fExit)}
            </text>
            {handle('fExit', X_EXIT, yFExit, '#f59e0b', 'Futures price at exit, dollars per tonne', fExit)}

            {/* the two paths sit almost on top of each other, and that is the point */}
            <text x={VB_W / 2} y={P_BOT + 34} textAnchor="middle" fill="#64748b" fontSize={10} className="font-mono">
              the two lines almost coincide — that is the point
            </text>

            {/* ── Panel 2: the differential, on its own scale ── */}
            <text x={24} y={D_TOP - 14} fill="#67e8f9" fontSize={11} className="font-mono">
              DIFFERENTIAL $/t — the gap between those two lines, magnified
            </text>

            {[D_MAX, 50, 0, -50, D_MIN].map(d => (
              <g key={d}>
                <line x1={96} y1={diffToY(d)} x2={VB_W - 24} y2={diffToY(d)}
                  stroke={d === 0 ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.07)'} strokeWidth={1} />
                <text x={88} y={diffToY(d)} textAnchor="end" dominantBaseline="central" fill="#64748b" fontSize={11} className="font-mono">
                  {signed(d)}
                </text>
              </g>
            ))}

            {/* the move itself: a shaded band from the entry level to the exit level */}
            <rect x={X_ENTRY} y={Math.min(yDEntry, yDExit)} width={X_EXIT - X_ENTRY} height={Math.abs(yDExit - yDEntry) || 1}
              fill={basisMove >= 0 ? '#34d399' : '#f43f5e'} fillOpacity={0.14} />
            <line x1={X_ENTRY} y1={yDEntry} x2={X_EXIT} y2={yDExit} stroke="#22d3ee" strokeWidth={2.5} />
            <line x1={X_ENTRY} y1={yDEntry} x2={X_EXIT} y2={yDEntry} stroke="#22d3ee" strokeWidth={1} strokeDasharray="3 4" opacity={0.5} />

            <text x={X_ENTRY - 12} y={yDEntry} textAnchor="end" dominantBaseline="central" fill="#67e8f9" fontSize={12} fontWeight="bold" className="font-mono">
              {signed(dEntry)}
            </text>
            <text x={X_EXIT + 14} y={yDExit} dominantBaseline="central" fill="#67e8f9" fontSize={12} fontWeight="bold" className="font-mono">
              {signed(dExit)}
            </text>
            <text x={(X_ENTRY + X_EXIT) / 2}
              y={basisMove >= 0 ? Math.min(yDEntry, yDExit) - 12 : Math.max(yDEntry, yDExit) + 18}
              textAnchor="middle"
              fill={basisMove >= 0 ? '#6ee7b7' : '#fda4af'} fontSize={11} fontWeight="bold" className="font-mono">
              basis {basisMove >= 0 ? 'strengthened' : 'weakened'} {usd(basisMove)}/t  =  your P&amp;L
            </text>
            <text x={X_ENTRY} y={D_BOT + 16} textAnchor="middle" fill="#94a3b8" fontSize={11} className="font-mono">ENTRY</text>
            <text x={X_EXIT} y={D_BOT + 16} textAnchor="middle" fill="#94a3b8" fontSize={11} className="font-mono">EXIT</text>

            {handle('dEntry', X_ENTRY, yDEntry, '#22d3ee', 'Entry differential, dollars per tonne', dEntry)}
            {handle('dExit', X_EXIT, yDExit, '#22d3ee', 'Exit differential, dollars per tonne', dExit)}
          </svg>

          <div className="mt-2 space-y-2.5 border-t border-white/10 pt-3">
            <Slider label="Entry differential ($/t)" value={dEntry} min={D_MIN} max={D_MAX} step={D_STEP} onChange={setDEntry} display={signed(dEntry)} />
            <Slider label="Exit differential ($/t)" value={dExit} min={D_MIN} max={D_MAX} step={D_STEP} onChange={setDExit} display={signed(dExit)} />
            <Slider label="Futures at exit ($/t) — drag it anywhere" value={fExit} min={F_MIN} max={F_MAX} step={F_STEP} onChange={setFExit} display={flat(fExit)} amber />
          </div>
        </div>

        {/* RIGHT: the arithmetic */}
        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-xs space-y-1.5">
            <div className="eyebrow mb-1">Entry (both legs at once)</div>
            <div className="flex justify-between"><span className="text-slate-400">Buy physical at</span><span className="text-white">London {flat(F_ENTRY)} {dEntry >= 0 ? '+' : '−'} ${Math.abs(dEntry)} = <b>{flat(buyPrice)}</b></span></div>
            <div className="flex justify-between"><span className="text-slate-400">Hedge: sell futures at</span><span className="text-white">{flat(F_ENTRY)}</span></div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-xs tabular-nums">
            <div className="eyebrow mb-2">P&amp;L decomposition ($/t)</div>
            <div className="space-y-1.5">
              {rows.map(r => (
                <div key={r.name} className="flex justify-between gap-2">
                  <span className="text-slate-400">{r.name} <span className="text-slate-600">({r.detail})</span></span>
                  <span className={r.v >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{usd(r.v)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-white/15 pt-1.5">
                <span className="font-bold text-white">Net = basis move</span>
                <span className={`font-bold ${net >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{usd(net)}/t</span>
              </div>
            </div>
          </div>

          <div className={`rounded-xl border p-4 font-mono text-xs tabular-nums ${
            net >= 0 ? 'border-emerald-500/30 bg-emerald-500/[0.08]' : 'border-rose-500/40 bg-rose-500/[0.10]'
          }`}>
            <div className={`eyebrow mb-1 ${net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              Basis {basisMove >= 0 ? 'strengthened' : 'weakened'} {usd(basisMove)}/t
            </div>
            <div className={`text-3xl font-bold ${net >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
              {usd(net * TONNES)}
            </div>
            <p className="mt-1.5 leading-relaxed text-slate-400">
              on {TONNES} t — exactly (exit diff {signed(dExit)}) − (entry diff {signed(dEntry)}), whatever the flat price did. The hedged
              trader&apos;s whole P&amp;L <em>is</em> the differential.
            </p>
          </div>

          <p className="text-xs leading-relaxed text-slate-400">
            Drag the <span className="font-bold text-amber-300">amber</span> handle and watch both paths fall together: the two big legs
            swing violently and their sum never moves. Drag either <span className="font-bold text-cyan-300">cyan</span> handle — the gap
            changes, and the P&amp;L moves one-for-one. That asymmetry is the entire business model of a physical desk.
          </p>
        </div>
      </div>
    </div>
  )
}
