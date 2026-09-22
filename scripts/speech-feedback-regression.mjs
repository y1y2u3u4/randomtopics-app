import assert from 'node:assert/strict';
import { z } from 'zod';
import { load } from './lib/load-typescript.mjs';
const server = load('src/lib/speech/server.ts');
const { feedbackSchema, firstFeedbackSchema, firstAttemptFeedback, validateFeedback } = load('src/lib/speech/schema.ts');
const { speechSchemaIssues, speechEvidenceIssue } = load('src/lib/speech/diagnostics.ts');
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
assert.equal(speechEvidenceIssue(new Error(privateMarker)),undefined,'Only closed evidence categories are exposed');

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
  const request=JSON.parse(options.body);requests.push(request); now+=elapsedPerCall;
  const next=queue.shift(); assert.ok(next,'Unexpected extra model request');
  const response=typeof next==='function'?next():next;
  // Route fixtures use the actual evidence-ID protocol. Unknown quotations stay
  // invalid instead of being silently turned into a valid source selection.
  let evidence;try{evidence=JSON.parse(request.messages[1].content).evidence;}catch{}
  if(evidence && response.ok){
   const envelope=await response.clone().json();
   const value=JSON.parse(envelope.choices[0].message.content);
   const encode=(quote,source)=>quote ? Object.entries(source).find(([,text])=>text===quote)?.[0]
    ?? Object.entries(source).sort((a,b)=>a[1].length-b[1].length).find(([,text])=>text.includes(quote))?.[0] ?? quote : quote;
   if(value?.assessment)for(const criterion of Object.values(value.assessment))criterion.quote=encode(criterion.quote,evidence.current);
   if(value?.comparison){value.comparison.beforeQuote=encode(value.comparison.beforeQuote,evidence.previous);value.comparison.afterQuote=encode(value.comparison.afterQuote,evidence.current);}
   envelope.choices[0].message.content=JSON.stringify(value);
   return new Response(JSON.stringify(envelope),{status:response.status,headers:response.headers});
  }
  return response;
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
 async function runRoute({previous=false,responses,feedbackCalls=0,elapsed=0}) {
  reset(responses,elapsed); let claims=0; const updates=[];
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
 assert.equal(result.updates[0].usage.feedbackEvidenceVersion,'source_ids_v1');
 result=await runRoute({responses:[provider(null),provider(null)]});
 assert.equal(result.status,503); assert.equal(result.updates.at(-1).status,'transcribed','Failure keeps the same transcript retryable');
 assert.equal(result.claims,1);
 const compared={...feedback,comparison:{outcome:'similar',beforeQuote:'Earlier speech',afterQuote:feedback.strength.quote,explanation:'Both state a clear point.'}};
 result=await runRoute({previous:true,responses:[provider({assessment,comparison:{...compared.comparison,explanation:''}}),provider({assessment,comparison:compared.comparison})]});
 assert.equal(result.status,200); assert.equal(result.body.feedback.comparison.outcome,'similar');
 assert.ok('comparison' in requests[0].response_format.json_schema.schema.properties);
 const ungrounded={assessment:{...assessment,point:{...assessment.point,quote:'Invented words'}}};
 const missingEvidence={assessment:{...assessment,point:{...assessment.point,quote:''}}};
 for (const [invalid,stage,reason] of [[ungrounded,'model_schema',undefined],[missingEvidence,'feedback_evidence','missing_assessment_evidence']]) {
  result=await runRoute({responses:[provider(invalid),provider({assessment})],elapsed:3000});
  assert.equal(result.status,200,'Evidence rejection is recovered before returning an error to the user');
  assert.equal(result.claims,1);assert.equal(requests.length,2);assert.equal(result.updates.length,1);
  assert.equal(result.updates[0].usage.feedback.attempts.length,2,'Rejected evidence usage remains counted');
  assert.deepEqual(timeouts,[45000,42000],'Evidence recovery shares the existing deadline');
  assert.equal(logs[0].stage,stage);assert.equal(logs[0].evidence_issue,reason);assert.equal(logs[0].retrying,true);
  assert.match(requests[1].messages[0].content,/exact.*(?:quot|substring)/s);
  assert.equal(requests[0].messages[1].content,requests[1].messages[1].content);
  assert.ok(!JSON.stringify(result.body).includes('Invented words'),'Invalid evidence never reaches the saved result');
 }
 result=await runRoute({responses:[provider(ungrounded),provider(ungrounded)]});
 assert.equal(result.status,503);assert.equal(requests.length,2);assert.equal(result.updates.at(-1).status,'transcribed');
 assert.deepEqual(logs.map(x=>x.retrying),[true,false]);
 assert.equal(logs.at(-1).stage,'model_schema','Unknown evidence IDs are still rejected after the bounded recovery');
 result=await runRoute({responses:[provider(ungrounded)],elapsed:41000});
 assert.equal(result.status,503);assert.equal(requests.length,1,'Do not exceed the recovery deadline for evidence failures');
 result=await runRoute({responses:[provider(ungrounded,{finish_reason:'content_filter'})]});
 assert.equal(result.status,503);assert.equal(requests.length,1,'Refusals never trigger evidence recovery');
 result=await runRoute({responses:[provider(null),provider(ungrounded)]});
 assert.equal(result.status,503);assert.equal(requests.length,2,'Format and evidence recovery share one two-call budget');
 result=await runRoute({previous:true,responses:[provider({assessment,comparison:{...compared.comparison,beforeQuote:''}}),provider({assessment,comparison:compared.comparison})]});
 assert.equal(result.status,200);assert.equal(logs[0].evidence_issue,'missing_comparison_evidence');
 assert.equal(result.claims,1);
 reset([provider(feedback)]);
 await assert.rejects(()=>server.modelCall(firstFeedbackSchema,'speech_feedback','Assess.',transcript,()=>{throw new TypeError(privateMarker);}));
 assert.equal(requests.length,1,'Unexpected application faults do not spend another model call');
 assert.ok(!JSON.stringify(logs).includes(transcript));
 assert.ok(!JSON.stringify(logs).includes(privateMarker));
} finally {
 globalThis.fetch=original.fetch;console.error=original.error;console.info=original.info;Date.now=original.now;AbortSignal.timeout=original.timeout;
}
console.log('PASS: first-attempt comparison, bounded format/evidence recovery, shared deadline and usage accounting, one claim, retryable exhaustion, grounded comparison, refusal and privacy guards.');
