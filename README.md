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
  main.js                  sisäänkäynti: tyylit, moduulit ja kehitystilan apu testeille (window.__app)
  app/                     sovelluslogiikka moduuleina, suoritusjärjestyksessä:
    core.js                perusvakiot, kuvakkeet, apufunktiot ja reseptikirjasto
    prices.js              hintatiedot
    catalog.js             ainesosarekisteri (Fineli), ravintoarvot, reseptien hinnat, versiot ja muunnelmat
    state.js               tila, tallennus ja etäsynkka
    ideas.js               ruokalista: tägit, lisukkeet, kuvat ja suodatinsirut
    search.js              haku, ruokakortit ja hakuikkuna
    price-updates.js       hintatäydennykset ja arviohinnat
    cart.js                ostoslistan laskenta: kaupat, osastot, muut tuotteet ja pakkaukset
    cart-add.js            ruoan lisääminen ostoslistalle
    cart-view.js           ostoslistanäkymä
    info.js                ruoan tietoikkuna ja hinnat
    tabs.js                välilehdet
    registry.js            ainesosarekisterin näkymä
    editor.js              oman ruoan lisäys ja muokkaus
    clicks.js              yhteiset klikkaukset
    backup.js              varmuuskopio
    cook.js                kokkausnäkymä
    start.js               käynnistys
    plan-view.js           Suunnitelma-välilehden näkymä ja kaapin tarkistus
  recipes.js               reseptikirjaston muunnos sekä versioiden ja muunnelmien käsittely
  planner.js               Suunnitelma-välilehden logiikka: ruokaehdotukset siruilla ja lisäostokset
  styles/main.css          tyylit, vaalea ja tumma teema
  data/
    library/*.js           reseptikirjasto (arki, keitot, juhla, kasvis, aamu, leivonta, lisukkeet)
    ingredients.js         ainesosarekisteri, Fineli (THL), CC BY 4.0
    stores.js              kauppaketjujen myymälälistat
    logos.js               kauppaketjujen logot
  assets/                  yläpalkin kuvat ja logot
scripts/check-library.mjs  reseptikirjaston tarkistus (npm run check)
tests/e2e.mjs              selaintestit (npm test)
docs/reseptit.md           ohje reseptien lisäämiseen ja muuttamiseen
```

Moduulit `src/app/` suoritetaan yllä olevassa järjestyksessä: jokaisen moduulin ensimmäinen import on
edeltävä moduuli, ja `main.js` tuo ketjun viimeisen (`plan-view.js`). Uusi moduuli lisätään ketjuun samalla
tavalla. Toisen moduulin `let`-muuttujaa ei voi asettaa suoraan, joten sille on omistajamoduulissa
asetusfunktio (esim. `setState`, `setPick`).

Reseptien lisäämisestä ja muuttamisesta kerrotaan tarkemmin tiedostossa [docs/reseptit.md](docs/reseptit.md).

Kirjaston tarkistus:

```bash
npm run check
```

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
