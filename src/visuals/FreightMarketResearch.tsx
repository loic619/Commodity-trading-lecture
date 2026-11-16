'use client'

import { useState } from 'react'

// The freight market's true unit is the TONNE-MILE, and the point students
// miss is that demand can tighten without a single extra barrel moving. Flip
// the destination of the same West African cargo and watch ship demand jump
// because the voyage got longer.
//
// Then the supply side: the position list is the local supply that actually
// prices your cargo, not the world fleet.

type Route = { key: string; name: string; nm: number; note: string }

const ROUTES: Route[] = [
  { key: 'ukc', name: 'Bonny → Rotterdam', nm: 4_300, note: 'The traditional Atlantic flow. Short, well served, and the route most West African crude used to take.' },
  { key: 'usg', name: 'Bonny → Houston', nm: 6_100, note: 'Across the Atlantic. Longer, so the same cargo occupies the ship roughly 40% longer than a European discharge.' },
  { key: 'asia', name: 'Bonny → Ningbo', nm: 11_400, note: 'Round the Cape to China — the flow that re-shaped the Atlantic tanker market. The same barrels, two and a half times the ship-days.' },
]

const CARGO_MT = 1.0 // million tonnes a month on the route

type Ship = { name: string; opens: string; when: number; approvals: string; last: string; fit: boolean; why: string }

const LIST: Ship[] = [
  { name: 'M/T Meridian', opens: 'Rotterdam', when: 8, approvals: 'Shell · BP · Total', last: 'crude / crude / fuel oil', fit: true, why: 'Opens four days before the laycan and has the approvals. A real candidate — though the fuel-oil cargo three voyages back will come up in vetting.' },
  { name: 'M/T Cape Harrier', opens: 'Lome', when: 11, approvals: 'Shell · Exxon', last: 'crude / crude / crude', fit: true, why: 'Opens close to the load port with a clean crude history. The strongest candidate on the list, and the owner will know it.' },
  { name: 'M/T Astrid', opens: 'Houston', when: 9, approvals: 'BP · Total', last: 'crude / crude / crude', fit: false, why: 'Opens on the wrong side of the Atlantic: she cannot ballast across in time for a 12–14 March laycan. On the list, but not in your market.' },
  { name: 'M/T Pelagos', opens: 'Skaw', when: 16, approvals: 'Shell · BP · Total · Exxon', last: 'crude / crude / crude', fit: false, why: 'Perfect ship, wrong dates — she opens after your cancelling date. A ship that cannot make the laycan is not supply, however good she looks.' },
]

export default function FreightMarketResearch() {
  const [route, setRoute] = useState('ukc')
  const [fleetDelta, setFleetDelta] = useState(0)
  const [sel, setSel] = useState(0)

  const r = ROUTES.find(x => x.key === route)!
  const base = ROUTES[0]
  // Tonne-miles, in millions, per month on this flow.
  const tm = CARGO_MT * r.nm
  const vsBase = tm / (CARGO_MT * base.nm)

  const candidates = LIST.filter(s => s.fit).length + fleetDelta
  const tightness = candidates <= 1 ? { label: 'Owners’ market', color: '#f43f5e', note: 'One ship that can do your dates means the owner knows they are the only ship that can do your dates. Expect the WS level to reflect it.' }
    : candidates <= 3 ? { label: 'Balanced', color: '#f59e0b', note: 'A handful of real candidates. The negotiation is a negotiation rather than a queue.' }
      : { label: 'Charterers’ market', color: '#34d399', note: 'Enough ships competing that the list itself does your negotiating. Quote wide and let them come to you.' }

  const maxNm = Math.max(...ROUTES.map(x => x.nm))

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">The market&apos;s unit is the tonne-mile, not the tonne</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Freight demand is cargo volume <strong className="text-slate-200">× distance</strong>. That is why a shifted arbitrage or
        a closed canal tightens the ship market without a single extra barrel being produced — the same oil simply occupies a ship
        for longer.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
            Same 1 million tonnes a month, three destinations
          </div>
          <div className="space-y-2.5">
            {ROUTES.map(x => (
              <button key={x.key} type="button" onClick={() => setRoute(x.key)} aria-pressed={route === x.key} className="block w-full text-left">
                <div className="mb-1 flex justify-between font-mono text-[11px]">
                  <span className={route === x.key ? 'text-cyan-300' : 'text-slate-400'}>{x.name}</span>
                  <span className="tabular-nums text-slate-300">{x.nm.toLocaleString('en-US')} nm</span>
                </div>
                <div className="h-3.5 rounded bg-white/[0.04]">
                  <div className="h-full rounded bg-cyan-400" style={{ width: `${(x.nm / maxNm) * 100}%`, opacity: route === x.key ? 0.85 : 0.4 }} />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-3 rounded-lg border border-cyan-400/40 bg-cyan-400/[0.08] p-3">
            <div className="font-mono text-[11px] uppercase tracking-wide text-cyan-300">Tonne-miles generated</div>
            <div className="font-mono text-2xl font-bold tabular-nums text-white">
              {(tm / 1000).toFixed(1)}<span className="text-sm font-normal text-slate-400"> bn tonne-miles / month</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
              {route === 'ukc'
                ? 'The baseline. Now switch the destination — the barrels do not change, only where they go.'
                : <><strong className="text-cyan-200">{vsBase.toFixed(2)}×</strong> the ship demand of the European route, from
                  exactly the same production. This is how a trading decision taken on a differential becomes a freight rally.</>}
            </p>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">{r.note}</p>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
              The position list — your actual supply
            </div>
            <div className="space-y-1">
              {LIST.map((s, i) => (
                <button
                  key={s.name} type="button" onClick={() => setSel(i)}
                  aria-pressed={sel === i}
                  className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left transition-all ${
                    sel === i ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'
                  } ${s.fit ? '' : 'opacity-45'}`}
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${s.fit ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  <span className="flex-1 text-xs text-slate-200">{s.name}</span>
                  <span className="shrink-0 font-mono text-[10px] text-slate-500">{s.opens} · {s.when} Mar</span>
                </button>
              ))}
            </div>
            <p className="mt-2 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-300">{LIST[sel].why}</p>
            <p className="mt-1.5 font-mono text-[10px] text-slate-500">
              approvals: {LIST[sel].approvals} · last 3: {LIST[sel].last}
            </p>
          </div>

          <div className="rounded-xl border p-3.5" style={{ borderColor: tightness.color + '66', backgroundColor: tightness.color + '12' }}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-mono text-sm font-bold" style={{ color: tightness.color }}>{tightness.label}</span>
              <span className="font-mono text-xs text-slate-400">{Math.max(0, candidates)} ship{candidates === 1 ? '' : 's'} that can do your dates</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{tightness.note}</p>
            <input type="range" min={-2} max={4} step={1} value={fleetDelta}
              onChange={e => setFleetDelta(parseInt(e.target.value, 10))}
              aria-label="Ships added to or removed from the list"
              className="mt-2 h-1.5 w-full cursor-pointer" style={{ accentColor: tightness.color }} />
            <p className="mt-1 font-mono text-[10px] text-slate-500">
              drag to add or remove candidates — newbuildings, scrapping, ships absorbed into floating storage or sanctioned trades
            </p>
          </div>
        </div>
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-slate-400">
        The practical output of research is three numbers before you quote: <strong className="text-slate-200">the last done</strong>{' '}
        (a comparable fixture, from Baltic assessments — TD3C, TD20, TC2 — and broker reports),{' '}
        <strong className="text-slate-200">the list</strong> (how many ships CAN do your dates, not how many exist), and{' '}
        <strong className="text-slate-200">the direction</strong> (is the list shortening?). Beyond that sits the forward market:
        FFAs price future months and let both sides hedge freight like any other commodity leg.
      </p>
    </div>
  )
}
