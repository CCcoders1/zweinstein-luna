import json,sys
R=json.load(open(sys.argv[1]));a2=float(sys.argv[2]) if len(sys.argv)>2 else 70;a3=float(sys.argv[3]) if len(sys.argv)>3 else 100;hz=float(sys.argv[4]) if len(sys.argv)>4 else .85
def ster(r):
 f=hz if r['zw'] else 1
 return 3 if r['s']>=r['Z']*a3*f else 2 if r['s']>=r['Z']*a2*f else 1
def band(r):
 n=r['n']
 if r['zw']:return 'zwaar'
 return 'vroeg 1-30' if n<=30 else 'midden 31-150' if n<=150 else 'laat 151-350' if n<=350 else 'eind 351-600'
B={}
for r in R:
 B.setdefault(band(r),[]).append(r);B.setdefault('ALLES',[]).append(r)
for k,v in B.items():
 w=[r for r in v if r['won']]
 if not w:print(k,'geen wins');continue
 s=[ster(r) for r in w];n=len(w)
 print(f"{k:15} spellen {len(v):5} wins {n:5} ({100*n/len(v):.0f}%)  3★ {100*s.count(3)/n:4.0f}%  2★ {100*s.count(2)/n:4.0f}%  1★ {100*s.count(1)/n:4.0f}%  gem {sum(s)/n:.2f}  score/Z med {sorted(r['s']/r['Z'] for r in w)[n//2]:.0f}  over {sum(r['over'] for r in w)/n:.1f}")
