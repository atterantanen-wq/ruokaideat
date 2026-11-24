/* oman ruoan lisäys, muokkaus kortissa, synonyymit, kopiointi ja kuvan valinta */
import {capF,synOwner} from "./registry.js";
import {S,A,T,M,WLD,HOL,KQ,suggestWd,$,ico,esc,clip,R,workOf,defServ,host,SYN,parseIng} from "./core.js";
import {PR} from "./prices.js";
import {CAT,CIDX,CBYK,rebuildCat,catFind,fold,normIngName,fzBest,autoMain,mainOf,findPrice,isSkip,eur,servOf,hasOpt,selR} from "./catalog.js";
import {state,mutate} from "./state.js";
import {all,byId,autoTags,pick,setPick,assetsApi,releaseImg,dropDraftImg,dropRecipeImg,uploadImg} from "./ideas.js";
import {renderIdeas} from "./search.js";
import {DEPS} from "./price-updates.js";
import {pruneChecked,purgeCart} from "./cart.js";
import {refreshCart} from "./cart-view.js";
import {pf,setPf,dlg,edit,openId,setEdit,introOf,renderDlg,openDlg} from "./info.js";
import {curTab} from "./tabs.js";
import {selOf} from "../recipes.js";

/* ---------- lisää ruoka ---------- */
const lines=v=>String(v).split("\n").map(x=>x.trim()).filter(Boolean);
const descOf=(f,url)=>url?host(url):(f.steps[0]?clip(f.steps[0],110):f.ing.length+" ainesta");
let hidOpen=false;
export function uiEdit(){
  const n=state.hidden.length;
  $("hiddenBox").hidden=!n;$("hiddenN").textContent=n;
  if(!n)hidOpen=false;
  $("hidTog").setAttribute("aria-expanded",hidOpen);
  const box=$("hidList");box.hidden=!hidOpen;
  if(!hidOpen){box.innerHTML="";return;}
  const rows=state.hidden.map(id=>R.find(r=>r.id===id)).filter(Boolean).sort((a,b)=>a.name.localeCompare(b.name,"fi"));
  box.innerHTML=`<p class="note" style="margin:10px 0 0">Poistetut valmiit ruoat. Palauta ruoka listalle painamalla Palauta.</p><ul class="hl">${rows.map(r=>`<li><span class="nm">${esc(r.name)}<small>${esc([T[r.t],M[r.m]].filter(Boolean).join(" · "))}</small></span><button type="button" class="cartbtn" data-restore="${esc(r.id)}" aria-label="Palauta: ${esc(r.name)}"><span>Palauta</span></button></li>`).join("")}</ul>${rows.length>1?`<p style="margin:8px 0 0"><button class="clear" id="restore" type="button">Palauta kaikki</button></p>`:""}`;
}
$("hidTog").onclick=()=>{hidOpen=!hidOpen;uiEdit();};
$("hiddenBox").addEventListener("click",e=>{
  const b=e.target.closest("[data-restore],#restore");if(!b)return;
  if(b.id==="restore")state.hidden=[];else state.hidden=state.hidden.filter(i=>i!==b.dataset.restore);
  setPick(null);mutate();renderIdeas();refreshCart();
});
export const NEWREC=()=>({id:"",name:"",mo:"",t:"",s:[],min:0,ing:[],steps:[],url:"",custom:true,m:"",wd:"",fe:"",jf:false,kq:[]});
export let ned=null;
export const swapNew=fn=>{const sv=edit;setEdit(ned);try{return fn();}finally{ned=edit;setEdit(sv);}};
export function renderNewHost(){
  const h=$("newBody");if(!h)return;
  if(curTab!=="add"){h.innerHTML="";return;}
  if(!ned){
    const own=state.custom.slice().sort((a,b)=>a.name.localeCompare(b.name,"fi"));
    const ownL=own.length?`<div class="nstep ownl"><h2 class="nh">Omat ruoat (${own.length})</h2><ul class="hl">${own.map(r=>`<li><button type="button" class="nm ownop" data-ownopen="${esc(r.id)}">${esc(r.name)}<small>${esc([T[r.t],M[mainOf(r)]].filter(Boolean).join(" · ")||"Oma ruoka")}</small></button><button type="button" class="cartbtn" data-ownedit="${esc(r.id)}" aria-label="Muokkaa tai poista: ${esc(r.name)}"><span>Muokkaa</span></button></li>`).join("")}</ul></div>`:"";
    h.innerHTML=`<div class="nstep"><h2 class="nh">Uusi ruoka</h2><label class="rf2 w" for="nn"><span>Ruoan nimi</span><input id="nn" type="text" maxlength="120" placeholder="esim. Kanakeitto" autocomplete="off" enterkeyhint="next"></label><div class="addgo"><button type="button" class="go" id="nnGo" disabled>Jatka</button></div></div>`+ownL;
    return;
  }
  swapNew(()=>renderDlg());
}
function beginNew(name){
  setPf(null);
  ned={id:"",isNew:true,draft:{name:clip(String(name||"").trim(),120),mo:"",t:"",s:[],min:"",ing:[],steps:[],serv:4,img:"",intro:"",tips:"",serve:"",sides:[],extras:""},tagOpen:true,pickOpen:false,delArm:false,err:"",bulk:null};
  renderNewHost();
  window.scrollTo(0,0);
}
$("newBody").addEventListener("input",e=>{
  if(e.target.id==="nn"){$("nnGo").disabled=!e.target.value.trim();return;}
  if(ned)swapNew(()=>edInput(e));
});
$("newBody").addEventListener("keydown",e=>{
  if(e.target.id==="nn"&&e.key==="Enter"){e.preventDefault();const v=e.target.value.trim();if(v)beginNew(v);}
});
$("newBody").addEventListener("click",e=>{
  if(e.target.closest("#nnGo")){const v=$("nn").value.trim();if(v)beginNew(v);return;}
  const o=e.target.closest("[data-ownopen],[data-ownedit]");
  if(o){if(o.dataset.ownedit)beginEdit(o.dataset.ownedit);else openDlg(o.dataset.ownopen);}
});
$("newBody").addEventListener("change",async e=>{
  if(e.target.id!=="eimg"||!ned)return;
  const f=e.target.files&&e.target.files[0];if(!f)return;
  const ed=ned;ed.busy=true;ed.err="";renderNewHost();
  try{
    const id=await uploadImg(f);
    if(ned!==ed){releaseImg(id);return;}
    if(ed.draft.img&&ed.draft.img!==(state.img[ed.id]||""))releaseImg(ed.draft.img);
    ed.draft.img=id;
  }catch(x){ed.err=x.message==="type"?"Valitse kuvatiedosto (JPG, PNG tai WebP).":"Kuvan lataus ei onnistunut.";}
  ed.busy=false;if(ned===ed)renderNewHost();
});
/* ---------- muokkaus suoraan kortissa ---------- */
const UNITS=["g","kg","dl","ml","l","rkl","tl","kpl","prk","pss","nippu"];
const PICK_HIDE=new Set(["kasvisliemikuutio","lihaliemikuutio","kanaliemikuutio","kalaliemikuutio","lihaliemi","lenkkimakkara","pasta","naudanliha"]);
export const fmtQ=q=>String(Math.round(q*100)/100);
function mkDraft(r){
  return{name:r.name,mo:r.mo||"",t:r.t,wd:r.wd||"",fe:r.fe||"",jf:!!r.jf,kq:[...(r.kq||[])],s:[],min:r.min>0?String(r.min):"",w:workOf(r)>0?String(workOf(r)):"",
    ing:(()=>{const o=[],gr=r.gr||[];r.ing.forEach((l,i)=>{gr.forEach(g=>{if(g[0]===i)o.push({name:"",h:g[1]});});const p=parseIng(l);o.push({name:p.rawName,qty:p.q==null?"":fmtQ(p.q),unit:p.u||"kpl"});});return o;})(),
    steps:[...r.steps],serv:servOf(r),img:state.img[r.id]||"",
    intro:introOf(r),tips:(r.tips||[]).join("\n"),serve:r.serve||"",sides:[...(r.sides||[])],extras:(r.extras||[]).join(", ")};
}
function tagList(d){
  const a=[];
  if(d.t&&T[d.t])a.push(["t",d.t,T[d.t]]);
  return a;
}
function pickList(q0){
  const raw=String(q0||"").trim().toLowerCase(),q=fold(raw);
  const rows=[],seen=new Set();
  const sub=k=>PR[k]?eur(PR[k].p)+" / "+({kg:"kg",l:"l",kpl:"kpl"})[PR[k].per]:"";
  for(const e of CAT){
    if(PICK_HIDE.has(e.key))continue;
    const s=fzBest(q,[e.key,...e.syn]);
    seen.add(e.key);
    if(s>=0)rows.push({k:e.key,s,sub:sub(e.key)||DEPS[e.d]});
  }
  for(const k of Object.keys(PR)){
    if(seen.has(k)||PICK_HIDE.has(k)||catFind(k))continue;
    const s=fzBest(q,[k]);if(s>=0)rows.push({k,s,sub:sub(k)});
  }
  for(const k of Object.keys(state.ing)){const s=fzBest(q,[k,...(state.ing[k].syn||[])]);if(s>=0)rows.push({k,s,sub:DEPS[state.ing[k].d]+" · oma"});}
  rows.sort((a,b)=>(q?a.s-b.s:0)||a.k.localeCompare(b.k,"fi"));
  const btn=x=>`<button type="button" class="pi" data-ed="pick" data-key="${esc(x.k)}"><span>${esc(x.k.charAt(0).toUpperCase()+x.k.slice(1))}</span><small>${esc(x.sub)}</small></button>`;
  const good=rows.filter(x=>x.s<3),fz=rows.filter(x=>x.s>=3);
  let h2=good.map(btn).join("");
  if(fz.length)h2+=`<p class="gt pl-h">${good.length?"Lähellä hakua":"Tarkoititko jotain näistä?"}</p>`+fz.slice(0,8).map(btn).join("");
  if(raw&&!rows.some(x=>x.k===raw)&&!CIDX.has(raw)&&!state.ing[raw]&&/^[a-zäöå0-9][a-zäöå0-9 \-.,()%]{0,59}$/i.test(raw))h2+=`<button type="button" class="pi" data-ed="newing" data-name="${esc(raw)}"><span>Luo uusi aines ”${esc(raw)}”</span><small>valitse tuoteryhmä</small></button>`;
  return h2||`<p class="note" style="padding:10px 4px">Ei osumia.</p>`;
}
function bulkHtml(k){
  return`<div class="epanel"><label class="rf2 w"><span>${k==="ing"?"Yksi aines per rivi, määrä ja yksikkö nimen perään tai eteen. Osion otsikko: rivi, joka loppuu kaksoispisteeseen":"Yksi vaihe per rivi"}</span><textarea id="bulk" rows="6" placeholder="${k==="ing"?"kananrintafilee 500 g&#10;2 dl ruokakermaa&#10;sipuli 1 kpl":"Kuullota sipuli.&#10;Lisää kana ja ruskista."}"></textarea></label><div class="nfa"><button type="button" class="go" data-ed="bulkadd">Lisää rivit</button><button type="button" class="cartbtn" data-ed="bulk" data-k=""><span>Peruuta</span></button></div></div>`;
}
function draftGr(d){const gr=[];let n=0;for(const x of d.ing){if(x.h!==undefined){const t=x.h.trim();if(t){if(gr.length&&gr[gr.length-1][0]===n)gr[gr.length-1][1]=clip(t,40);else gr.push([n,clip(t,40)]);}}else if(x.name.trim())n++;}return gr.filter(g=>g[0]<n);}
function draftLines(d){
  return d.ing.filter(x=>x.name.trim()).map(x=>{
    const q=parseFloat(String(x.qty).replace(",","."));
    return isFinite(q)&&q>0?x.name.trim()+" "+fmtQ(q)+" "+(x.unit||"kpl"):x.name.trim();
  });
}
/* ehdotukset synonyymin liittämiseen: rekisterin ainekset ja omat */
function synList(nf){
  const raw=String(nf.q!=null&&nf.q!==""?nf.q:nf.name).trim().toLowerCase();
  const qs=(nf.q!=null&&nf.q!==""?[raw]:[raw,...raw.split(/\s+/).filter(w=>w.length>=4)]).map(fold);
  const cp=(a,b)=>{let n=0;while(n<a.length&&n<b.length&&a[n]===b[n])n++;return n;};
  const sc=(names)=>{
    let best=-1;
    for(const q of qs){
      const v=fzBest(q,names);if(v>=0&&(best<0||v<best))best=v;
      for(const n0 of names){const n=fold(n0);if(n.length>=4&&q.length>=4&&(q.includes(n)||cp(q,n)>=Math.max(5,Math.ceil(0.6*Math.min(q.length,n.length))))){if(best<0||best>2.5)best=2.5;}}
    }
    return best;
  };
  const rows=[];
  for(const e of CAT){if(PICK_HIDE.has(e.key))continue;const v=sc([e.key,...e.syn]);if(v>=0)rows.push({k:e.key,s:v,sub:DEPS[e.d]});}
  for(const k of Object.keys(state.ing)){const v=sc([k,...(state.ing[k].syn||[])]);if(v>=0)rows.push({k,s:v,sub:DEPS[state.ing[k].d]+" · oma"});}
  rows.sort((a,b)=>a.s-b.s||a.k.localeCompare(b.k,"fi"));
  return rows.slice(0,12).map(x=>`<button type="button" class="pi" data-ed="synpick" data-key="${esc(x.k)}"><span>${esc(capF(x.k))}</span><small>${esc(x.sub)}</small></button>`).join("")||`<p class="note" style="padding:10px 4px">Ei osumia. Hae toisella nimellä tai luo uusi aines.</p>`;
}
/* lisää synonyymi valmiille tai omalle ainekselle; valmis aines kopioidaan omaksi muokatuksi versioksi */
function addSynTo(k,nm){
  nm=nm.trim().toLowerCase().replace(/\s+/g," ");
  if(!/^[\p{L}\p{N}][\p{L}\p{N} \-.,()%]{0,59}$/u.test(nm))return"Nimi ei kelpaa synonyymiksi.";
  const ow=synOwner(nm,k);if(ow)return"”"+nm+"” kuuluu jo "+(ow[1]?"tuotteelle":"ainekselle")+" ”"+capF(ow[0])+"”.";
  const own=state.ing[k];
  if(own){
    if((own.syn||[]).length>=12)return"Synonyymejä voi olla enintään 12.";
    own.syn=[...(own.syn||[]),nm];
  }else{
    const c=CBYK.get(k);if(!c)return"Ainesta ei löytynyt.";
    let x=state.ix[k];
    if(!x){x={d:c.o.d,m:c.o.m,u:Object.assign({},c.o.u),syn:[...c.o.syn]};if(c.o.n)x.n=Object.assign({},c.o.n);if(c.o.pan)x.pan=true;}
    if((x.syn||c.syn).length>=12)return"Synonyymejä voi olla enintään 12.";
    x.syn=[...(x.syn||c.syn),nm];state.ix[k]=x;
  }
  rebuildCat();mutate();
  return"";
}
function serveEditHtml(d){
  const li=all().filter(x=>x.t==="li").sort((a,b)=>a.name.localeCompare(b.name,"fi"));
  return`<h3>Tarjoilu</h3>
<input type="text" class="etx" data-ed-in="serve" maxlength="300" value="${esc(d.serve||"")}" placeholder="esim. Tarjoa perunamuusin ja puolukkahillon kanssa." aria-label="Tarjoiluehdotus">
${li.length?`<p class="gt">Lisukkeet, joita ehdotetaan ostoslistalle lisätessä</p><div class="chips">${li.map(x=>`<button type="button" class="chip" data-ed="sidetg" data-id="${esc(x.id)}" aria-pressed="${(d.sides||[]).includes(x.id)}">${esc(x.name)}</button>`).join("")}</div>`:""}
<label class="rf2 w" style="margin-top:10px"><span>Lisäksi ostoslistalle ehdotettavat tuotteet, pilkulla eroteltuna</span><input type="text" data-ed-in="extras" maxlength="200" value="${esc(d.extras||"")}" placeholder="esim. puolukkahillo, ruisleipä"></label>`;
}
export function renderEdit(r){
  const d=edit.draft,tags=tagList(d),have=new Set(tags.map(x=>x[0]+x[1]));
  const tg=([k,c,l])=>`<span class="t ed">${esc(l)}<button type="button" data-ed="rmtag" data-k="${k}" data-c="${c}" aria-label="Poista tägi ${esc(l)}">${ico("x")}</button></span>`;
  const dl=draftLines(d),am=autoMain({ing:dl}),eff=d.mo&&M[d.mo]?d.mo:am;
  const autoHtml=[...autoTags(r)].filter(k=>S[k]).map(k=>`<span class="t">${esc(S[k])}</span>`).join("");
  const tagHtml=tags.filter(x=>x[0]!=="s").map(tg).join("")+autoHtml+tags.filter(x=>x[0]==="s").map(tg).join("");
  const group=(k,title,map)=>{
    const o=Object.entries(map).filter(([c])=>!have.has(k+c));
    return o.length?`<p class="gt">${title}</p><div class="chips">${o.map(([c,l])=>`<button type="button" class="chip" data-ed="addtag" data-k="${k}" data-c="${c}">${esc(l)}</button>`).join("")}</div>`:"";
  };
  const panel=edit.tagOpen?`<div class="epanel">${group("t","Ruokalaji",T)}</div>`:"";
  const rows=d.ing.map((x,i)=>{
    let key=x.name.trim().toLowerCase();key=SYN[key]||key;
    const np=key&&!isSkip(key)&&!findPrice(key)&&!catFind(key)&&!state.ing[key];
    const us=UNITS.concat(x.unit&&!UNITS.includes(x.unit)?[x.unit]:[]);
    const last=d.ing.length-1;
    if(x.h!==undefined)return`<li class="ir hd"><input class="hin" type="text" data-ed-in="hd" data-i="${i}" value="${esc(x.h)}" placeholder="Osion nimi, esim. Kastike" maxlength="40" aria-label="Osion nimi"><button type="button" class="rm" data-ed="ingup" data-i="${i}" aria-label="Siirrä osio ylös"${i===0?" disabled":""}>${ico("up")}</button><button type="button" class="rm" data-ed="ingdn" data-i="${i}" aria-label="Siirrä osio alas"${i===last?" disabled":""}>${ico("down")}</button><button type="button" class="rm" data-ed="rming" data-i="${i}" aria-label="Poista osio">${ico("x")}</button></li>`;
    return`<li class="ir"><span class="in">${esc(x.name)}${np?`<button type="button" class="lk sm" data-ed="mking" data-i="${i}">ei rekisterissä, lisää</button>`:""}</span><button type="button" class="rm" data-ed="ingup" data-i="${i}" aria-label="Siirrä ylös: ${esc(x.name)}"${i===0?" disabled":""}>${ico("up")}</button><button type="button" class="rm" data-ed="ingdn" data-i="${i}" aria-label="Siirrä alas: ${esc(x.name)}"${i===last?" disabled":""}>${ico("down")}</button><button type="button" class="rm" data-ed="rming" data-i="${i}" aria-label="Poista aines ${esc(x.name)}">${ico("x")}</button><span class="iin"><input class="iq" type="text" inputmode="decimal" data-ed-in="qty" data-i="${i}" value="${esc(x.qty)}" placeholder="määrä" aria-label="Määrä: ${esc(x.name)}"><select class="iu" data-ed-in="unit" data-i="${i}" aria-label="Yksikkö: ${esc(x.name)}">${us.map(u=>`<option${u===x.unit?" selected":""}>${u}</option>`).join("")}</select></span></li>`;
  }).join("");
  const mainHtml=`<h3>Pääraaka-aine</h3><div class="mainrow"><span class="t">${esc(M[eff]||"Ei vielä")}</span><small>${d.mo?"valittu käsin":eff?"päätelty aineksista":"lisää ensin ainekset"}</small><button type="button" class="lk" data-ed="mainpanel" aria-expanded="${!!edit.mainOpen}">${edit.mainOpen?"Sulje":"Vaihda"}</button></div>${edit.mainOpen?`<div class="epanel"><div class="chips">${Object.entries(M).map(([c,l])=>`<button type="button" class="chip" data-ed="setmain" data-c="${c}" aria-pressed="${eff===c}">${esc(l)}</button>`).join("")}${d.mo?`<button type="button" class="chip" data-ed="setmain" data-c="">Automaattinen</button>`:""}</div></div>`:""}`;
  const xch=(k,map)=>Object.entries(map).map(([c,l])=>`<button type="button" class="chip" data-ed="xset" data-k="${k}" data-c="${c}" aria-pressed="${d[k]===c}">${esc(l)}</button>`).join("");
  const xsum=[WLD[d.wd],HOL[d.fe],d.jf?A.j:"",...(d.kq||[]).map(k=>S[k])].filter(Boolean).join(", ");
  const sgw=!d.wd?suggestWd(d.name):"";
  const xtraHtml=`<h3>Lisätiedot</h3><div class="mainrow"><span class="t">${esc(xsum||"Ei valittu")}</span>${sgw&&!edit.xOpen?`<button type="button" class="lk" data-ed="xset" data-k="wd" data-c="${sgw}">Ehdotus: ${esc(WLD[sgw])}</button>`:""}<button type="button" class="lk" data-ed="xtra" aria-expanded="${!!edit.xOpen}">${edit.xOpen?"Sulje":"Muokkaa"}</button></div>${edit.xOpen?`<div class="epanel"><p class="gt">Maailmalta</p><div class="chips">${xch("wd",WLD)}</div><p class="gt">Juhlapyhä</p><div class="chips">${xch("fe",HOL)}</div><p class="gt">Tilaisuus</p><div class="chips"><button type="button" class="chip" data-ed="xjf" aria-pressed="${!!d.jf}">${esc(A.j)}</button></div><p class="gt">Valmistus</p><div class="chips">${KQ.map(k=>`<button type="button" class="chip" data-ed="xkq" data-c="${k}" aria-pressed="${(d.kq||[]).includes(k)}">${esc(S[k])}</button>`).join("")}</div></div>`:""}`;
  const nf=edit.newIng;
  const nfHtml=nf?`<div class="epanel nf"><p class="pft">Ei rekisterissä: <b>${esc(nf.name)}</b></p><div class="seg" role="group" aria-label="Miten lisätään"><button type="button" data-ed="nmode" data-m="syn" aria-pressed="${nf.mode!=="new"}">Liitä synonyymiksi</button><button type="button" data-ed="nmode" data-m="new" aria-pressed="${nf.mode==="new"}">Luo uusi aines</button></div>${nf.mode==="new"?`<div class="f"><label for="nid">Tuoteryhmä</label><select id="nid" data-ed-in="nid"><option value="">Valitse…</option>${DEPS.map((n,i)=>`<option value="${i}"${String(nf.d)===String(i)?" selected":""}>${esc(n)}</option>`).join("")}</select></div><div class="f"><label for="nim">Pääraaka-aine (valinnainen)</label><select id="nim" data-ed-in="nim"><option value="">Ei mitään</option>${Object.entries(M).filter(([c])=>c!=="v").map(([c,l])=>`<option value="${c}"${nf.m===c?" selected":""}>${esc(l)}</option>`).join("")}</select></div>${nf.err?`<p class="note err" role="alert">${esc(nf.err)}</p>`:""}<div class="nfa"><button type="button" class="go" data-ed="newsave">Lisää aines</button><button type="button" class="cartbtn" data-ed="newcancel"><span>Peruuta</span></button></div>`:`<p class="note nd" style="margin:8px 0">Valitse aines, jonka toinen nimi ”${esc(nf.name)}” on. Jatkossa se tunnistetaan sille.</p><input id="nsq" type="search" data-ed-in="nsq" value="${esc(nf.q||"")}" placeholder="Hae ainesta rekisteristä" autocomplete="off" aria-label="Hae ainesta rekisteristä"><div class="pl" id="npl">${synList(nf)}</div>${nf.err?`<p class="note err" role="alert">${esc(nf.err)}</p>`:""}<div class="nfa"><button type="button" class="cartbtn" data-ed="newcancel"><span>Peruuta</span></button></div>`}</div>`:"";
  const pick=edit.pickOpen?(nf?nfHtml:`<div class="epanel"><input id="pq" type="search" data-ed-in="pq" placeholder="Hae raaka-ainetta" autocomplete="off" aria-label="Hae raaka-ainetta"><div class="pl" id="pl">${pickList("")}</div></div>`):"";
  const steps=d.steps.map((x,i)=>`<li><textarea rows="2" data-ed-in="step" data-i="${i}" aria-label="Vaihe ${i+1}">${esc(x)}</textarea><button type="button" class="rm" data-ed="rmstep" data-i="${i}" aria-label="Poista vaihe ${i+1}">${ico("x")}</button></li>`).join("");
  return`<button type="button" class="dx" data-ed="cancel" aria-label="Peruuta muokkaus">${ico("x")}</button>
<input id="en" class="en" type="text" data-ed-in="name" value="${esc(d.name)}" placeholder="Ruoan nimi" aria-label="Ruoan nimi" maxlength="120">
${edit.err?`<p class="note err" role="alert">${esc(edit.err)}</p>`:""}
${assetsApi?`<div class="eimg">${d.img?`<img alt="" src="/_blob/${esc(d.img)}">`:""}<button type="button" class="cartbtn" data-ed="imgpick"${edit.busy?" disabled":""}>${ico("plus")}<span>${edit.busy?"Ladataan…":d.img?"Vaihda kuva":"Lisää kuva"}</span></button>${d.img&&!edit.busy?`<button type="button" class="clear" data-ed="imgrm">Poista kuva</button>`:""}<input id="eimg" type="file" accept="image/*" hidden></div>`:""}
<div class="tagrow">${tagHtml}<button type="button" class="t add" data-ed="tagpanel" aria-expanded="${edit.tagOpen}" aria-label="Lisää tägi">${ico("plus")}</button></div>${panel}
<div class="mrow"><span class="lb2" id="svl">Annosmäärä</span><span class="step"><button type="button" class="sb" data-ed="servm" aria-label="Vähennä annoksia"${d.serv<=1?" disabled":""}>−</button><b aria-live="polite" aria-labelledby="svl">${d.serv}</b><button type="button" class="sb" data-ed="servp" aria-label="Lisää annoksia"${d.serv>=24?" disabled":""}>+</button></span></div>
<div class="mrow"><label for="emin">Aika yhteensä (min)</label><input id="emin" type="number" min="0" inputmode="numeric" data-ed-in="min" value="${esc(d.min)}"></div>
<div class="mrow"><label for="ew">Josta työtä (min)</label><input id="ew" type="number" min="0" inputmode="numeric" data-ed-in="w" value="${esc(d.w)}" placeholder="valinnainen"></div>
<h3>Kuvaus</h3>
<textarea class="etx" rows="2" data-ed-in="intro" maxlength="600" placeholder="Muutama lause ruoasta, näkyy ruoan sivulla" aria-label="Kuvaus">${esc(d.intro||"")}</textarea>
<h3>Ainekset</h3>
${edit.info?`<p class="note ok" role="status">${esc(edit.info)}</p>`:""}
${rows?`<ul class="il">${rows}</ul>`:`<p class="note">Ei aineksia.</p>`}
<div class="edb"><button type="button" class="cartbtn" data-ed="adding" aria-expanded="${edit.pickOpen}">${ico("plus")}<span>Lisää aines</span></button><button type="button" class="cartbtn" data-ed="addhd">${ico("plus")}<span>Lisää osio</span></button><button type="button" class="lk" data-ed="bulk" data-k="ing" aria-expanded="${edit.bulk==="ing"}">Liitä ainekset tekstinä</button></div>${pick}${edit.bulk==="ing"?bulkHtml("ing"):""}
${mainHtml}
${xtraHtml}
<h3>Ohje</h3>
${steps?`<ol class="sl">${steps}</ol>`:`<p class="note">Ei ohjevaiheita.</p>`}
<div class="edb"><button type="button" class="cartbtn" data-ed="addstep">${ico("plus")}<span>Lisää vaihe</span></button><button type="button" class="lk" data-ed="bulk" data-k="steps" aria-expanded="${edit.bulk==="steps"}">Liitä ohje tekstinä</button></div>${edit.bulk==="steps"?bulkHtml("steps"):""}
${serveEditHtml(d)}
<h3>Vinkit</h3>
<textarea class="etx" rows="3" data-ed-in="tips" placeholder="Yksi vinkki per rivi" aria-label="Vinkit, yksi per rivi">${esc(d.tips||"")}</textarea>
${edit.isNew?"":`<div class="dz">${!r.custom&&state.over[r.id]?`<button type="button" class="clear" data-ed="reset">Palauta alkuperäinen</button>`:""}<button type="button" class="clear err" data-ed="del">${edit.delArm?"Varmista poisto":"Poista ruoka"}</button></div>`}
<div class="actions"><button type="button" class="go" data-ed="save">Tallenna</button><button type="button" class="cartbtn" data-ed="cancel"><span>Peruuta</span></button></div>`;
}
export function beginEdit(id){
  const r=byId(id);if(!r)return;
  if(!r.custom&&hasOpt(r)){copyRecipe(id,"Muokkaat omaa kopiotasi valituilla versiolla ja muunnelmilla. Alkuperäinen resepti säilyy ennallaan.");return;}
  setPf(null);setEdit({id,draft:mkDraft(r),tagOpen:false,pickOpen:false,delArm:false,err:""});
  if(!dlg.open||openId!==id)openDlg(id);else renderDlg();
}
function addIng(name,qty,unit){
  edit.draft.ing.push({name,qty,unit});
  edit.pickOpen=false;edit.newIng=null;edit.focus='.il li:last-child .iq';
}
function saveEdit(){
  const d=edit.draft,isNew=!!edit.isNew,r=isNew?NEWREC():byId(edit.id);
  if(!r){setEdit(null);return renderDlg();}
  const name=clip(d.name.trim(),120);
  const ing=d.ing.filter(x=>x.name.trim()).map(x=>{
    const q=parseFloat(String(x.qty).replace(",","."));
    return isFinite(q)&&q>0?x.name.trim()+" "+fmtQ(q)+" "+(x.unit||"kpl"):x.name.trim();
  });
  const steps=d.steps.map(x=>x.trim()).filter(Boolean);
  if(!name){edit.err="Kirjoita ruoalle nimi.";return renderDlg();}
  if(!ing.length&&!steps.length&&!r.url){edit.err="Lisää ainakin yksi aines tai ohjevaihe.";return renderDlg();}
  const f={name,mo:d.mo||"",t:d.t||"",wd:WLD[d.wd]?d.wd:"",fe:HOL[d.fe]?d.fe:"",jf:!!d.jf,kq:(d.kq||[]).filter(k=>KQ.includes(k)),s:[],min:Math.max(0,Math.min(1440,parseInt(d.min)||0)),w:Math.max(0,Math.min(1440,parseInt(d.w)||0)),ing,gr:draftGr(d),steps,
    intro:clip((d.intro||"").trim(),600),serve:clip((d.serve||"").trim(),300),
    tips:String(d.tips||"").split("\n").map(x=>x.trim()).filter(Boolean).slice(0,12).map(x=>clip(x,400)),
    sides:(d.sides||[]).slice(0,8),
    extras:String(d.extras||"").split(",").map(x=>x.trim().toLowerCase()).filter(x=>/^[a-zäöå0-9][a-zäöå0-9 \-.,()%]{0,59}$/i.test(x)).slice(0,8)};
  if(!r.custom&&!isNew)delete f.intro;
  if(isNew){
    if(state.custom.length>=500){edit.err="Omia ruokia voi olla enintään 500.";return renderDlg();}
    const id="c"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
    const rec={id,...f,url:"",custom:true,m:""};rec.d=descOf(f,"");
    state.custom.push(rec);
    if(d.serv!==4)state.serv[id]=d.serv;
    if(d.img)state.img[id]=d.img;
    setEdit(null);setPick(null);mutate();renderIdeas();refreshCart();openDlg(id);
    return;
  }
  if(d.serv===defServ(r.id))delete state.serv[r.id];else state.serv[r.id]=d.serv;
  if(r.custom)Object.assign(r,f,{d:descOf(f,r.url)});else state.over[r.id]=f;
  {const old=state.img[r.id]||"";if(d.img!==old){if(d.img)state.img[r.id]=d.img;else delete state.img[r.id];releaseImg(old);}}
  setPick(null);setEdit(null);pruneChecked();mutate();renderIdeas();refreshCart();renderDlg();
}
export function editAct(x){
  const a=x.dataset.ed,d=edit.draft,i=+x.dataset.i;
  edit.err="";
  if(a==="rmtag"){d[x.dataset.k==="m"?"mo":x.dataset.k]="";}
  else if(a==="addtag"){d[x.dataset.k==="m"?"mo":x.dataset.k]=x.dataset.c;}
  else if(a==="mainpanel")edit.mainOpen=!edit.mainOpen;
  else if(a==="sidetg"){d.sides=d.sides||[];const id=x.dataset.id,j=d.sides.indexOf(id);if(j>=0)d.sides.splice(j,1);else if(d.sides.length<8)d.sides.push(id);}
  else if(a==="setmain"){d.mo=x.dataset.c;edit.mainOpen=false;}
  else if(a==="tagpanel")edit.tagOpen=!edit.tagOpen;
  else if(a==="xtra")edit.xOpen=!edit.xOpen;
  else if(a==="xset"){const k=x.dataset.k;d[k]=d[k]===x.dataset.c?"":x.dataset.c;}
  else if(a==="xjf")d.jf=!d.jf;
  else if(a==="xkq"){const c=x.dataset.c,q=new Set(d.kq||[]);if(q.has(c))q.delete(c);else q.add(c);d.kq=[...q];}
  else if(a==="imgpick"){const f=$("eimg");if(f)f.click();return;}
  else if(a==="imgrm"){if(d.img&&d.img!==(state.img[edit.id]||""))releaseImg(d.img);d.img="";}
  else if(a==="rming")d.ing.splice(i,1);
  else if(a==="addhd"){d.ing.push({name:"",h:""});edit.focus=".il li:last-child .hin";}
  else if(a==="ingup"||a==="ingdn"){
    const n=a==="ingup"?i-1:i+1;
    if(n>=0&&n<d.ing.length){
      [d.ing[i],d.ing[n]]=[d.ing[n],d.ing[i]];
      const end=a==="ingup"?n===0:n===d.ing.length-1;
      edit.focus=".il li:nth-child("+(n+1)+') [data-ed="'+(end?(a==="ingup"?"ingdn":"ingup"):a)+'"]';
    }
  }
  else if(a==="servm")d.serv=Math.max(1,d.serv-1);
  else if(a==="servp")d.serv=Math.min(24,d.serv+1);
  else if(a==="adding"){edit.pickOpen=!edit.pickOpen;edit.newIng=null;if(edit.pickOpen)edit.focus="#pq";}
  else if(a==="pick"){
    const k=x.dataset.key,e=PR[k],c=catFind(k),ui=state.ing[k],cu=ui?(ui.u||{}):(c?c.u:{});
    let q="200",u="g";
    if(ui&&!e){if(cu.prk){q="1";u="prk";}else if(cu.kpl){q="1";u="kpl";}else if(cu.nippu){q="1";u="nippu";}else if(cu.pss){q="1";u="pss";}}
    else if(e&&e.per==="kpl"){q="1";u="kpl";}
    else if(e&&e.prk){q="1";u="prk";}
    else if(e&&e.pss){q="1";u="pss";}
    else if(e&&e.kpl){q="1";u="kpl";}
    else if(e&&e.per==="l"){q="1";u="dl";}
    else if(!e&&c&&(c.neg||c.pan)){q="1";u="tl";}
    else if(!e&&cu.kpl&&!cu.dl){q="1";u="kpl";}
    else if(!e&&cu.dl&&(c.d===13||c.d===14)&&!c.m){q="1";u="dl";}
    addIng(k,q,u);
  }
  else if(a==="bulk"){const k=x.dataset.k||null;edit.bulk=edit.bulk===k?null:k;if(edit.bulk)edit.focus="#bulk";}
  else if(a==="bulkadd"){
    const t=$("bulk")?$("bulk").value:"";
    const ls=t.split("\n").map(l=>l.replace(/^\s*(?:[-•*·]|\d+[.)])\s*/,"").trim()).filter(Boolean);
    if(edit.bulk==="ing"){
      for(const l of ls.slice(0,100-d.ing.length)){const hm=l.match(/^#+\s*(.+)$/)||l.match(/^([^0-9][^:]{0,38}):$/);if(hm){d.ing.push({name:"",h:hm[1].trim()});continue;}const p=parseIng(l);d.ing.push({name:clip(normIngName(p.rawName),100),qty:p.q==null?"":fmtQ(p.q),unit:p.q==null?"g":(p.u||"kpl")});}
    }else if(edit.bulk==="steps")for(const l of ls.slice(0,100-d.steps.length))d.steps.push(clip(l,600));
    edit.bulk=null;
  }
  else if(a==="mking"){const r0=d.ing[i];if(r0){let k=r0.name.trim().toLowerCase();k=SYN[k]||k;edit.pickOpen=true;edit.info="";edit.newIng={name:k,d:"",m:"",err:"",row:i,mode:"syn",q:""};edit.focus="#nsq";}}
  else if(a==="newing"){edit.newIng={name:x.dataset.name,d:"",m:"",err:"",mode:"new",q:""};edit.focus="#nid";}
  else if(a==="nmode"&&edit.newIng){edit.newIng.mode=x.dataset.m==="new"?"new":"syn";edit.newIng.err="";edit.focus=edit.newIng.mode==="new"?"#nid":"#nsq";}
  else if(a==="synpick"&&edit.newIng){
    const nf=edit.newIng,er=addSynTo(x.dataset.key,nf.name);
    if(er){nf.err=er;}
    else{edit.info="”"+nf.name+"” tunnistetaan nyt ainekseksi ”"+capF(x.dataset.key)+"”.";edit.newIng=null;edit.pickOpen=false;renderIdeas();refreshCart();}
  }
  else if(a==="newcancel"){edit.newIng=null;edit.focus="#pq";}
  else if(a==="newsave"){
    const nf=edit.newIng;
    if(nf.d===""){nf.err="Valitse tuoteryhmä.";edit.focus="#nid";}
    else{
      if(Object.keys(state.ing).length>=300&&!state.ing[nf.name]){nf.err="Omia aineksia voi olla enintään 300.";}
      else{state.ing[nf.name]={d:+nf.d,m:nf.m};edit.newIng=null;mutate();if(nf.row==null)addIng(nf.name,"","g");else edit.pickOpen=false;}
    }
  }
  else if(a==="rmstep")d.steps.splice(i,1);
  else if(a==="addstep"){d.steps.push("");edit.focus=".sl li:last-child textarea";}
  else if(a==="reset"){delete state.over[edit.id];setEdit(null);setPick(null);pruneChecked();mutate();renderIdeas();refreshCart();return renderDlg();}
  else if(a==="del"){
    if(!edit.delArm){edit.delArm=true;return renderDlg();}
    const id=edit.id,r=byId(id);
    if(r){if(r.custom)state.custom=state.custom.filter(c=>c.id!==id);else{state.hidden.push(id);delete state.over[id];}}
    purgeCart(id);state.fav=state.fav.filter(c=>c!==id);dropDraftImg();dropRecipeImg(id);delete state.views[id];
    if(pick&&pick.id===id)setPick(null);
    setEdit(null);pruneChecked();mutate();dlg.close();renderIdeas();refreshCart();return;
  }
  else if(a==="cancel"){dropDraftImg();const nw=edit.isNew;setEdit(null);if(nw)return;return renderDlg();}
  else if(a==="save")return saveEdit();
  if(a!=="del")edit.delArm=false;
  renderDlg();
  if(edit&&edit.focus){const f=(edit.isNew?$("newBody"):dlg).querySelector(edit.focus);edit.focus=null;if(f){f.focus();if(f.select&&f.tagName==="INPUT")f.select();if(f.scrollIntoView)f.scrollIntoView({block:"center"});}}
}
function edInput(e){
  if(!edit)return;
  const t=e.target,k=t.dataset&&t.dataset.edIn;if(!k)return;
  const d=edit.draft,i=+t.dataset.i;
  if(k==="name")d.name=t.value;
  else if(k==="min")d.min=t.value;
  else if(k==="w")d.w=t.value;
  else if(k==="hd"&&d.ing[i])d.ing[i].h=t.value;
  else if(k==="qty"&&d.ing[i])d.ing[i].qty=t.value;
  else if(k==="unit"&&d.ing[i])d.ing[i].unit=t.value;
  else if(k==="step")d.steps[i]=t.value;
  else if(k==="intro")d.intro=t.value;
  else if(k==="tips")d.tips=t.value;
  else if(k==="serve")d.serve=t.value;
  else if(k==="extras")d.extras=t.value;
  else if(k==="pq")$("pl").innerHTML=pickList(t.value);
  else if(k==="nsq"&&edit.newIng){edit.newIng.q=t.value;$("npl").innerHTML=synList(edit.newIng);}
  else if(k==="nid"&&edit.newIng)edit.newIng.d=t.value;
  else if(k==="nim"&&edit.newIng)edit.newIng.m=t.value;
}
$("dbody").addEventListener("input",edInput);

/* ---------- kopiointi ja kuvan valinta ---------- */
export function copyRecipe(id,info){
  const r=byId(id);if(!r)return;
  const nid="c"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  /* kopio tehdään siitä, mitä ruoan sivulla näkyy: valittu versio ja muunnelmat litistetään tavalliseksi reseptiksi */
  const sl=selR(r),ver=hasOpt(r)&&r.vs&&r.vs.length?selOf(r,state.tv[id]).ver:null;
  const nm=r.name+(ver?" – "+ver.n:"")+(r.custom?" (kopio)":" (oma)");
  const c={id:nid,name:clip(nm,120),m:mainOf(r),mo:r.mo||"",t:r.t,wd:r.wd||"",fe:r.fe||"",jf:!!r.jf,kq:[...(r.kq||[])],s:[],min:r.min,w:workOf(r),d:r.d||"",
    ing:[...sl.ing],gr:(sl.gr||[]).map(g=>[g[0],g[1]]),steps:[...sl.steps],url:r.url||"",custom:true,
    intro:introOf(r),serve:r.serve||"",tips:[...(r.tips||[])],sides:[...(r.sides||[])],extras:[...(r.extras||[])],src:(r.src||[]).map(x=>[x[0],x[1]])};
  state.custom.push(c);
  if(state.serv[id])state.serv[nid]=state.serv[id];else if(!r.custom)state.serv[nid]=servOf(r);
  if(state.img[id])state.img[nid]=state.img[id];
  setPick(null);mutate();renderIdeas();
  beginEdit(nid);
  if(info&&edit){edit.info=info;renderDlg();}
}
$("dbody").addEventListener("change",async e=>{
  if(e.target.id!=="eimg"||!edit)return;
  const f=e.target.files&&e.target.files[0];if(!f)return;
  const ed=edit;ed.busy=true;ed.err="";renderDlg();
  try{
    const id=await uploadImg(f);
    if(edit!==ed){releaseImg(id);return;}
    if(ed.draft.img&&ed.draft.img!==(state.img[ed.id]||""))releaseImg(ed.draft.img);
    ed.draft.img=id;
  }catch(x){ed.err=x.message==="type"?"Valitse kuvatiedosto (JPG, PNG tai WebP).":"Kuvan lataus ei onnistunut.";}
  ed.busy=false;if(edit===ed)renderDlg();
});
