/* VANHA reseptikirjasto (ennen marraskuuta 2026). Käytetään vain vanhojen tallennettujen tietojen
 * siirtämiseen uuteen kirjastoon (src/migrate.js), ei näytetä sovelluksessa.
 * raw: nimi|pääraaka-aine|ruokalaji|tägit|aika (min)|kuvaus|annokset
 * DATA: reseptien ainekset samassa järjestyksessä, yksi rivi per resepti, ainekset ";"-erotettuna. */
export const raw=`Makaronilaatikko|j|ki|e|60|Makaroni, jauheliha ja sipuli, päälle muna-maitoseos. Hyvä puolukkahillon kanssa.
Jauhelihakeitto|j|ke|en|30|Peruna, porkkana ja jauheliha yhdessä kattilassa. Maustetaan laakerinlehdellä.
Lihapullat ja perunamuusi|j|pn|e|45|Pannulla paistetut lihapullat, ruskea kastike ja puolukkahillo.
Spagetti ja jauhelihakastike|j|ps|en|25|Tomaattinen jauhelihakastike, joka maistuu kaikille.
Lihamureke|j|uu|e|70|Perinteinen uunimureke perunoiden ja kermaviilikastikkeen kanssa.
Chili con carne|j|pa|e|45|Jauheliha, pavut ja tomaatti. Riisi tai tortillat kylkeen.
Jauhelihaperunalaatikko|j|ki|e|80|Viipaloitu peruna, jauheliha ja sipuli kerroksina kerma-maitoseoksessa.
Lasagne|j|uu|h|80|Lihakastike, lasagnelevyt ja juustokastike. Tee iso vuoka, riittää seuraavallekin päivälle.
Kaalilaatikko|j|ki|e|120|Hitaasti kypsyvä kaali ja jauheliha. Siirappi antaa makeutta.
Tacopannu|j|pn|en|25|Jauheliha, tacomauste, maissi ja pavut pannulla. Päälle juustoa ja kermaviiliä.
Jauhelihariisipata|j|pa|en|30|Riisi kypsyy samassa padassa jauhelihan, paprikan ja tomaatin kanssa.
Kanakeitto|k|ke|ek|40|Kanankoivet tai rintafilee, juurekset ja nuudelit tai riisi.
Currykanapata|k|pa|h|40|Kana, kookosmaito ja currytahna. Tarjoa riisin kanssa.
Kanarisotto|k|ps|h|35|Kermainen risotto kanasuikaleilla, sipulilla ja parmesaanilla.
Uunikana ja juurekset|k|uu|ek|60|Koivet ja juurekset samalla pellillä. Yrtit ja valkosipuli päälle.
Kanapasta tomaattikermakastikkeessa|k|ps|n|25|Kanasuikaleet, tomaattimurska ja ruokakerma. Pasta kypsyy samalla.
Kanaperunakiusaus|k|ki|e|70|Peruna, kana ja sipuli kermaisessa kastikkeessa. Juustoa päälle.
Kanawokki|k|pn|nk|20|Kana ja pakastevihannekset nopeasti pannulla. Soijakastiketta ja riisiä.
Kana sienikastikkeessa|k|pn|h|30|Paistetut kanafileet ja kermainen herkkusienikastike.
Lohikeitto|f|ke|h|35|Lohi, peruna, purjo ja kerma. Tilli päälle.
Kalapuikot ja perunamuusi|f|pn|en|25|Nopea arkiruoka. Kaveriksi herneitä ja tartarkastiketta.
Lohikiusaus|f|ki|h|60|Lohi, peruna ja kerma uunissa. Sitruunaa ja tilliä.
Uunilohi ja juurekset|f|uu|k|35|Lohifile ja uunijuurekset samalla pellillä.
Silakkapihvit|f|pn|en|30|Ruisjauhoissa paistetut silakat, keitetyt perunat ja voisula.
Kalapata tomaatilla|f|pa|h|40|Valkoinen kala, tomaattimurska, fenkoli ja valkosipuli.
Lohipasta|f|ps|nh|20|Savulohi tai tuore lohi, ruokakerma, sitruuna ja pasta.
Tonnikalapasta|f|ps|en|20|Tonnikalapurkki, tomaatti, kaprikset ja pasta. Syntyy ruokakaapin varoista.
Karjalanpaisti|p|pa|e|180|Liha kypsyy hitaasti uunissa sipulin ja laakerinlehden kanssa.
Porsaanfilee sipulikastikkeessa|p|pn|h|30|Mehevät fileet ja kermainen sipulikastike.
Porsaankyljykset uunissa|p|uu|e|45|Kyljykset, uuniperunat ja kermaviilikastike.
Porsas-stroganoff|p|pa|n|30|Porsassuikaleet, sipuli, suolakurkku ja kerma.
Hernekeitto|p|ke|e|90|Kuivatut herneet ja savukinkku. Liota herneet edellisenä iltana.
Lihakeitto|n|ke|e|90|Naudanlihakuutiot, peruna, lanttu ja porkkana.
Nautapata punaviinillä|n|pa|h|150|Hitaasti haudutettu naudanliha, sipuli ja punaviini.
Nautastroganoff|n|pn|nh|30|Naudan suikaleet, sipuli ja smetana. Riisiä tai perunamuusia kylkeen.
Makkarakeitto|s|ke|en|30|Nakit tai lenkki, peruna ja juurekset. Nopein kattilaruoka.
Makkarastroganoff|s|pn|en|25|Makkarasuikaleet, sipuli ja tomaattikastike.
Makkaraperunat|s|pn|en|30|Pannulla paistetut perunat, makkara ja sipuli. Puolukkahillo kylkeen.
Lenkkimakkarapata|s|pa|e|35|Lenkki, tomaatti ja paprika padassa. Pasta tai riisi kylkeen.
Porkkana-inkiväärikeitto|v|ke|ek|30|Pehmeäksi keitetyt juurekset soseena. Päälle kermaviiliä.
Linssikeitto|v|ke|ek|35|Punaiset linssit, tomaatti ja kumina.
Uunijuurekset ja fetajuusto|v|uu|k|50|Uunissa paahdetut juurekset, fetaa ja yrttejä.
Kukkakaaliperunakiusaus|v|ki|ek|60|Kukkakaali ja peruna juustoisessa kastikkeessa.
Kikhernecurry|v|pa|enk|30|Kikherneet, tomaatti ja kookosmaito. Riisi tai naan kylkeen.
Pinaattiohukaiset|v|pn|e|30|Pinaattiohukaiset ja puolukkahillo.
Pasta pestolla|v|ps|n|15|Pasta, pesto, kirsikkatomaatit ja parmesaani.
Kesäkurpitsakiusaus|v|ki|k|60|Kesäkurpitsa, juusto ja kananmuna uunissa.
Karjalanpaisti (Yhteishyvä)|p|pa|e|240|Karjalanpaistiliha, sipuli ja porkkana kypsyvät hitaasti uunissa. Iso satsi, 10 annosta.|10
Kaurapuuro|v|pu||10|Perinteinen kaurapuuro vedellä keitettynä, marjat päälle.|2
Riisipuuro|v|pu||60|Maitoon keitetty riisipuuro, joka sopii myös joulupuuroksi.|4
Mannapuuro|v|pu||15|Pehmeä mannapuuro maitoon, päälle marjoja tai hilloa.|4
Pannukakku|v|am||50|Uunissa paistettu pannukakku, joka sopii hyvin viikonloppuaamiaiseksi.|4
Munakas|v|am||10|Nopea munakas kinkulla.|2
Marjarahka|v|am||5|Rahkaa, marjoja ja kaurahiutaleita nopeaksi aamiaiseksi.|2
Kreikkalainen salaatti|v|sa||15|Tomaattia, kurkkua, fetaa ja oliiveja.|4
Tonnikalasalaatti|f|sa||15|Tonnikalaa, kasviksia ja maissia raikkaassa kastikkeessa.|4
Kanasalaatti|k|sa||25|Paistettua kanaa, tuoretta salaattia ja parmesaania.|4
Kikhernesalaatti|v|sa||10|Proteiinipitoinen kikhernesalaatti, joka sopii kylmänä eväsrasiaan.|4
Banaanikakku|v|le||60|Mehevä banaanikakku, jossa ylikypsät banaanit pääsevät käyttöön.|8
Mustikkapiirakka|v|le||60|Voitaikinapohjainen piirakka mustikoilla.|8
Kaurakeksit|v|le||30|Rapeat kaurakeksit, joita on helppo tehdä isompi satsi.|10
Mustikkakiisseli|v|ja||15|Kotitekoinen mustikkakiisseli, tarjoillaan maidon kanssa.|4
Omenapaistos|v|ja||50|Uunissa paistettu omenapaistos murumaisella kaurakuorrutteella.|4
Keitetyt perunat|v|li||25|Perinteiset keitetyt perunat.|4
Perunamuusi|v|li||30|Pehmeä perunamuusi maidolla ja voilla.|4
Keitetty riisi|v|li||20|Irtonainen keitetty riisi.|4
Keitetty pasta|v|li||15|Pasta lisukkeeksi.|4
Couscous|v|li||10|Nopea lisuke, valmis kymmenessä minuutissa.|4
Leipä|v|li||5|Leipää ja voita.|4
Tuore salaatti|v|li||10|Raikas salaatti tomaatilla ja kurkulla.|4
Raasteet|v|li||10|Porkkana- ja kaaliraaste.|4
Kurkku-tomaattisalaatti|v|li||10|Yksinkertainen kasvissalaatti.|4
Keitetyt kasvikset|v|li||15|Parsakaalta ja porkkanaa voin kanssa.|4
Maksalaatikko|n|ki|e|100|Maksa-riisiseos uunissa. Tarjoa puolukkahillon ja voisulan kanssa.|6
Kalakeitto|f|ke|n|35|Kermainen keitto lohesta, valkoisesta kalasta ja perunasta. Tilli päälle.|4
Paistetut kalafileet|f|pn|en|30|Jauhotetut kalafileet voissa paistettuna, keitetyt perunat ja sitruunaa kylkeen.|4
Itse tehty pizza|p|uu|e|45|Pikapohja ilman nostatusta, tomaattikastike, kinkkua, sieniä ja juustoa.|4
Uunimakkara ja perunat|s|uu|en|55|Makkara ja perunat uunipellillä. Sinappia kylkeen.|4
Nakkikeitto|s|ke|e|30|Nakit, peruna ja porkkana kevyessä liemessä.|4
Janssoninkiusaus|f|ki|e|70|Peruna, sipuli ja ansjovis kermaisessa kiusauksessa.|4
Kaalikääryleet|j|uu|e|100|Valkokaalin lehdet täytettynä jauheliha-riisitäytteellä. Puolukkahillo kylkeen.|4
Täytetyt tortillat|j|pn|n|25|Jauheliha, vihannekset ja smetana tortillassa. Jokainen täyttää omansa.|4
Lämpimät voileivät|p|uu|n|20|Leipä, kinkku, juusto ja tomaatti uunissa.|4
Hampurilaiset|j|pn|n|30|Itse paistetut pihvit sämpylässä. Salaatti, tomaatti ja juusto päälle.|4
Poronkäristys|n|pn||40|Perinteinen lappilainen käristys. Perunamuusi ja puolukkahillo kylkeen.|4
Butter chicken|k|pa|n|40|Mausteinen kana tomaatti-kermakastikkeessa. Riisi kylkeen.|4
Halloumi-kesäkurpitsapihvit|v|pn|n|30|Pannulla paistetut juusto-kesäkurpitsapihvit ja jogurtti-kurkkukastike.|4
Kanakastike|k|pa|en|35|Kermainen kanakastike paprikalla ja porkkanalla. Riisi kylkeen.|4
Kinkkukiusaus|p|ki|e|75|Peruna, kinkku ja kerma uunissa.|4
Nakkikastike|s|pa|e|30|Nakit tomaattikastikkeessa. Riisi tai perunamuusi kylkeen.|4
Kasvissosekeitto|v|ke|e|35|Porkkanasta, perunasta ja lantusta tehty sosekeitto.|4
Perunaletut|v|pn|e|40|Raastetut perunaletut pannulla. Puolukkahillo ja smetana kylkeen.|4`;

export const DATA=`jauheliha 500 g; makaroni 250 g; sipuli 1 kpl; kananmuna 3 kpl; maito 5 dl; suola 1 tl; mustapippuri 0.5 tl|Keitä makaronit vajaaksi ja kuullota sipuli./Ruskista jauheliha ja sekoita makaronien joukkoon./Kaada voideltuun vuokaan, lisää kananmuna-maitoseos ja mausta./Paista 200 asteessa noin 40 minuuttia.
jauheliha 400 g; peruna 600 g; porkkana 2 kpl; sipuli 1 kpl; liemikuutio 2 kpl; laakerinlehti 2 kpl; pippuri 0.5 tl|Ruskista jauheliha ja sipuli kattilassa./Lisää kuutioidut juurekset, liemikuutiot, laakerinlehdet ja vettä niin että ne peittyvät./Keitä noin 20 minuuttia ja mausta pippurilla.
jauheliha 500 g; sipuli 1 kpl; korppujauho 1 dl; maito 1 dl; kananmuna 1 kpl; peruna 800 g; voi 50 g; kerma 1 dl; vehnäjauho 2 rkl; liemikuutio 1 kpl; puolukkahillo 1 prk; suola 1 tl|Anna korppujauhon turvota maidossa./Sekoita joukkoon jauheliha, hienonnettu sipuli, kananmuna ja suola. Paista pullat pannulla kypsiksi./Keitä perunat ja muussaa ne voin ja kerman kanssa./Tee kastike pannun fondiin jauhoista, liemestä ja vedestä.
jauheliha 400 g; spagetti 400 g; sipuli 1 kpl; valkosipulinkynsi 2 kpl; tomaattimurska 1 prk; tomaattipyree 2 rkl; oregano 1 tl|Keitä spagetti pakkauksen ohjeen mukaan./Ruskista jauheliha, sipuli ja valkosipuli./Lisää tomaattimurska ja tomaattipyree, hauduta 15 minuuttia./Mausta oreganolla ja tarjoa spagetin kanssa.
jauheliha 600 g; sipuli 1 kpl; kananmuna 1 kpl; korppujauho 1 dl; maito 1.5 dl; suola 1 tl; peruna 800 g; kermaviili 2 dl|Anna korppujauhon turvota maidossa./Lisää jauheliha, hienonnettu sipuli, kananmuna ja suola./Muotoile vuokaan ja paista 200 asteessa noin 50 minuuttia./Tarjoa keitettyjen perunoiden ja kermaviilin kanssa.
jauheliha 500 g; sipuli 1 kpl; valkosipulinkynsi 2 kpl; tomaattimurska 1 prk; kidneypavut 1 prk; chilijauhe 1 tl; riisi 3 dl|Kuullota sipuli ja valkosipuli, lisää jauheliha ja ruskista./Lisää tomaattimurska, valutetut pavut ja chilijauhe./Hauduta 25 minuuttia ja keitä riisi samalla.
peruna 1 kg; jauheliha 400 g; sipuli 2 kpl; kerma 2 dl; maito 3 dl; kananmuna 2 kpl; suola 1 tl|Viipaloi perunat ohuiksi ja kuullota sipulit./Ruskista jauheliha./Kerrosta vuokaan perunat, liha ja sipuli, kaada päälle kerma, maito ja kananmuna./Paista 200 asteessa noin 60 minuuttia.
jauheliha 500 g; lasagnelevyt 250 g; tomaattimurska 2 prk; sipuli 1 kpl; valkosipulinkynsi 2 kpl; maito 6 dl; vehnäjauho 4 rkl; voi 50 g; juustoraaste 2 dl|Tee lihakastike jauhelihasta, sipulista, valkosipulista ja tomaattimurskasta./Tee valkokastike voista, jauhoista ja maidosta./Kerrosta vuokaan levyt, liha ja valkokastike./Päälle juustoraaste. Paista 200 asteessa noin 40 minuuttia.
valkokaali 800 g; jauheliha 500 g; riisi 1 dl; sipuli 1 kpl; siirappi 2 rkl; lihaliemi 4 dl; voi 2 rkl|Kuullota kaali ja sipuli voissa ja ruskista jauheliha./Sekoita kaikki riisin, siirapin ja lihaliemen kanssa vuokaan./Paista 175 asteessa noin 1,5 tuntia ja sekoita välillä.
jauheliha 500 g; tacomauste 1 pss; maissi 1 prk; kidneypavut 1 prk; tomaattimurska 1 prk; juustoraaste 2 dl; kermaviili 2 dl|Ruskista jauheliha pannulla./Lisää tacomauste, tomaattimurska, valutetut pavut ja maissi./Hauduta 10 minuuttia. Päälle juustoraaste ja kermaviili.
riisi 3 dl; jauheliha 500 g; paprika 1 kpl; sipuli 1 kpl; tomaattimurska 1 prk; liemikuutio 1 kpl|Kuullota sipuli ja paprika, ruskista jauheliha./Lisää riisi, tomaattimurska, liemikuutio ja vettä noin 5 dl./Hauduta kannen alla 20 minuuttia, kunnes riisi on kypsää.
kananrintafilee 500 g; porkkana 2 kpl; peruna 400 g; sipuli 1 kpl; kanaliemikuutio 2 kpl; pippuri 0.5 tl; persilja 1 nippu|Kuullota sipuli ja porkkana kattilassa./Lisää kuutioidut perunat, liemikuutiot ja vettä, keitä 15 minuuttia./Lisää kanasuikaleet ja keitä vielä 10 minuuttia./Mausta pippurilla ja lisää persilja.
kananrintafilee 500 g; kookosmaito 1 prk; currytahna 2 rkl; sipuli 1 kpl; valkosipulinkynsi 2 kpl; paprika 1 kpl; riisi 3 dl|Kuullota sipuli, valkosipuli ja paprika./Lisää kanakuutiot ja currytahna./Kaada kookosmaito ja hauduta 15 minuuttia./Tarjoa keitetyn riisin kanssa.
kananrintafilee 400 g; risottoriisi 3 dl; sipuli 1 kpl; kanaliemi 7 dl; parmesaani 1 dl; kerma 1 dl; voi 1 rkl|Kuullota sipuli voissa, lisää riisi./Lisää kuuma liemi kauha kerrallaan ja sekoita./Kun riisi on lähes kypsää, lisää paistetut kanasuikaleet, kerma ja parmesaani.
kanankoivet 8 kpl; peruna 600 g; porkkana 3 kpl; lanttu 300 g; oliiviöljy 2 rkl; valkosipulinkynsi 3 kpl; yrttimauste 1 rkl|Leikkaa juurekset paloiksi ja levitä pellille koipien kanssa./Pirskota päälle öljy, valkosipuli ja yrttimauste./Paista 200 asteessa noin 50 minuuttia.
kananrintafilee 400 g; pasta 400 g; tomaattimurska 1 prk; ruokakerma 2 dl; sipuli 1 kpl; valkosipulinkynsi 2 kpl|Keitä pasta./Paista kanasuikaleet, sipuli ja valkosipuli./Lisää tomaattimurska ja ruokakerma, hauduta 10 minuuttia./Sekoita pasta joukkoon.
peruna 900 g; kananrintafilee 400 g; sipuli 1 kpl; ruokakerma 4 dl; juustoraaste 2 dl; suola 1 tl|Viipaloi perunat ja sipuli./Kerrosta vuokaan perunat, kanapalat ja sipuli./Kaada päälle ruokakerma ja suola, juustoa pinnalle./Paista 200 asteessa noin 1 tunti.
kananrintafilee 500 g; wok-vihannekset 500 g; soijakastike 3 rkl; riisi 3 dl; valkosipulinkynsi 2 kpl|Keitä riisi./Paista kanasuikaleet kuumalla pannulla ja lisää valkosipuli./Lisää vihannekset ja soijakastike, paista 5 minuuttia.
kananrintafilee 600 g; herkkusienet 250 g; sipuli 1 kpl; ruokakerma 2 dl; voi 1 rkl; riisi 3 dl|Paista kanafileet voissa kypsiksi ja ota sivuun./Kuullota sipuli ja sienet samalla pannulla./Lisää ruokakerma ja hauduta, palauta kana kastikkeeseen./Tarjoa riisin kanssa.
lohifile 400 g; peruna 500 g; purjo 1 kpl; porkkana 1 kpl; kalaliemikuutio 1 kpl; ruokakerma 2 dl; tilli 1 nippu|Kuullota purjo ja porkkana kattilassa./Lisää kuutioidut perunat, liemikuutio ja vettä, keitä 15 minuuttia./Lisää lohikuutiot ja kerma, keitä 5 minuuttia./Ripottele päälle tilli.
kalapuikot 1 pss; peruna 800 g; maito 1 dl; voi 50 g; herneet 300 g; tartarkastike 1 prk|Keitä perunat ja tee muusi voin ja maidon kanssa./Paista kalapuikot paketin ohjeen mukaan./Lämmitä herneet ja tarjoa tartarkastikkeen kanssa.
lohifile 500 g; peruna 900 g; sipuli 1 kpl; ruokakerma 4 dl; tilli 1 nippu; sitruuna 1 kpl|Viipaloi perunat ja sipuli./Kerrosta vuokaan perunat, lohikuutiot ja sipuli./Kaada päälle ruokakerma, lisää tilli ja sitruunamehu./Paista 200 asteessa noin 50 minuuttia.
lohifile 600 g; porkkana 3 kpl; bataatti 400 g; oliiviöljy 2 rkl; sitruuna 1 kpl; suola 1 tl|Leikkaa juurekset paloiksi ja paahda pellillä öljyssä 20 minuuttia 200 asteessa./Lisää lohi päälle ja paista vielä 12-15 minuuttia./Purista sitruunaa päälle.
silakkafile 500 g; ruisjauho 1.5 dl; voi 2 rkl; peruna 800 g; suola 1 tl|Pyörittele silakkafileet ruisjauhoissa./Paista voissa kullanruskeiksi molemmin puolin./Tarjoa keitettyjen perunoiden kanssa.
valkoinen kalafile 600 g; tomaattimurska 1 prk; fenkoli 1 kpl; sipuli 1 kpl; valkosipulinkynsi 3 kpl; oliiviöljy 2 rkl; riisi 3 dl|Kuullota sipuli, fenkoli ja valkosipuli öljyssä./Lisää tomaattimurska ja hauduta 10 minuuttia./Lisää kalapalat ja keitä kannen alla 8 minuuttia./Tarjoa riisin kanssa.
lohifile 400 g; pasta 400 g; ruokakerma 2 dl; sitruuna 1 kpl; tilli 1 nippu|Keitä pasta./Paista lohikuutiot kevyesti pannulla./Lisää ruokakerma, sitruunamehu ja tilli./Sekoita pasta joukkoon.
tonnikala 2 prk; pasta 400 g; tomaattimurska 1 prk; kaprikset 2 rkl; valkosipulinkynsi 2 kpl|Keitä pasta./Kuullota valkosipuli, lisää tomaattimurska ja kaprikset./Lisää valutettu tonnikala ja sekoita pastan kanssa.
porsaan lapa 500 g; naudan paisti 500 g; sipuli 2 kpl; laakerinlehti 3 kpl; maustepippuri 1 tl; suola 1.5 tl; peruna 800 g|Leikkaa liha kuutioiksi ja laita pataan sipulin ja mausteiden kanssa./Lisää vettä juuri liha peittäväksi./Kypsennä 150 asteessa noin 3 tuntia./Tarjoa perunoiden kanssa.
porsaanfilee 600 g; sipuli 2 kpl; ruokakerma 2 dl; voi 2 rkl; peruna 800 g; liemikuutio 1 kpl|Paista fileet voissa ja ota sivuun./Kuullota sipuli, lisää liemikuutio ja ruokakerma./Hauduta kastike ja palauta liha kastikkeeseen./Tarjoa keitettyjen perunoiden kanssa.
porsaankyljykset 4 kpl; peruna 800 g; kermaviili 2 dl; sipuli 1 kpl; oliiviöljy 1 rkl; suola 1 tl|Hiero kyljykset suolalla ja laita vuokaan./Lisää perunat, sipuli ja öljy./Paista 200 asteessa noin 40 minuuttia./Tarjoa kermaviilin kanssa.
porsaan suikaleet 500 g; sipuli 2 kpl; suolakurkku 3 kpl; ruokakerma 2 dl; tomaattipyree 2 rkl; riisi 3 dl|Ruskista porsassuikaleet ja sipuli./Lisää tomaattipyree, suolakurkut ja ruokakerma./Hauduta 10 minuuttia ja tarjoa riisin kanssa.
kuivatut herneet 3 dl; savukinkku 300 g; sipuli 1 kpl; porkkana 1 kpl; laakerinlehti 2 kpl; sinappi 1 rkl|Liota herneet yön yli./Keitä herneet uudessa vedessä pehmeiksi, noin 1 tunti./Lisää kinkku, sipuli, porkkana ja laakerinlehdet, keitä vielä 30 minuuttia./Tarjoa sinapin kanssa.
naudanliha 500 g; peruna 500 g; lanttu 300 g; porkkana 2 kpl; sipuli 1 kpl; laakerinlehti 2 kpl; maustepippuri 0.5 tl|Keitä lihakuutiot ja laakerinlehdet vedessä 45 minuuttia./Lisää juurekset ja sipuli./Keitä vielä 25 minuuttia ja mausta.
naudanliha 700 g; sipuli 2 kpl; porkkana 2 kpl; punaviini 3 dl; tomaattipyree 2 rkl; lihaliemi 3 dl; timjami 1 tl; peruna 800 g|Ruskista liha ja sipuli padassa./Lisää porkkana, tomaattipyree, viini, liemi ja timjami./Hauduta kannen alla 2 tuntia ja tarjoa perunoiden kanssa.
naudan suikaleet 500 g; sipuli 2 kpl; suolakurkku 2 kpl; smetana 2 dl; tomaattipyree 1 rkl; riisi 3 dl|Ruskista suikaleet ja sipuli pannulla./Lisää tomaattipyree ja suolakurkut./Kaada smetana, lämmitä ja tarjoa riisin kanssa.
makkara 400 g; peruna 600 g; porkkana 2 kpl; sipuli 1 kpl; kasvisliemikuutio 2 kpl|Keitä juurekset ja liemikuutiot vedessä pehmeiksi, noin 15 minuuttia./Lisää viipaloitu makkara./Keitä 5 minuuttia.
makkara 400 g; sipuli 1 kpl; tomaattimurska 1 prk; ruokakerma 1 dl; riisi 3 dl; paprikajauhe 1 tl|Paista makkarasuikaleet ja sipuli pannulla./Lisää tomaattimurska, ruokakerma ja paprikajauhe./Hauduta 10 minuuttia ja tarjoa riisin kanssa.
makkara 400 g; peruna 800 g; sipuli 1 kpl; voi 2 rkl; puolukkahillo 1 prk|Keitä perunat kypsiksi ja viipaloi./Paista voissa sipulin kanssa./Lisää makkarapalat ja paista kypsiksi./Tarjoa puolukkahillon kanssa.
lenkkimakkara 400 g; paprika 1 kpl; tomaattimurska 1 prk; sipuli 1 kpl; pasta 300 g; valkosipulinkynsi 2 kpl|Keitä pasta./Paista makkara, sipuli ja paprika padassa./Lisää tomaattimurska ja valkosipuli, hauduta 15 minuuttia./Sekoita pasta joukkoon.
porkkana 600 g; peruna 200 g; sipuli 1 kpl; inkivääri 20 g; kasvisliemikuutio 1 kpl; kermaviili 1 dl|Kuullota sipuli ja inkivääri./Lisää kuutioidut juurekset, liemikuutio ja vettä, keitä pehmeiksi./Soseuta ja lisää kermaviili.
punaiset linssit 3 dl; sipuli 1 kpl; porkkana 2 kpl; tomaattimurska 1 prk; kasvisliemikuutio 1 kpl; kumina 1 tl|Kuullota sipuli ja porkkana./Lisää linssit, tomaattimurska, liemikuutio, kumina ja vettä./Keitä 20 minuuttia.
porkkana 3 kpl; lanttu 300 g; bataatti 400 g; punasipuli 1 kpl; fetajuusto 200 g; oliiviöljy 2 rkl; yrttimauste 1 rkl|Leikkaa juurekset paloiksi ja sekoita öljyn ja yrttien kanssa./Paahda 200 asteessa 35 minuuttia./Murenna feta päälle ja paista vielä 5 minuuttia.
kukkakaali 1 kpl; peruna 500 g; ruokakerma 3 dl; juustoraaste 2 dl; sipuli 1 kpl; suola 1 tl|Keitä kukkakaali ja peruna puolikypsiksi./Laita vuokaan sipulin kanssa./Kaada päälle ruokakerma ja lisää juusto./Paista 200 asteessa noin 35 minuuttia.
kikherneet 2 prk; kookosmaito 1 prk; tomaattimurska 1 prk; sipuli 1 kpl; valkosipulinkynsi 2 kpl; currytahna 2 rkl; riisi 3 dl|Kuullota sipuli ja valkosipuli, lisää currytahna./Lisää tomaattimurska, kookosmaito ja valutetut kikherneet./Hauduta 15 minuuttia ja tarjoa riisin kanssa.
pinaatti 200 g; maito 5 dl; kananmuna 3 kpl; vehnäjauho 2.5 dl; voi 2 rkl; suola 0.5 tl; puolukkahillo 1 prk|Sulata pinaatti ja valuta./Vatkaa taikina maidosta, jauhoista, kananmunista ja suolasta./Sekoita pinaatti joukkoon./Paista voissa pienet ohukaiset ja tarjoa puolukkahillon kanssa.
pasta 400 g; pesto 1 prk; kirsikkatomaatit 250 g; parmesaani 1 dl|Keitä pasta./Sekoita pesto ja halkaistut tomaatit pastan joukkoon./Ripottele päälle parmesaani.
kesäkurpitsa 600 g; kananmuna 3 kpl; juustoraaste 2 dl; ruokakerma 2 dl; sipuli 1 kpl; suola 0.5 tl|Raasta kesäkurpitsa ja purista ylimääräinen neste./Sekoita muiden aineiden kanssa./Kaada vuokaan ja paista 200 asteessa noin 40 minuuttia.
karjalanpaistiliha 1.2 kg; rypsiöljy 2 rkl; sipuli 2 kpl; porkkana 5 kpl; laakerinlehti 2 kpl; maustepippuri 1 rkl; suola 1 rkl; vesi 1 l|Ota liha huoneenlämpöön noin tuntia ennen kypsennystä./Ruskista liha pannulla öljyssä kahdessa erässä./Kuori ja neljänneköi sipulit, kuori ja viipaloi porkkanat./Kerrosta liha, sipulit, porkkanat ja mausteet pataan. Kuumenna vesi kiehuvaksi ja kaada sitä pataan niin, että liha peittyy./Kypsennä kannen alla 225 asteessa 30 minuuttia. Laske lämpö 200 asteeseen ja hauduta 2–3 tuntia, välillä sekoittaen, kunnes liha on murua.
kaurahiutaleet 2 dl; vesi 4 dl; suola 0.5 tl; mustikka 1 dl|Kuumenna vesi ja suola kiehuvaksi./Lisää kaurahiutaleet ja sekoita./Keitä miedolla lämmöllä 5 minuuttia sekoittaen./Anna turvota hetki kannen alla ja lisää marjat päälle.
puuroriisi 2.5 dl; vesi 3 dl; maito 1 l; suola 0.5 tl; voi 1 rkl|Keitä riisiä vedessä kannen alla 10 minuuttia./Lisää maito ja suola ja hauduta miedolla lämmöllä noin 40 minuuttia välillä sekoittaen./Lisää voi lopuksi ja anna turvota hetki.
maito 1 l; mannaryyni 1 dl; sokeri 1 rkl; suola 0.5 tl|Kuumenna maito kiehuvaksi./Ripottele mannaryynit joukkoon sekoittaen./Keitä miedolla lämmöllä 5 minuuttia./Mausta sokerilla ja suolalla.
maito 5 dl; kananmuna 3 kpl; vehnäjauho 2.5 dl; sokeri 2 rkl; suola 0.5 tl; voi 50 g|Sulata voi./Vatkaa munat, maito, sokeri ja suola./Sekoita jauhot joukkoon ja lisää sulatettu voi./Kaada taikina leivinpaperilla vuorattuun uunipellille./Paista 225 asteessa noin 30–35 minuuttia.
kananmuna 4 kpl; maito 1 dl; kinkkusuikaleet 100 g; voi 1 rkl; suola 0.5 tl|Vatkaa munat, maito ja suola./Sulata voi pannulla./Kaada munaseos pannulle ja lisää kinkku./Kypsennä miedolla lämmöllä, kunnes pinta hyytyy./Taita kaksinkerroin ja tarjoa heti.
maitorahka 400 g; mustikka 2 dl; hunaja 1 rkl; kaurahiutaleet 1 dl|Sekoita rahka ja hunaja./Annostele kulhoihin./Lisää marjat ja kaurahiutaleet päälle.
tomaatti 4 kpl; kurkku 1 kpl; punasipuli 1 kpl; fetajuusto 200 g; oliivit 1 dl; oliiviöljy 3 rkl; suola 0.5 tl|Pilko tomaatit ja kurkku isoiksi paloiksi./Viipaloi punasipuli ohuesti./Sekoita kulhossa kasvikset ja oliivit./Murenna feta päälle ja valuta öljy./Mausta suolalla.
tonnikala 2 prk; salaatti 200 g; maissi 1 prk; tomaatti 3 kpl; kurkku 1 kpl; oliiviöljy 2 rkl; sitruunamehu 2 rkl; mustapippuri 0.5 tl|Revi salaatti kulhoon./Pilko tomaatit ja kurkku./Valuta tonnikala ja maissi./Sekoita kaikki yhteen ja lisää öljy ja sitruunamehu./Mausta pippurilla.
kananrintafilee 400 g; salaatti 200 g; tomaatti 3 kpl; kurkku 1 kpl; parmesaani 50 g; oliiviöljy 2 rkl; sitruunamehu 2 rkl; suola 0.5 tl|Viipaloi kana ja paista öljyssä kypsäksi./Revi salaatti ja pilko tomaatit sekä kurkku./Sekoita kasvikset ja kana./Raasta parmesaani päälle ja lisää sitruunamehu.
kikherneet 2 prk; tomaatti 3 kpl; kurkku 1 kpl; punasipuli 1 kpl; persilja 1 nippu; oliiviöljy 2 rkl; sitruunamehu 2 rkl; suola 0.5 tl|Valuta ja huuhtele kikherneet./Pilko tomaatit, kurkku ja sipuli pieniksi paloiksi./Hienonna persilja./Sekoita kaikki kulhossa ja mausta öljyllä, sitruunamehulla ja suolalla.
banaani 3 kpl; kananmuna 2 kpl; sokeri 2 dl; voi 100 g; vehnäjauho 3 dl; leivinjauhe 2 tl; kaneli 1 tl|Sulata voi./Muussaa banaanit./Vatkaa munat ja sokeri vaahdoksi./Sekoita banaanit ja voi joukkoon./Sekoita jauhot, leivinjauhe ja kaneli ja kaada taikinaan./Paista voidellussa vuoassa 175 asteessa noin 45 minuuttia.
vehnäjauho 3 dl; voi 100 g; sokeri 1.5 dl; kananmuna 1 kpl; leivinjauhe 1 tl; mustikka 400 g; perunajauho 1 rkl|Sekoita jauhot, leivinjauhe ja 1 dl sokeria./Nypi voi joukkoon ja lisää muna./Painele taikina piirakkavuokaan./Sekoita mustikat, loput sokerista ja perunajauho ja levitä pohjalle./Paista 200 asteessa noin 30 minuuttia.
kaurahiutaleet 4 dl; vehnäjauho 2 dl; sokeri 1.5 dl; voi 150 g; leivinjauhe 1 tl; kananmuna 1 kpl|Sulata voi ja sekoita se kaurahiutaleisiin ja sokeriin./Lisää muna./Sekoita jauhot ja leivinjauhe joukkoon./Nostele lusikalla pellille pieniksi kekseiksi./Paista 200 asteessa noin 10–12 minuuttia.
mustikka 400 g; vesi 5 dl; sokeri 1 dl; perunajauho 2 rkl|Keitä marjat ja vesi kiehuvaksi./Sekoita perunajauho ja sokeri pieneen määrään kylmää vettä./Lisää seos kiehuvaan marjakeittoon sekoittaen ja keitä, kunnes kiisseli sakenee./Jäähdytä kulhoissa.
omena 4 kpl; kaurahiutaleet 2 dl; vehnäjauho 1 dl; sokeri 1 dl; voi 100 g; kaneli 1 tl|Kuori ja viipaloi omenat vuokaan./Sekoita kaurahiutaleet, jauhot ja sokeri./Nypi voi joukkoon murumaiseksi seokseksi./Levitä muruseos omenoiden päälle./Paista 200 asteessa noin 30 minuuttia.
peruna 800 g; suola 0.5 tl|Kuori ja pilko perunat./Keitä suolatussa vedessä noin 20 minuuttia./Valuta ja tarjoa heti.
peruna 800 g; maito 1.5 dl; voi 50 g; suola 0.5 tl|Kuori ja pilko perunat./Keitä pehmeiksi suolatussa vedessä./Valuta ja muussaa lämpimän maidon ja voin kanssa.
riisi 3 dl; suola 0.5 tl|Huuhtele riisi./Keitä pakkauksen ohjeen mukaan suolatussa vedessä./Anna vetäytyä hetki kannen alla.
pasta 300 g; suola 1 tl|Keitä pasta runsaassa suolatussa vedessä pakkauksen ohjeen mukaan./Valuta.
couscous 3 dl; oliiviöljy 1 rkl; suola 0.5 tl|Mittaa couscous kulhoon ja lisää sama määrä kuumaa vettä./Anna turvota kannen alla 5 minuuttia./Sekoita haarukalla ja lisää öljy ja suola.
leipä 300 g; voi 50 g|Viipaloi leipä./Tarjoa voin kanssa.
salaatti 200 g; tomaatti 3 kpl; kurkku 1 kpl; oliiviöljy 1 rkl; sitruunamehu 1 rkl; suola 0.5 tl|Revi salaatti kulhoon./Pilko tomaatit ja kurkku./Sekoita ja lisää öljy, sitruunamehu ja suola.
porkkana 4 kpl; valkokaali 300 g; sitruunamehu 1 rkl; oliiviöljy 1 rkl; suola 0.5 tl|Raasta porkkanat ja kaali./Sekoita sitruunamehun, öljyn ja suolan kanssa.
kurkku 1 kpl; tomaatti 4 kpl; oliiviöljy 1 rkl; suola 0.5 tl|Pilko kurkku ja tomaatit paloiksi./Sekoita öljyn ja suolan kanssa.
parsakaali 300 g; porkkana 3 kpl; voi 1 rkl; suola 0.5 tl|Pilko parsakaali ja porkkanat./Keitä suolatussa vedessä noin 8 minuuttia./Valuta ja sekoita voi joukkoon.
maksa 500 g; puuroriisi 2 dl; maito 7 dl; sipuli 1 kpl; kananmuna 1 kpl; siirappi 2 rkl; rusinat 1 dl; voi 50 g; suola 1.5 tl; mustapippuri 0.5 tl; korppujauho 2 rkl; puolukkahillo 1 prk|Keitä puuroriisi maidossa sakeaksi puuroksi ja anna jäähtyä./Sulata maksa ja soseuta se tai jauha tasaiseksi./Kuullota hienonnettu sipuli voissa ja sekoita se puuron, maksan, kananmunan, siirapin, rusinoiden ja mausteiden joukkoon./Kaada seos voideltuun vuokaan ja ripottele päälle korppujauhoa./Paista 175 asteessa noin tunti, kunnes pinta on kullanruskea./Tarjoa puolukkahillon ja sulatetun voin kanssa.
lohifile 300 g; valkoinen kalafile 300 g; peruna 600 g; porkkana 1 kpl; sipuli 1 kpl; kalaliemikuutio 1 kpl; ruokakerma 2 dl; voi 1 rkl; laakerinlehti 2 kpl; tilli 1 rkl; suola 1 tl; vesi 6 dl|Kuullota sipuli voissa kattilassa./Lisää kuutioidut perunat ja porkkana, vesi, liemikuutio ja laakerinlehdet. Keitä noin 10 minuuttia./Lisää kalapalat ja kerma ja keitä varovasti 5 minuuttia./Mausta suolalla ja ripottele tilli päälle.
valkoinen kalafile 600 g; vehnäjauho 1 dl; voi 40 g; peruna 800 g; sitruuna 1 kpl; tilli 1 rkl; suola 1 tl; mustapippuri 0.5 tl|Keitä kuoritut perunat suolatussa vedessä kypsiksi./Mausta kalafileet suolalla ja pippurilla ja pyöräytä ne jauhossa./Paista fileet voissa kuumalla pannulla noin 3 minuuttia kummaltakin puolelta./Tarjoa perunoiden, sitruunalohkojen ja tillin kanssa.
vehnäjauho 4 dl; leivinjauhe 2 tl; suola 1 tl; rypsiöljy 0.5 dl; vesi 1.5 dl; tomaattimurska 1 prk; oregano 1 tl; juustoraaste 200 g; savukinkku 150 g; herkkusienet 150 g; paprika 1 kpl|Sekoita jauhot, leivinjauhe ja suola. Lisää öljy ja vesi ja vaivaa taikinaksi./Kauli taikina pellille leivinpaperin päälle./Levitä päälle tomaattimurska ja oregano./Lisää kinkku, siivutetut sienet ja paprika sekä juustoraaste./Paista 225 asteessa noin 15 minuuttia.
lenkkimakkara 500 g; peruna 800 g; sipuli 2 kpl; rypsiöljy 2 rkl; suola 1 tl; paprikajauhe 1 tl; sinappi 3 rkl|Kuori perunat ja leikkaa ne lohkoiksi. Leikkaa sipulit lohkoiksi./Sekoita perunat ja sipulit öljyn, suolan ja paprikajauheen kanssa ja levitä pellille./Paista 225 asteessa 25 minuuttia./Lisää viipaloitu makkara pellille ja paista vielä 20 minuuttia./Tarjoa sinapin kanssa.
nakit 300 g; peruna 500 g; porkkana 2 kpl; sipuli 1 kpl; liemikuutio 2 kpl; laakerinlehti 2 kpl; mustapippuri 0.5 tl; persilja 1 rkl; vesi 1 l|Kuori ja kuutioi perunat ja porkkanat. Hienonna sipuli./Keitä kasviksia vedessä, liemikuutioissa ja laakerinlehdissä noin 15 minuuttia./Lisää viipaloidut nakit ja keitä vielä 5 minuuttia./Mausta pippurilla ja ripottele persilja päälle.
peruna 800 g; sipuli 2 kpl; ansjovis 1 prk; ruokakerma 2 dl; voi 30 g; korppujauho 2 rkl; mustapippuri 0.5 tl|Leikkaa perunat ohuiksi tikuiksi ja sipulit renkaiksi./Kerrosta perunat, sipuli ja ansjoviksen palat voideltuun vuokaan./Kaada päälle kerma ja ansjovisliemi ja mausta pippurilla./Ripottele päälle korppujauho ja voinokareet./Paista 200 asteessa noin 50 minuuttia.
valkokaali 800 g; jauheliha 500 g; riisi 1 dl; sipuli 1 kpl; kananmuna 1 kpl; maito 1 dl; siirappi 2 rkl; suola 1 tl; mustapippuri 0.5 tl; voi 30 g; liemikuutio 1 kpl; puolukkahillo 1 prk|Keitä kaalinlehdet kuumassa vedessä pehmeiksi ja leikkaa paksu ruoti pois./Keitä riisi vajaaksi ja sekoita se jauhelihan, hienonnetun sipulin, kananmunan, maidon ja mausteiden kanssa./Kääri täyte lehtiin ja asettele kääryleet vuokaan sauma alaspäin./Voitele kääryleet siirapilla ja voisulalla ja lisää puolikas desi liemikuutioista tehtyä lientä./Paista 200 asteessa noin 60 minuuttia ja tarjoa puolukkahillon kanssa.
tortilla 6 kpl; jauheliha 400 g; tacomauste 30 g; jäävuorisalaatti 150 g; tomaatti 2 kpl; juustoraaste 100 g; maissi 1 prk; smetana 1.5 dl|Ruskista jauheliha ja mausta tacomausteella ja vedellä./Suikaloi salaatti ja kuutioi tomaatit./Lämmitä tortillat./Tarjoa täytteet pöytään ja anna kunkin koota omat tortillansa.
leipä 400 g; savukinkku 200 g; juustoraaste 200 g; tomaatti 2 kpl; voi 30 g; oregano 1 tl|Voitele leipäviipaleet./Aseta päälle kinkku, tomaattiviipaleet ja juustoraaste./Ripottele oregano päälle./Paista 225 asteessa noin 10 minuuttia.
jauheliha 500 g; hampurilaissämpylä 4 kpl; sipuli 1 kpl; kananmuna 1 kpl; korppujauho 1 dl; tomaatti 2 kpl; jäävuorisalaatti 100 g; juustoraaste 100 g; tomaattiketsuppi 4 rkl; sinappi 2 rkl; suola 1 tl; mustapippuri 0.5 tl; rypsiöljy 1 rkl|Sekoita jauheliha, hienonnettu sipuli, kananmuna, korppujauho ja mausteet ja muotoile 4 pihviä./Paista pihvit öljyssä noin 5 minuuttia kummaltakin puolelta./Paahda sämpylät pannulla tai uunissa./Kokoa hampurilaiset: ketsuppi, sinappi, salaatti, tomaatti, pihvi ja juusto.
poronliha 400 g; sipuli 1 kpl; voi 2 rkl; vehnäjauho 1 rkl; ruokakerma 1 dl; vesi 2 dl; liemikuutio 1 kpl; mustapippuri 0.5 tl; suola 1 tl; peruna 800 g; puolukkahillo 1 prk|Ruskista poronliha voissa kuumalla pannulla ja lisää hienonnettu sipuli./Ripottele jauho päälle ja lisää vesi, liemikuutio ja mausteet./Hauduta kannen alla noin 20 minuuttia ja lisää lopuksi kerma./Keitä perunat ja muussaa ne. Tarjoa puolukkahillon kanssa.
kananrintafilee 500 g; turkkilainen jogurtti 1 dl; garam masala 2 tl; inkivääri 20 g; valkosipulinkynsi 3 kpl; sipuli 1 kpl; tomaattimurska 1 prk; ruokakerma 2 dl; voi 2 rkl; riisi 3 dl; suola 1 tl; chilijauhe 0.5 tl|Marinoi kanapalat jogurtissa, garam masalassa ja suolassa noin 15 minuuttia./Kuullota sipuli, valkosipuli ja inkivääri voissa./Lisää kana ja ruskista se. Lisää tomaattimurska ja chilijauhe ja hauduta 15 minuuttia./Lisää kerma ja kuumenna. Keitä riisi pakkauksen ohjeen mukaan ja tarjoa kastikkeen kanssa.
kesäkurpitsa 300 g; halloumi 200 g; kananmuna 2 kpl; vehnäjauho 1 dl; minttu 1 rkl; mustapippuri 0.5 tl; rypsiöljy 2 rkl; turkkilainen jogurtti 2 dl; kurkku 1 kpl|Raasta kesäkurpitsa ja halloumi ja purista kesäkurpitsasta neste pois./Sekoita joukkoon kananmunat, jauho, minttu ja pippuri./Paista pihvit öljyssä noin 3 minuuttia kummaltakin puolelta./Sekoita jogurtti ja raastettu kurkku kastikkeeksi ja tarjoa pihvien kanssa.
kananrintafilee 500 g; paprika 1 kpl; porkkana 2 kpl; sipuli 1 kpl; kanaliemikuutio 1 kpl; ruokakerma 2 dl; riisi 3 dl; voi 1 rkl; suola 1 tl; mustapippuri 0.5 tl; paprikajauhe 1 tl|Paista kanasuikaleet ja sipuli voissa pannulla./Lisää paprikasuikaleet ja porkkanaviipaleet./Lisää kerma, liemikuutio ja mausteet ja hauduta noin 15 minuuttia./Keitä riisi ja tarjoa kastikkeen kanssa.
peruna 800 g; savukinkku 200 g; sipuli 1 kpl; ruokakerma 3 dl; voi 20 g; juustoraaste 1 dl; suola 1 tl; mustapippuri 0.5 tl|Viipaloi perunat ohuiksi ja sipuli renkaiksi. Kuutioi kinkku./Kerrosta kaikki voideltuun vuokaan./Kaada kerma päälle ja mausta. Ripottele juustoraaste päälle./Paista 200 asteessa noin 60 minuuttia.
nakit 300 g; sipuli 1 kpl; tomaattimurska 1 prk; tomaattipyree 1 rkl; ruokakerma 1 dl; paprikajauhe 1 tl; suola 0.5 tl; riisi 3 dl|Kuullota sipuli ja lisää viipaloidut nakit./Lisää tomaattimurska, tomaattipyree ja paprikajauhe ja hauduta 10 minuuttia./Lisää kerma ja mausta suolalla./Keitä riisi ja tarjoa kastikkeen kanssa.
porkkana 3 kpl; peruna 400 g; lanttu 300 g; sipuli 1 kpl; kasvisliemikuutio 2 kpl; voi 1 rkl; ruokakerma 1 dl; vesi 8 dl; suola 0.5 tl; mustapippuri 0.5 tl|Kuullota sipuli voissa kattilassa./Lisää kuutioidut juurekset, vesi ja liemikuutiot ja keitä pehmeiksi noin 20 minuuttia./Soseuta keitto sauvasekoittimella./Lisää kerma ja mausta.
peruna 600 g; kananmuna 1 kpl; vehnäjauho 1 dl; maito 1 dl; suola 1 tl; rypsiöljy 2 rkl; puolukkahillo 1 prk|Raasta perunat ja sekoita joukkoon muna, jauho, maito ja suola./Paista ohuita lettuja kuumassa öljyssä noin 3 minuuttia kummaltakin puolelta./Tarjoa puolukkahillon kanssa.`;
