#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const IMAGE_EXTENSIONS = /\.(avif|bmp|gif|heic|heif|jpe?g|jxl|png|svg|webp)([?#].*)?$/i;
const SIRV_HOST_RE = /(^|\.)sirv\.com$/i;

const args = process.argv.slice(2);
const flags = {
  head: takeFlag("--head"),
  json: takeFlag("--json")
};

if (args.length === 0) {
  printUsage();
  process.exit(1);
}

const reports = [];

for (const target of args) {
  reports.push(await auditTarget(target, flags));
}

if (flags.json) {
  console.log(JSON.stringify({ reports }, null, 2));
} else {
  printMarkdown(reports);
}

function takeFlag(name) {
  const index = args.indexOf(name);
  if (index === -1) return false;
  args.splice(index, 1);
  return true;
}

function printUsage() {
  console.error(`Usage:
  node audit-images.mjs [--head] [--json] <url-or-html-file> [...]

Examples:
  node audit-images.mjs ./dist/index.html
  node audit-images.mjs --head https://example.com/
  node audit-images.mjs --json https://example.com/ > image-audit.json`);
}

async function auditTarget(target, options) {
  const { html, baseUrl, sourceType } = await loadHtml(target);
  const images = extractElements(html, "img");
  const sources = extractElements(html, "source");
  const links = extractElements(html, "link");
  const cssUrls = extractCssUrls(html, baseUrl);
  const findings = [];

  const preloads = links
    .map((tag) => ({ tag, attrs: parseAttrs(tag) }))
    .filter(({ attrs }) => /\bpreload\b/i.test(attrs.rel || "") && (attrs.as || "").toLowerCase() === "image");

  const imageReports = images.map((tag, index) => {
    const attrs = parseAttrs(tag);
    const src = attrs.src || attrs["data-src"] || "";
    const srcset = attrs.srcset || attrs["data-srcset"] || "";
    const resolvedSrc = resolveUrl(src, baseUrl);
    const candidates = parseSrcset(srcset, baseUrl);
    const report = {
      index: index + 1,
      src,
      resolvedSrc,
      srcsetCount: candidates.length,
      alt: attrs.alt,
      width: attrs.width,
      height: attrs.height,
      loading: attrs.loading,
      fetchpriority: attrs.fetchpriority,
      decoding: attrs.decoding,
      sirv: inspectSirvUrl(resolvedSrc)
    };

    inspectImageMarkup(report, attrs, candidates, index, findings);
    return report;
  });

  for (const { tag, attrs } of sources.map((tag) => ({ tag, attrs: parseAttrs(tag) }))) {
    const srcset = attrs.srcset || attrs["data-srcset"] || "";
    const candidates = parseSrcset(srcset, baseUrl);
    if (hasWidthDescriptors(candidates) && !attrs.sizes) {
      findings.push({
        severity: "warn",
        target: "source",
        message: "`source` uses width descriptors but has no `sizes` attribute",
        value: compactTag(tag)
      });
    }
  }

  for (const preload of preloads) {
    if (!preload.attrs.href && !preload.attrs.imagesrcset) {
      findings.push({
        severity: "warn",
        target: "preload",
        message: "Image preload is missing `href` or `imagesrcset`",
        value: compactTag(preload.tag)
      });
    }
  }

  for (const cssUrl of cssUrls) {
    if (!IMAGE_EXTENSIONS.test(cssUrl.raw)) continue;
    const sirv = inspectSirvUrl(cssUrl.resolved);
    if (sirv?.hosted && !sirv.hasSizing && !sirv.hasProfile) {
      findings.push({
        severity: "info",
        target: "css",
        message: "Sirv CSS image has no explicit size/profile; verify it is not oversized",
        value: cssUrl.resolved
      });
    }
  }

  if (options.head) {
    await addHeadFindings(imageReports, findings);
  }

  return {
    target,
    sourceType,
    imageCount: images.length,
    sourceCount: sources.length,
    preloadCount: preloads.length,
    cssImageCount: cssUrls.filter((url) => IMAGE_EXTENSIONS.test(url.raw)).length,
    images: imageReports,
    findings,
    summary: summarize(findings)
  };
}

async function loadHtml(target) {
  if (/^https?:\/\//i.test(target)) {
    const response = await fetch(target, {
      headers: {
        "user-agent": "image-optimization-skill-audit/1.0"
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${target}: ${response.status} ${response.statusText}`);
    }
    return {
      html: await response.text(),
      baseUrl: target,
      sourceType: "url"
    };
  }

  const absolute = path.resolve(target);
  return {
    html: await fs.readFile(absolute, "utf8"),
    baseUrl: pathToFileURL(absolute).href,
    sourceType: "file"
  };
}

function extractElements(html, tagName) {
  const pattern = new RegExp(`<${tagName}\\b[^>]*>`, "gi");
  return html.match(pattern) || [];
}

function extractCssUrls(html, baseUrl) {
  const urls = [];
  const pattern = /url\(\s*(['"]?)(.*?)\1\s*\)/gi;
  let match;

  while ((match = pattern.exec(html))) {
    const raw = decodeHtmlEntities(match[2].trim());
    const resolved = resolveUrl(raw, baseUrl);
    if (resolved) urls.push({ raw, resolved });
  }

  return urls;
}

function parseAttrs(tag) {
  const attrs = {};
  const pattern = /([:@\w.-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;

  while ((match = pattern.exec(tag))) {
    const name = match[1].toLowerCase();
    if (name === "img" || name === "source" || name === "link") continue;
    attrs[name] = decodeHtmlEntities(match[2] ?? match[3] ?? match[4] ?? "");
  }

  return attrs;
}

function parseSrcset(srcset, baseUrl) {
  if (!srcset) return [];

  return srcset
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [url, descriptor] = part.split(/\s+/);
      const decodedUrl = decodeHtmlEntities(url);
      return {
        raw: decodedUrl,
        resolved: resolveUrl(decodedUrl, baseUrl),
        descriptor: descriptor || ""
      };
    });
}

function hasWidthDescriptors(candidates) {
  return candidates.some((candidate) => /\d+w$/.test(candidate.descriptor));
}

function resolveUrl(value, baseUrl) {
  if (!value || /^(data|blob|about|javascript):/i.test(value) || value.startsWith("#")) return "";

  try {
    return new URL(value, baseUrl).href;
  } catch {
    return value;
  }
}

function inspectImageMarkup(report, attrs, candidates, index, findings) {
  const label = `img[${report.index}]`;

  if (!report.src && candidates.length === 0) {
    findings.push({
      severity: "warn",
      target: label,
      message: "Image has no `src`, `data-src`, or `srcset`",
      value: compactAttrs(attrs)
    });
  }

  if (!Object.hasOwn(attrs, "alt")) {
    findings.push({
      severity: "warn",
      target: label,
      message: "Image is missing `alt`",
      value: report.src || compactAttrs(attrs)
    });
  }

  if (!report.width || !report.height) {
    findings.push({
      severity: "warn",
      target: label,
      message: "Image is missing width/height; verify CLS is reserved with CSS if intentional",
      value: report.src || compactAttrs(attrs)
    });
  }

  if (hasWidthDescriptors(candidates) && !attrs.sizes) {
    findings.push({
      severity: "warn",
      target: label,
      message: "`srcset` uses width descriptors but image has no `sizes` attribute",
      value: report.src || candidates[0]?.raw || ""
    });
  }

  if (index === 0 && (report.loading || "").toLowerCase() === "lazy") {
    findings.push({
      severity: "error",
      target: label,
      message: "First image is lazy loaded; this is risky if it is the LCP image",
      value: report.src
    });
  }

  if (index === 0 && !/high/i.test(report.fetchpriority || "")) {
    findings.push({
      severity: "info",
      target: label,
      message: "First image has no `fetchpriority=\"high\"`; verify LCP priority another way",
      value: report.src
    });
  }

  if (report.sirv?.hosted) {
    inspectSirvMarkup(label, report.sirv, findings);
  } else if (report.resolvedSrc && IMAGE_EXTENSIONS.test(report.resolvedSrc)) {
    findings.push({
      severity: "info",
      target: label,
      message: "Non-Sirv image; consider CDN/build transform if it is not already optimized",
      value: report.resolvedSrc
    });
  }
}

function inspectSirvUrl(value) {
  if (!/^https?:\/\//i.test(value || "")) return null;

  const url = new URL(value);
  const hosted = SIRV_HOST_RE.test(url.hostname);
  if (!hosted) return null;

  const params = url.searchParams;
  const format = params.get("format");
  const scaleOption = params.get("scale.option");

  return {
    hosted,
    hostname: url.hostname,
    hasSizing: ["w", "h", "s", "thumbnail"].some((key) => params.has(key)),
    hasProfile: params.has("profile"),
    hasQuality: params.has("q"),
    format,
    scaleOption,
    query: url.search
  };
}

function inspectSirvMarkup(label, sirv, findings) {
  if (!sirv.hasSizing && !sirv.hasProfile) {
    findings.push({
      severity: "warn",
      target: label,
      message: "Sirv image has no size parameter or profile; it may serve an oversized master",
      value: sirv.query || "(no query)"
    });
  }

  if (/^(avif|webp)$/i.test(sirv.format || "")) {
    findings.push({
      severity: "info",
      target: label,
      message: "Sirv image forces a modern format; verify fallback/negotiation is intentional",
      value: `format=${sirv.format}`
    });
  }

  if ((sirv.scaleOption || "").toLowerCase() === "ignore") {
    findings.push({
      severity: "warn",
      target: label,
      message: "Sirv `scale.option=ignore` can distort images",
      value: sirv.query
    });
  }
}

async function addHeadFindings(imageReports, findings) {
  const urls = [...new Set(imageReports.map((image) => image.resolvedSrc).filter((src) => /^https?:\/\//i.test(src)))];

  for (const url of urls) {
    try {
      const response = await fetch(url, { method: "HEAD" });
      const contentType = response.headers.get("content-type") || "";
      const contentLength = Number(response.headers.get("content-length") || 0);

      if (!response.ok) {
        findings.push({
          severity: "error",
          target: "http",
          message: `Image HEAD returned ${response.status}`,
          value: url
        });
      }

      if (contentType && !contentType.startsWith("image/")) {
        findings.push({
          severity: "warn",
          target: "http",
          message: `Image URL returned non-image content type: ${contentType}`,
          value: url
        });
      }

      if (contentLength > 500_000) {
        findings.push({
          severity: "warn",
          target: "http",
          message: `Image response is large: ${formatBytes(contentLength)}`,
          value: url
        });
      }
    } catch (error) {
      findings.push({
        severity: "warn",
        target: "http",
        message: `Could not HEAD image: ${error.message}`,
        value: url
      });
    }
  }
}

function summarize(findings) {
  return findings.reduce(
    (summary, finding) => {
      summary[finding.severity] = (summary[finding.severity] || 0) + 1;
      return summary;
    },
    { error: 0, warn: 0, info: 0 }
  );
}

function printMarkdown(reports) {
  console.log("# Image Audit\n");

  for (const report of reports) {
    console.log(`## ${report.target}`);
    console.log(`- Source: ${report.sourceType}`);
    console.log(`- Images: ${report.imageCount}`);
    console.log(`- Source elements: ${report.sourceCount}`);
    console.log(`- Image preloads: ${report.preloadCount}`);
    console.log(`- CSS image URLs: ${report.cssImageCount}`);
    console.log(`- Findings: ${report.summary.error} error, ${report.summary.warn} warn, ${report.summary.info} info`);

    if (report.findings.length === 0) {
      console.log("\nNo obvious image markup issues found.\n");
      continue;
    }

    console.log("\n### Findings");
    for (const finding of report.findings) {
      console.log(`- [${finding.severity}] ${finding.target}: ${finding.message}`);
      if (finding.value) console.log(`  ${finding.value}`);
    }
    console.log("");
  }
}

function compactTag(tag) {
  return tag.replace(/\s+/g, " ").trim().slice(0, 240);
}

function compactAttrs(attrs) {
  return Object.entries(attrs)
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join(" ")
    .slice(0, 240);
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
