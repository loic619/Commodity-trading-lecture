import { render, screen } from '@testing-library/react'
import ModuleTabs from '@/components/ModuleTabs'
import Breadcrumb from '@/components/Breadcrumb'
import { MODULE_SLUGS, moduleIdForSlug } from '@/lib/moduleSlugs'
import { modules } from '@/content'

// The property the whole access redesign exists to guarantee: a student
// holding one invitation can learn nothing about the others — not their
// titles, not their count, not even that they exist.

describe('a session never reveals the others', () => {
  test('the tab bar shows only what this device has opened', () => {
    const { container } = render(<ModuleTabs activeSlug="cherry" visible={['cherry', 'atlas']} />)
    const text = container.textContent ?? ''
    expect(text).toContain(modules[0].title)   // cherry — opened
    expect(text).toContain(modules[2].title)   // atlas  — opened
    expect(text).not.toContain(modules[1].title) // basis — not opened, invisible
    expect(text).not.toContain(modules[4].title)
  })

  test('with a single session open the bar disappears entirely', () => {
    const { container } = render(<ModuleTabs activeSlug="cherry" visible={['cherry']} />)
    // Nothing to switch between, so no orphan tab hinting at a second session
    expect(container).toBeEmptyDOMElement()
  })

  test('nothing in the chrome numbers a module', () => {
    const { container } = render(<ModuleTabs activeSlug="cherry" visible={['cherry', 'basis', 'atlas']} />)
    expect(container.textContent ?? '').not.toMatch(/Module\s*\d/i)
  })

  test('the breadcrumb names the session instead of numbering it', () => {
    render(<Breadcrumb moduleSlug="basis" topicTitle="The Differential" />)
    expect(screen.getByText(modules[1].title)).toBeInTheDocument()
    expect(screen.queryByText(/Module\s*\d/i)).not.toBeInTheDocument()
    // and it does not offer a route back to a listing of everything
    expect(screen.queryByText('Home')).not.toBeInTheDocument()
  })

  test('links are built from slugs, never from ids', () => {
    render(<ModuleTabs activeSlug="cherry" visible={['cherry', 'basis']} />)
    for (const link of screen.getAllByRole('link')) {
      const href = link.getAttribute('href') ?? ''
      expect(href).toMatch(/^\/m\/[a-z]+$/)
      expect(href).not.toMatch(/\d/)
    }
  })

  test('every slug maps to a real module', () => {
    for (const slug of MODULE_SLUGS) {
      expect(modules[moduleIdForSlug(slug) - 1]).toBeDefined()
    }
  })
})
