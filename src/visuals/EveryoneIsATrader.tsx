'use client'

import { useState } from 'react'

// Anyone sitting between the original producer and the final consumer is a
// trader: they buy, they hold, they sell — and while they hold, they own a
// basket of risks. Click a link in the chain to see the risks it carries;
// click a risk chip to see how it is managed.
type Link = { key: string; name: string; sub: string; icon: string; note: string; risks: string[] }

const CHAIN: Link[] = [
  {
    key: 'farmer', name: 'Producer', sub: 'farmer / co-op', icon: '🌱',
    note: 'The origin of the chain — the only party who is not "between" anyone. They carry the cost of production and the whole price move until they sell.',
    risks: ['price', 'quality', 'weather'],
  },
  {
    key: 'trader', name: 'Commodity trader', sub: 'exporter / trade house', icon: '🏢',
    note: 'The professional in-between: buys from origin, moves the goods, sells to industry. The subject of this course — and the only link that actively MANAGES its price risk on an exchange.',
    risks: ['price', 'counterparty', 'logistic', 'quality', 'financing', 'fx', 'political'],
  },
  {
    key: 'factory', name: 'Factory', sub: 'roaster / crusher / refiner', icon: '🏭',
    note: 'A trader too: it buys raw material, holds it, transforms it, and sells the output. Its purchase is a trade whether it calls itself a trader or not.',
    risks: ['price', 'counterparty', 'quality', 'financing'],
  },
  {
    key: 'retail', name: 'Supermarket', sub: 'retail chain', icon: '🛒',
    note: 'A GIANT trader: it buys enormous volumes forward, warehouses them, and resells at a posted price. It simply never uses the word.',
    risks: ['price', 'counterparty', 'logistic'],
  },
  {
    key: 'consumer', name: 'Consumer', sub: 'the cup', icon: '☕',
    note: 'The end of the chain — buys spot, at the posted price, in tiny quantity. The only party with no inventory and no counterparty risk.',
    risks: [],
  },
]

const RISKS: Record<string, { name: string; color: string; what: string; managed: string }> = {
  price: { name: 'Price (flat) risk', color: '#f43f5e',
    what: 'The value of what you own — or owe — moves with the market while you hold it.',
    managed: 'Hedged on the futures market. This is the ONE risk the exchange was invented for, and the one that separates a commodity trader from every other in-between.' },
  counterparty: { name: 'Counterparty risk', color: '#f59e0b',
    what: 'Your buyer or seller fails to perform — especially tempting for them when the price has moved far against their contract.',
    managed: 'Credit lines, letters of credit, trade credit insurance, prepayment — and, above all, contract structures that keep performance rational for both sides.' },
  logistic: { name: 'Logistic risk', color: '#3b82f6',
    what: 'Delays, vessel problems, port congestion, strikes, closed canals — the goods do not arrive when the contract says.',
    managed: 'Contract clauses, robust charter terms, buffer stock, alternative routings — and operations people who see the problem coming.' },
  quality: { name: 'Quality risk', color: '#8b5cf6',
    what: 'What is delivered does not meet the contract specification — moisture, defects, grade, contamination.',
    managed: 'Pre-shipment inspection, independent sampling and grading, quality clauses with allowances, arbitration mechanisms.' },
  financing: { name: 'Financing / liquidity risk', color: '#22d3ee',
    what: 'You pay for the cargo months before the customer pays you — and a hedge consumes margin cash daily on top.',
    managed: 'Bank trade-finance lines sized WITH the hedge, documentary credits, and a treasury that models the cash, not just the P&L.' },
  fx: { name: 'Currency risk', color: '#34d399',
    what: 'You buy in one currency and sell in another; the move between the two can erase the trading margin by itself.',
    managed: 'FX forwards and NDFs, matched-currency contracting, and hedging the FX leg at the same moment as the commodity leg.' },
  political: { name: 'Political / regulatory risk', color: '#e879f9',
    what: 'Export bans, tariffs, sanctions, FX controls, new compliance regimes (EUDR) — the rules change under an open position.',
    managed: 'Diversified origins, political-risk insurance, force-majeure drafting, and compliance screening before the trade, not after.' },
  weather: { name: 'Weather / production risk', color: '#38bdf8',
    what: 'The crop itself may not arrive: drought, frost, flood or disease between flowering and harvest — a risk on the VOLUME, not just the price.',
    managed: 'Barely hedgeable, and the reason the producer’s position is the hardest in the chain: crop insurance where it exists, spreading varieties and plots, and selling only what is reasonably certain to be harvested.' },
}

export default function EveryoneIsATrader() {
  const [linkIdx, setLinkIdx] = useState(1)
  const [riskKey, setRiskKey] = useState('price')
  const link = CHAIN[linkIdx]
  // Always show a risk the SELECTED link actually carries: switching links
  // keeps the current risk when it is in the new basket, otherwise falls back
  // to that link's first one (and never to an unknown key).
  const activeKey = link.risks.includes(riskKey) ? riskKey : link.risks[0]
  const risk = activeKey ? RISKS[activeKey] : undefined

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-1 eyebrow text-brand-cyan">Everyone in between is a trader — and what they trade is risk</div>
      <p className="mb-3 text-xs leading-relaxed text-slate-400">
        Click a link in the chain to see the risks it carries, then a risk to see how it is managed.
      </p>

      {/* the chain */}
      <div className="flex items-stretch gap-1 overflow-x-auto pb-1">
        {CHAIN.map((l, i) => (
          <div key={l.key} className="flex items-center gap-1">
            <button type="button" onClick={() => setLinkIdx(i)}
              className={`min-w-[96px] rounded-xl border p-2 text-center transition-all ${
                i === linkIdx ? 'border-brand-cyan/70 bg-brand-cyan/[0.10]' : 'border-white/10 hover:border-white/25'
              }`}>
              <div className="text-base leading-none">{l.icon}</div>
              <div className={`mt-1 font-mono text-[11px] font-bold ${i === linkIdx ? 'text-cyan-200' : 'text-slate-300'}`}>{l.name}</div>
              <div className="font-mono text-[9px] text-slate-500">{l.sub}</div>
              {i > 0 && i < CHAIN.length - 1 && (
                <div className="mt-1 rounded-full bg-white/[0.06] font-mono text-[8px] uppercase tracking-wide text-slate-400">in between</div>
              )}
            </button>
            {i < CHAIN.length - 1 && <span className="shrink-0 font-mono text-xs text-slate-600">→</span>}
          </div>
        ))}
      </div>

      {/* the selected link's risks */}
      <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <p className="text-xs leading-relaxed text-slate-300"><span className="font-bold text-white">{link.name}: </span>{link.note}</p>
        {link.risks.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {link.risks.filter(k => RISKS[k]).map(k => (
              <button key={k} type="button" onClick={() => setRiskKey(k)}
                className={`rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold transition-all ${
                  activeKey === k ? 'bg-white/[0.08]' : 'text-slate-400 hover:text-slate-200'
                }`}
                style={{ borderColor: activeKey === k ? RISKS[k].color : 'rgba(255,255,255,0.1)', color: activeKey === k ? RISKS[k].color : undefined }}>
                {RISKS[k].name}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-2 font-mono text-[11px] text-slate-500">No inventory, no counterparty, no open position — the only party in the chain carrying none of these.</p>
        )}
      </div>

      {/* the selected risk */}
      {risk && (
        <div className="mt-2 rounded-xl border p-3" style={{ borderColor: risk.color + '55', backgroundColor: risk.color + '0d' }}>
          <div className="font-mono text-xs font-bold" style={{ color: risk.color }}>{risk.name}</div>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">{risk.what}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-400"><span className="font-bold text-slate-300">Managed by: </span>{risk.managed}</p>
        </div>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        Notice what the chain says: the factory and the supermarket carry almost the same risk basket as the trade house.
        The difference is not WHAT they hold — it is that only one of them actively manages the{' '}
        <span className="text-rose-300">price</span> line on an exchange. That is the whole subject of the next section.
      </p>
    </div>
  )
}
