// Regression: do not wait for hydration before the early Back. Actual first-party GET responses; every collector/business API
// is mocked or blocked. Delayed JS is released after an early browser Back.
import {createRequire} from 'node:module';
import {writeFileSync, mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
import {mockSdk} from './lib/adsense-mock-sdk.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const origin='https://randomtopics.app', backend=process.env.HISTORY_BACKEND||'http://127.0.0.1:4732';
assert.ok(/^http:\/\/127\.0\.0\.1:\d+$/.test(backend),'Local built pages only; production traffic is never allowed');
const output=process.env.HISTORY_EVIDENCE||'/tmp/early-history';mkdirSync(output,{recursive:true});
const cases=JSON.parse(process.env.HISTORY_CASES||JSON.stringify([{name:'early-back-qa',hold:true,qa:true,forward:true},{name:'early-back-ad-mock',hold:true,qa:false},{name:'reverse-qa',hold:true,qa:true,start:'/speech',destination:'/'},{name:'reverse-ad-mock',hold:true,qa:false,start:'/speech',destination:'/'},{name:'band-back',hold:true,qa:true,destination:'/band-name-generator',forward:true},{name:'dragon-back',hold:true,qa:true,destination:'/dragon-name-generator',forward:true},{name:'loaded-control',hold:false,qa:true,loadedControl:true,forward:true}]));
const browser=await chromium.launch({headless:true,chromiumSandbox:true});const results=[];
for(const test of cases){
 const events=[],network=[],errors=[];let docs=0,held=0,delayActive=false,closing=false,phase='open';
 let release;const gate=new Promise(resolve=>{release=resolve});
 const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});context.setDefaultTimeout(12000);
 await context.exposeBinding('__navProbeRecord',(_,entry)=>events.push(entry));
 await context.addInitScript(({qa})=>{
  if(qa)sessionStorage.setItem('rt_usage_qa','1');
  window.__privacyOptions={nonEu:true,missingUs:true};window.__consent={gdprApplies:false,cmpStatus:'loaded'};window.__usStatus=1;
  const id=Math.random(),loadedPath=location.pathname;let nextListeners=0;
  window.__probeInfo={id,loadedPath,nextListeners};
  const emit=(event,extra={})=>window.__navProbeRecord({event,doc:id,loadedPath,path:location.pathname,search:location.search,ready:document.readyState,ms:performance.now(),nextListeners,h1:document.querySelector('h1')?.textContent,...extra});
  const add=window.addEventListener.bind(window);
  window.addEventListener=function(type,fn,options){if(type==='popstate'){nextListeners++;window.__probeInfo.nextListeners=nextListeners;emit('pop-listener-added',{functionName:fn?.name||'anonymous'});}return add(type,fn,options)};
  add('popstate',e=>emit('popstate',{stateKeys:Object.keys(e.state||{}),nextState:Boolean(e.state?.__NA)}),true);
  add('pageshow',e=>emit('pageshow',{persisted:e.persisted}));
  document.addEventListener('readystatechange',()=>emit('readystatechange'));
  add('DOMContentLoaded',()=>emit('DOMContentLoaded'));add('load',()=>emit('load'));
  for(const method of ['pushState','replaceState']){const original=history[method].bind(history);history[method]=function(state,unused,url){emit(method,{target:url?new URL(url,location.href).pathname:null,stateKeys:Object.keys(state||{})});return original(state,unused,url)}}
  window.__qaEvents=[];add('rt:analytics',e=>{if(e.detail.stage==='constructed')window.__qaEvents.push(e.detail)});
  emit('init');
 },{qa:test.qa});
 await context.route('**/*',async route=>{
  try{
   const req=route.request(),url=new URL(req.url());
   if(url.hostname==='pagead2.googlesyndication.com')return route.fulfill({contentType:'text/javascript',body:mockSdk});
   if(url.hostname==='fundingchoicesmessages.google.com')return route.fulfill({contentType:'text/javascript',body:'/* mock CMP */'});
   if(url.origin===origin&&url.pathname==='/api/speech/config')return route.fulfill({contentType:'application/json',body:JSON.stringify({url:'https://ad-fixture.supabase.co',key:'SYNTHETIC_PUBLIC_KEY',billingAvailable:true})});
   if(url.origin===origin&&url.pathname==='/api/speech/ad-entitlement')return route.fulfill({contentType:'application/json',body:JSON.stringify({version:'speech-ad-v1',audience:'signed_out',adFree:false})});
   if(url.origin!==origin||url.pathname.startsWith('/api/')||req.method()!=='GET')return route.abort();
   if(req.isNavigationRequest()){docs++;network.push({event:'document-request',path:url.pathname,docs});if(url.pathname===(test.destination||'/speech')&&docs>1)delayActive=true;else delayActive=false;}
   if(test.hold&&delayActive&&req.resourceType()==='script'){held++;network.push({event:'script-held',path:url.pathname});await gate;}
   const response=await route.fetch({url:backend+url.pathname+url.search,maxRedirects:0,headers:{...req.headers(),host:new URL(backend).host}});
   return route.fulfill({response});
  }catch(e){if(!closing&&!/Target.*closed|Request context disposed/.test(e.message))errors.push({phase:'route',message:e.message})}
 });
 const page=await context.newPage();page.on('pageerror',e=>errors.push({phase:'page',message:e.message}));
 const snap=async label=>({label,docs,held,...await page.evaluate(()=>({url:location.pathname,info:window.__probeInfo,h1:document.querySelector('h1')?.textContent,ready:document.readyState,adScripts:document.querySelectorAll('script[data-rt-adsense]').length,adSlots:document.querySelectorAll('[data-ad-placement]').length,sdk:typeof window.adsbygoogle,replayActive:Boolean(window.__rtReplayActive),canonical:document.querySelector('link[rel=canonical]')?.getAttribute('href')}))});
 const trace=[];let failure;
 try{
  await page.goto(origin+(test.start||'/'),{waitUntil:'networkidle'});trace.push(await snap('start-ready'));
  const initial=await page.evaluate(()=>window.__probeInfo.id),destination=test.destination||'/speech';
  phase='click';await page.locator(`a[href="${destination}"]:visible`).first().click();await page.waitForFunction(path=>location.pathname===path,destination);
  phase='new-SSR';await page.waitForFunction(({initial,destination})=>window.__probeInfo.id!==initial&&window.__probeInfo.loadedPath===destination&&Boolean(document.querySelector('h1')),{initial,destination});
  trace.push(await snap('new-SSR-before-back'));
  if(test.loadedControl)await page.waitForLoadState('networkidle');
  phase='early-back';await page.goBack({waitUntil:'commit'});await page.waitForFunction(path=>location.pathname===path,test.start||'/');trace.push(await snap('after-back-before-JS-release'));
  release();phase='settle';await page.waitForTimeout(3000);trace.push(await snap('after-JS-released-3s'));
  const matched=trace.at(-1).url===(test.start||'/')&&trace.at(-1).h1===trace[0].h1;
  if(!matched){await page.waitForTimeout(3000);trace.push(await snap('after-JS-released-6s'));}
  phase='functional-probe';
  const generator=page.locator('button.btn-generate').first();
  if(await generator.count()){
   await generator.click();await page.waitForTimeout(700);trace.push(await snap('after-free-generate'));
   trace.at(-1).generatedCards=await page.locator('.topic-card').count();
   trace.at(-1).generationEvents=await page.evaluate(()=>window.__qaEvents.filter(e=>/generate_(start|success)$/.test(e.event)).map(e=>({event:e.event,tool:e.params.tool_type,source:e.params.content_source,isTest:e.params.is_test,page:e.params.page_path})));
  }
  await page.screenshot({path:output+'/'+test.name+'.png'});
  if(test.forward){phase='forward';await page.goForward({waitUntil:'commit'});await page.waitForFunction(path=>location.pathname===path,destination);await page.waitForTimeout(3000);trace.push(await snap('forward-settled'));}
 }catch(e){failure={phase,message:e.message};release();trace.push(await snap('failure').catch(()=>({label:'unavailable'})));await page.screenshot({path:output+'/'+test.name+'-failure.png'}).catch(()=>{});}
 finally{release();closing=true;await context.close();}
 const after=trace.find(x=>x.label==='after-JS-released-6s')||trace.find(x=>x.label==='after-JS-released-3s');
 const result={test,backend,held,trace,events,network,errors,failure,mismatch:after?after.url!==(test.start||'/')||after.h1!==trace[0].h1:null,realExternalRequestsAllowed:0};
 results.push(result);writeFileSync(output+'/result.json',JSON.stringify({results},null,2));
 console.log(JSON.stringify({name:test.name,mismatch:result.mismatch,held,failure,trace,errors},null,2));
}
await browser.close();

for(const r of results){
 assert.equal(r.failure,undefined,JSON.stringify(r.failure));assert.deepEqual(r.errors,[]);
 assert.equal(r.mismatch,false,r.test.name+': URL and document must match after early traversal');
 const before=r.trace.find(x=>x.label==='new-SSR-before-back');
 if(r.test.hold){assert.ok(r.held>0);assert.notEqual(before.ready,'complete');
  const early=r.events.find(x=>x.doc===before.info.id&&x.event==='popstate');
  assert.equal(early?.nextListeners,1,'Only the inline guard is registered; Next chunks are still held');
 }
 const after=r.trace.find(x=>x.label==='after-free-generate');
 assert.ok(after?.generatedCards>0,'Destination generator is interactive after scripts are released');
 const expectedSource=r.test.start==='/speech'?'speech_hub':'homepage';
 if(r.test.qa){assert.ok(after.generationEvents.length>=2);assert.ok(after.generationEvents.every(e=>e.isTest&&e.page===(r.test.start||'/')&&e.source===expectedSource),'URL and generated event attribution must agree');}
 for(const point of r.trace.filter(x=>x.label==='forward-settled'||x.label==='after-free-generate')){
  if(point.url==='/speech'||point.url?.endsWith('-name-generator')){assert.equal(point.adScripts,0);assert.equal(point.sdk,'undefined');assert.equal(point.replayActive,false);}
 }
}
console.log(JSON.stringify({passed:results.length,total:results.length,realExternalRequestsAllowed:0}));
