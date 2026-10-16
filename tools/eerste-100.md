# Eerste 100 levels — inhouds- en balansnotitie

De eerste 100 levels zijn Herbologie bij professor Pomona Stronk (`M3VAKKEN`, level 1–100). Bezweringen begint op 101. Toverdranken begint op 201 en gebruikt hetzelfde receptenboek. De verhaallijn heeft nu 30 schooldagen van 20 levels: vijf dagen per vak en tien hersteldoelen per dag. De opdrachten en dialogen staan in `schooldagen.js`.

Elke schooldag heeft tien unieke lokaalopdrachten: vijf kosten 1 ster en vijf kosten 3 sterren. Alle tien kosten samen 20 sterren. Een level levert een ster op; het volgende blok van 20 levels opent pas als de huidige levels en de tien opdrachten klaar zijn. De gouden stippellijn op de kaart markeert de daggrens.

## Wat er al staat

- Vijf harten, één hart per 20 minuten terug. Ze staan als een kleine regel op het startkaartje. Tijdens het bord zie je ze niet.
- Level 1–30 zijn met de hand gezet. Vanaf 31 kiest het spel zelf. Vanaf 46 worden het 7 kleuren, en de kalibratie kan er tot 30 zetten bij doen.
- Na level 30 houdt de groene kruidenpot het volgende level tegen tot hij gekocht is (500 Smekkies).
- Oogst ligt al in `S.oogst`. Groeitijden die we voor de mix gebruiken: valeriaan 15 minuten, alsem 45 minuten, affodil 60 minuten, mandragora 4 uur.
- Onder in de eigen kas staat de balk met Potten, Smekkies, zaadjes, mest en boosters (`mk-balk`). Daar komen het boek en de kist bij.
- Duivelsstrik en de Giftige Tentacula horen in de groene pot. Op het bord is duivelsstrik een aparte plaag, geen gewone onkruidtegel.

## 1. Vijf levens, groot bij de start

- Op het startscherm vallen vijf grote harten één voor één in, vóór **Spelen** aangaat.
- Dezelfde vijf blijven klein in de hoek tijdens het bord.
- Bij verlies breekt één hart, daarna pas het scherm Bijna.
- Op 0 levens gaat het level niet aan. Een bonusspel geeft geen extra hart.

## 2. Moeilijkheid

Tussen de plaaglevels door blijven gewone levels, zodat je Smekkies kunt verdienen voor zaad. De plaaglevels zelf zijn de muur.

Zonder de mix is zo’n level niet te halen: de duivelsstrik bedekt het bord voor je de doelen af hebt. Met de mix gaat 75% eraf en is het nog steeds zwaar, ook als je boosters meehebt. De rest groeit elke beurt. Boosters helpen, ze maken het niet makkelijk. Wie geen boosters meer heeft, moet in de kas zaad kopen en planten.

In de eerste 100 levels blijven gewone levels op 6 kleuren. 7 kleuren alleen op de plaaglevels 74, 88 en 100. Kalibratie voegt daar hooguit 6 zetten aan toe.

| Levels | Karakter |
| --- | --- |
| 1–11 | wennen, 5 kleuren, één doel |
| 12 | les: het recept Lichtbrouwsel komt in het boek |
| 13–21 | gewone levels, tijd om te zaaien |
| 22, 35, 48, 61 | plaaglevel, Lichtbrouwsel verplicht |
| 29–30 | drie doelen, daarna de groene pot |
| 62–73 | gewone levels, tijd voor mandragora |
| 74, 88, 100 | zware plaag, Diep Lichtbrouwsel verplicht |
| 100 | examen, daarna pas Bezweringen |

## 3. Duivelsstrik op het bord

Nieuwe tegel, los van het gewone onkruid. Ze zit aan het begin op een vast patroon.

Elke beurt, nadat de stenen gevallen zijn, groeit ze één vakje naar een buur die nog vrij is. Op 74, 88 en 100 groeit ze twee vakjes per beurt. Een vakje met duivelsstrik blokkeert. Je haalt haar weg door ernaast te matchen, maar ze komt terug zolang er een wortel blijft staan.

Het level mag altijd starten. Professor Stronk vraagt elke keer, ook bij een herhaling:

“Juffrouw Leeflang, heb je je Lichtbrouwsel meegenomen?”

Op 74, 88 en 100 vraagt ze naar Diep Lichtbrouwsel.

- Staat het flesje in de kist, dan gaat het eraf en verdwijnt meteen 75% van de strik. De overige 25% blijft staan en groeit daarna elke beurt.
- Staat het er niet, dan kun je **Toch starten** of **Naar de kas** kiezen. Zonder flesje blijft 100% staan en groeit die elke beurt. Het bord sluit dicht voor de doelen gehaald zijn.

Eén flesje per poging. Mislukken kost het flesje en één leven. Je brouwt een nieuw flesje uit nieuwe oogst.

## 4. Recepten

Het boek legt in gewone zinnen uit wat de planten in de boeken doen. De mengsels zelf zijn van dit spel. Het krijtbord op `img/laadschermen/herbologie.webp` noemt Mandelwortel, Flutterby-struik en Duivelsklem. Die namen gebruiken we niet. De gillende plant is de Mandragora. De plant rechts is Duivelsstrik.

**Lichtbrouwsel.** 1 valeriaan, 1 alsem, 1 affodil.

Valeriaan zodat je kalm blijft en niet trekt. Alsem voor de warmte. Affodil voor het licht. Duivelsstrik houdt van donker en vocht en wikkelt strakker als je spartelt. Hermelien Griffel kwam los met blauwe vlammen, in het Verboden Bos, op weg naar de Steen der Wijzen. Het brouwsel haalt 75% weg. De rest moet je zelf bijhouden.

Langste groeitijd is de affodil: 60 minuten. Zaad kost samen 35 Smekkies.

**Diep Lichtbrouwsel.** 1 Lichtbrouwsel en 1 mandragora.

Voor de zware plaag. Doet hetzelfde: 75% weg. De rest groeit twee vakjes per beurt, dus ook met boosters blijft het knap lastig. De mandragora doet er 4 uur over. Een volgroeide Mandragora krijst dodelijk, een jonge maakt je uren bewusteloos, en haar sap wekt iemand die versteend is. Daarom staan de oorwarmers in het boek naast dit recept.

**Later, in Toverdranken, dezelfde kist en hetzelfde boek.** Sneep vraagt daar op dezelfde manier of je het flesje bij je hebt. Eerste recept dat hij toevoegt: affodilwortel in een aftreksel van alsem, het Vocht van de Levende Dood. Zonder dat flesje is zijn plaaglevel niet te halen. Monnikskap en wolfswortel komen als dezelfde plant in het boek, als zijn strikvraag. Nieuwe recepten krijgen een les en genoeg groeitijd vóór het level dat ze eist.

## 5. Boek en kist in de kas

In de kamer, naast de kleine tafel met de potten: een receptenboek en een kleine ingrediëntenkist. Onder in het kasenscherm, op de balk, de twee dezelfde dingen als logo. Tikken opent hetzelfde scherm.

Het boek toont de recepten die je al hebt, met de drie plantjes, de zin uit de les, en een knop **Brouwen** als de kist genoeg oogst heeft. Latere recepten staan grijs, met de regel bij welk vak ze horen.

De kist toont de oogst per plant (`S.oogst`). Oogsten uit een pot legt de plant daar in. Brouwen haalt de planten eruit en legt het flesje erbij. Een plaaglevel haalt het flesje er pas uit als je Stronk ja antwoordt.

## 6. Les op het kasplaatje

Achtergrond `img/laadschermen/herbologie.webp`. Stronk en Luna om de beurt. Na level 12 gaat het boek open op Lichtbrouwsel. Het volgende level blijft speelbaar. De muur is level 22, niet een dichte deur.

### Na level 12

Stronk: Zie je de ranken rechts? Duivelsstrik. Donker en vocht. Hoe harder je trekt, hoe strakker hij pakt.

Luna: En als het bord er vol mee staat?

Stronk: Dan heb je Lichtbrouwsel nodig. Eén valeriaan, één alsem, één affodil. Dat haalt driekwart weg. De rest groeit elke beurt, dus je moet blijven kijken. Zonder flesje hoef je niet te beginnen. Het level gaat wel open. Ik vraag het je toch.

Luna: Eerst Smekkies, dan zaad, dan wachten tot de affodil bloeit.

Stronk: Juist. Het recept staat in het boek naast je potten, en de oogst bewaar je in de kist ernaast.

### Na level 30, na de groene pot

Stronk: Duivelsstrik en de Giftige Tentacula willen alleen in deze pot. Op het bord is die strik een plaag. In de pot is het een plant. Allebei laat je met rust tot je weet wat je doet.

### Na level 60

Stronk: Voor de zware kassen komt er mandragora bij het Lichtbrouwsel. Dat is Diep Lichtbrouwsel. Ze doet er een middag over. Oorwarmers op als je haar verpot.

### Level 100

Stronk: Heb je je Diep Lichtbrouwsel meegenomen? Een V is genoeg om naar professor Banning te gaan. De strik groeit vandaag twee keer zo snel.

## 7. Bouwvolgorde

1. Harten groot bij de start, en klein op het bord.
2. Receptenboek en ingrediëntenkist: in de kamer én als logo op de kasbalk. Oogst gaat de kist in. Brouwen maakt een flesje.
3. Duivelsstrik-tegel die elke beurt groeit. Lichtbrouwsel haalt bij de start 75% weg. Zonder flesje is het level niet uit te spelen. Stronk vraagt het elke keer, en het level mag toch starten.
4. Plaaglevels 22, 35, 48 en 61 op Lichtbrouwsel. Levels 74, 88 en 100 op Diep Lichtbrouwsel, met twee vakjes groei per beurt.
5. De les na level 12 schrijft het recept in het boek.
6. Het boek klaarzetten voor Toverdranken, zonder die vakken nu al te openen.

De schooldagindeling hierboven is leidend voor voortgang. De plant-, plaag- en receptnotities in dit bestand blijven de inhouds- en balansspecificatie voor Herbologie; houd ze in lijn met de leveldata wanneer die wordt aangepast.
