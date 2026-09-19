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

## Rebuilding

The `.pptx` is generated, so edit the source and regenerate rather than editing
the slides by hand.

```bash
npm install pptxgenjs        # not a project dependency; install ad hoc
node decks/src/slides2.js    # writes decks/Commodity-Trading-Module-1.pptx
python3 decks/src/qa.py decks/Commodity-Trading-Module-1.pptx
```

- `src/build.js` — palette, type scale and the layout helpers
- `src/slides.js` — title slide, sections 01–02
- `src/slides2.js` — sections 03–07, close, and the write call
- `src/qa.py` — measures every shape for text overflow, margin breaches and
  overlaps (a stand-in for eyeballing rendered images)
