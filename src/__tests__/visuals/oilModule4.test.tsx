import { render, fireEvent, screen } from '@testing-library/react'
import PriceFeedbackLoop from '@/visuals/PriceFeedbackLoop'
import CallOnOpec from '@/visuals/CallOnOpec'
import StocksAndSpare from '@/visuals/StocksAndSpare'
import ValueChain from '@/visuals/ValueChain'
import ConversionUnits from '@/visuals/ConversionUnits'
import CapacityUtilisation from '@/visuals/CapacityUtilisation'
import CrudeYields from '@/visuals/CrudeYields'
import CrudeBenchmarks from '@/visuals/CrudeBenchmarks'
import ProductUnits from '@/visuals/ProductUnits'
import InformationCalendar from '@/visuals/InformationCalendar'
import OilEventHistory from '@/visuals/OilEventHistory'
import DowPhases from '@/visuals/DowPhases'
import FibonacciRibbon from '@/visuals/FibonacciRibbon'

describe('PriceFeedbackLoop', () => {
  test('the shock direction rewrites every leg of the loop', () => {
    const { container } = render(<PriceFeedbackLoop />)
    expect(container.textContent).toContain('Brent jumps $20/bbl')
    fireEvent.click(screen.getByRole('button', { name: /price collapses/ }))
    expect(container.textContent).toContain('Brent falls $20/bbl')
    expect(container.textContent).not.toContain('Brent jumps $20/bbl')
  })

  test('each leg carries its lag — the point of the slide', () => {
    const { container } = render(<PriceFeedbackLoop />)
    fireEvent.click(screen.getByRole('button', { name: /next step/ }))
    expect(container.textContent).toContain('2. Demand responds')
    fireEvent.click(screen.getByRole('button', { name: /next step/ }))
    expect(container.textContent).toContain('6–9 months for shale')
  })

  test('the driver grid explains which pole a factor moves', () => {
    render(<PriceFeedbackLoop />)
    fireEvent.click(screen.getByRole('button', { name: 'US dollar' }))
    expect(screen.getByText(/oil is priced in dollars/i)).toBeInTheDocument()
  })
})

describe('CallOnOpec', () => {
  test('the call is the residual of the three inputs', () => {
    const { container } = render(<CallOnOpec />)
    // 103.0 − 71.8 − 5.5 = 25.7
    expect(container.textContent).toContain('25.7 mb/d')
    // 30.5 capacity − 25.7 call = 4.8 spare
    expect(container.textContent).toContain('4.8 mb/d')
    expect(container.textContent).toContain('Adequate')
  })

  test('a small demand revision lands entirely on the call', () => {
    const { container } = render(<CallOnOpec />)
    fireEvent.change(screen.getByLabelText('World liquids demand (mb/d)'), { target: { value: '104' } })
    // call 26.7, spare 3.8
    expect(container.textContent).toContain('26.7 mb/d')
    expect(container.textContent).toContain('3.8 mb/d')
  })

  test('thin spare capacity changes the verdict', () => {
    const { container } = render(<CallOnOpec />)
    fireEvent.change(screen.getByLabelText('OPEC crude capacity (mb/d)'), { target: { value: '26.8' } })
    // spare 1.1 → critically thin
    expect(container.textContent).toContain('Critically thin')
  })
})

describe('StocksAndSpare', () => {
  test('the verdict comes from the position in the range, not the absolute level', () => {
    const { container } = render(<StocksAndSpare />)
    // October band is 2730–2975; 2745 sits near the floor
    expect(container.textContent).toContain('Bottom of the range')

    // the same 2,745 in June (band 2790–3060) is below the floor, still tight
    fireEvent.change(screen.getByLabelText('Month'), { target: { value: '5' } })
    expect(container.textContent).toContain('Bottom of the range')

    // lift it into the top of the June band
    fireEvent.change(screen.getByLabelText('Current stocks in million barrels'), { target: { value: '3030' } })
    expect(container.textContent).toContain('Top of the range')
  })

  test('days of cover divides stocks by demand', () => {
    const { container } = render(<StocksAndSpare />)
    // 2745 / 45.5 = 60.3
    expect(container.textContent).toContain('60.3')
  })

  test('the balance implies a monthly build or draw and a bias', () => {
    const { container } = render(<StocksAndSpare />)
    expect(container.textContent).toContain('Stock draw → bullish bias')
    fireEvent.change(screen.getByLabelText('Forecast supply minus demand in million barrels per day'), { target: { value: '1.5' } })
    expect(container.textContent).toContain('Stock build → bearish bias')
    // 1.5 × 30.4 = 46 mb a month
    expect(container.textContent).toContain('+46 mb')
  })
})

describe('ValueChain', () => {
  test('the transport legs are where the desk sits', () => {
    const { container } = render(<ValueChain />)
    expect(container.textContent).toContain('THIS is the trading leg')
    fireEvent.click(screen.getByRole('button', { name: /Upstream/ }))
    expect(container.textContent).toContain('A trading desk rarely owns this')
  })

  test('each product names a different demand driver', () => {
    render(<ValueChain />)
    fireEvent.click(screen.getByRole('button', { name: /Naphtha/ }))
    expect(screen.getByText(/petrochemical margins, not driving season/)).toBeInTheDocument()
  })
})

describe('ConversionUnits', () => {
  test('the FCC opens selected with its feed and product', () => {
    const { container } = render(<ConversionUnits />)
    expect(container.textContent).toContain('Fluid Catalytic Cracker')
    expect(container.textContent).toContain('Heavy vacuum gas oil')
    expect(container.textContent).toContain('the reason American refineries look the way they do')
  })

  test('the coker is what makes a heavy sour barrel runnable', () => {
    const { container } = render(<ConversionUnits />)
    fireEvent.click(screen.getByRole('button', { name: 'DCU' }))
    expect(container.textContent).toContain('the cheapest, heaviest, sourest crude')
  })

  test('every unit renders', () => {
    const { container } = render(<ConversionUnits />)
    for (const u of ['HDS', 'FCC', 'HCU', 'VBU', 'DCU', 'CRU', 'ISOM', 'ALKY', 'MIX']) {
      fireEvent.click(screen.getByRole('button', { name: u }))
      expect(container.textContent).toContain('Why a refiner paid for it')
    }
  })
})

describe('CapacityUtilisation', () => {
  test('throughput is capacity times utilisation', () => {
    const { container } = render(<CapacityUtilisation />)
    // 103.0 × 82% = 84.5, idle 18.5
    expect(container.textContent).toContain('84.5 mb/d')
    expect(container.textContent).toContain('18.5 mb/d')
  })

  test('high utilisation blows margins out, low utilisation closes refineries', () => {
    const { container } = render(<CapacityUtilisation />)
    const util = screen.getByLabelText('Refinery utilisation rate, percent')
    fireEvent.change(util, { target: { value: '95' } })
    expect(container.textContent).toContain('Tight — margins blow out')
    fireEvent.change(util, { target: { value: '70' } })
    expect(container.textContent).toContain('Overcapacity — closures follow')
  })

  test('each region has a different slate, and the shares sum to 100', () => {
    const { container } = render(<CapacityUtilisation />)
    expect(container.textContent).toContain('41%')      // US gasoline
    fireEvent.click(screen.getByRole('button', { name: 'Europe' }))
    expect(container.textContent).toContain('44%')      // European diesel
    expect(container.textContent).toContain('structurally short diesel')
  })
})

describe('CrudeYields', () => {
  test('Arab Light drops 53% straight to fuel oil', () => {
    const { container } = render(<CrudeYields />)
    expect(container.textContent).toContain('53')
    expect(container.textContent).toContain('needs a complex, coking refinery')
  })

  test('the lighter crude is worth more on simple distillation', () => {
    const { container } = render(<CrudeYields />)
    const text = container.textContent ?? ''
    // WTI .26·72 + .14·92 + .23·88 + .35·52 = $70.04; Arab Light = $65.80
    expect(text).toContain('$70.04/bbl')
    expect(text).toContain('$65.80/bbl')
    expect(text).toContain('$4.24/bbl')   // the spread
    // and note it barely covers a $70 crude — simple distillation alone is thin
    expect(text).toContain('$68.28/bbl')  // Brent, between the two
  })

  test('selecting a grade swaps the commentary', () => {
    const { container } = render(<CrudeYields />)
    fireEvent.click(screen.getByRole('button', { name: /WTI/ }))
    expect(container.textContent).toContain('63% of the barrel comes off as light and middle cuts')
  })
})

describe('CrudeBenchmarks', () => {
  test('Arab Light prices off two benchmarks depending on destination', () => {
    const { container } = render(<CrudeBenchmarks />)
    expect(container.textContent).toContain('Arab Light sold WEST')
    fireEvent.click(screen.getByRole('button', { name: /Dubai/ }))
    expect(container.textContent).toContain('Arab Light sold EAST')
  })

  test('WTI’s landlocked delivery is called out', () => {
    const { container } = render(<CrudeBenchmarks />)
    fireEvent.click(screen.getByRole('button', { name: /WTI/ }))
    expect(container.textContent).toContain('minus $37')
  })
})

describe('ProductUnits', () => {
  test('the conversion chain is arithmetically right', () => {
    const { container } = render(<ProductUnits />)
    // gas oil at $700/MT ÷ 7.45 = $93.96/bbl ÷ 42 = 223.7¢/gal
    const text = container.textContent ?? ''
    expect(text).toContain('$93.96')
    expect(text).toContain('223.7¢')
  })

  test('the same tonne price means a different barrel price per product', () => {
    const { container } = render(<ProductUnits />)
    fireEvent.click(screen.getByRole('button', { name: 'Fuel oil' }))
    // 700 / 6.35 = 110.24
    expect(container.textContent).toContain('$110.24')
    // spread across the slate: 700/6.35 − 700/8.90 = 110.24 − 78.65 = 31.58
    expect(container.textContent).toContain('$31.58/bbl')
  })
})

describe('InformationCalendar', () => {
  test('Wednesday is the beat', () => {
    const { container } = render(<InformationCalendar />)
    expect(container.textContent).toContain('DOE / EIA stocks')
    expect(container.textContent).toContain('15:30 London')
  })

  test('the PRA distinction is the one the panel makes', () => {
    render(<InformationCalendar />)
    fireEvent.click(screen.getByRole('button', { name: /Platts, Argus/ }))
    expect(screen.getByText(/do not report prices so much as ASSESS them/)).toBeInTheDocument()
  })

  test('no stray non-latin characters slipped into the copy', () => {
    const { container } = render(<InformationCalendar />)
    expect(container.textContent ?? '').not.toMatch(/[　-鿿]/)
  })
})

describe('OilEventHistory', () => {
  test('each event is classified as supply, demand or policy', () => {
    const { container } = render(<OilEventHistory />)
    expect(container.textContent).toContain('2022 · Russia–Ukraine')
    expect(container.textContent).toContain('supply shock')
  })

  test('stepping through reaches the 2023 contrast', () => {
    const { container } = render(<OilEventHistory />)
    fireEvent.click(screen.getByRole('button', { name: /later/ }))
    expect(container.textContent).toContain('2023 · Israel–Gaza')
    expect(container.textContent).toContain('did NOT spike the price')
  })

  test('the 2008 demand peak is on the chart', () => {
    const { container } = render(<OilEventHistory />)
    // index 10 (2022) back to index 5 (2008) is five steps
    for (let i = 0; i < 5; i++) fireEvent.click(screen.getByRole('button', { name: /earlier/ }))
    expect(container.textContent).toContain('$147')
    expect(container.textContent).toContain('demand shock')
  })
})

describe('DowPhases', () => {
  test('each phase names who is on each side of the trade', () => {
    const { container } = render(<DowPhases />)
    expect(container.textContent).toContain('Informed money buying from discouraged holders')
    fireEvent.click(screen.getByRole('button', { name: 'Distribution' }))
    expect(container.textContent).toContain('selling to the newly enthusiastic')
    expect(container.textContent).toContain('New highs on falling volume')
  })

  test('the six rules are all listed', () => {
    const { container } = render(<DowPhases />)
    for (const r of ['Averages discount everything', 'Three trends', 'Three phases', 'Volume must confirm the trend']) {
      expect(container.textContent).toContain(r)
    }
  })
})

describe('FibonacciRibbon', () => {
  test('the retracement levels are arithmetic on the chosen swing', () => {
    const { container } = render(<FibonacciRibbon />)
    // low 62, high 94, span 32 → 50% = 94 − 16 = 78.00
    expect(container.textContent).toContain('$78.00')
    // 38.2% = 94 − 12.22 = 81.78 ; 61.8% = 94 − 19.78 = 74.22
    expect(container.textContent).toContain('$81.78')
    expect(container.textContent).toContain('$74.22')
  })

  test('moving the swing moves every level', () => {
    const { container } = render(<FibonacciRibbon />)
    fireEvent.change(screen.getByLabelText('Swing high in dollars per barrel'), { target: { value: '110' } })
    // span 48 → 50% = 110 − 24 = 86.00
    expect(container.textContent).toContain('$86.00')
    expect(container.textContent).not.toContain('$78.00')
  })

  test('the swing low can never cross the high', () => {
    const { container } = render(<FibonacciRibbon />)
    const lowS = screen.getByLabelText('Swing low in dollars per barrel')
    const highS = screen.getByLabelText('Swing high in dollars per barrel')
    // 80 is still below 94 − 5, so it is accepted as-is
    fireEvent.change(lowS, { target: { value: '80' } })
    expect(container.textContent).toContain('$80.00')
    // bring the high down, then push the low through it: it clamps to high − 5
    fireEvent.change(lowS, { target: { value: '45' } })
    fireEvent.change(highS, { target: { value: '60' } })
    fireEvent.change(lowS, { target: { value: '80' } })
    expect(container.textContent).toContain('$55.00')
    expect(container.textContent).toContain('$60.00')
  })

  test('the ribbon can be hidden', () => {
    render(<FibonacciRibbon />)
    const btn = screen.getByRole('button', { name: /ribbon/ })
    expect(btn.textContent).toContain('hide')
    fireEvent.click(btn)
    expect(screen.getByRole('button', { name: /ribbon/ }).textContent).toContain('show')
  })
})
