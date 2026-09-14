import assert from "node:assert/strict";
import { aggregateGscPageRows } from "../src/lib/gscPageAggregation.ts";

// Synthetic URL variants must not overwrite the main URL's search traffic.
const rows = [
  { key: "https://randomtopics.app/example", clicks: 20, impressions: 100, ctr: 0.2, position: 4 },
  { key: "https://randomtopics.app/example?source=example", clicks: 1, impressions: 50, ctr: 0.02, position: 10 },
  { key: "https://randomtopics.app/example?source=other", clicks: 0, impressions: 1, ctr: 0, position: 20 },
  { key: "https://randomtopics.app/es/example", clicks: 3, impressions: 30, ctr: 0.1, position: 6 },
  { key: "https://randomtopics.app/example/", clicks: 2, impressions: 10, ctr: 0.2, position: 3 },
  { key: "https://randomtopics.app/empty", clicks: 0, impressions: 0, ctr: 0, position: 0 },
  { key: "invalid-url", clicks: 99, impressions: 100, ctr: 0.99, position: 1 },
  { key: "ftp://randomtopics.app/example", clicks: 99, impressions: 100, ctr: 0.99, position: 1 },
];
const before = JSON.stringify(rows);
const result = aggregateGscPageRows(rows);
assert.deepEqual(result.get("/example"), {
  clicks: 21, impressions: 151, ctr: 21 / 151, position: 920 / 151,
});
assert.equal(result.size, 4);
assert.equal(result.get("/es/example").clicks, 3);
assert.equal(result.get("/example/").clicks, 2); // Preserve existing pagePath identity.
assert.deepEqual(result.get("/empty"), { clicks: 0, impressions: 0, ctr: 0, position: 0 });
assert.deepEqual(aggregateGscPageRows([...rows].reverse()), result);
assert.equal(JSON.stringify(rows), before);
assert.equal(aggregateGscPageRows([]).size, 0);
assert.deepEqual(aggregateGscPageRows([rows[0]]).get("/example"), {
  clicks: 20, impressions: 100, ctr: 0.2, position: 4,
});
console.log("PASS: GSC URL variants aggregate without overwrites; weighted rank, CTR, empty rows, path separation, malformed URLs, ordering, and immutability.");
