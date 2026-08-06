import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '02-arrival-delays',
  title: 'Early & Late Arrival, Delays and Cancelling',
  type: 'lecture',
  estimatedMinutes: 35,
  sections: [
    {
      id: 'early-late-arrival',
      title: 'Early / Late Arrival — What Each One Costs',
      body: `The **laycan** (layday/cancelling window) is the fixture's timing spine, and missing it in either direction has asymmetric consequences:\n\n**Early arrival.** The ship tenders NOR before the layday. Under most tanker CPs, laytime does **not** start before the layday (or starts only if the terminal chooses to berth her early). The owner has donated waiting time — but note the trap for the charterer: some CPs and terminals treat "berthed early at charterer's convenience" as **time counting**. Know which regime you fixed.\n\n**Late arrival.** The ship misses the cancelling date. The charterer gains the **option to cancel** — not damages, just the option: chartering's equivalent of a free put on the freight market. If the market has FALLEN since fixing, cancelling and re-fixing cheaper is pure gain; if it has risen, you keep the ship and say nothing. Most CPs oblige the owner, once late arrival is certain, to ask the charterer to **declare** the option in advance (the ShellVoy/BPVoy interpellation mechanism) — precisely so an owner does not steam a laden ballast leg toward a cancellation.\n\nEither way, the operator's job from Module 2's monitoring rhythm: see the laycan risk COMING, and renegotiate (extend the can, adjust the freight) while both sides still have options.`,
    },
    {
      id: 'delays',
      title: 'Delays — Weather, Cancelling, Canals and Passages',
      body: `Between fixture and NOR, the classic delay families — and who eats each one:\n\n- **Weather** — ocean storms and routing detours are the **owner's** time (the ship is not yet on laytime); weather AT the port (berth closed, swell over the bar) usually burns **laytime or demurrage** once the clock runs — subject to the CP's weather exceptions. Same storm, different clause, different payer.\n- **Canals & passages** — Suez and Panama impose convoy schedules, booking slots and toll regimes; the Turkish Straits queue in winter; chokepoints add **variance**, not just days. A missed Suez convoy is 24 hours; a Panama booking missed can be far worse. Security reroutings (Red Sea → Cape) rewrite the whole estimate — distance, bunkers AND the flat-rate assumptions.\n- **Prior-voyage knock-on** — the most common cause of a missed laycan is simply the previous discharge running long: why owners pad their "open" dates and why charterers discount an itinerary that shows zero slack.\n- **Cancelling interplay** — every delay is ultimately priced against the laycan: a 2-day weather delay that still makes the can costs nothing contractually; a 6-hour delay that misses the can hands the charterer the cancellation option.\n\nThe estimating reflex: pad passages with a **weather margin** (5% is the classic figure), book canal slots early, and treat every chokepoint on the itinerary as a risk line in the voyage estimate — not a footnote.`,
    },
  ],
}

export default topic
