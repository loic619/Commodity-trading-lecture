'use client'

import { useState } from 'react'

// A WS level is only meaningful inside its size class — the standard ship is
// 75,000 dwt, so a 30,000 t parcel on an MR naturally trades at WS levels a
// VLCC would never see. Put both back into $/t all-in and they become
// comparable, which is the reflex the section asks for.

type Ship = {
  key: string
  name: string
  cargo: number
  flat: number
  ws: number
  portBill: number
  color: string
}

const SHIPS: Ship[] = [
  { key: 'vlcc', name: 'VLCC', cargo: 270_000, flat: 4.90, ws: 55, portBill: 220_000, color: '#22d3ee' },
  { key: 'suez', name: 'Suezmax', cargo: 130_000, flat: 6.90, ws: 85, portBill: 180_000, color: '#34d399' },
  { key: 'afra', name: 'Aframax', cargo: 80_000, flat: 7.60, ws: 120, portBill: 150_000, color: '#a78bfa' },
  { key: 'mr', name: 'MR (products)', cargo: 30_000, flat: 11.40, ws: 195, portBill: 150_000, color: '#f59e0b' },
]

const DIFFS = [
  {
    k: 'Economies of scale cut the other way',
    v: 'The Worldscale standard ship is 75,000 dwt. Anything smaller carries a structurally higher WS percentage for the same voyage — WS150–250 on an MR against WS40–80 on a VLCC. Same book, different neighbourhoods: comparing the two numbers directly is meaningless.',
  },
  {
    k: 'Lumpsum and $/t quotes take over',
    v: 'Where voyages are fully defined — short-haul products, intra-Med, coasters — the market simply quotes a lumpsum or a $/t rate. In chemicals it quotes $/t by parcel under COAs and does not use Worldscale at all.',
  },
  {
    k: 'Minimum quantity and overage',
    v: 'Small-tanker fixtures habitually carry a minimum quantity with overage: tonnes above it move at a reduced rate, typically 50%. The last tonnes cost the owner almost nothing to carry, so they are priced accordingly.',
  },
  {
    k: 'Fixed differentials bite harder',
    v: 'A $150,000 port bill spread over 30,000 t is five times the $/t of the same bill on 150,000 t. Every fixed cost in the voyage is a bigger number per tonne on a small ship — which is most of why the WS levels differ at all.',
  },
]

export default function SmallTankerScale() {
  const [sel, setSel] = useState('afra')
  const [showPort, setShowPort] = useState(true)
  const [diff, setDiff] = useState(0)
  const s = SHIPS.find(x => x.key === sel)!

  const perT = (x: Ship) => x.flat * (x.ws / 100) + (showPort ? x.portBill / x.cargo : 0)
  const maxWs = Math.max(...SHIPS.map(x => x.ws))
  const maxPerT = Math.max(...SHIPS.map(perT))

  const usd = (n: number) => '$' + n.toFixed(2)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">A WS level is meaningful only within its size class</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Worldscale was built for the crude trades, and the standard ship is 75,000 dwt. The smaller and cleaner the ship, the less
        pure the system — so <strong className="text-slate-200">WS195 and WS55 can be the same market</strong>. The reflex to
        build: put both back into $/t all-in for your parcel size before you compare anything.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
            The quoted WS percentage
          </div>
          <div className="space-y-2.5">
            {SHIPS.map(x => (
              <button key={x.key} type="button" onClick={() => setSel(x.key)} aria-pressed={sel === x.key} className="block w-full text-left">
                <div className="mb-1 flex justify-between font-mono text-[11px]">
                  <span style={{ color: sel === x.key ? x.color : '#94a3b8' }}>{x.name}</span>
                  <span className="tabular-nums text-slate-300">WS{x.ws}</span>
                </div>
                <div className="h-3 rounded bg-white/[0.04]">
                  <div className="h-full rounded" style={{ width: `${(x.ws / maxWs) * 100}%`, backgroundColor: x.color, opacity: sel === x.key ? 0.9 : 0.45 }} />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 border-t border-white/10 pt-3">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wide text-slate-200">The same quotes in $/t</span>
              <label className="flex cursor-pointer items-center gap-1.5">
                <input type="checkbox" checked={showPort} onChange={e => setShowPort(e.target.checked)}
                  className="h-3.5 w-3.5 accent-brand-cyan" />
                <span className="font-mono text-[10px] text-slate-400">include the port bill</span>
              </label>
            </div>
            <div className="space-y-2.5">
              {SHIPS.map(x => (
                <div key={x.key}>
                  <div className="mb-1 flex justify-between font-mono text-[11px]">
                    <span style={{ color: sel === x.key ? x.color : '#94a3b8' }}>{x.name}</span>
                    <span className="font-bold tabular-nums text-white">{usd(perT(x))}/t</span>
                  </div>
                  <div className="h-3 rounded bg-white/[0.04]">
                    <div className="h-full rounded" style={{ width: `${(perT(x) / maxPerT) * 100}%`, backgroundColor: x.color, opacity: sel === x.key ? 0.9 : 0.45 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-xl border p-3.5" style={{ borderColor: s.color + '55', backgroundColor: s.color + '0d' }}>
            <div className="font-mono text-sm font-bold" style={{ color: s.color }}>{s.name}</div>
            <div className="mt-2 space-y-1 font-mono text-xs tabular-nums text-slate-300">
              <div className="flex justify-between"><span className="text-slate-500">cargo</span><span>{s.cargo.toLocaleString('en-US')} t</span></div>
              <div className="flex justify-between"><span className="text-slate-500">flat rate × WS{s.ws}</span><span>{usd(s.flat * s.ws / 100)}/t</span></div>
              <div className="flex justify-between"><span className="text-slate-500">port bill {usd(s.portBill / 1000).replace('$', '$')}k ÷ cargo</span><span>{usd(s.portBill / s.cargo)}/t</span></div>
              <div className="flex justify-between border-t border-white/15 pt-1"><span className="font-bold text-white">all-in</span><span className="font-bold text-white">{usd(perT(s))}/t</span></div>
            </div>
            <p className="mt-2.5 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-300">
              Untick the port bill and watch the small ships improve most. A{' '}
              <strong className="text-white">${(SHIPS[3].portBill / 1000).toFixed(0)}k</strong> port bill is{' '}
              <strong className="text-white">{usd(SHIPS[3].portBill / SHIPS[3].cargo)}/t</strong> on an MR and only{' '}
              <strong className="text-white">{usd(SHIPS[0].portBill / SHIPS[0].cargo)}/t</strong> on a VLCC — the same cost,
              five times the weight per tonne.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="mb-2 flex flex-wrap gap-1">
              {DIFFS.map((x, i) => (
                <button key={i} type="button" onClick={() => setDiff(i)} aria-pressed={diff === i}
                  className={`rounded border px-2 py-1 text-[10px] transition-all ${
                    diff === i ? 'border-cyan-400/60 bg-cyan-400/[0.10] text-cyan-100' : 'border-white/10 text-slate-400 hover:text-slate-200'
                  }`}>
                  {i + 1}
                </button>
              ))}
              <span className="ml-1 self-center font-mono text-[10px] text-slate-500">four ways the system bends</span>
            </div>
            <div className="text-xs font-bold text-slate-100">{DIFFS[diff].k}</div>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">{DIFFS[diff].v}</p>
          </div>
        </div>
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-slate-400">
        <strong className="text-slate-200">WS is a language, not a price.</strong> Two quotes are only comparable once both are in
        $/t all-in for your parcel — and on the biggest ship that number is a fraction of the smallest, which is the whole reason
        the market keeps building them bigger.
      </p>
    </div>
  )
}
