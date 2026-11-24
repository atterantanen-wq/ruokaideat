/* Tyylisivu (tyylit.html): näyttää design systemin tokenit ja komponentit.
 * Värit ja kontrastit luetaan tyylitiedostoista ajon aikana, joten sivu pysyy ajan tasalla. */
import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/theme.css";
import "./styles/main.css";
import "./styles/styleguide.css";

const $ = (id) => document.getElementById(id);
const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

/* värin muunto: selain antaa tokenin arvon, luetaan se rgb-muotoon canvasilla */
const cv = document.createElement("canvas").getContext("2d");
function rgb(c) { cv.fillStyle = "#000"; cv.fillStyle = c; const h = cv.fillStyle; if (h[0] === "#") return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); return h.match(/\d+/g).slice(0, 3).map(Number); }
function lum(c) { return rgb(c).map((x) => x / 255).map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)).reduce((s, x, i) => s + x * [0.2126, 0.7152, 0.0722][i], 0); }
export function contrast(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }

const COLORS = [
  ["--c-bg", "Tausta", "--c-ink"], ["--c-surface", "Pinta", "--c-ink"], ["--c-sunken", "Upotettu pinta", "--c-muted"],
  ["--c-ink", "Teksti", "--c-bg"], ["--c-muted", "Toissijainen teksti", "--c-bg"], ["--c-line", "Erotinviiva", null],
  ["--c-field-line", "Kentän reuna", "--c-surface", 3], ["--c-primary", "Pääväri", "--c-on-primary"], ["--c-primary-soft", "Pääväri, pehmeä", "--c-primary-ink"],
  ["--c-accent", "Korostus (sydän)", "--c-surface", 3], ["--c-success", "Onnistui", "--c-on-success"], ["--c-success-soft", "Onnistui, pehmeä", "--c-success-ink"],
  ["--c-danger", "Virhe ja poisto", "--c-surface"], ["--c-inverse", "Ilmoitus", "--c-on-inverse"], ["--c-focus", "Kohdistus", "--c-bg", 3],
];
const SECTIONS = [["ideas", "Ideat"], ["plan", "Suunnitelma"], ["add", "Lisää ruoka"], ["cart", "Ostoslista"]];

function swatch(name, label, onVar, need = 4.5) {
  const bg = css(name), fg = onVar ? css(onVar) : null;
  const r = fg ? contrast(fg, bg) : null;
  /* tekstivärit näytetään pohjallaan, pinnat tekstillä */
  const isText = need === 3 || ["--c-ink", "--c-muted", "--c-danger"].includes(name);
  const tile = isText ? `background:${fg};color:${bg}` : `background:${bg};color:${fg || "inherit"}`;
  return `<figure class="sg-c"><div class="sg-t" style="${tile}">${r ? (need === 3 && name !== "--c-ink" ? "●" : "Aa") : ""}</div>
<figcaption><b>${label}</b><code>${name}</code><span>${bg}</span>${r ? `<span class="${r >= need ? "ok" : "bad"}">${r.toFixed(1)}:1 ${r >= need ? "✓" : "✕"}${need === 3 ? " (3:1)" : ""}</span>` : ""}</figcaption></figure>`;
}
function render() {
  $("sgColors").innerHTML = COLORS.map((c) => swatch(...c)).join("");
  $("sgSections").innerHTML = SECTIONS.map(([k, l]) => swatch(`--c-${k}-tint`, `${l}, valittu`, `--c-${k}-ink`) + swatch(`--c-${k}-head`, `${l}, yläosa`, null)).join("");
  document.querySelectorAll("[data-sgth]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.sgth === document.documentElement.dataset.theme));
}

$("sgType").innerHTML = [["--fs-2xl", "Sivun otsikko", "display", 700], ["--fs-xl", "Ikkunan otsikko", "display", 700], ["--fs-lg", "Kortin otsikko", "display", 600], ["--fs-base", "Leipäteksti, kentät", "body", 400], ["--fs-md", "Napit ja listat", "body", 600], ["--fs-sm", "Aputeksti ja alapalkki", "body", 500], ["--fs-xs", "Merkit", "body", 600]]
  .map(([v, l, f, w]) => `<div class="sg-ty"><span style="font:${w} var(${v})/1.25 var(--font-${f})">${l}</span><code>${v} · ${css(v)}</code></div>`).join("");
$("sgSpace").innerHTML = ["--sp-1", "--sp-2", "--sp-3", "--sp-4", "--sp-5", "--sp-6", "--sp-8"].map((v) => `<div><i style="width:var(${v});height:var(${v})"></i><code>${v.slice(2)} ${css(v)}</code></div>`).join("");
$("sgRadius").innerHTML = ["--r-xs", "--r-sm", "--r-md", "--r-lg", "--r-pill"].map((v) => `<div><i style="border-radius:var(${v})"></i><code>${v.slice(2)}</code></div>`).join("") + ["--sh-1", "--sh-2"].map((v) => `<div><i style="box-shadow:var(${v});border:0"></i><code>${v.slice(2)}</code></div>`).join("");
$("sgMotion").innerHTML = [["--dur-instant", "painallus"], ["--dur-fast", "värin vaihto"], ["--dur-base", "ikkuna, ilmoitus"], ["--dur-slow", "iso paneeli, hypähdys"]].map(([v, l]) => `<div><code>${v} ${css(v)}</code><span>${l}</span></div>`).join("") + `<div><code>--ease-out</code><span>alku nopea, loppu hidastuu</span></div>`;

const IC = { ideas: '<rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1"/>', plan: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>', add: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>', cart: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M3.5 6l1.2 1.2L6.8 5M3.5 12l1.2 1.2L6.8 11M3.5 18l1.2 1.2L6.8 17"/>' };
$("sgTabs").innerHTML = SECTIONS.map(([k, l], i) => `<button class="tab" role="tab" type="button" data-tab="${k}" aria-selected="${i === 0}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k]}</svg><span class="lb">${l}</span></button>`).join("");
$("sgTabs").addEventListener("click", (e) => { const t = e.target.closest(".tab"); if (!t) return; $("sgTabs").querySelectorAll(".tab").forEach((x) => x.setAttribute("aria-selected", x === t)); });

document.addEventListener("click", (e) => {
  const th = e.target.closest("[data-sgth]");
  if (th) { document.documentElement.dataset.theme = th.dataset.sgth; render(); return; }
  const c = e.target.closest(".chip[aria-pressed]:not([data-sgth]),.pc,.cartbtn[data-cart]");
  if (c) {
    if (c.classList.contains("pc")) c.parentElement.querySelectorAll(".pc").forEach((x) => x.setAttribute("aria-pressed", x === c));
    else c.setAttribute("aria-pressed", c.getAttribute("aria-pressed") !== "true");
  }
  if (e.target.closest("#sgBump")) { const b = $("sgBadge"); b.textContent = +b.textContent + 1; b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
});
render();
