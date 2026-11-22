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
index.html               sivun runko: yläpalkki, välilehdet ja dialogit
public/favicon.svg
src/
  main.js                sovelluslogiikka (tila, haku, ruokalista, ostoslistat, rekisteri, kokkausnäkymä)
  styles/main.css        tyylit, vaalea ja tumma teema
  data/
    recipes.js           valmiit reseptit (raw) ja niiden ainekset (DATA)
    ingredients.js       ainesosarekisteri, Fineli (THL), CC BY 4.0
    stores.js            kauppaketjujen myymälälistat
    logos.js             kauppaketjujen logot
  assets/                yläpalkin kuvat ja logot
```

Reseptien rivimuoto `recipes.js`:ssä on
`nimi|pääraaka-aine|ruokalaji|tägit|aika (min)|kuvaus|annokset`, ja `DATA`:ssa on jokaisen reseptin ainekset
samalla rivillä `;`-erotettuina.

## Tallennus

Tiedot (omat ruoat, ostoslistat, suosikit, hinnat, teema) tallentuvat selaimen `localStorage`-avaimeen
`ruokaideat-v1`. Kun sovellus ajetaan Claude-artifactina, se synkronoi tiedot lisäksi artifactin
tietokantaan ja käyttää artifactin kuva- ja lataustoimintoja; tavallisessa selaimessa nämä ohitetaan
automaattisesti.

Tiedot siirtyvät artifactista tähän versioon varmuuskopiolla: **Oma sivu → Varmuuskopio → Tallenna**
artifactissa ja **Palauta** tässä sovelluksessa.

## Julkaisu

`.github/workflows/deploy.yml` rakentaa ja julkaisee sovelluksen GitHub Pagesiin, kun `main`-haaraan
pusketaan. Ota Pages käyttöön repon asetuksista: *Settings → Pages → Source: GitHub Actions*.

## Lähteet

- Ravintoarvot: [Fineli](https://fineli.fi), THL, CC BY 4.0
- Hinnat: S-kaupat.fi, suuntaa antavia (tarkistuspäivä näkyy aineksen tiedoissa)
