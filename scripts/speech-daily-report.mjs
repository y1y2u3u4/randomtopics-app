// Owner-only reporting job: use the project's existing server credentials.
// Outputs aggregates only; never credentials, Stripe IDs, email or speech content.
import { load } from './lib/load-typescript.mjs';

const ga = load('src/lib/googleReporting.ts');
const { productionFilter } = load('src/lib/speech/report.ts');
const result = { generatedAt: new Date().toISOString() };
async function capture(name, fn) {
  try { result[name] = await fn(); }
  catch (error) {
    result[name] = { unavailable: true, code: String(error?.code || error?.type || error?.name || 'error').replace(/[^A-Za-z0-9_]/g, '').slice(0, 80) };
  }
}
const probe = await ga.runGaReport({ startDate: 'today', endDate: 'today', dimensionFilter: productionFilter, metrics: ['totalUsers'] });
const propertyZone = probe.metadata?.timeZone;
if (!propertyZone) throw new Error('Reporting time zone unavailable');
const now = process.env.SPEECH_REPORT_UNTIL ? new Date(process.env.SPEECH_REPORT_UNTIL) : new Date();
if (!Number.isFinite(now.getTime()) || now.getTime() > Date.now()) throw new Error('Invalid reporting cutoff');
function parts(date, zone) {
  return Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' }).formatToParts(date).map(p => [p.type, p.value]));
}
const china = parts(now, 'Asia/Shanghai');
const start = new Date(`${china.year}-${china.month}-${china.day}T00:00:00+08:00`);
const hours = [];
for (let time = start.getTime(); time <= now.getTime(); time += 3600000) {
  const p = parts(new Date(time), propertyZone);
  hours.push(`${p.year}${p.month}${p.day}${p.hour}`);
}
const dateFromHour = h => `${h.slice(0, 4)}-${h.slice(4, 6)}-${h.slice(6, 8)}`;
const window = { startDate: dateFromHour(hours[0]), endDate: dateFromHour(hours.at(-1)), dimensionFilter: { filter: { fieldName: 'dateHour', inListFilter: { values: hours } } } };
result.window = { reportTimeZone: 'Asia/Shanghai', propertyTimeZone: propertyZone, start: start.toISOString(), end: now.toISOString(), propertyHours: hours };
const base = { ...window, dimensionFilter: { andGroup: { expressions: [productionFilter, window.dimensionFilter] } } };
// One aggregate preserves distinct users across the property's midnight boundary.
await capture('siteToday', () => ga.runGaReport({ ...base, metrics: ['activeUsers', 'totalUsers', 'sessions', 'screenPageViews', 'engagedSessions', 'eventCount'] }));
await capture('sourcesToday', () => ga.runGaReport({ ...base, dimensions: ['sessionSourceMedium'], metrics: ['totalUsers', 'sessions', 'engagedSessions'], limit: 20, orderBys: [{ metric: { metricName: 'sessions' }, desc: true }] }));
await capture('pagesToday', () => ga.runGaReport({ ...base, dimensions: ['pagePath'], metrics: ['totalUsers', 'sessions', 'screenPageViews'], limit: 30, orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }] }));
await capture('siteEventsToday', () => ga.runGaReport({ ...base, dimensions: ['eventName'], metrics: ['eventCount', 'totalUsers', 'sessions'], limit: 100, orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }] }));
await capture('speechToday', () => ga.getSpeechReport(0, true, window));
const billing = load('src/lib/speech/billing.ts');
await capture('liveReadiness', async () => {
  const api = billing.stripe(false, { timeout: 10000, maxNetworkRetries: 0 });
  const price = await billing.speechPrice(api);
  const portal = await api.billingPortal.configurations.retrieve(billing.billingConfiguration().portalConfiguration);
  return { ready: billing.billingReady(), live: price.livemode, amount: price.unit_amount, currency: price.currency, interval: price.recurring.interval, portalActive: portal.active, cancellation: portal.features.subscription_cancel.mode, origin: billing.siteUrl() };
});
await capture('stripeCheckouts24h', () => load('src/lib/speech/purchases.ts').checkoutConversionReport(1));
// ASCII avoids replacement characters when provider log frames split UTF-8 text.
const encoded = JSON.stringify(result).replace(/[\u007f-\uffff]/g, char => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`);
for (let offset = 0; offset < encoded.length; offset += 1800) console.log(`RANDOMTOPICS_REPORT_CHUNK_${offset / 1800}=` + encoded.slice(offset, offset + 1800));
console.log('RANDOMTOPICS_REPORT_CHUNKS=' + Math.ceil(encoded.length / 1800));
