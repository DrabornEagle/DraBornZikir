"""Rebuild DraBornZikir v0.2 icon assets with a crescent + tasbih theme."""
from PIL import Image, ImageDraw, ImageFilter
from math import cos, sin, pi
from pathlib import Path

ASSETS = Path(__file__).resolve().parent.parent / 'assets'
SIZE = 1024
SCALE = 2
N = SIZE * SCALE

def rgba(hex_color, alpha=255):
    return tuple(bytes.fromhex(hex_color.lstrip('#'))) + (alpha,)

def render(transparent=False, monochrome=False):
    image = Image.new('RGBA', (N, N), (0, 0, 0, 0) if transparent else rgba('#071827'))
    if not transparent:
        pixels = image.load()
        for y in range(N):
            for x in range(N):
                radius = ((x - N * .50) ** 2 + (y - N * .38) ** 2) ** .5 / N
                hue = max(0, min(1, 1 - radius))
                pixels[x, y] = (round(6 + hue * 8), round(20 + hue * 42), round(32 + hue * 54), 255)
    base = image.copy()
    draw = ImageDraw.Draw(image)
    cx, cy = N // 2, N // 2 - 60
    gold = '#FFFFFF' if monochrome else '#F5D69E'
    teal = '#FFFFFF' if monochrome else '#56DDC4'

    glow = Image.new('RGBA', (N, N), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((cx-390, cy-390, cx+390, cy+390), fill=rgba(teal, 55))
    glow = glow.filter(ImageFilter.GaussianBlur(95))
    image.alpha_composite(glow)
    draw = ImageDraw.Draw(image)

    for radius, width, alpha in [(350, 8, 80), (300, 4, 150)]:
        draw.ellipse((cx-radius, cy-radius, cx+radius, cy+radius), outline=rgba(teal, alpha), width=width)

    moon_x, moon_y = cx - 35, cy - 35
    draw.ellipse((moon_x-170, moon_y-170, moon_x+170, moon_y+170), fill=rgba(gold))
    mask = Image.new('L', (N, N), 0)
    md = ImageDraw.Draw(mask)
    md.ellipse((moon_x-45, moon_y-215, moon_x+235, moon_y+75), fill=255)
    image.paste(base, (0, 0), mask)
    draw = ImageDraw.Draw(image)

    # Tasbih arc: 21 polished beads and a small tassel.
    bead_center_x, bead_center_y = cx + 40, cy + 250
    for idx in range(21):
        angle = pi * (0.08 + 0.84 * idx / 20)
        px = bead_center_x + int(cos(angle) * 285)
        py = bead_center_y + int(sin(angle) * 128)
        bead_r = 21 if idx in (0, 20) else 17
        draw.ellipse((px-bead_r, py-bead_r, px+bead_r, py+bead_r), fill=rgba(gold), outline=rgba(teal, 185), width=4)
        draw.ellipse((px-6, py-7, px+2, py+1), fill=rgba('#FFFFFF', 120))
    tassel_x, tassel_y = bead_center_x - 285, bead_center_y + 12
    draw.line((tassel_x, tassel_y, tassel_x-55, tassel_y+85), fill=rgba(gold), width=12)
    for offset in (-18, 0, 18):
        draw.line((tassel_x-55, tassel_y+82, tassel_x-78+offset, tassel_y+145), fill=rgba(gold), width=8)

    for idx in range(7):
        angle = idx * (2 * pi / 7) - pi / 2
        px = cx + int(cos(angle) * 360)
        py = cy + int(sin(angle) * 360)
        r = 13 if idx % 2 == 0 else 9
        draw.ellipse((px-r, py-r, px+r, py+r), fill=rgba(teal, 210))

    return image.resize((SIZE, SIZE), Image.Resampling.LANCZOS)

if __name__ == '__main__':
    ASSETS.mkdir(exist_ok=True)
    render().save(ASSETS / 'icon.png')
    render(transparent=True).save(ASSETS / 'android-icon-foreground.png')
    render(transparent=True, monochrome=True).save(ASSETS / 'android-icon-monochrome.png')
    render(transparent=True).resize((512, 512), Image.Resampling.LANCZOS).save(ASSETS / 'splash-icon.png')
    render().resize((96, 96), Image.Resampling.LANCZOS).save(ASSETS / 'favicon.png')
