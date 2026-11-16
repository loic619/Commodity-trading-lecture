import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '05-technical-perspective',
  title: 'The Technical Perspective',
  type: 'lecture',
  estimatedMinutes: 20,
  sections: [
    {
      id: 'premises',
      title: 'What Technical Analysis Assumes',
      body: `> "The study of market action, primarily through the use of charts, for the purpose of forecasting future price trends." — John Murphy\n\nIt rests on three premises:\n\n1. **All known fundamentals are already discounted** in the price\n2. **Prices move in trends**, and trends persist\n3. **Market action is repetitive** — because it reflects crowd psychology\n\nIt doesn't replace fundamentals; it's a second lens. A **weekly** chart holds more information per bar than a daily — a stronger signal that takes longer to form.`,
    },
    {
      id: 'dow',
      title: 'Dow Theory',
      body: `**Charles Dow** (Wall Street Journal, 1890s) laid the foundations:\n\n- **Averages discount everything**\n- The market has **three trends**: Primary, Secondary, Minor\n- A major trend has **three phases**: Accumulation → Public Participation → Distribution\n- **Averages must confirm each other**, and **volume must confirm the trend**\n- A trend continues **until there are definite signals it has reversed**\n\nThat last rule — don't call the reversal early — is the spine of trend trading.\n\nThe three phases are a shape, so the diagram below draws them on one idealised bull market. The labels that matter are not the prices but **who is on each side of the trade**: informed money accumulating from discouraged holders at the bottom, and distributing to the newly enthusiastic at the top. Dow's framework is really about crowd psychology, and the chart is just where you can see it.`,
      visual: 'dow-phases',
    },
    {
      id: 'trend-support',
      title: 'Trend Lines, Support & Resistance',
      body: `Two of the most useful chart tools:\n\n- A **trend line** connects three rising lows (uptrend) or falling highs (downtrend). Trade *with* the trend; a clean **break** of the line is the signal it may be over.\n- **Support and resistance** are price levels the market repeatedly respects. The key idea: once a **resistance** level is broken, it tends to become **support** on the way back down (and vice-versa).`,
      visual: 'technical-schematics',
    },
    {
      id: 'ma-fib',
      title: 'Moving Averages & Fibonacci',
      body: `**Moving averages** smooth price to reveal the trend and flag when it breaks. Traders often use **Fibonacci** periods — 21, 34, 55 days — stacked to read momentum (price above a rising ribbon = bullish).\n\n**Fibonacci retracements** gauge how far a counter-trend pullback might run. A market typically corrects around **50%** of a move, with the **38.2%** and **61.8%** ratios bracketing it. The ratios come from the Fibonacci series — 1, 1, 2, 3, 5, 8, 13, 21, 34, 55… — where each number divided by the next approaches 0.618.\n\nDrag the two swing points below and watch every level move with them. That is the honest caveat worth stating in class: two analysts picking different swings get different \"levels\" from the same chart. These are a framework for planning an entry, not a forecast — and they work partly because enough people watch them for the orders to actually be there.`,
      visual: 'fibonacci-ribbon',
    },
    {
      id: 'pvoi',
      title: 'Price, Volume & Open Interest',
      body: `Price alone can mislead. **Volume** and **open interest** confirm — or undermine — what price is doing. The classic reading:`,
      visual: 'price-volume-oi',
    },
  ],
}

export default topic
