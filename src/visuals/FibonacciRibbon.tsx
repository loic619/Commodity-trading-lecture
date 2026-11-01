'use client'

import { useState } from 'react'

// Two tools on one price swing, because they are used together: the ribbon
// tells you whether there is a trend, the retracements tell you where a
// pullback against it might stop.
//
// Drag the swing high and low and the levels recompute — which is the point.
// A retracement level is not a magic number, it is arithmetic on whatever two
// points you chose, and choosing them is the whole skill.

const FIBS = [
  { r: 0, label: '0%', note: 'the swing low — a full round trip' },
  { r: 0.382, label: '38.2%', note: 'a shallow pullback: a strong trend often stops here' },
  { r: 0.5, label: '50%', note: 'not a Fibonacci ratio at all, but the level markets respect most — a market typically corrects about half a move' },
  { r: 0.618, label: '61.8%', note: 'the golden ratio. Deeper than this and the trend itself is in question' },
  { r: 1, label: '100%', note: 'the swing high' },
]

const SERIES = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]

// Chart geometry
const W = 560, H = 280, ML = 58, MR = 104, MT = 20, MB = 30  // margins hold the out-of-plot level labels
const PW = W - ML - MR
const PH = H - MT - MB

// An up-swing then a pullback, as index values 0..1 of the swing.
const SHAPE = [
  0.02, 0.00, 0.08, 0.05, 0.16, 0.12, 0.26, 0.22, 0.36, 0.33,
  0.48, 0.44, 0.58, 0.55, 0.70, 0.66, 0.80, 0.77, 0.90, 0.95,
  1.00, 0.93, 0.86, 0.78, 0.70, 0.64, 0.60, 0.63, 0.58, 0.61,
]

export default function FibonacciRibbon() {
  const [low, setLow] = useState(62)
  const [high, setHigh] = useState(94)
  const [sel, setSel] = useState(2) // 50%
  const [showRibbon, setShowRibbon] = useState(true)

  const span = high - low
  const level = (r: number) => high - span * r
  const f = FIBS[sel]

  const yLo = low - span * 0.25
  const yHi = high + span * 0.15
  const sx = (i: number) => ML + (i / (SHAPE.length - 1)) * PW
  const sy = (p: number) => MT + PH - ((p - yLo) / (yHi - yLo)) * PH
  const priceAt = (i: number) => low + SHAPE[i] * span

  const path = SHAPE.map((_, i) => `${i ? 'L' : 'M'} ${sx(i).toFixed(1)} ${sy(priceAt(i)).toFixed(1)}`).join(' ')

  // Simple moving averages over the shape, for the ribbon.
  const sma = (n: number) =>
    SHAPE.map((_, i) => {
      const from = Math.max(0, i - n + 1)
      const slice = SHAPE.slice(from, i + 1)
      return low + (slice.reduce((s, v) => s + v, 0) / slice.length) * span
    })
  const ribbon = [
    { n: 21, color: '#22d3ee' },
    { n: 34, color: '#34d399' },
    { n: 55, color: '#a78bfa' },
  ].map(x => ({
    ...x,
    // The shape is 30 bars, so the Fibonacci periods are scaled to fit it.
    d: sma(Math.max(2, Math.round(x.n / 5))).map((p, i) => `${i ? 'L' : 'M'} ${sx(i).toFixed(1)} ${sy(p).toFixed(1)}`).join(' '),
  }))

  const usd = (n: number) => '$' + n.toFixed(2)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Moving averages and Fibonacci — trend, then target</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        Two tools used together: the <strong className="text-slate-200">ribbon</strong> tells you whether there is a trend at all,
        the <strong className="text-slate-200">retracements</strong> tell you where a pullback against it might stop. Drag the swing
        and the levels recompute — they are arithmetic on the two points you chose, not magic numbers.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
            aria-label={`A price swing from ${low} to ${high} dollars with Fibonacci retracement levels and a moving-average ribbon`}>
            {/* retracement levels */}
            {FIBS.map((x, i) => {
              const y = sy(level(x.r))
              const on = i === sel
              return (
                <g key={x.label} onClick={() => setSel(i)} className="cursor-pointer">
                  <rect x={ML} y={y - 7} width={PW + MR - 6} height={14} fill="transparent" />
                  <line x1={ML} y1={y} x2={ML + PW} y2={y}
                    stroke={on ? '#f59e0b' : 'rgba(255,255,255,0.14)'} strokeWidth={on ? 1.8 : 1}
                    strokeDasharray={x.r === 0 || x.r === 1 ? '0' : '5 4'} />
                  <text x={ML + PW + 6} y={y} dominantBaseline="central"
                    fill={on ? '#fbbf24' : '#64748b'} fontSize={10} fontWeight={on ? 'bold' : 'normal'} className="font-mono">
                    {x.label} · {usd(level(x.r))}
                  </text>
                </g>
              )
            })}

            {/* the ribbon */}
            {showRibbon && ribbon.map(r => (
              <path key={r.n} d={r.d} fill="none" stroke={r.color} strokeWidth={1.5} opacity={0.75} />
            ))}

            <path d={path} fill="none" stroke="#e2e8f0" strokeWidth={2.2} strokeLinejoin="round" />

            {/* swing markers */}
            <circle cx={sx(1)} cy={sy(low)} r={5} fill="#0b1220" stroke="#22d3ee" strokeWidth={2.5} />
            <circle cx={sx(20)} cy={sy(high)} r={5} fill="#0b1220" stroke="#22d3ee" strokeWidth={2.5} />
            <text x={ML - 8} y={sy(low)} textAnchor="end" dominantBaseline="central" fill="#67e8f9" fontSize={10} className="font-mono">{usd(low)}</text>
            <text x={ML - 8} y={sy(high)} textAnchor="end" dominantBaseline="central" fill="#67e8f9" fontSize={10} className="font-mono">{usd(high)}</text>
          </svg>

          <div className="mt-2 space-y-2.5 border-t border-white/10 pt-3">
            <div>
              <div className="mb-1 flex justify-between font-mono text-xs">
                <span className="text-cyan-300">Swing low ($/bbl)</span>
                <span className="font-bold tabular-nums text-white">{usd(low)}</span>
              </div>
              <input type="range" min={40} max={80} step={0.5} value={low}
                onChange={e => setLow(Math.min(parseFloat(e.target.value), high - 5))}
                aria-label="Swing low in dollars per barrel"
                className="h-1.5 w-full cursor-pointer accent-brand-cyan" />
            </div>
            <div>
              <div className="mb-1 flex justify-between font-mono text-xs">
                <span className="text-cyan-300">Swing high ($/bbl)</span>
                <span className="font-bold tabular-nums text-white">{usd(high)}</span>
              </div>
              <input type="range" min={60} max={130} step={0.5} value={high}
                onChange={e => setHigh(Math.max(parseFloat(e.target.value), low + 5))}
                aria-label="Swing high in dollars per barrel"
                className="h-1.5 w-full cursor-pointer accent-brand-cyan" />
            </div>
            <button
              type="button" onClick={() => setShowRibbon(v => !v)}
              aria-pressed={showRibbon}
              className={`rounded-lg border px-3 py-1.5 font-mono text-[11px] transition-all ${
                showRibbon ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-200' : 'border-white/15 text-slate-400 hover:text-slate-200'
              }`}
            >
              {showRibbon ? 'hide' : 'show'} the 21 / 34 / 55 ribbon
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/[0.08] p-3.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-mono text-sm font-bold text-amber-300">{f.label} retracement</span>
              <span className="font-mono text-lg font-bold tabular-nums text-white">{usd(level(f.r))}</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{f.note}</p>
            <p className="mt-2 border-t border-white/10 pt-2 font-mono text-[11px] leading-relaxed text-slate-400">
              {usd(high)} − ({usd(span)} × {f.r}) = <strong className="text-white">{usd(level(f.r))}</strong>
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="mb-1.5 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">Where the ratios come from</div>
            <div className="mb-2 flex flex-wrap gap-1">
              {SERIES.map((n, i) => (
                <span key={i} className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-slate-300">{n}</span>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              Each number divided by the next approaches <strong className="text-white">0.618</strong> — 34/55 = 0.618, 55/89 =
              0.618. The 38.2% level is 1 − 0.618. The traders&apos; periods for the ribbon come from the same series:{' '}
              <strong className="text-cyan-300">21</strong>, <strong className="text-emerald-300">34</strong>,{' '}
              <strong className="text-violet-300">55</strong> days, stacked so that price above a rising ribbon reads as bullish.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-slate-300">The honest caveat</div>
            <p className="text-xs leading-relaxed text-slate-400">
              Move the two swing points and every level moves with them. Two analysts picking different swings get different
              &ldquo;levels&rdquo; from the same chart — which is why these are a framework for planning an entry, not a forecast.
              They work partly because enough people watch them for the orders to actually be there.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
