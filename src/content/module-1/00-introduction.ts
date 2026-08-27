import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '00-introduction',
  title: 'Introduction: What a Commodity Trader Actually Does',
  type: 'lecture',
  estimatedMinutes: 15,
  sections: [
    {
      id: 'three-aspects',
      title: 'Key Aspects of a Commodity Trader',
      body: `Before any market theory, understand the job. Every commodity trade — a bag of coffee or a VLCC of crude — has to clear **three aspects at once**:\n\n- **Commercial** — can I buy it and sell it at a margin? Finding the counterparties, negotiating the price *form*, reading supply and demand, choosing which risk to keep.\n- **Logistics** — can I actually move it, on spec and on time? Freight, quality, documents, timing. The goods must physically travel from where they are grown to where they are consumed.\n- **Financial** — can I fund it, and will I be paid? The cargo is paid for months before the customer pays you, the hedge consumes margin cash daily, and the counterparty must still be solvent at delivery.\n\nThe three are not a sequence, they are a **simultaneous test**: a brilliant price on a cargo that cannot ship — or that ships and is never paid for — is not a good trade. Click each aspect below to see what sits inside it and which desk owns it.\n\n*(You will meet the same hub-and-spoke shape again in a few sections, for the three functions of an exchange — the market is built to serve exactly this job.)*`,
      visual: 'trader-pillars',
    },
    {
      id: 'what-we-trade',
      title: 'What Do We Trade? Risks and Paper',
      body: `A common misconception: that a trader's product is *coffee*, or *crude*. It is not. The goods pass through; what the trader actually takes on, prices, and manages is a **basket of risks** — and the paper that transfers them.\n\nThe risks you carry the moment you own a cargo:\n\n- **Price (flat) risk** — the value of what you own moves while you hold it\n- **Counterparty risk** — your buyer or seller fails to perform, especially once the price has moved against them\n- **Logistic risk** — delays, vessels, congestion, strikes, a closed canal\n- **Quality risk** — what arrives does not match the contract spec\n- **Financing / liquidity risk** — you pay months before you are paid, and the hedge drinks cash daily\n- **Currency risk** — you buy in one currency and sell in another\n- **Political & regulatory risk** — export bans, tariffs, sanctions, new compliance regimes\n\nNow the point that reframes the whole industry: **fundamentally, anyone sitting between the original producer and the final consumer is a trader.** A supermarket is a giant trader — it buys enormous volumes forward, warehouses them and resells at a posted price. A factory is a trader too: it buys raw material, holds it, transforms it and sells the output. Neither calls itself one, but both buy, hold and sell, and both carry most of the basket above.\n\nWalk the chain below and compare the risk baskets. The similarity is the surprise — and it sets up the one real difference, in the next section.`,
      visual: 'everyone-is-a-trader',
    },
    {
      id: 'inventing-ptbf',
      title: 'The One Real Difference: How We Manage Price Risk',
      body: `If the supermarket and the factory carry nearly the same risks, what makes a *commodity* trader different? One line of the basket: **how the price risk is managed**. Follow the logic from the shelf backwards — it ends somewhere specific.\n\n**Start with the final consumer.** They buy **spot**: the goods must physically be on the shelf, with a known purchase cost, before any selling price can be displayed. And a retailer cannot reprice its shelves every day — so it negotiates **huge volumes over a long horizon at a fixed price** (six months, a year).\n\n**Their counterparty, the manufacturer,** has therefore *sold* at a flat price. Symmetry says: if you sold flat, buy flat — cover the sale with a fixed-price purchase and lock the margin.\n\n**But here come two problems.** Buy the whole year forward at a fixed price, and if the market runs up, your supplier is committed to deliver far below the market: the incentive to default becomes enormous. You did not remove risk, you **converted price risk into counterparty risk**.\n\n**So the best strategy is to split the two decisions:** buy now — *secure the volume* — but fix the price later, preferably at the last minute, when the exposure is short and performance stays rational for both sides.\n\n**How do you fix a price later?** You dismantle it into two components: a **floating reference price** that anyone can observe and that moves every day, plus a **fixed premium or discount** against that reference for this specific coffee (origin, quality, port, timing). Sign the differential today; fix the reference leg later.\n\n**And bingo — you have just invented the PTBF contract: Price To Be Fixed.** Nobody designed it in a committee; it falls out of the constraints. Step through the derivation below.`,
      visual: 'ptbf-invention',
    },
    {
      id: 'the-other-end',
      title: 'The Other End of the Chain — and What the Trader Converts',
      body: `Walk to the opposite end and you find the mirror image. **Producers** have **fixed costs**, a harvest that arrives all at once, and a strong preference to **sell at a fixed price once production is finished** — they are not in the business of running an open position on their own crop for months.\n\nSo the two ends of the chain want incompatible things:\n\n| | Producer | Factory |\n|---|---|---|\n| Cost / revenue side | fixed cost of production | revenue fixed by a 1-year sale |\n| Wants to | **sell flat**, now, when the crop is in | **fix late**, at the last minute |\n| Fears | a price collapse before selling | a rally after buying — and supplier default |\n\n**The person linking them is the commodity trader.** They buy in the form the producer can accept and sell in the form the factory can accept — and in doing so they perform the industry's core transformation: they **convert a flat-price risk into a differential risk**, then keep and manage that differential.\n\nThat is the whole business model in one line, and it explains everything that follows. If the trader keeps the differential rather than the flat price, they need a market on which to lay the flat price off — which is what the exchange is for (next topic). They need to understand what moves the reference and what moves the differential — supply, demand, structure. And they need the machinery of PTBF itself: how to fix, when to fix, who holds the fixing right.\n\n**We will dig into all of these trade mechanisms over the course — and into that specific PTBF contract in particular.**`,
    },
  ],
}

export default topic
