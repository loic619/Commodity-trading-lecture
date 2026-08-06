import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '05-negotiation-roleplay',
  title: 'Shipping Negotiations — Role Play',
  type: 'case-study',
  estimatedMinutes: 50,
  sections: [
    {
      id: 'chartering-decisions',
      title: 'Making Chartering Decisions — and When, in the Trade Deal',
      body: `Before the role play, two framing questions every trader-charterer answers on every deal:\n\n**1. What do I actually need?** Spot voyage (one cargo, market risk each time), COA (programme cover), or time charter (flexibility, but you become an operator)? The decision mirrors the hedging logic of the commodity course: match the instrument to the exposure — a one-off arbitrage cargo wants a spot ship; a yearly supply contract wants a COA or TC cover.\n\n**2. WHEN do I fix?** — **timing of chartering inside the trade deal** is where freight and trading meet:\n\n- Fix the ship **before** the cargo purchase and you are short cargo against a committed ship (deadfreight risk if the deal dies)\n- Fix the cargo **before** the ship and you are short freight in a market that knows you must cover (the WS% moves against a known distressed charterer — the market has eyes)\n- The professional pattern: work BOTH legs to "subjects" in parallel, and lift subjects together — exactly what the FOB→CIF simulation of the commodity course made you feel when freight ran away mid-trade\n\nA CIF seller who has sold at a fixed price is **short freight from the moment of sale**: the freight leg is an exposure like any other, and this module's Worldscale sheet is its price screen.`,
    },
    {
      id: 'offers-counters',
      title: 'Offers and Counter-Offers — the Role Play',
      body: `**Setup (pairs):** one side is **owner** of M/T Meridian (open Rotterdam 8 March, TCE target \\$40,000/day), the other is **charterer** XYZ (80,000 t Bonny → UKC, laycan 12–14 March, budget WS115). The broker (the instructor, or a third student) carries every message — principals never speak directly.\n\nThe dance has strict etiquette:\n\n1. Charterer's **firm order** with main terms\n2. Owner's **firm offer**, valid for a stated **reply time** ("WS135, Asbatankvoy, 72 hrs SHINC, demurrage \\$50k, reply 15:00")\n3. **Counter** — each reply re-states EVERYTHING still open and concedes something ("WS118, demurrage \\$42k, otherwise as offered, reply 16:00")\n4. Convergence to **"on subjects"**: main terms agreed, subject to approvals\n\nRules that mirror the real market: an offer is **firm** until its reply time expires — trading against your own live offer is a reputation-ending move; silence past the reply time kills the offer; and every counter narrows: re-opening an agreed term costs you a concession somewhere else.\n\nRun 3 rounds of offers each. Where do you land against the "last done" of WS120?`,
    },
    {
      id: 'freight-voyage-exercises',
      title: 'Freight Calculation & Voyage Estimating — the Exercises',
      body: `Both sides now check the number they just negotiated — with the SAME sheet, from opposite ends:\n\n**Freight calculation (charterer's side).** At your agreed WS level: freight = flat × WS/100 × 80,000 t. Add 2.5% commission, divide by the tonnes — what does the freight add, in \\$/t, to your CIF cost line? At what WS level does your arbitrage die?\n\n**Voyage estimating (owner's side).** Run the estimator below at the agreed WS: sea days from distance and speed, bunkers by the cube law, port costs, commission off the top — does the **TCE** beat your \\$40,000/day target? Try slow-steaming: does dropping half a knot IMPROVE the TCE at today's bunker price?\n\nIf the charterer's break-even WS sits below the owner's TCE-target WS, there is **no zone of agreement** — and the role play should honestly end in "no fixture today": recognising that is also a chartering decision, and often the best one made all day.`,
      visual: 'voyage-estimator',
    },
    {
      id: 'finalising-subjects',
      title: 'Finalising the Recap & Lifting Subjects',
      body: `The negotiation converges; the broker drafts the **recap** (Module 1's anatomy). Two final mechanics close the deal:\n\n**Finalising the recap.** Every agreed term, restated once, in writing, by the broker — and READ by both principals. The recap is the contract: an error unchallenged now ("72 hrs" that should read "84 hrs") will be enforced later. Details that were never discussed default to the named CP form — which is why you name the form *and* whose amendments apply.\n\n**Lifting subjects.** The fixture is "on subs" — conditional. Typical subjects: **charterer's management approval**, **suppliers'/receivers' approval**, sometimes **stem confirmation** (cargo availability). Each has a deadline; the etiquette is brutal and fair:\n\n- Subjects are for their stated purpose — NOT a free option to shop the market. "Failing subs" because a cheaper ship appeared is technically legal and commercially lethal.\n- When the last subject lifts, the fixture is **clean** — fully binding, and the pre-loading clock of Module 2 starts immediately.\n\n**Debrief for the room:** compare fixtures. Same market, same ship — the spread of agreed WS levels across pairs is pure negotiation alpha. What did the best charterer concede that cost them nothing? (Usually: demurrage rate — they intend to load fast — against WS points, which are cash on every tonne.)`,
    },
  ],
}

export default topic
