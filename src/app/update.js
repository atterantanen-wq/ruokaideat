/* "Uusi versio saatavilla" -ilmoitus. Kotinäytön pikakuvakkeena (iPhonen standalone-tila) sovelluksessa
   ei ole päivityspainiketta, joten tarkistetaan julkaistun version tunnus (version.json, buildin tuottama)
   avattaessa, näkyviin palatessa ja puolen tunnin välein. Toimii vain tuotantobuildissa, jossa
   __BUILD_ID__ on asetettu (ei kehitystilassa eikä yhden tiedoston testiversiossa). */
/* global __BUILD_ID__ */
const BUILD=typeof __BUILD_ID__==="string"?__BUILD_ID__:"";
const EVERY=30*60*1000,MIN_GAP=60*1000;
let last=0,shown="",dismissed="";

function cleanUrl(){
  /* päivityksen jälkeen osoitteessa on ?v=…; siistitään se pois (hash säilyy) */
  try{const u=new URL(location.href);if(u.searchParams.has("v")){u.searchParams.delete("v");history.replaceState(history.state,"",u.pathname+u.search+u.hash);}}catch(e){}
}
function bar(){
  let b=document.getElementById("uptoast");
  if(b)return b;
  b=document.createElement("div");b.className="toast uptoast";b.id="uptoast";b.setAttribute("role","status");b.hidden=true;
  b.innerHTML=`<span>Uusi versio saatavilla</span><button type="button" data-up="later">Myöhemmin</button><button type="button" class="upgo" data-up="go">Päivitä</button>`;
  b.addEventListener("click",e=>{
    const k=e.target.closest("[data-up]");if(!k)return;
    if(k.dataset.up==="go")reload(shown);
    else{dismissed=shown;b.hidden=true;}
  });
  document.body.appendChild(b);return b;
}
function reload(id){
  /* uusi kysely-parametri ohittaa selaimen välimuistissa olevan vanhan index.html:n */
  const u=new URL(location.href);u.searchParams.set("v",id||String(Date.now()));
  location.replace(u.pathname+u.search+u.hash);
}
export async function checkUpdate(force){
  if(!BUILD)return;
  const now=Date.now();if(!force&&now-last<MIN_GAP)return;last=now;
  try{
    const r=await fetch("./version.json?t="+now,{cache:"no-store"});if(!r.ok)return;
    const id=String((await r.json()).id||"");
    if(!id||id===BUILD||id===dismissed)return;
    shown=id;bar().hidden=false;
  }catch(e){}
}
if(BUILD){
  cleanUrl();
  checkUpdate(true);
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")checkUpdate();});
  addEventListener("pageshow",e=>{if(e.persisted)checkUpdate();});
  setInterval(()=>{if(document.visibilityState==="visible")checkUpdate();},EVERY);
}
