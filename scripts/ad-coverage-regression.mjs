// Ad coverage beacon (2026-11-25): bucket/props contract and layout wiring.
// AdSense counted ~60% of Umami views; ad_cov says where the runtime stopped.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from './lib/load-typescript.mjs';

const c=load('src/lib/adCoverage.ts',{},new Map());
assert.deepEqual([undefined,-1,0,999,1500,2500,4000,9000,12000,45000].map(c.msBucket),
  ['none','none','<1s','<1s','1-2s','2-3s','3-5s','5-10s','10-30s','30s+']);
assert.deepEqual(c.adCoverageProps({stage:'waiting_settle',marks:{load:300},elapsedMs:1800,openedAs:'visible',path:'/conversation'}),
  {reason:'waiting_settle',seconds:'1-2s',slot:'none',from:'visible',page_path:'/conversation'});
assert.equal(c.adCoverageProps({stage:'script_timeout',marks:{slow:10400,late:12000},elapsedMs:20000,openedAs:'visible',path:'/'}).reason,'script_late');
assert.equal(c.adCoverageProps({stage:'requested',marks:{request:1840},elapsedMs:9000,openedAs:'hidden',path:'/'}).slot,'1-2s');
assert.ok(c.adCoverageSampled(0)&&!c.adCoverageSampled(c.AD_COVERAGE_SAMPLE)&&!c.adCoverageSampled(0.99));

// Every key must be one Umami already accepts from this site (track.ts umamiProps).
const track=readFileSync('src/lib/track.ts','utf8');
for(const key of Object.keys(c.adCoverageProps({stage:'x',marks:{},elapsedMs:0,openedAs:'visible',path:'/'})))
  assert.ok(track.includes(`"${key}"`),`umami key ${key} is whitelisted`);

// Mounted once at layout level next to the Auto ads bootstrap, so every page
// template (manual unit or Auto ads only) reports.
const layout=readFileSync('src/app/layout.tsx','utf8');
assert.equal((layout.match(/<AdCoverageBeacon \/>/g)||[]).length,1);
assert.match(layout,/adsEnabled && <AdCoverageBeacon \/>/);
const beacon=readFileSync('src/components/AdCoverageBeacon.tsx','utf8');
assert.match(beacon,/pagehide/);assert.match(beacon,/visibilitychange/);
assert.doesNotMatch(beacon,/loadAdSense|adsbygoogle|pauseAdRequests/,'beacon must not touch ad requests');

// consentBlocker must agree with advertisingConsent on every input combination.
const consent=load('src/lib/adConsent.ts',{},new Map());
const statuses=['unavailable','unknown','not-applicable','not-opted-out','opted-out'];
const datas=[undefined,{},{cmpStatus:'loading',gdprApplies:false},{cmpStatus:'loaded'},{cmpStatus:'loaded',gdprApplies:false},
  {cmpStatus:'loaded',gdprApplies:true,eventStatus:'cmpuishown'},
  {cmpStatus:'loaded',gdprApplies:true,eventStatus:'tcloaded',purpose:{consents:{1:true}},vendor:{consents:{755:true}}},
  {cmpStatus:'loaded',gdprApplies:true,eventStatus:'useractioncomplete',purpose:{consents:{1:false}},vendor:{consents:{755:true}}},
  {cmpStatus:'loaded',gdprApplies:true,eventStatus:'useractioncomplete',purpose:{consents:{1:true}},vendor:{consents:{}}}];
let combos=0;
for(const d of datas)for(const us of statuses)for(const gpp of statuses){combos++;
  const allowed=consent.advertisingConsent(d,us,gpp),blocker=consent.consentBlocker(d,us,gpp);
  assert.equal(blocker===null,allowed,`lockstep ${JSON.stringify(d)} ${us} ${gpp} -> ${blocker}`);}
assert.equal(consent.consentBlocker(undefined,'unavailable'),'cmp_missing');
assert.equal(consent.consentBlocker({cmpStatus:'loaded',gdprApplies:false},'not-opted-out','unavailable'),'us_no_gpp');
assert.equal(consent.consentBlocker({cmpStatus:'loaded',gdprApplies:false},'unknown','unavailable'),'us_unknown');
console.log(`PASS: ad coverage beacon contract; consentBlocker lockstep over ${combos} combinations`);
