'use client'

import { useState } from 'react'

// Two sections of the pre-fixture file that are really one idea: the laycan
// is re-tested by every ETA message, and the berth has to be cleared on three
// separate axes before she gets there. Shared file, separate exports, because
// each belongs to its own section.

// ── Laycan monitoring ─────────────────────────────────────────────────────

const LAYCAN_FROM = 12
const LAYCAN_TO = 14

const FEED = [
  { day: 'Day 1', eta: 12.5, note: 'First position report after fixing. Comfortably inside the laycan, with half a day of slack.' },
  { day: 'Day 3', eta: 13.0, note: 'Half a day lost to weather on passage. Still inside, and still nothing to do — but the slack is gone.' },
  { day: 'Day 5', eta: 13.8, note: 'The previous discharge ran long. Now inside by hours, not days. THIS is the message to act on: the laycan is at risk while options still exist.' },
  { day: 'Day 7', eta: 14.6, note: 'She misses. The charterer now holds the cancellation option, and you are negotiating from a position where they know it.' },
  { day: 'Day 8', eta: 14.2, note: 'She makes it up — but only because you asked for the speed-up on Day 5. Had you waited, the extension request would now be a concession, not a courtesy.' },
]

export function LaycanWatch() {
  const [i, setI] = useState(2)
  const f = FEED[i]
  const misses = f.eta > LAYCAN_TO

  const lo = 11, hi = 15.5
  const pos = (d: number) => `${((d - lo) / (hi - lo)) * 100}%`

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Every ETA message re-tests the laycan</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        From fixture to arrival the Master sends a daily position and ETA — a charter-party obligation, and the operator&apos;s
        early-warning system. The craft is <strong className="text-slate-200">refusing surprises</strong>: a laycan at risk is
        renegotiated now, while options exist, not discovered on the morning she misses it.
      </p>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
        <div className="relative h-16">
          {/* the laycan window */}
          <div className="absolute top-5 h-7 rounded bg-emerald-400/20"
            style={{ left: pos(LAYCAN_FROM), width: `${((LAYCAN_TO - LAYCAN_FROM) / (hi - lo)) * 100}%` }} />
          <span className="absolute top-0 -translate-x-1/2 font-mono text-[10px] text-emerald-300" style={{ left: pos(LAYCAN_FROM) }}>
            laydays 12
          </span>
          <span className="absolute top-0 -translate-x-1/2 font-mono text-[10px] text-emerald-300" style={{ left: pos(LAYCAN_TO) }}>
            cancelling 14
          </span>
          <div className="absolute inset-x-0 top-8 h-px bg-white/15" />
          {/* every reported ETA so far */}
          {FEED.slice(0, i + 1).map((x, k) => (
            <div key={k} className="absolute top-6 -translate-x-1/2"
              style={{ left: pos(Math.max(lo, Math.min(hi, x.eta))) }}>
              <span className={`block h-4 w-1 rounded ${x.eta > LAYCAN_TO ? 'bg-rose-400' : 'bg-cyan-400'}`}
                style={{ opacity: k === i ? 1 : 0.3 }} />
            </div>
          ))}
          <span className={`absolute top-11 -translate-x-1/2 font-mono text-[11px] font-bold ${misses ? 'text-rose-300' : 'text-cyan-300'}`}
            style={{ left: pos(Math.max(lo, Math.min(hi, f.eta))) }}>
            ETA {f.eta.toFixed(1)}
          </span>
        </div>

        <div className="mt-2 flex gap-1">
          {FEED.map((x, k) => (
            <button key={k} type="button" onClick={() => setI(k)} aria-pressed={i === k}
              className={`flex-1 rounded px-1 py-1.5 font-mono text-[10px] transition-all ${
                i === k ? 'bg-white/[0.10] text-cyan-200' : 'text-slate-500 hover:bg-white/[0.04]'
              }`}>
              {x.day}
            </button>
          ))}
        </div>
      </div>

      <div className={`mt-3 rounded-xl border p-3.5 ${misses ? 'border-rose-500/50 bg-rose-500/[0.10]' : 'border-white/10 bg-white/[0.03]'}`}>
        <div className={`font-mono text-sm font-bold ${misses ? 'text-rose-300' : 'text-cyan-300'}`}>
          {f.day} — ETA {f.eta.toFixed(1)} March {misses ? '· MISSES the cancelling date' : '· inside the laycan'}
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{f.note}</p>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <div className="mb-1.5 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">The standing rhythm</div>
          <ul className="space-y-1.5 text-xs leading-relaxed text-slate-300">
            <li><strong className="text-slate-100">Itinerary</strong> — daily position and ETA from the Master, every revision re-testing the laycan.</li>
            <li><strong className="text-slate-100">Nominations</strong> — load port confirmed, discharge orders declared, quantity narrowed inside the tolerance, all within the CP&apos;s notice periods.</li>
            <li><strong className="text-slate-100">Counterparties</strong> — supplier&apos;s terminal, receivers, agents both ends, inspectors appointed.</li>
            <li><strong className="text-slate-100">The paper trail</strong> — every update in writing, every instruction acknowledged.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/[0.08] p-3.5">
          <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-amber-300">Why the file matters</div>
          <p className="text-xs leading-relaxed text-slate-300">
            This correspondence <strong className="text-white">is the evidence</strong> when the claim comes, three months later.
            An ETA warning given and acknowledged in writing is a different conversation from one that was had on the phone —
            and the difference is usually the claim.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Port and terminal clearance ───────────────────────────────────────────

type Axis = {
  key: string
  name: string
  items: string[]
  fail: string
}

const AXES: Axis[] = [
  {
    key: 'tech', name: 'Technical',
    items: ['LOA, beam, draft, displacement against berth limits', 'Manifold setup and height', 'WLTHC in ballast', 'Air draft under the loading gantries'],
    fail: 'The numbers from Module 1, now with consequences. A ship that cannot physically take the berth was never a candidate — and discovering it after fixing is an expensive way to learn the terminal’s limits.',
  },
  {
    key: 'comm', name: 'Commercial',
    items: ['Terminal accepts THIS ship', 'Supplier accepts her for THIS lifting', 'Their own vetting pass, separate from the charterer’s'],
    fail: 'The terminal runs its own screen and owes you nothing. A ship your charterer approved can still be declined at the berth, and the two decisions are made by different people against different criteria.',
  },
  {
    key: 'policy', name: 'Age & policy',
    items: ['Terminal age limits', 'Flag and sanctions screening', 'P&I cover and insurance checks'],
    fail: 'A policy, not a judgement, so there is nothing to argue. And a sanctions failure discovered at the berth is not a delay — it is a catastrophe with regulators attached.',
  },
]

const SSSCL = [
  { k: 'Moorings', v: 'Made fast per the terminal’s plan, tended, and within the criteria for the expected weather.' },
  { k: 'IGS', v: 'Inert gas system operational and tanks inerted to the required oxygen level before any cargo moves.' },
  { k: 'Venting lineup', v: 'Vapour return or venting arrangement agreed and physically set, matching what the terminal expects.' },
  { k: 'Communication', v: 'An agreed, tested link between ship and shore, with a named person on each end.' },
  { k: 'Emergency shutdown', v: 'ESD procedure agreed and tested, with both sides clear on who triggers it and what happens next.' },
]

export function PortClearance() {
  const [axis, setAxis] = useState('tech')
  const [stopped, setStopped] = useState(false)
  const [item, setItem] = useState(0)
  const a = AXES.find(x => x.key === axis)!

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Cleared on three axes — then checked again at the rail</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Parallel to the voyage, the ship must be cleared for the berth. Three separate axes, decided by three different parties —
        and passing one says nothing about the others.
      </p>

      <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {AXES.map(x => (
          <button key={x.key} type="button" onClick={() => setAxis(x.key)} aria-pressed={axis === x.key}
            className={`rounded-lg border px-3 py-2.5 text-left transition-all ${
              axis === x.key ? 'border-cyan-400/60 bg-cyan-400/[0.10]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
            }`}>
            <div className={`text-xs font-medium ${axis === x.key ? 'text-cyan-300' : 'text-slate-200'}`}>{x.name}</div>
            <div className="font-mono text-[10px] text-slate-500">{x.items.length} checks</div>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-cyan-400/40 bg-cyan-400/[0.08] p-3.5">
        <ul className="space-y-1">
          {a.items.map(x => (
            <li key={x} className="flex items-baseline gap-2 text-xs leading-relaxed text-slate-300">
              <span className="shrink-0 font-mono text-cyan-400">▸</span>{x}
            </li>
          ))}
        </ul>
        <p className="mt-2.5 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-300">{a.fail}</p>
      </div>

      {/* the SSSCL, and the grey zone */}
      <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
            At the berth: the Ship/Shore Safety Check List
          </span>
          <span className="font-mono text-[10px] text-slate-500">ISGOTT · joint, signed, item by item</span>
        </div>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {SSSCL.map((x, i) => (
            <button key={x.k} type="button" onClick={() => setItem(i)} aria-pressed={item === i}
              className={`rounded border px-2 py-1 text-[11px] transition-all ${
                item === i ? 'border-cyan-400/60 bg-cyan-400/[0.10] text-cyan-100' : 'border-white/10 text-slate-300 hover:bg-white/[0.05]'
              }`}>
              {x.k}
            </button>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-slate-300">{SSSCL[item].v}</p>

        <button
          type="button" onClick={() => setStopped(s => !s)}
          aria-pressed={stopped}
          className={`mt-3 rounded-lg border px-3 py-1.5 font-mono text-[11px] transition-all ${
            stopped ? 'border-rose-500/60 bg-rose-500/[0.12] text-rose-200' : 'border-white/15 text-slate-300 hover:bg-white/5'
          }`}
        >
          {stopped ? '← a rising swell just broke the mooring criteria' : 'what if a repeat check fails mid-operation? →'}
        </button>

        {stopped && (
          <div className="mt-2.5 rounded-lg border border-rose-500/50 bg-rose-500/[0.10] px-3 py-2.5">
            <div className="font-mono text-sm font-bold text-rose-300">Operations stop — and the clock does what?</div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
              The SSSCL can legitimately halt the operation, and the resulting delay lands in a laytime grey zone: is time lost to
              a safety stoppage the ship&apos;s fault, the terminal&apos;s, or &ldquo;time not counting&rdquo;? The answer lives in
              the CP&apos;s exceptions clause — and, just as much, in whether your operator{' '}
              <strong className="text-white">documented who failed which item</strong>. A stoppage with no recorded cause becomes
              whichever story is told best in three months.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
