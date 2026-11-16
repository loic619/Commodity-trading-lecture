import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '01-differential',
  title: 'The Differential & Basis Management',
  type: 'lecture',
  estimatedMinutes: 30,
  sections: [
    {
      id: 'what-is-differential',
      title: 'What is the Differential?',
      body: `The **differential** (also called the basis in grain markets) is the premium or discount at which physical coffee trades relative to the futures price.\n\n**Physical price = Futures price ± Differential**\n\nA coffee from Colombia might trade at ICE New York March + 35¢/lb.\nA lower-grade Vietnam Robusta might trade at ICE London March − $30/MT.\n\n*(You will still hear old-timers say "LIFFE" for the London contract — the exchange has been ICE Futures Europe since 2013.)*\n\nThe differential is the market's way of pricing everything the futures contract ignores: origin, quality, harvest timing, local logistics, certifiability.

Take the equation apart below. The point to leave with is that the differential is never one number — it is a **residual**, and it decomposes into the handful of commercial judgements someone at the desk actually made: quality against the contract grade, the cost of getting it out of the country, where you are in the harvest, and what the local balance looks like. None of those appear on the screen.

Watch the units while you click through. London quotes **\$/tonne** and New York quotes **US cents/pound**, so a differential is meaningless until you know which contract it hangs off: 1 ¢/lb = \$22.05/t.`,
      visual: 'differential-anatomy',
    },
    {
      id: 'arbitrage-types',
      title: 'Three Types of Arbitrage',
      body: `**Origin arbitrage:** Buying in a cheaper origin and selling in a market where demand is higher. Example: buying Vietnam Robusta for European instant coffee manufacturers when the differential is attractive vs Brazilian Conillon.\n\n**Quality arbitrage:** Blending lower-grade lots with higher-grade to create a certifiable grade that trades near the exchange price, while the input cost was lower than the full premium.\n\n**Logistic arbitrage:** Routing physical cargo through an alternative port or routing to exploit a freight differential. Example: redirecting a shipment from Rotterdam to Hamburg when Hamburg warehouse receipts trade at a better basis.

Work each one leg by leg below. Two things to notice. First, the flat price is hedged out of all three — you are trading **one differential against another**, which is why the futures screen never tells you whether you were right. Second, read the right-hand panel each time: none of these is risk-free, and the word *arbitrage* is doing a lot of work. The edge is only an edge net of the thing that eats it.`,
      visual: 'arbitrage-map',
    },
    {
      id: 'basis-risk',
      title: 'Basis Risk',
      body: `A trader who hedges price risk with futures eliminates **flat price risk** but retains **basis risk** — the risk that the differential moves adversely.\n\nFirst, fix the vocabulary (M2 examiners care):\n\n- The basis **strengthens** when the differential moves *up* (toward or above futures)\n- The basis **weakens** when it moves *down*\n- The hedged owner of physical — **long physical / short futures** — is **long the basis**: strengthening is their profit, weakening their loss. A short-basis position (sold physical forward, long futures) wants the opposite.\n\nExample:\n- Trader buys physical Robusta at ICE London **+ $10/MT** and sells futures at the same time (hedge)\n- Flat price risk: eliminated — this is the **PTBF pair trade**, which you will run end to end in the case study later in this module\n- Basis risk: by the time they sell, the differential has **weakened from +$10 to −$20/MT** → they realise **−$30/MT on the basis**, no matter what the flat price did\n\nBasis risk is the core commercial risk that separates skilled physical traders from pure financial speculators.

Fix the direction before the arithmetic. The compass below is about **which way is good for you**, nothing else — pick the desk situation you are in and push the differential each way. Note the third situation in particular: an unfixed, unhedged PTBF purchase is *not* a basis position at all, it is an unhedged commitment.

If you forget everything else, keep this: **you own the physical, so you own the gap — and the gap getting bigger is good for you.** Strengthen, weaken, long basis and short basis all fall out of that one sentence.`,
      visual: 'basis-compass',
    },
    {
      id: 'hedged-pnl',
      title: 'The Hedged Trade P&L — Three Legs',
      body: `Put the whole trade on paper once, and the vocabulary becomes arithmetic. **Buy 100 t physical at London \\$2,400 + \\$10 = \\$2,410**, hedge by **selling futures at \\$2,400**. Later the market has fallen to \\$2,250 and the differential has weakened to −\\$20:\n\n| Leg | Entry | Exit | P&L ($/t) |\n|---|---|---|---|\n| Physical | buy 2,410 | sell 2,250 − 20 = 2,230 | **−180** |\n| Futures (short) | sold 2,400 | bought back 2,250 | **+150** |\n| **Net** | | | **−30** |\n\nNet = **exit diff − entry diff** = (−20) − (+10) = **−\\$30/t**, i.e. −\\$3,000 on the parcel. The \\$150 flat-price collapse never touched the book.\n\nNow verify it isn't a coincidence. The graph below plots both legs between entry and exit, so the **vertical gap between the two paths is the differential**. Drag the amber handle — the exit futures — anywhere from \\$1,800 to \\$3,000: both paths move together, the two big legs swing violently, and their sum never budges. Then drag either cyan handle: the gap changes and the P&L follows one-for-one. That asymmetry is the entire business model of a physical trading desk.`,
      visual: 'basis-pnl',
    },
  ],
}

export default topic
