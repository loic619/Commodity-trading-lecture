import { render, fireEvent, screen } from '@testing-library/react'
import OptionStructures from '@/visuals/OptionStructures'
import Black76Pricer from '@/visuals/Black76Pricer'

describe('OptionStructures', () => {
  test('the collar opens selected and is flagged for margin calls', () => {
    const { container } = render(<OptionStructures />)
    const text = container.textContent ?? ''
    expect(text).toContain('Zero-cost collar')
    expect(text).toContain('Zero up front')
    // the point of the slide: this is the only one of the four that margins
    expect(text).toContain('YES — and this is the catch')
  })

  test('the collar caps the producer at 275¢ however high the market goes', () => {
    const { container } = render(<OptionStructures />)
    const market = screen.getByLabelText('Market price at expiry, cents per pound')
    fireEvent.change(market, { target: { value: '340' } })
    const text = container.textContent ?? ''
    expect(text).toContain('you realise')
    expect(text).toContain('275¢')
    // unhedged would have been 340, so the hedge cost 65
    expect(text).toContain('hedge cost 65¢')
  })

  test('the collar floors the producer at 230¢ however low the market goes', () => {
    const { container } = render(<OptionStructures />)
    fireEvent.change(screen.getByLabelText('Market price at expiry, cents per pound'), { target: { value: '180' } })
    const text = container.textContent ?? ''
    expect(text).toContain('230¢')
    expect(text).toContain('hedge added 50¢')
  })

  test('the protective put keeps the upside and costs the premium', () => {
    const { container } = render(<OptionStructures />)
    fireEvent.click(screen.getByRole('button', { name: /Protective put/ }))
    fireEvent.change(screen.getByLabelText('Market price at expiry, cents per pound'), { target: { value: '340' } })
    // 340 − 8 premium = 332, so the hedge cost exactly the premium
    expect(container.textContent).toContain('332¢')
    expect(container.textContent).toContain('hedge cost 8¢')
    // and a bought option never margins
    expect(container.textContent).toContain('None. A long option is paid for once')
  })

  test('the cap is a ceiling on what a consumer pays, not a floor', () => {
    const { container } = render(<OptionStructures />)
    fireEvent.click(screen.getByRole('button', { name: /Cap \(long call\)/ }))
    fireEvent.change(screen.getByLabelText('Market price at expiry, cents per pound'), { target: { value: '340' } })
    const text = container.textContent ?? ''
    expect(text).toContain('you pay')
    // min(340, 275) + 8 = 283
    expect(text).toContain('283¢')
    expect(text).toContain('hedge saved 57¢')
  })

  test('the straddle needs the move to clear BOTH premiums', () => {
    const { container } = render(<OptionStructures />)
    fireEvent.click(screen.getByRole('button', { name: /Straddle/ }))
    // at the strike it is a full loss of both premiums
    fireEvent.change(screen.getByLabelText('Market price at expiry, cents per pound'), { target: { value: '250' } })
    expect(container.textContent).toContain('−34¢')

    // breakeven is 34¢ away from the strike, so 285 is just past it
    fireEvent.change(screen.getByLabelText('Market price at expiry, cents per pound'), { target: { value: '285' } })
    expect(container.textContent).toContain('1¢')
  })
})

describe('Black76Pricer', () => {
  test('the lecture’s worked example reproduces exactly', () => {
    const { container } = render(<Black76Pricer />)
    const text = container.textContent ?? ''
    // F = K = 4,500, σ = 35%, T = 0.25, r = 4%
    expect(text).toContain('0.0875')    // d1
    expect(text).toContain('-0.0875')   // d2
    expect(text).toContain('0.535')     // N(d1)
    expect(text).toContain('0.465')     // N(d2)
    expect(text).toContain('$311')      // the premium
  })

  test('at the money the call and the put are worth the same', () => {
    const { container } = render(<Black76Pricer />)
    const text = container.textContent ?? ''
    expect(text).toContain('C − P = $0')
    expect(text).toContain('e^(−rT)(F − K) = $0')
    expect(text).toContain('the call and the put are worth exactly the same')
  })

  test('put-call parity holds away from the money too', () => {
    const { container } = render(<Black76Pricer />)
    fireEvent.change(screen.getByLabelText('K — strike ($/t)'), { target: { value: '5000' } })
    const text = container.textContent ?? ''
    // C − P = e^(−rT)(4,500 − 5,000) = −$495 on both sides
    expect(text).toContain('C − P = −$495')
    expect(text).toContain('e^(−rT)(F − K) = −$495')
    expect(text).toContain('pure arbitrage')
    // a negative money figure must not render as "$-495"
    expect(text).not.toContain('$-')
  })

  test('the 0.4·F·σ√T rule of thumb lands next to the model price', () => {
    const { container } = render(<Black76Pricer />)
    // 0.4 × 4,500 × 0.35 × 0.5 = $315 against the model's $311
    expect(container.textContent).toContain('$315')
    expect(container.textContent).toContain('lets you price an at-the-money option in')
  })

  test('the rule of thumb disclaims itself once the strike moves away', () => {
    const { container } = render(<Black76Pricer />)
    fireEvent.change(screen.getByLabelText('K — strike ($/t)'), { target: { value: '5500' } })
    expect(container.textContent).toContain('for at-the-money options only')
  })

  test('more volatility and more time both raise the premium', () => {
    const { container } = render(<Black76Pricer />)
    const read = () => {
      const m = (container.textContent ?? '').match(/Call\$([\d,]+)/)
      return m ? parseInt(m[1].replace(/,/g, ''), 10) : NaN
    }
    const base = read()
    fireEvent.change(screen.getByLabelText('σ — implied volatility'), { target: { value: '0.7' } })
    const hiVol = read()
    expect(hiVol).toBeGreaterThan(base)

    fireEvent.change(screen.getByLabelText('σ — implied volatility'), { target: { value: '0.35' } })
    fireEvent.change(screen.getByLabelText('T — time to expiry (years)'), { target: { value: '1' } })
    expect(read()).toBeGreaterThan(base)
  })

  test('a near-expiry option collapses to its intrinsic value without blowing up', () => {
    const { container } = render(<Black76Pricer />)
    fireEvent.change(screen.getByLabelText('T — time to expiry (years)'), { target: { value: '0.02' } })
    fireEvent.change(screen.getByLabelText('K — strike ($/t)'), { target: { value: '4000' } })
    const text = container.textContent ?? ''
    // deep in the money with almost no time left: call ≈ F − K = 500
    expect(text).toMatch(/\$(49\d|50\d)/)
    expect(text).not.toContain('NaN')
    expect(text).not.toContain('Infinity')
  })
})
