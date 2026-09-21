// Manual server-side verification with synthetic text and the real model service.
// Authentication/storage are fixtures: no customer data, database writes or GA events.
import assert from 'node:assert/strict';
import { load } from './lib/load-typescript.mjs';
const server = load('src/lib/speech/server.ts');
const { validateFeedback } = load('src/lib/speech/schema.ts');
const topic = 'Can everyone share the same definition of happiness?';
const first = 'I think we cannot share one definition of happiness because people need different things. A quiet afternoon makes me happy, while my friend enjoys a busy party. Both choices can be good. We should protect people’s ability to choose their own activities instead of asking everyone to live the same way. A fair society gives people room to find their own happiness.';
const previous = { transcript: first, feedback: { priority: { quote: 'Both choices can be good.', observation: 'Explain the practical implication.', nextStep: 'Give one example of a policy that preserves choice.' } } };
const samples = [
 {name:'ordinary_first',transcript:first,previous:null},
 {name:'short_uncertain',transcript:'I do not really know the answer. I think happiness is different for every person. That is my answer.',previous:null},
 {name:'off_topic',transcript:'Today I went to the shop to buy apples and then I took the bus home. The apples were red and the bus was very crowded.',previous:null},
 {name:'second_attempt',transcript:first+' For example, a city can provide both a quiet library and public sports fields. Funding different options lets people take part without forcing one lifestyle on everyone.',previous},
 {name:'injected_format_error_then_live_recovery',transcript:first,previous:null,inject:true},
];
const originalFetch=globalThis.fetch,originalError=console.error,originalInfo=console.info;
const results=[];
try {
 for (const sample of samples) {
  const id='6c9f1062-e17e-41df-a5da-ae87db04336f', updates=[], logs=[];
  let requests=0,claims=0;
  console.error=value=>{try{logs.push(JSON.parse(value));}catch{}};
  console.info=console.error;
  globalThis.fetch=async(...args)=>{
   if(args[0]==='https://openrouter.ai/api/v1/chat/completions') {
    requests++;
    if(sample.inject&&requests===1) return new Response(JSON.stringify({choices:[{message:{content:'null'}}]}));
   }
   return originalFetch(...args);
  };
  const attempt={id,status:'transcribed',feedback_calls:0,previous_id:sample.previous?'previous':null,topic,usage:{},transcript:sample.transcript};
  const db={rpc:async()=>{claims++;return{data:true,error:null};},from:()=>({
   writing:null,filter:null,select(){return this;},is(){return this;},
   eq(key,value){if(key==='id')this.filter=value;return this;},
   update(value){this.writing=value;updates.push(value);return this;},
   async single(){return{data:this.writing?{...attempt,...this.writing}:this.filter==='previous'?sample.previous:attempt,error:null};},
   then(resolve){resolve({error:null});},
  })};
  const route=load('src/app/api/speech/feedback/route.ts',{'@/lib/speech/server':{...server,actor:async()=>({db,user:{id:'synthetic-qa'}})}});
  const started=Date.now();
  const response=await route.POST(new Request('https://example.test/api/speech/feedback',{method:'POST',body:JSON.stringify({id,transcript:sample.transcript})}));
  const body=await response.json();
  let grounded=false;
  if(response.ok) {validateFeedback(body.feedback,sample.transcript,sample.previous?.transcript);grounded=true;}
  results.push({name:sample.name,status:response.status,passed:response.ok&&grounded&&body.status==='complete'&&claims===1,grounded,requests,claims,elapsedMs:Date.now()-started,comparison:body.feedback?.comparison?.outcome,recovered:logs.some(l=>l.event==='speech_service_recovered'),diagnostics:logs});
 }
} finally {globalThis.fetch=originalFetch;console.error=originalError;console.info=originalInfo;}
console.log('SPEECH_FEEDBACK_LIVE_CHECK='+JSON.stringify({generatedAt:new Date().toISOString(),synthetic:true,storage:'fixture',results}));
assert.ok(results.every(r=>r.passed),'One or more live model checks failed; inspect safe diagnostics.');
