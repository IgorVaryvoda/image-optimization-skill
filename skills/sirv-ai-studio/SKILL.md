---
name: sirv-ai-studio
description: Guide for using Sirv AI Studio (www.sirv.studio), an AI-powered image and video processing platform. Use when working with product images, background removal, image upscaling, AI generation, video creation, batch processing, or e-commerce image workflows. Triggers on mentions of Sirv AI Studio, product photography, background removal, image upscaling, AI image generation, batch image processing, or marketplace optimization.
---

# Sirv AI Studio

AI-powered image and video processing platform for e-commerce, marketing, and creative workflows. Process images in seconds with 28+ AI tools, batch operations, and visual workflow builder.

## Quick Start

1. Upload image(s) via drag-drop or URL
2. Select tool from sidebar
3. Configure options
4. Click Process
5. Download or auto-upload to Sirv CDN

## Core Tools

### Background Processing

| Tool | Credits | Use Case |
|------|---------|----------|
| Background Removal | 1-2 | Product cutouts, transparent PNG |
| Background Replace | 3-4 | New backgrounds via prompt or image |
| Object Removal | 3 | Remove unwanted elements with mask |

**Background Removal Models:**
- BiRefNet v1/v2: Fast, multiple presets (Light, Heavy, Portrait, Matting)
- Bria: Premium quality alternative

**Background Replace Models:**
- Bria: Text prompt or reference image
- FLUX Kontext: Advanced with consistency
- Nano Banana: Faster alternative

### Image Enhancement

| Tool | Credits | Use Case |
|------|---------|----------|
| Upscaling | 1-32 | Increase resolution up to 8x |
| FLUX 2 Edit | 3 | Natural language editing |
| Reve Fast Edit | 1 | Quick prompt-based edits |

**Upscaling Models:**
- ESRGAN: Fast, affordable (1-2 credits, up to 8x)
- Clarity: AI-enhanced with prompts (8+ credits)
- Topaz: Premium quality (8-136 credits)

### Image Generation

| Tool | Credits | Use Case |
|------|---------|----------|
| FLUX 2 | 2 | High-quality text-to-image |
| Z-Image | 2 | Affordable alternative |
| Gemini Pro | 15-30 | Advanced generation |
| Seedream | 2 | Creative/artistic styles |

Supports: 1-4 images per generation, multiple aspect ratios, up to 2048x2048

### Product Tools

| Tool | Credits | Use Case |
|------|---------|----------|
| Product Lifestyle | 3-15 | Product in lifestyle scenes |
| Virtual Try-On | 4 | Garment on person |
| Try-On Video | 11 | Animated try-on |
| Color Variants | 2+/color | Product in multiple colors |
| Alt Text | 1 | AI-generated descriptions |
| Product Description | 1 | Marketing copy (12+ languages) |

**Lifestyle Scenes:** 44 presets (kitchen, office, beach, etc.) or custom prompts

### 3D Generation

| Tool | Credits | Use Case |
|------|---------|----------|
| Meshy v6 | 50 | Single image to 3D |
| Meshy v5 Multi | 25 | Multi-angle input |
| Seed3D/Trellis | 25-50 | Alternative models |

**Output formats:** GLB, OBJ, FBX, USDZ, Blend, STL with PBR textures

### Video Tools

| Tool | Credits | Use Case |
|------|---------|----------|
| LTX 2.0 | 6-24/sec | Up to 4K, 6-10 seconds |
| Kling 2.6 | 6-24/sec | 1080p with speech synthesis |
| Veo 3.1 | 6-24/sec | High quality generation |
| Captions | Variable | Multi-language transcription |

### Free Tools

- **Depth Map**: Generate depth data for 3D/AR effects
- **Image Optimizer**: 17 social media presets, resize/crop/convert
- **Smart Crop**: Intelligent cropping for platforms

## Batch Processing

Process multiple images simultaneously:

1. Upload batch via drag-drop or URL import
2. Configure shared settings
3. Preview results before processing
4. Download ZIP or auto-upload to Sirv

**Available batch tools:**
- Batch Background Removal
- Batch Upscale
- Batch Generate
- Batch Product Lifestyle
- Batch Background Replace
- Batch Alt Text
- Batch Image Translation

**Limits by tier:**
- Free: No batch
- Starter: 100 images
- Pro: 500 images
- Business: 1,500 images
- Volume+: Unlimited

## Workflow Builder (Orchestrator)

Visual DAG pipeline builder for multi-step operations:

**Capabilities:**
- Chain tools: Remove BG → Upscale → Lifestyle → Alt Text
- AI routing: Classify images → branch to different pipelines
- Quality loops: Review → Autofix → Final Review
- Multi-source: Combine images from different inputs

**Example workflows:**
- Amazon-Ready: Remove BG → Validate → Autofix → Alt text
- Fashion: Ghost mannequin → Remove BG → Shadow → Bundle
- Color Variants: Remove BG → Generate colors → Review

## Credit System

### Pricing Tiers

| Tier | Price | Credits | Batch | History |
|------|-------|---------|-------|---------|
| Free | $0 | 15 | 0 | 7 days |
| Starter | $9/mo | 150 | 100 | 30 days |
| Pro | $29/mo | 600 | 500 | 90 days |
| Business | $79/mo | 1,800 | 1,500 | Unlimited |
| Volume+ | $199+/mo | 5K-250K | Unlimited | Unlimited |

### Credit Packs (One-time)

- 50 credits: $4.99
- 100 credits: $9.99
- 500 credits: $39.99
- 1,000 credits: $69.99
- 2,500 credits: $149.99

Bonus credits on top-ups: Free 0%, Starter 5%, Pro 10%, Business 15%, Volume+ 20%

## Sirv CDN Integration

Connect Sirv account for:
- Browse Sirv library in app
- Auto-upload processed images
- Per-tool upload destinations (e.g., `/products/cutouts/`)
- Instant global CDN delivery
- Shopify integration sync

**Sirv plan bonuses:**
- Business: +50 credits
- Enterprise: +150 credits

## Integrations

| Platform | Use Case |
|----------|----------|
| Shopify | Browse products, auto-push results |
| Zapier | Trigger processing from workflows |
| n8n | Self-hosted automation |
| Claude/ChatGPT MCP | Natural language image editing |
| REST API | Custom integrations |

## Quality Control

**Image Review Tool (1 credit):**
- Checks against marketplace rules
- Validates: dimensions, background, watermarks, frame fill
- Presets: Amazon, eBay, Shopify, Walmart

**Marketplace Optimizer:**
- Upload → Select marketplaces → Get compliance scorecard
- One-click fixes for all issues

## File Formats

**Input:** JPG, PNG, WebP, GIF, AVIF, HEIF, BMP, TIFF

**Output:** PNG, JPEG, WebP, GIF (images), MP4/WebM (video), GLB/OBJ/FBX/USDZ/STL (3D)

## Tips

- **Eager upload**: Files upload immediately on selection for faster processing
- **Hash caching**: Identical files skip re-upload
- **Soft delete**: Recover deleted assets from trash
- **Mobile**: Long-press for context menu actions
- **Shortcuts**: Use keyboard shortcuts in dashboard for power workflows
