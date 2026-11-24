/* kokkausnäkymä */
import "./backup.js";
import {$,ico,esc,parseIng,ingText} from "./core.js";
import {stepsOf,ingOf} from "./catalog.js";
import {byId} from "./ideas.js";

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
export function openCook(id){
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
