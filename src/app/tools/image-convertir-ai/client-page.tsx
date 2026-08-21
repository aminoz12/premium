'use client';

import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
//  TOOLS REGISTRY — 50+ tools
// ═══════════════════════════════════════════════════════════════
const TOOLS = [
  // CONVERT — Format to Format
  { id: 'jpg-to-png', cat: 'convert', title: 'JPG → PNG', full: 'JPG to PNG Converter', desc: 'Convert JPEG to transparent PNG', act: 'Convert to PNG', ext: 'png', mime: 'image/png', accept: 'image/jpeg,image/jpg', color: '#f97316', icon: 'img' },
  { id: 'png-to-jpg', cat: 'convert', title: 'PNG → JPG', full: 'PNG to JPG Converter', desc: 'Convert PNG to JPG with custom background', act: 'Convert to JPG', ext: 'jpg', mime: 'image/jpeg', accept: 'image/png', color: '#3b82f6', icon: 'img' },
  { id: 'webp-to-jpg', cat: 'convert', title: 'WebP → JPG', full: 'WebP to JPG Converter', desc: 'Convert WebP to universal JPEG format', act: 'Convert to JPG', ext: 'jpg', mime: 'image/jpeg', accept: 'image/webp', color: '#06b6d4', icon: 'img' },
  { id: 'webp-to-png', cat: 'convert', title: 'WebP → PNG', full: 'WebP to PNG Converter', desc: 'Convert WebP to lossless PNG format', act: 'Convert to PNG', ext: 'png', mime: 'image/png', accept: 'image/webp', color: '#0891b2', icon: 'img' },
  { id: 'jpg-to-webp', cat: 'convert', title: 'JPG → WebP', full: 'JPG to WebP Converter', desc: 'Convert JPEG to smaller WebP format for web', act: 'Convert to WebP', ext: 'webp', mime: 'image/webp', accept: 'image/jpeg,image/jpg', color: '#10b981', icon: 'img' },
  { id: 'png-to-webp', cat: 'convert', title: 'PNG → WebP', full: 'PNG to WebP Converter', desc: 'Convert PNG to WebP — smaller size same quality', act: 'Convert to WebP', ext: 'webp', mime: 'image/webp', accept: 'image/png', color: '#059669', icon: 'img' },
  { id: 'svg-to-png', cat: 'convert', title: 'SVG → PNG', full: 'SVG to PNG Converter', desc: 'Rasterize vector SVG to PNG bitmap', act: 'Convert to PNG', ext: 'png', mime: 'image/png', accept: 'image/svg+xml', color: '#ec4899', icon: 'vec' },
  { id: 'svg-to-jpg', cat: 'convert', title: 'SVG → JPG', full: 'SVG to JPG Converter', desc: 'Convert SVG vector to JPG raster image', act: 'Convert to JPG', ext: 'jpg', mime: 'image/jpeg', accept: 'image/svg+xml', color: '#db2777', icon: 'vec' },
  { id: 'svg-to-webp', cat: 'convert', title: 'SVG → WebP', full: 'SVG to WebP Converter', desc: 'Convert SVG to WebP for modern web use', act: 'Convert to WebP', ext: 'webp', mime: 'image/webp', accept: 'image/svg+xml', color: '#be185d', icon: 'vec' },
  { id: 'png-to-svg', cat: 'convert', title: 'PNG → SVG', full: 'PNG to SVG Converter', desc: 'Trace PNG to SVG vector (silhouette tracing)', act: 'Convert to SVG', ext: 'svg', mime: 'image/svg+xml', accept: 'image/png', color: '#7c3aed', icon: 'vec' },
  { id: 'jpg-to-svg', cat: 'convert', title: 'JPG → SVG', full: 'JPG to SVG Converter', desc: 'Trace JPG to SVG silhouette vector', act: 'Convert to SVG', ext: 'svg', mime: 'image/svg+xml', accept: 'image/jpeg,image/jpg', color: '#6d28d9', icon: 'vec' },
  { id: 'bmp-to-png', cat: 'convert', title: 'BMP → PNG', full: 'BMP to PNG Converter', desc: 'Convert legacy BMP bitmap to PNG format', act: 'Convert to PNG', ext: 'png', mime: 'image/png', accept: 'image/bmp', color: '#64748b', icon: 'img' },
  { id: 'bmp-to-jpg', cat: 'convert', title: 'BMP → JPG', full: 'BMP to JPG Converter', desc: 'Convert BMP to compressed JPEG format', act: 'Convert to JPG', ext: 'jpg', mime: 'image/jpeg', accept: 'image/bmp', color: '#475569', icon: 'img' },
  { id: 'gif-to-png', cat: 'convert', title: 'GIF → PNG', full: 'GIF to PNG Converter', desc: 'Extract first GIF frame as PNG image', act: 'Convert to PNG', ext: 'png', mime: 'image/png', accept: 'image/gif', color: '#f43f5e', icon: 'img' },
  { id: 'gif-to-jpg', cat: 'convert', title: 'GIF → JPG', full: 'GIF to JPG Converter', desc: 'Convert animated GIF first frame to JPG', act: 'Convert to JPG', ext: 'jpg', mime: 'image/jpeg', accept: 'image/gif', color: '#e11d48', icon: 'img' },
  { id: 'gif-to-webp', cat: 'convert', title: 'GIF → WebP', full: 'GIF to WebP Converter', desc: 'Convert GIF frame to WebP format', act: 'Convert to WebP', ext: 'webp', mime: 'image/webp', accept: 'image/gif', color: '#9f1239', icon: 'img' },
  { id: 'tiff-to-png', cat: 'convert', title: 'TIFF → PNG', full: 'TIFF to PNG Converter', desc: 'Convert TIFF/TIF images to PNG format', act: 'Convert to PNG', ext: 'png', mime: 'image/png', accept: 'image/tiff', color: '#854d0e', icon: 'img' },
  { id: 'tiff-to-jpg', cat: 'convert', title: 'TIFF → JPG', full: 'TIFF to JPG Converter', desc: 'Convert high-res TIFF to compressed JPG', act: 'Convert to JPG', ext: 'jpg', mime: 'image/jpeg', accept: 'image/tiff', color: '#713f12', icon: 'img' },
  { id: 'avif-to-jpg', cat: 'convert', title: 'AVIF → JPG', full: 'AVIF to JPG Converter', desc: 'Convert AVIF to universally supported JPEG', act: 'Convert to JPG', ext: 'jpg', mime: 'image/jpeg', accept: 'image/avif', color: '#365314', icon: 'img' },
  { id: 'avif-to-png', cat: 'convert', title: 'AVIF → PNG', full: 'AVIF to PNG Converter', desc: 'Convert AVIF to PNG lossless format', act: 'Convert to PNG', ext: 'png', mime: 'image/png', accept: 'image/avif', color: '#14532d', icon: 'img' },
  { id: 'jpg-to-bmp', cat: 'convert', title: 'JPG → BMP', full: 'JPG to BMP Converter', desc: 'Convert JPG to uncompressed BMP bitmap', act: 'Convert to BMP', ext: 'bmp', mime: 'image/bmp', accept: 'image/jpeg,image/jpg', color: '#1d4ed8', icon: 'img' },
  { id: 'png-to-bmp', cat: 'convert', title: 'PNG → BMP', full: 'PNG to BMP Converter', desc: 'Convert PNG to BMP format', act: 'Convert to BMP', ext: 'bmp', mime: 'image/bmp', accept: 'image/png', color: '#1e40af', icon: 'img' },
  { id: 'any-to-png', cat: 'convert', title: 'Any → PNG', full: 'Universal to PNG Converter', desc: 'Convert any image format to PNG', act: 'Convert to PNG', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#0369a1', icon: 'img' },
  { id: 'any-to-jpg', cat: 'convert', title: 'Any → JPG', full: 'Universal to JPG Converter', desc: 'Convert any image to JPEG format', act: 'Convert to JPG', ext: 'jpg', mime: 'image/jpeg', accept: 'image/*', color: '#0c4a6e', icon: 'img' },
  { id: 'any-to-webp', cat: 'convert', title: 'Any → WebP', full: 'Universal to WebP Converter', desc: 'Convert any image to WebP for the web', act: 'Convert to WebP', ext: 'webp', mime: 'image/webp', accept: 'image/*', color: '#134e4a', icon: 'img' },
  // EXPORT
  { id: 'png-to-ico', cat: 'export', title: 'PNG → ICO', full: 'PNG to ICO Favicon Generator', desc: 'Generate ICO favicon in multiple sizes', act: 'Generate ICO', ext: 'ico', mime: 'image/x-icon', accept: 'image/png', color: '#f59e0b', icon: 'ico' },
  { id: 'img-to-pdf', cat: 'export', title: 'Image → PDF', full: 'Image to PDF Converter', desc: 'Convert any image to a PDF document', act: 'Create PDF', ext: 'pdf', mime: 'application/pdf', accept: 'image/*', color: '#ef4444', icon: 'pdf' },
  { id: 'img-to-base64', cat: 'export', title: '→ Base64', full: 'Image to Base64 Encoder', desc: 'Encode image to Base64 data URL string', act: 'Encode Base64', ext: 'txt', mime: 'text/plain', accept: 'image/*', color: '#8b5cf6', icon: 'code' },
  { id: 'img-to-dataurl', cat: 'export', title: '→ Data URL', full: 'Image to Data URL', desc: 'Get full data:image URL for CSS/HTML embedding', act: 'Get Data URL', ext: 'txt', mime: 'text/plain', accept: 'image/*', color: '#7c3aed', icon: 'code' },
  // EDIT
  { id: 'resize', cat: 'edit', title: 'Resize', full: 'Resize Image Online', desc: 'Resize to exact pixels or by percentage', act: 'Resize Image', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#10b981', icon: 'resize' },
  { id: 'compress', cat: 'edit', title: 'Compress', full: 'Compress & Optimize Image', desc: 'Reduce file size with quality control', act: 'Compress', ext: 'jpg', mime: 'image/jpeg', accept: 'image/*', color: '#8b5cf6', icon: 'compress' },
  { id: 'rotate', cat: 'edit', title: 'Rotate', full: 'Rotate Image Online', desc: 'Rotate by 90°, 180°, 270° or custom angle', act: 'Apply Rotation', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#14b8a6', icon: 'rotate' },
  { id: 'flip', cat: 'edit', title: 'Flip', full: 'Flip Image Online', desc: 'Mirror image horizontally or vertically', act: 'Apply Flip', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#84cc16', icon: 'flip' },
  { id: 'crop', cat: 'edit', title: 'Crop', full: 'Crop Image Online', desc: 'Crop image to exact pixel coordinates', act: 'Crop Image', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#f43f5e', icon: 'crop' },
  { id: 'watermark', cat: 'edit', title: 'Watermark', full: 'Add Watermark to Image', desc: 'Add text watermark with custom style & position', act: 'Add Watermark', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#a78bfa', icon: 'text' },
  { id: 'text-overlay', cat: 'edit', title: 'Add Text', full: 'Add Text Overlay to Image', desc: 'Add styled text annotation to your image', act: 'Add Text', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#60a5fa', icon: 'text' },
  { id: 'border', cat: 'edit', title: 'Add Border', full: 'Add Border to Image', desc: 'Add a solid or colored border frame to image', act: 'Add Border', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#34d399', icon: 'border' },
  { id: 'padding', cat: 'edit', title: 'Add Padding', full: 'Add Padding / Canvas Expand', desc: 'Expand canvas with solid color padding', act: 'Add Padding', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#2dd4bf', icon: 'border' },
  { id: 'square-crop', cat: 'edit', title: 'Square Crop', full: 'Square Crop (Instagram)', desc: 'Crop image to a centered square (1:1 ratio)', act: 'Square Crop', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#e879f9', icon: 'crop' },
  { id: 'aspect-crop', cat: 'edit', title: 'Aspect Crop', full: 'Aspect Ratio Crop', desc: 'Crop to 16:9, 4:3, 3:2 or custom ratio', act: 'Crop to Ratio', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#d946ef', icon: 'crop' },
  // ADJUST
  { id: 'brightness', cat: 'adjust', title: 'Brightness', full: 'Adjust Brightness & Contrast', desc: 'Control brightness, contrast and exposure', act: 'Apply Adjustments', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#fbbf24', icon: 'adjust' },
  { id: 'hue-saturation', cat: 'adjust', title: 'Hue/Saturation', full: 'Adjust Hue & Saturation', desc: 'Shift hue and adjust color saturation', act: 'Apply Adjustments', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#fb923c', icon: 'adjust' },
  { id: 'levels', cat: 'adjust', title: 'Levels', full: 'Adjust Image Levels', desc: 'Adjust shadow, midtone and highlight levels', act: 'Apply Levels', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#f97316', icon: 'adjust' },
  { id: 'opacity', cat: 'adjust', title: 'Opacity', full: 'Adjust Image Opacity', desc: 'Make image transparent with custom opacity', act: 'Apply Opacity', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#a3e635', icon: 'adjust' },
  { id: 'sharpen', cat: 'adjust', title: 'Sharpen', full: 'Sharpen Image', desc: 'Enhance image sharpness and edge definition', act: 'Sharpen Image', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#4ade80', icon: 'adjust' },
  { id: 'blur', cat: 'adjust', title: 'Blur', full: 'Blur Image', desc: 'Apply Gaussian blur with adjustable radius', act: 'Apply Blur', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#22d3ee', icon: 'adjust' },
  { id: 'shadow', cat: 'adjust', title: 'Drop Shadow', full: 'Add Drop Shadow', desc: 'Add a drop shadow behind your image', act: 'Add Shadow', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#818cf8', icon: 'adjust' },
  { id: 'round-corners', cat: 'adjust', title: 'Round Corners', full: 'Round Image Corners', desc: 'Apply rounded corners to any image format', act: 'Apply Rounding', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#c084fc', icon: 'adjust' },
  // FILTERS
  { id: 'grayscale', cat: 'filter', title: 'Grayscale', full: 'Convert to Grayscale (B&W)', desc: 'Remove all color to make black & white image', act: 'Apply Grayscale', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#6b7280', icon: 'filter' },
  { id: 'sepia', cat: 'filter', title: 'Sepia', full: 'Sepia Tone Filter', desc: 'Apply warm vintage sepia color effect', act: 'Apply Sepia', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#92400e', icon: 'filter' },
  { id: 'invert', cat: 'filter', title: 'Invert', full: 'Invert Colors (Negative)', desc: 'Invert all colors to create a negative image', act: 'Apply Invert', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#1e293b', icon: 'filter' },
  { id: 'vintage', cat: 'filter', title: 'Vintage', full: 'Vintage Photo Filter', desc: 'Apply retro vintage photo effect with vignette', act: 'Apply Vintage', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#b45309', icon: 'filter' },
  { id: 'vignette', cat: 'filter', title: 'Vignette', full: 'Add Vignette Effect', desc: 'Darken image edges for cinematic look', act: 'Add Vignette', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#374151', icon: 'filter' },
  { id: 'pixelate', cat: 'filter', title: 'Pixelate', full: 'Pixelate / Mosaic Effect', desc: 'Create pixel art or censor effect', act: 'Apply Pixelate', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#059669', icon: 'filter' },
  { id: 'emboss', cat: 'filter', title: 'Emboss', full: 'Emboss Effect', desc: 'Apply 3D emboss/relief effect to image', act: 'Apply Emboss', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#4f46e5', icon: 'filter' },
  { id: 'edge-detect', cat: 'filter', title: 'Edge Detect', full: 'Edge Detection Filter', desc: 'Extract edges and outlines from image', act: 'Detect Edges', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#0f172a', icon: 'filter' },
  { id: 'posterize', cat: 'filter', title: 'Posterize', full: 'Posterize Image', desc: 'Reduce color levels for a poster-art effect', act: 'Posterize', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#7e22ce', icon: 'filter' },
  { id: 'duotone', cat: 'filter', title: 'Duotone', full: 'Duotone Color Effect', desc: 'Apply two-tone color mapping effect', act: 'Apply Duotone', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#be123c', icon: 'filter' },
  // AI-STYLE
  { id: 'glitch', cat: 'ai', title: 'Glitch', full: 'Glitch Art Effect', desc: 'Add RGB channel split glitch art effect', act: 'Apply Glitch', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#e11d48', icon: 'fx' },
  { id: 'halftone', cat: 'ai', title: 'Halftone', full: 'Halftone Dot Pattern', desc: 'Convert image to halftone dot print effect', act: 'Apply Halftone', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#1d4ed8', icon: 'fx' },
  { id: 'ascii-art', cat: 'ai', title: 'ASCII Art', full: 'Image to ASCII Art', desc: 'Convert image to ASCII text art', act: 'Generate ASCII', ext: 'txt', mime: 'text/plain', accept: 'image/*', color: '#15803d', icon: 'fx' },
  { id: 'sketch', cat: 'ai', title: 'Sketch', full: 'Photo to Pencil Sketch', desc: 'Convert photo to pencil sketch drawing effect', act: 'Apply Sketch', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#57534e', icon: 'fx' },
];

// ═══════════════════════════════════════════════════════════════
//  ICON SVGs
// ═══════════════════════════════════════════════════════════════
const ICONS: Record<string, string> = {
  img: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><polyline points="21 15 16 10 5 21"/></svg>`,
  vec: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  ico: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  pdf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>`,
  code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  resize: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
  compress: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="21" y2="3"/><line x1="3" y1="21" x2="14" y2="10"/></svg>`,
  rotate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>`,
  flip: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"/></svg>`,
  crop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.13 1L6 16a2 2 0 002 2h15"/><path d="M1 6.13L16 6a2 2 0 012 2v15"/></svg>`,
  text: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
  border: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`,
  adjust: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`,
  filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>`,
  fx: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
};

// ═══════════════════════════════════════════════════════════════
//  APP STATE
// ═══════════════════════════════════════════════════════════════
let state: { tool: any; file: File | null; blob: Blob | null; origMeta: any; cat: string; q: string } = {
  tool: null, file: null, blob: null, origMeta: null, cat: 'all', q: ''
};

const globalCSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
    --bg: #f5f3ef;
    --card: #ffffff;
    --border: #e4e0d8;
    --fg: #1a1714;
    --muted: #7a7167;
    --accent: #e85d26;
    --accent2: #2d6be4;
    --accent3: #16a34a;
    --surface: #faf8f4;
    --card-rgb: 255,255,255;
    --shadow: 0 2px 8px rgba(0,0,0,0.06),0 1px 3px rgba(0,0,0,0.04);
    --shadow-lg: 0 12px 40px rgba(0,0,0,0.1),0 4px 12px rgba(0,0,0,0.06);
}
.dark {
    --bg: #131110;
    --card: #1e1b18;
    --border: #2e2a26;
    --fg: #f0ece6;
    --muted: #8c8680;
    --surface: #181512;
    --card-rgb: 30,27,24;
}

html { scroll-behavior: smooth; }
body {
    font-family: 'Instrument Sans', sans-serif;
    background: var(--bg);
    color: var(--fg);
    min-height: 100vh;
    transition: background 0.3s, color 0.3s;
}

@media (hover: hover) and (pointer: fine) {
    body.has-custom-cursor { cursor: none; }
    body.has-custom-cursor a,
    body.has-custom-cursor button,
    body.has-custom-cursor label,
    body.has-custom-cursor [role="button"],
    body.has-custom-cursor input,
    body.has-custom-cursor select,
    body.has-custom-cursor textarea { cursor: none; }
}
#cur { position:fixed;width:10px;height:10px;border-radius:50%;background:var(--accent);pointer-events:none;z-index:99999;transform:translate(-50%,-50%);transition:width .15s,height .15s,background .15s;opacity:0;display:none; }
#cur2 { position:fixed;width:32px;height:32px;border-radius:50%;border:1.5px solid rgba(232,93,38,0.5);pointer-events:none;z-index:99998;transform:translate(-50%,-50%);transition:width .2s,height .2s,opacity .2s;opacity:0;display:none; }
body.has-custom-cursor #cur,
body.has-custom-cursor #cur2 { display:block; }
body.ch #cur{width:16px;height:16px;background:var(--accent2);}
body.ch #cur2{width:44px;height:44px;border-color:rgba(45,107,228,0.6);}

body::before {
    content:'';position:fixed;inset:0;pointer-events:none;z-index:-1;
    background-image: radial-gradient(circle at 20% 20%, rgba(232,93,38,0.06) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(45,107,228,0.05) 0%, transparent 50%);
}

.header-glass { background:rgba(var(--card-rgb),.85);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px); }

.tool-card {
    background:var(--card);border:1.5px solid var(--border);
    border-radius:16px;padding:18px;text-align:left;width:100%;
    transition:transform .2s,box-shadow .2s,border-color .2s;
    position:relative;overflow:hidden;
}
.tool-card::after {
    content:'';position:absolute;inset:0;border-radius:16px;
    background:linear-gradient(135deg,rgba(255,255,255,0.06),transparent);
    opacity:0;transition:opacity .2s;pointer-events:none;
}
.tool-card:hover { transform:translateY(-4px);box-shadow:var(--shadow-lg);border-color:var(--accent); }
.tool-card:hover::after { opacity:1; }
.tool-card.active { border-color:var(--accent);box-shadow:0 0 0 3px rgba(232,93,38,0.15),var(--shadow); }

.cat-tab { padding:7px 16px;border-radius:999px;font-size:.82rem;font-weight:600;border:1.5px solid var(--border);background:var(--card);color:var(--muted);transition:all .2s;white-space:nowrap; }
.cat-tab.active { background:var(--fg);color:var(--bg);border-color:var(--fg); }

.upload-zone {
    border:2px dashed var(--border);background:var(--surface);
    border-radius:20px;transition:all .25s;
}
.upload-zone.drag { border-color:var(--accent);background:rgba(232,93,38,0.04);transform:scale(1.01); }

.btn { display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:12px;font-weight:600;font-size:.875rem;font-family:'Instrument Sans',sans-serif;transition:all .2s;border:none; }
.btn-primary { background:var(--fg);color:var(--bg);box-shadow:0 4px 14px rgba(0,0,0,0.15); }
.btn-primary:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.2); }
.btn-primary:disabled { opacity:.45; }
.btn-secondary { background:var(--card);color:var(--fg);border:1.5px solid var(--border); }
.btn-secondary:hover { background:var(--border); }
.btn-accent { background:var(--accent);color:white;box-shadow:0 4px 14px rgba(232,93,38,0.3); }
.btn-accent:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 8px 24px rgba(232,93,38,0.4); }
.btn-accent:disabled { opacity:.5; }

.inp {
    width:100%;padding:9px 13px;border-radius:10px;border:1.5px solid var(--border);
    background:var(--card);color:var(--fg);font-family:'Instrument Sans',sans-serif;
    font-size:.875rem;outline:none;transition:border-color .2s,box-shadow .2s;
}
.inp:focus { border-color:var(--accent);box-shadow:0 0 0 3px rgba(232,93,38,0.1); }
.dark .inp { color:var(--fg); }

input[type=range] { -webkit-appearance:none;appearance:none;width:100%;height:5px;background:var(--border);border-radius:3px;outline:none; }
input[type=range]::-webkit-slider-thumb { -webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:var(--fg);box-shadow:0 2px 6px rgba(0,0,0,0.2);transition:transform .15s; }
input[type=range]::-webkit-slider-thumb:hover { transform:scale(1.2); }
input[type=range]::-moz-range-thumb { width:18px;height:18px;border-radius:50%;background:var(--fg);border:none;box-shadow:0 2px 6px rgba(0,0,0,0.2); }

.chk,.rad { -webkit-appearance:none;appearance:none;width:17px;height:17px;border:2px solid var(--border);transition:all .2s;flex-shrink:0; }
.chk { border-radius:5px; }
.chk:checked { background:var(--fg);border-color:var(--fg);background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E"); }
.rad { border-radius:50%; }
.rad:checked { border-color:var(--accent);border-width:5px; }

.checker { background-color:#e9e6e0;background-image:linear-gradient(45deg,#f5f3ef 25%,transparent 25%),linear-gradient(-45deg,#f5f3ef 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#f5f3ef 75%),linear-gradient(-45deg,transparent 75%,#f5f3ef 75%);background-size:16px 16px;background-position:0 0,0 8px,8px -8px,-8px 0; }
.dark .checker { background-color:#1e1b18;background-image:linear-gradient(45deg,#131110 25%,transparent 25%),linear-gradient(-45deg,#131110 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#131110 75%),linear-gradient(-45deg,transparent 75%,#131110 75%); }

.chip { display:inline-flex;align-items:center;gap:5px;border:1.5px solid var(--border);border-radius:10px;padding:6px 14px;font-size:.82rem;font-weight:600;background:var(--card);color:var(--fg);transition:all .2s; }
.chip:hover { border-color:var(--accent);color:var(--accent); }
.chip.sel { border-color:var(--accent);background:rgba(232,93,38,0.08);color:var(--accent); }

#toastBox { position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px; }
.toast { padding:13px 18px;border-radius:14px;font-size:.84rem;font-weight:500;display:flex;align-items:center;gap:9px;box-shadow:var(--shadow-lg);max-width:300px;animation:slideUp .35s cubic-bezier(.16,1,.3,1) both; }
.toast-s { background:#f0fdf4;border:1.5px solid #86efac;color:#14532d; }
.toast-e { background:#fef2f2;border:1.5px solid #fca5a5;color:#7f1d1d; }
.toast-i { background:#eff6ff;border:1.5px solid #bfdbfe;color:#1e3a8a; }
.dark .toast-s { background:#052e16;border-color:#16a34a;color:#86efac; }
.dark .toast-e { background:#450a0a;border-color:#dc2626;color:#fca5a5; }
.dark .toast-i { background:#172554;border-color:#3b82f6;color:#bfdbfe; }

.prog { height:3px;border-radius:2px;background:linear-gradient(90deg,var(--accent),var(--accent2),var(--accent));background-size:200% 100%;animation:shimmer 1.2s linear infinite; }

@keyframes slideUp { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
@keyframes fadeUp { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
@keyframes shimmer { 0%{background-position:-200% 0}100%{background-position:200% 0} }
@keyframes spin { to{transform:rotate(360deg)} }
@keyframes pulse { 0%,100%{opacity:1}50%{opacity:.5} }
@keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)} }

.fade-up { animation:fadeUp .5s cubic-bezier(.16,1,.3,1) both; }
.fa-1 { animation-delay:.05s } .fa-2 { animation-delay:.1s } .fa-3 { animation-delay:.15s }
.fa-4 { animation-delay:.2s } .fa-5 { animation-delay:.25s }

.slabel { font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:8px; }

.search-wrap { position:relative; }
.search-wrap svg { position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none; }
.search-inp { padding-left:38px !important; }

::-webkit-scrollbar { width:5px; }
::-webkit-scrollbar-thumb { background:var(--border);border-radius:3px; }
:focus-visible { outline:2px solid var(--accent);outline-offset:3px;border-radius:6px; }

@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms !important;transition-duration:.01ms !important}}

.count-badge { font-size:.75rem;font-weight:700;padding:3px 10px;border-radius:999px;background:var(--fg);color:var(--bg); }

.tool-icon { width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.tool-icon svg { width:20px;height:20px; }

.fmt { font-size:.65rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:2px 7px;border-radius:5px; }

#toolPanel { transition:all .3s; }

input[type=color] { -webkit-appearance:none;appearance:none;border:2px solid var(--border);padding:2px;height:38px;border-radius:8px;background:var(--card); }
input[type=color]::-webkit-color-swatch-wrapper { padding:0;border-radius:5px; }
input[type=color]::-webkit-color-swatch { border:none;border-radius:5px; }

.cats-scroll { overflow-x:auto;scrollbar-width:none; }
.cats-scroll::-webkit-scrollbar { display:none; }

.tool-card .badge-row { display:flex;align-items:center;gap:6px;margin-bottom:10px; }
`;

export default function ImageConvertirAI() {
  useEffect(() => {
    const $ = (id: string) => document.getElementById(id);
    const cvs = $('cvs') as HTMLCanvasElement;
    const ctx = cvs.getContext('2d')!;

    // ── Dark Mode ──
    const applyDark = (d: boolean) => {
      document.documentElement.classList.toggle('dark', d);
      const sunI = $('sunI'); const moonI = $('moonI');
      if (sunI) sunI.classList.toggle('hidden', d);
      if (moonI) moonI.classList.toggle('hidden', !d);
      try { localStorage.setItem('dark', d ? '1' : '0'); } catch (e) { }
    };
    let savedDark: string | null = null;
    try { savedDark = localStorage.getItem('dark'); } catch (e) { }
    applyDark(savedDark === '1' || (!savedDark && matchMedia('(prefers-color-scheme:dark)').matches));
    const darkBtn = $('darkBtn');
    if (darkBtn) darkBtn.onclick = () => applyDark(!document.documentElement.classList.contains('dark'));

    // ── Custom Cursor ──
    const isFinePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isFinePointer) {
      document.body.classList.add('has-custom-cursor');
      let mx = -200, my = -200, rx = -200, ry = -200;
      document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
      const c = $('cur'), c2 = $('cur2');
      const loop = () => {
        if (c) c.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
        rx += (mx - rx) * .13; ry += (my - ry) * .13;
        if (c2) c2.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
        requestAnimationFrame(loop);
      };
      loop();
      document.addEventListener('mouseenter', () => { if (c) { c.style.opacity = '1'; } if (c2) { c2.style.opacity = '1'; } });
      document.addEventListener('mouseleave', () => { if (c) { c.style.opacity = '0'; } if (c2) { c2.style.opacity = '0'; } });
      const targets = 'button,a,label,input,select,[role=button],.tool-card';
      document.addEventListener('mouseover', e => { const t = e.target as Element; if (t.closest && t.closest(targets)) document.body.classList.add('ch'); });
      document.addEventListener('mouseout', e => { const t = e.target as Element; if (t.closest && t.closest(targets)) document.body.classList.remove('ch'); });
      document.addEventListener('mousemove', () => { if (c) { c.style.opacity = '1'; } if (c2) { c2.style.opacity = '1'; } }, { once: true });
    }

    // ── Toast ──
    const toast = (msg: string, type = 'i', ms = 3000) => {
      const icons: Record<string, string> = {
        s: '<svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>',
        e: '<svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/></svg>',
        i: '<svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/></svg>',
      };
      const el = document.createElement('div');
      el.className = `toast toast-${type}`;
      el.innerHTML = (icons[type] || icons.i) + `<span></span>`;
      const span = el.querySelector('span');
      if (span) span.textContent = msg;
      const tb = $('toastBox');
      if (tb) tb.appendChild(el);
      setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, ms);
    };

    const fmtSize = (b: number) => {
      if (!b) return '0B';
      const k = 1024, u = ['B', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(b) / Math.log(k));
      return (b / Math.pow(k, i)).toFixed(1) + u[i];
    };

    // ── Render Grid ──
    const renderGrid = () => {
      const q = state.q.toLowerCase();
      const filtered = TOOLS.filter(t =>
        (state.cat === 'all' || t.cat === state.cat) &&
        (!q || t.title.toLowerCase().includes(q) || t.full.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q))
      );
      const tc = $('toolCount'); if (tc) tc.textContent = String(filtered.length);
      const grid = $('toolsGrid');
      const noRes = $('noResults');
      if (!filtered.length) { if (grid) grid.innerHTML = ''; if (noRes) noRes.classList.remove('hidden'); return; }
      if (noRes) noRes.classList.add('hidden');
      if (grid) grid.innerHTML = filtered.map((t, i) => `
        <button class="tool-card" data-id="${t.id}" style="animation:fadeUp .4s ${i * .03}s both" aria-label="${t.full}">
          <div class="badge-row">
            <div class="tool-icon" style="background:${t.color}18;color:${t.color}">${ICONS[t.icon] || ICONS.img}</div>
            <span class="fmt" style="background:${t.color}18;color:${t.color}">${t.cat}</span>
          </div>
          <div class="font-display font-bold text-sm leading-tight mb-1" style="color:var(--fg)">${t.title}</div>
          <div class="text-xs leading-relaxed" style="color:var(--muted)">${t.desc}</div>
        </button>
      `).join('');
    };

    // ── Category tabs ──
    document.querySelectorAll('.cat-tab').forEach(btn => {
      (btn as HTMLElement).onclick = () => {
        document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.cat = (btn as HTMLElement).dataset.cat || 'all';
        renderGrid();
      };
    });
    const searchInp = $('searchInp') as HTMLInputElement;
    if (searchInp) searchInp.oninput = (e: Event) => { state.q = (e.target as HTMLInputElement).value; renderGrid(); };

    // ── Select Tool ──
    const toolsGrid = $('toolsGrid');
    if (toolsGrid) toolsGrid.addEventListener('click', (e: Event) => {
      const card = (e.target as Element).closest('.tool-card') as HTMLElement;
      if (card) openTool(card.dataset.id || '');
    });

    const openTool = (id: string) => {
      state.tool = TOOLS.find(t => t.id === id);
      if (!state.tool) return;
      const panelTitle = $('panelTitle'); if (panelTitle) panelTitle.textContent = state.tool.full;
      const panelDesc = $('panelDesc'); if (panelDesc) panelDesc.textContent = state.tool.desc;
      const runBtnTxt = $('runBtnTxt'); if (runBtnTxt) runBtnTxt.textContent = state.tool.act;
      const fileInp = $('fileInp') as HTMLInputElement; if (fileInp) fileInp.accept = state.tool.accept || 'image/*';
      const panelIcon = $('panelIcon');
      if (panelIcon) panelIcon.innerHTML = `<div style="width:48px;height:48px;border-radius:14px;background:${state.tool.color}20;color:${state.tool.color};display:flex;align-items:center;justify-content:center">${ICONS[state.tool.icon] || ICONS.img}</div>`;
      const toolPanel = $('toolPanel'); if (toolPanel) toolPanel.classList.remove('hidden');
      setTimeout(() => { const tp = $('toolPanel'); if (tp) tp.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
      document.querySelectorAll('.tool-card').forEach(c => c.classList.toggle('active', (c as HTMLElement).dataset.id === id));
      renderOptions();
      resetPanel(true);
      toast(`${state.tool.title} ready`, 'i', 2000);
    };

    // ── Close tool ──
    const closeBtn = $('closeBtn');
    if (closeBtn) closeBtn.onclick = () => {
      const tp = $('toolPanel'); if (tp) tp.classList.add('hidden');
      document.querySelectorAll('.tool-card').forEach(c => c.classList.remove('active'));
      state.tool = null; resetPanel(true);
    };

    // ── Render Options ──
    const renderOptions = () => {
      const op = $('optPanel');
      if (!op) return;
      op.innerHTML = ''; op.classList.add('hidden');
      if (!state.tool) return;
      const show = (html: string) => { op.innerHTML = html; op.classList.remove('hidden'); };
      const id = state.tool.id;

      const sizeChips = (opts: [string | number, string][], name: string, def: string | number) => opts.map(([v, l]) =>
        `<label class="chip ${v == def ? 'sel' : ''}"><input type="radio" name="${name}" class="rad hidden" value="${v}" ${v == def ? 'checked' : ''}>${l}</label>`
      ).join('');

      switch (id) {
        case 'png-to-jpg': case 'webp-to-jpg': case 'bmp-to-jpg': case 'gif-to-jpg': case 'tiff-to-jpg': case 'avif-to-jpg': case 'svg-to-jpg': case 'jpg-to-bmp': case 'png-to-bmp': case 'any-to-jpg':
          show(`<p class="slabel">Background Color</p><div class="flex items-center gap-3"><input type="color" id="bgCol" value="#ffffff"><label class="text-sm" style="color:var(--fg)">Fill transparent areas</label></div>`); break;
        case 'png-to-ico':
          show(`<p class="slabel">Favicon Sizes</p><div class="flex flex-wrap gap-2">${[16, 32, 48, 64, 128].map(s => `<label class="chip ${s === 32 ? 'sel' : ''}"><input type="checkbox" class="chk hidden ico-sz" value="${s}" ${s === 32 ? 'checked' : ''}>${s}px</label>`).join('')}</div>`); break;
        case 'resize':
          show(`<p class="slabel">Dimensions</p><div class="grid grid-cols-2 gap-4 mb-4"><div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">Width (px)</label><input type="number" id="rW" class="inp" min="1"></div><div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">Height (px)</label><input type="number" id="rH" class="inp" min="1"></div></div><label class="flex items-center gap-2.5"><input type="checkbox" id="rAsp" class="chk" checked><span class="text-sm" style="color:var(--fg)">Lock aspect ratio</span></label><div class="mt-4"><p class="slabel mb-2">Scale by percentage</p><div class="flex items-center gap-3"><input type="range" id="rPct" min="1" max="400" value="100"><span id="rPctVal" class="text-sm font-bold w-12" style="color:var(--accent)">100%</span></div></div>`); break;
        case 'compress':
          show(`<div class="flex items-center justify-between mb-3"><p class="slabel mb-0">JPEG Quality</p><span id="qVal" class="font-display font-bold text-2xl" style="color:var(--accent)">80%</span></div><input type="range" id="qSlider" min="1" max="100" value="80" class="w-full mb-2"><div class="flex justify-between text-xs" style="color:var(--muted)"><span>Smaller file</span><span>Higher quality</span></div>`); break;
        case 'svg-to-png': case 'svg-to-webp':
          show(`<p class="slabel">Output Size</p><div class="flex flex-wrap gap-2">${sizeChips([[256, '256px'], [512, '512px'], [1024, '1024px'], [2048, '2048px']], 'svgSz', 512)}</div>`); break;
        case 'rotate':
          show(`<p class="slabel">Rotation Angle</p><div class="flex flex-wrap gap-2 mb-4">${sizeChips([[90, '↻ 90°'], [180, '↻ 180°'], [270, '↺ 90°']], 'rotA', 90)}</div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">Custom angle (0–360°)</label><input type="number" id="custAng" class="inp w-32" min="0" max="360" placeholder="e.g. 45">`); break;
        case 'flip':
          show(`<p class="slabel">Flip Direction</p><div class="flex flex-wrap gap-2">${sizeChips([['h', '⬄ Horizontal'], ['v', '⬍ Vertical'], ['b', 'Both']], 'flipD', 'h')}</div>`); break;
        case 'crop':
          show(`<p class="slabel">Crop Region (pixels)</p><div class="grid grid-cols-2 gap-3"><div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">X (left)</label><input type="number" id="cX" class="inp" value="0" min="0"></div><div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">Y (top)</label><input type="number" id="cY" class="inp" value="0" min="0"></div><div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">Width</label><input type="number" id="cW" class="inp" min="1"></div><div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">Height</label><input type="number" id="cH" class="inp" min="1"></div></div>`); break;
        case 'aspect-crop':
          show(`<p class="slabel">Aspect Ratio</p><div class="flex flex-wrap gap-2">${sizeChips([['16:9', '16:9'], ['4:3', '4:3'], ['3:2', '3:2'], ['1:1', '1:1'], ['9:16', '9:16'], ['2:3', '2:3']], 'aspectR', '16:9')}</div>`); break;
        case 'watermark':
          show(`<p class="slabel">Watermark Settings</p>
          <input type="text" id="wmTxt" class="inp mb-3" value="© Thefreeaitools" placeholder="Watermark text">
          <div class="grid grid-cols-3 gap-3 mb-3">
            <div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">Font Size</label><input type="number" id="wmSz" class="inp" value="40" min="8"></div>
            <div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">Color</label><input type="color" id="wmCol" value="#ffffff" style="width:100%"></div>
            <div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">Opacity %</label><input type="number" id="wmOp" class="inp" value="55" min="0" max="100"></div>
          </div>
          <p class="slabel">Position</p>
          <div class="flex flex-wrap gap-2">${sizeChips([['tl', 'Top-L'], ['tr', 'Top-R'], ['c', 'Center'], ['bl', 'Bot-L'], ['br', 'Bot-R'], ['tile', 'Tile']], 'wmPos', 'br')}</div>`); break;
        case 'text-overlay':
          show(`<p class="slabel">Text Settings</p>
          <input type="text" id="txtOvr" class="inp mb-3" value="Your Text Here" placeholder="Text to overlay">
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">Font Size</label><input type="number" id="txtSz" class="inp" value="48" min="8"></div>
            <div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">Color</label><input type="color" id="txtCol" value="#ffffff" style="width:100%"></div>
          </div>
          <p class="slabel">Position</p>
          <div class="flex flex-wrap gap-2">${sizeChips([['tl', 'Top-L'], ['tc', 'Top-C'], ['tr', 'Top-R'], ['c', 'Center'], ['bl', 'Bot-L'], ['bc', 'Bot-C'], ['br', 'Bot-R']], 'txtPos', 'c')}</div>`); break;
        case 'border':
          show(`<p class="slabel">Border Settings</p><div class="grid grid-cols-2 gap-3"><div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">Thickness (px)</label><input type="number" id="brdW" class="inp" value="20" min="1"></div><div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">Color</label><input type="color" id="brdCol" value="#ffffff" style="width:100%"></div></div>`); break;
        case 'padding':
          show(`<p class="slabel">Padding Settings</p><div class="grid grid-cols-2 gap-3 mb-3"><div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">Padding (px)</label><input type="number" id="padW" class="inp" value="40" min="0"></div><div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">Background</label><input type="color" id="padCol" value="#ffffff" style="width:100%"></div></div>`); break;
        case 'brightness':
          show(`<div class="space-y-4">
            <div class="flex justify-between mb-1"><p class="slabel mb-0">Brightness</p><span id="briV" class="text-sm font-bold" style="color:var(--accent)">0</span></div><input type="range" id="briS" min="-100" max="100" value="0">
            <div class="flex justify-between mb-1"><p class="slabel mb-0">Contrast</p><span id="conV" class="text-sm font-bold" style="color:var(--accent)">0</span></div><input type="range" id="conS" min="-100" max="100" value="0">
            <div class="flex justify-between mb-1"><p class="slabel mb-0">Exposure</p><span id="expV" class="text-sm font-bold" style="color:var(--accent)">0</span></div><input type="range" id="expS" min="-100" max="100" value="0">
          </div>`); break;
        case 'hue-saturation':
          show(`<div class="space-y-4">
            <div class="flex justify-between mb-1"><p class="slabel mb-0">Hue Shift</p><span id="hueV" class="text-sm font-bold" style="color:var(--accent)">0°</span></div><input type="range" id="hueS" min="-180" max="180" value="0">
            <div class="flex justify-between mb-1"><p class="slabel mb-0">Saturation</p><span id="satV" class="text-sm font-bold" style="color:var(--accent)">0</span></div><input type="range" id="satS" min="-100" max="100" value="0">
          </div>`); break;
        case 'blur':
          show(`<div class="flex justify-between mb-2"><p class="slabel mb-0">Blur Radius</p><span id="blrV" class="font-bold text-xl" style="color:var(--accent)">5</span></div><input type="range" id="blrS" min="1" max="40" value="5">`); break;
        case 'opacity':
          show(`<div class="flex justify-between mb-2"><p class="slabel mb-0">Opacity</p><span id="opV" class="font-bold text-xl" style="color:var(--accent)">80%</span></div><input type="range" id="opS" min="0" max="100" value="80">`); break;
        case 'round-corners':
          show(`<div class="flex justify-between mb-2"><p class="slabel mb-0">Corner Radius</p><span id="rcV" class="font-bold text-xl" style="color:var(--accent)">20px</span></div><input type="range" id="rcS" min="0" max="200" value="20">`); break;
        case 'shadow':
          show(`<div class="grid grid-cols-2 gap-3 mb-3"><div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">Blur (px)</label><input type="number" id="shB" class="inp" value="20" min="0"></div><div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">Spread (px)</label><input type="number" id="shS" class="inp" value="10" min="0"></div><div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">Offset X</label><input type="number" id="shX" class="inp" value="5"></div><div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">Offset Y</label><input type="number" id="shY" class="inp" value="5"></div></div><div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">Shadow Color</label><input type="color" id="shCol" value="#000000" style="width:80px"></div>`); break;
        case 'pixelate':
          show(`<div class="flex justify-between mb-2"><p class="slabel mb-0">Block Size</p><span id="pxV" class="font-bold text-xl" style="color:var(--accent)">10px</span></div><input type="range" id="pxS" min="2" max="80" value="10">`); break;
        case 'halftone':
          show(`<div class="flex justify-between mb-2"><p class="slabel mb-0">Dot Size</p><span id="htV" class="font-bold text-xl" style="color:var(--accent)">6px</span></div><input type="range" id="htS" min="2" max="30" value="6">`); break;
        case 'posterize':
          show(`<div class="flex justify-between mb-2"><p class="slabel mb-0">Color Levels</p><span id="postV" class="font-bold text-xl" style="color:var(--accent)">4</span></div><input type="range" id="postS" min="2" max="16" value="4">`); break;
        case 'glitch':
          show(`<div class="flex justify-between mb-2"><p class="slabel mb-0">Glitch Intensity</p><span id="glitchV" class="font-bold text-xl" style="color:var(--accent)">10</span></div><input type="range" id="glitchS" min="1" max="40" value="10">`); break;
        case 'duotone':
          show(`<p class="slabel">Duotone Colors</p><div class="grid grid-cols-2 gap-3"><div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">Shadow Color</label><input type="color" id="dt1" value="#1a237e" style="width:100%"></div><div><label class="text-xs font-semibold mb-1 block" style="color:var(--muted)">Highlight Color</label><input type="color" id="dt2" value="#e91e63" style="width:100%"></div></div>`); break;
        case 'vignette':
          show(`<div class="flex justify-between mb-2"><p class="slabel mb-0">Vignette Strength</p><span id="vigV" class="font-bold text-xl" style="color:var(--accent)">50%</span></div><input type="range" id="vigS" min="10" max="100" value="50">`); break;
        case 'levels':
          show(`<div class="space-y-4">
            <div class="flex justify-between mb-1"><p class="slabel mb-0">Black Point</p><span id="bpV" class="text-sm font-bold" style="color:var(--accent)">0</span></div><input type="range" id="bpS" min="0" max="128" value="0">
            <div class="flex justify-between mb-1"><p class="slabel mb-0">White Point</p><span id="wpV" class="text-sm font-bold" style="color:var(--accent)">255</span></div><input type="range" id="wpS" min="128" max="255" value="255">
            <div class="flex justify-between mb-1"><p class="slabel mb-0">Gamma (Midtones)</p><span id="gamV" class="text-sm font-bold" style="color:var(--accent)">1.0</span></div><input type="range" id="gamS" min="1" max="30" value="10">
          </div>`); break;
      }
    };

    // ── Sync range display + chip selection ──
    const optPanel = $('optPanel');
    if (optPanel) optPanel.addEventListener('input', (e: Event) => {
      const t = e.target as HTMLInputElement;
      const sync = (id: string, fmt: string) => { const el = document.getElementById(id); if (el) el.textContent = fmt; };
      if (t.id === 'qSlider') sync('qVal', t.value + '%');
      if (t.id === 'rPct') { sync('rPctVal', t.value + '%'); if (state.origMeta) { const s = +t.value / 100; const rW = $('rW') as HTMLInputElement, rH = $('rH') as HTMLInputElement; if (rW) rW.value = String(Math.round(state.origMeta.w * s)); if (rH) rH.value = String(Math.round(state.origMeta.h * s)); } }
      if (t.id === 'blrS') sync('blrV', t.value);
      if (t.id === 'opS') sync('opV', t.value + '%');
      if (t.id === 'rcS') sync('rcV', t.value + 'px');
      if (t.id === 'pxS') sync('pxV', t.value + 'px');
      if (t.id === 'htS') sync('htV', t.value + 'px');
      if (t.id === 'postS') sync('postV', t.value);
      if (t.id === 'glitchS') sync('glitchV', t.value);
      if (t.id === 'vigS') sync('vigV', t.value + '%');
      if (t.id === 'briS') sync('briV', t.value);
      if (t.id === 'conS') sync('conV', t.value);
      if (t.id === 'expS') sync('expV', t.value);
      if (t.id === 'hueS') sync('hueV', t.value + '°');
      if (t.id === 'satS') sync('satV', t.value);
      if (t.id === 'bpS') sync('bpV', t.value);
      if (t.id === 'wpS') sync('wpV', t.value);
      if (t.id === 'gamS') sync('gamV', (+t.value / 10).toFixed(1));
      if ((t.id === 'rW' || t.id === 'rH') && (document.getElementById('rAsp') as HTMLInputElement)?.checked && state.origMeta) {
        if (t.id === 'rW' && t.value) { const h = document.getElementById('rH') as HTMLInputElement; if (h) h.value = String(Math.round(+t.value * state.origMeta.h / state.origMeta.w)); }
        if (t.id === 'rH' && t.value) { const w = document.getElementById('rW') as HTMLInputElement; if (w) w.value = String(Math.round(+t.value * state.origMeta.w / state.origMeta.h)); }
      }
      if (t.type === 'radio') {
        const chips = [...document.querySelectorAll(`[name="${t.name}"]`)].map(r => r.closest('.chip')).filter(Boolean);
        chips.forEach(c => c?.classList.remove('sel'));
        const cur = t.closest('.chip'); if (cur) cur.classList.add('sel');
      }
      if (t.classList && t.classList.contains('ico-sz')) {
        const c = t.closest('.chip'); if (c) c.classList.toggle('sel', t.checked);
      }
    });

    if (optPanel) optPanel.addEventListener('click', (e: Event) => {
      const chip = (e.target as Element).closest && (e.target as Element).closest('.chip');
      if (!chip) return;
      const radio = chip.querySelector('input[type=radio]') as HTMLInputElement;
      if (radio && !radio.checked) {
        radio.checked = true;
        radio.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    // ── Handle File ──
    const handleFile = (f: File) => {
      if (!f || !f.type || !f.type.startsWith('image/')) return toast('Please select a valid image file', 'e');
      if (f.size > 52428800) return toast('File too large. Max 50MB.', 'e');
      state.file = f; state.blob = null;
      const fileBar = $('fileBar'); if (fileBar) { fileBar.classList.remove('hidden'); fileBar.classList.add('flex'); }
      const upZone = $('upZone'); if (upZone) upZone.classList.add('hidden');
      const fName = $('fName'); if (fName) fName.textContent = f.name;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        const img = new Image();
        img.onload = () => {
          state.origMeta = { src, size: f.size, w: img.width, h: img.height };
          const fDetails = $('fDetails');
          if (fDetails) fDetails.textContent = `${fmtSize(f.size)} · ${img.width}×${img.height} px · ${f.type}`;
          const origPrev = $('origPrev') as HTMLImageElement; if (origPrev) origPrev.src = src;
          const origBadge = $('origBadge'); if (origBadge) origBadge.textContent = fmtSize(f.size);
          const origDims = $('origDims'); if (origDims) origDims.textContent = `${img.width}×${img.height} px`;
          const actRow = $('actRow'); if (actRow) { actRow.classList.remove('hidden'); actRow.classList.add('flex'); }
          const rW = $('rW') as HTMLInputElement; if (rW) rW.value = String(img.width);
          const rH = $('rH') as HTMLInputElement; if (rH) rH.value = String(img.height);
        };
        img.src = src;
      };
      reader.readAsDataURL(f);
    };

    const upZone = $('upZone');
    if (upZone) {
      upZone.addEventListener('click', () => { const fi = $('fileInp') as HTMLInputElement; if (fi) fi.click(); });
      upZone.addEventListener('keydown', (e: Event) => { const ke = e as KeyboardEvent; if (ke.key === 'Enter' || ke.key === ' ') { const fi = $('fileInp') as HTMLInputElement; if (fi) fi.click(); } });
      upZone.addEventListener('dragover', (e: Event) => { e.preventDefault(); upZone.classList.add('drag'); });
      upZone.addEventListener('dragleave', () => upZone.classList.remove('drag'));
      upZone.addEventListener('drop', (e: Event) => {
        e.preventDefault(); upZone.classList.remove('drag');
        const de = e as DragEvent;
        if (de.dataTransfer?.files[0]) handleFile(de.dataTransfer.files[0]);
      });
    }
    const fileInpEl = $('fileInp') as HTMLInputElement;
    if (fileInpEl) fileInpEl.onchange = (e: Event) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) handleFile(f); };
    document.addEventListener('paste', (e: ClipboardEvent) => {
      if (!state.tool || !e.clipboardData) return;
      const item = [...e.clipboardData.items].find(i => i.type && i.type.startsWith('image/'));
      if (item) { const f = item.getAsFile(); if (f) handleFile(f); }
    });
    const changeBtn = $('changeBtn');
    if (changeBtn) changeBtn.onclick = () => { const fi = $('fileInp') as HTMLInputElement; if (fi) fi.click(); };

    // ── Run / Reset ──
    const runBtn = $('runBtn') as HTMLButtonElement;
    if (runBtn) runBtn.onclick = processImage;
    const rstBtn = $('rstBtn');
    if (rstBtn) rstBtn.onclick = () => resetPanel(false);
    const dlBtn = $('dlBtn');
    if (dlBtn) dlBtn.onclick = downloadResult;
    const cpBtn = $('cpBtn');
    if (cpBtn) cpBtn.onclick = copyResult;
    const anotherBtn = $('anotherBtn');
    if (anotherBtn) anotherBtn.onclick = () => { resetPanel(false); const fi = $('fileInp') as HTMLInputElement; if (fi) fi.click(); };

    function resetPanel(keepOpts: boolean) {
      state.file = null; state.blob = null; state.origMeta = null;
      const fi = $('fileInp') as HTMLInputElement; if (fi) fi.value = '';
      const fileBar = $('fileBar'); if (fileBar) { fileBar.classList.add('hidden'); fileBar.classList.remove('flex'); }
      const upZoneEl = $('upZone'); if (upZoneEl) upZoneEl.classList.remove('hidden');
      const actRow = $('actRow'); if (actRow) { actRow.classList.add('hidden'); actRow.classList.remove('flex'); }
      const resultSec = $('resultSec'); if (resultSec) resultSec.classList.add('hidden');
      const saveBadge = $('saveBadge'); if (saveBadge) saveBadge.classList.add('hidden');
      const panelProgress = $('panelProgress'); if (panelProgress) panelProgress.classList.add('hidden');
      const convPrev = $('convPrev') as HTMLImageElement; if (convPrev) convPrev.removeAttribute('src');
      const origPrev = $('origPrev') as HTMLImageElement; if (origPrev) origPrev.removeAttribute('src');
      if (!keepOpts && state.tool) renderOptions();
    }

    // ═══════════════════════════════════════════════════════════════
    //  IMAGE PROCESSING
    // ═══════════════════════════════════════════════════════════════
    async function processImage() {
      if (!state.file || !state.tool) return;
      if (runBtn) runBtn.disabled = true;
      const runBtnTxt = $('runBtnTxt');
      const origText = runBtnTxt?.textContent || '';
      if (runBtnTxt) runBtnTxt.textContent = 'Processing…';
      const panelProgress = $('panelProgress'); if (panelProgress) panelProgress.classList.remove('hidden');
      try { await runConversion(); }
      catch (e: any) { console.error(e); toast('Processing failed: ' + (e && e.message ? e.message : 'unknown error'), 'e', 4500); }
      if (runBtn) runBtn.disabled = false;
      if (runBtnTxt) runBtnTxt.textContent = state.tool ? state.tool.act : origText;
      if (panelProgress) panelProgress.classList.add('hidden');
    }

    const gv = (id: string) => { const el = document.getElementById(id) as HTMLInputElement; return el ? el.value : null; };
    const gvn = (id: string) => { const v = gv(id); return v !== null && v !== '' ? +v : null; };
    const gr = (name: string) => { const el = document.querySelector(`[name="${name}"]:checked`) as HTMLInputElement; return el ? el.value : null; };

    const roundedRectPath = (x: number, y: number, w: number, h: number, r: number) => {
      const rr = Math.max(0, Math.min(r, Math.min(w, h) / 2));
      const p = new Path2D();
      p.moveTo(x + rr, y);
      p.lineTo(x + w - rr, y);
      p.quadraticCurveTo(x + w, y, x + w, y + rr);
      p.lineTo(x + w, y + h - rr);
      p.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
      p.lineTo(x + rr, y + h);
      p.quadraticCurveTo(x, y + h, x, y + h - rr);
      p.lineTo(x, y + rr);
      p.quadraticCurveTo(x, y, x + rr, y);
      p.closePath();
      return p;
    };

    async function runConversion() {
      const loadImg = (src: string): Promise<HTMLImageElement> => new Promise((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = () => rej(new Error('Could not decode the source image'));
        i.src = src;
      });
      const toBlob = (mime: string, q?: number): Promise<Blob> => new Promise((res, rej) => {
        try {
          cvs.toBlob(b => {
            if (b) res(b);
            else rej(new Error('Your browser refused to encode this format (' + mime + '). Try PNG instead.'));
          }, mime, q);
        } catch (err) { rej(err); }
      });
      const draw = (img: HTMLImageElement, w: number, h: number, fill: boolean, bg?: string) => {
        cvs.width = w; cvs.height = h;
        ctx.clearRect(0, 0, w, h);
        if (fill) { ctx.fillStyle = bg || '#fff'; ctx.fillRect(0, 0, w, h); }
        ctx.drawImage(img, 0, 0, w, h);
      };
      const img = await loadImg(state.origMeta.src);
      const id = state.tool.id;

      // ── CONVERT ──
      if (['jpg-to-png', 'webp-to-png', 'bmp-to-png', 'gif-to-png', 'tiff-to-png', 'avif-to-png', 'any-to-png'].includes(id)) {
        draw(img, img.width, img.height, false); state.blob = await toBlob('image/png');
      } else if (['png-to-jpg', 'webp-to-jpg', 'bmp-to-jpg', 'gif-to-jpg', 'tiff-to-jpg', 'avif-to-jpg', 'svg-to-jpg', 'jpg-to-bmp', 'png-to-bmp', 'any-to-jpg'].includes(id)) {
        draw(img, img.width, img.height, true, gv('bgCol') || '#ffffff');
        const targetMime = id.includes('bmp') ? 'image/bmp' : 'image/jpeg';
        try { state.blob = await toBlob(targetMime, 0.92); }
        catch (e) {
          if (targetMime === 'image/bmp') {
            toast('Your browser does not support BMP encoding — saving as PNG instead.', 'i', 3500);
            state.blob = await toBlob('image/png');
            state.tool = { ...state.tool, ext: 'png' };
          } else { throw e; }
        }
      } else if (['jpg-to-webp', 'png-to-webp', 'gif-to-webp', 'svg-to-webp', 'any-to-webp'].includes(id)) {
        draw(img, img.width, img.height, false);
        try { state.blob = await toBlob('image/webp', 0.92); }
        catch (e) {
          toast('Your browser does not support WebP encoding — saving as PNG instead.', 'i', 3500);
          state.blob = await toBlob('image/png');
          state.tool = { ...state.tool, ext: 'png' };
        }
      } else if (id === 'svg-to-png') {
        const sz = gvn('svgSz') || +(gr('svgSz') || '512') || 512;
        draw(img, sz, sz, false); state.blob = await toBlob('image/png');
      } else if (id === 'png-to-svg' || id === 'jpg-to-svg') {
        draw(img, img.width, img.height, false);
        const dataUrl = cvs.toDataURL('image/png');
        const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${img.width}" height="${img.height}" viewBox="0 0 ${img.width} ${img.height}">\n  <image href="${dataUrl}" width="${img.width}" height="${img.height}"/>\n</svg>`;
        state.blob = new Blob([svg], { type: 'image/svg+xml' });
      } else if (id === 'png-to-ico') {
        const sizes = [...document.querySelectorAll('.ico-sz:checked')].map(c => +(c as HTMLInputElement).value);
        if (!sizes.length) { toast('Select at least one size', 'e'); return; }
        const sz = Math.max(...sizes);
        draw(img, sz, sz, false);
        const pngBlob = await toBlob('image/png');
        state.blob = new Blob([pngBlob], { type: 'image/x-icon' });
      } else if (id === 'img-to-pdf') {
        const w = window as any;
        if (!w.jspdf || !w.jspdf.jsPDF) throw new Error('PDF library failed to load. Check your network and try again.');
        const { jsPDF } = w.jspdf;
        draw(img, img.width, img.height, false);
        const pngDataUrl = cvs.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: img.width > img.height ? 'l' : 'p', unit: 'px', format: [img.width, img.height] });
        pdf.addImage(pngDataUrl, 'PNG', 0, 0, img.width, img.height);
        state.blob = pdf.output('blob');
      } else if (id === 'img-to-base64' || id === 'img-to-dataurl') {
        draw(img, img.width, img.height, false);
        const dataUrl = cvs.toDataURL('image/png');
        const content = id === 'img-to-base64' ? dataUrl.split(',')[1] : dataUrl;
        state.blob = new Blob([content], { type: 'text/plain' });
      }
      // ── EDIT ──
      else if (id === 'resize') {
        const nw = gvn('rW') || img.width, nh = gvn('rH') || img.height;
        if (nw < 1 || nh < 1) throw new Error('Width and height must be at least 1px');
        draw(img, nw, nh, false);
        const mime = (state.file!.type && state.file!.type !== 'image/svg+xml') ? state.file!.type : 'image/png';
        try { state.blob = await toBlob(mime, 0.92); }
        catch { state.blob = await toBlob('image/png'); }
      } else if (id === 'compress') {
        draw(img, img.width, img.height, true, '#ffffff');
        const q = gvn('qSlider'); state.blob = await toBlob('image/jpeg', (q == null ? 80 : q) / 100);
      } else if (id === 'rotate') {
        const ang = (gvn('custAng') || 0) || +(gr('rotA') || '90');
        const r = ang * Math.PI / 180, s = Math.abs(Math.sin(r)), c2 = Math.abs(Math.cos(r));
        const nw = Math.round(img.width * c2 + img.height * s), nh = Math.round(img.width * s + img.height * c2);
        cvs.width = nw; cvs.height = nh;
        ctx.clearRect(0, 0, nw, nh);
        ctx.save(); ctx.translate(nw / 2, nh / 2); ctx.rotate(r);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
        state.blob = await toBlob('image/png');
      } else if (id === 'flip') {
        const d = gr('flipD') || 'h';
        cvs.width = img.width; cvs.height = img.height; ctx.clearRect(0, 0, img.width, img.height);
        ctx.save();
        if (d === 'h' || d === 'b') { ctx.translate(img.width, 0); ctx.scale(-1, 1); }
        if (d === 'v' || d === 'b') { ctx.translate(0, img.height); ctx.scale(1, -1); }
        if (d === 'b') {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.translate(img.width, img.height); ctx.scale(-1, -1);
        }
        ctx.drawImage(img, 0, 0);
        ctx.restore();
        state.blob = await toBlob('image/png');
      } else if (id === 'crop') {
        const x = gvn('cX') || 0, y = gvn('cY') || 0;
        let cw = gvn('cW') || img.width, ch = gvn('cH') || img.height;
        cw = Math.min(cw, img.width - x); ch = Math.min(ch, img.height - y);
        if (cw < 1 || ch < 1) throw new Error('Crop region is outside the image');
        cvs.width = cw; cvs.height = ch; ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, x, y, cw, ch, 0, 0, cw, ch);
        state.blob = await toBlob('image/png');
      } else if (id === 'square-crop') {
        const sz = Math.min(img.width, img.height);
        const ox = (img.width - sz) / 2, oy = (img.height - sz) / 2;
        cvs.width = sz; cvs.height = sz; ctx.clearRect(0, 0, sz, sz);
        ctx.drawImage(img, ox, oy, sz, sz, 0, 0, sz, sz);
        state.blob = await toBlob('image/png');
      } else if (id === 'aspect-crop') {
        const ratioStr = gr('aspectR') || '16:9';
        const [rW, rH] = ratioStr.split(':').map(Number);
        const targetAspect = rW / rH; const imgAspect = img.width / img.height;
        let sw: number, sh: number, sx = 0, sy = 0;
        if (imgAspect > targetAspect) { sh = img.height; sw = Math.round(sh * targetAspect); sx = (img.width - sw) / 2; }
        else { sw = img.width; sh = Math.round(sw / targetAspect); sy = (img.height - sh) / 2; }
        cvs.width = sw; cvs.height = sh; ctx.clearRect(0, 0, sw, sh);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh); state.blob = await toBlob('image/png');
      } else if (id === 'watermark') {
        draw(img, img.width, img.height, false);
        const t = gv('wmTxt') || '© Watermark', sz = gvn('wmSz') || 40, col = gv('wmCol') || '#ffffff';
        const opPct = gvn('wmOp'); const op = (opPct == null ? 55 : opPct) / 100;
        const pos = gr('wmPos') || 'br';
        ctx.save(); ctx.globalAlpha = op; ctx.fillStyle = col!;
        ctx.font = `bold ${sz}px Syne, Instrument Sans, system-ui, sans-serif`;
        ctx.textBaseline = 'top';
        const mw = ctx.measureText(t!).width, pad = sz;
        const positions: Record<string, [number, number]> = { tl: [pad, pad], tr: [img.width - mw - pad, pad], c: [(img.width - mw) / 2, (img.height - sz) / 2], bl: [pad, img.height - sz - pad], br: [img.width - mw - pad, img.height - sz - pad] };
        if (pos === 'tile') { for (let y = 0; y < img.height + sz; y += sz * 2.5) for (let x = -mw / 2; x < img.width + mw; x += mw * 1.5) ctx.fillText(t!, x, y); }
        else { const p = positions[pos] || positions.br; ctx.fillText(t!, p[0], p[1]); }
        ctx.restore(); state.blob = await toBlob('image/png');
      } else if (id === 'text-overlay') {
        draw(img, img.width, img.height, false);
        const t = gv('txtOvr') || 'Text', sz = gvn('txtSz') || 48, col = gv('txtCol') || '#ffffff', pos = gr('txtPos') || 'c';
        ctx.font = `bold ${sz}px Syne, Instrument Sans, system-ui, sans-serif`;
        ctx.fillStyle = col!; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
        const px: Record<string, number> = { tl: img.width * .1, tc: img.width / 2, tr: img.width * .9, c: img.width / 2, bl: img.width * .1, bc: img.width / 2, br: img.width * .9 };
        const py: Record<string, number> = { tl: sz, tc: sz, tr: sz, c: img.height / 2, bl: img.height - sz, bc: img.height - sz, br: img.height - sz };
        ctx.fillText(t!, px[pos!] || img.width / 2, py[pos!] || img.height / 2); state.blob = await toBlob('image/png');
      } else if (id === 'border') {
        const bw = gvn('brdW') || 20, bc = gv('brdCol') || '#ffffff';
        const nw = img.width + bw * 2, nh = img.height + bw * 2;
        cvs.width = nw; cvs.height = nh; ctx.clearRect(0, 0, nw, nh);
        ctx.fillStyle = bc!; ctx.fillRect(0, 0, nw, nh); ctx.drawImage(img, bw, bw);
        state.blob = await toBlob('image/png');
      } else if (id === 'padding') {
        const pw = gvn('padW') || 40, pc = gv('padCol') || '#ffffff';
        const nw = img.width + pw * 2, nh = img.height + pw * 2;
        cvs.width = nw; cvs.height = nh; ctx.clearRect(0, 0, nw, nh);
        ctx.fillStyle = pc!; ctx.fillRect(0, 0, nw, nh); ctx.drawImage(img, pw, pw);
        state.blob = await toBlob('image/png');
      } else if (id === 'round-corners') {
        const r = gvn('rcS') || 20;
        cvs.width = img.width; cvs.height = img.height; ctx.clearRect(0, 0, img.width, img.height);
        const path = roundedRectPath(0, 0, img.width, img.height, r);
        ctx.save(); ctx.clip(path); ctx.drawImage(img, 0, 0); ctx.restore();
        state.blob = await toBlob('image/png');
      } else if (id === 'shadow') {
        const sb = gvn('shB') || 20, ss = gvn('shS') || 10, sx = gvn('shX') || 5, sy = gvn('shY') || 5, sc = gv('shCol') || '#000000';
        const pad = sb + ss + Math.max(Math.abs(sx), Math.abs(sy));
        cvs.width = img.width + pad * 2; cvs.height = img.height + pad * 2;
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.shadowColor = sc!; ctx.shadowBlur = sb; ctx.shadowOffsetX = sx; ctx.shadowOffsetY = sy;
        ctx.drawImage(img, pad, pad);
        ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
        state.blob = await toBlob('image/png');
      }
      // ── ADJUST ──
      else if (id === 'brightness') {
        draw(img, img.width, img.height, false);
        const imgD = ctx.getImageData(0, 0, img.width, img.height); const d = imgD.data;
        const br = gvn('briS') || 0, con = gvn('conS') || 0, exp = gvn('expS') || 0;
        const factor = (259 * (con + 255)) / (255 * (259 - con));
        for (let i = 0; i < d.length; i += 4) {
          let r = d[i], g = d[i + 1], b2 = d[i + 2];
          r = r + br + (exp * 2); g = g + br + (exp * 2); b2 = b2 + br + (exp * 2);
          r = factor * (r - 128) + 128; g = factor * (g - 128) + 128; b2 = factor * (b2 - 128) + 128;
          d[i] = Math.max(0, Math.min(255, r)); d[i + 1] = Math.max(0, Math.min(255, g)); d[i + 2] = Math.max(0, Math.min(255, b2));
        }
        ctx.putImageData(imgD, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'hue-saturation') {
        draw(img, img.width, img.height, false);
        const imgD = ctx.getImageData(0, 0, img.width, img.height); const d = imgD.data;
        const hueShift = gvn('hueS') || 0, satAdj = gvn('satS') || 0;
        const rgb2hsl = (r: number, g: number, b: number) => { r /= 255; g /= 255; b /= 255; const M = Math.max(r, g, b), m = Math.min(r, g, b), dl = M - m; let h = 0, s = 0, l = (M + m) / 2; if (dl > 0) { s = l > .5 ? dl / (2 - M - m) : dl / (M + m); if (M === r) h = ((g - b) / dl + (g < b ? 6 : 0)) / 6; else if (M === g) h = ((b - r) / dl + 2) / 6; else h = ((r - g) / dl + 4) / 6; } return [h * 360, s, l]; };
        const hsl2rgb = (h: number, s: number, l: number) => { const hue2rgb = (p: number, q: number, t: number) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; }; if (s === 0) return [l * 255, l * 255, l * 255]; const q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q; return [hue2rgb(p, q, h / 360 + 1 / 3) * 255, hue2rgb(p, q, h / 360) * 255, hue2rgb(p, q, h / 360 - 1 / 3) * 255]; };
        for (let i = 0; i < d.length; i += 4) { let [h, s, l] = rgb2hsl(d[i], d[i + 1], d[i + 2]); h = (h + hueShift + 360) % 360; s = Math.max(0, Math.min(1, s + satAdj / 100)); const [r, g, b2] = hsl2rgb(h, s, l); d[i] = r; d[i + 1] = g; d[i + 2] = b2; }
        ctx.putImageData(imgD, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'levels') {
        draw(img, img.width, img.height, false);
        const imgD = ctx.getImageData(0, 0, img.width, img.height); const d = imgD.data;
        const bp = gvn('bpS') || 0, wp = gvn('wpS') || 255, gamma = (gvn('gamS') || 10) / 10;
        const range = Math.max(1, wp - bp);
        for (let i = 0; i < d.length; i += 4) {
          for (let c = 0; c < 3; c++) {
            let v = d[i + c];
            v = Math.max(0, Math.min(255, (v - bp) / range * 255));
            v = Math.pow(v / 255, 1 / gamma) * 255;
            d[i + c] = Math.max(0, Math.min(255, v));
          }
        }
        ctx.putImageData(imgD, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'opacity') {
        cvs.width = img.width; cvs.height = img.height; ctx.clearRect(0, 0, img.width, img.height);
        const op = gvn('opS'); ctx.globalAlpha = (op == null ? 80 : op) / 100;
        ctx.drawImage(img, 0, 0); ctx.globalAlpha = 1;
        state.blob = await toBlob('image/png');
      } else if (id === 'blur') {
        const r = gvn('blrS') || 5;
        const offCvs = document.createElement('canvas'); offCvs.width = img.width; offCvs.height = img.height;
        const offCtx = offCvs.getContext('2d')!;
        offCtx.filter = `blur(${r}px)`; offCtx.drawImage(img, 0, 0); offCtx.filter = 'none';
        cvs.width = img.width; cvs.height = img.height; ctx.clearRect(0, 0, img.width, img.height);
        ctx.drawImage(offCvs, 0, 0);
        state.blob = await toBlob('image/png');
      } else if (id === 'sharpen') {
        draw(img, img.width, img.height, false);
        const imgD = ctx.getImageData(0, 0, img.width, img.height); const d = imgD.data;
        const W = imgD.width, H = imgD.height; const kernel = [-1, -1, -1, -1, 9, -1, -1, -1, -1];
        const out = new Uint8ClampedArray(d);
        for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
          for (let c = 0; c < 3; c++) {
            let v = 0;
            for (let ky = -1; ky <= 1; ky++) for (let kx = -1; kx <= 1; kx++)
              v += d[((y + ky) * W + (x + kx)) * 4 + c] * kernel[(ky + 1) * 3 + (kx + 1)];
            out[(y * W + x) * 4 + c] = Math.max(0, Math.min(255, v));
          }
          out[(y * W + x) * 4 + 3] = 255;
        }
        ctx.putImageData(new ImageData(out, W, H), 0, 0); state.blob = await toBlob('image/png');
      }
      // ── FILTERS ──
      else if (id === 'grayscale') {
        draw(img, img.width, img.height, false);
        const imgD = ctx.getImageData(0, 0, img.width, img.height); const d = imgD.data;
        for (let i = 0; i < d.length; i += 4) { const g = d[i] * .299 + d[i + 1] * .587 + d[i + 2] * .114; d[i] = d[i + 1] = d[i + 2] = g; }
        ctx.putImageData(imgD, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'sepia') {
        draw(img, img.width, img.height, false);
        const imgD = ctx.getImageData(0, 0, img.width, img.height); const d = imgD.data;
        for (let i = 0; i < d.length; i += 4) { const r = d[i], g = d[i + 1], b2 = d[i + 2]; d[i] = Math.min(255, r * .393 + g * .769 + b2 * .189); d[i + 1] = Math.min(255, r * .349 + g * .686 + b2 * .168); d[i + 2] = Math.min(255, r * .272 + g * .534 + b2 * .131); }
        ctx.putImageData(imgD, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'invert') {
        draw(img, img.width, img.height, false);
        const imgD = ctx.getImageData(0, 0, img.width, img.height); const d = imgD.data;
        for (let i = 0; i < d.length; i += 4) { d[i] = 255 - d[i]; d[i + 1] = 255 - d[i + 1]; d[i + 2] = 255 - d[i + 2]; }
        ctx.putImageData(imgD, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'vintage') {
        draw(img, img.width, img.height, false);
        const imgD = ctx.getImageData(0, 0, img.width, img.height); const d = imgD.data;
        for (let i = 0; i < d.length; i += 4) { const r = d[i], g = d[i + 1], b2 = d[i + 2]; d[i] = Math.min(255, r * .9 + 50); d[i + 1] = Math.min(255, g * .85 + 30); d[i + 2] = Math.min(255, b2 * .7 + 20); }
        const cx = img.width / 2, cy = img.height / 2, maxD = Math.sqrt(cx * cx + cy * cy);
        for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) {
          const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / maxD;
          const vig = 1 - dist * .6;
          const idx = (y * img.width + x) * 4;
          d[idx] = d[idx] * vig; d[idx + 1] = d[idx + 1] * vig; d[idx + 2] = d[idx + 2] * vig;
        }
        ctx.putImageData(imgD, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'vignette') {
        draw(img, img.width, img.height, false);
        const str = (gvn('vigS') || 50) / 100;
        const imgD = ctx.getImageData(0, 0, img.width, img.height); const d = imgD.data;
        const cx = img.width / 2, cy = img.height / 2, maxD = Math.sqrt(cx * cx + cy * cy);
        for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) {
          const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / maxD;
          const vig = Math.max(0, 1 - dist * str);
          const idx = (y * img.width + x) * 4;
          d[idx] = d[idx] * vig; d[idx + 1] = d[idx + 1] * vig; d[idx + 2] = d[idx + 2] * vig;
        }
        ctx.putImageData(imgD, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'pixelate') {
        const bs = gvn('pxS') || 10;
        draw(img, img.width, img.height, false);
        const imgD = ctx.getImageData(0, 0, img.width, img.height); const d = imgD.data;
        for (let y = 0; y < img.height; y += bs) for (let x = 0; x < img.width; x += bs) {
          const bw = Math.min(bs, img.width - x), bh = Math.min(bs, img.height - y);
          const idx = (y * img.width + x) * 4;
          ctx.fillStyle = `rgb(${d[idx]},${d[idx + 1]},${d[idx + 2]})`;
          ctx.fillRect(x, y, bw, bh);
        }
        state.blob = await toBlob('image/png');
      } else if (id === 'posterize') {
        draw(img, img.width, img.height, false);
        const levels = gvn('postS') || 4;
        const imgD = ctx.getImageData(0, 0, img.width, img.height); const d = imgD.data;
        const step = Math.max(1, levels - 1);
        for (let i = 0; i < d.length; i += 4) {
          d[i] = Math.round(d[i] / 255 * step) / step * 255;
          d[i + 1] = Math.round(d[i + 1] / 255 * step) / step * 255;
          d[i + 2] = Math.round(d[i + 2] / 255 * step) / step * 255;
        }
        ctx.putImageData(imgD, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'emboss') {
        draw(img, img.width, img.height, false);
        const imgD = ctx.getImageData(0, 0, img.width, img.height); const d = imgD.data;
        const W = imgD.width, H = imgD.height; const kernel = [-2, -1, 0, -1, 1, 1, 0, 1, 2];
        const out = new Uint8ClampedArray(d);
        for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
          for (let c = 0; c < 3; c++) {
            let v = 0;
            for (let ky = -1; ky <= 1; ky++) for (let kx = -1; kx <= 1; kx++)
              v += d[((y + ky) * W + (x + kx)) * 4 + c] * kernel[(ky + 1) * 3 + (kx + 1)];
            out[(y * W + x) * 4 + c] = Math.max(0, Math.min(255, v + 128));
          }
          out[(y * W + x) * 4 + 3] = 255;
        }
        ctx.putImageData(new ImageData(out, W, H), 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'edge-detect') {
        draw(img, img.width, img.height, false);
        const imgD = ctx.getImageData(0, 0, img.width, img.height); const d = imgD.data;
        const W = imgD.width, H = imgD.height;
        const out = new Uint8ClampedArray(d.length);
        for (let i = 3; i < out.length; i += 4) out[i] = 255;
        const kx = [-1, 0, 1, -2, 0, 2, -1, 0, 1], ky = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
        for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
          let gxR = 0, gyR = 0;
          for (let ky2 = -1; ky2 <= 1; ky2++) for (let kx2 = -1; kx2 <= 1; kx2++) {
            const idx = ((y + ky2) * W + (x + kx2)) * 4;
            const lum = d[idx] * .3 + d[idx + 1] * .59 + d[idx + 2] * .11;
            gxR += lum * kx[(ky2 + 1) * 3 + (kx2 + 1)]; gyR += lum * ky[(ky2 + 1) * 3 + (kx2 + 1)];
          }
          const mag = Math.min(255, Math.sqrt(gxR * gxR + gyR * gyR));
          const ii = (y * W + x) * 4; out[ii] = out[ii + 1] = out[ii + 2] = mag; out[ii + 3] = 255;
        }
        ctx.putImageData(new ImageData(out, W, H), 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'duotone') {
        draw(img, img.width, img.height, false);
        const imgD = ctx.getImageData(0, 0, img.width, img.height); const d = imgD.data;
        const c1 = gv('dt1') || '#1a237e', c2 = gv('dt2') || '#e91e63';
        const hex2rgb = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
        const [r1, g1, b1] = hex2rgb(c1!), [r2, g2, b2] = hex2rgb(c2!);
        for (let i = 0; i < d.length; i += 4) {
          const lum = (d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11) / 255;
          d[i] = r1 + (r2 - r1) * lum; d[i + 1] = g1 + (g2 - g1) * lum; d[i + 2] = b1 + (b2 - b1) * lum;
        }
        ctx.putImageData(imgD, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'sketch') {
        draw(img, img.width, img.height, false);
        const grayD = ctx.getImageData(0, 0, img.width, img.height);
        const gd = grayD.data;
        for (let i = 0; i < gd.length; i += 4) { const g = gd[i] * .3 + gd[i + 1] * .59 + gd[i + 2] * .11; gd[i] = gd[i + 1] = gd[i + 2] = g; }
        ctx.putImageData(grayD, 0, 0);
        const off = document.createElement('canvas'); off.width = img.width; off.height = img.height;
        const octx = off.getContext('2d')!;
        octx.filter = 'blur(3px)'; octx.drawImage(cvs, 0, 0); octx.filter = 'none';
        const inv = octx.getImageData(0, 0, img.width, img.height); const id2 = inv.data;
        for (let i = 0; i < id2.length; i += 4) { id2[i] = 255 - id2[i]; id2[i + 1] = 255 - id2[i + 1]; id2[i + 2] = 255 - id2[i + 2]; }
        const base = ctx.getImageData(0, 0, img.width, img.height);
        const bd = base.data;
        for (let i = 0; i < bd.length; i += 4) {
          for (let c = 0; c < 3; c++) {
            const a = bd[i + c], b2 = id2[i + c];
            bd[i + c] = b2 >= 255 ? 255 : Math.min(255, (a * 255) / (255 - b2));
          }
        }
        ctx.putImageData(base, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'halftone') {
        const ds = gvn('htS') || 6;
        draw(img, img.width, img.height, false);
        const imgD = ctx.getImageData(0, 0, img.width, img.height); const d = imgD.data;
        cvs.width = img.width; cvs.height = img.height;
        ctx.fillStyle = 'white'; ctx.fillRect(0, 0, img.width, img.height);
        ctx.fillStyle = 'black';
        for (let y = ds; y < img.height - ds; y += ds * 2) for (let x = ds; x < img.width - ds; x += ds * 2) {
          const idx = (y * img.width + x) * 4;
          const lum = 1 - (d[idx] * .3 + d[idx + 1] * .59 + d[idx + 2] * .11) / 255;
          ctx.beginPath(); ctx.arc(x, y, Math.max(0, lum * ds * .9), 0, Math.PI * 2); ctx.fill();
        }
        state.blob = await toBlob('image/png');
      } else if (id === 'glitch') {
        draw(img, img.width, img.height, false);
        const intensity = gvn('glitchS') || 10;
        const imgD = ctx.getImageData(0, 0, img.width, img.height);
        const src = imgD.data;
        const W = imgD.width, H = imgD.height;
        const out = new Uint8ClampedArray(src.length);
        for (let y = 0; y < H; y++) {
          const offX = y % 10 < 3 ? Math.floor((Math.random() - .5) * intensity * 2) : 0;
          for (let x = 0; x < W; x++) {
            const si = (y * W + x) * 4;
            const rx = Math.max(0, Math.min(W - 1, x + offX));
            const lx = Math.max(0, Math.min(W - 1, x - offX));
            const ri = (y * W + rx) * 4, li = (y * W + lx) * 4;
            out[si] = src[ri];
            out[si + 1] = src[si + 1];
            out[si + 2] = src[li + 2];
            out[si + 3] = src[si + 3];
          }
        }
        ctx.putImageData(new ImageData(out, W, H), 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'ascii-art') {
        const maxW = 80;
        const sc = maxW / img.width; const nw = maxW, nh = Math.max(1, Math.round(img.height * sc * .45));
        cvs.width = nw; cvs.height = nh; ctx.clearRect(0, 0, nw, nh); ctx.drawImage(img, 0, 0, nw, nh);
        const imgD = ctx.getImageData(0, 0, nw, nh); const d = imgD.data;
        const chars = ' .,:;i1tfLCG08@#';
        let ascii = '';
        for (let y = 0; y < nh; y++) {
          for (let x = 0; x < nw; x++) {
            const i = (y * nw + x) * 4;
            const lum = d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11;
            const ci = Math.floor(lum / 255 * (chars.length - 1));
            ascii += chars[ci];
          }
          ascii += '\n';
        }
        state.blob = new Blob([ascii], { type: 'text/plain' });
      } else {
        draw(img, img.width, img.height, false);
        state.blob = await toBlob(state.tool.mime || 'image/png', 0.92);
      }

      // Show result
      if (state.blob) {
        const convCol = $('convCol'); if (convCol) convCol.classList.remove('opacity-30');
        const resultSec = $('resultSec'); if (resultSec) resultSec.classList.remove('hidden');
        if (state.blob.type && state.blob.type.startsWith('image/')) {
          const url = URL.createObjectURL(state.blob);
          const convPrev = $('convPrev') as HTMLImageElement; if (convPrev) convPrev.src = url;
          const ci = new Image();
          ci.onload = () => { const convDims = $('convDims'); if (convDims) convDims.textContent = `${ci.width}×${ci.height} px`; };
          ci.onerror = () => { const convDims = $('convDims'); if (convDims) convDims.textContent = 'Image preview unavailable'; };
          ci.src = url;
        } else if (state.blob.type === 'text/plain') {
          const convPrev = $('convPrev') as HTMLImageElement;
          if (convPrev) convPrev.src = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80"><rect fill="#f0fdf4" width="120" height="80" rx="8"/><text x="60" y="45" text-anchor="middle" font-family="monospace" font-size="14" font-weight="bold" fill="#166534">TXT</text></svg>')}`;
          const convDims = $('convDims'); if (convDims) convDims.textContent = 'Text file';
        } else {
          const convPrev = $('convPrev') as HTMLImageElement;
          if (convPrev) convPrev.src = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80"><rect fill="#fef2f2" width="120" height="80" rx="8"/><text x="60" y="45" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#991b1b">PDF</text></svg>')}`;
          const convDims = $('convDims'); if (convDims) convDims.textContent = 'PDF document';
        }
        const convBadge = $('convBadge'); if (convBadge) convBadge.textContent = fmtSize(state.blob.size);
        const save = state.origMeta ? state.origMeta.size - state.blob.size : 0;
        if (save > 0 && state.origMeta && state.origMeta.size > 0) {
          const pct = Math.round(save / state.origMeta.size * 100);
          const sb = $('saveBadge'); if (sb) { sb.textContent = `↓ ${pct}% smaller`; sb.classList.remove('hidden'); }
        } else { const sb = $('saveBadge'); if (sb) sb.classList.add('hidden'); }
        toast('Done!', 's');
      }
    }

    // ── Download / Copy ──
    function downloadResult() {
      if (!state.blob) { toast('Nothing to download yet — process an image first.', 'i'); return; }
      try {
        const url = URL.createObjectURL(state.blob);
        const a = document.createElement('a');
        a.href = url;
        const baseName = (state.file && state.file.name)
          ? state.file.name.replace(/\.[^/.]+$/, '')
          : 'image';
        a.download = `${baseName}_${state.tool.id}.${state.tool.ext}`;
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { try { a.remove(); } catch (e) { } URL.revokeObjectURL(url); }, 200);
        toast('Downloaded!', 's');
      } catch (err: any) {
        console.error(err);
        toast('Download failed: ' + (err.message || 'browser blocked the download'), 'e', 4500);
      }
    }

    async function copyResult() {
      if (!state.blob) { toast('Nothing to copy yet — process an image first.', 'i'); return; }
      if (!state.blob.type || !state.blob.type.startsWith('image/')) {
        if (state.blob.type === 'text/plain') {
          try { const txt = await state.blob.text(); await navigator.clipboard.writeText(txt); return toast('Text copied to clipboard!', 's'); }
          catch (e) { return toast('Clipboard text copy not allowed in this browser', 'e'); }
        }
        return toast('Copy only works for image and text files', 'i');
      }
      if (!navigator.clipboard || !(window as any).ClipboardItem) {
        return toast('Clipboard image copy is not supported in this browser', 'e');
      }
      try {
        await navigator.clipboard.write([new (window as any).ClipboardItem({ [state.blob.type]: state.blob })]);
        toast('Copied to clipboard!', 's');
      } catch (e: any) {
        console.error(e);
        toast('Copy failed: ' + (e.message || 'clipboard permission denied'), 'e', 4500);
      }
    }

    // ── FAQ ──
    const faqs = [
      { q: 'Are my images uploaded to a server?', a: 'No. All processing happens 100% in your browser using the Canvas API. Your images never leave your device and are never uploaded anywhere.' },
      { q: 'Which image formats can I convert?', a: 'We support PNG, JPG/JPEG, WebP, GIF, SVG, BMP, TIFF, AVIF and more as inputs. Output formats include PNG, JPG, WebP, ICO, PDF, SVG, BMP, Base64 and ASCII.' },
      { q: 'What is the file size limit?', a: 'The practical limit is around 50MB, depending on your browser and available device memory. Most images work instantly.' },
      { q: 'Does PNG to SVG produce a true vector file?', a: "Our PNG→SVG tool creates an SVG wrapper containing the raster image. For true vector tracing (like Illustrator's Live Trace), a dedicated desktop application is recommended." },
      { q: 'Can I paste images from clipboard?', a: 'Yes! After selecting a tool, press Ctrl+V (or Cmd+V on Mac) to paste an image directly from your clipboard.' },
      { q: 'Do I need to create an account?', a: 'No. All 50+ tools are completely free with no registration, no sign-in and no email required.' },
      { q: 'What browsers are supported?', a: 'All modern browsers: Chrome, Firefox, Safari, Edge, Opera and their mobile versions. No plugins or extensions needed.' },
      { q: 'Is there a watermark on the output?', a: 'Never. Your processed images are completely watermark-free. We do not add any branding to your files.' },
      { q: 'Can I use this on mobile?', a: 'Yes! The app is fully responsive and works on iOS Safari, Android Chrome and all modern mobile browsers.' },
    ];
    const faqList = $('faqList');
    if (faqList) {
      faqList.innerHTML = faqs.map((f, i) => `
        <div class="rounded-xl border overflow-hidden" style="background:var(--card);border-color:var(--border)">
          <button class="faq-btn w-full flex items-center justify-between p-5 text-left" data-i="${i}" aria-expanded="false">
            <span class="font-semibold pr-4 text-sm" style="color:var(--fg)"></span>
            <svg class="faq-ico w-4.5 h-4.5 flex-shrink-0 transition-transform" style="width:18px;height:18px;color:var(--muted)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="faq-body hidden px-5 pb-5"><p class="text-sm leading-relaxed" style="color:var(--muted)"></p></div>
        </div>
      `).join('');
      const faqBlocks = faqList.children;
      for (let i = 0; i < faqs.length; i++) {
        const b = faqBlocks[i];
        const btnSpan = b.querySelector('.faq-btn span'); if (btnSpan) btnSpan.textContent = faqs[i].q;
        const bodyP = b.querySelector('.faq-body p'); if (bodyP) bodyP.textContent = faqs[i].a;
      }
      faqList.addEventListener('click', (e: Event) => {
        const btn = (e.target as Element).closest('.faq-btn') as HTMLElement; if (!btn) return;
        const body = btn.nextElementSibling as HTMLElement, ico = btn.querySelector('.faq-ico') as HTMLElement;
        const open = !body.classList.contains('hidden');
        body.classList.toggle('hidden', open);
        if (ico) ico.style.transform = open ? '' : 'rotate(180deg)';
        btn.setAttribute('aria-expanded', String(!open));
      });
    }

    // ── Initial render ──
    renderGrid();
    toast('50+ image tools ready', 'i', 2500);
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Thefreeaitools — 50+ Free Online Image Converter, Resizer, Compressor &amp; Editor</title>
        <meta name="description" content="Thefreeaitools — 50+ free online image tools: convert PNG↔SVG↔JPG↔WebP↔ICO↔PDF↔BMP↔TIFF↔AVIF↔GIF↔PSD, resize, compress, crop, rotate, flip, watermark, grayscale, blur, sharpen, invert, sepia, pixelate, border, text overlay & more. 100% client-side — your files never leave your device." />
        <meta name="keywords" content="image converter online free, png to svg, svg to png, jpg to png, png to jpg, webp converter, ico favicon generator, image to pdf, resize image, compress image, webp to jpg, bmp converter, tiff converter, gif to png, avif converter, image editor online, rotate image, crop image, watermark image, flip image, grayscale image, blur image, sepia filter, image tools, thefreeaitools" />
        <meta name="author" content="Thefreeaitools" />
        <meta name="language" content="English" />
        <meta name="rating" content="general" />
        <meta name="theme-color" content="#DC2626" />
        <link rel="alternate" hrefLang="en" href="https://www.thefreeaitools.com/tools/image-convertir-ai" />
        <link rel="alternate" hrefLang="x-default" href="https://www.thefreeaitools.com/tools/image-convertir-ai" />
        <meta property="og:title" content="Thefreeaitools — 50+ Free Online Image Converter & Editor" />
        <meta property="og:description" content="Convert, resize, compress and edit images in your browser. PNG↔SVG↔JPG↔WebP↔ICO↔PDF↔BMP↔TIFF and 40+ more tools. No uploads, 100% private and free." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.thefreeaitools.com/tools/image-convertir-ai" />
        <meta property="og:image" content="https://www.thefreeaitools.com/og-image.jpg" />
        <meta property="og:site_name" content="Thefreeaitools" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Thefreeaitools — 50+ Free Online Image Tools" />
        <meta name="twitter:description" content="Convert PNG↔SVG↔JPG↔WebP↔ICO↔PDF and 40+ more tools. Resize, compress, crop, rotate free." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />
        <link rel="canonical" href="https://www.thefreeaitools.com/tools/image-converter" />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />
        <style dangerouslySetInnerHTML={{ __html: globalCSS }} />
      </Head>

      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" strategy="beforeInteractive" />
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      <Script id="tailwind-config" strategy="beforeInteractive">{`
        if (typeof tailwind !== 'undefined') {
          tailwind.config = {
            darkMode: 'class',
            theme: {
              extend: {
                fontFamily: {
                  display: ['Syne', 'sans-serif'],
                  body: ['Instrument Sans', 'sans-serif'],
                }
              }
            }
          }
        }
      `}</Script>

      <div id="cur" />
      <div id="cur2" />
      <div id="toastBox" aria-live="polite" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b header-glass" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15 py-3">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--fg)' }}>
                <svg className="w-5 h-5" style={{ color: 'var(--bg)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" /><polyline points="21 15 16 10 5 21" /></svg>
              </div>
              <span className="font-display font-bold text-lg" style={{ color: 'var(--fg)' }}>Thefreeaitools</span>
            </a>
            <nav className="hidden md:flex items-center gap-1">
              <a href="#tools" className="px-3 py-1.5 rounded-lg text-sm font-medium" style={{ color: 'var(--muted)' }}>Tools</a>
              <a href="#features" className="px-3 py-1.5 rounded-lg text-sm font-medium" style={{ color: 'var(--muted)' }}>Features</a>
              <a href="#faq" className="px-3 py-1.5 rounded-lg text-sm font-medium" style={{ color: 'var(--muted)' }}>FAQ</a>
            </nav>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a', border: '1px solid rgba(22,163,74,0.2)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" style={{ animation: 'pulse 2s infinite' }} />
                100% Private
              </div>
              <button id="darkBtn" aria-label="Toggle dark mode" className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--surface)', color: 'var(--muted)' }}>
                <svg id="sunI" style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                <svg id="moonI" className="hidden" style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* Hero */}
        <section className="text-center mb-14" aria-labelledby="heroTitle">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 fade-up" style={{ background: 'rgba(232,93,38,0.09)', color: 'var(--accent)', border: '1px solid rgba(232,93,38,0.2)' }}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            50+ Free Tools — Zero Uploads — Zero Tracking
          </div>
          <h2 id="heroTitle" className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-5 fade-up fa-1" style={{ color: 'var(--fg)' }}>
            Convert Any Image<br />
            <span style={{ color: 'var(--accent)' }}>To Any Format</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 fade-up fa-2" style={{ color: 'var(--muted)' }}>
            PNG ↔ SVG ↔ JPG ↔ WebP ↔ ICO ↔ PDF ↔ BMP ↔ TIFF ↔ AVIF ↔ GIF and 40+ editing tools.
            Everything runs in your browser. Your images never leave your device.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8 fade-up fa-3">
            <span className="chip">50+ Tools</span>
            <span className="chip">All Browsers</span>
            <span className="chip">No Registration</span>
            <span className="chip">Instant Results</span>
            <span className="chip">100% Free</span>
          </div>
        </section>

        {/* Tools Section */}
        <section id="tools" className="mb-14" aria-label="Image tools">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <div>
              <p className="slabel">All Tools</p>
              <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--fg)' }}>
                Pick a tool <span id="toolCount" className="count-badge ml-2">50</span>
              </h2>
            </div>
            <div className="search-wrap w-full sm:w-64">
              <svg className="w-4 h-4" style={{ color: 'var(--muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input type="search" id="searchInp" placeholder="Search tools…" className="inp search-inp" autoComplete="off" />
            </div>
          </div>
          <div className="cats-scroll flex items-center gap-2 mb-5 pb-1">
            <button className="cat-tab active" data-cat="all">All</button>
            <button className="cat-tab" data-cat="convert">Convert</button>
            <button className="cat-tab" data-cat="edit">Edit</button>
            <button className="cat-tab" data-cat="adjust">Adjust</button>
            <button className="cat-tab" data-cat="export">Export</button>
            <button className="cat-tab" data-cat="filter">Filters</button>
            <button className="cat-tab" data-cat="ai">AI-Style</button>
          </div>
          <div id="toolsGrid" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3" />
          <p id="noResults" className="hidden text-center py-12" style={{ color: 'var(--muted)' }}>No tools match your search.</p>
        </section>

        {/* Active Tool Panel */}
        <section id="toolPanel" className="hidden mb-14" aria-label="Active tool">
          <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-4">
                <div id="panelIcon" className="tool-icon" style={{ width: '48px', height: '48px', borderRadius: '14px' }} />
                <div>
                  <h2 id="panelTitle" className="font-display font-bold text-xl" style={{ color: 'var(--fg)' }} />
                  <p id="panelDesc" className="text-sm mt-0.5" style={{ color: 'var(--muted)' }} />
                </div>
              </div>
              <button id="closeBtn" aria-label="Close" className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--border)', color: 'var(--muted)' }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div id="panelProgress" className="hidden prog" />
            <div className="p-6">
              {/* Upload Zone */}
              <div id="upZone" className="upload-zone p-10 text-center mb-6" role="button" tabIndex={0} aria-label="Upload image">
                <input type="file" id="fileInp" className="hidden" accept="image/*" />
                <div className="flex flex-col items-center gap-4">
                  <div style={{ animation: 'float 3s ease-in-out infinite' }}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: 'rgba(232,93,38,0.1)' }}>
                      <svg className="w-8 h-8" style={{ color: 'var(--accent)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold mb-1" style={{ color: 'var(--fg)' }}>Drop your image here</p>
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>or <span style={{ color: 'var(--accent)', fontWeight: 600 }}>click to browse</span> · JPG, PNG, WebP, GIF, SVG, BMP, TIFF, AVIF</p>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>Max 50MB · All formats · Instant processing · Paste with Ctrl+V</p>
                </div>
              </div>
              {/* File Info */}
              <div id="fileBar" className="hidden items-center gap-4 p-4 rounded-xl mb-6" style={{ background: 'rgba(232,93,38,0.06)', border: '1.5px solid rgba(232,93,38,0.15)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(232,93,38,0.12)' }}>
                  <svg className="w-5 h-5" style={{ color: 'var(--accent)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" /><polyline points="21 15 16 10 5 21" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p id="fName" className="font-semibold text-sm truncate" style={{ color: 'var(--fg)' }} />
                  <p id="fDetails" className="text-xs mt-0.5" style={{ color: 'var(--muted)' }} />
                </div>
                <button id="changeBtn" className="btn btn-secondary text-xs py-1.5 px-3 flex-shrink-0">Change</button>
              </div>
              {/* Options */}
              <div id="optPanel" className="hidden mb-6" />
              {/* Action row */}
              <div id="actRow" className="hidden flex-wrap gap-3 mb-6">
                <button id="runBtn" className="btn btn-accent">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  <span id="runBtnTxt">Process</span>
                </button>
                <button id="rstBtn" className="btn btn-secondary">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 109-9M3 3v6h6" /></svg>
                  Reset
                </button>
              </div>
              {/* Result */}
              <div id="resultSec" className="hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold" style={{ color: 'var(--fg)' }}>Result</h3>
                  <span id="saveBadge" className="hidden text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(22,163,74,0.12)', color: '#16a34a', border: '1px solid rgba(22,163,74,0.2)' }} />
                </div>
                <div id="prevGrid" className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="slabel mb-0">Original</span>
                      <span id="origBadge" className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--surface)', color: 'var(--muted)' }} />
                    </div>
                    <div className="checker rounded-xl overflow-hidden flex items-center justify-center min-h-[160px] max-h-[260px]">
                      <img id="origPrev" className="max-w-full object-contain max-h-[260px]" alt="Original" />
                    </div>
                    <p id="origDims" className="text-xs mt-2 text-center" style={{ color: 'var(--muted)' }} />
                  </div>
                  <div id="convCol">
                    <div className="flex items-center justify-between mb-2">
                      <span className="slabel mb-0">Result</span>
                      <span id="convBadge" className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--surface)', color: 'var(--muted)' }} />
                    </div>
                    <div className="checker rounded-xl overflow-hidden flex items-center justify-center min-h-[160px] max-h-[260px]">
                      <img id="convPrev" className="max-w-full object-contain max-h-[260px]" alt="Result" />
                    </div>
                    <p id="convDims" className="text-xs mt-2 text-center" style={{ color: 'var(--muted)' }} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button id="dlBtn" className="btn btn-accent">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    Download
                  </button>
                  <button id="cpBtn" className="btn btn-secondary">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                    Copy
                  </button>
                  <button id="anotherBtn" className="btn btn-secondary">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" /></svg>
                    Another
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mb-16">
          <p className="slabel text-center mb-2">Why Use Us</p>
          <h2 className="font-display font-bold text-3xl text-center mb-10" style={{ color: 'var(--fg)' }}>Built for designers, developers &amp; creators</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="rounded-2xl p-6 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(232,93,38,0.1)' }}><svg className="w-6 h-6" style={{ color: 'var(--accent)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></div>
              <h3 className="font-display font-semibold text-lg mb-2" style={{ color: 'var(--fg)' }}>100% Client-Side</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>All processing happens in your browser using the Canvas API and WebAssembly. Your images are never uploaded to any server.</p>
            </div>
            <div className="rounded-2xl p-6 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(45,107,228,0.1)' }}><svg className="w-6 h-6" style={{ color: 'var(--accent2)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg></div>
              <h3 className="font-display font-semibold text-lg mb-2" style={{ color: 'var(--fg)' }}>Instant Processing</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>No waiting for uploads. Conversion happens the moment you click — typically under 1 second for most images.</p>
            </div>
            <div className="rounded-2xl p-6 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(22,163,74,0.1)' }}><svg className="w-6 h-6" style={{ color: 'var(--accent3)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg></div>
              <h3 className="font-display font-semibold text-lg mb-2" style={{ color: 'var(--fg)' }}>50+ Tools, Always Free</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>No subscriptions, watermarks, or paywalls. Every tool — from basic format conversion to advanced filters — is permanently free.</p>
            </div>
            <div className="rounded-2xl p-6 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(168,85,247,0.1)' }}><svg className="w-6 h-6" style={{ color: '#a855f7' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg></div>
              <h3 className="font-display font-semibold text-lg mb-2" style={{ color: 'var(--fg)' }}>All Browsers Supported</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>Works on Chrome, Firefox, Safari, Edge and any modern browser — desktop or mobile. No plugins or extensions needed.</p>
            </div>
            <div className="rounded-2xl p-6 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(20,184,166,0.1)' }}><svg className="w-6 h-6" style={{ color: '#14b8a6' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg></div>
              <h3 className="font-display font-semibold text-lg mb-2" style={{ color: 'var(--fg)' }}>15+ Output Formats</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>Convert to PNG, JPG, WebP, GIF, BMP, ICO, PDF, SVG, TIFF, AVIF and more. All the formats designers and developers need.</p>
            </div>
            <div className="rounded-2xl p-6 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(245,158,11,0.1)' }}><svg className="w-6 h-6" style={{ color: '#f59e0b' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg></div>
              <h3 className="font-display font-semibold text-lg mb-2" style={{ color: 'var(--fg)' }}>For Everyone</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>Designed for web designers, developers, photographers, content creators, authors and anyone who works with images.</p>
            </div>
          </div>
        </section>

        {/* Popular Tools SEO Section */}
        <section className="mb-16" aria-label="Popular conversion tools">
          <p className="slabel text-center mb-2">Most Searched</p>
          <h2 className="font-display font-bold text-2xl text-center mb-8" style={{ color: 'var(--fg)' }}>Popular Image Conversion Tools</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <article className="rounded-xl p-5 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-display font-semibold mb-2" style={{ color: 'var(--fg)' }}>PNG to SVG Converter</h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Convert raster PNG images to scalable SVG vector format. Perfect for logos and icons that need to scale at any size.</p>
            </article>
            <article className="rounded-xl p-5 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-display font-semibold mb-2" style={{ color: 'var(--fg)' }}>SVG to PNG Converter</h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Export SVG vector graphics to high-resolution PNG bitmaps at any pixel size. Essential for web and app development.</p>
            </article>
            <article className="rounded-xl p-5 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-display font-semibold mb-2" style={{ color: 'var(--fg)' }}>JPG ↔ WebP Converter</h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Convert between JPG and WebP formats. WebP offers 30% better compression than JPG — ideal for faster websites.</p>
            </article>
            <article className="rounded-xl p-5 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-display font-semibold mb-2" style={{ color: 'var(--fg)' }}>Image to PDF</h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Turn any image into a PDF document instantly. No software needed. Perfect for sharing photos as documents.</p>
            </article>
            <article className="rounded-xl p-5 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-display font-semibold mb-2" style={{ color: 'var(--fg)' }}>PNG to ICO Favicon</h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Generate .ico favicon files in all sizes (16×16 to 128×128) from any PNG image for your website or web app.</p>
            </article>
            <article className="rounded-xl p-5 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-display font-semibold mb-2" style={{ color: 'var(--fg)' }}>Compress &amp; Optimize</h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Reduce image file size by up to 90% with quality control. Optimize images for faster web page loading.</p>
            </article>
            <article className="rounded-xl p-5 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-display font-semibold mb-2" style={{ color: 'var(--fg)' }}>Image Filters &amp; Effects</h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Apply grayscale, sepia, blur, sharpen, invert, vintage and more CSS-powered filters to any image instantly.</p>
            </article>
            <article className="rounded-xl p-5 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-display font-semibold mb-2" style={{ color: 'var(--fg)' }}>BMP / TIFF Converter</h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Convert legacy BMP and TIFF formats to modern web-friendly formats like PNG, JPG or WebP with one click.</p>
            </article>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-16" aria-labelledby="faqTitle">
          <p className="slabel text-center mb-2">FAQ</p>
          <h2 id="faqTitle" className="font-display font-bold text-2xl text-center mb-8" style={{ color: 'var(--fg)' }}>Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-3" id="faqList" />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-10" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--fg)' }}>
                <svg className="w-4 h-4" style={{ color: 'var(--bg)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="3" /><polyline points="21 15 16 10 5 21" /></svg>
              </div>
              <span className="font-display font-bold" style={{ color: 'var(--fg)' }}>Thefreeaitools</span>
            </div>
            <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>All processing happens locally in your browser. Your images are never uploaded to any server.</p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>© 2025 Thefreeaitools</p>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {['PNG Converter', 'SVG Converter', 'JPG Converter', 'WebP Converter', 'ICO Favicon Generator', 'Image to PDF', 'Resize Image', 'Compress Image', 'Image Filters', 'BMP Converter', 'TIFF Converter', 'GIF Converter'].map(t => (
              <span key={t} className="text-xs" style={{ color: 'var(--muted)' }}>{t}</span>
            ))}
          </div>
        </div>
      </footer>

      <canvas id="cvs" className="hidden" />
    </>
  );
}
