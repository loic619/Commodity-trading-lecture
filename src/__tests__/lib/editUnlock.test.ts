import { requestEditUnlock, editUnlocked } from '@/lib/slideOverrides'

afterEach(() => {
  window.sessionStorage.clear()
  jest.restoreAllMocks()
})

test('wrong password is refused and does not unlock', () => {
  jest.spyOn(window, 'prompt').mockReturnValue('nope')
  jest.spyOn(window, 'alert').mockImplementation(() => {})
  expect(requestEditUnlock()).toBe(false)
  expect(editUnlocked()).toBe(false)
})

test('cancelling the prompt is refused', () => {
  jest.spyOn(window, 'prompt').mockReturnValue(null)
  expect(requestEditUnlock()).toBe(false)
  expect(editUnlocked()).toBe(false)
})

test('the right password unlocks and is remembered for the session', () => {
  const prompt = jest.spyOn(window, 'prompt').mockReturnValue('loicssss')
  expect(requestEditUnlock()).toBe(true)
  expect(editUnlocked()).toBe(true)
  // once unlocked, a second request does not prompt again
  prompt.mockClear()
  expect(requestEditUnlock()).toBe(true)
  expect(prompt).not.toHaveBeenCalled()
})
