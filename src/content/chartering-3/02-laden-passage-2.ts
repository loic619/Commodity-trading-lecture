import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '02-laden-passage-2',
  title: 'Laden Passage Operations II — Limits, Risks & the Paper Afloat',
  type: 'lecture',
  estimatedMinutes: 40,
  sections: [
    {
      id: 'charts-limits',
      title: 'Pilot Charts, IWL/INL & SECAs',
      body: `Route planning has a regulatory and statistical layer on top of the map:\n\n- **Pilot charts** — the classical monthly atlases of prevailing winds, currents, wave heights, ice and cyclone tracks per ocean. They are climatology, not forecast: the reason a winter North Atlantic estimate carries a bigger weather margin than a summer one, and the starting point of every routing decision.\n- **IWL / INL** — Institute Warranty Limits (now formally **International Navigating Limits**): the geographical/seasonal boundaries inside which the ship's hull insurance holds without question. Winter North Atlantic zones, ice areas, war zones — trading OUTSIDE the limits needs insurers' prior agreement and an additional premium, and the CP decides who pays it. A charterer ordering the ship beyond INL without cover is buying an uninsured casualty.\n- **SECAs** — sulphur emission control areas (North Sea/Baltic, North America, US Caribbean, Mediterranean): inside them the ship must burn 0.10% sulphur fuel vs the global 0.50% cap. Operationally a fuel-changeover plan and tank segregation; commercially a two-fuel cost calculation the voyage estimate must carry — an estimate priced on VLSFO for a voyage ending deep inside a SECA is simply wrong.`,
    },
    {
      id: 'rivers-detention',
      title: 'River Transits, Detention & Draft Restriction',
      body: `**River transits** (Mississippi, Plate, Orinoco, Bonny…) concentrate every constraint of the course into one waterway: controlling depth that moves with the season, tide windows, air draft under bridges, one-way stretches and convoys, compulsory pilotage, daylight restrictions. The estimate for a river port is written in **windows**, not hours.\n\n**Draft restriction afloat.** When the declared discharge port cannot take the ship's arrival draft, the cargo must be **lightened**: part-discharge at an outer port or STS into a smaller ship, THEN the river passage. Who pays the lightering (and whose time counts) is a rider-clause question to answer at FIXING, not at the river mouth.\n\n**Detention.** Delay caused by the charterer OUTSIDE the laytime regime — waiting for orders past the notice deadline, waiting for documents, held at anchor after loading because the receiver's tanks are full before NOR could be tendered. It is claimed as **damages at the demurrage rate** (the agreed value of the ship's day), but it is a separate head of claim from demurrage: laytime hasn't started (or has been suspended), yet the ship is demonstrably being held. Operators log detention events with the same rigour as laytime — the claim dies without the timeline.`,
    },
    {
      id: 'piracy',
      title: 'Piracy & Security',
      body: `High-risk areas (Gulf of Aden/Somali basin, Gulf of Guinea, and since 2023 the Red Sea missile/drone corridor) put a security overlay on the laden passage:\n\n- **Industry practice** — BMP5 hardening, citadel drills, reporting to naval coordination (UKMTO/MSCHOA), and where lawful, **armed guards** embarked for the transit\n- **Routing choice** — corridor transit vs the long way around (the Cape): a cost/risk trade the estimate must price in days, bunkers AND war-risk premium\n- **The clauses** — war-risk and piracy clauses allocate the choice and the bill: additional war-risk premium (**AWRP**) for the transit, crew war bonuses, K&R cover; typically for charterer's account when the trading order causes the exposure — and the clause governs whether the owner may REFUSE the voyage order at all\n- **Insurance interlock** — breach of the agreed trading area (previous section's INL logic) or an undeclared HRA transit can void cover precisely when it is most needed\n\nFor the desk, security risk is another freight input: when the Red Sea closed, tonne-miles exploded and product tanker rates repriced within days — geopolitics arriving in the WS column.`,
    },
    {
      id: 'bl-loi-orders',
      title: 'Changing Bills of Lading, LOIs & Discharge Orders',
      body: `The cargo trades while it floats; the paper must follow:\n\n- **Changing Bills of Lading** — destination changed by the trade, cargo re-sold requiring a switch of shipper/consignee, or a split into parcels: the ORIGINAL full set must be surrendered and replaced — two live sets of title documents for one cargo is fraud waiting to happen. Switch B/Ls are legitimate ONLY with all originals recovered, owners'/P&I approval, and no alteration of the factual statements (quantity, date, load port).\n- **LOIs — letters of indemnity** — the workhorse of oil trading's paper lag: the B/L travels through banks slower than the ship sails, so receivers routinely take delivery **without presenting the original B/L** against a charterer's LOI (usually with bank counter-signature) indemnifying the owner. Standard P&I wordings (IG A/B/C) cover delivery without B/L, delivery at a changed port, and both. Two facts to respect: the P&I club does NOT cover mis-delivery against an LOI (the indemnity is only as good as its signer's credit), and an LOI is a serious unsecured exposure — desks track outstanding LOIs like open credit lines.\n- **Discharge orders** — the closing act of the declaration process from last session: final port and berth, receivers and agents named, disport inspectors appointed, heating raised to discharge temperature, and the ship's **pre-arrival questionnaire** answered. The laden passage ends where Module 2 began: with an NOR about to be tendered — this time with the cargo, the documents and three months of accumulated clock all riding on it.`,
    },
  ],
}

export default topic
