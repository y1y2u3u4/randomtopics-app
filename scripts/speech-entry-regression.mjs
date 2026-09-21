import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const code = ts.transpileModule(readFileSync(new URL('../src/lib/speech/visibleAction.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
function fixture(kind = 'action') {
  let now = 0, nextId = 0, views = 0, connected = true;
  const timers = new Map(), listeners = new Map();
  const document = { visibilityState: 'visible', focused: true, hasFocus() { return this.focused; },
    addEventListener: (key, fn) => listeners.set(key, fn), removeEventListener: key => listeners.delete(key) };
  const window = { addEventListener: document.addEventListener, removeEventListener: document.removeEventListener };
  const button = { disabled: false, isConnected: true };
  let notify;
  const exports = {};
  new Function('exports', 'document', 'window', 'IntersectionObserver', 'setTimeout', 'clearTimeout', code)(exports, document, window,
    class { constructor(fn) { notify = fn; } observe() {} disconnect() { connected = false; } },
    (fn, delay) => { const id = ++nextId; timers.set(id, {at: now + delay, fn}); return id; }, id => timers.delete(id));
  const cleanup = kind === 'content' ? exports.observeVisibleContent(button, () => views++) : exports.observeVisibleAction(button, () => views++);
  const intersection = ratio => { if (connected) notify([{isIntersecting: ratio > 0, intersectionRatio: ratio}]); };
  function advance(ms) { const end = now + ms; for (;;) {
    const task = [...timers].filter(([,v]) => v.at <= end).sort((a,b) => a[1].at-b[1].at)[0];
    if (!task) break; now = task[1].at; timers.delete(task[0]); task[1].fn();
  } now = end; }
  return { button, document, intersection, advance, cleanup, listeners, views: () => views };
}
let f = fixture();
f.intersection(.01); f.advance(3000); assert.equal(f.views(), 0, 'an initial edge intersection is not exposure');
f.intersection(.5); f.advance(999); assert.equal(f.views(), 0);
f.advance(1); assert.equal(f.views(), 1, 'half of the usable action must stay visible for a full second');
f.intersection(1); f.advance(5000); assert.equal(f.views(), 1, 'one impression per mounted entry');
f.cleanup(); assert.equal(f.listeners.size, 0);
f = fixture(); f.intersection(1); f.advance(600); f.intersection(.49); f.advance(1000);
f.intersection(1); f.advance(999); assert.equal(f.views(), 0, 'separate glimpses must not accumulate');
f.advance(1); assert.equal(f.views(), 1); f.cleanup();
f = fixture(); f.intersection(1); f.advance(700); f.document.visibilityState='hidden'; f.listeners.get('visibilitychange')(); f.advance(5000);
f.document.visibilityState='visible'; f.listeners.get('visibilitychange')(); f.advance(999); assert.equal(f.views(), 0);
f.advance(1); assert.equal(f.views(), 1); f.cleanup();
f = fixture(); f.intersection(1); f.advance(700); f.document.focused=false; f.listeners.get('blur')(); f.advance(5000);
f.document.focused=true; f.listeners.get('focus')(); f.advance(999); assert.equal(f.views(), 0);
f.advance(1); assert.equal(f.views(), 1); f.cleanup();
f = fixture(); f.intersection(1); f.advance(999); f.button.disabled=true; f.advance(1); assert.equal(f.views(), 0, 'disabled actions do not qualify');
f.button.disabled=false; f.intersection(1); f.advance(500); f.cleanup(); f.advance(5000); assert.equal(f.views(), 0, 'unmount cancels pending impression');
console.log('PASS: initial sliver, continuous one-second exposure, scroll interruption, hidden tab, lost focus, disabled control, deduplication and cleanup.');
f = fixture('content');
f.intersection(1); f.advance(700); f.document.visibilityState='hidden'; f.listeners.get('visibilitychange')(); f.advance(3000);
assert.equal(f.views(),0,'Saved feedback in a background tab is not a view');
f.document.visibilityState='visible'; f.listeners.get('visibilitychange')(); f.advance(999); assert.equal(f.views(),0);
f.advance(1); assert.equal(f.views(),1); f.advance(2000); assert.equal(f.views(),1); f.cleanup();
assert.equal(f.listeners.size,0);
console.log('PASS: saved-feedback visibility requires one continuous foreground second and cleans up observers.');
