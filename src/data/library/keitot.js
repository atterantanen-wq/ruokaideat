/* Keitot */
export default [
  {
    n: "Lohikeitto", m: "f", t: "ke", min: 35, w: 20, sv: 4, pop: true,
    d: "Kermainen kalakeitto, jossa peruna ja porkkana keitetään ensin kypsiksi ja lohi haudutetaan lopuksi mehukkaaksi. Tilli on pakollinen.",
    ing: ["lohifile 500 g", "peruna 600 g", "porkkana 1 kpl", "sipuli 1 kpl", "purjo 50 g", "voi 1 rkl", "vesi 8 dl", "kalaliemikuutio 1 kpl", "laakerinlehti 2 kpl", "maustepippuri 6 kpl", "ruokakerma 2 dl", "suola 0.5 tl", "tilli 1 ruukku"],
    steps: [
      "Kuori perunat ja porkkana ja leikkaa ne suupaloiksi. Silppua sipuli ja purjo.",
      "Kuumenna voi kattilan pohjalla. Pehmennä sipulia ja purjoa siinä hetki ruskistamatta.",
      "Lisää vesi, liemikuutio, laakerinlehdet ja maustepippurit. Kun liemi kiehuu, lisää perunat ja porkkana ja keitä noin 15 minuuttia, kunnes ne ovat melkein kypsiä.",
      "Irrota kalasta nahka, nypi ruodot pois ja leikkaa liha isoiksi kuutioiksi.",
      "Lisää kerma ja kalakuutiot. Pidä keitto juuri ja juuri kiehumapisteen alapuolella 4–5 minuuttia. Kova kiehuminen tekee lohesta kuivaa.",
      "Mausta suolalla ja lisää runsaasti silputtua tilliä juuri ennen tarjoilua.",
    ],
    serve: "Tarjoa ruisleivän ja voin kanssa.",
    extras: ["ruisleipä"],
    tips: [
      "Käytä sekoittaessa reikäkauhaa tai sekoita varovasti, niin lohikuutiot pysyvät kokonaisina.",
      "Pakastetusta kalasta tulee yhtä hyvä keitto. Lisää se jäisenä paloina ja pidennä haudutusta pari minuuttia.",
    ],
    tw: [
      { id: "kirjolohi", n: "Kirjolohesta", d: "Kirjolohi on lohta edullisempi ja sopii keittoon yhtä hyvin.", rm: ["lohifile"], add: ["kirjolohifile 500 g"] },
      { id: "maidoton", n: "Maidoton", d: "Käytä ruokakerman tilalla kaurakermaa ja voin tilalla rypsiöljyä.", rm: ["ruokakerma", "voi"], add: ["kaurakerma 2 dl", "rypsiöljy 1 rkl"] },
    ],
    src: [["Valio", "https://www.valio.fi/reseptit/lohikeitto/"], ["Yhteishyvä", "https://yhteishyva.fi/reseptit/herkullinen-kermainen-lohikeitto/recipe-823"], ["Kotikokki", "https://www.kotikokki.net/reseptit/nayta/209622/Lohikeitto/"]],
  },
];
