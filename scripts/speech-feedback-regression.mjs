import assert from 'node:assert/strict';
import { z } from 'zod';
import { load } from './lib/load-typescript.mjs';
const server = load('src/lib/speech/server.ts');
const { feedbackSchema, firstFeedbackSchema, firstAttemptFeedback, validateFeedback } = load('src/lib/speech/schema.ts');
const { speechSchemaIssues } = load('src/lib/speech/diagnostics.ts');
const transcript = 'A quiet walk makes my day better. It gives me time to think before I return to work.';
const feedback = {
 strength:{quote:'A quiet walk makes my day better.',observation:'Your point is explicit.'},
 priority:{quote:'It gives me time to think',observation:'Show one concrete moment.',nextStep:'Describe one thought you resolved during the walk.'},
 structure:{point:'Explicit',example:'Add a concrete detail.',ending:'Return to your opening point.'},
 comparison:{outcome:'first_attempt',beforeQuote:'',afterQuote:'',explanation:'First attempt.'},
};
// Real-provider reproduction: blank comparison.explanation rejected a first
// answer even though there is no earlier answer to compare.
const blankFirst = {...feedback,comparison:{...feedback.comparison,explanation:''}};
assert.equal(feedbackSchema.safeParse(blankFirst).success,false);
const generatedFirst = firstAttemptFeedback(firstFeedbackSchema.parse(blankFirst));
assert.equal(validateFeedback(generatedFirst,transcript).comparison.outcome,'first_attempt');
assert.ok(generatedFirst.comparison.explanation.length>0);
assert.equal(feedbackSchema.safeParse({...blankFirst,comparison:{...blankFirst.comparison,outcome:'similar'}}).success,false,'A real comparison still requires an explanation');
assert.throws(()=>validateFeedback({...generatedFirst,strength:{...generatedFirst.strength,quote:'Invented words'}},transcript),/ungrounded_quote/);
const assessment={relevance:{status:'met',quote:'A quiet walk makes my day better.',explanation:'This addresses the question.'},point:{status:'met',quote:'A quiet walk makes my day better.',explanation:'Your point is clear.'},example:{status:'partial',quote:'It gives me time to think',explanation:'Add a specific moment.'},ending:{status:'met',quote:'before I return to work.',explanation:'You connect the walk to work.'}};
const privateMarker='PRIVATE_TRANSCRIPT_NEVER_LOG';
assert.deepEqual(speechSchemaIssues(new z.ZodError([{code:'custom',path:[privateMarker],message:privateMarker}])),[{field:'other',code:'other'}]);

const original={fetch:globalThis.fetch,error:console.error,info:console.info,now:Date.now,timeout:AbortSignal.timeout};
const logs=[],recoveries=[],requests=[],timeouts=[];
let queue=[],now=0,elapsedPerCall=0;
const provider=(value,extra={})=>new Response(JSON.stringify({choices:[{message:{content:JSON.stringify(value)},finish_reason:'stop',...extra}],usage:{total_tokens:100}}));
try {
 console.error=value=>logs.push(JSON.parse(value)); console.info=value=>recoveries.push(JSON.parse(value));
 Date.now=()=>now;
 AbortSignal.timeout=ms=>{timeouts.push(ms);return original.timeout(ms);};
 globalThis.fetch=async(url,options)=>{
  assert.equal(url,'https://openrouter.ai/api/v1/chat/completions');
  requests.push(JSON.parse(options.body)); now+=elapsedPerCall;
  const next=queue.shift(); assert.ok(next,'Unexpected extra model request'); return typeof next==='function'?next():next;
 };
 const reset=(responses,elapsed=0)=>{queue=responses;now=0;elapsedPerCall=elapsed;requests.length=0;logs.length=0;recoveries.length=0;timeouts.length=0;};
 for (const invalid of [provider(null),provider({strength:null}),new Response('invalid JSON'),provider('not an object')]) {
  reset([invalid,provider(feedback)],3000);
  const result=await server.modelCall(firstFeedbackSchema,'speech_feedback','Evaluate the transcript.',transcript);
  assert.equal(requests.length,2); assert.equal(logs[0].retrying,true); assert.equal(recoveries.length,1);
  assert.equal(result.value.strength.quote,feedback.strength.quote);
  assert.equal(result.usage.attempts.length,2,'Usage includes both calls, including unavailable usage');
  assert.deepEqual(timeouts,[45000,42000],'Recovery shares one deadline');
  assert.equal(requests[0].provider.data_collection,'deny');
  assert.equal(requests[1].provider.data_collection,'deny');
  assert.equal(requests[0].messages[1].content,requests[1].messages[1].content,'Recovery preserves the original transcript');
 }
 reset([provider(null),provider(null)]);
 await assert.rejects(()=>server.modelCall(firstFeedbackSchema,'speech_feedback','Assess.',transcript));
 assert.equal(requests.length,2); assert.deepEqual(logs.map(x=>x.retrying),[true,false]);
 assert.equal(recoveries.length,0,'Exhausted recovery is not success');
 reset([provider(null)],41000);
 await assert.rejects(()=>server.modelCall(firstFeedbackSchema,'speech_feedback','Assess.',transcript));
 assert.equal(requests.length,1,'Do not start recovery when less than five seconds remain');
 reset([provider(null,{finish_reason:'content_filter'})]);
 await assert.rejects(()=>server.modelCall(firstFeedbackSchema,'speech_feedback','Assess.',transcript));
 assert.equal(requests.length,1,'A filtered response does not trigger format recovery');
 reset([new Response('unavailable',{status:503})]);
 await assert.rejects(()=>server.modelCall(firstFeedbackSchema,'speech_feedback','Assess.',transcript));
 assert.equal(requests.length,1,'Format recovery does not duplicate arbitrary provider failures');

 const id='6c9f1062-e17e-41df-a5da-ae87db04336f';
 async function runRoute({previous=false,responses,feedbackCalls=0}) {
  reset(responses); let claims=0; const updates=[];
  const attempt={id,status:'transcribed',feedback_calls:feedbackCalls,previous_id:previous?'previous':null,topic:'What makes your day better?',usage:{transcribe:{total_tokens:5}},transcript};
  const db={rpc:async()=>{claims++;return{data:true,error:null};},from:()=>({
   writing:null,selected:'',filter:null,
   select(value){this.selected=value;return this;},eq(key,value){if(key==='id')this.filter=value;return this;},is(){return this;},
   update(value){this.writing=value;updates.push(value);return this;},
   async single(){return{data:this.writing?{...attempt,...this.writing}:this.filter==='previous'?{transcript:'Earlier speech',feedback}:attempt,error:null};},
   then(resolve){resolve({error:null});},
  })};
  const route=load('src/app/api/speech/feedback/route.ts',{'@/lib/speech/server':{...server,actor:async()=>({db,user:{id:'qa'}})}});
  const response=await route.POST(new Request('https://example.test/api/speech/feedback',{method:'POST',body:JSON.stringify({id,transcript})}));
  return{status:response.status,body:await response.json(),claims,updates};
 }
 let result=await runRoute({responses:[provider(null),provider({assessment})]});
 assert.equal(result.status,200); assert.equal(result.claims,1,'Automatic recovery consumes a single feedback claim');
 assert.equal(result.body.status,'complete'); assert.equal(result.body.feedback.comparison.outcome,'first_attempt');
 assert.equal(result.body.feedback.comparison.beforeQuote,''); assert.equal(result.body.feedback.comparison.afterQuote,'');
 assert.ok(!('comparison' in requests[0].response_format.json_schema.schema.properties),'First attempt requests no unnecessary comparison');
 assert.equal(result.updates[0].usage.feedback.attempts.length,2);
 result=await runRoute({responses:[provider(null),provider(null)]});
 assert.equal(result.status,503); assert.equal(result.updates.at(-1).status,'transcribed','Failure keeps the same transcript retryable');
 assert.equal(result.claims,1);
 const compared={...feedback,comparison:{outcome:'similar',beforeQuote:'Earlier speech',afterQuote:feedback.strength.quote,explanation:'Both state a clear point.'}};
 result=await runRoute({previous:true,responses:[provider({assessment,comparison:{...compared.comparison,explanation:''}}),provider({assessment,comparison:compared.comparison})]});
 assert.equal(result.status,200); assert.equal(result.body.feedback.comparison.outcome,'similar');
 assert.ok('comparison' in requests[0].response_format.json_schema.schema.properties);
 result=await runRoute({responses:[provider({assessment:{...assessment,point:{...assessment.point,quote:'Invented words'}}})]});
 assert.equal(result.status,503); assert.equal(result.updates.at(-1).status,'transcribed');
 assert.equal(logs.at(-1).stage,'feedback_evidence','Quote validation is preserved');
 assert.ok(!JSON.stringify(logs).includes(transcript));
 assert.ok(!JSON.stringify(logs).includes(privateMarker));
} finally {
 globalThis.fetch=original.fetch;console.error=original.error;console.info=original.info;Date.now=original.now;AbortSignal.timeout=original.timeout;
}
console.log('PASS: first-attempt comparison reproduction, bounded format recovery, deadline and usage accounting, one quota claim, retryable state, genuine comparison and quote validation.');
