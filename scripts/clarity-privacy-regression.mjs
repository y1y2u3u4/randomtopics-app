import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from './lib/load-typescript.mjs';
const {replayMayStart}=load('src/lib/analyticsEnvironment.ts');
const base={project:'fixture123',ready:true,consent:'allowed',path:'/speech',host:'randomtopics.app',search:'',hash:''};
assert.equal(replayMayStart(base),true);
for(const override of [{project:''},{ready:false},{consent:'unknown'},{consent:'denied'},{path:'/speech/account'},{path:'/internal/analytics'},{path:'/share'},{host:'localhost'},{search:'?topic=private'},{hash:'#token'}]) assert.equal(replayMayStart({...base,...override}),false);
const replay=readFileSync('src/components/ClarityReplay.tsx','utf8');
assert.equal((replay.match(/document.head.appendChild\(script\)/g)||[]).length,1);
assert.ok(replay.includes('if (!window.clarity)'));
assert.ok(replay.includes('analytics_Storage: "denied", ad_Storage: "denied"'));
assert.ok(replay.includes('window.clarity?.("stop")'));
for(const file of ['SpeechCoach','SpeechFeedbackResult','SpeechPracticePanel','SpeechAccount','SpeechAnswerCard']) {
 const source=readFileSync(`src/components/${file}.tsx`,'utf8');
 assert.match(source,/data-clarity-mask="true"/);
 assert.ok(!source.includes('data-clarity-unmask'));
}
console.log('PASS: executable consent/path/URL gate; source assertions for single loader, withdrawal stop and sensitive subtree masking. No Clarity script/network loaded.');
