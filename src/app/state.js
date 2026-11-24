/* sovelluksen tila (state), tallennus localStorageen ja etäsynkka */
import {CBYK,todayIso,PCH} from "./catalog.js";
import {T,M,WLD,HOL,KQ,$,clip,R,defServ,safeUrl} from "./core.js";
import {applyLay,renderIdeas} from "./search.js";
import {STORE_IDS,migDept,OT,applyOtx} from "./cart.js";
import {updBadge,refreshCart} from "./cart-view.js";
import * as PL from "../planner.js";

/* ---------- tila ja tallennus ---------- */
const LS="ruokaideat-v1";
export const todayLocal=todayIso;
export function mkName(date,lists){
  const d=new Date(date+"T12:00:00");
  const base="Ostoslista"+(isNaN(d)?"":" "+d.getDate()+"."+(d.getMonth()+1)+"."+d.getFullYear());
  let n=base,k=2;while(lists.some(l=>l.name===n))n=base+" ("+(k++)+")";
  return n;
}
export function actList(o){return o.lists.find(l=>l.id===o.act)||o.lists[o.lists.length-1]||null;}
function aliasState(o){
  Object.defineProperties(o,{
    cart:{configurable:true,enumerable:false,get(){const l=actList(this);return l?l.cart:[];},set(v){const l=actList(this);if(l)l.cart=v;}},
    checked:{configurable:true,enumerable:false,get(){const l=actList(this);return l?l.checked:[];},set(v){const l=actList(this);if(l)l.checked=v;}}
  });
  return o;
}
export let state=aliasState({custom:[],lists:[],act:"",over:{},hidden:[],serv:{},prices:{},fav:[],sort:"fav",img:{},views:{},ing:{},xh:{},sp:false,rv:false,th:"auto",lay:"grid",sr:[],pv:{},pair:{},sk:{},nos:[],ix:{},ot:{},store:"",so:{},sx:{},rc:[],dv:2,vk:[],pl:PL.defaultPlan()});
export function setState(v){return state=v;}
let touched=false,remote=null,saving=false,dirty=false;

function cleanRec(c){
  if(!c||typeof c.name!=="string"||!c.name.trim())return null;
  return{name:clip(c.name,120),m:(c.m===""||M[c.m])?c.m:"v",mo:M[c.mo]?c.mo:"",t:(c.t===""||T[c.t])?c.t:"pa",
    s:[],
    min:Math.max(0,Math.min(1440,parseInt(c.min)||0)),
    w:Math.max(0,Math.min(1440,parseInt(c.w)||0)),
    d:clip(c.d,160),
    ing:Array.isArray(c.ing)?c.ing.slice(0,100).map(v=>clip(v,120)):[],
    steps:Array.isArray(c.steps)?c.steps.slice(0,100).map(v=>clip(v,600)):[],
    gr:(()=>{const n=Array.isArray(c.ing)?Math.min(100,c.ing.length):0,o=[];if(Array.isArray(c.gr))for(const g of c.gr.slice(0,20)){if(Array.isArray(g)&&Number.isInteger(g[0])&&g[0]>=0&&g[0]<n&&typeof g[1]==="string"&&g[1].trim()&&(!o.length||g[0]>o[o.length-1][0]))o.push([g[0],clip(g[1].trim(),40)]);}return o;})(),
    wd:WLD[c.wd]?c.wd:"",fe:HOL[c.fe]?c.fe:"",jf:c.jf===true,kq:Array.isArray(c.kq)?KQ.filter(k=>c.kq.includes(k)):[],
    url:safeUrl(c.url),
    intro:clip(c.intro,600),serve:clip(c.serve,300),
    tips:Array.isArray(c.tips)?c.tips.filter(v=>typeof v==="string"&&v.trim()).slice(0,12).map(v=>clip(v.trim(),400)):[],
    sides:Array.isArray(c.sides)?[...new Set(c.sides.filter(v=>typeof v==="string"&&/^[a-z0-9-]{1,60}$/.test(v)))].slice(0,8):[],
    extras:Array.isArray(c.extras)?[...new Set(c.extras.filter(v=>typeof v==="string"&&/^[a-zäöå0-9][a-zäöå0-9 \-.,()%]{0,59}$/i.test(v)).map(v=>v.toLowerCase()))].slice(0,8):[],
    src:Array.isArray(c.src)?c.src.filter(v=>Array.isArray(v)&&typeof v[0]==="string"&&safeUrl(v[1])).slice(0,6).map(v=>[clip(v[0],40),safeUrl(v[1])]):[]};
}
export function cleanState(x){return aliasState(cleanState0(x));}
function cleanState0(x){
  const o={mv:2,tv:{},custom:[],lists:[],act:"",over:{},hidden:[],serv:{},prices:{},fav:[],sort:"fav",img:{},views:{},ing:{},xh:{},sp:false,rv:false,th:"auto",lay:"grid",sr:[],pv:{},pair:{},sk:{},nos:[],ix:{},ot:{},store:"",so:{},sx:{},rc:[],dv:2,vk:[],pl:PL.defaultPlan()};
  if(x&&x.sp===true)o.sp=true;
  if(x&&x.rv===true)o.rv=true;
  if(x&&(x.th==="light"||x.th==="dark"))o.th=x.th;
  if(x&&(x.lay==="grid"||x.lay==="list"))o.lay=x.lay;
  if(x&&Array.isArray(x.sr))o.sr=x.sr.filter(v=>typeof v==="string"&&v.trim()).map(v=>v.trim().slice(0,80)).slice(0,8);
  if(!x||typeof x!=="object")return o;
  const rid=new Set(R.map(r=>r.id));
  if(Array.isArray(x.custom))for(const c of x.custom.slice(0,500)){
    if(!c||typeof c.id!=="string"||!/^c[a-z0-9]{3,38}$/.test(c.id))continue;
    const f=cleanRec(c);if(f)o.custom.push({id:c.id,...f,custom:true});
  }
  if(x.sx&&typeof x.sx==="object")for(const k of Object.keys(x.sx).slice(0,40)){
    const n=typeof x.sx[k]==="string"?x.sx[k].trim().slice(0,40):"";
    if(/^o-[a-z0-9]{1,12}$/.test(k)&&n)o.sx[k]=n;
  }
  const stOk=id=>STORE_IDS.has(id)||Object.prototype.hasOwnProperty.call(o.sx,id);
  if(x.so&&typeof x.so==="object")for(const k of Object.keys(x.so)){
    const a=x.so[k];
    if(stOk(k)&&Array.isArray(a)&&a.length===19&&a.every(v=>Number.isInteger(v)&&v>=0&&v<=18)&&new Set(a).size===19)o.so[k]=a.slice();
  }
  if(typeof x.store==="string"&&stOk(x.store))o.store=x.store;
  if(Array.isArray(x.rc))for(const id of x.rc){if(typeof id==="string"&&stOk(id)&&!o.rc.includes(id)&&o.rc.length<5)o.rc.push(id);}
  if(x.ot&&typeof x.ot==="object")for(const k of Object.keys(x.ot).slice(0,150)){
    const v=x.ot[k];if(!v||typeof v!=="object"||!OT.has(k))continue;
    const e={},d=parseInt(v.d),p=+v.p,q=+v.q;
    if(d>=0&&d<=18)e.d=d;
    if(v.p!=null&&p>0&&p<10000)e.p=Math.round(p*100)/100;
    if(["g","ml","kpl"].includes(v.u)&&q>0&&q<100000){e.u=v.u;e.q=q;}
    if(Object.keys(e).length)o.ot[k]=e;
  }
  if(Array.isArray(x.hidden))o.hidden=[...new Set(x.hidden.filter(i=>rid.has(i)))];
  if(x.over&&typeof x.over==="object")for(const k of Object.keys(x.over)){
    if(!rid.has(k))continue;
    const f=cleanRec(x.over[k]);if(f){delete f.d;delete f.url;o.over[k]=f;}
  }
  const ids=new Set([...rid].filter(i=>!o.hidden.includes(i)).concat(o.custom.map(c=>c.id)));
  /* leivonnaisissa määrä on erä (½, 1 tai 2 erää kappaleina), muissa annosmäärä 2–10 */
  const recOf=k=>R.find(z=>z.id===k)||o.custom.find(z=>z.id===k);
  if(x.pv&&typeof x.pv==="object")for(const k of Object.keys(x.pv)){const n=parseInt(x.pv[k]);if(!ids.has(k))continue;const r=recOf(k);
    if(r&&(r.t==="le"||r.batch)){const sv=+((x.serv&&x.serv[k])||r.sv)||4;if([.5,2].some(m=>Math.max(1,Math.round(sv*m))===n))o.pv[k]=n;}
    else if(PCH.includes(n))o.pv[k]=n;}
  if(x.tv&&typeof x.tv==="object")for(const k of Object.keys(x.tv).slice(0,600)){
    const v=x.tv[k],r0=R.find(r=>r.id===k);if(!r0||!v||typeof v!=="object")continue;
    const e={};
    if(typeof v.v==="string"&&(r0.vs||[]).some(q=>q.id===v.v))e.v=v.v;
    if(Array.isArray(v.t)){const t=[...new Set(v.t.filter(i=>(r0.tw||[]).some(q=>q.id===i)))];if(t.length)e.t=t;}
    if(e.v||e.t)o.tv[k]=e;
  }
  const cc=a=>Array.isArray(a)?[...new Set(a.filter(i=>ids.has(i)))]:[];
  const kk=a=>Array.isArray(a)?a.filter(k=>typeof k==="string").slice(0,500):[];
  if(Array.isArray(x.lists)){
    for(const l of x.lists.slice(0,30)){
      if(!l||typeof l.id!=="string"||!/^l[a-z0-9]{3,20}$/.test(l.id)||o.lists.some(q=>q.id===l.id))continue;
      const d=/^\d{4}-\d{2}-\d{2}$/.test(l.d)?l.d:todayLocal();
      let nm=clip(l.name,40).trim();
      if(!nm||/^(su|ma|ti|ke|to|pe|la) \d{1,2}\.\d{1,2}\.( \(\d+\))?$/.test(nm))nm=mkName(d,o.lists);
      const xs=[];
      if(Array.isArray(l.x))for(const it of l.x.slice(0,100)){
        if(!it||typeof it.k!=="string"||!/^[a-zäöå0-9][a-zäöå0-9 \-.,()%]{0,59}$/i.test(it.k)||xs.some(y=>y.k===it.k))continue;
        xs.push({k:it.k,q:clip(typeof it.q==="string"?it.q:"",20)});
      }
      if(Array.isArray(l.cart)&&l.cart.includes("b68")&&!xs.some(y=>y.k==="leipä"))xs.push({k:"leipä",q:""});
      const adj={};
      if(l.adj&&typeof l.adj==="object")for(const k of Object.keys(l.adj).slice(0,200)){const n=parseInt(l.adj[k]);if(n!==0&&n>-99&&n<100&&/^[a-zäöå0-9][a-zäöå0-9 \-.,()%]{0,59}$/i.test(k))adj[k]=n;}
      const plx=Array.isArray(l.pl)?l.pl.filter(e=>e&&typeof e.id==="string"&&ids.has(e.id)&&+e.n>0&&+e.n<=200).slice(0,80).map(e=>({id:e.id,v:typeof e.v==="string"?clip(e.v,30):"",t:Array.isArray(e.t)?e.t.filter(z=>typeof z==="string"&&z.length<=30).slice(0,8):[],n:Math.round(+e.n*2)/2})):[];
      o.lists.push({id:l.id,name:nm,d,pl:plx,cart:cc(l.cart),checked:kk(l.checked),have:kk(Array.isArray(l.have)?l.have:x.have),x:xs,adj,md:(l.md==="k"||l.md==="t")?l.md:"",store:(typeof l.store==="string"&&stOk(l.store))?l.store:(l.store===undefined?o.store:"")});
    }
  }else if(Array.isArray(x.cart)&&x.cart.length){
    const d=todayLocal();
    o.lists.push({id:"l"+Date.now().toString(36)+"m",name:mkName(d,[]),d,cart:cc(x.cart),checked:kk(x.checked),have:kk(x.have),x:[]});
  }
  o.act=o.lists.some(l=>l.id===x.act)?x.act:(o.lists.length?o.lists[o.lists.length-1].id:"");
  if(x.img&&typeof x.img==="object")for(const k of Object.keys(x.img).slice(0,600))if(ids.has(k)&&/^[0-9a-f]{32}$/.test(String(x.img[k])))o.img[k]=x.img[k];
  const PRE=/^p:[a-zäöå0-9][a-zäöå0-9 \-.,()%]{0,59}$/i;
  if(x.pair&&typeof x.pair==="object")for(const k of Object.keys(x.pair).slice(0,400)){
    const v=x.pair[k];if(!ids.has(k)||!v||typeof v!=="object")continue;
    const m={};for(const q of Object.keys(v).slice(0,30)){const n=parseInt(v[q]);if((ids.has(q)||PRE.test(q))&&n>0)m[q]=Math.min(n,999);}
    if(Object.keys(m).length)o.pair[k]=m;
  }
  if(x.sk&&typeof x.sk==="object")for(const k of Object.keys(x.sk).slice(0,200)){const n=parseInt(x.sk[k]);if((ids.has(k)||PRE.test(k))&&n>0)o.sk[k]=Math.min(n,9999);}
  if(Array.isArray(x.nos))o.nos=[...new Set(x.nos.filter(i=>ids.has(i)))].slice(0,600);
  if(Array.isArray(x.fav))o.fav=[...new Set(x.fav.filter(i=>ids.has(i)))];
  if(x.views&&typeof x.views==="object")for(const k of Object.keys(x.views).slice(0,600)){const n=parseInt(x.views[k]);if(ids.has(k)&&n>0)o.views[k]=Math.min(n,99999);}
  if(["fav","cheap","fast","abc","views"].includes(x.sort))o.sort=x.sort;
  if(x.serv&&typeof x.serv==="object")for(const k of Object.keys(x.serv)){
    const n=parseInt(x.serv[k]);
    if(ids.has(k)&&n>=1&&n<=24&&n!==defServ(k))o.serv[k]=n;
  }
  if(x.prices&&typeof x.prices==="object")for(const k of Object.keys(x.prices).slice(0,300)){
    const v=x.prices[k];
    if(!v||typeof v!=="object"||!/^[a-zäöå0-9][a-zäöå0-9 \-.,()%]{0,59}$/i.test(k))continue;
    const p=+v.p;
    if(!(p>0&&p<10000)||!["kg","l","kpl"].includes(v.per))continue;
    o.prices[k]={p:Math.round(p*100)/100,per:v.per,url:safeUrl(v.url||""),date:/^\d{4}-\d{2}-\d{2}$/.test(v.date)?v.date:todayIso()};
  }
  const NMRE=/^[a-zäöå0-9][a-zäöå0-9 \-.,()%]{0,59}$/i,SYRE=/^[\p{L}\p{N}][\p{L}\p{N} \-.,()%]{0,59}$/u;
  const ingClean=(k,v,mig,isIx)=>{
    const d0=parseInt(v.d);if(!(d0>=0&&d0<=(mig?9:18)))return null;
    const d=mig?migDept(k,d0):d0;
    const mm=String(v.m||""),mb=mm.replace("?","");
    const e={d,m:(M[mb]&&mb!=="v")?(isIx&&mm.endsWith("?")?mm:mb):""};
    if(mig?d0===7:v.pan===true)e.pan=true;
    const lim=(a,mx)=>{const q=+a;return isFinite(q)&&q>=0&&q<=mx?Math.round(q*100)/100:null;};
    if(v.n&&typeof v.n==="object"){
      const kc=lim(v.n.kcal,900);
      if(kc!=null)e.n={kcal:kc,prot:lim(v.n.prot,100)||0,fat:lim(v.n.fat,100)||0,sat:lim(v.n.sat,100)||0,carb:lim(v.n.carb,100)||0,salt:lim(v.n.salt,100)||0};
    }
    if(v.u&&typeof v.u==="object"){
      const u={dl:lim(v.u.dl,300)||0,kpl:lim(v.u.kpl,5000)||0,prk:lim(v.u.prk,5000)||0,pss:lim(v.u.pss,5000)||0,nippu:lim(v.u.nippu,5000)||0};
      if(isIx){u.rkl=lim(v.u.rkl,100)||0;u.tl=lim(v.u.tl,100)||0;}
      if(Object.values(u).some(x=>x))e.u=u;
    }
    const su=safeUrl(v.url||"");if(su)e.url=su;
    if(Array.isArray(v.syn)){
      const sy=[];
      for(const s0 of v.syn.slice(0,30)){const t=typeof s0==="string"?s0.trim().toLowerCase().replace(/\s+/g," "):"";if(SYRE.test(t)&&t!==k&&!sy.includes(t))sy.push(t);}
      if(sy.length||isIx)e.syn=sy.slice(0,12);
    }
    if(Array.isArray(v.pk)){
      const q=+v.pk[0];
      if(!v.pk.length)e.pk=[];
      else if(q>0&&q<=100000&&["g","ml","kpl"].includes(v.pk[1]))e.pk=[Math.round(q*10)/10,v.pk[1]];
    }
    return e;
  };
  if(x.ing&&typeof x.ing==="object")for(const k of Object.keys(x.ing).slice(0,300)){
    const v=x.ing[k];
    if(!v||typeof v!=="object"||!NMRE.test(k))continue;
    const e=ingClean(k,v,x.dv!==2,false);if(e)o.ing[k]=e;
  }
  if(x.ix&&typeof x.ix==="object")for(const k of Object.keys(x.ix).slice(0,300)){
    const v=x.ix[k];
    if(!v||typeof v!=="object"||!CBYK.has(k))continue;
    const e=ingClean(k,v,false,true);if(e)o.ix[k]=e;
  }
  if(x.xh&&typeof x.xh==="object")for(const k of Object.keys(x.xh).slice(0,200)){const n=parseInt(x.xh[k]);if(n>0&&/^[a-zäöå0-9][a-zäöå0-9 \-.,()%]{0,59}$/i.test(k))o.xh[k]=Math.min(n,9999);}
  /* kotitalous ja viikkosuunnitelma */
  const okIso=v=>typeof v==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(v);
  if(Array.isArray(x.vk))o.vk=[...new Set(x.vk.filter(k=>typeof k==="string"&&/^[a-zäöå0-9][a-zäöå0-9 \-.,()%]{0,39}$/i.test(k)).map(k=>k.toLowerCase()))].slice(0,30);
  if(x.pl&&typeof x.pl==="object"&&Array.isArray(x.pl.items)){const p=x.pl,q=o.pl;
    {const n=parseInt(p.sv);if(n>=2&&n<=16)q.sv=n;}
    {const ba=+p.ba;if(ba>0&&ba<=10000)q.ba=Math.round(ba*100)/100;}
    const TG=new Set(PL.TAGS.map(t=>t[0]));
    q.items=p.items.slice(0,10).map(it=>{const e={id:"",v:"",tg:[]};if(!it||typeof it!=="object")return e;if(typeof it.id==="string"&&ids.has(it.id))e.id=it.id;if(e.id&&typeof it.v==="string")e.v=clip(it.v,30);if(Array.isArray(it.tg))e.tg=PL.normTags(it.tg.filter(t=>typeof t==="string"));if(it.lk&&e.id)e.lk=1;if(!e.id)return e;
      const sl=(a,f)=>Array.isArray(a)?[...new Set(a.filter(z=>typeof z==="string"&&f(z)))].slice(0,8):[];
      e.t=sl(it.t,z=>z.length<=30);e.sd=sl(it.sd,z=>ids.has(z.split(":")[0])&&z.length<=70);e.px=sl(it.px,z=>/^[a-zäöå0-9][a-zäöå0-9 \-.,()%]{0,39}$/i.test(z));
      {const n=Math.round(+it.n);if(n>=1&&n<=20)e.n=n;}return e;});
    q.n=q.items.length;
    if(p.sn&&typeof p.sn==="object")for(const k of Object.keys(p.sn).slice(0,40)){const n=Math.round(+p.sn[k]*2)/2;if(ids.has(k)&&n>0&&n<=100)q.sn[k]=n;}
    if(Array.isArray(p.bk))q.bk=[...new Set(p.bk.filter(k=>typeof k==="string"&&ids.has(k)))].slice(0,10);
    if(Array.isArray(p.vo))q.vo=p.vo.filter(k=>o.vk.includes(k));
  }
  return o;
}
export function lsLoad(){try{const v=localStorage.getItem(LS);return v?JSON.parse(v):null;}catch(e){return null;}}
function lsSave(){try{localStorage.setItem(LS,JSON.stringify(state));}catch(e){}}
async function flush(){
  saving=true;
  try{while(dirty&&remote){dirty=false;await remote.set({json:JSON.stringify(state)});}}
  catch(e){remote=null;}
  saving=false;
}
export function persist(){lsSave();if(!remote)return;dirty=true;if(!saving)flush();}
export function applyTheme(){const t=state.th||"auto",d=t==="dark"||(t==="auto"&&window.matchMedia&&matchMedia("(prefers-color-scheme:dark)").matches);document.documentElement.dataset.theme=d?"dark":"light";document.querySelectorAll("[data-th]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.th===(state.th||"auto")));applyLay();}
try{matchMedia("(prefers-color-scheme:dark)").addEventListener("change",applyTheme);}catch(e){}
const BAR={plan:"Seuraavat ruoat",ideas:"Ruokaideat",add:"Lisää oma ruoka",cart:"Ostoslistat",reg:"Ainesosarekisteri"};
export function setBar(n,t){document.body.dataset.view=n;$("ttl").textContent=t||BAR[n];}
export function mutate(){touched=true;persist();try{updBadge();}catch(e){}}

async function initRemote(){
  try{
    const[db,user]=await Promise.all([claude.use("db"),claude.use("user")]);
    if(!db||!user)return;
    const id=await user.id();
    if(!id)return;
    const ref=db.collection("data/users/"+id).doc("ruokaideat");
    const snap=await ref.get();
    remote=ref;
    if(snap.exists&&!touched){
      const j=snap.data()&&snap.data().json;
      if(j){state=cleanState(JSON.parse(j));applyOtx();lsSave();applyTheme();renderIdeas();refreshCart();}
    }else if(touched||state.custom.length||state.cart.length){persist();}
  }catch(e){remote=null;}
}
export function startRemote(tries){
  if(window.claude&&typeof window.claude.use==="function"){initRemote();return;}
  if(tries>0)setTimeout(()=>startRemote(tries-1),1000);
}
