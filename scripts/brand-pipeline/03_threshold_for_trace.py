import sys
from PIL import Image, ImageFilter
import numpy as np
src,out=sys.argv[1],sys.argv[2]
L=Image.open(f'{src}/01_logo_principal.png').convert('RGB')
def mk(box,mode,name,scale=4,th=0.42):
    im=L.crop(box); im=im.resize((im.width*scale,im.height*scale),Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.2))
    a=np.array(im).astype(float)
    if mode=='mint': v=np.clip((a[:,:,1]-a[:,:,0]-18)/(92),0,1)
    elif mode=='white': v=np.clip((a.min(2)-28)/(162),0,1)*((a[:,:,1]-a[:,:,0])<35)
    else: v=np.clip((a.max(2)-28)/162,0,1)
    b=(v>th)
    Image.fromarray(np.where(b,0,255).astype(np.uint8)).save(f'{out}/{name}.png'); print(name,b.shape)
mk((190,100,405,392),'mint','sym')
mk((380,150,995,300),'white','wm_black')   # BLACKMINT
mk((380,285,995,370),'mint','wm_inter')     # INTERACTIVE
