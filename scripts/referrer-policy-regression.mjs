// Referrer policy vs ads (2026-11-25): /speech/:path* sent `no-referrer`, so
// Google's CMP loader (fundingchoicesmessages /i/) could not identify the site,
// stayed inactive (no __tcfapi), and ad_cov showed cmp_silent on /speech.
// Every public ad path must send at least its origin; private speech routes
// (practice attempt IDs, account) keep `no-referrer`.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from './lib/load-typescript.mjs';

const config=load('next.config.ts').default;
const rules=await config.headers();
const toRegex=source=>new RegExp('^'+source
  .replace(/\/:path\*/g,'(?:/.*)?')
  .replace(/:path\*/g,'.*')
  .replace(/:[a-z]+/gi,'[^/]+')+'$');
// Next: when several rules set the same key, the last matching one wins.
const policy=path=>{
  let value;
  for(const rule of rules) if(toRegex(rule.source).test(path))
    for(const h of rule.headers) if(h.key.toLowerCase()==='referrer-policy') value=h.value;
  return value;
};

const publicPaths=JSON.parse(readFileSync('src/data/adPublicPaths.json','utf8'));
const blocked=publicPaths.filter(p=>policy(p)==='no-referrer');
assert.deepEqual(blocked,[],`public ad paths must not send no-referrer (CMP stays inactive): ${blocked.join(', ')}`);
for(const p of ['/speech','/speech/persuasive','/speech/informative'])
  assert.equal(policy(p),'strict-origin',`${p} sends only the origin, never path or query`);
for(const p of ['/speech/account','/speech/account/billing','/speech/practice','/speech/practice/x','/account','/internal/x','/api/internal/x'])
  assert.equal(policy(p),'no-referrer',`${p} stays no-referrer`);
console.log(`referrer-policy-regression: ${publicPaths.length} public ad paths send an origin; private routes stay no-referrer`);
