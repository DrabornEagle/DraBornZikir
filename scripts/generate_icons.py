"""Rebuild the DraBornZikir app icons with Pillow (developer utility)."""
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
                radius = ((x - N * .55) ** 2 + (y - N * .38) ** 2) ** .5 / N
                hue = max(0, min(1, 1 - radius))
                pixels[x, y] = (round(6 + hue * 10), round(21 + hue * 53), round(34 + hue * 64), 255)
    background = image.copy()
    draw = ImageDraw.Draw(image)
    cx, cy = N // 2, N // 2
    color = '#FFFFFF' if monochrome else '#F5D69E'
    soft = '#FFFFFF' if monochrome else '#56DDC4'
    for radius, width, alpha in [(315, 5, 90), (278, 3, 175)]:
        draw.ellipse((cx-radius, cy-radius, cx+radius, cy+radius), outline=rgba(soft, alpha), width=width)
    for offset in range(8):
        theta = offset * pi / 4
        px = cx + int(cos(theta) * 300)
        py = cy + int(sin(theta) * 300)
        star = []
        for part in range(8):
            a = part * pi / 4
            r = 19 if part % 2 == 0 else 7
            star.append((px + r * cos(a), py + r * sin(a)))
        draw.polygon(star, fill=rgba(color, 205))
    moon_center_x, moon_center_y = cx - 22, cy - 18
    draw.ellipse((moon_center_x-158, moon_center_y-158, moon_center_x+158, moon_center_y+158), fill=rgba(color))
    mask = Image.new('L', (N, N), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse((moon_center_x-52, moon_center_y-197, moon_center_x+216, moon_center_y+80), fill=255)
    image.paste(background, (0, 0), mask)
    draw = ImageDraw.Draw(image)
    points = []
    for part in range(16):
        a = part * pi / 8 - pi / 2
        r = 45 if part % 2 == 0 else 19
        points.append((cx + 171 + r * cos(a), cy - 157 + r * sin(a)))
    draw.polygon(points, fill=rgba(soft))
    return image.resize((SIZE, SIZE), Image.Resampling.LANCZOS)

if __name__ == '__main__':
    render().save(ASSETS / 'icon.png')
    render(transparent=True).save(ASSETS / 'android-icon-foreground.png')
    render(transparent=True, monochrome=True).save(ASSETS / 'android-icon-monochrome.png')
    render(transparent=True).resize((512, 512), Image.Resampling.LANCZOS).save(ASSETS / 'splash-icon.png')
    render().resize((96, 96), Image.Resampling.LANCZOS).save(ASSETS / 'favicon.png')
