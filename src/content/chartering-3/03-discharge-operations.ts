import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '03-discharge-operations',
  title: 'Discharge Operations I — Arrival to Tank',
  type: 'lecture',
  estimatedMinutes: 35,
  sections: [
    {
      id: 'arrival-nor-discharge',
      title: 'Arrival & NOR at the Discharge Port',
      body: `The mechanics mirror the load port — NOR, the 4 Ws, free pratique, laytime — but the context is harsher:\n\n- **Laytime is usually mostly SPENT.** Most tanker CPs give ONE total laytime figure (72 hours) for both ends: whatever loading consumed, discharge inherits the remainder. A slow load port means the ship may go **on demurrage** before discharge even begins — from that moment "once on demurrage, always on demurrage": the exceptions that suspended laytime no longer help.\n- **Congestion is the norm** — refinery berths run on programmes; receivers' tanks may be full (their market may WANT them full — a contango sits ashore in exactly the same way it sat in the coffee warehouse). The waiting anchorage is where detention and demurrage arguments are born.\n- **Free pratique & clearance** again condition NOR validity — and at discharge, customs now cares about IMPORT: entry, duty status, and (for bonded/transit cargo) the paperwork matching the B/L exactly.\n\nSame operator's discipline: NOR on arrival, protectively re-tendered, port log to the minute — the demurrage file for THIS voyage is already three-quarters written; discharge writes its last quarter.`,
    },
    {
      id: 'berthing-lightering-discharge',
      title: 'Berthing & Lightering — Mooring and STS at the Discharge End',
      body: `Physically the same toolbox as loading — pilot, tugs, mooring plan, SSSCL — with the discharge-specific patterns:\n\n- **Lightering to make draft** — the arrival-draft problem from the laden passage resolved in practice: part-discharge by STS at the outer anchorage until the river or berth draft is met, then shift inside. Two NORs, two sets of hose connections, and a clause that had better say whose time the lightering consumes.\n- **STS discharge entire** — some trades never see a berth: VLCC-to-shuttle STS off Southwold or Galveston Offshore Lightering Area as the whole discharge operation, mooring master and fenders included.\n- **Multi-berth discharges** — "1–2 safe berths": the second berth's **shifting** time and costs follow the CP's shifting clause; tank-to-tank sequencing between berths belongs to the receiver's terminal, but its delays land on the laytime clock.\n\nBy "all fast" and SSSCL signed, the commercial state is: clock running (often at the demurrage rate already), receivers impatient, and the ship about to perform the single most warranty-laden operation of the voyage — pumping.`,
    },
    {
      id: 'cargo-handling-discharge',
      title: 'Cargo Handling — Back Pressure and Notes of Protest',
      body: `Discharge physics inverts loading: now the SHIP does the work, her cargo pumps pushing against the terminal's **back pressure** (long shore lines, high tanks, restrictive manifolds all raise it, and rate falls as it rises).\n\nThat physical fact drives the classic tanker dispute. The CP carries a **pumping warranty** — discharge the full cargo within 24 hours, or maintain 100 psi at the ship's manifold throughout. Read it as an either/or: if the terminal restricts the rate, the ship demonstrates 100 psi at the manifold and the excess time becomes the CHARTERER'S problem; if the ship cannot hold the pressure, the excess discharge time is the OWNER'S. Every hour of a slow discharge is being silently allocated by a pressure gauge.\n\nHence the paper reflex — **notes of protest**, issued at the time, from either side: the Master protests shore restrictions ("terminal limited discharge to 4 bar — vessel maintained warranted pressure, time to charterer's account"); receivers protest slow pumping. The hourly **pumping log** (rates, manifold pressures, stoppages, signed by ship and preferably countersigned by the terminal) is the evidence that decides whose hours they were — Module 4 will settle the money, but the WINNING happens here, during the operation, in the log book.`,
    },
    {
      id: 'inspection-measurement-discharge',
      title: 'Inspection & Measurement — Quantity, Quality, Shortages',
      body: `The discharge survey closes the custody chain the load port opened:\n\n- **Before discharge** — inspector gauges the ship's tanks (arrival ullages, temperatures, water dips) and takes arrival samples: the comparison set against the load-port figures\n- **After discharge** — **ROB** survey (remaining on board: liquid vs unpumpable sludge/clingage — the distinction drives whether it is a pumping failure or an inherent-cargo matter), shore-tank receipt figures, and the **outturn report**\n- **Quantity reconciliation** — B/L figure vs outturn: pipeline fills, tank calibration, temperature corrections (all volumes standardised to 15 °C — the inspector's tables do the converting) and genuine in-transit loss all explain PART of any gap; the sale contract's loss allowance (typically 0.3–0.5%) absorbs the rest — beyond it, a **shortage claim** goes against ship and/or supplier, built on exactly the documents this course keeps telling you to collect\n- **Quality at outturn** — arrival samples vs load-port samples answer the only question that matters: did the cargo CHANGE on board (contamination — ship's problem: tank cleanliness, valve discipline, previous cargoes) or was it always thus (supplier's problem)? The sealed load-port samples are the tiebreaker — which is why they were taken.\n\nFor the trader, outturn numbers ARE the P&L: a 0.4% shortage on an 80,000 t cargo at \\$600/t is \\$192,000 — the same order of magnitude as the entire freight negotiation of Module 1.`,
    },
  ],
}

export default topic
