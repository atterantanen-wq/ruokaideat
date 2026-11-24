/* yhteiset klikkaukset */
import {ned,swapNew,renderNewHost,beginEdit,editAct,copyRecipe} from "./editor.js";
import {$,clip} from "./core.js";
import {setPv,ingOpen,stepOpen,nutOpen,setIngOpen,setStepOpen,setNutOpen,setSel} from "./catalog.js";
import {state,mutate} from "./state.js";
import {byId,useSideVer,sdOpen,sdOwn,sdFor,setSdOwn,setSdFor,renderSd,toggleSide,togglePSide,addOwnSide,toggleFav} from "./ideas.js";
import {twExcl,clearFilters,renderIdeas} from "./search.js";
import {pruneChecked,newList,openMenu,showRmToast,hideToast,moveRecipe,openChooser,viewId,renaming,delList,setViewId,setRenaming,setDelList,vList,toggleCart,plRm} from "./cart.js";
import {refreshCart,renderCart,copyList} from "./cart-view.js";
import {pf,setPf,pmOpen,pfAct,dlg,openId,edit,renderDlg,openDlg} from "./info.js";
import {showTab} from "./tabs.js";
import {openReg} from "./registry.js";
import {openCook} from "./cook.js";

/* ---------- yhteiset klikkaukset ---------- */
document.addEventListener("click",e=>{
  const t=e.target;
  let x;
  if((x=t.closest("[data-pm]"))){
    const k=x.dataset.pm;
    if(pmOpen.has(k)){pmOpen.delete(k);if(pf&&pf.key===k)setPf(null);}else pmOpen.add(k);
    renderDlg();
    const nb=[...dlg.querySelectorAll("[data-pm]")].find(b=>b.dataset.pm===k);if(nb)nb.focus();
    return;
  }
  if((x=t.closest("[data-ver]"))){const id=openId,v=x.dataset.ver;setSel(id,n=>{n.v=v;});renderDlg();renderIdeas();refreshCart();const nb=dlg.querySelector('[data-ver="'+CSS.escape(v)+'"]');if(nb)nb.focus({preventScroll:true});return;}
  if((x=t.closest("[data-tw]"))){const id=openId,k=x.dataset.tw;setSel(id,n=>{const i=n.t.indexOf(k);if(i>=0)n.t.splice(i,1);else{n.t=twExcl(byId(id),n.t,k);n.t.push(k);}});renderDlg();renderIdeas();refreshCart();const nb=dlg.querySelector('[data-tw="'+CSS.escape(k)+'"]');if(nb)nb.focus({preventScroll:true});return;}
  if((x=t.closest("[data-oside]"))){if(x.dataset.over&&!state.lists.some(l=>l.cart.includes(x.dataset.oside)))useSideVer(x.dataset.oside,x.dataset.over);openDlg(x.dataset.oside);return;}
  if((x=t.closest("[data-acc]"))){const k=x.dataset.acc;if(k==="ing")setIngOpen(!ingOpen);else if(k==="steps")setStepOpen(!stepOpen);else setNutOpen(!nutOpen);renderDlg();const nb=dlg.querySelector('[data-acc="'+k+'"]');if(nb)nb.focus();return;}
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
      if(l&&+x.dataset.i>=0&&!l.cart.includes(rid))l.cart.splice(Math.min(+x.dataset.i||0,l.cart.length),0,rid);
      if(l&&plRm.lid===l.id&&plRm.rid===rid&&plRm.gone.length){l.pl=l.pl||[];for(const[j,e]of plRm.gone)l.pl.splice(Math.min(j,l.pl.length),0,e);plRm.gone=[];}
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
    if(a==="open"){setViewId(x.dataset.lid);setRenaming(false);setDelList(false);renderCart();window.scrollTo(0,0);return;}
    if(a==="back"){setViewId(null);setRenaming(false);setDelList(false);renderCart();window.scrollTo(0,0);return;}
    if(a==="create"){newList();mutate();refreshCart();return;}
    if(a==="rename"){setRenaming(!renaming);renderCart();const f=$("lname");if(f){f.focus();f.select();}return;}
    if(a==="rensave"){
      const l=vList(),v=clip($("lname").value.trim(),40);
      if(l&&v&&!state.lists.some(q=>q!==l&&q.name===v))l.name=v;
      setRenaming(false);mutate();renderCart();return;
    }
    if(a==="del"){
      if(!delList){setDelList(true);renderCart();return;}
      const l=vList();setDelList(false);setRenaming(false);setViewId(null);
      if(l){state.lists=state.lists.filter(q=>q!==l);if(state.act===l.id)state.act=state.lists.length?state.lists[state.lists.length-1].id:"";}
      mutate();refreshCart();return;
    }
    return;
  }
  if((x=t.closest("[data-side]"))){toggleSide(x.dataset.side,x.dataset.dish,x.dataset.sver);return;}
  if((x=t.closest("[data-sdmore]"))){if(sdOpen.has("all"))sdOpen.delete("all");else sdOpen.add("all");renderSd();return;}
  if((x=t.closest("[data-pside]"))){togglePSide(x.dataset.pside,x.dataset.dish);return;}
  if((x=t.closest("[data-sdown]"))){setSdOwn(!sdOwn);renderSd();const inp=document.querySelector(dlg.open?"#sdslot .sdrow input":".sdrow.cs input");if(inp)inp.focus();return;}
  if((x=t.closest("[data-sdadd]"))){addOwnSide(x);return;}
  if((x=t.closest("[data-sdclose]"))){setSdFor(null);setSdOwn(false);renderSd();return;}
  if((x=t.closest("[data-sdno]"))){
    const id=x.dataset.dish||openId;if(!id)return;
    state.nos=state.nos.filter(i=>i!==id);
    if(x.dataset.sdno==="1"){state.nos.push(id);if(sdFor===id)setSdFor(null);}
    mutate();renderSd();if(dlg.open&&openId===id)renderDlg();return;
  }
  if(t.closest(".sdrow"))return;
  if((x=t.closest("[data-clrf]"))){clearFilters();return;}
  if((x=t.closest("[data-cook]"))){openCook(x.dataset.cook);return;}
  if((x=t.closest("[data-copy]"))){copyRecipe(x.dataset.copy);return;}
  if((x=t.closest("[data-fav]"))){toggleFav(x.dataset.fav);return;}
  if((x=t.closest("[data-rmfl]"))){
    const rid=x.dataset.rmfl,l=state.lists.find(q=>q.id===x.dataset.lid),i=l?l.cart.indexOf(rid):-1;
    if(!l)return;
    /* suunnitelmasta tulleet rivit (ruoka tai lisuke) poistetaan kaikki kerralla */
    const gone=(l.pl||[]).map((e,j)=>[j,e]).filter(([,e])=>e.id===rid);
    if(i<0&&!gone.length)return;
    if(i>=0)l.cart.splice(i,1);
    if(gone.length){l.pl=l.pl.filter(e=>e.id!==rid);Object.assign(plRm,{lid:l.id,rid,gone});}else plRm.gone=[];
    pruneChecked();mutate();dlg.close();refreshCart();showRmToast(l,rid,i);return;
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
