import assert from 'node:assert/strict';
import { load } from './lib/load-typescript.mjs';

const server = load('src/lib/speech/server.ts');
const { transcriptSchema } = load('src/lib/speech/schema.ts');
const { logSpeechFailure } = load('src/lib/speech/diagnostics.ts');
const originalFetch = globalThis.fetch;
const originalError = console.error;
const logs = [];
const privateText = 'PRIVATE_TRANSCRIPT_AND_PROVIDER_DETAIL';
const response = content => new Response(JSON.stringify({choices:[{message:{content}}]}));
try {
  console.error = value => logs.push(JSON.parse(value));
  const cases = [
    ['model_http', () => new Response(privateText, {status:503})],
    ['model_timeout', () => { throw new DOMException(privateText, 'TimeoutError'); }],
    ['model_request', () => { throw new Error(privateText); }],
    ['response_json', () => new Response(privateText)],
    ['content_json', () => response(privateText)],
    ['model_schema', () => response(JSON.stringify({unexpected:privateText}))],
  ];
  for (const [stage, result] of cases) {
    globalThis.fetch = async () => result();
    await assert.rejects(() => server.modelCall(transcriptSchema, 'speech_transcript', privateText, privateText));
    assert.equal(logs.at(-1).stage, stage);
    assert.equal(logs.at(-1).operation, 'transcribe');
  }
  assert.equal(logs[0].provider_status, 503);
  const beforeSuccess = logs.length;
  globalThis.fetch = async () => response(JSON.stringify({transcript:privateText}));
  assert.equal((await server.modelCall(transcriptSchema, 'speech_transcript', privateText, privateText)).value.transcript, privateText);
  assert.equal(logs.length, beforeSuccess, 'Successful requests are not recorded as failures');

  const id = '6c9f1062-e17e-41df-a5da-ae87db04336f';
  const feedback = {
    strength:{quote:privateText,observation:'Point is present.'},
    priority:{quote:'',observation:'Add detail.',nextStep:'Add one example.'},
    structure:{point:'Present',example:'Missing',ending:'Present'},
    comparison:{outcome:'first_attempt',beforeQuote:'',afterQuote:'',explanation:'First attempt.'},
  };
  for (const mode of ['feedback_evidence','feedback_save']) {
    const updates = [];
    const db = {
      rpc: async () => ({data:true,error:null}),
      from: () => ({
        writing:false,
        select(){return this;}, eq(){return this;}, is(){return this;},
        update(value){this.writing=true;updates.push(value);return this;},
        async single(){return this.writing ? {data:null,error:new Error(privateText)} :
          {data:{id,status:'transcribed',feedback_calls:0,previous_id:null,topic:privateText,usage:{}},error:null};},
        then(resolve){resolve({error:null});},
      }),
    };
    const route = load('src/app/api/speech/feedback/route.ts', {
      '@/lib/speech/server':{...server,actor:async()=>({user:{id:'PRIVATE_ACCOUNT'},db}),
        modelCall:async()=>({value:mode==='feedback_evidence' ? {...feedback,strength:{...feedback.strength,quote:'invented quote'}} : feedback,usage:{},model:'test'})},
    });
    const result = await route.POST(new Request('https://example.test/api/speech/feedback',{
      method:'POST',body:JSON.stringify({id,transcript:privateText})
    }));
    assert.equal(result.status,503);
    assert.equal(logs.at(-1).stage,mode);
    assert.equal(updates.at(-1).status,'transcribed','Failed feedback stays retryable within the existing call limit');
    assert.ok(!JSON.stringify(await result.json()).includes(privateText));
  }
  assert.ok(!JSON.stringify(logs).includes('PRIVATE'));
  assert.ok(!JSON.stringify(logs).includes(id));
  for (const item of logs) assert.ok(Object.keys(item).every(key=>['event','operation','stage','elapsed_ms','provider_status'].includes(key)));
  console.error = () => { throw new Error(privateText); };
  assert.doesNotThrow(()=>logSpeechFailure('feedback','feedback_save',1));
} finally {
  globalThis.fetch=originalFetch;
  console.error=originalError;
}
console.log('PASS: model failure classification, feedback validation/storage recovery, private data exclusion and logging failure isolation.');
