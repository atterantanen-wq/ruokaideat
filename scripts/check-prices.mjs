/* Hintojen tarkistuslista: näyttää arvioidut ja vanhentuneet hinnat linkkeineen.
 * npm run prices              arviot ja yli 60 päivää vanhat hinnat
 * npm run prices -- --days 30 oma raja päivinä
 * npm run prices -- --all     kaikki hinnat vanhimmasta uusimpaan */
import {PR, PU, PBASE} from "../src/data/prices.js";

const args = process.argv.slice(2);
const di = args.indexOf("--days");
const maxAge = di >= 0 ? Number(args[di + 1]) : 60;
const all = args.includes("--all");
const today = new Date();
const age = d => Math.floor((today - new Date(d + "T00:00:00")) / 864e5);
const isEst = e => /arvio/i.test(e.src + " " + e.w);
const url = k => PR[k].u || (PU[k] ? PBASE + PU[k] : "");
const fmt = (k, e) => `  ${k.padEnd(26)} ${String(e.p).padStart(7)} €/${e.per.padEnd(3)} ${e.d} (${age(e.d)} pv)  ${e.src}${url(k) ? "\n" + " ".repeat(30) + url(k) : ""}`;

const rows = Object.entries(PR).sort((a, b) => a[1].d.localeCompare(b[1].d) || a[0].localeCompare(b[0], "fi"));
const byDate = {};
for (const [, e] of rows) byDate[e.d] = (byDate[e.d] || 0) + 1;

console.log(`Hintoja ${rows.length}. Tarkistuspäivät: ${Object.entries(byDate).map(([d, n]) => `${d} (${n})`).join(", ")}\n`);

const est = rows.filter(([, e]) => isEst(e));
console.log(`Arvioita, ei tarkistettu kaupasta: ${est.length}`);
for (const [k, e] of est) console.log(fmt(k, e));

const old = rows.filter(([, e]) => all || age(e.d) > maxAge);
console.log(`\n${all ? "Kaikki hinnat" : `Yli ${maxAge} päivää vanhoja hintoja`}: ${old.length}`);
for (const [k, e] of old) console.log(fmt(k, e));

const bad = rows.filter(([, e]) => !/^\d{4}-\d{2}-\d{2}$/.test(e.d) || !(e.p > 0) || !["kg", "l", "kpl"].includes(e.per));
if (bad.length) {
  console.log(`\nVirheellisiä rivejä: ${bad.length}`);
  for (const [k, e] of bad) console.log(fmt(k, e));
  process.exit(1);
}
