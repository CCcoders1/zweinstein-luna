#!/usr/bin/env bash
# Pre-release check + zip. Gebruik:  bash tests/release.sh  (vanuit de repo-map)
# Stopt bij de eerste fout; maakt de zip alleen als alles groen is.
set -euo pipefail
cd "$(dirname "$0")/.."
echo "== syntax"; for f in *.js; do node --check "$f"; done
V=$(grep -o "VERSIE='v[0-9]*'" versie.js | grep -o "v[0-9]*"); C=$(grep -o "zweinstein-v[0-9]*" sw.js | head -1 | grep -o "v[0-9]*")
echo "== versie: versie.js $V, sw.js $C"; [ "$V" = "$C" ] || { echo "FOUT: versie.js en sw.js-cache verschillen"; exit 1; }
for f in $(grep -o 'src="[^"]*\.js"' index.html | cut -d'"' -f2); do grep -q "\"$f\"" sw.js || { echo "FOUT: $f staat niet in sw.js"; exit 1; }; done
echo "== economietest"; python3 tests/economie.py
[ -z "$(git status --porcelain)" ] || { echo "LET OP: niet-gecommitte wijzigingen; de zip bevat alleen HEAD"; }
git archive -o ../magische-app.zip HEAD && echo "== zip: ../magische-app.zip ($(git log --oneline -1))"
