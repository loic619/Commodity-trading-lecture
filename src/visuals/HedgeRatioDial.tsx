'use client'

import { useState } from 'react'

// The coverage ratio, shown as what it actually buys you. Students treat "100%
// hedged" as a synonym for "safe"; the point here is that the dial trades one
// risk for another — flat-price protection against opportunity cost — and that
// the basis risk underneath never moves at all.

const VOLUME = 1000      // t of physical the desk owns
const LOT = 10           // t per London Robusta lot
const BASIS_RISK = 30    // $/t typical adverse differential move — unaffected by the ratio

export default function HedgeRatioDial() {
  const [ratio, setRatio] = useState(100)
  const [move, setMove] = useState(-300)

  const hedged = (VOLUME * ratio) / 100
  const lots = Math.round(hedged / LOT)
  const open = VOLUME - hedged

  // P&L on a flat-price move: the physical revalues on everything, the short
  // futures offsets only the hedged part.
  const physicalPnl = VOLUME * move
  const futuresPnl = -hedged * move
  const flatPnl = physicalPnl + futuresPnl        // = open * move
  const basisPnl = -hedged * BASIS_RISK           // long the basis on the hedged portion

  const usd = (n: number) => (n < 0 ? '−' : '+') + '$' + Math.abs(Math.round(n)).toLocaleString('en-US')

  // Where the ratio sits against the commercial mandate.
  const verdict = ratio < 50
    ? { text: 'Below any commercial mandate — this is a price view wearing a hedge costume.', color: '#f43f5e' }
    : ratio < 70
      ? { text: 'Light. Defensible only with an explicit, approved bullish view on file.', color: '#f59e0b' }
      : ratio <= 100
        ? { text: 'The commercial range. Desks typically mandate 70–100% on committed volume.', color: '#34d399' }
        : { text: 'Over-hedged — the excess lots are an outright short position, not protection.', color: '#f43f5e' }

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">The coverage ratio — 1,000 t of physical Robusta</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        The hedge ratio is the share of your exposure you choose to cover.{' '}
        <strong className="text-slate-200">Hedge ratio = lots × lot size ÷ physical volume.</strong> Move the dial and watch what each
        setting actually buys — and what it leaves behind.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.1fr]">
        {/* the dial */}
        <div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xs uppercase tracking-wide text-slate-400">Hedge ratio</span>
              <span className="font-mono text-3xl font-bold tabular-nums text-cyan-300">{ratio}%</span>
            </div>
            <input
              type="range" min={0} max={130} step={5} value={ratio}
              onChange={e => setRatio(parseFloat(e.target.value))}
              aria-label="Hedge ratio, percent of physical volume"
              className="mt-2 h-2 w-full cursor-pointer accent-brand-cyan"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-500">
              <span>0% · outright</span><span>100% · fully covered</span><span>130%</span>
            </div>

            {/* covered vs open bar */}
            <div className="mt-4">
              <div className="mb-1 flex justify-between font-mono text-[11px]">
                <span className="text-cyan-300">covered {hedged.toLocaleString('en-US')} t · {lots} lots</span>
                <span className={open === 0 ? 'text-slate-500' : 'text-rose-300'}>
                  {open >= 0 ? `open ${open.toLocaleString('en-US')} t` : `over ${Math.abs(open).toLocaleString('en-US')} t`}
                </span>
              </div>
              <div className="flex h-4 overflow-hidden rounded bg-rose-500/25" aria-hidden="true">
                <div className="h-full bg-cyan-400/70" style={{ width: `${Math.min(ratio, 100)}%` }} />
                {ratio > 100 && <div className="h-full bg-rose-500/80" style={{ width: `${Math.min(ratio - 100, 30)}%` }} />}
              </div>
            </div>

            <p className="mt-3 border-t border-white/10 pt-2.5 text-xs leading-relaxed" style={{ color: verdict.color }}>
              {verdict.text}
            </p>
          </div>

          <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="mb-1 flex justify-between font-mono text-xs">
              <span className="text-slate-400">Flat-price move ($/t)</span>
              <span className="font-bold tabular-nums text-white">{move >= 0 ? '+' : '−'}${Math.abs(move)}</span>
            </div>
            <input
              type="range" min={-600} max={600} step={25} value={move}
              onChange={e => setMove(parseFloat(e.target.value))}
              aria-label="Flat price move in dollars per tonne"
              className="h-1.5 w-full cursor-pointer accent-brand-blue"
            />
          </div>
        </div>

        {/* what it buys */}
        <div className="space-y-2.5">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-xs tabular-nums">
            <div className="eyebrow mb-2">P&amp;L on a {move >= 0 ? '+' : '−'}${Math.abs(move)}/t move</div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Physical, 1,000 t</span>
                <span className={physicalPnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{usd(physicalPnl)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Short futures, {lots} lots</span>
                <span className={futuresPnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{usd(futuresPnl)}</span>
              </div>
              <div className="flex justify-between border-t border-white/15 pt-1.5">
                <span className="font-bold text-white">Net flat-price P&amp;L</span>
                <span className={`font-bold ${flatPnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{usd(flatPnl)}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                = the {open >= 0 ? 'open' : 'over-hedged'} {Math.abs(open).toLocaleString('en-US')} t × ${Math.abs(move)} — the covered
                tonnage nets to zero by construction
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/40 bg-amber-500/[0.08] p-3 font-mono text-xs tabular-nums">
            <div className="eyebrow mb-1 text-amber-300">What the dial does NOT touch</div>
            <div className="flex justify-between">
              <span className="text-slate-300">Basis risk on the hedged tonnage, at −${BASIS_RISK}/t</span>
              <span className="font-bold text-rose-300">{usd(basisPnl)}</span>
            </div>
            <p className="mt-1.5 leading-relaxed text-slate-400">
              Hedging converts flat-price risk into basis risk — it does not remove risk. At 100% you have the{' '}
              <strong className="text-amber-200">most</strong> basis exposure, not the least.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="mb-1.5 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">The trade-off, in one line each</div>
            <ul className="space-y-1.5 text-xs leading-relaxed text-slate-300">
              <li><strong className="text-cyan-300">100%</strong> — full flat-price protection, full basis risk, and full opportunity cost if the market rallies.</li>
              <li><strong className="text-amber-300">50%</strong> — partial protection, and a deliberate speculative position in the other half.</li>
              <li><strong className="text-rose-300">0%</strong> — outright. Not acceptable for a desk with real physical commitments.</li>
              <li><strong className="text-slate-200">Above 100%</strong> — the excess is a naked short. This is the error the next section fixes with a proper ratio.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
