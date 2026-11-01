'use client'

import { useState } from 'react'

// The conversion kit as a catalogue of units: what goes in, what comes out,
// and why a refiner spent the money. Grouped by the four verbs the content
// uses — treat, convert, modify, combine — plus blending at the end.
//
// Distinct from the complexity-tier visual that follows: that one asks which
// units a refinery HAS, this one asks what each unit DOES.

type Verb = 'treat' | 'convert' | 'modify' | 'combine' | 'blend'

const VERBS: { key: Verb; label: string; color: string; gist: string }[] = [
  { key: 'treat', label: 'Treat', color: '#34d399', gist: 'Take the sulphur out, because the specification and the law say so.' },
  { key: 'convert', label: 'Convert', color: '#f43f5e', gist: 'Break big molecules into small ones. This is where the money is.' },
  { key: 'modify', label: 'Modify', color: '#a78bfa', gist: 'Rearrange molecules to raise octane without changing their size.' },
  { key: 'combine', label: 'Combine', color: '#f59e0b', gist: 'Build bigger molecules out of light gases that would otherwise be flared or sold cheap.' },
  { key: 'blend', label: 'Blend', color: '#22d3ee', gist: 'Mix the components to hit an exact specification — the last step, and the one that actually makes the product.' },
]

type Unit = {
  name: string
  short: string
  verb: Verb
  feed: string
  out: string
  how: string
  why: string
}

const UNITS: Unit[] = [
  {
    name: 'Hydrotreater / desulphuriser', short: 'HDS', verb: 'treat',
    feed: 'Any sulphur-bearing cut — naphtha, kero, gas oil',
    out: 'The same cut, on specification',
    how: 'Hydrogen over a catalyst strips sulphur out as hydrogen sulphide, which is then recovered as elemental sulphur.',
    why: 'Not optional. Sulphur corrodes engines, poisons catalysts and is capped by law — road diesel in Europe is limited to 10 ppm. A refinery without hydrotreating cannot sell into a modern market, and cannot run sour crude at all.',
  },
  {
    name: 'Fluid Catalytic Cracker', short: 'FCC', verb: 'convert',
    feed: 'Heavy vacuum gas oil',
    out: 'Mostly gasoline, plus LPG and light cycle oil',
    how: 'A fluidised catalyst at around 500 °C cracks long chains apart. The catalyst circulates continuously and is burnt clean in the regenerator.',
    why: 'The gasoline-maker, and the reason American refineries look the way they do. An FCC turns a low-value heavy cut into the highest-volume product on the US barrel.',
  },
  {
    name: 'Hydrocracker', short: 'HCU', verb: 'convert',
    feed: 'Heavy gas oil and residue',
    out: 'Mostly middle distillates — diesel and jet',
    how: 'Cracking under high hydrogen pressure, so the fragments are saturated as they form rather than left unstable.',
    why: 'The diesel-maker, and the reason European refineries look different from American ones. Expensive — hydrogen is costly — but it produces clean middle distillate directly, with the sulphur already removed.',
  },
  {
    name: 'Visbreaker', short: 'VBU', verb: 'convert',
    feed: 'Vacuum residue',
    out: 'A thinner residue, some gas oil and gas',
    how: 'Mild thermal cracking. No catalyst at all — just heat and time.',
    why: 'The cheap option. It does not convert residue into light product so much as make it pourable enough to sell as fuel oil with less cutter stock. A refinery buys a visbreaker when it cannot justify a coker.',
  },
  {
    name: 'Coker', short: 'DCU', verb: 'convert',
    feed: 'Vacuum residue — the bottom of the barrel',
    out: 'Light products, plus solid petroleum coke',
    how: 'Severe thermal cracking taken to completion: everything that can be driven off is, and what is left is carbon.',
    why: 'The deepest conversion there is. A coker destroys the residue entirely, which is what lets a refinery run the cheapest, heaviest, sourest crude on the market and still produce a light slate. It is also what makes Arab Light worth running.',
  },
  {
    name: 'Catalytic reformer', short: 'CRU', verb: 'modify',
    feed: 'Heavy naphtha',
    out: 'High-octane reformate, and hydrogen',
    how: 'Catalyst rearranges paraffins into aromatics and naphthenes. The molecules stay the same size; their shape changes.',
    why: 'Straight-run naphtha has nowhere near the octane a modern engine needs. The reformer fixes that — and as a by-product it makes the hydrogen the hydrotreaters and hydrocracker consume.',
  },
  {
    name: 'Isomerisation', short: 'ISOM', verb: 'modify',
    feed: 'Light naphtha',
    out: 'Branched isomers, higher octane',
    how: 'Straight chains are rearranged into branched ones over a catalyst.',
    why: 'Light naphtha is too light for the reformer and too low-octane for the gasoline pool. Isomerisation rescues it.',
  },
  {
    name: 'Alkylation', short: 'ALKY', verb: 'combine',
    feed: 'Light olefins and isobutane from the FCC',
    out: 'Alkylate — high-octane, low-vapour-pressure gasoline blendstock',
    how: 'An acid catalyst joins small molecules into larger branched ones.',
    why: 'The premium blendstock. Alkylate raises octane without raising volatility or aromatics, which is exactly what tightening gasoline specifications demand.',
  },
  {
    name: 'The blender', short: 'MIX', verb: 'blend',
    feed: 'Every component stream in the refinery',
    out: 'The finished products, on specification and not a point better',
    how: 'Components are mixed to hit octane, sulphur, vapour pressure, cloud point, density and a dozen other properties at once.',
    why: 'Giveaway is the enemy. Every property better than specification is value handed to the customer for free, so blending to exactly the spec — and no further — is where a refinery quietly makes or loses its last dollar a barrel.',
  },
]

export default function ConversionUnits() {
  const [sel, setSel] = useState('FCC')
  const u = UNITS.find(x => x.short === sel)!
  const verb = VERBS.find(v => v.key === u.verb)!

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">The conversion kit — what each unit does to the barrel</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        Straight-run cuts are rarely the final product. Everything that happens next is one of five verbs — and the deeper the
        conversion kit, the <strong className="text-slate-200">cheaper and heavier</strong> the crude a refinery can afford to run.
      </p>

      <div className="mb-3 space-y-1.5">
        {VERBS.map(v => (
          <div key={v.key} className="flex flex-wrap items-center gap-1.5">
            <span className="w-[72px] shrink-0 font-mono text-[10px] uppercase tracking-wide" style={{ color: v.color }}>{v.label}</span>
            {UNITS.filter(x => x.verb === v.key).map(x => (
              <button
                key={x.short} type="button" onClick={() => setSel(x.short)}
                aria-pressed={sel === x.short}
                className={`rounded-full border px-2.5 py-1 font-mono text-[11px] font-bold transition-all ${
                  sel === x.short ? 'bg-white/[0.08] text-white' : 'border-white/10 text-slate-400 hover:text-slate-200'
                }`}
                style={sel === x.short ? { borderColor: v.color + '99' } : undefined}
              >
                {x.short}
              </button>
            ))}
            <span className="ml-1 hidden text-[11px] text-slate-500 lg:inline">{v.gist}</span>
          </div>
        ))}
      </div>

      <div className="rounded-xl border p-3.5" style={{ borderColor: verb.color + '55', backgroundColor: verb.color + '0d' }}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-mono text-sm font-bold" style={{ color: verb.color }}>{u.name}</span>
          <span className="rounded px-2 py-0.5 font-mono text-[10px] uppercase" style={{ backgroundColor: verb.color + '22', color: verb.color }}>
            {verb.label}
          </span>
        </div>

        {/* feed → unit → out */}
        <div className="mt-2.5 flex flex-wrap items-stretch gap-2">
          <div className="min-w-[150px] flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
            <div className="font-mono text-[10px] uppercase tracking-wide text-slate-500">Feed in</div>
            <div className="text-xs text-slate-200">{u.feed}</div>
          </div>
          <div className="flex items-center font-mono text-lg" style={{ color: verb.color }}>→</div>
          <div className="min-w-[150px] flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
            <div className="font-mono text-[10px] uppercase tracking-wide text-slate-500">Product out</div>
            <div className="text-xs text-slate-200">{u.out}</div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <div className="mb-1 font-mono text-[10px] uppercase tracking-wide text-slate-500">How it works</div>
            <p className="text-xs leading-relaxed text-slate-300">{u.how}</p>
          </div>
          <div>
            <div className="mb-1 font-mono text-[10px] uppercase tracking-wide text-slate-500">Why a refiner paid for it</div>
            <p className="text-xs leading-relaxed text-slate-300">{u.why}</p>
          </div>
        </div>
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-slate-400">
        Read the three cracking units together — <strong className="text-slate-200">visbreaker, hydrocracker, coker</strong> — and
        you have the whole economics of refinery investment. Each one costs more than the last and each one lets you buy a cheaper
        barrel. A refiner is not buying equipment; it is buying access to a wider slice of the crude market.
      </p>
    </div>
  )
}
