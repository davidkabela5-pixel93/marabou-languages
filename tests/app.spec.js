const {test,expect}=require('@playwright/test');
test.beforeEach(async({page})=>{await page.goto('/');});
test('startup and all lessons',async({page})=>{
 const result=await page.evaluate(()=>({count:lessons.length,ids:new Set(lessons.map(l=>l.id)).size,questions:lessons.map(l=>beginnerCourseQuestions(l).map(q=>({options:q.options,answer:q.answer})))}));
 expect(result.count).toBe(84);expect(result.ids).toBe(84);
 for(const qs of result.questions){expect(qs.length).toBeGreaterThanOrEqual(3);for(const q of qs){expect(q.options.length).toBeGreaterThanOrEqual(2);expect(new Set(q.options).size).toBe(q.options.length);expect(q.options[q.answer]).toBeTruthy();}}
 await expect(page.locator('#home')).toHaveClass(/active/);
});
test('all oral dialogues and branching paths',async({page})=>{
 const result=await page.evaluate(()=>{const e=MarabouPedagogy;let paths=0;for(let i=0;i<e.scenarios.length;i++)for(let a=0;a<3;a++)for(let b=0;b<2;b++){const r=e.start(i);e.advance(r,a);e.advance(r,b);e.advance(r,0);if(!r.finished||r.step!==3||r.messages.length!==7)throw Error('Invalid path');paths++;}return {paths,dialogs:oralDialogs().map(d=>oralQuestions(d))};});
 expect(result.paths).toBe(36);expect(result.dialogs).toHaveLength(30);for(const qs of result.dialogs){expect(qs).toHaveLength(3);for(const q of qs)expect(q.options).toContain(q.correct);}
});
test('progress persists after reload and backup recovery',async({page})=>{
 await page.evaluate(()=>{state.done.push(lessons[0].id);save();});await page.reload();expect(await page.evaluate(()=>state.done.includes(lessons[0].id))).toBe(true);
 await page.evaluate(()=>localStorage.setItem('marabouState','invalid'));await page.reload();expect(await page.evaluate(()=>state.done.includes(lessons[0].id))).toBe(true);
});
test('navigation and immersion UI',async({page})=>{
 await page.evaluate(()=>openImmersion());await expect(page.locator('#immersionContent .immersion-tile')).toHaveCount(6);
 await page.locator('#immersionContent .immersion-tile').first().click();for(let i=0;i<3;i++)await page.locator('#immersionContent .immersion-choice').first().click();
 await expect(page.locator('#immersionContent')).toContainText('Conversation terminée');
 await page.evaluate(()=>openOral());await expect(page.locator('#oralContent .immersion-tile')).toHaveCount(30);
 await page.evaluate(()=>showScreen('progress'));await expect(page.locator('#oralStats')).toContainText('Compétences orales');
});
