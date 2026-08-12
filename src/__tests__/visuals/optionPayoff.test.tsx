import { render, fireEvent, screen } from '@testing-library/react'
import OptionPayoff from '@/visuals/OptionPayoff'
import OptionGreeks from '@/visuals/OptionGreeks'
import { modules } from '@/content'

test('defaults to the zero-cost producer collar with floor 230 and cap 275', () => {
  const { container } = render(<OptionPayoff />)
  const text = container.textContent ?? ''
  expect(text).toContain('floor 230¢')
  expect(text).toContain('cap 275¢')
  expect(text).toContain('zero-cost ✓')
})

test('long call shows breakeven = strike + premium', () => {
  const { container } = render(<OptionPayoff />)
  fireEvent.click(screen.getByRole('button', { name: 'Long call' }))
  // Default call strike 275, premium 8 → breakeven 283
  expect(container.textContent).toContain('breakeven 283¢')
})

test('protective put floor moves with the premium', () => {
  const { container } = render(<OptionPayoff />)
  fireEvent.click(screen.getByRole('button', { name: 'Protective put' }))
  // Put strike 230, premium 8 → floor 222
  expect(container.textContent).toContain('floor 222¢')
  // Raise the put premium to 20 → floor 210
  const sliders = container.querySelectorAll('input[type="range"]')
  fireEvent.change(sliders[1], { target: { value: '20' } })
  expect(container.textContent).toContain('floor 210¢')
})

test('OptionGreeks: all four orders, with formulas, drivers and desk notes', () => {
  const { container } = render(<OptionGreeks />)
  // First order is the default view
  expect(container.textContent).toContain('DELTA')
  expect(container.textContent).toContain('∂V / ∂S')
  expect(container.textContent).toContain('RHO')
  // Selecting a row swaps the explanation panel
  fireEvent.click(screen.getByText('GAMMA'))
  expect(container.textContent).toContain('Change in delta due to a change in the underlying price.')
  // Second order: the cheat-sheet five
  fireEvent.click(screen.getByRole('button', { name: 'Second order' }))
  for (const g of ['VANNA', 'VOLGA', 'CHARM', 'VETA', 'ZOMMA']) {
    expect(container.textContent).toContain(g)
  }
  // Third order and cross Greeks
  fireEvent.click(screen.getByRole('button', { name: 'Third order' }))
  expect(container.textContent).toContain('SPEED')
  expect(container.textContent).toContain('ULTIMA')
  fireEvent.click(screen.getByRole('button', { name: 'Cross Greeks' }))
  expect(container.textContent).toContain('DUAL DELTA')
  expect(container.textContent).toContain('EPSILON')
  // Legend is present
  expect(container.textContent).toContain('risk-free rate')
})

test('Module 3 options topic carries the Greek ladder section', () => {
  const opts = modules[2].topics.find(t => t.id === '01-options')
  const ids = opts?.sections?.map(s => s.id) ?? []
  expect(ids).toContain('greeks')
  expect(ids).toContain('greeks-reference')
  const ref = opts?.sections?.find(s => s.id === 'greeks-reference')
  expect(ref?.visual).toBe('option-greeks')
  expect(ref?.body).toContain('Vanna')
  expect(ref?.body).toContain('Charm')
})
