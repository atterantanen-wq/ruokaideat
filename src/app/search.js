/* haku, suodattimet, ruokakortit, hakuikkuna ja hakupainike */
import {all,byId,inCart,tagsOf,renderSd,sel,maps,ids,pick,setPick,qs,onlyFP,setOnlyFP,imgUrl,isFav,chipEls,FV,poolOf,xOpen,hkX,chipStats,updateChips} from "./ideas.js";
import {S,A,T,M,WLD,HOL,FK,$,ico,cartInner,esc,isPop,workOf,parseIng} from "./core.js";
import {fold,fzScore,fzBest,mainOf,fmtDur,timeTxt,pvOf,hasOpt,recipeCost,nutChip,priceTxt,priceTag,setSel} from "./catalog.js";
import {state,mutate} from "./state.js";
import {hideToast} from "./cart.js";
import {curTab} from "./tabs.js";
import {uiEdit} from "./editor.js";
import {optLines} from "../recipes.js";

/* ---------- haku ---------- */
function termsOf(str){return str.split(",").map(s=>fold(s.trim())).filter(Boolean).slice(0,6);}
function qTerms(){return termsOf(qs);}
const qIngCache=new Map();
function qIngs(r){
  const k=r.id+"|"+r.ing.join(";");
  let v=qIngCache.get(k);
  if(!v){v=r.ing.map(l=>parseIng(l).key.replace(/kananmun\w*/g,"muna"));if(qIngCache.size>800)qIngCache.clear();qIngCache.set(k,v);}
  return v;
}
/* muunnelmat, jotka vaihtavat saman aineksen, sulkevat toisensa pois: uuden valinta poistaa ristiriitaiset */
export function twExcl(r,list,k){
  const tw=(r&&r.tw)||[],m=tw.find(t=>t.id===k),rm=(m&&m.rm)||[],g=m&&m.g;
  if(!rm.length&&!g)return list;
  return list.filter(o=>{const om=tw.find(t=>t.id===o);return !(om&&((g&&om.g===g)||(om.rm||[]).some(x=>rm.includes(x))));});
}
/* nimet hakua varten: reseptin nimi, muut nimet ja versioiden nimet */
const qNames=r=>[r.name,...(r.aka||[]),...((r.vs||[]).length>1?r.vs.flatMap(v=>[v.n,v.n+" "+r.name]):[])];
/* versioiden ja muunnelmien tuomat ainekset: [avain, versio/muunnelma] */
const qOptCache=new Map();
function qOptRows(r){
  if(!hasOpt(r))return[];
  let v=qOptCache.get(r.id);
  if(!v){v=optLines(r).map(([l,m])=>[parseIng(l).key.replace(/kananmun\w*/g,"muna"),m]);qOptCache.set(r.id,v);}
  return v;
}
/* hakusanat, jotka osuvat vain versioon tai muunnelmaan: palauttaa osuneet versiot/muunnelmat */
function qOpts(r,ts){
  const out=[];
  for(const t0 of ts){
    const t=t0.replace(/kananmu\w*/g,"muna"),ok=v=>v>=0&&(v<=2||t.length>=5);
    /* versio nimeltä (esim. "kirkas kalakeitto") */
    if(!ok(fzBest(t,[r.name,...(r.aka||[])]))&&(r.vs||[]).length>1){
      const v=r.vs.find(v=>ok(fzBest(t,[v.n,v.n+" "+r.name])));
      if(v){if(!out.includes(v))out.push(v);continue;}
    }
    if(ok(fzBest(t,qNames(r)))||ok(fzBest(t,qIngs(r))))continue;
    const hit=qOptRows(r).find(([k])=>ok(fzScore(t,fold(k))));
    if(hit&&!out.includes(hit[1]))out.push(hit[1]);
  }
  return out;
}
/* -1 = ei osu; 0..9 = nimi osuu; 100+ = vain aines osuu; 200+ = vain version tai muunnelman aines osuu */
export function qHit(r,ts0){
  const ts=ts0||qTerms();if(!ts.length)return 0;
  let best=0;
  for(const t0 of ts){
    const t=t0.replace(/kananmu\w*/g,"muna");
    const ok=v=>v>=0&&(v<=2||t.length>=5);
    const n=fzBest(t,qNames(r));
    if(ok(n)){best=Math.max(best,n);continue;}
    const g=fzBest(t,qIngs(r));
    if(ok(g)){best=Math.max(best,100+g);continue;}
    const o=fzBest(t,qOptRows(r).map(x=>x[0]));
    if(ok(o)){best=Math.max(best,200+o);continue;}
    return-1;
  }
  return best;
}
$("qi").innerHTML=ico("search");
export function clearFilters(){
  setOnlyFP(false);$("fpChip").setAttribute("aria-pressed","false");
  for(const k of Object.keys(sel)){sel[k].clear();for(const b of Object.values(chipEls[k]))b.setAttribute("aria-pressed","false");}
  setPick(null);renderIdeas();
}
export function buildChips(){
  {
    const b=document.createElement("button");
    b.type="button";b.className="chip fv";b.id="fpChip";b.innerHTML=ico("star")+"<span>Suosikit ja suositut</span>";b.setAttribute("aria-pressed","false");
    b.onclick=()=>{setOnlyFP(!onlyFP);b.setAttribute("aria-pressed",onlyFP);setPick(null);renderIdeas();};
    $("fp").appendChild(b);
    const x=document.createElement("button");x.type="button";x.className="lk";x.id="clrBtn";x.hidden=true;x.dataset.clrf="";x.textContent="Tyhjennä valinnat";
    $("fp").appendChild(x);
  }
  for(const k of FK){
    const box=$(ids[k]);
    for(const[code,label] of Object.entries(maps[k])){
      const b=document.createElement("button");
      b.type="button";b.className="chip";b.textContent=label;b.setAttribute("aria-pressed","false");chipEls[k][code]=b;
      b.onclick=()=>{
        if(sel[k].has(code))sel[k].delete(code);
        else{if(k==="v"){sel.v.clear();for(const o of Object.values(chipEls.v))o.setAttribute("aria-pressed","false");}sel[k].add(code);}
        b.setAttribute("aria-pressed",sel[k].has(code));
        setPick(null);renderIdeas();
      };
      box.appendChild(b);
    }
  }
  $("more").addEventListener("click",e=>{const b=e.target.closest("[data-xg]");if(!b)return;xOpen[b.dataset.xg]=!xOpen[b.dataset.xg];updateChips();});
}
function matches(r){
  return(!onlyFP||isFav(r.id)||isPop(r))&&qHit(r)>=0&&FK.every(k=>k==="t"?(sel.t.size?sel.t.has(r.t):r.t!=="li"):(!sel[k].size||FV[k](r).some(x=>sel[k].has(x))));
}
export function tagsHtml(r,part){
  if(part==="top")return`<div class="meta top"><div class="mg">${priceTag(r)}${r.min>0?`<b class="mn2">${ico("clock")}${timeTxt(r)}</b>`:""}${workOf(r)>0&&r.min>workOf(r)&&!/yön yli/.test(timeTxt(r))?`<span class="wk">työtä ${fmtDur(workOf(r))}</span>`:""}</div>${state.views[r.id]?`<span class="vw" title="Katsottu ${state.views[r.id]} ${state.views[r.id]===1?"kerran":"kertaa"}" aria-label="Katsottu ${state.views[r.id]} ${state.views[r.id]===1?"kerran":"kertaa"}">${ico("eye")}${state.views[r.id]}</span>`:""}</div>`;
  if(part==="tags")return`<div class="meta tg">${T[r.t]?`<span class="t">${T[r.t]}</span>`:""}${M[mainOf(r)]?`<span class="t">${M[mainOf(r)]}</span>`:""}${WLD[r.wd]?`<span class="t">${WLD[r.wd]}</span>`:""}${HOL[r.fe]?`<span class="t">${HOL[r.fe]}</span>`:""}${r.jf?`<span class="t">${A.j}</span>`:""}${tagsOf(r).map(x=>`<span class="t">${S[x]}</span>`).join("")}${isPop(r)?`<span class="t">Suosittu</span>`:""}${r.perus?`<span class="t">Perusateria</span>`:""}${r.custom?`<span class="t">Oma</span>`:""}</div>`;
  return`<div class="meta">${priceTag(r)}${r.min>0?`<b class="mn2">${ico("clock")}${timeTxt(r)}</b>`:""}${T[r.t]?`<span class="t">${T[r.t]}</span>`:""}${M[mainOf(r)]?`<span class="t">${M[mainOf(r)]}</span>`:""}${tagsOf(r).map(x=>`<span class="t">${S[x]}</span>`).join("")}${isPop(r)?`<span class="t">Suosittu</span>`:""}${r.custom?`<span class="t">Oma</span>`:""}</div>`;
}
const cartIc=r=>{const on=inCart(r.id);return`<button type="button" class="cartbtn ic" data-cart="${esc(r.id)}" aria-pressed="${on}" aria-label="${on?"Poista ostoslistalta":"Lisää ostoslistalle"}: ${esc(r.name)}">${ico(on?"check":"tlist")}</button>`;};
export const cartBtn=r=>{const on=inCart(r.id);return`<button type="button" class="cartbtn" data-cart="${esc(r.id)}" aria-pressed="${on}">${cartInner(on)}</button>`;};

function moreLabel(){
  const n=sel.s.size+sel.t.size+sel.m.size+sel.v.size+sel.w.size+sel.f.size;
  {
    const a=$("act"),h=[];
    for(const k of ["m","s","v","w","t","f"])for(const c of sel[k])h.push(`<button type="button" class="act" data-ak="${k}" data-ac="${esc(c)}" aria-label="Poista suodatin: ${esc(maps[k][c])}"><span>${esc(maps[k][c])}</span>${ico("x")}</button>`);
    a.innerHTML=h.join("");a.hidden=!h.length||!$("more").hidden;
  }
  const mt=$("moreTxt");mt.textContent=n||"";mt.hidden=!n;$("moreBtn").setAttribute("aria-label",n?"Muut suodattimet ("+n+" valittu)":"Muut suodattimet");
}
$("moreBtn").onclick=()=>{
  const open=$("more").hidden;
  $("more").hidden=!open;
  $("moreBtn").setAttribute("aria-expanded",open);
  moreLabel();
};
$("act").addEventListener("click",e=>{
  const b=e.target.closest("[data-ak]");if(!b)return;
  const k=b.dataset.ak,c=b.dataset.ac;
  sel[k].delete(c);if(chipEls[k][c])chipEls[k][c].setAttribute("aria-pressed","false");
  setPick(null);renderIdeas();
});

/* ---------- hakuikkuna ---------- */
export const hf={a:new Set(),s:new Set(),t:new Set(),m:new Set(),v:new Set(),w:new Set(),f:new Set(),fp:false},hkEls={a:{},s:{},t:{},m:{},v:{},w:{},f:{}};
let hq="",hkFlt=false;
const HK_IDS={a:"hkca",m:"hkcm",s:"hkcs",v:"hkcv",w:"hkcw",t:"hkct",f:"hkcf"},HK_SUG=["kana","jauheliha","lohi","pasta","kasvis"];
const hkAny=()=>hf.fp||FK.some(k=>hf[k].size);
const hkOk=(t,v)=>v>=0&&(v<=2||t.length>=5);
function hkResults(){
  const ts=termsOf(hq),sc=new Map();
  const res=all().filter(r=>{
    const v=qHit(r,ts);if(v<0)return false;
    if(hf.fp&&!(isFav(r.id)||isPop(r)))return false;
    for(const k of FK)if(hf[k].size&&!FV[k](r).some(x=>hf[k].has(x)))return false;
    sc.set(r.id,v);return true;
  });
  sortRes(res);
  if(ts.length)res.sort((x,y)=>sc.get(x.id)-sc.get(y.id));
  return{res,ts};
}
function hkWhy(r,ts){
  const out=[];
  for(const t0 of ts){
    const t=t0.replace(/kananmu\w*/g,"muna");
    if(hkOk(t,fzBest(t,qNames(r))))continue;
    for(const l of r.ing){
      const k=parseIng(l).key;
      if(hkOk(t,fzScore(t,fold(k.replace(/kananmun\w*/g,"muna"))))){if(!out.includes(k))out.push(k);break;}
    }
  }
  return out.slice(0,3);
}
/* ei osumia: lähimmät sanat ruokien nimistä ja aineksista (kirjoitusvirheet) */
let sugWords=null;
function lev(a,b){
  const m=a.length,n=b.length;if(!m)return n;if(!n)return m;
  let p=Array.from({length:n+1},(_,j)=>j);
  for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c;}
  return p[n];
}
function nearWords(ts){
  if(!sugWords){
    const w=new Map(),add=x=>{const f=fold(x).trim();if(f.length>=3&&!w.has(f))w.set(f,x.toLowerCase());};
    for(const r of all()){for(const x of r.name.split(/[\s,()]+/))add(x);for(const k of qIngs(r))add(k);}
    sugWords=[...w];
  }
  const out=[];
  for(const t of ts){
    if(t.length<3)continue;
    const lim=t.length<=4?1:t.length<=7?2:3;
    const best=sugWords.map(([f,x])=>[x,Math.min(lev(t,f),f.length>t.length?lev(t,f.slice(0,t.length))+1:99)]).filter(([,d])=>d<=lim).sort((a,b)=>a[1]-b[1]||a[0].length-b[0].length);
    for(const[x]of best)if(!out.includes(x)&&out.length<5)out.push(x);
  }
  return out;
}
export function noHitsHtml(ts,anyF,clrAttr,nNoF){
  const near=ts.length?nearWords(ts):[];
  const chip=q=>`<button type="button" class="chip" data-hq="${esc(q)}">${esc(q)}</button>`;
  let h=`<div class="empty"><p>${ts.length?"Ei osumia haulle.":"Ei osumia näillä valinnoilla."}</p>`;
  if(near.length)h+=`<div class="hkgt"><b>Tarkoititko</b></div><div class="chips">${near.map(chip).join("")}</div>`;
  if(anyF)h+=`<p class="note" style="margin-top:14px">${nNoF?"Ilman suodattimia löytyy "+(nNoF===1?"1 ruokaidea":nNoF+" ruokaideaa")+".":"Poista jokin valinta, niin ideoita löytyy."}</p><div class="actions"><button type="button" class="go" ${clrAttr}>Tyhjennä suodattimet</button></div>`;
  else if(ts.length&&!near.length)h+=`<div class="hkgt"><b>Kokeile</b></div><div class="chips">${HK_SUG.map(chip).join("")}</div>`;
  return h+`</div>`;
}
function hkEmpty(){
  const rec=state.sr||[];
  const chip=(q,ic)=>`<button type="button" class="chip" data-hq="${esc(q)}">${ic?ico("clock"):""}${esc(q)}</button>`;
  return(rec.length?`<div class="hkgt"><b>Viimeisimmät haut</b><button type="button" class="lk" data-hkclr>Tyhjennä</button></div><div class="chips">${rec.map(q=>chip(q,1)).join("")}</div>`:"")+
    `<div class="hkgt"><b>Kokeile</b></div><div class="chips">${HK_SUG.map(q=>chip(q,0)).join("")}</div><p class="note" style="margin-top:18px">Useita raaka-aineita: erota pilkulla, esim. <i>kana, riisi</i>.</p>`;
}
function hkActive(){
  const act=(k,c,l)=>`<button type="button" class="act" data-hak="${k}" data-hac="${esc(c)}" aria-label="Poista suodatin: ${esc(l)}"><span>${esc(l)}</span>${ico("x")}</button>`;
  const h=[];
  if(hf.fp)h.push(act("fp","","Suosikit ja suosituit"));
  for(const k of FK)for(const c of hf[k])h.push(act(k,c,maps[k][c]));
  const a=$("hkact");a.innerHTML=h.join("");a.hidden=!h.length||hkFlt;
  const n=h.length,b=$("hkbd");b.textContent=n||"";b.hidden=!n;
  $("hkflt").setAttribute("aria-label",n?"Suodattimet ("+n+" valittu)":"Suodattimet");
}
function renderHk(){
  const ts=termsOf(hq),box=$("hkres");
  $("hkqx").hidden=!hq;$("hkpanel").hidden=!hkFlt;$("hkflt").setAttribute("aria-expanded",hkFlt);
  hkActive();
  if(hkFlt){
    const pool=all().filter(r=>qHit(r,ts)>=0&&(!hf.fp||isFav(r.id)||isPop(r))).map(poolOf);
    chipStats({els:hkEls,st:hf,pool,exLi:false,open:hkX,box:g=>$(HK_IDS[g]),sec:(g,v)=>{const b=$(HK_IDS[g]);b.hidden=!v;b.previousElementSibling.hidden=!v;}});
  }
  if(!ts.length&&!hkAny()){box.innerHTML=hkEmpty();return;}
  const{res}=hkResults();
  const head=`<p class="hkcount" aria-live="polite">${res.length===1?"1 ruokaidea":res.length+" ruokaideaa"}</p>`;
  if(!res.length){
    box.innerHTML=head+noHitsHtml(ts,hkAny(),"data-hkclrf",ts.length?all().filter(r=>qHit(r,ts)>=0).length:0);
    return;
  }
  box.innerHTML=head+`<div class="grid hkgrid" data-lay="${state.lay==="grid"?"grid":"list"}">${res.map(r=>{const w=hkWhy(r,ts),o=qOpts(r,ts);return cardHtml(r,(w.length?`<div class="why">Sisältää ${w.map(esc).join(", ")}</div>`:"")+(o.length?`<div class="why">${o.map(m=>((r.vs||[]).includes(m)?"Versiona: ":"Muunnelmana: ")+esc(m.n)).join(" · ")}</div>`:""));}).join("")}</div>`;
}
function hkRemember(){
  const q=hq.trim();if(q.length<2||!termsOf(q).length)return;
  if(!hkResults().res.length)return;
  const a=(state.sr||[]).filter(x=>x.toLowerCase()!==q.toLowerCase());a.unshift(q);state.sr=a.slice(0,8);mutate();
}
function hkSet(q){hq=q.slice(0,80);$("hkq").value=hq;renderHk();$("hkbody").scrollTop=0;}
function fitHk(){
  const d=$("hkdlg"),v=window.visualViewport;if(!d.open||!v)return;
  d.style.top=Math.round(v.offsetTop)+"px";d.style.bottom="auto";d.style.height=Math.round(v.height)+"px";
}
if(window.visualViewport){visualViewport.addEventListener("resize",fitHk);visualViewport.addEventListener("scroll",fitHk);}
function openHk(){
  hideToast();
  hq="";hkFlt=false;hf.fp=false;
  for(const k of FK){hf[k].clear();for(const b of Object.values(hkEls[k]))b.setAttribute("aria-pressed","false");}
  $("hkfpb").setAttribute("aria-pressed","false");
  $("hkq").value="";renderHk();
  $("hkdlg").showModal();fitHk();$("hkbody").scrollTop=0;
  $("hkq").focus();
}
function buildHkChips(){
  const fp=document.createElement("button");fp.type="button";fp.className="chip fv";fp.id="hkfpb";fp.innerHTML=ico("star")+"<span>Suosikit ja suosituit</span>";fp.setAttribute("aria-pressed","false");
  fp.onclick=()=>{hf.fp=!hf.fp;fp.setAttribute("aria-pressed",hf.fp);renderHk();};
  $("hkfp").appendChild(fp);
  for(const k of FK){
    const box=$(HK_IDS[k]);
    for(const[code,label] of Object.entries(maps[k])){
      const b=document.createElement("button");b.type="button";b.className="chip";b.textContent=label;b.setAttribute("aria-pressed","false");hkEls[k][code]=b;
      b.onclick=()=>{
        if(hf[k].has(code))hf[k].delete(code);
        else{if(k==="v"){hf.v.clear();for(const o of Object.values(hkEls.v))o.setAttribute("aria-pressed","false");}hf[k].add(code);}
        b.setAttribute("aria-pressed",hf[k].has(code));renderHk();
      };
      box.appendChild(b);
    }
  }
}
buildHkChips();
$("hkqi").innerHTML=ico("search");$("hkqx").innerHTML=ico("x");$("hkclose").innerHTML=ico("x");$("pi").innerHTML=ico("search");
$("hkOpen").addEventListener("click",openHk);$("hkPill").addEventListener("click",openHk);
$("hkclose").addEventListener("click",()=>{hkRemember();$("hkdlg").close();});
$("hkdlg").addEventListener("close",()=>{
  const d=$("hkdlg");d.style.top="";d.style.bottom="";d.style.height="";
  pillSet(false);
  try{const o=$("hkOpen");if(o.getBoundingClientRect().bottom>0)o.focus({preventScroll:true});}catch(e){}
});
$("hkq").addEventListener("input",()=>{hq=$("hkq").value.slice(0,80);renderHk();$("hkbody").scrollTop=0;});
$("hkq").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();hkRemember();$("hkq").blur();}});
$("hkqx").addEventListener("click",()=>{hkSet("");$("hkq").focus();});
$("hkflt").addEventListener("click",()=>{hkFlt=!hkFlt;if(hkFlt)$("hkq").blur();renderHk();if(hkFlt)$("hkbody").scrollTop=0;});
$("hkdlg").addEventListener("click",e=>{
  let b;
  if((b=e.target.closest("[data-xg]"))){hkX[b.dataset.xg]=!hkX[b.dataset.xg];renderHk();return;}
  if((b=e.target.closest("[data-hq]"))){hkSet(b.dataset.hq);hkRemember();return;}
  if(e.target.closest("[data-hkclr]")){state.sr=[];mutate();renderHk();return;}
  if(e.target.closest("[data-hkclrf]")){hf.fp=false;$("hkfpb").setAttribute("aria-pressed","false");for(const k of FK){hf[k].clear();for(const x of Object.values(hkEls[k]))x.setAttribute("aria-pressed","false");}renderHk();return;}
  if((b=e.target.closest("[data-hak]"))){
    const k=b.dataset.hak,c=b.dataset.hac;
    if(k==="fp"){hf.fp=false;$("hkfpb").setAttribute("aria-pressed","false");}
    else{hf[k].delete(c);if(hkEls[k][c])hkEls[k][c].setAttribute("aria-pressed","false");}
    renderHk();return;
  }
  if(e.target.closest(".card[data-id], [data-open]")&&!e.target.closest("[data-cart]")){
    hkRemember();
    /* hakusana osui versioon tai muunnelmaan: avataan ruoka se valittuna, ellei ruoka ole jo listalla */
    const c=e.target.closest("[data-id], [data-open]"),r=c&&byId(c.dataset.open||c.dataset.id);
    if(r&&hasOpt(r)&&!state.lists.some(l=>l.cart.includes(r.id))){
      const o=qOpts(r,termsOf(hq));
      if(o.length)setSel(r.id,n=>{for(const m of o){if((r.vs||[]).includes(m))n.v=m.id;else if(!n.t.includes(m.id)){n.t=twExcl(r,n.t,m.id);n.t.push(m.id);}}});
    }
  }
});
/* ---------- hakupainike vieritettäessä ---------- */
let pillY=0,pillT=false;
export function pillSet(on){const p=$("hkPill");if(p.classList.contains("on")===on)return;p.classList.toggle("on",on);p.inert=!on;}
function pillScroll(){
  pillT=false;
  const y=Math.max(0,window.scrollY),dy=y-pillY;
  if(curTab!=="ideas"||document.querySelector("dialog[open]")){pillSet(false);pillY=y;return;}
  const hb=$("appbar").getBoundingClientRect().bottom;
  if(hb>56){pillSet(false);pillY=y;return;}
  if(dy<-8){pillSet(true);pillY=y;}
  else if(dy>8){pillSet(false);pillY=y;}
}
window.addEventListener("scroll",()=>{if(!pillT){pillT=true;requestAnimationFrame(pillScroll);}},{passive:true});

function costPer(r){const c=recipeCost(r);return(!c.n||c.big)?null:c.sum/pvOf(r);}
function sortRes(a){
  const nm=(x,y)=>x.name.localeCompare(y.name,"fi");
  const num=(f)=>(x,y)=>{const u=f(x),v=f(y);if(u==null&&v==null)return nm(x,y);if(u==null)return 1;if(v==null)return-1;return u-v||nm(x,y);};
  const k=state.sort;
  if(k==="cheap")return a.sort(num(costPer));
  if(k==="fast")return a.sort(num(r=>workOf(r)||(r.min>0?r.min:null)));
  if(k==="abc")return a.sort(nm);
  if(k==="views")return a.sort((x,y)=>((state.views[y.id]||0)-(state.views[x.id]||0))||(isFav(y.id)-isFav(x.id))||0);
  return a.sort((x,y)=>(isFav(y.id)-isFav(x.id))||0);
}
$("sort").onchange=()=>{state.sort=$("sort").value;mutate();renderIdeas();};
export function applyLay(){
  const g=state.lay==="grid";
  $("list").dataset.lay=g?"grid":"list";
  document.querySelectorAll("#thm [data-lay]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.lay===(g?"grid":"list")));
}
const LAYH={pa:22,ki:38,ke:8,uu:30,pn:48,ps:42,pu:62,am:52,sa:120,le:335,ja:350,li:95,wo:52,pi:28,ha:40,vp:70,al:100};
function gridPrice(r){
  const t=priceTxt(r);
  return t?`<b class="gp">${t}</b>`:"";
}
function gridCard(r,why=""){
  const u=imgUrl(r);
  return`<article class="card gc" data-id="${esc(r.id)}"><div class="gt" style="--h:${LAYH[r.t]||30}"><span class="gi">${ico("chef")}</span>${u?`<img class="th" alt="" loading="lazy" src="${esc(u)}">`:""}${isFav(r.id)?`<span class="gfv" title="Suosikki">${ico("heart")}</span>`:""}${cartIc(r)}</div><div class="ci"><h3><button type="button" class="ttl" data-open="${esc(r.id)}">${esc(r.name)}</button></h3><div class="gm">${gridPrice(r)}${r.min>0?`<span class="mn">${ico("clock")}${timeTxt(r)}</span>`:""}</div>${why}</div></article>`;
}
function listCard(r,why=""){
  return`<article class="card${imgUrl(r)?" pic":""}" data-id="${esc(r.id)}">${imgUrl(r)?`<div class="thw"><img class="th" alt="" loading="lazy" src="${esc(imgUrl(r))}"></div>`:""}<div class="ci"><h3><button type="button" class="ttl" data-open="${esc(r.id)}">${esc(r.name)}</button></h3><div class="meta">${priceTag(r)}<span class="mtr">${r.min>0?`<span class="mn">${ico("clock")}${timeTxt(r)}</span>`:""}${nutChip(r)}</span></div>${why}</div>${cartIc(r)}</article>`;
}
const cardHtml=(r,why="")=>state.lay==="grid"?gridCard(r,why):listCard(r,why);
export function renderIdeas(){
  moreLabel();updateChips();
  const res=sortRes(all().filter(matches));
  if(qTerms().length)res.sort((x,y)=>(qHit(x)>=100?1:0)-(qHit(y)>=100?1:0));
  const anyF=onlyFP||qTerms().length||FK.some(k=>sel[k].size);
  $("sort").value=state.sort;
  $("count").textContent=res.length===1?"1 ruokaidea":res.length+" ruokaideaa";$("clrBtn").hidden=!anyF;
  $("list").innerHTML=res.length?res.map(r=>cardHtml(r)).join(""):
    noHitsHtml(qTerms(),onlyFP||FK.some(k=>sel[k].size),"data-clrf",qTerms().length?all().filter(r=>qHit(r)>=0).length:0);
  uiEdit();renderSd();
}
