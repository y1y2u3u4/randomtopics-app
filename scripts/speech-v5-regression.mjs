import assert from 'node:assert/strict';
import {load} from './lib/load-typescript.mjs';
const coach=load('src/lib/speech/coaching.ts');
const {validateFeedback}=load('src/lib/speech/schema.ts');
const server=load('src/lib/speech/server.ts');
const text='A short walk helps me reset. Yesterday I walked beside the river after work. I returned feeling ready for the evening.';
const met={status:'met',quote:'A short walk helps me reset.',explanation:'You state what a walk changes.'};
const assessment={relevance:met,point:met,example:{...met,quote:'Yesterday I walked beside the river after work.'},ending:{...met,quote:'I returned feeling ready for the evening.'}};
assert.equal(coach.selectFocus(assessment),'concise','A complete answer is not forced to have a fault');
assert.equal(coach.selectFocus({...assessment,relevance:{...met,status:'partial'},example:{...met,status:'missing'}}),'relevance');
assert.equal(coach.selectFocus({...assessment,point:{...met,status:'partial'},example:{...met,status:'missing'}}),'example','Missing essentials take priority over optional polish');
const before=validateFeedback(coach.assembleFeedback({assessment:{...assessment,example:{status:'missing',quote:'',explanation:'There is no scene.'}}},text),text);
const focus={status:'met',quote:'Yesterday I walked beside the river after work.',explanation:'You give a specific scene.'};
const comparison={outcome:'improved',beforeQuote:'',afterQuote:focus.quote,explanation:'A scene now supports the point.'};
const after=validateFeedback(coach.assembleFeedback({focus,comparison},text,before,true),text,text,before);
assert.equal(after.assessment.point.status,'not_assessed','A focused example must not be penalized for a missing introduction');
assert.equal(after.drill.kind,'refine');
assert.throws(()=>validateFeedback(after,text,text,{...before,assessment:{...assessment}}),/missing_comparison_evidence/,'Absent before quotes require saved evidence that the goal was missing');
assert.throws(()=>coach.assembleFeedback({assessment:{...assessment,point:{...met,quote:'Never said this'}}},text),/ungrounded_quote/);
assert.throws(()=>coach.assembleFeedback({assessment:{...assessment,point:{...met,quote:''}}},text),/missing_assessment_evidence/);

const id='6c9f1062-e17e-41df-a5da-ae87db04336f';
const originalFeedback=validateFeedback(coach.assembleFeedback({assessment},text),text);
async function routeTest({revise=false,inputText=text,fail=false,feedbackCalls=1,missing=false,claim=false}={}) {
 let record={id,user_id:'owner',status:'complete',transcript:text,feedback:originalFeedback,feedback_calls:feedbackCalls,topic:'Why take a walk?',usage:{context:{version:'v5',qa:true},feedback:{tokens:5}},duration:20};
 const calls=[],updates=[];let models=0;
 const db={rpc:async(name,props)=>{calls.push({name,props}); if(claim||record.feedback_calls>=3)return{data:false,error:{message:'invalid_state'}};
  record={...record,status:'processing',transcript:props.p_transcript,feedback_calls:record.feedback_calls+1};return{data:true,error:null};},from:()=>{
  let writing;const filters=[];return{select(){return this;},is(k,v){filters.push([k,v]);return this;},eq(k,v){filters.push([k,v]);return this;},update(value){writing=value;updates.push(value);return this;},
   async single(){assert.ok(filters.some(([k,v])=>k==='user_id'&&v==='owner'));if(missing)return{data:null,error:{message:'not_found'}};
    if(writing)record={...record,...writing};return{data:{...record},error:null};},
   then(resolve){if(writing)record={...record,...writing};resolve({error:null});},
  };}};
 const route=load('src/app/api/speech/feedback/route.ts',{
  '@/lib/speech/server':{...server,actor:async()=>({db,user:{id:'owner'}}),modelCall:async()=>{models++;if(fail)throw new server.SpeechError(503,'Unavailable');return{value:{assessment},usage:{tokens:8},model:'synthetic'};}},
  '@/lib/speech/allowance':{speechAllowance:async()=>({remaining:1,included:2,paid:false})},
 });
 const response=await route.POST(new Request('https://example.test/api/speech/feedback',{method:'POST',body:JSON.stringify({id,transcript:inputText,revise})}));
 return{status:response.status,body:await response.json(),record,calls,updates,models};
}
let r=await routeTest({inputText:text+' Additional sentence.'});
assert.equal(r.status,200);assert.equal(r.models,0);assert.equal(r.body.transcript,text,'Completed feedback only changes on explicit revision');
r=await routeTest({revise:true});assert.equal(r.models,0,'Unchanged correction is idempotent');
r=await routeTest({revise:true,inputText:text+' Additional sentence.'});
assert.equal(r.status,200);assert.equal(r.models,1);assert.equal(r.calls[0].name,'claim_speech_feedback_v5');assert.equal(r.calls[0].props.p_revision,true);
assert.equal(r.body.correctionsRemaining,1);assert.equal(r.record.usage.context.qa,true);assert.deepEqual(r.record.usage.earlierFeedbackUsage,[{tokens:5}]);
r=await routeTest({revise:true,inputText:text+' Additional sentence.',fail:true});
assert.equal(r.status,503);assert.equal(r.record.status,'complete');assert.equal(r.record.transcript,text);assert.deepEqual(r.record.feedback,originalFeedback,'Failed corrections preserve the last usable result');
r=await routeTest({revise:true,inputText:text+' Additional sentence.',feedbackCalls:3});assert.equal(r.status,409);assert.equal(r.models,0);
r=await routeTest({revise:true,inputText:text+' Additional sentence.',claim:true});assert.equal(r.status,409);assert.equal(r.models,0);
r=await routeTest({missing:true});assert.equal(r.status,404);assert.equal(r.models,0);

const {summarizeSpeechAttempts}=load('src/lib/speech/serverReport.ts');
const row=(id,extra={})=>({id,user_id:'a',previous_id:null,status:'complete',created_at:'2026-09-21T10:00:00Z',usage:{context:{version:'v5',qa:false}},...extra});
const report=summarizeSpeechAttempts([row('first'),row('repeat',{previous_id:'first',created_at:'2026-09-21T10:01:00Z'}),row('qa',{usage:{context:{version:'v5',qa:true}}}),row('legacy',{usage:{}}),row('pending',{user_id:'b',status:'transcribed'}),row('other-owner',{user_id:'c',previous_id:'pending'})]);
assert.equal(report.attempts,4);assert.equal(report.qa,1);assert.equal(report.unclassified,1);assert.equal(report.firstComplete,1);assert.equal(report.firstWithCompletedRetry,1);assert.equal(report.pending,1);
assert.ok(!JSON.stringify(report).includes('user_id'));
console.log('PASS: v5 coaching priorities, focused evidence, explicit correction/idempotency/recovery, ownership/claim limits and QA-separated aggregates.');
