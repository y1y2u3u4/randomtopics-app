import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {load} from './lib/load-typescript.mjs';
const {default:config}=load('next.config.ts');
const asset=(await config.headers()).find(h=>h.source.includes('webmanifest'));
const {pathToRegexp}=createRequire(import.meta.url)('next/dist/compiled/path-to-regexp');
for(const path of ['/site.webmanifest','/generators/animals/cat.webp','/fonts/a.woff2'])assert.ok(pathToRegexp(asset.source).test(path));
assert.equal(asset.headers[0].value,'public, max-age=604800, stale-while-revalidate=86400');
assert.equal(JSON.parse(readFileSync('vercel.json')).ignoreCommand,'bash scripts/vercel-ignore-build.sh');
for(const file of readdirSync('src/app',{recursive:true}).filter(f=>f.endsWith('page.tsx'))){const match=readFileSync(`src/app/${file}`,'utf8').match(/export const revalidate = (\d+)/);if(match)assert.ok(Number(match[1])>=3600,file);}
let calls=0;const oldFetch=globalThis.fetch;
try{globalThis.fetch=async()=>{calls++;return Response.json({country:'IN',src:'fixture',id:'fixture'});};const {adslotConfiguration}=load('src/lib/adslotClient.ts');await Promise.all([adslotConfiguration(),adslotConfiguration(),adslotConfiguration()]);assert.equal(calls,1);}finally{globalThis.fetch=oldFetch;}
calls=0;
try {
 globalThis.fetch=async()=>{calls++;return Response.json({url:'https://fixture.invalid',key:'fixture',billingAvailable:true});};
 const client=load('src/lib/speech/client.ts',{'@supabase/supabase-js':{createClient(){return {auth:{}};}}});
 await Promise.all([client.speechClient(),client.speechBillingAvailable(),client.speechClient()]);
 assert.equal(calls,1,'speech configuration is shared across concurrent consumers');
}finally{globalThis.fetch=oldFetch;}
const teaser=readFileSync('src/components/SpeechPlanTeaser.tsx','utf8');
assert.match(teaser,/if \(!visible\) return;[\s\S]*speechBillingAvailable\(\)/);
assert.match(teaser,/\}, \[visible\]\)/);
assert.match(readFileSync('src/lib/speech/client.ts','utf8'),/configuration \?\?= fetch/);
console.log('PASS: asset headers, ISR floor, ignore wiring, geo deduplication, lazy speech configuration');
