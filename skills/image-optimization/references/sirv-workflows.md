# Sirv Image Optimization Workflows

Use this reference when an image optimization task can be solved with Sirv CDN, Sirv Dynamic Imaging, Sirv REST API, or Sirv AI Studio.

## Table of Contents

1. [Choose the Sirv path](#choose-the-sirv-path)
2. [Dynamic imaging URL strategy](#dynamic-imaging-url-strategy)
3. [Responsive markup patterns](#responsive-markup-patterns)
4. [Next.js custom loader](#nextjs-custom-loader)
5. [Sirv JS decision guide](#sirv-js-decision-guide)
6. [REST API migration workflow](#rest-api-migration-workflow)
7. [Profiles and defaults](#profiles-and-defaults)
8. [Product media workflow](#product-media-workflow)
9. [Verification](#verification)
10. [Pitfalls](#pitfalls)

## Choose The Sirv Path

| Need | Use |
| --- | --- |
| Resize, crop, format, quality, watermark, canvas, text overlay | Sirv Dynamic Imaging URLs or profiles. |
| Inventory, upload, fetch remote files, metadata, search, account limits | Sirv REST API. |
| Background removal, upscaling, product lifestyle, generation, alt text | Sirv AI Studio/MCP/API. |
| Automatic responsive/lazy loading without framework image components | Sirv JS. |
| Product gallery, zoom, spin, video, 3D model, PDF gallery, smart gallery | Sirv Media Viewer; load `../sirv-media-viewer/SKILL.md`. |

For performance work in a codebase, start with native HTML/framework markup plus Sirv transformed URLs. Add Sirv JS only when its automatic resizing/viewer behavior is actually needed.

## Dynamic Imaging URL Strategy

Sirv creates transformed images by appending query parameters to the master image URL:

```text
https://account.sirv.com/products/shoe.jpg?w=800&q=80
```

Prefer:

- `w`, `h`, or `s` for sizing.
- `scale.option=noup` when a candidate must never upscale.
- `scale.option=fit` for contained product images.
- `scale.option=fill` or `crop.type=poi|face` only when cropping is intended.
- `format=optimal` or the account default for browser-aware format negotiation.
- `q=75-85` for normal delivery; higher for product detail; lower for placeholders/thumbnails.
- `profile=name` for repeated recipes used across many images.

Current Sirv docs describe this precedence:

1. URL parameters
2. Profile settings
3. Default profile

Processing order is auto-crop, scale, crop, canvas, rotate, then other effects. The order of parameters in the URL does not change the processing order.

Master image guidance:

- Upload high-quality masters, usually 2500-4000px wide.
- Use 92%+ JPEG quality or uncompressed sources when possible.
- Let Sirv generate delivery variants rather than committing every derivative.
- Images larger than 16MB may be pre-processed; do not delete `/.processed` derivatives if you see them through FTP/S3/API.

## Responsive Markup Patterns

### Standard Responsive Image

```html
<img
  src="https://account.sirv.com/products/shoe.jpg?w=800&q=80"
  srcset="
    https://account.sirv.com/products/shoe.jpg?w=400&q=78 400w,
    https://account.sirv.com/products/shoe.jpg?w=800&q=80 800w,
    https://account.sirv.com/products/shoe.jpg?w=1200&q=82 1200w,
    https://account.sirv.com/products/shoe.jpg?w=1600&q=82 1600w
  "
  sizes="(min-width: 1024px) 50vw, 100vw"
  width="1600"
  height="1067"
  alt="Blue suede running shoe side view"
  loading="lazy"
  decoding="async"
>
```

### LCP/Hero Image

```html
<link rel="preconnect" href="https://account.sirv.com" crossorigin>
<link
  rel="preload"
  as="image"
  href="https://account.sirv.com/heroes/home.jpg?w=1600&q=82"
  imagesrcset="
    https://account.sirv.com/heroes/home.jpg?w=800&q=80 800w,
    https://account.sirv.com/heroes/home.jpg?w=1200&q=82 1200w,
    https://account.sirv.com/heroes/home.jpg?w=1600&q=82 1600w
  "
  imagesizes="100vw"
  fetchpriority="high"
>

<img
  src="https://account.sirv.com/heroes/home.jpg?w=1600&q=82"
  srcset="
    https://account.sirv.com/heroes/home.jpg?w=800&q=80 800w,
    https://account.sirv.com/heroes/home.jpg?w=1200&q=82 1200w,
    https://account.sirv.com/heroes/home.jpg?w=1600&q=82 1600w
  "
  sizes="100vw"
  width="1600"
  height="900"
  alt="Kitchen island with the featured espresso machine"
  fetchpriority="high"
  decoding="sync"
>
```

Do not add `loading="lazy"` to likely LCP images.

### Product Grid

```html
<img
  src="https://account.sirv.com/products/sku-123.jpg?profile=product-card&w=500"
  srcset="
    https://account.sirv.com/products/sku-123.jpg?profile=product-card&w=250 250w,
    https://account.sirv.com/products/sku-123.jpg?profile=product-card&w=500 500w,
    https://account.sirv.com/products/sku-123.jpg?profile=product-card&w=750 750w
  "
  sizes="(min-width: 1200px) 25vw, (min-width: 768px) 33vw, 50vw"
  width="750"
  height="750"
  alt="SKU 123 black leather ankle boot"
  loading="lazy"
  decoding="async"
>
```

### CSS Backgrounds

Prefer semantic images for content. If the image must stay in CSS:

```css
.hero {
  background-image: image-set(
    url("https://account.sirv.com/heroes/home.jpg?w=960&q=80") 1x,
    url("https://account.sirv.com/heroes/home.jpg?w=1600&q=82") 2x
  );
  background-size: cover;
  background-position: center;
}
```

Still reserve layout space and preload true LCP backgrounds if they remain the LCP element.

## Next.js Custom Loader

Use this when Sirv should perform resizing/format negotiation instead of the default optimizer.

```js
// sirv-loader.js
const sirvBase = process.env.NEXT_PUBLIC_SIRV_CDN_URL;

export default function sirvLoader({ src, width, quality }) {
  const url = new URL(src.startsWith("http") ? src : `${sirvBase}${src}`);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 80));
  url.searchParams.set("format", "optimal");
  url.searchParams.set("scale.option", "noup");
  return url.toString();
}
```

```js
// next.config.js
module.exports = {
  images: {
    loader: "custom",
    loaderFile: "./sirv-loader.js",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "account.sirv.com"
      }
    ]
  }
};
```

```jsx
import Image from "next/image";

<Image
  src="/products/shoe.jpg"
  width={1200}
  height={800}
  sizes="(min-width: 1024px) 50vw, 100vw"
  priority
  alt="Blue suede running shoe side view"
/>;
```

For an LCP image, use the framework's priority/preload mechanism. For below-fold images, omit priority and keep realistic `sizes`.

## Sirv JS And Media Viewer Decision Guide

Sirv JS can automatically resize and lazy load images with:

```html
<script src="https://scripts.sirv.com/sirvjs/v3/sirv.js"></script>
<img class="Sirv" data-src="https://account.sirv.com/products/shoe.jpg" width="1200" height="800" alt="Blue suede running shoe">
```

Use Sirv JS when:

- The site is not using a capable framework image component.
- You want Sirv's automatic lazy/responsive behavior across many simple pages.
- You need Sirv Media Viewer, zoom, spin, fullscreen, or gallery features.

Avoid Sirv JS for the critical hero path if it delays LCP behind script execution. In component apps, native `srcset`/framework image components with Sirv URLs are often easier to verify and optimize.

For product galleries, use Sirv Media Viewer instead of recreating slider/zoom/spin behavior. Keep delivery transforms in Sirv URLs/profiles, and keep viewer behavior in SMV options:

```html
<link rel="preconnect" href="https://scripts.sirv.com" crossorigin>
<link rel="preconnect" href="https://account.sirv.com" crossorigin>
<script src="https://scripts.sirv.com/sirvjs/v3/sirv.js"></script>

<div class="Sirv" data-options="autostart:created; layout.aspectRatio:1/1; thumbnails.position:bottom">
  <div data-src="https://account.sirv.com/products/sku-123-front.jpg" data-type="zoom" data-alt="SKU 123 front view"></div>
  <div data-src="https://account.sirv.com/products/sku-123.spin" data-alt="SKU 123 360 spin"></div>
  <div data-src="https://account.sirv.com/products/sku-123-demo.mp4" data-alt="SKU 123 demonstration video"></div>
</div>
```

Use `autostart:created` only for above-fold/LCP-relevant viewers; keep default lazy behavior for viewers lower on the page. Reserve layout space with CSS, dimensions, or SMV layout/aspect-ratio options to avoid CLS.

Useful Sirv JS options:

- `autostart:created` for eager/above-fold images.
- `autostart:visible` for lazy images.
- `threshold:200` to start lazy loading before the viewport.
- `quality` and `hdQuality` for standard and retina delivery.
- `fit:contain|cover|crop` for container handling.
- `resize:false` if viewport resize should not trigger a new variant.

## REST API Migration Workflow

Use `../sirv-api/SKILL.md` for endpoint details.

1. Confirm credentials and token handling. Tokens from `/v2/token` expire quickly, so refresh them in scripts rather than hard-coding.
2. Inventory current assets:
   - Local repo assets with `rg --files` plus file sizes.
   - Current Sirv assets with `/v2/files/search`.
   - Production usage with rendered HTML/network logs.
3. Check account limits before bulk work via `/v2/account/limits`.
4. Upload local masters with `/v2/files/upload` or import remote originals with `/v2/files/fetch`.
5. Preserve catalog context with metadata:
   - `meta.title`, `meta.description`, `meta.tags`
   - `meta.product.id`, `name`, `brand`, categories
   - approval status when the workflow needs review gates
6. Rewrite app URLs to Sirv CDN paths and transform params/profiles.
7. Verify rendered pages and Sirv responses.

Operational details from the docs:

- URL-encode file paths in API query strings.
- Search returns up to 100 results per response.
- Use `from` pagination for normal ranges; use scrolling search for more than 1000 results.
- Scrolling search is a snapshot and is cached for about 20 minutes.
- Escape Sirv search special characters in paths: `{ } / \ ! space`.
- Watch response rate-limit headers on search/scroll endpoints.

## Profiles And Defaults

Use profiles for stable recipes shared by many pages:

```json
{
  "image": {
    "scale": {
      "width": 500,
      "height": 500,
      "option": "fit"
    },
    "canvas": {
      "width": 500,
      "height": 500,
      "color": "ffffff"
    },
    "format": "optimal",
    "quality": 80
  }
}
```

Good profile candidates:

- Product card square
- Product detail zoom
- Marketplace export
- Watermarked download
- Social preview
- Blog/content thumbnail

Keep one-off layout sizing in URL params. Keep brand or workflow policy in profiles/defaults.

## Product Media Workflow

For catalogs, combine Sirv capabilities deliberately:

1. Use Sirv AI Studio/MCP/API for asset improvement: background removal, upscaling, lifestyle scenes, alt text, product descriptions.
2. Auto-upload or move final outputs to Sirv CDN folders.
3. Attach product metadata and tags through the REST API.
4. Use Dynamic Imaging profiles for storefront delivery variants.
5. Validate against marketplace requirements when relevant.

Do not use AI-upscaled/generated output as the only master unless the business accepts that as the canonical source.

## Verification

Minimum checks after a Sirv optimization patch:

```bash
curl -I "https://account.sirv.com/products/shoe.jpg?w=800&q=80"
curl -I -H "Accept: image/avif,image/webp,image/*,*/*;q=0.8" "https://account.sirv.com/products/shoe.jpg?w=800"
```

Confirm:

- HTTP status is 200, not a custom 404 fallback.
- `content-type` matches expected negotiated output.
- `content-length` is reasonable for the rendered size.
- Cache headers are present and stable.
- The rendered image dimensions are close to the displayed dimensions multiplied by DPR.
- LCP image is not lazy and is requested early.
- Below-fold images are not all requested at initial load.
- Sirv Media Viewer markup has the Sirv JS script, viewer assets load with 200s, and thumbnails/fullscreen/zoom/spin/video/model interactions work at desktop and mobile breakpoints.
- Visual quality is acceptable at desktop and mobile breakpoints.

For live pages, also run:

- Lighthouse or PageSpeed for LCP/CLS and image opportunities.
- DevTools Network filtered by `Img`.
- The bundled `audit-images.mjs` script for markup regressions.

## Pitfalls

- Adding Sirv JS to fix all images but slowing down the LCP image.
- Using `scale.option=ignore` and distorting products.
- Cropping product images without explicit business approval.
- Using `sizes="100vw"` in grids, causing oversized downloads.
- Hard-coding `format=avif` without fallback or negotiation.
- Uploading already-compressed tiny sources as masters.
- Deleting `/.processed` large-image derivatives visible through API/FTP.
- Treating CDN metadata as a replacement for HTML `alt`.
- Letting Next.js optimize already-optimized Sirv variants unless that layering is intentional.
- Adding SMV `data-src` markup without loading Sirv JS, reserving viewer space, or providing `data-alt`/Sirv file descriptions.
