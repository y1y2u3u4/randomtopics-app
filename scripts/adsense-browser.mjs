// Real React effects + mocked Google SDK/CMP. Every URL is fulfilled locally or
// blocked; no real advertising, analytics, login or payment network is allowed.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {join,resolve} from 'node:path';import {tmpdir} from 'node:os';
const require=createRequire(import.meta.url),root=resolve(import.meta.dirname,'..');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const temp=mkdtempSync(join(tmpdir(),'rt-ad-mock-'));
const put=(n,s)=>{const p=join(temp,n);writeFileSync(p,s);return p};
const loader=put('loader.cjs',`const ts=require(${JSON.stringify(require.resolve('typescript'))});module.exports=s=>ts.transpileModule(s,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText`);
const link=put('link.tsx','export default function Link(p){return <a {...p}/>;}');
const entry=put('entry.tsx',`import React,{StrictMode}from'react';import{createRoot}from'react-dom/client';import Ad from '@/components/ArticleAdvertisement';const root=createRoot(document.getElementById('root'));window.__draw=()=>root.render(<StrictMode><div style={{height:window.__offscreen?1600:0}}/><Ad path={location.pathname} slot="8217822741"/><p id="after">Content after the slot</p></StrictMode>);window.__draw();`);
const {webpack}=require('next/dist/compiled/webpack/webpack');
await new Promise((ok,fail)=>webpack({mode:'development',devtool:false,entry,output:{path:temp,filename:'bundle.js'},resolve:{extensions:['.tsx','.ts','.js'],modules:[resolve(root,'node_modules')],alias:{'next/link':link,'@':resolve(root,'src')}},module:{rules:[{test:/\.tsx?$/,use:loader}]}},(e,s)=>e||s.hasErrors()?fail(e||Error(s.toString({all:false,errors:true}))):ok()));
const bundle=readFileSync(join(temp,'bundle.js'));
const html='<!doctype html><html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{margin:0}p{margin:0}button{min-height:44px}.rt-article-ad{width:100%;height:456px;padding:24px 0;margin:0 auto 40px}.mb-3{margin-bottom:12px}.mt-6{margin-top:24px}.h-16{height:64px}.h-11{height:44px}.block{display:block}.text-center{text-align:center}@media(max-width:319px){.rt-article-ad{display:none}}</style><div id="root"></div><script src="/fixture.js"></script></html>';
import {mockSdk} from './lib/adsense-mock-sdk.mjs';
const granted={gdprApplies:true,cmpStatus:'loaded',eventStatus:'useractioncomplete',purpose:{consents:{1:true}},vendor:{consents:{755:true}}};
const denied={...granted,purpose:{consents:{1:false}}};
const browser=await chromium.launch({headless:true,chromiumSandbox:true});const results=[],errors=[];
const output=process.env.AD_EVIDENCE||'/tmp/adsense-browser';
async function fixture(options={}){
 const context=await browser.newContext({viewport:{width:options.width||390,height:844},serviceWorkers:'block'});let sdkLoads=0,blocked=0,documents=0;
 await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname==='fundingchoicesmessages.google.com')return route.fulfill({contentType:'text/javascript',body:'/* mock CMP supplied by the mock SDK */'});if(u.hostname==='pagead2.googlesyndication.com'&&u.pathname==='/pagead/js/adsbygoogle.js'){sdkLoads++;if(options.scriptFailure)return route.abort();if(options.timeout)await new Promise(r=>setTimeout(r,100));return route.fulfill({contentType:'text/javascript',body:mockSdk})}if(u.hostname===new URL(options.origin||'https://randomtopics.app').hostname){if(u.pathname==='/fixture.js')return route.fulfill({contentType:'text/javascript',body:bundle});documents++;return route.fulfill({contentType:'text/html',body:html})}blocked++;return route.abort()});
 await context.addInitScript(({options,granted,denied})=>{window.__consent=options.denied?denied:options.pending?{...granted,eventStatus:'cmpuishown'}:options.nonEu?{...granted,gdprApplies:false}:granted;window.__usStatus=options.usStatus??1;window.__missingCmp=options.missingCmp;window.__offscreen=options.offscreen;if(options.qa)sessionStorage.setItem('rt_usage_qa','1');if(options.gpc)Object.defineProperty(navigator,'globalPrivacyControl',{value:true});if(options.storageBlocked)Storage.prototype.getItem=()=>{throw Error('synthetic storage refusal')};if(options.timeout){const set=window.setTimeout;window.setTimeout=(f,ms,...args)=>set(f,ms===10000?10:ms,...args)}}, {options,granted,denied});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto((options.origin||'https://randomtopics.app')+(options.path||'/'));await page.locator('aside').waitFor({state:'attached'});await page.waitForTimeout(180);
 return {page,context,loads:()=>sdkLoads,documents:()=>documents,blocked:()=>blocked,stats:()=>page.evaluate(()=>window.__mock||{prepared:0,requests:0}),close:()=>context.close()};
}
const test=async(name,options,fn)=>{const f=await fixture(options);try{await fn(f);results.push({name,pass:true})}catch(e){results.push({name,pass:false,error:e.message})}finally{await f.close()}};
try{
 await test('StrictMode: one paused preparation and one NPA/RDP release',{},async f=>{assert.equal(f.loads(),1);assert.deepEqual(await f.stats(),{prepared:1,requests:1,pause:0,npa:1,reopen:0});assert.equal(await f.page.locator('ins').getAttribute('data-restrict-data-processing'),'1');await f.page.evaluate(()=>window.__draw());await f.page.waitForTimeout(60);assert.equal((await f.stats()).requests,1)});
 await test('Known denied consent never unpauses', {denied:true},async f=>{assert.equal((await f.stats()).requests,0);assert.equal((await f.stats()).pause,1)});
 await test('Unknown choice waits; explicit consent releases once',{pending:true},async f=>{assert.equal((await f.stats()).requests,0);await f.page.evaluate(d=>window.__setConsent(d),granted);await f.page.waitForTimeout(50);assert.equal((await f.stats()).requests,1)});
 await test('Missing CMP remains paused without fallback',{missingCmp:true},async f=>assert.equal((await f.stats()).requests,0));
 await test('Confirmed non-applicable regional status allows only NPA/RDP',{nonEu:true,usStatus:1},async f=>assert.equal((await f.stats()).requests,1));
 for(const status of [0,2,3])await test('Unverified/opted-out US state status '+status,{nonEu:true,usStatus:status},async f=>assert.equal((await f.stats()).requests,0));
 for(const options of [{qa:true},{gpc:true},{storageBlocked:true},{path:'/?usage_qa=1'},{path:'/speech'},{path:'/speech/account'},{origin:'https://preview.example.test'},{width:319}])await test('No SDK under '+JSON.stringify(options),options,async f=>assert.equal(f.loads(),0));
 await test('Offscreen slot waits until near viewport',{offscreen:true},async f=>{assert.equal(f.loads(),0);await f.page.locator('ins').scrollIntoViewIfNeeded();await f.page.waitForTimeout(150);assert.equal((await f.stats()).requests,1)});
 await test('Ad blocker leaves article usable and never retries',{scriptFailure:true},async f=>{assert.equal(f.loads(),1);assert.equal((await f.stats()).requests,0);await f.page.evaluate(()=>window.__draw());await f.page.waitForTimeout(50);assert.equal(f.loads(),1);assert.ok(await f.page.locator('#after').isVisible())});
 await test('Late SDK after timeout cannot release a request',{timeout:true},async f=>assert.equal((await f.stats()).requests,0));
 await test('Privacy choices pauses; final withdrawal disposes the ad document',{},async f=>{await f.page.getByRole('button',{name:'Advertising privacy choices'}).click();assert.equal((await f.stats()).pause,1);const before=f.documents();await f.page.evaluate(d=>window.__setConsent(d),denied);await f.page.waitForTimeout(200);assert.ok(f.documents()>before)});
 for(const width of [320,390,1280])await test('Fixed slot and following content do not shift at '+width,{width,pending:true},async f=>{const a=await f.page.locator('#after').boundingBox();await f.page.evaluate(d=>window.__setConsent(d),granted);await f.page.waitForTimeout(70);assert.deepEqual(await f.page.locator('#after').boundingBox(),a);const b=await f.page.locator('ins').boundingBox();assert.equal(b.width,300);assert.equal(b.height,250);assert.ok(await f.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))});
 await test('Spanish label, privacy action and locale link',{path:'/es'},async f=>{assert.equal(await f.page.locator('aside').getAttribute('aria-label'),'Publicidad');assert.equal(await f.page.getByRole('link',{name:'Política de privacidad'}).getAttribute('href'),'/es/privacy');assert.ok(await f.page.getByRole('button',{name:'Opciones de privacidad publicitaria'}).isVisible())});
}finally{await browser.close();rmSync(temp,{recursive:true,force:true});writeFileSync(output+'.json',JSON.stringify({results,errors,realAdRequests:0},null,2))}
console.log(JSON.stringify({passed:results.filter(x=>x.pass).length,total:results.length,failures:results.filter(x=>!x.pass),errors}));assert.ok(results.every(x=>x.pass)&&!errors.length);
