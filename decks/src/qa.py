"""Geometric and structural QA for the deck.

LibreOffice cannot render in this sandbox, so instead of eyeballing images we
measure every shape.

Checks:
  1. every slide has exactly two shapes, both text boxes (title + body)
  2. one uniform theme — same fonts, same sizes, same colour everywhere
  3. text overflowing its own box (estimated from font metrics)
  4. anything crossing the slide edge or sitting inside the margin
"""
import sys
from collections import Counter
from pptx import Presentation

EMU = 914400.0
SLIDE_W, SLIDE_H = 10.0, 5.625
MARGIN = 0.5

TITLE_PT, BODY_PT = 28.0, 14.0
FONT = 'Calibri'

# Average glyph width as a fraction of font size.
WIDTH_FACTOR = 0.47
# Single line spacing: line box is ~1.22x the point size.
LINE_FACTOR = 1.22


def paragraphs(shape):
    out = []
    for p in shape.text_frame.paragraphs:
        text = ''.join(r.text for r in p.runs)
        size = next((r.font.size.pt for r in p.runs if r.font.size), None)
        face = next((r.font.name for r in p.runs if r.font.name), None)
        bullet = 'buChar' in p._p.xml or 'buAutoNum' in p._p.xml
        out.append((text, size or BODY_PT, face or FONT, bullet))
    return out


def est_height(shape, w_in):
    """Estimated rendered height of a text frame, in inches."""
    total = 0.0
    for text, size, face, bullet in paragraphs(shape):
        if not text.strip():
            total += size * LINE_FACTOR / 72.0
            continue
        usable = w_in - (0.25 if bullet else 0.0)  # bullet indent
        cw = size * WIDTH_FACTOR / 72.0
        per_line = max(1, int(usable / cw))
        n = 0
        for hard in text.split('\n'):
            n += max(1, -(-len(hard) // per_line))
        total += n * size * LINE_FACTOR / 72.0
    return total


def main(path):
    prs = Presentation(path)
    problems = []
    fonts, sizes, colors = Counter(), Counter(), Counter()

    for idx, slide in enumerate(prs.slides, start=1):
        shapes = list(slide.shapes)

        if len(shapes) != 2:
            problems.append(f'  s{idx}: SHAPE COUNT {len(shapes)}, expected 2 (title + body)')
        for sh in shapes:
            if not sh.has_text_frame:
                problems.append(f'  s{idx}: NON-TEXT SHAPE {sh.shape_type}')

        for n, sh in enumerate(shapes):
            if not sh.has_text_frame:
                continue
            x, y = sh.left / EMU, sh.top / EMU
            w, h = (sh.width or 0) / EMU, (sh.height or 0) / EMU

            label = sh.text_frame.text[:40].replace('\n', ' ')
            for _, size, face, _ in paragraphs(sh):
                fonts[face] += 1
                sizes[size] += 1
            for p in sh.text_frame.paragraphs:
                for r in p.runs:
                    try:
                        colors[str(r.font.color.rgb)] += 1
                    except (AttributeError, TypeError):
                        pass

            if x < -0.01 or y < -0.01 or x + w > SLIDE_W + 0.01 or y + h > SLIDE_H + 0.01:
                problems.append(f'  s{idx}: OFF-SLIDE  x={x:.2f} y={y:.2f} w={w:.2f} h={h:.2f}  [{label}]')
            elif x < MARGIN - 0.11 or x + w > SLIDE_W - MARGIN + 0.11:
                problems.append(f'  s{idx}: SIDE MARGIN  x={x:.2f} .. {x + w:.2f}  [{label}]')

            if sh.text_frame.text.strip():
                eh = est_height(sh, w)
                if eh > h + 0.10:
                    problems.append(f'  s{idx}: OVERFLOW  needs ~{eh:.2f}" has {h:.2f}"  [{label}]')

    print(f'{len(prs.slides)} slides checked')
    print(f'fonts:  {dict(fonts)}')
    print(f'sizes:  {dict(sizes)}')
    print(f'colors: {dict(colors)}')
    if set(fonts) != {FONT}:
        problems.append(f'  THEME: more than one font family: {dict(fonts)}')
    if set(sizes) - {TITLE_PT, BODY_PT}:
        problems.append(f'  THEME: unexpected font sizes: {dict(sizes)}')
    if len(colors) > 1:
        problems.append(f'  THEME: more than one text colour: {dict(colors)}')

    if problems:
        print(f'{len(problems)} issue(s):')
        for p in problems:
            print(p)
    else:
        print('no issues')
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1]))
