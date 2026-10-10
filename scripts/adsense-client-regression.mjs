// Exercise the real runtime with an in-memory DOM/queue. No browser, Google
// scripts, authentication, analytics, payments or network requests are used.
import assert from 'node:assert/strict';
import {load} from './lib/load-typescript.mjs';
import {mockSdk} from './lib/adsense-mock-sdk.mjs';

const granted={gdprApplies:true,cmpStatus:'loaded',eventStatus:'useractioncomplete',purpose:{consents:{1:true}},vendor:{consents:{755:true}}};
const denied={...granted,purpose:{consents:{1:false}}};
const names=['window','document','location','navigator','sessionStorage'];
const descriptors=new Map(names.map(name=>[name,Object.getOwnPropertyDescriptor(globalThis,name)]));
const restore=()=>{for(const [name,descriptor] of descriptors){if(descriptor)Object.defineProperty(globalThis,name,descriptor);else delete globalThis[name]}};
function fixture(){
 const scripts=[],frames=[],timers=new Map(),storage=new Map(),windowListeners=new Map(),documentListeners=new Map(),tcfListeners=[];
 let timerId=0,pause=1,reopened=0;
 const stats={pushes:0,resumes:0,replacements:[]};
 const queue=[];queue.push=()=>{stats.pushes++};
 Object.defineProperty(queue,'pauseAdRequests',{get:()=>pause,set:value=>{if(value===0&&pause!==0)stats.resumes++;pause=value}});
 const element=(tag='ins')=>({tagName:tag.toUpperCase(),name:'',style:{},dataset:{},attributes:new Map(),isConnected:true,offsetWidth:300,offsetHeight:250,setAttribute(name,value){this.attributes.set(name,String(value));if(name.startsWith('data-'))this.dataset[name.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=String(value)},getAttribute(name){return this.attributes.get(name)??null}});
 const slot=element();slot.setAttribute('data-restrict-data-processing','1');
 const add=(registry)=>(name,callback)=>{const listeners=registry.get(name)||[];listeners.push(callback);registry.set(name,listeners)};
 const location=new URL('https://randomtopics.app/');location.replace=url=>stats.replacements.push(url);
 const document={hidden:false,head:{appendChild:script=>scripts.push(script)},body:{appendChild:frame=>frames.push(frame)},createElement:element,querySelector:selector=>selector==='iframe[name="googlefcPresent"]'?frames.find(frame=>frame.name==='googlefcPresent')??null:null,addEventListener:add(documentListeners)};
 const navigator={globalPrivacyControl:false};
 const window={adsbygoogle:queue,location,setTimeout(callback,ms){const id=++timerId;timers.set(id,{callback,ms});return id},clearTimeout:id=>timers.delete(id),addEventListener:add(windowListeners)};
 const sessionStorage={getItem:key=>storage.get(key)??null};
 for(const [name,value] of Object.entries({window,document,location,navigator,sessionStorage}))Object.defineProperty(globalThis,name,{value,writable:true,configurable:true});
 const runtime=load('src/lib/adsenseClient.ts',{},new Map());
 const fire=(listeners,name)=>listeners.get(name)?.forEach(callback=>callback());
 const sdk=()=>scripts.find(script=>script.src?.includes('/pagead/js/adsbygoogle.js'));
 const boot=(consent=granted)=>{
  runtime.setAdEligibility(true);
  const loading=runtime.loadAdSense();loading.catch(()=>{});
  const initial=window.googlefc.callbackQueue;
  window.googlefc.usstatesoptout={getInitialUsStatesOptOutStatus:()=>1,InitialUsStatesOptOutStatusEnum:{UNKNOWN:0,DOES_NOT_APPLY:1,NOT_OPTED_OUT:2,OPTED_OUT:3}};
  window.__tcfapi=(_command,_version,callback)=>{tcfListeners.push(callback);callback(consent,true)};
  const run=entry=>Object.values(entry).forEach(callback=>callback());
  window.googlefc.callbackQueue={push:run};
  window.googlefc.showRevocationMessage=()=>{reopened++};
  initial.forEach(run);
  return loading;
 };
 return {runtime,stats,queue,window,document,location,navigator,storage,slot,scripts,timers,sdk,boot,pause:()=>pause,reopened:()=>reopened,consent:(data,success=true)=>tcfListeners.forEach(callback=>callback(data,success)),focus:()=>fire(windowListeners,'focus'),visible:()=>fire(documentListeners,'visibilitychange')};
}

const results=[];
async function test(name,check){const f=fixture();try{await check(f);results.push({name,pass:true})}finally{restore()}}
await test('SDK and CMP can start before a manual slot is prepared',async f=>{
 const loading=f.boot();assert.equal(f.scripts.length,2);assert.equal(f.stats.pushes,0);assert.equal(f.pause(),1);
 f.sdk().onload();await loading;
 assert.equal(f.pause(),0);assert.equal(f.stats.resumes,1);assert.equal(f.stats.pushes,0);
 assert.equal(f.queue.requestNonPersonalizedAds,1);assert.equal(f.sdk().getAttribute('data-privacy-treatments'),'disablePersonalization');assert.equal(f.sdk().getAttribute('data-restrict-data-processing'),'1');
 assert.equal(f.runtime.loadAdSense(),loading);assert.equal(f.scripts.length,2);
 f.runtime.prepareAd(f.slot);f.runtime.prepareAd(f.slot);
 assert.equal(f.stats.pushes,1);assert.equal(f.stats.resumes,1);assert.equal(f.pause(),0);
});
await test('Fresh free qualification resumes existing Auto ads without another manual push',async f=>{
 const loading=f.boot();f.sdk().onload();await loading;f.runtime.prepareAd(f.slot);
 f.runtime.setAdEligibility(false);assert.equal(f.pause(),1);
 f.consent(granted);assert.equal(f.pause(),1,'Privacy callback cannot override pending eligibility');
 f.runtime.prepareAd(f.slot);assert.equal(f.stats.pushes,1);
 f.runtime.setAdEligibility(true);assert.equal(f.pause(),0);assert.equal(f.stats.resumes,2);
 f.runtime.prepareAd(f.slot);assert.equal(f.stats.pushes,1);
 f.runtime.setAdEligibility(true);f.focus();assert.equal(f.stats.resumes,2,'Repeated ready callbacks do not toggle the queue');
});
await test('Offscreen Auto ads recover from pending eligibility with zero manual pushes',async f=>{
 const loading=f.boot();f.sdk().onload();await loading;f.runtime.setAdEligibility(false);f.runtime.setAdEligibility(true);
 assert.equal(f.stats.resumes,2);assert.equal(f.stats.pushes,0);assert.equal(f.pause(),0);
});
await test('Consent dialog stays paused through focus until the final choice',async f=>{
 const loading=f.boot();f.sdk().onload();await loading;
 f.runtime.showAdPrivacyChoices();assert.equal(f.reopened(),1);assert.equal(f.pause(),1);
 f.focus();f.runtime.setAdEligibility(true);assert.equal(f.pause(),1);
 f.consent({...granted,eventStatus:'cmpuishown'});assert.equal(f.pause(),1);assert.equal(f.stats.replacements.length,0);
 f.consent(granted);assert.equal(f.pause(),0);assert.equal(f.stats.resumes,2);assert.equal(f.stats.pushes,0);
});
await test('Privacy withdrawal retires Auto ads even before any manual slot push',async f=>{
 const loading=f.boot();f.sdk().onload();await loading;f.consent(denied);
 assert.equal(f.pause(),1);assert.deepEqual(f.stats.replacements,['https://randomtopics.app/?rt_ads=off']);
 f.consent(granted);f.runtime.setAdEligibility(true);f.sdk().onload();assert.equal(f.pause(),1);assert.equal(f.stats.resumes,1);assert.equal(f.stats.pushes,0);
});
await test('Late SDK completion cannot override pending qualification',async f=>{
 const loading=f.boot();f.runtime.setAdEligibility(false);f.sdk().onload();await loading;
 assert.equal(f.pause(),1);assert.equal(f.stats.resumes,0);f.runtime.prepareAd(f.slot);assert.equal(f.stats.pushes,0);
 f.runtime.setAdEligibility(true);assert.equal(f.pause(),0);assert.equal(f.stats.resumes,1);
});
await test('Retired identity cannot be revived by a late SDK or consent response',async f=>{
 const loading=f.boot();f.runtime.retireAdDocument();f.sdk().onload();f.consent(granted);f.runtime.setAdEligibility(true);
 await Promise.resolve();assert.equal(f.pause(),1);assert.equal(f.stats.resumes,0);assert.equal(f.stats.pushes,0);assert.equal(f.stats.replacements.length,1);
 void loading;
});
for(const failure of ['error','timeout'])await test(`SDK ${failure} is terminal even if onload arrives later`,async f=>{
 const loading=f.boot();
 if(failure==='error')f.sdk().onerror();else [...f.timers.values()].find(timer=>timer.ms===10000).callback();
 await assert.rejects(loading,/Advertising unavailable/);f.sdk().onload();f.consent(granted);f.runtime.setAdEligibility(true);
 assert.equal(f.pause(),1);assert.equal(f.stats.resumes,0);assert.equal(f.stats.pushes,0);assert.equal(f.scripts.length,2);
});
for(const blocked of ['query','QA','GPC','hidden','private path','preview host'])await test(`Late SDK checks current ${blocked} before resuming`,async f=>{
 const loading=f.boot();
 if(blocked==='query')f.location.search='?rt_ads=off';else if(blocked==='QA')f.storage.set('rt_usage_qa','1');else if(blocked==='GPC')f.navigator.globalPrivacyControl=true;else if(blocked==='hidden')f.document.hidden=true;else if(blocked==='private path')f.location.pathname='/speech';else f.location.hostname='preview.example.test';
 f.sdk().onload();f.runtime.setAdEligibility(true);await Promise.resolve();assert.equal(f.pause(),1);assert.equal(f.stats.resumes,0);f.runtime.prepareAd(f.slot);assert.equal(f.stats.pushes,0);
 void loading;
});
await test('Manual slot validity is checked independently of already running Auto ads',async f=>{
 const loading=f.boot();f.sdk().onload();await loading;
 for(const override of [{isConnected:false},{offsetWidth:299},{offsetHeight:249},{dataset:{adsbygoogleStatus:'done'}}])f.runtime.prepareAd({...f.slot,...override});
 f.slot.attributes.delete('data-restrict-data-processing');f.runtime.prepareAd(f.slot);
 assert.equal(f.stats.pushes,0);assert.equal(f.pause(),0);assert.equal(f.stats.resumes,1);
});
await test('Browser SDK double distinguishes global resumes from a single manual fill',async f=>{
 const window={adsbygoogle:Object.assign([],{pauseAdRequests:1,requestNonPersonalizedAds:1}),__missingCmp:true};
 new Function('window','document',mockSdk)(window,{querySelectorAll:()=>[f.slot]});
 window.adsbygoogle.pauseAdRequests=0;
 assert.equal(window.__mock.resumes,1);assert.equal(window.__mock.requests,0);assert.equal(window.__mock.prepared,0);
 window.adsbygoogle.push({});assert.equal(window.__mock.requests,1);assert.equal(window.__mock.prepared,1);
 window.adsbygoogle.pauseAdRequests=1;window.adsbygoogle.pauseAdRequests=0;
 assert.equal(window.__mock.resumes,2);assert.equal(window.__mock.requests,1);assert.equal(window.__mock.prepared,1);
});
console.log(`PASS: ${results.length} advertising runtime lifecycle cases (in-memory DOM, no network).`);
