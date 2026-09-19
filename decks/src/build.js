// Module 1 lecture deck — Commodity Trading, Université Paris-Panthéon-Assas.
// Design brief: the lecturer speaks, the slide anchors. Minimal on-slide text,
// real figures, no decoration for its own sake.
const pptxgen = require('pptxgenjs')

const pres = new pptxgen()
pres.layout = 'LAYOUT_16x9' // 10in x 5.625in
pres.author = 'Loïc Scanu'
pres.title = 'Commodity Trading — Module 1'

// ── Palette: roast & ink. Chosen for a coffee-and-futures course, not generic blue.
const INK = '221E1B'      // dark espresso — dark slides, body text
const PAPER = 'FFFFFF'
const ACCENT = 'A34B12'   // roast amber — sharp, used sparingly
const MUTED = '6B655F'    // warm grey — captions, secondary
const RULE = 'E3DFDA'     // hairline
const SOFT = 'F7F5F3'     // card tint

const SERIF = 'Cambria'
const SANS = 'Calibri'
const MONO = 'Courier New' // motif: every figure is set in monospace

const M = 0.6              // side margin
const W = 10 - M * 2       // content width = 8.8

let slideNo = 0
let section = ''

// Motif furniture: section tag + slide number, bottom corners, monospace.
function furniture(s, dark) {
  slideNo += 1
  const col = dark ? '6E6259' : MUTED
  s.addText(section.toUpperCase(), {
    x: M, y: 5.16, w: 6, h: 0.25, isTextBox: true, margin: 0,
    fontFace: MONO, fontSize: 8, color: col, charSpacing: 1.2,
  })
  s.addText(String(slideNo), {
    x: 10 - M - 0.6, y: 5.16, w: 0.6, h: 0.25, isTextBox: true, margin: 0,
    fontFace: MONO, fontSize: 8, color: col, align: 'right',
  })
}

function content(title, kicker) {
  const s = pres.addSlide()
  s.background = { color: PAPER }
  if (kicker) {
    s.addText(kicker, {
      x: M, y: 0.36, w: W, h: 0.24, isTextBox: true, margin: 0,
      fontFace: MONO, fontSize: 9, color: ACCENT, charSpacing: 1.4,
    })
  }
  // Room for two lines: a wrapped title must still clear content starting at 1.65.
  s.addText(title, {
    x: M, y: kicker ? 0.62 : 0.46, w: W, h: 1.0, isTextBox: true, margin: 0,
    fontFace: SERIF, fontSize: 29, bold: true, color: INK, lineSpacing: 32,
  })
  furniture(s, false)
  return s
}

function divider(num, title, sub) {
  section = title
  const s = pres.addSlide()
  s.background = { color: INK }
  s.addText(num, {
    x: M, y: 1.5, w: 2, h: 1.2, isTextBox: true, margin: 0,
    fontFace: MONO, fontSize: 54, color: ACCENT,
  })
  s.addText(title, {
    x: M, y: 2.6, w: W, h: 0.9, isTextBox: true, margin: 0,
    fontFace: SERIF, fontSize: 34, bold: true, color: PAPER,
  })
  if (sub) {
    s.addText(sub, {
      x: M, y: 3.5, w: W - 1.5, h: 0.6, isTextBox: true, margin: 0,
      fontFace: SANS, fontSize: 14, color: '9A8F86', lineSpacing: 20,
    })
  }
  furniture(s, true)
  return s
}

// A large claim, set to be read from the back of the room.
function statement(text, foot) {
  const s = pres.addSlide()
  s.background = { color: INK }
  s.addText(text, {
    x: M, y: 1.5, w: W, h: 2.2, isTextBox: true, margin: 0,
    fontFace: SERIF, fontSize: 30, color: PAPER, lineSpacing: 38,
  })
  if (foot) {
    s.addText(foot, {
      x: M, y: 3.9, w: W, h: 0.7, isTextBox: true, margin: 0,
      fontFace: SANS, fontSize: 13, color: '9A8F86', lineSpacing: 19,
    })
  }
  furniture(s, true)
  return s
}

// Body text block
function body(s, lines, opt = {}) {
  const x = opt.x ?? M, y = opt.y ?? 1.65, w = opt.w ?? W
  // pptxgenjs requires every array item to be {text, options}; plain strings
  // become their own paragraph.
  const norm = Array.isArray(lines)
    ? lines.map((l, i) => (typeof l === 'string'
      ? { text: l, options: i < lines.length - 1 ? { breakLine: true } : {} }
      : l))
    : lines
  // Never let the default height run past the footer band.
  const h = opt.h ?? Math.min(2.9, 5.05 - y)
  s.addText(norm, {
    x, y, w, h, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: opt.fontSize ?? 14, color: opt.color ?? INK,
    lineSpacing: opt.lineSpacing ?? 22, paraSpaceAfter: opt.paraSpaceAfter ?? 8,
    valign: 'top',
  })
}

// Cards: n tinted blocks across the width. No edge stripes.
function cards(s, items, opt = {}) {
  const y = opt.y ?? 1.8
  const h = opt.h ?? 2.5
  const gap = 0.3
  const n = items.length
  const w = (W - gap * (n - 1)) / n
  items.forEach((it, i) => {
    const x = M + i * (w + gap)
    s.addShape(pres.ShapeType.roundRect, {
      x, y, w, h, rectRadius: 0.06,
      fill: { color: it.fill ?? SOFT }, line: { color: RULE, width: 0.75 },
    })
    s.addText(it.head, {
      x: x + 0.22, y: y + 0.22, w: w - 0.44, h: 0.42, isTextBox: true, margin: 0,
      fontFace: SERIF, fontSize: 15, bold: true, color: it.headColor ?? ACCENT,
    })
    s.addText(it.text, {
      x: x + 0.22, y: y + 0.66, w: w - 0.44, h: h - 0.88, isTextBox: true, margin: 0,
      fontFace: SANS, fontSize: opt.fontSize ?? 12, color: INK, lineSpacing: 17, valign: 'top',
    })
  })
}

// Big figure + label, for the stat moments.
function stat(s, x, y, w, figure, label, opt = {}) {
  s.addText(figure, {
    x, y, w, h: 0.75, isTextBox: true, margin: 0,
    fontFace: MONO, fontSize: opt.figSize ?? 34, bold: true, color: ACCENT,
  })
  s.addText(label, {
    x, y: y + 0.72, w, h: opt.labelH ?? 0.8, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 12, color: MUTED, lineSpacing: 16,
  })
}

// Simple 2-column table, monospace right column for figures.
function table(s, rows, opt = {}) {
  s.addTable(rows, {
    x: opt.x ?? M, y: opt.y ?? 1.8, w: opt.w ?? W,
    colW: opt.colW,
    border: { type: 'solid', color: RULE, pt: 0.75 },
    fontFace: SANS, fontSize: opt.fontSize ?? 12.5, color: INK,
    rowH: opt.rowH ?? 0.32, valign: 'middle',
    margin: [0.06, 0.12, 0.06, 0.12],
  })
}

const H = (t) => ({ text: t, options: { bold: true, color: INK, fill: { color: SOFT }, fontFace: SANS } })
const N = (t) => ({ text: t, options: { fontFace: MONO, align: 'right' } })

module.exports = {
  pres, content, divider, statement, body, cards, stat, table, H, N,
  INK, PAPER, ACCENT, MUTED, RULE, SOFT, SERIF, SANS, MONO, M, W,
  setSection: (x) => { section = x },
}
