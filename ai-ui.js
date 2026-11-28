(()=>{"use strict";
const $=id=>document.getElementById(id);
const endpoint="https://marabou-languages-ai.marabou.workers.dev";
const storageKey="marabouAiAccessToken";
let token="",busy=false,generation=0;
try{const saved=localStorage.getItem(storageKey);if(/^[a-f0-9]{64}$/i.test(saved||""))token=saved;}catch{}
function remember(value){try{if(value)localStorage.setItem(storageKey,value);else localStorage.removeItem(storageKey);return true;}catch{return false;}}
const status=t=>{$("aiStatus").textContent=t};
function controls(){ $("aiSend").disabled=!token||busy;$("aiConnect").hidden=!!token;$("aiToken").hidden=!!token;$("aiTokenLabel").hidden=!!token;$("aiDisconnect").hidden=!token; }
function bubble(role,value){const el=document.createElement("div");el.className="immersion-bubble"+(role==="Tú"?" you":"");const title=document.createElement("small");title.textContent=role;const p=document.createElement("p");p.textContent=value;el.append(title,p);$("aiReplies").append(el);while($("aiReplies").children.length>20)$("aiReplies").firstElementChild.remove();}
$("aiConnect").addEventListener("click",()=>{const value=$("aiToken").value.trim();if(!/^[a-f0-9]{64}$/i.test(value)){status("Saisis ton jeton personnel de 64 caractères hexadécimaux.");return;}token=value;const saved=remember(value);$("aiToken").value="";controls();status(saved?"Accès mémorisé sur cet appareil.":"Accès actif pour cette session uniquement : stockage indisponible.");});
$("aiDisconnect").addEventListener("click",()=>{generation++;token="";const removed=remember("");busy=false;$("aiToken").value="";$("aiMessage").value="";$("aiReplies").replaceChildren();controls();status(removed?"Accès effacé de cet appareil.":"Session fermée, mais effacement du stockage impossible.");});
$("aiClear").addEventListener("click",()=>{generation++;busy=false;$("aiReplies").replaceChildren();controls();status("Échanges effacés.");});
$("aiForm").addEventListener("submit",async e=>{e.preventDefault();if(!token||busy)return;const message=$("aiMessage").value.trim();if(!message)return;if(navigator.onLine===false){status("Hors ligne : les cours restent disponibles.");return;}busy=true;const current=++generation;controls();status("Le professeur prépare sa réponse…");try{const result=await MarabouAI.request({endpoint,token,task:$("aiTask").value,level:$("aiLevel").value,message});if(current!==generation)return;if(result.ok){bubble("Tú",message);bubble("Profesor IA",result.text);if($("aiMessage").value.trim()===message)$("aiMessage").value="";status("Réponse reçue.");}else status(({quota:"Limite atteinte. Réessaie plus tard.",auth:"Jeton refusé. Déconnecte-toi puis vérifie ton jeton.",unavailable:"Service indisponible. Réessaie plus tard."})[result.reason]||"Service indisponible.");}catch{if(current===generation)status("Service indisponible.");}finally{if(current===generation){busy=false;controls();}}});
controls();if(token)status("Accès mémorisé sur cet appareil.");
})();