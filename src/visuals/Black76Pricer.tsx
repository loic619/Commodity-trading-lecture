'use client'

import { useState } from 'react'

// Black-76, with the arithmetic shown rather than hidden behind a result.
//
// Two things this has to land. The formula is not magic — substitute the
// numbers and it is four lines. And put-call parity is not a theorem to
// memorise: on the premium-vs-strike chart the two curves cross exactly where
// K = F, which IS the statement that an at-the-money call and put are worth
// the same.
//
// Defaults reproduce the lecture's worked example: F = 4,500, K = 4,500,
// σ = 35%, T = 0.25, r = 4% → C ≈ $311/t.

/** Standard normal CDF — Abramowitz & Stegun 26.2.17, |ε| < 7.5e-8. */
function normCdf(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x))
  const d = 0.3989422804014327 * Math.exp((-x * x) / 2)
  const p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))))
  return x >= 0 ? 1 - p : p
}

function black76(F: number, K: number, sigma: number, T: number, r: number) {
  const vt = sigma * Math.sqrt(T)
  const df = Math.exp(-r * T)
  // At expiry, or at a zero-vol limit, the option is worth its discounted intrinsic.
  if (vt <= 1e-9) {
    return { d1: NaN, d2: NaN, nd1: NaN, nd2: NaN, df, call: df * Math.max(F - K, 0), put: df * Math.max(K - F, 0) }
  }
  const d1 = (Math.log(F / K) + (sigma * sigma * T) / 2) / vt
  const d2 = d1 - vt
  return {
    d1, d2, df,
    nd1: normCdf(d1), nd2: normCdf(d2),
    call: df * (F * normCdf(d1) - K * normCdf(d2)),
    put: df * (K * normCdf(-d2) - F * normCdf(-d1)),
  }
}

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

// Chart geometry
const W = 540, H = 264, ML = 52, MR = 58, MT = 30, MB = 34  // MT leaves room for the axis caption above the top tick
const PW = W - ML - MR
const PH = H - MT - MB

export default function Black76Pricer() {
  const [F, setF] = useState(4500)
  const [K, setK] = useState(4500)
  const [sigma, setSigma] = useState(0.35)
  const [T, setT] = useState(0.25)
  const [r, setR] = useState(0.04)

  const m = black76(F, K, sigma, T, r)

  // Put-call parity: C − P must equal e^(−rT)(F − K).
  const parityLhs = m.call - m.put
  const parityRhs = m.df * (F - K)

  // The rule of thumb every trader carries: ATM ≈ 0.4 · F · σ · √T
  const rule = 0.4 * F * sigma * Math.sqrt(T)

  // Sign goes before the symbol, and the rounded value decides it so a value
  // that rounds to zero never renders as "−$0".
  const usd = (n: number) => {
    const v = Math.round(n)
    return (v < 0 ? '−$' : '$') + Math.abs(v).toLocaleString('en-US')
  }
  const n4 = (n: number) => (Number.isFinite(n) ? n.toFixed(4) : '—')
  const n3 = (n: number) => (Number.isFinite(n) ? n.toFixed(3) : '—')

  // Premium against strike, so the crossing point is visible.
  const kLo = F * 0.6
  const kHi = F * 1.4
  const pts = Array.from({ length: 61 }, (_, i) => {
    const k = kLo + ((kHi - kLo) * i) / 60
    const q = black76(F, k, sigma, T, r)
    return { k, c: q.call, p: q.put }
  })
  const yHi = Math.max(...pts.map(x => Math.max(x.c, x.p))) * 1.08
  const sx = (k: number) => ML + ((k - kLo) / (kHi - kLo)) * PW
  const sy = (v: number) => MT + PH - (v / yHi) * PH
  const line = (sel: 'c' | 'p') => pts.map((x, i) => `${i ? 'L' : 'M'} ${sx(x.k).toFixed(1)} ${sy(x[sel]).toFixed(1)}`).join(' ')
  // Intrinsic value of the call, discounted — the gap to the curve is time value.
  const intrinsic = pts.map((x, i) => `${i ? 'L' : 'M'} ${sx(x.k).toFixed(1)} ${sy(m.df * Math.max(F - x.k, 0)).toFixed(1)}`).join(' ')

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Black-76 — options on futures, Robusta $/t</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        The futures price already embeds carry, so no storage or yield terms appear — that is the whole difference from
        Black-Scholes. Move the inputs and watch the arithmetic, not just the answer.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
            aria-label="Call and put premium against strike; the two curves cross where the strike equals the futures price">
            {[0, 0.25, 0.5, 0.75, 1].map(f => {
              const v = yHi * f
              return (
                <g key={f}>
                  <line x1={ML} y1={sy(v)} x2={ML + PW} y2={sy(v)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                  <text x={ML - 8} y={sy(v)} textAnchor="end" dominantBaseline="central" fill="#64748b" fontSize={10} className="font-mono">
                    {Math.round(v)}
                  </text>
                </g>
              )
            })}
            <line x1={ML} y1={MT + PH} x2={ML + PW} y2={MT + PH} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
            <text x={ML - 44} y={14} fill="#64748b" fontSize={10} className="font-mono">premium $/t</text>
            <text x={ML + PW} y={MT + PH + 28} textAnchor="end" fill="#64748b" fontSize={10} className="font-mono">strike $/t →</text>

            {/* discounted intrinsic: the gap up to the call curve is time value */}
            <path d={intrinsic} fill="none" stroke="#475569" strokeWidth={1.25} strokeDasharray="4 4" />

            {/* F — where the curves must cross */}
            <line x1={sx(F)} y1={MT} x2={sx(F)} y2={MT + PH} stroke="rgba(255,255,255,0.22)" strokeWidth={1} strokeDasharray="4 4" />
            <text x={sx(F)} y={MT - 6} textAnchor="middle" fill="#94a3b8" fontSize={10} className="font-mono">F</text>

            <path d={line('c')} fill="none" stroke="#34d399" strokeWidth={2.5} />
            <path d={line('p')} fill="none" stroke="#f59e0b" strokeWidth={2.5} />
            <text x={ML + PW + 6} y={sy(pts[pts.length - 1].c)} dominantBaseline="central" fill="#34d399" fontSize={10} className="font-mono">call</text>
            <text x={ML + PW + 6} y={sy(pts[pts.length - 1].p)} dominantBaseline="central" fill="#f59e0b" fontSize={10} className="font-mono">put</text>

            {/* the chosen strike */}
            <line x1={sx(K)} y1={MT} x2={sx(K)} y2={MT + PH} stroke="#22d3ee" strokeWidth={1.5} />
            <circle cx={sx(K)} cy={sy(m.call)} r={5} fill="#0b1220" stroke="#34d399" strokeWidth={2.5} />
            <circle cx={sx(K)} cy={sy(m.put)} r={5} fill="#0b1220" stroke="#f59e0b" strokeWidth={2.5} />
            <text x={sx(K)} y={MT + PH + 16} textAnchor="middle" fill="#67e8f9" fontSize={10} className="font-mono">K</text>
          </svg>

          <div className="mt-2 space-y-2.5 border-t border-white/10 pt-3">
            <Slider label="F — futures price ($/t)" value={F} min={3000} max={6000} step={50} onChange={setF} display={usd(F)} />
            <Slider label="K — strike ($/t)" value={K} min={3000} max={6000} step={50} onChange={setK} display={usd(K)} />
            <Slider label="σ — implied volatility" value={sigma} min={0.1} max={0.8} step={0.01} onChange={setSigma} display={`${(sigma * 100).toFixed(0)}%`} />
            <Slider label="T — time to expiry (years)" value={T} min={0.02} max={1.5} step={0.01} onChange={setT} display={`${T.toFixed(2)}y`} />
            <Slider label="r — risk-free rate" value={r} min={0} max={0.1} step={0.005} onChange={setR} display={`${(r * 100).toFixed(1)}%`} />
          </div>
        </div>

        <div className="space-y-2.5">
          {/* the arithmetic, substituted */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-xs tabular-nums">
            <div className="mb-2 font-mono text-[11px] tracking-[0.12em] text-cyan-300">d₁ = [ln(F/K) + σ²T/2] / (σ√T)</div>
            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between"><span className="text-slate-500">σ√T</span><span>{n4(sigma * Math.sqrt(T))}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">ln(F/K)</span><span>{n4(Math.log(F / K))}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">d₁</span><span className="font-bold text-white">{n4(m.d1)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">d₂ = d₁ − σ√T</span><span className="font-bold text-white">{n4(m.d2)}</span></div>
              <div className="flex justify-between border-t border-white/10 pt-1"><span className="text-slate-500">N(d₁)</span><span>{n3(m.nd1)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">N(d₂)</span><span>{n3(m.nd2)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">e^(−rT)</span><span>{n4(m.df)}</span></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/[0.08] p-3">
              <div className="font-mono text-[11px] uppercase tracking-wide text-emerald-300">Call</div>
              <div className="font-mono text-2xl font-bold tabular-nums text-emerald-300">{usd(m.call)}</div>
              <div className="font-mono text-[10px] text-slate-400">{((m.call / F) * 100).toFixed(1)}% of the futures price</div>
            </div>
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/[0.08] p-3">
              <div className="font-mono text-[11px] uppercase tracking-wide text-amber-300">Put</div>
              <div className="font-mono text-2xl font-bold tabular-nums text-amber-300">{usd(m.put)}</div>
              <div className="font-mono text-[10px] text-slate-400">{((m.put / F) * 100).toFixed(1)}% of the futures price</div>
            </div>
          </div>

          <div className="rounded-xl border border-cyan-400/40 bg-cyan-400/[0.08] p-3 font-mono text-xs tabular-nums">
            <div className="mb-1.5 font-mono text-[11px] tracking-[0.12em] text-cyan-300">Put-call parity: C − P = e^(−rT)(F − K)</div>
            <div className="flex justify-between text-slate-300">
              <span>C − P = {usd(parityLhs)}</span>
              <span>e^(−rT)(F − K) = {usd(parityRhs)}</span>
            </div>
            <p className="mt-1.5 leading-relaxed text-slate-400">
              {Math.abs(F - K) < 1
                ? 'At the money, K = F, so both sides are zero: the call and the put are worth exactly the same. That is not a coincidence, it is the parity relation.'
                : 'Equal by construction, at every strike. Any deviation in the market is pure arbitrage — buy the cheap side, sell the dear one, hedge with the future.'}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 font-mono text-xs tabular-nums">
            <div className="mb-1 font-mono text-[11px] uppercase tracking-wide text-slate-300">The sanity check traders carry</div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">0.4 · F · σ√T</span>
              <span className="font-bold text-white">{usd(rule)}</span>
            </div>
            <p className="mt-1.5 leading-relaxed text-slate-400">
              {Math.abs(F - K) < F * 0.02
                ? <>Within a few dollars of the model&apos;s {usd(m.call)}. Learn this one: it lets you price an at-the-money option in
                  your head and catch a broker&apos;s fat finger before you hit the bid.</>
                : <>This approximation is for at-the-money options only — slide K back to F to see it bite.</>}
            </p>
          </div>

          <div className="rounded-xl border border-violet-500/40 bg-violet-500/[0.08] p-3">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-violet-300">Quoted in price, traded in vol</div>
            <p className="text-xs leading-relaxed text-slate-300">
              Implied volatility is the σ that makes this formula match the premium the market is actually showing. Run the model
              backwards and σ is the only unknown — which is why desks quote options in vol, not dollars. And the σ is not one number:
              commodity surfaces <strong className="text-white">smile and skew</strong>, and in coffee out-of-the-money{' '}
              <strong className="text-white">calls</strong> usually carry the higher vol, because the market pays up for frost and
              drought tail risk. The smile is the market pricing what Black&apos;s lognormal world leaves out.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
