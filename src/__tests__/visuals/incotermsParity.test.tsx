import { render, fireEvent, screen, within } from '@testing-library/react'
import IncotermsLadder from '@/visuals/IncotermsLadder'
import TenderableParity from '@/visuals/TenderableParity'

// The term tabs and the inline cross-link in the CIF/FOB panel share names,
// so tab clicks are scoped to the tab group.
const tab = (name: RegExp | string) =>
  within(screen.getByRole('group', { name: 'Incoterm' })).getByRole('button', { name })

describe('IncotermsLadder', () => {
  test('CIF opens selected, and is shown as a cost/risk split', () => {
    const { container } = render(<IncotermsLadder />)
    const text = container.textContent ?? ''
    expect(text).toContain('Cost, Insurance and Freight')
    expect(text).toContain('cost and risk part ways')
    // minimum cover is the examinable detail
    expect(text).toContain('minimum cover only (Clause C)')
  })

  test('FOB has a single transfer point, CIF does not', () => {
    const { container } = render(<IncotermsLadder />)
    fireEvent.click(tab(/^FOB/))
    expect(container.textContent).toContain('one transfer point')
    expect(container.textContent).not.toContain('cost and risk part ways')

    fireEvent.click(tab(/^CIF/))
    expect(container.textContent).toContain('cost and risk part ways')
  })

  test('the cost bar reaches destination under CIF but stops on board under FOB', () => {
    const { container } = render(<IncotermsLadder />)
    const costBar = () => {
      // the filled cost bar is the second rect of the COST row
      const rects = Array.from(container.querySelectorAll('rect'))
      return rects.find(r => r.getAttribute('fill') === '#22d3ee')!
    }
    const cifWidth = parseFloat(costBar().getAttribute('width')!)
    fireEvent.click(tab(/^FOB/))
    const fobWidth = parseFloat(costBar().getAttribute('width')!)
    expect(cifWidth).toBeGreaterThan(fobWidth)
  })

  test('CIP and CIF differ on the insurance level — the 2020 change', () => {
    const { container } = render(<IncotermsLadder />)
    fireEvent.click(tab(/^CIP/))
    expect(container.textContent).toContain('all-risks (Clause A) since Incoterms 2020')
  })

  test('the maritime terms offer a one-click jump to their container equivalent', () => {
    const { container } = render(<IncotermsLadder />)
    fireEvent.click(tab(/^FOB/))
    // the inline recommendation is clickable and switches the selection
    fireEvent.click(screen.getByRole('button', { name: 'FCA' }))
    expect(container.textContent).toContain('Free Carrier')
  })

  test('every term renders without a missing-stage crash', () => {
    const { container } = render(<IncotermsLadder />)
    for (const name of [/^FCA/, /^FOB/, /^CFR/, /^CIF/, /^CIP/, /^DAP/]) {
      fireEvent.click(tab(name))
      expect(container.querySelector('svg')).toBeInTheDocument()
    }
  })
})

describe('TenderableParity', () => {
  test('the worked example from the lecture: tendering wins by $50/t', () => {
    const { container } = render(<TenderableParity />)
    const text = container.textContent ?? ''
    // 4,500 + 0 − 250 = 4,250 vs 4,500 − 300 = 4,200
    expect(text).toContain('$4,250')
    expect(text).toContain('$4,200')
    expect(text).toContain('Tendering wins')
    expect(text).toContain('$50/t')
    // parity sits at class diff − costs = −250, not zero
    expect(text).toContain('parity −$250')
  })

  test('at a −$200 cash differential the flow stops', () => {
    const { container } = render(<TenderableParity />)
    fireEvent.change(screen.getByLabelText('Cash market differential in dollars per tonne'), { target: { value: '-200' } })
    const text = container.textContent ?? ''
    expect(text).toContain('The cash market wins')
    expect(text).toContain('$50/t')
  })

  test('parity moves with the delivery costs, not with the futures price', () => {
    const { container } = render(<TenderableParity />)
    fireEvent.change(screen.getByLabelText('Freight to an exchange warehouse'), { target: { value: '0' } })
    // costs 250 → 130, so parity −250 → −130
    expect(container.textContent).toContain('parity −$130')

    fireEvent.change(screen.getByLabelText('Futures price in dollars per tonne'), { target: { value: '5500' } })
    // the futures price shifts both realisations equally and leaves parity alone
    expect(container.textContent).toContain('parity −$130')
  })

  test('a worse class differential lowers the floor', () => {
    const { container } = render(<TenderableParity />)
    fireEvent.change(screen.getByLabelText('Exchange class or growth differential in dollars per tonne'), { target: { value: '-90' } })
    expect(container.textContent).toContain('parity −$340')
  })
})
