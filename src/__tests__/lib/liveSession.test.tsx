import { render, screen, waitFor, act } from '@testing-library/react'
import { useLiveSession } from '@/lib/liveSession'

// A probe component that surfaces the hook's output as text we can assert on.
function Probe({ sim }: { sim: string }) {
  const s = useLiveSession(sim)
  return (
    <div>
      <span data-testid="configured">{String(s.configured)}</span>
      <span data-testid="active">{String(s.active)}</span>
      <span data-testid="start">{s.clientStartAt == null ? 'null' : String(s.clientStartAt)}</span>
    </div>
  )
}

const realFetch = global.fetch
afterEach(() => { global.fetch = realFetch })

test('no broadcast: reports inactive and never throws when the server is silent', async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch
  render(<Probe sim="futures-screen" />)
  await waitFor(() => expect(screen.getByTestId('active')).toHaveTextContent('false'))
  expect(screen.getByTestId('start')).toHaveTextContent('null')
})

test('active broadcast: converts the server start into this device clock, correcting for skew', async () => {
  // The server clock runs 5s ahead of this device; the shared start is 1_000_000.
  const startAt = 1_000_000
  const skew = 5_000
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ startAt, serverNow: Date.now() + skew, configured: true }),
  } as Response) as unknown as typeof fetch

  render(<Probe sim="ptbf-floor" />)
  await waitFor(() => expect(screen.getByTestId('configured')).toHaveTextContent('true'))

  // clientStartAt = startAt − (serverNow − now) = startAt − skew
  const client = Number(screen.getByTestId('start').textContent)
  expect(screen.getByTestId('active')).toHaveTextContent('true')
  expect(Math.abs(client - (startAt - skew))).toBeLessThan(50)
})

test('cleared broadcast: a null start yields no active session', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ startAt: null, serverNow: Date.now(), configured: true }),
  } as Response) as unknown as typeof fetch

  render(<Probe sim="futures-screen" />)
  await waitFor(() => expect(screen.getByTestId('configured')).toHaveTextContent('true'))
  expect(screen.getByTestId('active')).toHaveTextContent('false')
  expect(screen.getByTestId('start')).toHaveTextContent('null')
})

test('launch posts the start (in server-clock terms) and goes live optimistically', async () => {
  const posted: unknown[] = []
  global.fetch = jest.fn(async (_url: unknown, init?: RequestInit) => {
    if (init?.method === 'POST') { posted.push(JSON.parse(String(init.body))); return { ok: true, json: async () => ({ ok: true }) } as Response }
    return { ok: true, json: async () => ({ startAt: null, serverNow: Date.now(), configured: true }) } as Response
  }) as unknown as typeof fetch

  let launch: () => Promise<void> = async () => {}
  function Ctl() {
    const s = useLiveSession('futures-screen')
    launch = s.launch
    return <span data-testid="active">{String(s.active)}</span>
  }
  render(<Ctl />)
  await waitFor(() => expect(screen.getByTestId('active')).toHaveTextContent('false'))
  await act(async () => { await launch() })
  expect(screen.getByTestId('active')).toHaveTextContent('true')
  expect((posted[0] as { sim: string }).sim).toBe('futures-screen')
  expect(typeof (posted[0] as { startAt: number }).startAt).toBe('number')
})
