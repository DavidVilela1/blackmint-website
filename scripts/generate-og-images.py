"""
Generate the localized Open Graph images (1200×630) in public/og/.
Usage: python3 scripts/generate-og-images.py <anton.woff|ttf> <patrick-hand.woff|ttf>
(Font files: the latin .woff from @fontsource/anton and @fontsource/patrick-hand.)
"""
import sys
from PIL import Image, ImageDraw, ImageFont
import numpy as np

anton = ImageFont.truetype(sys.argv[1], 112)
hand = ImageFont.truetype(sys.argv[2], 42)
hero = Image.open('assets/art/hero-composite.jpg').convert('RGB')
lock = Image.open('assets/brand-kit/logo-lockup.png')


def og(lines, sub, out):
    W, H = 1200, 630
    bg = hero.resize((1280, 720), Image.LANCZOS).crop((40, 60, 1240, 690))
    a = np.array(bg).astype(float) * np.clip(np.linspace(0.35, 1, W)[None, :, None] * 1.1, 0, 1)
    im = Image.fromarray(a.clip(0, 255).astype(np.uint8))
    d = ImageDraw.Draw(im)
    logo = lock.resize((480, int(lock.height * 480 / lock.width)), Image.LANCZOS)
    im.paste(logo, (60, 52), logo)
    y = 262
    for t in lines:
        d.text((64, y), t, font=anton, fill=(232, 227, 216))
        y += 116
    d.text((70, y + 14), sub, font=hand, fill=(95, 222, 163))
    d.rectangle([18, 18, W - 19, H - 19], outline=(232, 227, 216), width=2)
    im.save(out, quality=86, optimize=True, progressive=True)


og(['SMALL TEAM.', 'BIG WORLDS.'], 'Indie games for curious people.', 'public/og/og-default-en.jpg')
og(['EQUIPA PEQUENA.', 'MUNDOS GRANDES.'], 'Jogos indie para pessoas curiosas.', 'public/og/og-default-pt-pt.jpg')
