import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '04-single-voyage-contract',
  title: 'The Single Voyage Contract',
  type: 'lecture',
  estimatedMinutes: 35,
  sections: [
    {
      id: 'fixture-recap',
      title: 'The Fixture Recap',
      body: `A tanker fixture is agreed **by exchange of messages**, not by signing a document: when the last subject lifts, the deal is DONE, and the broker's **fixture recap** is the binding record. A real recap reads like this:\n\n> **M/T MERIDIAN / XYZ TRADING — CP dated 8 March**\n> - Vessel: M/T Meridian, 105,000 dwt, 2019, double hull, last 3 cgo crude\n> - Cargo: 80,000 t ± 5% MOLCO crude oil\n> - Load: 1 SB Bonny · Discharge: 1–2 SB UKC-Med, orders\n> - Laycan: 12–14 March\n> - Freight: **WS 120**, Worldscale 2025, per current flat rate\n> - Laytime: **72 hrs SHINC** total · Demurrage: **\\$45,000 pdpr**\n> - CP form: **Asbatankvoy** with owners'/charterers' standard amendments\n> - Commission: 2.5% total (1.25% XYZ address + 1.25% broker)\n> - Subs: charterer's management approval + suppliers' approval, to be lifted latest 17:00 tomorrow\n\nTen lines that commit two companies to a multi-million-dollar voyage. The formal charter party may be papered weeks later — the recap governs from day one.`,
      visual: 'fixture-recap-anatomy',
    },
    {
      id: 'analysing-recap',
      title: 'Analysing the Recap',
      body: `Read a recap the way a claims analyst will read it in three months:\n\n- **"± 5% MOLCO"** — the charterer chooses the final quantity. Nominate below the minimum and the owner claims **deadfreight** (freight on cargo not shipped).\n- **"1–2 SB"** — one or two safe berths: the SECOND discharge berth is already paid for in the flat rate structure, but the **shifting** between them may not be. Check the clause.\n- **"72 hrs SHINC"** — laytime runs **Sundays and holidays included**: the weekend is not free. The alternative, SHEX, excludes them — worth many hours of demurrage either way.\n- **"\\$45,000 pdpr"** — demurrage **per day pro rata**: the meter runs by the minute once laytime expires.\n- **"Asbatankvoy + amendments"** — the printed form is only the skeleton: the real allocation of risk sits in the **rider clauses and amendments**, which override the print. "Standard amendments" that nobody has actually compared is how disputes are born (Module 2 returns to this).\n- **"Subs … latest 17:00 tomorrow"** — until subjects lift there is NO fixture; after, there is no escape.\n\nThe discipline: every recap line maps to money, and the time to challenge a line is **before** subjects lift, not when the claim arrives.`,
    },
    {
      id: 'terminology-responsibilities',
      title: 'Terminology & Responsibilities',
      body: `The vocabulary that allocates the voyage's risks — used precisely, because each term moves money between the parties:\n\n**The parties.** **Owner** (provides the ship, seaworthy and as described) · **Charterer** (provides the cargo and the port nominations) · **Broker** (intermediary, never a principal) · **Agent** (the owner's or charterer's port representative) · **Master** (the owner's servant on board — but bound to follow charterer's *voyage* orders).\n\n**The owner's core duties:** seaworthiness and cargoworthiness at the start of the voyage · **due despatch** (proceed without unjustified delay or **deviation**) · care of the cargo · tender **NOR** correctly at each port.\n\n**The charterer's core duties:** provide the cargo · nominate **safe ports/berths** (safe to reach, use and leave — the "safe port warranty" carries real liability) · load/discharge within **laytime** · pay freight, and **demurrage** if laytime is exceeded.\n\n**The clock words** — laycan, NOR, laytime, demurrage, despatch (rare in tankers — hence Module 4's title) — form the voyage's financial clock: we will run that clock, port by port, through Modules 2 and 3, and settle it in Module 4.`,
      visual: 'voyage-parties',
    },
  ],
}

export default topic
