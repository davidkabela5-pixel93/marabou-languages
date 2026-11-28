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

test('export and repeated merge preserve both devices',async({page})=>{
 page.on('dialog',d=>d.accept());
 await page.evaluate(()=>{state.done.push('a1');record('Cours','Local',60,100,{lessonId:'a1'});});
 const incoming=await page.evaluate(()=>({...freshState(),done:['a2','d1'],knownCards:['v1'],sessions:[{id:'remote-1',date:dayKey(),type:'Cours',title:'Remote',seconds:120,score:100}],daily:{[dayKey()]:120}}));
 for(let i=0;i<2;i++)await page.locator('#progressImport').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(incoming))});
 await expect.poll(()=>page.evaluate(()=>state.done.includes('a2'))).toBe(true);
 const merged=await page.evaluate(()=>({done:state.done,known:state.knownCards,count:state.sessions.length,seconds:state.daily[dayKey()]}));
 expect(merged.done).toEqual(expect.arrayContaining(['a1','a2','d1']));expect(merged.known).toContain('v1');expect(merged.count).toBe(2);expect(merged.seconds).toBe(180);
 const downloadPromise=page.waitForEvent('download');await page.evaluate(()=>exportProgress());const download=await downloadPromise;const fs=require('node:fs/promises');const exported=JSON.parse(await fs.readFile(await download.path(),'utf8'));expect(exported.done).toEqual(merged.done);expect(exported.schemaVersion).toBe(3);
 await page.reload();expect(await page.evaluate(()=>state.done.includes('a2'))).toBe(true);
});
test('invalid backup does not overwrite progress',async({page})=>{
 page.on('dialog',d=>d.accept());await page.evaluate(()=>{state.done.push('a1');save();});
 await page.locator('#progressImport').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"schemaVersion":3,"done":[]}')});
 await expect.poll(()=>page.locator('#progressImport').inputValue()).toBe('');
 expect(await page.evaluate(()=>state.done)).toEqual(['a1']);
});
test('offline reload preserves progress',async({page,context,browserName})=>{
 test.skip(browserName==='webkit','WebKit offline service worker behavior requires physical iOS validation');
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;state.done.push('a1');save();});
 await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
 await context.setOffline(true);await page.reload();await expect(page.locator('#home')).toHaveClass(/active/);expect(await page.evaluate(()=>state.done.includes('a1'))).toBe(true);await context.setOffline(false);
});
test('existing schema 3 backup survives startup',async({page})=>{
 await page.evaluate(()=>{const old={...freshState(),done:['d1','a1'],knownCards:['v1'],savedAt:1};localStorage.setItem('marabouState',JSON.stringify(old));localStorage.removeItem('marabouStateBackup');});await page.reload();expect(await page.evaluate(()=>state.done)).toEqual(['d1','a1']);expect(await page.evaluate(()=>state.knownCards)).toEqual(['v1']);
});
