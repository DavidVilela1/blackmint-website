import re,sys
from PIL import Image
import numpy as np
out=sys.argv[1]
def d_of(f): return re.findall(r' d="([^"]+)"',open(f).read())
def bbox(png):
    a=np.array(Image.open(png))<128; ys,xs=np.where(a); return xs.min(),ys.min(),xs.max()+1,ys.max()+1
sx0,sy0,sx1,sy1=bbox('sym.png')
pad=6
sym_d=' '.join(d_of('sym.svg'))
def svg(vb,body): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img">{body}</svg>'
vb=f'{sx0-pad} {sy0-pad} {sx1-sx0+2*pad} {sy1-sy0+2*pad}'
for name,col in [('symbol-mint','#5FDEA3'),('symbol-offwhite','#E8E2D6'),('symbol','#000')]:
    open(f'{out}/{name}.svg','w').write(svg(vb,f'<title>BlackMint Interactive</title><path fill="{col}" fill-rule="evenodd" d="{sym_d}"/>'))
bx0,by0,bx1,by1=bbox('wm_black.png'); ix0,iy0,ix1,iy1=bbox('wm_inter.png')
off=(285-150)*4
x0=min(bx0,ix0)-pad; y0=by0-pad; x1=max(bx1,ix1)+pad; y1=iy1+off+pad
bd=' '.join(d_of('wm_black.svg')); idd=' '.join(d_of('wm_inter.svg'))
vbw=f'{x0} {y0} {x1-x0} {y1-y0}'
def wm(main,sub,title=True):
    t='<title>BlackMint Interactive</title>' if title else ''
    return svg(vbw,f'{t}<path fill="{main}" fill-rule="evenodd" d="{bd}"/><g transform="translate(0 {off})"><path fill="{sub}" fill-rule="evenodd" d="{idd}"/></g>')
open(f'{out}/wordmark.svg','w').write(wm('#E8E2D6','#5FDEA3'))
open(f'{out}/wordmark-mask.svg','w').write(wm('#000','#000'))
open(f'{out}/wordmark-obsidian.svg','w').write(wm('#0B0C0B','#16774F'))
open(f'{out}/wordmark-main-mask.svg','w').write(svg(f'{x0} {y0} {x1-x0} {by1+pad-y0}',f'<path d="{bd}" fill-rule="evenodd"/>'))
# lockup: symbol scaled so its height ~ matches  original proportion: in original, symbol height 292px vs wordmark block 220px at same scale -> both at 4x scale already
# place symbol left, wordmark offset by original geometry: symbol crop origin (190,100), wordmark crop (380,150)
gx=(380-190)*4; gy=(150-100)*4
lx0=sx0-pad; ly0=min(sy0, y0+gy)-pad; lx1=x1+gx; ly1=max(sy1,y1+gy)+pad
body=f'<title>BlackMint Interactive</title><path fill="#5FDEA3" fill-rule="evenodd" d="{sym_d}"/><g transform="translate({gx} {gy})"><path fill="#E8E2D6" fill-rule="evenodd" d="{bd}"/><g transform="translate(0 {off})"><path fill="#5FDEA3" fill-rule="evenodd" d="{idd}"/></g></g>'
open(f'{out}/logo-lockup.svg','w').write(svg(f'{lx0} {ly0} {lx1-lx0} {ly1-ly0}',body))
print(vb,vbw)
