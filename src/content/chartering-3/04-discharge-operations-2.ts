import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '04-discharge-operations-2',
  title: 'Discharge Operations II — Documents, Slops & Tank Operations',
  type: 'lecture',
  estimatedMinutes: 35,
  sections: [
    {
      id: 'bl-revalidation',
      title: 'Documentation — B/L Revalidation and the Discharge Paper',
      body: `The discharge file has its own documentary rhythm:\n\n- **Presentation of the B/L** — the receiver presents an original endorsed bill (or, routinely, takes delivery against the **LOI** from the laden passage — in which case retrieving and cancelling the outstanding original set afterwards is a real task on someone's desk, and the LOI stays live until it happens)\n- **B/L revalidation** — when the trade changed while the cargo floated (destination switched, cargo re-sold, discharge outside the B/L's named port), the bills must be **revalidated or switched** to match reality before or at discharge: owners will not discharge at port B against a document naming port A without either amended bills or an LOI. The rule from the laden passage repeats because it is the whole game: the PAPER must arrive at the same place as the OIL.\n- **The closing set** — outturn report, ROB certificate, timesheets/statement of facts (signed by ship, terminal, agent), notes of protest exchanged, empty-tank certificate where required: this bundle plus the load-port file IS the claims record Module 4 works from.`,
    },
    {
      id: 'slop-disposal',
      title: 'Slop Disposal',
      body: `**Slops** — the oily-water mixtures from tank washing, line flushing and dirty ballast, held in the ship's slop tanks — leave the ship by exactly two legal doors:\n\n1. **Retention on board** and decantation under MARPOL Annex I discharge rules (oil content limits, distance from land, ODME — the oil discharge monitor — recording every litre), or\n2. **Delivery to shore reception facilities** — with a receipt that goes straight into the **Oil Record Book**\n\nThe commercial questions the CP should answer: do slops from THIS voyage's washing belong to the cargo (crude receivers often take slops with the cargo — "slops to be pumped ashore with cargo") or to the ship? Who pays reception-facility charges, and whose time does slop discharge consume? \n\nThe compliance point is absolute: the Oil Record Book is a port-state-control favourite, a falsified entry is a criminal matter in most jurisdictions (the US "magic pipe" prosecutions), and no freight saving on Earth prices against it.`,
    },
    {
      id: 'pumping-warranties',
      title: 'Pumping — Warranties and Compensation',
      body: `Now settle the money the pressure gauge allocated:\n\n> **The warranty:** *"Vessel to discharge entire cargo within 24 hours, or maintain 100 psi at ship's manifold, provided shore facilities permit."*\n\nThe settlement logic, hour by hour from the pumping log:\n\n- Ship held ≥100 psi throughout, discharge took 30 hours → the extra 6 hours count as laytime/demurrage (**charterer/receiver pays** — the shore was the constraint, and the terminal's restriction letters prove it)\n- Ship could not hold pressure with no shore restriction → excess time is the **owner's**: deducted from laytime, and demurrage claims for those hours fail\n- Mixed picture (the usual) → the log is apportioned period by period: psi-hours to one account, restriction-hours to the other\n\n**Compensation flows both ways:** the owner recovers demurrage for shore-caused slow discharge; charterers/receivers counter-claim for ship-caused excess time — and an under-performed discharge that leaves **liquid ROB** on board becomes a shortage/cargo claim on top (unpumpable sludge, by contrast, is generally not a pumping failure). One habit decides most of these files: an hourly pumping log SIGNED by both sides beats a beautifully argued claim built on nothing.`,
    },
    {
      id: 'cow-marpol',
      title: 'Crude Oil Washing & the Marpol Pre-wash',
      body: `Two tank operations close the voyage — one commercial, one regulatory:\n\n**COW — crude oil washing.** During discharge, fixed tank-washing machines spray the cargo ITSELF (high-pressure crude, not water) against the tank walls, redissolving the waxy/asphaltic clingage so it pumps ashore WITH the cargo. Mandated by MARPOL for crude carriers (with IGS operating — the tank atmosphere must be inert); typically the CP requires washing an agreed share of tanks each discharge. Everyone wins on paper: receivers get more of their oil (less ROB), owners keep tanks clean and corrosion down, less slops are generated — the cost is time (COW extends the discharge; the CP usually adds laytime allowance for it) and energy. The pumping log grows a COW annex: which tanks, when, at what rate.\n\n**The Marpol pre-wash** belongs to the product/chemical side (Annex II): after discharging listed noxious liquid cargoes, a **mandatory pre-wash** at the discharge port, residues delivered to shore reception — before the ship sails. It is the port state's business, not the receiver's choice; the surveyor's pre-wash certificate is a sailing condition. Commercially: pre-wash time and reception costs belong wherever the CP put them — one more line the fixture negotiation of Module 1 should have priced, and one more reason the chemical trades quote freight all-in.\n\nTanks stripped, slops accounted, documents signed: the ship ballasts out and opens for her next fixture — and everything that could not be settled on the spot moves to Module 4, where the claims are written.`,
    },
  ],
}

export default topic
