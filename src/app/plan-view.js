/* Suunnitelma-välilehden näkymä (logiikka: ../planner.js) ja kaapin tarkistus */
import "./start.js";
import {$,IC,ico,esc,isPop,workOf,parseIng} from "./core.js";
import {fold,fzBest,mainOf,pantryHit,costOf,costBake,eur1,fmtDur,servOf,isBatch,scaleLine,hasOpt,keyOfLine} from "./catalog.js";
import {todayLocal,state,persist,mutate} from "./state.js";
import {all,byId,tagsOf,MEAL_MAIN,mealOf,sideSug,isFav,imgUrl} from "./ideas.js";
import {LAYH} from "./search.js";
import {shopping,qtyText,newList,flashToast,undoToast,hideToast,groupDeps,storeName} from "./cart.js";
import {openDlg} from "./info.js";
import {showTab} from "./tabs.js";
import {capF} from "./registry.js";
import {applySel} from "../recipes.js";
import * as PL from "../planner.js";

/* ---------- suunnitelma ---------- */
Object.assign(IC,{
  lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  unlock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>',
  shuffle:'<path d="M16 4h4v4M20 4l-6 6M4 20l6-6M16 20h4v-4M20 20l-5-5M4 4l5 5"/>',
  minus:'<path d="M6 12h12"/>'
});
/* kaappi (pantry-view.js): ehdotusnäkymän sisäänkäynti ja kaapin tarkistuksen esivalinta */
export const planHooks={entry:()=>"",have:null};
let planCount=4,planAdd=null,planNew=-1,planPick=null,planEdit=null,planChk=null,planUndo=null,planOpen={sn:false,bk:false,vk:false};
const fmtN=n=>String(Math.round(n*2)/2).replace(".",",");
/* reseptin raaka-ainerivit valitulla annosmäärällä, versiolla ja muunnelmilla (t = null: ruoan omat valinnat) */
export function ingFor(r,n,v,t){
  const sel=state.tv[r.id]||{};
  const a=hasOpt(r)?applySel(r,{v:v||sel.v,t:Array.isArray(t)?t:(sel.t||[])},keyOfLine).ing:r.ing;
  const f=n/servOf(r);
  return f===1?a:a.map(l=>scaleLine(l,f));
}
/* koko reseptin hinta annosta kohden (pienet ainekset karsitaan koko reseptin tasolla) */
const plCostMemo=new Map();
export function plCostPer(r,v,t){
  const k=r.id+"|"+(v||"")+"|"+(Array.isArray(t)?t.join(","):JSON.stringify(state.tv[r.id]||{}));
  if(plCostMemo.has(k))return plCostMemo.get(k);
  let sum=0;
  for(const line of ingFor(r,servOf(r),v,t)){const p=parseIng(line);if(p.v==null)continue;const x=isBatch(r)?costBake(p.key,p.fam,p.v):costOf(p.key,p.fam,p.v);if(x.t==="ok")sum+=x.c;}
  const per=sum/(servOf(r)||1);plCostMemo.set(k,per);return per;
}
const isVegR=r=>["v","y"].includes(mainOf(r));
const PL_addDays=(iso,n)=>{const d=new Date(iso+"T12:00:00");d.setDate(d.getDate()+n);return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;};
let plCandsMemo=null;
/* viikonloppu: enemmän aikaa vievät ruoat ja herkuttelu (pizza, hampurilaiset, pihvit, uuniruoat); juhla: juhlapöytään merkityt ja juhlapyhien ruoat */
const WKND=/pizza|hampurilai|burger|taco|tortill|fajita|kebab|pulled|grilli|pippuripihvi|paisti|lasagne|uunilohi|butter chicken|tikka|lammas|karitsa|ribs|siivet|nachos|wings|moussaka|risotto/i;
/* juhlapyhien ruoat (joulu ym.) vain Juhla-sirulla */
const plWknd=(r,meal)=>!r.fe&&(meal.includes("j")||WKND.test(r.name));
/* pääruoat ehdokkaiksi */
export function plCands(){
  if(plCandsMemo)return plCandsMemo;
  const recent=new Set(),lim=PL_addDays(todayLocal(),-14);
  for(const l of state.lists)if(l.d>=lim){l.cart.forEach(i=>recent.add(i));(l.pl||[]).forEach(e=>recent.add(e.id));}
  const out=[];
  for(const r of all()){
    if(!MEAL_MAIN.has(r.t)||r.perus||r.nopl||isBatch(r)||!r.ing.length)continue;
    /* ruoat, jotka on merkitty vain aamu-, väli- tai iltapalaksi, eivät ole pääruokia */
    if((r.ml||[]).length&&!r.ml.includes("p")&&!r.ml.includes("l"))continue;
    const vegV=(r.vs||[]).find(v=>v.veg||v.m==="v"||v.m==="y"),fishV=(r.vs||[]).find(v=>v.m==="f");
    const meal=mealOf(r),tags=tagsOf(r);
    out.push({id:r.id,name:r.name,t:r.t,main:mainOf(r),veg:isVegR(r)||!!vegV,vegV:isVegR(r)?"":(vegV?vegV.id:""),fish:mainOf(r)==="f"||!!fishV,fishV:mainOf(r)==="f"?"":(fishV?fishV.id:""),
      arki:meal.includes("a"),wknd:plWknd(r,meal),juhla:!!r.jf||!!r.fe,holiday:!!r.fe&&!r.jf,cheap:tags.includes("e"),light:tags.includes("k"),
      work:workOf(r)||r.min||0,cost:plCostPer(r,""),fav:isFav(r.id),pop:isPop(r),recent:recent.has(r.id)});
  }
  return plCandsMemo=out;
}
/* aamu- ja välipalat: perusateriat ja nopeat (ml a, v tai i) */
const plSnacks=()=>all().filter(r=>(r.ml||[]).some(x=>"avi".includes(x))&&(r.perus||(workOf(r)||r.min)<=15)&&!isBatch(r)).sort((a,b)=>(b.perus-a.perus)||a.name.localeCompare(b.name,"fi"));
const plBakes=()=>all().filter(r=>r.t==="le").sort((a,b)=>(isFav(b.id)-isFav(a.id))||(isPop(b)-isPop(a))||a.name.localeCompare(b.name,"fi"));
const VK_SUG=["maito","ruisleipä","juusto","kahvi","banaanit","omenat","kananmunat","levite","jogurtti","leikkeleet","mehu","näkkileipä"];
/* lisukkeet: "id" tai "id:versio" */
const sdParse=s=>{const[id,v]=String(s).split(":");return{id,v:v||""};};
const sdBase=s=>{const x=byId(sdParse(s).id);return x?x.name:"";};
function sdName(s){const{id,v}=sdParse(s),r=byId(id);if(!r)return"";const ver=v&&(r.vs||[]).find((x,j)=>j>0&&x.id===v);return r.name+(ver?" – "+ver.n:"");}
/* ruoan oletusvalinnat: ensimmäinen suositeltu lisuke */
export function plDefaults(it){
  const r=byId(it.id);it.t=[];it.px=[];it.sd=[];if(!r)return;
  /* lisuke: reseptin oma ehdotus, muuten ruokakortin ensimmäinen ehdotus */
  const own=(r.sides||[]).find(x=>byId(sdParse(x).id));
  if(own)it.sd=[own];
  else{const g=sideSug(r),x=g&&[...g.out.c,...g.out.v].find(y=>y.t==="r");if(x)it.sd=[x.id+(x.ver?":"+x.ver:"")];}
  /* valmis tuote: reseptin ensimmäinen, keittoon leipä */
  const ex=(r.extras||[]).map(k=>String(k).toLowerCase()).find(k=>vkOk(k));
  if(ex)it.px=[ex];else if(r.t==="ke")it.px=["ruisleipä"];
}
/* annokset: reseptin oma annosmäärä (määrät on mitoitettu pakkauksiin), ruoalle voi asettaa oman */
export function autoN(it){const r=byId(it.id);return r?servOf(r)||4:4;}
const plN=it=>it.n>0?it.n:autoN(it);
/* ehdotukseen vaihtelua: ilman kasvis- tai kalarajausta versio arvotaan (pizza: kinkku-ananas, salami…) */
function plVary(it){
  const r=byId(it.id);if(!r||it.v||(r.vs||[]).length<2||it.tg.includes("v")||it.tg.includes("f"))return;
  const v=r.vs[Math.floor(Math.random()*r.vs.length)];it.v=v===r.vs[0]?"":v.id;
}
const plOnPick=it=>{plVary(it);plDefaults(it);};
const plFill=(fresh=false)=>{PL.fill(plCands(),state.pl,Math.random,fresh,new Date(),plOnPick);state.pl.n=state.pl.items.length;};
function plItemCost(it){
  const r=byId(it.id);if(!r)return 0;const n=plN(it);
  let c=plCostPer(r,it.v,it.t||[])*n;
  for(const s of it.sd||[])c+=sdCost(s,n);
  return c;
}
/* lisukkeen hinta annoksille n */
function sdCost(s,n){const{id,v}=sdParse(s),x=byId(id);return x?plCostPer(x,v,[])*n:0;}
const sdPrice=(s,n)=>{const c=sdCost(s,n);return c>0?eur1(c):"";};
/* Lisäksi kaupasta (aamu- ja välipalat, leivonta, vakiot) ja hinta-arvio ovat vielä kesken: piilossa, kunnes valmiit */
const PL_EXTRAS=false;
function plTotals(){
  const pl=state.pl;let food=0,extra=0;
  for(const it of pl.items)food+=plItemCost(it);
  if(!PL_EXTRAS)return{food,extra};
  for(const[id,n]of Object.entries(pl.sn)){const r=byId(id);if(r)extra+=plCostPer(r,"")*n;}
  for(const id of pl.bk){const r=byId(id);if(r)extra+=plCostPer(r,"")*servOf(r);}
  return{food,extra};
}
/* kortin sirut: lisukkeet ja tuotteet avaavat lisukevalinnan, muunnelmat muunnelmavalinnan */
function rowChips(it,i){
  const r=byId(it.id);if(!r)return"";
  const out=[],n=plN(it),b=(to,cls,html)=>`<button type="button" class="pn-tg ${cls}" data-pa="edit" data-to="${to}" data-i="${i}">${html}</button>`;
  for(const s of it.sd||[])out.push(b("sd","on",`${ico("check")}${esc(sdBase(s))}<span class="pn-pc">${sdPrice(s,n)}</span>`));
  for(const k of (it.px||[]).filter(k=>!vkOn(k)))out.push(b("sd","on",`${ico("check")}${esc(capF(k))}`));
  if(!(it.sd||[]).length){const g=sideSug(r);if(g&&[...g.out.c,...g.out.v].some(y=>y.t==="r"))out.push(b("sd","pn-twh",`${ico("plus")}Lisuke`));}
  for(const t of it.t||[]){const m=(r.tw||[]).find(x=>x.id===t);if(m)out.push(b("tw","tw",esc(m.n)));}
  if(!(it.t||[]).length&&(r.tw||[]).length)out.push(b("tw","pn-twh",r.tw.length===1?"1 muunnelma":r.tw.length+" muunnelmaa"));
  return out.length?`<div class="pn-tags">${out.join("")}</div>`:"";
}
/* kuvat korteissa: kokeilu (false = ei kuvia, true = oma kuva tai ruokatyypin värillinen paikka) */
export let PL_PICS=false;
export function setPlPics(v){return PL_PICS=!!v;}
const thumb=r=>{const u=imgUrl(r);return`<span class="pn-th" style="--h:${LAYH[r.t]||30}" aria-hidden="true">${u?`<img alt="" loading="lazy" src="${esc(u)}">`:ico("chef")}</span>`;};
/* kortin lappu: pääryhmä lyhyesti, rajauksista ensimmäinen ja määrä */
const MT_SHORT={a:"Arki",w:"Viikonloppu"};
export function renderPlan(){
  const h=$("planBody");if(!h)return;
  plCostMemo.clear();plCandsMemo=null;
  const pl=state.pl;
  if(pl.n!==pl.items.length){pl.n=pl.items.length;persist();}
  const tot=plTotals(),over=pl.ba>0&&tot.food+tot.extra>pl.ba;
  const rows=pl.items.map((it,i)=>{
    const r=it.id&&byId(it.id);
    const ver=r&&(r.vs||[]).length>1&&((it.v&&r.vs.find(v=>v.id===it.v))||r.vs[0]);
    const mt=PL.mainTag(it.tg)||"a",ex=it.tg.filter(t=>t!=="a"&&t!=="w").map(t=>PL.TAG_N[t]);
    const labs=`<div class="pn-labs"><button type="button" class="pn-lab pn-lab-${mt}" data-pa="type" data-to="main" data-i="${i}" aria-label="Pääryhmä, ruoka ${i+1}: ${esc(PL.TAG_N[mt])}">${esc(MT_SHORT[mt])} ▾</button><button type="button" class="pn-lab pn-lab-x${ex.length?"":" none"}" data-pa="type" data-to="ex" data-i="${i}" aria-label="Rajaukset, ruoka ${i+1}: ${esc(ex.join(", ")||"ei rajauksia")}">${ex.length?esc(ex[0])+(ex.length>1?` +${ex.length-1}`:"")+" ▾":"+ Rajaus"}</button></div>`;
    const acts=`<span class="pn-act"><button type="button" class="pn-ib" data-pa="swap" data-i="${i}" aria-label="Arvo toinen ruoka ${i+1}">${ico("shuffle")}</button><button type="button" class="pn-ib" data-pa="pick" data-i="${i}" aria-label="Hae ruoka ${i+1}">${ico("search")}</button><button type="button" class="pn-ib" data-pa="rm" data-i="${i}" aria-label="Poista suunnitelmasta: ruoka ${i+1}">${ico("x")}</button></span>`;
    const body=r?`<div class="pn-main" data-pa="edit" data-i="${i}">${PL_PICS?thumb(r):""}<div class="pn-mt"><div class="pn-nr"><span class="pn-name">${esc(r.name)}${ver?`<span class="pn-ver"> – ${esc(ver.n)}</span>`:""}</span>${acts}</div>${rowChips(it,i)}</div></div>
      <button type="button" class="pn-open" data-pa="edit" data-i="${i}" aria-label="Muokkaa: ${esc(r.name)}"><span>${fmtN(plN(it))} annosta · ${fmtDur(workOf(r)||r.min||0)}</span><b>${eur1(plItemCost(it))}</b><span class="pn-ed">Muokkaa${ico("right")}</span></button>`
      :`<div class="pn-main"><div class="pn-mt"><div class="pn-nr"><span class="pn-name muted">Ei ruokaa näillä valinnoilla</span>${acts}</div><p class="note">Muuta valintoja tai hae ruoka itse.</p><button type="button" class="lk" data-pa="pick" data-i="${i}">Hae ruoka</button></div></div>`;
    return`<li class="pn-item${planNew===i?" pn-new":""}${r?" pn-click":""}${PL_PICS?" pics":""}" data-i="${i}"><div class="pn-row1">${labs}</div>${body}</li>`;
  }).join("");
  const snacks=plSnacks(),bakes=plBakes();
  const snSel=Object.keys(pl.sn).filter(id=>byId(id));
  const sec=(k,title,sum,inner)=>`<div class="pn-x"><button type="button" class="pn-xh" data-pa="xo" data-k="${k}" aria-expanded="${planOpen[k]}"><span><b>${title}</b><small>${sum}</small></span>${ico(planOpen[k]?"up":"down")}</button>${planOpen[k]?`<div class="pn-xb">${inner}</div>`:""}</div>`;
  const snSum=snSel.length?snSel.map(id=>`${esc(byId(id).name)} ×${fmtN(pl.sn[id])}`).join(" · "):"ei valittu";
  const snInner=`${snSel.map(id=>`<div class="pn-step"><span>${esc(byId(id).name)}</span><div><button type="button" class="pn-ib sm" data-pa="sn" data-id="${esc(id)}" data-d="-1" aria-label="Vähemmän: ${esc(byId(id).name)}">${ico("minus")}</button><b>${fmtN(pl.sn[id])}</b><button type="button" class="pn-ib sm" data-pa="sn" data-id="${esc(id)}" data-d="1" aria-label="Enemmän: ${esc(byId(id).name)}">${ico("plus")}</button></div></div>`).join("")}
    <p class="note">Määrä on annoksia. Lisää napauttamalla:</p><div class="chips">${snacks.filter(r=>!pl.sn[r.id]).map(r=>`<button type="button" class="chip" data-pa="sn" data-id="${esc(r.id)}" data-d="1">${ico("plus")}${esc(r.name)}</button>`).join("")}</div>`;
  const bkSum=pl.bk.filter(id=>byId(id)).map(id=>esc(byId(id).name)).join(" · ")||"ei valittu";
  const bkInner=`<div class="chips">${bakes.slice(0,24).map(r=>`<button type="button" class="chip" data-pa="bk" data-id="${esc(r.id)}" aria-pressed="${pl.bk.includes(r.id)}">${pl.bk.includes(r.id)?ico("check"):""}${esc(r.name)}</button>`).join("")}</div><p class="note">Leivonnaisista tulee ostoslistalle yhden erän ainekset.</p>`;
  const vk=state.vk,vkA=vk.filter(k=>!pl.vo.includes(k));
  const fpx=[...new Set(pl.items.flatMap(it=>(it.px||[]).filter(k=>!vkA.includes(k))))];
  const vkSum=[...vkA,...fpx].map(k=>esc(capF(k))).join(" · ")||(vk.length?"kaikki pois tältä kerralta":"ei vakio-ostoksia");
  const vkInner=`${fpx.length?`<p class="note">Ruokien tuotteet:</p><div class="chips">${fpx.map(k=>`<button type="button" class="chip" data-pa="pxall" data-k="${esc(k)}" aria-pressed="true">${ico("check")}${esc(capF(k))}</button>`).join("")}</div>`:""}${vk.length?`<p class="note">Napauta pois, jos et tarvitse tällä kertaa.</p><div class="chips">${vk.map(k=>`<button type="button" class="chip" data-pa="vo" data-k="${esc(k)}" aria-pressed="${!pl.vo.includes(k)}">${!pl.vo.includes(k)?ico("check"):""}${esc(capF(k))}</button>`).join("")}</div>`:""}
    <div class="xrow" style="margin-top:10px"><input id="vkin" type="text" maxlength="40" placeholder="Lisää vakio-ostos, esim. maito" autocomplete="off" aria-label="Lisää vakio-ostos"><button type="button" class="go" data-pa="vkadd" style="min-height:44px;padding:0 18px">Lisää</button></div>
    <div class="chips" style="margin-top:8px">${VK_SUG.filter(k=>!vk.includes(k)).map(k=>`<button type="button" class="chip sdm" data-pa="vkq" data-k="${esc(k)}">${ico("plus")}${esc(capF(k))}</button>`).join("")}</div>
    ${vk.length?`<p class="note">Poista vakio kokonaan: <span class="pn-rmv">${vk.map(k=>`<button type="button" class="lk" data-pa="vkrm" data-k="${esc(k)}">${esc(capF(k))}</button>`).join(", ")}</span></p>`:""}`;
  const stepper=(pa,lbl,v,min,max,aria)=>`<div class="pn-step"><span>${lbl}</span><div><button type="button" class="pn-ib sm" data-pa="${pa}" data-d="-1" aria-label="Vähemmän ${aria}"${v<=min?" disabled":""}>${ico("minus")}</button><b>${v}</b><button type="button" class="pn-ib sm" data-pa="${pa}" data-d="1" aria-label="Enemmän ${aria}"${v>=max?" disabled":""}>${ico("plus")}</button></div></div>`;
  h.innerHTML=`
    ${rows?`<ol class="pn-list">${rows}</ol>`:""}
    ${pl.items.length?(pl.items.length>=10?"":`<button type="button" class="pn-addb" data-pa="add">${ico("plus")}<span>Lisää ruoka suunnitelmaan</span></button>${planHooks.entry()}`):`
    <div class="pn-empty"><p class="pn-lead">Kokoa tulevien päivien ruoat, niin ainekset menevät kerralla ostoslistalle.</p>
      <button type="button" class="go pn-add1" data-pa="add">${ico("plus")}<span>Lisää ruoka</span></button></div>
    <div class="pn-four"><p class="note">Tai anna sovelluksen ehdottaa useampi kerralla:</p>
      <div class="pn-fr">${stepper("cnt","",planCount,1,10,"ruokia")}<button type="button" class="cartbtn" data-pa="four">${ico("shuffle")}<span>Ehdota ${planCount} ${planCount===1?"ruoka":"ruokaa"}</span></button></div></div>
    ${planHooks.entry()}`}
    ${PL_EXTRAS?`
    <h3 class="pn-sec">Lisäksi kaupasta</h3>
    <section class="pn-card">
      ${sec("sn","Aamu- ja välipalat",snSum,snInner)}${sec("bk","Leivonta",bkSum,bkInner)}${sec("vk","Vakiot ja tuotteet",vkSum,vkInner)}</section>
    <h3 class="pn-sec">Hinta-arvio</h3>
    <section class="pn-card pn-sum"><div class="pn-sr"><span>Ruoat ja lisukkeet</span><b>${eur1(tot.food)}</b></div>${tot.extra>0?`<div class="pn-sr"><span>Aamu- ja välipalat, leivonta</span><b>${eur1(tot.extra)}</b></div>`:""}
      <div class="pn-bud"><label for="pba">Budjetti</label><input id="pba" type="number" inputmode="decimal" min="0" step="1" value="${pl.ba>0?pl.ba:""}" placeholder="ei" aria-label="Budjetti euroina"><span>€</span></div>
      ${pl.ba>0?`<div class="pn-bar${over?" over":""}"><i style="width:${Math.min(100,Math.round((tot.food+tot.extra)/pl.ba*100))}%"></i></div>${over?`<p class="note err">Budjetti ylittyy ${eur1(tot.food+tot.extra-pl.ba)}. Valitse Edullinen tai vaihda kalleimpia ruokia.</p>`:""}`:""}
      <p class="note">Arvio lasketaan annoksista. Vakiot ja pakkauskoot näkyvät ostoslistan hinnassa.</p></section>`:""}
    ${pl.items.length||PL_EXTRAS&&(snSel.length||pl.bk.length)?`<div class="actions pn-foot"><button type="button" class="go" data-pa="shop" style="width:100%">${ico("tlist")}<span>Ostoslistalle · noin ${eur1(tot.food+tot.extra)}</span></button></div>`:""}`;
}
const plOthers=i=>state.pl.items.filter((x,j)=>j!==i&&x.id).map(x=>plCands().find(c=>c.id===x.id)).filter(Boolean);
function planSwap(i,undo){
  const pl=state.pl,it=pl.items[i];if(!it)return;
  const prev=JSON.parse(JSON.stringify(it));
  const c=PL.pick(plCands(),it.tg,plOthers(i),Math.random,it.id?[it.id]:[]);
  if(c){it.id=c.id;it.v=PL.versionFor(c,it.tg);plOnPick(it);}else{it.id="";it.v="";it.t=[];it.sd=[];it.px=[];}
  if(undo&&prev.id){planUndo={i,prev};const r=byId(prev.id);undoToast(`${esc(r?r.name:"Ruoka")} vaihdettiin`,'data-pundo="1"');}
}
$("toast").addEventListener("click",e=>{
  if(!e.target.closest("[data-pundo]")||!planUndo)return;
  const{i,prev,ins,all}=planUndo;planUndo=null;
  if(all){state.pl.items=[...all,...state.pl.items].slice(0,10);state.pl.n=state.pl.items.length;mutate();renderPlan();}
  else if(ins){state.pl.items.splice(Math.min(i,state.pl.items.length),0,prev);state.pl.n=state.pl.items.length;mutate();renderPlan();}
  else if(state.pl.items[i]){state.pl.items[i]=prev;mutate();renderPlan();}
  hideToast();
});
function planRemove(i){
  const pl=state.pl,prev=pl.items.splice(i,1)[0];if(!prev)return;pl.n=pl.items.length;planUndo={i,prev,ins:true};mutate();renderPlan();
  const r=byId(prev.id);undoToast(`${esc(r?r.name:"Ruoka")} poistettiin`,'data-pundo="1"');
}
/* ---------- ruoan muokkausikkuna ---------- */
/* ruoan ikkuna: koko ikkuna (versio, lisukkeet, tuotteet, muunnelmat, annokset) tai vain yksi osa (only: "sd" tai "tw") */
function renderEditPl(){
  if(!planEdit)return;
  const pl=state.pl,i=planEdit.i,it=pl.items[i];if(!it){$("pkdlg").close();return;}
  const r=byId(it.id);if(!r){$("pkdlg").close();return;}
  const only=planEdit.only||"",n=plN(it);
  const chip=(a,k,on,txt,extra="",pr="")=>`<button type="button" class="chip" data-pe="${a}" data-k="${esc(k)}" aria-pressed="${on}"${extra}>${on?ico("check"):""}${esc(txt)}${pr?`<span class="pn-pc">${pr}</span>`:""}</button>`;
  const H=(t,id="")=>only?"":`<h3 class="pn-h"${id?` id="${id}"`:""}>${t}</h3>`;
  const sec={};
  if((r.vs||[]).length>1)sec.v=`${H("Versio")}<div class="chips">${r.vs.map(v=>chip("v",v.id,(it.v||r.vs[0].id)===v.id,v.n)).join("")}</div>`;
  /* lisukkeet: vain ruoalle ehdotetut, muut erikseen pyydettäessä */
  const g=sideSug(r),seen=new Set(),sug=[],rest=[];
  const put=(arr,s)=>{const id=sdParse(s).id;if(!seen.has(id)){seen.add(id);arr.push(s);}};
  for(const s of it.sd||[])put(sug,s);
  for(const x of g?[...g.out.c,...g.out.v]:[])if(x.t==="r")put(sug,x.id+(x.ver?":"+x.ver:""));
  for(const x of all().filter(y=>y.t==="li"))put(rest,x.id);
  const shown=planEdit.allSd?[...sug,...rest]:sug;
  let sd=`${H("Lisukkeet","pe-sd")}${shown.length?`<div class="chips">${shown.map(s=>chip("sd",s,(it.sd||[]).includes(s),sdBase(s),"",sdPrice(s,n))).join("")}</div>`:`<p class="note">Ruoalle ei ehdoteta lisuketta.</p>`}
    <button type="button" class="lk pn-more" data-pe="allsd" data-k="1">${planEdit.allSd?"Näytä vain ehdotetut":"Näytä kaikki lisukkeet"}</button>`;
  for(const s of it.sd||[]){const{id,v}=sdParse(s),x=byId(id);if(!x||(x.vs||[]).length<2)continue;
    sd+=`<p class="note" style="margin:10px 0 2px">${esc(x.name)}</p><div class="chips">${x.vs.map(w=>chip("sdv",id+":"+w.id,(v||x.vs[0].id)===w.id,w.n,"",sdPrice(id+":"+w.id,n))).join("")}</div>`;}
  const prods=g?[...g.out.c,...g.out.v,...g.out.o].filter(x=>x.t==="p"):[];
  const pk=[...new Set([...prods.map(x=>x.id),...(it.px||[])])].slice(0,8);
  if(pk.length)sd+=`<h3 class="pn-h">Valmiit tuotteet</h3><div class="chips">${pk.map(k=>vkOn(k)?chip("pxv",k,true,capF(k)+" (vakio)"):chip("px",k,(it.px||[]).includes(k),capF(k))).join("")}</div>`;
  sec.sd=sd;
  if((r.tw||[]).length)sec.tw=`${H("Muunnelmat","pe-tw")}<div class="pn-tws">${r.tw.map(m=>`<button type="button" class="pn-twb" data-pe="t" data-k="${esc(m.id)}" aria-pressed="${(it.t||[]).includes(m.id)}"><b>${(it.t||[]).includes(m.id)?ico("check"):""}${esc(m.n)}${twFits(m,it.tg)&&!(it.t||[]).includes(m.id)?`<span class="pn-fit">Sopii: ${esc(it.tg.filter(t=>"kve".includes(t)).map(t=>PL.TAG_N[t]).join(", "))}</span>`:""}</b>${m.d?`<small>${esc(m.d)}</small>`:""}</button>`).join("")}</div>`;
  sec.n=`${H("Annokset")}<div class="pn-step"><span>${it.n>0?`Muutettu, reseptissä ${autoN(it)}`:"Reseptin mukaan"}</span><div><button type="button" class="pn-ib sm" data-pe="n" data-k="-1" aria-label="Vähemmän annoksia"${n<=1?" disabled":""}>${ico("minus")}</button><b>${n}</b><button type="button" class="pn-ib sm" data-pe="n" data-k="1" aria-label="Enemmän annoksia">${ico("plus")}</button></div></div>`;
  const ver=it.v&&(r.vs||[]).find(v=>v.id===it.v)||(r.vs||[])[0];
  const sc=(it.sd||[]).reduce((a,s)=>a+sdCost(s,n),0),tot=plItemCost(it);
  const cost=`<p class="pn-cost">${sc>0?`Ruoka ${eur1(tot-sc)} + lisukkeet ${eur1(sc)} = <b>${eur1(tot)}</b>`:`Hinta <b>${eur1(tot)}</b>`}</p>`;
  const title=only==="sd"?"Lisukkeet":only==="tw"?"Muunnelmat":esc(r.name)+(ver&&(r.vs||[]).length>1?" – "+esc(ver.n):"");
  const sub=only?`<p class="note">${esc(r.name)}</p>`:`<p class="note">${fmtN(n)} annosta · ${fmtDur(workOf(r)||r.min||0)} · <button type="button" class="lk" data-pe="open" data-k="${esc(r.id)}">Avaa resepti</button> · <button type="button" class="lk" data-pe="pick" data-k="1">Hae toinen ruoka</button></p>`;
  const body=only?sec[only]||"":[sec.v,sec.sd,sec.tw,sec.n].filter(Boolean).join("");
  $("pkbody").innerHTML=`<button type="button" class="dx" data-pp-x="1" aria-label="Sulje">${ico("x")}</button><h2 class="dh">${title}</h2>${sub}${cost}
    ${body}
    <div class="actions"><button type="button" class="go" data-pp-x="1" style="width:100%">Valmis</button></div>`;
}
/* tyyppivalinta: millaista ruokaa vaihto hakee */
/* millainen ruoka: pääryhmä (yksi) ja lisärajaukset; muokkaa ruokaa tai lisää uusi */
function renderTypePl(){
  const add=!!planAdd,it=add?planAdd:state.pl.items[planEdit.i];if(!it)return;
  const mt=PL.mainTag(it.tg)||"a";
  const opt=(a,k,n,d,on,radio)=>`<button type="button" class="pn-opt" data-pe="${a}" data-k="${k}" role="${radio?"radio":"checkbox"}" aria-checked="${on}"><span class="pn-ok${radio?" r":""}">${on?ico("check"):""}</span><span><b>${esc(n)}</b><small>${esc(d)}</small></span></button>`;
  $("pkbody").innerHTML=`<button type="button" class="dx" data-pp-x="1" aria-label="Sulje">${ico("x")}</button><h2 class="dh">${add?"Lisää ruoka":"Millainen ruoka?"}</h2>
    <h3 class="pn-h">Pääryhmä</h3>
    <div class="pn-opts" role="radiogroup" aria-label="Pääryhmä">${PL.MAIN_TAGS.map(([k,n,d])=>opt("tm",k,n,d,mt===k,true)).join("")}</div>
    <h3 class="pn-h" id="pt-ex">Rajaukset <small class="muted">valitse yksi tai useampi</small></h3>
    <div class="pn-opts">${PL.EXTRA_TAGS.map(([k,n,d])=>opt("tg",k,n,d,it.tg.includes(k),false)).join("")}</div>
    ${add?"":`<p class="note">Vaihtonappi hakee tällaisia ruokia. Jos nykyinen ruoka ei sovi valintaan, se vaihtuu heti.</p>`}
    <div class="actions">${add?`<button type="button" class="go" data-pe="addok" data-k="1" style="width:100%">${ico("plus")}<span>Lisää suunnitelmaan</span></button>`:`<button type="button" class="go" data-pp-x="1" style="width:100%">Valmis</button>`}</div>`;
}
function planAddOpen(){
  const pl=state.pl;planAdd={tg:PL.defaultTags(pl.items.length,pl.items.length+1)};planEdit={i:-1,type:true};planPick=null;planChk=null;
  renderTypePl();$("pkdlg").showModal();
}
function planTypeOpen(i,to){planAdd=null;planEdit={i,allSd:false,type:true};planPick=null;planChk=null;renderTypePl();$("pkdlg").showModal();
  const h=to==="ex"&&$("pt-ex");if(h)h.scrollIntoView({block:"start"});}
function planEditOpen(i,to){planAdd=null;planEdit={i,allSd:false,only:to==="sd"||to==="tw"?to:""};planPick=null;planChk=null;renderEditPl();$("pkdlg").showModal();$("pkbody").scrollTop=0;}
const vkOn=k=>PL_EXTRAS&&state.vk.includes(k)&&!state.pl.vo.includes(k);
/* muunnelma sopii valittuun siruun */
const twFits=(m,tg)=>(tg.includes("k")&&/kevye|kevyt/i.test(m.n+" "+(m.d||"")))||(tg.includes("v")&&(m.m==="v"||/kasvis/i.test(m.n)))||(tg.includes("e")&&/edullis|halvem/i.test(m.n+" "+(m.d||"")));
/* ---------- valitse itse ---------- */
function planPickOpen(i){planAdd=null;planPick={i,q:""};planEdit=null;planChk=null;renderPick();if(!$("pkdlg").open)$("pkdlg").showModal();}
function renderPick(){
  if(!planPick)return;
  const pl=state.pl,it=pl.items[planPick.i],q=fold(planPick.q.trim());
  const list=q?plCands().filter(c=>fzBest(q,[c.name])>=0):PL.ranked(plCands(),it.tg,plOthers(planPick.i));
  const rows=list.slice(0,40).map(c=>`<li><button type="button" class="pn-pr" data-pp="${esc(c.id)}"><span>${esc(c.name)}</span><small>${eur1(c.cost*(servOf(byId(c.id))||4))} · ${fmtDur(c.work)}</small></button></li>`).join("");
  $("pkbody").innerHTML=`<button type="button" class="dx" data-pp-x="1" aria-label="Sulje">${ico("x")}</button><h2 class="dh">Ruoka ${planPick.i+1}</h2>
    <input id="ppq" type="search" placeholder="Hae ruokaa" autocomplete="off" value="${esc(planPick.q)}" aria-label="Hae ruokaa">
    <p class="note">${q?"Hakutulokset kaikista ruoista":it.tg.length?"Valintoihin sopivat: "+it.tg.map(t=>PL.TAG_N[t]).join(", "):"Sopivimmat ensin"}</p><ul class="pn-pl">${rows||`<li class="note">Ei osumia.</li>`}</ul>`;
}
/* ---------- kaapin tarkistus ennen ostoslistaa ---------- */
function plShopItems(){
  const pl=state.pl,out=new Map();
  const add=(id,v,t,n)=>{if(!id||!(n>0)||!byId(id))return;const k=id+"|"+(v||"")+"|"+(t||[]).join(",");const e=out.get(k)||{id,v:v||"",t:t||[],n:0};e.n+=n;out.set(k,e);};
  for(const it of pl.items){if(!it.id)continue;const n=plN(it);add(it.id,it.v,it.t||[],n);for(const s of it.sd||[]){const{id,v}=sdParse(s);add(id,v,[],n);}}
  if(PL_EXTRAS){for(const[id,n]of Object.entries(pl.sn))add(id,"",[],n);
    for(const id of pl.bk){const r=byId(id);if(r)add(id,"",[],servOf(r));}}
  return[...out.values()].map(e=>({...e,n:Math.round(e.n*2)/2}));
}
function planChkOpen(){
  const items=plShopItems();
  const xs=[...new Set([...(PL_EXTRAS?state.vk.filter(k=>!state.pl.vo.includes(k)):[]),...state.pl.items.flatMap(it=>it.px||[])])];
  if(!items.length&&!xs.length){flashToast("Suunnitelmassa ei ole ruokia.");return;}
  const rows=shopping([],items.map(e=>({r:byId(e.id),lines:ingFor(byId(e.id),e.n,e.v,e.t)})));
  const hv=planHooks.have||pantryHit,off=new Set(rows.filter(e=>hv(e.key)).map(e=>e.key));
  planChk={items,xs,rows,off};planAdd=null;planEdit=null;planPick=null;renderChk();$("pkdlg").showModal();
}
function renderChk(){
  if(!planChk)return;
  const{rows,off,xs}=planChk;
  /* pienellä: mihin ruokiin aines menee; järjestys kaupan osastojen mukaan (sama kuin ostoslistalla) */
  const row=e=>{const o=off.has(e.key),fr=e.from.join(", ");return`<li><button type="button" class="ar${o?" off":""}" data-pc="${esc(e.key)}" aria-pressed="${!o}"><span class="ack">${ico("check")}</span><span class="an">${esc(e.name)}${o?"<small class=\"ak\">on jo kaapissa</small>":""}${fr?`<small class="af">${esc(fr)}</small>`:""}</span><span class="aq">${esc(qtyText(e))}</span></button></li>`;};
  const cnt=rows.length-off.size+xs.length;
  const gs=groupDeps(rows,[],state.store);
  $("pkbody").innerHTML=`<button type="button" class="dx" data-pp-x="1" aria-label="Sulje">${ico("x")}</button><h2 class="dh">Tarkista kaappi</h2>
    <p class="note">Napauta pois ainekset, jotka löytyvät jo kotoa. Tavalliset kaappitavarat ja kaappiin merkityt on valmiiksi rastitettu pois.${state.store?` Järjestys: ${esc(storeName(state.store))}.`:""}</p>
    ${gs.map(g=>`<h4 class="ag">${esc(g.name)}</h4><ul class="al">${g.items.map(row).join("")}</ul>`).join("")}
    ${xs.length?`<h4 class="ag">Vakiot ja tuotteet</h4><p class="note">${xs.map(k=>esc(capF(k))).join(", ")}</p>`:""}
    <div class="actions"><button type="button" class="go" data-pc-ok="1" style="width:100%">Lisää ostoslistalle (${cnt})</button></div>`;
}
function planShop(){
  if(!planChk)return;
  const pl=state.pl,{items,xs,off}=planChk;
  const l=newList();
  l.pl=items;
  l.x=xs.map(k=>({k,q:""}));
  l.have=[...off];
  /* suunnitelma tyhjenee, kun ruoat ovat listalla; kumoa palauttaa ruoat suunnitelmaan (lista jää) */
  planUndo={all:pl.items};pl.items=[];pl.n=0;
  pl.vo=[];planChk=null;
  $("pkdlg").close();
  mutate();renderPlan();
  /* välilehden vaihto piilottaa ilmoitukset, joten ilmoitus vasta sen jälkeen */
  showTab("cart");
  undoToast(`Lisätty ostoslistalle <b>${esc(l.name)}</b>. Suunnitelma tyhjennettiin.`,'data-pundo="1"',"Palauta suunnitelma");
}
$("pkbody").addEventListener("input",e=>{if(e.target.id==="ppq"&&planPick){planPick.q=e.target.value;const pos=e.target.selectionStart;renderPick();const i=$("ppq");i.focus();try{i.setSelectionRange(pos,pos);}catch(x){}}});
$("pkbody").addEventListener("click",e=>{
  if(e.target.closest("[data-pp-x]")){$("pkdlg").close();return;}
  const pl=state.pl;
  /* kaapin tarkistus */
  const pc=e.target.closest("[data-pc]");
  if(pc&&planChk){const k=pc.dataset.pc;if(planChk.off.has(k))planChk.off.delete(k);else planChk.off.add(k);return renderChk();}
  if(e.target.closest("[data-pc-ok]"))return planShop();
  /* valitse itse */
  const b=e.target.closest("[data-pp]");
  if(b&&planPick){
    const it=pl.items[planPick.i],c=plCands().find(x=>x.id===b.dataset.pp);
    if(it&&c){it.id=c.id;it.v=PL.versionFor(c,it.tg);plDefaults(it);}
    const i=planPick.i;mutate();renderPlan();planEditOpen(i);return;
  }
  /* muokkausikkuna */
  const x=e.target.closest("[data-pe]");if(!x||!planEdit)return;
  if(planAdd){const a=x.dataset.pe,k=x.dataset.k,t=planAdd.tg;
    if(a==="tm")planAdd.tg=[k,...t.filter(z=>z!=="a"&&z!=="w")];
    else if(a==="tg")planAdd.tg=t.includes(k)?t.filter(z=>z!==k):[...t,k];
    else if(a==="addok"){if(pl.items.length>=10)return;pl.items.push({tg:planAdd.tg,id:"",v:""});pl.n=pl.items.length;plFill();planNew=pl.items.length-1;planAdd=null;$("pkdlg").close();
      mutate();renderPlan();const li=$("planBody").querySelectorAll(".pn-item")[planNew];if(li)li.scrollIntoView({block:"nearest",behavior:"smooth"});setTimeout(()=>{planNew=-1;},50);return;}
    return renderTypePl();}
  const it=pl.items[planEdit.i];if(!it)return;
  const a=x.dataset.pe,k=x.dataset.k,r=byId(it.id);
  if(a==="open"){$("pkdlg").close();openDlg(k);return;}
  if(a==="pick")return planPickOpen(planEdit.i);
  if(a==="rm"){$("pkdlg").close();return planRemove(planEdit.i);}
  if(a==="swap")planSwap(planEdit.i,true);
  else if(a==="allsd")planEdit.allSd=!planEdit.allSd;
  else if(a==="tg"||a==="tm"){it.tg=a==="tm"?[k,...it.tg.filter(t=>t!=="a"&&t!=="w")]:it.tg.includes(k)?it.tg.filter(t=>t!==k):[...it.tg,k];
    delete it.lk;const cur=plCands().find(c=>c.id===it.id);if(!cur||!PL.matches(cur,it.tg))planSwap(planEdit.i,true);else{const v=PL.versionFor(cur,it.tg);if(v)it.v=v;}}
  else if(a==="v")it.v=r&&r.vs[0]&&r.vs[0].id===k?"":k;
  else if(a==="t"){const tw=(r.tw||[]).find(m=>m.id===k);if(!tw)return;const cur=it.t||[];it.t=cur.includes(k)?cur.filter(z=>z!==k):[...cur.filter(z=>{const o=(r.tw||[]).find(m=>m.id===z);return!(o&&((tw.g&&o.g===tw.g)||(o.rm||[]).some(q=>(tw.rm||[]).includes(q))));}),k];}
  else if(a==="sd"){const cur=it.sd||[],id=sdParse(k).id;it.sd=cur.includes(k)?cur.filter(z=>z!==k):[...cur.filter(z=>sdParse(z).id!==id),k];}
  else if(a==="sdv"){const id=sdParse(k).id,x=byId(id),nv=x&&x.vs[0].id===sdParse(k).v?id:k;it.sd=(it.sd||[]).map(z=>sdParse(z).id===id?nv:z);}
  else if(a==="pxv"){pl.vo=[...pl.vo,k];it.px=(it.px||[]).filter(z=>z!==k);}
  else if(a==="px"){const cur=it.px||[];it.px=cur.includes(k)?cur.filter(z=>z!==k):[...cur,k];}
  else if(a==="n"){const v=Math.max(1,Math.min(20,plN(it)+(+k)));it.n=0;it.n=v===autoN(it)?0:v;}
  mutate();renderPlan();if(planEdit.type)renderTypePl();else renderEditPl();
});
$("pkdlg").addEventListener("close",()=>{if($("pkdlg").open)return;planPick=null;planEdit=null;planChk=null;planAdd=null;});
const vkOk=k=>/^[a-zäöå0-9][a-zäöå0-9 \-.,()%]{0,39}$/i.test(k);
$("planBody").addEventListener("click",e=>{
  const b=e.target.closest("[data-pa]");
  if(!b){const li=e.target.closest(".pn-item.pn-click");if(li&&!e.target.closest("button,a,input"))planEditOpen(+li.dataset.i);return;}
  const a=b.dataset.pa,pl=state.pl,i=+b.dataset.i;
  if(a==="edit")return planEditOpen(i,b.dataset.to);
  if(a==="type")return planTypeOpen(i,b.dataset.to);
  if(a==="rm")return planRemove(i);
  if(a==="pick")return planPickOpen(i);
  if(a==="shop")return planChkOpen();
  if(a==="xo"){planOpen[b.dataset.k]=!planOpen[b.dataset.k];return renderPlan();}
  if(a==="add"){if(pl.items.length>=10)return;return planAddOpen();}
  if(a==="cnt"){planCount=Math.max(1,Math.min(10,planCount+(+b.dataset.d)));return renderPlan();}
  if(a==="four"){pl.items=[];pl.n=planCount;plFill();}
  else if(a==="sv")pl.sv=Math.max(2,Math.min(16,pl.sv+(+b.dataset.d)));
  else if(a==="swap")planSwap(i,true);
  else if(a==="sd"){const it=pl.items[i];if(!it)return;const s=b.dataset.s,cur=it.sd||[],id=sdParse(s).id;it.sd=cur.includes(s)?cur.filter(z=>z!==s):[...cur.filter(z=>sdParse(z).id!==id),s];}
  else if(a==="px"){const it=pl.items[i];if(!it)return;it.px=(it.px||[]).filter(z=>z!==b.dataset.k);}
  else if(a==="pxall"){for(const it of pl.items)it.px=(it.px||[]).filter(z=>z!==b.dataset.k);}
  else if(a==="sn"){const id=b.dataset.id,v=Math.max(0,(pl.sn[id]||0)+(+b.dataset.d));if(v)pl.sn[id]=v;else delete pl.sn[id];}
  else if(a==="bk"){const id=b.dataset.id;pl.bk=pl.bk.includes(id)?pl.bk.filter(x=>x!==id):[...pl.bk,id];}
  else if(a==="vo"){const k=b.dataset.k;pl.vo=pl.vo.includes(k)?pl.vo.filter(x=>x!==k):[...pl.vo,k];}
  else if(a==="vkq"||a==="vkadd"){const k=(a==="vkq"?b.dataset.k:($("vkin").value||"")).trim().toLowerCase();if(!k||!vkOk(k))return;if(!state.vk.includes(k))state.vk.push(k);}
  else if(a==="vkrm"){const k=b.dataset.k;state.vk=state.vk.filter(x=>x!==k);pl.vo=pl.vo.filter(x=>x!==k);}
  mutate();renderPlan();
});
$("planBody").addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.id==="vkin"){e.preventDefault();const b=$("planBody").querySelector('[data-pa="vkadd"]');if(b)b.click();}});
$("planBody").addEventListener("change",e=>{
  const t=e.target;
  if(t.id==="pba"){const v=parseFloat(String(t.value).replace(",","."));state.pl.ba=v>0&&v<=10000?Math.round(v*100)/100:0;mutate();renderPlan();}
});
