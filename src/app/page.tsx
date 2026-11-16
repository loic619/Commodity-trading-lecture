import Link from 'next/link'
import { redirect } from 'next/navigation'
import { modules } from '@/content'
import { COURSE_LABELS, courseOf } from '@/types/content'
import { moduleIdForSlug } from '@/lib/moduleAccess'
import { unlockedSlugs } from '@/lib/unlocked'

export const dynamic = 'force-dynamic'

/**
 * The front door, and deliberately a quiet one.
 *
 * It lists only what this device has opened. A visitor with no invitation
 * sees a page that does not name a single module, does not say how many
 * exist, and offers nothing to click — because there is nothing here to
 * discover without a link.
 */
export default function Home() {
  const open = unlockedSlugs()

  // One module open is the normal case: go straight in.
  if (open.length === 1) redirect(`/m/${open[0]}`)

  if (open.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md animate-fade-up text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: 'linear-gradient(135deg,#22d3ee,#3b82f6 45%,#8b5cf6)', boxShadow: '0 14px 40px -10px rgba(59,130,246,0.7)' }}>
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17l5-6 4 3 5-8 4 5" />
            </svg>
          </div>
          <div className="eyebrow text-brand-cyan/90">Université Paris-Panthéon-Assas</div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            <span className="text-gradient">Lectures</span>
          </h1>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
            Each session opens with its own invitation link. Use the link your instructor sent you — it opens the session on
            this device and stays open for the term.
          </p>
          <p className="mt-6 font-mono text-[11px] text-slate-600">
            Nothing to see here without one.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-16 sm:px-6">
      <div className="animate-fade-up">
        <div className="eyebrow text-brand-cyan/90">Université Paris-Panthéon-Assas</div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          <span className="text-gradient">Your sessions</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
          The sessions you have opened on this device.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {open.map(slug => {
          const mod = modules[moduleIdForSlug(slug) - 1]
          if (!mod) return null
          const mins = mod.topics.reduce((s, t) => s + (t.estimatedMinutes || 0), 0)
          return (
            <Link key={slug} href={`/m/${slug}`} className="glass glass-hover group block p-5">
              <span className="eyebrow text-slate-500">{COURSE_LABELS[courseOf(mod)]}</span>
              <h2 className="mt-2 text-xl font-semibold leading-snug text-slate-100 transition-colors group-hover:text-white">
                {mod.title}
              </h2>
              <p className="mt-2 font-mono text-[11px] text-slate-500">
                {mod.topics.length} sessions · {Math.round(mins / 60 * 10) / 10} h
              </p>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
