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
console.log(`PASS ${checks} paid entitlement, route, identity, timeout and lifecycle assertions; no external calls.`);
