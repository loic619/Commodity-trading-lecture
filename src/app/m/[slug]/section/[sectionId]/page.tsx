import { notFound } from 'next/navigation'
import { modules } from '@/content'
import SectionReader from '@/components/SectionReader'
import { isModuleSlug, moduleIdForSlug } from '@/lib/moduleAccess'
import { requireModuleAccess } from '@/lib/requireModuleAccess'

type Props = { params: { slug: string; sectionId: string } }

export default function SectionPage({ params }: Props) {
  if (!isModuleSlug(params.slug)) notFound()
  const slug = params.slug
  const moduleId = moduleIdForSlug(slug)
  const mod = modules[moduleId - 1]
  if (!mod) notFound()

  const topic = mod.topics.find(t => t.id === params.sectionId)
  if (!topic || !topic.sections || topic.sections.length === 0) notFound()

  requireModuleAccess(slug)

  return (
      <SectionReader
        sections={topic.sections}
        moduleSlug={slug}
        topicTitle={topic.title}
        topicId={topic.id}
      />
  )
}
