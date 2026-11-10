'use client'

import { useState } from 'react'

// The trader sits between three separately negotiated documents: a purchase
// contract, a sale contract and a charter party. Every mismatch is their own
// exposure — the back-to-back lesson of the commodity course, at tanker scale.
//
// Drag each regime and watch the leak appear. The point is that the exposure
// is STRUCTURAL: it exists from signature, with nobody at fault, and it can
// only be negotiated away before the vessel sails.

const DAYS_TO_HOURS = 24

export default function BackToBackGap() {
  const [saleLaytime, setSaleLaytime] = useState(96)   // hours allowed by the sale contract
  const [cpLaytime, setCpLaytime] = useState(72)       // hours allowed by the charter party
  const [cpDem, setCpDem] = useState(45_000)           // $/day payable to the owner
  const [saleCap, setSaleCap] = useState(40_000)       // $/day recoverable from the counterparty
  const [norAligned, setNorAligned] = useState(false)

  const laytimeGap = saleLaytime - cpLaytime           // positive = you are short laytime
  const demGap = cpDem - saleCap                       // positive = you leak

  // What a 36-hour overrun actually costs, on these terms.
  const overrun = 36
  const youPay = (overrun / DAYS_TO_HOURS) * cpDem
  const youRecover = (Math.max(0, overrun - Math.max(0, laytimeGap)) / DAYS_TO_HOURS) * saleCap
  const net = youRecover - youPay

  const usd = (n: number) => (n < 0 ? '−$' : '$') + Math.abs(Math.round(n)).toLocaleString('en-US')

  const CHECKS = [
    {
      k: 'The laytime clause',
      v: 'A rider that quietly switches SHINC to SHEX — or back. The printed Asbatankvoy form is a 1977 skeleton; the amendments and rider clauses override it, and the recap overrides both.',
    },
    {
      k: 'The demurrage time bar',
      v: 'Claim plus FULL supporting documents within 90 days, or the claim simply dies. A valid claim lost to a time bar is the cheapest money a counterparty ever makes.',
    },
    {
      k: 'The "safe berth" qualifier',
      v: 'Somebody softened it during the negotiation and nobody re-read it. Safe-berth wording decides who carries the cost when the berth turns out not to be.',
    },
  ]
  const [check, setCheck] = useState(0)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Three documents, negotiated separately — every gap is yours</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        A trader often sits in the middle: bought FOB on one contract, sold CIF on another, chartered on a third. Nobody
        co-ordinated them, so the mismatches are <strong className="text-slate-200">structural</strong> — they exist from
        signature, with nobody at fault, and they can only be closed before the vessel sails.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="mb-2.5 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">Laytime allowed</div>
            {([
              ['Sale contract gives you', saleLaytime, setSaleLaytime, '#34d399'],
              ['Your charter party gives the ship', cpLaytime, setCpLaytime, '#f59e0b'],
            ] as const).map(([label, val, set, color]) => (
              <div key={label} className="mb-2.5">
                <div className="mb-1 flex justify-between font-mono text-[11px]">
                  <span style={{ color }}>{label}</span>
                  <span className="font-bold tabular-nums text-white">{val} hrs</span>
                </div>
                <div className="h-3 rounded bg-white/[0.04]">
                  <div className="h-full rounded" style={{ width: `${(val / 144) * 100}%`, backgroundColor: color, opacity: 0.7 }} />
                </div>
                <input type="range" min={24} max={144} step={6} value={val}
                  onChange={e => (set as (n: number) => void)(parseInt(e.target.value, 10))}
                  aria-label={label} className="mt-1 h-1.5 w-full cursor-pointer" style={{ accentColor: color }} />
              </div>
            ))}
            <div className={`rounded-lg border px-3 py-2 ${laytimeGap > 0 ? 'border-rose-500/45 bg-rose-500/[0.10]' : 'border-emerald-500/40 bg-emerald-500/[0.08]'}`}>
              <span className={`font-mono text-xs font-bold ${laytimeGap > 0 ? 'text-rose-300' : 'text-emerald-300'}`}>
                {laytimeGap > 0
                  ? `${laytimeGap} hrs of demurrage risk is structurally yours`
                  : laytimeGap === 0 ? 'Aligned — the clocks allow the same time' : `${Math.abs(laytimeGap)} hrs of cushion in your favour`}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="mb-2.5 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">Demurrage rate</div>
            {([
              ['You pay the owner', cpDem, setCpDem, '#f59e0b'],
              ['You recover from the sale, capped at', saleCap, setSaleCap, '#34d399'],
            ] as const).map(([label, val, set, color]) => (
              <div key={label} className="mb-2.5">
                <div className="mb-1 flex justify-between font-mono text-[11px]">
                  <span style={{ color }}>{label}</span>
                  <span className="font-bold tabular-nums text-white">{usd(val)}/day</span>
                </div>
                <input type="range" min={20_000} max={90_000} step={1_000} value={val}
                  onChange={e => (set as (n: number) => void)(parseInt(e.target.value, 10))}
                  aria-label={label} className="h-1.5 w-full cursor-pointer" style={{ accentColor: color }} />
              </div>
            ))}
            <div className={`rounded-lg border px-3 py-2 ${demGap > 0 ? 'border-rose-500/45 bg-rose-500/[0.10]' : 'border-emerald-500/40 bg-emerald-500/[0.08]'}`}>
              <span className={`font-mono text-xs font-bold ${demGap > 0 ? 'text-rose-300' : 'text-emerald-300'}`}>
                {demGap > 0 ? `${usd(demGap)}/day leaks out of your book` : 'No rate leak'}
              </span>
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <input type="checkbox" checked={norAligned} onChange={e => setNorAligned(e.target.checked)}
              className="mt-0.5 h-3.5 w-3.5 accent-brand-cyan" />
            <span className="text-xs leading-relaxed text-slate-300">
              The NOR trigger conditions match across all three contracts
              <span className="mt-0.5 block font-mono text-[10px] text-slate-500">
                {norAligned
                  ? 'The clocks at least START together.'
                  : 'They do not — so the two clocks begin at different moments, and the gap is live before anyone has lost an hour.'}
              </span>
            </span>
          </label>
        </div>

        <div className="space-y-2.5">
          <div className={`rounded-xl border p-3.5 font-mono text-xs tabular-nums ${
            net < 0 ? 'border-rose-500/50 bg-rose-500/[0.10]' : 'border-emerald-500/40 bg-emerald-500/[0.08]'
          }`}>
            <div className="eyebrow mb-2 text-slate-300">A 36-hour overrun, on these terms</div>
            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between"><span className="text-slate-500">you pay the owner</span><span className="text-rose-300">{usd(-youPay)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">you recover on the sale</span><span className="text-emerald-300">{usd(youRecover)}</span></div>
              <div className="flex justify-between border-t border-white/15 pt-1">
                <span className="font-bold text-white">net to your book</span>
                <span className={`font-bold ${net < 0 ? 'text-rose-300' : 'text-emerald-300'}`}>{usd(net)}</span>
              </div>
            </div>
            <p className="mt-2 leading-relaxed text-slate-400">
              {net < 0
                ? 'Nobody breached anything. The ship was slow, both contracts worked exactly as written, and the difference landed on you — because you signed three documents that were never compared.'
                : 'Aligned enough that the overrun passes through. This is what the pre-loading check is for.'}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="mb-2 flex flex-wrap gap-1">
              {CHECKS.map((c, i) => (
                <button key={i} type="button" onClick={() => setCheck(i)} aria-pressed={check === i}
                  className={`rounded border px-2 py-1 text-[10px] transition-all ${
                    check === i ? 'border-cyan-400/60 bg-cyan-400/[0.10] text-cyan-100' : 'border-white/10 text-slate-400 hover:text-slate-200'
                  }`}>
                  {i + 1}
                </button>
              ))}
              <span className="ml-1 self-center font-mono text-[10px] text-slate-500">classic catches when you read the combination</span>
            </div>
            <div className="text-xs font-bold text-slate-100">{CHECKS[check].k}</div>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">{CHECKS[check].v}</p>
          </div>

          <div className="rounded-xl border border-amber-500/40 bg-amber-500/[0.08] p-3">
            <p className="text-xs leading-relaxed text-slate-300">
              <strong className="text-amber-200">The pre-loading discipline:</strong> put the three laytime and demurrage regimes
              side by side in one table <strong className="text-white">before the vessel sails</strong> — while alignment can
              still be negotiated. Afterwards it is simply what you agreed to.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
