import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '03-commercial-process',
  title: 'The Commercial Process — Contracts, Research & Brokers',
  type: 'lecture',
  estimatedMinutes: 35,
  sections: [
    {
      id: 'contract-types',
      title: 'Types of Contract',
      body: `Four structurally different ways to buy transportation, trading **risk against flexibility**:\n\n- **Voyage charter (spot)** — one cargo, one voyage, freight in WS or \\$/t. The owner carries the voyage costs and the time risk at sea; the charterer carries the port-time risk through **laytime and demurrage**. The instrument of this course's first three modules.\n- **COA — contract of affreightment** — a series of voyages over a period ("12 cargoes of 80,000 t, monthly, WAF→UKC"): cargo-programme certainty without operating ships.\n- **Time charter** — the charterer hires the ship for a period, pays **hire per day** plus ALL voyage costs (bunkers, ports, canals), and directs her commercially. Full flexibility, full exposure — Module 4 dissects it.\n- **Bareboat (demise)** — the charterer takes the ship, crews and operates it. Financing structure more than a trading tool.\n\nThe chart below arranges them by who carries which cost and risk — the single most-tested distinction in chartering interviews.`,
      visual: 'charter-types',
    },
    {
      id: 'market-research',
      title: 'Market Research — Reading the Freight Market',
      body: `Freight is a traded market with its own supply and demand:\n\n- **Demand side** — cargo volumes (OPEC quotas, refinery runs, arbitrage flows) × **distance**: the market's true unit is the **tonne-mile**. A closed canal or a shifted arbitrage (WAF crude to Asia instead of Europe) tightens ships without a single extra barrel.\n- **Supply side** — the fleet: newbuilding deliveries, scrapping, ships absorbed by floating storage or sanctioned trades, and **position lists** (which ships open WHERE, WHEN — the local supply that actually prices your cargo).\n- **The indices** — Baltic Exchange assessments (TD3C, TD20, TC2…), broker reports, fixture lists: yesterday's fixtures are today's negotiation anchors.\n- **The forward market** — **FFAs** (freight forward agreements) price future months and let owners and charterers hedge freight like any other commodity leg — tying this course straight back to the futures machinery of the commodity lectures.\n\nThe practical output of research is simple: before quoting, know **the last done** (comparable fixture), **the list** (how many ships CAN do your dates), and **the direction** (is the list shortening?).`,
    },
    {
      id: 'quoting',
      title: 'Quoting Cargoes and Vessels',
      body: `The market speaks in compressed, standardised messages:\n\n**A cargo quote (charterer's order):**\n\n> *80,000 t ± 5% MOLCO crude oil · Bonny → UKC-Med, orders · laycan 12–14 March · WS guide, 2.5% total commission · charterer XYZ*\n\nEvery element is negotiable and every element is information: the **tolerance** (MOLCO — more or less charterer's option — vs MOLOO, owner's option), the **laycan** (the 3-day window the ship must tender within), the range of discharge options, the commission.\n\n**A vessel quote (owner's position):**\n\n> *M/T Meridian · 105,000 dwt, 2019, double hull · open Rotterdam 8 March · last 3 cargoes: crude/crude/fuel oil · approvals: Shell, BP, Total · owners ABC*\n\nThe **open position** (where and when she comes free), the **last cargoes** (contamination risk for the next one), and the **approvals** (which oil majors' vetting she has passed) decide whether she is even a candidate before price is discussed.`,
    },
    {
      id: 'shipbroker',
      title: 'The Role of the Shipbroker — and Networking',
      body: `Almost every tanker fixture passes through **competitive shipbrokers** — the market-makers of freight:\n\n- **What they do:** circulate orders and positions, filter candidates (approvals, size, dates), carry the **negotiation** between principals, draft the **fixture recap**, and follow the voyage's claims afterwards (a good broker earns their commission twice over in the demurrage file).\n- **What they cost:** typically **1.25% of freight per broker**, paid by the owner, plus any **address commission** the charterer takes for itself — the "2.5% total" in the quote above.\n- **What they really sell: information.** A broker sees the whole market's flow; a principal sees their own. The broker's read on "what the last comparable cargo paid, and who is quietly working what" IS the market data.\n\nHence **networking** is not a soft skill here, it is infrastructure: the tanker market is a few thousand people worldwide, reputations persist for decades, and a principal known to honour their word "on subs" gets shown ships and cargoes a difficult one never sees. Your name is your credit line.`,
    },
  ],
}

export default topic
