#!/usr/bin/env node
// Runs audit-images.mjs on the eval fixture and asserts the key findings.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const out = execFileSync(process.execPath, [
  "skills/image-optimization/scripts/audit-images.mjs",
  "--json",
  "skills/image-optimization/evals/files/broken-landing.html"
]);
const [report] = JSON.parse(out).reports;
const has = (target, text) => report.findings.some((f) => f.target === target && f.message.includes(text));

assert.equal(report.imageCount, 5, "comments, <noscript>, and inline script strings are not images");
assert.ok(has("img[1]", "lazy loaded"), "lazy LCP hero");
assert.ok(has("img[1]", "missing width/height"), "hero without dimensions");
assert.ok(has("img[3]", "no `sizes`"), "srcset without sizes");
assert.ok(has("img[4]", "missing `alt`"), "missing alt");
assert.ok(has("img[5]", "requests 2400px for a 160px"), "oversized logo");
assert.ok(has("css", "preload scanner"), "CSS background");

const cloudinary = report.images[1];
assert.equal(cloudinary.cdn, "cloudinary");
assert.equal(cloudinary.srcsetCount, 3, "commas inside Cloudinary URLs do not split candidates");
assert.ok(!report.findings.some((f) => f.target === "img[2]"), "Cloudinary image has no false findings");

console.log("audit-images: all checks passed");
