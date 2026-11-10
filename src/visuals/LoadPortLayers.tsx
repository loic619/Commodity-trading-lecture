'use client'

import { useState } from 'react'

// The four sections of "Loading Operations I" are four layers of the same
// port call: the physical constraints, the paper that can stop a ship as
// surely as a draft limit, the documents the loading generates, and the log
// that turns all of it into laytime evidence.
//
// Shared file, four exports — each belongs to its own section.

// ── 1. The physical layer ─────────────────────────────────────────────────

type Group = { key: string; name: string; color: string; items: { k: string; v: string }[]; lesson: string }

const PHYSICAL: Group[] = [
  {
    key: 'facilities', name: 'Port facilities', color: '#22d3ee',
    items: [
      { k: 'Berth type', v: 'Sea berth or river berth; SBM/CBM buoy moorings against conventional jetties. Each has its own mooring crew, weather limits and approach.' },
      { k: 'Berths and their cargo systems', v: 'How many, and what each one can actually handle — arms or hoses, their size, their pressure rating.' },
      { k: 'Shore tankage and pumping', v: 'The shore’s capacity sets YOUR loading rate, not the ship’s. A ship that can load 8,000 m³/hr into a terminal that can deliver 4,000 loads at 4,000.' },
    ],
    lesson: 'The rate in the charter party is an allowance. The rate at the berth is a physical fact, and it is usually the shore’s.',
  },
  {
    key: 'mooring', name: 'Mooring arrangements', color: '#34d399',
    items: [
      { k: 'Terminal plan vs ship’s equipment', v: 'The winches and ropes from Module 1, now against a specific jetty’s bollard layout and the terminal’s required pattern.' },
      { k: 'Tugs', v: 'How many required, and — separately — how many are actually available on your dates.' },
      { k: 'SBM operations', v: 'Dedicated crews, and daylight windows at many terminals. A night arrival at an SBM can simply wait for morning.' },
    ],
    lesson: 'Tug shortage and a missed tide window are two of the commonest berthing delays, and both are foreseeable from the port file.',
  },
  {
    key: 'restrictions', name: 'Berth restrictions', color: '#a78bfa',
    items: [
      { k: 'Maximum dimensions', v: 'LOA, beam, draft, displacement — and air draft under the loading gantries, which catches ships that pass every other test.' },
      { k: 'WLTHC limits', v: 'What the arms can take at the manifold. A mismatch here stops the operation at the rail.' },
      { k: 'Operating windows', v: 'Daylight-only berthing, tide windows, and weather cut-offs on swell and wind speed.' },
    ],
    lesson: 'Every one of these is a number you can obtain before fixing. Discovering one after is the expensive version.',
  },
  {
    key: 'approaches', name: 'Approaches', color: '#f59e0b',
    items: [
      { k: 'Channel depth and tide', v: 'What she can transit, and when. The deciding number is often the tide, not the channel.' },
      { k: 'Bars at river ports', v: 'A sill she must cross loaded, which can cap the lift well below the berth’s own draft limit.' },
      { k: 'Anchorage congestion', v: 'Where she waits, how long, and whether that waiting time counts.' },
    ],
    lesson: 'The approach, not the berth, is frequently the binding constraint — and it is the one least often checked.',
  },
]

export function PortPhysicalLayer() {
  const [sel, setSel] = useState('facilities')
  const g = PHYSICAL.find(x => x.key === sel)!

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">By the time she tenders NOR there should be no physical surprises left</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Every load port is a bundle of physical constraints, and the operator&apos;s tool is the{' '}
        <strong className="text-slate-200">port information file</strong> — terminal regulations, port guides, the agent&apos;s
        pre-arrival questionnaire. Four groups to have mapped before arrival.
      </p>

      <div className="mb-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {PHYSICAL.map(x => (
          <button key={x.key} type="button" onClick={() => setSel(x.key)} aria-pressed={sel === x.key}
            className={`rounded-lg border px-2.5 py-2 text-left transition-all ${
              sel === x.key ? 'bg-white/[0.08]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
            }`}
            style={sel === x.key ? { borderColor: x.color + '99' } : undefined}>
            <span className="text-xs font-medium" style={{ color: sel === x.key ? x.color : '#cbd5e1' }}>{x.name}</span>
          </button>
        ))}
      </div>

      <div className="rounded-xl border p-3.5" style={{ borderColor: g.color + '55', backgroundColor: g.color + '0d' }}>
        <div className="space-y-2">
          {g.items.map(x => (
            <div key={x.k} className="border-b border-white/[0.06] pb-2 last:border-0">
              <span className="text-xs font-bold text-slate-100">{x.k}</span>
              <p className="text-xs leading-relaxed text-slate-300">{x.v}</p>
            </div>
          ))}
        </div>
        <p className="mt-2.5 border-t border-white/10 pt-2 text-xs leading-relaxed" style={{ color: g.color }}>{g.lesson}</p>
      </div>
    </div>
  )
}

// ── 2. The administrative layer ───────────────────────────────────────────

type Admin = { key: string; name: string; color: string; items: string[]; stops: string }

const ADMIN: Admin[] = [
  {
    key: 'clearing', name: 'Clearing', color: '#22d3ee',
    items: ['Inward clearance and customs entry', 'Immigration', 'Free pratique — health clearance, historically the quarantine flag'],
    stops: 'Free pratique is usually granted by radio today, but NOR validity can hang on it. A NOR tendered before pratique can be challenged months later, and the challenge is about hours of laytime.',
  },
  {
    key: 'financial', name: 'Financial', color: '#34d399',
    items: ['Port dues and agency fees', 'Advance funding — agents work on prepaid proforma disbursement accounts', 'Letter-of-credit conditions touching shipment dates and documents'],
    stops: 'An unfunded agent is a ship that does not sail. This is the most avoidable delay in the whole port call and it still happens, because the funding sits with a different department from the operation.',
  },
  {
    key: 'legislative', name: 'Legislative', color: '#f43f5e',
    items: ['Flag and sanctions screening of ship, cargo and counterparties', 'Local content and cabotage rules', 'ISPS security levels and declarations'],
    stops: 'A compliance failure discovered at the berth is a catastrophe, not a delay. The screening belongs before fixing, not before loading.',
  },
]

const WHO_PAYS = [
  { k: 'Ship’s port costs', who: 'Owner', why: 'On a voyage charter they are inside the freight — the owner priced them when they quoted the WS level.' },
  { k: 'Cargo-side costs', who: 'Charterer', why: 'The costs that exist because of the cargo rather than the ship.' },
  { k: 'Taxes and dues "on cargo" vs "on vessel"', who: 'Contested', why: 'This is the middle ground, and the rider clause wording decides it. A dues line that could be read either way will be read both ways, by two parties, three months apart.' },
]

export function PortAdminLayer() {
  const [sel, setSel] = useState('financial')
  const [pay, setPay] = useState(2)
  const a = ADMIN.find(x => x.key === sel)!

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Paper stops a ship as surely as a draft restriction</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        The administrative layer runs in parallel with the physical one, and it is the one that catches people — because none of
        it is visible from the bridge.
      </p>

      <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {ADMIN.map(x => (
          <button key={x.key} type="button" onClick={() => setSel(x.key)} aria-pressed={sel === x.key}
            className={`rounded-lg border px-3 py-2.5 text-left transition-all ${
              sel === x.key ? 'bg-white/[0.08]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
            }`}
            style={sel === x.key ? { borderColor: x.color + '99' } : undefined}>
            <span className="text-xs font-medium" style={{ color: sel === x.key ? x.color : '#cbd5e1' }}>{x.name}</span>
          </button>
        ))}
      </div>

      <div className="rounded-xl border p-3.5" style={{ borderColor: a.color + '55', backgroundColor: a.color + '0d' }}>
        <ul className="space-y-1">
          {a.items.map(x => (
            <li key={x} className="flex items-baseline gap-2 text-xs leading-relaxed text-slate-300">
              <span className="shrink-0 font-mono" style={{ color: a.color }}>▸</span>{x}
            </li>
          ))}
        </ul>
        <p className="mt-2.5 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-200">
          <strong>Where it bites:</strong> {a.stops}
        </p>
      </div>

      <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
        <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">And who pays for it</div>
        <div className="space-y-1">
          {WHO_PAYS.map((x, i) => (
            <button key={x.k} type="button" onClick={() => setPay(i)} aria-pressed={pay === i}
              className={`flex w-full items-center justify-between gap-3 rounded px-2.5 py-2 text-left transition-all ${
                pay === i ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'
              }`}>
              <span className="text-xs text-slate-200">{x.k}</span>
              <span className={`shrink-0 rounded px-2 py-0.5 font-mono text-[10px] uppercase ${
                x.who === 'Owner' ? 'bg-slate-500/25 text-slate-200'
                  : x.who === 'Charterer' ? 'bg-amber-400/20 text-amber-200' : 'bg-rose-400/20 text-rose-200'
              }`}>
                {x.who}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-2 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-300">{WHO_PAYS[pay].why}</p>
      </div>
    </div>
  )
}
