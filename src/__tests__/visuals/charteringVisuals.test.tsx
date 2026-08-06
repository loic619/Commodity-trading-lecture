import { render, fireEvent, screen } from '@testing-library/react'
import TankerDimensions from '@/visuals/TankerDimensions'
import DraftCapacityCalc from '@/visuals/DraftCapacityCalc'
import VoyageEstimator from '@/visuals/VoyageEstimator'
import TankerCargoSystem from '@/visuals/TankerCargoSystem'
import TankerEquipment from '@/visuals/TankerEquipment'
import CapacityDraftNotions from '@/visuals/CapacityDraftNotions'
import VoyageParties from '@/visuals/VoyageParties'
import FixtureRecapAnatomy from '@/visuals/FixtureRecapAnatomy'
import LaycanTimeline from '@/visuals/LaycanTimeline'
import PumpingPressure from '@/visuals/PumpingPressure'
import DisputeLadder from '@/visuals/DisputeLadder'
import TcTimeline from '@/visuals/TcTimeline'
import { modules } from '@/content'
import { courseOf } from '@/types/content'
import { visualRegistry } from '@/visuals'

test('the chartering course exists: modules 6–9, every agenda topic present', () => {
  const chartering = modules.filter(m => courseOf(m) === 'chartering')
  expect(chartering.map(m => m.id)).toEqual([6, 7, 8, 9])
  // Module 1 — Introduction
  const m1Ids = chartering[0].topics.map(t => t.id)
  expect(m1Ids).toEqual([
    '01-vessel-characteristics', '02-worldscale', '03-commercial-process',
    '04-single-voyage-contract', '05-negotiation-roleplay',
  ])
  // Module 2 — Pre-loading: includes the general test as a quiz
  const m2 = chartering[1].topics
  expect(m2.find(t => t.id === '02b-general-test')?.type).toBe('quiz')
  expect(m2.map(t => t.id)).toContain('05-fixing-game')
  // Module 3 — laden passage ×2 + discharge ×2
  expect(chartering[2].topics.map(t => t.id)).toEqual([
    '01-laden-passage', '02-laden-passage-2', '03-discharge-operations', '04-discharge-operations-2',
  ])
  // Module 4 — demurrage, calculation, time charter, disputes
  expect(chartering[3].topics.map(t => t.id)).toEqual([
    '01-demurrage-claims', '02-demurrage-calculation', '03-time-charter', '04-dispute-handling',
  ])
  // Every visual referenced by the chartering content is registered
  for (const mod of chartering) {
    for (const t of mod.topics) {
      for (const s of t.sections ?? []) {
        if (s.visual) expect(visualRegistry[s.visual]).toBeDefined()
      }
    }
  }
})

test('TankerDimensions: clicking a dimension chip explains where it bites', () => {
  const { container } = render(<TankerDimensions />)
  expect(container.textContent).toContain('LOA')
  fireEvent.click(screen.getByRole('button', { name: 'WLTHC' }))
  expect(container.textContent).toContain('loading arms')
  fireEvent.click(screen.getByRole('button', { name: 'Air draft' }))
  expect(container.textContent).toContain('bridge')
})

test('DraftCapacityCalc: fresh water allows a deeper legal draft; winter zone cuts cargo', () => {
  const { container } = render(<DraftCapacityCalc />)
  // Defaults: summer zone, salt water → legal draft = summer draft 14.90 m
  expect(container.textContent).toContain('14.90 m')
  // Fresh water: DWA 375 mm → legal draft 15.275 (renders 15.27) — more cargo
  fireEvent.change(screen.getByRole('slider', { name: /Dock water density/ }), { target: { value: '1.000' } })
  expect(container.textContent).toContain('15.27 m')
  expect(container.textContent).toContain('+3,375 t')
  expect(container.textContent).toContain('DWA 375 mm')
  // Winter: 1/48 of summer draft shallower → 14.9 − 0.31 = 14.59 m
  fireEvent.change(screen.getByRole('slider', { name: /Dock water density/ }), { target: { value: '1.025' } })
  fireEvent.click(screen.getByRole('button', { name: /Winter/ }))
  expect(container.textContent).toContain('14.59 m')
})

test('VoyageEstimator: freight follows flat × WS/100 × tonnes and TCE reacts to bunkers', () => {
  const { container } = render(<VoyageEstimator />)
  // Defaults: 80,000 t × $14.20 × 1.20 = $1,363,200 gross
  expect(container.textContent).toContain('1,363,200')
  expect(container.textContent).toContain('TCE')
  // Raising the WS level raises gross freight
  fireEvent.change(screen.getByRole('slider', { name: /Market rate WS/ }), { target: { value: '200' } })
  expect(container.textContent).toContain('2,272,000')
})

test('TankerCargoSystem: clicking a system explains it', () => {
  const { container } = render(<TankerCargoSystem />)
  fireEvent.click(screen.getByRole('button', { name: 'IGS — inert gas' }))
  expect(container.textContent).toContain('No working IGS, no berth')
  fireEvent.click(screen.getByRole('button', { name: 'Heating coils' }))
  expect(container.textContent).toContain('unpumpable')
})

test('TankerEquipment: hardware chips show the vetting reason', () => {
  const { container } = render(<TankerEquipment />)
  fireEvent.click(screen.getByRole('button', { name: 'Manifold & reducers' }))
  expect(container.textContent).toContain('reducer')
  fireEvent.click(screen.getByRole('button', { name: 'Mooring winches & ropes' }))
  expect(container.textContent).toContain('MEG4')
})

test('CapacityDraftNotions: three tabs — loadlines, salinity, tides', () => {
  const { container } = render(<CapacityDraftNotions />)
  expect(container.textContent).toContain('deepest permitted: tropical zone AND fresh water')
  fireEvent.click(screen.getByRole('button', { name: 'Salinity' }))
  expect(container.textContent).toContain('FWA')
  fireEvent.click(screen.getByRole('button', { name: 'Charts & tides' }))
  expect(container.textContent).toContain('tide window')
})

test('VoyageParties: each party card lists its duties', () => {
  const { container } = render(<VoyageParties />)
  fireEvent.click(screen.getByText('CHARTERER'))
  expect(container.textContent).toContain('SAFE ports')
  fireEvent.click(screen.getByText('MASTER'))
  expect(container.textContent).toContain('Bills of Lading')
})

test('FixtureRecapAnatomy: clicking a recap line reveals where it bites', () => {
  const { container } = render(<FixtureRecapAnatomy />)
  fireEvent.click(screen.getByRole('button', { name: /Laytime: 72 hrs SHINC/ }))
  expect(container.textContent).toContain('SHINC vs SHEX')
})

test('LaycanTimeline: scrubbing arrival flips early / window / late verdicts', () => {
  const { container } = render(<LaycanTimeline />)
  expect(container.textContent).toContain('EARLY')
  fireEvent.change(screen.getByRole('slider', { name: /Vessel arrival/ }), { target: { value: '1' } })
  expect(container.textContent).toContain('IN THE WINDOW')
  fireEvent.change(screen.getByRole('slider', { name: /Vessel arrival/ }), { target: { value: '3' } })
  expect(container.textContent).toContain('LATE')
})

test('PumpingPressure: scenarios allocate the excess hours to opposite pockets', () => {
  const { container } = render(<PumpingPressure />)
  expect(container.textContent).toContain('CHARTERER/receiver pays')
  fireEvent.click(screen.getByRole('button', { name: 'Ship underperforms' }))
  expect(container.textContent).toContain('BREACHED')
})

test('DisputeLadder and TcTimeline render their key concepts', () => {
  const a = render(<DisputeLadder />)
  expect(a.container.textContent).toContain('New York Convention')
  a.unmount()
  const b = render(<TcTimeline />)
  fireEvent.click(screen.getByRole('button', { name: 'Redelivery — and overlap' }))
  expect(b.container.textContent).toContain('overlap')
})
