import vesselCharacteristics from './01-vessel-characteristics'
import worldscale from './02-worldscale'
import commercialProcess from './03-commercial-process'
import singleVoyageContract from './04-single-voyage-contract'
import negotiationRoleplay from './05-negotiation-roleplay'
import type { Topic } from '@/types/content'

// Chartering & Voyage · Module 1 — Introduction: the ship, the freight
// index, the market's commercial process, the voyage contract, and a
// closing negotiation role play that uses all four.
export const topics: Topic[] = [
  vesselCharacteristics,
  worldscale,
  commercialProcess,
  singleVoyageContract,
  negotiationRoleplay,
]
