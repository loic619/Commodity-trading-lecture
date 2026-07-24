import { render, fireEvent, screen } from '@testing-library/react'
import TraderInbox from '@/visuals/TraderInbox'
import AnalystInbox from '@/visuals/AnalystInbox'
import { EditModeProvider } from '@/lib/editMode'

// Inbox edits persist to localStorage — clear between tests so one test's
// edits never leak into another.
afterEach(() => window.localStorage.clear())

const best = [
  /Confirmed: net flat zero/,
  /margin is the cash cost of zero price risk/,
  /Counter at 119,500/,
  /Selling 20 lots Jan now/,
  /EFP at 4,760/,
  /book the freight NOW/,
  /Flat \$0 \(fully hedged\)/,
]

test('a perfectly handled day closes at +$4,300', () => {
  const { container } = render(<TraderInbox />)
  // The whole inbox is readable from the start — like a real inbox
  expect(container.textContent).toContain('Overnight check')
  expect(screen.getByRole('button', { name: /17:30/ })).toBeEnabled()
  fireEvent.click(screen.getByRole('button', { name: /17:30/ }))
  expect(container.textContent).toContain('EOD — desk report due')
  fireEvent.click(screen.getByRole('button', { name: /06:30/ }))
  // Emails read like emails: signatures included
  expect(container.textContent).toContain('Risk & Product Control — HCM Desk')
  best.forEach((r, i) => {
    fireEvent.click(screen.getByRole('button', { name: r }))
    if (i < best.length - 1) fireEvent.click(screen.getByRole('button', { name: /Open next email/ }))
  })
  const text = container.textContent ?? ''
  expect(text).toContain('day complete')
  expect(text).toContain('+$4,300')
  expect(text).toContain('Clean day')
})

test('wrong replies cost money and show their feedback', () => {
  const { container } = render(<TraderInbox />)
  // Cut the hedge on email 1 — the classic PTBF-unfixed mistake
  fireEvent.click(screen.getByRole('button', { name: /Cut 120 lots/ }))
  const text = container.textContent ?? ''
  expect(text).toContain('−$12,000')
  expect(text).toContain('sold is not fixed')
  expect(text).toContain('decisions −$12,000')
})

test('answered emails can be revisited from the inbox list', () => {
  const { container } = render(<TraderInbox />)
  fireEvent.click(screen.getByRole('button', { name: /Confirmed: net flat zero/ }))
  // Move on to email 2, then revisit email 1 from the list
  fireEvent.click(screen.getByRole('button', { name: /Open next email/ }))
  expect(container.textContent).toContain('URGENT')
  fireEvent.click(screen.getByRole('button', { name: /06:30/ }))
  expect(container.textContent).toContain('You replied:')
  expect(container.textContent).toContain('Risk signs off')
})

// ── Module 1's junior inbox — a full trading day, date-adaptive contracts ──

// Correct replies, matched on the date-INDEPENDENT part of each label so the
// test passes whatever contract months today resolves to.
const analystBest = [
  /Confirmed — book is fully hedged/,
  /Wire \$150,000/,
  /File both numbers/,
  /TENDER it into the expiring/,
  /at market — the front, most nearby/,
  /find the cheapest exit/,
  /Cash-and-carry: take delivery/,
]

test('AnalystInbox: pre-market first, coffee break, then the market opens and re-prices', () => {
  const { container } = render(<AnalystInbox />)
  expect(container.textContent).toContain('junior analyst')
  // Pre-market: the near-flat curve, OI drained from the front, market CLOSED
  expect(container.textContent).toContain('pre-market')
  expect(container.textContent).toContain('LIGHT CONTANGO')
  expect(container.textContent).toContain('OI 1,900')
  expect(container.textContent).toContain('market closed')
  // The post-open emails are locked behind the gate
  expect(container.textContent).toContain('Locked until the market opens')
  expect(screen.queryByRole('button', { name: /16:50/ })).toBeNull()

  // Answer the four pre-market emails
  analystBest.slice(0, 4).forEach((r, i) => {
    fireEvent.click(screen.getByRole('button', { name: r }))
    if (i < 3) fireEvent.click(screen.getByRole('button', { name: /Open next email/ }))
  })
  // Coffee break over — open the market (button appears in the list and the pane)
  fireEvent.click(screen.getAllByRole('button', { name: /Open the market/ })[0])
  // The tape has moved: the spread blows out and the front sells off
  expect(container.textContent).toContain('SPREAD BLOWN OUT')
  expect(container.textContent).toContain('2,980')
  expect(container.textContent).toContain('3,070')

  // Now the trading emails are answerable
  fireEvent.click(screen.getByRole('button', { name: /Open next email/ }))
  analystBest.slice(4).forEach((r, i, arr) => {
    fireEvent.click(screen.getByRole('button', { name: r }))
    if (i < arr.length - 1) fireEvent.click(screen.getByRole('button', { name: /Open next email/ }))
  })
  const text = container.textContent ?? ''
  expect(text).toContain('day complete')
  expect(text).toContain('+$2,000')
  expect(text).toContain('Clean first day')
})

test('AnalystInbox: a market order walks the ask ladder — 10 lots at several prices', () => {
  const { container } = render(<AnalystInbox />)
  fireEvent.click(screen.getAllByRole('button', { name: /Open the market/ })[0])
  fireEvent.click(screen.getByRole('button', { name: /15:45/ }))
  fireEvent.click(screen.getByRole('button', { name: /at market — the front, most nearby/ }))
  const text = container.textContent ?? ''
  // The confirmation shows the walk up the offer ladder, not one clean price
  expect(text).toContain('4 lots @ 2,997')
  expect(text).toContain('2 lots @ 3,006')
  expect(text).toContain('average 3,000')
  expect(text).toContain('slippage')
})

test('AnalystInbox: formatted replies — the cash-and-carry maths is spelled out', () => {
  const { container } = render(<AnalystInbox />)
  // Open the market, then jump to the final decision email
  fireEvent.click(screen.getAllByRole('button', { name: /Open the market/ })[0])
  fireEvent.click(screen.getByRole('button', { name: /16:50/ }))
  fireEvent.click(screen.getByRole('button', { name: /Cash-and-carry: take delivery/ }))
  const text = container.textContent ?? ''
  expect(text).toContain('spread captured')
  expect(text).toContain('less financing')
  expect(text).toContain('+$20/t')          // net per tonne
  expect(text).toContain('+$2,000 on 100 t') // the rescue turns −$2,000 into +$2,000
})

test('AnalystInbox edit mode: the instructor can rewrite an email and its answers', () => {
  const { container } = render(
    <EditModeProvider value={true}>
      <AnalystInbox />
    </EditModeProvider>,
  )
  // No edit affordance without edit mode → here it IS present
  fireEvent.click(screen.getByRole('button', { name: /Edit emails/ }))
  // Rewrite the first email's subject and see it in the inbox list
  const subject = screen.getByDisplayValue(/^Position sheet/)
  fireEvent.change(subject, { target: { value: 'CUSTOM SUBJECT ✎' } })
  // Rewrite the model reply's feedback too
  const feedback = screen.getByDisplayValue(/hedged-and-sold book carries no flat-price risk/)
  fireEvent.change(feedback, { target: { value: 'My own explanation.' } })
  fireEvent.click(screen.getByRole('button', { name: /Done editing/ }))
  // The edits are live in the running inbox
  expect(container.textContent).toContain('CUSTOM SUBJECT ✎')
  expect(container.textContent).toContain('Reset edits (2)')
  // Playing it through shows the edited feedback
  fireEvent.click(screen.getByRole('button', { name: /Confirmed — book is fully hedged/ }))
  expect(container.textContent).toContain('My own explanation.')
  // Reset restores the defaults
  fireEvent.click(screen.getByRole('button', { name: /Reset edits/ }))
  expect(container.textContent).not.toContain('CUSTOM SUBJECT ✎')
})

test('AnalystInbox: without edit mode there is no edit affordance', () => {
  render(<AnalystInbox />)
  expect(screen.queryByRole('button', { name: /Edit emails/ })).toBeNull()
})

test('AnalystInbox: the margin arithmetic mistake costs and explains the lot size', () => {
  const { container } = render(<AnalystInbox />)
  // The margin call is a pre-market email — select it, then pick the wrong wire
  fireEvent.click(screen.getByRole('button', { name: /07:10/ }))
  fireEvent.click(screen.getByRole('button', { name: /Wire \$15,000/ }))
  const text = container.textContent ?? ''
  expect(text).toContain('−$1,500')
  expect(text).toContain('a lot is 10 TONNES')
})
