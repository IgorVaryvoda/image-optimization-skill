# Image & Media Skills

Skills for AI coding agents covering image optimization and media APIs.

## Install

```bash
npx add-skill IgorVaryvoda/image-optimization-skill
```

## Skills

### image-optimization

Execution-focused image optimization for web performance.

- **Image Formats** - JPEG, PNG, WebP, AVIF, GIF, SVG, HEIC, JPEG XL, HDR, wide color gamut
- **Optimization** - Quality settings, SSIM/VMAF thresholds, compression techniques
- **Responsive Images** - srcset, sizes, picture element, fetchpriority, container queries
- **Performance** - Core Web Vitals, placeholder strategies (LQIP, blur-up, blurhash), lazy loading
- **Sirv Workflows** - Dynamic Imaging URLs, profiles, REST inventory/upload/search, Next.js loader, Sirv JS tradeoffs
- **Audit Script** - No-dependency page/HTML image audit for markup, LCP hints, Sirv URLs, and optional HTTP headers
- **Tools** - CDNs (Sirv, Cloudinary, imgix), AI tools, edge/serverless, CLI tools

### sirv-api

Sirv REST API integration for image and file management.

- **Authentication** - JWT token auth
- **File Operations** - Upload, download, copy, delete, rename, directory listing
- **Metadata** - Title, description, tags, product info, approval status
- **Search** - Query files by name, date, size, metadata with Lucene-style syntax
- **Async Jobs** - Video/spin conversion, ZIP creation, batch operations
- **Account** - Usage stats, billing, events, folder options

### sirv-ai-studio

Guide for using Sirv AI Studio (www.sirv.studio), an AI-powered image and video processing platform.

- **Background Processing** - Removal, replacement, object removal
- **Image Enhancement** - Upscaling (up to 8x), AI editing
- **Image Generation** - FLUX 2, Gemini Pro, Z-Image, Seedream
- **Product Tools** - Lifestyle scenes, virtual try-on, color variants, alt text
- **3D Generation** - Image to 3D (GLB, OBJ, FBX, USDZ)
- **Video Tools** - LTX, Kling, Veo, captions
- **Batch Processing** - Process hundreds of images at once
- **Workflow Builder** - Visual DAG pipeline for multi-step operations
- **MCP Server** - Natural language image processing via Claude/ChatGPT

### sirv-dynamic-imaging

Sirv dynamic imaging URL API for on-the-fly image transformation.

- **Sizing** - Width, height, scale options, thumbnails
- **Cropping** - Manual crop, face detection, trim, point of interest
- **Effects** - Blur, sharpen, brightness, contrast, color tones, grayscale
- **Text Overlays** - Custom fonts, positioning, colors, backgrounds, outlines
- **Watermarks** - Logo placement, opacity, tiling, scaling
- **Formats** - WebP, AVIF, optimal auto-selection, quality settings
- **Profiles** - Reusable option presets as JSON

## Learn More

[imageguide.dev/tools/claude-skill](https://imageguide.dev/tools/claude-skill/)
