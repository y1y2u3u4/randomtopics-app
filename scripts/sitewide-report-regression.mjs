import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const calls = [];
let fail = false;
const reporting = {
  getGoogleReportingAccessToken: async () => 'synthetic',
  querySearchConsole: async (args) => {
    if (fail) throw new Error('upstream');
    calls.push(args);
    if (args.dimensions?.[0] === 'date') return { rows: [{ keys: ['2026-09-18'] }] };
    return { rows: [{ keys: args.dimensions.map(d => d === 'query' ? '=not-a-formula' : 'synthetic'), clicks: 12, impressions: 100, ctr: .12, position: 3 }] };
  },
  runGaReport: async (args) => {
    calls.push(args);
    assert.deepEqual(args.dimensionFilter.filter.inListFilter.values, ['randomtopics.app', 'www.randomtopics.app']);
    if (args.dimensions?.[0] === 'date') return { rows: [{ dimensionValues: [{ value: '20260919' }] }], metadata: { timeZone: 'America/New_York' } };
    return { rowCount: 1, metadata: { timeZone: 'America/New_York', subjectToThresholding: true }, rows: [{ dimensionValues: args.dimensions.map(() => ({ value: 'synthetic' })), metricValues: args.metrics.map(() => ({ value: '10' })) }] };
  },
};
const writes = [];
const fetch = async (url, options) => {
  const body = options.body && JSON.parse(options.body);
  writes.push({ url, body });
  return { ok: true, json: async () => url.includes('?fields=') ? { sheets: [] } : {} };
};
const code = ts.transpileModule(readFileSync(new URL('../src/lib/sitewideReporting.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const mod = { exports: {} };
new Function('require','module','exports','fetch','process',code)(id => id === 'server-only' ? {} : reporting, mod, mod.exports, fetch, { env: { ANALYTICS_REPORT_SHEET_ID: 'synthetic_private_sheet' } });
const windows = mod.exports.reportWindows('2026-03-01');
assert.deepEqual(windows[0], { period:'current7',startDate:'2026-02-23',endDate:'2026-03-01' });
assert.equal(windows[1].endDate,'2026-02-22');
const result = await mod.exports.syncSitewideReport();
assert.equal(result.gaEnd,'2026-09-19');
assert.equal(result.gscEnd,'2026-09-18');
assert.equal(result.tables.length,13);
const batches = writes.filter(w => w.body?.valueInputOption);
assert.ok(batches.every(w => w.body.valueInputOption === 'RAW'));
assert.equal(batches.at(-1).body.data[0].range,"'Report Coverage'!A1");
assert.ok(batches.find(w => w.body.data[0].range === "'GSC Queries'!A1").body.data[0].values.some(r => r.includes('=not-a-formula')));
assert.ok(calls.some(c => c.dimensions.includes('landingPage')));
assert.ok(calls.some(c => c.dimensions.includes('sessionSourceMedium')));
assert.ok(calls.some(c => c.dimensions.includes('pagePath') && c.dimensions.includes('eventName')));
assert.ok(calls.filter(c => c.dimensions.includes('query') && c.dimensions.includes('page')).length === 2);
for (const b of batches) { const rows = b.body.data[0].values; assert.ok(rows.every(r => r.length === rows[0].length)); }
const before = writes.length;
fail = true;
await assert.rejects(mod.exports.syncSitewideReport());
assert.equal(writes.length,before,'Read failure must not erase previous reports');
console.log('PASS sitewide: independent date windows, all dimensions, private-host filter, RAW query values, completion marker, upstream failure preserves prior snapshot.');
