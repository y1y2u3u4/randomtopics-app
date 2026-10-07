import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {readFileSync} from 'node:fs';
import {load} from './lib/load-typescript.mjs';
const {initialHistoryGuardScript,INITIAL_HISTORY_READY}=load('src/lib/initialHistoryGuard.ts');
function documentAt(href,{documentHref=href,timing='available'}={}){
 const events=new EventTarget(),replacements=[];
 const location=new URL(href);location.replace=url=>replacements.push(url);
 const performance={getEntriesByType(){if(timing==='throw')throw Error('Timing unavailable');return timing==='empty'?[]:[{name:documentHref}]}};
 runInNewContext(initialHistoryGuardScript,{window:events,location,URL,...(timing==='absent'?{}:{performance})});
 return {location,replacements,pop(href){location.href=href;events.dispatchEvent(new Event('popstate'))},ready(){events.dispatchEvent(new Event(INITIAL_HISTORY_READY))},events};
}
const origin='https://randomtopics.app';
for(const [loaded,current] of [['/speech','/'],['/','/speech'],['/speech?category=science','/speech?category=politics']]){
 const d=documentAt(origin+current,{documentHref:origin+loaded});
 assert.deepEqual(d.replacements,[origin+current],'Recover a traversal that happened before the inline guard executed');
}
{
 const d=documentAt(origin+'/speech#examples',{documentHref:origin+'/speech'});assert.deepEqual(d.replacements,[],'A hash-only pre-script traversal keeps the same document');
}
for(const timing of ['absent','empty','throw']){
 const d=documentAt(origin+'/speech',{timing});assert.deepEqual(d.replacements,[]);d.pop(origin+'/');assert.deepEqual(d.replacements,[origin+'/'],'Future early traversals still work without navigation timing');
}
for(const [from,to] of [['/speech','/'],['/','/speech'],['/band-name-generator','/'],['/speech/practice','/speech?step=1']]){
 const d=documentAt(origin+from);let staleRouterCalls=0;d.events.addEventListener('popstate',()=>staleRouterCalls++);
 d.pop(origin+to);assert.deepEqual(d.replacements,[origin+to]);assert.equal(staleRouterCalls,0,'Do not restore stale Next history in the exiting document');
 d.ready();d.pop(origin+'/writing');assert.equal(d.replacements.at(-1),origin+'/writing','A second early Back must not be swallowed');
}
{
 const d=documentAt(origin+'/speech');d.pop(origin+'/speech#examples');assert.deepEqual(d.replacements,[],'Same-page anchor traversal does not reload');
 d.pop(origin+'/speech?category=science');assert.deepEqual(d.replacements,[origin+'/speech?category=science'],'Changed queries belong to the destination document');
}
{
 const d=documentAt(origin+'/speech');d.ready();let nextCalls=0;d.events.addEventListener('popstate',()=>nextCalls++);
 d.pop(origin+'/');assert.deepEqual(d.replacements,[],'Hydrated history remains with the existing router');assert.equal(nextCalls,1);
}
const layout=readFileSync('src/app/layout.tsx','utf8');
assert.ok(layout.indexOf('id="initial-history-guard"')<layout.indexOf('id="document-language"'));
assert.ok(layout.includes('<script id="initial-history-guard" dangerouslySetInnerHTML={{ __html: initialHistoryGuardScript }} />'),'The guard cannot wait for the Next Script loader');
assert.ok(!/fetch|localStorage|sessionStorage|gtag|cookie/.test(initialHistoryGuardScript),'Guard introduces no data collection or persistence');
console.log('Initial history guard: early Back/Forward, query/hash, repeated traversal, router handoff and privacy passed');
