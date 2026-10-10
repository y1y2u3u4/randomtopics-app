// Run against a built local, preview, or production page. All external and API
// requests are blocked, and analytics stays in a marked, isolated QA context.
// PLAYWRIGHT_MODULE may point to an existing local Playwright installation.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const origin=process.env.YO_MAMA_BASE_URL||'http://127.0.0.1:4791';
const output=process.env.YO_MAMA_EVIDENCE||'/tmp/yo-mama-browser';
const browser=await chromium.launch({headless:true,chromiumSandbox:true,executablePath:process.env.BROWSER_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const results=[],errors=[];
try {
 for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
  const context=await browser.newContext({viewport});
  await context.route('**/*',route=>{const u=new URL(route.request().url());return u.origin===origin&&!u.pathname.startsWith('/api/')?route.continue():route.abort();});
  await context.addInitScript(()=>{
   sessionStorage.setItem('rt_usage_qa','1');window.__events=[];window.__copyMode='success';window.__copiedText='';
   window.addEventListener('rt:analytics',e=>{if(e.detail.stage==='constructed')window.__events.push(e.detail)});
   Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{if(window.__copyMode==='fail')throw Error('Synthetic blocked clipboard');window.__copiedText=text}}});
   Object.defineProperty(navigator,'share',{configurable:true,value:async()=>{throw new DOMException('Synthetic cancellation','AbortError')}});
   document.execCommand=()=>false;
  });
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  const fresh=()=>page.goto(origin+'/yo-mama-randomizer?usage_qa=1',{waitUntil:'networkidle'});
  const id=()=>page.locator('[data-yo-mama-result]').getAttribute('data-yo-mama-result');
  const sentence=()=>page.locator('[data-yo-mama-result]').innerText();
  const remaining=async()=>Number(await page.locator('[data-yo-mama-remaining]').getAttribute('data-yo-mama-remaining'));
  const count=name=>page.evaluate(n=>window.__events.filter(e=>e.event==='qa_'+n).length,name);
  const test=async(name,fn)=>{await fn();results.push({viewport:viewport.width,name,pass:true})};
  await test('Complete corpus, clean default, metadata and primary action',async()=>{
   await fresh();assert.equal(await page.locator('h1').innerText(),'Yo Mama Randomizer');assert.equal(await page.locator('[data-yo-mama-joke]').count(),72);assert.equal(await page.locator('[data-remix-setup]').count(),24);assert.equal(await page.locator('[data-remix-ending]').count(),24);
   assert.equal(await page.getByRole('button',{name:'Clean jokes',exact:true}).getAttribute('aria-pressed'),'true');assert.equal(await remaining(),71);assert.equal(await count('generate_start'),0);assert.equal(await count('post_generate_actions_view'),0);
   assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://randomtopics.app/yo-mama-randomizer');assert.equal(await page.locator('link[hreflang=es]').count(),0);
   const bottom=await page.getByRole('button',{name:'Another joke',exact:true}).evaluate(el=>el.getBoundingClientRect().bottom);assert.ok(bottom<viewport.height,'Primary tool action must be visible without scrolling');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.screenshot({path:output+'-'+viewport.width+'-clean.png',animations:'disabled'});
  });
  await test('Keyboard generation, successful copy, qualified private analytics',async()=>{
   const old=await id(),button=page.getByRole('button',{name:'Another joke',exact:true});await button.focus();await page.keyboard.press('Enter');assert.notEqual(await id(),old);assert.equal(await button.evaluate(el=>document.activeElement===el),true);
   await page.getByRole('button',{name:'Copy joke',exact:false}).click();assert.equal(await page.evaluate(()=>window.__copiedText),await sentence());assert.equal(await count('post_generate_copy'),1);
   await page.getByRole('group',{name:'Result actions'}).scrollIntoViewIfNeeded();await page.waitForFunction(()=>window.__events.some(e=>e.event==='qa_post_generate_actions_view'&&e.params.exposure_rule==='visible_1s'));
   const events=await page.evaluate(()=>window.__events.filter(e=>e.event!=='qa_page_view'));assert.ok(events.every(e=>e.params.is_test===true&&e.event.startsWith('qa_')));assert.equal(events.find(e=>e.event==='qa_post_generate_copy').params.result_type,'joke');assert.ok(!JSON.stringify(events).includes(await sentence()));assert.ok(!JSON.stringify(events).includes(await id()));
  });
  await test('Clipboard failure has exact selectable text, no false success, and clean retry',async()=>{
   await fresh();await page.evaluate(()=>window.__copyMode='fail');await page.getByRole('button',{name:'Copy joke',exact:false}).click();assert.equal(await page.locator('textarea').inputValue(),await sentence());assert.equal(await count('copy_error'),1);assert.equal(await count('copy_result'),0);assert.equal(await count('post_generate_copy'),0);
   await page.getByRole('button',{name:'Another joke',exact:true}).click();assert.equal(await page.locator('textarea').count(),0);await page.evaluate(()=>window.__copyMode='success');await page.getByRole('button',{name:'Copy joke',exact:false}).click();assert.equal(await count('post_generate_copy'),1);
   await page.getByRole('button',{name:'Share',exact:false}).click();assert.equal(await count('share_result'),0);assert.equal(await count('share_error'),0);
  });
  await test('Theme narrows real pool; exhausted pool does not reset; broadening keeps history',async()=>{
   await fresh();const seen=new Set([await id()]);await page.getByLabel('Joke theme').selectOption('tech');seen.add(await id());assert.equal(await remaining(),10);
   while(await remaining()>0){await page.getByRole('button',{name:'Another joke',exact:true}).click();const next=await id();assert.ok(next.startsWith('ym-tech-')&&!seen.has(next));seen.add(next)}
   assert.equal(seen.size,12);assert.ok(await page.getByRole('button',{name:'Start a new round',exact:true}).isVisible());await page.getByLabel('Joke theme').selectOption('all');assert.equal(await remaining(),59);assert.ok(!seen.has(await id()));
   await page.getByLabel('Joke theme').selectOption('tech');assert.equal(await page.locator('[data-yo-mama-result]').count(),0);await page.getByRole('button',{name:'Start a new round',exact:true}).click();assert.equal(await remaining(),11);
  });
  await test('Actual remix can preserve either half, exhaust fixed options, and broaden',async()=>{
   await fresh();await page.getByRole('button',{name:'Absurd remix',exact:true}).click();assert.equal(await remaining(),575);await page.getByLabel('Joke theme').selectOption('snacks');let pair=(await id()).split('/');assert.ok(pair.every(p=>p.includes('snacks')));
   await page.getByRole('button',{name:'New ending',exact:true}).click();let next=(await id()).split('/');assert.equal(next[0],pair[0]);assert.notEqual(next[1],pair[1]);pair=next;
   const used=new Set([await id()]);while(await page.getByRole('button',{name:'New setup',exact:true}).isEnabled()){await page.getByRole('button',{name:'New setup',exact:true}).click();next=(await id()).split('/');assert.equal(next[1],pair[1]);assert.ok(!used.has(await id()));used.add(await id())}assert.ok(used.size<=4&&used.size>=2);
   assert.ok(await remaining()>0);await page.getByRole('button',{name:'Remix both',exact:true}).click();assert.ok(!used.has(await id()));await page.getByLabel('Joke theme').selectOption('all');assert.ok(await remaining()>550);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.locator('#yo-mama-tool').scrollIntoViewIfNeeded();await page.screenshot({path:output+'-'+viewport.width+'-remix.png',animations:'disabled'});
  });
  if(viewport.width===1280)await test('Full clean round has 72 unique results and explicit restart',async()=>{
   await fresh();const seen=new Set([await id()]);for(let i=1;i<72;i++){await page.getByRole('button',{name:'Another joke',exact:true}).click();assert.ok(!seen.has(await id()));seen.add(await id())}assert.equal(await remaining(),0);assert.equal(seen.size,72);assert.equal(await count('generate_success'),71);await page.getByRole('button',{name:'Start a new round',exact:true}).click();assert.equal(await remaining(),71);
  });
  await test('Reload resets the documented round boundary',async()=>{await page.reload({waitUntil:'networkidle'});assert.equal(await remaining(),71);assert.equal(await id(),'ym-tech-1')});
  await context.close();
 }
 assert.deepEqual(errors,[]);writeFileSync(output+'.json',JSON.stringify({origin,results,pageErrors:errors,externalAndApiRequestsBlocked:true},null,2));console.log(`PASS ${results.length} Yo Mama browser cases across desktop and mobile.`);
}catch(error){writeFileSync(output+'.json',JSON.stringify({origin,results,pageErrors:errors,error:error.message},null,2));throw error}finally{await browser.close()}
