/* Suunnitelma: seuraavien päivien ruoat ja lisäostokset.
 * Moduulissa ei ole käyttöliittymää eikä riippuvuuksia sovelluksen tilaan, joten sen voi testata erikseen.
 *
 * Tila (state.pl): { n: ruokien määrä, sv: annoksia ruokaa kohden, ba: budjetti €,
 *                    items: [{ id, v, tg: [sirut], lk }],
 *                    sn: { id: annokset } aamu- ja välipalat, bk: [id] leivonta, vo: [pois tältä kerralta] }
 * Vakio-ostokset ovat erikseen (state.vk), koska ne säilyvät listasta toiseen. */

export const TAGS = [
  ["a", "Arki"],
  ["e", "Edullinen"],
  ["k", "Kevyt"],
  ["v", "Kasvis"],
  ["f", "Kala"],
  ["w", "Viikonloppu"],
  ["j", "Juhla"],
];
export const TAG_N = Object.fromEntries(TAGS);

export const defaultPlan = () => ({ n: 4, sv: 4, ba: 0, items: [], sn: {}, bk: [], vo: [] });

/* oletussirut: arkiruokaa; jos viikonloppu on tulossa (ke–la), viimeinen ruoka viikonloppuun */
export function defaultTags(i, n, today = new Date()) {
  const wd = (today.getDay() + 6) % 7;
  if (n >= 3 && i === n - 1 && wd >= 2 && wd <= 5) return ["w"];
  return ["a"];
}

/* ehdokas c: { id, name, t, main, veg, vegV, fish, arki, wknd, juhla, cheap, light, work, cost, fav, pop, recent } */
export function matches(c, tags) {
  for (const t of tags) {
    if (t === "a" && !c.arki) return false;
    if (t === "e" && !c.cheap) return false;
    if (t === "k" && !c.light) return false;
    if (t === "v" && !c.veg) return false;
    if (t === "f" && !c.fish) return false;
    if (t === "w" && !c.wknd) return false;
    if (t === "j" && !c.juhla) return false;
  }
  if (c.holiday && !tags.includes("j")) return false;
  return true;
}

function score(c, others, rnd) {
  let s = rnd() * 1.5;
  if (c.fav) s += 1.2;
  if (c.pop) s += 0.5;
  if (c.recent) s -= 1;
  for (const o of others) {
    if (o.main && o.main === c.main) s -= 1.2;
    if (o.t && o.t === c.t) s -= 0.8;
  }
  return s;
}
/* valitsee ruoan siruilla; others = listan muut ruoat (vaihtelua varten), exclude = id:t, joita ei saa valita */
export function pick(cands, tags, others, rnd = Math.random, exclude = []) {
  const used = new Set(others.map((o) => o.id).concat(exclude));
  let best = null, bs = -Infinity;
  for (const c of cands) {
    if (used.has(c.id) || !matches(c, tags)) continue;
    const s = score(c, others, rnd);
    if (s > bs) { bs = s; best = c; }
  }
  return best;
}
export function ranked(cands, tags, others) {
  const used = new Set(others.map((o) => o.id));
  return cands.filter((c) => !used.has(c.id) && matches(c, tags)).map((c) => [score(c, others, () => 0.5), c]).sort((a, b) => b[0] - a[0]).map((x) => x[1]);
}
/* versio siruihin: kasvis- tai kalaversio, jos ruoka itse ei ole sellainen */
export const versionFor = (c, tags) => (tags.includes("v") && c.vegV) || (tags.includes("f") && c.fishV) || "";

/* täyttää listan: lukitut ja jo valitut säilyvät, puuttuvat valitaan; fresh = arvotaan lukitsemattomat uudelleen */
export function fill(cands, pl, rnd = Math.random, fresh = false, today = new Date()) {
  const byId = new Map(cands.map((c) => [c.id, c]));
  const items = [];
  for (let i = 0; i < pl.n; i++) {
    const old = pl.items[i];
    const tg = old && Array.isArray(old.tg) ? old.tg : defaultTags(i, pl.n, today);
    if (old && old.id && byId.has(old.id) && (old.lk || !fresh)) { items.push({ ...old, tg }); continue; }
    items.push({ tg, id: "", v: "" });
  }
  for (const it of items) {
    if (it.id) continue;
    const others = items.filter((x) => x !== it && x.id).map((x) => byId.get(x.id)).filter(Boolean);
    const c = pick(cands, it.tg, others, rnd);
    if (c) { it.id = c.id; it.v = versionFor(c, it.tg); }
  }
  pl.items = items;
  return items;
}

/* ostoslistalle: ruoat, aamu- ja välipalat sekä leivonta [{ id, v, n }] */
export function shoppingItems(pl, batchOf) {
  const out = new Map();
  const add = (id, v, n) => { if (!id || !(n > 0)) return; const k = id + "|" + (v || ""); const e = out.get(k) || { id, v: v || "", n: 0 }; e.n += n; out.set(k, e); };
  for (const it of pl.items) add(it.id, it.v, pl.sv);
  for (const [id, n] of Object.entries(pl.sn || {})) add(id, "", n);
  for (const id of pl.bk || []) add(id, "", batchOf(id));
  return [...out.values()];
}
