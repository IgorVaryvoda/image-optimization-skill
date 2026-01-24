# Image Formats Reference

## Table of Contents
1. [JPEG](#jpeg)
2. [PNG](#png)
3. [WebP](#webp)
4. [AVIF](#avif)
5. [GIF](#gif)
6. [SVG](#svg)
7. [HEIC/HEIF](#heicheif)
8. [JPEG XL](#jpeg-xl)
9. [HDR & Wide Color Gamut](#hdr--wide-color-gamut)
10. [BMP](#bmp)
11. [TIFF](#tiff)
12. [Browser Support Matrix](#browser-support-matrix)

---

## JPEG

**Full name:** Joint Photographic Experts Group
**Extension:** .jpg, .jpeg
**MIME type:** image/jpeg
**Type:** Lossy (primarily)
**Transparency:** No
**Animation:** No
**Max dimensions:** 65,535 × 65,535 pixels
**Color depth:** 24-bit (16.7 million colors)

### Compression
- Uses DCT (Discrete Cosine Transform) based compression
- Divides image into 8×8 pixel blocks
- Quality scale typically 0-100 (implementation varies)
- Chroma subsampling (4:4:4, 4:2:2, 4:2:0) reduces color data

### Variants
- **Baseline JPEG:** Standard, loads top-to-bottom
- **Progressive JPEG:** Loads in multiple passes, shows blurry preview first
- **JPEG 2000:** Wavelet-based, better quality but poor browser support
- **Lossless JPEG:** Rarely used, limited support

### Best Practices
- Use quality 75-85 for web (80 is common sweet spot)
- Use progressive JPEG for images >10KB
- Avoid re-saving (quality degrades each time)
- Strip EXIF metadata for privacy and size reduction
- Use 4:2:0 chroma subsampling for smaller files

### When to Use
- Photographs and complex images with many colors
- Images without transparency requirements
- When broad compatibility is essential

### When NOT to Use
- Graphics with text, logos, sharp edges
- Images requiring transparency
- Images that will be edited repeatedly

---

## PNG

**Full name:** Portable Network Graphics
**Extension:** .png
**MIME type:** image/png
**Type:** Lossless
**Transparency:** Yes (alpha channel)
**Animation:** No (APNG is separate format)
**Max dimensions:** 2,147,483,647 × 2,147,483,647 pixels (theoretical)
**Color depth:** Up to 48-bit + 16-bit alpha

### Variants
- **PNG-8:** 256 colors (indexed), smaller files, 1-bit transparency
- **PNG-24:** 16.7 million colors, no transparency
- **PNG-32:** 16.7 million colors + alpha transparency
- **APNG:** Animated PNG, limited browser support

### Compression
- Uses DEFLATE algorithm (lossless)
- Filter methods: None, Sub, Up, Average, Paeth
- Interlacing: None or Adam7 (progressive loading)

### Optimization Techniques
- Use PNG-8 when possible (256 colors sufficient)
- Run through optimizers: oxipng, pngquant, optipng, pngcrush
- pngquant can do lossy compression (reduces colors)
- Remove unnecessary chunks (metadata)

### Best Practices
- Use for graphics, logos, icons, screenshots
- Use PNG-8 for simple graphics with few colors
- Use PNG-32 only when alpha transparency needed
- Consider WebP/AVIF as modern alternatives

### When to Use
- Graphics with text, logos, icons
- Images requiring transparency
- Screenshots with text
- When lossless quality is required

### When NOT to Use
- Photographs (use JPEG/WebP/AVIF)
- Large images where file size matters
- Animations (use WebP/GIF/video)

---

## WebP

**Full name:** Web Picture
**Extension:** .webp
**MIME type:** image/webp
**Type:** Lossy and Lossless
**Transparency:** Yes (alpha channel)
**Animation:** Yes
**Max dimensions:** 16,383 × 16,383 pixels
**Color depth:** 24-bit + 8-bit alpha

### Compression
- Lossy: Based on VP8 video codec (intra-frame encoding)
- Lossless: Uses predictive coding, entropy coding
- Typically 25-35% smaller than JPEG at equivalent quality
- Lossless WebP typically 26% smaller than PNG

### Encoding Options
- **Quality (lossy):** 0-100, recommend 75-85
- **Method:** 0-6 (speed vs compression tradeoff)
- **Lossless:** Boolean flag
- **Near-lossless:** Preprocessing that improves lossless compression

### Animated WebP
- Supports animation like GIF but with better compression
- Alpha channel support (unlike GIF)
- Typically 64% smaller than GIF

### Browser Support
- Chrome 17+, Firefox 65+, Safari 14+, Edge 18+
- iOS Safari 14+, Android Browser 4.2+
- No IE11 support

### Best Practices
- Use as primary format with JPEG/PNG fallback
- Quality 75-85 for lossy photos
- Use lossless for graphics/screenshots
- Convert GIFs to animated WebP

### When to Use
- All web images (photos, graphics, animations)
- When browser support allows (check your audience)
- Replacing both JPEG and PNG

---

## AVIF

**Full name:** AV1 Image File Format
**Extension:** .avif
**MIME type:** image/avif
**Type:** Lossy and Lossless
**Transparency:** Yes (alpha channel)
**Animation:** Yes
**Max dimensions:** 65,536 × 65,536 pixels (with tiling, much larger)
**Color depth:** Up to 12-bit, HDR support

### Compression
- Based on AV1 video codec (royalty-free)
- 50% smaller than JPEG at equivalent quality
- 20% smaller than WebP
- Excellent at preserving detail in low-contrast areas

### Features
- HDR (High Dynamic Range) support
- Wide color gamut (BT.2020)
- Film grain synthesis
- Animated sequences
- Depth maps
- Multiple layers

### Encoding Options
- **Quality:** Lower numbers than JPEG/WebP for same quality
- **Speed:** 0-10 (slower = better compression)
- **Lossless:** Boolean flag
- Encoding is CPU-intensive (slower than WebP/JPEG)

### Browser Support
- Chrome 85+, Firefox 93+, Safari 16.4+
- Edge 121+
- iOS Safari 16.4+
- Rapidly improving support

### Best Practices
- Use quality 60-75 (equivalent to JPEG 80-90)
- Always provide WebP or JPEG fallback
- Consider encoding time for dynamic content
- Great for hero images where quality matters

### When to Use
- High-quality photos where file size matters
- HDR content
- When cutting-edge compression is needed
- Sites with modern browser audiences

### Limitations
- Slow encoding (not ideal for on-the-fly generation)
- Newer format, some older browsers lack support
- Large images may be slow to decode

---

## GIF

**Full name:** Graphics Interchange Format
**Extension:** .gif
**MIME type:** image/gif
**Type:** Lossless (but limited colors)
**Transparency:** Yes (1-bit, no alpha)
**Animation:** Yes
**Max dimensions:** 65,535 × 65,535 pixels
**Color depth:** 8-bit (256 colors per frame)

### Compression
- Uses LZW (Lempel-Ziv-Welch) compression
- Each frame limited to 256 colors
- Can use different palettes per frame

### Animation
- Frame-based animation
- Variable frame delays
- Looping control
- Disposal methods for optimization

### Limitations
- 256 color limit creates banding in photos
- No alpha transparency (only on/off)
- Large file sizes for animations
- No audio support

### Best Practices
- Use for simple animations only
- Prefer WebP/video for complex animations
- Optimize with gifsicle
- Reduce colors and frame count
- Consider video (MP4/WebM) for long animations

### When to Use
- Simple, short animations
- When maximum compatibility needed
- Animated icons/emojis
- Legacy system support

### When NOT to Use
- Photos (use JPEG/WebP/AVIF)
- Long or complex animations (use video)
- When file size matters
- Graphics with gradients

---

## SVG

**Full name:** Scalable Vector Graphics
**Extension:** .svg
**MIME type:** image/svg+xml
**Type:** Vector (lossless at any scale)
**Transparency:** Yes
**Animation:** Yes (SMIL, CSS, JavaScript)
**Max dimensions:** Unlimited (vector)

### Features
- XML-based format
- Infinitely scalable without quality loss
- DOM accessible (scriptable, styleable)
- Small file size for simple graphics
- Supports filters, gradients, patterns
- Can embed raster images

### Optimization
- Run through SVGO (SVG Optimizer)
- Remove unnecessary metadata
- Simplify paths
- Remove hidden elements
- Minify (remove whitespace)
- Convert shapes to paths when smaller

### Security Considerations
- Can contain JavaScript (XSS risk)
- Sanitize user-uploaded SVGs
- Use CSP headers
- Consider using `<img>` instead of inline SVG for untrusted sources

### Best Practices
- Use for logos, icons, illustrations
- Optimize with SVGO before deployment
- Consider icon sprites or symbol systems
- Use currentColor for themeable icons
- Keep paths simple for smaller files

### When to Use
- Logos and icons
- Simple illustrations
- Graphics that need to scale
- Interactive graphics
- Icons that need CSS styling

### When NOT to Use
- Photographs
- Complex images with many details
- When SVG features would bloat file size

---

## HEIC/HEIF

**Full name:** High Efficiency Image Container / High Efficiency Image Format
**Extension:** .heic, .heif
**MIME type:** image/heic, image/heif
**Type:** Lossy and Lossless
**Transparency:** Yes
**Animation:** Yes (image sequences)

### Features
- Based on HEVC (H.265) codec
- 50% smaller than JPEG at similar quality
- Supports multiple images in one file
- Depth maps, HDR, wide color gamut
- Non-destructive editing metadata

### Browser Support
- Safari (macOS/iOS) only for web
- Native on Apple devices
- Not suitable for web delivery
- Convert to WebP/AVIF/JPEG for web

### When to Use
- Apple ecosystem apps
- Photo storage and editing workflows
- NOT for web delivery

---

## JPEG XL

**Full name:** JPEG Extended Long-term
**Extension:** .jxl
**MIME type:** image/jxl
**Type:** Lossy and Lossless
**Transparency:** Yes
**Animation:** Yes

### Features
- Next-generation format from JPEG committee
- Lossless transcoding from JPEG (reconstruct original)
- Superior compression to AVIF in some cases
- Progressive decoding
- HDR and wide gamut support

### Browser Support
- Chrome removed support (previously behind flag)
- Firefox removed support
- Safari 17+ (macOS/iOS)
- NOT recommended for web use currently

### Status
- Promising format but adoption stalled
- Use AVIF/WebP instead for web
- May see renewed support in future

---

## HDR & Wide Color Gamut

### Color Spaces

**sRGB (Standard RGB)**
- Default web color space
- 8-bit per channel (16.7 million colors)
- Covers ~35% of visible colors
- Universal browser support

**Display P3**
- Wider gamut (~25% more colors than sRGB)
- Common on modern Apple devices, high-end monitors
- Supported in Safari, Chrome 111+, Firefox 113+
- Great for vibrant photos and marketing images

**Rec. 2020 (BT.2020)**
- Ultra-wide gamut for HDR content
- 10-12 bit per channel
- Limited display support
- Future-proofing for HDR workflows

### Wide Gamut CSS

```css
/* Detect wide gamut support */
@media (color-gamut: p3) {
  .hero-image {
    /* Use P3 image */
  }
}

/* P3 colors in CSS */
.vibrant-button {
  background: color(display-p3 1 0.5 0);
}
```

### HDR Images with AVIF

AVIF is the primary format for HDR web content:

```bash
# Encode HDR AVIF with avifenc
avifenc --min 20 --max 30 \
  --cicp 9/16/9 \
  --depth 10 \
  input.png output.avif

# CICP values:
# 9 = BT.2020 color primaries
# 16 = PQ transfer function (HDR)
# 9 = BT.2020 non-constant luminance
```

**HDR encoding options:**
| Parameter | Value | Description |
|-----------|-------|-------------|
| `--depth` | 10 or 12 | Bit depth for HDR |
| `--cicp` | 9/16/9 | BT.2020 PQ (HDR10) |
| `--cicp` | 9/18/9 | BT.2020 HLG |
| `--cicp` | 1/13/1 | sRGB (SDR default) |

### Serving Different Color Spaces

```html
<picture>
  <!-- HDR AVIF for capable displays -->
  <source
    srcset="hero-hdr.avif"
    type="image/avif"
    media="(dynamic-range: high)"
  >
  <!-- Wide gamut for P3 displays -->
  <source
    srcset="hero-p3.avif"
    type="image/avif"
    media="(color-gamut: p3)"
  >
  <!-- Standard sRGB fallback -->
  <img src="hero-srgb.jpg" alt="Hero">
</picture>
```

### ICC Profile Handling

**Embed profiles for accurate color:**
```bash
# Convert to sRGB with ImageMagick
convert input.jpg -profile sRGB.icc output.jpg

# Strip profile but convert to sRGB first
convert input.jpg -profile sRGB.icc -strip output.jpg
```

**Profile recommendations:**
| Use Case | Color Space | Embed Profile? |
|----------|-------------|----------------|
| General web | sRGB | Optional (assumed) |
| Photography | Display P3 | Yes |
| E-commerce | sRGB | Yes (consistency) |
| Print-ready | Adobe RGB | Yes |
| HDR content | Rec. 2020 | Yes |

### Browser HDR/Wide Gamut Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Display P3 | 111+ | 113+ | 10+ | 111+ |
| HDR media query | 111+ | 113+ | 15.4+ | 111+ |
| AVIF HDR | 85+ | 113+ | 16.4+ | 121+ |
| Canvas P3 | 94+ | 113+ | 15.2+ | 94+ |

---

## BMP

**Full name:** Bitmap Image File
**Extension:** .bmp
**MIME type:** image/bmp
**Type:** Uncompressed (typically)
**Transparency:** Limited

### Usage
- Legacy Windows format
- Never use for web (massive file sizes)
- Convert to PNG/WebP for web use

---

## TIFF

**Full name:** Tagged Image File Format
**Extension:** .tiff, .tif
**MIME type:** image/tiff
**Type:** Lossless (various compression options)

### Usage
- Professional photography and printing
- Not for web (large files, poor browser support)
- Convert to JPEG/WebP for web use

---

## Browser Support Matrix

**Updated January 2026**

| Format | Chrome | Firefox | Safari | Edge | iOS Safari |
|--------|--------|---------|--------|------|------------|
| JPEG | Yes | Yes | Yes | Yes | Yes |
| PNG | Yes | Yes | Yes | Yes | Yes |
| GIF | Yes | Yes | Yes | Yes | Yes |
| WebP | 17+ | 65+ | 14+ | 18+ | 14+ |
| AVIF | 85+ | 93+ | 16.4+ | 121+ | 16.4+ |
| SVG | Yes | Yes | Yes | Yes | Yes |
| JPEG XL | No* | No* | 17+ | No | 17+ |
| HEIC | No | No | Yes | No | Yes |

*Chrome/Firefox removed JPEG XL support; Safari 17+ supports it (macOS/iOS)

### Current Recommendations (2026)

| Priority | Format | Why |
|----------|--------|-----|
| 1st | AVIF | Best compression, wide support now |
| 2nd | WebP | Universal fallback, good compression |
| 3rd | JPEG/PNG | Legacy fallback for older browsers |

### Global Support Percentages (approx. Jan 2026)

| Format | Global Support |
|--------|----------------|
| WebP | ~97% |
| AVIF | ~93% |
| JPEG XL | ~18% (Safari only) |

### Fallback Strategy

```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>
```

For CSS backgrounds:
```css
.hero {
  background-image: url('image.jpg');
}

@supports (background-image: url('test.webp')) {
  .hero {
    background-image: url('image.webp');
  }
}

@supports (background-image: url('test.avif')) {
  .hero {
    background-image: url('image.avif');
  }
}
```

Or use JavaScript/server-side detection via Accept header.
