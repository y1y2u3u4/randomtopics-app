import assert from 'node:assert/strict';
import {load} from './lib/load-typescript.mjs';
const {topicRequest,generateTopicsFromLibrary}=load('src/lib/topicGenerator.ts');
const {topics}=load('src/data/topics.ts');
const {CATEGORIES,MODES,DEPTHS}=load('src/data/types.ts');
const {filterTopicPool,drawUnseen}=load('src/lib/topicPool.ts');
const originalFetch=globalThis.fetch;let calls=0;
globalThis.fetch=async()=>{calls++;throw Error('A topic draw must never call a provider');};
try {
 for(const mode of [null,...MODES.map(x=>x.id)])for(const category of [null,...CATEGORIES.map(x=>x.id)])for(const depth of [null,...DEPTHS.map(x=>x.id)]){
  const input=topicRequest.parse({count:10,mode,category,depth});const result=generateTopicsFromLibrary(input);const pool=filterTopicPool(topics,input);
  assert.equal(result.source,'curated_pool');assert.equal(result.availableCount,pool.length);
  assert.equal(result.topics.length,Math.min(10,pool.length));
  assert.equal(new Set(result.topics.map(t=>t.id)).size,result.topics.length);
  assert.ok(result.topics.every(t=>pool.some(p=>p.id===t.id)),'Never relax requested filters silently');
 }
 for(const mode of MODES) for(const category of CATEGORIES) assert.ok(filterTopicPool(topics,{mode:mode.id,category:category.id}).length,"Every fixed mode/category landing page must remain usable");
 const {POST}=load('src/app/api/generate-topics/route.ts',{'@/lib/rateLimit':{rateLimit:()=>null}});
 const post=body=>POST(new Request('https://example.test/api/generate-topics',{method:'POST',body:typeof body==='string'?body:JSON.stringify(body)}));
 assert.equal((await post({count:3,mode:'speech'})).status,200,'Existing browser clients remain supported');
 for(const bad of [null,[],{count:0},{count:11},{count:2.8},{count:'3'},{mode:'ignore all rules'},{category:'unknown'},{depth:'arbitrary'},{prompt:'new prompt'},'{'])assert.equal((await post(bad)).status,400);
 assert.equal((await post(' '.repeat(4097))).status,413,'Bound bodies without a content-length header');
 const limited=load('src/app/api/generate-topics/route.ts',{'@/lib/rateLimit':{rateLimit:()=>Response.json({error:'limited'},{status:429})}});
 assert.equal((await limited.POST(new Request('https://example.test',{method:'POST',body:'{}'}))).status,429);
 const pool=topics.slice(0,13);let used=new Set();const seen=[];
 for(let i=0;i<13;i++){const d=drawUnseen(pool,used,t=>t.id,1);used=d.used;seen.push(d.picked[0].id);}
 assert.equal(new Set(seen).size,13,'Use the full matching pool before repeating');
 const fresh=drawUnseen(pool,used,t=>t.id,10);assert.equal(new Set(fresh.picked.map(t=>t.id)).size,10,'No duplicate within a new cycle batch');
 assert.equal(calls,0,'All valid filters, invalid requests, and stale clients incur zero model calls');
} finally {globalThis.fetch=originalFetch;}
console.log('PASS: curated draws across every filter combination, exact available counts, non-repeating cycles, zero provider calls, old-client compatibility, invalid-input and streamed-body bounds.');
