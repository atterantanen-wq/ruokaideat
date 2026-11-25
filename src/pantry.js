/* Kaappi: mitä kotoa löytyy, ja ruokaehdotukset sen mukaan.
 * Moduulissa ei ole käyttöliittymää eikä riippuvuuksia sovelluksen tilaan, joten sen voi testata erikseen.
 *
 * Tila (state.kp): { h: [{ k, d }] merkityt ainekset (k = rekisterin avain tai ryhmä "@kana", d = merkintäpäivä),
 *                    no: [avaimet] perusaineet, joita ei ole (oletuksena kaikki perusaineet löytyvät) }
 * Perusaineita (suola, mausteet, öljyt, jauhot…) ei tarvitse merkitä. Tuoretuotteet poistuvat kaapista viikossa. */

/* perusaineet vähän kuluvien (Mausteet ja liemet, öljyt) lisäksi */
export const BASIC_EXTRA = ["vesi", "sipuli", "valkosipulinkynsi", "vehnäjauho", "voi", "sokeri", "liemikuutio", "kasvisliemikuutio", "kanaliemi", "korppujauho", "maissitärkkelys", "leivinjauhe", "siirappi", "soijakastike", "tomaattiketsuppi", "tomaattipyree", "sinappi", "majoneesi", "sitruunamehu"];

/* yrtit ja sitruuna ovat usein vain viimeistelyä: eivät laske puuttuvien määrään, mutta näkyvät erikseen */
export const MINOR = new Set(["persilja", "tilli", "korianteri", "basilika", "ruohosipuli", "minttu", "sitruuna", "lime"]);

/* pikavalinnat: ryhmä kattaa saman raaka-aineen eri muodot */
export const GROUPS = {
  "@jauheliha": ["Jauheliha", ["jauheliha", "sekajauheliha", "paistijauheliha", "kanan jauheliha"], 10],
  "@kana": ["Kana", ["broilerinfilee", "kananrintafilee", "kanansuikaleet", "kanan ylereisi", "kanankoivet", "kanansiivet", "kokonainen kana"], 10],
  "@kala": ["Kalafilee", ["valkoinen kalafile", "turska", "siika"], 12],
  "@makkara": ["Makkara", ["lenkkimakkara", "makkara"], 11],
  "@pasta": ["Pasta", ["pasta", "spagetti", "makaroni"], 2],
  "@riisi": ["Riisi", ["riisi", "täysjyväriisi"], 2],
  "@kerma": ["Kerma", ["ruokakerma", "kuohukerma", "kaurakerma"], 13],
  "@kinkku": ["Kinkku", ["savukinkku", "palvikinkku"], 11],
};
export const QUICK = ["@jauheliha", "@kana", "lohifile", "@kala", "@makkara", "peruna", "@pasta", "@riisi", "kananmuna", "@kerma", "maito", "juustoraaste", "@kinkku", "pekoni", "porkkana", "paprika", "tomaattimurska", "herkkusienet"];

/* tuoretuotteet vanhenevat viikossa; nämä säilyvät pidempään, vaikka ovat tuoreosastoilla */
export const FRESH_DAYS = 7, SOON_DAYS = 2;
const FRESH_DEPS = new Set([0, 1, 10, 11, 12, 13]);
const LONG = new Set(["peruna", "sipuli", "punasipuli", "salottisipuli", "valkosipulinkynsi", "porkkana", "lanttu", "nauris", "palsternakka", "punajuuri", "juuriselleri", "valkokaali", "punakaali", "omena", "sitruuna", "lime", "kananmuna", "voi", "margariini", "inkivääri"]);
export const isFresh = (k, dep) => !LONG.has(k) && FRESH_DEPS.has(GROUPS[k] ? GROUPS[k][2] : dep);

const day = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ""); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) / 864e5 : NaN; };
/* päiviä jäljellä (tuoretuotteet), muuten null */
export function daysLeft(it, today, dep) {
  if (!isFresh(it.k, dep)) return null;
  const age = day(today) - day(it.d);
  return isNaN(age) ? FRESH_DAYS : FRESH_DAYS - age;
}
/* vanhentuneet pois: palauttaa jäljelle jäävät */
export const prune = (h, today, depOf) => h.filter((it) => { const l = daysLeft(it, today, depOf(it.k)); return l == null || l > 0; });

export const keysOf = (k) => (GROUPS[k] ? GROUPS[k][1] : [k]);
export const nameOf = (k) => (GROUPS[k] ? GROUPS[k][0].toLowerCase() : k);
/* kaapin avaimet ainesavaimiksi: Map(aines -> kaapin merkintä) */
export function haveMap(h) {
  const m = new Map();
  for (const it of h) for (const k of keysOf(it.k)) if (!m.has(k)) m.set(k, it.k);
  return m;
}

/* ehdokkaat: [{ id, v, t, tk, need: [avaimet ilman perusaineita], main: [pääraaka-aineet (liha, kala)] }], have = haveMap,
 * t = muunnelma ja tk = muunnelman lisäämät ainekset: muunnelma on ehdokas vain, jos jokin sen lisäämistä aineksista on kaapissa,
 * soon = Set(kaapin merkinnät, jotka vanhenevat pian)
 * palauttaa ruoat, joissa on vähintään yksi kaapin aines: { id, v, t, hit: [merkinnät], miss: [avaimet], minor: [avaimet], soon: [merkinnät], mainMiss, mainHit }
 * Järjestys: pääraaka-aine löytyy, vähiten puuttuvia, eniten pian vanhenevia, pääraaka-aine kaapista, eniten osumia.
 * Samasta ruoasta vain paras versio ja muunnelma; tasapelissä perusresepti. */
export function rank(cands, have, soon = new Set()) {
  const best = new Map();
  for (const c of cands) {
    if (c.t && !(c.tk || []).some((k) => have.has(k))) continue;
    const hit = new Set(), miss = [], minor = [], main = new Set(c.main || []);
    let mainMiss = 0, mainHit = 0;
    for (const k of new Set(c.need)) {
      if (have.has(k)) { hit.add(have.get(k)); if (main.has(k)) mainHit++; }
      else if (MINOR.has(k)) minor.push(k);
      else { miss.push(k); if (main.has(k)) mainMiss++; }
    }
    if (!hit.size) continue;
    const e = { id: c.id, v: c.v || "", t: c.t || "", hit: [...hit], miss, minor, soon: [...hit].filter((k) => soon.has(k)), mainMiss, mainHit };
    const o = best.get(c.id);
    if (!o || cmp(e, o) < 0) best.set(c.id, e);
  }
  return [...best.values()].sort(cmp);
}
function cmp(a, b) {
  return (a.mainMiss > 0) - (b.mainMiss > 0) || a.miss.length - b.miss.length || b.soon.length - a.soon.length || b.mainHit - a.mainHit ||
    b.hit.length - a.hit.length || a.minor.length - b.minor.length || (a.v ? 1 : 0) - (b.v ? 1 : 0) || (a.t ? 1 : 0) - (b.t ? 1 : 0);
}
/* näytettävät kahdessa osassa: near = pääraaka-aine löytyy ja puuttuu enintään 3 (enintään max),
 * more = muut kaapin aineksia käyttävät ruoat, lähimmät ensin (rank-järjestys säilyy) */
export function split(ranked, max = 15) {
  const near = ranked.filter((x) => !x.mainMiss && x.miss.length <= 3).slice(0, max), ns = new Set(near);
  return { near, more: ranked.filter((x) => !ns.has(x)) };
}
