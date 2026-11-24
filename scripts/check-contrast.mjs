/* Kontrastitarkistus: npm run contrast
 * Lukee teeman värit tiedostosta src/styles/theme.css (vaalea ja tumma) ja tarkistaa,
 * että jokainen käytössä oleva väripari täyttää WCAG 2.2 AA -vaatimuksen:
 * teksti 4.5:1, käyttöliittymän osat (reunat, kuvakkeet, kohdistusrengas) 3:1. */
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/styles/theme.css", import.meta.url), "utf8");
function block(sel) {
  const i = css.indexOf(sel + "{");
  if (i < 0) throw new Error("ei löydy: " + sel);
  const body = css.slice(i, css.indexOf("}", i));
  return Object.fromEntries([...body.matchAll(/--c-([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
}
const light = block(":root");
const themes = { vaalea: light, tumma: { ...light, ...block(':root[data-theme="dark"]') } };

const lum = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)).reduce((s, x, i) => s + x * [0.2126, 0.7152, 0.0722][i], 0);
export const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

/* [edusta, tausta, vaatimus, kuvaus] */
const PAIRS = [
  ["ink", "bg", 4.5, "teksti taustalla"], ["ink", "surface", 4.5, "teksti kortilla"], ["ink", "sunken", 4.5, "teksti upotetulla pinnalla"],
  ["muted", "bg", 4.5, "toissijainen teksti taustalla"], ["muted", "surface", 4.5, "toissijainen teksti kortilla"], ["muted", "sunken", 4.5, "toissijainen teksti upotetulla"],
  ["on-primary", "primary", 4.5, "päänapin teksti"], ["on-primary", "primary-hover", 4.5, "päänapin teksti (hover)"], ["primary-ink", "primary-soft", 4.5, "valittu tila"],
  ["on-success", "success", 4.5, "valmis-merkki"], ["success-ink", "success-soft", 4.5, "onnistumisviesti"], ["success-ink", "surface", 4.5, "onnistumisteksti kortilla"],
  ["danger", "surface", 4.5, "virheteksti kortilla"], ["danger", "bg", 4.5, "virheteksti taustalla"], ["danger", "danger-soft", 4.5, "virheviesti"],
  ["on-inverse", "inverse", 4.5, "ilmoitus"],
  ["ideas-ink", "ideas-tint", 4.5, "alapalkki: Ideat"], ["plan-ink", "plan-tint", 4.5, "alapalkki: Suunnitelma"], ["add-ink", "add-tint", 4.5, "alapalkki: Lisää ruoka"], ["cart-ink", "cart-tint", 4.5, "alapalkki: Ostoslista"],
  ["ideas-ink", "surface", 4.5, "Ideat-tekstilinkki kortilla"],
  ["field-line", "surface", 3, "kentän reuna"], ["field-line", "bg", 3, "kentän reuna taustalla"], ["focus", "bg", 3, "kohdistusrengas"], ["focus", "surface", 3, "kohdistusrengas kortilla"],
  ["accent", "surface", 3, "suosikkisydän"], ["primary", "bg", 3, "päänapin reuna"],
];
let fails = 0;
for (const [name, t] of Object.entries(themes)) {
  for (const [fg, bg, need, what] of PAIRS) {
    if (!t[fg] || !t[bg]) { console.log(`✕ ${name}: puuttuva token --c-${t[fg] ? bg : fg}`); fails++; continue; }
    const r = contrast(t[fg], t[bg]);
    if (r < need) { console.log(`✕ ${name}: ${what} ${r.toFixed(2)}:1 < ${need}:1 (--c-${fg} ${t[fg]} / --c-${bg} ${t[bg]})`); fails++; }
  }
}
console.log(fails ? `${fails} kontrastivirhettä` : `Kontrastit kunnossa: ${PAIRS.length} paria × 2 teemaa`);
process.exit(fails ? 1 : 0);
