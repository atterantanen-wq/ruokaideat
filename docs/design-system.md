# Design system

Sovelluksen ilme perustuu yhteen sääntökokoelmaan. Kaikki osat näkyvät tyylisivulla `tyylit.html` (kehityksessä `npm run dev` → `/tyylit.html`).

## Tiedostot

| Tiedosto | Sisältö | Muihin projekteihin |
|---|---|---|
| `src/styles/tokens.css` | **Perusta**: fonttikoot, välit, kosketusalueet, liikkeen kestot, Vähennä liikettä -asetus | Kopioidaan sellaisenaan |
| `src/styles/theme.css` | **Teema**: värit (vaalea + tumma), fontit, pyöristykset, varjot | Tehdään uusi |
| `src/styles/main.css` | Komponentit. Vanhat muuttujanimet (`--bg`, `--or`, `--ls`…) on ohjattu tokeneihin tiedoston alussa | – |
| `scripts/check-contrast.mjs` | `npm run contrast`: teeman väriparit WCAG 2.2 AA -rajoja vasten | Kopioidaan |
| `tests/e2e.mjs` | Testi "tyylit: tekstien kontrasti…" mittaa jokaisen näkyvän tekstin molemmissa teemoissa | Mallina |

## Säännöt

1. **Yksi pääväri** (`--c-primary`): kaikki päätoiminnot ja valitut tilat. Osiovärit (`--c-ideas-*`, `--c-plan-*`, `--c-add-*`, `--c-cart-*`) vain alapalkissa ja yläosassa.
2. **Värin merkitys pysyy**: `--c-success` = valmis/onnistui, `--c-danger` = poisto/virhe, `--c-accent` = suosikki. Väri ei ole koskaan ainoa vihje.
3. **Kontrasti**: teksti ≥ 4.5:1, reunat, kuvakkeet ja kohdistusrengas ≥ 3:1, molemmissa teemoissa.
4. **Kosketusalue** ≥ 44 px (`--tap-min`).
5. **Liike** vain palautteeksi: painallus (`--dur-instant`), tilan vaihto (`--dur-fast`), ikkuna ja ilmoitus (`--dur-base`), hypähdys (`--dur-slow`), aina `--ease-out`.
6. **Uusissa tyyleissä vain tokeneita**: ei suoria hex-värejä, pikselikokoja tai kestoja.

Värit on valittu OKLCH-asteikolla; jokaisen hex-arvon vieressä `theme.css`:ssä on sen OKLCH-arvo. Uuden värin saa samaan sarjaan pitämällä L:n (kirkkaus) samana ja vaihtamalla sävyä (h).

Taustatutkimus, nykytilan kartoitus ja hylätyt suunnat: projektin tiedostot `tyyli/raportti.md`.
