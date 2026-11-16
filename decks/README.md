# Lecture decks

Slides for the in-room performance. The web app is the interactive support;
these are what goes on the projector.

| File | Course |
|---|---|
| `Commodity-Trading-Module-1.pptx` | Commodity Trading — Module 1, Panorama and vocabulary |

The deck covers the lecture content only. The exercises (futures screen, the
day-one inbox, the arbitrage and cash-and-carry simulators, the checkpoint
quiz) stay in the web app.

Every slide carries speaker notes — cues and questions to ask the room, not a
script to read.

## House rules

These are enforced by `src/qa.py`, not just conventions:

- exactly two shapes per slide — one title, one body — and nothing else
- no header, no footer, no slide numbers, no charts, no tables, no shapes
- one uniform theme: white background, Calibri throughout, one text colour
- title 28pt bold, body 14pt, single-spaced, no paragraph spacing

Anything that would have been a chart or a table is written out as text in the
body.

## Rebuilding

The `.pptx` is generated, so edit the source and regenerate rather than editing
the slides by hand.

```bash
npm install pptxgenjs --no-save   # not a project dependency; install ad hoc
node decks/src/deck.js            # writes decks/Commodity-Trading-Module-1.pptx
python3 decks/src/qa.py decks/Commodity-Trading-Module-1.pptx
```

- `src/deck.js` — the whole deck: layout constants at the top, then the slides
- `src/qa.py` — checks the house rules above, plus text overflow and margins
  (a stand-in for eyeballing rendered images)
