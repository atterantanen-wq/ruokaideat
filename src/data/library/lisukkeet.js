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
];
