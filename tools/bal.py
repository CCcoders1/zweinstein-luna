from playwright.sync_api import sync_playwright
import json,time
JS="""async([a,b])=>{const SEEDS=8;const sim=async(L,th)=>{let w=0,rest=0;for(let p=1;p<=SEEDS;p++){const bd=new Bord(L,th,p);let v=0;while(bd.zet>0&&!bd.klaar()&&v++<160){const z=m3BesteZet(bd);if(!z)break;await bd.wissel(z[0],z[1])}if(bd.klaar()){w++;rest+=bd.zet}}return [w/SEEDS,rest]};
 const doel=n=>{const d=(n-1)%100;if(d<8)return .5;if(n%100==0)return .125;if(n%10==6)return .125;if(n%10==7)return .5;return .25};
 const ES=[-10,-8,-6,-4,-2,0,2,4,6,9,12,16,20,25,30,40,55];const out={};
 for(let n=a;n<=b;n++){const L0={...m3Level(n)};const th=m3VakVoor(n).thema;const base=L0.zetten;const T=doel(n);const cache={};
  const f=async i=>{if(cache[i])return cache[i];const z=Math.max(12,base+ES[i]);return cache[i]=await sim({...L0,zetten:z,extra:0},th)};
  let lo=0,hi=ES.length-1;if((await f(hi))[0]<T){out[n]=[ES[hi],(await f(hi))[0],T,base];continue}
  while(lo<hi){const m=(lo+hi)>>1;if((await f(m))[0]>=T)hi=m;else lo=m+1}
  out[n]=[Math.max(12,base+ES[lo])-base,(await f(lo))[0],T,base]}
 return out}"""
with sync_playwright() as p:
 b=p.chromium.launch();pg=b.new_page();pg.goto('file:///workspace/magische-app/index.html');pg.wait_for_timeout(2500)
 pg.evaluate("S.m3kal={}")
 res={};t=time.time()
 for a in range(1,601,25):
  res.update(pg.evaluate(JS,[a,a+24]));print(a,round(time.time()-t),flush=True)
 json.dump(res,open('bal.json','w'))
