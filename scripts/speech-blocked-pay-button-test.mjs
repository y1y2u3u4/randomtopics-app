import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import ts from 'typescript';
import * as React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {load} from './lib/load-typescript.mjs';
const require=createRequire(import.meta.url);
const source=readFileSync('src/components/SpeechCoach.tsx','utf8');
const states=[...source.matchAll(/const \[(\w+),[^\]]+\] = useState/g)].map(m=>m[1]);
for(const blocked of ['quota','daily']){
 let index=0;
 const hooks={...React,useEffect(){},useRef:()=>({current:null}),useState(initial){const name=states[index++];return [name==='quotaHit'?blocked:name==='error'?'Limit reached':typeof initial==='function'?initial():initial,()=>{}];}};
 const module={exports:{}};
 const code=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 new Function('require','module','exports',code)(id=>{
  if(id==='react')return hooks;
  if(id==='next/link')return {__esModule:true,default:({children,href})=>React.createElement('a',{href},children)};
  if(id.startsWith('./'))return {__esModule:true,default:({children,href})=>href?React.createElement('a',{href},children):null};
  if(id.startsWith('@/'))return load('src/'+id.slice(2)+'.ts');
  return require(id);
 },module,module.exports);
 const tree=module.exports.default({topics:[],onTopicChange(){},topic:{id:'fixture',text:'A topic',talkingPoints:[]},visible:true,contentSource:'test'});
 const html=renderToStaticMarkup(tree);
 assert.match(html,/href="\/speech\/account#speech-plan"/);
 assert.match(html,blocked==='daily'?/Keep practicing with a plan/:/View allowance and practice plan/);
}
console.log('PASS: when blocked by quota or daily limit, the pay action appears');
