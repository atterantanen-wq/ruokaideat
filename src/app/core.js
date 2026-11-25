/* perusvakiot, suodattimien nimet, kuvakkeet, apufunktiot ja reseptikirjasto (R) */
import {LIB} from "../data/library/index.js";
import {fromLib} from "../recipes.js";

export const S={e:"Edullinen",k:"Kevyt",ai:"Airfryer",gl:"Grilli"};
export const A={a:"Arkiruoka",j:"Viikonloppu ja juhla",b:"Aamu-, väli- ja iltapalat",l:"Leivonta"};
export const T={pa:"Pata",ki:"Kiusaus",ke:"Keitto",uu:"Uuniruoka",pn:"Pannulla",ps:"Pasta ja riisi",pu:"Puuro",am:"Aamiainen",sa:"Salaatti",le:"Leivonta",ja:"Jälkiruoka",li:"Lisuke",wo:"Wokit ja nuudelit",pi:"Pizza",ha:"Hampurilaiset ja täytetyt leivät",vp:"Välipala",al:"Alkupala"};
export const M={j:"Jauheliha",k:"Kana",f:"Kala",p:"Porsas",n:"Nauta",s:"Makkara",v:"Kasvis",e:"Muna",y:"Kasviproteiini"};

export const TIME={"10":"Enintään 10 min","20":"Enintään 20 min","30":"Enintään 30 min","31":"Yli 30 min"};
export const WLD={it:"Italialainen",tm:"Texmex",as:"Aasialainen",in:"Intialainen",am:"Amerikkalainen",vm:"Välimeri"};
export const HOL={jo:"Joulu",pa:"Pääsiäinen",ju:"Juhannus",va:"Vappu"};
export const KQ=["ai","gl"];
export const FK=["a","m","s","v","w","t","f"];
/* suodattimet, jotka näkyvät vasta kun ainakin yhdellä reseptillä on arvo */
const HZ=new Set(["m:e","m:y","s:ai","s:gl","t:wo","t:pi","t:ha","t:vp","t:al"]);
export const hide0=(g,c)=>g==="w"||g==="f"||HZ.has(g+":"+c);
export const XLIM={t:12};
const WORDS_WD=[["tm",/taco|tortilla|burrito|fajita|nacho|quesadilla|chili con|texmex|tex-mex/],["it",/pizza|pasta|spagetti|lasagne|risotto|bolognese|carbonara|gnocchi|penne|tagliatelle|pesto/],["in",/curry|\btikka|masala|korma|butter chicken|\bdal\b|biryani|\bnaan/],["as",/wok|nuudeli|ramen|sushi|pad thai|dumpling|kimchi|teriyaki|bibimbap|pho\b/],["am",/hampurilais|burger|hot dog|bbq|pulled/],["vm",/kreikka|tsatsiki|tzatziki|souvlaki|gyros|hummus|falafel|paella|ratatouille|moussaka/]];
export const suggestWd=n=>{const t=String(n||"").toLowerCase();for(const[c,re]of WORDS_WD)if(re.test(t))return c;return"";};

export const $=id=>document.getElementById(id);
export const IC={users:'<circle cx="9" cy="8" r="3.2"/><path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><circle cx="17.5" cy="9" r="2.5"/><path d="M17 14c2.5 0 4.5 1.7 4.5 4.5"/>',eye:'<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',basket:'<path d="M3 9h18l-1.8 10a2 2 0 0 1-2 1.7H6.8a2 2 0 0 1-2-1.7L3 9z"/><path d="M8 9l3-5M16 9l-3-5"/>',chef:'<path d="M7 14.5a4 4 0 1 1 1.5-7.7 4 4 0 0 1 7 0A4 4 0 1 1 17 14.5V19H7z"/><path d="M7 16.5h10"/>',flame:'<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.2 2-4 .3 1.3 1 2 1.8 2.2C11 8.5 11 5.5 12 3z"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',download:'<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19h14"/>',upload:'<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M5 19h14"/>',play:'<path d="M8 5.5v13l10.5-6.5z"/>',left:'<path d="M15 5l-7 7 7 7"/>',right:'<path d="M9 5l7 7-7 7"/>',timer:'<circle cx="12" cy="13.5" r="7"/><path d="M12 10v3.8l2.4 1.6M9.5 3h5"/>',list:'<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',tlist:'<path d="M9 6h11M9 12h11M9 18h11"/><path d="M3.5 6l1.2 1.2L6.8 5M3.5 12l1.2 1.2L6.8 11M3.5 18l1.2 1.2L6.8 17"/>',star:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.7l1-5.9L3.5 9.7l5.9-.8z"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',copy:'<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15"/>',share:'<circle cx="6" cy="12" r="2.2"/><circle cx="18" cy="6" r="2.2"/><circle cx="18" cy="18" r="2.2"/><path d="M8 11l8-4M8 13l8 4"/>',dots:'<circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/>',heart:'<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z"/>',plus:'<path d="M12 5v14M5 12h14"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',pencil:'<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',up:'<path d="M12 19V5M6 11l6-6 6 6"/>',down:'<path d="M12 5v14M6 13l6 6 6-6"/>',chev:'<path d="M6 9l6 6 6-6"/>',alert:'<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17.5v.01"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'};
export const ico=n=>`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;
export const cartInner=on=>ico(on?"check":"tlist")+"<span>"+(on?"Ostoslistalla":"Lisää ostoslistalle")+"</span>";
export const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const clip=(s,n)=>String(s==null?"":s).slice(0,n);
/* reseptikirjasto: ks. src/data/library ja src/recipes.js */
export const R=LIB.map(fromLib);
export const isPop=r=>!!r.pop;
export const workOf=r=>r.w>0?r.w:0;
export const defServ=id=>{const r=R.find(x=>x.id===id);return r&&r.sv||4;};

/* ---------- apurit: linkit, ainekset ---------- */
export function safeUrl(u){
  u=String(u||"").trim();
  if(!u)return"";
  if(!/^[a-z][a-z0-9+.-]*:/i.test(u))u="https://"+u;
  try{const x=new URL(u);return(x.protocol==="http:"||x.protocol==="https:")?x.href:"";}catch(e){return"";}
}
export const host=u=>{try{return new URL(u).hostname.replace(/^www\./,"");}catch(e){return"";}};
const UN="(?:kg|g|dl|ml|cl|l|rkl|tl|kpl|prk|pss|nippu|pkt|rs|tlk|ruukku|ripaus)";
const reA=new RegExp("^(.+?)\\s+(\\d+(?:[.,]\\d+)?)\\s*("+UN+")?(?![a-zäöå])\\s*$","i");
const reB=new RegExp("^(\\d+(?:[.,]\\d+)?)\\s*("+UN+")?(?![a-zäöå])\\s+(.+)$","i");
export const SYN={"kerma":"ruokakerma","pippuri":"mustapippuri"};
export const USYN=new Map();
const num=s=>parseFloat(String(s).replace(",","."));
function norm(q,u){
  switch(u){
    case"kg":return{fam:"g",v:q*1000};
    case"g":return{fam:"g",v:q};
    case"l":return{fam:"ml",v:q*1000};
    case"dl":return{fam:"ml",v:q*100};
    case"cl":return{fam:"ml",v:q*10};
    case"ml":return{fam:"ml",v:q};
    case"":return{fam:"kpl",v:q};
    default:return{fam:u,v:q};
  }
}
export function parseIng(line){
  line=String(line).trim();
  let name=line,q=null,u="",m;
  if((m=line.match(reA))){name=m[1];q=num(m[2]);u=(m[3]||"").toLowerCase();}
  else if((m=line.match(reB))){q=num(m[1]);u=(m[2]||"").toLowerCase();name=m[3];}
  name=name.replace(/\s+/g," ").trim().replace(/[,;:]+$/,"");
  /* tarkenne sulkeissa nimen lopussa: "valkosipulituorejuusto (tai tavallinen)" -> alt = myös pohjatuote käy */
  let kn=name,alt=false;const pm=name.match(/^(.+?)\s*\(([^()]*)\)$/);
  if(pm){kn=pm[1];alt=/(^|\s)tai(\s|$)/i.test(pm[2]);}
  let key=kn.toLowerCase();key=SYN[key]||USYN.get(key)||key;
  const label=key.charAt(0).toUpperCase()+key.slice(1);
  let fam="",v=null;
  if(q!=null&&isFinite(q)){const n=norm(q,u);fam=n.fam;v=n.v;}else q=null;
  return{key,name:label,rawName:name,q,u,fam,v,alt};
}
export const fmtNum=v=>String(Math.round(v*10)/10).replace(".",",");
export function fmt(fam,v){
  if(fam==="g")return v>=1000?fmtNum(v/1000)+" kg":fmtNum(v)+" g";
  if(fam==="ml"){if(v>=1000)return fmtNum(v/1000)+" l";if(v>=100)return fmtNum(v/100)+" dl";return fmtNum(v)+" ml";}
  return fmtNum(v)+" "+fam;
}
export function ingText(p){
  if(p.q==null)return p.rawName;
  return(p.u?fmtNum(p.q)+" "+p.u:fmtNum(p.q)+" ×")+" "+p.rawName;
}

/* Avoimet ikkunat ja ostoslistan näkymä ovat "kerroksia". Kun kerros on auki, selainhistoriassa on yksi
   ylimääräinen merkintä, joten puhelimen takaisin-painike tai iPhonen pyyhkäisy sulkee päällimmäisen
   kerroksen eikä poistu sovelluksesta.
   Ikkunan avaus kosketuksella tai hiirellä kohdistaa ikkunaan itseensä eikä ensimmäiseen painikkeeseen,
   jottei näppäimistökäytön kohdistusrengas näy turhaan. Näppäimistöllä avattaessa selain kohdistaa kuten ennenkin. */
{
  let byPointer=false,hasEntry=false,ignore=0,pending=false;
  addEventListener("pointerdown",()=>{byPointer=true;},true);
  addEventListener("keydown",()=>{byPointer=false;},true);
  const open=[];
  const listOpen=()=>document.body.classList.contains("inlist");
  const layers=()=>open.length+(listOpen()?1:0);
  /* tarkistus viiveellä: ikkunan vaihto toiseen (sulje + avaa samassa tapahtumassa) ei liikuta historiaa */
  const sync=()=>{
    if(pending)return;pending=true;
    setTimeout(()=>{
      pending=false;
      const n=layers();
      if(n&&!hasEntry){history.pushState({ly:1},"");hasEntry=true;}
      else if(!n&&hasEntry){hasEntry=false;ignore++;history.back();}
    },0);
  };
  const sm=HTMLDialogElement.prototype.showModal;
  HTMLDialogElement.prototype.showModal=function(){
    sm.call(this);
    if(byPointer){if(!this.hasAttribute("tabindex"))this.tabIndex=-1;this.focus({preventScroll:true});}
    if(!open.includes(this)){
      open.push(this);
      this.addEventListener("close",()=>{const i=open.indexOf(this);if(i>=0)open.splice(i,1);sync();},{once:true});
    }
    sync();
  };
  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:["class"]});
  addEventListener("popstate",()=>{
    if(ignore){ignore--;return;}
    hasEntry=false;
    const top=open[open.length-1];
    if(top)top.close();
    else if(listOpen()){const b=document.querySelector('[data-lst="back"]');if(b)b.click();}
    sync();
  });
}
