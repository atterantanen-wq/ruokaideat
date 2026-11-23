/* Perusateriat: arjen aamu-, väli- ja iltapalat sekä eväät, joihin ei tarvita reseptiä.
 * perus = true: ei lähdettä, näkyy merkinnällä "Perusateria". ml = aterian kohdat (ks. valipalat.js). */
export default [
  {
    n: "Jogurtti ja mysli", m: "v", t: "am", min: 2, w: 2, sv: 1, perus: true, ml: ["a", "v", "i"],
    d: "Jogurttia, mysliä ja marjoja kulhossa. Valmis parissa minuutissa.",
    ing: ["maustamaton jogurtti 2 dl", "mysli 0.5 dl", "pakastemarjat 50 g"],
    steps: ["Annostele jogurtti kulhoon ja lisää pinnalle mysli ja marjat."],
  },
  {
    n: "Ruisleipä ja leikkeleet", m: "p", t: "am", min: 3, w: 3, sv: 1, perus: true, ml: ["a", "i", "e"],
    d: "Ruisleipää juuston, kinkun ja kurkun kanssa.",
    ing: ["ruisleipä 2 kpl", "voi 1 tl", "juusto 30 g", "kinkku 30 g", "kurkku 0.25 kpl"],
    steps: ["Voitele leivät ja lisää päälle juusto, kinkku ja kurkkuviipaleet."],
  },
  {
    n: "Keitetyt kananmunat ja ruisleipä", m: "e", t: "am", min: 12, w: 3, sv: 1, perus: true, ml: ["a", "i", "e"],
    d: "Kaksi keitettyä kananmunaa ja voideltu ruisleipä.",
    ing: ["kananmuna 2 kpl", "ruisleipä 1 kpl", "voi 1 tl"],
    steps: ["Keitä munat kiehuvassa vedessä 7–9 minuuttia ja jäähdytä ne kylmässä vedessä.", "Tarjoa voidellun ruisleivän kanssa."],
  },
  {
    n: "Raejuusto ja hedelmä", m: "v", t: "vp", min: 3, w: 3, sv: 1, perus: true, ml: ["v", "i", "e"],
    d: "Raejuustoa ja kuutioitua hedelmää. Proteiinipitoinen välipala.",
    ing: ["raejuusto 200 g", "omena 1 kpl"],
    steps: ["Kuutioi hedelmä raejuuston joukkoon."],
  },
  {
    n: "Hedelmä ja pähkinät", m: "v", t: "vp", min: 1, w: 1, sv: 1, perus: true, ml: ["v", "e"],
    d: "Banaani ja kourallinen pähkinöitä. Kulkee taskussa.",
    ing: ["banaani 1 kpl", "pähkinät 0.5 dl"],
    steps: ["Ota mukaan hedelmä ja pähkinät pienessä rasiassa."],
  },
  {
    n: "Eväsleipä", m: "p", t: "vp", min: 5, w: 5, sv: 1, perus: true, ml: ["e", "v"],
    d: "Täytetty sämpylä eväiksi töihin tai kouluun.",
    ing: ["sämpylä 1 kpl", "voi 1 tl", "juusto 30 g", "kinkku 30 g", "kurkku 0.25 kpl"],
    steps: ["Halkaise sämpylä, voitele ja täytä juustolla, kinkulla ja kurkkuviipaleilla.", "Kääri leivinpaperiin tai pakkaa rasiaan."],
  },
  {
    n: "Paahtoleipä ja juusto", m: "v", t: "am", min: 5, w: 5, sv: 1, perus: true, ml: ["a", "i"],
    d: "Paahdettu leipä voin ja juuston kanssa.",
    ing: ["paahtoleipä 2 kpl", "voi 1 tl", "juusto 30 g"],
    steps: ["Paahda leivät, voitele ja lisää juustoviipaleet."],
  },
  {
    n: "Mikropuuro", m: "v", t: "pu", min: 4, w: 3, sv: 1, perus: true, ml: ["a", "i"], aka: ["Pikapuuro"],
    d: "Kaurapuuro mikroaaltouunissa kolmessa minuutissa. Arkiaamun nopein lämmin aamupala.",
    ing: ["kaurahiutaleet 0.75 dl", "maito 1.5 dl", "suola 1 ripaus", "pakastemarjat 50 g"],
    steps: ["Sekoita hiutaleet, maito ja suola isossa kulhossa.", "Kuumenna mikrossa täydellä teholla noin 2 minuuttia, sekoita ja kuumenna vielä puoli minuuttia. Lisää marjat."],
  },
  {
    n: "Rahka ja marjat", m: "v", t: "vp", min: 2, w: 2, sv: 1, perus: true, ml: ["a", "v", "i"],
    d: "Maitorahkaa marjojen ja tilkan hunajaa kanssa. Proteiinipitoinen ja nopea.",
    ing: ["maitorahka 125 g", "pakastemarjat 50 g", "hunaja 1 tl"],
    steps: ["Sekoita rahka ja hunaja ja lisää marjat pinnalle."],
  },
  {
    n: "Näkkileipä ja raejuusto", m: "v", t: "vp", min: 2, w: 2, sv: 1, perus: true, ml: ["a", "v", "i"],
    d: "Näkkileipää, raejuustoa ja kurkkua.",
    ing: ["näkkileipä 2 kpl", "raejuusto 100 g", "kurkku 0.25 kpl"],
    steps: ["Levitä raejuusto näkkileiville ja lisää kurkkuviipaleet."],
  },
  {
    n: "Sämpylä ja kananmuna", m: "e", t: "am", min: 12, w: 3, sv: 1, perus: true, ml: ["a", "e"],
    d: "Voideltu sämpylä ja keitetty kananmuna. Kulkee myös eväänä.",
    ing: ["sämpylä 1 kpl", "voi 1 tl", "kananmuna 1 kpl"],
    steps: ["Keitä muna 8 minuuttia ja jäähdytä.", "Halkaise ja voitele sämpylä."],
  },
];
