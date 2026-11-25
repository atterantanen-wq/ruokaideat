/* Kaappi: mitä kotoa löytyy, ja ruokaehdotukset sen mukaan (logiikka: ../pantry.js) */
import "./plan-view.js";
import {$,IC,ico,esc,parseIng,workOf} from "./core.js";
import {catFind,CAT,fold,fzBest,pantryHit,servOf,fmtDur} from "./catalog.js";
import {todayLocal,state,mutate} from "./state.js";
import {byId} from "./ideas.js";
import {openDlg} from "./info.js";
import {capF} from "./registry.js";
import {planHooks,plCands,plDefaults,ingFor,renderPlan} from "./plan-view.js";
import * as PL from "../planner.js";
import * as KP from "../pantry.js";

Object.assign(IC,{
  pantry:'<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M5 10h14M8.5 6.5v1M8.5 13.5v2"/>'
});
const BX=new Set(KP.BASIC_EXTRA);
/* pääraaka-aineet: liha, kana, kala ja makkara (rekisterin pääraaka-ainekenttä) */
const MAINM="jkfpns";
/* reseptirivin avain rekisterin muotoon */
const canon=k=>{const c=catFind(k);return c?c.key:k;};
const depOf=k=>{const c=catFind(k);return c?c.d:18;};
const isBasic=k=>BX.has(k)||pantryHit(k);
const kp=()=>state.kp||(state.kp={h:[],no:[]});
const noSet=()=>new Set(kp().no);
/* vanhentuneet tuoretuotteet pois kaapista */
function prune(){
  const h=kp().h,n=KP.prune(h,todayLocal(),depOf);
  if(n.length!==h.length){kp().h=n;mutate();}
}
const left=it=>KP.daysLeft(it,todayLocal(),depOf(it.k));
const soonSet=()=>new Set(kp().h.filter(it=>{const l=left(it);return l!=null&&l<=KP.SOON_DAYS;}).map(it=>it.k));
/* kaapin tarkistuksen esivalinta: vähän kuluvat kaappitavarat (ellei merkitty puuttuvaksi) ja kaappiin merkityt.
   Muut perusaineet (voi, jauhot, sipuli…) vain ehdotuksiin, jotta niitä ei jää ostamatta. */
export function kpHave(key){
  const k=canon(key);
  if(pantryHit(key)||pantryHit(k))return !noSet().has(k);
  return KP.haveMap(kp().h).has(k);
}
planHooks.have=kpHave;

/* ruokien tarvitsemat ainekset versioittain (ilman kotoa löytyviä perusaineita) */
let needMemo=null;
function needs(){
  if(needMemo)return needMemo;
  const out=[],no=noSet(),cnt=new Map();
  for(const c of plCands()){
    const r=byId(c.id);if(!r)continue;
    const vs=(r.vs||[]).length>1?r.vs.map((v,i)=>i?v.id:""):[""];
    /* muunnelmat, jotka tuovat ruokaan oman aineksen (esim. Bataatilla): kaapissa oleva aines voi nostaa muunnelman ehdotukseksi.
       Yksi muunnelma kerrallaan, joten saman ryhmän (g) muunnelmat eivät tule yhtä aikaa. */
    const tws=[["",[]]];
    for(const m of r.tw||[]){
      const tk=(m.add||[]).map(l=>{const p=parseIng(l);return isBasic(p.key)?"":canon(p.key);}).filter(Boolean);
      if(tk.length)tws.push([m.id,tk]);
    }
    for(const v of vs)for(const [t,tk] of tws){
      const need=[],main=[];
      for(const line of ingFor(r,servOf(r),v,t?[t]:[])){
        const p=parseIng(line),k=canon(p.key);
        if(k==="vesi")continue;
        if(isBasic(p.key)||isBasic(k)){if(!v&&!t)cnt.set(k,(cnt.get(k)||0)+1);if(!no.has(k))continue;}
        need.push(k);
        const e=catFind(k);if(e&&e.m&&MAINM.includes(e.m))main.push(k);
      }
      out.push({id:c.id,v,t,tk,need,main});
    }
  }
  /* perusaineet, joita ruoissa käytetään, yleisimmät ensin */
  const basics=[...cnt].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],"fi")).map(x=>x[0]);
  return needMemo={list:out,basics};
}
const nm=k=>KP.nameOf(k);
const inPlan=(id)=>state.pl.items.some(it=>it.id===id);

/* ---------- Suunnitelma-sivun sisäänkäynti ---------- */
planHooks.entry=()=>{
  prune();
  const h=kp().h,names=h.map(it=>nm(it.k));
  const sub=h.length?`Kaapissa: ${esc(names.slice(0,3).join(", "))}${names.length>3?` +${names.length-3}`:""}`:"Merkitse, mitä kotoa löytyy, niin saat ruokaideat sen mukaan.";
  return`<button type="button" class="kp-entry" data-kpo="${h.length?"sg":"kp"}">${ico("pantry")}<span><b>Ehdota kaapin mukaan</b><small>${sub}</small></span>${ico("right")}</button>`;
};
$("planBody").addEventListener("click",e=>{const b=e.target.closest("[data-kpo]");if(b)kpOpen(b.dataset.kpo);});

/* ---------- kaappi-ikkuna ---------- */
let view="kp",q="",basicsOpen=false,moreOpen=false;
/* muista osumista näytetään ensin näin monta */
const MORE_N=8;
function kpOpen(v){needMemo=null;prune();view=v||"kp";q="";basicsOpen=false;moreOpen=false;render();$("kpdlg").showModal();$("kpbody").scrollTop=0;}
function suggestions(){
  const have=KP.haveMap(kp().h);
  return KP.split(KP.rank(needs().list,have,soonSet()));
}
function render(){
  const b=$("kpbody");if(!b)return;
  const h=kp().h,sg=h.length?suggestions():{near:[],more:[]},nSg=sg.near.length+sg.more.length;
  const seg=`<div class="pn-seg kp-seg" role="group" aria-label="Näkymä"><button type="button" data-kv="kp" aria-pressed="${view==="kp"}">Kaappi${h.length?` (${h.length})`:""}</button><button type="button" data-kv="sg" aria-pressed="${view==="sg"}">Ehdotukset${nSg?` (${nSg})`:""}</button></div>`;
  b.innerHTML=`<button type="button" class="dx" data-kx="1" aria-label="Sulje">${ico("x")}</button><h2 class="dh">${view==="kp"?"Mitä kaapista löytyy?":"Ruokaehdotukset"}</h2>${seg}
    ${view==="kp"?kpHtml(nSg):sgHtml(sg)}`;
}
function kpHtml(nSg){
  const h=kp().h,have=new Set(h.map(it=>it.k));
  const chipH=it=>{const l=left(it),lt=l==null?"":l<=KP.SOON_DAYS?` · vanhenee ${l<=1?"huomenna":l+" pv"}`:` · ${l} pv`;
    return`<button type="button" class="chip kp-on${l!=null&&l<=KP.SOON_DAYS?" soon":""}" data-kr="${esc(it.k)}" aria-label="Poista kaapista: ${esc(nm(it.k))}">${esc(capF(nm(it.k)))}<span class="kp-d">${esc(lt)}</span>${ico("x")}</button>`;};
  const quick=KP.QUICK.filter(k=>!have.has(k));
  const qf=fold(q.trim());
  let res="";
  if(qf){
    const seen=new Set(),hits=[];
    for(const e of CAT){
      if(e.neg||e.pan||isBasic(e.key))continue;
      const s=fzBest(qf,[e.key,...e.syn]);if(s<0)continue;
      const g=Object.keys(KP.GROUPS).find(g=>KP.GROUPS[g][1].includes(e.key)),k=g||e.key;
      if(seen.has(k))continue;seen.add(k);hits.push([s,k]);
    }
    hits.sort((a,b)=>a[0]-b[0]||nm(a[1]).localeCompare(nm(b[1]),"fi"));
    res=hits.length?`<div class="chips">${hits.slice(0,10).map(([,k])=>have.has(k)?`<button type="button" class="chip" disabled>${ico("check")}${esc(capF(nm(k)))}</button>`:`<button type="button" class="chip" data-ka="${esc(k)}">${ico("plus")}${esc(capF(nm(k)))}</button>`).join("")}</div>`:`<p class="note">Ei osumia.</p>`;
  }
  const no=noSet(),bs=needs().basics,bOff=bs.filter(k=>no.has(k));
  const basics=`<div class="kp-bas"><button type="button" class="kp-bh" data-kb="1" aria-expanded="${basicsOpen}"><span><b>Perusaineet löytyvät</b><small>${bOff.length?`Puuttuu: ${esc(bOff.map(capF).join(", "))}`:"Suola, mausteet, öljy, jauhot, sokeri, voi, sipuli ja valkosipuli"}</small></span>${ico(basicsOpen?"up":"down")}</button>
    ${basicsOpen?`<p class="note">Näitä ei tarvitse merkitä. Napauta pois, jos jokin on loppu.</p><div class="chips">${bs.map(k=>`<button type="button" class="chip" data-kn="${esc(k)}" aria-pressed="${!no.has(k)}" aria-label="${esc(capF(k))}: ${no.has(k)?"loppu":"löytyy"}">${!no.has(k)?ico("check"):""}${esc(capF(k))}</button>`).join("")}</div>`:""}</div>`;
  return`<p class="note">Merkitse pääraaka-aineet, jotka löytyvät kotoa. Tuoretuotteet poistuvat kaapista viikossa.</p>
    ${h.length?`<h3 class="pn-h">Kaapissa</h3><div class="chips">${h.map(chipH).join("")}</div>`:""}
    ${quick.length?`<h3 class="pn-h">Pikavalinnat</h3><div class="chips">${quick.map(k=>`<button type="button" class="chip" data-ka="${esc(k)}">${ico("plus")}${esc(capF(nm(k)))}</button>`).join("")}</div>`:""}
    <h3 class="pn-h">Muut ainekset</h3><input id="kpq" type="search" placeholder="Hae ainesta, esim. kinkku" autocomplete="off" value="${esc(q)}" aria-label="Hae ainesta">${res}
    ${basics}
    <div class="actions kp-foot">${h.length?`<button type="button" class="go" data-kv="sg" style="width:100%">Näytä ehdotukset${nSg?` (${nSg})`:""}</button>`:`<button type="button" class="go" disabled style="width:100%">Valitse ensin ainekset</button>`}</div>
    ${h.length?`<p class="kp-clr"><button type="button" class="lk" data-kc="1">Tyhjennä kaappi</button></p>`:""}`;
}
function sgRow(x){
  const r=byId(x.id);if(!r)return"";
  const ver=x.v&&(r.vs||[]).find(v=>v.id===x.v),tw=x.t&&(r.tw||[]).find(m=>m.id===x.t);
  const st=x.miss.length?`<span class="kp-miss">Puuttuu ${x.miss.length}: ${esc(x.miss.join(", "))}</span>`:`<span class="kp-all">${ico("check")}Kaikki löytyy</span>`;
  const extra=x.minor.length?`<small>Lisäksi tarvittaessa: ${esc(x.minor.join(", "))}</small>`:"";
  const on=inPlan(x.id),full=state.pl.items.length>=10;
  return`<li class="kp-sg"><div class="kp-sgt"><button type="button" class="kp-nm" data-kopen="${esc(x.id)}">${esc(r.name)}${ver?`<span class="pn-ver"> – ${esc(ver.n)}</span>`:""}</button>
    ${tw?`<span class="kp-tw">Muunnelma: ${esc(tw.n)}</span>`:""}${st}<small>Kaapista: ${esc(x.hit.map(nm).join(", "))} · ${fmtDur(workOf(r)||r.min||0)}</small>${extra}</div>
    ${on?`<button type="button" class="cartbtn kp-add" disabled>${ico("check")}<span>Lisätty</span></button>`:`<button type="button" class="cartbtn kp-add" data-kadd="${esc(x.id)}" data-v="${esc(x.v)}" data-t="${esc(x.t)}"${full?" disabled":""} aria-label="Lisää suunnitelmaan: ${esc(r.name)}${tw?", "+esc(tw.n):""}">${ico("plus")}<span>Lisää</span></button>`}</li>`;
}
function sgHtml({near,more}){
  if(!kp().h.length)return`<p class="note">Merkitse ensin, mitä kaapista löytyy. Perusaineita ei tarvitse merkitä.</p><div class="actions"><button type="button" class="go" data-kv="kp" style="width:100%">Merkitse ainekset</button></div>`;
  if(!near.length&&!more.length)return`<p class="note">Kaapin aineksilla ei löytynyt ruokia. Lisää vielä jokin pääraaka-aine.</p><div class="actions"><button type="button" class="go" data-kv="kp" style="width:100%">Muokkaa kaappia</button></div>`;
  const soon=near.filter(x=>x.soon.length).slice(0,3),rest=near.filter(x=>!soon.includes(x));
  const n=state.pl.items.length,shown=moreOpen?more:more.slice(0,MORE_N);
  return`<p class="note">${near.length?"Ensin ruoat, joihin puuttuu vähiten aineksia.":"Mikään ruoka ei ole vielä lähes valmis. Alla ruoat, joissa kaapin aineksia käytetään."} Perusaineet oletetaan löytyvän.${n?` Suunnitelmassa ${n} ${n===1?"ruoka":"ruokaa"}.`:""}</p>
    ${soon.length?`<h3 class="pn-h">Käytä pian vanhenevat</h3><ul class="kp-sgs">${soon.map(sgRow).join("")}</ul>`:""}
    ${rest.length?`<h3 class="pn-h">${soon.length?"Muut osumat":"Parhaat osumat"}</h3><ul class="kp-sgs">${rest.map(sgRow).join("")}</ul>`:""}
    ${more.length?`<h3 class="pn-h">Käyttävät kaapin aineksia (${more.length})</h3>${near.length?`<p class="note">Näistä puuttuu enemmän aineksia, lähimmät ensin.</p>`:""}<ul class="kp-sgs kp-more">${shown.map(sgRow).join("")}</ul>
      ${more.length>shown.length?`<p class="kp-clr"><button type="button" class="lk" data-kmore="1">Näytä kaikki ${more.length}</button></p>`:""}`:""}
    <div class="actions kp-foot"><button type="button" class="go" data-kx="1" style="width:100%">Valmis</button></div>`;
}
function addToPlan(id,v,t){
  const pl=state.pl;if(pl.items.length>=10||inPlan(id))return;
  const c=plCands().find(x=>x.id===id);if(!c)return;
  const it={tg:[c.arki?"a":"w"],id,v:v||""};plDefaults(it);
  const r=byId(id);if(t&&(r.tw||[]).some(m=>m.id===t))it.t=[t];
  pl.items.push(it);pl.n=pl.items.length;
}
$("kpbody").addEventListener("input",e=>{if(e.target.id!=="kpq")return;q=e.target.value;const pos=e.target.selectionStart;render();const i=$("kpq");i.focus();try{i.setSelectionRange(pos,pos);}catch(x){}});
$("kpbody").addEventListener("click",e=>{
  const t=e.target.closest("button");if(!t)return;
  const d=t.dataset,K=kp();
  if(d.kx){$("kpdlg").close();return;}
  if(d.kv){view=d.kv;render();$("kpbody").scrollTop=0;return;}
  if(d.kopen){openDlg(d.kopen);return;}
  if(d.kb){basicsOpen=!basicsOpen;return render();}
  if(d.kmore){moreOpen=true;return render();}
  if(d.ka){if(!K.h.some(it=>it.k===d.ka))K.h.push({k:d.ka,d:todayLocal()});q="";}
  else if(d.kr)K.h=K.h.filter(it=>it.k!==d.kr);
  else if(d.kn){K.no=K.no.includes(d.kn)?K.no.filter(k=>k!==d.kn):[...K.no,d.kn];needMemo=null;}
  else if(d.kc)K.h=[];
  else if(d.kadd)addToPlan(d.kadd,d.v,d.t);
  else return;
  mutate();renderPlan();render();
});
$("kpdlg").addEventListener("close",()=>{q="";});
