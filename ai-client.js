/* Optional AI transport. No automatic requests or persisted credentials. */
globalThis.MarabouAI=Object.freeze({
 async request({endpoint,token,task,level="A2",message},fetcher=globalThis.fetch){
  const url=new URL(endpoint);
  if(url.protocol!=="https:"||url.username||url.password||url.search||url.hash)throw Error("Endpoint HTTPS requis");
  if(!token||!["tutor","correction"].includes(task)||!["A1","A2"].includes(level)||typeof message!=="string"||!message.trim()||message.length>1500)throw Error("Paramètres IA invalides");
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
  try{
   const r=await fetcher(url.href,{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+token},body:JSON.stringify({task,level,message}),signal:controller.signal,credentials:"omit",cache:"no-store",redirect:"error"});
   if(!r.ok)return {ok:false,reason:r.status===429?"quota":r.status===401?"auth":"unavailable"};
   const data=await r.json();return typeof data.text==="string"&&data.text.trim()?{ok:true,text:data.text}:{ok:false,reason:"unavailable"};
  }catch{return {ok:false,reason:"unavailable"}}finally{clearTimeout(timer)}
 }
});
