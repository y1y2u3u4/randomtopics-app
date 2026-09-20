import assert from 'node:assert/strict';
import { load } from './lib/load-typescript.mjs';
const now = Math.floor(Date.now() / 1000);
const config = { livemode: false, priceId: 'price_speech' };
let pages = [];
const api = { checkout: { sessions: { list: async () => pages.shift() } } };
const purchases = load('src/lib/speech/purchases.ts', {
  './billing': {
    SPEECH_PRODUCT: 'randomtopics_speech', billingConfiguration: () => config,
    billingManagementReady: () => true, stripe: () => api,
  },
});
const paid = {
  id: 'cs_test_paid', mode: 'subscription', livemode: false, status: 'complete',
  payment_status: 'paid', currency: 'usd', amount_total: 1200, created: now - 60,
  client_reference_id: 'owner', metadata: { product: 'randomtopics_speech', price_id: 'price_speech', user_id: 'owner' },
};
assert.equal(purchases.isPaidSpeechCheckout(paid), true);
for (const patch of [{payment_status:'unpaid'}, {status:'open'}, {amount_total:0}, {amount_total:900}, {currency:'eur'}, {livemode:true}, {client_reference_id:'other'}, {metadata:{...paid.metadata,price_id:'price_other'}}]) {
  assert.equal(purchases.isPaidSpeechCheckout({...paid,...patch}), false);
}
pages = [{data:[paid],has_more:false}];
assert.equal(await purchases.latestSpeechPurchase('cus_owner','other'), null);
pages = [{data:[paid],has_more:false}];
const receipt = await purchases.latestSpeechPurchase('cus_owner','owner');
assert.equal(receipt.value,12);
assert.match(receipt.transactionId,/^[a-f0-9]{64}$/);
assert.equal(JSON.stringify(receipt).includes('cs_test_paid'),false);
assert.equal(JSON.stringify(receipt).includes('owner'),false);
pages = [
  {data:[paid,{...paid,id:'cs_open',status:'open',payment_status:'unpaid'}],has_more:true},
  {data:[{...paid,id:'cs_old',created:now-172800},{...paid,id:'cs_other',client_reference_id:'new',metadata:{...paid.metadata,user_id:'new'}},{...paid,id:'cs_wrong',livemode:true}],has_more:false},
];
const report = await purchases.checkoutConversionReport(1);
assert.equal(report.complete,true);
assert.equal(report.checkouts,3);
assert.equal(report.paid,2);
assert.equal(report.open,1);
assert.equal(report.paidCustomers,2);
assert.equal(report.firstPaidCustomers,1);
assert.equal(report.repeatPaidCheckouts,1);
assert.equal(report.grossUsd,24);
assert.equal(JSON.stringify(report).includes('cs_'),false);
console.log('PASS: payment truth rejects unpaid/wrong-mode/wrong-price/zero-value/foreign-owner sessions; opaque receipt and paginated first/repeat checkout cohorts.');
