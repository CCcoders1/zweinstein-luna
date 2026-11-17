#!/usr/bin/env python3
"""v196: elke pot heeft een valroute, geen speelcel blijft onbereikbaar,
bliksem-zwaartekracht laat een pot door een gat vallen."""
import json, os, sys, http.server, socket, threading
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

def server():
    os.chdir(ROOT)
    class H(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = http.server.ThreadingHTTPServer(('127.0.0.1', 0), H)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd

SAVE = {
    'tut': 9, 'naam': 'Luna Leeflang', 'huis': 'huffelpuf', 'intro': 1,
    'm3lvl': 600, 'schoolDag': 29, 'schilden': 200, 'galjoenen': 5000,
    'harten': {'n': 5, 't': 0},
    'lvSter': {str(i): 2 for i in range(1, 601)},
    'lvSchild': {str(i): 2 for i in range(1, 601)},
    'kalV191': 1, 'kalV193': 1,
    'uitleg': {'match3': 1, 'pad': 1},
    'mkUitleg': 1, 'gpMelding': 1,
}

def main():
    httpd = server()
    port = httpd.server_address[1]
    url = f'http://127.0.0.1:{port}/index.html?test=valbord'
    with sync_playwright() as pw:
        try:
            br = pw.chromium.launch()
        except Exception:
            br = pw.chromium.launch(executable_path='/usr/bin/google-chrome',
                                    args=['--no-sandbox', '--disable-dev-shm-usage'])
        ctx = br.new_context(viewport={'width': 390, 'height': 844},
                             service_workers='block', locale='nl-NL',
                             timezone_id='Europe/Amsterdam')
        ctx.add_init_script(
            "localStorage.clear();localStorage.setItem('zweinstein_v1',%s)"
            % json.dumps(json.dumps(SAVE))
        )
        ctx.route('**/*supabase.co/**', lambda r: r.abort())
        pg = ctx.new_page()
        pg.goto(url, wait_until='domcontentloaded')
        pg.wait_for_function('() => typeof m3ValCheckAlles==="function" && typeof Bord==="function"', timeout=30000)
        # unit: bliksem col 5, pot at r1 must reach exit / be collected
        bliksem = pg.evaluate("""() => {
          const niveaus=[];
          for(let n=1;n<=120;n++){const L=m3Level(n);if((L.vorm||'')==='bliksem')niveaus.push(n)}
          const n=niveaus[0];
          const L=m3Level(n);
          const b=new Bord(L,'herbologie',99);
          const vorm=L.vorm, R=RIJEN, K=KOL;
          const gat=[], play=[];
          for(let r=0;r<R;r++)for(let c=0;c<K;c++){
            if(b.gatCel(r,c))gat.push([r,c]); else if(!b.kist[r][c])play.push([r,c]);
          }
          // force pot at r=1,c=5 if playable else first playable in col 5
          let sr=1,sc=5;
          if(b.gatCel(sr,sc)||!b.g[sr]||!b.g[sr][sc]){
            for(let r=0;r<R;r++)if(!b.gatCel(r,5)&&b.g[r]&&b.g[r][5]){sr=r;break}
          }
          for(let r=0;r<R;r++)for(let c=0;c<K;c++){
            if(b.gatCel(r,c)||b.kist[r][c])continue;
            b.g[r][c]=null;
          }
          b.g[sr][sc]=b.tegel(-1,sr,sc,sr);
          const voor={r:sr,c:sc,k:b.g[sr][sc]&&b.g[sr][sc].k};
          b.packSchuif();
          let plek=null;
          for(let r=0;r<R;r++)for(let c=0;c<K;c++){
            const t=b.g[r][c];if(t&&t.k===-1)plek=[r,c];
          }
          const naPack=plek&&plek.slice();
          b.potten();
          b.vangVastPotten();
          plek=null;
          for(let r=0;r<R;r++)for(let c=0;c<K;c++){
            const t=b.g[r][c];if(t&&t.k===-1)plek=[r,c];
          }
          const doel=b.doel.find(d=>d.t==='p');
          return {n,vorm,R,K,voor,naPack,plek,doelOver:doel&&doel.over,doelN:doel&&doel.n,exit5:b.kolomExit(5),exit6:b.kolomExit(6)};
        }""")
        print('  bliksem unit', bliksem)
        ok('bliksem-level bestaat', bool(bliksem and bliksem.get('n')))
        # pot should be collected (gone) or sitting on the column exit
        na = bliksem.get('naPack')
        exit5 = bliksem.get('exit5')
        op_exit = bool(na and na[1]==5 and na[0]==exit5)
        ok('bliksem-pot valt door het gat naar de kolom-exit', op_exit, str(bliksem))

        rapport = pg.evaluate('() => m3ValCheckAlles(1,600)')
        print('  validator fouten', rapport.get('fout'), 'van', rapport.get('totaal'))
        if rapport.get('levels'):
            for item in rapport['levels'][:12]:
                print('   ', item['n'], item.get('vorm'), item['issues'][:4])
            if len(rapport['levels'])>12:
                print('    …', len(rapport['levels'])-12, 'meer')
        ok('validator 1-600 zonder harde fouten', rapport.get('fout')==0, str(rapport.get('fout')))
        # soft: pot-wacht-kist is informational — treat only pot-vast-vorm, onbereikbaar, geen-pot-spawn, pot-sim-vast as hard
        # (m3ValCheck already puts all in issues and ok=!issues.length). If only wacht-kist, we may need to relax.
        br.close()
    print(f'\n{GOED} geslaagd, {FOUT} mislukt')
    return 1 if FOUT else 0

if __name__ == '__main__':
    sys.exit(main())
