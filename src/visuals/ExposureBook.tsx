'use client'

import { useState } from 'react'

// "Net exposure" is the most dangerous number on a trading desk, because it is
// a single figure that hides a structure. This visual lets students toggle the
// positions in and out, watch the per-bucket nets, and then shock the book two
// ways — flat, and as a calendar spread. The second shock is an order of
// magnitude bigger than the first on the same "nearly flat" book.

type Pos = { key: string; label: string; bucket: Bucket; tonnes: number; kind: 'physical' | 'forward' | 'hedge' }
type Bucket = 'spot' | 'Jan' | 'Mar'

const BUCKETS: Bucket[] = ['spot', 'Jan', 'Mar']

const POSITIONS: Pos[] = [
  { key: 'stock', label: 'Physical stock, Vietnam Gd2', bucket: 'spot', tonnes: 2000, kind: 'physical' },
  { key: 'sales', label: 'Forward sales to roasters', bucket: 'Jan', tonnes: -1500, kind: 'forward' },
  { key: 'purch', label: 'Forward purchases (Dak Lak suppliers)', bucket: 'Mar', tonnes: 500, kind: 'forward' },
  { key: 'hedge', label: 'Short futures hedge', bucket: 'Jan', tonnes: -800, kind: 'hedge' },
]

const KIND_COLOR: Record<Pos['kind'], string> = {
  physical: '#22d3ee',
  forward: '#f59e0b',
  hedge: '#8b5cf6',
}

const tons = (n: number) => (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n).toLocaleString('en-US') + ' t'
const usd = (n: number) => (n < 0 ? '−' : '+') + '$' + Math.abs(Math.round(n)).toLocaleString('en-US')

export default function ExposureBook() {
  const [on, setOn] = useState<Record<string, boolean>>(
    Object.fromEntries(POSITIONS.map(p => [p.key, true])),
  )
  const [shock, setShock] = useState(100)

  const live = POSITIONS.filter(p => on[p.key])
  const byBucket = (b: Bucket) => live.filter(p => p.bucket === b).reduce((s, p) => s + p.tonnes, 0)
  const net = live.reduce((s, p) => s + p.tonnes, 0)

  // Two ways the market can move against this book.
  const flatPnl = net * shock                       // every bucket moves together
  const spreadPnl = byBucket('spot') * shock        // only the nearby moves

  const maxAbs = Math.max(1, ...BUCKETS.map(b => Math.abs(byBucket(b))))

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">The net-exposure book — do this before any hedge decision</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Exposure is the tonnage whose price you have <strong className="text-slate-200">not yet locked in</strong>. Switch lines in and out
        to see how the book nets — then shock it, and watch why the net alone is not an answer.
      </p>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* the book */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02]">
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wide text-slate-200">The book</span>
            <span className="font-mono text-[11px] text-slate-500">click a line to drop it</span>
          </div>
          {POSITIONS.map(p => (
            <button
              key={p.key} type="button" onClick={() => setOn(s => ({ ...s, [p.key]: !s[p.key] }))}
              aria-pressed={on[p.key]}
              className={`flex w-full items-baseline justify-between gap-3 border-b border-white/[0.05] px-3 py-2.5 text-left transition-all ${
                on[p.key] ? 'hover:bg-white/[0.04]' : 'opacity-35 hover:opacity-60'
              }`}
            >
              <span className="flex items-baseline gap-2">
                <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: KIND_COLOR[p.kind] }} aria-hidden="true" />
                <span>
                  <span className="text-sm text-slate-200">{p.label}</span>
                  <span className="block font-mono text-[11px] text-slate-500">{p.bucket} bucket · {p.kind}</span>
                </span>
              </span>
              <span className={`font-mono text-sm font-bold tabular-nums ${p.tonnes >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                {tons(p.tonnes)}
              </span>
            </button>
          ))}
          <div className="flex items-baseline justify-between px-3 py-2.5" style={{ borderTop: '3px double rgba(255,255,255,0.35)' }}>
            <span className="font-mono text-xs font-bold uppercase tracking-wide text-slate-300">Net exposure</span>
            <span className="font-mono text-sm font-bold tabular-nums text-cyan-300">
              {tons(net)} {net > 0 ? 'long' : net < 0 ? 'short' : 'flat'}
            </span>
          </div>
        </div>

        {/* per-bucket structure */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <div className="mb-3 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
            But netting hides the structure
          </div>
          <div className="space-y-3">
            {BUCKETS.map(b => {
              const v = byBucket(b)
              const pct = (Math.abs(v) / maxAbs) * 50
              return (
                <div key={b}>
                  <div className="mb-1 flex justify-between font-mono text-xs">
                    <span className="text-slate-400">{b}</span>
                    <span className={`font-bold tabular-nums ${v >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{tons(v)}</span>
                  </div>
                  {/* zero-centred bar: short left, long right */}
                  <div className="relative h-3 rounded bg-white/[0.04]">
                    <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
                    <div
                      className={`absolute inset-y-0 rounded ${v >= 0 ? 'bg-emerald-400/70' : 'bg-rose-400/70'}`}
                      style={v >= 0 ? { left: '50%', width: `${pct}%` } : { right: '50%', width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <p className="mt-3 border-t border-white/10 pt-2.5 text-xs leading-relaxed text-slate-400">
            This book is <strong className="text-slate-200">long spot, short Jan, long Mar</strong>. Measure{' '}
            <strong className="text-slate-200">per bucket first, net second</strong> — the net is a summary, not a risk report.
          </p>
        </div>
      </div>

      {/* the two shocks */}
      <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wide text-slate-200">Shock the book</span>
          <span className="font-mono text-xs text-slate-400">
            move size <strong className="text-white">${shock}/t</strong>
          </span>
        </div>
        <input
          type="range" min={10} max={300} step={10} value={shock}
          onChange={e => setShock(parseFloat(e.target.value))}
          aria-label="Shock size in dollars per tonne"
          className="mb-3 h-1.5 w-full cursor-pointer accent-brand-cyan"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
            <div className="font-mono text-[11px] uppercase tracking-wide text-slate-400">Flat move — every bucket together</div>
            <div className={`mt-1 font-mono text-2xl font-bold tabular-nums ${flatPnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
              {usd(flatPnl)}
            </div>
            <div className="font-mono text-[11px] text-slate-500">net {tons(net)} × ${shock}</div>
          </div>
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/[0.08] p-3">
            <div className="font-mono text-[11px] uppercase tracking-wide text-amber-300">Calendar spread — only spot moves</div>
            <div className={`mt-1 font-mono text-2xl font-bold tabular-nums ${spreadPnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
              {usd(spreadPnl)}
            </div>
            <div className="font-mono text-[11px] text-slate-500">spot {tons(byBucket('spot'))} × ${shock}</div>
          </div>
        </div>
        <p className="mt-2.5 text-xs leading-relaxed text-slate-400">
          {Math.abs(spreadPnl) > Math.abs(flatPnl) ? (
            <>
              Same book, same day: the spread move is{' '}
              <strong className="text-amber-300">
                {(Math.abs(spreadPnl) / Math.max(Math.abs(flatPnl), 1)).toFixed(1)}×
              </strong>{' '}
              the flat move. A book can be nearly flat on net and still be carrying a large position — drop the hedge line and the
              net changes, but the <em>spread</em> risk barely notices.
            </>
          ) : (
            <>With these lines switched off the structure has collapsed into the net. Switch the physical stock back on to see the
            spread risk reappear.</>
          )}
        </p>
      </div>
    </div>
  )
}
