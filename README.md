# Zweinstein Luna

Een Nederlandstalige match-3-PWA (vanilla JS), gehost op GitHub Pages.

## Economie (huisschilden) — regels

- Huisschilden komen **alleen** uit gewonnen levels: 1 per ster, max 3 per level; opnieuw spelen geeft alleen het verschil.
- Sterren komen uit de eindscore: 2★ vanaf zetten×70, 3★ vanaf zetten×95 (levels 1–30: ×150), zware levels ×0,85. Bestaande sterren gaan nooit omlaag.
- Een schooldag gaat pas door als alle 10 hersteldoelen af zijn **en** het laatste level van die dag gewonnen is (zelfherstel bij laden).
- Bij elke nieuwe schooldag gaan hooguit 5 schilden mee; de rest wordt 10 Smekkies per schild (één keer per dag, `S.wisselTot`).
- Winst wordt bij het winmoment meteen vastgelegd (`S.winBezig`); het eindfeest kan alleen sterren/schilden toevoegen. Wordt de app tijdens het feest gesloten, dan maakt `ECO.winHerstel` de winst bij de volgende start af met de score van het winmoment (één keer).
- Levels met sterren maar zonder vastgelegde schilden (oude saves) gelden als al uitbetaald (`lvSchild = lvSter`).
- Kosten per dag: dag 1 = 20, daarna 45. De ranglijst telt verdiende schilden (som van beste sterren), niet het saldo.

Alles loopt via `economie.js`: `ECO.geefLevel` (uitbetalen), `ECO.betaal` (uitgeven), `ECO.dagWissel` (nieuwe dag / overschot), `ECO.check` (invarianten, stil herstel, afwijkingen als `A`-regel in het speellog). Schrijf nergens anders naar `S.schilden`, `S.lvSter`, `S.lvSchild`, `S.schoolDag` of `S.wisselTot`; de test controleert dat.

## Vóór elke release

```bash
pip install playwright && python3 -m playwright install chromium   # eenmalig
bash tests/release.sh
```

Dit controleert de syntax, of `versie.js` en de cache in `sw.js` gelijk zijn, of elk script in `sw.js` staat, draait `tests/economie.py` (audit + browserscenario's: haar save-standen, herspelen, dubbel tikken, uitgeven, dagovergang, kapotte en oude saves, Spijbel, twee tabbladen, onderbroken eindfeest, oude saves zonder lvSchild, klok verzetten, events zonder schilden, echt level met eindfeest) en maakt pas daarna `../magische-app.zip`.
