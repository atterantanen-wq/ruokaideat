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
      { id: "kasvi", n: "Maidoton", d: "Käytä maidon tilalla kaurajuomaa ja voin tilalla margariinia.", rm: ["maito", "voi"], add: ["kauramaito 2 dl", "margariini 30 g"] },
    ],
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
      { id: "kasvis", n: "Kasvikset joukkoon", d: "Sekoita mukaan kuutioitua kurkkua, tomaattia ja paprikaa salaatiksi.", add: ["kurkku 0.5 kpl", "tomaatti 2 kpl", "paprika 1 kpl"] },
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
    tips: ["Airfryerissä lohkoperunat valmistuvat noin 20 minuutissa."],
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
];
