'use client'

import { useState } from 'react'

// Six risks, and for each one: who it bites, how it is mitigated, and a real
// case. The grid is the map; the panel is the detail. Students should leave
// able to say which desk owns each risk — because in an interview that is the
// question they get asked.

type Risk = {
  key: string
  tag: string
  label: string
  color: string
  owner: string
  definition: string
  mitigation: string[]
  realCase: string
}

const RISKS: Risk[] = [
  {
    key: 'counterparty', tag: '6a', label: 'Counterparty', color: '#f43f5e',
    owner: 'Credit & the trade finance desk',
    definition: 'Your buyer or seller fails to perform — and they fail precisely when the price has moved against them, which is exactly when you need them most.',
    mitigation: [
      'Credit lines sized per counterparty and monitored daily',
      'Letters of credit (LC) confirmed by a bank you trust',
      'Trade credit insurance on the receivable',
      'Prepayment, or cash against documents, for weak names',
      'Clearing — on the futures leg the clearing house replaces the name',
    ],
    realCase: 'Olive oil, 2023: suppliers on fixed-price forward contracts simply walked away when the market doubled. The contract was worth nothing more than the counterparty’s solvency.',
  },
  {
    key: 'logistic', tag: '6b', label: 'Logistic', color: '#f59e0b',
    owner: 'Operations',
    definition: 'Delays, vessel problems, port congestion, strikes, a closed canal. The cargo exists but it is not where the contract says it will be.',
    mitigation: [
      'Logistics clauses and realistic shipment windows in the contract',
      'Robust charter party terms — laytime, demurrage, who pays for what',
      'Buffer stock at destination, and alternative routings costed in advance',
      'Freight booked as a cost AND tracked as an exposure',
    ],
    realCase: 'Red Sea diversions, 2024: Asia–Europe voyages added roughly ten days around the Cape. Every CIF contract priced on a Suez transit lost its freight assumption overnight.',
  },
  {
    key: 'quality', tag: '6c', label: 'Quality', color: '#34d399',
    owner: 'Operations & the lab',
    definition: 'What arrives does not match the contract specification — moisture, defect count, screen size, foreign matter. You own goods you cannot deliver against your sale.',
    mitigation: [
      'Pre-shipment inspection by an independent surveyor',
      'Clear quality clauses with tolerances and price adjustments',
      'Arbitration mechanisms named in the contract (GCA, ECF)',
      'Blending capacity at destination — the quality arbitrage, used defensively',
    ],
    realCase: 'A parcel one defect-count over the Grade 2 line is not tenderable at the exchange, so the exchange floor under its differential disappears — and the discount is whatever the one buyer who wants it decides.',
  },
  {
    key: 'geographic', tag: '6d', label: 'Geographic', color: '#22d3ee',
    owner: 'Origination & senior management',
    definition: 'Country-specific risk: export bans, FX controls that trap your money, infrastructure failure, instability at origin.',
    mitigation: [
      'Diversified sourcing — never one origin for a critical volume',
      'Political risk insurance on pre-finance at origin',
      'Local entity and local banking relationships',
      'Caps on exposure per country, approved at board level',
    ],
    realCase: 'India’s 2022 wheat export ban was announced days after a record export target. Contracts signed the week before became unperformable by decree.',
  },
  {
    key: 'political', tag: '6e', label: 'Political', color: '#8b5cf6',
    owner: 'Compliance',
    definition: 'Sanctions, regulatory change, nationalisation, tariffs. Distinct from geographic risk because it can originate in YOUR jurisdiction, not the origin’s.',
    mitigation: [
      'Sanctions screening on every counterparty and vessel, every time',
      'Geopolitical monitoring built into the morning routine',
      'Contract clauses allocating the cost of a new tariff or regulation',
      'Readiness for regimes like the EUDR, which reprice compliant and non-compliant coffee differently',
    ],
    realCase: 'The EUDR splits one commodity into two markets — compliant and non-compliant — and the spread between them is a new, regulation-created differential.',
  },
  {
    key: 'price', tag: '6f', label: 'Price / differential', color: '#fbbf24',
    owner: 'The trading desk — and only this one',
    definition: 'The market moves against your unhedged tonnage. Hedge the flat price and what remains is the differential: smaller, but it is the one risk a physical desk is actually paid to carry.',
    mitigation: [
      'Futures hedging against the flat-price component',
      'Options where you want the downside covered but not the upside capped',
      'Position limits per bucket, and a coverage ratio mandated by management',
      'A liquidity line sized for the margin calls the hedge will generate',
    ],
    realCase: 'The hedged Robusta trade: a $150/t flat-price collapse never touched the book, but a $30/t move in the differential was the entire P&L.',
  },
]

export default function RiskTypes() {
  const [sel, setSel] = useState(RISKS[0].key)
  const risk = RISKS.find(r => r.key === sel)!

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Six risks — and which desk owns each one</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Only the last of these is a market risk. The other five are run by people who are not traders — which is why the front office
        is the smallest part of the building. Click a risk.
      </p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {RISKS.map(r => (
          <button
            key={r.key} type="button" onClick={() => setSel(r.key)}
            aria-pressed={sel === r.key}
            className={`rounded-lg border px-3 py-2.5 text-left transition-all ${
              sel === r.key ? 'bg-white/[0.07]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
            }`}
            style={sel === r.key ? { borderColor: r.color + '88' } : undefined}
          >
            <div className="font-mono text-[10px] tracking-wide" style={{ color: r.color }}>{r.tag}</div>
            <div className="text-sm font-medium text-slate-200">{r.label}</div>
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-xl border p-4" style={{ borderColor: risk.color + '55', backgroundColor: risk.color + '0d' }}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-mono text-sm font-bold" style={{ color: risk.color }}>
            {risk.tag} · {risk.label} risk
          </span>
          <span className="font-mono text-[11px] text-slate-400">owned by: <strong className="text-slate-200">{risk.owner}</strong></span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">{risk.definition}</p>

        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <div className="mb-1.5 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">How it is mitigated</div>
            <ul className="space-y-1.5">
              {risk.mitigation.map((m, i) => (
                <li key={i} className="flex items-baseline gap-2 text-xs leading-relaxed text-slate-300">
                  <span className="shrink-0 font-mono" style={{ color: risk.color }}>▸</span>{m}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-3">
            <div className="mb-1.5 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">Where it actually bit</div>
            <p className="text-xs leading-relaxed text-slate-300">{risk.realCase}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
