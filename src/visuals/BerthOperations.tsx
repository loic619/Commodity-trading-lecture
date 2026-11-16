'use client'

import { useState } from 'react'

// "Loading Operations II" is four sections at the berth: how she gets
// alongside (or doesn't), the load sequence itself, how the cargo gets
// measured, and the document that is the cargo. Four exports, one file.

// ── 1. Berthing, STS and double-banking ───────────────────────────────────

type Config = {
  key: string
  name: string
  color: string
  what: string
  weather: string
  clauses: string[]
  nor: string
}

const CONFIGS: Config[] = [
  {
    key: 'berth', name: 'Conventional berth', color: '#22d3ee',
    what: 'Pilot boards, tugs made fast, the terminal’s mooring plan executed, gangway and access control set, then the SSSCL signed before any cargo moves.',
    weather: 'The terminal’s own limits on wind and swell, published and usually not negotiable.',
    clauses: ['Time from "pilot on board" to "all fast" is logged', 'Berthing delays — tug shortage, missed tide window — are a classic laytime battleground', 'Shifting between berths may or may not be the charterer’s time: check the clause'],
    nor: 'The standard case. NOR tendered at the usual place per the charter party, and the arguments are about validity rather than location.',
  },
  {
    key: 'sts', name: 'STS at anchorage', color: '#f59e0b',
    what: 'Cargo moves between two ships instead of over a berth — a VLCC discharging into Aframaxes to make a draft-restricted port. Fenders, hoses, a mooring master and an approved STS plan under MARPOL Chapter 8 are all mandatory.',
    weather: 'Tighter than a berth, and assessed on the day by the mooring master. Two moving hulls do not tolerate what a jetty does.',
    clauses: ['WHO pays for the lightering — it is a real cost, and it is clause-dependent', 'Whose time counts while it happens', 'Whether the STS position is itself a valid NOR location'],
    nor: 'The contested case. If the charter party does not name the STS position as a valid NOR place, the tender can be challenged — and the gap between tender and berthing is exactly the time in dispute.',
  },
  {
    key: 'double', name: 'Double-banking', color: '#a78bfa',
    what: 'Two ships moored alongside at the SAME berth: the inboard ship works the shore, the outboard works the inboard. Common in bunkering and product trades.',
    weather: 'The inboard ship’s moorings now carry two ships’ worth of load, so the limits are set by the pair, not the berth.',
    clauses: ['Whose berth time is it when the outboard ship is waiting on the inboard?', 'Insurance notification is required and often forgotten', 'Access and safety arrangements across two decks'],
    nor: 'Usually valid, but the time accounting is messier: one berth, two ships, two charter parties, and the delay that affects one may be caused by the other.',
  },
]

export function BerthingConfigurations() {
  const [sel, setSel] = useState('sts')
  const c = CONFIGS.find(x => x.key === sel)!

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Three ways cargo gets from shore to ship — or ship to ship</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Where draft or logistics demand it, the cargo never sees a jetty. Each configuration has its own weather limits, its own
        insurance notifications and — commercially — <strong className="text-slate-200">its own clause</strong>.
      </p>

      <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {CONFIGS.map(x => (
          <button key={x.key} type="button" onClick={() => setSel(x.key)} aria-pressed={sel === x.key}
            className={`rounded-lg border px-3 py-2.5 text-left transition-all ${
              sel === x.key ? 'bg-white/[0.08]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
            }`}
            style={sel === x.key ? { borderColor: x.color + '99' } : undefined}>
            <span className="text-xs font-medium" style={{ color: sel === x.key ? x.color : '#cbd5e1' }}>{x.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border p-3.5" style={{ borderColor: c.color + '55', backgroundColor: c.color + '0d' }}>
          <div className="font-mono text-sm font-bold" style={{ color: c.color }}>{c.name}</div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{c.what}</p>
          <p className="mt-2 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-400">
            <strong className="text-slate-200">Weather limits:</strong> {c.weather}
          </p>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="mb-1.5 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">The commercial questions</div>
            <ul className="space-y-1.5">
              {c.clauses.map(x => (
                <li key={x} className="flex items-baseline gap-2 text-xs leading-relaxed text-slate-300">
                  <span className="shrink-0 font-mono" style={{ color: c.color }}>▸</span>{x}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/[0.08] p-3">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-amber-300">Is NOR valid here?</div>
            <p className="text-xs leading-relaxed text-slate-300">{c.nor}</p>
          </div>
        </div>
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-slate-400">
        STS is routine, and it is still the highest-attention cargo operation in the book: two moving hulls, live hoses, and — for
        the trader — <strong className="text-slate-200">two sets of ship&apos;s figures where there used to be one</strong>.
      </p>
    </div>
  )
}

// ── 2. The load sequence and the stoppage ledger ──────────────────────────

type Phase = { k: string; v: string; risk?: string }

const PHASES: Phase[] = [
  { k: 'Line-up & agreement', v: 'Stowage plan confirmed against the shore’s loading plan: rates, maximum pressure, venting and vapour-return lineup, communication and emergency shutdown procedures all agreed before anything moves.' },
  { k: 'Start slow', v: 'Reduced rate while both sides verify the cargo is going where it should.', risk: 'The first ten minutes catch the misaligned valve. Skipping this phase to save half an hour is how a cargo ends up in the wrong tank.' },
  { k: 'Bulk loading', v: 'At the agreed rate. The ship deballasts as cargo comes in, keeping stress, trim and drafts inside the plan at every stage — not just at the end.' },
  { k: 'Topping off', v: 'Rates cut as tanks approach their ullage targets, loaded to a percentage that leaves room for thermal expansion.', risk: 'The highest-risk phase for overflow. One tank at a time, full attendance, and nobody rushing the last hundred tonnes.' },
  { k: 'Completion', v: 'Lines drained and blown, quantities tallied before hoses come off. The tally happens while both parties are still standing there, which is the only time it is easy.' },
]

type Stop = { k: string; whose: 'ship' | 'terminal' | 'neither'; v: string }

const STOPS: Stop[] = [
  { k: 'Pump trip', whose: 'terminal', v: 'The shore’s equipment failed. Their time — if your operator recorded the cause at the moment it happened.' },
  { k: 'Tank change', whose: 'ship', v: 'A normal part of the ship’s operation, and normally the ship’s time. Routine, which is exactly why it goes unrecorded.' },
  { k: 'Vapour lock', whose: 'neither', v: 'Could be either side’s lineup. This is the stoppage that becomes an argument, and it is decided by what was written down at 03:00.' },
  { k: 'Weather stop', whose: 'neither', v: 'Depends entirely on the charter party’s exceptions clause — and on whether the terminal or the ship called it.' },
]

export function LoadSequence() {
  const [phase, setPhase] = useState(3)
  const [stop, setStop] = useState(2)
  const p = PHASES[phase]
  const s = STOPS[stop]

  const WHOSE = {
    ship: { label: 'Ship’s time', color: '#22d3ee' },
    terminal: { label: 'Terminal’s time', color: '#f59e0b' },
    neither: { label: 'Argued', color: '#f43f5e' },
  }[s.whose]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Five phases — and a ledger of every stoppage</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        The physics of the load, and the commercial rails around it. The charter party&apos;s allowed loading rate prices the port
        stay; the terminal&apos;s actual rate is usually the binding constraint; and{' '}
        <strong className="text-slate-200">every stoppage is logged with its cause</strong>, because the demurrage calculation
        will ask, line by line, whose time each one was.
      </p>

      <div className="mb-3 flex flex-wrap items-stretch gap-1.5">
        {PHASES.map((x, i) => (
          <div key={x.k} className="flex flex-1 items-stretch gap-1.5" style={{ minWidth: 100 }}>
            {i > 0 && <div className="flex items-center font-mono text-sm text-slate-600">→</div>}
            <button type="button" onClick={() => setPhase(i)} aria-pressed={phase === i}
              className={`flex-1 rounded-lg border px-2 py-2 text-left transition-all ${
                phase === i ? 'border-cyan-400/60 bg-cyan-400/[0.10]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
              }`}>
              <div className="font-mono text-[10px] text-slate-500">{i + 1}</div>
              <div className={`text-[11px] font-medium ${phase === i ? 'text-cyan-300' : 'text-slate-300'}`}>{x.k}</div>
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-cyan-400/40 bg-cyan-400/[0.08] p-3.5">
          <div className="font-mono text-sm font-bold text-cyan-300">{phase + 1}. {p.k}</div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{p.v}</p>
          {p.risk && (
            <p className="mt-2 border-t border-white/10 pt-2 text-xs leading-relaxed text-amber-200">
              <strong>Watch here:</strong> {p.risk}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
            The stoppage ledger — whose time was it?
          </div>
          <div className="space-y-1">
            {STOPS.map((x, i) => (
              <button key={x.k} type="button" onClick={() => setStop(i)} aria-pressed={stop === i}
                className={`flex w-full items-center justify-between gap-2 rounded px-2.5 py-1.5 text-left transition-all ${
                  stop === i ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'
                }`}>
                <span className="text-xs text-slate-200">{x.k}</span>
                <span className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] uppercase ${
                  x.whose === 'ship' ? 'bg-cyan-400/20 text-cyan-200'
                    : x.whose === 'terminal' ? 'bg-amber-400/20 text-amber-200' : 'bg-rose-400/20 text-rose-200'
                }`}>
                  {x.whose === 'neither' ? 'disputed' : x.whose}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-2 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-300">
            <strong style={{ color: WHOSE.color }}>{WHOSE.label}.</strong> {s.v}
          </p>
        </div>
      </div>
    </div>
  )
}
