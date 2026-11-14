'use strict';
(function(){
/* v134: uitgebreid schooljaar-mysterie, aanwijzingen, brieven, tussenscènes. Geen balanswijziging. */
const TUSSEN={"10":{"titel":"Een blaadje op zak","wie":"Tilly","tekst":"Toen we het lokaal uit liepen, voelde ik iets warms in jouw zak, Luna. Het gedroogde bloemblaadje van de eerste avond. Het is niet verwelkt. Het is zelfs een beetje groener geworden.","cliff":"Planten die in een zak groeien, horen in geen enkel lesboek. We bewaren het in je dagboek, tussen de aanwijzingen.","clue":"blad"},"20":{"titel":"Thee bij Hagrid","wie":"Hagrid","tekst":"Kom binnen, Luna. Ik heb rotskoekjes. En een briefje dat ik al jaren bewaar. Het is van een oude tuinman, een Huffelpuf. Hij vroeg of ik ’s nachts op een lichtje in de moestuin wilde letten. Ik doe dat nog steeds.","cliff":"Hij tekende met B.L. Ik dacht altijd dat het een grapje was. Nu ben ik daar niet meer zo zeker van.","clue":"briefhagrid"},"30":{"titel":"De pot zonder etiket","wie":"Tilly","tekst":"In de kas staat een pot die niemand water geeft, en die toch niet uitdroogt. Op de rand zat een vage letter B, onder een korst aarde. Ik heb hem voorzichtig schoongeveegd.","cliff":"Professor Stronk liep voorbij en zei niets. Dat is bij hem soms het luidste antwoord.","clue":"potb"},"40":{"titel":"De kaars die meewiegde","wie":"Tilly","tekst":"Heb je het gezien, boven in de Hal? Toen je won, bewoog de zevende kaars. Niet de vlam, die is nog steeds uit. De hele houder, alsof iemand vriendelijk knikte.","cliff":"Ik zwaaide terug. Dat leek me het minste wat we konden doen.","clue":"kaarswieg"},"50":{"titel":"De ontbrekende bladzijde","wie":"Hermelien Griffel","tekst":"In de bibliotheek vond ik dezelfde kaft als in jullie lade: het herbarium dat ‘niet bestaat’. De ontbrekende bladzijde is niet gescheurd. Ze is eruit getoverd. Reparo doet er niets aan.","cliff":"Iemand wilde die pagina niet alleen verbergen. Iemand wilde dat hij nooit meer terugkwam. Dat is heel iets anders.","clue":"bladzij"},"60":{"titel":"Iemand in de lijst","wie":"Ron Wemel","tekst":"Ik zweer dat ik in die lege lijst een man zag, Luna. Een seconde, met een gieter. Hermelien zegt dat ik te hard rende en te weinig ontbeten had. Maar hij knikte. Echt waar.","cliff":"Als portretten kunnen wandelen, kunnen ze ook groeten. Ik groet voortaan terug, voor de zekerheid.","clue":"gieter"},"70":{"titel":"De veer komt terug","wie":"Professor Banning","tekst":"Die veer van de eerste les is weer op jouw lessenaar gaan liggen. Dit keer zonder perkament. Alleen een zilvergrijs pluisje, hetzelfde als in de kas.","cliff":"Ik bewaar de veren van mijn leerlingen niet. Deze veer bewaart u, zo te zien.","clue":"veer"},"80":{"titel":"Het licht is verplaatst","wie":"Hagrid","tekst":"Luna, het lichtje in de moestuin staat niet meer bij de pompoenen. Het is dichter bij de oude kassen gekropen. Pluisje gromde ernaar, alle drie de koppen.","cliff":"Ik ga er niet alleen heen. En jij ook niet, hoor. We wachten tot we meer weten. En tot het dag is.","clue":"licht"},"90":{"titel":"Bijna een naam","wie":"Tilly","tekst":"Ik vroeg Stronk opnieuw naar de pot. Hij zei: “Sommige namen bescherm je door ze zacht te houden, kind.” Toen liep hij naar kas zes, niet naar zeven.","cliff":"Hij is niet boos. Hij is voorzichtig. Dat is bij planten vaak hetzelfde.","clue":null},"100":{"titel":"Honderd levels, zes vlammen","wie":"Tilly","tekst":"Honderd levels, Luna. In de Hal branden nog steeds maar zes kaarsen. Maar kijk eens in je dagboek: we hebben blaadjes, een brief, een pot, een veer. Het geheim wordt niet kleiner. Het wordt leesbaarder.","cliff":"Zullen we de aanwijzingen eens naast elkaar leggen? Soms gaan twee dingetjes ineens bij elkaar horen.","clue":null},"110":{"titel":"Een fles die zoemt","wie":"Tilly","tekst":"In de gang naar de kerkers zoemde iets achter een deur. Toen we dichterbij kwamen, hield het op. Alsof het ons herkende en verlegen werd.","cliff":"Sneep deed de deur open, keek ons aan en deed hem weer dicht. “Later,” zei hij. “Als jullie precies zijn.”","clue":"zoem"},"120":{"titel":"Een schone werkbank","wie":"Ron Wemel","tekst":"Sneep had mijn werkbank expres vies gelaten, dat weet ik zeker. De jouwe, Luna, glom. En er lag een schone vijzel klaar, precies in het midden.","cliff":"Hij mag ons niet, denk ik. Of hij mag jou wél, en dat laat hij liever niet merken.","clue":null},"130":{"titel":"Een seconde van een gezicht","wie":"Hermelien Griffel","tekst":"De lege lijst was niet leeg. Een seconde lang zag ik een man van middelbare leeftijd, aarde onder zijn nagels, een zachte mond. Hij zei geen woord. Hij wees naar beneden, naar de kassen.","cliff":"Ik heb het opgeschreven, met de tijd erbij. Bewijs is een vorm van vriendelijkheid, als je het later nog eens wilt nalezen.","clue":"gezicht"},"140":{"titel":"De lach van een tuinman","wie":"Hagrid","tekst":"Ik herinner me zijn lach, Luna. Bartholomeus. Hij gaf me ooit een zak reuzenpompoenzaad en zei: “Voor als het kasteel het even moeilijk heeft.” Ik heb die zaden nog.","cliff":"Als we zijn tuin terugvinden, plant ik er eentje. Dan heeft hij in ieder geval iets dat hardop groeit.","clue":"zaad"},"150":{"titel":"Twee dingen die passen","wie":"Tilly","tekst":"Ik legde het hartvormige blaadje op de tekening van het sleutelgat. Luna… het past. Niet bijna. Precies. Alsof iemand dit voor ons heeft klaargelegd, lang geleden, en geduld had.","cliff":"In je dagboek kun je aanwijzingen naast elkaar leggen. Tik er twee aan. Als ze bij elkaar horen, schrijf ik op wat we zien. Jij bent beter in kijken dan je denkt.","clue":null},"160":{"titel":"De toets en de nis","wie":"Professor Banning","tekst":"Na de toets bleef één boek in de nis hangen, bij de lege lijst. Alsof het wachtte tot u klaar was met cijfers en weer tijd had voor verhalen.","cliff":"Cijfers zijn nuttig. Verhalen houden een school in leven. U doet allebei.","clue":null},"170":{"titel":"Een etiket dat vervaagt","wie":"Tilly","tekst":"In de kerker vervaagde een etiket terwijl we keken. Eerst stond er een woord, toen alleen een B, toen niets. Sneep zette er een schoon etiket overheen, zonder iets te zeggen.","cliff":"Sommige geheimen bescherm je met een schoon briefje. Niet met een slot.","clue":null},"180":{"titel":"Roer linksom","wie":"Professor Sneep","tekst":"Roer linksom, juffrouw Leeflang. Lindaroos roerde ook linksom, bij extracten die van de maan hielden. Dat staat in geen enkel schoolboek. En u heeft het van mij niet gehoord.","cliff":"Precisie is een vorm van respect. Voor de drank, en voor wie hem ooit bedacht.","clue":null},"190":{"titel":"De vijzel van een ander","wie":"Tilly","tekst":"In de voorraadkast lag een vijzel met een scheurtje, netjes gelijmd. Aan de onderkant stonden dezelfde krulletters als in het herbarium.","cliff":"We laten hem staan. Sneep weet dat we hem gezien hebben. Dat is genoeg voor vandaag.","clue":null},"200":{"titel":"Halverwege de kerkers","wie":"Tilly","tekst":"Tweehonderd levels. De ketel kent ons al. En ergens achter Sneeps stilte zit een tuinman die ooit zijn leerling was, of zijn collega, of allebei.","cliff":"We gaan niet duwen. We blijven precies, en vriendelijk, en nieuwsgierig. Dat is onze spreuk.","clue":null},"210":{"titel":"Een recept in de kantlijn","wie":"Ron Wemel","tekst":"Op de achterkant van mijn kladblaadje stond ineens een kantlijn die ik niet had geschreven: ‘niet koken, alleen warmen’. In hetzelfde handschrift als dat extract.","cliff":"Ik heb het aan jou gegeven. Mijn handschrift is veel lelijker, dat weet iedereen.","clue":null},"220":{"titel":"Stoom als een sleutel","wie":"Tilly","tekst":"We hebben het weer gezien: een sleutel in de stoom. Dit keer bleef hij langer hangen, tot jij “hallo” fluisterde. Toen loste hij op, als een groet die beantwoord was.","cliff":"Morgen weer een les. Maar vannacht droom ik van een deur die niet op slot wil blijven.","clue":null},"230":{"titel":"Anderlings kat","wie":"Professor Anderling","tekst":"Mijn andere vorm ziet meer in het donker dan ik in het licht. De tuinman komt vaker. Hij wacht tot de school weer verzorgd voelt.","cliff":"U verzorgt haar, Luna. Elke hersteldoel is een zin in een brief die hij kan lezen.","clue":null},"240":{"titel":"Een gieter die niet van ons is","wie":"Tilly","tekst":"Bij de transfiguratie-oefening verscheen een gieter die niemand had neergezet. Hij was oud, koper, en vochtig van binnen. Alsof hij net gebruikt was.","cliff":"Anderling zette hem bij de deur. “Die brengt zichzelf wel weer thuis,” zei ze.","clue":null},"250":{"titel":"De muis kijkt om","wie":"Tilly","tekst":"Het theekopje-dat-muis-was keek naar de lijst en toen naar jou, Luna. Twee keer. Dat is geen toeval meer, dat is een boodschap met oren.","cliff":"Ik heb hem een brokje gegeven. Bondgenoten moet je eten geven, ook als ze eigenlijk porselein zijn.","clue":null},"260":{"titel":"Een jaarboek met een gat","wie":"Hermelien Griffel","tekst":"De bladzijde van B.L. is niet alleen leeg. Er is een gat in de tijd: geen examencijfers, geen afscheid, geen adres. Iemand heeft een mens uit een boek getild.","cliff":"Dat lukt niet met een gum. Daar is een spreuk voor, en een reden.","clue":null},"270":{"titel":"De lijst fluistert een naam","wie":"Tilly","tekst":"Toen jij langsliep, fluisterde de lege lijst “Luna”. Zacht, alsof hij het nog oefende. Ik hoorde het ook, dus je hoeft niet te denken dat je het verzonnen hebt.","cliff":"We groeten terug. Elke keer. Tot hij weer een gezicht heeft.","clue":null},"280":{"titel":"Onvoltooid werk","wie":"Professor Anderling","tekst":"Een portret dat wegloopt, heeft werk beloofd. Lindaroos heeft een tuin beloofd aan een school die hem vergat. Dat is geen schande. Dat is een belofte die nog openstaat.","cliff":"U mag die belofte niet forceren. U mag haar wel waardig houden.","clue":null},"290":{"titel":"De toren wenkt","wie":"Tilly","tekst":"Anderling keek naar het raam toen ze “toren” zei. Niet naar ons. Alsof de sterren al wilden beginnen, nog voor wij klaar waren met dit vak.","cliff":"Ik neem een warme sjaal mee. En het dagboek. Aanwijzingen houden van koude nachten, denk ik.","clue":null},"300":{"titel":"Driehonderd, en een lege lijst","wie":"Tilly","tekst":"Driehonderd levels. We weten zijn naam, zijn huis, zijn belofte. We weten nog niet waarom iemand hem uit de boeken tilde. Maar de lijst is minder leeg dan hij was.","cliff":"Boven wachten sterren die ook een kaars missen. We gaan kijken.","clue":null},"310":{"titel":"Een ster te weinig","wie":"Tilly","tekst":"Sinistra merkte het zelf niet, tot jij op het grijze puntje wees. “Dat sterrenbeeld staat in geen atlas,” zei ze. “En toch zit het op mijn kaart.”","cliff":"Sommige kaarten kennen geheimen die hun baas nog moet inhalen.","clue":null},"320":{"titel":"Zwamdrift ziet een tuin","wie":"Professor Zwamdrift","tekst":"Mijn bol is zelden zo vriendelijk. Ik zie paden van zilver, en een meisje dat planten troost, en een man die eindelijk weer in een lijst past.","cliff":"Ik voorspel normaal ongeluk, lieverd. Vandaag voorspel ik geduld. Dat is veel enger, en veel beter.","clue":null},"330":{"titel":"De kandelaar aan de hemel","wie":"Tilly","tekst":"We hebben hem vastgelegd, het sterrenbeeld. Zeven punten, eentje dof. Als je je hoofd scheef houdt, is het een gieter. Of een kaars. Of allebei, als je Tilly heet.","cliff":"Ik heb het in je dagboek getekend. Niet mooi, wel eerlijk.","clue":null},"340":{"titel":"Hagrid en het merkteken","wie":"Ron Wemel","tekst":"De hemelbol bleef hangen boven Hagrids tuin. Hij zei: “Ik wist het. Ik zei het tegen Fang, maar Fang luistert alleen als het om worst gaat.”","cliff":"Hagrid houdt de theepot warm voor ons. Dat is ook een soort bescherming.","clue":null},"350":{"titel":"Zilver in het donker","wie":"Tilly","tekst":"Vannacht, op het balkon, zag ik het spoor weer. Geen nachtmerrie, geen nevel. Gewoon een zachte lijn, van de toren naar de kassen, als iemand die het licht aan wil laten.","cliff":"Ik was niet bang. Ik was blij dat hij de weg nog weet.","clue":null},"360":{"titel":"Een kaart die klopt","wie":"Professor Zwamdrift","tekst":"Uw logboek klopt met mijn bol, en dat zegt iemand die meestal ruzie heeft met feiten. De zevende ster is geen ster. Het is een uitnodiging.","cliff":"Ga niet rennen, kind. Uitnodigingen houden van een rustige pas.","clue":null},"370":{"titel":"De doffe vlam","wie":"Tilly","tekst":"In de Hal, heel even, kreeg de zevende kaars een gloed zo klein als een vuurvlieg. Toen ging hij weer uit, beleefd, alsof hij niet te vroeg wilde komen.","cliff":"We zijn er bijna klaar voor. Nog niet helemaal. Dat is goed.","clue":null},"380":{"titel":"Lupos luistert","wie":"Professor Lupos","tekst":"Ik heb over uw tuinman gehoord. Niet als een gevaar. Als een verhaal dat te lang alleen is gelaten. Sommige dingen in een kast zijn maar bang dat niemand meer aanklopt.","cliff":"Als u aanklopt, doet u dat met een vriendelijke zin. Dat is al de halve spreuk.","clue":null},"390":{"titel":"Chocola op de lessenaar","wie":"Tilly","tekst":"Lupos had een chocoladekikker voor ons neergelegd, “voor het geval dat”. Ik denk dat hij merkt dat we iets zoeken dat geen Boeman is.","cliff":"Ik bewaar de kikker nog even. Voor moed, of voor honger. Bij mij is dat vaak hetzelfde.","clue":null},"400":{"titel":"Vierhonderd levels, een spoor","wie":"Tilly","tekst":"Vierhonderd levels, en het spoor is helderder. Niet eng. Bekend. Alsof het kasteel blij is dat iemand de stof van een oude belofte veegt.","cliff":"Verweer komt eraan. Dan oefenen we kijken zonder weg te kijken. Dat kunnen wij al een beetje.","clue":null},"410":{"titel":"De tweede kast","wie":"Professor Lupos","tekst":"U hoorde het eerder dan ik: die kleinere kast. Bloemslot, zachte brom. Geen Boeman. Eerder een bijenkorf die een tuin herinnert.","cliff":"We forceren niets. We maken de ruimte veilig, en dan luisteren we.","clue":null},"420":{"titel":"Een schild van rust","wie":"Professor Lupos","tekst":"Uw Schildspreuk was niet de sterkste van de klas, Luna. Wel de rustigste. Lindaroos zou dat hebben herkend. Tuinmensen weten dat wortels tijd nodig hebben.","cliff":"Houd die rust vast als de deur op een kier gaat.","clue":null},"430":{"titel":"Op een kier","wie":"Tilly","tekst":"Hij ging op een kier, echt. Niet van een spreuk, van jouw zin: we komen helpen. Achter de kier lag een blaadje, zilver, nog fris.","cliff":"Ik heb het in het dagboek gelegd, bij de andere. We naderen de deur die ertoe doet.","clue":null},"440":{"titel":"Lumos op het pad","wie":"Professor Lupos","tekst":"Licht liegt niet, als je het vriendelijk houdt. Het spoor loopt naar kas zeven, niet naar een val. U mag bang zijn, en tóch het licht aanhouden.","cliff":"Dat is verweer. Niet het ontkennen van donker, het blijven kijken.","clue":null},"450":{"titel":"De B-sleutel tint","wie":"Tilly","tekst":"De sleutel in je dagboek werd warm toen we bij de kassen stonden. Niet heet. Warm, als een hand.","cliff":"Nog niet nu. Eerst het practicum, dan samen. Ik laat je niet alleen naar die deur gaan.","clue":null},"460":{"titel":"Hagrid wacht buiten","wie":"Hagrid","tekst":"Ik sta wel buiten, met thee. En met Fang, die beloofd heeft zich te gedragen. Als die deur opengaat, wil ik de eerste zijn die zegt dat het goed is zo.","cliff":"Jij doet het mooie werk, Luna. Ik doe de koekjes. Dat is een eerlijke verdeling.","clue":null},"470":{"titel":"Sneep in de deuropening","wie":"Professor Sneep","tekst":"U hoeft mij niet te wantrouwen, juffrouw Leeflang. Ik heb dat extract bewaard omdat slordige handen een tuin kunnen breken. Uw handen zijn dat niet.","cliff":"Als de deur opengaat, roert u linksom. U weet waarom.","clue":null},"480":{"titel":"Anderling houdt de lijst","wie":"Professor Anderling","tekst":"Ik heb de lege lijst laten ophangen in de gang naar de kassen. Als hij thuiskomt, moet hij de weg niet hoeven zoeken.","cliff":"Dat is alles wat een schoolhoofd soms kan doen: een kader klaarzetten, en iemand vertrouwen.","clue":null},"490":{"titel":"Een nacht zonder nevel","wie":"Tilly","tekst":"De nevel bleef weg. Alleen het zilveren spoor, en de zevende kaars die heel even wachtte, als iemand die de adem inhoudt voor een felicitatie.","cliff":"Ik heb bijna geen woorden meer, Luna. Alleen zin om je te volgen.","clue":null},"500":{"titel":"Vijfhonderd, en bijna thuis","wie":"Tilly","tekst":"Vijfhonderd levels. We hebben zijn naam, zijn sleutel, zijn ster, zijn belofte. Kas zeven is geen monsterverhaal meer. Het is een tuin die op ons wacht.","cliff":"Nog honderd stappen, in ons tempo. We hoeven niet te rennen naar een vriend.","clue":null},"510":{"titel":"Het bloemslot glanst","wie":"Professor Lupos","tekst":"Het slot is schoner dan gisteren. Alsof iemand van binnen poetst. U heeft al geholpen, lang voordat de sleutel omdraaide.","cliff":"Dat is het mooie van verzorgen: het werkt ook door een deur heen.","clue":null},"520":{"titel":"De laatste waarschuwing is zacht","wie":"Tilly","tekst":"Stronk zei vanmorgen: “Als je naar zeven gaat, zeg dan eerst je naam. Tuinmannen houden van beleefde deuren.” Toen gaf hij me een paar schone handschoenen, voor jou.","cliff":"Ik heb ze in je tas gedaan. We doen dit netjes.","clue":null},"530":{"titel":"Een brief onder de mat","wie":"Hagrid","tekst":"Er lag een briefje onder mijn mat, in dat oude handschrift. ‘Dank je dat je het lichtje in de gaten hield. Het is bijna tijd.’ Geen handtekening. Hoefde ook niet.","cliff":"Ik heb staan huilen, een beetje. Fang ook, denk ik. Of hij rook de koekjes.","clue":null},"540":{"titel":"Hermelien heeft een zin","wie":"Hermelien Griffel","tekst":"Ik vond in een voetnoot, tien jaar te laat: ‘De tuin van Lindaroos blijft van de school, zolang iemand haar kent.’ Daarom werd hij uit de boeken gehaald, denk ik. Niet uit boosheid. Uit vergetelheid, die iemand heeft geholpen.","cliff":"Wij kennen hem weer. Dat is al een slot dat openschuift.","clue":null},"550":{"titel":"Ron houdt de lantaarn","wie":"Ron Wemel","tekst":"Ik ga mee, hoor. Ik ben niet dapper, maar ik ben wel goed in lantaarns rechtop houden. En in het zeggen van “we zijn er bijna” als iedereen stil is.","cliff":"Dat is mijn subplot: niet wegrennen. Voor jou, en voor Tilly, en voor die tuinman.","clue":null},"560":{"titel":"De zevende lont","wie":"Tilly","tekst":"Boven in de Hal is de lont van de zevende kaars recht gaan staan. Nog geen vlam. Wel een houding, als iemand die gaat opstaan.","cliff":"Ik moest slikken, Luna. Ik denk dat hij ons hoort.","clue":null},"570":{"titel":"Een laatste les van Lupos","wie":"Professor Lupos","tekst":"Als de deur opengaat, lach niet uit schrik en huil niet uit plicht. Zeg maar gewoon: welkom terug. De rest volgt wel.","cliff":"U heeft het verweer al gehaald, lang geleden, in de kas, met een blaadje in uw zak.","clue":null},"580":{"titel":"Voor de drempel","wie":"Tilly","tekst":"We staan bijna op de drempel. De sleutel is warm, het spoor is helder, de lijst in de gang is schoon. Ik geef je mijn hand, al heb je die misschien niet nodig.","cliff":"Als hij opengaat, zeg jij het. Jij bent Luna Leeflang, en jij hebt hem gezocht.","clue":null},"590":{"titel":"De deur herkent je","wie":"Tilly","tekst":"Ik zette de sleutel nog niet om. Ik hield hem er alleen bij, en het slot klikte al een klein beetje, als een glimlach. Hij herkent je.","cliff":"Morgen, na het practicum, doen we het samen. Ik wil dat je dit herinnert als iets zachts.","clue":null},"600":{"titel":"De zevende kaars","wie":"Tilly","tekst":"Je zei je naam, de sleutel draaide, en kas zeven ademde uit. Bartholomeus Lindaroos stond in zijn lijst, in zijn tuin, en hij boog. Boven ons, in de Grote Zaal, ging de zevende kaars aan. Niet fel. Precies genoeg.","cliff":"We hebben het niet gewonnen. We hebben het verzorgd. Dat is mooier. En je dagboek is nu een tuin, Luna. Die mag je blijven lezen.","clue":null}};
const CLUES=[["blad","Gedroogd bloemblaadje","Een klein hartvormig blaadje. Het verwelkt niet. Het werd warmer in Luna’s zak.",{"dag":0}],["briefhagrid","Briefje van Hagrid","Een oud briefje, bewaard bij de rotskoekjes: een tuinman vroeg Hagrid te letten op een lichtje in de moestuin. Getekend B.L.",{"level":20}],["potb","Pot met een B","Een pot in de kas die nooit water krijgt en toch niet uitdroogt. Op de rand staat een vage letter B.",{"level":30}],["kaarswieg","De knikkende kaars","De zevende kaars in de Hal brandt niet, maar de houder wiegde toen Luna won, als een groet.",{"level":40}],["bladzij","De ontbrekende bladzijde","Uit het herbarium is een bladzijde getoverd, niet gescheurd. Reparo doet er niets aan.",{"level":50}],["gieter","Een man met een gieter","Ron zag in de lege lijst een seconde lang een man met een gieter, die knikte.",{"level":60}],["veer","Zilveren veerpluis","Bannings veer kwam terug naar Luna’s lessenaar, met een zilvergrijs pluisje uit de kas.",{"level":70}],["licht","Het kruipende lichtje","Het lichtje in Hagrids moestuin is dichter naar de oude kassen gekropen.",{"level":80}],["zoem","De verlegen fles","Achter een deur in de kerker zoemde een fles, en hield op toen Luna naderde.",{"level":110}],["gezicht","Een gezicht in de lijst","Hermelien zag een man met aarde onder zijn nagels, die naar de kassen wees.",{"level":130}],["zaad","Reuzenpompoenzaad","Hagrid bewaart zaden van Bartholomeus, “voor als het kasteel het even moeilijk heeft”.",{"level":140}],["sleutelgat","Hartvormig sleutelgat","In de giftige hoek, onder het stof, zit een klein hartvormig gat in de muur.",{"dag":2}],["kandelaar","Zilveren kandelaarmerk","In het hout van kas zeven staat een kandelaar met zeven vlammen, waarvan er één donker is.",{"dag":3}],["perkament","“Wat bloeit bij maanlicht…”","Een reepje perkament: wat bloeit bij maanlicht, verwelkt bij leugens.",{"dag":6}],["sleutelb","Sleutel met een B","Een gevleugelde sleutel met een kleine B in de baard, die naar Luna toekwam.",{"dag":6}],["lijst","De lege lijst","Een nis met een lijst waarvan het naamplaatje is weggepolijst.",{"dag":7}],["vaas","Naam in de vaas","Na Reparo verscheen in het glazuur: Bartholomeus Lindaroos.",{"dag":8}],["extract","Lindaroos-extract","Een stoffig flesje in Sneeps hoek, dat zoemde toen Luna langsliep.",{"dag":10}],["afdruk","Sleutelafdruk in een fles","Op de bodem van een gloeiende fles ligt de afdruk van een sleutel.",{"dag":12}],["jaarboek","Een bijna lege bladzijde","In een jaarboek: B.L., Huffelpuf, hovenier. Na zijn examen is de bladzijde bijna leeg.",{"dag":16}],["ster","De grijze ster","Op Sinistra’s kaart ontbreekt een kandelaar van zeven lichtjes. Het zevende punt is grijs.",{"dag":20}],["bloemslot","Het bloemslot","Een kleine kast in het Verweerlokaal bromt als een bijenkorf. Het slot heeft de vorm van een bloem.",{"dag":25}],["spoor","Zilveren spoor","Een zacht spoor van blaadjes, van de toren naar kas zeven. Het wijkt niet voor licht, het wijst.",{"dag":28}]];
const PAREN=[["blad","sleutelgat","Het hart dat past","Tilly","Het blaadje past precies in het hartvormige gat. Niet bijna: precies. Iemand heeft dit klaargelegd en geduld gehad."],["perkament","extract","Bloeit bij maanlicht","Tilly","Het extract van Sneep en het briefje horen bij elkaar. ‘Niet koken, alleen warmen.’ Het verwelkt bij leugens, dus we blijven eerlijk, ook tegenover hem."],["sleutelb","afdruk","De sleutel is echt","Tilly","De B-sleutel past op de afdruk in de fles. Dit is geen versiering. Dit is een deur die op ons wacht."],["jaarboek","lijst","Een naam die terugmag","Hermelien Griffel","De lege lijst en de lege bladzijde zijn hetzelfde gat. Als we zijn naam hardop houden, heeft het portret een weg terug."],["kandelaar","ster","Zelfde kaars, twee hemelen","Tilly","Het merkteken op de deur en het sterrenbeeld zijn dezelfde kandelaar. Eén vlam ontbreekt boven, en één beneden. Als de tuin opengaat, gaan ze samen aan."],["briefhagrid","licht","Hagrid heeft woord gehouden","Hagrid","Het briefje en het lichtje horen bij elkaar. Ik heb woord gehouden, Luna. Hij ook, denk ik, op zijn eigen manier."],["gieter","gezicht","De man in de lijst","Ron Wemel","Zie je wel! Mijn man met de gieter is Hermelienes man met de aarde onder zijn nagels. Dat is dezelfde tuinman. Ik wist het."],["sleutelb","bloemslot","Niet forceren, vragen","Professor Lupos","De B-sleutel hoort bij het bloemslot, maar het slot wil eerst een vriendelijke zin. Moed opent de Boeman. Vriendelijkheid opent deze."],["vaas","jaarboek","Bartholomeus, hardop","Tilly","Zijn volle naam staat in de vaas en in het jaarboek. Bartholomeus Lindaroos. Als we die naam blijven zeggen, wordt de leegte kleiner."],["spoor","ster","De weg naar huis","Tilly","De grijze ster wijst, het zilveren spoor volgt. Samen zijn ze een pad: van de toren, over de tuin, naar kas zeven."],["blad","potb","Het groeit nog","Tilly","Het blaadje en de pot met de B ruiken hetzelfde, naar warme aarde na regen. Wat in die pot staat, hoort bij de plant die ons het blaadje gaf."],["zaad","briefhagrid","Voor als het kasteel het moeilijk heeft","Hagrid","Die zaden en dat briefje horen bij dezelfde belofte. Als de tuin opengaat, plant ik er eentje. Dan lacht hij vast."]];
const BRIEVEN=[["uilen1","Hagrid","Uilenpost uit het boswachtershuis","Beste Luna, je bent een heks, en een goeie. Als je ooit thee wilt en een verhaal over een tuinman die zaad in mijn handen drukte, je weet waar ik woon. – Hagrid",{"level":20}],["uilen2","Professor Stronk","Een kort briefje uit de kas","Juffrouw Leeflang, u vraagt goede vragen en u duwt niet tegen potten die nog niet open willen. Blijf zo. Sommige namen bescherm je door ze zacht te houden. – P. Stronk",{"dag":4}],["uilen3","een onbekende hand","Zonder afzender","Wat bloeit bij maanlicht, verwelkt bij leugens. Je kijkt al de goede kant op. Haast je niet.",{"dag":6}],["uilen4","Professor Banning","Een zwevende kaart","U heeft een veer die zelf terugkomt. Dat is zeldzaam, en vriendelijk. Blijf lezen wat de school tussen de regels zegt. – F. Banning",{"level":70}],["uilen5","Hagrid","Het licht is verplaatst","Luna, het lichtje is dichter bij de oude kassen. Ik ga niet alleen. Jij ook niet. Thee staat klaar, overdag. – Hagrid",{"level":80}],["uilen6","Professor Sneep","Een strook perkament","Nieuwsgierigheid is geen misdaad. Slordigheid wel. U bent het eerste niet. Blijf het tweede alsjeblieft. Het extract blijft waar het is tot u er klaar voor bent. – S.S.",{"dag":14}],["uilen7","Professor Anderling","Over portretten","Een portret verlaat zijn lijst bij onvoltooid werk, niet bij boze spoken. Als u de tuin verzorgt, verzorgt u ook de weg terug. – M. Anderling",{"dag":18}],["uilen8","Professor Lupos","Chocola en een zin","Voor het geval dat. En een zin die u mag gebruiken, als een deur op een kier gaat: we komen helpen. Dat is vaak genoeg. – Remus Lupos",{"dag":25}],["uilen9","Hagrid","Onder de mat","Er lag een briefje onder mijn mat: ‘Dank je dat je het lichtje in de gaten hield. Het is bijna tijd.’ Ik bewaar het bij de pompoenzaden. – Hagrid",{"level":530}],["uilen10","Bartholomeus Lindaroos","Aan wie de school verzorgt","Als je dit leest, is de deur open of bijna open. De tuin is van de school, zolang iemand haar kent. Jij kende haar al, toen je dat eerste blaadje oprapte. Dank je. – B.L.",{"dag":29}]];
const PLEK=[["kas1","kas","Iets fluistert tussen de varens","Tilly","Hoorde je dat? Tussen de varens, heel zacht, als iemand die tevreden is over water. Het komt niet uit kas één tot zes. Het komt van achteren, waar die dichte deur is.","We gieten gewoon verder. Wie fluistert, mag ons eerst vertrouwen.",{"level":8}],["kas2","kas","De pot die zelf drinkt","Tilly","Ik heb die pot met de B geen water gegeven, en de grond is toch vochtig. Er loopt een fijn gootje naar de muur, naar kas zeven, denk ik.","De kas zorgt al die tijd een beetje voor zichzelf. Net als Hagrid met dat lichtje.",{"level":30}],["kas3","kas","Maanlicht op de dichte deur","Tilly","Kijk, als de kaslamp uit is, valt er een streep maanlicht precies op dat zilveren merkteken. Overdag zie je het bijna niet. ’s Avonds wijst de maan.","Morgen neem ik het dagboek mee naar de kas. Sommige aanwijzingen willen terug naar waar ze vandaan komen.",{"dag":3}],["ketel1","ketel","De ketel kent een naam","Tilly","Toen de ketel warm werd, leek de stoom even een letter te vormen. Een B, of een krul. Toen was het weer gewone soepachtige stoom.","Als we hier later Lindaroos-extract zien, weten we dat de ketel hem al kende.",{"level":40}],["ketel2","ketel","Linksom, niet vertellen","Professor Sneep","U roert al linksom, zie ik. Goed. Sommige extracten houden daar van. U heeft het niet van mij.","En veeg de rand schoon. Respect begint bij een nette ketel.",{"dag":13}],["ketel3","ketel","Een afdruk in de damp","Tilly","In de deksel bleef even een sleutelafdruk staan, van damp. Dezelfde als in die fles. De ketel en de voorraadkast vertellen hetzelfde verhaal.","Ik heb mijn handen gewassen. Dit soort verhalen hoort niet in de soep.",{"dag":13}],["album1","album","Een gezicht dat je kent van horen","Tilly","Sommige kaarten kijken terug, vind je niet? Niet eng. Meer alsof het album blij is dat er weer een bladzijde wordt gevuld. Net als dat jaarboek dat leeg moest zijn.","Als we een serie afmaken, schrijf ik een zin in je dagboek. Verzamelingen zijn ook een soort tuin.",{"level":10}],["feest1","feest","Een kaars op een feestavond","Tilly","Tussen alle slingers keek ik even omhoog. De zevende kaars bewoog niet met de muziek mee. Hij wacht. Dat vond ik troostrijk, midden in een feest.","We mogen feestvieren en toch iets onthouden. Dat kan best samen.",{"feest":true}]];
const SUB={"tilly":{"naam":"Tilly","kop":"Tilly’s avontuur","stappen":[{"level":1,"tekst":"Ik ben Tilly, ik heb altijd aarde onder mijn nagels, en ik was eerst een beetje bang voor die dichte deur. Nu ben ik vooral nieuwsgierig. En ik blijf naast je lopen."},{"level":100,"tekst":"Honderd levels samen. Ik durf de deur al aan te kijken zonder mijn adem in te houden. Jij hebt me dat geleerd, Luna, door gewoon door te gaan."},{"level":300,"tekst":"Ik droom soms dat ik de zevende kaars aansteek. Dan word ik wakker en denk ik: nee, dat doen we samen, of helemaal netjes, door te verzorgen."},{"level":500,"tekst":"Ik ben niet meer bang. Ik ben er klaar voor om je hand te geven bij de drempel, en om te lachen als hij boog."}]},"hagrid":{"naam":"Hagrid","kop":"Hagrid en het lichtje","stappen":[{"level":20,"tekst":"Hagrid bewaart een belofte: letten op een lichtje in de tuin, voor een tuinman die B.L. tekende."},{"level":80,"tekst":"Het lichtje is verplaatst, dichter naar de oude kassen. Hagrid wacht op ons, overdag, met thee."},{"level":140,"tekst":"Hij herinnert zich Bartholomeus’ lach, en bewaart reuzenpompoenzaad voor als de school het moeilijk heeft."},{"level":530,"tekst":"Er lag een bedankje onder zijn mat: het is bijna tijd. Hagrid huilde een beetje, en beloofde koekjes bij de deur."}]},"sneep":{"naam":"Professor Sneep","kop":"Sneeps stille hoek","stappen":[{"dag":10,"tekst":"Sneep bewaart Lindaroos-extract achter zich, en gromt dat nieuwsgierigheid geen misdaad is, slordigheid wel."},{"dag":14,"tekst":"Hij geeft Luna een aanwijzing naar Anderling, en een compliment dat als een zeldzame drank smaakt."},{"level":180,"tekst":"Hij verraadt, bijna per ongeluk, dat Lindaroos linksom roerde bij manextracten."},{"level":470,"tekst":"Hij zegt het hardop: hij bewaarde het extract omdat slordige handen een tuin kunnen breken. Luna’s handen zijn dat niet."}]},"hermelien":{"naam":"Hermelien Griffel","kop":"Hermelien in de boeken","stappen":[{"level":50,"tekst":"Hermelien ontdekt dat de ontbrekende herbariumbladzijde is weggetoverd, niet gescheurd."},{"dag":16,"tekst":"In het jaarboek vindt ze B.L., Huffelpuf, en een bladzijde die na het examen bijna leeg is."},{"level":260,"tekst":"Ze noemt het een gat in de tijd: iemand tilde een mens uit een boek."},{"level":540,"tekst":"Een voetnoot, tien jaar te laat: de tuin blijft van de school zolang iemand haar kent. Vergetelheid was het slot. Kennis schuift het open."}]}};

if(typeof def==='function'){def('dagboek',{gezien:{}})}
S.dagboek=S.dagboek||{gezien:{}};
['gezien','tussen','clues','paren','brieven','plek'].forEach(k=>{if(!S.dagboek[k]||typeof S.dagboek[k]!=='object')S.dagboek[k]={}});
function lv(){return Math.max(1,+S.m3lvl||1)}
function dag(){return Math.max(0,S.schoolDag|0)}
function vrij(u){
  if(!u)return true;
  if(u.level&&lv()<u.level)return false;
  if(u.dag!=null&&dag()<u.dag)return false;
  if(u.plek)return !!S.dagboek.plek[u.plek];
  if(u.feest){try{return !!(typeof feestdag==='function'&&feestdag())}catch(e){return false}}
  return true;
}
function setKey(tak,id){if(S.dagboek[tak][id])return false;S.dagboek[tak][id]=1;try{bewaar()}catch(e){}return true}
function clueIds(){return CLUES.filter(c=>vrij(c[3])).map(c=>c[0])}
function ontgrendelClues(){
  let nieuw=[];
  CLUES.forEach(c=>{if(vrij(c[3])&&setKey('clues',c[0]))nieuw.push(c[1])});
  BRIEVEN.forEach(b=>{if(vrij(b[4]))setKey('brieven',b[0])});
  return nieuw;
}
function clueVan(id){return CLUES.find(c=>c[0]===id)}
function paarId(a,b){return [a,b].sort().join('+')}
function paarVan(a,b){const k=paarId(a,b);return PAREN.find(p=>paarId(p[0],p[1])===k)}

function toonZin(wie,tekst,cliff,klaar){
  const regels=[[wie,tekst]];if(cliff)regels.push(['Tilly',cliff]);
  try{verhaal(regels,klaar)}catch(e){klaar&&klaar()}
}
function wachtStil(fn,n){
  n=n||0;
  if(document.querySelector('.modal,.verhaal,.ritueel,#intro,.m3eind,.m3voor')){if(n<40)setTimeout(()=>wachtStil(fn,n+1),800);return}
  fn();
}

function naLevel(n){
  ontgrendelClues();
  const tien=Math.floor(n/10)*10;
  if(tien>=10&&n>=tien&&TUSSEN[tien]&&!S.dagboek.tussen[tien]){
    const s=TUSSEN[tien];
    wachtStil(()=>{
      if(S.dagboek.tussen[tien])return;
      S.dagboek.tussen[tien]=1;if(s.clue)setKey('clues',s.clue);bewaar();
      toonZin(s.wie,s.tekst,s.cliff,()=>{try{const nw=ontgrendelClues();if(nw.length)toast('Nieuw in je dagboek: '+nw[0]+'.')}catch(e){}});
    });
  }
}
const _winst=typeof m3Winst==='function'?m3Winst:null;
if(_winst)m3Winst=function(n){const r=_winst.apply(this,arguments);try{naLevel(n||S.m3lvl||1)}catch(e){}return r};

function plekScenes(soort){
  const lijst=PLEK.filter(p=>p[1]===soort&&vrij(p[6]));
  const nieuw=lijst.find(p=>!S.dagboek.plek[p[0]]);
  if(!nieuw)return;
  /* toon eenmaal, na een korte adem, niet stapelen op een modal */
  setTimeout(()=>wachtStil(()=>{
    if(S.dagboek.plek[nieuw[0]])return;
    S.dagboek.plek[nieuw[0]]=1;bewaar();
    toonZin(nieuw[3],nieuw[4],nieuw[5]);
  }),900);
}
function wrap(naam,soort){
  if(typeof V==='undefined'||!V[naam])return;
  const oud=V[naam];
  V[naam]=function(){const r=oud.apply(this,arguments);try{plekScenes(soort)}catch(e){}return r};
}
wrap('mijnkas','kas');wrap('kas','kas');wrap('ketel','ketel');wrap('album','album');
try{
  if(typeof feestdag==='function'||true){
    const _home=V.home;
    V.home=function(){const r=_home.apply(this,arguments);try{if(typeof feestdag==='function'&&feestdag())plekScenes('feest')}catch(e){}return r};
  }
}catch(e){}

const _serie=window.serieNaKaart;
if(_serie)window.serieNaKaart=function(nieuw){
  const r=_serie.apply(this,arguments);
  try{
    if(nieuw&&!S.dagboek.brieven.albumserie){
      S.dagboek.brieven.albumserie=1;bewaar();
      const zin='Een nieuwe kaart in je album, Luna. Elke verzameling die je afmaakt, maakt de school een beetje minder vergeten. Net als die tuinman in het jaarboek.';
      setTimeout(()=>wachtStil(()=>toonZin('Tilly',zin,'Ik schrijf het op in je dagboek, bij de brieven.')),600);
    }
  }catch(e){}
  return r;
};

function briefPS(){
  const d=dag(),n=lv();
  const regels=[
    [0,'P.S. Tilly zag vannacht de zevende kaars bewegen. Alleen de houder, niet de vlam.'],
    [2,'P.S. In de giftige hoek zit onder het stof een klein hartvormig gat. Niet aanraken, wel onthouden.'],
    [6,'P.S. Er zat een reepje perkament bij deze post, in een hand die we bijna kennen.'],
    [10,'P.S. Als je in de kerker een fles hoort zoemen, ben je niet gek. Noteer het in je dagboek.'],
    [16,'P.S. Hermelien laat weten dat ze in het jaarboek iets leegs heeft gevonden. Dat is meer dan niets.'],
    [20,'P.S. Kijk vannacht omhoog: er ontbreekt een sterretje, in de vorm van een kandelaar.'],
    [25,'P.S. Lupos zegt dat sommige deuren opengaan van een vriendelijke zin, niet van een spreuk.'],
    [29,'P.S. Als je vandaag bij kas zeven komt, zeg dan eerst je naam. Tuinmannen houden van beleefde deuren.']
  ];
  let zin='';
  regels.forEach(r=>{if(d>=r[0])zin=r[1]});
  if(n>=100&&n<200)zin+=' Je hebt al honderd levels verzorgd; de aanwijzingen in je dagboek willen soms naast elkaar liggen.';
  if(n>=500)zin+=' Het is bijna tijd. Geen haast. Wel thee, zei Hagrid.';
  return zin;
}
const _login=V.login;
V.login=function(){
  const r=_login.apply(this,arguments);
  try{
    const brief=document.querySelector('.ochtendpost');
    if(brief&&!brief.querySelector('.briefps')){
      const ps=briefPS();
      if(ps){
        const p=document.createElement('p');p.className='briefps';p.innerHTML=ps;
        const kal=brief.querySelector('.kalender');
        if(kal)kal.before(p);else brief.appendChild(p);
      }
    }
  }catch(e){}
  return r;
};

function port(wie){try{const k=typeof wieIs==='function'?wieIs(wie):null;return k&&typeof portret==='function'?portret(k,'vh-port'):''}catch(e){return ''}}

function htmlTussen(){
  const open=Object.keys(TUSSEN).map(Number).filter(l=>lv()>=l).sort((a,b)=>a-b);
  if(!open.length)return '<div class="kaart hfdslot">Tussenscènes verschijnen om de tien levels, als je verder speelt.</div>';
  return open.map(l=>{
    const s=TUSSEN[l],nieuw=!S.dagboek.tussen[l];
    return `<details class="kaart hfdkaart ${nieuw?'boeknieuw':''}"><summary>${port(s.wie)}<div><b>Level ${l}: ${s.titel}</b><small> ${s.wie}</small></div></summary><p>${s.tekst}</p>${s.cliff?`<p class="cliff">${s.cliff}</p>`:''}</details>`;
  }).join('') + (lv()<600?`<div class="kaart hfdslot">🔒 De volgende tussenscène opent rond level ${Math.ceil((lv()+1)/10)*10}.</div>`:'');
}
function htmlBrieven(){
  const open=BRIEVEN.filter(b=>S.dagboek.brieven[b[0]]||vrij(b[4]));
  if(!open.length)return '<div class="kaart hfdslot">Brieven en uilenpost verschijnen als je verder speelt of je ochtendbrief opent.</div>';
  return open.map(b=>`<details class="kaart hfdkaart"><summary>${port(b[1])}<div><b>${b[2]}</b><small> ${b[1]}</small></div></summary><p>${b[3]}</p></details>`).join('');
}
function htmlSub(){
  return Object.keys(SUB).map(k=>{
    const s=SUB[k];
    const stappen=s.stappen.filter(st=>vrij(st));
    if(!stappen.length)return '';
    const laat=stappen[stappen.length-1];
    return `<details class="kaart hfdkaart"><summary>${port(s.naam)}<div><b>${s.kop}</b><small> ${s.naam}</small></div></summary>${stappen.map(st=>`<p>${st.tekst}</p>`).join('')}</details>`;
  }).join('')||'<div class="kaart hfdslot">Als je vrienden en leraren vaker ziet, groeit hun verhaal hier.</div>';
}
function htmlClues(){
  const vrijIds=clueIds();
  const openC=CLUES.filter(c=>vrijIds.includes(c[0]));
  const rest=CLUES.length-openC.length;
  const kaarten=openC.map(c=>`<button type="button" class="aanw" data-cl="${c[0]}"><b>${c[1]}</b><small>${c[2]}</small></button>`).join('')
    +(rest?`<div class="aanw dicht"><b>Nog ${rest} te vinden</b><small>Ze verschijnen als je verder speelt, de kas bezoekt of een brief opent.</small></div>`:'');
  const gevonden=PAREN.filter(p=>S.dagboek.paren[paarId(p[0],p[1])]);
  const hits=gevonden.map(p=>`<details class="kaart hfdkaart" open><summary>${port(p[3])}<div><b>${p[2]}</b><small> ${p[3]}</small></div></summary><p>${p[4]}</p></details>`).join('');
  return `<p class="klein">Tik twee aanwijzingen aan die volgens jou bij elkaar horen. Er is geen fout antwoord dat je dwarszit: Tilly zegt gewoon of ze samen een zin vormen. ${gevonden.length} van ${PAREN.length} verbindingen gevonden.</p><div class="aanwrij">${kaarten}</div><p class="aanwtel klein" id="aanwkeuze"></p><div id="aanwhits">${hits}</div>`;
}

let keuze=[];
function bindClues(){
  const vak=document.getElementById('aanwkeuze');
  document.querySelectorAll('.aanw[data-cl]').forEach(b=>b.onclick=()=>{
    const id=b.dataset.cl;if(b.classList.contains('dicht'))return;
    if(keuze[0]===id){keuze=[];b.classList.remove('aan');if(vak)vak.textContent='';return}
    if(keuze.length>=2){document.querySelectorAll('.aanw.aan').forEach(x=>x.classList.remove('aan'));keuze=[]}
    keuze.push(id);b.classList.add('aan');
    if(keuze.length===1&&vak)vak.textContent='Kies nog een aanwijzing om ernaast te leggen.';
    if(keuze.length===2){
      const p=paarVan(keuze[0],keuze[1]);
      const a=clueVan(keuze[0]),c=clueVan(keuze[1]);
      if(p){
        const nieuw=setKey('paren',paarId(p[0],p[1]));
        toonZin(p[3],p[4],nieuw?'Ik schrijf deze verbinding in je dagboek.':'Die hadden we al gelegd, maar hij blijft mooi.');
        if(nieuw)try{const h=document.getElementById('aanwhits');if(h)h.insertAdjacentHTML('afterbegin',`<details class="kaart hfdkaart" open><summary>${port(p[3])}<div><b>${p[2]}</b></div></summary><p>${p[4]}</p></details>`)}catch(e){}
      }else{
        toonZin('Tilly','“'+((a&&a[1])||'')+'” en “'+((c&&c[1])||'')+'” horen volgens mij nét niet bij elkaar. Maar het is geen fout, Luna. Leg ze gerust naast een andere.','Kijken is al een hele spreuk.');
      }
      document.querySelectorAll('.aanw.aan').forEach(x=>x.classList.remove('aan'));
      keuze=[];if(vak)vak.textContent='';
    }
  });
}

const boekOud=V.dagboek;
V.dagboek=V.verhaal=function(){
  ontgrendelClues();
  boekOud.apply(this,arguments);
  try{
    const d=document.querySelector('.dagboek');if(!d)return;
    if(d.querySelector('.boekextra'))return;
    const til=d.querySelector('.tilly, .tzin');
    const intro='Hier bewaar je alles: schooldagen, tussenscènes om de tien levels, brieven, en aanwijzingen die je zelf naast elkaar mag leggen.';
    if(til&&til.querySelector('p'))til.querySelector('p').textContent=intro;
    d.insertAdjacentHTML('beforeend',
      `<div class="boekextra">
        <section class="meerblok kaart rococo"><h3>Aanwijzingen</h3>${htmlClues()}</section>
        <section class="meerblok kaart rococo"><h3>Tussenscènes</h3>${htmlTussen()}</section>
        <section class="meerblok kaart rococo"><h3>Brieven</h3>${htmlBrieven()}</section>
        <section class="meerblok kaart rococo"><h3>Vrienden en leraren</h3>${htmlSub()}</section>
      </div>`);
    bindClues();
  }catch(e){console.warn(e)}
};

ontgrendelClues();
window.zwVerhaal={tussen:TUSSEN,clues:CLUES,paren:PAREN,briefPS,ontgrendelClues};

})();
