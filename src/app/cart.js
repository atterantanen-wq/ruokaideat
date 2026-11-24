/* ostoslistan laskenta: kaupat ja osastojärjestys, muut tuotteet, pakkaukset, listan rivit ja valikot */
import {DEPS,DEPMAP,DEPSUB} from "./price-updates.js";
import {$,ico,esc,clip,parseIng,fmtNum,fmt} from "./core.js";
import {PR,PU,PALIAS} from "./prices.js";
import {CIDX,rebuildCat,catFind,fold,gramsOf,baseKey,findPrice,pantryHit,isSkip,costOf,eur,ingOf} from "./catalog.js";
import {todayLocal,mkName,actList,state,mutate} from "./state.js";
import {byId} from "./ideas.js";
import {openAdd} from "./cart-add.js";
import {refreshCart,listStats,renderCart} from "./cart-view.js";
import {dlg} from "./info.js";
import {ingFor} from "./plan-view.js";
import {STORE_P,STORE_S,STORE_L,STORE_K,STORE_KS} from "../data/stores.js";
import {LOGO} from "../data/logos.js";

/* ---------- ostoslista ---------- */
export function shopping(cart,extra){
  const map=new Map();
  const src=[];
  for(const id of (cart||state.cart)){const r=byId(id);if(r)src.push([r,ingOf(r)]);}
  for(const x of extra||[])src.push([x.r,x.lines]);
  for(const [r,lines] of src){
    for(const line of lines){
      const p=parseIng(line);
      if(p.key==="vesi"||p.key==="vettä")continue;
      const ck=state.ing[p.key]||PR[p.key]||!CIDX.has(p.key)?p.key:CIDX.get(p.key).key;
      let e=map.get(ck);
      if(!e){e={key:ck,name:ck.charAt(0).toUpperCase()+ck.slice(1),amts:new Map(),from:[],open:false,per:new Map()};map.set(ck,e);}
      if(!e.from.includes(r.name))e.from.push(r.name);
      let pm=e.per.get(r.name);if(!pm){pm=new Map();e.per.set(r.name,pm);}
      if(p.v==null)e.open=true;else{e.amts.set(p.fam,(e.amts.get(p.fam)||0)+p.v);pm.set(p.fam,(pm.get(p.fam)||0)+p.v);}
    }
  }
  return[...map.values()].sort((a,b)=>a.name.localeCompare(b.name,"fi"));
}
/* kaupat: s-kaupat.fi 20.11.2026 (Prisma 84 ruokakauppaa, S-market 467), lidl.fi 20.11.2026 (Lidl 209), k-ruoka.fi 20.11.2026 (K-Citymarket 85, K-Supermarket 256). Muodossa nimi|kunta */
const slug=t=>t.toLowerCase().replace(/ä/g,"a").replace(/ö/g,"o").replace(/å/g,"a").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const STORE_TYPES=[{id:"s-market",n:"Kaikki S-marketit"},{id:"prisma",n:"Kaikki Prismat"},{id:"lidl",n:"Kaikki Lidlit"},{id:"k-citymarket",n:"Kaikki K-Citymarketit"},{id:"k-supermarket",n:"Kaikki K-Supermarketit"},{id:"k-market",n:"Kaikki K-Marketit"}];
const mkSt=(pre,t)=>l=>{const i=l.lastIndexOf("|");const n=l.slice(0,i);return{id:pre+slug(n),n,c:l.slice(i+1),t};};
const STORES=[...STORE_TYPES.map(x=>({id:x.id,n:x.n,c:"",t:x.id,type:true})),...STORE_P.split(";").map(mkSt("pr-","prisma")),...STORE_S.split(";").map(mkSt("sm-","s-market")),...(()=>{const r=STORE_L.split(";").map(mkSt("ld-","lidl")),s=x=>x.n.replace(/\s\d+(?:-\d+)?(?:\s?[A-Za-z])?$/,""),cnt={};r.forEach(x=>{const k=s(x);cnt[k]=(cnt[k]||0)+1;});return r.map(x=>cnt[s(x)]===1?{...x,n:s(x)}:x);})(),...STORE_K.split(";").map(mkSt("kc-","k-citymarket")),...STORE_KS.split(";").map(mkSt("ks-","k-supermarket"))];
export const STORE_IDS=new Set(STORES.map(x=>x.id));
const STORE_BY=new Map(STORES.map(x=>[x.id,x]));
const DEFORD=DEPS.map((_,i)=>i);
/* valmiit kauppatyyppien järjestykset (käyttäjän antama Lidlin kulkujärjestys); omat muutokset ohittavat nämä */
const TYPE_ORD={"lidl":[0,1,2,3,4,5,6,7,10,12,15,11,14,13,16,9,8,17,18]};
const typeDef=t=>TYPE_ORD[t]||DEFORD;
function typeOfName(n){
  const f=fold(n);
  if(/^lidl/.test(f))return"lidl";
  if(/^prisma/.test(f))return"prisma";
  if(/citymarket/.test(f))return"k-citymarket";
  if(/^k-?\s?supermarket|^k-?\s?super/.test(f))return"k-supermarket";
  if(/^k-?\s?market/.test(f))return"k-market";
  if(/(^|[^a-z])s-?market/.test(f))return"s-market";
  return"";
}
export const typeOf=id=>{if(!id)return"";const b=STORE_BY.get(id);if(b)return b.t;return state.sx[id]?typeOfName(state.sx[id]):"";};
export const storeName=id=>{if(!id)return"Oletusjärjestys";const b=STORE_BY.get(id);return b?b.n:(state.sx[id]||"Oletusjärjestys");};
const storeOrder=id=>(id&&(state.so[id]||state.so[typeOf(id)]||TYPE_ORD[typeOf(id)]))||DEFORD;
/* osasto 6 (Mausteet ja liemet) = vähän kuluvat; vanha omien ainesten numerointi 0–9 siirretään uuteen 0–18 */
export function migDept(k,d){
  switch(d){
    case 0:return 0;
    case 1:return /kala|lohi|silakka|turska|siika|katkarap|rapu|tonnikala|äyriä/.test(k)?12:/makkara|nakki|kinkku|leikkele|salami|pekoni|kassler|palvi/.test(k)?11:10;
    case 2:return /juusto|tofu|feta|mozzarella|halloumi|parmesaani|ricotta/.test(k)?14:13;
    case 3:return /leipä|sämpylä|patonki|pulla|tortilla|pita|näkki|korppu|bagel|croissant/.test(k)?1:3;
    case 4:return 16;
    case 5:return /jauho|sokeri|kaakao|suklaa|soda|pähkin|siemen|rusina|hiiva|leivin|tärkkelys|mantel|hunaja/.test(k)?3:/linssi|papu|pavut|herne|kikher/.test(k)?4:2;
    case 6:return /hillo|marmeladi|sose|hyytelö|levite/.test(k)?5:/ketsup|sinappi|majoneesi|kastike|pesto|salsa|tahini|tahna|sriracha/.test(k)?7:4;
    case 7:return /öljy|etikka|kastike/.test(k)?7:6;
    case 8:return /vesi|mehu|juoma|kahvi|tee|olut|viini|siideri|limonadi|kivennäis/.test(k)?9:/keksi|karkki|suklaa|sipsi|makea/.test(k)?8:18;
    case 9:return 17;
  }
  return 18;
}
/* muut ostokset: ehdotukset ja tuoteryhmät */
export const XSUG=[["banaanit",0],["omenat",0],["appelsiinit",0],["mandariinit",0],["viinirypäleet",0],["tomaatit",0],["kurkku",0],["paprika",0],["salaatti",0],["avokado",0],["sitruuna",0],["leikkeleet",11],["kinkku",11],["nakit",11],["grillimakkara",11],["savulohi",12],["maito",13],["piimä",13],["jogurtti",13],["rahka",13],["kefiiri",13],["kermaviili",13],["juusto",14],["raejuusto",14],["levite",13],["kananmunat",13],["ruisleipä",1],["paahtoleipä",1],["vaalea leipä",1],["sämpylät",1],["patonki",1],["pulla",1],["näkkileipä",1],["valmispizza",15],["valmisruoat",15],["pakastevihannekset",16],["pakastemarjat",16],["kalapuikot",16],["jäätelö",16],["mysli",2],["murot",2],["kahvi",9],["tee",9],["nuudelit",2],["pähkinät",3],["ketsuppi",7],["sinappi",7],["majoneesi",7],["hillo",5],["valmiskastike",7],["valmiskeitto",4],["etikka",7],["hunaja",3],["maustesekoitus",6],["mehu",9],["virvoitusjuoma",9],["kivennäisvesi",9],["keksit",8],["suklaa",8],["karkit",8],["sipsit",8],["wc-paperi",17],["talouspaperi",17],["astianpesuaine",17],["pyykinpesuaine",17],["huuhteluaine",17],["hammastahna",17],["käsisaippua",17],["shampoo",17],["suihkugeeli",17],["roskapussit",17],["leivinpaperi",17],["alumiinifolio",17],["pesusieni",17],["kosteuspyyhkeet",17]];
export const XD=Object.fromEntries(XSUG);
Object.assign(XD,{"leipä":1,"olut":9,"kaurajuoma":13,"viili":13,"kerma":13});
/* ---------- Muut tuotteet: sama tietuemuoto kuin ainesrekisterissä, mutta oma lista ----------
   tietue: k nimi, d osasto, q pakkauksen koko, u g | ml | kpl, p pakkauksen hinta €, note tuote ja lähde, path hakupolku s-kaupat.fi, w heikon arvion syy, syn synonyymit, lbl pakkausteksti */
export const OT=new Map(),OTS=new Map();
function O(k,d,q,u,p,note,path,w,syn,lbl){
  const o={k,d,q,u,p,note,path,w:w||"",syn:syn||[],lbl:lbl||"",dt:"2026-11-19"};
  o.b={d,q,u,p:p==null?null:p,lbl:lbl||"",w:w||""};
  OT.set(k,o);OTS.set(k,o);for(const s of o.syn)if(!OTS.has(s))OTS.set(s,o);
  XD[k]=d;for(const s of o.syn)if(!Object.prototype.hasOwnProperty.call(XD,s))XD[s]=d;
  if(!XSUG.some(x=>x[0]===k))XSUG.push([k,d]);
}
export const otOf=k=>OTS.get(k)||null;
/* omat muutokset valmiisiin Muut tuotteet -tuotteisiin: state.ot[k]={d,p,q,u}, alkuperäinen säilyy o.b:ssä */
export function applyOtx(){
  rebuildCat();
  const ov=state.ot||{};
  for(const o of OT.values()){
    const b=o.b,x=ov[o.k]||{};
    o.d=x.d!=null?x.d:b.d;
    o.p=x.p!=null?x.p:b.p;
    if(x.q!=null){o.q=x.q;o.u=x.u;o.lbl="";}else{o.q=b.q;o.u=b.u;o.lbl=b.lbl;}
    o.w=x.p!=null?"":b.w;
    o.ov=!!ov[o.k];
    XD[o.k]=o.d;for(const s of o.syn)if(OTS.get(s)===o)XD[s]=o.d;
    const xs=XSUG.find(z=>z[0]===o.k);if(xs)xs[1]=o.d;
  }
}
/* pakkaushinta: oma tai johdettu aineksen hinnasta (näin hinta on vain yhdessä paikassa ja omat hinnat vaikuttavat) */
export function otP(o){
  if(o.p!=null)return o.p;
  const e=findPrice(o.k);if(!e)return null;
  if((e.per==="kg"&&o.u==="g")||(e.per==="l"&&o.u==="ml"))return e.p*o.q/1000;
  if(e.per==="kpl"&&o.u==="kpl")return e.p*o.q;
  return null;
}
export const otPack=o=>o.lbl||(o.u==="kpl"?fmtNum(o.q)+" kpl":(o.u==="ml"?(o.q>=1000?fmtNum(o.q/1000)+" l":fmtNum(o.q)+" ml"):(o.q>=1000?fmtNum(o.q/1000)+" kg":fmtNum(o.q)+" g")));
export const otUnit=o=>{const p=otP(o);return p==null?null:o.u==="kpl"?(o.q>1?p/o.q:null):p/o.q*1000;};
O("banaanit",0,1000,"g",null,"Banaani, irto","hedelmat-ja-vihannekset/hedelmat","",["banaani"],"");
O("omenat",0,1000,"g",null,"Omenat, irto","hedelmat-ja-vihannekset/hedelmat","",["omena"],"");
O("appelsiinit",0,1000,"g",null,"Appelsiini","hedelmat-ja-vihannekset/hedelmat","",["appelsiini"],"");
O("mandariinit",0,1000,"g",null,"Satsuma 1 kg","hedelmat-ja-vihannekset/hedelmat","",["mandariini", "satsuma", "satsumat"],"");
O("viinirypäleet",0,500,"g",null,"Siemenetön viinirypäle 500 g","hedelmat-ja-vihannekset/hedelmat","",["viinirypäle", "rypäleet"],"");
O("tomaatit",0,500,"g",null,"Tomaatti, irto","hedelmat-ja-vihannekset/vihannekset/tomaatit","",["tomaatti"],"");
O("kurkku",0,1,"kpl",1.22,"Kotimainen kurkku, noin 350 g","hedelmat-ja-vihannekset/vihannekset","",[],"");
O("paprika",0,1,"kpl",1.4,"Paprika, noin 200 g","hedelmat-ja-vihannekset/vihannekset","",["paprikat"],"");
O("salaatti",0,1,"kpl",1.99,"Ruukkusalaatti 125 g","hedelmat-ja-vihannekset/vihannekset","",["ruukkusalaatti"],"");
O("avokado",0,1,"kpl",1.48,"Avokado, noin 200 g","hedelmat-ja-vihannekset/hedelmat","",["avokadot"],"");
O("sitruuna",0,1,"kpl",null,"Sitruuna","hedelmat-ja-vihannekset/hedelmat","",["sitruunat"],"");
O("leikkeleet",11,200,"g",2.79,"Kinkku- ja kalkkunaleikkeleet 200 g, mediaani","liha-ja-kasviproteiinit/kinkut-ja-leikkeleet","",["leikkele", "kinkkuleikkele"],"");
O("kinkku",11,300,"g",null,"Leikkeleet: ohut savukinkku","liha-ja-kasviproteiinit/kinkut-ja-leikkeleet","",[],"");
O("nakit",11,280,"g",null,"Makkarat (lenkki- ja siskonmakkara)","liha-ja-kasviproteiinit/makkarat","",["nakki"],"");
O("grillimakkara",11,400,"g",null,"Makkarat (lenkki- ja siskonmakkara)","liha-ja-kasviproteiinit/makkarat","",["makkara"],"");
O("savulohi",12,200,"g",5.98,"Savulohi 100–400 g","kala-ja-merenelavat/kala","",[],"");
O("maito",13,1000,"ml",null,"Maidot (kevyt- ja täysmaito)","maito-munat-ja-rasvat/maidot","",[],"1 l");
O("piimä",13,1000,"ml",null,"Piimä 1 l","maito-munat-ja-rasvat/maidot","",[],"1 l");
O("jogurtti",13,1000,"g",null,"Turkkilainen ja kreikkalainen jogurtti","maito-munat-ja-rasvat/jogurtit","",["jugurtti"],"");
O("rahka",13,250,"g",null,"Maitorahka (maustamaton)","maito-munat-ja-rasvat/rahkat","",["maitorahka"],"");
O("kefiiri",13,500,"g",2.19,"Meijeriliike Aito kefiiri 500 g","maito-munat-ja-rasvat/maidot","",[],"");
O("kermaviili",13,200,"g",null,"Kermaviilit","maito-munat-ja-rasvat/kermaviilit","",[],"");
O("juusto",14,400,"g",null,"Juusto, hinta perustuu raasteisiin","juustot-tofut-ja-kasvipohjaiset","Hinta perustuu raastejuuston hintaan.",["juustoa"],"");
O("raejuusto",14,200,"g",null,"Raejuusto 200 g","juustot-tofut-ja-kasvipohjaiset","",[],"");
O("levite",13,600,"g",2.49,"Flora normaalisuolainen 600 g","maito-munat-ja-rasvat/rasvat/margariinit","",["margariini", "voileipälevite"],"");
O("kananmunat",13,10,"kpl",null,"Kananmunat (vapaan kanan, M)","maito-munat-ja-rasvat/munat","",["kananmuna", "munat"],"10 kpl");
O("ruisleipä",1,450,"g",1.98,"Ruisleivät, hinta 4,39 € / kg","leivat-ja-leivonnaiset/leivat","",[],"");
O("paahtoleipä",1,500,"g",2.1,"Paahtoleivät, hinta 4,20 € / kg","leivat-ja-leivonnaiset/leivat","",[],"");
O("vaalea leipä",1,500,"g",2.1,"Vaalea paahtoleipä, hinta 4,20 € / kg","leivat-ja-leivonnaiset/leivat","",["vehnäleipä"],"");
O("sämpylät",1,420,"g",2.55,"Aamiaissämpylät 7 kpl","leivat-ja-leivonnaiset/leivat","",["sämpylä"],"7 kpl");
O("patonki",1,250,"g",1.1,"Patonki, noin 250 g","leivat-ja-leivonnaiset/leivat","Arvio, tuotetta ei löytynyt verkkokaupasta.",[],"1 kpl");
O("pulla",1,400,"g",3.29,"Pullapitko 400 g, hinta 8,23 € / kg","leivat-ja-leivonnaiset/leivonnaiset","",["pullat", "pitko"],"");
O("näkkileipä",1,250,"g",2.33,"Näkkileivät, hinta 9,30 € / kg","leivat-ja-leivonnaiset/nakkileivat-hapankorput-ja-krutongit","",["näkkäri"],"");
O("valmispizza",15,350,"g",3.5,"Pakastepizza (arvio)","pakasteet/pizzat-ja-piiraat","Arvio, tuotetta ei haettu erikseen.",["pakastepizza", "pizza"],"1 kpl");
O("valmisruoat",15,400,"g",4.0,"Valmisruoka-annos (arvio)","valmisruoka","Arvio, tuotetta ei haettu erikseen.",["valmisruoka", "mikroateria"],"1 annos");
O("pakastevihannekset",16,600,"g",2.62,"Pakastevihannekset, hinta 4,37 € / kg","pakasteet/kasvispakasteet","",["pakastevihannes"],"");
O("pakastemarjat",16,500,"g",8.24,"Pakastemarjat, hinta 16,47 € / kg","pakasteet/hedelma-ja-marjapakasteet","",["pakastemarja"],"");
O("kalapuikot",16,450,"g",null,"Pakasteet: peruskalapuikot","pakasteet/kalapakasteet","",["kalapuikko"],"");
O("jäätelö",16,1000,"ml",2.12,"Vaniljajäätelö 1 l","pakasteet/jaatelot","Yksi tuote.",["jäätelöt"],"1 l");
O("mysli",2,750,"g",3.5,"Mysli (arvio)","kuivatuotteet-ja-leivonta/murot-ja-myslit","Arvio, tuotetta ei haettu erikseen.",["myslit"],"");
O("murot",2,375,"g",2.6,"Murot (arvio)","kuivatuotteet-ja-leivonta/murot-ja-myslit","Arvio, tuotetta ei haettu erikseen.",["muro", "aamiaismurot"],"");
O("kahvi",9,500,"g",8.69,"Suodatinkahvi 500 g, mediaani","kahvit-teet-ja-mehut/kahvit-ja-suodatinpaperit","",["kahvit", "suodatinkahvi"],"");
O("tee",9,20,"kpl",1.39,"Coop vihreä tee 20 pussia","kahvit-teet-ja-mehut/teet","Yksi tuote.",["teet"],"20 pss");
O("nuudelit",2,85,"g",null,"Pikanuudelit","pastat-riisit-ja-nuudelit","",["pikanuudelit"],"");
O("pähkinät",3,200,"g",3.59,"Pähkinäsekoitus 200 g","snacksit/pahkinat","",["pähkinä", "pähkinäsekoitus"],"");
O("ketsuppi",7,1000,"g",null,"Tomaattiketsuppi","oljyt-maustaminen-ja-kastikkeet/ketsupit-ja-sinapit","",["tomaattiketsuppi"],"");
O("sinappi",7,275,"g",1.79,"Auran mieto sinappi 275 g","oljyt-maustaminen-ja-kastikkeet/ketsupit-ja-sinapit","",[],"");
O("majoneesi",7,260,"g",null,"Majoneesi (maustamaton)","oljyt-maustaminen-ja-kastikkeet","",[],"");
O("hillo",5,400,"g",null,"Hillot (puolukkahillo)","hillot-ja-sailykkeet/hillot","",["hillot", "marmeladi"],"");
O("valmiskastike",7,450,"g",3.38,"Patak's Butter Chicken 450 g","oljyt-maustaminen-ja-kastikkeet/maustekastikkeet-ja-tahnat","Vain yksi tai kaksi tuotetta.",["ateriakastike", "currykastike"],"");
O("valmiskeitto",4,500,"ml",2.5,"Valmiskeitto (arvio)","hillot-ja-sailykkeet","Arvio, tuotetta ei haettu erikseen.",["keitto", "kauppakeitto"],"");
O("etikka",7,750,"ml",1.25,"Xtra väkiviinaetikka 750 ml","oljyt-maustaminen-ja-kastikkeet/etikat-ja-balsamicot","",["väkiviinaetikka"],"");
O("hunaja",3,500,"g",3.89,"Coop juokseva hunaja 500 g","kuivatuotteet-ja-leivonta/sokerit-makeutusaineet-ja-hunaja","",[],"");
O("maustesekoitus",6,25,"g",0.83,"Maustesekoitukset 25 g, mediaani","oljyt-maustaminen-ja-kastikkeet/mausteet","",["mausteseos", "mauste"],"1 prk");
O("mehu",9,1000,"ml",2.82,"Appelsiini- ja omenamehut 1 l, mediaani","kahvit-teet-ja-mehut/mehut","",["mehut", "täysmehu"],"1 l");
O("virvoitusjuoma",9,1500,"ml",1.75,"Coca-Cola Zero 2 × 1,5 l","alkoholi-ja-virvoitusjuomat/virvoitusjuomat","",["limsa", "limu", "cola"],"1,5 l");
O("kivennäisvesi",9,1500,"ml",1.59,"Kotimaista kivennäisvesi 1,5 l","alkoholi-ja-virvoitusjuomat/vedet","Pantti ei sisälly.",["vesi pullo", "kivennäisvedet", "kuplavesi"],"1,5 l");
O("keksit",8,200,"g",1.9,"Keksit (arvio)","karkit-suklaat-ja-keksit","Arvio, tuotetta ei haettu erikseen.",["keksi"],"");
O("suklaa",8,145,"g",2.29,"Panda maitosuklaalevy 145 g","karkit-suklaat-ja-keksit/suklaalevyt","",["suklaalevy"],"");
O("karkit",8,300,"g",3.5,"Pussikarkit (arvio)","karkit-suklaat-ja-keksit","Arvio, tuotetta ei haettu erikseen.",["karkki", "namit"],"");
O("sipsit",8,260,"g",2.65,"Perunalastut 260 g, mediaani","snacksit/sipsit","",["sipsi", "perunalastut"],"");
O("wc-paperi",17,8,"kpl",4.02,"Wc-paperi 8 rullaa, mediaani","kodinhoito-ja-taloustarvikkeet/wc-paperit-talouspaperit-ja-nenaliinat","",["wc paperi", "vessapaperi", "vessa paperi", "wc-paperit"],"8 rl");
O("talouspaperi",17,4,"kpl",2.49,"Talouspaperi 4 rullaa, mediaani","kodinhoito-ja-taloustarvikkeet/wc-paperit-talouspaperit-ja-nenaliinat","",["talouspaperit", "keittiöpaperi"],"4 rl");
O("nenäliinat",17,100,"kpl",2.09,"Serla / Lotus nenäliinat 100 kpl","kodinhoito-ja-taloustarvikkeet/wc-paperit-talouspaperit-ja-nenaliinat","",["nenäliina", "paperinenäliinat"],"100 kpl");
O("astianpesuaine",17,450,"ml",3.15,"Fairy Original 450 ml","kodinhoito-ja-taloustarvikkeet/astianpesu","",["käsitiskiaine", "tiskiaine"],"");
O("konetiskitabletit",17,50,"kpl",4.99,"Coop All-in-1 50 kpl","kodinhoito-ja-taloustarvikkeet/astianpesu","",["konetiskiaine", "konetiskitabletti", "tiskikonetabletit"],"50 kpl");
O("pyykinpesuaine",17,750,"ml",3.85,"Lumme Kirjopyykki 750 ml","kodinhoito-ja-taloustarvikkeet/pyykinpesu","",["pesuaine", "pyykinpesuneste"],"");
O("huuhteluaine",17,1000,"ml",2.9,"Huuhteluaine (arvio)","kodinhoito-ja-taloustarvikkeet/pyykinpesu","Arvio, tuotetta ei löytynyt verkkokaupasta.",[],"");
O("wc-puhdistusaine",17,750,"ml",2.45,"Duck Aktiv-Gel 750 ml","kodinhoito-ja-taloustarvikkeet/siivous-ja-puhdistusaineet","",["wc-puhdistus", "wc-geeli"],"");
O("yleispuhdistusaine",17,500,"ml",3.29,"Sanytol monikäyttöpuhdistusaine 500 ml","kodinhoito-ja-taloustarvikkeet/siivous-ja-puhdistusaineet","Vain yksi tuote.",["puhdistusaine", "yleispuhdistus"],"");
O("hammastahna",17,125,"ml",1.79,"Pepsodent 125 ml","kosmetiikka-ja-hygienia/suunhoito/hammastahnat","",[],"");
O("käsisaippua",17,500,"ml",2.1,"Dove täyttöpakkaus 500 ml","kosmetiikka-ja-hygienia/saippuat-ja-pesutarvikkeet","",["nestesaippua", "saippua"],"");
O("shampoo",17,250,"ml",3.5,"Shampoo (arvio)","kosmetiikka-ja-hygienia","Arvio, tuotetta ei löytynyt verkkokaupasta.",["shampoot"],"");
O("suihkugeeli",17,1000,"ml",3.29,"Family Fresh 1 l","kosmetiikka-ja-hygienia/saippuat-ja-pesutarvikkeet","",["suihkusaippua", "suihkusaippuat"],"");
O("deodorantti",17,1,"kpl",3.5,"Deodorantti (arvio)","kosmetiikka-ja-hygienia","Arvio, tuotetta ei haettu erikseen.",["deo"],"");
O("roskapussit",17,25,"kpl",2.09,"Coop roskapussi 30 l, 25 kpl","kodinhoito-ja-taloustarvikkeet/jatesakit-ja-kassit","",["roskapussi", "jätesäkit", "jätekassit"],"25 kpl");
O("leivinpaperi",17,1,"kpl",3.0,"Leivinpaperi (arvio)","kodinhoito-ja-taloustarvikkeet/muut-kodinhoito-ja-taloustarvikkeet","Arvio, tuotetta ei löytynyt verkkokaupasta.",[],"1 rll");
O("alumiinifolio",17,1,"kpl",3.0,"Alumiinifolio (arvio)","kodinhoito-ja-taloustarvikkeet/muut-kodinhoito-ja-taloustarvikkeet","Arvio, tuotetta ei löytynyt verkkokaupasta.",["folio"],"1 rll");
O("pesusieni",17,6,"kpl",2.2,"Tiskisienet (arvio)","kodinhoito-ja-taloustarvikkeet/siivousvalineet-ja-tarvikkeet","Arvio, tuotetta ei löytynyt verkkokaupasta.",["pesusienet", "tiskisieni"],"6 kpl");
O("kosteuspyyhkeet",17,1,"kpl",2.5,"Kosteuspyyhkeet (arvio)","kosmetiikka-ja-hygienia","Arvio, tuotetta ei löytynyt verkkokaupasta.",["kosteuspyyhe"],"1 pkt");
O("kertakäyttökäsineet",17,50,"kpl",6.95,"Rainbow kertakäyttökäsineet 50 kpl","kodinhoito-ja-taloustarvikkeet/siivousvalineet-ja-tarvikkeet","",["käsineet", "hanskat"],"50 kpl");
O("kahvinsuodattimet",17,100,"kpl",2.2,"Kahvinsuodattimet (arvio)","kahvit-teet-ja-mehut/kahvit-ja-suodatinpaperit","Arvio, tuotetta ei haettu erikseen.",["kahvisuodattimet", "suodatinpaperit", "suodatinpussit", "suodatinpussi", "kahvinsuodatin"],"100 kpl");
export function deptOf(key){
  const ui=state.ing[key];if(ui)return ui.d;
  const ot=otOf(key);if(ot)return ot.d;
  if(Object.prototype.hasOwnProperty.call(XD,key))return XD[key];
  const c=catFind(key);if(c)return c.d;
  const k=PALIAS[key]||key,bk=baseKey(k);
  const u=PU[key]||PU[k]||(bk&&PU[bk]);
  if(u){const s=u.split("/"),d=DEPSUB[s[1]]!=null?DEPSUB[s[1]]:DEPMAP[s[0]];if(d!=null)return d;}
  return pantryHit(key)?6:18;
}
/* viikkosuunnitelmasta tulleet reseptit: oma annosmäärä ja versio */
function plLines(l){const o=[];for(const e of (l.pl||[])){const r=byId(e.id);if(r)o.push({r,lines:ingFor(r,e.n,e.v,e.t||[])});}return o;}
export function listItems(l){
  const items=shopping(l.cart,plLines(l)),map=new Map(items.map(e=>[e.key,e]));
  for(const it of (l.x||[])){
    let e=map.get(it.k);
    if(!e){e={key:it.k,name:it.k.charAt(0).toUpperCase()+it.k.slice(1),amts:new Map(),from:[],open:false,extra:true,per:new Map()};map.set(it.k,e);items.push(e);}
    else e.extra=true;
    e.xq=it.q||"";
    if(!e.from.includes("Muu ostos"))e.from.push("Muu ostos");
  }
  return items.sort((a,b)=>a.name.localeCompare(b.name,"fi"));
}
export const needed=l=>listItems(l).filter(e=>!l.have.includes(e.key));
export function groupDeps(list,have,store){
  const g=DEPS.map(()=>[]);
  for(const e of list)g[deptOf(e.key)].push(e);
  return storeOrder(store).map(i=>({name:DEPS[i],items:g[i].sort((x,y)=>have.includes(x.key)-have.includes(y.key))})).filter(x=>x.items.length);
}
/* tavalliset pakkauskoot: [koko, perusyksikkö g | ml | kpl] */
const PK={"maito":[1000,"ml"],"täysmaito":[1000,"ml"],"kevytmaito":[1000,"ml"],"piimä":[1000,"ml"],"kauramaito":[1000,"ml"],"ruokakerma":[200,"ml"],"kuohukerma":[200,"ml"],"vispikerma":[200,"ml"],"kahvikerma":[200,"ml"],"kermaviili":[200,"g"],"smetana":[180,"g"],"creme fraiche":[150,"g"],"maitorahka":[250,"g"],"turkkilainen jogurtti":[400,"g"],"jogurtti":[1000,"g"],"raejuusto":[200,"g"],"kermajuusto":[500,"g"],"juustoraaste":[150,"g"],"parmesaani":[125,"g"],"fetajuusto":[150,"g"],"mozzarella":[125,"g"],"halloumi":[200,"g"],"tuorejuusto":[200,"g"],"voi":[500,"g"],"margariini":[400,"g"],"kananmuna":[10,"kpl"],"kookosmaito":[400,"ml"],
"jauheliha":[400,"g"],"sekajauheliha":[400,"g"],"paistijauheliha":[400,"g"],"kanan jauheliha":[400,"g"],"kananrintafilee":[500,"g"],"broilerinfilee":[500,"g"],"kanansuikaleet":[300,"g"],"pekoni":[170,"g"],"lenkkimakkara":[400,"g"],"makkara":[400,"g"],"nakit":[280,"g"],"kalapuikot":[450,"g"],"savulohi":[200,"g"],"kinkkusuikaleet":[150,"g"],"savukinkku":[300,"g"],
"vehnäjauho":[2000,"g"],"ruisjauho":[1000,"g"],"perunajauho":[500,"g"],"maissitärkkelys":[400,"g"],"korppujauho":[400,"g"],"kaurahiutaleet":[1000,"g"],"mannaryyni":[1000,"g"],"sokeri":[1000,"g"],"leivinjauhe":[100,"g"],"ruokasooda":[125,"g"],"riisi":[1000,"g"],"puuroriisi":[1000,"g"],"risottoriisi":[500,"g"],"makaroni":[400,"g"],"spagetti":[500,"g"],"pasta":[500,"g"],"lasagnelevyt":[400,"g"],"couscous":[500,"g"],"bulgur":[500,"g"],"punaiset linssit":[500,"g"],
"tomaattimurska":[400,"g"],"tomaattipyree":[140,"g"],"puolukkahillo":[400,"g"],"pesto":[190,"g"],"soijakastike":[150,"ml"],"tomaattiketsuppi":[1000,"g"],"majoneesi":[260,"g"],"rypsiöljy":[1000,"ml"],"oliiviöljy":[500,"ml"],"kasvisliemikuutio":[12,"kpl"],"liemikuutio":[12,"kpl"],"tofu":[250,"g"],"pinaattipakaste":[150,"g"],"kasvissekoitus":[500,"g"],"wok-vihannekset":[500,"g"]};
Object.assign(PK,{"nachot":[200,"g"],"salsa":[300,"g"]});
Object.assign(PK,{"viinirypäle": [500, "g"], "shiitake": [100, "g"], "chorizo": [230, "g"], "kassler": [1000, "g"], "salami": [150, "g"], "palvikinkku": [350, "g"], "sulatejuusto": [200, "g"], "tuorejuusto": [150, "g"], "hiiva": [50, "g"], "kuivahiiva": [55, "g"], "mantelijauhe": [80, "g"], "kookoshiutale": [200, "g"], "pizzapohja": [360, "g"], "piirakkataikina": [380, "g"], "pakastemaissi": [450, "g"], "pakastekukkakaali": [400, "g"], "pakasteparsakaali": [500, "g"], "pakastevihannekset": [500, "g"], "tomusokeri": [500, "g"], "ruokosokeri": [500, "g"], "quinoa": [500, "g"], "ohrasuurimo": [600, "g"], "täysjyväriisi": [1000, "g"], "tahini": [300, "g"], "currykastike": [450, "g"], "juustokumina": [25, "g"]});
Object.assign(PK,{"mansikka":[250,"g"],"mustikka":[250,"g"],"vadelma":[125,"g"],"puolukka":[500,"g"],"lihapullat":[400,"g"],"maksa":[400,"g"],"katkarapu":[300,"g"],"halloumi":[200,"g"],"ruusukaali":[300,"g"],"parsa":[250,"g"],"suppilovahvero":[250,"g"],"soijajuoma":[1000,"ml"],"kaakao":[250,"g"],"kookoshiutaleet":[200,"g"],"tumma suklaa":[200,"g"],"rusinat":[250,"g"],"cashewpähkinä":[200,"g"],"kasvispyörykät":[230,"g"],"härkäpapu":[250,"g"],"pakastemansikka":[500,"g"],"ranskalaiset":[750,"g"],"tomaattikastike":[400,"g"],"linssit säilyke":[400,"g"],"mustat pavut":[230,"g"]});
export function packOf(key){
  const ui=state.ing[key];
  if(ui)return ui.pk?(ui.pk.length?ui.pk:null):(ui.u&&ui.u.prk?[ui.u.prk,"g"]:null);
  const c=catFind(key);
  if(c&&c.pk)return c.pk.length?c.pk:null;
  return PK[key]||PK[PALIAS[key]||""]||(c&&PK[c.key])||null;
}
function toBase(key,f,v,b){
  if(b==="kpl")return f==="kpl"?v:null;
  if(b==="ml"){
    if(f==="ml")return v;if(f==="rkl")return v*15;if(f==="tl")return v*5;
    if(f==="prk"||f==="pss"){const bk=baseKey(PALIAS[key]||key),e=bk?PR[bk]:null;const q=e&&e[f];if(q)return q*v;}
    return null;
  }
  return f==="g"?v:gramsOf(key,f,v);
}
export const fmtB=(s,b)=>b==="kpl"?fmtNum(s)+" kpl":fmt(b,s);
/* ostettava määrä pakkauksina: {txt,need,n,cost,adj} tai null */
export function packInfo(e,l){
  if(isSkip(e.key)||!e.amts.size)return null;
  const adj=(l&&l.adj&&l.adj[e.key])||0,pk=packOf(e.key),pr=findPrice(e.key);
  if(pk){
    let need=0;
    for(const[f,v]of e.amts){const x=toBase(e.key,f,v,pk[1]);if(x==null)return null;need+=x;}
    const n=Math.max(1,Math.max(1,Math.ceil(need/pk[0]-1e-6))+adj);
    let cost=null;
    if(pr){
      if((pr.per==="kg"&&pk[1]==="g")||(pr.per==="l"&&pk[1]==="ml"))cost=n*pk[0]/1000*pr.p;
      else if(pr.per==="kpl"&&pk[1]==="kpl")cost=n*pk[0]*pr.p;
      else if(pr.per==="kg"&&pk[1]==="ml"){const g=gramsOf(e.key,"ml",n*pk[0]);if(g!=null)cost=g/1000*pr.p;}
    }
    return{txt:(pk[0]===1&&pk[1]==="kpl")?n+" kpl":n+" × "+fmtB(pk[0],pk[1]),pk,need:"tarve "+fmtB(Math.round(need*10)/10,pk[1]),n,cost,adj};
  }
  const fams=[...e.amts.keys()];
  if(fams.length===1&&["kpl","prk","pss","nippu"].includes(fams[0])){
    const f=fams[0],v=e.amts.get(f),n=Math.max(1,Math.max(1,Math.ceil(v-1e-6))+adj);
    let cost=null;if(pr){const x=costOf(e.key,f,n);if(x.t==="ok")cost=x.c;}
    return{txt:n+" "+f,need:n-adj!==v?"tarve "+fmtNum(v)+" "+f:"",n,cost,adj};
  }
  return null;
}
export function perText(e){
  const a=[...(e.per||new Map())].map(([n,m])=>n+(m.size?" "+[...m].map(([f,v])=>fmt(f,v)).join(" + "):""));
  if(e.extra&&a.length)a.push("muu ostos"+(e.xq?" "+e.xq:""));
  return a.join(", ");
}
/* muun ostoksen määrä: "2 pkt", "500 g", "1,5 l" */
export function xQty(q){
  const m=/^\s*([\d]+(?:[.,]\d+)?)\s*([^\s\d].*)?$/.exec(q||"");
  if(!m)return{n:1,u:""};
  return{n:parseFloat(m[1].replace(",","."))||1,u:(m[2]||"").trim().toLowerCase()};
}
/* muiden ostosten hinta: pakkauksia kerrotaan pakkaushinnalla; tuntematon tuote ei tuo hintaa */
function extraCost(e,l){
  const o=otOf(e.key);let pk=null,pp=null;
  if(o){pk=[o.q,o.u];pp=otP(o);}
  else{
    const pr=findPrice(e.key),p=packOf(e.key);
    if(pr&&p){
      if((pr.per==="kg"&&p[1]==="g")||(pr.per==="l"&&p[1]==="ml"))pp=p[0]/1000*pr.p;
      else if(pr.per==="kpl"&&p[1]==="kpl")pp=p[0]*pr.p;
      if(pp!=null)pk=p;
    }
  }
  if(!pk||pp==null)return null;
  const{n:q,u}=xQty(e.xq),adj=(l&&l.adj&&l.adj[e.key])||0;
  let n=q,base=null;
  const f={g:["g",1],kg:["g",1000],ml:["ml",1],dl:["ml",100],l:["ml",1000]}[u];
  if(f&&f[0]===pk[1])base=q*f[1];
  if(base!=null)n=Math.max(1,Math.ceil(base/pk[0]-1e-6));
  else n=Math.max(1,Math.ceil(q-1e-6));
  n+=adj;
  const cost=n*pp,txt=n+" × "+(o?otPack(o):fmtB(pk[0],pk[1]));
  return{cost,n,txt,weak:!!(o&&o.w)};
}
export function itemCost(e,l){
  let sum=0,miss=false,weak=false,any=false;
  if(e.extra&&!e.amts.size){
    const x=extraCost(e,l);
    if(x)return{sum:x.cost,miss:false,txt:`<span class="ep">${esc(x.txt)} · ≈ ${eur(x.cost)}</span>`};
    return{sum:0,miss:false,txt:""};
  }
  if(isSkip(e.key))return{sum:0,miss:false,txt:""};
  if(!e.amts.size)return{sum:0,miss:false,txt:""};
  const pi=packInfo(e,l);
  if(pi&&pi.cost!=null)return{sum:pi.cost,miss:false,txt:`<span class="ep">${pi.need?esc(pi.need)+" · ":""}≈ ${eur(pi.cost)}</span>`};
  if(pi&&pi.need&&!findPrice(e.key))return{sum:0,miss:true,txt:`<span class="ep">${esc(pi.need)} · hinta puuttuu</span>`};
  for(const[f,v]of e.amts){const x=costOf(e.key,f,v);if(x.t==="ok"){sum+=x.c;any=true;}else miss=true;}
  return{sum,miss:miss||!any,txt:any?`<span class="ep">${miss?"väh. ":"≈ "}${eur(sum)}</span>`:`<span class="ep">hinta puuttuu</span>`};
}
export const pillText=(e,l)=>{const pi=packInfo(e,l);if(!pi)return qtyText(e);return(pi.pk?pi.n+" kpl":pi.txt)+(e.xq?" + "+e.xq:"");};
/* rivin pieni teksti: pakkauskoko + hinta €/kpl */
export function rowSub(e,l){
  if(!(e.extra&&!e.amts.size)){
    const pi=packInfo(e,l);
    if(pi&&pi.cost!=null){
      const lab=pi.pk&&!(pi.pk[0]===1&&pi.pk[1]==="kpl")?fmtB(pi.pk[0],pi.pk[1])+" · ":"";
      return`<span class="ep2">${esc(lab)}${eur(pi.cost/pi.n)}/${pi.pk?"kpl":esc(pi.txt.replace(/^\d+ /,""))}</span>`;
    }
  }
  return itemCost(e,l).txt.replace('class="ep"','class="ep2"');
}
export const qtyMain=(e,l)=>{const pi=packInfo(e,l);return pi?pi.txt+(e.xq?" + "+e.xq:""):qtyText(e);};
export const qtyText=e=>{
  const a=[...e.amts].map(([f,v])=>fmt(f,v));
  if(e.xq)a.push(e.xq);
  return a.length?a.join(" + "):(e.extra&&!e.open&&e.from.length===1?"":"tarpeen mukaan");
};
export function pruneChecked(){for(const l of state.lists){const k=new Set(listItems(l).map(i=>i.key));l.checked=l.checked.filter(x=>k.has(x));l.have=l.have.filter(x=>k.has(x));if(l.adj)for(const a of Object.keys(l.adj))if(!k.has(a))delete l.adj[a];}}
export function purgeCart(id){for(const l of state.lists)l.cart=l.cart.filter(i=>i!==id);}
export function newList(){
  const d=todayLocal();
  const l={id:"l"+Date.now().toString(36)+Math.random().toString(36).slice(2,5),name:mkName(d,state.lists),d,cart:[],checked:[],have:[],x:[],store:state.store||""};
  state.lists.push(l);state.act=l.id;
  while(state.lists.length>30){const i=state.lists.findIndex(x=>x.id!==l.id);state.lists.splice(i,1);}
  return l;
}
export function ensureList(){
  const t=todayLocal(),a=actList(state);
  if(a&&a.d===t)return a;
  const same=[...state.lists].reverse().find(l=>l.d===t);
  if(same){state.act=same.id;return same;}
  return newList();
}
function measureTabs(){const t=document.querySelector(".tabs");if(t&&t.offsetHeight)document.documentElement.style.setProperty("--tabh",t.offsetHeight+"px");}
addEventListener("resize",measureTabs);addEventListener("load",measureTabs);measureTabs();
let toastT=0;
export function showListToast(l,rid){
  const t=dlg.open?$("dtoast"):$("toast");
  $("toast").hidden=true;$("dtoast").hidden=true;
  t.innerHTML=`<span>Lisätty ostoslistalle <b>${esc(l.name)}</b></span>`;
  t.hidden=false;
  clearTimeout(toastT);toastT=setTimeout(()=>{t.hidden=true;},8000);
}
let mLid="",mArm="";
function menuHtml(l){
  const st=listStats(l),it=(k,t,cls,dis)=>`<button type="button" class="lopt${cls?" "+cls:""}" data-lm="${k}"${dis?" disabled":""}><span>${t}</span></button>`;
  const anyCk=st.act.some(e=>l.checked.includes(e.key));
  return`<button type="button" class="dx" data-lmclose aria-label="Sulje">${ico("x")}</button><h2 class="dh" style="font-size:1.25rem">${esc(l.name)}</h2>`+
    it("rename","Nimeä uudelleen")+it("copy","Tee kopio uudeksi listaksi")+
    it("all","Merkitse kaikki kerätyiksi","",!st.act.length||!st.left)+it("none","Merkitse kaikki keräämättömiksi","",!anyCk)+
    it("empty",mArm==="empty"?"Varmista: tyhjennä lista":"Tyhjennä lista","err",!l.cart.length&&!(l.x||[]).length&&!(l.pl||[]).length)+
    it("del",mArm==="del"?"Varmista: poista lista":"Poista lista","err")+`<div style="height:22px"></div>`;
}
export function openMenu(lid){
  const l=state.lists.find(q=>q.id===lid);if(!l)return;
  mLid=lid;mArm="";hideToast();$("mbody").innerHTML=menuHtml(l);$("mdlg").showModal();
}
function copyName(n){
  const base=clip(String(n).replace(/ \(kopio(?: \d+)?\)$/,""),31)+" (kopio)";
  let c=base,k=2;while(state.lists.some(l=>l.name===c))c=base.replace(/\)$/," "+(k++)+")");
  return c;
}
export function flashToast(html){
  const t=$("toast");$("dtoast").hidden=true;t.innerHTML=`<span>${html}</span>`;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{t.hidden=true;},5000);
}
$("mdlg").addEventListener("click",e=>{
  if(e.target===$("mdlg")||e.target.closest("[data-lmclose]")){$("mdlg").close();return;}
  const b=e.target.closest("[data-lm]");if(!b||b.disabled)return;
  const l=state.lists.find(q=>q.id===mLid);if(!l){$("mdlg").close();return;}
  const a=b.dataset.lm;
  if((a==="empty"||a==="del")&&mArm!==a){mArm=a;$("mbody").innerHTML=menuHtml(l);return;}
  mArm="";$("mdlg").close();
  if(a==="rename"){viewId=l.id;renaming=true;delList=false;renderCart();window.scrollTo(0,0);const f=$("lname");if(f){f.focus();f.select();}return;}
  if(a==="copy"){
    const src={cart:[...l.cart],x:(l.x||[]).map(i=>({...i})),adj:{...(l.adj||{})}};
    const nl=newList();nl.name=copyName(l.name);nl.cart=src.cart;nl.x=src.x;nl.adj=src.adj;nl.store=l.store||"";
    viewId=nl.id;renaming=false;mutate();refreshCart();window.scrollTo(0,0);flashToast("Kopio luotu: <b>"+esc(nl.name)+"</b>");return;
  }
  if(a==="all"){l.checked=listStats(l).act.map(e=>e.key);mutate();renderCart();return;}
  if(a==="none"){l.checked=[];mutate();renderCart();return;}
  if(a==="empty"){l.cart=[];l.pl=[];l.checked=[];l.have=[];l.x=[];l.adj={};mutate();refreshCart();return;}
  if(a==="del"){
    state.lists=state.lists.filter(q=>q!==l);
    if(state.act===l.id)state.act=state.lists.length?state.lists[state.lists.length-1].id:"";
    if(viewId===l.id)viewId=null;
    mutate();refreshCart();
  }
});
$("mdlg").addEventListener("close",()=>{mArm="";});
export function showRmToast(l,rid,i){
  const r=byId(rid),t=$("toast");
  $("dtoast").hidden=true;
  t.innerHTML=`<span>Poistettu listalta <b>${esc(l.name)}</b>: ${esc(r?r.name:"ruoka")}</span><button type="button" data-lst="undorm" data-rid="${esc(rid)}" data-from="${esc(l.id)}" data-i="${i}">Kumoa</button>`;
  t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{t.hidden=true;},8000);
}
export function undoToast(html,attrs){
  const t=$("toast");$("dtoast").hidden=true;
  t.innerHTML=`<span>${html}</span><button type="button" ${attrs}>Kumoa</button>`;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{t.hidden=true;},8000);
}
export function hideToast(){clearTimeout(toastT);$("toast").hidden=true;$("dtoast").hidden=true;}
export function moveRecipe(rid,fromId,toId){
  const from=state.lists.find(l=>l.id===fromId),to=state.lists.find(l=>l.id===toId);
  if(!to)return;
  if(from&&from!==to)from.cart=from.cart.filter(i=>i!==rid);
  if(!to.cart.includes(rid))to.cart.push(rid);
  if(from&&from!==to&&!from.cart.length)state.lists=state.lists.filter(l=>l!==from);
  state.act=to.id;pruneChecked();mutate();refreshCart();showListToast(to,rid);
}
export function openChooser(rid,fromId){
  const ls=[...state.lists].reverse();
  $("lbody").innerHTML=`<button type="button" class="dx" data-lclose aria-label="Sulje">${ico("x")}</button><h2 class="dh">Valitse ostoslista</h2>`+
    ls.map(l=>`<button type="button" class="lopt" data-lst="move" data-rid="${esc(rid)}" data-from="${esc(fromId)}" data-lid="${esc(l.id)}" aria-pressed="${l.cart.includes(rid)}"><span>${esc(l.name)}</span><small>${l.cart.length} ruokaa</small></button>`).join("")+
    `<button type="button" class="lopt nw" data-lst="newmove" data-rid="${esc(rid)}" data-from="${esc(fromId)}"><span>+ Uusi lista (${esc(mkName(todayLocal(),state.lists))})</span></button><div style="height:22px"></div>`;
  hideToast();$("ldlg").showModal();
}
$("ldlg").addEventListener("click",e=>{if(e.target===$("ldlg"))$("ldlg").close();});
/* kauppavalinta ja osastojärjestys */
export const lg=t=>LOGO[t]?`<img class="lg" src="${LOGO[t]}" alt="" width="28" height="28">`:"";
export const sNew=o=>{sS={q:"",edit:false,set:false,cur:"",scope:"store",from:"",focus:"",...o};};
let sS;sNew({});
const allStores=()=>[...STORES.filter(x=>!x.type),...Object.keys(state.sx).map(id=>({id,n:state.sx[id],c:"oma",t:typeOf(id)}))].sort((a,b)=>a.n.localeCompare(b.n,"fi"));
const typeN=id=>(STORE_TYPES.find(t=>t.id===id)||{}).n||"";
export function renderStoreDlg(){
  const b=$("sbody");
  const x='<button type="button" class="dx" data-st="close" aria-label="Sulje">'+ico("x")+'</button>';
  if(sS.edit){
    const cur=sS.cur,isType=STORE_TYPES.some(t=>t.id===cur),ty=isType?cur:typeOf(cur),own=cur.startsWith("o-");
    const scope=isType||!ty?(isType?"type":"store"):sS.scope,tgt=scope==="type"?ty:cur;
    const ord=scope==="type"?(state.so[tgt]||typeDef(tgt)):storeOrder(cur);
    const seg=(!isType&&ty)?`<div class="seg" role="group" aria-label="Kenelle muutos koskee"><button type="button" data-st="scope" data-sc="store" aria-pressed="${scope==="store"}">Tämä kauppa</button><button type="button" data-st="scope" data-sc="type" aria-pressed="${scope==="type"}">${esc(typeN(ty))}</button></div>`:"";
    const info=scope==="type"?`Koskee kaikkia kauppoja tässä ryhmässä, joilla ei ole omaa järjestystä.`:(ty?`Koskee vain tätä kauppaa. Ilman omaa järjestystä kauppa käyttää ryhmän "${esc(typeN(ty))}" järjestystä.`:"Koskee vain tätä kauppaa.");
    b.innerHTML=x+`<h2 class="dh">Osastojen järjestys</h2><p class="note nm0" style="margin:0 0 4px">${lg(scope==="type"?tgt:ty)}<b>${esc(scope==="type"?typeN(tgt):storeName(cur))}</b></p>${seg}<p class="note" style="margin:8px 0 12px">${info} Siirrä osastoja niin, että lista kulkee kaupan läpi oikeassa järjestyksessä.</p>
<ol class="ord">${ord.map((d,i)=>`<li><span class="no" aria-hidden="true">${i+1}</span><span class="nm">${esc(DEPS[d])}</span><button type="button" data-st="up" data-i="${i}" aria-label="Siirrä ylös: ${esc(DEPS[d])}"${i===0?" disabled":""}>↑</button><button type="button" data-st="dn" data-i="${i}" aria-label="Siirrä alas: ${esc(DEPS[d])}"${i===ord.length-1?" disabled":""}>↓</button></li>`).join("")}</ol>
<div class="actions"><button type="button" class="go" data-st="done">Valmis</button></div>
${state.so[tgt]?`<button type="button" class="lopt" data-st="reset" style="justify-content:center;margin-top:8px">Palauta ${scope==="type"?"oletusjärjestys":(ty?"ryhmän järjestys":"oletusjärjestys")}</button>`:""}
${own&&scope==="store"?`<button type="button" class="lopt err" data-st="del" style="justify-content:center">Poista kauppa</button>`:""}<div style="height:22px"></div>`;
  }else if(sS.set){
    b.innerHTML=x+`<h2 class="dh">Kauppatyyppien oletusjärjestys</h2><p class="note" style="margin:0 0 12px">Valitse kauppatyyppi ja aseta osastojen järjestys. Se koskee kaikkia saman tyypin kauppoja, joilla ei ole omaa järjestystä. Yksittäisen kaupan järjestyksen muutat kaupan valinnasta.</p>`+
      STORE_TYPES.map(y=>{const n=STORES.filter(r=>!r.type&&r.t===y.id).length;return`<button type="button" class="lopt" data-st="tedit" data-id="${y.id}">${lg(y.id)}<span>${esc(y.n.replace("Kaikki ",""))}${n?`<small> · ${n} kauppaa</small>`:""}${state.so[y.id]?'<span class="mk">oma järjestys</span>':(TYPE_ORD[y.id]?'<small> · valmis järjestys</small>':'<small> · oletus</small>')}</span></button>`;}).join("")+
      `<button type="button" class="lopt" data-st="back" style="justify-content:center;margin-top:10px">Takaisin kaupan valintaan</button><div style="height:22px"></div>`;
  }else{
    const cur=(vList()||{}).store||"",q=sS.q.trim(),row=r=>`<button type="button" class="lopt" data-st="sel" data-id="${esc(r.id)}" aria-pressed="${cur===r.id}">${lg(r.t||typeOf(r.id))}<span>${esc(r.n)}${r.c&&r.c!=="oma"&&!fold(r.n).includes(fold(r.c))?`<small> · ${esc(r.c)}</small>`:""}${r.c==="oma"?'<small> · oma</small>':""}${state.so[r.id]?'<span class="mk">oma järjestys</span>':""}</span></button>`;
    let h=x+`<h2 class="dh">Valitse kauppa</h2><input id="sq" class="sq" type="search" placeholder="Hae kauppaa, esim. Itäkeskus" value="${esc(sS.q)}" autocomplete="off" aria-label="Hae kauppaa">
<p class="sl">${cur?`<button type="button" class="lk" data-st="edit">Muokkaa valitun kaupan järjestystä</button>`:""}<button type="button" class="lk" data-st="set">Kauppatyyppien järjestykset</button></p>`;
    if(q){
      const t=fold(q).split(/\s+/).filter(Boolean);
      const rows=allStores().filter(r=>{const hs=fold(r.n+" "+r.c);return t.every(w=>hs.includes(w));});
      h+=`<h3 class="gt">Hakutulokset (${rows.length})</h3>`+rows.map(row).join("");
      if(!rows.length)h+=`<p class="note">Ei osumia.</p>`;
      if(!rows.length&&q.length>=2&&Object.keys(state.sx).length<40)h+=`<button type="button" class="lopt nw" data-st="add"><span>+ Lisää kauppa: ${esc(q.slice(0,40))}</span></button>`;
    }else{
      const rc=state.rc.filter(id=>STORE_IDS.has(id)||state.sx[id]).map(id=>({id,n:storeName(id),c:(STORE_BY.get(id)||{}).c||(state.sx[id]?"oma":"")}));
      if(rc.length)h+=`<h3 class="gt">Viimeksi käytetyt</h3>`+rc.map(row).join("");
      const al=allStores();
      h+=`<h3 class="gt">Kaikki kaupat (${al.length})</h3>`+al.map(row).join("");
    }
    b.innerHTML=h+`<div style="height:22px"></div>`;
  }
  if(sS.focus){const f=b.querySelector(sS.focus);if(f)f.focus({preventScroll:false});sS.focus="";}
}
function pickStore(id){
  const l=vList();if(l)l.store=id;
  state.store=id;
  if(id){state.rc=[id,...state.rc.filter(v=>v!==id)].slice(0,5);}
  mutate();
}
$("sdlg").addEventListener("click",e=>{
  if(e.target===$("sdlg")){$("sdlg").close();return;}
  const t=e.target.closest("[data-st]");if(!t)return;
  const a=t.dataset.st;
  if(a==="close"){$("sdlg").close();return;}
  if(a==="sel"){pickStore(t.dataset.id===((vList()||{}).store||"")?"":t.dataset.id);$("sdlg").close();renderCart();return;}
  if(a==="add"){
    const nm=sS.q.trim().slice(0,40);if(nm.length<2)return;
    let id;do{id="o-"+Math.random().toString(36).slice(2,8);}while(state.sx[id]||!/^o-[a-z0-9]{1,12}$/.test(id));
    state.sx[id]=nm;pickStore(id);$("sdlg").close();renderCart();return;
  }
  if(a==="edit"){sNew({edit:true,cur:(vList()||{}).store||"",focus:"[data-st=done]"});renderStoreDlg();return;}
  if(a==="set"){sNew({set:true,focus:".lopt"});renderStoreDlg();return;}
  if(a==="back"){sNew({focus:"#sq"});renderStoreDlg();return;}
  if(a==="tedit"){sNew({edit:true,cur:t.dataset.id,from:"set",focus:"[data-st=done]"});renderStoreDlg();return;}
  if(a==="scope"){sS.scope=t.dataset.sc;renderStoreDlg();return;}
  if(a==="done"){
    if(sS.from==="set"){sNew({set:true,focus:".lopt"});renderStoreDlg();return;}
    $("sdlg").close();renderCart();return;
  }
  const cur=sS.cur,isType=STORE_TYPES.some(y=>y.id===cur),ty=isType?cur:typeOf(cur);
  const scope=isType?"type":(!ty?"store":sS.scope),tgt=scope==="type"?ty:cur;
  if(a==="up"||a==="dn"){
    const i=+t.dataset.i,j=a==="up"?i-1:i+1,o=(scope==="type"?(state.so[tgt]||typeDef(tgt)):storeOrder(cur)).slice();
    if(j<0||j>=o.length)return;
    [o[i],o[j]]=[o[j],o[i]];
    const fb=scope==="type"?typeDef(tgt):(state.so[ty]||TYPE_ORD[ty]||DEFORD);
    if(o.every((v,k)=>v===fb[k]))delete state.so[tgt];else state.so[tgt]=o;
    mutate();sS.focus=`[data-st=${a}][data-i="${j}"]:not([disabled])`;
    renderStoreDlg();
    if(!$("sbody").contains(document.activeElement)||document.activeElement.tagName!=="BUTTON"||document.activeElement.disabled){const f=$("sbody").querySelector(`[data-i="${j}"]:not([disabled])`);if(f)f.focus();}
    return;
  }
  if(a==="reset"){delete state.so[tgt];mutate();renderStoreDlg();return;}
  if(a==="del"){
    if(!cur.startsWith("o-"))return;
    delete state.sx[cur];delete state.so[cur];state.rc=state.rc.filter(v=>v!==cur);if(state.store===cur)state.store="";for(const q of state.lists)if(q.store===cur)q.store="";mutate();$("sdlg").close();renderCart();return;
  }
});
$("sdlg").addEventListener("input",e=>{
  if(e.target.id!=="sq")return;
  sS.q=e.target.value;const pos=e.target.selectionStart;renderStoreDlg();
  const f=$("sq");if(f){f.focus();try{f.setSelectionRange(pos,pos);}catch(_){}}
});
$("sdlg").addEventListener("close",()=>{sNew({});});
export let renaming=false,delList=false,viewId=null;
export function setDelList(v){return delList=v;}
export function setRenaming(v){return renaming=v;}
export function setViewId(v){return viewId=v;}
export const vList=()=>state.lists.find(l=>l.id===viewId)||null;
export function peekList(){const t=todayLocal(),a=actList(state);if(a&&a.d===t)return a;return [...state.lists].reverse().find(l=>l.d===t)||null;}
export function toggleCart(id){
  const p=peekList();
  if(p&&p.cart.includes(id)){
    const l=ensureList(),i=l.cart.indexOf(id);
    l.cart.splice(i,1);
    pruneChecked();mutate();refreshCart();
    hideToast();return;
  }
  openAdd(id);
}
