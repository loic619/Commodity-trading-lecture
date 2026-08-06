import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '01-laden-passage',
  title: 'Laden Passage Operations I — Tracking the Voyage',
  type: 'lecture',
  estimatedMinutes: 35,
  sections: [
    {
      id: 'position-etas',
      title: 'Vessel Position, ETAs & Onward Orders',
      body: `The ship has sailed; the operator's product is now **information**:\n\n- **Position & ETA reporting** — the CP obliges the Master to report noon positions and updated ETAs on a set schedule (and immediately when the ETA moves beyond a tolerance). Receivers plan berths, traders time sales and hedges, agents book pilots — all off this number.\n- **Onward orders** — a crude cargo fixed "UKC-Med, orders" must be **declared** by the charterer within the CP's notice structure (e.g. discharge range narrowed 72 hours before Gibraltar, final port 48 hours). Late orders = **detention** for the charterer; premature commitment kills the trading optionality the "orders" clause was bought for. The tension is the point: the trader wants to keep the destination open while the cargo is being re-sold afloat — every day of silence is option value, every day closer to the deadline is operational risk.\n- **The desk connection** — an oil cargo afloat with orders open is a live trading position: the operator's ETA discipline is what lets the trader sell the cargo two more times before Gibraltar.`,
    },
    {
      id: 'heating-tracking',
      title: 'Heating & Vessel Tracking',
      body: `**Heating.** Fuel oil, heavy crudes and bitumen carry **heating instructions** in the CP: maintain (say) 50 °C, raise to 55 °C for discharge. The ship logs tank temperatures daily; the operator watches them, because failure is asymmetric and slow — a cargo allowed to cool sets like boot polish, and re-heating burns days and bunkers *if it works at all*. Under-heating claims (unpumpable cargo, extended discharge time, ROB left on board) are among the ugliest in the book. Extra heating beyond CP instructions is billable — log it or lose it.\n\n**Tracking.** AIS made every laden tanker a public data point: operators, traders and analysts watch positions, speeds and destination fields in real time (Kpler, Vortexa — the same tools the commodity course listed as S&D sources). Operationally: verify the ship is ON the agreed route at the agreed speed (a slow ship burns your laycan at the discharge berth); commercially: remember the market watches YOUR ship too — a laden VLCC altering course for Singapore IS information, and dark activity (AIS off) is a sanctions red flag that vetting desks screen for.`,
    },
    {
      id: 'distance-time-routing',
      title: 'Distance & Time — Weather Routing',
      body: `The passage estimate from Module 1 becomes a live document:\n\n- **Distance ÷ speed = days**, but the honest version adds: current and seasonal weather margins, canal/strait queue times, and bunker-stop detours. Standard practice pads sea passages ~5% for weather.\n- **Weather routing** services take the ship's characteristics and the forecast and recommend the **least-time (or least-fuel) track** — not the shortest line: a longer route around a storm system beats a shorter one through it on days, fuel AND cargo safety. The route file also matters legally: a ship that followed a recommended weather route has a strong answer to "why did you arrive late?"\n- **Speed orders** — where the CP gives the charterer speed options (economical/full), the laden passage is the lever: slow-steam into a congested discharge port (save bunkers, arrive when the berth does) or push to catch a market window. Every knot is the cube law from the estimator.\n\nThe operator reruns the voyage estimate at every ETA revision: days, bunkers, and arrival vs the discharge programme — drift is managed early or paid for later.`,
    },
    {
      id: 'deviation',
      title: 'Deviation',
      body: `**Deviation** — departing from the contractual (customary/agreed) route — is one of maritime law's oldest and sharpest doctrines:\n\n- **Permitted:** saving life at sea (always), and typically saving property, or liberties expressly granted in the CP ("any ports in any order", bunkering deviations). Reasonable route choice for weather is not deviation.\n- **Unjustified:** everything else — including a purely commercial detour the charterer never authorised. The classical consequence is severe: the owner can lose the protection of the CP's exceptions and limitations from the moment of deviation (and can prejudice the cargo insurance) — the deviation cases are why owners' P&I clubs treat route discipline as gospel.\n- **The modern grey zone:** security reroutings. Red Sea attacks pushing ships around the Cape: is the long way a justified deviation, a CP liberty, or a breach? The answer sits in the CP's war-risks and routing clauses (CONWARTIME/VOYWAR in the dry world, their tanker equivalents here) — which is why those "boilerplate" clauses suddenly priced in 2024.\n\nOperator's rule: ANY route change beyond ordinary navigation gets flagged to charterers in writing, with reason — the paper trail converts a potential deviation dispute into an agreed adjustment.`,
    },
  ],
}

export default topic
