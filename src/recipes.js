/* Reseptikirjaston muunnos sovelluksen sisäiseen muotoon sekä versioiden ja muunnelmien käsittely.
 *
 * Kirjaston resepti (src/data/library/*.js):
 *   n      nimi
 *   m      pääraaka-aine (M-koodi), t ruokalaji (T-koodi)
 *   min    kokonaisaika (min), w työaika (min), sv annokset
 *   d      kuvaus (näkyy kortissa ja ruoan sivulla)
 *   ing    ainekset "nimi määrä yksikkö"; rivi "# Otsikko" aloittaa ainesosion
 *   steps  työvaiheet
 *   serve  tarjoiluehdotus tekstinä ("Tarjoa riisin tai pastan kanssa.")
 *   sides  lisukereseptien id:t, extras valmiit tuotteet ("puolukkahillo")
 *   tips   tekniikkavinkit (pelkkää tekstiä)
 *   tw     muunnelmat, joita voi olla päällä useita:
 *          {id, n, d, add:[rivit], rm:[ainekset], step:{indeksi:teksti}, ins:[[indeksi, teksti]], del:[indeksit], m, g}
 *          (indeksit viittaavat aina perusreseptin vaiheisiin)
 *          g = ryhmä: saman ryhmän muunnelmista voi olla valittuna vain yksi (samoin, jos ne poistavat saman aineksen)
 *          Jos muunnelma vaihtaa tai lisää aineksen, päivitä myös vaiheet (step/ins), muuten ohje jää vanhaksi.
 *   vs     versiot, joista valitaan yksi; ensimmäinen on oletus. Reseptin ing sisältää vain kaikille
 *          versioille yhteiset ainekset, ja versio tuo omansa add-kentässä:
 *          {id, n, add, rm, step, ins, m, veg}
 *   vh     version ainesten otsikko (oletus "Täytteet")
 *   src    lähteet [[nimi, url], ...]
 *   pop    suosittu (näkyy "Suosittu"-merkintänä)
 *   aka    muut nimet, joilla resepti löytyy haulla (esim. vanha nimi)
 *   perus  perusateria ilman reseptiä (ei lähdettä), ml aterian kohdat: a aamupala, l lounas, p päivällinen,
 *          v välipala, i iltapala, e eväs
 *   batch  erä: hinta koko erälle ja määrä erinä (leivonnaisissa aina); yu = kappaleiden yksikkö ("lasia", oletus "kpl")
 *   wd, fe, jf, kq, mo  kuten ennenkin (maailmalta, juhlapyhä, juhlaruoka, airfryer/grilli, pääraaka-aine käsin)
 */

export const slug = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o")
    .replace(/é/g, "e")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/* ainesrivit: "# Otsikko" -rivit muuttuvat osioiksi [aloitusindeksi, otsikko] */
export function splitGroups(lines) {
  const ing = [], gr = [];
  for (const l of lines || []) {
    const s = String(l).trim();
    if (!s) continue;
    if (s.startsWith("#")) gr.push([ing.length, s.replace(/^#+\s*/, "")]);
    else ing.push(s);
  }
  return { ing, gr: gr.filter((g, i) => g[0] < ing.length && (i === gr.length - 1 || gr[i + 1][0] > g[0])) };
}

const cleanList = (a) => (Array.isArray(a) ? a.filter((x) => x && typeof x === "object" && x.id && x.n) : []);

export function fromLib(e) {
  const { ing, gr } = splitGroups(e.ing);
  return {
    id: e.id || "k-" + slug(e.n),
    name: e.n,
    m: e.m || "",
    mo: e.mo || "",
    t: e.t || "",
    s: [],
    min: +e.min || 0,
    w: +e.w || 0,
    d: e.d || "",
    ing,
    gr,
    steps: (e.steps || []).slice(),
    url: "",
    custom: false,
    sv: +e.sv || 4,
    ns: [],
    wd: e.wd || "",
    fe: e.fe || "",
    jf: !!e.jf,
    kq: e.kq || [],
    pop: !!e.pop,
    serve: e.serve || "",
    sides: e.sides || [],
    extras: e.extras || [],
    tips: e.tips || [],
    tw: cleanList(e.tw),
    vs: cleanList(e.vs),
    src: e.src || [],
    vh: e.vh || "",
    aka: e.aka || [],
    batch: !!e.batch || e.t === "le",
    yu: e.yu || "",
    perus: !!e.perus,
    ml: Array.isArray(e.ml) ? e.ml : [],
  };
}

/* rivin avain: sama päättely kuin sovelluksen parseIng, annetaan parametrina */
const hits = (keyOf, line, keys) => {
  const k = keyOf(line);
  return keys.some((x) => k === x || k.startsWith(x + " ") || line.startsWith(x + " ") || line === x);
};

/* valinta = {v: versio-id, t: [muunnelma-id:t]} */
export function selOf(r, sel) {
  const s = sel || {};
  const ver = r.vs && r.vs.length ? r.vs.find((x) => x.id === s.v) || null : null;
  const tws = r.tw && r.tw.length ? r.tw.filter((x) => (s.t || []).includes(x.id)) : [];
  return { ver: ver || (r.vs && r.vs.length ? r.vs[0] : null), tws };
}

/* ainekset, osiot ja vaiheet valintojen mukaan */
export function applySel(r, sel, keyOf) {
  const { ver, tws } = selOf(r, sel);
  const mods = [ver, ...tws].filter(Boolean);
  if (!mods.length) return { ing: r.ing, gr: r.gr || [], steps: r.steps, mods };
  let rows = r.ing.map((l, i) => ({ l, i }));
  const addV = [], addT = [];
  for (const m of mods) {
    if (m.rm && m.rm.length) rows = rows.filter((x) => !hits(keyOf, x.l, m.rm));
    if (m.add) (m === ver ? addV : addT).push(...m.add);
  }
  const ing = rows.map((x) => x.l).concat(addV, addT);
  /* osiot: uusi aloitusindeksi = ensimmäinen säilynyt rivi alkuperäisestä aloituskohdasta eteenpäin */
  const gr = [];
  const G = r.gr || [];
  G.forEach(([st, h], k) => {
    const end = k + 1 < G.length ? G[k + 1][0] : Infinity;
    const j = rows.findIndex((x) => x.i >= st && x.i < end);
    if (j >= 0) gr.push([j, h]);
  });
  if (gr.length || (addV.length && r.ing.length)) {
    if (addV.length) gr.push([rows.length, r.vh || "Täytteet"]);
    if (addT.length) gr.push([rows.length + addV.length, "Lisäksi"]);
  }
  /* vaiheet: korvaukset (step), lisäykset alkuperäisen vaiheen perään (ins, -1 = alkuun) ja poistot (del) */
  const rep = {}, after = {}, del = new Set();
  for (const m of mods) {
    if (m.step) for (const [i, t] of Object.entries(m.step)) rep[+i] = t;
    if (m.ins) for (const [i, t] of m.ins) (after[+i] = after[+i] || []).push(t);
    if (m.del) for (const i of m.del) del.add(+i);
  }
  const steps = [...(after[-1] || [])];
  r.steps.forEach((t, i) => {
    if (!del.has(i)) steps.push(rep[i] != null ? rep[i] : t);
    if (after[i]) steps.push(...after[i]);
  });
  return { ing, gr, steps, mods };
}

/* kaikki ainesrivit, jotka jokin versio tai muunnelma voi tuoda (hakua varten) */
export function optLines(r) {
  const o = [];
  for (const m of [...(r.vs || []), ...(r.tw || [])]) for (const l of m.add || []) o.push([l, m]);
  return o;
}
