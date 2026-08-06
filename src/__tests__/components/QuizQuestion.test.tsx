import { render, screen, fireEvent } from '@testing-library/react'
import QuizQuestion from '@/components/QuizQuestion'
import type { Question } from '@/types/content'

const question: Question = {
  id: 'q1',
  question: 'What is 2 + 2?',
  options: ['3', '4', '5', '6'],
  correctIndex: 1,
  explanation: 'Basic arithmetic: 2 + 2 = 4.',
}

const onAnswer = jest.fn()

beforeEach(() => onAnswer.mockClear())

test('renders question and all 4 options', () => {
  render(<QuizQuestion question={question} questionNumber={1} total={5} onAnswer={onAnswer} />)
  expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument()
  const buttons = screen.getAllByRole('button')
  expect(buttons).toHaveLength(4)
  expect(buttons[0]).toHaveTextContent('3')
  expect(buttons[1]).toHaveTextContent('4')
  expect(buttons[2]).toHaveTextContent('5')
  expect(buttons[3]).toHaveTextContent('6')
})

test('answering does NOT auto-advance — the Next button carries the result', () => {
  render(<QuizQuestion question={question} questionNumber={1} total={5} onAnswer={onAnswer} />)
  fireEvent.click(screen.getAllByRole('button')[1]) // "4" = correct
  // No auto-advance: onAnswer only fires on the explicit Next click
  expect(onAnswer).not.toHaveBeenCalled()
  expect(screen.getByText('Basic arithmetic: 2 + 2 = 4.')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Next question →' }))
  expect(onAnswer).toHaveBeenCalledWith(true)
})

test('a wrong answer passes false on Next', () => {
  render(<QuizQuestion question={question} questionNumber={1} total={5} onAnswer={onAnswer} />)
  fireEvent.click(screen.getAllByRole('button')[0]) // "3" = wrong
  fireEvent.click(screen.getByRole('button', { name: 'Next question →' }))
  expect(onAnswer).toHaveBeenCalledWith(false)
})

test('the last question offers "See results" instead of "Next question"', () => {
  render(<QuizQuestion question={question} questionNumber={5} total={5} onAnswer={onAnswer} />)
  fireEvent.click(screen.getAllByRole('button')[1])
  expect(screen.queryByRole('button', { name: 'Next question →' })).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'See results →' }))
  expect(onAnswer).toHaveBeenCalledWith(true)
})

test('shows explanation after answering', () => {
  render(<QuizQuestion question={question} questionNumber={1} total={5} onAnswer={onAnswer} />)
  fireEvent.click(screen.getAllByRole('button')[1])
  expect(screen.getByText('Basic arithmetic: 2 + 2 = 4.')).toBeInTheDocument()
})

test('disables the option buttons after answering (Next stays active)', () => {
  render(<QuizQuestion question={question} questionNumber={1} total={5} onAnswer={onAnswer} />)
  const options = screen.getAllByRole('button')
  fireEvent.click(options[0])
  options.forEach(btn => expect(btn).toBeDisabled())
  expect(screen.getByRole('button', { name: 'Next question →' })).toBeEnabled()
})
