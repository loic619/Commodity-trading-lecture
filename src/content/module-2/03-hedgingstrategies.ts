import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '03-hedgingstrategies',
  title: 'Hedging Principles & Risk Strategies',
  type: 'lecture',
  estimatedMinutes: 40,
  sections: [
    {
      id: 'hedging-principle',
      title: 'Why Commercial Hedging Opposes the Speculator',
      body: `A commercial trader hedges by taking the **opposite position in futures** to their physical position.\n\n- Physical long (owns coffee) → sell futures (short hedge)\n- Physical short (sold coffee not yet bought) → buy futures (long hedge)\n\nThe commercial hedger's futures position is always the opposite of the speculator's preferred direction. This is why speculators provide liquidity that commercials need — they are natural counterparties.\n\n**The speculator profits when prices move in one direction. The commercial hedger profits from the basis, not the direction.**`,
    },
    {
      id: 'incoterms',
      title: 'Incoterms & Logistics Risk Transfer',
      body: `**Incoterms** (International Commercial Terms) define where responsibility for goods, insurance, and freight transfers from seller to buyer.\n\nKey terms for commodity trading:\n\n**FOB (Free on Board):** Seller's responsibility ends when the goods are **on board the vessel** at the export port. Buyer arranges and pays freight/insurance.\n\n**CIF (Cost, Insurance, Freight):** Seller pays freight and insurance to the destination port — but **risk still transfers at origin, once the goods are on board the vessel**. Cost and risk part ways: that split is the whole point of CIF.\n\n**CFR (Cost and Freight):** Like CIF but without insurance — buyer arranges their own.\n\n**DAP (Delivered at Place):** Seller delivers to a named destination, duty unpaid.\n\nTwo precision points for the exam room and the desk:\n\n- The old **"ship's rail"** test was retired in **Incoterms 2010**; since then the criterion is *on board the vessel*.\n- FOB/CIF/CFR are formally **maritime bulk** terms. For containerised cargo ICC recommends **FCA / CIP** (risk transfers when the container is handed to the carrier) — although coffee trade practice stubbornly keeps saying "FOB".\n\nChoosing the right Incoterm affects your logistics exposure, insurance responsibilities, and pricing competitiveness.

Read the diagram below as **two separate questions**, because that is the mistake to avoid: where does COST stop being the seller's, and where does RISK stop being the seller's? For FOB and FCA they are the same point. For the C-terms they are not — under CIF the seller pays freight all the way to the destination port while risk transferred on board at origin, and the shaded gap between the two bars is where cargoes get lost and arguments start.

Commercially this is a pricing question, not a legal one: the Incoterm decides which costs sit inside your differential and which exposures stay on your book. An FOB quote and a CIF quote for the same coffee are not comparable until you have moved freight, insurance and risk to the same point on that chain.`,
      visual: 'incoterms-ladder',
    },
    {
      id: 'robusta-vs-arabica',
      title: 'Robusta vs Arabica: Contract Specifics',
      body: `Physical coffee trades involve two very different contracts with important implications:\n\n**ICE Robusta — RC (London):**\n- 10 MT per lot, quoted in US\\$/tonne\n- Delivery: **ICE-registered warehouses in the EU, UK & USA** (Antwerp, Amsterdam, Hamburg/Bremen, Le Havre, London area, New Orleans…)\n- Quality: graded into **classes** — Class 1 delivers at the contract price; better or worse classes tender at **fixed premiums/discounts** (from +\\$30/t down to −\\$90/t)\n\n**ICE Arabica — KC, the "C" contract (New York):**\n- 37,500 lbs per lot (~17 MT), quoted in ¢/lb\n- Delivery: exchange-licensed warehouses in the US and Europe\n- Grade: **washed arabica** from ~20 deliverable growths, screen and defect tested\n- **Growth differentials apply on tender** — Colombia at a fixed *premium* (+2¢/lb), several growths (e.g. Burundi, Rwanda, India) at discounts of 1–4¢/lb; **Brazilian naturals are not tenderable at all**. Always verify against the current ICE rulebook — these schedules change.\n\n**Mastering these specifications is a competitive advantage** — knowing which origins are certifiable, when delivery economics are favorable, and how tenders constrain prices (tenderable parity).

Step back from the rulebook for a moment and look at the two coffees side by side. Almost every contract difference above descends from a botanical one: robusta grows hot, low and hardy, so it is the cheap, bitter, high-caffeine bean that goes into instant and espresso bases, trades in round metric lots on London, and is graded by class. Arabica needs altitude and care, so it is the aromatic premium bean, trades in imperial lots on New York, and is graded by growth. Two species, two exchanges, two price series — and the spread between them is a trade in its own right.`,
      visual: 'arabica-robusta',
    },
    {
      id: 'tenderable-parity',
      title: 'Tenderable Parity: Theoretical Price Limits',
      body: `**Tenderable parity** answers one question: *is my coffee worth more delivered to the exchange, or sold in the cash market?* It is an arbitrage bound, so write it as a comparison of two realisations:\n\n> **Exchange realisation = Futures price ± class/growth differential − delivery costs**\n> *(delivery costs = freight to an exchange warehouse + handling + grading & certification fees + financing while you wait)*\n>\n> **Cash realisation = Futures price + market differential**\n\nWhen **exchange realisation > cash realisation**, sellers tender; the resulting deliveries cap how far futures can trade above the physical market. When it is below, nobody tenders and the cash market sets the pace.\n\n**Worked example (Robusta, \\$/t):** futures at \\$4,500; your coffee grades **Class 1** (par). Delivery costs: freight to Antwerp \\$120 + handling/warehouse \\$60 + grading \\$25 + financing \\$45 = **\\$250**.\n\n- Exchange realisation: 4,500 + 0 − 250 = **\\$4,250**\n- Cash market bids Gd2 at futures − \\$300 = **\\$4,200**\n- → Tendering wins by **\\$50/t**: coffee flows to the exchange (exactly the Vietnam 2024–25 mechanism from Module 1)\n\nRe-run it with the cash differential at −\\$200 and tendering loses by \\$50 — the flow stops. That switch point **is** tenderable parity: the fundamental anchor that forces physical and futures to converge.

Find the switch point yourself below. Drag the cash differential down the number line and watch the verdict flip as it crosses parity — which sits at **class differential − delivery costs**, not at zero. Then change the delivery costs and watch the parity line itself move: it is the cost of getting coffee into a certified warehouse that sets how far the cash market is allowed to fall.

One structural detail worth stopping on: freight is the largest cost line, and only the **import** side can pay it. An exporter at origin cannot tender, so this floor binds on the destination differential, not the FOB one.`,
      visual: 'tenderable-parity',
    },
  ],
}

export default topic
