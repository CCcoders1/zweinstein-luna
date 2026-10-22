#!/usr/bin/env python3
"""Legt kalibratie/sweep-resultaat.json tegen kalibratie/curve.json: banden (met zwaar-correctie), bodem, buurregel.
Fit een eenvoudig lineair model (winkans ~ kenmerken) om oorzaken en fix-voorstellen te schatten.
  python3 kalibratie/speelbaar.py [resultaat.json] [--json uit.json]"""
import json, os, sys, statistics as st
import numpy as np
HIER = os.path.dirname(os.path.abspath(__file__))
args = [a for i, a in enumerate(sys.argv[1:], 1) if not a.startswith('--') and sys.argv[i-1] != '--json']
R = json.load(open(args[0] if args else os.path.join(HIER, 'sweep-resultaat.json')))
C = json.load(open(os.path.join(HIER, 'curve.json')))
L = sorted((v for v in R.values()), key=lambda v: v['n']); vrij = set(C['vrij']['levels'])
def band(n): return next(b for b in C['banden'] if b['van'] <= n <= b['tot'])
def corr(v): return C['zwaar'].get(str(v['zw']), 0) if v['zw'] else 0
# kenmerken per zet
NAMEN = ['potten', 'onkruidlagen/zet', 'kistlagen/zet', 'kleurstukjes/zet', 'kleuren', 'aantal doelen', 'strikken/zet']
def X(v): Z = max(1, v['Z']); return [v['pot'], v['onkruidLaag'] / Z, v['kistLaag'] / Z, v['kleurN'] / Z, v['kleuren'], v['nDoel'], v['strik'] / Z]
fit = [v for v in L if v['n'] not in vrij]
A = np.array([X(v) + [1] for v in fit]); y = np.array([v['win'] for v in fit])
coef, *_ = np.linalg.lstsq(A, y, rcond=None); pred = A @ coef; r2 = 1 - ((y - pred) ** 2).sum() / ((y - y.mean()) ** 2).sum()
gem = A[:, :-1].mean(0)
def dZ(v):  # effect van +1 zet op voorspelde winkans
    x = np.array(X(v)); Z = v['Z']; x2 = np.array(X({**v, 'Z': Z + 1})); return float((x2 - x) @ coef[:-1])
uit = []
for i, v in enumerate(L):
    n = v['n']
    if n in vrij: continue
    b = band(n); c = corr(v); mn = b['geen'][0] - c; mx = b['geen'][1]; mnh = b['hulp'][0] - c
    buren = [w for w in L if w['n'] != n and abs(w['n'] - n) <= C['buur']['straal'] and w['n'] not in vrij]
    med = st.median([w['win'] + corr(w) for w in buren]) if buren else None
    redenen = []
    if v['win'] < mn: redenen.append(f"onder band ({v['win']:.0%} < {mn:.0%})")
    if v['win'] < C['bodem']['geen']: redenen.append('onder bodem')
    if v.get('hulp') is not None and v['hulp'] < mnh: redenen.append(f"met hulp onder band ({v['hulp']:.0%} < {mnh:.0%})")
    if med is not None and v['win'] + c < med - C['buur']['max_onder']: redenen.append(f"buurregel ({v['win']+c:.0%} vs mediaan {med:.0%})")
    if not redenen: continue
    # oorzaak: grootste negatieve bijdrage t.o.v. gemiddeld level
    bij = (np.array(X(v)) - gem) * coef[:-1]; o = int(np.argmin(bij))
    nodig = max(mn, (med - C['buur']['max_onder'] - c) if med is not None else 0) - v['win']
    dz = dZ(v); zet = int(np.ceil(nodig / dz)) if dz > 0.002 else 99
    if v['plaag']: fix = f"plaag-level ({v['plaag']}): bot speelt deze mechaniek slecht, met de hand testen"
    elif NAMEN[o] == 'potten' and v['pot'] >= 2: fix = f"1 pot minder ({v['pot']}→{v['pot']-1})"
    elif NAMEN[o] == 'onkruidlagen/zet': fix = f"lichter onkruidpatroon (nu {v['onkruidLaag']} lagen)"
    elif NAMEN[o] == 'kistlagen/zet': fix = f"lichtere kisten (nu {v['kistLaag']} lagen)"
    elif NAMEN[o] == 'kleurstukjes/zet': fix = f"kleurdoel ~20% lager (nu {v['kleurN']})"
    elif NAMEN[o] == 'kleuren' and v['kleuren'] > 5: fix = f"1 kleur minder ({v['kleuren']}→{v['kleuren']-1})"
    else: fix = None
    if nodig <= 0 and v.get('hulp') is not None: nodig = (mnh - v['hulp']) * 0.6
    zfix = f"+{max(1, zet)} zetten" if 0 < zet <= 10 else None
    if v['plaag']: zfix = None
    voorstel = ' of '.join(x for x in [fix, zfix] if x) or 'handmatig bekijken'
    uit.append({'n': n, 'win': v['win'], 'hulp': v.get('hulp'), 's3': v['s3'], 'zw': v['zw'], 'band': f"{mn:.0%}-{mx:.0%}", 'mediaan': med,
                'Z': v['Z'], 'doelen': v['doelen'], 'pot': v['pot'], 'onkruid': v['onkruidLaag'], 'kist': v['kistLaag'], 'kleurN': v['kleurN'],
                'redenen': redenen, 'ernst': 'A' if any(r.startswith(('onder bodem', 'buurregel')) for r in redenen) else 'B' if any(r.startswith('onder band') for r in redenen) else 'C', 'plaag': v['plaag'], 'oorzaak': NAMEN[o], 'voorstel': voorstel, 'tekort': nodig})
te_makkelijk = [v['n'] for v in L if v['n'] not in vrij and v['win'] > band(v['n'])['geen'][1]]
print(f"levels {L[0]['n']}-{L[-1]['n']}: {len(L)} · gevlagd {len(uit)} · te makkelijk (info) {len(te_makkelijk)} · model R² {r2:.2f}")
print('ernst A (onder bodem of buurregel):', sum(u['ernst'] == 'A' for u in uit), '· B (onder band):', sum(u['ernst'] == 'B' for u in uit), '· C (alleen met hulp te laag):', sum(u['ernst'] == 'C' for u in uit))
for b in C['banden']:
    w = [v['win'] for v in L if b['van'] <= v['n'] <= b['tot'] and not v['zw'] and not v['plaag'] and v['n'] not in vrij]
    wz = [v['win'] for v in L if b['van'] <= v['n'] <= b['tot'] and v['zw']]
    if w: print(f"band {b['van']}-{b['tot']}: mediaan normaal {st.median(w):.0%} (n={len(w)})" + (f", zwaar {st.median(wz):.0%} (n={len(wz)})" if wz else ''))
print('model (winkans per eenheid):', ', '.join(f"{k} {c:+.3f}" for k, c in zip(NAMEN, coef[:-1])))
for u in sorted(uit, key=lambda u: (u['ernst'], -u['tekort'])):
    print(f"{u['ernst']} L{u['n']:>3} zw{u['zw']} win {u['win']:.0%} hulp {u['hulp'] if u['hulp'] is None else format(u['hulp'],'.0%')} band {u['band']} | Z{u['Z']} {u['doelen']} pot{u['pot']} onkr{u['onkruid']} kist{u['kist']} | {'; '.join(u['redenen'])} | oorzaak {u['oorzaak']} → {u['voorstel']}")
if '--json' in sys.argv:
    json.dump({'gevlagd': uit, 'makkelijk': te_makkelijk, 'coef': dict(zip(NAMEN, map(float, coef[:-1]))), 'r2': r2}, open(sys.argv[sys.argv.index('--json') + 1], 'w'), indent=1)
