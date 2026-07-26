import { render, fireEvent, screen } from '@testing-library/react'
import { EditRoot, EditableText } from '@/lib/textOverrides'
import { visualTextRegistry } from '@/visuals'

afterEach(() => window.localStorage.clear())

test('EditableText: read-only outside edit mode', () => {
  const { unmount } = render(
    <EditRoot><EditableText id="demo.key" value="Original label" as="span" /></EditRoot>,
  )
  expect(screen.queryByDisplayValue('Original label')).toBeNull()
  expect(screen.getByText('Original label')).toBeInTheDocument()
  unmount()
})

test('EditableText: editable and persisted inside edit mode; Reset clears it', () => {
  // EditRoot reads the shared persisted edit-mode flag on mount
  window.localStorage.setItem('slide-edit-mode', '1')
  render(<EditRoot><EditableText id="demo.key" value="Original label" as="span" /></EditRoot>)
  const input = screen.getByDisplayValue('Original label')
  fireEvent.change(input, { target: { value: 'Renamed label' } })
  // The edit persists to localStorage under a stable key
  expect(JSON.parse(window.localStorage.getItem('text-overrides') || '{}')['demo.key']).toBe('Renamed label')
  // …and Reset clears it
  fireEvent.click(screen.getByRole('button', { name: /Reset text/ }))
  expect(JSON.parse(window.localStorage.getItem('text-overrides') || '{}')['demo.key']).toBeUndefined()
})

test('the chart-label charts expose every label as an editable visual-text field', () => {
  // PhysicalFlow node names ("chart component names") are editable fields
  const pf = visualTextRegistry['physical-flow']
  const pfKeys = pf.fields.map(f => f.value)
  expect(pfKeys).toEqual(expect.arrayContaining(['SUPPLIER', 'WAREHOUSE', 'CUSTOMER']))
  // TradeWorkflow lane names + step titles are editable fields
  const tw = visualTextRegistry['trade-workflow']
  const twKeys = tw.fields.map(f => f.value)
  expect(twKeys).toEqual(expect.arrayContaining(['FRONT OFFICE', 'OPERATIONS / LOGISTICS', 'Deal done']))
})
