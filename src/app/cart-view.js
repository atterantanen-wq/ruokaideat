/* ostoslistanäkymä: listojen yleiskuva, lista, muut ostokset ja jakaminen */
import "./cart-add.js";
import {$,ico,cartInner,esc,parseIng,fmtNum} from "./core.js";
import {CAT,catFind,fold,fzScore,findPrice,isSkip,eur} from "./catalog.js";
import {actList,state,applyTheme,mutate} from "./state.js";
import {byId,inCart} from "./ideas.js";
import {applyLay,renderIdeas} from "./search.js";
import {DEPS} from "./price-updates.js";
import {typeOf,storeName,XSUG,XD,OTS,otOf,listItems,needed,groupDeps,packInfo,perText,xQty,itemCost,pillText,rowSub,qtyMain,flashToast,undoToast,hideToast,lg,sNew,renderStoreDlg,viewId,renaming,setViewId,vList} from "./cart.js";
import {curTab} from "./tabs.js";
import {uiEdit} from "./editor.js";
import {LOGO} from "../data/logos.js";

function leftCount(l){let n=0;for(const e of listItems(l))if(!l.have.includes(e.key)&&!l.checked.includes(e.key))n++;return n;}
export function updBadge(){const b=$("badge");if(!b)return;const l=actList(state),n=l?leftCount(l):0;const t=n?String(n):"";if(b.textContent!==t)b.textContent=t;}
export function refreshCart(){
  updBadge();
  document.querySelectorAll("[data-cart]").forEach(b=>{
    const on=inCart(b.dataset.cart);
    b.setAttribute("aria-pressed",on);
    if(b.classList.contains("ic")){b.innerHTML=ico(on?"check":"tlist");b.setAttribute("aria-label",(on?"Poista ostoslistalta":"Lisää ostoslistalle")+": "+((byId(b.dataset.cart)||{}).name||""));}
    else b.innerHTML=cartInner(on);
  });
  if(!$("v-cart").hidden)renderCart();
}
export function listStats(l){
  const items=listItems(l),act=items.filter(e=>!l.have.includes(e.key));
  const ic=act.map(e=>itemCost(e,l));
  return{items,act,left:act.filter(e=>!l.checked.includes(e.key)).length,tot:ic.reduce((a,x)=>a+(x.sum||0),0),miss:ic.filter(x=>x.miss).length};
}
function listStatus(l){
  const st=listStats(l);
  if(!st.act.length)return"";
  const done=st.act.length-st.left;
  if(!done)return st.act.length+" "+(st.act.length===1?"tuote":"tuotetta");
  if(!st.left)return"Kaikki ostettu ✓";
  return done+" / "+st.act.length+" ostettu";
}
function renderOverview(){
  const ls=[...state.lists].reverse();
  const cards=ls.map(l=>{
    const names=l.cart.map(id=>(byId(id)||{}).name).filter(Boolean),stt=listStatus(l);
    return`<div class="lcw"><button type="button" class="lcard" data-lst="open" data-lid="${esc(l.id)}"><span class="lt"><b>${esc(l.name)}</b></span>${l.store?`<span class="lst">${lg(typeOf(l.store))}<span>${esc(storeName(l.store))}</span></span>`:""}${names.length?`<span class="lr">${esc(names.join(", "))}</span>`:`<span class="lr">Tyhjä lista</span>`}${stt?`<span class="lm">${esc(stt)}</span>`:""}</button><button type="button" class="dots" data-lst="menu" data-lid="${esc(l.id)}" aria-haspopup="dialog" aria-label="Valikko: ${esc(l.name)}">${ico("dots")}</button></div>`;
  }).join("");
  $("abx").innerHTML=curTab==="cart"?`<button type="button" class="cartbtn" data-lst="create">${ico("plus")}<span>Uusi lista</span></button>`:"";
  $("cartBody").innerHTML=(cards||`<p class="note">Listoja ei ole vielä. Paina ruoan kohdalla Lisää ostoslistalle, niin lista syntyy automaattisesti.</p><div class="actions"><button class="go" type="button" data-tab-go="ideas">Selaa ruokaideoita</button></div>`);
}
let xQ="",xHist=[];
const capK=k=>k.charAt(0).toUpperCase()+k.slice(1);
function xChips(l){
  const inL=new Set((l.x||[]).map(i=>i.k)),q=fold(xQ.trim());
  const chip=k=>{const on=inL.has(k);return`<button type="button" class="chip" data-x="add" data-k="${esc(k)}" aria-pressed="${on}">${ico(on?"check":"plus")}${esc(capK(k))}</button>`;};
  const sec=(t,a)=>a.length?`<p class="gt">${esc(t)}</p><div class="chips">${a.map(chip).join("")}</div>`:"";
  let out="";
  if(q){
    const names=[...new Set([...Object.keys(state.xh),...XSUG.map(s=>s[0]),...OTS.keys(),...Object.keys(XD),...Object.keys(state.ing),...CAT.map(e=>e.key),...inL])];
    const sc=names.map(k=>[k,fzScore(q,fold(k))]).filter(x=>x[1]>=0).sort((a,b)=>a[1]-b[1]||a[0].localeCompare(b[0],"fi"));
    out=sec("Osumat",sc.filter(x=>x[1]<3).slice(0,16).map(x=>x[0]))+sec("Tarkoititko",sc.filter(x=>x[1]>=3).slice(0,6).map(x=>x[0]));
  }else{
    const hist=xHist,hs=new Set(hist);
    out=sec("Usein ostetut",hist);
    DEPS.forEach((n,d)=>{out+=sec(n,XSUG.filter(x=>x[1]===d).map(x=>x[0]));});
    const known=new Set(XSUG.map(x=>x[0]));
    out+=sec("Muut listalla",[...inL].filter(k=>!hs.has(k)&&!known.has(k)));
  }
  return out||`<p class="note">Ei ehdotuksia. Lisää kirjoittamasi tuote painikkeella Lisää.</p>`;
}
const xDone=l=>"Valmis"+((l.x||[]).length?" · "+l.x.length+" "+(l.x.length===1?"tuote":"tuotetta")+" lisätty":"");
function xDlgHtml(l){
  return`<button type="button" class="dx" data-xclose aria-label="Sulje">${ico("x")}</button><h2 class="dh">Lisää tuotteita</h2><div class="xrow"><input id="xq" type="search" value="${esc(xQ)}" placeholder="Hae tai lisää tuote" autocomplete="off" aria-label="Lisättävä tuote"><button type="button" class="go" data-x="addtxt">Lisää</button></div><p class="note" id="xmsg" role="status"></p><div id="xchips">${xChips(l)}</div><div class="actions"><button type="button" class="go" id="xdone" data-xclose>${esc(xDone(l))}</button></div>`;
}
function xBar(){
  return`<div class="xbar"><button type="button" class="go" data-x="dlg">${ico("plus")}<span>Lisää tuotteita</span></button></div>`;
}
function fitX(){
  const d=$("xdlg");if(!d.open)return;
  const v=window.visualViewport,h=v?v.height:innerHeight;
  const off=v?Math.max(0,Math.round(innerHeight-v.height-v.offsetTop)):0;
  d.style.setProperty("--xh",Math.round(h*(off>80?.97:.88))+"px");
  d.style.transform=off>0?`translateY(${-off}px)`:"";
}
if(window.visualViewport){visualViewport.addEventListener("resize",fitX);visualViewport.addEventListener("scroll",fitX);}
function openX(){
  const l=vList();if(!l)return;
  xQ="";xHist=Object.entries(state.xh).sort((a,b)=>b[1]-a[1]).map(e=>e[0]).slice(0,10);$("xbody").innerHTML=xDlgHtml(l);hideToast();$("xdlg").showModal();$("xdlg").scrollTop=0;fitX();
}
$("xdlg").addEventListener("focusin",e=>{if(e.target.id==="xq"){$("xdlg").scrollTop=0;setTimeout(fitX,250);}});
function xRefresh(l,fk){
  $("xchips").innerHTML=xChips(l);$("xdone").textContent=xDone(l);
  if(fk){const b=[...$("xchips").querySelectorAll("[data-k]")].find(x=>x.dataset.k===fk);if(b)b.focus({preventScroll:true});}
}
export function rmExtra(l,k){if(l.adj)delete l.adj[k];l.x=(l.x||[]).filter(i=>i.k!==k);l.checked=l.checked.filter(x=>x!==k);}
export function addExtra(l,text){
  const p=parseIng(text);
  let k=p.key.replace(/\s+/g," ").trim();
  if(!k||!/^[a-zäöå0-9][a-zäöå0-9 \-.,()%]{0,59}$/i.test(k))return"Kirjoita tuotteen nimi, enintään 60 merkkiä.";
  const ot=otOf(k);if(ot)k=ot.k;
  if(!l.x)l.x=[];
  if((l.x||[]).length>=100)return"Listalla voi olla enintään 100 muuta tuotetta.";
  const q=p.q!=null?fmtNum(p.q)+" "+(p.u||"kpl"):"";
  const ex=l.x.find(i=>i.k===k);
  if(ex){if(q)ex.q=q;}else l.x.push({k,q});
  l.have=l.have.filter(x=>x!==k);
  state.xh[k]=Math.min(9999,(state.xh[k]||0)+1);
  const hk=Object.keys(state.xh);
  if(hk.length>200){hk.sort((a,b)=>state.xh[a]-state.xh[b]);delete state.xh[hk[0]];}
  return"";
}
let expList="",kapOpen=false,raOpen=null,qOpen="",ddOpen=new Set();
const modeOf=l=>l.md||(l.checked.length?"k":"t");
export function renderCart(){
  const l=vList();
  if(!l){setViewId(null);document.body.classList.remove("inlist");return renderOverview();}
  if(expList!==l.id){kapOpen=false;raOpen=null;qOpen="";ddOpen=new Set();expList=l.id;}
  document.body.classList.add("inlist");
  const body=$("cartBody");
  const rn=renaming?`<div class="rnm"><input id="lname" type="text" maxlength="40" value="${esc(l.name)}" aria-label="Listan nimi"><button type="button" class="go" data-lst="rensave">Tallenna</button></div>`:"";
  const head=`<div class="lbar"><button type="button" class="back" data-lst="back" aria-label="Takaisin ostoslistoihin">${ico("chev")}</button><div class="lbt"><h2 class="lbn">${esc(l.name)}</h2></div><button type="button" class="dots wah" data-act="copy" aria-label="Kopioi lista WhatsAppiin">${ico("copy")}</button><button type="button" class="dots" data-lst="menu" data-lid="${esc(l.id)}" aria-haspopup="dialog" aria-label="Listan valikko">${ico("dots")}</button></div>`+rn;
  const stb0=()=>{const stx=listStats(l),n=stx.act.length,pr=stx.tot>0?(stx.miss?"väh. ":"")+eur(stx.tot):"";return`<button type="button" class="scard" data-st="open" aria-haspopup="dialog" aria-label="Kauppa: ${esc(storeName(l.store))}. Vaihda kauppa"><span class="sl2">${lg(typeOf(l.store))}<b>${LOGO[typeOf(l.store)]?"":"Kauppa: "}${esc(storeName(l.store)).replace(/-/g,"\u2011")}</b></span>${n?`<span class="sr2">${pr?`<b>${pr}</b>`:""}<span>${n} ${n===1?"tuote":"tuotetta"}</span></span>`:""}</button>`;};
  const waBtn=`<button type="button" class="wa" data-act="copy">${ico("copy")}<span>Kopioi lista WhatsAppiin</span></button>`;
  if(!l.cart.length&&!(l.x||[]).length&&!(l.pl||[]).length){
    body.innerHTML=head+`<p class="note">Lista on tyhjä. Paina ruoan kohdalla Lisää ostoslistalle, niin ainekset kerääntyvät tähän. Voit valita useita ruokia, jolloin samat tuotteet lasketaan yhteen.</p>`+`<div class="actions"><button class="go" type="button" data-tab-go="ideas">Selaa ruokaideoita</button></div>`+xBar();
    return;
  }
  const st=listStats(l),chosen=l.cart.map(byId).filter(Boolean);
  const noIng=chosen.filter(r=>!r.ing.length);
  const li=e=>{
    const h=l.have.includes(e.key),c=l.checked.includes(e.key),k=esc(e.key),nmx=esc(e.name);
    if(h)return`<li class="hvd"><div class="hvl2"><span class="nm">${nmx}</span><b class="q">${esc(qtyMain(e,l))}</b></div><button type="button" class="hv" data-have="${k}" aria-label="Palauta ostettavaksi: ${nmx}">Palauta</button></li>`;
    const pi=packInfo(e,l),pt=perText(e),xo=e.extra&&!(e.per&&e.per.size);
    const ic=rowSub(e,l);
    const unk=!state.ing[e.key]&&!otOf(e.key)&&!catFind(e.key)&&!findPrice(e.key)&&!isSkip(e.key)&&!Object.prototype.hasOwnProperty.call(XD,e.key);
    const ra=unk&&raOpen&&raOpen.k===e.key?`<div class="epanel nf ra"><div class="f"><label for="rad">Osasto: ${nmx}</label><select id="rad"><option value="">Valitse…</option>${DEPS.map((n,i)=>`<option value="${i}"${String(raOpen.d)===String(i)?" selected":""}>${esc(n)}</option>`).join("")}</select></div>${raOpen.err?`<p class="note err" role="alert">${esc(raOpen.err)}</p>`:""}<div class="nfa"><button type="button" class="go" data-ra="save" data-k="${k}">Tallenna rekisteriin</button><button type="button" class="clear" data-ra="cancel" data-k="${k}">Peruuta</button></div></div>`:"";
    const raB=unk&&!ra?`<button type="button" class="lk sm" data-ra="open" data-k="${k}">Lisää rekisteriin</button>`:"";
    const qt=esc(pillText(e,l)||(xo?"1 kpl":""));
    let pill;
    if(qOpen===e.key){
      if(pi||xo)pill=`<span class="qs" role="group" aria-label="Määrä: ${nmx}"><button type="button" data-q="dec" data-k="${k}" aria-label="${(pi?pi.n:(xQty(e.xq).n))>1?"Vähennä":"Poista listalta"}: ${nmx}">−</button><span class="qv">${qt}</span><button type="button" data-q="inc" data-k="${k}" aria-label="Lisää: ${nmx}">+</button></span>`;
      else pill=`<span class="qs" role="group"><button type="button" class="qrm" data-q="rm" data-k="${k}" aria-label="Poista listalta: ${nmx}">Poista listalta</button></span>`;
    }else pill=`<button type="button" class="qp" data-q="open" data-k="${k}" aria-label="Muuta määrää: ${nmx}, ${qt}">${qt}</button>`;
    return`<li class="k2${c?" d":""}"><div class="k2r"><button type="button" class="k2m" data-pick="${k}" aria-pressed="${c}"><span class="k2n">${nmx}</span>${ic||raB?`<small>${ic}</small>`:""}${pt&&state.rv?`<small class="rcp">${esc(pt)}</small>`:""}</button><div class="k2q">${pill}</div></div>${raB&&!ra?`<div class="k2x">${raB}</div>`:""}${ra}</li>`;
  };
  const kap=st.items.filter(e=>l.have.includes(e.key));
  const none=st.act.length?"":(st.items.length?`<p class="note" style="margin-top:14px">Kaikki tuotteet on merkitty kaapissa oleviksi.</p>`:`<p class="note" style="margin-top:14px">Valituissa ruoissa ei ole aineksia.</p>`);
  const ordItems=g=>[...g.items.filter(e=>!l.checked.includes(e.key)),...g.items.filter(e=>l.checked.includes(e.key))];
  let grp=none;
  if(st.act.length){
    const gs=groupDeps(st.act,[],l.store).map(g=>({g,dn:g.items.filter(e=>l.checked.includes(e.key)).length}));
    const open=gs.filter(x=>x.dn<x.g.items.length),done=gs.filter(x=>x.dn===x.g.items.length);
    grp=open.map(({g,dn})=>`<h3 class="dpb"><span>${esc(g.name)}</span><span class="dc">${dn?dn+" / ":""}${g.items.length}</span></h3><ul class="shop k2l">${ordItems(g).map(li).join("")}</ul>`).join("")+
      done.map(({g})=>{const o=ddOpen.has(g.name);return`<button type="button" class="dpb dn dd" data-dd="${esc(g.name)}" aria-expanded="${o}"><span>${esc(g.name)}</span><span class="dc">${g.items.length} / ${g.items.length}${ico("chev")}</span></button>${o?`<ul class="shop k2l">${g.items.map(li).join("")}</ul>`:""}`;}).join("");
  }
  body.innerHTML=head+stb0()+
    (chosen.length?`<button type="button" class="recb" data-rv aria-expanded="${!!state.rv}">Ruoat (${chosen.length})${ico("chev")}</button>`:"")+
    (chosen.length&&state.rv?`<div class="chips" style="margin-top:6px;gap:8px">${chosen.map(r=>`<button type="button" class="sc rb" data-open="${esc(r.id)}" data-fl="${esc(l.id)}">${esc(r.name)}</button>`).join("")}</div>`:"")+
    (noIng.length?`<p class="note" style="margin-top:10px">Ei aineksia listalla: ${noIng.map(r=>esc(r.name)).join(", ")}. Avaa ruoka nähdäksesi linkin.</p>`:"")+
    grp+
    (kap.length?`<button type="button" class="kap" data-kap aria-expanded="${kapOpen}">Kaapissa (${kap.length})${ico("chev")}</button>${kapOpen?`<ul class="shop">${kap.map(li).join("")}</ul>`:""}`:"")+
    waBtn+
    (st.act.length?(()=>{const xN=st.act.filter(e=>e.extra&&!(e.per&&e.per.size)).length,t=(st.miss?st.miss+" ainekselta puuttuu hinta. ":"")+(xN?"Lisätuotteita "+xN+" kpl, niiden hintaa ei ole mukana. ":"")+(st.tot>0?"Hinta lasketaan kokonaisista pakkauksista. S-kaupat.fi 18.–19.11.2026.":"");return t?`<p class="tot"><span class="note">${t}</span></p>`:"";})():"")+
    xBar();
}
function shareText(l){
  const items=needed(l).filter(e=>!l.checked.includes(e.key));
  if(!items.length)return"";
  const sh=e=>qtyMain(e,l).replace(/^1 × /,"");
  const nm=e=>e.name.replace(/^Wc-/,"WC-");
  const rec=l.cart.map(id=>(byId(id)||{}).name).filter(Boolean);
  let out="*🛒 "+l.name+"* ("+items.length+" "+(items.length===1?"tuote":"tuotetta")+")\n";
  if(rec.length)out+="_"+rec.join(", ")+"_\n";
  for(const g of groupDeps(items,[],l.store))out+="\n*"+g.name+"*\n"+g.items.map(e=>("• "+nm(e)+" "+sh(e)).trim()).join("\n")+"\n";
  return out.trim();
}
export async function copyList(){
  const l=vList();if(!l)return;
  const txt=shareText(l);
  if(!txt){flashToast("Ei ostettavia tuotteita.");return;}
  let ok=false;
  try{await navigator.clipboard.writeText(txt);ok=true;}catch(e){}
  if(!ok){
    try{
      const t=document.createElement("textarea");t.value=txt;t.setAttribute("readonly","");t.style.cssText="position:fixed;left:-9999px;top:0;opacity:0";
      document.body.appendChild(t);t.select();ok=document.execCommand("copy");t.remove();
    }catch(e){}
  }
  flashToast(ok?"Ostoslista kopioitu. Liitä se WhatsAppiin.":"Kopiointi ei onnistunut tässä näkymässä.");
}
$("profBtn").addEventListener("click",()=>{uiEdit();$("pdlg").showModal();});
$("pdlg").addEventListener("click",e=>{if(e.target===$("pdlg")||e.target.closest("[data-pclose],[data-reg-open]"))$("pdlg").close();});
$("thm").addEventListener("click",e=>{
  let b=e.target.closest("[data-th]");
  if(b){state.th=b.dataset.th;mutate();applyTheme();return;}
  b=e.target.closest("[data-lay]");
  if(b&&state.lay!==b.dataset.lay){state.lay=b.dataset.lay;mutate();applyLay();renderIdeas();}
});
$("cartBody").addEventListener("change",e=>{if(raOpen&&e.target.id==="rad")raOpen.d=e.target.value;});
$("cartBody").addEventListener("click",e=>{
  const sb=e.target.closest("[data-st=open]");
  if(sb){sNew({});renderStoreDlg();$("sdlg").showModal();return;}
    const rb=e.target.closest("[data-ra]");
  if(rb){
    const a=rb.dataset.ra,k=rb.dataset.k,sel=$("rad");
    if(a==="open")raOpen={k,d:"",err:""};
    else if(a==="cancel")raOpen=null;
    else if(a==="save"&&raOpen){
      const v=sel?sel.value:"";raOpen.d=v;
      if(v==="")raOpen.err="Valitse osasto.";
      else if(Object.keys(state.ing).length>=300&&!state.ing[raOpen.k])raOpen.err="Omia aineksia voi olla enintään 300.";
      else{state.ing[raOpen.k]={d:+v,m:""};raOpen=null;mutate();}
    }
    renderCart();
    const f=raOpen?$("rad"):[...$("cartBody").querySelectorAll("[data-ra=open]")].find(x=>x.dataset.k===k);
    if(f){f.focus({preventScroll:true});if(raOpen)f.closest(".ra").scrollIntoView({block:"center",behavior:"smooth"});}
    return;
  }
  const pk=e.target.closest("[data-pick]");
  if(pk){
    const l0=vList();if(!l0)return;
    const k=pk.dataset.pick,i=l0.checked.indexOf(k);
    if(i>=0)l0.checked.splice(i,1);else l0.checked.push(k);
    mutate();
    if(qOpen){qOpen="";renderCart();return;}
    {const y=window.scrollY;renderCart();window.scrollTo(0,y);}
    return;
  }
  const qb=e.target.closest("[data-q]");
  if(qb){
    const l0=vList();if(!l0)return;
    const a=qb.dataset.q,k=qb.dataset.k;
    if(a==="open"){qOpen=qOpen===k?"":k;renderCart();const f=$("cartBody").querySelector(`[data-q=inc][data-k="${CSS.escape(k)}"]`);if(f)f.focus({preventScroll:true});return;}
    const e0=listItems(l0).find(x=>x.key===k);if(!e0)return;
    const pi=packInfo(e0,l0),xo=e0.extra&&!(e0.per&&e0.per.size);
    const rmIt=()=>{
      if(xo){const it=(l0.x||[]).find(i=>i.k===k);const q=it?it.q:"";rmExtra(l0,k);undoToast(`Poistettu listalta: <b>${esc(e0.name)}</b>`,`data-lst="undox" data-from="${esc(l0.id)}" data-k="${esc(k)}" data-q="${esc(q)}"`);}
      else{if(!l0.have.includes(k))l0.have.push(k);l0.checked=l0.checked.filter(c=>c!==k);undoToast(`<b>${esc(e0.name)}</b> siirretty kohtaan Kaapissa`,`data-lst="undohave" data-from="${esc(l0.id)}" data-k="${esc(k)}"`);}
      qOpen="";
    };
    if(a==="rm")rmIt();
    else if(a==="inc"){
      if(pi){if(!l0.adj)l0.adj={};const n=Math.min(99,(l0.adj[k]||0)+1);if(n)l0.adj[k]=n;else delete l0.adj[k];}
      else if(xo){const it=(l0.x||[]).find(i=>i.k===k);if(it){const m=/^(\d+(?:[.,]\d+)?)\s*(.*)$/.exec(it.q||"");const n0=m?parseFloat(m[1].replace(",",".")):1,u=m?m[2]:"";it.q=fmtNum(Math.min(999,n0+1))+(u?" "+u:(it.q?"":" kpl"));}}
    }else if(a==="dec"){
      if(pi){
        if(pi.n<=1)rmIt();
        else{if(!l0.adj)l0.adj={};const n=Math.max(-98,(l0.adj[k]||0)-1);if(n)l0.adj[k]=n;else delete l0.adj[k];}
      }else if(xo){
        const it=(l0.x||[]).find(i=>i.k===k),n0=it?xQty(it.q).n:1;
        if(!it||n0<=1)rmIt();
        else{const m=/^(\d+(?:[.,]\d+)?)\s*(.*)$/.exec(it.q||"");const u=m?m[2]:"";it.q=fmtNum(n0-1)+(u?" "+u:" kpl");}
      }
    }
    mutate();renderCart();
    const nb=$("cartBody").querySelector(`[data-q=dec][data-k="${CSS.escape(k)}"]`);if(nb)nb.focus({preventScroll:true});
    return;
  }
  if(e.target.closest("[data-kap]")){kapOpen=!kapOpen;renderCart();return;}
  const ddb=e.target.closest("[data-dd]");
  if(ddb){const n=ddb.dataset.dd;if(ddOpen.has(n))ddOpen.delete(n);else ddOpen.add(n);renderCart();return;}
  if(e.target.closest("[data-rv]")){state.rv=!state.rv;mutate();renderCart();return;}
  const ab=e.target.closest("[data-adj],[data-xadj]"),l0=vList();
  if(ab&&l0){
    const k=ab.dataset.k;
    if(ab.dataset.adj){if(!l0.adj)l0.adj={};const n=Math.max(0,Math.min(99,(l0.adj[k]||0)+(+ab.dataset.adj)));if(n)l0.adj[k]=n;else delete l0.adj[k];}
    else{const it=(l0.x||[]).find(i=>i.k===k);if(it){const m=/^(\d+(?:[.,]\d+)?)\s*(.*)$/.exec(it.q||"");const n0=m?parseFloat(m[1].replace(",",".")):1,u=m?m[2]:"";const n=Math.max(1,Math.min(999,n0+(+ab.dataset.xadj)));it.q=fmtNum(n)+(u?" "+u:(it.q?"":" kpl"));}}
    mutate();renderCart();
    const nb=[...$("cartBody").querySelectorAll("[data-adj],[data-xadj]")].find(x=>x.dataset.k===k&&(x.dataset.adj||x.dataset.xadj)==="1");if(nb)nb.focus();
    return;
  }
  const b=e.target.closest("[data-x]"),l=vList();if(!b||!l)return;
  const a=b.dataset.x;
  if(a==="dlg"){openX();return;}
  if(a==="rm"){rmExtra(l,b.dataset.k);mutate();renderCart();}
});
$("xdlg").addEventListener("click",e=>{
  if(e.target===$("xdlg")||e.target.closest("[data-xclose]")){$("xdlg").close();return;}
  const b=e.target.closest("[data-x]"),l=vList();if(!b||!l)return;
  const a=b.dataset.x;
  if(a==="add"){
    const k=b.dataset.k;
    if((l.x||[]).some(i=>i.k===k))rmExtra(l,k);
    else{const err=addExtra(l,k);if(err){$("xmsg").textContent=err;return;}}
    $("xmsg").textContent="";mutate();xRefresh(l,k);return;
  }
  if(a==="addtxt"){
    const v=$("xq").value.trim();if(!v){$("xq").focus();return;}
    const err=addExtra(l,v);
    if(err){$("xmsg").textContent=err;return;}
    xQ="";$("xq").value="";$("xmsg").textContent="Lisätty: "+v;mutate();xRefresh(l);$("xq").focus();
  }
});
$("xdlg").addEventListener("input",e=>{
  if(e.target.id!=="xq")return;
  xQ=e.target.value;const l=vList();if(l)$("xchips").innerHTML=xChips(l);
});
$("xdlg").addEventListener("keydown",e=>{
  if(e.target.id==="xq"&&e.key==="Enter"){e.preventDefault();const b=$("xdlg").querySelector("[data-x=addtxt]");if(b)b.click();}
});
$("xdlg").addEventListener("close",()=>{xQ="";$("xdlg").style.transform="";$("xdlg").style.removeProperty("--xh");if(!$("v-cart").hidden)renderCart();});
$("cartBody").addEventListener("change",e=>{
  if(e.target.matches("[data-sp]")){state.sp=e.target.checked;mutate();return;}
  const c=e.target.closest("[data-chk]"),l=vList();if(!c||!l)return;
  const k=c.dataset.chk,i=l.checked.indexOf(k);
  if(c.checked&&i<0)l.checked.push(k);
  if(!c.checked&&i>=0)l.checked.splice(i,1);
  c.closest("li").classList.toggle("d",c.checked);
  mutate();
});
