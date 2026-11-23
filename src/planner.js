/* Viikkosuunnitelma: kokkauskerrat, tähteet, annokset ja ehdotukset.
 * Moduulissa ei ole käyttöliittymää eikä riippuvuuksia sovelluksen tilaan, joten sen voi testata erikseen.
 *
 * Periaatteet
 *  - Samaa ruokaa ei syödä kahdesti samana päivänä.
 *  - Kokattu ruoka riittää enintään kahdelle päivälle (lounas tai päivällinen kerran päivässä).
 *    Hyvin säilyvä ruoka voi riittää vielä kolmannen päivän lounaaksi, jos asetus mx = 3.
 *  - Viikonlopun päivälliset tehdään aina erikseen; ne voivat riittää seuraavan päivän lounaaksi.
 *  - Kokattavassa satsissa on vähintään MIN_BATCH annosta.
 *  - Arkiaamuina ei kokata: aamu- ja välipalat ovat viikon valikoima, jonka määrät lasketaan syöjistä.
 *
 * Kotitalous (state.hh): { a: aikuiset, c: lapset (½ annosta), lu: arkilounaat kotona tai eväinä / päivä,
 *                          ab: arkiaamupalat kotona / päivä, vn: välipaloja tai iltapaloja / päivä }
 * Suunnitelma (state.pl): { days, bm: "d" | "w" | "m", ba: €, wk: arjen työaika min (0 = ei rajaa), veg,
 *                           mx: 2 | 3, wb: viikonloppuaamiainen kokataan, ab: [aamupalavalikoima],
 *                           vb: [välipalavalikoima], ov: { päivä: { lu, nd, nc } },
 *                           s: { "päivä|p" | "päivä|l" | "päivä|a": { id, v, lk } } } */

export const MIN_BATCH = 4;
export const WEEKDAYS = ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"];

export const defaultHH = () => ({ a: 2, c: 0, lu: 1, ab: 2, vn: 0 });
export const defaultPlan = () => ({ days: [], bm: "d", ba: 0, wk: 45, veg: false, mx: 2, wb: true, ab: [], vb: [], ov: {}, s: {} });

/* ---------------- päivämäärät ---------------- */
export const isoOf = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const dateOf = (iso) => new Date(iso + "T12:00:00");
export const addDays = (iso, n) => { const d = dateOf(iso); d.setDate(d.getDate() + n); return isoOf(d); };
/* 0 = maanantai */
export const wdOf = (iso) => (dateOf(iso).getDay() + 6) % 7;
export const isWeekend = (iso) => wdOf(iso) >= 5;
export const nextDays = (from, n) => Array.from({ length: n }, (_, i) => addDays(from, i));
const dayDiff = (a, b) => Math.round((dateOf(b) - dateOf(a)) / 864e5);

/* ---------------- syöjät ---------------- */
export const everyone = (hh) => hh.a + hh.c * 0.5;
const ovOf = (pl, iso) => (pl.ov && pl.ov[iso]) || {};
export function lunchN(pl, hh, iso) {
  const o = ovOf(pl, iso);
  if (o.lu != null) return o.lu;
  return isWeekend(iso) ? everyone(hh) : hh.lu;
}
export const dinnerN = (pl, hh, iso) => (ovOf(pl, iso).nd ? 0 : everyone(hh));
export const breakfastN = (pl, hh, iso) => (isWeekend(iso) ? everyone(hh) : hh.ab);
export const snackN = (pl, hh) => hh.vn || 0;

/* kuinka monena päivänä ruoka on hyvä syödä: keitot, padat, laatikot ja kastikkeet 3, kala ja pasta 2,
 * pizza, hampurilaiset ja wokit 1 */
export function keepDays(c) {
  if (c.keep) return c.keep;
  if (["pi", "ha", "wo"].includes(c.t)) return 1;
  if (c.main === "f" || ["ps", "pn", "sa"].includes(c.t)) return 2;
  return 3;
}

/* ---------------- budjetti ---------------- */
export function dayBudget(pl) {
  if (!(pl.ba > 0) || pl.bm === "m") return 0;
  return pl.bm === "w" ? pl.ba / 7 : pl.ba;
}
/* lounaan ja päivällisen tavoitehinta annosta kohden: noin 75 % päivän budjetista */
export function targetPer(pl, hh, iso) {
  if (!(pl.ba > 0)) return 0;
  if (pl.bm === "m") return pl.ba;
  const n = lunchN(pl, hh, iso) + dinnerN(pl, hh, iso) || everyone(hh) || 1;
  return (dayBudget(pl) * 0.75) / n;
}

/* ---------------- ehdotusten pisteytys ----------------
 * c = ehdokas: { id, name, t, pool: Set("p" päivällinen, "l" lounas, "q" nopea lounas, "a" aamiainen),
 *                main, veg, vegV, work, min, cost (€/annos), fav, pop, jf, recent, keep } */
function fits(c, pl, iso, kind) {
  if (pl.veg && !c.veg) return false;
  const we = isWeekend(iso), wk = pl.wk > 0 ? pl.wk : 999;
  if (kind === "cook") {
    if (!c.pool.has("p")) return false;
    if (!we && (c.work > wk || c.min > wk + 90)) return false;
    if (!we && c.jf) return false;
  } else if (kind === "quick") {
    if (!c.pool.has("q")) return false;
  } else if (kind === "brunch") {
    if (!c.pool.has("a") || c.work > 40) return false;
  }
  return true;
}
function score(c, pl, hh, iso, kind, avoid, rnd) {
  let s = rnd() * 1.2;
  if (c.fav) s += 1.2;
  if (c.pop) s += 0.4;
  if (c.recent) s -= 1;
  if (kind === "cook") {
    if (avoid.ids.has(c.id)) return null;
    if (avoid.mains.has(c.main)) s -= 1.5;
    /* ruokalajien vaihtelu: ei samaa lajia peräkkäin, toistot viikon sisällä vähentävät pisteitä */
    if (avoid.types) { s -= (avoid.types.get(c.t) || 0) * 0.8; if (avoid.lastT && avoid.lastT === c.t) s -= 1.5; }
    /* arkena hyvin säilyvät ruoat vähentävät kokkaamista */
    if (!isWeekend(iso)) s += (Math.min(keepDays(c), pl.mx) - 1) * 0.5;
    const t = targetPer(pl, hh, iso);
    if (t > 0 && c.cost > 0) {
      if (pl.bm === "m" && c.cost > t) return null;
      s += c.cost > t ? -(c.cost / t - 1) * 3 : (1 - c.cost / t) * 0.4;
    }
  } else {
    if (avoid.ids.has(c.id)) s -= 1.5;
    if (kind === "quick" && c.perus) s += 1;
  }
  return s;
}
export function pick(cands, pl, hh, iso, kind, avoid, rnd = Math.random, exclude = []) {
  let best = null, bs = -Infinity;
  for (const c of cands) {
    if (exclude.includes(c.id) || !fits(c, pl, iso, kind)) continue;
    const s = score(c, pl, hh, iso, kind, avoid, rnd);
    if (s != null && s > bs) { bs = s; best = c; }
  }
  return best;
}
export function ranked(cands, pl, hh, iso, kind, avoid) {
  const out = [];
  for (const c of cands) {
    if (!fits(c, pl, iso, kind)) continue;
    const s = score(c, pl, hh, iso, kind, avoid, () => 0.5);
    if (s != null) out.push([s, c]);
  }
  return out.sort((a, b) => b[0] - a[0]).map((x) => x[1]);
}

/* ---------------- aikataulu ----------------
 * Käy päivät läpi järjestyksessä. Jokaiselle aterialle käytetään ensin aiemmin kokattua ruokaa, jos sitä
 * saa vielä syödä eikä sitä ole syöty jo samana päivänä; muuten kokataan (päivällinen ja viikonlopun lounas)
 * tai otetaan nopea lounas (arkilounas). pickFn(key, kind, iso, avoid) palauttaa ehdokkaan tai null.
 * Tulos: { days: { iso: { l, p, a } }, cooks: [{ key, iso, slot, id, v, n, covers: [{ iso, slot, n }] }] } */
export function schedule(pl, hh, byId, pickFn) {
  const days = [...pl.days].sort();
  const out = { days: {}, cooks: [] };
  const active = [];
  const recentMains = [];
  for (const iso of days) {
    const day = (out.days[iso] = {});
    const usedToday = new Set();
    const o = ovOf(pl, iso);
    const alive = (f, slot) => {
      const age = dayDiff(f.iso, iso);
      if (age <= 0 || usedToday.has(f.id)) return false;
      if (age < f.span) return true;
      /* hyvin säilyvä ruoka kolmannen päivän lounaaksi */
      return pl.mx >= 3 && f.span >= 2 && age === 2 && f.keep >= 3 && slot === "l";
    };
    const leftover = (slot) => {
      const c = active.filter((f) => alive(f, slot)).sort((a, b) => a.iso.localeCompare(b.iso));
      return c[0] || null;
    };
    const cook = (slot, n, kind) => {
      const key = iso + "|" + slot;
      const ck = out.cooks.filter((f) => f.kind === "cook");
      const types = new Map();
      for (const f of ck) types.set(f.t, (types.get(f.t) || 0) + 1);
      const avoid = { ids: new Set(out.cooks.map((f) => f.id).concat([...usedToday])), mains: new Set(recentMains.slice(-2)), types, lastT: ck.length ? ck[ck.length - 1].t : "" };
      const c = pickFn(key, kind, iso, avoid);
      if (!c) return null;
      const keep = keepDays(c);
      const span = kind === "cook" ? Math.min(keep, pl.mx >= 3 ? 2 : pl.mx) : 1;
      const f = { key, iso, slot, id: c.id, v: c.v || "", keep, span, n: 0, covers: [], main: c.main, t: c.t, kind };
      out.cooks.push(f);
      if (kind === "cook") { active.push(f); recentMains.push(c.main); }
      return f;
    };
    const eat = (f, slot, n) => { f.covers.push({ iso, slot, n }); f.n += n; usedToday.add(f.id); };

    /* lounas */
    const ln = lunchN(pl, hh, iso);
    if (ln > 0) {
      const f = leftover("l");
      if (f) { eat(f, "l", ln); day.l = { type: "lo", f, n: ln }; }
      else if (isWeekend(iso) && !o.nc) { const g = cook("l", ln, "cook"); if (g) { eat(g, "l", ln); day.l = { type: "cook", f: g, n: ln }; } else day.l = { type: "none", n: ln }; }
      else { const g = cook("l", ln, "quick"); if (g) { eat(g, "l", ln); day.l = { type: "quick", f: g, n: ln }; } else day.l = { type: "none", n: ln }; }
    }
    /* päivällinen: viikonloppuna aina erikseen */
    const dn = dinnerN(pl, hh, iso);
    if (dn > 0) {
      const f = isWeekend(iso) && !o.nc ? null : leftover("p");
      if (f) { eat(f, "p", dn); day.p = { type: "lo", f, n: dn }; }
      else if (o.nc) { const g = cook("p", dn, "quick"); if (g) { eat(g, "p", dn); day.p = { type: "quick", f: g, n: dn }; } else day.p = { type: "none", n: dn }; }
      else { const g = cook("p", dn, "cook"); if (g) { eat(g, "p", dn); day.p = { type: "cook", f: g, n: dn }; } else day.p = { type: "none", n: dn }; }
    }
    /* viikonloppuaamiainen */
    if (isWeekend(iso) && pl.wb && breakfastN(pl, hh, iso) > 0) {
      const g = cook("a", breakfastN(pl, hh, iso), "brunch");
      if (g) { eat(g, "a", breakfastN(pl, hh, iso)); day.a = { type: "cook", f: g, n: breakfastN(pl, hh, iso) }; }
    }
    /* vanhentuneet pois */
    for (let i = active.length - 1; i >= 0; i--) if (dayDiff(active[i].iso, iso) >= Math.max(active[i].span, pl.mx >= 3 ? 3 : 0)) active.splice(i, 1);
  }
  /* kokattavassa satsissa vähintään MIN_BATCH annosta */
  for (const f of out.cooks) f.batch = f.kind === "cook" ? Math.max(MIN_BATCH, f.n) : f.n;
  return out;
}

/* tekee suunnitelman: lukitut säilyvät, muut valitaan uudelleen */
export function generate(cands, pl, hh, rnd = Math.random) {
  const keep = {};
  for (const [k, v] of Object.entries(pl.s)) if (v && v.lk && pl.days.includes(k.split("|")[0])) keep[k] = v;
  pl.s = keep;
  return fill(cands, pl, hh, rnd);
}
/* täydentää puuttuvat valinnat ja poistaa ne, joita aikataulu ei enää käytä (lukitut säilyvät) */
export function fill(cands, pl, hh, rnd = Math.random) {
  const byId = new Map(cands.map((c) => [c.id, c]));
  const used = new Set();
  schedule(pl, hh, byId, (key, kind, iso, avoid) => {
    used.add(key);
    const cur = pl.s[key];
    if (cur && byId.has(cur.id)) return { ...byId.get(cur.id), v: cur.v };
    const c = pick(cands, pl, hh, iso, kind, avoid, rnd);
    if (!c) return null;
    pl.s[key] = pl.veg && c.vegV ? { id: c.id, v: c.vegV } : { id: c.id };
    return { ...c, v: pl.s[key].v };
  });
  for (const k of Object.keys(pl.s)) if (!used.has(k) && !pl.s[k].lk) delete pl.s[k];
  return pl.s;
}
/* aikataulu tallennetuista valinnoista (ei uusia valintoja) */
export function current(cands, pl, hh) {
  const byId = new Map(cands.map((c) => [c.id, c]));
  return schedule(pl, hh, byId, (key) => {
    const cur = pl.s[key];
    return cur && byId.has(cur.id) ? { ...byId.get(cur.id), v: cur.v } : null;
  });
}

/* aamu- ja välipalavalikoima: kokonaisannokset jaetaan valittujen kesken */
export function stapleTotals(pl, hh, sch) {
  let ab = 0, vb = 0;
  for (const iso of pl.days) {
    const brunch = sch.days[iso] && sch.days[iso].a;
    if (!brunch) ab += breakfastN(pl, hh, iso);
    vb += snackN(pl, hh);
  }
  const share = (ids, n) => (ids.length && n > 0 ? ids.map((id) => ({ id, n: Math.round((n / ids.length) * 2) / 2 })) : []);
  return { ab, vb, items: [...share(pl.ab, ab), ...share(pl.vb, vb)] };
}

/* ostoslistalle: [{ id, v, n }], samat yhdistettynä */
export function shoppingItems(pl, hh, sch) {
  const out = new Map();
  const add = (id, v, n) => { if (!id || !(n > 0)) return; const k = id + "|" + (v || ""); const e = out.get(k) || { id, v: v || "", n: 0 }; e.n += n; out.set(k, e); };
  for (const f of sch.cooks) add(f.id, f.v, f.batch);
  for (const x of stapleTotals(pl, hh, sch).items) add(x.id, "", x.n);
  return [...out.values()];
}
