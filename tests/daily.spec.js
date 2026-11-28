const {test,expect}=require("@playwright/test");
test("daily plan and local mastery",async({page})=>{
 await page.goto("/");
 await expect(page.locator("#dailyAdvice")).toContainText("Mi sesión de hoy");
 const result=await page.evaluate(()=>{const a=Array.from({length:5},(_,i)=>({lesson:"x",correct:true,question:"q"+i}));return {mastered:MarabouDaily.mastery(a).get("x").mastered,plan:MarabouDaily.plan({seconds:600,remainingLessons:true,due:2,weak:true}),done:MarabouDaily.plan({seconds:900,remainingLessons:true,due:2}),mixed:MarabouDaily.select([{key:"a",title:"x",dailyKind:"grammar"},{key:"b",title:"y",dailyKind:"vocabulary"},{key:"c",title:"z",dailyKind:"listening"}],[],[],3).map(q=>q.dailyKind)};});
 expect(result.mastered).toBe(true);expect(result.plan.reduce((n,x)=>n+x.seconds,0)).toBe(300);expect(result.done).toEqual([]);expect(result.mixed).toEqual(["grammar","vocabulary","listening"]);
 await page.evaluate(()=>showScreen("practice","daily"));await expect(page.locator("#quizArea")).toContainText("Question 1/");await page.locator("#quizArea .answer").first().click();await expect(page.locator("#nextQuestion")).toBeVisible();
});
