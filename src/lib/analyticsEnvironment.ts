export function isProductionHost(host: string) {
  return host === "randomtopics.app" || host === "www.randomtopics.app";
}
export function replayPathAllowed(path: string) {
  // Do not load replay on account, internal, share, or student-targeted pages.
  return path === "/speech";
}
export function replayMayStart(options: { project: string; ready: boolean; consent: string; path: string; host: string; search: string; hash: string }) {
  return /^[a-z0-9]{5,30}$/i.test(options.project) && options.ready && options.consent === "allowed" &&
    replayPathAllowed(options.path) && isProductionHost(options.host) && !options.search && !options.hash;
}
