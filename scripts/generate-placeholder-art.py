"""
BlackMint Interactive — procedural placeholder art generator.

Produces ORIGINAL, replaceable atmospheric artwork (no third-party art) in the
BlackMint visual language: charcoal monochrome, rough edges, grain, selective mint.

Usage: python3 scripts/generate-placeholder-art.py assets/brand-source public
Requires: Python 3.10+, numpy, Pillow.
"""
import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

BRAND = sys.argv[1]
OUT = sys.argv[2]

OBSIDIAN = np.array([9, 10, 9], float)
CHAR = np.array([21, 22, 21], float)
OFF = np.array([232, 226, 214], float)
MINT = np.array([95, 222, 163], float)
GREY = np.array([119, 120, 115], float)


def rng(seed):
    return np.random.default_rng(seed)


def mkdir(p):
    os.makedirs(p, exist_ok=True)


def fractal_line(n, rough, seed, octaves=7):
    r = rng(seed)
    y = np.zeros(n)
    amp = 1.0
    for o in range(octaves):
        k = 2 ** (o + 1)
        pts = r.uniform(-1, 1, k + 1)
        xs = np.linspace(0, n - 1, k + 1)
        y += np.interp(np.arange(n), xs, pts) * amp
        amp *= rough
    return y


def value_noise(w, h, scale, seed, octaves=4):
    r = rng(seed)
    out = np.zeros((h, w))
    amp = 1.0
    tot = 0
    for o in range(octaves):
        s = max(2, int(scale / (2 ** o)))
        gw, gh = w // s + 2, h // s + 2
        g = r.random((gh, gw))
        im = Image.fromarray((g * 255).astype(np.uint8)).resize((gw * s, gh * s), Image.BICUBIC)
        out += np.array(im)[:h, :w] / 255 * amp
        tot += amp
        amp *= 0.5
    return out / tot


def grain(w, h, seed, strength=18):
    return rng(seed).normal(0, strength, (h, w))


def streaks(w, h, seed, length=40, angle=0):
    """directional charcoal streak texture"""
    n = rng(seed).random((h, w))
    im = Image.fromarray((n * 255).astype(np.uint8))
    im = im.resize((w // 2, h // 2)).resize((w, h))
    im = im.filter(ImageFilter.BoxBlur(1))
    a = np.array(im).astype(float) / 255
    # horizontal smear
    k = np.ones(length) / length
    a = np.apply_along_axis(lambda r: np.convolve(r, k, mode="same"), 1, a)
    return (a - a.mean()) * 4


def ridge_mask(w, h, base, amp, rough, seed, jag=2.0):
    line = fractal_line(w, rough, seed)
    line = (line - line.min()) / (line.max() - line.min() + 1e-9)
    edge = base - line * amp
    edge += rng(seed + 9).normal(0, jag, w)  # rough brush edge
    ys = np.arange(h)[:, None]
    m = (ys >= edge[None, :]).astype(float)
    return m, edge


def compose(layers, w, h):
    canvas = np.zeros((h, w, 3))
    for col, alpha in layers:
        canvas = canvas * (1 - alpha[..., None]) + col * alpha[..., None]
    return canvas


def save_rgb(arr, path, q=84):
    mkdir(os.path.dirname(path))
    im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")
    if path.endswith(".jpg"):
        im.save(path, quality=q, optimize=True, progressive=True)
    else:
        im.save(path, quality=q, method=6)
    print("wrote", path, im.size)


def save_rgba(rgb, alpha, path, q=82):
    mkdir(os.path.dirname(path))
    a = np.dstack([np.clip(rgb, 0, 255), np.clip(alpha * 255, 0, 255)]).astype(np.uint8)
    Image.fromarray(a, "RGBA").save(path, quality=q, method=6)
    print("wrote", path)


def vignette(w, h, power=1.6, strength=0.75):
    ys, xs = np.mgrid[0:h, 0:w]
    d = np.sqrt(((xs - w / 2) / (w / 2)) ** 2 + ((ys - h / 2) / (h / 2)) ** 2) / math.sqrt(2)
    return 1 - strength * d ** power


def disc(w, h, cx, cy, r, soft=1.5):
    ys, xs = np.mgrid[0:h, 0:w]
    d = np.sqrt((xs - cx) ** 2 + (ys - cy) ** 2)
    return np.clip((r - d) / soft, 0, 1), d


def castle(draw, x, y, s, fill):
    """hand-ish castle silhouette anchored at bottom-centre (x,y), scale s"""
    def rect(x0, y0, x1, y1):
        draw.rectangle([x + x0 * s, y - y1 * s, x + x1 * s, y - y0 * s], fill=fill)

    def crenel(x0, x1, top):
        n = max(2, int((x1 - x0) / 6))
        wd = (x1 - x0) / (2 * n - 1)
        for i in range(n):
            rect(x0 + i * 2 * wd, top, x0 + i * 2 * wd + wd, top + 4)

    rect(-86, -70, 88, 0)  # foundation buried in the hill
    rect(-60, 0, 60, 38); crenel(-60, 60, 38)
    rect(-20, 0, 10, 92); crenel(-20, 10, 92)
    rect(-48, 0, -30, 70); crenel(-48, -30, 70)
    rect(25, 0, 44, 64); crenel(25, 44, 64)
    rect(-8, 92, -2, 112)  # spire
    draw.polygon([(x - 26 * s, y - 92 * s), (x - 5 * s, y - 128 * s), (x + 16 * s, y - 92 * s)], fill=fill)
    draw.polygon([(x - 52 * s, y - 70 * s), (x - 39 * s, y - 96 * s), (x - 26 * s, y - 70 * s)], fill=fill)
    rect(-80, 0, -60, 24); rect(60, 0, 82, 30); crenel(60, 82, 30)


def wanderer(draw, x, y, s, fill):
    pts = [(0, 0), (3, -18), (2, -30), (6, -40), (4, -46), (9, -56), (12, -46), (13, -40), (18, -34), (19, -20), (14, -18), (15, 0), (11, 0), (10, -14), (6, -14), (5, 0)]
    draw.polygon([(x + px * s, y + py * s) for px, py in pts], fill=fill)
    draw.ellipse([x + 13 * s, y - 40 * s, x + 25 * s, y - 22 * s], fill=fill)  # pack
    draw.line([(x + 1 * s, y - 28 * s), (x - 6 * s, y + 2 * s)], fill=fill, width=max(1, int(1.6 * s)))  # staff


def hero_scene(w, h, seed=7, out_prefix=None, mint_window=True, figure=True):
    r = rng(seed)
    # sky
    ys = np.linspace(0, 1, h)[:, None]
    sky = (CHAR * 0.55 + OBSIDIAN * 0.45)[None, None, :] * np.ones((h, w, 1))
    sky = sky + (ys[..., None] * np.array([10, 11, 10]))
    sky += value_noise(w, h, 260, seed)[..., None] * 18 - 9
    # moon
    mx, my, mr = w * 0.63, h * 0.40, h * 0.22
    ma, md = disc(w, h, mx, my, mr, soft=2.5)
    glow = np.exp(-((md - mr).clip(0)) / (h * 0.10)) * 0.32
    moon_tex = value_noise(w, h, 60, seed + 1, 5)
    moon_col = OFF[None, None, :] * (0.86 + 0.16 * moon_tex[..., None])
    sky = sky + glow[..., None] * np.array([150, 150, 140])
    sky = sky * (1 - ma[..., None]) + moon_col * ma[..., None]
    sky += streaks(w, h, seed + 2, 60)[..., None] * 6
    layers = {"sky": sky.copy()}

    # far ridge
    far_m, far_e = ridge_mask(w, h, h * 0.70, h * 0.28, 0.58, seed + 3, 1.2)
    far_col = np.array([46, 48, 46]) + value_noise(w, h, 90, seed + 4)[..., None] * 18
    # mid ridge with castle peak
    mid_m, mid_e = ridge_mask(w, h, h * 0.86, h * 0.30, 0.55, seed + 5, 1.8)
    peak_x = int(w * 0.70)
    mid_img = Image.fromarray((mid_m * 255).astype(np.uint8))
    d = ImageDraw.Draw(mid_img)
    castle(d, peak_x, int(mid_e[peak_x]) + 6, h / 520, 255)
    mid_m = np.array(mid_img).astype(float) / 255
    mid_col = np.array([28, 29, 28]) + value_noise(w, h, 70, seed + 6)[..., None] * 14
    # fog between
    fog = np.exp(-((np.arange(h)[:, None] - h * 0.74) / (h * 0.06)) ** 2) * (0.45 + 0.4 * value_noise(w, h, 300, seed + 8))
    # near cliff
    near_m, near_e = ridge_mask(w, h, h * 1.02, h * 0.36, 0.62, seed + 10, 3.0)
    near_img = Image.fromarray((near_m * 255).astype(np.uint8))
    d = ImageDraw.Draw(near_img)
    fx = int(w * 0.30)
    top = int(near_e[fx - 40: fx + 40].min())
    if figure:
        wanderer(d, fx, top + 4, h / 360, 255)
    # grass tufts
    for i in range(int(w / 9)):
        gx = int(r.uniform(0, w))
        gy = int(near_e[min(gx, w - 1)]) + 3
        ln = r.uniform(4, 20) * h / 900
        d.line([(gx, gy), (gx + r.uniform(-6, 6), gy - ln)], fill=255, width=max(1, int(h / 700)))
    near_m = np.array(near_img.filter(ImageFilter.GaussianBlur(0.6))).astype(float) / 255
    near_col = np.array([10, 11, 10]) + value_noise(w, h, 50, seed + 11)[..., None] * 8

    comp = compose([(sky, np.ones((h, w))), (far_col, far_m), (np.array([150, 152, 146]), fog * 0.35), (mid_col, mid_m), (np.array([120, 122, 118]), fog * 0.12 * (1 - mid_m)), (near_col, near_m)], w, h)
    # mint accents: lit window + fireflies
    if mint_window:
        wa, _ = disc(w, h, peak_x - 3 * h / 520, int(mid_e[peak_x]) - 60 * h / 520, 2.6 * h / 520 + 1.5, 1.2)
        wg, wd = disc(w, h, peak_x - 3 * h / 520, int(mid_e[peak_x]) - 60 * h / 520, 1, 1)
        comp = comp * (1 - wa[..., None]) + MINT * wa[..., None]
        comp += np.exp(-wd / (h * 0.012))[..., None] * MINT * 0.35
    for i in range(14):
        sx, sy = r.uniform(0.05, 0.95) * w, r.uniform(0.62, 0.95) * h
        sa, sd = disc(w, h, sx, sy, r.uniform(0.8, 2.2) * h / 900, 1.2)
        comp = comp * (1 - sa[..., None] * 0.9) + MINT * sa[..., None] * 0.9
        comp += np.exp(-sd / (h * 0.006))[..., None] * MINT * 0.18
    comp += grain(w, h, seed + 12, 9)[..., None]
    comp *= vignette(w, h, 1.8, 0.65)[..., None]

    if out_prefix:
        # parallax layers
        save_rgb(layers["sky"] * vignette(w, h, 1.8, 0.5)[..., None] + grain(w, h, 3, 7)[..., None], out_prefix + "-sky.jpg")
        far_rgb = far_col * (1 - fog[..., None] * 0.35) + np.array([150, 152, 146]) * fog[..., None] * 0.35
        save_rgba(far_rgb, np.maximum(far_m, fog * 0.35), out_prefix + "-far.webp")
        midc = mid_col.copy()
        if mint_window:
            midc = midc * (1 - wa[..., None]) + MINT * wa[..., None]
        save_rgba(midc, mid_m, out_prefix + "-mid.webp")
        save_rgba(near_col + grain(w, h, 5, 5)[..., None], near_m, out_prefix + "-near.webp")
    return comp


def signal_scene(w, h, seed=21):
    """'Mint Static' concept: a radio mast on a plain under heavy cloud, mint signal arcs."""
    r = rng(seed)
    ys = np.linspace(0, 1, h)[:, None, None]
    sky = CHAR * (1.15 - ys * 0.6) + value_noise(w, h, 200, seed, 5)[..., None] * 40 - 14
    cloud = value_noise(w, h, 380, seed + 1, 5)
    sky += (cloud[..., None] ** 2) * 70
    sky += np.exp(-((np.arange(h)[:, None] - h * 0.8) / (h * 0.12)) ** 2)[..., None] * np.array([38, 44, 40])
    sky += streaks(w, h, seed + 2, 120)[..., None] * 8
    ground_m, ge = ridge_mask(w, h, h * 0.86, h * 0.07, 0.5, seed + 3, 1.5)
    img = Image.fromarray(np.zeros((h, w), np.uint8))
    d = ImageDraw.Draw(img)
    tx = int(w * 0.62); tb = int(ge[tx]); tt = int(h * 0.34)
    lw = max(3, int(h / 220))
    for side in (-1, 1):
        d.line([(tx + side * h * 0.06, tb), (tx + side * h * 0.008, tt)], fill=255, width=lw)
    steps = 14
    for i in range(steps):
        t0 = i / steps; t1 = (i + 1) / steps
        y0 = tb + (tt - tb) * t0; y1 = tb + (tt - tb) * t1
        x0 = h * (0.06 - 0.052 * t0); x1 = h * (0.06 - 0.052 * t1)
        d.line([(tx - x0, y0), (tx + x1, y1)], fill=255, width=max(1, lw - 1))
        d.line([(tx + x0, y0), (tx - x1, y1)], fill=255, width=max(1, lw - 1))
        d.line([(tx - x1, y1), (tx + x1, y1)], fill=255, width=max(1, lw - 1))
    d.line([(tx, tt), (tx, tt - h * 0.05)], fill=255, width=lw)
    # small shack
    sx = int(w * 0.30); sy = int(ge[sx])
    d.rectangle([sx - h * 0.05, sy - h * 0.045, sx + h * 0.05, sy], fill=255)
    d.polygon([(sx - h * 0.058, sy - h * 0.045), (sx, sy - h * 0.08), (sx + h * 0.058, sy - h * 0.045)], fill=255)
    tower = np.array(img).astype(float) / 255
    sil = np.clip(ground_m + tower, 0, 1)
    comp = compose([(sky, np.ones((h, w))), (np.array([12, 13, 12]) + value_noise(w, h, 40, seed + 5)[..., None] * 8, sil)], w, h)
    # grass
    gi = Image.fromarray(np.zeros((h, w), np.uint8)); gd = ImageDraw.Draw(gi)
    for i in range(int(w / 3)):
        gx = r.uniform(0, w); gy = ge[int(min(gx, w - 1))] + r.uniform(0, h * 0.12)
        ln = r.uniform(8, 34) * h / 900
        gd.line([(gx, gy), (gx + r.uniform(-9, 9), gy - ln)], fill=255, width=max(1, int(h / 600)))
    gm = np.array(gi).astype(float) / 255
    comp = comp * (1 - gm[..., None]) + np.array([6, 7, 6]) * gm[..., None]
    # signal arcs
    yy, xx = np.mgrid[0:h, 0:w]
    cx, cy = tx, tt - h * 0.05
    dd = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    ang = np.arctan2(yy - cy, xx - cx)
    for k, rad in enumerate([0.07, 0.12, 0.18, 0.25]):
        R = rad * h
        ring = np.exp(-((dd - R) / (h * 0.0028)) ** 2)
        mask = ((np.abs(ang - (-math.pi / 2)) < 0.9) | (np.abs(ang + math.pi / 2) < 0.9)).astype(float)
        brk = (value_noise(w, h, 18, seed + 20 + k, 2) > 0.38).astype(float)
        a = ring * mask * brk * (1 - k * 0.18)
        comp = comp * (1 - a[..., None]) + MINT * a[..., None]
    lamp, ld = disc(w, h, cx, cy, h * 0.006, 1.5)
    comp = comp * (1 - lamp[..., None]) + MINT * lamp[..., None]
    comp += np.exp(-ld / (h * 0.02))[..., None] * MINT * 0.45
    win, wdd = disc(w, h, sx + h * 0.02, sy - h * 0.022, h * 0.008, 1.2)
    comp = comp * (1 - win[..., None]) + MINT * win[..., None] * 0.9
    comp += np.exp(-wdd / (h * 0.015))[..., None] * MINT * 0.2
    comp += grain(w, h, seed + 9, 10)[..., None]
    comp *= vignette(w, h, 1.6, 0.7)[..., None]
    return comp


def paper_scene(w, h, seed=33, crown_path=None):
    """'Paper Kingdom' concept: layered paper-cut hills on warm off-white, ink-drawn village, mint crown."""
    r = rng(seed)
    paper = OFF[None, None, :] * np.ones((h, w, 1)) - value_noise(w, h, 140, seed, 5)[..., None] * 28
    paper += streaks(w, h, seed + 1, 30)[..., None] * 5
    comp = paper
    tones = [np.array([200, 194, 182]), np.array([160, 156, 146]), np.array([110, 108, 102]), np.array([52, 53, 50]), np.array([20, 21, 20])]
    for i, t in enumerate(tones):
        m, e = ridge_mask(w, h, h * (0.48 + i * 0.12), h * (0.16 + i * 0.03), 0.5, seed + 3 + i, 1.0)
        # paper shadow
        sh = np.roll(m, -int(h * 0.006), axis=0) * (1 - m)
        comp = comp * (1 - sh[..., None] * 0.25)
        tex = value_noise(w, h, 80, seed + 30 + i, 3)[..., None] * 12
        comp = comp * (1 - m[..., None]) + (t + tex) * m[..., None]
        if i == 2:
            img = Image.fromarray(np.zeros((h, w), np.uint8)); d = ImageDraw.Draw(img)
            for j in range(9):
                hx = int(w * (0.18 + j * 0.075 + r.uniform(-0.01, 0.01)))
                hy = int(e[min(hx, w - 1)]) + 4
                s = h * r.uniform(0.022, 0.034)
                d.rectangle([hx - s, hy - s, hx + s, hy + 2], fill=255)
                d.polygon([(hx - s * 1.25, hy - s), (hx, hy - s * 2.1), (hx + s * 1.25, hy - s)], fill=255)
            hm = np.array(img).astype(float) / 255
            comp = comp * (1 - hm[..., None]) + np.array([34, 35, 33]) * hm[..., None]
    if crown_path:
        cr = Image.open(crown_path).convert("RGBA")
        cw = int(h * 0.30)
        cr = cr.resize((cw, int(cr.height * cw / cr.width)), Image.LANCZOS)
        a = np.zeros((h, w)); px, py = int(w * 0.58), int(h * 0.10)
        a[py:py + cr.height, px:px + cr.width] = np.array(cr)[..., 3] / 255
        comp = comp * (1 - a[..., None]) + np.array([40, 170, 118]) * a[..., None]
    comp += grain(w, h, seed + 9, 8)[..., None]
    comp *= vignette(w, h, 2.0, 0.45)[..., None]
    return comp


def keyart_from_brand(w, h, crop_box, seed=1):
    im = Image.open(os.path.join(BRAND, "10_key_art_jogo.png")).convert("RGB").crop(crop_box)
    im = im.resize((w, h), Image.LANCZOS).filter(ImageFilter.UnsharpMask(2, 60, 2))
    a = np.array(im).astype(float)
    a += grain(w, h, seed, 9)[..., None]
    return a


def texture_grain(size=256, seed=99):
    n = rng(seed).normal(128, 50, (size, size)).clip(0, 255).astype(np.uint8)
    rgba = np.dstack([n, n, n, np.full_like(n, 255)])
    return Image.fromarray(rgba, "RGBA")


def texture_grunge(w=1600, h=900, seed=5):
    """transparent off-white scratch/dust overlay"""
    r = rng(seed)
    img = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(img)
    for i in range(260):
        x, y = r.uniform(0, w), r.uniform(0, h)
        ln = r.uniform(6, 90); a = r.uniform(-0.4, 0.4) + (math.pi / 2 if r.random() < 0.3 else 0)
        d.line([(x, y), (x + math.cos(a) * ln, y + math.sin(a) * ln)], fill=int(r.uniform(40, 140)), width=1)
    for i in range(1800):
        x, y = r.uniform(0, w), r.uniform(0, h); s = r.uniform(0.5, 2.2)
        d.ellipse([x, y, x + s, y + s], fill=int(r.uniform(60, 200)))
    a = np.array(img.filter(ImageFilter.GaussianBlur(0.4))).astype(float) / 255
    return a


def torn_edge(w=2400, h=120, seed=4):
    """an opaque obsidian torn-paper edge (transparent above)"""
    line = fractal_line(w, 0.62, seed, 9)
    line = (line - line.min()) / (line.max() - line.min())
    edge = h * 0.25 + line * h * 0.55 + rng(seed).normal(0, 1.2, w)
    ys = np.arange(h)[:, None]
    m = np.clip(ys - edge[None, :] + 0.5, 0, 1)
    return m


if __name__ == "__main__":
    pub = OUT
    # hero (2560x1440 composite + parallax layers)
    hero = hero_scene(2560, 1440, 7, out_prefix=os.path.join(pub, "images/hero/hero"))
    save_rgb(hero, os.path.join(pub, "..", "assets", "art", "hero-composite.jpg"))

    # games
    g = os.path.join(pub, "images/games")
    ka = keyart_from_brand(1200, 950, (0, 116, 414, 437))
    save_rgb(ka, f"{g}/hollow-moon/cover.jpg")
    save_rgb(keyart_from_brand(1600, 900, (0, 140, 414, 373), 2), f"{g}/hollow-moon/hero.jpg")
    save_rgb(hero_scene(1600, 900, 41, mint_window=True, figure=False), f"{g}/hollow-moon/gallery-01.jpg")
    save_rgb(hero_scene(1600, 900, 77, mint_window=False, figure=True), f"{g}/hollow-moon/gallery-02.jpg")
    save_rgb(keyart_from_brand(1600, 900, (150, 160, 414, 308), 3), f"{g}/hollow-moon/gallery-03.jpg")

    save_rgb(signal_scene(1200, 950, 21), f"{g}/mint-static/cover.jpg")
    save_rgb(signal_scene(1600, 900, 22), f"{g}/mint-static/hero.jpg")
    save_rgb(signal_scene(1600, 900, 23), f"{g}/mint-static/gallery-01.jpg")
    save_rgb(signal_scene(1600, 900, 24), f"{g}/mint-static/gallery-02.jpg")
    save_rgb(signal_scene(1600, 900, 25), f"{g}/mint-static/gallery-03.jpg")

    crown = os.path.join(pub, "brand/doodle-crown.png")
    save_rgb(paper_scene(1200, 950, 33, crown), f"{g}/paper-kingdom/cover.jpg")
    save_rgb(paper_scene(1600, 900, 34, crown), f"{g}/paper-kingdom/hero.jpg")
    save_rgb(paper_scene(1600, 900, 35, None), f"{g}/paper-kingdom/gallery-01.jpg")
    save_rgb(paper_scene(1600, 900, 36, crown), f"{g}/paper-kingdom/gallery-02.jpg")
    save_rgb(paper_scene(1600, 900, 37, None), f"{g}/paper-kingdom/gallery-03.jpg")

    # textures
    t = os.path.join(pub, "textures"); mkdir(t)
    texture_grain().save(f"{t}/grain.webp", optimize=True)
    te = torn_edge()
    save_rgba(np.broadcast_to(OBSIDIAN, (120, 2400, 3)), te, f"{t}/torn-edge.webp")
