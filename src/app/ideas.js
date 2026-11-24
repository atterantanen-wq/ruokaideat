/* ruokalista: automaattiset tägit, lisukkeet, kuvat ja suodatinsirut */
import {actList,state,mutate} from "./state.js";
import {S,A,T,M,TIME,WLD,HOL,FK,hide0,XLIM,$,ico,esc,R,isPop,workOf,defServ,parseIng} from "./core.js";
import {catFind,nutPer,mainOf,nearP,pvOf,setPv,recipeCost,setSel} from "./catalog.js";
import {qHit,renderIdeas} from "./search.js";
import {pruneChecked,ensureList,hideToast} from "./cart.js";
import {refreshCart,rmExtra,addExtra} from "./cart-view.js";
import {dlg,dlgList,openId,edit,renderDlg} from "./info.js";
import {capF} from "./registry.js";
import {selOf} from "../recipes.js";

/* ---------- ruokalista ---------- */
const ov=r=>state.over[r.id]?{...r,...state.over[r.id]}:r;
export const all=()=>R.filter(r=>!state.hidden.includes(r.id)).map(ov).concat(state.custom);
export const byId=id=>all().find(r=>r.id===id);
export const inCart=id=>state.cart.includes(id);
/* ---------- automaattiset tägit ---------- */
const KEVYT_KCAL=500,KEVYT_SAT=7;
/* Edullinen: pääruoista (MEAL_MAIN) halvin kolmannes annoshinnan mukaan. Raja lasketaan
 * kerran renderöintiä kohden ja seuraa näin hintojen ja reseptien muutoksia. */
const CHEAP_SHARE=1/3;
const cheapPer=r=>{if(!MEAL_MAIN.has(r.t))return null;const c=recipeCost(r);return c.n&&!c.big&&!c.miss.length?c.sum/pvOf(r):null;};
let cheapMemo=null;
function cheapLimit(){
  if(cheapMemo==null){
    const a=all().map(cheapPer).filter(v=>v!=null).sort((x,y)=>x-y);
    cheapMemo=a.length?a[Math.max(0,Math.ceil(a.length*CHEAP_SHARE)-1)]:-1;
    queueMicrotask(()=>{cheapMemo=null;});
  }
  return cheapMemo;
}
export function autoTags(r){
  const a=new Set();
  if(r.min>0&&r.min<=30)a.add("n");
  const per=cheapPer(r);
  if(per!=null&&per<=cheapLimit())a.add("e");
  const nu=nutPer(r);
  if(nu&&nu.full&&r.t!=="le"&&r.t!=="ja"&&nu.per.kcal<=KEVYT_KCAL&&nu.per.sat<=KEVYT_SAT)a.add("k");
  return a;
}
export function tagsOf(r){
  const a=autoTags(r);
  for(const k of r.kq||[])a.add(k);
  return Object.keys(S).filter(k=>a.has(k));
}
export const MEAL_MAIN=new Set(["pa","ki","ke","uu","pn","ps","sa","wo","pi","ha"]),MEAL_BRK=new Set(["pu","am","vp"]),MEAL_BAKE=new Set(["le","ja"]);
export function mealOf(r){
  const o=[];
  let arki=false;
  if(MEAL_MAIN.has(r.t)){const w=workOf(r)||r.min;if(w>0&&w<=45&&(r.min||0)<=120){o.push("a");arki=true;}}
  else if(MEAL_BRK.has(r.t))o.push("b");
  else if(MEAL_BAKE.has(r.t))o.push("l");
  /* viikonloppu ja juhla: käsin merkityt sekä pääruoat, jotka eivät ole arkiruokaa */
  if(r.t!=="li"&&(r.jf||(MEAL_MAIN.has(r.t)&&!arki)))o.push("j");
  return o;
}
const STARCH=new Set(["peruna","perunat","bataatti","riisi","pasta","spagetti","makaroni","makaronit","couscous","bulgur","nuudeli","nuudelit","lasagnelevy","lasagnelevyt","tortilla","tortillat","leipä","patonki","ruisleipä","ranskalaiset","puuroriisi","ohra","muusi"]);
const NOVEG=/(sipuli|valkosipul|persilja|tilli|basilika|korianteri|minttu|inkivääri|sitruuna|limetti|omena|banaani|marja|mustikka|puolukka|appelsiini|yrtti|rosmariini|timjami|oregano|chili|pippuri|suola|oliivi|kaprikset)/;
function ingKinds(r){
  let carb=false;const veg=new Set();
  for(const line of r.ing){
    const k=parseIng(line).key;
    if(k.split(" ").some(w=>STARCH.has(w))){carb=true;continue;}
    const e=catFind(k);
    if(e&&e.d===0&&!NOVEG.test(e.key)&&!NOVEG.test(k))veg.add(e.key);
  }
  return{carb,veg:veg.size};
}
export function sideNeeds(r){
  if(!r||r.t==="li"||!MEAL_MAIN.has(r.t)||!r.ing.length)return{c:false,v:false};
  const k=ingKinds(r);
  if(r.t==="ke")return{c:true,v:false};
  return{c:!k.carb,v:k.veg<2&&mainOf(r)!=="v"};
}
const sideKind=r=>ingKinds(r).carb?"c":"v";
export const PSIDE=[{k:"patonki",n:"Patonki",q:"1 kpl"},{k:"ruisleipä",n:"Ruisleipä",q:"1 kpl"},{k:"sämpylät",n:"Sämpylät",q:"1 pkt"}];
/* lisukkeen versio: pääruoan suosittelema tai lisukkeelle viimeksi valittu */
export function sideVer(x,want){
  if(!x.vs||x.vs.length<2)return null;
  return x.vs.find(v=>v.id===want)||selOf(x,state.tv[x.id]).ver;
}
export function useSideVer(sid,ver){const x=byId(sid);if(ver&&x&&x.vs&&x.vs.some(v=>v.id===ver))setSel(sid,n=>{n.v=ver;});}
export function sideSug(r){
  if(!r||r.t==="li")return null;
  const need=sideNeeds(r),pr=state.pair[r.id]||{},out={c:[],v:[],o:[]};
  /* reseptin omat ehdotukset: omien valintojen jälkeen, ennen yleistä päättelyä */
  /* sides: "lisuke-id" tai "lisuke-id:versio" (pääruoka suosittelee lisukkeen versiota) */
  const rsP=(r.sides||[]).map(x=>String(x).split(":")),rs=rsP.map(x=>x[0]),rx=(r.extras||[]).map(k=>String(k).toLowerCase());
  all().filter(x=>x.t==="li").forEach((x,i)=>{
    const kd=sideKind(x),ri=rs.indexOf(x.id);
    if(!(pr[x.id]>0)&&ri<0&&(rs.length||!(need[kd]&&!(r.t==="ke"&&kd==="c"))))return;
    let sc=(pr[x.id]||0)*1000+(state.sk[x.id]||0)*10+Math.max(0,100-i)+(ri>=0?800-ri*10:0);
    if(r.t==="sa")sc+=({"Couscous":450,"Keitetyt perunat":200})[x.name]||0;
    const vv=ri>=0?rsP[ri][1]:"",vo=sideVer(x,vv);
    out[kd].push({t:"r",id:x.id,name:x.name+(vo?" ("+vo.n.toLowerCase()+")":""),ver:vo?vo.id:"",sc,l:pr[x.id]>0});
  });
  PSIDE.forEach((p,i)=>{
    const key="p:"+p.k,xi=rx.indexOf(p.k);
    if(!(pr[key]>0)&&xi<0&&(rs.length||rx.length||!need.c))return;
    let sc=(pr[key]||0)*1000+(state.sk[key]||0)*10+(60-i)+(xi>=0?700-xi*10:0);
    if(r.t==="ke")sc+=500-i*10;else if(r.t==="sa")sc+=({"patonki":500,"ruisleipä":400})[p.k]||0;
    out.c.push({t:"p",id:p.k,name:p.n,sc,l:pr[key]>0});
  });
  rx.forEach((k,i)=>{
    if(PSIDE.some(p=>p.k===k))return;
    const key="p:"+k;
    out.o.push({t:"p",id:k,name:capF(k),sc:(pr[key]||0)*1000+(state.sk[key]||0)*10+700-i*10,l:pr[key]>0});
  });
  const known=new Set([...PSIDE.map(p=>"p:"+p.k),...rx.map(k=>"p:"+k)]);
  for(const key of new Set([...Object.keys(state.sk),...Object.keys(pr)])){
    if(!key.startsWith("p:")||known.has(key))continue;
    if(!(pr[key]>0)&&!((need.c||need.v)&&state.sk[key]>0))continue;
    out.o.push({t:"p",id:key.slice(2),name:capF(key.slice(2)),sc:(pr[key]||0)*1000+(state.sk[key]||0)*10,l:pr[key]>0});
  }
  for(const k of ["c","v","o"])out[k].sort((x,y)=>y.sc-x.sc);
  if(!out.c.length&&!out.v.length&&!out.o.length)return null;
  return{need,out};
}
export const sdOpen=new Set();
export let sdFor=null,sdOwn=false;
export function setSdOwn(v){return sdOwn=v;}
export function setSdFor(v){return sdFor=v;}
export function sdRowHtml(r,cls){
  const g=sideSug(r);if(!g)return"";
  const fl=dlgList&&state.lists.find(q=>q.id===dlgList),tl=fl||actList(state);
  const on=x=>!!tl&&(x.t==="r"?tl.cart.includes(x.id):(tl.x||[]).some(i=>i.k===x.id));
  const all2=sdOpen.has("all"),n=(g.out.c.length&&g.out.v.length)?2:3;
  const pick=(L,m)=>all2?L:L.filter((x,i)=>i<m||on(x));
  const all0=[...g.out.c,...g.out.v,...g.out.o];
  const recs=all0.filter(x=>x.t==="r").sort((a,b)=>b.sc-a.sc),prods=all0.filter(x=>x.t!=="r").sort((a,b)=>b.sc-a.sc);
  /* reseptit ensin reseptikuvakkeella, sitten valmiit tuotteet */
  const shown=[...pick(recs,3),...pick(prods,3)];
  const total=all0.length;
  const chip=x=>{const p=on(x);return`<button type="button" class="chip sdc${x.t==="r"?" sdr":""}" ${x.t==="r"?`data-side="${esc(x.id)}"${x.ver?` data-sver="${esc(x.ver)}"`:""}`:`data-pside="${esc(x.id)}"`} data-dish="${esc(r.id)}" aria-pressed="${p}" title="${x.t==="r"?"Lisukeresepti: ainekset listalle":"Valmis tuote kaupasta"}">${ico(p?"check":(x.t==="r"?"chef":"plus"))}${esc(x.name)}</button>`;};
  const more=total>shown.length?`<button type="button" class="chip sdm" data-sdmore="1">Muut (${total-shown.length})</button>`:(all2&&total>n?`<button type="button" class="chip sdm" data-sdmore="1">Vähemmän</button>`:"");
  const own=`<button type="button" class="chip sdm" data-sdown="1" aria-expanded="${sdOwn}">${ico("plus")}Oma…</button>`;
  const form=sdOwn?`<div class="xrow sdown"><input type="text" maxlength="60" placeholder="esim. raejuusto" autocomplete="off" aria-label="Oma lisuke"><button type="button" class="go" data-sdadd data-dish="${esc(r.id)}">Lisää</button></div><p class="note sdmsg" role="status"></p>`:"";
  return`<div class="sdrow${cls?" "+cls:""}" role="group" aria-label="Lisukkeeksi ruoalle ${esc(r.name)}"><div class="sdh"><span class="sdq">Lisukkeeksi?</span><span class="sdt"><button type="button" class="sdl" data-sdno="1" data-dish="${esc(r.id)}">Älä ehdota tälle</button><button type="button" class="sdx" data-sdclose aria-label="Sulje lisukeehdotukset">${ico("x")}</button></span></div><div class="chips">${shown.map(chip).join("")}${more}${own}</div>${form}</div>`;
}
export function renderSd(){
  document.querySelectorAll(".sdrow.cs").forEach(e=>e.remove());
  const r=sdFor&&byId(sdFor);
  let fresh=null;
  if(r&&!$("v-ideas").hidden){
    const c=[...$("list").querySelectorAll(".card[data-id]")].find(x=>x.dataset.id===r.id);
    if(c){c.insertAdjacentHTML("beforeend",sdRowHtml(r,"cs"));fresh=c.querySelector(".sdrow.cs");}
  }
  const slot=$("sdslot");
  if(slot)slot.innerHTML=(r&&openId===r.id)?sdRowHtml(r):"";
  return fresh;
}
function setSd(id){
  const r=id&&byId(id);
  sdOpen.clear();sdOwn=false;
  sdFor=(r&&sideSug(r)&&!state.nos.includes(id))?id:null;
  const f=renderSd();
  if(f)f.scrollIntoView({block:"nearest",behavior:"smooth"});
}
export const sdOnLink=r=>{const n=sideNeeds(r);return state.nos.includes(r.id)&&(n.c||n.v)?`<p class="cpy" style="margin-top:6px"><button type="button" class="clear" data-sdno="0" data-dish="${esc(r.id)}">Ota lisukeehdotukset käyttöön</button></p>`:"";};
export function toggleSide(sid,did,ver){
  const sd=byId(sid),d=byId(did);if(!sd)return;
  const fl=dlgList&&state.lists.find(q=>q.id===dlgList);
  const l=fl||ensureList(),i=l.cart.indexOf(sid);
  if(i>=0)l.cart.splice(i,1);
  else{
    l.cart.push(sid);
    setPv(sid,d?pvOf(d):nearP(defServ(sid)));
    useSideVer(sid,ver);
    if(d){const pm=state.pair[did]||(state.pair[did]={});pm[sid]=Math.min(999,(pm[sid]||0)+1);}
    state.sk[sid]=Math.min(9999,(state.sk[sid]||0)+1);
  }
  pruneChecked();mutate();refreshCart();renderSd();
  const root=dlg.open?$("sdslot"):$("list"),b=root&&[...root.querySelectorAll("[data-side]")].find(x=>x.dataset.side===sid);if(b)b.focus({preventScroll:true});
  hideToast();
}
export function learnP(did,key){
  if(did&&byId(did)){const pm=state.pair[did]||(state.pair[did]={});pm[key]=Math.min(999,(pm[key]||0)+1);}
  state.sk[key]=Math.min(9999,(state.sk[key]||0)+1);
}
function sdTarget(){const fl=dlgList&&state.lists.find(q=>q.id===dlgList);return fl||ensureList();}
export function togglePSide(key,did){
  const l=sdTarget();
  if((l.x||[]).some(i=>i.k===key))rmExtra(l,key);
  else{
    const ps=PSIDE.find(p=>p.k===key),err=addExtra(l,key+(ps?" "+ps.q:""));
    if(err)return;
    learnP(did,"p:"+key);
  }
  pruneChecked();mutate();refreshCart();renderSd();hideToast();
  const root=dlg.open?$("sdslot"):$("list"),b=root&&[...root.querySelectorAll("[data-pside]")].find(x=>x.dataset.pside===key);if(b)b.focus({preventScroll:true});
}
export function addOwnSide(btn){
  const row=btn.closest(".sdrow"),inp=row.querySelector("input"),msg=row.querySelector(".sdmsg"),v=inp.value.trim();
  if(!v){inp.focus();return;}
  const l=sdTarget(),err=addExtra(l,v);
  if(err){msg.textContent=err;return;}
  learnP(btn.dataset.dish,"p:"+parseIng(v).key.replace(/\s+/g," ").trim());
  sdOwn=false;pruneChecked();mutate();refreshCart();renderSd();hideToast();
}
document.addEventListener("keydown",e=>{
  if(e.key==="Enter"&&e.target.matches&&e.target.matches(".sdrow input")){e.preventDefault();const b=e.target.closest(".sdrow").querySelector("[data-sdadd]");if(b)b.click();}
});
export const sel={a:new Set(),s:new Set(),t:new Set(),m:new Set(),v:new Set(),w:new Set(),f:new Set()};
export const maps={a:A,s:S,t:T,m:M,v:TIME,w:WLD,f:HOL};
export const ids={a:"fa",s:"fs",t:"ft",m:"fm",v:"fvt",w:"fw",f:"ffe"};
export let pick=null;
export function setPick(v){return pick=v;}
export let onlyFP=false,qs="";
export function setOnlyFP(v){return onlyFP=v;}
/* ---------- kuvat ---------- */
export let assetsApi=null;
export function setAssetsApi(v){return assetsApi=v;}
export const imgUrl=r=>state.img[r.id]?"/_blob/"+state.img[r.id]:"";
export function releaseImg(id){
  if(!id||!assetsApi||Object.values(state.img).includes(id))return;
  try{Promise.resolve(assetsApi.delete(id)).catch(()=>{});}catch(e){}
}
export function dropDraftImg(){if(edit&&edit.draft&&edit.draft.img&&edit.draft.img!==(state.img[edit.id]||""))releaseImg(edit.draft.img);}
export function dropRecipeImg(rid){const o=state.img[rid];if(o){delete state.img[rid];releaseImg(o);}}
function shrink(file,max){
  return new Promise((ok,no)=>{
    const u=URL.createObjectURL(file),im=new Image();
    im.onload=()=>{
      URL.revokeObjectURL(u);
      const side=Math.min(im.naturalWidth,im.naturalHeight)||1,sx=(im.naturalWidth-side)/2,sy=(im.naturalHeight-side)/2;
      const out=Math.max(1,Math.min(max,side));
      const c=document.createElement("canvas");c.width=out;c.height=out;
      const g=c.getContext("2d");g.fillStyle="#fff";g.fillRect(0,0,out,out);g.drawImage(im,sx,sy,side,side,0,0,out,out);
      c.toBlob(b=>b?ok(b):no(new Error("blob")),"image/jpeg",.82);
    };
    im.onerror=()=>{URL.revokeObjectURL(u);no(new Error("img"));};
    im.src=u;
  });
}
export async function uploadImg(file){
  if(!assetsApi)throw new Error("none");
  if(!/^image\/(jpeg|png|webp|gif|heic|heif|avif)$/i.test(file.type||""))throw new Error("type");
  const b=await shrink(file,900);
  const r=await assetsApi.upload(b);
  if(!r||!/^[0-9a-f]{32}$/.test(String(r.id)))throw new Error("up");
  return r.id;
}
document.addEventListener("error",e=>{const t=e.target;if(t&&t.tagName==="IMG"&&(t.classList.contains("th")||t.classList.contains("hero"))){const c=t.closest(".card"),w=t.closest(".thw");if(w){const f=w.querySelector(".fav");if(f&&c){c.querySelector(".cartbtn.ic").before(f);}w.remove();}else t.remove();if(c)c.classList.remove("pic");}},true);
let fPend="";
export const isFav=id=>state.fav.includes(id);
export function toggleFav(id){
  const i=state.fav.indexOf(id);
  if(i>=0)state.fav.splice(i,1);else state.fav.push(id);
  mutate();renderIdeas();if(dlg.open&&openId===id&&!(edit&&edit.id===id))renderDlg();
}
export const dhSize=n=>{n=String(n||"");const L=n.length,W=Math.max(1,...n.split(/\s+/).map(w=>w.length));let f=1.6;if(L>24)f=1.45;if(L>36)f=1.3;if(L>52)f=1.15;if(W>14)f=Math.min(f,1.35);if(W>18)f=Math.min(f,1.2);return f;};
export const favBtn=(r,cls)=>{const on=isFav(r.id);return`<button type="button" class="fav${cls||""}" data-fav="${esc(r.id)}" aria-pressed="${on}" aria-label="${on?"Poista suosikeista":"Lisää suosikiksi"}: ${esc(r.name)}">${ico("heart")}</button>`;};

export const chipEls={a:{},s:{},t:{},m:{},v:{},w:{},f:{}};
const timeCodes=r=>{const m=+r.min||0;if(m<=0)return[];if(m>60)return["61"];return["60"].concat(m<=30?["30"]:[],m<=15?["15"]:[]);};
/* pääraaka-aineet kaikista versioista: suodatin "Kasvis" löytää pizzan, jolla on kasvisversio */
export const verMain=(r,v)=>v.veg?"v":(M[v.m]?v.m:"");
function mainsOf(r){const a=[mainOf(r)];for(const v of r.vs||[]){const m=verMain(r,v);if(m&&!a.includes(m))a.push(m);}return a;}
export const FV={a:mealOf,s:tagsOf,t:r=>[r.t],m:mainsOf,v:timeCodes,w:r=>r.wd?[r.wd]:[],f:r=>r.fe?[r.fe]:[]};
export const poolOf=r=>({lt:r.t,v0:{a:mealOf(r),s:tagsOf(r),t:[r.t],m:mainsOf(r),v:timeCodes(r),w:r.wd?[r.wd]:[],f:r.fe?[r.fe]:[]}});
export const xOpen={},hkX={};
/* chipien tila: osumamäärä, himmennys, tyhjien piilotus ja "Näytä lisää" */
export function chipStats(cfg){
  const{els,st,pool,exLi,open,box,sec}=cfg;
  for(const g of FK){
    let vis=0,ex=0;const lim=XLIM[g];
    for(const[c,b]of Object.entries(els[g])){
      const one=new Set([c]),on=st[g].has(c);
      let n=0,tot=0;
      for(const x of pool){
        if(x.v0[g].includes(c))tot++;
        let ok=true;
        for(const k of FK){
          const s2=k===g?one:st[k];
          if(k==="t"&&!s2.size){if(exLi&&x.lt==="li"){ok=false;break;}continue;}
          if(s2.size&&!x.v0[k].some(v=>s2.has(v))){ok=false;break;}
        }
        if(ok)n++;
      }
      const z=!on&&hide0(g,c)&&tot===0,dis=!on&&n===0;
      if(b.disabled!==dis){b.disabled=dis;b.classList.toggle("off",dis);}
      if(g!=="a")b.dataset.n=n;
      let h=z;
      if(!z){vis++;if(lim&&vis>lim&&!on){ex++;h=!open[g];}}
      if(b.hidden!==h)b.hidden=h;
    }
    const bx=box(g);
    if(lim&&bx){
      let x=bx.querySelector(".xbtn");
      if(!x){x=document.createElement("button");x.type="button";x.className="lk xbtn";x.dataset.xg=g;bx.appendChild(x);}
      x.hidden=!ex;x.textContent=open[g]?"Näytä vähemmän":"Näytä lisää ("+ex+")";
    }
    if(g!=="a"&&sec)sec(g,vis>0);
  }
}
export function updateChips(){
  const pool=all().filter(r=>(!onlyFP||isFav(r.id)||isPop(r))&&qHit(r)>=0).map(poolOf);
  chipStats({els:chipEls,st:sel,pool,exLi:true,open:xOpen,box:g=>$(ids[g]),sec:(g,v)=>{const p=$(ids[g]).parentElement;if(p.hidden!==!v)p.hidden=!v;}});
}
