import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { useLiveVisualText, LiveVisualTextPanel, loadLiveText, setLiveText } from '@/lib/liveVisualText'
import EveryoneIsATrader from '@/visuals/EveryoneIsATrader'
import PtbfInvention from '@/visuals/PtbfInvention'
import OptionGreeks from '@/visuals/OptionGreeks'

afterEach(() => window.localStorage.clear())

// A harness mirroring how SectionReader mounts a visual with the layer.
function Harness({ visualKey, editMode = true, children }: {
  visualKey: string; editMode?: boolean; children: React.ReactNode
}) {
  const live = useLiveVisualText(visualKey, editMode)
  return (
    <>
      <div ref={live.ref}>{children}</div>
      {editMode && (
        <LiveVisualTextPanel labels={live.labels} overrides={live.overrides}
          onChange={live.update} onReset={live.reset} />
      )}
    </>
  )
}

test('collects labels from a visual that never declared any editable text', () => {
  // EveryoneIsATrader has no defineVisualText — before this layer, nothing in
  // it could be edited.
  render(<Harness visualKey="everyone-is-a-trader"><EveryoneIsATrader /></Harness>)
  expect(screen.getByText(/label.? found/)).toBeInTheDocument()
  // Labels from the chain, the notes and the risk chips are all offered
  for (const label of ['Producer', 'Commodity trader', 'Supermarket', 'Counterparty risk']) {
    expect(screen.getByRole('textbox', { name: `Edit label: ${label}` })).toBeInTheDocument()
  }
})

test('editing a label rewrites it in the rendered visual and persists it', () => {
  const { container } = render(
    <Harness visualKey="everyone-is-a-trader"><EveryoneIsATrader /></Harness>,
  )
  const input = screen.getByRole('textbox', { name: 'Edit label: Supermarket' })
  act(() => { fireEvent.change(input, { target: { value: 'Retail chain' } }) })
  // Stored…
  expect(loadLiveText()['everyone-is-a-trader']['Supermarket']).toBe('Retail chain')
  // …and applied to the live DOM
  expect(container.textContent).toContain('Retail chain')
})

test('a stored edit is applied on mount, before the user opens the panel', () => {
  setLiveText('ptbf-invention', 'The shelf sets the rules', 'How the shelf sets the rules')
  const { container } = render(
    <Harness visualKey="ptbf-invention" editMode={false}><PtbfInvention /></Harness>,
  )
  expect(container.textContent).toContain('How the shelf sets the rules')
  expect(container.textContent).not.toContain('>The shelf sets the rules<')
})

test('SVG text is editable too, not just HTML', () => {
  const { container } = render(<Harness visualKey="ptbf-invention"><PtbfInvention /></Harness>)
  // "SUPERMARKET" is rendered inside an SVG <text> node in step 1
  const svgLabel = screen.getByRole('textbox', { name: 'Edit label: SUPERMARKET' })
  act(() => { fireEvent.change(svgLabel, { target: { value: 'GROCER' } }) })
  expect(container.querySelector('svg')?.textContent).toContain('GROCER')
})

test('labels are collected across a visual’s own interactive states', async () => {
  render(<Harness visualKey="option-greeks"><OptionGreeks /></Harness>)
  // First-order Greeks are on screen at mount
  expect(screen.getByRole('textbox', { name: 'Edit label: DELTA' })).toBeInTheDocument()
  // Switching tab re-renders the visual; the layer re-scans on the next frame
  fireEvent.click(screen.getByRole('button', { name: 'Second order' }))
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: 'Edit label: VANNA' })).toBeInTheDocument())
})

test('the panel is hidden outside edit mode', () => {
  render(<Harness visualKey="everyone-is-a-trader" editMode={false}><EveryoneIsATrader /></Harness>)
  expect(screen.queryByText(/label.? found/)).toBeNull()
})
