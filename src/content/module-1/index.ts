import panorama from './01-panorama'
import universe from './01a-universe'
import checkpoint from './01b-panorama-quiz'
import keyconcept from './02-keyconcept'
import marketStructure from './03-market-structure'
import supplyDemand from './04-supply-demand'
import dayOneDesk from './05-day-one-desk'
import futuresFirst from './06-futures-first'
import careersDesk from './07-careers-desk'
import type { Topic } from '@/types/content'

// Pedagogical order: what a market is → the universe & players → what moves
// prices → what a futures contract is (margin, swaps, EFP) → market structure
// → trade futures against the news (speculation only) → ONE checkpoint quiz →
// the desk day → careers. Hedging & PTBF live in Module 2.
export const topics: Topic[] = [
  panorama, // why markets exist: no-market world → crazy markets → CBOT → the answer
  universe, // hard vs soft, the players, the Robusta contract & the warrant
  supplyDemand, // what moves these markets — read the news before pricing it
  keyconcept, // futures, swaps, EFP — the instruments
  marketStructure,
  futuresFirst, // futures-only live screen: buy & sell against the news
  checkpoint, // single 18-question checkpoint over the whole module
  dayOneDesk, // the junior's inbox: every Module 1 concept in work clothes
  careersDesk, // the building, not the market: desk organisation as a career map
]
