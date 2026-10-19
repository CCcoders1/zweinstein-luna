import json,time,sys
from playwright.sync_api import sync_playwright
levels=json.loads(sys.argv[1]);per=int(sys.argv[2]);out=sys.argv[3]
with sync_playwright() as pw:
 br=pw.chromium.launch();ctx=br.new_context(viewport={'width':390,'height':844},service_workers='block');pg=ctx.new_page();E=pg.evaluate
 pg.route('**/*supabase.co/**',lambda r:r.abort())
 pg.goto('http://localhost:8765/index.html');pg.wait_for_timeout(1500)
 E(open('kalibratie/bot.js').read()+';0')
 t=time.time();res=E(f"zwBot({json.dumps(levels)},{per})");print('tijd',round(time.time()-t,1),'s',len(res),flush=True)
 json.dump(res,open(out,'w'));br.close()
