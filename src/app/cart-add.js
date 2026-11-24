/* ainesikkuna: ruoan lisääminen ostoslistalle */
import {shopping,OT,listItems,qtyText,pruneChecked,newList,showListToast,hideToast,peekList} from "./cart.js";
import {$,ico,esc,defServ,parseIng} from "./core.js";
import {CAT,fold,pantryHit,nearP,pvOf,setPv} from "./catalog.js";
import {state,mutate} from "./state.js";
import {all,byId,sideNeeds,PSIDE,useSideVer,sideSug,learnP} from "./ideas.js";
import {DEPS} from "./price-updates.js";
import {refreshCart,addExtra} from "./cart-view.js";
import {capF} from "./registry.js";

/* ---------- ainesikkuna: lisäys ostoslistalle ---------- */
let aS=null;
const aTarget=()=>aS&&aS.lid!=="new"?state.lists.find(l=>l.id===aS.lid)||null:null;
function sideItems(sid,did){
  const d=byId(did),n=d?pvOf(d):nearP(defServ(sid)),had=Object.prototype.hasOwnProperty.call(state.pv,sid),old=state.pv[sid];
  state.pv[sid]=n;
  const it=shopping([sid]);
  if(had)state.pv[sid]=old;else delete state.pv[sid];
  return it;
}
function aGroups(){
  const r=byId(aS.rid),g=[{title:"",items:shopping([r.id])}];
  for(const sid of aS.sides){const sd=byId(sid);if(sd)g.push({title:"Lisuke: "+sd.name,items:sideItems(sid,r.id)});}
  return g;
}
function aSync(groups){
  const l=aTarget(),inl=new Set(l?listItems(l).filter(e=>!l.have.includes(e.key)).map(e=>e.key):[]);
  for(const g of groups)for(const e of g.items){
    if(aS.seen.has(e.key))continue;
    aS.seen.add(e.key);
    if((l&&l.have.includes(e.key))||(!inl.has(e.key)&&pantryHit(e.key)))aS.off.add(e.key);
  }
}
export function openAdd(id){
  const r=byId(id);if(!r)return;
  const p=peekList();
  aS={rid:id,lid:p?p.id:"new",off:new Set(),seen:new Set(),sides:[],ps:[],own:[],all:false,ownOpen:false,msg:""};
  hideToast();renderAdd();$("adlg").showModal();
}
/* oman lisukkeen ehdotukset: lisukereseptit, valmiit tuotteet ja raaka-aineet */
function ownSug(q0){
  const q=fold(String(q0||"").trim());if(q.length<2)return[];
  const sc=(name,syn)=>{let b=9;for(const n of [name,...(syn||[])]){const f=fold(n);if(f===q)return 0;if(f.startsWith(q))b=Math.min(b,1);else if(f.split(/[\s-]+/).some(w=>w.startsWith(q)))b=Math.min(b,2);else if(f.includes(q))b=Math.min(b,3);}return b;};
  const out=[];
  for(const r of all())if(r.t==="li"||r.t==="sa"){const v=sc(r.name);if(v<9)out.push({t:"r",id:r.id,name:r.name,kind:"Resepti",det:"ainekset listalle",v});}
  for(const o of OT.values()){const v=sc(o.k,o.syn);if(v<9)out.push({t:"p",id:o.k,name:capF(o.k),kind:"Valmis tuote",det:o.note||DEPS[o.d]||"",v});}
  const seen=new Set(out.filter(x=>x.t==="p").map(x=>x.id));
  for(const c of CAT){if(seen.has(c.key))continue;const v=sc(c.key,c.syn);if(v<9){out.push({t:"p",id:c.key,name:capF(c.key),kind:c.d===4||c.d===5||c.d===16?"Valmis tuote":"Raaka-aine",det:DEPS[c.d]||"",v});seen.add(c.key);}}
  for(const k of Object.keys(state.ing||{})){if(seen.has(k))continue;const v=sc(k);if(v<9)out.push({t:"p",id:k,name:capF(k),kind:"Oma aines",det:DEPS[state.ing[k].d]||"",v});}
  return out.sort((a,b)=>a.v-b.v||a.name.length-b.name.length).slice(0,8);
}
const ownSugHtml=q=>{const L=ownSug(q);return L.length?`<ul class="osug" role="listbox" aria-label="Ehdotukset">${L.map(x=>`<li><button type="button" class="osb" data-a="ownpick" data-t="${x.t}" data-id="${esc(x.id)}" role="option"><span class="osn">${esc(x.name)}<small>${esc(x.det)}</small></span><span class="osk osk-${x.t}${x.kind==="Raaka-aine"?" osk-raw":""}">${esc(x.kind)}</span></button></li>`).join("")}</ul>`:"";};
function renderAdd(focusSel){
  if(!aS)return;
  const r=byId(aS.rid);if(!r)return;
  const groups=aGroups();aSync(groups);
  const tl=aTarget(),lists=[...state.lists].reverse();
  const inl=new Set(tl?listItems(tl).filter(e=>!tl.have.includes(e.key)).map(e=>e.key):[]);
  const row=e=>{const off=aS.off.has(e.key),k=esc(e.key);
    return`<li><button type="button" class="ar${off?" off":""}" data-a="tg" data-k="${k}" aria-pressed="${!off}"><span class="ack">${ico("check")}</span><span class="an">${esc(e.name)}${off?"<small>on jo kaapissa</small>":(inl.has(e.key)?"<small>on jo ostoslistalla</small>":"")}</span><span class="aq">${esc(qtyText(e))}</span></button></li>`;};
  const sel=`<label class="adl"><span>Ostoslista</span><select id="alist" aria-label="Ostoslista">${lists.map(l=>`<option value="${esc(l.id)}"${aS.lid===l.id?" selected":""}>${esc(l.name)}</option>`).join("")}<option value="new"${aS.lid==="new"?" selected":""}>Uusi ostoslista</option></select></label>`;
  const body=groups.map(g=>(g.title?`<h4 class="ag">${esc(g.title)}</h4>`:`<h4 class="ag">Ainekset</h4>`)+(g.items.length?`<ul class="al">${g.items.map(row).join("")}</ul>`:`<p class="note">Ei aineksia.</p>`)).join("");
  let sides="";
  const sg=r.t==="li"?null:sideSug(r),nd=sideNeeds(r);
  if(sg&&!state.nos.includes(r.id)){
    const on=x=>x.t==="r"?aS.sides.includes(x.id):aS.ps.includes(x.id);
    /* lisukereseptit ja valmiit tuotteet omille riveilleen */
    const all0=[...sg.out.c,...sg.out.v,...sg.out.o];
    const recs=all0.filter(x=>x.t==="r").sort((a,b)=>b.sc-a.sc),prods=all0.filter(x=>x.t!=="r").sort((a,b)=>b.sc-a.sc);
    const pickN=(L,m)=>aS.all?L:L.filter((x,i)=>i<m||on(x));
    /* oman lisukkeen kautta valitut, joita ei ollut ehdotuksissa */
    for(const id of aS.sides)if(!recs.some(x=>x.id===id)){const x=byId(id);if(x)recs.push({t:"r",id,name:x.name,sc:0});}
    for(const id of aS.ps)if(!prods.some(x=>x.id===id))prods.push({t:"p",id,name:capF(id),sc:0});
    const shR=pickN(recs,3),shP=pickN(prods,3),total=recs.length+prods.length,shown=shR.length+shP.length;
    const chip=x=>{const p=on(x);return`<button type="button" class="chip${x.t==="r"?" sdr":""}" data-a="${x.t==="r"?"side":"pside"}" data-id="${esc(x.id)}"${x.ver?` data-ver="${esc(x.ver)}"`:""} aria-pressed="${p}">${ico(p?"check":(x.t==="r"?"chef":"plus"))}${esc(x.name)}</button>`;};
    const more=total>shown?`<button type="button" class="chip sdm" data-a="more">Muut (${total-shown})</button>`:(aS.all&&total>6?`<button type="button" class="chip sdm" data-a="more">Vähemmän</button>`:"");
    const ownChips=aS.own.map((v,i)=>`<button type="button" class="chip" data-a="ownrm" data-i="${i}" aria-pressed="true" aria-label="Poista: ${esc(v)}">${ico("check")}${esc(v)}</button>`).join("");
    sides=(shR.length?`<h4 class="ag">Lisukkeeksi</h4><p class="sdhint">Reseptin ainekset tulevat ostoslistalle</p><div class="chips sdrow">${shR.map(chip).join("")}</div>`:"")+
      `<h4 class="ag">Lisäksi kaupasta</h4><div class="chips sdrow">${shP.map(chip).join("")}${ownChips}${more}<button type="button" class="chip sdm" data-a="ownopen" aria-expanded="${aS.ownOpen}">${ico("plus")}Oma…</button></div>`+
      (aS.ownOpen?`<div class="xrow"><input id="aown" type="text" maxlength="60" placeholder="esim. raejuusto" autocomplete="off" aria-label="Oma lisuke" value="${esc(aS.oq||"")}"><button type="button" class="go" data-a="ownadd" style="min-height:44px;padding:0 18px;font-size:.9375rem">Lisää</button></div><div id="aownsug">${ownSugHtml(aS.oq||"")}</div>`:"")+
      (aS.msg?`<p class="note err" role="alert">${esc(aS.msg)}</p>`:"")+
      `<button type="button" class="lk2" data-a="nos">Älä ehdota lisukkeita tälle ruoalle</button>`;
  }else if(state.nos.includes(r.id)&&(nd.c||nd.v)){
    sides=`<button type="button" class="lk2" data-a="nos0">Näytä lisukeehdotukset</button>`;
  }
  const keys=new Set();groups.forEach(g=>g.items.forEach(e=>{if(!aS.off.has(e.key))keys.add(e.key);}));
  const cnt=keys.size+aS.ps.length+aS.own.length;
  $("abody").innerHTML=`<button type="button" class="dx" data-a="close" aria-label="Sulje">${ico("x")}</button><h2 class="dh">${esc(r.name)}</h2>${sel}${body}${sides}<div class="actions"><button type="button" class="go" data-a="ok" style="width:100%">Lisää ostoslistalle${cnt?" ("+cnt+")":""}</button></div>`;
  if(focusSel){const b=$("abody").querySelector(focusSel);if(b)b.focus({preventScroll:true});}
}
function commitAdd(){
  if(!aS)return;
  const r=byId(aS.rid);if(!r){aS=null;return;}
  let l=aTarget();if(!l)l=newList();
  state.act=l.id;
  if(!l.cart.includes(r.id))l.cart.push(r.id);
  for(const sid of aS.sides){
    const sd=byId(sid);if(!sd)continue;
    if(!l.cart.includes(sid)){
      l.cart.push(sid);
      setPv(sid,pvOf(r));
    }
    useSideVer(sid,(aS.sv||{})[sid]);
    const pm=state.pair[r.id]||(state.pair[r.id]={});pm[sid]=Math.min(999,(pm[sid]||0)+1);
    state.sk[sid]=Math.min(9999,(state.sk[sid]||0)+1);
  }
  for(const key of aS.ps){const ps=PSIDE.find(p=>p.k===key);if(!addExtra(l,key+(ps?" "+ps.q:"")))learnP(r.id,"p:"+key);}
  for(const v of aS.own){if(!addExtra(l,v))learnP(r.id,"p:"+parseIng(v).key.replace(/\s+/g," ").trim());}
  for(const k of aS.seen){
    if(aS.off.has(k)){if(!l.have.includes(k))l.have.push(k);l.checked=l.checked.filter(c=>c!==k);}
    else l.have=l.have.filter(x=>x!==k);
  }
  const rid=r.id;
  aS=null;$("adlg").close();
  pruneChecked();mutate();refreshCart();showListToast(l,rid);
}
$("adlg").addEventListener("click",e=>{
  if(e.target===$("adlg")){$("adlg").close();return;}
  const b=e.target.closest("[data-a]");if(!b||!aS)return;
  const a=b.dataset.a,id=b.dataset.id,k=b.dataset.k;
  if(a==="close"){$("adlg").close();return;}
  if(a==="ok"){commitAdd();return;}
  if(a==="tg"){if(aS.off.has(k))aS.off.delete(k);else aS.off.add(k);renderAdd(`[data-a=tg][data-k="${CSS.escape(k)}"]`);return;}
  if(a==="side"){const i=aS.sides.indexOf(id);if(i>=0)aS.sides.splice(i,1);else{aS.sides.push(id);if(b.dataset.ver)(aS.sv=aS.sv||{})[id]=b.dataset.ver;}renderAdd(`[data-a=side][data-id="${CSS.escape(id)}"]`);return;}
  if(a==="pside"){const i=aS.ps.indexOf(id);if(i>=0)aS.ps.splice(i,1);else aS.ps.push(id);renderAdd(`[data-a=pside][data-id="${CSS.escape(id)}"]`);return;}
  if(a==="more"){aS.all=!aS.all;renderAdd("[data-a=more]");return;}
  if(a==="ownopen"){aS.ownOpen=!aS.ownOpen;aS.msg="";renderAdd(aS.ownOpen?"#aown":"[data-a=ownopen]");return;}
  if(a==="ownrm"){aS.own.splice(+b.dataset.i,1);renderAdd("[data-a=ownopen]");return;}
  if(a==="ownpick"){
    const t2=b.dataset.t;
    if(t2==="r"){if(!aS.sides.includes(id))aS.sides.push(id);}else if(!aS.ps.includes(id))aS.ps.push(id);
    aS.ownOpen=false;aS.oq="";aS.msg="";renderAdd("[data-a=ownopen]");return;
  }
  if(a==="ownadd"){
    const inp=$("aown"),v=inp?inp.value.trim():"";
    /* sama nimi useana tyyppinä (esim. tuore punajuuri ja säilyke): pyydetään valitsemaan */
    if(v){const L=ownSug(v),ex=L.filter(x=>x.v===0),alt=ex.length?L.filter(x=>x.v<=3&&x.kind!==ex[0].kind):[];
      if(ex.length===1&&!alt.length){const x=ex[0];if(x.t==="r"){if(!aS.sides.includes(x.id))aS.sides.push(x.id);}else if(!aS.ps.includes(x.id))aS.ps.push(x.id);aS.ownOpen=false;aS.oq="";aS.msg="";renderAdd("[data-a=ownopen]");return;}
      if(ex.length>1||alt.length){aS.oq=v;aS.msg="Valitse alta, mitä tarkoitat.";renderAdd("#aown");return;}}
    if(!v){if(inp)inp.focus();return;}
    const kk=parseIng(v).key.replace(/\s+/g," ").trim();
    if(!kk||!/^[a-zäöå0-9][a-zäöå0-9 \-.,()%]{0,59}$/i.test(kk)){aS.msg="Kirjoita tuotteen nimi, enintään 60 merkkiä.";renderAdd("#aown");return;}
    if(aS.own.length>=5){aS.msg="Omia lisukkeita voi lisätä kerralla enintään 5.";renderAdd("#aown");return;}
    aS.own.push(v);aS.ownOpen=false;aS.msg="";renderAdd("[data-a=ownopen]");return;
  }
  if(a==="nos"){state.nos=state.nos.filter(i=>i!==aS.rid);state.nos.push(aS.rid);mutate();aS.sides=[];aS.ps=[];aS.own=[];renderAdd();return;}
  if(a==="nos0"){state.nos=state.nos.filter(i=>i!==aS.rid);mutate();renderAdd();return;}
});
$("adlg").addEventListener("change",e=>{
  if(e.target.id==="alist"&&aS){aS.lid=e.target.value;aS.off=new Set();aS.seen=new Set();renderAdd("#alist");}
});
$("adlg").addEventListener("input",e=>{
  if(e.target.id==="aown"&&aS){aS.oq=e.target.value;const box=$("aownsug");if(box)box.innerHTML=ownSugHtml(aS.oq);}
});
$("adlg").addEventListener("keydown",e=>{
  if(e.key==="Enter"&&e.target.id==="aown"){e.preventDefault();const b=$("abody").querySelector("[data-a=ownadd]");if(b)b.click();}
});
$("adlg").addEventListener("close",()=>{aS=null;});

/* mobiilinäppäimistö: lisäysikkuna nostetaan näppäimistön yläpuolelle ja kohdistettu kenttä vieritetään näkyviin */
if(window.visualViewport){
  const vv=window.visualViewport;
  const fitA=()=>{const d=$("adlg");if(!d||!d.open)return;
    const kb=Math.max(0,Math.round(window.innerHeight-vv.height-vv.offsetTop));
    d.style.marginBottom=kb>60?kb+"px":"";d.style.maxHeight=kb>60?Math.round(vv.height*.94)+"px":"";
    const a=document.activeElement;if(kb>60&&a&&d.contains(a)&&a.tagName==="INPUT"){const row=a.closest(".xrow")||a;row.scrollIntoView({block:"start"});}};
  vv.addEventListener("resize",fitA);
  $("adlg").addEventListener("close",()=>{const d=$("adlg");d.style.marginBottom="";d.style.maxHeight="";});
}
$("adlg").addEventListener("focusin",e=>{if(e.target.id==="aown")setTimeout(()=>{const row=e.target.closest(".xrow");if(row&&document.activeElement===e.target)row.scrollIntoView({block:"start",behavior:"smooth"});},350);});
