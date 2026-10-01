import assert from 'node:assert/strict';
import {load} from './lib/load-typescript.mjs';
const storage = new Map(), trace=[];
const store={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
globalThis.sessionStorage=store;
globalThis.document={title:'Fixture',documentElement:{lang:'en'}};
globalThis.CustomEvent=class{constructor(type,options){this.type=type;this.detail=options.detail}};
globalThis.window={location:{hostname:'randomtopics.app',origin:'https://randomtopics.app',pathname:'/speech',search:'?speech_qa=1&usage_qa=1&measure=1'},sessionStorage:store,localStorage:store,dispatchEvent:e=>trace.push({kind:'diagnostic',...e.detail}),gtag:(command,event,params)=>trace.push({kind:'gtag',command,event,params})};
const {trackSpeech}=load('src/lib/speech/telemetry.ts');
for(const event of ['speech_entry_expanded_page','speech_entry_expanded_view','speech_example_open','speech_entry_expanded_click']){
 trace.length=0; trackSpeech(event,{content_source:'speech_hub'});
 assert.deepEqual(trace.map(x=>x.kind),['diagnostic','gtag','diagnostic']);
 assert.ok(trace.every(x=>x.event===`qa_${event}`));
 assert.equal(trace[0].stage,'constructed');assert.equal(trace[2].stage,'dispatch_called');assert.equal(trace[1].params.is_test,true); assert.equal(trace[1].params.environment,'production'); assert.equal(trace[1].params.schema_version,'1');
 assert.ok(trace[1].event.length<=40); assert.ok(Object.keys(trace[1].params).length<=25);
 console.log('PASS',event,'one mock gtag call, two diagnostic dispatches',trace[1].event.length,Object.keys(trace[1].params).length);
}
trace.length=0; window.gtag=()=>{trace.push({kind:'throwing-gtag'});throw Error('mock transport unavailable')};
trackSpeech('speech_entry_expanded_view',{content_source:'speech_hub'});
assert.deepEqual(trace.map(x=>x.kind),['diagnostic','throwing-gtag','diagnostic']);
assert.equal(trace[0].stage,'constructed');assert.equal(trace[2].stage,'dispatch_error');assert.equal(trace[2].error_code,'dispatch_exception');console.log('PASS: thrown transport is explicitly dispatch_error, no dispatch_called.');
trace.length=0;delete window.gtag;window.dataLayer=[];
trackSpeech('speech_entry_expanded_view',{content_source:'speech_hub'});
assert.equal(window.dataLayer.length,1);assert.equal(window.dataLayer[0][1],'qa_speech_entry_expanded_view');
console.log('PASS: missing gtag queues unchanged canonical name once; queue is not delivery confirmation.');

assert.equal(trace[0].stage,'constructed');assert.equal(trace[1].stage,'dispatch_called');
trace.length=0;window.dispatchEvent=()=>{throw Error('mock diagnostic failed')};window.gtag=(...args)=>trace.push(args);trackSpeech('speech_entry_expanded_view',{content_source:'speech_hub'});assert.equal(trace.length,1);console.log('PASS: broken diagnostics never suppress transport.');
