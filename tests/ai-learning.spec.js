const {test,expect}=require("@playwright/test");
test("AI learning modes and quiz validation",async({page})=>{
 await page.addInitScript(()=>{localStorage.setItem("marabouAiAccessToken","a".repeat(64));const original=window.fetch;window.fetch=async (url,options)=>String(url).startsWith("https://marabou-languages-ai.marabou.workers.dev/")?new Response(JSON.stringify({text:JSON.parse(options.body).message.includes("UN QCM")?JSON.stringify({question:"Hola ?",options:["Bonjour","Merci","Au revoir"],answer:0,explanation:"Salutation."}):"Hola, ¿qué deseas?"}),{status:200}):original(url,options);});
 await page.goto("/");await page.locator('[data-screen="training"]').click();await page.getByRole("button",{name:"Ouvrir le professeur IA"}).click();
 await page.locator("#aiTask").selectOption("quiz");await page.locator("#aiSend").click();await expect(page.locator("#aiExercise")).toContainText("Hola ?");await page.locator("#aiExercise").getByRole("button",{name:"Bonjour",exact:true}).click();await expect(page.locator("#aiExercise")).toContainText("Correct !");
 expect(await page.evaluate(()=>MarabouLearning.parseQuiz('{"question":"x","options":["a","a","b"],"answer":0,"explanation":"x"}'))).toBeNull();
 for(const mode of ["immersion","daily","weekly","correction"]){await page.locator("#aiTask").selectOption(mode);if(mode==="correction")await page.locator("#aiMessage").fill("Yo soy bien");await page.locator("#aiSend").click();await expect(page.locator("#aiReplies")).toContainText("Hola, ¿qué deseas?");}
});
