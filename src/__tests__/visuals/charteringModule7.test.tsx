import { render, fireEvent, screen } from '@testing-library/react'
import VettingFunnel from '@/visuals/VettingFunnel'
import BackToBackGap from '@/visuals/BackToBackGap'
import { LaycanWatch, PortClearance } from '@/visuals/PreFixtureOps'
import DelayFamilies from '@/visuals/DelayFamilies'
import { PortPhysicalLayer, PortAdminLayer } from '@/visuals/LoadPortLayers'
import { LoadingDocuments, PortLog } from '@/visuals/LoadingRecords'
import { BerthingConfigurations, LoadSequence } from '@/visuals/BerthOperations'
import { ShipShoreFigures, BillOfLading } from '@/visuals/CargoMeasurement'

describe('VettingFunnel', () => {
  test('all gates passed clears the ship for the negotiation', () => {
    const { container } = render(<VettingFunnel />)
    expect(container.textContent).toContain('Cleared for the negotiation')
  })

  test('a failure stops the funnel and the later gates are never reached', () => {
    const { container } = render(<VettingFunnel />)
    fireEvent.click(screen.getByLabelText('SIRE: passed'))
    const text = container.textContent ?? ''
    expect(text).toContain('Stopped at SIRE')
    expect(text).toContain('never reached')
    expect(text).not.toContain('Cleared for the negotiation')
  })

  test('the per-voyage reality is stated, not implied', () => {
    const { container } = render(<VettingFunnel />)
    expect(container.textContent).toContain('An approval is not a certificate')
    expect(container.textContent).toContain('a cargo you cannot lift')
  })
})

describe('BackToBackGap', () => {
  test('a shorter CP laytime is structurally the trader’s risk', () => {
    const { container } = render(<BackToBackGap />)
    // sale 96, CP 72 → 24 hrs of exposure
    expect(container.textContent).toContain('24 hrs of demurrage risk is structurally yours')
  })

  test('a demurrage rate above the sale cap leaks every day', () => {
    const { container } = render(<BackToBackGap />)
    // 45,000 paid vs 40,000 recovered
    expect(container.textContent).toContain('$5,000/day leaks out of your book')
  })

  test('the 36-hour overrun nets out against the trader', () => {
    const { container } = render(<BackToBackGap />)
    // pay 36/24 × 45,000 = 67,500 ; recover (36−24)/24 × 40,000 = 20,000 → −47,500
    const text = container.textContent ?? ''
    expect(text).toContain('−$67,500')
    expect(text).toContain('$20,000')
    expect(text).toContain('−$47,500')
    expect(text).toContain('Nobody breached anything')
  })

  test('aligning the regimes closes the leak', () => {
    const { container } = render(<BackToBackGap />)
    fireEvent.change(screen.getByLabelText('Your charter party gives the ship'), { target: { value: '96' } })
    fireEvent.change(screen.getByLabelText('You pay the owner'), { target: { value: '40000' } })
    const text = container.textContent ?? ''
    expect(text).toContain('Aligned — the clocks allow the same time')
    expect(text).toContain('No rate leak')
  })
})

describe('LaycanWatch', () => {
  test('Day 5 is inside the laycan and Day 7 is not', () => {
    const { container } = render(<LaycanWatch />)
    expect(container.textContent).toContain('inside the laycan')
    fireEvent.click(screen.getByRole('button', { name: 'Day 7' }))
    const text = container.textContent ?? ''
    expect(text).toContain('MISSES the cancelling date')
    expect(text).toContain('holds the cancellation option')
  })
})

describe('PortClearance', () => {
  test('each clearance axis is decided by a different party', () => {
    const { container } = render(<PortClearance />)
    fireEvent.click(screen.getByRole('button', { name: /Commercial/ }))
    expect(container.textContent).toContain('runs its own screen and owes you nothing')
  })

  test('a failed re-check puts the delay in a laytime grey zone', () => {
    const { container } = render(<PortClearance />)
    expect(container.textContent).not.toContain('Operations stop')
    fireEvent.click(screen.getByRole('button', { name: /repeat check fails/ }))
    const text = container.textContent ?? ''
    expect(text).toContain('Operations stop')
    expect(text).toContain('documented who failed which item')
  })
})

describe('DelayFamilies', () => {
  test('the same storm has two different payers', () => {
    const { container } = render(<DelayFamilies />)
    fireEvent.click(screen.getByRole('button', { name: /Weather at sea/ }))
    expect(container.textContent).toContain('the time is the owner’s')
    fireEvent.click(screen.getByRole('button', { name: /Weather at the port/ }))
    expect(container.textContent).toContain('The same storm as the row above, and a different payer')
  })

  test('whether the delay breaks the laycan depends on the weather margin', () => {
    const { container } = render(<DelayFamilies />)
    // port weather 1.5 d against 2.0 slack + 5% of 14 d = 2.7 → makes it
    expect(container.textContent).toContain('Still makes the can')

    fireEvent.click(screen.getByRole('button', { name: /Prior-voyage knock-on/ }))
    fireEvent.change(screen.getByLabelText('Weather margin percentage'), { target: { value: '0' } })
    // 2.5 d against 2.0 slack only → misses by 0.5
    expect(container.textContent).toContain('Misses the cancelling date by 0.5 days')
  })
})

describe('Load port layers', () => {
  test('the shore’s pumping capacity sets the rate, not the ship’s', () => {
    const { container } = render(<PortPhysicalLayer />)
    expect(container.textContent).toContain('sets YOUR loading rate, not the ship’s')
  })

  test('the approaches are often the binding constraint', () => {
    const { container } = render(<PortPhysicalLayer />)
    fireEvent.click(screen.getByRole('button', { name: 'Approaches' }))
    expect(container.textContent).toContain('frequently the binding constraint')
  })

  test('an unfunded agent is a ship that does not sail', () => {
    const { container } = render(<PortAdminLayer />)
    expect(container.textContent).toContain('An unfunded agent is a ship that does not sail')
  })

  test('the contested middle is decided by the rider wording', () => {
    const { container } = render(<PortAdminLayer />)
    fireEvent.click(screen.getByRole('button', { name: /on cargo/ }))
    expect(container.textContent).toContain('the rider clause wording decides it')
  })
})

describe('Loading records', () => {
  test('the note of protest is flagged critical', () => {
    const { container } = render(<LoadingDocuments />)
    fireEvent.click(screen.getByRole('button', { name: /Protests/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Note of protest' }))
    expect(container.textContent).toContain('recorded AT THE TIME, not remembered later')
  })

  test('NOR is the most contested timestamp in the log', () => {
    const { container } = render(<PortLog />)
    expect(container.textContent).toContain('most contested timestamp')
    fireEvent.click(screen.getByRole('button', { name: /Documents on board/ }))
    expect(container.textContent).toContain('a ship on demurrage')
  })
})

describe('Berth operations', () => {
  test('the STS position may not be a valid NOR place', () => {
    const { container } = render(<BerthingConfigurations />)
    expect(container.textContent).toContain('The contested case')
    fireEvent.click(screen.getByRole('button', { name: /Conventional berth/ }))
    expect(container.textContent).toContain('The standard case')
  })

  test('two of the four stoppage causes are disputed', () => {
    const { container } = render(<LoadSequence />)
    const text = container.textContent ?? ''
    expect((text.match(/disputed/g) ?? []).length).toBeGreaterThanOrEqual(2)
    fireEvent.click(screen.getByRole('button', { name: /Pump trip/ }))
    expect(container.textContent).toContain('Terminal’s time')
  })

  test('topping off is flagged as the highest-risk phase', () => {
    const { container } = render(<LoadSequence />)
    expect(container.textContent).toContain('highest-risk phase for overflow')
  })
})

describe('Cargo measurement', () => {
  test('a small divergence needs no protest', () => {
    const { container } = render(<ShipShoreFigures />)
    // 79,820 × 1.0012 = 79,915.8 vs 80,000 → −0.105%, inside 0.3%
    expect(container.textContent).toContain('Inside tolerance')
  })

  test('past the tolerance the Master protests on the spot', () => {
    const { container } = render(<ShipShoreFigures />)
    fireEvent.change(screen.getByLabelText('Ship’s ullage survey (t)'), { target: { value: '79500' } })
    const text = container.textContent ?? ''
    expect(text).toContain('Outside tolerance')
    expect(text).toContain('a complaint is not evidence')
  })

  test('the B/L is three instruments and title is what moves the cargo', () => {
    const { container } = render(<BillOfLading />)
    expect(container.textContent).toContain('makes the CIF chain of the commodity course physically possible')
    fireEvent.click(screen.getByRole('button', { name: 'A receipt' }))
    expect(container.textContent).toContain('claused B/L usually breaks the letter of credit')
  })

  test('backdating is named as fraud, not as a grey area', () => {
    const { container } = render(<BillOfLading />)
    fireEvent.click(screen.getByRole('button', { name: /The B\/L date/ }))
    expect(container.textContent).toContain('Backdating is fraud, full stop')
  })
})
