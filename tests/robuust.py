#!/usr/bin/env python3
"""Robuustheid: oude saves migreren zonder voortgang te wissen, korte schermen,
beschadigde/volle opslag, offline. Raakt de echte save van moeder niet."""
import json, os, socket, sys, threading, http.server
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GOED = FOUT = 0

def ok(naam, cond, extra=''):
    global GOED, FOUT
    if cond:
        GOED += 1
        print('  PASS', naam)
    else:
        FOUT += 1
        print('  FAIL', naam, extra if extra != '' else '')

def basis(**k):
    s = {
        'tut': 9, 'naam': 'Luna Leeflang', 'huis': 'huffelpuf',
        'm3lvl': 21, 'schoolDag': 1, 'schilden': 8, 'galjoenen': 400,
        'sterren': 40, 'wisselTot': 2, 'punten': 60, 'xp': 80,
        'lvSter': {str(i): 2 for i in range(1, 21)},
        'lvSchild': {str(i): 2 for i in range(1, 21)},
        'login': {'dag': 2, 'laatst': '2026-11-14'},
        'taken': {}, 'uitleg': {'match3': 1, 'pad': 1},
    }
    s.update(k)
    return s

def kern(s):
    return {
        'naam': s.get('naam'), 'huis': s.get('huis'),
        'm3lvl': s.get('m3lvl'), 'schoolDag': s.get('schoolDag'),
        'schilden': s.get('schilden'), 'galjoenen': s.get('galjoenen'),
        'lvSter': {str(k): int(v) for k, v in (s.get('lvSter') or {}).items()},
        'lvSchild': {str(k): int(v) for k, v in (s.get('lvSchild') or {}).items()},
    }

class App:
    def __init__(self, pw, url):
        try:
            self.br = pw.chromium.launch()
        except Exception:
            self.br = pw.chromium.launch(executable_path='/usr/bin/google-chrome',
                                         args=['--no-sandbox', '--disable-dev-shm-usage'])
        self.url = url

    def open(self, save, init='', size=(390, 844), sw='block', extra=None):
        ctx = self.br.new_context(viewport={'width': size[0], 'height': size[1]},
                                  service_workers=sw, locale='nl-NL', timezone_id='Europe/Amsterdam')
        if extra:
            extra(ctx)
        if save is not None:
            ctx.add_init_script(
                "if(!localStorage.zw_testinit){localStorage.clear();localStorage.zw_testinit=1;localStorage.setItem('zweinstein_v1',%s)}"
                % json.dumps(json.dumps(save))
            )
        if init:
            ctx.add_init_script(init)
        ctx.route('**/*supabase.co/**', lambda r: r.abort())
        pg = ctx.new_page()
        pg.errs = []
        pg.on('pageerror', lambda e: pg.errs.append(str(e)))
        pg.goto(self.url)
        pg.wait_for_timeout(1600)
        return pg

    def sluit(self, pg):
        pg.evaluate("""() => {
          document.querySelectorAll('#laadscherm,.ritueel,#lvintro,.modal,.verhaalm,.verhaal,#toast,#gids.zien').forEach(el=>{
            if(el&&el.id==='gids'){el.classList.remove('zien');return}
            try{el.remove()}catch(e){}
          });
        }""")

def stand(pg):
    return pg.evaluate("""() => ({
      naam:S.naam, huis:S.huis, m3lvl:S.m3lvl, schoolDag:S.schoolDag,
      schilden:S.schilden, galjoenen:S.galjoenen,
      lvSter:S.lvSter||{}, lvSchild:S.lvSchild||{},
      disk: JSON.parse(localStorage.zweinstein_v1||'{}')
    })""")

def zelfde_voortgang(voor, na, label):
    ok(label + ': naam/huis/level', [na['naam'], na['huis'], na['m3lvl']] ==
       [voor['naam'], voor['huis'], voor['m3lvl']], [na['naam'], na['huis'], na['m3lvl']])
    ok(label + ': schooldag', na['schoolDag'] == voor['schoolDag'], (voor['schoolDag'], na['schoolDag']))
    ok(label + ': schilden en Smekkies', [na['schilden'], na['galjoenen']] == [voor['schilden'], voor['galjoenen']])
    # sterren/schilden per level nooit omlaag
    dalen = []
    for k, v in (voor.get('lvSter') or {}).items():
        nu = (na.get('lvSter') or {}).get(str(k), (na.get('lvSter') or {}).get(k))
        if nu is None or int(nu) < int(v):
            dalen.append(f'ster {k}:{v}->{nu}')
    for k, v in (voor.get('lvSchild') or {}).items():
        nu = (na.get('lvSchild') or {}).get(str(k), (na.get('lvSchild') or {}).get(k))
        if nu is None or int(nu) < int(v):
            dalen.append(f'schild {k}:{v}->{nu}')
    ok(label + ': sterren en lvSchild niet omlaag', not dalen, dalen)
    disk = na.get('disk') or {}
    ok(label + ': schijf bewaart voortgang',
       disk.get('naam') == voor['naam'] and disk.get('m3lvl') == voor['m3lvl'] and disk.get('schilden') == voor['schilden'])


def main(url):
    with sync_playwright() as pw:
        app = App(pw, url)

        print('[migratie] oude versies v118–v152, voortgang blijft heel')
        gevallen = [
            ('v130-midden', basis()),
            ('v138-huiskamer', basis(huiskamer={'week': '2026-W10', 'geplaatst': ['stoel'], 'gehad': ['stoel']})),
            ('v146-titels', basis(titels=['Een stille leerling'], serieBel={})),
            ('v151-zonder-weekbrief', basis(m3lvl=40, schoolDag=1, lvSter={str(i): 2 for i in range(1, 40)},
                                            lvSchild={str(i): 2 for i in range(1, 40)})),
            ('v152-midden-zonder-tuin', basis(kaarten={'Rubeus Hagrid': 1})),
            ('v152-akte2', basis(m3lvl=601, schoolDag=30, schilden=12, galjoenen=2400, wisselTot=30,
                                 lvSter={str(i): 2 for i in range(1, 601)},
                                 lvSchild={str(i): 2 for i in range(1, 601)},
                                 kaarten={'Rubeus Hagrid': 1, 'Het pad dat wachtte': 1},
                                 dagboek={'gezien': {'30': 1}})),
        ]
        for naam, save in gevallen:
            voor = kern(save)
            pg = app.open(save)
            na = stand(pg)
            zelfde_voortgang(voor, na, naam)
            ok(naam + ': geen JS-fouten', not pg.errs, pg.errs)
            pg.context.close()

        print('[herstel] beschadigde save uit reservekopie')
        goed = basis()
        init = """(() => {
          const goed = %s;
          const ruw = JSON.stringify(goed);
          localStorage.setItem('zweinstein_v1', '{dit is geen json');
          localStorage.setItem('zw_reserve', JSON.stringify([{t:Date.now(),d:ruw}]));
        })();""" % json.dumps(goed)
        # reserve.js runs at script start; init_script on the context runs before page scripts.
        # We must set kapot+reserve BEFORE reserve.js. add_init_script runs before page, good.
        # But App.open also writes a valid save if save is not None. Use save=None and only init.
        pg = app.open(None, init=init)
        na = stand(pg)
        ok('kapotte JSON hersteld uit reserve', na['naam'] == 'Luna Leeflang' and na['m3lvl'] == 21, na)
        ok('herstel: schilden heel', na['schilden'] == 8)
        ok('herstel: geen JS-fouten', not pg.errs, pg.errs)
        pg.context.close()

        print('[opslag] volle localStorage laat bewaar niet crashen')
        pg = app.open(basis())
        uit = pg.evaluate("""() => {
          const orig = localStorage.setItem.bind(localStorage);
          localStorage.setItem = function(k,v){
            if(k==='zweinstein_v1'){const e=new Error('quota');e.name='QuotaExceededError';throw e}
            return orig(k,v);
          };
          let threw=false, uit=null;
          try{uit=bewaar()}catch(e){threw=true}
          return {threw, uit, naam:S.naam, schilden:S.schilden, m3lvl:S.m3lvl};
        }""")
        ok('quota: bewaar gooit niet', uit['threw'] is False, uit)
        ok('quota: voortgang blijft in geheugen', uit['naam'] == 'Luna Leeflang' and uit['schilden'] == 8 and uit['m3lvl'] == 21, uit)
        ok('quota: geen JS-fouten', not pg.errs, pg.errs)
        pg.context.close()

        print('[scherm] korte en oude formaten, volgende stap bereikbaar')
        for label, size in [('320x568', (320, 568)), ('360x640', (360, 640))]:
            pg = app.open(basis(), size=size)
            for _ in range(6):
                app.sluit(pg)
                pg.wait_for_timeout(150)
            pg.evaluate("typeof ga==='function'&&ga('home')")
            pg.wait_for_timeout(400)
            for _ in range(4):
                app.sluit(pg)
                pg.wait_for_timeout(120)
            info = pg.evaluate("""() => {
              const stap=document.getElementById('stapknop')||document.getElementById('speelknop')||document.querySelector('.knop.volgende');
              const nav=document.getElementById('nav');
              const r=el=>{if(!el)return null;const b=el.getBoundingClientRect();const nr=nav?nav.getBoundingClientRect():{top:innerHeight};
                return {txt:(el.innerText||'').slice(0,80), top:Math.round(b.top), bottom:Math.round(b.bottom),
                        inDoc:b.height>0, aboveNav:b.bottom<=nr.top+8 || b.top<nr.top};
              };
              return {view:document.body.dataset.view, stap:r(stap), nu:!!document.getElementById('nuinzw'),
                      nav:(nav&&nav.getBoundingClientRect().height)|0};
            }""")
            ok(label + ': Hal rendert', info.get('view') in (None, '', 'home') or info.get('stap'), info)
            ok(label + ': speel- of stapknop bestaat', bool(info.get('stap') and info['stap']['inDoc']), info)
            ok(label + ': menubalk aanwezig', (info.get('nav') or 0) >= 40, info)
            ok(label + ': geen JS-fouten', not pg.errs, pg.errs)
            pg.context.close()

        print('[offline] Hal blijft bruikbaar zonder netwerk')
        pg = app.open(basis())
        for _ in range(5):
            app.sluit(pg)
            pg.wait_for_timeout(120)
        pg.context.set_offline(True)
        pg.evaluate("typeof ga==='function'&&ga('home')")
        pg.wait_for_timeout(600)
        for _ in range(4):
            app.sluit(pg)
            pg.wait_for_timeout(120)
        off = pg.evaluate("""() => ({
          view:document.body.dataset.view,
          naam:S.naam, lvl:S.m3lvl, schilden:S.schilden,
          stap:!!(document.getElementById('stapknop')||document.getElementById('speelknop')),
          nu:!!document.getElementById('nuinzw')
        })""")
        ok('offline: voortgang heel', off['naam'] == 'Luna Leeflang' and off['lvl'] == 21 and off['schilden'] == 8, off)
        ok('offline: Hal heeft een stap', off['stap'] is True, off)
        ok('offline: geen JS-fouten', not pg.errs, pg.errs)
        pg.context.close()

        app.br.close()

    print()
    print(f'Robuusttest: {GOED} geslaagd, {FOUT} mislukt')
    return FOUT == 0


def server(root):
    class H(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **k):
            super().__init__(*a, directory=root, **k)
        def log_message(self, *a):
            pass
    # reuse 8765 if already up
    s = socket.socket(); s.settimeout(0.3)
    try:
        s.connect(('127.0.0.1', 8765)); s.close()
        return None, 'http://127.0.0.1:8765/index.html?v=v154rob'
    except Exception:
        pass
    httpd = http.server.ThreadingHTTPServer(('127.0.0.1', 0), H)
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    port = httpd.server_address[1]
    return httpd, f'http://127.0.0.1:{port}/index.html?v=v154rob'


if __name__ == '__main__':
    httpd, url = server(ROOT)
    try:
        sys.exit(0 if main(url) else 1)
    finally:
        if httpd:
            httpd.shutdown()
