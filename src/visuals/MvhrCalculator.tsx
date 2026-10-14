'use client'

import { useState } from 'react'

// h* = rho x (sigma_S / sigma_F), Ederington (1979), with the scatter that
// makes it intuitive: the regression slope of physical returns on futures
// returns IS the hedge ratio, and the scatter's tightness IS rho.
//
// Worked default: 1,000 t Brazilian conilon hedged with London Robusta.
// sigma_S = 310, sigma_F = 340, rho = 0.82 -> h* = 0.75 -> 75 lots, not 100.

const VOLUME = 1000
const LOT = 10

const VB_W = 320
const VB_H = 260
const PAD = 38

// A fixed pseudo-random cloud, so the scatter is stable across renders and the
// shape is driven only by rho / sigma. Box-Muller on a small LCG.
function normals(n: number): [number, number][] {
  let seed = 20240917
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
  return Array.from({ length: n }, () => {
    const u = Math.max(rand(), 1e-9)
    const v = rand()
    const r = Math.sqrt(-2 * Math.log(u))
    return [r * Math.cos(2 * Math.PI * v), r * Math.sin(2 * Math.PI * v)] as [number, number]
  })
}
const CLOUD = normals(90)

function Slider({ label, value, min, max, step, onChange, display }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; display: string
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between">
        <span className="font-mono text-xs text-slate-400">{label}</span>
        <span className="font-mono text-xs font-bold tabular-nums text-white">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        aria-label={label}
        className="h-1.5 w-full cursor-pointer accent-brand-cyan" />
    </div>
  )
}

export default function MvhrCalculator() {
  const [sigmaS, setSigmaS] = useState(310)
  const [sigmaF, setSigmaF] = useState(340)
  const [rho, setRho] = useState(0.82)

  const h = rho * (sigmaS / sigmaF)
  const tonnes = VOLUME * h
  const lots = Math.round(tonnes / LOT)
  const effectiveness = rho * rho
  const naiveLots = VOLUME / LOT
  const overHedge = naiveLots - lots

  // Residual (basis) volatility left after the optimal hedge.
  const residual = sigmaS * Math.sqrt(Math.max(0, 1 - rho * rho))

  // Scatter: futures return x, physical return y = h*x + independent noise,
  // scaled so the cloud has the requested sigmas and correlation.
  const pts = CLOUD.map(([z1, z2]) => {
    const x = z1 * sigmaF
    const y = rho * sigmaS * z1 + Math.sqrt(Math.max(0, 1 - rho * rho)) * sigmaS * z2
    return [x, y] as [number, number]
  })
  const span = Math.max(sigmaF, sigmaS) * 2.8
  const sx = (x: number) => PAD + ((x + span / 2) / span) * (VB_W - PAD - 12)
  const sy = (y: number) => VB_H - PAD - ((y + span / 2) / span) * (VB_H - PAD - 12)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">The minimum-variance hedge ratio — 1,000 t conilon on London Robusta</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        The coverage ratio assumed your physical moves one-for-one with the hedge. On a{' '}
        <strong className="text-slate-200">cross-hedge</strong> it does not. Each dot is one month: futures return across, physical
        return up. The <strong className="text-slate-200">slope of the cloud is the hedge ratio</strong>; how tight it is, is ρ.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
        {/* the regression picture */}
        <div>
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full" role="img"
            aria-label={`Scatter of physical against futures monthly moves, correlation ${rho.toFixed(2)}, regression slope ${h.toFixed(2)}`}>
            {/* axes */}
            <line x1={PAD} y1={VB_H - PAD} x2={VB_W - 12} y2={VB_H - PAD} stroke="rgba(255,255,255,0.15)" />
            <line x1={PAD} y1={12} x2={PAD} y2={VB_H - PAD} stroke="rgba(255,255,255,0.15)" />
            {/* zero crosshair */}
            <line x1={sx(0)} y1={12} x2={sx(0)} y2={VB_H - PAD} stroke="rgba(255,255,255,0.08)" />
            <line x1={PAD} y1={sy(0)} x2={VB_W - 12} y2={sy(0)} stroke="rgba(255,255,255,0.08)" />

            {/* the 1:1 naive hedge, for contrast */}
            <line x1={sx(-span / 2)} y1={sy(-span / 2)} x2={sx(span / 2)} y2={sy(span / 2)}
              stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="5 4" opacity={0.75} />
            {/* the minimum-variance line */}
            <line x1={sx(-span / 2)} y1={sy((-span / 2) * h)} x2={sx(span / 2)} y2={sy((span / 2) * h)}
              stroke="#22d3ee" strokeWidth={2.5} />

            {pts.map(([x, y], i) => (
              <circle key={i} cx={sx(x)} cy={sy(y)} r={2.6} fill="#94a3b8" fillOpacity={0.75} />
            ))}

            <text x={VB_W - 12} y={VB_H - PAD + 18} textAnchor="end" fill="#64748b" fontSize={10} className="font-mono">
              futures move $/t →
            </text>
            <text x={10} y={16} fill="#64748b" fontSize={10} className="font-mono">physical $/t ↑</text>
            {/* each label rides its own line, at a different x, so they never collide */}
            <text x={sx(span * 0.2) + 8} y={sy(span * 0.2 * h) + 14} fill="#22d3ee" fontSize={10} className="font-mono">
              h* = {h.toFixed(2)}
            </text>
            <text x={sx(span * 0.06) - 8} y={sy(span * 0.06) - 8} textAnchor="end" fill="#f43f5e" fontSize={10} className="font-mono">
              naive 1:1
            </text>
          </svg>

          <div className="mt-2 space-y-2.5 border-t border-white/10 pt-3">
            <Slider label="σ_S — physical volatility ($/t per month)" value={sigmaS} min={100} max={600} step={10} onChange={setSigmaS} display={`$${sigmaS}`} />
            <Slider label="σ_F — futures volatility ($/t per month)" value={sigmaF} min={100} max={600} step={10} onChange={setSigmaF} display={`$${sigmaF}`} />
            <Slider label="ρ — correlation" value={rho} min={0.3} max={0.99} step={0.01} onChange={setRho} display={rho.toFixed(2)} />
          </div>
        </div>

        {/* the arithmetic */}
        <div className="space-y-2.5">
          <div className="rounded-xl border border-cyan-400/40 bg-cyan-400/[0.08] p-3.5 font-mono text-xs tabular-nums">
            <div className="mb-1.5 font-mono text-[11px] tracking-[0.12em] text-cyan-300">h* = ρ × (σ_S / σ_F)</div>
            <div className="text-slate-300">
              {rho.toFixed(2)} × ({sigmaS} / {sigmaF}) = <strong className="text-2xl text-cyan-300">{h.toFixed(2)}</strong>
            </div>
            <div className="mt-2 border-t border-white/10 pt-2 text-slate-300">
              Hedge <strong className="text-white">{Math.round(tonnes).toLocaleString('en-US')} t = {lots} lots</strong>, not {naiveLots}.
            </div>
          </div>

          <div className={`rounded-xl border p-3 font-mono text-xs tabular-nums ${
            overHedge > 0 ? 'border-rose-500/40 bg-rose-500/[0.08]' : overHedge < 0 ? 'border-amber-500/40 bg-amber-500/[0.08]' : 'border-white/10 bg-white/[0.02]'
          }`}>
            <div className={`eyebrow mb-1 ${overHedge > 0 ? 'text-rose-400' : overHedge < 0 ? 'text-amber-300' : 'text-slate-400'}`}>
              What a naive 1:1 hedge would do
            </div>
            <p className="leading-relaxed text-slate-300">
              {overHedge > 0 ? (
                <>The extra <strong className="text-rose-300">{overHedge} lots</strong> are a speculative short position wearing a hedge
                costume — {Math.abs(overHedge * LOT).toLocaleString('en-US')} t of outright risk you did not intend to take.</>
              ) : overHedge < 0 ? (
                <>Your physical is MORE volatile than the futures, so 1:1 would <strong className="text-amber-300">under-hedge</strong> by{' '}
                {Math.abs(overHedge)} lots. Cross-hedges are not always smaller than one.</>
              ) : (
                <>At these inputs the optimal hedge happens to be 1:1 — which is the special case, not the rule.</>
              )}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-xs tabular-nums">
            <div className="eyebrow mb-2">Hedge effectiveness</div>
            <div className="flex items-baseline justify-between">
              <span className="text-slate-400">ρ² — variance removed</span>
              <span className="font-bold text-emerald-300">{(effectiveness * 100).toFixed(0)}%</span>
            </div>
            <div className="mt-1.5 flex h-3 overflow-hidden rounded bg-amber-500/25" aria-hidden="true">
              <div className="h-full bg-emerald-400/70" style={{ width: `${effectiveness * 100}%` }} />
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="text-slate-400">1 − ρ² — your basis risk, quantified</span>
              <span className="font-bold text-amber-300">{((1 - effectiveness) * 100).toFixed(0)}%</span>
            </div>
            <p className="mt-2 border-t border-white/10 pt-2 leading-relaxed text-slate-400">
              Residual volatility after the optimal hedge: <strong className="text-white">${residual.toFixed(0)}/t per month</strong>. That
              number <em>is</em> the basis risk — no longer a word, a figure you can size a limit against.
            </p>
          </div>

          <div className="rounded-xl border border-violet-500/40 bg-violet-500/[0.08] p-3">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-violet-300">The risk the ratio cannot fix</div>
            <p className="text-xs leading-relaxed text-slate-300">
              <strong className="text-white">Funding.</strong> Variation margin on the futures leg settles in cash daily while the
              physical stays illiquid. Size the liquidity line together with the hedge — a hedging programme without one is a
              speculation on your own funding.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
