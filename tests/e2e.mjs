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
async function fresh() {
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => window.__app);
  await wait(300);
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
  await page.reload(); await page.waitForFunction(() => window.__app); await wait(300);
  const c = await page.evaluate(() => window.__app.state.custom.find((x) => x.name === "Testiruoka"));
  ok(c && c.intro === "Oma kuvaus" && c.ing.length === 2, "oma ruoka ei tallentunut");
  await click('.tab[data-tab="add"]'); await wait(300);
  const own = await page.evaluate(() => (document.querySelector(".ownl") || {}).innerText || "");
  ok(/Testiruoka/.test(own), "oma ruoka puuttuu Lisää ruoka -välilehden listasta");
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
  /* kortin muunnelmasiru avaa vain muunnelmat */
  await click('[data-pa="edit"][data-to="tw"]'); await wait(150);
  ok((await page.evaluate(() => document.querySelector("#pkbody h2").innerText)) === "Muunnelmat", "muunnelmasiru ei avannut muunnelmia");
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
  await click('#pkbody [data-pc-ok]'); await wait(500);
  const l = await page.evaluate(() => { const s = window.__app.state; const l = s.lists[s.lists.length - 1]; return { pl: (l.pl || []).length, x: (l.x || []).map((e) => e.k), name: l.name, have: (l.have || []).length, t: (l.pl || []).some((e) => e.t && e.t.length) }; });
  ok(l.have > 0 && l.t, "kaappi tai muunnelmat puuttuvat listalta: " + JSON.stringify(l));
  ok(l.pl >= 5 && /Suunnitelma/.test(l.name), "ostoslistalle ei tullut suunnitelmaa: " + JSON.stringify(l));
  ok([...l.x].sort().join(",") === px, "ruokien tuotteet väärin: " + l.x.join(",") + " / " + px);
  await click(".lcard"); await wait(300);
  ok((await page.evaluate(() => document.querySelectorAll("#v-cart li").length)) >= 10, "ostoslista on tyhjä");
  await page.evaluate(() => { const b = document.querySelector(".lbar .back"); b && b.click(); });
  await click('.tab[data-tab="ideas"]'); await wait(200);
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
