const {test,expect}=require("@playwright/test");
test("AI session explicit request, safe rendering and disconnect",async({page})=>{
 let calls=0;
 await page.route("https://marabou-languages-ai.marabou.workers.dev/**",async route=>{calls++;expect(route.request().headers().authorization).toBe("Bearer "+"a".repeat(64));expect(route.request().postDataJSON().message).toBe("Hola");await route.fulfill({status:200,contentType:"application/json",headers:{"access-control-allow-origin":"*"},body:JSON.stringify({text:"<img src=x onerror=alert(1)> Hola"})});});
 await page.goto("/");await page.locator('[data-screen="training"]').click();await page.getByRole("button",{name:"Ouvrir le professeur IA"}).click();
 await expect(page.locator("#aiSend")).toBeDisabled();expect(calls).toBe(0);
 await page.locator("#aiToken").fill("a".repeat(64));await page.locator("#aiConnect").click();await page.locator("#aiMessage").fill("Hola");await page.locator("#aiSend").click();
 await expect(page.locator("#aiReplies")).toContainText("<img src=x onerror=alert(1)> Hola");await expect(page.locator("#aiReplies img")).toHaveCount(0);
 await page.locator("#aiDisconnect").click();await expect(page.locator("#aiSend")).toBeDisabled();await expect(page.locator("#aiReplies")).toBeEmpty();
});
