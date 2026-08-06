import preFixtureOps from './01-pre-fixture-ops'
import arrivalDelays from './02-arrival-delays'
import generalTest from './02b-general-test'
import loadingOps from './03-loading-operations'
import loadingOps2 from './04-loading-operations-2'
import fixingGame from './05-fixing-game'
import type { Topic } from '@/types/content'

// Chartering & Voyage · Module 2 — from lifted subjects to sailing:
// vetting and the pre-loading file, the laycan and its delays, a checkpoint
// test, the load port in two passes (port/paper, then NOR-to-sailing), and
// the end-of-day fixing game.
export const topics: Topic[] = [
  preFixtureOps,
  arrivalDelays,
  generalTest,
  loadingOps,
  loadingOps2,
  fixingGame,
]
