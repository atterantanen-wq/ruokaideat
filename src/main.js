import "./styles/main.css";
import {LIB} from "./data/library/index.js";
import {fromLib,applySel,selOf,optLines} from "./recipes.js";
import * as PL from "./planner.js";
import {ING_RAW} from "./data/ingredients.js";
import {STORE_P,STORE_L,STORE_K,STORE_KS,STORE_S} from "./data/stores.js";
import {LOGO} from "./data/logos.js";

const S={e:"Edullinen",k:"Kevyt",ai:"Airfryer",gl:"Grilli"};
const A={a:"Arkiruoka",j:"Viikonloppu ja juhla",b:"Aamu-, väli- ja iltapalat",l:"Leivonta"};
const T={pa:"Pata",ki:"Kiusaus",ke:"Keitto",uu:"Uuniruoka",pn:"Pannulla",ps:"Pasta ja riisi",pu:"Puuro",am:"Aamiainen",sa:"Salaatti",le:"Leivonta",ja:"Jälkiruoka",li:"Lisuke",wo:"Wokit ja nuudelit",pi:"Pizza",ha:"Hampurilaiset ja täytetyt leivät",vp:"Välipala",al:"Alkupala"};
const M={j:"Jauheliha",k:"Kana",f:"Kala",p:"Porsas",n:"Nauta",s:"Makkara",v:"Kasvis",e:"Muna",y:"Kasviproteiini"};

const TIME={"15":"Enintään 15 min","30":"Enintään 30 min","60":"Enintään 60 min","61":"Yli 60 min"};
const WLD={it:"Italialainen",tm:"Texmex",as:"Aasialainen",in:"Intialainen",am:"Amerikkalainen",vm:"Välimeri"};
const HOL={jo:"Joulu",pa:"Pääsiäinen",ju:"Juhannus",va:"Vappu"};
const KQ=["ai","gl"];
const FK=["a","m","s","v","w","t","f"];
/* suodattimet, jotka näkyvät vasta kun ainakin yhdellä reseptillä on arvo */
const HZ=new Set(["m:e","m:y","s:ai","s:gl","t:wo","t:pi","t:ha","t:vp","t:al"]);
const hide0=(g,c)=>g==="w"||g==="f"||HZ.has(g+":"+c);
const XLIM={t:12};
const WORDS_WD=[["tm",/taco|tortilla|burrito|fajita|nacho|quesadilla|chili con|texmex|tex-mex/],["it",/pizza|pasta|spagetti|lasagne|risotto|bolognese|carbonara|gnocchi|penne|tagliatelle|pesto/],["in",/curry|\btikka|masala|korma|butter chicken|\bdal\b|biryani|\bnaan/],["as",/wok|nuudeli|ramen|sushi|pad thai|dumpling|kimchi|teriyaki|bibimbap|pho\b/],["am",/hampurilais|burger|hot dog|bbq|pulled/],["vm",/kreikka|tsatsiki|tzatziki|souvlaki|gyros|hummus|falafel|paella|ratatouille|moussaka/]];
const suggestWd=n=>{const t=String(n||"").toLowerCase();for(const[c,re]of WORDS_WD)if(re.test(t))return c;return"";};

const $=id=>document.getElementById(id);
const IC={users:'<circle cx="9" cy="8" r="3.2"/><path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><circle cx="17.5" cy="9" r="2.5"/><path d="M17 14c2.5 0 4.5 1.7 4.5 4.5"/>',eye:'<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',basket:'<path d="M3 9h18l-1.8 10a2 2 0 0 1-2 1.7H6.8a2 2 0 0 1-2-1.7L3 9z"/><path d="M8 9l3-5M16 9l-3-5"/>',chef:'<path d="M7 14.5a4 4 0 1 1 1.5-7.7 4 4 0 0 1 7 0A4 4 0 1 1 17 14.5V19H7z"/><path d="M7 16.5h10"/>',flame:'<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.2 2-4 .3 1.3 1 2 1.8 2.2C11 8.5 11 5.5 12 3z"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',download:'<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19h14"/>',upload:'<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M5 19h14"/>',play:'<path d="M8 5.5v13l10.5-6.5z"/>',left:'<path d="M15 5l-7 7 7 7"/>',right:'<path d="M9 5l7 7-7 7"/>',timer:'<circle cx="12" cy="13.5" r="7"/><path d="M12 10v3.8l2.4 1.6M9.5 3h5"/>',list:'<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',tlist:'<path d="M9 6h11M9 12h11M9 18h11"/><path d="M3.5 6l1.2 1.2L6.8 5M3.5 12l1.2 1.2L6.8 11M3.5 18l1.2 1.2L6.8 17"/>',star:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.7l1-5.9L3.5 9.7l5.9-.8z"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',copy:'<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15"/>',share:'<circle cx="6" cy="12" r="2.2"/><circle cx="18" cy="6" r="2.2"/><circle cx="18" cy="18" r="2.2"/><path d="M8 11l8-4M8 13l8 4"/>',dots:'<circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/>',heart:'<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z"/>',plus:'<path d="M12 5v14M5 12h14"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',pencil:'<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',up:'<path d="M12 19V5M6 11l6-6 6 6"/>',down:'<path d="M12 5v14M6 13l6 6 6-6"/>',chev:'<path d="M6 9l6 6 6-6"/>',alert:'<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17.5v.01"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'};
const ico=n=>`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;
const cartInner=on=>ico(on?"check":"tlist")+"<span>"+(on?"Ostoslistalla":"Lisää ostoslistalle")+"</span>";
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clip=(s,n)=>String(s==null?"":s).slice(0,n);
/* reseptikirjasto: ks. src/data/library ja src/recipes.js */
const R=LIB.map(fromLib);
const isPop=r=>!!r.pop;
const workOf=r=>r.w>0?r.w:0;
const defServ=id=>{const r=R.find(x=>x.id===id);return r&&r.sv||4;};

/* ---------- apurit: linkit, ainekset ---------- */
function safeUrl(u){
  u=String(u||"").trim();
  if(!u)return"";
  if(!/^[a-z][a-z0-9+.-]*:/i.test(u))u="https://"+u;
  try{const x=new URL(u);return(x.protocol==="http:"||x.protocol==="https:")?x.href:"";}catch(e){return"";}
}
const host=u=>{try{return new URL(u).hostname.replace(/^www\./,"");}catch(e){return"";}};
const UN="(?:kg|g|dl|ml|cl|l|rkl|tl|kpl|prk|pss|nippu|pkt|rs|tlk|ruukku|ripaus)";
const reA=new RegExp("^(.+?)\\s+(\\d+(?:[.,]\\d+)?)\\s*("+UN+")?(?![a-zäöå])\\s*$","i");
const reB=new RegExp("^(\\d+(?:[.,]\\d+)?)\\s*("+UN+")?(?![a-zäöå])\\s+(.+)$","i");
const SYN={"kerma":"ruokakerma","pippuri":"mustapippuri"};
const USYN=new Map();
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
function parseIng(line){
  line=String(line).trim();
  let name=line,q=null,u="",m;
  if((m=line.match(reA))){name=m[1];q=num(m[2]);u=(m[3]||"").toLowerCase();}
  else if((m=line.match(reB))){q=num(m[1]);u=(m[2]||"").toLowerCase();name=m[3];}
  name=name.replace(/\s+/g," ").trim().replace(/[,;:]+$/,"");
  let key=name.toLowerCase();key=SYN[key]||USYN.get(key)||key;
  const label=key.charAt(0).toUpperCase()+key.slice(1);
  let fam="",v=null;
  if(q!=null&&isFinite(q)){const n=norm(q,u);fam=n.fam;v=n.v;}else q=null;
  return{key,name:label,rawName:name,q,u,fam,v};
}
const fmtNum=v=>String(Math.round(v*10)/10).replace(".",",");
function fmt(fam,v){
  if(fam==="g")return v>=1000?fmtNum(v/1000)+" kg":fmtNum(v)+" g";
  if(fam==="ml"){if(v>=1000)return fmtNum(v/1000)+" l";if(v>=100)return fmtNum(v/100)+" dl";return fmtNum(v)+" ml";}
  return fmtNum(v)+" "+fam;
}
function ingText(p){
  if(p.q==null)return p.rawName;
  return(p.u?fmtNum(p.q)+" "+p.u:fmtNum(p.q)+" ×")+" "+p.rawName;
}

/* ---------- hintatiedot (S-kaupat.fi, 18.11.2026) ---------- */
const PR={};
function P(k,p,per,src,o,w,u,d){PR[k]=Object.assign({p,per,src,w:w||"",d:d||"2026-11-18"},o||{});if(u)PU[k]=u;}
/* p = € / kg, € / l tai € / kpl. dl = g per dl, kpl/prk/pss/nippu = grammaa tai millilitraa per yksikkö */
P("peruna",0.99,"kg","Perunat (arki-, keitto-, muusiperuna)",{kpl:100});
P("jauheliha",15.56,"kg","Naudan jauheliha (10 – 17 %, ei luomu), noin 6 € / 400 g");
P("sika-nauta jauheliha",8.96,"kg","Jauheliha (sika-nauta ja nauta-sika, ei luomu)");
P("kanan jauheliha",8.2,"kg","Jauheliha (kana, ei luomu)");
P("kananrintafilee",13.09,"kg","Kanan fileet ja leikkeet (maustamaton)");
P("kanankoivet",5.5,"kg","Kanan koipireisi ja koipi (maustamaton)",{kpl:150});
P("kananmuna",0.26,"kpl","Kananmunat (vapaan kanan, M)");
P("lohifile",16.9,"kg","Tuore ja pakaste lohi- ja kirjolohifile");
P("valkoinen kalafile",11,"kg","Pakasteet: seitikuutiot ja alaskanseiti",{},"Vain kaksi tuotetta, laji vaihtelee.");
P("kalapuikot",7.35,"kg","Pakasteet: peruskalapuikot",{pss:450});
P("porsaanfilee",11.49,"kg","Porsaan sisä- ja ulkofileet (maustamaton)");
P("porsaankyljykset",13.79,"kg","Porsaan kyljys ja pihvit",{kpl:150},"Vain yksi vertailutuote.");
P("porsaan suikaleet",12.3,"kg","Porsaan suikaleet ja kuutiot (maustamaton)");
P("porsaan lapa",9.49,"kg","Porsaan uunilihat (lapa, piknik)");
P("naudan paisti",23.4,"kg","Naudan paistit");
P("naudanliha",23.4,"kg","Naudan paistit");
P("naudan suikaleet",24.2,"kg","Naudan suikaleet (maustamaton)");
P("savukinkku",16.25,"kg","Leikkeleet: ohut savukinkku",{},"Vain yksi vertailutuote, leikkeleen hinta.");
P("makkara",7.5,"kg","Makkarat (lenkki- ja siskonmakkara)");
P("lenkkimakkara",7.5,"kg","Makkarat (lenkki- ja siskonmakkara)");
P("tonnikala",1.55,"kpl","Tonnikalasäilykkeet (yksittäinen tölkki, 120 – 160 g)",{});
P("maito",1.1,"l","Maidot (kevyt- ja täysmaito, ei luomu)");
P("ruokakerma",4.3,"l","Ruokakermat (15 %, ei laktoositon)");
P("kuohukerma",5.6,"l","Kuohukerma 35 % (arvio)",{},"Arvio, tuotetta ei tarkistettu verkkokaupasta.");
P("kermaviili",4.25,"kg","Kermaviilit",{dl:100});
P("smetana",6.26,"kg","Smetanat",{dl:100});
P("voi",7.98,"kg","Voi (normaalisuolainen, 500 g)",{dl:95});
P("juustoraaste",14.2,"kg","Juustoraasteet (emmental, mozzarella, pizza, cheddar)",{dl:40});
P("parmesaani",28,"kg","Parmesaanit ja kovat juustot (Parmigiano Reggiano 12 kk)",{dl:40});
P("fetajuusto",12.3,"kg","Feta- ja salaattijuustot (ilman maustettuja)");
P("sipuli",1.49,"kg","Sipulit",{kpl:150});
P("punasipuli",1.7,"kg","Sipulit (punasipuli)",{kpl:150});
P("porkkana",1.19,"kg","Juurekset (porkkana)",{kpl:100});
P("bataatti",1.99,"kg","Juurekset (bataatti)",{kpl:350},"Vain yksi vertailutuote.");
P("lanttu",1.39,"kg","Lantut");
P("valkokaali",1.9,"kg","Kaalit (keräkaali)",{},"Vain kaksi vertailutuotetta.");
P("kukkakaali",4.29,"kg","Kaalit (kukkakaali)",{kpl:600},"Vain yksi vertailutuote.");
P("paprika",6.99,"kg","Paprikat (punainen, keltainen, vihreä, oranssi)",{kpl:150});
P("kesäkurpitsa",2.89,"kg","Kurpitsat (kesäkurpitsa)",{kpl:300},"Vain yksi vertailutuote.");
P("kirsikkatomaatit",10,"kg","Tomaatit (kirsikka- ja minitomaatit)");
P("herkkusienet",11.8,"kg","Sienet (herkkusieni)");
P("fenkoli",3.99,"kg","Muut vihannekset (fenkoli)",{kpl:300},"Vain yksi vertailutuote.");
P("purjo",4.19,"kg","Muut vihannekset (purjo)",{kpl:250},"Vain yksi vertailutuote.");
P("pinaatti",5.1,"kg","Kasvispakasteet (pinaatti)",{},"Pakasteen hinta, tuoretta ei vertailtu.");
P("herneet",3.4,"kg","Kasvispakasteet (herne)");
P("wok-vihannekset",4.7,"kg","Kasvispakasteet (wok-sekoitukset)");
P("valkosipulinkynsi",5.89,"kg","Vihannekset (valkosipuli)",{kpl:4},"Vain yksi vertailutuote.");
P("sitruuna",0.65,"kpl","Vihannekset (sitruuna, noin hinta)");
P("persilja",1.28,"kpl","Yrtit (tuore persilja, nippu)");
P("tilli",1.28,"kpl","Yrtit (tuore tilli, nippu)");
P("suolakurkku",7.4,"kg","Suolakurkut (valutettu paino)",{kpl:40});
P("maissi",1.15,"kpl","Kasvissäilykkeet (maissi, 340 g tölkki)");
P("kidneypavut",0.85,"kpl","Kasvissäilykkeet (pavut suolaliemessä, 380 g tölkki)");
P("kikherneet",0.95,"kpl","Kasvissäilykkeet (kikherneet, 380 g tölkki)");
P("kookosmaito",2.87,"l","Kookosmaidot (Coop, Xtra, 400 ml)",{prk:400});
P("tomaattimurska",2.35,"kg","Tomaattimurskat (ilman mausteita, ei luomu)",{prk:400});
P("tomaattipyree",8.5,"kg","Tomaattipyree",{dl:100});
P("pesto",2.99,"kpl","Pestokastikkeet (190 g purkki)");
P("puolukkahillo",9.36,"kg","Hillot (puolukkahillo)",{prk:300},"Purkin koko oletettu 300 grammaksi.");
P("lasagnelevyt",5.3,"kg","Lasagnelevyt (peruslevyt)");
P("spagetti",2.45,"kg","Spagetit (ei täysjyvä, gluteeniton tai luomu)");
P("pasta",2.45,"kg","Spagetit (ei täysjyvä, gluteeniton tai luomu)");
P("makaroni",1.38,"kg","Makaronit (perusmakaroni)");
P("riisi",2.47,"kg","Pitkäjyväiset riisit",{dl:80});
P("risottoriisi",3.65,"kg","Risotto- ja sushiriisit",{dl:80});
P("punaiset linssit",4.4,"kg","Kuivatut punaiset linssit",{dl:85});
P("kuivatut herneet",2.18,"kg","Kasvissäilykkeet (kuivattu herne)",{dl:85},"Vain yksi vertailutuote.");
P("vehnäjauho",0.8,"kg","Vehnäjauhot (puolikarkea)",{dl:60});
P("ruisjauho",1.27,"kg","Ruisjauhot",{dl:50});
P("korppujauho",3.2,"kg","Korppujauhot (peruskorppujauho)",{dl:50});
P("liemikuutio",0.14,"kpl","Liemikuutiot (kana, liha, kasvis)");
P("kanaliemikuutio",0.14,"kpl","Liemikuutiot (kana, liha, kasvis)");
P("lihaliemikuutio",0.14,"kpl","Liemikuutiot (kana, liha, kasvis)");
P("kasvisliemikuutio",0.14,"kpl","Liemikuutiot (kana, liha, kasvis)");
P("kalaliemikuutio",0.14,"kpl","Liemikuutiot (kana, liha, kasvis), kalaliemelle ei omaa hintaa");
P("kanaliemi",6.99,"l","Nestemäiset liemet (kana, liha, kasvis)");
P("lihaliemi",6.99,"l","Nestemäiset liemet (kana, liha, kasvis)");
P("oliiviöljy",13.4,"l","Oliiviöljyt (ekstra-neitsyt, 500 ml)");
P("soijakastike",8,"l","Soijakastikkeet (500 ml – 1 l)");
const PBASE="https://www.s-kaupat.fi/tuotteet/";
const PU={
"peruna":"hedelmat-ja-vihannekset/juurekset/perunat",
"jauheliha":"liha-ja-kasviproteiinit/jauheliha/naudan-jauheliha",
"sika-nauta jauheliha":"liha-ja-kasviproteiinit/jauheliha",
"kanan jauheliha":"liha-ja-kasviproteiinit/jauheliha",
"kananrintafilee":"liha-ja-kasviproteiinit/kana-broileri-ja-kalkkuna/kanan-pihvit-leikkeet-ja-puolivalmisteet",
"kanankoivet":"liha-ja-kasviproteiinit/kana-broileri-ja-kalkkuna/kanan-siivet-koipi-ja-reisipalat",
"kananmuna":"maito-munat-ja-rasvat/munat",
"lohifile":"kala-ja-merenelavat/kala/tuore-kala",
"valkoinen kalafile":"pakasteet/liha-ja-kalapakasteet",
"kalapuikot":"pakasteet/liha-ja-kalapakasteet",
"porsaanfilee":"liha-ja-kasviproteiinit/porsas/porsaan-fileet",
"porsaankyljykset":"liha-ja-kasviproteiinit-1/porsas/porsaan-pihvit-ja-leikkeet",
"porsaan suikaleet":"liha-ja-kasviproteiinit/porsas/porsaan-suikaleet-ja-kuutiot",
"porsaan lapa":"liha-ja-kasviproteiinit/porsas/porsaan-uunilihat",
"naudan paisti":"liha-ja-kasviproteiinit/nauta/naudan-paistit",
"naudanliha":"liha-ja-kasviproteiinit/nauta/naudan-paistit",
"naudan suikaleet":"liha-ja-kasviproteiinit/nauta/naudan-suikaleet-ja-kuutiot",
"savukinkku":"liha-ja-kasviproteiinit/kinkut-ja-leikkeleet/kokolihaleikkeet",
"makkara":"liha-ja-kasviproteiinit/makkarat-nakit-ja-pekonit/makkarat",
"lenkkimakkara":"liha-ja-kasviproteiinit/makkarat-nakit-ja-pekonit/makkarat",
"tonnikala":"hillot-ja-sailykkeet/kala-ja-ayriaissailykkeet/tonnikalasailykkeet",
"maito":"maito-munat-ja-rasvat/maidot-ja-piimat/maidot",
"ruokakerma":"maito-munat-ja-rasvat/kermat/ruokakermat",
"kermaviili":"maito-munat-ja-rasvat/kermat/kermaviilit",
"smetana":"maito-munat-ja-rasvat/kermat/smetanat",
"voi":"maito-munat-ja-rasvat/rasvat/voi",
"juustoraaste":"juustot-tofut-ja-kasvipohjaiset/ruoka-ja-herkuttelujuustot/juustoraasteet",
"parmesaani":"juustot-tofut-ja-kasvipohjaiset/ruoka-ja-herkuttelujuustot/parmesaanijuustot",
"fetajuusto":"juustot-tofut-ja-kasvipohjaiset/ruoka-ja-herkuttelujuustot/feta-ja-salaattijuustot",
"sipuli":"hedelmat-ja-vihannekset/vihannekset/sipulit",
"punasipuli":"hedelmat-ja-vihannekset/vihannekset/sipulit",
"porkkana":"hedelmat-ja-vihannekset/juurekset",
"bataatti":"hedelmat-ja-vihannekset-1/juurekset/muut-juurekset",
"lanttu":"hedelmat-ja-vihannekset/juurekset/lantut",
"valkokaali":"hedelmat-ja-vihannekset/vihannekset/kaalit",
"kukkakaali":"hedelmat-ja-vihannekset/vihannekset/kaalit",
"paprika":"hedelmat-ja-vihannekset/vihannekset/paprikat",
"kesäkurpitsa":"hedelmat-ja-vihannekset/vihannekset/kurpitsat",
"kirsikkatomaatit":"hedelmat-ja-vihannekset/vihannekset/tomaatit",
"herkkusienet":"hedelmat-ja-vihannekset/sienet",
"fenkoli":"hedelmat-ja-vihannekset/vihannekset/muut-vihannekset",
"purjo":"hedelmat-ja-vihannekset/vihannekset/muut-vihannekset",
"pinaatti":"pakasteet/kasvispakasteet/yksittaiset-kasvikset",
"herneet":"pakasteet/kasvispakasteet/yksittaiset-kasvikset",
"wok-vihannekset":"pakasteet/kasvispakasteet/kasvissekoitukset",
"valkosipulinkynsi":"hedelmat-ja-vihannekset/vihannekset",
"sitruuna":"hedelmat-ja-vihannekset/hedelmat/sitruunat",
"persilja":"hedelmat-ja-vihannekset/yrtit",
"tilli":"hedelmat-ja-vihannekset/yrtit",
"suolakurkku":"hillot-ja-sailykkeet/kurkku-ja-punajuurisailykkeet/suolakurkut",
"maissi":"hillot-ja-sailykkeet/kasvissailykkeet/muut-vihannessailykkeet",
"kuivatut herneet":"hillot-ja-sailykkeet/kasvissailykkeet/muut-vihannessailykkeet",
"kidneypavut":"hillot-ja-sailykkeet/kasvissailykkeet/linssit-pavut-ja-kikherneet",
"kikherneet":"hillot-ja-sailykkeet/kasvissailykkeet/linssit-pavut-ja-kikherneet",
"punaiset linssit":"hillot-ja-sailykkeet/kasvissailykkeet/linssit-pavut-ja-kikherneet",
"kookosmaito":"hillot-ja-sailykkeet/kookosmaidot-ja-kermat",
"tomaattimurska":"hillot-ja-sailykkeet/kasvissailykkeet/tomaattimurskat",
"tomaattipyree":"hillot-ja-sailykkeet/kasvissailykkeet/tomaattipyreet",
"pesto":"oljyt-maustaminen-ja-kastikkeet/maustekastikkeet-ja-tahnat/pestokastikkeet",
"puolukkahillo":"hillot-ja-sailykkeet/hillot/puolukkahillot",
"lasagnelevyt":"pastat-riisit-ja-nuudelit/pastat/lasagnet",
"spagetti":"pastat-riisit-ja-nuudelit/pastat/spagetit",
"pasta":"pastat-riisit-ja-nuudelit/pastat/spagetit",
"makaroni":"pastat-riisit-ja-nuudelit/pastat/makaronit",
"riisi":"pastat-riisit-ja-nuudelit/riisit/pitkajyvaiset-riisit",
"risottoriisi":"pastat-riisit-ja-nuudelit/riisit/risotto-ja-sushiriisit",
"vehnäjauho":"kuivatuotteet-ja-leivonta/jauhot-ja-leivontaseokset/vehnajauhot",
"ruisjauho":"kuivatuotteet-ja-leivonta/jauhot-ja-leivontaseokset/ruisjauhot",
"korppujauho":"kuivatuotteet-ja-leivonta/jauhot-ja-leivontaseokset/korppujauhot",
"liemikuutio":"oljyt-maustaminen-ja-kastikkeet/liemivalmisteet-ja-fondit/lihaliemet",
"kanaliemikuutio":"oljyt-maustaminen-ja-kastikkeet/liemivalmisteet-ja-fondit/kanaliemet",
"lihaliemikuutio":"oljyt-maustaminen-ja-kastikkeet/liemivalmisteet-ja-fondit/lihaliemet",
"kasvisliemikuutio":"oljyt-maustaminen-ja-kastikkeet/liemivalmisteet-ja-fondit/kasvisliemet",
"kalaliemikuutio":"oljyt-maustaminen-ja-kastikkeet/liemivalmisteet-ja-fondit/kasvisliemet",
"kanaliemi":"oljyt-maustaminen-ja-kastikkeet/liemivalmisteet-ja-fondit/kanaliemet",
"lihaliemi":"oljyt-maustaminen-ja-kastikkeet/liemivalmisteet-ja-fondit/lihaliemet",
"oliiviöljy":"oljyt-maustaminen-ja-kastikkeet/oljyt/oliivioljyt",
"soijakastike":"oljyt-maustaminen-ja-kastikkeet/maustekastikkeet-ja-tahnat/soijakastikkeet"
};
/* lisähinnat s-kaupat.fi 19.11.2026: mediaani tavallisista tuotteista (ei luomu, maustetut tai erikoistuotteet) */
const P2=(k,p,per,src,o,w,u)=>P(k,p,per,src,o,w,u,"2026-11-19");
P2("kurkku",3.49,"kg","Kurkku (kotimainen, irto)",{kpl:350},"Vain yksi tuote.","hedelmat-ja-vihannekset/vihannekset");
P2("tomaatti",4.09,"kg","Tomaatti (irto)",{kpl:100},"Vain yksi tuote.","hedelmat-ja-vihannekset/vihannekset/tomaatit");
P2("salaatti",15.92,"kg","Ruukkusalaatti 125 g",{kpl:125},"Vain yksi tuote.","hedelmat-ja-vihannekset/vihannekset");
P2("parsakaali",3.3,"kg","Parsakaali 300 g",{kpl:300},"Vain yksi tuote.","hedelmat-ja-vihannekset/vihannekset/kaalit");
P2("jäävuorisalaatti",3.69,"kg","Jäävuorisalaatti (irto)",{kpl:500},"Vain yksi tuote.","hedelmat-ja-vihannekset/vihannekset");
P2("kevätsipuli",24.9,"kg","Kevätsipulinippu 100 g",{nippu:100},"Vain yksi tuote.","hedelmat-ja-vihannekset/vihannekset/sipulit");
P2("tuore chili",14,"kg","Chili punainen (irto)",{kpl:15},"Vain yksi tuote.","hedelmat-ja-vihannekset/vihannekset");
P2("banaani",1.79,"kg","Banaani (ei luomu)",{kpl:150},"","hedelmat-ja-vihannekset/hedelmat/banaanit");
P2("avokado",7.38,"kg","Avokado (irto ja rasia)",{kpl:200},"","hedelmat-ja-vihannekset/hedelmat/avokadot");
P2("viinirypäleet",6.98,"kg","Siemenetön viinirypäle 500 g",{},"","hedelmat-ja-vihannekset/hedelmat/rypaleet");
P2("omena",2.79,"kg","Omenat (irto, ei luomu)",{kpl:150},"","hedelmat-ja-vihannekset/hedelmat/omenat");
P2("päärynä",2.49,"kg","Päärynät (irto ja rasia)",{kpl:180},"","hedelmat-ja-vihannekset/hedelmat/paarynat");
P2("lime",3.99,"kg","Lime (irto)",{kpl:70},"Vain yksi tuote.","hedelmat-ja-vihannekset/hedelmat/limet");
P2("kiivi",5.98,"kg","Kiivi 500 g",{kpl:80},"Vain yksi tuote.","hedelmat-ja-vihannekset/hedelmat");
P2("luumu",2.38,"kg","Luumu 500 g",{kpl:50},"Vain yksi tuote.","hedelmat-ja-vihannekset/hedelmat/luumut");
P2("mandariini",1.99,"kg","Satsuma 1 kg",{kpl:80},"Vain yksi tuote.","hedelmat-ja-vihannekset/hedelmat/mandariinit");
P2("appelsiini",2.09,"kg","Appelsiini (ei luomu)",{kpl:200},"","hedelmat-ja-vihannekset/hedelmat/appelsiinit");
P2("punajuuri",1.19,"kg","Punajuuri 1 kg",{kpl:150},"Vain yksi tuote.","hedelmat-ja-vihannekset/juurekset/punajuuret");
P2("palsternakka",3.37,"kg","Palsternakka (irto ja pakattu)",{kpl:200},"","hedelmat-ja-vihannekset/juurekset/palsternakat");
P2("perunajauho",2.18,"kg","Perunajauho 500 g",{},"Vain yksi tuote.","kuivatuotteet-ja-leivonta/jauhot-ja-leivontaseokset/tarkkelykset");
P2("maissitärkkelys",4.71,"kg","Maissitärkkelys 400 g",{},"","kuivatuotteet-ja-leivonta/jauhot-ja-leivontaseokset/tarkkelykset");
P2("kaurahiutaleet",1.9,"kg","Kaurahiutaleet ja pikakaurahiutaleet",{},"","kuivatuotteet-ja-leivonta/hiutaleet");
P2("mannaryyni",0.88,"kg","Mannasuurimo 1 kg",{},"Vain yksi tuote.","kuivatuotteet-ja-leivonta/hiutaleet");
P2("leivinjauhe",11.9,"kg","Leivinjauhe 100 g",{},"Vain yksi tuote.","kuivatuotteet-ja-leivonta/leivontatarvikkeet");
P2("ruokasooda",7.12,"kg","Ruokasooda 125 g",{},"Vain yksi tuote.","kuivatuotteet-ja-leivonta/leivontatarvikkeet");
P2("auringonkukansiemenet",4.47,"kg","Auringonkukansiemenet 400 g",{},"Vain yksi tuote.","kuivatuotteet-ja-leivonta/salaattipahkinat-ja-lisukkeet");
P2("pellavansiemenet",6.77,"kg","Pellavansiemenrouhe",{},"","kuivatuotteet-ja-leivonta/leseet-alkiot-rouheet");
P2("soijarouhe",6.27,"kg","Tumma soijarouhe 500 g",{},"","kuivatuotteet-ja-leivonta/leseet-alkiot-rouheet");
P2("rypsiöljy",4.38,"l","Rypsi- ja rapsiöljyt",{},"","oljyt-maustaminen-ja-kastikkeet/oljyt");
P2("majoneesi",7.83,"kg","Majoneesi (maustamaton)",{},"","oljyt-maustaminen-ja-kastikkeet/majoneesit-ja-majoneesikastikkeet");
P2("tomaattiketsuppi",3.96,"kg","Tomaattiketsuppi (tavallinen)",{},"","oljyt-maustaminen-ja-kastikkeet/ketsupit-ja-sinapit");
P2("maitorahka",3.45,"kg","Maitorahka (maustamaton)",{},"","maito-munat-ja-rasvat/rahkat-vanukkaat-ja-jalkiruoka");
P2("turkkilainen jogurtti",3.79,"kg","Turkkilainen ja kreikkalainen jogurtti (maustamaton)",{},"","maito-munat-ja-rasvat/jogurtit");
P2("creme fraiche",4.6,"kg","Creme fraiche 150 g",{},"Vain yksi tuote.","maito-munat-ja-rasvat/kermat");
P2("piimä",1.49,"l","Piimä 1 l",{},"Vain yksi tuote.","maito-munat-ja-rasvat/maidot-ja-piimat");
P2("margariini",2.47,"kg","Margariini 40 % 400 g",{},"Vain yksi tuote.","maito-munat-ja-rasvat/rasvat");
P2("kauramaito",1.25,"l","Kaurajuoma (ei barista)",{},"","maito-munat-ja-rasvat/kasvipohjaiset-juomat");
P2("kermajuusto",6.72,"kg","Kermajuusto (pala)",{},"","juustot-tofut-ja-kasvipohjaiset/pala-ja-viipalejuustot");
P2("raejuusto",5.93,"kg","Raejuusto",{},"","juustot-tofut-ja-kasvipohjaiset/ruoka-ja-herkuttelujuustot");
P2("mozzarella",9.48,"kg","Mozzarella (pallo)",{kpl:125},"","juustot-tofut-ja-kasvipohjaiset/ruoka-ja-herkuttelujuustot");
P2("leipäjuusto",15.9,"kg","Leipäjuusto 500 g",{},"Vain yksi tuote.","juustot-tofut-ja-kasvipohjaiset/ruoka-ja-herkuttelujuustot");
P2("sininen juusto",17.59,"kg","Sinihomejuusto 170 g",{},"Vain yksi tuote.","juustot-tofut-ja-kasvipohjaiset/ruoka-ja-herkuttelujuustot");
P2("tofu",6.72,"kg","Maustamaton tofu",{},"Lähes kaikki ovat luomua.","juustot-tofut-ja-kasvipohjaiset/tofut-ja-kasvipohjaiset");
P2("puuroriisi",2.25,"kg","Puuroriisi 1 kg (ei luomu)",{},"","pastat-riisit-ja-nuudelit/riisit");
P2("nuudelit",8.56,"kg","Pikanuudelit",{},"Vain maustettuja pikanuudeleita.","pastat-riisit-ja-nuudelit/nuudelit");
P2("riisinuudeli",5.56,"kg","Riisinuudeli 250 g",{},"Vain yksi tuote.","pastat-riisit-ja-nuudelit/nuudelit");
P2("couscous",3.58,"kg","Couscous 500 g",{},"Vain yksi tuote.","pastat-riisit-ja-nuudelit/kvinoa-couscous-ja-muut-viljapohjaiset-lisukkeet");
P2("bulgur",3.09,"kg","Bulgur",{},"","pastat-riisit-ja-nuudelit/kvinoa-couscous-ja-muut-viljapohjaiset-lisukkeet");
P2("pekoni",14.46,"kg","Pekoni (ei kanapekoni)",{},"","liha-ja-kasviproteiinit/makkarat-nakit-ja-pekonit/pekonit");
P2("kasvissekoitus",4.46,"kg","Pakastevihannessekoitukset",{},"","pakasteet/kasvispakasteet/kasvissekoitukset");
P2("pinaattipakaste",5.14,"kg","Hienonnettu pinaatti 150 g",{},"","pakasteet/kasvispakasteet/yksittaiset-kasvikset");

for(const k of Object.keys(PR)){if(PU[k])PR[k].u=PBASE+PU[k];}
const PALIAS={"kanankoipi":"kanankoivet","kananmunat":"kananmuna","herkkusieni":"herkkusienet","kirsikkatomaatti":"kirsikkatomaatit","kidneypapu":"kidneypavut","kikherne":"kikherneet","porsaankyljys":"porsaankyljykset","kasvisliemi":"kanaliemi","herne":"herneet","punasipulit":"punasipuli","sipulit":"sipuli","porkkanat":"porkkana","perunat":"peruna","nauta":"naudanliha","sika":"porsaanliha","lasagnelevy":"lasagnelevyt","linssit":"punaiset linssit","valkosipuli":"valkosipulinkynsi","kookosmaito":"kookosmaito","rahka":"maitorahka","maustamaton tofu":"tofu","broilerinfilee":"kananrintafilee","sekajauheliha":"sika-nauta jauheliha","paistijauheliha":"jauheliha","kaurajuoma":"kauramaito","omenat":"omena","banaanit":"banaani","tomaatit":"tomaatti","kurkut":"kurkku"};
const PSKIP=new Set(["suola","pippuri","mustapippuri","maustepippuri","paprikajauhe","chilijauhe","kumina","oregano","timjami","yrttimauste","tacomauste","currytahna","laakerinlehti","inkivääri","siirappi","sinappi","kaprikset","tartarkastike","vesi","sokeri","persilja jauhe","curry","meirami","muskotti","kardemumma","neilikka","kurkuma","korianterinsiemen","rosmariini","sitruunapippuri","italialainen mausteseos","chiliflakes","kaneli","juustokumina","garam masala","vaniljasokeri","merisuola","sriracha","kahvi","liivate","nonparellit","valkopippuri"]);
const PKEYS=Object.keys(PR).sort((a,b)=>b.length-a.length);
const wordHit=(name,k)=>name===k||name.startsWith(k+" ")||name.endsWith(" "+k)||name.includes(" "+k+" ");
/* ---------- ainesosarekisteri: Fineli (THL), CC BY 4.0, Release 16 ---------- */
/* avain|synonyymit|tuoteryhmä|pääraaka-aine|g/dl,g/rkl,g/tl,g/kpl,g/prk,g/nippu|kcal,proteiini,rasva,tyydyttynyt,hiilihydraatti,suola (/100 g)|1=ei lasketa|Finelin tunnus|Finelin nimi */
const CAT=ING_RAW.split("\n").map(l=>{
  const p=l.split("|"),u=(p[4]||"").split(","),n=p[5]?p[5].split(",").map(Number):null;
  return{key:p[0],syn:p[1]?p[1].split(","):[],d:+p[2],m:p[3]||"",u:{dl:+u[0]||0,rkl:+u[1]||0,tl:+u[2]||0,kpl:+u[3]||0,prk:+u[4]||0,nippu:+u[5]||0},fid:p[7]||"",fname:p[8]||"",
    n:n?{kcal:n[0]||0,prot:n[1]||0,fat:n[2]||0,sat:n[3]||0,carb:n[4]||0,salt:n[5]||0}:null,neg:p[6]==="1",pan:p[9]==="1"};
});
const CIDX=new Map();
for(const e of CAT)CIDX.set(e.key,e);
for(const e of CAT)for(const s of e.syn)if(!CIDX.has(s))CIDX.set(s,e);
let CKEYS=[...CIDX.keys()].sort((a,b)=>b.length-a.length);
const CBYK=new Map(CAT.map(e=>[e.key,e]));
for(const e of CAT){e.o={d:e.d,m:e.m,n:e.n,u:e.u,syn:e.syn,neg:e.neg,pan:e.pan};e.pk=null;e.ov=false;e.url="";}
const nEq=(a,b)=>!!a&&!!b&&["kcal","prot","fat","sat","carb","salt"].every(k=>Math.abs((a[k]||0)-(b[k]||0))<0.005);
/* omat muutokset valmiisiin aineksiin (state.ix) ja omien synonyymit: rakennetaan haku uudelleen */
function rebuildCat(){
  const ix=(state&&state.ix)||{};
  for(const e of CAT){
    const x=ix[e.key],o=e.o;
    e.ov=!!x;
    e.d=x?x.d:o.d;e.m=x?(x.m||""):o.m;e.n=x?(x.n||null):o.n;
    e.u=x?Object.assign({dl:0,rkl:0,tl:0,kpl:0,prk:0,nippu:0},x.u||{}):o.u;
    e.syn=x&&x.syn?x.syn:o.syn;
    e.neg=x?(o.neg&&(!x.n||nEq(x.n,o.n))):o.neg;
    e.pan=x?x.pan===true:o.pan;
    e.pk=x&&x.pk?x.pk:null;e.url=(x&&x.url)||"";
  }
  CIDX.clear();CMEMO.clear();USYN.clear();
  for(const e of CAT)CIDX.set(e.key,e);
  for(const e of CAT)for(const s of e.syn)if(!CIDX.has(s))CIDX.set(s,e);
  const gi=(state&&state.ing)||{};
  for(const k of Object.keys(gi))for(const s of (gi[k].syn||[]))if(!CIDX.has(s)&&!gi[s]&&!USYN.has(s))USYN.set(s,k);
  CKEYS=[...CIDX.keys()].sort((a,b)=>b.length-a.length);
}
const CMEMO=new Map();
function catFind(key){
  if(CMEMO.has(key))return CMEMO.get(key);
  let r=CIDX.get(key)||CIDX.get(PALIAS[key]||"")||null;
  if(!r)for(const x of CKEYS)if(wordHit(key,x)){r=CIDX.get(x);break;}
  CMEMO.set(key,r);return r;
}
const fold=s=>String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
/* sumea haku: 0 alku, 1 sanan alku, 2 sisältää, 3–4 kirjoitusvirhe, -1 ei osu */
function lev(a,b,mx){
  if(Math.abs(a.length-b.length)>mx)return mx+1;
  let pp=null,p=Array.from({length:b.length+1},(_,j)=>j);
  for(let i=1;i<=a.length;i++){
    const c=[i];let lo=i;
    for(let j=1;j<=b.length;j++){
      let v=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));
      if(pp&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])v=Math.min(v,pp[j-2]+1);
      c[j]=v;if(v<lo)lo=v;
    }
    if(lo>mx)return mx+1;pp=p;p=c;
  }
  return p[b.length];
}
/* taivutettu nimi rekisterin muotoon: porkkanaa -> porkkana, voita -> voi */
function normIngName(n){
  const k=String(n).trim().toLowerCase().replace(/\s+/g," ");
  if(state.ing[k]||PR[k])return k;
  if(USYN.has(k))return USYN.get(k);
  if(CIDX.has(k))return CIDX.get(k).key;
  const ok=x=>x&&(CIDX.has(x)||state.ing[x]||PR[x]||SYN[x]||catFind(x));
  if(ok(k))return k;
  const c=[];
  if(/[aä]$/.test(k))c.push(k.slice(0,-1));
  if(/t[aä]$/.test(k))c.push(k.slice(0,-2));
  if(/tteja$/.test(k))c.push(k.replace(/tteja$/,"tti"),k.replace(/tteja$/,"tit"));
  if(/oita$/.test(k))c.push(k.replace(/oita$/,"a"),k.replace(/oita$/,"at"));
  if(/öitä$/.test(k))c.push(k.replace(/öitä$/,"ä"));
  if(/ia$|iä$/.test(k))c.push(k.slice(0,-2)+"i");
  if(/eita$|eitä$/.test(k))c.push(k.replace(/it[aä]$/,""),k.replace(/eit[aä]$/,"i"));
  for(const x of c)if(ok(x))return CIDX.has(x)?CIDX.get(x).key:x;
  return k;
}
function fzScore(q,name){
  if(!q)return 0;
  if(name.startsWith(q))return 0;
  if(name.includes(" "+q)||name.includes("-"+q))return 1;
  if(name.includes(q))return 2;
  if(q.length<4)return -1;
  const tol=q.length>=8?2:1;
  for(const w of name.split(/[\s,()-]+/)){
    if(!w)continue;
    if(lev(q,w,tol)<=tol)return 3;
    if(w.length>q.length&&lev(q,w.slice(0,q.length),tol)<=tol)return 4;
  }
  return -1;
}
function fzBest(q,names){let b=-1;for(const n of names){const s=fzScore(q,fold(n));if(s>=0&&(b<0||s<b))b=s;}return b;}
/* grammat määrästä: ensin käsin asetetut hintatiedon muunnokset, sitten Finelin */
function gramsOf(key,fam,v){
  if(v==null||!isFinite(v))return null;
  if(fam==="g")return v;
  const bk=baseKey(PALIAS[key]||key),e=bk?PR[bk]:null,c=catFind(key),ui=state.ing[key];
  const cu=ui?(ui.u||{}):(c?c.u:{}),ou=(ui||(c&&c.ov))?cu:null;
  const dl=(ou&&ou.dl)||(e&&e.dl)||cu.dl||0;
  const liquid=e&&e.per==="l";
  if(fam==="ml")return dl?v/100*dl:(liquid?v:null);
  if(fam==="rkl")return dl?v*0.15*dl:(cu.rkl?v*cu.rkl:(liquid?v*15:null));
  if(fam==="tl")return dl?v*0.05*dl:(cu.tl?v*cu.tl:(liquid?v*5:null));
  if(fam==="kpl"){const g=(ou&&ou.kpl)||(e&&e.kpl)||cu.kpl;return g?v*g:null;}
  if(fam==="prk"||fam==="pss"||fam==="nippu"){
    const q=(ou&&ou[fam])||(e&&e[fam]);
    if(q)return liquid?q*v*(dl||100)/100:q*v;
    return cu[fam]?cu[fam]*v:null;
  }
  return null;
}
/* ravintoarvot reseptille: yhteensä ja miss-lista aineksista, joille arvoa ei saatu */
function nutData(key){
  const ui=state.ing[key];
  if(ui)return{own:true,n:ui.n||null,neg:false,d:ui.d,m:ui.m,u:ui.u||{},url:ui.url||""};
  const c=catFind(key);
  return c?{own:false,n:c.n,neg:c.neg,d:c.d,m:c.m.replace("?",""),u:c.u,c}:null;
}
function recipeNut(r){
  const t={kcal:0,prot:0,fat:0,sat:0,carb:0,salt:0};
  let n=0,big=false;const miss=[];
  for(const line of ingOf(r)){
    const p=parseIng(line),c=nutData(p.key);
    if(c&&c.neg)continue;
    if(p.v==null)continue;
    const g=c&&c.n?gramsOf(p.key,p.fam,p.v):null;
    if(g==null){miss.push(p.name);if(!(p.fam==="g"&&p.v<30)&&!(p.fam==="ml"&&p.v<30)&&!(p.fam==="tl")&&!(p.fam==="rkl"&&p.v<=2)&&p.fam!=="ripaus"&&!nameSkip(p.key))big=true;continue;}
    for(const k of Object.keys(t))t[k]+=c.n[k]*g/100;
    n++;
  }
  return{t,n,miss,big};
}
function nutPer(r){
  const x=recipeNut(r);
  if(!x.n||x.big)return null;
  const s=pvOf(r),p={};
  for(const k of Object.keys(x.t))p[k]=x.t[k]/s;
  return{per:p,miss:x.miss,full:!x.miss.length};
}
/* pääraaka-aine ainesten mukaan; käsin valittu (mo) ohittaa */
function autoMain(r){
  const sc={},wk={};let any=false;
  for(const line of selR(r).ing){
    const p=parseIng(line);any=true;
    const ui=state.ing[p.key];
    let code="",w=false;
    if(ui)code=ui.m||"";
    else{const c=catFind(p.key);if(c&&c.m){code=c.m;if(code.endsWith("?")){code=code[0];w=true;}}}
    if(!code||!M[code])continue;
    const g=gramsOf(p.key,p.fam,p.v)||100;
    const o=w?wk:sc;o[code]=(o[code]||0)+g;
  }
  for(const o of [sc,wk]){
    let best="",bv=0;
    for(const[k,v]of Object.entries(o))if(v>bv){best=k;bv=v;}
    if(best)return best;
  }
  return any?"v":"";
}
function mainOf(r){
  if(r.mo&&M[r.mo])return r.mo;
  if(r.vs&&r.vs.length){const v=selOf(r,state.tv[r.id]).ver;if(v&&v.veg)return"v";if(v&&M[v.m])return v.m;}
  const a=autoMain(r);
  return a||(r.custom?"":(M[r.m]?r.m:""));
}
const gp=k=>Object.prototype.hasOwnProperty.call(state.prices,k)?state.prices[k]:null;
const pad2=n=>String(n).padStart(2,"0");
const todayIso=()=>{const n=new Date();return n.getFullYear()+"-"+pad2(n.getMonth()+1)+"-"+pad2(n.getDate());};
const fmtD=iso=>{const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(iso||"");return m?(+m[3])+"."+(+m[2])+"."+m[1]:"";};
function isStale(iso){
  const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(iso||"");if(!m)return false;
  const lim=new Date();lim.setMonth(lim.getMonth()-6);
  return new Date(+m[1],+m[2]-1,+m[3])<lim;
}
function baseKey(k){
  if(PR[k])return k;
  for(const x of PKEYS)if(wordHit(k,x))return x;
  return null;
}
function findPrice(key){
  const k=PALIAS[key]||key;
  let bk=baseKey(k);
  if(!bk&&!gp(key)&&!gp(k)){const c=catFind(key);if(c&&PR[c.key])bk=c.key;}
  const u=gp(key)||gp(k)||(bk?gp(bk):null);
  if(!u&&!bk)return null;
  const e=Object.assign({},bk?PR[bk]:{});
  if(u){e.p=u.p;e.per=u.per;e.u=u.url;e.d=u.date;e.w="";e.usr=true;}
  e.k=k;
  return e;
}
/* automaattinen raja kaikille aineksille: alle SKIP_EUR:n osuutta reseptistä ei lasketa hintaan */
const SKIP_EUR=0.1;
function nameSkip(key){
  if(PSKIP.has(key))return true;
  return [...PSKIP].some(x=>wordHit(key,x));
}
/* vähän kuluvat: lista, katalogin pieni-käyttöinen aines tai osasto Öljyt ja mausteet (myös omat ainekset) */
function pantryHit(key){
  if(nameSkip(key))return true;
  const ui=state.ing[key];
  if(ui)return !!ui.pan||ui.d===6;
  const c=catFind(key);
  return !!(c&&(c.neg||c.pan));
}
function isSkip(key){return nameSkip(key);}
/* hinta yhdelle ainekselle: {t:"ok",c,w}, {t:"skip"}, {t:"none"} tai {t:"conv"} */
function costOf(key,fam,v){
  const x=costOf0(key,fam,v);
  if(x.t==="ok"?x.c<SKIP_EUR:pantryHit(key))return{t:"skip"};
  return x;
}
function costBake(key,fam,v){
  const x=costOf0(key,fam,v);
  if(x.t==="ok")return x.c<SKIP_EUR?{t:"skip"}:x;
  return pantryHit(key)?{t:"skip"}:x;
}
function costOf0(key,fam,v){
  const e=findPrice(key);
  if(!e)return{t:"none"};
  let c=null;
  const ui0=state.ing[key],c0=catFind(key),ui=ui0||(c0&&c0.ov?c0:null),cu=ui0?(ui0.u||{}):((c0||{}).u||{});
  if(e.per==="kpl"){
    if(fam==="kpl"||fam==="prk"||fam==="pss"||fam==="nippu")c=e.p*v;
    else{const kg=cu.kpl||e.kpl||cu.nippu,g=gramsOf(key,fam,v);if(kg&&g!=null)c=e.p*g/kg;}
  }else if(e.per==="kg"){
    let g=null;
    const dl=(ui&&cu.dl)||e.dl||cu.dl||(e.usr?100:0),kg=(ui&&cu.kpl)||e.kpl||cu.kpl;
    if(fam==="g")g=v;
    else if(fam==="ml"&&dl)g=v/100*dl;
    else if(fam==="rkl"&&dl)g=v*0.15*dl;
    else if(fam==="tl"&&dl)g=v*0.05*dl;
    else if(fam==="rkl"&&cu.rkl)g=v*cu.rkl;
    else if(fam==="tl"&&cu.tl)g=v*cu.tl;
    else if(fam==="kpl"&&kg)g=v*kg;
    else if(fam==="prk"&&((ui&&cu.prk)||e.prk||cu.prk))g=v*((ui&&cu.prk)||e.prk||cu.prk);
    else if(fam==="pss"&&((ui&&cu.pss)||e.pss||cu.pss))g=v*((ui&&cu.pss)||e.pss||cu.pss);
    else if(fam==="nippu"&&((ui&&cu.nippu)||e.nippu||cu.nippu))g=v*((ui&&cu.nippu)||e.nippu||cu.nippu);
    if(g!=null)c=e.p*g/1000;
  }else if(e.per==="l"){
    let ml=null;
    if(fam==="ml")ml=v;
    else if(fam==="rkl")ml=v*15;
    else if(fam==="tl")ml=v*5;
    else if(fam==="prk"&&(e.prk||cu.prk))ml=v*(e.prk||cu.prk);
    if(ml!=null)c=e.p*ml/1000;
  }
  return c==null?{t:"conv"}:{t:"ok",c,w:!!e.w,s:isStale(e.d)};
}
const eur=v=>(Math.round(v*100)/100).toFixed(2).replace(".",",")+" €";
const eur1=v=>(Math.round(v*10)/10).toFixed(1).replace(".",",")+" €";
const eur2=v=>(Math.round(v*100)/100).toFixed(2).replace(".",",")+" €";
/* kesto: 45 min, 1 h 30 min, 13 h; pitkä lepo (yön yli) näytetään sanoin */
const fmtDur=m=>{m=Math.round(+m||0);if(m<60)return m+" min";if(m>=720)return Math.round(m/60)+" h";const h=Math.floor(m/60),k=m%60;return h+" h"+(k?" "+k+" min":"");};
const timeTxt=r=>{const w=workOf(r),wait=r.min-w;
  const rest=wait>=600&&/yön yli|yöksi/.test((r.steps||[]).join(" "))?"yön yli":wait>=1200?Math.round(wait/1440)+" vrk":"";
  return rest?(w>0?fmtDur(w)+" + "+rest:rest):fmtDur(r.min);};
const servOf=r=>state.serv[r.id]||defServ(r.id);
const PCH=[2,4,6,8,10];
const nearP=n=>n<=2?2:n>=10?10:(n%2?n+1:n);
/* leivonnaisissa (annos = pala tai keksi) määrä valitaan erinä, muissa annoksina 2–10 */
const isBatch=r=>!!r&&(r.t==="le"||!!r.batch);
const baseP=r=>isBatch(r)?servOf(r):nearP(servOf(r));
const pvOf=r=>state.pv[r.id]||baseP(r);
function setPv(id,n){const r=byId(id),b=r?baseP(r):nearP(defServ(id));if(n===b)delete state.pv[id];else state.pv[id]=n;}
function scaleLine(line,f){
  if(f===1)return line;
  const p=parseIng(line);if(p.q==null)return line;
  let q=p.q*f;q=q>=100?Math.round(q/5)*5:Math.round(q*100)/100;
  return p.rawName+" "+String(q)+(p.u?" "+p.u:"");
}
/* versiot ja muunnelmat: valinta tallennetaan reseptikohtaisesti kuten annosmäärä */
const hasOpt=r=>!!((r.vs&&r.vs.length)||(r.tw&&r.tw.length));
const keyOfLine=l=>parseIng(l).key;
const selR=r=>hasOpt(r)?applySel(r,state.tv[r.id],keyOfLine):{ing:r.ing,gr:r.gr||[],steps:r.steps,mods:[]};
const stepsOf=r=>selR(r).steps;
const ingOf=r=>{const f=pvOf(r)/servOf(r),a=selR(r).ing;return f===1?a:a.map(l=>scaleLine(l,f));};
function setSel(id,fn){const r=byId(id);if(!r)return;const c=state.tv[id]||{},n={v:c.v,t:[...(c.t||[])]};fn(n);
  const e={};if(n.v&&r.vs&&r.vs.length&&n.v!==r.vs[0].id)e.v=n.v;if(n.t.length)e.t=n.t;
  if(e.v||e.t)state.tv[id]=e;else delete state.tv[id];mutate();}
function recipeCost(r,all0){
  let sum=0,n=0,weak=false,big=false,stale=false;const miss=[],lines=[];
  for(const line of ingOf(r)){
    const p=parseIng(line);
    if(p.v==null){lines.push(null);continue;}
    const x=all0?costOf0(p.key,p.fam,p.v):isBatch(r)?costBake(p.key,p.fam,p.v):costOf(p.key,p.fam,p.v);
    if(x.t==="ok"){sum+=x.c;n++;if(x.w&&x.c>=1)weak=true;if(x.s)stale=true;lines.push(x);}
    else{lines.push(x);if(x.t!=="skip"){miss.push(p.name);if(p.fam==="g"&&p.v>=300)big=true;}}
  }
  if(!n&&!all0&&r.ing.length)return recipeCost(r,true);
  return{sum,n,miss,weak,lines,big,stale};
}
const f0=v=>String(Math.round(v)).replace(".",",");
const f1=v=>String(Math.round(v*10)/10).replace(".",",");
const fs=v=>v<1?String(Math.round(v*100)/100).replace(".",","):f1(v);
function nutChip(r){
  const x=nutPer(r);
  return x?`<span class="mn nu">${x.full?"":"väh. "}${f0(x.per.kcal)} kcal</span><span class="mn nu">${f0(x.per.prot)} g prot.</span>`:"";
}
let nutOpen=false,ingOpen=true,stepOpen=false;
const accHtml=(key,icon,title,open,inner,right)=>`<section class="acc acc-${key}"><button type="button" class="accb" data-acc="${key}" aria-expanded="${open}" aria-controls="acc-${key}">${ico(icon)}<span>${title}</span>${right||""}${ico("chev")}</button>${open?`<div class="accp" id="acc-${key}">${inner}</div>`:""}</section>`;
function nutHtml(r){
  const x=nutPer(r);
  if(!x){
    if(!r.ing.length)return"";
    const y=recipeNut(r);
    const why=y.miss.length?`Ravintoarvoja ei voi laskea. Näille aineksille ei ole arvoa rekisterissä tai määrää ei voi muuttaa grammoiksi: ${esc(y.miss.join(", "))}. Lisää ne <button type="button" class="lk" data-reg-open="">rekisteriin</button> tai korjaa yksikkö.`:`Ravintoarvoja ei voi laskea, koska aineksille ei ole määriä.`;
    return`<p class="note nd" style="margin:14px 2px 0">${why}</p>`;
  }
  const p=x.per;
  const inner=`<div class="nut2"><div><b>${f0(p.kcal)}</b><span>kcal / annos${x.full?"":", vähintään"}</span></div><div><b>${f0(p.prot)} g</b><span>proteiinia / annos${x.full?"":", vähintään"}</span></div></div><p class="note nd">Rasvaa ${f1(p.fat)} g (tyydyttynyttä ${f1(p.sat)} g) · hiilihydraatteja ${f1(p.carb)} g · suolaa ${fs(p.salt)} g</p>${x.miss.length?`<p class="note nd">Ei laskettu: ${esc(x.miss.join(", "))}.</p>`:""}<p class="note nd">Arvio raaka-aineiden perusteella, ei huomioi kypsennyksen vaikutusta. Ravintoarvot: <a href="https://fineli.fi" target="_blank" rel="noopener noreferrer">Fineli, THL</a>, CC BY 4.0.</p>`;
  return accHtml("nut","flame","Ravintoarvot / annos",nutOpen,inner);
}
/* hinta kortille; leivonnaisissa annos on yksi pala tai keksi, joten näytetään koko taikinan hinta */
function priceTxt(r){
  const c=recipeCost(r);
  if(!c.n||c.big)return"";
  const pre=c.miss.length?"väh. ":"";
  if(isBatch(r))return pre+eur1(c.sum*servOf(r)/pvOf(r))+" / erä";
  const per=c.sum/pvOf(r);
  return pre+(per<0.95?eur2(per):eur1(per))+" / annos";
}
function priceTag(r){const t=priceTxt(r);return t?`<b class="pr">${t}</b>`:"";}
/* ---------- tila ja tallennus ---------- */
const LS="ruokaideat-v1";
const todayLocal=todayIso;
function mkName(date,lists){
  const d=new Date(date+"T12:00:00");
  const base="Ostoslista"+(isNaN(d)?"":" "+d.getDate()+"."+(d.getMonth()+1)+"."+d.getFullYear());
  let n=base,k=2;while(lists.some(l=>l.name===n))n=base+" ("+(k++)+")";
  return n;
}
function actList(o){return o.lists.find(l=>l.id===o.act)||o.lists[o.lists.length-1]||null;}
function aliasState(o){
  Object.defineProperties(o,{
    cart:{configurable:true,enumerable:false,get(){const l=actList(this);return l?l.cart:[];},set(v){const l=actList(this);if(l)l.cart=v;}},
    checked:{configurable:true,enumerable:false,get(){const l=actList(this);return l?l.checked:[];},set(v){const l=actList(this);if(l)l.checked=v;}}
  });
  return o;
}
let state=aliasState({custom:[],lists:[],act:"",over:{},hidden:[],serv:{},prices:{},fav:[],sort:"fav",img:{},views:{},ing:{},xh:{},sp:false,rv:false,th:"auto",lay:"grid",sr:[],pv:{},pair:{},sk:{},nos:[],ix:{},ot:{},store:"",so:{},sx:{},rc:[],dv:2,vk:[],pl:PL.defaultPlan()});
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
function cleanState(x){return aliasState(cleanState0(x));}
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
function lsLoad(){try{const v=localStorage.getItem(LS);return v?JSON.parse(v):null;}catch(e){return null;}}
function lsSave(){try{localStorage.setItem(LS,JSON.stringify(state));}catch(e){}}
async function flush(){
  saving=true;
  try{while(dirty&&remote){dirty=false;await remote.set({json:JSON.stringify(state)});}}
  catch(e){remote=null;}
  saving=false;
}
function persist(){lsSave();if(!remote)return;dirty=true;if(!saving)flush();}
function applyTheme(){const t=state.th||"auto",d=t==="dark"||(t==="auto"&&window.matchMedia&&matchMedia("(prefers-color-scheme:dark)").matches);document.documentElement.dataset.theme=d?"dark":"light";document.querySelectorAll("[data-th]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.th===(state.th||"auto")));applyLay();}
try{matchMedia("(prefers-color-scheme:dark)").addEventListener("change",applyTheme);}catch(e){}
const BAR={plan:"Seuraavat ruoat",ideas:"Mitä tänään syödään?",add:"Lisää oma ruoka",cart:"Ostoslistat",reg:"Ainesosarekisteri"};
function setBar(n,t){document.body.dataset.view=n;$("ttl").textContent=t||BAR[n];}
function mutate(){touched=true;persist();try{updBadge();}catch(e){}}

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
function startRemote(tries){
  if(window.claude&&typeof window.claude.use==="function"){initRemote();return;}
  if(tries>0)setTimeout(()=>startRemote(tries-1),1000);
}

/* ---------- ruokalista ---------- */
const ov=r=>state.over[r.id]?{...r,...state.over[r.id]}:r;
const all=()=>R.filter(r=>!state.hidden.includes(r.id)).map(ov).concat(state.custom);
const byId=id=>all().find(r=>r.id===id);
const inCart=id=>state.cart.includes(id);
/* ---------- automaattiset tägit ---------- */
const KEVYT_KCAL=500,KEVYT_SAT=7;
/* Edullinen: pääruoista halvin kolmannes annoshinnan mukaan. Raja lasketaan kerran
 * renderöintiä kohden ja seuraa näin hintojen ja reseptien muutoksia. */
const CHEAP_T=new Set(["pa","ki","ke","uu","pn","ps","sa","wo","pi","ha"]),CHEAP_SHARE=1/3;
const cheapPer=r=>{if(!CHEAP_T.has(r.t))return null;const c=recipeCost(r);return c.n&&!c.big&&!c.miss.length?c.sum/pvOf(r):null;};
let cheapMemo=null;
function cheapLimit(){
  if(cheapMemo==null){
    const a=all().map(cheapPer).filter(v=>v!=null).sort((x,y)=>x-y);
    cheapMemo=a.length?a[Math.max(0,Math.ceil(a.length*CHEAP_SHARE)-1)]:-1;
    queueMicrotask(()=>{cheapMemo=null;});
  }
  return cheapMemo;
}
function autoTags(r){
  const a=new Set();
  if(r.min>0&&r.min<=30)a.add("n");
  const per=cheapPer(r);
  if(per!=null&&per<=cheapLimit())a.add("e");
  const nu=nutPer(r);
  if(nu&&nu.full&&r.t!=="le"&&r.t!=="ja"&&nu.per.kcal<=KEVYT_KCAL&&nu.per.sat<=KEVYT_SAT)a.add("k");
  return a;
}
function tagsOf(r){
  const a=autoTags(r);
  for(const k of r.kq||[])a.add(k);
  return Object.keys(S).filter(k=>a.has(k));
}
const MEAL_MAIN=new Set(["pa","ki","ke","uu","pn","ps","sa","wo","pi","ha"]),MEAL_BRK=new Set(["pu","am","vp"]),MEAL_BAKE=new Set(["le","ja"]);
function mealOf(r){
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
function sideNeeds(r){
  if(!r||r.t==="li"||!MEAL_MAIN.has(r.t)||!r.ing.length)return{c:false,v:false};
  const k=ingKinds(r);
  if(r.t==="ke")return{c:true,v:false};
  return{c:!k.carb,v:k.veg<2&&mainOf(r)!=="v"};
}
const sideKind=r=>ingKinds(r).carb?"c":"v";
const PSIDE=[{k:"patonki",n:"Patonki",q:"1 kpl"},{k:"ruisleipä",n:"Ruisleipä",q:"1 kpl"},{k:"sämpylät",n:"Sämpylät",q:"1 pkt"}];
/* lisukkeen versio: pääruoan suosittelema tai lisukkeelle viimeksi valittu */
function sideVer(x,want){
  if(!x.vs||x.vs.length<2)return null;
  return x.vs.find(v=>v.id===want)||selOf(x,state.tv[x.id]).ver;
}
function useSideVer(sid,ver){const x=byId(sid);if(ver&&x&&x.vs&&x.vs.some(v=>v.id===ver))setSel(sid,n=>{n.v=ver;});}
function sideSug(r){
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
const sdOpen=new Set();
let sdFor=null,sdOwn=false;
function sdRowHtml(r,cls){
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
function renderSd(){
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
const sdOnLink=r=>{const n=sideNeeds(r);return state.nos.includes(r.id)&&(n.c||n.v)?`<p class="cpy" style="margin-top:6px"><button type="button" class="clear" data-sdno="0" data-dish="${esc(r.id)}">Ota lisukeehdotukset käyttöön</button></p>`:"";};
function toggleSide(sid,did,ver){
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
function learnP(did,key){
  if(did&&byId(did)){const pm=state.pair[did]||(state.pair[did]={});pm[key]=Math.min(999,(pm[key]||0)+1);}
  state.sk[key]=Math.min(9999,(state.sk[key]||0)+1);
}
function sdTarget(){const fl=dlgList&&state.lists.find(q=>q.id===dlgList);return fl||ensureList();}
function togglePSide(key,did){
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
function addOwnSide(btn){
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
const sel={a:new Set(),s:new Set(),t:new Set(),m:new Set(),v:new Set(),w:new Set(),f:new Set()};
const maps={a:A,s:S,t:T,m:M,v:TIME,w:WLD,f:HOL};
const ids={a:"fa",s:"fs",t:"ft",m:"fm",v:"fvt",w:"fw",f:"ffe"};
let pick=null;
let onlyFP=false,qs="";
/* ---------- kuvat ---------- */
let assetsApi=null;
const imgUrl=r=>state.img[r.id]?"/_blob/"+state.img[r.id]:"";
function releaseImg(id){
  if(!id||!assetsApi||Object.values(state.img).includes(id))return;
  try{Promise.resolve(assetsApi.delete(id)).catch(()=>{});}catch(e){}
}
function dropDraftImg(){if(edit&&edit.draft&&edit.draft.img&&edit.draft.img!==(state.img[edit.id]||""))releaseImg(edit.draft.img);}
function dropRecipeImg(rid){const o=state.img[rid];if(o){delete state.img[rid];releaseImg(o);}}
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
async function uploadImg(file){
  if(!assetsApi)throw new Error("none");
  if(!/^image\/(jpeg|png|webp|gif|heic|heif|avif)$/i.test(file.type||""))throw new Error("type");
  const b=await shrink(file,900);
  const r=await assetsApi.upload(b);
  if(!r||!/^[0-9a-f]{32}$/.test(String(r.id)))throw new Error("up");
  return r.id;
}
document.addEventListener("error",e=>{const t=e.target;if(t&&t.tagName==="IMG"&&(t.classList.contains("th")||t.classList.contains("hero"))){const c=t.closest(".card"),w=t.closest(".thw");if(w){const f=w.querySelector(".fav");if(f&&c){c.querySelector(".cartbtn.ic").before(f);}w.remove();}else t.remove();if(c)c.classList.remove("pic");}},true);
let fPend="";
const isFav=id=>state.fav.includes(id);
function toggleFav(id){
  const i=state.fav.indexOf(id);
  if(i>=0)state.fav.splice(i,1);else state.fav.push(id);
  mutate();renderIdeas();if(dlg.open&&openId===id&&!(edit&&edit.id===id))renderDlg();
}
const dhSize=n=>{n=String(n||"");const L=n.length,W=Math.max(1,...n.split(/\s+/).map(w=>w.length));let f=1.6;if(L>24)f=1.45;if(L>36)f=1.3;if(L>52)f=1.15;if(W>14)f=Math.min(f,1.35);if(W>18)f=Math.min(f,1.2);return f;};
const favBtn=(r,cls)=>{const on=isFav(r.id);return`<button type="button" class="fav${cls||""}" data-fav="${esc(r.id)}" aria-pressed="${on}" aria-label="${on?"Poista suosikeista":"Lisää suosikiksi"}: ${esc(r.name)}">${ico("heart")}</button>`;};

const chipEls={a:{},s:{},t:{},m:{},v:{},w:{},f:{}};
const timeCodes=r=>{const m=+r.min||0;if(m<=0)return[];if(m>60)return["61"];return["60"].concat(m<=30?["30"]:[],m<=15?["15"]:[]);};
/* pääraaka-aineet kaikista versioista: suodatin "Kasvis" löytää pizzan, jolla on kasvisversio */
const verMain=(r,v)=>v.veg?"v":(M[v.m]?v.m:"");
function mainsOf(r){const a=[mainOf(r)];for(const v of r.vs||[]){const m=verMain(r,v);if(m&&!a.includes(m))a.push(m);}return a;}
const FV={a:mealOf,s:tagsOf,t:r=>[r.t],m:mainsOf,v:timeCodes,w:r=>r.wd?[r.wd]:[],f:r=>r.fe?[r.fe]:[]};
const poolOf=r=>({lt:r.t,v0:{a:mealOf(r),s:tagsOf(r),t:[r.t],m:mainsOf(r),v:timeCodes(r),w:r.wd?[r.wd]:[],f:r.fe?[r.fe]:[]}});
const xOpen={},hkX={};
/* chipien tila: osumamäärä, himmennys, tyhjien piilotus ja "Näytä lisää" */
function chipStats(cfg){
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
function updateChips(){
  const pool=all().filter(r=>(!onlyFP||isFav(r.id)||isPop(r))&&qHit(r)>=0).map(poolOf);
  chipStats({els:chipEls,st:sel,pool,exLi:true,open:xOpen,box:g=>$(ids[g]),sec:(g,v)=>{const p=$(ids[g]).parentElement;if(p.hidden!==!v)p.hidden=!v;}});
}
/* ---------- haku ---------- */
function termsOf(str){return str.split(",").map(s=>fold(s.trim())).filter(Boolean).slice(0,6);}
function qTerms(){return termsOf(qs);}
const qIngCache=new Map();
function qIngs(r){
  const k=r.id+"|"+r.ing.join(";");
  let v=qIngCache.get(k);
  if(!v){v=r.ing.map(l=>parseIng(l).key.replace(/kananmun\w*/g,"muna"));if(qIngCache.size>800)qIngCache.clear();qIngCache.set(k,v);}
  return v;
}
/* muunnelmat, jotka vaihtavat saman aineksen, sulkevat toisensa pois: uuden valinta poistaa ristiriitaiset */
function twExcl(r,list,k){
  const tw=(r&&r.tw)||[],m=tw.find(t=>t.id===k),rm=(m&&m.rm)||[],g=m&&m.g;
  if(!rm.length&&!g)return list;
  return list.filter(o=>{const om=tw.find(t=>t.id===o);return !(om&&((g&&om.g===g)||(om.rm||[]).some(x=>rm.includes(x))));});
}
/* nimet hakua varten: reseptin nimi, muut nimet ja versioiden nimet */
const qNames=r=>[r.name,...(r.aka||[]),...((r.vs||[]).length>1?r.vs.flatMap(v=>[v.n,v.n+" "+r.name]):[])];
/* versioiden ja muunnelmien tuomat ainekset: [avain, versio/muunnelma] */
const qOptCache=new Map();
function qOptRows(r){
  if(!hasOpt(r))return[];
  let v=qOptCache.get(r.id);
  if(!v){v=optLines(r).map(([l,m])=>[parseIng(l).key.replace(/kananmun\w*/g,"muna"),m]);qOptCache.set(r.id,v);}
  return v;
}
/* hakusanat, jotka osuvat vain versioon tai muunnelmaan: palauttaa osuneet versiot/muunnelmat */
function qOpts(r,ts){
  const out=[];
  for(const t0 of ts){
    const t=t0.replace(/kananmu\w*/g,"muna"),ok=v=>v>=0&&(v<=2||t.length>=5);
    /* versio nimeltä (esim. "kirkas kalakeitto") */
    if(!ok(fzBest(t,[r.name,...(r.aka||[])]))&&(r.vs||[]).length>1){
      const v=r.vs.find(v=>ok(fzBest(t,[v.n,v.n+" "+r.name])));
      if(v){if(!out.includes(v))out.push(v);continue;}
    }
    if(ok(fzBest(t,qNames(r)))||ok(fzBest(t,qIngs(r))))continue;
    const hit=qOptRows(r).find(([k])=>ok(fzScore(t,fold(k))));
    if(hit&&!out.includes(hit[1]))out.push(hit[1]);
  }
  return out;
}
/* -1 = ei osu; 0..9 = nimi osuu; 100+ = vain aines osuu; 200+ = vain version tai muunnelman aines osuu */
function qHit(r,ts0){
  const ts=ts0||qTerms();if(!ts.length)return 0;
  let best=0;
  for(const t0 of ts){
    const t=t0.replace(/kananmu\w*/g,"muna");
    const ok=v=>v>=0&&(v<=2||t.length>=5);
    const n=fzBest(t,qNames(r));
    if(ok(n)){best=Math.max(best,n);continue;}
    const g=fzBest(t,qIngs(r));
    if(ok(g)){best=Math.max(best,100+g);continue;}
    const o=fzBest(t,qOptRows(r).map(x=>x[0]));
    if(ok(o)){best=Math.max(best,200+o);continue;}
    return-1;
  }
  return best;
}
$("qi").innerHTML=ico("search");
function clearFilters(){
  onlyFP=false;$("fpChip").setAttribute("aria-pressed","false");
  for(const k of Object.keys(sel)){sel[k].clear();for(const b of Object.values(chipEls[k]))b.setAttribute("aria-pressed","false");}
  pick=null;renderIdeas();
}
function buildChips(){
  {
    const b=document.createElement("button");
    b.type="button";b.className="chip fv";b.id="fpChip";b.innerHTML=ico("star")+"<span>Suosikit ja suositut</span>";b.setAttribute("aria-pressed","false");
    b.onclick=()=>{onlyFP=!onlyFP;b.setAttribute("aria-pressed",onlyFP);pick=null;renderIdeas();};
    $("fp").appendChild(b);
    const x=document.createElement("button");x.type="button";x.className="lk";x.id="clrBtn";x.hidden=true;x.dataset.clrf="";x.textContent="Tyhjennä valinnat";
    $("fp").appendChild(x);
  }
  for(const k of FK){
    const box=$(ids[k]);
    for(const[code,label] of Object.entries(maps[k])){
      const b=document.createElement("button");
      b.type="button";b.className="chip";b.textContent=label;b.setAttribute("aria-pressed","false");chipEls[k][code]=b;
      b.onclick=()=>{
        if(sel[k].has(code))sel[k].delete(code);
        else{if(k==="v"){sel.v.clear();for(const o of Object.values(chipEls.v))o.setAttribute("aria-pressed","false");}sel[k].add(code);}
        b.setAttribute("aria-pressed",sel[k].has(code));
        pick=null;renderIdeas();
      };
      box.appendChild(b);
    }
  }
  $("more").addEventListener("click",e=>{const b=e.target.closest("[data-xg]");if(!b)return;xOpen[b.dataset.xg]=!xOpen[b.dataset.xg];updateChips();});
}
function matches(r){
  return(!onlyFP||isFav(r.id)||isPop(r))&&qHit(r)>=0&&FK.every(k=>k==="t"?(sel.t.size?sel.t.has(r.t):r.t!=="li"):(!sel[k].size||FV[k](r).some(x=>sel[k].has(x))));
}
function tagsHtml(r,part){
  if(part==="top")return`<div class="meta top"><div class="mg">${priceTag(r)}${r.min>0?`<b class="mn2">${ico("clock")}${timeTxt(r)}</b>`:""}${workOf(r)>0&&r.min>workOf(r)&&!/yön yli/.test(timeTxt(r))?`<span class="wk">työtä ${fmtDur(workOf(r))}</span>`:""}</div>${state.views[r.id]?`<span class="vw" title="Katsottu ${state.views[r.id]} ${state.views[r.id]===1?"kerran":"kertaa"}" aria-label="Katsottu ${state.views[r.id]} ${state.views[r.id]===1?"kerran":"kertaa"}">${ico("eye")}${state.views[r.id]}</span>`:""}</div>`;
  if(part==="tags")return`<div class="meta tg">${T[r.t]?`<span class="t">${T[r.t]}</span>`:""}${M[mainOf(r)]?`<span class="t">${M[mainOf(r)]}</span>`:""}${WLD[r.wd]?`<span class="t">${WLD[r.wd]}</span>`:""}${HOL[r.fe]?`<span class="t">${HOL[r.fe]}</span>`:""}${r.jf?`<span class="t">${A.j}</span>`:""}${tagsOf(r).map(x=>`<span class="t">${S[x]}</span>`).join("")}${isPop(r)?`<span class="t">Suosittu</span>`:""}${r.perus?`<span class="t">Perusateria</span>`:""}${r.custom?`<span class="t">Oma</span>`:""}</div>`;
  return`<div class="meta">${priceTag(r)}${r.min>0?`<b class="mn2">${ico("clock")}${timeTxt(r)}</b>`:""}${T[r.t]?`<span class="t">${T[r.t]}</span>`:""}${M[mainOf(r)]?`<span class="t">${M[mainOf(r)]}</span>`:""}${tagsOf(r).map(x=>`<span class="t">${S[x]}</span>`).join("")}${isPop(r)?`<span class="t">Suosittu</span>`:""}${r.custom?`<span class="t">Oma</span>`:""}</div>`;
}
const cartIc=r=>{const on=inCart(r.id);return`<button type="button" class="cartbtn ic" data-cart="${esc(r.id)}" aria-pressed="${on}" aria-label="${on?"Poista ostoslistalta":"Lisää ostoslistalle"}: ${esc(r.name)}">${ico(on?"check":"tlist")}</button>`;};
const cartBtn=r=>{const on=inCart(r.id);return`<button type="button" class="cartbtn" data-cart="${esc(r.id)}" aria-pressed="${on}">${cartInner(on)}</button>`;};

function moreLabel(){
  const n=sel.s.size+sel.t.size+sel.m.size+sel.v.size+sel.w.size+sel.f.size;
  {
    const a=$("act"),h=[];
    for(const k of ["m","s","v","w","t","f"])for(const c of sel[k])h.push(`<button type="button" class="act" data-ak="${k}" data-ac="${esc(c)}" aria-label="Poista suodatin: ${esc(maps[k][c])}"><span>${esc(maps[k][c])}</span>${ico("x")}</button>`);
    a.innerHTML=h.join("");a.hidden=!h.length||!$("more").hidden;
  }
  const mt=$("moreTxt");mt.textContent=n||"";mt.hidden=!n;$("moreBtn").setAttribute("aria-label",n?"Muut suodattimet ("+n+" valittu)":"Muut suodattimet");
}
$("moreBtn").onclick=()=>{
  const open=$("more").hidden;
  $("more").hidden=!open;
  $("moreBtn").setAttribute("aria-expanded",open);
  moreLabel();
};
$("act").addEventListener("click",e=>{
  const b=e.target.closest("[data-ak]");if(!b)return;
  const k=b.dataset.ak,c=b.dataset.ac;
  sel[k].delete(c);if(chipEls[k][c])chipEls[k][c].setAttribute("aria-pressed","false");
  pick=null;renderIdeas();
});

/* ---------- hakuikkuna ---------- */
const hf={a:new Set(),s:new Set(),t:new Set(),m:new Set(),v:new Set(),w:new Set(),f:new Set(),fp:false},hkEls={a:{},s:{},t:{},m:{},v:{},w:{},f:{}};
let hq="",hkFlt=false;
const HK_IDS={a:"hkca",m:"hkcm",s:"hkcs",v:"hkcv",w:"hkcw",t:"hkct",f:"hkcf"},HK_SUG=["kana","jauheliha","lohi","pasta","kasvis"];
const hkAny=()=>hf.fp||FK.some(k=>hf[k].size);
const hkOk=(t,v)=>v>=0&&(v<=2||t.length>=5);
function hkResults(){
  const ts=termsOf(hq),sc=new Map();
  const res=all().filter(r=>{
    const v=qHit(r,ts);if(v<0)return false;
    if(hf.fp&&!(isFav(r.id)||isPop(r)))return false;
    for(const k of FK)if(hf[k].size&&!FV[k](r).some(x=>hf[k].has(x)))return false;
    sc.set(r.id,v);return true;
  });
  sortRes(res);
  if(ts.length)res.sort((x,y)=>sc.get(x.id)-sc.get(y.id));
  return{res,ts};
}
function hkWhy(r,ts){
  const out=[];
  for(const t0 of ts){
    const t=t0.replace(/kananmu\w*/g,"muna");
    if(hkOk(t,fzBest(t,qNames(r))))continue;
    for(const l of r.ing){
      const k=parseIng(l).key;
      if(hkOk(t,fzScore(t,fold(k.replace(/kananmun\w*/g,"muna"))))){if(!out.includes(k))out.push(k);break;}
    }
  }
  return out.slice(0,3);
}
function hkEmpty(){
  const rec=state.sr||[];
  const chip=(q,ic)=>`<button type="button" class="chip" data-hq="${esc(q)}">${ic?ico("clock"):""}${esc(q)}</button>`;
  return(rec.length?`<div class="hkgt"><b>Viimeisimmät haut</b><button type="button" class="lk" data-hkclr>Tyhjennä</button></div><div class="chips">${rec.map(q=>chip(q,1)).join("")}</div>`:"")+
    `<div class="hkgt"><b>Kokeile</b></div><div class="chips">${HK_SUG.map(q=>chip(q,0)).join("")}</div><p class="note" style="margin-top:18px">Useita raaka-aineita: erota pilkulla, esim. <i>kana, riisi</i>.</p>`;
}
function hkActive(){
  const act=(k,c,l)=>`<button type="button" class="act" data-hak="${k}" data-hac="${esc(c)}" aria-label="Poista suodatin: ${esc(l)}"><span>${esc(l)}</span>${ico("x")}</button>`;
  const h=[];
  if(hf.fp)h.push(act("fp","","Suosikit ja suosituit"));
  for(const k of FK)for(const c of hf[k])h.push(act(k,c,maps[k][c]));
  const a=$("hkact");a.innerHTML=h.join("");a.hidden=!h.length||hkFlt;
  const n=h.length,b=$("hkbd");b.textContent=n||"";b.hidden=!n;
  $("hkflt").setAttribute("aria-label",n?"Suodattimet ("+n+" valittu)":"Suodattimet");
}
function renderHk(){
  const ts=termsOf(hq),box=$("hkres");
  $("hkqx").hidden=!hq;$("hkpanel").hidden=!hkFlt;$("hkflt").setAttribute("aria-expanded",hkFlt);
  hkActive();
  if(hkFlt){
    const pool=all().filter(r=>qHit(r,ts)>=0&&(!hf.fp||isFav(r.id)||isPop(r))).map(poolOf);
    chipStats({els:hkEls,st:hf,pool,exLi:false,open:hkX,box:g=>$(HK_IDS[g]),sec:(g,v)=>{const b=$(HK_IDS[g]);b.hidden=!v;b.previousElementSibling.hidden=!v;}});
  }
  if(!ts.length&&!hkAny()){box.innerHTML=hkEmpty();return;}
  const{res}=hkResults();
  const head=`<p class="hkcount" aria-live="polite">${res.length===1?"1 ruokaidea":res.length+" ruokaideaa"}</p>`;
  if(!res.length){
    box.innerHTML=head+`<p class="empty">${ts.length?"Ei osumia haulle. Kokeile lyhyempää sanaa":"Ei osumia näillä valinnoilla"}${hkAny()?" tai poista suodattimia.":"."}</p>`+(hkAny()?`<div class="actions"><button type="button" class="go" data-hkclrf>Tyhjennä suodattimet</button></div>`:"");
    return;
  }
  box.innerHTML=head+`<div class="grid hkgrid" data-lay="${state.lay==="grid"?"grid":"list"}">${res.map(r=>{const w=hkWhy(r,ts),o=qOpts(r,ts);return cardHtml(r,(w.length?`<div class="why">Sisältää ${w.map(esc).join(", ")}</div>`:"")+(o.length?`<div class="why">${o.map(m=>((r.vs||[]).includes(m)?"Versiona: ":"Muunnelmana: ")+esc(m.n)).join(" · ")}</div>`:""));}).join("")}</div>`;
}
function hkRemember(){
  const q=hq.trim();if(q.length<2||!termsOf(q).length)return;
  if(!hkResults().res.length)return;
  const a=(state.sr||[]).filter(x=>x.toLowerCase()!==q.toLowerCase());a.unshift(q);state.sr=a.slice(0,8);mutate();
}
function hkSet(q){hq=q.slice(0,80);$("hkq").value=hq;renderHk();$("hkbody").scrollTop=0;}
function fitHk(){
  const d=$("hkdlg"),v=window.visualViewport;if(!d.open||!v)return;
  d.style.top=Math.round(v.offsetTop)+"px";d.style.bottom="auto";d.style.height=Math.round(v.height)+"px";
}
if(window.visualViewport){visualViewport.addEventListener("resize",fitHk);visualViewport.addEventListener("scroll",fitHk);}
function openHk(){
  hideToast();
  hq="";hkFlt=false;hf.fp=false;
  for(const k of FK){hf[k].clear();for(const b of Object.values(hkEls[k]))b.setAttribute("aria-pressed","false");}
  $("hkfpb").setAttribute("aria-pressed","false");
  $("hkq").value="";renderHk();
  $("hkdlg").showModal();fitHk();$("hkbody").scrollTop=0;
  $("hkq").focus();
}
function buildHkChips(){
  const fp=document.createElement("button");fp.type="button";fp.className="chip fv";fp.id="hkfpb";fp.innerHTML=ico("star")+"<span>Suosikit ja suosituit</span>";fp.setAttribute("aria-pressed","false");
  fp.onclick=()=>{hf.fp=!hf.fp;fp.setAttribute("aria-pressed",hf.fp);renderHk();};
  $("hkfp").appendChild(fp);
  for(const k of FK){
    const box=$(HK_IDS[k]);
    for(const[code,label] of Object.entries(maps[k])){
      const b=document.createElement("button");b.type="button";b.className="chip";b.textContent=label;b.setAttribute("aria-pressed","false");hkEls[k][code]=b;
      b.onclick=()=>{
        if(hf[k].has(code))hf[k].delete(code);
        else{if(k==="v"){hf.v.clear();for(const o of Object.values(hkEls.v))o.setAttribute("aria-pressed","false");}hf[k].add(code);}
        b.setAttribute("aria-pressed",hf[k].has(code));renderHk();
      };
      box.appendChild(b);
    }
  }
}
buildHkChips();
$("hkqi").innerHTML=ico("search");$("hkqx").innerHTML=ico("x");$("hkclose").innerHTML=ico("x");$("pi").innerHTML=ico("search");
$("hkOpen").addEventListener("click",openHk);$("hkPill").addEventListener("click",openHk);
$("hkclose").addEventListener("click",()=>{hkRemember();$("hkdlg").close();});
$("hkdlg").addEventListener("close",()=>{
  const d=$("hkdlg");d.style.top="";d.style.bottom="";d.style.height="";
  pillSet(false);
  try{const o=$("hkOpen");if(o.getBoundingClientRect().bottom>0)o.focus({preventScroll:true});}catch(e){}
});
$("hkq").addEventListener("input",()=>{hq=$("hkq").value.slice(0,80);renderHk();$("hkbody").scrollTop=0;});
$("hkq").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();hkRemember();$("hkq").blur();}});
$("hkqx").addEventListener("click",()=>{hkSet("");$("hkq").focus();});
$("hkflt").addEventListener("click",()=>{hkFlt=!hkFlt;if(hkFlt)$("hkq").blur();renderHk();if(hkFlt)$("hkbody").scrollTop=0;});
$("hkdlg").addEventListener("click",e=>{
  let b;
  if((b=e.target.closest("[data-xg]"))){hkX[b.dataset.xg]=!hkX[b.dataset.xg];renderHk();return;}
  if((b=e.target.closest("[data-hq]"))){hkSet(b.dataset.hq);hkRemember();return;}
  if(e.target.closest("[data-hkclr]")){state.sr=[];mutate();renderHk();return;}
  if(e.target.closest("[data-hkclrf]")){hf.fp=false;$("hkfpb").setAttribute("aria-pressed","false");for(const k of FK){hf[k].clear();for(const x of Object.values(hkEls[k]))x.setAttribute("aria-pressed","false");}renderHk();return;}
  if((b=e.target.closest("[data-hak]"))){
    const k=b.dataset.hak,c=b.dataset.hac;
    if(k==="fp"){hf.fp=false;$("hkfpb").setAttribute("aria-pressed","false");}
    else{hf[k].delete(c);if(hkEls[k][c])hkEls[k][c].setAttribute("aria-pressed","false");}
    renderHk();return;
  }
  if(e.target.closest(".card[data-id], [data-open]")&&!e.target.closest("[data-cart]")){
    hkRemember();
    /* hakusana osui versioon tai muunnelmaan: avataan ruoka se valittuna, ellei ruoka ole jo listalla */
    const c=e.target.closest("[data-id], [data-open]"),r=c&&byId(c.dataset.open||c.dataset.id);
    if(r&&hasOpt(r)&&!state.lists.some(l=>l.cart.includes(r.id))){
      const o=qOpts(r,termsOf(hq));
      if(o.length)setSel(r.id,n=>{for(const m of o){if((r.vs||[]).includes(m))n.v=m.id;else if(!n.t.includes(m.id)){n.t=twExcl(r,n.t,m.id);n.t.push(m.id);}}});
    }
  }
});
/* ---------- hakupainike vieritettäessä ---------- */
let pillY=0,pillT=false;
function pillSet(on){const p=$("hkPill");if(p.classList.contains("on")===on)return;p.classList.toggle("on",on);p.inert=!on;}
function pillScroll(){
  pillT=false;
  const y=Math.max(0,window.scrollY),dy=y-pillY;
  if(curTab!=="ideas"||document.querySelector("dialog[open]")){pillSet(false);pillY=y;return;}
  const hb=$("appbar").getBoundingClientRect().bottom;
  if(hb>56){pillSet(false);pillY=y;return;}
  if(dy<-8){pillSet(true);pillY=y;}
  else if(dy>8){pillSet(false);pillY=y;}
}
window.addEventListener("scroll",()=>{if(!pillT){pillT=true;requestAnimationFrame(pillScroll);}},{passive:true});

function costPer(r){const c=recipeCost(r);return(!c.n||c.big)?null:c.sum/pvOf(r);}
function sortRes(a){
  const nm=(x,y)=>x.name.localeCompare(y.name,"fi");
  const num=(f)=>(x,y)=>{const u=f(x),v=f(y);if(u==null&&v==null)return nm(x,y);if(u==null)return 1;if(v==null)return-1;return u-v||nm(x,y);};
  const k=state.sort;
  if(k==="cheap")return a.sort(num(costPer));
  if(k==="fast")return a.sort(num(r=>r.min>0?r.min:null));
  if(k==="abc")return a.sort(nm);
  if(k==="views")return a.sort((x,y)=>((state.views[y.id]||0)-(state.views[x.id]||0))||(isFav(y.id)-isFav(x.id))||0);
  return a.sort((x,y)=>(isFav(y.id)-isFav(x.id))||0);
}
$("sort").onchange=()=>{state.sort=$("sort").value;mutate();renderIdeas();};
function applyLay(){
  const g=state.lay==="grid";
  $("list").dataset.lay=g?"grid":"list";
  document.querySelectorAll("#thm [data-lay]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.lay===(g?"grid":"list")));
}
const LAYH={pa:22,ki:38,ke:8,uu:30,pn:48,ps:42,pu:62,am:52,sa:120,le:335,ja:350,li:95,wo:52,pi:28,ha:40,vp:70,al:100};
function gridPrice(r){
  const t=priceTxt(r);
  return t?`<b class="gp">${t}</b>`:"";
}
function gridCard(r,why=""){
  const u=imgUrl(r);
  return`<article class="card gc" data-id="${esc(r.id)}"><div class="gt" style="--h:${LAYH[r.t]||30}"><span class="gi">${ico("chef")}</span>${u?`<img class="th" alt="" loading="lazy" src="${esc(u)}">`:""}${isFav(r.id)?`<span class="gfv" title="Suosikki">${ico("heart")}</span>`:""}${cartIc(r)}</div><div class="ci"><h3><button type="button" class="ttl" data-open="${esc(r.id)}">${esc(r.name)}</button></h3><div class="gm">${gridPrice(r)}${r.min>0?`<span class="mn">${ico("clock")}${timeTxt(r)}</span>`:""}</div>${why}</div></article>`;
}
function listCard(r,why=""){
  return`<article class="card${imgUrl(r)?" pic":""}" data-id="${esc(r.id)}">${imgUrl(r)?`<div class="thw"><img class="th" alt="" loading="lazy" src="${esc(imgUrl(r))}"></div>`:""}<div class="ci"><h3><button type="button" class="ttl" data-open="${esc(r.id)}">${esc(r.name)}</button></h3><div class="meta">${priceTag(r)}<span class="mtr">${r.min>0?`<span class="mn">${ico("clock")}${timeTxt(r)}</span>`:""}${nutChip(r)}</span></div>${why}</div>${cartIc(r)}</article>`;
}
const cardHtml=(r,why="")=>state.lay==="grid"?gridCard(r,why):listCard(r,why);
function renderIdeas(){
  moreLabel();updateChips();
  const res=sortRes(all().filter(matches));
  if(qTerms().length)res.sort((x,y)=>(qHit(x)>=100?1:0)-(qHit(y)>=100?1:0));
  const anyF=onlyFP||qTerms().length||FK.some(k=>sel[k].size);
  $("sort").value=state.sort;
  $("count").textContent=res.length===1?"1 ruokaidea":res.length+" ruokaideaa";$("clrBtn").hidden=!anyF;
  $("list").innerHTML=res.length?res.map(r=>cardHtml(r)).join(""):
    `<p class="empty">${qTerms().length?"Ei osumia haulle. Kokeile lyhyempää sanaa tai poista suodattimia.":"Ei osumia näillä valinnoilla. Poista jokin valinta, niin ideoita löytyy."}</p>`;
  uiEdit();renderSd();
}
/* ---------- ostoslista ---------- */
function shopping(cart,extra){
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
/* hintatäydennys s-kaupat.fi 19.11.2026: vain avaimet, joille hintaa ei vielä ole */
const P3=(k,p,per,src,o,w,u)=>{if(!PR[k])P2(k,p,per,src,o,w,u);};
P3("varsiselleri",8.76,"kg","Kotimaista varsiselleri 250 g",{},"Vain yksi tai kaksi tuotetta.","hedelmat-ja-vihannekset/vihannekset");
P3("ruusukaali",10.97,"kg","Kotimaista ruusukaali 300 g",{},"Vain yksi tai kaksi tuotetta.","hedelmat-ja-vihannekset/vihannekset/kaalit");
P3("munakoiso",6.62,"kg","Coop munakoiso 225 g",{},"Vain yksi tai kaksi tuotetta.","hedelmat-ja-vihannekset/vihannekset/muut-vihannekset");
P3("salottisipuli",5.56,"kg","Kotimaista salottisipuli 250 g",{},"Vain yksi tai kaksi tuotetta.","hedelmat-ja-vihannekset/vihannekset/sipulit");
P3("punakaali",2.19,"kg","Punakaali (pakattu pala ja irto)",{},"","hedelmat-ja-vihannekset/vihannekset/kaalit");
P3("kiinankaali",4.29,"kg","Kotimaista pakattu kiinankaali",{},"Vain yksi tai kaksi tuotetta.","hedelmat-ja-vihannekset/vihannekset/kaalit");
P3("lehtikaali",11.17,"kg","Lehtikaali 180–200 g",{},"","hedelmat-ja-vihannekset/vihannekset/kaalit");
P3("nauris",2.39,"kg","Nauris (irto ja 1 kg pussi)",{},"","hedelmat-ja-vihannekset/juurekset");
P3("retiisi",7.56,"kg","Retiisi / retikka 125–200 g",{},"","hedelmat-ja-vihannekset/juurekset");
P3("kurpitsa",2.39,"kg","Kurpitsat (hokkaido, myski, bataatti-, spagetti-)",{},"","hedelmat-ja-vihannekset/vihannekset/kurpitsat");
P3("parsa",17.56,"kg","Tankoparsa vihreä 250 g",{},"Vain yksi tai kaksi tuotetta.","hedelmat-ja-vihannekset/vihannekset/muut-vihannekset");
P3("sokeriherne",12.86,"kg","Sokeriherne 150–200 g",{},"","hedelmat-ja-vihannekset/vihannekset/muut-vihannekset");
P3("basilika",1.48,"kpl","Kotimaista basilika (ruukku/nippu)",{},"Vain yksi tai kaksi tuotetta.","hedelmat-ja-vihannekset/yrtit");
P3("korianteri",1.48,"kpl","Kotimaista korianteri (ruukku/nippu)",{},"Vain yksi tai kaksi tuotetta.","hedelmat-ja-vihannekset/yrtit");
P3("ruohosipuli",1.28,"kpl","Kotimaista ruohosipuli (nippu)",{},"Vain yksi tai kaksi tuotetta.","hedelmat-ja-vihannekset/yrtit");
P3("mansikka",17.16,"kg","Mansikka 250 g",{},"Vain yksi tai kaksi tuotetta.","hedelmat-ja-vihannekset/marjat");
P3("mustikka",16.98,"kg","Pensasmustikka 125–500 g",{},"","hedelmat-ja-vihannekset/marjat");
P3("puolukka",15.78,"kg","Puolukkasurvos 500 g",{},"Vain yksi tai kaksi tuotetta.","hedelmat-ja-vihannekset/marjat");
P3("vadelma",25.71,"kg","Vadelma 125–225 g",{},"","hedelmat-ja-vihannekset/marjat");
P3("ananas",1.89,"kg","Coop ananas (irto)",{},"Vain yksi tai kaksi tuotetta.","hedelmat-ja-vihannekset/hedelmat");
P3("mango",2.83,"kg","Mango (irto)",{},"Vain yksi tai kaksi tuotetta.","hedelmat-ja-vihannekset/hedelmat");
P3("greippi",2.29,"kg","Coop verigreippi (irto)",{},"Vain yksi tai kaksi tuotetta.","hedelmat-ja-vihannekset/hedelmat");
P3("suppilovahvero",19.56,"kg","Suppilovahvero 250 g",{},"Vain yksi tai kaksi tuotetta.","hedelmat-ja-vihannekset/sienet");
P3("sieni",13.11,"kg","Herkkusieni (irto ja 200–350 g)",{},"","hedelmat-ja-vihannekset/sienet");
P3("kanansuikaleet",9.95,"kg","Kanan fileesuikale 300–700 g",{},"","liha-ja-kasviproteiinit/kana-broileri-ja-kalkkuna");
P3("karjalanpaistiliha",10.87,"kg","Maatiaispossun palapaisti kuutiot 400 g",{},"Vain yksi tai kaksi tuotetta.","liha-ja-kasviproteiinit/porsas");
P3("maksa",10.49,"kg","Naudan maksa 350–500 g",{},"","liha-ja-kasviproteiinit/muut-lihatuotteet");
P3("lihapullat",9.26,"kg","Lihapullat ja -pyörykät 300–400 g",{},"","valmisruoka/pyorykat-pihvit-ja-ohukaiset");
P3("kasvispyörykät",12.6,"kg","Kasvispyörykät 230 g",{},"Vain yksi tai kaksi tuotetta.","valmisruoka/pyorykat-pihvit-ja-ohukaiset");
P3("härkäpapu",15.8,"kg","Härkis härkäpapumurska 250 g",{},"","liha-ja-kasviproteiinit/kasviproteiinit-ja-lihattomat-tuotteet");
P3("savulohi",29.9,"kg","Savulohi 100–400 g",{},"","kala-ja-merenelavat/kala");
P3("katkarapu",24.94,"kg","Katkaravut 330–350 g",{},"Vain yksi tai kaksi tuotetta.","kala-ja-merenelavat/ayriaiset");
P3("rapu",28.76,"kg","Ravunpyrstöt suolaliemessä 330 g",{},"Vain yksi tai kaksi tuotetta.","kala-ja-merenelavat/ayriaiset");
P3("soijajuoma",1.79,"l","Soijajuoma 1 l",{},"","maito-munat-ja-rasvat/kasvipohjaiset-juomat");
P3("halloumi",12.2,"kg","Coop halloumijuusto 200 g",{},"Vain yksi tai kaksi tuotetta.","juustot-tofut-ja-kasvipohjaiset/ruoka-ja-herkuttelujuustot");
P3("leipä",4.3,"kg","Ruis- ja paahtoleivät",{},"","leivat-ja-leivonnaiset/leivat");
P3("hampurilaissämpylä",9.22,"kg","Burgerisämpylät 4 kpl / 320 g",{},"Vain yksi tai kaksi tuotetta.","leivat-ja-leivonnaiset/leivat");
P3("näkkileipä",9.3,"kg","Näkkileivät 225–460 g",{},"","leivat-ja-leivonnaiset/nakkileivat-hapankorput-ja-krutongit");
P2("nachot",7.85,"kg","Nachot ja tortillachipsit, maustamattomat (mediaani 9 tuotteesta, 3,87–9,94 €/kg)",{dl:15},"Hinta vaihtelee paljon pakkauskoon ja merkin mukaan.","texmex-ja-maailman-makuja/maissilastut-ja-nachot");
P2("salsa",6.6,"kg","Salsakastikkeet ja tacokastikkeet (mediaani, Coop ja Santa Maria 3,96–9,29 €/kg)",{dl:100,prk:300},"Hinta vaihtelee paljon pakkauskoon ja merkin mukaan.","texmex-ja-maailman-makuja/texmex-kastikkeet");
P2("viinirypäle",6.36,"kg","Viinirypäleet, siemenettömät (mediaani 11 tuotteesta, 3,98–8,73 €/kg)",{dl:70},"","hedelmat-ja-vihannekset/hedelmat/rypaleet");
P2("shiitake",27.8,"kg","Kaiteki luomusiitake 100 g",{},"Vain yksi tai kaksi tuotetta.","hedelmat-ja-vihannekset/sienet");
P2("chorizo",13.57,"kg","Chorizo-grillimakkara (Snellman 230 g, Kotimaista 250 g)",{kpl:115,prk:230},"Vain yksi tai kaksi tuotetta.","liha-ja-kasviproteiinit/makkarat-nakit-ja-pekonit");
P2("kassler",10.9,"kg","Porsaan kassler, maustamaton",{},"Vain yksi tai kaksi tuotetta.","liha-ja-kasviproteiinit/porsas");
P2("salami",22.62,"kg","Leikkeleet: salami (HK Milanon, Kotivara pepperoni)",{},"Leikkeleen hinta, vain kaksi tuotetta.","liha-ja-kasviproteiinit/kinkut-ja-leikkeleet");
P2("palvikinkku",12.8,"kg","Palvikinkku (350 g pala, 180 g viipale)",{},"Leikkeleen hinta, vain kaksi tuotetta.","liha-ja-kasviproteiinit/kinkut-ja-leikkeleet");
P2("sulatejuusto",13.95,"kg","Sulatejuustoviipaleet 200 g",{},"","juustot-tofut-ja-kasvipohjaiset/pala-ja-viipalejuustot");
P2("tuorejuusto",15.0,"kg","Philadelphia tuorejuusto 150 g",{dl:100},"Vain yksi tai kaksi tuotetta.","juustot-tofut-ja-kasvipohjaiset/ruoka-ja-herkuttelujuustot");
P2("hiiva",5.0,"kg","Suomen Hiiva tuorehiiva 50 g",{},"Vain yksi tuote.","maito-munat-ja-rasvat/ruoanvalmistustuotteet");
P2("kuivahiiva",24.89,"kg","Kuivahiiva (Sunnuntai, Coop; 17,82–25,00 €/kg)",{pss:11,prk:11},"","kuivatuotteet-ja-leivonta/leivontatarvikkeet");
P2("mantelijauhe",14.37,"kg","Coop mantelijauhe 80 g",{dl:40},"Vain yksi tai kaksi tuotetta.","kuivatuotteet-ja-leivonta/leivontatarvikkeet");
P2("kookoshiutale",3.75,"kg","Coop kookoshiutale 200 g",{dl:30},"Vain yksi tai kaksi tuotetta.","kuivatuotteet-ja-leivonta/leivontatarvikkeet");
P2("pizzapohja",4.14,"kg","Pizzapohja 4 kpl / 360 g (pizzataikina 4,04–4,42 €/kg)",{kpl:90},"","pakasteet/pakastepizzat");
P2("piirakkataikina",4.97,"kg","Myllyn Paras piirakkataikina 380 g",{prk:380,pss:380},"Vain yksi tai kaksi tuotetta.","pakasteet/leivonnais-ja-leipapakasteet");
P2("pakastemaissi",2.2,"kg","Coop makea maissi 450 g pakaste",{dl:70},"Vain yksi tai kaksi tuotetta.","pakasteet/kasvispakasteet");
P2("pakastekukkakaali",2.87,"kg","Coop kukkakaalinuput 400 g pakaste",{dl:50},"Vain yksi tai kaksi tuotetta.","pakasteet/kasvispakasteet");
P2("pakasteparsakaali",2.58,"kg","Coop parsakaalin kukinnot 500 g pakaste",{dl:50},"Vain yksi tai kaksi tuotetta.","pakasteet/kasvispakasteet");
P2("pakastevihannekset",2.87,"kg","Kasvispakasteet (keittojuurekset, peruna-kasvissekoitus; 2,45–3,90 €/kg)",{dl:60},"","pakasteet/kasvispakasteet");
P2("tomusokeri",2.41,"kg","Tomusokeri (Dansukker 500 g, Coop 250 g)",{dl:55},"","kuivatuotteet-ja-leivonta/sokerit-makeutusaineet-ja-hunaja");
P2("ruokosokeri",4.9,"kg","Urtekram luomu ruokosokeri 500 g",{dl:85},"Vain yksi tuote (luomu).","kuivatuotteet-ja-leivonta/sokerit-makeutusaineet-ja-hunaja");
P2("quinoa",6.7,"kg","Kvinoa 500 g (Coop 6,30, Risella 7,10 €/kg)",{dl:85},"","pastat-riisit-ja-nuudelit/kvinoa-couscous-ja-muut-viljapohjaiset-lisukkeet");
P2("ohrasuurimo",3.65,"kg","Torino ohrahelmi 600 g",{dl:80},"Vain yksi tai kaksi tuotetta.","pastat-riisit-ja-nuudelit/kvinoa-couscous-ja-muut-viljapohjaiset-lisukkeet");
P2("täysjyväriisi",3.13,"kg","Täysjyväriisi (Coop 1 kg, Risella 800 g)",{dl:80},"","pastat-riisit-ja-nuudelit/riisit");
P2("tahini",11.97,"kg","Coop Asia seesamitahna 300 g",{},"Vain yksi tai kaksi tuotetta.","oljyt-maustaminen-ja-kastikkeet/maustekastikkeet-ja-tahnat");
P2("currykastike",7.51,"kg","Patak's Butter Chicken currykastike 450 g",{},"Vain yksi tai kaksi tuotetta.","oljyt-maustaminen-ja-kastikkeet/maustekastikkeet-ja-tahnat");
P2("juustokumina",45.31,"kg","Juustokumina jauhettu 25 g (Meira, Golden Star; 40,63–50,00 €/kg)",{},"","oljyt-maustaminen-ja-kastikkeet/mausteet");
P3("tortilla",6.72,"kg","Vehnätortillat 8 kpl",{},"","texmex-ja-maailman-makuja/tortillat-ja-tacokuoret");
P3("pakastemansikka",17.52,"kg","Pakastemansikka 250 g – 1 kg",{},"","pakasteet/hedelma-ja-marjapakasteet");
P3("ranskalaiset",2.38,"kg","Ranskanperunat pakaste 450 g – 1 kg",{},"","pakasteet/perunapakasteet");
P3("sokeri",1.19,"kg","Dansukker taloussokeri 1 kg",{},"","kuivatuotteet-ja-leivonta/sokerit-makeutusaineet-ja-hunaja");
P3("hunaja",9.9,"kg","Coop juokseva hunaja 250–500 g",{},"","kuivatuotteet-ja-leivonta/sokerit-makeutusaineet-ja-hunaja");
P3("siirappi",2.65,"kg","Dansukker tumma siirappi 1 kg",{},"","kuivatuotteet-ja-leivonta/sokerit-makeutusaineet-ja-hunaja");
P3("kookoshiutaleet",3.75,"kg","Coop kookoshiutale 200 g",{},"","kuivatuotteet-ja-leivonta/leivontatarvikkeet");
P3("kaakao",13.4,"kg","Coop kaakao 250 g",{},"","kahvit-teet-ja-mehut/kaakaojauheet");
P3("tumma suklaa",10.75,"kg","Coop leivontasuklaa 46 % 200 g",{},"","kuivatuotteet-ja-leivonta/leivontatarvikkeet");
P3("suklaa",15.8,"kg","Panda maitosuklaalevy 145 g",{},"","karkit-suklaat-ja-keksit/suklaalevyt");
P3("vaniljasokeri",16.07,"kg","Dansukker vaniljasokeri 140 g",{},"","kuivatuotteet-ja-leivonta/leivontatarvikkeet");
P3("kaurahiutaleet",0.97,"kg","Kotimaista kaurahiutale 1 kg",{},"","kuivatuotteet-ja-leivonta/hiutaleet");
P3("puuro",4.1,"kg","Fazer Alku kaurapuuro 500 g",{},"Vain yksi tai kaksi tuotetta.","kuivatuotteet-ja-leivonta/hiutaleet");
P3("pähkinät",17.75,"kg","Coop nut mix 200 g",{},"","snacksit/pahkinat");
P3("cashewpähkinä",15.38,"kg","Coop cashewpähkinät 500 g",{},"","snacksit/pahkinat");
P3("maapähkinä",10.0,"kg","Maapähkinä (arvio)",{},"Vain yksi tai kaksi tuotetta.","snacksit/pahkinat");
P3("rusinat",6.36,"kg","Coop rusinat 250 g",{},"","snacksit/rusinat-ja-luumut");
P3("kaneli",23.45,"kg","Santa Maria kaneli 55 g",{},"","oljyt-maustaminen-ja-kastikkeet/mausteet");
P3("mustapippuri",43.17,"kg","Meira mustapippuri 60 g",{},"","oljyt-maustaminen-ja-kastikkeet/mausteet");
P3("mustapippurirouhe",44.07,"kg","Meira mustapippuri rouhittu 27 g",{},"","oljyt-maustaminen-ja-kastikkeet/mausteet");
P3("etikka",1.67,"l","Xtra väkiviinaetikka 750 ml",{},"","oljyt-maustaminen-ja-kastikkeet/etikat-ja-balsamicot");
P3("sinappi",6.51,"kg","Auran mieto sinappi 275 g",{},"","oljyt-maustaminen-ja-kastikkeet/ketsupit-ja-sinapit");
P3("sweet chili",5.3,"l","Santa Maria sweet chili 500 ml",{},"","oljyt-maustaminen-ja-kastikkeet/maustekastikkeet-ja-tahnat");
P3("juuriselleri",4.5,"kg","Juuriselleri (arvio)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","hedelmat-ja-vihannekset/juurekset");
P3("rucola",30,"kg","Rucola (arvio, 65 g pussi)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","hedelmat-ja-vihannekset/salaatit");
P3("kantarellit",28,"kg","Kantarelli (arvio, kausituote)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","hedelmat-ja-vihannekset/sienet");
P3("papu",3.5,"kg","Pavut (arvio)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","hillot-ja-sailykkeet/kasvissailykkeet");
P3("kokonainen kana",5.9,"kg","Kokonainen kana (arvio)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","liha-ja-kasviproteiinit/kana-broileri-ja-kalkkuna");
P3("kalkkunafilee",17,"kg","Kalkkunafilee (arvio)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","liha-ja-kasviproteiinit/kana-broileri-ja-kalkkuna");
P3("silakkafile",11,"kg","Silakkafilee (arvio)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","kala-ja-merenelavat/kala");
P3("kananmunankeltuainen",0.26,"kpl","Kananmunan hinta, yksi keltuainen vastaa yhtä munaa",{},"","maito-munat-ja-rasvat/munat");
P3("patonki",4.4,"kg","Patonki (arvio, noin 250 g)",{"kpl": 250},"Arvio, tuotetta ei löytynyt verkkokaupasta.","leivat-ja-leivonnaiset/leivat");
P3("pitaleipä",6.0,"kg","Pitaleipä (arvio)",{"kpl": 55},"Arvio, tuotetta ei löytynyt verkkokaupasta.","leivat-ja-leivonnaiset/leivat");
P3("ohrasuurimot",2.6,"kg","Ohrasuurimot (arvio)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","kuivatuotteet-ja-leivonta/leseet-alkiot-rouheet");
P3("mustat pavut",3.22,"kg","Coop mustapavut suolaliemessä 390/230 g",{},"","hillot-ja-sailykkeet/kasvissailykkeet");
P3("punaviini",10.7,"l","Punaviini (arvio, ruoanlaittoon)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","alkoholi-ja-virvoitusjuomat");
P3("olut",2.4,"l","Olut (arvio)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","alkoholi-ja-virvoitusjuomat");
P3("persikka",6.5,"kg","Persikka (arvio)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","hedelmat-ja-vihannekset/hedelmat");
P3("oliivit",10.22,"kg","Coop kalamata kivettömät oliivit 350/185 g",{},"","hillot-ja-sailykkeet/kasvissailykkeet");
P3("kanan ylereisi",8.9,"kg","Kanan ylereisi (arvio)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","liha-ja-kasviproteiinit/kana-broileri-ja-kalkkuna");
P3("siika",28,"kg","Siikafilee (arvio)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","kala-ja-merenelavat/kala");
P3("turska",21,"kg","Turskafilee (arvio)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","kala-ja-merenelavat/kala");
P3("mätitahna",14,"kg","Mätitahna (arvio)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","hillot-ja-sailykkeet/kala-ja-ayriaissailykkeet");
P3("ricotta",11,"kg","Ricotta (arvio)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","juustot-tofut-ja-kasvipohjaiset/ruoka-ja-herkuttelujuustot");
P3("ohrajauho",3.2,"kg","Ohrajauho (arvio)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","kuivatuotteet-ja-leivonta/jauhot");
P3("kiinankaalisuikale",4.29,"kg","Kiinankaali (kotimainen pakattu)",{},"","hedelmat-ja-vihannekset/vihannekset/kaalit");
P3("linssit säilyke",3.98,"kg","Coop punaiset linssit 400 g",{},"","hillot-ja-sailykkeet/kasvissailykkeet");
P3("vihreät linssit",4.6,"kg","Vihreät linssit, kuivat (arvio)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","pastat-riisit-ja-nuudelit");
P3("tomaattikastike",4.47,"kg","Mutti pizzakastike 400 g",{},"","hillot-ja-sailykkeet/kasvissailykkeet");
P3("sitruunamehu",5.5,"l","Sitruunamehu (arvio)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","kahvit-teet-ja-mehut/mehut");
P3("omenamehu",1.65,"l","Coop omenatäysmehu 1 l",{},"","kahvit-teet-ja-mehut/mehut");
P3("valkopippuri",62,"kg","Valkopippuri (arvio)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","oljyt-maustaminen-ja-kastikkeet/mausteet");
P3("tilli",50,"kg","Tilli (arvio, ruukku tai nippu)",{},"Arvio, perustuu yrttiruukkuun.","hedelmat-ja-vihannekset/yrtit");
/* reseptikirjaston uusille aineksille arviohinnat (marraskuu 2026, ei tarkistettu kaupasta) */
const PA=(k,p,per,src)=>P3(k,p,per,src+" (arvio)",{},"Arvio, ei tarkistettu kaupasta.","");
PA("peruna-sipulisekoitus",2.4,"kg","Peruna-sipulisekoitus, pakaste");
PA("lehtitaikina",4.5,"kg","Lehtitaikinalevyt, pakaste");
PA("kebabliha",14,"kg","Kebabliha, pakaste");
PA("porsaan kylki",9,"kg","Porsaan kylkisiivut");
PA("joulukinkku",9.5,"kg","Suolattu joulukinkku");
PA("lammas",21,"kg","Lampaan lapa tai paisti");
PA("raparperi",5,"kg","Raparperi");
PA("mascarpone",12,"kg","Mascarpone");
PA("savoiardi",13,"kg","Savoiardi-keksit");
PA("luumumarmeladi",8,"kg","Luumumarmeladi");
PA("omenahillo",6,"kg","Omenahillo");
PA("mansikkahillo",7,"kg","Mansikkahillo");
PA("chia-siemenet",12,"kg","Chiansiemenet");
PA("kuivatut karpalot",11,"kg","Kuivatut karpalot");
PA("mysli",5,"kg","Mysli");
PA("bbq-kastike",7,"kg","BBQ-kastike");
PA("kaurakerma",4.6,"l","Kaurakerma ruoanvalmistukseen");
PA("grahamjauho",1.7,"kg","Grahamjauho");
PA("silli",12,"kg","Marinoitu silli");
PA("meloni",2.5,"kg","Meloni");
PA("etikkapunajuuri",4.2,"kg","Etikkapunajuuret, purkki");
P3("persilja",50,"kg","Persilja (arvio, ruukku tai nippu)",{},"Arvio, perustuu yrttiruukkuun.","hedelmat-ja-vihannekset/yrtit");
P3("minttu",60,"kg","Minttu (arvio, ruukku)",{},"Arvio, perustuu yrttiruukkuun.","hedelmat-ja-vihannekset/yrtit");
P3("leivinjauhe",13,"kg","Leivinjauhe 100 g (arvio)",{},"Arvio, perustuu tyypilliseen pakkaushintaan.","kuivatuotteet-ja-leivonta/leivontatarvikkeet");
P3("garam masala",37.5,"kg","Meira garam masala 28 g",{},"Vain yksi tuote.","oljyt-maustaminen-ja-kastikkeet/mausteet");
P3("ansjovis",25,"kg","Ansjovis (arvio)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","hillot-ja-sailykkeet/kala-ja-ayriaissailykkeet");
P3("poronliha",36,"kg","Poronkäristys (arvio)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","liha-ja-kasviproteiinit");

/* arvioiden tarkistus: S-kaupat.fi 23.11.2026 (oletusmyymälä), mediaani tuoteryhmän vastaavista tuotteista */
const PV=(k,p,src,w)=>{const e=PR[k];if(!e)return;const o={};for(const x of Object.keys(e))if(!["p","per","src","w","d"].includes(x))o[x]=e[x];P(k,p,e.per,src,o,w||"",undefined,"2026-11-23");};
PV("kuohukerma",6.75,"Kuohukerma 35 % (2 tuotteen keskiarvo, 6,25–7,25 €/l)","");
PV("rucola",37.8,"Rucola, 50 g rasia (1 tuote, 37,8 €/kg)","Vain yksi tuote.");
PV("papu",5.76,"Pavut suolaliemessä (kidney, mustat, jättipavut), valutettu paino (mediaani 30 tuotteesta, 3,17–12,68 €/kg)","");
PV("kokonainen kana",6.25,"Kokonainen broileri, maustamaton (1 tuote, 6,25 €/kg)","Vain yksi tuote.");
PV("kalkkunafilee",20.69,"Kalkkunan filee ja fileerulla (mediaani 6 tuotteesta, 17,99–23,37 €/kg)","");
PV("patonki",9.39,"Patonki (mediaani 5 tuotteesta, 7,92–10,45 €/kg)","");
PV("pitaleipä",7.16,"Pitaleipä (mediaani 5 tuotteesta, 6,94–12,5 €/kg)","");
PV("ohrasuurimot",3.67,"Ohrasuurimot ja -ryynit (mediaani 4 tuotteesta, 3,3–5,1 €/kg)","");
PV("punaviini",9.99,"Punaviini (tetra ja hanapakkaus) (mediaani 27 tuotteesta, 7,69–15,19 €/l)","");
PV("olut",3.2,"Vaalea lager-olut, edullinen","Ruoanlaittoon riittää edullinen lager; kalliimmat erikoisoluet jätetty pois.");
PV("siika",16.9,"Siikafilee, pakaste (1 tuote, 16,9 €/kg)","Vain yksi tuote.");
PV("ricotta",11.96,"Ricotta (1 tuote, 11,96 €/kg)","Vain yksi tuote.");
PV("ohrajauho",1.67,"Ohrajauho (2 tuotteen keskiarvo, 1,55–1,79 €/kg)","");
PV("vihreät linssit",7.29,"Vihreät linssit, kuivat (mediaani 8 tuotteesta, 3,39–12,12 €/kg)","");
PV("sitruunamehu",5.0,"Sitruunamehu, pullo","");
PV("valkopippuri",78.33,"Valkopippuri (mediaani 3 tuotteesta, 59,68–88,16 €/kg)","");
PV("leivinjauhe",10.72,"Leivinjauhe (mediaani 6 tuotteesta, 5,29–15,8 €/kg)","");
PV("peruna-sipulisekoitus",2.18,"Peruna-sipulisekoitus, pakaste (mediaani 9 tuotteesta, 1,49–4,7 €/kg)","");
PV("lehtitaikina",7.48,"Lehtitaikina, pakaste (mediaani 9 tuotteesta, 3,18–19,96 €/kg)","");
PV("porsaan kylki",9.92,"Porsaan kylkiviipaleet (2 tuotteen keskiarvo, 9,59–10,25 €/kg)","");
PV("joulukinkku",8.64,"Joulukinkku, pakaste (mediaani 10 tuotteesta, 6,29–31,95 €/kg)","");
PV("mascarpone",13.16,"Mascarpone (mediaani 3 tuotteesta, 8,2–14,9 €/kg)","");
PV("savoiardi",16.9,"Savoiardi-keksit (mediaani 4 tuotteesta, 15,7–24,85 €/kg)","");
PV("luumumarmeladi",5.52,"Luumumarmeladi (mediaani 3 tuotteesta, 5–5,96 €/kg)","");
PV("omenahillo",7.13,"Omenahillot ja -marmeladit (mediaani 17 tuotteesta, 2,07–39,24 €/kg)","");
PV("mansikkahillo",10.19,"Mansikkahillot ja -valmisteet (mediaani 28 tuotteesta, 2,99–25,3 €/kg)","");
PV("bbq-kastike",9.71,"BBQ-kastike (mediaani 31 tuotteesta, 5,85–70,47 €/kg)","");
PV("grahamjauho",1.89,"Grahamjauho (1 tuote, 1,89 €/kg)","Vain yksi tuote.");
PV("silli",19.56,"Marinoitu silli (mediaani 52 tuotteesta, 4,63–44,9 €/kg)","");
PV("meloni",2.99,"Meloni (mediaani 6 tuotteesta, 2,39–3,89 €/kg)","");
PV("etikkapunajuuri",6.02,"Säilötyt punajuuret (mediaani 13 tuotteesta, 1,95–9,46 €/kg)","");
PV("chia-siemenet",15.95,"Chiansiemenet (mediaani 6 tuotteesta, 11,89–19,3 €/kg)","");
PV("kuivatut karpalot",13.05,"Kuivatut karpalot (2 tuotteen keskiarvo, 8,47–17,63 €/kg)","");
PV("mysli",9.9,"Mysli (mediaani 41 tuotteesta, 2,49–20,63 €/kg)","");
PV("lammas",22.2,"Karitsan paisti (2 tuotetta, 20,39–23,99 €/kg)","");
PV("kaurakerma",3.96,"Kaurakerma ruoanvalmistukseen (Oatly iMat 13 %)","Vain yksi maustamaton tuote.");
PV("ansjovis",34.1,"Anjovisfileet (2 tuotetta, 26,38–41,85 €/kg)","");
PV("juuriselleri",3.89,"Juuriselleri","Vain yksi tuote.");
PV("minttu",90.4,"Minttu, ruukku (4 tuotetta, 1,48–2,48 € / kpl, noin 25 g)","");
const DEPS=["Hedelmät ja vihannekset", "Leivät ja leivonnaiset", "Pasta, riisi ja viljat", "Leivonta", "Säilykkeet", "Hillot ja levitteet", "Mausteet ja liemet", "Öljyt, kastikkeet ja texmex", "Makeiset ja naposteltavat", "Juomat", "Tuore liha", "Leikkeleet ja makkarat", "Kala ja merenelävät", "Maito, munat ja rasvat", "Juustot ja tofu", "Valmisruoka", "Pakasteet", "Koti ja hygienia", "Muut"];
const DEPMAP={"hedelmat-ja-vihannekset":0,"hedelmat-ja-vihannekset-1":0,"leivat-ja-leivonnaiset":1,"pastat-riisit-ja-nuudelit":2,"kuivatuotteet-ja-leivonta":3,"hillot-ja-sailykkeet":4,"oljyt-maustaminen-ja-kastikkeet":7,"texmex-ja-maailman-makuja":7,"karkit-suklaat-ja-keksit":8,"snacksit":8,"kahvit-teet-ja-mehut":9,"alkoholi-ja-virvoitusjuomat":9,"liha-ja-kasviproteiinit":10,"liha-ja-kasviproteiinit-1":10,"kala-ja-merenelavat":12,"maito-munat-ja-rasvat":13,"juustot-tofut-ja-kasvipohjaiset":14,"valmisruoka":15,"pakasteet":16,"kodinhoito-ja-taloustarvikkeet":17,"kosmetiikka-ja-hygienia":17,"lapset":17,"lemmikit":17,"keittio-ja-kattaus":17};
const DEPSUB={"hillot":5,"marmeladit":5,"pahkina-ja-suklaalevitteet":5,"soseet-ja-hyytelot":5,"mausteet":6,"suolat":6,"liemivalmisteet-ja-fondit":6,"kinkut-ja-leikkeleet":11,"makkarat-nakit-ja-pekonit":11,"hiutaleet":2,"murot":2,"myslit-ja-granolat":2,"leseet-alkiot-rouheet":2};
/* kaupat: s-kaupat.fi 20.11.2026 (Prisma 84 ruokakauppaa, S-market 467), lidl.fi 20.11.2026 (Lidl 209), k-ruoka.fi 20.11.2026 (K-Citymarket 85, K-Supermarket 256). Muodossa nimi|kunta */
const slug=t=>t.toLowerCase().replace(/ä/g,"a").replace(/ö/g,"o").replace(/å/g,"a").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const STORE_TYPES=[{id:"s-market",n:"Kaikki S-marketit"},{id:"prisma",n:"Kaikki Prismat"},{id:"lidl",n:"Kaikki Lidlit"},{id:"k-citymarket",n:"Kaikki K-Citymarketit"},{id:"k-supermarket",n:"Kaikki K-Supermarketit"},{id:"k-market",n:"Kaikki K-Marketit"}];
const mkSt=(pre,t)=>l=>{const i=l.lastIndexOf("|");const n=l.slice(0,i);return{id:pre+slug(n),n,c:l.slice(i+1),t};};
const STORES=[...STORE_TYPES.map(x=>({id:x.id,n:x.n,c:"",t:x.id,type:true})),...STORE_P.split(";").map(mkSt("pr-","prisma")),...STORE_S.split(";").map(mkSt("sm-","s-market")),...(()=>{const r=STORE_L.split(";").map(mkSt("ld-","lidl")),s=x=>x.n.replace(/\s\d+(?:-\d+)?(?:\s?[A-Za-z])?$/,""),cnt={};r.forEach(x=>{const k=s(x);cnt[k]=(cnt[k]||0)+1;});return r.map(x=>cnt[s(x)]===1?{...x,n:s(x)}:x);})(),...STORE_K.split(";").map(mkSt("kc-","k-citymarket")),...STORE_KS.split(";").map(mkSt("ks-","k-supermarket"))];
const STORE_IDS=new Set(STORES.map(x=>x.id));
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
const typeOf=id=>{if(!id)return"";const b=STORE_BY.get(id);if(b)return b.t;return state.sx[id]?typeOfName(state.sx[id]):"";};
const storeName=id=>{if(!id)return"Oletusjärjestys";const b=STORE_BY.get(id);return b?b.n:(state.sx[id]||"Oletusjärjestys");};
const storeOrder=id=>(id&&(state.so[id]||state.so[typeOf(id)]||TYPE_ORD[typeOf(id)]))||DEFORD;
/* osasto 6 (Mausteet ja liemet) = vähän kuluvat; vanha omien ainesten numerointi 0–9 siirretään uuteen 0–18 */
function migDept(k,d){
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
const XSUG=[["banaanit",0],["omenat",0],["appelsiinit",0],["mandariinit",0],["viinirypäleet",0],["tomaatit",0],["kurkku",0],["paprika",0],["salaatti",0],["avokado",0],["sitruuna",0],["leikkeleet",11],["kinkku",11],["nakit",11],["grillimakkara",11],["savulohi",12],["maito",13],["piimä",13],["jogurtti",13],["rahka",13],["kefiiri",13],["kermaviili",13],["juusto",14],["raejuusto",14],["levite",13],["kananmunat",13],["ruisleipä",1],["paahtoleipä",1],["vaalea leipä",1],["sämpylät",1],["patonki",1],["pulla",1],["näkkileipä",1],["valmispizza",15],["valmisruoat",15],["pakastevihannekset",16],["pakastemarjat",16],["kalapuikot",16],["jäätelö",16],["mysli",2],["murot",2],["kahvi",9],["tee",9],["nuudelit",2],["pähkinät",3],["ketsuppi",7],["sinappi",7],["majoneesi",7],["hillo",5],["valmiskastike",7],["valmiskeitto",4],["etikka",7],["hunaja",3],["maustesekoitus",6],["mehu",9],["virvoitusjuoma",9],["kivennäisvesi",9],["keksit",8],["suklaa",8],["karkit",8],["sipsit",8],["wc-paperi",17],["talouspaperi",17],["astianpesuaine",17],["pyykinpesuaine",17],["huuhteluaine",17],["hammastahna",17],["käsisaippua",17],["shampoo",17],["suihkugeeli",17],["roskapussit",17],["leivinpaperi",17],["alumiinifolio",17],["pesusieni",17],["kosteuspyyhkeet",17]];
const XD=Object.fromEntries(XSUG);
Object.assign(XD,{"leipä":1,"olut":9,"kaurajuoma":13,"viili":13,"kerma":13});
/* ---------- Muut tuotteet: sama tietuemuoto kuin ainesrekisterissä, mutta oma lista ----------
   tietue: k nimi, d osasto, q pakkauksen koko, u g | ml | kpl, p pakkauksen hinta €, note tuote ja lähde, path hakupolku s-kaupat.fi, w heikon arvion syy, syn synonyymit, lbl pakkausteksti */
const OT=new Map(),OTS=new Map();
function O(k,d,q,u,p,note,path,w,syn,lbl){
  const o={k,d,q,u,p,note,path,w:w||"",syn:syn||[],lbl:lbl||"",dt:"2026-11-19"};
  o.b={d,q,u,p:p==null?null:p,lbl:lbl||"",w:w||""};
  OT.set(k,o);OTS.set(k,o);for(const s of o.syn)if(!OTS.has(s))OTS.set(s,o);
  XD[k]=d;for(const s of o.syn)if(!Object.prototype.hasOwnProperty.call(XD,s))XD[s]=d;
  if(!XSUG.some(x=>x[0]===k))XSUG.push([k,d]);
}
const otOf=k=>OTS.get(k)||null;
/* omat muutokset valmiisiin Muut tuotteet -tuotteisiin: state.ot[k]={d,p,q,u}, alkuperäinen säilyy o.b:ssä */
function applyOtx(){
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
function otP(o){
  if(o.p!=null)return o.p;
  const e=findPrice(o.k);if(!e)return null;
  if((e.per==="kg"&&o.u==="g")||(e.per==="l"&&o.u==="ml"))return e.p*o.q/1000;
  if(e.per==="kpl"&&o.u==="kpl")return e.p*o.q;
  return null;
}
const otPack=o=>o.lbl||(o.u==="kpl"?fmtNum(o.q)+" kpl":(o.u==="ml"?(o.q>=1000?fmtNum(o.q/1000)+" l":fmtNum(o.q)+" ml"):(o.q>=1000?fmtNum(o.q/1000)+" kg":fmtNum(o.q)+" g")));
const otUnit=o=>{const p=otP(o);return p==null?null:o.u==="kpl"?(o.q>1?p/o.q:null):p/o.q*1000;};
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
function deptOf(key){
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
function listItems(l){
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
const needed=l=>listItems(l).filter(e=>!l.have.includes(e.key));
function groupDeps(list,have,store){
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
function packOf(key){
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
const fmtB=(s,b)=>b==="kpl"?fmtNum(s)+" kpl":fmt(b,s);
/* ostettava määrä pakkauksina: {txt,need,n,cost,adj} tai null */
function packInfo(e,l){
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
function perText(e){
  const a=[...(e.per||new Map())].map(([n,m])=>n+(m.size?" "+[...m].map(([f,v])=>fmt(f,v)).join(" + "):""));
  if(e.extra&&a.length)a.push("muu ostos"+(e.xq?" "+e.xq:""));
  return a.join(", ");
}
/* muun ostoksen määrä: "2 pkt", "500 g", "1,5 l" */
function xQty(q){
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
function itemCost(e,l){
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
const pillText=(e,l)=>{const pi=packInfo(e,l);if(!pi)return qtyText(e);return(pi.pk?pi.n+" kpl":pi.txt)+(e.xq?" + "+e.xq:"");};
/* rivin pieni teksti: pakkauskoko + hinta €/kpl */
function rowSub(e,l){
  if(!(e.extra&&!e.amts.size)){
    const pi=packInfo(e,l);
    if(pi&&pi.cost!=null){
      const lab=pi.pk&&!(pi.pk[0]===1&&pi.pk[1]==="kpl")?fmtB(pi.pk[0],pi.pk[1])+" · ":"";
      return`<span class="ep2">${esc(lab)}${eur(pi.cost/pi.n)}/${pi.pk?"kpl":esc(pi.txt.replace(/^\d+ /,""))}</span>`;
    }
  }
  return itemCost(e,l).txt.replace('class="ep"','class="ep2"');
}
const qtyMain=(e,l)=>{const pi=packInfo(e,l);return pi?pi.txt+(e.xq?" + "+e.xq:""):qtyText(e);};
const qtyText=e=>{
  const a=[...e.amts].map(([f,v])=>fmt(f,v));
  if(e.xq)a.push(e.xq);
  return a.length?a.join(" + "):(e.extra&&!e.open&&e.from.length===1?"":"tarpeen mukaan");
};
function pruneChecked(){for(const l of state.lists){const k=new Set(listItems(l).map(i=>i.key));l.checked=l.checked.filter(x=>k.has(x));l.have=l.have.filter(x=>k.has(x));if(l.adj)for(const a of Object.keys(l.adj))if(!k.has(a))delete l.adj[a];}}
function purgeCart(id){for(const l of state.lists)l.cart=l.cart.filter(i=>i!==id);}
function newList(){
  const d=todayLocal();
  const l={id:"l"+Date.now().toString(36)+Math.random().toString(36).slice(2,5),name:mkName(d,state.lists),d,cart:[],checked:[],have:[],x:[],store:state.store||""};
  state.lists.push(l);state.act=l.id;
  while(state.lists.length>30){const i=state.lists.findIndex(x=>x.id!==l.id);state.lists.splice(i,1);}
  return l;
}
function ensureList(){
  const t=todayLocal(),a=actList(state);
  if(a&&a.d===t)return a;
  const same=[...state.lists].reverse().find(l=>l.d===t);
  if(same){state.act=same.id;return same;}
  return newList();
}
function measureTabs(){const t=document.querySelector(".tabs");if(t&&t.offsetHeight)document.documentElement.style.setProperty("--tabh",t.offsetHeight+"px");}
addEventListener("resize",measureTabs);addEventListener("load",measureTabs);measureTabs();
let toastT=0;
function showListToast(l,rid){
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
function openMenu(lid){
  const l=state.lists.find(q=>q.id===lid);if(!l)return;
  mLid=lid;mArm="";hideToast();$("mbody").innerHTML=menuHtml(l);$("mdlg").showModal();
}
function copyName(n){
  const base=clip(String(n).replace(/ \(kopio(?: \d+)?\)$/,""),31)+" (kopio)";
  let c=base,k=2;while(state.lists.some(l=>l.name===c))c=base.replace(/\)$/," "+(k++)+")");
  return c;
}
function flashToast(html){
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
function showRmToast(l,rid,i){
  const r=byId(rid),t=$("toast");
  $("dtoast").hidden=true;
  t.innerHTML=`<span>Poistettu listalta <b>${esc(l.name)}</b>: ${esc(r?r.name:"ruoka")}</span><button type="button" data-lst="undorm" data-rid="${esc(rid)}" data-from="${esc(l.id)}" data-i="${i}">Kumoa</button>`;
  t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{t.hidden=true;},8000);
}
function undoToast(html,attrs){
  const t=$("toast");$("dtoast").hidden=true;
  t.innerHTML=`<span>${html}</span><button type="button" ${attrs}>Kumoa</button>`;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{t.hidden=true;},8000);
}
function hideToast(){clearTimeout(toastT);$("toast").hidden=true;$("dtoast").hidden=true;}
function moveRecipe(rid,fromId,toId){
  const from=state.lists.find(l=>l.id===fromId),to=state.lists.find(l=>l.id===toId);
  if(!to)return;
  if(from&&from!==to)from.cart=from.cart.filter(i=>i!==rid);
  if(!to.cart.includes(rid))to.cart.push(rid);
  if(from&&from!==to&&!from.cart.length)state.lists=state.lists.filter(l=>l!==from);
  state.act=to.id;pruneChecked();mutate();refreshCart();showListToast(to,rid);
}
function openChooser(rid,fromId){
  const ls=[...state.lists].reverse();
  $("lbody").innerHTML=`<button type="button" class="dx" data-lclose aria-label="Sulje">${ico("x")}</button><h2 class="dh">Valitse ostoslista</h2>`+
    ls.map(l=>`<button type="button" class="lopt" data-lst="move" data-rid="${esc(rid)}" data-from="${esc(fromId)}" data-lid="${esc(l.id)}" aria-pressed="${l.cart.includes(rid)}"><span>${esc(l.name)}</span><small>${l.cart.length} ruokaa</small></button>`).join("")+
    `<button type="button" class="lopt nw" data-lst="newmove" data-rid="${esc(rid)}" data-from="${esc(fromId)}"><span>+ Uusi lista (${esc(mkName(todayLocal(),state.lists))})</span></button><div style="height:22px"></div>`;
  hideToast();$("ldlg").showModal();
}
$("ldlg").addEventListener("click",e=>{if(e.target===$("ldlg"))$("ldlg").close();});
/* kauppavalinta ja osastojärjestys */
const lg=t=>LOGO[t]?`<img class="lg" src="${LOGO[t]}" alt="" width="28" height="28">`:"";
const sNew=o=>{sS={q:"",edit:false,set:false,cur:"",scope:"store",from:"",focus:"",...o};};
let sS;sNew({});
const allStores=()=>[...STORES.filter(x=>!x.type),...Object.keys(state.sx).map(id=>({id,n:state.sx[id],c:"oma",t:typeOf(id)}))].sort((a,b)=>a.n.localeCompare(b.n,"fi"));
const typeN=id=>(STORE_TYPES.find(t=>t.id===id)||{}).n||"";
function renderStoreDlg(){
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
let renaming=false,delList=false,viewId=null;
const vList=()=>state.lists.find(l=>l.id===viewId)||null;
function peekList(){const t=todayLocal(),a=actList(state);if(a&&a.d===t)return a;return [...state.lists].reverse().find(l=>l.d===t)||null;}
function toggleCart(id){
  const p=peekList();
  if(p&&p.cart.includes(id)){
    const l=ensureList(),i=l.cart.indexOf(id);
    l.cart.splice(i,1);
    pruneChecked();mutate();refreshCart();
    hideToast();return;
  }
  openAdd(id);
}
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
function openAdd(id){
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
function leftCount(l){let n=0;for(const e of listItems(l))if(!l.have.includes(e.key)&&!l.checked.includes(e.key))n++;return n;}
function updBadge(){const b=$("badge");if(!b)return;const l=actList(state),n=l?leftCount(l):0;const t=n?String(n):"";if(b.textContent!==t)b.textContent=t;}
function refreshCart(){
  updBadge();
  document.querySelectorAll("[data-cart]").forEach(b=>{
    const on=inCart(b.dataset.cart);
    b.setAttribute("aria-pressed",on);
    if(b.classList.contains("ic")){b.innerHTML=ico(on?"check":"tlist");b.setAttribute("aria-label",(on?"Poista ostoslistalta":"Lisää ostoslistalle")+": "+((byId(b.dataset.cart)||{}).name||""));}
    else b.innerHTML=cartInner(on);
  });
  if(!$("v-cart").hidden)renderCart();
}
function listStats(l){
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
function rmExtra(l,k){if(l.adj)delete l.adj[k];l.x=(l.x||[]).filter(i=>i.k!==k);l.checked=l.checked.filter(x=>x!==k);}
function addExtra(l,text){
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
function renderCart(){
  const l=vList();
  if(!l){viewId=null;document.body.classList.remove("inlist");return renderOverview();}
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
async function copyList(){
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

/* ---------- tietoikkuna ---------- */
/* ---------- hintalinkit ja oman hinnan lisäys ---------- */
let pf=null;const pmOpen=new Set();
const PUNIT={kg:"kg",l:"l",kpl:"kpl"};
function guessPer(p){
  if(["kpl","prk","pss","nippu"].includes(p.fam))return"kpl";
  if(["ml","rkl","tl"].includes(p.fam))return"l";
  return"kg";
}
const kvRow=(l,v,cls)=>`<div${cls?` class="${cls}"`:""}><dt>${l}</dt><dd>${v}</dd></div>`;
const nutKv=n=>`<dl class="kv">${kvRow("Energia",f0(n.kcal)+" kcal")}${kvRow("Proteiini",f1(n.prot)+" g")}${kvRow("Rasva",f1(n.fat)+" g")}${kvRow("josta tyydyttynyttä",f1(n.sat)+" g","sub")}${kvRow("Hiilihydraatit",f1(n.carb)+" g")}${kvRow("Suola",fs(n.salt)+" g")}</dl>`;
function packTxt(key){const pk=packOf(key);return pk?(pk[1]==="kpl"?fmtNum(pk[0])+" kpl":fmtB(pk[0],pk[1])):"";}
function priceKv(key,e,x){
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
function priceFormHtml(){
  const o=u=>`<option value="${u}"${pf.per===u?" selected":""}>€ / ${u}</option>`;
  return`<div class="pf"><p class="pft">Hinta: ${esc(pf.name)}</p><div class="pfr"><input id="pfp" type="text" inputmode="decimal" placeholder="hinta" value="${esc(pf.p)}" aria-label="Hinta euroina"><select id="pfu" aria-label="Hinnan yksikkö">${o("kg")}${o("l")}${o("kpl")}</select></div><input id="pfl" type="url" placeholder="Linkki hintaan (valinnainen)" value="${esc(pf.url)}" aria-label="Linkki hintaan"><p class="note err" id="pfe" role="alert"></p><div class="pfa"><button type="button" class="go" data-pf="save">Tallenna</button><button type="button" class="cartbtn" data-pf="cancel"><span>Peruuta</span></button>${gp(pf.key)?`<button type="button" class="clear" data-pf="clear">Poista oma hinta</button>`:""}</div></div>`;
}
function afterPrice(){mutate();renderDlg();renderIdeas();refreshCart();refreshReg();}
function pfAct(x){pfAct0(x);refreshReg();}
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
const dlg=$("dlg");let openId=null,delAsk=false,edit=null,dlgList="";
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
const introOf=r=>r.custom?(r.intro||""):(r.d||"");
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
function renderDlg(){
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
    sdOnLink(r)+`<p class="cpy"><button type="button" class="clear" data-copy="${esc(r.id)}">Tee oma kopio</button></p><div class="actions"><div class="sdslot" id="sdslot">${sdFor===r.id?sdRowHtml(r):""}</div>${(()=>{const fl=dlgList&&state.lists.find(q=>q.id===dlgList);return fl&&fl.cart.includes(r.id)?`<button type="button" class="cartbtn rmfl" data-rmfl="${esc(r.id)}" data-lid="${esc(fl.id)}">${ico("x")}<span>Poista listalta: ${esc(fl.name)}</span></button>`:cartBtn(r);})()}<button type="button" class="cartbtn" data-edit="${esc(r.id)}">${ico("pencil")}<span>Muokkaa</span></button></div>`;
}
function openDlg(id,fl){
  /* pääraaka-ainesuodatin päällä: avataan versio, joka vastaa suodatinta */
  {const r=byId(id),want=$("hkdlg").open?hf.m:sel.m;
   if(r&&r.vs&&r.vs.length>1&&want&&want.size&&!want.has(mainOf(r))){const v=r.vs.find(v=>want.has(verMain(r,v)));if(v)setSel(id,n=>{n.v=v.id;});}}
  if(!edit&&byId(id)){state.views[id]=Math.min(99999,(state.views[id]||0)+1);mutate();}
  openId=id;dlgList=fl||"";delAsk=false;pf=null;nutOpen=false;ingOpen=true;stepOpen=false;pmOpen.clear();sdOpen.clear();renderDlg();
  if(!openId)return;
  if(!dlg.open)dlg.showModal();
  dlg.scrollTop=0;
}
dlg.addEventListener("close",()=>{if(curTab==="add"&&!ned)setTimeout(renderNewHost,0);if(state.sort==="views")viewsDirty=true;dropDraftImg();openId=null;dlgList="";delAsk=false;edit=null;pf=null;pmOpen.clear();});
dlg.addEventListener("click",e=>{if(e.target===dlg&&!edit)dlg.close();});

/* ---------- välilehdet ---------- */
let curTab="ideas",viewsDirty=false;const tabScroll={};
const tabBtns=[...document.querySelectorAll(".tab")];
function showTab(n,keep){
  pillSet(false);hideToast();sdFor=null;renderSd();
  if(curTab==="ideas")tabScroll.ideas=window.scrollY;
  curTab=n;
  if(n==="ideas"&&viewsDirty){viewsDirty=false;renderIdeas();}
  setBar(n);
  $("abx").innerHTML="";
  if(n==="cart")viewId=null;
  document.body.classList.remove("inlist");
  for(const k of ["ideas","plan","add","cart","reg"])$("v-"+k).hidden=k!==n;
  {const vv=$("v-"+n);vv.classList.remove("view-in");void vv.offsetWidth;vv.classList.add("view-in");}
  const hl=n==="reg"?(regS.back||"add"):n;
  tabBtns.forEach(b=>{const on=b.dataset.tab===hl;b.setAttribute("aria-selected",on);b.tabIndex=on?0:-1;});
  if(n==="cart")renderCart();
  if(n==="reg")renderReg();
  if(n==="plan")renderPlan();
  renderNewHost();
  window.scrollTo(0,keep&&n==="ideas"?(tabScroll.ideas||0):0);
}
tabBtns.forEach(b=>b.addEventListener("click",()=>showTab(b.dataset.tab,true)));
document.querySelector(".tabs").addEventListener("keydown",e=>{
  const i=tabBtns.indexOf(document.activeElement);if(i<0)return;
  let j=null;
  if(e.key==="ArrowRight")j=(i+1)%tabBtns.length;
  if(e.key==="ArrowLeft")j=(i-1+tabBtns.length)%tabBtns.length;
  if(j!=null){e.preventDefault();tabBtns[j].focus();showTab(tabBtns[j].dataset.tab);}
});

/* ---------- ainesosarekisteri ---------- */
const regS={q:"",d:"",m:"",own:false,nop:false,open:null,form:null,back:"add",del:false,g:"i"};
const capF=s=>s.charAt(0).toUpperCase()+s.slice(1);
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
function renderReg(){
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
const refreshReg=()=>{if(!$("v-reg").hidden){renderRegList();}};
function openReg(q){
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
function synOwner(sn,self){
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
  else if(a==="t"){regS.otf=null;regS.open=regS.open===k?null:k;regS.form=regS.form&&regS.form.orig?null:regS.form;regS.del=false;pf=null;renderRegList();const nb=$("rlist").querySelector('[data-key="'+(window.CSS&&CSS.escape?CSS.escape(k):k)+'"]');if(nb)nb.focus();}
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

/* ---------- lisää ruoka ---------- */
const lines=v=>String(v).split("\n").map(x=>x.trim()).filter(Boolean);
const descOf=(f,url)=>url?host(url):(f.steps[0]?clip(f.steps[0],110):f.ing.length+" ainesta");
let hidOpen=false;
function uiEdit(){
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
  pick=null;mutate();renderIdeas();refreshCart();
});
const NEWREC=()=>({id:"",name:"",mo:"",t:"",s:[],min:0,ing:[],steps:[],url:"",custom:true,m:"",wd:"",fe:"",jf:false,kq:[]});
let ned=null;
const swapNew=fn=>{const sv=edit;edit=ned;try{return fn();}finally{ned=edit;edit=sv;}};
function renderNewHost(){
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
  pf=null;
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
const fmtQ=q=>String(Math.round(q*100)/100);
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
function renderEdit(r){
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
function beginEdit(id){
  const r=byId(id);if(!r)return;
  if(!r.custom&&hasOpt(r)){copyRecipe(id,"Muokkaat omaa kopiotasi valituilla versiolla ja muunnelmilla. Alkuperäinen resepti säilyy ennallaan.");return;}
  pf=null;edit={id,draft:mkDraft(r),tagOpen:false,pickOpen:false,delArm:false,err:""};
  if(!dlg.open||openId!==id)openDlg(id);else renderDlg();
}
function addIng(name,qty,unit){
  edit.draft.ing.push({name,qty,unit});
  edit.pickOpen=false;edit.newIng=null;edit.focus='.il li:last-child .iq';
}
function saveEdit(){
  const d=edit.draft,isNew=!!edit.isNew,r=isNew?NEWREC():byId(edit.id);
  if(!r){edit=null;return renderDlg();}
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
    edit=null;pick=null;mutate();renderIdeas();refreshCart();openDlg(id);
    return;
  }
  if(d.serv===defServ(r.id))delete state.serv[r.id];else state.serv[r.id]=d.serv;
  if(r.custom)Object.assign(r,f,{d:descOf(f,r.url)});else state.over[r.id]=f;
  {const old=state.img[r.id]||"";if(d.img!==old){if(d.img)state.img[r.id]=d.img;else delete state.img[r.id];releaseImg(old);}}
  pick=null;edit=null;pruneChecked();mutate();renderIdeas();refreshCart();renderDlg();
}
function editAct(x){
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
  else if(a==="reset"){delete state.over[edit.id];edit=null;pick=null;pruneChecked();mutate();renderIdeas();refreshCart();return renderDlg();}
  else if(a==="del"){
    if(!edit.delArm){edit.delArm=true;return renderDlg();}
    const id=edit.id,r=byId(id);
    if(r){if(r.custom)state.custom=state.custom.filter(c=>c.id!==id);else{state.hidden.push(id);delete state.over[id];}}
    purgeCart(id);state.fav=state.fav.filter(c=>c!==id);dropDraftImg();dropRecipeImg(id);delete state.views[id];
    if(pick&&pick.id===id)pick=null;
    edit=null;pruneChecked();mutate();dlg.close();renderIdeas();refreshCart();return;
  }
  else if(a==="cancel"){dropDraftImg();const nw=edit.isNew;edit=null;if(nw)return;return renderDlg();}
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
function copyRecipe(id,info){
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
  pick=null;mutate();renderIdeas();
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
/* ---------- yhteiset klikkaukset ---------- */
document.addEventListener("click",e=>{
  const t=e.target;
  let x;
  if((x=t.closest("[data-pm]"))){
    const k=x.dataset.pm;
    if(pmOpen.has(k)){pmOpen.delete(k);if(pf&&pf.key===k)pf=null;}else pmOpen.add(k);
    renderDlg();
    const nb=[...dlg.querySelectorAll("[data-pm]")].find(b=>b.dataset.pm===k);if(nb)nb.focus();
    return;
  }
  if((x=t.closest("[data-ver]"))){const id=openId,v=x.dataset.ver;setSel(id,n=>{n.v=v;});renderDlg();renderIdeas();refreshCart();const nb=dlg.querySelector('[data-ver="'+CSS.escape(v)+'"]');if(nb)nb.focus({preventScroll:true});return;}
  if((x=t.closest("[data-tw]"))){const id=openId,k=x.dataset.tw;setSel(id,n=>{const i=n.t.indexOf(k);if(i>=0)n.t.splice(i,1);else{n.t=twExcl(byId(id),n.t,k);n.t.push(k);}});renderDlg();renderIdeas();refreshCart();const nb=dlg.querySelector('[data-tw="'+CSS.escape(k)+'"]');if(nb)nb.focus({preventScroll:true});return;}
  if((x=t.closest("[data-oside]"))){if(x.dataset.over&&!state.lists.some(l=>l.cart.includes(x.dataset.oside)))useSideVer(x.dataset.oside,x.dataset.over);openDlg(x.dataset.oside);return;}
  if((x=t.closest("[data-acc]"))){const k=x.dataset.acc;if(k==="ing")ingOpen=!ingOpen;else if(k==="steps")stepOpen=!stepOpen;else nutOpen=!nutOpen;renderDlg();const nb=dlg.querySelector('[data-acc="'+k+'"]');if(nb)nb.focus();return;}
  if((x=t.closest("[data-pv]"))){setPv(openId,+x.dataset.pv);mutate();renderDlg();renderIdeas();refreshCart();const nb=dlg.querySelector('[data-pv="'+x.dataset.pv+'"]');if(nb)nb.focus();return;}
  if((x=t.closest("[data-reg-open]"))){openReg(x.dataset.regOpen);return;}
  if((x=t.closest("[data-pf]"))){pfAct(x);return;}
  if((x=t.closest("[data-ed]"))){if(x.closest("#newBody")){if(ned){swapNew(()=>editAct(x));if(!ned)renderNewHost();}}else if(edit)editAct(x);return;}
  if((x=t.closest("[data-edit]"))){beginEdit(x.dataset.edit);return;}
  if((x=t.closest("[data-have]"))){
    const l=vList();if(!l)return;
    const k=x.dataset.have,i=l.have.indexOf(k);
    if(i>=0)l.have.splice(i,1);else{l.have.push(k);l.checked=l.checked.filter(c=>c!==k);}
    mutate();renderCart();return;
  }
  if((x=t.closest("[data-lclose]"))){$("ldlg").close();return;}
  if((x=t.closest("[data-lst]"))){
    const a=x.dataset.lst,rid=x.dataset.rid,from=x.dataset.from;
    if(a==="undorm"){
      const l=state.lists.find(q=>q.id===from);
      if(l&&!l.cart.includes(rid))l.cart.splice(Math.min(+x.dataset.i||0,l.cart.length),0,rid);
      hideToast();mutate();refreshCart();return;
    }
    if(a==="undohave"||a==="undox"){
      const l=state.lists.find(q=>q.id===from);
      if(l){
        if(a==="undohave"){l.have=l.have.filter(c=>c!==x.dataset.k);}
        else if(!(l.x||[]).some(i=>i.k===x.dataset.k)){if(!l.x)l.x=[];l.x.push({k:x.dataset.k,q:x.dataset.q||""});}
      }
      hideToast();mutate();refreshCart();return;
    }
    if(a==="menu"){openMenu(x.dataset.lid);return;}
    if(a==="choose"){openChooser(rid,from);return;}
    if(a==="new"||a==="newmove"){if(a==="newmove")$("ldlg").close();const l=newList();moveRecipe(rid,from,l.id);return;}
    if(a==="move"){$("ldlg").close();moveRecipe(rid,from,x.dataset.lid);return;}
    if(a==="open"){viewId=x.dataset.lid;renaming=false;delList=false;renderCart();window.scrollTo(0,0);return;}
    if(a==="back"){viewId=null;renaming=false;delList=false;renderCart();window.scrollTo(0,0);return;}
    if(a==="create"){newList();mutate();refreshCart();return;}
    if(a==="rename"){renaming=!renaming;renderCart();const f=$("lname");if(f){f.focus();f.select();}return;}
    if(a==="rensave"){
      const l=vList(),v=clip($("lname").value.trim(),40);
      if(l&&v&&!state.lists.some(q=>q!==l&&q.name===v))l.name=v;
      renaming=false;mutate();renderCart();return;
    }
    if(a==="del"){
      if(!delList){delList=true;renderCart();return;}
      const l=vList();delList=false;renaming=false;viewId=null;
      if(l){state.lists=state.lists.filter(q=>q!==l);if(state.act===l.id)state.act=state.lists.length?state.lists[state.lists.length-1].id:"";}
      mutate();refreshCart();return;
    }
    return;
  }
  if((x=t.closest("[data-side]"))){toggleSide(x.dataset.side,x.dataset.dish,x.dataset.sver);return;}
  if((x=t.closest("[data-sdmore]"))){if(sdOpen.has("all"))sdOpen.delete("all");else sdOpen.add("all");renderSd();return;}
  if((x=t.closest("[data-pside]"))){togglePSide(x.dataset.pside,x.dataset.dish);return;}
  if((x=t.closest("[data-sdown]"))){sdOwn=!sdOwn;renderSd();const inp=document.querySelector(dlg.open?"#sdslot .sdrow input":".sdrow.cs input");if(inp)inp.focus();return;}
  if((x=t.closest("[data-sdadd]"))){addOwnSide(x);return;}
  if((x=t.closest("[data-sdclose]"))){sdFor=null;sdOwn=false;renderSd();return;}
  if((x=t.closest("[data-sdno]"))){
    const id=x.dataset.dish||openId;if(!id)return;
    state.nos=state.nos.filter(i=>i!==id);
    if(x.dataset.sdno==="1"){state.nos.push(id);if(sdFor===id)sdFor=null;}
    mutate();renderSd();if(dlg.open&&openId===id)renderDlg();return;
  }
  if(t.closest(".sdrow"))return;
  if((x=t.closest("[data-clrf]"))){clearFilters();return;}
  if((x=t.closest("[data-cook]"))){openCook(x.dataset.cook);return;}
  if((x=t.closest("[data-copy]"))){copyRecipe(x.dataset.copy);return;}
  if((x=t.closest("[data-fav]"))){toggleFav(x.dataset.fav);return;}
  if((x=t.closest("[data-rmfl]"))){
    const rid=x.dataset.rmfl,l=state.lists.find(q=>q.id===x.dataset.lid),i=l?l.cart.indexOf(rid):-1;
    if(i<0)return;
    l.cart.splice(i,1);pruneChecked();mutate();dlg.close();refreshCart();showRmToast(l,rid,i);return;
  }
  if((x=t.closest("[data-cart]"))){toggleCart(x.dataset.cart);return;}
  if((x=t.closest("[data-rm]"))){toggleCart(x.dataset.rm);return;}
  if((x=t.closest("[data-tab-go]"))){showTab(x.dataset.tabGo);return;}
  if((x=t.closest("[data-act]"))){
    const a=x.dataset.act;
    if(a==="copy")copyList();
    return;
  }
  if(t.closest("[data-close]")){dlg.close();return;}
  if((x=t.closest("[data-open]"))){openDlg(x.dataset.open,x.dataset.fl);return;}
  if((x=t.closest(".card[data-id]"))){openDlg(x.dataset.id);return;}
});


/* ---------- varmuuskopio ---------- */
let dlApi=null;
const bkName=()=>"ruokaideat-varmuuskopio-"+todayIso()+".json";
const bkData=()=>JSON.stringify({app:"ruokaideat",v:1,saved:new Date().toISOString(),state},null,1);
let bkMode="",bkMsg="",bkParsed=null;
function bkRender(){
  $("bkSave").innerHTML=ico("download")+"<span>Tallenna varmuuskopio</span>";
  $("bkLoad").innerHTML=ico("upload")+"<span>Palauta kopiosta</span>";
  $("bkLoad").setAttribute("aria-expanded",bkMode==="load"||bkMode==="confirm");
  const box=$("bkBox");
  const msg=bkMsg?`<p class="note bkm" role="status">${esc(bkMsg)}</p>`:"";
  if(bkMode==="text"){
    box.innerHTML=`<p class="note">Tiedoston tallennus ei ole käytössä. Kopioi teksti ja tallenna se itse tiedostoksi.</p><textarea id="bkTxt" readonly rows="6" aria-label="Varmuuskopion sisältö">${esc(bkData())}</textarea><div class="bkr"><button type="button" class="cartbtn" data-bk="copy">${ico("copy")}<span>Kopioi teksti</span></button><button type="button" class="clear" data-bk="close">Sulje</button></div>${msg}`;
  }else if(bkMode==="load"){
    box.innerHTML=`<label class="bkf"><span>Valitse varmuuskopiotiedosto</span><input type="file" id="bkFile" accept=".json,application/json"></label><label class="bkf"><span>tai liitä sisältö tähän</span><textarea id="bkTxt" rows="4" placeholder='{"app":"ruokaideat", …}' aria-label="Liitä varmuuskopion sisältö"></textarea></label><div class="bkr"><button type="button" class="cartbtn" data-bk="check">${ico("check")}<span>Tarkista</span></button><button type="button" class="clear" data-bk="close">Peruuta</button></div>${msg}`;
  }else if(bkMode==="confirm"&&bkParsed){
    const n=bkParsed;
    box.innerHTML=`<p class="note"><b>Kopiossa on:</b> ${n.custom.length} omaa ruokaa, ${n.lists.length} ostoslistaa, ${n.fav.length} suosikkia.</p><p class="note">Palautus korvaa nykyiset omat ruoat, listat, suosikit ja hinnat.</p><div class="bkr"><button type="button" class="go" data-bk="apply">Korvaa nykyiset tiedot</button><button type="button" class="clear" data-bk="close">Peruuta</button></div>`;
  }else box.innerHTML=msg;
  box.hidden=!box.innerHTML;
}
function bkParse(txt){
  txt=String(txt||"").trim();
  if(!txt)return{err:"Valitse tiedosto tai liitä sisältö."};
  if(txt.length>3e6)return{err:"Tiedosto on liian suuri."};
  let o;try{o=JSON.parse(txt);}catch(e){return{err:"Tiedostoa ei voi lukea. Onko se Ruokaideat-varmuuskopio?"};}
  const st=o&&o.app==="ruokaideat"&&o.state&&typeof o.state==="object"?o.state:null;
  if(!st)return{err:"Tämä ei ole Ruokaideat-varmuuskopio."};
  return{ns:cleanState(st)};
}
$("bkSave").onclick=async()=>{
  bkMsg="";bkParsed=null;
  if(dlApi){
    try{await dlApi.save({filename:bkName(),data:bkData()});bkMode="";bkMsg="Varmuuskopio tallennettu.";bkRender();return;}
    catch(e){if(e&&e.code==="declined"){bkMode="";bkMsg="Tallennus peruttu.";bkRender();return;}}
  }
  bkMode="text";bkRender();
};
$("bkLoad").onclick=()=>{bkMsg="";bkParsed=null;bkMode=(bkMode==="load"||bkMode==="confirm")?"":"load";bkRender();};
$("bkBox").addEventListener("change",async e=>{
  if(e.target.id!=="bkFile")return;
  const f=e.target.files&&e.target.files[0];if(!f)return;
  if(f.size>3e6){bkMsg="Tiedosto on liian suuri.";bkRender();return;}
  try{const t=await f.text();const r=bkParse(t);if(r.err){bkMsg=r.err;bkRender();return;}bkParsed=r.ns;bkMode="confirm";bkMsg="";bkRender();}
  catch(err){bkMsg="Tiedoston lukeminen epäonnistui.";bkRender();}
});
$("bkBox").addEventListener("click",async e=>{
  const b=e.target.closest("[data-bk]");if(!b)return;
  const a=b.dataset.bk;
  if(a==="close"){bkMode="";bkMsg="";bkParsed=null;bkRender();return;}
  if(a==="copy"){
    const ta=$("bkTxt");
    try{await navigator.clipboard.writeText(ta.value);bkMsg="Kopioitu.";}
    catch(err){ta.focus();ta.select();let ok=false;try{ok=document.execCommand("copy");}catch(e2){}bkMsg=ok?"Kopioitu.":"Valitse teksti ja kopioi se itse.";}
    const m=document.querySelector("#bkBox .bkm");if(m)m.textContent=bkMsg;else $("bkBox").insertAdjacentHTML("beforeend",`<p class="note bkm" role="status">${esc(bkMsg)}</p>`);
    return;
  }
  if(a==="check"){
    const r=bkParse($("bkTxt").value);
    if(r.err){bkMsg=r.err;bkRender();return;}
    bkParsed=r.ns;bkMode="confirm";bkMsg="";bkRender();return;
  }
  if(a==="apply"&&bkParsed){
    state=bkParsed;applyOtx();bkParsed=null;bkMode="";bkMsg="Varmuuskopio palautettu.";
    pmOpen.clear();openId=null;mutate();renderIdeas();refreshCart();bkRender();
  }
});
bkRender();

/* ---------- kokkausnäkymä ---------- */
const kd=$("kdlg");
let ck=null,ckTimers=[],ckInt=0,ckLock=null,ckAudio=null,ckSig="",ckTid=0;
const TRE=/(\d+(?:[.,]\d+)?)(?:\s*[-–]\s*(\d+(?:[.,]\d+)?))?\s*(minuutti\w*|min\b|tunti\w*|tunni\w*|h\b|sekunti\w*|sek\b)/gi;
function stepTimers(s){
  const out=[];let m;TRE.lastIndex=0;
  while((m=TRE.exec(s))&&out.length<4){
    const a=parseFloat((m[2]||m[1]).replace(",","."));const u=m[3].toLowerCase();
    const sec=Math.round(u[0]==="t"||u==="h"?a*3600:u[0]==="s"?a:a*60);
    if(sec>=10&&sec<=43200)out.push({sec,label:m[0].trim()});
  }
  return out;
}
function fmtT(s){
  s=Math.max(0,Math.round(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60,p=n=>String(n).padStart(2,"0");
  return h?h+":"+p(m)+":"+p(x):m+":"+p(x);
}
function ckBeep(){
  try{
    ckAudio=ckAudio||new(window.AudioContext||window.webkitAudioContext)();
    const t0=ckAudio.currentTime;
    for(let i=0;i<3;i++){const o=ckAudio.createOscillator(),g=ckAudio.createGain();o.frequency.value=880;o.connect(g);g.connect(ckAudio.destination);g.gain.setValueAtTime(.0001,t0+i*.4);g.gain.exponentialRampToValueAtTime(.25,t0+i*.4+.02);g.gain.exponentialRampToValueAtTime(.0001,t0+i*.4+.3);o.start(t0+i*.4);o.stop(t0+i*.4+.32);}
  }catch(e){}
  try{if(navigator.vibrate)navigator.vibrate([250,120,250,120,250]);}catch(e){}
}
function renderTimers(){
  const box=$("ktim");if(!box)return;
  const now=Date.now();let newly=false;
  for(const t of ckTimers)if(!t.done&&t.end<=now){t.done=true;newly=true;}
  const sig=ckTimers.map(t=>t.id+(t.done?"d":"r")).join(",");
  if(sig!==ckSig){
    ckSig=sig;
    box.innerHTML=ckTimers.map(t=>`<div class="kti${t.done?" dn":""}" data-tid="${t.id}"><span>${ico("timer")}${esc(t.label)}</span><b>${t.done?"Valmis!":fmtT((t.end-now)/1000)}</b><button type="button" data-ktx="${t.id}" aria-label="Poista ajastin">${ico("x")}</button></div>`).join("");
  }else for(const t of ckTimers){if(t.done)continue;const b=box.querySelector(`[data-tid="${t.id}"] b`);if(b)b.textContent=fmtT(Math.ceil((t.end-now)/1000));}
  box.hidden=!ckTimers.length;
  if(newly)ckBeep();
}
function renderCook(){
  const r=byId(ck.id);if(!r){kd.close();return;}
  const n=ck.steps.length,i=ck.i,s=ck.steps[i],ts=stepTimers(s);
  const ings=ingOf(r).map(l=>ingText(parseIng(l)));
  $("kbody").innerHTML=
    `<header class="kh"><button type="button" class="kx" data-kx aria-label="Sulje kokkausnäkymä">${ico("x")}</button><div class="kt"><b>${esc(r.name)}</b><span>Vaihe ${i+1} / ${n}</span></div><button type="button" class="kx${ck.ing?" on":""}" data-king aria-pressed="${ck.ing}" aria-label="Ainekset">${ico("list")}</button></header>`+
    `<div class="kp" role="progressbar" aria-valuemin="1" aria-valuemax="${n}" aria-valuenow="${i+1}"><i style="width:${(i+1)/n*100}%"></i></div>`+
    `<div class="kmain" id="kmain">${ck.ing?`<ul class="king">${ings.map((t,j)=>`<li><button type="button" class="${ck.got.has(j)?"d":""}" data-kg="${j}" aria-pressed="${ck.got.has(j)}">${ico("check")}<span>${esc(t)}</span></button></li>`).join("")}</ul>`:""}<p class="kstep">${esc(s)}</p>${ts.length?`<div class="ktbs">${ts.map((t,j)=>`<button type="button" class="ktb" data-kt="${j}">${ico("timer")}<span>Ajastin ${fmtT(t.sec)}</span></button>`).join("")}</div>`:""}</div>`+
    `<div class="ktim" id="ktim" hidden aria-live="polite"></div>`+
    `<footer class="kf"><button type="button" class="cartbtn" data-kprev${i?"":" disabled"}>${ico("left")}<span>Edellinen</span></button><button type="button" class="go" data-knext>${i===n-1?ico("check")+"<span>Valmis</span>":"<span>Seuraava</span>"+ico("right")}</button></footer>`;
  ckSig="";renderTimers();
}
async function ckLockOn(){try{if(navigator.wakeLock&&!ckLock){ckLock=await navigator.wakeLock.request("screen");ckLock.addEventListener("release",()=>{ckLock=null;});}}catch(e){ckLock=null;}}
function ckLockOff(){try{if(ckLock)ckLock.release();}catch(e){}ckLock=null;}
document.addEventListener("visibilitychange",()=>{if(kd.open&&document.visibilityState==="visible")ckLockOn();});
function openCook(id){
  const r=byId(id);if(!r||!stepsOf(r).length)return;
  if(!ck||ck.id!==id||ck.steps.join("|")!==stepsOf(r).join("|")){ck={id,i:0,steps:stepsOf(r).slice(),ing:false,got:new Set()};ckTimers=ckTimers.filter(t=>t.rid===id);}
  renderCook();
  if(!kd.open)kd.showModal();
  clearInterval(ckInt);ckInt=setInterval(renderTimers,1000);
  ckLockOn();
}
function ckGo(d){
  if(!ck)return;
  const j=ck.i+d;
  if(j<0)return;
  if(j>=ck.steps.length){ck=null;kd.close();return;}
  ck.i=j;renderCook();const m=$("kmain");if(m)m.scrollTop=0;
}
kd.addEventListener("close",()=>{clearInterval(ckInt);ckLockOff();});
kd.addEventListener("click",e=>{
  const t=e.target;let x;
  if(t.closest("[data-kx]")){kd.close();return;}
  if(t.closest("[data-king]")){ck.ing=!ck.ing;renderCook();return;}
  if((x=t.closest("[data-kg]"))){const j=+x.dataset.kg;if(ck.got.has(j))ck.got.delete(j);else ck.got.add(j);renderCook();return;}
  if(t.closest("[data-kprev]")){ckGo(-1);return;}
  if(t.closest("[data-knext]")){ckGo(1);return;}
  if((x=t.closest("[data-kt]"))){
    try{ckAudio=ckAudio||new(window.AudioContext||window.webkitAudioContext)();if(ckAudio.state==="suspended")ckAudio.resume();}catch(e){}
    const tm=stepTimers(ck.steps[ck.i])[+x.dataset.kt];if(!tm)return;
    ckTimers.push({id:++ckTid,rid:ck.id,label:(ck.i+1)+". vaihe, "+fmtT(tm.sec),end:Date.now()+tm.sec*1000,done:false});
    renderTimers();return;
  }
  if((x=t.closest("[data-ktx]"))){ckTimers=ckTimers.filter(q=>q.id!==+x.dataset.ktx);renderTimers();return;}
});
kd.addEventListener("keydown",e=>{
  if(e.key==="ArrowRight"){e.preventDefault();ckGo(1);}
  else if(e.key==="ArrowLeft"){e.preventDefault();ckGo(-1);}
});
{let sx=0,sy=0;
kd.addEventListener("touchstart",e=>{const q=e.changedTouches[0];sx=q.clientX;sy=q.clientY;},{passive:true});
kd.addEventListener("touchend",e=>{const q=e.changedTouches[0],dx=q.clientX-sx,dy=q.clientY-sy;if(Math.abs(dx)>70&&Math.abs(dy)<50&&e.target.closest("#kmain"))ckGo(dx<0?1:-1);},{passive:true});}

/* ---------- käynnistys ---------- */
if(window.claude&&typeof window.claude.use==="function"){
  Promise.resolve(window.claude.use("downloads")).then(d=>{if(d&&typeof d.save==="function")dlApi=d;}).catch(()=>{});
}
if(window.claude&&typeof window.claude.use==="function"){
  Promise.resolve(window.claude.use("assets")).then(a=>{
    if(!a||typeof a.upload!=="function")return;
    assetsApi=a;if(dlg.open&&edit)renderDlg();
  }).catch(()=>{});
}
state=cleanState(lsLoad());applyOtx();applyTheme();setBar("ideas");
if(window.innerWidth<350){document.querySelectorAll(".srt").forEach(e=>e.textContent="Hae ruokaa tai ainesta");$("hkq").placeholder="Hae ruokaa, ainesta";}
buildChips();showTab("ideas");
renderIdeas();refreshCart();
startRemote(3);
/* kehitystila: testiskriptien apu (ei mukana tuotantoversiossa) */

/* ---------- suunnitelma ---------- */
Object.assign(IC,{
  lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  unlock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>',
  shuffle:'<path d="M16 4h4v4M20 4l-6 6M4 20l6-6M16 20h4v-4M20 20l-5-5M4 4l5 5"/>',
  minus:'<path d="M6 12h12"/>'
});
let planCount=4,planAdd=null,planNew=-1,planPick=null,planEdit=null,planChk=null,planUndo=null,planOpen={sn:false,bk:false,vk:false};
const fmtN=n=>String(Math.round(n*2)/2).replace(".",",");
/* reseptin raaka-ainerivit valitulla annosmäärällä, versiolla ja muunnelmilla (t = null: ruoan omat valinnat) */
function ingFor(r,n,v,t){
  const sel=state.tv[r.id]||{};
  const a=hasOpt(r)?applySel(r,{v:v||sel.v,t:Array.isArray(t)?t:(sel.t||[])},keyOfLine).ing:r.ing;
  const f=n/servOf(r);
  return f===1?a:a.map(l=>scaleLine(l,f));
}
/* koko reseptin hinta annosta kohden (pienet ainekset karsitaan koko reseptin tasolla) */
const plCostMemo=new Map();
function plCostPer(r,v,t){
  const k=r.id+"|"+(v||"")+"|"+(Array.isArray(t)?t.join(","):JSON.stringify(state.tv[r.id]||{}));
  if(plCostMemo.has(k))return plCostMemo.get(k);
  let sum=0;
  for(const line of ingFor(r,servOf(r),v,t)){const p=parseIng(line);if(p.v==null)continue;const x=isBatch(r)?costBake(p.key,p.fam,p.v):costOf(p.key,p.fam,p.v);if(x.t==="ok")sum+=x.c;}
  const per=sum/(servOf(r)||1);plCostMemo.set(k,per);return per;
}
const isVegR=r=>["v","y"].includes(mainOf(r));
const PL_addDays=(iso,n)=>{const d=new Date(iso+"T12:00:00");d.setDate(d.getDate()+n);return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;};
let plCandsMemo=null;
/* viikonloppu: enemmän aikaa vievät ruoat ja herkuttelu (pizza, hampurilaiset, pihvit, uuniruoat); juhla: juhlapöytään merkityt ja juhlapyhien ruoat */
const WKND=/pizza|hampurilai|burger|taco|tortill|fajita|kebab|pulled|grilli|pippuripihvi|paisti|lasagne|uunilohi|butter chicken|tikka|lammas|karitsa|ribs|siivet|nachos|wings|moussaka|risotto/i;
/* juhlapyhien ruoat (joulu ym.) vain Juhla-sirulla */
const plWknd=(r,meal)=>!r.fe&&(meal.includes("j")||WKND.test(r.name));
/* pääruoat ehdokkaiksi */
function plCands(){
  if(plCandsMemo)return plCandsMemo;
  const recent=new Set(),lim=PL_addDays(todayLocal(),-14);
  for(const l of state.lists)if(l.d>=lim){l.cart.forEach(i=>recent.add(i));(l.pl||[]).forEach(e=>recent.add(e.id));}
  const out=[];
  for(const r of all()){
    if(!MEAL_MAIN.has(r.t)||r.perus||r.nopl||isBatch(r)||!r.ing.length)continue;
    /* ruoat, jotka on merkitty vain aamu-, väli- tai iltapalaksi, eivät ole pääruokia */
    if((r.ml||[]).length&&!r.ml.includes("p")&&!r.ml.includes("l"))continue;
    const vegV=(r.vs||[]).find(v=>v.veg||v.m==="v"||v.m==="y"),fishV=(r.vs||[]).find(v=>v.m==="f");
    const meal=mealOf(r),tags=tagsOf(r);
    out.push({id:r.id,name:r.name,t:r.t,main:mainOf(r),veg:isVegR(r)||!!vegV,vegV:isVegR(r)?"":(vegV?vegV.id:""),fish:mainOf(r)==="f"||!!fishV,fishV:mainOf(r)==="f"?"":(fishV?fishV.id:""),
      arki:meal.includes("a"),wknd:plWknd(r,meal),juhla:!!r.jf||!!r.fe,holiday:!!r.fe&&!r.jf,cheap:tags.includes("e"),light:tags.includes("k"),
      work:workOf(r)||r.min||0,cost:plCostPer(r,""),fav:isFav(r.id),pop:isPop(r),recent:recent.has(r.id)});
  }
  return plCandsMemo=out;
}
/* aamu- ja välipalat: perusateriat ja nopeat (ml a, v tai i) */
const plSnacks=()=>all().filter(r=>(r.ml||[]).some(x=>"avi".includes(x))&&(r.perus||(workOf(r)||r.min)<=15)&&!isBatch(r)).sort((a,b)=>(b.perus-a.perus)||a.name.localeCompare(b.name,"fi"));
const plBakes=()=>all().filter(r=>r.t==="le").sort((a,b)=>(isFav(b.id)-isFav(a.id))||(isPop(b)-isPop(a))||a.name.localeCompare(b.name,"fi"));
const VK_SUG=["maito","ruisleipä","juusto","kahvi","banaanit","omenat","kananmunat","levite","jogurtti","leikkeleet","mehu","näkkileipä"];
/* lisukkeet: "id" tai "id:versio" */
const sdParse=s=>{const[id,v]=String(s).split(":");return{id,v:v||""};};
const sdBase=s=>{const x=byId(sdParse(s).id);return x?x.name:"";};
function sdName(s){const{id,v}=sdParse(s),r=byId(id);if(!r)return"";const ver=v&&(r.vs||[]).find((x,j)=>j>0&&x.id===v);return r.name+(ver?" – "+ver.n:"");}
/* ruoan oletusvalinnat: ensimmäinen suositeltu lisuke */
function plDefaults(it){
  const r=byId(it.id);it.t=[];it.px=[];it.sd=[];if(!r)return;
  /* lisuke: reseptin oma ehdotus, muuten ruokakortin ensimmäinen ehdotus */
  const own=(r.sides||[]).find(x=>byId(sdParse(x).id));
  if(own)it.sd=[own];
  else{const g=sideSug(r),x=g&&[...g.out.c,...g.out.v].find(y=>y.t==="r");if(x)it.sd=[x.id+(x.ver?":"+x.ver:"")];}
  /* valmis tuote: reseptin ensimmäinen, keittoon leipä */
  const ex=(r.extras||[]).map(k=>String(k).toLowerCase()).find(k=>vkOk(k));
  if(ex)it.px=[ex];else if(r.t==="ke")it.px=["ruisleipä"];
}
/* annokset: reseptin oma annosmäärä (määrät on mitoitettu pakkauksiin), ruoalle voi asettaa oman */
function autoN(it){const r=byId(it.id);return r?servOf(r)||4:4;}
const plN=it=>it.n>0?it.n:autoN(it);
/* ehdotukseen vaihtelua: ilman kasvis- tai kalarajausta versio arvotaan (pizza: kinkku-ananas, salami…) */
function plVary(it){
  const r=byId(it.id);if(!r||it.v||(r.vs||[]).length<2||it.tg.includes("v")||it.tg.includes("f"))return;
  const v=r.vs[Math.floor(Math.random()*r.vs.length)];it.v=v===r.vs[0]?"":v.id;
}
const plOnPick=it=>{plVary(it);plDefaults(it);};
const plFill=(fresh=false)=>{PL.fill(plCands(),state.pl,Math.random,fresh,new Date(),plOnPick);state.pl.n=state.pl.items.length;};
function plItemCost(it){
  const r=byId(it.id);if(!r)return 0;const n=plN(it);
  let c=plCostPer(r,it.v,it.t||[])*n;
  for(const s of it.sd||[])c+=sdCost(s,n);
  return c;
}
/* lisukkeen hinta annoksille n */
function sdCost(s,n){const{id,v}=sdParse(s),x=byId(id);return x?plCostPer(x,v,[])*n:0;}
const sdPrice=(s,n)=>{const c=sdCost(s,n);return c>0?eur1(c):"";};
/* Lisäksi kaupasta (aamu- ja välipalat, leivonta, vakiot) ja hinta-arvio ovat vielä kesken: piilossa, kunnes valmiit */
const PL_EXTRAS=false;
function plTotals(){
  const pl=state.pl;let food=0,extra=0;
  for(const it of pl.items)food+=plItemCost(it);
  if(!PL_EXTRAS)return{food,extra};
  for(const[id,n]of Object.entries(pl.sn)){const r=byId(id);if(r)extra+=plCostPer(r,"")*n;}
  for(const id of pl.bk){const r=byId(id);if(r)extra+=plCostPer(r,"")*servOf(r);}
  return{food,extra};
}
/* kortin sirut: lisukkeet ja tuotteet avaavat lisukevalinnan, muunnelmat muunnelmavalinnan */
function rowChips(it,i){
  const r=byId(it.id);if(!r)return"";
  const out=[],n=plN(it),b=(to,cls,html)=>`<button type="button" class="pn-tg ${cls}" data-pa="edit" data-to="${to}" data-i="${i}">${html}</button>`;
  for(const s of it.sd||[])out.push(b("sd","on",`${ico("check")}${esc(sdBase(s))}<span class="pn-pc">${sdPrice(s,n)}</span>`));
  for(const k of (it.px||[]).filter(k=>!vkOn(k)))out.push(b("sd","on",`${ico("check")}${esc(capF(k))}`));
  if(!(it.sd||[]).length){const g=sideSug(r);if(g&&[...g.out.c,...g.out.v].some(y=>y.t==="r"))out.push(b("sd","pn-twh",`${ico("plus")}Lisuke`));}
  for(const t of it.t||[]){const m=(r.tw||[]).find(x=>x.id===t);if(m)out.push(b("tw","tw",esc(m.n)));}
  if(!(it.t||[]).length&&(r.tw||[]).length)out.push(b("tw","pn-twh",r.tw.length===1?"1 muunnelma":r.tw.length+" muunnelmaa"));
  return out.length?`<div class="pn-tags">${out.join("")}</div>`:"";
}
function renderPlan(){
  const h=$("planBody");if(!h)return;
  plCostMemo.clear();plCandsMemo=null;
  const pl=state.pl;
  if(pl.n!==pl.items.length){pl.n=pl.items.length;persist();}
  const tot=plTotals(),over=pl.ba>0&&tot.food+tot.extra>pl.ba;
  const rows=pl.items.map((it,i)=>{
    const r=it.id&&byId(it.id);
    const ver=r&&(r.vs||[]).length>1&&((it.v&&r.vs.find(v=>v.id===it.v))||r.vs[0]);
    const mt=PL.mainTag(it.tg)||"a",ex=it.tg.filter(t=>t!=="a"&&t!=="w").map(t=>PL.TAG_N[t]);
    const labs=`<div class="pn-labs"><button type="button" class="pn-lab pn-lab-${mt}" data-pa="type" data-to="main" data-i="${i}" aria-label="Pääryhmä, ruoka ${i+1}: ${esc(PL.TAG_N[mt])}">${esc(PL.TAG_N[mt])} ▾</button><button type="button" class="pn-lab pn-lab-x${ex.length?"":" none"}" data-pa="type" data-to="ex" data-i="${i}" aria-label="Rajaukset, ruoka ${i+1}: ${esc(ex.join(", ")||"ei rajauksia")}">${ex.length?esc(ex.join(", "))+" ▾":"+ Rajaus"}</button></div>`;
    const acts=`<span class="pn-act"><button type="button" class="pn-ib" data-pa="swap" data-i="${i}" aria-label="Arvo toinen ruoka ${i+1}">${ico("shuffle")}</button><button type="button" class="pn-ib" data-pa="pick" data-i="${i}" aria-label="Hae ruoka ${i+1}">${ico("search")}</button><button type="button" class="pn-ib" data-pa="rm" data-i="${i}" aria-label="Poista suunnitelmasta: ruoka ${i+1}">${ico("x")}</button></span>`;
    const body=r?`<button type="button" class="pn-name" data-pa="edit" data-i="${i}">${esc(r.name)}${ver?`<span class="pn-ver"> – ${esc(ver.n)}</span>`:""}</button>
      ${rowChips(it,i)}
      <div class="pn-meta"><span>${fmtN(plN(it))} annosta · ${fmtDur(workOf(r)||r.min||0)}</span><b>${eur1(plItemCost(it))}</b></div>`
      :`<span class="pn-name muted">Ei ruokaa näillä valinnoilla</span><p class="note">Muuta valintoja tai hae ruoka itse.</p>`;
    return`<li class="pn-item${planNew===i?" pn-new":""}${r?" pn-click":""}" data-i="${i}"><div class="pn-row1">${labs}${acts}</div>${body}</li>`;
  }).join("");
  const snacks=plSnacks(),bakes=plBakes();
  const snSel=Object.keys(pl.sn).filter(id=>byId(id));
  const sec=(k,title,sum,inner)=>`<div class="pn-x"><button type="button" class="pn-xh" data-pa="xo" data-k="${k}" aria-expanded="${planOpen[k]}"><span><b>${title}</b><small>${sum}</small></span>${ico(planOpen[k]?"up":"down")}</button>${planOpen[k]?`<div class="pn-xb">${inner}</div>`:""}</div>`;
  const snSum=snSel.length?snSel.map(id=>`${esc(byId(id).name)} ×${fmtN(pl.sn[id])}`).join(" · "):"ei valittu";
  const snInner=`${snSel.map(id=>`<div class="pn-step"><span>${esc(byId(id).name)}</span><div><button type="button" class="pn-ib sm" data-pa="sn" data-id="${esc(id)}" data-d="-1" aria-label="Vähemmän: ${esc(byId(id).name)}">${ico("minus")}</button><b>${fmtN(pl.sn[id])}</b><button type="button" class="pn-ib sm" data-pa="sn" data-id="${esc(id)}" data-d="1" aria-label="Enemmän: ${esc(byId(id).name)}">${ico("plus")}</button></div></div>`).join("")}
    <p class="note">Määrä on annoksia. Lisää napauttamalla:</p><div class="chips">${snacks.filter(r=>!pl.sn[r.id]).map(r=>`<button type="button" class="chip" data-pa="sn" data-id="${esc(r.id)}" data-d="1">${ico("plus")}${esc(r.name)}</button>`).join("")}</div>`;
  const bkSum=pl.bk.filter(id=>byId(id)).map(id=>esc(byId(id).name)).join(" · ")||"ei valittu";
  const bkInner=`<div class="chips">${bakes.slice(0,24).map(r=>`<button type="button" class="chip" data-pa="bk" data-id="${esc(r.id)}" aria-pressed="${pl.bk.includes(r.id)}">${pl.bk.includes(r.id)?ico("check"):""}${esc(r.name)}</button>`).join("")}</div><p class="note">Leivonnaisista tulee ostoslistalle yhden erän ainekset.</p>`;
  const vk=state.vk,vkA=vk.filter(k=>!pl.vo.includes(k));
  const fpx=[...new Set(pl.items.flatMap(it=>(it.px||[]).filter(k=>!vkA.includes(k))))];
  const vkSum=[...vkA,...fpx].map(k=>esc(capF(k))).join(" · ")||(vk.length?"kaikki pois tältä kerralta":"ei vakio-ostoksia");
  const vkInner=`${fpx.length?`<p class="note">Ruokien tuotteet:</p><div class="chips">${fpx.map(k=>`<button type="button" class="chip" data-pa="pxall" data-k="${esc(k)}" aria-pressed="true">${ico("check")}${esc(capF(k))}</button>`).join("")}</div>`:""}${vk.length?`<p class="note">Napauta pois, jos et tarvitse tällä kertaa.</p><div class="chips">${vk.map(k=>`<button type="button" class="chip" data-pa="vo" data-k="${esc(k)}" aria-pressed="${!pl.vo.includes(k)}">${!pl.vo.includes(k)?ico("check"):""}${esc(capF(k))}</button>`).join("")}</div>`:""}
    <div class="xrow" style="margin-top:10px"><input id="vkin" type="text" maxlength="40" placeholder="Lisää vakio-ostos, esim. maito" autocomplete="off" aria-label="Lisää vakio-ostos"><button type="button" class="go" data-pa="vkadd" style="min-height:44px;padding:0 18px">Lisää</button></div>
    <div class="chips" style="margin-top:8px">${VK_SUG.filter(k=>!vk.includes(k)).map(k=>`<button type="button" class="chip sdm" data-pa="vkq" data-k="${esc(k)}">${ico("plus")}${esc(capF(k))}</button>`).join("")}</div>
    ${vk.length?`<p class="note">Poista vakio kokonaan: <span class="pn-rmv">${vk.map(k=>`<button type="button" class="lk" data-pa="vkrm" data-k="${esc(k)}">${esc(capF(k))}</button>`).join(", ")}</span></p>`:""}`;
  const stepper=(pa,lbl,v,min,max,aria)=>`<div class="pn-step"><span>${lbl}</span><div><button type="button" class="pn-ib sm" data-pa="${pa}" data-d="-1" aria-label="Vähemmän ${aria}"${v<=min?" disabled":""}>${ico("minus")}</button><b>${v}</b><button type="button" class="pn-ib sm" data-pa="${pa}" data-d="1" aria-label="Enemmän ${aria}"${v>=max?" disabled":""}>${ico("plus")}</button></div></div>`;
  h.innerHTML=`
    ${rows?`<ol class="pn-list">${rows}</ol>`:""}
    ${pl.items.length?"":`<div class="pn-card pn-four">${stepper("cnt","Ruokia",planCount,1,10,"ruokia")}<button type="button" class="cartbtn" data-pa="four" style="width:100%;justify-content:center;margin-top:8px">${ico("shuffle")}<span>Ehdota ${planCount} ${planCount===1?"ruoka":"ruokaa"}</span></button></div>`}
    ${pl.items.length>=10?"":`<button type="button" class="pn-addb" data-pa="add">${ico("plus")}<span>Lisää ruoka suunnitelmaan</span></button>`}
    ${PL_EXTRAS?`
    <h3 class="pn-sec">Lisäksi kaupasta</h3>
    <section class="pn-card">
      ${sec("sn","Aamu- ja välipalat",snSum,snInner)}${sec("bk","Leivonta",bkSum,bkInner)}${sec("vk","Vakiot ja tuotteet",vkSum,vkInner)}</section>
    <h3 class="pn-sec">Hinta-arvio</h3>
    <section class="pn-card pn-sum"><div class="pn-sr"><span>Ruoat ja lisukkeet</span><b>${eur1(tot.food)}</b></div>${tot.extra>0?`<div class="pn-sr"><span>Aamu- ja välipalat, leivonta</span><b>${eur1(tot.extra)}</b></div>`:""}
      <div class="pn-bud"><label for="pba">Budjetti</label><input id="pba" type="number" inputmode="decimal" min="0" step="1" value="${pl.ba>0?pl.ba:""}" placeholder="ei" aria-label="Budjetti euroina"><span>€</span></div>
      ${pl.ba>0?`<div class="pn-bar${over?" over":""}"><i style="width:${Math.min(100,Math.round((tot.food+tot.extra)/pl.ba*100))}%"></i></div>${over?`<p class="note err">Budjetti ylittyy ${eur1(tot.food+tot.extra-pl.ba)}. Valitse Edullinen tai vaihda kalleimpia ruokia.</p>`:""}`:""}
      <p class="note">Arvio lasketaan annoksista. Vakiot ja pakkauskoot näkyvät ostoslistan hinnassa.</p></section>`:""}
    ${pl.items.length||PL_EXTRAS&&(snSel.length||pl.bk.length)?`<div class="actions pn-foot"><button type="button" class="go" data-pa="shop" style="width:100%">${ico("tlist")}<span>Ostoslistalle · noin ${eur1(tot.food+tot.extra)}</span></button></div>`:""}`;
}
const plOthers=i=>state.pl.items.filter((x,j)=>j!==i&&x.id).map(x=>plCands().find(c=>c.id===x.id)).filter(Boolean);
function planSwap(i,undo){
  const pl=state.pl,it=pl.items[i];if(!it)return;
  const prev=JSON.parse(JSON.stringify(it));
  const c=PL.pick(plCands(),it.tg,plOthers(i),Math.random,it.id?[it.id]:[]);
  if(c){it.id=c.id;it.v=PL.versionFor(c,it.tg);plOnPick(it);}else{it.id="";it.v="";it.t=[];it.sd=[];it.px=[];}
  if(undo&&prev.id){planUndo={i,prev};const r=byId(prev.id);undoToast(`${esc(r?r.name:"Ruoka")} vaihdettiin`,'data-pundo="1"');}
}
$("toast").addEventListener("click",e=>{
  if(!e.target.closest("[data-pundo]")||!planUndo)return;
  const{i,prev,ins}=planUndo;planUndo=null;
  if(ins){state.pl.items.splice(Math.min(i,state.pl.items.length),0,prev);state.pl.n=state.pl.items.length;mutate();renderPlan();}
  else if(state.pl.items[i]){state.pl.items[i]=prev;mutate();renderPlan();}
  hideToast();
});
function planRemove(i){
  const pl=state.pl,prev=pl.items.splice(i,1)[0];if(!prev)return;pl.n=pl.items.length;planUndo={i,prev,ins:true};mutate();renderPlan();
  const r=byId(prev.id);undoToast(`${esc(r?r.name:"Ruoka")} poistettiin`,'data-pundo="1"');
}
/* ---------- ruoan muokkausikkuna ---------- */
/* ruoan ikkuna: koko ikkuna (versio, lisukkeet, tuotteet, muunnelmat, annokset) tai vain yksi osa (only: "sd" tai "tw") */
function renderEditPl(){
  if(!planEdit)return;
  const pl=state.pl,i=planEdit.i,it=pl.items[i];if(!it){$("pkdlg").close();return;}
  const r=byId(it.id);if(!r){$("pkdlg").close();return;}
  const only=planEdit.only||"",n=plN(it);
  const chip=(a,k,on,txt,extra="",pr="")=>`<button type="button" class="chip" data-pe="${a}" data-k="${esc(k)}" aria-pressed="${on}"${extra}>${on?ico("check"):""}${esc(txt)}${pr?`<span class="pn-pc">${pr}</span>`:""}</button>`;
  const H=(t,id="")=>only?"":`<h3 class="pn-h"${id?` id="${id}"`:""}>${t}</h3>`;
  const sec={};
  if((r.vs||[]).length>1)sec.v=`${H("Versio")}<div class="chips">${r.vs.map(v=>chip("v",v.id,(it.v||r.vs[0].id)===v.id,v.n)).join("")}</div>`;
  /* lisukkeet: vain ruoalle ehdotetut, muut erikseen pyydettäessä */
  const g=sideSug(r),seen=new Set(),sug=[],rest=[];
  const put=(arr,s)=>{const id=sdParse(s).id;if(!seen.has(id)){seen.add(id);arr.push(s);}};
  for(const s of it.sd||[])put(sug,s);
  for(const x of g?[...g.out.c,...g.out.v]:[])if(x.t==="r")put(sug,x.id+(x.ver?":"+x.ver:""));
  for(const x of all().filter(y=>y.t==="li"))put(rest,x.id);
  const shown=planEdit.allSd?[...sug,...rest]:sug;
  let sd=`${H("Lisukkeet","pe-sd")}${shown.length?`<div class="chips">${shown.map(s=>chip("sd",s,(it.sd||[]).includes(s),sdBase(s),"",sdPrice(s,n))).join("")}</div>`:`<p class="note">Ruoalle ei ehdoteta lisuketta.</p>`}
    <button type="button" class="lk pn-more" data-pe="allsd" data-k="1">${planEdit.allSd?"Näytä vain ehdotetut":"Näytä kaikki lisukkeet"}</button>`;
  for(const s of it.sd||[]){const{id,v}=sdParse(s),x=byId(id);if(!x||(x.vs||[]).length<2)continue;
    sd+=`<p class="note" style="margin:10px 0 2px">${esc(x.name)}</p><div class="chips">${x.vs.map(w=>chip("sdv",id+":"+w.id,(v||x.vs[0].id)===w.id,w.n,"",sdPrice(id+":"+w.id,n))).join("")}</div>`;}
  const prods=g?[...g.out.c,...g.out.v,...g.out.o].filter(x=>x.t==="p"):[];
  const pk=[...new Set([...prods.map(x=>x.id),...(it.px||[])])].slice(0,8);
  if(pk.length)sd+=`<h3 class="pn-h">Valmiit tuotteet</h3><div class="chips">${pk.map(k=>vkOn(k)?chip("pxv",k,true,capF(k)+" (vakio)"):chip("px",k,(it.px||[]).includes(k),capF(k))).join("")}</div>`;
  sec.sd=sd;
  if((r.tw||[]).length)sec.tw=`${H("Muunnelmat","pe-tw")}<div class="pn-tws">${r.tw.map(m=>`<button type="button" class="pn-twb" data-pe="t" data-k="${esc(m.id)}" aria-pressed="${(it.t||[]).includes(m.id)}"><b>${(it.t||[]).includes(m.id)?ico("check"):""}${esc(m.n)}${twFits(m,it.tg)&&!(it.t||[]).includes(m.id)?`<span class="pn-fit">Sopii: ${esc(it.tg.filter(t=>"kve".includes(t)).map(t=>PL.TAG_N[t]).join(", "))}</span>`:""}</b>${m.d?`<small>${esc(m.d)}</small>`:""}</button>`).join("")}</div>`;
  sec.n=`${H("Annokset")}<div class="pn-step"><span>${it.n>0?`Muutettu, reseptissä ${autoN(it)}`:"Reseptin mukaan"}</span><div><button type="button" class="pn-ib sm" data-pe="n" data-k="-1" aria-label="Vähemmän annoksia"${n<=1?" disabled":""}>${ico("minus")}</button><b>${n}</b><button type="button" class="pn-ib sm" data-pe="n" data-k="1" aria-label="Enemmän annoksia">${ico("plus")}</button></div></div>`;
  const ver=it.v&&(r.vs||[]).find(v=>v.id===it.v)||(r.vs||[])[0];
  const sc=(it.sd||[]).reduce((a,s)=>a+sdCost(s,n),0),tot=plItemCost(it);
  const cost=`<p class="pn-cost">${sc>0?`Ruoka ${eur1(tot-sc)} + lisukkeet ${eur1(sc)} = <b>${eur1(tot)}</b>`:`Hinta <b>${eur1(tot)}</b>`}</p>`;
  const title=only==="sd"?"Lisukkeet":only==="tw"?"Muunnelmat":esc(r.name)+(ver&&(r.vs||[]).length>1?" – "+esc(ver.n):"");
  const sub=only?`<p class="note">${esc(r.name)}</p>`:`<p class="note">${fmtN(n)} annosta · ${fmtDur(workOf(r)||r.min||0)} · <button type="button" class="lk" data-pe="open" data-k="${esc(r.id)}">Avaa resepti</button></p>`;
  const body=only?sec[only]||"":[sec.v,sec.sd,sec.tw,sec.n].filter(Boolean).join("");
  $("pkbody").innerHTML=`<button type="button" class="dx" data-pp-x="1" aria-label="Sulje">${ico("x")}</button><h2 class="dh">${title}</h2>${sub}${cost}
    ${body}
    <div class="actions"><button type="button" class="go" data-pp-x="1" style="width:100%">Valmis</button></div>`;
}
/* tyyppivalinta: millaista ruokaa vaihto hakee */
/* millainen ruoka: pääryhmä (yksi) ja lisärajaukset; muokkaa ruokaa tai lisää uusi */
function renderTypePl(){
  const add=!!planAdd,it=add?planAdd:state.pl.items[planEdit.i];if(!it)return;
  const mt=PL.mainTag(it.tg)||"a";
  const opt=(a,k,n,d,on,radio)=>`<button type="button" class="pn-opt" data-pe="${a}" data-k="${k}" role="${radio?"radio":"checkbox"}" aria-checked="${on}"><span class="pn-ok${radio?" r":""}">${on?ico("check"):""}</span><span><b>${esc(n)}</b><small>${esc(d)}</small></span></button>`;
  $("pkbody").innerHTML=`<button type="button" class="dx" data-pp-x="1" aria-label="Sulje">${ico("x")}</button><h2 class="dh">${add?"Lisää ruoka":"Millainen ruoka?"}</h2>
    <h3 class="pn-h">Pääryhmä</h3>
    <div class="pn-opts" role="radiogroup" aria-label="Pääryhmä">${PL.MAIN_TAGS.map(([k,n,d])=>opt("tm",k,n,d,mt===k,true)).join("")}</div>
    <h3 class="pn-h" id="pt-ex">Rajaukset <small class="muted">valitse yksi tai useampi</small></h3>
    <div class="pn-opts">${PL.EXTRA_TAGS.map(([k,n,d])=>opt("tg",k,n,d,it.tg.includes(k),false)).join("")}</div>
    ${add?"":`<p class="note">Vaihtonappi hakee tällaisia ruokia. Jos nykyinen ruoka ei sovi valintaan, se vaihtuu heti.</p>`}
    <div class="actions">${add?`<button type="button" class="go" data-pe="addok" data-k="1" style="width:100%">${ico("plus")}<span>Lisää suunnitelmaan</span></button>`:`<button type="button" class="go" data-pp-x="1" style="width:100%">Valmis</button>`}</div>`;
}
function planAddOpen(){
  const pl=state.pl;planAdd={tg:PL.defaultTags(pl.items.length,pl.items.length+1)};planEdit={i:-1,type:true};planPick=null;planChk=null;
  renderTypePl();$("pkdlg").showModal();
}
function planTypeOpen(i,to){planAdd=null;planEdit={i,allSd:false,type:true};planPick=null;planChk=null;renderTypePl();$("pkdlg").showModal();
  const h=to==="ex"&&$("pt-ex");if(h)h.scrollIntoView({block:"start"});}
function planEditOpen(i,to){planAdd=null;planEdit={i,allSd:false,only:to==="sd"||to==="tw"?to:""};planPick=null;planChk=null;renderEditPl();$("pkdlg").showModal();$("pkbody").scrollTop=0;}
const vkOn=k=>PL_EXTRAS&&state.vk.includes(k)&&!state.pl.vo.includes(k);
/* muunnelma sopii valittuun siruun */
const twFits=(m,tg)=>(tg.includes("k")&&/kevye|kevyt/i.test(m.n+" "+(m.d||"")))||(tg.includes("v")&&(m.m==="v"||/kasvis/i.test(m.n)))||(tg.includes("e")&&/edullis|halvem/i.test(m.n+" "+(m.d||"")));
/* ---------- valitse itse ---------- */
function planPickOpen(i){planAdd=null;planPick={i,q:""};planEdit=null;planChk=null;renderPick();if(!$("pkdlg").open)$("pkdlg").showModal();}
function renderPick(){
  if(!planPick)return;
  const pl=state.pl,it=pl.items[planPick.i],q=fold(planPick.q.trim());
  const list=q?plCands().filter(c=>fzBest(q,[c.name])>=0):PL.ranked(plCands(),it.tg,plOthers(planPick.i));
  const rows=list.slice(0,40).map(c=>`<li><button type="button" class="pn-pr" data-pp="${esc(c.id)}"><span>${esc(c.name)}</span><small>${eur1(c.cost*(servOf(byId(c.id))||4))} · ${fmtDur(c.work)}</small></button></li>`).join("");
  $("pkbody").innerHTML=`<button type="button" class="dx" data-pp-x="1" aria-label="Sulje">${ico("x")}</button><h2 class="dh">Ruoka ${planPick.i+1}</h2>
    <input id="ppq" type="search" placeholder="Hae ruokaa" autocomplete="off" value="${esc(planPick.q)}" aria-label="Hae ruokaa">
    <p class="note">${q?"Hakutulokset kaikista ruoista":it.tg.length?"Valintoihin sopivat: "+it.tg.map(t=>PL.TAG_N[t]).join(", "):"Sopivimmat ensin"}</p><ul class="pn-pl">${rows||`<li class="note">Ei osumia.</li>`}</ul>`;
}
/* ---------- kaapin tarkistus ennen ostoslistaa ---------- */
function plShopItems(){
  const pl=state.pl,out=new Map();
  const add=(id,v,t,n)=>{if(!id||!(n>0)||!byId(id))return;const k=id+"|"+(v||"")+"|"+(t||[]).join(",");const e=out.get(k)||{id,v:v||"",t:t||[],n:0};e.n+=n;out.set(k,e);};
  for(const it of pl.items){if(!it.id)continue;const n=plN(it);add(it.id,it.v,it.t||[],n);for(const s of it.sd||[]){const{id,v}=sdParse(s);add(id,v,[],n);}}
  if(PL_EXTRAS){for(const[id,n]of Object.entries(pl.sn))add(id,"",[],n);
    for(const id of pl.bk){const r=byId(id);if(r)add(id,"",[],servOf(r));}}
  return[...out.values()].map(e=>({...e,n:Math.round(e.n*2)/2}));
}
function planChkOpen(){
  const items=plShopItems();
  const xs=[...new Set([...(PL_EXTRAS?state.vk.filter(k=>!state.pl.vo.includes(k)):[]),...state.pl.items.flatMap(it=>it.px||[])])];
  if(!items.length&&!xs.length){flashToast("Suunnitelmassa ei ole ruokia.");return;}
  const rows=shopping([],items.map(e=>({r:byId(e.id),lines:ingFor(byId(e.id),e.n,e.v,e.t)})));
  const off=new Set(rows.filter(e=>pantryHit(e.key)).map(e=>e.key));
  planChk={items,xs,rows,off};planAdd=null;planEdit=null;planPick=null;renderChk();$("pkdlg").showModal();
}
function renderChk(){
  if(!planChk)return;
  const{rows,off,xs}=planChk;
  const row=e=>{const o=off.has(e.key);return`<li><button type="button" class="ar${o?" off":""}" data-pc="${esc(e.key)}" aria-pressed="${!o}"><span class="ack">${ico("check")}</span><span class="an">${esc(e.name)}${o?"<small>on jo kaapissa</small>":""}</span><span class="aq">${esc(qtyText(e))}</span></button></li>`;};
  const cnt=rows.length-off.size+xs.length;
  $("pkbody").innerHTML=`<button type="button" class="dx" data-pp-x="1" aria-label="Sulje">${ico("x")}</button><h2 class="dh">Tarkista kaappi</h2>
    <p class="note">Napauta pois ainekset, jotka löytyvät jo kotoa. Tavalliset kaappitavarat on valmiiksi rastitettu pois.</p>
    <ul class="al">${rows.map(row).join("")}</ul>
    ${xs.length?`<h4 class="ag">Vakiot ja tuotteet</h4><p class="note">${xs.map(k=>esc(capF(k))).join(", ")}</p>`:""}
    <div class="actions"><button type="button" class="go" data-pc-ok="1" style="width:100%">Lisää ostoslistalle (${cnt})</button></div>`;
}
function planShop(){
  if(!planChk)return;
  const pl=state.pl,{items,xs,off}=planChk;
  const l=newList();
  const d=new Date();l.name=clip(`Suunnitelma ${d.getDate()}.${d.getMonth()+1}.`,40);
  l.pl=items;
  l.x=xs.map(k=>({k,q:""}));
  l.have=[...off];
  pl.vo=[];planChk=null;
  $("pkdlg").close();
  mutate();
  flashToast(`<span>Lisätty ostoslistalle <b>${esc(l.name)}</b></span>`);
  showTab("cart");
}
$("pkbody").addEventListener("input",e=>{if(e.target.id==="ppq"&&planPick){planPick.q=e.target.value;const pos=e.target.selectionStart;renderPick();const i=$("ppq");i.focus();try{i.setSelectionRange(pos,pos);}catch(x){}}});
$("pkbody").addEventListener("click",e=>{
  if(e.target.closest("[data-pp-x]")){$("pkdlg").close();return;}
  const pl=state.pl;
  /* kaapin tarkistus */
  const pc=e.target.closest("[data-pc]");
  if(pc&&planChk){const k=pc.dataset.pc;if(planChk.off.has(k))planChk.off.delete(k);else planChk.off.add(k);return renderChk();}
  if(e.target.closest("[data-pc-ok]"))return planShop();
  /* valitse itse */
  const b=e.target.closest("[data-pp]");
  if(b&&planPick){
    const it=pl.items[planPick.i],c=plCands().find(x=>x.id===b.dataset.pp);
    if(it&&c){it.id=c.id;it.v=PL.versionFor(c,it.tg);plDefaults(it);}
    const i=planPick.i;mutate();renderPlan();planEditOpen(i);return;
  }
  /* muokkausikkuna */
  const x=e.target.closest("[data-pe]");if(!x||!planEdit)return;
  if(planAdd){const a=x.dataset.pe,k=x.dataset.k,t=planAdd.tg;
    if(a==="tm")planAdd.tg=[k,...t.filter(z=>z!=="a"&&z!=="w")];
    else if(a==="tg")planAdd.tg=t.includes(k)?t.filter(z=>z!==k):[...t,k];
    else if(a==="addok"){if(pl.items.length>=10)return;pl.items.push({tg:planAdd.tg,id:"",v:""});pl.n=pl.items.length;plFill();planNew=pl.items.length-1;planAdd=null;$("pkdlg").close();
      mutate();renderPlan();const li=$("planBody").querySelectorAll(".pn-item")[planNew];if(li)li.scrollIntoView({block:"nearest",behavior:"smooth"});setTimeout(()=>{planNew=-1;},50);return;}
    return renderTypePl();}
  const it=pl.items[planEdit.i];if(!it)return;
  const a=x.dataset.pe,k=x.dataset.k,r=byId(it.id);
  if(a==="open"){$("pkdlg").close();openDlg(k);return;}
  if(a==="pick")return planPickOpen(planEdit.i);
  if(a==="rm"){$("pkdlg").close();return planRemove(planEdit.i);}
  if(a==="swap")planSwap(planEdit.i,true);
  else if(a==="allsd")planEdit.allSd=!planEdit.allSd;
  else if(a==="tg"||a==="tm"){it.tg=a==="tm"?[k,...it.tg.filter(t=>t!=="a"&&t!=="w")]:it.tg.includes(k)?it.tg.filter(t=>t!==k):[...it.tg,k];
    delete it.lk;const cur=plCands().find(c=>c.id===it.id);if(!cur||!PL.matches(cur,it.tg))planSwap(planEdit.i,true);else{const v=PL.versionFor(cur,it.tg);if(v)it.v=v;}}
  else if(a==="v")it.v=r&&r.vs[0]&&r.vs[0].id===k?"":k;
  else if(a==="t"){const tw=(r.tw||[]).find(m=>m.id===k);if(!tw)return;const cur=it.t||[];it.t=cur.includes(k)?cur.filter(z=>z!==k):[...cur.filter(z=>{const o=(r.tw||[]).find(m=>m.id===z);return!(o&&((tw.g&&o.g===tw.g)||(o.rm||[]).some(q=>(tw.rm||[]).includes(q))));}),k];}
  else if(a==="sd"){const cur=it.sd||[],id=sdParse(k).id;it.sd=cur.includes(k)?cur.filter(z=>z!==k):[...cur.filter(z=>sdParse(z).id!==id),k];}
  else if(a==="sdv"){const id=sdParse(k).id,x=byId(id),nv=x&&x.vs[0].id===sdParse(k).v?id:k;it.sd=(it.sd||[]).map(z=>sdParse(z).id===id?nv:z);}
  else if(a==="pxv"){pl.vo=[...pl.vo,k];it.px=(it.px||[]).filter(z=>z!==k);}
  else if(a==="px"){const cur=it.px||[];it.px=cur.includes(k)?cur.filter(z=>z!==k):[...cur,k];}
  else if(a==="n"){const v=Math.max(1,Math.min(20,plN(it)+(+k)));it.n=0;it.n=v===autoN(it)?0:v;}
  mutate();renderPlan();if(planEdit.type)renderTypePl();else renderEditPl();
});
$("pkdlg").addEventListener("close",()=>{if($("pkdlg").open)return;planPick=null;planEdit=null;planChk=null;planAdd=null;});
const vkOk=k=>/^[a-zäöå0-9][a-zäöå0-9 \-.,()%]{0,39}$/i.test(k);
$("planBody").addEventListener("click",e=>{
  const b=e.target.closest("[data-pa]");
  if(!b){const li=e.target.closest(".pn-item.pn-click");if(li&&!e.target.closest("button,a,input"))planEditOpen(+li.dataset.i);return;}
  const a=b.dataset.pa,pl=state.pl,i=+b.dataset.i;
  if(a==="edit")return planEditOpen(i,b.dataset.to);
  if(a==="type")return planTypeOpen(i,b.dataset.to);
  if(a==="rm")return planRemove(i);
  if(a==="pick")return planPickOpen(i);
  if(a==="shop")return planChkOpen();
  if(a==="xo"){planOpen[b.dataset.k]=!planOpen[b.dataset.k];return renderPlan();}
  if(a==="add"){if(pl.items.length>=10)return;return planAddOpen();}
  if(a==="cnt"){planCount=Math.max(1,Math.min(10,planCount+(+b.dataset.d)));return renderPlan();}
  if(a==="four"){pl.items=[];pl.n=planCount;plFill();}
  else if(a==="sv")pl.sv=Math.max(2,Math.min(16,pl.sv+(+b.dataset.d)));
  else if(a==="swap")planSwap(i,true);
  else if(a==="sd"){const it=pl.items[i];if(!it)return;const s=b.dataset.s,cur=it.sd||[],id=sdParse(s).id;it.sd=cur.includes(s)?cur.filter(z=>z!==s):[...cur.filter(z=>sdParse(z).id!==id),s];}
  else if(a==="px"){const it=pl.items[i];if(!it)return;it.px=(it.px||[]).filter(z=>z!==b.dataset.k);}
  else if(a==="pxall"){for(const it of pl.items)it.px=(it.px||[]).filter(z=>z!==b.dataset.k);}
  else if(a==="sn"){const id=b.dataset.id,v=Math.max(0,(pl.sn[id]||0)+(+b.dataset.d));if(v)pl.sn[id]=v;else delete pl.sn[id];}
  else if(a==="bk"){const id=b.dataset.id;pl.bk=pl.bk.includes(id)?pl.bk.filter(x=>x!==id):[...pl.bk,id];}
  else if(a==="vo"){const k=b.dataset.k;pl.vo=pl.vo.includes(k)?pl.vo.filter(x=>x!==k):[...pl.vo,k];}
  else if(a==="vkq"||a==="vkadd"){const k=(a==="vkq"?b.dataset.k:($("vkin").value||"")).trim().toLowerCase();if(!k||!vkOk(k))return;if(!state.vk.includes(k))state.vk.push(k);}
  else if(a==="vkrm"){const k=b.dataset.k;state.vk=state.vk.filter(x=>x!==k);pl.vo=pl.vo.filter(x=>x!==k);}
  mutate();renderPlan();
});
$("planBody").addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.id==="vkin"){e.preventDefault();const b=$("planBody").querySelector('[data-pa="vkadd"]');if(b)b.click();}});
$("planBody").addEventListener("change",e=>{
  const t=e.target;
  if(t.id==="pba"){const v=parseFloat(String(t.value).replace(",","."));state.pl.ba=v>0&&v<=10000?Math.round(v*100)/100:0;mutate();renderPlan();}
});

if(import.meta.env.DEV)window.__app={PL,plCands,autoN,plDefaults,ingFor,plCostPer,R,LIB,parseIng,catFind,findPrice,nameSkip,isSkip,selR,applySel,recipeCost,recipeNut,nutPer,byId,get state(){return state;}};

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
