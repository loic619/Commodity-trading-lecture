'use client'

import { useState } from 'react'

// Vetting is the charterer's FIRST filter — no acceptable SIRE, no
// negotiation — so this is a funnel, not a checklist. Switch any gate off and
// the ship stops there.
//
// The working reality students miss is in the panel: an approval is not a
// certificate. Majors screen per voyage, so "approved by Shell last month"
// means she passed THAT screen for THAT cargo.

type Gate = {
  key: string
  name: string
  full: string
  what: string
  fails: string
}

const GATES: Gate[] = [
  {
    key: 'sire', name: 'SIRE', full: 'Ship Inspection Report Programme (OCIMF)',
    what: 'The tanker standard. Uniform inspections by accredited inspectors, with reports visible to every participating charterer and terminal. Now SIRE 2.0: risk-based, tablet-driven and far heavier on human factors than the checklist it replaced.',
    fails: 'No acceptable SIRE report and the conversation ends before price is ever mentioned. This is the gate that makes the rest of the funnel possible: one inspection, read by everybody.',
  },
  {
    key: 'cdi', name: 'CDI', full: 'Chemical Distribution Institute',
    what: 'The chemical and parcel-trade equivalent of SIRE, with its own inspection regime and database.',
    fails: 'For a chemical or parcel cargo, no CDI is the same dead end as no SIRE. On a crude cargo it is usually not asked for — which gate applies depends on what you are lifting.',
  },
  {
    key: 'class', name: 'Class & PSC', full: 'Class records and Port State Control history',
    what: 'The classification society’s records plus the ship’s Port State Control history — detentions, deficiencies, the pattern over time.',
    fails: 'A detention history is a pattern, not an incident. A ship that keeps being detained will keep failing screens, and her owner knows it before you do.',
  },
  {
    key: 'terminal', name: 'Terminal feedback', full: 'Terminal and charterer feedback',
    what: 'What the last terminals actually reported: how she moored, how she pumped, how the crew handled the ship/shore checklist.',
    fails: 'The least formal gate and often the most decisive. A terminal that had a bad call with this ship can decline her for reasons that appear in no database.',
  },
  {
    key: 'age', name: 'Age policy', full: 'Age and commercial policy',
    what: 'Most majors decline tankers beyond a stated age — typically 20–25 years, and often stricter commercially than the written policy admits.',
    fails: 'The hardest gate to argue with, because it is a policy rather than a judgement. A perfectly maintained 26-year-old ship is simply outside the box.',
  },
]

export default function VettingFunnel() {
  const [pass, setPass] = useState<Record<string, boolean>>(
    Object.fromEntries(GATES.map(g => [g.key, true])),
  )
  const [sel, setSel] = useState('sire')
  const g = GATES.find(x => x.key === sel)!

  const firstFail = GATES.find(x => !pass[x.key])
  const cleared = !firstFail

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Vetting is the first filter — not the last check</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Before a tanker touches an oil major&apos;s cargo or berth she is screened against the industry&apos;s shared databases.
        No acceptable SIRE, <strong className="text-slate-200">no negotiation</strong> — so this is a funnel, and a ship stops at
        the first gate she fails. Switch one off.
      </p>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
        <div className="flex flex-wrap items-stretch gap-1.5">
          {GATES.map((x, i) => {
            const blocked = firstFail && GATES.indexOf(firstFail) < i
            return (
              <div key={x.key} className="flex flex-1 items-stretch gap-1.5" style={{ minWidth: 110 }}>
                {i > 0 && <div className="flex items-center font-mono text-sm text-slate-600">→</div>}
                <button
                  type="button"
                  onClick={() => { setPass(p => ({ ...p, [x.key]: !p[x.key] })); setSel(x.key) }}
                  aria-pressed={pass[x.key]}
                  aria-label={`${x.name}: ${pass[x.key] ? 'passed' : 'failed'}`}
                  className={`flex-1 rounded-lg border px-2.5 py-2 text-left transition-all ${
                    !pass[x.key] ? 'border-rose-500/60 bg-rose-500/[0.12]'
                      : blocked ? 'border-white/10 bg-white/[0.02] opacity-35'
                        : 'border-emerald-400/40 bg-emerald-400/[0.08]'
                  }`}
                >
                  <div className={`font-mono text-[11px] font-bold ${
                    !pass[x.key] ? 'text-rose-300' : blocked ? 'text-slate-500' : 'text-emerald-300'
                  }`}>
                    {x.name}
                  </div>
                  <div className="font-mono text-[9px] text-slate-500">
                    {!pass[x.key] ? 'failed' : blocked ? 'never reached' : 'passed'}
                  </div>
                </button>
              </div>
            )
          })}
        </div>

        <div className={`mt-3 rounded-lg border px-3 py-2.5 ${
          cleared ? 'border-emerald-500/45 bg-emerald-500/[0.10]' : 'border-rose-500/50 bg-rose-500/[0.10]'
        }`}>
          <div className={`font-mono text-sm font-bold ${cleared ? 'text-emerald-300' : 'text-rose-300'}`}>
            {cleared ? 'Cleared for the negotiation' : `Stopped at ${firstFail!.name}`}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">
            {cleared
              ? 'Every gate passed, so this ship is now a candidate — and only now does anyone discuss a WS level.'
              : 'The gates after this one are never reached, because nobody runs them on a ship that has already failed. A rejection here is not a negotiating position; it is the end of the conversation.'}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-cyan-400/40 bg-cyan-400/[0.08] p-3.5">
          <div className="font-mono text-sm font-bold text-cyan-300">{g.name}</div>
          <div className="font-mono text-[10px] text-slate-500">{g.full}</div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{g.what}</p>
          <p className="mt-2 border-t border-white/10 pt-2 text-xs leading-relaxed text-rose-200">
            <strong>If she fails it:</strong> {g.fails}
          </p>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/[0.08] p-3.5">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-amber-300">
              An approval is not a certificate
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              Majors screen <strong className="text-white">per voyage</strong>. &ldquo;Approved by Shell last month&rdquo; means
              only that she passed that screen, for that cargo, on that route. Treating an approval as a standing qualification is
              how a fixture dies after subjects.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">Why this is commercial</div>
            <p className="text-xs leading-relaxed text-slate-300">
              For the trader none of this is technical. A cargo bought FOB with a ship the terminal rejects is{' '}
              <strong className="text-white">a cargo you cannot lift</strong> — and you are holding it, priced, with a laycan
              running. Vetting failure is a trading loss that arrives dressed as a safety matter.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
