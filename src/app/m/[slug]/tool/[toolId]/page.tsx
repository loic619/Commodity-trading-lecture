import { notFound } from 'next/navigation'
import { modules } from '@/content'
import { toolRegistry } from '@/tools'
import Breadcrumb from '@/components/Breadcrumb'
import { isModuleSlug, moduleIdForSlug } from '@/lib/moduleAccess'
import { requireModuleAccess } from '@/lib/requireModuleAccess'

type Props = { params: { slug: string; toolId: string } }

export default function ToolPage({ params }: Props) {
  if (!isModuleSlug(params.slug)) notFound()
  const slug = params.slug
  const moduleId = moduleIdForSlug(slug)
  const mod = modules[moduleId - 1]
  if (!mod) notFound()

  const topic = mod.topics.find(t => t.id === params.toolId)
  if (!topic || !topic.tool) notFound()

  const Tool = toolRegistry[topic.tool.componentKey]
  if (!Tool) notFound()

  requireModuleAccess(slug)


  return (
      <div className="min-h-screen text-white">
        <Breadcrumb moduleSlug={slug} topicTitle={topic.title} />
        <Tool />
      </div>
  )
}
