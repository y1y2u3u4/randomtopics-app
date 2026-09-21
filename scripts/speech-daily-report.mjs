// Owner-only reporting job: use the project's existing server credentials.
// Outputs aggregates only; never credentials, Stripe IDs, email or speech content.
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { load } from './lib/load-typescript.mjs';

const temporary = 'src/lib/analytics-report-job.generated.ts';
let ga;
try {
  writeFileSync(temporary, readFileSync('src/lib/googleReporting.ts', 'utf8') + '\nexport { runGaReport as diagnosticsReport };', { flag: 'wx' });
  ga = load(temporary);
} finally {
  if (ga) unlinkSync(temporary);
}
const { productionFilter } = load('src/lib/speech/report.ts');
const result = { generatedAt: new Date().toISOString() };
async function capture(name, fn) {
  try { result[name] = await fn(); }
  catch (error) {
    result[name] = { unavailable: true, code: String(error?.code || error?.type || error?.name || 'error').replace(/[^A-Za-z0-9_]/g, '').slice(0, 80) };
  }
}
const base = { startDate: 'today', endDate: 'today', dimensionFilter: productionFilter };
await capture('siteToday', () => ga.diagnosticsReport({ ...base, dimensions: ['date'], metrics: ['activeUsers', 'totalUsers', 'sessions', 'screenPageViews', 'engagedSessions', 'eventCount'] }));
await capture('sourcesToday', () => ga.diagnosticsReport({ ...base, dimensions: ['sessionSourceMedium'], metrics: ['totalUsers', 'sessions', 'engagedSessions'], limit: 20, orderBys: [{ metric: { metricName: 'sessions' }, desc: true }] }));
await capture('pagesToday', () => ga.diagnosticsReport({ ...base, dimensions: ['pagePath'], metrics: ['totalUsers', 'sessions', 'screenPageViews'], limit: 30, orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }] }));
await capture('siteEventsToday', () => ga.diagnosticsReport({ ...base, dimensions: ['eventName'], metrics: ['eventCount', 'totalUsers', 'sessions'], limit: 100, orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }] }));
await capture('speechToday', () => ga.getSpeechReport(0, true));
await capture('speechYesterday', () => ga.getSpeechReport(1, true));
const billing = load('src/lib/speech/billing.ts');
await capture('liveReadiness', async () => {
  const api = billing.stripe(false, { timeout: 10000, maxNetworkRetries: 0 });
  const price = await billing.speechPrice(api);
  const portal = await api.billingPortal.configurations.retrieve(billing.billingConfiguration().portalConfiguration);
  return { ready: billing.billingReady(), live: price.livemode, amount: price.unit_amount, currency: price.currency, interval: price.recurring.interval, portalActive: portal.active, cancellation: portal.features.subscription_cancel.mode, origin: billing.siteUrl() };
});
await capture('stripeCheckouts24h', () => load('src/lib/speech/purchases.ts').checkoutConversionReport(1));
console.log('RANDOMTOPICS_REPORT_V1=' + JSON.stringify(result));
