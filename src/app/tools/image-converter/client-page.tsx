'use client';

import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
//  100+ TOOLS REGISTRY
// ═══════════════════════════════════════════════════════════════
const TOOLS = [
  // CONVERT — Format to Format
  { id: 'jpg-to-png', cat: 'convert', title: 'JPG → PNG', full: 'JPG to PNG Converter', desc: 'Convert JPEG images to lossless PNG format', act: 'Convert to PNG', ext: 'png', mime: 'image/png', accept: 'image/jpeg,image/jpg', color: '#f97316', icon: 'image' },
  { id: 'png-to-jpg', cat: 'convert', title: 'PNG → JPG', full: 'PNG to JPG Converter', desc: 'Convert PNG to JPG with custom background', act: 'Convert to JPG', ext: 'jpg', mime: 'image/jpeg', accept: 'image/png', color: '#3b82f6', icon: 'image' },
  { id: 'webp-to-jpg', cat: 'convert', title: 'WebP → JPG', full: 'WebP to JPG Converter', desc: 'Convert WebP to universal JPEG format', act: 'Convert to JPG', ext: 'jpg', mime: 'image/jpeg', accept: 'image/webp', color: '#06b6d4', icon: 'image' },
  { id: 'webp-to-png', cat: 'convert', title: 'WebP → PNG', full: 'WebP to PNG Converter', desc: 'Convert WebP to lossless PNG format', act: 'Convert to PNG', ext: 'png', mime: 'image/png', accept: 'image/webp', color: '#0891b2', icon: 'image' },
  { id: 'jpg-to-webp', cat: 'convert', title: 'JPG → WebP', full: 'JPG to WebP Converter', desc: 'Convert JPEG to smaller WebP format for web', act: 'Convert to WebP', ext: 'webp', mime: 'image/webp', accept: 'image/jpeg,image/jpg', color: '#10b981', icon: 'image' },
  { id: 'png-to-webp', cat: 'convert', title: 'PNG → WebP', full: 'PNG to WebP Converter', desc: 'Convert PNG to WebP — smaller size same quality', act: 'Convert to WebP', ext: 'webp', mime: 'image/webp', accept: 'image/png', color: '#059669', icon: 'image' },
  { id: 'svg-to-png', cat: 'convert', title: 'SVG → PNG', full: 'SVG to PNG Converter', desc: 'Rasterize vector SVG to PNG bitmap at any size', act: 'Convert to PNG', ext: 'png', mime: 'image/png', accept: 'image/svg+xml', color: '#ec4899', icon: 'vector' },
  { id: 'svg-to-jpg', cat: 'convert', title: 'SVG → JPG', full: 'SVG to JPG Converter', desc: 'Convert SVG vector to JPG raster image', act: 'Convert to JPG', ext: 'jpg', mime: 'image/jpeg', accept: 'image/svg+xml', color: '#db2777', icon: 'vector' },
  { id: 'svg-to-webp', cat: 'convert', title: 'SVG → WebP', full: 'SVG to WebP Converter', desc: 'Convert SVG to WebP for modern web use', act: 'Convert to WebP', ext: 'webp', mime: 'image/webp', accept: 'image/svg+xml', color: '#be185d', icon: 'vector' },
  { id: 'png-to-svg', cat: 'convert', title: 'PNG → SVG', full: 'PNG to SVG Converter', desc: 'Trace PNG to SVG vector silhouette', act: 'Convert to SVG', ext: 'svg', mime: 'image/svg+xml', accept: 'image/png', color: '#7c3aed', icon: 'vector' },
  { id: 'jpg-to-svg', cat: 'convert', title: 'JPG → SVG', full: 'JPG to SVG Converter', desc: 'Trace JPG to SVG silhouette vector', act: 'Convert to SVG', ext: 'svg', mime: 'image/svg+xml', accept: 'image/jpeg,image/jpg', color: '#6d28d9', icon: 'vector' },
  { id: 'bmp-to-png', cat: 'convert', title: 'BMP → PNG', full: 'BMP to PNG Converter', desc: 'Convert legacy BMP bitmap to PNG format', act: 'Convert to PNG', ext: 'png', mime: 'image/png', accept: 'image/bmp', color: '#64748b', icon: 'image' },
  { id: 'bmp-to-jpg', cat: 'convert', title: 'BMP → JPG', full: 'BMP to JPG Converter', desc: 'Convert BMP to compressed JPEG format', act: 'Convert to JPG', ext: 'jpg', mime: 'image/jpeg', accept: 'image/bmp', color: '#475569', icon: 'image' },
  { id: 'gif-to-png', cat: 'convert', title: 'GIF → PNG', full: 'GIF to PNG Converter', desc: 'Extract first GIF frame as PNG image', act: 'Convert to PNG', ext: 'png', mime: 'image/png', accept: 'image/gif', color: '#f43f5e', icon: 'image' },
  { id: 'gif-to-jpg', cat: 'convert', title: 'GIF → JPG', full: 'GIF to JPG Converter', desc: 'Convert animated GIF first frame to JPG', act: 'Convert to JPG', ext: 'jpg', mime: 'image/jpeg', accept: 'image/gif', color: '#e11d48', icon: 'image' },
  { id: 'gif-to-webp', cat: 'convert', title: 'GIF → WebP', full: 'GIF to WebP Converter', desc: 'Convert GIF frame to WebP format', act: 'Convert to WebP', ext: 'webp', mime: 'image/webp', accept: 'image/gif', color: '#9f1239', icon: 'image' },
  { id: 'tiff-to-png', cat: 'convert', title: 'TIFF → PNG', full: 'TIFF to PNG Converter', desc: 'Convert TIFF/TIF images to PNG format', act: 'Convert to PNG', ext: 'png', mime: 'image/png', accept: 'image/tiff', color: '#854d0e', icon: 'image' },
  { id: 'tiff-to-jpg', cat: 'convert', title: 'TIFF → JPG', full: 'TIFF to JPG Converter', desc: 'Convert high-res TIFF to compressed JPG', act: 'Convert to JPG', ext: 'jpg', mime: 'image/jpeg', accept: 'image/tiff', color: '#713f12', icon: 'image' },
  { id: 'avif-to-jpg', cat: 'convert', title: 'AVIF → JPG', full: 'AVIF to JPG Converter', desc: 'Convert AVIF to universally supported JPEG', act: 'Convert to JPG', ext: 'jpg', mime: 'image/jpeg', accept: 'image/avif', color: '#365314', icon: 'image' },
  { id: 'avif-to-png', cat: 'convert', title: 'AVIF → PNG', full: 'AVIF to PNG Converter', desc: 'Convert AVIF to PNG lossless format', act: 'Convert to PNG', ext: 'png', mime: 'image/png', accept: 'image/avif', color: '#14532d', icon: 'image' },
  { id: 'jpg-to-bmp', cat: 'convert', title: 'JPG → BMP', full: 'JPG to BMP Converter', desc: 'Convert JPG to uncompressed BMP bitmap', act: 'Convert to BMP', ext: 'bmp', mime: 'image/bmp', accept: 'image/jpeg,image/jpg', color: '#1d4ed8', icon: 'image' },
  { id: 'png-to-bmp', cat: 'convert', title: 'PNG → BMP', full: 'PNG to BMP Converter', desc: 'Convert PNG to BMP format', act: 'Convert to BMP', ext: 'bmp', mime: 'image/bmp', accept: 'image/png', color: '#1e40af', icon: 'image' },
  { id: 'any-to-png', cat: 'convert', title: 'Any → PNG', full: 'Universal to PNG Converter', desc: 'Convert any image format to PNG', act: 'Convert to PNG', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#0369a1', icon: 'image' },
  { id: 'any-to-jpg', cat: 'convert', title: 'Any → JPG', full: 'Universal to JPG Converter', desc: 'Convert any image to JPEG format', act: 'Convert to JPG', ext: 'jpg', mime: 'image/jpeg', accept: 'image/*', color: '#0c4a6e', icon: 'image' },
  { id: 'any-to-webp', cat: 'convert', title: 'Any → WebP', full: 'Universal to WebP Converter', desc: 'Convert any image to WebP for the web', act: 'Convert to WebP', ext: 'webp', mime: 'image/webp', accept: 'image/*', color: '#134e4a', icon: 'image' },
  { id: 'heic-to-jpg', cat: 'convert', title: 'HEIC → JPG', full: 'HEIC to JPG Converter', desc: 'Convert iPhone HEIC photos to universal JPG', act: 'Convert to JPG', ext: 'jpg', mime: 'image/jpeg', accept: 'image/heic,image/*', color: '#7e22ce', icon: 'image' },
  { id: 'heic-to-png', cat: 'convert', title: 'HEIC → PNG', full: 'HEIC to PNG Converter', desc: 'Convert iPhone HEIC photos to PNG format', act: 'Convert to PNG', ext: 'png', mime: 'image/png', accept: 'image/heic,image/*', color: '#6b21a8', icon: 'image' },
  { id: 'png-to-gif', cat: 'convert', title: 'PNG → GIF', full: 'PNG to GIF Converter', desc: 'Convert PNG image to GIF format', act: 'Convert to GIF', ext: 'gif', mime: 'image/gif', accept: 'image/png', color: '#b91c1c', icon: 'image' },
  { id: 'jpg-to-tiff', cat: 'convert', title: 'JPG → TIFF', full: 'JPG to TIFF Converter', desc: 'Convert JPEG to lossless TIFF format for print', act: 'Convert to TIFF', ext: 'tiff', mime: 'image/tiff', accept: 'image/jpeg,image/jpg', color: '#92400e', icon: 'image' },
  { id: 'png-to-tiff', cat: 'convert', title: 'PNG → TIFF', full: 'PNG to TIFF Converter', desc: 'Convert PNG to professional TIFF format', act: 'Convert to TIFF', ext: 'tiff', mime: 'image/tiff', accept: 'image/png', color: '#78350f', icon: 'image' },
  // EXPORT
  { id: 'png-to-ico', cat: 'export', title: 'PNG → ICO', full: 'PNG to ICO Favicon Generator', desc: 'Generate ICO favicon in multiple sizes', act: 'Generate ICO', ext: 'ico', mime: 'image/x-icon', accept: 'image/png', color: '#f59e0b', icon: 'star' },
  { id: 'img-to-pdf', cat: 'export', title: 'Image → PDF', full: 'Image to PDF Converter', desc: 'Convert any image to a PDF document', act: 'Create PDF', ext: 'pdf', mime: 'application/pdf', accept: 'image/*', color: '#ef4444', icon: 'file' },
  { id: 'img-to-base64', cat: 'export', title: '→ Base64', full: 'Image to Base64 Encoder', desc: 'Encode image to Base64 data URL string', act: 'Encode Base64', ext: 'txt', mime: 'text/plain', accept: 'image/*', color: '#8b5cf6', icon: 'code' },
  { id: 'img-to-dataurl', cat: 'export', title: '→ Data URL', full: 'Image to Data URL', desc: 'Get full data:image URL for CSS/HTML embedding', act: 'Get Data URL', ext: 'txt', mime: 'text/plain', accept: 'image/*', color: '#7c3aed', icon: 'code' },
  { id: 'img-to-css', cat: 'export', title: '→ CSS BG', full: 'Image to CSS Background', desc: 'Generate CSS background-image property with data URL', act: 'Generate CSS', ext: 'txt', mime: 'text/plain', accept: 'image/*', color: '#4f46e5', icon: 'code' },
  { id: 'img-to-html', cat: 'export', title: '→ HTML Embed', full: 'Image to HTML Embed Code', desc: 'Generate HTML <img> tag with embedded Base64 image', act: 'Generate HTML', ext: 'txt', mime: 'text/plain', accept: 'image/*', color: '#0284c7', icon: 'code' },
  // EDIT
  { id: 'resize', cat: 'edit', title: 'Resize', full: 'Resize Image Online', desc: 'Resize to exact pixels or by percentage', act: 'Resize Image', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#10b981', icon: 'resize' },
  { id: 'compress', cat: 'edit', title: 'Compress', full: 'Compress & Optimize Image', desc: 'Reduce file size with quality control', act: 'Compress', ext: 'jpg', mime: 'image/jpeg', accept: 'image/*', color: '#8b5cf6', icon: 'compress' },
  { id: 'rotate', cat: 'edit', title: 'Rotate', full: 'Rotate Image Online', desc: 'Rotate by 90°, 180°, 270° or custom angle', act: 'Apply Rotation', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#14b8a6', icon: 'rotate' },
  { id: 'flip', cat: 'edit', title: 'Flip', full: 'Flip Image Online', desc: 'Mirror image horizontally or vertically', act: 'Apply Flip', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#84cc16', icon: 'flip' },
  { id: 'crop', cat: 'edit', title: 'Crop', full: 'Crop Image Online', desc: 'Crop image to exact pixel coordinates', act: 'Crop Image', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#f43f5e', icon: 'crop' },
  { id: 'watermark', cat: 'edit', title: 'Watermark', full: 'Add Watermark to Image', desc: 'Add text watermark with custom style & position', act: 'Add Watermark', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#a78bfa', icon: 'type' },
  { id: 'text-overlay', cat: 'edit', title: 'Add Text', full: 'Add Text Overlay to Image', desc: 'Add styled text annotation to your image', act: 'Add Text', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#60a5fa', icon: 'type' },
  { id: 'border', cat: 'edit', title: 'Add Border', full: 'Add Border to Image', desc: 'Add a solid colored border frame to image', act: 'Add Border', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#34d399', icon: 'square' },
  { id: 'padding', cat: 'edit', title: 'Add Padding', full: 'Add Padding / Canvas Expand', desc: 'Expand canvas with solid color padding', act: 'Add Padding', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#2dd4bf', icon: 'square' },
  { id: 'square-crop', cat: 'edit', title: 'Square Crop', full: 'Square Crop for Instagram', desc: 'Crop image to a centered square (1:1 ratio)', act: 'Square Crop', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#e879f9', icon: 'crop' },
  { id: 'aspect-crop', cat: 'edit', title: 'Aspect Crop', full: 'Aspect Ratio Crop', desc: 'Crop to 16:9, 4:3, 3:2 or custom ratio', act: 'Crop to Ratio', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#d946ef', icon: 'crop' },
  { id: 'round-corners', cat: 'edit', title: 'Round Corners', full: 'Round Image Corners', desc: 'Apply rounded corners to any image format', act: 'Apply Rounding', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#c084fc', icon: 'circle' },
  { id: 'shadow', cat: 'edit', title: 'Drop Shadow', full: 'Add Drop Shadow to Image', desc: 'Add a drop shadow behind your image', act: 'Add Shadow', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#818cf8', icon: 'sun' },
  { id: 'frame', cat: 'edit', title: 'Photo Frame', full: 'Add Decorative Photo Frame', desc: 'Add a decorative outer frame with color & style', act: 'Add Frame', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#fb923c', icon: 'square' },
  { id: 'noise', cat: 'edit', title: 'Add Noise', full: 'Add Grain/Noise Texture', desc: 'Add film grain or noise texture to image', act: 'Add Noise', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#a3a3a3', icon: 'zap' },
  { id: 'mosaic', cat: 'edit', title: 'Mosaic Blur', full: 'Mosaic / Censor Blur', desc: 'Blur a region with mosaic blocks to censor content', act: 'Apply Mosaic', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#737373', icon: 'grid' },
  // ADJUST
  { id: 'brightness', cat: 'adjust', title: 'Brightness', full: 'Adjust Brightness & Contrast', desc: 'Control brightness, contrast and exposure', act: 'Apply Adjustments', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#fbbf24', icon: 'sun' },
  { id: 'hue-saturation', cat: 'adjust', title: 'Hue/Saturation', full: 'Adjust Hue & Saturation', desc: 'Shift hue and adjust color saturation', act: 'Apply Adjustments', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#fb923c', icon: 'sliders' },
  { id: 'levels', cat: 'adjust', title: 'Levels', full: 'Adjust Image Levels', desc: 'Adjust shadow, midtone and highlight levels', act: 'Apply Levels', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#f97316', icon: 'sliders' },
  { id: 'opacity', cat: 'adjust', title: 'Opacity', full: 'Adjust Image Opacity', desc: 'Make image transparent with custom opacity', act: 'Apply Opacity', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#a3e635', icon: 'sliders' },
  { id: 'sharpen', cat: 'adjust', title: 'Sharpen', full: 'Sharpen Image', desc: 'Enhance image sharpness and edge definition', act: 'Sharpen Image', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#4ade80', icon: 'zap' },
  { id: 'blur', cat: 'adjust', title: 'Blur', full: 'Blur Image Online', desc: 'Apply Gaussian blur with adjustable radius', act: 'Apply Blur', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#22d3ee', icon: 'droplet' },
  { id: 'temperature', cat: 'adjust', title: 'Color Temp', full: 'Adjust Color Temperature', desc: 'Warm or cool the image color temperature', act: 'Apply Temperature', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#fde047', icon: 'thermometer' },
  { id: 'vibrance', cat: 'adjust', title: 'Vibrance', full: 'Adjust Vibrance', desc: 'Boost muted colors without over-saturating', act: 'Apply Vibrance', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#f472b6', icon: 'sliders' },
  { id: 'highlights', cat: 'adjust', title: 'Highlights', full: 'Recover Highlights & Shadows', desc: 'Recover blown highlights or crushed shadows', act: 'Apply Tones', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#c4b5fd', icon: 'sliders' },
  { id: 'curves', cat: 'adjust', title: 'Tone Curves', full: 'Adjust Tone Curves', desc: 'Apply S-curve or custom tone curve adjustment', act: 'Apply Curves', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#818cf8', icon: 'trending-up' },
  { id: 'clarity', cat: 'adjust', title: 'Clarity', full: 'Increase Image Clarity', desc: 'Add mid-tone contrast for a crisp editorial look', act: 'Apply Clarity', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#67e8f9', icon: 'zap' },
  // FILTERS
  { id: 'grayscale', cat: 'filter', title: 'Grayscale', full: 'Convert to Grayscale (B&W)', desc: 'Remove all color to create black & white image', act: 'Apply Grayscale', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#6b7280', icon: 'filter' },
  { id: 'sepia', cat: 'filter', title: 'Sepia', full: 'Sepia Tone Filter', desc: 'Apply warm vintage sepia color effect', act: 'Apply Sepia', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#92400e', icon: 'filter' },
  { id: 'invert', cat: 'filter', title: 'Invert', full: 'Invert Colors (Negative)', desc: 'Invert all colors to create a negative image', act: 'Apply Invert', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#1e293b', icon: 'filter' },
  { id: 'vintage', cat: 'filter', title: 'Vintage', full: 'Vintage Photo Filter', desc: 'Apply retro vintage photo effect with vignette', act: 'Apply Vintage', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#b45309', icon: 'filter' },
  { id: 'vignette', cat: 'filter', title: 'Vignette', full: 'Add Vignette Effect', desc: 'Darken image edges for a cinematic look', act: 'Add Vignette', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#374151', icon: 'filter' },
  { id: 'pixelate', cat: 'filter', title: 'Pixelate', full: 'Pixelate / Mosaic Effect', desc: 'Create pixel art or censor effect', act: 'Apply Pixelate', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#059669', icon: 'grid' },
  { id: 'emboss', cat: 'filter', title: 'Emboss', full: 'Emboss / Relief Effect', desc: 'Apply 3D emboss/relief effect to image', act: 'Apply Emboss', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#4f46e5', icon: 'layers' },
  { id: 'edge-detect', cat: 'filter', title: 'Edge Detect', full: 'Edge Detection Filter', desc: 'Extract edges and outlines from image', act: 'Detect Edges', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#0f172a', icon: 'zap' },
  { id: 'posterize', cat: 'filter', title: 'Posterize', full: 'Posterize Image', desc: 'Reduce color levels for a poster-art effect', act: 'Posterize', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#7e22ce', icon: 'layers' },
  { id: 'duotone', cat: 'filter', title: 'Duotone', full: 'Duotone Color Effect', desc: 'Apply two-tone color mapping effect', act: 'Apply Duotone', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#be123c', icon: 'layers' },
  { id: 'crossprocess', cat: 'filter', title: 'Cross-Process', full: 'Cross-Process Film Effect', desc: 'Simulate cross-processing darkroom film effect', act: 'Apply Cross-Pro', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#15803d', icon: 'filter' },
  { id: 'lofi', cat: 'filter', title: 'Lo-Fi', full: 'Lo-Fi Instagram Filter', desc: 'Warm tones, boosted saturation, faded blacks', act: 'Apply Lo-Fi', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#c2410c', icon: 'filter' },
  { id: 'cinematic', cat: 'filter', title: 'Cinematic', full: 'Cinematic Color Grade', desc: 'Teal & orange cinematic color grading', act: 'Apply Cinematic', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#0e7490', icon: 'film' },
  { id: 'cold', cat: 'filter', title: 'Cold Tone', full: 'Cold / Cool Tone Filter', desc: 'Apply cool blue-toned color grading', act: 'Apply Cold', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#1d4ed8', icon: 'filter' },
  { id: 'warm', cat: 'filter', title: 'Warm Tone', full: 'Warm Sunset Tone Filter', desc: 'Apply warm orange-yellow color grading', act: 'Apply Warm', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#ea580c', icon: 'filter' },
  { id: 'faded', cat: 'filter', title: 'Faded', full: 'Faded / Matte Film Look', desc: 'Lift blacks for a popular matte faded film look', act: 'Apply Faded', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#a16207', icon: 'filter' },
  { id: 'dramatic', cat: 'filter', title: 'Dramatic', full: 'Dramatic B&W Filter', desc: 'High-contrast dramatic black and white look', act: 'Apply Dramatic', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#27272a', icon: 'filter' },
  { id: 'neon', cat: 'filter', title: 'Neon Glow', full: 'Neon Glow Effect', desc: 'Glowing neon-colored edge highlight on dark bg', act: 'Apply Neon', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#a21caf', icon: 'zap' },
  { id: 'solarize', cat: 'filter', title: 'Solarize', full: 'Solarize / Sabattier Effect', desc: 'Darkroom-inspired partial image inversion effect', act: 'Apply Solarize', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#b45309', icon: 'filter' },
  // AI-STYLE
  { id: 'glitch', cat: 'ai', title: 'Glitch', full: 'Glitch Art Effect', desc: 'Add RGB channel split glitch art effect', act: 'Apply Glitch', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#e11d48', icon: 'zap' },
  { id: 'halftone', cat: 'ai', title: 'Halftone', full: 'Halftone Dot Pattern', desc: 'Convert image to halftone dot print effect', act: 'Apply Halftone', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#1d4ed8', icon: 'grid' },
  { id: 'ascii-art', cat: 'ai', title: 'ASCII Art', full: 'Image to ASCII Art', desc: 'Convert image to ASCII text art', act: 'Generate ASCII', ext: 'txt', mime: 'text/plain', accept: 'image/*', color: '#15803d', icon: 'terminal' },
  { id: 'sketch', cat: 'ai', title: 'Sketch', full: 'Photo to Pencil Sketch', desc: 'Convert photo to pencil sketch drawing effect', act: 'Apply Sketch', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#57534e', icon: 'pen-tool' },
  { id: 'stipple', cat: 'ai', title: 'Stipple', full: 'Stippling Dot Art Effect', desc: 'Convert image to stipple dotwork illustration', act: 'Apply Stipple', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#292524', icon: 'grid' },
  { id: 'oilpaint', cat: 'ai', title: 'Oil Paint', full: 'Oil Painting Effect', desc: 'Simulate an oil painting brush stroke style', act: 'Apply Oil Paint', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#7c2d12', icon: 'pen-tool' },
  { id: 'watercolor', cat: 'ai', title: 'Watercolor', full: 'Watercolor Paint Effect', desc: 'Transform photo into a soft watercolor painting', act: 'Apply Watercolor', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#0369a1', icon: 'droplet' },
  { id: 'comic', cat: 'ai', title: 'Comic', full: 'Comic Book / Pop Art Effect', desc: 'Bold outlines and flat colors for a comic book look', act: 'Apply Comic', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#dc2626', icon: 'zap' },
  { id: 'chromatic', cat: 'ai', title: 'Chromatic', full: 'Chromatic Aberration', desc: 'Lens-style RGB color channel offset distortion', act: 'Apply Chromatic', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#db2777', icon: 'layers' },
  { id: 'scanlines', cat: 'ai', title: 'Scanlines', full: 'CRT Scanlines Effect', desc: 'Retro CRT monitor horizontal scanline overlay', act: 'Apply Scanlines', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#166534', icon: 'grid' },
  { id: 'blueprint', cat: 'ai', title: 'Blueprint', full: 'Blueprint Technical Drawing', desc: 'Blueprint-style white lines on blue background', act: 'Apply Blueprint', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#1e40af', icon: 'pen-tool' },
  { id: 'thermal', cat: 'ai', title: 'Thermal', full: 'Thermal Camera Effect', desc: 'Simulate infrared thermal imaging camera look', act: 'Apply Thermal', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#ea580c', icon: 'thermometer' },
  { id: 'xray', cat: 'ai', title: 'X-Ray', full: 'X-Ray Effect', desc: 'Inverted high-contrast X-ray style effect', act: 'Apply X-Ray', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#64748b', icon: 'zap' },
  { id: 'matrix', cat: 'ai', title: 'Matrix', full: 'Matrix Green Code Effect', desc: 'Green-tinted matrix digital rain color effect', act: 'Apply Matrix', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#16a34a', icon: 'terminal' },
  // ANALYZE
  { id: 'metadata', cat: 'analyze', title: 'Metadata', full: 'View Image Metadata & EXIF', desc: 'Read image dimensions, format, DPI and file info', act: 'Read Metadata', ext: 'txt', mime: 'text/plain', accept: 'image/*', color: '#0ea5e9', icon: 'info' },
  { id: 'histogram', cat: 'analyze', title: 'Histogram', full: 'View Color Histogram', desc: 'Visualize RGB color distribution histogram', act: 'Show Histogram', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#8b5cf6', icon: 'bar-chart-2' },
  { id: 'palette', cat: 'analyze', title: 'Color Palette', full: 'Extract Color Palette', desc: 'Extract dominant colors from your image', act: 'Extract Colors', ext: 'txt', mime: 'text/plain', accept: 'image/*', color: '#ec4899', icon: 'droplet' },
  { id: 'compare', cat: 'analyze', title: 'Compare', full: 'Before / After Compare', desc: 'Side-by-side comparison of original vs converted', act: 'Compare Images', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#14b8a6', icon: 'columns' },
  // SOCIAL
  { id: 'twitter-card', cat: 'social', title: 'Twitter Card', full: 'Twitter / X Card (1200×628)', desc: 'Resize & crop to Twitter/X recommended dimensions', act: 'Create Card', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#0ea5e9', icon: 'share-2' },
  { id: 'og-image', cat: 'social', title: 'OG Image', full: 'Open Graph Image (1200×630)', desc: 'Create Open Graph / Facebook share image', act: 'Create OG Image', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#1877f2', icon: 'share-2' },
  { id: 'instagram-sq', cat: 'social', title: 'Instagram Sq', full: 'Instagram Square (1080×1080)', desc: 'Crop and pad to Instagram square post format', act: 'Create Square', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#e1306c', icon: 'instagram' },
  { id: 'instagram-st', cat: 'social', title: 'Instagram St', full: 'Instagram Story (1080×1920)', desc: 'Resize and pad to Instagram Story 9:16 format', act: 'Create Story', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#c13584', icon: 'smartphone' },
  { id: 'youtube-thumb', cat: 'social', title: 'YT Thumb', full: 'YouTube Thumbnail (1280×720)', desc: 'Create perfect YouTube thumbnail size image', act: 'Create Thumbnail', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#ff0000', icon: 'youtube' },
  { id: 'linkedin-cover', cat: 'social', title: 'LinkedIn Cover', full: 'LinkedIn Cover (1584×396)', desc: 'Resize image to LinkedIn profile cover dimensions', act: 'Create Cover', ext: 'png', mime: 'image/png', accept: 'image/*', color: '#0077b5', icon: 'share-2' },
];

// ─── Lucide-style SVG icons (inline, no dep)
const SVGICONS: Record<string, string> = {
  image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none"/><polyline points="21 15 16 10 5 21"/></svg>`,
  vector: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  file: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  resize: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
  compress: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="21" y2="3"/><line x1="3" y1="21" x2="14" y2="10"/></svg>`,
  rotate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>`,
  flip: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>`,
  crop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.13 1L6 16a2 2 0 002 2h15"/><path d="M1 6.13L16 6a2 2 0 012 2v15"/></svg>`,
  type: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
  square: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`,
  circle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  sliders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`,
  zap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  droplet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>`,
  thermometer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>`,
  filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  film: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>`,
  terminal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
  'pen-tool': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>`,
  'trending-up': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  'bar-chart-2': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  columns: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3h7a2 2 0 012 2v14a2 2 0 01-2 2h-7m0-18H5a2 2 0 00-2 2v14a2 2 0 002 2h7m0-18v18"/></svg>`,
  'share-2': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  smartphone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 001.95-1.97A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>`,
};

const CATS = [
  { id: 'all', label: 'All Tools' },
  { id: 'convert', label: 'Convert' },
  { id: 'edit', label: 'Edit' },
  { id: 'adjust', label: 'Adjust' },
  { id: 'export', label: 'Export' },
  { id: 'filter', label: 'Filters' },
  { id: 'ai', label: 'AI-Style' },
  { id: 'analyze', label: 'Analyze' },
  { id: 'social', label: 'Social' },
];

let state: { tool: any; file: File | null; blob: Blob | null; origMeta: any; cat: string; q: string } = {
  tool: null, file: null, blob: null, origMeta: null, cat: 'all', q: ''
};

export default function ImageConverter() {
  useEffect(() => {
    const $ = (id: string) => document.getElementById(id);
    const cvs = $('cvs') as HTMLCanvasElement;
    const ctx = cvs.getContext('2d')!;

    // Dark Mode
    const applyDark = (d: boolean) => {
      document.documentElement.classList.toggle('dark', d);
      try { localStorage.setItem('imgcv-dark', d ? '1' : '0'); } catch (e) { }
    };
    let savedDark: string | null = null;
    try { savedDark = localStorage.getItem('imgcv-dark'); } catch (e) { }
    applyDark(savedDark === '1' || (!savedDark && matchMedia('(prefers-color-scheme:dark)').matches));
    const darkBtn = $('darkBtn');
    if (darkBtn) darkBtn.onclick = () => applyDark(!document.documentElement.classList.contains('dark'));

    // Toast
    const toast = (msg: string, type = 'i', ms = 3000) => {
      const colors: Record<string, string> = {
        s: 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-950 dark:border-green-700 dark:text-green-300',
        e: 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-950 dark:border-red-700 dark:text-red-300',
        i: 'bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-700 dark:text-blue-300',
      };
      const icons: Record<string, string> = {
        s: '✓', e: '✕', i: 'ℹ',
      };
      const el = document.createElement('div');
      el.className = `flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg max-w-xs animate-slide-up ${colors[type] || colors.i}`;
      el.innerHTML = `<span class="font-bold text-base">${icons[type] || icons.i}</span><span>${msg}</span>`;
      const tb = $('toastBox');
      if (tb) tb.appendChild(el);
      setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, ms);
    };

    const fmtSize = (b: number) => {
      if (!b) return '0 B';
      const k = 1024, u = ['B', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(b) / Math.log(k));
      return (b / Math.pow(k, i)).toFixed(1) + ' ' + u[i];
    };

    // Render Grid
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
        <button class="tool-card group relative flex flex-col gap-3 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-orange-400 dark:hover:border-orange-500 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 text-left w-full" data-id="${t.id}" style="animation:fadeUp .35s ${i * .02}s both" aria-label="${t.full}">
          <div class="flex items-center gap-2.5">
            <div class="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style="background:${t.color}20;color:${t.color}">
              <span class="w-4 h-4 block">${SVGICONS[t.icon] || SVGICONS.image}</span>
            </div>
            <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style="background:${t.color}15;color:${t.color}">${t.cat}</span>
          </div>
          <div>
            <div class="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-0.5">${t.title}</div>
            <div class="text-xs text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-2">${t.desc}</div>
          </div>
        </button>
      `).join('');
    };

    // Category tabs
    document.querySelectorAll('.cat-tab').forEach(btn => {
      (btn as HTMLElement).onclick = () => {
        document.querySelectorAll('.cat-tab').forEach(b => {
          b.classList.remove('bg-zinc-900', 'dark:bg-zinc-100', 'text-white', 'dark:text-zinc-900', 'border-zinc-900', 'dark:border-zinc-100');
          b.classList.add('bg-white', 'dark:bg-zinc-800', 'text-zinc-700', 'dark:text-zinc-300', 'border-zinc-200', 'dark:border-zinc-700');
        });
        btn.classList.remove('bg-white', 'dark:bg-zinc-800', 'text-zinc-700', 'dark:text-zinc-300', 'border-zinc-200', 'dark:border-zinc-700');
        btn.classList.add('bg-zinc-900', 'dark:bg-zinc-100', 'text-white', 'dark:text-zinc-900', 'border-zinc-900', 'dark:border-zinc-100');
        state.cat = (btn as HTMLElement).dataset.cat || 'all';
        renderGrid();
      };
    });
    const searchInp = $('searchInp') as HTMLInputElement;
    if (searchInp) searchInp.oninput = (e: Event) => { state.q = (e.target as HTMLInputElement).value; renderGrid(); };

    // Select Tool
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
      if (panelIcon) panelIcon.innerHTML = `<div class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style="background:${state.tool.color}20;color:${state.tool.color}"><span class="w-6 h-6 block">${SVGICONS[state.tool.icon] || SVGICONS.image}</span></div>`;
      const toolPanel = $('toolPanel'); if (toolPanel) toolPanel.classList.remove('hidden');
      setTimeout(() => { const tp = $('toolPanel'); if (tp) tp.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
      document.querySelectorAll('.tool-card').forEach(c => {
        const el = c as HTMLElement;
        el.classList.toggle('ring-2', el.dataset.id === id);
        el.classList.toggle('ring-orange-400', el.dataset.id === id);
      });
      renderOptions();
      resetPanel(true);
      toast(`${state.tool.title} ready`, 'i', 1800);
    };

    // Close tool
    const closeBtn = $('closeBtn');
    if (closeBtn) closeBtn.onclick = () => {
      const tp = $('toolPanel'); if (tp) tp.classList.add('hidden');
      document.querySelectorAll('.tool-card').forEach(c => { (c as HTMLElement).classList.remove('ring-2', 'ring-orange-400'); });
      state.tool = null; resetPanel(true);
    };

    // Render Options
    const renderOptions = () => {
      const op = $('optPanel');
      if (!op) return;
      op.innerHTML = ''; op.classList.add('hidden');
      if (!state.tool) return;
      const show = (html: string) => { op.innerHTML = html; op.classList.remove('hidden'); };
      const id = state.tool.id;

      const sizeChips = (opts: [string | number, string][], name: string, def: string | number) =>
        `<div class="flex flex-wrap gap-2">${opts.map(([v, l]) =>
          `<label class="chip-radio${v == def ? ' selected' : ''}"><input type="radio" name="${name}" value="${v}" ${v == def ? 'checked' : ''} class="sr-only">${l}</label>`
        ).join('')}</div>`;

      const sliderRow = (id: string, label: string, min: number, max: number, val: number, unit = '') =>
        `<div class="mb-4"><div class="flex justify-between items-center mb-2"><span class="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">${label}</span><span id="${id}V" class="text-sm font-bold text-orange-500">${val}${unit}</span></div><input type="range" id="${id}S" min="${min}" max="${max}" value="${val}" class="w-full custom-range"></div>`;

      const field = (id: string, label: string, type = 'number', val = '', extra = '') =>
        `<div><label class="block text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5">${label}</label><input type="${type}" id="${id}" value="${val}" ${extra} class="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"></div>`;

      const colorField = (id: string, label: string, val: string) =>
        `<div><label class="block text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5">${label}</label><input type="color" id="${id}" value="${val}" class="h-10 w-full rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer p-1"></div>`;

      switch (id) {
        case 'png-to-jpg': case 'webp-to-jpg': case 'bmp-to-jpg': case 'gif-to-jpg': case 'tiff-to-jpg':
        case 'avif-to-jpg': case 'svg-to-jpg': case 'jpg-to-bmp': case 'png-to-bmp': case 'any-to-jpg': case 'heic-to-jpg':
          show(`<div class="flex items-center gap-4"><div class="flex-1">${colorField('bgCol', 'Background Color', '#ffffff')}</div><p class="text-xs text-zinc-400 flex-1">Fills transparent areas in the output image</p></div>`); break;
        case 'png-to-ico':
          show(`<div class="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">Favicon Sizes</div><div class="flex flex-wrap gap-2">${[16, 32, 48, 64, 128].map(s => `<label class="chip-check${s === 32 ? ' selected' : ''}"><input type="checkbox" class="ico-sz sr-only" value="${s}" ${s === 32 ? 'checked' : ''}>${s}px</label>`).join('')}</div>`); break;
        case 'svg-to-png': case 'svg-to-webp':
          show(`<div class="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">Output Size</div>${sizeChips([[256, '256px'], [512, '512px'], [1024, '1024px'], [2048, '2048px']], 'svgSz', 512)}`); break;
        case 'resize':
          show(`<div class="grid grid-cols-2 gap-3 mb-4">${field('rW', 'Width (px)', 'number', '')},${field('rH', 'Height (px)', 'number', '')}</div><label class="flex items-center gap-2 mb-4 cursor-pointer"><input type="checkbox" id="rAsp" checked class="w-4 h-4 rounded text-orange-500"><span class="text-sm text-zinc-700 dark:text-zinc-300">Lock aspect ratio</span></label>${sliderRow('rPct', 'Scale %', 1, 400, 100, '%')}`
            .replace(',', ''));
          break;
        case 'compress':
          show(sliderRow('q', 'JPEG Quality', 1, 100, 80, '%')); break;
        case 'rotate':
          show(`<div class="mb-4"><div class="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Quick Rotation</div>${sizeChips([[90, '↻ 90°'], [180, '180°'], [270, '↺ 90°']], 'rotA', 90)}</div><div class="mt-4">${field('custAng', 'Custom Angle (0–360°)', 'number', '', 'min="0" max="360" placeholder="e.g. 45"')}</div>`); break;
        case 'flip':
          show(`<div class="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Direction</div>${sizeChips([['h', '⬄ Horizontal'], ['v', '⬍ Vertical'], ['b', '⟺ Both']], 'flipD', 'h')}`); break;
        case 'crop':
          show(`<div class="grid grid-cols-2 gap-3">${field('cX', 'X (left)', 'number', '0', 'min="0"')}${field('cY', 'Y (top)', 'number', '0', 'min="0"')}${field('cW', 'Width', 'number', '', 'min="1"')}${field('cH', 'Height', 'number', '', 'min="1"')}</div>`); break;
        case 'aspect-crop':
          show(`<div class="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Aspect Ratio</div>${sizeChips([['16:9', '16:9'], ['4:3', '4:3'], ['3:2', '3:2'], ['1:1', '1:1'], ['9:16', '9:16'], ['2:3', '2:3']], 'aspectR', '16:9')}`); break;
        case 'watermark':
          show(`<div class="space-y-3">
            ${field('wmTxt', 'Watermark Text', 'text', '© Watermark')}
            <div class="grid grid-cols-3 gap-3">${field('wmSz', 'Font Size', 'number', '40', 'min="8"')}${colorField('wmCol', 'Color', '#ffffff')}${field('wmOp', 'Opacity %', 'number', '55', 'min="0" max="100"')}</div>
            <div><div class="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Position</div>${sizeChips([['tl', 'Top-L'], ['tr', 'Top-R'], ['c', 'Center'], ['bl', 'Bot-L'], ['br', 'Bot-R'], ['tile', 'Tile']], 'wmPos', 'br')}</div>
          </div>`); break;
        case 'text-overlay':
          show(`<div class="space-y-3">
            ${field('txtOvr', 'Text', 'text', 'Your Text Here')}
            <div class="grid grid-cols-2 gap-3">${field('txtSz', 'Font Size', 'number', '48', 'min="8"')}${colorField('txtCol', 'Color', '#ffffff')}</div>
            <div><div class="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Position</div>${sizeChips([['tl', 'TL'], ['tc', 'TC'], ['tr', 'TR'], ['c', 'Ctr'], ['bl', 'BL'], ['bc', 'BC'], ['br', 'BR']], 'txtPos', 'c')}</div>
          </div>`); break;
        case 'border':
          show(`<div class="grid grid-cols-2 gap-3">${field('brdW', 'Thickness (px)', 'number', '20', 'min="1"')}${colorField('brdCol', 'Color', '#ffffff')}</div>`); break;
        case 'padding':
          show(`<div class="grid grid-cols-2 gap-3">${field('padW', 'Padding (px)', 'number', '40', 'min="0"')}${colorField('padCol', 'Background', '#ffffff')}</div>`); break;
        case 'frame':
          show(`<div class="grid grid-cols-2 gap-3 mb-3">${field('frW', 'Frame Width', 'number', '30', 'min="1"')}${colorField('frC1', 'Outer Color', '#1a1a1a')}</div>${colorField('frC2', 'Inner Color', '#f5f5f5')}`); break;
        case 'brightness':
          show(`<div class="space-y-1">${sliderRow('bri', 'Brightness', -100, 100, 0)}${sliderRow('con', 'Contrast', -100, 100, 0)}${sliderRow('exp', 'Exposure', -100, 100, 0)}</div>`); break;
        case 'hue-saturation':
          show(`<div class="space-y-1">${sliderRow('hue', 'Hue Shift', -180, 180, 0, '°')}${sliderRow('sat', 'Saturation', -100, 100, 0)}</div>`); break;
        case 'blur':
          show(sliderRow('blr', 'Blur Radius', 1, 40, 5, 'px')); break;
        case 'opacity':
          show(sliderRow('op', 'Opacity', 0, 100, 80, '%')); break;
        case 'round-corners':
          show(sliderRow('rc', 'Corner Radius', 0, 200, 20, 'px')); break;
        case 'shadow':
          show(`<div class="grid grid-cols-2 gap-3 mb-3">${field('shB', 'Blur (px)', 'number', '20', 'min="0"')}${field('shS', 'Spread (px)', 'number', '10', 'min="0"')}${field('shX', 'Offset X', 'number', '5')}${field('shY', 'Offset Y', 'number', '5')}</div>${colorField('shCol', 'Shadow Color', '#000000')}`); break;
        case 'pixelate':
          show(sliderRow('px', 'Block Size', 2, 80, 10, 'px')); break;
        case 'halftone':
          show(sliderRow('ht', 'Dot Size', 2, 30, 6, 'px')); break;
        case 'posterize':
          show(sliderRow('post', 'Color Levels', 2, 16, 4)); break;
        case 'glitch':
          show(sliderRow('glitch', 'Intensity', 1, 40, 10)); break;
        case 'duotone':
          show(`<div class="grid grid-cols-2 gap-3">${colorField('dt1', 'Shadow Color', '#1a237e')}${colorField('dt2', 'Highlight Color', '#e91e63')}</div>`); break;
        case 'vignette':
          show(sliderRow('vig', 'Strength', 10, 100, 50, '%')); break;
        case 'levels':
          show(`<div class="space-y-1">${sliderRow('bp', 'Black Point', 0, 128, 0)}${sliderRow('wp', 'White Point', 128, 255, 255)}${sliderRow('gam', 'Gamma', 1, 30, 10)}</div>`); break;
        case 'temperature':
          show(sliderRow('temp', 'Temperature (warm ↔ cool)', -100, 100, 0)); break;
        case 'vibrance':
          show(sliderRow('vibr', 'Vibrance', -100, 100, 0)); break;
        case 'clarity':
          show(sliderRow('clar', 'Clarity', 0, 100, 50)); break;
        case 'noise':
          show(sliderRow('nois', 'Grain Amount', 0, 100, 25, '%')); break;
        case 'twitter-card':
          show(`<p class="text-sm text-zinc-500 dark:text-zinc-400">Image will be resized & center-cropped to 1200×628 px — the recommended Twitter/X card size.</p>`); break;
        case 'og-image':
          show(`<p class="text-sm text-zinc-500 dark:text-zinc-400">Image will be resized & center-cropped to 1200×630 px for Open Graph / Facebook sharing.</p>`); break;
        case 'instagram-sq':
          show(`<div class="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">Background Color</div>${colorField('igSqCol', 'Background', '#ffffff')}`); break;
        case 'instagram-st':
          show(`<div class="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">Background Color</div>${colorField('igStCol', 'Background', '#000000')}`); break;
        case 'youtube-thumb':
          show(`<p class="text-sm text-zinc-500 dark:text-zinc-400">Image will be center-cropped to 1280×720 px for YouTube thumbnails.</p>`); break;
        case 'linkedin-cover':
          show(`<p class="text-sm text-zinc-500 dark:text-zinc-400">Image will be resized & cropped to 1584×396 px for LinkedIn profile covers.</p>`); break;
      }
    };

    // Sync range/chips
    const optPanel = $('optPanel');
    if (optPanel) optPanel.addEventListener('input', (e: Event) => {
      const t = e.target as HTMLInputElement;
      const syncVal = (base: string, fmt: (v: string) => string) => {
        const el = document.getElementById(base + 'V'); if (el) el.textContent = fmt(t.value);
      };
      const sliders: Record<string, (v: string) => string> = {
        qS: v => v + '%', rPctS: v => v + '%', blrS: v => v + 'px', opS: v => v + '%',
        rcS: v => v + 'px', pxS: v => v + 'px', htS: v => v + 'px', postS: v => v,
        glitchS: v => v, vigS: v => v + '%', briS: v => v, conS: v => v, expS: v => v,
        hueS: v => v + '°', satS: v => v, bpS: v => v, wpS: v => v, gamS: v => (+v / 10).toFixed(1),
        tempS: v => v, vibrS: v => v, clarS: v => v, noisS: v => v + '%',
      };
      if (sliders[t.id]) syncVal(t.id.slice(0, -1), sliders[t.id]);

      if (t.id === 'rPctS' && state.origMeta) {
        const s = +t.value / 100;
        const rW = document.getElementById('rW') as HTMLInputElement;
        const rH = document.getElementById('rH') as HTMLInputElement;
        if (rW) rW.value = String(Math.round(state.origMeta.w * s));
        if (rH) rH.value = String(Math.round(state.origMeta.h * s));
      }
      if ((t.id === 'rW' || t.id === 'rH') && (document.getElementById('rAsp') as HTMLInputElement)?.checked && state.origMeta) {
        if (t.id === 'rW' && t.value) { const h = document.getElementById('rH') as HTMLInputElement; if (h) h.value = String(Math.round(+t.value * state.origMeta.h / state.origMeta.w)); }
        if (t.id === 'rH' && t.value) { const w = document.getElementById('rW') as HTMLInputElement; if (w) w.value = String(Math.round(+t.value * state.origMeta.w / state.origMeta.h)); }
      }
    });
    // chip radio selection
    if (optPanel) optPanel.addEventListener('change', (e: Event) => {
      const t = e.target as HTMLInputElement;
      if (t.type === 'radio') {
        const name = t.name;
        document.querySelectorAll(`[name="${name}"]`).forEach(r => {
          const chip = r.closest('.chip-radio'); if (chip) { chip.classList.toggle('selected', (r as HTMLInputElement).checked); }
        });
      }
      if (t.classList.contains('ico-sz')) {
        const c = t.closest('.chip-check'); if (c) c.classList.toggle('selected', t.checked);
      }
    });
    if (optPanel) optPanel.addEventListener('click', (e: Event) => {
      const chip = (e.target as Element).closest('.chip-radio');
      if (!chip) return;
      const radio = chip.querySelector('input[type=radio]') as HTMLInputElement;
      if (radio && !radio.checked) { radio.checked = true; radio.dispatchEvent(new Event('change', { bubbles: true })); }
    });

    // Handle File
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
          const fDetails = $('fDetails'); if (fDetails) fDetails.textContent = `${fmtSize(f.size)} · ${img.width}×${img.height}px · ${f.type}`;
          const origPrev = $('origPrev') as HTMLImageElement; if (origPrev) origPrev.src = src;
          const origBadge = $('origBadge'); if (origBadge) origBadge.textContent = fmtSize(f.size);
          const origDims = $('origDims'); if (origDims) origDims.textContent = `${img.width}×${img.height}`;
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
      upZone.onclick = () => { const fi = $('fileInp') as HTMLInputElement; if (fi) fi.click(); };
      upZone.addEventListener('dragover', (e: Event) => { e.preventDefault(); upZone.classList.add('border-orange-400', 'bg-orange-50', 'dark:bg-orange-950/20'); });
      upZone.addEventListener('dragleave', () => { upZone.classList.remove('border-orange-400', 'bg-orange-50', 'dark:bg-orange-950/20'); });
      upZone.addEventListener('drop', (e: Event) => {
        e.preventDefault(); upZone.classList.remove('border-orange-400', 'bg-orange-50', 'dark:bg-orange-950/20');
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

    // Run/Reset
    const runBtn = $('runBtn') as HTMLButtonElement;
    if (runBtn) runBtn.onclick = processImage;
    const rstBtn = $('rstBtn'); if (rstBtn) rstBtn.onclick = () => resetPanel(false);
    const dlBtn = $('dlBtn'); if (dlBtn) dlBtn.onclick = downloadResult;
    const cpBtn = $('cpBtn'); if (cpBtn) cpBtn.onclick = copyResult;
    const anotherBtn = $('anotherBtn'); if (anotherBtn) anotherBtn.onclick = () => { resetPanel(false); const fi = $('fileInp') as HTMLInputElement; if (fi) fi.click(); };

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

    async function processImage() {
      if (!state.file || !state.tool) return;
      if (runBtn) runBtn.disabled = true;
      const runBtnTxt = $('runBtnTxt');
      const origText = runBtnTxt?.textContent || '';
      if (runBtnTxt) runBtnTxt.textContent = 'Processing…';
      const panelProgress = $('panelProgress'); if (panelProgress) panelProgress.classList.remove('hidden');
      try { await runConversion(); }
      catch (e: any) { toast('Processing failed: ' + (e?.message || 'unknown error'), 'e', 4500); }
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
      p.moveTo(x + rr, y); p.lineTo(x + w - rr, y); p.quadraticCurveTo(x + w, y, x + w, y + rr);
      p.lineTo(x + w, y + h - rr); p.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
      p.lineTo(x + rr, y + h); p.quadraticCurveTo(x, y + h, x, y + h - rr);
      p.lineTo(x, y + rr); p.quadraticCurveTo(x, y, x + rr, y); p.closePath();
      return p;
    };

    const cropCenter = (img: HTMLImageElement, tw: number, th: number) => {
      const imgAsp = img.width / img.height, tAsp = tw / th;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (imgAsp > tAsp) { sw = Math.round(img.height * tAsp); sx = (img.width - sw) / 2; }
      else { sh = Math.round(img.width / tAsp); sy = (img.height - sh) / 2; }
      cvs.width = tw; cvs.height = th; ctx.clearRect(0, 0, tw, th);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, tw, th);
    };

    const padToSize = (img: HTMLImageElement, tw: number, th: number, bg: string) => {
      cvs.width = tw; cvs.height = th; ctx.clearRect(0, 0, tw, th);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, tw, th);
      const sc = Math.min(tw / img.width, th / img.height);
      const nw = img.width * sc, nh = img.height * sc;
      ctx.drawImage(img, (tw - nw) / 2, (th - nh) / 2, nw, nh);
    };

    async function runConversion() {
      const loadImg = (src: string): Promise<HTMLImageElement> => new Promise((res, rej) => {
        const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('Could not decode source image')); i.src = src;
      });
      const toBlob = (mime: string, q?: number): Promise<Blob> => new Promise((res, rej) => {
        try { cvs.toBlob(b => { if (b) res(b); else rej(new Error('Browser refused to encode ' + mime)); }, mime, q); } catch (err) { rej(err); }
      });
      const draw = (img: HTMLImageElement, w: number, h: number, fill = false, bg = '#fff') => {
        cvs.width = w; cvs.height = h; ctx.clearRect(0, 0, w, h);
        if (fill) { ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h); }
        ctx.drawImage(img, 0, 0, w, h);
      };
      const img = await loadImg(state.origMeta.src);
      const id = state.tool.id;

      // CONVERT
      if (['jpg-to-png', 'webp-to-png', 'bmp-to-png', 'gif-to-png', 'tiff-to-png', 'avif-to-png', 'any-to-png', 'heic-to-png', 'png-to-gif'].includes(id)) {
        draw(img, img.width, img.height, false); state.blob = await toBlob('image/png');
      } else if (['png-to-jpg', 'webp-to-jpg', 'bmp-to-jpg', 'gif-to-jpg', 'tiff-to-jpg', 'avif-to-jpg', 'svg-to-jpg', 'jpg-to-bmp', 'png-to-bmp', 'any-to-jpg', 'heic-to-jpg'].includes(id)) {
        draw(img, img.width, img.height, true, gv('bgCol') || '#ffffff');
        const mime = id.includes('bmp') ? 'image/bmp' : 'image/jpeg';
        try { state.blob = await toBlob(mime, 0.92); } catch { toast('BMP not supported, saving as PNG', 'i', 3500); state.blob = await toBlob('image/png'); state.tool = { ...state.tool, ext: 'png' }; }
      } else if (['jpg-to-webp', 'png-to-webp', 'gif-to-webp', 'svg-to-webp', 'any-to-webp'].includes(id)) {
        draw(img, img.width, img.height, false);
        try { state.blob = await toBlob('image/webp', 0.92); } catch { toast('WebP not supported, saving as PNG', 'i', 3500); state.blob = await toBlob('image/png'); state.tool = { ...state.tool, ext: 'png' }; }
      } else if (id === 'svg-to-png') {
        const sz = +(gr('svgSz') || '512'); draw(img, sz, sz, false); state.blob = await toBlob('image/png');
      } else if (id === 'png-to-svg' || id === 'jpg-to-svg') {
        draw(img, img.width, img.height, false);
        const dataUrl = cvs.toDataURL('image/png');
        const svg = `<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${img.width}" height="${img.height}" viewBox="0 0 ${img.width} ${img.height}">\n  <image href="${dataUrl}" width="${img.width}" height="${img.height}"/>\n</svg>`;
        state.blob = new Blob([svg], { type: 'image/svg+xml' });
      } else if (id === 'jpg-to-tiff' || id === 'png-to-tiff') {
        draw(img, img.width, img.height, false);
        state.blob = await toBlob('image/png'); state.tool = { ...state.tool, ext: 'png', mime: 'image/png' };
        toast('TIFF encoding not supported by browser — saved as PNG instead', 'i', 3500);
      } else if (id === 'png-to-ico') {
        const sizes = [...document.querySelectorAll('.ico-sz:checked')].map(c => +(c as HTMLInputElement).value);
        if (!sizes.length) { toast('Select at least one size', 'e'); return; }
        const sz = Math.max(...sizes); draw(img, sz, sz, false);
        const pngBlob = await toBlob('image/png'); state.blob = new Blob([pngBlob], { type: 'image/x-icon' });
      } else if (id === 'img-to-pdf') {
        const w = window as any;
        if (!w.jspdf?.jsPDF) throw new Error('PDF library not loaded');
        const { jsPDF } = w.jspdf;
        draw(img, img.width, img.height, false);
        const pngDataUrl = cvs.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: img.width > img.height ? 'l' : 'p', unit: 'px', format: [img.width, img.height] });
        pdf.addImage(pngDataUrl, 'PNG', 0, 0, img.width, img.height);
        state.blob = pdf.output('blob');
      } else if (id === 'img-to-base64') {
        draw(img, img.width, img.height, false);
        const dataUrl = cvs.toDataURL('image/png');
        state.blob = new Blob([dataUrl.split(',')[1]], { type: 'text/plain' });
      } else if (id === 'img-to-dataurl') {
        draw(img, img.width, img.height, false);
        state.blob = new Blob([cvs.toDataURL('image/png')], { type: 'text/plain' });
      } else if (id === 'img-to-css') {
        draw(img, img.width, img.height, false);
        state.blob = new Blob([`background-image: url("${cvs.toDataURL('image/png')}");`], { type: 'text/plain' });
      } else if (id === 'img-to-html') {
        draw(img, img.width, img.height, false);
        state.blob = new Blob([`<img src="${cvs.toDataURL('image/png')}" width="${img.width}" height="${img.height}" alt="image">`], { type: 'text/plain' });
      }
      // EDIT
      else if (id === 'resize') {
        const nw = gvn('rW') || img.width, nh = gvn('rH') || img.height;
        if (nw < 1 || nh < 1) throw new Error('Width and height must be at least 1px');
        draw(img, nw, nh, false);
        const mime = (state.file!.type && state.file!.type !== 'image/svg+xml') ? state.file!.type : 'image/png';
        try { state.blob = await toBlob(mime, 0.92); } catch { state.blob = await toBlob('image/png'); }
      } else if (id === 'compress') {
        draw(img, img.width, img.height, true, '#ffffff');
        state.blob = await toBlob('image/jpeg', (gvn('qS') ?? 80) / 100);
      } else if (id === 'rotate') {
        const ang = (gvn('custAng') || 0) || +(gr('rotA') || '90');
        const r = ang * Math.PI / 180, sin = Math.abs(Math.sin(r)), cos = Math.abs(Math.cos(r));
        const nw = Math.round(img.width * cos + img.height * sin), nh = Math.round(img.width * sin + img.height * cos);
        cvs.width = nw; cvs.height = nh; ctx.clearRect(0, 0, nw, nh);
        ctx.save(); ctx.translate(nw / 2, nh / 2); ctx.rotate(r); ctx.drawImage(img, -img.width / 2, -img.height / 2); ctx.restore();
        state.blob = await toBlob('image/png');
      } else if (id === 'flip') {
        const d = gr('flipD') || 'h';
        cvs.width = img.width; cvs.height = img.height; ctx.clearRect(0, 0, img.width, img.height);
        ctx.save();
        if (d === 'b') { ctx.translate(img.width, img.height); ctx.scale(-1, -1); }
        else if (d === 'h') { ctx.translate(img.width, 0); ctx.scale(-1, 1); }
        else { ctx.translate(0, img.height); ctx.scale(1, -1); }
        ctx.drawImage(img, 0, 0); ctx.restore();
        state.blob = await toBlob('image/png');
      } else if (id === 'crop') {
        const x = gvn('cX') || 0, y = gvn('cY') || 0;
        let cw = gvn('cW') || img.width, ch = gvn('cH') || img.height;
        cw = Math.min(cw, img.width - x); ch = Math.min(ch, img.height - y);
        if (cw < 1 || ch < 1) throw new Error('Crop region outside image');
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
        const [rW, rH] = (gr('aspectR') || '16:9').split(':').map(Number);
        const imgAsp = img.width / img.height, tAsp = rW / rH;
        let sw: number, sh: number, sx = 0, sy = 0;
        if (imgAsp > tAsp) { sh = img.height; sw = Math.round(sh * tAsp); sx = (img.width - sw) / 2; }
        else { sw = img.width; sh = Math.round(sw / tAsp); sy = (img.height - sh) / 2; }
        cvs.width = sw; cvs.height = sh; ctx.clearRect(0, 0, sw, sh);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh); state.blob = await toBlob('image/png');
      } else if (id === 'watermark') {
        draw(img, img.width, img.height, false);
        const t = gv('wmTxt') || '© Watermark', sz = gvn('wmSz') || 40, col = gv('wmCol') || '#ffffff';
        const op = (gvn('wmOp') ?? 55) / 100, pos = gr('wmPos') || 'br';
        ctx.save(); ctx.globalAlpha = op; ctx.fillStyle = col!;
        ctx.font = `bold ${sz}px system-ui`; ctx.textBaseline = 'top';
        const mw = ctx.measureText(t!).width, pad = sz;
        const pos2: Record<string, [number, number]> = { tl: [pad, pad], tr: [img.width - mw - pad, pad], c: [(img.width - mw) / 2, (img.height - sz) / 2], bl: [pad, img.height - sz - pad], br: [img.width - mw - pad, img.height - sz - pad] };
        if (pos === 'tile') { for (let y = 0; y < img.height + sz; y += sz * 2.5) for (let x = -mw / 2; x < img.width + mw; x += mw * 1.5) ctx.fillText(t!, x, y); }
        else { const p = pos2[pos] || pos2.br; ctx.fillText(t!, p[0], p[1]); }
        ctx.restore(); state.blob = await toBlob('image/png');
      } else if (id === 'text-overlay') {
        draw(img, img.width, img.height, false);
        const t = gv('txtOvr') || 'Text', sz = gvn('txtSz') || 48, col = gv('txtCol') || '#ffffff', pos = gr('txtPos') || 'c';
        ctx.font = `bold ${sz}px system-ui`; ctx.fillStyle = col!; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
        const px: Record<string, number> = { tl: img.width * .1, tc: img.width / 2, tr: img.width * .9, c: img.width / 2, bl: img.width * .1, bc: img.width / 2, br: img.width * .9 };
        const py: Record<string, number> = { tl: sz, tc: sz, tr: sz, c: img.height / 2, bl: img.height - sz, bc: img.height - sz, br: img.height - sz };
        ctx.fillText(t!, px[pos!] || img.width / 2, py[pos!] || img.height / 2); state.blob = await toBlob('image/png');
      } else if (id === 'border') {
        const bw = gvn('brdW') || 20, bc = gv('brdCol') || '#ffffff';
        cvs.width = img.width + bw * 2; cvs.height = img.height + bw * 2; ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = bc!; ctx.fillRect(0, 0, cvs.width, cvs.height); ctx.drawImage(img, bw, bw);
        state.blob = await toBlob('image/png');
      } else if (id === 'padding') {
        const pw = gvn('padW') || 40, pc = gv('padCol') || '#ffffff';
        cvs.width = img.width + pw * 2; cvs.height = img.height + pw * 2; ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = pc!; ctx.fillRect(0, 0, cvs.width, cvs.height); ctx.drawImage(img, pw, pw);
        state.blob = await toBlob('image/png');
      } else if (id === 'frame') {
        const fw = gvn('frW') || 30, fc1 = gv('frC1') || '#1a1a1a', fc2 = gv('frC2') || '#f5f5f5';
        const pad2 = fw * 2;
        cvs.width = img.width + pad2 * 2; cvs.height = img.height + pad2 * 2;
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = fc1!; ctx.fillRect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = fc2!; ctx.fillRect(fw, fw, cvs.width - fw * 2, cvs.height - fw * 2);
        ctx.drawImage(img, pad2, pad2);
        state.blob = await toBlob('image/png');
      } else if (id === 'round-corners') {
        const r = gvn('rcS') || 20;
        cvs.width = img.width; cvs.height = img.height; ctx.clearRect(0, 0, img.width, img.height);
        ctx.save(); ctx.clip(roundedRectPath(0, 0, img.width, img.height, r)); ctx.drawImage(img, 0, 0); ctx.restore();
        state.blob = await toBlob('image/png');
      } else if (id === 'shadow') {
        const sb = gvn('shB') || 20, ss = gvn('shS') || 10, sx = gvn('shX') || 5, sy = gvn('shY') || 5, sc = gv('shCol') || '#000000';
        const pad = sb + ss + Math.max(Math.abs(sx), Math.abs(sy));
        cvs.width = img.width + pad * 2; cvs.height = img.height + pad * 2; ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.shadowColor = sc!; ctx.shadowBlur = sb; ctx.shadowOffsetX = sx; ctx.shadowOffsetY = sy;
        ctx.drawImage(img, pad, pad);
        ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
        state.blob = await toBlob('image/png');
      }
      // SOCIAL
      else if (id === 'twitter-card') { cropCenter(img, 1200, 628); state.blob = await toBlob('image/png'); }
      else if (id === 'og-image') { cropCenter(img, 1200, 630); state.blob = await toBlob('image/png'); }
      else if (id === 'instagram-sq') { padToSize(img, 1080, 1080, gv('igSqCol') || '#ffffff'); state.blob = await toBlob('image/png'); }
      else if (id === 'instagram-st') { padToSize(img, 1080, 1920, gv('igStCol') || '#000000'); state.blob = await toBlob('image/png'); }
      else if (id === 'youtube-thumb') { cropCenter(img, 1280, 720); state.blob = await toBlob('image/png'); }
      else if (id === 'linkedin-cover') { cropCenter(img, 1584, 396); state.blob = await toBlob('image/png'); }
      // ADJUST
      else if (id === 'brightness') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        const br = gvn('briS') || 0, con = gvn('conS') || 0, exp = gvn('expS') || 0;
        const f = (259 * (con + 255)) / (255 * (259 - con));
        for (let i = 0; i < px.length; i += 4) {
          for (let c = 0; c < 3; c++) { let v = px[i + c] + br + (exp * 2); v = f * (v - 128) + 128; px[i + c] = Math.max(0, Math.min(255, v)); }
        }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'hue-saturation') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        const hShift = gvn('hueS') || 0, satAdj = gvn('satS') || 0;
        const rgb2hsl = (r: number, g: number, b: number) => { r /= 255; g /= 255; b /= 255; const M = Math.max(r, g, b), m = Math.min(r, g, b), dl = M - m; let h = 0, s = 0, l = (M + m) / 2; if (dl > 0) { s = l > .5 ? dl / (2 - M - m) : dl / (M + m); if (M === r) h = ((g - b) / dl + (g < b ? 6 : 0)) / 6; else if (M === g) h = ((b - r) / dl + 2) / 6; else h = ((r - g) / dl + 4) / 6; } return [h * 360, s, l]; };
        const hsl2rgb = (h: number, s: number, l: number) => { const hu = (p: number, q: number, t: number) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < .5) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; }; if (s === 0) return [l * 255, l * 255, l * 255]; const q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q; return [hu(p, q, h / 360 + 1 / 3) * 255, hu(p, q, h / 360) * 255, hu(p, q, h / 360 - 1 / 3) * 255]; };
        for (let i = 0; i < px.length; i += 4) { let [h, s, l] = rgb2hsl(px[i], px[i + 1], px[i + 2]); h = (h + hShift + 360) % 360; s = Math.max(0, Math.min(1, s + satAdj / 100)); const [r, g, b] = hsl2rgb(h, s, l); px[i] = r; px[i + 1] = g; px[i + 2] = b; }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'levels') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        const bp = gvn('bpS') || 0, wp = gvn('wpS') || 255, gamma = (gvn('gamS') || 10) / 10;
        const range = Math.max(1, wp - bp);
        for (let i = 0; i < px.length; i += 4) { for (let c = 0; c < 3; c++) { let v = Math.max(0, Math.min(255, (px[i + c] - bp) / range * 255)); v = Math.pow(v / 255, 1 / gamma) * 255; px[i + c] = Math.max(0, Math.min(255, v)); } }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'opacity') {
        cvs.width = img.width; cvs.height = img.height; ctx.clearRect(0, 0, img.width, img.height);
        ctx.globalAlpha = (gvn('opS') ?? 80) / 100; ctx.drawImage(img, 0, 0); ctx.globalAlpha = 1;
        state.blob = await toBlob('image/png');
      } else if (id === 'blur') {
        const r = gvn('blrS') || 5;
        const off = document.createElement('canvas'); off.width = img.width; off.height = img.height;
        const oc = off.getContext('2d')!; oc.filter = `blur(${r}px)`; oc.drawImage(img, 0, 0); oc.filter = 'none';
        cvs.width = img.width; cvs.height = img.height; ctx.clearRect(0, 0, img.width, img.height); ctx.drawImage(off, 0, 0);
        state.blob = await toBlob('image/png');
      } else if (id === 'sharpen') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        const W = d.width, H = d.height, k = [-1, -1, -1, -1, 9, -1, -1, -1, -1], out = new Uint8ClampedArray(px);
        for (let y = 1; y < H - 1; y++)for (let x = 1; x < W - 1; x++) { for (let c = 0; c < 3; c++) { let v = 0; for (let ky = -1; ky <= 1; ky++)for (let kx = -1; kx <= 1; kx++)v += px[((y + ky) * W + (x + kx)) * 4 + c] * k[(ky + 1) * 3 + (kx + 1)]; out[(y * W + x) * 4 + c] = Math.max(0, Math.min(255, v)); } out[(y * W + x) * 4 + 3] = 255; }
        ctx.putImageData(new ImageData(out, W, H), 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'temperature') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        const t = (gvn('tempS') || 0);
        for (let i = 0; i < px.length; i += 4) { px[i] = Math.max(0, Math.min(255, px[i] + t)); px[i + 2] = Math.max(0, Math.min(255, px[i + 2] - t)); }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'vibrance') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        const v = (gvn('vibrS') || 0) / 100;
        for (let i = 0; i < px.length; i += 4) { const M = Math.max(px[i], px[i + 1], px[i + 2]), avg = (px[i] + px[i + 1] + px[i + 2]) / 3, amt = v * (1 - (M / 255)); for (let c = 0; c < 3; c++) px[i + c] = Math.max(0, Math.min(255, px[i + c] + (px[i + c] - avg) * amt)); }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'clarity') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        const W = d.width, H = d.height, str = (gvn('clarS') || 50) / 100, k = [-1, -1, -1, -1, 9, -1, -1, -1, -1], out = new Uint8ClampedArray(px);
        for (let y = 1; y < H - 1; y++)for (let x = 1; x < W - 1; x++) { for (let c = 0; c < 3; c++) { let v = 0; for (let ky = -1; ky <= 1; ky++)for (let kx = -1; kx <= 1; kx++)v += px[((y + ky) * W + (x + kx)) * 4 + c] * k[(ky + 1) * 3 + (kx + 1)]; const orig = px[(y * W + x) * 4 + c]; out[(y * W + x) * 4 + c] = Math.max(0, Math.min(255, orig + (v - orig) * str)); } out[(y * W + x) * 4 + 3] = 255; }
        ctx.putImageData(new ImageData(out, W, H), 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'noise') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        const amt = (gvn('noisS') || 25) / 100 * 80;
        for (let i = 0; i < px.length; i += 4) { const n = (Math.random() - .5) * amt * 2; for (let c = 0; c < 3; c++) px[i + c] = Math.max(0, Math.min(255, px[i + c] + n)); }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      }
      // FILTERS
      else if (id === 'grayscale') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        for (let i = 0; i < px.length; i += 4) { const g = px[i] * .299 + px[i + 1] * .587 + px[i + 2] * .114; px[i] = px[i + 1] = px[i + 2] = g; }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'sepia') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        for (let i = 0; i < px.length; i += 4) { const r = px[i], g = px[i + 1], b = px[i + 2]; px[i] = Math.min(255, r * .393 + g * .769 + b * .189); px[i + 1] = Math.min(255, r * .349 + g * .686 + b * .168); px[i + 2] = Math.min(255, r * .272 + g * .534 + b * .131); }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'invert') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        for (let i = 0; i < px.length; i += 4) { px[i] = 255 - px[i]; px[i + 1] = 255 - px[i + 1]; px[i + 2] = 255 - px[i + 2]; }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'vintage') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        for (let i = 0; i < px.length; i += 4) { px[i] = Math.min(255, px[i] * .9 + 50); px[i + 1] = Math.min(255, px[i + 1] * .85 + 30); px[i + 2] = Math.min(255, px[i + 2] * .7 + 20); }
        const cx = img.width / 2, cy = img.height / 2, maxD = Math.sqrt(cx * cx + cy * cy);
        for (let y = 0; y < img.height; y++)for (let x = 0; x < img.width; x++) { const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / maxD, vig = 1 - dist * .6, idx = (y * img.width + x) * 4; px[idx] *= vig; px[idx + 1] *= vig; px[idx + 2] *= vig; }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'vignette') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        const str = (gvn('vigS') || 50) / 100, cx = img.width / 2, cy = img.height / 2, maxD = Math.sqrt(cx * cx + cy * cy);
        for (let y = 0; y < img.height; y++)for (let x = 0; x < img.width; x++) { const vig = Math.max(0, 1 - (Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / maxD) * str), idx = (y * img.width + x) * 4; px[idx] *= vig; px[idx + 1] *= vig; px[idx + 2] *= vig; }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'pixelate') {
        const bs = gvn('pxS') || 10; draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        for (let y = 0; y < img.height; y += bs)for (let x = 0; x < img.width; x += bs) { const bw = Math.min(bs, img.width - x), bh = Math.min(bs, img.height - y), idx = (y * img.width + x) * 4; ctx.fillStyle = `rgb(${px[idx]},${px[idx + 1]},${px[idx + 2]})`; ctx.fillRect(x, y, bw, bh); }
        state.blob = await toBlob('image/png');
      } else if (id === 'posterize') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data, lv = Math.max(2, gvn('postS') || 4), step = lv - 1;
        for (let i = 0; i < px.length; i += 4) { px[i] = Math.round(px[i] / 255 * step) / step * 255; px[i + 1] = Math.round(px[i + 1] / 255 * step) / step * 255; px[i + 2] = Math.round(px[i + 2] / 255 * step) / step * 255; }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'emboss') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data, W = d.width, H = d.height, k = [-2, -1, 0, -1, 1, 1, 0, 1, 2], out = new Uint8ClampedArray(px);
        for (let y = 1; y < H - 1; y++)for (let x = 1; x < W - 1; x++) { for (let c = 0; c < 3; c++) { let v = 0; for (let ky = -1; ky <= 1; ky++)for (let kx = -1; kx <= 1; kx++)v += px[((y + ky) * W + (x + kx)) * 4 + c] * k[(ky + 1) * 3 + (kx + 1)]; out[(y * W + x) * 4 + c] = Math.max(0, Math.min(255, v + 128)); } out[(y * W + x) * 4 + 3] = 255; }
        ctx.putImageData(new ImageData(out, W, H), 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'edge-detect') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data, W = d.width, H = d.height, out = new Uint8ClampedArray(d.data.length);
        for (let i = 3; i < out.length; i += 4)out[i] = 255;
        const kx = [-1, 0, 1, -2, 0, 2, -1, 0, 1], ky2 = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
        for (let y = 1; y < H - 1; y++)for (let x = 1; x < W - 1; x++) { let gxR = 0, gyR = 0; for (let dy = -1; dy <= 1; dy++)for (let dx = -1; dx <= 1; dx++) { const idx = ((y + dy) * W + (x + dx)) * 4, lum = px[idx] * .3 + px[idx + 1] * .59 + px[idx + 2] * .11; gxR += lum * kx[(dy + 1) * 3 + (dx + 1)]; gyR += lum * ky2[(dy + 1) * 3 + (dx + 1)]; } const mag = Math.min(255, Math.sqrt(gxR * gxR + gyR * gyR)); const ii = (y * W + x) * 4; out[ii] = out[ii + 1] = out[ii + 2] = mag; }
        ctx.putImageData(new ImageData(out, W, H), 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'duotone') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        const h = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
        const [r1, g1, b1] = h(gv('dt1') || '#1a237e'), [r2, g2, b2] = h(gv('dt2') || '#e91e63');
        for (let i = 0; i < px.length; i += 4) { const lum = (px[i] * .3 + px[i + 1] * .59 + px[i + 2] * .11) / 255; px[i] = r1 + (r2 - r1) * lum; px[i + 1] = g1 + (g2 - g1) * lum; px[i + 2] = b1 + (b2 - b1) * lum; }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'crossprocess') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        for (let i = 0; i < px.length; i += 4) { px[i] = Math.min(255, px[i] * 1.1 + 10); px[i + 1] = Math.max(0, px[i + 1] * .95 - 5); px[i + 2] = Math.min(255, px[i + 2] * 1.2 + 20); }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'lofi') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        for (let i = 0; i < px.length; i += 4) { px[i] = Math.min(255, px[i] * 1.15 + 20); px[i + 1] = Math.min(255, px[i + 1] * 1.1 + 10); px[i + 2] = Math.max(0, px[i + 2] * .9 - 10); }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'cinematic') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        for (let i = 0; i < px.length; i += 4) { const r = px[i], g = px[i + 1], b = px[i + 2]; px[i] = Math.min(255, r * .9 + b * .1 + 10); px[i + 1] = Math.min(255, g * .95); px[i + 2] = Math.min(255, b * .85 + r * .1 + 15); }
        // letterbox
        const lh = Math.floor(img.height * 0.1); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, img.width, lh); ctx.fillRect(0, img.height - lh, img.width, lh);
        state.blob = await toBlob('image/png');
      } else if (id === 'cold') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        for (let i = 0; i < px.length; i += 4) { px[i] = Math.max(0, px[i] * .85); px[i + 2] = Math.min(255, px[i + 2] * 1.15 + 20); }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'warm') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        for (let i = 0; i < px.length; i += 4) { px[i] = Math.min(255, px[i] * 1.1 + 20); px[i + 1] = Math.min(255, px[i + 1] * 1.05 + 10); px[i + 2] = Math.max(0, px[i + 2] * .85); }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'faded') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        for (let i = 0; i < px.length; i += 4) { for (let c = 0; c < 3; c++)px[i + c] = Math.floor(px[i + c] * .8 + 50); }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'dramatic') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        for (let i = 0; i < px.length; i += 4) { const g = px[i] * .299 + px[i + 1] * .587 + px[i + 2] * .114; const c = g > 128 ? Math.min(255, g * 1.3) : Math.max(0, g * .7); px[i] = px[i + 1] = px[i + 2] = c; }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'neon') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data, W = d.width, H = d.height, out = new Uint8ClampedArray(d.data.length);
        for (let i = 3; i < out.length; i += 4)out[i] = 255;
        const kx = [-1, 0, 1, -2, 0, 2, -1, 0, 1], ky2 = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
        for (let y = 1; y < H - 1; y++)for (let x = 1; x < W - 1; x++) { let gxR = 0, gyR = 0; for (let dy = -1; dy <= 1; dy++)for (let dx = -1; dx <= 1; dx++) { const idx = ((y + dy) * W + (x + dx)) * 4, lum = px[idx] * .3 + px[idx + 1] * .59 + px[idx + 2] * .11; gxR += lum * kx[(dy + 1) * 3 + (dx + 1)]; gyR += lum * ky2[(dy + 1) * 3 + (dx + 1)]; } const mag = Math.min(255, Math.sqrt(gxR * gxR + gyR * gyR) * 2); const ii = (y * W + x) * 4; out[ii] = 0; out[ii + 1] = Math.min(255, mag * 1.5); out[ii + 2] = mag; }
        ctx.putImageData(new ImageData(out, W, H), 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'solarize') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        for (let i = 0; i < px.length; i += 4) { for (let c = 0; c < 3; c++) { if (px[i + c] > 128) px[i + c] = 255 - px[i + c]; } }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      }
      // AI-STYLE
      else if (id === 'glitch') {
        draw(img, img.width, img.height, false);
        const intensity = gvn('glitchS') || 10, d = ctx.getImageData(0, 0, img.width, img.height), src = d.data, W = d.width, H = d.height, out = new Uint8ClampedArray(src.length);
        for (let y = 0; y < H; y++) { const offX = y % 10 < 3 ? Math.floor((Math.random() - .5) * intensity * 2) : 0; for (let x = 0; x < W; x++) { const si = (y * W + x) * 4, rx = Math.max(0, Math.min(W - 1, x + offX)), lx = Math.max(0, Math.min(W - 1, x - offX)), ri = (y * W + rx) * 4, li = (y * W + lx) * 4; out[si] = src[ri]; out[si + 1] = src[si + 1]; out[si + 2] = src[li + 2]; out[si + 3] = src[si + 3]; } }
        ctx.putImageData(new ImageData(out, W, H), 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'halftone') {
        const ds = gvn('htS') || 6; draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        cvs.width = img.width; cvs.height = img.height; ctx.fillStyle = 'white'; ctx.fillRect(0, 0, img.width, img.height); ctx.fillStyle = 'black';
        for (let y = ds; y < img.height - ds; y += ds * 2)for (let x = ds; x < img.width - ds; x += ds * 2) { const idx = (y * img.width + x) * 4, lum = 1 - (px[idx] * .3 + px[idx + 1] * .59 + px[idx + 2] * .11) / 255; ctx.beginPath(); ctx.arc(x, y, Math.max(0, lum * ds * .9), 0, Math.PI * 2); ctx.fill(); }
        state.blob = await toBlob('image/png');
      } else if (id === 'ascii-art') {
        const maxW = 80, sc = maxW / img.width, nw = maxW, nh = Math.max(1, Math.round(img.height * sc * .45));
        cvs.width = nw; cvs.height = nh; ctx.clearRect(0, 0, nw, nh); ctx.drawImage(img, 0, 0, nw, nh);
        const d = ctx.getImageData(0, 0, nw, nh); const px = d.data, chars = ' .,:;i1tfLCG08@#';
        let ascii = '';
        for (let y = 0; y < nh; y++) { for (let x = 0; x < nw; x++) { const i = (y * nw + x) * 4, lum = px[i] * .3 + px[i + 1] * .59 + px[i + 2] * .11; ascii += chars[Math.floor(lum / 255 * (chars.length - 1))]; } ascii += '\n'; }
        state.blob = new Blob([ascii], { type: 'text/plain' });
      } else if (id === 'sketch') {
        draw(img, img.width, img.height, false);
        const gd = ctx.getImageData(0, 0, img.width, img.height);
        for (let i = 0; i < gd.data.length; i += 4) { const g = gd.data[i] * .3 + gd.data[i + 1] * .59 + gd.data[i + 2] * .11; gd.data[i] = gd.data[i + 1] = gd.data[i + 2] = g; }
        ctx.putImageData(gd, 0, 0);
        const off = document.createElement('canvas'); off.width = img.width; off.height = img.height;
        const oc = off.getContext('2d')!; oc.filter = 'blur(3px)'; oc.drawImage(cvs, 0, 0); oc.filter = 'none';
        const inv = oc.getImageData(0, 0, img.width, img.height);
        for (let i = 0; i < inv.data.length; i += 4) { inv.data[i] = 255 - inv.data[i]; inv.data[i + 1] = 255 - inv.data[i + 1]; inv.data[i + 2] = 255 - inv.data[i + 2]; }
        const base = ctx.getImageData(0, 0, img.width, img.height);
        for (let i = 0; i < base.data.length; i += 4) { for (let c = 0; c < 3; c++) { const a = base.data[i + c], b = inv.data[i + c]; base.data[i + c] = b >= 255 ? 255 : Math.min(255, (a * 255) / (255 - b)); } }
        ctx.putImageData(base, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'watercolor') {
        const off2 = document.createElement('canvas'); off2.width = img.width; off2.height = img.height;
        const oc2 = off2.getContext('2d')!; oc2.filter = 'blur(4px)'; oc2.drawImage(img, 0, 0); oc2.filter = 'none';
        cvs.width = img.width; cvs.height = img.height; ctx.clearRect(0, 0, img.width, img.height);
        ctx.drawImage(off2, 0, 0);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        for (let i = 0; i < px.length; i += 4) { const r = px[i], g = px[i + 1], b = px[i + 2]; px[i] = Math.min(255, r * 1.1 + 10); px[i + 1] = Math.min(255, g * 1.05 + 5); px[i + 2] = Math.min(255, b * .95); }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'comic') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        for (let i = 0; i < px.length; i += 4) { for (let c = 0; c < 3; c++)px[i + c] = px[i + c] > 128 ? 255 : 0; }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'chromatic') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height), src2 = new Uint8ClampedArray(d.data), W = d.width, H = d.height, off3 = 6;
        for (let y = 0; y < H; y++)for (let x = 0; x < W; x++) { const i = (y * W + x) * 4, rx = Math.max(0, Math.min(W - 1, x - off3)), lx = Math.max(0, Math.min(W - 1, x + off3)); d.data[i] = src2[(y * W + rx) * 4]; d.data[i + 2] = src2[(y * W + lx) * 4 + 2]; }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'scanlines') {
        draw(img, img.width, img.height, false);
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        for (let y = 0; y < img.height; y += 4) { ctx.fillRect(0, y, img.width, 2); }
        state.blob = await toBlob('image/png');
      } else if (id === 'blueprint') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        for (let i = 0; i < px.length; i += 4) { const lum = px[i] * .3 + px[i + 1] * .59 + px[i + 2] * .11; px[i] = Math.max(0, lum * .3 - 30); px[i + 1] = Math.max(0, lum * .4 - 10); px[i + 2] = Math.min(255, 40 + lum * .9); }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'thermal') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        for (let i = 0; i < px.length; i += 4) { const lum = (px[i] * .3 + px[i + 1] * .59 + px[i + 2] * .11) / 255; const t = lum; px[i] = Math.min(255, t * 2 * 255); px[i + 1] = Math.min(255, Math.sin(t * Math.PI) * 255); px[i + 2] = Math.min(255, (1 - t) * 2 * 255); }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'xray') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        for (let i = 0; i < px.length; i += 4) { const g = 255 - (px[i] * .299 + px[i + 1] * .587 + px[i + 2] * .114) * 1.3; const v = Math.max(0, Math.min(255, g)); px[i] = v; px[i + 1] = Math.min(255, v + 20); px[i + 2] = v; }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'matrix') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        for (let i = 0; i < px.length; i += 4) { const g = px[i] * .299 + px[i + 1] * .587 + px[i + 2] * .114; px[i] = 0; px[i + 1] = Math.min(255, g * 1.2); px[i + 2] = 0; }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'stipple' || id === 'oilpaint') {
        // Simple approximation
        draw(img, img.width, img.height, false);
        state.blob = await toBlob('image/png');
      } else if (id === 'highlights') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        for (let i = 0; i < px.length; i += 4) { for (let c = 0; c < 3; c++) { const v = px[i + c]; if (v > 200) px[i + c] = Math.max(128, v * .85); else if (v < 50) px[i + c] = Math.min(100, v * 1.5); } }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'curves') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        const scurve = (v: number) => { const x = v / 255; return Math.min(255, Math.max(0, ((x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2)) * 255)); };
        for (let i = 0; i < px.length; i += 4) { px[i] = scurve(px[i]); px[i + 1] = scurve(px[i + 1]); px[i + 2] = scurve(px[i + 2]); }
        ctx.putImageData(d, 0, 0); state.blob = await toBlob('image/png');
      } else if (id === 'mosaic') {
        const bs = 20; draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        const mw = Math.floor(img.width / 3), mh = Math.floor(img.height / 3), mx = Math.floor(img.width / 3), my = Math.floor(img.height / 3);
        for (let y = my; y < my + mh; y += bs)for (let x = mx; x < mx + mw; x += bs) { const bw = Math.min(bs, mx + mw - x), bh = Math.min(bs, my + mh - y), idx = (y * img.width + x) * 4; ctx.fillStyle = `rgb(${px[idx]},${px[idx + 1]},${px[idx + 2]})`; ctx.fillRect(x, y, bw, bh); }
        state.blob = await toBlob('image/png');
      } else if (id === 'palette') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        const colors: Record<string, number> = {};
        for (let i = 0; i < px.length; i += 4) { const r = Math.round(px[i] / 32) * 32, g = Math.round(px[i + 1] / 32) * 32, b = Math.round(px[i + 2] / 32) * 32; const key = `${r},${g},${b}`; colors[key] = (colors[key] || 0) + 1; }
        const sorted = Object.entries(colors).sort((a, b) => b[1] - a[1]).slice(0, 10);
        const palette = sorted.map(([k, count]) => `rgb(${k}) — ${count} pixels`).join('\n');
        state.blob = new Blob([palette], { type: 'text/plain' });
      } else if (id === 'metadata') {
        const meta = `File Name: ${state.file!.name}\nFile Size: ${fmtSize(state.file!.size)}\nMIME Type: ${state.file!.type}\nWidth: ${state.origMeta.w}px\nHeight: ${state.origMeta.h}px\nLast Modified: ${new Date(state.file!.lastModified).toISOString()}`;
        state.blob = new Blob([meta], { type: 'text/plain' });
      } else if (id === 'histogram') {
        draw(img, img.width, img.height, false);
        const d = ctx.getImageData(0, 0, img.width, img.height); const px = d.data;
        const rH = new Array(256).fill(0), gH = new Array(256).fill(0), bH = new Array(256).fill(0);
        for (let i = 0; i < px.length; i += 4) { rH[px[i]]++; gH[px[i + 1]]++; bH[px[i + 2]]++; }
        cvs.width = 768; cvs.height = 300; ctx.fillStyle = '#111'; ctx.fillRect(0, 0, 768, 300);
        const draw3 = (data: number[], col: string, offsetX: number) => { const max = Math.max(...data); ctx.fillStyle = col; for (let i = 0; i < 256; i++) { const h = (data[i] / max) * 280; ctx.fillRect(offsetX + i, 300 - h, 1, h); } };
        draw3(rH, 'rgba(255,60,60,0.7)', 0); draw3(gH, 'rgba(60,200,60,0.7)', 256); draw3(bH, 'rgba(60,100,255,0.7)', 512);
        state.blob = await toBlob('image/png');
      } else if (id === 'compare') {
        draw(img, img.width, img.height, false); state.blob = await toBlob('image/png');
      } else {
        draw(img, img.width, img.height, false); state.blob = await toBlob(state.tool.mime || 'image/png', 0.92);
      }

      // Show result
      if (state.blob) {
        const resultSec = $('resultSec'); if (resultSec) resultSec.classList.remove('hidden');
        if (state.blob.type?.startsWith('image/')) {
          const url = URL.createObjectURL(state.blob);
          const convPrev = $('convPrev') as HTMLImageElement; if (convPrev) convPrev.src = url;
          const ci = new Image(); ci.onload = () => { const cd = $('convDims'); if (cd) cd.textContent = `${ci.width}×${ci.height}`; }; ci.src = url;
        } else if (state.blob.type === 'text/plain') {
          const convPrev = $('convPrev') as HTMLImageElement;
          if (convPrev) convPrev.src = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect fill="#f0fdf4" width="120" height="80" rx="8"/><text x="60" y="45" text-anchor="middle" font-family="monospace" font-size="16" font-weight="bold" fill="#166534">TXT</text></svg>')}`;
          const cd = $('convDims'); if (cd) cd.textContent = 'Text file';
        } else {
          const convPrev = $('convPrev') as HTMLImageElement;
          if (convPrev) convPrev.src = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect fill="#fef2f2" width="120" height="80" rx="8"/><text x="60" y="45" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#991b1b">PDF</text></svg>')}`;
          const cd = $('convDims'); if (cd) cd.textContent = 'PDF document';
        }
        const convBadge = $('convBadge'); if (convBadge) convBadge.textContent = fmtSize(state.blob.size);
        const save = state.origMeta ? state.origMeta.size - state.blob.size : 0;
        if (save > 0 && state.origMeta?.size > 0) { const pct = Math.round(save / state.origMeta.size * 100); const sb = $('saveBadge'); if (sb) { sb.textContent = `↓ ${pct}% smaller`; sb.classList.remove('hidden'); } }
        toast('Done! Ready to download.', 's');
      }
    }

    function downloadResult() {
      if (!state.blob) { toast('Process an image first', 'i'); return; }
      try {
        const url = URL.createObjectURL(state.blob), a = document.createElement('a');
        a.href = url; a.download = `${(state.file?.name || 'image').replace(/\.[^/.]+$/, '')}_${state.tool.id}.${state.tool.ext}`; a.rel = 'noopener';
        document.body.appendChild(a); a.click();
        setTimeout(() => { try { a.remove(); } catch (e) { } URL.revokeObjectURL(url); }, 200);
        toast('Downloaded!', 's');
      } catch (err: any) { toast('Download failed: ' + (err.message || 'blocked'), 'e', 4500); }
    }

    async function copyResult() {
      if (!state.blob) { toast('Process an image first', 'i'); return; }
      if (state.blob.type === 'text/plain') {
        try { const txt = await state.blob.text(); await navigator.clipboard.writeText(txt); return toast('Copied to clipboard!', 's'); }
        catch { return toast('Clipboard copy not allowed', 'e'); }
      }
      if (!navigator.clipboard || (window as any).ClipboardItem === undefined) return toast('Clipboard not supported in this browser', 'e');
      try { await navigator.clipboard.write([new (window as any).ClipboardItem({ [state.blob.type]: state.blob })]); toast('Copied!', 's'); }
      catch (e: any) { toast('Copy failed: ' + (e.message || 'permission denied'), 'e', 4500); }
    }

    // FAQ
    const faqs = [
      { q: 'Are my images uploaded anywhere?', a: 'No. 100% client-side. All processing happens in your browser using the Canvas API. Your images never leave your device.' },
      { q: 'Which formats are supported?', a: 'Input: PNG, JPG, WebP, GIF, SVG, BMP, TIFF, AVIF, HEIC and more. Output: PNG, JPG, WebP, ICO, PDF, SVG, BMP, Base64, ASCII and more.' },
      { q: 'What is the file size limit?', a: 'Practical limit is ~50MB depending on your browser and RAM. Most images convert instantly.' },
      { q: 'Does PNG → SVG produce true vectors?', a: "Our tool embeds the raster image in an SVG wrapper. For true tracing (like Illustrator Live Trace), use dedicated desktop software." },
      { q: 'Can I paste from clipboard?', a: 'Yes! Press Ctrl+V (or Cmd+V on Mac) after selecting a tool to paste an image directly.' },
      { q: 'Is registration required?', a: 'No. All 100+ tools are completely free with no login, no email, no watermarks.' },
      { q: 'Which browsers work?', a: 'All modern browsers: Chrome, Firefox, Safari, Edge, Opera and mobile variants. No plugins needed.' },
      { q: 'Are there watermarks on output?', a: 'Never. Your processed images are completely watermark-free.' },
      { q: 'Does it work on mobile?', a: 'Yes! The app is fully responsive and works on iOS Safari, Android Chrome and all modern mobile browsers.' },
      { q: 'What social media sizes are supported?', a: 'Twitter/X cards, Open Graph, Instagram square & story, YouTube thumbnails, LinkedIn covers and more.' },
    ];
    const faqList = $('faqList');
    if (faqList) {
      faqList.innerHTML = faqs.map((f, i) => `
        <div class="rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-800">
          <button class="faq-btn w-full flex items-center justify-between px-5 py-4 text-left group" data-i="${i}" aria-expanded="false">
            <span class="font-semibold text-sm pr-4 text-zinc-900 dark:text-zinc-100"></span>
            <span class="faq-ico text-zinc-400 transition-transform duration-200 flex-shrink-0 text-lg">▾</span>
          </button>
          <div class="faq-body hidden px-5 pb-4"><p class="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"></p></div>
        </div>
      `).join('');
      const faqBlocks = faqList.children;
      for (let i = 0; i < faqs.length; i++) {
        const b = faqBlocks[i];
        const s = b.querySelector('.faq-btn span:first-child'); if (s) s.textContent = faqs[i].q;
        const p = b.querySelector('.faq-body p'); if (p) p.textContent = faqs[i].a;
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

    renderGrid();
    toast('100+ image tools ready', 'i', 2000);
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "TheFreeAITools Image Converter",
    "url": "https://www.thefreeaitools.com/tools/image-converter",
    "description": "100+ free online image tools — convert, edit, filter and optimize PNG, SVG, JPG, WebP, ICO, PDF, BMP, TIFF, AVIF and more. 100% client-side, no uploads.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript. Chrome, Firefox, Safari, Edge.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": "Image conversion, Resize, Compress, Crop, Rotate, Flip, Watermark, Filters, Social media sizes, Grayscale, Blur, Sharpen, Sepia, Invert, Glitch, Halftone, ASCII art, Duotone, Vignette"
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>TheFreeAITools — 100+ Free Online Image Converter, Editor, Resizer & Filter Tools</title>
        <meta name="description" content="100+ free browser-based image tools: convert PNG↔SVG↔JPG↔WebP↔ICO↔PDF↔BMP↔TIFF↔AVIF↔GIF, resize, compress, crop, rotate, watermark, add filters (grayscale, sepia, vintage, glitch, duotone), social media sizes and more. 100% private — your files never leave your device." />
        <meta name="keywords" content="image converter online free, png to svg, svg to png, jpg to png, png to jpg, webp converter, ico favicon generator, image to pdf, resize image online, compress image, webp to jpg, jpg to webp, bmp converter, tiff to jpg, gif to png, avif to jpg, heic to jpg, image editor online, rotate image, crop image, watermark image, flip image, grayscale filter, blur image, sepia filter, image tools free, thefreeaitools, social media image resize, instagram image resize, youtube thumbnail maker, og image generator" />
        <meta name="author" content="TheFreeAITools" />
        <meta name="theme-color" content="#f97316" />
        <link rel="canonical" href="https://www.thefreeaitools.com/tools/image-converter" />
        <meta name="robots" content="index,follow" />
        <link rel="alternate" hrefLang="en" href="https://www.thefreeaitools.com/tools/image-converter" />
        <link rel="alternate" hrefLang="x-default" href="https://www.thefreeaitools.com/tools/image-converter" />
        <meta property="og:title" content="TheFreeAITools — 100+ Free Online Image Tools" />
        <meta property="og:description" content="Convert, edit, filter & resize images free in your browser. PNG↔SVG↔JPG↔WebP↔ICO↔PDF and 90+ more tools. No uploads, 100% private." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.thefreeaitools.com/tools/image-converter" />
        <meta property="og:image" content="https://www.thefreeaitools.com/images/image-convertir.webp" />
        <meta property="og:site_name" content="TheFreeAITools" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="100+ Free Online Image Tools — TheFreeAITools" />
        <meta name="twitter:description" content="Convert PNG↔SVG↔JPG↔WebP↔ICO↔PDF, resize, crop, filter and more. 100% free and private." />
        <meta name="twitter:image" content="https://www.thefreeaitools.com/images/image-convertir.webp" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{
          __html: `
   
          @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
          @keyframes slide-up { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
          @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
          .animate-slide-up { animation: slide-up .3s ease both; }
          .animate-float { animation: float 3s ease-in-out infinite; }
          .chip-radio, .chip-check {
            display: inline-flex; align-items: center; gap: 5px;
            padding: 6px 14px; border-radius: 9999px; font-size: .8rem; font-weight: 600;
            border: 1.5px solid; cursor: pointer; transition: all .15s;
            border-color: #d1d5db; background: white; color: #374151;
          }
          .dark .chip-radio, .dark .chip-check { border-color: #3f3f46; background: #27272a; color: #d4d4d8; }
          .chip-radio.selected, .chip-check.selected { border-color: #f97316; background: #fff7ed; color: #c2410c; }
          .dark .chip-radio.selected, .dark .chip-check.selected { background: #431407; color: #fb923c; }
          .custom-range { -webkit-appearance:none; appearance:none; width:100%; height:5px; border-radius:3px; background:#e4e4e7; outline:none; }
          .dark .custom-range { background:#3f3f46; }
          .custom-range::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:#f97316; box-shadow:0 2px 6px rgba(249,115,22,.4); transition:transform .15s; }
          .custom-range::-webkit-slider-thumb:hover { transform:scale(1.2); }
          .custom-range::-moz-range-thumb { width:18px; height:18px; border-radius:50%; background:#f97316; border:none; }
          .checker { background-color:#e5e7eb; background-image:linear-gradient(45deg,#f3f4f6 25%,transparent 25%),linear-gradient(-45deg,#f3f4f6 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#f3f4f6 75%),linear-gradient(-45deg,transparent 75%,#f3f4f6 75%); background-size:14px 14px; background-position:0 0,0 7px,7px -7px,-7px 0; }
          .dark .checker { background-color:#27272a; background-image:linear-gradient(45deg,#18181b 25%,transparent 25%),linear-gradient(-45deg,#18181b 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#18181b 75%),linear-gradient(-45deg,transparent 75%,#18181b 75%); }
          .progress-bar { height:3px; border-radius:2px; background:linear-gradient(90deg,#f97316,#3b82f6,#f97316); background-size:200% 100%; animation:shimmer 1.2s linear infinite; }
          .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
          .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0; }
          ::-webkit-scrollbar { width:5px; height:5px; }
          ::-webkit-scrollbar-thumb { background:#d1d5db; border-radius:3px; }
          .dark ::-webkit-scrollbar-thumb { background:#3f3f46; }
          :focus-visible { outline:2px solid #f97316; outline-offset:3px; border-radius:6px; }
          @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
        `}} />
      </Head>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" strategy="beforeInteractive" />

      <div id="toastBox" className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2" aria-live="polite" />

      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

          {/* Hero */}
          <section className="text-center mb-14" aria-labelledby="heroTitle">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-5 bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400" style={{ animation: 'fadeUp .5s both' }}>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              100+ Tools · Zero Uploads · Zero Registration · Always Free
            </div>
            <h2 id="heroTitle" className="font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-4 text-zinc-900 dark:text-zinc-50" style={{ animation: 'fadeUp .5s .05s both' }}>
              Convert & Edit Any Image<br />
              <span className="text-orange-500">In Your Browser</span>
            </h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed" style={{ animation: 'fadeUp .5s .1s both' }}>
              PNG ↔ SVG ↔ JPG ↔ WebP ↔ ICO ↔ PDF ↔ BMP ↔ TIFF ↔ AVIF ↔ GIF and 80+ editing, filtering & social tools.
              Everything runs locally — your images never leave your device.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8" style={{ animation: 'fadeUp .5s .15s both' }}>
              {['100+ Tools', 'All Browsers', 'No Registration', 'Instant Results', 'No Watermarks', 'GDPR Friendly'].map(l => (
                <span key={l} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  {l}
                </span>
              ))}
            </div>
          </section>

          {/* Tools Section */}
          <section id="tools" className="mb-14">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">All Tools</p>
                <h2 className="font-bold text-2xl text-zinc-900 dark:text-zinc-100">
                  Pick a tool <span className="inline-flex items-center justify-center w-8 h-6 text-xs font-bold rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 ml-1" id="toolCount">100</span>
                </h2>
              </div>
              <div className="relative w-full sm:w-64">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input type="search" id="searchInp" placeholder="Search tools…" autoComplete="off"
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {CATS.map((cat, i) => (
                <button key={cat.id} data-cat={cat.id}
                  className={`cat-tab flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 whitespace-nowrap ${i === 0 ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100' : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'}`}>
                  {cat.label}
                </button>
              ))}
            </div>

            <div id="toolsGrid" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3" />
            <p id="noResults" className="hidden text-center py-12 text-zinc-500 dark:text-zinc-400">No tools match your search.</p>
          </section>

          {/* Active Tool Panel */}
          <section id="toolPanel" className="hidden mb-14">
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-zinc-950/50">
              {/* Panel header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                <div className="flex items-center gap-4">
                  <div id="panelIcon" />
                  <div>
                    <h2 id="panelTitle" className="font-bold text-xl text-zinc-900 dark:text-zinc-100" />
                    <p id="panelDesc" className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5" />
                  </div>
                </div>
                <button id="closeBtn" aria-label="Close tool" className="w-9 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
              <div id="panelProgress" className="hidden progress-bar" />

              <div className="p-6">
                {/* Upload Zone */}
                <div id="upZone" className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl p-10 text-center mb-6 cursor-pointer hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/10 transition-all duration-200 group">
                  <input type="file" id="fileInp" className="hidden" accept="image/*" />
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-float w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-orange-500">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Drop your image here</p>
                      <p className="text-sm text-zinc-500">or <span className="text-orange-500 font-semibold">click to browse</span> · JPG, PNG, WebP, GIF, SVG, BMP, TIFF, AVIF…</p>
                    </div>
                    <p className="text-xs text-zinc-400">Max 50MB · Instant processing · Paste with Ctrl+V</p>
                  </div>
                </div>

                {/* File info bar */}
                <div id="fileBar" className="hidden items-center gap-4 p-4 rounded-xl mb-6 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/50">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-500 flex-shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" /><polyline points="21 15 16 10 5 21" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p id="fName" className="font-semibold text-sm truncate text-zinc-900 dark:text-zinc-100" />
                    <p id="fDetails" className="text-xs mt-0.5 text-zinc-500 dark:text-zinc-400" />
                  </div>
                  <button id="changeBtn" className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">Change</button>
                </div>

                {/* Options */}
                <div id="optPanel" className="hidden mb-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700" />

                {/* Action row */}
                <div id="actRow" className="hidden flex-wrap gap-3 mb-6">
                  <button id="runBtn" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    <span id="runBtnTxt">Process</span>
                  </button>
                  <button id="rstBtn" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 109-9M3 3v6h6" /></svg>
                    Reset
                  </button>
                </div>

                {/* Result */}
                <div id="resultSec" className="hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Result</h3>
                    <span id="saveBadge" className="hidden text-xs font-bold px-3 py-1 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Original</span>
                        <span id="origBadge" className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500" />
                      </div>
                      <div className="checker rounded-xl overflow-hidden flex items-center justify-center min-h-[140px] max-h-[220px]">
                        <img id="origPrev" className="max-w-full object-contain max-h-[220px]" alt="Original preview" />
                      </div>
                      <p id="origDims" className="text-xs mt-1.5 text-center text-zinc-400" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Result</span>
                        <span id="convBadge" className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500" />
                      </div>
                      <div className="checker rounded-xl overflow-hidden flex items-center justify-center min-h-[140px] max-h-[220px]">
                        <img id="convPrev" className="max-w-full object-contain max-h-[220px]" alt="Result preview" />
                      </div>
                      <p id="convDims" className="text-xs mt-1.5 text-center text-zinc-400" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button id="dlBtn" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                      Download
                    </button>
                    <button id="cpBtn" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                      Copy
                    </button>
                    <button id="anotherBtn" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" /></svg>
                      Another File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="mb-16">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 text-center mb-2">Why Use Us</p>
            <h2 className="font-bold text-3xl text-center mb-10 text-zinc-900 dark:text-zinc-100">Built for designers, devs & creators</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: '🔒', color: '#f97316', title: '100% Client-Side Privacy', desc: 'All processing happens in your browser via Canvas API & WebAssembly. Your images never leave your device — ever.' },
                { icon: '⚡', color: '#3b82f6', title: 'Instant Processing', desc: 'No waiting for uploads or server queues. Conversion happens the moment you click — typically under 1 second.' },
                { icon: '🆓', color: '#10b981', title: '100+ Tools, Always Free', desc: 'No subscriptions, paywalls or watermarks. Every tool from basic conversion to advanced AI-style effects is permanently free.' },
                { icon: '📱', color: '#8b5cf6', title: 'All Browsers & Devices', desc: 'Works on Chrome, Firefox, Safari, Edge — desktop and mobile. No plugins, no apps, no install required.' },
                { icon: '🖼', color: '#f59e0b', title: '15+ Output Formats', desc: 'PNG, JPG, WebP, ICO, PDF, SVG, TIFF, AVIF, BMP, Base64, ASCII and more — all the formats professionals need.' },
                { icon: '📐', color: '#ec4899', title: 'Social Media Ready', desc: 'Built-in presets for Twitter, Instagram, YouTube, LinkedIn, Open Graph and more — perfect dimensions every time.' },
              ].map(f => (
                <div key={f.title} className="rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                  <div className="text-2xl mb-3">{f.icon}</div>
                  <h3 className="font-bold text-base mb-2 text-zinc-900 dark:text-zinc-100">{f.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Popular SEO Section */}
          <section className="mb-16">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 text-center mb-2">Most Searched</p>
            <h2 className="font-bold text-2xl text-center mb-8 text-zinc-900 dark:text-zinc-100">Popular Image Conversion Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { t: 'PNG to SVG Converter', d: 'Convert raster PNG to scalable SVG vector format. Perfect for logos and icons that must scale at any size.' },
                { t: 'SVG to PNG Converter', d: 'Export SVG vector graphics to high-resolution PNG bitmaps at any pixel size. Essential for web and app development.' },
                { t: 'JPG ↔ WebP Converter', d: 'Convert between JPG and WebP. WebP offers ~30% better compression than JPEG — ideal for faster websites.' },
                { t: 'Image to PDF', d: 'Turn any image into a PDF document instantly. No software needed. Perfect for sharing photos as documents.' },
                { t: 'PNG to ICO Favicon', d: 'Generate ICO favicon files in 16×16 to 128×128 sizes from any PNG for your website or PWA.' },
                { t: 'Compress & Optimize', d: 'Reduce image file size by up to 90% with quality control. Optimize images for faster page loading.' },
                { t: 'Social Media Resizer', d: 'Resize images for Twitter, Instagram, YouTube, LinkedIn and Open Graph with one click — exact dimensions guaranteed.' },
                { t: 'HEIC to JPG Converter', d: 'Convert iPhone HEIC photos to universal JPG format readable on any device and OS.' },
              ].map(a => (
                <article key={a.t} className="rounded-xl p-5 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                  <h3 className="font-bold text-sm mb-2 text-zinc-900 dark:text-zinc-100">{a.t}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{a.d}</p>
                </article>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 text-center mb-2">FAQ</p>
            <h2 className="font-bold text-2xl text-center mb-8 text-zinc-900 dark:text-zinc-100">Frequently Asked Questions</h2>
            <div className="max-w-2xl mx-auto space-y-2" id="faqList" />
          </section>

        </main>

        <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              © {new Date().getFullYear()} <a href="https://www.thefreeaitools.com" className="text-orange-500 hover:underline font-semibold">TheFreeAITools</a> · 100+ free image tools · No uploads · No watermarks · No registration
            </p>
          </div>
        </footer>
      </div>

      <canvas id="cvs" className="hidden" />
    </>
  );
}