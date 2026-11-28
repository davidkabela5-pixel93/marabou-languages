const reply=(body,status,origin)=>new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json","Cache-Control":"no-store","Vary":"Origin",...(origin?{"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Headers":"Authorization, Content-Type","Access-Control-Allow-Methods":"POST, OPTIONS"}:{})}});
export default {async fetch(req,env){
 const origin=req.headers.get("Origin");
 if(!env.ALLOWED_ORIGIN||origin!==env.ALLOWED_ORIGIN)return reply({error:"origin"},403);
 const out=(body,status=200)=>reply(body,status,origin);
 if(req.method==="OPTIONS")return out({});
 if(req.method!=="POST")return out({error:"method"},405);
 if(!env.ACCESS_TOKEN||!env.GROQ_API_KEY||!env.AI_LIMITER)return out({error:"configuration"},503);
 if(req.headers.get("Authorization")!=="Bearer "+env.ACCESS_TOKEN)return out({error:"auth"},401);
 if(!(await env.AI_LIMITER.limit({key:"personal"})).success)return out({error:"quota"},429);
 if(!req.headers.get("Content-Type")?.startsWith("application/json"))return out({error:"content"},415);
 let body;try{
 const reader=req.body.getReader(),decoder=new TextDecoder();let size=0,raw="";
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>8192){await reader.cancel();return out({error:"size"},413)}raw+=decoder.decode(value,{stream:true})}
 body=JSON.parse(raw+decoder.decode());
 }catch{return out({error:"json"},400)}
 if(!body||!["tutor","correction"].includes(body.task)||!["A1","A2"].includes(body.level)||typeof body.message!=="string"||!body.message.trim()||body.message.length>1500)return out({error:"input"},400);
 try{
 const r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Authorization":"Bearer "+env.GROQ_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model:"openai/gpt-oss-120b",max_completion_tokens:700,messages:[{role:"system",content:"Tu es un professeur d'espagnol pour francophones. Niveau "+body.level+". Activité : "+body.task+". Réponds brièvement avec des exemples espagnols et explications françaises. Ne demande aucune donnée personnelle."},{role:"user",content:body.message}]}),signal:AbortSignal.timeout(12000)});
 if(!r.ok)return out({error:"upstream"},r.status===429?429:502);
 const data=await r.json(),answer=data.choices?.[0]?.message?.content;
 return typeof answer==="string"&&answer.trim()?out({text:answer}):out({error:"empty"},502);
 }catch{return out({error:"unavailable"},502)}
}};
