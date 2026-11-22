/* Vanhan reseptikirjaston (id:t b0, b1, …) viittausten siirto uuteen kirjastoon.
 * Ajetaan kerran ennen tilan puhdistusta; tunnistetaan kentästä mv (kirjastoversio).
 *  - muokattu vanha resepti muuttuu omaksi ruoaksi, jottei tehty työ katoa
 *  - ostoslistalla oleva vanha resepti, jolle ei ole uutta vastinetta, muuttuu omaksi ruoaksi
 *  - muut viittaukset (suosikit, katselukerrat, lisukevalinnat, annosmäärät) siirtyvät samannimiseen uuteen reseptiin
 *  - viittaukset, joille ei löydy vastinetta, poistuvat */
import { raw, DATA } from "./data/legacy.js";

export const LIB_VERSION = 2;

/* vanhat nimet, jotka vastaavat uutta reseptiä eri nimellä */
export const RENAME = {
  "Lihapullat ja perunamuusi": "Lihapullat",
  "Spagetti ja jauhelihakastike": "Spagetti bolognese",
  "Currykanapata": "Kanacurry",
  "Uunikana ja juurekset": "Uunikana",
  "Kanapasta tomaattikermakastikkeessa": "Broileripasta",
  "Kanaperunakiusaus": "Kanakiusaus",
  "Kalapuikot ja perunamuusi": "Kalapuikot",
  "Uunilohi ja juurekset": "Uunilohi",
  "Kalapata tomaatilla": "Kalapata",
  "Nautapata punaviinillä": "Lihapata",
  "Nautastroganoff": "Stroganoff",
  "Porkkana-inkiväärikeitto": "Porkkanasosekeitto",
  "Uunijuurekset ja fetajuusto": "Uunijuurekset",
  "Karjalanpaisti (Yhteishyvä)": "Karjalanpaisti",
  "Keitetty riisi": "Riisi",
  "Keitetty pasta": "Pasta",
  "Tuore salaatti": "Vihersalaatti",
  "Kurkku-tomaattisalaatti": "Vihersalaatti",
  "Paistetut kalafileet": "Paistetut kuhafileet",
  "Itse tehty pizza": "Pizza",
  "Uunimakkara ja perunat": "Uunimakkara",
  "Täytetyt tortillat": "Tortillat",
};

const nrm = (s) => String(s || "").toLowerCase().replace(/\s+/g, " ").trim();

function legacy() {
  const DL = DATA.split("\n");
  return raw.split("\n").map((l, i) => {
    const [name, m, t, , min, d, sv] = l.split("|");
    const [ing, stp] = (DL[i] || "|").split("|");
    return {
      id: "b" + i, name, m, t, min: +min || 0, d: d || "", sv: +sv || 4,
      ing: ing.split(";").map((x) => x.trim()).filter(Boolean),
      steps: (stp || "").split("/").map((x) => x.trim()).filter(Boolean),
    };
  });
}

const isOld = (id) => typeof id === "string" && /^b\d+$/.test(id);

export function migrateLegacy(x, lib) {
  if (!x || typeof x !== "object" || x.mv >= LIB_VERSION) return x;
  x = JSON.parse(JSON.stringify(x));
  const refs = new Set();
  const lists = Array.isArray(x.lists) ? x.lists : [];
  const cartIds = new Set();
  for (const l of lists) if (l && Array.isArray(l.cart)) l.cart.forEach((i) => { refs.add(i); cartIds.add(i); });
  if (Array.isArray(x.cart)) x.cart.forEach((i) => { refs.add(i); cartIds.add(i); });
  for (const k of ["over", "views", "pair", "sk", "serv", "pv", "img", "tv"]) if (x[k] && typeof x[k] === "object") Object.keys(x[k]).forEach((i) => refs.add(i));
  for (const k of ["fav", "nos", "hidden"]) if (Array.isArray(x[k])) x[k].forEach((i) => refs.add(i));
  if (x.pair && typeof x.pair === "object") for (const v of Object.values(x.pair)) if (v && typeof v === "object") Object.keys(v).forEach((i) => refs.add(i));
  const old = [...refs].filter(isOld);
  if (!old.length) { x.mv = LIB_VERSION; return x; }

  const byOld = new Map(legacy().map((r) => [r.id, r]));
  const byName = new Map(lib.filter((r) => !r.custom).map((r) => [nrm(r.name), r.id]));
  if (!Array.isArray(x.custom)) x.custom = [];
  const map = {};
  let n = 0;
  const mkCustom = (o, over, suffix) => {
    const id = "c" + Date.now().toString(36) + "m" + (n++).toString(36);
    const base = { ...o, ...(over || {}) };
    x.custom.push({
      id, name: (base.name || o.name) + suffix, m: base.m || o.m, mo: base.mo || "", t: base.t || o.t, s: [],
      min: base.min || o.min, w: base.w || 0, d: o.d, ing: base.ing || o.ing, gr: base.gr || [], steps: base.steps || o.steps,
      url: "", wd: base.wd || "", fe: base.fe || "", jf: !!base.jf, kq: base.kq || [], custom: true,
    });
    if (o.sv && o.sv !== 4 && !(x.serv && x.serv[o.id])) (x.serv = x.serv || {})[id] = o.sv;
    return id;
  };
  for (const oid of old) {
    const o = byOld.get(oid);
    if (!o) { map[oid] = null; continue; }
    const target = byName.get(nrm(RENAME[o.name] || o.name)) || null;
    if (x.over && x.over[oid]) map[oid] = mkCustom(o, x.over[oid], target ? " (oma)" : "");
    else if (target) map[oid] = target;
    else if (cartIds.has(oid)) map[oid] = mkCustom(o, null, "");
    else map[oid] = null;
  }
  const to = (i) => (isOld(i) ? map[i] : i);
  const remapList = (a) => [...new Set((a || []).map(to).filter(Boolean))];
  for (const l of lists) if (l && Array.isArray(l.cart)) l.cart = remapList(l.cart);
  if (Array.isArray(x.cart)) x.cart = remapList(x.cart);
  for (const k of ["fav", "nos"]) if (Array.isArray(x[k])) x[k] = remapList(x[k]);
  if (Array.isArray(x.hidden)) x.hidden = x.hidden.filter((i) => !isOld(i));
  if (x.over && typeof x.over === "object") for (const k of Object.keys(x.over)) if (isOld(k)) delete x.over[k];
  const remapObj = (o, merge) => {
    if (!o || typeof o !== "object") return o;
    const r = {};
    for (const [k, v] of Object.entries(o)) {
      const t = to(k);
      if (!t) continue;
      r[t] = r[t] != null && merge ? merge(r[t], v) : v;
    }
    return r;
  };
  x.views = remapObj(x.views, (a, b) => (+a || 0) + (+b || 0));
  x.sk = remapObj(x.sk, (a, b) => (+a || 0) + (+b || 0));
  for (const k of ["serv", "pv", "img"]) x[k] = remapObj(x[k]);
  if (x.tv) x.tv = remapObj(x.tv);
  if (x.pair && typeof x.pair === "object") {
    const p = remapObj(x.pair, (a, b) => ({ ...a, ...b }));
    for (const k of Object.keys(p)) p[k] = remapObj(p[k], (a, b) => (+a || 0) + (+b || 0));
    x.pair = p;
  }
  x.mv = LIB_VERSION;
  return x;
}
