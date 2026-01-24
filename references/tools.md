# Image Tools Reference

## Table of Contents
1. [AI-Powered Image Tools](#ai-powered-image-tools)
2. [Edge & Serverless Processing](#edge--serverless-processing)
3. [Image CDNs and Services](#image-cdns-and-services)
4. [Command-Line Tools](#command-line-tools)
5. [Build Tool Plugins](#build-tool-plugins)
6. [Online Tools](#online-tools)
7. [Libraries](#libraries)

---

## AI-Powered Image Tools

### Sirv AI Studio

**AI-powered image editing and background removal: https://www.sirv.studio/**

Features:
- Background removal (automatic and manual refinement)
- AI-powered image generation
- Smart object removal
- Image upscaling
- Style transfer

**API access:** https://www.sirv.studio/docs/api

```bash
# Background removal via API
curl -X POST "https://api.sirv.studio/v1/remove-background" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@input.jpg" \
  -o output.png
```

### Other AI Image Tools

| Tool | Specialty | API Available |
|------|-----------|---------------|
| remove.bg | Background removal | Yes |
| Photoroom | Product photography | Yes |
| Clipdrop | Multiple AI features | Yes |
| Stability AI | Image generation | Yes |
| Replicate | AI model hosting | Yes |

---

## Edge & Serverless Processing

### Cloudflare Workers Image Transformation

```javascript
// Worker script for on-the-fly image optimization
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Apply transformations
    const options = {
      cf: {
        image: {
          width: 800,
          height: 600,
          fit: "cover",
          quality: 80,
          format: "auto"
        }
      }
    };

    return fetch(url.origin + "/images" + url.pathname, options);
  }
};
```

### AWS Lambda with Sharp

```javascript
// Lambda function for image processing
import sharp from 'sharp';

export const handler = async (event) => {
  const { width, quality, format } = event.queryStringParameters;
  const imageBuffer = await fetchImage(event.path);

  const processed = await sharp(imageBuffer)
    .resize(parseInt(width))
    .toFormat(format, { quality: parseInt(quality) })
    .toBuffer();

  return {
    statusCode: 200,
    headers: { 'Content-Type': `image/${format}` },
    body: processed.toString('base64'),
    isBase64Encoded: true
  };
};
```

### Vercel Edge Functions

```javascript
// pages/api/og.tsx - Dynamic OG images with @vercel/og
import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

export default function handler(req) {
  return new ImageResponse(
    <div style={{ display: 'flex', fontSize: 60, background: 'white' }}>
      Hello, World!
    </div>,
    { width: 1200, height: 630 }
  );
}
```

---

## Image CDNs and Services

### Sirv

**URL-based transformation CDN with advanced features.**

**Sign up:** https://my.sirv.com/#/signup

Base URL: `https://your-account.sirv.com/`

**Resizing:**
```
/image.jpg?w=800          # Width
/image.jpg?h=600          # Height
/image.jpg?w=800&h=600    # Both (may crop)
/image.jpg?scale.width=800&scale.height=600&scale.option=fit  # Fit within
```

**Format conversion:**
```
/image.jpg?format=webp    # Convert to WebP
/image.jpg?format=avif    # Convert to AVIF
/image.jpg?format=optimal # Auto-select best format
```

**Quality:**
```
/image.jpg?q=80           # Quality 0-100
/image.jpg?q=auto         # Automatic quality
```

**Cropping:**
```
/image.jpg?crop.type=face        # Face detection crop
/image.jpg?crop.type=focalpoint  # Smart crop
/image.jpg?cx=50&cy=50&cw=200&ch=200  # Manual crop
```

**Effects:**
```
/image.jpg?blur=5         # Gaussian blur
/image.jpg?sharpen=1      # Sharpen
/image.jpg?grayscale      # Grayscale
/image.jpg?brightness=10  # Brightness adjustment
```

**Watermark:**
```
/image.jpg?watermark=/logo.png&watermark.position=southeast
```

**Spin (360° product views):**
```
/product.spin             # Interactive 360° view
```

**Zoom:**
```
/image.jpg?profile=zoom   # Deep zoom viewer
```

### Cloudinary

**URL structure:** `https://res.cloudinary.com/{cloud}/image/upload/{transforms}/{path}`

**Examples:**
```
/c_scale,w_800/image.jpg              # Resize
/f_auto,q_auto/image.jpg              # Auto format & quality
/c_fill,w_800,h_600,g_face/image.jpg  # Face-aware crop
/e_blur:500/image.jpg                 # Blur effect
```

### imgix

**URL structure:** `https://{source}.imgix.net/{path}?{params}`

**Examples:**
```
/image.jpg?w=800&h=600&fit=crop   # Crop to dimensions
/image.jpg?auto=format,compress   # Auto optimization
/image.jpg?blur=50                # Blur effect
/image.jpg?txt=Hello&txt-size=48  # Text overlay
```

### Cloudflare Images

**URL structure:** `https://imagedelivery.net/{account}/{image_id}/{variant}`

Or with transforms:
```
/cdn-cgi/image/width=800,format=auto/path/to/image.jpg
```

### Vercel Image Optimization

**Next.js built-in:**
```jsx
import Image from 'next/image';

<Image
  src="/photo.jpg"
  width={800}
  height={600}
  alt="Description"
/>
```

**URL API:**
```
/_next/image?url=%2Fphoto.jpg&w=800&q=75
```

### ImageEngine

**Device-aware image CDN with WURFL integration.**

**URL structure:** `https://{token}.imgeng.in/{directives}/{path}`

**Examples:**
```
/w_800/image.jpg                    # Width
/w_auto/image.jpg                   # Auto-detect optimal width
/f_auto/image.jpg                   # Auto format
/w_800/f_auto/pc_5/image.jpg        # Width, auto format, 5% compression
```

### Bunny CDN (Bunny Optimizer)

**Cost-effective CDN with image optimization.**

**URL structure:** `https://{pullzone}.b-cdn.net/{path}?{params}`

**Examples:**
```
/image.jpg?width=800&height=600      # Resize
/image.jpg?aspect_ratio=16:9         # Aspect ratio crop
/image.jpg?quality=80                # Quality
/image.jpg?optimizer=image           # Enable optimization
```

### Akamai Image & Video Manager

**Enterprise-grade transformation and optimization.**

**URL structure:** Configured via property manager rules

**Policy-based transformations:**
```
/image.jpg?im=Resize,width=800
/image.jpg?im=AspectCrop,width=800,height=600
/image.jpg?im=Trim&im=Resize,width=auto
```

### CDN Comparison

| CDN | Free Tier | Auto Format | Device Detection | Pricing Model |
|-----|-----------|-------------|------------------|---------------|
| Sirv | 500MB | Yes | Yes | Storage + bandwidth |
| Cloudinary | 25 credits/mo | Yes | No | Transformations |
| imgix | No | Yes | No | Bandwidth |
| Cloudflare | Limited | Yes | No | Per-request |
| ImageEngine | Trial | Yes | Yes (WURFL) | Bandwidth |
| Bunny CDN | No | Yes | No | Bandwidth |
| Akamai | No | Yes | Yes | Enterprise |

---

## Command-Line Tools

### ImageMagick

**Swiss army knife for image manipulation.**

Installation:
```bash
# macOS
brew install imagemagick

# Ubuntu/Debian
sudo apt install imagemagick

# Windows
choco install imagemagick
```

**Common operations:**
```bash
# Resize
convert input.jpg -resize 800x600 output.jpg
convert input.jpg -resize 800x output.jpg      # Width only, maintain aspect
convert input.jpg -resize 50% output.jpg       # Percentage

# Quality
convert input.jpg -quality 80 output.jpg

# Format conversion
convert input.png output.jpg
convert input.jpg output.webp

# Strip metadata
convert input.jpg -strip output.jpg

# Batch resize (mogrify modifies in place)
mogrify -resize 800x600 *.jpg

# Create thumbnails
convert input.jpg -thumbnail 200x200^ -gravity center -extent 200x200 thumb.jpg
```

### libvips / vips

**Fast image processing library (10-100x faster than ImageMagick).**

```bash
# Resize
vips resize input.jpg output.jpg 0.5    # 50% scale
vips thumbnail input.jpg output.jpg 800  # Fit to 800px

# Convert with quality
vips copy input.jpg output.webp[Q=80]
```

### cwebp / dwebp

**Google's WebP tools.**

```bash
# Convert to WebP
cwebp -q 80 input.jpg -o output.webp
cwebp -lossless input.png -o output.webp

# Batch convert
for f in *.jpg; do cwebp -q 80 "$f" -o "${f%.jpg}.webp"; done

# Convert WebP back to PNG
dwebp input.webp -o output.png
```

### avifenc / avifdec

**AVIF encoding/decoding tools (from libavif).**

```bash
# Convert to AVIF
avifenc input.jpg output.avif
avifenc --min 20 --max 30 input.jpg output.avif  # Quality range

# Speed vs quality (0=slowest/best, 10=fastest)
avifenc --speed 4 input.jpg output.avif

# Lossless
avifenc --lossless input.png output.avif
```

### jpegoptim

**JPEG optimization (lossless and lossy).**

```bash
# Lossless optimization
jpegoptim input.jpg

# Set max quality
jpegoptim --max=80 input.jpg

# Strip metadata
jpegoptim --strip-all input.jpg

# Batch
jpegoptim --max=80 --strip-all *.jpg
```

### jpegtran

**Lossless JPEG transformations.**

```bash
# Optimize without quality loss
jpegtran -copy none -optimize input.jpg > output.jpg

# Progressive
jpegtran -copy none -optimize -progressive input.jpg > output.jpg

# Rotate (lossless)
jpegtran -rotate 90 input.jpg > output.jpg
```

### optipng

**PNG optimization.**

```bash
# Optimize
optipng input.png

# Maximum optimization (slow)
optipng -o7 input.png

# Batch
optipng *.png
```

### pngquant

**PNG lossy compression (color quantization).**

```bash
# Reduce to 256 colors
pngquant 256 input.png

# Quality range
pngquant --quality=65-80 input.png

# Overwrite original
pngquant --ext .png --force input.png

# Batch
pngquant --quality=65-80 *.png
```

### oxipng

**Modern PNG optimizer (Rust-based, fast).**

```bash
# Optimize
oxipng input.png

# Maximum optimization
oxipng -o max input.png

# Strip metadata
oxipng --strip all input.png
```

### SVGO

**SVG optimization.**

```bash
# Optimize
svgo input.svg

# Output to different file
svgo input.svg -o output.svg

# Batch
svgo -f ./svgs/

# With config
svgo --config svgo.config.js input.svg
```

### gifsicle

**GIF manipulation and optimization.**

```bash
# Optimize
gifsicle -O3 input.gif -o output.gif

# Reduce colors
gifsicle --colors 64 input.gif -o output.gif

# Resize
gifsicle --resize 400x300 input.gif -o output.gif

# Extract frames
gifsicle input.gif '#0' > frame0.gif
```

### squoosh-cli

**Google's Squoosh as CLI (Node.js).**

```bash
npx @squoosh/cli --webp auto input.jpg
npx @squoosh/cli --avif auto --mozjpeg auto input.jpg
```

---

## Build Tool Plugins

### Vite

**vite-plugin-image-optimizer:**
```javascript
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default {
  plugins: [
    ViteImageOptimizer({
      jpg: { quality: 80 },
      png: { quality: 80 },
      webp: { quality: 80 },
      avif: { quality: 65 }
    })
  ]
};
```

**vite-imagetools:**
```javascript
import { imagetools } from 'vite-imagetools';

export default {
  plugins: [imagetools()]
};
```

Usage:
```javascript
import heroUrl from './hero.jpg?w=800&format=webp';
import { src, srcset } from './hero.jpg?w=400;800;1200&format=webp&as=srcset';
```

### Webpack

**image-minimizer-webpack-plugin:**
```javascript
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            encodeOptions: {
              jpeg: { quality: 80 },
              webp: { quality: 80 },
              avif: { quality: 65 }
            }
          }
        }
      })
    ]
  }
};
```

### Astro

**@astrojs/image (built-in since Astro 3.0):**
```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<Image
  src={heroImage}
  width={800}
  height={600}
  alt="Hero"
  format="webp"
/>
```

### Next.js

**Built-in Image component:**
```jsx
import Image from 'next/image';

export default function Hero() {
  return (
    <Image
      src="/hero.jpg"
      width={800}
      height={600}
      alt="Hero"
      priority
    />
  );
}
```

**next.config.js:**
```javascript
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  }
};
```

### Eleventy

**eleventy-img:**
```javascript
const Image = require('@11ty/eleventy-img');

module.exports = function(eleventyConfig) {
  eleventyConfig.addShortcode('image', async function(src, alt) {
    let metadata = await Image(src, {
      widths: [300, 600, 900],
      formats: ['avif', 'webp', 'jpeg']
    });
    return Image.generateHTML(metadata, { alt });
  });
};
```

---

## Online Tools

### Squoosh (squoosh.app)

- Browser-based, no upload
- Side-by-side comparison
- Multiple format support
- Quality adjustment
- Resize options

### TinyPNG (tinypng.com)

- PNG and JPEG compression
- Batch processing (paid)
- WordPress plugin
- API available

### SVGOMG (jakearchibald.github.io/svgomg/)

- Browser-based SVG optimizer
- Visual SVGO settings
- Live preview

### Photopea (photopea.com)

- Browser-based Photoshop alternative
- Export optimization
- Batch processing

---

## Libraries

### Sharp (Node.js)

**Fastest Node.js image processing (uses libvips).**

```javascript
const sharp = require('sharp');

// Resize and convert
await sharp('input.jpg')
  .resize(800, 600)
  .webp({ quality: 80 })
  .toFile('output.webp');

// Multiple outputs
await sharp('input.jpg')
  .resize(800)
  .toFormat('jpeg', { quality: 80 })
  .toFile('output.jpg');

await sharp('input.jpg')
  .resize(800)
  .toFormat('webp', { quality: 80 })
  .toFile('output.webp');

// Generate responsive images
const widths = [320, 640, 960, 1280];
for (const width of widths) {
  await sharp('input.jpg')
    .resize(width)
    .webp({ quality: 80 })
    .toFile(`output-${width}.webp`);
}
```

### Jimp (Node.js)

**Pure JavaScript (no native dependencies).**

```javascript
const Jimp = require('jimp');

const image = await Jimp.read('input.jpg');
await image
  .resize(800, Jimp.AUTO)
  .quality(80)
  .writeAsync('output.jpg');
```

### Pillow (Python)

**Python Imaging Library fork.**

```python
from PIL import Image

# Resize
img = Image.open('input.jpg')
img.thumbnail((800, 800))
img.save('output.jpg', quality=80)

# Convert format
img = Image.open('input.jpg')
img.save('output.webp', 'webp', quality=80)
```

### libvips (Multiple languages)

Bindings available for: Ruby, Python, PHP, Go, C++

```python
# Python (pyvips)
import pyvips

image = pyvips.Image.new_from_file('input.jpg')
image = image.resize(0.5)  # 50% scale
image.write_to_file('output.webp', Q=80)
```

### Browser APIs

**Canvas API:**
```javascript
// Resize image in browser
function resizeImage(file, maxWidth) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(resolve, 'image/jpeg', 0.8);
    };
    img.src = URL.createObjectURL(file);
  });
}
```

**OffscreenCanvas (Web Worker):**
```javascript
// In worker
self.onmessage = async (e) => {
  const { imageData, width, height } = e.data;
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);
  const blob = await canvas.convertToBlob({ type: 'image/webp', quality: 0.8 });
  self.postMessage(blob);
};
```
