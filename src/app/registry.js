/* ainesosarekisterin näkymä */
import {curTab,showTab} from "./tabs.js";
import {M,$,ico,esc,safeUrl,host,USYN,parseIng} from "./core.js";
import {PR,PALIAS} from "./prices.js";
import {CAT,CIDX,CBYK,KINDS,baseOf,variantsOf,rebuildCat,catFind,fold,fzBest,fmtD,baseKey,findPrice,pantryHit,isSkip,eur,f0,f1} from "./catalog.js";
import {state,setBar,mutate} from "./state.js";
import {all} from "./ideas.js";
import {renderIdeas} from "./search.js";
import {DEPS} from "./price-updates.js";
import {OT,otOf,applyOtx,otP,otPack,otUnit,deptOf,packOf,listItems,undoToast,hideToast} from "./cart.js";
import {refreshCart} from "./cart-view.js";
import {pf,setPf,PUNIT,kvRow,nutKv,packTxt,priceKv,priceFormHtml,dlg} from "./info.js";
import {fmtQ} from "./editor.js";

/* ---------- ainesosarekisteri ---------- */
export const regS={q:"",d:"",m:"",own:false,nop:false,open:null,form:null,back:"add",del:false,g:"",rdel:null,rto:"",rerr:""};
export const capF=s=>s.charAt(0).toUpperCase()+s.slice(1);
const num1=v=>{const x=parseFloat(String(v).replace(",","."));return isFinite(x)?x:null;};
/* yksi rekisteri: ainekset, valmiit tuotteet ja kodin tarvikkeet (laji kind: "" ruoka-aine, t valmis tuote, k kodin tarvike) */
function regRows(){
  const rows=[],seen=new Set();
  for(const e of CAT){seen.add(e.key);rows.push({key:e.key,d:e.d,m:e.m.replace("?",""),n:e.n,ni:e.ni,neg:e.neg,fid:e.fid,fname:e.fname,u:e.u,syn:e.syn,url:e.url,own:false,ov:e.ov||!!(OT.get(e.key)||{}).ov,cat:true,kind:e.kind,b:e.b,ot:OT.get(e.key)||null});}
  for(const k of Object.keys(PR))if(!seen.has(k)&&!catFind(k)&&!state.ing[k])rows.push({key:k,d:deptOf(k),m:"",n:null,neg:false,u:{},syn:[],own:false,cat:false,kind:""});
  for(const[k,v]of Object.entries(state.ing))rows.push({key:k,d:v.d,m:v.m||"",n:v.n||null,neg:false,u:v.u||{},url:v.url||"",syn:v.syn||[],own:true,ov:!!PR[k],cat:false,kind:"",b:v.b||"",ni:!!(v.b&&v.n&&CBYK.has(v.b)&&JSON.stringify(v.n)===JSON.stringify(CBYK.get(v.b).n))});
  return rows;
}
const rowPrice=r=>{const pe=findPrice(r.key);if(pe&&!(r.kind&&r.ot))return{t:eur(pe.p)+" / "+PUNIT[pe.per],ok:true};if(r.ot){const p=otP(r.ot);if(p!=null)return{t:eur(p)+" / "+otPack(r.ot),ok:true,w:!!r.ot.w};}return{t:"ei hintaa",ok:false};};
function regFilter(rows){
  const q=fold(regS.q.trim());
  for(const r of rows)r.s=q?fzBest(q,[r.key,...r.syn]):0;
  return rows.filter(r=>
    r.s>=0&&
    (regS.g===""||(regS.g==="i"?!r.kind:r.kind===regS.g))&&
    (regS.d===""||String(r.d)===regS.d)&&
    (regS.m===""||r.m===regS.m)&&
    (!regS.own||r.own||r.ov)&&
    (!regS.nop||(!rowPrice(r).ok&&!isSkip(r.key)&&!r.neg)||!!(r.ot&&r.ot.w&&r.ot.p!=null))
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
  const reset=f.kind==="own"?`<button type="button" class="clear err" data-reg="del">Poista aines</button>`:(f.has?`<button type="button" class="clear err" data-reg="del">${regS.del?"Varmista palautus":"Palauta alkuperäinen"}</button>`:"");
  return`<div class="rform"><p class="pft">${!f.orig?(f.b?"Lisää muunnelma":"Lisää oma aines"):fixed?"Muokkaa ainesta":"Muokkaa omaa ainesta"}</p>
${nameHtml}
${fixed?"":`<label class="rf2 w"><span>Muunnelma tuotteesta (valinnainen)</span><input type="text" data-reg-in="b" value="${esc(f.b||"")}" list="rbl" placeholder="esim. tuorejuusto" autocomplete="off"></label><datalist id="rbl">${CAT.filter(e=>e.kind!=="k").map(e=>`<option value="${esc(e.key)}">`).join("")}</datalist><p class="note nd" style="margin:-4px 0 10px">Esimerkiksi valkosipulituorejuusto on tuorejuuston muunnelma. Tyhjiksi jätetyt kentät täytetään pohjatuotteen tiedoilla, ja hinta tulee pohjatuotteelta, ellet anna omaa.</p>`}
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
  return`<div class="rform"><p class="pft">Muokkaa pakkausta: <b>${esc(capF(o.k))}</b></p>
<div class="rrow"><label class="rf2"><span>Pakkauksen hinta, €</span><input type="text" inputmode="decimal" data-ot-in="p" value="${esc(f.p)}" placeholder="esim. 2,50" autocomplete="off"></label>
<label class="rf2"><span>Pakkauskoko</span><input type="text" inputmode="decimal" data-ot-in="q" value="${esc(f.q)}" autocomplete="off"></label>
<label class="rf2"><span>Yksikkö</span><select data-ot-in="u">${["g","ml","kpl"].map(x=>`<option value="${x}"${f.u===x?" selected":""}>${x}</option>`).join("")}</select></label></div>
<p class="note nd">Muutos koskee vain sinua. Alkuperäiset tiedot voi palauttaa.</p>
${f.err?`<p class="note err" role="alert">${esc(f.err)}</p>`:""}
<div class="nfa"><button type="button" class="go" data-reg="otsave" data-key="${esc(o.k)}">Tallenna</button><button type="button" class="cartbtn" data-reg="otcancel"><span>Peruuta</span></button></div></div>`;
}
/* pakkaus ja pakkaushinta (ostoslistan Lisää tuotteita) */
function packSection(o){
  if(regS.otf&&regS.otf.k===o.k)return`<section class="ib">${otFormHtml(o)}</section>`;
  const u=otUnit(o),pu=o.u==="kpl"?"kpl":(o.u==="ml"?"l":"kg"),p=otP(o);
  let h=`<section class="ib"><h4>Pakkaus</h4><dl class="kv">${kvRow("Pakkaus",esc(otPack(o)))}${kvRow("Hinta",p==null?"puuttuu":eur(p)+(u!=null?" · "+eur(u)+" / "+pu:"")+(o.w?" · heikko arvio":""))}</dl>`;
  h+=`<p class="idn">${esc(o.note)}. Lähde: <a href="https://www.s-kaupat.fi/tuotteet/${esc(o.path)}" target="_blank" rel="noopener noreferrer">S-kaupat.fi</a>, tarkistettu ${fmtD(o.dt)}.${o.w?" "+esc(o.w):""}${o.ov?" Olet muokannut pakkausta.":""}</p>`;
  h+=`<p class="ibb"><button type="button" class="lk" data-reg="otedit" data-key="${esc(o.k)}">Muokkaa pakkausta</button>${o.ov?` <button type="button" class="lk" data-reg="otreset" data-key="${esc(o.k)}">Palauta pakkaus</button>`:""}</p></section>`;
  return h;
}
const regLink=k=>`<button type="button" class="lk" data-reg="go" data-key="${esc(k)}">${esc(capF(k))}</button>`;
function regDetail(row){
  if(regS.form&&regS.form.orig===row.key)return regFormHtml();
  const n=row.n,bk=row.b||"",vs=variantsOf(row.key);
  let h='<div class="rd idet">';
  if(bk)h+=`<section class="ib"><h4>Muunnelma</h4><p class="ru">Pohjatuote: ${regLink(bk)}</p><p class="idn">Tiedot, joita tällä tuotteella ei ole, tulevat pohjatuotteelta. Ostoslistalla tämä on oma rivinsä. Kaapissa tämä kelpaa myös pohjatuotteeksi, mutta pohjatuote ei kelpaa tämän tilalle, ellei reseptissä lue esimerkiksi "(tai tavallinen)".</p></section>`;
  if(!(row.kind&&row.ot))h+=`<section class="ib"><h4>Hinta</h4>${regPriceHtml(row)}</section>`;
  if(row.ot)h+=packSection(row.ot);
  if(row.kind!=="k"){
  h+=`<section class="ib"><h4>Ravintoarvot / 100 g</h4>`;
  if(n){
    h+=nutKv(n);
    h+=row.ni?`<p class="idn">Pohjatuotteen ${esc(capF(bk))} arvot.</p>`:`<p class="idn">${row.own?(row.url?`Oma arvo. Lähde: <a href="${esc(row.url)}" target="_blank" rel="noopener noreferrer">${esc(host(row.url)||"tuotesivu")}</a>.`:"Oma arvo."):row.ov?"Muokattu arvo.":(row.fid?`Lähde: <a href="https://fineli.fi/fineli/fi/elintarvikkeet/${esc(row.fid)}" target="_blank" rel="noopener noreferrer">Fineli: ${esc(row.fname)}</a>, THL, CC BY 4.0.`:"Käsin lisätty arvio.")}</p>`;
  }else h+=`<p class="idn" style="margin-top:0">${row.neg?"Ravintoarvoja ei lasketa, koska ainesta käytetään vain vähän.":"Ravintoarvoja ei ole."}</p>`;
  h+=`</section>`;
  }
  const u=regUnits(row);
  if(u.length)h+=`<section class="ib"><h4>Yksiköt</h4><p class="ru">${u.map(esc).join(" · ")}</p></section>`;
  if(row.kind!=="k")h+=`<section class="ib"><h4>Muunnelmat</h4><p class="ru">${vs.length?vs.map(regLink).join(", "):"Ei muunnelmia."}</p><p class="ibb"><button type="button" class="lk" data-reg="newv" data-key="${esc(row.key)}">Lisää muunnelma</button></p></section>`;
  if(row.syn.length)h+=`<section class="ib"><h4>Tunnistetaan myös</h4><p class="ru">${row.syn.map(esc).join(", ")}</p></section>`;
  const used=all().filter(r=>r.ing.some(l=>{const k=parseIng(l).key;if(row.cat){const c=catFind(k);return c&&c.key===row.key;}return k===row.key;}));
  if(used.length)h+=`<section class="ib"><h4>Käytössä ruuissa</h4><p class="ru">${used.slice(0,8).map(r=>`<button type="button" class="lk" data-open="${esc(r.id)}">${esc(r.name)}</button>`).join("")}${used.length>8?` ja ${used.length-8} muuta`:""}</p></section>`;
  const own=row.own&&!row.ov,arm=own&&regS.rdel===row.key;
  if(arm)h+=delPanel(row.key);
  h+=`<div class="nfa"><button type="button" class="cartbtn" data-reg="edit" data-key="${esc(row.key)}">${ico("pencil")}<span>Muokkaa</span></button>${own?`<button type="button" class="cartbtn regdel${arm?" arm":""}" data-reg="rdel" data-key="${esc(row.key)}" aria-label="${arm?"Varmista poisto":"Poista"}: ${esc(capF(row.key))}">${ico("trash")}<span>${arm?"Varmista poisto":"Poista"}</span></button>${arm?`<button type="button" class="clear" data-reg="rdelno">Peruuta</button>`:""}`:""}${row.ov?`<button type="button" class="clear" data-reg="reset" data-key="${esc(row.key)}">Palauta alkuperäinen</button>`:""}</div>`;
  return h+"</div>";
}
/* ---------- oman aineksen poisto ----------
   Reseptirivit ovat vapaata tekstiä: poiston jälkeen rivi jää reseptiin ja ostoslistalle sellaisenaan, mutta hinta ja
   ravintoarvot tulevat vain, jos rivin nimi osuu johonkin rekisterin tuotteeseen. Siksi varmistus kertoo, missä ainesta
   käytetään, ja tarjoaa korvaavan rekisterituotteen, jolla rivit nimetään uudelleen (määrät säilyvät). */
const lineHas=(l,k)=>parseIng(l).key===k;
function ownUses(k){
  const recs=[...state.custom.filter(r=>r.ing.some(l=>lineHas(l,k))).map(r=>r.name),
    ...Object.keys(state.over).filter(id=>(state.over[id].ing||[]).some(l=>lineHas(l,k))).map(id=>{const r=all().find(x=>x.id===id);return r?r.name:"";}).filter(Boolean)];
  const lists=state.lists.filter(l=>{try{return listItems(l).some(e=>e.key===k);}catch(_){return(l.x||[]).some(i=>i.k===k);}}).map(l=>l.name);
  const pan=state.kp.h.some(i=>i.k===k);
  return{recs:[...new Set(recs)],lists,pan};
}
/* ehdotukset korvaajaksi: pohjatuote, tuote johon nimi jo nyt osuu, yhdyssanan osa (koskenlaskijadippi -> koskenlaskija
   = sulatejuusto) ja lähin nimi. Kenttää ei täytetä valmiiksi, koska ehdotus voi olla väärä (curry ei ole currytahna). */
function ownSugs(k){
  const o=[],add=x=>{if(x&&x!==k&&!o.includes(x)&&o.length<3)o.push(x);};
  const v=state.ing[k];if(v&&v.b&&CBYK.has(v.b))add(v.b);
  const c=catFind(k);if(c&&c.kind!=="k")add(c.key);
  const ws=fold(k).split(/\s+/),hits=[];
  for(const e of CAT){if(e.kind==="k")continue;let bl=0;for(const n0 of [e.key,...e.syn]){const n=fold(n0);if(n.length>=5&&ws.some(w=>w.includes(n)))bl=Math.max(bl,n.length);}if(bl)hits.push([bl,e.key]);}
  hits.sort((a,b)=>b[0]-a[0]).forEach(h=>add(h[1]));
  const fz=[];
  for(const e of CAT){if(e.kind==="k")continue;let bs=9;for(const w of ws){if(w.length<4)continue;const s=fzBest(w,[e.key,...e.syn]);if(s>=0&&s<bs)bs=s;}if(bs<=2)fz.push([bs,e.key]);}
  fz.sort((a,b)=>a[0]-b[0]||a[1].length-b[1].length).forEach(h=>add(h[1]));
  return o;
}
function delPanel(k){
  const u=ownUses(k),fb=catFind(k),fbt=fb?`nimi tunnistetaan jatkossa tuotteeksi ${esc(capF(fb.key))}, jonka hintaa ja ravintoarvoja silloin käytetään`:"niiltä puuttuu hinta ja ravintoarvot";
  if(!u.recs.length&&!u.lists.length&&!u.pan)return`<p class="note nd regdelp" role="status">Ainesta ei käytetä omissa ruoissa, ostoslistoilla eikä kaapissa. Poiston voi vielä kumota.</p>`;
  const li=[];
  if(u.recs.length)li.push(`<li>Omat ruoat: ${u.recs.map(esc).join(", ")}</li>`);
  if(u.lists.length)li.push(`<li>Ostoslistat: ${u.lists.map(esc).join(", ")}</li>`);
  if(u.pan)li.push(`<li>Kaappi</li>`);
  return`<div class="rform regdelp"><p class="pft">Aines on käytössä</p><ul class="regdelu">${li.join("")}</ul>
<label class="rf2 w"><span>Korvaa tuotteella (valinnainen)</span><input type="text" data-reg-del="to" value="${esc(regS.rto)}" list="rdl" placeholder="esim. sulatejuusto" autocomplete="off"></label>${(()=>{const sg=ownSugs(k);return sg.length?`<p class="ru" style="margin:-4px 0 10px">Ehdotukset: ${sg.map(x=>`<button type="button" class="lk" data-reg="rto" data-key="${esc(x)}">${esc(capF(x))}</button>`).join(", ")}</p>`:"";})()}<datalist id="rdl">${CAT.filter(e=>e.kind!=="k").map(e=>`<option value="${esc(e.key)}">`).join("")}</datalist>
<p class="note nd" style="margin:-4px 0 0">Korvaava tuote vaihdetaan aineksen tilalle resepteihin, ostoslistoille ja kaappiin, ja määrät säilyvät. Jos jätät kentän tyhjäksi, rivit eivät katoa: ne jäävät resepteihin ja listoille sellaisinaan, mutta ${fbt}. ${fb?"":"Ostoslistalla rivin vieressä on silloin Lisää rekisteriin."}</p>
${regS.rerr?`<p class="note err" role="alert">${esc(regS.rerr)}</p>`:""}</div>`;
}
/* nimetään rivit, listat ja kaappi uudelleen; hinta ei siirry korvaajalle */
function swapKey(from,to){
  const fix=r=>{
    r.ing=r.ing.map(line=>{
      const p=parseIng(line);
      if(p.key!==from)return line;
      if(line.includes(p.rawName))return line.replace(p.rawName,to);
      return p.q==null?to:to+" "+fmtQ(p.q)+" "+(p.u||"kpl");
    });
  };
  for(const r of state.custom)fix(r);
  for(const k of Object.keys(state.over))if(state.over[k].ing)fix(state.over[k]);
  const m=a=>[...new Set(a.map(x=>x===from?to:x))];
  for(const l of state.lists){
    l.have=m(l.have);l.checked=m(l.checked);
    if(l.x){const seen=new Set();l.x=l.x.map(i=>i.k===from?{...i,k:to}:i).filter(i=>!seen.has(i.k)&&seen.add(i.k));}
    if(l.adj&&l.adj[from]!=null){if(l.adj[to]==null)l.adj[to]=l.adj[from];delete l.adj[from];}
  }
  const seen=new Set();state.kp.h=state.kp.h.map(i=>i.k===from?{...i,k:to}:i).filter(i=>!seen.has(i.k)&&seen.add(i.k));
  state.kp.no=m(state.kp.no);
}
let ownIngUndo=null;
function deleteOwnIng(k){
  const t=String(regS.rto||"").trim().toLowerCase();
  let to="";
  if(t){
    const c=CBYK.get(t)||CIDX.get(t);
    if(!c||c.kind==="k"){regS.rerr="Tuotetta ”"+t+"” ei löydy rekisteristä. Valitse tuote listasta tai jätä kenttä tyhjäksi.";renderRegList();return;}
    to=c.key;
  }
  ownIngUndo={k,v:state.ing[k],p:state.prices[k],snap:structuredClone({custom:state.custom.map(r=>[r.id,r.ing]),over:Object.keys(state.over).map(id=>[id,state.over[id].ing]),lists:state.lists.map(l=>[l.id,{have:l.have,checked:l.checked,x:l.x,adj:l.adj}]),kp:state.kp})};
  if(to)swapKey(k,to);
  delete state.ing[k];delete state.prices[k];
  rebuildCat();regS.rdel=null;regS.rto="";regS.rerr="";regS.form=null;regS.del=false;regS.open=null;
  mutate();renderRegList();renderIdeas();refreshCart();
  undoToast(`Poistettu rekisteristä: <b>${esc(capF(k))}</b>${to?" · korvattu: "+esc(capF(to)):""}`,'data-regundo="1"');
}
$("toast").addEventListener("click",e=>{
  if(!e.target.closest("[data-regundo]")||!ownIngUndo)return;
  const u=ownIngUndo;ownIngUndo=null;
  if(!state.ing[u.k]){
    state.ing[u.k]=u.v;if(u.p)state.prices[u.k]=u.p;
    const s=u.snap;
    for(const[id,ing]of s.custom){const r=state.custom.find(x=>x.id===id);if(r)r.ing=ing;}
    for(const[id,ing]of s.over)if(state.over[id]&&ing)state.over[id].ing=ing;
    for(const[id,v]of s.lists){const l=state.lists.find(x=>x.id===id);if(!l)continue;l.have=v.have;l.checked=v.checked;if(v.x)l.x=v.x;if(v.adj)l.adj=v.adj;}
    state.kp=s.kp;
    rebuildCat();regS.open=u.k;mutate();if(!$("v-reg").hidden)renderRegList();renderIdeas();refreshCart();
  }
  hideToast();
});
function regListHtml(){
  const rows=regFilter(regRows());
  $("rcount").textContent=rows.length===1?"1 tuote":rows.length+" tuotetta";
  return rows.map(r=>{
    const open=regS.open===r.key,pr=rowPrice(r);
    const sub=[DEPS[r.d]||"",r.kind?KINDS[r.kind]:"",r.b?"muunnelma":"",r.own&&!r.ov?"oma":r.ov?"muokattu":"",r.m&&M[r.m]?M[r.m]:""].filter(Boolean).map(esc).join(" · ");
    const right=r.kind==="k"?(pr.w?"heikko arvio":"&nbsp;"):(r.n?f0(r.n.kcal)+" kcal":"ei ravintoarvoja");
    return`<li class="rr"><button type="button" class="rh" data-reg="t" data-key="${esc(r.key)}" aria-expanded="${open}"><span class="rn"><b>${esc(capF(r.key))}</b><small>${sub}</small></span><span class="rv"><span${pr.ok?"":' class="np"'}>${esc(pr.t)}</span><span>${right}</span></span>${ico("chev")}</button>${open?regDetail(r):""}</li>`;
  }).join("")||`<li class="note" style="padding:12px 4px">Ei osumia. Poista suodattimia tai lisää oma aines.</li>`;
}
function renderRegList(){$("rlist").innerHTML=regListHtml();}
function renderRegForm(){const b=$("rform");if(b)b.innerHTML=regS.form&&!regS.form.orig?regFormHtml():"";}
export function renderReg(){
  setBar("reg","Tuoterekisteri");
  $("regBody").innerHTML=`<button type="button" class="lk back" data-reg="back">← Takaisin</button>
<p class="note">Reseptien ainekset, valmiit tuotteet ja kodin tarvikkeet samassa rekisterissä. Tuotteelle on tallennettu osasto ja hinta tai pakkaushinta, ruoka-aineille myös ravintoarvot ja yksikkömuunnokset. Ravintoarvot: Fineli, THL, CC BY 4.0.</p>
<input id="rq" type="search" placeholder="Hae tuotetta" value="${esc(regS.q)}" autocomplete="off" aria-label="Hae">
<div class="rsel"><select id="rg" aria-label="Laji"><option value="">Kaikki lajit</option>${[["i","Ruoka-aineet"],["t","Valmiit tuotteet"],["k","Kodin tarvikkeet"]].map(([v,l])=>`<option value="${v}"${regS.g===v?" selected":""}>${l}</option>`).join("")}</select>
<select id="rd" aria-label="Tuoteryhmä"><option value="">Kaikki tuoteryhmät</option>${DEPS.map((n,i)=>`<option value="${i}"${regS.d===String(i)?" selected":""}>${esc(n)}</option>`).join("")}</select>
<select id="rm" aria-label="Pääraaka-aine"><option value="">Kaikki pääraaka-aineet</option>${Object.entries(M).filter(([c])=>c!=="v").map(([c,l])=>`<option value="${c}"${regS.m===c?" selected":""}>${esc(l)}</option>`).join("")}</select></div>
<div class="chips" style="margin-top:10px"><button type="button" class="chip" data-reg="own" aria-pressed="${regS.own}">Omat</button><button type="button" class="chip" data-reg="nop" aria-pressed="${regS.nop}">Hinta puuttuu</button></div>
<div class="regtop"><b id="rcount" aria-live="polite"></b><button type="button" class="cartbtn" data-reg="new">${ico("plus")}<span>Lisää oma aines</span></button></div>
<div id="rform"></div><ul class="rl" id="rlist"></ul>`;
  renderRegForm();renderRegList();
}
export const refreshReg=()=>{if(!$("v-reg").hidden){renderRegList();}};
export function openReg(q){
  if(dlg.open)dlg.close();
  if(curTab!=="reg")regS.back=curTab;
  regS.q=q||"";regS.d="";regS.m="";regS.own=false;regS.nop=false;regS.form=null;regS.otf=null;regS.del=false;regS.g="";regS.rdel=null;
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
  let bc=null;
  if(!fixed&&String(f.b||"").trim()){
    const bt=String(f.b).trim().toLowerCase();bc=CBYK.get(bt)||CIDX.get(bt)||null;
    if(!bc||bc.kind==="k")return err("Pohjatuotetta ”"+bt+"” ei löydy rekisteristä. Valitse tuote listasta.");
    if(bc.key===key)return err("Tuote ei voi olla oma pohjatuotteensa.");
    if(f.d==="")f.d=String(bc.d);
    if(!f.m)f.m=(bc.m||"").replace("?","");
  }
  if(f.d==="")return err("Valitse tuoteryhmä.");
  const o={d:+f.d,m:f.m||""};
  if(bc)o.b=bc.key;
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
  if(bc)for(const k of ["dl","kpl","prk","pss","nippu"])if(!uv[k]&&bc.u&&bc.u[k])uv[k]=bc.u[k];
  if(Object.values(uv).some(x=>x))o.u=uv;
  if(bc&&!o.n&&bc.n)o.n={...bc.n};
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
  return{orig:k,kind,has:!!v.has,name:k,d:String(v.d),m:(v.m||"").replace("?",""),syn:(v.syn||[]).join(", "),kcal:v.n?String(v.n.kcal):"",prot:v.n?String(v.n.prot):"",fat:v.n?String(v.n.fat):"",sat:v.n?String(v.n.sat):"",carb:v.n?String(v.n.carb):"",salt:v.n?String(v.n.salt):"",dl:v.u&&v.u.dl?String(v.u.dl):"",kpl:v.u&&v.u.kpl?String(v.u.kpl):"",prk:v.u&&v.u.prk?String(v.u.prk):"",pss:v.u&&v.u.pss?String(v.u.pss):"",nippu:v.u&&v.u.nippu?String(v.u.nippu):"",pkq:pk?String(pk[0]).replace(".",","):"",pku:pk?pk[1]:"g",hadPk:!!pk,url:v.url||"",b:v.b||"",paste:"",info:"",err:""};
};
function regFormFromRow(row){
  const bk=baseKey(PALIAS[row.key]||row.key),e=bk?PR[bk]:null,u=Object.assign({},row.u||{});
  if(e&&!(row.own&&!row.ov)){if(!u.dl&&e.dl)u.dl=e.dl;if(!u.kpl&&e.kpl)u.kpl=e.kpl;if(!u.prk&&e.prk)u.prk=e.prk;if(!u.pss&&e.pss)u.pss=e.pss;if(!u.nippu&&e.nippu)u.nippu=e.nippu;}
  const kind=row.own&&!row.ov?"own":(row.cat?"ix":"pr");
  return regFormOf(row.key,{d:row.d,m:row.m,n:row.n,u,syn:row.syn,url:row.url||"",pk:packOf(row.key),has:row.ov,b:row.own?row.b:""},kind);
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
    const pt=String(f.p).trim(),p=pt===""?null:num1(pt),q=num1(f.q);
    if(pt!==""&&!(p>0&&p<10000))return er("Kirjoita hinta euroina, esimerkiksi 2,50.");
    if(!(q>0&&q<100000))return er("Kirjoita pakkauskoko, esimerkiksi 250.");
    const x={...(state.ot[o.k]||{})},b=o.b;
    if(p!=null&&(f.p0==null||Math.abs(p-f.p0)>0.004))x.p=Math.round(p*100)/100;
    if(q!==f.q0||f.u!==f.u0){x.q=q;x.u=f.u;}
    if(x.p!=null&&b.p!=null&&x.p===b.p)delete x.p;
    if(x.q!=null&&x.q===b.q&&x.u===b.u){delete x.q;delete x.u;}
    if(Object.keys(x).length)state.ot[o.k]=x;else delete state.ot[o.k];
    regS.otf=null;mutate();applyOtx();renderRegList();refreshCart();
  }
  else if(a==="t"){regS.otf=null;regS.rdel=null;regS.open=regS.open===k?null:k;regS.form=regS.form&&regS.form.orig?null:regS.form;regS.del=false;setPf(null);renderRegList();const nb=$("rlist").querySelector('[data-key="'+(window.CSS&&CSS.escape?CSS.escape(k):k)+'"]');if(nb)nb.focus();}
  else if(a==="go"){regS.otf=null;regS.form=null;regS.del=false;regS.q="";regS.g="";regS.d="";regS.m="";regS.own=false;regS.nop=false;regS.open=k;renderReg();const nb=$("rlist").querySelector('[aria-expanded="true"]');if(nb){nb.scrollIntoView({block:"center"});nb.focus();}}
  else if(a==="newv"){const c=CBYK.get(k);regS.form=Object.assign(regFormOf("",{d:c?c.d:""},"new"),{name:"",b:k});regS.del=false;regS.open=null;renderRegList();renderRegForm();$("rform").scrollIntoView({block:"start"});const i=$("rform").querySelector("input");if(i)i.focus();}
  else if(a==="reset"){
    if(state.ix[k])delete state.ix[k];else delete state.ing[k];
    rebuildCat();regS.form=null;regS.del=false;mutate();renderRegList();renderIdeas();refreshCart();
  }
  else if(a==="own"){regS.own=!regS.own;b.setAttribute("aria-pressed",regS.own);renderRegList();}
  else if(a==="nop"){regS.nop=!regS.nop;b.setAttribute("aria-pressed",regS.nop);renderRegList();}
  else if(a==="new"){regS.form=Object.assign(regFormOf("",{d:""},"new"),{name:regS.q.trim()});regS.del=false;renderRegForm();const i=$("rform").querySelector("input");if(i)i.focus();}
  else if(a==="edit"){const row=regRows().find(r=>r.key===k);if(row){regS.form=regFormFromRow(row);regS.del=false;renderRegForm();renderRegList();}}
  else if(a==="cancel"){regS.form=null;regS.del=false;renderRegForm();renderRegList();}
  else if(a==="parse"){
    const f=regS.form,r=parseNutText(f.paste||"");let n=0;
    for(const k of Object.keys(r))if(r[k]!=null){f[k]=r[k];n++;}
    f.info=n?"Täytettiin "+n+" kenttää. Tarkista arvot.":"Tekstistä ei löytynyt ravintoarvoja.";
    if(f.orig)renderRegList();else renderRegForm();
  }
  else if(a==="save")regSave();
  else if(a==="rdel"){
    if(regS.rdel===k){deleteOwnIng(k);return;}
    regS.rdel=k;regS.rto="";regS.rerr="";renderRegList();
    const nb=$("rlist").querySelector('[data-reg="rdel"]');if(nb)nb.focus();
  }
  else if(a==="rto"){regS.rto=k;regS.rerr="";const i=$("rlist").querySelector('[data-reg-del="to"]');if(i){i.value=k;i.focus();}}
  else if(a==="rdelno"){regS.rdel=null;regS.rerr="";renderRegList();}
  else if(a==="del"&&regS.form&&regS.form.kind==="own"){const key=regS.form.orig;regS.form=null;regS.del=false;regS.open=key;regS.rdel=key;regS.rto="";regS.rerr="";renderRegForm();renderRegList();}
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
  if(t.dataset&&t.dataset.regDel==="to"){regS.rto=t.value;regS.rerr="";}
  const ok=t.dataset&&t.dataset.otIn;if(ok&&regS.otf)regS.otf[ok]=t.value;
});
$("regBody").addEventListener("change",e=>{
  const t=e.target;
  if(t.id==="rd"){regS.d=t.value;renderRegList();}
  else if(t.id==="rg"){regS.g=t.value;renderRegList();}
  else if(t.id==="rm"){regS.m=t.value;renderRegList();}
});
