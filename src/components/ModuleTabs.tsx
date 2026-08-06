'use client'

import Link from 'next/link'
import { modules } from '@/content'
import { COURSE_LABELS, courseOf } from '@/types/content'
import { useTextOverride } from '@/lib/textOverrides'
import { moduleTitleKey } from '@/lib/contentKeys'

type Props = { activeId: number }

// The tab label reads any edited module title (kept in sync with the hero).
function TabTitle({ id, title }: { id: number; title: string }) {
  const t = useTextOverride(moduleTitleKey(id), title)
  return <span className="whitespace-nowrap text-[13px] font-medium tracking-tight">{t}</span>
}

// The app hosts two lecture series — each gets its OWN ROW in the tab bar,
// so the two courses read as clearly separate lectures. Modules number
// within their own course.
const COURSES = ['commodity', 'chartering'] as const

export default function ModuleTabs({ activeId }: Props) {
  return (
    <nav className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#070912]/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-5">
        {COURSES.map((course, ci) => {
          const mods = modules.filter(m => courseOf(m) === course)
          if (mods.length === 0) return null
          return (
            <div key={course}
              className={`flex items-center gap-1.5 overflow-x-auto py-2 ${ci > 0 ? 'border-t border-white/[0.05]' : ''}`}>
              <span className="w-28 shrink-0 pr-1 font-mono text-[9px] font-bold uppercase leading-tight tracking-[0.16em] text-slate-500">
                {COURSE_LABELS[course]}
              </span>
              {mods.map((mod, i) => {
                const active = mod.id === activeId
                return (
                  <Link
                    key={mod.id}
                    href={`/module/${mod.id}`}
                    className={`group relative flex shrink-0 items-center gap-2.5 rounded-full px-4 py-2 transition-all duration-200 ${
                      active
                        ? 'bg-white/[0.06] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]'
                        : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-100'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-[11px] font-bold transition-colors ${
                        active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                      style={active
                        ? { background: course === 'chartering' ? 'linear-gradient(135deg,#22d3ee,#0ea5e9)' : 'linear-gradient(135deg,#3b82f6,#6366f1)', boxShadow: '0 0 16px -2px rgba(99,102,241,0.8)' }
                        : { background: 'rgba(255,255,255,0.05)' }}
                    >
                      {i + 1}
                    </span>
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
