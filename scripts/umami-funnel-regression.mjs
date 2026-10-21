import assert from 'node:assert/strict';
import {load} from './lib/load-typescript.mjs';
const storage=new Map();
const store={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
const gtag=[], umami=[];
globalThis.sessionStorage=store;
globalThis.document={title:'Fixture',documentElement:{lang:'en'}};
globalThis.CustomEvent=class{constructor(type,options){this.type=type;this.detail=options.detail}};
globalThis.window={location:{hostname:'randomtopics.app',origin:'https://randomtopics.app',pathname:'/',search:''},sessionStorage:store,localStorage:store,dispatchEvent(){},setTimeout:(fn)=>fn(),
  gtag:(c,e,p)=>gtag.push(e),umami:{track:(e,p)=>umami.push([e,p])}};
const {track}=load('src/lib/track.ts',{'./coreUsage':{coreUsageEvents:()=>[]}});
const cases=[['generate_success','generate'],['copy_result','copy'],['share_result','share'],['share_click','share'],['qotd_share_card','share']];
for(const [legacy,canonical] of cases){
  gtag.length=0;umami.length=0;
  track(legacy,{tool_type:'random_topic',locale:'en',topic:'secret text'});
  assert.deepEqual(gtag,[legacy,canonical],`${legacy}: GA keeps old name + canonical`);
  assert.equal(umami.length,1);assert.equal(umami[0][0],canonical);
  assert.equal(umami[0][1].tool_type,'random_topic');assert.equal(umami[0][1].topic,undefined,'no free text to Umami');
  console.log('PASS',legacy,'->',canonical);
}
gtag.length=0;umami.length=0;track('generate_start',{});assert.deepEqual(gtag,['generate_start']);assert.equal(umami.length,0);console.log('PASS: non-funnel events stay GA-only');
window.location.search='?usage_qa=1';umami.length=0;track('generate_success',{});assert.equal(umami.length,0);console.log('PASS: QA traffic never reaches Umami');
window.location.search='';storage.clear();delete window.umami;let tries=0;window.setTimeout=(fn)=>{tries++;if(tries===2)window.umami={track:(e)=>umami.push([e])};fn();};
umami.length=0;track('copy_result',{});assert.deepEqual(umami,[['copy']]);console.log('PASS: waits for late Umami script');
