'use strict';

const SCHOOLDOELEN={
 herbologie:[
  {titel:'De kas ontwaakt',open:'De oude kas ruikt naar vochtige aarde, maar onder het spinrag zie ik al groene puntjes.',les:'Maak ruimte voor licht en lucht. De mandragoras krijgen pas les als de werktafels veilig zijn.',klaar:'De kas ademt weer. De mandragoras kunnen veilig naar hun plek.',doelen:'Veeg de spinnenwebben uit de kas|Repareer de gebarsten dakruiten|Zet de mandragorapotten terug op de werktafel|Leg de oorwarmers klaar voor de les|Vul de bak met drakenmest|Maak het irrigatiegootje vrij|Sorteer de zakjes met zaad|Hang de kruidenkaarten op|Schrob aarde van de kweektafels|Open de bovenramen voor de ochtendzon'},
  {titel:'Zaaien en stekken',open:'Professor Stronk heeft zeldzame zaden meegebracht. De kas is klaar; nu moeten we iedere plant de juiste plek geven.',les:'Zet de zaaitafels op volgorde van licht, vocht en groeitijd. Geen zaadje mag uitdrogen.',klaar:'De eerste stekken staan stevig. Morgen bekijken we wat er tussen de bladeren beweegt.',doelen:'Vul de potten met verse potgrond|Plant de valeriaanzaden in de lange bak|Zet de alsempotten bij het warme raam|Geef de jonge affodilwortels water|Label de mandragorazaailingen|Verpot de kieuwwierstekken in natte aarde|Maak de kleine gieters schoon|Zet de zaadkist droog en dicht|Bind de steunrietjes aan de jonge stengels|Veeg gemorste aarde van het kaspad'},
  {titel:'De giftige hoek',open:'Achter de hoge varens zit een hoek die niemand heeft durven opruimen. Een paarse rank beweegt zodra we binnenkomen.',les:'Raak onbekende planten nooit aan. Zet de beschermende spullen klaar en markeer iedere gevaarlijke pot.',klaar:'De giftige hoek is afgezet en herkenbaar. Nu kan niemand per ongeluk een rank wakker maken.',doelen:'Zet het waarschuwingsbord bij de duivelsstrik|Plaats de Giftige Tentacula achter het lage hek|Bind de losse ranken aan de steunlat|Vervang de gebarsten gifplantenpot|Hang de handschoenen naast de deur|Veeg opgedroogde bladeren bij de werkbank weg|Zet de snoeischaar in de afgesloten kast|Markeer de pot met niesgras|Maak het ventilatierooster vrij|Leg de plantentang op de veilige plank'},
  {titel:'Maanlicht in de kas',open:'De maanbloem opent alleen als het donker wordt. Professor Stronk wil dat we de kas voor de avondles inrichten.',les:'Maanbloemen vragen geduld en gelijkmatig licht. Zet de lantaarns neer zonder de jonge knoppen te verstoren.',klaar:'De maanbloemen staan klaar voor de avond. De eerste knop gaat al open.',doelen:'Poets het glas boven de maanbloemen|Zet de blauwe lantaarns langs het pad|Verplaats de maanbloempot uit de tocht|Vul de schaal met schoon regenwater|Hang het maanschema naast de deur|Veeg bladeren van de avondtafel|Herstel het kapotte verduisteringsgordijn|Zet de zilveren plantenschalen klaar|Maak de kaslampen stofvrij|Leg het groeiboek open bij de maanbloem'},
  {titel:'Practicum Kruidenkunde',open:'Vandaag laat Professor Stronk zien hoeveel werk er achter een gezonde kas zit. Alles moet klaarstaan voor het practicum.',les:'Controleer de oogst, de gereedschappen en de veiligheidsregels. Een goede kruidenkundige laat niets aan het toeval over.',klaar:'De kas is klaar voor het examen. De planten zijn verzorgd en het gereedschap ligt precies waar het hoort.',doelen:'Weeg de valeriaanoogst af|Zet de mandragorapotten op de examenbank|Vervang de versleten oorwarmers|Maak de kruidenweegschaal schoon|Vul de voorraadbak met verse aarde|Hang de veiligheidsregels bij de ingang|Snoei de dode blaadjes van de alsem|Zet het receptenboek op de lessenaar|Veeg modder van de laarzenmat|Sluit de kasramen voor de nacht'}
 ],
 bezweringen:[
  {titel:'De verenstorm',open:'In het lokaal zweven veren, boeken en een plumeau door elkaar. Professor Banning probeert ze met een spreuk bij elkaar te houden.',les:'Eerst ruimen we de vloer op. Daarna kan iedereen oefenen met Wingardium Leviosa.',klaar:'De veren liggen klaar en de boekenplanken zijn veilig. Banning kan eindelijk lesgeven.',doelen:'Vang de losse veren bij het raam|Zet de zwevende boeken terug in de kast|Repareer de omgevallen lessenaar|Veeg inktvlekken van de vloer|Leg de toverstokken op de oefentafel|Hang de spreukkaart naast het bord|Zet de plumeaus in de hoek|Maak het krijtbord schoon|Vervang het gebroken boekensteuntje|Zet de hoge ladder vast'},
  {titel:'Sleutels in de lucht',open:'Een handvol gevleugelde sleutels fladdert rond de kroonluchter. Eén sleutel heeft de kast met lesmateriaal op slot gedaan.',les:'Gebruik Alohomora alleen op het juiste slot. Eerst maken we de sleutelwerkbank weer bruikbaar.',klaar:'De sleutels zijn gesorteerd en de kast gaat weer open. Niemand hoeft meer achter een sleutel aan te vliegen.',doelen:'Vang de gevleugelde sleutel bij de deur|Sorteer de sleutels op hun label|Herstel het sleutelkastje|Hang de slotenkaart op|Zet de oefendeur terug in haar kozijn|Veeg metaalstof van de werkbank|Leg de Alohomora-kaart klaar|Maak het sleutelrek stevig vast|Vervang de kromme haakjes|Sluit de kast met oefensloten'},
  {titel:'Zweven zonder morsen',open:'De kroonluchter hangt scheef en de theekopjes van Banning zweven boven de boeken. Vandaag oefenen we beheerst en precies.',les:'Een voorwerp laten zweven is pas knap als het ook rustig landt. Zet de oefenruimte klaar.',klaar:'De voorwerpen landen zacht en de kroonluchter hangt weer recht. Dat is pas gecontroleerde magie.',doelen:'Richt de kroonluchter recht boven het bord|Zet de porseleinen kopjes op de kar|Leg de oefenveren in gelijke stapels|Repareer het zweefspreukdoel|Veeg het krijt onder de werktafels weg|Hang de landingsringen op|Zet de hoge boeken terug op de plank|Maak de oefenstafjes schoon|Herstel het gordijn bij de oefenmuur|Markeer de veilige landingsplek'},
  {titel:'Reparo-practicum',open:'Een mislukte oefening heeft een vaas, een lessenaar en een paar boeken beschadigd. Gelukkig staat Reparo op het programma.',les:'Zoek eerst ieder onderdeel bij elkaar. Een reparatiespreuk werkt beter als je weet wat er ontbreekt.',klaar:'Niets rammelt meer en alle boeken zijn heel. De reparatieles kan beginnen.',doelen:'Verzamel de scherven van de oefenvaas|Zet de lessenaar weer in elkaar|Bind de losse kaft van het spreukenboek vast|Vervang het gescheurde wandtapijt|Lijm de gebroken boekensteun|Repareer de houten stoel bij het raam|Veeg het glas van de vloer|Herstel de losse plank|Zet de inktpot terug op de lessenaar|Leg de Reparo-oefenkaarten klaar'},
  {titel:'Toets in het bezweringenlokaal',open:'Professor Banning heeft een laatste oefenparcours gemaakt. De voorwerpen moeten op het juiste teken terechtkomen.',les:'Controleer de tekens, de oefenstokken en de vrije route. Daarna is het lokaal klaar voor de toets.',klaar:'De oefenbaan is gereed. Banning knikt tevreden; morgen wacht een nieuw vak.',doelen:'Hang het teken voor Wingardium Leviosa op|Zet de oefenringen op gelijke hoogte|Leg de veren voor de toets klaar|Poets de koperen oefenbel|Herstel het bord met spreuktekens|Zet de boekenkar naast de deur|Maak de landingsmatten schoon|Hang de klok boven het oefenveld|Vul de inktpotten bij|Sluit het lokaal na de avondles'}
 ],
 toverdranken:[
  {titel:'Werkbanken in de kerker',open:'De werkbanken zijn plakkerig en er borrelt iets in een vergeten ketel. Sneep wacht al bij de deur.',les:'Een nette werkplek is de eerste stap naar een veilig brouwsel. Etiketteer alles voordat je iets aanraakt.',klaar:'De werkbanken glanzen en de ketel staat uit. Sneep noemt het acceptabel; dat is hier een compliment.',doelen:'Schrob de stenen werkbanken schoon|Zet de standaardmaat-twee-ketel op het vuur|Sorteer de ingrediënten op alfabet|Hang de koperen weegschaal op|Doof de groene vlam onder de lege ketel|Vervang de gebarsten maatbeker|Zet de flesjes in het rek|Veeg gemorst poeder van de vloer|Label de pot met alsem|Leg de roerstokken naast het krijtbord'},
  {titel:'Meten en malen',open:'Voor het volgende practicum heeft Sneep fijngemalen wortels en nauwkeurig afgewogen poeders nodig.',les:'Gebruik voor elk ingrediënt een schone vijzel. Een vergeten restje kan een hele drank veranderen.',klaar:'De ingrediënten zijn afgewogen en de vijzels zijn schoon. Geen korrel ligt verkeerd.',doelen:'Maal de valeriaanwortels fijn|Weeg de affodilpoeder af|Spoel de vijzel na het malen|Zet de maatlepels op volgorde|Vervang het botte snijmes|Veeg poeder van de weegschaal|Vul de pot met gedroogde alsem|Sluit de ingrediëntenkast|Leg het recept naast de ketel|Zet de lege flesjes op een rij'},
  {titel:'De voorraadkast',open:'De voorraadkast is door elkaar geraakt. Gaasvliegjes staan naast poeder en geen enkel flesje heeft nog een leesbaar etiket.',les:'Sneep wil dat elk ingrediënt op zijn vaste plek staat. Controleer ook de houdbaarheidslabels.',klaar:'De kast is overzichtelijk en alle flesjes zijn herkenbaar. Sneep hoeft niets meer te zoeken.',doelen:'Zet de gaasvliegjes achter het glas|Label de pot met bloedzuigers|Zet de Tweehoornpoeder op de bovenste plank|Vervang het vochtige etiket van de valeriaan|Sorteer de affodilwortels op maat|Maak het flessenrek stevig vast|Veeg stof uit de voorraadkast|Sluit de pot met alsemextract|Zet het recept voor Wisseldrank klaar|Breng de lege potten naar de spoelbak'},
  {titel:'Vuur en roeren',open:'De vlam onder Sneeps ketel springt telkens omhoog. Vandaag oefenen we met temperatuur en roerrichting.',les:'Eerst moet de ketel stabiel staan. Een goede drank begint met een rustig vuur en een vaste maat.',klaar:'Het vuur is gelijkmatig en de roerkaart hangt op ooghoogte. De ketel borrelt precies goed.',doelen:'Stel de blauwe vlam lager af|Zet de ketel recht boven het vuur|Hang de roerkaart naast de werkbank|Vervang de gebarsten ketelstandaard|Vul de waterkan met schoon bronwater|Leg de klokwijzer bij het recept|Veeg roet van de schoorsteenrand|Zet de houten roerstokken in de houder|Maak de vuurhaak schoon|Sluit de luchtschuif boven de ketel'},
  {titel:'Toets Toverdranken',open:'Sneep heeft de werkplaats klaargezet voor een nauwkeurigheidsproef. Iedere maat en ieder etiket telt.',les:'Controleer alle ingrediënten en zet het recept op de lessenaar. Wie slordig werkt, begint opnieuw.',klaar:'De werkplaats is klaar voor de toets. Sneep controleert de etiketten nog één keer.',doelen:'Zet het recept voor het Lichtbrouwsel klaar|Weeg de laatste affodilwortel af|Vul het rek met schone proefbuisjes|Leg de beschermende handschoenen neer|Maak het ketelrooster schoon|Zet de timer naast het vuur|Label het flesje met alsemextract|Veeg de laatste poedervlek weg|Sluit de voorraadkast af|Doof de oefenvlam na de les'}
 ],
 gedaante:[
  {titel:'Een lokaal in verandering',open:'In het lokaal van Anderling lijkt niets meer op zijn plek te staan. Stoelen zijn klein, theekopjes groot en een kat zit op de lessenaar.',les:'We herstellen de ruimte voordat de eerste transfiguratieles begint. Verander niets zonder toestemming.',klaar:'De stoelen hebben hun gewone formaat terug en de oefenvoorwerpen liggen klaar.',doelen:'Zet de gewone stoelen terug in de kring|Verzamel de luciferhoutjes van de vloer|Leg de oefennaalden in hun doos|Zet de theekopjes op het dienblad|Veeg krijt van de transfiguratietafel|Hang de stappenkaart naast het bord|Herstel de omgevallen lessenaar|Zet de oefenmuizen in hun kooi|Maak de koperen bel schoon|Leg het Standaardspreukenboek klaar'},
  {titel:'Vormen en materialen',open:'Professor Anderling heeft een reeks voorwerpen klaargelegd die van vorm mogen veranderen, maar niet mogen breken.',les:'Let op materiaal en gewicht. Een houten knop vraagt een andere aanpak dan een porseleinen kopje.',klaar:'Elk voorwerp heeft zijn juiste vorm en materiaal behouden. Dat is nauwkeurig werk.',doelen:'Sorteer de houten knopen op maat|Zet de porseleinen kopjes op het kleed|Leg de zilveren naalden in het etui|Herstel de houten oefenlat|Poets het koperen transfiguratieteken|Zet de oefenmuizen terug in de kooi|Vervang de gebarsten schaal|Veeg houtkrullen van de tafel|Hang de materiaalkaart op|Leg de oefenlucifers in het doosje'},
  {titel:'De muis en het theekopje',open:'De oefenmuizen zijn uit hun kooi en een theekopje piept verdacht hard. Tilly houdt afstand.',les:'Niemand wordt voor de grap in iets anders veranderd. Zet de veilige oefenplek klaar.',klaar:'De muizen zitten veilig en de kopjes zijn weer kopjes. Anderling is tevreden met onze voorzichtigheid.',doelen:'Repareer het slotje van de muizenkooi|Zet het oefentheekopje op de mat|Leg de zachte doek naast de kooi|Vervang het gebroken voederbakje|Veeg stro van de transfiguratietafel|Hang de veiligheidsregels op|Zet de reservekooien naast de muur|Maak de oefenbel hoorbaar|Leg de toverstokken in hun houder|Sluit het raam boven de dierenhoek'},
  {titel:'Gedaanteverwisseling oefenen',open:'Vandaag oefenen we met kleine veranderingen: kleur, vorm en oppervlak. De oefenvoorwerpen liggen al klaar.',les:'Werk stap voor stap en noteer wat er verandert. Een goede transfiguratie laat geen losse onderdelen achter.',klaar:'De oefenvoorwerpen zijn netjes teruggezet en alle veranderingen zijn genoteerd.',doelen:'Leg de kleurstenen in de juiste schaal|Zet de oefenblokken op grootte|Vervang het versleten tekenbord|Hang de observatiekaarten op|Poets het glazen proefplaatje|Veeg de snippers van de vloer|Zet het vergrootglas op de lessenaar|Vul de inktpot voor de aantekeningen|Herstel de losse stoelpoten|Leg de oefenvoorwerpen per materiaal weg'},
  {titel:'Toets bij Professor Anderling',open:'De laatste oefening combineert vorm, materiaal en geduld. Professor Anderling heeft alles klaargelegd.',les:'Controleer de kooi, de kopjes en de veiligheidskaart. Dan kan de toets beginnen.',klaar:'Het lokaal is klaar en de oefenvoorwerpen zijn veilig. Anderling wenst ons succes.',doelen:'Zet de toetskopjes op de gemarkeerde plekken|Leg de luciferhoutjes in een rechte rij|Sluit de muizenkooi stevig af|Hang de beoordelingskaart op|Vervang het kapotte proefglas|Poets de lessenaar van Anderling|Zet de oefenbel naast de deur|Veeg de laatste snippers weg|Leg het schrift voor waarnemingen klaar|Sluit het lokaal na de toets'}
 ],
 astronomie:[
  {titel:'De toren opent',open:'De Astronomietoren is koud en donker. Boven de wolken staan de sterren al klaar voor de eerste les.',les:'Zet de telescopen stabiel neer en maak de sterrenkaarten zichtbaar. De nachtles begint zodra de hemel helder is.',klaar:'De toren is veilig en de eerste telescoop kijkt naar het oosten. Sinistra kan beginnen.',doelen:'Veeg stof van de telescooplens|Zet de sterrenkaarten op de lessenaar|Herstel de losse reling bij het balkon|Hang de maanfasenkaart op|Leg de warme dekens op de bank|Maak het nachtlantaarnlicht zachter|Zet het hemelmodel in het midden|Veeg bladeren van de trap|Vervang de gebarsten sterrenbol|Open het dakluik voor de observatie'},
  {titel:'De maanstanden',open:'Professor Sinistra wil de maan door de telescoop volgen. De oude meetlatten en kaarten zijn door elkaar geraakt.',les:'Leg de maanstanden in volgorde en zorg dat de telescoop niet kan verschuiven.',klaar:'De maanstandentafel klopt weer. De wolken trekken precies op tijd weg.',doelen:'Orden de kaarten van nieuwe maan tot volle maan|Zet de telescoop op de maan|Herstel de draaiknop van het hemelmodel|Hang de getijdentabel op|Poets de zilveren meetlat|Leg de sterrenkijkers bij de deur|Vervang het gescheurde maankaartje|Zet de kruk stevig bij het oostraam|Veeg krijt van de maancyclus|Sluit het luik tegen de koude wind'},
  {titel:'Sterrenbeelden zoeken',open:'Tilly denkt dat een groep sterren op een koekenpan lijkt. Sinistra noemt het een sterrenbeeld en geeft ons een kaart.',les:'Verbind de juiste sterren en noteer hun namen. We richten de kijkers op de noordelijke hemel.',klaar:'De sterrenkaart is compleet en zelfs Tilly heeft de Grote Beer gevonden.',doelen:'Hang de kaart van de Grote Beer op|Zet de noordelijke telescoop vast|Leg de koperen passer bij de kaarten|Herstel het sterrenbeeldbord|Poets de kleine kijker voor Tilly|Sorteer de sterrenfiches op helderheid|Vervang het kapotte kompas|Zet de lessenaar uit de tocht|Veeg krijtstof van de hemelkaart|Leg het logboek naast het raam'},
  {titel:'De hemelbol',open:'De hemelbol draait niet meer mee met de sterren. Professor Sinistra wil dat we de tandwielen voorzichtig herstellen.',les:'Controleer de as, de ringen en de markeringen voordat je de bol laat draaien.',klaar:'De hemelbol beweegt weer gelijkmatig. De sterren staan op hun juiste plaats.',doelen:'Zet de armillairsfeer recht|Repareer de losse tandring van de hemelbol|Poets de messing sterrenwijzer|Hang de kaart van Jupiter op|Leg de observatieformulieren klaar|Vervang het versleten draaikoord|Zet de maanlamp naast de bol|Veeg metaalstof van de werktafel|Herstel het label van Europa|Sluit het balkonluik na de proef'},
  {titel:'Nachtelijk observatorium',open:'De laatste observatie van dit vak is vannacht. Dekens, kaarten en kijkers moeten klaarstaan voordat de sterren verschijnen.',les:'Controleer de hemel, noteer de tijd en deel de telescopen zorgvuldig in.',klaar:'De observatie is afgerond. Sinistra bewaart onze kaarten in het archief.',doelen:'Zet de drie telescopen op hun markeringen|Hang de definitieve sterrenkaart op|Vul het logboek met de waarnemingstijd|Leg warme mantels op de bank|Herstel de lantaarn bij de trap|Poets de grote lens voor de laatste blik|Zet de hemelbol op de winterstand|Sorteer de kaarten in het archief|Veeg het balkon droog|Sluit de toren na de nachtles'}
 ],
 verweer:[
  {titel:'Een kast die bromt',open:'In het Verweerlokaal bromt een oude kast. Professor Lupos wil eerst de ruimte veilig maken voor we kijken wat erin zit.',les:'Zet de schilden klaar, maak de vluchtroute vrij en blijf uit de buurt van de kastdeur.',klaar:'De kast staat stevig en de schilden zijn op hun plaats. We kunnen veilig oefenen.',doelen:'Zet het oefenschild naast de deur|Maak de vluchtroute vrij van banken|Herstel het slot van de Boemankast|Hang de beschermspreuk boven het bord|Leg de oefenstokken op de mat|Veeg zwarte nevel van het raam|Vervang de gebarsten schildsteen|Zet de noodbel binnen handbereik|Sluit de voorraadkast met amuletten|Markeer de veilige afstand tot de kast'},
  {titel:'Schildspreuken',open:'De eerste oefenschilden flikkeren en verdwijnen te snel. Lupos wil de beschermende ruimte opnieuw inrichten.',les:'Een schild werkt alleen als iedereen weet waar te staan. Zet de oefenlijn en de amuletten klaar.',klaar:'De schilden houden stand en iedereen kent de veilige plek.',doelen:'Trek de oefenlijn voor Protego|Hang de schildspreukkaart op|Zet de amuletten in het rek|Herstel het oefenschild aan de muur|Poets het beschermkristal|Leg de oefenstokken op kleur|Vervang de gescheurde mat|Veeg krijt van de afstandsmarkering|Zet de nooddeur vrij|Sluit de kast met reserve-amuletjes'},
  {titel:'De Boeman durft',open:'De Boemankast rammelt harder dan gisteren. Tilly houdt een chocoladekikker achter haar rug voor het geval dat.',les:'We oefenen eerst met de juiste afstand en een vrije vloer. Gelach is straks het belangrijkste hulpmiddel.',klaar:'De kast blijft dicht tot de les begint en niemand staat in de weg van de oefenbaan.',doelen:'Zet de Boemankast op de rubberen mat|Versterk de scharnieren van de kastdeur|Hang de Riddikulus-kaart naast het bord|Leg de oefenmantels bij de bank|Maak de lach-oefenruimte vrij|Vervang de kapotte sluitpin|Zet een schildsteen bij de uitgang|Veeg stof uit de kastnis|Hang de veiligheidsbel op|Leg de chocoladekikker op de docententafel'},
  {titel:'Zwarte nevel en licht',open:'Een donkere nevel kruipt langs de oefenmuur. Lupos laat ons zien hoe licht en bescherming elkaar aanvullen.',les:'Richt de lantaarns op de nevel en houd de schilden binnen handbereik.',klaar:'De nevel is verdwenen en de beschermstenen gloeien rustig.',doelen:'Richt de lantaarn op de oefenmuur|Zet het schildkristal in de houder|Herstel het lichtpaneel naast de deur|Hang de Lumos-oefenkaart op|Veeg roet van de beschermmuur|Vervang het kapotte glas van de lantaarn|Zet de oefenschilden in een kring|Leg de noodfluit op de lessenaar|Markeer de schaduwvrije zone|Sluit de donkere kast na de demonstratie'},
  {titel:'Practicum Verweer',open:'De laatste les vraagt om moed, oplettendheid en een goed ingerichte oefenruimte. Lupos controleert ieder schild.',les:'Zorg dat de Boemankast, de schilden en de route naar de deur allemaal veilig zijn.',klaar:'De oefenruimte is klaar. Lupos bedankt ons en stuurt ons met Tilly naar het volgende avontuur.',doelen:'Controleer het slot van de Boemankast|Zet het grote schild voor de oefenkring|Hang de laatste beschermspreuk op|Vervang de versleten oefenmat|Leg de Riddikulus-kaart op de lessenaar|Poets het schildamulet|Veeg de laatste nevelsporen weg|Zet de noodbel bij de uitgang|Sluit de kast met de reservepin|Maak de deur vrij voor de volgende klas'}
 ]
};

const SCHOOL_DAGEN_PER_VAK=5;
const SCHOOL_LEVELS_PER_DAG=20;
const SCHOOL_DOELEN_PER_DAG=10;
const SCHOOL_DOELKOSTEN=[1,3,1,3,1,3,1,3,1,3];
const SCHOOL_POSITIES=[[16,24],[50,18],[82,26],[23,45],[75,46],[15,66],[48,62],[84,68],[31,83],[70,84]];
const SCHOOL_ICONEN=['blad','zon','bloem','hart','ster','boek','gieter','maan','lijst','beker'];
const SCHOOL_KAMERS={
 herbologie:{lokaal:'De Kas',img:'decor-kas',decor:'kas'},
 bezweringen:{lokaal:'Het Bezweringenlokaal',img:'decor-bibliotheek',decor:'bieb'},
 toverdranken:{lokaal:'Het Toverdrankenlokaal',img:'decor-kerker',decor:'kerker'},
 gedaante:{lokaal:'Het lokaal van Professor Anderling',img:'decor-gang',decor:'gang'},
 astronomie:{lokaal:'De Astronomietoren',img:'decor-telescoop',decor:'toren'},
 verweer:{lokaal:'Het Verweerlokaal',img:'decor-glas',decor:'gang'}
};

const schoolDagIndexVanVoortgang=()=>Math.max(0,Math.min(M3VAKKEN.length*SCHOOL_DAGEN_PER_VAK,
 Math.floor((Math.max(1,+S.m3lvl||1)-1)/SCHOOL_LEVELS_PER_DAG)));
if(!Number.isInteger(S.schoolDag)){
 S.schoolDag=schoolDagIndexVanVoortgang();
 bewaar();
}
S.schoolDag=Math.max(0,Math.min(M3VAKKEN.length*SCHOOL_DAGEN_PER_VAK,+S.schoolDag||0));
S.taken=S.taken||{};

function schoolDag(index=S.schoolDag){
 if(index>=M3VAKKEN.length*SCHOOL_DAGEN_PER_VAK)return null;
 const vakIndex=Math.floor(index/SCHOOL_DAGEN_PER_VAK);
 const dagIndex=index%SCHOOL_DAGEN_PER_VAK;
 const vak=M3VAKKEN[vakIndex];
 const lokaal=SCHOOL_KAMERS[vak.id];
 const inhoud=SCHOOLDOELEN[vak.id][dagIndex];
 const dagNummer=dagIndex+1;
 const begin=vak.van+dagIndex*SCHOOL_LEVELS_PER_DAG;
 const einde=begin+SCHOOL_LEVELS_PER_DAG-1;
 const doelen=inhoud.doelen.split('|');
 if(doelen.length!==SCHOOL_DOELEN_PER_DAG)throw new Error(`${vak.id} dag ${dagNummer} moet tien doelen hebben`);
 const volgendeIndex=index+1;
 const volgendeVak=M3VAKKEN[Math.floor(volgendeIndex/SCHOOL_DAGEN_PER_VAK)];
 const volgendeInhoud=volgendeIndex<M3VAKKEN.length*SCHOOL_DAGEN_PER_VAK
  ?SCHOOLDOELEN[volgendeVak.id][volgendeIndex%SCHOOL_DAGEN_PER_VAK]:null;
 const volgendeZin=volgendeInhoud
  ?volgendeIndex%SCHOOL_DAGEN_PER_VAK===0
   ?`Morgen gaan we naar ${volgendeVak.n}. ${volgendeInhoud.open}`
   :`Morgen pakken we ${volgendeInhoud.titel} aan. ${volgendeInhoud.open}`
  :'Zeshonderd levels en driehonderd hersteldoelen verder is het hele kasteel weer thuis.';
 const taken=doelen.map((naam,indexDoel)=>[
  `school-${vak.id}-dag-${dagNummer}-doel-${indexDoel+1}`,
  naam,
  SCHOOL_DOELKOSTEN[indexDoel],
  SCHOOL_ICONEN[indexDoel],
  SCHOOL_POSITIES[indexDoel],
  `${naam}. ${indexDoel%2?'De professor knikt tevreden.':'Tilly ziet meteen verschil.'}`
 ]);
 const levelsOver=Math.max(0,einde-(S.m3lvl||1)+1);
 const outro=[
  [vak.prof,inhoud.klaar],
  ['Tilly',levelsOver?`De tien doelen zijn af. Nog ${levelsOver} levels en dan begint de volgende schooldag.`:volgendeZin]
 ];
 outro.schoolDagIndex=index;
 return{
  index,vak,inhoud,begin,einde,dagNummer,
  v:{id:`school-${vak.id}-dag-${dagNummer}`,n:`${vak.n} · Dag ${dagNummer} van 5`,lokaal:lokaal.lokaal,decor:lokaal.decor,img:lokaal.img,prof:vak.prof,thema:vak.thema,
   intro:[['Tilly',`Schooldag ${dagNummer} van 5 bij ${vak.n}. ${inhoud.open}`],[vak.prof,`${inhoud.les} Deze dag loopt van level ${begin} tot en met ${einde}; tien hersteldoelen kosten samen twintig sterren.`]],
   outro,taken,schoolDagIndex:index,schoolDagBegin:begin,schoolDagEinde:einde,schoolDagTitel:inhoud.titel}
 };
}

function schoolDagDoelenKlaar(stage){return !!stage&&stage.v.taken.every(t=>S.taken[t[0]])}
function schoolDagKanStarten(level){
 const stage=schoolDag();
 return !!stage&&level<=(S.m3lvl||1)&&level<=stage.einde;
}
function schoolDagDoorgaan(stage){
 if(!stage||stage.index!==S.schoolDag||!schoolDagDoelenKlaar(stage)||(+S.m3lvl||1)<=stage.einde)return false;
 S.schoolDag=Math.min(M3VAKKEN.length*SCHOOL_DAGEN_PER_VAK,stage.index+1);
 bewaar();
 try{bonusCheck()}catch(e){}
 return true;
}

const schoolVerhaalOud=verhaal;
verhaal=function(regels,klaar){
 const index=regels&&regels.schoolDagIndex;
 if(index==null)return schoolVerhaalOud.call(this,regels,klaar);
 return schoolVerhaalOud.call(this,regels,()=>{
  const door=schoolDagDoorgaan(schoolDag(index));
  if(door&&document.body.dataset.view==='home')V.home();
  if(klaar)klaar();
 });
};

const schoolHuidigVakOud=huidigVak;
huidigVak=function(){
 const stage=schoolDag();
 if(!stage){const laatste=schoolDag(M3VAKKEN.length*SCHOOL_DAGEN_PER_VAK-1);return{j:M3VAKKEN.length,vs:[laatste.v],v:laatste.v}}
 return{j:Math.floor(stage.index/SCHOOL_DAGEN_PER_VAK)+1,vs:[stage.v],v:stage.v};
};
jaar=function(){return Math.min(M3VAKKEN.length,Math.floor(S.schoolDag/SCHOOL_DAGEN_PER_VAK)+1)};
window.schoolDagNaDoelen=function(v){
 const stage=schoolDag();
 if(stage&&v&&v.schoolDagIndex===stage.index)schoolDagDoorgaan(stage);
};

const schoolBonusDag={memory:1,lessen:1,drank:2,snaai:10,spreuk:6,toverstok:7,mysterie:20,bonen:25};
bonusVrij=function(b){return !!S.bonusOpen[b[0]]||S.schoolDag>=schoolBonusDag[b[0]]};

const schoolGaOud=ga;
ga=function(s,...a){
 if(s==='match3'){
  const level=a[0]||S.m3lvl||1;
  if(!schoolDagKanStarten(level)){
   const stage=schoolDag();
   schoolGaOud('home');
   toast(stage&&level>stage.einde?`Rond de tien doelen van ${stage.inhoud.titel} af om verder te gaan.`:`Speel eerst level ${S.m3lvl||1}.`);
   return;
  }
 }
 return schoolGaOud(s,...a);
};

const schoolMatch3Oud=V.match3;
V.match3=async function(level,...a){
 level=level||S.m3lvl||1;
 if(!schoolDagKanStarten(level)){
  schoolGaOud('home');
  return;
 }
 return schoolMatch3Oud.call(this,level,...a);
};

const schoolHomeOud=V.home;
V.home=function(...a){
 const result=schoolHomeOud.apply(this,a);
 const stage=schoolDag()||schoolDag(M3VAKKEN.length*SCHOOL_DAGEN_PER_VAK-1);
 const header=document.querySelector('.lokaal .lk-kop small');
 const info=document.createElement('p');
 const afgerond=stage.v.taken.filter(t=>S.taken[t[0]]).length;
 if(header)header.textContent=`Schooldag ${stage.dagNummer} van 5 · ${stage.vak.n} · levels ${stage.begin}–${stage.einde}`;
 const teller=document.querySelector('.lokaal .lk-tel');
 if(teller){
  const mist=document.querySelector('.lokaal .scene-mist');
  if(mist)mist.style.opacity=String(1-afgerond/SCHOOL_DOELEN_PER_DAG);
  info.className='schooldag-voortgang';
  info.textContent=`${stage.inhoud.titel} · ${afgerond}/${SCHOOL_DOELEN_PER_DAG} doelen · ${SCHOOL_DOELKOSTEN.reduce((totaal,kost)=>totaal+kost,0)} sterren totaal`;
  teller.insertAdjacentElement('afterend',info);
  const lijst=document.createElement('details');
  lijst.className='schooldoelenlijst';
  lijst.innerHTML=`<summary>Alle tien hersteldoelen (${afgerond}/10)</summary><ol>${stage.v.taken.map(t=>`<li class="${S.taken[t[0]]?'af':''}"><span>${t[1]}</span><b>${S.taken[t[0]]?'Klaar':`${icoon('ster')}${t[2]}`}</b></li>`).join('')}</ol>`;
  info.insertAdjacentElement('afterend',lijst);
 }
 const spelen=$('#speelknop');
 if(S.schoolDag>=M3VAKKEN.length*SCHOOL_DAGEN_PER_VAK){
  if(spelen){spelen.disabled=true;spelen.textContent='Alle 600 levels en 300 doelen afgerond';}
 }else if(spelen&&(S.m3lvl||1)>stage.einde&&!schoolDagDoelenKlaar(stage)){
  spelen.textContent=`Dagdoelen ${afgerond}/10 · eerst afronden`;
  spelen.onclick=()=>{toast(`Nog ${SCHOOL_DOELEN_PER_DAG-afgerond} hersteldoelen voor de volgende schooldag.`);$('#taakknop')&&$('#taakknop').scrollIntoView({behavior:'smooth',block:'center'})};
 }
 return result;
};

const schoolPadOud=V.pad;
V.pad=function(vakId,...a){
 const result=schoolPadOud.call(this,vakId,...a);
 const stage=schoolDag();
 const huidigeVak=vakId||vakVan(S.m3lvl||1).id;
 if(!stage||huidigeVak!==stage.vak.id)return result;
 const beeld=document.querySelector('.padkopbeeld');
 if(beeld){
  const klaar=stage.v.taken.filter(t=>S.taken[t[0]]).length;
  beeld.insertAdjacentHTML('afterend',`<section class="schooldag-kaart"><small>Schooldag ${stage.dagNummer} van 5 · levels ${stage.begin}–${stage.einde}</small><h3>${stage.inhoud.titel}</h3><p>${klaar}/10 hersteldoelen · ${S.schoolDag===stage.index&&(+S.m3lvl||1)>stage.einde?'Doelen nodig voor de volgende dag':'Elke levelwinst levert een huisschild op'}</p><button class="knop klein" onclick="ga('home')">Bekijk de hersteldoelen</button></section>`);
 }
 document.querySelectorAll('.padlvl').forEach(knoop=>{
  const level=+knoop.dataset.l;
  if(level<=stage.einde&&(level-stage.vak.van+1)%SCHOOL_LEVELS_PER_DAG===0){
   knoop.classList.add('schooldag-einde');
   knoop.title=`Einde schooldag ${stage.dagNummer}: voltooi tien hersteldoelen`;
  }
  if(level===stage.einde+1){
   knoop.classList.add('schooldag-poort');
   knoop.title=`Level ${level} opent na de tien doelen van ${stage.inhoud.titel}`;
  }
 });
 return result;
};

const schoolWinstOud=m3Winst;
m3Winst=function(level,bord){
 const stage=schoolDag();
 const result=schoolWinstOud.apply(this,arguments);
 if(stage&&stage.index===S.schoolDag&&level===stage.einde&&schoolDagDoelenKlaar(stage)){
  const volgende=stage.index+1<M3VAKKEN.length*SCHOOL_DAGEN_PER_VAK?schoolDag(stage.index+1):null;
  const slotStory=[[stage.vak.prof,stage.inhoud.klaar],['Tilly',volgende?`De volgende schooldag is ${volgende.inhoud.titel} bij ${volgende.vak.n}. ${volgende.inhoud.open}`:'Zeshonderd levels, driehonderd doelen. We hebben het hele kasteel samen opgebouwd.']];
  setTimeout(()=>verhaal(slotStory,()=>{
  if(S.schoolDag===stage.index+1&&document.body.dataset.view!=='home')schoolGaOud('home');
  }),0);
 }
 return result;
};

window.schoolDagen={
 totaal:M3VAKKEN.length*SCHOOL_DAGEN_PER_VAK,
 doelenPerDag:SCHOOL_DOELEN_PER_DAG,
 dagenPerVak:SCHOOL_DAGEN_PER_VAK,
 levelsPerDag:SCHOOL_LEVELS_PER_DAG,
 sterrenPerDag:SCHOOL_DOELKOSTEN.reduce((totaal,kost)=>totaal+kost,0),
 huidig:()=>schoolDag(),
 compleet:schoolDagDoelenKlaar
};