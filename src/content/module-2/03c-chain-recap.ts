import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '03c-chain-recap',
  title: 'Recap: One Parcel, Every Desk, Every Risk',
  type: 'lecture',
  estimatedMinutes: 8,
  sections: [
    {
      id: 'follow-the-parcel',
      title: 'Follow the Parcel — the Whole Chain, One Risk Map',
      body: `Step back from the mechanics. You have now met **PTBF**, the **differential**, the **flat / basis split** and the **hedging toolkit** — enough vocabulary to read the entire supply chain at once, which is exactly why this walk-through was held back from Module 1.\n\nFollow **one 100 t parcel** of Robusta from the farm gate in Dak Lak to the roaster in Hamburg. At every hop, two things travel with it:\n\n- the **price form** it trades in — VND outright → FOB differential → instore PTBF → fixed retail — mutating as it moves;\n- the **risk tiles** — flat, differential, currency — flipping on and off as each desk hedges what it can and keeps what it can't.\n\nClick through the five tiers below. Notice how the **flat-price risk** the farmer carries naked gets hedged away in the middle of the chain and then **re-appears, inverted**, at the roaster who sells fixed retail against unfixed green coffee — and stop on the **exporter** to see the third, hidden risk (currency) eat a whole origination margin in the FX mini-sim.\n\nThis is the map the rest of the course lives inside: the exporter's origination margin, the trade house's landed differential, the freight leg, the roaster's fixing option. Every trade you are about to run sits somewhere on this chain.`,
      visual: 'parcel-journey',
    },
  ],
}

export default topic
