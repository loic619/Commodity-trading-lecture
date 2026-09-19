const { K, B, Bl } = require('./slides.js')
const {
  pres, content, divider, statement, body, cards, stat, table, H, N,
  INK, PAPER, ACCENT, MUTED, RULE, SOFT, SERIF, SANS, MONO, M, W,
} = K

/* ─────────────── Section 3: the universe and the instrument ─────────────── */
divider('03', 'The universe and the instrument', 'Coffee is one market among many — and they all run on the same machinery.')

{
  const s = content('Hard and soft', 'the universe')
  cards(s, [
    { head: 'Hard — extracted', text: 'Energy: crude (Brent, WTI), natural gas, coal\n\nMetals: copper, aluminium, gold, iron ore' },
    { head: 'Soft — grown or raised', text: 'Grains: wheat, corn, soybeans\n\nTropicals: coffee (Arabica, Robusta), cocoa, sugar, cotton' },
  ], { y: 1.68, h: 1.85 })
  body(s, [
    'Different supply and demand dynamics, different seasonality, different storage constraints — but the same market machinery you just saw.',
  ], { y: 3.62, h: 0.5, lineSpacing: 20, fontSize: 13 })
  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: 4.15, w: W, h: 0.75, rectRadius: 0.06,
    fill: { color: SOFT }, line: { color: RULE, width: 0.75 },
  })
  s.addText('One name to retain all year: the ABCD — Archer Daniels Midland, Bunge, Cargill, Louis Dreyfus. Plus the coffee specialists: Neumann, Volcafe, Sucafina, Olam.', {
    x: M + 0.3, y: 4.3, w: W - 0.6, h: 0.5, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 12.5, color: INK, lineSpacing: 17,
  })
  s.addNotes([
    'Quick slide. The point is scope: what you learn on coffee transfers to metals and energy.',
    'ABCD: ask if anyone has heard of Cargill. Usually nobody. Largest private company in America — that lands well.',
  ].join('\n'))
}

{
  const s = content('Standardised in everything but price', 'the universe')
  table(s, [
    [H('Contract'), H('Exchange'), H('Lot'), H('Quoted in')],
    ['Arabica coffee', 'ICE US', N('37,500 lbs'), 'US cents / lb'],
    ['Robusta coffee', 'ICE Europe', N('10 tonnes'), 'USD / tonne'],
    ['Brent crude', 'ICE', N('1,000 barrels'), 'USD / barrel'],
  ], { y: 1.8, colW: [2.6, 2.0, 2.1, 2.1], rowH: 0.4 })
  body(s, [
    'Lot size, quality, delivery location, delivery months — all set by the exchange. The only blank line on the page is the price.',
    'That is exactly what lets thousands of strangers trade the same instrument without negotiating anything but a number.',
  ], { y: 3.5, h: 1.5, lineSpacing: 21 })
  s.addNotes([
    'Hold up the idea of a pre-printed page with one blank. That image does the work.',
    'Note the units are all different and all traditional — 37,500 lbs is not a round number by accident, it is a railcar.',
    'Most contracts are never delivered: they are offset before expiry. Delivery matters because it is POSSIBLE, not because it happens.',
  ].join('\n'))
}

{
  const s = content('From bags to warrant', 'the universe')
  const steps = ['Coffee arrives at a licensed warehouse', 'Sampled and graded against the quality ladder', 'Electronic warrant issued', 'Warrant delivered to settle a short futures position']
  steps.forEach((st, i) => {
    const y = 1.85 + i * 0.68
    s.addShape(pres.ShapeType.roundRect, {
      x: M, y, w: 0.42, h: 0.42, rectRadius: 0.2,
      fill: { color: ACCENT }, line: { color: ACCENT, width: 0 },
    })
    s.addText(String(i + 1), {
      x: M, y, w: 0.42, h: 0.42, isTextBox: true, margin: 0,
      align: 'center', valign: 'middle', fontFace: MONO, fontSize: 12, bold: true, color: PAPER,
    })
    s.addText(st, {
      x: M + 0.62, y, w: W - 0.62, h: 0.42, isTextBox: true, margin: 0, valign: 'middle',
      fontFace: SANS, fontSize: 13.5, color: INK,
    })
  })
  s.addText('The exam in the middle is what makes 10 tonnes in Antwerp interchangeable with 10 tonnes in Hamburg.', {
    x: M, y: 4.6, w: W, h: 0.4, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 13, italic: true, color: MUTED,
  })
  s.addNotes([
    'The quality ladder: Class 1 delivers at contract price, better earns a premium, worse a discount — and the exchange sets those, they are not negotiated.',
    'That is what keeps delivery predictable, and it is the bridge between an idealised contract and messy real coffee.',
  ].join('\n'))
}

/* ─────────────────── Section 4: the instruments ─────────────────── */
divider('04', 'The instruments', 'Futures, the order book, open interest, margin — and the OTC cousin.')

{
  const s = content('What a futures contract actually is', 'the instruments')
  body(s, [
    B('Standardised — lot, quality and delivery defined by the exchange'),
    B('Marked to market daily — gains and losses settle in cash every day'),
    Bl('Cleared — the clearing house steps between buyer and seller'),
  ], { y: 1.75, w: 5.7, h: 1.95, lineSpacing: 26, paraSpaceAfter: 4, fontSize: 14.5 })
  s.addShape(pres.ShapeType.roundRect, {
    x: 6.6, y: 1.72, w: 2.8, h: 2.0, rectRadius: 0.06,
    fill: { color: SOFT }, line: { color: RULE, width: 0.75 },
  })
  s.addText('Counterparty risk is mutualised and collateralised — mitigated, not abolished.\n\nNasdaq Clearing, 2018: one trader\'s default consumed a large share of the fund.', {
    x: 6.8, y: 1.92, w: 2.4, h: 1.6, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 11.5, color: INK, lineSpacing: 16,
  })
  s.addText('Most futures are never delivered. They are offset before expiry by an opposing trade.', {
    x: M, y: 4.0, w: W, h: 0.4, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 13.5, color: INK,
  })
  s.addNotes([
    'Push back on the word "guarantee" — students hear it as risk-free. Use the 2018 Nasdaq case to show it is not.',
    'That matters professionally: your clearing member can still fail, and you post margin to a default waterfall.',
  ].join('\n'))
}

{
  const s = content('Where the price comes from', 'the instruments')
  const rows = [
    ['Offer', '4,815', '12'], ['Offer', '4,810', '8'], ['Offer', '4,805', '10'],
    ['Bid', '4,800', '15'], ['Bid', '4,795', '20'], ['Bid', '4,790', '18'],
  ]
  rows.forEach((r, i) => {
    const y = 1.72 + i * 0.36
    const isOffer = r[0] === 'Offer'
    s.addShape(pres.ShapeType.rect, {
      x: M, y, w: 4.0, h: 0.32,
      fill: { color: i === 2 || i === 3 ? SOFT : PAPER }, line: { color: RULE, width: 0.5 },
    })
    s.addText(r[0], { x: M + 0.12, y, w: 0.9, h: 0.32, isTextBox: true, margin: 0, valign: 'middle', fontFace: SANS, fontSize: 11, color: isOffer ? ACCENT : INK })
    s.addText(r[1], { x: M + 1.1, y, w: 1.4, h: 0.32, isTextBox: true, margin: 0, valign: 'middle', align: 'right', fontFace: MONO, fontSize: 12, bold: i === 2 || i === 3, color: INK })
    s.addText(r[2] + ' lots', { x: M + 2.6, y, w: 1.3, h: 0.32, isTextBox: true, margin: 0, valign: 'middle', align: 'right', fontFace: MONO, fontSize: 11, color: MUTED })
  })
  body(s, [
    B('A small market buy fills instantly at the offer — you paid the spread, the price of immediacy'),
    B('A large market buy eats through several levels: the fill walks the book and your average slips. Size moves markets'),
    Bl('A limit buy below the market rests in the book — you are now making the liquidity that others take'),
  ], { x: 5.1, y: 1.75, w: 4.3, h: 2.4, lineSpacing: 19, fontSize: 12, paraSpaceAfter: 10 })
  s.addText('"One transparent price" is nothing more mystical than the top of this book.', {
    x: M, y: 4.4, w: W, h: 0.4, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 13, italic: true, color: MUTED,
  })
  s.addNotes([
    'They will trade this book in the web app later. Here just establish that a "price" is really two prices and a queue.',
    'Ask: if you must buy 40 lots right now, what price do you get? Not the screen price. That gap is a real cost, and it is why size is a disadvantage.',
  ].join('\n'))
}

{
  const s = content('Two counters beginners confuse', 'the instruments')
  cards(s, [
    { head: 'Volume', text: 'Every lot that TRADED today.\n\nMeasures activity. Resets to zero each morning.' },
    { head: 'Open interest', text: 'Every lot still OUTSTANDING — open promises held at the clearing house.\n\nMeasures positions. Carried overnight.' },
  ], { y: 1.68, h: 1.8 })
  table(s, [
    [H('What you see'), H('What it means')],
    ['Volume high, OI rising', 'New money entering — fresh longs meeting fresh shorts. Conviction.'],
    ['Volume high, OI flat', 'Positions churning hands. Day traders passing the same risk around.'],
    ['Volume high, OI falling', 'Holders leaving. A rally on falling OI is shorts covering, not buyers arriving.'],
  ], { y: 3.6, colW: [2.9, 5.9], rowH: 0.34, fontSize: 12 })
  s.addNotes([
    'The two-trade mechanic on the board: A buys from B — volume +1, OI +1, new risk created. A then sells to C — volume +1, OI unchanged, the promise just changed owner.',
    'Third case worth stating: A buys back from B, both close — volume +1, OI −1. Risk destroyed.',
    'The last row is the professional read. "Rally on falling open interest" is a short-covering rally, and it usually does not last.',
  ].join('\n'))
}

{
  const s = content('Margin: the cash reality of a hedge', 'the instruments')
  body(s, [
    'You are an exporter, short 10 lots of Robusta at $4,500/t, hedging unsold physical. Every $1/t move is $100 on the position.',
    'The market rallies for four days. Twenty thousand dollars wires OUT of your account — while the coffee that backs the hedge sits in the warehouse, unsold and unfinanceable.',
  ], { y: 1.72, w: 5.6, h: 1.6, lineSpacing: 21 })
  s.addShape(pres.ShapeType.roundRect, {
    x: 6.4, y: 1.72, w: 3.0, h: 1.6, rectRadius: 0.06,
    fill: { color: SOFT }, line: { color: ACCENT, width: 1 },
  })
  s.addText('The hedge is economically perfect and cash-flow brutal.', {
    x: 6.6, y: 1.95, w: 2.6, h: 1.2, isTextBox: true, margin: 0,
    fontFace: SERIF, fontSize: 15, bold: true, color: INK, lineSpacing: 21,
  })
  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: 3.55, w: W, h: 1.05, rectRadius: 0.06,
    fill: { color: INK }, line: { color: INK, width: 0 },
  })
  s.addText('A margin call is not a liquidation. The first UNFUNDED one is.', {
    x: M + 0.3, y: 3.7, w: W - 0.6, h: 0.4, isTextBox: true, margin: 0,
    fontFace: SERIF, fontSize: 17, color: PAPER,
  })
  s.addText('Ashanti\'s gold hedges, 1999. European utilities, 2022. A hedging programme without a liquidity line is a speculation on your own funding.', {
    x: M + 0.3, y: 4.1, w: W - 0.6, h: 0.4, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 12, color: '9A8F86',
  })
  s.addNotes([
    'This is the slide that separates people who have read about hedging from people who have done it.',
    'Symmetric point: if the market falls, the hedge PAYS you daily while the stock loses on paper. Just as misleading if the cash gets spent.',
    'Ashanti 1999 is worth two minutes if there is time — a gold miner hedged correctly and nearly died of margin calls.',
  ].join('\n'))
}

{
  const s = content('Swaps: the OTC cousin', 'the instruments')
  body(s, [
    'A bilateral agreement to exchange cash flows against a published index. The producer receives fixed, pays floating — so their price is fixed wherever the market goes.',
  ], { y: 1.7, lineSpacing: 21, h: 0.7 })
  s.addChart(pres.ChartType.bar, [{
    name: 'Producer cash flow (USD)',
    labels: ['January', 'February', 'March'],
    values: [75000, -60000, 0],
  }], {
    x: M, y: 2.45, w: 5.2, h: 2.1,
    barDir: 'col', chartColors: [ACCENT], invertedColors: ['6B655F'],
    showTitle: false, showLegend: false,
    showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '#,##0;-#,##0',
    dataLabelFontFace: MONO, dataLabelFontSize: 10, dataLabelColor: INK,
    valAxisLabelColor: MUTED, catAxisLabelColor: MUTED,
    valAxisLabelFontSize: 9, catAxisLabelFontSize: 10,
    valAxisLabelFontFace: MONO, catAxisLabelFontFace: SANS,
    valGridLine: { color: RULE, size: 0.75 }, catGridLine: { style: 'none' },
    barGapWidthPct: 120,
  })
  table(s, [
    [H('Month'), H('Index avg'), H('Fixed − floating')],
    ['January', N('4,150'), N('+150 /t')],
    ['February', N('4,420'), N('−120 /t')],
    ['March', N('4,300'), N('0')],
  ], { x: 6.1, y: 2.5, w: 3.3, colW: [1.2, 1.0, 1.1], rowH: 0.36, fontSize: 11 })
  s.addText('500 t/month fixed at $4,300/t. Effective price: $4,300, whichever way the index goes.', {
    x: 6.1, y: 4.1, w: 3.3, h: 0.5, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 11.5, color: MUTED, lineSpacing: 16,
  })
  s.addNotes([
    'Key difference from futures: custom size, custom tenor, custom settlement — and counterparty credit risk, because there is no clearing house.',
    'At the trade date NO cash changes hands. A swap is not an option; there is no premium. Students confuse these constantly.',
    'How it actually gets done: by voice and instant message through an OTC broker — TOTSA in Geneva, PVM in London — papered under an ISDA, settled against a published average. Not a screen.',
  ].join('\n'))
}

/* ─────────────────── Section 5: market structure ─────────────────── */
divider('05', 'Market structure', 'The shape of the forward curve, and what it is telling you.')

{
  const s = content('Contango and backwardation', 'market structure')
  s.addChart(pres.ChartType.line, [
    { name: 'Contango', labels: ['Spot', '+1m', '+2m', '+3m', '+4m', '+5m', '+6m'], values: [60, 61.2, 62.4, 63.5, 64.7, 65.9, 67] },
    { name: 'Backwardation', labels: ['Spot', '+1m', '+2m', '+3m', '+4m', '+5m', '+6m'], values: [60, 58.6, 57.4, 56.4, 55.6, 55.0, 54.6] },
  ], {
    x: M, y: 1.65, w: 5.4, h: 2.9,
    chartColors: [ACCENT, '46505A'], lineSize: 3, lineSmooth: false,
    showTitle: false, showLegend: true, legendPos: 'b', legendFontSize: 10, legendFontFace: SANS, legendColor: MUTED,
    valAxisLabelColor: MUTED, catAxisLabelColor: MUTED,
    valAxisLabelFontSize: 10, catAxisLabelFontSize: 10,
    valAxisLabelFontFace: MONO, catAxisLabelFontFace: MONO,
    valGridLine: { color: RULE, size: 0.75 }, catGridLine: { style: 'none' },
  })
  body(s, [
    { text: 'Contango — forward above spot', options: { bold: true, breakLine: true, color: ACCENT } },
    { text: 'The normal state for a storable commodity. Reflects the cost of carry: storage, insurance, financing. Signals adequate nearby supply.\n', options: { breakLine: true } },
    { text: 'Backwardation — forward below spot', options: { bold: true, breakLine: true, color: '46505A' } },
    { text: 'Spot commands a premium. Signals tight nearby supply or urgent demand — disruptions, drawdowns, harvest seasons.', options: {} },
  ], { x: 6.3, y: 1.75, w: 3.1, lineSpacing: 17, fontSize: 11.5, paraSpaceAfter: 2 })
  s.addNotes([
    'Draw both shapes on the board freehand before showing the chart. They should be able to sketch these by the end of the module.',
    'Emphasise storable vs non-storable: power and livestock have no carry linking one month to the next, so no contango logic at all.',
  ].join('\n'))
}

{
  const s = content('Contango pays for storage', 'market structure')
  const steps = ['Buy spot', 'Store it', 'Sell forward at the higher price', 'Earn the spread, minus costs']
  steps.forEach((st, i) => {
    const x = M + i * ((W - 0.9) / 4 + 0.3)
    const cw = (W - 0.9) / 4
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 1.8, w: cw, h: 0.8, rectRadius: 0.06,
      fill: { color: SOFT }, line: { color: RULE, width: 0.75 },
    })
    s.addText(st, {
      x: x + 0.12, y: 1.8, w: cw - 0.24, h: 0.8, isTextBox: true, margin: 0,
      align: 'center', valign: 'middle', fontFace: SANS, fontSize: 12, color: INK,
    })
    if (i < 3) {
      s.addText('→', { x: x + cw, y: 1.8, w: 0.3, h: 0.8, isTextBox: true, margin: 0, align: 'center', valign: 'middle', fontFace: SANS, fontSize: 13, color: MUTED })
    }
  })
  s.addText('Cost of carry  =  storage  +  insurance  +  financing', {
    x: M, y: 2.85, w: W, h: 0.4, isTextBox: true, margin: 0,
    fontFace: MONO, fontSize: 14, color: ACCENT,
  })
  body(s, [
    'If the forward premium exceeds the cost of carry, this cash-and-carry arbitrage is profitable — and traders do it until the premium collapses back to fair value.',
    'Contango is why oil in tanks, grain in silos and coffee in warehouses are all financed by the forward curve.',
  ], { y: 3.4, h: 1.6, lineSpacing: 21 })
  s.addNotes([
    'The arbitrage is what makes the curve an equation rather than an opinion. That sets up the next slide.',
    'Practical: a trader with a warehouse owns an option on the calendar spread. We price that in Module 3.',
  ].join('\n'))
}

statement(
  'The forward curve is not a forecast.',
  'Spot $60, six-month $67. The $7 is not an opinion about the future — it is the bill for storing, insuring and financing a barrel for six months.',
)

{
  const s = content('Why it cannot be a forecast', 'market structure')
  body(s, [
    'Suppose the six-month contract jumped to $75 on pure bullish sentiment.',
    'Anyone could buy spot at 60, pay about 7 of carry, and sell forward at 75 — a risk-free 8.',
    'That selling crushes the forward straight back to about 67. The curve is leashed to spot by the cost of carry.',
  ], { y: 1.75, w: 5.7, lineSpacing: 23 })
  s.addShape(pres.ShapeType.roundRect, {
    x: 6.5, y: 1.75, w: 2.9, h: 1.9, rectRadius: 0.06,
    fill: { color: SOFT }, line: { color: RULE, width: 0.75 },
  })
  s.addText('Contango describes TODAY:\n\nample supply, demand for storage, and the cost of money.\n\nNot where spot will be at maturity.', {
    x: 6.7, y: 1.95, w: 2.5, h: 1.6, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 12, color: INK, lineSpacing: 18,
  })
  s.addNotes([
    'This is the most common mistake in the room and in the press. Make them say the wrong version out loud first.',
    'Ask: if the curve predicted the future, what would that imply about anyone holding the spot commodity?',
  ].join('\n'))
}

{
  const s = content('Squeezes, and the exchange\'s toolkit', 'market structure')
  body(s, [
    'Backwardation signals scarcity now: a bad harvest, a port strike, an inventory drawdown, a seasonal demand peak.',
    'Its extreme form is the squeeze — a dominant player controls nearby physical supply and forces short hedgers to pay whatever it takes to close.',
  ], { y: 1.7, lineSpacing: 21, h: 0.9 })
  table(s, [
    [H('Intervention'), H('What it does')],
    ['Position limits', 'Caps how much of the delivery month any one entity may hold'],
    ['Lending rules', 'Forces a dominant long to lend at a capped premium (LME Tom-Next)'],
    ['Backwardation caps', 'A hard ceiling on the spot-to-3M spread — introduced after nickel, 2022'],
    ['Delivery deferral', 'Lets a trapped short postpone delivery for a fee instead of defaulting'],
    ['Cash settlement', 'No physical delivery at all, so no physical squeeze is possible'],
  ], { y: 2.7, colW: [2.6, 6.2], rowH: 0.34, fontSize: 11.5 })
  s.addNotes([
    'The Robusta market has had recurring squeezes — this is not theoretical for a coffee trader.',
    'LME nickel 2022 is the case to mention: the exchange cancelled trades. Ask what that does to trust in a market. Good debate if time allows.',
    'Link forward: an unplanned long in the delivery month is a decision, not a detail.',
  ].join('\n'))
}

{
  const s = content('The roll: open interest changes address', 'market structure')
  body(s, [
    'The front month carries roughly half the board\'s open interest. As its expiry approaches, holders who want no part of physical delivery close it and reopen the next month.',
    'Volume spikes while it happens — every migrating lot trades twice — but total open interest barely moves. It does not die. It changes address.',
    'A small remainder rides into expiry on purpose: the players with a delivery plan.',
  ], { y: 1.75, w: 5.7, lineSpacing: 22 })
  s.addShape(pres.ShapeType.roundRect, {
    x: 6.5, y: 1.75, w: 2.9, h: 2.1, rectRadius: 0.06,
    fill: { color: SOFT }, line: { color: ACCENT, width: 1 },
  })
  s.addText('Reading a screen:\n\na nearby contract with almost no open interest left is a contract whose remaining holders all intend to deliver.\n\nDo you?', {
    x: 6.7, y: 1.95, w: 2.5, h: 1.8, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 12, color: INK, lineSpacing: 18,
  })
  s.addNotes([
    'Run the animated version in the web app here — one real year of Robusta, six contracts, the crowd handing over.',
    'This is where open interest from the instruments section pays off. Watch the bands trade places.',
    'The roll also has an economics: in backwardation you buy each deferred cheap and ride it up to spot. That is roll yield — Module 2 prices it.',
  ].join('\n'))
}

/* ─────────────────── Section 6: supply and demand ─────────────────── */
divider('06', 'Supply and demand', 'A balance sheet of tons — and which line does the adjusting.')

{
  const s = content('Two multiplications', 'supply and demand')
  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: 1.75, w: 4.25, h: 2.7, rectRadius: 0.06,
    fill: { color: SOFT }, line: { color: RULE, width: 0.75 },
  })
  s.addText('Supply', { x: M + 0.25, y: 1.95, w: 3.75, h: 0.35, isTextBox: true, margin: 0, fontFace: SERIF, fontSize: 16, bold: true, color: ACCENT })
  s.addText('hectares  ×  trees per hectare  ×  yield per tree', { x: M + 0.25, y: 2.32, w: 3.75, h: 0.5, isTextBox: true, margin: 0, fontFace: MONO, fontSize: 11, color: INK, lineSpacing: 16 })
  s.addText('Land cost and the opportunity cost of competing crops. Planting density, tree age. Weather, fertiliser, irrigation, variety, disease — then the cherry and conversion ratios.\n\nPlus the carry-in: what was kept from last year, at the farm, at origin, at destination.', {
    x: M + 0.25, y: 2.82, w: 3.75, h: 1.5, isTextBox: true, margin: 0, fontFace: SANS, fontSize: 11, color: INK, lineSpacing: 15,
  })
  s.addShape(pres.ShapeType.roundRect, {
    x: M + 4.55, y: 1.75, w: 4.25, h: 2.7, rectRadius: 0.06,
    fill: { color: SOFT }, line: { color: RULE, width: 0.75 },
  })
  s.addText('Demand', { x: M + 4.8, y: 1.95, w: 3.75, h: 0.35, isTextBox: true, margin: 0, fontFace: SERIF, fontSize: 16, bold: true, color: ACCENT })
  s.addText('population  ×  cups per capita  ×  grams per cup  ×  blend', { x: M + 4.8, y: 2.32, w: 3.75, h: 0.5, isTextBox: true, margin: 0, fontFace: MONO, fontSize: 11, color: INK, lineSpacing: 16 })
  s.addText('Bent by purchasing power (inflation against wages), by coffee culture (capsules, specialty, out-of-home), and by substitution at the margin.\n\nSplit destination consumption from origin consumption — Brazil drinks a top-two share of the world\'s coffee itself.', {
    x: M + 4.8, y: 2.82, w: 3.75, h: 1.5, isTextBox: true, margin: 0, fontFace: SANS, fontSize: 11, color: INK, lineSpacing: 15,
  })
  s.addText('Demand moves slowly and almost never backwards. Supply does most of the price-setting.', {
    x: M, y: 4.6, w: W, h: 0.4, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 13, italic: true, color: MUTED,
  })
  s.addNotes([
    'The discipline to teach: every supply headline on the screen is a sentence about ONE of these factors. Knowing the tree tells you how many tons the headline is really worth.',
    'Test it live: "drought in Minas Gerais" — which factor? Yield per tree. "Farmers replanting with avocado" — hectares, and with a lag of years.',
    'That lag matters: hectares move over years, yield moves within a season. Different trades.',
  ].join('\n'))
}

{
  const s = content('The balance sheet', 'supply and demand')
  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: 1.7, w: W, h: 0.7, rectRadius: 0.06,
    fill: { color: INK }, line: { color: INK, width: 0 },
  })
  s.addText('Beginning stocks  +  Production   =   Consumption  +  Ending stocks', {
    x: M, y: 1.7, w: W, h: 0.7, isTextBox: true, margin: 0,
    align: 'center', valign: 'middle', fontFace: MONO, fontSize: 15, color: PAPER,
  })
  body(s, [
    'Sources on the left, uses on the right, and the two sides are forced to equal. The sheet always balances.',
    'So the analysis is never "does it balance". It is: WHICH LINE does the adjusting?',
    'Consumption barely moves. Production is whatever the weather made of it. So in a tight year the ending stocks take the hit — the carry-out shrinks, next year opens with no cushion, and the following weather headline meets a market that cannot absorb it.',
  ], { y: 2.6, h: 2.4, lineSpacing: 22 })
  s.addNotes([
    'Build it on the board as an accountant would, two columns, and force the totals to match.',
    'The chain is the lesson: thin carry-out, nervous market, outsized reaction to news. That is the 2024/25 backdrop behind the spike they will trade in the app.',
    'Walk the driver tree in the web app afterwards — click carry-in and ask "do farmers LIKE the price?" That question is real and it is not in any textbook.',
  ].join('\n'))
}

{
  const s = content('Supply arrives in pulses', 'supply and demand')
  cards(s, [
    { head: 'Brazil', text: 'Arabica\nMay – September' },
    { head: 'Vietnam', text: 'Robusta\nNovember – February' },
    { head: 'Colombia', text: 'October – January\nplus the mitaca, April – June' },
    { head: 'Indonesia', text: 'Sumatra\nOctober – March' },
  ], { y: 1.8, h: 1.55, fontSize: 11.5 })
  body(s, [
    'Somewhere it is always harvest. But for any single origin, supply pressure — and harvest-time selling of differentials — is intensely seasonal.',
    'That is why softs curves carry crop-year structure, and why an origin\'s differentials have seasons of their own.',
  ], { y: 3.55, h: 1.45, lineSpacing: 21 })
  s.addNotes([
    'Show the wheel in the app, and switch it to wheat and corn so they see the same logic in another crop.',
    'Point at today\'s date on the wheel: whose harvest is running right now? That is who is pressing the market this month.',
  ].join('\n'))
}

{
  const s = content('Where the numbers come from', 'supply and demand')
  table(s, [
    [H('Market'), H('Source'), H('What it gives you')],
    ['Coffee', 'ICO', 'Monthly trade statistics'],
    ['Coffee', 'USDA GAIN', 'Origin-by-origin crop estimates'],
    ['Oil', 'IEA', 'Monthly oil market report'],
    ['Oil', 'EIA', 'Weekly US inventory data'],
    ['Grains', 'USDA WASDE', 'Monthly — a market-moving event in itself'],
  ], { y: 1.8, colW: [1.7, 2.3, 4.8], rowH: 0.36, fontSize: 12 })
  s.addText('Traders build their own balance from these, then apply their own adjustments. The edge is in the adjustment, not the download.', {
    x: M, y: 4.1, w: W, h: 0.5, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 13, italic: true, color: MUTED, lineSpacing: 18,
  })
  s.addNotes([
    'Tell them to diarise the WASDE release — the report itself moves the market at a known minute. Knowing the calendar is part of the job.',
    'Everyone has the same public data. The differentiation is the private adjustment and the speed of reading it.',
  ].join('\n'))
}

{
  const s = content('Sort every headline into four boxes', 'supply and demand')
  cards(s, [
    { head: 'Supply', text: 'Weather, crops, origin stocks, logistics' },
    { head: 'Demand', text: 'Consumption, substitution, preferences, processor margins' },
    { head: 'Exchange', text: 'Certified stocks, fund positioning, deliveries, squeezes, rule changes' },
    { head: 'Macro', text: 'FX, interest rates, tariffs, regulation' },
  ], { y: 1.9, h: 1.7, fontSize: 11.5 })
  body(s, [
    'Price is not set by one variable. It emerges from the intersection — and each family works on a different time horizon and a different magnitude.',
    'When the live screen runs later, every news flash you trade will come out of one of these four boxes. Practise sorting now.',
  ], { y: 3.8, h: 1.2, lineSpacing: 21 })
  s.addNotes([
    'Drill: read out five real headlines, let them shout the box. Fast, thirty seconds each.',
    'The useful follow-up question each time: how many tons, and for how long? A supply shock to yield is one season; a shock to hectares is years.',
  ].join('\n'))
}

/* ─────────────────── Section 7: the building ─────────────────── */
divider('07', 'The building', 'Where a graduate actually enters a trading house.')

{
  const s = content('Three offices', 'the building')
  cards(s, [
    { head: 'Front', text: 'Traders, originators, sales.\n\nPrices and executes, manages positions, faces counterparties.\n\nOwns the P&L.' },
    { head: 'Middle', text: 'Risk, control, compliance.\n\nMonitors limits, validates the marks, vets credit.\n\nOwns the limits.' },
    { head: 'Back', text: 'Operations and settlements.\n\nConfirms, wires margin, invoices, moves the cargo and the paper.\n\nOwns the trade happening.' },
  ], { y: 1.72, h: 2.55, fontSize: 11.5 })
  s.addText('The separation is not bureaucracy. It is a control — when one person sits on both sides of the wall, losses stay hidden until they are fatal. Barings, 1995.', {
    x: M, y: 4.45, w: W, h: 0.5, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 12.5, color: INK, lineSpacing: 18,
  })
  s.addNotes([
    'Careers moment. Be direct: the classic path runs through the back office — operations, then execution and logistics, then a junior trading seat.',
    'The desk trusts people who know how cargo really moves. Say that plainly; it is the most useful careers advice in the module.',
    'Every interview in this industry assumes you understand this structure. Some will test it.',
  ].join('\n'))
}

{
  const s = content('One trade, every desk', 'the building')
  const steps = [
    ['1–2', 'Front office', 'Buys 200 t of physical, sells 20 lots as the hedge. Minutes.'],
    ['3', 'Middle office', 'Captures the trade, checks it against position and credit limits.'],
    ['4', 'Back office', 'Matches the broker confirmations against the booked ticket.'],
    ['5', 'Treasury', 'Wires the initial margin, finances the physical purchase.'],
    ['6', 'Operations', 'Trucks, container, vessel, warehouse slot. The cargo actually moves.'],
    ['7', 'Back office', 'Cuts the shipping documents from what operations executed.'],
    ['8', 'Middle office', 'Marks the book and hands the desk head a P&L to sign.'],
  ]
  steps.forEach((st, i) => {
    const y = 1.62 + i * 0.44
    s.addText(st[0], { x: M, y, w: 0.5, h: 0.38, isTextBox: true, margin: 0, fontFace: MONO, fontSize: 11, bold: true, color: ACCENT, valign: 'middle' })
    s.addText(st[1], { x: M + 0.6, y, w: 1.55, h: 0.38, isTextBox: true, margin: 0, fontFace: SANS, fontSize: 11.5, bold: true, color: INK, valign: 'middle' })
    s.addText(st[2], { x: M + 2.25, y, w: W - 2.25, h: 0.38, isTextBox: true, margin: 0, fontFace: SANS, fontSize: 11.5, color: INK, valign: 'middle' })
  })
  s.addText('Eight touches, five departments — and only one of them is the part outsiders call trading.', {
    x: M, y: 4.8, w: W, h: 0.35, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 12.5, italic: true, color: MUTED,
  })
  s.addNotes([
    'Read it twice, deliberately. First as a map of JOBS: every step is a role you could be hired into next year, and each one sees the whole trade.',
    'Then as a map of CONTROLS: the person who does the deal never confirms it, never wires the cash, never marks their own book. Barings built into the furniture.',
  ].join('\n'))
}

{
  const s = content('Goods forward, money backward', 'the building')
  const flows = [
    ['GOODS →', 'Truck, mill, container, vessel, warehouse, roastery. Months.', ACCENT],
    ['DOCUMENTS →', 'Purchase contract, weighbridge slip, bill of lading, quality and phyto certificates, invoice. No clean documents, no payment.', '46505A'],
    ['← MONEY', 'The desk pays the farmer in November and is paid by the roaster months later. The gap is financed, insured and hedged.', '6B655F'],
  ]
  flows.forEach((f, i) => {
    const y = 1.8 + i * 0.92
    s.addText(f[0], { x: M, y, w: 1.7, h: 0.4, isTextBox: true, margin: 0, fontFace: MONO, fontSize: 12, bold: true, color: f[2] })
    s.addText(f[1], { x: M + 1.85, y, w: W - 1.85, h: 0.8, isTextBox: true, margin: 0, fontFace: SANS, fontSize: 12.5, color: INK, lineSpacing: 18 })
  })
  s.addText('That is the machine you would be joining: not a trading screen, but a chain that turns a farmer\'s crop into a roaster\'s delivery — profitably, and on paper a bank will finance.', {
    x: M, y: 4.55, w: W, h: 0.5, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 12.5, color: INK, lineSpacing: 18,
  })
  s.addNotes([
    'The three flows do not run together — that is the whole point, and it is where the money and the risk live.',
    'Operations move the goods, back office owns the paper, treasury moves the cash, and the front office hedge protects the price the whole way.',
    'Close the loop: that hedge is Module 2.',
  ].join('\n'))
}

/* ─────────────────── Close ─────────────────── */
{
  const s = pres.addSlide()
  s.background = { color: INK }
  s.addText('Where we got to', {
    x: M, y: 0.85, w: W, h: 0.6, isTextBox: true, margin: 0,
    fontFace: SERIF, fontSize: 30, bold: true, color: PAPER,
  })
  s.addText([
    { text: 'A trader is paid to carry risk the chain cannot carry, and to convert a flat price into a differential.', options: { bullet: { code: '2013' }, breakLine: true } },
    { text: 'The exchange exists because bilateral markets have no reference price and no protection in advance.', options: { bullet: { code: '2013' }, breakLine: true } },
    { text: 'A futures contract standardises everything except price — and the clearing house makes strangers tradeable.', options: { bullet: { code: '2013' }, breakLine: true } },
    { text: 'The curve is not a forecast. Open interest tells you who is really there.', options: { bullet: { code: '2013' }, breakLine: true } },
    { text: 'Supply and demand is a balance sheet, and the carry-out is the line that adjusts.', options: { bullet: { code: '2013' } } },
  ], {
    x: M, y: 1.7, w: W, h: 2.4, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 14, color: 'D9D2CB', lineSpacing: 26, paraSpaceAfter: 6,
  })
  s.addText('Module 2 — hedging, PTBF and the basis. Everything today was the vocabulary for it.', {
    x: M, y: 4.3, w: W, h: 0.45, isTextBox: true, margin: 0,
    fontFace: SERIF, fontSize: 16, color: ACCENT,
  })
  s.addNotes([
    'Do NOT read this list out. Ask them to close laptops and tell YOU what a commodity trader is paid for. Then show the slide.',
    'Set the work before Module 2: run the futures screen and the junior inbox in the web app.',
    'Module 2 codeword: antwerp.',
  ].join('\n'))
}

pres.writeFile({ fileName: require('path').join(__dirname, '..', 'Commodity-Trading-Module-1.pptx') })
  .then(f => console.log('WROTE', f))
  .catch(e => { console.error(e); process.exit(1) })
