/* varmuuskopio */
import "./clicks.js";
import {$,ico,esc} from "./core.js";
import {todayIso} from "./catalog.js";
import {state,setState,cleanState,mutate} from "./state.js";
import {renderIdeas} from "./search.js";
import {applyOtx} from "./cart.js";
import {refreshCart} from "./cart-view.js";
import {pmOpen,openId,setOpenId} from "./info.js";

/* ---------- varmuuskopio ---------- */
export let dlApi=null;
export function setDlApi(v){return dlApi=v;}
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
    setState(bkParsed);applyOtx();bkParsed=null;bkMode="";bkMsg="Varmuuskopio palautettu.";
    pmOpen.clear();setOpenId(null);mutate();renderIdeas();refreshCart();bkRender();
  }
});
bkRender();
