from playwright.sync_api import sync_playwright
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
TOOLS=Path(__file__).resolve().parent
JS="""async([a,b])=>{const o={};for(let n=a;n<=b;n++){const L={...m3Level(n),extra:0};const th=m3VakVoor(n).thema;const zh=Math.round(L.zetten/.8);let w=0,wb=0;for(let p=11;p<=18;p++){for(const [z,k] of [[zh,'h'],[L.zetten,'b']]){const bd=new Bord({...L,zetten:z},th,p);let v=0;while(bd.zet>0&&!bd.klaar()&&v++<160){const m=m3BesteZet(bd);if(!m)break;await bd.wissel(m[0],m[1])}if(bd.klaar()){if(k=='h')w++;else wb++}}}o[n]=[L.zetten,w/8,wb/8]}return o}"""
with sync_playwright() as p:
 b=p.chromium.launch();pg=b.new_page();pg.goto((ROOT/'index.html').as_uri());pg.wait_for_timeout(2500)
 o={}
 for a in range(1,601,50):o.update(pg.evaluate(JS,[a,a+49]))
 json.dump(o,(TOOLS/'val.json').open('w'))
 nul=[n for n in o if o[n][1]==0];print('mens-proxy 0 winst:',len(nul),nul[:40])
 for a in range(1,601,50):
  s=[o[str(n)] for n in range(a,a+50)];print(f"{a}-{a+49}: zetten {sum(x[0] for x in s)/50:.1f}  winkans(mens-proxy) {sum(x[1] for x in s)/50:.0%}  bot {sum(x[2] for x in s)/50:.0%}  moeilijk(<40%) {sum(1 for x in s if x[1]<.4)}")
