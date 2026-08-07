import { render, screen, fireEvent } from '@testing-library/react'
import ThemeToggle from '@/components/ThemeToggle'

afterEach(() => {
  window.localStorage.clear()
  document.documentElement.classList.remove('day')
})

test('defaults to night; toggling applies the day class and persists', () => {
  render(<ThemeToggle />)
  expect(document.documentElement.classList.contains('day')).toBe(false)
  fireEvent.click(screen.getByRole('button', { name: 'Switch to day theme' }))
  expect(document.documentElement.classList.contains('day')).toBe(true)
  expect(window.localStorage.getItem('lecture-theme')).toBe('day')
  // Toggle back to night
  fireEvent.click(screen.getByRole('button', { name: 'Switch to night theme' }))
  expect(document.documentElement.classList.contains('day')).toBe(false)
  expect(window.localStorage.getItem('lecture-theme')).toBe('night')
})

test('a saved day preference is restored on mount', () => {
  window.localStorage.setItem('lecture-theme', 'day')
  render(<ThemeToggle />)
  expect(document.documentElement.classList.contains('day')).toBe(true)
})
