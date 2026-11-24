/* hintatiedot (S-kaupat.fi) ainesavaimille */
import "./core.js";

/* ---------- hintatiedot (S-kaupat.fi, 18.11.2026) ---------- */
export const PR={};
export function P(k,p,per,src,o,w,u,d){PR[k]=Object.assign({p,per,src,w:w||"",d:d||"2026-11-18"},o||{});if(u)PU[k]=u;}
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
export const PU={
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
export const P2=(k,p,per,src,o,w,u)=>P(k,p,per,src,o,w,u,"2026-11-19");
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
export const PALIAS={"kanankoipi":"kanankoivet","kananmunat":"kananmuna","herkkusieni":"herkkusienet","kirsikkatomaatti":"kirsikkatomaatit","kidneypapu":"kidneypavut","kikherne":"kikherneet","porsaankyljys":"porsaankyljykset","kasvisliemi":"kanaliemi","herne":"herneet","punasipulit":"punasipuli","sipulit":"sipuli","porkkanat":"porkkana","perunat":"peruna","nauta":"naudanliha","sika":"porsaanliha","lasagnelevy":"lasagnelevyt","linssit":"punaiset linssit","valkosipuli":"valkosipulinkynsi","kookosmaito":"kookosmaito","rahka":"maitorahka","maustamaton tofu":"tofu","broilerinfilee":"kananrintafilee","sekajauheliha":"sika-nauta jauheliha","paistijauheliha":"jauheliha","kaurajuoma":"kauramaito","omenat":"omena","banaanit":"banaani","tomaatit":"tomaatti","kurkut":"kurkku"};
export const PSKIP=new Set(["suola","pippuri","mustapippuri","maustepippuri","paprikajauhe","chilijauhe","kumina","oregano","timjami","yrttimauste","tacomauste","currytahna","laakerinlehti","inkivääri","siirappi","sinappi","kaprikset","tartarkastike","vesi","sokeri","persilja jauhe","curry","meirami","muskotti","kardemumma","neilikka","kurkuma","korianterinsiemen","rosmariini","sitruunapippuri","italialainen mausteseos","chiliflakes","kaneli","juustokumina","garam masala","vaniljasokeri","merisuola","sriracha","kahvi","liivate","nonparellit","valkopippuri"]);
export const PKEYS=Object.keys(PR).sort((a,b)=>b.length-a.length);
export const wordHit=(name,k)=>name===k||name.startsWith(k+" ")||name.endsWith(" "+k)||name.includes(" "+k+" ");
