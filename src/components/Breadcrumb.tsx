import Link from 'next/link'
import { modules } from '@/content'
import { moduleIdForSlug, type ModuleSlug } from '@/lib/moduleSlugs'

type Props = { moduleSlug: ModuleSlug; topicTitle: string }

export default function Breadcrumb({ moduleSlug, topicTitle }: Props) {
  // Named, never numbered: "Module 2" would reveal that a Module 1 exists.
  const title = modules[moduleIdForSlug(moduleSlug) - 1]?.title ?? 'Session'
  return (
    <nav className="border-b border-white/[0.06] bg-[#070912]/70 px-5 py-3 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center gap-2 text-xs">
        <Link href={`/m/${moduleSlug}`} className="truncate font-medium text-slate-400 transition-colors hover:text-brand-blue">
          {title}
        </Link>
        <span className="text-slate-700">/</span>
        <span className="truncate font-medium text-slate-200">{topicTitle}</span>
      </div>
    </nav>
  )
}
