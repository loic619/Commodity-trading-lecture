import { notFound } from 'next/navigation'
import { modules } from '@/content'
import QuizRunner from './QuizRunner'
import { isModuleSlug, moduleIdForSlug } from '@/lib/moduleAccess'
import { requireModuleAccess } from '@/lib/requireModuleAccess'

type Props = { params: { slug: string; quizId: string } }

export default function QuizPage({ params }: Props) {
  if (!isModuleSlug(params.slug)) notFound()
  const slug = params.slug
  const moduleId = moduleIdForSlug(slug)
  const mod = modules[moduleId - 1]
  if (!mod) notFound()

  const topic = mod.topics.find(t => t.id === params.quizId)
  if (!topic || !topic.quiz || topic.quiz.questions.length === 0) notFound()

  requireModuleAccess(slug)

  return (
      <QuizRunner
        questions={topic.quiz.questions}
        moduleSlug={slug}
        topicTitle={topic.title}
        topicId={topic.id}
      />
  )
}
