import options from './01-options'
import basisTool from './01b-basis-tool'
import shipping from './01c-shipping'
import esgEudr from './02-esg-eudr'
import advancedSD from './03-advancedsupply-demand'
import cherryToTerminal from './04-cherry-to-terminal'
import type { Topic } from '@/types/content'

export const topics: Topic[] = [
  options,
  basisTool,
  shipping,       // moved from Module 2: vessels, chartering, Worldscale & demurrage — the operational layer
  esgEudr,
  advancedSD,
  cherryToTerminal,
]
