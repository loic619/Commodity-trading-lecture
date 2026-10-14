import { render, fireEvent, screen } from '@testing-library/react'
import DifferentialAnatomy from '@/visuals/DifferentialAnatomy'
import ArbitrageMap from '@/visuals/ArbitrageMap'
import BasisCompass from '@/visuals/BasisCompass'

describe('DifferentialAnatomy', () => {
  test('the components always sum to the headline differential', () => {
    const { container } = render(<DifferentialAnatomy />)
    // Vietnam: −10 −8 −7 −5 = −30, so physical = 4,500 − 30 = 4,470
    const text = container.textContent ?? ''
    expect(text).toContain('−$30')
    expect(text).toContain('$4,470')
    expect(text).toContain('$4,500')
    // physical = futures + differential, so a discount is parenthesised rather
    // than rendered as "4,500 − −$30"
    expect(text).toContain('(−$30)')
    expect(text).not.toContain('− −')
  })

  test('switching to a New York coffee switches the quote unit', () => {
    const { container } = render(<DifferentialAnatomy />)
    expect(container.textContent).toContain('ICE Europe (London) Jan')

    fireEvent.click(screen.getByRole('button', { name: 'Colombia Supremo' }))
    const text = container.textContent ?? ''
    expect(text).toContain('ICE US (New York) Mar')
    // +22 −6 +14 +5 = +35 on a 320 base
    expect(text).toContain('+35¢')
    expect(text).toContain('355¢')
  })

  test('the differential is restated in the other market’s unit', () => {
    const { container } = render(<DifferentialAnatomy />)
    // −$30/t at 22.0462 $/t per ¢/lb = −1.4 ¢/lb, with a typographic minus
    expect(container.textContent).toContain('−1.4¢/lb')

    fireEvent.click(screen.getByRole('button', { name: 'Colombia Supremo' }))
    // +35 ¢/lb = $772/t
    expect(container.textContent).toContain('+$772/t')

    // a negative conversion must not come out as "$-176/t"
    fireEvent.click(screen.getByRole('button', { name: 'Brazil Santos 17/18' }))
    expect(container.textContent).toContain('−$176/t')
    expect(container.textContent).not.toContain('$-')
  })

  test('every coffee’s decomposition is self-consistent', () => {
    const { container } = render(<DifferentialAnatomy />)
    for (const name of ['Vietnam Robusta Gd2', 'Colombia Supremo', 'Brazil Santos 17/18', 'Honduras SHG EP']) {
      fireEvent.click(screen.getByRole('button', { name }))
      // the summed differential is printed twice — in the equation and under the bars
      const text = container.textContent ?? ''
      expect(text).toContain('What the')
      expect(container.querySelectorAll('[aria-pressed="true"]')).toHaveLength(1)
    }
  })
})

describe('ArbitrageMap', () => {
  test('origin arbitrage nets +$18/t after freight and finance', () => {
    const { container } = render(<ArbitrageMap />)
    // sell +10 − buy (−30) − costs 22 = +18
    expect(container.textContent).toContain('+$18/t')
  })

  test('quality arbitrage nets +$22/t against the weighted blend cost', () => {
    const { container } = render(<ArbitrageMap />)
    fireEvent.click(screen.getByRole('button', { name: 'Quality arbitrage' }))
    // sell −20 − inputs (−54) − blending 12 = +22
    expect(container.textContent).toContain('+$22/t')
    expect(container.textContent).toContain('weighted 60% → −$54')
  })

  test('logistic arbitrage nets +$7/t after the reroute cost', () => {
    const { container } = render(<ArbitrageMap />)
    fireEvent.click(screen.getByRole('button', { name: 'Logistic arbitrage' }))
    // Hamburg +20 − Rotterdam +8 − reroute 5 = +7
    expect(container.textContent).toContain('+$7/t')
  })

  test('each arbitrage names the risk that eats the edge', () => {
    const { container } = render(<ArbitrageMap />)
    expect(container.textContent).toContain('recipes are sticky')
    fireEvent.click(screen.getByRole('button', { name: 'Quality arbitrage' }))
    expect(container.textContent).toContain('Miss the defect count by one')
    fireEvent.click(screen.getByRole('button', { name: 'Logistic arbitrage' }))
    expect(container.textContent).toContain('decays fastest')
  })
})

describe('BasisCompass', () => {
  test('the hedged owner is long the basis and wants it to strengthen', () => {
    const { container } = render(<BasisCompass />)
    expect(container.textContent).toContain('LONG the basis')
    expect(container.textContent).toContain('long physical / short futures')
    // the drill opens on "weakens", which is the losing direction for a long
    expect(container.textContent).toContain('You lose.')

    fireEvent.click(screen.getByRole('button', { name: /strengthens/ }))
    expect(container.textContent).toContain('You profit.')
  })

  test('the mirror position flips every answer', () => {
    const { container } = render(<BasisCompass />)
    fireEvent.click(screen.getByRole('button', { name: /sold 200 t to a roaster/ }))
    expect(container.textContent).toContain('SHORT the basis')
    expect(container.textContent).toContain('short physical / long futures')
    // still on "weakens" — which is what a short basis wants
    expect(container.textContent).toContain('You profit.')

    fireEvent.click(screen.getByRole('button', { name: /strengthens/ }))
    expect(container.textContent).toContain('You lose.')
  })

  test('an unfixed, unhedged PTBF purchase is not a basis position at all', () => {
    const { container } = render(<BasisCompass />)
    fireEvent.click(screen.getByRole('button', { name: /have not fixed or hedged/ }))
    const text = container.textContent ?? ''
    expect(text).toContain('No basis position')
    expect(text).toContain('unhedged commitment')
    // no profit/loss verdict is offered, because there is no position
    expect(text).not.toContain('You profit.')
    expect(text).not.toContain('You lose.')
  })

  test('the exporter case resolves to the same side as the warehouse case', () => {
    const { container } = render(<BasisCompass />)
    fireEvent.click(screen.getByRole('button', { name: /You are an exporter/ }))
    expect(container.textContent).toContain('LONG the basis')
  })
})
