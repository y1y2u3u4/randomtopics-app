import assert from 'node:assert/strict';
import {load} from './lib/load-typescript.mjs';
const {initialUsAdAvailability:availability,readInitialUsAdStatus:read,gppAdStatus:gpp}=load('src/lib/usAdSignal.ts');
const {advertisingConsent:allowed}=load('src/lib/adConsent.ts');
let count=0;const eq=(actual,expected)=>{assert.deepEqual(actual,expected);count++};
const enumeration={UNKNOWN:0,DOES_NOT_APPLY:1,NOT_OPTED_OUT:2,OPTED_OUT:3};
const api=value=>({getInitialUsStatesOptOutStatus:()=>value,InitialUsStatesOptOutStatusEnum:enumeration});
eq(availability(undefined),'unavailable');eq(availability({}),'unavailable');eq(availability(api(2)),'unknown');eq(read(undefined),'unavailable');eq(read({}),'unavailable');
for(const [value,status] of [[0,'unknown'],[1,'not-applicable'],[2,'not-opted-out'],[3,'opted-out']])eq(read(api(value)),status);
for(const value of [undefined,null,'2',4,NaN,Infinity])eq(read(api(value)),'unknown');
for(const invalid of [{getInitialUsStatesOptOutStatus:()=>2},{InitialUsStatesOptOutStatusEnum:enumeration},{...api(2),getInitialUsStatesOptOutStatus:()=>{throw Error('synthetic')}},{...api(2),InitialUsStatesOptOutStatusEnum:{UNKNOWN:0,DOES_NOT_APPLY:1,NOT_OPTED_OUT:2,OPTED_OUT:2}}])eq(read(invalid),'unknown');
eq(read({...api(12),InitialUsStatesOptOutStatusEnum:{UNKNOWN:10,DOES_NOT_APPLY:11,NOT_OPTED_OUT:12,OPTED_OUT:13}}),'not-opted-out');
const clear={gppVersion:'1.1',cmpStatus:'loaded',signalStatus:'ready',applicableSections:[7],supportedAPIs:['7:usnat'],parsedSections:{usnat:[{SaleOptOut:2,SharingOptOut:2,TargetedAdvertisingOptOut:2},{Gpc:false}]}};
eq(gpp(clear),'not-opted-out');eq(gpp({...clear,applicableSections:[-1],parsedSections:{}}),'not-applicable');
for(const field of ['SaleOptOut','SharingOptOut','TargetedAdvertisingOptOut']){
 for(const value of [0,1,2,3,'1',null])eq(gpp({...clear,parsedSections:{usnat:[{...clear.parsedSections.usnat[0],[field]:value}]}}),value===1?'opted-out':[0,2].includes(value)?'not-opted-out':'unknown');
}
eq(gpp({...clear,parsedSections:{usnat:[clear.parsedSections.usnat[0],{Gpc:true}]}}),'opted-out');
eq(gpp({...clear,parsedSections:{usnat:[clear.parsedSections.usnat[0],{Gpc:'true'}]}}),'unknown');
for(const data of [undefined,{}, {...clear,gppVersion:'1.0'},{...clear,cmpStatus:'error'},{...clear,signalStatus:'not ready'}, {...clear,applicableSections:[]},{...clear,applicableSections:[0]},{...clear,applicableSections:[-1,7]},{...clear,applicableSections:[999]},{...clear,supportedAPIs:'7:usnat'},{...clear,supportedAPIs:['7:toString']},{...clear,parsedSections:{}},{...clear,parsedSections:{usnat:{SaleOptOut:2}}},{...clear,parsedSections:{usnat:[null]}},{...clear,parsedSections:{usnat:[{}]}}])eq(gpp(data),'unknown');
for(const [prefix,fields] of [['usca',['SaleOptOut','SharingOptOut']],['usco',['SaleOptOut','TargetedAdvertisingOptOut']],['usct',['SaleOptOut','TargetedAdvertisingOptOut']],['usva',['SaleOptOut','TargetedAdvertisingOptOut']],['usfl',['SaleOptOut','TargetedAdvertisingOptOut']]]){
 const snapshot={...clear,supportedAPIs:['99:'+prefix],applicableSections:[99],parsedSections:{[prefix]:[Object.fromEntries(fields.map(f=>[f,2]))]}};eq(gpp(snapshot),'not-opted-out');snapshot.parsedSections[prefix][0][fields[0]]=1;eq(gpp(snapshot),'opted-out');
}
const nonEu={gdprApplies:false,cmpStatus:'loaded'},eu={...nonEu,gdprApplies:true,eventStatus:'tcloaded',purpose:{consents:{1:true}},vendor:{consents:{755:true}}};
for(const us of ['unavailable','unknown','not-applicable','not-opted-out','opted-out'])for(const state of ['unavailable','unknown','not-applicable','not-opted-out','opted-out']){
 eq(allowed(nonEu,us,state),!['unknown','opted-out'].includes(us)&&!['unknown','opted-out'].includes(state)&&!(us==='not-opted-out'&&state==='unavailable'));
 eq(allowed(eu,us,state),us!=='opted-out'&&state!=='opted-out');
 eq(allowed({...nonEu,gdprApplies:undefined},us,state),false);
 eq(allowed({...eu,purpose:{consents:{1:false}}},us,state),false);
}
console.log(`PASS ${count} US interface, GPP segment, opt-out and EU/non-EU policy assertions; no network.`);
