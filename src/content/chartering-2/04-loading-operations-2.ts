import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '04-loading-operations-2',
  title: 'Loading Operations II — NOR to Sailing',
  type: 'lecture',
  estimatedMinutes: 40,
  sections: [
    {
      id: 'arrival-nor',
      title: 'Arrival & NOR — Laytime, Free Pratique and the 4 Ws',
      body: `The single most litigated moment of the voyage: **tendering Notice of Readiness**. NOR is the trigger that starts **laytime** — and an invalid NOR can mean the clock never started at all (ships have waited two weeks on an NOR tendered one hour too early, with every hour on the owner's account).\n\nA valid NOR must satisfy the **4 Ws**:\n\n- **WHERE** — the ship must be an "arrived ship" at the CP's agreed point: at the berth (berth charter) or within the port/customary anchorage (port charter). Read WHICH one you fixed.\n- **WHEN** — within laycan, and within any office-hours window the clause imposes; many CPs then add a **notice time** (e.g. laytime starts 6 hours after valid NOR or when loading commences, whichever first)\n- **WHAT** — genuinely ready in all respects: tanks inspected and accepted, IGS working, **free pratique** granted (or the CP says "whether granted or not" — WIFPON), customs cleared (or WICCON)\n- **WHOM** — tendered to the party the CP names (charterer/agent/terminal), in the form it requires\n\nOperator's discipline: tender NOR **on arrival, every time, and re-tender** after any event that could question validity (shifted anchorage, failed inspection later cured). A cascade of protective NORs costs nothing; a single invalid one can cost the whole waiting time.`,
    },
    {
      id: 'berthing-lightering',
      title: 'Berthing & Lightering — Mooring, STS and Double-Banking',
      body: `**Berthing.** Pilot boarding, tugs made fast, the terminal's mooring plan executed, gangway and access control, then the **SSSCL** signed before any cargo moves. Time from "pilot on board" to "all fast" is logged — berthing delays (tug shortage, tide window missed) are a classic laytime battleground.\n\n**Lightering / STS (ship-to-ship).** Where draft or logistics demand it, cargo moves between ships instead of over a berth:\n\n- **STS at anchorage/offshore** — a VLCC discharging into Aframaxes to make a draft-restricted port; fenders, hoses, a mooring master, and an approved STS plan (MARPOL Chapter 8) are mandatory\n- **Double-banking** — two ships moored alongside at the SAME berth, inboard ship working the shore, outboard working the inboard: common in bunkering and product trades\n- Each configuration has its own weather limits, insurance notifications, and — commercially — its own clause: WHO pays the lightering, whose time counts while it happens, and whether the STS position is itself a valid NOR location\n\nSTS is routine, but it is the highest-attention cargo operation in the book: two moving hulls, live hoses, and (for the trader) two sets of ship's figures where there used to be one.`,
    },
    {
      id: 'cargo-handling',
      title: 'Cargo Handling — the Load Itself',
      body: `The load sequence, from the operator's chair:\n\n1. **Line-up & agreement** — stowage plan confirmed against the shore's loading plan: rates, max pressure, venting/vapour-return lineup, communication and **emergency shutdown (ESD)** procedures agreed\n2. **Start slow** — reduced rate while both sides verify the cargo is going where it should (the first ten minutes catch the misaligned valve)\n3. **Bulk loading** — at the agreed rate; the ship ballasts OUT as cargo comes in, keeping stress, trim and drafts inside the plan at every stage\n4. **Topping off** — rates cut as tanks approach their **ullage** targets (loaded to a % leaving room for thermal expansion); the highest-risk phase for overflow: one tank at a time, full attendance\n5. **Completion** — lines drained/blown, quantities tallied before hoses off\n\nCommercial rails around the physics: the CP's allowed **loading rate** (or laytime hours) prices the port stay; the terminal's actual rate is often the binding constraint; and **every stoppage is logged with cause** — pump trip (terminal's), tank change (ship's), vapour lock, weather stop — because Module 4 will ask, line by line, whose time each stoppage was.`,
    },
    {
      id: 'inspection-measurement',
      title: 'Inspection & Measurement',
      body: `The load port is where the cargo's **quantity and quality are established** — the numbers every later claim references:\n\n- **The independent inspector** (SGS, Intertek, Saybolt…), jointly appointed under the sale contract, measures shore tanks and/or flow meters, samples the cargo (foot samples, first-out, composite), and issues the **certificates of quantity and quality**\n- **Ship's figures** — the chief officer's ullage survey, corrected by the **VEF** (vessel experience factor — the ship's historical ratio of ship-to-shore figures): where ship and shore diverge beyond tolerance (typically ~0.3%), a **note of protest** is issued on the spot\n- **Samples are evidence** — sealed, labelled, retained: in a quality dispute at discharge, the load-port samples decide whether the cargo changed on board or was always off-spec\n- **OBQ** (on-board quantity before loading) and, at discharge, **ROB** (remaining on board) bracket what the ship actually carried\n\nFor the trader these documents are not formalities: the B/L quantity drives the **invoice**, the quality certificate drives **spec compliance** on the sale, and both drive the letter of credit.`,
    },
    {
      id: 'documentation-bl',
      title: 'Documentation — Bills of Lading and e-Docs',
      body: `**The bill of lading** is three instruments in one sheet: a **receipt** for the cargo as loaded (quantity, apparent condition, date), the evidence of the **contract of carriage**, and a **document of title** — the paper that IS the cargo: endorse and deliver the B/L and you have sold the goods afloat, which is what makes the CIF chain of the commodity course physically possible.\n\nOperator's checkpoints: B/L figures vs ship's figures (the Master may sign under protest or clause the B/L — a **claused** B/L usually breaks the letter of credit, so the pressure to sign clean is commercial and intense); B/L **date** (the shipment-period trigger in the sale contract — backdating is fraud, full stop); parties, destination "or order", freight clause — all per the charterer's instructions IF consistent with the CP and the mate's receipts.\n\n**e-Docs.** Electronic bills (Bolero, essDOCS, and now MLETR-based statutory regimes) replicate receipt/contract/title cryptographically, killing the courier lag that made **LOI discharge** routine (Module 3's subject). Adoption is accelerating trade-lane by trade-lane; the operator's job is unchanged: the DATA on the document, paper or digital, must be right at issue — errors compound at every hand the document passes through.\n\n**Sailing instructions** close the port call: voyage orders confirmed or updated — discharge range and agents, ETA reporting schedule, heating instructions, speed (charterer's option to order slow/full steaming where the CP allows), bunkering plan — and the laden passage of Module 3 begins.`,
    },
  ],
}

export default topic
