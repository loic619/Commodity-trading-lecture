'use client'

import { useState } from 'react'

// Incoterms as the two lines they actually are: where COST stops being the
// seller's, and where RISK stops being the seller's. For the C-terms those are
// different points, and that gap is the only thing students need to leave with.
//
// Positions are percentages along the chain, so the markers land between the
// stage labels rather than on top of them.

type Stage = { at: number; l1: string; l2?: string }

const STAGES: Stage[] = [
  { at: 0, l1: 'Seller’s', l2: 'premises' },
  { at: 18, l1: 'Carrier', l2: 'handover' },
  { at: 36, l1: 'On board', l2: 'vessel' },
  { at: 54, l1: 'Sea', l2: 'voyage' },
  { at: 72, l1: 'Destination', l2: 'port' },
  { at: 86, l1: 'Import', l2: 'clearance' },
  { at: 100, l1: 'Buyer’s', l2: 'premises' },
]

type Who = 'seller' | 'buyer'
type Term = {
  key: string
  name: string
  full: string
  mode: 'sea' | 'any'
  riskAt: number
  costTo: number
  duties: { label: string; who: Who; note?: string }[]
  the: string          // the one sentence
  trap: string         // what students get wrong
}

const TERMS: Term[] = [
  {
    key: 'fca', name: 'FCA', full: 'Free Carrier', mode: 'any', riskAt: 18, costTo: 18,
    duties: [
      { label: 'Export clearance', who: 'seller' },
      { label: 'Main carriage (freight)', who: 'buyer' },
      { label: 'Insurance', who: 'buyer', note: 'not required of either party' },
      { label: 'Import clearance & duty', who: 'buyer' },
    ],
    the: 'Risk and cost both end when the goods are handed to the buyer’s carrier — at the terminal, or loaded on the truck at the seller’s premises.',
    trap: 'This is the term ICC actually recommends for containers, and almost nobody in coffee uses it. Under FOB the seller carries risk until the box is on board — but they lost physical control of it days earlier, at the container yard.',
  },
  {
    key: 'fob', name: 'FOB', full: 'Free On Board', mode: 'sea', riskAt: 36, costTo: 36,
    duties: [
      { label: 'Export clearance', who: 'seller' },
      { label: 'Main carriage (freight)', who: 'buyer' },
      { label: 'Insurance', who: 'buyer', note: 'not required of either party' },
      { label: 'Import clearance & duty', who: 'buyer' },
    ],
    the: 'Risk and cost both transfer once the goods are on board the vessel at the port of shipment. The buyer books and pays the freight.',
    trap: 'The old “ship’s rail” test was retired in Incoterms 2010 — the criterion since then is ON BOARD. And FOB is formally a maritime bulk term: for containers ICC says use FCA, though coffee practice stubbornly keeps saying FOB.',
  },
  {
    key: 'cfr', name: 'CFR', full: 'Cost and Freight', mode: 'sea', riskAt: 36, costTo: 72,
    duties: [
      { label: 'Export clearance', who: 'seller' },
      { label: 'Main carriage (freight)', who: 'seller', note: 'to the destination port' },
      { label: 'Insurance', who: 'buyer', note: 'CFR requires none — this is the gap' },
      { label: 'Import clearance & duty', who: 'buyer' },
    ],
    the: 'The seller pays freight all the way to the destination port, but risk still transfers on board at origin.',
    trap: 'Cost and risk part ways here, and no insurance is required of anyone. A cargo lost mid-ocean is the BUYER’s loss, on a voyage the SELLER booked — and possibly with no policy behind it.',
  },
  {
    key: 'cif', name: 'CIF', full: 'Cost, Insurance and Freight', mode: 'sea', riskAt: 36, costTo: 72,
    duties: [
      { label: 'Export clearance', who: 'seller' },
      { label: 'Main carriage (freight)', who: 'seller', note: 'to the destination port' },
      { label: 'Insurance', who: 'seller', note: 'minimum cover only (Clause C)' },
      { label: 'Import clearance & duty', who: 'buyer' },
    ],
    the: 'CFR plus insurance: the seller pays freight AND insures the voyage — yet risk still transfers on board at origin.',
    trap: 'Two traps. Risk transfers at origin even though the seller pays to destination — that split is the whole point of CIF. And CIF obliges only MINIMUM cover (Institute Cargo Clauses C); if you want all-risks you must say so in the contract.',
  },
  {
    key: 'cip', name: 'CIP', full: 'Carriage and Insurance Paid To', mode: 'any', riskAt: 18, costTo: 100,
    duties: [
      { label: 'Export clearance', who: 'seller' },
      { label: 'Carriage to named place', who: 'seller' },
      { label: 'Insurance', who: 'seller', note: 'all-risks (Clause A) since Incoterms 2020' },
      { label: 'Import clearance & duty', who: 'buyer' },
    ],
    the: 'The any-mode twin of CIF: seller pays carriage and insurance to the named destination, risk transfers at the first carrier.',
    trap: 'The insurance level differs from CIF and this is examinable: since Incoterms 2020 CIP requires ALL-RISKS cover, CIF only minimum cover. Same family, different policy.',
  },
  {
    key: 'dap', name: 'DAP', full: 'Delivered at Place', mode: 'any', riskAt: 100, costTo: 100,
    duties: [
      { label: 'Export clearance', who: 'seller' },
      { label: 'Carriage to named place', who: 'seller' },
      { label: 'Insurance', who: 'seller', note: 'not required, but the seller carries the risk' },
      { label: 'Import clearance & duty', who: 'buyer', note: 'this is what “duty unpaid” means' },
    ],
    the: 'The seller delivers to a named place in the buyer’s country, ready for unloading. Risk runs with the goods the whole way.',
    trap: '“Delivered” does not mean “cleared”. Import clearance and duty stay with the buyer — that is DAP versus DDP, and getting it wrong strands a cargo at customs.',
  },
]

// SVG geometry
const VB_W = 760
const VB_H = 250
const X0 = 46
const X1 = 714
const Y_CHAIN = 92
const Y_COST = 136
const Y_RISK = 178

const px = (at: number) => X0 + (at / 100) * (X1 - X0)

const COST = '#22d3ee'
const RISK = '#f59e0b'

export default function IncotermsLadder() {
  const [sel, setSel] = useState('cif')
  const term = TERMS.find(t => t.key === sel)!
  const split = term.costTo !== term.riskAt
  // Labels sit to the right of their marker, unless that would push them off
  // the viewBox — at DAP both markers are at the end of the chain.
  const LABEL_W = 132
  const flipCost = px(term.costTo) + LABEL_W > VB_W - 8
  const flipRisk = px(term.riskAt) + LABEL_W > VB_W - 8
  const captionX = Math.min(Math.max(px(term.riskAt), 170), VB_W - 170)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Incoterms — where cost stops, and where risk stops</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        Every Incoterm answers two separate questions, and students collapse them into one. Pick a term and watch the two bars: for the
        C-terms they end in <strong className="text-slate-200">different places</strong>.
      </p>

      <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Incoterm">
        {TERMS.map(t => (
          <button
            key={t.key} type="button" onClick={() => setSel(t.key)}
            aria-pressed={sel === t.key}
            className={`rounded-full border px-3 py-1.5 font-mono text-xs font-bold transition-all ${
              sel === t.key
                ? 'border-cyan-400/60 bg-cyan-400/15 text-cyan-100'
                : 'border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.name}
            <span className="ml-1.5 text-[10px] font-normal opacity-60">{t.mode === 'sea' ? 'sea' : 'any mode'}</span>
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full" role="img"
        aria-label={`${term.name}: seller bears cost to ${term.costTo} percent along the chain and risk to ${term.riskAt} percent`}>
        {/* the chain */}
        <line x1={X0} y1={Y_CHAIN} x2={X1} y2={Y_CHAIN} stroke="rgba(255,255,255,0.18)" strokeWidth={1.5} />
        {STAGES.map(s => (
          <g key={s.at}>
            <circle cx={px(s.at)} cy={Y_CHAIN} r={3.5} fill="#475569" />
            <line x1={px(s.at)} y1={Y_CHAIN} x2={px(s.at)} y2={Y_RISK + 16} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={px(s.at)} y={Y_CHAIN - 26} textAnchor="middle" fill="#94a3b8" fontSize={11} className="font-mono">{s.l1}</text>
            {s.l2 && <text x={px(s.at)} y={Y_CHAIN - 13} textAnchor="middle" fill="#94a3b8" fontSize={11} className="font-mono">{s.l2}</text>}
          </g>
        ))}

        {/* the gap between the two transfer points — the whole lesson */}
        {split && (
          <rect x={px(Math.min(term.riskAt, term.costTo))} y={Y_COST - 14} width={px(Math.max(term.riskAt, term.costTo)) - px(Math.min(term.riskAt, term.costTo))}
            height={Y_RISK - Y_COST + 28} fill={RISK} fillOpacity={0.08} />
        )}

        {/* cost bar */}
        <text x={X0 - 8} y={Y_COST} textAnchor="end" dominantBaseline="central" fill={COST} fontSize={11} className="font-mono">COST</text>
        <rect x={X0} y={Y_COST - 8} width={X1 - X0} height={16} rx={3} fill="rgba(255,255,255,0.04)" />
        <rect x={X0} y={Y_COST - 8} width={px(term.costTo) - X0} height={16} rx={3} fill={COST} fillOpacity={0.55} />
        <text
          x={px(term.costTo) + (flipCost ? -10 : 10)} y={Y_COST}
          textAnchor={flipCost ? 'end' : 'start'} dominantBaseline="central"
          fill={COST} fontSize={11} className="font-mono"
        >
          seller pays to here
        </text>

        {/* risk bar */}
        <text x={X0 - 8} y={Y_RISK} textAnchor="end" dominantBaseline="central" fill={RISK} fontSize={11} className="font-mono">RISK</text>
        <rect x={X0} y={Y_RISK - 8} width={X1 - X0} height={16} rx={3} fill="rgba(255,255,255,0.04)" />
        <rect x={X0} y={Y_RISK - 8} width={px(term.riskAt) - X0} height={16} rx={3} fill={RISK} fillOpacity={0.55} />
        <text
          x={px(term.riskAt) + (flipRisk ? -10 : 10)} y={Y_RISK}
          textAnchor={flipRisk ? 'end' : 'start'} dominantBaseline="central"
          fill={RISK} fontSize={11} className="font-mono"
        >
          risk transfers here
        </text>

        {/* transfer markers on the chain itself */}
        <circle cx={px(term.costTo)} cy={Y_CHAIN} r={6} fill="#0b1220" stroke={COST} strokeWidth={2.5} />
        <circle cx={px(term.riskAt)} cy={Y_CHAIN} r={6} fill="#0b1220" stroke={RISK} strokeWidth={2.5} />

        {split && (
          <text x={(px(term.riskAt) + px(term.costTo)) / 2} y={Y_RISK + 34} textAnchor="middle" fill="#fbbf24" fontSize={12} fontWeight="bold" className="font-mono">
            cost and risk part ways — the seller pays for a voyage the buyer is carrying
          </text>
        )}
        {!split && (
          <text x={captionX} y={Y_RISK + 34} textAnchor="middle" fill="#64748b" fontSize={12} className="font-mono">
            one transfer point: cost and risk move together
          </text>
        )}
      </svg>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <div className="font-mono text-sm font-bold text-slate-100">
            {term.name} — {term.full}
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{term.the}</p>
          <div className="mt-3 space-y-1.5">
            {term.duties.map(d => (
              <div key={d.label} className="flex items-baseline justify-between gap-3 border-b border-white/[0.05] pb-1.5 last:border-0">
                <span className="text-xs text-slate-300">
                  {d.label}
                  {d.note && <span className="block font-mono text-[10px] text-slate-500">{d.note}</span>}
                </span>
                <span className={`shrink-0 rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                  d.who === 'seller' ? 'bg-cyan-400/15 text-cyan-300' : 'bg-violet-400/15 text-violet-300'
                }`}>
                  {d.who}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/40 bg-amber-500/[0.08] p-3.5">
          <div className="font-mono text-sm font-bold text-amber-300">What people get wrong</div>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{term.trap}</p>
          {term.mode === 'sea' && (
            <p className="mt-3 rounded-lg border border-white/10 bg-black/20 p-2.5 font-mono text-[11px] leading-relaxed text-slate-400">
              <strong className="text-slate-200">Maritime bulk term.</strong> For containerised cargo ICC recommends{' '}
              <button type="button" onClick={() => setSel(term.key === 'fob' ? 'fca' : 'cip')} className="font-bold text-cyan-300 underline underline-offset-2">
                {term.key === 'fob' ? 'FCA' : 'CIP'}
              </button>{' '}
              instead — risk transfers when the box is handed to the carrier, which is when the seller actually loses control of it.
            </p>
          )}
        </div>
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-slate-400">
        Commercially this is a pricing question, not a legal one: the Incoterm decides which costs sit inside your differential and
        which exposures stay on your book. An FOB and a CIF quote for the same coffee are not comparable until you have moved the
        freight, the insurance and the risk to the same point on this chain.
      </p>
    </div>
  )
}
