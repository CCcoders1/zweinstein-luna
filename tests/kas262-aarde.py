#!/usr/bin/env python3
"""v262 pixeltest: kale-aarde-strook tussen plantvoet en voorrand.

Kalibratie: de v261-affodil-crop MOET falen (strook kale aarde in de ellips).
Live: gerenderde Kas, pot-relatieve ellips, 412 en 360.
"""
import json, time, sys
from pathlib import Path
import numpy as np
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT=Path('/workspace/magische-app')
FIXTURE=ROOT/'tests/fixtures/v261_affodil_pot2.jpg'
# ellips in de fixture (bijsnede van de officiële v261-crop)
FIXTURE_ELLIPSE=(116, 172)  # y_back, y_front in fixture pixels
OPENING={
  'pot0':(0.083,0.193),'pot1':(0.036,0.129),'pot2':(0.035,0.118),
  'pot3':(0.058,0.199),'pot4':(0.063,0.177),'grotepot':(0.058,0.140)
}
STADIA={'varkensgras':[0,1,2,3,3],'wolfsmelk':[0,1,2,3,3],'alsem':[0,1,2,3,3],
        'affodil':[0,1,2,3,3],'mandragora':[0,1,2,3,4],
        'tentacula':[0,1,2,3,4],'duivelsstrik':[0,1,2,3,4]}
TABLE=['affodil','wolfsmelk','alsem','mandragora','varkensgras']
MEGA=['tentacula','duivelsstrik']
STAGES=[0,1,2,4]
SKINS=['pot0','pot1','pot2','pot3','pot4']
VIEWS=[('412x915',412,915,2.6),('360x800',360,800,2.6)]
MAX_STROOK=0.15  # 15% van de ellipshoogte

def plant_soil_masks(a, use_tan=False):
    r,g,b=a[:,:,0].astype(int),a[:,:,1].astype(int),a[:,:,2].astype(int)
    lum=0.3*r+0.59*g+0.11*b
    chroma=np.maximum(np.maximum(r,g),b)-np.minimum(np.minimum(r,g),b)
    purple_glaze=(r>60)&(b>r-20)&(b>g+15)&(lum>40)
    gold=(r>140)&(g>110)&(b>70)&(r>=g-5)&(r>b+15)&(lum>120)
    cream=(lum>=125)&(r>110)&(g>90)&(chroma<60)&(r>=g-5)
    rim=purple_glaze|gold|cream
    green=(g>r+6)&(g>b+4)&(lum>30)&(lum<220)&(~rim)
    stem=(g>=r-6)&(g>b+5)&(lum>35)&(lum<190)&(g>65)&(~rim)
    plant=green|stem
    if use_tan:
        # mandragora-tan, donkerder dan de roomwitte voorrand-highlight
        tan=(lum>65)&(lum<120)&(r>g-5)&(r>b+20)&(chroma>30)&(~rim)
        plant=plant|tan
    soil=(lum<75)&(r<90)&(g<r+20)&(b<r+15)&(b<g+20)&(~plant)&(~rim)
    return plant, soil, rim, lum

def score_region(im, y_back, y_front, x0, x1, zaad=False, soort=""):
    """Return dict with strip fraction and ok flag. y_back < y_front, in image pixels."""
    a=np.array(im.convert('RGB'))
    h,w=a.shape[:2]
    y_back=int(max(0,min(h-1,y_back)))
    y_front=int(max(0,min(h-1,y_front)))
    if y_front<=y_back+2:
        return {'ok':False,'fail':'ellips te plat','t_strook':None,'strip':0,'eh':0}
    x0=int(max(0,x0)); x1=int(min(w,x1))
    plant,soil,rim,lum=plant_soil_masks(a, use_tan=(soort=="mandragora"))
    eh=y_front-y_back
    plant_n=plant[:,x0:x1].sum(axis=1)
    soil_n=soil[:,x0:x1].sum(axis=1)
    rim_n=rim[:,x0:x1].sum(axis=1)
    mid=max(1,x1-x0)
    minp=max(3, mid*0.04)
    # voorrand: rijen aan de voorkant die vooral glazuur/goud/room zijn, die tellen niet als plant
    y=y_front
    while y>=y_back and rim_n[y]>mid*0.30:
        y-=1
    front_inner=y
    last=None
    for yy in range(front_inner, y_back-1, -1):
        if plant_n[yy]>minp:
            last=yy
            break
    if last is None and zaad and front_inner>=y_back:
        band=lum[y_back:front_inner+1, x0:x1]
        if band.size:
            # glanzend zaadje: per rij zowel een diepe donkere kern als een highlight
            hits=[]
            for i,row in enumerate(band):
                if row.min()<45 and row.max()>90 and (row.max()-np.median(row))>22:
                    hits.append(i)
            if hits:
                last=y_back+hits[-1]  # onderste zaadrij, vlak boven de voorrand
            elif float(band.max()-np.median(band))>25 and float(band.max())>80:
                last=y_back+int(np.argmax(band.max(axis=1)))
    # aaneengesloten kale strook tussen zichtbare plantvoet en binnenzijde voorrand
    if last is None:
        strip=max(0, front_inner-y_back+1)
    else:
        # rijen strikt onder de plantvoet, tot de voorrand; plantrij zelf telt niet
        lo=min(last, front_inner)
        hi=max(last, front_inner)
        strip=0
        for yy in range(last+1, front_inner+1):
            if plant_n[yy]<=minp:
                strip+=1
            else:
                strip=0  # plant onder de voet onderbreekt de kale strook
        if front_inner<last:
            strip=0  # voet zit al op of voorbij de voorrand
    frac=strip/eh
    fail=None
    if last is None:
        fail='geen plantpixels in of aan de ellips'
    elif frac>MAX_STROOK:
        fail=f'kale-aarde-strook {frac:.2f} van de ellips (>{MAX_STROOK})'
    return {
        'ok': fail is None,
        'fail': fail or '',
        't_strook': round(frac,3),
        'strip':strip,
        'eh':eh,
        'last':last,
        'y_back':y_back,
        'y_front':y_front,
        'front_inner':front_inner,
    }

def kalibreer_v261():
    if not FIXTURE.exists():
        return {'ok':False,'fail':f'fixture ontbreekt: {FIXTURE}'}
    im=Image.open(FIXTURE)
    w,h=im.size
    # mid 30%
    x0,x1=int(w*0.35),int(w*0.65)
    yb,yf=FIXTURE_ELLIPSE
    r=score_region(im, yb, yf, x0, x1, zaad=False)
    r['label']='fixture v261 affodil pot2'
    return r

SET_JS=r'''
async (arg) => {
  const STADIA = %s;
  const {kind, skin, z, st} = arg;
  const src = `img/kas/${z}-${STADIA[z][st]}.webp`;
  if (kind === 'mega') {
    const pot = document.querySelector('.mk-vloer');
    pot.dataset.pot = 'grotepot'; pot.dataset.z = z;
    const wrap = pot.querySelector('.gpwrap');
    wrap.querySelector('.gpimg').src = 'img/kas/grotepot.webp';
    wrap.querySelector('.gplip').src = 'img/kas/grotepot.webp';
    let img = wrap.querySelector('.plantimg, .superimg');
    if (!img) { img = document.createElement('img'); wrap.querySelector('.gpimg').after(img); }
    img.className = 'plantimg kst' + st; img.src = src; await img.decode();
  } else {
    const pot = document.querySelector('.mk-pot');
    pot.dataset.pot = skin; pot.dataset.z = z;
    const wrap = pot.querySelector('.potwrap');
    wrap.querySelector('.potimg').src = `img/kas/${skin}.webp`;
    wrap.querySelector('.potlip').src = `img/kas/${skin}.webp`;
    const kp = wrap.querySelector('.kplant');
    kp.innerHTML = `<img class="plantimg kst${st}" src="${src}" alt="">`;
    await kp.querySelector('img').decode();
  }
  if (window.ZW_KAS261) await window.ZW_KAS261.plaatsAlle();
  const pot = document.querySelector(kind === 'mega' ? '.mk-vloer' : '.mk-pot');
  const wrap = pot.querySelector(kind === 'mega' ? '.gpwrap' : '.potwrap');
  const pimg = wrap.querySelector(kind === 'mega' ? '.gpimg' : '.potimg');
  const sc=document.getElementById('mkscroll');
  if(kind==='mega'){
    pot.scrollIntoView({inline:'center', block:'nearest', behavior:'instant'});
    if(sc){
      const sr=sc.getBoundingClientRect(), r=pot.getBoundingClientRect();
      sc.scrollLeft += (r.left+r.width/2)-(sr.left+sr.width/2);
    }
  } else if(sc){
    const sr=sc.getBoundingClientRect(), r=pot.getBoundingClientRect();
    sc.scrollLeft += (r.left-sr.left)-(sr.width-r.width)/2;
  }
  void wrap.offsetHeight;
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  await new Promise(r => setTimeout(r, 50));
  const pr = pimg.getBoundingClientRect();
  const zs = getComputedStyle(pimg).zIndex;
  const zl = getComputedStyle(wrap.querySelector(kind==='mega'?'.gplip':'.potlip')).zIndex;
  const zk = getComputedStyle(wrap.querySelector('.kplant, .plantimg, .superimg')).zIndex;
  return {x:pr.x, y:pr.y, w:pr.width, h:pr.height, zImg:zs, zLip:zl, zPlant:zk};
}
''' % json.dumps(STADIA)

def bust(route):
    u=route.request.url
    if 'bundel.' in u and 'v=' not in u:
        return route.continue_(url=u+('&' if '?' in u else '?')+'v=262y')
    return route.continue_()

def save_base(now):
    return {
        'tut':9,'naam':'Luna Leeflang','huis':'huffelpuf','intro':1,
        'm3lvl':160,'potUpgrade':4,'groteTafel':1,'vloerpot':1,
        'galjoenen':6550,'schilden':40,'harten':{'n':5,'t':now},
        'weekBrief':'2026-W47','uitleg':{'match3':1,'pad':1},'gpMelding':1,
        'mkUitleg':1,'kasVerhuisMeld':1,'superOpen':1,'groenPoortUitleg':1,
        'kweek':{'100':{'z':'affodil','t':now-3600000,'bonus':0,'nat':0},
                 '200':{'z':'tentacula','t':now-200*60*1000,'bonus':0,'nat':0}},
        'dagboek':{"gezien":{},"tussen":{"10":1,"20":1,"30":1,"40":1,"50":1,"60":1,"70":1,"80":1,"90":1,"100":1,"110":1,"120":1,"130":1,"140":1,"150":1,"160":1,"170":1,"180":1,"190":1,"200":1,"210":1,"220":1,"230":1,"240":1,"250":1,"260":1,"270":1,"280":1,"290":1,"300":1,"310":1,"320":1,"330":1,"340":1,"350":1,"360":1,"370":1,"380":1,"390":1,"400":1,"410":1,"420":1,"430":1,"440":1,"450":1,"460":1,"470":1,"480":1,"490":1,"500":1,"510":1,"520":1,"530":1,"540":1,"550":1,"560":1,"570":1,"580":1,"590":1,"600":1,"610":1,"620":1,"630":1,"640":1,"650":1,"660":1,"670":1,"680":1,"690":1,"700":1,"710":1,"720":1,"730":1,"740":1,"750":1,"760":1,"770":1,"780":1,"790":1,"800":1},"clues":{},"paren":{},"brieven":{},"plek":{"kas1":1,"kas2":1,"kas3":1,"kas4":1,"kas5":1,"kas6":1,"kas7a":1,"kas7b":1,"kas7c":1,"ketel1":1,"ketel2":1,"ketel3":1,"ketel4":1,"ketel5":1,"album1":1,"album2":1,"feest1":1,"hk1":1,"hk2":1,"hk3":1,"hk4":1,"hk7":1,"wm1":1,"wm2":1,"wm3":1},"sub":{}},
        'mega':[None,None],
    }

def run_view(pw, name, vw, vh, dpr, items):
    print(f'\n=== VIEW {name} ===', flush=True)
    now=int(time.time()*1000)
    br=pw.chromium.launch(executable_path='/usr/bin/google-chrome',
                          args=['--no-sandbox','--disable-dev-shm-usage'])
    ctx=br.new_context(viewport={'width':vw,'height':vh}, device_scale_factor=dpr,
                       has_touch=True, is_mobile=True, service_workers='block',
                       locale='nl-NL', timezone_id='Europe/Amsterdam')
    ctx.add_init_script("localStorage.clear();localStorage.setItem('zweinstein_v1',%s);" %
                        json.dumps(json.dumps(save_base(now))))
    ctx.route('**/*supabase.co/**', lambda r: r.abort())
    ctx.route('**/*', bust)
    pg=ctx.new_page()
    pg.goto(f'http://127.0.0.1:8766/index.html?v=262y{name}', wait_until='domcontentloaded', timeout=20000)
    pg.wait_for_function('()=>typeof ga==="function" && window.ZW_KAS261', timeout=20000)
    pg.evaluate("()=>{document.documentElement.classList.add('klaar');ga('mijnkas')}")
    pg.wait_for_selector('.mk-pot .potlip', timeout=10000)
    pg.wait_for_timeout(300)
    pg.evaluate("""()=>{document.querySelectorAll('#overgang,#splash,#gids,#toast,.ritueel,.modal,.modalin,.verhaal,.verhaalm,.vh,.rococo,[data-pop],#kastaak,#elfjes,#elfcv,.weekbriefkaart').forEach(el=>{
      if(el.id==='overgang'){el.style.opacity='0';el.hidden=true;el.style.pointerEvents='none'}
      else {el.style.display='none';el.hidden=true}})}""")
    rows=[]
    tmp=Path('/tmp/kas262-pix'); tmp.mkdir(exist_ok=True)
    for kind, skin, z, st in items:
        try:
            box=pg.evaluate(SET_JS, {'kind':kind,'skin':skin,'z':z,'st':st})
            # layering must stay pot back 1, plant 2, lip 3
            if int(box['zImg'] or 0)>int(box['zPlant'] or 0):
                raise RuntimeError(f"z-index fout: potimg={box['zImg']} plant={box['zPlant']}")
            pg.evaluate("""()=>{document.querySelectorAll('#overgang,#splash,#gids,#toast,.ritueel,.modal,.modalin,.verhaal,.verhaalm,.vh,.rococo,[data-pop],#kastaak,#elfjes,#elfcv,.weekbriefkaart').forEach(el=>{
              if(el.id==='overgang'){el.style.opacity='0';el.hidden=true;el.style.pointerEvents='none'}
              else {el.style.display='none';el.hidden=true}})}""")
            visible=pg.evaluate("""()=>!![...document.querySelectorAll('.verhaal,.modal,.modalin')].some(el=>{const s=getComputedStyle(el);const r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>80&&r.height>80})""")
            if visible:
                raise RuntimeError('verhaal-overlay nog zichtbaar')
            shot=str(tmp/f'{name}_{skin}_{z}_{st}.png')
            pg.screenshot(path=shot, full_page=False)
            im=Image.open(shot)
            back,front=OPENING[skin]
            yb=box['y']+back*box['h']
            yf=box['y']+front*box['h']
            # screenshot pixels = css * dpr
            yb_p,yf_p=yb*dpr, yf*dpr
            x0=(box['x']+0.22*box['w'])*dpr
            x1=(box['x']+0.78*box['w'])*dpr
            zaad=(st==0 and z in ('affodil','wolfsmelk','alsem','varkensgras','sodejus'))
            r=score_region(im, yb_p, yf_p, x0, x1, zaad=zaad, soort=z)
            r.update({'view':name,'skin':skin,'z':z,'st':st,'zImg':box['zImg'],'zPlant':box['zPlant']})
        except Exception as e:
            r={'view':name,'skin':skin,'z':z,'st':st,'ok':False,'fail':str(e),'t_strook':None}
        rows.append(r)
        mark='OK ' if r['ok'] else 'FAIL'
        print(f'  {mark} {skin:9} {z:12} st{st}  strook={r.get("t_strook")}  {r.get("fail","")}', flush=True)
    ctx.close(); br.close()
    return rows

def main():
    lines=[]
    # 1. kalibratie op v261
    k=kalibreer_v261()
    v261_faalt= (not k['ok']) and k.get('t_strook') is not None and k['t_strook']>MAX_STROOK
    lines.append('KALIBRATIE v261 fixture (affodil pot2)')
    lines.append(f'  strook={k.get("t_strook")}  fail={k.get("fail")!r}  → v261 wordt {"AFGEKEURD" if v261_faalt else "NIET afgekeurd (FOUT IN DE TEST)"}')
    lines.append('')
    print('\n'.join(lines), flush=True)
    if not v261_faalt:
        Path('/tmp/kas262-aarde.txt').write_text('\n'.join(lines)+'\nTEST NIET GEKALIBREERD\n')
        print('STOP: kalibratie eist dat v261-affodil faalt.', flush=True)
        return 2

    items=[]
    for skin in SKINS:
        for z in TABLE:
            for st in STAGES:
                items.append(('table',skin,z,st))
    for z in MEGA:
        for st in STAGES:
            items.append(('mega','grotepot',z,st))

    allr=[]
    with sync_playwright() as pw:
        for name,vw,vh,dpr in VIEWS:
            allr.extend(run_view(pw,name,vw,vh,dpr,items))

    lines.append('view        skin      plant        st   strook  result')
    lines.append('-'*82)
    fails=0
    for r in allr:
        st=f'{r.get("t_strook"):.2f}' if r.get('t_strook') is not None else '  - '
        res='OK' if r['ok'] else ('FAIL: '+str(r.get('fail')))
        if not r['ok']: fails+=1
        lines.append(f'{r["view"]:11} {r["skin"]:9} {r["z"]:12} {r["st"]}   {st}   {res}')
    lines.append('')
    lines.append(f'live: {len(allr)} checks, {fails} fail, {len(allr)-fails} ok')
    lines.append(f'kalibratie: v261-affodil {"FAALT zoals bedoeld" if v261_faalt else "FAALT NIET"}')
    text='\n'.join(lines)+'\n'
    Path('/tmp/kas262-aarde.txt').write_text(text)
    Path('/workspace/magische-app/tests/kas262-aarde-rapport.txt').write_text(text)
    print('\n'+text, flush=True)
    # success only if v261 failed AND live all passed
    return 0 if (v261_faalt and fails==0) else 1

if __name__=='__main__':
    sys.exit(main())
