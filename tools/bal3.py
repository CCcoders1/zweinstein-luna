from playwright.sync_api import sync_playwright
import json,time
JS="""async([a,b])=>{const SE=[21,22,23,24,25,26,27,28,29,30,31,32];
 const sim=async(L,th,z)=>{let w=0;for(const p of SE){const bd=new Bord({...L,zetten:Math.round(z/.8),extra:0},th,p);let v=0;while(bd.zet>0&&!bd.klaar()&&v++<160){const m=m3BesteZet(bd);if(!m)break;await bd.wissel(m[0],m[1])}if(bd.klaar())w++}return w/SE.length};
 const doel=n=>{const d=(n-1)%100;if(d<10)return .85;if(n%100==0)return .5;if(n%10==6)return .5;if(n%10==7)return .9;return .7};
 const ZS=[15,17,19,21,23,25,27,29,31,33,35,38,41,44,48];const o={};
 for(let n=a;n<=b;n++){const th=m3VakVoor(n).thema;const T=doel(n);let res=null;
  for(const mild of [0,1,2,3]){M3BAL[n]=[0,mild,0];const L=m3Level(n);const c={};const f=async i=>c[i]!=null?c[i]:(c[i]=await sim(L,th,ZS[i]));
   if(await f(ZS.length-1)<T){if(mild==3)res=[48,3,await f(ZS.length-1),T];continue}
   let lo=0,hi=ZS.length-1;while(lo<hi){const m=(lo+hi)>>1;if(await f(m)>=T)hi=m;else lo=m+1}res=[ZS[lo],mild,await f(lo),T];break}
  o[n]=res}return o}"""
with sync_playwright() as p:
 b=p.chromium.launch();pg=b.new_page();pg.goto('file:///workspace/magische-app/index.html');pg.wait_for_timeout(2500)
 pg.evaluate("window._balSim=1;S.m3kal={};M3BAL={}")
 o={};t=time.time()
 for a in range(1,601,20):
  o.update(pg.evaluate(JS,[a,a+19]))
 print('tijd',round(time.time()-t))
 base=pg.evaluate("(()=>{window.M3BAL={};const r={};for(let n=1;n<=600;n++)r[n]=m3Level(n).zetten;return r})()")
 json.dump({'o':o,'base':base},open('bal3.json','w'))
data={}
for n in range(1,601):
 z,m,w,T=o[str(n)]
 if n<=30:z=max(z,base[str(n)]) if False else z
 data[n]=[z-base[str(n)],m,round(w,2)]
open('/workspace/magische-app/balans-data.js','w').write('/* gegenereerd door bal3.py: [extraZetten, mild, verwachteWinkans] */\nwindow.M3BAL='+json.dumps(data,separators=(',',':'))+';\n')
fail=[n for n in range(1,601) if o[str(n)][2]<o[str(n)][3]];print('doel niet gehaald',len(fail),fail)
