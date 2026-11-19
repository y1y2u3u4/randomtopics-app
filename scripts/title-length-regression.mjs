// onpage-audit 2026-11-19: /impromptu-speech-topics title was 81 chars (Google truncates ~60-70).
// It has ~300 clicks / 28d for "impromptu speech topics", so the main phrase must stay at the front.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const src = readFileSync('src/app/impromptu-speech-topics/page.tsx', 'utf8');
const title = src.match(/absolute: "([^"]+)"/)?.[1];
assert.ok(title, 'impromptu-speech-topics: missing absolute title');
assert.ok(title.length <= 70, `title ${title.length} chars: ${title}`);
assert.ok(title.startsWith('Impromptu Speech Topics'), 'main phrase must stay first');
console.log('title-length regression ok:', title.length, title);
