# Mitä tänään syödään?

Ruokaideasovellus: valmiit reseptit suodattimineen, omat ruoat, ostoslistat kauppakohtaisella
osastojärjestyksellä, hinta-arviot ja ravintoarvot (Fineli). Toimii selaimessa, mobiili edellä.

## Käynnistys

```bash
npm install
```

```bash
npm run dev
```

Tuotantoversio rakennetaan kansioon `dist/`:

```bash
npm run build
```

```bash
npm run preview
```

## Rakenne

```
index.html                 sivun runko: yläpalkki, välilehdet ja dialogit
public/favicon.svg
src/
  main.js                  sovelluslogiikka (tila, haku, ruokalista, ostoslistat, rekisteri, hinnat, kokkausnäkymä)
  recipes.js               reseptikirjaston muunnos sekä versioiden ja muunnelmien käsittely
  planner.js               Suunnitelma-välilehti: ruokaehdotukset siruilla ja lisäostokset
  styles/main.css          tyylit, vaalea ja tumma teema
  data/
    library/*.js           reseptikirjasto (arki, keitot, juhla, kasvis, aamu, leivonta, lisukkeet)
    ingredients.js         ainesosarekisteri, Fineli (THL), CC BY 4.0
    prices.js              ainesten hinnat (S-kaupat.fi) tarkistuspäivineen
    stores.js              kauppaketjujen myymälälistat
    logos.js               kauppaketjujen logot
  assets/                  yläpalkin kuvat ja logot
scripts/check-library.mjs  reseptikirjaston tarkistus (npm run check)
scripts/check-prices.mjs   arvioidut ja vanhentuneet hinnat (npm run prices)
tests/e2e.mjs              selaintestit (npm test)
docs/reseptit.md           ohje reseptien lisäämiseen ja muuttamiseen
```

Reseptien lisäämisestä ja muuttamisesta kerrotaan tarkemmin tiedostossa [docs/reseptit.md](docs/reseptit.md).

Kirjaston tarkistus:

```bash
npm run check
```

Hinnat ovat tiedostossa `src/data/prices.js`, ja jokaisella hinnalla on tarkistuspäivä. Sovellus näyttää
päivän aineksen hintatiedoissa ja varoittaa yli 6 kuukautta vanhasta hinnasta. Tarkistuslista arvioista ja
yli 60 päivää vanhoista hinnoista linkkeineen:

```bash
npm run prices              # oma raja: npm run prices -- --days 30, kaikki: -- --all
```

Päivitä hinta lisäämällä tiedoston loppuun `PV("avain", hinta, "lähde", "huomautus", "VVVV-KK-PP")` -rivi.

Selaintestit (käynnistävät kehityspalvelimen ja käyvät läpi kaikki reseptit, ostoslistan, haun ja omat ruoat):

```bash
npm test
```

Testit ajetaan GitHubissa jokaisen pushin yhteydessä, ja `main`-haarassa ne ajetaan ennen julkaisua.

## Tallennus

Tiedot (omat ruoat, ostoslistat, suosikit, hinnat, teema) tallentuvat selaimen `localStorage`-avaimeen
`ruokaideat-v1`. Kun sovellus ajetaan Claude-artifactina, se synkronoi tiedot lisäksi artifactin
tietokantaan ja käyttää artifactin kuva- ja lataustoimintoja; tavallisessa selaimessa nämä ohitetaan
automaattisesti.

Tiedot siirtyvät artifactista tähän versioon varmuuskopiolla: **Oma sivu → Varmuuskopio → Tallenna**
artifactissa ja **Palauta** tässä sovelluksessa.

## Julkaisu

`.github/workflows/deploy.yml` tarkistaa reseptikirjaston, rakentaa ja julkaisee sovelluksen GitHub Pagesiin, kun `main`-haaraan
pusketaan. Ota Pages käyttöön repon asetuksista: *Settings → Pages → Source: GitHub Actions*.

## Lähteet

- Ravintoarvot: [Fineli](https://fineli.fi), THL, CC BY 4.0
- Hinnat: S-kaupat.fi, suuntaa antavia (tarkistuspäivä näkyy aineksen tiedoissa)
