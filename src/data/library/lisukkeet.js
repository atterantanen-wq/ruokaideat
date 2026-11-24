/* Peruslisukkeet. Näihin viitataan reseptien sides-kentässä id:llä. */
export default [
  {
    id: "k-keitetyt-perunat", n: "Keitetyt perunat", m: "v", t: "li", min: 25, w: 5, sv: 4,
    d: "Kuoritut tai kuorineen keitetyt perunat, suomalaisen kotiruoan perusta.",
    ing: ["peruna 800 g", "vesi 1 l", "suola 1 tl"],
    steps: [
      "Kuori perunat tai harjaa uudet perunat puhtaiksi. Leikkaa isot perunat puoliksi, jotta kaikki kypsyvät yhtä aikaa.",
      "Laita perunat kattilaan ja kaada päälle kylmää vettä niin, että ne juuri peittyvät. Lisää suola.",
      "Kun vesi kiehuu, pienennä lämpöä ja keitä kannen alla 15–20 minuuttia. Peruna on kypsä, kun veitsi uppoaa siihen ilman vastusta.",
      "Kaada vesi pois ja anna perunoiden höyrytä hetki kuivaksi kuumalla levyllä.",
    ],
    tips: ["Uudet perunat kypsyvät nopeammin, noin 12–15 minuutissa. Tillinoksa keitinveteen antaa niille kesäisen maun."],
    vs: [
      { id: "perus", n: "Perus" },
      { id: "uudet", n: "Uudet perunat tillillä", add: ["tilli 0.5 nippu", "voi 1 rkl"], step: { 0: "Harjaa uudet perunat puhtaiksi juoksevan veden alla. Kuorta ei tarvitse poistaa.", 2: "Kun vesi kiehuu, lisää muutama tillinvarsi, pienennä lämpöä ja keitä 12–15 minuuttia." }, ins: [[3, "Nosta perunoiden päälle nokare voita ja silputtua tilliä."]] },
    ],
    src: [["Martat", "https://www.martat.fi/reseptit/uusien-perunoiden-keittaminen/"]],
  },
  {
    id: "k-perunamuusi", n: "Perunamuusi", m: "v", t: "li", min: 35, w: 15, sv: 4, pop: true,
    d: "Pehmeä ja kuohkea muusi jauhoisista perunoista, maidosta ja voista.",
    ing: ["peruna 1 kg", "maito 2 dl", "voi 30 g", "suola 1 tl", "muskotti 1 ripaus"],
    steps: [
      "Kuori perunat ja paloittele ne tasakokoisiksi. Keitä niitä suolatussa vedessä noin 20 minuuttia, kunnes ne ovat pehmeitä.",
      "Valuta perunat. Muussaa ne heti kuumina survimella tai painele perunapuristimen läpi.",
      "Kuumenna maito. Lisää se vähitellen muusiin sekoittaen, kunnes rakenne on sopivan pehmeä.",
      "Sekoita joukkoon voi ja mausta suolalla ja ripauksella muskottia.",
    ],
    tips: [
      "Jauhoinen peruna tekee kuohkeimman muusin. Älä vatkaa sähkövatkaimella pitkään, koska muusista tulee sitkeää.",
      "Pala palsternakkaa tai juuriselleriä perunoiden joukossa keitettynä tuo muusiin makeutta.",
    ],
    tw: [
      { id: "kasvi", n: "Maidoton", d: "Käytä maidon tilalla kaurajuomaa ja voin tilalla margariinia.", rm: ["maito", "voi"], add: ["kauramaito 2 dl", "margariini 30 g"], step: {"2": "Kuumenna kaurajuoma. Lisää se vähitellen muusiin sekoittaen, kunnes rakenne on sopivan pehmeä.", "3": "Sekoita joukkoon margariini ja mausta suolalla ja ripauksella muskottia."} },
    ],
    vs: [
      { id: "perus", n: "Perus" },
      { id: "valkosipuli", n: "Valkosipuli", add: ["valkosipulinkynsi 3 kpl"], step: { 2: "Kuumenna maito kuorittujen ja murskattujen valkosipulinkynsien kanssa. Lisää maito vähitellen muusiin sekoittaen." } },
      { id: "juures", n: "Juuresmuusi", rm: ["peruna"], add: ["peruna 600 g", "palsternakka 200 g", "juuriselleri 200 g"], step: { 0: "Kuori perunat, palsternakka ja selleri ja paloittele ne tasakokoisiksi. Keitä suolatussa vedessä noin 20 minuuttia, kunnes palat ovat pehmeitä." } },
    ],
    src: [["Martat", "https://www.martat.fi/reseptit/perunasose/"], ["Valio", "https://www.valio.fi/reseptit/perunamuusi/"], ["Kotikokki", "https://www.kotikokki.net/reseptit/nayta/440/Perunamuusi/"], ["Yhteishyvä", "https://yhteishyva.fi/reseptit/vegaaninen-perunamuusi/3Yd8luyx39WZ4ssQthKNs9"]],
  },
  {
    id: "k-riisi", n: "Riisi", m: "v", t: "li", min: 20, w: 5, sv: 4,
    d: "Kuohkea keitetty riisi kastikkeiden, currien ja wokkien kaveriksi.",
    ing: ["riisi 3 dl", "vesi 6 dl", "suola 0.5 tl"],
    steps: [
      "Huuhtele riisi siivilässä kylmällä vedellä, kunnes vesi on kirkasta.",
      "Kiehauta vesi ja suola kattilassa. Lisää riisi ja sekoita kerran.",
      "Pienennä lämpö miedoksi, laita kansi päälle ja anna kypsyä noin 12 minuuttia nostamatta kantta.",
      "Nosta kattila levyltä ja anna seistä kannen alla 5 minuuttia. Kuohkeuta haarukalla.",
    ],
    tips: ["Täysjyväriisi tarvitsee hieman enemmän vettä ja noin 25 minuutin keittoajan."],
    vs: [
      { id: "perus", n: "Perus" },
      { id: "kookos", n: "Kookosriisi", rm: ["vesi"], add: ["vesi 3 dl", "kookosmaito 3 dl"], step: { 1: "Kiehauta vesi, kookosmaito ja suola kattilassa. Lisää riisi ja sekoita kerran." } },
      { id: "keltainen", n: "Keltainen riisi", add: ["sipuli 0.5 kpl", "voi 1 rkl", "kurkuma 0.5 tl"], ins: [[0, "Kuullota silputtu sipuli voissa kattilassa, lisää kurkuma ja huuhdeltu riisi ja paahda minuutti sekoittaen."]], step: { 1: "Kaada kattilaan kiehuva vesi ja suola ja sekoita kerran." } },
    ],
  },
  {
    id: "k-nuudelit", n: "Nuudelit", m: "v", t: "li", min: 10, w: 5, sv: 4,
    d: "Nopeasti kypsyvät nuudelit wokkien ja aasialaisten kastikkeiden pohjaksi.",
    ing: ["nuudelit 250 g", "vesi 2 l", "rypsiöljy 1 tl"],
    steps: [
      "Kiehauta vesi kattilassa.",
      "Lisää nuudelit ja keitä pakkauksen ohjeen mukaan, yleensä 3–4 minuuttia. Erottele levyt haarukalla.",
      "Kaada nuudelit siivilään ja sekoita joukkoon tilkka öljyä, jotteivät ne takerru toisiinsa.",
    ],
    tips: ["Riisinuudelit eivät tarvitse keittämistä: anna niiden hautua kuumassa vedessä noin 5 minuuttia."],
    vs: [
      { id: "perus", n: "Perus" },
      { id: "soija", n: "Soijanuudelit", add: ["soijakastike 1 rkl", "kevätsipuli 2 kpl"], ins: [[2, "Kääntele valutettujen nuudelien joukkoon soijakastike ja ohuiksi viipaloitu kevätsipuli."]] },
    ],
  },
  {
    id: "k-pasta", n: "Pasta", m: "v", t: "li", min: 15, w: 5, sv: 4,
    d: "Runsaassa vedessä keitetty pasta, joka jää sopivasti al dente.",
    ing: ["pasta 400 g", "vesi 3 l", "suola 1 rkl"],
    steps: [
      "Kiehauta iso kattilallinen vettä ja lisää suola.",
      "Lisää pasta ja sekoita heti, ettei se tartu pohjaan.",
      "Keitä pakkauksen ohjeen mukaan ja maista minuuttia aiemmin: pastan kuuluu olla kypsää, mutta keskeltä vielä napakkaa.",
      "Ota kupillinen keitinvettä talteen ja kaada pasta siivilään.",
    ],
    tips: ["Tilkka talteen otettua keitinvettä sitoo kastikkeen pastan pintaan."],
    tw: [
      { id: "voi", n: "Voi ja parmesaani", d: "Sekoita kuumaan pastaan nokare voita ja raastettua parmesaania, niin se käy sellaisenaan lisukkeeksi.", add: ["voi 2 rkl", "parmesaani 40 g"], ins: [[3, "Palauta pasta kattilaan ja sekoita joukkoon voi ja raastettu parmesaani."]] },
    ],
  },
  {
    id: "k-vihersalaatti", n: "Vihersalaatti", m: "v", t: "li", min: 10, w: 10, sv: 4,
    d: "Raikas perussalaatti lehtisalaatista, kurkusta ja tomaatista yksinkertaisella öljykastikkeella.",
    ing: ["salaatti 1 kpl", "kurkku 0.5 kpl", "kirsikkatomaatit 200 g", "punasipuli 0.5 kpl", "oliiviöljy 3 rkl", "sitruuna 0.5 kpl", "sinappi 1 tl", "suola 0.25 tl", "mustapippuri 1 ripaus"],
    steps: [
      "Huuhtele ja kuivaa salaatinlehdet ja revi ne kulhoon.",
      "Viipaloi kurkku ja punasipuli ohuiksi ja puolita tomaatit.",
      "Vispaa öljy, sitruunan mehu, sinappi, suola ja pippuri kastikkeeksi.",
      "Kääntele kastike salaatin joukkoon juuri ennen tarjoilua.",
    ],
    tips: ["Kuivaa salaatti huolellisesti, niin kastike tarttuu lehtiin."],
    vs: [
      { id: "perus", n: "Perus" },
      { id: "kreikkalainen", n: "Kreikkalainen", add: ["fetajuusto 100 g", "oliivit 0.5 dl", "oregano 0.5 tl"], step: { 3: "Kääntele kastike salaatin joukkoon, murenna päälle feta, lisää oliivit ja ripottele oregano." } },
      { id: "omena", n: "Omena-pähkinä", rm: ["punasipuli"], add: ["omena 1 kpl", "pähkinät 0.5 dl", "hunaja 1 tl"], step: { 1: "Viipaloi kurkku ohuiksi, puolita tomaatit ja leikkaa omena ohuiksi lohkoiksi.", 2: "Vispaa öljy, sitruunan mehu, sinappi, hunaja, suola ja pippuri kastikkeeksi." }, ins: [[3, "Paahda pähkinät kuivalla pannulla ja ripottele ne salaatin päälle."]] },
    ],
    tw: [
      { id: "siemenet", n: "Paahdetut siemenet", d: "Ripottele pinnalle kuivalla pannulla paahdettuja auringonkukan- tai kurpitsansiemeniä.", add: ["auringonkukansiemenet 0.5 dl"], ins: [[3, "Paahda siemenet kuivalla pannulla ja ripottele ne salaatin pinnalle."]] },
    ],
  },
  {
    id: "k-coleslaw", n: "Coleslaw", m: "v", t: "li", min: 15, w: 15, sv: 6,
    d: "Kermainen kaali-porkkanasalaatti, joka sopii grilliruoan ja pulled porkin kanssa.",
    ing: ["valkokaali 400 g", "porkkana 2 kpl", "punasipuli 0.5 kpl", "majoneesi 1 dl", "turkkilainen jogurtti 1 dl", "sinappi 1 tl", "etikka 1 rkl", "sokeri 1 tl", "suola 0.5 tl"],
    steps: [
      "Suikaloi kaali mahdollisimman ohueksi ja raasta porkkanat. Silppua sipuli hienoksi.",
      "Sekoita majoneesi, jogurtti, sinappi, etikka, sokeri ja suola.",
      "Kääntele kasvikset kastikkeeseen ja anna maustua jääkaapissa ainakin puoli tuntia.",
    ],
    vs: [
      { id: "kermainen", n: "Kermainen" },
      { id: "kirkas", n: "Kirkas", rm: ["majoneesi", "turkkilainen jogurtti"], add: ["oliiviöljy 4 rkl"], step: { 1: "Vispaa öljy, sinappi, etikka, sokeri ja suola kirkkaaksi kastikkeeksi." } },
    ],
    src: [["Yhteishyvä", "https://yhteishyva.fi/reseptit/grillattu-raakamakkara-ja-kirkas-coleslaw/1Kzk4hzEEtEmXQwsKXgiwR"]],
  },
  {
    id: "k-couscous", n: "Couscous", m: "v", t: "li", min: 10, w: 5, sv: 4,
    d: "Kymmenessä minuutissa valmis lisuke, joka imee itseensä kastikkeet ja liemet.",
    ing: ["couscous 3 dl", "vesi 3 dl", "kasvisliemikuutio 0.5 kpl", "oliiviöljy 1 rkl", "persilja 0.5 nippu"],
    steps: [
      "Kiehauta vesi ja liemikuutio.",
      "Kaada liemi couscousin päälle, sekoita ja peitä kannella. Anna turvota 5 minuuttia.",
      "Kuohkeuta haarukalla ja sekoita joukkoon öljy ja persilja.",
    ],
    tw: [
      { id: "kasvis", n: "Kasvikset joukkoon", d: "Sekoita mukaan kuutioitua kurkkua, tomaattia ja paprikaa salaatiksi.", add: ["kurkku 0.5 kpl", "tomaatti 2 kpl", "paprika 1 kpl"], step: {"2": "Kuohkeuta haarukalla ja sekoita joukkoon öljy, persilja sekä kuutioitu kurkku, tomaatti ja paprika."} },
    ],
  },
  {
    id: "k-lohkoperunat", n: "Lohkoperunat", m: "v", t: "li", min: 40, w: 10, sv: 4,
    d: "Kuorelliset perunalohkot uunissa öljyn ja paprikan kanssa rapeiksi paahdettuna.",
    ing: ["peruna 1 kg", "rypsiöljy 3 rkl", "paprikajauhe 1 tl", "suola 1 tl", "mustapippuri 0.5 tl"],
    steps: [
      "Lämmitä uuni 225 asteeseen.",
      "Pese perunat huolellisesti ja leikkaa ne kuorineen lohkoiksi. Kuivaa lohkot talouspaperilla.",
      "Kääntele lohkot öljyssä ja mausteissa ja levitä ne pellille väljästi.",
      "Paahda noin 30 minuuttia ja käännä puolivälissä, kunnes lohkot ovat rapeita ja kullanruskeita.",
    ],
    tips: ["Lohkot rapeutuvat paremmin, kun ne liotetaan ensin kylmässä vedessä parikymmentä minuuttia ja kuivataan huolellisesti ennen öljyä.", "Airfryerissä lohkoperunat valmistuvat noin 20 minuutissa."],
    vs: [
      { id: "paprika", n: "Paprika" },
      { id: "rosmariini", n: "Rosmariini-valkosipuli", rm: ["paprikajauhe"], add: ["rosmariini 1 tl", "valkosipulinkynsi 3 kpl"], step: { 2: "Kääntele lohkot öljyssä, rosmariinissa ja mausteissa ja levitä ne pellille väljästi. Lisää kuorelliset valkosipulinkynnet lohkojen joukkoon." } },
      { id: "bataatti", n: "Bataatti", rm: ["peruna"], add: ["bataatti 1 kg"], step: { 1: "Pese bataatit ja leikkaa ne kuorineen lohkoiksi.", 3: "Paahda noin 25 minuuttia ja käännä puolivälissä. Bataatti tummuu nopeammin kuin peruna." } },
    ],
    src: [["Yhteishyvä", "https://yhteishyva.fi/reseptit/rapeat-lohkoperunat-uunissa/7BBtSToDMmAkfjtkcTzpbM"], ["Kotikokki", "https://www.kotikokki.net/reseptit/nayta/887816/Lohkoperunat/"]],
  },
  {
    id: "k-ohraryynit", n: "Ohraryynit", m: "v", t: "li", min: 25, w: 5, sv: 4,
    d: "Kotimainen täysjyvälisuke riisin tilalle. Ohra on pureskeltavaa ja pähkinäistä.",
    ing: ["ohrasuurimot 3 dl", "vesi 6 dl", "suola 0.5 tl", "voi 1 rkl"],
    steps: [
      "Huuhtele ryynit siivilässä.",
      "Kiehauta vesi ja suola, lisää ryynit ja keitä kannen alla miedolla lämmöllä noin 20 minuuttia, kunnes neste on imeytynyt.",
      "Sekoita joukkoon voi ja anna seistä hetki kannen alla.",
    ],
  },
  {
    id: "k-kotiranskalaiset", n: "Kotitekoiset ranskalaiset", m: "v", t: "li", min: 60, w: 15, sv: 4, kq: ["ai"],
    aka: ["Airfryer-ranskalaiset", "Ranskalaiset perunat"],
    d: "Itse leikatut ranskalaiset airfryerissa. Liotus vedessä ja huolellinen kuivaus tekevät niistä rapeita pienellä öljymäärällä.",
    ing: ["peruna 800 g", "rypsiöljy 1 rkl", "suola 0.5 tl"],
    steps: [
      "Kuori perunat ja leikkaa ne noin sentin paksuisiksi tikuiksi.",
      "Liota tikkuja kylmässä vedessä puoli tuntia, jolloin pinnan tärkkelys irtoaa. Valuta ja kuivaa ne huolellisesti puhtaalla liinalla.",
      "Kääntele tikut öljyssä ja kypsennä airfryerissa 185 asteessa 10 minuuttia. Ravista koria varovasti ja jatka vielä 5–8 minuuttia, kunnes ranskalaiset ovat rapeita. Tee tarvittaessa kahdessa erässä.",
      "Ripottele suola kuumien ranskalaisten päälle ja tarjoa heti.",
    ],
    tips: ["Jauhoinen peruna tekee pehmeän sisuksen, kiinteä peruna pitää muotonsa paremmin.", "Uunissa ranskalaiset paistuvat 225 asteessa noin 30 minuutissa, käännä puolivälissä."],
    vs: [
      { id: "peruna", n: "Peruna" },
      { id: "bataatti", n: "Bataatti", rm: ["peruna"], add: ["bataatti 800 g", "perunajauho 1 rkl"], step: { 1: "Bataattia ei tarvitse liottaa. Kääntele tikut ensin perunajauhossa, joka auttaa pintaa rapeutumaan.", 2: "Kääntele tikut öljyssä ja kypsennä airfryerissa 180 asteessa noin 15 minuuttia ravistellen pari kertaa. Bataatti tummuu nopeasti, joten pidä silmällä loppua kohden." } },
    ],
    src: [["Yhteishyvä", "https://yhteishyva.fi/reseptit/airfryer-ranskalaiset/2ryOfcdXI7txURTQRVtBXP"], ["Arla", "https://www.arla.fi/reseptit/bataattiranskalaiset-airfryerissa/"]],
  },
  {
    id: "k-auraperunat", n: "Auraperunat grillissä", m: "v", t: "li", min: 45, w: 10, sv: 4, kq: ["gl"], pop: true,
    aka: ["Folioperunat", "Sinihomejuustoperunat"],
    d: "Keitetyt uudet perunat lämpiävät foliossa grillin reunalla kermaisen sinihomejuustokastikkeen ja kevätsipulin kanssa.",
    ing: ["peruna 800 g", "kevätsipuli 2 kpl", "mustapippuri 1 tl", "kuohukerma 2 dl", "sininen juusto 100 g", "persilja 0.25 nippu"],
    steps: [
      "Keitä perunat kuorineen kypsiksi ja anna niiden jäähtyä hieman. Viipaloi perunat ja silppua kevätsipulit.",
      "Leikkaa neljä reilua palaa foliota ja jaa perunat ja sipulit niiden keskelle. Rouhi päälle pippuria ja nosta folion reunoja ylös.",
      "Lämmitä kerma kattilassa ja sulata siihen murennettu sinihomejuusto.",
      "Kaada kastike perunoiden päälle ja sulje nyytit tiiviisti.",
      "Lämmitä nyyttejä grillissä noin 15 minuuttia. Avaa ja ripottele päälle silputtu persilja.",
    ],
    tips: ["Edellisen päivän keitetyt perunat sopivat tähän erinomaisesti."],
    src: [["Kotikokki", "https://www.kotikokki.net/reseptit/nayta/78987/Auraperunat%20Grilliss%C3%A4/"]],
  },
  {
    id: "k-grillimaissit", n: "Grillatut maissit", m: "v", t: "li", min: 20, w: 15, sv: 4, kq: ["gl"],
    aka: ["Maissintähkät grillissä", "Elotes"],
    d: "Maissintähkät grillataan kevyesti rusehtaviksi ja sivellään sulatetulla voilla ja suolalla. Muunnelmana meksikolainen versio.",
    ing: ["maissintähkä 4 kpl", "rypsiöljy 1 rkl", "voi 50 g", "suola 0.5 tl"],
    steps: [
      "Jos tähkät ovat tuoreita, keitä niitä suolatussa vedessä 5–7 minuuttia ja kuivaa. Esikypsennetyt tähkät voi grillata sellaisenaan.",
      "Sivele tähkät öljyllä ja grillaa niitä noin 10 minuuttia käännellen, kunnes pintaan tulee tummia kohtia.",
      "Sulata voi ja sivele se kuumille tähkille. Ripottele päälle suola.",
    ],
    tips: ["Maissit voi grillata myös grillipannulla tai uunin grillivastuksen alla."],
    tw: [
      { id: "meksiko", n: "Meksikolaisittain", d: "Voin tilalla valkosipulinen kermakastike, feta, chili ja lime.", rm: ["voi"], add: ["creme fraiche 150 g", "majoneesi 0.5 dl", "valkosipulinkynsi 1 kpl", "lime 1 kpl", "fetajuusto 100 g", "chilijauhe 1 tl"], step: { 2: "Sekoita ranskankerma, majoneesi, murskattu valkosipuli ja puolikkaan limen mehu. Sivele kuumat tähkät kastikkeella, murenna päälle feta ja ripottele chili ja suola. Tarjoa limelohkojen kanssa." } },
    ],
    src: [["Valio", "https://www.valio.fi/reseptit/elotes-eli-meksikolaiset-grillatut-maissit/"], ["Yhteishyvä", "https://yhteishyva.fi/reseptit/elotes-eli-meksikolaiset-grillatut-maissit/4IigNue1j2FMakWlAmKavc"]],
  },
];
