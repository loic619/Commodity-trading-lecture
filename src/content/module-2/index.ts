import ptbfTrading from './00-ptbf-trading'
import dayInLife from './00b-day-in-life'
import differential from './01-differential'
import knowExposure from './02-knowyourexposure'
import hedgingTool from './02b-hedging-tool'
import hedging from './03-hedgingstrategies'
import hedgingQuiz from './03b-hedging-quiz'
import chainRecap from './03c-chain-recap'
import fobToCif from './05-FOBtoCIFtrades'
import liveTrading from './06-live-trading-exercise'
import type { Topic } from '@/types/content'

// Theory, a checkpoint, then an escalating block of practice.
//
// The PTBF case study used to open the module, but it asks students to trade a
// differential, hold a hedge and read a basis P&L before any of those words
// have been defined. It now sits AFTER the theory block and the quiz, as the
// first (Easy) rung of the practice ladder that ends on the live floor.
// Shipping (vessels, chartering, Worldscale, demurrage) moved to Module 3,
// where the operational depth fits and lightens this module.
export const topics: Topic[] = [
  differential,  // what a differential IS — the vocabulary everything below needs
  knowExposure,
  hedgingTool,
  hedging,
  hedgingQuiz,   // checkpoint on the theory block: basis, exposure, hedging, Incoterms
  ptbfTrading,   // PTBF & the two trades — the case study, now that the notions are in place (Easy level in class)
  chainRecap,    // recap of the whole physical chain + risk map — the parcel walk, now that the vocabulary is in place
  dayInLife,     // the hedged desk's inbox — every concept above, under time pressure
  fobToCif,      // guided solo simulation (theory → practice)
  liveTrading,   // timed live-market exercise (the capstone of the module)
]
