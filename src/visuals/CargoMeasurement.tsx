'use client'

import { useState } from 'react'

// The load port is where quantity and quality are ESTABLISHED — the numbers
// every later claim references. And the bill of lading is the document that
// carries them.
//
// Two sections, one file: the measurement that produces the figure, and the
// sheet of paper that turns the figure into money.

// ── Ship against shore, and the VEF ───────────────────────────────────────

const TOLERANCE = 0.003 // 0.3%

export function ShipShoreFigures() {
  const [shore, setShore] = useState(80_000)
  const [ship, setShip] = useState(79_820)
  const [vef, setVef] = useState(1.0012)

  const corrected = ship * vef
  const diff = corrected - shore
  const pct = diff / shore
  const protest = Math.abs(pct) > TOLERANCE

  const n = (x: number) => Math.round(x).toLocaleString('en-US')

  const SAMPLES = [
    { k: 'Foot samples', v: 'Taken from the first cargo into each tank, before bulk loading. They catch contamination from whatever was in the tank before.' },
    { k: 'First-out', v: 'From the shore line at the start, establishing what the terminal actually delivered rather than what it intended to.' },
    { k: 'Composite', v: 'A proportional blend across the parcel, which is what the quality certificate is usually issued against.' },
  ]
  const [sample, setSample] = useState(0)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Where the numbers every later claim references are made</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        The independent inspector — SGS, Intertek, Saybolt — is appointed jointly under the sale contract, measures shore tanks
        and meters, samples the cargo and issues the certificates. The ship measures too, and the two figures{' '}
        <strong className="text-slate-200">will not agree</strong>. What matters is by how much.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-2.5">
          {([
            ['Shore figure (t)', shore, 79_000, 81_000, 10, setShore, '#f59e0b'],
            ['Ship’s ullage survey (t)', ship, 79_000, 81_000, 10, setShip, '#22d3ee'],
          ] as const).map(([label, val, min, max, step, set, color]) => (
            <div key={label}>
              <div className="mb-1 flex justify-between font-mono text-xs">
                <span style={{ color }}>{label}</span>
                <span className="font-bold tabular-nums text-white">{n(val)}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={val}
                onChange={e => (set as (v: number) => void)(parseInt(e.target.value, 10))}
                aria-label={label} className="h-1.5 w-full cursor-pointer" style={{ accentColor: color }} />
            </div>
          ))}
          <div>
            <div className="mb-1 flex justify-between font-mono text-xs">
              <span className="text-violet-300">Vessel experience factor (VEF)</span>
              <span className="font-bold tabular-nums text-white">{vef.toFixed(4)}</span>
            </div>
            <input type="range" min={0.99} max={1.01} step={0.0001} value={vef}
              onChange={e => setVef(parseFloat(e.target.value))}
              aria-label="Vessel experience factor"
              className="h-1.5 w-full cursor-pointer accent-violet-400" />
            <p className="mt-1 font-mono text-[10px] leading-relaxed text-slate-500">
              the ship’s own historical ratio of ship-to-shore figures, applied to correct her survey
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-xs tabular-nums">
            <div className="eyebrow mb-2">The comparison</div>
            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between"><span className="text-slate-500">ship, VEF-corrected</span><span>{n(corrected)} t</span></div>
              <div className="flex justify-between"><span className="text-slate-500">shore</span><span>{n(shore)} t</span></div>
              <div className="flex justify-between border-t border-white/15 pt-1">
                <span className="text-white">difference</span>
                <span className={protest ? 'font-bold text-rose-300' : 'text-slate-200'}>
                  {diff >= 0 ? '+' : '−'}{n(Math.abs(diff))} t · {(pct * 100).toFixed(3)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className={`rounded-xl border p-3.5 ${protest ? 'border-rose-500/50 bg-rose-500/[0.10]' : 'border-emerald-500/40 bg-emerald-500/[0.08]'}`}>
            <div className={`font-mono text-sm font-bold ${protest ? 'text-rose-300' : 'text-emerald-300'}`}>
              {protest ? 'Outside tolerance — note of protest, on the spot' : 'Inside tolerance — no protest required'}
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
              {protest
                ? <>The divergence exceeds the usual ~0.3% tolerance, so the Master issues a note of protest <strong className="text-white">at the time</strong>. Not afterwards: a protest raised three days later is a complaint, and a complaint is not evidence.</>
                : <>Within the ~0.3% the industry treats as normal measurement variance. Both figures stand, the B/L is issued on the shore figure, and nobody writes anything.</>}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {SAMPLES.map((x, i) => (
                <button key={x.k} type="button" onClick={() => setSample(i)} aria-pressed={sample === i}
                  className={`rounded border px-2 py-1 text-[11px] transition-all ${
                    sample === i ? 'border-cyan-400/60 bg-cyan-400/[0.10] text-cyan-100' : 'border-white/10 text-slate-400 hover:text-slate-200'
                  }`}>
                  {x.k}
                </button>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-slate-300">{SAMPLES[sample].v}</p>
            <p className="mt-2 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-300">
              <strong className="text-slate-100">Samples are evidence.</strong> Sealed, labelled and retained — because in a
              quality dispute at discharge, the load-port samples decide whether the cargo changed on board or was always
              off-spec. That is a very different conversation, and a very different payer.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-xs leading-relaxed text-slate-300">
              <strong className="text-slate-100">OBQ</strong> (on-board quantity before loading) and, at discharge,{' '}
              <strong className="text-slate-100">ROB</strong> (remaining on board) bracket what the ship actually carried. For the
              trader none of this is formality: the B/L quantity drives the <strong className="text-white">invoice</strong>, the
              quality certificate drives <strong className="text-white">spec compliance</strong> on the sale, and both drive the
              letter of credit.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── The bill of lading ────────────────────────────────────────────────────

type Role = { key: string; name: string; what: string; consequence: string }

const ROLES: Role[] = [
  {
    key: 'receipt', name: 'A receipt', what: 'For the cargo as loaded: quantity, apparent condition, and the date.',
    consequence: 'The quantity on it is what the buyer pays for. If it disagrees with the ship’s figures the Master may sign under protest or clause the B/L — and a claused B/L usually breaks the letter of credit, which is why the pressure to sign clean is commercial and intense.',
  },
  {
    key: 'contract', name: 'Evidence of the contract of carriage', what: 'The terms on which the carrier holds and delivers the goods.',
    consequence: 'It is evidence of the contract, not the contract itself — which matters when the B/L terms and the charter party disagree, and a third-party holder relies on the B/L.',
  },
  {
    key: 'title', name: 'A document of title', what: 'The paper that IS the cargo. Endorse and deliver it and you have sold the goods afloat.',
    consequence: 'This is what makes the CIF chain of the commodity course physically possible: a cargo can change hands five times mid-ocean without anyone touching the oil, because the title moves with the paper.',
  },
]

const CHECKS = [
  { k: 'B/L figures vs ship’s figures', v: 'If they diverge, the Master signs under protest or clauses the B/L. Clean or claused is a commercial decision with a letter of credit attached.' },
  { k: 'The B/L date', v: 'The shipment-period trigger in the sale contract. Backdating is fraud, full stop — and it is the request a young operator will eventually be asked to accommodate.' },
  { k: 'Parties and destination', v: 'Consignee, notify party, and whether it reads "to order". Per the charterer’s instructions, IF consistent with the charter party and the mate’s receipts.' },
  { k: 'Freight clause', v: 'Freight prepaid or freight collect — which decides whether the receiver can take delivery without paying the owner first.' },
]

export function BillOfLading() {
  const [role, setRole] = useState('title')
  const [check, setCheck] = useState(1)
  const r = ROLES.find(x => x.key === role)!

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Three instruments in one sheet of paper</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        The bill of lading does three different jobs at once, and most confusion about it comes from arguing about one job while
        thinking of another.
      </p>

      <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {ROLES.map(x => (
          <button key={x.key} type="button" onClick={() => setRole(x.key)} aria-pressed={role === x.key}
            className={`rounded-lg border px-3 py-2.5 text-left transition-all ${
              role === x.key ? 'border-cyan-400/60 bg-cyan-400/[0.10]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
            }`}>
            <span className={`text-xs font-medium ${role === x.key ? 'text-cyan-300' : 'text-slate-200'}`}>{x.name}</span>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-cyan-400/40 bg-cyan-400/[0.08] p-3.5">
        <p className="text-xs leading-relaxed text-slate-300">{r.what}</p>
        <p className="mt-2 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-200">
          <strong>Why it matters:</strong> {r.consequence}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">The operator’s checkpoints</div>
          <div className="space-y-1">
            {CHECKS.map((x, i) => (
              <button key={x.k} type="button" onClick={() => setCheck(i)} aria-pressed={check === i}
                className={`block w-full rounded px-2.5 py-1.5 text-left text-xs transition-all ${
                  check === i ? 'bg-white/[0.08] text-slate-100' : 'text-slate-300 hover:bg-white/[0.04]'
                }`}>
                {x.k}
              </button>
            ))}
          </div>
          <p className="mt-2 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-300">{CHECKS[check].v}</p>
        </div>

        <div className="rounded-xl border border-violet-500/40 bg-violet-500/[0.08] p-3.5">
          <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-violet-300">e-Docs</div>
          <p className="text-xs leading-relaxed text-slate-300">
            Electronic bills — Bolero, essDOCS, and now MLETR-based statutory regimes — replicate receipt, contract and title
            cryptographically. That kills the courier lag which made{' '}
            <strong className="text-white">discharge against a letter of indemnity</strong> routine, and adoption is accelerating
            trade lane by trade lane.
          </p>
          <p className="mt-2 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-300">
            The operator&apos;s job is unchanged: the <strong className="text-white">data</strong> on the document, paper or
            digital, must be right at issue. Errors compound at every hand the document passes through — and a document of title
            passes through a lot of hands.
          </p>
        </div>
      </div>
    </div>
  )
}
