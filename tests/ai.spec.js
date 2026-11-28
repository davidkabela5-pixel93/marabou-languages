const {test,expect}=require("@playwright/test");
async function open(page){await page.locator('[data-screen="training"]').click();await page.getByRole("button",{name:"Ouvrir le professeur IA"}).click();}
async function connect(page){await page.locator("#aiToken").fill("a".repeat(64));await page.locator("#aiConnect").click();}
test("AI transport and safe rendering",async({page})=>{
 await page.addInitScript(()=>{const original=window.fetch;window.aiRequests=[];window.fetch=async function(url,options){if(String(url).startsWith("https://marabou-languages-ai.marabou.workers.dev/")){window.aiRequests.push({method:options.method,authorization:options.headers.Authorization,body:JSON.parse(options.body)});return new Response(JSON.stringify({text:"<img src=x onerror=alert(1)> Hola"}),{status:200,headers:{"Content-Type":"application/json"}});}return original.call(window,url,options);};});
 await page.goto("/");await open(page);await expect(page.locator("#aiSend")).toBeDisabled();await connect(page);expect(await page.evaluate(()=>window.aiRequests.length)).toBe(0);
 await page.locator("#aiMessage").fill("Hola");await page.locator("#aiSend").click();
 await expect(page.locator("#aiStatus")).toHaveText("Réponse reçue.");
 expect(await page.evaluate(()=>window.aiRequests)).toEqual([{method:"POST",authorization:"Bearer "+"a".repeat(64),body:{task:"tutor",level:"A2",message:"Hola"}}]);
 await expect(page.locator("#aiReplies")).toContainText("<img src=x onerror=alert(1)> Hola");await expect(page.locator("#aiReplies img")).toHaveCount(0);
});
test("AI access persists across reload and is forgotten on demand",async({page})=>{
 await page.goto("/");await open(page);await connect(page);
 await page.reload();await open(page);await expect(page.locator("#aiSend")).toBeEnabled();await expect(page.locator("#aiToken")).toBeHidden();
 await page.locator("#aiDisconnect").click();await expect(page.locator("#aiSend")).toBeDisabled();await expect(page.locator("#aiReplies")).toBeEmpty();
 await page.reload();await open(page);await expect(page.locator("#aiSend")).toBeDisabled();
});
