import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,chmodSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const dir=mkdtempSync(join(tmpdir(),'build-ignore-'));
writeFileSync(join(dir,'git'),'#!/bin/bash\n[ "${DIFF_FAIL:-}" != 1 ] || exit 128\nprintf "%s" "$DIFF_FILES"\n');
chmodSync(join(dir,'git'),0o755);
function check(env,files,expected){assert.equal(spawnSync('bash',['scripts/vercel-ignore-build.sh'],{env:{...process.env,PATH:`${dir}:${process.env.PATH}`,VERCEL_GIT_PREVIOUS_SHA:'old',VERCEL_ENV:'production',DIFF_FILES:files,...env}}).status,expected);}
try {
check({VERCEL_GIT_PREVIOUS_SHA:''},'docs/a.md',1);
check({VERCEL_GIT_PREVIOUS_SHA:'',VERCEL_ENV:'preview',VERCEL_GIT_COMMIT_REF:'feature/a'},'src/app/page.tsx',0);
check({VERCEL_GIT_PREVIOUS_SHA:'',VERCEL_ENV:'preview',VERCEL_GIT_COMMIT_REF:'preview/demo'},'docs/a.md',1);
check({},'docs/a.md\nREADME.md\ndata/snapshots/a.json\nreports/a.json',0);
check({},'docs/a.md\nsrc/app/page.tsx',1);
check({},'src/data/topics.json',1);
check({},'',1);check({DIFF_FAIL:'1'},'docs/a.md',1);
for(const branch of ['main','preview/demo'])check({VERCEL_ENV:'preview',VERCEL_GIT_COMMIT_REF:branch},'src/app/page.tsx',1);
check({VERCEL_ENV:'preview',VERCEL_GIT_COMMIT_REF:'feature/a'},'src/app/page.tsx',0);
console.log('PASS: 11 build-ignore history, branch, diff and fail-open cases');
} finally {rmSync(dir,{recursive:true,force:true});}
