import demurrageClaims from './01-demurrage-claims'
import demurrageCalculation from './02-demurrage-calculation'
import timeCharter from './03-time-charter'
import disputeHandling from './04-dispute-handling'
import type { Topic } from '@/types/content'

// Chartering & Voyage · Module 4 — settling the voyage: demurrage and the
// claims file, the calculation clause by clause, the time charter's key
// elements, and how shipping disputes are actually resolved.
export const topics: Topic[] = [
  demurrageClaims,
  demurrageCalculation,
  timeCharter,
  disputeHandling,
]
