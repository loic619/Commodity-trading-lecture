import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '01-exposure-hedging',
  title: 'Exposure & the Logic of Hedging',
  type: 'lecture',
  estimatedMinutes: 18,
  sections: [
    {
      id: 'exposure-vocab',
      title: 'Long & Short — Loosely Used',
      body: `Before you can hedge, you have to know **what kind of position you actually hold**. The words traders use are slippery — "long" and "short" get applied to physical, structural and price positions interchangeably:\n\n- *"Europe is **short** distillate"* — a structural/regional supply statement\n- *"Refiners are **long** the margin"* — a spread position\n- *"He is **long** a term contract of Bonny Light"* — a physical commitment\n- *"She is **short** jet fuel into the Thames"* — an obligation to deliver she hasn't covered\n\nSame two words, four different meanings. Context tells you which one matters — and only one of them can be hedged.\n\nClick through the four below and check the tag on each. The habit worth building is to ask, every time someone says they are long or short: **long of what, over what period, priced how?** If you cannot answer all three, there is nothing to hedge yet.`,
      visual: 'long-short-senses',
    },
    {
      id: 'price-risk-pnl',
      title: 'Long, Short, Neutral — for Price Risk',
      body: `Strip away the jargon and, **for price-risk management**, the three positions are simple:\n\n- **Long** — you make money if the price rises tomorrow, lose if it falls.\n- **Short** — you lose if the price rises tomorrow, make money if it falls.\n- **Neutral** — a move in the market tomorrow does **not** change your P&L.\n\nThe whole point of a hedge is to move you from long *or* short toward **neutral** on the risk you don't want.`,
      visual: 'exposure-ladder',
    },
    {
      id: 'physical-vs-price',
      title: 'A Physical Position Is Not a Price Risk',
      body: `Here is the distinction that trips people up:\n\n> **A physical position and a price risk are not the same thing.**\n\nOften the difference is simply **fixed vs floating pricing**.\n\nIf you buy a cargo and *immediately* sell it on the same floating formula, you hold a physical position — barrels are moving — but you may carry **no price risk** at all, because both legs reprice together.\n\nThe crucial rule:\n\n> **Only when you have a price risk can you hedge.**\n\nHedging a position that carries no price risk just *creates* a new exposure.\n\nFlip the two legs below. The cargo is identical in all four combinations — the barrels, the vessel and the counterparties never change — and only the pricing basis moves. Watch the exposure appear and vanish, and note the bottom-right case especially: buy floating, sell floating, and you are carrying a cargo with no flat-price risk at all. That is the one where a reflexive hedge turns a flat book into a short one.`,
      visual: 'fixed-vs-floating',
    },
    {
      id: 'hedging-defined',
      title: 'What Hedging Actually Is',
      body: `The textbook definition:\n\n> "The taking of a position on a **derivative** market which is **equal and opposite** to a physical position, to protect against adverse price movement."\n\nAnd the part beginners forget:\n\n> "A position is **put on** to protect and **taken off** as the risk disappears. Hedging requires that we understand **when price risk begins and when it ends**."\n\nA hedge is not "buy futures and forget." It is switched **on** the moment you take price risk, and switched **off** the moment that risk is gone. Knowing those two moments is most of the skill.\n\nStep through one real cargo below and watch the two tracks. A correct hedge makes them identical — anywhere the hedge bar is on and the risk bar is off, you are not hedging, you are trading. Both ends of that timeline are mistakes a desk actually makes, and neither one looks like a mistake at the time.`,
      visual: 'hedge-lifecycle',
    },
  ],
}

export default topic
