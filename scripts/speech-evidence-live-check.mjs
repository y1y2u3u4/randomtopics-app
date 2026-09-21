// Synthetic input, fixture auth/storage, and one real provider call per case.
// Inject a rejected first response to verify recovery with the actual model.
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {load} from './lib/load-typescript.mjs';
assert.ok(process.env.OPENROUTER_API_KEY,'A preview model credential is required');
const server=load('src/lib/speech/server.ts');
const coach=load('src/lib/speech/coaching.ts');
const {validateFeedback}=load('src/lib/speech/schema.ts');
const transcript='A short walk helps me reset. Yesterday I walked beside the river after work. I returned feeling ready for the evening.';
const met={status:'met',quote:'A short walk helps me reset.',explanation:'You explain what walking changes.'};
const assessment={relevance:met,point:met,example:{...met,quote:'Yesterday I walked beside the river after work.'},ending:{...met,quote:'I returned feeling ready for the evening.'}};
const beforeText='A short walk helps me reset. Yesterday I walked beside the river after work. So the reason I';
const before=validateFeedback(coach.assembleFeedback({assessment:{...assessment,ending:{status:'partial',quote:'So the reason I',explanation:'Your closing thought is unfinished.'}}},beforeText),beforeText);
const focusedText='That is why a short walk helps me leave work stress behind and return home with a clearer head.';
const samples=[
 {name:'ungrounded_first_quote',text:transcript,bad:{assessment:{...assessment,point:{...met,quote:'Words that were never spoken.'}}},issue:'ungrounded_quote'},
 {name:'missing_met_evidence',text:transcript,bad:{assessment:{...assessment,point:{...met,quote:''}}},issue:'missing_assessment_evidence'},
 {name:'focused_comparison_wrong_source',text:focusedText,previous:{transcript:beforeText,feedback:before},bad:{focus:{...met,quote:focusedText},comparison:{outcome:'improved',beforeQuote:focusedText,afterQuote:focusedText,explanation:'The thought is now complete.'}},issue:'ungrounded_quote'},
];
const original={fetch:globalThis.fetch,error:console.error,info:console.info};
const results=[];
try{
 for(const sample of samples){
  let requests=0,claims=0;const updates=[],diagnostics=[];
  console.error=value=>diagnostics.push(JSON.parse(value));console.info=console.error;
  globalThis.fetch=async(...args)=>{
   if(args[0]==='https://openrouter.ai/api/v1/chat/completions' && ++requests===1)
    return new Response(JSON.stringify({choices:[{message:{content:JSON.stringify(sample.bad)},finish_reason:'stop'}],usage:{synthetic:true}}));
   return original.fetch(...args);
  };
  const id='6c9f1062-e17e-41df-a5da-ae87db04336f';
  const attempt={id,status:'transcribed',feedback_calls:0,previous_id:sample.previous?'previous':null,topic:'Why are short walks useful?',transcript:sample.text,usage:{context:{version:'v5',qa:true,practiceMode:sample.previous?'focused':'full'}}};
  const db={rpc:async()=>{claims++;return{data:true,error:null};},from:()=>({
   writing:null,filter:null,select(){return this;},is(){return this;},eq(k,v){if(k==='id')this.filter=v;return this;},
   update(v){this.writing=v;updates.push(v);return this;},
   async single(){return{data:this.writing?{...attempt,...this.writing}:this.filter==='previous'?sample.previous:attempt,error:null};},
   then(resolve){resolve({error:null});},
  })};
  const route=load('src/app/api/speech/feedback/route.ts',{
   '@/lib/speech/server':{...server,actor:async()=>({db,user:{id:'synthetic'}})},
   '@/lib/speech/allowance':{speechAllowance:async()=>({included:2,remaining:1,paid:false})},
  });
  const started=Date.now();
  const response=await route.POST(new Request('https://example.test/api/speech/feedback',{method:'POST',body:JSON.stringify({id,transcript:sample.text})}));
  const body=await response.json();
  let grounded=false;
  if(response.ok){validateFeedback(body.feedback,sample.text,sample.previous?.transcript,sample.previous?.feedback);grounded=true;}
  const comparisonOk=!sample.previous || body.feedback?.comparison.outcome==='improved' && body.feedback?.assessment.ending.status==='met' && body.feedback?.assessment.example.status==='not_assessed';
  const passed=response.status===200 && body.status==='complete' && grounded && comparisonOk && claims===1 && requests===2 && updates.length===1 && updates[0].usage.feedback.attempts.length===2 && diagnostics[0].evidence_issue===sample.issue;
  results.push({name:sample.name,passed,httpStatus:response.status,grounded,comparisonOk,claims,providerRequests:requests,realProviderRequests:requests-1,elapsedMs:Date.now()-started,diagnostics,feedback:body.feedback});
 }
}finally{globalThis.fetch=original.fetch;console.error=original.error;console.info=original.info;}
const report={generatedAt:new Date().toISOString(),synthetic:true,storage:'fixture; no production rows, GA events, emails or payments',passed:results.every(r=>r.passed),results};
if(process.argv[2])writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({passed:report.passed,results:results.map(({feedback,...r})=>r)}));
assert.equal(report.passed,true,'Live evidence recovery failed; inspect the safe diagnostics');
