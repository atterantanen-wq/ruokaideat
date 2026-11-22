/* Aamu-, väli- ja iltapalat */
export default [
  {
    n: "Riisipuuro", m: "v", t: "pu", min: 55, w: 10, sv: 4, fe: "jo", pop: true,
    d: "Pehmeä ja kermainen maitopuuro hitaasti hauduttaen. Tärkein vaihe on alku: riisi turpoaa ensin vedessä, eikä puuro pala pohjaan.",
    ing: ["vesi 2 dl", "puuroriisi 2 dl", "maito 1 l", "voi 1 rkl", "suola 0.5 tl"],
    steps: [
      "Valitse kattila, jossa on paksu pohja. Kuumenna vesi kiehuvaksi.",
      "Kaada riisit veteen ja keitä sekoitellen noin viisi minuuttia, kunnes riisi on imenyt nesteen.",
      "Lisää maito ja kuumenna puuro sekoittaen kiehahtamispisteeseen. Ole tässä vaiheessa tarkkana, sillä maito kuohuu helposti yli.",
      "Käännä lämpö pienimmälle, nosta kansi päälle ja anna puuron muhia 40–45 minuuttia. Sekoita kattilan pohjaa noin 10 minuutin välein.",
      "Kun riisinjyvät ovat pehmeitä ja puuro paksua, sekoita joukkoon suola ja voi.",
    ],
    serve: "Tarjoa sokeri-kanelisekoituksen, voisilmän tai sekahedelmäkeiton kanssa.",
    extras: ["kaneli"],
    tips: ["Jäänyt puuro kelpaa seuraavana päivänä riisipuuropannukakuksi."],
    tw: [
      { id: "uuni", n: "Uunissa", d: "Uunissa puuro ei pala pohjaan. Kypsennä 150 asteessa noin kaksi tuntia.", step: { 2: "Kaada riisi, maito ja vesi uunivuokaan ja sekoita.", 3: "Kypsennä 150-asteisessa uunissa noin kaksi tuntia. Sekoita kerran tai kahdesti." }, del: [0, 1] },
      { id: "kaura", n: "Maidoton", d: "Käytä maidon tilalla kaurajuomaa ja lisää lopuksi tilkka kaurakermaa.", rm: ["maito", "voi"], add: ["kauramaito 1 l", "kaurakerma 1 dl"] },
    ],
    src: [["Martat", "https://www.martat.fi/reseptit/riisipuuro/"], ["Valio", "https://www.valio.fi/reseptit/riisipuuro/"], ["Kotikokki", "https://www.kotikokki.net/reseptit/nayta/99039/Riisipuuro/"], ["Yhteishyvä", "https://yhteishyva.fi/reseptit/vegaaninen-riisipuuro/1sQUmedygzmeYacebUYNLO"]],
  },
];
