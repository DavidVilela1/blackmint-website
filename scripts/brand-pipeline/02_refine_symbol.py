import sys
from PIL import Image
import numpy as np
src,out=sys.argv[1],sys.argv[2]
im=Image.open(f'{src}/01_logo_principal.png').convert('RGB').crop((190,100,405,392))
im=im.resize((im.width*2,im.height*2),Image.LANCZOS)
a=np.array(im).astype(float)
d=a[:,:,1]-a[:,:,0]          # mint dominance
alpha=np.clip((d-18)/(110-18),0,1); alpha[alpha<0.06]=0
def save(col,name):
    rgba=np.dstack([np.broadcast_to(np.array(col,float),a.shape),alpha*255]).astype(np.uint8)
    img=Image.fromarray(rgba,'RGBA'); bb=img.getchannel('A').point(lambda v:255 if v>20 else 0).getbbox()
    img=img.crop(bb); img.save(f'{out}/{name}',optimize=True); print(name,img.size)
save((95,222,163),'symbol-mint.png'); save((232,226,214),'symbol-offwhite.png'); save((12,13,12),'symbol-obsidian.png')
# wordmark obsidian
im=Image.open(f'{src}/01_logo_principal.png').convert('RGB').crop((380,150,995,370)); im=im.resize((im.width*2,im.height*2),Image.LANCZOS)
a=np.array(im).astype(float); V=a.max(2); alpha=np.clip((V-28)/(190-28),0,1); alpha[alpha<0.06]=0
mint=(a[:,:,1]-a[:,:,0])>35
rgb=np.zeros_like(a); rgb[...]=(12,13,12); rgb[mint]=(23,120,84)
img=Image.fromarray(np.dstack([rgb,alpha*255]).astype(np.uint8),'RGBA'); img=img.crop(img.getchannel('A').point(lambda v:255 if v>20 else 0).getbbox()); img.save(f'{out}/wordmark-obsidian.png',optimize=True); print('wordmark-obsidian',img.size)
