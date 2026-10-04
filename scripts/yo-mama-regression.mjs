import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { load } from './lib/load-typescript.mjs';
const data=load('src/data/yoMama.ts');
const {YO_MAMA_JOKES:jokes,YO_MAMA_THEMES:themes,YO_MAMA_SETUPS:setups,YO_MAMA_ENDINGS:endings,cleanJokePool,remixPool,pickUnseenJoke}=data;
const normalized=s=>s.normalize('NFKC').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
assert.equal(jokes.length,72);assert.equal(setups.length,24);assert.equal(endings.length,24);
for(const items of [jokes,setups,endings]){
 assert.equal(new Set(items.map(x=>x.id)).size,items.length);
 assert.equal(new Set(items.map(x=>normalized(x.text))).size,items.length);
 assert.ok(items.every(x=>x.text.trim()===x.text&&x.text.length>20));
}
assert.ok(jokes.every(x=>x.text.startsWith('Yo mama')));
const all=remixPool('all');assert.equal(all.length,576);assert.equal(new Set(all.map(x=>x.text)).size,576);
assert.ok(all.every(x=>x.text===`Yo mama ${x.setup.text} — now ${x.ending.text}.`));
for(const theme of themes){assert.equal(cleanJokePool(theme.id).length,12);assert.equal(remixPool(theme.id).length,16);assert.ok(remixPool(theme.id).every(x=>x.setup.theme===theme.id&&x.ending.theme===theme.id));}
for(const pool of [jokes,all,...themes.map(t=>cleanJokePool(t.id)),...themes.map(t=>remixPool(t.id))]){
 const seen=new Set(),before=JSON.stringify(pool);
 for(let i=0;i<pool.length;i++){const next=pickUnseenJoke(pool,seen,()=>.47);assert.ok(next&&!seen.has(next.id));seen.add(next.id);}
 assert.equal(pickUnseenJoke(pool,seen),undefined,'Exhaustion never silently resets history');assert.equal(JSON.stringify(pool),before);
}
const seen=new Set(),tech=cleanJokePool('tech');for(let i=0;i<12;i++)seen.add(pickUnseenJoke(tech,seen,()=>0).id);
assert.equal(pickUnseenJoke(tech,seen),undefined);assert.ok(!seen.has(pickUnseenJoke(jokes,seen).id));assert.equal(seen.size,12);
const first=all[0],fixedSetup=remixPool('all',{setup:first.setup.id}),fixedEnding=remixPool('all',{ending:first.ending.id});
assert.equal(fixedSetup.length,24);assert.equal(fixedEnding.length,24);assert.ok(fixedSetup.every(x=>x.setup.id===first.setup.id));assert.ok(fixedEnding.every(x=>x.ending.id===first.ending.id));
assert.equal(remixPool('snacks',{setup:first.setup.id}).length,0);assert.equal(pickUnseenJoke([],new Set()),undefined);
// Exact full-line overlap with the existing checked-in data, not an internet uniqueness claim.
const dir=resolve('src/data');const other=readdirSync(dir).filter(f=>/\.tsx?$/.test(f)&&f!=='yoMama.ts').map(f=>normalized(readFileSync(resolve(dir,f),'utf8'))).join(' ');
assert.ok(jokes.every(joke=>!other.includes(normalized(joke.text))),'No copied full line from existing site collections');
const forbidden=/\b(fat|ugly|stupid|idiot|dumb|slut|whore|retard|cancer|disabled|autistic|poor|broke)\b/i;
assert.ok([...jokes,...setups,...endings].every(x=>!forbidden.test(x.text)),'Editorial smoke check, supplemented by manual review');
const {INTENT_OWNERS,inObservationWindow}=load('src/lib/growthOpportunities.ts');
for(const q of ['yo mama randomizer','yo momma randomizer','yo mama joke generator','random yo mama joke generator'])assert.equal(INTENT_OWNERS.find(r=>r.match.test(q))?.path,'/yo-mama-randomizer');
assert.equal(inObservationWindow('/yo-mama-randomizer','2026-10-10'),true);assert.equal(inObservationWindow('/yo-mama-randomizer','2026-10-18'),false);
const {isEnOnly,hreflangAlternates}=load('src/i18n/config.ts');assert.equal(isEnOnly('/yo-mama-randomizer'),true);assert.ok(!('es' in hreflangAlternates('/yo-mama-randomizer')));
assert.equal(load('src/lib/analyticsEnvironment.ts').replayPathAllowed('/yo-mama-randomizer'),false,'The new route does not expand session replay');
console.log('PASS Yo Mama: 72 distinct clean jokes, 24+24 original parts, all 576 unique pairings, six real pools, full exhaustion, cross-filter history, locked-part remix, source overlap, editorial smoke, one intent owner and English-only metadata.');
