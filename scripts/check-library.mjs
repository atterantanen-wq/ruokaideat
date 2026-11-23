/* Reseptikirjaston rakennetarkistus: npm run check
 * Virheet (exit 1) estävät julkaisun, varoitukset kannattaa käydä läpi.
 * Ohjeet kirjaston ylläpitoon: docs/reseptit.md */
import { LIB } from "../src/data/library/index.js";
import { fromLib, applySel } from "../src/recipes.js";

const errors = [], warns = [];
const err = (r, m) => errors.push(`${r}: ${m}`);
const warn = (r, m) => warns.push(`${r}: ${m}`);
const keyOf = (l) => l.replace(/\s+[\d.,]+(\s+\S+)?$/, "").toLowerCase();
const LINE = /^\S.*\s[\d.]+(\s\S+)?$/;

const R = LIB.map(fromLib);
const byId = new Map();
for (const r of R) {
  if (byId.has(r.id)) err(r.name, `tunniste ${r.id} on jo käytössä (${byId.get(r.id).name})`);
  byId.set(r.id, r);
}
const names = new Map(R.map((r) => [r.name.toLowerCase(), r]));

for (const [i, e] of LIB.entries()) {
  const r = R[i], n = r.name;
  if (!e.d) warn(n, "kuvaus (d) puuttuu");
  if (!r.steps.length) err(n, "työvaiheet puuttuvat");
  if (!r.src.length && r.t !== "li") warn(n, "lähteet (src) puuttuvat");
  for (const l of r.ing) if (!LINE.test(l)) warn(n, `ainesrivi ei ole muotoa "nimi määrä yksikkö": ${l}`);
  for (const a of r.aka) if (names.has(a.toLowerCase()) && names.get(a.toLowerCase()) !== r) warn(n, `muu nimi "${a}" on toisen reseptin nimi`);

  /* lisukeviittaukset "id" tai "id:versio" */
  for (const s of r.sides) {
    const [id, v] = s.split(":"), d = byId.get(id);
    if (!d) err(n, `lisuketta ${id} ei löydy`);
    else if (v && !d.vs.some((x) => x.id === v)) err(n, `lisukkeella ${d.name} ei ole versiota ${v}`);
  }

  /* versiot ja muunnelmat */
  const mods = [...r.vs.map((m) => ["versio", m]), ...r.tw.map((m) => ["muunnelma", m])];
  const ids = new Set();
  for (const [kind, m] of mods) {
    if (ids.has(m.id)) err(n, `${kind}n tunniste ${m.id} toistuu`);
    ids.add(m.id);
    const idx = [...Object.keys(m.step || {}).map(Number), ...(m.ins || []).map((x) => x[0]), ...(m.del || [])];
    for (const k of idx) if (k < -1 || k >= r.steps.length) err(n, `${kind} ${m.n}: vaiheindeksi ${k} on perusreseptin vaiheiden (0–${r.steps.length - 1}) ulkopuolella`);
    for (const x of m.rm || []) if (!r.ing.some((l) => { const k = keyOf(l); return k === x || k.startsWith(x + " ") || l.startsWith(x + " ") || l === x; })) err(n, `${kind} ${m.n}: poistettavaa ainesta "${x}" ei ole perusreseptissä`);
    const changes = (m.add || []).length || (m.rm || []).length;
    if (changes && !m.step && !m.ins && !m.del && kind === "muunnelma") warn(n, `muunnelma ${m.n} muuttaa aineksia mutta ei työvaiheita`);
    if (kind === "muunnelma" && !m.d) warn(n, `muunnelmalta ${m.n} puuttuu selitys (d)`);
    try { applySel(r, kind === "versio" ? { v: m.id } : { t: [m.id] }, keyOf); } catch (x) { err(n, `${kind} ${m.n} kaatuu: ${x.message}`); }
  }
  if (r.vs.length === 1) warn(n, "vain yksi versio: versioita pitää olla vähintään kaksi");

  /* toisensa poissulkevat muunnelmat (sovellus estää yhtäaikaisen valinnan; jos tämä on tarkoitus, merkitse ne samaan ryhmään g, muuten tee niistä versiot) */
  for (let a = 0; a < r.tw.length; a++) for (let b = a + 1; b < r.tw.length; b++) {
    const c = (r.tw[a].rm || []).filter((x) => (r.tw[b].rm || []).includes(x));
    if (c.length && !(r.tw[a].g && r.tw[a].g === r.tw[b].g)) warn(n, `muunnelmat ${r.tw[a].n} ja ${r.tw[b].n} vaihtavat saman aineksen (${c.join(", ")}): harkitse versioita`);
  }
}

console.log(`Reseptejä ${R.length}, versioita ${R.reduce((a, r) => a + r.vs.length, 0)}, muunnelmia ${R.reduce((a, r) => a + r.tw.length, 0)}`);
if (warns.length) console.log(`\nVaroitukset (${warns.length}):\n  ` + warns.join("\n  "));
if (errors.length) { console.log(`\nVirheet (${errors.length}):\n  ` + errors.join("\n  ")); process.exit(1); }
console.log("\nEi virheitä.");
