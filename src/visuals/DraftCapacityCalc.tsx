'use client'

import { useState } from 'react'

// Capacity & draft exercise: how much can the ship actually lift TODAY?
// Three constraints compete — the loadline (zone + season), the water density
// (fresh water allowance), and the physical depth at the berth (charts + tide).
// The deepest LEGAL and PHYSICAL draft governs, and TPC converts every lost
// centimetre into lost tonnes.
const SHIP = {
  name: 'M/T Course Aframax',
  summerDraft: 14.9,     // m, salt water
  tpc: 90,               // tonnes per centimetre immersion
  displacement: 135_000, // t at summer marks
  cargoAtSummer: 100_000, // t of cargo when floating at summer marks in SW
}
const FWA_MM = SHIP.displacement / (4 * SHIP.tpc) // 375 mm — the classic approximation
const UKC = 1.0 // m under-keel clearance the port requires

type Zone = 'tropical' | 'summer' | 'winter'
const ZONE_ADJ: Record<Zone, number> = {
  tropical: SHIP.summerDraft / 48,  // may load 1/48 of summer draft DEEPER
  summer: 0,
  winter: -SHIP.summerDraft / 48,   // must stay 1/48 SHALLOWER
}

const fm = (v: number, d = 2) => v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
const ft = (v: number) => `${v < 0 ? '−' : '+'}${Math.abs(Math.round(v)).toLocaleString('en-US')} t`

export default function DraftCapacityCalc() {
  const [zone, setZone] = useState<Zone>('summer')
  const [rho, setRho] = useState(1.025)   // dock water density
  const [depth, setDepth] = useState(15.5) // charted depth at the berth, m below datum
  const [tide, setTide] = useState(1.0)    // height of tide at sailing, m

  // 1) The LEGAL limit: loadline draft for the zone, plus the dock-water
  //    allowance (the ship may submerge her marks by DWA — she rises to them
  //    on reaching salt water).
  const dwaMm = FWA_MM * (1.025 - rho) / 0.025
  const legalDraft = SHIP.summerDraft + ZONE_ADJ[zone] + dwaMm / 1000
  // 2) The PHYSICAL limit: charted depth + tide − required under-keel clearance
  const portDraft = depth + tide - UKC
  const governing = Math.min(legalDraft, portDraft)
  const portGoverns = portDraft < legalDraft

  // Every centimetre off the summer-SW baseline is TPC tonnes of cargo
  const deltaT = (governing - SHIP.summerDraft) * 100 * SHIP.tpc
  const maxCargo = Math.max(0, SHIP.cargoAtSummer + deltaT)

  // Plimsoll drawing: marks painted on the hull side. A deeper permitted
  // draft sits HIGHER up the hull (the ship may sink further), so larger
  // draft → smaller y. Summer mark anchored mid-panel.
  const yOf = (draft: number) => 88 - (draft - SHIP.summerDraft) * 60 // 60 px per metre
  const marks: { key: string; label: string; draft: number; color: string }[] = [
    { key: 'TF', label: 'TF', draft: SHIP.summerDraft + ZONE_ADJ.tropical + FWA_MM / 1000, color: '#22d3ee' },
    { key: 'F', label: 'F', draft: SHIP.summerDraft + FWA_MM / 1000, color: '#22d3ee' },
    { key: 'T', label: 'T', draft: SHIP.summerDraft + ZONE_ADJ.tropical, color: '#34d399' },
    { key: 'S', label: 'S', draft: SHIP.summerDraft, color: '#f59e0b' },
    { key: 'W', label: 'W', draft: SHIP.summerDraft + ZONE_ADJ.winter, color: '#3b82f6' },
  ]

  const zoneBtn = (z: Zone, label: string) => (
    <button key={z} type="button" onClick={() => setZone(z)}
      className={`rounded-full border px-3 py-1 font-mono text-[11px] font-bold transition-all ${
        zone === z ? 'border-amber-500/60 bg-amber-500/15 text-amber-100' : 'border-white/10 text-slate-400 hover:text-slate-200'
      }`}>
      {label}
    </button>
  )

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-1 eyebrow text-brand-cyan">Capacity &amp; draft — the exercise</div>
      <p className="mb-3 text-xs leading-relaxed text-slate-400">
        {SHIP.name}: summer draft <span className="font-mono text-slate-200">{fm(SHIP.summerDraft)} m</span> ·
        TPC <span className="font-mono text-slate-200">{SHIP.tpc} t/cm</span> ·
        FWA <span className="font-mono text-slate-200">{Math.round(FWA_MM)} mm</span> (= displacement ÷ 4×TPC) ·
        cargo at summer marks in salt water <span className="font-mono text-slate-200">{SHIP.cargoAtSummer.toLocaleString('en-US')} t</span>.
        Find today&rsquo;s maximum lift.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[190px_minmax(0,1fr)]">
        {/* Plimsoll mark: hull plate with the loadline comb; water fills up to
            the governing draft's waterline */}
        <svg viewBox="0 0 190 176" className="w-full rounded-xl border border-white/10 bg-white/[0.02]" style={{ maxHeight: '190px' }}>
          <rect x="0" y="0" width="190" height="176" fill="rgba(148,163,184,0.05)" />
          {/* water below today's waterline */}
          <rect x="0" y={yOf(governing)} width="190" height={Math.max(0, 176 - yOf(governing))} fill="#0e7490" opacity="0.15" />
          {/* disc + horizontal through it (the summer line) */}
          <circle cx="70" cy={yOf(SHIP.summerDraft)} r="14" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
          <line x1="48" y1={yOf(SHIP.summerDraft)} x2="92" y2={yOf(SHIP.summerDraft)} stroke="#e2e8f0" strokeWidth="2.5" />
          {/* comb of loadline marks — deeper permitted drafts sit higher on the hull */}
          <line x1="118" y1="16" x2="118" y2="160" stroke="#e2e8f0" strokeWidth="2" />
          {marks.map(m => (
            <g key={m.key}>
              <line x1="118" y1={yOf(m.draft)} x2="146" y2={yOf(m.draft)} stroke={m.color} strokeWidth="2.2" />
              <text x="151" y={yOf(m.draft) + 3} fill={m.color} fontSize="9" fontFamily="monospace" fontWeight="bold">{m.label}</text>
            </g>
          ))}
          {/* today's waterline */}
          <line x1="0" y1={yOf(governing)} x2="190" y2={yOf(governing)} stroke="#22d3ee" strokeWidth="1.4" strokeDasharray="5 3" />
          <text x="4" y={yOf(governing) - 4} fill="#22d3ee" fontSize="8" fontFamily="monospace">today {fm(governing)} m</text>
        </svg>

        {/* controls + results */}
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wide text-slate-500">Loadline zone at loading</span>
            {zoneBtn('tropical', 'Tropical (+1/48)')}{zoneBtn('summer', 'Summer')}{zoneBtn('winter', 'Winter (−1/48)')}
          </div>

          {[
            { label: `Dock water density ${fm(rho, 3)} t/m³ ${rho >= 1.024 ? '(salt)' : rho <= 1.001 ? '(fresh)' : '(brackish)'}`, min: 0.996, max: 1.025, step: 0.001, value: rho, set: setRho },
            { label: `Charted depth at berth ${fm(depth, 1)} m`, min: 13, max: 17.5, step: 0.1, value: depth, set: setDepth },
            { label: `Height of tide at sailing ${fm(tide, 1)} m`, min: 0, max: 3, step: 0.1, value: tide, set: setTide },
          ].map((s, i) => (
            <div key={i} className="mt-2.5">
              <div className="flex justify-between font-mono text-[10px] text-slate-400"><span>{s.label}</span></div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value} aria-label={s.label}
                onChange={e => s.set(Number(e.target.value))}
                className="mt-1 h-1.5 w-full cursor-pointer accent-brand-cyan" />
            </div>
          ))}

          <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[10px] sm:grid-cols-4">
            <div className="rounded-lg bg-white/[0.03] p-2">
              <div className="text-slate-500">Legal draft (zone + DWA)</div>
              <div className={`mt-0.5 text-sm font-bold tabular-nums ${portGoverns ? 'text-slate-200' : 'text-amber-300'}`}>{fm(legalDraft)} m</div>
              <div className="text-slate-600">DWA {Math.round(dwaMm)} mm</div>
            </div>
            <div className="rounded-lg bg-white/[0.03] p-2">
              <div className="text-slate-500">Physical draft (depth + tide − UKC {fm(UKC, 1)})</div>
              <div className={`mt-0.5 text-sm font-bold tabular-nums ${portGoverns ? 'text-amber-300' : 'text-slate-200'}`}>{fm(portDraft)} m</div>
            </div>
            <div className="rounded-lg bg-white/[0.03] p-2">
              <div className="text-slate-500">Governing draft</div>
              <div className="mt-0.5 text-sm font-bold tabular-nums text-cyan-300">{fm(governing)} m</div>
              <div className="text-slate-600">{portGoverns ? 'the BERTH governs' : 'the LOADLINE governs'}</div>
            </div>
            <div className="rounded-lg bg-white/[0.03] p-2">
              <div className="text-slate-500">Max cargo lift</div>
              <div className={`mt-0.5 text-sm font-bold tabular-nums ${deltaT < 0 ? 'text-rose-300' : 'text-emerald-300'}`}>{Math.round(maxCargo).toLocaleString('en-US')} t</div>
              <div className="text-slate-600">{ft(deltaT)} vs summer/SW</div>
            </div>
          </div>

          <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
            {portGoverns
              ? `The berth is the binding constraint: every centimetre of missing water costs TPC = ${SHIP.tpc} t. Wait for ${fm(Math.min(3, Math.max(0, legalDraft - depth + UKC)), 1)} m of tide (the "tide window") or accept the short lift — this is why charts and tide tables are commercial documents, not just navigational ones.`
              : `The loadline is the binding constraint. In ${rho < 1.024 ? 'fresh/brackish' : 'salt'} water the ship may submerge her marks by the dock-water allowance (${Math.round(dwaMm)} mm) — she will rise to her legal marks on reaching the sea. Loading in fresh water is literally worth ${Math.round(dwaMm / 10 * SHIP.tpc).toLocaleString('en-US')} t of cargo.`}
          </p>
        </div>
      </div>
    </div>
  )
}
