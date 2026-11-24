/* välilehdet */
import "./info.js";
import {$} from "./core.js";
import {setBar} from "./state.js";
import {sdFor,setSdFor,renderSd} from "./ideas.js";
import {pillSet,renderIdeas} from "./search.js";
import {hideToast,viewId,setViewId} from "./cart.js";
import {renderCart} from "./cart-view.js";
import {regS,renderReg} from "./registry.js";
import {renderNewHost} from "./editor.js";
import {renderPlan} from "./plan-view.js";

/* ---------- välilehdet ---------- */
export let curTab="ideas",viewsDirty=false;const tabScroll={};
export function setViewsDirty(v){return viewsDirty=v;}
const tabBtns=[...document.querySelectorAll(".tab")];
export function showTab(n,keep){
  pillSet(false);hideToast();setSdFor(null);renderSd();
  if(curTab==="ideas")tabScroll.ideas=window.scrollY;
  curTab=n;
  if(n==="ideas"&&viewsDirty){viewsDirty=false;renderIdeas();}
  setBar(n);
  $("abx").innerHTML="";
  if(n==="cart")setViewId(null);
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
