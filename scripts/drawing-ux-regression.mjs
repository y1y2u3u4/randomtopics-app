import assert from 'node:assert/strict';
const {load}=await import('./lib/load-typescript.mjs');
const {DRAWING_PROMPTS,DEFAULT_DRAWING_PROMPT}=load('src/data/drawingPrompts.ts');const{DRAWING_REFERENCES}=load('src/lib/drawingReferences.ts');const {pickDrawings,drawingPool}=load('src/lib/drawing.ts');
assert.equal(DRAWING_PROMPTS.length,48);assert.equal(DEFAULT_DRAWING_PROMPT.id,'everyday-1');assert.equal(DEFAULT_DRAWING_PROMPT.difficulty,'easy');assert.equal(Object.keys(DRAWING_REFERENCES).length,9);
for(const id of Object.keys(DRAWING_REFERENCES)){const p=DRAWING_PROMPTS.find(p=>p.id===id);assert.ok(p);assert.equal(p.difficulty,'easy')}
for(const id of ['people-1','people-2','people-3','nature-1'])assert.equal(DRAWING_PROMPTS.find(p=>p.id===id).difficulty,'challenge');
assert.ok(!DRAWING_PROMPTS.some(p=>/three values|foreshorten|vanishing point|own shadow/i.test(p.hint+' '+p.text)));
const seen=[DEFAULT_DRAWING_PROMPT.id];for(let i=0;i<47;i++){const[p]=pickDrawings(DRAWING_PROMPTS,seen,1,()=>0);assert.ok(p);seen.push(p.id)}assert.equal(new Set(seen).size,48);assert.equal(pickDrawings(DRAWING_PROMPTS,seen,1).length,0);assert.equal(drawingPool('fantasy','easy').length,0);
console.log('PASS: immediate easy starter, nine corresponding easy guides, difficulty calibration, plain-language hints and full cycle excluding the shown starter.');
