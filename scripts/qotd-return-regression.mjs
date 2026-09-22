import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import * as React from 'react';
import ts from 'typescript';
import * as questions from '../src/data/questionOfTheDay.ts';
import * as pool from '../src/lib/topicPool.ts';
const require = createRequire(import.meta.url);
for (const {id} of questions.QOTD_CATEGORIES) {
  const seen = new Set();
  for (let day = 1; day <= 24; day++) {
    const date = new Date(2026, 8, day);
    const index = questions.qotdIndexForCategory(date, id);
    assert.equal(questions.QOTD_QUESTIONS[index].c, id);
    assert.equal(index, questions.qotdIndexForCategory(date, id));
    seen.add(index);
  }
  assert.equal(seen.size, 24, 'Every category rotates all 24 questions without early repeats');
}
for (const value of [null, '', 'not-a-category', '{}']) assert.equal(questions.parseQotdPreference(value), 'all');
assert.equal(questions.parseQotdPreference('work'), 'work');
const Actions = () => null;
function fixture(blocked = false) {
  const state = [], events = [], storage = new Map([['rt-qotd-daily-category', 'work']]);
  let cursor = 0, mount, refresh;
  const code = ts.transpileModule(readFileSync(new URL('../src/components/QuestionOfTheDay.tsx', import.meta.url), 'utf8'), {
    compilerOptions: {module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX},
  }).outputText;
  const target={exports:{}};
  new Function('require','module','exports','window','localStorage',code)((id)=>{
    if(id==='react') return {...React,useState(initial){const i=cursor++;if(!(i in state))state[i]=initial;return [state[i],v=>{state[i]=typeof v==='function'?v(state[i]):v;}];},useRef(initial){const i=cursor++;return state[i]??={current:initial};},useMemo:fn=>fn(),useCallback:fn=>fn,useEffect:fn=>{mount=fn;}};
    if(id==='next/link')return {default:'a'};
    if(id==='framer-motion')return {motion:new Proxy({},{get:(_,key)=>key})};
    if(id==='./GeneratedResultActions')return {default:Actions};
    if(id==='./PrintButton')return {default:'print'};
    if(id==='@/data/questionOfTheDay')return questions;
    if(id==='@/lib/topicPool')return pool;
    if(id==='@/lib/track')return {track:(name,params)=>events.push({name,params})};
    return require(id);
  },target,target.exports,{setTimeout:fn=>{fn();return 1;},setInterval:fn=>{refresh=fn;return 2;},clearTimeout(){},clearInterval(){}},{getItem:key=>storage.get(key)||null,setItem:(key,value)=>{if(blocked)throw Error('blocked');storage.set(key,value);}});
  const nodes=n=>!n||typeof n!=='object'?[]:Array.isArray(n)?n.flatMap(nodes):[n,...nodes(n.props?.children)];
  const render=()=>{cursor=0;return nodes(target.exports.default({initialIdx:0,initialDateLabel:'Today'}));};
  render();mount();
  return {render,events,storage,refresh:()=>refresh(),choose:value=>render().find(n=>n.type==='select').props.onChange({target:{value}}),actions:()=>render().find(n=>n.type===Actions).props};
}
const f=fixture();
assert.equal(f.render().find(n=>n.type==='select').props.value,'work');
assert.equal(f.actions().isPostGenerate,false);assert.equal(f.actions().showSavedLink,true);
assert.equal(f.actions().actionSurface,'qotd_daily');
assert.equal(f.events.length,0,'Restoring a daily preference is not generation');
f.choose('kids');assert.equal(f.storage.get('rt-qotd-daily-category'),'kids');
assert.equal(questions.QOTD_QUESTIONS.find(item=>item.q===f.actions().text).c,'kids');
assert.equal(f.actions().isPostGenerate,false);
assert.equal(f.events.filter(e=>e.name==='generate_success').length,0);
const blocked=fixture(true);blocked.choose('classroom');blocked.refresh();
assert.equal(blocked.render().find(n=>n.type==='select').props.value,'classroom','A failed write must not undo the in-memory preference at the next minute tick');
assert.equal(questions.QOTD_QUESTIONS.find(item=>item.q===blocked.actions().text).c,'classroom');
console.log('PASS: daily category rotation, saved preference, default attribution and blocked-storage fallback.');
