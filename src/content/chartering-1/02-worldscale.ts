import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '02-worldscale',
  title: 'Worldscale — Pricing Tanker Freight',
  type: 'lecture',
  estimatedMinutes: 40,
  sections: [
    {
      id: 'freight-cost-elements',
      title: 'Elements of Freight Costs',
      body: `Before the index, understand what a voyage actually costs. An owner's price for carrying your cargo decomposes into:\n\n- **Capital costs** — the ship's financing/depreciation: it runs whether she moves or not\n- **Operating costs (OPEX)** — crew, insurance (H&M, P&I), stores, maintenance, management: roughly fixed per day\n- **Voyage costs** — the trip-specific bill: **bunkers** (by far the largest, driven by distance, speed and fuel price), **port costs** (dues, pilots, tugs, agency), **canal tolls** (Suez, Panama)\n- **Cargo-handling costs** — where applicable\n\nThe owner recovers voyage costs from the freight and needs the remainder — the **TCE, time-charter equivalent, in \\$/day** — to beat their next-best employment. Two maxims govern their arithmetic: **time = money** (every extra day dilutes the freight over more days) and **higher speed = more bunkers** (consumption rises with roughly the cube of speed). Every negotiation in this course is two parties running this same sum with different assumptions.`,
    },
    {
      id: 'understanding-worldscale',
      title: 'Understanding & Calculating Worldscale',
      body: `A crude cargo's discharge port is often **unknown at fixing** — "Bonny to UKC-Med, orders to follow". A flat \\$/t quote can't price an undecided voyage; **Worldscale** can. The association publishes, for every conceivable load/discharge pair, a **flat rate in \\$/t**: the cost of the round voyage for a **standard theoretical tanker** (75,000 dwt, 14.5 kn, fixed daily hire, bunker consumption and port time), recalculated **annually** with updated bunker prices, port costs and exchange rates.\n\nThe market then negotiates a **percentage of flat**: \n\n> **Freight = flat rate × (WS points ÷ 100) × cargo tonnes**\n\n**WS100** = the book rate; **WS80** = 80% of it; **WS190** = a hot market. The genius of the system: one number (the WS level) prices EVERY destination consistently, so "orders to follow" costs nothing to negotiate — the flat rate absorbs the voyage differences, the WS% expresses the market. Work the calculator below and reproduce the numbers by hand once.`,
      visual: 'worldscale-calculator',
    },
    {
      id: 'small-tanker-differences',
      title: 'Differences with Small Tankers',
      body: `Worldscale was built for the crude trades; the smaller and cleaner the ship, the less pure the system:\n\n- **Economics of scale cut the other way** — the standard ship is 75,000 dwt, so a 30,000 t products cargo on an MR naturally trades at much **higher WS levels** than a VLCC stem (WS150–250 vs WS40–80): same book, different neighbourhoods. A WS level is meaningful only within its size class.\n- **Lumpsum and \\$/t quotes** take over where voyages are fully defined — short-haul products, intra-Med, coasters — and in chemicals the market quotes **\\$/t by parcel** with COAs, not WS at all.\n- **Minimum cargo / overage** — small-tanker fixtures habitually carry a minimum quantity with **overage** (extra tonnes at reduced freight, typically 50% of the rate), because the last tonnes cost the owner almost nothing.\n- **Fixed differentials and port surcharges** bite harder on small stems: a \\$150k port bill spread over 30,000 t is five times the \\$/t of the same bill on 150,000 t.\n\nThe reflex to build: before comparing two quotes, put BOTH back into \\$/t **all-in for your parcel size** — WS is a language, not a price.`,
    },
    {
      id: 'worldscale-exercises',
      title: 'Worldscale Freight Exercises — and the Review',
      body: `**Exercise 1 — the base case.** Flat rate \\$7.60/t, cargo 80,000 t, market at WS95. Freight?\n\n> 7.60 × 0.95 × 80,000 = **\\$577,600**\n\n**Exercise 2 — the rally.** Same cargo; the market jumps to WS170 after a hurricane closes the US Gulf. Freight = 7.60 × 1.70 × 80,000 = **\\$1,033,600** — the SAME voyage nearly doubles, with the flat rate unchanged: the WS% is where the market lives.\n\n**Exercise 3 — compare sizes.** A Suezmax (130,000 t, flat \\$6.90) at WS85 vs an Aframax (80,000 t, flat \\$7.60) at WS120:\n\n> Suezmax: 6.90 × 0.85 = \\$5.87/t · Aframax: 7.60 × 1.20 = \\$9.12/t\n\nThe bigger ship is 36% cheaper per tonne — IF you have the volume and the ports take her draft (Module 1's exercise again: check before you celebrate).\n\n**Review — the three classic mistakes**: forgetting that flat rates change every 1 January (a WS60 done in December is not comparable to a WS60 done in January); applying a WS% to the WRONG flat (each load/discharge pair has its own); and ignoring **fixed differentials** (added AFTER the percentage) vs **variable differentials** (added BEFORE) — the order-of-operations trap from the pink pages.`,
    },
  ],
}

export default topic
