const K = require('./build.js')
const {
  pres, content, divider, statement, body, cards, stat, table, H, N,
  INK, PAPER, ACCENT, MUTED, RULE, SOFT, SERIF, SANS, MONO, M, W, setSection,
} = K

const B = (t) => ({ text: t, options: { bullet: { code: '2013' }, breakLine: true } })
const Bl = (t) => ({ text: t, options: { bullet: { code: '2013' } } })

/* ───────────────────────── 1. Title ───────────────────────── */
setSection('')
{
  const s = pres.addSlide()
  s.background = { color: INK }
  s.addText('Commodity Trading', {
    x: M, y: 1.55, w: W, h: 0.95, isTextBox: true, margin: 0,
    fontFace: SERIF, fontSize: 46, bold: true, color: PAPER,
  })
  s.addText('Module 1 — Panorama and vocabulary', {
    x: M, y: 2.5, w: W, h: 0.45, isTextBox: true, margin: 0,
    fontFace: SERIF, fontSize: 20, color: ACCENT,
  })
  s.addText('Loïc Scanu   ·   Université Paris-Panthéon-Assas', {
    x: M, y: 4.35, w: W, h: 0.3, isTextBox: true, margin: 0,
    fontFace: MONO, fontSize: 10, color: '9A8F86', charSpacing: 0.8,
  })
  s.addNotes([
    'Housekeeping first, 2 min: three hours, one break. Phones face down except for the trading screen later.',
    'Frame the session: today is vocabulary and panorama. You will not hedge anything today — that is Module 2.',
    'Promise: by 17:00 you can read a futures screen and say what a commodity trader is actually paid for.',
  ].join('\n'))
}

/* ─────────────────── Section 1: what the job is ─────────────────── */
divider('01', 'What the job actually is', 'Three aspects, a basket of risks, and one contract that falls out of the constraints.')

{
  const s = content('Every trade clears three tests at once', 'the job')
  cards(s, [
    { head: 'Commercial', text: 'Can I buy it and sell it at a margin?\n\nCounterparties, the price form, supply and demand, which risk to keep.' },
    { head: 'Logistics', text: 'Can I move it, on spec and on time?\n\nFreight, quality, documents, timing. The goods have to physically travel.' },
    { head: 'Financial', text: 'Can I fund it, and will I be paid?\n\nThe cargo is paid for months before the customer pays you.' },
  ])
  s.addText('Not a sequence. A simultaneous test — a good price on a cargo that cannot ship is not a good trade.', {
    x: M, y: 4.5, w: W, h: 0.4, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 13, italic: true, color: MUTED,
  })
  s.addNotes([
    'Ask the room first: what does a commodity trader do all day? Collect answers on the board — most will say "buy low sell high".',
    'Then: that is one third of it, and the easiest third.',
    'Each card = a department, and a way to lose the margin. Name the three failure stories: priced well but no vessel; shipped but never paid; paid but the quality was rejected.',
    'Callback later: the exchange has three functions too. Same shape.',
  ].join('\n'))
}

{
  const s = content('What we actually trade is risk', 'the job')
  body(s, [
    B('Price (flat) — what you own moves while you hold it'),
    B('Counterparty — they fail to perform, precisely when the price moved against them'),
    B('Logistic — delays, vessels, congestion, strikes, a closed canal'),
    B('Quality — what arrives does not match the contract'),
    B('Financing — you pay months before you are paid'),
    B('Currency — you buy in one currency and sell in another'),
    Bl('Political — export bans, tariffs, sanctions, new compliance regimes'),
  ], { y: 1.7, w: 5.6, lineSpacing: 26, paraSpaceAfter: 2 })
  s.addShape(pres.ShapeType.roundRect, {
    x: 6.5, y: 1.7, w: 2.9, h: 2.5, rectRadius: 0.06,
    fill: { color: SOFT }, line: { color: RULE, width: 0.75 },
  })
  s.addText('The goods pass through.\n\nThe basket stays with whoever holds the position — and the paper is how it is transferred.', {
    x: 6.7, y: 1.92, w: 2.5, h: 2.1, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 12.5, color: INK, lineSpacing: 18,
  })
  s.addNotes([
    'Correct the obvious answer: the product is not coffee. Coffee moves through the desk untouched.',
    'Walk the list slowly. For each, ask for an example from a market they know.',
    'Counterparty risk: flag it now, it comes back twice today — olive oil, and the clearing house.',
  ].join('\n'))
}

{
  const s = content('Anyone between the producer and the consumer is a trader', 'the job')
  const chain = ['Producer', 'Trade house', 'Factory', 'Supermarket', 'Consumer']
  const cw = 1.6, gap = 0.22
  chain.forEach((c, i) => {
    const x = M + i * (cw + gap)
    const mid = i > 0 && i < 4
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 1.85, w: cw, h: 0.75, rectRadius: 0.06,
      fill: { color: mid ? SOFT : PAPER }, line: { color: mid ? ACCENT : RULE, width: mid ? 1 : 0.75 },
    })
    s.addText(c, {
      x, y: 1.85, w: cw, h: 0.75, isTextBox: true, margin: 0, align: 'center', valign: 'middle',
      fontFace: SANS, fontSize: 12, bold: mid, color: INK,
    })
    if (i < 4) {
      s.addText('→', {
        x: x + cw, y: 1.85, w: gap, h: 0.75, isTextBox: true, margin: 0,
        align: 'center', valign: 'middle', fontFace: SANS, fontSize: 12, color: MUTED,
      })
    }
  })
  s.addText('in between', {
    x: M + cw + gap, y: 2.66, w: cw * 3 + gap * 2, h: 0.25, isTextBox: true, margin: 0,
    align: 'center', fontFace: MONO, fontSize: 9, color: ACCENT, charSpacing: 1,
  })
  body(s, [
    'A supermarket buys enormous volumes forward, warehouses them and resells at a posted price. That is a trader.',
    'A factory buys raw material, holds it, transforms it, sells the output. Also a trader.',
    'They carry almost the same basket of risks as the trade house. So what is the difference?',
  ], { y: 3.2, h: 1.7, lineSpacing: 21 })
  s.addNotes([
    'This is the slide that reframes the industry. Take your time.',
    'Ask: is Carrefour a commodity trader? Let them argue. Most say no.',
    'Then: they buy forward, they store, they carry price risk, they resell. Which part is not trading?',
    'End on the question — do NOT answer it. The next four slides are the answer.',
  ].join('\n'))
}

statement(
  'The difference is one line of the basket:\nhow the price risk is managed.',
  'Follow the logic backwards from the supermarket shelf. It ends somewhere very specific.',
)

{
  const s = content('Start at the shelf', 'the job')
  body(s, [
    'The final consumer buys spot. The goods must physically be on the shelf, with a known purchase cost, before any selling price can be printed.',
    'And a retailer cannot reprice its shelves every morning.',
    'So it negotiates huge volumes, over six months or a year, at a fixed price.',
  ], { y: 1.75, w: 5.9, lineSpacing: 23 })
  stat(s, 6.9, 1.9, 2.5, '6–12', 'months of volume, at one\nfixed price, agreed in advance')
  s.addNotes([
    'Concrete: the 250g pack on the shelf. Its price was effectively decided months ago.',
    'Ask: how often does the coffee price on the shelf change? Once or twice a year. Now compare with the futures screen, which changes every second.',
    'That gap between the two clocks is the whole problem this course solves.',
  ].join('\n'))
}

{
  const s = content('The factory inherits a fixed price', 'the job')
  body(s, [
    'The manufacturer has now SOLD a year of production at a flat price. Whatever it pays for raw material, the revenue side is frozen.',
    'Symmetry says: if you sold flat, buy flat. Cover the sale with a fixed-price purchase and the margin is locked.',
    'So the factory goes out and buys the whole year forward.',
  ], { y: 1.75, w: 5.9, h: 1.55, lineSpacing: 23 })
  cards(s, [
    { head: 'Sold', text: 'one year, flat price,\nto the retailer', fill: SOFT },
    { head: 'So buy', text: 'one year, flat price,\nfrom the supplier', fill: SOFT },
  ], { y: 3.45, h: 1.35, fontSize: 11.5 })
  s.addNotes([
    'Keep this one quick — it is the obvious move, and it is a trap.',
    'Let them agree with it. The next slide takes it away.',
  ].join('\n'))
}

{
  const s = content('And that is where it breaks', 'the job')
  body(s, [
    'Six months later the market has doubled.',
    'The supplier is committed to deliver a full year at half the market price. The incentive to default is now enormous — and many do.',
  ], { y: 1.75, w: 5.6, h: 1.3, lineSpacing: 24, fontSize: 15 })
  const s2 = s
  s2.addShape(pres.ShapeType.roundRect, {
    x: M, y: 3.15, w: W, h: 1.15, rectRadius: 0.06,
    fill: { color: SOFT }, line: { color: ACCENT, width: 1 },
  })
  s2.addText('Buying the whole year forward did not remove risk.\nIt converted price risk into counterparty risk.', {
    x: M + 0.3, y: 3.32, w: W - 0.6, h: 0.85, isTextBox: true, margin: 0,
    fontFace: SERIF, fontSize: 18, bold: true, color: INK, lineSpacing: 26,
  })
  s2.addNotes([
    'This is the hinge of the whole introduction. Slow down.',
    'Ask: whose problem is it when your supplier walks away? Yours. You still owe the retailer a year of product at a fixed price.',
    'Forward-reference: this is exactly what happened in olive oil in 2023. We come back to it in twenty minutes.',
  ].join('\n'))
}

{
  const s = content('So split the two decisions', 'the job')
  cards(s, [
    { head: 'Secure the volume — now', text: 'The cargo is booked, the origin committed, the logistics planned. You know you will have the coffee.' },
    { head: 'Fix the price — later', text: 'Ideally at the last minute, when the exposure is short and performing stays rational for both sides.' },
  ], { y: 1.85, h: 1.5 })
  body(s, [
    'A purchase contract does two things at once: it secures the GOODS and it sets the PRICE. Nothing says they must happen on the same day.',
  ], { y: 3.6, h: 1.1, lineSpacing: 22, fontSize: 14 })
  s.addNotes([
    'Ask the room how you would escape the trap before showing the cards. Someone usually gets it.',
    'The insight is that a contract bundles two decisions, and bundling is a choice.',
  ].join('\n'))
}

{
  const s = content('To fix the price later, dismantle it', 'the job')
  const y0 = 1.9
  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: y0, w: 4.2, h: 1.25, rectRadius: 0.06,
    fill: { color: SOFT }, line: { color: RULE, width: 0.75 },
  })
  s.addText('A floating reference', {
    x: M + 0.25, y: y0 + 0.18, w: 3.7, h: 0.35, isTextBox: true, margin: 0,
    fontFace: SERIF, fontSize: 16, bold: true, color: ACCENT,
  })
  s.addText('Observable by anyone, moves every day.\nThe futures price. Fixed LATER.', {
    x: M + 0.25, y: y0 + 0.55, w: 3.7, h: 0.6, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 12, color: INK, lineSpacing: 17,
  })
  s.addText('+', {
    x: M + 4.2, y: y0, w: 0.4, h: 1.25, isTextBox: true, margin: 0,
    align: 'center', valign: 'middle', fontFace: SERIF, fontSize: 24, color: MUTED,
  })
  s.addShape(pres.ShapeType.roundRect, {
    x: M + 4.6, y: y0, w: 4.2, h: 1.25, rectRadius: 0.06,
    fill: { color: SOFT }, line: { color: RULE, width: 0.75 },
  })
  s.addText('A fixed differential', {
    x: M + 4.85, y: y0 + 0.18, w: 3.7, h: 0.35, isTextBox: true, margin: 0,
    fontFace: SERIF, fontSize: 16, bold: true, color: ACCENT,
  })
  s.addText('Origin, quality, port, timing.\nThis specific coffee. Agreed TODAY.', {
    x: M + 4.85, y: y0 + 0.55, w: 3.7, h: 0.6, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 12, color: INK, lineSpacing: 17,
  })
  s.addText('You have just invented the PTBF contract — Price To Be Fixed.', {
    x: M, y: 3.55, w: W, h: 0.5, isTextBox: true, margin: 0,
    fontFace: SERIF, fontSize: 20, bold: true, color: INK,
  })
  s.addText('Nobody designed it in a committee. It falls out of the constraints.', {
    x: M, y: 4.05, w: W, h: 0.4, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 13, italic: true, color: MUTED,
  })
  s.addNotes([
    'Write the formula on the board as you say it: invoice price = futures fixing + differential.',
    'Emphasise: this is the single most important contract in physical commodity trading, and we derived it from a supermarket shelf.',
    'Module 2 is essentially three hours on this one line.',
  ].join('\n'))
}

{
  const s = content('The other end wants the opposite', 'the job')
  table(s, [
    [H(''), H('Producer'), H('Factory')],
    ['Cost / revenue', 'Fixed cost of production', 'Revenue fixed by a 1-year sale'],
    ['Wants to', 'Sell flat, now, when the crop is in', 'Fix late, at the last minute'],
    ['Fears', 'A collapse before selling', 'A rally after buying — and default'],
  ], { y: 1.8, colW: [1.7, 3.55, 3.55], rowH: 0.42 })
  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: 3.6, w: W, h: 1.0, rectRadius: 0.06,
    fill: { color: INK }, line: { color: INK, width: 0 },
  })
  s.addText('The trader stands between them and converts a flat-price risk into a differential risk — then keeps it.', {
    x: M + 0.3, y: 3.78, w: W - 0.6, h: 0.7, isTextBox: true, margin: 0,
    fontFace: SERIF, fontSize: 17, color: PAPER, lineSpacing: 24,
  })
  s.addNotes([
    'The business model in one sentence. Make them write it down.',
    'Consequence 1: if the trader keeps the differential and not the flat price, they need somewhere to lay the flat price off. That is the exchange — next section.',
    'Consequence 2: they must understand what moves the reference AND what moves the differential. That is the rest of the course.',
  ].join('\n'))
}

/* ─────────────────── Section 2: why the market exists ─────────────────── */
divider('02', 'Why the market exists', 'Start from the opposite end: imagine there is no market at all.')

{
  const s = content('A world with no exchange', 'why the market exists')
  cards(s, [
    { head: 'No reference price', text: 'Every deal is private. Nobody knows what the right price is — not the farmer selling, not the roaster committing to next year.\n\nThe better-informed side wins. Information IS the margin.' },
    { head: 'No protection in advance', text: 'Whatever you must buy or sell next season, you pay whatever the price happens to be then.\n\nPrice risk sits with whoever holds the goods, and cannot be moved.' },
  ], { y: 1.8, h: 2.4 })
  s.addText('Millions of growers, thousands of roasters, each negotiating bilaterally, in the dark.', {
    x: M, y: 4.45, w: W, h: 0.4, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 13, italic: true, color: MUTED,
  })
  s.addNotes([
    'Thought experiment, out loud: delete ICE from the world tonight. What breaks tomorrow morning?',
    'Draw on the board: 5 sellers x 5 buyers = 25 bilateral negotiations. Then 50 x 50. Quadratic.',
    'One central marketplace turns that into linear — and makes the price public.',
    'These two problems are the whole reason the rest of the course exists. Everything today answers one of them.',
  ].join('\n'))
}

{
  const s = content('Olive oil: a market with no futures', 'why the market exists')
  s.addChart(pres.ChartType.line, [{
    name: 'Extra virgin, ex-mill Spain (EUR/t)',
    labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    values: [2100, 1900, 3200, 4000, 7500, 8900, 3900],
  }], {
    x: M, y: 1.6, w: 5.5, h: 3.0,
    chartColors: [ACCENT], lineSize: 3, lineSmooth: false,
    showTitle: false, showLegend: false,
    valAxisLabelColor: MUTED, catAxisLabelColor: MUTED,
    valAxisLabelFontSize: 10, catAxisLabelFontSize: 10,
    valAxisLabelFontFace: MONO, catAxisLabelFontFace: MONO,
    valGridLine: { color: RULE, size: 0.75 }, catGridLine: { style: 'none' },
    valAxisMajorUnit: 2000, valAxisMinVal: 0,
    showValue: false,
  })
  body(s, [
    'Spanish drought took extra virgin from about EUR 2,000 to nearly EUR 9,000 a tonne, and back.',
    'Every importer and bottler simply ate the move.',
    'No hedge to lay it off. No transparent reference to negotiate against. No buyer of last resort for stuck stock.',
  ], { x: 6.4, y: 1.7, w: 3.0, lineSpacing: 19, fontSize: 12.5 })
  s.addNotes([
    'Real market, recent, and they have all seen the price in the supermarket. Use that.',
    'Ask: what should a good olive-oil buyer have done in 2022? Let them propose. Next slide kills both answers.',
  ].join('\n'))
}

{
  const s = content('Both physical defences fail', 'why the market exists')
  cards(s, [
    { head: 'You cannot stock your way out', text: 'A bottler\'s tanks hold perhaps one month of supply. Storage is expensive, oil degrades, capital is tied up.\n\nSeeing the drought coming does not help if you physically cannot hold more than four weeks of it.' },
    { head: 'You can buy forward — into default', text: 'Contract future shipments at today\'s price. When the market doubles, your supplier chooses: honour a contract that ruins him, or walk away.\n\nMany walked.' },
  ], { y: 1.8, h: 2.4 })
  s.addText('An unsecured bilateral promise is only as good as the counterparty\'s solvency — and it fails exactly when you need it most.', {
    x: M, y: 4.45, w: W, h: 0.4, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 13, italic: true, color: MUTED,
  })
  s.addNotes([
    'Callback: this is the trap from the introduction, now in a real market.',
    'Plant the flag: remember this failure. In fifteen minutes we meet the institution invented specifically to kill it — the clearing house.',
  ].join('\n'))
}

{
  const s = content('Three markets that never got a contract', 'why the market exists')
  const lab = { labelH: 1.05 }
  stat(s, M, 1.7, 2.7, '×3', 'Rice, 2008. Export restrictions, thin visibility on stocks, panic did the pricing. Tripled in months, then collapsed.', lab)
  stat(s, M + 3.05, 1.7, 2.7, '$10k → $2k', 'Vietnamese pepper, 2015–19. Farmers planted at the peak with no forward curve to warn them. Orchards ripped out.', { ...lab, figSize: 26 })
  stat(s, M + 6.1, 1.7, 2.7, '1958', 'US onions. Futures were BANNED by law, still in force. Prices became MORE volatile, not less.', lab)
  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: 3.95, w: W, h: 0.85, rectRadius: 0.06,
    fill: { color: SOFT }, line: { color: RULE, width: 0.75 },
  })
  s.addText('The volatility in these markets is not worse than coffee\'s. The difference is that coffee traders can do something about it.', {
    x: M + 0.3, y: 4.1, w: W - 0.6, h: 0.6, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 13.5, color: INK, lineSpacing: 19,
  })
  s.addNotes([
    'The onion case is the one to dwell on — a natural experiment run by the US Congress.',
    'The farmers lobbied for the ban because they blamed speculators for volatility. They got more volatility.',
    'Ask: why would removing the futures market make prices LESS stable? Let them reason to it.',
  ].join('\n'))
}

{
  const s = content('Chicago, 1848: the answer was improvised', 'why the market exists')
  const steps = [
    ['1840s', 'Harvest floods a city with too little storage. Prices collapse in autumn, soar by spring. Grain dumped in Lake Michigan.'],
    ['1848', 'Eighty-two merchants found the Chicago Board of Trade. Deals struck in public. The reference price is born.'],
    ['1850s', '"To-arrive" contracts: a price agreed today for grain delivered later. Protection in advance.'],
    ['1865', 'Standardised: fixed grades, lot sizes, delivery months — and both sides post margin. The futures contract.'],
    ['1925', 'A full clearing house guarantees every trade. The exchange steps between buyer and seller.'],
  ]
  steps.forEach((st, i) => {
    const y = 1.62 + i * 0.66
    s.addText(st[0], {
      x: M, y, w: 0.85, h: 0.4, isTextBox: true, margin: 0,
      fontFace: MONO, fontSize: 13, bold: true, color: ACCENT,
    })
    s.addText(st[1], {
      x: M + 1.0, y, w: W - 1.0, h: 0.56, isTextBox: true, margin: 0,
      fontFace: SANS, fontSize: 12.5, color: INK, lineSpacing: 17,
    })
    if (i < steps.length - 1) {
      s.addShape(pres.ShapeType.line, {
        x: M + 0.42, y: y + 0.44, w: 0, h: 0.22, line: { color: RULE, width: 1 },
      })
    }
  })
  s.addNotes([
    'Not designed by economists — improvised by merchants who lived the no-market world every autumn.',
    'Point at each date and map it back to the two problems: 1848 solves the reference price, 1850s solves protection in advance, 1925 solves counterparty risk.',
    'The olive-oil failure structurally cannot happen on a cleared exchange. That is the whole point of 1925.',
  ].join('\n'))
}

{
  const s = content('Every exchange is the same invention', 'why the market exists')
  cards(s, [
    { head: 'Price discovery', text: 'One public, transparent price the whole chain can read and negotiate against.' },
    { head: 'Risk management', text: 'A way to fix a price in advance — to transfer price risk to someone willing to hold it.' },
    { head: 'Last resort', text: 'Physically deliverable, so the exchange is the buyer and seller of last resort for standard-spec goods.' },
  ], { y: 1.66, h: 1.8 })
  stat(s, M, 3.6, 2.6, '~2,000×', 'ICE trades some 400 million tonnes of coffee a year. World crop: about 10.', { labelH: 0.72 })
  body(s, [
    'The three feed each other through liquidity: deep participation makes the price meaningful, a meaningful price makes hedging work, and guaranteed delivery anchors it to physical reality.',
  ], { x: M + 2.9, y: 3.6, w: 5.9, h: 1.35, lineSpacing: 20, fontSize: 13 })
  s.addNotes([
    'Callback to slide 3: three aspects of a trade, three functions of an exchange. The market is built to serve the job.',
    'The 2,000x number always gets a reaction. Ask what it means: most trading is risk transfer and liquidity, not people wanting coffee.',
    'Pre-empt the "speculators are parasites" objection here — without that volume the farmer has nobody to sell his hedge to.',
  ].join('\n'))
}

module.exports = { K, B, Bl }
