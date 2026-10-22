#!/usr/bin/env python3
"""Regressietest voor de economie (huisschilden, sterren, schooldagen). Draai vóór elke release:
     python3 tests/economie.py          (exit 0 = alles groen)
   Nodig: pip install playwright && python3 -m playwright install chromium
   Start zelf een lokale webserver op een vrije poort; raakt niets buiten de map aan."""
import json, os, re, socket, sys, threading, functools, http.server
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GOED = FOUT = 0
def ok(naam, cond, extra=''):
    global GOED, FOUT
    if cond: GOED += 1; print('  PASS', naam)
    else: FOUT += 1; print('  FAIL', naam, extra)

# ---------------------------------------------------------------- statische audit
def audit():
    print('[audit] schrijfacties op economie-velden')
    pat = re.compile(r"S\.schilden\s*(?:[-+*/]?=(?!=)|\+\+|--)|\bschilden\s*-=|lvSter\[[^\]]+\]\s*=(?!=)|lvSchild\[[^\]]+\]\s*=(?!=)|S\.schoolDag\s*=(?!=)|S\.wisselTot\s*=(?!=)")
    toegestaan = {  # bestand -> stukjes tekst die op die regel moeten staan
        'economie.js': [''],
        'kern.js': ['schildMigr'],                   # eenmalige migratie sterren → schilden (pre-v118)
        'huispunten.js': ['zonder sterrendata', 'S.lvSter[n]=2', 'S.lvSchild[k]=S.lvSter[k]'],
        'schooldagen.js': ['schoolDagIndexVanVoortgang()', 'Math.max(0,Math.min(M3VAKKEN', 'stage.index+1'],
    }
    vonden = []
    for f in sorted(os.listdir(ROOT)):
        if not f.endswith('.js') or f == 'sw.js': continue
        for i, regel in enumerate(open(os.path.join(ROOT, f), encoding='utf-8'), 1):
            for m in pat.finditer(regel):
                stuk = regel[max(0, m.start()-120):m.end()+40]
                if f in toegestaan and any(t in regel for t in toegestaan[f]): continue
                vonden.append(f'{f}:{i}: …{stuk.strip()[:160]}…')
    ok('geen schrijfacties buiten de centrale functies', not vonden, '\n    ' + '\n    '.join(vonden))
    tekst = ''.join(open(os.path.join(ROOT, f), encoding='utf-8').read() for f in os.listdir(ROOT) if f.endswith(('.js', '.html')))
    ok("geen tekst 'soms een huisschild'", 'soms een huisschild' not in tekst)
    sd = open(os.path.join(ROOT, 'schooldagen.js'), encoding='utf-8').read()
    ok('schooldagen gebruiken geen datum/klok', not re.search(r'new Date|Date\.now|toLocaleDate', sd))

# ---------------------------------------------------------------- browserhelpers
INV = """()=>{const v=[];const I=Number.isInteger;
 if(!I(S.schilden)||S.schilden<0)v.push('schilden '+S.schilden);
 if(!I(S.galjoenen)||S.galjoenen<0)v.push('Smekkies '+S.galjoenen);
 if(!I(S.m3lvl)||S.m3lvl<1)v.push('m3lvl '+S.m3lvl);
 for(const k in S.lvSter){const x=S.lvSter[k];if(!I(x)||x<0||x>3||!(+k>0))v.push('ster '+k+'='+x)}
 for(const k in S.lvSchild){const x=S.lvSchild[k];if(!I(x)||x<0||x>3||x>(S.lvSter[k]|0))v.push('lvSchild '+k+'='+x)}
 if(!I(S.schoolDag)||S.schoolDag<0||S.schoolDag>Math.floor((S.m3lvl-1)/20))v.push('schoolDag '+S.schoolDag);
 if(!I(S.wisselTot))v.push('wisselTot '+S.wisselTot);
 const st=schoolDag();if(st&&schoolDagDoelenKlaar(st)&&S.m3lvl>st.einde)v.push('dag had door moeten gaan');
 let som=0;for(const k in S.lvSter)som+=S.lvSter[k];if(ECO.verdiend()!==som)v.push('verdiend '+ECO.verdiend()+'≠'+som);
 const d=JSON.parse(localStorage.zweinstein_v1);if(d.schilden!==S.schilden||d.schoolDag!==S.schoolDag||d.galjoenen!==S.galjoenen)v.push('niet bewaard');
 return v}"""
TRIP = """()=>{let v=S.schilden;window._schW=[];Object.defineProperty(S,'schilden',{get(){return v},set(x){window._schW.push([x-v,(new Error().stack||'')]);v=x},enumerable:true,configurable:true})}"""
TRIPCHECK = "()=>(window._schW||[]).filter(w=>w[0]>0&&!/economie\\.js/.test(w[1])).map(w=>w[0]+' '+w[1].split('\\n').slice(1,4).join(' | '))"
WIN = """([n,score,zet,b])=>{b=b||{score,zet,L:m3Level(n),doel:[{over:0}]};window._bord=b;document.querySelectorAll('.modal,.ritueel,.verhaal').forEach(m=>m.remove());m3Winst(n,b);return 1}"""

def dag1():  return {f'school-herbologie-dag-1-doel-{i}': 1 for i in range(1, 11)}
def basis(**k):
    s = {'tut': 3, 'naam': 'Luna', 'huis': 'huffelpuf', 'intro': 1, 'm3lvl': 21, 'schoolDag': 1, 'taken': dag1(),
         'schilden': 34, 'galjoenen': 706, 'lvSter': {str(i): 2 for i in range(1, 21)}, 'lvSchild': {str(i): 2 for i in range(1, 21)}}
    s.update(k); return {a: b for a, b in s.items() if b is not None}

class App:
    def __init__(self, pw, url):
        self.br = pw.chromium.launch(); self.url = url
    def open(self, save, init='', ctx=None):
        ctx = ctx or self.br.new_context(viewport={'width': 390, 'height': 844}, service_workers='block')
        if save is not None:
            ctx.add_init_script("if(!localStorage.zw_testinit){localStorage.clear();localStorage.zw_testinit=1;localStorage.setItem('zweinstein_v1',%s)}" % json.dumps(json.dumps(save)))
        if init: ctx.add_init_script(init)
        ctx.route('**/*supabase.co/**', lambda r: r.abort())
        pg = ctx.new_page(); pg.errs = []; pg.on('pageerror', lambda e: pg.errs.append(str(e)))
        pg.goto(self.url); pg.wait_for_timeout(1800); return pg
    def inv(self, pg, naam):
        v = pg.evaluate(INV); ok(naam + ': invarianten', not v, v)

def grens(pg, n): return pg.evaluate(f"m3SterGrens({n})")

def scenarios(app):
    E = lambda pg, js, *a: pg.evaluate(js, *a)
    print('[1] haar telefoon (v124, dag 2, 34 schilden, 706 Smekkies) → eenmalige inhaalslag')
    pg = app.open(basis())
    ok('5 schilden', E(pg, 'S.schilden') == 5, E(pg, 'S.schilden'))
    ok('996 Smekkies (+290)', E(pg, 'S.galjoenen') == 996, E(pg, 'S.galjoenen'))
    ok('wisselTot = dag 2', E(pg, 'S.wisselTot') == 1)
    ok('speellog W-regel 29/290', E(pg, "JSON.stringify(S.log.filter(r=>r[0]=='W').map(r=>[r[2],r[3]]))") == '[[29,290]]')
    pg.wait_for_timeout(1200)
    ok('Stronk-popup in de wachtrij', 'Professor Stronk wisselt' in (E(pg, "(document.querySelector('[data-pop=schildwissel]')||{}).textContent||''")))
    ok('sterren onveranderd', E(pg, "Object.values(S.lvSter).join()") == ','.join(['2']*20))
    app.inv(pg, 'haar telefoon')
    pg.reload(); pg.wait_for_timeout(1800)
    ok('na herladen geen tweede wissel', E(pg, '[S.schilden,S.galjoenen,S.log.filter(r=>r[0]=="W").length]') == [5, 996, 1])
    ok('geen JS-fouten', not pg.errs, pg.errs); pg.context.close()

    print('[1b] inhaalslag telt al verdiende schilden van dag 2 mee')
    s = basis(m3lvl=23); s['lvSter'].update({'21': 3, '22': 2}); s['lvSchild'].update({'21': 3, '22': 2})
    pg = app.open(s)
    ok('5 + 5 = 10 schilden, +240', E(pg, '[S.schilden,S.galjoenen]') == [10, 946], E(pg, '[S.schilden,S.galjoenen]')); app.inv(pg, '1b'); pg.context.close()

    print('[1c] onder de grens: niets omwisselen')
    pg = app.open(basis(schilden=4))
    ok('4 schilden, 706 Smekkies', E(pg, '[S.schilden,S.galjoenen,S.wisselTot]') == [4, 706, 1]); pg.context.close()

    print('[2] v125-stand (dag 2, 5 schilden, 1026, W-regel in log) blijft ongemoeid')
    pg = app.open(basis(schilden=5, galjoenen=1026, log=[['W', 1792679350, 33, 330, 1]]))
    ok('ongemoeid', E(pg, '[S.schilden,S.galjoenen,S.schoolDag,S.wisselTot]') == [5, 1026, 1, 1], E(pg, '[S.schilden,S.galjoenen,S.schoolDag,S.wisselTot]'))
    pg.wait_for_timeout(1300); ok('geen popup', not E(pg, "!!document.querySelector('[data-pop=schildwissel]')"))
    app.inv(pg, 'v125'); pg.context.close()

    print('[3] vastgelopen v121-stand (dag 1, 10/10, level 21, 38 schilden)')
    pg = app.open(basis(schoolDag=0, schilden=38, galjoenen=696))
    ok('naar dag 2, 5 schilden, 1026', E(pg, '[S.schoolDag,S.schilden,S.galjoenen]') == [1, 5, 1026], E(pg, '[S.schoolDag,S.schilden,S.galjoenen]'))
    E(pg, "()=>{document.querySelectorAll('.modal,.ritueel,.verhaal').forEach(m=>m.remove());ga('match3',21)}"); pg.wait_for_timeout(700)
    ok('level 21 speelbaar', E(pg, 'document.body.dataset.view') == 'match3')
    pg.reload(); pg.wait_for_timeout(1800)
    ok('na herladen niets dubbel', E(pg, '[S.schoolDag,S.schilden,S.galjoenen]') == [1, 5, 1026]); app.inv(pg, 'v121'); pg.context.close()

    print('[4] schilden alleen uit levels: verschil bij herspelen, sterren nooit omlaag')
    pg = app.open(basis(schilden=5, galjoenen=1026, wisselTot=1)); E(pg, TRIP)
    g = grens(pg, 21)
    E(pg, WIN, [21, g[0], 0]); ok('2★ → +2', E(pg, '[S.schilden,S.lvSter[21],S.lvSchild[21]]') == [7, 2, 2], E(pg, '[S.schilden,S.lvSter[21],S.lvSchild[21]]'))
    E(pg, WIN, [21, g[1], 0]); ok('3★ → +1', E(pg, '[S.schilden,S.lvSter[21],S.lvSchild[21]]') == [8, 3, 3])
    E(pg, WIN, [21, 10, 0]); ok('1★ → +0, sterren blijven 3', E(pg, '[S.schilden,S.lvSter[21],S.lvSchild[21]]') == [8, 3, 3])
    E(pg, WIN, [21, 10**7, 0]); ok('max 3 per level', E(pg, '[S.schilden,S.lvSchild[21]]') == [8, 3])
    print('[5] dubbele winst-aanroep (dubbel tikken)')
    E(pg, WIN, [22, g[1]*2, 3]); a = E(pg, '[S.schilden,S.galjoenen]')
    E(pg, "()=>m3Winst(22,window._bord)"); E(pg, "()=>m3Winst(22,window._bord)")
    ok('tweede/derde aanroep telt niet', E(pg, '[S.schilden,S.galjoenen]') == a, [a, E(pg, '[S.schilden,S.galjoenen]')])
    ok('afwijking in speellog', E(pg, "S.log.some(r=>r[0]=='A'&&/dubbele winst/.test(r[2]))"))
    ok('tripwire: alle schild-plussen via economie.js', not E(pg, TRIPCHECK), E(pg, TRIPCHECK))
    app.inv(pg, 'winsten')
    print('[6] uitgeven')
    s0 = E(pg, 'S.schilden')
    ok('betaal 3 lukt', E(pg, "ECO.betaal('school-herbologie-dag-2-doel-1',3)") and E(pg, 'S.schilden') == s0-3)
    E(pg, "S.taken['school-herbologie-dag-2-doel-1']=1")
    ok('zelfde doel nog eens: geweigerd', not E(pg, "ECO.betaal('school-herbologie-dag-2-doel-1',3)") and E(pg, 'S.schilden') == s0-3)
    ok('te weinig saldo: geweigerd', not E(pg, "ECO.betaal('school-herbologie-dag-2-doel-2',999)"))
    ok('negatieve kosten: geweigerd', not E(pg, "ECO.betaal('x-neg',-5)"))
    t = E(pg, "(()=>{const v=huidigVak().v;const t=v.taken.find(t=>!S.taken[t[0]]);const s=S.schilden;doeTaak(v,t);doeTaak(v,t);document.querySelectorAll('.keuze button,.modal .optie').forEach(b=>{try{b.click()}catch(e){}});document.querySelectorAll('.keuze button,.modal .optie').forEach(b=>{try{b.click()}catch(e){}});return [s,S.schilden,t[2],!!S.taken[t[0]]]})()")
    ok('doeTaak dubbel getikt: één keer betaald', t[1] in (t[0], t[0]-t[2]) and (t[1] == t[0]-t[2]) == t[3], t)
    app.inv(pg, 'uitgeven'); pg.context.close()

    print('[7] dagwissel eenmalig per dag + [8] app dicht tijdens dagovergang')
    s = basis(m3lvl=40, schilden=30, galjoenen=100, wisselTot=1)
    s['taken'].update({f'school-herbologie-dag-2-doel-{i}': 1 for i in range(1, 11)})
    s['lvSter'].update({str(i): 2 for i in range(21, 40)}); s['lvSchild'].update({str(i): 2 for i in range(21, 40)})
    pg = app.open(s)
    E(pg, WIN, [40, grens(pg, 40)[0], 0])
    st = E(pg, "JSON.parse(localStorage.zweinstein_v1)")
    ok('dag + wissel samen bewaard', [st['schoolDag'], st['schilden'], st['galjoenen'] >= 100+27*10, st['wisselTot']] == [2, 5, True, 2], [st['schoolDag'], st['schilden'], st['galjoenen'], st['wisselTot']])
    ok('ECO.dagWissel(2) nog eens → 0', E(pg, 'ECO.dagWissel(2,"x")') == 0 and E(pg, 'S.schilden') == 5)
    ok('ECO.dagWissel(1) (oude dag) → 0', E(pg, 'ECO.dagWissel(1,"x")') == 0)
    app.inv(pg, 'dagwissel'); opgeslagen = E(pg, "localStorage.zweinstein_v1"); pg.context.close()
    pg = app.open(json.loads(opgeslagen))
    ok('"herstart" na overgang: niets dubbel', E(pg, "[S.schoolDag,S.schilden,S.log.filter(r=>r[0]=='W').length]") == [2, 5, 1], E(pg, "[S.schoolDag,S.schilden,S.log.filter(r=>r[0]=='W').length]"))
    pg.context.close()

    print('[9] kapotte save wordt stil gerepareerd')
    pg = app.open(basis(schilden=-5, galjoenen='12', wisselTot=1, lvSter={**{str(i): 2 for i in range(1, 21)}, '5': 7, '6': '3', '7': None, 'x': 3, '0': 2},
                         lvSchild={**{str(i): 2 for i in range(1, 21)}, '5': 9, '8': 3, '9': 2.5}))
    ok('schilden ≥ 0', E(pg, 'S.schilden') == 0); ok('Smekkies getal', E(pg, 'S.galjoenen') == 12)
    ok('lvSter 5 → 3, 6 → 3, 7 hersteld, 8 omhoog naar betaald', E(pg, '[S.lvSter[5],S.lvSter[6],S.lvSter[7]>=1,S.lvSter[8]]') == [3, 3, True, 3], E(pg, '[S.lvSter[5],S.lvSter[6],S.lvSter[7],S.lvSter[8]]'))
    ok("rare sleutels weg", E(pg, "!('x' in S.lvSter)&&!('0' in S.lvSter)"))
    ok("geen ster omlaag (behalve >3)", E(pg, "[1,2,3,4,10,20].every(n=>S.lvSter[n]>=2)"))
    ok("afwijking gelogd", E(pg, "S.log.some(r=>r[0]=='A')")); app.inv(pg, 'kapot'); pg.context.close()

    print('[10] oude save van vóór v118 (sterren, geen schilden/lvSter/schoolDag) en herstel uit oude back-up')
    pg = app.open({'tut': 3, 'naam': 'Luna', 'huis': 'huffelpuf', 'intro': 1, 'm3lvl': 35, 'sterren': 12, 'galjoenen': 300, 'opgelost': {'memory-1': 1}})
    ok('schilden uit oude sterren (12)', E(pg, 'S.schilden') == 12, E(pg, 'S.schilden'))
    ok('levels 1–34 → 2★, lvSchild gelijk', E(pg, "[...Array(34)].every((_,i)=>S.lvSter[i+1]==2&&S.lvSchild[i+1]==2)"))
    ok('schooldag uit voortgang (dag 2)', E(pg, 'S.schoolDag') == 1)
    ok('geen onterechte wissel (12 ≤ 5+28)', E(pg, '[S.schilden,S.galjoenen]') == [12, 300]); app.inv(pg, 'pre-v118'); pg.context.close()

    print('[11] verlies → Spijbel +5 → winst: één keer uitbetaald')
    pg = app.open(basis(schilden=5, galjoenen=1026, wisselTot=1))
    E(pg, "()=>{const b={score:0,zet:0,L:m3Level(21),doel:[{over:2}]};window._bord=b;m3Verlies(21,b)}")
    E(pg, "()=>{S.bo=S.bo||{};S.bo.spijbel=1;window._bord.zet+=5;window._bord.score=m3SterGrens(21)[1];document.querySelectorAll('.modal').forEach(m=>m.remove());m3Winst(21,window._bord);m3Winst(21,window._bord)}")
    ok('+3 voor 3★, niet meer', E(pg, '[S.schilden,S.lvSchild[21]]') == [8, 3], E(pg, '[S.schilden,S.lvSchild[21]]')); app.inv(pg, 'spijbel'); pg.context.close()

    print('[12] twee tabbladen tegelijk')
    ctx = app.br.new_context(viewport={'width': 390, 'height': 844}, service_workers='block')
    a = app.open(basis(schilden=5, galjoenen=1026, wisselTot=1), ctx=ctx)
    b = ctx.new_page(); b.goto(app.url, wait_until='domcontentloaded'); b.wait_for_timeout(2500)
    E(a, WIN, [21, grens(a, 21)[1], 0]); b.wait_for_timeout(500)
    ok('tab B ziet de winst van tab A', E(b, '[S.schilden,S.lvSchild[21]]') == [8, 3], E(b, '[S.schilden,S.lvSchild[21]]'))
    E(b, WIN, [21, grens(b, 21)[1], 0]); a.wait_for_timeout(500)
    ok('zelfde level in tab B: geen tweede uitbetaling', E(a, '[S.schilden,S.lvSchild[21]]') == [8, 3] and E(b, 'S.schilden') == 8, [E(a, 'S.schilden'), E(b, 'S.schilden')])
    app.inv(b, 'tabs'); ctx.close()

    print('[13] klok verzetten verandert schooldagen niet')
    for dagen in (60, -400):
        pg = app.open(basis(schilden=5, galjoenen=1026, wisselTot=1), init="(()=>{const D=Date,o=%d*864e5;class F extends D{constructor(...a){super(...(a.length?a:[D.now()+o]))}static now(){return D.now()+o}};window.Date=F})()" % dagen)
        ok(f'klok {dagen:+} dagen: dag/schilden gelijk', E(pg, '[S.schoolDag,S.schilden,S.galjoenen>=1026]') == [1, 5, True], E(pg, '[S.schoolDag,S.schilden,S.galjoenen]'))
        pg.context.close()

    print('[14] events, minigames en beloningen geven geen schilden (tripwire)')
    pg = app.open(basis(schilden=5, galjoenen=1026, wisselTot=1), init="localStorage.setItem('zw_hwdatum','2026-10-31')"); E(pg, TRIP)
    E(pg, """()=>{const f=[()=>{for(let i=0;i<6;i++)beloon('memory-'+i,10,5,'')},()=>dagBeloon(),()=>kikkerKrijg(3),()=>bonusCheck(),()=>hwFeest&&hwFeest()];f.forEach(x=>{try{x()}catch(e){}})}""")
    for v in ['home', 'kaart', 'kassen', 'boek', 'vrienden', 'meer', 'bonus', 'halloween', 'kamer', 'maker']:
        E(pg, f"()=>{{document.querySelectorAll('.modal,.ritueel,.verhaal').forEach(m=>m.remove());try{{ga('{v}')}}catch(e){{}}}}"); pg.wait_for_timeout(250)
    E(pg, "()=>{[...document.querySelectorAll('#app button')].filter(b=>/\\+100|Snoep|Echte datum/.test(b.textContent)).forEach(b=>{try{b.click();b.click()}catch(e){}})}"); pg.wait_for_timeout(300)
    E(pg, "()=>{document.querySelectorAll('.modal,.ritueel,.verhaal').forEach(m=>m.remove());ga('halloween')}"); pg.wait_for_timeout(600)
    E(pg, "()=>{for(let i=0;i<5;i++)document.querySelectorAll('.modal button').forEach(b=>{try{b.click()}catch(e){}})}"); pg.wait_for_timeout(300)
    ok('schilden nog steeds 5', E(pg, 'S.schilden') == 5, E(pg, 'S.schilden'))
    ok('tripwire leeg', not E(pg, TRIPCHECK), E(pg, TRIPCHECK)); app.inv(pg, 'events'); pg.context.close()

    print('[15] echt level: winst meteen vastgelegd; app dicht tijdens het eindfeest → bij herstart afgemaakt, één keer')
    pg = app.open(basis(schilden=5, galjoenen=1026, wisselTot=1))
    def start(n):
        E(pg, f"()=>{{document.querySelectorAll('.modal,.ritueel,.verhaal').forEach(m=>m.remove());S.harten&&(S.harten.n=5);ga('match3',{n})}}"); pg.wait_for_timeout(2500)
        E(pg, "()=>{document.querySelectorAll('.modal,.ritueel,.verhaal').forEach(m=>m.remove());const k=document.getElementById('m3start');if(k)k.click()}"); pg.wait_for_timeout(2500)
        E(pg, "()=>{document.querySelectorAll('.modal,.ritueel,.verhaal').forEach(m=>m.remove())}")
        return E(pg, "!!(typeof M3!='undefined'&&M3.b&&!M3.b.sim)")
    ok('level 21 gestart', start(21))
    if not E(pg, "!!(typeof M3!='undefined'&&M3.b)"): return
    E(pg, "()=>{const b=M3.b;b.zet=Math.max(4,b.zet);b.score=Math.max(b.score|0,m3SterGrens(21)[0]);M3.knal=M3.knal||1;setTimeout(()=>m3Winst(21,b),0)}"); pg.wait_for_timeout(700)
    w = E(pg, "JSON.parse(localStorage.zweinstein_v1).winBezig||null")
    ok('winst direct bewaard (winBezig) tijdens het feest', bool(w) and w['n'] == 21, w)
    st0 = E(pg, f"(()=>{{const g=m3SterGrens(21);return {w['sc'] if w else 0}>=g[1]?3:{w['sc'] if w else 0}>=g[0]?2:1}})()")
    gal = 10 + (w['z'] if w else 0)*2 + (10 if w and w['zw'] else 0)
    pg.reload(); pg.wait_for_timeout(2000)
    na = E(pg, "[S.m3lvl,S.schilden,S.lvSchild[21]||0,S.lvSter[21]||0,S.galjoenen,!!S.winBezig]")
    ok(f'na "app dicht": level gewonnen, {st0}★ van het winmoment, schilden + Smekkies betaald', na == [22, 5+st0, st0, st0, 1026+gal, False], [na, st0, gal])
    ok('onderbreking in speellog', E(pg, "S.log.some(r=>r[0]=='A'&&/onderbroken eindfeest/.test(r[2]))"))
    pg.reload(); pg.wait_for_timeout(1800)
    ok('nog een herstart: niets dubbel', E(pg, "[S.m3lvl,S.schilden,S.galjoenen]") == na[:2] + [na[4]])
    app.inv(pg, 'na onderbreking')
    print('[15b] level opnieuw, feest loopt af: alleen het verschil erbij, precies één keer')
    g = start(21)
    ok('level 21 opnieuw gestart', g, E(pg, "[document.body.dataset.view,[...document.querySelectorAll('.modal')].map(m=>m.textContent.slice(0,80))]"))
    if not g: pg.context.close(); return
    E(pg, "()=>{const b=M3.b;b.zet=Math.max(6,b.zet);b.score=Math.max(b.score|0,m3SterGrens(21)[1]);M3.knal=M3.knal||1;window._s0=[S.schilden,S.lvSchild[21]];m3Winst(21,b);m3Winst(21,b)}")
    pg.wait_for_timeout(400); ok('winBezig gezet tijdens feest', E(pg, "!!S.winBezig&&S.winBezig.n===21"))
    pg.wait_for_function("!S.winBezig&&!!document.querySelector('.m3eind')", timeout=40000); pg.wait_for_timeout(300)
    st = E(pg, '[S.schilden,S.lvSchild[21],S.lvSter[21],window._s0,!!JSON.parse(localStorage.zweinstein_v1).winBezig]')
    ok('3★ na het feest: alleen het verschil met het winmoment', st[1] == st[2] == 3 and st[0] - st[3][0] == 3 - st[3][1] and not st[4], st)
    pg.reload(); pg.wait_for_timeout(1800)
    ok('herstart na normaal feest: niets extra', E(pg, '[S.schilden,S.lvSchild[21],!!S.winBezig]') == [st[0], 3, False])
    app.inv(pg, 'echt level'); ok('geen JS-fouten', not pg.errs, pg.errs); pg.context.close()

    print('[16] oude save: 2★ ingevuld zonder vastgelegde schilden → herspelen zonder betere sterren geeft niets')
    s16 = basis(schilden=5, galjoenen=1026, wisselTot=1); s16['lvSchild'] = {'1': 2}
    pg = app.open(s16)
    ok('saldo en sterren onveranderd', E(pg, "[S.schilden,S.galjoenen,Object.values(S.lvSter).filter(x=>x===2).length]") == [5, 1026, 20])
    ok('lvSchild 2..20 = 2', E(pg, "[...Array(20)].every((_,i)=>S.lvSchild[i+1]===2)"))
    E(pg, WIN, [5, grens(pg, 5)[0], 0]); ok('herspelen 2★ → +0', E(pg, 'S.schilden') == 5)
    E(pg, WIN, [6, grens(pg, 6)[1], 0]); ok('herspelen 3★ → +1 (alleen het verschil)', E(pg, '[S.schilden,S.lvSchild[6]]') == [6, 3])
    app.inv(pg, 'oude save lvSchild'); pg.context.close()

def main():
    audit()
    s = socket.socket(); s.bind(('127.0.0.1', 0)); poort = s.getsockname()[1]; s.close()
    class H(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **k): super().__init__(*a, directory=ROOT, **k)
        def log_message(self, *a): pass
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', poort), H)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    with sync_playwright() as pw:
        app = App(pw, f'http://127.0.0.1:{poort}/index.html')
        try: scenarios(app)
        finally: app.br.close()
    srv.shutdown()
    print(f'\nEconomietest: {GOED} geslaagd, {FOUT} mislukt')
    sys.exit(1 if FOUT else 0)

if __name__ == '__main__': main()
