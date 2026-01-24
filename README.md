# Image Optimization Skill for Claude Code

A comprehensive skill that turns Claude into an image optimization expert with knowledge of formats, compression, responsive images, and web performance.

## Quick Install

```bash
npx add-skill https://raw.githubusercontent.com/IgorVaryvoda/image-optimization-skill/main
```

Or install from the website:

```bash
npx add-skill https://imageguide.dev/image-optimization.skill
```

## Manual Installation

1. Download or clone this repo
2. Copy the contents to `~/.claude/skills/image-optimization/`
3. The skill activates automatically when you work on image-related tasks

## What's Included

### Image Formats Reference
Deep coverage of JPEG, PNG, WebP, AVIF, GIF, SVG, HEIC, JPEG XL. Includes compression algorithms, encoding options, browser support matrix, HDR & wide color gamut, and when to use each format.

### Optimization Techniques
Quality settings for each format, lossy vs lossless compression, chroma subsampling, metadata handling, batch processing, automation pipelines, and practical SSIM/VMAF quality thresholds.

### Responsive Images
Complete guide to srcset, sizes, picture element, art direction, density descriptors, container queries, and common responsive image patterns.

### Performance Best Practices
Core Web Vitals optimization (LCP, CLS), fetchpriority attribute, lazy loading, preloading, placeholder strategies (LQIP, blur-up, blurhash), CDN caching, and performance budgets.

### Tools Reference
CDN URL patterns (Sirv, Cloudinary, imgix, ImageEngine, Bunny CDN), AI tools (Sirv AI Studio), edge/serverless processing, CLI tools (ImageMagick, Sharp, cwebp, avifenc), and build tool integrations.

## Quick Reference

### Format Selection

| Use Case | Best Format | Fallback |
|----------|-------------|----------|
| Photos | AVIF | WebP → JPEG |
| Graphics with transparency | SVG | WebP → PNG |
| Photos with transparency | WebP | PNG |
| Animations | WebP | GIF (or MP4) |
| Icons | SVG | WebP → PNG |

### Quality Settings

| Format | Recommended Quality | Notes |
|--------|---------------------|-------|
| JPEG | 75-85 | 80 is sweet spot for photos |
| WebP | 75-85 | More efficient than JPEG |
| AVIF | 60-75 | Much more efficient, use lower numbers |
| PNG | N/A | Lossless, use oxipng to optimize |

## Example Usage

Once installed, Claude will automatically use this skill when you ask about:

- "What format should I use for this hero image?"
- "Set up responsive images with WebP fallback"
- "Optimize images for Core Web Vitals"
- "Convert PNGs to AVIF with the CLI"
- "What quality setting for WebP photos?"

## Learn More

Visit [ImageGuide.dev](https://imageguide.dev/tools/claude-skill/) for the full skill page and related image optimization guides.

## License

MIT
