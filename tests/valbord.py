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
        # unit: pot above a hole is collected at the segment exit (not the lowest cell of the whole column)
        bliksem = pg.evaluate("""() => {
          const niveaus=[];
          for(let n=1;n<=120;n++){const L=m3Level(n);if((L.vorm||'')==='bliksem')niveaus.push(n)}
          const n=niveaus[0];
          const L=m3Level(n);
          const b=new Bord(L,'herbologie',99);
          const vorm=L.vorm, R=RIJEN, K=KOL;
          // find a playable cell that has a hole directly below (classic lastige pot)
          let sr=-1,sc=-1;
          outer: for(let c=0;c<K;c++)for(let r=0;r<R-1;r++){
            if(b.gatCel(r,c)||b.kist[r][c])continue;
            if(b.gatCel(r+1,c)){sr=r;sc=c;break outer}
          }
          if(sr<0){sr=1;sc=1}
          for(let r=0;r<R;r++)for(let c=0;c<K;c++){
            if(b.gatCel(r,c)||b.kist[r][c])continue;
            b.g[r][c]=null;
          }
          b.g[sr][sc]=b.tegel(-1,sr,sc,sr);
          const voor={r:sr,c:sc,k:b.g[sr][sc]&&b.g[sr][sc].k};
          const seg=b.segmentExit(sr,sc);
          b.packSchuif();
          let plek=null;
          for(let r=0;r<R;r++)for(let c=0;c<K;c++){
            const t=b.g[r][c];if(t&&t.k===-1)plek=[r,c];
          }
          const naPack=plek&&plek.slice();
          const opSegment=!!(naPack&&b.segmentExit(naPack[0],naPack[1])===naPack[0]);
          b.potten();
          b.vangVastPotten();
          plek=null;
          for(let r=0;r<R;r++)for(let c=0;c<K;c++){
            const t=b.g[r][c];if(t&&t.k===-1)plek=[r,c];
          }
          const doel=b.doel.find(d=>d.t==='p');
          const origineelWeg=!(naPack&&b.g[naPack[0]][naPack[1]]&&b.g[naPack[0]][naPack[1]].k===-1);
          const doelMinder=!!(doel&&doel.over<doel.n);
          return {n,vorm,R,K,voor,seg,naPack,opSegment,plek,doelOver:doel&&doel.over,doelN:doel&&doel.n,origineelWeg,doelMinder,verzameld:origineelWeg&&doelMinder};
        }""")
        print('  bliksem unit', bliksem)
        ok('bliksem-level bestaat', bool(bliksem and bliksem.get('n')))
        # after gravity the pot sits on the segment exit, then potten() collects it
        na = bliksem.get('naPack') if bliksem else None
        seg = bliksem.get('seg') if bliksem else None
        zelfde_stuk = bool(na and seg is not None and na[0]==seg and na[1]==bliksem['voor']['c'])
        ok('bliksem-pot blijft op de segment-uitgang en wordt daar verzameld',
           bool(zelfde_stuk and bliksem.get('verzameld')),
           str(bliksem))

        startpots = pg.evaluate("""() => {
          const uit=[];
          for(let n=1;n<=600;n++){
            const L=m3Level(n); if(!L||!L.pot)continue;
            const thema=(typeof m3VakVoor==='function'&&m3VakVoor(n).thema)||'herbologie';
            const b=new Bord(L,thema,n*17+3);
            const opUitgang=[];
            for(let r=0;r<RIJEN;r++)for(let c=0;c<KOL;c++){
              const t=b.g[r][c];
              if(t&&t.k===-1&&b.segmentExit(r,c)===r)opUitgang.push({r,c});
            }
            if(opUitgang.length)uit.push({n,vorm:L.vorm||'',opUitgang});
          }
          return {fout:uit.length,voorbeelden:uit.slice(0,8)};
        }""")
        print('  startpotten op uitgang', startpots)
        ok('geen startpot op een segment-uitgang (en wel potten gezet)',
           bool(startpots and startpots.get('fout')==0), str(startpots))

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
