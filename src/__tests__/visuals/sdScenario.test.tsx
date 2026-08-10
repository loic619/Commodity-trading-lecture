import { render, fireEvent, screen } from '@testing-library/react'
import SdScenario from '@/visuals/SdScenario'

test('baseline reproduces the 2024/25 balance: ending 20.9, STU 12.4%', () => {
  const { container } = render(<SdScenario />)
  const text = container.textContent ?? ''
  expect(text).toContain('20.9')
  expect(text).toContain('12.4%')
})

test('default Brazil −5% scenario gives ending 17.6 and STU 10.5% (tight)', () => {
  const { container } = render(<SdScenario />)
  const text = container.textContent ?? ''
  expect(text).toContain('17.6')
  expect(text).toContain('10.5%')
  expect(text).toContain('tight')
})

test('a large supply build moves the band out of tight', () => {
  const { container } = render(<SdScenario />)
  const sliders = container.querySelectorAll('input[type="range"]')
  // Brazil +15%, Vietnam +15%: production +14.5 M bags → ending ≈ 35.4 → STU ≈ 21% (balanced)
  fireEvent.change(sliders[0], { target: { value: '15' } })
  fireEvent.change(sliders[1], { target: { value: '15' } })
  const text = container.textContent ?? ''
  expect(text).toContain('balanced')
})

// The Module 1 balance sheet (accounting format, no STU)
import SdBalanceSheet from '@/visuals/SdBalanceSheet'
import { modules } from '@/content'

test('SdBalanceSheet: sources equal uses, and each line opens its driver tree', () => {
  const { container } = render(<SdBalanceSheet />)
  // Both totals balance at 189.0
  expect((container.textContent?.match(/189\.0/g) ?? []).length).toBeGreaterThanOrEqual(2)
  // Production drill-down open by default: the three-factor multiplication
  expect(container.textContent).toContain('Trees per hectare')
  expect(container.textContent).toContain('inter-cropped')
  // Carry-in drivers: farmer psychology
  fireEvent.click(screen.getByRole('button', { name: /Beginning stocks/ }))
  expect(container.textContent).toContain('do farmers NEED to sell')
  // Consumption drivers: the multiplication
  fireEvent.click(screen.getByRole('button', { name: /Consumption/ }))
  expect(container.textContent).toContain('Grams per cup')
})

test('Module 1 S&D teaches the balance sheet, not the STU ratio', () => {
  const sd = modules[0].topics.find(t => t.id === '04-supply-demand')
  const ids = sd?.sections?.map(s => s.id) ?? []
  expect(ids).toContain('balance-sheet')
  expect(ids).not.toContain('balance')
  expect(ids).not.toContain('stu-convexity')
  const text = JSON.stringify(sd?.sections)
  expect(text).not.toContain('stocks-to-use ratio')
  expect(text).not.toContain('STU')
})
