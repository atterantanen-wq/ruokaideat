/* ainesosarekisterin näkymä */
import {curTab,showTab} from "./tabs.js";
import {M,$,ico,esc,safeUrl,host,USYN,parseIng} from "./core.js";
import {PR,PALIAS} from "./prices.js";
import {CAT,CIDX,CBYK,rebuildCat,catFind,fold,fzBest,fmtD,baseKey,findPrice,pantryHit,isSkip,eur,f0,f1} from "./catalog.js";
import {state,setBar,mutate} from "./state.js";
import {all} from "./ideas.js";
import {renderIdeas} from "./search.js";
import {DEPS} from "./price-updates.js";
import {OT,otOf,applyOtx,otP,otPack,otUnit,deptOf,packOf} from "./cart.js";
import {refreshCart} from "./cart-view.js";
import {pf,setPf,PUNIT,kvRow,nutKv,packTxt,priceKv,priceFormHtml,dlg} from "./info.js";
import {fmtQ} from "./editor.js";

/* ---------- ainesosarekisteri ---------- */
export const regS={q:"",d:"",m:"",own:false,nop:false,open:null,form:null,back:"add",del:false,g:"i"};
export const capF=s=>s.charAt(0).toUpperCase()+s.slice(1);
const num1=v=>{const x=parseFloat(String(v).replace(",","."));return isFinite(x)?x:null;};
function otRows(){const ck=new Set(CAT.map(c=>c.key));return[...OT.values()].filter(o=>!ck.has(o.k)).map(o=>({key:o.k,d:o.d,m:"",n:null,u:{},syn:o.syn,own:false,cat:false,ot:o}));}
function regRows(){
  if(regS.g==="o")return otRows();
  const rows=[],seen=new Set();
  for(const e of CAT){seen.add(e.key);rows.push({key:e.key,d:e.d,m:e.m.replace("?",""),n:e.n,neg:e.neg,fid:e.fid,fname:e.fname,u:e.u,syn:e.syn,url:e.url,own:false,ov:e.ov,cat:true});}
  for(const k of Object.keys(PR))if(!seen.has(k)&&!catFind(k)&&!state.ing[k])rows.push({key:k,d:deptOf(k),m:"",n:null,neg:false,u:{},syn:[],own:false,cat:false});
  for(const[k,v]of Object.entries(state.ing))rows.push({key:k,d:v.d,m:v.m||"",n:v.n||null,neg:false,u:v.u||{},url:v.url||"",syn:v.syn||[],own:true,ov:!!PR[k],cat:false});
  return rows;
}
function regFilter(rows){
  const q=fold(regS.q.trim());
  for(const r of rows)r.s=q?fzBest(q,[r.key,...r.syn]):0;
  return rows.filter(r=>
    r.s>=0&&
    (regS.d===""||String(r.d)===regS.d)&&
    (regS.m===""||r.m===regS.m)&&
    (!regS.own||r.own||r.ov)&&
    (!regS.nop||(r.ot?!!r.ot.w:(!findPrice(r.key)&&!isSkip(r.key)&&!r.neg)))
  ).sort((a,b)=>(q?(a.s>=3)-(b.s>=3):0)||a.key.localeCompare(b.key,"fi"));
}
function regUnits(row){
  const bk=baseKey(PALIAS[row.key]||row.key),e=bk?PR[bk]:null,u=row.u||{},o=[],ou=row.own||row.ov;
  const dl=(ou&&u.dl)||(e&&e.dl)||u.dl;
  if(dl){o.push("1 dl = "+f0(dl)+" g","1 rkl = "+f1(dl*0.15)+" g","1 tl = "+f1(dl*0.05)+" g");}
  else{if(u.rkl)o.push("1 rkl = "+f1(u.rkl)+" g");if(u.tl)o.push("1 tl = "+f1(u.tl)+" g");}
  const k=(ou&&u.kpl)||(e&&e.kpl)||u.kpl;if(k)o.push("1 kpl = "+f0(k)+" g");
  const pk=(ou&&u.prk)||(e&&e.prk)||u.prk;if(pk)o.push("1 prk = "+f0(pk)+(e&&e.per==="l"?" ml":" g"));
  if(u.pss)o.push("1 pss = "+f0(u.pss)+" g");
  const nb=(e&&e.nippu)||u.nippu;if(nb)o.push("1 nippu = "+f0(nb)+" g");
  return o;
}
function regPriceHtml(row){
  const e=findPrice(row.key);
  const per=e?e.per:(row.u&&row.u.kpl&&!row.u.dl?"kpl":"kg");
  const btn=t=>`<button type="button" class="lk" data-pf="open" data-reg="1" data-key="${esc(row.key)}" data-per="${per}" data-name="${esc(capF(row.key))}">${t}</button>`;
  if(pf&&pf.reg&&pf.key===row.key)return priceFormHtml();
  const pt=packTxt(row.key);
  if(!e)return`<p class="idn" style="margin-top:0">${(pantryHit(row.key)||row.neg)?"Hintaa ei ole tallennettu. Pienet määrät jäävät automaattisesti laskematta.":"Hinta puuttuu."}</p>${pt?`<dl class="kv">${kvRow("Pakkaus",esc(pt))}</dl>`:""}<p class="ibb">${btn("Lisää hinta")}</p>`;
  return priceKv(row.key,e,null)+`<p class="ibb">${btn("Muuta hintaa")}</p>`;
}
function parseNutText(t){
  t=String(t).replace(/\u00a0/g," ").toLowerCase();
  const g=re=>{const m=t.match(re);return m?m[1].replace(",","."):null;};
  const o={};
  let kc=g(/(\d+(?:[.,]\d+)?)\s*kcal/);
  if(kc==null){const kj=g(/(\d+(?:[.,]\d+)?)\s*kj/);if(kj!=null)kc=String(Math.round(parseFloat(kj)/4.184));}
  o.kcal=kc;
  o.prot=g(/proteiini\w*[^\d]{0,15}(\d+(?:[.,]\d+)?)/);
  o.sat=g(/tyydyttyn\w*[^\d]{0,20}(\d+(?:[.,]\d+)?)/);
  o.fat=g(/rasva\w*[^\d]{0,15}(\d+(?:[.,]\d+)?)/);
  o.carb=g(/hiilihydraat\w*[^\d]{0,15}(\d+(?:[.,]\d+)?)/);
  o.salt=g(/suola\w*[^\d]{0,15}(\d+(?:[.,]\d+)?)/);
  return o;
}
function regFormHtml(){
  const f=regS.form,fixed=f.kind==="ix"||f.kind==="pr";
  const fld=(id,lab,val,ph)=>`<label class="rf2"><span>${lab}</span><input type="text" inputmode="decimal" data-reg-in="${id}" value="${esc(val)}" placeholder="${ph||""}" autocomplete="off"></label>`;
  const nameHtml=fixed?`<p class="rfn">${esc(capF(f.orig))}</p>`:`<label class="rf2 w"><span>Nimi</span><input type="text" data-reg-in="name" value="${esc(f.name)}" maxlength="60" autocomplete="off"></label>${f.orig?`<p class="note nd" style="margin:-4px 0 10px">Nimen muutos päivittyy myös omiin reseptehisi ja ostoslistoihin.</p>`:""}`;
  const reset=f.kind==="own"?`<button type="button" class="clear err" data-reg="del">${regS.del?"Varmista poisto":"Poista aines"}</button>`:(f.has?`<button type="button" class="clear err" data-reg="del">${regS.del?"Varmista palautus":"Palauta alkuperäinen"}</button>`:"");
  return`<div class="rform"><p class="pft">${!f.orig?"Lisää oma aines":fixed?"Muokkaa ainesta":"Muokkaa omaa ainesta"}</p>
${nameHtml}
<div class="rrow"><label class="rf2"><span>Tuoteryhmä</span><select data-reg-in="d"><option value="">Valitse…</option>${DEPS.map((n,i)=>`<option value="${i}"${String(f.d)===String(i)?" selected":""}>${esc(n)}</option>`).join("")}</select></label>
<label class="rf2"><span>Pääraaka-aine</span><select data-reg-in="m"><option value="">Ei mitään</option>${Object.entries(M).filter(([c])=>c!=="v").map(([c,l])=>`<option value="${c}"${f.m===c?" selected":""}>${esc(l)}</option>`).join("")}</select></label></div>
<label class="rf2 w" style="margin-top:10px"><span>Synonyymit</span><input type="text" data-reg-in="syn" value="${esc(f.syn||"")}" placeholder="esim. hapankerma, smetana" autocomplete="off"></label>
<p class="note nd" style="margin:-4px 0 10px">Erota pilkulla. Aines tunnistetaan näillä nimillä resepteissä ja haussa.</p>
<label class="rf2 w"><span>Liitä ravintotaulukko tuotesivulta (valinnainen)</span><textarea rows="4" data-reg-in="paste" placeholder="Energia 139 kJ / 33 kcal&#10;Rasva 0,2 g&#10;josta tyydyttynyttä 0,1 g&#10;Hiilihydraatti 5,4 g&#10;Proteiini 0,9 g&#10;Suola 0,02 g">${esc(f.paste||"")}</textarea></label>
<div class="nfa" style="margin:0 0 8px"><button type="button" class="cartbtn" data-reg="parse"><span>Täytä kentät tekstistä</span></button>${f.info?`<span class="note" role="status">${esc(f.info)}</span>`:""}</div>
<p class="gt">Ravintoarvot sadasta grammasta (valinnainen)</p>
<div class="rgrid">${fld("kcal","Energia, kcal",f.kcal)}${fld("prot","Proteiini, g",f.prot)}${fld("fat","Rasva, g",f.fat)}${fld("sat","Tyydyttynyt, g",f.sat)}${fld("carb","Hiilihydr., g",f.carb)}${fld("salt","Suola, g",f.salt)}</div>
<p class="gt">Painot, pakkaus ja lähde (valinnainen)</p>
<div class="rgrid">${fld("dl","1 dl, g",f.dl)}${fld("kpl","1 kpl, g",f.kpl)}${fld("prk","1 prk, g",f.prk)}${fld("pss","1 pss, g",f.pss)}${fld("nippu","1 nippu, g",f.nippu)}</div>
<div class="rrow" style="margin-top:8px"><label class="rf2"><span>Pakkauskoko</span><input type="text" inputmode="decimal" data-reg-in="pkq" value="${esc(f.pkq||"")}" placeholder="esim. 150" autocomplete="off"></label>
<label class="rf2"><span>Yksikkö</span><select data-reg-in="pku">${["g","ml","kpl"].map(x=>`<option value="${x}"${(f.pku||"g")===x?" selected":""}>${x}</option>`).join("")}</select></label></div>
<p class="note nd" style="margin-top:4px">Ostoslista laskee tarvittavat pakkaukset ja hinnan tämän koon mukaan.</p>
<label class="rf2 w" style="margin-top:8px"><span>Linkki tuotesivulle</span><input type="url" data-reg-in="url" value="${esc(f.url||"")}" placeholder="https://" autocomplete="off"></label>
${f.err?`<p class="note err" role="alert">${esc(f.err)}</p>`:""}
<div class="nfa"><button type="button" class="go" data-reg="save">Tallenna</button><button type="button" class="cartbtn" data-reg="cancel"><span>Peruuta</span></button>${reset}</div></div>`;
}
function otFormHtml(o){
  const f=regS.otf;
  return`<div class="rform"><p class="pft">Muokkaa tuotetta: <b>${esc(capF(o.k))}</b></p>
<label class="rf2 w"><span>Osasto</span><select data-ot-in="d"><option value="">Valitse…</option>${DEPS.map((n,i)=>`<option value="${i}"${String(f.d)===String(i)?" selected":""}>${esc(n)}</option>`).join("")}</select></label>
<div class="rrow"><label class="rf2"><span>Pakkauksen hinta, €</span><input type="text" inputmode="decimal" data-ot-in="p" value="${esc(f.p)}" placeholder="esim. 2,50" autocomplete="off"></label>
<label class="rf2"><span>Pakkauskoko</span><input type="text" inputmode="decimal" data-ot-in="q" value="${esc(f.q)}" autocomplete="off"></label>
<label class="rf2"><span>Yksikkö</span><select data-ot-in="u">${["g","ml","kpl"].map(x=>`<option value="${x}"${f.u===x?" selected":""}>${x}</option>`).join("")}</select></label></div>
<p class="note nd">Muutos koskee vain sinua. Alkuperäiset tiedot voi palauttaa.</p>
${f.err?`<p class="note err" role="alert">${esc(f.err)}</p>`:""}
<div class="nfa"><button type="button" class="go" data-reg="otsave" data-key="${esc(o.k)}">Tallenna</button><button type="button" class="cartbtn" data-reg="otcancel"><span>Peruuta</span></button></div></div>`;
}
function otDetail(o){
  if(regS.otf&&regS.otf.k===o.k)return otFormHtml(o);
  const u=otUnit(o),pu=o.u==="kpl"?"kpl":(o.u==="ml"?"l":"kg");
  let h='<div class="rd"><p class="gt">Hinta</p>';
  h+=`<p class="rp">${otP(o)==null?"Hinta puuttuu":eur(otP(o))+" / "+esc(otPack(o))}${u!=null?" · "+eur(u)+" / "+pu:""}${o.w?" · heikko arvio":""}</p>`;
  h+=`<p class="note nd">${esc(o.note)}. Lähde: <a href="https://www.s-kaupat.fi/tuotteet/${esc(o.path)}" target="_blank" rel="noopener noreferrer">S-kaupat.fi</a>, tarkistettu ${fmtD(o.dt)}.${o.w?" "+esc(o.w):""}</p>`;
  h+=`<p class="gt">Osasto</p><p class="ru">${esc(DEPS[o.d]||"")}</p>`;
  if(o.syn.length)h+=`<p class="note nd">Tunnistetaan myös: ${esc(o.syn.join(", "))}.</p>`;
  if(o.ov)h+=`<p class="note nd">Olet muokannut tätä tuotetta.</p>`;
  h+=`<div class="nfa"><button type="button" class="cartbtn" data-reg="otedit" data-key="${esc(o.k)}">${ico("pencil")}<span>Muokkaa</span></button>${o.ov?`<button type="button" class="clear" data-reg="otreset" data-key="${esc(o.k)}">Palauta alkuperäinen</button>`:""}</div>`;
  return h+"</div>";
}
function regDetail(row){
  if(row.ot)return otDetail(row.ot);
  if(regS.form&&regS.form.orig===row.key)return regFormHtml();
  const n=row.n;
  let h='<div class="rd idet">';
  h+=`<section class="ib"><h4>Hinta</h4>${regPriceHtml(row)}</section>`;
  h+=`<section class="ib"><h4>Ravintoarvot / 100 g</h4>`;
  if(n){
    h+=nutKv(n);
    h+=`<p class="idn">${row.own?(row.url?`Oma arvo. Lähde: <a href="${esc(row.url)}" target="_blank" rel="noopener noreferrer">${esc(host(row.url)||"tuotesivu")}</a>.`:"Oma arvo."):row.ov?"Muokattu arvo.":(row.fid?`Lähde: <a href="https://fineli.fi/fineli/fi/elintarvikkeet/${esc(row.fid)}" target="_blank" rel="noopener noreferrer">Fineli: ${esc(row.fname)}</a>, THL, CC BY 4.0.`:"Käsin lisätty arvio.")}</p>`;
  }else h+=`<p class="idn" style="margin-top:0">${row.neg?"Ravintoarvoja ei lasketa, koska ainesta käytetään vain vähän.":"Ravintoarvoja ei ole."}</p>`;
  h+=`</section>`;
  const u=regUnits(row);
  if(u.length)h+=`<section class="ib"><h4>Yksiköt</h4><p class="ru">${u.map(esc).join(" · ")}</p></section>`;
  if(row.syn.length)h+=`<section class="ib"><h4>Tunnistetaan myös</h4><p class="ru">${row.syn.map(esc).join(", ")}</p></section>`;
  const used=all().filter(r=>r.ing.some(l=>{const k=parseIng(l).key;if(row.cat){const c=catFind(k);return c&&c.key===row.key;}return k===row.key;}));
  if(used.length)h+=`<section class="ib"><h4>Käytössä ruuissa</h4><p class="ru">${used.slice(0,8).map(r=>`<button type="button" class="lk" data-open="${esc(r.id)}">${esc(r.name)}</button>`).join("")}${used.length>8?` ja ${used.length-8} muuta`:""}</p></section>`;
  h+=`<div class="nfa"><button type="button" class="cartbtn" data-reg="edit" data-key="${esc(row.key)}">${ico("pencil")}<span>Muokkaa</span></button>${row.ov?`<button type="button" class="clear" data-reg="reset" data-key="${esc(row.key)}">Palauta alkuperäinen</button>`:""}</div>`;
  return h+"</div>";
}
function regListHtml(){
  const rows=regFilter(regRows());
  $("rcount").textContent=regS.g==="o"?(rows.length===1?"1 tuote":rows.length+" tuotetta"):(rows.length===1?"1 ainesosa":rows.length+" ainesosaa");
  return rows.map(r=>{
    const open=regS.open===r.key,pe=r.ot?null:findPrice(r.key);
    if(r.ot)return`<li class="rr"><button type="button" class="rh" data-reg="t" data-key="${esc(r.key)}" aria-expanded="${open}"><span class="rn"><b>${esc(capF(r.key))}</b><small>${esc(DEPS[r.d]||"")}</small></span><span class="rv"><span>${otP(r.ot)==null?"ei hintaa":eur(otP(r.ot))+" / "+esc(otPack(r.ot))}</span><span>${r.ot.w?"heikko arvio":"&nbsp;"}</span></span>${ico("chev")}</button>${open?regDetail(r):""}</li>`;
    return`<li class="rr"><button type="button" class="rh" data-reg="t" data-key="${esc(r.key)}" aria-expanded="${open}"><span class="rn"><b>${esc(capF(r.key))}</b><small>${esc(DEPS[r.d]||"")}${r.own&&!r.ov?" · oma":r.ov?" · muokattu":""}${r.m&&M[r.m]?" · "+esc(M[r.m]):""}</small></span><span class="rv"><span${pe?"":' class="np"'}>${pe?eur(pe.p)+" / "+PUNIT[pe.per]:"ei hintaa"}</span><span>${r.n?f0(r.n.kcal)+" kcal":"ei ravintoarvoja"}</span></span>${ico("chev")}</button>${open?regDetail(r):""}</li>`;
  }).join("")||`<li class="note" style="padding:12px 4px">Ei osumia. Poista suodattimia tai lisää oma aines.</li>`;
}
function renderRegList(){$("rlist").innerHTML=regListHtml();}
function renderRegForm(){const b=$("rform");if(b)b.innerHTML=regS.form&&!regS.form.orig?regFormHtml():"";}
export function renderReg(){
  setBar("reg",regS.g==="o"?"Muut tuotteet":"Ainesosarekisteri");
  $("regBody").innerHTML=`<button type="button" class="lk back" data-reg="back">← Takaisin</button>
<div class="seg" role="group" aria-label="Lista"><button type="button" data-reg="g" data-g="i" aria-pressed="${regS.g!=="o"}">Ainesosat</button><button type="button" data-reg="g" data-g="o" aria-pressed="${regS.g==="o"}">Muut tuotteet</button></div>
<p class="note">${regS.g==="o"?"Kodin tuotteet, valmisruoat ja juomat, joita lisätään ostoslistalle painikkeella Lisää tuotteita. Hinnat ovat pakkauskohtaisia, ja ne lasketaan listan summaan.":"Aineksille on tallennettu tuoteryhmä, ravintoarvot, yksikkömuunnokset ja hinta. Ravintoarvot: Fineli, THL, CC BY 4.0."}</p>
<input id="rq" type="search" placeholder="${regS.g==="o"?"Hae tuotetta":"Hae ainesta"}" value="${esc(regS.q)}" autocomplete="off" aria-label="Hae">
<div class="rsel"><select id="rd" aria-label="Tuoteryhmä"><option value="">Kaikki tuoteryhmät</option>${DEPS.map((n,i)=>`<option value="${i}"${regS.d===String(i)?" selected":""}>${esc(n)}</option>`).join("")}</select>
${regS.g==="o"?"":`<select id="rm" aria-label="Pääraaka-aine"><option value="">Kaikki pääraaka-aineet</option>${Object.entries(M).filter(([c])=>c!=="v").map(([c,l])=>`<option value="${c}"${regS.m===c?" selected":""}>${esc(l)}</option>`).join("")}</select>`}</div>
<div class="chips" style="margin-top:10px">${regS.g==="o"?"":`<button type="button" class="chip" data-reg="own" aria-pressed="${regS.own}">Omat</button>`}<button type="button" class="chip" data-reg="nop" aria-pressed="${regS.nop}">${regS.g==="o"?"Heikko arvio":"Hinta puuttuu"}</button></div>
<div class="regtop"><b id="rcount" aria-live="polite"></b>${regS.g==="o"?"":`<button type="button" class="cartbtn" data-reg="new">${ico("plus")}<span>Lisää oma aines</span></button>`}</div>
<div id="rform"></div><ul class="rl" id="rlist"></ul>`;
  renderRegForm();renderRegList();
}
export const refreshReg=()=>{if(!$("v-reg").hidden){renderRegList();}};
export function openReg(q){
  if(dlg.open)dlg.close();
  if(curTab!=="reg")regS.back=curTab;
  regS.q=q||"";regS.d="";regS.m="";regS.own=false;regS.nop=false;regS.form=null;regS.otf=null;regS.del=false;regS.g="i";
  const c=q?catFind(q):null;
  regS.open=q?(state.ing[q]?q:(c?c.key:null)):null;
  if(q&&regS.open)regS.q="";
  showTab("reg");
  if(regS.open){const b=$("rlist").querySelector('[aria-expanded="true"]');if(b)b.scrollIntoView({block:"center"});}
}
function renameIng(from,to){
  const fix=r=>{
    r.ing=r.ing.map(line=>{
      const p=parseIng(line);
      if(p.key!==from)return line;
      if(line.includes(p.rawName))return line.replace(p.rawName,to);
      return p.q==null?to:to+" "+fmtQ(p.q)+" "+(p.u||"kpl");
    });
  };
  for(const r of state.custom)fix(r);
  for(const k of Object.keys(state.over))fix(state.over[k]);
  if(state.prices[from]){state.prices[to]=state.prices[from];delete state.prices[from];}
  for(const l of state.lists){l.have=l.have.map(x=>x===from?to:x);l.checked=l.checked.map(x=>x===from?to:x);}
}
export function synOwner(sn,self){
  const c=CIDX.get(sn);if(c&&c.key!==self)return[c.key,0];
  if(state.ing[sn]&&sn!==self)return[sn,0];
  const u=USYN.get(sn);if(u&&u!==self)return[u,0];
  if(PR[sn]&&sn!==self)return[sn,0];
  const ot=otOf(sn);if(ot)return[ot.k,1];
  return null;
}
const NMRE2=/^[a-zäöå0-9][a-zäöå0-9 \-.,()%]{0,59}$/i,SYRE2=/^[\p{L}\p{N}][\p{L}\p{N} \-.,()%]{0,59}$/u;
function regSave(){
  const f=regS.form,err=t=>{f.err=t;if(f.orig)renderRegList();else renderRegForm();};
  const fixed=f.kind==="ix"||f.kind==="pr";
  const key=fixed?f.orig:f.name.trim().toLowerCase().replace(/\s+/g," ");
  if(!fixed){
    if(!NMRE2.test(key))return err("Kirjoita aineksen nimi, enintään 60 merkkiä.");
    if((!f.orig||key!==f.orig)&&(CIDX.has(key)||state.ing[key]||PR[key]||USYN.has(key)))return err("Aines on jo rekisterissä.");
  }
  if(f.d==="")return err("Valitse tuoteryhmä.");
  const o={d:+f.d,m:f.m||""};
  const ns=["kcal","prot","fat","sat","carb","salt"];
  if(ns.some(k=>String(f[k]).trim()!=="")){
    const v={};
    for(const k of ns){
      const t=String(f[k]).trim(),x=t===""?0:num1(t);
      if(x==null||x<0||x>(k==="kcal"?900:100))return err("Tarkista ravintoarvot: kcal 0–900, muut 0–100 grammaa.");
      v[k]=Math.round(x*100)/100;
    }
    if(String(f.kcal).trim()==="")return err("Kirjoita ainakin energia (kcal).");
    o.n=v;
  }
  const uv={};
  for(const k of ["dl","kpl","prk","pss","nippu"]){
    const t=String(f[k]||"").trim(),x=t===""?0:num1(t);
    if(x==null||x<0||x>(k==="dl"?300:5000))return err("Tarkista painot: 1 dl enintään 300 g, muut enintään 5000 g.");
    uv[k]=x;
  }
  const c0=f.kind==="ix"?CBYK.get(key):null;
  if(c0&&!uv.dl){if(c0.o.u.rkl)uv.rkl=c0.o.u.rkl;if(c0.o.u.tl)uv.tl=c0.o.u.tl;}
  if(Object.values(uv).some(x=>x))o.u=uv;
  if(String(f.url||"").trim()){const su=safeUrl(f.url.trim());if(!su)return err("Linkki ei kelpaa. Käytä osoitetta, joka alkaa https://");o.url=su;}
  const sy=[];
  for(const s0 of String(f.syn||"").split(/[,;\n]/)){
    const t=s0.trim().toLowerCase().replace(/\s+/g," ");
    if(!t||t===key||sy.includes(t))continue;
    if(!SYRE2.test(t))return err("Synonyymi ”"+t+"” ei kelpaa. Käytä kirjaimia ja numeroita, enintään 60 merkkiä.");
    sy.push(t);
  }
  if(sy.length>12)return err("Synonyymejä voi olla enintään 12.");
  for(const t of sy){const ow=synOwner(t,key);if(ow)return err("Synonyymi ”"+t+"” kuuluu jo "+(ow[1]?"tuotteelle":"ainekselle")+" ”"+capF(ow[0])+"”. Poista se sieltä tai valitse toinen nimi.");}
  const pq=String(f.pkq||"").trim();
  if(pq!==""){
    const x=num1(pq);
    if(!(x>0&&x<=100000)||!["g","ml","kpl"].includes(f.pku))return err("Tarkista pakkauskoko, esimerkiksi 150 g.");
    o.pk=[Math.round(x*10)/10,f.pku];
  }else if(f.hadPk)o.pk=[];
  if(f.kind==="ix"){
    if(c0&&c0.o.pan)o.pan=true;
    if(c0&&f.m===c0.o.m.replace("?",""))o.m=c0.o.m;
    o.syn=sy;
  }else{
    const prev=f.orig?state.ing[f.orig]:null;
    if(prev&&prev.pan)o.pan=true;
    if(sy.length)o.syn=sy;
  }
  if(!f.orig&&Object.keys(state.ing).length>=300)return err("Omia aineksia voi olla enintään 300.");
  if(f.kind==="ix")state.ix[key]=o;
  else{
    if(f.orig&&key!==f.orig){renameIng(f.orig,key);delete state.ing[f.orig];}
    state.ing[key]=o;
  }
  rebuildCat();
  regS.form=null;regS.del=false;regS.open=key;
  mutate();renderRegForm();renderRegList();renderIdeas();refreshCart();
}
const regFormOf=(k,v,kind)=>{
  const pk=v.pk&&v.pk.length?v.pk:null;
  return{orig:k,kind,has:!!v.has,name:k,d:String(v.d),m:(v.m||"").replace("?",""),syn:(v.syn||[]).join(", "),kcal:v.n?String(v.n.kcal):"",prot:v.n?String(v.n.prot):"",fat:v.n?String(v.n.fat):"",sat:v.n?String(v.n.sat):"",carb:v.n?String(v.n.carb):"",salt:v.n?String(v.n.salt):"",dl:v.u&&v.u.dl?String(v.u.dl):"",kpl:v.u&&v.u.kpl?String(v.u.kpl):"",prk:v.u&&v.u.prk?String(v.u.prk):"",pss:v.u&&v.u.pss?String(v.u.pss):"",nippu:v.u&&v.u.nippu?String(v.u.nippu):"",pkq:pk?String(pk[0]).replace(".",","):"",pku:pk?pk[1]:"g",hadPk:!!pk,url:v.url||"",paste:"",info:"",err:""};
};
function regFormFromRow(row){
  const bk=baseKey(PALIAS[row.key]||row.key),e=bk?PR[bk]:null,u=Object.assign({},row.u||{});
  if(e&&!(row.own&&!row.ov)){if(!u.dl&&e.dl)u.dl=e.dl;if(!u.kpl&&e.kpl)u.kpl=e.kpl;if(!u.prk&&e.prk)u.prk=e.prk;if(!u.pss&&e.pss)u.pss=e.pss;if(!u.nippu&&e.nippu)u.nippu=e.nippu;}
  const kind=row.own&&!row.ov?"own":(row.cat?"ix":"pr");
  return regFormOf(row.key,{d:row.d,m:row.m,n:row.n,u,syn:row.syn,url:row.url||"",pk:packOf(row.key),has:row.ov},kind);
}
$("regBody").addEventListener("click",e=>{
  const b=e.target.closest("[data-reg]");if(!b)return;
  if(b.dataset.pf)return;
  const a=b.dataset.reg,k=b.dataset.key;
  if(a==="back"){showTab(regS.back||"add");}
  else if(a==="otedit"){const o=OT.get(k);if(o){const p=otP(o);regS.otf={k,d:String(o.d),p:p==null?"":String(Math.round(p*100)/100).replace(".",","),q:String(o.q).replace(".",","),u:o.u,p0:p==null?null:Math.round(p*100)/100,q0:o.q,u0:o.u,err:""};renderRegList();const sel=$("rlist").querySelector("[data-ot-in=d]");if(sel)sel.focus();}}
  else if(a==="otcancel"){regS.otf=null;renderRegList();}
  else if(a==="otreset"){delete state.ot[k];regS.otf=null;mutate();applyOtx();renderRegList();refreshCart();}
  else if(a==="otsave"){
    const f=regS.otf,o=f&&OT.get(f.k);if(!o)return;
    const er=t=>{f.err=t;renderRegList();};
    if(f.d==="")return er("Valitse osasto.");
    const pt=String(f.p).trim(),p=pt===""?null:num1(pt),q=num1(f.q);
    if(pt!==""&&!(p>0&&p<10000))return er("Kirjoita hinta euroina, esimerkiksi 2,50.");
    if(!(q>0&&q<100000))return er("Kirjoita pakkauskoko, esimerkiksi 250.");
    const x={...(state.ot[o.k]||{})},b=o.b,d=+f.d;
    if(d!==o.d)x.d=d;
    if(p!=null&&(f.p0==null||Math.abs(p-f.p0)>0.004))x.p=Math.round(p*100)/100;
    if(q!==f.q0||f.u!==f.u0){x.q=q;x.u=f.u;}
    if(x.d===b.d)delete x.d;
    if(x.p!=null&&b.p!=null&&x.p===b.p)delete x.p;
    if(x.q!=null&&x.q===b.q&&x.u===b.u){delete x.q;delete x.u;}
    if(Object.keys(x).length)state.ot[o.k]=x;else delete state.ot[o.k];
    regS.otf=null;mutate();applyOtx();renderRegList();refreshCart();
  }
  else if(a==="t"){regS.otf=null;regS.open=regS.open===k?null:k;regS.form=regS.form&&regS.form.orig?null:regS.form;regS.del=false;setPf(null);renderRegList();const nb=$("rlist").querySelector('[data-key="'+(window.CSS&&CSS.escape?CSS.escape(k):k)+'"]');if(nb)nb.focus();}
  else if(a==="g"){regS.otf=null;regS.g=b.dataset.g==="o"?"o":"i";regS.q="";regS.d="";regS.m="";regS.own=false;regS.nop=false;regS.open=null;regS.form=null;regS.del=false;renderReg();}
  else if(a==="reset"){
    if(state.ix[k])delete state.ix[k];else delete state.ing[k];
    rebuildCat();regS.form=null;regS.del=false;mutate();renderRegList();renderIdeas();refreshCart();
  }
  else if(a==="own"){regS.own=!regS.own;b.setAttribute("aria-pressed",regS.own);renderRegList();}
  else if(a==="nop"){regS.nop=!regS.nop;b.setAttribute("aria-pressed",regS.nop);renderRegList();}
  else if(a==="new"){regS.form=Object.assign(regFormOf("",{d:""},"new"),{name:regS.q.trim()});regS.del=false;renderRegForm();const i=$("rform").querySelector("input");if(i)i.focus();}
  else if(a==="edit"){const row=regRows().find(r=>r.key===k&&!r.ot);if(row){regS.form=regFormFromRow(row);regS.del=false;renderRegForm();renderRegList();}}
  else if(a==="cancel"){regS.form=null;regS.del=false;renderRegForm();renderRegList();}
  else if(a==="parse"){
    const f=regS.form,r=parseNutText(f.paste||"");let n=0;
    for(const k of Object.keys(r))if(r[k]!=null){f[k]=r[k];n++;}
    f.info=n?"Täytettiin "+n+" kenttää. Tarkista arvot.":"Tekstistä ei löytynyt ravintoarvoja.";
    if(f.orig)renderRegList();else renderRegForm();
  }
  else if(a==="save")regSave();
  else if(a==="del"){
    if(!regS.del){regS.del=true;renderRegList();return;}
    const key=regS.form.orig;if(regS.form.kind==="ix")delete state.ix[key];else delete state.ing[key];rebuildCat();regS.form=null;regS.del=false;regS.open=CBYK.has(key)?key:null;
    mutate();renderRegList();renderIdeas();refreshCart();
  }
});
$("regBody").addEventListener("input",e=>{
  const t=e.target;
  if(t.id==="rq"){regS.q=t.value;renderRegList();return;}
  const k=t.dataset&&t.dataset.regIn;if(k&&regS.form)regS.form[k]=t.value;
  const ok=t.dataset&&t.dataset.otIn;if(ok&&regS.otf)regS.otf[ok]=t.value;
});
$("regBody").addEventListener("change",e=>{
  const t=e.target;
  if(t.id==="rd"){regS.d=t.value;renderRegList();}
  else if(t.id==="rm"){regS.m=t.value;renderRegList();}
});
