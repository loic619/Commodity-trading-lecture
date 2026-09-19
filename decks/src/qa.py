"""Geometric QA for the deck: LibreOffice cannot render in this sandbox, so
instead of eyeballing images we measure every shape.

Checks, in the order the pptx skill lists them as most user-visible:
  1. text overflowing its own box (estimated from font metrics)
  2. anything crossing the slide edge / inside the margin
  3. overlapping text boxes
"""
import sys
from pptx import Presentation
from pptx.util import Emu

EMU = 914400.0
SLIDE_W, SLIDE_H = 10.0, 5.625
MARGIN = 0.5           # skill: 0.5" minimum
BOTTOM_FURNITURE = 5.1  # our own footer band, allowed below the margin

# Average glyph width as a fraction of font size, per family.
WIDTH_FACTOR = {
    'Courier New': 0.60,
    'Cambria': 0.50,
    'Calibri': 0.47,
}


def runs(shape):
    if not shape.has_text_frame:
        return []
    out = []
    for p in shape.text_frame.paragraphs:
        text = ''.join(r.text for r in p.runs)
        size = None
        face = None
        for r in p.runs:
            if r.font.size:
                size = r.font.size.pt
            if r.font.name:
                face = r.font.name
        out.append((text, size or 14.0, face or 'Calibri'))
    return out


def est_height(shape, w_in):
    """Estimated rendered height of a text frame, in inches."""
    total = 0.0
    for text, size, face in runs(shape):
        if not text.strip():
            total += size * 1.25 / 72.0
            continue
        cw = size * WIDTH_FACTOR.get(face, 0.48) / 72.0
        per_line = max(1, int(w_in / cw))
        lines = 0
        for hard in text.split('\n'):
            lines += max(1, -(-len(hard) // per_line))
        total += lines * size * 1.32 / 72.0
    return total


def main(path):
    prs = Presentation(path)
    problems = []
    for idx, slide in enumerate(prs.slides, start=1):
        boxes = []
        for sh in slide.shapes:
            if sh.left is None or sh.top is None:
                continue
            x, y = sh.left / EMU, sh.top / EMU
            w, h = (sh.width or 0) / EMU, (sh.height or 0) / EMU
            name = (sh.text_frame.text[:42].replace('\n', ' ') if sh.has_text_frame and sh.text_frame.text
                    else sh.shape_type)

            # 2. edges and margins
            if x < -0.01 or y < -0.01 or x + w > SLIDE_W + 0.01 or y + h > SLIDE_H + 0.01:
                problems.append(f'  s{idx}: OFF-SLIDE  x={x:.2f} y={y:.2f} w={w:.2f} h={h:.2f}  [{name}]')
            elif x < MARGIN - 0.11 or x + w > SLIDE_W - MARGIN + 0.11:
                problems.append(f'  s{idx}: SIDE MARGIN  x={x:.2f} .. {x+w:.2f}  [{name}]')

            if sh.has_text_frame and sh.text_frame.text.strip():
                eh = est_height(sh, max(w - 0.1, 0.4))
                if eh > h + 0.14:
                    problems.append(
                        f'  s{idx}: OVERFLOW  needs ~{eh:.2f}" has {h:.2f}"  [{name}]')
                boxes.append((x, y, w, h, name, eh))

        # 3. overlapping text boxes (ignore tiny slivers)
        for i in range(len(boxes)):
            for j in range(i + 1, len(boxes)):
                a, b = boxes[i], boxes[j]
                ox = min(a[0] + a[2], b[0] + b[2]) - max(a[0], b[0])
                oy = min(a[1] + a[3], b[1] + b[3]) - max(a[1], b[1])
                if ox > 0.12 and oy > 0.12:
                    problems.append(
                        f'  s{idx}: OVERLAP {ox:.2f}x{oy:.2f}"  [{a[4]}] / [{b[4]}]')

    print(f'{len(prs.slides)} slides checked')
    if problems:
        print(f'{len(problems)} issue(s):')
        for p in problems:
            print(p)
    else:
        print('no geometry issues')
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1]))
