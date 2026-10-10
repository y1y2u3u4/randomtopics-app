import assert from 'node:assert/strict';
import {load} from './lib/load-typescript.mjs';
const {DRAWING_PROMPTS, DRAWING_CATEGORIES}=load('src/data/drawingPrompts.ts');
const {drawingPool,pickDrawings}=load('src/lib/drawing.ts');
assert.equal(DRAWING_PROMPTS.length,48);assert.equal(new Set(DRAWING_PROMPTS.map(p=>p.id)).size,48);assert.equal(new Set(DRAWING_PROMPTS.map(p=>p.text)).size,48);
for(const c of DRAWING_CATEGORIES)assert.equal(drawingPool(c,'all').length,8);
assert.equal(drawingPool('fantasy','easy').length,0);
const seen=[];for(let i=0;i<48;i++){const [p]=pickDrawings(DRAWING_PROMPTS,seen,1,()=>0);assert.ok(p);assert.ok(!seen.includes(p.id));seen.push(p.id)}
assert.equal(pickDrawings(DRAWING_PROMPTS,seen,5).length,0);assert.equal(pickDrawings(DRAWING_PROMPTS,[],5).length,5);
const pool=drawingPool('animals','easy');const first=pickDrawings(pool,[],3,()=>0);const tail=pickDrawings(pool,first.map(p=>p.id),5);assert.equal(tail.length,1);assert.equal(new Set([...first,...tail].map(p=>p.id)).size,4);
assert.ok(DRAWING_PROMPTS.every(p=>p.text.length>15&&p.hint.length>15));
console.log('PASS: 48 unique original records, category/difficulty filters, empty selection, batch uniqueness, full exhaustion and explicit reset.');
const storage=new Map();globalThis.sessionStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
globalThis.document={title:'Local drawing fixture',documentElement:{lang:'en'}};globalThis.CustomEvent=class{constructor(type,opts){this.detail=opts.detail}};
const emitted=[],sent=[];globalThis.window={location:{hostname:'localhost',pathname:'/random-drawing-generator',search:'',origin:'http://localhost'},localStorage:sessionStorage,sessionStorage,dispatchEvent:e=>emitted.push(e.detail),gtag:(...args)=>sent.push(args)};
const {track}=load('src/lib/track.ts');for(const event of ['generate_start','generate_success','copy_result','copy_error'])track(event,{action_surface:'drawing_generator',category:'nature',difficulty:'easy',count:3,output_style:'detailed'});
assert.equal(sent.length,0);assert.ok(emitted.every(e=>e.params.is_test===true&&e.params.environment==='local_preview'));assert.ok(!JSON.stringify(emitted).includes(DRAWING_PROMPTS[0].text));console.log('PASS: existing analytics names, coarse params only, no real analytics transport on local preview.');
