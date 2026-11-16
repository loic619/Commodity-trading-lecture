'use client'

import { useState } from 'react'

// Inventories are read against the 5-year seasonal range, never in absolutes
// — which is the single most common beginner error in oil. The chart makes the
// band the subject: drag the current level and the verdict changes because of
// where it sits IN the range, not because the number got bigger.
//
// The balance slider closes the loop the content states: forecast supply above
// demand implies builds and a bearish bias, and the reverse.
//
// Anchors: OECD commercial stocks, million barrels. A 5-year band roughly
// 2,650–3,050 with the seasonal hump through the northern summer.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// 5-year min / avg / max by month, mb — the summer build and winter draw.
const BAND: { lo: number; av: number; hi: number }[] = [
  { lo: 2680, av: 2800, hi: 2960 },
  { lo: 2700, av: 2825, hi: 2985 },
  { lo: 2720, av: 2850, hi: 3010 },
  { lo: 2755, av: 2885, hi: 3040 },
  { lo: 2780, av: 2910, hi: 3055 },
  { lo: 2790, av: 2925, hi: 3060 },
  { lo: 2795, av: 2930, hi: 3055 },
  { lo: 2780, av: 2915, hi: 3035 },
  { lo: 2755, av: 2890, hi: 3005 },
  { lo: 2730, av: 2865, hi: 2975 },
  { lo: 2700, av: 2835, hi: 2955 },
  { lo: 2675, av: 2805, hi: 2945 },
]

// Chart geometry
const W = 580, H = 270, ML = 54, MR = 16, MT = 24, MB = 36
const PW = W - ML - MR
const PH = H - MT - MB
const Y_LO = 2600
const Y_HI = 3100

const sx = (i: number) => ML + (i / (MONTHS.length - 1)) * PW
const sy = (v: number) => MT + PH - ((v - Y_LO) / (Y_HI - Y_LO)) * PH

export default function StocksAndSpare() {
  const [month, setMonth] = useState(9)        // October
  const [stocks, setStocks] = useState(2745)
  const [balance, setBalance] = useState(-0.6) // supply − demand, mb/d
  const [demand, setDemand] = useState(45.5)   // OECD demand, mb/d

  const b = BAND[month]
  // Where the level sits inside the band, 0 = floor, 100 = ceiling.
  const posPct = ((stocks - b.lo) / (b.hi - b.lo)) * 100
  const vsAvg = stocks - b.av
  const days = stocks / demand

  const read = posPct < 20
    ? { label: 'Bottom of the range — tight', color: '#f43f5e', note: 'Stocks this low leave no buffer for a disruption, and the curve usually backwardates to bid the last barrels out of storage. Bullish.' }
    : posPct < 45
      ? { label: 'Below the five-year average', color: '#f59e0b', note: 'A modestly tight market. The direction of travel matters more than the level here — three consecutive draws say more than any single week.' }
      : posPct < 75
        ? { label: 'Mid-range — balanced', color: '#94a3b8', note: 'Nothing to trade on the stock number alone. Look at the balance, the curve and spare capacity instead.' }
        : { label: 'Top of the range — surplus', color: '#34d399', note: 'A visible overhang. Contango is likely, storage economics start to work, and rallies tend to be sold. Bearish.' }

  // Balance → implied monthly build or draw.
  const impliedMonthly = balance * 30.4
  const bias = balance > 0.05
    ? { label: 'Stock build → bearish bias', color: '#34d399' }
    : balance < -0.05
      ? { label: 'Stock draw → bullish bias', color: '#f43f5e' }
      : { label: 'Balanced — no implied bias', color: '#94a3b8' }

  const bandPath =
    BAND.map((x, i) => `${i ? 'L' : 'M'} ${sx(i).toFixed(1)} ${sy(x.hi).toFixed(1)}`).join(' ') +
    ' ' +
    BAND.map((_, i) => `L ${sx(BAND.length - 1 - i).toFixed(1)} ${sy(BAND[BAND.length - 1 - i].lo).toFixed(1)}`).join(' ') +
    ' Z'
  const avgPath = BAND.map((x, i) => `${i ? 'L' : 'M'} ${sx(i).toFixed(1)} ${sy(x.av).toFixed(1)}`).join(' ')

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Two gauges: inventories against the range, and spare capacity</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        The commonest beginner error in oil is reading a stock number in absolutes. Nobody trades{' '}
        <em>&ldquo;2,745 million barrels&rdquo;</em> — they trade <strong className="text-slate-200">where that sits in the
        five-year seasonal range</strong>. Drag the level and watch the verdict change without the number changing much at all.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
            aria-label={`OECD commercial stocks against the five-year seasonal range; current level ${stocks} million barrels in ${MONTHS[month]}`}>
            <text x={ML - 46} y={13} fill="#64748b" fontSize={10} className="font-mono">OECD stocks, mb</text>
            {[2700, 2800, 2900, 3000].map(v => (
              <g key={v}>
                <line x1={ML} y1={sy(v)} x2={ML + PW} y2={sy(v)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                <text x={ML - 8} y={sy(v)} textAnchor="end" dominantBaseline="central" fill="#64748b" fontSize={10} className="font-mono">{v}</text>
              </g>
            ))}

            {/* the five-year range */}
            <path d={bandPath} fill="#64748b" fillOpacity={0.26} />
            {/* edges, so the band reads as a range rather than a smudge */}
            <path d={BAND.map((x, i) => `${i ? 'L' : 'M'} ${sx(i).toFixed(1)} ${sy(x.hi).toFixed(1)}`).join(' ')}
              fill="none" stroke="#94a3b8" strokeWidth={1} strokeOpacity={0.55} />
            <path d={BAND.map((x, i) => `${i ? 'L' : 'M'} ${sx(i).toFixed(1)} ${sy(x.lo).toFixed(1)}`).join(' ')}
              fill="none" stroke="#94a3b8" strokeWidth={1} strokeOpacity={0.55} />
            <path d={avgPath} fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 4" />
            <text x={ML + PW - 4} y={sy(BAND[11].av) - 7} textAnchor="end" fill="#94a3b8" fontSize={9.5} className="font-mono">5-yr average</text>
            <text x={ML + 6} y={sy(BAND[0].hi) - 5} fill="#64748b" fontSize={9.5} className="font-mono">5-yr range</text>

            <line x1={ML} y1={MT + PH} x2={ML + PW} y2={MT + PH} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
            {MONTHS.map((m, i) => (
              <text key={m} x={sx(i)} y={MT + PH + 16} textAnchor="middle" fill={i === month ? '#67e8f9' : '#64748b'} fontSize={9.5} className="font-mono">{m}</text>
            ))}

            {/* the current reading */}
            <line x1={sx(month)} y1={MT} x2={sx(month)} y2={MT + PH} stroke="#22d3ee" strokeWidth={1.5} opacity={0.8} />
            <circle cx={sx(month)} cy={sy(stocks)} r={6} fill="#0b1220" stroke={read.color} strokeWidth={3} />
            <text x={sx(month) + (month > 8 ? -10 : 10)} y={sy(stocks) - 10} textAnchor={month > 8 ? 'end' : 'start'}
              fill={read.color} fontSize={11} fontWeight="bold" className="font-mono">
              {Math.round(stocks).toLocaleString('en-US')}
            </text>
          </svg>

          <div className="mt-2 space-y-2.5 border-t border-white/10 pt-3">
            <div>
              <div className="mb-1 flex justify-between font-mono text-xs">
                <span className="text-slate-400">Month</span>
                <span className="font-bold text-white">{MONTHS[month]}</span>
              </div>
              <input type="range" min={0} max={11} step={1} value={month}
                onChange={e => setMonth(parseInt(e.target.value, 10))}
                aria-label="Month" className="h-1.5 w-full cursor-pointer accent-brand-blue" />
            </div>
            <div>
              <div className="mb-1 flex justify-between font-mono text-xs">
                <span className="text-cyan-300">Current stocks (mb)</span>
                <span className="font-bold tabular-nums text-white">{Math.round(stocks).toLocaleString('en-US')}</span>
              </div>
              <input type="range" min={2620} max={3080} step={5} value={stocks}
                onChange={e => setStocks(parseFloat(e.target.value))}
                aria-label="Current stocks in million barrels" className="h-2 w-full cursor-pointer accent-brand-cyan" />
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-xl border p-3.5" style={{ borderColor: read.color + '66', backgroundColor: read.color + '12' }}>
            <div className="font-mono text-sm font-bold" style={{ color: read.color }}>{read.label}</div>
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] tabular-nums text-slate-400">
              <span>{posPct < 0 ? 'below' : posPct > 100 ? 'above' : `${posPct.toFixed(0)}% of the way up`} the range</span>
              <span>{vsAvg >= 0 ? '+' : '−'}{Math.abs(Math.round(vsAvg))} mb vs the 5-yr average</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{read.note}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="mb-1.5 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">Days of forward cover</div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold tabular-nums text-cyan-300">{days.toFixed(1)}</span>
              <span className="font-mono text-[11px] text-slate-400">days, at {demand.toFixed(1)} mb/d of OECD demand</span>
            </div>
            <input type="range" min={40} max={50} step={0.1} value={demand}
              onChange={e => setDemand(parseFloat(e.target.value))}
              aria-label="OECD demand in million barrels per day"
              className="mt-2 h-1.5 w-full cursor-pointer accent-brand-blue" />
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
              The same pile of barrels is a different cushion depending on how fast the world burns it. Days of cover is the honest
              version of the stock number — and it is why a demand recovery can tighten the market without a single barrel leaving
              storage.
            </p>
          </div>

          <div className="rounded-xl border p-3" style={{ borderColor: bias.color + '55', backgroundColor: bias.color + '0d' }}>
            <div className="mb-1 flex justify-between font-mono text-xs">
              <span className="text-slate-400">Forecast supply − demand (mb/d)</span>
              <span className="font-bold tabular-nums text-white">{balance >= 0 ? '+' : '−'}{Math.abs(balance).toFixed(1)}</span>
            </div>
            <input type="range" min={-3} max={3} step={0.1} value={balance}
              onChange={e => setBalance(parseFloat(e.target.value))}
              aria-label="Forecast supply minus demand in million barrels per day"
              className="h-2 w-full cursor-pointer accent-brand-cyan" />
            <div className="mt-2 font-mono text-sm font-bold" style={{ color: bias.color }}>{bias.label}</div>
            <p className="mt-1 font-mono text-[11px] leading-relaxed text-slate-400">
              {balance >= 0 ? '+' : '−'}{Math.abs(balance).toFixed(1)} mb/d × 30.4 days ={' '}
              <strong className="text-slate-200">{impliedMonthly >= 0 ? '+' : '−'}{Math.abs(impliedMonthly).toFixed(0)} mb</strong> a
              month onto {impliedMonthly >= 0 ? 'the pile' : 'the draw'}. That is the whole forecast: the balance tells you the
              direction, the range tells you whether it matters yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
