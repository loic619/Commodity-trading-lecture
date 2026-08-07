import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '01a-universe',
  title: 'The Commodity Universe & the Players',
  type: 'lecture',
  estimatedMinutes: 10,
  sections: [
    {
      id: 'classification',
      title: 'The Commodity Universe — Hard vs Soft',
      body: `Coffee is one market among many. Zoom out: commodities divide into two broad families.\n\n**Hard Commodities** — extracted from the earth:\n- Energy: crude oil (Brent, WTI), natural gas, coal\n- Metals: copper, aluminium, gold, iron ore\n\n**Soft Commodities** — grown or raised:\n- Agricultural grains: wheat, corn, soybeans\n- Tropicals: coffee (Arabica, Robusta), cocoa, sugar, cotton\n\nThe distinction matters because hard and soft commodities follow very different supply/demand dynamics, seasonality, and storage constraints — but they all rely on the same market machinery you just saw.\n\nOne name to retain for the whole course: the **"ABCD"** — **A**rcher Daniels Midland, **B**unge, **C**argill and Louis **D**reyfus, the four giant agricultural trading houses that move these markets (alongside coffee specialists like Neumann, Volcafe, Sucafina and Olam). You will walk the full chain of players — farmer to roaster — in Module 2, once the hedging vocabulary is in place.\n\nUnder every category in the chart you will find **ticker chips** — crude, products, natural gas, coal and German power on the energy side; gold, silver, copper, LME aluminium and iron ore among the metals; coffee (both), cocoa (London *and* New York), cotton, sugar, wheat (Chicago — the world benchmark — *and* Paris MATIF), corn and orange juice among the crops; lean hogs, live cattle, feeder cattle and Class III milk among the animal products. Each one is a real futures contract: **click a chip** to open its spec card — exchange, lot size, quotation, the typical year of listed contracts, origin & quality specs, delivery points and Incoterm.\n\nRead a few and notice how much the *same legal form* differs underneath: origin runs from "US-grown only" (cotton) to ~28 origins (sugar) to none at all (Brent, coal, power — cash-settled); delivery runs from a warehouse warrant to FOB the buyer's vessel to one inland pipeline hub (the mechanism behind WTI's famous **negative price of April 2020**) to *live animals at a Kansas stockyard*; and the calendar itself tells you the physics — energy lists all 12 months, the ags follow their crop cycles, gold never has a season, the LME still quotes *daily* dates three months out, and non-storable markets (power, livestock) have no carry linking one month to the next at all.`,
      visual: 'commodity-donut-chart',
    },
    {
      id: 'robusta-contract',
      title: 'Anatomy of a Futures Contract: ICE Robusta',
      body: `Before those players can trade with each other, they need the instrument itself. What does "standard-spec" actually mean? A futures contract standardises **everything except price** — that is what makes thousands of strangers able to trade it.\n\nThe **ICE Robusta Coffee (RC)** contract shows the machinery. Delivery runs through **ICE-registered warehouses**: physical coffee is turned into a **warrant**, sampled and **graded** against a quality ladder, and that warrant can then be delivered by a contract seller to settle their obligation — the full mechanics of futures positions come in the next topic.\n\nThe **quality ladder** is the bridge between an idealised contract and messy real-world coffee: Class 1 delivers at the contract price, better coffee earns a fixed premium, worse coffee a fixed discount. The differentials are set by the exchange — not negotiated — which is exactly what keeps delivery predictable.`,
      visual: 'robusta-contract',
    },
    {
      id: 'warrant-lifecycle',
      title: 'From Bags to Warrant: How Coffee Becomes Deliverable',
      body: `The quality ladder needs a process behind it. This is the path every deliverable lot walks — from arrival at a licensed warehouse to the electronic **warrant** that can settle a short futures position. The exam in the middle (sampling + grading) is what makes 10 tonnes in Antwerp fungible with 10 tonnes in Hamburg \u2014 and it is exactly the machinery Vietnam's exporters used in the 2024\u201325 buyer-of-last-resort episode you will meet in Module 2.`,
      visual: 'warrant-lifecycle',
    },
  ],
}

export default topic
