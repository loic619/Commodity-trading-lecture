'use client'

import { useState } from 'react'

// The documents a loading generates, and the log that turns the port call
// into laytime evidence. Two sections, one file.
//
// The rule that governs both: the claims file is built DURING the operation.
// A document not obtained at the load port is usually unobtainable three
// months later — which is why both visuals are built around "obtain it now".

// ── Documents ─────────────────────────────────────────────────────────────

type DocGroup = {
  key: string
  name: string
  color: string
  docs: { k: string; v: string; critical?: boolean }[]
}

const DOCS: DocGroup[] = [
  {
    key: 'cargo', name: 'Cargo', color: '#22d3ee',
    docs: [
      { k: 'Bill of lading', v: 'Receipt, contract of carriage and document of title in one sheet — the trader’s key document, and the subject of its own section.', critical: true },
      { k: 'Cargo manifest', v: 'What is on board, for customs and for the receiver.' },
      { k: 'Certificates of quantity and quality', v: 'Issued by the independent inspector. These drive the invoice and the spec compliance on the sale.', critical: true },
      { k: 'Certificate of origin', v: 'Often a letter-of-credit requirement, and in sanctioned trades a scrutinised one.' },
      { k: 'Ullage report and ship’s figures', v: 'The chief officer’s own measurement, which will be compared against the shore’s.' },
    ],
  },
  {
    key: 'customs', name: 'Customs', color: '#34d399',
    docs: [
      { k: 'Export declaration or permit', v: 'The authorisation to take the cargo out of the country.' },
      { k: 'Customs release', v: 'A cargo can be fully loaded and still not sail if the export paperwork lags — a classic in sanctioned or quota trades.', critical: true },
    ],
  },
  {
    key: 'marpol', name: 'Marpol', color: '#a78bfa',
    docs: [
      { k: 'Oil Record Book entries', v: 'The environmental log the terminal and Port State Control will inspect.' },
      { k: 'Slop declarations', v: 'What is on board before loading, and where it came from.' },
      { k: 'Garbage and ballast water records', v: 'A pre-arrival Marpol discrepancy can cost the berth outright.', critical: true },
    ],
  },
  {
    key: 'protest', name: 'Protests & letters', color: '#f43f5e',
    docs: [
      { k: 'Note of protest', v: 'Any disagreement — a quantity difference, a delay, a quality reservation — recorded AT THE TIME, not remembered later.', critical: true },
      { k: 'Letters of protest, both ways', v: 'The ship protests the terminal, the terminal protests the ship. Both belong in the file.' },
    ],
  },
]

export function LoadingDocuments() {
  const [sel, setSel] = useState('cargo')
  const [doc, setDoc] = useState(0)
  const g = DOCS.find(x => x.key === sel)!
  const d = g.docs[Math.min(doc, g.docs.length - 1)]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">The claims file is built during the operation</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Know the documents a loading will generate before the first one is drafted. The operator&apos;s rule is unforgiving:{' '}
        <strong className="text-slate-200">a document not obtained at the load port is usually unobtainable three months
        later</strong> — and three months later is exactly when you will want it.
      </p>

      <div className="mb-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {DOCS.map(x => (
          <button key={x.key} type="button" onClick={() => { setSel(x.key); setDoc(0) }} aria-pressed={sel === x.key}
            className={`rounded-lg border px-2.5 py-2 text-left transition-all ${
              sel === x.key ? 'bg-white/[0.08]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
            }`}
            style={sel === x.key ? { borderColor: x.color + '99' } : undefined}>
            <span className="block text-xs font-medium" style={{ color: sel === x.key ? x.color : '#cbd5e1' }}>{x.name}</span>
            <span className="font-mono text-[10px] text-slate-500">{x.docs.length} documents</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <div className="space-y-1">
            {g.docs.map((x, i) => (
              <button key={x.k} type="button" onClick={() => setDoc(i)} aria-pressed={doc === i}
                className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left transition-all ${
                  doc === i ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'
                }`}>
                <span className={`h-2 w-2 shrink-0 rounded-full ${x.critical ? 'bg-rose-400' : 'bg-slate-600'}`} />
                <span className={`flex-1 text-xs ${doc === i ? 'text-slate-100' : 'text-slate-300'}`}>{x.k}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 border-t border-white/10 pt-2 font-mono text-[10px] text-slate-500">
            ● red marks the ones that stop a ship, break a letter of credit, or decide a claim
          </p>
        </div>

        <div className="rounded-xl border p-3.5" style={{ borderColor: g.color + '55', backgroundColor: g.color + '0d' }}>
          <div className="font-mono text-sm font-bold" style={{ color: g.color }}>{d.k}</div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{d.v}</p>
        </div>
      </div>
    </div>
  )
}

// ── The port log and the three clocks ─────────────────────────────────────

type Event = { t: string; label: string; why: string }

const LOG: Event[] = [
  { t: '04:12', label: 'NOR tendered', why: 'The single most contested timestamp in the whole port call — everything downstream is measured from it, and its validity depends on where she was, whether she was ready, and whether pratique had been granted.' },
  { t: '07:40', label: 'Pilot on board', why: 'The start of the berthing sequence. Time from here to "all fast" is a classic laytime battleground: tug shortage and a missed tide window both live in this gap.' },
  { t: '09:55', label: 'All fast', why: 'Moored per the terminal’s plan. Only now can the Ship/Shore Safety Check List be worked through.' },
  { t: '11:30', label: 'Hoses connected', why: 'The physical connection. Note how long after "all fast" — the SSSCL and the line-up sit in between, and they take real time.' },
  { t: '12:05', label: 'Loading commenced', why: 'Slow rate first, while both sides verify the cargo is going where it should. The first ten minutes catch the misaligned valve.' },
  { t: '23:40', label: 'Loading completed', why: 'Topping off finished, lines drained and blown, quantities tallied before hoses come off.' },
  { t: '01:15', label: 'Hoses off', why: 'The operation is over but the port call is not — and in many charter parties the clock is still running.' },
  { t: '03:50', label: 'Documents on board', why: 'The bill of lading and the certificates. A ship waiting on paperwork is a ship on demurrage, and this gap is where a slow agent becomes a real number.' },
  { t: '05:20', label: 'Sailed', why: 'The port call closes. Now reconcile your log against the terminal’s and the agent’s, line by line, before anybody goes home.' },
]

const CLOCKS = [
  { k: 'The port log', v: 'A timestamped statement of facts in the making. Every entry is future laytime evidence, and the ones you did not record are the ones that will be disputed.' },
  { k: 'The commercial schedule', v: 'Laycan met? Loading rate against the CP allowance? Projected sailing against the discharge-port programme and any sale-contract delivery window?' },
  { k: 'The onward itinerary', v: 'Updated ETAs to the discharge range, fed to receivers, agents and the trading desk — because the trader may be timing a sale, a hedge roll or a re-let on that ETA.' },
]

export function PortLog() {
  const [sel, setSel] = useState(0)
  const [clock, setClock] = useState(0)
  const e = LOG[sel]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Every timestamp is future laytime evidence</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Through the port stay the operator keeps three clocks synchronised. The deliverable of a well-run call is deliberately
        boring: a clean <strong className="text-slate-200">Statement of Facts</strong>, signed by ship, terminal and agent,
        agreeing with your own log to the minute.
      </p>

      <div className="rounded-xl border border-white/10 bg-black/25 p-3.5">
        <div className="space-y-0.5">
          {LOG.map((x, i) => (
            <button key={x.label} type="button" onClick={() => setSel(i)} aria-pressed={sel === i}
              className={`flex w-full items-center gap-3 rounded px-2.5 py-1.5 text-left transition-all ${
                sel === i ? 'bg-cyan-400/[0.12]' : 'hover:bg-white/[0.05]'
              }`}>
              <span className={`w-12 shrink-0 font-mono text-xs tabular-nums ${sel === i ? 'text-cyan-200' : 'text-slate-500'}`}>{x.t}</span>
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: sel === i ? '#22d3ee' : '#334155' }} />
              <span className={`flex-1 font-mono text-xs ${sel === i ? 'text-slate-100' : 'text-slate-400'}`}>{x.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-cyan-400/40 bg-cyan-400/[0.08] p-3.5">
          <div className="font-mono text-sm font-bold text-cyan-300">{e.t} · {e.label}</div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{e.why}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {CLOCKS.map((c, i) => (
              <button key={c.k} type="button" onClick={() => setClock(i)} aria-pressed={clock === i}
                className={`rounded border px-2 py-1 text-[11px] transition-all ${
                  clock === i ? 'border-cyan-400/60 bg-cyan-400/[0.10] text-cyan-100' : 'border-white/10 text-slate-400 hover:text-slate-200'
                }`}>
                {i + 1}
              </button>
            ))}
            <span className="ml-1 self-center font-mono text-[10px] text-slate-500">three clocks, kept synchronised</span>
          </div>
          <div className="text-xs font-bold text-slate-100">{CLOCKS[clock].k}</div>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">{CLOCKS[clock].v}</p>
        </div>
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-slate-400">
        Module 4&apos;s demurrage calculations are only as good as this document. A Statement of Facts that disagrees with the
        terminal&apos;s by two hours is not a paperwork problem — at $45,000 a day it is{' '}
        <strong className="text-slate-200">$3,750</strong>, and it will be argued over for months.
      </p>
    </div>
  )
}
