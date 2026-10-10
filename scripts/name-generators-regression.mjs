import assert from 'node:assert/strict';
import { load } from './lib/load-typescript.mjs';
const { BAND_NAMES, DRAGON_NAMES, NAME_STYLES } = load('src/data/nameGenerators.ts');
const lib = load('src/lib/nameGenerator.ts');
const { COUNTRY_ITEMS } = load('src/data/randomPickers.ts');
const { adPageAllowed } = load('src/lib/adsense.ts');
const { isEnOnly, hreflangAlternates } = load('src/i18n/config.ts');
const { defaultNameOptions, namePool, drawNames, resolveName, validateNameOptions, freshNameRound, restoreNameRound, restoreNameShortlist, normalizeName, nameEventParams } = lib;
let checks = 0;
const test = (name, fn) => { fn(); checks++; console.log('PASS ' + name); };
test('Authored corpus counts, normalized uniqueness, independent country ownership and accurate length labels', () => {
  assert.equal(BAND_NAMES.length, 108); assert.equal(DRAGON_NAMES.length, 48);
  const country = new Set(COUNTRY_ITEMS.map(row => normalizeName(row.name).replaceAll(' ', '')));
  for (const [kind, recipes] of [['band', BAND_NAMES], ['dragon', DRAGON_NAMES]]) {
    assert.equal(new Set(recipes.map(row => row.id)).size, recipes.length);
    assert.equal(namePool(kind, defaultNameOptions()).length, recipes.length);
    for (const row of recipes) {
      assert.ok(!country.has(normalizeName(row.name).replaceAll(' ', '')));
      if (kind === 'band') {
        assert.equal(row.name.split(' ').length, Number(row.length));
        assert.equal(row.seedPattern.split('{seed}').length, 2);
      } else { assert.equal(row.length, row.name.length <= 6 ? 'short' : 'long'); assert.ok(row.pronunciation && row.title); }
    }
  }
  assert.equal(new Set(DRAGON_NAMES.map(row => row.title)).size, 48);
  for (const style of NAME_STYLES.band) for (const length of ['1','2','3']) assert.equal(namePool('band', {...defaultNameOptions(), style: style.id, length}).length, 12);
  for (const style of NAME_STYLES.dragon) for (const length of ['short','long']) assert.equal(namePool('dragon', {...defaultNameOptions(), style: style.id, length}).length, 6);
});
test('Seed recipes always use the word, preserve length, and dedupe across spacing and styles', () => {
  for (const seed of ['Moon','ember','Luma','Äther','夜']) {
    const pool = namePool('band', {...defaultNameOptions(), seed});
    assert.equal(new Set(pool.map(row => row.identity)).size, pool.length);
    assert.ok(pool.every(row => normalizeName(row.name).includes(normalizeName(seed))));
    for (const row of pool) assert.equal(row.name.split(' ').length, Number(row.length));
    assert.ok(pool.length > 70);
  }
  const limited = namePool('band', {...defaultNameOptions(), seed: 'Moon', avoid: 'relay, PAPER, after'});
  assert.ok(limited.length > 0);
  assert.ok(limited.every(row => !/relay|paper|after/i.test(row.name)));
  assert.equal(namePool('band', {...defaultNameOptions(), seed: 'Moon', avoid: 'moon'}).length, 0);
});
test('Invalid inputs are rejected; dragon has no hidden seed/avoid influence', () => {
  for (const patch of [{seed:'two words'}, {seed:'<img>'}, {seed:'x'.repeat(21)}, {avoid:'a,b,c,d,e,f'}, {avoid:'!!!'}, {style:'secret'}, {length:'100'}, {count:999}])
    assert.ok(validateNameOptions('band', {...defaultNameOptions(),...patch}).error);
  assert.deepEqual(validateNameOptions('dragon', {...defaultNameOptions(), seed:'Moon', avoid:'moon'}).value, defaultNameOptions());
  assert.equal(validateNameOptions('band', {...defaultNameOptions(), seed:' ＭＯＯＮ '}).value.seed, 'MOON');
});
test('A complete round, filter switches, title switches and explicit reset keep honest no-repeat boundaries', () => {
  for (const kind of ['band','dragon']) {
    const initial=freshNameRound(kind), seen=[...initial.seen], all=namePool(kind,initial.options);
    while (seen.length < all.length) {
      const next=drawNames(all,seen,5,()=>0); assert.ok(next.length); seen.push(...next.map(row=>row.identity));
    }
    assert.equal(new Set(seen).size,all.length); assert.equal(drawNames(all,seen,5).length,0);
    assert.equal(drawNames(all,seen.slice(0,-2),5).length,2);
  }
  const options={...defaultNameOptions(),style:'ember',length:'short'};
  const before=namePool('dragon',options), without=namePool('dragon',{...options,withTitle:false});
  assert.deepEqual(before.map(x=>x.identity),without.map(x=>x.identity));
  assert.ok(before.every((x,i)=>x.display!==without[i].display));
  assert.equal(drawNames(without,before.map(x=>x.identity),5).length,0);
  const reset=freshNameRound('dragon',options,Date.now(),false); assert.equal(reset.results.length,0);assert.equal(reset.seen.length,0);
});
test('Round persistence validates schema, TTL, results, seed and membership without inventing a generation', () => {
  const now=100000000, initial=freshNameRound('band',defaultNameOptions(),now);
  assert.deepEqual(restoreNameRound('band',JSON.stringify(initial),now+1),initial);
  assert.equal(restoreNameRound('band',JSON.stringify(initial),now+24*3600000+1),null);
  for (const patch of [{version:0},{updated:now+100},{seen:['other:bad']},{results:[{id:'missing',seed:'',withTitle:false}]},{options:{...initial.options,seed:'different'}},{results:[...initial.results,...initial.results]}])
    assert.equal(restoreNameRound('band',JSON.stringify({...initial,...patch}),now),null);
  assert.equal(restoreNameRound('band','{broken',now),null);
  const repaired=restoreNameRound('band',JSON.stringify({...initial,seen:[]}),now);
  assert.equal(repaired.seen.length,1,'Displayed results still count in the round');
  assert.equal(repaired.generated,false);
});
test('Shortlist stores only valid recipe references, dedupes display variants and keeps tools separate', () => {
  const first=freshNameRound('dragon').results[0];
  const saved=restoreNameShortlist('dragon',JSON.stringify({version:1,items:[first,{...first,withTitle:false},{id:'injected',seed:'',withTitle:false}]}));
  assert.equal(saved.length,1); assert.equal(resolveName('dragon',saved[0]).display,resolveName('dragon',first).display);
  assert.deepEqual(restoreNameShortlist('band',JSON.stringify({version:1,items:saved})),[]);
  assert.deepEqual(restoreNameShortlist('band','{broken'),[]);
});
test('Event parameters contain enums/counts only, no raw input, names, IDs or shortlist content', () => {
  const params=nameEventParams('band',{...defaultNameOptions(),seed:'Secretseed',avoid:'privateterm'});
  const serialized=JSON.stringify(params);
  for (const forbidden of ['Secretseed','privateterm','Paperwake','band-indie-1-0']) assert.ok(!serialized.includes(forbidden));
  assert.equal(params.has_seed,true);assert.equal(params.has_avoid_words,true);assert.equal(params.result_type,'name');
});
test('Both standalone intents are English-only and remain outside the ad whitelist', () => {
  for (const kind of ['band','dragon']) {const path=`/${kind}-name-generator`;assert.equal(isEnOnly(path),true);assert.equal(adPageAllowed(path),false);assert.deepEqual(Object.keys(hreflangAlternates(path)),['en','x-default']);}
});
console.log(`${checks} name corpus, state, privacy and ownership groups passed.`);
