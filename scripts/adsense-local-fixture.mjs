// Local fixture for CUA/manual verification of the real React component.
// The test-only loader redirects Google scripts to this loopback server and
// permits only loopback hosts. CSP blocks every external network destination.
// Run: node scripts/adsense-local-fixture.mjs, then open http://127.0.0.1:4807/.
import {createServer} from 'node:http';
import {createRequire} from 'node:module';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {mockSdk} from './lib/adsense-mock-sdk.mjs';

const require=createRequire(import.meta.url),root=resolve(import.meta.dirname,'..');
const temporary=mkdtempSync(join(tmpdir(),'rt-ad-local-'));
const put=(name,source)=>{const path=join(temporary,name);writeFileSync(path,source);return path};
const loader=put('loader.cjs',`
const ts=require(${JSON.stringify(require.resolve('typescript'))});
module.exports=function(source){
 if(this.resourcePath.endsWith('/lib/adsense.ts')){
  const before=source;source=source.replace('"randomtopics.app", "www.randomtopics.app"','"127.0.0.1", "localhost"');
  if(before===source)throw Error('Local fixture host rewrite no longer matches');
 }
 if(this.resourcePath.endsWith('/lib/adsenseClient.ts')){
  const before=source;
  source=source.replace('https://fundingchoicesmessages.google.com/i/','/mock-cmp/').replace('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js','/mock-sdk/adsbygoogle.js');
  if(before===source||source.includes('https://pagead2.googlesyndication.com')||source.includes('https://fundingchoicesmessages.google.com'))throw Error('Local fixture script rewrite no longer matches');
 }
 return ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText;
};`);
const link=put('link.tsx','export default function Link(props){return <a {...props}/>;}');
const auth=put('auth.ts',`
const listeners=new Set();window.__adUser='fixture-member';
window.__adAuthChange=(user,event='SIGNED_IN')=>{window.__adUser=user;for(const listener of listeners)listener(event,user?{user:{id:user}}:null)};
export async function speechClient(){return{auth:{
 getSession:async()=>({data:{session:window.__adUser?{access_token:'SYNTHETIC',user:{id:window.__adUser}}:null},error:null}),
 onAuthStateChange(callback){listeners.add(callback);queueMicrotask(()=>{if(listeners.has(callback))callback('INITIAL_SESSION',window.__adUser?{user:{id:window.__adUser}}:null)});return{data:{subscription:{unsubscribe(){listeners.delete(callback)}}}}}
}};}`);
const entry=put('entry.tsx',`
import React,{StrictMode} from 'react';import {createRoot} from 'react-dom/client';import Ad from '@/components/ArticleAdvertisement';
const root=createRoot(document.getElementById('root'));
root.render(<StrictMode><div className="spacer">Article content. The manual slot starts below the first viewport.</div><Ad path={location.pathname} slot="8217822741"/><p id="after">Article remains usable after the ad slot.</p></StrictMode>);
window.__remove=()=>root.render(<p id="after">Article remains usable after component unmount.</p>);
window.__draw=()=>root.render(<StrictMode><div className="spacer">Article content</div><Ad path={location.pathname} slot="8217822741"/><p id="after">Article remains usable.</p></StrictMode>);
`);
const {webpack}=require('next/dist/compiled/webpack/webpack');
await new Promise((resolveBuild,rejectBuild)=>webpack({mode:'development',devtool:false,entry,output:{path:temporary,filename:'bundle.js'},resolve:{extensions:['.tsx','.ts','.js'],modules:[resolve(root,'node_modules')],alias:{'next/link':link,'@':resolve(root,'src'),[resolve(root,'src/lib/speech/client.ts')]:auth}},module:{rules:[{test:/\.tsx?$/,use:loader}]}},(error,stats)=>error||stats.hasErrors()?rejectBuild(error||Error(stats.toString({all:false,errors:true}))):resolveBuild()));
const bundle=readFileSync(join(temporary,'bundle.js'));
const granted={gdprApplies:true,cmpStatus:'loaded',eventStatus:'useractioncomplete',purpose:{consents:{1:true}},vendor:{consents:{755:true}}};
const denied={...granted,purpose:{consents:{1:false}}};
let state='free',initialConsent='granted',failures=0,holdNext=false,holdSdk=false;
let counts={sdkLoads:0,cmpLoads:0,entitlementCalls:0},held=[],heldSdk=[];
const release=()=>{const pending=held;held=[];pending.forEach(finish=>finish())};
const releaseSdk=()=>{const pending=heldSdk;heldSdk=[];pending.forEach(finish=>finish())};
const json=(response,value,status=200)=>{if(response.destroyed)return;response.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});response.end(JSON.stringify(value))};
const html=()=>`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Local advertising lifecycle fixture</title><style>
*{box-sizing:border-box}body{margin:0;font:15px system-ui;background:#f7f7f9;color:#222}header{position:sticky;top:0;z-index:10;padding:12px;background:white;border-bottom:1px solid #bbb}h1{margin:0 0 8px;font-size:19px}.controls{display:flex;gap:6px;flex-wrap:wrap}button,a{min-height:32px;padding:6px 10px}button{cursor:pointer}pre{margin:8px 0 0;padding:8px;background:#eef0f5;font-size:12px;white-space:pre-wrap;max-height:200px;overflow:auto}.spacer{height:1700px;padding:24px}.rt-article-ad{width:100%;height:456px;padding:24px 0;margin:0 auto 40px;background:#fff}.mb-3{margin-bottom:12px}.mt-6{margin-top:24px}.h-16{height:64px}.h-11{height:44px}.block{display:block}.text-center{text-align:center}ins{background:#e7f1e7}#after{padding:24px}#notice{font-size:12px;color:#555}@media(max-width:319px){.rt-article-ad{display:none}}
</style></head><body><header><h1>Local advertising lifecycle fixture</h1><div id="notice">Actual React component and runtime. All ad/CMP responses are synthetic and local. No real ad requests.</div><div class="controls">
<button id="new-free">New free document</button><button id="new-paid">New paid document</button><button id="fresh">Fresh document, keep backend</button>
<button data-state="free">Backend free</button><button data-state="paid">Backend paid</button><button data-state="failure">Backend failure</button><button id="transient">Fail next request once</button>
<button id="hold">Hold next eligibility</button><button id="release">Release eligibility</button><button id="refresh">Refresh eligibility</button><button id="token-refresh">Refresh same identity</button>
<button id="hold-sdk">Hold SDK next document</button><button id="release-sdk">Release SDK</button>
<button id="grant">Grant consent</button><button id="pending">Consent pending</button><button id="deny">Withdraw consent</button><button id="privacy">Open privacy choices</button>
<button id="switch">Switch identity</button><button id="logout">Sign out</button><button id="show">Show manual slot</button><button id="top">Back to article top</button><button id="unmount">Unmount ad component</button>
</div><pre id="stats" aria-label="Fixture status">Starting local fixture…</pre></header><main id="root"></main><script>
window.__consent=${JSON.stringify(initialConsent==='denied'?denied:initialConsent==='pending'?{...granted,eventStatus:'cmpuishown'}:granted)};window.__usStatus=1;window.__privacyOptions={};window.__errors=[];window.addEventListener('error',event=>window.__errors.push(event.message));
const granted=${JSON.stringify(granted)},denied=${JSON.stringify(denied)};
async function control(value){return fetch('/__control',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(value)}).then(response=>response.json())}
document.querySelectorAll('[data-state]').forEach(button=>button.onclick=()=>control({state:button.dataset.state}));
document.getElementById('new-free').onclick=async()=>{await control({reset:true,state:'free',consent:'granted'});location.href='/'};
document.getElementById('new-paid').onclick=async()=>{await control({reset:true,state:'paid',consent:'granted'});location.href='/'};
document.getElementById('fresh').onclick=()=>location.href='/';
document.getElementById('transient').onclick=()=>control({failures:1});
document.getElementById('hold').onclick=()=>control({hold:true});document.getElementById('release').onclick=()=>control({release:true});
document.getElementById('refresh').onclick=()=>dispatchEvent(new Event('focus'));
document.getElementById('token-refresh').onclick=()=>window.__adAuthChange?.(window.__adUser,'TOKEN_REFRESHED');
document.getElementById('hold-sdk').onclick=()=>control({holdSdk:true});document.getElementById('release-sdk').onclick=()=>control({releaseSdk:true});
document.getElementById('grant').onclick=()=>window.__setConsent?.(granted);document.getElementById('pending').onclick=()=>window.__setConsent?.({...granted,eventStatus:'cmpuishown'});document.getElementById('deny').onclick=()=>window.__setConsent?.(denied);
document.getElementById('privacy').onclick=()=>document.querySelector('aside button')?.click();document.getElementById('switch').onclick=()=>window.__adAuthChange?.('other-fixture-member');document.getElementById('logout').onclick=()=>window.__adAuthChange?.(null,'SIGNED_OUT');
document.getElementById('show').onclick=()=>document.querySelector('aside')?.scrollIntoView({block:'end'});document.getElementById('top').onclick=()=>scrollTo(0,0);document.getElementById('unmount').onclick=()=>window.__remove?.();
async function status(){const server=await fetch('/__status').then(response=>response.json());const mock=window.__mock,slot=document.querySelector('ins');document.getElementById('stats').textContent=JSON.stringify({...server,path:location.pathname+location.search,identity:window.__adUser??'signed-out',prepared:mock?.prepared??0,manualRequests:mock?.requests??0,resumes:mock?.resumes??0,pause:window.adsbygoogle?.pauseAdRequests??null,npa:window.adsbygoogle?.requestNonPersonalizedAds??null,slotTop:slot?Math.round(slot.getBoundingClientRect().top):null,adStatus:slot?.dataset.adStatus??null,privacyReopens:mock?.reopen??0,errors:window.__errors},null,2)}
setInterval(()=>status().catch(()=>{}),200);status();
</script><script src="/fixture.js"></script></body></html>`;
const server=createServer(async(request,response)=>{
 const url=new URL(request.url,'http://127.0.0.1:4807');
 if(url.pathname==='/__status')return json(response,{...counts,backend:state,heldEligibility:held.length,holdNextEligibility:holdNext,heldSdk:heldSdk.length,holdNextSdk:holdSdk});
 if(url.pathname==='/__control'&&request.method==='POST'){
  let body='';for await(const chunk of request)body+=chunk;
  const change=JSON.parse(body||'{}');
  if(change.reset){release();releaseSdk();counts={sdkLoads:0,cmpLoads:0,entitlementCalls:0};failures=0;holdNext=false;holdSdk=false}
  if(['free','paid','failure'].includes(change.state))state=change.state;
  if(['granted','pending','denied'].includes(change.consent))initialConsent=change.consent;
  if(change.failures===1)failures=1;if(change.hold)holdNext=true;if(change.release)release();if(change.holdSdk)holdSdk=true;if(change.releaseSdk)releaseSdk();
  return json(response,{ok:true,state});
 }
 if(url.pathname==='/fixture.js'){response.writeHead(200,{'Content-Type':'text/javascript','Cache-Control':'no-store'});return response.end(bundle)}
 if(url.pathname.startsWith('/mock-cmp/')){counts.cmpLoads++;response.writeHead(200,{'Content-Type':'text/javascript'});return response.end('/* Synthetic CMP is installed with the synthetic SDK. */')}
 if(url.pathname==='/mock-sdk/adsbygoogle.js'){
  counts.sdkLoads++;const finish=()=>{if(response.destroyed)return;response.writeHead(200,{'Content-Type':'text/javascript'});response.end(mockSdk)};
  if(holdSdk){holdSdk=false;heldSdk.push(finish);return}return finish();
 }
 if(url.pathname==='/api/speech/ad-entitlement'){
  counts.entitlementCalls++;const snapshot=state,failed=failures>0;if(failed)failures--;
  const finish=()=>json(response,{version:'speech-ad-v1',audience:request.headers.authorization?'verified_session':'signed_out',adFree:snapshot==='paid'},snapshot==='failure'||failed?503:200);
  if(holdNext){holdNext=false;held.push(finish);return}return finish();
 }
 if(url.pathname.startsWith('/api/'))return json(response,{error:'Fixture blocks unrelated API calls'},404);
 response.writeHead(200,{'Content-Type':'text/html','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; frame-src 'self'"});response.end(html());
});
server.listen(4807,'127.0.0.1',()=>console.log('Local advertising fixture: http://127.0.0.1:4807/ (synthetic scripts only)'));
const cleanup=()=>{server.close();rmSync(temporary,{recursive:true,force:true})};process.once('SIGINT',()=>{cleanup();process.exit(0)});process.once('SIGTERM',()=>{cleanup();process.exit(0)});
