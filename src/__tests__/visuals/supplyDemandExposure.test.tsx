import { render, fireEvent, screen } from '@testing-library/react'
import CropCalendar from '@/visuals/CropCalendar'
import SupplyTons from '@/visuals/SupplyTons'
import DemandTons from '@/visuals/DemandTons'
import ExposureBook from '@/visuals/ExposureBook'
import RiskTypes from '@/visuals/RiskTypes'
import HedgeRatioDial from '@/visuals/HedgeRatioDial'
import MvhrCalculator from '@/visuals/MvhrCalculator'
import BasisPnl from '@/visuals/BasisPnl'

describe('CropCalendar variety toggle', () => {
  test('coffee offers both / arabica / robusta, and only coffee does', () => {
    const { container } = render(<CropCalendar />)
    expect(screen.getByRole('button', { name: 'Arabica' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Robusta' })).toBeInTheDocument()

    // Switching to another crop drops the variety row entirely
    fireEvent.click(screen.getByRole('button', { name: 'Wheat' }))
    expect(screen.queryByRole('button', { name: 'Arabica' })).not.toBeInTheDocument()
    expect(container.textContent).toContain('Wheat crop calendar')
  })

  test('the robusta view lists the five robusta origins the course names', () => {
    const { container } = render(<CropCalendar />)
    fireEvent.click(screen.getByRole('button', { name: 'Robusta' }))
    const text = container.textContent ?? ''
    for (const origin of ['Vietnam', 'Indonesia', 'conilon', 'India', 'Uganda']) {
      expect(text).toContain(origin)
    }
    // ...and draws one ring per origin
    expect(container.querySelectorAll('svg path').length).toBeGreaterThanOrEqual(5)
  })

  test('the arabica view swaps in the arabica origins and drops Vietnam', () => {
    const { container } = render(<CropCalendar />)
    fireEvent.click(screen.getByRole('button', { name: 'Arabica' }))
    const text = container.textContent ?? ''
    expect(text).toContain('Ethiopia')
    expect(text).toContain('Colombia')
    expect(text).not.toContain('Vietnam')
  })

  test('switching crop resets the variety view so rings and radii stay in step', () => {
    render(<CropCalendar />)
    fireEvent.click(screen.getByRole('button', { name: 'Robusta' }))
    fireEvent.click(screen.getByRole('button', { name: 'Soy' }))
    fireEvent.click(screen.getByRole('button', { name: 'Coffee' }))
    // back on coffee's combined view, not a stale robusta index
    expect(screen.getByRole('button', { name: 'Both' })).toBeInTheDocument()
  })
})

describe('SupplyTons', () => {
  test('the default multiplication lands on Vietnam’s real crop size', () => {
    const { container } = render(<SupplyTons />)
    // 650k ha x 1,100 trees x 2.5 kg = 1.79 Mt = 29.8 m bags
    expect(container.textContent).toContain('29.8 m bags')
    expect(container.textContent).toContain('1.79 Mt green')
    // + 3.0 carry-in = 32.8 available
    expect(container.textContent).toContain('32.8 m bags')
  })

  test('cutting yield per tree cuts production proportionally', () => {
    const { container } = render(<SupplyTons />)
    const yieldSlider = screen.getByLabelText('Yield per tree (kg green)')
    fireEvent.change(yieldSlider, { target: { value: '1.25' } })
    // half the yield → half the production
    expect(container.textContent).toContain('14.9 m bags')
  })

  test('selecting a factor shows its drivers', () => {
    render(<SupplyTons />)
    fireEvent.click(screen.getByRole('button', { name: 'Hectares planted' }))
    expect(screen.getByText(/Opportunity cost against competing crops/)).toBeInTheDocument()
    expect(screen.getByText(/Moves over YEARS/)).toBeInTheDocument()
  })
})

describe('DemandTons', () => {
  test('the default multiplication lands on world consumption', () => {
    const { container } = render(<DemandTons />)
    // 8.1 bn x 125 cups x 10 g = 10.13 Mt = 168.8 m bags
    expect(container.textContent).toContain('168.8 m bags')
  })

  test('the blend splits the total instead of scaling it', () => {
    const { container } = render(<DemandTons />)
    const before = container.textContent ?? ''
    expect(before).toContain('168.8 m bags')

    fireEvent.change(screen.getByLabelText('Robusta share of the blend (% robusta)'), { target: { value: '50' } })
    const after = container.textContent ?? ''
    // total unchanged, split moved to 50/50
    expect(after).toContain('168.8 m bags')
    expect(after).toContain('84.4')
  })
})

describe('ExposureBook', () => {
  test('the book nets +200 t long but is long spot / short Jan / long Mar', () => {
    const { container } = render(<ExposureBook />)
    const text = container.textContent ?? ''
    expect(text).toContain('+200 t long')
    expect(text).toContain('+2,000 t')  // spot bucket
    expect(text).toContain('−2,300 t')  // Jan: −1,500 sales − 800 hedge
    expect(text).toContain('+500 t')    // Mar
  })

  test('a calendar-spread shock dwarfs the flat shock on the same book', () => {
    const { container } = render(<ExposureBook />)
    const text = container.textContent ?? ''
    // flat: net 200 t x $100 = $20,000; spread: spot 2,000 t x $100 = $200,000
    expect(text).toContain('+$20,000')
    expect(text).toContain('+$200,000')
    expect(text).toContain('10.0×')
  })

  test('dropping the hedge changes the net but barely touches the spread risk', () => {
    const { container } = render(<ExposureBook />)
    fireEvent.click(screen.getByRole('button', { name: /Short futures hedge/ }))
    const text = container.textContent ?? ''
    expect(text).toContain('+1,000 t long')  // 2,000 − 1,500 + 500
    expect(text).toContain('+$200,000')      // spot bucket untouched
  })
})

describe('RiskTypes', () => {
  test('all six risks are offered and the panel follows the selection', () => {
    render(<RiskTypes />)
    for (const name of ['Counterparty', 'Logistic', 'Quality', 'Geographic', 'Political', 'Price / differential']) {
      expect(screen.getByRole('button', { name: new RegExp(name.split(' ')[0]) })).toBeInTheDocument()
    }
    fireEvent.click(screen.getByRole('button', { name: /Quality/ }))
    expect(screen.getByText(/Pre-shipment inspection/)).toBeInTheDocument()
    expect(screen.getByText(/Operations & the lab/)).toBeInTheDocument()
  })
})

describe('HedgeRatioDial', () => {
  test('a full hedge zeroes the flat-price P&L', () => {
    const { container } = render(<HedgeRatioDial />)
    const text = container.textContent ?? ''
    expect(text).toContain('100 lots')
    expect(text).toContain('+$0')          // net flat-price P&L at 100%
    expect(text).toContain('The commercial range')
  })

  test('half a hedge leaves half the tonnage exposed', () => {
    const { container } = render(<HedgeRatioDial />)
    fireEvent.change(screen.getByLabelText('Hedge ratio, percent of physical volume'), { target: { value: '50' } })
    const text = container.textContent ?? ''
    // 500 t open x −$300 = −$150,000
    expect(text).toContain('−$150,000')
    expect(text).toContain('open 500 t')
  })

  test('above 100% the dial is called out as a naked short', () => {
    const { container } = render(<HedgeRatioDial />)
    fireEvent.change(screen.getByLabelText('Hedge ratio, percent of physical volume'), { target: { value: '130' } })
    expect(container.textContent).toContain('Over-hedged')
  })
})

describe('MvhrCalculator', () => {
  test('the worked example gives h* = 0.75 → 75 lots and 67% effectiveness', () => {
    const { container } = render(<MvhrCalculator />)
    const text = container.textContent ?? ''
    expect(text).toContain('0.75')
    expect(text).toContain('75 lots')
    expect(text).toContain('67%')
    expect(text).toContain('25 lots')   // the naive over-hedge
  })

  test('a more volatile physical flips the warning to under-hedging', () => {
    const { container } = render(<MvhrCalculator />)
    fireEvent.change(screen.getByLabelText('σ_S — physical volatility ($/t per month)'), { target: { value: '600' } })
    fireEvent.change(screen.getByLabelText('ρ — correlation'), { target: { value: '0.99' } })
    expect(container.textContent).toContain('under-hedge')
  })
})

describe('BasisPnl draggable graph', () => {
  test('the graph exposes three keyboard-operable handles', () => {
    render(<BasisPnl />)
    const handles = screen.getAllByRole('slider').filter(el => el.tagName.toLowerCase() === 'g')
    expect(handles).toHaveLength(3)
    expect(screen.getByLabelText('Futures price at exit, dollars per tonne')).toBeInTheDocument()
  })

  test('arrow keys on the futures handle move the price but not the net P&L', () => {
    const { container } = render(<BasisPnl />)
    const fut = screen.getByLabelText('Futures price at exit, dollars per tonne')
    fireEvent.keyDown(fut, { key: 'ArrowUp' })
    const text = container.textContent ?? ''
    expect(text).toContain('$2,260')   // 2,250 + one $10 step
    expect(text).toContain('−$30/t')   // net unchanged
    expect(text).toContain('−$3,000')
  })

  test('arrow keys on the exit-differential handle move the P&L one-for-one', () => {
    const { container } = render(<BasisPnl />)
    const diff = screen.getByLabelText('Exit differential, dollars per tonne')
    fireEvent.keyDown(diff, { key: 'ArrowUp' })  // −20 → −15
    const text = container.textContent ?? ''
    expect(text).toContain('−$25/t')
    expect(text).toContain('−$2,500')
  })
})
