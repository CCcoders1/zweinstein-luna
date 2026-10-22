#!/usr/bin/env python3
"""Speelbaarheids-sweep: alle levels met de greedy bot.
  python3 kalibratie/sweep.py            volledige sweep (alle levels, curve.json spellen) -> kalibratie/sweep-resultaat.json
  python3 kalibratie/sweep.py --snel     alleen levels waarvan de opbouw veranderde t.o.v. sweep-resultaat.json opnieuw spelen
  --van A --tot B --werkers N            deelbereik / aantal parallelle browsers
Daarna: python3 kalibratie/speelbaar.py (vlaggen, model, regels)."""
import json, sys, os, socket, threading, http.server, functools, time, argparse
from multiprocessing import Pool
HIER = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HIER)
UIT = os.path.join(HIER, 'sweep-resultaat.json'); CURVE = json.load(open(os.path.join(HIER, 'curve.json')))

def server():
    s = socket.socket(); s.bind(('127.0.0.1', 0)); p = s.getsockname()[1]; s.close()
    H = functools.partial(type('H', (http.server.SimpleHTTPRequestHandler,), {'log_message': lambda *a: None}), directory=ROOT)
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', p), H); threading.Thread(target=srv.serve_forever, daemon=True).start(); return p

def pagina(pw, poort):
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 390, 'height': 844}, service_workers='block')
    pg.route('**/*supabase.co/**', lambda r: r.abort())
    pg.goto(f'http://127.0.0.1:{poort}/index.html'); pg.wait_for_timeout(1500)
    pg.evaluate(open(os.path.join(HIER, 'speelbaar.js')).read() + ';0'); return br, pg

def werker(arg):
    poort, levels, per, hulp = arg
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        br, pg = pagina(pw, poort); uit = {}
        for i in range(0, len(levels), 10):
            uit.update(pg.evaluate(f'zwSpeel({json.dumps(levels[i:i+10])},{per},{hulp})'))
        br.close(); return uit

def sigs(poort, levels):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        br, pg = pagina(pw, poort); o = pg.evaluate(f'zwSig({json.dumps(levels)})'); br.close(); return o

def draai(poort, levels, per, hulp, werkers):
    delen = [levels[i::werkers] for i in range(werkers)]
    with Pool(werkers) as p:
        res = {}
        for r in p.imap_unordered(werker, [(poort, d, per, hulp) for d in delen if d]): res.update(r)
    return res

if __name__ == '__main__':
    a = argparse.ArgumentParser(); a.add_argument('--snel', action='store_true'); a.add_argument('--van', type=int, default=1); a.add_argument('--tot', type=int, default=600)
    a.add_argument('--werkers', type=int, default=max(1, (os.cpu_count() or 2) - 1)); o = a.parse_args()
    poort = server(); levels = list(range(o.van, o.tot + 1)); t = time.time(); sp = CURVE['spellen']
    if o.snel:
        oud = json.load(open(UIT)) if os.path.exists(UIT) else {}
        nu = sigs(poort, levels); anders = [n for n in levels if str(n) not in oud or oud[str(n)].get('sig') != nu[str(n)]]
        print(f'snelle check: {len(anders)} van {len(levels)} levels veranderd', flush=True)
        if anders:
            r = draai(poort, anders, sp['snel'], 0, o.werkers)
            for k, v in r.items(): v['snel'] = 1; v['hulp'] = oud.get(k, {}).get('hulp')
            oud.update(r)
        json.dump(oud, open(os.path.join(HIER, 'sweep-snel.json'), 'w'))
    else:
        r = draai(poort, levels, sp['geen'], sp['hulp'], o.werkers)
        oud = json.load(open(UIT)) if os.path.exists(UIT) else {}
        oud.update(r); json.dump(dict(sorted(oud.items(), key=lambda x: int(x[0]))), open(UIT, 'w'), indent=0)
    print(f'klaar in {time.time()-t:.0f} s', flush=True)
