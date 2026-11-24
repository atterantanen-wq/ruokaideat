/* käynnistys */
import "./cook.js";
import {$} from "./core.js";
import {state,setState,cleanState,lsLoad,applyTheme,setBar,startRemote} from "./state.js";
import {assetsApi,setAssetsApi} from "./ideas.js";
import {buildChips,renderIdeas} from "./search.js";
import {applyOtx} from "./cart.js";
import {refreshCart} from "./cart-view.js";
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
startRemote(3);
