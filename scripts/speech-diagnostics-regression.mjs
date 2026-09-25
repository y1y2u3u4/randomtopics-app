import assert from 'node:assert/strict';
import { load } from './lib/load-typescript.mjs';

const server = load('src/lib/speech/server.ts');
const { transcriptSchema } = load('src/lib/speech/schema.ts');
const { logSpeechFailure, speechModelOutput } = load('src/lib/speech/diagnostics.ts');
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

  // Production failures had HTTP 200 and malformed content; distinguish empty,
  // truncated and fenced output using closed metadata, never the actual content.
  for (const [content, state, chars] of [[undefined,'missing',undefined],[null,'null',undefined],
    ['', 'empty',0],['  \n','whitespace',3],[{text:privateText},'other_type',undefined]]) {
    const detail=speechModelOutput({choices:[{message:{content}}]});
    assert.equal(detail.content_state,state);
    assert.equal(detail.content_chars,chars);
    assert.equal(detail.finish_reason,'missing');
  }
  const unsafe = speechModelOutput({id:privateText,error:{message:privateText},
    choices:[{finish_reason:privateText,message:{content:privateText,refusal:privateText}}],
    usage:{prompt_tokens:privateText,completion_tokens:-1,completion_tokens_details:{reasoning_tokens:Infinity}}});
  assert.equal(unsafe.finish_reason,'other');
  assert.equal(unsafe.has_response_error,true);
  assert.equal(unsafe.has_refusal,true);
  assert.equal(unsafe.prompt_tokens,undefined);
  assert.equal(unsafe.completion_tokens,undefined);
  assert.equal(unsafe.reasoning_tokens,undefined);
  assert.ok(!JSON.stringify(unsafe).includes(privateText));
  assert.equal(speechModelOutput({choices:[{message:{content:'x'.repeat(1_000_001)}}]}).content_chars,1_000_000);
  for (const [content, finish, tokens, fenced] of [
    ['', 'error',0,false], ['{"transcript":"'+privateText,'length',4500,false],
    ['```json\n'+privateText,'stop',35,true],
  ]) {
    let calls=0;
    globalThis.fetch=async()=>{
      calls++;
      return new Response(JSON.stringify({id:privateText,
        choices:[{finish_reason:finish,message:{content},...(finish==='error'?{error:{message:privateText}}:{})}],
        usage:{prompt_tokens:17,completion_tokens:tokens,completion_tokens_details:{reasoning_tokens:0}}}));
    };
    await assert.rejects(()=>server.modelCall(transcriptSchema,'speech_transcript',privateText,privateText));
    assert.equal(calls,2,'Diagnostics preserve the existing two-call recovery limit');
    assert.equal(logs.at(-1).stage,'content_json');
    assert.equal(logs.at(-1).model_output.finish_reason,finish);
    assert.equal(logs.at(-1).model_output.completion_tokens,tokens);
    assert.equal(logs.at(-1).model_output.reasoning_tokens,0);
    assert.equal(logs.at(-1).model_output.content_fenced,fenced);
    assert.equal(logs.at(-1).model_output.has_response_error,finish==='error');
  }

  const id = '6c9f1062-e17e-41df-a5da-ae87db04336f';
  const criterion = {status:'met',quote:privateText,explanation:'This element is present.'};
  const assessment = {relevance:criterion,point:criterion,example:criterion,ending:criterion};
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
        modelCall:async()=>({value:{assessment:mode==='feedback_evidence' ? {...assessment,point:{...criterion,quote:'invented quote'}} : assessment},usage:{},model:'test'})},
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
  for (const item of logs) assert.ok(Object.keys(item).every(key=>['event','operation','stage','elapsed_ms','provider_status','attempt','retrying','schema_issues','evidence_issue','model_output'].includes(key)));
  console.error = () => { throw new Error(privateText); };
  assert.doesNotThrow(()=>logSpeechFailure('feedback','feedback_save',1));
} finally {
  globalThis.fetch=originalFetch;
  console.error=originalError;
}
console.log('PASS: model failure classification, feedback validation/storage recovery, private data exclusion and logging failure isolation.');
