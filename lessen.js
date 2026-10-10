'use strict';
// Lessen: [vraag, juist, [4 foute], uitleg]
const VAKKEN=[
{id:'dranken',n:'Toverdranken',ico:'⚗️',prof:'Professor Severus Sneep',img:'ketel-foto',intro:'“Er wordt hier niet met toverstokken gezwaaid. Ik kan u leren hoe u roem kunt brouwen en zelfs de dood kunt uitstellen – als u tenminste geen stelletje sukkels bent.” Vandaag: de klassiekers uit de kerkers van Zweinstein.',q:[
['Wat krijg je als je poeder van affodilwortel toevoegt aan een aftreksel van alsem?','Vocht van de Levende Dood',['Wisseldrank','Peperdrankje','Amortentia','Felix Fortunatis'],'Dat was Sneeps allereerste vraag aan Harry: een slaapdrank zo krachtig dat hij de Levende Dood heet.'],
['Waar vind je een bezoar?','In de maag van een geit',['In een drakenei','In de hoorn van een eenhoorn','Onder de Beukwilg','In een Mandragorawortel'],'Een bezoar is een steen uit de maag van een geit en beschermt tegen de meeste vergiften.'],
['Wat is het verschil tussen monnikskap en wolfswortel?','Er is geen verschil',['Monnikskap is giftig, wolfswortel niet','Wolfswortel groeit alleen bij volle maan','Monnikskap is een paddenstoel','Wolfswortel is een dier'],'Het is dezelfde plant, ook bekend als akoniet. Nog een strikvraag van Sneep.'],
['Hoe lang werkt een dosis Wisseldrank?','Een uur',['Tien minuten','Een etmaal','Een week','Tot zonsondergang'],'Daarom moest Barto Krenck jr. als nep-Dolleman steeds uit zijn heupfles drinken.'],
['Welke professor gaf Toverdranken in Harry’s zesde jaar?','Hildebrand Slakhoorn',['Severus Sneep','Gladianus Smalhart','Remus Lupos','Filius Banning'],'Slakhoorn kwam terug uit pensioen; Sneep kreeg eindelijk Verweer tegen de Zwarte Kunsten.'],
['Welke drank won Harry in Slakhoorns eerste les?','Felix Fortunatis',['Amortentia','Veritaserum','Wisseldrank','Peperdrankje'],'Dankzij de aantekeningen van de Halfbloed Prins brouwde hij het beste Vocht van de Levende Dood.'],
['Welke drank dwingt de drinker de waarheid te spreken?','Veritaserum',['Amortentia','Vergeetdrank','Kalmeringsdrank','Felix Fortunatis'],'Drie druppels Veritaserum zijn genoeg, en het gebruik ervan is streng gereguleerd.'],
['Hoe ruikt Amortentia?','Voor iedereen anders: naar wat jou aantrekt',['Naar rozen','Naar niets','Naar zwavel','Naar pepermunt'],'Hermelien rook gemaaid gras, nieuw perkament en… iets dat verdacht veel op Ron leek.']]},
{id:'kruiden',n:'Kruidenkunde',ico:'🌿',prof:'Professor Pomona Stronk',img:'venusvliegenval',intro:'“Oorwarmers op, handschoenen aan!” In kas drie leert u omgaan met planten die bijten, krijsen en wurgen. Hoe gevaarlijker, hoe interessanter.',q:[
['Waarom draag je oorwarmers bij het verpotten van Mandragora’s?','Hun gekrijs kan dodelijk zijn',['Het is koud in de kas','Ze bijten in oren','Ze zingen vals','Tegen de geur'],'Het gekrijs van een volgroeide Mandragora is dodelijk; jonge exemplaren maken je “alleen” een paar uur bewusteloos.'],
['Waarvoor werden de Mandragora’s in het tweede jaar gekweekt?','Om versteende leerlingen te genezen',['Voor Wisseldrank','Als kerstversiering','Om de Beukwilg te voeden','Voor Felix Fortunatis'],'Mandragorasap herstelt wie versteend is – zoals de slachtoffers van de basilisk.'],
['Hoe ontsnap je aan Duivelsstrik?','Met licht en warmte',['Door hard te trekken','Door water te gieten','Door hem te kietelen','Door Accio te roepen'],'Hermelien maakte blauwe vlammen; Duivelsstrik houdt van donker en vocht.'],
['Met welke plant kon Harry onder water ademen tijdens de tweede opdracht?','Kieuwwier',['Mandragora','Affodil','Pufpeul','Alsem'],'Kieuwwier gaf hem kieuwen en zwemvliezen.'],
['Welke boom op het terrein slaat alles wat te dichtbij komt?','De Beukwilg',['De Wiggenboom','De Treurwilg','De Grote Eik','De Fluisterden'],'De Beukwilg werd geplant toen Remus Lupos naar Zweinstein kwam, boven de geheime gang naar het Krijsende Krot.'],
['Wie werd later zelf professor Kruidenkunde op Zweinstein?','Marcel Lubbermans',['Hermelien Griffel','Ginny Wemel','Loena Leeflang','Seamus Filister'],'Marcel was altijd al een kei in Kruidenkunde.'],
['Welke mest gebruikt professor Stronk graag?','Drakenmest',['Hippogriefmest','Uilenkeutels','Kattenbakkorrels','Zeewier'],'Ze had het over drakenmest; op weg naar haar kassen kwam je de lucht ervan tegen.'],
['Wat is de voornaam van professor Stronk?','Pomona',['Poppy','Minerva','Aurora','Rolanda'],'Pomona, naar de Romeinse godin van fruitbomen. Ze is ook afdelingshoofd van Huffelpuf.']]},
{id:'bezwer',n:'Bezweringen',ico:'🪄',prof:'Professor Filius Banning',img:'oude-boeken',intro:'De kleine professor Banning staat op een stapel boeken. “En denk eraan: zwaaien en tikken! En spreek het juist uit!”',q:[
['Met welke spreuk lieten eerstejaars een veer zweven?','Wingardium Leviosa',['Accio','Lumos','Alohomora','Reparo'],'“Het is Levi-ó-sa, niet Levio-sá!” – Hermelien tegen Ron.'],
['Wat doet Accio?','Een voorwerp naar je toe roepen',['Iets laten zweven','Licht maken','Een deur openen','Iets laten verdwijnen'],'Harry riep er zijn Vuurflits mee op bij de eerste opdracht van het Toverschool Toernooi.'],
['Welke spreuk geeft licht aan de punt van je toverstok?','Lumos',['Nox','Incendio','Lumos Solem','Reparo'],'Nox dooft het licht weer.'],
['Welke spreuk opent een slot?','Alohomora',['Colloportus','Accio','Expelliarmus','Wingardium Leviosa'],'Hermelien gebruikte hem in het eerste jaar om bij de verboden gang te komen.'],
['Welke spreuk roept een Patronus op?','Expecto Patronum',['Expelliarmus','Riddikulus','Protego','Lumos'],'Een Patronus beschermt tegen Dementors.'],
['Welke spreuk ontwapent een tegenstander?','Expelliarmus',['Paralitis','Protego','Petrificus Totalus','Accio'],'Het werd Harry’s kenmerkende spreuk.'],
['Welke spreuk repareert gebroken voorwerpen?','Reparo',['Accio','Evanesco','Nox','Alohomora'],'Hermelien repareerde er Harry’s bril mee.'],
['Wat is bijzonder aan professor Banning?','Hij heeft kobolden onder zijn voorouders',['Hij is een spook','Hij is een Animagus','Hij is een weerwolf','Hij is een reus'],'Hij is ook afdelingshoofd van Ravenklauw en was vroeger kampioen duelleren.']]},
{id:'gedaante',n:'Gedaanteverwisselingen',ico:'🐈',prof:'Professor Minerva Anderling',img:'kasteel',intro:'“Gedaanteverwisselingen is een van de moeilijkste en gevaarlijkste vormen van toverkunst die u op Zweinstein zult leren.” Ze verandert haar bureau in een varken en weer terug.',q:[
['In welk dier kan professor Anderling veranderen?','Een cyperse kat',['Een uil','Een hert','Een hond','Een raaf'],'Ze heeft vierkante tekeningen rond haar ogen, net als haar bril.'],
['Wat is een Animagus?','Een tovenaar die in een dier kan veranderen',['Een magisch huisdier','Een dier dat kan toveren','Een spreuk','Een soort Patronus'],'Animagi moeten zich laten registreren bij het Ministerie.'],
['Welke vorm heeft Sirius Zwarts als Animagus?','Een grote zwarte hond',['Een wolf','Een kat','Een rat','Een hert'],'Daarom dacht Harry dat hij de Grim zag.'],
['Welke vorm heeft Peter Pippeling als Animagus?','Een rat',['Een kever','Een uil','Een pad','Een slang'],'Twaalf jaar lang leefde hij als Schurfie, het huisdier van Ron.'],
['Wat moesten eerstejaars in hun eerste les veranderen?','Een lucifer in een naald',['Een muis in een snuifdoos','Een kever in een knoop','Een theepot in een schildpad','Een veer in een uil'],'Alleen Hermelien kreeg het in die les een beetje voor elkaar.'],
['In welk dier kan Rita Pulpers veranderen?','Een kever',['Een vlinder','Een mug','Een spin','Een rat'],'Een niet-geregistreerde Animagus – Hermelien hield haar in een jampot gevangen.'],
['Welke vorm had James Potter als Animagus?','Een hert',['Een hond','Een leeuw','Een paard','Een adelaar'],'Daarom heette hij Gaffel; Harry’s Patronus is ook een hert.'],
['Van welke afdeling is professor Anderling het hoofd?','Griffoendor',['Huffelpuf','Ravenklauw','Zwadderich','Geen enkele'],'Ze is ook adjunct-schoolhoofd van Zweinstein.']]},
{id:'fabel',n:'Verzorging van Fabeldieren',ico:'🦄',prof:'Professor Rubeus Hagrid',img:'varen',intro:'Hagrid wacht bij zijn hut aan de rand van het Verboden Bos. “Kom maar dichterbij, ze doen niks… meestal.”',q:[
['Welk dier behandelde Hagrid in zijn allereerste les?','Hippogriefen',['Draken','Eenhoorns','Flubberwurmen','Terzielers'],'Scheurbek de hippogrief speelde daarna een grote rol.'],
['Hoe begroet je een hippogrief?','Buigen en oogcontact houden',['Hem eten geven','Op zijn rug springen','Fluiten','Zijn naam roepen'],'Pas als hij terugbuigt, mag je dichterbij komen.'],
['Hoe heette Hagrids babydraak?','Norbert',['Pluisje','Scheurbek','Aragog','Muil'],'Charlie Wemel nam hem mee naar Roemenië.'],
['Hoe heet de driekoppige hond die de Steen der Wijzen bewaakte?','Pluisje',['Muil','Grim','Norbert','Scheurbek'],'Pluisje valt in slaap van muziek.'],
['Welke dieren kun je alleen zien als je iemand hebt zien sterven?','Terzielers',['Hippogriefen','Dementors','Eenhoorns','Kobolden'],'Ze trekken de koetsen naar Zweinstein.'],
['Hoe kalmeer je Het Monsterlijke Monsterboek?','Over de rug aaien',['Erop gaan zitten','Er water op gooien','Ertegen zingen','Het dichtbinden'],'Niemand had het ontdekt, behalve Hagrid natuurlijk.'],
['Wat doet eenhoornbloed?','Het houdt je in leven, maar je leven wordt vervloekt',['Het geneest elke ziekte','Het maakt je onzichtbaar','Het is vergif','Het laat je vliegen'],'Voldemort dronk het in het Verboden Bos.'],
['Hoe heet Hagrids reusachtige spin?','Aragog',['Arachne','Muil','Pluisje','Scheurbek'],'Aragog woonde met zijn familie diep in het Verboden Bos.']]},
{id:'astro',n:'Astronomie',ico:'🔭',prof:'Professor Aurora Sinistra',img:'sterrenhemel',intro:'Middernacht op de Astronomietoren. Telescopen staan klaar en de hemel boven het meer is helder.',q:[
['Waar vinden de lessen Astronomie plaats?','Op de hoogste toren, ’s nachts',['In de kerkers','In de kassen','In de Grote Zaal','In het Verboden Bos'],'De Astronomietoren is de hoogste toren van het kasteel.'],
['Wie geeft Astronomie op Zweinstein?','Professor Aurora Sinistra',['Professor Zwamdrift','Professor Kist','Professor Banning','Professor Plijster'],'Professor Zwamdrift geeft Waarzeggerij, niet Astronomie.'],
['In welk sterrenbeeld staat de ster Sirius?','De Grote Hond',['De Leeuw','Orion','De Draak','De Kleine Beer'],'Sirius is de helderste ster aan de nachthemel. Passend voor een Animagus-hond.'],
['Wat is de grootste planeet van ons zonnestelsel?','Jupiter',['Saturnus','Mars','Venus','Neptunus'],'Harry en Ron moesten ooit huiswerk maken over de manen van Jupiter.'],
['Draco Malfidus is genoemd naar een sterrenbeeld. Wat betekent Draco?','Draak',['Slang','Leeuw','Adelaar','Hond'],'Veel leden van de familie Zwarts zijn naar sterren genoemd.'],
['In welk sterrenbeeld staat de ster Regulus?','De Leeuw',['De Grote Hond','Orion','Cassiopeia','De Zwaan'],'Regulus Zwarts, de broer van Sirius, deelt zijn naam met deze ster.'],
['Welke planeet zeggen de centauren vaak dat hij fel schijnt?','Mars',['Venus','Jupiter','Saturnus','Mercurius'],'“Mars schijnt fel vannacht,” zegt Firenze in het eerste boek.'],
['Bellatrix is een ster in welk sterrenbeeld?','Orion',['De Draak','De Grote Beer','De Leeuw','Cassiopeia'],'Bellatrix betekent “strijdster”.']]},
{id:'gesch',n:'Geschiedenis van de Toverkunst',ico:'📜',prof:'Professor Kist',img:'perkament',intro:'Professor Kist zweeft dwars door het schoolbord naar binnen. Hij is een spook: hij viel ooit in slaap in de leraarskamer en stond de volgende dag op zonder zijn lichaam.',q:[
['Wat is bijzonder aan professor Kist?','Hij is een spook',['Hij is een kobold','Hij is een vampier','Hij is een centaur','Hij is een reus'],'Het enige vak dat door een spook wordt gegeven.'],
['Hoeveel stichters had Zweinstein?','Vier',['Twee','Drie','Vijf','Zeven'],'Goderic Griffoendor, Helga Huffelpuf, Rowena Ravenklauw en Zalazar Zwadderich.'],
['Hoe lang geleden werd Zweinstein ongeveer gesticht?','Ruim duizend jaar',['Tweehonderd jaar','Vijfhonderd jaar','Drieduizend jaar','Honderd jaar'],'Volgens de boeken meer dan duizend jaar geleden.'],
['Welke stichter verliet de school na ruzie?','Zalazar Zwadderich',['Goderic Griffoendor','Helga Huffelpuf','Rowena Ravenklauw','Niemand'],'Hij wilde alleen leerlingen van volbloed tovenaarsfamilies toelaten.'],
['Wat liet Zwadderich volgens de legende achter in het kasteel?','De Geheime Kamer',['De Kamer van Hoge Nood','De Sorteerhoed','Het Zwadderich-zwaard','De Spiegel van Neregeb'],'In de Kamer leefde een basilisk.'],
['In welk jaar versloeg Perkamentus Grindelwald?','1945',['1899','1965','1981','1992'],'Dat staat op zijn Chocokikkerkaart.'],
['Wie maakte de enige bekende Steen der Wijzen?','Nicolaas Flamel',['Albus Perkamentus','Zalazar Zwadderich','Merlijn','Hildebrand Slakhoorn'],'Flamel werd meer dan zeshonderd jaar oud.'],
['Over welke opstanden praat professor Kist eindeloos?','De opstanden van de kobolden',['De reuzenoorlogen','De draken-opstand','De Dreuzelrevolutie','De centaurenstaking'],'Leerlingen vallen er gegarandeerd bij in slaap.']]},
{id:'verweer',n:'Verweer tegen de Zwarte Kunsten',ico:'🛡️',prof:'Professor Remus Lupos',img:'kaars-foto',intro:'Professor Lupos, in zijn versleten gewaad, glimlacht vriendelijk. “Vandaag een praktische les. Wie weet wat er in deze kast zit?”',q:[
['Welke spreuk gebruik je tegen een Boeman?','Riddikulus',['Expelliarmus','Lumos','Expecto Patronum','Protego'],'Een Boeman neemt de vorm aan van je grootste angst; lachen verslaat hem.'],
['Wat beschermt je tegen Dementors?','Een Patronus',['Een Boeman','Riddikulus','Een bezoar','Knoflook'],'Lupos leerde Harry de Patronus-bezwering in zijn derde jaar.'],
['Welk geheim had professor Lupos?','Hij is een weerwolf',['Hij is een vampier','Hij is een Animagus-wolf','Hij is een spook','Hij is half-reus'],'Sneep brouwde elke maand een speciale drank voor hem.'],
['Welke Onvergeeflijke Vloek beheerst de wil van een ander?','De Imperiusvloek',['De Cruciatusvloek','De Avada Kedavra-vloek','Paralitis','Expelliarmus'],'De drie Onvergeeflijke Vloeken zijn Imperius, Cruciatus en Avada Kedavra.'],
['Wie was de ijdele leraar Verweer in het tweede jaar?','Gladianus Smalhart',['Quirinus Krinkel','Remus Lupos','Dorothea Omber','Alastor Dolleman'],'Hij won vijf keer de prijs voor de Charmantste Glimlach van de Heks Weekly.'],
['Welke spreuk verlamt (verdooft) een tegenstander?','Paralitis',['Protego','Reparo','Accio','Lumos'],'In het Engels Stupefy; in de Nederlandse boeken Paralitis.'],
['Welke spreuk maakt een beschermend schild?','Protego',['Paralitis','Riddikulus','Alohomora','Nox'],'Harry oefende hem met de Strijders van Perkamentus.'],
['Hoe heette de geheime oefengroep van Harry in het vijfde jaar?','Strijders van Perkamentus',['De Orde van de Feniks','De Ridders van Walpurgis','De Sluipers','Het Duelleerclubje'],'Ze oefenden in de Kamer van Hoge Nood.']]}];
const CIJFER=p=>p>=.9?['U','Uitmuntend',1]:p>=.75?['B','Boven Verwachting',1]:p>=.6?['V','Voldoende',1]:p>=.4?['S','Slecht',0]:p>=.2?['D','Dieptreurig',0]:['T','Trol',0];
function S_les(){if(!S.lessen)S.lessen={};return S.lessen}
function lesQuiz({titel,prof,vragen,key,beloning,naKlaar}){let i=0,g=0;
 const toon=(msg='')=>{if(i==vragen.length){const c=CIJFER(g/vragen.length);const L=S_les();const oud=L[key];if(c[2]&&(!oud||'UBV'.indexOf(c[0])<'UBV'.indexOf(oud)))L[key]=c[0];bewaar();
   const t=c[2]?beloon(key,beloning[0]+(c[0]=='U'?10:0),beloning[1],'Je cijfer: '+c[1]+'!'):foutT('Cijfer: '+c[1]+'. Probeer het nog eens.');
   return app(lijst(`<h2>${titel}</h2><div class="cijfer cijfer-${c[0]}">${c[0]}</div><p style="text-align:center"><b>${c[1]}</b> – ${g} van de ${vragen.length} goed</p>`)+t+`<button class="knop" onclick="ga('lessen')">Terug naar het rooster</button>`+(naKlaar?naKlaar():''))}
  const v=vragen[i],n=i%2?5:3;const opts=[v[1],...v[2].slice(0,n-1)].sort(()=>Math.random()-.5);
  app(lijst(`<h2>${titel}</h2><p><i>${prof}</i> – vraag ${i+1} van ${vragen.length}</p><div class="balk"><div style="width:${i/vragen.length*100}%"></div></div><p><b>${v[0]}</b></p>${opts.map(o=>`<button class="optie">${o}</button>`).join('')}`)+msg);
  document.querySelectorAll('.optie').forEach(b=>b.onclick=()=>{const ok=b.textContent==v[1];if(ok){g++;fx.goed()}const t=ok?tilly('<span class="goed">Juist!</span> '+v[3]):foutT('<span class="fout">Het juiste antwoord: '+v[1]+'.</span> '+v[3]);i++;toon(t)})};toon()}
V.lessen=()=>{const L=S_les();const alleSlijm=VAKKEN.every(v=>L[v.id+'-slijm']);
 app(`<h1>📚 Lesrooster</h1>${tilly('Elk vak heeft twee lessen. Haal je beide (minstens een V), dan mag je je S.L.IJ.M.B.A.L. doen. Met alle acht S.L.IJ.M.B.A.L.len op zak wacht het P.U.I.S.T.-examen.')}
 <p><small>Cijfers: geslaagd met <b>U</b> (Uitmuntend), <b>B</b> (Boven Verwachting) of <b>V</b> (Voldoende); gezakt met <b>S</b> (Slecht), <b>D</b> (Dieptreurig) of <b>T</b> (Trol).</small></p>
 <div class="raster">${VAKKEN.map(v=>{const a=L[v.id+'-1'],b=L[v.id+'-2'],s=L[v.id+'-slijm'];return `<div class="tegel vak" style="background-image:linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.75)),url(img/${v.img}.webp)"><div class="ico">${v.ico}</div><b>${v.n}</b><br><small>${v.prof}</small><p>Les 1: ${a||'–'} · Les 2: ${b||'–'}<br>S.L.IJ.M.B.A.L.: ${s||'–'}</p><button class="knop" onclick="V.les('${v.id}',1)">Les 1</button><button class="knop" onclick="V.les('${v.id}',2)">Les 2</button><button class="knop" ${a&&b?'':'disabled'} onclick="V.les('${v.id}','slijm')">🎓 S.L.IJ.M.B.A.L.</button></div>`}).join('')}</div>
 <div class="kaart" style="text-align:center"><h3>🏛️ P.U.I.S.T.-examen ${L.puist?'– behaald: '+L.puist:''}</h3><p>Proeve van Uitzonderlijke Intelligentie en Superieure Toverkunst – 16 vragen uit alle vakken.</p><button class="knop" ${alleSlijm?'':'disabled'} onclick="V.les('puist')">Examen afleggen</button></div>`)};
V.les=(id,deel)=>{if(id=='puist'){const vr=VAKKEN.flatMap(v=>v.q).sort(()=>Math.random()-.5).slice(0,16);return lesQuiz({titel:'🏛️ P.U.I.S.T.-examen',prof:'De examencommissie van het Ministerie',vragen:vr,key:'puist',beloning:[120,100]})}
 const v=VAKKEN.find(x=>x.id==id);
 if(deel=='slijm')return lesQuiz({titel:'🎓 S.L.IJ.M.B.A.L. '+v.n,prof:v.prof,vragen:[...v.q].sort(()=>Math.random()-.5),key:id+'-slijm',beloning:[60,40]});
 const vr=v.q.slice((deel-1)*4,deel*4);
 app(lijst(`<h2>${v.ico} ${v.n} – les ${deel}</h2><img class="lesfoto" src="img/${v.img}.webp" alt=""><p><b>${v.prof}:</b></p><p><i>${v.intro}</i></p><button class="knop" id="start">Naar de vragen →</button>`));
 $('#start').onclick=()=>lesQuiz({titel:v.ico+' '+v.n+' – les '+deel,prof:v.prof,vragen:vr,key:id+'-'+deel,beloning:[25,15]})};
