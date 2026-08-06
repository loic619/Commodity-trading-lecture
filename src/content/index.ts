import { topics as module1Topics } from './module-1'
import { topics as module2Topics } from './module-2'
import { topics as module3Topics } from './module-3'
import { topics as module4Topics } from './module-4'
import { topics as module5Topics } from './module-5'
import { topics as chartering1Topics } from './chartering-1'
import { topics as chartering2Topics } from './chartering-2'
import { topics as chartering3Topics } from './chartering-3'
import { topics as chartering4Topics } from './chartering-4'
import type { Module } from '@/types/content'

export const modules: Module[] = [
  {
    id: 1,
    title: 'Panorama & Vocabulary',
    objectives: [
      'Map the commodity universe — hard vs soft markets, the players (farmers, trade houses, roasters) and how a parcel travels from Dak Lak to the cup',
      'Read a futures contract like a professional: standardisation, order book, margin & clearing, and swaps',
      'Explain market structure — contango vs backwardation, the roll, and what the curve says about stocks',
      'Trade your first futures screen: buy and sell London Robusta against a live news tape — and feel the risk that hedgers pay to shed',
    ],
    topics: module1Topics,
  },
  {
    id: 2,
    title: 'Operational Mechanics & Hedging',
    objectives: [
      'Run the two PTBF trades — split any physical deal into a futures leg and a differential leg, fix it with an EFP, and manage the basis: quality, freight, tenderable parity',
      'Measure any book’s exposure (flat, basis, spread) and build the hedge that matches it — from the coverage ratio to the minimum-variance cross-hedge',
      'Work a fully hedged desk day and a full FOB→CIF trade: cost the cargo, hold the basis, and defend every decision against the news',
      'Trade the live floor: run a full book through news, margin calls and customer tenders — the course’s practical exam',
    ],
    topics: module2Topics,
  },
  {
    id: 3,
    title: 'Strategies, Logistics, ESG & Data',
    objectives: [
      'Use options on futures: calls, puts, premiums — and when optionality beats a straight hedge',
      'Work the basis with numbers: quote, compare and arbitrate differentials with the calculator',
      'Move the cargo: vessels, chartering, Worldscale freight, laytime and demurrage — the operational layer under every physical trade',
      'Assess ESG & EUDR: what the regulatory revolution does to compliant vs non-compliant coffee — and to its price',
      'Model supply & demand like an analyst, from cherry on the tree to the terminal screen',
      'Trade the season end-to-end in the group exercise: four desks, three rounds, one P&L decomposed flat / basis / costs',
    ],
    topics: module3Topics,
  },
  {
    id: 4,
    title: 'Crude Oil: Market Analysis & Refining',
    objectives: [
      'Analyse oil supply, demand and price: OPEC+, the call on OPEC, spare capacity and stocks — the data that moves the barrel',
      'Follow the value chain from wellhead to pump: distillation, conversion units and refinery complexity tiers',
      'Grade a crude — API, sulphur, yields — and price it to a refiner with the GPW & margin calculation',
      'Read the market like an analyst: the three benchmarks, the information calendar, and the technical toolkit',
    ],
    topics: module4Topics,
  },
  {
    id: 5,
    title: 'Crude Oil: The Brent Complex & Hedging',
    objectives: [
      'Identify an oil book’s exposures and apply the logic of hedging to each one',
      'Execute the simplest hedge — futures: sizing, rolling and the basis risk that remains',
      'Navigate the Brent complex: Dated, Cash BFOET, futures and how the world’s benchmark is actually built',
      'Use swaps and CFDs to hedge the gaps futures leave open',
    ],
    topics: module5Topics,
  },
  // ── Tanker Chartering and Voyage Management — the second lecture series ──
  {
    id: 6,
    title: 'Introduction — The Vessel, Worldscale & the Fixture',
    course: 'chartering',
    objectives: [
      'Read a tanker like a terminal does: history and types, structure and dimensions, tanks and lines, equipment — and compute a real maximum lift from loadlines, salinity, charts and tides',
      'Price freight in Worldscale: the elements of freight cost, the flat rate and the WS percentage, and where small tankers break the system',
      'Run the commercial process: contract types, market research, quoting cargoes and vessels, and the shipbroker’s role in the network',
      'Negotiate and close a single voyage fixture: offers and counters, freight and voyage estimates, the recap, and lifting subjects',
    ],
    topics: chartering1Topics,
  },
  {
    id: 7,
    title: 'Pre-loading & Loading Operations',
    course: 'chartering',
    objectives: [
      'Build the pre-loading file: SIRE/CDI vetting, recap vs charter parties, port and terminal clearance, and the stowage plan (segregations, pump stack, slops, reducers)',
      'Manage the laycan: early and late arrival, the cancelling option, and the delay families — weather, canals and passages',
      'Run a load port end to end: the physical and administrative layers, cargo, customs and Marpol documentation, and progress monitoring',
      'Master the loading clock: a valid NOR (the 4 Ws), berthing, STS and double-banking, cargo handling, inspection and the bill of lading',
    ],
    topics: chartering2Topics,
  },
  {
    id: 8,
    title: 'Laden Passage & Discharge Operations',
    course: 'chartering',
    objectives: [
      'Track the laden voyage: positions and ETAs, onward orders, heating, weather routing — and the law of deviation',
      'Navigate the limits: pilot charts, IWL/INL, SECAs, river transits, draft restrictions, detention and piracy',
      'Keep the paper with the oil afloat: changing bills of lading, letters of indemnity, and discharge orders',
      'Close the voyage at the discharge port: NOR to outturn, back pressure and pumping logs, quantity and quality claims, slops, COW and the Marpol pre-wash',
    ],
    topics: chartering3Topics,
  },
  {
    id: 9,
    title: 'Demurrage, the Time Charter & Disputes',
    course: 'chartering',
    objectives: [
      'Write the claims file: demurrage (and why tankers pay no despatch), freight, deadfreight, detention, deviation and the smaller heads — inside their time bars, with the full document bundle',
      'Calculate demurrage clause by clause: commencement, counting, exceptions, and “once on demurrage, always on demurrage” — through two worked examples and an exercise',
      'Operate a time charter: delivery and redelivery, hire and off-hire, bunkers, sublet, performance warranties, the final voyage and dry docking',
      'Resolve disputes proportionately: ENE, ENI, mediation, arbitration vs litigation, the New York Convention 1958, and what can (and cannot) be appealed',
    ],
    topics: chartering4Topics,
  },
]
