// Commodity Trading — Module 1.
//
// House rules for this deck, and they are not negotiable per slide:
//   * exactly two shapes on every slide — one title, one body
//   * one uniform theme throughout: white, Calibri, same sizes, same colour
//   * body is Calibri 14, single-spaced, no paragraph spacing
//   * no header, no footer, no slide numbers, no charts, no tables, no shapes
//
// Everything that used to be a chart or a table is written out as text.
const pptxgen = require('pptxgenjs')
const path = require('path')

const pres = new pptxgen()
pres.layout = 'LAYOUT_16x9' // 10 x 5.625 in
pres.author = 'Loïc Scanu'
pres.title = 'Commodity Trading — Module 1'

const FONT = 'Calibri'
const COLOR = '1F1F1F'
const BG = 'FFFFFF'

const M = 0.6
const W = 8.8

const TITLE = { x: M, y: 0.4, w: W, h: 0.9, isTextBox: true, margin: 0, fontFace: FONT, fontSize: 28, bold: true, color: COLOR, valign: 'top' }
const BODY = { x: M, y: 1.4, w: W, h: 3.75, isTextBox: true, margin: 0, fontFace: FONT, fontSize: 14, color: COLOR, valign: 'top', paraSpaceBefore: 0, paraSpaceAfter: 0 }

// A body line is one of:
//   'text'        plain paragraph
//   ['text']      bullet
//   {b: 'text'}   bold paragraph (a lead-in label)
//   ''            blank line
function lines(items) {
  return items.map((it, i) => {
    const last = i === items.length - 1
    const opt = last ? {} : { breakLine: true }
    if (it === '') return { text: ' ', options: opt }
    if (Array.isArray(it)) return { text: it[0], options: { ...opt, bullet: { code: '2013' } } }
    if (typeof it === 'object') return { text: it.b, options: { ...opt, bold: true } }
    return { text: it, options: opt }
  })
}

function slide(title, body, notes) {
  const s = pres.addSlide()
  s.background = { color: BG }
  s.addText(title, { ...TITLE })
  s.addText(lines(body), { ...BODY })
  if (notes) s.addNotes(notes.join('\n'))
  return s
}

/* ───────────────────────────── Title ───────────────────────────── */

slide('Commodity Trading', [
  'Module 1 — Panorama and vocabulary',
  '',
  'Loïc Scanu',
  'Université Paris-Panthéon-Assas',
], [
  'Housekeeping first, 2 min: three hours, one break. Phones face down except for the trading screen later.',
  'Frame the session: today is vocabulary and panorama. You will not hedge anything today — that is Module 2.',
  'Promise: by the end you can read a futures screen and say what a commodity trader is actually paid for.',
])

/* ────────────────── 1. What the job actually is ────────────────── */

slide('1. What the job actually is', [
  'Three aspects of every trade, a basket of risks, and one contract that falls out of the constraints.',
], [
  'Say the destination out loud: in forty minutes we will have invented the PTBF contract from first principles, without me telling you what it is.',
])

slide('Every trade clears three tests at once', [
  { b: 'Commercial — can I buy it and sell it at a margin?' },
  'Counterparties, the price form, supply and demand, and which risk to keep.',
  '',
  { b: 'Logistics — can I move it, on spec and on time?' },
  'Freight, quality, documents, timing. The goods have to physically travel.',
  '',
  { b: 'Financial — can I fund it, and will I be paid?' },
  'The cargo is paid for months before the customer pays you.',
  '',
  'Not a sequence. A simultaneous test — a good price on a cargo that cannot ship is not a good trade.',
], [
  'Ask the room first: what does a commodity trader do all day? Collect answers on the board — most will say "buy low sell high".',
  'Then: that is one third of it, and the easiest third.',
  'Each line is a department, and a way to lose the margin. Name the three failure stories: priced well but no vessel; shipped but never paid; paid but the quality was rejected.',
  'Callback later: the exchange has three functions too. Same shape.',
])

slide('What we actually trade is risk', [
  ['Price (flat) — what you own moves while you hold it'],
  ['Counterparty — they fail to perform, precisely when the price moved against them'],
  ['Logistic — delays, vessels, congestion, strikes, a closed canal'],
  ['Quality — what arrives does not match the contract'],
  ['Financing — you pay months before you are paid'],
  ['Currency — you buy in one currency and sell in another'],
  ['Political — export bans, tariffs, sanctions, new compliance regimes'],
  '',
  'The goods pass through. The basket stays with whoever holds the position, and the paper is how it is transferred.',
], [
  'Correct the obvious answer: the product is not coffee. Coffee moves through the desk untouched.',
  'Walk the list slowly. For each, ask for an example from a market they know.',
  'Counterparty risk: flag it now, it comes back twice today — olive oil, and the clearing house.',
])

slide('Anyone in between is a trader', [
  'Producer  →  Trade house  →  Factory  →  Supermarket  →  Consumer',
  '',
  'A supermarket buys enormous volumes forward, warehouses them and resells at a posted price. That is a trader.',
  '',
  'A factory buys raw material, holds it, transforms it, sells the output. Also a trader.',
  '',
  'They carry almost the same basket of risks as the trade house. So what is the difference?',
], [
  'This is the slide that reframes the industry. Take your time.',
  'Ask: is Carrefour a commodity trader? Let them argue. Most say no.',
  'Then: they buy forward, they store, they carry price risk, they resell. Which part is not trading?',
  'End on the question — do NOT answer it. The next four slides are the answer.',
])

slide('The difference is one line of the basket', [
  'How the price risk is managed.',
  '',
  'Follow the logic backwards, starting from the supermarket shelf. It ends somewhere very specific.',
], [
  'Deliberately bare. Let the sentence sit for a few seconds before moving on.',
])

slide('Start at the shelf', [
  'The final consumer buys spot. The goods must physically be on the shelf, with a known purchase cost, before any selling price can be printed.',
  '',
  'And a retailer cannot reprice its shelves every morning.',
  '',
  'So it negotiates huge volumes — six months to a year — at one fixed price, agreed in advance.',
], [
  'Concrete: the 250g pack on the shelf. Its price was effectively decided months ago.',
  'Ask: how often does the coffee price on the shelf change? Once or twice a year. Now compare with the futures screen, which changes every second.',
  'That gap between the two clocks is the whole problem this course solves.',
])

slide('The factory inherits a fixed price', [
  'The manufacturer has now SOLD a year of production at a flat price. Whatever it pays for raw material, the revenue side is frozen.',
  '',
  'Symmetry says: if you sold flat, buy flat. Cover the sale with a fixed-price purchase and the margin is locked.',
  '',
  'Sold — one year, flat price, to the retailer.',
  'So buy — one year, flat price, from the supplier.',
], [
  'Keep this one quick — it is the obvious move, and it is a trap.',
  'Let them agree with it. The next slide takes it away.',
])

slide('And that is where it breaks', [
  'Six months later the market has doubled.',
  '',
  'The supplier is committed to deliver a full year at half the market price. The incentive to default is now enormous — and many do.',
  '',
  'Buying the whole year forward did not remove risk. It converted price risk into counterparty risk.',
], [
  'This is the hinge of the whole introduction. Slow down.',
  'Ask: whose problem is it when your supplier walks away? Yours. You still owe the retailer a year of product at a fixed price.',
  'Forward-reference: this is exactly what happened in olive oil in 2023. We come back to it in twenty minutes.',
])

slide('So split the two decisions', [
  { b: 'Secure the volume — now.' },
  'The cargo is booked, the origin committed, the logistics planned. You know you will have the coffee.',
  '',
  { b: 'Fix the price — later.' },
  'Ideally at the last minute, when the exposure is short and performing stays rational for both sides.',
  '',
  'A purchase contract does two things at once: it secures the GOODS and it sets the PRICE. Nothing says they must happen on the same day.',
], [
  'Ask the room how you would escape the trap before showing the answer. Someone usually gets it.',
  'The insight is that a contract bundles two decisions, and bundling is a choice.',
])

slide('To fix the price later, dismantle it', [
  { b: 'A floating reference' },
  'Observable by anyone, moves every day. The futures price. Fixed LATER.',
  '',
  { b: 'plus a fixed differential' },
  'Origin, quality, port, timing. This specific coffee. Agreed TODAY.',
  '',
  'You have just invented the PTBF contract — Price To Be Fixed.',
  '',
  'Nobody designed it in a committee. It falls out of the constraints.',
], [
  'Write the formula on the board as you say it: invoice price = futures fixing + differential.',
  'Emphasise: this is the single most important contract in physical commodity trading, and we derived it from a supermarket shelf.',
  'Module 2 is essentially three hours on this one line.',
])

slide('The other end wants the opposite', [
  { b: 'The producer' },
  'Has a fixed cost of production. Wants to sell flat, now, when the crop is in. Fears a collapse before selling.',
  '',
  { b: 'The factory' },
  'Has revenue fixed by a one-year sale. Wants to fix late, at the last minute. Fears a rally after buying — and the default that follows.',
  '',
  'The trader stands between them and converts a flat-price risk into a differential risk — then keeps it.',
], [
  'The business model in one sentence. Make them write it down.',
  'Consequence 1: if the trader keeps the differential and not the flat price, they need somewhere to lay the flat price off. That is the exchange — next section.',
  'Consequence 2: they must understand what moves the reference AND what moves the differential. That is the rest of the course.',
])

/* ────────────────── 2. Why the market exists ────────────────── */

slide('2. Why the market exists', [
  'Start from the opposite end: imagine there is no market at all.',
], [
  'Tell them this section is an argument, not a history lesson. The history arrives only once the problem is unbearable.',
])

slide('A world with no exchange', [
  { b: 'No reference price' },
  'Every deal is private. Nobody knows what the right price is — not the farmer selling, not the roaster committing to next year. The better-informed side wins. Information IS the margin.',
  '',
  { b: 'No protection in advance' },
  'Whatever you must buy or sell next season, you pay whatever the price happens to be then. Price risk sits with whoever holds the goods, and cannot be moved.',
  '',
  'Millions of growers, thousands of roasters, each negotiating bilaterally, in the dark.',
], [
  'Thought experiment, out loud: delete ICE from the world tonight. What breaks tomorrow morning?',
  'Draw on the board: 5 sellers x 5 buyers = 25 bilateral negotiations. Then 50 x 50. Quadratic.',
  'One central marketplace turns that into linear — and makes the price public.',
  'These two problems are the whole reason the rest of the course exists. Everything today answers one of them.',
])

slide('Olive oil: a market with no futures', [
  'Extra virgin, ex-mill Spain, in euros per tonne:',
  '',
  'about 2,100 in 2019 — 3,200 in 2021 — 4,000 in 2022 — 7,500 in 2023 — a peak near 8,900 in 2024 — back to about 3,900 in 2025.',
  '',
  'Spanish drought took the price from roughly 2,000 to nearly 9,000 a tonne, and back. Every importer and bottler simply ate the move.',
  '',
  'No hedge to lay it off. No transparent reference to negotiate against. No buyer of last resort for stuck stock.',
], [
  'Real market, recent, and they have all seen the price in the supermarket. Use that.',
  'Sketch the shape on the board while you read the numbers — a slow climb then a cliff.',
  'Ask: what should a good olive-oil buyer have done in 2022? Let them propose. Next slide kills both answers.',
])

slide('Both physical defences fail', [
  { b: 'You cannot stock your way out.' },
  'A bottler\'s tanks hold perhaps one month of supply. Storage is expensive, oil degrades, capital is tied up. Seeing the drought coming does not help if you physically cannot hold more than four weeks of it.',
  '',
  { b: 'You can buy forward — into default.' },
  'Contract future shipments at today\'s price. When the market doubles, your supplier chooses: honour a contract that ruins him, or walk away. Many walked.',
  '',
  'An unsecured bilateral promise is only as good as the counterparty\'s solvency — and it fails exactly when you need it most.',
], [
  'Callback: this is the trap from the introduction, now in a real market.',
  'Plant the flag: remember this failure. In fifteen minutes we meet the institution invented specifically to kill it — the clearing house.',
])

slide('Three markets that never got a contract', [
  { b: 'Rice, 2008 — tripled.' },
  'Export restrictions, thin visibility on stocks, and panic did the pricing. Then it collapsed.',
  '',
  { b: 'Vietnamese pepper, 2015–19 — $10,000 to $2,000 a tonne.' },
  'Farmers planted at the peak with no forward curve to warn them. Orchards were ripped out three harvests later.',
  '',
  { b: 'US onions — futures banned by law in 1958, still in force.' },
  'Prices became MORE volatile than before, and more volatile than comparable vegetables.',
  '',
  'The volatility here is not worse than coffee\'s. The difference is that coffee traders can do something about it.',
], [
  'The onion case is the one to dwell on — a natural experiment run by the US Congress.',
  'The farmers lobbied for the ban because they blamed speculators for volatility. They got more volatility.',
  'Ask: why would removing the futures market make prices LESS stable? Let them reason to it.',
])

slide('Chicago, 1848: the answer was improvised', [
  ['1840s — harvest floods a city with too little storage. Prices collapse in autumn and soar by spring; grain is dumped in Lake Michigan.'],
  ['1848 — eighty-two merchants found the Chicago Board of Trade. Deals are struck in public. The reference price is born.'],
  ['1850s — "to-arrive" contracts: a price agreed today for grain delivered later. Protection in advance.'],
  ['1865 — standardised grades, lot sizes and delivery months, and both sides post margin. The futures contract.'],
  ['1925 — a full clearing house guarantees every trade. The exchange steps between buyer and seller.'],
], [
  'Not designed by economists — improvised by merchants who lived the no-market world every autumn.',
  'Point at each date and map it back to the two problems: 1848 solves the reference price, 1850s solves protection in advance, 1925 solves counterparty risk.',
  'The olive-oil failure structurally cannot happen on a cleared exchange. That is the whole point of 1925.',
])

slide('Every exchange is the same invention', [
  { b: 'Price discovery.' },
  'One public, transparent price the whole chain can read and negotiate against.',
  '',
  { b: 'Risk management.' },
  'A way to fix a price in advance — to transfer price risk to someone willing to hold it.',
  '',
  { b: 'Last resort.' },
  'Physically deliverable, so the exchange is the buyer and seller of last resort for standard-spec goods.',
  '',
  'ICE trades some 400 million tonnes of coffee a year against a world crop of about 10 — roughly two thousand times over.',
], [
  'Callback: three aspects of a trade, three functions of an exchange. The market is built to serve the job.',
  'The 2,000x number always gets a reaction. Ask what it means: most trading is risk transfer and liquidity, not people wanting coffee.',
  'Pre-empt the "speculators are parasites" objection here — without that volume the farmer has nobody to sell his hedge to.',
])

/* ────────────── 3. The universe and the instrument ────────────── */

slide('3. The universe and the instrument', [
  'Coffee is one market among many — and they all run on the same machinery.',
], [
  'Short section. The point is scope, so keep the pace up.',
])

slide('Hard and soft', [
  { b: 'Hard — extracted.' },
  'Energy: crude (Brent, WTI), natural gas, coal. Metals: copper, aluminium, gold, iron ore.',
  '',
  { b: 'Soft — grown or raised.' },
  'Grains: wheat, corn, soybeans. Tropicals: coffee (Arabica, Robusta), cocoa, sugar, cotton.',
  '',
  'Different supply and demand dynamics, different seasonality, different storage constraints — but the same market machinery you just saw.',
  '',
  'One name to retain all year: the ABCD — Archer Daniels Midland, Bunge, Cargill, Louis Dreyfus. Plus the coffee specialists: Neumann, Volcafe, Sucafina, Olam.',
], [
  'Quick slide. The point is scope: what you learn on coffee transfers to metals and energy.',
  'ABCD: ask if anyone has heard of Cargill. Usually nobody. Largest private company in America — that lands well.',
])

slide('Standardised in everything but price', [
  ['Arabica coffee — ICE US — 37,500 lbs a lot — quoted in US cents per pound'],
  ['Robusta coffee — ICE Europe — 10 tonnes a lot — quoted in USD per tonne'],
  ['Brent crude — ICE — 1,000 barrels a lot — quoted in USD per barrel'],
  '',
  'Lot size, quality, delivery location, delivery months — all set by the exchange. The only blank line on the page is the price.',
  '',
  'That is exactly what lets thousands of strangers trade the same instrument without negotiating anything but a number.',
], [
  'Hold up the idea of a pre-printed page with one blank. That image does the work.',
  'Note the units are all different and all traditional — 37,500 lbs is not a round number by accident, it is a railcar.',
  'Most contracts are never delivered: they are offset before expiry. Delivery matters because it is POSSIBLE, not because it happens.',
])

slide('From bags to warrant', [
  '1.  Coffee arrives at a licensed warehouse.',
  '2.  It is sampled and graded against the quality ladder.',
  '3.  An electronic warrant is issued.',
  '4.  The warrant is delivered to settle a short futures position.',
  '',
  'The exam in the middle is what makes 10 tonnes in Antwerp interchangeable with 10 tonnes in Hamburg.',
], [
  'The quality ladder: Class 1 delivers at contract price, better earns a premium, worse a discount — and the exchange sets those, they are not negotiated.',
  'That is what keeps delivery predictable, and it is the bridge between an idealised contract and messy real coffee.',
])

/* ────────────────────── 4. The instruments ────────────────────── */

slide('4. The instruments', [
  'Futures, the order book, open interest, margin — and the OTC cousin.',
], [
  'Warn them this is the vocabulary-heavy stretch. Everything here comes back in the app.',
])

slide('What a futures contract actually is', [
  ['Standardised — lot, quality and delivery defined by the exchange'],
  ['Marked to market daily — gains and losses settle in cash every day'],
  ['Cleared — the clearing house steps between buyer and seller'],
  '',
  'Counterparty risk is mutualised and collateralised. Mitigated, not abolished: at Nasdaq Clearing in 2018, one trader\'s default consumed a large share of the default fund.',
  '',
  'Most futures are never delivered. They are offset before expiry by an opposing trade.',
], [
  'Push back on the word "guarantee" — students hear it as risk-free. Use the 2018 Nasdaq case to show it is not.',
  'That matters professionally: your clearing member can still fail, and you post margin to a default waterfall.',
])

slide('Where the price comes from', [
  'Offers: 4,815 for 12 lots — 4,810 for 8 — 4,805 for 10.',
  'Bids: 4,800 for 15 lots — 4,795 for 20 — 4,790 for 18.',
  '',
  ['A small market buy fills instantly at 4,805. You paid the spread — the price of immediacy.'],
  ['A large market buy eats through several levels: the fill walks the book and your average slips. Size moves markets.'],
  ['A limit buy below the market rests in the book. You are now making the liquidity that others take.'],
  '',
  '"One transparent price" is nothing more mystical than the top of this book.',
], [
  'Draw the ladder on the board as you read it, best bid and best offer touching in the middle.',
  'They will trade this book in the web app later. Here just establish that a "price" is really two prices and a queue.',
  'Ask: if you must buy 40 lots right now, what price do you get? Not the screen price. That gap is a real cost, and it is why size is a disadvantage.',
])

slide('Two counters beginners confuse', [
  { b: 'Volume — every lot that TRADED today.' },
  'Measures activity. Resets to zero each morning.',
  '',
  { b: 'Open interest — every lot still OUTSTANDING.' },
  'Open promises held at the clearing house. Measures positions. Carried overnight.',
  '',
  ['Volume high, OI rising: new money entering — fresh longs meeting fresh shorts. Conviction.'],
  ['Volume high, OI flat: positions churning hands. Day traders passing the same risk around.'],
  ['Volume high, OI falling: holders leaving. A rally on falling OI is shorts covering, not buyers arriving.'],
], [
  'The two-trade mechanic on the board: A buys from B — volume +1, OI +1, new risk created. A then sells to C — volume +1, OI unchanged, the promise just changed owner.',
  'Third case worth stating: A buys back from B, both close — volume +1, OI -1. Risk destroyed.',
  'The last line is the professional read. "Rally on falling open interest" is a short-covering rally, and it usually does not last.',
])

slide('Margin: the cash reality of a hedge', [
  'You are an exporter, short 10 lots of Robusta at $4,500 a tonne, hedging unsold physical. Every $1 move is $100 on the position.',
  '',
  'The market rallies for four days. Twenty thousand dollars wires OUT of your account — while the coffee that backs the hedge sits in the warehouse, unsold and unfinanceable.',
  '',
  'The hedge is economically perfect and cash-flow brutal.',
  '',
  'A margin call is not a liquidation. The first UNFUNDED one is. Ashanti\'s gold hedges in 1999; European utilities in 2022. A hedging programme without a liquidity line is a speculation on your own funding.',
], [
  'This is the slide that separates people who have read about hedging from people who have done it.',
  'Symmetric point: if the market falls, the hedge PAYS you daily while the stock loses on paper. Just as misleading if the cash gets spent.',
  'Ashanti 1999 is worth two minutes if there is time — a gold miner hedged correctly and nearly died of margin calls.',
])

slide('Swaps: the OTC cousin', [
  'A bilateral agreement to exchange cash flows against a published index. The producer receives fixed, pays floating — so their price is fixed wherever the market goes.',
  '',
  '500 tonnes a month, fixed at $4,300 a tonne:',
  ['January, index averages 4,150. The producer receives $150 a tonne — $75,000.'],
  ['February, index averages 4,420. The producer pays $120 a tonne — $60,000.'],
  ['March, index averages 4,300. Nothing changes hands.'],
  '',
  'Effective price: $4,300, whichever way the index goes.',
], [
  'Key difference from futures: custom size, custom tenor, custom settlement — and counterparty credit risk, because there is no clearing house.',
  'At the trade date NO cash changes hands. A swap is not an option; there is no premium. Students confuse these constantly.',
  'How it actually gets done: by voice and instant message through an OTC broker — TOTSA in Geneva, PVM in London — papered under an ISDA, settled against a published average. Not a screen.',
])

/* ────────────────────── 5. Market structure ────────────────────── */

slide('5. Market structure', [
  'The shape of the forward curve, and what it is telling you.',
], [
  'Draw both curve shapes freehand on the board before you start. They should be able to sketch these by the end of the module.',
])

slide('Contango and backwardation', [
  { b: 'Contango — forward above spot.' },
  'Spot 60, then 61, 62, 63, 65, 66, 67 out to six months. The normal state for a storable commodity. It reflects the cost of carry: storage, insurance, financing. It signals adequate nearby supply.',
  '',
  { b: 'Backwardation — forward below spot.' },
  'Spot 60, then 59, 57, 56, 56, 55, 55 out to six months. Spot commands a premium. It signals tight nearby supply or urgent demand — disruptions, drawdowns, harvest seasons.',
  '',
  'Storable versus non-storable matters: power and livestock have no carry linking one month to the next, so no contango logic at all.',
], [
  'Sketch both on the board while you read the numbers, then leave them up for the next three slides.',
  'Make them say which shape they would expect right after a harvest, and which after a port strike.',
])

slide('Contango pays for storage', [
  'Buy spot  →  store it  →  sell forward at the higher price  →  earn the spread, minus costs.',
  '',
  'Cost of carry = storage + insurance + financing.',
  '',
  'If the forward premium exceeds the cost of carry, this cash-and-carry arbitrage is profitable — and traders do it until the premium collapses back to fair value.',
  '',
  'Contango is why oil in tanks, grain in silos and coffee in warehouses are all financed by the forward curve.',
], [
  'The arbitrage is what makes the curve an equation rather than an opinion. That sets up the next slide.',
  'Practical: a trader with a warehouse owns an option on the calendar spread. We price that in Module 3.',
])

slide('The forward curve is not a forecast', [
  'Spot $60. Six-month $67.',
  '',
  'The $7 is not an opinion about the future. It is the bill for storing, insuring and financing a barrel for six months.',
], [
  'Deliberately bare. Let them object — someone always does.',
])

slide('Why it cannot be a forecast', [
  'Suppose the six-month contract jumped to $75 on pure bullish sentiment.',
  '',
  'Anyone could buy spot at 60, pay about 7 of carry, and sell forward at 75 — a risk-free 8.',
  '',
  'That selling crushes the forward straight back to about 67. The curve is leashed to spot by the cost of carry.',
  '',
  'Contango describes TODAY: ample supply, demand for storage, and the cost of money. Not where spot will be at maturity.',
], [
  'This is the most common mistake in the room and in the press. Make them say the wrong version out loud first.',
  'Ask: if the curve predicted the future, what would that imply about anyone holding the spot commodity?',
])

slide('Squeezes, and the exchange\'s toolkit', [
  'Backwardation signals scarcity now: a bad harvest, a port strike, an inventory drawdown, a seasonal demand peak.',
  '',
  'Its extreme form is the squeeze — a dominant player controls nearby physical supply and forces short hedgers to pay whatever it takes to close.',
  '',
  ['Position limits — cap how much of the delivery month any one entity may hold'],
  ['Lending rules — force a dominant long to lend at a capped premium (LME Tom-Next)'],
  ['Backwardation caps — a hard ceiling on the spot-to-3M spread, introduced after nickel in 2022'],
  ['Delivery deferral — lets a trapped short postpone delivery for a fee instead of defaulting'],
  ['Cash settlement — no physical delivery at all, so no physical squeeze is possible'],
], [
  'The Robusta market has had recurring squeezes — this is not theoretical for a coffee trader.',
  'LME nickel 2022 is the case to mention: the exchange cancelled trades. Ask what that does to trust in a market. Good debate if time allows.',
  'Link forward: an unplanned long in the delivery month is a decision, not a detail.',
])

slide('The roll: open interest changes address', [
  'The front month carries roughly half the board\'s open interest. As its expiry approaches, holders who want no part of physical delivery close it and reopen the next month.',
  '',
  'Volume spikes while it happens — every migrating lot trades twice — but total open interest barely moves. It does not die. It changes address.',
  '',
  'A small remainder rides into expiry on purpose: the players with a delivery plan.',
  '',
  'Reading a screen: a nearby contract with almost no open interest left is a contract whose remaining holders all intend to deliver. Do you?',
], [
  'Run the animated version in the web app here — one real year of Robusta, six contracts, the crowd handing over.',
  'This is where open interest from the instruments section pays off. Watch the bands trade places.',
  'The roll also has an economics: in backwardation you buy each deferred cheap and ride it up to spot. That is roll yield — Module 2 prices it.',
])

/* ───────────────────── 6. Supply and demand ───────────────────── */

slide('6. Supply and demand', [
  'A balance sheet of tons — and which line does the adjusting.',
], [
  'Set the discipline up front: every headline they will ever read is a sentence about one line of this sheet.',
])

slide('Two multiplications', [
  { b: 'Supply = hectares × trees per hectare × yield per tree.' },
  'Land cost and the opportunity cost of competing crops. Planting density, inter-cropping, the age profile of the trees. Weather, fertiliser, irrigation, variety, disease — then the ripe-cherry and conversion ratios. Plus the carry-in: what was kept from last year, at the farm, at origin, at destination.',
  '',
  { b: 'Demand = population × cups per capita × grams per cup × blend.' },
  'Bent by purchasing power, by coffee culture (capsules, specialty, out-of-home), and by substitution at the margin. Split destination consumption from origin consumption — Brazil drinks a top-two share of the world\'s coffee itself.',
  '',
  'Demand moves slowly and almost never backwards. Supply does most of the price-setting.',
], [
  'The discipline to teach: every supply headline on the screen is a sentence about ONE of these factors. Knowing the tree tells you how many tons the headline is really worth.',
  'Test it live: "drought in Minas Gerais" — which factor? Yield per tree. "Farmers replanting with avocado" — hectares, and with a lag of years.',
  'That lag matters: hectares move over years, yield moves within a season. Different trades.',
])

slide('The balance sheet', [
  'Beginning stocks + production = consumption + ending stocks.',
  '',
  'Sources on the left, uses on the right, and the two sides are forced to equal. The sheet always balances.',
  '',
  'So the analysis is never "does it balance". It is: WHICH LINE does the adjusting?',
  '',
  'Consumption barely moves. Production is whatever the weather made of it. So in a tight year the ending stocks take the hit — the carry-out shrinks, next year opens with no cushion, and the following weather headline meets a market that cannot absorb it.',
], [
  'Build it on the board as an accountant would, two columns, and force the totals to match.',
  'The chain is the lesson: thin carry-out, nervous market, outsized reaction to news. That is the backdrop behind the spike they will trade in the app.',
  'Walk the driver tree in the web app afterwards — click carry-in and ask "do farmers LIKE the price?" That question is real and it is not in any textbook.',
])

slide('Supply arrives in pulses', [
  ['Brazil — Arabica, May to September'],
  ['Vietnam — Robusta, November to February'],
  ['Colombia — October to January, plus the mitaca in April to June'],
  ['Indonesia — Sumatra, October to March'],
  '',
  'Somewhere it is always harvest. But for any single origin, supply pressure — and harvest-time selling of differentials — is intensely seasonal.',
  '',
  'That is why softs curves carry crop-year structure, and why an origin\'s differentials have seasons of their own.',
], [
  'Show the wheel in the app, and switch it to wheat and corn so they see the same logic in another crop.',
  'Point at today\'s date on the wheel: whose harvest is running right now? That is who is pressing the market this month.',
])

slide('Where the numbers come from', [
  ['Coffee — ICO, monthly trade statistics'],
  ['Coffee — USDA GAIN, origin-by-origin crop estimates'],
  ['Oil — IEA, the monthly oil market report'],
  ['Oil — EIA, weekly US inventory data'],
  ['Grains — USDA WASDE, monthly, and a market-moving event in itself'],
  '',
  'Traders build their own balance from these, then apply their own adjustments. The edge is in the adjustment, not the download.',
], [
  'Tell them to diarise the WASDE release — the report itself moves the market at a known minute. Knowing the calendar is part of the job.',
  'Everyone has the same public data. The differentiation is the private adjustment and the speed of reading it.',
])

slide('Sort every headline into four boxes', [
  ['Supply — weather, crops, origin stocks, logistics'],
  ['Demand — consumption, substitution, preferences, processor margins'],
  ['Exchange — certified stocks, fund positioning, deliveries, squeezes, rule changes'],
  ['Macro — FX, interest rates, tariffs, regulation'],
  '',
  'Price is not set by one variable. It emerges from the intersection — and each family works on a different time horizon and a different magnitude.',
  '',
  'When the live screen runs later, every news flash you trade will come out of one of these four boxes. Practise sorting now.',
], [
  'Drill: read out five real headlines, let them shout the box. Fast, thirty seconds each.',
  'The useful follow-up question each time: how many tons, and for how long? A supply shock to yield is one season; a shock to hectares is years.',
])

/* ──────────────────────── 7. The building ──────────────────────── */

slide('7. The building', [
  'Where a graduate actually enters a trading house.',
], [
  'Tell them this is the careers section. Laptops shut, this is the part they will use in interviews.',
])

slide('Three offices', [
  { b: 'Front — traders, originators, sales.' },
  'Prices and executes, manages positions, faces counterparties. Owns the P&L.',
  '',
  { b: 'Middle — risk, product control, compliance.' },
  'Monitors limits, validates the marks, vets credit. Owns the limits and the marks.',
  '',
  { b: 'Back — operations, settlements, documentation.' },
  'Confirms, wires margin, invoices, moves the cargo and the paper. Owns the trade actually happening.',
  '',
  'The separation is not bureaucracy. It is a control — when one person sits on both sides of the wall, losses stay hidden until they are fatal. Barings, 1995.',
], [
  'Careers moment. Be direct: the classic path runs through the back office — operations, then execution and logistics, then a junior trading seat.',
  'The desk trusts people who know how cargo really moves. Say that plainly; it is the most useful careers advice in the module.',
  'Every interview in this industry assumes you understand this structure. Some will test it.',
])

slide('One trade, every desk', [
  '1.  Front office buys 200 t of physical and sells 20 lots as the hedge. Minutes.',
  '2.  Middle office captures the trade, checks it against position and credit limits.',
  '3.  Back office matches the broker confirmations against the booked ticket.',
  '4.  Treasury wires the initial margin and finances the physical purchase.',
  '5.  Operations arranges trucks, container, vessel, warehouse slot. The cargo moves.',
  '6.  Back office cuts the shipping documents from what operations executed.',
  '7.  Middle office marks the book and hands the desk head a P&L to sign.',
  '',
  'Seven touches, five departments — and only one of them is the part outsiders call trading.',
], [
  'Read it twice, deliberately. First as a map of JOBS: every step is a role you could be hired into next year, and each one sees the whole trade.',
  'Then as a map of CONTROLS: the person who does the deal never confirms it, never wires the cash, never marks their own book. Barings built into the furniture.',
])

slide('Goods forward, money backward', [
  { b: 'Goods go forward.' },
  'Truck, mill, container, vessel, warehouse, roastery. Months.',
  '',
  { b: 'Documents chase them.' },
  'Purchase contract, weighbridge slip, bill of lading, quality and phyto certificates, invoice. No clean documents, no payment.',
  '',
  { b: 'Money comes backward.' },
  'The desk pays the farmer in November and is paid by the roaster months later. The gap is financed, insured and hedged.',
  '',
  'That is the machine you would be joining: not a trading screen, but a chain that turns a farmer\'s crop into a roaster\'s delivery — profitably, and on paper a bank will finance.',
], [
  'The three flows do not run together — that is the whole point, and it is where the money and the risk live.',
  'Operations move the goods, back office owns the paper, treasury moves the cash, and the front office hedge protects the price the whole way.',
  'Close the loop: that hedge is Module 2.',
])

slide('Where we got to', [
  ['A trader is paid to carry risk the chain cannot carry, and to convert a flat price into a differential.'],
  ['The exchange exists because bilateral markets have no reference price and no protection in advance.'],
  ['A futures contract standardises everything except price — and the clearing house makes strangers tradeable.'],
  ['The curve is not a forecast. Open interest tells you who is really there.'],
  ['Supply and demand is a balance sheet, and the carry-out is the line that adjusts.'],
  '',
  'Module 2 — hedging, PTBF and the basis. Everything today was the vocabulary for it.',
], [
  'Do NOT read this list out. Ask them to close laptops and tell YOU what a commodity trader is paid for. Then show the slide.',
  'Set the work before Module 2: run the futures screen and the junior inbox in the web app.',
  'Module 2 codeword: antwerp.',
])

pres.writeFile({ fileName: path.join(__dirname, '..', 'Commodity-Trading-Module-1.pptx') })
  .then(f => console.log('WROTE', f))
  .catch(e => { console.error(e); process.exit(1) })
