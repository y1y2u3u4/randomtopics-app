import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "./lib/load-typescript.mjs";

const require = createRequire(import.meta.url);
const { parse, HTMLElement } = require("next/dist/compiled/node-html-parser");
const { NATIVE_PLACEMENT, adsterraInsertionPoint } = load("src/lib/adsterraPlacement.ts");
const native = `[data-ad-placement="${NATIVE_PLACEMENT}"]`;
const src = "https://native.example.test/key/invoke.js";
const id = "container-fixture";

// Adapt the offline HTML DOM to the small browser surface the effect uses.
Object.defineProperty(HTMLElement.prototype, "children", {
  get() { return this.childNodes.filter(node => node instanceof HTMLElement); },
});
Object.assign(HTMLElement.prototype, {
  matches(selector) { return this.parentNode?.querySelectorAll(selector).includes(this) ?? false; },
  closest(selector) { return this.matches(selector) ? this : this.parentNode?.closest(selector) ?? null; },
  contains(node) { return node === this || this.children.some(child => child.contains(node)); },
  append(...nodes) { nodes.forEach(node => this.appendChild(node)); },
  insertBefore(node, before) {
    if (!before) return this.appendChild(node);
    const index = this.childNodes.indexOf(before);
    assert.ok(index >= 0);
    this.childNodes.splice(index, 0, node);
    node.parentNode = this;
  },
});
Object.defineProperty(HTMLElement.prototype, "parentElement", {
  get() { return this.parentNode; },
});

process.env.NEXT_PUBLIC_ADSENSE_ROLLOUT = "manual-public-reviewed-v1";
function Link(props) {
  return React.createElement("a", { href: props.href }, props.children);
}
const wheel = "src/components/subs/RosterWheel.tsx";
const stateNames = [...readFileSync(wheel, "utf8").matchAll(/const \[(\w+),[^\]]+\] = useState/g)].map(match => match[1]);
const noop = () => null;

function renderPage(path, blocked = false) {
  let index = 0;
  const RosterWheel = load(wheel, {
    react: { ...React, useState(initial) {
      return [stateNames[index++] === "paywall" ? blocked : initial, noop];
    } },
    "./useSubPlan": { useSubPlan: () => ({ active: false }) },
    "@/lib/speech/client": {},
    "@/lib/subs/client": {},
  }).default;
  const Page = load(`src/app${path}/page.tsx`, {
    "next/link": Link,
    "@/components/Navbar": noop,
    "@/components/Breadcrumb": noop,
    "@/components/WheelGenerator": noop,
    "@/components/TopicGenerator": noop,
    "@/components/Footer": () => React.createElement("footer"),
    "@/components/FactTable": ({ heading }) => React.createElement("section", null, React.createElement("h2", null, heading)),
    "@/components/CategoryIllustration": { PartyIllustration: noop },
    "@/components/KeepPlaying": noop,
    "@/components/TryNext": noop,
    "@/components/subs/RosterWheel": RosterWheel,
    "@/components/wheel/LazyCustomWheel": noop,
    "@/components/wheel/WheelFamilyLinks": noop,
    "@/lib/adsenseClient": {},
    "@/lib/speech/adEligibilityClient": {},
  }).default;
  return parse(renderToStaticMarkup(React.createElement(Page)));
}

function runNative(dom, path, env, cookie = "rt_adst=IN") {
  for (const [key, value] of Object.entries({
    NEXT_PUBLIC_ADSTERRA_NATIVE_ON: env.on, NEXT_PUBLIC_ADSTERRA_NATIVE_SRC: env.src, NEXT_PUBLIC_ADSTERRA_NATIVE_ID: env.id,
  })) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  let intersect, mutated, changed;
  let allowed = false;
  const effects = [], dispose = [], requests = [];

  Object.defineProperties(globalThis, {
    document: { configurable: true, value: Object.assign(dom, { cookie, hidden: false, createElement(tag) {
      return Object.assign(parse(`<${tag}></${tag}>`).firstChild, { style: {} });
    } }) },
    location: { configurable: true, value: { pathname: path, hostname: "randomtopics.app", search: "" } },
    window: { configurable: true, value: {} },
    sessionStorage: { configurable: true, value: { getItem: () => null } },
    IntersectionObserver: { configurable: true, value: class {
      constructor(callback) { intersect = callback; }
      observe() {}
      disconnect() {}
    } },
    MutationObserver: { configurable: true, value: class {
      constructor(callback) { mutated = callback; }
      observe() {}
      disconnect() {}
    } },
  });
  window.self = window.top = window;
  const Component = load("src/components/AdsterraNative.tsx", {
    react: { useEffect: effect => effects.push(effect) },
    "next/navigation": { usePathname: () => path },
    "@/lib/speech/adEligibilityClient": { observeSpeechAdEntitlement(options) {
      changed = options.changed;
      return { gate: { mayRequest: () => allowed, begin: () => allowed }, dispose: noop };
    } },
    "@/lib/adsenseClient": {},
    "@/lib/adslotClient": { adslotConfiguration: () => { throw new Error("unexpected geo lookup"); } },
    "@/lib/track": { track: (...args) => requests.push(args) },
  }).default;
  return {
    mount() {
      assert.equal(Component(), null);
      dispose.push(effects.pop()());
      allowed = true;
      changed?.("free");
    },
    intersect: () => intersect?.([{ isIntersecting: true }]),
    mutate: target => mutated?.([{ target }]),
    dispose: () => dispose.splice(0).forEach(cleanup => cleanup?.()),
    requests,
  };
}

for (const [path, cadence] of [["/spin-the-wheel", "month"], ["/es/spin-the-wheel", "mes"]]) {
  const dom = renderPage(path, true);
  const buttons = dom.querySelectorAll('[data-sub-paywall="wheel"] button:not([disabled])');
  assert.ok(buttons.some(button => button.text.trim().endsWith(`/${cadence}`)), `${path}: blocked Wheel Pro purchase`);

  const runtime = runNative(dom, path, { on: "1", src, id });
  runtime.mount();
  runtime.mount();
  const main = dom.querySelector("main");
  const host = main.querySelector(native);
  const faq = main.querySelector("[data-adsterra-before-faq]");
  const sense = main.querySelector('[data-ad-placement="public-content"]');
  assert.ok(host && faq && sense);
  assert.equal(host.nextElementSibling, faq);
  assert.equal(faq.nextElementSibling, sense);
  assert.ok(faq.querySelector("h3").text.trim(), "content separates the ad units");
  assert.equal(dom.querySelectorAll(native).length, 1);
  assert.equal(host.querySelectorAll("script").length, 0);

  runtime.intersect();
  runtime.intersect();
  assert.equal(runtime.requests.length, 1);
  assert.equal(host.querySelectorAll("script").length, 1);
  assert.equal(host.querySelector("script").src, src);
  assert.equal(host.querySelector("script").parentElement.id, id);

  // An Auto ad inserted later next to the Native invalidates the placement.
  main.insertBefore(parse('<div class="google-auto-placed"><ins class="adsbygoogle"></ins></div>').firstChild, faq);
  runtime.mutate(main);
  assert.equal(main.querySelector(native), null);
  runtime.mount();
  runtime.intersect();
  assert.equal(runtime.requests.length, 1, "same document never requests the key a second time");
  runtime.dispose();
}

const fixture = () => parse('<main><section><h1>Generator</h1></section><aside data-ad-placement="public-result"></aside><section><p>Guide</p></section></main><footer></footer>');
for (const env of [{ src, id }, { on: "0", src, id }, { on: "1", src }, { on: "1", id }]) {
  const dom = fixture();
  const runtime = runNative(dom, "/writing", env);
  runtime.mount();
  runtime.intersect();
  assert.equal(dom.querySelector(native), null);
  assert.equal(runtime.requests.length, 0);
  runtime.dispose();
}
for (const [path, cookie] of [["/speech", "rt_adst=-"], ["/speech/account", "rt_adst=IN"]]) {
  const dom = fixture();
  const runtime = runNative(dom, path, { on: "1", src, id }, cookie);
  runtime.mount();
  assert.equal(dom.querySelector(native), null);
  runtime.dispose();
}
const dom = fixture();
const runtime = runNative(dom, "/writing", { on: "1", src, id });
runtime.mount();
assert.equal(dom.querySelector("main").lastChild, dom.querySelector(native));
runtime.dispose();
assert.equal(dom.querySelector(native), null);

const mainFrom = html => parse(`<main>${html}</main>`).querySelector("main");
const onlyAd = mainFrom('<h1>Tool</h1><aside data-ad-placement="public-content"></aside>');
assert.equal(adsterraInsertionPoint(onlyAd), undefined);
const bottomAd = mainFrom('<p>Guide</p><section><h2>Related tools</h2></section><aside data-ad-placement="public-content"></aside>');
assert.equal(adsterraInsertionPoint(bottomAd), bottomAd.querySelector("section"));
console.log("adsterra DOM regression ok (env, placement, late Auto ads, single request, Wheel Pro paywall)");
