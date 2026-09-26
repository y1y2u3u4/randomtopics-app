// Local-only browser regression harness. No microphone, accounts, API keys or
// real network requests: the actual SpeechCoach uses deferred media/API fixtures.
// Run with node scripts/speech-recording-browser.mjs, then open the printed URL.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { createServer } from 'node:http';
import { execFileSync } from 'node:child_process';
const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, '..');
const temp = mkdtempSync(join(tmpdir(), 'speech-recording-browser-'));
const baseline = process.argv.find(x => x.startsWith('--baseline='))?.slice(11);
const port = baseline ? 4688 : 4687;
const put = (name, value) => { const file = join(temp, name); writeFileSync(file, value); return file; };
let component = resolve(root, 'src/components/SpeechCoach.tsx');
if (baseline) component = put('SpeechCoach.tsx', execFileSync('git', ['show', `${baseline}:src/components/SpeechCoach.tsx`], { cwd: root }));
const loader = put('loader.cjs', `const ts=require(${JSON.stringify(require.resolve('typescript'))});module.exports=function(s){return ts.transpileModule(s,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText;};`);
const link = put('link.tsx', `export default function Link({href,children,...p}){return <a href={href} {...p}>{children}</a>}`);
const result = put('result.tsx', `export default function Result(){return <h4 tabIndex={-1}>Fixture feedback ready</h4>}`);
const client = put('client.ts', `export class PracticeRequestError extends Error {};
export const api={calls:[],hold:false,release:()=>{}};
export async function practiceFetch(path,body){api.calls.push(path);if(path==='transcribe'){if(api.hold)await new Promise(r=>{api.release=r});return {transcript:'A synthetic answer for a local browser test.',duration:5};}return {id:body.id,status:'complete',feedback:{}};}`);
const audio = put('audio.ts', `export async function recordingToWav(){return 'SYNTHETIC_AUDIO_FIXTURE';}`);
const entry = put('entry.tsx', `
import React,{act} from 'react';
import {createRoot} from 'react-dom/client';
import Coach from 'coach-under-test';
import {api} from '@/lib/speech/client';
window.IS_REACT_ACT_ENVIRONMENT=true;
const pending=[],tracks=[],events=[];let recorderStarts=0,key=0;
const topic={id:'fixture',text:'Describe a small change that helped your day.',talkingPoints:[]};
const host=document.getElementById('coach'),output=document.getElementById('results');
const root=createRoot(host);
window.addEventListener('rt:analytics',e=>events.push(e.detail));
Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:()=>new Promise((resolve,reject)=>pending.push({resolve,reject}))}});
const wav=()=>{const a=new ArrayBuffer(44+16000*2*5),v=new DataView(a);const s=(i,x)=>[...x].forEach((c,n)=>v.setUint8(i+n,c.charCodeAt(0)));s(0,'RIFF');v.setUint32(4,a.byteLength-8,true);s(8,'WAVE');s(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,16000,true);v.setUint32(28,32000,true);v.setUint16(32,2,true);v.setUint16(34,16,true);s(36,'data');v.setUint32(40,a.byteLength-44,true);return new Blob([a],{type:'audio/wav'});};
window.MediaRecorder=class{static isTypeSupported(){return true}state='inactive';mimeType='audio/wav';start(){recorderStarts++;this.state='recording'}stop(){this.state='inactive';queueMicrotask(()=>{this.ondataavailable?.({data:wav()});this.onstop?.()})}};
const check=(condition,message)=>{if(!condition)throw Error(message)};
const text=()=>host.textContent;
const button=name=>[...host.querySelectorAll('button')].find(x=>x.textContent.trim()===name);
const click=async name=>{const b=button(name);check(b&&!b.disabled,'Missing enabled control: '+name);await act(async()=>b.click())};
const render=async(visible=true,remount=false)=>{if(remount)key++;await act(async()=>root.render(<Coach key={key} topic={topic} topics={[topic]} onTopicChange={()=>{}} contentSource='speech_hub' visible={visible}/>));};
const fresh=async()=>{pending.length=0;tracks.length=0;api.calls.length=0;api.hold=false;recorderStarts=0;events.length=0;await render(true,true)};
const grant=async index=>{const track={stopped:false,stop(){this.stopped=true}};tracks.push(track);await act(async()=>pending[index].resolve({getTracks:()=>[track]}));return track};
const deny=async index=>act(async()=>pending[index].reject(new DOMException('Fixture denied','NotAllowedError')));
const file=async()=>{const input=host.querySelector('input[type=file]');check(input,'Upload input is available');const d=new DataTransfer();d.items.add(new File([wav()],'fixture.wav',{type:'audio/wav'}));await act(async()=>{input.files=d.files;input.dispatchEvent(new Event('change',{bubbles:true}))});};
const frames=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
const results=[];
const test=async(name,fn)=>{try{await fn();results.push({name,pass:true})}catch(e){results.push({name,pass:false,error:e.message})}output.textContent=JSON.stringify(results,null,2)};
document.getElementById('run').onclick=async()=>{
 document.getElementById('run').disabled=true;results.length=0;
 await test('Cancel pending permission; late grant never records',async()=>{await fresh();await click('Start recording');check(!host.querySelector('input[type=file]'),'Pending state reproduces blocked upload');await click('Cancel waiting · use an audio file');await frames();check(document.activeElement===host.querySelector('input[type=file]'),'Focus reaches upload');const t=await grant(0);check(t.stopped&&recorderStarts===0&&button('Start recording'),'Late media stopped without changing ready state');check(api.calls.length===0,'No automatic upload');check(events.some(e=>e.event==='qa_speech_permission_cancel'),'Cancellation uses QA telemetry');});
 await test('Old denial cannot interrupt a newer recording',async()=>{await fresh();await click('Start recording');await click('Cancel waiting · use an audio file');await click('Start recording');await grant(1);await deny(0);check(button('Finish recording')&&!tracks[0].stopped,'Old denial leaves current microphone running');await click('Finish recording');check(button('Get my feedback'),'Normal recording remains usable');check(api.calls.length===0,'Recording is never uploaded automatically');await click('Get my feedback');check(text().includes('Fixture feedback ready')&&api.calls.join(',')==='transcribe,feedback','Explicit submit completes fixture chain once');});
 await test('Late permission cannot replace an upload or reset submission',async()=>{await fresh();await click('Start recording');await click('Cancel waiting · use an audio file');await file();api.hold=true;await click('Get my feedback');check(text().includes('Listening to your answer'),'Submission is pending');const t=await grant(0);check(t.stopped&&recorderStarts===0&&text().includes('Listening to your answer'),'Old grant preserves submitted audio state');await act(async()=>api.release());check(text().includes('Fixture feedback ready')&&api.calls.length===2,'Submission finishes without duplicate requests');});
 await test('Denied microphone offers visible recovery and accepts a file',async()=>{await fresh();await click('Start recording');await deny(0);await frames();const alert=host.querySelector('[role=alert]');check(alert?.textContent.includes('no microphone permission needed'),'Denied permission explains file alternative');check(document.activeElement===alert&&alert.contains(button('Choose an audio file')),'Error and actionable file recovery receive focus');await file();await click('Get my feedback');check(text().includes('Fixture feedback ready'),'Upload recovery reaches fixture feedback');check(events.some(e=>e.event==='qa_speech_issue_permission_denied'),'Permission failure stays QA');});
 await test('Hide and reopen pending request releases the busy state',async()=>{await fresh();await click('Start recording');await render(false);await render(true);check(button('Start recording'),'Reopening is ready immediately');const t=await grant(0);check(t.stopped&&recorderStarts===0,'Hidden request cannot record later');await click('Start recording');await grant(1);check(button('Finish recording'),'A new request works');await click('Finish recording');});
 await test('Backgrounding a pending request never starts recording later',async()=>{await fresh();await click('Start recording');Object.defineProperty(document,'hidden',{configurable:true,value:true});try{await act(async()=>document.dispatchEvent(new Event('visibilitychange')))}finally{delete document.hidden}check(button('Start recording'),'Background wait was cancelled');const t=await grant(0);check(t.stopped&&recorderStarts===0,'No late background recording');});
 await test('Unmount stops late media without events or requests',async()=>{await fresh();await click('Start recording');await act(async()=>root.render(null));const count=events.length;const t=await grant(0);check(t.stopped&&recorderStarts===0&&events.length===count&&api.calls.length===0,'Unmounted request is inert');});
 await render(true,true);document.getElementById('run').disabled=false;
 document.getElementById('summary').textContent=results.filter(r=>r.pass).length+'/'+results.length+' passed';
};
document.getElementById('deny').onclick=async()=>{output.textContent='';await fresh();await click('Start recording');await deny(0);};
document.getElementById('wait').onclick=async()=>{output.textContent='';await fresh();await click('Start recording');};
await render(true,true);
`);
const { webpack } = require('next/dist/compiled/webpack/webpack');
await new Promise((ok, fail) => webpack({
  mode: 'development', devtool: false, entry, output: { path: temp, filename: 'bundle.js' },
  resolve: { extensions: ['.tsx', '.ts', '.js'], modules: [resolve(root, 'node_modules')], alias: {
    'coach-under-test': component, 'next/link': link,
    '@/lib/speech/client': client, '@/lib/speech/audio': audio, '@': resolve(root, 'src'),
  } },
  module: { rules: [{ test: /\.tsx?$/, use: loader }] },
  plugins: [new webpack.NormalModuleReplacementPlugin(/\.\/SpeechFeedbackResult$/, result)],
}, (error, stats) => error || stats.hasErrors() ? fail(error || Error(stats.toString({all:false,errors:true}))) : ok()));
const css = await require('postcss')([require('@tailwindcss/postcss')({base:root})]).process(readFileSync(resolve(root,'src/app/globals.css'),'utf8'),{from:resolve(root,'src/app/globals.css')});
put('styles.css',css.css);
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/styles.css"><title>Speech microphone recovery · local fixtures</title><body style="max-width:900px;margin:auto;padding:20px"><h1>Microphone recovery · local fixtures</h1><p>No microphone or external API is used. ${baseline ? 'Baseline '+baseline : 'Current working tree'}.</p><div style="display:flex;gap:12px;flex-wrap:wrap;margin:16px 0"><button id="run">Run regression</button><button id="deny">Show denied microphone</button><button id="wait">Show waiting microphone</button></div><strong id="summary"></strong><pre id="results" style="white-space:pre-wrap"></pre><main id="coach"></main><script src="/bundle.js"></script></body></html>`;
createServer((req,res)=>{
  if(req.url?.startsWith('/styles.css')){res.setHeader('Content-Type','text/css');res.end(readFileSync(join(temp,'styles.css')))}
  else if(req.url?.startsWith('/bundle.js')){res.setHeader('Content-Type','application/javascript');res.end(readFileSync(join(temp,'bundle.js')))}
  else if(req.url?.split('?')[0]==='/'){res.setHeader('Content-Type','text/html');res.end(html)}
  else{res.statusCode=404;res.end()}
}).listen(port,'127.0.0.1',()=>console.log(`Local fixture harness: http://127.0.0.1:${port}/?speech_qa=1`));
