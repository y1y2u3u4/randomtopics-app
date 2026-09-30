// Local Chrome fixtures for actual result/plan components. No accounts, speech,
// email, Checkout or external requests. Run the printed URL in connected Chrome.
import {createRequire} from 'node:module';
import {readFileSync,writeFileSync,mkdtempSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {tmpdir} from 'node:os';
import {createServer} from 'node:http';
const require=createRequire(import.meta.url),root=resolve(import.meta.dirname,'..'),temp=mkdtempSync(join(tmpdir(),'speech-plan-browser-'));
const put=(name,value)=>{const p=join(temp,name);writeFileSync(p,value);return p;};
const loader=put('loader.cjs',`const ts=require(${JSON.stringify(require.resolve('typescript'))});module.exports=s=>ts.transpileModule(s,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText;`);
const link=put('link.tsx',`export default function Link({href,children,onClick,...p}){return <a href={href} {...p} onClick={e=>{e.preventDefault();onClick?.(e);document.getElementById('destination').textContent=href}}>{children}</a>}`);
const client=put('client.ts',`export const fixture={billing:true};export async function speechBillingAvailable(){return fixture.billing;}`);
const entry=put('entry.tsx',`
import React,{act} from 'react';import {createRoot} from 'react-dom/client';
import Teaser from '@/components/SpeechPlanTeaser';import PlanLink from '@/components/SpeechPlanLink';import Result from '@/components/SpeechFeedbackResult';
import {fixture} from '@/lib/speech/client';import {readCheckoutIntent,clearCheckoutIntent} from '@/lib/speech/checkoutIntent';
window.IS_REACT_ACT_ENVIRONMENT=true;
const host=document.getElementById('preview'),out=document.getElementById('results'),root=createRoot(host),events=[],observers=[];
let key=0;const NativeObserver=window.IntersectionObserver;
window.addEventListener('rt:analytics',e=>events.push(e.detail));
class Observer {constructor(cb){this.cb=cb;observers.push(this)}observe(el){this.el=el}disconnect(){this.el=null}}
const check=(v,m)=>{if(!v)throw Error(m)},count=n=>events.filter(e=>e.event==='qa_'+n).length;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const fire=(el,ratio)=>{for(const o of observers)if(o.el===el)o.cb([{isIntersecting:ratio>0,intersectionRatio:ratio}]);};
const render=async(mode='full',visible=true,remount=true)=>{if(remount)key++;await act(async()=>root.render(mode==='quota'?<PlanLink key={key} surface='quota' attempt={2} contentSource='speech_hub' visible={visible} href='/speech/account#speech-plan' className='min-h-11 p-3'>View allowance and practice plan</PlanLink>:<Teaser key={key} attempt={mode==='hint'?1:2} contentSource='speech_hub' visible={visible} compact={mode==='hint'} focusLabel='a clear opening'/>));};
const fresh=async(mode='full',visible=true)=>{fixture.billing=true;events.length=0;observers.length=0;clearCheckoutIntent();await render(mode,visible)};
const results=[];const test=async(name,fn)=>{try{await fn();results.push({name,pass:true})}catch(e){results.push({name,pass:false,error:e.message})}out.textContent=JSON.stringify(results,null,2)};
const feedback={assessment:{point:{status:'met',quote:'A pause helps me speak clearly.',explanation:'Your point is clear.'}},strength:{observation:'Your example supports your point.',quote:'I pause to choose my words.'},priority:{observation:'Put the main point first.',quote:'I pause to choose my words.',nextStep:'Start with your main point.'},structure:{opening:'A clear opening.',body:'A specific example.',closing:'Returns to the point.'},comparison:{outcome:'improved',explanation:'In this synthetic example, the second answer puts the point first.',beforeQuote:'I pause to choose my words.',afterQuote:'A pause helps me speak clearly.'},drill:{kind:'refine',target:'point',instruction:'Say your point in one sentence.',starter:'My point is…',successCriterion:'The point comes first.'}};
const showResult=async(paid=false,repeated=true)=>{fixture.billing=true;window.IntersectionObserver=NativeObserver;await act(async()=>root.render(<Result key={++key} result={{id:'local-fixture',transcript:'Synthetic local example only.',feedback,duration:20,allowance:{paid,included:paid?40:2,remaining:repeated?0:1}}} repeated={repeated} visible contentSource='speech_hub' onRetry={()=>showResult(false,true)} onCorrect={()=>{}}/>));};
document.getElementById('run').onclick=async()=>{
 document.getElementById('run').disabled=true;window.IntersectionObserver=Observer;results.length=0;
 await test('Hidden panel emits no view',async()=>{await fresh('full',false);for(const o of observers)if(o.el)fire(o.el,1);await sleep(1050);check(!events.length,'Hidden content is not an impression')});
 await test('Card visibility never substitutes for button visibility',async()=>{await fresh();fire(host.querySelector('section'),1);await sleep(1050);check(count('speech_plan_v2_view')===1&&count('speech_plan_v2_action_view')===0,'Only the card was visible')});
 await test('Button requires continuous one-second foreground visibility and deduplicates',async()=>{await fresh();const a=host.querySelector('a');fire(a,.49);await sleep(1050);check(count('speech_plan_v2_action_view')===0,'A sliver is not a view');fire(a,1);await sleep(550);fire(a,0);await sleep(550);check(count('speech_plan_v2_action_view')===0,'Interrupted exposure is not a view');fire(a,1);await sleep(1050);check(count('speech_plan_v2_action_view')===1,'Qualified link view');await render('full',false,false);await render('full',true,false);fire(a,1);await sleep(1050);check(count('speech_plan_v2_action_view')===1,'Reopen does not double count')});
 await test('Fast plan click preserves QA intent without fabricating exposure',async()=>{await fresh();await act(async()=>host.querySelector('a').click());check(count('speech_plan_v2_click')===1&&count('speech_plan_click')===1&&count('speech_plan_v2_action_view')===0,'Version and compatibility clicks only');check(readCheckoutIntent()?.qa===true,'QA intent persists for account navigation');check(document.getElementById('destination').textContent.includes('/speech/account'),'Plan navigation remains available')});
 await test('Compact hint is separate from full-plan events',async()=>{await fresh('hint');const a=host.querySelector('a');fire(a,1);await sleep(1050);await act(async()=>a.click());check(count('speech_plan_hint_action_view')===1&&count('speech_plan_hint_click')===1&&count('speech_plan_v2_click')===0,'Separate compact surface');check(!host.querySelector('[aria-label="Optional practice plan feedback"]'),'No question before the free retry')});
 await test('Quota link measures intent and keeps allowance destination',async()=>{await fresh('quota');const a=host.querySelector('a');fire(a,1);await sleep(1050);await act(async()=>a.click());check(count('speech_quota_plan_view')===1&&count('speech_quota_plan_click')===1,'Quota action measured');check(document.getElementById('destination').textContent==='/speech/account#speech-plan','Allowance destination preserved')});
 await test('Optional reason uses one click, excludes silence, deduplicates and preserves purchase',async()=>{await fresh();const question=host.querySelector('[aria-label="Optional practice plan feedback"] p');fire(question,1);await sleep(1050);check(count('speech_plan_need_view')===1&&count('speech_plan_need_select')===0,'Silence is unknown');const b=[...host.querySelectorAll('button')].find(b=>b.textContent.includes('subscription'));await act(async()=>{b.click();b.click()});check(count('speech_plan_need_select')===1&&count('speech_plan_need_subscription')===1,'One closed reason');check(host.textContent.includes('Thanks for sharing.')&&host.querySelector('a'),'No navigation or purchase blocked');check(events.every(e=>e.event.startsWith('qa_')),'Every event stays QA');check(!JSON.stringify(events).includes('local-fixture'),'No practice identifier')});
 await test('Unavailable billing renders no purchase controls or reasons',async()=>{fixture.billing=false;events.length=0;await render();check(!host.querySelector('a')&&!host.querySelector('button')&&!events.length,'Closed billing stays closed')});
 await test('Warm-up result measures real visibility without borrowing timer attribution',async()=>{
  fixture.billing=true;events.length=0;observers.length=0;window.IntersectionObserver=Observer;
  const draw=async(repeated,visible=true,remount=true)=>{if(remount)key++;await act(async()=>root.render(<Result key={key} result={{id:'local-warmup',transcript:'Synthetic only.',feedback,duration:20,allowance:{paid:false,included:2,remaining:repeated?0:1}}} repeated={repeated} visible={visible} contentSource='speech_hub' fromWarmup onRetry={()=>{}} onCorrect={()=>{}}/>));};
  await draw(false,false);fire(host.querySelector('h4'),1);await sleep(1050);check(count('speech_warmup_feedback_view')===0,'Hidden result is not a conversion');
  await draw(false,true,false);fire(host.querySelector('h4'),1);await sleep(1050);check(count('speech_warmup_feedback_view')===1&&count('speech_timer_feedback_view')===0,'Visible warm-up result belongs only to warm-up cohort');
  await draw(true);fire(host.querySelector('h4'),1);await sleep(1050);check(count('speech_warmup_feedback_view')===1&&count('speech_warmup_retry_view')===1,'Retry does not masquerade as a new first feedback');
  check(events.every(e=>e.event.startsWith('qa_'))&&!JSON.stringify(events).includes('local-warmup'),'No identifier or natural events from QA');
 });
 await test('First result foregrounds real evidence and one goal-specific retry',async()=>{
  await showResult(false,false);const quote=[...host.querySelectorAll('section[aria-label="Your feedback"] > div blockquote')].find(el=>el.textContent.includes(feedback.priority.quote));
  check(quote?.textContent.includes(feedback.priority.quote)&&!quote.closest('details'),'Evidence is visible before opening details');
  check([...host.querySelectorAll('button')].some(b=>b.textContent.includes('Try a clearer point')),'Action names the goal');
  const action=[...host.querySelectorAll('button')].find(b=>b.textContent.includes('Try a clearer point'));
  check(action.compareDocumentPosition(quote)&Node.DOCUMENT_POSITION_FOLLOWING,'Short retry action precedes the longer evidence passage');
  check(!host.querySelector('[aria-label="Your next round"]'),'First answer offers its retry before another topic');
 });
 await test('First retry eligibility measures the available action without depending on heading order',async()=>{
  events.length=0;observers.length=0;window.IntersectionObserver=Observer;
  const draw=async remaining=>act(async()=>root.render(<Result key={++key} result={{id:'11111111-1111-4111-8111-111111111111',transcript:'Synthetic only.',feedback,duration:20,allowance:{paid:false,included:2,remaining}}} repeated={false} visible contentSource='speech_hub' onRetry={()=>{}} onCorrect={()=>{}}/>));
  await draw(1);const b=[...host.querySelectorAll('button')].find(b=>b.textContent.includes('Try a clearer point'));fire(b,1);await sleep(1050);
  check(count('speech_first_retry_action_view')===1&&count('speech_round_suggestion_view')===0,'Action cohort does not require an earlier heading view');
  await act(async()=>b.click());check(count('speech_first_retry_click')===1,'First retry distinguished from later practice');
  await draw(0);check(![...host.querySelectorAll('button')].some(b=>b.textContent.includes('Try a clearer point')),'No retry action at zero allowance');
  fire(host.querySelector('h4'),1);await sleep(1050);check(count('speech_first_retry_unavailable_view')===1&&count('speech_first_retry_action_view')===1,'Unavailable results do not inflate the available-button denominator');
  const plan=host.querySelector('a[href*="plan=monthly"]');await act(async()=>plan.click());check(readCheckoutIntent()?.attemptId==='11111111-1111-4111-8111-111111111111','Owned reference is passed to account navigation');
  check(!JSON.stringify(events).includes('11111111-1111-4111-8111-111111111111'),'Reference never enters speech telemetry');
 });
 await test('Next round is actionable, preserves source, and never fabricates an exposure on click',async()=>{
  events.length=0;observers.length=0;window.IntersectionObserver=Observer;
  await act(async()=>root.render(<Result key={++key} result={{id:'local-goal',transcript:'Synthetic local example.',feedback,duration:20,allowance:{paid:true,included:40,remaining:3}}} repeated visible contentSource='speech_hub' onRetry={()=>{}} onCorrect={()=>{}}/>));
  const a=host.querySelector('[aria-label="Your next round"] a');check(a?.textContent.includes('new topic'),'Achieved goal leads to another topic');
  await act(async()=>a.click());check(document.getElementById('destination').textContent==='/speech/practice?attempt=local-goal&next=1','Source round travels in the owned history link');
  check(count('speech_round_next_click')===1&&count('speech_round_next_view')===0,'Fast navigation does not fabricate an impression');
  check(!JSON.stringify(events).includes('local-goal'),'Analytics omits the saved attempt identifier');
 });
 await test('Unhelpful feedback removes the pitch and opens existing evidence without a new request',async()=>{
  await showResult(false,true);const find=t=>[...host.querySelectorAll('button')].find(b=>b.textContent.trim()===t);
  await act(async()=>find('Not yet').click());check(!host.querySelector('[aria-label="Keep practicing"]')&&!host.querySelector('[aria-label="Your next round"]'),'Recovery precedes purchasing');
  await act(async()=>find('I don’t know how to apply it').click());check(host.querySelector('[aria-label="Check this feedback"]').textContent.includes(feedback.drill.starter),'Concrete frame remains available even after successful comparison');
  await act(async()=>find('Check my transcript and evidence').click());check(host.querySelector('details').open,'Saved evidence opens without regeneration');
  check(host.textContent.includes('No feedback corrections remain'),'Never promise an exhausted correction');
 });
 await test('Insufficient evidence asks for review before recording or purchase',async()=>{
  await act(async()=>root.render(<Result key={++key} result={{id:'uncertain',transcript:'Synthetic uncertain words.',feedback:{...feedback,comparison:{...feedback.comparison,outcome:'insufficient_evidence'}},duration:20,allowance:{paid:false,included:2,remaining:1}}} repeated visible contentSource='speech_hub' onRetry={()=>{throw Error('Must review first')}} onCorrect={()=>{}}/>));
  check(!host.querySelector('[aria-label="Keep practicing"]')&&!host.querySelector('[aria-label="More speech practice"]'),'No purchase for uncertain evidence');
  const b=[...host.querySelectorAll('button')].find(b=>b.textContent==='Check the evidence');await act(async()=>b.click());check(host.querySelector('details').open,'Evidence opens first');
  check(host.querySelector('[aria-current="step"]').textContent.includes('Compare answers'),'Honest comparison is still the final round step');
 });
 await test('Habit goal explains the next check and carries purpose to purchase without another call',async()=>{
  events.length=0;window.IntersectionObserver=Observer;
  await act(async()=>root.render(<Result key={++key} result={{id:'11111111-1111-4111-8111-111111111111',purpose:'habit',transcript:'Synthetic only.',feedback,duration:20,allowance:{paid:false,included:2,remaining:0}}} repeated visible contentSource='speech_hub' onRetry={()=>{}} onCorrect={()=>{}}/>));
  check(host.textContent.includes('without copying the sentence frame')&&host.textContent.includes(feedback.drill.successCriterion),'Specific next goal, not a promise of lasting mastery');
  const plan=host.querySelector('a[href*="plan=monthly"]');await act(async()=>plan.click());check(readCheckoutIntent()?.purpose==='habit','Owned purpose carries to email and purchase');check(count('speech_goal_habit_plan')===1&&count('speech_goal_habit_offer')===0,'Fast plan action belongs to its purpose without fabricating exposure');
  fire(plan,1);await sleep(1050);check(count('speech_goal_habit_offer')===1,'Qualified plan button exposure belongs to the same purpose');
 });
 await test('One-talk achieved goal permits finishing and keeps recurring terms explicit',async()=>{
  await act(async()=>root.render(<Result key={++key} result={{id:'one-talk',purpose:'once',transcript:'Synthetic only.',feedback,duration:20,allowance:{paid:false,included:2,remaining:0}}} repeated visible contentSource='speech_hub' onRetry={()=>{}} onCorrect={()=>{}}/>));
  check(host.textContent.includes('you can finish here')&&host.textContent.includes('Renews monthly'),'No invented need or misleading one-off offer');
  check([...host.querySelectorAll('button')].some(b=>b.textContent==='Done for now'),'Finishing remains possible');
 });
 await test('Need reasons distinguish task completion from more practice without subscription',async()=>{
  events.length=0;await fresh();const b=[...host.querySelectorAll('button')].find(b=>b.textContent==='I finished what I came to do');await act(async()=>b.click());
  check(count('speech_plan_need_done')===1&&count('speech_plan_need_subscription')===0&&count('speech_plan_reason_once')===0,'New definition never rewrites historical reasons');
  check(host.textContent.includes('finish here without subscribing'),'Task completion gets a useful response');
 });
 await test('Unproven value opens existing evidence for review without a new model request',async()=>{
  await showResult(false,true);const b=[...host.querySelectorAll('button')].find(b=>b.textContent==='I don’t yet see a useful change');await act(async()=>b.click());
  const review=[...host.querySelectorAll('button')].find(b=>b.textContent==='Review my evidence');check(review,'Useful recovery after value reason');await act(async()=>review.click());check(host.querySelector('details').open,'Evidence opens locally');
 });
 await test('Existing paid accounts are never offered another subscription',async()=>{await showResult(true,true);check(!host.querySelector('[aria-label="Keep practicing"]')&&!host.querySelector('[aria-label="Optional practice plan feedback"]'),'Paid result has no offer');check(host.textContent.includes('renewal date'),'Existing account path remains')});
 document.getElementById('summary').textContent=results.filter(r=>r.pass).length+'/'+results.length+' passed';
 await showResult();document.getElementById('run').disabled=false;
};
document.getElementById('first').onclick=()=>showResult(false,false);document.getElementById('repeat').onclick=()=>showResult();
await showResult();
`);
const {webpack}=require('next/dist/compiled/webpack/webpack');
await new Promise((ok,fail)=>webpack({mode:'development',devtool:false,entry,output:{path:temp,filename:'bundle.js'},resolve:{extensions:['.tsx','.ts','.js'],modules:[resolve(root,'node_modules')],alias:{'next/link':link,'@/lib/speech/client':client,'@':resolve(root,'src')}},module:{rules:[{test:/\.tsx?$/,use:loader}]}},(e,s)=>e||s.hasErrors()?fail(e||Error(s.toString({all:false,errors:true}))):ok()));
const css=await require('postcss')([require('@tailwindcss/postcss')({base:root})]).process(readFileSync(resolve(root,'src/app/globals.css'),'utf8'),{from:resolve(root,'src/app/globals.css')});put('styles.css',css.css);
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/styles.css"><title>Speech paid plan · local fixtures</title><body style="max-width:760px;margin:auto;padding:20px"><h1>Paid plan · synthetic local example</h1><p>No speech, account, email or payment requests.</p><div class="my-4 flex gap-4"><button id="run">Run regression</button><button id="first">Show first result</button><button id="repeat">Show retry result</button></div><strong id="summary"></strong><details><summary>Regression evidence</summary><pre id="results" style="white-space:pre-wrap"></pre><p id="destination"></p></details><main id="preview" class="my-5"></main><script src="/bundle.js"></script></body></html>`;
createServer((req,res)=>{if(req.url?.startsWith('/styles.css')){res.setHeader('Content-Type','text/css');res.end(readFileSync(join(temp,'styles.css')))}else if(req.url?.startsWith('/bundle.js')){res.setHeader('Content-Type','application/javascript');res.end(readFileSync(join(temp,'bundle.js')))}else if(req.url?.split('?')[0]==='/mobile'){res.setHeader('Content-Type','text/html');res.end('<html><title>390px round preview</title><body style="background:#111;color:white"><p>390px responsive preview · synthetic local fixture</p><iframe title="Mobile practice" style="width:390px;height:844px;border:0" src="/?speech_qa=1"></iframe></body></html>')}else if(req.url?.split('?')[0]==='/'){res.setHeader('Content-Type','text/html');res.end(html)}else{res.statusCode=404;res.end()}}).listen(4689,'127.0.0.1',()=>console.log('Local plan fixtures: http://127.0.0.1:4689/?speech_qa=1'));
