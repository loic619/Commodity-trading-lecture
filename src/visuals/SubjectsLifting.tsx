'use client'

import { useState } from 'react'

// "On subs" is a state, not a formality — and the transition out of it is the
// moment the whole pre-loading clock starts. Lift the subjects one by one and
// watch the fixture change from conditional to clean.
//
// The etiquette point is built into the failing path: subjects are for their
// stated purpose, and failing subs to shop the market is legal and lethal.

type Sub = { key: string; name: string; purpose: string; deadline: string }

const SUBS: Sub[] = [
  { key: 'mgmt', name: 'Charterer’s management approval', purpose: 'The trading desk agreed the terms; the company still has to sign them off against credit and policy limits.', deadline: '17:00 today' },
  { key: 'recv', name: 'Suppliers’ / receivers’ approval', purpose: 'The terminal at each end has to accept this specific ship — age, condition, vetting, and whether her last three cargoes are a problem for them.', deadline: '12:00 tomorrow' },
  { key: 'stem', name: 'Stem confirmation', purpose: 'Confirmation that the cargo itself is actually available for the laycan. A fixture against a stem that slips is a fixture against nothing.', deadline: '17:00 tomorrow' },
]

export default function SubjectsLifting() {
  const [lifted, setLifted] = useState<Record<string, boolean>>({ mgmt: false, recv: false, stem: false })
  const [failed, setFailed] = useState(false)
  const [sel, setSel] = useState('mgmt')

  const s = SUBS.find(x => x.key === sel)!
  const count = SUBS.filter(x => lifted[x.key]).length
  const clean = count === SUBS.length && !failed

  const state = failed
    ? { label: 'Failed subs — no fixture', color: '#f43f5e',
        note: 'Nothing binds. Legally you are free, and that is exactly the problem: the market now knows you failed subjects, and brokers remember. Subjects are for their stated purpose — failing them because a cheaper ship appeared is technically legal and commercially lethal.' }
    : clean
      ? { label: 'Clean — fully binding', color: '#34d399',
          note: 'Every subject has lifted. The fixture is now a contract, there is no escape for either side, and the pre-loading clock starts immediately: vetting, port clearance, the stowage plan, the laycan. Everything in the next module begins at this minute.' }
      : { label: `On subs — ${SUBS.length - count} outstanding`, color: '#f59e0b',
          note: 'Main terms are agreed and nothing binds yet. This is the last moment at which any line of the recap can still be changed — and the reason the recap has to be READ, not skimmed, before you get here.' }

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">&ldquo;On subs&rdquo; is a state, and leaving it is a one-way door</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        The negotiation has converged and the broker has drafted the recap. Two mechanics close the deal — and the second one is
        where a fixture stops being an option and becomes an obligation.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.1fr_1fr]">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
            Lift each subject
          </div>
          <div className="space-y-1.5">
            {SUBS.map(x => (
              <div key={x.key} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setLifted(l => ({ ...l, [x.key]: !l[x.key] })); setSel(x.key); setFailed(false) }}
                  aria-pressed={lifted[x.key]}
                  aria-label={`${x.name}: ${lifted[x.key] ? 'lifted' : 'outstanding'}`}
                  disabled={failed}
                  className={`w-11 shrink-0 rounded-full border px-1 py-1 transition-all disabled:opacity-40 ${
                    lifted[x.key] ? 'border-emerald-400/60 bg-emerald-400/20' : 'border-white/15 bg-white/[0.04]'
                  }`}
                >
                  <span className={`block h-3 w-3 rounded-full transition-all ${lifted[x.key] ? 'ml-auto bg-emerald-300' : 'bg-slate-500'}`} />
                </button>
                <button type="button" onClick={() => setSel(x.key)}
                  className={`flex-1 text-left text-xs transition-all ${sel === x.key ? 'font-bold text-cyan-200' : 'text-slate-300'}`}>
                  {x.name}
                </button>
                <span className="shrink-0 font-mono text-[10px] text-slate-500">{x.deadline}</span>
              </div>
            ))}
          </div>

          <p className="mt-2.5 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-300">
            <strong className="text-slate-100">{s.name}:</strong> {s.purpose}
          </p>

          <button
            type="button" onClick={() => { setFailed(true); setLifted({ mgmt: false, recv: false, stem: false }) }}
            className="mt-3 rounded-lg border border-rose-500/40 px-3 py-1.5 font-mono text-[11px] text-rose-300 transition-all hover:bg-rose-500/10"
          >
            or: fail subs because a cheaper ship appeared →
          </button>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-xl border p-3.5" style={{ borderColor: state.color + '66', backgroundColor: state.color + '12' }}>
            <div className="font-mono text-sm font-bold" style={{ color: state.color }}>{state.label}</div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{state.note}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">Finalising the recap</div>
            <p className="text-xs leading-relaxed text-slate-300">
              Every agreed term, restated once, in writing, by the broker — and <strong className="text-white">read</strong> by
              both principals. The recap <em>is</em> the contract. An error left unchallenged now (&ldquo;72 hrs&rdquo; that should
              read &ldquo;84 hrs&rdquo;) will be enforced later, and details that were never discussed default to the named CP
              form. Which is why you name the form <em>and</em> whose amendments apply.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
