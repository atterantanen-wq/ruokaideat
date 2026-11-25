/* Selaintestit: npm test
 * Käynnistää kehityspalvelimen, avaa sovelluksen puhelimen kokoisena ja käy läpi keskeiset toiminnot.
 * Kehityspalvelimella sovellus jakaa sisäiset tiedot ikkunaan (window.__app), joita testit käyttävät tarkistuksiin. */
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PORT = 5179, URL = `http://localhost:${PORT}/`;
const results = [];
let page, browser, server, errs = [];

function test(name, fn) { results.push({ name, fn }); }
function ok(cond, msg) { if (!cond) throw new Error(msg); }
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const click = (sel) => page.evaluate((s) => { const e = document.querySelector(s); if (!e) throw new Error("ei löydy: " + s); e.click(); }, sel);
const closeAll = () => page.evaluate(() => document.querySelectorAll("dialog[open]").forEach((d) => d.close()));
async function openCard(name) {
  await page.evaluate((n) => {
    const c = [...document.querySelectorAll("#list .card")].find((c) => c.querySelector("h3").innerText.trim() === n);
    if (!c) throw new Error("korttia ei löydy: " + n);
    c.querySelector("[data-open]").click();
  }, name);
  await wait(150);
}
async function search(q) {
  await page.evaluate(() => document.getElementById("hkdlg").open || document.querySelector(".appbar .srch, #hkPill").click());
  await page.fill("#hkq", q);
  await wait(400);
  return page.$$eval("#hkres .card h3", (x) => x.map((h) => h.innerText.trim()));
}
/* Uudelleenlataus: suljetaan ensin auki olevat ikkunat ja odotetaan, että sovelluksen takaisin-ele
   (history.back() ikkunan sulkeutuessa, src/app/core.js) on ehtinyt valmiiksi. Muuten kesken oleva
   historiasiirtymä keskeyttää latauksen (net::ERR_ABORTED). */
async function reloadApp() {
  await page.evaluate(() => { for (const d of document.querySelectorAll("dialog[open]")) d.close(); document.body.classList.remove("inlist"); });
  await wait(200);
  await page.reload();
  await page.waitForFunction(() => window.__app);
  await wait(300);
}
async function fresh() {
  await page.evaluate(() => localStorage.clear());
  await reloadApp();
}

/* ---------------- testit ---------------- */

test("kaikki reseptit aukeavat ja jokainen versio ja muunnelma toimii", async () => {
  const ids = await page.$$eval("#list .card", (c) => c.map((x) => x.dataset.id));
  ok(ids.length >= 140, `kortteja vain ${ids.length}`);
  let n = 0;
  for (const id of ids) {
    await page.evaluate((id) => document.querySelector(`#list .card[data-id="${id}"] [data-open]`).click(), id);
    await wait(40);
    const vs = await page.$$eval("#dlg [data-ver]", (x) => x.map((e) => e.dataset.ver));
    for (const v of vs) { await click(`#dlg [data-ver="${v}"]`); n++; }
    const tw = await page.$$eval("#dlg [data-tw]", (x) => x.map((e) => e.dataset.tw));
    for (const t of tw) { await click(`#dlg [data-tw="${t}"]`); await click(`#dlg [data-tw="${t}"]`); n++; }
    if (vs.length) await click(`#dlg [data-ver="${vs[0]}"]`);
    await closeAll();
  }
  ok(n > 100, `valintoja testattiin vain ${n}`);
});

test("jokaisella reseptillä on hinta ja ravintoarvot", async () => {
  const r = await page.evaluate(() => {
    const A = window.__app, out = { nop: [], nonut: [] };
    for (const r of A.R) {
      const c = A.recipeCost(r);
      if (c.big || !c.n) out.nop.push(r.name + " (" + c.miss.join(", ") + ")");
      if (!A.nutPer(r)) out.nonut.push(r.name);
    }
    return out;
  });
  ok(!r.nop.length, "hinta puuttuu: " + r.nop.join("; "));
  ok(!r.nonut.length, "ravintoarvot puuttuvat: " + r.nonut.join(", "));
});

test("hinta löytyy aineksen nimen osalla ja hinnoilla on kauppalinkki", async () => {
  const r = await page.evaluate(() => {
    const A = window.__app, f = (n) => A.findPrice(n);
    return { hunaja: f("luomu hunaja")?.src || "", etikka: f("tumma etikka")?.src || "", turska: f("tuore turska")?.u || "" };
  });
  ok(/hunaja/i.test(r.hunaja), "luomu hunaja → " + r.hunaja);
  ok(/etikka/i.test(r.etikka), "tumma etikka → " + r.etikka);
  ok(r.turska.startsWith("https://www.s-kaupat.fi/"), "turskalta puuttuu kauppalinkki");
});

test("ruoka lisukkeineen ostoslistalle", async () => {
  await page.evaluate(() => [...document.querySelectorAll("#list .card")].find((c) => c.querySelector("h3").innerText.trim() === "Karjalanpaisti").querySelector(".cartbtn").click());
  await wait(300);
  ok(await page.$("#adlg[open]"), "lisäysikkuna ei auennut");
  const btn = await page.$eval("#adlg [data-a=ok]", (b) => b.innerText);
  ok(/Lisää ostoslistalle/.test(btn), "painikkeen teksti: " + btn);
  await click("#adlg [data-a=side]");
  await click("#adlg [data-a=ok]");
  await wait(300);
  await click('.tab[data-tab="cart"]'); await wait(300);
  await click(".lcard"); await wait(300);
  const cart = await page.evaluate(() => document.querySelector("#v-cart").innerText);
  ok(/Karjalanpaistiliha/.test(cart), "karjalanpaistiliha puuttuu listalta");
  ok(/Peruna/.test(cart), "lisukkeen peruna puuttuu listalta");
  await page.evaluate(() => { const b = document.querySelector(".lbar .back"); b && b.click(); });
  await click('.tab[data-tab="ideas"]'); await wait(200);
});

test("jaettu lista: linkki otsikossa ilman emojia ja linkki avaa listan", async () => {
  const id = await page.evaluate(() => { const s = window.__app.state; return s.lists[s.lists.length - 1].id; });
  await click('.tab[data-tab="cart"]'); await wait(300);
  await click(".lcard"); await wait(300);
  /* jakovalikko ei ole testiselaimessa käytössä, joten teksti menee leikepöydälle */
  await page.evaluate(() => { window.__clip = null; Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (t) => { window.__clip = t; } } }); });
  await click('.lbar [data-act="copy"]'); await wait(200);
  const txt = await page.evaluate(() => window.__clip || "");
  const lines = txt.split("\n");
  ok(!/🛒/.test(txt), "ostoskärryemoji on yhä tekstissä");
  ok(/^\*.+\* \(\d+ tuotetta?\)$/.test(lines[0]), "otsikkorivi: " + lines[0]);
  ok(lines[1] === "https://atterantanen-wq.github.io/ruokaideat/#lista=" + encodeURIComponent(id), "linkkirivi: " + lines[1]);
  await page.evaluate(() => { const b = document.querySelector(".lbar .back"); b && b.click(); });
  await click('.tab[data-tab="ideas"]'); await wait(200);
  /* linkki avaa ostoslistan */
  await page.goto(URL + "#lista=" + encodeURIComponent(id));
  await page.waitForFunction(() => window.__app); await wait(400);
  const r = await page.evaluate(() => ({ cart: !document.getElementById("v-cart").hidden, inlist: document.body.classList.contains("inlist"), h: location.hash, t: document.querySelector("#v-cart").innerText }));
  ok(r.cart && r.inlist, "linkki ei avannut listaa");
  ok(/Karjalanpaistiliha/.test(r.t), "väärä lista auki");
  ok(r.h === "", "osoitteeseen jäi " + r.h);
  /* tuntematon lista: Ostoslistat-yleisnäkymä */
  await page.goto(URL + "#lista=eiole");
  await page.waitForFunction(() => window.__app); await wait(400);
  const r2 = await page.evaluate(() => ({ cart: !document.getElementById("v-cart").hidden, inlist: document.body.classList.contains("inlist") }));
  ok(r2.cart && !r2.inlist, "tuntematon lista ei avannut Ostoslistoja");
  await page.evaluate(() => { const b = document.querySelector(".lbar .back"); b && b.click(); });
  await click('.tab[data-tab="ideas"]'); await wait(200);
});

test("valittu versio menee ostoslistalle", async () => {
  await openCard("Pizza");
  await click('#dlg [data-ver="jauheliha"]');
  await page.evaluate(() => document.querySelector("#dlg .actions .cartbtn").click());
  await wait(300);
  if (await page.$("#adlg[open]")) { await click("#adlg [data-a=ok]"); await wait(300); }
  await closeAll();
  const keys = await page.evaluate(() => { const A = window.__app, r = A.R.find((x) => x.name === "Pizza"); return A.selR(r).ing.join(";"); });
  ok(/jauheliha/.test(keys), "pizzan jauhelihaversio ei ole valittuna");
});

test("kokkausnäkymä aukeaa", async () => {
  await wait(400); /* edellisen testin suljetun dialogin historiatapahtuma ehtii käsitellä */
  await openCard("Pizza");
  await page.waitForSelector('#dlg [data-acc="steps"]');
  if ((await page.$eval('#dlg [data-acc="steps"]', (b) => b.getAttribute("aria-expanded"))) !== "true") await click('#dlg [data-acc="steps"]');
  await page.waitForSelector("#dlg [data-cook]", { timeout: 3000 }).catch(async (e) => { throw new Error(await page.evaluate(() => { const d = document.getElementById("dlg"); return "open=" + d.open + " " + [...d.querySelectorAll("[data-acc]")].map((b) => b.dataset.acc + ":" + b.getAttribute("aria-expanded")).join(",") + " h=" + (d.querySelector("h2") || {}).innerText; })); });
  await click("#dlg [data-cook]");
  await wait(300);
  const t = await page.evaluate(() => document.getElementById("kdlg").innerText);
  ok(/Vaihe 1/.test(t), "kokkausnäkymässä ei ole vaiheita");
  await closeAll();
});

test("oma ruoka tallentuu, säilyy ja näkyy omissa ruoissa", async () => {
  await click('.tab[data-tab="add"]'); await wait(300);
  await page.fill("#nn", "Testiruoka");
  await click("#nnGo"); await wait(300);
  await page.fill('#newBody textarea[data-ed-in="intro"]', "Oma kuvaus");
  await page.evaluate(() => [...document.querySelectorAll('#newBody [data-ed="bulk"]')].find((x) => x.dataset.k === "ing").click());
  await wait(200);
  await page.fill("#newBody .epanel textarea", "jauheliha 400 g\nsipuli 1 kpl");
  await click('#newBody .epanel [data-ed="bulkadd"], #newBody .epanel .go');
  await wait(200);
  await click('#newBody [data-ed="save"]'); await wait(400);
  await reloadApp();
  const c = await page.evaluate(() => window.__app.state.custom.find((x) => x.name === "Testiruoka"));
  ok(c && c.intro === "Oma kuvaus" && c.ing.length === 2, "oma ruoka ei tallentunut");
  await click('.tab[data-tab="add"]'); await wait(300);
  const own = await page.evaluate(() => (document.querySelector(".ownl") || {}).innerText || "");
  ok(/Testiruoka/.test(own), "oma ruoka puuttuu Lisää ruoka -välilehden listasta");
  await click('.tab[data-tab="ideas"]'); await wait(200);
});

test("oma ruoka poistuu omien ruokien listalta varmistuksella ja Kumoa palauttaa sen viittauksineen", async () => {
  await click('.tab[data-tab="add"]'); await wait(300);
  const id = await page.evaluate(() => {
    const a = window.__app, st = a.state, c = st.custom.find((x) => x.name === "Testiruoka");
    if (!st.fav.includes(c.id)) st.fav.push(c.id);
    let l = st.lists[0]; if (!l) { l = { id: "ltest", name: "Testi", d: "2026-01-01", cart: [], checked: [], have: [], x: [], store: "" }; st.lists.push(l); }
    l.cart.push(c.id);
    st.pl.items.push({ id: c.id, tg: ["a"], n: 4 }); st.pl.n = st.pl.items.length;
    localStorage.setItem("ruokaideat-v1", JSON.stringify(st));
    return c.id;
  });
  await reloadApp(); await click('.tab[data-tab="add"]'); await wait(300);
  const sel = `#newBody [data-owndel="${id}"]`;
  ok(await page.$(sel), "Poista-painike puuttuu Muokkaa-painikkeen vierestä");
  await click(sel); await wait(150);
  ok(await page.evaluate((i) => window.__app.state.custom.some((x) => x.id === i), id), "ensimmäinen painallus poisti jo");
  ok(/Varmista/.test(await page.$eval(sel, (b) => b.innerText)), "painike ei pyydä varmistusta");
  await click("#nn"); await wait(150);
  ok(/Poista/.test(await page.$eval(sel, (b) => b.innerText)), "varmistus ei peruuntunut muualle painettaessa");
  await click(sel); await wait(150); await click(sel); await wait(300);
  const gone = await page.evaluate((i) => { const st = window.__app.state; return !st.custom.some((x) => x.id === i) && !st.fav.includes(i) && !st.lists.some((l) => l.cart.includes(i)) && !st.pl.items.some((x) => x.id === i); }, id);
  ok(gone, "ruoka tai sen viittaukset jäivät");
  ok(!(await page.$(sel)), "ruoka näkyy yhä listalla");
  await click("#toast [data-ownundo]"); await wait(300);
  const back = await page.evaluate((i) => { const st = window.__app.state; return st.custom.some((x) => x.id === i) && st.fav.includes(i) && st.lists.some((l) => l.cart.includes(i)) && st.pl.items.some((x) => x.id === i); }, id);
  ok(back, "Kumoa ei palauttanut ruokaa viittauksineen");
  ok(await page.$(sel), "palautettu ruoka puuttuu listalta");
  await page.evaluate((i) => { const st = window.__app.state; st.pl.items = st.pl.items.filter((x) => x.id !== i); st.pl.n = st.pl.items.length; st.fav = st.fav.filter((x) => x !== i); for (const l of st.lists) l.cart = l.cart.filter((x) => x !== i); }, id);
  await click('.tab[data-tab="ideas"]'); await wait(200);
});

test("haku löytää vanhalla nimellä ja avaa version nimellä", async () => {
  const a = await search("omenapiirakka");
  ok(a.includes("Pehmeä omenapiirakka") && a.includes("Murotaikinainen omenapiirakka"), "omenapiirakka: " + a.join(", "));
  const b = await search("mansikkakakku");
  ok(b.includes("Täytekakku"), "mansikkakakku: " + b.join(", "));
  const c = await search("kirkas kalakeitto");
  ok(c[0] === "Kalakeitto", "kirkas kalakeitto: " + c.join(", "));
  await click("#hkres .card [data-open]"); await wait(300);
  const on = await page.$eval('#dlg [data-ver][aria-pressed="true"]', (b) => b.innerText.trim());
  ok(on === "Kirkas", "avautui versiona " + on);
  await closeAll();
});

test("ideakortissa työaika ja odotus erikseen", async () => {
  const t = await page.evaluate(async () => {
    const { cardTime } = await import("/src/app/catalog.js");
    const lbl = (r) => { const d = document.createElement("div"); d.innerHTML = cardTime(r); return d.textContent; };
    const card = document.querySelector("#list .card .ct");
    return {
      card: !!card,
      split: lbl({ min: 75, w: 30 }), same: lbl({ min: 20, w: 20 }), noW: lbl({ min: 35, w: 0 }),
      over: lbl({ min: 20, w: 40 }), long: lbl({ min: 75, w: 15 }), night: lbl({ min: 780, w: 20, steps: ["Liota herneet yön yli."] }), days: lbl({ min: 5790, w: 30 }),
    };
  });
  ok(t.card, "kortissa ei aikariviä");
  ok(t.split === "30+ 45 min", "jako: " + t.split);
  ok(t.same === "20 min", "ei odotusta: " + t.same);
  ok(t.noW === "35 min", "ilman työaikaa: " + t.noW);
  ok(t.over === "20 min", "työaika yli kokonaisajan: " + t.over);
  ok(t.long === "15 min+ 1 h", "tunti: " + t.long);
  ok(t.night === "20 min+ yön yli", "yön yli: " + t.night);
  ok(t.days === "30 min+ 4 vrk", "vrk: " + t.days);
});

test("muunnelma lisää ainekset ja päivittää valmistusohjeen", async () => {
  const r = await page.evaluate(() => {
    const A = window.__app, r = A.R.find((x) => x.name === "Kanacurry");
    A.state.tv[r.id] = { t: ["kookos"] };
    const s = A.selR(r); delete A.state.tv[r.id];
    return { ing: s.ing.join(";"), steps: s.steps.join(" ") };
  });
  ok(/kookosmaito/.test(r.ing) && !/creme fraiche/.test(r.ing), "ainekset eivät vaihtuneet");
  ok(/kookosmaito/i.test(r.steps) && !/creme fraiche/i.test(r.steps), "valmistusohje ei päivittynyt");
});

test("saman aineksen vaihtavat muunnelmat sulkevat toisensa pois", async () => {
  await fresh();
  await search("Kasvissosekeitto");
  await click("#hkres .card [data-open]"); await wait(300);
  const pick = (re) => page.evaluate((s) => [...document.querySelectorAll("#dlg [data-tw]")].find((b) => new RegExp(s).test(b.innerText)).click(), re);
  await pick("Tuorejuusto"); await wait(150);
  await pick("Maidoton"); await wait(150);
  const on = await page.$$eval('#dlg [data-tw][aria-pressed="true"]', (x) => x.map((b) => b.innerText.split("\n")[0].trim()));
  ok(on.length === 1 && /Maidoton/.test(on[0]), "valittuina: " + on.join(", "));
  await closeAll();
});

test("leivonnaisissa hinta ja määrä erinä", async () => {
  await search("Piparkakut");
  await click("#hkres .card [data-open]"); await wait(300);
  const row = await page.$eval("#dlg .prow", (e) => e.innerText);
  ok(/½ erä/.test(row) && /2 erää/.test(row), "erävalinta puuttuu: " + row);
  const card = await search("Piparkakut");
  const meta = await page.$eval("#hkres .card", (e) => e.innerText);
  ok(/€ \/ erä/.test(meta), "kortin hinta ei ole erälle: " + meta);
  ok(/yön yli/.test(meta), "kortissa ei näy lepoaikaa: " + meta);
  await closeAll();
});

test("suunnitelma: ruoat, valinnat, kaapin tarkistus ja ostoslista", async () => {
  await fresh();
  await click('.tab[data-tab="plan"]'); await wait(300);
  ok((await page.evaluate(() => window.__app.state.pl.items.length)) === 0, "suunnitelma ei ala tyhjänä");
  await click('[data-pa="four"]'); await wait(300);
  const n0 = await page.evaluate(() => window.__app.state.pl.items.filter((x) => x.id).length);
  ok(n0 === 4, "ehdotuksia " + n0);
  /* sirut: kasvis ja kala vaihtavat ruoan sopivaksi */
  await click('[data-pa="type"][data-i="0"]'); await wait(150);
  await click('#pkbody [data-pe="tg"][data-k="v"]'); await wait(100);
  await click('#pkbody [data-pp-x]');
  await click('[data-pa="type"][data-i="1"]'); await wait(150);
  await click('#pkbody [data-pe="tg"][data-k="f"]'); await wait(100);
  await click('#pkbody [data-pp-x]'); await wait(150);
  const r = await page.evaluate(() => {
    const A = window.__app, it = A.state.pl.items, c = (i) => A.plCands().find((x) => x.id === it[i].id);
    return { veg: !!c(0) && c(0).veg, fish: !!c(1) && c(1).fish, uniq: new Set(it.map((x) => x.id)).size === it.length };
  });
  ok(r.veg, "kasvissiru ei tuottanut kasvisruokaa");
  ok(r.fish, "kalasiru ei tuottanut kalaruokaa");
  ok(r.uniq, "sama ruoka kahdesti");
  /* kumoa vaihto */
  const id3 = await page.evaluate(() => window.__app.state.pl.items[3].id);
  await click('[data-pa="swap"][data-i="3"]'); await wait(150);
  ok(id3 !== (await page.evaluate(() => window.__app.state.pl.items[3].id)), "vaihto ei vaihtanut");
  await click('#toast [data-pundo]'); await wait(150);
  ok(id3 === (await page.evaluate(() => window.__app.state.pl.items[3].id)), "kumoa ei palauttanut ruokaa");
  /* muokkausikkuna: muunnelma, lisuke ja annokset */
  const tw = await page.evaluate(() => { const A = window.__app, it = A.state.pl.items; const i = it.findIndex((x) => (A.byId(x.id).tw || []).length); return i; });
  ok(tw >= 0, "ei muunneltavaa ruokaa");
  await click(`[data-pa="edit"][data-i="${tw}"]`); await wait(150);
  await click('#pkbody [data-pe="t"]');
  await click('#pkbody [data-pe="n"][data-k="1"]'); await wait(100);
  const sdb = await page.$('#pkbody [data-pe="sd"][aria-pressed="false"]');
  const sdk = sdb ? await sdb.evaluate((b) => b.dataset.k) : "";
  if (sdb) await sdb.click();
  await click('#pkbody [data-pp-x]'); await wait(150);
  const e = await page.evaluate((i) => window.__app.state.pl.items[i], tw);
  ok(e.t.length === 1 && e.n >= 5, "muokkaus ei tallentunut: " + JSON.stringify(e));
  ok(!sdk || e.sd.includes(sdk), "lisuke ei tallentunut");
  await click('[data-pa="add"]'); await wait(150);
  await click('#pkbody [data-pe="tm"][data-k="a"]');
  await click('#pkbody [data-pe="tg"][data-k="k"]');
  await click('#pkbody [data-pe="addok"]'); await wait(200);
  const it5 = await page.evaluate(() => { const A = window.__app, it = A.state.pl.items; return { n: it.length, light: !!(it[4] && A.plCands().find((c) => c.id === it[4].id) || {}).light }; });
  ok(it5.n === 5 && it5.light, "kevyen ruoan lisäys ei onnistunut: " + JSON.stringify(it5));
  /* kortti: laput yhdellä rivillä, lisuke- ja muunnelmasirut sekä haku tallella, alaosa avaa koko muokkauksen */
  const cardChk = await page.evaluate(() => {
    /* suunnitelman ruoat arvotaan, eikä jokaisella ole lisukkeita tai muunnelmia: sirut haetaan kaikista korteista */
    const all = [...document.querySelectorAll("#planBody .pn-item")], li = all[0], labs = [...li.querySelectorAll(".pn-lab")].map((b) => b.getBoundingClientRect().top);
    return { chips: all.reduce((n, x) => n + x.querySelectorAll(".pn-main .pn-tg").length, 0), pick: !!li.querySelector('[data-pa="pick"]'), open: !!li.querySelector("button.pn-open"), row: labs.every((t) => Math.abs(t - labs[0]) < 2) };
  });
  ok(cardChk.chips && cardChk.pick && cardChk.open && cardChk.row, "kortin rakenne: " + JSON.stringify(cardChk));
  await click('[data-pa="edit"][data-to="tw"]'); await wait(150);
  ok((await page.evaluate(() => document.querySelector("#pkbody h2").innerText)) === "Muunnelmat", "muunnelmasiru ei avannut muunnelmia");
  await click('#pkbody [data-pp-x]'); await wait(150);
  await click('#planBody .pn-open[data-i="0"]'); await wait(150);
  ok(await page.evaluate(() => !!document.querySelector('#pkbody [data-pe="n"]')), "alaosa ei avannut muokkausta");
  await click('#pkbody [data-pe="pick"]'); await wait(150);
  ok(await page.evaluate(() => !!document.getElementById("ppq")), "Hae toinen ruoka ei avannut hakua");
  await click('#pkbody [data-pp-x]'); await wait(150);
  /* poisto ja kumoa */
  await click('[data-pa="rm"][data-i="4"]'); await wait(150);
  ok((await page.evaluate(() => window.__app.state.pl.items.length)) === 4, "poisto ei onnistunut");
  await click('#toast [data-pundo]'); await wait(150);
  ok((await page.evaluate(() => window.__app.state.pl.items.length)) === 5, "poiston kumoaminen ei onnistunut");
  /* keskeneräiset osiot (Lisäksi kaupasta, hinta-arvio) eivät näy */
  ok(!(await page.evaluate(() => /Lisäksi kaupasta|Hinta-arvio/.test(document.querySelector("#planBody").innerText))), "keskeneräinen osio näkyy");
  const px = await page.evaluate(() => [...new Set(window.__app.state.pl.items.flatMap((it) => it.px || []))].sort().join(","));
  await click('[data-pa="shop"]'); await wait(300);
  const nOff = await page.evaluate(() => document.querySelectorAll('#pkbody .ar.off').length);
  ok(nOff > 0, "kaapin tarkistus: kaappitavaroita ei rastitettu pois");
  const chk = await page.evaluate(() => ({ g: document.querySelectorAll("#pkbody h4.ag").length, f: document.querySelectorAll("#pkbody .ar small.af").length, n: document.querySelectorAll("#pkbody .ar").length }));
  ok(chk.g >= 3 && chk.f === chk.n, "kaapin tarkistus: osastot tai ruokien nimet puuttuvat: " + JSON.stringify(chk));
  await click('#pkbody [data-pc-ok]'); await wait(500);
  const l = await page.evaluate(() => { const s = window.__app.state; const l = s.lists[s.lists.length - 1]; return { pl: (l.pl || []).length, x: (l.x || []).map((e) => e.k), name: l.name, have: (l.have || []).length, t: (l.pl || []).some((e) => e.t && e.t.length) }; });
  ok(l.have > 0 && l.t, "kaappi tai muunnelmat puuttuvat listalta: " + JSON.stringify(l));
  ok(l.pl >= 5 && /^Ostoslista \d/.test(l.name), "ostoslistalle ei tullut suunnitelmaa: " + JSON.stringify(l));
  ok([...l.x].sort().join(",") === px, "ruokien tuotteet väärin: " + l.x.join(",") + " / " + px);
  /* suunnitelma tyhjenee, ja sen voi palauttaa */
  ok((await page.evaluate(() => window.__app.state.pl.items.length)) === 0, "suunnitelma ei tyhjentynyt");
  await click('#toast [data-pundo]'); await wait(150);
  ok((await page.evaluate(() => window.__app.state.pl.items.length)) === 5, "suunnitelman palautus ei onnistunut");
  const card = await page.evaluate(() => document.querySelector(".lcard .lr").innerText);
  ok(card !== "Ei ruokia" && card.includes(","), "listan kortissa ei näy ruokia: " + card);
  await click(".lcard"); await wait(300);
  ok((await page.evaluate(() => document.querySelectorAll("#v-cart li").length)) >= 10, "ostoslista on tyhjä");
  await page.evaluate(() => { const b = document.querySelector(".lbar .back"); b && b.click(); });
  await click('.tab[data-tab="ideas"]'); await wait(200);
});

test("kaappi: logiikka (järjestys, vanheneminen)", async () => {
  const KP = await import("../src/pantry.js");
  const have = KP.haveMap([{ k: "@kana", d: "2026-11-20" }, { k: "peruna", d: "2026-11-20" }]);
  ok(have.has("broilerinfilee") && have.get("broilerinfilee") === "@kana", "ryhmä ei kata kanaa");
  const r = KP.rank([
    { id: "a", need: ["naudanliha", "ruokakerma"], main: ["naudanliha"] },
    { id: "b", need: ["broilerinfilee", "peruna", "tilli"], main: ["broilerinfilee"] },
    { id: "c", need: ["broilerinfilee", "kerma x"], main: ["broilerinfilee"] },
    { id: "c", v: "v2", need: ["broilerinfilee", "kerma x", "paprika"], main: ["broilerinfilee"] },
    { id: "d", need: ["lohifile"], main: ["lohifile"] },
  ], have, new Set(["@kana"]));
  ok(r.map((x) => x.id).join() === "b,c", "järjestys väärin: " + r.map((x) => x.id).join());
  ok(r[0].miss.length === 0 && r[0].minor.join() === "tilli", "yrtti laskettiin puuttuvaksi");
  ok(r[1].v === "" && r[1].miss.join() === "kerma x", "paras versio väärin");
  ok(KP.rank([{ id: "a", need: ["naudanliha", "peruna"], main: ["naudanliha"] }], have).every((x) => x.mainMiss === 1), "puuttuva pääraaka-aine");
  const sp = KP.split(KP.rank([{ id: "a", need: ["naudanliha", "peruna"], main: ["naudanliha"] }, { id: "e", need: ["broilerinfilee", "a1", "a2", "a3", "a4"], main: ["broilerinfilee"] }, { id: "f", need: ["broilerinfilee", "a1"], main: ["broilerinfilee"] }], have));
  ok(sp.near.map((x) => x.id).join() === "f" && sp.more.map((x) => x.id).join() === "e,a", "jako lähimpiin ja muihin väärin: " + JSON.stringify(sp));
  /* muunnelma: kaapissa oleva aines nostaa muunnelman, ilman sitä perusresepti; tasapelissä perusresepti */
  const tw = (h) => KP.rank([
    { id: "k", need: ["porkkana", "ruokakerma"], main: [] },
    { id: "k", t: "bataatti", tk: ["bataatti"], need: ["porkkana", "ruokakerma", "bataatti"], main: [] },
    { id: "k", t: "juusto", tk: ["sulatejuustodippi"], need: ["porkkana", "sulatejuustodippi"], main: [] },
  ], KP.haveMap(h));
  ok(tw([{ k: "porkkana" }, { k: "bataatti" }]).map((x) => x.id + ":" + x.t).join() === "k:bataatti", "muunnelma ei noussut");
  ok(tw([{ k: "porkkana" }])[0].t === "", "muunnelma ilman kaapin ainesta");
  ok(tw([{ k: "porkkana" }, { k: "sulatejuustodippi" }])[0].t === "juusto", "korvaava muunnelma ei noussut");
  ok(tw([{ k: "porkkana" }, { k: "ruokakerma" }, { k: "sulatejuustodippi" }])[0].t === "", "tasapelissä muunnelma");
  /* useampi kaapin aines: eniten käyttävä ensin, vaikka siitä puuttuisi enemmän */
  const many = KP.rank([
    { id: "x", need: ["broilerinfilee", "kerma x"], main: ["broilerinfilee"] },
    { id: "y", need: ["broilerinfilee", "peruna", "a1", "a2"], main: ["broilerinfilee"] },
  ], have);
  ok(many.map((x) => x.id).join() === "y,x", "useamman aineksen ruoka ei ole ensin: " + many.map((x) => x.id).join());
  ok(!KP.haveMap([{ k: "@kana" }]).has("kanankoivet"), "kanafilee kattaa koivet");
  ok(KP.daysLeft({ k: "@kana", d: "2026-11-20" }, "2026-11-25", 10) === 2, "kanan päivät väärin");
  ok(KP.daysLeft({ k: "peruna", d: "2026-11-01" }, "2026-11-25", 0) === null, "peruna vanhenee");
  ok(KP.prune([{ k: "@kana", d: "2026-11-10" }, { k: "@pasta", d: "2026-01-01" }], "2026-11-25", () => 18).map((x) => x.k).join() === "@pasta", "vanhentunut jäi kaappiin");
});

test("kaappi: merkintä, ehdotukset, lisäys suunnitelmaan ja kaapin tarkistus", async () => {
  await fresh();
  await click('.tab[data-tab="plan"]'); await wait(300);
  await click('[data-kpo]'); await wait(200);
  ok(await page.evaluate(() => document.getElementById("kpdlg").open), "kaappi ei auennut");
  for (const k of ["@kana", "peruna", "@kerma"]) await click(`#kpbody [data-ka="${k}"]`);
  /* haku: hakusana löytää aineksen, ja ryhmään kuuluva näytetään ryhmänä */
  await page.fill("#kpq", "broilerin"); await wait(150);
  ok(await page.evaluate(() => !!document.querySelector('#kpbody .chip:disabled') || !document.querySelector('#kpbody [data-ka="broilerinfilee"]')), "ryhmän aines näkyy erikseen");
  await page.fill("#kpq", "tomaattimu"); await wait(150);
  await click('#kpbody [data-ka="tomaattimurska"]'); await wait(100);
  /* perusaine pois */
  await click('#kpbody [data-kb]'); await wait(100);
  await click('#kpbody [data-kn="oregano"]'); await wait(100);
  const st = await page.evaluate(() => window.__app.state.kp);
  ok(st.h.map((x) => x.k).join() === "@kana,peruna,@kerma,tomaattimurska", "kaappi väärin: " + JSON.stringify(st));
  ok(st.no.includes("oregano"), "perusaineen poisto ei tallentunut");
  await click('#kpbody .kp-foot [data-kv="sg"]'); await wait(200);
  const sg = await page.$$eval("#kpbody .kp-sgs:not(.kp-more) .kp-sg", (x) => x.map((e) => e.innerText));
  ok(sg.length >= 5, "ehdotuksia vain " + sg.length);
  const hits = sg.map((t) => (/Kaapista: ([^·]*)/.exec(t) || ["", ""])[1].split(",").length);
  ok(hits.every((n, i) => !i || n <= hits[i - 1]), "eniten kaapin aineksia käyttävät eivät ole ensin: " + hits.join());
  ok(hits[0] >= 3, "parhaassa ehdotuksessa vain " + hits[0] + " kaapin ainesta: " + sg[0]);
  ok(sg.every((t) => !/Puuttuu [4-9]/.test(t)), "liian kaukaisia ehdotuksia");
  const id = await page.evaluate(() => document.querySelector("#kpbody [data-kadd]").dataset.kadd);
  await click("#kpbody [data-kadd]"); await wait(150);
  ok(await page.evaluate((id) => window.__app.state.pl.items.some((x) => x.id === id), id), "ehdotus ei mennyt suunnitelmaan");
  ok(await page.evaluate((id) => !document.querySelector(`#kpbody [data-kadd="${id}"]`), id), "lisätty näkyy yhä lisättävänä");
  await click("#kpbody [data-kx]"); await wait(150);
  ok(await page.evaluate(() => /Kaapissa: kanafilee, peruna, kerma \+1/.test(document.querySelector(".kp-entry").innerText)), "sisäänkäynnissä ei näy kaappia");
  /* kaapin tarkistus: kaappiin merkitty kana on valmiiksi pois, puuttuvaksi merkitty perusaine ei */
  await click('[data-pa="shop"]'); await wait(300);
  const off = await page.evaluate(() => [...document.querySelectorAll("#pkbody .ar")].map((b) => [b.dataset.pc, b.classList.contains("off")]));
  const kana = off.filter(([k]) => /broiler|kana/.test(k));
  ok(kana.length && kana.every(([, o]) => o), "kaappiin merkitty kana ei ole valmiiksi pois: " + JSON.stringify(off));
  ok(off.filter(([k]) => k === "oregano").every(([, o]) => !o), "puuttuvaksi merkitty perusaine rastitettiin pois");
  await closeAll();
  /* säilyy uudelleenlatauksessa, vanhentuneet tuoretuotteet poistuvat */
  await page.evaluate(() => { const s = JSON.parse(localStorage.getItem("ruokaideat-v1")); s.kp.h[0].d = "2020-01-01"; localStorage.setItem("ruokaideat-v1", JSON.stringify(s)); });
  await reloadApp();
  await click('.tab[data-tab="plan"]'); await wait(300);
  const h = await page.evaluate(() => window.__app.state.kp.h.map((x) => x.k).join());
  ok(h === "peruna,@kerma,tomaattimurska", "vanhentunut kana jäi kaappiin: " + h);
  await click('.tab[data-tab="ideas"]');
});

test("kaappi: kaukaisemmat kaapin ainesta käyttävät ruoat omana osionaan", async () => {
  await fresh();
  await click('.tab[data-tab="plan"]'); await wait(300);
  await click('[data-kpo]'); await wait(200);
  await page.fill("#kpq", "basilik"); await wait(150);
  await click('#kpbody [data-ka="basilika"]'); await wait(100);
  await click('#kpbody .kp-foot [data-kv="sg"]'); await wait(200);
  const nearN = await page.$$eval("#kpbody .kp-sgs:not(.kp-more) .kp-sg", (x) => x.map((e) => e.innerText.split("\n")[0])), near = nearN.length;
  const more = () => page.$$eval("#kpbody .kp-more .kp-sg", (x) => x.map((e) => e.innerText));
  let m = await more();
  ok(m.length >= 3, "muita osumia vain " + m.length);
  const btn = await page.$("#kpbody [data-kmore]");
  if (btn) { await btn.click(); await wait(150); m = await more(); }
  const names = [...nearN, ...m.map((t) => t.split("\n")[0])];
  ok(names.some((t) => /Tomaattikeitto/.test(t)) && names.some((t) => /Pekonipasta/.test(t)), "basilikaa käyttäviä puuttuu: " + names.join(" | "));
  ok(m.every((t) => /Kaapista: basilika/.test(t)), "osumassa ei näy kaapin ainesta");
  ok(near + m.length >= 6, "basilikaa käyttäviä yhteensä vain " + (near + m.length));
  ok(await page.evaluate(() => /Ehdotukset \((\d+)\)/.exec(document.querySelector('#kpbody [data-kv="sg"]').innerText)[1] * 1) === near + m.length, "välilehden määrä väärin");
  await closeAll();
  await click('.tab[data-tab="ideas"]');
});

test("kaappi: muunnelma ehdotuksena ja suunnitelmaan", async () => {
  await fresh();
  await click('.tab[data-tab="plan"]'); await wait(300);
  await click('[data-kpo]'); await wait(200);
  for (const k of ["peruna", "porkkana"]) await click(`#kpbody [data-ka="${k}"]`);
  await page.fill("#kpq", "bataat"); await wait(150);
  await click('#kpbody [data-ka="bataatti"]'); await wait(100);
  await click('#kpbody .kp-foot [data-kv="sg"]'); await wait(200);
  const row = await page.evaluate(() => { const li = [...document.querySelectorAll("#kpbody .kp-sg")].find((e) => /^Kasvissosekeitto/.test(e.innerText)); return li ? [li.innerText, li.querySelector("[data-kadd]").dataset.kadd] : null; });
  ok(row && /Muunnelma: Bataatilla/.test(row[0]), "Bataatilla-muunnelma ei näy: " + (row && row[0]));
  const n = await page.$$eval("#kpbody .kp-sg", (x) => x.filter((e) => /^Kasvissosekeitto/.test(e.innerText)).length);
  ok(n === 1, "sama ruoka useaan kertaan: " + n);
  await click(`#kpbody [data-kadd="${row[1]}"]`); await wait(150);
  const t = await page.evaluate((id) => (window.__app.state.pl.items.find((x) => x.id === id) || {}).t, row[1]);
  ok(Array.isArray(t) && t.join() === "bataatti", "muunnelma ei mennyt suunnitelmaan: " + JSON.stringify(t));
  await closeAll();
  await click('.tab[data-tab="ideas"]');
});

/* Design system -tarkistukset. Ajetaan selaimessa page.evaluate:lla. */
/* Kontrasti: jokainen näkyvä teksti WCAG 2.2 AA (4.5:1, iso teksti 3:1). Kuvan päällä olevia tekstejä ei mitata. */
function contrastAudit() {
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const a = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: a[0], g: a[1], b: a[2], a: a[3] ?? 1 }; };
  const lum = ({ r, g, b }) => [r, g, b].map((x) => x / 255).map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)).reduce((s, x, i) => s + x * [0.2126, 0.7152, 0.0722][i], 0);
  const mix = (t, u) => ({ r: t.r * t.a + u.r * (1 - t.a), g: t.g * t.a + u.g * (1 - t.a), b: t.b * t.a + u.b * (1 - t.a), a: 1 });
  const bgOf = (el) => { const ls = []; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const s = getComputedStyle(e); if (s.backgroundImage !== "none") return null; const c = parse(s.backgroundColor); if (c && c.a > 0) { ls.push(c); if (c.a >= 1) break; } } let b = parse(getComputedStyle(document.body).backgroundColor); for (let i = ls.length - 1; i >= 0; i--) b = mix(ls[i], b); return b; };
  const root = document.querySelector("dialog[open]") || document.body, out = [];
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n; (n = w.nextNode());) {
    const el = n.parentElement; if (!n.textContent.trim() || el.closest("dialog:not([open]),[hidden],:disabled")) continue;
    const r = el.getBoundingClientRect(), s = getComputedStyle(el); if (!r.width || !r.height || s.visibility === "hidden") continue;
    const bg = bgOf(el); if (!bg) continue;
    const c = parse(s.color), fg = mix({ ...c, a: c.a * +s.opacity }, bg);
    const L1 = lum(fg), L2 = lum(bg), cr = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const fs = parseFloat(s.fontSize), big = fs >= 24 || (fs >= 18.66 && +s.fontWeight >= 700);
    if (cr < (big ? 3 : 4.5)) out.push(`.${String(el.className).split(" ")[0] || el.tagName} "${n.textContent.trim().slice(0, 24)}" ${cr.toFixed(2)}:1`);
  }
  return [...new Set(out)];
}
/* Asettelu: napit, laput ja välilehtien nimet pysyvät yhdellä rivillä, eivätkä ne valu oman alueensa yli.
 * (Rivittyvä lappu, esim. "VIIKONLOPPU JA JUHLA" + nuoli toisella rivillä, ei näy kontrastimittauksessa.) */
function layoutAudit() {
  const root = document.querySelector("dialog[open]") || document.body, out = [];
  const sel = ".pn-lab,.go,.cartbtn,.pc,.tab .lb,.chip:not(#fa .chip),.pn-opt b,.pn-tg,.toast button";
  for (const el of root.querySelectorAll(sel)) {
    if (el.closest("dialog:not([open]),[hidden]")) continue;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    /* tekstirivien määrä: tekstisolmujen rivilaatikoiden eri korkeudet (kuvakkeet jätetään pois) */
    const lines = [], tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n; (n = tw.nextNode());) { if (!n.textContent.trim()) continue; const rg = document.createRange(); rg.selectNodeContents(n); for (const q of rg.getClientRects()) if (q.width > 1) lines.push(q); }
    const tops = new Set(); for (const q of lines) if (![...tops].some((t) => Math.abs(t - q.top) < q.height * 0.6)) tops.add(q.top);
    const name = `.${String(el.className).split(" ")[0] || el.tagName} "${el.textContent.trim().slice(0, 24)}"`;
    if (tops.size > 1) out.push(name + " rivittyy");
    if (r.right > innerWidth + 1 || r.left < -1) out.push(name + " valuu näytön yli");
  }
  /* sivu ei saa levitä näyttöä leveämmäksi (WCAG 1.4.10, puhelin zoomaisi ulos) */
  if (document.documentElement.scrollWidth > innerWidth + 1) {
    const wide = [...document.querySelectorAll("body *")].find((e) => e.className && e.getBoundingClientRect().right > innerWidth + 1);
    out.push(`sivu ${document.documentElement.scrollWidth} px leveä (${innerWidth} px näyttö), esim. .${wide ? String(wide.className).split(" ")[0] : "?"}`);
  }
  return [...new Set(out)];
}
async function auditViews(views, label) {
  const bad = [];
  for (const theme of ["light", "dark"]) {
    for (const [name, open] of views) {
      await closeAll();
      await page.evaluate((th) => { document.documentElement.dataset.theme = th; }, theme);
      await open(); await wait(300);
      const c = await page.evaluate(contrastAudit), l = await page.evaluate(layoutAudit);
      if (c.length) bad.push(`${theme}/${name} kontrasti: ${c.slice(0, 4).join(", ")}`);
      if (l.length) bad.push(`${theme}/${name} asettelu: ${l.slice(0, 4).join(", ")}`);
    }
  }
  await closeAll();
  ok(!bad.length, label + ": " + bad.join(" | "));
}
const tab = (v) => () => click(`.tab[data-tab="${v}"]`);

test("tyylit: kontrasti ja asettelu kaikilla välilehdillä ja reseptissä", async () => {
  const prev = await page.evaluate(() => document.documentElement.dataset.theme);
  /* omien ruokien lista (Muokkaa + Poista) mukaan tarkistukseen */
  if (await page.evaluate(() => !window.__app.state.custom.length)) {
    await page.evaluate(() => { const s = window.__app.state; s.custom.push({ id: "cxtyyli1", name: "Tyylitestin oma ruoka pitkällä nimellä", mo: "", t: "", s: [], min: 20, ing: ["sipuli 1 kpl"], steps: ["Kypsennä."], url: "", custom: true }); localStorage.setItem("ruokaideat-v1", JSON.stringify(s)); });
    await reloadApp();
  }
  await auditViews([["ideat", tab("ideas")], ["suunnitelma", tab("plan")], ["lisää", tab("add")], ["lisää, poiston varmistus", async () => { await tab("add")(); await click("#newBody [data-owndel]"); }], ["ostoslista", tab("cart")],
    ["resepti", async () => { await tab("ideas")(); await click("#list .card [data-open]"); }],
    ["kaappi", async () => { await tab("plan")(); await click("[data-kpo]"); await click('#kpbody .kp-seg [data-kv="kp"]'); await page.evaluate(() => { for (const k of ["@kana", "peruna"]) { const b = document.querySelector(`#kpbody [data-ka="${k}"]`); if (b) b.click(); } document.querySelector("#kpbody [data-kb]").click(); }); }],
    ["kaapin ehdotukset", async () => { await tab("plan")(); await click("[data-kpo]"); await click('#kpbody .kp-seg [data-kv="sg"]'); }]], "tyylit");
  await page.evaluate((th) => { document.documentElement.dataset.theme = th; }, prev);
  await click('.tab[data-tab="ideas"]');
});

/* Suunnitelma jokaisella pääryhmällä ja rajauksella, kapealla ja tavallisella puhelimella. */
test("tyylit: suunnitelma kaikilla valinnoilla (arki, viikonloppu ja juhla, rajaukset)", async () => {
  const prev = await page.evaluate(() => document.documentElement.dataset.theme);
  const tags = await page.evaluate(() => [...new Set([...document.querySelectorAll('[data-pe="tg"]')].map((b) => b.dataset.k))]);
  for (const width of [390, 360]) {
    await page.setViewportSize({ width, height: 844 });
    await fresh();
    await click('.tab[data-tab="plan"]'); await wait(300);
    await click('[data-pa="four"]'); await wait(300);
    /* ruoka 1 arki, ruoka 2 viikonloppu ja juhla, ruoka 3 viikonloppu ja juhla + kaikki rajaukset */
    for (const [i, main, all] of [[1, "w", false], [2, "w", true]]) {
      await click(`[data-pa="type"][data-i="${i}"]`); await wait(150);
      await click(`#pkbody [data-pe="tm"][data-k="${main}"]`); await wait(100);
      if (all) for (const k of await page.$$eval('#pkbody [data-pe="tg"]', (x) => x.map((b) => b.dataset.k))) { await click(`#pkbody [data-pe="tg"][data-k="${k}"]`); await wait(60); }
      await click("#pkbody [data-pp-x]"); await wait(200);
    }
    await wait(1800); /* uuden ruoan korostus ehtii häivyä */
    await auditViews([[`suunnitelma ${width}px`, tab("plan")],
      [`valintaikkuna ${width}px`, async () => { await tab("plan")(); await click('[data-pa="type"][data-i="2"]'); }]], "suunnitelma");
  }
  ok(tags !== null, "");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate((th) => { document.documentElement.dataset.theme = th; }, prev);
  await click('.tab[data-tab="ideas"]');
});

/* ---------------- ajo ---------------- */

async function main() {
  server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "--port", String(PORT), "--strictPort"], { stdio: "ignore" });
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(URL); if (r.ok) break; } catch { /* odotetaan */ }
    await wait(250);
  }
  browser = await chromium.launch();
  page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on("pageerror", (e) => errs.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/fonts|ERR_/.test(m.text())) errs.push(m.text()); });
  await page.goto(URL);
  await page.waitForFunction(() => window.__app);
  await wait(500);

  let failed = 0;
  /* ONLY="haku|tyylit" npm test ajaa vain osuvat testit */
  const only = process.env.ONLY ? new RegExp(process.env.ONLY) : null;
  if (only) results.splice(0, results.length, ...results.filter((t) => only.test(t.name)));
  for (const t of results) {
    errs = [];
    const t0 = Date.now();
    try {
      await t.fn();
      if (errs.length) throw new Error("selaimen virheet: " + errs.join(" | "));
      console.log(`  ✓ ${t.name} (${Date.now() - t0} ms)`);
    } catch (e) {
      failed++;
      console.log(`  ✗ ${t.name}\n      ${e.message}`);
      await closeAll().catch(() => {});
    }
  }
  await browser.close();
  server.kill();
  console.log(`\n${results.length - failed}/${results.length} testiä läpi`);
  process.exit(failed ? 1 : 0);
}
main().catch((e) => { console.error(e); try { server && server.kill(); } catch { /* */ } process.exit(1); });
