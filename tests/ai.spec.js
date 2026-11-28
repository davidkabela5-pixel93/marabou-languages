const {test,expect}=require("@playwright/test");
test("AI session explicit request, safe rendering and disconnect",async({page})=>{
 let calls=0;
 const cors={"access-control-allow-origin":"http://127.0.0.1:8000","access-control-allow-methods":"POST, OPTIONS","access-control-allow-headers":"authorization, content-type"};
 await page.route("https://marabou-languages-ai.marabou.workers.dev/**",async route=>{if(route.request().method()==="OPTIONS"){await route.fulfill({status:204,headers:cors});return;}calls++;expect(route.request().headers().authorization).toBe("Bearer "+"a".repeat(64));expect(route.request().postDataJSON().message).toBe("Hola");await route.fulfill({status:200,contentType:"application/json",headers:cors,body:JSON.stringify({text:"<img src=x onerror=alert(1)> Hola"})});});
 await page.goto("/");await page.locator('[data-screen="training"]').click();await page.getByRole("button",{name:"Ouvrir le professeur IA"}).click();
 await expect(page.locator("#aiSend")).toBeDisabled();expect(calls).toBe(0);
 await page.locator("#aiToken").fill("a".repeat(64));await page.locator("#aiConnect").click();await page.locator("#aiMessage").fill("Hola");await page.locator("#aiSend").click();
 await expect(page.locator("#aiReplies")).toContainText("<img src=x onerror=alert(1)> Hola",{timeout:20000});await expect(page.locator("#aiReplies img")).toHaveCount(0);
 await page.reload();await page.locator('[data-screen="training"]').click();await page.getByRole("button",{name:"Ouvrir le professeur IA"}).click();await expect(page.locator("#aiSend")).toBeEnabled();await expect(page.locator("#aiToken")).toBeHidden();await page.locator("#aiDisconnect").click();await expect(page.locator("#aiSend")).toBeDisabled();await expect(page.locator("#aiReplies")).toBeEmpty();await page.reload();await page.locator('[data-screen="training"]').click();await page.getByRole("button",{name:"Ouvrir le professeur IA"}).click();await expect(page.locator("#aiSend")).toBeDisabled();
});
