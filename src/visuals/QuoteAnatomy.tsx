'use client'

import { useState } from 'react'

// The market speaks in compressed, standardised messages. Every element of a
// quote is both negotiable AND information — so the visual is an anatomy:
// click any token and find out what it commits you to, and what it tells you
// about the other side.

type Part = { token: string; label: string; what: string; watch: string }

const CARGO: Part[] = [
  { token: '80,000 t ± 5% MOLCO', label: 'Quantity and tolerance', what: 'Eighty thousand tonnes, with a 5% tolerance exercised at the CHARTERER’s option — MOLCO, more or less charterer’s option. MOLOO puts the same choice with the owner.', watch: 'Whoever holds the option holds a real piece of value. Nominate below the minimum and the owner claims deadfreight on the shortfall; hold MOLOO as an owner and you fill the ship.' },
  { token: 'crude oil', label: 'Cargo', what: 'The grade decides the vetting, the tank coatings, the heating requirement and whether the ship’s last three cargoes matter.', watch: 'A clean-products ship coming off a dirty cargo needs tank cleaning she may not have time for. The cargo line and the vessel’s last-three line have to be read together.' },
  { token: 'Bonny → UKC-Med, orders', label: 'Load and discharge range', what: 'Load Bonny; discharge anywhere in UK/Continent or the Mediterranean, declared later — "orders" means the charterer nominates in transit.', watch: 'A wide range is an option the charterer holds and the owner prices. Every extra mile between the best and worst discharge port inside that range is freight risk the owner builds in.' },
  { token: 'laycan 12–14 March', label: 'Laycan', what: 'Laydays / cancelling: the window in which the ship must tender a valid Notice of Readiness. Arrive before it and she waits; arrive after and the charterer may cancel.', watch: 'Three days is tight. A narrow laycan excludes ships and raises the price; widening it by 48 hours can be the cheapest concession a charterer ever makes.' },
  { token: 'WS guide', label: 'Price indication', what: 'A hint at the level the charterer expects, without committing. "WS guide" invites an offer rather than making one.', watch: 'Guiding too low wastes the morning; guiding too high anchors the owner. Most experienced charterers guide at or just under the last done.' },
  { token: '2.5% total commission', label: 'Commission', what: 'Address commission plus brokerage, deducted from the freight. 2.5% is conventional; it is real money on a million-dollar fixture.', watch: 'Commission is quoted as part of the price. An owner comparing two offers compares them NET of commission, so a quote without it is incomplete.' },
]

const VESSEL: Part[] = [
  { token: 'M/T Meridian · 105,000 dwt, 2019', label: 'Ship and age', what: 'An Aframax/LR2, built 2019. Deadweight sets the maximum lift; the build year drives vetting, port acceptance and insurance.', watch: 'Many charterers and terminals have hard age limits — commonly 15 or 20 years. An older ship can be perfect and still be unfixable for your receiver.' },
  { token: 'double hull', label: 'Construction', what: 'Mandatory for tankers since the MARPOL phase-out of single hulls. Stated because terminals and charterers require confirmation.', watch: 'Not negotiable and not interesting — until the one trade where it is, such as some coastal and inland regimes with their own rules.' },
  { token: 'open Rotterdam 8 March', label: 'Open position', what: 'Where and when she comes free. This, more than anything else, decides whether she is in your market at all.', watch: 'Work out the ballast time to your load port before you get excited. A ship open on the wrong side of an ocean is on the list and not in your market.' },
  { token: 'last 3: crude/crude/fuel oil', label: 'Last three cargoes', what: 'The cargo history. It drives contamination risk for your parcel and is a standard vetting question.', watch: 'The fuel oil three voyages back is the line a receiver will ask about. On clean products it can be disqualifying outright; on crude it is usually a tank-cleaning conversation.' },
  { token: 'approvals: Shell, BP, Total', label: 'Oil major approvals', what: 'Which majors’ vetting she currently holds. A terminal or a receiver will often accept only an approved ship.', watch: 'Approvals expire and are cargo-specific. "Approved" without a date and a major named is not an approval — and a missing one can kill a fixture after subjects.' },
]

export default function QuoteAnatomy() {
  const [side, setSide] = useState<'cargo' | 'vessel'>('cargo')
  const [sel, setSel] = useState(0)
  const parts = side === 'cargo' ? CARGO : VESSEL
  const p = parts[Math.min(sel, parts.length - 1)]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Every element is negotiable — and every element is information</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        The market speaks in compressed, standardised messages. Click any token: each one commits you to something, and each one
        tells you something about the other side before price is ever discussed.
      </p>

      <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Quote type">
        {([['cargo', 'A cargo quote — the charterer’s order'], ['vessel', 'A vessel quote — the owner’s position']] as const).map(([k, label]) => (
          <button
            key={k} type="button" onClick={() => { setSide(k as 'cargo' | 'vessel'); setSel(0) }}
            aria-pressed={side === k}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
              side === k ? 'border-cyan-400/60 bg-cyan-400/15 text-cyan-100' : 'border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* the message itself, as clickable tokens */}
      <div className="rounded-xl border border-white/10 bg-black/25 p-3.5">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 font-mono text-sm">
          {parts.map((x, i) => (
            <span key={x.token} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-slate-600">·</span>}
              <button
                type="button" onClick={() => setSel(i)}
                aria-pressed={sel === i}
                className={`rounded px-1.5 py-0.5 transition-all ${
                  sel === i ? 'bg-cyan-400/20 text-cyan-100' : 'text-slate-300 hover:bg-white/[0.07]'
                }`}
              >
                {x.token}
              </button>
            </span>
          ))}
          <span className="text-slate-600">·</span>
          <span className="px-1.5 py-0.5 text-slate-500">{side === 'cargo' ? 'charterer XYZ' : 'owners ABC'}</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-cyan-400/40 bg-cyan-400/[0.08] p-3.5">
          <div className="font-mono text-sm font-bold text-cyan-300">{p.label}</div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{p.what}</p>
        </div>
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/[0.08] p-3.5">
          <div className="font-mono text-xs font-bold uppercase tracking-wide text-amber-300">What it tells you</div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{p.watch}</p>
        </div>
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-slate-400">
        Read the vessel quote before the price. The <strong className="text-slate-200">open position</strong>, the{' '}
        <strong className="text-slate-200">last three cargoes</strong> and the{' '}
        <strong className="text-slate-200">approvals</strong> decide whether a ship is even a candidate — and a ship that is not a
        candidate cannot be made into one by a good WS level.
      </p>
    </div>
  )
}
