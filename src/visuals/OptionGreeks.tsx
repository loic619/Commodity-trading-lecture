'use client'

import { useState } from 'react'

// The Greeks, as a desk reference: first / second / third order plus the
// cross Greeks, each with its symbol, partial derivative, what it measures,
// its definition and its primary driver — and a plain-English desk note
// saying when a commodity trader actually looks at it.
type Order = 'first' | 'second' | 'third' | 'cross'

type Greek = {
  name: string
  sub: string
  symbol: string
  formula: string   // rendered as ∂-notation
  measures: string
  definition: string
  driver: 'Spot' | 'Volatility' | 'Time' | 'Interest rates' | 'Strike'
  desk: string
}

const GREEKS: Record<Order, Greek[]> = {
  first: [
    {
      name: 'DELTA', sub: 'Directional exposure', symbol: 'Δ', formula: '∂V / ∂S',
      measures: 'Futures-equivalent exposure', definition: 'Change in option price due to a change in the underlying price.', driver: 'Spot',
      desk: 'The one every desk hedges first. An ATM option ≈ 0.5Δ, so 100 ATM calls hedge like 50 futures — and delta doubles as a rough probability of expiring in the money.',
    },
    {
      name: 'GAMMA', sub: 'Convexity', symbol: 'Γ', formula: '∂²V / ∂S²',
      measures: 'Rate of change of delta', definition: 'Change in delta due to a change in the underlying price.', driver: 'Spot',
      desk: 'Peaks at-the-money near expiry. Long gamma = your re-hedges happen at better prices as the market moves; short gamma = you chase it, buying highs and selling lows.',
    },
    {
      name: 'THETA', sub: 'Time decay', symbol: 'Θ', formula: '∂V / ∂t',
      measures: 'Time decay', definition: 'Change in option price due to the passage of time.', driver: 'Time',
      desk: 'The daily rent a long-option position pays. Gamma’s mirror image: long gamma ⇔ paying theta. A producer’s put program is a theta bill with a floor attached.',
    },
    {
      name: 'VEGA', sub: 'Volatility exposure', symbol: 'ν', formula: '∂V / ∂σ',
      measures: 'Volatility exposure', definition: 'Change in option price due to a change in volatility.', driver: 'Volatility',
      desk: '± $ per vol point. Straddle buyers are long vega; a zero-cost collar is roughly vega-flat — which is exactly why collars survive a vol crush that would gut a naked long put.',
    },
    {
      name: 'RHO', sub: 'Interest-rate exposure', symbol: 'ρ', formula: '∂V / ∂r',
      measures: 'Interest-rate exposure', definition: 'Change in option price due to a change in risk-free interest rates.', driver: 'Interest rates',
      desk: 'Small on short-dated commodity options (Black-76 only discounts the payoff), but it wakes up on multi-year structures — and it woke the whole market in 2022–23.',
    },
  ],
  second: [
    {
      name: 'VANNA', sub: 'Delta sensitivity to volatility', symbol: 'Vanna', formula: '∂²V / ∂S∂σ',
      measures: 'Change in delta due to volatility', definition: 'Change in delta due to a change in volatility.', driver: 'Volatility',
      desk: 'Why your delta hedge drifts on a day the price barely moved: vol moved instead. Central to skew trading — in coffee, where OTM calls carry the fat vol, vanna is never zero.',
    },
    {
      name: 'VOLGA', sub: 'Vega sensitivity to volatility (vomma)', symbol: 'Volga', formula: '∂²V / ∂σ²',
      measures: 'Change in vega due to volatility', definition: 'Change in vega due to a change in volatility.', driver: 'Volatility',
      desk: 'The convexity of your vol exposure. Long volga = you gain MORE as vol explodes — the tail-risk buyer’s friend, and what makes far-OTM frost calls behave the way they do.',
    },
    {
      name: 'CHARM', sub: 'Delta sensitivity to time', symbol: 'Charm', formula: '∂²V / ∂S∂t',
      measures: 'Change in delta due to time', definition: 'Change in delta due to the passage of time.', driver: 'Time',
      desk: 'Delta bleed. Hold a hedge over a long weekend and the delta you set on Friday is not the delta you own on Monday — even with an unchanged screen. Expiry weeks are charm weeks.',
    },
    {
      name: 'VETA', sub: 'Theta sensitivity to volatility', symbol: 'Veta', formula: '∂²V / ∂σ∂t',
      measures: 'Change in theta due to volatility', definition: 'Change in theta due to a change in volatility.', driver: 'Volatility',
      desk: 'How fast the rent bill changes when vol moves. High-vol regimes make time decay much more expensive — the hidden cost of rolling protection through a crisis.',
    },
    {
      name: 'ZOMMA', sub: 'Gamma sensitivity to volatility', symbol: 'Zomma', formula: '∂³V / ∂σ∂S²',
      measures: 'Change in gamma due to volatility', definition: 'Change in gamma due to a change in volatility.', driver: 'Volatility',
      desk: 'Third-derivative housekeeping for a book that is already gamma-managed: tells you how stable your gamma profile is when the vol surface shifts under it.',
    },
  ],
  third: [
    {
      name: 'SPEED', sub: 'Gamma sensitivity to spot', symbol: 'Speed', formula: '∂³V / ∂S³',
      measures: 'Rate of change of gamma', definition: 'Change in gamma due to a change in the underlying price.', driver: 'Spot',
      desk: 'Matters when the underlying gaps rather than drifts — precisely the commodity case (limit moves, frost headlines). A big-gap market is where linear gamma assumptions fail.',
    },
    {
      name: 'ULTIMA', sub: 'Vega sensitivity to volatility (3rd order)', symbol: 'Ultima', formula: '∂³V / ∂σ³',
      measures: 'Rate of change of volga', definition: 'Change in volga due to a change in volatility.', driver: 'Volatility',
      desk: 'Exotic-desk territory. Know the name, know it exists, and know that if it is driving your P&L you are running a vol book, not a hedging program.',
    },
  ],
  cross: [
    {
      name: 'COLOR', sub: 'Gamma decay', symbol: 'Color', formula: '∂³V / ∂S²∂t',
      measures: 'Change in gamma due to time', definition: 'How gamma itself decays as expiry approaches.', driver: 'Time',
      desk: 'The reason an expiry-week book feels alive: gamma concentrates violently into the last days around the strike.',
    },
    {
      name: 'DUAL DELTA', sub: 'Sensitivity to strike', symbol: 'Dual Δ', formula: '∂V / ∂K',
      measures: 'Change in option price due to strike', definition: 'Sensitivity of the option value to the strike price.', driver: 'Strike',
      desk: 'How the premium ladder steepens across strikes — the number behind “what does moving my floor 10¢ lower actually save me?”',
    },
    {
      name: 'STRIKE GAMMA', sub: 'Strike convexity', symbol: 'Strike Γ', formula: '∂²V / ∂K²',
      measures: 'Change in option price due to strike convexity', definition: 'Second-order sensitivity to the strike — the curvature of the premium ladder.', driver: 'Strike',
      desk: 'Reads the vol smile directly: a steep strike-gamma profile IS the skew you pay for tail protection.',
    },
    {
      name: 'EPSILON', sub: 'Delta sensitivity to rates', symbol: 'ε', formula: '∂²V / ∂S∂r',
      measures: 'Change in delta due to interest rates', definition: 'Change in delta due to a change in interest rates.', driver: 'Interest rates',
      desk: 'Negligible in a 3-month coffee option; real in long-dated structured hedges where financing and delta interact.',
    },
  ],
}

const ORDERS: { key: Order; label: string; blurb: string; color: string }[] = [
  { key: 'first', label: 'First order', blurb: 'Sensitivity of the option price', color: '#22d3ee' },
  { key: 'second', label: 'Second order', blurb: 'Sensitivity of the first-order Greeks', color: '#8b5cf6' },
  { key: 'third', label: 'Third order', blurb: 'Sensitivity of the second-order Greeks', color: '#34d399' },
  { key: 'cross', label: 'Cross Greeks', blurb: 'Mixed and strike sensitivities', color: '#f59e0b' },
]

const DRIVER_COLOR: Record<Greek['driver'], string> = {
  Spot: '#3b82f6',
  Volatility: '#8b5cf6',
  Time: '#f59e0b',
  'Interest rates': '#f43f5e',
  Strike: '#34d399',
}

export default function OptionGreeks() {
  const [order, setOrder] = useState<Order>('first')
  const [sel, setSel] = useState(0)
  const list = GREEKS[order]
  const g = list[Math.min(sel, list.length - 1)]
  const orderMeta = ORDERS.find(o => o.key === order)!

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-1 eyebrow text-brand-cyan">The Greeks — key risk measures that drive option prices</div>
      <p className="mb-3 text-xs leading-relaxed text-slate-400">
        Each Greek measures how the option&rsquo;s price responds to ONE market variable. Pick an order, then a Greek.
      </p>

      {/* order tabs */}
      <div className="flex flex-wrap gap-1.5">
        {ORDERS.map(o => (
          <button key={o.key} type="button" onClick={() => { setOrder(o.key); setSel(0) }}
            className={`rounded-full border px-3 py-1 font-mono text-[10px] font-bold transition-all ${
              order === o.key ? 'bg-white/[0.08]' : 'text-slate-400 hover:text-slate-200'
            }`}
            style={{ borderColor: order === o.key ? o.color : 'rgba(255,255,255,0.1)', color: order === o.key ? o.color : undefined }}>
            {o.label}
          </button>
        ))}
      </div>
      <div className="mt-1 font-mono text-[10px] text-slate-500">{orderMeta.blurb}</div>

      {/* the table */}
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              {['Greek', 'Symbol & formula', 'Measures', 'Primary driver'].map(h => (
                <th key={h} className="px-2 py-1.5 text-left font-mono text-[10px] font-bold uppercase tracking-wide text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((row, i) => {
              const active = i === Math.min(sel, list.length - 1)
              return (
                <tr key={row.name} onClick={() => setSel(i)}
                  className={`cursor-pointer border-b border-white/[0.05] transition-colors ${active ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'}`}>
                  <td className="px-2 py-2">
                    <div className="text-xs font-bold" style={{ color: active ? orderMeta.color : '#e2e8f0' }}>{row.name}</div>
                    <div className="font-mono text-[10px] text-slate-500">{row.sub}</div>
                  </td>
                  <td className="px-2 py-2 font-mono text-[11px] text-slate-300">
                    <span className="font-bold" style={{ color: orderMeta.color }}>{row.symbol}</span>
                    <span className="text-slate-500"> = </span>{row.formula}
                  </td>
                  <td className="px-2 py-2 text-[11px] text-slate-300">{row.measures}</td>
                  <td className="px-2 py-2">
                    <span className="rounded-full px-2 py-0.5 font-mono text-[10px] font-bold"
                      style={{ background: DRIVER_COLOR[row.driver] + '22', color: DRIVER_COLOR[row.driver] }}>
                      {row.driver}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* the selected Greek, explained */}
      <div className="mt-3 rounded-xl border p-3.5" style={{ borderColor: orderMeta.color + '55', backgroundColor: orderMeta.color + '0d' }}>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-mono text-sm font-bold" style={{ color: orderMeta.color }}>{g.symbol} · {g.name}</span>
          <span className="font-mono text-[11px] text-slate-400">{g.formula}</span>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-300"><span className="font-bold text-slate-200">Definition: </span>{g.definition}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-400"><span className="font-bold text-slate-300">On the desk: </span>{g.desk}</p>
      </div>

      {/* legend + notes */}
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-wide text-slate-400">Legend</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px] text-slate-400">
            {[['V', 'option price'], ['S', 'underlying price (spot/futures)'], ['t', 'time'], ['σ', 'volatility'], ['r', 'risk-free rate'], ['K', 'strike price']].map(([sym, mean]) => (
              <div key={sym}><span className="font-bold text-slate-200">{sym}</span> = {mean}</div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-wide text-slate-400">Notes</div>
          <ul className="space-y-1 text-[11px] leading-relaxed text-slate-400">
            <li>▸ Sign (positive or negative) depends on option type (call/put), position (long/short) and moneyness.</li>
            <li>▸ The Greeks are how desks hedge risk and manage dynamic option portfolios — nothing more exotic than the chain rule applied to a position you already hold.</li>
            <li>▸ A physical hedging desk lives on the first order; the second order explains why the first-order hedge keeps moving.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
