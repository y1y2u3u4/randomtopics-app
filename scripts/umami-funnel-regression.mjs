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

// next_* recommendation events reach Umami with slot / from / target_path (2026-10-28).
window.umami={track:(e,p)=>umami.push([e,p])};
for (const name of ['next_card_click','next_result_click','next_locale_click']) {
  umami.length=0;track(name,{slot:'result_next',from:'/charades',target_path:'/this-or-that',generations:3,page_path:'/'});
  assert.equal(umami.length,1);assert.equal(umami[0][0],name);
  assert.deepEqual({...umami[0][1]},{slot:'result_next',from:'/charades',target_path:'/this-or-that',generations:3,page_path:'/'});
}
console.log('PASS: next_* events reach Umami with slot/from/target_path');

// {page}_use / {page}_share for the two 2026-10-28 tool pages reach Umami; look-alikes do not.
for (const name of ['magic_8_ball_use','magic_8_ball_share','random_pokemon_generator_use','random_pokemon_generator_share']) {
  umami.length=0;track(name,{tool_type:'x',share_method:'image',locale:'en'});
  assert.equal(umami.length,1);assert.equal(umami[0][0],name);
  assert.deepEqual({...umami[0][1]},{tool_type:'x',share_method:'image',locale:'en',page_path:'/'});
}
umami.length=0;track('magic_8_ball_other',{});track('random_nba_player_generator_use',{});assert.equal(umami.length,0);
console.log('PASS: magic_8_ball / random_pokemon_generator use+share events reach Umami');

// Wheel family {page}_use / {page}_share reach Umami; look-alikes do not.
for (const name of ['yes_or_no_wheel_use','yes_or_no_wheel_share','food_wheel_use','raffle_wheel_share','classroom_name_picker_wheel_use','spin_the_wheel_custom_use','name_wheel_share','random_wheel_use','spin_the_wheel_share']) {
  umami.length=0;track(name,{tool_type:'x',share_method:'link',locale:'en'});
  assert.equal(umami.length,1);assert.equal(umami[0][0],name);
}
umami.length=0;track('food_wheel_other',{});track('raffle_wheel_use_extra',{});assert.equal(umami.length,0);
console.log('PASS: wheel family use+share events reach Umami');
// 2026-10-28 question-bank list pages: {page}_use / {page}_share reach Umami.
for (const name of ['would_you_rather_questions_use','would_you_rather_questions_share','truth_or_dare_questions_use','truth_or_dare_questions_share']) {
  umami.length=0;track(name,{tool_type:'x',share_method:'copy_link',locale:'en'});
  assert.equal(umami.length,1);assert.equal(umami[0][0],name);
}
umami.length=0;track('would_you_rather_questions_other',{});assert.equal(umami.length,0);
console.log('PASS: would_you_rather_questions / truth_or_dare_questions use+share events reach Umami');
