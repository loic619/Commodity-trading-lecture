import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '01-pre-fixture-ops',
  title: 'Pre-fixture & Pre-loading Operations',
  type: 'lecture',
  estimatedMinutes: 45,
  sections: [
    {
      id: 'approvals-vetting',
      title: 'Approvals & Vetting — SIRE, CDI and the Screening Machine',
      body: `Before a tanker touches an oil major's cargo or berth, she is **vetted** — screened against the industry's shared inspection databases:\n\n- **SIRE** (Ship Inspection Report Programme, OCIMF) — the tanker standard: uniform inspections by accredited inspectors, reports visible to all participating charterers/terminals. Now **SIRE 2.0**: risk-based, tablet-driven, human-factors heavy.\n- **CDI** (Chemical Distribution Institute) — the chemical/parcel equivalent.\n- **Class records, PSC history, terminal feedback, age policy** — most majors decline tankers beyond a stated age (typically 20–25 years, and often stricter commercially).\n\nTwo working realities: an "approval" is **not a certificate** — majors screen per voyage, so *"approved by Shell last month"* means only that she passed *that* screen for *that* cargo; and vetting is the charterer's FIRST filter — no acceptable SIRE, no negotiation. For the trader this is commercial, not technical: a cargo bought FOB with a ship the terminal rejects is a cargo you cannot lift.`,
    },
    {
      id: 'recap-vs-cp',
      title: 'Recap vs. Charter Parties — Checking, and Considering the Differences',
      body: `The fixture done, operations open the file with a document check that saves fortunes:\n\n**Check the recap against the CP form.** The recap says *"Asbatankvoy + charterer's amendments"* — now actually READ the combination. The printed form is a 1977 skeleton; the amendments and **rider clauses** override it, and the recap overrides both. Classic catches: the rider's laytime clause quietly switching SHINC→SHEX; a demurrage **time bar** (claim + full documents within 90 days or the claim dies); a "safe berth" qualifier someone softened.\n\n**Consider CP differences across the chain.** A trader often sits in the middle: bought FOB on one contract, sold CIF on another, chartered on a third. The three documents were negotiated separately — and every mismatch is YOUR exposure (the coffee course's back-to-back lesson, at tanker scale):\n\n- Sale contract allows 96 hrs laytime; your CP allows 72 → 24 hrs of demurrage risk is yours structurally\n- CP demurrage \\$45k/day; sale contract caps recovery at \\$40k → \\$5k/day leaks\n- Different NOR trigger conditions → the clocks don't even START together\n\nThe pre-loading discipline: put the three laytime/demurrage regimes side by side in one table **before** the vessel sails — while alignment can still be negotiated.`,
    },
    {
      id: 'monitoring-updating',
      title: 'Monitoring and Updating',
      body: `From fixture to arrival, operations runs a standing rhythm:\n\n- **Vessel itinerary** — daily position/ETA messages from the Master (a CP obligation); every ETA revision re-tests the **laycan**\n- **Nominations** — load port confirmed, discharge orders when declared, cargo quantity narrowed within the tolerance, all inside the CP's notice periods\n- **The counterparties** — supplier's terminal, receivers, agents at both ends, inspectors appointed\n- **The paper trail** — every update in writing, every instruction acknowledged: this file IS the evidence when the claim comes\n\nThe operator's craft is refusing surprises: a laycan at risk is renegotiated **now** (while options exist), not discovered on the morning the ship misses it.`,
    },
    {
      id: 'port-clearance',
      title: 'Port & Terminal Clearance — and the SSSCL',
      body: `Parallel to the voyage, the ship must be **cleared for the berth** on three axes:\n\n- **Technical** — dimensions vs berth limits (LOA, beam, draft, displacement, manifold setup, WLTHC in ballast): Module 1's numbers, now with consequences\n- **Commercial** — the terminal/supplier accepts THIS ship for THIS lifting (their own vetting pass)\n- **Age & policy** — terminal age limits, flag/sanctions screening, P&I and insurance checks\n\nAt the berth itself, the **SSSCL — Ship/Shore Safety Check List** (ISGOTT) governs: a joint, signed, item-by-item verification — moorings, IGS, venting lineup, communication, emergency shutdown — **before and during** cargo operations. The potential issue every operator learns early: the SSSCL can legitimately **stop the operation** (repeat checks fail, a criterion lapses — say a rising swell breaks the mooring criteria) and the resulting delay lands in a laytime grey zone: is time lost to a safety stoppage the ship's fault, the terminal's, or "time not counting"? The answer lives in the CP's exceptions clause — and in whether your operator documented WHO failed WHICH item.`,
    },
    {
      id: 'stowage-planning',
      title: 'Stowage & Cargo Planning — WVNS, Pump Stack, Slops, Reducers',
      body: `Before loading, the chief officer turns the nomination into a **stowage plan**, and operations must be able to read it:\n\n- **Segregations first** — which grades in which tanks, on which line systems, so that incompatible parcels never share steel or pipe; the **venting/vapour lineup (WVNS)** must respect the same segregation (a shared vent line can contaminate as surely as a shared pump)\n- **The pump stack** — discharge planning starts at loading: which pumps serve which tanks, what rate against what expected shore **back pressure**, which order of tanks keeps trim and stress inside limits as the ship empties\n- **Slop tanks** — reserved capacity for tank washings and line displacements; loading them with cargo buys tonnes today and sells them back with interest at the next grade switch\n- **Reducers & manifold plan** — ship flange sizes vs shore arms, WHICH manifold connections for WHICH grade, agreed before arrival\n- **Stress, trim & drafts** — the plan must sail within loadline limits (Module 1's exercise) at every intermediate stage, not just at completion\n\nThe commercial angle: a good stowage plan is CAPACITY. Poor planning strands tonnes ("cannot load your last parcel without breaking segregation") — and stranded tonnes are deadfreight, claims and a difficult conversation with the trader who sold the volume.`,
      visual: 'tanker-cargo-system',
    },
  ],
}

export default topic
