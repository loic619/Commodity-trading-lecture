import { render, fireEvent, screen } from '@testing-library/react'
import FreightCostStack from '@/visuals/FreightCostStack'
import SmallTankerScale from '@/visuals/SmallTankerScale'
import WorldscaleMistakes from '@/visuals/WorldscaleMistakes'
import FreightMarketResearch from '@/visuals/FreightMarketResearch'
import QuoteAnatomy from '@/visuals/QuoteAnatomy'
import RecapAnalysis from '@/visuals/RecapAnalysis'
import CharteringTiming from '@/visuals/CharteringTiming'
import OfferCounterLadder from '@/visuals/OfferCounterLadder'
import SubjectsLifting from '@/visuals/SubjectsLifting'

describe('FreightCostStack', () => {
  test('the three zones follow the market level', () => {
    const { container } = render(<FreightCostStack />)
    const ws = screen.getByLabelText('Market level in Worldscale points')
    // WS95 → TCE ~$32k, above the $21k full breakeven
    expect(container.textContent).toContain('Above full breakeven')

    fireEvent.change(ws, { target: { value: '70' } })
    expect(container.textContent).toContain('Covers cash costs, not capital')

    fireEvent.change(ws, { target: { value: '50' } })
    expect(container.textContent).toContain('Below cash costs')

    fireEvent.change(ws, { target: { value: '40' } })
    expect(container.textContent).toContain('does not even cover its bunkers')
  })

  test('capital and OPEX run anyway; voyage costs only if she sails', () => {
    render(<FreightCostStack />)
    expect(screen.getByRole('button', { name: /^Capital/ }).textContent).toContain('runs anyway')
    expect(screen.getByRole('button', { name: /^Operating/ }).textContent).toContain('runs anyway')
    expect(screen.getByRole('button', { name: /^Voyage/ }).textContent).toContain('only if she sails')
    expect(screen.getByRole('button', { name: /^Cargo handling/ }).textContent).toContain('only if she sails')
  })
})

describe('SmallTankerScale', () => {
  test('WS levels differ wildly but $/t all-in is comparable', () => {
    const { container } = render(<SmallTankerScale />)
    const text = container.textContent ?? ''
    expect(text).toContain('WS55')      // VLCC
    expect(text).toContain('WS195')     // MR
    // MR: 11.40 × 1.95 + 150000/30000 = 22.23 + 5.00 = $27.23
    expect(text).toContain('$27.23/t')
    // VLCC: 4.90 × 0.55 + 220000/270000 = 2.695 + 0.8148 = $3.51
    expect(text).toContain('$3.51/t')
  })

  test('removing the port bill helps the small ship most', () => {
    const { container } = render(<SmallTankerScale />)
    fireEvent.click(screen.getByRole('checkbox'))
    const text = container.textContent ?? ''
    expect(text).toContain('$22.23/t')  // MR loses $5.00
    expect(text).toContain('$2.70/t')   // VLCC loses only $0.81
  })
})

describe('WorldscaleMistakes', () => {
  test('the year reset changes the money for the same WS level', () => {
    const { container } = render(<WorldscaleMistakes />)
    const text = container.textContent ?? ''
    expect(text).toContain('$364,800')
    expect(text).toContain('$429,600')
  })

  test('the wrong flat rate for the route is a six-figure error', () => {
    const { container } = render(<WorldscaleMistakes />)
    fireEvent.click(screen.getByRole('button', { name: /wrong flat rate/ }))
    const text = container.textContent ?? ''
    expect(text).toContain('$577,600')
    expect(text).toContain('$748,600')
    expect(text).toContain('$171,000')   // the gap
  })

  test('the differential order error is zero at WS100 and flips sign around it', () => {
    const { container } = render(<WorldscaleMistakes />)
    fireEvent.click(screen.getByRole('button', { name: /wrong order/ }))
    const ws = screen.getByLabelText('Market level in Worldscale points')

    fireEvent.change(ws, { target: { value: '100' } })
    expect(container.textContent).toContain('nothing at all')

    fireEvent.change(ws, { target: { value: '60' } })
    expect(container.textContent).toContain('understating the fixed differential')

    fireEvent.change(ws, { target: { value: '200' } })
    const text = container.textContent ?? ''
    expect(text).toContain('OVERSTATING it')
    expect(text).toContain('$24,000')
  })
})

describe('FreightMarketResearch', () => {
  test('the same cargo to Asia generates far more tonne-miles', () => {
    const { container } = render(<FreightMarketResearch />)
    expect(container.textContent).toContain('4.3')    // bn tonne-miles to Rotterdam
    fireEvent.click(screen.getByRole('button', { name: /Ningbo/ }))
    const text = container.textContent ?? ''
    expect(text).toContain('11.4')
    expect(text).toContain('2.65×')
  })

  test('two ships on the list are not actually in the market', () => {
    const { container } = render(<FreightMarketResearch />)
    fireEvent.click(screen.getByRole('button', { name: /Astrid/ }))
    expect(container.textContent).toContain('wrong side of the Atlantic')
    fireEvent.click(screen.getByRole('button', { name: /Pelagos/ }))
    expect(container.textContent).toContain('opens after your cancelling date')
  })

  test('thinning the list flips the market to the owners', () => {
    const { container } = render(<FreightMarketResearch />)
    expect(container.textContent).toContain('Balanced')
    fireEvent.change(screen.getByLabelText('Ships added to or removed from the list'), { target: { value: '-1' } })
    expect(container.textContent).toContain('Owners’ market')
  })
})

describe('QuoteAnatomy', () => {
  test('the cargo quote explains who holds the quantity option', () => {
    const { container } = render(<QuoteAnatomy />)
    expect(container.textContent).toContain('more or less charterer’s option')
    expect(container.textContent).toContain('deadfreight')
  })

  test('the vessel quote leads on the open position', () => {
    const { container } = render(<QuoteAnatomy />)
    fireEvent.click(screen.getByRole('button', { name: /owner’s position/ }))
    fireEvent.click(screen.getByRole('button', { name: /open Rotterdam 8 March/ }))
    expect(container.textContent).toContain('on the list and not in your market')
  })
})

describe('RecapAnalysis', () => {
  test('SHINC opens selected and costs a weekend of demurrage', () => {
    const { container } = render(<RecapAnalysis />)
    const text = container.textContent ?? ''
    expect(text).toContain('Sundays and holidays INCLUDED')
    expect(text).toContain('$90,000')
  })

  test('every line carries a money consequence', () => {
    const { container } = render(<RecapAnalysis />)
    for (const token of [/MOLCO/, /1–2 SB/, /pdpr/, /Asbatankvoy/, /subs/]) {
      fireEvent.click(screen.getByRole('button', { name: token }))
      expect(container.textContent).toContain('What it costs')
    }
  })
})

describe('CharteringTiming', () => {
  test('each sequencing choice names its own exposure', () => {
    const { container } = render(<CharteringTiming />)
    expect(container.textContent).toContain('Short freight, in a market that can see it')

    fireEvent.click(screen.getByRole('button', { name: 'Fix the ship first' }))
    expect(container.textContent).toContain('Short cargo against a committed ship')

    fireEvent.click(screen.getByRole('button', { name: /lift together/ }))
    expect(container.textContent).toContain('Neither — until you choose to be exposed')
  })

  test('only the parallel path ends with both legs committed at once', () => {
    const { container } = render(<CharteringTiming />)
    fireEvent.click(screen.getByRole('button', { name: /lift together/ }))
    expect(container.textContent).toContain('both legs binding, matched')
  })
})

describe('OfferCounterLadder', () => {
  test('the dance converges from WS135 toward the last done', () => {
    const { container } = render(<OfferCounterLadder />)
    expect(container.textContent).toContain('Firm order')

    fireEvent.click(screen.getByRole('button', { name: /next message/ }))
    expect(container.textContent).toContain('WS135')

    for (let i = 0; i < 4; i++) fireEvent.click(screen.getByRole('button', { name: /next message/ }))
    const text = container.textContent ?? ''
    expect(text).toContain('On subs')
    expect(text).toContain('WS122')
  })

  test('the firm-offer etiquette is stated where it applies', () => {
    const { container } = render(<OfferCounterLadder />)
    fireEvent.click(screen.getByRole('button', { name: /next message/ }))
    expect(container.textContent).toContain('cannot trade against their own live offer')
  })

  test('the agreed level is priced against the last done', () => {
    const { container } = render(<OfferCounterLadder />)
    for (let i = 0; i < 5; i++) fireEvent.click(screen.getByRole('button', { name: /next message/ }))
    // WS122 vs WS120 → 2 points × 7.60/100 × 80,000 = $12,160
    expect(container.textContent).toContain('$12,160')
  })
})

describe('SubjectsLifting', () => {
  test('the fixture is clean only when every subject has lifted', () => {
    const { container } = render(<SubjectsLifting />)
    expect(container.textContent).toContain('On subs — 3 outstanding')

    fireEvent.click(screen.getByLabelText(/management approval: outstanding/))
    expect(container.textContent).toContain('On subs — 2 outstanding')

    fireEvent.click(screen.getByLabelText(/receivers’ approval: outstanding/))
    fireEvent.click(screen.getByLabelText(/Stem confirmation: outstanding/))
    const text = container.textContent ?? ''
    expect(text).toContain('Clean — fully binding')
    expect(text).toContain('pre-loading clock starts immediately')
  })

  test('failing subs binds nothing and costs reputation', () => {
    const { container } = render(<SubjectsLifting />)
    fireEvent.click(screen.getByRole('button', { name: /cheaper ship appeared/ }))
    const text = container.textContent ?? ''
    expect(text).toContain('Failed subs — no fixture')
    expect(text).toContain('commercially lethal')
  })
})
