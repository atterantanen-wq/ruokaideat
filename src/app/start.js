/* käynnistys */
import "./cook.js";
import {$} from "./core.js";
import {state,setState,cleanState,lsLoad,applyTheme,setBar,startRemote} from "./state.js";
import {assetsApi,setAssetsApi} from "./ideas.js";
import {buildChips,renderIdeas} from "./search.js";
import {applyOtx,setViewId} from "./cart.js";
import {refreshCart,renderCart} from "./cart-view.js";
import {dlg,edit,renderDlg} from "./info.js";
import {showTab} from "./tabs.js";
import {dlApi,setDlApi} from "./backup.js";

/* ---------- käynnistys ---------- */
if(window.claude&&typeof window.claude.use==="function"){
  Promise.resolve(window.claude.use("downloads")).then(d=>{if(d&&typeof d.save==="function")setDlApi(d);}).catch(()=>{});
}
if(window.claude&&typeof window.claude.use==="function"){
  Promise.resolve(window.claude.use("assets")).then(a=>{
    if(!a||typeof a.upload!=="function")return;
    setAssetsApi(a);if(dlg.open&&edit)renderDlg();
  }).catch(()=>{});
}
setState(cleanState(lsLoad()));applyOtx();applyTheme();setBar("ideas");
if(window.innerWidth<350){document.querySelectorAll(".srt").forEach(e=>e.textContent="Hae ruokaa tai ainesta");$("hkq").placeholder="Hae ruokaa, ainesta";}
buildChips();showTab("ideas");
renderIdeas();refreshCart();
/* jaetun listan linkki (#lista=<id>): avaa Ostoslistat ja kyseinen lista, jos se on tällä laitteella */
function openFromHash(){
  const m=/^#lista(?:=([^&]*))?$/.exec(location.hash||"");if(!m)return;
  showTab("cart");
  let id="";try{id=decodeURIComponent(m[1]||"");}catch(e){}
  if(id&&state.lists.some(l=>l.id===id)){setViewId(id);renderCart();}
  try{history.replaceState(null,"",location.pathname+location.search);}catch(e){}
}
openFromHash();window.addEventListener("hashchange",openFromHash);
startRemote(3);
