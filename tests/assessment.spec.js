const {test,expect}=require("@playwright/test");
test("dictionary search and placement completion",async({page})=>{
 await page.goto("/");await page.locator('[data-screen="cards"]').click();await page.locator("#dictionarySearch").fill("hola");await expect(page.locator("#dictionaryList")).toContainText(/hola/i);await page.locator("#dictionarySearch").fill("zzzz-no-match");await expect(page.locator("#dictionaryList")).toContainText("Aucune fiche");await page.locator("#dictionarySearch").fill("bonjour");await expect(page.locator("#dictionaryList")).toContainText(/hola/i);
 await page.locator('[data-screen="progress"]').click();await page.getByRole("button",{name:"Passer le test de niveau"}).click();
 expect(await page.evaluate(()=>quiz.length)).toBe(16);
 for(let i=0;i<16;i++){const q=await page.evaluate(()=>quiz[quizIndex]);if(q.kind==="translation"){await page.locator("#exerciseText").fill(q.options[q.answer]);await page.evaluate(()=>submitExercise("quiz"));}else await page.locator("#quizArea .answer").nth(q.answer).click();await page.locator("#nextQuestion").click();}
 await expect(page.locator("#quizArea")).toContainText("Évaluation terminée");await expect(page.locator("#quizArea")).toContainText("A2 — repères encourageants");await page.reload();await page.locator('[data-screen="progress"]').click();await expect(page.locator("#placementPanel")).toContainText("A2 — repères encourageants");
});
