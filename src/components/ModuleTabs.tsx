'use client'

import Link from 'next/link'
import { modules } from '@/content'
import { COURSE_LABELS, courseOf } from '@/types/content'
import { useTextOverride } from '@/lib/textOverrides'
import { moduleTitleKey } from '@/lib/contentKeys'
import { moduleIdForSlug, type ModuleSlug } from '@/lib/moduleSlugs'

type Props = { activeSlug: ModuleSlug; visible: ModuleSlug[] }

// The tab label reads any edited module title (kept in sync with the hero).
function TabTitle({ id, title }: { id: number; title: string }) {
  const t = useTextOverride(moduleTitleKey(id), title)
  return <span className="whitespace-nowrap text-[13px] font-medium tracking-tight">{t}</span>
}

const COURSES = ['commodity', 'chartering'] as const

/**
 * The tab bar shows ONLY the sessions this device has opened — and names
 * them, never numbers them. A student holding one invitation sees one tab and
 * has no way to learn that the others exist.
 *
 * With a single session open there is nothing to switch between, so the bar
 * disappears entirely rather than sitting there as a lone orphan tab.
 */
export default function ModuleTabs({ activeSlug, visible }: Props) {
  if (visible.length < 2) return null
  const visibleIds = new Set(visible.map(moduleIdForSlug))
  const activeId = moduleIdForSlug(activeSlug)

  return (
    <nav className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#070912]/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-5">
        {COURSES.map((course, ci) => {
          const mods = modules.filter(m => courseOf(m) === course && visibleIds.has(m.id))
          if (mods.length === 0) return null
          return (
            <div key={course}
              className={`flex items-center gap-1.5 overflow-x-auto py-2 ${ci > 0 ? 'border-t border-white/[0.05]' : ''}`}>
              <span className="w-28 shrink-0 pr-1 font-mono text-[9px] font-bold uppercase leading-tight tracking-[0.16em] text-slate-500">
                {COURSE_LABELS[course]}
              </span>
              {mods.map(mod => {
                const active = mod.id === activeId
                const slug = visible.find(s => moduleIdForSlug(s) === mod.id)!
                return (
                  <Link
                    key={mod.id}
                    href={`/m/${slug}`}
                    className={`group relative flex shrink-0 items-center gap-2.5 rounded-full px-4 py-2 transition-all duration-200 ${
                      active
                        ? 'bg-white/[0.06] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]'
                        : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-100'
                    }`}
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full transition-colors"
                      style={active
                        ? { background: course === 'chartering' ? 'linear-gradient(135deg,#22d3ee,#0ea5e9)' : 'linear-gradient(135deg,#3b82f6,#6366f1)', boxShadow: '0 0 12px -1px rgba(99,102,241,0.9)' }
                        : { background: 'rgba(255,255,255,0.18)' }}
                    />
                    <TabTitle id={mod.id} title={mod.title} />
                  </Link>
                )
              })}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
