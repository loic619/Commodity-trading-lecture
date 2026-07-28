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

// Theory first, then an escalating block of practice — mirrors the Module 1
// re-pacing. The opening PTBF case study is the hook; the applied desk day now
// lands AFTER the differential / exposure / hedging lectures it leans on, not
// before them. Shipping (vessels, chartering, Worldscale, demurrage) moved to
// Module 3, where the operational depth fits and lightens this module.
export const topics: Topic[] = [
  ptbfTrading,   // PTBF & the two trades — the module's opening case study (Easy level in class)
  differential,
  knowExposure,
  hedgingTool,
  hedging,
  hedgingQuiz,
  chainRecap,    // recap of the whole physical chain + risk map — the parcel walk, now that the vocabulary is in place
  dayInLife,     // the hedged desk's inbox — every concept above, under time pressure (moved out of the early slot)
  fobToCif,      // guided solo simulation (theory → practice)
  liveTrading,   // timed live-market exercise (the capstone of the module)
]
