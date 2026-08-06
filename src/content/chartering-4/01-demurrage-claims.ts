import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '01-demurrage-claims',
  title: 'Demurrage — and the Voyage’s Other Claims',
  type: 'lecture',
  estimatedMinutes: 40,
  sections: [
    {
      id: 'why-no-despatch',
      title: 'Demurrage — and Why There Is No Despatch',
      body: `**Demurrage** is liquidated damages for detaining the ship beyond the agreed **laytime**: once the clock expires, every day (pro rata — pdpr) is paid at the CP rate. It is not a penalty, and not negotiable after the fact — it is the pre-agreed price of the ship's time, which is exactly why the rate was fought over at fixing.\n\n**Why no despatch?** Dry-bulk charters often pay **despatch** — a reward (customarily half the demurrage rate) for loading FASTER than laytime allows. Tanker charters almost never do. The logic: tanker laytime (72 hours SHINC for load AND discharge) is already set at a realistic pumping schedule, not a generous one — the owner has priced the voyage on that port time, gains little from a few saved hours (the next fixture doesn't start earlier at a sea berth on a Tuesday night), and the oil market's terminals, not the charterer's stevedores, control the pace anyway. So the tanker regime is asymmetric by design: **use less than laytime, gain nothing; use more, pay demurrage.** For the trader this asymmetry is a one-way option the market sold you — manage the clock accordingly.`,
      visual: 'demurrage-whopays',
    },
    {
      id: 'invoices-claims',
      title: 'Invoices & Claims — Freight, Deadfreight, Detention, Deviation',
      body: `The post-voyage file, claim by claim:\n\n- **Freight invoice** — flat × WS% × B/L quantity (or lumpsum), less commissions; payable per the CP (typically before breaking bulk or within days of B/L date). Freight is famously **due without deduction** — "freight is sacred": counterclaims are pursued separately, not netted off.\n- **Deadfreight** — the charterer shipped LESS than the contractual minimum: freight is due on the missing tonnes (the owner sailed with empty space they could not resell). Module 1's tolerance wording (MOLCO/MOLOO) and Module 2's short-lift arithmetic land here as an invoice.\n- **Detention** — the damages-for-delay claim OUTSIDE the laytime regime (waiting for orders, documents, or being held after completion), claimed at (usually) the demurrage rate but as unliquidated damages: the timeline evidence from Module 3 is its whole substance.\n- **Deviation-related claims** — extra steaming, bunkers and port costs from an agreed route change (or defence against an alleged unjustified deviation): the written flag-and-agree trail from the laden passage decides it.`,
    },
    {
      id: 'other-claims',
      title: 'Other Claims — Shifting, War Risks, Heating, Ice, Worldscale Terms',
      body: `The smaller heads of claim that pepper a tanker voyage file — each one traceable to a clause and a log entry:\n\n- **Shifting** — moving between berths/anchorages at the charterer's order or the port's: shifting time and costs (pilots, tugs, linesmen) per the shifting clause; often "time to count, costs for charterer's account"\n- **War risks / AWRP** — additional war-risk premium, crew war bonuses and detour costs for ordered transits of listed areas (the Module 3 security overlay, invoiced with underwriters' debit notes attached)\n- **Heating** — cargo heated ABOVE CP instructions, or heating maintained through charterer-caused delay: bunker consumption is metered, logged and billed\n- **Ice** — ice-class premiums, icebreaker fees, ice deviation and delay under the ice clause: the winter cousin of the war-risks claim\n- **Worldscale terms** — the schedule itself allocates specific items (fixed and variable differentials, canal transit terms, certain port charges): "as per Worldscale" is a claims basis, not decoration — the pink-pages order of operations from Module 1 reappears in invoices\n\nNone of these is large alone; together they routinely move the voyage result by more than the last five WS points of the negotiation.`,
    },
    {
      id: 'timebars-voyage-analysis',
      title: 'Time Bars, Supporting Documents — and Voyage Analysis',
      body: `**Time bars.** Tanker CPs and oil-major terms impose short contractual deadlines: demurrage claims presented **with full supporting documents** within 60/90 days of discharge — or the claim is extinguished. Courts enforce these literally: a claim one day late, or missing one required document, is worth zero. Hence the operator's calendar has claim deadlines on it, not just ETAs.\n\n**The supporting bundle** (the same list this course has been building since Module 2): NORs, statements of facts (signed), port logs, pumping logs with pressures, notes of protest, letters of restriction from terminals, timesheets, and the laytime calculation itself. The rule of the whole course in one line: **a claim is documents, not indignation.**\n\n**Voyage analysis.** After settlement, the desk closes the loop the way the commodity course closed each trade: actual vs estimate — voyage days, bunkers, port time, claims recovered vs conceded, final TCE vs the number the fixture was justified on. Owners feed it back into which trades and charterers to pursue; charterers feed it into which terminals, receivers and CP clauses keep costing them money. The estimate → voyage → analysis cycle IS chartering as a discipline; everything else is anecdote.`,
    },
  ],
}

export default topic
