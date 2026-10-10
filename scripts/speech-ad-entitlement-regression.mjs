import assert from 'node:assert/strict';
import { load } from './lib/load-typescript.mjs';
const {subscriptionAdFree,parseAdEntitlement}=load('src/lib/speech/adEntitlement.ts');
const {createSpeechAdGate}=load('src/lib/speech/adGate.ts');
const {readSpeechAdEntitlement}=load('src/lib/speech/adEligibilityClient.ts',{'./client':{speechClient(){throw Error('No live client permitted')}}});
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++};
const now=Date.parse('2026-10-05T12:00:00Z');
const active={subscription_active:true,period_start:new Date(now-1000).toISOString(),period_end:new Date(now+1000).toISOString()};
check(subscriptionAdFree(active,now),'Active subscription is ad-free');
check(subscriptionAdFree({...active,remaining:0,included:40},now),'Exhausted practice quota remains ad-free');
check(subscriptionAdFree({...active,cancel_at_period_end:true},now),'Cancel at period end preserves current paid period');
for(const row of [null,{...active,subscription_active:false},{...active,period_start:new Date(now+100).toISOString()},{...active,period_end:new Date(now).toISOString()}])check(!subscriptionAdFree(row,now),'Non-active subscription matches existing bounds');
for(const row of [{...active,subscription_active:null},{...active,period_start:null},{...active,period_end:'invalid'},{...active,period_end:active.period_start}]){assert.throws(()=>subscriptionAdFree(row,now));checks++;}
const free={version:'speech-ad-v1',audience:'verified_session',adFree:false},paid={...free,adFree:true},guest={...free,audience:'signed_out'};
for(const value of [null,{},true,{...free,version:'wrong'},{...free,adFree:'false'},{...guest,adFree:true}]){assert.throws(()=>parseAdEntitlement(value));checks++;}
check(JSON.stringify(parseAdEntitlement({...paid,userId:'SYNTHETIC',token:'SYNTHETIC'}))===JSON.stringify(paid),'Only coarse entitlement leaves the parser');

// Route integration uses actual GET with fake actor/database. Never import Stripe.
let row=active,dbError=null,authError=null,actorCalls=0,selected='',owner='';
class SpeechError extends Error{constructor(status,message){super(message);this.status=status}}
const server={SpeechError,actor:async()=>{actorCalls++;if(authError)throw authError;return {user:{id:'fixture-owner'},db:{from(name){assert.equal(name,'speech_accounts');return{select(fields){selected=fields;return{eq(field,value){assert.equal(field,'user_id');owner=value;return{maybeSingle:async()=>({data:row,error:dbError})}}}}}}}}},
 response:(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow'}}),
 failure:error=>Response.json({error:'Unavailable'},{status:error.status||503})};
const {GET}=load('src/app/api/speech/ad-entitlement/route.ts',{'@/lib/speech/server':server});
const originalNow=Date.now;Date.now=()=>now;
try{
 for(const [input,expected]of [[active,true],[{...active,subscription_active:false},false],[null,false]]){
  row=input;const res=await GET(new Request('https://fixture.invalid/api/speech/ad-entitlement',{headers:{Authorization:'Bearer SYNTHETIC'}}));
  assert.deepEqual(await res.json(),{version:'speech-ad-v1',audience:'verified_session',adFree:expected});checks++;
  check(res.headers.get('cache-control')==='private, no-store','No shared cache for personal eligibility');
 }
 check(selected==='subscription_active,period_start,period_end'&&owner==='fixture-owner','Authenticated owner only; no history, email, quota or payment query');
 const before=actorCalls;const res=await GET(new Request('https://fixture.invalid/api/speech/ad-entitlement?paid=1&checkout=success'));
 assert.deepEqual(await res.json(),guest);checks++;check(actorCalls===before,'Signed-out does not create an account or consult payment history');
 authError=new SpeechError(401,'Invalid');check((await GET(new Request('https://fixture.invalid/api/speech/ad-entitlement',{headers:{Authorization:'Bearer invalid'}}))).status===401,'Invalid supplied token never becomes anonymous free');authError=null;
 dbError=Error('fixture');check((await GET(new Request('https://fixture.invalid/api/speech/ad-entitlement',{headers:{Authorization:'Bearer SYNTHETIC'}}))).status===503,'DB failure is unknown, never free');dbError=null;
 row={...active,period_end:'invalid'};check((await GET(new Request('https://fixture.invalid/api/speech/ad-entitlement',{headers:{Authorization:'Bearer SYNTHETIC'}}))).status===503,'Malformed active billing period fails closed');
}finally{Date.now=originalNow;}

const fixture=(query,timeoutMs=100)=>{let retired=0;const states=[];const gate=createSpeechAdGate({query,changed:state=>states.push(state),retire:()=>retired++,timeoutMs});return{gate,states,retired:()=>retired}};
for(const value of [paid,free,guest]){
 const f=fixture(async()=>value);check(!f.gate.begin()&&!f.gate.mayRequest(),'Pending never begins an SDK');await f.gate.refresh();
 check(f.gate.state===(value.adFree?'paid':'free'),'Server decides eligibility');
 check(f.gate.begin()===!value.adFree,'Only confirmed free starts');check(!f.gate.begin(),'No duplicate start');f.gate.dispose();
}
for(const invalid of [null,{},new Error('offline')]){
 const f=fixture(async()=>{if(invalid instanceof Error)throw invalid;return invalid});await f.gate.refresh();check(f.gate.state==='unavailable'&&!f.gate.begin(),'Error/malformed stays off');f.gate.dispose();
}
let release;const pending=fixture(()=>new Promise(r=>release=r));const wait=pending.gate.refresh();check(!pending.gate.begin(),'Slow request stays off');release(free);await wait;check(pending.gate.begin(),'Free starts after completed response');pending.gate.dispose();
let state=free;const changing=fixture(async()=>state);await changing.gate.refresh();changing.gate.begin();state=paid;await changing.gate.refresh();check(changing.retired()===1&&!changing.gate.mayRequest(),'Paid change disposes owning ad document');state=free;await changing.gate.refresh();check(!changing.gate.begin()&&changing.retired()===1,'No paid/free auto-refresh loop in retired document');changing.gate.dispose();check(changing.retired()===1,'Retirement is idempotent');
for(const action of ['invalidateIdentity','dispose']){const f=fixture(async()=>free);await f.gate.refresh();f.gate.begin();f.gate[action]();check(f.retired()===1&&!f.gate.mayRequest(),'Login/logout/unmount invalidates loaded runtime');f.gate.dispose();}
let late;const race=fixture(()=>new Promise(r=>late=r));const old=race.gate.refresh();race.gate.invalidateIdentity();late(free);await old;check(!race.gate.begin()&&race.gate.state==='pending','Stale previous-account result cannot grant access');race.gate.dispose();
const timeout=fixture(()=>new Promise(()=>{}),5);void timeout.gate.refresh();await new Promise(r=>setTimeout(r,20));check(timeout.gate.state==='unavailable'&&!timeout.gate.begin(),'Timeout is fail-closed even when query ignores abort');timeout.gate.dispose();
let reject=false;const lost=fixture(async()=>{if(reject)throw Error('offline');return free});await lost.gate.refresh();lost.gate.begin();reject=true;await lost.gate.refresh();check(lost.retired()===1,'Failed recheck retires a started runtime');lost.gate.dispose();
const recheck=fixture(async()=>free);await recheck.gate.refresh();recheck.gate.begin();recheck.gate.suspend();check(!recheck.gate.mayRequest(),'Auth event suspends permission synchronously');await recheck.gate.refresh();check(recheck.gate.mayRequest()&&!recheck.gate.begin()&&recheck.retired()===0,'Same-identity free recheck permits existing request without another SDK');recheck.gate.dispose();

// Client GET contract: no signup, no checkout/history endpoint, no client-paid flag.
const originalFetch=globalThis.fetch;let calls=0,requestOptions;
try{
 globalThis.fetch=async(url,options)=>{calls++;assert.equal(url,'/api/speech/ad-entitlement');requestOptions=options;return Response.json(free)};
 const auth={getSession:async()=>({data:{session:{access_token:'SYNTHETIC',user:{id:'fixture'}}},error:null})};
 assert.deepEqual(await readSpeechAdEntitlement(auth,new AbortController().signal),free);checks++;
 check(requestOptions.headers.Authorization==='Bearer SYNTHETIC'&&requestOptions.cache==='no-store'&&requestOptions.credentials==='omit'&&requestOptions.redirect==='error','Private same-origin bearer request, not a public ad payload');
 const before=calls;await assert.rejects(()=>readSpeechAdEntitlement({getSession:async()=>({data:{session:null},error:Error('session')})},new AbortController().signal));checks++;check(calls===before,'Session lookup failure never queries as guest');
 await assert.rejects(()=>readSpeechAdEntitlement(auth,new AbortController().signal,()=>false));checks++;check(calls===before,'Identity change blocks outgoing stale request');
 globalThis.fetch=async()=>Response.json(guest);await assert.rejects(()=>readSpeechAdEntitlement(auth,new AbortController().signal));checks++;
 globalThis.fetch=async()=>Response.json(guest);assert.deepEqual(await readSpeechAdEntitlement({getSession:async()=>({data:{session:null},error:null})},new AbortController().signal),guest);checks++;
}finally{globalThis.fetch=originalFetch;}

// One transport retry shares the owning gate's deadline. All sessions, bodies,
// timers and requests below are synthetic; no ad, auth or payment service runs.
const retryAuth={getSession:async()=>({data:{session:{access_token:'SYNTHETIC',user:{id:'fixture'}}},error:null})};
const rejectOnAbort=signal=>new Promise((resolve,reject)=>{
 if(signal.aborted)reject(new DOMException('Aborted','AbortError'));
 else signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError')),{once:true});
});
const originalSetTimeout=globalThis.setTimeout;
try{
 for(const failure of ['network',500,502,503,504]){
  let requests=0;
  globalThis.fetch=async()=>{requests++;if(requests===1){if(failure==='network')throw new TypeError('Synthetic network loss');return new Response(null,{status:failure})}return Response.json(free)};
  assert.deepEqual(await readSpeechAdEntitlement(retryAuth,new AbortController().signal),free);checks++;
  check(requests===2,'One retry recovers a transport failure: '+failure);
 }
 let exhausted=0;
 globalThis.fetch=async()=>{exhausted++;throw new TypeError('Synthetic persistent network loss')};
 await assert.rejects(()=>readSpeechAdEntitlement(retryAuth,new AbortController().signal));checks++;
 check(exhausted===2,'Persistent network loss stops after two attempts');
 for(const status of [400,401,403,404,429,501,505]){
  let requests=0;globalThis.fetch=async()=>{requests++;return new Response(null,{status})};
  await assert.rejects(()=>readSpeechAdEntitlement(retryAuth,new AbortController().signal));checks++;
  check(requests===1,'Non-recoverable HTTP rejection does not retry: '+status);
 }
 for(const body of [paid,guest,{...free,version:'invalid'},null,'invalid-json','type-error-json']){
  let requests=0;globalThis.fetch=async()=>{
   requests++;
   if(body==='type-error-json')return{ok:true,json:async()=>{throw new TypeError('Synthetic body decoding failure')}};
   return body==='invalid-json'?new Response('{'):Response.json(body);
  };
  if(body===paid){assert.deepEqual(await readSpeechAdEntitlement(retryAuth,new AbortController().signal),paid);checks++;}
  else{await assert.rejects(()=>readSpeechAdEntitlement(retryAuth,new AbortController().signal));checks++;}
  check(requests===1,'Paid, malformed or wrong-audience responses do not retry');
 }
 let requests=0,sessionReads=0;
 globalThis.fetch=async()=>{requests++;throw new TypeError('Synthetic network loss')};
 const switched={getSession:async()=>({data:{session:{access_token:'SYNTHETIC',user:{id:++sessionReads===1?'first':'second'}}},error:null})};
 await assert.rejects(()=>readSpeechAdEntitlement(switched,new AbortController().signal),/identity_changed/);checks++;
 check(requests===1&&sessionReads===2,'A retry rechecks auth and rejects a changed identity without another request');
 let accepts=0;requests=0;
 await assert.rejects(()=>readSpeechAdEntitlement(retryAuth,new AbortController().signal,()=>++accepts===1),/identity_changed/);checks++;
 check(requests===1&&accepts===2,'Identity observer can veto the retry even when session identity is unchanged');

 const preAborted=new AbortController();preAborted.abort();requests=0;
 await assert.rejects(()=>readSpeechAdEntitlement(retryAuth,preAborted.signal));checks++;
 check(requests===0,'A parent signal already aborted cannot start a request');
 const aborted=new AbortController();requests=0;
 globalThis.fetch=async(url,options)=>{requests++;const waiting=rejectOnAbort(options.signal);aborted.abort();return waiting};
 await assert.rejects(()=>readSpeechAdEntitlement(retryAuth,aborted.signal));checks++;
 check(requests===1,'Parent abort terminates the first request and prevents a retry');
 const between=new AbortController();requests=0;sessionReads=0;
 globalThis.fetch=async()=>{requests++;throw new TypeError('Synthetic network loss')};
 const abortingAuth={getSession:async()=>{if(++sessionReads===2)between.abort();return retryAuth.getSession()}};
 await assert.rejects(()=>readSpeechAdEntitlement(abortingAuth,between.signal));checks++;
 check(requests===1,'Parent abort during retry auth prevents the second request');
 const lateAbort=new AbortController();requests=0;
 globalThis.fetch=async()=>{requests++;lateAbort.abort();return Response.json(free)};
 await assert.rejects(()=>readSpeechAdEntitlement(retryAuth,lateAbort.signal));checks++;
 check(requests===1,'A late free response after parent abort cannot grant eligibility');

 // Accelerate only production deadlines, while recording their original values.
 const deadlines=[];let slowSecond=false,attemptDeadlines=0,gateDeadlineFires=0;
 globalThis.setTimeout=(callback,ms,...args)=>{
  deadlines.push(ms);
  const delay=ms===3500?(slowSecond&&++attemptDeadlines===2?100:5):ms===8000?18:ms;
  return originalSetTimeout(()=>{if(ms===8000)gateDeadlineFires++;callback(...args)},delay);
 };
 requests=0;
 globalThis.fetch=async(url,options)=>{requests++;return requests===1?rejectOnAbort(options.signal):Response.json(free)};
 assert.deepEqual(await readSpeechAdEntitlement(retryAuth,new AbortController().signal),free);checks++;
 check(requests===2&&deadlines[0]===3500,'Short first transport timeout permits exactly one recovery attempt');

 let transportFailure=false;requests=0;deadlines.length=0;
 globalThis.fetch=async(url,options)=>{requests++;return transportFailure?rejectOnAbort(options.signal):Response.json(free)};
 let retirements=0;const states=[];
 const bounded=createSpeechAdGate({query:signal=>readSpeechAdEntitlement(retryAuth,signal),changed:state=>states.push(state),retire:()=>retirements++});
 await bounded.refresh();check(bounded.begin(),'Confirmed free starts the runtime before the renewal fixture');
 transportFailure=true;slowSecond=true;attemptDeadlines=0;await bounded.refresh();
 check(retirements===1&&bounded.state==='retired'&&!bounded.mayRequest(),'Failed retry retires a loaded runtime without cached free permission');
 check(requests===3,'Renewal exhaustion uses no more than two requests');
 check(deadlines.filter(ms=>ms===8000).length===2,'Retries never restart or extend the gate eight-second deadline');
 check(gateDeadlineFires===1,'Original parent deadline aborts an unfinished second request');
 bounded.dispose();check(retirements===1,'Exhausted renewal retirement remains idempotent');
}finally{globalThis.fetch=originalFetch;globalThis.setTimeout=originalSetTimeout;}
console.log(`PASS ${checks} paid entitlement, route, identity, bounded retry, timeout and lifecycle assertions; no external calls.`);
