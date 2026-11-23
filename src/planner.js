/* Viikkosuunnitelma: kotitalous, päivätyypit, annosmäärät ja ehdotusten valinta.
 * Moduulissa ei ole käyttöliittymää eikä riippuvuuksia sovelluksen tilaan, joten sen voi testata erikseen.
 *
 * Kotitalous (state.hh):  { m: [{ id, n: nimi, c: lapsi (½ annosta), w: [7 päivätyyppiä, ma–su] }] }
 * Suunnitelma (state.pl): { days: ["2026-11-24", …], ml: ["p", …], bm: "d" | "w" | "m", ba: €, wk: arjen
 *                           enimmäistyöaika min, veg, ov: { päivä: { jäsen: päivätyyppi } },
 *                           s: { "päivä|ateria": { id, v, lk } | { lo: 1 } } }
 *   lo = tähteet edellisen päivän päivällisestä, lk = lukittu */

export const MEALS = [
  ["a", "Aamupala"],
  ["l", "Lounas"],
  ["v", "Välipala"],
  ["p", "Päivällinen"],
  ["i", "Iltapala"],
];
export const MEAL_N = Object.fromEntries(MEALS);

/* päivätyypit: k = syö kotona, e = eväs mukaan, - = ei syö kotona */
export const DAYTYPES = [
  { id: "koti", n: "Kotona", s: "Kotona", m: { a: "k", l: "k", v: "k", p: "k", i: "k" } },
  { id: "eta", n: "Etäpäivä", s: "Etä", m: { a: "k", l: "k", v: "k", p: "k", i: "k" } },
  { id: "evas", n: "Eväät töihin", s: "Eväät", m: { a: "k", l: "e", v: "-", p: "k", i: "k" } },
  { id: "ravintola", n: "Lounasravintola", s: "Ravintola", m: { a: "k", l: "-", v: "-", p: "k", i: "k" } },
  { id: "ilta", n: "Iltavuoro", s: "Ilta", m: { a: "k", l: "k", v: "e", p: "-", i: "k" } },
  { id: "pk", n: "Päiväkoti tai koulu", s: "Päiväkoti", m: { a: "-", l: "-", v: "-", p: "k", i: "k" } },
  { id: "pois", n: "Poissa", s: "Poissa", m: { a: "-", l: "-", v: "-", p: "-", i: "-" } },
];
export const DT = Object.fromEntries(DAYTYPES.map((t) => [t.id, t]));

/* aterioiden osuus päivän budjetista */
const MEAL_W = { a: 0.15, l: 0.22, v: 0.08, p: 0.45, i: 0.1 };
export const WEEKDAYS = ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"];

export const defaultHH = () => ({ m: [{ id: "m1", n: "Aikuinen", c: false, w: ["koti", "koti", "koti", "koti", "koti", "koti", "koti"] }] });
export const defaultPlan = () => ({ days: [], ml: ["p"], bm: "d", ba: 0, wk: 45, veg: false, ov: {}, s: {} });

/* ---------------- päivämäärät ---------------- */
export const isoOf = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const dateOf = (iso) => new Date(iso + "T12:00:00");
export const addDays = (iso, n) => { const d = dateOf(iso); d.setDate(d.getDate() + n); return isoOf(d); };
/* 0 = maanantai */
export const wdOf = (iso) => (dateOf(iso).getDay() + 6) % 7;
export const isWorkday = (iso) => wdOf(iso) < 5;
export const nextDays = (from, n) => Array.from({ length: n }, (_, i) => addDays(from, i));

/* ---------------- kotitalous ja annokset ---------------- */
export function typeOf(hh, pl, m, iso) {
  const o = pl.ov && pl.ov[iso] && pl.ov[iso][m.id];
  return DT[o] || DT[m.w[wdOf(iso)]] || DT.koti;
}
/* annokset aterialle: aikuinen 1, lapsi ½; e (eväs) lasketaan mukaan */
export function eaters(hh, pl, iso, meal) {
  let n = 0;
  const who = [];
  for (const m of hh.m) {
    const v = typeOf(hh, pl, m, iso).m[meal];
    if (v === "k" || v === "e") { n += m.c ? 0.5 : 1; who.push({ m, v }); }
  }
  return { n, who };
}
const inPlan = (pl, iso, meal) => pl.days.includes(iso) && pl.ml.includes(meal);
/* seuraavan päivän lounas syödään tämän päivän päivällisen tähteistä */
export function leftoverFor(pl, hh, iso) {
  const nx = addDays(iso, 1);
  if (!inPlan(pl, nx, "l")) return 0;
  const s = pl.s[nx + "|l"];
  if (s && !s.lo) return 0;
  return eaters(hh, pl, nx, "l").n;
}
/* lounas on tähteitä, jos edellisenä päivänä on suunniteltu päivällinen */
export const lunchIsLeftover = (pl, iso) => {
  const s = pl.s[iso + "|l"];
  const pv = addDays(iso, -1);
  return (!s || s.lo) && inPlan(pl, pv, "p") && !!(pl.s[pv + "|p"] && pl.s[pv + "|p"].id);
};
/* annokset, jotka tehdään: päivällisellä mukana seuraavan päivän lounaan tähteet */
export function portions(pl, hh, iso, meal) {
  const base = eaters(hh, pl, iso, meal).n;
  if (meal === "p" && base > 0) return base + leftoverFor(pl, hh, iso);
  return base;
}

/* ---------------- budjetti ---------------- */
export function dayBudget(pl) {
  if (!(pl.ba > 0) || pl.bm === "m") return 0;
  return pl.bm === "w" ? pl.ba / 7 : pl.ba;
}
/* aterian tavoitehinta annosta kohden */
export function targetPer(pl, hh, iso, meal) {
  if (!(pl.ba > 0)) return 0;
  if (pl.bm === "m") return pl.ba;
  const sel = pl.ml.filter((m) => eaters(hh, pl, iso, m).n > 0);
  const wsum = sel.reduce((a, m) => a + MEAL_W[m], 0) || 1;
  let w = MEAL_W[meal] / wsum;
  /* päivällisen budjettiin kuuluu seuraavan päivän tähdelounas */
  if (meal === "p" && leftoverFor(pl, hh, iso) > 0) {
    const nx = addDays(iso, 1), sel2 = pl.ml.filter((m) => eaters(hh, pl, nx, m).n > 0);
    const w2 = sel2.reduce((a, m) => a + MEAL_W[m], 0) || 1;
    w += MEAL_W.l / w2;
  }
  const n = portions(pl, hh, iso, meal) || 1;
  return (dayBudget(pl) * w) / n;
}

/* ---------------- ehdotukset ----------------
 * c = ehdokas: { id, name, pool: Set(aterian kohdat), main, veg, work, min, cost (€/annos), fav, pop,
 *                perus, jf, recent, eva (sopii eväiksi), vegV (kasvisversion id) } */
function score(c, ctx, iso, meal, used, prev, rnd) {
  const { pl, hh } = ctx;
  const workday = isWorkday(iso);
  let s = rnd() * 1.2;
  if (c.fav) s += 1.2;
  if (c.pop) s += 0.4;
  if (c.recent) s -= 1;
  const k = used.get(c.id) || 0;
  if (meal === "p" || meal === "l") { if (k) return null; }
  else { if (k >= 2) return null; s -= k * 0.8; }
  if (meal === "p") {
    if (prev[0] && prev[0] === c.main) s -= 1.6;
    if (prev[1] && prev[1] === c.main) s -= 0.5;
    if (c.jf && workday) return null;
  }
  if (meal === "l") {
    const ev = eaters(hh, pl, iso, "l").who;
    if (ev.length && ev.every((x) => x.v === "e") && !c.eva) s -= 1.2;
  }
  const t = targetPer(pl, hh, iso, meal);
  if (t > 0 && c.cost > 0) {
    if (pl.bm === "m" && c.cost > t) return null;
    s += c.cost > t ? -(c.cost / t - 1) * 3 : (1 - c.cost / t) * 0.4;
  }
  return s;
}
function fits(c, ctx, iso, meal) {
  const { pl } = ctx;
  if (!c.pool.has(meal)) return false;
  if (pl.veg && !c.veg) return false;
  const workday = isWorkday(iso);
  if (meal === "p" || meal === "l") {
    const wk = pl.wk > 0 ? pl.wk : 999;
    const lim = meal === "l" ? Math.min(wk, 30) : wk;
    if (workday && c.work > lim) return false;
    if (workday && c.min > lim + 90) return false;
  } else if (workday && c.work > 15) return false;
  return true;
}
/* valitsee yhden ehdokkaan; exclude = id:t, joita ei saa valita (vaihda-painike) */
export function pick(cands, ctx, iso, meal, used, prev, rnd = Math.random, exclude = []) {
  let best = null, bs = -Infinity;
  for (const c of cands) {
    if (exclude.includes(c.id) || !fits(c, ctx, iso, meal)) continue;
    const s = score(c, ctx, iso, meal, used, prev, rnd);
    if (s != null && s > bs) { bs = s; best = c; }
  }
  return best;
}
/* järjestetty ehdokaslista (Valitse itse) */
export function ranked(cands, ctx, iso, meal, used, prev) {
  const out = [];
  for (const c of cands) {
    if (!fits(c, ctx, iso, meal)) continue;
    const s = score(c, ctx, iso, meal, new Map(), prev, () => 0.5);
    if (s != null) out.push([s - (used.get(c.id) || 0) * 0.5, c]);
  }
  return out.sort((a, b) => b[0] - a[0]).map((x) => x[1]);
}

/* tekee suunnitelman: lukitut säilyvät, muut valitaan uudelleen */
export function generate(cands, ctx, rnd = Math.random) {
  const { pl, hh } = ctx;
  const byId = new Map(cands.map((c) => [c.id, c]));
  const days = [...pl.days].sort();
  const s = {};
  for (const [k, v] of Object.entries(pl.s)) if (v && v.lk && days.includes(k.split("|")[0])) s[k] = v;
  const used = new Map();
  for (const v of Object.values(s)) if (v.id) used.set(v.id, (used.get(v.id) || 0) + 1);
  const mains = [];
  pl.s = s;
  for (const iso of days) {
    for (const [meal] of MEALS) {
      if (!pl.ml.includes(meal)) continue;
      const key = iso + "|" + meal;
      if (s[key]) { if (meal === "p" && s[key].id) mains.push((byId.get(s[key].id) || {}).main); continue; }
      if (eaters(hh, pl, iso, meal).n <= 0) continue;
      if (meal === "l" && lunchIsLeftover(pl, iso)) { s[key] = { lo: 1 }; continue; }
      const prev = meal === "p" ? [mains[mains.length - 1], mains[mains.length - 2]] : [];
      const c = pick(cands, ctx, iso, meal, used, prev, rnd);
      if (!c) continue;
      s[key] = pl.veg && c.vegV ? { id: c.id, v: c.vegV } : { id: c.id };
      used.set(c.id, (used.get(c.id) || 0) + 1);
      if (meal === "p") mains.push(c.main);
    }
  }
  return s;
}

/* suunnitelman reseptit ostoslistalle: [{ id, v, n }] samat yhdistettynä */
export function shoppingItems(pl, hh) {
  const out = new Map();
  for (const iso of pl.days) for (const [meal] of MEALS) {
    if (!pl.ml.includes(meal)) continue;
    const s = pl.s[iso + "|" + meal];
    if (!s || !s.id) continue;
    const n = portions(pl, hh, iso, meal);
    if (n <= 0) continue;
    const k = s.id + "|" + (s.v || "");
    const e = out.get(k) || { id: s.id, v: s.v || "", n: 0 };
    e.n += n;
    out.set(k, e);
  }
  return [...out.values()];
}
