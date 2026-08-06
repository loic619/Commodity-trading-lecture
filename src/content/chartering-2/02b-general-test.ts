import type { Topic } from '@/types/content'

// The agenda's "General test + review of test": one checkpoint quiz over
// everything from vessel characteristics to the pre-loading file. The
// explanations ARE the review — read them even on a right answer.
const topic: Topic = {
  id: '02b-general-test',
  title: 'General Test — Fixture to Pre-loading',
  type: 'quiz',
  estimatedMinutes: 15,
  quiz: {
    questions: [
      {
        id: 'q1',
        question: 'An Aframax has TPC 90 t/cm. The berth imposes a draft 40 cm below her zone-permitted maximum. The short-lift is roughly:',
        options: ['400 t', '3,600 t', '900 t', '40 t'],
        correctIndex: 1,
        explanation: '40 cm × 90 t/cm = 3,600 t. TPC converts draft restrictions straight into tonnes — and into deadfreight exposure if the charterer had committed the full stem.',
      },
      {
        id: 'q2',
        question: 'Loading at a fresh-water river berth, the ship may legally submerge her loadline marks because:',
        options: [
          'River authorities do not enforce loadlines',
          'The FWA/DWA allows it — she will rise to her marks on reaching salt water',
          'The Master accepts the risk against a letter of indemnity',
          'TPC is lower in fresh water',
        ],
        correctIndex: 1,
        explanation: 'Ships float deeper in fresh water. The fresh water allowance (FWA ≈ displacement / 4×TPC, interpolated by the DWA for brackish water) lets her load past her marks in the river precisely because buoyancy increases — and the marks come right — at sea.',
      },
      {
        id: 'q3',
        question: 'Freight on 80,000 t at WS95 with a flat rate of $7.60/t is:',
        options: ['$608,000', '$577,600', '$760,000', '$72,200'],
        correctIndex: 1,
        explanation: 'Flat × WS/100 × tonnes = 7.60 × 0.95 × 80,000 = $577,600. The flat rate absorbs the voyage geometry; the WS percentage is where the market negotiates.',
      },
      {
        id: 'q4',
        question: 'A tanker is described as "approved by two oil majors". For your fixture next week this means:',
        options: [
          'She holds certificates guaranteeing acceptance at their terminals',
          'Little by itself — majors screen per voyage against SIRE and their own criteria each time',
          'She is exempt from further vetting for 12 months',
          'Her SIRE inspections are waived',
        ],
        correctIndex: 1,
        explanation: 'There is no such thing as a standing "approval certificate": each major screens the ship for each voyage (SIRE report, age policy, terminal feedback, PSC history). Past acceptance is evidence, not entitlement.',
      },
      {
        id: 'q5',
        question: 'The recap says laytime "72 hrs SHINC". A rider clause in the attached CP says "SHEX". Which governs?',
        options: [
          'The rider clause — riders always override',
          'The printed CP form',
          'The recap — it records the terms actually agreed and overrides both',
          'Whichever favours the owner',
        ],
        correctIndex: 2,
        explanation: 'The hierarchy runs recap > rider clauses/amendments > printed form. The recap is the record of what was actually negotiated — which is why checking it line by line before subjects lift is the cheapest risk management in shipping.',
      },
      {
        id: 'q6',
        question: 'Your CP allows 72 hrs laytime; your sale contract gives the receiver 96 hrs. This mismatch means:',
        options: [
          'Nothing — laytime always follows the CP',
          'You structurally carry up to 24 hrs of demurrage you cannot pass on',
          'The receiver owes you despatch',
          'The CP is void for inconsistency',
        ],
        correctIndex: 1,
        explanation: 'The back-to-back trap: the owner claims against YOUR 72-hr CP clock while your recovery against the receiver only starts after THEIR 96 hrs. The 24-hour gap — and any demurrage-rate gap — is your structural exposure, fixable only before the documents are agreed.',
      },
      {
        id: 'q7',
        question: 'The vessel will miss her cancelling date. The charterer’s position is:',
        options: [
          'Automatic damages for the delay',
          'The fixture terminates automatically',
          'An option: cancel (and re-fix if the market fell) or keep the ship — no damages for lateness alone',
          'The owner may substitute any other vessel',
        ],
        correctIndex: 2,
        explanation: 'Missing the can gives the charterer an option, not damages: valuable when the freight market has fallen (cancel and re-fix cheaper), worthless when it has risen. Hence the interpellation clauses that force an early declaration instead of a wasted voyage.',
      },
      {
        id: 'q8',
        question: 'During loading, repeated Ship/Shore Safety Check List (SSSCL) checks fail on the terminal’s side and operations stop for six hours. That time is:',
        options: [
          'Always laytime — the ship was at the berth',
          'Always the owner’s loss',
          'A grey zone settled by the CP’s exceptions clause — and by who documented which item failed',
          'Split 50/50 by ISGOTT convention',
        ],
        correctIndex: 2,
        explanation: 'A safety stoppage sits between "charterer’s cargo operations" and "fault of the terminal/ship". The CP’s laytime exceptions decide — and the side whose operator logged WHO failed WHICH checklist item usually wins the argument.',
      },
    ],
  },
}

export default topic
