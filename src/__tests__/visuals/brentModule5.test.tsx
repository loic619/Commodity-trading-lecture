import { render, fireEvent, screen } from '@testing-library/react'
import LongShortSenses from '@/visuals/LongShortSenses'
import FixedVsFloating from '@/visuals/FixedVsFloating'
import HedgeLifecycle from '@/visuals/HedgeLifecycle'
import OilContracts from '@/visuals/OilContracts'
import FormulaGap from '@/visuals/FormulaGap'
import BrentWhy from '@/visuals/BrentWhy'
import { DatedWindow, BfoeForward, DflSpread } from '@/visuals/BrentComplexMechanics'
import PraIndex from '@/visuals/PraIndex'
import TimeValueCargo from '@/visuals/TimeValueCargo'
import CfdSettlement from '@/visuals/CfdSettlement'
import PriceToRefiner from '@/visuals/PriceToRefiner'

describe('LongShortSenses', () => {
  test('the uncovered obligation is the plainly hedgeable one', () => {
    render(<LongShortSenses />)
    // each row carries its own verdict tag; the obligation is the clean case
    const row = screen.getByRole('button', { name: /SHORT jet fuel into the Thames/ })
    expect(row.textContent).toContain('hedgeable')
    expect(screen.getByRole('button', { name: /Europe is SHORT distillate/ }).textContent).toContain('not a hedge')
    expect(screen.getByRole('button', { name: /term contract of Bonny Light/ }).textContent).toContain('not a hedge')
  })

  test('the structural sense is not a position at all', () => {
    const { container } = render(<LongShortSenses />)
    fireEvent.click(screen.getByRole('button', { name: /Europe is SHORT distillate/ }))
    expect(container.textContent).toContain('There is no position here to hedge')
  })

  test('the spread sense warns against hedging one leg', () => {
    const { container } = render(<LongShortSenses />)
    fireEvent.click(screen.getByRole('button', { name: /Refiners are LONG the margin/ }))
    expect(container.textContent).toContain('converts a spread position into a flat-price one')
  })
})

describe('FixedVsFloating', () => {
  test('fixed buy against floating sell is long the flat price', () => {
    const { container } = render(<FixedVsFloating />)
    expect(container.textContent).toContain('LONG the flat price')
    expect(container.textContent).toContain('SELL futures against it')
  })

  test('floating against floating carries no price risk at all', () => {
    const { container } = render(<FixedVsFloating />)
    fireEvent.click(screen.getByLabelText('You buy the cargo: floating'))
    const text = container.textContent ?? ''
    expect(text).toContain('No price risk — both legs float')
    expect(text).toContain('Do NOT hedge this')
  })

  test('fixed against fixed also carries none', () => {
    const { container } = render(<FixedVsFloating />)
    fireEvent.click(screen.getByLabelText('You sell it on: fixed'))
    expect(container.textContent).toContain('No price risk — both legs are fixed')
  })

  test('floating buy against fixed sell flips the direction', () => {
    const { container } = render(<FixedVsFloating />)
    fireEvent.click(screen.getByLabelText('You buy the cargo: floating'))
    fireEvent.click(screen.getByLabelText('You sell it on: fixed'))
    const text = container.textContent ?? ''
    expect(text).toContain('SHORT the flat price')
    expect(text).toContain('BUY futures')
  })
})

describe('HedgeLifecycle', () => {
  test('the hedge goes on when the contract is signed, not before', () => {
    const { container } = render(<HedgeLifecycle />)
    expect(container.textContent).toContain('Price risk begins at the stroke of the pen')

    fireEvent.click(screen.getByRole('button', { name: /back/ }))
    const text = container.textContent ?? ''
    expect(text).toContain('No contract, no obligation, no exposure')
    expect(text).toContain('short futures against nothing at all')
  })

  test('leaving the hedge on past the last pricing day is the mirror mistake', () => {
    const { container } = render(<HedgeLifecycle />)
    for (let i = 0; i < 5; i++) fireEvent.click(screen.getByRole('button', { name: /next/ }))
    const text = container.textContent ?? ''
    expect(text).toContain('Price risk ends here')
    expect(text).toContain('short 700 lots of Brent on purpose')
  })
})

describe('OilContracts', () => {
  test('ICE Brent opens selected with its M−2 expiry trap', () => {
    const { container } = render(<OilContracts />)
    const text = container.textContent ?? ''
    expect(text).toContain('ICE Brent')
    expect(text).toContain('the July contract dies at the end of MAY')
  })

  test('the cash-settled filter keeps only the two cash contracts', () => {
    const { container } = render(<OilContracts />)
    fireEvent.click(screen.getByRole('button', { name: 'Cash-settled' }))
    const text = container.textContent ?? ''
    expect(text).toContain('ICE Brent')
    expect(text).toContain('ICE WTI')
    expect(text).not.toContain('Nymex RBOB')
  })

  test('filtering to products never leaves the panel on a hidden row', () => {
    const { container } = render(<OilContracts />)
    fireEvent.click(screen.getByRole('button', { name: 'Products only' }))
    const text = container.textContent ?? ''
    // the selection falls back to a visible contract
    expect(text).toContain('ICE Gasoil')
    expect(text).not.toContain('cash-settled against it')
  })

  test('the hedge sizer multiplies lots by the contract size', () => {
    const { container } = render(<OilContracts />)
    expect(container.textContent).toContain('700,000 bbl')
    fireEvent.change(screen.getByLabelText('Number of lots'), { target: { value: '350' } })
    expect(container.textContent).toContain('350,000 bbl')
  })
})

describe('FormulaGap', () => {
  test('the invoice is the five-day average less the differential', () => {
    const { container } = render(<FormulaGap />)
    // (82.90+83.40+82.10+81.60+82.20)/5 = 82.44 → invoice 81.94
    const text = container.textContent ?? ''
    expect(text).toContain('82.440')
    expect(text).toContain('81.940')
  })

  test('the residual is the gap between the average and the single hedge price', () => {
    const { container } = render(<FormulaGap />)
    // 82.44 − 82.40 = 0.04 → inside the "almost nothing" band
    expect(container.textContent).toContain('$0.04/bbl')
    fireEvent.change(screen.getByLabelText('Futures price the hedge was lifted at'), { target: { value: '81.00' } })
    // 82.44 − 81.00 = 1.44 → 700,000 × 1.44 = 1,008,000
    expect(container.textContent).toContain('$1.44/bbl')
    expect(container.textContent).toContain('1,008,000')
  })
})

describe('BrentWhy', () => {
  test('all three ingredients on means it is a benchmark', () => {
    const { container } = render(<BrentWhy />)
    expect(container.textContent).toContain('the most-watched price on earth')
  })

  test('switching any one off breaks it', () => {
    const { container } = render(<BrentWhy />)
    fireEvent.click(screen.getByLabelText('A deep paper market: on'))
    const text = container.textContent ?? ''
    expect(text).toContain('Not a benchmark any more')
    expect(text).toContain('All three have to hold at once')
  })
})

describe('BrentComplexMechanics', () => {
  test('the Dated window is 10 to 31 days and it rolls', () => {
    const { container } = render(<DatedWindow />)
    expect(container.textContent).toContain('10–31 day forward window')
    fireEvent.change(screen.getByLabelText('Days to roll the publication date forward'), { target: { value: '7' } })
    expect(container.textContent).toContain('+7 days')
  })

  test('the forward nomination hands the grade choice to the seller', () => {
    const { container } = render(<BfoeForward />)
    expect(container.textContent).toContain('The seller may still nominate any of these')
    fireEvent.change(screen.getByLabelText('Days elapsed toward nomination'), { target: { value: '30' } })
    const text = container.textContent ?? ''
    expect(text).toContain('The seller has nominated')
    expect(text).toContain('the one the seller likes least')
  })

  test('the DFL settles the average against the locked level', () => {
    const { container } = render(<DflSpread />)
    // avg of −0.80 −0.55 −0.35 −0.70 −0.45 = −0.57 vs locked −0.60 → +0.03 × 700k = +21,000
    const text = container.textContent ?? ''
    expect(text).toContain('−$0.570')
    expect(text).toContain('+$21,000')
  })
})

describe('PraIndex', () => {
  test('only in-window trades feed the assessment', () => {
    const { container } = render(<PraIndex />)
    fireEvent.click(screen.getByRole('button', { name: /14:48/ }))
    expect(container.textContent).toContain('before the window — not assessable')
  })

  test('excluding small clips moves the published number', () => {
    const { container } = render(<PraIndex />)
    const before = (container.textContent ?? '').match(/assessed (\d+\.\d+)/)?.[1]
    fireEvent.click(screen.getByRole('checkbox'))
    const after = (container.textContent ?? '').match(/assessed (\d+\.\d+)/)?.[1]
    expect(before).toBeDefined()
    expect(after).toBeDefined()
    expect(after).not.toBe(before)
  })
})

describe('TimeValueCargo', () => {
  test('in contango the late cargo is worth more', () => {
    const { container } = render(<TimeValueCargo />)
    expect(container.textContent).toContain('the LATE cargo is worth more')
  })

  test('backwardation inverts which cargo is valuable', () => {
    const { container } = render(<TimeValueCargo />)
    fireEvent.click(screen.getByRole('button', { name: 'Backwardation' }))
    expect(container.textContent).toContain('the EARLY cargo is the valuable one')
  })

  test('a flat curve is the only case where the two are equal', () => {
    const { container } = render(<TimeValueCargo />)
    fireEvent.click(screen.getByRole('button', { name: 'Flat curve' }))
    expect(container.textContent).toContain('$0.00/bbl')
  })
})

describe('CfdSettlement', () => {
  test('buying the CFD pays when the difference narrows', () => {
    const { container } = render(<CfdSettlement />)
    // avg of −0.95 −0.72 −0.60 −0.84 −0.55 = −0.732 vs traded −0.80 → +0.068 × 700k
    const text = container.textContent ?? ''
    expect(text).toContain('−$0.73')
    expect(text).toContain('+$47,600')
    expect(text).toContain('long Dated / short the forward')
  })

  test('selling the CFD flips the sign exactly', () => {
    const { container } = render(<CfdSettlement />)
    fireEvent.click(screen.getByRole('button', { name: /You SELL the CFD/ }))
    expect(container.textContent).toContain('−$47,600')
  })
})

describe('PriceToRefiner', () => {
  test('the quote is the sum of its five components', () => {
    const { container } = render(<PriceToRefiner />)
    // 82.40 − 0.55 + 0.35 − 0.20 + 1.85 = 83.85
    expect(container.textContent).toContain('$83.85/bbl')
  })

  test('four components have an instrument and the differential does not', () => {
    const { container } = render(<PriceToRefiner />)
    fireEvent.click(screen.getByRole('button', { name: /Grade differential/ }))
    const text = container.textContent ?? ''
    expect(text).toContain('Unhedged — your margin')
    expect(text).toContain('the risk the desk is paid to carry')
  })

  test('each hedgeable component names its instrument', () => {
    const { container } = render(<PriceToRefiner />)
    for (const [name, inst] of [[/Benchmark/, 'Futures'], [/Time value/, 'CFD'], [/Dated vs futures/, 'DFL']] as const) {
      fireEvent.click(screen.getByRole('button', { name }))
      expect(container.textContent).toContain(inst)
    }
  })
})
