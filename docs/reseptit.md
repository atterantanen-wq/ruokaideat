# Reseptikirjaston ylläpito

Tässä ohjeessa kerrotaan, miten reseptejä lisätään ja muutetaan niin, että ostoslista, hinnat,
ravintoarvot, haku ja valmistusohjeet pysyvät oikein. Kenttien tarkka kuvaus on tiedoston
`src/recipes.js` alussa.

## Tiedostot

| Tiedosto | Sisältö |
|---|---|
| `src/data/library/arki.js` | arkiruoat |
| `src/data/library/keitot.js` | keitot |
| `src/data/library/juhla.js` | juhla- ja sesonkiruoat |
| `src/data/library/kasvis.js` | kasvisruoat |
| `src/data/library/aamu.js` | aamu-, väli- ja iltapalat |
| `src/data/library/leivonta.js` | leivonnaiset ja jälkiruoat |
| `src/data/library/lisukkeet.js` | lisukkeet, joita ruoat ehdottavat (`t: "li"`) |
| `src/data/ingredients.js` | ainesrekisteri: osasto, yksikkömuunnokset ja ravintoarvot (Fineli) |
| `src/main.js` | hinnat (`P`, `P2`, `P3` ja arviot `PA`) |
| `scripts/check-library.mjs` | kirjaston automaattinen tarkistus |

## Tarkistus ennen julkaisua

```bash
npm run check
```

Tarkistus ajetaan myös automaattisesti GitHubissa ennen julkaisua, ja virhe estää julkaisun.
Varoitukset eivät estä, mutta ne kannattaa käydä läpi.

Tarkistus huomaa muun muassa: tuplatunnisteet, puuttuvat lisukkeet, vaiheindeksit, jotka eivät osu
perusreseptiin, poistettavat ainekset, joita ei ole, muunnelmat, jotka muuttavat aineksia mutta eivät
vaiheita, sekä toisensa poissulkevat muunnelmat.

## Nimeäminen

- Nimi kertoo, millainen ruoka on, **jos samalla nimellä tehdään selvästi erilaisia ruokia**:
  *Pehmeä omenapiirakka* ja *Murotaikinainen omenapiirakka*. Yksiselitteiset nimet, kuten
  *Karjalanpaisti*, eivät tarvitse tarkennusta.
- Käytä luontevaa suomenkielistä nimeä. Väliviivamuoto (*Pizza – Kebab*) on varattu sovelluksen
  omille kopioille.
- Kirjoita yleisnimi ja vanhat nimet kenttään `aka`, niin haku löytää reseptin niilläkin:
  `aka: ["Omenapiirakka"]`.
- Reseptin tunniste muodostuu nimestä. Kun sovellus on oikeassa käytössä, nimen vaihtaminen
  muuttaa tunnisteen. Silloin anna vanha tunniste kentässä `id`, jotta suosikit ja ostoslistat säilyvät.

## Versio vai muunnelma?

| | Versio (`vs`) | Muunnelma (`tw`) |
|---|---|---|
| Valinta | aina täsmälleen yksi, ensimmäinen on oletus | nolla tai useampi |
| Milloin | toisensa poissulkevat vaihtoehdot: liemi, täyte, proteiini, pohja | lisäys tai vaihto, joka sopii yhteen muiden kanssa: tulisempi, maidoton, lisää pinaattia |
| Esimerkki | Kalakeitto: maitopohjainen, kermainen, kirkas | Kanakeitto: kermainen, nuudeleilla (voi valita molemmat) |
| Näkyy | sirurivinä otsikon alla | Vinkit ja muunnelmat -osiossa |

- Versioita on oltava vähintään kaksi. Reseptin `ing` sisältää vain kaikille versioille yhteiset
  ainekset, ja jokainen versio tuo omansa `add`-kentässä. Versioiden ainesten otsikko asetetaan
  kentällä `vh` (oletus "Täytteet").
- **Erillinen resepti versioiden sijaan**, kun pohja tai tekotapa on eri ja lähes kaikki vaiheet
  muuttuisivat, tai kun ruoka tunnetaan omalla nimellään (esim. murotaikinapiirakka ja pullapohjainen
  piirakka).
- Jos kaksi muunnelmaa vaihtaa saman aineksen, sovellus ei anna valita niitä yhtä aikaa. Jos tämä on
  tarkoitus, merkitse ne samaan ryhmään (`g: "kerma"`), muuten tee niistä versiot.

## Ainekset muuttuvat → myös vaiheet muuttuvat

Jos versio tai muunnelma lisää, poistaa tai vaihtaa aineksen, valmistusohjeen on muututtava samalla.
Muuten ohje neuvoo käyttämään ainesta, jota ei enää ole.

- `step: { 3: "uusi teksti" }` korvaa vaiheen.
- `ins: [[3, "teksti"]]` lisää vaiheen vaiheen 3 perään. `-1` lisää alkuun.
- `del: [2]` poistaa vaiheen.
- Indeksit viittaavat aina **perusreseptin** vaiheisiin ja alkavat nollasta.
- `rm` poistaa rivin aineksen nimellä (`"maito"`) tai tarkalla rivillä (`"kananmuna 2 kpl"`), jos
  samaa ainesta on useassa kohdassa.

## Ainesrivit

- Muoto on `nimi määrä yksikkö`, esim. `"jauheliha 400 g"`, `"sipuli 1 kpl"`, `"suola 1 ripaus"`.
- Yksiköt: g, kg, dl, l, rkl, tl, kpl, prk, nippu, ruukku, ripaus.
- Tuoreet yrtit ilmoitetaan nippuina tai ruukkuina, ei desilitroina.
- Ainesosioita tehdään riveillä `"# Pohja"`, `"# Täyte"`.
- Ainesnimen pitää löytyä rekisteristä (`src/data/ingredients.js`) nimenä tai synonyymina, muuten
  hinta ja ravintoarvot jäävät laskematta. Tarkista uudet ainekset avaamalla resepti sovelluksessa.
- **Uusi aines**: lisää rivi rekisteriin ja hinta `main.js`:ään. Jos tarkkaa hintaa ei ole, käytä
  arviota `PA("aines", €/yks, "kg", "Nimi")`, jolloin sovellus merkitsee hinnan arvioksi. Älä lisää
  uutta ainesta toisen synonyymiksi, jos se on eri tuote (mansikkahillo ei ole puolukkahilloa),
  koska ostoslistalla näkyy rekisterin nimi.

## Annokset, ajat ja suosio

- `sv` on annosmäärä. **Leivonnaisissa** (`t: "le"`) se on kappaleita tai paloja. Niiden hinta
  näytetään koko erälle, ja määrä valitaan ½, 1 tai 2 eränä. Saman voi ottaa käyttöön muissakin
  erissä tehtävissä resepteissä kentällä `batch: true` (esim. sima). Kenttä `yu` kertoo yksikön,
  esim. `yu: "lasia"` (oletus kpl).
- `min` sisältää myös liotukset, käymisen ja tekeytymisen. Yli vuorokauden odotus näkyy kortissa
  vuorokausina, esim. sima "30 min + 4 vrk".
- `min` on kokonaisaika ja `w` työaika minuutteina. Jos taikina tai ruoka lepää yön yli, kirjoita
  vaiheeseen sanat "yön yli". Silloin kortissa lukee esimerkiksi "1 h + yön yli".
- `pop: true` (Suosittu-merkintä) annetaan, kun resepti on lähdesivustoilla erityisen suosittu,
  karkeasti yli 100 arviota tai tykkäystä tai sivuston suosituimpien joukossa.

## Lisukkeet

- Lisukkeet ovat tiedostossa `lisukkeet.js`, ja niillä on kiinteä tunniste `id: "k-…"`.
- Ruoka ehdottaa lisukkeita kentällä `sides: ["k-perunamuusi", "k-riisi:kookos"]`. Kaksoispisteen
  jälkeen voi antaa version.
- Valmiit tuotteet ehdotetaan kentällä `extras: ["puolukkahillo"]`.

## Lähteet ja tekijänoikeus

- Reseptit kirjoitetaan **omin sanoin**, ja pohjana käytetään useampaa suosittua reseptiä.
  Aineslistat ja määrät eivät ole suojattuja, mutta ohjeiden ja kuvausten lauseita ei kopioida.
- Lähdelinkiksi (`src`) merkitään vain resepti, joka on samaa ruokatyyppiä. Esimerkiksi
  murotaikinapiirakan lähde ei sovi pehmeälle piirakalle.
- Käytetyt sivustot: Valio, Yhteishyvä, Kotikokki, Martat ja Kinuskikissa. K-ruoka estää automaattisen
  haun. Haku sivustokartoista kannattaa tehdä myös vaihtoehtoisilla nimillä (Valiolla piparkakut ovat
  nimellä "Piparkakkutaikina").
- Kehitysvaiheessa teksti on verrattu lähdesivuihin automaattisesti: jos neljän sanan jakso esiintyy
  lähteessä, lause muotoillaan uudelleen. Työkalu ei ole repossa, koska se tarvitsee lähdesivujen
  tekstit, joita ei voi julkaista.

## Ennen julkaisua

1. `npm run check` ja `npm test` (selaintestit: kaikki reseptit, versiot, ostoslista, haku, omat ruoat)
2. `npm run dev` ja selaimessa: avaa muutettu resepti, kokeile jokainen versio ja muunnelma, tarkista
   että ainekset, vaiheet, hinta ja ravintoarvot muuttuvat, ja lisää resepti ostoslistalle.
3. Push `main`-haaraan julkaisee sovelluksen GitHub Pagesiin.
