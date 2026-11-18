#!/usr/bin/env python3
"""v261: meet de stengelvoet in de echte Kas t.o.v. de aarde-ellips (pot-relatief)."""
import json, time, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

STADIA={'varkensgras':[0,1,2,3,3],'wolfsmelk':[0,1,2,3,3],'alsem':[0,1,2,3,3],
        'affodil':[0,1,2,3,3],'mandragora':[0,1,2,3,4],
        'tentacula':[0,1,2,3,4],'duivelsstrik':[0,1,2,3,4]}
OPENING={
  'pot0':(0.083,0.193),'pot1':(0.036,0.129),'pot2':(0.035,0.118),
  'pot3':(0.058,0.199),'pot4':(0.063,0.177),'grotepot':(0.058,0.140)
}
TABLE=['affodil','wolfsmelk','alsem','mandragora','varkensgras']
MEGA=['tentacula','duivelsstrik']
STAGES=[0,1,2,4]
SKINS=['pot0','pot1','pot2','pot3','pot4']
VIEWS=[('412x915',412,915,2.6),('360x800',360,800,2.6),('412x780',412,780,2.6)]

def save(now):
    return {
        'tut':9,'naam':'Luna Leeflang','huis':'huffelpuf','intro':1,
        'm3lvl':160,'potUpgrade':4,'groteTafel':1,'vloerpot':1,
        'galjoenen':6550,'schilden':40,'harten':{'n':5,'t':now},
        'weekBrief':'2026-W47','uitleg':{'match3':1,'pad':1},'gpMelding':1,
        'mkUitleg':1,'kasVerhuisMeld':1,'superOpen':1,
        'kweek':{'100':{'z':'affodil','t':now-3600000,'bonus':0,'nat':0},
                 '200':{'z':'tentacula','t':now-200*60*1000,'bonus':0,'nat':0}},
        'mega':[None,None],
    }

SET_JS = """
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
  void wrap.offsetHeight;
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  await new Promise(r => setTimeout(r, 40));
  const img = wrap.querySelector('.plantimg, .superimg');
  const wr = wrap.getBoundingClientRect(), ir = img.getBoundingClientRect();
  const voet = Number(img.style.getPropertyValue('--voet') || getComputedStyle(img).getPropertyValue('--voet') || 0.98);
  const footFromTop = (ir.top + voet * ir.height - wr.top) / wr.height;
  const aarde = getComputedStyle(pot).getPropertyValue('--aarde');
  return {voet, aarde, footFromTop, wrapH: wr.height, imgH: ir.height};
}
""" % json.dumps(STADIA)

def bust(route):
    u = route.request.url
    if 'bundel.' in u and 'v=' not in u:
        return route.continue_(url=u + ('&' if '?' in u else '?') + 'v=261n')
    return route.continue_()

def run_view(pw, name, vw, vh, dpr, items):
    print(f'\n=== VIEW {name} ===', flush=True)
    now = int(time.time() * 1000)
    br = pw.chromium.launch(executable_path='/usr/bin/google-chrome',
                            args=['--no-sandbox', '--disable-dev-shm-usage'])
    ctx = br.new_context(viewport={'width': vw, 'height': vh}, device_scale_factor=dpr,
                         has_touch=True, is_mobile=True, service_workers='block',
                         locale='nl-NL', timezone_id='Europe/Amsterdam')
    ctx.add_init_script("localStorage.clear();localStorage.setItem('zweinstein_v1',%s);" %
                        json.dumps(json.dumps(save(now))))
    ctx.route('**/*supabase.co/**', lambda r: r.abort())
    ctx.route('**/*', bust)
    pg = ctx.new_page()
    pg.goto(f'http://127.0.0.1:8766/index.html?v=261n{name}', wait_until='domcontentloaded', timeout=20000)
    pg.wait_for_function('()=>typeof ga==="function" && window.ZW_KAS261', timeout=20000)
    pg.evaluate("()=>{document.documentElement.classList.add('klaar');ga('mijnkas')}")
    pg.wait_for_selector('.mk-pot .potlip', timeout=10000)
    pg.wait_for_timeout(300)
    pg.evaluate("""()=>{document.querySelectorAll('#overgang,#splash,#gids,#toast,.modal,.verhaalm,#kastaak,#elfjes,#elfcv').forEach(el=>{
      if(el.id==='overgang'){el.style.opacity='0';el.hidden=true}else{el.style.display='none'}})}""")
    rows = []
    for kind, skin, z, st in items:
        try:
            m = pg.evaluate(SET_JS, {'kind': kind, 'skin': skin, 'z': z, 'st': st})
            back, front = OPENING[skin]
            t = (m['footFromTop'] - back) / (front - back) if (front - back) else None
            fail = []
            if t is None:
                fail.append('geen t')
            else:
                if t < 0.50:
                    fail.append(f'voet in achterste helft (t={t:.2f})')
                if t > 1.35:
                    fail.append(f'voet onder de voorrand op de buik (t={t:.2f})')
            row = {'view': name, 'skin': skin, 'z': z, 'st': st, 't': None if t is None else round(t, 3),
                   'voet': round(m['voet'], 3), 'aarde': m['aarde'].strip(), 'ok': not fail, 'fail': fail}
        except Exception as e:
            row = {'view': name, 'skin': skin, 'z': z, 'st': st, 't': None, 'voet': None, 'aarde': '',
                   'ok': False, 'fail': [str(e)]}
        rows.append(row)
        mark = 'OK ' if row['ok'] else 'FAIL'
        print(f'  {mark} {skin:9} {z:12} st{st}  t={row["t"]}  voet={row["voet"]}  {", ".join(row["fail"])}', flush=True)
    ctx.close(); br.close()
    return rows

def main():
    items = []
    for skin in SKINS:
        for z in TABLE:
            for st in STAGES:
                items.append(('table', skin, z, st))
    for z in MEGA:
        for st in STAGES:
            items.append(('mega', 'grotepot', z, st))
    allr = []
    with sync_playwright() as pw:
        for name, vw, vh, dpr in VIEWS:
            allr.extend(run_view(pw, name, vw, vh, dpr, items))
    lines = ['view        skin      plant        st    t     voet   aarde   result', '-'*84]
    fails = 0
    ts = {}
    for r in allr:
        t = '  -  ' if r['t'] is None else f'{r["t"]:.2f}'
        voet = '  -  ' if r['voet'] is None else f'{r["voet"]:.3f}'
        res = 'OK' if r['ok'] else ('FAIL: ' + '; '.join(r['fail']))
        if not r['ok']:
            fails += 1
        lines.append(f'{r["view"]:11} {r["skin"]:9} {r["z"]:12} {r["st"]}   {t}  {voet}  {r["aarde"]:7}  {res}')
        key = (r['skin'], r['z'], r['st'])
        ts.setdefault(key, []).append((r['view'], r['t']))
    # viewport stability: t should be almost equal across views
    drift = []
    for key, vals in ts.items():
        nums = [v[1] for v in vals if v[1] is not None]
        if len(nums) >= 2 and (max(nums) - min(nums)) > 0.08:
            drift.append(f'{key} t={nums}')
    lines.append('')
    lines.append(f'{len(allr)} checks, {fails} fail, {len(allr)-fails} ok')
    if drift:
        lines.append('viewport-drift (>0.08): ' + '; '.join(drift))
    else:
        lines.append('viewport-drift: geen (t verschilt <0.08 tussen 412x915, 360x800 en 412x780)')
    text = '\n'.join(lines) + '\n'
    Path('/tmp/kas261-voet.txt').write_text(text)
    Path('/workspace/magische-app/tests/kas261-voet-rapport.txt').write_text(text)
    print('\n' + text, flush=True)
    return 0 if fails == 0 and not drift else 1

if __name__ == '__main__':
    sys.exit(main())
