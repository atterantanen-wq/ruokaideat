/* ainesosarekisteri (Fineli), ainesten tunnistus, ravintoarvot, reseptien hinnat, versiot ja muunnelmat */
import {PR,PALIAS,PSKIP,PKEYS,wordHit} from "./prices.js";
import {M,ico,esc,workOf,defServ,SYN,USYN,parseIng} from "./core.js";
import {state,mutate} from "./state.js";
import {byId} from "./ideas.js";
import {ING_RAW} from "../data/ingredients.js";
import {selOf,applySel} from "../recipes.js";

/* ---------- ainesosarekisteri: Fineli (THL), CC BY 4.0, Release 16 ---------- */
/* avain|synonyymit|tuoteryhmä|pääraaka-aine|g/dl,g/rkl,g/tl,g/kpl,g/prk,g/nippu|kcal,proteiini,rasva,tyydyttynyt,hiilihydraatti,suola (/100 g)|1=ei lasketa|Finelin tunnus|Finelin nimi */
export const CAT=ING_RAW.split("\n").map(l=>{
  const p=l.split("|"),u=(p[4]||"").split(","),n=p[5]?p[5].split(",").map(Number):null;
  return{key:p[0],syn:p[1]?p[1].split(","):[],d:+p[2],m:p[3]||"",u:{dl:+u[0]||0,rkl:+u[1]||0,tl:+u[2]||0,kpl:+u[3]||0,prk:+u[4]||0,nippu:+u[5]||0},fid:p[7]||"",fname:p[8]||"",
    n:n?{kcal:n[0]||0,prot:n[1]||0,fat:n[2]||0,sat:n[3]||0,carb:n[4]||0,salt:n[5]||0}:null,neg:p[6]==="1",pan:p[9]==="1"};
});
export const CIDX=new Map();
for(const e of CAT)CIDX.set(e.key,e);
for(const e of CAT)for(const s of e.syn)if(!CIDX.has(s))CIDX.set(s,e);
let CKEYS=[...CIDX.keys()].sort((a,b)=>b.length-a.length);
export const CBYK=new Map(CAT.map(e=>[e.key,e]));
for(const e of CAT){e.o={d:e.d,m:e.m,n:e.n,u:e.u,syn:e.syn,neg:e.neg,pan:e.pan};e.pk=null;e.ov=false;e.url="";}
const nEq=(a,b)=>!!a&&!!b&&["kcal","prot","fat","sat","carb","salt"].every(k=>Math.abs((a[k]||0)-(b[k]||0))<0.005);
/* omat muutokset valmiisiin aineksiin (state.ix) ja omien synonyymit: rakennetaan haku uudelleen */
export function rebuildCat(){
  const ix=(state&&state.ix)||{};
  for(const e of CAT){
    const x=ix[e.key],o=e.o;
    e.ov=!!x;
    e.d=x?x.d:o.d;e.m=x?(x.m||""):o.m;e.n=x?(x.n||null):o.n;
    e.u=x?Object.assign({dl:0,rkl:0,tl:0,kpl:0,prk:0,nippu:0},x.u||{}):o.u;
    e.syn=x&&x.syn?x.syn:o.syn;
    e.neg=x?(o.neg&&(!x.n||nEq(x.n,o.n))):o.neg;
    e.pan=x?x.pan===true:o.pan;
    e.pk=x&&x.pk?x.pk:null;e.url=(x&&x.url)||"";
  }
  CIDX.clear();CMEMO.clear();USYN.clear();
  for(const e of CAT)CIDX.set(e.key,e);
  for(const e of CAT)for(const s of e.syn)if(!CIDX.has(s))CIDX.set(s,e);
  const gi=(state&&state.ing)||{};
  for(const k of Object.keys(gi))for(const s of (gi[k].syn||[]))if(!CIDX.has(s)&&!gi[s]&&!USYN.has(s))USYN.set(s,k);
  CKEYS=[...CIDX.keys()].sort((a,b)=>b.length-a.length);
}
const CMEMO=new Map();
export function catFind(key){
  if(CMEMO.has(key))return CMEMO.get(key);
  let r=CIDX.get(key)||CIDX.get(PALIAS[key]||"")||null;
  if(!r)for(const x of CKEYS)if(wordHit(key,x)){r=CIDX.get(x);break;}
  CMEMO.set(key,r);return r;
}
export const fold=s=>String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
/* sumea haku: 0 alku, 1 sanan alku, 2 sisältää, 3–4 kirjoitusvirhe, -1 ei osu */
function lev(a,b,mx){
  if(Math.abs(a.length-b.length)>mx)return mx+1;
  let pp=null,p=Array.from({length:b.length+1},(_,j)=>j);
  for(let i=1;i<=a.length;i++){
    const c=[i];let lo=i;
    for(let j=1;j<=b.length;j++){
      let v=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));
      if(pp&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])v=Math.min(v,pp[j-2]+1);
      c[j]=v;if(v<lo)lo=v;
    }
    if(lo>mx)return mx+1;pp=p;p=c;
  }
  return p[b.length];
}
/* taivutettu nimi rekisterin muotoon: porkkanaa -> porkkana, voita -> voi */
export function normIngName(n){
  const k=String(n).trim().toLowerCase().replace(/\s+/g," ");
  if(state.ing[k]||PR[k])return k;
  if(USYN.has(k))return USYN.get(k);
  if(CIDX.has(k))return CIDX.get(k).key;
  const ok=x=>x&&(CIDX.has(x)||state.ing[x]||PR[x]||SYN[x]||catFind(x));
  if(ok(k))return k;
  const c=[];
  if(/[aä]$/.test(k))c.push(k.slice(0,-1));
  if(/t[aä]$/.test(k))c.push(k.slice(0,-2));
  if(/tteja$/.test(k))c.push(k.replace(/tteja$/,"tti"),k.replace(/tteja$/,"tit"));
  if(/oita$/.test(k))c.push(k.replace(/oita$/,"a"),k.replace(/oita$/,"at"));
  if(/öitä$/.test(k))c.push(k.replace(/öitä$/,"ä"));
  if(/ia$|iä$/.test(k))c.push(k.slice(0,-2)+"i");
  if(/eita$|eitä$/.test(k))c.push(k.replace(/it[aä]$/,""),k.replace(/eit[aä]$/,"i"));
  for(const x of c)if(ok(x))return CIDX.has(x)?CIDX.get(x).key:x;
  return k;
}
export function fzScore(q,name){
  if(!q)return 0;
  if(name.startsWith(q))return 0;
  if(name.includes(" "+q)||name.includes("-"+q))return 1;
  if(name.includes(q))return 2;
  if(q.length<4)return -1;
  const tol=q.length>=8?2:1;
  for(const w of name.split(/[\s,()-]+/)){
    if(!w)continue;
    if(lev(q,w,tol)<=tol)return 3;
    if(w.length>q.length&&lev(q,w.slice(0,q.length),tol)<=tol)return 4;
  }
  return -1;
}
export function fzBest(q,names){let b=-1;for(const n of names){const s=fzScore(q,fold(n));if(s>=0&&(b<0||s<b))b=s;}return b;}
/* grammat määrästä: ensin käsin asetetut hintatiedon muunnokset, sitten Finelin */
export function gramsOf(key,fam,v){
  if(v==null||!isFinite(v))return null;
  if(fam==="g")return v;
  const bk=baseKey(PALIAS[key]||key),e=bk?PR[bk]:null,c=catFind(key),ui=state.ing[key];
  const cu=ui?(ui.u||{}):(c?c.u:{}),ou=(ui||(c&&c.ov))?cu:null;
  const dl=(ou&&ou.dl)||(e&&e.dl)||cu.dl||0;
  const liquid=e&&e.per==="l";
  if(fam==="ml")return dl?v/100*dl:(liquid?v:null);
  if(fam==="rkl")return dl?v*0.15*dl:(cu.rkl?v*cu.rkl:(liquid?v*15:null));
  if(fam==="tl")return dl?v*0.05*dl:(cu.tl?v*cu.tl:(liquid?v*5:null));
  if(fam==="kpl"){const g=(ou&&ou.kpl)||(e&&e.kpl)||cu.kpl;return g?v*g:null;}
  if(fam==="prk"||fam==="pss"||fam==="nippu"){
    const q=(ou&&ou[fam])||(e&&e[fam]);
    if(q)return liquid?q*v*(dl||100)/100:q*v;
    return cu[fam]?cu[fam]*v:null;
  }
  return null;
}
/* ravintoarvot reseptille: yhteensä ja miss-lista aineksista, joille arvoa ei saatu */
export function nutData(key){
  const ui=state.ing[key];
  if(ui)return{own:true,n:ui.n||null,neg:false,d:ui.d,m:ui.m,u:ui.u||{},url:ui.url||""};
  const c=catFind(key);
  return c?{own:false,n:c.n,neg:c.neg,d:c.d,m:c.m.replace("?",""),u:c.u,c}:null;
}
export function recipeNut(r){
  const t={kcal:0,prot:0,fat:0,sat:0,carb:0,salt:0};
  let n=0,big=false,major=0;const miss=[];
  for(const line of ingOf(r)){
    const p=parseIng(line),c=nutData(p.key);
    if(c&&c.neg)continue;
    if(p.v==null)continue;
    const g=c&&c.n?gramsOf(p.key,p.fam,p.v):null;
    if(g==null){
      miss.push(p.name);
      /* mausteiden pienet määrät (ripaus, teelusikat, kokonaiset mausteet) eivät vaikuta tulokseen,
       * joten ne eivät tee ravintoarvoista vajaita */
      const tiny=p.fam==="tl"||(p.fam==="rkl"&&p.v<=2)||p.fam==="ripaus"||nameSkip(p.key)||(p.fam==="kpl"&&c&&c.d===6);
      if(!tiny)major++;
      if(!tiny&&!(p.fam==="g"&&p.v<30)&&!(p.fam==="ml"&&p.v<30))big=true;
      continue;
    }
    for(const k of Object.keys(t))t[k]+=c.n[k]*g/100;
    n++;
  }
  return{t,n,miss,big,major};
}
export function nutPer(r){
  const x=recipeNut(r);
  if(!x.n||x.big)return null;
  const s=pvOf(r),p={};
  for(const k of Object.keys(x.t))p[k]=x.t[k]/s;
  return{per:p,miss:x.miss,full:!x.major};
}
/* pääraaka-aine ainesten mukaan; käsin valittu (mo) ohittaa */
export function autoMain(r){
  const sc={},wk={};let any=false;
  for(const line of selR(r).ing){
    const p=parseIng(line);any=true;
    const ui=state.ing[p.key];
    let code="",w=false;
    if(ui)code=ui.m||"";
    else{const c=catFind(p.key);if(c&&c.m){code=c.m;if(code.endsWith("?")){code=code[0];w=true;}}}
    if(!code||!M[code])continue;
    const g=gramsOf(p.key,p.fam,p.v)||100;
    const o=w?wk:sc;o[code]=(o[code]||0)+g;
  }
  for(const o of [sc,wk]){
    let best="",bv=0;
    for(const[k,v]of Object.entries(o))if(v>bv){best=k;bv=v;}
    if(best)return best;
  }
  return any?"v":"";
}
export function mainOf(r){
  if(r.mo&&M[r.mo])return r.mo;
  if(r.vs&&r.vs.length){const v=selOf(r,state.tv[r.id]).ver;if(v&&v.veg)return"v";if(v&&M[v.m])return v.m;}
  const a=autoMain(r);
  return a||(r.custom?"":(M[r.m]?r.m:""));
}
export const gp=k=>Object.prototype.hasOwnProperty.call(state.prices,k)?state.prices[k]:null;
const pad2=n=>String(n).padStart(2,"0");
export const todayIso=()=>{const n=new Date();return n.getFullYear()+"-"+pad2(n.getMonth()+1)+"-"+pad2(n.getDate());};
export const fmtD=iso=>{const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(iso||"");return m?(+m[3])+"."+(+m[2])+"."+m[1]:"";};
export function isStale(iso){
  const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(iso||"");if(!m)return false;
  const lim=new Date();lim.setMonth(lim.getMonth()-6);
  return new Date(+m[1],+m[2]-1,+m[3])<lim;
}
export function baseKey(k){
  if(PR[k])return k;
  for(const x of PKEYS)if(wordHit(k,x))return x;
  return null;
}
export function findPrice(key){
  const k=PALIAS[key]||key;
  let bk=baseKey(k);
  if(!bk&&!gp(key)&&!gp(k)){const c=catFind(key);if(c&&PR[c.key])bk=c.key;}
  const u=gp(key)||gp(k)||(bk?gp(bk):null);
  if(!u&&!bk)return null;
  const e=Object.assign({},bk?PR[bk]:{});
  if(u){e.p=u.p;e.per=u.per;e.u=u.url;e.d=u.date;e.w="";e.usr=true;}
  e.k=k;
  return e;
}
/* automaattinen raja kaikille aineksille: alle SKIP_EUR:n osuutta reseptistä ei lasketa hintaan */
export const SKIP_EUR=0.1;
export function nameSkip(key){
  if(PSKIP.has(key))return true;
  return [...PSKIP].some(x=>wordHit(key,x));
}
/* vähän kuluvat: lista, katalogin pieni-käyttöinen aines tai osasto Öljyt ja mausteet (myös omat ainekset) */
export function pantryHit(key){
  if(nameSkip(key))return true;
  const ui=state.ing[key];
  if(ui)return !!ui.pan||ui.d===6;
  const c=catFind(key);
  return !!(c&&(c.neg||c.pan));
}
export function isSkip(key){return nameSkip(key);}
/* hinta yhdelle ainekselle: {t:"ok",c,w}, {t:"skip"}, {t:"none"} tai {t:"conv"} */
export function costOf(key,fam,v){
  const x=costOf0(key,fam,v);
  if(x.t==="ok"?x.c<SKIP_EUR:pantryHit(key))return{t:"skip"};
  return x;
}
export function costBake(key,fam,v){
  const x=costOf0(key,fam,v);
  if(x.t==="ok")return x.c<SKIP_EUR?{t:"skip"}:x;
  return pantryHit(key)?{t:"skip"}:x;
}
function costOf0(key,fam,v){
  const e=findPrice(key);
  if(!e)return{t:"none"};
  let c=null;
  const ui0=state.ing[key],c0=catFind(key),ui=ui0||(c0&&c0.ov?c0:null),cu=ui0?(ui0.u||{}):((c0||{}).u||{});
  if(e.per==="kpl"){
    if(fam==="kpl"||fam==="prk"||fam==="pss"||fam==="nippu")c=e.p*v;
    else{const kg=cu.kpl||e.kpl||cu.nippu,g=gramsOf(key,fam,v);if(kg&&g!=null)c=e.p*g/kg;}
  }else if(e.per==="kg"){
    let g=null;
    const dl=(ui&&cu.dl)||e.dl||cu.dl||(e.usr?100:0),kg=(ui&&cu.kpl)||e.kpl||cu.kpl;
    if(fam==="g")g=v;
    else if(fam==="ml"&&dl)g=v/100*dl;
    else if(fam==="rkl"&&dl)g=v*0.15*dl;
    else if(fam==="tl"&&dl)g=v*0.05*dl;
    else if(fam==="rkl"&&cu.rkl)g=v*cu.rkl;
    else if(fam==="tl"&&cu.tl)g=v*cu.tl;
    else if(fam==="kpl"&&kg)g=v*kg;
    else if(fam==="prk"&&((ui&&cu.prk)||e.prk||cu.prk))g=v*((ui&&cu.prk)||e.prk||cu.prk);
    else if(fam==="pss"&&((ui&&cu.pss)||e.pss||cu.pss))g=v*((ui&&cu.pss)||e.pss||cu.pss);
    else if(fam==="nippu"&&((ui&&cu.nippu)||e.nippu||cu.nippu))g=v*((ui&&cu.nippu)||e.nippu||cu.nippu);
    if(g!=null)c=e.p*g/1000;
  }else if(e.per==="l"){
    let ml=null;
    if(fam==="ml")ml=v;
    else if(fam==="rkl")ml=v*15;
    else if(fam==="tl")ml=v*5;
    else if(fam==="prk"&&(e.prk||cu.prk))ml=v*(e.prk||cu.prk);
    if(ml!=null)c=e.p*ml/1000;
  }
  return c==null?{t:"conv"}:{t:"ok",c,w:!!e.w,s:isStale(e.d)};
}
export const eur=v=>(Math.round(v*100)/100).toFixed(2).replace(".",",")+" €";
export const eur1=v=>(Math.round(v*10)/10).toFixed(1).replace(".",",")+" €";
const eur2=v=>(Math.round(v*100)/100).toFixed(2).replace(".",",")+" €";
/* kesto: 45 min, 1 h 30 min, 13 h; pitkä lepo (yön yli) näytetään sanoin */
export const fmtDur=m=>{m=Math.round(+m||0);if(m<60)return m+" min";if(m>=720)return Math.round(m/60)+" h";const h=Math.floor(m/60),k=m%60;return h+" h"+(k?" "+k+" min":"");};
export const timeTxt=r=>{const w=workOf(r),wait=r.min-w;
  const rest=wait>=600&&/yön yli|yöksi/.test((r.steps||[]).join(" "))?"yön yli":wait>=1200?Math.round(wait/1440)+" vrk":"";
  return rest?(w>0?fmtDur(w)+" + "+rest:rest):fmtDur(r.min);};
/* Korttien aikarivi: aktiivinen työaika (w) ja passiivinen odotus (min − w), yli 2 h odotus pyöristetään vartteihin. Jos työaikaa ei tiedetä
 * (esim. oma resepti ilman työaikaa), näytetään vain kokonaisaika. */
export const timeSplit=r=>{const tot=Math.max(0,+r.min||0),w=Math.min(workOf(r),tot||Infinity),wait=Math.max(0,tot-w);
  if(!(w>0))return{tot,w:0,wait:0,waitTxt:""};
  const night=wait>=600&&/yön yli|yöksi/.test((r.steps||[]).join(" "));
  return{tot,w,wait,waitTxt:!wait?"":night?"yön yli":wait>=1200?Math.round(wait/1440)+" vrk":fmtDur(wait>=120?Math.round(wait/15)*15:wait)};};
export const cardTime=r=>{const t=timeSplit(r);if(!t.tot&&!t.w)return"";
  const lbl=t.w?`Aikaa ${fmtDur(t.tot||t.w)}: työtä ${fmtDur(t.w)}${t.wait?", odotusta "+t.waitTxt:""}`:`Aikaa ${fmtDur(t.tot)}`;
  const txt=t.w?`<span class="tw">${fmtDur(t.w)} työtä</span>${t.wait?`<span class="tp"><span class="nw">+ ${t.waitTxt}</span>${t.waitTxt==="yön yli"?"":" odotusta"}</span>`:""}`:`<span class="tw">${fmtDur(t.tot)}</span>`;
  return`<span class="mn ct" title="${lbl}" aria-label="${lbl}">${ico("clock")}<span class="ctx" aria-hidden="true">${txt}</span></span>`;};
export const servOf=r=>state.serv[r.id]||defServ(r.id);
export const PCH=[2,4,6,8,10];
export const nearP=n=>n<=2?2:n>=10?10:(n%2?n+1:n);
/* leivonnaisissa (annos = pala tai keksi) määrä valitaan erinä, muissa annoksina 2–10 */
export const isBatch=r=>!!r&&(r.t==="le"||!!r.batch);
const baseP=r=>isBatch(r)?servOf(r):nearP(servOf(r));
export const pvOf=r=>state.pv[r.id]||baseP(r);
export function setPv(id,n){const r=byId(id),b=r?baseP(r):nearP(defServ(id));if(n===b)delete state.pv[id];else state.pv[id]=n;}
export function scaleLine(line,f){
  if(f===1)return line;
  const p=parseIng(line);if(p.q==null)return line;
  let q=p.q*f;q=q>=100?Math.round(q/5)*5:Math.round(q*100)/100;
  return p.rawName+" "+String(q)+(p.u?" "+p.u:"");
}
/* versiot ja muunnelmat: valinta tallennetaan reseptikohtaisesti kuten annosmäärä */
export const hasOpt=r=>!!((r.vs&&r.vs.length)||(r.tw&&r.tw.length));
export const keyOfLine=l=>parseIng(l).key;
export const selR=r=>hasOpt(r)?applySel(r,state.tv[r.id],keyOfLine):{ing:r.ing,gr:r.gr||[],steps:r.steps,mods:[]};
export const stepsOf=r=>selR(r).steps;
export const ingOf=r=>{const f=pvOf(r)/servOf(r),a=selR(r).ing;return f===1?a:a.map(l=>scaleLine(l,f));};
export function setSel(id,fn){const r=byId(id);if(!r)return;const c=state.tv[id]||{},n={v:c.v,t:[...(c.t||[])]};fn(n);
  const e={};if(n.v&&r.vs&&r.vs.length&&n.v!==r.vs[0].id)e.v=n.v;if(n.t.length)e.t=n.t;
  if(e.v||e.t)state.tv[id]=e;else delete state.tv[id];mutate();}
export function recipeCost(r,all0){
  let sum=0,n=0,weak=false,big=false,stale=false;const miss=[],lines=[];
  for(const line of ingOf(r)){
    const p=parseIng(line);
    if(p.v==null){lines.push(null);continue;}
    const x=all0?costOf0(p.key,p.fam,p.v):isBatch(r)?costBake(p.key,p.fam,p.v):costOf(p.key,p.fam,p.v);
    if(x.t==="ok"){sum+=x.c;n++;if(x.w&&x.c>=1)weak=true;if(x.s)stale=true;lines.push(x);}
    else{lines.push(x);if(x.t!=="skip"){miss.push(p.name);if(p.fam==="g"&&p.v>=300)big=true;}}
  }
  if(!n&&!all0&&r.ing.length)return recipeCost(r,true);
  return{sum,n,miss,weak,lines,big,stale};
}
export const f0=v=>String(Math.round(v)).replace(".",",");
export const f1=v=>String(Math.round(v*10)/10).replace(".",",");
export const fs=v=>v<1?String(Math.round(v*100)/100).replace(".",","):f1(v);
export function nutChip(r){
  const x=nutPer(r);
  return x?`<span class="mn nu">${x.full?"":"väh. "}${f0(x.per.kcal)} kcal</span><span class="mn nu">${f0(x.per.prot)} g prot.</span>`:"";
}
export let nutOpen=false,ingOpen=true,stepOpen=false;
export function setStepOpen(v){return stepOpen=v;}
export function setIngOpen(v){return ingOpen=v;}
export function setNutOpen(v){return nutOpen=v;}
export const accHtml=(key,icon,title,open,inner,right)=>`<section class="acc acc-${key}"><button type="button" class="accb" data-acc="${key}" aria-expanded="${open}" aria-controls="acc-${key}">${ico(icon)}<span>${title}</span>${right||""}${ico("chev")}</button>${open?`<div class="accp" id="acc-${key}">${inner}</div>`:""}</section>`;
export function nutHtml(r){
  const x=nutPer(r);
  if(!x){
    if(!r.ing.length)return"";
    const y=recipeNut(r);
    const why=y.miss.length?`Ravintoarvoja ei voi laskea. Näille aineksille ei ole arvoa rekisterissä tai määrää ei voi muuttaa grammoiksi: ${esc(y.miss.join(", "))}. Lisää ne <button type="button" class="lk" data-reg-open="">rekisteriin</button> tai korjaa yksikkö.`:`Ravintoarvoja ei voi laskea, koska aineksille ei ole määriä.`;
    return`<p class="note nd" style="margin:14px 2px 0">${why}</p>`;
  }
  const p=x.per;
  const inner=`<div class="nut2"><div><b>${f0(p.kcal)}</b><span>kcal / annos${x.full?"":", vähintään"}</span></div><div><b>${f0(p.prot)} g</b><span>proteiinia / annos${x.full?"":", vähintään"}</span></div></div><p class="note nd">Rasvaa ${f1(p.fat)} g (tyydyttynyttä ${f1(p.sat)} g) · hiilihydraatteja ${f1(p.carb)} g · suolaa ${fs(p.salt)} g</p>${x.miss.length?`<p class="note nd">Ei laskettu: ${esc(x.miss.join(", "))}.</p>`:""}<p class="note nd">Arvio raaka-aineiden perusteella, ei huomioi kypsennyksen vaikutusta. Ravintoarvot: <a href="https://fineli.fi" target="_blank" rel="noopener noreferrer">Fineli, THL</a>, CC BY 4.0.</p>`;
  return accHtml("nut","flame","Ravintoarvot / annos",nutOpen,inner);
}
/* hinta kortille; leivonnaisissa annos on yksi pala tai keksi, joten näytetään koko taikinan hinta */
export function priceTxt(r){
  const c=recipeCost(r);
  if(!c.n||c.big)return"";
  const pre=c.miss.length?"väh. ":"";
  if(isBatch(r))return pre+eur1(c.sum*servOf(r)/pvOf(r))+" / erä";
  const per=c.sum/pvOf(r);
  return pre+(per<0.95?eur2(per):eur1(per))+" / annos";
}
export function priceTag(r){const t=priceTxt(r);return t?`<b class="pr">${t}</b>`:"";}
