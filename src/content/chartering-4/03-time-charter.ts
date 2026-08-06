import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '03-time-charter',
  title: 'The Time Charter — Key Elements & Responsibilities',
  type: 'lecture',
  estimatedMinutes: 45,
  sections: [
    {
      id: 'delivery-limits',
      title: 'Delivery, Redelivery & Trading Limits',
      body: `On a time charter the split flips: the owner runs the SHIP (crew, maintenance, insurance — and remains responsible for her performance); the charterer runs the BUSINESS (voyages, cargoes, bunkers, port costs) and pays **hire per day**. The frame of the contract is where it starts and ends:\n\n- **Delivery** — the ship enters the charter at an agreed place/range and time window, with an **on-hire survey** (independent) recording condition and — critically — **bunkers on board**: the meter starts here.\n- **Redelivery** — she must come back at the agreed range, in like condition, within the period ± any tolerance; redelivering EARLY forfeits nothing but wastes the option, redelivering **LATE (overlap)** is a breach: the owner recovers at least the market rate for the overrun (more if a lucrative follow-on fixture was missed).\n- **Trading limits** — the charterer's playground, defined in the CP: "worldwide within INL, always afloat, lawful merchandise, excluding [listed countries/war zones]". Orders outside the limits may be refused — or priced (extra premium, owner's consent): the INL/war-risk machinery of Module 3, now as a standing boundary rather than a one-voyage question.\n\nEvery clause that follows manages one tension: the ship is the owner's asset but the charterer's tool.`,
    },
    {
      id: 'hire-offhire',
      title: 'Hire, Off-hire — and Overtime',
      body: `**Hire** is payable in advance (typically per 15 days or per month), punctually — the classic tanker forms give the owner a **withdrawal right** for late payment (softened by anti-technicality notice clauses, but a missed hire payment in a rising market is still how charterers lose ships).\n\n**Off-hire** is the counterweight: when the SHIP fails the charterer — breakdown, drydocking, crew deficiency, PSC detention, failing a vetting inspection the CP warranted she would pass — hire **stops** for the time (and bunkers) lost. The clause is a list, read literally: an event not on it does not put the ship off-hire however inconvenient (congestion, charterer's own delays never do). Off-hire disputes are the time-charter's demurrage: same logbook discipline, same documents.\n\n**Overtime** — a small, telling clause: port labour and crew overtime worked to serve the CHARTERER'S operation (night loading ordered to catch a tide) is charged to the charterer; overtime for the SHIP'S own account (repairs) stays with the owner. A one-line clause that pays for the operator who reads logs carefully.`,
      visual: 'tc-timeline',
    },
    {
      id: 'bunkers-sublet',
      title: 'Bunkers — Quantities & Qualities — and Sublet',
      body: `**Bunkers** are the time-charterer's single biggest cost and a standing dispute generator:\n\n- **Quantities** — the charterer buys the fuel in the ship's tanks at delivery and sells back what remains at redelivery (CP prices each way); min/max redelivery quantities stop either side gaming a price move — with fuel worth \\$500+/t, a 500 t bunker ROB is a quarter-million-dollar line item\n- **Qualities** — the charterer must supply fuel meeting the CP spec (ISO 8217 grade, sulphur per zone — the SECA two-fuel problem from Module 3 is now the charterer's procurement problem); **off-spec bunkers** that damage engines make the charterer liable for the damage AND the time: hence sampling at every stem (MARPOL sample retained) and bunker surveys at delivery/redelivery\n- The engine-room logs meet commercial paper here: consumption per the logs vs the CP's warranted figures is next section's fight\n\n**Sublet.** The charterer may normally **sub-charter** the ship out (spot voyages on top of their TC — the classic owner-charterer arbitrage: take her on period at \\$30k/day, relet at WS equivalents of \\$45k in a spike). Subletting changes NOTHING upstream: the head charterer remains fully liable to the owner for hire and performance — a chain of charters is a chain of separate contracts, each standing alone (the back-to-back discipline, one more time, now in the freight market itself).`,
    },
    {
      id: 'performance-final-voyage-drydock',
      title: 'Performance Warranties & Recompense, the Final Voyage — and Dry Docking',
      body: `**Performance warranties.** The owner warrants speed and consumption: *"about 13 kn on about 35 t/day VLSFO, good weather, up to Beaufort 4"*. Each period is tested against the warranty using the ship's logs and (routinely) independent **weather-routing analysis** — with "about" customarily absorbing ±0.5 kn / ±5%:\n\n- **Underperformance** (slower, or thirstier): the charterer's **recompense** is the time lost × hire rate plus the excess bunkers — settled as an off-hire-style deduction or a period-end claim\n- **Overconsumption claims** are arbitrated by the numbers: log abstracts, bunker surveys, weather data — the same documents-beat-indignation rule as demurrage\n\n**The final voyage.** The charterer may only order a last voyage **reasonably expected** to redeliver within the period: a "legitimate last voyage". If a legitimate voyage overruns anyway, market rate applies to the overrun; an ILLEGITIMATE order (could never have made redelivery) the owner may refuse outright. In volatile markets the legitimacy of last voyages is one of shipping law's evergreen battlegrounds.\n\n**Dry docking.** Scheduled class dockings (typically twice per 5 years) sit in the CP: either the ship goes off-hire for the docking, or the period is framed to place dockings outside it. Position matters commercially — a docking clause that lets the owner dock "at a convenient time" in a strong market is a free option the charterer paid for without noticing. The time-charter lesson in one line: **every day of the ship's life is on somebody's account — the CP's job is to say whose.**`,
    },
  ],
}

export default topic
