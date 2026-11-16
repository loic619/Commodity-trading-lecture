'use client'

import { useState } from 'react'

// The four standard structures, compared on the things that decide which one a
// desk actually uses: what it costs, what it gives up, and — the one students
// never think about — whether it generates margin calls.
//
// Deliberately not another payoff lab: the section before this one already has
// one. Here each structure gets a compact curve plus the commercial panel, and
// a scenario slider so the trade-offs land as numbers.
//
// Arabica KC, ¢/lb. Producer structures assume the desk owns the coffee.

type Key = 'pput' | 'cap' | 'collar' | 'straddle'

const PUT_K = 230
const PUT_PREM = 8
const CALL_K = 275
const CALL_PREM = 8
const STRAD_K = 250
const STRAD_PREM = 34 // 17¢ call + 17¢ put, the ATM rule of thumb at 35% vol, 3m

type Struct = {
  key: Key
  name: string
  side: string
  color: string
  // Effective realised price (producer), effective cost (consumer), or P&L.
  yLabel: string
  fx: (s: number) => number
  // The unhedged reference on the same axis, or null for the volatility trade.
  ref: ((s: number) => number) | null
  cost: string
  best: string
  worst: string
  gives: string
  margin: string
  marginBad: boolean
  when: string
}

const STRUCTS: Struct[] = [
  {
    key: 'pput', name: 'Protective put', side: 'producer floor', color: '#22d3ee',
    yLabel: 'effective price realised, ¢/lb',
    fx: s => Math.max(s, PUT_K) - PUT_PREM,
    ref: s => s,
    cost: `${PUT_PREM}¢/lb paid up front — a real, permanent cost`,
    best: 'Unlimited: the market rallies and you keep all of it, less the premium',
    worst: `${PUT_K} − ${PUT_PREM} = ${PUT_K - PUT_PREM}¢ floor, whatever happens`,
    gives: 'Nothing on the upside. You give up cash instead.',
    margin: 'None. A long option is paid for once; there is nothing to margin after that.',
    marginBad: false,
    when: 'When you can afford insurance and genuinely want the upside. Beware the running cost: a standing put-buying programme can give away several ¢/lb a year — that is the premium, every year, whether or not it is ever needed.',
  },
  {
    key: 'cap', name: 'Cap (long call)', side: 'consumer ceiling', color: '#a78bfa',
    yLabel: 'effective cost paid, ¢/lb',
    fx: s => Math.min(s, CALL_K) + CALL_PREM,
    ref: s => s,
    cost: `${CALL_PREM}¢/lb paid up front`,
    best: 'The market falls and you buy cheap — you keep the whole fall, less the premium',
    worst: `${CALL_K} + ${CALL_PREM} = ${CALL_K + CALL_PREM}¢ ceiling on what you ever pay`,
    gives: 'Nothing on the downside. Again, you pay cash instead.',
    margin: 'None — the mirror image of the protective put, and for the same reason.',
    marginBad: false,
    when: 'A roaster who has quoted a retail price for the year and cannot reprice the shelf. The cap is what lets them promise a price without betting the margin on the crop.',
  },
  {
    key: 'collar', name: 'Zero-cost collar', side: 'the workhorse', color: '#34d399',
    yLabel: 'effective price realised, ¢/lb',
    fx: s => Math.min(Math.max(s, PUT_K), CALL_K),
    ref: s => s,
    cost: `Zero up front — the ${CALL_PREM}¢ call sold pays for the ${PUT_PREM}¢ put bought`,
    best: `${CALL_K}¢, and not a cent more`,
    worst: `${PUT_K}¢ floor`,
    gives: `Everything above ${CALL_K}¢. You have sold your own upside to finance your floor.`,
    margin: 'YES — and this is the catch. The short call leg is margined. A violent rally means variation margin wiring OUT on the hedge, daily, while the physical that backs it is still unsold and unfinanceable.',
    marginBad: true,
    when: 'The default structure on a physical desk, because it costs nothing on day one. Structurally it is long physical + long put + short call. Size the liquidity line before you put it on: this is the funding squeeze that has broken real hedging programmes.',
  },
  {
    key: 'straddle', name: 'Straddle', side: 'a volatility trade', color: '#f59e0b',
    yLabel: 'P&L at expiry, ¢/lb',
    fx: s => Math.abs(s - STRAD_K) - STRAD_PREM,
    ref: null,
    cost: `${STRAD_PREM}¢/lb — TWO premiums, which is the whole problem`,
    best: 'Unlimited in either direction, once the move clears both premiums',
    worst: `−${STRAD_PREM}¢ if the market expires exactly at ${STRAD_K}`,
    gives: 'Nothing structural — but you need a big move just to break even.',
    margin: 'None: both legs are bought. The risk is time, not funding.',
    marginBad: false,
    when: 'Around known event risk — frost season, a WASDE release, an EUDR ruling. You are not trading direction, you are trading REALISED volatility against IMPLIED. Profitable only if the move exceeds the two premiums you paid.',
  },
]

const S_MIN = 170
const S_MAX = 340

// Chart geometry
const W = 560, H = 274, ML = 52, MR = 70, MT = 32, MB = 36  // MT leaves room for the axis caption above the top tick
const PW = W - ML - MR
const PH = H - MT - MB

export default function OptionStructures() {
  const [sel, setSel] = useState<Key>('collar')
  const [spot, setSpot] = useState(300)
  const st = STRUCTS.find(s => s.key === sel)!

  // y-domain from the structure's own curve plus its reference
  const samples = [S_MIN, PUT_K, STRAD_K, CALL_K, S_MAX].filter(s => s >= S_MIN && s <= S_MAX)
  const ys = samples.flatMap(s => (st.ref ? [st.fx(s), st.ref(s)] : [st.fx(s)]))
  const yLo = Math.min(...ys) - 12
  const yHi = Math.max(...ys) + 12

  const sx = (s: number) => ML + ((s - S_MIN) / (S_MAX - S_MIN)) * PW
  const sy = (y: number) => MT + PH - ((y - yLo) / (yHi - yLo)) * PH

  // Piecewise linear, so sampling the kinks is exact
  const kinks = [S_MIN, PUT_K, STRAD_K, CALL_K, S_MAX]
    .filter(s => s >= S_MIN && s <= S_MAX)
    .sort((a, b) => a - b)
  const path = (f: (s: number) => number) =>
    kinks.map((s, i) => `${i ? 'L' : 'M'} ${sx(s).toFixed(1)} ${sy(f(s)).toFixed(1)}`).join(' ')

  // Typographic minus, to match every other figure in the app.
  const cents = (n: number) => {
    const v = Math.round(n)
    return (v < 0 ? '−' : '') + Math.abs(v) + '¢'
  }

  const at = st.fx(spot)
  const ref = st.ref ? st.ref(spot) : null
  const delta = ref === null ? null : at - ref

  const yTicks = (() => {
    const step = yHi - yLo > 160 ? 50 : yHi - yLo > 80 ? 25 : 10
    const out: number[] = []
    for (let v = Math.ceil(yLo / step) * step; v <= yHi; v += step) out.push(v)
    return out
  })()

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Four structures — and which one your treasurer will object to</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        They all manage price. They differ on what they <strong className="text-slate-200">cost</strong>, what they{' '}
        <strong className="text-slate-200">give up</strong>, and whether they <strong className="text-slate-200">generate margin
        calls</strong> — and only the last one ever breaks a desk.
      </p>

      <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Structure">
        {STRUCTS.map(s => (
          <button
            key={s.key} type="button" onClick={() => setSel(s.key)}
            aria-pressed={sel === s.key}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
              sel === s.key ? 'bg-white/[0.08]' : 'border-white/10 text-slate-400 hover:text-slate-200'
            }`}
            style={sel === s.key ? { borderColor: s.color + '99', color: s.color } : undefined}
          >
            {s.name}
            <span className="ml-1.5 text-[10px] font-normal opacity-60">{s.side}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
            aria-label={`${st.name}: ${st.yLabel} against the market price at expiry`}>
            {yTicks.map(v => (
              <g key={v}>
                <line x1={ML} y1={sy(v)} x2={ML + PW} y2={sy(v)}
                  stroke={v === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'} strokeWidth={1} />
                <text x={ML - 8} y={sy(v)} textAnchor="end" dominantBaseline="central" fill="#64748b" fontSize={10} className="font-mono">{v}</text>
              </g>
            ))}
            <line x1={ML} y1={MT + PH} x2={ML + PW} y2={MT + PH} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
            {[200, 250, 300].map(s => (
              <text key={s} x={sx(s)} y={MT + PH + 16} textAnchor="middle" fill="#64748b" fontSize={10} className="font-mono">{s}</text>
            ))}
            <text x={ML + PW} y={MT + PH + 30} textAnchor="end" fill="#64748b" fontSize={10} className="font-mono">
              market at expiry, ¢/lb →
            </text>
            <text x={ML - 44} y={14} fill="#64748b" fontSize={10} className="font-mono">{st.yLabel}</text>

            {/* unhedged reference */}
            {st.ref && (
              <>
                <path d={path(st.ref)} fill="none" stroke="#64748b" strokeWidth={1.5} strokeDasharray="5 4" />
                <text x={ML + PW + 6} y={sy(st.ref(S_MAX))} dominantBaseline="central" fill="#94a3b8" fontSize={10} className="font-mono">
                  unhedged
                </text>
              </>
            )}

            {/* the structure */}
            <path d={path(st.fx)} fill="none" stroke={st.color} strokeWidth={2.5} />
            <text x={ML + PW + 6} y={sy(st.fx(S_MAX))} dominantBaseline="central" fill={st.color} fontSize={10} className="font-mono">
              {st.ref ? 'hedged' : 'P&L'}
            </text>

            {/* the scenario marker */}
            <line x1={sx(spot)} y1={MT} x2={sx(spot)} y2={MT + PH} stroke="#f43f5e" strokeWidth={1.5} opacity={0.75} />
            {ref !== null && <circle cx={sx(spot)} cy={sy(ref)} r={4} fill="#64748b" />}
            <circle cx={sx(spot)} cy={sy(at)} r={5.5} fill="#0b1220" stroke={st.color} strokeWidth={2.5} />
          </svg>

          <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="mb-1 flex justify-between font-mono text-xs">
              <span className="text-rose-300">Market at expiry (¢/lb)</span>
              <span className="font-bold tabular-nums text-white">{spot}</span>
            </div>
            <input type="range" min={S_MIN} max={S_MAX} step={5} value={spot}
              onChange={e => setSpot(parseFloat(e.target.value))}
              aria-label="Market price at expiry, cents per pound"
              className="h-2 w-full cursor-pointer accent-rose-400" />
            <div className="mt-2 flex flex-wrap items-baseline gap-x-5 gap-y-1 border-t border-white/10 pt-2 font-mono text-xs tabular-nums">
              <span className="text-slate-400">
                {st.key === 'straddle' ? 'P&L' : st.key === 'cap' ? 'you pay' : 'you realise'}{' '}
                <strong style={{ color: st.color }}>{cents(at)}</strong>
              </span>
              {ref !== null && (
                <span className="text-slate-400">
                  unhedged <strong className="text-slate-200">{cents(ref)}</strong>
                </span>
              )}
              {delta !== null && (
                <span className={delta >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
                  {st.key === 'cap'
                    ? `hedge ${delta <= 0 ? 'saved' : 'cost'} ${Math.abs(delta).toFixed(0)}¢`
                    : `hedge ${delta >= 0 ? 'added' : 'cost'} ${Math.abs(delta).toFixed(0)}¢`}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-xl border p-3.5" style={{ borderColor: st.color + '55', backgroundColor: st.color + '0d' }}>
            <div className="font-mono text-sm font-bold" style={{ color: st.color }}>{st.name}</div>
            <div className="mt-2 space-y-1.5">
              {[
                ['Up-front cost', st.cost],
                ['Best case', st.best],
                ['Worst case', st.worst],
                ['What you give up', st.gives],
              ].map(([k, v]) => (
                <div key={k} className="border-b border-white/[0.06] pb-1.5 last:border-0">
                  <span className="font-mono text-[10px] uppercase tracking-wide text-slate-500">{k}</span>
                  <p className="text-xs leading-relaxed text-slate-300">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-xl border p-3.5 ${st.marginBad ? 'border-rose-500/50 bg-rose-500/[0.10]' : 'border-white/10 bg-white/[0.02]'}`}>
            <div className={`font-mono text-xs font-bold uppercase tracking-wide ${st.marginBad ? 'text-rose-300' : 'text-slate-300'}`}>
              Does it generate margin calls?
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{st.margin}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">When a desk reaches for it</div>
            <p className="text-xs leading-relaxed text-slate-300">{st.when}</p>
          </div>
        </div>
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-slate-400">
        Read the four cost lines together. Two of these structures cost cash up front and nothing afterwards; the collar costs nothing
        up front and can cost a great deal afterwards. <strong className="text-slate-200">“Zero-cost” prices the premium, not the
        funding</strong> — which is why the collar is simultaneously the most used structure on a physical desk and the one that has
        broken the most hedging programmes.
      </p>
    </div>
  )
}
