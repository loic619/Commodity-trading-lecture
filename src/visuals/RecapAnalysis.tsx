'use client'

import { useState } from 'react'

// Read a recap the way a claims analyst will read it in three months. The
// anatomy visual earlier in this topic says what the parts ARE; this one says
// what each line COSTS — which is the second, harder pass.
//
// Every line carries a money consequence and a moment at which it could still
// have been changed. That moment is always "before subjects lift".

type Line = {
  token: string
  reads: string
  costs: string
  money: string
  alt?: string
}

const LINES: Line[] = [
  {
    token: '± 5% MOLCO',
    reads: 'The charterer picks the final quantity, within 5% either way.',
    costs: 'Nominate below the minimum and the owner claims deadfreight — freight on cargo that was never shipped. On 80,000 t at $9/t, the bottom 5% is 4,000 t.',
    money: '$36,000 of deadfreight exposure',
    alt: 'MOLOO moves the choice to the owner, who will then fill the ship.',
  },
  {
    token: '1–2 SB',
    reads: 'One or two safe berths at the discharge port.',
    costs: 'The second berth is already inside the flat-rate structure — but the SHIFTING between them may not be. If the clause is silent, the argument starts at the second berth.',
    money: 'a shifting bill of $15,000–40,000, and the time',
    alt: 'Name who pays for shifting, explicitly, in the rider clauses.',
  },
  {
    token: '72 hrs SHINC',
    reads: 'Seventy-two hours of laytime, Sundays and holidays INCLUDED.',
    costs: 'The weekend is not free. A ship that berths on a Friday evening burns laytime straight through to Monday whether anyone is working or not.',
    money: 'at $45,000 pdpr, a lost weekend is $90,000',
    alt: 'SHEX excludes Sundays and holidays — worth many hours either way, and the single most consequential three letters in the recap.',
  },
  {
    token: '$45,000 pdpr',
    reads: 'Demurrage at forty-five thousand dollars per day, PRO RATA.',
    costs: 'Pro rata means the meter runs by the minute once laytime expires — not in whole days. There is no rounding in the charterer’s favour.',
    money: '$1,875 an hour, $31 a minute',
    alt: 'A charterer who intends to load fast can often trade a higher demurrage rate for WS points — a concession that costs nothing if they are right.',
  },
  {
    token: 'Asbatankvoy + amendments',
    reads: 'The standard tanker voyage charter form, as amended.',
    costs: 'The printed form is only the skeleton. The real allocation of risk sits in the rider clauses and amendments, which OVERRIDE the print — and "standard amendments" that nobody has actually compared is how disputes are born.',
    money: 'the whole fixture, in the worst case',
    alt: 'Name the form AND whose amendments apply. "Standard" is not a party to the contract.',
  },
  {
    token: 'subs … latest 17:00 tomorrow',
    reads: 'The fixture is on subjects until that deadline.',
    costs: 'Until subjects lift there is NO fixture. After they lift there is no escape. Everything you wanted to change had to be changed before this moment.',
    money: 'the difference between an option and an obligation',
    alt: 'This is the line that makes every other line on this list urgent.',
  },
]

export default function RecapAnalysis() {
  const [sel, setSel] = useState(2)
  const l = LINES[sel]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Read it the way a claims analyst will, in three months</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        You have seen what the parts of a recap <em>are</em>. This is the second pass, and the harder one:{' '}
        <strong className="text-slate-200">every line maps to money</strong>. Click each one for the bill it can become.
      </p>

      <div className="rounded-xl border border-white/10 bg-black/25 p-3.5">
        <div className="space-y-1">
          {LINES.map((x, i) => (
            <button
              key={x.token} type="button" onClick={() => setSel(i)}
              aria-pressed={sel === i}
              className={`flex w-full items-center justify-between gap-3 rounded px-2.5 py-2 text-left transition-all ${
                sel === i ? 'bg-amber-400/[0.12]' : 'hover:bg-white/[0.05]'
              }`}
            >
              <span className={`font-mono text-sm ${sel === i ? 'text-amber-100' : 'text-slate-300'}`}>{x.token}</span>
              <span className={`shrink-0 font-mono text-[10px] ${sel === i ? 'text-amber-300' : 'text-slate-600'}`}>
                {sel === i ? '← reading' : 'what does it cost?'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">What it says</div>
          <p className="text-xs leading-relaxed text-slate-300">{l.reads}</p>
          {l.alt && (
            <p className="mt-2.5 border-t border-white/10 pt-2 text-xs leading-relaxed text-cyan-200">
              <strong>The alternative:</strong> {l.alt}
            </p>
          )}
        </div>
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/[0.08] p-3.5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wide text-amber-300">What it costs</span>
            <span className="font-mono text-[11px] font-bold text-amber-200">{l.money}</span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{l.costs}</p>
        </div>
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-slate-400">
        The discipline is one sentence: <strong className="text-slate-200">the time to challenge a line is before subjects lift,
        not when the claim arrives</strong>. Three months later the recap is simply what the contract says, and an error nobody
        objected to is an error both parties agreed to.
      </p>
    </div>
  )
}
