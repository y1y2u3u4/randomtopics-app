export function isProductionHost(host: string) {
  return host === "randomtopics.app" || host === "www.randomtopics.app";
}
export function replayPathAllowed(path: string) {
  // Do not load replay on account, internal, share, or student-targeted pages.
  return path === "/speech";
}
