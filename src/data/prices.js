/* Hintatiedot: S-kaupat.fi (oletusmyymälä). Jokaisella hinnalla on tarkistuspäivä d (VVVV-KK-PP).
 * P(avain, hinta, yksikkö kg|l|kpl, lähde, lisätiedot, huomautus, s-kaupat.fi-polku, päivä)
 * Rivien järjestyksellä on väliä: myöhempi P/PV-rivi korvaa aiemman, P3 lisää vain puuttuvan.
 * Vanhentuneet ja arvioidut hinnat: npm run prices */
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

const PALIAS={"kanankoipi":"kanankoivet","kananmunat":"kananmuna","herkkusieni":"herkkusienet","kirsikkatomaatti":"kirsikkatomaatit","kidneypapu":"kidneypavut","kikherne":"kikherneet","porsaankyljys":"porsaankyljykset","kasvisliemi":"kanaliemi","herne":"herneet","punasipulit":"punasipuli","sipulit":"sipuli","porkkanat":"porkkana","perunat":"peruna","nauta":"naudanliha","sika":"porsaanliha","lasagnelevy":"lasagnelevyt","linssit":"punaiset linssit","valkosipuli":"valkosipulinkynsi","kookosmaito":"kookosmaito","rahka":"maitorahka","maustamaton tofu":"tofu","broilerinfilee":"kananrintafilee","sekajauheliha":"sika-nauta jauheliha","paistijauheliha":"jauheliha","kaurajuoma":"kauramaito","omenat":"omena","banaanit":"banaani","tomaatit":"tomaatti","kurkut":"kurkku"};
const PSKIP=new Set(["suola","pippuri","mustapippuri","maustepippuri","paprikajauhe","chilijauhe","kumina","oregano","timjami","yrttimauste","tacomauste","currytahna","laakerinlehti","inkivääri","siirappi","sinappi","kaprikset","tartarkastike","vesi","sokeri","persilja jauhe","curry","meirami","muskotti","kardemumma","neilikka","kurkuma","korianterinsiemen","rosmariini","sitruunapippuri","italialainen mausteseos","chiliflakes","kaneli","juustokumina","garam masala","vaniljasokeri","merisuola","sriracha","kahvi","liivate","nonparellit","valkopippuri"]);
const wordHit=(name,k)=>name===k||name.startsWith(k+" ")||name.endsWith(" "+k)||name.includes(" "+k+" ");
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
PA("kanansiivet",7,"kg","Broilerin siivet, maustamaton");
PA("maissintähkä",1.5,"kpl","Maissintähkä, esikypsennetty");
PA("meloni",2.5,"kg","Meloni");
PA("etikkapunajuuri",4.2,"kg","Etikkapunajuuret, purkki");
PA("keittojuurekset",3.4,"kg","Keittojuurekset, tuore pussi (porkkana, lanttu, selleri, purjo)");
P3("persilja",50,"kg","Persilja (arvio, ruukku tai nippu)",{},"Arvio, perustuu yrttiruukkuun.","hedelmat-ja-vihannekset/yrtit");
P3("minttu",60,"kg","Minttu (arvio, ruukku)",{},"Arvio, perustuu yrttiruukkuun.","hedelmat-ja-vihannekset/yrtit");
P3("leivinjauhe",13,"kg","Leivinjauhe 100 g (arvio)",{},"Arvio, perustuu tyypilliseen pakkaushintaan.","kuivatuotteet-ja-leivonta/leivontatarvikkeet");
P3("garam masala",37.5,"kg","Meira garam masala 28 g",{},"Vain yksi tuote.","oljyt-maustaminen-ja-kastikkeet/mausteet");
P3("ansjovis",25,"kg","Ansjovis (arvio)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","hillot-ja-sailykkeet/kala-ja-ayriaissailykkeet");
P3("poronliha",36,"kg","Poronkäristys (arvio)",{},"Arvio, tuotetta ei löytynyt verkkokaupasta.","liha-ja-kasviproteiinit");

/* arvioiden tarkistus: S-kaupat.fi 23.11.2026 (oletusmyymälä), mediaani tuoteryhmän vastaavista tuotteista */
const PV=(k,p,src,w,d)=>{const e=PR[k];if(!e)return;const o={};for(const x of Object.keys(e))if(!["p","per","src","w","d"].includes(x))o[x]=e[x];P(k,p,e.per,src,o,w||"",undefined,d||"2026-11-23");};
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

/* arvioiden tarkistus: S-kaupat.fi 24.11.2026 (oletusmyymälä). Ellei tuotetta löytynyt, arvio jää ja tarkistuspäivä päivittyy. */
const D4="2026-11-24",NF="Arvio, tuotetta ei löytynyt verkkokaupasta 24.11.2026.";
PU["turska"]="pakasteet/liha-ja-kalapakasteet/kala-ja-ayriaiset";
PU["poronliha"]="pakasteet/liha-ja-kalapakasteet/liha-ja-riista";
PV("maapähkinä",4.5,"Maapähkinät, suolatut ja suolaamattomat (mediaani 8 tuotteesta, 3,43–12,29 €/kg)","",D4);
PV("turska",19.62,"Turskapala fileestä, pakaste 400 g (1 tuote, 19,62 €/kg)","Vain yksi tuote.",D4);
PV("poronliha",39.73,"Poronkäristys, pakaste 400 g (39,73 €/kg; paistikäristys 51,73 €/kg)","Vain kaksi tuotetta.",D4);
PV("kanan ylereisi",8.9,"Kanan ylereisi (arvio; verkkokaupassa vain luullinen koipireisi 5,65 €/kg)",NF,D4);
PV("silakkafile",11,"Silakkafilee (arvio; verkkokaupassa vain maustettuja silakoita ja sillejä)",NF,D4);
PV("kebabliha",14,"Kebabliha, pakaste (arvio; verkkokaupassa vain 17 kg suurtalouspakkaus 7,59 €/kg)",NF,D4);
PV("raparperi",5,"Raparperi (arvio, kausituote keväällä ja kesällä)",NF,D4);
PV("kantarellit",28,"Kantarelli (arvio, kausituote syksyllä)",NF,D4);
PV("persikka",6.5,"Persikka (arvio, kausituote kesällä)",NF,D4);
PV("mätitahna",14,"Mätitahna (arvio)",NF,D4);

/* juhlariisipuuron lisukkeet: S-kaupat.fi 24.11.2026 (oletusmyymälä) */
P("fariinisokeri",3.36,"kg","Dansukker fariinisokeri 500 g (1,68 €)",{},"","kuivatuotteet-ja-leivonta/sokerit-makeutusaineet-ja-hunaja",D4);
P("miso",17.28,"kg","Misotahna 200–300 g (2 tuotteen keskiarvo, 16,25–18,3 €/kg)",{},"Vaaleaa misoa ei ollut erikseen, hinta on misotahnan.","texmex-ja-maailman-makuja/maailman-makuja",D4);
P("hasselpähkinät",23.75,"kg","Coop hasselpähkinät 200 g (4,75 €)",{},"Vain yksi tuote.","snacksit/pahkinat",D4);
P("karpalot",17.95,"kg","Pakkasmarja karpalo 200 g, pakaste (3,59 €)",{},"Vain yksi tuote.","pakasteet/hedelma-ja-marjapakasteet/marjapakasteet",D4);

/* kaikkien rivien jälkeen: kauppalinkit ja osittaisen nimen haku (pisin avain ensin) koskevat jokaista hintaa */
for(const k of Object.keys(PR)){if(PU[k])PR[k].u=PBASE+PU[k];}
const PKEYS=Object.keys(PR).sort((a,b)=>b.length-a.length);

export {PR,PU,PBASE,PALIAS,PSKIP,PKEYS,wordHit};
