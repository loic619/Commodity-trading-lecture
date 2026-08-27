import introduction from './00-introduction'
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

// Pedagogical order — practice is SPREAD through the session rather than piled
// at the end: what the JOB is (three aspects, risks, and PTBF derived from the
// shelf backwards) → what a market is → the universe & players → what a futures
// contract is (order book, margin, swaps) → market structure → a CHECKPOINT
// quiz to consolidate the theory → what moves prices (supply & demand) → trade
// futures against the news right after (the live screen) → the desk day (inbox)
// → careers. Hedging & PTBF live in Module 2.
export const topics: Topic[] = [
  introduction, // the job itself: three aspects, risks & paper, and PTBF derived from first principles
  panorama, // why markets exist: no-market world → crazy markets → CBOT → the answer
  universe, // hard vs soft, the players, the Robusta contract & the warrant
  keyconcept, // the instruments: futures, order book, margin & swaps
  marketStructure,
  checkpoint, // single 17-question checkpoint over the theory so far — mid-session, not the end
  supplyDemand, // what moves these markets — read the news before pricing it
  futuresFirst, // futures-only live screen: buy & sell against the news — straight after S&D
  dayOneDesk, // the junior's inbox: every Module 1 concept in work clothes
  careersDesk, // the building, not the market: desk organisation as a career map
]
