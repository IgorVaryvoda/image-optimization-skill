# Sirv AI Studio Platform Guide

Web UI features, full tool catalog, batch processing, Workflow Builder, pricing, and integrations. Use this when advising on the web UI, comparing tools/models, or planning multi-step and batch workflows.

Plan pricing and credit costs verified against the service source (July 2026); they change as models and plans evolve — confirm at sirv.studio (or with `sirv_get_usage`) before committing to large jobs.

## Table of Contents

1. [Web UI Basics](#web-ui-basics)
2. [Core Tools](#core-tools)
3. [Batch Processing](#batch-processing)
4. [Workflow Builder (Orchestrator)](#workflow-builder-orchestrator)
5. [Credit System](#credit-system)
6. [Sirv CDN Integration](#sirv-cdn-integration)
7. [Integrations](#integrations)
8. [Quality Control](#quality-control)
9. [File Formats](#file-formats)
10. [Tips](#tips)

## Web UI Basics

Users access Sirv AI Studio at www.sirv.studio:

1. Upload image(s) via drag-drop or URL
2. Select tool from sidebar
3. Configure options
4. Click Process
5. Download or auto-upload to Sirv CDN

## Core Tools

### Background Processing

| Tool | Credits | Use Case |
|------|---------|----------|
| Background Removal | 1 (BiRefNet), 2 (Bria) | Product cutouts, transparent PNG |
| Background Replace | 3 (FLUX Kontext), 4 (Bria), 15 (Nano Banana) | New backgrounds via prompt or image |
| Object Removal | 3 | Remove unwanted elements with mask |

**Background Removal Models:**
- BiRefNet v1/v2: Fast, multiple presets (Light, Heavy, Portrait, Matting)
- Bria: Premium quality alternative

### Image Enhancement

| Tool | Credits | Use Case |
|------|---------|----------|
| Upscaling | 1-136 by model and output size | Increase resolution |
| FLUX 2 Edit | 3 | Natural language editing |
| Reve Fast Edit | 1 | Quick prompt-based edits |

**Upscaling Models** (cost scales with output megapixels):
- ESRGAN: Fast, affordable — 1 credit (2 above 48MP output)
- Clarity: AI-enhanced with prompts — ~3 credits per output MP, min 2
- Topaz: Premium quality — 8/16/32/136 by output size tier
- SeedVR: video-grade upscaler (API)

Scale limits vary by surface: MCP tool 2-4x, REST API up to 10x, clamped to each model's max.

### Image Generation

| Tool | Credits/image | Use Case |
|------|---------|----------|
| FLUX 2 | 1 | High-quality text-to-image |
| Z-Image | 2 | Affordable alternative |
| Seedream | 2 | Creative/artistic styles |
| Nano Banana 2 | 5 (1K) / 10 (2K) / 15 (4K) | Versatile generation |
| Gemini Pro | 15 (1K) / 30 (4K) | Advanced generation |
| GPT Image 2 | 13 | Photorealistic generation |

Supports: 1-4 images per generation (cost multiplies), multiple aspect ratios, up to 2048x2048

### Product Tools

| Tool | Credits | Use Case |
|------|---------|----------|
| Product Lifestyle | 4 (Bria), 2 (Nano Banana Lite) | Product in lifestyle scenes |
| Virtual Try-On | 2-13 by model (default 4) | Garment on person |
| Try-On Video | 11/second | Animated try-on |
| Color Variants | 2+/color | Product in multiple colors |
| Alt Text | 1 | AI-generated descriptions |
| Product Description | 1 | Marketing copy (12+ languages) |

**Lifestyle Scenes:** 44 presets (kitchen, office, beach, etc.) or custom prompts

### 3D Generation

| Tool | Credits | Use Case |
|------|---------|----------|
| Meshy v6 | 50 | Single image to 3D |
| Meshy v5 Multi | 25 | Multi-angle input |
| Seed3D | 50 | Alternative model |
| Trellis / Trellis 2 | 2 / 30 | Budget and mid options |
| Hunyuan3D | 25 | Alternative model |

**Output formats:** GLB, OBJ, FBX, USDZ, Blend, STL with PBR textures (plus GLB optimization, 2 credits)

### Video Tools

| Tool | Credits/second | Use Case |
|------|---------|----------|
| Veo 3.1 | 10 (15 with audio) | High quality generation |
| LTX 2.0 | 6 (1080p) / 12 (1440p) / 24 (2160p) | Up to 4K, 6-10 seconds |
| Kling 2.6 | 7 (14 with audio) | 1080p with speech synthesis |
| Kling v3 / v3 Pro | 8.4-16.8 | Newer Kling variants |
| Captions | Variable | Multi-language transcription |

Total video cost = per-second rate × duration.

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

**Batch size limits by plan:**
- Free: 25 in-app; API batch endpoints require a paid plan
- Core: 500
- Growth: 2,000
- Enterprise / Volume+: custom/unlimited
- Legacy plans: Starter 100, Pro 500, Team 750, Business Classic 1,500, Business 3,000, Scale custom

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

Saved workflows can also be executed from the MCP server (`sirv_execute_workflow`).

## Credit System

### Current Plans

| Plan | Price | Monthly Credits | Batch |
|------|-------|---------|-------|
| Free | $0 | 25 | 25 in-app, no API batch |
| Core | $149/mo | 1,500 | 500 |
| Growth | $499/mo | 5,000 | 2,000 |
| Enterprise | from $3,500/mo | custom | custom |

Grandfathered plans still in service: Starter (150), Pro (600), Team (1,000), Business Classic (1,800), Business (5,000), Scale (10,000), and Volume+ tiers from 5K to 250K credits/month.

Unused paid credits roll over up to 2× the monthly allowance.

### Credit Packs (One-time top-ups)

- 500 credits: $49
- 1,000 credits: $89
- 2,500 credits: $199

## Sirv CDN Integration

Connect Sirv account for:
- Browse Sirv library in app
- Auto-upload processed images
- Per-tool upload destinations (e.g., `/products/cutouts/`)
- Instant global CDN delivery
- Shopify integration sync

## Integrations

| Platform | Use Case |
|----------|----------|
| Shopify | Browse products, auto-push results |
| Zapier | Trigger processing from workflows |
| n8n | Self-hosted automation |
| Claude/ChatGPT MCP | Natural language image editing |
| REST API | Custom integrations |

## Quality Control

**Image Review Tool:**
- Checks against marketplace rules (Gemini-backed)
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
