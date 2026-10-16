import sys
from PIL import Image, ImageFilter
import numpy as np
src, out = sys.argv[1], sys.argv[2]
def extract(path, box, scale=2, lo=28, ref=190, recolor=None):
    im=Image.open(path).convert('RGB').crop(box)
    im=im.resize((im.width*scale, im.height*scale), Image.LANCZOS)
    a=np.array(im).astype(float)
    V=a.max(2)
    alpha=np.clip((V-lo)/(ref-lo),0,1)
    alpha[alpha<0.06]=0
    rgb=np.clip(a/np.maximum(alpha[...,None],1e-3),0,255)
    if recolor is not None:
        rgb[...]=recolor
    rgba=np.dstack([rgb,alpha*255]).astype(np.uint8)
    img=Image.fromarray(rgba,'RGBA')
    bb=img.getchannel('A').point(lambda v:255 if v>20 else 0).getbbox()
    img=img.crop(bb)
    return img
MINT=(95,222,163); OFF=(232,226,214)
L=f'{src}/01_logo_principal.png'
jobs={
 'symbol-mint.png': (L,(190,100,410,392),None),
 'symbol-offwhite.png': (L,(190,100,410,392),OFF),
 'wordmark.png': (L,(380,150,995,370),None),
 'wordmark-offwhite.png': (L,(380,150,995,370),OFF),
 'logo-lockup.png': (L,(190,100,995,392),None),
 'slogan-small-team.png': (L,(1050,110,1220,330),OFF),
 'crown.png': (L,(1105,330,1160,390),MINT),
}
for name,(p,box,rc) in jobs.items():
    img=extract(p,box,recolor=rc); img.save(f'{out}/{name}',optimize=True); print(name,img.size)
# doodles from 08
D=f'{src}/08_simbolos_graficos.png'
a=np.array(Image.open(D).convert('RGB')).astype(int); g=a[:,:,1]-a[:,:,0]
cols=np.where((g>40).any(0))[0]
segs=[];s=cols[0];p=cols[0]
for c in cols[1:]:
    if c-p>8: segs.append((s,p)); s=c
    p=c
segs.append((s,p))
names=['doodle-crown.png','doodle-star.png','doodle-x.png','doodle-controller.png']
for n,(s,e) in zip(names,segs):
    rows=np.where((g[:,s:e+1]>40).any(1))[0]
    img=extract(D,(s-6,rows.min()-6,e+7,rows.max()+7),scale=4,recolor=MINT); img.save(f'{out}/{n}',optimize=True); print(n,img.size)
# slogan 09 'Indie games for curious people'
img=extract(f'{src}/09_slogan.png',(40,30,240,140),scale=3,recolor=MINT); img.save(f'{out}/slogan-curious-people.png'); print('slogan',img.size)
