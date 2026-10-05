// Local test double only; never served by the application.
export const mockSdk=`(()=>{
 const old=window.adsbygoogle;window.__mock={prepared:old.length,requests:0,pause:old.pauseAdRequests,npa:old.requestNonPersonalizedAds,reopen:0};const m=window.__mock;
 const q={push:()=>{m.prepared++;document.querySelector('ins').dataset.adsbygoogleStatus='done'},requestNonPersonalizedAds:old.requestNonPersonalizedAds};
 Object.defineProperty(q,'pauseAdRequests',{get:()=>m.pause,set:v=>{m.pause=v;if(v===0){m.requests++;const el=document.querySelector('ins');window.__mockRdp=el.getAttribute('data-restrict-data-processing');el.dataset.adStatus='filled';el.textContent='Synthetic mock advertisement';}}});
 window.adsbygoogle=q;document.querySelector('ins').dataset.adsbygoogleStatus='done';if(window.__missingCmp)return;
 const listeners=[];window.__tcfapi=(c,v,f)=>{listeners.push(f);f(window.__consent,true)};window.__setConsent=(d,success=true)=>{window.__consent=d;listeners.forEach(f=>f(d,success))};
 const oldCallbacks=window.googlefc.callbackQueue,usCallbacks=[];const options=window.__privacyOptions||{};
 const fire=entry=>Object.entries(entry).forEach(([key,fn])=>{if(key==='INITIAL_US_STATES_OPT_OUT_DATA_READY'){usCallbacks.push(fn);if(options.missingUs||options.emptyUs||options.delayedUs)return;}fn()});
 window.__releaseUs=value=>{window.__usStatus=value;usCallbacks.forEach(fn=>fn())};
 const api={getInitialUsStatesOptOutStatus:()=>{if(options.usThrows)throw Error('Synthetic API failure');return options.usUndefined?undefined:window.__usStatus},InitialUsStatesOptOutStatusEnum:{UNKNOWN:0,DOES_NOT_APPLY:1,NOT_OPTED_OUT:2,OPTED_OUT:3}};
 if(options.usEnumMissing)delete api.InitialUsStatesOptOutStatusEnum;if(options.usGetterMissing)delete api.getInitialUsStatesOptOutStatus;
 window.googlefc={callbackQueue:{push:fire},showRevocationMessage:()=>{m.reopen++;window.__setConsent({...window.__consent,eventStatus:'cmpuishown'})}};
 if(!options.missingUs)window.googlefc.usstatesoptout=options.emptyUs?{}:api;
 if(options.gpp){const gppListeners=[];window.__gpp=(command,fn)=>{gppListeners.push(fn);fn({eventName:'listenerRegistered',data:true,pingData:options.gpp},true)};window.__setGpp=(data,success=true,eventName='sectionChange')=>gppListeners.forEach(fn=>fn({eventName,pingData:data},success));}
 oldCallbacks.forEach(fire);
})();`;
