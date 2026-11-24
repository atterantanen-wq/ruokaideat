/* ruoan tietoikkuna, hintalinkit ja omat hinnat */
import {refreshCart} from "./cart-view.js";
import {$,ico,esc,safeUrl,host,parseIng,fmtNum,ingText} from "./core.js";
import {PALIAS} from "./prices.js";
import {gramsOf,nutData,mainOf,gp,todayIso,fmtD,isStale,findPrice,SKIP_EUR,eur,eur1,servOf,PCH,isBatch,pvOf,selR,ingOf,recipeCost,f0,f1,fs,ingOpen,stepOpen,nutOpen,setNutOpen,setIngOpen,setStepOpen,accHtml,nutHtml,setSel} from "./catalog.js";
import {state,mutate} from "./state.js";
import {byId,sideVer,sdOpen,sdFor,sdRowHtml,sdOnLink,sel,imgUrl,dropDraftImg,dhSize,favBtn,verMain} from "./ideas.js";
import {tagsHtml,cartBtn,hf,renderIdeas} from "./search.js";
import {packOf,fmtB} from "./cart.js";
import {curTab,viewsDirty,setViewsDirty} from "./tabs.js";
import {refreshReg} from "./registry.js";
import {NEWREC,ned,renderNewHost,renderEdit} from "./editor.js";
import {selOf} from "../recipes.js";

/* ---------- tietoikkuna ---------- */
/* ---------- hintalinkit ja oman hinnan lisäys ---------- */
export let pf=null;export const pmOpen=new Set();
export function setPf(v){return pf=v;}
export const PUNIT={kg:"kg",l:"l",kpl:"kpl"};
function guessPer(p){
  if(["kpl","prk","pss","nippu"].includes(p.fam))return"kpl";
  if(["ml","rkl","tl"].includes(p.fam))return"l";
  return"kg";
}
export const kvRow=(l,v,cls)=>`<div${cls?` class="${cls}"`:""}><dt>${l}</dt><dd>${v}</dd></div>`;
export const nutKv=n=>`<dl class="kv">${kvRow("Energia",f0(n.kcal)+" kcal")}${kvRow("Proteiini",f1(n.prot)+" g")}${kvRow("Rasva",f1(n.fat)+" g")}${kvRow("josta tyydyttynyttä",f1(n.sat)+" g","sub")}${kvRow("Hiilihydraatit",f1(n.carb)+" g")}${kvRow("Suola",fs(n.salt)+" g")}</dl>`;
export function packTxt(key){const pk=packOf(key);return pk?(pk[1]==="kpl"?fmtNum(pk[0])+" kpl":fmtB(pk[0],pk[1])):"";}
export function priceKv(key,e,x){
  const label=e.usr?"Oma hinta":"S-kaupat.fi",lk=e.u?`<a href="${esc(e.u)}" target="_blank" rel="noopener noreferrer">${label}</a>`:label;
  const pt=packTxt(key);
  return`<dl class="kv">${kvRow("Hinta",eur(e.p)+" / "+PUNIT[e.per])}${pt?kvRow("Pakkaus",esc(pt)):""}${x&&x.t==="ok"?kvRow("Tässä ruoassa",eur(x.c)):""}${kvRow(e.usr?"Lisätty":"Tarkistettu",fmtD(e.d))+kvRow("Lähde",lk)}</dl>`+
    (e.w?`<p class="idn">Heikko arvio.</p>`:"")+(isStale(e.d)?`<p class="idn stale">${ico("alert")}Yli 6 kk vanha, tarkista.</p>`:"")+(x&&x.t==="conv"?`<p class="idn stale">Yksikkö ei sovi määrään.</p>`:"");
}
function ingDet(p,x,k){
  const e=findPrice(p.key),per=guessPer(p),nd=nutData(p.key),g=gramsOf(p.key,p.fam,p.v);
  const btn=t=>`<button type="button" class="lk" data-pf="open" data-key="${esc(k)}" data-per="${per}" data-name="${esc(p.name)}">${t}</button>`;
  let h=`<div class="idet"><section class="ib"><h4>Hinta</h4>`;
  h+=e?priceKv(p.key,e,x):`<p class="idn">Hintaa ei ole tallennettu.</p>`;
  if(x&&x.t==="skip")h+=`<p class="idn">Pieni määrä, joten sitä ei lasketa ruoan hintaan.</p>`;
  h+=`<p class="ibb">${btn(e?"Muuta hintaa":"Lisää hinta")}</p></section>`;
  h+=`<section class="ib"><h4>Ravintoarvot / 100 g</h4>`;
  const lnk=`<button type="button" class="lk" data-reg-open="${esc(p.key)}">Avaa rekisterissä</button>`;
  if(!nd)h+=`<p class="idn">Ainesta ei ole rekisterissä.</p>`;
  else if(!nd.n)h+=`<p class="idn">${nd.neg?"Ainesta ei lasketa ravintoarvoihin, koska sitä käytetään vain vähän.":"Ei arvoja."}</p>`;
  else{
    const n=nd.n,src=nd.own?"Oma arvo":(nd.c&&nd.c.ov?"Muokattu arvo":(nd.c&&nd.c.fid?`<a href="https://fineli.fi/fineli/fi/elintarvikkeet/${esc(nd.c.fid)}" target="_blank" rel="noopener noreferrer">Fineli: ${esc(nd.c.fname)}</a>`:"Arvio"));
    h+=nutKv(n)+`<p class="idn">${g==null?"Määrää ei voi muuttaa grammoiksi tällä yksiköllä.":`${esc(ingText(p))} on noin ${f0(g)} g: ${f0(n.kcal*g/100)} kcal, proteiinia ${f1(n.prot*g/100)} g.`} Lähde: ${src}</p>`;
  }
  return h+`<p class="ibb">${lnk}</p></section></div>`;
}
export function priceFormHtml(){
  const o=u=>`<option value="${u}"${pf.per===u?" selected":""}>€ / ${u}</option>`;
  return`<div class="pf"><p class="pft">Hinta: ${esc(pf.name)}</p><div class="pfr"><input id="pfp" type="text" inputmode="decimal" placeholder="hinta" value="${esc(pf.p)}" aria-label="Hinta euroina"><select id="pfu" aria-label="Hinnan yksikkö">${o("kg")}${o("l")}${o("kpl")}</select></div><input id="pfl" type="url" placeholder="Linkki hintaan (valinnainen)" value="${esc(pf.url)}" aria-label="Linkki hintaan"><p class="note err" id="pfe" role="alert"></p><div class="pfa"><button type="button" class="go" data-pf="save">Tallenna</button><button type="button" class="cartbtn" data-pf="cancel"><span>Peruuta</span></button>${gp(pf.key)?`<button type="button" class="clear" data-pf="clear">Poista oma hinta</button>`:""}</div></div>`;
}
function afterPrice(){mutate();renderDlg();renderIdeas();refreshCart();refreshReg();}
export function pfAct(x){pfAct0(x);refreshReg();}
function pfAct0(x){
  const a=x.dataset.pf;
  if(a==="open"){
    const k=x.dataset.key,cur=findPrice(k);
    pf={rid:openId,reg:!!x.dataset.reg,key:k,name:x.dataset.name,per:cur?cur.per:x.dataset.per,p:cur?String(cur.p).replace(".",","):"",url:cur&&cur.usr?(cur.u||""):""};
    renderDlg();
    const f=$("pfp");if(f){f.focus();f.select();}
  }else if(a==="cancel"){pf=null;renderDlg();}
  else if(a==="clear"){delete state.prices[pf.key];pf=null;afterPrice();}
  else if(a==="save"){
    const p=parseFloat($("pfp").value.replace(",",".")),raw=$("pfl").value.trim(),per=$("pfu").value;
    const err=t=>{$("pfe").textContent=t;};
    if(!(p>0&&p<10000))return err("Kirjoita hinta numerona, esimerkiksi 3,50.");
    const url=raw?safeUrl(raw):"";
    if(raw&&!url)return err("Linkki ei kelpaa. Käytä osoitetta, joka alkaa https://");
    state.prices[pf.key]={p:Math.round(p*100)/100,per:["kg","l","kpl"].includes(per)?per:"kg",url,date:todayIso()};
    pf=null;afterPrice();
  }
}
export const dlg=$("dlg");export let openId=null,delAsk=false,edit=null,dlgList="";
export function setOpenId(v){return openId=v;}
export function setEdit(v){return edit=v;}
const SRCN={"yhteishyva.fi":"Yhteishyvä","kotikokki.fi":"Kotikokki","k-ruoka.fi":"K-Ruoka","valio.fi":"Valio","soppa365.fi":"Soppa365","reseptit.fi":"Reseptit.fi","hellapoliisi.fi":"Hellapoliisi","kauppalehti.fi":"Kauppalehti","kotikokki.net":"Kotikokki","martat.fi":"Martat","kinuskikissa.fi":"Kinuskikissa"};
function srcHtml(r,url){
  const h=url?host(url):"";
  const nm=h?(SRCN[h]||h):"";
  let t;
  if(r.custom)t=url?`<b>Oma lisäys</b> · ohje: <a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(nm)}</a>`:`<b>Oma lisäys</b>`;
  else if(url)t=`<b>${esc(nm)}</b> · <a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(h)}</a>`;
  else t=r.perus?`<b>Perusateria</b> · ei reseptiä`:r.t==="li"?`<b>Perusohje</b> · ei ulkoista lähdettä`:`<b>Sovelluksen oma resepti</b> · ei ulkoista lähdettä`;
  if(!r.custom&&state.over[r.id])t+=` · muokattu`;
  return`<p class="srcl"><span>Lähde</span><i>${t}</i></p>`;
}
/* ---------- kirjaston lisäosat ruoan sivulla ---------- */
export const introOf=r=>r.custom?(r.intro||""):(r.d||"");
const introHtml=r=>introOf(r)?`<p class="intro">${esc(introOf(r))}</p>`:"";
function verHtml(r){
  if(!r.vs||r.vs.length<2)return"";
  const cur=selOf(r,state.tv[r.id]).ver;
  return`<div class="vrow" role="group" aria-label="Versio"><span class="vlb">Versio</span><div class="chips">${r.vs.map(v=>`<button type="button" class="chip" data-ver="${esc(v.id)}" aria-pressed="${cur===v}">${esc(v.n)}</button>`).join("")}</div></div>`;
}
function serveHtml(r){
  const sides=(r.sides||[]).map(s0=>{const[id,v]=String(s0).split(":"),x=byId(id);if(!x)return null;const vo=sideVer(x,v);return{id,name:x.name+(vo?" ("+vo.n.toLowerCase()+")":""),ver:vo&&v?vo.id:""};}).filter(Boolean);
  if(!r.serve&&!sides.length)return"";
  return`<div class="serve">${r.serve?`<p>${esc(r.serve)}</p>`:""}${sides.length?`<div class="chips">${sides.map(x=>`<button type="button" class="chip sch" data-oside="${esc(x.id)}"${x.ver?` data-over="${esc(x.ver)}"`:""}>${esc(x.name)}${ico("chev")}</button>`).join("")}</div>`:""}</div>`;
}
function tipsHtml(r){
  const tw=r.tw||[],tips=r.tips||[];
  if(!tw.length&&!tips.length)return"";
  const on=new Set((state.tv[r.id]||{}).t||[]);
  return`<section class="tips"><h3>${ico("chef")}${tw.length?"Vinkit ja muunnelmat":"Vinkit"}</h3>${tw.map(t=>`<button type="button" class="twb" data-tw="${esc(t.id)}" aria-pressed="${on.has(t.id)}"><span class="twc">${ico(on.has(t.id)?"check":"plus")}</span><span><b>${esc(t.n)}</b>${t.d?`<small>${esc(t.d)}</small>`:""}</span></button>`).join("")}${tips.map(x=>`<p class="tip">${esc(x)}</p>`).join("")}</section>`;
}
const libSrcHtml=r=>`<p class="srcl"><span>Pohjana</span><i>${r.src.map(([n,u])=>{const su=safeUrl(u);return su?`<a href="${esc(su)}" target="_blank" rel="noopener noreferrer">${esc(n)}</a>`:esc(n);}).join(" · ")}${!r.custom&&state.over[r.id]?" · muokattu":""}</i></p>`;
export function renderDlg(){
  if(edit&&edit.isNew){$("newBody").innerHTML=renderEdit(NEWREC());return;}
  const r=byId(openId);
  if(!r){if(dlg.open)dlg.close();return;}
  if(edit&&edit.id===openId){$("dbody").innerHTML=renderEdit(r);return;}
  const ing=ingOf(r).map(parseIng);
  const url=safeUrl(r.url);
  const sl=selR(r),rc=recipeCost(r),pv=pvOf(r),grp=sl.gr||[];
  let gi=0;
  const ingHtml=ing.map((p,i)=>{
    const x=rc.lines[i];
    const k=PALIAS[p.key]||p.key;
    const open=pmOpen.has(k);
    const pb=(txt,cls)=>`<button type="button" class="ip pbtn${cls||""}" data-pm="${esc(k)}" aria-expanded="${open}" aria-label="Hinta ja ravintoarvot: ${esc(p.name)}">${txt}${ico("chev")}</button>`;
    const pr=x&&x.t==="ok"?pb(eur(x.c)+(x.s?`<span class="stale">${ico("alert")}</span>`:"")):x&&x.t==="skip"?pb("ei lasketa"," mu"):x?pb("hinta puuttuu"," mu"):"";
    const form=pf&&pf.rid===r.id&&pf.key===k?priceFormHtml():"";
    const meta=open&&p.v!=null?ingDet(p,x,k):"";
    let hd="";while(gi<grp.length&&grp[gi][0]<=i){if(grp[gi][0]===i)hd+=`<li class="gh"><b>${esc(grp[gi][1])}</b></li>`;gi++;}
    return hd+`<li><div class="ir1"><span>${esc(ingText(p))}</span>${pr}</div>${form||meta}</li>`;
  }).join("");
  const priceBox=rc.big?`<p class="note sumn">Hintaa ei voi arvioida: ainekselle ${esc(rc.miss.join(", "))} ei ole hintaa.</p>`:rc.n?`<p class="sumc"><span>Ainekset yhteensä</span><b>${rc.miss.length?"väh. ":"noin "}${eur1(rc.sum)}</b></p>${rc.lines.some(x=>x&&x.t==="skip")?`<p class="note sn">Pienet (alle ${eur(SKIP_EUR)}) ainekset eivät ole mukana hinnassa.</p>`:""}${rc.stale?`<p class="stale sn">${ico("alert")}Osa hinnoista on yli 6 kuukautta vanhoja.</p>`:""}`:"";
  $("dbody").innerHTML=
    `<button type="button" class="dx" data-close aria-label="Sulje">${ico("x")}${ico("left")}</button><div class="dh2"><h2 class="dh" style="font-size:${dhSize(r.name)}rem">${esc(r.name)}</h2>${favBtn(r)}</div>${imgUrl(r)?`<img class="hero" alt="" src="${esc(imgUrl(r))}">`:""}${tagsHtml(r,"top")}${introHtml(r)}${verHtml(r)}`+
    (isBatch(r)?`<div class="prow" role="group" aria-label="Erän koko"><span class="pic" title="Erä">${ico("users")}</span><div class="pseg">${[[.5,"½ erä"],[1,"1 erä"],[2,"2 erää"]].map(([k,t])=>{const n=Math.max(1,Math.round(servOf(r)*k));return`<button type="button" class="pc pcw" data-pv="${n}" aria-pressed="${n===pv}" aria-label="${t}, ${n} kpl">${t}</button>`;}).join("")}</div></div><p class="note" style="margin:4px 2px 0">${pv} ${esc(r.yu||"kpl")}</p>`:`<div class="prow" role="group" aria-label="Annosmäärä"><span class="pic" title="Annokset">${ico("users")}</span><div class="pseg">${PCH.map(n=>`<button type="button" class="pc" data-pv="${n}" aria-pressed="${n===pv}" aria-label="${n} annosta">${n}</button>`).join("")}</div></div>`)+
    (ing.length?accHtml("ing","basket","Ainekset",ingOpen,`<ul class="il2">${ingHtml}</ul>${priceBox}`,`<small class="accn">${ing.length}</small>`):"")+
    (sl.steps.length?accHtml("steps","chef","Valmistus",stepOpen,`<ol>${sl.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol>${serveHtml(r)}<p class="cookrow"><button type="button" class="go" data-cook="${esc(r.id)}">${ico("play")}<span>Aloita kokkaus</span></button></p>`):"")+
    tipsHtml(r)+nutHtml(r)+(url?`<p style="margin:14px 0 0"><a class="go" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Avaa resepti: ${esc(host(url))}</a></p>`:"")+
    (url&&!ing.length?`<p class="note">Aineksia ei ole tallennettu, joten tämä ruoka ei lisää tuotteita ostoslistalle.</p>`:"")+
    (!url&&!ing.length&&!sl.steps.length?`<p class="note">Tähän ruokaan ei ole tallennettu aineksia eikä ohjetta.</p>`:"")+
    tagsHtml(r,"tags")+(r.src&&r.src.length?libSrcHtml(r):srcHtml(r,url))+
    sdOnLink(r)+`<p class="cpy"><button type="button" class="clear" data-copy="${esc(r.id)}">Tee oma kopio</button></p><div class="actions"><div class="sdslot" id="sdslot">${sdFor===r.id?sdRowHtml(r):""}</div>${(()=>{const fl=dlgList&&state.lists.find(q=>q.id===dlgList);return fl&&(fl.cart.includes(r.id)||(fl.pl||[]).some(e=>e.id===r.id))?`<button type="button" class="cartbtn rmfl" data-rmfl="${esc(r.id)}" data-lid="${esc(fl.id)}">${ico("x")}<span>Poista listalta: ${esc(fl.name)}</span></button>`:cartBtn(r);})()}<button type="button" class="cartbtn" data-edit="${esc(r.id)}">${ico("pencil")}<span>Muokkaa</span></button></div>`;
}
export function openDlg(id,fl){
  /* pääraaka-ainesuodatin päällä: avataan versio, joka vastaa suodatinta */
  {const r=byId(id),want=$("hkdlg").open?hf.m:sel.m;
   if(r&&r.vs&&r.vs.length>1&&want&&want.size&&!want.has(mainOf(r))){const v=r.vs.find(v=>want.has(verMain(r,v)));if(v)setSel(id,n=>{n.v=v.id;});}}
  if(!edit&&byId(id)){state.views[id]=Math.min(99999,(state.views[id]||0)+1);mutate();}
  openId=id;dlgList=fl||"";delAsk=false;pf=null;setNutOpen(false);setIngOpen(true);setStepOpen(false);pmOpen.clear();sdOpen.clear();renderDlg();
  if(!openId)return;
  if(!dlg.open)dlg.showModal();
  dlg.scrollTop=0;
}
dlg.addEventListener("close",()=>{if(curTab==="add"&&!ned)setTimeout(renderNewHost,0);if(state.sort==="views")setViewsDirty(true);dropDraftImg();openId=null;dlgList="";delAsk=false;edit=null;pf=null;pmOpen.clear();});
dlg.addEventListener("click",e=>{if(e.target===dlg&&!edit)dlg.close();});
